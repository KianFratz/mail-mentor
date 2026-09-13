import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CACHE_TTL,
  cacheKeys,
  getRecentScoresGeneration,
  safeCacheGet,
  safeCacheSet,
} from 'src/cache/cache-policy';

@Injectable()
export class RecentScoresService {
  private readonly logger = new Logger(RecentScoresService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getAllSessionWithFeedback(userId: string, limit: number, page = 1) {
    const generation = await getRecentScoresGeneration(
      this.cacheManager,
      userId,
      this.logger,
    );
    const cacheKey = cacheKeys.recentScores(userId, generation, limit, page);
    const cached = await safeCacheGet(
      this.cacheManager,
      cacheKey,
      'recent_scores',
      this.logger,
    );

    if (cached.hit) {
      return cached.value;
    }

    const where = { userId, status: 'graded' as const };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.writingSession.findMany({
        where,
        include: { scenario: true, sessionFeedback: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: limit ? (page - 1) * limit : undefined,
      }),
      this.prisma.writingSession.count({ where }),
    ]);

    const result = { data, total, page, limit };

    await safeCacheSet(
      this.cacheManager,
      cacheKey,
      result,
      CACHE_TTL.dashboard,
      'recent_scores',
      this.logger,
    );

    return result;
  }
}
