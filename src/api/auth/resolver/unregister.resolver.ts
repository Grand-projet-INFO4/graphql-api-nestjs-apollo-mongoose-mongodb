import { Mutation, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { UseGuards } from '@nestjs/common';

import { UserService } from 'src/api/user/user.service';
import { Res } from 'src/common/decorators';
import { REFRESH_TOKEN_COOKIE_NAME } from '../auth.constants';
import { AuthUser } from '../decorator';
import { AccessTokenGuard } from '../guard';
import { User } from '@prisma/client';

@Resolver('Void')
export class UnregisterResolver {
  constructor(private userService: UserService) {}

  @Mutation('unregister')
  @UseGuards(AccessTokenGuard)
  async unregister(@AuthUser() authUser: User, @Res() res: Response) {
    await this.userService.delete(authUser);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  }
}
