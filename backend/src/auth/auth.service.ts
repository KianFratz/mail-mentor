import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { SetPasswordDto } from './dto/set-password.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async loginWithGoogle(googleUser: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          googleId: googleUser.googleId,
        },
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { googleRefreshToken: googleUser.refreshToken ?? undefined },
    });

    return this.generateTokenPair(user);
  }

  async disconnectGoogle(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new BadRequestException('User not found');

    const isGoogleConnected =
      user.authProviders.includes('GOOGLE') || user.googleId;

    if (!isGoogleConnected) {
      throw new BadRequestException('Google account is not connected');
    }

    const hasPassword = !!user.password;
    const otherProviders = user.authProviders.filter((p) => p !== 'GOOGLE');

    if (!hasPassword && otherProviders.length === 0) {
      throw new BadRequestException(
        "Set a password before disconnecting Google. or you won't be able to log in.",
      );
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        authProviders: otherProviders,
        googleId: null,
        googleRefreshToken: null,
      },
    });

    return {
      message: 'Google account disconnected successfully',
    };
  }

  private generateTokenPair(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const access_token = this.jwtService.sign(payload);

    const refresh_token = this.jwtService.sign(
      { sub: user.id },
      {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'super-refresh-secret',
        expiresIn: (this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION',
        ) || '7d') as any,
      },
    );

    return { access_token, refresh_token };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    const user = await this.usersService.createUser({
      email,
      password: password_hash,
      name: fullName,
    });

    return this.generateTokenPair(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new ConflictException(
        'This account was created with Google. Sign in with Google, or set a password from your account settings.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokenPair(user);
  }

  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          'super-refresh-secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const access_token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return { access_token };
  }

  async setPassword(userId: string, dto: SetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.password) {
      throw new ConflictException(
        'Password already set. Use change-password instead.',
      );
    }

    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(dto.password, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: password_hash,
        authProviders: { push: 'LOCAL' },
      },
    });
  }
}
