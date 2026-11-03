"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { staffDirectory } from "@/lib/crm/queries";
import { canEditDepartment, canOpenSolutionsOps, solutionsOpsAccessFor } from "./access";
import { ensureSolutionsOpsSchema } from "./ensure";
import { canDecideSubtask, canTouchSubtask } from "./progress";
import {
  countSubtasks,
  deleteSubtask,
  departmentInUse,
  getSubtaskRow,
  insertSubtask,
  insertSubtaskComment,
  subtaskGateBlock,
  updateSubtask,
  writeFromRow,
  type SolSubtaskWrite,
} from "./subtasks";
import {
  deleteAccessRow,
  getInquiryStatus,
  deleteRelationshipRow,
  findDuplicateRelationship,
  getCategoryRow,
  getRelationshipRow,
  getServiceRow,
  getSolutionsSettings,
  leadExists,
  newId,
  patchServiceRow,
  saveAccessRow,
  saveCategoryRow,
  saveInquiryNoteRow,
  saveRelationshipRow,
  saveServiceRow,
  saveSolutionsSettingsRow,
  writeSolutionsAudit,
} from "./queries";
import {
  MAX_SOL_EXTRA_DEPARTMENTS,
  MAX_SOL_SUBTASKS,
  SOL_APPROVER_STATUSES,
  SOL_BASE_PATH,
  SOL_INQUIRY_GATED_STATUSES,
  SOL_SERVICE_GATED_STATUSES,
  emptyPayload,
  hasContactPattern,
  hasSensitiveText,
  isKnownDepartment,
  normalizeCategoryStatus,
  normalizeConsent,
  normalizeContactPreference,
  normalizeContentStatus,
  normalizeGateKind,
  normalizeImagePermission,
  normalizeInquiryStatus,
  normalizePriority,
  normalizeRelationKind,
  normalizeStatus,
  normalizeSubtaskParent,
  normalizeSubtaskStatus,
  slugifyDepartmentId,
  type SolActionResult,
  type SolExtraDepartment,
  type SolPayload,
  type SolStatus,
  type SolSubtaskParent,
} from "./types";

/** Failure result for blocked gates: error code + comma-separated gate kinds (UI builds the message). */
async function gateFailure(parentType: SolSubtaskParent, parentId: string): Promise<SolActionResult | null> {
  const block = await subtaskGateBlock(parentType, parentId);
  return block ? { ok: false, error: block.error, detail: block.gates.join(",") } : null;
}

async function requireSolutionsOps() {
  const user = await requireUser();
  if (!canOpenSolutionsOps(user)) redirect("/crm?error=forbidden");
  await ensureSolutionsOpsSchema();
  const access = await solutionsOpsAccessFor(user);
  return { user, access };
}

function revalidateSolutions() {
  revalidatePath("/crm");
  revalidatePath(SOL_BASE_PATH, "layout");
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function flag(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "1" || value === "true" || value === "on";
}

/** Returns a MySQL DATETIME string, null for empty input, or undefined when unparseable. */
function optionalDate(value: string): string | null | undefined {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 19).replace("T", " ");
}

