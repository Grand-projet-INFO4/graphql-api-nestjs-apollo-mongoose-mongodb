import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UniqueUserFieldValidator } from './validator';
import { User, userSchema } from './schema';

const userMongooseModule = MongooseModule.forFeature([
  {
    name: User.name,
    schema: userSchema,
  },
]);

@Module({
  imports: [userMongooseModule],
  providers: [UserService, UserResolver, UniqueUserFieldValidator],
  exports: [UserService, UniqueUserFieldValidator, userMongooseModule],
})
export class UserModule {}
