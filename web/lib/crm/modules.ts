import type { User } from "@prisma/client";
import { isFullAccessRole, isPartnerRoleValue, normalizeRole } from "@/lib/crm/roles";

export const ADMIN_MODULES = ["leads", "partners", "reservations", "users", "cms"] as const;
export type AdminModule = (typeof ADMIN_MODULES)[number];

export const MODULE_LABEL: Record<AdminModule, string> = {
  leads: "Lead Management",
  partners: "Partner Management",
  reservations: "Reservation Operations",
  users: "Users Management",
  cms: "Content Management System",
};

export const MODULE_PATH: Record<AdminModule, string> = {
  leads: "/crm/sales",
  partners: "/crm/partners",
  reservations: "/crm/reservations",
  users: "/crm/users",
  cms: "/crm/cms",
};

type AccessUser = Pick<User, "role"> & { modules?: string | null };

export function parseModules(raw: string | null | undefined): AdminModule[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is AdminModule => ADMIN_MODULES.includes(item as AdminModule));
  } catch {
    return [];
  }
}

export function serializeModules(values: string[]) {
  return JSON.stringify(values.filter((item): item is AdminModule => ADMIN_MODULES.includes(item as AdminModule)));
}

export function modulesFromForm(formData: FormData) {
  return serializeModules(formData.getAll("modules").map(String));
}

export function inferredModules(user: AccessUser): AdminModule[] {
  if (isPartnerRoleValue(user.role)) return [];
  if (isFullAccessRole(user.role)) return [...ADMIN_MODULES];
  const stored = parseModules(user.modules);
  if (stored.length) return stored;
  const legacy = String(user.role).toLowerCase();
  if (legacy === "crm") return ["leads"];
  if (legacy === "reviewer" || legacy === "approver" || legacy === "payout") return ["partners"];
  if (normalizeRole(user.role) === "staff" || normalizeRole(user.role) === "user") return [];
  return [];
}

export function hasModule(user: AccessUser | null | undefined, module: AdminModule) {
  if (!user || isPartnerRoleValue(user.role)) return false;
  return inferredModules(user).includes(module);
}

export function canManageUsers(user: AccessUser | null | undefined) {
  if (!user || isPartnerRoleValue(user.role)) return false;
  return isFullAccessRole(user.role) || hasModule(user, "users");
}

export function allowedModules(user: AccessUser | null | undefined) {
  if (!user) return [] as AdminModule[];
  return inferredModules(user);
}

export function firstModulePath(user: AccessUser | null | undefined) {
  const first = allowedModules(user)[0];
  return first ? MODULE_PATH[first] : "/crm";
}

export function moduleForPath(pathname: string): AdminModule | null {
  if (pathname.startsWith("/crm/cms")) return "cms";
  if (pathname.startsWith("/crm/users")) return "users";
  if (pathname.startsWith("/crm/partners")) return "partners";
  if (pathname.startsWith("/crm/reservations")) return "reservations";
  if (
    pathname.startsWith("/crm/sales") ||
    pathname.startsWith("/crm/pipeline") ||
    pathname.startsWith("/crm/leads") ||
    pathname.startsWith("/crm/activities")
  ) {
    return "leads";
  }
  return null;
}

export function moduleLabels(user: AccessUser) {
  return inferredModules(user).map((item) => MODULE_LABEL[item]);
}
