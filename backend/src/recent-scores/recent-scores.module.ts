import { Module } from '@nestjs/common';
import { RecentScoresService } from './recent-scores.service';
import { RecentScoresController } from './recent-scores.controller';

@Module({
  controllers: [RecentScoresController],
  providers: [RecentScoresService],
})
export class RecentScoresModule {}
