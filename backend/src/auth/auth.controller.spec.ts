import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let usersService: {
    getAuthProfile: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      getAuthProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: {} },
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
});
