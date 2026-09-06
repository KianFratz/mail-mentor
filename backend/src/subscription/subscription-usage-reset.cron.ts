import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SubscriptionUsageResetCron {
  private readonly logger = new Logger(SubscriptionUsageResetCron.name);
  constructor(private readonly prisma: PrismaService) {}

  // Runs every day at midnight (server time)
  @Cron('0 0 * * *')
  async resetDailyUsage() {
    this.logger.log('Resetting daily subscription usage counters...');

    try {
      const result = await this.prisma.subscription.updateMany({
        data: {
          aiReplyUsedToday: 0,
          feedbackUsedToday: 0,
          usageResetAt: new Date(),
        },
      });

      this.logger.log(
        `Reset usage counters for ${result.count} subscriptions.`,
      );
    } catch (error) {
      this.logger.error('Usage reset cron failed', error);
    }
  }
}
