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

    const session =
      await this.writingSessionService.getSessionWithHistory(sessionId);
    const messages = await this.prompt.buildConversationPrompt(
      session.scenario,
      session.messages,
    );

    const ai = await this.ollama.chat(messages);
    const content = ai?.message?.content || '';

    if (!content) {
      throw new Error(
        'Failed to extract content from AI response: ' + JSON.stringify(ai),
      );
    }

    const cleanedResponse = this.sanitizeAIResponse(content);

    await this.writingSessionService.saveAssistantMessage(
      sessionId,
      cleanedResponse,
    );

    return ai.message.content;
  }

  private sanitizeAIResponse(text: string): string {
    return (
      text
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, '')

        // Remove inline code
        .replace(/`([^`]*)`/g, '$1')

        // Remove bold (**text** or __text__)
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')

        // Remove italic (*text* or _text_)
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/_(.*?)_/g, '$1')

        // Remove headings (# ## ###)
        .replace(/^#{1,6}\s+/gm, '')

        // Remove blockquotes
        .replace(/^>\s?/gm, '')

        // Remove horizontal rules
        .replace(/^[-*_]{3,}$/gm, '')

        .trim()
    );
  }
}
