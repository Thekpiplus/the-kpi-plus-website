export const SYS_DEPARTMENTS = ["marketing", "revenue", "distribution", "sales", "management"] as const;
export type SysDepartment = (typeof SYS_DEPARTMENTS)[number];

export const SYS_WORKSTREAMS = [
  "properties",
  "inventory",
  "architecture",
  "mapping",
  "readiness",
  "configuration",
  "testing",
  "issues",
  "distribution",
  "analytics",
  "handover",
  "approvals",
  "kpi",
] as const;
export type SysWorkstream = (typeof SYS_WORKSTREAMS)[number];

export const SYS_STATUSES = [
  "draft",
  "discovery",
  "awaiting_system_inventory",
  "mapping",
  "awaiting_provider_access",
  "configuration",
  "testing",
  "blocked",
  "retest_required",
  "awaiting_hotel_approval",
  "ready_for_go_live",
  "handed_over",
  "monitoring",
  "completed",
  "archived",
] as const;
export type SysStatus = (typeof SYS_STATUSES)[number];

export const SYS_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type SysPriority = (typeof SYS_PRIORITIES)[number];

export const SYS_SECTIONS = [
  "overview",
  "properties",
  "inventory",
  "architecture",
  "mapping",
  "readiness",
  "configuration",
  "testing",
  "issues",
  "distribution",
  "analytics",
  "handover",
  "approvals",
  "kpi",
  "settings",
] as const;
export type SysSection = (typeof SYS_SECTIONS)[number];

export const SYS_GROUP_BY = ["status", "hotel", "owner", "department", "system", "severity", "projectType"] as const;
export type SysGroupBy = (typeof SYS_GROUP_BY)[number];

export const SYS_SORTS = ["nextActionAt", "dueDate", "risk", "severity", "updatedAt"] as const;
export type SysSort = (typeof SYS_SORTS)[number];

export const SYS_FORM_TABS = [
  "overview",
  "inventory",
  "architecture",
  "mapping",
  "readiness",
  "configuration",
  "testing",
  "issues",
  "distribution",
  "analytics",
  "handover",
  "approvals",
  "files",
  "history",
] as const;
export type SysFormTab = (typeof SYS_FORM_TABS)[number];

export const SYS_SUBTASK_STATUSES = ["not_started", "in_progress", "blocked", "completed"] as const;
export type SysSubtaskStatus = (typeof SYS_SUBTASK_STATUSES)[number];

export const SYS_READINESS = ["not_started", "in_progress", "blocked", "ready_for_review", "completed"] as const;
export type SysReadiness = (typeof SYS_READINESS)[number];

export const SYS_PROJECT_TYPES = ["new_setup", "integration", "data_mapping", "troubleshooting", "handover"] as const;
export type SysProjectType = (typeof SYS_PROJECT_TYPES)[number];

export const SYS_RISKS = ["low", "medium", "high", "critical"] as const;
export type SysRisk = (typeof SYS_RISKS)[number];

export const SYS_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export type SysSeverity = (typeof SYS_SEVERITIES)[number];

export const SYS_ISSUE_STATUSES = ["open", "in_progress", "blocked", "retest", "resolved", "closed"] as const;
export type SysIssueStatus = (typeof SYS_ISSUE_STATUSES)[number];

export const SYS_INTEGRATION_STATUSES = [
  "not_configured",
  "needs_mapping",
  "pending_access",
  "requires_provider_support",
  "testing",
  "blocked",
  "connected",
] as const;
export type SysIntegrationStatus = (typeof SYS_INTEGRATION_STATUSES)[number];

export const SYS_MAPPING_STATUSES = ["mapped", "needs_mapping", "not_yet_verified", "requires_provider_support", "not_configured"] as const;
export type SysMappingStatus = (typeof SYS_MAPPING_STATUSES)[number];

export const SYS_ENVIRONMENTS = ["live", "staging", "sandbox", "unknown"] as const;
export type SysEnvironment = (typeof SYS_ENVIRONMENTS)[number];

export const SYS_LICENSE_STATUSES = ["licensed", "pending", "expired", "unknown"] as const;
export type SysLicenseStatus = (typeof SYS_LICENSE_STATUSES)[number];

export const SYS_DIRECTIONS = ["inbound", "outbound", "bidirectional"] as const;
export type SysDirection = (typeof SYS_DIRECTIONS)[number];

export const SYS_READINESS_AREAS = ["system", "data", "access", "integration", "testing", "ownership"] as const;
export type SysReadinessArea = (typeof SYS_READINESS_AREAS)[number];

export const SYS_DOC_STATUSES = ["not_started", "in_progress", "ready_for_review", "completed"] as const;
export type SysDocStatus = (typeof SYS_DOC_STATUSES)[number];

export const SYS_TEST_STATUSES = ["not_started", "in_progress", "blocked", "passed", "failed", "retest"] as const;
export type SysTestStatus = (typeof SYS_TEST_STATUSES)[number];

export const SYS_FIELD_REQUIRED = ["required", "optional"] as const;
export type SysFieldRequired = (typeof SYS_FIELD_REQUIRED)[number];

export const SYS_HOTEL_STATUSES = ["operating", "opening", "repositioning", "changing_systems"] as const;
export type SysHotelStatus = (typeof SYS_HOTEL_STATUSES)[number];

export const SYS_CADENCES = ["weekly", "monthly", "quarterly", "ad_hoc"] as const;
export type SysCadence = (typeof SYS_CADENCES)[number];

export const SYS_APPROVAL_STATUSES = ["not_requested", "awaiting", "approved", "changes_requested", "rejected"] as const;
export type SysApprovalStatus = (typeof SYS_APPROVAL_STATUSES)[number];

export const SYS_BUDGET_STATUSES = ["not_set", "proposed", "approved", "declined"] as const;
export type SysBudgetStatus = (typeof SYS_BUDGET_STATUSES)[number];

