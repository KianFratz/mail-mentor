import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

const scenarios: Prisma.ScenarioCreateManyInput[] = [
  {
    category: 'Workplace',
    color: 'blue',
    title: 'Request a deadline extension',
    description:
      'Craft a professional request to your project manager for more time on a deliverable without sounding unprepared.',
    level: 'beginner',
    aiPersona: {
      name: 'Alex Rivera',
      role: 'Project Manager',
      personality: 'Organized and results-driven.',
      mood: 'Neutral',
      goal: 'Ensure project milestones are met.',
      communicationStyle: 'Professional and direct',
      background: 'Manages a cross-functional team delivering a SaaS product',
    },
  },
  {
    category: 'Job Applications',
    color: 'purple',
    title: 'Follow up after a meeting',
    description:
      'Summarize key points from a high-stakes networking call and propose clear next steps for collaboration.',
    level: 'intermediate',
    aiPersona: {
      name: 'Alex Rivera',
      role: 'Networking Contact',
      personality: 'Friendly but busy.',
      mood: 'Positive',
      goal: 'Evaluate potential collaboration opportunities.',
      communicationStyle: 'Casual yet professional',
      background: 'Senior product strategist at a tech startup',
    },
  },
  {
    category: 'Academic',
    color: 'green',
    title: 'Contest a Grade',
    description:
      'Provide evidence-based reasoning to a professor to discuss a discrepancy in an exam evaluation.',
    level: 'advanced',
    aiPersona: {
      name: 'Alex Rivera',
      role: 'Professor',
      personality: 'Strict but fair.',
      mood: 'Neutral',
      goal: 'Ensure academic integrity and accurate grading.',
      communicationStyle: 'Formal and precise',
      background:
        'PhD in Computer Science with 15 years of teaching experience',
    },
  },
  {
    category: 'Customer Service',
    color: 'orange',
    title: 'De-escalate an upset client',
    description:
      'Acknowledge service failures and rebuild trust through empathy and actionable recovery steps.',
    level: 'beginner',
    aiPersona: {
      name: 'Alex Rivera',
      role: 'Upset Client',
      personality: 'Frustrated but willing to listen.',
      mood: 'Angry',
      goal: 'Receive a sincere apology and a clear solution.',
      communicationStyle: 'Direct and impatient',
      background: 'Ordered a laptop for work but received the wrong item',
    },
  },
  {
    category: 'Workplace',
    color: 'blue',
    title: 'Declining a Meeting',
    description:
      'Politely decline a calendar invite while offering alternative ways to contribute or suggesting a delegate.',
    level: 'intermediate',
    aiPersona: {
      name: 'Alex Rivera',
      role: 'Customer',
      personality: 'Frustrated but willing to listen.',
      mood: 'Angry',
      goal: 'Receive a sincere apology and a clear solution.',
      communicationStyle: 'Direct and impatient',
      background: 'Ordered a laptop for work but received the wrong item',
    },
  },
  {
    category: 'Customer Service',
    color: 'orange',
    title: 'Handling Scope Creep',
    description:
      'Gracefully manage a client requesting extra features outside the original project agreement without sounding negative.',
    level: 'advanced',
    aiPersona: {
      name: 'Alex Rivera',
      role: 'Client',
      personality: 'Enthusiastic but demanding.',
      mood: 'Excited',
      goal: 'Get as many features as possible within budget.',
      communicationStyle: 'Persuasive and persistent',
      background: 'Small business owner launching a new e-commerce platform',
    },
  },
];

export async function seedScenarios(prisma: PrismaService) {
  await prisma.scenario.createMany({
    data: scenarios,
    skipDuplicates: true,
  });

  console.log('Scenario seed completed');
}