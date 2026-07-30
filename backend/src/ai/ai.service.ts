import {
  BadRequestException,
  GatewayTimeoutException,
  Injectable,
} from '@nestjs/common';
import { WritingSessionService } from 'src/writing-session/writing-session.service';
import { PromptService } from './prompt/prompt.service';
import { OllamaService } from './ollama/ollama.service';
import { StreakService } from 'src/streak/streak.service';
import { UserScalarFieldEnum } from 'src/generated/prisma/internal/prismaNamespace';

@Injectable()
export class AiService {
  constructor(
    private writingSessionService: WritingSessionService,
    private prompt: PromptService,
    private ollama: OllamaService,
    private streakService: StreakService,
  ) {}

  async reply(sessionId: string, userMessage: string, wordCount: number) {
    await this.writingSessionService.saveUserMessage(sessionId, userMessage);
    await this.writingSessionService.updateSessionContent(sessionId, wordCount);

    const session =
      await this.writingSessionService.getSessionWithHistory(sessionId);
    const messages = await this.prompt.buildConversationPrompt(
      session.scenario,
      session.messages,
    );

    try {
      const ai = await this.aiResponseTimeOut(
        this.ollama.chat(messages),
        55000,
      );
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
    } catch (err) {
      if (err instanceof Error && err.message === 'AI_TIMEOUT') {
        throw new GatewayTimeoutException('The AI take too long to response.');
      }
      throw err;
    }
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

  async generateFeedback(sessionId: string, userId, localDate) {
    const session =
      await this.writingSessionService.getSessionWithHistory(sessionId);

    const userMessages = session.messages.filter((m) => m.role === 'USER');
    if (userMessages.length === 0) {
      throw new BadRequestException(
        'No user messages found on this session to evaluate.',
      );
    }

    const messages = await this.prompt.buildFeedbackPrompt(
      session.scenario,
      session.messages,
    );

    try {
      const ai = await this.aiResponseTimeOut(
        this.ollama.chat(messages),
        55000,
      );

      const content = ai?.message?.content || '';

      if (!content) {
        throw new Error('Failed to get feedback from AI:' + JSON.stringify(ai));
      }

      const cleanedContent = content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/<\/?p\/?>/g, '')
        .trim();

      const parsed = JSON.parse(cleanedContent);

      const feedback = {
        overallScore: parsed.overallScore,
        categoryScores: parsed.categories,
        strengths: parsed.strengths,
        improvements: parsed.areasForImprovement,
        suggestedRevision: parsed.suggestedRevision,
      };

      const saved = await this.writingSessionService.saveFeedback(
        sessionId,
        feedback,
      );

      await this.writingSessionService.updateSessionStatus(sessionId, 'graded');
      await this.streakService.recordPractice(userId, localDate);

      return saved;
    } catch (err) {
      if (err instanceof Error && err.message === 'AI_TIMEOUT') {
        throw new GatewayTimeoutException(
          'The AI take too long to generate feedback.',
        );
      }
      throw err;
    }
  }

  private async aiResponseTimeOut<T>(
    promise: Promise<T>,
    timeoutMs: number,
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('AI_TIMEOUT')), timeoutMs),
      ),
    ]);
  }
}
