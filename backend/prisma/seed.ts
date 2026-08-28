import { PrismaService } from './prisma.service';
import { seedBadge } from './seeders/badges.seed';
import { seedScenarios } from './seeders/scenario.seed';
import { seedTestUser } from './seeders/test-user.seed';

const prisma = new PrismaService();

async function main() {
  await seedScenarios(prisma);
  await seedBadge(prisma);
  await seedTestUser(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
