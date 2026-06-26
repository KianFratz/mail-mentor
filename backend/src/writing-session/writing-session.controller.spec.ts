import { Test, TestingModule } from '@nestjs/testing';
import { WritingSessionController } from './writing-session.controller';
import { WritingSessionService } from './writing-session.service';

describe('WritingSessionController', () => {
  let controller: WritingSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WritingSessionController],
      providers: [WritingSessionService],
    }).compile();

    controller = module.get<WritingSessionController>(WritingSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
