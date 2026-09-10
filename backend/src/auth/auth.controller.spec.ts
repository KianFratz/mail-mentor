import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    loginWithGoogle: jest.Mock;
  };
  let usersService: {
    getAuthProfile: jest.Mock;
  };

  beforeEach(async () => {
    process.env.FRONTEND_URL = 'http://frontend.test';
    authService = {
      loginWithGoogle: jest.fn(),
    };
    usersService = {
      getAuthProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns a safe profile from auth/me without sensitive fields', async () => {
    usersService.getAuthProfile.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      name: 'User',
      role: 'student',
      currentLevel: 'beginner',
      authProviders: ['LOCAL'],
      createdAt: new Date('2026-09-10T00:00:00.000Z'),
      hasPassword: true,
    });

    const profile = await controller.getProfile('user-id');

    expect(usersService.getAuthProfile).toHaveBeenCalledWith('user-id');
    expect(profile).toEqual({
      id: 'user-id',
      email: 'user@example.com',
      name: 'User',
      role: 'student',
      currentLevel: 'beginner',
      authProviders: ['LOCAL'],
      createdAt: new Date('2026-09-10T00:00:00.000Z'),
      hasPassword: true,
    });
    expect(profile).not.toHaveProperty('password');
    expect(profile).not.toHaveProperty('googleRefreshToken');
    expect(profile).not.toHaveProperty('emailVerifyTokenHash');
    expect(profile).not.toHaveProperty('emailVerifyExpiresAt');
  });

  it('rejects auth/me when the authenticated user no longer exists', async () => {
    usersService.getAuthProfile.mockResolvedValue(null);

    await expect(controller.getProfile('missing-user')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('does not put the Google access token in the OAuth redirect URL', async () => {
    authService.loginWithGoogle.mockResolvedValue({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    });
    const response = {
      cookie: jest.fn(),
      redirect: jest.fn(),
    };

    await controller.goolgeAuthRedirect(
      { user: { email: 'user@example.com' } },
      response,
    );

    expect(response.cookie).toHaveBeenCalledWith(
      'refresh_token',
      'refresh-token',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(response.redirect).toHaveBeenCalledWith(
      'http://frontend.test/oauth-success',
    );
    expect(response.redirect.mock.calls[0][0]).not.toContain('access-token');
    expect(response.redirect.mock.calls[0][0]).not.toContain('token=');
  });
});
