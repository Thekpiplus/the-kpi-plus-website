import { prisma } from "@/lib/crm/db";
import { staffDirectory } from "@/lib/crm/queries";
import { randomToken } from "@/lib/crm/security";
import { websiteAccessFor } from "./access";
import { ensureWebsiteSchema } from "./ensure";
import { webSubtaskProgress } from "./progress";
import {
  MASKED_VALUE,
  WEB_DEFAULT_HANDOVER,
  WEB_DEFAULT_QA,
  WEB_PRIORITY_RANK,
  WEB_SECTION_WORKSTREAM,
  WEB_STARTER_SUBTASKS,
  emptySectionBlock,
  isApprovalStatus,
  isBudgetStatus,
  isDepartment,
  isGroupBy,
  isKpiDataStatus,
  isPriority,
  isReadiness,
  isSort,
  normalizeProjectType,
  normalizeReadiness,
  normalizeStatus,
  normalizeSubtaskStatus,
  normalizeWorkstream,
  type WebAccessView,
  type WebApprovalView,
  type WebAuditView,
  type WebBudgetStatus,
  type WebChecklistItem,
  type WebDecisionView,
  type WebDepartment,
  type WebFileNote,
  type WebGroupBy,
  type WebKpiDataStatus,
  type WebKpiView,
  type WebListFilters,
  type WebPriority,
  type WebProjectRow,
  type WebReadiness,
  type WebSection,
  type WebSectionBlock,
  type WebSitemapPage,
  type WebSort,
  type WebSourceView,
  type WebSubtaskCommentView,
  type WebSubtaskFileView,
  type WebSubtaskView,
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

function asKpiStatus(value: string): WebKpiDataStatus {
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

function asReadiness(value: unknown): WebReadiness {
  return isReadiness(String(value ?? "")) ? (value as WebReadiness) : "not_started";
}

function asChecklist(value: unknown): WebChecklistItem[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as WebChecklistItem).id) || `chk_${index}`,
    label: text((item as WebChecklistItem).label),
    status: asReadiness((item as WebChecklistItem).status),
    notes: text((item as WebChecklistItem).notes),
    owner: text((item as WebChecklistItem).owner),
  }));
}

function asSection(value: unknown): WebSectionBlock {
  const raw = value && typeof value === "object" ? (value as Partial<WebSectionBlock>) : {};
  return {
    summary: text(raw.summary),
    owner: text(raw.owner),
    status: asReadiness(raw.status),
    notes: text(raw.notes),
    items: asChecklist(raw.items),
  };
}

function asSitemap(value: unknown): WebSitemapPage[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as WebSitemapPage).id) || `sm_${index}`,
    name: text((item as WebSitemapPage).name),
    parent: text((item as WebSitemapPage).parent),
    purpose: text((item as WebSitemapPage).purpose),
    status: asReadiness((item as WebSitemapPage).status),
  }));
}

function asDecisions(value: unknown): WebDecisionView[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as WebDecisionView).id) || `dec_${index}`,
    title: text((item as WebDecisionView).title),
    decision: text((item as WebDecisionView).decision),
    owner: text((item as WebDecisionView).owner),
    status: asReadiness((item as WebDecisionView).status),
    notes: text((item as WebDecisionView).notes),
  }));
}

function asApprovals(value: unknown): WebApprovalView[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as WebApprovalView).id) || `ap_${index}`,
    kind: text((item as WebApprovalView).kind),
    status: isApprovalStatus(text((item as WebApprovalView).status)) ? (item as WebApprovalView).status : "not_requested",
    notes: text((item as WebApprovalView).notes),
    requestedBy: text((item as WebApprovalView).requestedBy),
    decidedBy: text((item as WebApprovalView).decidedBy),
    createdAt: text((item as WebApprovalView).createdAt),
  }));
}

function asFileNotes(value: unknown): WebFileNote[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as WebFileNote).id) || `fn_${index}`,
    name: text((item as WebFileNote).name),
    caption: text((item as WebFileNote).caption),
    status: asReadiness((item as WebFileNote).status),
  }));
}

function defaultQa(): WebChecklistItem[] {
  return WEB_DEFAULT_QA.map((label, index) => ({
    id: `qa_${index + 1}`,
    label,
    status: "not_started",
    notes: "",
    owner: "",
  }));
}

function defaultHandover(): WebChecklistItem[] {
  return WEB_DEFAULT_HANDOVER.map((label, index) => ({
    id: `ho_${index + 1}`,
    label,
    status: "not_started",
    notes: "",
    owner: "",
  }));
}

