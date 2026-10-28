import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { prisma } from "@/lib/crm/db";
import { ensureConversionSchema } from "./ensure";
import { isDepartment, type ConvAccessView, type ConvDepartment } from "./types";

type AccessUser = { id: string; role: string; modules?: string | null };

export async function conversionAccessFor(user: AccessUser): Promise<ConvAccessView> {
  await ensureConversionSchema().catch(() => undefined);
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
      `SELECT department, canSeePrivateIds FROM ConversionAccess WHERE userId = ?`,
      user.id,
    )
    .catch(() => []);

  const departments = rows.map((row) => row.department).filter(isDepartment);
  const unique = Array.from(new Set(departments.length ? departments : (["marketing"] as ConvDepartment[])));
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

export function canOpenConversion(user: AccessUser | null | undefined) {
  if (!user) return false;
  return isFullAccessRole(user.role) || hasModule(user, "conversion");
}
