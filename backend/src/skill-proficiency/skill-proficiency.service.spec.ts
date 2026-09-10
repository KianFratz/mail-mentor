import { Test, TestingModule } from '@nestjs/testing';
import { SkillProficiencyService } from './skill-proficiency.service';
import { PrismaService } from 'prisma/prisma.service';

describe('SkillProficiencyService', () => {
  let service: SkillProficiencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillProficiencyService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<SkillProficiencyService>(SkillProficiencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
