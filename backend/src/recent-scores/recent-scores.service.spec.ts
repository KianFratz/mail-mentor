import { Test, TestingModule } from '@nestjs/testing';
import { RecentScoresService } from './recent-scores.service';

describe('RecentScoresService', () => {
  let service: RecentScoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecentScoresService],
    }).compile();

    service = module.get<RecentScoresService>(RecentScoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
