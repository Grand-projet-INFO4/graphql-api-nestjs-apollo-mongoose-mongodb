import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { AccessTokenJwtStrategy, RefreshTokenJwtStrategy } from './strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CityModule } from '../city/city.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [JwtModule.register({}), UserModule, CityModule, RedisModule],
  providers: [AccessTokenJwtStrategy, RefreshTokenJwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
