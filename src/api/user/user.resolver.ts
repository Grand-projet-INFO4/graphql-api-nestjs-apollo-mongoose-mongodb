import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AccessTokenGuard } from '../auth/guard';
import { AuthUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query('me')
  @UseGuards(AccessTokenGuard)
  getMe(@AuthUser() authUser: User) {
    return authUser;
  }

  @ResolveField()
  photo(@Parent() user: User): string | null {
    return this.userService.getPhotoURL(user.photo);
  }
}
