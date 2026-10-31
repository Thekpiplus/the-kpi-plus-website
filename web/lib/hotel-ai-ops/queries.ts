import { prisma } from "@/lib/crm/db";
import { randomToken } from "@/lib/crm/security";
import { staffDirectory } from "@/lib/crm/queries";
import { hotelAiAccessFor } from "./access";
import { ensureHotelAiOpsSchema } from "./ensure";
import { haiSubtaskProgress } from "./progress";
import {
  HAI_STARTER_SUBTASKS,
  MASKED_VALUE,
  MAX_HAI_SUBTASKS,
  emptyPilotCharter,
  isApprovalStatus,
  isDataClass,
  isGroupBy,
  isIssueStatus,
  isPilotDecision,
  isPriority,
  isRisk,
  isSopStatus,
  isSort,
  isTestStatus,
  normalizeApproach,
  normalizeApprovalStatus,
  normalizeDataClass,
  normalizeIssueStatus,
  normalizePilotDecision,
  normalizePriority,
  normalizeRisk,
  normalizeSopStatus,
  normalizeStatus,
  normalizeGateKind,
  normalizeSubtaskStatus,
  normalizeTestStatus,
  payloadHasSecrets,
  pilotPhaseFor,
  type HaiAccessView,
  type HaiApprovalView,
  type HaiAuditView,
  type HaiDataAccessRow,
  type HaiExtraDepartment,
  type HaiHandoverRow,
  type HaiIssueRow,
  type HaiGroupBy,
  type HaiListFilters,
  type HaiMetricRow,
  type HaiSort,
  type HaiPilotCharter,
  type HaiSection,
  type HaiSettings,
  type HaiSubtaskCommentView,
  type HaiSubtaskView,
  type HaiTestCaseRow,
  type HaiUseCaseRow,
  type HaiWorkflowRow,
} from "./types";

function col(row: Record<string, unknown>, key: string) {
  const value = row[key];
  if (value == null) return "";
  return String(value);
}

function iso(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string") return (value as T) ?? fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function asCharter(value: unknown): HaiPilotCharter {
  const raw = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const empty = emptyPilotCharter();
  return {
    scope: String(raw.scope ?? ""),
    baselinePeriod: String(raw.baselinePeriod ?? ""),
    baselineMethod: String(raw.baselineMethod ?? ""),
    approvedDataSources: String(raw.approvedDataSources ?? ""),
    prohibitedData: String(raw.prohibitedData ?? empty.prohibitedData),
    pilotUsers: String(raw.pilotUsers ?? ""),
    successCriteria: String(raw.successCriteria ?? ""),
    qualityThreshold: String(raw.qualityThreshold ?? ""),
    errorStopThreshold: String(raw.errorStopThreshold ?? ""),
    humanReviewRule: String(raw.humanReviewRule ?? ""),
    fallbackPlan: String(raw.fallbackPlan ?? ""),
    startDate: String(raw.startDate ?? ""),
    endDate: String(raw.endDate ?? ""),
    reviewDate: String(raw.reviewDate ?? ""),
    decision: isPilotDecision(String(raw.decision ?? "")) ? normalizePilotDecision(String(raw.decision)) : "pending",
    decisionOwner: String(raw.decisionOwner ?? ""),
    approvalStatus: isApprovalStatus(String(raw.approvalStatus ?? ""))
      ? normalizeApprovalStatus(String(raw.approvalStatus))
      : "not_requested",
  };
}

function asUseCases(value: unknown): HaiUseCaseRow[] {
  return (Array.isArray(value) ? value : []).map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: String(row.id || `uc_${index}`),
      title: String(row.title ?? row.name ?? ""),
      actor: String(row.actor ?? ""),
      trigger: String(row.trigger ?? ""),
      outcome: String(row.outcome ?? ""),
      notes: String(row.notes ?? ""),
    };
  });
}

