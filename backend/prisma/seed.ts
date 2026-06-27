import { PrismaService } from './prisma.service';
import { Prisma } from 'src/generated/prisma/client';


const prisma = new PrismaService();

const scenarios: Prisma.ScenarioCreateManyInput[] = [
  {
    category: 'Workplace',
    color: 'blue',
    title: 'Request a deadline extension',
    description:
      'Craft a professional request to your project manager for more time on a deliverable without sounding unprepared.',
    level: 'beginner',
    aiPersona: 'Project Manager',
    hrName: 'Alex Rivera',
    hrProfession: 'Aspiring UX Researcher',
  },
  {
    category: 'Job Applications',
    color: 'purple',
    title: 'Follow up after a meeting',
    description:
      'Summarize key points from a high-stakes networking call and propose clear next steps for collaboration.',
    level: 'intermediate',
    aiPersona: 'Networking Contact',
    hrName: 'Alex Rivera',
    hrProfession: 'Aspiring UX Researcher',
  },
  {
    category: 'Academic',
    color: 'green',
    title: 'Contest a Grade',
    description:
      'Provide evidence-based reasoning to a professor to discuss a discrepancy in an exam evaluation.',
    level: 'advanced',
    aiPersona: 'Professor',
    hrName: 'Alex Rivera',
    hrProfession: 'Aspiring UX Researcher',
  },
  {
    category: 'Customer Service',
    color: 'orange',
    title: 'De-escalate an upset client',
    description:
      'Acknowledge service failures and rebuild trust through empathy and actionable recovery steps.',
    level: 'beginner',
    aiPersona: 'Upset Client',
    hrName: 'Alex Rivera',
    hrProfession: 'Aspiring UX Researcher',
  },
  {
    category: 'Workplace',
    color: 'blue',
    title: 'Declining a Meeting',
    description:
      'Politely decline a calendar invite while offering alternative ways to contribute or suggesting a delegate.',
    level: 'intermediate',
    aiPersona: 'Colleague',
    hrName: 'Alex Rivera',
    hrProfession: 'Aspiring UX Researcher',
  },
  {
    category: 'Customer Service',
    color: 'orange',
    title: 'Handling Scope Creep',
    description:
      'Gracefully manage a client requesting extra features outside the original project agreement without sounding negative.',
    level: 'advanced',
    aiPersona: 'Client',
    hrName: 'Alex Rivera',
    hrProfession: 'Aspiring UX Researcher',
  },
];

async function main() {
  await prisma.scenario.createMany({
    data: scenarios,
    skipDuplicates: true,
  });

  console.log('Scenario seed completed');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
