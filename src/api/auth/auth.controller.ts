import {
  Controller,
  Body,
  Post,
  Get,
  UseGuards,
  Delete,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CookieOptions, Response } from 'express';

import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from './dto';
import { AccessTokenGuard, RefreshTokenGuard } from './guard';
import { UserDocument } from '../user/schema';
import { AuthUser } from './decorator';
import { REFRESH_TOKEN_COOKIE_NAME } from './auth.constants';
import { VerifyRefreshTokenGuard } from './guard/verify-refresh-token.guard';
import { BearerToken } from './decorator/bearer-token.decorator';

// Config options for a refresh token cookie
const refreshTokenCookieOptions: CookieOptions = {
  secure: true,
  httpOnly: true,
};

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() dto: SignupDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResult = await this.authService.signup(dto);
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      authResult.refresh_token,
      refreshTokenCookieOptions,
    );
    return authResult;
  }

  @Post('signin')
  async signin(
    @Body() dto: SigninDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authResult = await this.authService.signin(
      dto.identifier,
      dto.password,
    );
    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      authResult.refresh_token,
      refreshTokenCookieOptions,
    );
    return authResult;
  }

  @Get('me')
  @UseGuards(new AccessTokenGuard('REST'))
  async getMe(@AuthUser() authUser: UserDocument) {
    return authUser;
  }

  @Get('token')
  @UseGuards(VerifyRefreshTokenGuard)
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@AuthUser() authUser: UserDocument) {
    return this.authService.refreshToken(authUser);
  }

  @Delete('signout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(VerifyRefreshTokenGuard)
  @UseGuards(RefreshTokenGuard)
  async signout(
    @BearerToken('REST') refreshToken: string,
    @AuthUser() authUser: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.signout(authUser, refreshToken);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  }

  @Delete('delete-account')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(VerifyRefreshTokenGuard)
  @UseGuards(RefreshTokenGuard)
  async deleteAccount(
    @AuthUser() authUser: UserDocument,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.deleteAccount(authUser);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  }
}