function asDataAccess(value: unknown): HaiDataAccessRow[] {
  return (Array.isArray(value) ? value : []).map((item, index) => {
    const row = item as Record<string, unknown>;
    const classification = String(row.classification ?? "internal");
    return {
      id: String(row.id || `da_${index}`),
      system: String(row.system ?? ""),
      dataType: String(row.dataType ?? ""),
      classification: isDataClass(classification) ? classification : "internal",
      accessNeeded: String(row.accessNeeded ?? ""),
      owner: String(row.owner ?? ""),
      approved: Boolean(row.approved),
      notes: String(row.notes ?? ""),
    };
  });
}

function asTests(value: unknown): HaiTestCaseRow[] {
  return (Array.isArray(value) ? value : []).map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: String(row.id || `tc_${index}`),
      name: String(row.name ?? row.testCase ?? ""),
      trigger: String(row.trigger ?? ""),
      expected: String(row.expected ?? ""),
      actual: String(row.actual ?? ""),
      status: isTestStatus(String(row.status ?? "")) ? normalizeTestStatus(String(row.status)) : "not_started",
      owner: String(row.owner ?? ""),
      evidence: String(row.evidence ?? ""),
      notes: String(row.notes ?? ""),
    };
  });
}

function asIssues(value: unknown): HaiIssueRow[] {
  return (Array.isArray(value) ? value : []).map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: String(row.id || `iss_${index}`),
      title: String(row.title ?? row.issue ?? ""),
      exception: String(row.exception ?? ""),
      owner: String(row.owner ?? ""),
      status: isIssueStatus(String(row.status ?? "")) ? normalizeIssueStatus(String(row.status)) : "open",
      risk: isRisk(String(row.risk ?? "")) ? normalizeRisk(String(row.risk)) : "medium",
      dueAt: String(row.dueAt ?? ""),
      evidence: String(row.evidence ?? ""),
      notes: String(row.notes ?? ""),
    };
  });
}

function asMetrics(value: unknown): HaiMetricRow[] {
  return (Array.isArray(value) ? value : []).map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: String(row.id || `kpi_${index}`),
      name: String(row.name ?? ""),
      baseline: String(row.baseline ?? ""),
      target: String(row.target ?? ""),
      actual: String(row.actual ?? ""),
      period: String(row.period ?? ""),
      notes: String(row.notes ?? ""),
    };
  });
}

function asHandover(value: unknown): HaiHandoverRow[] {
  return (Array.isArray(value) ? value : []).map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: String(row.id || `ho_${index}`),
      asset: String(row.asset ?? ""),
      owner: String(row.owner ?? ""),
      sopStatus: isSopStatus(String(row.sopStatus ?? "")) ? normalizeSopStatus(String(row.sopStatus)) : "not_started",
      trainingStatus: isSopStatus(String(row.trainingStatus ?? "")) ? normalizeSopStatus(String(row.trainingStatus)) : "not_started",
      notes: String(row.notes ?? ""),
    };
  });
}

function asApprovals(value: unknown): HaiApprovalView[] {
  return (Array.isArray(value) ? value : []).map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: String(row.id || `ap_${index}`),
      kind: String(row.kind ?? ""),
      status: isApprovalStatus(String(row.status ?? "")) ? normalizeApprovalStatus(String(row.status)) : "not_requested",
      notes: String(row.notes ?? ""),
      requestedBy: String(row.requestedBy ?? ""),
      decidedBy: String(row.decidedBy ?? ""),
      createdAt: String(row.createdAt ?? ""),
    };
  });
}

function asComments(value: unknown): HaiSubtaskCommentView[] {
  return (Array.isArray(value) ? value : []).map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: String(row.id || `c_${index}`),
      authorId: String(row.authorId ?? ""),
      authorName: String(row.authorName ?? ""),
      body: String(row.body ?? ""),
      createdAt: String(row.createdAt ?? ""),
    };
  });
}

