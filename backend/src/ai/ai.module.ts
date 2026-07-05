import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { OllamaService } from './ollama/ollama.service';
import { PromptService } from './prompt/prompt.service';

@Module({
  providers: [AiService, OllamaService, PromptService],
  controllers: [AiController]
})
export class AiModule {}
