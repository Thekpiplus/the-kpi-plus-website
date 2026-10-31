export const HAI_DEPARTMENTS = [
  "reservations",
  "revenue",
  "distribution",
  "marketing",
  "operations",
  "sales",
  "management",
  "it_data",
] as const;
export type HaiDepartment = (typeof HAI_DEPARTMENTS)[number];

export const HAI_DEPARTMENT_LABEL: Record<HaiDepartment, string> = {
  reservations: "Reservations",
  revenue: "Revenue",
  distribution: "Distribution",
  marketing: "Marketing",
  operations: "Operations / Guest Experience",
  sales: "Sales",
  management: "Management",
  it_data: "IT / Data",
};

export const HAI_DEPARTMENT_PATH: Record<HaiDepartment, string> = {
  reservations: "/crm/hotel-ai/departments/reservations",
  revenue: "/crm/hotel-ai/departments/revenue",
  distribution: "/crm/hotel-ai/departments/distribution",
  marketing: "/crm/hotel-ai/departments/marketing",
  operations: "/crm/hotel-ai/departments/operations",
  sales: "/crm/hotel-ai/departments/sales",
  management: "/crm/hotel-ai/departments/management",
  it_data: "/crm/hotel-ai/departments/it-data",
};

export const HAI_STATUSES = [
  "backlog",
  "discovery",
  "simplify",
  "ready_for_pilot",
  "pilot_running",
  "needs_review",
  "blocked",
  "approved_to_scale",
  "adjust",
  "stopped",
  "handed_over",
] as const;
export type HaiStatus = (typeof HAI_STATUSES)[number];

export const HAI_STATUS_LABEL: Record<HaiStatus, string> = {
  backlog: "Backlog",
  discovery: "Discovery",
  simplify: "Simplify",
  ready_for_pilot: "Ready for Pilot",
  pilot_running: "Pilot Running",
  needs_review: "Needs Review",
  blocked: "Blocked",
  approved_to_scale: "Approved to Scale",
  adjust: "Adjust",
  stopped: "Stopped",
  handed_over: "Handed Over",
};

export const HAI_PILOT_PHASES = ["not_started", "charter", "running", "review", "decision"] as const;
export type HaiPilotPhase = (typeof HAI_PILOT_PHASES)[number];

export const HAI_PILOT_PHASE_LABEL: Record<HaiPilotPhase, string> = {
  not_started: "Not started",
  charter: "Charter",
  running: "Pilot running",
  review: "Review",
  decision: "Decision",
};

export const HAI_APPROACHES = ["simplify", "automate", "ai_assisted", "do_not_automate"] as const;
export type HaiApproach = (typeof HAI_APPROACHES)[number];

export const HAI_APPROACH_LABEL: Record<HaiApproach, string> = {
  simplify: "Simplify",
  automate: "Automate",
  ai_assisted: "AI-assisted",
  do_not_automate: "Do not automate yet",
};

export const HAI_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type HaiPriority = (typeof HAI_PRIORITIES)[number];

export const HAI_PRIORITY_LABEL: Record<HaiPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const HAI_RISKS = ["low", "medium", "high", "critical"] as const;
export type HaiRisk = (typeof HAI_RISKS)[number];

export const HAI_RISK_LABEL: Record<HaiRisk, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const HAI_RISK_RANK: Record<HaiRisk, number> = { critical: 0, high: 1, medium: 2, low: 3 };
export const HAI_PRIORITY_RANK: Record<HaiPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };

export const HAI_DATA_CLASSES = ["public", "internal", "confidential", "restricted"] as const;
export type HaiDataClass = (typeof HAI_DATA_CLASSES)[number];

export const HAI_DATA_CLASS_LABEL: Record<HaiDataClass, string> = {
  public: "Public",
  internal: "Internal",
  confidential: "Confidential",
  restricted: "Restricted — no guest PII in notes",
};