function payloadFromForm(formData: FormData): SolPayload {
  const base = emptyPayload();
  return {
    ...base,
    seoTitle: text(formData, "seoTitle"),
    seoDescription: text(formData, "seoDescription"),
    proofSummary: text(formData, "proofSummary"),
    assetNote: text(formData, "assetNote"),
    translationNoteTh: text(formData, "translationNoteTh"),
    translationNoteEn: text(formData, "translationNoteEn"),
    reviewNote: text(formData, "reviewNote"),
  };
}

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export async function saveSolutionsService(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canEdit) return { ok: false, error: "forbidden" };

    const name = text(formData, "name");
    if (!name) return { ok: false, error: "required_name" };

    const payload = payloadFromForm(formData);
    const fields = [
      name,
      text(formData, "publicDescription"),
      text(formData, "problemSolved"),
      text(formData, "suitableFor"),
      text(formData, "deliverables"),
      text(formData, "dependencies"),
      text(formData, "proofSourceRef"),
      ...Object.values(payload),
    ];
    if (hasSensitiveText(...fields)) return { ok: false, error: "blocked_sensitive" };

    const publicRoute = text(formData, "publicRoute");
    if (publicRoute && !(publicRoute === "/solutions" || publicRoute.startsWith("/solutions/"))) return { ok: false, error: "invalid_route" };
    if (payload.seoTitle.length > 70) return { ok: false, error: "seo_title_long" };
    if (payload.seoDescription.length > 200) return { ok: false, error: "seo_description_long" };

    const nextReviewAt = optionalDate(text(formData, "nextReviewAt"));
    if (nextReviewAt === undefined) return { ok: false, error: "invalid_date" };

    const settings = await getSolutionsSettings();
    const rawDepartment = text(formData, "ownerDepartment");
    const ownerDepartment = isKnownDepartment(rawDepartment, settings) ? rawDepartment : "management";
    if (!canEditDepartment(access, ownerDepartment)) return { ok: false, error: "forbidden_department" };

    let id = text(formData, "id");
    let previousStatus: SolStatus | "" = "";
    if (id) {
      const existing = await getServiceRow(id);
      if (!existing) return { ok: false, error: "missing" };
      if (!canEditDepartment(access, String(existing.ownerDepartment ?? ""))) return { ok: false, error: "forbidden_department" };
      previousStatus = normalizeStatus(String(existing.status ?? ""));
    } else {
      id = newId("svc");
    }

    const status = normalizeStatus(text(formData, "status"));
    if (SOL_APPROVER_STATUSES.includes(status) && status !== previousStatus && !access.canApprove) {
      return { ok: false, error: "forbidden_approval" };
    }
    // Blocked gates (permission / evidence / privacy / approval) stop a move to approved or published.
    if (previousStatus && SOL_SERVICE_GATED_STATUSES.includes(status) && status !== previousStatus) {
      const blocked = await gateFailure("service", id);
      if (blocked) return blocked;
    }

    const categoryId = text(formData, "categoryId");
    if (categoryId && !(await getCategoryRow(categoryId))) return { ok: false, error: "missing" };

    const { created } = await saveServiceRow(
      id,
      {
        name,
        categoryId,
        publicDescription: text(formData, "publicDescription"),
        problemSolved: text(formData, "problemSolved"),
        suitableFor: text(formData, "suitableFor"),
        deliverables: text(formData, "deliverables"),
        dependencies: text(formData, "dependencies"),
        ownerDepartment,
        publicRoute,
        contentStatusTh: normalizeContentStatus(text(formData, "contentStatusTh")),
        contentStatusEn: normalizeContentStatus(text(formData, "contentStatusEn")),
        imagePermissionStatus: normalizeImagePermission(text(formData, "imagePermissionStatus")),
        proofSourceRef: text(formData, "proofSourceRef"),
        status,
        nextReviewAt,
        payload,
      },
      user.id,
    );
    await writeSolutionsAudit("service", id, user.id, created ? "create" : "save", `${created ? "Created" : "Saved"} service "${name}" (${status})`);
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/** Status change from the inline row form, board, or approvals queue. */
export async function changeSolutionsServiceStatus(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canEdit) return { ok: false, error: "forbidden" };
    const id = text(formData, "id");
    const existing = id ? await getServiceRow(id) : null;
    if (!existing) return { ok: false, error: "missing" };
    if (!canEditDepartment(access, String(existing.ownerDepartment ?? ""))) return { ok: false, error: "forbidden_department" };

    const status = normalizeStatus(text(formData, "status"));
    const previous = normalizeStatus(String(existing.status ?? ""));
    if (SOL_APPROVER_STATUSES.includes(status) && status !== previous && !access.canApprove) {
      return { ok: false, error: "forbidden_approval" };
    }
    if (SOL_SERVICE_GATED_STATUSES.includes(status) && status !== previous) {
      const blocked = await gateFailure("service", id);
      if (blocked) return blocked;
    }
    const note = text(formData, "note");
    if (note && (hasSensitiveText(note) || hasContactPattern(note))) return { ok: false, error: "blocked_sensitive" };

    await patchServiceRow(id, { status, ...(note ? { reviewNote: note } : {}) }, user.id);
    await writeSolutionsAudit("service", id, user.id, "status", `Status ${previous} → ${status}${note ? ` — ${note}` : ""}`);
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/** Inline review fields: image permission and TH/EN content status. */
export async function quickUpdateSolutionsService(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canEdit) return { ok: false, error: "forbidden" };
    const id = text(formData, "id");
    const existing = id ? await getServiceRow(id) : null;
    if (!existing) return { ok: false, error: "missing" };
    if (!canEditDepartment(access, String(existing.ownerDepartment ?? ""))) return { ok: false, error: "forbidden_department" };

    const patch: Parameters<typeof patchServiceRow>[1] = {};
    const parts: string[] = [];
    if (formData.has("imagePermissionStatus")) {
      patch.imagePermissionStatus = normalizeImagePermission(text(formData, "imagePermissionStatus"));
      parts.push(`image=${patch.imagePermissionStatus}`);
    }
    if (formData.has("contentStatusTh")) {
      patch.contentStatusTh = normalizeContentStatus(text(formData, "contentStatusTh"));
      parts.push(`th=${patch.contentStatusTh}`);
    }
    if (formData.has("contentStatusEn")) {
      patch.contentStatusEn = normalizeContentStatus(text(formData, "contentStatusEn"));
      parts.push(`en=${patch.contentStatusEn}`);
    }
    if (!parts.length) return { ok: false, error: "missing" };

    await patchServiceRow(id, patch, user.id);
    await writeSolutionsAudit("service", id, user.id, "review", `Updated ${parts.join(", ")}`);
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export async function saveSolutionsCategory(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canEdit) return { ok: false, error: "forbidden" };
    const name = text(formData, "name");
    if (!name) return { ok: false, error: "required_name" };
    const description = text(formData, "description");
    if (hasSensitiveText(name, description)) return { ok: false, error: "blocked_sensitive" };
    const rawDepartment = text(formData, "ownerDepartment");
    const ownerDepartment = isKnownDepartment(rawDepartment, await getSolutionsSettings()) ? rawDepartment : "management";
    if (!canEditDepartment(access, ownerDepartment)) return { ok: false, error: "forbidden_department" };

    let id = text(formData, "id");
    if (id) {
      const existing = await getCategoryRow(id);
      if (!existing) return { ok: false, error: "missing" };
      if (!canEditDepartment(access, String(existing.ownerDepartment ?? ""))) return { ok: false, error: "forbidden_department" };
    } else {
      id = newId("cat");
    }
    const sortOrder = Math.max(0, Math.min(9999, Number.parseInt(text(formData, "sortOrder"), 10) || 0));
    const created = await saveCategoryRow(
      id,
      { name, description, ownerDepartment, sortOrder, status: normalizeCategoryStatus(text(formData, "status")) },
      user.id,
    );
    await writeSolutionsAudit("category", id, user.id, created ? "create" : "save", `${created ? "Created" : "Saved"} category "${name}"`);
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/* -------------------------------------------------------------------------- */
/* Relationships                                                              */
/* -------------------------------------------------------------------------- */

