import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecentScoresService } from './recent-scores.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('recent-scores')
export class RecentScoresController {
  constructor(private readonly recentScoresService: RecentScoresService) {}

  @UseGuards(JwtAuthGuard)
  @SkipThrottle({ default: true, 'auth-sensitive': true })
  @Get('me')
  async getAllSessionWithFeedback(
    @CurrentUser('userId') userId: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: string,
  ) {
    return this.recentScoresService.getAllSessionWithFeedback(
      userId,
      Number(limit),
      Number(page),
    );
  }
}
