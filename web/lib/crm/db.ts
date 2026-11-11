import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  kpiDbDisabled?: string;
};

/** Keep Hostinger MySQL under max_connections_per_hour by capping the Prisma pool. */
function databaseUrl() {
  const raw = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "");
  if (!raw) return undefined;
  // Prisma MySQL datasource rejects anything that does not start with mysql://
  // (e.g. leftover sqlite file: URLs or broken .env quoting).
  if (!/^mysql:\/\//i.test(raw)) return undefined;
  if (/[?&]connection_limit=/.test(raw)) return raw;
  return raw.includes("?")
    ? `${raw}&connection_limit=1&pool_timeout=20`
    : `${raw}?connection_limit=1&pool_timeout=20`;
}

export function crmEnabled() {
  return Boolean(databaseUrl()) && !globalForPrisma.kpiDbDisabled;
}

export function markDbUnavailable(reason: string) {
  globalForPrisma.kpiDbDisabled = reason;
  if (globalForPrisma.prisma) {
    void globalForPrisma.prisma.$disconnect().catch(() => undefined);
  }
  globalForPrisma.prisma = undefined;
}

function shouldDisableDb(error: unknown) {
  const msg = error instanceof Error ? error.message : String(error);
  return /auth_gssapi|Can't reach database server|must start with the protocol `mysql:\/\/`|P1001|P1010|P1012|Access denied for user/i.test(
    msg,
  );
}

export function prisma() {
  if (globalForPrisma.kpiDbDisabled) {
    throw new Error(`Database unavailable: ${globalForPrisma.kpiDbDisabled}`);
  }
  if (!globalForPrisma.prisma) {
    const url = databaseUrl();
    if (!url) {
      markDbUnavailable("DATABASE_URL must be a mysql:// connection string");
      throw new Error("DATABASE_URL must be a mysql:// connection string");
    }
    globalForPrisma.prisma = new PrismaClient({
      datasources: {
        db: { url },
      },
    });
  }
  return globalForPrisma.prisma;
}

/** Prevent Next.js from treating a handled DB failure as a fatal RSC digest error. */
function neutralizeNextDigest(error: unknown) {
  if (error && typeof error === "object" && "digest" in error) {
    try {
      delete (error as { digest?: string }).digest;
    } catch {
      // ignore
    }
  }
}

/** Run a DB call; on hard connection/auth failures, disable CRM for this process and return null. */
export async function tryDb<T>(fn: (db: PrismaClient) => Promise<T>): Promise<T | null> {
  if (!crmEnabled()) return null;
  try {
    return await fn(prisma());
  } catch (error) {
    neutralizeNextDigest(error);
    if (shouldDisableDb(error)) {
      markDbUnavailable(error instanceof Error ? error.message : String(error));
    }
    return null;
  }
}
