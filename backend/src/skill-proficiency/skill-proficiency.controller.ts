import { Controller, Get, UseGuards } from '@nestjs/common';
import { SkillProficiencyService } from './skill-proficiency.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { WritingSessionService } from 'src/writing-session/writing-session.service';

@Controller('skill-proficiency')
export class SkillProficiencyController {
  constructor(
    private readonly skillProficiencyService: SkillProficiencyService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('proficiency-scores')
  async proficiencyScores(@CurrentUser('userId') userId: string) {
    return this.skillProficiencyService.getUserProficiencyScores(userId);
  }
}
