import { Test, TestingModule } from '@nestjs/testing';
import { StreakController } from './streak.controller';
import { PercentileCronService } from './percentile-cron.service';
import { StreakService } from './streak.service';

describe('StreakController', () => {
  let controller: StreakController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreakController],
      providers: [
        { provide: StreakService, useValue: {} },
        { provide: PercentileCronService, useValue: {} },
      ],
    }).compile();

    controller = module.get<StreakController>(StreakController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
