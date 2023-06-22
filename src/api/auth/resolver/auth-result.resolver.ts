import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CookieOptions, Response } from 'express';

import { AuthService } from '../auth.service';
import SignupDTO from '../dto/signup.dto';
import { Res } from 'src/common/decorators';
import { REFRESH_TOKEN_COOKIE_NAME } from '../auth.constants';

// Config options for a refresh token cookie
const refreshTokenCookieOptions: CookieOptions = {
  secure: true,
  httpOnly: true,
};

@Resolver('AuthResult')
export class AuthResultResolver {
  constructor(private authService: AuthService) {}

  @Mutation('signup')
  async signup(@Args('payload') payload: SignupDTO, @Res() res: Response) {
    const authResult = await this.authService.signup(payload);
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      authResult.refreshToken,
      refreshTokenCookieOptions,
    );
    return authResult;
  }

  @Mutation('signin')
  async signin(
    @Args('email') email: string,
    @Args('password') password: string,
    @Res() res: Response,
  ) {
    const authResult = await this.authService.signin(email, password);
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      authResult.refreshToken,
      refreshTokenCookieOptions,
    );
    return authResult;
  }
}
