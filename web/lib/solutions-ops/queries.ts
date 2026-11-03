import { prisma } from "@/lib/crm/db";
import { staffDirectory } from "@/lib/crm/queries";
import { randomToken } from "@/lib/crm/security";
import { canEditDepartment, solutionsOpsAccessFor } from "./access";
import { ensureSolutionsOpsSchema } from "./ensure";
import { solNextDue, solPriorityRank, solSubtaskProgress } from "./progress";
import { loadSubtasks } from "./subtasks";
import {
  MASKED_VALUE,
  SOL_DEPARTMENTS,
  SOL_UPCOMING_DAYS,
  allDepartments,
  parseSettings,
  normalizeCategoryStatus,
  normalizeConsent,
  normalizeContactPreference,
  normalizeContentStatus,
  normalizeGroupBy,
  normalizeImagePermission,
  normalizeInquiryStatus,
  normalizeRelationKind,
  normalizeStatus,
  parsePayload,
  type SolAccessRow,
  type SolAccessView,
  type SolAuditRow,
  type SolCategoryRow,
  type SolGroupBy,
  type SolInquiryRow,
  type SolListFilters,
  type SolPayload,
  type SolRelationshipRow,
  type SolSection,
  type SolDepartmentOption,
  type SolServiceRow,
  type SolSettings,
  type SolSubtaskView,
} from "./types";

type Raw = Record<string, unknown>;
type Staff = { id: string; name: string; email?: string };

function col(row: Raw, key: string) {
  const value = row[key];
  return value == null ? "" : String(value);
}

function iso(value: unknown) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function bool(value: unknown) {
  return Number(value) === 1;
}

export function newId(prefix: string) {
  return `${prefix}_${randomToken(10)}`;
}

/* -------------------------------------------------------------------------- */
/* Settings                                                                   */
/* -------------------------------------------------------------------------- */

export async function getSolutionsSettings(): Promise<SolSettings> {
  await ensureSolutionsOpsSchema();
  const rows = await prisma()
    .$queryRawUnsafe<Raw[]>(`SELECT settingsJson FROM SolutionsOpsSettings WHERE id = 'default' LIMIT 1`)
    .catch(() => [] as Raw[]);
  return parseSettings(rows[0]?.settingsJson);
}

export async function saveSolutionsSettingsRow(next: Omit<SolSettings, "seededAt">, userId: string) {
  const current = await getSolutionsSettings();
  const merged: SolSettings = { ...next, seededAt: current.seededAt || new Date().toISOString() };
  await prisma().$executeRawUnsafe(
    `INSERT INTO SolutionsOpsSettings (id, settingsJson, updatedBy) VALUES ('default', ?, ?)
     ON DUPLICATE KEY UPDATE settingsJson = VALUES(settingsJson), updatedBy = VALUES(updatedBy)`,
    JSON.stringify(merged),
    userId,
  );
}

/* -------------------------------------------------------------------------- */
/* Audit                                                                      */
/* -------------------------------------------------------------------------- */

export async function writeSolutionsAudit(entityType: string, entityId: string, userId: string, action: string, detail: string) {
  await prisma()
    .$executeRawUnsafe(
      `INSERT INTO SolutionsOpsAudit (id, entityType, entityId, action, detail, createdBy) VALUES (?, ?, ?, ?, ?, ?)`,
      newId("sau"),
      entityType,
      entityId,
      action,
      detail.slice(0, 1000),
      userId,
    )
    .catch(() => undefined);
}