export const SYS_KPI_DATA_STATUSES = ["approved", "sample", "pending", "not_configured"] as const;
export type SysKpiDataStatus = (typeof SYS_KPI_DATA_STATUSES)[number];

export const SYS_ASSESSMENT_AREAS = ["direction", "commercial", "operations", "people", "guest", "measurement"] as const;
export type SysAssessmentArea = (typeof SYS_ASSESSMENT_AREAS)[number];

export const SYS_PLAN_PHASES = ["first_30", "days_31_60", "days_61_90", "ongoing"] as const;
export type SysPlanPhase = (typeof SYS_PLAN_PHASES)[number];

export const SYS_KPI_AREAS = ["commercial", "operations", "people", "guest", "marketing", "distribution"] as const;
export type SysKpiArea = (typeof SYS_KPI_AREAS)[number];

export const MIN_SYS_SUBTASKS = 1;
/** 1–10 subtasks per department workstream (Marketing, Revenue, Distribution, Sales, Management). */
export const MAX_SYS_SUBTASKS = 10;

export const MASKED_VALUE = "••••";

export const SYS_DEPARTMENT_LABEL: Record<SysDepartment, string> = {
  marketing: "Marketing",
  revenue: "Revenue",
  distribution: "Distribution",
  sales: "Sales",
  management: "Management",
};

export const SYS_WORKSTREAM_LABEL: Record<SysWorkstream, string> = {
  properties: "Properties",
  inventory: "System Inventory",
  architecture: "Architecture and Data Flow",
  mapping: "Data Mapping",
  readiness: "Integration Readiness",
  configuration: "Configuration",
  testing: "Testing and QA",
  issues: "Error and Issue Log",
  distribution: "Booking Engine / Distribution",
  analytics: "Analytics and Reporting",
  handover: "Handover and Ownership",
  approvals: "Approvals",
  kpi: "Reports / KPI",
};

export const SYS_SECTION_LABEL: Record<SysSection, string> = {
  overview: "Overview",
  properties: "Properties",
  inventory: "System Inventory",
  architecture: "Architecture and Data Flow",
  mapping: "Data Mapping",
  readiness: "Integration Readiness",
  configuration: "Configuration",
  testing: "Testing and QA",
  issues: "Error and Issue Log",
  distribution: "Booking Engine / Distribution",
  analytics: "Analytics and Reporting",
  handover: "Handover and Ownership",
  approvals: "Approvals",
  kpi: "Reports / KPI",
  settings: "Settings",
};

export const SYS_STATUS_LABEL: Record<SysStatus, string> = {
  draft: "Draft",
  discovery: "Discovery",
  awaiting_system_inventory: "Awaiting System Inventory",
  mapping: "Mapping",
  awaiting_provider_access: "Awaiting Provider Access",
  configuration: "Configuration",
  testing: "Testing",
  blocked: "Blocked",
  retest_required: "Retest Required",
  awaiting_hotel_approval: "Awaiting Hotel Approval",
  ready_for_go_live: "Ready for Go-live",
  handed_over: "Handed Over",
  monitoring: "Monitoring",
  completed: "Completed",
  archived: "Archived",
};

export const SYS_PRIORITY_LABEL: Record<SysPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const SYS_GROUP_LABEL: Record<SysGroupBy, string> = {
  status: "สถานะ",
  hotel: "โรงแรม",
  owner: "ผู้รับผิดชอบ",
  department: "แผนก",
  system: "ระบบ",
  severity: "ความรุนแรง",
  projectType: "ประเภทโปรเจกต์",
};

export const SYS_SORT_LABEL: Record<SysSort, string> = {
  nextActionAt: "Next action date",
  dueDate: "Due date",
  risk: "Risk",
  severity: "Severity",
  updatedAt: "Updated date",
};

export const SYS_FORM_TAB_LABEL: Record<SysFormTab, string> = {
  overview: "Overview",
  inventory: "System Inventory",
  architecture: "Architecture and Data Flow",
  mapping: "Data Mapping",
  readiness: "Integration Readiness",
  configuration: "Configuration",
  testing: "Testing and QA",
  issues: "Error and Issue Log",
  distribution: "Booking Engine / Distribution",
  analytics: "Analytics and Reporting",
  handover: "Handover and Ownership",
  approvals: "Approvals",
  files: "Files and Notes",
  history: "Audit History",
};

export const SYS_SUBTASK_STATUS_LABEL: Record<SysSubtaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  completed: "Completed",
};

export const SYS_READINESS_LABEL: Record<SysReadiness, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  ready_for_review: "Ready for review",
  completed: "Completed",
};

export const SYS_PROJECT_TYPE_LABEL: Record<SysProjectType, string> = {
  new_setup: "New Setup",
  integration: "Integration",
  data_mapping: "Data Mapping",
  troubleshooting: "Troubleshooting",
  handover: "Handover",
};

export const SYS_RISK_LABEL: Record<SysRisk, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const SYS_SEVERITY_LABEL: Record<SysSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const SYS_ISSUE_STATUS_LABEL: Record<SysIssueStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  blocked: "Blocked",
  retest: "Retest",
  resolved: "Resolved",
  closed: "Closed",
};

export const SYS_INTEGRATION_STATUS_LABEL: Record<SysIntegrationStatus, string> = {
  not_configured: "Not Configured",
  needs_mapping: "Needs Mapping",
  pending_access: "Pending Access",
  requires_provider_support: "Requires Provider Support",
  testing: "Testing",
  blocked: "Blocked",
  connected: "Connected",
};

export const SYS_MAPPING_STATUS_LABEL: Record<SysMappingStatus, string> = {
  mapped: "Mapped",
  needs_mapping: "Needs Mapping",
  not_yet_verified: "Not yet verified",
  requires_provider_support: "Requires provider support",
  not_configured: "Not Configured",
};

