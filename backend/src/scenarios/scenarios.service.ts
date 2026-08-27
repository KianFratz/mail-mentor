import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ScenariosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.scenario.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.scenario.findUnique({
      where: { id },
    });
  }

  async getUnlockedLevels(userId: string): Promise<{ unlockedLevels: string[] }> {
    const unlockedLevels: string[] = ['beginner'];

    const beginnerScenarios = await this.prisma.scenario.findMany({
      where: { level: 'beginner' },
      select: { id: true },
    });
    const beginnerIds = beginnerScenarios.map(s => s.id);

    const qualifyingBeginnerSessions = await this.prisma.writingSession.findMany({
      where: {
        userId,
        scenarioId: { in: beginnerIds },
        status: 'graded',
        sessionFeedback: { overallScore: { gte: 75 } },
      },
      select: { scenarioId: true },
      distinct: ['scenarioId'],
    });

    const completedBeginnerIds = new Set(qualifyingBeginnerSessions.map(s => s.scenarioId));
    const allBeginnersCleared = beginnerIds.every(id => completedBeginnerIds.has(id));

    if (allBeginnersCleared) {
      unlockedLevels.push('intermediate');

      const intermediateScenarios = await this.prisma.scenario.findMany({
        where: { level: 'intermediate' },
        select: { id: true },
      });
      const intermediateIds = intermediateScenarios.map(s => s.id);

      const qualifyingIntermediateSessions = await this.prisma.writingSession.findMany({
        where: {
          userId,
          scenarioId: { in: intermediateIds },
          status: 'graded',
          sessionFeedback: { overallScore: { gte: 75 } },
        },
        select: { scenarioId: true },
        distinct: ['scenarioId'],
      });

      const completedIntermediateIds = new Set(qualifyingIntermediateSessions.map(s => s.scenarioId));
      const allIntermediateCleared = intermediateIds.every(id => completedIntermediateIds.has(id));

      if (allIntermediateCleared) {
        unlockedLevels.push('advanced', 'hard'); 
      }
    }

    return { unlockedLevels };
  }
}