export const HAI_SECTIONS = [
  "overview",
  "inventory",
  "backlog",
  "pilots",
  "use_cases",
  "data",
  "approvals",
  "tests",
  "issues",
  "metrics",
  "handover",
  "departments",
  "history",
  "settings",
] as const;
export type HaiSection = (typeof HAI_SECTIONS)[number];

export const HAI_SECTION_LABEL: Record<HaiSection, string> = {
  overview: "Overview",
  inventory: "Workflow Inventory",
  backlog: "Automation Backlog",
  pilots: "Pilot Projects",
  use_cases: "Use Cases",
  data: "Data and Access Review",
  approvals: "Human Review / Approvals",
  tests: "Test Cases",
  issues: "Exceptions and Issue Log",
  metrics: "Metrics / Pilot Scorecards",
  handover: "Handover / SOP",
  departments: "Department Workspaces",
  history: "Audit History",
  settings: "Settings",
};

export const HAI_SECTION_PATH: Record<HaiSection, string> = {
  overview: "/crm/hotel-ai",
  inventory: "/crm/hotel-ai/inventory",
  backlog: "/crm/hotel-ai/backlog",
  pilots: "/crm/hotel-ai/pilots",
  use_cases: "/crm/hotel-ai/use-cases",
  data: "/crm/hotel-ai/data-access",
  approvals: "/crm/hotel-ai/approvals",
  tests: "/crm/hotel-ai/tests",
  issues: "/crm/hotel-ai/issues",
  metrics: "/crm/hotel-ai/metrics",
  handover: "/crm/hotel-ai/handover",
  departments: "/crm/hotel-ai/departments",
  history: "/crm/hotel-ai/audit",
  settings: "/crm/hotel-ai/settings",
};

export const HAI_FORM_TABS = [
  "workflow",
  "charter",
  "use_cases",
  "data",
  "tests",
  "issues",
  "metrics",
  "handover",
  "approvals",
] as const;
export type HaiFormTab = (typeof HAI_FORM_TABS)[number];

export const HAI_FORM_TAB_LABEL: Record<HaiFormTab, string> = {
  workflow: "Workflow",
  charter: "Pilot Charter",
  use_cases: "Use Cases",
  data: "Data and Access",
  tests: "Test Cases",
  issues: "Exceptions",
  metrics: "Scorecard",
  handover: "Handover / SOP",
  approvals: "Approvals",
};

export const HAI_GROUP_BY = ["status", "department", "property", "owner", "pilot_phase"] as const;
export type HaiGroupBy = (typeof HAI_GROUP_BY)[number];

export const HAI_GROUP_LABEL: Record<HaiGroupBy, string> = {
  status: "Status",
  department: "Department",
  property: "Property",
  owner: "Owner",
  pilot_phase: "Pilot phase",
};

export const HAI_SORTS = ["priority", "due", "risk", "updated"] as const;
export type HaiSort = (typeof HAI_SORTS)[number];

export const HAI_SORT_LABEL: Record<HaiSort, string> = {
  priority: "Priority",
  due: "Due date",
  risk: "Risk",
  updated: "Last updated",
};

export const HAI_SUBTASK_STATUSES = ["not_started", "in_progress", "blocked", "needs_review", "completed"] as const;
export type HaiSubtaskStatus = (typeof HAI_SUBTASK_STATUSES)[number];

export const HAI_SUBTASK_STATUS_LABEL: Record<HaiSubtaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  needs_review: "Needs Review",
  completed: "Completed",
};

export const HAI_GATE_KINDS = ["none", "safety", "access", "privacy"] as const;
export type HaiGateKind = (typeof HAI_GATE_KINDS)[number];

export const HAI_GATE_LABEL: Record<HaiGateKind, string> = {
  none: "Workflow",
  safety: "Safety",
  access: "Access",
  privacy: "Privacy",
};

export const HAI_APPROVAL_STATUSES = ["not_requested", "awaiting", "approved", "rejected", "changes_requested"] as const;
export type HaiApprovalStatus = (typeof HAI_APPROVAL_STATUSES)[number];

