import { Controller, Post, UseGuards, Req, Res, Body, Get } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() signUpDto: any, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(signUpDto);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    return { accessToken: result.accessToken, user: result.user };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    if (req.user?.isMfaEnabled) {
      return { mfaRequired: true, userId: req.user._id || req.user.id };
    }
    const tokens = await this.authService.login(req.user);
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
    return { accessToken: tokens.accessToken, user: req.user };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = req.cookies['refreshToken'] || req.body?.refreshToken;
    const tokens = await this.authService.rotateRefreshToken(oldRefreshToken);
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    return { accessToken: tokens.accessToken };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body('token') token: string, @Body('password') password: string) {
    return this.authService.resetPassword(token, password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() req: Request,
    @Body('currentPassword') currentPass: string,
    @Body('newPassword') newPass: string,
  ) {
    const userId = (req.user as any).userId;
    return this.authService.changePassword(userId, currentPass, newPass);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = req.cookies['refreshToken'];
    await this.authService.logout((req.user as any).userId, oldRefreshToken);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  async logoutAll(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logoutAll((req.user as any).userId);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    const userId = (req.user as any).userId;
    const user = await this.usersService.findById(userId);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
      isMfaEnabled: user.isMfaEnabled,
    };
  }

  // ---------------------------------------------------------
  // Multi-Factor Authentication Endpoints
  // ---------------------------------------------------------

  @UseGuards(JwtAuthGuard)
  @Post('mfa/generate')
  async generateMfaSecret(@Req() req) {
    const userId = (req.user as any).userId;
    return this.authService.generateMfaSecret(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/verify')
  async verifyMfaToken(@Req() req, @Body('token') token: string) {
    const userId = (req.user as any).userId;
    return this.authService.verifyMfaToken(userId, token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/disable')
  async disableMfa(@Req() req) {
    const userId = (req.user as any).userId;
    return this.authService.disableMfa(userId);
  }

  @Post('mfa/validate')
  async validateLoginMfa(
    @Body('userId') userId: string,
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.validateLoginMfa(userId, token);
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return tokens;
  }

  // ---------------------------------------------------------
  // Google OAuth Endpoints
  // ---------------------------------------------------------

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect() {
    // Passport redirects to Google login consent screen
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    const authResult = req.user;
    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const host = req.get('host') || '';
    const isVercelHost = host.includes('vercel.app');

    const frontendUrl = (isProd || isVercelHost)
      ? 'https://kids-oasis-platform.vercel.app'
      : (process.env.FRONTEND_URL || 'http://localhost:3000');

    if (!authResult || !authResult.accessToken) {
      return res.redirect(`${frontendUrl}/en/login?error=google_auth_failed`);
    }

    res.cookie('accessToken', authResult.accessToken, {
      httpOnly: true,
      secure: isProd || isVercelHost,
      sameSite: (isProd || isVercelHost) ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', authResult.refreshToken, {
      httpOnly: true,
      secure: isProd || isVercelHost,
      sameSite: (isProd || isVercelHost) ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const userObj = authResult.user || authResult;
    const sanitizedUser = {
      id: userObj.id || userObj._id || 'google_user_id',
      email: userObj.email || 'user@kidsoasis.com',
      firstName: userObj.firstName || 'Google',
      lastName: userObj.lastName || 'User',
      role: userObj.role || 'parent',
      avatar: userObj.avatar || '',
    };
    const userEncoded = encodeURIComponent(JSON.stringify(sanitizedUser));
    return res.redirect(`${frontendUrl}/en/login?token=${authResult.accessToken}&user=${userEncoded}`);
  }




  @Post('google')
  async googleAuth(
    @Body() body: { email: string; firstName?: string; lastName?: string; googleId?: string; avatar?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.googleAuth(body);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return result;
  }
}