export async function saveSolutionsRelationship(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canEdit) return { ok: false, error: "forbidden" };
    const from = text(formData, "fromServiceId");
    const to = text(formData, "toServiceId");
    if (!from || !to) return { ok: false, error: "required_service" };
    if (from === to) return { ok: false, error: "same_service" };
    const [fromRow, toRow] = await Promise.all([getServiceRow(from), getServiceRow(to)]);
    if (!fromRow || !toRow) return { ok: false, error: "missing" };
    // Editing a relationship requires edit rights on the "from" service's department.
    if (!canEditDepartment(access, String(fromRow.ownerDepartment ?? ""))) return { ok: false, error: "forbidden_department" };
    const notes = text(formData, "notes");
    if (hasSensitiveText(notes)) return { ok: false, error: "blocked_sensitive" };
    const kind = normalizeRelationKind(text(formData, "kind"));
    const id = text(formData, "id") || newId("rel");
    if (text(formData, "id") && !(await getRelationshipRow(id))) return { ok: false, error: "missing" };
    if (await findDuplicateRelationship(from, to, kind, id)) return { ok: false, error: "duplicate_relationship" };
    const created = await saveRelationshipRow(id, { fromServiceId: from, toServiceId: to, kind, notes }, user.id);
    await writeSolutionsAudit(
      "relationship",
      id,
      user.id,
      created ? "create" : "save",
      `${created ? "Linked" : "Updated"} ${String(fromRow.name ?? "")} → ${String(toRow.name ?? "")} (${kind})`,
    );
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

