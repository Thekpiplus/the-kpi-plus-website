import { prisma } from "@/lib/crm/db";
import { staffDirectory } from "@/lib/crm/queries";
import { randomToken } from "@/lib/crm/security";
import { systemsAccessFor } from "./access";
import { ensureSystemsSchema } from "./ensure";
import { convSubtaskProgress } from "./progress";
import {
  MASKED_VALUE,
  SYS_DEFAULT_HANDOVER,
  SYS_DEFAULT_QA,
  SYS_RISK_RANK,
  SYS_SEVERITY_RANK,
  SYS_STARTER_SUBTASKS,
  earliestDueDate,
  emptySectionBlock,
  isApprovalStatus,
  isDepartment,
  isDirection,
  isDocStatus,
  isEnvironment,
  isFieldRequired,
  isGroupBy,
  isLicenseStatus,
  isPriority,
  isReadiness,
  isReadinessArea,
  isSort,
  normalizeCadence,
  normalizeHotelStatus,
  normalizeIntegrationStatus,
  normalizeIssueStatus,
  normalizeKpiArea,
  normalizeKpiDataStatus,
  normalizeMappingStatus,
  normalizeProjectType,
  normalizeReadiness,
  normalizeRisk,
  normalizeSeverity,
  normalizeStatus,
  normalizeSubtaskStatus,
  normalizeTestStatus,
  normalizeWorkstream,
  type SysAccessView,
  type SysApprovalView,
  type SysArchitectureRow,
  type SysAuditView,
  type SysChecklistItem,
  type SysDepartment,
  type SysFileNote,
  type SysGroupBy,
  type SysHandoverAsset,
  type SysInventoryRow,
  type SysIssueRow,
  type SysKpiView,
  type SysListFilters,
  type SysMappingRow,
  type SysPriority,
  type SysProjectRow,
  type SysReadiness,
  type SysReadinessRow,
  type SysSection,
  type SysSectionBlock,
  type SysSeverity,
  type SysSort,
  type SysSourceView,
  type SysSubtaskCommentView,
  type SysSubtaskFileView,
  type SysSubtaskView,
  type SysTestCaseRow,
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

function asReadiness(value: unknown): SysReadiness {
  return isReadiness(String(value ?? "")) ? (value as SysReadiness) : "not_started";
}

function asChecklist(value: unknown): SysChecklistItem[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as SysChecklistItem).id) || `chk_${index}`,
    label: text((item as SysChecklistItem).label),
    status: asReadiness((item as SysChecklistItem).status),
    notes: text((item as SysChecklistItem).notes),
    owner: text((item as SysChecklistItem).owner),
  }));
}

function asSection(value: unknown): SysSectionBlock {
  const raw = value && typeof value === "object" ? (value as Partial<SysSectionBlock>) : {};
  return {
    summary: text(raw.summary),
    owner: text(raw.owner),
    status: asReadiness(raw.status),
    notes: text(raw.notes),
    items: asChecklist(raw.items),
  };
}

function asInventory(value: unknown): SysInventoryRow[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: text(row.id) || `inv_${index}`,
      system: text(row.system) || text(row.name),
      provider: text(row.provider),
      purpose: text(row.purpose),
      owner: text(row.owner),
      dataIn: text(row.dataIn),
      dataOut: text(row.dataOut),
      apiConnector: text(row.apiConnector) || text(row.connector),
      environment: isEnvironment(text(row.environment)) ? (text(row.environment) as SysInventoryRow["environment"]) : "unknown",
      licenseStatus: isLicenseStatus(text(row.licenseStatus)) ? (text(row.licenseStatus) as SysInventoryRow["licenseStatus"]) : "unknown",
      integrationStatus: normalizeIntegrationStatus(text(row.integrationStatus) || text(row.status)),
      lastReviewed: text(row.lastReviewed),
      notes: text(row.notes),
    };
  });
}

