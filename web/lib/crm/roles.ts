export const USER_ROLES = ["superadmin", "admin", "user", "staff", "partner"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Internal admin-workspace roles (exclude partner portal). */
export const INTERNAL_ROLES = ["superadmin", "admin", "user", "staff"] as const;
export type InternalRole = (typeof INTERNAL_ROLES)[number];

export const ROLE_LABEL: Record<UserRole, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  user: "User",
  staff: "Staff",
  partner: "Partners",
};

/** Roles that always get every admin module. */
export const FULL_ACCESS_ROLES: UserRole[] = ["superadmin", "admin"];

export function normalizeRole(role: string | null | undefined): UserRole {
  const key = String(role ?? "")
    .trim()
    .toLowerCase();
  if (key === "superadmin" || key === "owner") return "superadmin";
  if (key === "admin") return "admin";
  if (key === "user") return "user";
  if (key === "staff") return "staff";
  if (key === "partner" || key === "partners") return "partner";
  if (key === "crm" || key === "reviewer" || key === "approver" || key === "payout") return "staff";
  return "user";
}

export function roleLabel(role: string) {
  return ROLE_LABEL[normalizeRole(role)];
}

export function isStaffRole(role: string) {
  return normalizeRole(role) !== "partner";
}

export function isPartnerRoleValue(role: string) {
  return normalizeRole(role) === "partner";
}

export function isFullAccessRole(role: string) {
  return FULL_ACCESS_ROLES.includes(normalizeRole(role));
}

export function isSuperadminRole(role: string) {
  return normalizeRole(role) === "superadmin";
}

/** Roles an actor may assign when creating/editing team users (not Partners). */
export function assignableInternalRoles(actorRole: string): InternalRole[] {
  const actor = normalizeRole(actorRole);
  if (actor === "superadmin") return ["superadmin", "admin", "user", "staff"];
  if (actor === "admin") return ["admin", "user", "staff"];
  return ["user", "staff"];
}

/** Prisma `role` filter values, including legacy DB values. */
export function roleQueryValues(role?: string | null): string[] | undefined {
  if (!role) return undefined;
  const normalized = normalizeRole(role);
  if (normalized === "superadmin") return ["superadmin", "owner"];
  if (normalized === "staff") return ["staff", "crm", "reviewer", "approver", "payout"];
  if (normalized === "partner") return ["partner", "partners"];
  return [normalized];
}
