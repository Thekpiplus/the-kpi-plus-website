import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { prisma } from "@/lib/crm/db";
import { isDepartment, type MetaAccessView, type MetaDepartment } from "./types";

type AccessUser = { id: string; role: string; modules?: string | null };

export async function metaAccessFor(user: AccessUser): Promise<MetaAccessView> {
  const management = isFullAccessRole(user.role);
  if (management) {
    return {
      userId: user.id,
      departments: ["management", "marketing", "revenue", "distribution", "sales"],
      canSeeAccounts: true,
      canSeeBudget: true,
      canSeeAudience: true,
      canEditBoard: true,
      canEditActivities: true,
      canManageSettings: true,
      isManagement: true,
    };
  }

  const rows = await prisma()
    .metaAccess.findMany({ where: { userId: user.id } })
    .catch(() => []);
  const departments = rows.map((row) => row.department).filter(isDepartment);
  const unique = Array.from(new Set(departments.length ? departments : (["marketing"] as MetaDepartment[])));
  // Module users without MetaAccess rows start as Marketing editors. Account, budget, and audience fields stay hidden until granted.
  const canSeeAccounts = rows.some((row) => row.canSeeAccounts);
  const canSeeBudget = rows.some((row) => row.canSeeBudget);
  const isManagement = unique.includes("management");
  const canEdit = unique.length > 0;

  return {
    userId: user.id,
    departments: unique,
    canSeeAccounts: canSeeAccounts || isManagement,
    canSeeBudget: canSeeBudget || isManagement,
    canSeeAudience: canSeeAccounts || isManagement || unique.includes("marketing"),
    canEditBoard: canEdit,
    canEditActivities: canEdit,
    canManageSettings: isManagement,
    isManagement,
  };
}

export function canOpenMeta(user: AccessUser | null | undefined) {
  if (!user) return false;
  return isFullAccessRole(user.role) || hasModule(user, "meta");
}