function asArchitecture(value: unknown): SysArchitectureRow[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: text(row.id) || `arc_${index}`,
      node: text(row.node) || text(row.system),
      source: text(row.source),
      destination: text(row.destination),
      dataCategory: text(row.dataCategory) || text(row.category),
      direction: isDirection(text(row.direction)) ? (text(row.direction) as SysArchitectureRow["direction"]) : "bidirectional",
      frequency: text(row.frequency) || text(row.trigger),
      connector: text(row.connector) || text(row.apiConnector),
      mappingStatus: normalizeMappingStatus(text(row.mappingStatus) || text(row.status)),
      owner: text(row.owner),
      risk: normalizeRisk(text(row.risk)),
      notes: text(row.notes),
    };
  });
}

function asMapping(value: unknown, fallback: unknown): SysMappingRow[] {
  const source = Array.isArray(value) && value.length ? value : Array.isArray(fallback) ? fallback : [];
  return source.map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: text(row.id) || `map_${index}`,
      sourceField: text(row.sourceField) || text(row.question) || text(row.title),
      destinationField: text(row.destinationField) || text(row.currentState),
      businessMeaning: text(row.businessMeaning) || text(row.area) || text(row.category),
      formatType: text(row.formatType) || text(row.format),
      required: isFieldRequired(text(row.required)) ? (text(row.required) as SysMappingRow["required"]) : "optional",
      example: text(row.example) || text(row.sample),
      mappingStatus: normalizeMappingStatus(text(row.mappingStatus) || text(row.status)),
      owner: text(row.owner),
      providerDependency: text(row.providerDependency) || text(row.dependency),
      notes: text(row.notes) || text(row.evidence),
    };
  });
}

function asReadinessItems(value: unknown): SysReadinessRow[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: text(row.id) || `rdy_${index}`,
      area: isReadinessArea(text(row.area)) ? (text(row.area) as SysReadinessRow["area"]) : "system",
      question: text(row.question) || text(row.label),
      evidence: text(row.evidence),
      status: asReadiness(row.status),
      owner: text(row.owner),
      nextAction: text(row.nextAction) || text(row.recommendedAction),
      dueAt: text(row.dueAt),
      approvalStatus: isApprovalStatus(text(row.approvalStatus)) ? (row.approvalStatus as SysReadinessRow["approvalStatus"]) : "not_requested",
    };
  });
}

function asTests(value: unknown, qa: SysChecklistItem[]): SysTestCaseRow[] {
  if (Array.isArray(value) && value.length) {
    return value.map((item, index) => {
      const row = item as Record<string, unknown>;
      return {
        id: text(row.id) || `tc_${index}`,
        testCase: text(row.testCase) || text(row.label) || text(row.name),
        trigger: text(row.trigger) || text(row.input),
        expected: text(row.expected) || text(row.expectedResult),
        actual: text(row.actual) || text(row.actualResult),
        status: normalizeTestStatus(text(row.status)),
        severity: normalizeSeverity(text(row.severity) || text(row.priority)),
        owner: text(row.owner),
        providerDependency: text(row.providerDependency),
        evidence: text(row.evidence),
        testedAt: text(row.testedAt) || text(row.testedDate),
        retestAt: text(row.retestAt) || text(row.retestDate),
        notes: text(row.notes),
      };
    });
  }
  return qa
    .filter((item) => item.label)
    .map((item, index) => ({
      id: item.id || `tc_qa_${index}`,
      testCase: item.label,
      trigger: "",
      expected: "",
      actual: "",
      status: item.status === "completed" ? "passed" : item.status === "blocked" ? "blocked" : item.status === "in_progress" ? "in_progress" : "not_started",
      severity: "medium" as const,
      owner: item.owner,
      providerDependency: "",
      evidence: "",
      testedAt: "",
      retestAt: "",
      notes: item.notes,
    }));
}

function asIssues(value: unknown, actionLogs: unknown, hotelName: string): SysIssueRow[] {
  const source = Array.isArray(value) && value.length ? value : Array.isArray(actionLogs) ? actionLogs : [];
  return source.map((item, index) => {
    const row = item as Record<string, unknown>;
    return {
      id: text(row.id) || `iss_${index}`,
      issue: text(row.issue) || text(row.name) || text(row.title),
      project: text(row.project) || hotelName,
      system: text(row.system) || text(row.workstream),
      severity: normalizeSeverity(text(row.severity) || text(row.priority)),
      impact: text(row.impact) || text(row.decision),
      owner: text(row.owner),
      provider: text(row.provider),
      status: normalizeIssueStatus(text(row.status)),
      openedAt: text(row.openedAt) || text(row.createdAt),
      dueAt: text(row.dueAt),
      resolution: text(row.resolution),
      evidence: text(row.evidence) || text(row.source),
      notes: text(row.notes),
    };
  });
}