export const SYS_ENVIRONMENT_LABEL: Record<SysEnvironment, string> = {
  live: "Live",
  staging: "Staging",
  sandbox: "Sandbox",
  unknown: "Unknown",
};

export const SYS_LICENSE_STATUS_LABEL: Record<SysLicenseStatus, string> = {
  licensed: "Licensed",
  pending: "Pending",
  expired: "Expired",
  unknown: "Unknown",
};

export const SYS_DIRECTION_LABEL: Record<SysDirection, string> = {
  inbound: "Inbound",
  outbound: "Outbound",
  bidirectional: "Bidirectional",
};

export const SYS_READINESS_AREA_LABEL: Record<SysReadinessArea, string> = {
  system: "System",
  data: "Data",
  access: "Access",
  integration: "Integration",
  testing: "Testing",
  ownership: "Ownership",
};

export const SYS_DOC_STATUS_LABEL: Record<SysDocStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  ready_for_review: "Ready for review",
  completed: "Completed",
};

export const SYS_RISK_RANK: Record<SysRisk, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const SYS_SEVERITY_RANK: Record<SysSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const SYS_TEST_STATUS_LABEL: Record<SysTestStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  blocked: "Blocked",
  passed: "Passed",
  failed: "Failed",
  retest: "Retest",
};

export const SYS_FIELD_REQUIRED_LABEL: Record<SysFieldRequired, string> = {
  required: "Required",
  optional: "Optional",
};

export const SYS_HOTEL_STATUS_LABEL: Record<SysHotelStatus, string> = {
  operating: "Operating",
  opening: "Opening",
  repositioning: "Repositioning",
  changing_systems: "Changing systems",
};

export const SYS_CADENCE_LABEL: Record<SysCadence, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  ad_hoc: "Ad hoc",
};

export const SYS_APPROVAL_LABEL: Record<SysApprovalStatus, string> = {
  not_requested: "ยังไม่ขออนุมัติ",
  awaiting: "รออนุมัติ",
  approved: "อนุมัติแล้ว",
  changes_requested: "ขอแก้ไข",
  rejected: "ไม่อนุมัติ",
};

export const SYS_BUDGET_STATUS_LABEL: Record<SysBudgetStatus, string> = {
  not_set: "ยังไม่ตั้ง",
  proposed: "เสนอแล้ว",
  approved: "อนุมัติงบ",
  declined: "ไม่อนุมัติงบ",
};

export const SYS_KPI_DATA_STATUS_LABEL: Record<SysKpiDataStatus, string> = {
  approved: "Approved",
  sample: "Sample",
  pending: "Pending",
  not_configured: "Not Configured",
};

export const SYS_ASSESSMENT_AREA_LABEL: Record<SysAssessmentArea, string> = {
  direction: "Direction",
  commercial: "Commercial",
  operations: "Operations",
  people: "People",
  guest: "Guest Experience",
  measurement: "Measurement",
};

export const SYS_PLAN_PHASE_LABEL: Record<SysPlanPhase, string> = {
  first_30: "First 30 Days",
  days_31_60: "Days 31–60",
  days_61_90: "Days 61–90",
  ongoing: "Ongoing",
};

export const SYS_KPI_AREA_LABEL: Record<SysKpiArea, string> = {
  commercial: "Commercial",
  operations: "Operations",
  people: "People",
  guest: "Guest Experience",
  marketing: "Marketing",
  distribution: "Distribution",
};

export const SYS_PRIORITY_RANK: Record<SysPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const SYS_SECTION_WORKSTREAM: Partial<Record<SysSection, SysWorkstream>> = {
  properties: "properties",
  inventory: "inventory",
  architecture: "architecture",
  mapping: "mapping",
  readiness: "readiness",
  configuration: "configuration",
  testing: "testing",
  issues: "issues",
  distribution: "distribution",
  analytics: "analytics",
  handover: "handover",
  approvals: "approvals",
  kpi: "kpi",
};

export const SYS_DEPARTMENT_DUTIES: Record<SysDepartment, string[]> = {
  marketing: [
    "Website/content system requirements",
    "Campaign/source data context",
    "Tracking and reporting needs",
    "Guest communication requirements",
  ],
  revenue: [
    "Rate, offer, inventory, and reporting requirements",
    "Revenue data definitions",
    "Commercial KPI mapping",
    "Forecast/reporting needs",
  ],
  distribution: [
    "Channel Manager",
    "OTA/distribution",
    "Rate and availability flow",
    "Booking Engine handoff",
    "Provider coordination",
  ],
  sales: [
    "Lead/source data",
    "Partner/market requirements",
    "CRM or contact flow",
    "Sales reporting needs",
  ],
  management: [
    "Scope and budget approval",
    "System selection decision",
    "Data ownership",
    "Go-live approval",
    "Risk acceptance and final direction",
  ],
};

export const SYS_STARTER_SUBTASKS: Array<{ department: SysDepartment; name: string }> = SYS_DEPARTMENTS.flatMap((department) =>
  SYS_DEPARTMENT_DUTIES[department].map((name) => ({ department, name })),
);

export function sysDepartmentSubtasks<T extends { department: string }>(items: T[], department: string) {
  return items.filter((item) => item.department === department);
}

export const SYS_DEFAULT_QA: string[] = [
  "System inventory is written without passwords or API keys",
  "Data mapping is named and owned",
  "Provider access is requested, not stored as a credential",
  "Test cases have expected results and evidence notes",
  "Issues are logged without guest or payment data",
  "Handover owners and documentation status are recorded",
];

export const SYS_DEFAULT_HANDOVER: string[] = [
  "Website / CMS owner",
  "PMS owner",
  "Channel Manager owner",
  "Booking Engine owner",
  "Analytics owner",
  "API / connector access owner",
  "Hotel approver named",
];

