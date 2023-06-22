import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { TokenType, UserJwtPayload, AuthResult } from './auth';
import SignupDTO from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { addDurationFromNow } from 'src/common/utils/date-time.utils';

// Access token duration: 3 days
export const ACCESS_TOKEN_DURATION = '3d';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
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
   * Signs up a user
   *
   * @param payload The user signup payload
   * @returns The authentication result
   */
  async signup(payload: SignupDTO): Promise<AuthResult> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
    const user = await this.prisma.user.create({
      data: {
        firstName: payload.firstName,
        lastName: payload.lastName,
        username: payload.username,
        email: payload.email,
        password: hashedPassword,
      },
    });
    const jwtPayload = {
      sub: user.id,
      username: user.username,
    };
    const accessToken = await this.generateToken('ACCESS', jwtPayload);
    const refreshToken = await this.generateToken('REFRESH', jwtPayload);
    return {
      user,
      accessToken,
      expiresAt: addDurationFromNow(ACCESS_TOKEN_DURATION),
      refreshToken,
    };
  }

  /**
   * Signs in a user by email and password
   */
  async signin(email: string, password: string): Promise<AuthResult> {
    // const user = await this.userModel.findOne({ email });
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException(
        'The email address or the password is wrong',
      );
    }
    const jwtPayload = {
      sub: user.id,
      username: user.username,
    };
    const accessToken = await this.generateToken('ACCESS', jwtPayload);
    const refreshToken = await this.generateToken('REFRESH', jwtPayload);
    return {
      user,
      accessToken,
      expiresAt: addDurationFromNow(ACCESS_TOKEN_DURATION),
      refreshToken,
    };
  }
}
