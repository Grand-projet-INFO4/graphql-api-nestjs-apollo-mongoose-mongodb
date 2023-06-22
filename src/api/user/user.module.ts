import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UniqueUserFieldValidator } from './validator';

@Module({
  providers: [UserService, UserResolver, UniqueUserFieldValidator],
  exports: [UserService, UniqueUserFieldValidator],
})
export class UserModule {}
