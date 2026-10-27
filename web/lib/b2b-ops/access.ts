import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { prisma } from "@/lib/crm/db";
import {
  isDepartment,
  type B2bAccessView,
  type B2bDepartment,
} from "./types";

type AccessUser = { id: string; role: string; modules?: string | null };

export async function b2bAccessFor(user: AccessUser): Promise<B2bAccessView> {
  const management = isFullAccessRole(user.role);
  if (management) {
    return {
      userId: user.id,
      departments: ["management", "sales", "revenue", "distribution", "marketing"],
      canContacts: true,
      canCommercial: true,
      canEditPipeline: true,
      canEditActivities: true,
      canEditCommercial: true,
      canEditMaterials: true,
      canManageSettings: true,
      isManagement: true,
    };
  }

  const rows = await prisma()
    .b2bAccess.findMany({ where: { userId: user.id } })
    .catch(() => []);
  const departments = rows.map((row) => row.department).filter(isDepartment);
  const unique = Array.from(new Set(departments.length ? departments : (["sales"] as B2bDepartment[])));
  const canContacts = rows.some((row) => row.canContacts);
  const canCommercial = rows.some((row) => row.canCommercial);
  const hasSales = unique.includes("sales");
  const hasRevenue = unique.includes("revenue") || unique.includes("distribution");
  const hasMarketing = unique.includes("marketing");
  const isManagement = unique.includes("management");

  return {
    userId: user.id,
    departments: unique,
    canContacts: canContacts || isManagement,
    canCommercial: canCommercial || hasRevenue || isManagement,
    canEditPipeline: hasSales || isManagement,
    canEditActivities: hasSales || isManagement,
    canEditCommercial: hasRevenue || isManagement || canCommercial,
    canEditMaterials: hasMarketing || isManagement,
    canManageSettings: isManagement,
    isManagement,
  };
}

export function canOpenB2b(user: AccessUser | null | undefined) {
  if (!user) return false;
  return isFullAccessRole(user.role) || hasModule(user, "b2b");
}
