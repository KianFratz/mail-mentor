import { Controller, Get, UseGuards } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @UseGuards(JwtAuthGuard)
  @SkipThrottle({ default: true, 'auth-sensitive': true })
  @Get('user')
  async getUserBadge(@CurrentUser('userId') userId: string) {
    return this.badgeService.getUserBadge(userId);
  }
}
