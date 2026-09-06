import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionUsageResetCron } from './subscription-usage-reset.cron';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionUsageResetCron],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
