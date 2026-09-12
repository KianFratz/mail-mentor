import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Scenario } from 'src/generated/prisma/client';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ScenariosService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll() { 
    const cacheKey = 'scenarios:all';
    const cached = await this.cacheManager.get<Scenario[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const scenarios = await this.prisma.scenario.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    await this.cacheManager.set(
      cacheKey,
      scenarios,
      300_000, // Cache for 5 minutes
    );

    return scenarios;
  }

  async findById(id: string) {
    return this.prisma.scenario.findUnique({
      where: { id },
    });
  }

  async getUnlockedLevels(
    userId: string,
  ): Promise<{ unlockedLevels: string[] }> {
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

    return { unlockedLevels };
  }
}
