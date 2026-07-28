import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = await this.usersService.findByEmail(cleanEmail);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Check account lockout status
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new UnauthorizedException('Account is temporarily locked due to failed login attempts. Try again in 15 minutes.');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (isMatch) {
      await this.usersService.resetFailedAttempts(user.id);
      const { passwordHash, refreshTokens, ...result } = user.toObject();
      return result;
    }

    // Handle failure locking increment
    await this.usersService.incrementFailedAttempts(user);
    throw new UnauthorizedException('Invalid credentials.');
  }

  async login(user: any) {
    const userId = user._id || user.id;
    const payload = { email: user.email, sub: userId, role: user.role };

    const accessSecret = process.env.JWT_ACCESS_SECRET || 'kids_oasis_secure_access_token_secret_2026';
    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'kids_oasis_secure_refresh_token_secret_2026';

    const accessToken = this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d',
    });

    // Save refresh token to whitelist database
    await this.usersService.update(userId, {
      $push: { refreshTokens: refreshToken }
    });

    return { accessToken, refreshToken };
  }

  async register(signUpDto: any) {
    const cleanEmail = (signUpDto.email || '').trim().toLowerCase();
    const existing = await this.usersService.findByEmail(cleanEmail);
    if (existing) {
      throw new BadRequestException('Email address already in use. Please sign in or use a different email.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(signUpDto.password, salt);

    const normalizedGender = (signUpDto.gender || 'female').toLowerCase();
    const user = await this.usersService.create({
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      email: cleanEmail,
      role: signUpDto.role || UserRole.PARENT,
      passwordHash,
      gender: ['male', 'female'].includes(normalizedGender) ? normalizedGender : 'female',
      phoneNumber: signUpDto.phoneNumber || '+201000000000',
      address: signUpDto.address || 'Alexandria, Egypt',
      isVerified: true,
    });

    const tokens = await this.login(user);
    return { ...tokens, user };
  }

  async forgotPassword(email: string) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = await this.usersService.findByEmail(cleanEmail);
    if (!user) {
      // Return ambiguous message for security
      return { message: 'If an account exists with this email, a password reset link has been issued.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.usersService.update(user.id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: expires,
    });

    return {
      message: 'Password reset link generated successfully.',
      resetToken, // Returned for dev/testing demo
    };
  }

  async resetPassword(resetToken: string, newPass: string) {
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await this.usersService.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPass, salt);

    await this.usersService.update(user.id, {
      passwordHash,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
      refreshTokens: [], // Invalidate all active sessions
    });

    return { message: 'Password has been reset successfully. Please sign in with your new password.' };
  }

  async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPass, salt);

    await this.usersService.update(userId, {
      passwordHash,
      refreshTokens: [], // Revoke active sessions for security
    });

    return { message: 'Password updated successfully. Please log in again.' };
  }

  async rotateRefreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret'
      });
      const user = await this.usersService.findById(payload.sub);
      
      if (!user || !user.refreshTokens.includes(token)) {
        if (user) {
          await this.usersService.update(user.id, { refreshTokens: [] });
        }
        throw new UnauthorizedException('Session compromised. Please login again.');
      }

      const newTokens = await this.login(user);
      await this.usersService.update(user.id, {
        $pull: { refreshTokens: token }
      });

      return newTokens;
    } catch (e) {
      throw new UnauthorizedException('Session expired or invalid.');
    }
  }

  async logout(userId: string, token: string) {
    await this.usersService.update(userId, {
      $pull: { refreshTokens: token }
    });
  }

  async logoutAll(userId: string) {
    await this.usersService.update(userId, {
      refreshTokens: []
    });
  }

  // ---------------------------------------------------------
  // MFA (2FA TOTP) & Google Authentication Methods
  // ---------------------------------------------------------

  async generateMfaSecret(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    const bytes = crypto.randomBytes(20);
    for (let i = 0; i < bytes.length; i++) {
      secret += alphabet[bytes[i] % 32];
    }

    const otpAuthUrl = `otpauth://totp/KidsOasis:${encodeURIComponent(user.email)}?secret=${secret}&issuer=KidsOasis`;
    await this.usersService.update(userId, { mfaSecret: secret });

    return { secret, otpAuthUrl };
  }

  async verifyMfaToken(userId: string, token: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.mfaSecret) throw new BadRequestException('MFA not initialized');

    const isValid = this.validateTotp(user.mfaSecret, token);
    if (!isValid) throw new BadRequestException('Invalid 6-digit MFA code.');

    await this.usersService.update(userId, { isMfaEnabled: true });
    return { success: true, message: 'Multi-factor authentication enabled successfully!' };
  }

  async disableMfa(userId: string) {
    await this.usersService.update(userId, { isMfaEnabled: false, mfaSecret: null });
    return { success: true, message: 'Multi-factor authentication disabled.' };
  }

  async validateLoginMfa(userId: string, token: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.mfaSecret) throw new BadRequestException('MFA not configured');

    const isValid = this.validateTotp(user.mfaSecret, token);
    if (!isValid) throw new UnauthorizedException('Invalid MFA authentication code.');

    return this.login(user);
  }

  async googleAuth(profile: { email: string; firstName?: string; lastName?: string; googleId?: string; avatar?: string }) {
    let user = await this.usersService.findByEmail(profile.email.toLowerCase().trim());
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), salt);

      user = await this.usersService.create({
        firstName: profile.firstName || profile.email.split('@')[0] || 'User',
        lastName: profile.lastName || 'Member',
        email: profile.email.toLowerCase().trim(),
        passwordHash,
        role: UserRole.PARENT,
        gender: 'female',
        avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        isVerified: true,
        googleProfile: {
          id: profile.googleId || 'google_' + Date.now(),
          email: profile.email,
          name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
          picture: profile.avatar || '',
        },
      });
    }
    const tokens = await this.login(user);
    return { ...tokens, user };
  }


  private validateTotp(secretBase32: string, token: string): boolean {
    if (!secretBase32 || !token) return false;
    const cleanToken = token.trim();
    const currentStep = Math.floor(Date.now() / 30000);

    for (let offset = -1; offset <= 1; offset++) {
      const timeStep = currentStep + offset;
      const key = this.base32Decode(secretBase32);
      const buffer = Buffer.alloc(8);
      buffer.writeBigInt64BE(BigInt(timeStep), 0);
      const hmac = crypto.createHmac('sha1', key).update(buffer).digest();
      const flexOffset = hmac[hmac.length - 1] & 0xf;
      const code = ((hmac[flexOffset] & 0x7f) << 24) |
                   ((hmac[flexOffset + 1] & 0xff) << 16) |
                   ((hmac[flexOffset + 2] & 0xff) << 8) |
                   (hmac[flexOffset + 3] & 0xff);
      const otp = (code % 1000000).toString().padStart(6, '0');
      if (otp === cleanToken) return true;
    }
    return false;
  }

  private base32Decode(base32Str: string): Buffer {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (let i = 0; i < base32Str.length; i++) {
      const val = alphabet.indexOf(base32Str[i].toUpperCase());
      if (val < 0) continue;
      bits += val.toString(2).padStart(5, '0');
    }
    const bytes: number[] = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.substr(i, 8), 2));
    }
    return Buffer.from(bytes);
  }
}
