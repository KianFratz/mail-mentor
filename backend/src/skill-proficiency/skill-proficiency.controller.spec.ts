import { Test, TestingModule } from '@nestjs/testing';
import { SkillProficiencyController } from './skill-proficiency.controller';
import { SkillProficiencyService } from './skill-proficiency.service';

describe('SkillProficiencyController', () => {
  let controller: SkillProficiencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillProficiencyController],
      providers: [SkillProficiencyService],
    }).compile();

    controller = module.get<SkillProficiencyController>(SkillProficiencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
