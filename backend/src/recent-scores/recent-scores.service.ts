import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RecentScoresService {
  constructor(private prisma: PrismaService) {}

  async getAllSessionWithFeedback(userId: string, limit?: number, page = 1) {
    return this.prisma.writingSession.findMany({
      where: { userId, status: 'graded' },
      include: { scenario: true, sessionFeedback: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: limit ? (page - 1) * limit : undefined,
    });
  }
}