export async function listSolutionsAudit(limit = 200): Promise<SolAuditRow[]> {
  await ensureSolutionsOpsSchema();
  const [rows, staff, services, categories] = await Promise.all([
    prisma()
      .$queryRawUnsafe<Raw[]>(`SELECT * FROM SolutionsOpsAudit ORDER BY createdAt DESC LIMIT ${Math.max(1, Math.min(500, limit))}`)
      .catch(() => [] as Raw[]),
    staffDirectory().catch(() => [] as Staff[]),
    prisma().$queryRawUnsafe<Raw[]>(`SELECT id, name FROM SolutionsService`).catch(() => [] as Raw[]),
    prisma().$queryRawUnsafe<Raw[]>(`SELECT id, name FROM SolutionsCategory`).catch(() => [] as Raw[]),
  ]);
  const people = new Map(staff.map((item) => [item.id, item.name]));
  const names = new Map<string, string>();
  for (const row of services) names.set(`service:${col(row, "id")}`, col(row, "name"));
  for (const row of categories) names.set(`category:${col(row, "id")}`, col(row, "name"));
  return rows.map((row) => {
    const entityType = col(row, "entityType");
    const entityId = col(row, "entityId");
    const by = col(row, "createdBy");
    return {
      id: col(row, "id"),
      entityType,
      entityId,
      entityName: names.get(`${entityType}:${entityId}`) || (entityType === "inquiry" ? "Inquiry" : entityType === "settings" ? "Settings" : entityId),
      action: col(row, "action"),
      detail: col(row, "detail"),
      createdBy: by,
      createdByName: people.get(by) || (by === "system" ? "System" : by),
      createdAt: iso(row.createdAt),
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export async function listSolutionsCategories(): Promise<SolCategoryRow[]> {
  await ensureSolutionsOpsSchema();
  const [rows, counts] = await Promise.all([
    prisma().$queryRawUnsafe<Raw[]>(`SELECT * FROM SolutionsCategory ORDER BY sortOrder ASC, name ASC`).catch(() => [] as Raw[]),
    prisma()
      .$queryRawUnsafe<Raw[]>(`SELECT categoryId, COUNT(*) AS n FROM SolutionsService WHERE archived = 0 GROUP BY categoryId`)
      .catch(() => [] as Raw[]),
  ]);
  const byCategory = new Map(counts.map((row) => [col(row, "categoryId"), Number(row.n ?? 0)]));
  return rows.map((row) => ({
    id: col(row, "id"),
    name: col(row, "name"),
    description: col(row, "description"),
    ownerDepartment: col(row, "ownerDepartment"),
    sortOrder: Number(row.sortOrder ?? 0),
    status: normalizeCategoryStatus(col(row, "status")),
    serviceCount: byCategory.get(col(row, "id")) ?? 0,
    updatedAt: iso(row.updatedAt),
  }));
}

export async function getCategoryRow(id: string) {
  const rows = await prisma().$queryRawUnsafe<Raw[]>(`SELECT * FROM SolutionsCategory WHERE id = ? LIMIT 1`, id).catch(() => [] as Raw[]);
  return rows[0] ?? null;
}

export async function saveCategoryRow(
  id: string,
  data: { name: string; description: string; ownerDepartment: string; sortOrder: number; status: string },
  userId: string,
) {
  const existing = await getCategoryRow(id);
  if (existing) {
    await prisma().$executeRawUnsafe(
      `UPDATE SolutionsCategory SET name=?, description=?, ownerDepartment=?, sortOrder=?, status=?, updatedBy=? WHERE id=?`,
      data.name,
      data.description,
      data.ownerDepartment,
      data.sortOrder,
      data.status,
      userId,
      id,
    );
    return false;
  }
  await prisma().$executeRawUnsafe(
    `INSERT INTO SolutionsCategory (id, name, description, ownerDepartment, sortOrder, status, createdBy, updatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    data.name,
    data.description,
    data.ownerDepartment,
    data.sortOrder,
    data.status,
    userId,
    userId,
  );
  return true;
}

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

function mapService(
  row: Raw,
  access: SolAccessView,
  names: Map<string, string>,
  categories: Map<string, string>,
  subtasks: SolSubtaskView[] = [],
): SolServiceRow {
  const owner = col(row, "ownerDepartment");
  return {
    id: col(row, "id"),
    name: col(row, "name"),
    categoryId: col(row, "categoryId"),
    categoryName: categories.get(col(row, "categoryId")) ?? "",
    publicDescription: col(row, "publicDescription"),
    problemSolved: col(row, "problemSolved"),
    suitableFor: col(row, "suitableFor"),
    deliverables: col(row, "deliverables"),
    dependencies: col(row, "dependencies"),
    ownerDepartment: owner,
    publicRoute: col(row, "publicRoute"),
    contentStatusTh: normalizeContentStatus(col(row, "contentStatusTh")),
    contentStatusEn: normalizeContentStatus(col(row, "contentStatusEn")),
    imagePermissionStatus: normalizeImagePermission(col(row, "imagePermissionStatus")),
    proofSourceRef: col(row, "proofSourceRef"),
    status: normalizeStatus(col(row, "status")),
    nextReviewAt: iso(row.nextReviewAt),
    archived: bool(row.archived),
    payload: parsePayload(row.payloadJson),
    createdBy: col(row, "createdBy"),
    createdByName: names.get(col(row, "createdBy")) || (col(row, "createdBy") === "system" ? "System" : ""),
    updatedBy: col(row, "updatedBy"),
    updatedByName: names.get(col(row, "updatedBy")) || (col(row, "updatedBy") === "system" ? "System" : ""),
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
    editable: access.canEdit && canEditDepartment(access, owner),
    subtasks,
    progress: solSubtaskProgress(subtasks),
    nextDueAt: solNextDue(subtasks, iso(row.nextReviewAt)),
  };
}

function startOfDay(value: string, end = false) {
  const date = new Date(`${value}T${end ? "23:59:59.999" : "00:00:00.000"}`);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
}

const PRIORITY_NAME_COLLATOR = new Intl.Collator("th");

const SECTION_STATUS_FILTER: Partial<Record<SolSection, string[]>> = {
  approvals: ["review", "approved"],
};

export type SolServicesResult = {
  access: SolAccessView;
  settings: SolSettings;
  items: SolServiceRow[];
  categories: SolCategoryRow[];
  staff: Staff[];
  groupBy: SolGroupBy;
  /** Core + extra departments, in display order. */
  departments: SolDepartmentOption[];
};

export async function listSolutionsServices(
  user: { id: string; role: string; modules?: string | null },
  filters: SolListFilters,
  section: SolSection,
): Promise<SolServicesResult> {
  await ensureSolutionsOpsSchema();
  const [access, settings, staff, categories, rows] = await Promise.all([
    solutionsOpsAccessFor(user),
    getSolutionsSettings(),
    staffDirectory().catch(() => [] as Staff[]),
    listSolutionsCategories(),
    prisma().$queryRawUnsafe<Raw[]>(`SELECT * FROM SolutionsService ORDER BY name ASC`).catch(() => [] as Raw[]),
  ]);
  const people = new Map(staff.map((item) => [item.id, item.name]));
  const categoryNames = new Map(categories.map((item) => [item.id, item.name]));
  const q = (filters.q ?? "").trim().toLowerCase();
  const sectionStatuses = SECTION_STATUS_FILTER[section];
  const subtasksByService = await loadSubtasks(
    "service",
    rows.map((row) => col(row, "id")),
    people,
  );

  const now = Date.now();
  const upcomingEnd = now + SOL_UPCOMING_DAYS * 86_400_000;
  const rangeFrom = filters.dueFrom ? startOfDay(filters.dueFrom) : null;
  const rangeTo = filters.dueTo ? startOfDay(filters.dueTo, true) : null;

  const items = rows
    .map((row) => mapService(row, access, people, categoryNames, subtasksByService.get(col(row, "id")) ?? []))
    .filter((item) => {
      if (filters.status) {
        if (item.status !== filters.status) return false;
      } else if (item.status === "archived" && !sectionStatuses) {
        return false;
      }
      if (sectionStatuses && !sectionStatuses.includes(item.status)) return false;
      if (filters.department && item.ownerDepartment !== filters.department) return false;
      if (filters.category && item.categoryId !== filters.category) return false;
      // Services have no owner of their own — the owner filter matches any subtask owner on the service.
      if (filters.owner && !item.subtasks.some((task) => task.ownerId === filters.owner)) return false;
      if (filters.due) {
        const due = item.nextDueAt ? new Date(item.nextDueAt).getTime() : Number.NaN;
        if (Number.isNaN(due)) return false;
        if (filters.due === "overdue" && !(due <= now)) return false;
        if (filters.due === "upcoming" && !(due > now && due <= upcomingEnd)) return false;
        if (filters.due === "range") {
          if (rangeFrom !== null && due < rangeFrom) return false;
          if (rangeTo !== null && due > rangeTo) return false;
        }
      }
      if (q) {
        const haystack = `${item.name} ${item.publicRoute} ${item.publicDescription} ${item.proofSourceRef} ${item.subtasks.map((task) => task.name).join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

  const dueTime = (value: string) => (value ? new Date(value).getTime() : Number.POSITIVE_INFINITY);
  if (filters.sort === "priority") {
    items.sort(
      (a, b) =>
        solPriorityRank(a.subtasks) - solPriorityRank(b.subtasks) ||
        dueTime(a.nextDueAt) - dueTime(b.nextDueAt) ||
        PRIORITY_NAME_COLLATOR.compare(a.name, b.name),
    );
  } else if (filters.sort === "due") {
    items.sort((a, b) => dueTime(a.nextDueAt) - dueTime(b.nextDueAt) || PRIORITY_NAME_COLLATOR.compare(a.name, b.name));
  } else if (filters.sort === "updated") {
    items.sort((a, b) => (Date.parse(b.updatedAt) || 0) - (Date.parse(a.updatedAt) || 0));
  }

  return {
    access,
    settings,
    items,
    categories,
    staff: staff.map((item) => ({ id: item.id, name: item.name })),
    groupBy: normalizeGroupBy(filters.group),
    departments: allDepartments(settings),
  };
}

export async function getServiceRow(id: string) {
  const rows = await prisma().$queryRawUnsafe<Raw[]>(`SELECT * FROM SolutionsService WHERE id = ? LIMIT 1`, id).catch(() => [] as Raw[]);
  return rows[0] ?? null;
}

export type SolServiceSave = {
  name: string;
  categoryId: string;
  publicDescription: string;
  problemSolved: string;
  suitableFor: string;
  deliverables: string;
  dependencies: string;
  ownerDepartment: string;
  publicRoute: string;
  contentStatusTh: string;
  contentStatusEn: string;
  imagePermissionStatus: string;
  proofSourceRef: string;
  status: string;
  nextReviewAt: string | null;
  payload: SolPayload;
};

export async function saveServiceRow(id: string, data: SolServiceSave, userId: string) {
  const existing = await getServiceRow(id);
  const params = [
    data.name,
    data.categoryId,
    data.publicDescription,
    data.problemSolved,
    data.suitableFor,
    data.deliverables,
    data.dependencies,
    data.ownerDepartment,
    data.publicRoute,
    data.contentStatusTh,
    data.contentStatusEn,
    data.imagePermissionStatus,
    data.proofSourceRef,
    data.status,
    data.nextReviewAt,
    data.status === "archived" ? 1 : 0,
    JSON.stringify(data.payload),
  ];
  if (existing) {
    await prisma().$executeRawUnsafe(
      `UPDATE SolutionsService SET name=?, categoryId=?, publicDescription=?, problemSolved=?, suitableFor=?, deliverables=?, dependencies=?,
        ownerDepartment=?, publicRoute=?, contentStatusTh=?, contentStatusEn=?, imagePermissionStatus=?, proofSourceRef=?, status=?,
        nextReviewAt=?, archived=?, payloadJson=?, updatedBy=? WHERE id=?`,
      ...params,
      userId,
      id,
    );
    return { created: false, previous: existing };
  }
  await prisma().$executeRawUnsafe(
    `INSERT INTO SolutionsService (name, categoryId, publicDescription, problemSolved, suitableFor, deliverables, dependencies,
      ownerDepartment, publicRoute, contentStatusTh, contentStatusEn, imagePermissionStatus, proofSourceRef, status,
      nextReviewAt, archived, payloadJson, id, createdBy, updatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ...params,
    id,
    userId,
    userId,
  );
  return { created: true, previous: null };
}

/** Patch a handful of whitelisted columns (status, permission, content status). */
export async function patchServiceRow(
  id: string,
  patch: Partial<{ status: string; imagePermissionStatus: string; contentStatusTh: string; contentStatusEn: string; reviewNote: string }>,
  userId: string,
) {
  const sets: string[] = [];
  const values: unknown[] = [];
  if (patch.status !== undefined) {
    sets.push("status=?", "archived=?");
    values.push(patch.status, patch.status === "archived" ? 1 : 0);
  }
  if (patch.imagePermissionStatus !== undefined) {
    sets.push("imagePermissionStatus=?");
    values.push(patch.imagePermissionStatus);
  }
  if (patch.contentStatusTh !== undefined) {
    sets.push("contentStatusTh=?");
    values.push(patch.contentStatusTh);
  }
  if (patch.contentStatusEn !== undefined) {
    sets.push("contentStatusEn=?");
    values.push(patch.contentStatusEn);
  }
  if (patch.reviewNote !== undefined) {
    const row = await getServiceRow(id);
    const payload = { ...parsePayload(row?.payloadJson), reviewNote: patch.reviewNote };
    sets.push("payloadJson=?");
    values.push(JSON.stringify(payload));
  }
  if (!sets.length) return;
  sets.push("updatedBy=?");
  values.push(userId, id);
  await prisma().$executeRawUnsafe(`UPDATE SolutionsService SET ${sets.join(", ")} WHERE id=?`, ...values);
}

/* -------------------------------------------------------------------------- */
/* Relationships                                                              */
/* -------------------------------------------------------------------------- */

export async function listSolutionsRelationships() {
  await ensureSolutionsOpsSchema();
  const [rows, services] = await Promise.all([
    prisma().$queryRawUnsafe<Raw[]>(`SELECT * FROM SolutionsRelationship ORDER BY updatedAt DESC`).catch(() => [] as Raw[]),
    prisma().$queryRawUnsafe<Raw[]>(`SELECT id, name, ownerDepartment FROM SolutionsService WHERE archived = 0 ORDER BY name ASC`).catch(() => [] as Raw[]),
  ]);
  const names = new Map(services.map((row) => [col(row, "id"), col(row, "name")]));
  const items: SolRelationshipRow[] = rows.map((row) => ({
    id: col(row, "id"),
    fromServiceId: col(row, "fromServiceId"),
    fromName: names.get(col(row, "fromServiceId")) || "(ลบแล้ว)",
    toServiceId: col(row, "toServiceId"),
    toName: names.get(col(row, "toServiceId")) || "(ลบแล้ว)",
    kind: normalizeRelationKind(col(row, "kind")),
    notes: col(row, "notes"),
    updatedAt: iso(row.updatedAt),
  }));
  return {
    items,
    services: services.map((row) => ({ id: col(row, "id"), name: col(row, "name"), ownerDepartment: col(row, "ownerDepartment") })),
  };
}

export async function getRelationshipRow(id: string) {
  const rows = await prisma().$queryRawUnsafe<Raw[]>(`SELECT * FROM SolutionsRelationship WHERE id = ? LIMIT 1`, id).catch(() => [] as Raw[]);
  return rows[0] ?? null;
}

export async function findDuplicateRelationship(from: string, to: string, kind: string, excludeId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Raw[]>(
      `SELECT id FROM SolutionsRelationship WHERE fromServiceId=? AND toServiceId=? AND kind=? AND id<>? LIMIT 1`,
      from,
      to,
      kind,
      excludeId,
    )
    .catch(() => [] as Raw[]);
  return Boolean(rows[0]);
}

export async function saveRelationshipRow(
  id: string,
  data: { fromServiceId: string; toServiceId: string; kind: string; notes: string },
  userId: string,
) {
  const existing = await getRelationshipRow(id);
  if (existing) {
    await prisma().$executeRawUnsafe(
      `UPDATE SolutionsRelationship SET fromServiceId=?, toServiceId=?, kind=?, notes=?, updatedBy=? WHERE id=?`,
      data.fromServiceId,
      data.toServiceId,
      data.kind,
      data.notes,
      userId,
      id,
    );
    return false;
  }
  await prisma().$executeRawUnsafe(
    `INSERT INTO SolutionsRelationship (id, fromServiceId, toServiceId, kind, notes, createdBy, updatedBy) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    id,
    data.fromServiceId,
    data.toServiceId,
    data.kind,
    data.notes,
    userId,
    userId,
  );
  return true;
}

export async function deleteRelationshipRow(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM SolutionsRelationship WHERE id=?`, id);
}

/* -------------------------------------------------------------------------- */
/* Access rows (Settings)                                                     */
/* -------------------------------------------------------------------------- */

export async function listSolutionsAccessRows() {
  await ensureSolutionsOpsSchema();
  const [rows, staff, settings] = await Promise.all([
    prisma().$queryRawUnsafe<Raw[]>(`SELECT * FROM SolutionsOpsAccess ORDER BY userId ASC, department ASC`).catch(() => [] as Raw[]),
    staffDirectory().catch(() => [] as Staff[]),
    getSolutionsSettings(),
  ]);
  const items: SolAccessRow[] = rows.map((row) => ({
    id: col(row, "id"),
    userId: col(row, "userId"),
    department: col(row, "department"),
    canSeeContacts: bool(row.canSeeContacts),
    canApprove: bool(row.canApprove),
  }));
  return { rows: items, staff: staff.map((item) => ({ id: item.id, name: item.name, email: item.email })), settings };
}

export async function saveAccessRow(userId: string, department: string, canSeeContacts: boolean, canApprove: boolean) {
  const existing = await prisma()
    .$queryRawUnsafe<Raw[]>(`SELECT id FROM SolutionsOpsAccess WHERE userId=? AND department=? LIMIT 1`, userId, department)
    .catch(() => [] as Raw[]);
  if (existing[0]) {
    await prisma().$executeRawUnsafe(
      `UPDATE SolutionsOpsAccess SET canSeeContacts=?, canApprove=? WHERE id=?`,
      canSeeContacts ? 1 : 0,
      canApprove ? 1 : 0,
      col(existing[0], "id"),
    );
    return col(existing[0], "id");
  }
  const id = newId("sac");
  await prisma().$executeRawUnsafe(
    `INSERT INTO SolutionsOpsAccess (id, userId, department, canSeeContacts, canApprove) VALUES (?, ?, ?, ?, ?)`,
    id,
    userId,
    department,
    canSeeContacts ? 1 : 0,
    canApprove ? 1 : 0,
  );
  return id;
}

export async function deleteAccessRow(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM SolutionsOpsAccess WHERE id=?`, id);
}

/* -------------------------------------------------------------------------- */
/* Inquiries (existing Lead rows + overlay notes)                             */
/* -------------------------------------------------------------------------- */

export type SolInquiryResult = {
  items: SolInquiryRow[];
  available: boolean;
  staff: Staff[];
  access: SolAccessView;
  departments: SolDepartmentOption[];
};

export async function listSolutionsInquiries(user: { id: string; role: string; modules?: string | null }): Promise<SolInquiryResult> {
  await ensureSolutionsOpsSchema();
  const [access, staff, settings] = await Promise.all([solutionsOpsAccessFor(user), staffDirectory().catch(() => [] as Staff[]), getSolutionsSettings()]);
  const people = new Map(staff.map((item) => [item.id, item.name]));
  const staffList = staff.map((item) => ({ id: item.id, name: item.name }));
  const departments = allDepartments(settings);

  try {
    const leads = await prisma().lead.findMany({
      where: {
        archivedAt: null,
        OR: [
          { pageUrl: { contains: "/solutions" } },
          { formName: { contains: "hotel_performance_audit" } },
          { formName: { contains: "solutions" } },
          { services: { contains: "hotel_performance_audit" } },
          { services: { contains: "\"general\"" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        contactName: true,
        businessName: true,
        phone: true,
        email: true,
        services: true,
        formName: true,
        pageUrl: true,
        source: true,
        message: true,
        createdAt: true,
      },
    });

    const ids = leads.map((lead) => lead.id);
    const notes = ids.length
      ? await prisma()
          .$queryRawUnsafe<Raw[]>(`SELECT * FROM SolutionsInquiryNote WHERE leadId IN (${ids.map(() => "?").join(",")})`, ...ids)
          .catch(() => [] as Raw[])
      : [];
    const noteByLead = new Map(notes.map((row) => [col(row, "leadId"), row]));
    const subtasksByLead = await loadSubtasks("inquiry", ids, people);

    const items: SolInquiryRow[] = leads.map((lead) => {
      const note = noteByLead.get(lead.id);
      const subtasks = subtasksByLead.get(lead.id) ?? [];
      const hidden = !access.canSeeContacts;
      let selected = "";
      try {
        const parsed = JSON.parse(lead.services || "[]") as unknown;
        selected = Array.isArray(parsed) ? parsed.map(String).join(", ") : String(lead.services ?? "");
      } catch {
        selected = lead.services ?? "";
      }
      const ownerId = note ? col(note, "ownerId") : "";
      return {
        leadId: lead.id,
        contactName: hidden ? MASKED_VALUE : lead.contactName,
        phone: hidden ? "" : lead.phone,
        email: hidden ? "" : lead.email,
        contactHidden: hidden,
        company: lead.businessName,
        formName: lead.formName,
        pageUrl: lead.pageUrl,
        source: lead.source,
        // free-text message may contain personal details → same gate as contacts
        message: hidden ? "" : lead.message,
        receivedAt: lead.createdAt.toISOString(),
        needCategory: note ? col(note, "needCategory") : "",
        selectedServices: note && col(note, "selectedServices") ? col(note, "selectedServices") : selected,
        contactPreference: normalizeContactPreference(note ? col(note, "contactPreference") : ""),
        ownerId,
        ownerName: people.get(ownerId) ?? "",
        status: normalizeInquiryStatus(note ? col(note, "status") : "new"),
        nextActionAt: note ? iso(note.nextActionAt) : "",
        consentStatus: normalizeConsent(note ? col(note, "consentStatus") : "unknown"),
        notes: note ? col(note, "notes") : "",
        subtasks,
        progress: solSubtaskProgress(subtasks),
      };
    });
    return { items, available: true, staff: staffList, access, departments };
  } catch {
    return { items: [], available: false, staff: staffList, access, departments };
  }
}

export async function saveInquiryNoteRow(
  leadId: string,
  data: {
    needCategory: string;
    selectedServices: string;
    contactPreference: string;
    ownerId: string;
    status: string;
    nextActionAt: string | null;
    consentStatus: string;
    notes: string;
  },
  userId: string,
) {
  const existing = await prisma()
    .$queryRawUnsafe<Raw[]>(`SELECT id FROM SolutionsInquiryNote WHERE leadId=? LIMIT 1`, leadId)
    .catch(() => [] as Raw[]);
  const params = [
    data.needCategory,
    data.selectedServices,
    data.contactPreference,
    data.ownerId,
    data.status,
    data.nextActionAt,
    data.consentStatus,
    data.notes,
  ];
  if (existing[0]) {
    await prisma().$executeRawUnsafe(
      `UPDATE SolutionsInquiryNote SET needCategory=?, selectedServices=?, contactPreference=?, ownerId=?, status=?, nextActionAt=?, consentStatus=?, notes=?, updatedBy=? WHERE leadId=?`,
      ...params,
      userId,
      leadId,
    );
    return;
  }
  await prisma().$executeRawUnsafe(
    `INSERT INTO SolutionsInquiryNote (needCategory, selectedServices, contactPreference, ownerId, status, nextActionAt, consentStatus, notes, id, leadId, updatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ...params,
    newId("sin"),
    leadId,
    userId,
  );
}

/** Current overlay status of an inquiry ("new" when no note row exists yet). */
export async function getInquiryStatus(leadId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Raw[]>(`SELECT status FROM SolutionsInquiryNote WHERE leadId=? LIMIT 1`, leadId)
    .catch(() => [] as Raw[]);
  return normalizeInquiryStatus(rows[0] ? col(rows[0], "status") : "new");
}

export async function leadExists(leadId: string) {
  try {
    const lead = await prisma().lead.findUnique({ where: { id: leadId }, select: { id: true } });
    return Boolean(lead);
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* Overview                                                                   */
/* -------------------------------------------------------------------------- */

export type SolOverview = {
  total: number;
  byStatus: Record<string, number>;
  byDepartment: Record<string, number>;
  dueReview: number;
  needsApproval: number;
  imagePending: number;
  categories: number;
};

export async function solutionsOpsOverview(): Promise<SolOverview> {
  await ensureSolutionsOpsSchema();
  const rows = await prisma()
    .$queryRawUnsafe<Raw[]>(`SELECT status, ownerDepartment, imagePermissionStatus, nextReviewAt FROM SolutionsService WHERE archived = 0`)
    .catch(() => [] as Raw[]);
  const categories = await prisma()
    .$queryRawUnsafe<Raw[]>(`SELECT COUNT(*) AS n FROM SolutionsCategory WHERE status <> 'archived'`)
    .catch(() => [] as Raw[]);
  const byStatus: Record<string, number> = {};
  const byDepartment: Record<string, number> = {};
  for (const department of SOL_DEPARTMENTS) byDepartment[department] = 0;
  const now = Date.now();
  let dueReview = 0;
  let needsApproval = 0;
  let imagePending = 0;
  for (const row of rows) {
    const status = col(row, "status");
    byStatus[status] = (byStatus[status] ?? 0) + 1;
    const department = col(row, "ownerDepartment");
    byDepartment[department] = (byDepartment[department] ?? 0) + 1;
    if (status === "review") needsApproval += 1;
    if (["unreviewed", "pending"].includes(col(row, "imagePermissionStatus"))) imagePending += 1;
    const due = row.nextReviewAt ? new Date(String(row.nextReviewAt)).getTime() : 0;
    if (due && due <= now) dueReview += 1;
  }
  return {
    total: rows.length,
    byStatus,
    byDepartment,
    dueReview,
    needsApproval,
    imagePending,
    categories: Number(categories[0]?.n ?? 0),
  };
}