export async function removeSolutionsRelationship(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canEdit) return { ok: false, error: "forbidden" };
    const id = text(formData, "id");
    const existing = id ? await getRelationshipRow(id) : null;
    if (!existing) return { ok: false, error: "missing" };
    const fromRow = await getServiceRow(String(existing.fromServiceId ?? ""));
    if (fromRow && !canEditDepartment(access, String(fromRow.ownerDepartment ?? ""))) return { ok: false, error: "forbidden_department" };
    await deleteRelationshipRow(id);
    await writeSolutionsAudit("relationship", id, user.id, "delete", "Removed relationship");
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/* -------------------------------------------------------------------------- */
/* Inquiry overlay notes                                                      */
/* -------------------------------------------------------------------------- */

export async function saveSolutionsInquiryNote(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canEdit) return { ok: false, error: "forbidden" };
    const leadId = text(formData, "leadId");
    if (!leadId || !(await leadExists(leadId))) return { ok: false, error: "missing" };
    const needCategory = text(formData, "needCategory");
    const selectedServices = text(formData, "selectedServices");
    const notes = text(formData, "notes");
    if (hasSensitiveText(needCategory, selectedServices, notes)) return { ok: false, error: "blocked_sensitive" };
    if (hasContactPattern(needCategory, selectedServices, notes)) return { ok: false, error: "blocked_contact" };
    const nextActionAt = optionalDate(text(formData, "nextActionAt"));
    if (nextActionAt === undefined) return { ok: false, error: "invalid_date" };
    const status = normalizeInquiryStatus(text(formData, "status"));
    // Closing an inquiry is blocked while any subtask is blocked on a permission/evidence/privacy/approval gate.
    if (SOL_INQUIRY_GATED_STATUSES.includes(status) && status !== (await getInquiryStatus(leadId))) {
      const blocked = await gateFailure("inquiry", leadId);
      if (blocked) return blocked;
    }
    await saveInquiryNoteRow(
      leadId,
      {
        needCategory,
        selectedServices: selectedServices.slice(0, 500),
        contactPreference: normalizeContactPreference(text(formData, "contactPreference")),
        ownerId: text(formData, "ownerId"),
        status,
        nextActionAt,
        consentStatus: normalizeConsent(text(formData, "consentStatus")),
        notes,
      },
      user.id,
    );
    // Audit never records lead names or contact details — only the lead id and status.
    await writeSolutionsAudit("inquiry", leadId, user.id, "save", `Inquiry status ${status}`);
    revalidateSolutions();
    return { ok: true, id: leadId };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/* -------------------------------------------------------------------------- */
