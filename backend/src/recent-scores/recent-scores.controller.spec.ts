import { Test, TestingModule } from '@nestjs/testing';
import { RecentScoresController } from './recent-scores.controller';
import { RecentScoresService } from './recent-scores.service';

describe('RecentScoresController', () => {
  let controller: RecentScoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecentScoresController],
      providers: [RecentScoresService],
    }).compile();

    controller = module.get<RecentScoresController>(RecentScoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
