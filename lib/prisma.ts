import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as typeof global & { prisma?: PrismaClient };

if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma;
