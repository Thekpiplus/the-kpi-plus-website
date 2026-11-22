import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  kpiDbDisabled?: string;
};

/** True when the URL host is loopback / local Docker — safe for `npm run dev`. */
function isLocalMysqlHost(url: string) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "127.0.0.1" || host === "localhost" || host === "::1" || host === "host.docker.internal";
  } catch {
    return false;
  }
}

/**
 * Cap Prisma pool: production stays tight for Hostinger hourly connection limits; local needs more.
 * In development, remote hosts (Hostinger `*.hstgr.io`, public IPs, etc.) are refused unless
 * `ALLOW_REMOTE_DB=1` so local work cannot overwrite the online database by accident.
 */
function databaseUrl() {
  const raw = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "");
  if (!raw) return undefined;
  // Prisma MySQL datasource rejects anything that does not start with mysql://
  // (e.g. leftover sqlite file: URLs or broken .env quoting).
  if (!/^mysql:\/\//i.test(raw)) return undefined;

  const isProd = process.env.NODE_ENV === "production";
  const allowRemote = process.env.ALLOW_REMOTE_DB === "1";
  if (!isProd && !allowRemote && !isLocalMysqlHost(raw)) {
    const msg =
      "DATABASE_URL points at a remote MySQL host while NODE_ENV is not production. " +
      "Use local AppServ DB `kpi_plus_local` in `.env.local`, or set ALLOW_REMOTE_DB=1 only for intentional remote admin.";
    console.error(`[crm/db] ${msg}`);
    markDbUnavailable(msg);
    return undefined;
  }

  if (/[?&]connection_limit=/.test(raw)) return raw;
  // connection_limit=1 serializes every CRM query and makes pages hang under load.
  // Keep a small pool in production; override with PRISMA_CONNECTION_LIMIT if needed.
  const limit =
    process.env.PRISMA_CONNECTION_LIMIT?.trim() ||
    (isProd ? "3" : "10");
  return raw.includes("?")
    ? `${raw}&connection_limit=${limit}&pool_timeout=10`
    : `${raw}?connection_limit=${limit}&pool_timeout=10`;
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
