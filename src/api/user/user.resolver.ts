import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
// import { UseGuards } from '@nestjs/common';

// import { AccessTokenGuard } from '../auth/guard';
// import { AuthUser } from '../auth/decorator';
import { UserService } from './user.service';
import { UserDocument } from './schema';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) {}

  @ResolveField()
  photo(@Parent() user: UserDocument): string | null {
    return this.userService.getPhotoURL(user.photo);
  }
}