export async function getHotelAiSettings(): Promise<HaiSettings> {
  await ensureHotelAiOpsSchema();
  const rows = await prisma()
    .$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM HotelAiSettings WHERE id = 'default' LIMIT 1`)
    .catch(() => []);
  const row = rows[0];
  if (!row) {
    return { extraDepartments: [], secretVaultLabel: "", secretVaultUrl: "" };
  }
  const extras = parseJson<HaiExtraDepartment[]>(row.extraDepartmentsJson, []).filter((item) => item?.id && item?.label);
  return {
    extraDepartments: extras,
    secretVaultLabel: col(row, "secretVaultLabel"),
    secretVaultUrl: col(row, "secretVaultUrl"),
  };
}

export async function saveHotelAiSettingsRow(data: HaiSettings, userId: string) {
  await ensureHotelAiOpsSchema();
  const extras = data.extraDepartments
    .map((item) => ({
      id: item.id.trim().toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
      label: item.label.trim(),
    }))
    .filter((item) => item.id && item.label);
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelAiSettings (id, extraDepartmentsJson, secretVaultLabel, secretVaultUrl, updatedBy, updatedAt)
     VALUES ('default', ?, ?, ?, ?, NOW(3))
     ON DUPLICATE KEY UPDATE extraDepartmentsJson=VALUES(extraDepartmentsJson), secretVaultLabel=VALUES(secretVaultLabel), secretVaultUrl=VALUES(secretVaultUrl), updatedBy=VALUES(updatedBy), updatedAt=NOW(3)`,
    JSON.stringify(extras),
    data.secretVaultLabel,
    data.secretVaultUrl,
    userId,
  );
}