/* Settings / access                                                          */
/* -------------------------------------------------------------------------- */

export async function saveSolutionsSettings(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canManageSettings) return { ok: false, error: "forbidden" };
    const days = Number.parseInt(text(formData, "reviewIntervalDays"), 10);
    if (!Number.isFinite(days) || days < 7 || days > 365) return { ok: false, error: "invalid_days" };
    const internalNote = text(formData, "internalNote");
    if (hasSensitiveText(internalNote)) return { ok: false, error: "blocked_sensitive" };
    const current = await getSolutionsSettings();
    await saveSolutionsSettingsRow(
      {
        reviewIntervalDays: days,
        inquiryDefaultOwnerId: text(formData, "inquiryDefaultOwnerId") || current.inquiryDefaultOwnerId,
        internalNote,
        // Extra departments are managed by their own actions — never overwritten here.
        extraDepartments: current.extraDepartments,
      },
      user.id,
    );
    await writeSolutionsAudit("settings", "default", user.id, "settings", `Review interval ${days} days`);
    revalidateSolutions();
    return { ok: true, id: "default" };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

export async function saveSolutionsAccess(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canManageSettings) return { ok: false, error: "forbidden" };
    const userId = text(formData, "userId");
    const department = text(formData, "department");
    if (!userId) return { ok: false, error: "missing" };
    if (!isKnownDepartment(department, await getSolutionsSettings())) return { ok: false, error: "forbidden_department" };
    const canSeeContacts = flag(formData, "canSeeContacts");
    const canApprove = flag(formData, "canApprove");
    const id = await saveAccessRow(userId, department, canSeeContacts, canApprove);
    await writeSolutionsAudit(
      "settings",
      id,
      user.id,
      "access",
      `Access ${department}: contacts=${canSeeContacts ? "yes" : "no"}, approve=${canApprove ? "yes" : "no"} (user ${userId})`,
    );
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

export async function deleteSolutionsAccess(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canManageSettings) return { ok: false, error: "forbidden" };
    const id = text(formData, "id");
    if (!id) return { ok: false, error: "missing" };
    await deleteAccessRow(id);
    await writeSolutionsAudit("settings", id, user.id, "access", "Removed access row");
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/* -------------------------------------------------------------------------- */
/* Extra departments (Settings)                                               */
/* -------------------------------------------------------------------------- */

export async function addSolutionsDepartment(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canManageSettings) return { ok: false, error: "forbidden" };
    const label = text(formData, "label").slice(0, 80);
    if (label.length < 2) return { ok: false, error: "required_name" };
    if (hasSensitiveText(label) || hasContactPattern(label)) return { ok: false, error: "blocked_sensitive" };
    const id = slugifyDepartmentId(text(formData, "id") || label);
    if (!id) return { ok: false, error: "invalid_department" };
    const current = await getSolutionsSettings();
    if (isKnownDepartment(id, current)) return { ok: false, error: "duplicate_department" };
    if (current.extraDepartments.length >= MAX_SOL_EXTRA_DEPARTMENTS) return { ok: false, error: "department_limit" };
    const extraDepartments: SolExtraDepartment[] = [...current.extraDepartments, { id, label }];
    await saveSolutionsSettingsRow({ ...current, extraDepartments }, user.id);
    await writeSolutionsAudit("settings", id, user.id, "department", `Added department "${label}" (${id})`);
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

export async function removeSolutionsDepartment(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canManageSettings) return { ok: false, error: "forbidden" };
    const id = text(formData, "id");
    const current = await getSolutionsSettings();
    const target = current.extraDepartments.find((item) => item.id === id);
    if (!target) return { ok: false, error: "missing" };
    if (await departmentInUse(id)) return { ok: false, error: "department_in_use" };
    await saveSolutionsSettingsRow({ ...current, extraDepartments: current.extraDepartments.filter((item) => item.id !== id) }, user.id);
    await writeSolutionsAudit("settings", id, user.id, "department", `Removed department "${target.label}" (${id})`);
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/* -------------------------------------------------------------------------- */
/* Cross-department subtasks                                                  */
/* -------------------------------------------------------------------------- */

