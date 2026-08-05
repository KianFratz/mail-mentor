import { Module } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { BadgeController } from './badge.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [BadgeController],
  providers: [BadgeService],
})
export class BadgeModule {}