export const HAI_APPROVAL_LABEL: Record<HaiApprovalStatus, string> = {
  not_requested: "Not requested",
  awaiting: "Awaiting",
  approved: "Approved",
  rejected: "Rejected",
  changes_requested: "Changes requested",
};

export const HAI_PILOT_DECISIONS = ["pending", "scale", "adjust", "stop"] as const;
export type HaiPilotDecision = (typeof HAI_PILOT_DECISIONS)[number];

export const HAI_PILOT_DECISION_LABEL: Record<HaiPilotDecision, string> = {
  pending: "Pending",
  scale: "Scale",
  adjust: "Adjust",
  stop: "Stop",
};

export const HAI_TEST_STATUSES = ["not_started", "in_progress", "passed", "failed", "blocked"] as const;
export type HaiTestStatus = (typeof HAI_TEST_STATUSES)[number];

export const HAI_TEST_STATUS_LABEL: Record<HaiTestStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  passed: "Passed",
  failed: "Failed",
  blocked: "Blocked",
};

export const HAI_ISSUE_STATUSES = ["open", "in_progress", "blocked", "resolved", "closed"] as const;
export type HaiIssueStatus = (typeof HAI_ISSUE_STATUSES)[number];

export const HAI_ISSUE_STATUS_LABEL: Record<HaiIssueStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  blocked: "Blocked",
  resolved: "Resolved",
  closed: "Closed",
};

export const HAI_SOP_STATUSES = ["not_started", "in_progress", "ready_for_review", "completed"] as const;
export type HaiSopStatus = (typeof HAI_SOP_STATUSES)[number];

export const HAI_SOP_STATUS_LABEL: Record<HaiSopStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  ready_for_review: "Ready for review",
  completed: "Completed",
};

export const HAI_READINESS = ["not_started", "in_progress", "blocked", "ready_for_review", "completed"] as const;
export type HaiReadiness = (typeof HAI_READINESS)[number];

export const HAI_READINESS_LABEL: Record<HaiReadiness, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  blocked: "Blocked",
  ready_for_review: "Ready for review",
  completed: "Completed",
};

export const MAX_HAI_SUBTASKS = 10;
export const MIN_HAI_SUBTASKS = 1;
export const MASKED_VALUE = "••••";

export type HaiExtraDepartment = { id: string; label: string };

export type HaiSettings = {
  extraDepartments: HaiExtraDepartment[];
  secretVaultLabel: string;
  secretVaultUrl: string;
};

export type HaiAccessView = {
  userId: string;
  departments: string[];
  canEditBoard: boolean;
  canManageSettings: boolean;
  canSeePrivateIds: boolean;
  isManagement: boolean;
};

export type HaiSubtaskCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type HaiSubtaskView = {
  id: string;
  workflowId: string;
  name: string;
  department: string;
  ownerId: string;
  ownerName: string;
  reviewerId: string;
  reviewerName: string;
  status: HaiSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: HaiPriority;
  comments: string;
  evidence: string;
  gateKind: HaiGateKind;
  thread: HaiSubtaskCommentView[];
};

export type HaiSubtaskProgress = {
  total: number;
  completed: number;
  percent: number;
  readiness: HaiReadiness;
  countLabel: string;
  blockedByGate: boolean;
  gateReasons: HaiGateKind[];
};

export type HaiApprovalView = {
  id: string;
  kind: string;
  status: HaiApprovalStatus;
  notes: string;
  requestedBy: string;
  decidedBy: string;
  createdAt: string;
};

export type HaiUseCaseRow = {
  id: string;
  title: string;
  actor: string;
  trigger: string;
  outcome: string;
  notes: string;
};

export type HaiDataAccessRow = {
  id: string;
  system: string;
  dataType: string;
  classification: HaiDataClass;
  accessNeeded: string;
  owner: string;
  approved: boolean;
  notes: string;
};

