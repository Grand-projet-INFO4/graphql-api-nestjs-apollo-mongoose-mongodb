import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from 'src/api/user/user.service';
import { UserJwtPayload } from '../auth';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'AccessTokenJwt',
) {
  constructor(config: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('ACCESS_TOKEN_SECRET_KEY'),
    });
  }

  async validate(payload: UserJwtPayload) {
    return this.userService.getOne(payload.sub);
  }
}
