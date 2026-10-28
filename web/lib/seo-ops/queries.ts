import { prisma } from "@/lib/crm/db";
import { staffDirectory } from "@/lib/crm/queries";
import { randomToken } from "@/lib/crm/security";
import { seoAccessFor } from "./access";
import { ensureSeoSchema } from "./ensure";
import { seoSubtaskProgress } from "./progress";
import {
  MASKED_VALUE,
  SEO_PRIORITY_RANK,
  SEO_SECTION_WORKSTREAM,
  SEO_STARTER_SUBTASKS,
  isApprovalStatus,
  isDepartment,
  isFaqStatus,
  isGroupBy,
  isKpiDataStatus,
  isPriority,
  isSort,
  normalizeStatus,
  normalizeSubtaskStatus,
  normalizeWorkstream,
  type SeoAccessView,
  type SeoAeoView,
  type SeoApprovalStatus,
  type SeoAuditView,
  type SeoDepartment,
  type SeoFaqStatus,
  type SeoGroupBy,
  type SeoKpiDataStatus,
  type SeoKpiView,
  type SeoListFilters,
  type SeoPriority,
  type SeoPropertyRow,
  type SeoSection,
  type SeoSort,
  type SeoSourceView,
  type SeoSubtaskCommentView,
  type SeoSubtaskFileView,
  type SeoSubtaskView,
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

function asApproval(value: string): SeoApprovalStatus {
  return isApprovalStatus(value) ? value : "not_requested";
}

function asFaq(value: string): SeoFaqStatus {
  return isFaqStatus(value) ? value : "not_started";
}

function asKpiStatus(value: string): SeoKpiDataStatus {
  return isKpiDataStatus(value) ? value : "draft";
}

export async function listSeoProperties(
  user: { id: string; role: string; modules?: string | null },
  filters: SeoListFilters,
  section: SeoSection,
) {
  await ensureSeoSchema();
  const access = await seoAccessFor(user);
  const db = prisma();
  const emptyRows = await db
    .$queryRawUnsafe<Array<{ id: string; ownerId: string | null }>>(
      `SELECT p.id, p.ownerId FROM SeoProperty p
       LEFT JOIN SeoSubtask s ON s.propertyId = p.id
       GROUP BY p.id, p.ownerId
       HAVING COUNT(s.id) = 0`,
    )
    .catch(() => []);
  for (const row of emptyRows) {
    await seedStarterSubtasks(row.id, row.ownerId || access.userId);
  }
  const [rows, staff, sourceRows, aeoRows, kpiRows, auditRows, subtaskRows, commentRows, fileRows] = await Promise.all([
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoProperty ORDER BY updatedAt DESC`),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string }>),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoSource ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoAeoQuery ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoKpiEntry ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoAuditEvent ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoSubtask ORDER BY sortOrder ASC, createdAt ASC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoSubtaskComment ORDER BY createdAt ASC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoSubtaskFile ORDER BY createdAt DESC`).catch(() => []),
  ]);
  const names = new Map(staff.map((item) => [item.id, item.name]));
  const query = filters.q?.trim().toLowerCase() || "";
  const stream = SEO_SECTION_WORKSTREAM[section];

  let items: SeoPropertyRow[] = rows.map((row) => {
    const ownerId = col(row, "ownerId");
    const privateMasked = !access.canSeePrivateIds;
    const status = normalizeStatus(col(row, "status"));
    const gbpApproval = asApproval(col(row, "gbpApproval"));
    const subtasks: SeoSubtaskView[] = subtaskRows
      .filter((item) => col(item, "propertyId") === col(row, "id"))
      .map((item): SeoSubtaskView => {
        const subOwner = col(item, "ownerId");
        return {
          id: col(item, "id"),
          propertyId: col(item, "propertyId"),
          name: col(item, "name"),
          department: isDepartment(col(item, "department")) ? (col(item, "department") as SeoDepartment) : "marketing",
          ownerId: subOwner,
          ownerName: names.get(subOwner) || "",
          status: normalizeSubtaskStatus(col(item, "status")),
          completed: Boolean(item.completed) || col(item, "status") === "completed",
          dueAt: iso(item.dueAt as Date | string | null),
          priority: isPriority(col(item, "priority")) ? (col(item, "priority") as SeoPriority) : "normal",
          comments: col(item, "comments"),
          source: col(item, "source"),
          thread: commentRows
            .filter((comment) => col(comment, "subtaskId") === col(item, "id"))
            .map(
              (comment): SeoSubtaskCommentView => ({
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
              (file): SeoSubtaskFileView => ({
                id: col(file, "id"),
                filename: col(file, "filename"),
                caption: col(file, "caption"),
                size: Number(file.size || 0),
                createdAt: iso(file.createdAt as Date | string | null),
                href: `/api/crm/seo/files/${col(file, "id")}`,
              }),
            ),
        };
      });
    return {
      id: col(row, "id"),
      hotelName: col(row, "hotelName"),
      businessName: col(row, "businessName"),
      website: col(row, "website"),
      gbpUrl: col(row, "gbpUrl"),
      mapsUrl: col(row, "mapsUrl"),
      searchMarket: col(row, "searchMarket"),
      language: col(row, "language"),
      location: col(row, "location"),
      primaryCategory: col(row, "primaryCategory"),
      secondaryCategories: col(row, "secondaryCategories"),
      status,
      ownerId,
      ownerName: names.get(ownerId) || "",
      department: isDepartment(col(row, "department")) ? (col(row, "department") as SeoDepartment) : "marketing",
      workstream: normalizeWorkstream(col(row, "workstream")),
      priority: isPriority(col(row, "priority")) ? (col(row, "priority") as SeoPriority) : "normal",
      nextAction: col(row, "nextAction"),
      nextActionAt: iso(row.nextActionAt as Date | string | null),
      auditAt: iso(row.auditAt as Date | string | null),
      updatedAt: iso(row.updatedAt as Date | string | null),
      notes: col(row, "notes"),
      gscPropertyRef: mask(col(row, "gscPropertyRef"), access.canSeePrivateIds),
      googleAccountRef: mask(col(row, "googleAccountRef"), access.canSeePrivateIds),
      privateMasked,
      contactPath: col(row, "contactPath"),
      bookingUrl: col(row, "bookingUrl"),
      reviewWorkflow: col(row, "reviewWorkflow"),
      gbpName: col(row, "gbpName"),
      gbpCategory: col(row, "gbpCategory"),
      gbpAddress: col(row, "gbpAddress"),
      gbpHours: col(row, "gbpHours"),
      gbpPhone: col(row, "gbpPhone"),
      gbpWebsite: col(row, "gbpWebsite"),
      gbpPhotos: col(row, "gbpPhotos"),
      gbpServices: col(row, "gbpServices"),
      gbpReviewWorkflow: col(row, "gbpReviewWorkflow"),
      gbpContactLink: col(row, "gbpContactLink"),
      gbpApproval,
      sources: sourceRows
        .filter((item) => col(item, "propertyId") === col(row, "id"))
        .map(
          (item): SeoSourceView => ({
            id: col(item, "id"),
            name: col(item, "name"),
            url: col(item, "url"),
            publishedAt: col(item, "publishedAt"),
            accessedAt: col(item, "accessedAt"),
            notes: col(item, "notes"),
          }),
        ),
      aeoQueries: aeoRows
        .filter((item) => col(item, "propertyId") === col(row, "id"))
        .map(
          (item): SeoAeoView => ({
            id: col(item, "id"),
            query: col(item, "queryText"),
            intent: col(item, "intent"),
            answerDraft: col(item, "answerDraft"),
            source: col(item, "source"),
            entityInfo: col(item, "entityInfo"),
            faqStatus: asFaq(col(item, "faqStatus")),
            language: col(item, "language"),
            market: col(item, "market"),
            reviewStatus: asApproval(col(item, "reviewStatus")),
            publishedStatus: asFaq(col(item, "publishedStatus")),
          }),
        ),
      kpis: kpiRows
        .filter((item) => col(item, "propertyId") === col(row, "id"))
        .map(
          (item): SeoKpiView => ({
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
          (item): SeoAuditView => ({
            id: col(item, "id"),
            action: col(item, "action"),
            detail: col(item, "detail"),
            createdBy: col(item, "createdBy"),
            createdByName: names.get(col(item, "createdBy")) || "",
            createdAt: iso(item.createdAt as Date | string | null),
          }),
        ),
      subtasks,
      progress: seoSubtaskProgress(subtasks, status, gbpApproval),
    };
  });

  if (!access.isManagement) {
    items = items.filter((item) => access.departments.includes(item.department));
  }
  if (stream) items = items.filter((item) => item.workstream === stream);
  if (filters.status && normalizeStatus(filters.status) === filters.status) {
    items = items.filter((item) => item.status === filters.status);
  }
  if (filters.ownerId) items = items.filter((item) => item.ownerId === filters.ownerId);
  if (filters.department) items = items.filter((item) => item.department === filters.department);
  if (filters.hotel) items = items.filter((item) => item.hotelName === filters.hotel);
  if (filters.market) items = items.filter((item) => item.searchMarket === filters.market);
  if (filters.workstream) items = items.filter((item) => item.workstream === filters.workstream);
  if (query) {
    items = items.filter((item) =>
      `${item.hotelName} ${item.businessName} ${item.searchMarket} ${item.location} ${item.nextAction} ${item.notes} ${item.primaryCategory} ${item.website}`
        .toLowerCase()
        .includes(query),
    );
  }

  const sort: SeoSort = isSort(filters.sort || "") ? (filters.sort as SeoSort) : defaultSort(section);
  items.sort((a, b) => {
    if (sort === "priority") return SEO_PRIORITY_RANK[a.priority] - SEO_PRIORITY_RANK[b.priority];
    if (sort === "updatedAt") return (b.updatedAt || "").localeCompare(a.updatedAt || "");
    return (a.nextActionAt || "9999").localeCompare(b.nextActionAt || "9999");
  });

  const groupBy: SeoGroupBy = isGroupBy(filters.group || "") ? (filters.group as SeoGroupBy) : defaultGroup(section);

  return {
    access,
    items,
    staff,
    groupBy,
    sort,
    facets: {
      hotels: Array.from(new Set(rows.map((item) => col(item, "hotelName")).filter(Boolean))),
      markets: Array.from(new Set(rows.map((item) => col(item, "searchMarket")).filter(Boolean))),
    },
  };
}

function defaultGroup(section: SeoSection): SeoGroupBy {
  if (section === "gbp") return "hotel";
  if (section === "aeo") return "market";
  if (section === "reports") return "department";
  if (section === "sources") return "hotel";
  if (section === "audit") return "status";
  return "status";
}

function defaultSort(section: SeoSection): SeoSort {
  if (section === "reports") return "updatedAt";
  if (section === "audit") return "nextActionAt";
  return "nextActionAt";
}

export async function createSeoProperty(access: SeoAccessView, hotelName: string, workstream?: string) {
  const db = prisma();
  const id = `seo_${randomToken(10)}`;
  const stream = workstream ? normalizeWorkstream(workstream) : "visibility";
  await db.$executeRawUnsafe(
    `INSERT INTO SeoProperty (id, hotelName, businessName, workstream, status, department, priority, website, mapsUrl, nextAction, notes, ownerId, createdBy, updatedBy, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, 'draft', 'marketing', 'normal', '', '', '', '', ?, ?, ?, NOW(3), NOW(3))`,
    id,
    hotelName,
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
  const db = prisma();
  const existing = await db
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM SeoSubtask WHERE propertyId = ?`, propertyId)
    .catch(() => [{ count: 0 }]);
  if (Number(existing[0]?.count || 0) > 0) return;
  for (const [index, item] of SEO_STARTER_SUBTASKS.entries()) {
    await db.$executeRawUnsafe(
      `INSERT INTO SeoSubtask (id, propertyId, name, department, ownerId, status, completed, dueAt, priority, comments, source, sortOrder, createdBy, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, 'not_started', 0, NULL, 'normal', '', '', ?, ?, NOW(3), NOW(3))`,
      `sst_${randomToken(10)}`,
      propertyId,
      item.name,
      item.department,
      userId,
      index + 1,
      userId,
    );
  }
}

export async function countSeoSubtasks(propertyId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM SeoSubtask WHERE propertyId = ?`, propertyId)
    .catch(() => [{ count: 0 }]);
  return Number(rows[0]?.count || 0);
}

export async function getSeoSubtask(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoSubtask WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function listSeoSubtasks(propertyId: string) {
  return prisma()
    .$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoSubtask WHERE propertyId = ? ORDER BY sortOrder ASC, createdAt ASC`, propertyId)
    .catch(() => []);
}

export async function insertSeoSubtask(data: {
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
  const id = `sst_${randomToken(10)}`;
  const sort = (await countSeoSubtasks(data.propertyId)) + 1;
  await prisma().$executeRawUnsafe(
    `INSERT INTO SeoSubtask (id, propertyId, name, department, ownerId, status, completed, dueAt, priority, comments, source, sortOrder, createdBy, createdAt, updatedAt)
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

export async function updateSeoSubtask(
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
    `UPDATE SeoSubtask SET name=?, department=?, ownerId=?, status=?, completed=?, dueAt=?, priority=?, comments=?, source=?, updatedAt=NOW(3) WHERE id=?`,
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

export async function insertSeoSubtaskComment(subtaskId: string, authorId: string, body: string) {
  const id = `ssc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO SeoSubtaskComment (id, subtaskId, authorId, body, createdAt) VALUES (?, ?, ?, ?, NOW(3))`,
    id,
    subtaskId,
    authorId,
    body,
  );
  return id;
}

export async function insertSeoSubtaskFile(data: {
  subtaskId: string;
  filename: string;
  mime: string;
  size: number;
  path: string;
  caption: string;
  userId: string;
}) {
  const id = `ssf_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO SeoSubtaskFile (id, subtaskId, filename, mime, size, path, caption, createdBy, createdAt)
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

export async function getSeoSubtaskFile(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoSubtaskFile WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function insertSeoSource(propertyId: string, item: { name: string; url: string; notes: string }) {
  const id = `src_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO SeoSource (id, propertyId, name, url, publishedAt, accessedAt, notes, createdAt)
     VALUES (?, ?, ?, ?, '', '', ?, NOW(3))`,
    id,
    propertyId,
    item.name,
    item.url,
    item.notes,
  );
  return id;
}

export async function patchSeoProperty(id: string, fields: Record<string, string | null>, userId: string) {
  const db = prisma();
  const existing = await db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT id FROM SeoProperty WHERE id = ? LIMIT 1`, id);
  if (!existing[0]) return false;
  const entries = Object.entries(fields).filter(([, value]) => value !== undefined);
  if (!entries.length) return true;
  const setters = entries.map(([key]) => `\`${key}\` = ?`).join(", ");
  await db.$executeRawUnsafe(
    `UPDATE SeoProperty SET ${setters}, updatedBy = ?, updatedAt = NOW(3) WHERE id = ?`,
    ...entries.map(([, value]) => value),
    userId,
    id,
  );
  return true;
}

export async function saveSeoProperty(
  id: string,
  data: Record<string, string | null | undefined>,
  userId: string,
  canSeePrivateIds: boolean,
) {
  const db = prisma();
  const existing = await db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SeoProperty WHERE id = ? LIMIT 1`, id);
  const row = existing[0];
  if (!row) return false;

  const gsc = canSeePrivateIds ? data.gscPropertyRef ?? col(row, "gscPropertyRef") : col(row, "gscPropertyRef");
  const google = canSeePrivateIds ? data.googleAccountRef ?? col(row, "googleAccountRef") : col(row, "googleAccountRef");

  await db.$executeRawUnsafe(
    `UPDATE SeoProperty SET
      hotelName=?, businessName=?, website=?, gbpUrl=?, mapsUrl=?, searchMarket=?, language=?, location=?,
      primaryCategory=?, secondaryCategories=?, status=?, ownerId=?, department=?, workstream=?, priority=?,
      nextAction=?, nextActionAt=?, auditAt=?, notes=?, gscPropertyRef=?, googleAccountRef=?, contactPath=?,
      bookingUrl=?, reviewWorkflow=?, gbpName=?, gbpCategory=?, gbpAddress=?, gbpHours=?, gbpPhone=?, gbpWebsite=?,
      gbpPhotos=?, gbpServices=?, gbpReviewWorkflow=?, gbpContactLink=?, gbpApproval=?, updatedBy=?, updatedAt=NOW(3)
     WHERE id=?`,
    data.hotelName ?? col(row, "hotelName"),
    data.businessName ?? col(row, "businessName"),
    data.website ?? col(row, "website"),
    data.gbpUrl ?? col(row, "gbpUrl"),
    data.mapsUrl ?? col(row, "mapsUrl"),
    data.searchMarket ?? col(row, "searchMarket"),
    data.language ?? col(row, "language"),
    data.location ?? col(row, "location"),
    data.primaryCategory ?? col(row, "primaryCategory"),
    data.secondaryCategories ?? col(row, "secondaryCategories"),
    data.status ?? col(row, "status"),
    data.ownerId ?? col(row, "ownerId"),
    data.department ?? col(row, "department"),
    data.workstream ?? col(row, "workstream"),
    data.priority ?? col(row, "priority"),
    data.nextAction ?? col(row, "nextAction"),
    data.nextActionAt || null,
    data.auditAt || null,
    data.notes ?? col(row, "notes"),
    gsc,
    google,
    data.contactPath ?? col(row, "contactPath"),
    data.bookingUrl ?? col(row, "bookingUrl"),
    data.reviewWorkflow ?? col(row, "reviewWorkflow"),
    data.gbpName ?? col(row, "gbpName"),
    data.gbpCategory ?? col(row, "gbpCategory"),
    data.gbpAddress ?? col(row, "gbpAddress"),
    data.gbpHours ?? col(row, "gbpHours"),
    data.gbpPhone ?? col(row, "gbpPhone"),
    data.gbpWebsite ?? col(row, "gbpWebsite"),
    data.gbpPhotos ?? col(row, "gbpPhotos"),
    data.gbpServices ?? col(row, "gbpServices"),
    data.gbpReviewWorkflow ?? col(row, "gbpReviewWorkflow"),
    data.gbpContactLink ?? col(row, "gbpContactLink"),
    data.gbpApproval ?? col(row, "gbpApproval"),
    userId,
    id,
  );
  return true;
}

export async function writeAudit(propertyId: string, userId: string, action: string, detail: string) {
  await prisma()
    .$executeRawUnsafe(
      `INSERT INTO SeoAuditEvent (id, propertyId, action, detail, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, NOW(3))`,
      `sea_${randomToken(10)}`,
      propertyId,
      action,
      detail,
      userId,
    )
    .catch(() => undefined);
}

export async function replaceSources(propertyId: string, items: SeoSourceView[]) {
  const db = prisma();
  await db.$executeRawUnsafe(`DELETE FROM SeoSource WHERE propertyId = ?`, propertyId);
  for (const item of items) {
    await db.$executeRawUnsafe(
      `INSERT INTO SeoSource (id, propertyId, name, url, publishedAt, accessedAt, notes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      item.id || `src_${randomToken(10)}`,
      propertyId,
      item.name,
      item.url,
      item.publishedAt,
      item.accessedAt,
      item.notes,
    );
  }
}

export async function replaceAeoQueries(propertyId: string, items: SeoAeoView[]) {
  const db = prisma();
  await db.$executeRawUnsafe(`DELETE FROM SeoAeoQuery WHERE propertyId = ?`, propertyId);
  for (const item of items) {
    await db.$executeRawUnsafe(
      `INSERT INTO SeoAeoQuery (id, propertyId, queryText, intent, answerDraft, source, entityInfo, faqStatus, language, market, reviewStatus, publishedStatus, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
      item.id || `aeo_${randomToken(10)}`,
      propertyId,
      item.query,
      item.intent,
      item.answerDraft,
      item.source,
      item.entityInfo,
      item.faqStatus,
      item.language,
      item.market,
      item.reviewStatus,
      item.publishedStatus,
    );
  }
}

export async function replaceKpis(propertyId: string, items: SeoKpiView[]) {
  const db = prisma();
  await db.$executeRawUnsafe(`DELETE FROM SeoKpiEntry WHERE propertyId = ?`, propertyId);
  for (const item of items) {
    await db.$executeRawUnsafe(
      `INSERT INTO SeoKpiEntry (id, propertyId, name, period, value, definition, source, dataStatus, market, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      item.id || `kpi_${randomToken(10)}`,
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

export async function deleteSeoProperty(id: string) {
  const db = prisma();
  const subtasks = await listSeoSubtasks(id);
  for (const item of subtasks) {
    const subId = String(item.id ?? "");
    await db.$executeRawUnsafe(`DELETE FROM SeoSubtaskComment WHERE subtaskId=?`, subId).catch(() => undefined);
    await db.$executeRawUnsafe(`DELETE FROM SeoSubtaskFile WHERE subtaskId=?`, subId).catch(() => undefined);
  }
  await db.$executeRawUnsafe(`DELETE FROM SeoSubtask WHERE propertyId=?`, id).catch(() => undefined);
  await db.$executeRawUnsafe(`DELETE FROM SeoSource WHERE propertyId=?`, id).catch(() => undefined);
  await db.$executeRawUnsafe(`DELETE FROM SeoAeoQuery WHERE propertyId=?`, id).catch(() => undefined);
  await db.$executeRawUnsafe(`DELETE FROM SeoKpiEntry WHERE propertyId=?`, id).catch(() => undefined);
  await db.$executeRawUnsafe(`DELETE FROM SeoAuditEvent WHERE propertyId=?`, id).catch(() => undefined);
  await db.$executeRawUnsafe(`DELETE FROM SeoProperty WHERE id=?`, id);
}

export async function listSeoAccessRows() {
  await ensureSeoSchema();
  const [rows, staff] = await Promise.all([
    prisma()
      .$queryRawUnsafe<Array<{ id: string; userId: string; department: string; canSeePrivateIds: number | boolean }>>(
        `SELECT id, userId, department, canSeePrivateIds FROM SeoAccess ORDER BY createdAt ASC`,
      )
      .catch(() => []),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string; email: string }>),
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

export async function saveSeoAccessRow(userId: string, department: SeoDepartment, canSeePrivateIds: boolean) {
  const existing = await prisma()
    .$queryRawUnsafe<Array<{ id: string }>>(
      `SELECT id FROM SeoAccess WHERE userId = ? AND department = ? LIMIT 1`,
      userId,
      department,
    )
    .catch(() => []);
  if (existing[0]) {
    await prisma().$executeRawUnsafe(
      `UPDATE SeoAccess SET canSeePrivateIds = ?, updatedAt = NOW(3) WHERE id = ?`,
      canSeePrivateIds ? 1 : 0,
      existing[0].id,
    );
    return existing[0].id;
  }
  const id = `seaacc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO SeoAccess (id, userId, department, canSeePrivateIds, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    userId,
    department,
    canSeePrivateIds ? 1 : 0,
  );
  return id;
}

export async function deleteSeoAccessRow(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM SeoAccess WHERE id = ?`, id);
}

export async function seoOpsOverview(user: { id: string; role: string; modules?: string | null }) {
  const { items } = await listSeoProperties(user, {}, "visibility");
  const liveStatuses = new Set(["published", "tracking", "completed"]);
  const dueStatuses = new Set(["audit_scheduled", "in_review", "action_planned", "in_progress", "waiting_hotel", "ready_approval"]);
  return {
    total: items.length,
    live: items.filter((item) => liveStatuses.has(item.status)).length,
    due: items.filter((item) => dueStatuses.has(item.status)).length,
  };
}
