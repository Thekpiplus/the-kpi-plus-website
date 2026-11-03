import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { prisma } from "@/lib/crm/db";
import { ensureTrainingOpsSchema } from "./ensure";
import { TRN_DEPARTMENTS, type TrnAccessView } from "./types";

type AccessUser = { id: string; role: string; modules?: string | null };

export async function trainingOpsAccessFor(user: AccessUser): Promise<TrnAccessView> {
  await ensureTrainingOpsSchema().catch(() => undefined);
  const management = isFullAccessRole(user.role);
  if (management) {
    return {
      userId: user.id,
      departments: [...TRN_DEPARTMENTS],
      canEditBoard: true,
      canManageSettings: true,
      canSeeParticipants: true,
      isManagement: true,
    };
  }

  const rows = await prisma()
    .$queryRawUnsafe<Array<{ department: string; canSeeParticipants: number | boolean }>>(
      `SELECT department, canSeeParticipants FROM TrainingOpsAccess WHERE userId = ?`,
      user.id,
    )
    .catch(() => []);

  const departments = Array.from(new Set(rows.map((row) => row.department).filter(Boolean)));
  const unique = departments.length ? departments : ["hr_ld"];
  const isManagement = unique.includes("management");
  const canSeeParticipants = rows.some((row) => Boolean(row.canSeeParticipants)) || isManagement;

  return {
    userId: user.id,
    departments: unique,
    canEditBoard: unique.length > 0,
    canManageSettings: isManagement,
    canSeeParticipants,
    isManagement,
  };
}

export function canOpenTrainingOps(user: AccessUser | null | undefined) {
  if (!user) return false;
  return isFullAccessRole(user.role) || hasModule(user, "training");
}
