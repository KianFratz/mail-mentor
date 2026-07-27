import { Controller, Get, UseGuards } from '@nestjs/common';
import { RecentScoresService } from './recent-scores.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@Controller('recent-scores')
export class RecentScoresController {
  constructor(private readonly recentScoresService: RecentScoresService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getAllSessionWithFeedback(@CurrentUser('userId') userId: string) {
    return this.recentScoresService.getAllSessionWithFeedback(userId);
  }
}
