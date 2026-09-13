import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CACHE_TTL,
  cacheKeys,
  safeCacheGet,
  safeCacheSet,
} from 'src/cache/cache-policy';

@Injectable()
export class SkillProficiencyService {
  private readonly logger = new Logger(SkillProficiencyService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async getUserProficiencyScores(userId: string) {
    const cacheKey = cacheKeys.skillProficiency(userId);
    const cached = await safeCacheGet(
      this.cacheManager,
      cacheKey,
      'skill_proficiency',
      this.logger,
    );

    if (cached.hit) {
      return cached.value;
    }

    const sessions = await this.prisma.writingSession.findMany({
      where: {
        userId,
        status: 'graded',
      },
      select: {
        sessionFeedback: {
          select: {
            categoryScores: true,
          },
        },
      },
    });

    const totals = {
      Grammar: { score: 0, max: 0 },
      Clarity: { score: 0, max: 0 },
      Etiquette: { score: 0, max: 0 },
      Structure: { score: 0, max: 0 },
      'Professional Tone': { score: 0, max: 0 },
      Conciseness: { score: 0, max: 0 },
    };

    let overallScore = 0;
    let overallMaxScore = 0;

    for (const session of sessions) {
      const categories = session.sessionFeedback?.categoryScores as any[];

      if (!categories) continue;

      for (const category of categories) {
        if (!totals[category.name]) continue;

        totals[category.name].score += category.score;
        totals[category.name].max += category.maxScore;

        overallScore += category.score;
        overallMaxScore += category.maxScore;
      }
    }

    const progress = Object.entries(totals).map(([name, value]) => ({
      category: name,
      percentage:
        value.max === 0
          ? 0
          : Number(((value.score / value.max) * 100).toFixed(1)),
    }));

    const overallPercentage =
      overallMaxScore === 0
        ? 0
        : Number(((overallScore / overallMaxScore) * 100).toFixed(1));

    const result = {
      overall: {
        score: overallScore,
        maxScore: overallMaxScore,
        percentage: overallPercentage,
      },
      progress,
    };

    await safeCacheSet(
      this.cacheManager,
      cacheKey,
      result,
      CACHE_TTL.dashboard,
      'skill_proficiency',
      this.logger,
    );

    return result;
  }
}
