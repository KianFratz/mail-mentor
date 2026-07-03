import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWritingSessionDto } from './dto/create-writing-session.dto';
import { PrismaService } from 'prisma/prisma.service';
import { WritingSession } from 'src/generated/prisma/client';

@Injectable()
export class WritingSessionService {
  constructor(private prisma: PrismaService) {}

  async createWritingSession(dto: CreateWritingSessionDto, userId: string) {
    const scenarioExists = await this.prisma.scenario.findUnique({
      where: { id: dto.scenarioId },
    });

    if (!scenarioExists) {
      throw new NotFoundException(
        `Scenario with ID "${dto.scenarioId}" does not exist.`,
      );
    }

    return this.prisma.writingSession.create({
      data: {
        subjectLine: dto.subjectLine,
        textBody: dto.textBody,
        wordCount: dto.wordCount,
        scenario: {
          connect: { id: dto.scenarioId },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async findManyByUserId(userId: string): Promise<WritingSession[]> {
    return this.prisma.writingSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc'}
    });
  }
}