export async function listWebsiteProjects(
  user: { id: string; role: string; modules?: string | null },
  filters: WebListFilters,
  section: WebSection,
) {
  await ensureWebsiteSchema();
  const access = await websiteAccessFor(user);
  const db = prisma();
  const emptyRows = await db
    .$queryRawUnsafe<Array<{ id: string; ownerId: string | null }>>(
      `SELECT p.id, p.ownerId FROM WebsiteProject p
       LEFT JOIN WebsiteSubtask s ON s.propertyId = p.id
       GROUP BY p.id, p.ownerId
       HAVING COUNT(s.id) = 0`,
    )
    .catch(() => []);
  for (const row of emptyRows) {
    await seedStarterSubtasks(row.id, row.ownerId || access.userId);
  }
  const [rows, staff, sourceRows, kpiRows, auditRows, subtaskRows, commentRows, fileRows] = await Promise.all([
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM WebsiteProject ORDER BY updatedAt DESC`),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string }>),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM WebsiteSource ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM WebsiteKpiEntry ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM WebsiteAuditEvent ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM WebsiteSubtask ORDER BY sortOrder ASC, createdAt ASC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM WebsiteSubtaskComment ORDER BY createdAt ASC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM WebsiteSubtaskFile ORDER BY createdAt DESC`).catch(() => []),
  ]);
  const names = new Map(staff.map((item) => [item.id, item.name]));
  const query = filters.q?.trim().toLowerCase() || "";
  const stream = WEB_SECTION_WORKSTREAM[section];

  let items: WebProjectRow[] = rows.map((row) => {
    const ownerId = col(row, "ownerId");
    const status = normalizeStatus(col(row, "status"));
    const subtasks: WebSubtaskView[] = subtaskRows
      .filter((item) => col(item, "propertyId") === col(row, "id"))
      .map((item): WebSubtaskView => {
        const subOwner = col(item, "ownerId");
        return {
          id: col(item, "id"),
          propertyId: col(item, "propertyId"),
          name: col(item, "name"),
          department: isDepartment(col(item, "department")) ? (col(item, "department") as WebDepartment) : "marketing",
          ownerId: subOwner,
          ownerName: names.get(subOwner) || "",
          status: normalizeSubtaskStatus(col(item, "status")),
          completed: Boolean(item.completed) || col(item, "status") === "completed",
          dueAt: iso(item.dueAt as Date | string | null),
          priority: isPriority(col(item, "priority")) ? (col(item, "priority") as WebPriority) : "normal",
          comments: col(item, "comments"),
          source: col(item, "source"),
          thread: commentRows
            .filter((comment) => col(comment, "subtaskId") === col(item, "id"))
            .map(
              (comment): WebSubtaskCommentView => ({
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
              (file): WebSubtaskFileView => ({
                id: col(file, "id"),
                filename: col(file, "filename"),
                caption: col(file, "caption"),
                size: Number(file.size || 0),
                createdAt: iso(file.createdAt as Date | string | null),
                href: `/api/crm/website/files/${col(file, "id")}`,
              }),
            ),
        };
      });
    const qaItems = asChecklist(parseJson(row.qaJson, []));
    const handoverItems = asChecklist(parseJson(row.handoverJson, []));
    const sitemapRaw = parseJson<WebSitemapPage[] | { notes?: string; pages?: WebSitemapPage[] }>(row.sitemapJson, []);
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
      department: isDepartment(col(row, "department")) ? (col(row, "department") as WebDepartment) : "marketing",
      workstream: normalizeWorkstream(col(row, "workstream")),
      priority: isPriority(col(row, "priority")) ? (col(row, "priority") as WebPriority) : "normal",
      nextAction: col(row, "nextAction"),
      nextActionAt: iso(row.nextActionAt as Date | string | null),
      createdAt: iso(row.createdAt as Date | string | null),
      updatedAt: iso(row.updatedAt as Date | string | null),
      notes: col(row, "notes"),
      budgetStatus: isBudgetStatus(col(row, "budgetStatus")) ? (col(row, "budgetStatus") as WebBudgetStatus) : "not_set",
      trackingStatus: normalizeReadiness(col(row, "trackingStatus")),
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
      fileNotes: asFileNotes(parseJson(row.filesJson, [])),
      decisions: asDecisions(parseJson(row.decisionsJson, [])),
      approvals,
      sources: sourceRows
        .filter((item) => col(item, "propertyId") === col(row, "id"))
        .map(
          (item): WebSourceView => ({
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
          (item): WebKpiView => ({
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
          (item): WebAuditView => ({
            id: col(item, "id"),
            action: col(item, "action"),
            detail: col(item, "detail"),
            createdBy: col(item, "createdBy"),
            createdByName: names.get(col(item, "createdBy")) || "",
            createdAt: iso(item.createdAt as Date | string | null),
          }),
        ),
      subtasks,
      progress: webSubtaskProgress(subtasks, status, approvals),
    };
  });

  if (!access.isManagement) {
    items = items.filter((item) => access.departments.includes(item.department));
  }
  if (stream) items = items.filter((item) => item.workstream === stream);
  if (section === "approvals") {
    items = items.filter((item) => item.approvals.some((entry) => entry.status === "awaiting" || entry.status === "changes_requested") || item.status === "awaiting_hotel_approval");
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
  if (query) {
    items = items.filter((item) =>
      `${item.projectName} ${item.hotelName} ${item.currentUrl} ${item.cmsType} ${item.bookingEngine} ${item.targetMarket} ${item.languages} ${item.nextAction} ${item.notes}`
        .toLowerCase()
        .includes(query),
    );
  }

  const groupBy: WebGroupBy = isGroupBy(filters.group || "") ? (filters.group as WebGroupBy) : "status";
  const sort: WebSort = isSort(filters.sort || "") ? (filters.sort as WebSort) : "nextActionAt";
  items.sort((a, b) => {
    if (sort === "priority") return WEB_PRIORITY_RANK[a.priority] - WEB_PRIORITY_RANK[b.priority];
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
    `INSERT INTO WebsiteAuditEvent (id, propertyId, action, detail, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, NOW(3))`,
    `wa_${randomToken(10)}`,
    propertyId,
    action,
    detail,
    userId,
  );
}

export async function createWebsiteProject(access: WebAccessView, hotelName: string, workstream?: string) {
  const id = `web_${randomToken(10)}`;
  const stream = workstream ? normalizeWorkstream(workstream) : "project";
  await prisma().$executeRawUnsafe(
    `INSERT INTO WebsiteProject (id, hotelName, workstream, status, department, priority, nextAction, notes, ownerId, createdBy, updatedBy, createdAt, updatedAt)
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
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM WebsiteSubtask WHERE propertyId = ?`, propertyId)
    .catch(() => [{ count: 0 }]);
  if (Number(existing[0]?.count || 0) > 0) return;
  for (const [index, item] of WEB_STARTER_SUBTASKS.entries()) {
    await prisma().$executeRawUnsafe(
      `INSERT INTO WebsiteSubtask (id, propertyId, name, department, ownerId, status, completed, dueAt, priority, comments, source, sortOrder, createdBy, createdAt, updatedAt)
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

export async function countWebsiteSubtasks(propertyId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM WebsiteSubtask WHERE propertyId = ?`, propertyId)
    .catch(() => [{ count: 0 }]);
  return Number(rows[0]?.count || 0);
}

export async function getWebsiteSubtask(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM WebsiteSubtask WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function insertWebsiteSubtask(data: {
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
  const sort = (await countWebsiteSubtasks(data.propertyId)) + 1;
  await prisma().$executeRawUnsafe(
    `INSERT INTO WebsiteSubtask (id, propertyId, name, department, ownerId, status, completed, dueAt, priority, comments, source, sortOrder, createdBy, createdAt, updatedAt)
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

export async function updateWebsiteSubtask(
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
    `UPDATE WebsiteSubtask SET name=?, department=?, ownerId=?, status=?, completed=?, dueAt=?, priority=?, comments=?, source=?, updatedAt=NOW(3) WHERE id=?`,
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

export async function insertWebsiteSubtaskComment(subtaskId: string, authorId: string, body: string) {
  const id = `wsc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO WebsiteSubtaskComment (id, subtaskId, authorId, body, createdAt) VALUES (?, ?, ?, ?, NOW(3))`,
    id,
    subtaskId,
    authorId,
    body,
  );
  return id;
}

export async function insertWebsiteSubtaskFile(data: {
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
    `INSERT INTO WebsiteSubtaskFile (id, subtaskId, filename, mime, size, path, caption, createdBy, createdAt)
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

export async function getWebsiteSubtaskFile(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM WebsiteSubtaskFile WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function replaceKpis(propertyId: string, items: WebKpiView[]) {
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteKpiEntry WHERE propertyId = ?`, propertyId);
  for (const item of items) {
    await prisma().$executeRawUnsafe(
      `INSERT INTO WebsiteKpiEntry (id, propertyId, name, period, value, definition, source, dataStatus, market, createdAt)
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

export async function replaceSources(propertyId: string, items: WebSourceView[]) {
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteSource WHERE propertyId = ?`, propertyId);
  for (const item of items) {
    await prisma().$executeRawUnsafe(
      `INSERT INTO WebsiteSource (id, propertyId, name, url, publishedAt, accessedAt, notes, createdAt)
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

export async function saveWebsiteProject(
  id: string,
  data: Record<string, string | null | undefined>,
  userId: string,
  canSeePrivateIds: boolean,
) {
  const existing = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM WebsiteProject WHERE id = ? LIMIT 1`, id);
  const row = existing[0];
  if (!row) return false;
  const engineRef = canSeePrivateIds ? data.engineAccountRef ?? col(row, "engineAccountRef") : col(row, "engineAccountRef");
  const analyticsRef = canSeePrivateIds ? data.analyticsRef ?? col(row, "analyticsRef") : col(row, "analyticsRef");
  const pick = (key: string) => (data[key] !== undefined ? data[key] : col(row, key));
  await prisma().$executeRawUnsafe(
    `UPDATE WebsiteProject SET
      projectName=?, hotelName=?, currentUrl=?, bookingEngine=?, bookingEngineUrl=?, cmsType=?, projectType=?,
      primaryGoal=?, targetMarket=?, languages=?, startDate=?, launchDate=?, mobileReady=?, improveOrRebuild=?,
      status=?, ownerId=?, department=?, workstream=?, priority=?, nextAction=?, nextActionAt=?, notes=?,
      budgetStatus=?, trackingStatus=?, seoStatus=?, mobileStatus=?, handoverStatus=?,
      engineAccountRef=?, analyticsRef=?, cmsOwner=?, sourceCodeOwner=?, domainOwner=?, hostingOwner=?, analyticsOwner=?,
      bookingEngineOwner=?, discoveryJson=?, sitemapJson=?, uxJson=?, cmsJson=?, bookingJson=?, trackingJson=?,
      seoJson=?, qaJson=?, handoverJson=?, filesJson=?, decisionsJson=?, approvalsJson=?, updatedBy=?, updatedAt=NOW(3)
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
    userId,
    id,
  );
  return true;
}

export async function patchWebsiteProject(id: string, data: Record<string, string | null | undefined>, userId: string) {
  return saveWebsiteProject(id, data, userId, true);
}

export async function getWebsiteProject(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM WebsiteProject WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function appendWebsiteApproval(
  propertyId: string,
  item: { kind: string; status: string; notes: string; requestedBy: string; decidedBy?: string },
) {
  const row = await getWebsiteProject(propertyId);
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
    `UPDATE WebsiteProject SET approvalsJson=?, updatedAt=NOW(3) WHERE id=?`,
    JSON.stringify(approvals),
    propertyId,
  );
  return true;
}

export async function deleteWebsiteSubtask(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteSubtaskFile WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteSubtaskComment WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteSubtask WHERE id = ?`, id);
}

export async function deleteWebsiteProject(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteSubtaskFile WHERE subtaskId IN (SELECT id FROM WebsiteSubtask WHERE propertyId = ?)`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteSubtaskComment WHERE subtaskId IN (SELECT id FROM WebsiteSubtask WHERE propertyId = ?)`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteSubtask WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteSource WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteKpiEntry WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteAuditEvent WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteProject WHERE id = ?`, id);
}

export async function listWebsiteAccessRows() {
  await ensureWebsiteSchema();
  const [rows, staff] = await Promise.all([
    prisma().$queryRawUnsafe<Array<{ id: string; userId: string; department: string; canSeePrivateIds: number | boolean }>>(
      `SELECT id, userId, department, canSeePrivateIds FROM WebsiteAccess ORDER BY createdAt DESC`,
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

export async function saveWebsiteAccessRow(userId: string, department: string, canSeePrivateIds: boolean) {
  const id = `wacc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO WebsiteAccess (id, userId, department, canSeePrivateIds, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    userId,
    department,
    canSeePrivateIds ? 1 : 0,
  );
  return id;
}

export async function deleteWebsiteAccessRow(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM WebsiteAccess WHERE id = ?`, id);
}