function asHandoverAssets(value: unknown, checklist: SysChecklistItem[]): SysHandoverAsset[] {
  if (Array.isArray(value) && value.length) {
    return value.map((item, index) => {
      const row = item as Record<string, unknown>;
      return {
        id: text(row.id) || `ha_${index}`,
        asset: text(row.asset) || text(row.system) || text(row.label),
        owner: text(row.owner),
        technicalContact: text(row.technicalContact),
        approvalAuthority: text(row.approvalAuthority),
        accessLevel: text(row.accessLevel),
        documentationStatus: isDocStatus(text(row.documentationStatus)) ? (text(row.documentationStatus) as SysHandoverAsset["documentationStatus"]) : "not_started",
        sopStatus: isDocStatus(text(row.sopStatus)) ? (text(row.sopStatus) as SysHandoverAsset["sopStatus"]) : "not_started",
        trainingStatus: isDocStatus(text(row.trainingStatus)) ? (text(row.trainingStatus) as SysHandoverAsset["trainingStatus"]) : "not_started",
        goLiveStatus: asReadiness(row.goLiveStatus || row.status),
        lastReviewed: text(row.lastReviewed),
      };
    });
  }
  return checklist
    .filter((item) => item.label)
    .map((item, index) => ({
      id: item.id || `ha_chk_${index}`,
      asset: item.label,
      owner: item.owner,
      technicalContact: "",
      approvalAuthority: "",
      accessLevel: "",
      documentationStatus: item.status === "completed" ? "completed" : item.status === "ready_for_review" ? "ready_for_review" : item.status === "in_progress" ? "in_progress" : "not_started",
      sopStatus: "not_started" as const,
      trainingStatus: "not_started" as const,
      goLiveStatus: item.status,
      lastReviewed: "",
    }));
}

function asApprovals(value: unknown): SysApprovalView[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as SysApprovalView).id) || `ap_${index}`,
    kind: text((item as SysApprovalView).kind),
    status: isApprovalStatus(text((item as SysApprovalView).status)) ? (item as SysApprovalView).status : "not_requested",
    notes: text((item as SysApprovalView).notes),
    requestedBy: text((item as SysApprovalView).requestedBy),
    decidedBy: text((item as SysApprovalView).decidedBy),
    createdAt: text((item as SysApprovalView).createdAt),
  }));
}

function asFileNotes(value: unknown): SysFileNote[] {
  const items = Array.isArray(value) ? value : [];
  return items.map((item, index) => ({
    id: text((item as SysFileNote).id) || `fn_${index}`,
    name: text((item as SysFileNote).name),
    caption: text((item as SysFileNote).caption),
    status: asReadiness((item as SysFileNote).status),
  }));
}

function defaultQa(): SysChecklistItem[] {
  return SYS_DEFAULT_QA.map((label, index) => ({
    id: `qa_${index + 1}`,
    label,
    status: "not_started",
    notes: "",
    owner: "",
  }));
}

function defaultHandover(): SysChecklistItem[] {
  return SYS_DEFAULT_HANDOVER.map((label, index) => ({
    id: `ho_${index + 1}`,
    label,
    status: "not_started",
    notes: "",
    owner: "",
  }));
}