export type HaiTestCaseRow = {
  id: string;
  name: string;
  trigger: string;
  expected: string;
  actual: string;
  status: HaiTestStatus;
  owner: string;
  evidence: string;
  notes: string;
};

export type HaiIssueRow = {
  id: string;
  title: string;
  exception: string;
  owner: string;
  status: HaiIssueStatus;
  risk: HaiRisk;
  dueAt: string;
  evidence: string;
  notes: string;
};

export type HaiMetricRow = {
  id: string;
  name: string;
  baseline: string;
  target: string;
  actual: string;
  period: string;
  notes: string;
};

export type HaiHandoverRow = {
  id: string;
  asset: string;
  owner: string;
  sopStatus: HaiSopStatus;
  trainingStatus: HaiSopStatus;
  notes: string;
};

export type HaiAuditView = {
  id: string;
  action: string;
  detail: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
};

export type HaiPilotCharter = {
  scope: string;
  baselinePeriod: string;
  baselineMethod: string;
  approvedDataSources: string;
  prohibitedData: string;
  pilotUsers: string;
  successCriteria: string;
  qualityThreshold: string;
  errorStopThreshold: string;
  humanReviewRule: string;
  fallbackPlan: string;
  startDate: string;
  endDate: string;
  reviewDate: string;
  decision: HaiPilotDecision;
  decisionOwner: string;
  approvalStatus: HaiApprovalStatus;
};

export type HaiWorkflowRow = {
  id: string;
  name: string;
  hotelName: string;
  department: string;
  ownerId: string;
  ownerName: string;
  problem: string;
  currentProcess: string;
  frequency: string;
  systems: string;
  dataClass: HaiDataClass;
  sourceOfTruth: string;
  manualSteps: string;
  exceptions: string;
  userImpact: string;
  objective: string;
  status: HaiStatus;
  priority: HaiPriority;
  approach: HaiApproach;
  reviewer: string;
  fallback: string;
  risk: HaiRisk;
  nextAction: string;
  nextActionAt: string;
  vaultRef: string;
  notes: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  charter: HaiPilotCharter;
  useCases: HaiUseCaseRow[];
  dataAccess: HaiDataAccessRow[];
  tests: HaiTestCaseRow[];
  issues: HaiIssueRow[];
  metrics: HaiMetricRow[];
  handover: HaiHandoverRow[];
  approvals: HaiApprovalView[];
  comments: HaiSubtaskCommentView[];
  history: HaiAuditView[];
  subtasks: HaiSubtaskView[];
  progress: HaiSubtaskProgress;
  pilotPhase: HaiPilotPhase;
};

export type HaiListFilters = {
  q?: string;
  status?: string;
  ownerId?: string;
  department?: string;
  hotel?: string;
  risk?: string;
  approach?: string;
  group?: string;
  sort?: string;
  view?: string;
  archived?: string;
};

export const HAI_DEPARTMENT_DUTIES: Record<HaiDepartment, string[]> = {
  reservations: [
    "Enquiry intake",
    "Classification",
    "Handoff",
    "Guest-facing reply review",
    "Exception escalation",
  ],
  revenue: [
    "Reporting workflow",
    "Metric definitions",
    "Data source approval",
    "Reviewer for numbers and decisions",
  ],
  distribution: [
    "System/channel consistency",
    "Provider/API dependency",
    "Data ownership",
    "Integration testing",
  ],
  marketing: [
    "Content briefs",
    "Approved brand voice",
    "Draft review",
    "Campaign approval before publication",
  ],
  operations: [
    "SOP search",
    "Shift handover",
    "Service workflows",
    "Safety and policy review",
  ],
  sales: [
    "Lead routing",
    "Follow-up ownership",
    "Account/partner workflows",
    "Approved summaries",
  ],
  management: [
    "Scope",
    "Budget",
    "Success criteria",
    "Risk acceptance",
    "Scale/Adjust/Stop approval",
  ],
  it_data: [
    "Access",
    "System connection",
    "Logging",
    "Security review",
    "Data retention",
    "Technical fallback",
  ],
};

