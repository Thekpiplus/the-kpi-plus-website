import { prisma } from "@/lib/crm/db";
import { staffDirectory } from "@/lib/crm/queries";
import { randomToken } from "@/lib/crm/security";
import { managementAccessFor } from "./access";
import { ensureManagementSchema } from "./ensure";
import { convSubtaskProgress } from "./progress";
import {
  MASKED_VALUE,
  MGMT_DEFAULT_HANDOVER,
  MGMT_DEFAULT_QA,
  MGMT_PRIORITY_RANK,
  MGMT_STARTER_SUBTASKS,
  earliestDueDate,
  emptySectionBlock,
  isApprovalStatus,
  isDepartment,
  isGroupBy,
  isPriority,
  isReadiness,
  isSort,
  normalizeAssessmentArea,
  normalizeCadence,
  normalizeHotelStatus,
  normalizeKpiArea,
  normalizeKpiDataStatus,
  normalizePlanPhase,
  normalizeProjectType,
  normalizeReadiness,
  normalizeStatus,
  normalizeSubtaskStatus,
  normalizeWorkstream,
  type MgmtAccessView,
  type MgmtActionLogView,
  type MgmtApprovalView,
  type MgmtAssessmentView,
  type MgmtAuditView,
  type MgmtChecklistItem,
  type MgmtDepartment,
  type MgmtFileNote,
  type MgmtGroupBy,
  type MgmtKpiView,
  type MgmtListFilters,
  type MgmtMeetingView,
  type MgmtPeopleRoleView,
  type MgmtPlanView,
  type MgmtPriority,
  type MgmtProjectRow,
  type MgmtReadiness,
  type MgmtSection,
  type MgmtSectionBlock,
  type MgmtSort,
  type MgmtSourceView,
  type MgmtSubtaskCommentView,
  type MgmtSubtaskFileView,
  type MgmtSubtaskView,
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

function asKpiStatus(value: string) {
  return normalizeKpiDataStatus(value);
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

function asReadiness(value: unknown): MgmtReadiness {
  return isReadiness(String(value ?? "")) ? (value as MgmtReadiness) : "not_started";
}

function asChecklist(value: unknown): MgmtChecklistItem[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as MgmtChecklistItem).id) || `chk_${index}`,
    label: text((item as MgmtChecklistItem).label),
    status: asReadiness((item as MgmtChecklistItem).status),
    notes: text((item as MgmtChecklistItem).notes),
    owner: text((item as MgmtChecklistItem).owner),
  }));
}

function asSection(value: unknown): MgmtSectionBlock {
  const raw = value && typeof value === "object" ? (value as Partial<MgmtSectionBlock>) : {};
  return {
    summary: text(raw.summary),
    owner: text(raw.owner),
    status: asReadiness(raw.status),
    notes: text(raw.notes),
    items: asChecklist(raw.items),
  };
}

function asPeople(value: unknown): MgmtPeopleRoleView[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => {
    const row = item as Partial<MgmtPeopleRoleView>;
    return {
      id: text(row.id) || `pr_${index}`,
      role: text(row.role),
      name: text(row.name),
      department: isDepartment(text(row.department)) ? (text(row.department) as MgmtDepartment) : "",
      owner: text(row.owner),
      status: asReadiness(row.status),
      notes: text(row.notes),
    };
  });
}

function asAssessments(value: unknown, friction: unknown): MgmtAssessmentView[] {
  const source = Array.isArray(value) && value.length ? value : Array.isArray(friction) ? friction : [];
  return source.map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: text(row.id) || `as_${index}`,
      area: normalizeAssessmentArea(text(row.area) || text(row.category)),
      question: text(row.question) || text(row.title),
      currentState: text(row.currentState) || text(row.notes),
      evidence: text(row.evidence),
      risk: isPriority(text(row.risk) || text(row.severity)) ? ((text(row.risk) || text(row.severity)) as MgmtPriority) : "normal",
      recommendedAction: text(row.recommendedAction),
      owner: text(row.owner),
      department: isDepartment(text(row.department)) ? (text(row.department) as MgmtDepartment) : "",
      dueAt: text(row.dueAt),
      approvalStatus: isApprovalStatus(text(row.approvalStatus)) ? (row.approvalStatus as MgmtAssessmentView["approvalStatus"]) : "not_requested",
      status: normalizeSubtaskStatus(text(row.status)),
    };
  });
}

