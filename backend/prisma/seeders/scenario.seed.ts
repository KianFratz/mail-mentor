import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

const scenarios: Prisma.ScenarioCreateManyInput[] = [
  {
    category: 'Workplace',
    color: 'blue',
    title: 'Request a Deadline Extension',
    description:
      'You are behind schedule on an important deliverable due to unexpected technical issues. Write to your project manager to explain the situation, request a reasonable extension, and reassure them that you have a plan to finish the work.',
    level: 'beginner',
    aiPersona: {
      name: 'Marcus Chen',
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
    title: 'Follow Up After a Networking Meeting',
    description:
      'You recently had a productive networking call with a senior professional in your field. Write a follow-up email thanking them for their time, briefly referencing what you discussed, and proposing a clear next step for staying connected.',
    level: 'intermediate',
    aiPersona: {
      name: 'Sofia Bennett',
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
    title: 'Request a Grade Review',
    description:
      'You believe part of your exam was graded incorrectly and have evidence supporting your concern. Write to your professor respectfully, identify the specific discrepancy, explain your reasoning, and request a review of the grade.',
    level: 'advanced',
    aiPersona: {
      name: 'Dr. Eleanor Wright',
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
    title: 'De-escalate an Upset Client',
    description:
      'A client received the wrong laptop after waiting several days for their order and is frustrated about the mistake. Write a response that acknowledges their frustration, apologizes sincerely, and provides clear steps to resolve the issue.',
    level: 'beginner',
    aiPersona: {
      name: 'Daniel Brooks',
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
    title: 'Politely Decline a Meeting',
    description:
      'You have been invited to a meeting that conflicts with an important deadline. Write a professional response declining the invitation, briefly explaining your availability issue, and offering an alternative way to contribute or a suitable delegate.',
    level: 'intermediate',
    aiPersona: {
      name: 'Rachel Morgan',
      role: 'Team Lead',
      personality: 'Professional and understanding.',
      mood: 'Neutral',
      goal: 'Keep the project moving while ensuring the right people are involved.',
      communicationStyle: 'Concise and professional',
      background:
        'Leads a product team coordinating multiple projects and stakeholder meetings',
    },
  },
  {
    category: 'Customer Service',
    color: 'orange',
    title: 'Handle Scope Creep',
    description:
      'A client is asking for several additional features that were not included in the original project agreement. Write a response that acknowledges their ideas, explains the impact on scope and timeline, and proposes a reasonable way to handle the additional work.',
    level: 'advanced',
    aiPersona: {
      name: 'Jordan Blake',
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
