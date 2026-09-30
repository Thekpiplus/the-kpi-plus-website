"use server";

import { mkdir } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser, requireUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { hashSecret, normalizePhone } from "@/lib/crm/security";
import { can, isPartnerRole, isStaff, maskAccount, writeAudit } from "./access";
import { draftCommissions, looksLikeDuplicate } from "./calculate";
import { ALLOWED_DOC_TYPES, MAX_DOC_BYTES, encryptText, last4, privateDir, storePrivateFile } from "./crypto";
import { bahtToSatang } from "./money";
import { DEFAULT_RULE, parseRule, payoutDueDate, protectionEnds, shouldCarryOver, type PartnerTier } from "./rules";

function revalidatePartners(extra: string[] = []) {
  for (const path of ["/crm/partners", "/crm/leads", "/partners", ...extra]) revalidatePath(path);
}

async function staff(action?: string) {
  const user = await requireUser();
  if (!isStaff(user) || (action && !can(user, action) && user.role !== "owner")) {
    throw new Error("forbidden");
  }
  return user;
}

async function actorPartner() {
  const user = await currentUser();
  if (!user) redirect("/partners/login");
  if (!isPartnerRole(user)) throw new Error("forbidden");
  const partner = await prisma().partner.findUnique({ where: { userId: user.id } });
  if (!partner) throw new Error("forbidden");
  return { user, partner };
}

export async function ensurePartnerRule() {
  const db = prisma();
  if (await db.commissionRule.findFirst({ where: { active: true } })) return;
  await db.commissionRule.create({ data: { version: DEFAULT_RULE.version, payload: JSON.stringify(DEFAULT_RULE), active: true } });
}

async function activeRule() {
  await ensurePartnerRule();
  const row = await prisma().commissionRule.findFirst({ where: { active: true }, orderBy: { version: "desc" } });
  return row ? parseRule(row.payload) : DEFAULT_RULE;
}

