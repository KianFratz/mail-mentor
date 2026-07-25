import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWritingSessionDto } from './dto/create-writing-session.dto';
import { PrismaService } from 'prisma/prisma.service';
import { SessionStatus, WritingSession } from 'src/generated/prisma/client';
import { error } from 'console';
import { exit } from 'process';

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
      include: { scenario: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSessionWithHistory(sessionId: string) {
    const session = await this.prisma.writingSession.findUnique({
      where: { id: sessionId },
      include: {
        scenario: true,
        messages: { orderBy: { createdAt: 'asc' } },
        sessionFeedback: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID "${sessionId}" not found.`);
    }

    return session;
  }

  async saveUserMessage(sessionId: string, content: string) {
    return this.prisma.message.create({
      data: {
        writingSessionId: sessionId,
        role: 'USER',
        content,
      },
    });
  }

  async saveAssistantMessage(sessionId: string, content: string) {
    return this.prisma.message.create({
      data: {
        writingSessionId: sessionId,
        role: 'ASSISTANT',
        content,
      },
    });
  }

  async saveFeedback(sessionId: string, feedback: any) {
    await this.isFeedbackExisting(sessionId);

    return this.prisma.sessionFeedback.create({
      data: {
        writingSessionId: sessionId,
        overallScore: feedback.overallScore,
        categoryScores: feedback.categoryScores,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
        suggestedRevision: feedback.suggestedRevision,
      },
    });
  }

  async updateSessionStatus(sessionId: string, status: SessionStatus) {
    return this.prisma.writingSession.update({
      where: { id: sessionId },
      data: { status },
    });
  }

  async getFeedback(sessionId: string) {
    const feedback = await this.prisma.sessionFeedback.findUnique({
      where: { writingSessionId: sessionId },
    });

    if (!feedback) {
      throw new NotFoundException(`No feedback found for "${sessionId}".`);
    }

    return feedback;
  }

  private async isFeedbackExisting(sessionId: string) {
    const existingFeedback = await this.prisma.sessionFeedback.findUnique({
      where: { writingSessionId: sessionId },
    });

    if (existingFeedback) {
      throw new BadRequestException('Feedback already exists for this session');
    }
  }

  async updateSessionContent(
    sessionId: string,
    wordCount: number,
  ) {
    return this.prisma.writingSession.update({
      where: { id: sessionId },
      data: {
        wordCount: {
          increment: wordCount,
        },
      },
    });
  }
}
