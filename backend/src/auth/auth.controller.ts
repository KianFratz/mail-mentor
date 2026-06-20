import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshTokenCookie(res: Response, refreshToken: string) : void {
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async goolgeAuth(@Req() req) {
    return req.user;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async goolgeAuthRedirect(@Req() req, @Res() res) {
    const { access_token, refresh_token } =
      await this.authService.loginWithGoolge(req.user);

    this.setRefreshTokenCookie(res, refresh_token);

    // Access token passed to frontend via query param ( short-lived, 15m)
    return res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${access_token}`,
    );
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const rt = req.cookies['refresh_token'];
    const { access_token } = await this.authService.refreshAccessToken(rt);

    return res.json({ access_token });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res) {
    const { access_token, refresh_token } =
      await this.authService.register(registerDto);

    this.setRefreshTokenCookie(res, refresh_token);

    return res.json({ access_token });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { access_token, refresh_token } =
      await this.authService.login(loginDto);

    this.setRefreshTokenCookie(res, refresh_token);

    return res.json({ access_token });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
    });
    return res.json({
      message: 'Logged out successfully'
    }) 
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
