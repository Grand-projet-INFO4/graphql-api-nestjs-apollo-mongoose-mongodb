import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserDocument } from 'src/api/user/schema';

import { AuthService } from '../auth.service';

// Guard that checks if a refresh token is valid for the authenticated user
@Injectable()
export class VerifyRefreshTokenGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest() as Request;
    const authUser = request.user as UserDocument;
    const token = (request.headers.authorization as string).split(' ')[1];
    return this.authService.isValidUserRefreshToken(token, authUser);
  }
}
