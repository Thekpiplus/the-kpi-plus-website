import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { prisma } from "@/lib/crm/db";
import { ensureWebsiteSchema } from "./ensure";
import { isDepartment, type WebAccessView, type WebDepartment } from "./types";

type AccessUser = { id: string; role: string; modules?: string | null };

export async function websiteAccessFor(user: AccessUser): Promise<WebAccessView> {
  await ensureWebsiteSchema().catch(() => undefined);
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
      `SELECT department, canSeePrivateIds FROM WebsiteAccess WHERE userId = ?`,
      user.id,
    )
    .catch(() => []);

  const departments = rows.map((row) => row.department).filter(isDepartment);
  const unique = Array.from(new Set(departments.length ? departments : (["marketing"] as WebDepartment[])));
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

export function canOpenWebsite(user: AccessUser | null | undefined) {
  if (!user) return false;
  return isFullAccessRole(user.role) || hasModule(user, "website");
}