export async function listHotelAiWorkflows(
  user: { id: string; role: string; modules?: string | null },
  filters: HaiListFilters,
  section: HaiSection,
) {
  await ensureHotelAiOpsSchema();
  const access = await hotelAiAccessFor(user);
  const settings = await getHotelAiSettings();
  const db = prisma();
  const [rows, staff, auditRows, subtaskRows, commentRows] = await Promise.all([
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM HotelAiWorkflow ORDER BY updatedAt DESC`),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string }>),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM HotelAiAudit ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM HotelAiSubtask ORDER BY sortOrder ASC, createdAt ASC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM HotelAiSubtaskComment ORDER BY createdAt ASC`).catch(() => []),
  ]);
  const names = new Map(staff.map((item) => [item.id, item.name]));
  const query = filters.q?.trim().toLowerCase() || "";
  const showArchived = filters.archived === "1" || filters.status === "stopped";

  let items: HaiWorkflowRow[] = rows.map((row) => {
    const ownerId = col(row, "ownerId");
    const status = normalizeStatus(col(row, "status"));
    const subtasks: HaiSubtaskView[] = subtaskRows
      .filter((item) => col(item, "workflowId") === col(row, "id"))
      .map((item): HaiSubtaskView => {
        const subOwner = col(item, "ownerId");
        const reviewerId = col(item, "reviewerId");
        const name = col(item, "name");
        const department = col(item, "department") || "operations";
        return {
          id: col(item, "id"),
          workflowId: col(item, "workflowId"),
          name,
          department,
          ownerId: subOwner,
          ownerName: names.get(subOwner) || "",
          reviewerId,
          reviewerName: names.get(reviewerId) || "",
          status: normalizeSubtaskStatus(col(item, "status")),
          completed: Boolean(item.completed) || col(item, "status") === "completed",
          dueAt: iso(item.dueAt as Date | string | null),
          priority: isPriority(col(item, "priority")) ? col(item, "priority") as HaiWorkflowRow["priority"] : "normal",
          comments: col(item, "comments"),
          evidence: col(item, "evidence"),
          gateKind: normalizeGateKind(col(item, "gateKind"), name, department),
          thread: commentRows
            .filter((comment) => col(comment, "subtaskId") === col(item, "id"))
            .map(
              (comment): HaiSubtaskCommentView => ({
                id: col(comment, "id"),
                authorId: col(comment, "authorId"),
                authorName: names.get(col(comment, "authorId")) || "",
                body: col(comment, "body"),
                createdAt: iso(comment.createdAt as Date | string | null),
              }),
            ),
        };
      });
    const approvals = asApprovals(parseJson(row.approvalsJson, []));
    const comments = asComments(parseJson(row.commentsJson, [])).map((item) => ({
      ...item,
      authorName: item.authorName || names.get(item.authorId) || "",
    }));
    const progress = haiSubtaskProgress(subtasks, status, approvals);
    const displayStatus = progress.blockedByGate && status !== "stopped" && status !== "handed_over" ? "blocked" : status;
    const mapped: HaiWorkflowRow = {
      id: col(row, "id"),
      name: col(row, "name") || col(row, "hotelName"),
      hotelName: col(row, "hotelName"),
      department: col(row, "department") || "operations",
      ownerId,
      ownerName: names.get(ownerId) || "",
      problem: col(row, "problem"),
      currentProcess: col(row, "currentProcess"),
      frequency: col(row, "frequency"),
      systems: col(row, "systems"),
      dataClass: normalizeDataClass(col(row, "dataClass")),
      sourceOfTruth: col(row, "sourceOfTruth"),
      manualSteps: col(row, "manualSteps"),
      exceptions: col(row, "exceptions"),
      userImpact: col(row, "userImpact"),
      objective: col(row, "objective"),
      status: displayStatus,
      priority: isPriority(col(row, "priority")) ? (col(row, "priority") as HaiWorkflowRow["priority"]) : "normal",
      approach: normalizeApproach(col(row, "approach")),
      reviewer: col(row, "reviewer"),
      fallback: col(row, "fallback"),
      risk: normalizeRisk(col(row, "risk")),
      nextAction: col(row, "nextAction"),
      nextActionAt: iso(row.nextActionAt as Date | string | null),
      vaultRef: col(row, "vaultRef"),
      notes: col(row, "notes"),
      archived: Boolean(row.archived),
      createdAt: iso(row.createdAt as Date | string | null),
      updatedAt: iso(row.updatedAt as Date | string | null),
      charter: asCharter(parseJson(row.charterJson, emptyPilotCharter())),
      useCases: asUseCases(parseJson(row.useCasesJson, [])),
      dataAccess: asDataAccess(parseJson(row.accessJson, [])),
      tests: asTests(parseJson(row.testsJson, [])),
      issues: asIssues(parseJson(row.issuesJson, [])),
      metrics: asMetrics(parseJson(row.metricsJson, [])),
      handover: asHandover(parseJson(row.handoverJson, [])),
      approvals,
      comments,
      history: auditRows
        .filter((item) => col(item, "workflowId") === col(row, "id"))
        .slice(0, 40)
        .map(
          (item): HaiAuditView => ({
            id: col(item, "id"),
            action: col(item, "action"),
            detail: col(item, "detail"),
            createdBy: col(item, "createdBy"),
            createdByName: names.get(col(item, "createdBy")) || "",
            createdAt: iso(item.createdAt as Date | string | null),
          }),
        ),
      subtasks,
      progress,
      pilotPhase: pilotPhaseFor(displayStatus),
    };
    return mapped;
  });

  if (!access.isManagement) {
    items = items.filter((item) => access.departments.includes(item.department));
  }
  if (!showArchived) items = items.filter((item) => !item.archived);
  if (section === "backlog") items = items.filter((item) => item.status === "backlog" || item.status === "discovery");
  if (section === "pilots") {
    items = items.filter((item) =>
      ["ready_for_pilot", "pilot_running", "needs_review", "approved_to_scale", "adjust", "stopped"].includes(item.status),
    );
  }
  if (section === "approvals") {
    items = items.filter(
      (item) =>
        item.status === "needs_review" ||
        item.charter.approvalStatus === "awaiting" ||
        item.approvals.some((entry) => entry.status === "awaiting" || entry.status === "changes_requested"),
    );
  }
  if (section === "tests") items = items.filter((item) => item.tests.length > 0 || item.status === "pilot_running");
  if (section === "issues") {
    items = items.filter((item) => item.issues.length > 0 || item.status === "blocked" || Boolean(item.exceptions));
  }
  if (section === "metrics") items = items.filter((item) => item.metrics.length > 0 || item.pilotPhase !== "not_started");
  if (section === "handover") items = items.filter((item) => item.handover.length > 0 || item.status === "handed_over" || item.status === "approved_to_scale");
  if (filters.status && normalizeStatus(filters.status) === filters.status) {
    items = items.filter((item) => item.status === filters.status);
  }
  if (filters.ownerId) items = items.filter((item) => item.ownerId === filters.ownerId);
  if (filters.department) items = items.filter((item) => item.department === filters.department);
  if (filters.hotel) items = items.filter((item) => item.hotelName === filters.hotel);
  if (filters.risk) items = items.filter((item) => item.risk === filters.risk);
  if (filters.approach) items = items.filter((item) => item.approach === filters.approach);
  if (query) {
    items = items.filter((item) =>
      `${item.name} ${item.hotelName} ${item.ownerName} ${item.problem} ${item.objective} ${item.nextAction} ${item.systems} ${item.notes}`
        .toLowerCase()
        .includes(query),
    );
  }

  const groupBy: HaiGroupBy = isGroupBy(filters.group || "") ? (filters.group as HaiGroupBy) : "status";
  const sort: HaiSort = isSort(filters.sort || "") ? (filters.sort as HaiSort) : "updated";
  items.sort((a, b) => {
    if (sort === "priority") return (HAI_PRIORITY_RANK_SAFE[a.priority] ?? 9) - (HAI_PRIORITY_RANK_SAFE[b.priority] ?? 9);
    if (sort === "risk") return (HAI_RISK_RANK_SAFE[a.risk] ?? 9) - (HAI_RISK_RANK_SAFE[b.risk] ?? 9);
    if (sort === "due") return (a.nextActionAt || "9999").localeCompare(b.nextActionAt || "9999");
    return (b.updatedAt || "").localeCompare(a.updatedAt || "");
  });

  return {
    access,
    settings,
    items,
    staff,
    facets: {
      hotels: Array.from(new Set(items.map((item) => item.hotelName).filter(Boolean))),
      owners: Array.from(new Set(items.map((item) => item.ownerId).filter(Boolean))),
    },
    groupBy,
    sort,
  };
}

