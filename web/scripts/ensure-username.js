const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "username" TEXT`).catch(() => undefined);
  await prisma
    .$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username")`)
    .catch(() => undefined);
  await prisma.$executeRawUnsafe(
    `UPDATE "User" SET "username" = ? WHERE "email" = ? AND ("username" IS NULL OR "username" = '')`,
    "isara",
    "isara@thekpiplus.com",
  );
  const rows = await prisma.$queryRawUnsafe(
    `SELECT "email", "username" FROM "User" WHERE "email" = ?`,
    "isara@thekpiplus.com",
  );
  console.log(JSON.stringify(rows, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
