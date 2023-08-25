import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserJwtPayload } from '../auth';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'AccessTokenJwt',
) {
  constructor(config: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('ACCESS_TOKEN_SECRET_KEY'),
    });
  }

  async validate(payload: UserJwtPayload) {
    return this.authService.getAuthUser(payload.sub);
  }
}
