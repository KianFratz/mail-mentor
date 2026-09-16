import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRequiredJwtSecret } from './jwt-secret';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: getRequiredJwtSecret(configService, 'JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION',
          ) || '15m') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GoogleOAuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
