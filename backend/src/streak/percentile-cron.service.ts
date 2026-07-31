import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PercentileCronService {
  private readonly logger = new Logger(PercentileCronService.name);

  constructor(private prisma: PrismaService) {}

  // Runs every day at 2:00 AM server time
  @Cron('0 2 * * *')
  async computeMonthlyPercentiles() {
    this.logger.log('Starting monthly percentile calculation...');
    const start = Date.now();

    try {
      // prevent stale monthly percentile for inactive users
      await this.prisma.userStreak.updateMany({
        data: { monthlyPercentile: null },
      });

      const results = await this.prisma.$executeRaw`
        WITH monthly_counts AS (
          SELECT "userId", COUNT(DISTINCT date) AS active_days
          FROM "practice_logs"
          WHERE date >= date_trunc('month', CURRENT_DATE)
          GROUP BY "userId"
        ),
        calculated_ranks AS (
            SELECT "userId",
               PERCENT_RANK() OVER (ORDER BY active_days DESC) AS percentile_rank
            FROM monthly_counts
        )
        UPDATE "user_streaks" AS u
        SET "monthlyPercentile" = c.percentile_rank, "percentileUpdatedAt" = NOW()
        FROM calculated_ranks AS c
        WHERE u."userId" = c."userId"
      `;

      this.logger.log(
        `Updated percentiles for ${results} users in ${Date.now() - start}ms`,
      );
    } catch (error) {
      this.logger.error('Percentile cron failed', error);
    }
  }
}
