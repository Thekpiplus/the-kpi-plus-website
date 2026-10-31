import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { prisma } from "@/lib/crm/db";
import { ensureHotelAiOpsSchema } from "./ensure";
import { HAI_DEPARTMENTS, type HaiAccessView } from "./types";

type AccessUser = { id: string; role: string; modules?: string | null };

export async function hotelAiAccessFor(user: AccessUser): Promise<HaiAccessView> {
  await ensureHotelAiOpsSchema().catch(() => undefined);
  const management = isFullAccessRole(user.role);
  if (management) {
    return {
      userId: user.id,
      departments: [...HAI_DEPARTMENTS],
      canEditBoard: true,
      canManageSettings: true,
      canSeePrivateIds: true,
      isManagement: true,
    };
  }

  const rows = await prisma()
    .$queryRawUnsafe<Array<{ department: string; canSeePrivateIds: number | boolean }>>(
      `SELECT department, canSeePrivateIds FROM HotelAiAccess WHERE userId = ?`,
      user.id,
    )
    .catch(() => []);

  const departments = Array.from(new Set(rows.map((row) => row.department).filter(Boolean)));
  const unique = departments.length ? departments : ["management"];
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

export function canOpenHotelAi(user: AccessUser | null | undefined) {
  if (!user) return false;
  return isFullAccessRole(user.role) || hasModule(user, "hotel_ai");
}
