import { Mutation, Resolver } from '@nestjs/graphql';
import { Response } from 'express';

import { Res } from 'src/common/decorators';
import { REFRESH_TOKEN_COOKIE_NAME } from '../auth.constants';

@Resolver('Void')
export class LogoutResolver {
  @Mutation('logout')
  logout(@Res() res: Response) {
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  }
}
