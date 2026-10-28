import { prisma } from "@/lib/crm/db";
import { staffDirectory } from "@/lib/crm/queries";
import { randomToken } from "@/lib/crm/security";
import { conversionAccessFor } from "./access";
import { ensureConversionSchema } from "./ensure";
import { convSubtaskProgress } from "./progress";
import {
  MASKED_VALUE,
  CONV_DEFAULT_HANDOVER,
  CONV_DEFAULT_QA,
  CONV_PRIORITY_RANK,
  CONV_SEVERITY_RANK,
  CONV_STARTER_SUBTASKS,
  emptyEngineView,
  emptySectionBlock,
  isApprovalStatus,
  isBudgetStatus,
  isDepartment,
  isFunnelStage,
  isGroupBy,
  isKpiDataStatus,
  isPriority,
  isReadiness,
  isSort,
  normalizeFrictionCategory,
  normalizeFunnelStage,
  normalizeProjectType,
  normalizeReadiness,
  normalizeSeverity,
  normalizeStatus,
  normalizeSubtaskStatus,
  normalizeWorkstream,
  worstFrictionSeverity,
  type ConvAccessView,
  type ConvApprovalView,
  type ConvAuditView,
  type ConvBudgetStatus,
  type ConvChecklistItem,
  type ConvDecisionView,
  type ConvDepartment,
  type ConvEngineView,
  type ConvFileNote,
  type ConvFrictionView,
  type ConvGroupBy,
  type ConvKpiDataStatus,
  type ConvKpiView,
  type ConvListFilters,
  type ConvPriority,
  type ConvProjectRow,
  type ConvReadiness,
  type ConvSection,
  type ConvSectionBlock,
  type ConvSitemapPage,
  type ConvSort,
  type ConvSourceView,
  type ConvSubtaskCommentView,
  type ConvSubtaskFileView,
  type ConvSubtaskView,
} from "./types";

function iso(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function text(value: unknown) {
  if (value == null) return "";
  return String(value).trim();
}

function col(row: Record<string, unknown>, key: string) {
  return text(row[key]);
}

function mask(value: string, allowed: boolean) {
  if (!value) return "";
  return allowed ? value : MASKED_VALUE;
}

function asKpiStatus(value: string): ConvKpiDataStatus {
  return isKpiDataStatus(value) ? value : "draft";
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function asReadiness(value: unknown): ConvReadiness {
  return isReadiness(String(value ?? "")) ? (value as ConvReadiness) : "not_started";
}

function asChecklist(value: unknown): ConvChecklistItem[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as ConvChecklistItem).id) || `chk_${index}`,
    label: text((item as ConvChecklistItem).label),
    status: asReadiness((item as ConvChecklistItem).status),
    notes: text((item as ConvChecklistItem).notes),
    owner: text((item as ConvChecklistItem).owner),
  }));
}

function asSection(value: unknown): ConvSectionBlock {
  const raw = value && typeof value === "object" ? (value as Partial<ConvSectionBlock>) : {};
  return {
    summary: text(raw.summary),
    owner: text(raw.owner),
    status: asReadiness(raw.status),
    notes: text(raw.notes),
    items: asChecklist(raw.items),
  };
}

function asSitemap(value: unknown): ConvSitemapPage[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as ConvSitemapPage).id) || `sm_${index}`,
    name: text((item as ConvSitemapPage).name),
    parent: text((item as ConvSitemapPage).parent),
    purpose: text((item as ConvSitemapPage).purpose),
    status: asReadiness((item as ConvSitemapPage).status),
  }));
}

function asDecisions(value: unknown): ConvDecisionView[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as ConvDecisionView).id) || `dec_${index}`,
    title: text((item as ConvDecisionView).title),
    decision: text((item as ConvDecisionView).decision),
    owner: text((item as ConvDecisionView).owner),
    status: asReadiness((item as ConvDecisionView).status),
    notes: text((item as ConvDecisionView).notes),
  }));
}

