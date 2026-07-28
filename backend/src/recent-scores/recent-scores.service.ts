import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class RecentScoresService {
  constructor(private prisma: PrismaService) {}

  async getAllSessionWithFeedback(userId: string, limit?: number, page = 1) {
    const where = { userId, status: 'graded' as const };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.writingSession.findMany({
        where,
        include: { scenario: true, sessionFeedback: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: limit ? (page - 1) * limit : undefined,
      }),
      this.prisma.writingSession.count({ where }),
    ]);

    return { data, total, page, limit };
  }
}
