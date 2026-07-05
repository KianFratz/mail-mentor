import { Injectable } from '@nestjs/common';
import { WritingSessionService } from 'src/writing-session/writing-session.service';
import { PromptService } from './prompt/prompt.service';
import { OllamaService } from './ollama/ollama.service';

@Injectable()
export class AiService {
  constructor(
    private writingSessionService: WritingSessionService,
    private prompt: PromptService,
    private ollama: OllamaService,
  ) {}

  async reply(sessionId: string, userMessage: string) {
    await this.writingSessionService.saveUserMessage(sessionId, userMessage);

    const session = await this.writingSessionService.getSessionWithHistory(sessionId)
    const messages = await this.prompt.buildConversationPrompt(session.scenario, session.messages);
   
    const ai = await this.ollama.chat(messages);

    const content = ai?.message?.content || "";

    if (!content) {
      throw new Error("Failed to extract content from AI response: " + JSON.stringify(ai));
    }

    await this.writingSessionService.saveAssistantMessage(
      sessionId,
      ai.message.content,
    );

    return ai.message.content;
  }
}
