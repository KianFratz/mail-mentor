import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { OllamaService } from './ollama/ollama.service';
import { PromptService } from './prompt/prompt.service';
import { WritingSessionService } from 'src/writing-session/writing-session.service';
import { WritingSessionModule } from 'src/writing-session/writing-session.module';
import { StreakService } from 'src/streak/streak.service';
import { BadgeService } from 'src/badge/badge.service';

@Module({
  imports: [WritingSessionModule],
  providers: [
    AiService,
    OllamaService,
    PromptService,
    WritingSessionService,
    StreakService,
    BadgeService,
  ],
  exports: [AiService],
})
export class AiModule {}
