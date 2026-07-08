import { PrismaClient, ReviewerRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123456', 10);

  const candidate = await prisma.candidate.upsert({
    where: {
      email: 'bilal@example.com',
    },
    update: {},
    create: {
      name: 'Bilal Shahab',
      email: 'bilal@example.com',
      city: 'Karachi',
      privateToken: 'bilal-123',
    },
  });

  const assessment = await prisma.assessmentBrief.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      id: 1,
      role: 'Backend Developer',
      title: 'TechAbout Backend Assessment',
      description: 'Build the required backend APIs.',
      deadline: new Date('2026-07-15'),
    },
  });

  await prisma.reviewerUser.upsert({
    where: {
      email: 'hr@techabout.com',
    },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'hr@techabout.com',
      password: hashedPassword,
      role: ReviewerRole.HR,
    },
  });

  console.log('✅ Seed completed');
  console.log({
    candidate,
    assessment,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
