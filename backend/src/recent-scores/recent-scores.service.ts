import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RecentScoresService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getAllSessionWithFeedback(userId: string, limit: number, page = 1) {
    const cacheKey = `recent-scores:${userId}:limit:${limit}:page:${page}`;
    const keyIndex = `recent-scores:${userId}:keys`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
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

    await this.cacheManager.set(cacheKey, result, 300_000);
    await this.trackUserCacheKey(keyIndex, cacheKey);

    return result;
  }

  private async trackUserCacheKey(keyIndex: string, cacheKey: string) {
    const keys = (await this.cacheManager.get<string[]>(keyIndex)) ?? [];
    if (keys.includes(cacheKey)) return;

    await this.cacheManager.set(keyIndex, [...keys, cacheKey], 300_000);
  }
}
