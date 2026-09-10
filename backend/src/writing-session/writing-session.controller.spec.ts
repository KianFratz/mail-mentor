import { Test, TestingModule } from '@nestjs/testing';
import { WritingSessionController } from './writing-session.controller';
import { WritingSessionService } from './writing-session.service';

describe('WritingSessionController', () => {
  let controller: WritingSessionController;
  let writingSessionService: {
    createWritingSession: jest.Mock;
    findManyByUserId: jest.Mock;
    getSessionWithHistory: jest.Mock;
    getFeedback: jest.Mock;
  };

  beforeEach(async () => {
    writingSessionService = {
      createWritingSession: jest.fn(),
      findManyByUserId: jest.fn(),
      getSessionWithHistory: jest.fn(),
      getFeedback: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WritingSessionController],
      providers: [
        { provide: WritingSessionService, useValue: writingSessionService },
      ],
    }).compile();

    controller = module.get<WritingSessionController>(WritingSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes the current user to session history lookup', async () => {
    writingSessionService.getSessionWithHistory.mockResolvedValue({
      id: 'session-id',
    });

    await controller.getSessionWithHistory('session-id', 'user-id');

    expect(writingSessionService.getSessionWithHistory).toHaveBeenCalledWith(
      'session-id',
      'user-id',
    );
  });

  it('passes the current user to feedback lookup', async () => {
    writingSessionService.getFeedback.mockResolvedValue({ id: 'feedback-id' });

    await controller.getSessionFeedback('session-id', 'user-id');

    expect(writingSessionService.getFeedback).toHaveBeenCalledWith(
      'session-id',
      'user-id',
    );
  });
});
