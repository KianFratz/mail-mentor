import { Test, TestingModule } from '@nestjs/testing';
import { RecentScoresService } from './recent-scores.service';
import { PrismaService } from 'prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTL, cacheKeys } from 'src/cache/cache-policy';

describe('RecentScoresService', () => {
  let service: RecentScoresService;
  let prisma: any;
  let cache: any;

  beforeEach(async () => {
    prisma = {
      writingSession: { findMany: jest.fn(), count: jest.fn() },
      $transaction: jest.fn(),
    };
    cache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecentScoresService,
        { provide: PrismaService, useValue: prisma },
        { provide: CACHE_MANAGER, useValue: cache },
      ],
    }).compile();

    service = module.get<RecentScoresService>(RecentScoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('serves a cached empty page without querying Prisma', async () => {
    cache.get
      .mockResolvedValueOnce('generation-1')
      .mockResolvedValueOnce({ data: [], total: 0, page: 1, limit: 10 });

    await expect(
      service.getAllSessionWithFeedback('user-1', 10, 1),
    ).resolves.toEqual({ data: [], total: 0, page: 1, limit: 10 });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('uses generation, user, limit and page in the cache key', async () => {
    cache.get
      .mockResolvedValueOnce('generation-1')
      .mockResolvedValueOnce(undefined);
    prisma.$transaction.mockResolvedValue([[], 0]);

    await service.getAllSessionWithFeedback('user-1', 25, 3);

    expect(cache.set).toHaveBeenCalledWith(
      cacheKeys.recentScores('user-1', 'generation-1', 25, 3),
      { data: [], total: 0, page: 3, limit: 25 },
      CACHE_TTL.dashboard,
    );
  });

  it('falls back to Prisma if cache reads and writes fail', async () => {
    cache.get.mockRejectedValue(new Error('redis unavailable'));
    cache.set.mockRejectedValue(new Error('redis unavailable'));
    prisma.$transaction.mockResolvedValue([[], 0]);

    await expect(
      service.getAllSessionWithFeedback('user-1', 10),
    ).resolves.toEqual({ data: [], total: 0, page: 1, limit: 10 });
  });
});
