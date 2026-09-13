import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadgeService } from 'src/badge/badge.service';
import { StreakService } from 'src/streak/streak.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { WritingSessionService } from 'src/writing-session/writing-session.service';
import { OllamaService } from './ollama/ollama.service';
import { PromptService } from './prompt/prompt.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { cacheKeys } from 'src/cache/cache-policy';

describe('AiService', () => {
  let service: AiService;
  let writingSessionService: any;
  let promptService: any;
  let ollamaService: any;
  let streakService: any;
  let subscriptionService: any;
  let eventEmitter: any;
  let cache: any;

  beforeEach(async () => {
    writingSessionService = {
      getSessionWithHistory: jest.fn(),
      saveFeedback: jest.fn(),
      updateSessionStatus: jest.fn(),
    };
    promptService = { buildFeedbackPrompt: jest.fn() };
    ollamaService = { chat: jest.fn() };
    streakService = { recordPractice: jest.fn() };
    subscriptionService = { checkUsage: jest.fn() };
    eventEmitter = { emit: jest.fn() };
    cache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: WritingSessionService, useValue: writingSessionService },
        { provide: PromptService, useValue: promptService },
        { provide: OllamaService, useValue: ollamaService },
        { provide: StreakService, useValue: streakService },
        { provide: SubscriptionService, useValue: subscriptionService },
        { provide: BadgeService, useValue: {} },
        { provide: EventEmitter2, useValue: eventEmitter },
        { provide: CACHE_MANAGER, useValue: cache },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
    jest
      .spyOn(service as any, 'aiResponseTimeOut')
      .mockImplementation((promise: Promise<unknown>) => promise);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('invalidates dashboard caches after feedback is successfully graded', async () => {
    const savedFeedback = { id: 'feedback-1' };
    writingSessionService.getSessionWithHistory.mockResolvedValue({
      scenario: {},
      messages: [{ role: 'USER', content: 'Draft' }],
    });
    promptService.buildFeedbackPrompt.mockResolvedValue([]);
    ollamaService.chat.mockResolvedValue({
      message: {
        content: JSON.stringify({
          overallScore: 80,
          categories: [],
          strengths: [],
          areasForImprovement: [],
          suggestedRevision: {},
        }),
      },
    });
    writingSessionService.saveFeedback.mockResolvedValue(savedFeedback);

    await expect(
      service.generateFeedback('session-1', 'user-1', '2026-09-13'),
    ).resolves.toBe(savedFeedback);

    expect(cache.del).toHaveBeenCalledWith(
      cacheKeys.skillProficiency('user-1'),
    );
    expect(cache.del).toHaveBeenCalledWith(cacheKeys.unlockedLevels('user-1'));
    expect(cache.set).toHaveBeenCalledWith(
      cacheKeys.recentScoresGeneration('user-1'),
      expect.any(String),
      expect.any(Number),
    );
  });

  it('does not fail successful feedback when Redis invalidation fails', async () => {
    writingSessionService.getSessionWithHistory.mockResolvedValue({
      scenario: {},
      messages: [{ role: 'USER', content: 'Draft' }],
    });
    promptService.buildFeedbackPrompt.mockResolvedValue([]);
    ollamaService.chat.mockResolvedValue({
      message: {
        content: JSON.stringify({
          overallScore: 80,
          categories: [],
          strengths: [],
          areasForImprovement: [],
          suggestedRevision: {},
        }),
      },
    });
    writingSessionService.saveFeedback.mockResolvedValue({ id: 'feedback-1' });
    cache.del.mockRejectedValue(new Error('redis unavailable'));
    cache.set.mockRejectedValue(new Error('redis unavailable'));

    await expect(
      service.generateFeedback('session-1', 'user-1', '2026-09-13'),
    ).resolves.toEqual({ id: 'feedback-1' });
  });
});