function asPlans(value: unknown): MgmtPlanView[] {
  if (Array.isArray(value) && value.length) {
    return value.map((item, index) => {
      const row = item as Partial<MgmtPlanView>;
      return {
        id: text(row.id) || `pl_${index}`,
        phase: normalizePlanPhase(text(row.phase)),
        objective: text(row.objective),
        action: text(row.action) || text(row.objective),
        owner: text(row.owner),
        department: isDepartment(text(row.department)) ? (text(row.department) as MgmtDepartment) : "",
        startAt: text(row.startAt),
        dueAt: text(row.dueAt),
        priority: isPriority(text(row.priority)) ? (text(row.priority) as MgmtPriority) : "normal",
        status: normalizeSubtaskStatus(text(row.status)),
        dependency: text(row.dependency),
        kpi: text(row.kpi),
        target: text(row.target),
        measurement: text(row.measurement),
        approvalStatus: isApprovalStatus(text(row.approvalStatus)) ? (row.approvalStatus as MgmtPlanView["approvalStatus"]) : "not_requested",
        notes: text(row.notes),
      };
    });
  }
  return [];
}

function asMeetings(value: unknown, decisions: unknown): MgmtMeetingView[] {
  const source = Array.isArray(value) && value.length ? value : Array.isArray(decisions) ? decisions : [];
  return source.map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: text(row.id) || `mt_${index}`,
      meetingType: normalizeCadence(text(row.meetingType)),
      property: text(row.property),
      date: text(row.date),
      participants: text(row.participants),
      agenda: text(row.agenda) || text(row.title),
      decisions: text(row.decisions) || text(row.decision),
      actionItems: text(row.actionItems),
      owner: text(row.owner),
      dueAt: text(row.dueAt),
      status: normalizeSubtaskStatus(text(row.status)),
      notes: text(row.notes),
    };
  });
}

function asActionLogs(value: unknown, subtasks: MgmtSubtaskView[], hotelName: string): MgmtActionLogView[] {
  if (Array.isArray(value) && value.length) {
    return value.map((item, index) => {
      const row = item as Partial<MgmtActionLogView>;
      return {
        id: text(row.id) || `al_${index}`,
        name: text(row.name),
        property: text(row.property) || hotelName,
        workstream: normalizeWorkstream(text(row.workstream) || "actions"),
        owner: text(row.owner),
        department: isDepartment(text(row.department)) ? (text(row.department) as MgmtDepartment) : "",
        priority: isPriority(text(row.priority)) ? (text(row.priority) as MgmtPriority) : "normal",
        status: normalizeSubtaskStatus(text(row.status)),
        dueAt: text(row.dueAt),
        relatedKpi: text(row.relatedKpi),
        decision: text(row.decision),
        notes: text(row.notes),
      };
    });
  }
  return subtasks.map((item) => ({
    id: `al_${item.id}`,
    name: item.name,
    property: hotelName,
    workstream: "actions" as const,
    owner: item.ownerName,
    department: item.department,
    priority: item.priority,
    status: item.status,
    dueAt: item.dueAt,
    relatedKpi: "",
    decision: "",
    notes: item.comments,
  }));
}

function asApprovals(value: unknown): MgmtApprovalView[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as MgmtApprovalView).id) || `ap_${index}`,
    kind: text((item as MgmtApprovalView).kind),
    status: isApprovalStatus(text((item as MgmtApprovalView).status)) ? (item as MgmtApprovalView).status : "not_requested",
    notes: text((item as MgmtApprovalView).notes),
    requestedBy: text((item as MgmtApprovalView).requestedBy),
    decidedBy: text((item as MgmtApprovalView).decidedBy),
    createdAt: text((item as MgmtApprovalView).createdAt),
  }));
}

function asFileNotes(value: unknown): MgmtFileNote[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as MgmtFileNote).id) || `fn_${index}`,
    name: text((item as MgmtFileNote).name),
    caption: text((item as MgmtFileNote).caption),
    status: asReadiness((item as MgmtFileNote).status),
  }));
}

function defaultQa(): MgmtChecklistItem[] {
  return MGMT_DEFAULT_QA.map((label, index) => ({
    id: `qa_${index + 1}`,
    label,
    status: "not_started",
    notes: "",
    owner: "",
  }));
}

