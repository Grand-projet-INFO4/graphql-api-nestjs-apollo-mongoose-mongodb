import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { AccessTokenJwtStrategy, RefreshTokenJwtStrategy } from './strategy';
import {
  AccessTokenResolver,
  AuthResultResolver,
  UnregisterResolver,
} from './resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [
    AccessTokenJwtStrategy,
    RefreshTokenJwtStrategy,
    AuthResultResolver,
    AccessTokenResolver,
    UnregisterResolver,
    AuthService,
  ],
})
export class AuthModule {}
