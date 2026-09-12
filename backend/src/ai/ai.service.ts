import {
  BadRequestException,
  GatewayTimeoutException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { WritingSessionService } from 'src/writing-session/writing-session.service';
import { PromptService } from './prompt/prompt.service';
import { OllamaService } from './ollama/ollama.service';
import { StreakService } from 'src/streak/streak.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubscriptionService } from 'src/subscription/subscription.service';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AiService {
  constructor(
    private writingSessionService: WritingSessionService,
    private prompt: PromptService,
    private ollama: OllamaService,
    private streakService: StreakService,
    private subscriptionService: SubscriptionService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async reply(
    userId: string,
    sessionId: string,
    userMessage: string,
    wordCount: number,
  ) {
    await this.subscriptionService.checkUsage(userId, 'aiReply');
    await this.writingSessionService.saveUserMessage(
      sessionId,
      userId,
      userMessage,
    );
    await this.writingSessionService.updateSessionContent(
      sessionId,
      userId,
      wordCount,
    );

    const session = await this.writingSessionService.getSessionWithHistory(
      sessionId,
      userId,
    );
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
        userId,
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

  async generateFeedback(sessionId: string, userId: string, localDate: string) {
    await this.subscriptionService.checkUsage(userId, 'feedback');

    const session = await this.writingSessionService.getSessionWithHistory(
      sessionId,
      userId,
    );

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
        userId,
        feedback,
      );

      await this.writingSessionService.updateSessionStatus(
        sessionId,
        userId,
        'graded',
      );
      await this.streakService.recordPractice(userId, localDate);
      this.eventEmitter.emit('feedback.created', {
        userId,
        sessionId,
      });

      await this.cacheManager.del(`skill-proficiency:${userId}`);
      await this.clearRecentScoresCache(userId);

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

  private async clearRecentScoresCache(userId: string) {
    const keyIndex = `recent-scores:${userId}:keys`;
    const keys = (await this.cacheManager.get<string[]>(keyIndex)) ?? [];

    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
    await this.cacheManager.del(keyIndex);
  }
}