function asApprovals(value: unknown): ConvApprovalView[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as ConvApprovalView).id) || `ap_${index}`,
    kind: text((item as ConvApprovalView).kind),
    status: isApprovalStatus(text((item as ConvApprovalView).status)) ? (item as ConvApprovalView).status : "not_requested",
    notes: text((item as ConvApprovalView).notes),
    requestedBy: text((item as ConvApprovalView).requestedBy),
    decidedBy: text((item as ConvApprovalView).decidedBy),
    createdAt: text((item as ConvApprovalView).createdAt),
  }));
}

function asFileNotes(value: unknown): ConvFileNote[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as ConvFileNote).id) || `fn_${index}`,
    name: text((item as ConvFileNote).name),
    caption: text((item as ConvFileNote).caption),
    status: asReadiness((item as ConvFileNote).status),
  }));
}

function asFriction(value: unknown): ConvFrictionView[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => {
    const row = item as Partial<ConvFrictionView>;
    return {
      id: text(row.id) || `fr_${index}`,
      title: text(row.title),
      funnelStage: normalizeFunnelStage(text(row.funnelStage)),
      category: normalizeFrictionCategory(text(row.category)),
      severity: normalizeSeverity(text(row.severity)),
      evidence: text(row.evidence),
      status: asReadiness(row.status),
      recommendedAction: text(row.recommendedAction),
      owner: text(row.owner),
      department: isDepartment(text(row.department)) ? (text(row.department) as ConvDepartment) : "",
      dueAt: text(row.dueAt),
      approvalStatus: isApprovalStatus(text(row.approvalStatus)) ? row.approvalStatus as ConvFrictionView["approvalStatus"] : "not_requested",
      measurementEvent: text(row.measurementEvent),
      beforeValue: text(row.beforeValue),
      afterValue: text(row.afterValue),
      notes: text(row.notes),
    };
  });
}

function asEngine(value: unknown, fallback: ConvEngineView): ConvEngineView {
  const raw = value && typeof value === "object" ? (value as Partial<ConvEngineView>) : {};
  return {
    provider: text(raw.provider) || fallback.provider,
    bookingUrl: text(raw.bookingUrl) || fallback.bookingUrl,
    languages: text(raw.languages) || fallback.languages,
    mobileStatus: asReadiness(raw.mobileStatus || fallback.mobileStatus),
    rateStatus: asReadiness(raw.rateStatus),
    handoffStatus: asReadiness(raw.handoffStatus),
    callbackStatus: asReadiness(raw.callbackStatus),
    confirmationStatus: asReadiness(raw.confirmationStatus),
    owner: text(raw.owner) || fallback.owner,
    accessStatus: asReadiness(raw.accessStatus),
    notes: text(raw.notes) || fallback.notes,
  };
}

function defaultQa(): ConvChecklistItem[] {
  return CONV_DEFAULT_QA.map((label, index) => ({
    id: `qa_${index + 1}`,
    label,
    status: "not_started",
    notes: "",
    owner: "",
  }));
}

function defaultHandover(): ConvChecklistItem[] {
  return CONV_DEFAULT_HANDOVER.map((label, index) => ({
    id: `ho_${index + 1}`,
    label,
    status: "not_started",
    notes: "",
    owner: "",
  }));
}