const HAI_PRIORITY_RANK_SAFE: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
const HAI_RISK_RANK_SAFE: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export async function writeAudit(workflowId: string, userId: string, action: string, detail: string) {
  if (payloadHasSecrets(detail)) return;
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelAiAudit (id, workflowId, action, detail, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, NOW(3))`,
    `haa_${randomToken(10)}`,
    workflowId,
    action,
    detail,
    userId,
  );
}

export async function createHotelAiWorkflow(access: HaiAccessView, name: string, department?: string) {
  const id = `hai_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelAiWorkflow (id, name, hotelName, department, status, priority, nextAction, notes, ownerId, createdBy, updatedBy, createdAt, updatedAt)
     VALUES (?, ?, '', ?, 'backlog', 'normal', '', '', ?, ?, ?, NOW(3), NOW(3))`,
    id,
    name,
    department || "operations",
    access.userId,
    access.userId,
    access.userId,
  );
  await writeAudit(id, access.userId, "create", `Created ${name}`);
  await seedStarterSubtasks(id, access.userId, department || "operations");
  return id;
}

export async function seedStarterSubtasks(workflowId: string, userId: string, department = "operations") {
  const existing = await prisma()
    .$queryRawUnsafe<Array<{ name: string; department: string }>>(`SELECT name, department FROM HotelAiSubtask WHERE workflowId = ?`, workflowId)
    .catch(() => [] as Array<{ name: string; department: string }>);
  if (existing.length) return;
  const starters = HAI_STARTER_SUBTASKS.filter((item) => item.department === department).slice(0, MAX_HAI_SUBTASKS);
  let sort = 0;
  for (const item of starters) {
    sort += 1;
    try {
      await prisma().$executeRawUnsafe(
        `INSERT INTO HotelAiSubtask (id, workflowId, name, department, ownerId, reviewerId, status, completed, dueAt, priority, comments, evidence, gateKind, sortOrder, createdBy, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, '', 'not_started', 0, NULL, 'normal', '', '', ?, ?, ?, NOW(3), NOW(3))`,
        `hst_${randomToken(10)}`,
        workflowId,
        item.name,
        item.department,
        userId,
        item.gateKind,
        sort,
        userId,
      );
    } catch {
      /* skip if the row already exists */
    }
  }
}

export async function countHotelAiSubtasks(workflowId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM HotelAiSubtask WHERE workflowId = ?`, workflowId)
    .catch(() => [{ count: 0 }]);
  return Number(rows[0]?.count || 0);
}

