export const MGMT_DEPARTMENTS = ["marketing", "revenue", "distribution", "sales", "management"] as const;
export type MgmtDepartment = (typeof MGMT_DEPARTMENTS)[number];

export const MGMT_WORKSTREAMS = [
  "properties",
  "assessments",
  "plans",
  "commercial",
  "marketing",
  "distribution",
  "operations",
  "guest",
  "people",
  "meetings",
  "kpi",
  "actions",
  "approvals",
  "handover",
] as const;
export type MgmtWorkstream = (typeof MGMT_WORKSTREAMS)[number];

export const MGMT_STATUSES = [
  "draft",
  "assessment_scheduled",
  "assessing",
  "awaiting_hotel_data",
  "scope_alignment",
  "plan_ready",
  "in_progress",
  "in_review",
  "awaiting_approval",
  "monitoring",
  "completed",
  "blocked",
  "archived",
] as const;
export type MgmtStatus = (typeof MGMT_STATUSES)[number];

export const MGMT_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type MgmtPriority = (typeof MGMT_PRIORITIES)[number];

export const MGMT_SECTIONS = [
  "overview",
  "properties",
  "assessments",
  "plans",
  "commercial",
  "marketing",
  "distribution",
  "operations",
  "guest",
  "people",
  "meetings",
  "kpi",
  "actions",
  "approvals",
  "handover",
  "settings",
] as const;
export type MgmtSection = (typeof MGMT_SECTIONS)[number];

export const MGMT_GROUP_BY = ["status", "hotel", "owner", "department", "workstream", "priority", "cadence"] as const;
export type MgmtGroupBy = (typeof MGMT_GROUP_BY)[number];

export const MGMT_SORTS = ["nextActionAt", "dueDate", "priority", "updatedAt"] as const;
export type MgmtSort = (typeof MGMT_SORTS)[number];

export const MGMT_FORM_TABS = [
  "overview",
  "assessment",
  "plan",
  "commercial",
  "marketing",
  "distribution",
  "operations",
  "guest",
  "people",
  "meetings",
  "kpi",
  "actions",
  "approvals",
  "handover",
  "files",
  "history",
] as const;
export type MgmtFormTab = (typeof MGMT_FORM_TABS)[number];

export const MGMT_SUBTASK_STATUSES = ["not_started", "in_progress", "blocked", "completed"] as const;
export type MgmtSubtaskStatus = (typeof MGMT_SUBTASK_STATUSES)[number];

export const MGMT_READINESS = ["not_started", "in_progress", "blocked", "ready_for_review", "completed"] as const;
export type MgmtReadiness = (typeof MGMT_READINESS)[number];

export const MGMT_PROJECT_TYPES = ["independent", "boutique", "resort", "city", "opening", "other"] as const;
export type MgmtProjectType = (typeof MGMT_PROJECT_TYPES)[number];

export const MGMT_HOTEL_STATUSES = ["operating", "opening", "repositioning", "changing_systems"] as const;
export type MgmtHotelStatus = (typeof MGMT_HOTEL_STATUSES)[number];

export const MGMT_CADENCES = ["weekly", "monthly", "quarterly", "ad_hoc"] as const;
export type MgmtCadence = (typeof MGMT_CADENCES)[number];

export const MGMT_APPROVAL_STATUSES = ["not_requested", "awaiting", "approved", "changes_requested", "rejected"] as const;
export type MgmtApprovalStatus = (typeof MGMT_APPROVAL_STATUSES)[number];

export const MGMT_BUDGET_STATUSES = ["not_set", "proposed", "approved", "declined"] as const;
export type MgmtBudgetStatus = (typeof MGMT_BUDGET_STATUSES)[number];

export const MGMT_KPI_DATA_STATUSES = ["approved", "sample", "pending", "not_configured"] as const;
export type MgmtKpiDataStatus = (typeof MGMT_KPI_DATA_STATUSES)[number];

export const MGMT_ASSESSMENT_AREAS = ["direction", "commercial", "operations", "people", "guest", "measurement"] as const;
export type MgmtAssessmentArea = (typeof MGMT_ASSESSMENT_AREAS)[number];

