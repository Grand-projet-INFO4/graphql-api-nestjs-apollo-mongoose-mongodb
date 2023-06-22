import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';

import { AccessToken } from 'src/graphql/schema';
import { RefreshTokenGuard } from '../guard';
import { AuthUser } from '../decorator';
import { ACCESS_TOKEN_DURATION, AuthService } from '../auth.service';
import { User } from '@prisma/client';
import { addDurationFromNow } from 'src/common/utils/date-time.utils';

@Resolver('AccessToken')
export class AccessTokenResolver {
  constructor(private authService: AuthService) {}

  @Mutation('refreshToken')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@AuthUser() user: User): Promise<AccessToken> {
    const accessToken = await this.authService.generateToken('ACCESS', {
      sub: user.id,
      username: user.username,
    });
    return {
      accessToken,
      expiresAt: addDurationFromNow(ACCESS_TOKEN_DURATION),
    };
  }
}