export async function listConversionProjects(
  user: { id: string; role: string; modules?: string | null },
  filters: ConvListFilters,
  section: ConvSection,
) {
  await ensureConversionSchema();
  const access = await conversionAccessFor(user);
  const db = prisma();
  const emptyRows = await db
    .$queryRawUnsafe<Array<{ id: string; ownerId: string | null }>>(
      `SELECT p.id, p.ownerId FROM ConversionProject p
       LEFT JOIN ConversionSubtask s ON s.propertyId = p.id
       GROUP BY p.id, p.ownerId
       HAVING COUNT(s.id) = 0`,
    )
    .catch(() => []);
  for (const row of emptyRows) {
    await seedStarterSubtasks(row.id, row.ownerId || access.userId);
  }
  const [rows, staff, sourceRows, kpiRows, auditRows, subtaskRows, commentRows, fileRows] = await Promise.all([
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ConversionProject ORDER BY updatedAt DESC`),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string }>),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ConversionSource ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ConversionKpiEntry ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ConversionAuditEvent ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ConversionSubtask ORDER BY sortOrder ASC, createdAt ASC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ConversionSubtaskComment ORDER BY createdAt ASC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ConversionSubtaskFile ORDER BY createdAt DESC`).catch(() => []),
  ]);
  const names = new Map(staff.map((item) => [item.id, item.name]));
  const query = filters.q?.trim().toLowerCase() || "";

  let items: ConvProjectRow[] = rows.map((row) => {
    const ownerId = col(row, "ownerId");
    const status = normalizeStatus(col(row, "status"));
    const subtasks: ConvSubtaskView[] = subtaskRows
      .filter((item) => col(item, "propertyId") === col(row, "id"))
      .map((item): ConvSubtaskView => {
        const subOwner = col(item, "ownerId");
        return {
          id: col(item, "id"),
          propertyId: col(item, "propertyId"),
          name: col(item, "name"),
          department: isDepartment(col(item, "department")) ? (col(item, "department") as ConvDepartment) : "marketing",
          ownerId: subOwner,
          ownerName: names.get(subOwner) || "",
          status: normalizeSubtaskStatus(col(item, "status")),
          completed: Boolean(item.completed) || col(item, "status") === "completed",
          dueAt: iso(item.dueAt as Date | string | null),
          priority: isPriority(col(item, "priority")) ? (col(item, "priority") as ConvPriority) : "normal",
          comments: col(item, "comments"),
          source: col(item, "source"),
          thread: commentRows
            .filter((comment) => col(comment, "subtaskId") === col(item, "id"))
            .map(
              (comment): ConvSubtaskCommentView => ({
                id: col(comment, "id"),
                authorId: col(comment, "authorId"),
                authorName: names.get(col(comment, "authorId")) || "",
                body: col(comment, "body"),
                createdAt: iso(comment.createdAt as Date | string | null),
              }),
            ),
          files: fileRows
            .filter((file) => col(file, "subtaskId") === col(item, "id"))
            .map(
              (file): ConvSubtaskFileView => ({
                id: col(file, "id"),
                filename: col(file, "filename"),
                caption: col(file, "caption"),
                size: Number(file.size || 0),
                createdAt: iso(file.createdAt as Date | string | null),
                href: `/api/crm/conversion/files/${col(file, "id")}`,
              }),
            ),
        };
      });
    const qaItems = asChecklist(parseJson(row.qaJson, []));
    const handoverItems = asChecklist(parseJson(row.handoverJson, []));
    const sitemapRaw = parseJson<ConvSitemapPage[] | { notes?: string; pages?: ConvSitemapPage[] }>(row.sitemapJson, []);
    const sitemapPages = Array.isArray(sitemapRaw) ? asSitemap(sitemapRaw) : asSitemap(sitemapRaw.pages);
    const sitemapNotes = Array.isArray(sitemapRaw) ? "" : text(sitemapRaw.notes);
    const projectType = normalizeProjectType(col(row, "projectType") || col(row, "improveOrRebuild"));
    const mobileStatus = normalizeReadiness(col(row, "mobileStatus") || col(row, "mobileReady"));
    const approvals = asApprovals(parseJson(row.approvalsJson, []));
    return {
      id: col(row, "id"),
      projectName: col(row, "projectName") || col(row, "hotelName"),
      hotelName: col(row, "hotelName"),
      currentUrl: col(row, "currentUrl"),
      bookingEngine: col(row, "bookingEngine"),
      bookingEngineUrl: col(row, "bookingEngineUrl"),
      cmsType: col(row, "cmsType"),
      projectType,
      primaryGoal: col(row, "primaryGoal"),
      targetMarket: col(row, "targetMarket"),
      languages: col(row, "languages"),
      startDate: iso(row.startDate as Date | string | null),
      launchDate: iso(row.launchDate as Date | string | null),
      mobileReady: col(row, "mobileReady") || mobileStatus,
      improveOrRebuild: col(row, "improveOrRebuild") || projectType,
      status,
      ownerId,
      ownerName: names.get(ownerId) || "",
      department: isDepartment(col(row, "department")) ? (col(row, "department") as ConvDepartment) : "marketing",
      workstream: normalizeWorkstream(col(row, "workstream")),
      priority: isPriority(col(row, "priority")) ? (col(row, "priority") as ConvPriority) : "normal",
      nextAction: col(row, "nextAction"),
      nextActionAt: iso(row.nextActionAt as Date | string | null),
      createdAt: iso(row.createdAt as Date | string | null),
      updatedAt: iso(row.updatedAt as Date | string | null),
      notes: col(row, "notes"),
      budgetStatus: isBudgetStatus(col(row, "budgetStatus")) ? (col(row, "budgetStatus") as ConvBudgetStatus) : "not_set",
      trackingStatus: normalizeReadiness(col(row, "trackingStatus")),
      analyticsStatus: normalizeReadiness(col(row, "analyticsStatus") || col(row, "trackingStatus")),
      engineTrackingStatus: normalizeReadiness(col(row, "engineTrackingStatus")),
      primaryKpi: col(row, "primaryKpi"),
      kpiTarget: col(row, "kpiTarget"),
      hotelApprover: col(row, "hotelApprover"),
      seoStatus: normalizeReadiness(col(row, "seoStatus")),
      mobileStatus,
      handoverStatus: normalizeReadiness(col(row, "handoverStatus")),
      engineAccountRef: mask(col(row, "engineAccountRef"), access.canSeePrivateIds),
      analyticsRef: mask(col(row, "analyticsRef"), access.canSeePrivateIds),
      privateMasked: !access.canSeePrivateIds,
      cmsOwner: col(row, "cmsOwner"),
      sourceCodeOwner: col(row, "sourceCodeOwner"),
      domainOwner: col(row, "domainOwner"),
      hostingOwner: col(row, "hostingOwner"),
      analyticsOwner: col(row, "analyticsOwner"),
      bookingEngineOwner: col(row, "bookingEngineOwner"),
      discovery: asSection(parseJson(row.discoveryJson, emptySectionBlock())),
      sitemap: sitemapPages,
      sitemapNotes,
      ux: asSection(parseJson(row.uxJson, emptySectionBlock())),
      cms: asSection(parseJson(row.cmsJson, emptySectionBlock())),
      booking: asSection(parseJson(row.bookingJson, emptySectionBlock())),
      tracking: asSection(parseJson(row.trackingJson, emptySectionBlock())),
      seo: asSection(parseJson(row.seoJson, emptySectionBlock())),
      qa: qaItems.length ? qaItems : defaultQa(),
      handover: handoverItems.length ? handoverItems : defaultHandover(),
      friction: asFriction(parseJson(row.frictionJson, [])),
      engine: asEngine(parseJson(row.engineJson, emptyEngineView()), {
        ...emptyEngineView(),
        provider: col(row, "bookingEngine"),
        bookingUrl: col(row, "bookingEngineUrl"),
        languages: col(row, "languages"),
        mobileStatus,
        owner: col(row, "bookingEngineOwner"),
      }),
      fileNotes: asFileNotes(parseJson(row.filesJson, [])),
      decisions: asDecisions(parseJson(row.decisionsJson, [])),
      approvals,
      sources: sourceRows
        .filter((item) => col(item, "propertyId") === col(row, "id"))
        .map(
          (item): ConvSourceView => ({
            id: col(item, "id"),
            name: col(item, "name"),
            url: col(item, "url"),
            publishedAt: col(item, "publishedAt"),
            accessedAt: col(item, "accessedAt"),
            notes: col(item, "notes"),
          }),
        ),
      kpis: kpiRows
        .filter((item) => col(item, "propertyId") === col(row, "id"))
        .map(
          (item): ConvKpiView => ({
            id: col(item, "id"),
            name: col(item, "name"),
            period: col(item, "period"),
            value: col(item, "value"),
            definition: col(item, "definition"),
            source: col(item, "source"),
            dataStatus: asKpiStatus(col(item, "dataStatus")),
            market: col(item, "market"),
          }),
        ),
      history: auditRows
        .filter((item) => col(item, "propertyId") === col(row, "id"))
        .slice(0, 40)
        .map(
          (item): ConvAuditView => ({
            id: col(item, "id"),
            action: col(item, "action"),
            detail: col(item, "detail"),
            createdBy: col(item, "createdBy"),
            createdByName: names.get(col(item, "createdBy")) || "",
            createdAt: iso(item.createdAt as Date | string | null),
          }),
        ),
      subtasks,
      progress: convSubtaskProgress(subtasks, status, approvals),
    };
  });

  if (!access.isManagement) {
    items = items.filter((item) => access.departments.includes(item.department));
  }
  if (section === "approvals") {
    items = items.filter(
      (item) =>
        item.approvals.some((entry) => entry.status === "awaiting" || entry.status === "changes_requested") ||
        item.status === "awaiting_approval" ||
        item.friction.some((entry) => entry.approvalStatus === "awaiting" || entry.approvalStatus === "changes_requested"),
    );
  }
  if (filters.status && normalizeStatus(filters.status) === filters.status) {
    items = items.filter((item) => item.status === filters.status);
  }
  if (filters.ownerId) items = items.filter((item) => item.ownerId === filters.ownerId);
  if (filters.department) items = items.filter((item) => item.department === filters.department);
  if (filters.hotel) items = items.filter((item) => item.hotelName === filters.hotel);
  if (filters.workstream) items = items.filter((item) => item.workstream === filters.workstream);
  if (filters.projectType) items = items.filter((item) => item.projectType === filters.projectType);
  if (filters.market) items = items.filter((item) => item.targetMarket === filters.market);
  if (filters.language) items = items.filter((item) => item.languages === filters.language);
  if (filters.funnelStage && isFunnelStage(filters.funnelStage)) {
    items = items.filter((item) => item.friction.some((entry) => entry.funnelStage === filters.funnelStage));
  }
  if (filters.severity) {
    items = items.filter((item) => worstFrictionSeverity(item.friction) === filters.severity);
  }
  if (query) {
    items = items.filter((item) =>
      `${item.projectName} ${item.hotelName} ${item.currentUrl} ${item.cmsType} ${item.bookingEngine} ${item.targetMarket} ${item.languages} ${item.nextAction} ${item.notes} ${item.primaryKpi} ${item.friction.map((entry) => entry.title).join(" ")}`
        .toLowerCase()
        .includes(query),
    );
  }

  const groupBy: ConvGroupBy = isGroupBy(filters.group || "") ? (filters.group as ConvGroupBy) : "status";
  const sort: ConvSort = isSort(filters.sort || "") ? (filters.sort as ConvSort) : "nextActionAt";
  items.sort((a, b) => {
    if (sort === "priority") return CONV_PRIORITY_RANK[a.priority] - CONV_PRIORITY_RANK[b.priority];
    if (sort === "severity") {
      const aRank = CONV_SEVERITY_RANK[worstFrictionSeverity(a.friction) || "low"];
      const bRank = CONV_SEVERITY_RANK[worstFrictionSeverity(b.friction) || "low"];
      return aRank - bRank;
    }
    if (sort === "updatedAt") return (b.updatedAt || "").localeCompare(a.updatedAt || "");
    if (sort === "launchDate") return (a.launchDate || "9999").localeCompare(b.launchDate || "9999");
    return (a.nextActionAt || "9999").localeCompare(b.nextActionAt || "9999");
  });

  return {
    access,
    items,
    staff,
    facets: {
      hotels: Array.from(new Set(items.map((item) => item.hotelName).filter(Boolean))),
      markets: Array.from(new Set(items.map((item) => item.targetMarket).filter(Boolean))),
      languages: Array.from(new Set(items.map((item) => item.languages).filter(Boolean))),
    },
    groupBy,
    sort,
  };
}

