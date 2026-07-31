import { Module } from '@nestjs/common';
import { StreakService } from './streak.service';
import { StreakController } from './streak.controller';
import { PercentileCronService } from './percentile-cron.service';

@Module({
  controllers: [StreakController],
  providers: [StreakService, PercentileCronService],
})
export class StreakModule {}