export type SysAccessView = {
  userId: string;
  departments: SysDepartment[];
  canEditBoard: boolean;
  canManageSettings: boolean;
  canSeePrivateIds: boolean;
  isManagement: boolean;
};

export type SysSourceView = {
  id: string;
  name: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  notes: string;
};

export type SysKpiView = {
  id: string;
  name: string;
  area: SysKpiArea;
  period: string;
  value: string;
  definition: string;
  source: string;
  dataStatus: SysKpiDataStatus;
  market: string;
  target: string;
  owner: string;
  notes: string;
  updatedAt: string;
};

export type SysAuditView = {
  id: string;
  action: string;
  detail: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
};

export type SysSubtaskCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type SysSubtaskFileView = {
  id: string;
  filename: string;
  caption: string;
  size: number;
  createdAt: string;
  href: string;
};

export type SysSubtaskView = {
  id: string;
  propertyId: string;
  name: string;
  department: SysDepartment;
  ownerId: string;
  ownerName: string;
  status: SysSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: SysPriority;
  comments: string;
  source: string;
  providerDependency: string;
  thread: SysSubtaskCommentView[];
  files: SysSubtaskFileView[];
};

export type SysSubtaskProgress = {
  total: number;
  completed: number;
  percent: number;
  readiness: SysReadiness;
  countLabel: string;
};

export type SysChecklistItem = {
  id: string;
  label: string;
  status: SysReadiness;
  notes: string;
  owner: string;
};

export type SysApprovalView = {
  id: string;
  kind: string;
  status: SysApprovalStatus;
  notes: string;
  requestedBy: string;
  decidedBy: string;
  createdAt: string;
};

export type SysFileNote = {
  id: string;
  name: string;
  caption: string;
  status: SysReadiness;
};

export type SysSectionBlock = {
  summary: string;
  owner: string;
  status: SysReadiness;
  notes: string;
  items: SysChecklistItem[];
};

export type SysAssessmentView = {
  id: string;
  area: SysAssessmentArea;
  question: string;
  currentState: string;
  evidence: string;
  risk: SysPriority;
  recommendedAction: string;
  owner: string;
  department: SysDepartment | "";
  dueAt: string;
  approvalStatus: SysApprovalStatus;
  status: SysSubtaskStatus;
};

export type SysPlanView = {
  id: string;
  phase: SysPlanPhase;
  objective: string;
  action: string;
  owner: string;
  department: SysDepartment | "";
  startAt: string;
  dueAt: string;
  priority: SysPriority;
  status: SysSubtaskStatus;
  dependency: string;
  kpi: string;
  target: string;
  measurement: string;
  approvalStatus: SysApprovalStatus;
  notes: string;
};

export type SysMeetingView = {
  id: string;
  meetingType: SysCadence;
  property: string;
  date: string;
  participants: string;
  agenda: string;
  decisions: string;
  actionItems: string;
  owner: string;
  dueAt: string;
  status: SysSubtaskStatus;
  notes: string;
};

export type SysActionLogView = {
  id: string;
  name: string;
  property: string;
  workstream: SysWorkstream | "";
  owner: string;
  department: SysDepartment | "";
  priority: SysPriority;
  status: SysSubtaskStatus;
  dueAt: string;
  relatedKpi: string;
  decision: string;
  notes: string;
};

export type SysPeopleRoleView = {
  id: string;
  role: string;
  name: string;
  department: SysDepartment | "";
  owner: string;
  status: SysReadiness;
  notes: string;
};

export type SysInventoryRow = {
  id: string;
  system: string;
  provider: string;
  purpose: string;
  owner: string;
  dataIn: string;
  dataOut: string;
  apiConnector: string;
  environment: SysEnvironment;
  licenseStatus: SysLicenseStatus;
  integrationStatus: SysIntegrationStatus;
  lastReviewed: string;
  notes: string;
};

export type SysArchitectureRow = {
  id: string;
  node: string;
  source: string;
  destination: string;
  dataCategory: string;
  direction: SysDirection;
  frequency: string;
  connector: string;
  mappingStatus: SysMappingStatus;
  owner: string;
  risk: SysRisk;
  notes: string;
};

export type SysMappingRow = {
  id: string;
  sourceField: string;
  destinationField: string;
  businessMeaning: string;
  formatType: string;
  required: SysFieldRequired;
  example: string;
  mappingStatus: SysMappingStatus;
  owner: string;
  providerDependency: string;
  notes: string;
};

export type SysReadinessRow = {
  id: string;
  area: SysReadinessArea;
  question: string;
  evidence: string;
  status: SysReadiness;
  owner: string;
  nextAction: string;
  dueAt: string;
  approvalStatus: SysApprovalStatus;
};

export type SysTestCaseRow = {
  id: string;
  testCase: string;
  trigger: string;
  expected: string;
  actual: string;
  status: SysTestStatus;
  severity: SysSeverity;
  owner: string;
  providerDependency: string;
  evidence: string;
  testedAt: string;
  retestAt: string;
  notes: string;
};

export type SysIssueRow = {
  id: string;
  issue: string;
  project: string;
  system: string;
  severity: SysSeverity;
  impact: string;
  owner: string;
  provider: string;
  status: SysIssueStatus;
  openedAt: string;
  dueAt: string;
  resolution: string;
  evidence: string;
  notes: string;
};

export type SysHandoverAsset = {
  id: string;
  asset: string;
  owner: string;
  technicalContact: string;
  approvalAuthority: string;
  accessLevel: string;
  documentationStatus: SysDocStatus;
  sopStatus: SysDocStatus;
  trainingStatus: SysDocStatus;
  goLiveStatus: SysReadiness;
  lastReviewed: string;
};