function defaultHandover(): MgmtChecklistItem[] {
  return MGMT_DEFAULT_HANDOVER.map((label, index) => ({
    id: `ho_${index + 1}`,
    label,
    status: "not_started",
    notes: "",
    owner: "",
  }));
}

export async function listManagementProjects(
  user: { id: string; role: string; modules?: string | null },
  filters: MgmtListFilters,
  section: MgmtSection,
) {
  await ensureManagementSchema();
  const access = await managementAccessFor(user);
  const db = prisma();
  const emptyRows = await db
    .$queryRawUnsafe<Array<{ id: string; ownerId: string | null }>>(
      `SELECT p.id, p.ownerId FROM ManagementProject p
       LEFT JOIN ManagementSubtask s ON s.propertyId = p.id
       GROUP BY p.id, p.ownerId
       HAVING COUNT(s.id) = 0`,
    )
    .catch(() => []);
  for (const row of emptyRows) {
    await seedStarterSubtasks(row.id, row.ownerId || access.userId);
  }
  const [rows, staff, sourceRows, kpiRows, auditRows, subtaskRows, commentRows, fileRows] = await Promise.all([
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ManagementProject ORDER BY updatedAt DESC`),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string }>),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ManagementSource ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ManagementKpiEntry ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ManagementAuditEvent ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ManagementSubtask ORDER BY sortOrder ASC, createdAt ASC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ManagementSubtaskComment ORDER BY createdAt ASC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ManagementSubtaskFile ORDER BY createdAt DESC`).catch(() => []),
  ]);
  const names = new Map(staff.map((item) => [item.id, item.name]));
  const query = filters.q?.trim().toLowerCase() || "";

  let items: MgmtProjectRow[] = rows.map((row) => {
    const ownerId = col(row, "ownerId");
    const status = normalizeStatus(col(row, "status"));
    const subtasks: MgmtSubtaskView[] = subtaskRows
      .filter((item) => col(item, "propertyId") === col(row, "id"))
      .map((item): MgmtSubtaskView => {
        const subOwner = col(item, "ownerId");
        return {
          id: col(item, "id"),
          propertyId: col(item, "propertyId"),
          name: col(item, "name"),
          department: isDepartment(col(item, "department")) ? (col(item, "department") as MgmtDepartment) : "marketing",
          ownerId: subOwner,
          ownerName: names.get(subOwner) || "",
          status: normalizeSubtaskStatus(col(item, "status")),
          completed: Boolean(item.completed) || col(item, "status") === "completed",
          dueAt: iso(item.dueAt as Date | string | null),
          priority: isPriority(col(item, "priority")) ? (col(item, "priority") as MgmtPriority) : "normal",
          comments: col(item, "comments"),
          source: col(item, "source"),
          thread: commentRows
            .filter((comment) => col(comment, "subtaskId") === col(item, "id"))
            .map(
              (comment): MgmtSubtaskCommentView => ({
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
              (file): MgmtSubtaskFileView => ({
                id: col(file, "id"),
                filename: col(file, "filename"),
                caption: col(file, "caption"),
                size: Number(file.size || 0),
                createdAt: iso(file.createdAt as Date | string | null),
                href: `/api/crm/management/files/${col(file, "id")}`,
              }),
            ),
        };
      });
    const qaItems = asChecklist(parseJson(row.qaJson, []));
    const handoverItems = asChecklist(parseJson(row.handoverJson, []));
    const projectType = normalizeProjectType(col(row, "propertyType") || col(row, "projectType") || col(row, "improveOrRebuild"));
    const approvals = asApprovals(parseJson(row.approvalsJson, []));
    const hotelName = col(row, "hotelName");
    const assessments = asAssessments(parseJson(row.assessmentsJson, []), parseJson(row.frictionJson, []));
    const plans = asPlans(parseJson(row.plansJson, []));
    const meetings = asMeetings(parseJson(row.meetingsJson, []), parseJson(row.decisionsJson, []));
    const kpis = kpiRows
      .filter((item) => col(item, "propertyId") === col(row, "id"))
      .map((item): MgmtKpiView => {
        const dataStatus = asKpiStatus(col(item, "dataStatus"));
        const rawValue = col(item, "value");
        const showValue = dataStatus === "sample" || dataStatus === "not_configured" || access.canSeePrivateIds;
        return {
          id: col(item, "id"),
          name: col(item, "name"),
          area: normalizeKpiArea(col(item, "area")),
          period: col(item, "period"),
          value: showValue ? rawValue : mask(rawValue, false),
          definition: col(item, "definition"),
          source: col(item, "source"),
          dataStatus,
          market: col(item, "market") || hotelName,
          target: col(item, "targetValue"),
          owner: col(item, "kpiOwner"),
          notes: col(item, "kpiNotes"),
          updatedAt: iso(item.updatedAt as Date | string | null) || iso(item.createdAt as Date | string | null),
        };
      });
    const mapped: MgmtProjectRow = {
      id: col(row, "id"),
      projectName: col(row, "projectName") || hotelName,
      hotelName,
      propertyType: projectType,
      roomCount: col(row, "roomCount"),
      locationMarket: col(row, "locationMarket") || col(row, "targetMarket"),
      hotelStatus: normalizeHotelStatus(col(row, "hotelOperatingStatus")),
      primaryGoal: col(row, "primaryGoal"),
      mainChallenge: col(row, "mainChallenge"),
      startDate: iso(row.startDate as Date | string | null),
      launchDate: iso(row.launchDate as Date | string | null),
      status,
      ownerId,
      ownerName: names.get(ownerId) || "",
      department: isDepartment(col(row, "department")) ? (col(row, "department") as MgmtDepartment) : "marketing",
      workstream: normalizeWorkstream(col(row, "workstream")),
      priority: isPriority(col(row, "priority")) ? (col(row, "priority") as MgmtPriority) : "normal",
      scope: col(row, "scopeText"),
      hotelApprover: col(row, "hotelApprover"),
      nextAction: col(row, "nextAction"),
      nextActionAt: iso(row.nextActionAt as Date | string | null),
      kpiCadence: normalizeCadence(col(row, "kpiCadence")),
      dataStatus: asKpiStatus(col(row, "dataStatus")),
      createdAt: iso(row.createdAt as Date | string | null),
      updatedAt: iso(row.updatedAt as Date | string | null),
      notes: col(row, "notes"),
      primaryKpi: col(row, "primaryKpi"),
      kpiTarget: col(row, "kpiTarget"),
      handoverStatus: normalizeReadiness(col(row, "handoverStatus")),
      privateMasked: !access.canSeePrivateIds,
      commercial: asSection(parseJson(row.commercialJson, parseJson(row.bookingJson, emptySectionBlock()))),
      marketingBlock: asSection(parseJson(row.marketingJson, parseJson(row.discoveryJson, emptySectionBlock()))),
      distributionBlock: asSection(parseJson(row.distributionJson, parseJson(row.cmsJson, emptySectionBlock()))),
      operations: asSection(parseJson(row.operationsJson, parseJson(row.uxJson, emptySectionBlock()))),
      guest: asSection(parseJson(row.guestJson, parseJson(row.trackingJson, emptySectionBlock()))),
      people: asPeople(parseJson(row.peopleJson, [])),
      assessments,
      plans,
      meetings,
      actionLogs: asActionLogs(parseJson(row.actionLogsJson, []), subtasks, hotelName),
      qa: qaItems.length ? qaItems : defaultQa(),
      handover: handoverItems.length ? handoverItems : defaultHandover(),
      fileNotes: asFileNotes(parseJson(row.filesJson, [])),
      approvals,
      sources: sourceRows
        .filter((item) => col(item, "propertyId") === col(row, "id"))
        .map(
          (item): MgmtSourceView => ({
            id: col(item, "id"),
            name: col(item, "name"),
            url: col(item, "url"),
            publishedAt: col(item, "publishedAt"),
            accessedAt: col(item, "accessedAt"),
            notes: col(item, "notes"),
          }),
        ),
      kpis,
      history: auditRows
        .filter((item) => col(item, "propertyId") === col(row, "id"))
        .slice(0, 40)
        .map(
          (item): MgmtAuditView => ({
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
      dueDate: "",
    };
    mapped.dueDate = earliestDueDate(mapped);
    return mapped;
  });

  if (!access.isManagement) {
    items = items.filter((item) => access.departments.includes(item.department));
  }
  if (section === "approvals") {
    items = items.filter(
      (item) =>
        item.approvals.some((entry) => entry.status === "awaiting" || entry.status === "changes_requested") ||
        item.status === "awaiting_approval" ||
        item.assessments.some((entry) => entry.approvalStatus === "awaiting" || entry.approvalStatus === "changes_requested") ||
        item.plans.some((entry) => entry.approvalStatus === "awaiting" || entry.approvalStatus === "changes_requested"),
    );
  }
  if (section === "marketing") items = items.filter((item) => item.department === "marketing" || item.workstream === "marketing");
  if (section === "commercial") items = items.filter((item) => item.department === "revenue" || item.department === "sales" || item.workstream === "commercial");
  if (section === "distribution") items = items.filter((item) => item.department === "distribution" || item.workstream === "distribution");
  if (filters.status && normalizeStatus(filters.status) === filters.status) {
    items = items.filter((item) => item.status === filters.status);
  }
  if (filters.ownerId) items = items.filter((item) => item.ownerId === filters.ownerId);
  if (filters.department) items = items.filter((item) => item.department === filters.department);
  if (filters.hotel) items = items.filter((item) => item.hotelName === filters.hotel);
  if (filters.workstream) items = items.filter((item) => item.workstream === filters.workstream);
  if (filters.projectType) items = items.filter((item) => item.propertyType === filters.projectType);
  if (filters.market) items = items.filter((item) => item.locationMarket === filters.market);
  if (filters.cadence) items = items.filter((item) => item.kpiCadence === filters.cadence);
  if (filters.priority && isPriority(filters.priority)) items = items.filter((item) => item.priority === filters.priority);
  if (query) {
    items = items.filter((item) =>
      `${item.projectName} ${item.hotelName} ${item.locationMarket} ${item.nextAction} ${item.notes} ${item.primaryGoal} ${item.mainChallenge} ${item.scope} ${item.assessments.map((entry) => entry.question).join(" ")} ${item.actionLogs.map((entry) => entry.name).join(" ")}`
        .toLowerCase()
        .includes(query),
    );
  }

  const groupBy: MgmtGroupBy = isGroupBy(filters.group || "") ? (filters.group as MgmtGroupBy) : "status";
  const sort: MgmtSort = isSort(filters.sort || "") ? (filters.sort as MgmtSort) : "nextActionAt";
  items.sort((a, b) => {
    if (sort === "priority") return MGMT_PRIORITY_RANK[a.priority] - MGMT_PRIORITY_RANK[b.priority];
    if (sort === "dueDate") return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
    if (sort === "updatedAt") return (b.updatedAt || "").localeCompare(a.updatedAt || "");
    return (a.nextActionAt || "9999").localeCompare(b.nextActionAt || "9999");
  });

  return {
    access,
    items,
    staff,
    facets: {
      hotels: Array.from(new Set(items.map((item) => item.hotelName).filter(Boolean))),
      markets: Array.from(new Set(items.map((item) => item.locationMarket).filter(Boolean))),
    },
    groupBy,
    sort,
  };
}

export async function writeAudit(propertyId: string, userId: string, action: string, detail: string) {
  await prisma().$executeRawUnsafe(
    `INSERT INTO ManagementAuditEvent (id, propertyId, action, detail, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, NOW(3))`,
    `wa_${randomToken(10)}`,
    propertyId,
    action,
    detail,
    userId,
  );
}

export async function createManagementProject(access: MgmtAccessView, hotelName: string, workstream?: string) {
  const id = `web_${randomToken(10)}`;
  const stream = workstream ? normalizeWorkstream(workstream) : "properties";
  await prisma().$executeRawUnsafe(
    `INSERT INTO ManagementProject (id, hotelName, workstream, status, department, priority, nextAction, notes, ownerId, createdBy, updatedBy, createdAt, updatedAt)
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
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM ManagementSubtask WHERE propertyId = ?`, propertyId)
    .catch(() => [{ count: 0 }]);
  if (Number(existing[0]?.count || 0) > 0) return;
  for (const [index, item] of MGMT_STARTER_SUBTASKS.entries()) {
    await prisma().$executeRawUnsafe(
      `INSERT INTO ManagementSubtask (id, propertyId, name, department, ownerId, status, completed, dueAt, priority, comments, source, sortOrder, createdBy, createdAt, updatedAt)
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

export async function countManagementSubtasks(propertyId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM ManagementSubtask WHERE propertyId = ?`, propertyId)
    .catch(() => [{ count: 0 }]);
  return Number(rows[0]?.count || 0);
}

export async function getManagementSubtask(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ManagementSubtask WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function insertManagementSubtask(data: {
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
  const sort = (await countManagementSubtasks(data.propertyId)) + 1;
  await prisma().$executeRawUnsafe(
    `INSERT INTO ManagementSubtask (id, propertyId, name, department, ownerId, status, completed, dueAt, priority, comments, source, sortOrder, createdBy, createdAt, updatedAt)
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

export async function updateManagementSubtask(
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
    `UPDATE ManagementSubtask SET name=?, department=?, ownerId=?, status=?, completed=?, dueAt=?, priority=?, comments=?, source=?, updatedAt=NOW(3) WHERE id=?`,
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

export async function insertManagementSubtaskComment(subtaskId: string, authorId: string, body: string) {
  const id = `wsc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO ManagementSubtaskComment (id, subtaskId, authorId, body, createdAt) VALUES (?, ?, ?, ?, NOW(3))`,
    id,
    subtaskId,
    authorId,
    body,
  );
  return id;
}

export async function insertManagementSubtaskFile(data: {
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
    `INSERT INTO ManagementSubtaskFile (id, subtaskId, filename, mime, size, path, caption, createdBy, createdAt)
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

export async function getManagementSubtaskFile(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ManagementSubtaskFile WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function replaceKpis(propertyId: string, items: MgmtKpiView[]) {
  const previous = await prisma()
    .$queryRawUnsafe<Array<{ id: string; value: string }>>(`SELECT id, value FROM ManagementKpiEntry WHERE propertyId = ?`, propertyId)
    .catch(() => []);
  const previousValues = new Map(previous.map((item) => [item.id, item.value]));
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementKpiEntry WHERE propertyId = ?`, propertyId);
  for (const item of items) {
    const value = item.value === MASKED_VALUE ? previousValues.get(item.id) || "" : item.value;
    await prisma().$executeRawUnsafe(
      `INSERT INTO ManagementKpiEntry (id, propertyId, name, period, value, definition, source, dataStatus, market, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3))`,
      item.id || `wkpi_${randomToken(8)}`,
      propertyId,
      item.name,
      item.period,
      value,
      item.definition,
      item.source,
      item.dataStatus,
      item.market,
    );
    await prisma()
      .$executeRawUnsafe(
        `UPDATE ManagementKpiEntry SET area=?, kpiOwner=?, targetValue=?, kpiNotes=?, updatedAt=NOW(3) WHERE id=?`,
        item.area || "commercial",
        item.owner || "",
        item.target || "",
        item.notes || "",
        item.id,
      )
      .catch(() => undefined);
  }
}

export async function replaceSources(propertyId: string, items: MgmtSourceView[]) {
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementSource WHERE propertyId = ?`, propertyId);
  for (const item of items) {
    await prisma().$executeRawUnsafe(
      `INSERT INTO ManagementSource (id, propertyId, name, url, publishedAt, accessedAt, notes, createdAt)
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

export async function saveManagementProject(
  id: string,
  data: Record<string, string | null | undefined>,
  userId: string,
  canSeePrivateIds: boolean,
) {
  const existing = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ManagementProject WHERE id = ? LIMIT 1`, id);
  const row = existing[0];
  if (!row) return false;
  const engineRef = canSeePrivateIds ? data.engineAccountRef ?? col(row, "engineAccountRef") : col(row, "engineAccountRef");
  const analyticsRef = canSeePrivateIds ? data.analyticsRef ?? col(row, "analyticsRef") : col(row, "analyticsRef");
  const pick = (key: string) => (data[key] !== undefined ? data[key] : col(row, key));
  await prisma().$executeRawUnsafe(
    `UPDATE ManagementProject SET
      projectName=?, hotelName=?, projectType=?, propertyType=?, roomCount=?, locationMarket=?, hotelOperatingStatus=?,
      primaryGoal=?, mainChallenge=?, targetMarket=?, startDate=?, launchDate=?,
      status=?, ownerId=?, department=?, workstream=?, priority=?, scopeText=?, nextAction=?, nextActionAt=?, notes=?,
      primaryKpi=?, kpiTarget=?, hotelApprover=?, kpiCadence=?, dataStatus=?, handoverStatus=?,
      qaJson=?, handoverJson=?, filesJson=?, approvalsJson=?, assessmentsJson=?, plansJson=?, meetingsJson=?,
      actionLogsJson=?, peopleJson=?, commercialJson=?, marketingJson=?, distributionJson=?, operationsJson=?, guestJson=?,
      engineAccountRef=?, analyticsRef=?,
      updatedBy=?, updatedAt=NOW(3)
     WHERE id=?`,
    pick("projectName") || pick("hotelName"),
    pick("hotelName"),
    pick("projectType") || pick("propertyType"),
    pick("propertyType") || pick("projectType"),
    pick("roomCount"),
    pick("locationMarket") || pick("targetMarket"),
    pick("hotelOperatingStatus") || pick("hotelStatus"),
    pick("primaryGoal"),
    pick("mainChallenge"),
    pick("locationMarket") || pick("targetMarket"),
    data.startDate !== undefined ? data.startDate || null : (row.startDate as string | null),
    data.launchDate !== undefined ? data.launchDate || null : (row.launchDate as string | null),
    pick("status"),
    pick("ownerId"),
    pick("department"),
    pick("workstream"),
    pick("priority"),
    pick("scopeText") || pick("scope"),
    pick("nextAction"),
    data.nextActionAt !== undefined ? data.nextActionAt || null : (row.nextActionAt as string | null),
    pick("notes"),
    pick("primaryKpi"),
    pick("kpiTarget"),
    pick("hotelApprover"),
    pick("kpiCadence"),
    pick("dataStatus"),
    pick("handoverStatus"),
    data.qaJson ?? col(row, "qaJson"),
    data.handoverJson ?? col(row, "handoverJson"),
    data.filesJson ?? col(row, "filesJson"),
    data.approvalsJson ?? col(row, "approvalsJson"),
    data.assessmentsJson ?? col(row, "assessmentsJson"),
    data.plansJson ?? col(row, "plansJson"),
    data.meetingsJson ?? col(row, "meetingsJson"),
    data.actionLogsJson ?? col(row, "actionLogsJson"),
    data.peopleJson ?? col(row, "peopleJson"),
    data.commercialJson ?? col(row, "commercialJson"),
    data.marketingJson ?? col(row, "marketingJson"),
    data.distributionJson ?? col(row, "distributionJson"),
    data.operationsJson ?? col(row, "operationsJson"),
    data.guestJson ?? col(row, "guestJson"),
    engineRef,
    analyticsRef,
    userId,
    id,
  );
  return true;
}

export async function patchManagementProject(id: string, data: Record<string, string | null | undefined>, userId: string) {
  return saveManagementProject(id, data, userId, true);
}

export async function getManagementProject(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM ManagementProject WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function appendManagementApproval(
  propertyId: string,
  item: { kind: string; status: string; notes: string; requestedBy: string; decidedBy?: string },
) {
  const row = await getManagementProject(propertyId);
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
    `UPDATE ManagementProject SET approvalsJson=?, updatedAt=NOW(3) WHERE id=?`,
    JSON.stringify(approvals),
    propertyId,
  );
  return true;
}

export async function deleteManagementSubtask(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementSubtaskFile WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementSubtaskComment WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementSubtask WHERE id = ?`, id);
}

export async function deleteManagementProject(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementSubtaskFile WHERE subtaskId IN (SELECT id FROM ManagementSubtask WHERE propertyId = ?)`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementSubtaskComment WHERE subtaskId IN (SELECT id FROM ManagementSubtask WHERE propertyId = ?)`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementSubtask WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementSource WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementKpiEntry WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementAuditEvent WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementProject WHERE id = ?`, id);
}

export async function listManagementAccessRows() {
  await ensureManagementSchema();
  const [rows, staff] = await Promise.all([
    prisma().$queryRawUnsafe<Array<{ id: string; userId: string; department: string; canSeePrivateIds: number | boolean }>>(
      `SELECT id, userId, department, canSeePrivateIds FROM ManagementAccess ORDER BY createdAt DESC`,
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

export async function saveManagementAccessRow(userId: string, department: string, canSeePrivateIds: boolean) {
  const id = `wacc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO ManagementAccess (id, userId, department, canSeePrivateIds, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    userId,
    department,
    canSeePrivateIds ? 1 : 0,
  );
  return id;
}

export async function deleteManagementAccessRow(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM ManagementAccess WHERE id = ?`, id);
}