export async function listSystemsProjects(
  user: { id: string; role: string; modules?: string | null },
  filters: SysListFilters,
  section: SysSection,
) {
  await ensureSystemsSchema();
  const access = await systemsAccessFor(user);
  const db = prisma();
  const projectRows = await db
    .$queryRawUnsafe<Array<{ id: string; ownerId: string | null }>>(`SELECT id, ownerId FROM SystemsProject`)
    .catch(() => []);
  for (const row of projectRows) {
    await seedStarterSubtasks(row.id, row.ownerId || access.userId).catch(() => undefined);
  }
  const [rows, staff, sourceRows, kpiRows, auditRows, subtaskRows, commentRows, fileRows] = await Promise.all([
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SystemsProject ORDER BY updatedAt DESC`),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string }>),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SystemsSource ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SystemsKpiEntry ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SystemsAuditEvent ORDER BY createdAt DESC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SystemsSubtask ORDER BY sortOrder ASC, createdAt ASC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SystemsSubtaskComment ORDER BY createdAt ASC`).catch(() => []),
    db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SystemsSubtaskFile ORDER BY createdAt DESC`).catch(() => []),
  ]);
  const names = new Map(staff.map((item) => [item.id, item.name]));
  const query = filters.q?.trim().toLowerCase() || "";

  let items: SysProjectRow[] = rows.map((row) => {
    const ownerId = col(row, "ownerId");
    const status = normalizeStatus(col(row, "status"));
    const subtasks: SysSubtaskView[] = subtaskRows
      .filter((item) => col(item, "propertyId") === col(row, "id"))
      .map((item): SysSubtaskView => {
        const subOwner = col(item, "ownerId");
        return {
          id: col(item, "id"),
          propertyId: col(item, "propertyId"),
          name: col(item, "name"),
          department: isDepartment(col(item, "department")) ? (col(item, "department") as SysDepartment) : "marketing",
          ownerId: subOwner,
          ownerName: names.get(subOwner) || "",
          status: normalizeSubtaskStatus(col(item, "status")),
          completed: Boolean(item.completed) || col(item, "status") === "completed",
          dueAt: iso(item.dueAt as Date | string | null),
          priority: isPriority(col(item, "priority")) ? (col(item, "priority") as SysPriority) : "normal",
          comments: col(item, "comments"),
          source: col(item, "source"),
          providerDependency: col(item, "providerDependency"),
          thread: commentRows
            .filter((comment) => col(comment, "subtaskId") === col(item, "id"))
            .map(
              (comment): SysSubtaskCommentView => ({
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
              (file): SysSubtaskFileView => ({
                id: col(file, "id"),
                filename: col(file, "filename"),
                caption: col(file, "caption"),
                size: Number(file.size || 0),
                createdAt: iso(file.createdAt as Date | string | null),
                href: `/api/crm/systems/files/${col(file, "id")}`,
              }),
            ),
        };
      });
    const qaItems = asChecklist(parseJson(row.qaJson, []));
    const handoverItems = asChecklist(parseJson(row.handoverJson, []));
    const projectType = normalizeProjectType(col(row, "propertyType") || col(row, "projectType") || col(row, "improveOrRebuild"));
    const approvals = asApprovals(parseJson(row.approvalsJson, []));
    const hotelName = col(row, "hotelName");
    const inventory = asInventory(parseJson(row.inventoryJson, []));
    const architecture = asArchitecture(parseJson(row.architectureJson, []));
    const mapping = asMapping(parseJson(row.mappingJson, []), parseJson(row.assessmentsJson, parseJson(row.frictionJson, [])));
    const readinessItems = asReadinessItems(parseJson(row.readinessJson, []));
    const tests = asTests(parseJson(row.testingJson, []), qaItems.length ? qaItems : defaultQa());
    const issues = asIssues(parseJson(row.issuesJson, []), parseJson(row.actionLogsJson, []), hotelName);
    const handoverAssets = asHandoverAssets(parseJson(row.handoverAssetsJson, []), handoverItems.length ? handoverItems : defaultHandover());
    const configuration = asSection(parseJson(row.configurationJson, parseJson(row.operationsJson, parseJson(row.plansJson, emptySectionBlock()))));
    const distributionOps = asSection(parseJson(row.distributionOpsJson, parseJson(row.distributionJson, parseJson(row.bookingJson, emptySectionBlock()))));
    const analyticsNotes = asSection(parseJson(row.analyticsJson, parseJson(row.commercialJson, emptySectionBlock())));
    const kpis = kpiRows
      .filter((item) => col(item, "propertyId") === col(row, "id"))
      .map((item): SysKpiView => {
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
    const rawProvider = col(row, "providerContact");
    const primarySystem = inventory[0]?.system || col(row, "pms") || col(row, "bookingEngine") || col(row, "channelManager") || "";
    const primarySeverity: SysSeverity = issues[0]?.severity || tests[0]?.severity || normalizeSeverity(col(row, "riskLevel") || col(row, "priority"));
    const mapped: SysProjectRow = {
      id: col(row, "id"),
      projectName: col(row, "projectName") || hotelName,
      hotelName,
      propertyType: projectType,
      roomCount: col(row, "roomCount"),
      websiteUrl: col(row, "websiteUrl") || col(row, "currentUrl"),
      pms: col(row, "pms"),
      channelManager: col(row, "channelManager"),
      bookingEngine: col(row, "bookingEngine"),
      otherSystems: col(row, "otherSystems"),
      locationMarket: col(row, "locationMarket") || col(row, "targetMarket"),
      hotelStatus: normalizeHotelStatus(col(row, "hotelOperatingStatus")),
      primaryGoal: col(row, "primaryGoal"),
      mainChallenge: col(row, "mainChallenge"),
      startDate: iso(row.startDate as Date | string | null),
      launchDate: iso(row.launchDate as Date | string | null),
      status,
      ownerId,
      ownerName: names.get(ownerId) || "",
      department: isDepartment(col(row, "department")) ? (col(row, "department") as SysDepartment) : "marketing",
      workstream: normalizeWorkstream(col(row, "workstream")),
      priority: isPriority(col(row, "priority")) ? (col(row, "priority") as SysPriority) : "normal",
      risk: normalizeRisk(col(row, "riskLevel") || col(row, "priority")),
      scope: col(row, "scopeText"),
      hotelApprover: col(row, "hotelApprover"),
      providerContact: mask(rawProvider, access.canSeePrivateIds),
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
      inventory,
      architecture,
      mapping,
      readinessItems,
      configuration,
      tests,
      issues,
      distributionOps,
      analyticsNotes,
      handoverAssets,
      qa: qaItems.length ? qaItems : defaultQa(),
      handover: handoverItems.length ? handoverItems : defaultHandover(),
      fileNotes: asFileNotes(parseJson(row.filesJson, [])),
      approvals,
      sources: sourceRows
        .filter((item) => col(item, "propertyId") === col(row, "id"))
        .map(
          (item): SysSourceView => ({
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
          (item): SysAuditView => ({
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
      primarySystem,
      primarySeverity,
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
        item.status === "awaiting_hotel_approval" ||
        item.readinessItems.some((entry) => entry.approvalStatus === "awaiting" || entry.approvalStatus === "changes_requested"),
    );
  }
  if (section === "issues") {
    items = items.filter((item) => item.issues.length > 0 || item.workstream === "issues" || item.status === "blocked" || item.status === "retest_required");
  }
  if (filters.status && normalizeStatus(filters.status) === filters.status) {
    items = items.filter((item) => item.status === filters.status);
  }
  if (filters.ownerId) items = items.filter((item) => item.ownerId === filters.ownerId);
  if (filters.department) items = items.filter((item) => item.department === filters.department);
  if (filters.hotel) items = items.filter((item) => item.hotelName === filters.hotel);
  if (filters.workstream) items = items.filter((item) => item.workstream === filters.workstream);
  if (filters.projectType) items = items.filter((item) => item.propertyType === filters.projectType);
  if (filters.system) items = items.filter((item) => item.primarySystem === filters.system || item.inventory.some((entry) => entry.system === filters.system));
  if (filters.severity) items = items.filter((item) => item.primarySeverity === filters.severity);
  if (filters.risk) items = items.filter((item) => item.risk === filters.risk);
  if (filters.market) items = items.filter((item) => item.locationMarket === filters.market);
  if (filters.cadence) items = items.filter((item) => item.kpiCadence === filters.cadence);
  if (filters.priority && isPriority(filters.priority)) items = items.filter((item) => item.priority === filters.priority);
  if (query) {
    items = items.filter((item) =>
      `${item.projectName} ${item.hotelName} ${item.locationMarket} ${item.nextAction} ${item.notes} ${item.primaryGoal} ${item.pms} ${item.channelManager} ${item.bookingEngine} ${item.inventory.map((entry) => entry.system).join(" ")} ${item.mapping.map((entry) => entry.sourceField).join(" ")} ${item.issues.map((entry) => entry.issue).join(" ")}`
        .toLowerCase()
        .includes(query),
    );
  }

  const groupBy: SysGroupBy = isGroupBy(filters.group || "") ? (filters.group as SysGroupBy) : "status";
  const sort: SysSort = isSort(filters.sort || "") ? (filters.sort as SysSort) : "nextActionAt";
  items.sort((a, b) => {
    if (sort === "risk") return SYS_RISK_RANK[a.risk] - SYS_RISK_RANK[b.risk];
    if (sort === "severity") return SYS_SEVERITY_RANK[a.primarySeverity] - SYS_SEVERITY_RANK[b.primarySeverity];
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
      systems: Array.from(new Set(items.flatMap((item) => [item.primarySystem, ...item.inventory.map((entry) => entry.system)].filter(Boolean)))),
    },
    groupBy,
    sort,
  };
}

export async function writeAudit(propertyId: string, userId: string, action: string, detail: string) {
  await prisma().$executeRawUnsafe(
    `INSERT INTO SystemsAuditEvent (id, propertyId, action, detail, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, NOW(3))`,
    `wa_${randomToken(10)}`,
    propertyId,
    action,
    detail,
    userId,
  );
}

export async function createSystemsProject(access: SysAccessView, hotelName: string, workstream?: string) {
  const id = `web_${randomToken(10)}`;
  const stream = workstream ? normalizeWorkstream(workstream) : "properties";
  await prisma().$executeRawUnsafe(
    `INSERT INTO SystemsProject (id, hotelName, workstream, status, department, priority, nextAction, notes, ownerId, createdBy, updatedBy, createdAt, updatedAt)
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
    .$queryRawUnsafe<Array<{ name: string; department: string }>>(`SELECT name, department FROM SystemsSubtask WHERE propertyId = ?`, propertyId)
    .catch(() => [] as Array<{ name: string; department: string }>);
  const present = new Set(existing.map((item) => `${item.department}::${item.name}`));
  let sort = existing.length;
  for (const item of SYS_STARTER_SUBTASKS) {
    if (present.has(`${item.department}::${item.name}`)) continue;
    const deptCount = existing.filter((row) => row.department === item.department).length;
    if (deptCount >= 10) continue;
    sort += 1;
    try {
      await prisma().$executeRawUnsafe(
        `INSERT INTO SystemsSubtask (id, propertyId, name, department, ownerId, status, completed, dueAt, priority, comments, source, providerDependency, sortOrder, createdBy, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, 'not_started', 0, NULL, 'normal', '', '', '', ?, ?, NOW(3), NOW(3))`,
        `wst_${randomToken(10)}`,
        propertyId,
        item.name,
        item.department,
        userId,
        sort,
        userId,
      );
      existing.push({ name: item.name, department: item.department });
    } catch {
      /* skip if the row already exists or a column is still migrating */
    }
  }
}

export async function countSystemsSubtasks(propertyId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM SystemsSubtask WHERE propertyId = ?`, propertyId)
    .catch(() => [{ count: 0 }]);
  return Number(rows[0]?.count || 0);
}

export async function countSystemsSubtasksForDepartment(propertyId: string, department: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM SystemsSubtask WHERE propertyId = ? AND department = ?`, propertyId, department)
    .catch(() => [{ count: 0 }]);
  return Number(rows[0]?.count || 0);
}