export const MGMT_PLAN_PHASES = ["first_30", "days_31_60", "days_61_90", "ongoing"] as const;
export type MgmtPlanPhase = (typeof MGMT_PLAN_PHASES)[number];

export const MGMT_KPI_AREAS = ["commercial", "operations", "people", "guest", "marketing", "distribution"] as const;
export type MgmtKpiArea = (typeof MGMT_KPI_AREAS)[number];

export const MIN_MGMT_SUBTASKS = 1;
export const MAX_MGMT_SUBTASKS = 10;

export const MASKED_VALUE = "••••";

export const MGMT_DEPARTMENT_LABEL: Record<MgmtDepartment, string> = {
  marketing: "Marketing",
  revenue: "Revenue",
  distribution: "Distribution",
  sales: "Sales",
  management: "Management",
};

export const MGMT_WORKSTREAM_LABEL: Record<MgmtWorkstream, string> = {
  properties: "Properties",
  assessments: "Hotel Assessments",
  plans: "Operating Plans",
  commercial: "Commercial / Revenue",
  marketing: "Marketing",
  distribution: "Distribution",
  operations: "Operations",
  guest: "Guest Experience",
  people: "People and Roles",
  meetings: "Meetings / Cadence",
  kpi: "KPI and Reports",
  actions: "Action Log",
  approvals: "Approvals",
  handover: "Handover and Ownership",
};

export const MGMT_SECTION_LABEL: Record<MgmtSection, string> = {
  overview: "Overview",
  properties: "Properties",
  assessments: "Hotel Assessments",
  plans: "Operating Plans",
  commercial: "Commercial / Revenue",
  marketing: "Marketing",
  distribution: "Distribution",
  operations: "Operations",
  guest: "Guest Experience",
  people: "People and Roles",
  meetings: "Meetings / Cadence",
  kpi: "KPI and Reports",
  actions: "Action Log",
  approvals: "Approvals",
  handover: "Handover and Ownership",
  settings: "Settings",
};

export const MGMT_STATUS_LABEL: Record<MgmtStatus, string> = {
  draft: "Draft",
  assessment_scheduled: "Assessment Scheduled",
  assessing: "Assessing",
  awaiting_hotel_data: "Awaiting Hotel Data",
  scope_alignment: "Scope Alignment",
  plan_ready: "Plan Ready",
  in_progress: "In Progress",
  in_review: "In Review",
  awaiting_approval: "Awaiting Approval",
  monitoring: "Monitoring",
  completed: "Completed",
  blocked: "Blocked",
  archived: "Archived",
};

export const MGMT_PRIORITY_LABEL: Record<MgmtPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const MGMT_GROUP_LABEL: Record<MgmtGroupBy, string> = {
  status: "สถานะ",
  hotel: "โรงแรม",
  owner: "ผู้รับผิดชอบ",
  department: "แผนก",
  workstream: "สายงาน",
  priority: "ความสำคัญ",
  cadence: "จังหวะ KPI",
};

export const MGMT_SORT_LABEL: Record<MgmtSort, string> = {
  nextActionAt: "Next action date",
  dueDate: "Due date",
  priority: "Priority",
  updatedAt: "Updated date",
};

export const MGMT_FORM_TAB_LABEL: Record<MgmtFormTab, string> = {
  overview: "Overview",
  assessment: "Assessment",
  plan: "Operating Plan",
  commercial: "Commercial / Revenue",
  marketing: "Marketing",
  distribution: "Distribution",
  operations: "Operations",
  guest: "Guest Experience",
  people: "People and Roles",
  meetings: "Meetings / Cadence",
  kpi: "KPI and Reports",
  actions: "Action Log",
  approvals: "Approvals",
  handover: "Handover and Ownership",
  files: "Files and Notes",
  history: "Audit History",
};

export const MGMT_SUBTASK_STATUS_LABEL: Record<MgmtSubtaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  completed: "Completed",
};

export const MGMT_READINESS_LABEL: Record<MgmtReadiness, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  ready_for_review: "Ready for review",
  completed: "Completed",
};

export const MGMT_PROJECT_TYPE_LABEL: Record<MgmtProjectType, string> = {
  independent: "Independent",
  boutique: "Boutique",
  resort: "Resort",
  city: "City hotel",
  opening: "Opening",
  other: "Other",
};

