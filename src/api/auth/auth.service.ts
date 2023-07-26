import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import type {
  TokenType,
  UserJwtPayload,
  AuthResult,
  AccessToken,
} from './auth';
import { SignupDTO } from './dto';
import { addDurationFromNow } from 'src/common/utils/date-time.utils';
import { User, UserDocument, UserModel } from '../user/schema';
import { UserService } from '../user/user.service';
import { UserRole } from '../user/user.constants';
import { CityService } from '../city/city.service';

// Access token duration: 3 days
export const ACCESS_TOKEN_DURATION = '3d';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private userService: UserService,
    private cityService: CityService,
    private config: ConfigService,
    private jwtService: JwtService,
  ) {}

  /**
   * Generates an ACCESS or REFRESH token
   *
   * @param tokenType The token type
   * @param payload The user's JWT payload
   * @return The generated token
   */
  async generateToken(tokenType: TokenType, payload: UserJwtPayload) {
    const secretEnvKey = `${tokenType}_TOKEN_SECRET_KEY`;
    const secret = this.config.get<string>(secretEnvKey);
    // A refresh token does not have an expiration date whereas an access token does
    const options: JwtSignOptions =
      tokenType === 'ACCESS' ? { expiresIn: '3d' } : undefined;
    return this.jwtService.signAsync(payload, {
      secret,
      ...options,
    });
  }

  /**
   * Refreshes an access token
   *
   * @param user The authenticated user whose access token is to be refreshed
   */
  async refreshToken(authUser: UserDocument): Promise<AccessToken> {
    const jwtPayload: UserJwtPayload = {
      sub: authUser.id,
    };
    const accessToken = await this.generateToken('ACCESS', jwtPayload);
    return {
      access_token: accessToken,
      expires_at: addDurationFromNow(ACCESS_TOKEN_DURATION),
    };
  }

  /**
   * Signs up a user
   *
   * @param payload The user signup payload
   * @returns The authentication result
   */
  async signup(payload: SignupDTO): Promise<AuthResult> {
    // Hashing the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

    // Generating a unique username if not username was provided
    const username =
      payload.username ??
      (await this.userService.getUniqueUsername(
        payload.firstName,
        payload.lastName,
      ));

    // The user creation data
    const data: User = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: username,
      email: payload.email,
      password: hashedPassword,
      roles: [UserRole.Basic],
    };
    // Setting an optional phone number
    payload.phone && (data.phone = payload.phone);
    // Setting an optional city
    if (payload.cityId) {
      data.city = await this.cityService.toEmbeddedCityFromId(payload.cityId);
    }

    const user = await this.userModel.create(data);

    // Tokens generation
    const jwtPayload = {
      sub: user.id,
    };
    const accessToken = await this.generateToken('ACCESS', jwtPayload);
    const refreshToken = await this.generateToken('REFRESH', jwtPayload);

    return {
      access_token: accessToken,
      expires_at: addDurationFromNow(ACCESS_TOKEN_DURATION),
      refresh_token: refreshToken,
    };
  }

  /**
   * Signs in a user by an identifier field (ie: email or phone number) and password
   */
  async signin(identifier: string, password: string): Promise<AuthResult> {
    const user = await this.userModel.findOne({
      $or: [{ phone: identifier }, { email: identifier }],
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException(
        'The email address or phone number or the password is wrong',
      );
    }
    const jwtPayload = {
      sub: user.id,
    };
    const accessToken = await this.generateToken('ACCESS', jwtPayload);
    const refreshToken = await this.generateToken('REFRESH', jwtPayload);
    return {
      access_token: accessToken,
      expires_at: addDurationFromNow(ACCESS_TOKEN_DURATION),
      refresh_token: refreshToken,
    };
  }

  /**
   * Deletes an authenticated user's account
   *
   * @param authUser The authenticated whose user account is to be deleted
   */
  async deleteAccount(authUser: UserDocument) {
    return this.userService.delete(authUser);
  }
}
