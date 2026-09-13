import { Test, TestingModule } from '@nestjs/testing';
import { SkillProficiencyService } from './skill-proficiency.service';
import { PrismaService } from 'prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('SkillProficiencyService', () => {
  let service: SkillProficiencyService;
  let prisma: any;
  let cache: any;

  beforeEach(async () => {
    prisma = { writingSession: { findMany: jest.fn() } };
    cache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillProficiencyService,
        { provide: PrismaService, useValue: prisma },
        { provide: CACHE_MANAGER, useValue: cache },
      ],
    }).compile();

    service = module.get<SkillProficiencyService>(SkillProficiencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns cached zero-valued proficiency without querying Prisma', async () => {
    const result = { overall: { score: 0 }, progress: [] };
    cache.get.mockResolvedValue(result);

    await expect(service.getUserProficiencyScores('user-1')).resolves.toBe(
      result,
    );
    expect(prisma.writingSession.findMany).not.toHaveBeenCalled();
  });

  it('still returns computed data when cache writes fail', async () => {
    cache.get.mockResolvedValue(undefined);
    cache.set.mockRejectedValue(new Error('redis unavailable'));
    prisma.writingSession.findMany.mockResolvedValue([]);

    await expect(
      service.getUserProficiencyScores('user-1'),
    ).resolves.toMatchObject({ overall: { percentage: 0 } });
  });
});
