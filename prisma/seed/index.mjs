import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      WorkSpace: {
        create: {
          name: 'My Workspace',
          Board: {
            create: {
              title: 'Main Board',
              Column: {
                create: [
                  {
                    title: 'To Do',
                    order: 1,
                    Card: {
                      create: [
                        { title: 'Task 1', order: 1 },
                        { title: 'Task 2', order: 2 },
                      ],
                    },
                  },
                  {
                    title: 'In Progress',
                    order: 2,
                    Card: {
                      create: [{ title: 'Task 3', order: 1 }],
                    },
                  },
                  {
                    title: 'Done',
                    order: 3,
                    Card: {
                      create: [{ title: 'Task 4', order: 1 }],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  });

  console.log('Seed complete:', user.email);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
