import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { prisma } from "@/lib/crm/db";
import { ensureSolutionsOpsSchema } from "./ensure";
import { SOL_DEPARTMENTS, allDepartments, parseSettings, type SolAccessView } from "./types";

type AccessUser = { id: string; role: string; modules?: string | null };

export function canOpenSolutionsOps(user: AccessUser | null | undefined) {
  if (!user) return false;
  return isFullAccessRole(user.role) || hasModule(user, "solutions");
}

/** Reads settings directly (queries.ts imports this file, so it cannot be imported here). */
async function everyDepartmentId() {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ settingsJson?: unknown }>>(`SELECT settingsJson FROM SolutionsOpsSettings WHERE id = 'default' LIMIT 1`)
    .catch(() => [] as Array<{ settingsJson?: unknown }>);
  const ids = allDepartments(parseSettings(rows[0]?.settingsJson)).map((item) => item.id);
  return ids.length ? ids : [...SOL_DEPARTMENTS];
}

/**
 * Least privilege:
 * - full-access roles (owner/admin) → everything, including extra departments from Settings.
 * - everyone else with the `solutions` module is read-only until a manager grants
 *   department rows in Settings. Contact PII and approval rights are separate flags.
 * - extra departments can be granted exactly like the core nine.
 */
export async function solutionsOpsAccessFor(user: AccessUser): Promise<SolAccessView> {
  await ensureSolutionsOpsSchema().catch(() => undefined);

  if (isFullAccessRole(user.role)) {
    return {
      userId: user.id,
      departments: await everyDepartmentId(),
      isManagement: true,
      canEdit: true,
      canApprove: true,
      canManageSettings: true,
      canSeeContacts: true,
    };
  }

  const rows = await prisma()
    .$queryRawUnsafe<Array<{ department: string; canSeeContacts: number | boolean; canApprove: number | boolean }>>(
      `SELECT department, canSeeContacts, canApprove FROM SolutionsOpsAccess WHERE userId = ?`,
      user.id,
    )
    .catch(() => []);

  const departments = Array.from(new Set(rows.map((row) => row.department).filter(Boolean)));
  const isManagement = departments.includes("management");
  const scoped = isManagement ? await everyDepartmentId() : departments;

  return {
    userId: user.id,
    departments: scoped,
    isManagement,
    canEdit: scoped.length > 0,
    canApprove: isManagement || rows.some((row) => Boolean(row.canApprove)),
    // A management row does not by itself unlock contact PII — it must be granted explicitly.
    canManageSettings: isManagement,
    canSeeContacts: rows.some((row) => Boolean(row.canSeeContacts)),
  };
}

export function canEditDepartment(access: SolAccessView, department: string) {
  return access.isManagement || access.departments.includes(department);
}