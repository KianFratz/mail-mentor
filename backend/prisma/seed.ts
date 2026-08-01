import { PrismaService } from './prisma.service';
import { seedScenarios } from './seeders/scenario.seed';

const prisma = new PrismaService();

async function main() {
  await seedScenarios(prisma);
  await seedTestUser();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
