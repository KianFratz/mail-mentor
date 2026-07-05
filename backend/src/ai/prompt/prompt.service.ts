import { Injectable } from '@nestjs/common';
import { Scenario, Message } from 'src/generated/prisma/client';

@Injectable()
export class PromptService {
  async buildConversationPrompt(scenario: Scenario, history: Message[]) {
    const systemPrompt = this.buildSystemPrompt(scenario);

    return [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...history.map((m) => ({
        role: m.role === 'USER' ? 'user' : 'assistant',
        content: m.content,
      })),
    ];
  }

  private buildSystemPrompt(scenario: Scenario): string {
    return `You are roleplaying as a character in the following email-writing scenario.
    Scenario: ${scenario.title}
    Context: ${scenario.description}
    Persona/tone you must maintain: ${scenario.aiPersona ?? 'professinal but realistic'}
    
    Stay in chracter for the entire conversation. Response as the counterpart in this scenario would - do not break character to give writing feedback unless explicily asked. Keep response concise and realistic for and email/chat exchange.`;
  }
}
