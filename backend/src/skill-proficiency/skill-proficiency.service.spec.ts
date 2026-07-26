import { Test, TestingModule } from '@nestjs/testing';
import { SkillProficiencyService } from './skill-proficiency.service';

describe('SkillProficiencyService', () => {
  let service: SkillProficiencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillProficiencyService],
    }).compile();

    service = module.get<SkillProficiencyService>(SkillProficiencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