export async function getSystemsSubtask(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SystemsSubtask WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function insertSystemsSubtask(data: {
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
  providerDependency: string;
  userId: string;
}) {
  const id = `wst_${randomToken(10)}`;
  const sort = (await countSystemsSubtasks(data.propertyId)) + 1;
  await prisma().$executeRawUnsafe(
    `INSERT INTO SystemsSubtask (id, propertyId, name, department, ownerId, status, completed, dueAt, priority, comments, source, providerDependency, sortOrder, createdBy, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
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
    data.providerDependency,
    sort,
    data.userId,
  );
  return id;
}

export async function updateSystemsSubtask(
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
    providerDependency: string;
  },
) {
  await prisma().$executeRawUnsafe(
    `UPDATE SystemsSubtask SET name=?, department=?, ownerId=?, status=?, completed=?, dueAt=?, priority=?, comments=?, source=?, providerDependency=?, updatedAt=NOW(3) WHERE id=?`,
    data.name,
    data.department,
    data.ownerId,
    data.status,
    data.completed ? 1 : 0,
    data.dueAt,
    data.priority,
    data.comments,
    data.source,
    data.providerDependency,
    id,
  );
}

export async function insertSystemsSubtaskComment(subtaskId: string, authorId: string, body: string) {
  const id = `wsc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO SystemsSubtaskComment (id, subtaskId, authorId, body, createdAt) VALUES (?, ?, ?, ?, NOW(3))`,
    id,
    subtaskId,
    authorId,
    body,
  );
  return id;
}

export async function insertSystemsSubtaskFile(data: {
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
    `INSERT INTO SystemsSubtaskFile (id, subtaskId, filename, mime, size, path, caption, createdBy, createdAt)
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

export async function getSystemsSubtaskFile(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SystemsSubtaskFile WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function replaceKpis(propertyId: string, items: SysKpiView[]) {
  const previous = await prisma()
    .$queryRawUnsafe<Array<{ id: string; value: string }>>(`SELECT id, value FROM SystemsKpiEntry WHERE propertyId = ?`, propertyId)
    .catch(() => []);
  const previousValues = new Map(previous.map((item) => [item.id, item.value]));
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsKpiEntry WHERE propertyId = ?`, propertyId);
  for (const item of items) {
    const value = item.value === MASKED_VALUE ? previousValues.get(item.id) || "" : item.value;
    await prisma().$executeRawUnsafe(
      `INSERT INTO SystemsKpiEntry (id, propertyId, name, period, value, definition, source, dataStatus, market, createdAt)
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
        `UPDATE SystemsKpiEntry SET area=?, kpiOwner=?, targetValue=?, kpiNotes=?, updatedAt=NOW(3) WHERE id=?`,
        item.area || "commercial",
        item.owner || "",
        item.target || "",
        item.notes || "",
        item.id,
      )
      .catch(() => undefined);
  }
}

export async function replaceSources(propertyId: string, items: SysSourceView[]) {
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsSource WHERE propertyId = ?`, propertyId);
  for (const item of items) {
    await prisma().$executeRawUnsafe(
      `INSERT INTO SystemsSource (id, propertyId, name, url, publishedAt, accessedAt, notes, createdAt)
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

export async function saveSystemsProject(
  id: string,
  data: Record<string, string | null | undefined>,
  userId: string,
  canSeePrivateIds: boolean,
) {
  const existing = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SystemsProject WHERE id = ? LIMIT 1`, id);
  const row = existing[0];
  if (!row) return false;
  const engineRef = canSeePrivateIds ? data.engineAccountRef ?? col(row, "engineAccountRef") : col(row, "engineAccountRef");
  const analyticsRef = canSeePrivateIds ? data.analyticsRef ?? col(row, "analyticsRef") : col(row, "analyticsRef");
  const pick = (key: string) => (data[key] !== undefined ? data[key] : col(row, key));
  await prisma().$executeRawUnsafe(
    `UPDATE SystemsProject SET
      projectName=?, hotelName=?, projectType=?, propertyType=?, roomCount=?, websiteUrl=?, currentUrl=?, pms=?, channelManager=?, bookingEngine=?, otherSystems=?, locationMarket=?, hotelOperatingStatus=?,
      primaryGoal=?, mainChallenge=?, targetMarket=?, startDate=?, launchDate=?,
      status=?, ownerId=?, department=?, workstream=?, priority=?, riskLevel=?, scopeText=?, nextAction=?, nextActionAt=?, notes=?,
      primaryKpi=?, kpiTarget=?, hotelApprover=?, providerContact=?, kpiCadence=?, dataStatus=?, handoverStatus=?,
      qaJson=?, handoverJson=?, filesJson=?, approvalsJson=?, inventoryJson=?, architectureJson=?, mappingJson=?,
      readinessJson=?, configurationJson=?, testingJson=?, issuesJson=?, distributionOpsJson=?, analyticsJson=?, handoverAssetsJson=?,
      engineAccountRef=?, analyticsRef=?,
      updatedBy=?, updatedAt=NOW(3)
     WHERE id=?`,
    pick("projectName") || pick("hotelName"),
    pick("hotelName"),
    pick("projectType") || pick("propertyType"),
    pick("propertyType") || pick("projectType"),
    pick("roomCount"),
    pick("websiteUrl") || pick("currentUrl"),
    pick("websiteUrl") || pick("currentUrl"),
    pick("pms"),
    pick("channelManager"),
    pick("bookingEngine"),
    pick("otherSystems"),
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
    pick("riskLevel") || pick("risk"),
    pick("scopeText") || pick("scope"),
    pick("nextAction"),
    data.nextActionAt !== undefined ? data.nextActionAt || null : (row.nextActionAt as string | null),
    pick("notes"),
    pick("primaryKpi"),
    pick("kpiTarget"),
    pick("hotelApprover"),
    canSeePrivateIds && data.providerContact !== MASKED_VALUE ? pick("providerContact") : col(row, "providerContact"),
    pick("kpiCadence"),
    pick("dataStatus"),
    pick("handoverStatus"),
    data.qaJson ?? col(row, "qaJson"),
    data.handoverJson ?? col(row, "handoverJson"),
    data.filesJson ?? col(row, "filesJson"),
    data.approvalsJson ?? col(row, "approvalsJson"),
    data.inventoryJson ?? col(row, "inventoryJson"),
    data.architectureJson ?? col(row, "architectureJson"),
    data.mappingJson ?? col(row, "mappingJson"),
    data.readinessJson ?? col(row, "readinessJson"),
    data.configurationJson ?? col(row, "configurationJson"),
    data.testingJson ?? col(row, "testingJson"),
    data.issuesJson ?? col(row, "issuesJson"),
    data.distributionOpsJson ?? col(row, "distributionOpsJson"),
    data.analyticsJson ?? col(row, "analyticsJson"),
    data.handoverAssetsJson ?? col(row, "handoverAssetsJson"),
    engineRef,
    analyticsRef,
    userId,
    id,
  );
  return true;
}

export async function patchSystemsProject(id: string, data: Record<string, string | null | undefined>, userId: string) {
  return saveSystemsProject(id, data, userId, true);
}

export async function getSystemsProject(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM SystemsProject WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function appendSystemsApproval(
  propertyId: string,
  item: { kind: string; status: string; notes: string; requestedBy: string; decidedBy?: string },
) {
  const row = await getSystemsProject(propertyId);
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
    `UPDATE SystemsProject SET approvalsJson=?, updatedAt=NOW(3) WHERE id=?`,
    JSON.stringify(approvals),
    propertyId,
  );
  return true;
}

export async function deleteSystemsSubtask(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsSubtaskFile WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsSubtaskComment WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsSubtask WHERE id = ?`, id);
}

export async function deleteSystemsProject(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsSubtaskFile WHERE subtaskId IN (SELECT id FROM SystemsSubtask WHERE propertyId = ?)`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsSubtaskComment WHERE subtaskId IN (SELECT id FROM SystemsSubtask WHERE propertyId = ?)`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsSubtask WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsSource WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsKpiEntry WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsAuditEvent WHERE propertyId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsProject WHERE id = ?`, id);
}

export async function listSystemsAccessRows() {
  await ensureSystemsSchema();
  const [rows, staff] = await Promise.all([
    prisma().$queryRawUnsafe<Array<{ id: string; userId: string; department: string; canSeePrivateIds: number | boolean }>>(
      `SELECT id, userId, department, canSeePrivateIds FROM SystemsAccess ORDER BY createdAt DESC`,
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

export async function saveSystemsAccessRow(userId: string, department: string, canSeePrivateIds: boolean) {
  const id = `wacc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO SystemsAccess (id, userId, department, canSeePrivateIds, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    userId,
    department,
    canSeePrivateIds ? 1 : 0,
  );
  return id;
}

export async function deleteSystemsAccessRow(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM SystemsAccess WHERE id = ?`, id);
}