export async function countHotelAiSubtasksForDepartment(workflowId: string, department: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ count: number }>>(
      `SELECT COUNT(*) AS count FROM HotelAiSubtask WHERE workflowId = ? AND department = ?`,
      workflowId,
      department,
    )
    .catch(() => [{ count: 0 }]);
  return Number(rows[0]?.count || 0);
}

export async function getHotelAiSubtask(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM HotelAiSubtask WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function insertHotelAiSubtask(data: {
  workflowId: string;
  name: string;
  department: string;
  ownerId: string;
  reviewerId: string;
  status: string;
  completed: boolean;
  dueAt: string | null;
  priority: string;
  comments: string;
  evidence: string;
  gateKind: string;
  userId: string;
}) {
  const id = `hst_${randomToken(10)}`;
  const sort = (await countHotelAiSubtasks(data.workflowId)) + 1;
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelAiSubtask (id, workflowId, name, department, ownerId, reviewerId, status, completed, dueAt, priority, comments, evidence, gateKind, sortOrder, createdBy, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    data.workflowId,
    data.name,
    data.department,
    data.ownerId,
    data.reviewerId,
    data.status,
    data.completed ? 1 : 0,
    data.dueAt,
    data.priority,
    data.comments,
    data.evidence,
    data.gateKind,
    sort,
    data.userId,
  );
  return id;
}

export async function updateHotelAiSubtask(
  id: string,
  data: {
    name: string;
    department: string;
    ownerId: string;
    reviewerId: string;
    status: string;
    completed: boolean;
    dueAt: string | null;
    priority: string;
    comments: string;
    evidence: string;
    gateKind: string;
  },
) {
  await prisma().$executeRawUnsafe(
    `UPDATE HotelAiSubtask SET name=?, department=?, ownerId=?, reviewerId=?, status=?, completed=?, dueAt=?, priority=?, comments=?, evidence=?, gateKind=?, updatedAt=NOW(3) WHERE id=?`,
    data.name,
    data.department,
    data.ownerId,
    data.reviewerId,
    data.status,
    data.completed ? 1 : 0,
    data.dueAt,
    data.priority,
    data.comments,
    data.evidence,
    data.gateKind,
    id,
  );
}

export async function insertHotelAiSubtaskComment(subtaskId: string, authorId: string, body: string) {
  const id = `hsc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelAiSubtaskComment (id, subtaskId, authorId, body, createdAt) VALUES (?, ?, ?, ?, NOW(3))`,
    id,
    subtaskId,
    authorId,
    body,
  );
  return id;
}

