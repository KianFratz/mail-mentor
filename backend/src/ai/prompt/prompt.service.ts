import { Injectable } from '@nestjs/common';
import { Scenario, Message } from 'src/generated/prisma/client';

type OllamaRole = 'user' | 'system';

interface ChatMessage {
  role: OllamaRole;
  content: string;
}

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

  async buildFeedbackPrompt(
    scenario: Scenario,
    history: Message[],
  ): Promise<ChatMessage[]> {
    const userMessages = history
      .filter((m) => m.role === 'USER')
      .map((m, i) => `[Message ${i + 1}]: ${m.content}`)
      .join('\n\n');

    const fullConversation = history
      .filter((m, i) => `[${m.role} - Message ${i + 1}]: ${m.content}`)
      .join('\n\n');

    const systemPrompt = `You are an expert email writing coach and assessor. 
      You will evaluate an email writing performance in a practice scenario.
      SCENARIO CONTEXT:
      - Title: ${scenario.title}
      - Description: ${scenario.description}
      - Expected tone: ${scenario.aiPersona ?? 'professional'}
      ASSESSMENT RUBRIC (evaluate each independently):
      1. Grammar (20%) — Correct grammar, spelling, punctuation, sentence structure
      2. Clarity (20%) — Message is understandable, has clear purpose, logical flow
      3. Professional Tone (15%) — Appropriate formality for the scenario context
      4. Structure (15%) — Proper email organization: greeting → context → body → CTA → closing
      5. Conciseness (15%) — Avoids redundancy, wordiness, off-topic content
      6. Etiquette (15%) — Proper greetings, closings, polite language
      INSTRUCTIONS:
      - Score each category 0–100
      - Calculate overall score as weighted average
      - For EACH issue, cite the EXACT excerpt from the user messages
      - Include the message number (messageIndex, 0-based) so the UI can highlight it
      - Classify severity as "minor", "moderate", or "major"
      - Provide a concrete suggestion for each issue
      - List 2–4 strengths (things the user did well)
      - List 2–4 areas for improvement
      - Write a suggested revision of the user's FIRST message, showing how it could be improved
      - Explain WHY each change in the revision is beneficial
      IMPORTANT: Respond ONLY with valid JSON matching this exact schema (no markdown, no explanation outside JSON):
      {
        "overallScore": number,
        "categories": [
          {
            "name": string,
            "score": number,
            "maxScore": 100,
            "feedback": string,
            "issues": [
              {
                "messageIndex": number,
                "excerpt": string,
                "issue": string,
                "suggestion": string,
                "severity": "minor" | "moderate" | "major"
              }
            ]
          }
        ],
        "strengths": string[],
        "areasForImprovement": string[],
      "suggestedRevision": {
          "original": string,
          "revised": string,
          "explanation": string
        }
      }`;

    return [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Here is the full convesation to assess:\n\n${fullConversation}\n\nThe user's messages to evaluate:\n\n${userMessages}\n\nPlease provide your assessment as JSON.`,
      },
    ];
  }
}
