const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('1. Adding image column if not exists...');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "image" TEXT;
  `);

  console.log('2. Updating team members with their real photos...');
  const updates = [
    { pattern: '%Jean%', image: '/images/jean.jpg' },
    { pattern: '%Dieudonn%', image: '/images/dieudonne.jpg' },
    { pattern: '%Alice%', image: '/images/alice.jpg' },
    { pattern: '%Peter%', image: '/images/peter.jpg' },
  ];

  for (const u of updates) {
    const res = await prisma.$executeRawUnsafe(
      `UPDATE "team_members" SET "image" = $1 WHERE "name" ILIKE $2`,
      u.image,
      u.pattern
    );
    console.log(`Updated ${u.pattern} -> ${u.image} (${res} rows)`);
  }

  const all = await prisma.$queryRawUnsafe(`SELECT id, name, role, image FROM "team_members" ORDER BY "order" ASC`);
  console.log('Current DB state:');
  console.log(JSON.stringify(all, null, 2));
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