export const MGMT_HOTEL_STATUS_LABEL: Record<MgmtHotelStatus, string> = {
  operating: "Operating",
  opening: "Opening",
  repositioning: "Repositioning",
  changing_systems: "Changing systems",
};

export const MGMT_CADENCE_LABEL: Record<MgmtCadence, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  ad_hoc: "Ad hoc",
};

export const MGMT_APPROVAL_LABEL: Record<MgmtApprovalStatus, string> = {
  not_requested: "ยังไม่ขออนุมัติ",
  awaiting: "รออนุมัติ",
  approved: "อนุมัติแล้ว",
  changes_requested: "ขอแก้ไข",
  rejected: "ไม่อนุมัติ",
};

export const MGMT_BUDGET_STATUS_LABEL: Record<MgmtBudgetStatus, string> = {
  not_set: "ยังไม่ตั้ง",
  proposed: "เสนอแล้ว",
  approved: "อนุมัติงบ",
  declined: "ไม่อนุมัติงบ",
};

export const MGMT_KPI_DATA_STATUS_LABEL: Record<MgmtKpiDataStatus, string> = {
  approved: "Approved",
  sample: "Sample",
  pending: "Pending",
  not_configured: "Not Configured",
};

export const MGMT_ASSESSMENT_AREA_LABEL: Record<MgmtAssessmentArea, string> = {
  direction: "Direction",
  commercial: "Commercial",
  operations: "Operations",
  people: "People",
  guest: "Guest Experience",
  measurement: "Measurement",
};

export const MGMT_PLAN_PHASE_LABEL: Record<MgmtPlanPhase, string> = {
  first_30: "First 30 Days",
  days_31_60: "Days 31–60",
  days_61_90: "Days 61–90",
  ongoing: "Ongoing",
};

export const MGMT_KPI_AREA_LABEL: Record<MgmtKpiArea, string> = {
  commercial: "Commercial",
  operations: "Operations",
  people: "People",
  guest: "Guest Experience",
  marketing: "Marketing",
  distribution: "Distribution",
};

export const MGMT_PRIORITY_RANK: Record<MgmtPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const MGMT_SECTION_WORKSTREAM: Partial<Record<MgmtSection, MgmtWorkstream>> = {
  properties: "properties",
  assessments: "assessments",
  plans: "plans",
  commercial: "commercial",
  marketing: "marketing",
  distribution: "distribution",
  operations: "operations",
  guest: "guest",
  people: "people",
  meetings: "meetings",
  kpi: "kpi",
  actions: "actions",
  approvals: "approvals",
  handover: "handover",
};

export const MGMT_DEPARTMENT_DUTIES: Record<MgmtDepartment, string[]> = {
  marketing: ["Brand and market direction", "Content and campaign priorities", "Guest acquisition context", "Marketing action plan"],
  revenue: ["Rate and offer context", "Revenue priorities", "Forecast/target interpretation", "Commercial action plan"],
  distribution: ["Channel consistency", "Booking engine and availability path", "OTA/direct channel coordination", "Distribution action plan"],
  sales: ["Hotel value proposition", "Partner/market context", "Lead and account follow-up", "Sales action plan"],
  management: ["Owner/GM priorities", "Scope and budget approval", "Decision rights", "KPI review and final direction"],
};

export const MGMT_STARTER_SUBTASKS: Array<{ department: MgmtDepartment; name: string }> = [
  { department: "marketing", name: "Marketing action plan: brand, content/campaign priorities, and guest acquisition context" },
  { department: "revenue", name: "Commercial action plan: rate/offer context, revenue priorities, and forecast/target interpretation" },
  { department: "distribution", name: "Distribution action plan: channel consistency, booking path, and OTA/direct coordination" },
  { department: "sales", name: "Sales action plan: value proposition, partner/market context, and lead/account follow-up" },
  { department: "management", name: "Management direction: owner/GM priorities, scope/budget approval, decision rights, and KPI review" },
];

export const MGMT_DEFAULT_QA: string[] = [
  "Direction and owner cadence are written",
  "Commercial scope is agreed with the hotel",
  "Operations rhythm is named without replacing the GM",
  "People and roles are listed as hotel-owned",
  "Guest experience notes do not store guest personal data",
  "Measurement definitions and data status are recorded",
];

