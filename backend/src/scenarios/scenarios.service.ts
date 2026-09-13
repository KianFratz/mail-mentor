import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Scenario } from 'src/generated/prisma/client';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CACHE_TTL,
  cacheKeys,
  safeCacheGet,
  safeCacheSet,
} from 'src/cache/cache-policy';

@Injectable()
export class ScenariosService {
  private readonly logger = new Logger(ScenariosService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll() {
    const cacheKey = cacheKeys.scenarios();
    const cached = await safeCacheGet<Scenario[]>(
      this.cacheManager,
      cacheKey,
      'scenarios',
      this.logger,
    );

    if (cached.hit) {
      return cached.value;
    }

    const scenarios = await this.prisma.scenario.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    await safeCacheSet(
      this.cacheManager,
      cacheKey,
      scenarios,
      CACHE_TTL.scenario,
      'scenarios',
      this.logger,
    );

    return scenarios;
  }

  async findById(id: string) {
    const cacheKey = cacheKeys.scenario(id);
    const cached = await safeCacheGet<Scenario>(
      this.cacheManager,
      cacheKey,
      'scenario',
      this.logger,
    );
    if (cached.hit) return cached.value;

    const scenario = await this.prisma.scenario.findUnique({
      where: { id },
    });
    if (scenario !== null) {
      await safeCacheSet(
        this.cacheManager,
        cacheKey,
        scenario,
        CACHE_TTL.scenario,
        'scenario',
        this.logger,
      );
    }
    return scenario;
  }

  async getUnlockedLevels(
    userId: string,
  ): Promise<{ unlockedLevels: string[] }> {
    const cacheKey = cacheKeys.unlockedLevels(userId);
    const cached = await safeCacheGet<{ unlockedLevels: string[] }>(
      this.cacheManager,
      cacheKey,
      'unlocked_levels',
      this.logger,
    );
    if (cached.hit) return cached.value;

    const unlockedLevels: string[] = ['beginner'];

    const beginnerScenarios = await this.prisma.scenario.findMany({
      where: { level: 'beginner' },
      select: { id: true },
    });
    const beginnerIds = beginnerScenarios.map((s) => s.id);

    const qualifyingBeginnerSessions =
      await this.prisma.writingSession.findMany({
        where: {
          userId,
          scenarioId: { in: beginnerIds },
          status: 'graded',
          sessionFeedback: { overallScore: { gte: 75 } },
        },
        select: { scenarioId: true },
        distinct: ['scenarioId'],
      });

    const completedBeginnerIds = new Set(
      qualifyingBeginnerSessions.map((s) => s.scenarioId),
    );
    const allBeginnersCleared = beginnerIds.every((id) =>
      completedBeginnerIds.has(id),
    );

    if (allBeginnersCleared) {
      unlockedLevels.push('intermediate');

      const intermediateScenarios = await this.prisma.scenario.findMany({
        where: { level: 'intermediate' },
        select: { id: true },
      });
      const intermediateIds = intermediateScenarios.map((s) => s.id);

      const qualifyingIntermediateSessions =
        await this.prisma.writingSession.findMany({
          where: {
            userId,
            scenarioId: { in: intermediateIds },
            status: 'graded',
            sessionFeedback: { overallScore: { gte: 75 } },
          },
          select: { scenarioId: true },
          distinct: ['scenarioId'],
        });

      const completedIntermediateIds = new Set(
        qualifyingIntermediateSessions.map((s) => s.scenarioId),
      );
      const allIntermediateCleared = intermediateIds.every((id) =>
        completedIntermediateIds.has(id),
      );

      if (allIntermediateCleared) {
        unlockedLevels.push('advanced', 'hard');
      }
    }

    const result = { unlockedLevels };
    await safeCacheSet(
      this.cacheManager,
      cacheKey,
      result,
      CACHE_TTL.dashboard,
      'unlocked_levels',
      this.logger,
    );
    return result;
  }
}