export type SysProjectRow = {
  id: string;
  projectName: string;
  hotelName: string;
  propertyType: SysProjectType;
  roomCount: string;
  websiteUrl: string;
  pms: string;
  channelManager: string;
  bookingEngine: string;
  otherSystems: string;
  locationMarket: string;
  hotelStatus: SysHotelStatus;
  primaryGoal: string;
  mainChallenge: string;
  startDate: string;
  launchDate: string;
  status: SysStatus;
  ownerId: string;
  ownerName: string;
  department: SysDepartment;
  workstream: SysWorkstream;
  priority: SysPriority;
  risk: SysRisk;
  scope: string;
  hotelApprover: string;
  providerContact: string;
  nextAction: string;
  nextActionAt: string;
  kpiCadence: SysCadence;
  dataStatus: SysKpiDataStatus;
  createdAt: string;
  updatedAt: string;
  notes: string;
  primaryKpi: string;
  kpiTarget: string;
  handoverStatus: SysReadiness;
  privateMasked: boolean;
  inventory: SysInventoryRow[];
  architecture: SysArchitectureRow[];
  mapping: SysMappingRow[];
  readinessItems: SysReadinessRow[];
  configuration: SysSectionBlock;
  tests: SysTestCaseRow[];
  issues: SysIssueRow[];
  distributionOps: SysSectionBlock;
  analyticsNotes: SysSectionBlock;
  handoverAssets: SysHandoverAsset[];
  qa: SysChecklistItem[];
  handover: SysChecklistItem[];
  fileNotes: SysFileNote[];
  approvals: SysApprovalView[];
  sources: SysSourceView[];
  kpis: SysKpiView[];
  history: SysAuditView[];
  subtasks: SysSubtaskView[];
  progress: SysSubtaskProgress;
  dueDate: string;
  primarySystem: string;
  primarySeverity: SysSeverity;
};

export type SysListFilters = {
  q?: string;
  status?: string;
  ownerId?: string;
  department?: string;
  hotel?: string;
  workstream?: string;
  projectType?: string;
  system?: string;
  severity?: string;
  risk?: string;
  market?: string;
  cadence?: string;
  priority?: string;
  group?: string;
  sort?: string;
  view?: string;
};

const LEGACY_STATUS: Record<string, SysStatus> = {
  draft: "draft",
  discovery: "discovery",
  not_configured: "awaiting_system_inventory",
  pending_access: "awaiting_provider_access",
  needs_mapping: "mapping",
  requires_provider_support: "awaiting_provider_access",
  testing: "testing",
  connected: "ready_for_go_live",
  assessment_scheduled: "discovery",
  assessing: "discovery",
  awaiting_hotel_data: "awaiting_system_inventory",
  scope_alignment: "mapping",
  plan_ready: "configuration",
  in_progress: "configuration",
  in_review: "testing",
  awaiting_approval: "awaiting_hotel_approval",
  awaiting_hotel_approval: "awaiting_hotel_approval",
  retest_required: "retest_required",
  ready_for_go_live: "ready_for_go_live",
  handed_over: "handed_over",
  monitoring: "monitoring",
  completed: "completed",
  blocked: "blocked",
  archived: "archived",
  audit_scheduled: "discovery",
  review_scheduled: "discovery",
  content_needed: "awaiting_system_inventory",
  waiting_hotel: "awaiting_system_inventory",
  structure_review: "discovery",
  auditing: "discovery",
  design_review: "discovery",
  action_planned: "mapping",
  priority_planned: "mapping",
  development: "configuration",
  changes_in_progress: "configuration",
  integration: "configuration",
  ready_approval: "awaiting_hotel_approval",
  ready_to_test: "testing",
  qa: "testing",
  ready_for_handover: "ready_for_go_live",
  measuring: "monitoring",
  tracking: "monitoring",
  live: "completed",
  published: "completed",
};

const LEGACY_WORKSTREAM: Record<string, SysWorkstream> = {
  project: "properties",
  properties: "properties",
  discovery: "mapping",
  message: "mapping",
  review: "mapping",
  assessments: "mapping",
  cms: "configuration",
  room: "inventory",
  seo: "analytics",
  price: "analytics",
  friction: "mapping",
  booking: "distribution",
  plans: "configuration",
  ux: "testing",
  mobile: "testing",
  tracking: "analytics",
  guest: "testing",
  people: "handover",
  qa: "testing",
  optimize: "analytics",
  experiments: "testing",
  commercial: "analytics",
  marketing: "analytics",
  distribution: "distribution",
  operations: "configuration",
  reports: "kpi",
  measure: "kpi",
  kpi: "kpi",
  meetings: "approvals",
  actions: "issues",
  approvals: "approvals",
  handover: "handover",
  inventory: "inventory",
  architecture: "architecture",
  mapping: "mapping",
  readiness: "readiness",
  configuration: "configuration",
  testing: "testing",
  issues: "issues",
  analytics: "analytics",
};

const LEGACY_PROJECT_TYPE: Record<string, SysProjectType> = {
  independent: "new_setup",
  boutique: "new_setup",
  resort: "new_setup",
  city: "new_setup",
  opening: "new_setup",
  other: "integration",
  improve: "troubleshooting",
  rebuild: "new_setup",
  improve_existing: "troubleshooting",
  website_review: "troubleshooting",
  management_review: "handover",
  booking_path: "integration",
  new_setup: "new_setup",
  integration: "integration",
  data_mapping: "data_mapping",
  troubleshooting: "troubleshooting",
  handover: "handover",
};

const LEGACY_PRIORITY_TO_RISK: Record<string, SysRisk> = {
  urgent: "critical",
  high: "high",
  normal: "medium",
  low: "low",
  critical: "critical",
  medium: "medium",
};

const LEGACY_KPI_STATUS: Record<string, SysKpiDataStatus> = {
  draft: "pending",
  sample: "sample",
  approved: "approved",
  pending: "pending",
  not_configured: "not_configured",
};

const LEGACY_ASSESSMENT_AREA: Record<string, SysAssessmentArea> = {
  message: "direction",
  room: "operations",
  price: "commercial",
  mobile: "guest",
  handoff: "people",
  tracking: "measurement",
  direction: "direction",
  commercial: "commercial",
  operations: "operations",
  people: "people",
  guest: "guest",
  measurement: "measurement",
};

