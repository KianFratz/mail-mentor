import { Module } from '@nestjs/common';
import { SkillProficiencyService } from './skill-proficiency.service';
import { SkillProficiencyController } from './skill-proficiency.controller';

@Module({
  controllers: [SkillProficiencyController],
  providers: [SkillProficiencyService],
})
export class SkillProficiencyModule {}