export const MGMT_DEFAULT_HANDOVER: string[] = [
  "Hotel owner / GM",
  "Commercial owner",
  "Operations owner",
  "People owner",
  "Data / KPI owner",
  "Handover notes accepted by hotel",
];

export type MgmtAccessView = {
  userId: string;
  departments: MgmtDepartment[];
  canEditBoard: boolean;
  canManageSettings: boolean;
  canSeePrivateIds: boolean;
  isManagement: boolean;
};

export type MgmtSourceView = {
  id: string;
  name: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  notes: string;
};

export type MgmtKpiView = {
  id: string;
  name: string;
  area: MgmtKpiArea;
  period: string;
  value: string;
  definition: string;
  source: string;
  dataStatus: MgmtKpiDataStatus;
  market: string;
  target: string;
  owner: string;
  notes: string;
  updatedAt: string;
};

export type MgmtAuditView = {
  id: string;
  action: string;
  detail: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
};

export type MgmtSubtaskCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type MgmtSubtaskFileView = {
  id: string;
  filename: string;
  caption: string;
  size: number;
  createdAt: string;
  href: string;
};

export type MgmtSubtaskView = {
  id: string;
  propertyId: string;
  name: string;
  department: MgmtDepartment;
  ownerId: string;
  ownerName: string;
  status: MgmtSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: MgmtPriority;
  comments: string;
  source: string;
  thread: MgmtSubtaskCommentView[];
  files: MgmtSubtaskFileView[];
};

export type MgmtSubtaskProgress = {
  total: number;
  completed: number;
  percent: number;
  readiness: MgmtReadiness;
  countLabel: string;
};

export type MgmtChecklistItem = {
  id: string;
  label: string;
  status: MgmtReadiness;
  notes: string;
  owner: string;
};

export type MgmtApprovalView = {
  id: string;
  kind: string;
  status: MgmtApprovalStatus;
  notes: string;
  requestedBy: string;
  decidedBy: string;
  createdAt: string;
};

export type MgmtFileNote = {
  id: string;
  name: string;
  caption: string;
  status: MgmtReadiness;
};

export type MgmtSectionBlock = {
  summary: string;
  owner: string;
  status: MgmtReadiness;
  notes: string;
  items: MgmtChecklistItem[];
};

export type MgmtAssessmentView = {
  id: string;
  area: MgmtAssessmentArea;
  question: string;
  currentState: string;
  evidence: string;
  risk: MgmtPriority;
  recommendedAction: string;
  owner: string;
  department: MgmtDepartment | "";
  dueAt: string;
  approvalStatus: MgmtApprovalStatus;
  status: MgmtSubtaskStatus;
};

export type MgmtPlanView = {
  id: string;
  phase: MgmtPlanPhase;
  objective: string;
  action: string;
  owner: string;
  department: MgmtDepartment | "";
  startAt: string;
  dueAt: string;
  priority: MgmtPriority;
  status: MgmtSubtaskStatus;
  dependency: string;
  kpi: string;
  target: string;
  measurement: string;
  approvalStatus: MgmtApprovalStatus;
  notes: string;
};

export type MgmtMeetingView = {
  id: string;
  meetingType: MgmtCadence;
  property: string;
  date: string;
  participants: string;
  agenda: string;
  decisions: string;
  actionItems: string;
  owner: string;
  dueAt: string;
  status: MgmtSubtaskStatus;
  notes: string;
};

export type MgmtActionLogView = {
  id: string;
  name: string;
  property: string;
  workstream: MgmtWorkstream | "";
  owner: string;
  department: MgmtDepartment | "";
  priority: MgmtPriority;
  status: MgmtSubtaskStatus;
  dueAt: string;
  relatedKpi: string;
  decision: string;
  notes: string;
};

export type MgmtPeopleRoleView = {
  id: string;
  role: string;
  name: string;
  department: MgmtDepartment | "";
  owner: string;
  status: MgmtReadiness;
  notes: string;
};