export function isDepartment(value: string): value is SysDepartment {
  return SYS_DEPARTMENTS.includes(value as SysDepartment);
}

export function isWorkstream(value: string): value is SysWorkstream {
  return SYS_WORKSTREAMS.includes(value as SysWorkstream);
}

export function isSysStatus(value: string): value is SysStatus {
  return SYS_STATUSES.includes(value as SysStatus);
}

export function isPriority(value: string): value is SysPriority {
  return SYS_PRIORITIES.includes(value as SysPriority);
}

export function isGroupBy(value: string): value is SysGroupBy {
  return SYS_GROUP_BY.includes(value as SysGroupBy);
}

export function isSort(value: string): value is SysSort {
  return SYS_SORTS.includes(value as SysSort);
}

export function isKpiDataStatus(value: string): value is SysKpiDataStatus {
  return SYS_KPI_DATA_STATUSES.includes(value as SysKpiDataStatus);
}

export function isSubtaskStatus(value: string): value is SysSubtaskStatus {
  return SYS_SUBTASK_STATUSES.includes(value as SysSubtaskStatus);
}

export function isProjectType(value: string): value is SysProjectType {
  return SYS_PROJECT_TYPES.includes(value as SysProjectType);
}

export function isApprovalStatus(value: string): value is SysApprovalStatus {
  return SYS_APPROVAL_STATUSES.includes(value as SysApprovalStatus);
}

export function isBudgetStatus(value: string): value is SysBudgetStatus {
  return SYS_BUDGET_STATUSES.includes(value as SysBudgetStatus);
}

export function isReadiness(value: string): value is SysReadiness {
  return SYS_READINESS.includes(value as SysReadiness);
}

export function isHotelStatus(value: string): value is SysHotelStatus {
  return SYS_HOTEL_STATUSES.includes(value as SysHotelStatus);
}

export function isCadence(value: string): value is SysCadence {
  return SYS_CADENCES.includes(value as SysCadence);
}

export function isAssessmentArea(value: string): value is SysAssessmentArea {
  return SYS_ASSESSMENT_AREAS.includes(value as SysAssessmentArea);
}

export function isPlanPhase(value: string): value is SysPlanPhase {
  return SYS_PLAN_PHASES.includes(value as SysPlanPhase);
}

export function isKpiArea(value: string): value is SysKpiArea {
  return SYS_KPI_AREAS.includes(value as SysKpiArea);
}

export function isRisk(value: string): value is SysRisk {
  return SYS_RISKS.includes(value as SysRisk);
}

export function isSeverity(value: string): value is SysSeverity {
  return SYS_SEVERITIES.includes(value as SysSeverity);
}

export function isIssueStatus(value: string): value is SysIssueStatus {
  return SYS_ISSUE_STATUSES.includes(value as SysIssueStatus);
}

export function isIntegrationStatus(value: string): value is SysIntegrationStatus {
  return SYS_INTEGRATION_STATUSES.includes(value as SysIntegrationStatus);
}

export function isMappingStatus(value: string): value is SysMappingStatus {
  return SYS_MAPPING_STATUSES.includes(value as SysMappingStatus);
}

export function isEnvironment(value: string): value is SysEnvironment {
  return SYS_ENVIRONMENTS.includes(value as SysEnvironment);
}

export function isLicenseStatus(value: string): value is SysLicenseStatus {
  return SYS_LICENSE_STATUSES.includes(value as SysLicenseStatus);
}

export function isDirection(value: string): value is SysDirection {
  return SYS_DIRECTIONS.includes(value as SysDirection);
}

export function isReadinessArea(value: string): value is SysReadinessArea {
  return SYS_READINESS_AREAS.includes(value as SysReadinessArea);
}

export function isDocStatus(value: string): value is SysDocStatus {
  return SYS_DOC_STATUSES.includes(value as SysDocStatus);
}

export function isTestStatus(value: string): value is SysTestStatus {
  return SYS_TEST_STATUSES.includes(value as SysTestStatus);
}

export function isFieldRequired(value: string): value is SysFieldRequired {
  return SYS_FIELD_REQUIRED.includes(value as SysFieldRequired);
}

export function normalizeStatus(value: string): SysStatus {
  if (isSysStatus(value)) return value;
  return LEGACY_STATUS[value] || "draft";
}

export function normalizeWorkstream(value: string): SysWorkstream {
  if (isWorkstream(value)) return value;
  return LEGACY_WORKSTREAM[value] || "properties";
}

export function normalizeProjectType(value: string): SysProjectType {
  if (isProjectType(value)) return value;
  const key = value.trim().toLowerCase();
  return LEGACY_PROJECT_TYPE[key] || "new_setup";
}

export function normalizeRisk(value: string): SysRisk {
  if (isRisk(value)) return value;
  return LEGACY_PRIORITY_TO_RISK[value] || "medium";
}

export function normalizeSeverity(value: string): SysSeverity {
  if (isSeverity(value)) return value;
  if (value === "urgent" || value === "normal") return value === "urgent" ? "critical" : "medium";
  return "medium";
}

export function normalizeIssueStatus(value: string): SysIssueStatus {
  if (isIssueStatus(value)) return value;
  if (value === "completed" || value === "done") return "resolved";
  if (value === "not_started") return "open";
  return isSubtaskStatus(value) ? (value === "blocked" ? "blocked" : "in_progress") : "open";
}

export function normalizeTestStatus(value: string): SysTestStatus {
  if (isTestStatus(value)) return value;
  if (value === "completed" || value === "passed") return "passed";
  if (value === "failed") return "failed";
  if (value === "blocked") return "blocked";
  if (value === "retest" || value === "retest_required") return "retest";
  if (value === "in_progress") return "in_progress";
  return "not_started";
}