type ParentInfo = { ok: true; department: string | null } | { ok: false; error: string };

/** Services own a department; inquiries (leadId) do not. */
async function resolveParent(parentType: SolSubtaskParent, parentId: string): Promise<ParentInfo> {
  if (!parentId) return { ok: false, error: "missing" };
  if (parentType === "service") {
    const row = await getServiceRow(parentId);
    return row ? { ok: true, department: String(row.ownerDepartment ?? "") } : { ok: false, error: "missing" };
  }
  return (await leadExists(parentId)) ? { ok: true, department: null } : { ok: false, error: "missing" };
}

function subtaskTextError(...values: string[]): string | null {
  if (hasSensitiveText(...values)) return "blocked_sensitive";
  if (hasContactPattern(...values)) return "blocked_contact";
  return null;
}

/** Evidence is a https:// link or plain internal reference text — other URL schemes are rejected. */
function evidenceError(value: string) {
  if (!value) return null;
  if (/^(javascript|data|vbscript|file):/i.test(value)) return "invalid_evidence";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value) && !/^https?:\/\//i.test(value)) return "invalid_evidence";
  return null;
}

async function staffIds() {
  const staff = await staffDirectory().catch(() => [] as Array<{ id: string }>);
  return new Set(staff.map((item) => item.id));
}

export async function saveSolutionsSubtask(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canEdit) return { ok: false, error: "forbidden" };

    let id = text(formData, "id");
    const existing = id ? await getSubtaskRow(id) : null;
    if (id && !existing) return { ok: false, error: "missing" };
    const parentType = existing ? normalizeSubtaskParent(String(existing.parentType ?? "")) : normalizeSubtaskParent(text(formData, "parentType"));
    const parentId = existing ? String(existing.parentId ?? "") : text(formData, "parentId");
    const parent = await resolveParent(parentType, parentId);
    if (!parent.ok) return { ok: false, error: parent.error };

    const name = text(formData, "name").slice(0, 255);
    if (!name) return { ok: false, error: "required_name" };
    const settings = await getSolutionsSettings();
    const department = text(formData, "department");
    if (!isKnownDepartment(department, settings)) return { ok: false, error: "invalid_department" };
    const comments = text(formData, "comments");
    const evidence = text(formData, "evidence");
    const textError = subtaskTextError(name, comments, evidence);
    if (textError) return { ok: false, error: textError };
    const evError = evidenceError(evidence);
    if (evError) return { ok: false, error: evError };
    const dueAt = optionalDate(text(formData, "dueAt"));
    if (dueAt === undefined) return { ok: false, error: "invalid_date" };

    const staff = await staffIds();
    const ownerId = text(formData, "ownerId");
    const reviewerId = text(formData, "reviewerId");
    if ((ownerId && !staff.has(ownerId)) || (reviewerId && !staff.has(reviewerId))) return { ok: false, error: "missing" };

    let status = normalizeSubtaskStatus(text(formData, "status"));
    const completed = flag(formData, "completed") || status === "completed";
    if (completed) status = "completed";
    if (status === "needs_review" && !reviewerId) return { ok: false, error: "missing_reviewer" };

    if (!canTouchSubtask(access, { department, ownerId, reviewerId }, parent.department)) return { ok: false, error: "forbidden_department" };
    if (existing) {
      const before = { department: String(existing.department ?? ""), ownerId: String(existing.ownerId ?? ""), reviewerId: String(existing.reviewerId ?? "") };
      if (!canTouchSubtask(access, before, parent.department)) return { ok: false, error: "forbidden_department" };
      // A gate-blocked subtask with a reviewer can only be cleared by that reviewer or an approver.
      const wasGateBlocked = String(existing.status) === "blocked" && normalizeGateKind(String(existing.gateKind ?? "")) !== "none";
      if (wasGateBlocked && status !== "blocked" && before.reviewerId && !canDecideSubtask(access, before.reviewerId)) {
        return { ok: false, error: "forbidden_review" };
      }
    }

    const data: SolSubtaskWrite = {
      name,
      department,
      ownerId,
      reviewerId,
      status,
      completed,
      dueAt,
      priority: normalizePriority(text(formData, "priority")),
      comments,
      evidence,
      gateKind: normalizeGateKind(text(formData, "gateKind")),
    };

    if (!existing) {
      if ((await countSubtasks(parentType, parentId)) >= MAX_SOL_SUBTASKS) return { ok: false, error: "subtask_limit" };
      id = await insertSubtask(parentType, parentId, data, user.id);
    } else {
      await updateSubtask(id, data, user.id);
    }
    await writeSolutionsAudit(
      parentType,
      parentId,
      user.id,
      "subtask",
      `${existing ? "Saved" : "Added"} subtask "${name}" (${department}, ${status}${data.gateKind !== "none" ? `, gate ${data.gateKind}` : ""})`,
    );
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/** Load a subtask and verify the caller may touch it. */
async function touchableSubtask(formData: FormData) {
  const ctx = await requireSolutionsOps();
  if (!ctx.access.canEdit) return { ...ctx, error: "forbidden" as const };
  const id = text(formData, "id");
  const row = id ? await getSubtaskRow(id) : null;
  if (!row) return { ...ctx, error: "missing" as const };
  const parentType = normalizeSubtaskParent(String(row.parentType ?? ""));
  const parentId = String(row.parentId ?? "");
  const parent = await resolveParent(parentType, parentId);
  if (!parent.ok) return { ...ctx, error: "missing" as const };
  const ownership = { department: String(row.department ?? ""), ownerId: String(row.ownerId ?? ""), reviewerId: String(row.reviewerId ?? "") };
  if (!canTouchSubtask(ctx.access, ownership, parent.department)) return { ...ctx, error: "forbidden_department" as const };
  return { ...ctx, error: null, id, row, parentType, parentId };
}

