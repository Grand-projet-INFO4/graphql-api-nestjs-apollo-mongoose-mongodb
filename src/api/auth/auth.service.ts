import {
  ForbiddenException,
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import type {
  TokenType,
  UserJwtPayload,
  AuthResult,
  AccessToken,
  ReqAuthUser,
  SanitizedAuthUser,
  SanitizedUser,
  SanitizedCooperativeAdmin,
} from './auth';
import { SignupDTO } from './dto';
import { addDurationFromNow } from 'src/common/utils/date-time.utils';
import { User, UserDocument, UserModel } from '../user/schema';
import { UserService } from '../user/user.service';
import { COOPERATIVE_USER_ROLES, UserRole } from '../user/user.constants';
import { CityService } from '../city/city.service';
import { RedisClientInstance } from 'src/redis/redis';
import {
  CooperativeAdmin,
  CooperativeAdminModel,
} from '../cooperative-admin/schema';

// Access token duration: 3 days
export const ACCESS_TOKEN_DURATION = 15 * 60; // 15 minutes

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: UserModel,
    private userService: UserService,
    @InjectModel(CooperativeAdmin.name)
    private cooperativeAdminModel: CooperativeAdminModel,
    private cityService: CityService,
    private config: ConfigService,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientInstance,
  ) {}

  /**
   * Gets the redis key for the set of the refresh tokens cache of an authenticated user
   *
   * @param user The id of the authenticated user
   */
  private getUserRefreshTokensRedisKey(userId: string) {
    return `user:${userId}-refresh-token`;
  }

  /**
   * Adds a refresh token to a user's refresh tokens cache in
   *
   * @param userId The id of the user that owns the refresh token
   */
  private async addUserRefreshToken(userId: string, refreshToken: string) {
    await this.redisClient.sAdd(
      this.getUserRefreshTokensRedisKey(userId),
      refreshToken,
    );
  }

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
    const token = await this.jwtService.signAsync(payload, {
      secret,
      ...options,
    });

    // Adding the refresh token to the redis cache for the authenticated user if this is REFRESH token
    if (tokenType === 'REFRESH') {
      await this.addUserRefreshToken(payload.sub, token);
    }

    return token;
  }

  /**
   * Gets the authenticated user data that should be attached to requests
   *
   * @param id The user id
   */
  async getAuthUser(id: Types.ObjectId | string): Promise<ReqAuthUser> {
    const user = await this.userModel.findById(id).lean();
    if (!user) {
      throw new NotFoundException('The authenticated user does not exist');
    }
    const cooperativeUserRole = user.roles.find((role) => {
      return COOPERATIVE_USER_ROLES.includes(role);
    });
    if (cooperativeUserRole) {
      const cooperativeAdminAccounts = await this.cooperativeAdminModel
        .find({
          user: user._id,
        })
        .lean();
      switch (cooperativeUserRole) {
        case UserRole.Manager: {
          const authUser = {
            ...user,
            cooperativeRole: UserRole.Manager,
            coopManagerAccounts: cooperativeAdminAccounts,
          } as ReqAuthUser;
          return authUser;
        }
        case UserRole.Regulator: {
          const authUser = {
            ...user,
            cooperativeRole: UserRole.Regulator,
            coopRegulatorAccount: cooperativeAdminAccounts[0],
          } as ReqAuthUser;
          return authUser;
        }
        case UserRole.Driver: {
          const authUser = {
            ...user,
            cooperativeRole: UserRole.Driver,
            coopDriverAccount: cooperativeAdminAccounts[0],
          } as ReqAuthUser;
          return authUser;
        }
      }
    }
    const authUser = {
      ...user,
      cooperativeRole: 'none',
    } as ReqAuthUser;
    return authUser;
  }

  /**
   * Sanitized auth user data to be sent on the client
   */
  sanitizeAuthUser(authUser: ReqAuthUser): SanitizedAuthUser {
    const sanitizedUser: SanitizedUser = {
      id: authUser.id,
      firstName: authUser.firstName,
      lastName: authUser.lastName,
      username: authUser.username,
      email: authUser.email,
      roles: authUser.roles,
    };
    authUser.phone && (sanitizedUser.phone = authUser.phone);
    if (authUser.city) {
      const { city } = authUser;
      sanitizedUser.city = {
        id: city.id,
        cityName: city.cityName,
        region: {
          id: city.region.id,
          regionName: city.region.regionName,
          province: city.region.province,
        },
      };
    }
    if (authUser.photo) {
      sanitizedUser.photo = this.userService.getPhotoURL(authUser.photo);
    }
    switch (authUser.cooperativeRole) {
      case UserRole.Manager: {
        const sanitizedAuthUser = {
          ...sanitizedUser,
          cooperativeRole: UserRole.Manager,
          coopManagerAccounts: authUser.coopManagerAccounts.map((account) => {
            return { ...account, id: account.id } as SanitizedCooperativeAdmin;
          }),
        } as SanitizedAuthUser;
        return sanitizedAuthUser;
      }
      case UserRole.Driver:
      case UserRole.Regulator: {
        const account =
          authUser.cooperativeRole === UserRole.Driver
            ? authUser.coopDriverAccount
            : authUser.coopRegulatorAccount;
        const accountTypeKey =
          authUser.cooperativeRole === UserRole.Driver
            ? 'coopDriverAccount'
            : 'coopRegulatorAccount';
        const sanitizedAuthUser = {
          ...sanitizedUser,
          cooperativeRole: authUser.cooperativeRole,
          [accountTypeKey]: {
            ...account,
            id: account.id,
          } as SanitizedCooperativeAdmin,
        } as SanitizedAuthUser;
        return sanitizedAuthUser;
      }
      default: {
        const sanitizedAuthUser = {
          ...sanitizedUser,
          cooperativeRole: 'none',
        } as SanitizedAuthUser;
        return sanitizedAuthUser;
      }
    }
  }

  /**
   * Checks the validity of a refresh token
   *
   * @param token The refresh token
   */
  async isValidUserRefreshToken(
    token: string,
    user: UserDocument,
  ): Promise<boolean> {
    return this.redisClient.sIsMember(
      this.getUserRefreshTokensRedisKey(user.id),
      token,
    );
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
      data.city = await this.cityService.getOne(payload.cityId);
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
   * Removes a provided refresh token of a user from the user's refresh tokens cache in Redis
   *
   * @param token The refresh token
   * @param user The user who owns of the refresh token
   */
  async removeUserRefreshToken(token: string, user: UserDocument) {
    const key = this.getUserRefreshTokensRedisKey(user.id);

    // Making sure that the refresh token belongs to the user
    if (!(await this.redisClient.sIsMember(key, token))) {
      throw new ForbiddenException(
        'Removing a refresh token that does not belong to a user is not allowed',
      );
    }

    await this.redisClient.sRem(key, token);
    // Deleting the key if the refresh tokens set for the key is empty
    if ((await this.redisClient.sCard(key)) === 0) {
      await this.redisClient.del(key);
    }
  }

  /**
   * Deletes the refresh tokens of a specified user from the the user's refresh tokens cache in Redis
   *
   * @param user The user that owns the refresh tokens
   */
  async deleteUserRefreshTokens(user: UserDocument) {
    await this.redisClient.del(this.getUserRefreshTokensRedisKey(user.id));
  }

  /**
   *
   * @param user The user to sign out
   * @param refreshToken The refresh token associated with the user
   */
  async signout(user: UserDocument, refreshToken: string) {
    await this.removeUserRefreshToken(refreshToken, user);
  }

  /**
   * Deletes an authenticated user's account
   *
   * @param authUser The authenticated whose user account is to be deleted
   */
  async deleteAccount(authUser: UserDocument) {
    await this.deleteUserRefreshTokens(authUser);
    return this.userService.delete(authUser);
  }
}
