import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { prisma } from "@/lib/crm/db";
import { ensureManagementSchema } from "./ensure";
import { isDepartment, type MgmtAccessView, type MgmtDepartment } from "./types";

type AccessUser = { id: string; role: string; modules?: string | null };

export async function managementAccessFor(user: AccessUser): Promise<MgmtAccessView> {
  await ensureManagementSchema().catch(() => undefined);
  const management = isFullAccessRole(user.role);
  if (management) {
    return {
      userId: user.id,
      departments: ["management", "marketing", "revenue", "distribution", "sales"],
      canEditBoard: true,
      canManageSettings: true,
      canSeePrivateIds: true,
      isManagement: true,
    };
  }

  const rows = await prisma()
    .$queryRawUnsafe<Array<{ department: string; canSeePrivateIds: number | boolean }>>(
      `SELECT department, canSeePrivateIds FROM ManagementAccess WHERE userId = ?`,
      user.id,
    )
    .catch(() => []);

  const departments = rows.map((row) => row.department).filter(isDepartment);
  const unique = Array.from(new Set(departments.length ? departments : (["management"] as MgmtDepartment[])));
  const isManagement = unique.includes("management");
  const canSeePrivateIds = rows.some((row) => Boolean(row.canSeePrivateIds)) || isManagement;

  return {
    userId: user.id,
    departments: unique,
    canEditBoard: unique.length > 0,
    canManageSettings: isManagement,
    canSeePrivateIds,
    isManagement,
  };
}

export function canOpenManagement(user: AccessUser | null | undefined) {
  if (!user) return false;
  return isFullAccessRole(user.role) || hasModule(user, "management");
}
