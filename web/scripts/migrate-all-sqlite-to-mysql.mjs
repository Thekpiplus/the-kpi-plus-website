/**
 * Migrate all remaining SQLite (prisma/dev.db) rows into MySQL (DATABASE_URL).
 * Does NOT wipe MySQL. Upserts/skips by id (or email for User/Partner).
 *
 * Usage: node scripts/migrate-all-sqlite-to-mysql.mjs
 */
import "dotenv/config";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { PrismaClient, Prisma } from "@prisma/client";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");

const root = resolve(import.meta.dirname, "..");
const sqlitePath = resolve(root, "prisma", "dev.db");
const sqlite = new Database(sqlitePath, { readonly: true });
const prisma = new PrismaClient();

function toDate(value) {
  if (value == null || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    // SQLite Prisma stores DateTime as ms epoch ints
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

function asBool(value) {
  return value === true || value === 1 || value === "1";
}

function str(value, fallback = "") {
  if (value == null) return fallback;
  return String(value);
}

function num(value, fallback = 0) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function isUniqueConflict(error) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

function normalizeBody(raw) {
  let current = String(raw ?? "[]");
  for (let i = 0; i < 5; i += 1) {
    const trimmed = current.trim();
    if (!trimmed.startsWith("[")) break;
    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) break;
      if (
        parsed.length === 1 &&
        parsed[0]?.type === "p" &&
        typeof parsed[0]?.text === "string" &&
        parsed[0].text.trim().startsWith("[")
      ) {
        current = parsed[0].text;
        continue;
      }
      return JSON.stringify(parsed);
    } catch {
      break;
    }
  }
  return current;
}

function readAll(table) {
  try {
    return sqlite.prepare(`SELECT * FROM "${table}"`).all();
  } catch (error) {
    console.warn(`  WARN: cannot read SQLite table ${table}: ${error.message}`);
    return [];
  }
}

async function migrateTable(name, rows, handler) {
  const stats = { source: rows.length, inserted: 0, updated: 0, skipped: 0, errors: 0 };
  for (const row of rows) {
    try {
      const result = await handler(row);
      if (result === "inserted") stats.inserted += 1;
      else if (result === "updated") stats.updated += 1;
      else stats.skipped += 1;
    } catch (error) {
      stats.errors += 1;
      const id = row?.id ?? "?";
      console.error(`  ERR ${name} id=${id}: ${error.message}`);
    }
  }
  console.log(
    `${name}\tsource=${stats.source}\tinserted=${stats.inserted}\tupdated=${stats.updated}\tskipped=${stats.skipped}\terrors=${stats.errors}`,
  );
  return stats;
}

async function createOrSkip(delegate, data) {
  try {
    await delegate.create({ data });
    return "inserted";
  } catch (error) {
    if (isUniqueConflict(error)) return "skipped";
    throw error;
  }
}

async function upsertById(delegate, id, data, updateFields) {
  const existing = await delegate.findUnique({ where: { id } });
  if (existing) {
    if (updateFields) {
      await delegate.update({ where: { id }, data: updateFields });
      return "updated";
    }
    return "skipped";
  }
  try {
    await delegate.create({ data });
    return "inserted";
  } catch (error) {
    if (isUniqueConflict(error)) return "skipped";
    throw error;
  }
}

