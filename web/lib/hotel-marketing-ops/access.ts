import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { prisma } from "@/lib/crm/db";
import { ensureHotelMarketingOpsSchema } from "./ensure";
import { HMO_DEPARTMENTS, HMO_MODULE_KEY, type HmoAccessView } from "./types";

type AccessUser = { id: string; role: string; modules?: string | null };

/**
 * Full-access roles see every department and can approve. Everyone else is limited to the
 * departments granted in Settings (default: Marketing / Content only, without approval rights).
 */
export async function hotelMarketingOpsAccessFor(user: AccessUser): Promise<HmoAccessView> {
  await ensureHotelMarketingOpsSchema().catch(() => undefined);
  if (isFullAccessRole(user.role)) {
    return {
      userId: user.id,
      departments: [...HMO_DEPARTMENTS],
      canEditBoard: true,
      canApprove: true,
      canManageSettings: true,
      isManagement: true,
    };
  }

  const rows = await prisma()
    .$queryRawUnsafe<Array<{ department: string; canApprove: number | boolean }>>(
      `SELECT department, canApprove FROM HotelMarketingOpsAccess WHERE userId = ?`,
      user.id,
    )
    .catch(() => []);

  const granted = Array.from(new Set(rows.map((row) => row.department).filter(Boolean)));
  const departments = granted.length ? granted : ["marketing_content"];
  const isManagement = departments.includes("management");

  return {
    userId: user.id,
    departments,
    canEditBoard: departments.length > 0,
    canApprove: rows.some((row) => Boolean(row.canApprove)) || isManagement,
    canManageSettings: isManagement,
    isManagement,
  };
}

export function canOpenHotelMarketingOps(user: AccessUser | null | undefined) {
  if (!user) return false;
  return isFullAccessRole(user.role) || hasModule(user, HMO_MODULE_KEY);
}

export function hmoCanUseDepartment(access: HmoAccessView, department: string) {
  return access.isManagement || access.departments.includes(department);
}
