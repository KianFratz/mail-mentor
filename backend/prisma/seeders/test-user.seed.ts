import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { BadgeService } from 'src/badge/badge.service';
import {
  MessageRole,
  SessionStatus,
  SkillLevel,
  UserRole,
} from 'src/generated/prisma/enums';

const TEST_USER_EMAIL = 'testuser@mailmentor.dev';
const TEST_USER_PASSWORD = '123123123';

export async function seedTestUser(prisma: PrismaService) {
  const scenarios = await prisma.scenario.findMany();
  if (scenarios.length === 0) {
    throw new Error(
      'No scenarios found. Run your scenario seeder first, then run this one.',
    );
  }
  const pickScenario = (i: number) => scenarios[i % scenarios.length];

  const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 10);

  const testUser = await prisma.user.upsert({
    where: { email: TEST_USER_EMAIL },
    update: {},
    create: {
      email: TEST_USER_EMAIL,
      password: hashedPassword,
      name: 'Test User',
      role: UserRole.student,
      currentLevel: SkillLevel.intermediate,
      xpTotal: 450,
      lastActiveAt: new Date(),
      authProviders: ['LOCAL'],
    },
  });

  await prisma.writingSession.deleteMany({ where: { userId: testUser.id } });

  // 1. IN_PROGRESS — user started writing, hasn't submitted/graded yet. Minimal/no AI turns.
  await prisma.writingSession.create({
    data: {
      userId: testUser.id,
      status: SessionStatus.in_progress,
      scenarioId: pickScenario(0).id,
      subjectLine: 'Following up on our meeting',
      textBody:
        'Hi Alex,\n\nJust wanted to follow up on what we discussed last week regarding the',
      wordCount: 14,
      messages: {
        create: [
          {
            role: MessageRole.ASSISTANT,
            content:
              "Hi! I'm playing the role of Alex in this scenario. Whenever you're ready, go ahead and start your email.",
          },
        ],
      },
    },
  });

  // 2. IN_PROGRESS — active session with user turn, AI hasn't graded it yet.
  await prisma.writingSession.create({
    data: {
      userId: testUser.id,
      status: SessionStatus.in_progress,
      scenarioId: pickScenario(1).id,
      subjectLine: 'Re: Project timeline concerns',
      textBody:
        'Hi Jordan,\n\nThanks for flagging this. I understand the concern about the timeline, and I want to make sure we address it head-on rather than let it slip. Could we set up a quick call this week to realign on scope?\n\nBest,\nTest User',
      wordCount: 42,
      messages: {
        create: [
          {
            role: MessageRole.ASSISTANT,
            content:
              "Hi, this is Jordan. I'm a little worried we're not going to hit the March deadline given the current scope.",
          },
          {
            role: MessageRole.USER,
            content:
              'Thanks for flagging this. I understand the concern about the timeline, and I want to make sure we address it head-on rather than let it slip. Could we set up a quick call this week to realign on scope?',
          },
        ],
      },
    },
  });

  // 3. GRADED — strong performance, high score, few/no improvements.
  await prisma.writingSession.create({
    data: {
      userId: testUser.id,
      status: SessionStatus.graded,
      scenarioId: pickScenario(2).id,
      subjectLine: 'Thank you for the opportunity',
      textBody:
        "Hi Ms. Rivera,\n\nThank you so much for taking the time to interview me yesterday. I really enjoyed learning more about the team's roadmap and how the role contributes to it. I'm even more excited about the opportunity after our conversation.\n\nPlease let me know if there's anything else you need from me in the meantime.\n\nBest regards,\nTest User",
      wordCount: 58,
      messages: {
        create: [
          {
            role: MessageRole.ASSISTANT,
            content:
              "Hi, this is Ms. Rivera. Thanks for coming in yesterday — feel free to send a follow-up if you'd like.",
          },
          {
            role: MessageRole.USER,
            content:
              "Thank you so much for taking the time to interview me yesterday. I really enjoyed learning more about the team's roadmap and how the role contributes to it. I'm even more excited about the opportunity after our conversation.",
          },
        ],
      },
      sessionFeedback: {
        create: {
          overallScore: 92,
          categoryScores: [
            { name: 'Clarity', score: 90, maxScore: 100, feedback: 'Your message is very clear and easy to read.', issues: [] },
            { name: 'Professional Tone', score: 100, maxScore: 100, feedback: 'You maintained a warm yet professional tone throughout.', issues: [] },
            { name: 'Structure', score: 90, maxScore: 100, feedback: 'The structure of your email is logical and flows well.', issues: [] },
            { name: 'Grammar', score: 90, maxScore: 100, feedback: 'No major grammatical errors were found.', issues: [] },
            { name: 'Etiquette', score: 100, maxScore: 100, feedback: 'Excellent use of greetings and polite language.', issues: [] },
            { name: 'Conciseness', score: 90, maxScore: 100, feedback: 'The length is appropriate for a thank-you note.', issues: [] },
          ],
          strengths: [
            'Warm, genuine tone that still reads as professional',
            'Clear call-forward without being pushy',
            'Appropriate length for a thank-you note',
          ],
          improvements: [],
          suggestedRevision: {
            original: "Hi Ms. Rivera,\n\nThank you so much for taking the time to interview me yesterday. I really enjoyed learning more about the team's roadmap and how the role contributes to it. I'm even more excited about the opportunity after our conversation.\n\nPlease let me know if there's anything else you need from me in the meantime.\n\nBest regards,\nTest User",
            revised: "Hi Ms. Rivera,\n\nThank you for taking the time to interview me yesterday. I really enjoyed learning about the team's roadmap and how this role contributes to it. Our conversation left me even more excited about the opportunity.\n\nPlease let me know if there's anything else you need from me in the meantime.\n\nBest regards,\nTest User",
            explanation: "I made a few minor tweaks to tighten the sentences and make them flow better, without losing your enthusiastic tone.",
          },
        },
      },
    },
  });

  // 4. GRADED — weaker performance, lower score, real improvement notes.
  await prisma.writingSession.create({
    data: {
      userId: testUser.id,
      status: SessionStatus.graded,
      scenarioId: pickScenario(3).id,
      subjectLine: 'need the report',
      textBody:
        'hey can u send me the report asap i need it for the meeting today',
      wordCount: 13,
      messages: {
        create: [
          {
            role: MessageRole.ASSISTANT,
            content: 'Hi, this is Sam from Finance. What did you need from me?',
          },
          {
            role: MessageRole.USER,
            content:
              'hey can u send me the report asap i need it for the meeting today',
          },
        ],
      },
      sessionFeedback: {
        create: {
          overallScore: 48,
          categoryScores: [
            {
              name: 'Clarity',
              score: 50,
              maxScore: 100,
              feedback: "Your message doesn't provide enough context for Sam to know which report you're talking about.",
              issues: [
                {
                  messageIndex: 1,
                  excerpt: "hey can u send me the report asap i need it for the meeting today",
                  issue: "No context given for the request.",
                  suggestion: "Mention which report and which meeting so the reader doesn't have to ask a follow-up question.",
                  severity: "major"
                }
              ]
            },
            {
              name: 'Professional Tone',
              score: 30,
              maxScore: 100,
              feedback: "The tone is overly casual for a workplace exchange.",
              issues: [
                {
                  messageIndex: 1,
                  excerpt: "hey can u send me the report asap",
                  issue: 'Overly casual tone and abbreviations ("u", "asap").',
                  suggestion: 'Spell out words fully and soften the urgency, e.g. "Could you send it over when you get a chance today?"',
                  severity: "moderate"
                }
              ]
            },
            {
              name: 'Structure',
              score: 40,
              maxScore: 100,
              feedback: "The email is missing standard structural elements.",
              issues: []
            },
            {
              name: 'Grammar',
              score: 60,
              maxScore: 100,
              feedback: "There is a lack of capitalization and punctuation.",
              issues: []
            },
            {
              name: 'Etiquette',
              score: 30,
              maxScore: 100,
              feedback: "You forgot standard greetings and sign-offs.",
              issues: [
                {
                  messageIndex: 1,
                  excerpt: "hey can u send me the report asap i need it for the meeting today",
                  issue: "Missing greeting and sign-off.",
                  suggestion: 'Open with "Hi Sam," and close with a sign-off like "Thanks, Test User" to keep it professional.',
                  severity: "major"
                }
              ]
            },
            {
              name: 'Conciseness',
              score: 50,
              maxScore: 100,
              feedback: "While short, it lacks necessary information.",
              issues: []
            },
          ],
          strengths: ['Message is short and to the point'],
          improvements: [
            'Add a professional greeting and sign-off',
            'Spell out abbreviations like "u" and "asap"',
            'Provide more context about which report and meeting you mean',
          ],
          suggestedRevision: {
            original: "hey can u send me the report asap i need it for the meeting today",
            revised: "Hi Sam,\n\nCould you send over the Q1 report when you get a chance? I need it ahead of today's 3 PM meeting.\n\nThanks,\nTest User",
            explanation: "I added a professional greeting and sign-off, spelled out your abbreviations, and included specific details about the report and meeting so Sam knows exactly what you need without having to ask."
          },
        },
      },
    },
  });

  // 5. ABANDONED — user started, exchanged a couple messages, walked away.
  await prisma.writingSession.create({
    data: {
      userId: testUser.id,
      status: SessionStatus.abandoned,
      scenarioId: pickScenario(4).id,
      subjectLine: 'Question about',
      textBody: 'Hi there,\n\nI had a quick question about',
      wordCount: 7,
      messages: {
        create: [
          {
            role: MessageRole.ASSISTANT,
            content: "Hi! I'm ready whenever you are — what's on your mind?",
          },
        ],
      },
    },
  });

  const badgeService = new BadgeService(prisma);
  await badgeService.evaluateForUser(testUser.id);

  console.log(`Seeded test user: ${testUser.email} / ${TEST_USER_PASSWORD}`);
  console.log(
    'Created 5 writing sessions: in_progress x2, graded x2, abandoned.',
  );
  console.log('Evaluated user badges for test user.');
}
