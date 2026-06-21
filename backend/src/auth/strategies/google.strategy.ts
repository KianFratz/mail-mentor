import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID') || '',
      clientSecret: config.get('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: `${config.get('BACKEND_URL') || 'http://localhost:3000'}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    return {
      googleId: profile.id,
      email: profile.emails?.[0].value,
      name: profile.displayName,
      refreshToken,
    };
  }
}