export async function createPartner(formData: FormData) {
  const user = await staff();
  const db = prisma();
  const phone = String(formData.get("phone") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const pin = String(formData.get("pin") ?? "");
  const hashed = hashSecret(pin);
  const login = await db.user.create({
    data: {
      name: String(formData.get("displayName") ?? "").trim(),
      phone: normalizePhone(phone),
      email,
      role: "partner",
      pinHash: hashed.hash,
      pinSalt: hashed.salt,
    },
  });
  const taxId = String(formData.get("taxId") ?? "");
  const partner = await db.partner.create({
    data: {
      userId: login.id,
      type: String(formData.get("type") ?? "individual"),
      legalName: String(formData.get("legalName") ?? "").trim(),
      displayName: String(formData.get("displayName") ?? "").trim(),
      email,
      phone,
      phoneNormalized: normalizePhone(phone),
      address: String(formData.get("address") ?? ""),
      taxIdEncrypted: encryptText(taxId),
      taxIdLast4: last4(taxId),
      tier: String(formData.get("tier") ?? "referral"),
      status: "pending",
    },
  });
  await writeAudit({ actorId: user.id, partnerId: partner.id, entityType: "partner", entityId: partner.id, action: "create", detail: "สร้างพาร์ตเนอร์" });
  revalidatePartners();
  redirect(`/crm/partners/${partner.id}`);
}

export async function applyAsPartner(formData: FormData) {
  const db = prisma();
  const phone = String(formData.get("phone") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const pin = String(formData.get("pin") ?? "");
  if (!email.includes("@") || pin.length !== 4) return { ok: false as const, error: "invalid" };
  const hashed = hashSecret(pin);
  const login = await db.user.create({
    data: {
      name: String(formData.get("displayName") ?? "").trim(),
      phone: normalizePhone(phone),
      email,
      role: "partner",
      pinHash: hashed.hash,
      pinSalt: hashed.salt,
    },
  });
  const taxId = String(formData.get("taxId") ?? "");
  await db.partner.create({
    data: {
      userId: login.id,
      type: String(formData.get("type") ?? "individual"),
      legalName: String(formData.get("legalName") ?? "").trim(),
      displayName: String(formData.get("displayName") ?? "").trim(),
      email,
      phone,
      phoneNormalized: normalizePhone(phone),
      address: String(formData.get("address") ?? ""),
      taxIdEncrypted: encryptText(taxId),
      taxIdLast4: last4(taxId),
      tier: String(formData.get("tier") ?? "referral"),
      status: "pending",
      termsVersion: DEFAULT_RULE.termsVersion,
      termsAcceptedAt: new Date(),
    },
  });
  return { ok: true as const };
}

export async function reviewPartner(formData: FormData) {
  const user = await staff("kyc.review");
  const id = String(formData.get("partnerId") ?? "");
  const status = String(formData.get("status") ?? "pending");
  const kycStatus = String(formData.get("kycStatus") ?? "pending");
  const existing = await prisma().partner.findUnique({ where: { id } });
  if (!existing) return;
  const applyPending = kycStatus === "approved" && (existing.pendingTaxIdEncrypted || existing.pendingLegalName);
  await prisma().partner.update({
    where: { id },
    data: {
      status,
      kycStatus,
      reviewNote: String(formData.get("reviewNote") ?? ""),
      reviewedAt: new Date(),
      reviewedById: user.id,
      approvedAt: status === "active" ? new Date() : existing.approvedAt,
      legalName: applyPending && existing.pendingLegalName ? existing.pendingLegalName : existing.legalName,
      taxIdEncrypted: applyPending && existing.pendingTaxIdEncrypted ? existing.pendingTaxIdEncrypted : existing.taxIdEncrypted,
      taxIdLast4: applyPending && existing.pendingTaxIdLast4 ? existing.pendingTaxIdLast4 : existing.taxIdLast4,
      pendingLegalName: applyPending ? "" : existing.pendingLegalName,
      pendingTaxIdEncrypted: applyPending ? "" : existing.pendingTaxIdEncrypted,
      pendingTaxIdLast4: applyPending ? "" : existing.pendingTaxIdLast4,
    },
  });
  await writeAudit({ actorId: user.id, partnerId: id, entityType: "partner", entityId: id, action: "review", detail: `${status}/${kycStatus}` });
  revalidatePartners([`/crm/partners/${id}`]);
}

export async function submitBankAccount(formData: FormData, asPartner = false) {
  const actor = asPartner ? await actorPartner() : { user: await staff("bank.review"), partner: { id: String(formData.get("partnerId") ?? "") } };
  const partnerId = asPartner ? actor.partner.id : String(formData.get("partnerId") ?? "");
  const accountNumber = String(formData.get("accountNumber") ?? "").replace(/\s/g, "");
  await prisma().partnerBankAccount.create({
    data: {
      partnerId,
      bankName: String(formData.get("bankName") ?? ""),
      accountName: String(formData.get("accountName") ?? ""),
      accountNumberEncrypted: encryptText(accountNumber),
      accountLast4: last4(accountNumber),
      status: "pending",
    },
  });
  await writeAudit({ actorId: actor.user.id, partnerId, entityType: "bank", entityId: partnerId, action: "bank_submit", detail: maskAccount(last4(accountNumber)) });
  revalidatePartners([`/crm/partners/${partnerId}`, "/partners"]);
}

export async function reviewBankAccount(formData: FormData) {
  const user = await staff("bank.review");
  const id = String(formData.get("bankId") ?? "");
  const status = String(formData.get("status") ?? "rejected");
  const row = await prisma().partnerBankAccount.findUnique({ where: { id } });
  if (!row) return;
  if (status === "approved") {
    await prisma().partnerBankAccount.updateMany({ where: { partnerId: row.partnerId, status: "approved" }, data: { status: "superseded" } });
  }
  await prisma().partnerBankAccount.update({
    where: { id },
    data: { status, approvedAt: status === "approved" ? new Date() : null, approvedById: user.id },
  });
  await writeAudit({ actorId: user.id, partnerId: row.partnerId, entityType: "bank", entityId: id, action: "bank_review", detail: status });
  revalidatePartners([`/crm/partners/${row.partnerId}`]);
}

export async function uploadPartnerDocument(formData: FormData, asPartner = false) {
  const actor = asPartner ? await actorPartner() : { user: await staff("kyc.review"), partner: { id: String(formData.get("partnerId") ?? "") } };
  const partnerId = asPartner ? actor.partner.id : String(formData.get("partnerId") ?? "");
  const file = formData.get("file");
  if (!(file instanceof File) || !ALLOWED_DOC_TYPES.has(file.type) || file.size > MAX_DOC_BYTES) {
    return { ok: false as const, error: "file" };
  }
  await mkdir(privateDir(), { recursive: true });
  const stored = await storePrivateFile(partnerId, file.name, Buffer.from(await file.arrayBuffer()));
  const doc = await prisma().partnerDocument.create({
    data: {
      partnerId,
      kind: String(formData.get("kind") ?? "other"),
      filename: stored.filename,
      mime: file.type,
      size: file.size,
      path: stored.path,
      checksum: stored.checksum,
    },
  });
  await writeAudit({ actorId: actor.user.id, partnerId, entityType: "document", entityId: doc.id, action: "upload", detail: stored.filename });
  revalidatePartners([`/crm/partners/${partnerId}`, "/partners"]);
  return { ok: true as const };
}

export async function submitReferral(formData: FormData, asPartner = false) {
  const actor = asPartner ? await actorPartner() : { user: await staff("referral.review"), partner: { id: String(formData.get("partnerId") ?? "") } };
  const partnerId = asPartner ? actor.partner.id : String(formData.get("partnerId") ?? "");
  const businessName = String(formData.get("businessName") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const need = String(formData.get("need") ?? "").trim();
  if (!businessName || !contactName || (!phone && !email) || !need) return { ok: false as const, error: "incomplete" };
  const referral = await prisma().referral.create({
    data: {
      partnerId,
      status: "submitted",
      businessName,
      contactName,
      phone,
      email,
      need,
      submittedAt: new Date(),
    },
  });
  await writeAudit({ actorId: actor.user.id, partnerId, entityType: "referral", entityId: referral.id, action: "submit", detail: businessName });
  revalidatePartners(["/crm/partners/referrals", "/partners"]);
  return { ok: true as const, id: referral.id };
}

export async function reviewReferral(formData: FormData) {
  const user = await staff("referral.review");
  const db = prisma();
  const id = String(formData.get("referralId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const referral = await db.referral.findUnique({ where: { id }, include: { partner: true } });
  if (!referral) return { ok: false as const };
  if (decision === "rejected") {
    await db.referral.update({
      where: { id },
      data: { status: "rejected", reviewedAt: new Date(), rejectedReason: String(formData.get("reason") ?? "") },
    });
    await writeAudit({ actorId: user.id, partnerId: referral.partnerId, entityType: "referral", entityId: id, action: "reject", detail: String(formData.get("reason") ?? "") });
    revalidatePartners(["/crm/partners/referrals"]);
    return { ok: true as const };
  }

  const rule = await activeRule();
  const acceptedAt = new Date();
  const ends = protectionEnds(acceptedAt, rule);
  let leadId = referral.leadId;
  if (!leadId) {
    const stage = await db.stage.findFirst({ where: { sortOrder: 1 } });
    if (!stage) return { ok: false as const };
    const lead = await db.lead.create({
      data: {
        stageId: stage.id,
        ownerId: String(formData.get("ownerId") ?? user.id),
        contactName: referral.contactName,
        businessName: referral.businessName,
        phone: referral.phone,
        phoneNormalized: normalizePhone(referral.phone),
        email: referral.email,
        services: "[]",
        source: "partner_referral",
        formName: "partner_referral",
        message: referral.need,
        partnerId: referral.partnerId,
        referralId: referral.id,
        referralStatus: "accepted",
        referredAt: referral.submittedAt,
        referralAcceptedAt: acceptedAt,
        protectionEndsAt: ends,
        creditNote: String(formData.get("creditNote") ?? ""),
      },
    });
    leadId = lead.id;
    await db.leadEvent.create({ data: { leadId, userId: user.id, type: "created", detail: "Partner referral accepted" } });
  } else {
    await db.lead.update({
      where: { id: leadId },
      data: {
        partnerId: referral.partnerId,
        referralId: referral.id,
        referralStatus: "accepted",
        referralAcceptedAt: acceptedAt,
        protectionEndsAt: ends,
        source: "partner_referral",
        creditNote: String(formData.get("creditNote") ?? ""),
      },
    });
  }
  await db.referral.update({
    where: { id },
    data: {
      status: "accepted",
      reviewedAt: acceptedAt,
      acceptedAt,
      protectionEndsAt: ends,
      leadId,
      ownerId: String(formData.get("ownerId") ?? user.id),
      creditNote: String(formData.get("creditNote") ?? ""),
    },
  });
  await writeAudit({ actorId: user.id, partnerId: referral.partnerId, entityType: "referral", entityId: id, action: "accept", detail: leadId ?? "" });
  revalidatePartners(["/crm/partners/referrals", `/crm/leads/${leadId}`]);
  return { ok: true as const, leadId };
}

export async function creditLeadToPartner(formData: FormData) {
  const user = await staff("lead.credit");
  const leadId = String(formData.get("leadId") ?? "");
  const partnerId = String(formData.get("partnerId") ?? "") || null;
  await prisma().lead.update({
    where: { id: leadId },
    data: {
      partnerId,
      source: partnerId ? "partner_referral" : undefined,
      referredAt: formData.get("referredAt") ? new Date(String(formData.get("referredAt"))) : new Date(),
      creditNote: String(formData.get("creditNote") ?? ""),
    },
  });
  await writeAudit({ actorId: user.id, partnerId, entityType: "lead", entityId: leadId, action: "credit", detail: partnerId ?? "cleared" });
  revalidatePartners([`/crm/leads/${leadId}`]);
}

export async function recordPayment(formData: FormData) {
  const user = await staff();
  const leadId = String(formData.get("leadId") ?? "");
  const confirmed = formData.get("confirmed") === "1";
  const payment = await prisma().paymentRecord.create({
    data: {
      leadId,
      serviceMonth: String(formData.get("serviceMonth") ?? ""),
      serviceName: String(formData.get("serviceName") ?? ""),
      grossSatang: bahtToSatang(String(formData.get("gross") ?? "0")),
      discountSatang: bahtToSatang(String(formData.get("discount") ?? "0")),
      vatSatang: bahtToSatang(String(formData.get("vat") ?? "0")),
      ineligibleSatang: bahtToSatang(String(formData.get("ineligible") ?? "0")),
      receivedSatang: bahtToSatang(String(formData.get("received") ?? "0")),
      confirmed,
      confirmedAt: confirmed ? new Date() : null,
      confirmedById: confirmed ? user.id : null,
      kind: String(formData.get("kind") ?? "receipt"),
      note: String(formData.get("note") ?? ""),
    },
  });
  await refreshCommissions(leadId);
  await writeAudit({ actorId: user.id, entityType: "payment", entityId: payment.id, action: "record", detail: confirmed ? "confirmed" : "unconfirmed" });
  revalidatePartners([`/crm/leads/${leadId}`, "/crm/partners/commissions"]);
}

export async function refreshCommissions(leadId: string) {
  const db = prisma();
  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: { partner: true, stage: true, payments: true, referrals: true },
  });
  if (!lead?.partnerId || !lead.partner) return;
  const accepted = lead.referrals.find((row) => row.status === "accepted") ?? lead.referrals[0];
  const rule = await activeRule();
  const firstMonth =
    lead.payments[0]?.serviceMonth ||
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const { drafts, warning } = draftCommissions({
    tier: lead.partner.tier as PartnerTier,
    firstMonth,
    contractMonths: Number(3),
    dealWon: lead.stage.isWon || lead.outcome === "won",
    payments: lead.payments.map((payment) => ({
      id: payment.id,
      serviceMonth: payment.serviceMonth,
      kind: payment.kind as "receipt" | "refund" | "cancel",
      confirmed: payment.confirmed,
      grossSatang: payment.grossSatang,
      discountSatang: payment.discountSatang,
      ineligibleSatang: payment.ineligibleSatang,
      receivedSatang: payment.receivedSatang,
    })),
    rule,
  });
  const locked = new Set(["approved", "in_payout", "paid"]);
  for (const draft of drafts) {
    const existing = await db.commissionItem.findFirst({
      where: { leadId, partnerId: lead.partnerId, serviceMonth: draft.serviceMonth, monthIndex: draft.monthIndex },
    });
    if (existing && locked.has(existing.status)) continue;
    const snapshot = JSON.stringify({ rule, warning, draft });
    const data = {
      partnerId: lead.partnerId,
      leadId,
      referralId: accepted?.id ?? lead.referralId,
      ruleVersion: rule.version,
      partnerTier: lead.partner.tier,
      serviceMonth: draft.serviceMonth,
      monthIndex: draft.monthIndex,
      status: draft.status,
      eligibleSatang: draft.eligibleSatang,
      rateBps: draft.rateBps,
      calculatedSatang: draft.calculatedSatang,
      remainingSatang: draft.calculatedSatang,
      snapshot,
    };
    if (existing) await db.commissionItem.update({ where: { id: existing.id }, data });
    else await db.commissionItem.create({ data });
  }
}

export async function reviewCommission(formData: FormData) {
  const user = await staff("commission.review");
  const id = String(formData.get("commissionId") ?? "");
  const status = String(formData.get("status") ?? "");
  const item = await prisma().commissionItem.findUnique({ where: { id } });
  if (!item || item.status === "paid" || item.status === "in_payout") return;
  if (item.status === "estimated" && status === "approved") return;
  await prisma().commissionItem.update({
    where: { id },
    data: {
      status,
      holdReason: String(formData.get("reason") ?? ""),
      exceptionReason: String(formData.get("exceptionReason") ?? item.exceptionReason),
      adjustmentSatang: formData.get("adjustment") ? bahtToSatang(String(formData.get("adjustment"))) : item.adjustmentSatang,
      remainingSatang: item.calculatedSatang + (formData.get("adjustment") ? bahtToSatang(String(formData.get("adjustment"))) : item.adjustmentSatang) - item.paidSatang,
    },
  });
  await writeAudit({ actorId: user.id, partnerId: item.partnerId, entityType: "commission", entityId: id, action: status, detail: String(formData.get("reason") ?? "") });
  revalidatePartners(["/crm/partners/commissions"]);
}

export async function createPayoutBatch(formData: FormData) {
  const user = await staff("payout.record");
  const partnerId = String(formData.get("partnerId") ?? "");
  const db = prisma();
  const partner = await db.partner.findUnique({
    where: { id: partnerId },
    include: { banks: { where: { status: "approved" }, orderBy: { createdAt: "desc" }, take: 1 } },
  });
  if (!partner || partner.kycStatus !== "approved" || !partner.banks[0]) return { ok: false as const, error: "docs" };
  const items = await db.commissionItem.findMany({ where: { partnerId, status: "approved", remainingSatang: { gt: 0 } } });
  const total = items.reduce((sum, item) => sum + item.remainingSatang, 0);
  if (!items.length) return { ok: false as const, error: "empty" };
  const carry = shouldCarryOver(total);
  const withholdingSatang = bahtToSatang(String(formData.get("withholding") ?? "0"));
  const dueDate = formData.get("dueDate") ? new Date(String(formData.get("dueDate"))) : payoutDueDate();
  const payout = await db.payout.create({
    data: {
      partnerId,
      status: carry ? "carried" : "ready",
      dueDate,
      grossSatang: total,
      withholdingSatang,
      netSatang: total - withholdingSatang,
      bankSnapshot: JSON.stringify({
        bankName: partner.banks[0].bankName,
        accountName: partner.banks[0].accountName,
        accountLast4: partner.banks[0].accountLast4,
      }),
      note: carry ? "ยอดไม่ถึงขั้นต่ำ 1,000 บาท ยกไปรอบถัดไป" : "",
      lines: { create: items.map((item) => ({ commissionId: item.id, amountSatang: item.remainingSatang })) },
    },
  });
  if (!carry) {
    await db.commissionItem.updateMany({ where: { id: { in: items.map((item) => item.id) } }, data: { status: "in_payout" } });
  }
  await writeAudit({ actorId: user.id, partnerId, entityType: "payout", entityId: payout.id, action: "create", detail: carry ? "carry" : "ready" });
  revalidatePartners(["/crm/partners/payouts"]);
  return { ok: true as const, id: payout.id, carry };
}

export async function markPayoutPaid(formData: FormData) {
  const user = await staff("payout.record");
  const id = String(formData.get("payoutId") ?? "");
  const db = prisma();
  const payout = await db.payout.findUnique({ where: { id }, include: { lines: true } });
  if (!payout || payout.status === "paid") return { ok: false as const };
  await db.payout.update({
    where: { id },
    data: {
      status: "paid",
      paidAt: new Date(),
      method: String(formData.get("method") ?? "bank_transfer"),
      reference: String(formData.get("reference") ?? ""),
    },
  });
  for (const line of payout.lines) {
    const item = await db.commissionItem.findUnique({ where: { id: line.commissionId } });
    if (!item) continue;
    await db.commissionItem.update({
      where: { id: item.id },
      data: { status: "paid", paidSatang: item.paidSatang + line.amountSatang, remainingSatang: 0 },
    });
  }
  await writeAudit({ actorId: user.id, partnerId: payout.partnerId, entityType: "payout", entityId: id, action: "paid", detail: String(formData.get("reference") ?? "") });
  revalidatePartners(["/crm/partners/payouts", "/partners"]);
  return { ok: true as const };
}

export async function decideCredit(formData: FormData) {
  const user = await staff("commission.exception");
  const leadId = String(formData.get("leadId") ?? "");
  const winnerPartnerId = String(formData.get("winnerPartnerId") ?? "") || null;
  await prisma().leadCreditDecision.create({
    data: {
      leadId,
      winnerPartnerId,
      reason: String(formData.get("reason") ?? ""),
      decidedById: user.id,
    },
  });
  if (winnerPartnerId) {
    await prisma().lead.update({ where: { id: leadId }, data: { partnerId: winnerPartnerId, creditNote: String(formData.get("reason") ?? "") } });
  }
  await writeAudit({ actorId: user.id, partnerId: winnerPartnerId, entityType: "lead", entityId: leadId, action: "credit_decision", detail: String(formData.get("reason") ?? "") });
  revalidatePartners([`/crm/leads/${leadId}`]);
}

export async function saveRule(formData: FormData) {
  const user = await staff();
  if (user.role !== "owner") throw new Error("forbidden");
  const current = await prisma().commissionRule.findFirst({ orderBy: { version: "desc" } });
  const version = (current?.version ?? 0) + 1;
  const payload = {
    ...DEFAULT_RULE,
    version,
    minContractMonths: Number(formData.get("minContractMonths") ?? 3),
    protectionDays: Number(formData.get("protectionDays") ?? 180),
    payoutMinSatang: bahtToSatang(String(formData.get("payoutMin") ?? "1000")),
    payoutDay: Number(formData.get("payoutDay") ?? 10),
  };
  await prisma().commissionRule.updateMany({ data: { active: false } });
  await prisma().commissionRule.create({ data: { version, payload: JSON.stringify(payload), active: true, createdById: user.id } });
  await writeAudit({ actorId: user.id, entityType: "rule", entityId: String(version), action: "publish", detail: `v${version}` });
  revalidatePartners(["/crm/partners/settings"]);
}

export async function findReferralMatches(businessName: string, phone: string, email: string) {
  const leads = await prisma().lead.findMany({ orderBy: { updatedAt: "desc" }, take: 50 });
  return leads
    .map((lead) => ({
      lead,
      flag: looksLikeDuplicate({ businessName, phone, email }, lead),
    }))
    .filter((row) => row.flag);
}

export async function updatePartnerProfile(formData: FormData) {
  const { user, partner } = await actorPartner();
  const legalName = String(formData.get("legalName") ?? "").trim();
  const taxId = String(formData.get("taxId") ?? "").replace(/\s/g, "");
  const sensitive = Boolean(taxId || (legalName && legalName !== partner.legalName));
  await prisma().partner.update({
    where: { id: partner.id },
    data: {
      displayName: String(formData.get("displayName") ?? partner.displayName).trim(),
      address: String(formData.get("address") ?? partner.address),
      phone: String(formData.get("phone") ?? partner.phone),
      email: String(formData.get("email") ?? partner.email).trim().toLowerCase(),
      pendingLegalName: legalName && legalName !== partner.legalName ? legalName : partner.pendingLegalName,
      pendingTaxIdEncrypted: taxId ? encryptText(taxId) : partner.pendingTaxIdEncrypted,
      pendingTaxIdLast4: taxId ? last4(taxId) : partner.pendingTaxIdLast4,
      kycStatus: sensitive ? "pending" : partner.kycStatus,
    },
  });
  await writeAudit({
    actorId: user.id,
    partnerId: partner.id,
    entityType: "partner",
    entityId: partner.id,
    action: "profile_update",
    detail: sensitive ? "รอตรวจตัวตน/ภาษี" : "แก้โปรไฟล์ทั่วไป",
  });
  revalidatePartners(["/partners/profile"]);
  redirect("/partners/profile?saved=1");
}

export async function portalApply(formData: FormData) {
  try {
    const result = await applyAsPartner(formData);
    if (!result.ok) return;
  } catch {
    return;
  }
  redirect("/partners/login?applied=1");
}

export async function portalSubmitReferral(formData: FormData) {
  const result = await submitReferral(formData, true);
  if (!result.ok) redirect("/partners/referrals?error=incomplete");
  redirect("/partners/referrals?sent=1");
}

export async function portalSubmitBank(formData: FormData) {
  await submitBankAccount(formData, true);
  redirect("/partners/profile?saved=1");
}

export async function portalUploadDocument(formData: FormData) {
  const result = await uploadPartnerDocument(formData, true);
  if (!result.ok) redirect("/partners/profile?error=file");
  redirect("/partners/profile?saved=1");
}

void currentUser;
