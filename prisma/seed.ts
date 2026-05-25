import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { cardSeed } from "../src/lib/card-seed";

const connectionString = process.env.DATABASE_URL;

if (!connectionString || !connectionString.startsWith("postgres")) {
  throw new Error("DATABASE_URL must be a PostgreSQL connection string.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  for (const [id, name, uprightMeaning, reversedMeaning, categoryHint] of cardSeed) {
    await prisma.card.upsert({
      where: { name },
      update: { uprightMeaning, reversedMeaning, categoryHint },
      create: { id, name, uprightMeaning, reversedMeaning, categoryHint },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
