import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url || !url.startsWith("postgres")) {
    throw new Error("DATABASE_URL must be a PostgreSQL connection string.");
  }

  return url;
}

export function getDb() {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({ connectionString: getDatabaseUrl() });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma;
}
