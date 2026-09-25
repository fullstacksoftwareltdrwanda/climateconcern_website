import { PrismaClient } from '@prisma/client';

// Re-use a single PrismaClient instance across the application
// (prevents "too many clients" in development with hot-reload)
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;