export function haiGateKind(name: string, department = ""): HaiGateKind {
  const text = `${department} ${name}`.toLowerCase();
  if (/privacy|pii|retention|guest data|personal/.test(text)) return "privacy";
  if (/access|connection|logging|provider\/api|vault|secret/.test(text)) return "access";
  if (/safety|security|policy review|risk acceptance|technical fallback/.test(text)) return "safety";
  return "none";
}

export const HAI_STARTER_SUBTASKS: Array<{ department: HaiDepartment; name: string; gateKind: HaiGateKind }> = HAI_DEPARTMENTS.flatMap((department) =>
  HAI_DEPARTMENT_DUTIES[department].map((name) => ({ department, name, gateKind: haiGateKind(name, department) })),
);

export function haiDepartmentSubtasks<T extends { department: string }>(items: T[], department: string) {
  return items.filter((item) => item.department === department);
}

export function isHaiDepartment(value: string, extras: HaiExtraDepartment[] = []): value is HaiDepartment | string {
  return HAI_DEPARTMENTS.includes(value as HaiDepartment) || extras.some((item) => item.id === value);
}

export function isStatus(value: string): value is HaiStatus {
  return HAI_STATUSES.includes(value as HaiStatus);
}
export function isApproach(value: string): value is HaiApproach {
  return HAI_APPROACHES.includes(value as HaiApproach);
}
export function isPriority(value: string): value is HaiPriority {
  return HAI_PRIORITIES.includes(value as HaiPriority);
}
export function isRisk(value: string): value is HaiRisk {
  return HAI_RISKS.includes(value as HaiRisk);
}
export function isDataClass(value: string): value is HaiDataClass {
  return HAI_DATA_CLASSES.includes(value as HaiDataClass);
}
export function isSection(value: string): value is HaiSection {
  return HAI_SECTIONS.includes(value as HaiSection);
}
export function isGroupBy(value: string): value is HaiGroupBy {
  return HAI_GROUP_BY.includes(value as HaiGroupBy);
}
export function isSort(value: string): value is HaiSort {
  return HAI_SORTS.includes(value as HaiSort);
}
export function isSubtaskStatus(value: string): value is HaiSubtaskStatus {
  return HAI_SUBTASK_STATUSES.includes(value as HaiSubtaskStatus);
}
export function isGateKind(value: string): value is HaiGateKind {
  return HAI_GATE_KINDS.includes(value as HaiGateKind);
}
export function isApprovalStatus(value: string): value is HaiApprovalStatus {
  return HAI_APPROVAL_STATUSES.includes(value as HaiApprovalStatus);
}
export function isPilotDecision(value: string): value is HaiPilotDecision {
  return HAI_PILOT_DECISIONS.includes(value as HaiPilotDecision);
}
export function isTestStatus(value: string): value is HaiTestStatus {
  return HAI_TEST_STATUSES.includes(value as HaiTestStatus);
}
export function isIssueStatus(value: string): value is HaiIssueStatus {
  return HAI_ISSUE_STATUSES.includes(value as HaiIssueStatus);
}
export function isSopStatus(value: string): value is HaiSopStatus {
  return HAI_SOP_STATUSES.includes(value as HaiSopStatus);
}