export async function completeSolutionsSubtask(formData: FormData): Promise<SolActionResult> {
  try {
    const ctx = await touchableSubtask(formData);
    if (ctx.error) return { ok: false, error: ctx.error };
    const { user, access, id, row, parentType, parentId } = ctx;
    const done = flag(formData, "completed");
    const data = writeFromRow(row);
    if (done && data.status === "blocked" && data.gateKind !== "none" && data.reviewerId && !canDecideSubtask(access, data.reviewerId)) {
      return { ok: false, error: "forbidden_review" };
    }
    data.completed = done;
    data.status = done ? "completed" : data.status === "completed" ? "in_progress" : normalizeSubtaskStatus(data.status);
    await updateSubtask(id, data, user.id);
    await writeSolutionsAudit(parentType, parentId, user.id, "subtask", `${done ? "Completed" : "Reopened"} subtask "${data.name}"`);
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/** Deletes a subtask (audited). The 1–10 range limits adding; the last subtask may still be removed. */
export async function removeSolutionsSubtask(formData: FormData): Promise<SolActionResult> {
  try {
    const ctx = await touchableSubtask(formData);
    if (ctx.error) return { ok: false, error: ctx.error };
    const { user, id, row, parentType, parentId } = ctx;
    await deleteSubtask(id);
    await writeSolutionsAudit(parentType, parentId, user.id, "subtask", `Removed subtask "${String(row.name ?? "")}"`);
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

export async function addSolutionsSubtaskComment(formData: FormData): Promise<SolActionResult> {
  try {
    const { user, access } = await requireSolutionsOps();
    if (!access.canEdit) return { ok: false, error: "forbidden" };
    const id = text(formData, "id");
    const body = text(formData, "body").slice(0, 1000);
    if (!body) return { ok: false, error: "missing_comment" };
    const textError = subtaskTextError(body);
    if (textError) return { ok: false, error: textError };
    const row = id ? await getSubtaskRow(id) : null;
    if (!row) return { ok: false, error: "missing" };
    await insertSubtaskComment(id, user.id, body);
    await writeSolutionsAudit(
      normalizeSubtaskParent(String(row.parentType ?? "")),
      String(row.parentId ?? ""),
      user.id,
      "comment",
      `Comment on subtask "${String(row.name ?? "")}"`,
    );
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/** Reviewer decision on a subtask waiting for review: approve → completed, reject → blocked. */
export async function decideSolutionsSubtask(formData: FormData): Promise<SolActionResult> {
  try {
    const ctx = await touchableSubtask(formData);
    if (ctx.error) return { ok: false, error: ctx.error };
    const { user, access, id, row, parentType, parentId } = ctx;
    const decision = text(formData, "decision");
    if (decision !== "approve" && decision !== "reject") return { ok: false, error: "missing" };
    const data = writeFromRow(row);
    if (data.status !== "needs_review") return { ok: false, error: "invalid_state" };
    if (!canDecideSubtask(access, data.reviewerId)) return { ok: false, error: "forbidden_review" };
    const note = text(formData, "note").slice(0, 1000);
    if (decision === "reject" && !note) return { ok: false, error: "missing_comment" };
    if (note) {
      const textError = subtaskTextError(note);
      if (textError) return { ok: false, error: textError };
    }
    data.status = decision === "approve" ? "completed" : "blocked";
    data.completed = decision === "approve";
    await updateSubtask(id, data, user.id);
    await insertSubtaskComment(id, user.id, `[${decision === "approve" ? "Approved" : "Rejected"}]${note ? ` ${note}` : ""}`);
    await writeSolutionsAudit(parentType, parentId, user.id, "subtask", `${decision === "approve" ? "Approved" : "Rejected"} subtask "${data.name}"`);
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/** Escalate: mark a subtask blocked or needs_review, assign a reviewer, and leave a note. */
export async function escalateSolutionsSubtask(formData: FormData): Promise<SolActionResult> {
  try {
    const ctx = await touchableSubtask(formData);
    if (ctx.error) return { ok: false, error: ctx.error };
    const { user, id, row, parentType, parentId } = ctx;
    const target = text(formData, "status") === "blocked" ? "blocked" : "needs_review";
    const reviewerId = text(formData, "reviewerId");
    const note = text(formData, "note").slice(0, 1000);
    if (!note) return { ok: false, error: "missing_comment" };
    const textError = subtaskTextError(note);
    if (textError) return { ok: false, error: textError };
    if (target === "needs_review" && !reviewerId) return { ok: false, error: "missing_reviewer" };
    if (reviewerId && !(await staffIds()).has(reviewerId)) return { ok: false, error: "missing" };
    const data = writeFromRow(row);
    data.status = target;
    data.completed = false;
    if (reviewerId) data.reviewerId = reviewerId;
    if (text(formData, "gateKind")) data.gateKind = normalizeGateKind(text(formData, "gateKind"));
    await updateSubtask(id, data, user.id);
    await insertSubtaskComment(id, user.id, `[Escalated → ${target}] ${note}`);
    await writeSolutionsAudit(
      parentType,
      parentId,
      user.id,
      "subtask",
      `Escalated subtask "${data.name}" → ${target}${data.gateKind !== "none" ? ` (gate ${data.gateKind})` : ""}`,
    );
    revalidateSolutions();
    return { ok: true, id };
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { ok: false, error: "save_failed" };
  }
}

/** next/navigation redirect() throws a special error that must be re-thrown. */
function isRedirect(error: unknown) {
  const digest = (error as { digest?: unknown } | null)?.digest;
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT");
}
