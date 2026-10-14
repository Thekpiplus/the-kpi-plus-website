import { prisma } from "@/lib/crm/db";
import type { User } from "@prisma/client";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole, isPartnerRoleValue, isStaffRole, normalizeRole } from "@/lib/crm/roles";

/** @deprecated Use INTERNAL_ROLES / isStaffRole from @/lib/crm/roles */
export const STAFF_ROLES = ["superadmin", "admin", "user", "staff", "owner", "crm", "reviewer", "approver", "payout"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export function isStaff(user: Pick<User, "role"> | null | undefined) {
  return Boolean(user && isStaffRole(user.role));
}

export function isPartnerRole(user: Pick<User, "role"> | null | undefined) {
  return Boolean(user && isPartnerRoleValue(user.role));
}

export function can(user: Pick<User, "role"> & { modules?: string | null } | null | undefined, action: string) {
  if (!user) return false;
  if (isFullAccessRole(user.role)) return true;
  if (hasModule(user, "leads") && ["crm", "referral.review", "lead.credit"].includes(action)) return true;
  if (
    hasModule(user, "partners") &&
    ["kyc.review", "bank.review", "commission.review", "commission.exception", "payout.record", "referral.review", "lead.credit"].includes(action)
  ) {
    return true;
  }
  if (hasModule(user, "users") && action === "users.manage") return true;
  if (hasModule(user, "cms") && action === "cms") return true;

  // Legacy role action map for old DB rows not yet migrated.
  const legacy = String(user.role).toLowerCase();
  const map: Record<string, string[]> = {
    crm: ["crm", "referral.review", "lead.credit"],
    reviewer: ["kyc.review", "bank.review"],
    approver: ["commission.review", "commission.exception"],
    payout: ["payout.record"],
    partner: ["portal"],
    partners: ["portal"],
  };
  if (normalizeRole(user.role) === "partner") return (map.partner ?? []).includes(action);
  return (map[legacy] ?? []).includes(action);
}

export function maskAccount(last4: string) {
  return last4 ? `•••• ${last4}` : "—";
}

export function maskTaxId(last4: string) {
  return last4 ? `••••${last4}` : "—";
}

export async function writeAudit(input: {
  actorId?: string | null;
  partnerId?: string | null;
  entityType: string;
  entityId: string;
  action: string;
  detail: string;
}) {
  await prisma().auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      partnerId: input.partnerId ?? null,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      detail: input.detail,
    },
  });
}
