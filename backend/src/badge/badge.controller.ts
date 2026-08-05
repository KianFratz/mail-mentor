import { Controller, Get, UseGuards } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get('')
  async getAllBadgesWithProgerss() {
    return await this.badgeService.getAllBadgesWithProgerss();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserBadge(@CurrentUser('userId') userId: string) {
    return this.badgeService.getUserBadge(userId);
  }
}
