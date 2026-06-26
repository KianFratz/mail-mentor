import { Injectable } from '@nestjs/common';
import { CreateWritingSessionDto } from './dto/create-writing-session.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class WritingSessionService {
  constructor(private prisma: PrismaService) {}

  async createWritingSession(dto: CreateWritingSessionDto, userId: string) {
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
}