export function normalizeStatus(value: string): HaiStatus {
  return isStatus(value) ? value : "backlog";
}
export function normalizeApproach(value: string): HaiApproach {
  return isApproach(value) ? value : "do_not_automate";
}
export function normalizePriority(value: string): HaiPriority {
  return isPriority(value) ? value : "normal";
}
export function normalizeRisk(value: string): HaiRisk {
  return isRisk(value) ? value : "medium";
}
export function normalizeDataClass(value: string): HaiDataClass {
  return isDataClass(value) ? value : "internal";
}
export function normalizeSubtaskStatus(value: string): HaiSubtaskStatus {
  return isSubtaskStatus(value) ? value : "not_started";
}
export function normalizeGateKind(value: string, name = "", department = ""): HaiGateKind {
  if (isGateKind(value) && value !== "none") return value;
  return haiGateKind(name, department);
}
export function normalizeApprovalStatus(value: string): HaiApprovalStatus {
  return isApprovalStatus(value) ? value : "not_requested";
}
export function normalizePilotDecision(value: string): HaiPilotDecision {
  return isPilotDecision(value) ? value : "pending";
}
export function normalizeTestStatus(value: string): HaiTestStatus {
  return isTestStatus(value) ? value : "not_started";
}
export function normalizeIssueStatus(value: string): HaiIssueStatus {
  return isIssueStatus(value) ? value : "open";
}
export function normalizeSopStatus(value: string): HaiSopStatus {
  return isSopStatus(value) ? value : "not_started";
}

export function pilotPhaseFor(status: HaiStatus): HaiPilotPhase {
  if (status === "ready_for_pilot") return "charter";
  if (status === "pilot_running") return "running";
  if (status === "needs_review" || status === "blocked") return "review";
  if (status === "approved_to_scale" || status === "adjust" || status === "stopped" || status === "handed_over") return "decision";
  return "not_started";
}

export function departmentLabel(id: string, extras: HaiExtraDepartment[] = []) {
  if (HAI_DEPARTMENTS.includes(id as HaiDepartment)) return HAI_DEPARTMENT_LABEL[id as HaiDepartment];
  return extras.find((item) => item.id === id)?.label || id;
}

export function emptyPilotCharter(): HaiPilotCharter {
  return {
    scope: "",
    baselinePeriod: "",
    baselineMethod: "",
    approvedDataSources: "",
    prohibitedData: "Do not store guest PII, payment data, passwords, or API keys in this record.",
    pilotUsers: "",
    successCriteria: "",
    qualityThreshold: "",
    errorStopThreshold: "",
    humanReviewRule: "",
    fallbackPlan: "",
    startDate: "",
    endDate: "",
    reviewDate: "",
    decision: "pending",
    decisionOwner: "",
    approvalStatus: "not_requested",
  };
}

function nid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyUseCase(): HaiUseCaseRow {
  return { id: nid("uc"), title: "", actor: "", trigger: "", outcome: "", notes: "" };
}
export function emptyDataAccess(): HaiDataAccessRow {
  return {
    id: nid("da"),
    system: "",
    dataType: "",
    classification: "internal",
    accessNeeded: "",
    owner: "",
    approved: false,
    notes: "",
  };
}
export function emptyTestCase(): HaiTestCaseRow {
  return { id: nid("tc"), name: "", trigger: "", expected: "", actual: "", status: "not_started", owner: "", evidence: "", notes: "" };
}
export function emptyIssue(): HaiIssueRow {
  return { id: nid("iss"), title: "", exception: "", owner: "", status: "open", risk: "medium", dueAt: "", evidence: "", notes: "" };
}
export function emptyMetric(): HaiMetricRow {
  return { id: nid("kpi"), name: "", baseline: "", target: "", actual: "", period: "", notes: "" };
}
export function emptyHandover(): HaiHandoverRow {
  return { id: nid("ho"), asset: "", owner: "", sopStatus: "not_started", trainingStatus: "not_started", notes: "" };
}

export function webSectionPath(section: HaiSection) {
  return HAI_SECTION_PATH[section] || "/crm/hotel-ai";
}

export function webSectionFormTab(section: HaiSection): HaiFormTab {
  if (section === "pilots") return "charter";
  if (HAI_FORM_TABS.includes(section as HaiFormTab)) return section as HaiFormTab;
  return "workflow";
}

