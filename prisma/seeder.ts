import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.user.create({
    data: {
      id: '6485c549b3d8f4dec3c951ad',
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      photo: 'johndoe.jpg',
      email: 'johndoe@gmail.com',
      password: '$2b$10$eB1akZ3I7s05AQEJkFiys.szfpFm7yRqq9IXsBGz/Xss1AP80XA2G',
    },
  });
}

main().catch((e) => {
  console.log(e);
  process.exit(1);
});