export async function saveHotelAiWorkflow(id: string, data: Record<string, string | null | undefined>, userId: string) {
  const existing = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM HotelAiWorkflow WHERE id = ? LIMIT 1`, id);
  const row = existing[0];
  if (!row) return false;
  const pick = (key: string) => (data[key] !== undefined ? data[key] : col(row, key));
  const vaultRef = data.vaultRef === MASKED_VALUE ? col(row, "vaultRef") : pick("vaultRef");
  await prisma().$executeRawUnsafe(
    `UPDATE HotelAiWorkflow SET
      name=?, hotelName=?, department=?, ownerId=?, problem=?, currentProcess=?, frequency=?, systems=?, dataClass=?, sourceOfTruth=?,
      manualSteps=?, exceptions=?, userImpact=?, objective=?, status=?, priority=?, approach=?, reviewer=?, fallback=?, risk=?,
      nextAction=?, nextActionAt=?, vaultRef=?, notes=?, archived=?,
      charterJson=?, useCasesJson=?, accessJson=?, testsJson=?, issuesJson=?, metricsJson=?, handoverJson=?, approvalsJson=?, commentsJson=?,
      updatedBy=?, updatedAt=NOW(3)
     WHERE id=?`,
    pick("name") || pick("hotelName"),
    pick("hotelName"),
    pick("department"),
    pick("ownerId"),
    pick("problem"),
    pick("currentProcess"),
    pick("frequency"),
    pick("systems"),
    pick("dataClass"),
    pick("sourceOfTruth"),
    pick("manualSteps"),
    pick("exceptions"),
    pick("userImpact"),
    pick("objective"),
    pick("status"),
    pick("priority"),
    pick("approach"),
    pick("reviewer"),
    pick("fallback"),
    pick("risk"),
    pick("nextAction"),
    data.nextActionAt !== undefined ? data.nextActionAt || null : (row.nextActionAt as string | null),
    vaultRef,
    pick("notes"),
    data.archived !== undefined ? (data.archived === "1" ? 1 : 0) : row.archived ? 1 : 0,
    data.charterJson ?? col(row, "charterJson"),
    data.useCasesJson ?? col(row, "useCasesJson"),
    data.accessJson ?? col(row, "accessJson"),
    data.testsJson ?? col(row, "testsJson"),
    data.issuesJson ?? col(row, "issuesJson"),
    data.metricsJson ?? col(row, "metricsJson"),
    data.handoverJson ?? col(row, "handoverJson"),
    data.approvalsJson ?? col(row, "approvalsJson"),
    data.commentsJson ?? col(row, "commentsJson"),
    userId,
    id,
  );
  return true;
}

export async function patchHotelAiWorkflow(id: string, data: Record<string, string | null | undefined>, userId: string) {
  return saveHotelAiWorkflow(id, data, userId);
}

export async function getHotelAiWorkflow(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM HotelAiWorkflow WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function appendHotelAiApproval(
  workflowId: string,
  item: { kind: string; status: string; notes: string; requestedBy: string; decidedBy?: string },
) {
  const row = await getHotelAiWorkflow(workflowId);
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
    `UPDATE HotelAiWorkflow SET approvalsJson=?, updatedAt=NOW(3) WHERE id=?`,
    JSON.stringify(approvals),
    workflowId,
  );
  return true;
}

export async function applyHotelAiGateBlock(workflowId: string, userId: string) {
  const subtaskRows = await prisma()
    .$queryRawUnsafe<Array<{ status: string; gateKind: string; name: string; department: string }>>(
      `SELECT status, gateKind, name, department FROM HotelAiSubtask WHERE workflowId = ?`,
      workflowId,
    )
    .catch(() => []);
  const progress = haiSubtaskProgress(
    subtaskRows.map((item) => ({
      completed: item.status === "completed",
      status: item.status,
      gateKind: normalizeGateKind(item.gateKind, item.name, item.department),
      name: item.name,
    })),
  );
  if (!progress.blockedByGate) return false;
  const row = await getHotelAiWorkflow(workflowId);
  if (!row) return false;
  const status = normalizeStatus(col(row, "status"));
  if (status === "stopped" || status === "handed_over") return false;
  if (status === "blocked") return true;
  await prisma().$executeRawUnsafe(`UPDATE HotelAiWorkflow SET status='blocked', updatedBy=?, updatedAt=NOW(3) WHERE id=?`, userId, workflowId);
  await writeAudit(workflowId, userId, "status", `Status → blocked (${progress.gateReasons.join(", ")})`);
  return true;
}

export async function appendHotelAiIssue(
  workflowId: string,
  item: { title: string; exception: string; owner: string; notes: string },
) {
  const row = await getHotelAiWorkflow(workflowId);
  if (!row) return false;
  const issues = asIssues(parseJson(row.issuesJson, []));
  issues.unshift({
    id: `iss_${randomToken(8)}`,
    title: item.title,
    exception: item.exception,
    owner: item.owner,
    status: "open",
    risk: "high",
    dueAt: "",
    evidence: "",
    notes: item.notes,
  });
  await prisma().$executeRawUnsafe(
    `UPDATE HotelAiWorkflow SET issuesJson=?, status='blocked', updatedAt=NOW(3) WHERE id=?`,
    JSON.stringify(issues),
    workflowId,
  );
  return true;
}

export async function saveHotelAiCharterDecision(
  workflowId: string,
  data: { approvalStatus: string; decision: string; notes: string; userId: string; workflowStatus: string },
) {
  const row = await getHotelAiWorkflow(workflowId);
  if (!row) return false;
  const charter = asCharter(parseJson(row.charterJson, emptyPilotCharter()));
  charter.approvalStatus = normalizeApprovalStatus(data.approvalStatus);
  charter.decision = normalizePilotDecision(data.decision);
  charter.decisionOwner = data.userId;
  await prisma().$executeRawUnsafe(
    `UPDATE HotelAiWorkflow SET charterJson=?, status=?, updatedBy=?, updatedAt=NOW(3) WHERE id=?`,
    JSON.stringify(charter),
    data.workflowStatus,
    data.userId,
    workflowId,
  );
  return true;
}

export async function deleteHotelAiSubtask(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM HotelAiSubtaskComment WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM HotelAiSubtask WHERE id = ?`, id);
}

