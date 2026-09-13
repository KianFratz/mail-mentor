import { Test, TestingModule } from '@nestjs/testing';
import { BadgeService } from './badge.service';
import { PrismaService } from 'prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { cacheKeys } from 'src/cache/cache-policy';

describe('BadgeService', () => {
  let service: BadgeService;
  let prisma: any;
  let cache: any;

  beforeEach(async () => {
    prisma = {
      badge: { findMany: jest.fn() },
      userBadge: { findMany: jest.fn(), upsert: jest.fn() },
      sessionFeedback: { findMany: jest.fn() },
      userStreak: { findUnique: jest.fn() },
      writingSession: { count: jest.fn() },
      $transaction: jest.fn(),
    };
    cache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BadgeService,
        { provide: PrismaService, useValue: prisma },
        { provide: CACHE_MANAGER, useValue: cache },
      ],
    }).compile();

    service = module.get<BadgeService>(BadgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('serves cached badges without querying Prisma', async () => {
    cache.get.mockResolvedValue([]);

    await expect(service.getUserBadge('user-1')).resolves.toEqual([]);
    expect(prisma.userBadge.findMany).not.toHaveBeenCalled();
  });

  it('invalidates badges before and after evaluation', async () => {
    prisma.badge.findMany.mockResolvedValue([]);
    prisma.userBadge.findMany.mockResolvedValue([]);
    prisma.sessionFeedback.findMany.mockResolvedValue([]);
    prisma.userStreak.findUnique.mockResolvedValue(null);
    prisma.writingSession.count.mockResolvedValue(0);

    await service.evaluateForUser('user-1');

    expect(cache.del).toHaveBeenNthCalledWith(
      1,
      cacheKeys.userBadges('user-1'),
    );
    expect(cache.del).toHaveBeenNthCalledWith(
      2,
      cacheKeys.userBadges('user-1'),
    );
  });

  it('does not fail evaluation when cache deletion fails', async () => {
    cache.del.mockRejectedValue(new Error('redis unavailable'));
    prisma.badge.findMany.mockResolvedValue([]);
    prisma.userBadge.findMany.mockResolvedValue([]);
    prisma.sessionFeedback.findMany.mockResolvedValue([]);
    prisma.userStreak.findUnique.mockResolvedValue(null);
    prisma.writingSession.count.mockResolvedValue(0);

    await expect(service.evaluateForUser('user-1')).resolves.toBeUndefined();
  });
});