export function normalizeMappingStatus(value: string): SysMappingStatus {
  if (isMappingStatus(value)) return value;
  if (value === "completed" || value === "connected" || value === "mapped") return "mapped";
  if (value === "blocked") return "requires_provider_support";
  if (value === "testing" || value === "in_progress") return "not_yet_verified";
  return "needs_mapping";
}

export function normalizeIntegrationStatus(value: string): SysIntegrationStatus {
  if (isIntegrationStatus(value)) return value;
  const mapped = normalizeStatus(value);
  if (mapped === "awaiting_provider_access") return "pending_access";
  if (mapped === "mapping") return "needs_mapping";
  if (mapped === "testing" || mapped === "retest_required") return "testing";
  if (mapped === "blocked") return "blocked";
  if (mapped === "ready_for_go_live" || mapped === "handed_over" || mapped === "completed" || mapped === "monitoring") return "connected";
  return "not_configured";
}

export function normalizeReadiness(value: string): SysReadiness {
  return isReadiness(value) ? value : "not_started";
}

export function normalizeSubtaskStatus(value: string): SysSubtaskStatus {
  if (value === "done" || value === "complete" || value === "ready_for_review") return value === "ready_for_review" ? "in_progress" : "completed";
  return isSubtaskStatus(value) ? value : "not_started";
}

export function normalizeHotelStatus(value: string): SysHotelStatus {
  if (isHotelStatus(value)) return value;
  if (value === "opening" || value === "rebuild") return "opening";
  return "operating";
}

export function normalizeCadence(value: string): SysCadence {
  if (isCadence(value)) return value;
  if (value === "week") return "weekly";
  if (value === "month") return "monthly";
  if (value === "quarter") return "quarterly";
  return "monthly";
}

export function normalizeKpiDataStatus(value: string): SysKpiDataStatus {
  if (isKpiDataStatus(value)) return value;
  return LEGACY_KPI_STATUS[value] || "pending";
}

export function normalizeAssessmentArea(value: string): SysAssessmentArea {
  if (isAssessmentArea(value)) return value;
  return LEGACY_ASSESSMENT_AREA[value] || "direction";
}

export function normalizePlanPhase(value: string): SysPlanPhase {
  return isPlanPhase(value) ? value : "first_30";
}

export function normalizeKpiArea(value: string): SysKpiArea {
  return isKpiArea(value) ? value : "commercial";
}

const SYS_SECTION_PATH: Record<SysSection, string> = {
  overview: "/crm/systems",
  properties: "/crm/systems/properties",
  inventory: "/crm/systems/inventory",
  architecture: "/crm/systems/architecture",
  mapping: "/crm/systems/mapping",
  readiness: "/crm/systems/readiness",
  configuration: "/crm/systems/configuration",
  testing: "/crm/systems/testing",
  issues: "/crm/systems/issues",
  distribution: "/crm/systems/distribution",
  analytics: "/crm/systems/analytics",
  handover: "/crm/systems/handover",
  approvals: "/crm/systems/approvals",
  kpi: "/crm/systems/kpi",
  settings: "/crm/systems/settings",
};

export function webSectionPath(section: SysSection) {
  return SYS_SECTION_PATH[section] || "/crm/systems";
}

export function webSectionFormTab(section: SysSection): SysFormTab {
  if (section === "kpi") return "analytics";
  if (SYS_FORM_TABS.includes(section as SysFormTab)) return section as SysFormTab;
  return "overview";
}

export function emptySectionBlock(): SysSectionBlock {
  return { summary: "", owner: "", status: "not_started", notes: "", items: [] };
}

function nid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function emptyInventoryRow(): SysInventoryRow {
  return {
    id: nid("inv"),
    system: "",
    provider: "",
    purpose: "",
    owner: "",
    dataIn: "",
    dataOut: "",
    apiConnector: "",
    environment: "unknown",
    licenseStatus: "unknown",
    integrationStatus: "not_configured",
    lastReviewed: "",
    notes: "",
  };
}

export function emptyArchitectureRow(): SysArchitectureRow {
  return {
    id: nid("arc"),
    node: "",
    source: "",
    destination: "",
    dataCategory: "",
    direction: "bidirectional",
    frequency: "",
    connector: "",
    mappingStatus: "needs_mapping",
    owner: "",
    risk: "medium",
    notes: "",
  };
}

export function emptyMappingRow(): SysMappingRow {
  return {
    id: nid("map"),
    sourceField: "",
    destinationField: "",
    businessMeaning: "",
    formatType: "",
    required: "optional",
    example: "",
    mappingStatus: "needs_mapping",
    owner: "",
    providerDependency: "",
    notes: "",
  };
}

export function emptyReadinessRow(area: SysReadinessArea = "system"): SysReadinessRow {
  return {
    id: nid("rdy"),
    area,
    question: "",
    evidence: "",
    status: "not_started",
    owner: "",
    nextAction: "",
    dueAt: "",
    approvalStatus: "not_requested",
  };
}

export function emptyTestCase(): SysTestCaseRow {
  return {
    id: nid("tc"),
    testCase: "",
    trigger: "",
    expected: "",
    actual: "",
    status: "not_started",
    severity: "medium",
    owner: "",
    providerDependency: "",
    evidence: "",
    testedAt: "",
    retestAt: "",
    notes: "",
  };
}

export function emptyIssue(project = ""): SysIssueRow {
  return {
    id: nid("iss"),
    issue: "",
    project,
    system: "",
    severity: "medium",
    impact: "",
    owner: "",
    provider: "",
    status: "open",
    openedAt: "",
    dueAt: "",
    resolution: "",
    evidence: "",
    notes: "",
  };
}

