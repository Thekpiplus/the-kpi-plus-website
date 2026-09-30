import { prisma } from "@/lib/crm/db";
import { formatBaht } from "./money";
import { STATUS_LABEL, TIER_LABEL, type PartnerTier } from "./rules";

export function partnerTierLabel(tier: string) {
  return TIER_LABEL[tier as PartnerTier] ?? tier;
}

export function statusLabel(status: string) {
  return STATUS_LABEL[status as keyof typeof STATUS_LABEL] ?? status;
}

export async function partnerOverview() {
  const db = prisma();
  const [applications, referrals, commissions, payouts, audits] = await Promise.all([
    db.partner.count({ where: { status: "pending" } }),
    db.referral.count({ where: { status: { in: ["submitted", "under_review"] } } }),
    db.commissionItem.count({ where: { status: { in: ["calculated", "pending_review"] } } }),
    db.payout.count({ where: { status: { in: ["ready", "carried"] } } }),
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 12 }),
  ]);
  const overdue = await db.payout.count({
    where: { status: "ready", dueDate: { lt: new Date() } },
  });
  return { applications, referrals, commissions, payouts, overdue, audits };
}

export async function partnerList(filters?: { q?: string; tier?: string; status?: string; kyc?: string }) {
  const q = filters?.q?.trim();
  const partners = await prisma().partner.findMany({
    where: {
      tier: filters?.tier || undefined,
      status: filters?.status || undefined,
      kycStatus: filters?.kyc || undefined,
      OR: q
        ? [{ displayName: { contains: q } }, { legalName: { contains: q } }, { email: { contains: q } }]
        : undefined,
    },
    include: {
      commissions: { where: { status: "approved" } },
      banks: { where: { status: "approved" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });
  return partners.map((partner) => ({
    ...partner,
    outstandingSatang: partner.commissions.reduce((sum, item) => sum + item.remainingSatang, 0),
    outstandingLabel: formatBaht(partner.commissions.reduce((sum, item) => sum + item.remainingSatang, 0)),
  }));
}

export async function partnerDetail(id: string) {
  return prisma().partner.findUnique({
    where: { id },
    include: {
      user: true,
      banks: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
      referrals: { orderBy: { createdAt: "desc" }, include: { lead: true } },
      leads: { include: { stage: true }, orderBy: { updatedAt: "desc" } },
      commissions: { include: { lead: true }, orderBy: { createdAt: "desc" } },
      payouts: { orderBy: { createdAt: "desc" } },
      audits: { orderBy: { createdAt: "desc" }, take: 30 },
    },
  });
}

export async function referralQueue() {
  return prisma().referral.findMany({
    where: { status: { in: ["submitted", "under_review", "accepted"] } },
    include: { partner: true, lead: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function commissionQueue() {
  return prisma().commissionItem.findMany({
    include: { partner: true, lead: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function payoutQueue() {
  return prisma().payout.findMany({
    include: { partner: true, lines: { include: { commission: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function partnerPortalData(userId: string) {
  const partner = await prisma().partner.findUnique({
    where: { userId },
    include: {
      referrals: { orderBy: { createdAt: "desc" }, include: { lead: { include: { stage: true } } } },
      commissions: { include: { lead: true }, orderBy: { createdAt: "desc" } },
      payouts: { orderBy: { createdAt: "desc" } },
      banks: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });
  return partner;
}

export async function usersForAssign() {
  return prisma().user.findMany({ where: { role: { not: "partner" } }, orderBy: { name: "asc" } });
}