export type MgmtProjectRow = {
  id: string;
  projectName: string;
  hotelName: string;
  propertyType: MgmtProjectType;
  roomCount: string;
  locationMarket: string;
  hotelStatus: MgmtHotelStatus;
  primaryGoal: string;
  mainChallenge: string;
  startDate: string;
  launchDate: string;
  status: MgmtStatus;
  ownerId: string;
  ownerName: string;
  department: MgmtDepartment;
  workstream: MgmtWorkstream;
  priority: MgmtPriority;
  scope: string;
  hotelApprover: string;
  nextAction: string;
  nextActionAt: string;
  kpiCadence: MgmtCadence;
  dataStatus: MgmtKpiDataStatus;
  createdAt: string;
  updatedAt: string;
  notes: string;
  primaryKpi: string;
  kpiTarget: string;
  handoverStatus: MgmtReadiness;
  privateMasked: boolean;
  commercial: MgmtSectionBlock;
  marketingBlock: MgmtSectionBlock;
  distributionBlock: MgmtSectionBlock;
  operations: MgmtSectionBlock;
  guest: MgmtSectionBlock;
  people: MgmtPeopleRoleView[];
  assessments: MgmtAssessmentView[];
  plans: MgmtPlanView[];
  meetings: MgmtMeetingView[];
  actionLogs: MgmtActionLogView[];
  qa: MgmtChecklistItem[];
  handover: MgmtChecklistItem[];
  fileNotes: MgmtFileNote[];
  approvals: MgmtApprovalView[];
  sources: MgmtSourceView[];
  kpis: MgmtKpiView[];
  history: MgmtAuditView[];
  subtasks: MgmtSubtaskView[];
  progress: MgmtSubtaskProgress;
  dueDate: string;
};

export type MgmtListFilters = {
  q?: string;
  status?: string;
  ownerId?: string;
  department?: string;
  hotel?: string;
  workstream?: string;
  projectType?: string;
  market?: string;
  cadence?: string;
  priority?: string;
  group?: string;
  sort?: string;
  view?: string;
};

const LEGACY_STATUS: Record<string, MgmtStatus> = {
  draft: "draft",
  discovery: "assessment_scheduled",
  audit_scheduled: "assessment_scheduled",
  review_scheduled: "assessment_scheduled",
  content_needed: "awaiting_hotel_data",
  waiting_hotel: "awaiting_hotel_data",
  structure_review: "assessing",
  in_review: "in_review",
  auditing: "assessing",
  design_review: "assessing",
  action_planned: "scope_alignment",
  priority_planned: "scope_alignment",
  development: "in_progress",
  changes_in_progress: "in_progress",
  integration: "in_progress",
  awaiting_hotel_approval: "awaiting_approval",
  ready_approval: "awaiting_approval",
  ready_to_test: "plan_ready",
  qa: "plan_ready",
  ready_for_handover: "plan_ready",
  monitoring: "monitoring",
  measuring: "monitoring",
  tracking: "monitoring",
  live: "completed",
  published: "completed",
  completed: "completed",
  blocked: "blocked",
  archived: "archived",
};

const LEGACY_WORKSTREAM: Record<string, MgmtWorkstream> = {
  project: "properties",
  properties: "properties",
  discovery: "assessments",
  message: "assessments",
  review: "assessments",
  assessments: "assessments",
  cms: "operations",
  room: "operations",
  seo: "operations",
  price: "commercial",
  friction: "plans",
  booking: "plans",
  plans: "plans",
  ux: "guest",
  mobile: "people",
  tracking: "guest",
  guest: "guest",
  people: "people",
  qa: "commercial",
  optimize: "commercial",
  experiments: "commercial",
  commercial: "commercial",
  marketing: "marketing",
  distribution: "distribution",
  operations: "operations",
  reports: "kpi",
  measure: "kpi",
  kpi: "kpi",
  meetings: "meetings",
  actions: "actions",
  approvals: "approvals",
  handover: "handover",
};

const LEGACY_PROJECT_TYPE: Record<string, MgmtProjectType> = {
  independent: "independent",
  boutique: "boutique",
  resort: "resort",
  city: "city",
  opening: "opening",
  other: "other",
  improve: "independent",
  rebuild: "other",
  improve_existing: "independent",
  website_review: "independent",
  management_review: "independent",
  booking_path: "independent",
};