export async function writeAudit(propertyId: string, userId: string, action: string, detail: string) {
  await prisma().$executeRawUnsafe(
    `INSERT INTO ConversionAuditEvent (id, propertyId, action, detail, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, NOW(3))`,
    `wa_${randomToken(10)}`,
    propertyId,
    action,
    detail,
    userId,
  );
}

export async function createConversionProject(access: ConvAccessView, hotelName: string, workstream?: string) {
  const id = `web_${randomToken(10)}`;
  const stream = workstream ? normalizeWorkstream(workstream) : "project";
  await prisma().$executeRawUnsafe(
    `INSERT INTO ConversionProject (id, hotelName, workstream, status, department, priority, nextAction, notes, ownerId, createdBy, updatedBy, createdAt, updatedAt)
     VALUES (?, ?, ?, 'draft', 'marketing', 'normal', '', '', ?, ?, ?, NOW(3), NOW(3))`,
    id,
    hotelName,
    stream,
    access.userId,
    access.userId,
    access.userId,
  );
  await writeAudit(id, access.userId, "create", `Created ${hotelName}`);
  await seedStarterSubtasks(id, access.userId);
  return id;
}

export async function seedStarterSubtasks(propertyId: string, userId: string) {
  const existing = await prisma()
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM ConversionSubtask WHERE propertyId = ?`, propertyId)
    .catch(() => [{ count: 0 }]);
  if (Number(existing[0]?.count || 0) > 0) return;
  for (const [index, item] of CONV_STARTER_SUBTASKS.entries()) {
    await prisma().$executeRawUnsafe(
      `INSERT INTO ConversionSubtask (id, propertyId, name, department, ownerId, status, completed, dueAt, priority, comments, source, sortOrder, createdBy, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 'not_started', 0, NULL, 'normal', '', '', ?, ?, NOW(3), NOW(3))`,
      `wst_${randomToken(10)}`,
      propertyId,
      item.name,
      item.department,
      userId,
      index + 1,
      userId,
    );
  }
}

export async function countConversionSubtasks(propertyId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM ConversionSubtask WHERE propertyId = ?`, propertyId)
    .catch(() => [{ count: 0 }]);
  return Number(rows[0]?.count || 0);
}

