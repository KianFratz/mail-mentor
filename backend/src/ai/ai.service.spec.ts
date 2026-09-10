import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadgeService } from 'src/badge/badge.service';
import { StreakService } from 'src/streak/streak.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { WritingSessionService } from 'src/writing-session/writing-session.service';
import { OllamaService } from './ollama/ollama.service';
import { PromptService } from './prompt/prompt.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: WritingSessionService, useValue: {} },
        { provide: PromptService, useValue: {} },
        { provide: OllamaService, useValue: {} },
        { provide: StreakService, useValue: {} },
        { provide: SubscriptionService, useValue: {} },
        { provide: BadgeService, useValue: {} },
        { provide: EventEmitter2, useValue: {} },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
