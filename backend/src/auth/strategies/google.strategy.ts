import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    const defaultCallback = process.env.NODE_ENV === 'production'
      ? 'https://kids-oasis-api.vercel.app/api/v1/auth/google/callback'
      : 'http://localhost:3001/api/v1/auth/google/callback';

    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',

      callbackURL: process.env.GOOGLE_CALLBACK_URL || defaultCallback,
      scope: ['email', 'profile'],
    });
  }


  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;
    const userProfile = {
      googleId: id,
      email: emails && emails[0] ? emails[0].value : '',
      firstName: name?.givenName || (emails && emails[0] ? emails[0].value.split('@')[0] : 'User'),
      lastName: name?.familyName || 'User',
      avatar: photos && photos[0] ? photos[0].value : '',
    };
    const result = await this.authService.googleAuth(userProfile);
    done(null, result);
  }
}
