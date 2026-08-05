import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { evaluateCategoryScore } from './evaluators/badge-evaluators';
import { OnEvent } from '@nestjs/event-emitter';
import { Badge } from 'src/generated/prisma/client';

@Injectable()
export class BadgeService {
  private badgesCache: Badge[] | null = null;

  constructor(private prisma: PrismaService) {}

  async getBadges() {
    if (!this.badgesCache) {
      this.badgesCache = await this.prisma.badge.findMany();
    }

    return this.badgesCache;
  }

  async getAllBadgesWithProgerss() {
    return this.prisma.userBadge.findMany({
      include: { badge: true },
    });
  }

  async getUserBadge(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });
  }

  private getMaxRequiredSessions(
    badges: Pick<Badge, 'criteriaConfig'>[],
  ): number {
    return Math.max(
      1,
      ...badges.map((badge) => {
        const config = badge.criteriaConfig as {
          minSessions?: number;
        };

        return config.minSessions ?? 1;
      }),
    );
  }

  async evaluateForUser(userId: string) {
    const badges = await this.getBadges();

    const maxSessions = this.getMaxRequiredSessions(badges);

    const [recentFeedbacks, existingUserBadges] = await Promise.all([
      this.prisma.sessionFeedback.findMany({
        where: {
          writingSession: {
            userId,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: maxSessions,
      }),
      this.prisma.userBadge.findMany({
        where: { userId },
      }),
    ]);

    const existingBadgesMap = new Map(
      existingUserBadges.map((badge) => [badge.badgeId, badge]),
    );

    await this.prisma.$transaction(async (tx) => {
      for (const badge of badges) {
        let result: {
          progress: number;
          earned: boolean;
        };

        switch (badge.criteriaType) {
          case 'category_score':
            result = evaluateCategoryScore(
              recentFeedbacks as any,
              badge.criteriaConfig as any,
            );
            break;
          default:
            continue;
        }

        const existing = existingBadgesMap.get(badge.id);

        await tx.userBadge.upsert({
          where: {
            userId_badgeId: { userId, badgeId: badge.id },
          },
          update: {
            progress: result.progress,
            earnedAt: existing?.earnedAt ?? (result.earned ? new Date() : null),
          },
          create: {
            userId,
            badgeId: badge.id,
            progress: result.progress,
            earnedAt: result.earned ? new Date() : null,
          },
        });
      }
    });
  }

  @OnEvent('feedback.created', { async: true })
  async handleFeedbackCreated(payload: { userId: string; sessionId: string }) {
    try {
      await this.evaluateForUser(payload.userId);
    } catch (error) {
      console.error(
        `Failed to evaluate badges for user ${payload.userId}:`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
