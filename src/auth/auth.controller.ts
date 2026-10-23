import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './user/dto/register.dto.js';
import { LoginDto } from './user/dto/login.dto.js';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { UserDocument } from './user/schema/user.schema.js';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none' as const,
      path: '/',
    };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(dto);

    const cookiesOptions = this.getCookieOptions();

    response.cookie('access_token', accessToken, {
      ...cookiesOptions,
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refresh_token', refreshToken, {
      ...cookiesOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login successful',
      user,
    };
  }

  // 🔄 Refresh + rotate tokens
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser()
    user: {
      userId: string;
      email: string;
      refreshToken: string;
    },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      user.userId,
      user.refreshToken,
    );

    const cookiesOptions = this.getCookieOptions();

    response.cookie('access_token', accessToken, {
      ...cookiesOptions,
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refresh_token', refreshToken, {
      ...cookiesOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Tokens refreshed successfully',
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('_id') userId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(userId);

    response.clearCookie('access_token', this.getCookieOptions());
    response.clearCookie('refresh_token', this.getCookieOptions());

    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: UserDocument) {
    return user;
  }
}