export async function getConversionSubtask(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ConversionSubtask WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function insertConversionSubtask(data: {
  propertyId: string;
  name: string;
  department: string;
  ownerId: string;
  status: string;
  completed: boolean;
  dueAt: string | null;
  priority: string;
  comments: string;
  source: string;
  userId: string;
}) {
  const id = `wst_${randomToken(10)}`;
  const sort = (await countConversionSubtasks(data.propertyId)) + 1;
  await prisma().$executeRawUnsafe(
    `INSERT INTO ConversionSubtask (id, propertyId, name, department, ownerId, status, completed, dueAt, priority, comments, source, sortOrder, createdBy, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    data.propertyId,
    data.name,
    data.department,
    data.ownerId,
    data.status,
    data.completed ? 1 : 0,
    data.dueAt,
    data.priority,
    data.comments,
    data.source,
    sort,
    data.userId,
  );
  return id;
}

export async function updateConversionSubtask(
  id: string,
  data: {
    name: string;
    department: string;
    ownerId: string;
    status: string;
    completed: boolean;
    dueAt: string | null;
    priority: string;
    comments: string;
    source: string;
  },
) {
  await prisma().$executeRawUnsafe(
    `UPDATE ConversionSubtask SET name=?, department=?, ownerId=?, status=?, completed=?, dueAt=?, priority=?, comments=?, source=?, updatedAt=NOW(3) WHERE id=?`,
    data.name,
    data.department,
    data.ownerId,
    data.status,
    data.completed ? 1 : 0,
    data.dueAt,
    data.priority,
    data.comments,
    data.source,
    id,
  );
}

export async function insertConversionSubtaskComment(subtaskId: string, authorId: string, body: string) {
  const id = `wsc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO ConversionSubtaskComment (id, subtaskId, authorId, body, createdAt) VALUES (?, ?, ?, ?, NOW(3))`,
    id,
    subtaskId,
    authorId,
    body,
  );
  return id;
}

export async function insertConversionSubtaskFile(data: {
  subtaskId: string;
  filename: string;
  mime: string;
  size: number;
  path: string;
  caption: string;
  userId: string;
}) {
  const id = `wsf_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO ConversionSubtaskFile (id, subtaskId, filename, mime, size, path, caption, createdBy, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`,
    id,
    data.subtaskId,
    data.filename,
    data.mime,
    data.size,
    data.path,
    data.caption,
    data.userId,
  );
  return id;
}

export async function getConversionSubtaskFile(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ConversionSubtaskFile WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function replaceKpis(propertyId: string, items: ConvKpiView[]) {
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionKpiEntry WHERE propertyId = ?`, propertyId);
  for (const item of items) {
    await prisma().$executeRawUnsafe(
      `INSERT INTO ConversionKpiEntry (id, propertyId, name, period, value, definition, source, dataStatus, market, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      item.id || `wkpi_${randomToken(8)}`,
      propertyId,
      item.name,
      item.period,
      item.value,
      item.definition,
      item.source,
      item.dataStatus,
      item.market,
    );
  }
}

export async function replaceSources(propertyId: string, items: ConvSourceView[]) {
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionSource WHERE propertyId = ?`, propertyId);
  for (const item of items) {
    await prisma().$executeRawUnsafe(
      `INSERT INTO ConversionSource (id, propertyId, name, url, publishedAt, accessedAt, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      item.id || `wsrc_${randomToken(8)}`,
      propertyId,
      item.name,
      item.url,
      item.publishedAt,
      item.accessedAt,
      item.notes,
    );
  }
}

export async function saveConversionProject(
  id: string,
  data: Record<string, string | null | undefined>,
  userId: string,
  canSeePrivateIds: boolean,
) {
  const existing = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ConversionProject WHERE id = ? LIMIT 1`, id);
  const row = existing[0];
  if (!row) return false;
  const engineRef = canSeePrivateIds ? data.engineAccountRef ?? col(row, "engineAccountRef") : col(row, "engineAccountRef");
  const analyticsRef = canSeePrivateIds ? data.analyticsRef ?? col(row, "analyticsRef") : col(row, "analyticsRef");
  const pick = (key: string) => (data[key] !== undefined ? data[key] : col(row, key));
  await prisma().$executeRawUnsafe(
    `UPDATE ConversionProject SET
      projectName=?, hotelName=?, currentUrl=?, bookingEngine=?, bookingEngineUrl=?, cmsType=?, projectType=?,
      primaryGoal=?, targetMarket=?, languages=?, startDate=?, launchDate=?, mobileReady=?, improveOrRebuild=?,
      status=?, ownerId=?, department=?, workstream=?, priority=?, nextAction=?, nextActionAt=?, notes=?,
      budgetStatus=?, trackingStatus=?, analyticsStatus=?, engineTrackingStatus=?, primaryKpi=?, kpiTarget=?, hotelApprover=?,
      seoStatus=?, mobileStatus=?, handoverStatus=?,
      engineAccountRef=?, analyticsRef=?, cmsOwner=?, sourceCodeOwner=?, domainOwner=?, hostingOwner=?, analyticsOwner=?,
      bookingEngineOwner=?, discoveryJson=?, sitemapJson=?, uxJson=?, cmsJson=?, bookingJson=?, trackingJson=?,
      seoJson=?, qaJson=?, handoverJson=?, filesJson=?, decisionsJson=?, approvalsJson=?, frictionJson=?, engineJson=?,
      updatedBy=?, updatedAt=NOW(3)
     WHERE id=?`,
    pick("projectName") || pick("hotelName"),
    pick("hotelName"),
    pick("currentUrl"),
    pick("bookingEngine"),
    pick("bookingEngineUrl"),
    pick("cmsType"),
    pick("projectType"),
    pick("primaryGoal"),
    pick("targetMarket"),
    pick("languages"),
    data.startDate !== undefined ? data.startDate || null : (row.startDate as string | null),
    data.launchDate !== undefined ? data.launchDate || null : (row.launchDate as string | null),
    pick("mobileReady"),
    pick("improveOrRebuild"),
    pick("status"),
    pick("ownerId"),
    pick("department"),
    pick("workstream"),
    pick("priority"),
    pick("nextAction"),
    data.nextActionAt !== undefined ? data.nextActionAt || null : (row.nextActionAt as string | null),
    pick("notes"),
    pick("budgetStatus"),
    pick("trackingStatus"),
    pick("analyticsStatus"),
    pick("engineTrackingStatus"),
    pick("primaryKpi"),
    pick("kpiTarget"),
    pick("hotelApprover"),
    pick("seoStatus"),
    pick("mobileStatus"),
    pick("handoverStatus"),
    engineRef,
    analyticsRef,
    pick("cmsOwner"),
    pick("sourceCodeOwner"),
    pick("domainOwner"),
    pick("hostingOwner"),
    pick("analyticsOwner"),
    pick("bookingEngineOwner"),
    data.discoveryJson ?? col(row, "discoveryJson"),
    data.sitemapJson ?? col(row, "sitemapJson"),
    data.uxJson ?? col(row, "uxJson"),
    data.cmsJson ?? col(row, "cmsJson"),
    data.bookingJson ?? col(row, "bookingJson"),
    data.trackingJson ?? col(row, "trackingJson"),
    data.seoJson ?? col(row, "seoJson"),
    data.qaJson ?? col(row, "qaJson"),
    data.handoverJson ?? col(row, "handoverJson"),
    data.filesJson ?? col(row, "filesJson"),
    data.decisionsJson ?? col(row, "decisionsJson"),
    data.approvalsJson ?? col(row, "approvalsJson"),
    data.frictionJson ?? col(row, "frictionJson"),
    data.engineJson ?? col(row, "engineJson"),
    userId,
    id,
  );
  return true;
}

export async function patchConversionProject(id: string, data: Record<string, string | null | undefined>, userId: string) {
  return saveConversionProject(id, data, userId, true);
}

export async function getConversionProject(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ConversionProject WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function appendConversionApproval(
  propertyId: string,
  item: { kind: string; status: string; notes: string; requestedBy: string; decidedBy?: string },
) {
  const row = await getConversionProject(propertyId);
  if (!row) return false;
  const approvals = asApprovals(parseJson(row.approvalsJson, []));
  approvals.unshift({
    id: `ap_${randomToken(8)}`,
    kind: item.kind,
    status: isApprovalStatus(item.status) ? item.status : "awaiting",
    notes: item.notes,
    requestedBy: item.requestedBy,
    decidedBy: item.decidedBy || "",
    createdAt: new Date().toISOString(),
  });
  await prisma().$executeRawUnsafe(
    `UPDATE ConversionProject SET approvalsJson=?, updatedAt=NOW(3) WHERE id=?`,
    JSON.stringify(approvals),
    propertyId,
  );
  return true;
}

export async function deleteConversionSubtask(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionSubtaskFile WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionSubtaskComment WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionSubtask WHERE id = ?`, id);
}

export async function deleteConversionProject(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionSubtaskFile WHERE subtaskId IN (SELECT id FROM ConversionSubtask WHERE propertyId = ?)`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionSubtaskComment WHERE subtaskId IN (SELECT id FROM ConversionSubtask WHERE propertyId = ?)`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionSubtask WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionSource WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionKpiEntry WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionAuditEvent WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionProject WHERE id = ?`, id);
}

export async function listConversionAccessRows() {
  await ensureConversionSchema();
  const [rows, staff] = await Promise.all([
    prisma().$queryRawUnsafe<Array<{ id: string; userId: string; department: string; canSeePrivateIds: number | boolean }>>(
      `SELECT id, userId, department, canSeePrivateIds FROM ConversionAccess ORDER BY createdAt DESC`,
    ),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string; email?: string }>),
  ]);
  return {
    rows: rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      department: row.department,
      canSeePrivateIds: Boolean(row.canSeePrivateIds),
    })),
    staff,
  };
}

export async function saveConversionAccessRow(userId: string, department: string, canSeePrivateIds: boolean) {
  const id = `wacc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO ConversionAccess (id, userId, department, canSeePrivateIds, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    userId,
    department,
    canSeePrivateIds ? 1 : 0,
  );
  return id;
}

export async function deleteConversionAccessRow(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM ConversionAccess WHERE id = ?`, id);
}
