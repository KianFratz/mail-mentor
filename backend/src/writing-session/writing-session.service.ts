import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWritingSessionDto } from './dto/create-writing-session.dto';
import { PrismaService } from 'prisma/prisma.service';
import { SessionStatus, WritingSession } from 'src/generated/prisma/client';

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

  async getSessionWithHistory(sessionId: string, userId: string) {
    const session = await this.prisma.writingSession.findFirst({
      where: { id: sessionId, userId },
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

  async saveUserMessage(sessionId: string, userId: string, content: string) {
    await this.assertSessionOwner(sessionId, userId);

    return this.prisma.message.create({
      data: {
        writingSessionId: sessionId,
        role: 'USER',
        content,
      },
    });
  }

  async saveAssistantMessage(
    sessionId: string,
    userId: string,
    content: string,
  ) {
    await this.assertSessionOwner(sessionId, userId);

    return this.prisma.message.create({
      data: {
        writingSessionId: sessionId,
        role: 'ASSISTANT',
        content,
      },
    });
  }

  async saveFeedback(sessionId: string, userId: string, feedback: any) {
    await this.assertSessionOwner(sessionId, userId);
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

  async updateSessionStatus(
    sessionId: string,
    userId: string,
    status: SessionStatus,
  ) {
    await this.assertSessionOwner(sessionId, userId);

    return this.prisma.writingSession.update({
      where: { id: sessionId },
      data: { status },
    });
  }

  async getFeedback(sessionId: string, userId: string) {
    const feedback = await this.prisma.sessionFeedback.findFirst({
      where: {
        writingSessionId: sessionId,
        writingSession: { userId },
      },
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
    userId: string,
    wordCount: number,
  ) {
    await this.assertSessionOwner(sessionId, userId);

    return this.prisma.writingSession.update({
      where: { id: sessionId },
      data: {
        wordCount: {
          increment: wordCount,
        },
      },
    });
  }

  private async assertSessionOwner(sessionId: string, userId: string) {
    const session = await this.prisma.writingSession.findFirst({
      where: { id: sessionId, userId },
      select: { id: true },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID "${sessionId}" not found.`);
    }
  }
}
