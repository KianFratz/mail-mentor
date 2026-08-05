import { Injectable, NotImplementedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { evaluateCategoryScore } from './evaluators/badge-evaluators';

@Injectable()
export class BadgeService {
  constructor(private prisma: PrismaService) {}

  async evaluateForUser(userId: string) {
    const [badges, recentFeedbacks, existingUserBadges] = await Promise.all([
      this.prisma.badge.findMany(),
      this.prisma.sessionFeedback.findMany({
        where: { writingSession: { userId } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.userBadge.findMany({
        where: { userId },
      }),
    ]);

    const existingBadgesMap = new Map(
      existingUserBadges.map((ub) => [ub.badgeId, ub]),
    );

    const upsertOperations: Promise<any>[] = [];

    await this.prisma.$transaction(async (tx) => {
      for (const badge of badges) {
        let result: { progress: number; earned: boolean };

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
          where: { userId_badgeId: { userId, badgeId: badge.id } },
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
}