export function emptyHandoverAsset(asset = ""): SysHandoverAsset {
  return {
    id: nid("ha"),
    asset,
    owner: "",
    technicalContact: "",
    approvalAuthority: "",
    accessLevel: "",
    documentationStatus: "not_started",
    sopStatus: "not_started",
    trainingStatus: "not_started",
    goLiveStatus: "not_started",
    lastReviewed: "",
  };
}

export function emptyAssessment(department: SysDepartment | "" = "management"): SysAssessmentView {
  return {
    id: `as_${Math.random().toString(36).slice(2, 10)}`,
    area: "direction",
    question: "",
    currentState: "",
    evidence: "",
    risk: "normal",
    recommendedAction: "",
    owner: "",
    department,
    dueAt: "",
    approvalStatus: "not_requested",
    status: "not_started",
  };
}

export function emptyPlan(department: SysDepartment | "" = "management"): SysPlanView {
  return {
    id: `pl_${Math.random().toString(36).slice(2, 10)}`,
    phase: "first_30",
    objective: "",
    action: "",
    owner: "",
    department,
    startAt: "",
    dueAt: "",
    priority: "normal",
    status: "not_started",
    dependency: "",
    kpi: "",
    target: "",
    measurement: "",
    approvalStatus: "not_requested",
    notes: "",
  };
}

export function emptyMeeting(property = ""): SysMeetingView {
  return {
    id: `mt_${Math.random().toString(36).slice(2, 10)}`,
    meetingType: "weekly",
    property,
    date: "",
    participants: "",
    agenda: "",
    decisions: "",
    actionItems: "",
    owner: "",
    dueAt: "",
    status: "not_started",
    notes: "",
  };
}

export function emptyActionLog(property = "", workstream: SysWorkstream | "" = "issues"): SysActionLogView {
  return {
    id: `al_${Math.random().toString(36).slice(2, 10)}`,
    name: "",
    property,
    workstream,
    owner: "",
    department: "management",
    priority: "normal",
    status: "not_started",
    dueAt: "",
    relatedKpi: "",
    decision: "",
    notes: "",
  };
}

export function emptyPeopleRole(): SysPeopleRoleView {
  return {
    id: `pr_${Math.random().toString(36).slice(2, 10)}`,
    role: "",
    name: "",
    department: "management",
    owner: "",
    status: "not_started",
    notes: "",
  };
}

export function emptyKpi(): SysKpiView {
  return {
    id: `kpi_${Math.random().toString(36).slice(2, 10)}`,
    name: "",
    area: "commercial",
    period: "",
    value: "",
    definition: "",
    source: "",
    dataStatus: "not_configured",
    market: "",
    target: "",
    owner: "",
    notes: "",
    updatedAt: "",
  };
}

export function earliestDueDate(
  row: Pick<SysProjectRow, "launchDate" | "nextActionAt" | "readinessItems" | "issues" | "tests">,
) {
  const dates = [
    row.nextActionAt,
    row.launchDate,
    ...row.readinessItems.map((item) => item.dueAt),
    ...row.issues.map((item) => item.dueAt),
    ...row.tests.map((item) => item.retestAt || item.testedAt),
  ].filter(Boolean);
  return dates.sort()[0] || "";
}

const SECRET_ASSIGN_RE =
  /(api[_-\s]?key|secret[_-\s]?key|password|passwd|auth[_-\s]?token|access[_-\s]?token|bearer|account[_-\s]?id|booking[_-\s]?id|reservation[_-\s]?id|guest\s+(name|email|phone|data)|payment\s+(data|token|card)|credit\s*card|cvv|รหัสผ่าน|รหัส\s*API|โทเคน|เลขที่บัญชี)\s*[:=]\s*\S+/i;
const SECRET_TOKEN_RE = /\b(sk_live_|pk_live_|sk_test_|rk_live_|Bearer\s+[A-Za-z0-9\-._]{12,})\b/;

export function textHasSecrets(value: string) {
  return SECRET_ASSIGN_RE.test(value) || SECRET_TOKEN_RE.test(value);
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
    required: "กรอกชื่อทรัพย์สินหรือชื่อโรงแรม",
    forbidden: "ไม่มีสิทธิ์แก้ไขบอร์ดนี้",
    invalid: "ข้อมูลไม่ถูกต้อง",
    missing_name: "กรอกชื่อซับงาน",
    missing_comment: "กรอกความเห็น",
    missing_file: "เลือกไฟล์ก่อนแนบ",
    invalid_file: "ไฟล์ไม่รองรับหรือใหญ่เกิน 5MB",
    subtask_limit: "แต่ละแผนกมีงานย่อยได้ 1–10 รายการ",
    subtask_min: "โปรเจกต์ต้องมีซับงานอย่างน้อย 1 รายการ",
    missing_note: "กรอกบันทึกการอนุมัติ",
    invalid_url: "ลิงก์หลักฐานต้องเป็น URL หรืออ้างอิงไฟล์ภายใน",
    blocked_secret: "ห้ามใส่คีย์ API รหัสผ่าน โทเคน ข้อมูลแขก รหัสการจอง หรือข้อมูลชำระเงิน",
  };
  const en: Record<string, string> = {
    missing: "Record not found",
    required: "Enter a property or hotel name",
    forbidden: "You do not have permission to edit this board",
    invalid: "The data is not valid",
    missing_name: "Enter a subtask name",
    missing_comment: "Enter a comment",
    missing_file: "Choose a file before attaching",
    invalid_file: "The file is not supported or is larger than 5MB",
    subtask_limit: "Each department workstream can have 1–10 subtasks",
    subtask_min: "A project must keep at least 1 subtask",
    missing_note: "Enter an approval note",
    invalid_url: "Evidence must be a URL or an internal screenshot reference",
    blocked_secret: "Do not store API keys, passwords, tokens, guest data, booking IDs, or payment data",
  };
  const thai = th[code] || code || "บันทึกไม่สำเร็จ";
  const english = en[code] || "Save failed";
  return `${thai} / ${english}`;
}
