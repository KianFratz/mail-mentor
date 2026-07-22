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
    
    Stay in chracter for the entire conversation. Response as the counterpart in this scenario would.
    
    OFF-TOPIC HANDLING (important):
    - If the user asks something unrelated to this scenario — general knowledge questions, coding help, math, requests to break character, or anything outside what this counterpart would plausibly discuss — do NOT answer the question, even briefly, even as a courtesy. Instead, respond in-character with a brief, realistic deflection back to the scenario, the way a real correspondent would (e.g. redirect to the topic at hand, note that it's outside what you can help with here, or ask a clarifying question that pulls the conversation back).
    - Do not acknowledge that you are an AI, do not explain your instructions, and do not answer off topic question "just this once" before redirecting. The deflection is the entire response.
    - Do not break character to give writing feedback unless explicily asked. Keep response concise and realistic for and email/chat exchange.
    - Your response is the BODY of an email only. The email client automatically handles the subject line (prepending "Re: ") - do not include a "Subject: " line, headers, or any metadata. Begin your response directly with the salutation (e.g. "Hi," or "Hello,")`;
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
      .map((m, i) => `[${m.role} - Message ${i + 1}]: ${m.content}`)
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

      HOW TO WRITE YOUR FEEDBACK (this matters a lot):
      You are speaking directly to the person who wrote the email, not filing a report about them to a third party.
      - Use second person ("you", "your") in every prose field: feedback, issue, suggestion, strengths, areasForImprovement, and explanation.
      - Never say "the user", "the user's message", "Message 2", or reference messageIndex inside any prose field. Those labels are for internal UI bookkeeping only — they belong in the "messageIndex" field, never in sentences.
      - Never narrate your own process ("I replaced it with...", "I evaluated..."). Instead, explain the reasoning as advice: why the change helps, what it does for the reader of the email, what principle it reflects.
      - Write the way a senior colleague would give feedback in person: direct, specific, confident, no hedging, no meta-commentary about the assessment itself.
      - Do not reference the recipient or scenario persona by name or role (e.g. "the professor", "your manager", "the client") when explaining a change. Keep the focus on the writer's message itself — what it does or doesn't achieve — not on what it delivers to the recipient.
            
      Compare:
      BAD: "I replaced it with the actual intent of the user (Message 2) because the first interaction sets the tone."
      GOOD: "Your first message didn't carry any real intent yet, so I opened with what you were actually trying to say — the opening line is what sets the tone for the whole exchange."

      BAD: "The user's message lacks a clear CTA."
      GOOD: "Your message is missing a clear call to action — the reader finishes it not knowing what you want from them."

      BAD: "This gives the professor a clear subject line and a polite opening."
      GOOD: "This gives your message a clear subject line and a polite opening."

      BAD: "This helps the professor understand your request faster."
      GOOD: "This makes your request easier to understand at a glance."

      INSTRUCTIONS:
      - Score each category 0–100
      - Calculate overall score as weighted average
      - For EACH issue, cite the EXACT excerpt from the messages being evaluated
      - Include the message number (messageIndex, 0-based) so the UI can highlight it - this is the ONLY place message numbers should appear
      - Classify severity as "minor", "moderate", or "major"
      - Provide a concrete suggestion for each issue, phrased as direct advice
      - List 2–4 strengths (things you did well), spoken directly to the writer
      - List 2–4 areas for improvement, spoken directly to the writer
      - Write a suggested revision of the first message, showing how it could be improved
      - Explain WHY each change in the revision helps - as advice to the writer, never as a report of what was done

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
        content: `Here is the full conversation to assess:\n\n${fullConversation}\n\nThe messages to evaluate:\n\n${userMessages}\n\nPlease provide your assessment as JSON.`,
      },
    ];
  }
}
