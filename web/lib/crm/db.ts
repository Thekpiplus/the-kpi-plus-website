import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Keep Hostinger MySQL under max_connections_per_hour by capping the Prisma pool. */
function databaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  if (/[?&]connection_limit=/.test(raw)) return raw;
  return raw.includes("?")
    ? `${raw}&connection_limit=1&pool_timeout=20`
    : `${raw}?connection_limit=1&pool_timeout=20`;
}

export function crmEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

export function prisma() {
  if (!globalForPrisma.prisma) {
    const url = databaseUrl();
    globalForPrisma.prisma = new PrismaClient(
      url
        ? {
            datasources: {
              db: { url },
            },
          }
        : undefined,
    );
  }
  return globalForPrisma.prisma;
}