async function main() {
  if (!process.env.DATABASE_URL?.startsWith("mysql")) {
    throw new Error("DATABASE_URL is not mysql — aborting");
  }
  console.log("sqlite:", sqlitePath);
  console.log("mysql:  (DATABASE_URL is mysql://… — password redacted)");
  console.log("---");

  // --- User: skip if email OR id exists (keep current MySQL Isara) ---
  await migrateTable("User", readAll("User"), async (row) => {
    const id = str(row.id);
    const byId = await prisma.user.findUnique({ where: { id } });
    if (byId) return "skipped";
    const byEmail = await prisma.user.findUnique({ where: { email: str(row.email) } });
    if (byEmail) return "skipped";
    return createOrSkip(prisma.user, {
      id,
      phone: str(row.phone),
      email: str(row.email),
      username: row.username == null ? null : str(row.username),
      name: str(row.name),
      role: str(row.role, "superadmin"),
      modules: str(row.modules),
      pinHash: str(row.pinHash),
      pinSalt: str(row.pinSalt),
      failedAttempts: num(row.failedAttempts),
      lockedUntil: toDate(row.lockedUntil),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  // --- Stage ---
  await migrateTable("Stage", readAll("Stage"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.stage, id, {
      id,
      name: str(row.name),
      nameTh: str(row.nameTh),
      sortOrder: num(row.sortOrder),
      isWon: asBool(row.isWon),
      isLost: asBool(row.isLost),
    });
  });

  // --- Partner: skip if id or email exists ---
  await migrateTable("Partner", readAll("Partner"), async (row) => {
    const id = str(row.id);
    const byId = await prisma.partner.findUnique({ where: { id } });
    if (byId) return "skipped";
    const byEmail = await prisma.partner.findFirst({ where: { email: str(row.email) } });
    if (byEmail) return "skipped";
    return createOrSkip(prisma.partner, {
      id,
      userId: row.userId == null ? null : str(row.userId),
      type: str(row.type),
      legalName: str(row.legalName),
      displayName: str(row.displayName),
      email: str(row.email),
      phone: str(row.phone),
      phoneNormalized: str(row.phoneNormalized),
      address: str(row.address),
      taxIdEncrypted: str(row.taxIdEncrypted),
      taxIdLast4: str(row.taxIdLast4),
      pendingLegalName: str(row.pendingLegalName),
      pendingTaxIdEncrypted: str(row.pendingTaxIdEncrypted),
      pendingTaxIdLast4: str(row.pendingTaxIdLast4),
      tier: str(row.tier),
      status: str(row.status, "pending"),
      kycStatus: str(row.kycStatus, "unverified"),
      approvedAt: toDate(row.approvedAt),
      renewsAt: toDate(row.renewsAt),
      termsVersion: str(row.termsVersion),
      termsAcceptedAt: toDate(row.termsAcceptedAt),
      reviewNote: str(row.reviewNote),
      reviewedAt: toDate(row.reviewedAt),
      reviewedById: row.reviewedById == null ? null : str(row.reviewedById),
      createdAt: toDate(row.createdAt) ?? new Date(),
      updatedAt: toDate(row.updatedAt) ?? new Date(),
    });
  });

  await migrateTable("PartnerBankAccount", readAll("PartnerBankAccount"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.partnerBankAccount, id, {
      id,
      partnerId: str(row.partnerId),
      bankName: str(row.bankName),
      accountName: str(row.accountName),
      accountNumberEncrypted: str(row.accountNumberEncrypted),
      accountLast4: str(row.accountLast4),
      status: str(row.status),
      approvedAt: toDate(row.approvedAt),
      approvedById: row.approvedById == null ? null : str(row.approvedById),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("PartnerDocument", readAll("PartnerDocument"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.partnerDocument, id, {
      id,
      partnerId: str(row.partnerId),
      kind: str(row.kind),
      filename: str(row.filename),
      mime: str(row.mime),
      size: num(row.size),
      path: str(row.path),
      checksum: str(row.checksum),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("Lead", readAll("Lead"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.lead, id, {
      id,
      stageId: str(row.stageId),
      ownerId: row.ownerId == null ? null : str(row.ownerId),
      contactName: str(row.contactName),
      businessName: str(row.businessName),
      businessType: str(row.businessType),
      phone: str(row.phone),
      phoneNormalized: str(row.phoneNormalized),
      email: str(row.email),
      location: str(row.location),
      website: str(row.website),
      services: str(row.services, "[]"),
      source: str(row.source),
      formName: str(row.formName),
      pageUrl: str(row.pageUrl),
      message: str(row.message),
      rawPayload: str(row.rawPayload),
      utm: str(row.utm, "{}"),
      locale: str(row.locale, "th"),
      estimatedValue: row.estimatedValue == null ? null : num(row.estimatedValue, null),
      decisionDate: toDate(row.decisionDate),
      lastContactAt: toDate(row.lastContactAt),
      nextActivityAt: toDate(row.nextActivityAt),
      outcome: str(row.outcome),
      outcomeReason: str(row.outcomeReason),
      noFollowUp: asBool(row.noFollowUp),
      noFollowUpReason: str(row.noFollowUpReason),
      partnerId: row.partnerId == null ? null : str(row.partnerId),
      referralId: row.referralId == null ? null : str(row.referralId),
      referralStatus: str(row.referralStatus),
      referredAt: toDate(row.referredAt),
      referralAcceptedAt: toDate(row.referralAcceptedAt),
      protectionEndsAt: toDate(row.protectionEndsAt),
      creditNote: str(row.creditNote),
      archivedAt: toDate(row.archivedAt),
      createdAt: toDate(row.createdAt) ?? new Date(),
      updatedAt: toDate(row.updatedAt) ?? new Date(),
    });
  });

  await migrateTable("Activity", readAll("Activity"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.activity, id, {
      id,
      leadId: str(row.leadId),
      ownerId: row.ownerId == null ? null : str(row.ownerId),
      type: str(row.type),
      title: str(row.title),
      dueAt: toDate(row.dueAt) ?? new Date(),
      status: str(row.status, "open"),
      notes: str(row.notes),
      outcome: str(row.outcome),
      firstResponse: asBool(row.firstResponse),
      completedAt: toDate(row.completedAt),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("LeadEvent", readAll("LeadEvent"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.leadEvent, id, {
      id,
      leadId: str(row.leadId),
      userId: row.userId == null ? null : str(row.userId),
      type: str(row.type),
      detail: str(row.detail),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("Notification", readAll("Notification"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.notification, id, {
      id,
      leadId: str(row.leadId),
      kind: str(row.kind),
      toEmail: str(row.toEmail),
      status: str(row.status),
      error: str(row.error),
      attempts: num(row.attempts),
      lastAttemptAt: toDate(row.lastAttemptAt),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("Attachment", readAll("Attachment"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.attachment, id, {
      id,
      leadId: str(row.leadId),
      filename: str(row.filename),
      mime: str(row.mime),
      size: num(row.size),
      path: str(row.path),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("Referral", readAll("Referral"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.referral, id, {
      id,
      partnerId: str(row.partnerId),
      leadId: row.leadId == null ? null : str(row.leadId),
      status: str(row.status, "draft"),
      businessName: str(row.businessName),
      contactName: str(row.contactName),
      phone: str(row.phone),
      email: str(row.email),
      need: str(row.need),
      submittedAt: toDate(row.submittedAt),
      reviewedAt: toDate(row.reviewedAt),
      acceptedAt: toDate(row.acceptedAt),
      protectionEndsAt: toDate(row.protectionEndsAt),
      rejectedReason: str(row.rejectedReason),
      creditNote: str(row.creditNote),
      ownerId: row.ownerId == null ? null : str(row.ownerId),
      createdAt: toDate(row.createdAt) ?? new Date(),
      updatedAt: toDate(row.updatedAt) ?? new Date(),
    });
  });

  await migrateTable("PaymentRecord", readAll("PaymentRecord"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.paymentRecord, id, {
      id,
      leadId: str(row.leadId),
      serviceMonth: str(row.serviceMonth),
      serviceName: str(row.serviceName),
      grossSatang: num(row.grossSatang),
      discountSatang: num(row.discountSatang),
      vatSatang: num(row.vatSatang),
      ineligibleSatang: num(row.ineligibleSatang),
      receivedSatang: num(row.receivedSatang),
      confirmed: asBool(row.confirmed),
      confirmedAt: toDate(row.confirmedAt),
      confirmedById: row.confirmedById == null ? null : str(row.confirmedById),
      kind: str(row.kind, "receipt"),
      note: str(row.note),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("CommissionRule", readAll("CommissionRule"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.commissionRule, id, {
      id,
      version: num(row.version),
      payload: str(row.payload),
      active: asBool(row.active),
      createdAt: toDate(row.createdAt) ?? new Date(),
      createdById: row.createdById == null ? null : str(row.createdById),
    });
  });

  await migrateTable("CommissionItem", readAll("CommissionItem"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.commissionItem, id, {
      id,
      partnerId: str(row.partnerId),
      leadId: str(row.leadId),
      referralId: row.referralId == null ? null : str(row.referralId),
      paymentId: row.paymentId == null ? null : str(row.paymentId),
      ruleVersion: num(row.ruleVersion),
      partnerTier: str(row.partnerTier),
      serviceMonth: str(row.serviceMonth),
      monthIndex: num(row.monthIndex),
      status: str(row.status),
      eligibleSatang: num(row.eligibleSatang),
      rateBps: num(row.rateBps),
      calculatedSatang: num(row.calculatedSatang),
      paidSatang: num(row.paidSatang),
      adjustmentSatang: num(row.adjustmentSatang),
      remainingSatang: num(row.remainingSatang),
      exceptionReason: str(row.exceptionReason),
      holdReason: str(row.holdReason),
      snapshot: str(row.snapshot, "{}"),
      createdAt: toDate(row.createdAt) ?? new Date(),
      updatedAt: toDate(row.updatedAt) ?? new Date(),
    });
  });

  await migrateTable("Payout", readAll("Payout"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.payout, id, {
      id,
      partnerId: str(row.partnerId),
      status: str(row.status, "draft"),
      dueDate: toDate(row.dueDate) ?? new Date(),
      paidAt: toDate(row.paidAt),
      method: str(row.method),
      reference: str(row.reference),
      grossSatang: num(row.grossSatang),
      adjustmentSatang: num(row.adjustmentSatang),
      withholdingSatang: num(row.withholdingSatang),
      netSatang: num(row.netSatang),
      bankSnapshot: str(row.bankSnapshot, "{}"),
      note: str(row.note),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("PayoutLine", readAll("PayoutLine"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.payoutLine, id, {
      id,
      payoutId: str(row.payoutId),
      commissionId: str(row.commissionId),
      amountSatang: num(row.amountSatang),
    });
  });

  await migrateTable("AuditLog", readAll("AuditLog"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.auditLog, id, {
      id,
      actorId: row.actorId == null ? null : str(row.actorId),
      partnerId: row.partnerId == null ? null : str(row.partnerId),
      entityType: str(row.entityType),
      entityId: str(row.entityId),
      action: str(row.action),
      detail: str(row.detail),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("LeadCreditDecision", readAll("LeadCreditDecision"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.leadCreditDecision, id, {
      id,
      leadId: str(row.leadId),
      winnerPartnerId: row.winnerPartnerId == null ? null : str(row.winnerPartnerId),
      reason: str(row.reason),
      decidedById: str(row.decidedById),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("Session", readAll("Session"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.session, id, {
      id,
      userId: str(row.userId),
      tokenHash: str(row.tokenHash),
      expiresAt: toDate(row.expiresAt) ?? new Date(),
      ip: str(row.ip),
      userAgent: str(row.userAgent),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("TrustedDevice", readAll("TrustedDevice"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.trustedDevice, id, {
      id,
      userId: str(row.userId),
      deviceTokenHash: str(row.deviceTokenHash),
      userAgent: str(row.userAgent),
      verifiedAt: toDate(row.verifiedAt) ?? new Date(),
      lastSeenAt: toDate(row.lastSeenAt) ?? new Date(),
    });
  });

  await migrateTable("DeviceChallenge", readAll("DeviceChallenge"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.deviceChallenge, id, {
      id,
      userId: str(row.userId),
      codeHash: str(row.codeHash),
      expiresAt: toDate(row.expiresAt) ?? new Date(),
      attempts: num(row.attempts),
    });
  });

  await migrateTable("PinReset", readAll("PinReset"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.pinReset, id, {
      id,
      userId: str(row.userId),
      tokenHash: str(row.tokenHash),
      expiresAt: toDate(row.expiresAt) ?? new Date(),
      usedAt: toDate(row.usedAt),
    });
  });

  await migrateTable("LoginAttempt", readAll("LoginAttempt"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.loginAttempt, id, {
      id,
      phone: str(row.phone),
      email: str(row.email),
      userId: str(row.userId),
      userName: str(row.userName),
      role: str(row.role),
      shop: str(row.shop),
      ip: str(row.ip),
      userAgent: str(row.userAgent),
      success: asBool(row.success),
      reason: str(row.reason),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("RateLimit", readAll("RateLimit"), async (row) => {
    const id = str(row.id);
    const existing = await prisma.rateLimit.findUnique({ where: { id } });
    if (existing) return "skipped";
    return createOrSkip(prisma.rateLimit, {
      id,
      count: num(row.count),
      resetAt: toDate(row.resetAt) ?? new Date(),
    });
  });

  // --- CmsDocument: upsert by id (body LongText) ---
  await migrateTable("CmsDocument", readAll("CmsDocument"), async (row) => {
    const id = str(row.id);
    const data = {
      id,
      kind: str(row.kind),
      title: str(row.title),
      slug: str(row.slug),
      locale: str(row.locale, "th"),
      status: str(row.status, "draft"),
      template: str(row.template, "general"),
      excerpt: str(row.excerpt),
      body: normalizeBody(row.body),
      featuredImage: str(row.featuredImage),
      imageAlt: str(row.imageAlt),
      category: str(row.category),
      tags: str(row.tags),
      author: str(row.author),
      seoTitle: str(row.seoTitle),
      metaDescription: str(row.metaDescription),
      canonical: str(row.canonical),
      ogImage: str(row.ogImage),
      noindex: asBool(row.noindex),
      showInMenu: asBool(row.showInMenu),
      menu: str(row.menu, "none"),
      menuLabel: str(row.menuLabel),
      menuParent: str(row.menuParent),
      menuPosition: num(row.menuPosition),
      publishedAt: toDate(row.publishedAt),
      scheduledAt: toDate(row.scheduledAt),
      trashedAt: toDate(row.trashedAt),
      updatedBy: str(row.updatedBy),
      createdAt: toDate(row.createdAt) ?? new Date(),
      updatedAt: toDate(row.updatedAt) ?? new Date(),
    };
    const { id: _omitId, createdAt: _omitCreated, ...update } = data;
    const existed = await prisma.cmsDocument.findUnique({ where: { id }, select: { id: true } });
    try {
      await prisma.cmsDocument.upsert({
        where: { id },
        create: data,
        update,
      });
      return existed ? "updated" : "inserted";
    } catch (error) {
      if (isUniqueConflict(error)) {
        // collision on (kind, slug, locale) with different id — skip
        return "skipped";
      }
      throw error;
    }
  });

  await migrateTable("CmsMedia", readAll("CmsMedia"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.cmsMedia, id, {
      id,
      filename: str(row.filename),
      path: str(row.path),
      alt: str(row.alt),
      caption: str(row.caption),
      mime: str(row.mime),
      size: num(row.size),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("CmsRedirect", readAll("CmsRedirect"), async (row) => {
    const id = str(row.id);
    return upsertById(prisma.cmsRedirect, id, {
      id,
      fromPath: str(row.fromPath),
      toPath: str(row.toPath),
      statusCode: num(row.statusCode, 301),
      active: asBool(row.active),
      createdAt: toDate(row.createdAt) ?? new Date(),
    });
  });

  await migrateTable("CmsSetting", readAll("CmsSetting"), async (row) => {
    const id = str(row.id);
    const value = str(row.value, "{}");
    const existing = await prisma.cmsSetting.findUnique({ where: { id } });
    if (existing) {
      await prisma.cmsSetting.update({ where: { id }, data: { value } });
      return "updated";
    }
    await prisma.cmsSetting.create({ data: { id, value } });
    return "inserted";
  });

  console.log("---");
  console.log("migration complete");
}

main()
  .catch((error) => {
    console.error("FATAL", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    sqlite.close();
    await prisma.$disconnect();
  });
