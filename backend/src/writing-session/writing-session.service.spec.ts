import { Test, TestingModule } from '@nestjs/testing';
import { WritingSessionService } from './writing-session.service';

describe('WritingSessionService', () => {
  let service: WritingSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WritingSessionService],
    }).compile();

    service = module.get<WritingSessionService>(WritingSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
