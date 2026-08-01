import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import {
  MessageRole,
  SessionStatus,
  SkillLevel,
  UserRole,
} from 'src/generated/prisma/enums';

const prisma = new PrismaService();

// ---------------------------------------------------------------------------
// NOTE: This seeder assumes you already have Scenarios seeded separately.
// It will throw early if none exist, since WritingSession.scenarioId is required.
// ---------------------------------------------------------------------------

const TEST_USER_EMAIL = 'testuser@mailmentor.dev';
const TEST_USER_PASSWORD = '123123123';

export async function seedTestUser() {
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

  // Idempotency: wipe this user's existing sessions (cascades to messages/feedback)
  // before re-seeding so you can re-run this freely during development.
  await prisma.writingSession.deleteMany({ where: { userId: testUser.id } });

  // ---------------------------------------------------------------------
  // 1. DRAFT — user started writing, hasn't submitted. Minimal/no AI turns.
  // ---------------------------------------------------------------------
  await prisma.writingSession.create({
    data: {
      userId: testUser.id,
      status: SessionStatus.draft,
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

  // ---------------------------------------------------------------------
  // 2. SUBMITTED — user finished and sent it in, AI hasn't graded it yet.
  // ---------------------------------------------------------------------
  await prisma.writingSession.create({
    data: {
      userId: testUser.id,
      status: SessionStatus.submitted,
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

  // ---------------------------------------------------------------------
  // 3. GRADED — strong performance, high score, few/no improvements.
  // ---------------------------------------------------------------------
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
          // Adjust this shape to match whatever AiService.buildFeedbackPrompt actually returns
          categoryScores: {
            clarity: 9,
            tone: 10,
            professionalism: 9,
            structure: 9,
          },
          strengths: [
            'Warm, genuine tone that still reads as professional',
            'Clear call-forward without being pushy',
            'Appropriate length for a thank-you note',
          ],
          improvements: [],
          suggestedRevision: {
            subjectLine: 'Thank you for the opportunity',
            textBody:
              'Hi Ms. Rivera,\n\nThank you so much for taking the time to interview me yesterday...',
          },
        },
      },
    },
  });

  // ---------------------------------------------------------------------
  // 4. GRADED — weaker performance, lower score, real improvement notes.
  // ---------------------------------------------------------------------
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
          categoryScores: {
            clarity: 5,
            tone: 3,
            professionalism: 3,
            structure: 4,
          },
          strengths: ['Message is short and to the point'],
          improvements: [
            {
              issue: 'Missing greeting and sign-off',
              suggestion:
                'Open with "Hi Sam," and close with a sign-off like "Thanks, Test User" to keep it professional.',
            },
            {
              issue: 'Overly casual tone and abbreviations ("u", "asap")',
              suggestion:
                'Spell out words fully and soften the urgency, e.g. "Could you send it over when you get a chance today?"',
            },
            {
              issue: 'No context given for the request',
              suggestion:
                "Mention which report and which meeting so the reader doesn't have to ask a follow-up question.",
            },
          ],
          suggestedRevision: {
            subjectLine: 'Could you send over the Q1 report?',
            textBody:
              "Hi Sam,\n\nCould you send over the Q1 report when you get a chance? I need it ahead of today's 3 PM meeting.\n\nThanks,\nTest User",
          },
        },
      },
    },
  });

  // ---------------------------------------------------------------------
  // 5. ABANDONED — user started, exchanged a couple messages, walked away.
  // ---------------------------------------------------------------------
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

  console.log(`Seeded test user: ${testUser.email} / ${TEST_USER_PASSWORD}`);
  console.log(
    'Created 5 writing sessions: draft, submitted, graded x2, abandoned.',
  );
}

seedTestUser()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
