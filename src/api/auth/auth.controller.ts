import { Controller, Body, Post, Get, UseGuards, Delete } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SigninDTO, SignupDTO } from './dto';
import { RefreshTokenGuard } from './guard';
import { UserDocument } from '../user/schema';
import { AuthUser } from './decorator';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDTO) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  async signin(@Body() dto: SigninDTO) {
    return this.authService.signin(dto.identifier, dto.password);
  }

  @Get('me')
  @UseGuards(new RefreshTokenGuard('REST'))
  async getMe(@AuthUser() authUser: UserDocument) {
    return authUser;
  }

  @Get('token')
  @UseGuards(new RefreshTokenGuard('REST'))
  async refreshToken(@AuthUser() authUser: UserDocument) {
    return this.authService.refreshToken(authUser);
  }

  @Delete('signout')
  @UseGuards(new RefreshTokenGuard('REST'))
  async signout() {
    return {};
  }

  @Delete('delete-account')
  @UseGuards(new RefreshTokenGuard('REST'))
  async deleteAccount(@AuthUser() authUser: UserDocument) {
    return this.authService.deleteAccount(authUser);
  }
}
