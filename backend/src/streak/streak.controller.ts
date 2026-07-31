import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StreakService } from './streak.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { LogPracticeDto } from './dto/create-streak.dto';
import { PercentileCronService } from './percentile-cron.service';

@Controller('streaks')
export class StreakController {
  constructor(
    private readonly streakService: StreakService,
    private percentileCronService: PercentileCronService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getStreak(@CurrentUser('userId') userId: string) {
    return this.streakService.getStreak(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/week')
  async getWeeklyStreak(@CurrentUser('userId') userId: string) {
    return this.streakService.getWeeklyStreak(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('log')
  async logStreak(
    @CurrentUser('userId') userId: string,
    @Body() dto: LogPracticeDto,
  ) {
    return this.streakService.recordPractice(userId, dto.localDate);
  }

  // @UseGuards(JwtAuthGuard, Admin)
  @Post('admin/recompute-percentiles')
  async trigger() {
    return this.percentileCronService.computeMonthlyPercentiles();
  }
}