export function withHaiDepartmentFilter(searchParams: Promise<HaiListFilters>, department: string): Promise<HaiListFilters> {
  return searchParams.then((filters) => ({ ...filters, department }));
}

export const SECRET_ASSIGN_RE =
  /(api[_-\s]?key|secret[_-\s]?key|password|passwd|auth[_-\s]?token|access[_-\s]?token|bearer|account[_-\s]?id|booking[_-\s]?id|reservation[_-\s]?id|guest\s+(name|email|phone|data)|payment\s+(data|token|card)|credit\s*card|cvv|รหัสผ่าน|รหัส\s*API|โทเคน|เลขที่บัญชี)\s*[:=]\s*\S+/i;
export const SECRET_TOKEN_RE = /\b(sk_live_[A-Za-z0-9]+|pk_live_[A-Za-z0-9]+|sk_test_[A-Za-z0-9]+|rk_live_[A-Za-z0-9]+|Bearer\s+[A-Za-z0-9\-._]{12,})\b/;

export function textHasSecrets(value: string) {
  SECRET_ASSIGN_RE.lastIndex = 0;
  SECRET_TOKEN_RE.lastIndex = 0;
  return SECRET_ASSIGN_RE.test(value) || SECRET_TOKEN_RE.test(value) || /guest\s+(name|email|phone|data)\s*[:=]/i.test(value) || /payment\s+(data|token|card)\s*[:=]/i.test(value);
}

export function payloadHasSecrets(value: unknown): boolean {
  if (typeof value === "string") return textHasSecrets(value);
  if (Array.isArray(value)) return value.some(payloadHasSecrets);
  if (value && typeof value === "object") return Object.values(value).some(payloadHasSecrets);
  return false;
}

export function webErrorMessage(code: string) {
  const th: Record<string, string> = {
    missing: "ไม่พบรายการ",
    required: "กรอกชื่อเวิร์กโฟลว์หรือโรงแรม",
    forbidden: "ไม่มีสิทธิ์แก้ไขบอร์ดนี้",
    invalid: "ข้อมูลไม่ถูกต้อง",
    missing_name: "กรอกชื่อซับงาน",
    missing_comment: "กรอกความเห็น",
    missing_note: "กรอกบันทึกการอนุมัติ",
    invalid_url: "ลิงก์หลักฐานหรือคลังรหัสต้องเป็น URL ภายในหรือ https",
    blocked_secret: "ห้ามใส่คีย์ API รหัสผ่าน โทเคน ข้อมูลแขก รหัสการจอง หรือข้อมูลชำระเงิน — ใส่เฉพาะลิงก์คลังรหัสที่อนุมัติแล้ว",
    subtask_limit: "แต่ละเวิร์กโฟลว์มีงานย่อยได้ 1–10 รายการ",
    subtask_min: "เวิร์กโฟลว์ต้องมีซับงานอย่างน้อย 1 รายการ",
    vault_secret: "ช่องคลังรหัสเก็บได้เฉพาะชื่อหรือลิงก์ ไม่เก็บค่าลับ",
    missing_gate_note: "กรอกบันทึกก่อนอนุมัติ ปฏิเสธ หรือ escalate",
  };
  const en: Record<string, string> = {
    missing: "Record not found",
    required: "Enter a workflow or hotel name",
    forbidden: "You do not have permission to edit this board",
    invalid: "The data is not valid",
    missing_name: "Enter a subtask name",
    missing_comment: "Enter a comment",
    missing_note: "Enter an approval note",
    invalid_url: "Evidence and vault links must be an internal path or https URL",
    blocked_secret: "Do not store API keys, passwords, tokens, guest data, booking IDs, or payment data — use an approved vault link",
    subtask_limit: "Each workflow can have 1–10 subtasks",
    subtask_min: "A workflow needs at least one subtask",
    vault_secret: "The vault field stores a name or link only, never a secret value",
    missing_gate_note: "Enter a note before approve, reject, or escalate",
  };
  return th[code] || en[code] || code;
}