export async function deleteHotelAiWorkflow(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM HotelAiSubtaskComment WHERE subtaskId IN (SELECT id FROM HotelAiSubtask WHERE workflowId = ?)`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM HotelAiSubtask WHERE workflowId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM HotelAiAudit WHERE workflowId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM HotelAiWorkflow WHERE id = ?`, id);
}

export async function listHotelAiAccessRows() {
  await ensureHotelAiOpsSchema();
  const [rows, staff, settings] = await Promise.all([
    prisma()
      .$queryRawUnsafe<Array<{ id: string; userId: string; department: string; canSeePrivateIds: number | boolean }>>(
        `SELECT id, userId, department, canSeePrivateIds FROM HotelAiAccess ORDER BY createdAt DESC`,
      )
      .catch(() => []),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string; email?: string }>),
    getHotelAiSettings(),
  ]);
  return {
    rows: rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      department: row.department,
      canSeePrivateIds: Boolean(row.canSeePrivateIds),
    })),
    staff,
    settings,
  };
}

export async function saveHotelAiAccessRow(userId: string, department: string, canSeePrivateIds: boolean) {
  const id = `hacc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelAiAccess (id, userId, department, canSeePrivateIds, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    userId,
    department,
    canSeePrivateIds ? 1 : 0,
  );
  return id;
}

export async function deleteHotelAiAccessRow(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM HotelAiAccess WHERE id = ?`, id);
}

export async function hotelAiOpsOverview(user: { id: string; role: string; modules?: string | null }) {
  const { items } = await listHotelAiWorkflows(user, {}, "overview");
  return {
    total: items.length,
    pilots: items.filter((item) => item.status === "pilot_running" || item.status === "ready_for_pilot").length,
    review: items.filter((item) => item.status === "needs_review" || item.status === "blocked").length,
  };
}
