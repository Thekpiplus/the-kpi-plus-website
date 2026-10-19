import "dotenv/config";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");

const root = resolve(import.meta.dirname, "..");
const sqlite = new Database(resolve(root, "prisma", "dev.db"), { readonly: true });
const prisma = new PrismaClient();

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function main() {
  const sqliteUsers = sqlite.prepare("SELECT * FROM User").all();
  const sqlitePartners = sqlite.prepare("SELECT * FROM Partner").all();

  console.log("sqlite_users", sqliteUsers.length);
  console.log("sqlite_partners", sqlitePartners.length);

  const mysqlUsers = await prisma.user.findMany({
    select: { id: true, email: true },
  });
  const mysqlByEmail = new Map(mysqlUsers.map((u) => [u.email.toLowerCase(), u]));

  // Map SQLite user ids → MySQL user ids (existing or newly inserted).
  const userIdMap = new Map();
  let usersInserted = 0;

  for (const row of sqliteUsers) {
    const email = String(row.email ?? "").toLowerCase();
    const existing = mysqlByEmail.get(email);
    if (existing) {
      userIdMap.set(String(row.id), existing.id);
      console.log("skip_user", row.email, "already exists as", existing.id);
      continue;
    }

    const data = {
      id: String(row.id),
      phone: String(row.phone),
      email: String(row.email),
      username: row.username == null || row.username === "" ? null : String(row.username),
      name: String(row.name),
      role: String(row.role ?? "superadmin"),
      modules: String(row.modules ?? ""),
      pinHash: String(row.pinHash),
      pinSalt: String(row.pinSalt),
      failedAttempts: Number(row.failedAttempts ?? 0),
      lockedUntil: toDate(row.lockedUntil),
      createdAt: toDate(row.createdAt) ?? new Date(),
    };

    await prisma.user.create({ data });
    userIdMap.set(String(row.id), data.id);
    mysqlByEmail.set(email, { id: data.id, email: data.email });
    usersInserted += 1;
    console.log("inserted_user", data.email, data.name, data.role, data.username);
  }

  const mysqlPartners = await prisma.partner.findMany({
    select: { id: true, email: true },
  });
  const partnerByEmail = new Map(mysqlPartners.map((p) => [p.email.toLowerCase(), p]));

  let partnersInserted = 0;
  for (const row of sqlitePartners) {
    const partnerEmail = String(row.email ?? "").toLowerCase();
    if (partnerByEmail.has(partnerEmail)) {
      console.log("skip_partner", row.email, "already exists");
      continue;
    }

    let mysqlUserId = null;
    if (row.userId) {
      mysqlUserId = userIdMap.get(String(row.userId)) ?? null;
      if (!mysqlUserId) {
        // Fallback: resolve via SQLite user email.
        const sqliteUser = sqliteUsers.find((u) => String(u.id) === String(row.userId));
        if (sqliteUser) {
          const mapped = mysqlByEmail.get(String(sqliteUser.email).toLowerCase());
          mysqlUserId = mapped?.id ?? null;
        }
      }
    }

    let reviewedById = row.reviewedById ? String(row.reviewedById) : null;
    if (reviewedById && userIdMap.has(reviewedById)) {
      reviewedById = userIdMap.get(reviewedById);
    }

    const data = {
      id: String(row.id),
      userId: mysqlUserId,
      type: String(row.type),
      legalName: String(row.legalName ?? ""),
      displayName: String(row.displayName ?? ""),
      email: String(row.email),
      phone: String(row.phone ?? ""),
      phoneNormalized: String(row.phoneNormalized ?? ""),
      address: String(row.address ?? ""),
      taxIdEncrypted: String(row.taxIdEncrypted ?? ""),
      taxIdLast4: String(row.taxIdLast4 ?? ""),
      pendingLegalName: String(row.pendingLegalName ?? ""),
      pendingTaxIdEncrypted: String(row.pendingTaxIdEncrypted ?? ""),
      pendingTaxIdLast4: String(row.pendingTaxIdLast4 ?? ""),
      tier: String(row.tier),
      status: String(row.status ?? "pending"),
      kycStatus: String(row.kycStatus ?? "unverified"),
      approvedAt: toDate(row.approvedAt),
      renewsAt: toDate(row.renewsAt),
      termsVersion: String(row.termsVersion ?? ""),
      termsAcceptedAt: toDate(row.termsAcceptedAt),
      reviewNote: String(row.reviewNote ?? ""),
      reviewedAt: toDate(row.reviewedAt),
      reviewedById,
      createdAt: toDate(row.createdAt) ?? new Date(),
      updatedAt: toDate(row.updatedAt) ?? new Date(),
    };

    await prisma.partner.create({ data });
    partnersInserted += 1;
    console.log("inserted_partner", data.email, data.displayName, "userId", data.userId);
  }

  const finalUsers = await prisma.user.findMany({
    select: { name: true, email: true, role: true, username: true },
    orderBy: { createdAt: "asc" },
  });

  console.log("\n=== RESULT ===");
  console.log("users_inserted", usersInserted);
  console.log("partners_inserted", partnersInserted);
  console.log("mysql_user_count", finalUsers.length);
  console.log("mysql_users:");
  for (const u of finalUsers) {
    console.log(`  - ${u.name} | ${u.email} | ${u.role} | ${u.username ?? "(none)"}`);
  }
}

main()
  .catch((error) => {
    console.error("ERR", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    sqlite.close();
    await prisma.$disconnect();
  });
