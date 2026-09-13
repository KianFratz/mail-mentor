import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  evaluateCategoryScore,
  evaluateImprovement,
  evaluateOverallScore,
  evaluatePerfectScore,
  evaluateSessionCount,
  evaluateStreak,
} from './evaluators/badge-evaluators';
import { OnEvent } from '@nestjs/event-emitter';
import { Prisma } from 'src/generated/prisma/client';
import { EvaluationResult } from './evaluators/badge-evaluators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import {
  CACHE_TTL,
  cacheKeys,
  safeCacheDelete,
  safeCacheGet,
  safeCacheSet,
} from 'src/cache/cache-policy';

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getUserBadge(userId: string) {
    const cacheKey = cacheKeys.userBadges(userId);
    const cached = await safeCacheGet(
      this.cacheManager,
      cacheKey,
      'user_badges',
      this.logger,
    );
    if (cached.hit) return cached.value;

    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });

    if (userBadges.length === 0) {
      await this.evaluateForUser(userId);
      const evaluatedBadges = await this.prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
      });
      await safeCacheSet(
        this.cacheManager,
        cacheKey,
        evaluatedBadges,
        CACHE_TTL.dashboard,
        'user_badges',
        this.logger,
      );
      return evaluatedBadges;
    }

    await safeCacheSet(
      this.cacheManager,
      cacheKey,
      userBadges,
      CACHE_TTL.dashboard,
      'user_badges',
      this.logger,
    );
    return userBadges;
  }

  async evaluateForUser(userId: string) {
    const cacheKey = cacheKeys.userBadges(userId);
    await safeCacheDelete(
      this.cacheManager,
      cacheKey,
      'user_badges',
      this.logger,
    );

    try {
      const [
        badges,
        existingUserBadges,
        recentFeedbacks,
        userStreak,
        totalSessionsCount,
      ] = await Promise.all([
        this.prisma.badge.findMany(),
        this.prisma.userBadge.findMany({ where: { userId } }),
        this.prisma.sessionFeedback.findMany({
          where: {
            writingSession: {
              userId,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        }),
        this.prisma.userStreak.findUnique({
          where: { userId },
        }),
        this.prisma.writingSession.count({
          where: { userId, status: 'graded' },
        }),
      ]);

      const existingBadgesMap = new Map(
        existingUserBadges.map((badge) => [badge.badgeId, badge]),
      );

      const upsertOperations: Prisma.PrismaPromise<any>[] = [];

      for (const badge of badges) {
        let result: EvaluationResult | null = null;
        const config = badge.criteriaConfig as any;
        switch (badge.criteriaType) {
          case 'category_score':
            result = evaluateCategoryScore(recentFeedbacks as any, config);
            break;
          case 'overall_score':
            result = evaluateOverallScore(recentFeedbacks, config);
            break;
          case 'session_count':
            result = evaluateSessionCount(totalSessionsCount, config);
            break;
          case 'streak':
            result = evaluateStreak(userStreak?.currentStreak ?? 0, config);
            break;
          case 'improvement':
            result = evaluateImprovement(recentFeedbacks, config);
            break;
          case 'perfect_score':
            result = evaluatePerfectScore(recentFeedbacks, config);
            break;
          default:
            continue;
        }

        if (!result) {
          continue;
        }

        const existing = existingBadgesMap.get(badge.id);

        upsertOperations.push(
          this.prisma.userBadge.upsert({
            where: { userId_badgeId: { userId, badgeId: badge.id } },
            update: {
              progress: result.progress,
              earnedAt:
                existing?.earnedAt ?? (result.earned ? new Date() : null),
            },
            create: {
              userId,
              badgeId: badge.id,
              progress: result.progress,
              earnedAt: result.earned ? new Date() : null,
            },
          }),
        );
      }

      if (upsertOperations.length > 0) {
        await this.prisma.$transaction(upsertOperations);
      }
    } finally {
      await safeCacheDelete(
        this.cacheManager,
        cacheKey,
        'user_badges',
        this.logger,
      );
    }
  }

  @OnEvent('feedback.created', { async: true })
  async handleFeedbackCreated(payload: { userId: string; sessionId: string }) {
    try {
      await this.evaluateForUser(payload.userId);
    } catch {
      this.logger.error({ event: 'badge_evaluation_failed' });
    }
  }
}