const LEGACY_KPI_STATUS: Record<string, MgmtKpiDataStatus> = {
  draft: "pending",
  sample: "sample",
  approved: "approved",
  pending: "pending",
  not_configured: "not_configured",
};

const LEGACY_ASSESSMENT_AREA: Record<string, MgmtAssessmentArea> = {
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

export function isDepartment(value: string): value is MgmtDepartment {
  return MGMT_DEPARTMENTS.includes(value as MgmtDepartment);
}

export function isWorkstream(value: string): value is MgmtWorkstream {
  return MGMT_WORKSTREAMS.includes(value as MgmtWorkstream);
}

export function isMgmtStatus(value: string): value is MgmtStatus {
  return MGMT_STATUSES.includes(value as MgmtStatus);
}

export function isPriority(value: string): value is MgmtPriority {
  return MGMT_PRIORITIES.includes(value as MgmtPriority);
}

export function isGroupBy(value: string): value is MgmtGroupBy {
  return MGMT_GROUP_BY.includes(value as MgmtGroupBy);
}

export function isSort(value: string): value is MgmtSort {
  return MGMT_SORTS.includes(value as MgmtSort);
}

export function isKpiDataStatus(value: string): value is MgmtKpiDataStatus {
  return MGMT_KPI_DATA_STATUSES.includes(value as MgmtKpiDataStatus);
}

export function isSubtaskStatus(value: string): value is MgmtSubtaskStatus {
  return MGMT_SUBTASK_STATUSES.includes(value as MgmtSubtaskStatus);
}

export function isProjectType(value: string): value is MgmtProjectType {
  return MGMT_PROJECT_TYPES.includes(value as MgmtProjectType);
}

export function isApprovalStatus(value: string): value is MgmtApprovalStatus {
  return MGMT_APPROVAL_STATUSES.includes(value as MgmtApprovalStatus);
}

export function isBudgetStatus(value: string): value is MgmtBudgetStatus {
  return MGMT_BUDGET_STATUSES.includes(value as MgmtBudgetStatus);
}

export function isReadiness(value: string): value is MgmtReadiness {
  return MGMT_READINESS.includes(value as MgmtReadiness);
}

export function isHotelStatus(value: string): value is MgmtHotelStatus {
  return MGMT_HOTEL_STATUSES.includes(value as MgmtHotelStatus);
}

export function isCadence(value: string): value is MgmtCadence {
  return MGMT_CADENCES.includes(value as MgmtCadence);
}

export function isAssessmentArea(value: string): value is MgmtAssessmentArea {
  return MGMT_ASSESSMENT_AREAS.includes(value as MgmtAssessmentArea);
}

export function isPlanPhase(value: string): value is MgmtPlanPhase {
  return MGMT_PLAN_PHASES.includes(value as MgmtPlanPhase);
}

export function isKpiArea(value: string): value is MgmtKpiArea {
  return MGMT_KPI_AREAS.includes(value as MgmtKpiArea);
}

export function normalizeStatus(value: string): MgmtStatus {
  if (isMgmtStatus(value)) return value;
  return LEGACY_STATUS[value] || "draft";
}

export function normalizeWorkstream(value: string): MgmtWorkstream {
  if (isWorkstream(value)) return value;
  return LEGACY_WORKSTREAM[value] || "properties";
}

export function normalizeProjectType(value: string): MgmtProjectType {
  if (isProjectType(value)) return value;
  const key = value.trim().toLowerCase();
  return LEGACY_PROJECT_TYPE[key] || "independent";
}

export function normalizeReadiness(value: string): MgmtReadiness {
  return isReadiness(value) ? value : "not_started";
}

export function normalizeSubtaskStatus(value: string): MgmtSubtaskStatus {
  if (value === "done" || value === "complete" || value === "ready_for_review") return value === "ready_for_review" ? "in_progress" : "completed";
  return isSubtaskStatus(value) ? value : "not_started";
}

export function normalizeHotelStatus(value: string): MgmtHotelStatus {
  if (isHotelStatus(value)) return value;
  if (value === "opening" || value === "rebuild") return "opening";
  return "operating";
}

export function normalizeCadence(value: string): MgmtCadence {
  if (isCadence(value)) return value;
  if (value === "week") return "weekly";
  if (value === "month") return "monthly";
  if (value === "quarter") return "quarterly";
  return "monthly";
}

export function normalizeKpiDataStatus(value: string): MgmtKpiDataStatus {
  if (isKpiDataStatus(value)) return value;
  return LEGACY_KPI_STATUS[value] || "pending";
}

export function normalizeAssessmentArea(value: string): MgmtAssessmentArea {
  if (isAssessmentArea(value)) return value;
  return LEGACY_ASSESSMENT_AREA[value] || "direction";
}

export function normalizePlanPhase(value: string): MgmtPlanPhase {
  return isPlanPhase(value) ? value : "first_30";
}

export function normalizeKpiArea(value: string): MgmtKpiArea {
  return isKpiArea(value) ? value : "commercial";
}

const MGMT_SECTION_PATH: Record<MgmtSection, string> = {
  overview: "/crm/management",
  properties: "/crm/management/properties",
  assessments: "/crm/management/assessment",
  plans: "/crm/management/plan",
  commercial: "/crm/management/commercial",
  marketing: "/crm/management/marketing",
  distribution: "/crm/management/distribution",
  operations: "/crm/management/operations",
  guest: "/crm/management/guest",
  people: "/crm/management/people",
  meetings: "/crm/management/meetings",
  kpi: "/crm/management/kpi",
  actions: "/crm/management/actions",
  approvals: "/crm/management/approvals",
  handover: "/crm/management/handover",
  settings: "/crm/management/settings",
};

export function webSectionPath(section: MgmtSection) {
  return MGMT_SECTION_PATH[section] || "/crm/management";
}

export function webSectionFormTab(section: MgmtSection): MgmtFormTab {
  if (section === "assessments") return "assessment";
  if (section === "plans") return "plan";
  if (section === "commercial") return "commercial";
  if (section === "marketing") return "marketing";
  if (section === "distribution") return "distribution";
  if (section === "operations") return "operations";
  if (section === "guest") return "guest";
  if (section === "people") return "people";
  if (section === "meetings") return "meetings";
  if (section === "kpi") return "kpi";
  if (section === "actions") return "actions";
  if (section === "approvals") return "approvals";
  if (section === "handover") return "handover";
  return "overview";
}

export function emptySectionBlock(): MgmtSectionBlock {
  return { summary: "", owner: "", status: "not_started", notes: "", items: [] };
}

export function emptyAssessment(department: MgmtDepartment | "" = "management"): MgmtAssessmentView {
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

export function emptyPlan(department: MgmtDepartment | "" = "management"): MgmtPlanView {
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

export function emptyMeeting(property = ""): MgmtMeetingView {
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

export function emptyActionLog(property = "", workstream: MgmtWorkstream | "" = "actions"): MgmtActionLogView {
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

export function emptyPeopleRole(): MgmtPeopleRoleView {
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

export function emptyKpi(): MgmtKpiView {
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

export function earliestDueDate(row: Pick<MgmtProjectRow, "launchDate" | "nextActionAt" | "assessments" | "plans" | "actionLogs" | "meetings">) {
  const dates = [
    row.nextActionAt,
    row.launchDate,
    ...row.assessments.map((item) => item.dueAt),
    ...row.plans.map((item) => item.dueAt),
    ...row.actionLogs.map((item) => item.dueAt),
    ...row.meetings.map((item) => item.dueAt),
  ].filter(Boolean);
  return dates.sort()[0] || "";
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
    subtask_limit: "ซับงานได้ 1–10 รายการ",
    subtask_min: "โปรเจกต์ต้องมีซับงานอย่างน้อย 1 รายการ",
    missing_note: "กรอกบันทึกการอนุมัติ",
    invalid_url: "ลิงก์หลักฐานต้องเป็น URL หรืออ้างอิงไฟล์ภายใน",
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
    subtask_limit: "Each project can have 1–10 subtasks",
    subtask_min: "A project must keep at least 1 subtask",
    missing_note: "Enter an approval note",
    invalid_url: "Evidence must be a URL or an internal screenshot reference",
  };
  const thai = th[code] || code || "บันทึกไม่สำเร็จ";
  const english = en[code] || "Save failed";
  return `${thai} / ${english}`;
}
