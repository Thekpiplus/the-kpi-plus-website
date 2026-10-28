export const CONV_DEPARTMENTS = ["marketing", "revenue", "distribution", "sales", "management"] as const;
export type ConvDepartment = (typeof CONV_DEPARTMENTS)[number];

export const CONV_WORKSTREAMS = [
  "project",
  "review",
  "room",
  "friction",
  "booking",
  "mobile",
  "tracking",
  "experiments",
  "reports",
  "handover",
] as const;
export type ConvWorkstream = (typeof CONV_WORKSTREAMS)[number];

export const CONV_STATUSES = [
  "draft",
  "review_scheduled",
  "auditing",
  "awaiting_hotel_data",
  "priority_planned",
  "changes_in_progress",
  "awaiting_approval",
  "ready_to_test",
  "measuring",
  "completed",
  "blocked",
  "archived",
] as const;
export type ConvStatus = (typeof CONV_STATUSES)[number];

export const CONV_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type ConvPriority = (typeof CONV_PRIORITIES)[number];

export const CONV_SECTIONS = [
  "project",
  "review",
  "room",
  "friction",
  "booking",
  "mobile",
  "tracking",
  "experiments",
  "reports",
  "approvals",
  "handover",
  "settings",
] as const;
export type ConvSection = (typeof CONV_SECTIONS)[number];

export const CONV_GROUP_BY = ["status", "owner", "department", "hotel", "funnelStage", "severity", "market", "projectType"] as const;
export type ConvGroupBy = (typeof CONV_GROUP_BY)[number];

export const CONV_SORTS = ["nextActionAt", "priority", "severity", "launchDate", "updatedAt"] as const;
export type ConvSort = (typeof CONV_SORTS)[number];

export const CONV_FORM_TABS = [
  "overview",
  "website",
  "room",
  "friction",
  "booking",
  "tracking",
  "experiments",
  "reports",
  "approvals",
  "handover",
  "files",
  "history",
] as const;
export type ConvFormTab = (typeof CONV_FORM_TABS)[number];

export const CONV_FUNNEL_STAGES = ["visit", "interest", "start", "complete"] as const;
export type ConvFunnelStage = (typeof CONV_FUNNEL_STAGES)[number];

export const CONV_FRICTION_CATEGORIES = ["message", "room", "price", "mobile", "handoff", "tracking"] as const;
export type ConvFrictionCategory = (typeof CONV_FRICTION_CATEGORIES)[number];

export const CONV_SEVERITIES = ["low", "medium", "high", "blocked"] as const;
export type ConvSeverity = (typeof CONV_SEVERITIES)[number];

export const CONV_SUBTASK_STATUSES = ["not_started", "in_progress", "blocked", "completed"] as const;
export type ConvSubtaskStatus = (typeof CONV_SUBTASK_STATUSES)[number];

export const CONV_READINESS = ["not_started", "in_progress", "blocked", "ready_for_review", "completed"] as const;
export type ConvReadiness = (typeof CONV_READINESS)[number];

export const CONV_PROJECT_TYPES = ["website_review", "conversion_review", "improve_existing", "rebuild", "booking_path"] as const;
export type ConvProjectType = (typeof CONV_PROJECT_TYPES)[number];

export const CONV_APPROVAL_STATUSES = ["not_requested", "awaiting", "approved", "changes_requested", "rejected"] as const;
export type ConvApprovalStatus = (typeof CONV_APPROVAL_STATUSES)[number];

export const CONV_BUDGET_STATUSES = ["not_set", "proposed", "approved", "declined"] as const;
export type ConvBudgetStatus = (typeof CONV_BUDGET_STATUSES)[number];

export const CONV_KPI_DATA_STATUSES = ["draft", "sample", "approved"] as const;
export type ConvKpiDataStatus = (typeof CONV_KPI_DATA_STATUSES)[number];

export const MIN_CONV_SUBTASKS = 1;
export const MAX_CONV_SUBTASKS = 10;

export const MASKED_VALUE = "••••";

export const CONV_DEPARTMENT_LABEL: Record<ConvDepartment, string> = {
  marketing: "Marketing",
  revenue: "Revenue",
  distribution: "Distribution",
  sales: "Sales",
  management: "Management",
};

export const CONV_WORKSTREAM_LABEL: Record<ConvWorkstream, string> = {
  project: "Direct Booking Projects",
  review: "Website Review",
  room: "Room and Offer Information",
  friction: "Conversion Friction",
  booking: "Booking Engine",
  mobile: "Mobile UX",
  tracking: "Tracking and Analytics",
  experiments: "Experiments / Changes",
  reports: "Reports / KPI",
  handover: "Handover and Ownership",
};

export const CONV_SECTION_LABEL: Record<ConvSection, string> = {
  project: "Direct Booking Projects",
  review: "Website Review",
  room: "Room and Offer Information",
  friction: "Conversion Friction",
  booking: "Booking Engine",
  mobile: "Mobile UX",
  tracking: "Tracking and Analytics",
  experiments: "Experiments / Changes",
  reports: "Reports / KPI",
  approvals: "Approvals",
  handover: "Handover and Ownership",
  settings: "Settings",
};

export const CONV_STATUS_LABEL: Record<ConvStatus, string> = {
  draft: "Draft",
  review_scheduled: "Review Scheduled",
  auditing: "Auditing",
  awaiting_hotel_data: "Awaiting Hotel Data",
  priority_planned: "Priority Planned",
  changes_in_progress: "Changes in Progress",
  awaiting_approval: "Awaiting Approval",
  ready_to_test: "Ready to Test",
  measuring: "Measuring",
  completed: "Completed",
  blocked: "Blocked",
  archived: "Archived",
};

export const CONV_PRIORITY_LABEL: Record<ConvPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const CONV_GROUP_LABEL: Record<ConvGroupBy, string> = {
  status: "สถานะ",
  owner: "ผู้รับผิดชอบ",
  department: "แผนก",
  hotel: "โรงแรม",
  funnelStage: "ขั้นใน Funnel",
  severity: "ความรุนแรง",
  market: "ตลาด",
  projectType: "ประเภทงาน",
};

export const CONV_SORT_LABEL: Record<ConvSort, string> = {
  nextActionAt: "Next action date",
  priority: "Priority",
  severity: "Severity",
  launchDate: "Target review date",
  updatedAt: "Updated date",
};

export const CONV_FORM_TAB_LABEL: Record<ConvFormTab, string> = {
  overview: "ภาพรวม",
  website: "Website and Mobile",
  room: "Room/Offer/Policy",
  friction: "Conversion Friction",
  booking: "Booking Engine",
  tracking: "Tracking and Analytics",
  experiments: "Experiments / Changes",
  reports: "Reports / KPI",
  approvals: "Approvals",
  handover: "Handover and Ownership",
  files: "Files and Notes",
  history: "Audit History",
};

export const CONV_FUNNEL_LABEL: Record<ConvFunnelStage, string> = {
  visit: "Visit",
  interest: "Room Interest",
  start: "Booking Start",
  complete: "Booking Complete",
};

export const CONV_FRICTION_CATEGORY_LABEL: Record<ConvFrictionCategory, string> = {
  message: "Message",
  room: "Room Info",
  price: "Price/Policy",
  mobile: "Mobile",
  handoff: "Handoff",
  tracking: "Tracking",
};

export const CONV_SEVERITY_LABEL: Record<ConvSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  blocked: "Blocked",
};

export const CONV_SUBTASK_STATUS_LABEL: Record<ConvSubtaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  completed: "Completed",
};

export const CONV_READINESS_LABEL: Record<ConvReadiness, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  ready_for_review: "Ready for review",
  completed: "Completed",
};

export const CONV_PROJECT_TYPE_LABEL: Record<ConvProjectType, string> = {
  website_review: "Website Review",
  conversion_review: "Conversion Review",
  improve_existing: "Improve Existing",
  rebuild: "Rebuild",
  booking_path: "Booking Path",
};

export const CONV_APPROVAL_LABEL: Record<ConvApprovalStatus, string> = {
  not_requested: "ยังไม่ขออนุมัติ",
  awaiting: "รออนุมัติ",
  approved: "อนุมัติแล้ว",
  changes_requested: "ขอแก้ไข",
  rejected: "ไม่อนุมัติ",
};

export const CONV_BUDGET_STATUS_LABEL: Record<ConvBudgetStatus, string> = {
  not_set: "ยังไม่ตั้ง",
  proposed: "เสนอแล้ว",
  approved: "อนุมัติงบ",
  declined: "ไม่อนุมัติงบ",
};

export const CONV_KPI_DATA_STATUS_LABEL: Record<ConvKpiDataStatus, string> = {
  draft: "Draft",
  sample: "Sample",
  approved: "Approved",
};

export const CONV_PRIORITY_RANK: Record<ConvPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const CONV_SEVERITY_RANK: Record<ConvSeverity, number> = {
  blocked: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const CONV_SECTION_WORKSTREAM: Partial<Record<ConvSection, ConvWorkstream>> = {
  review: "review",
  room: "room",
  friction: "friction",
  booking: "booking",
  mobile: "mobile",
  tracking: "tracking",
  experiments: "experiments",
  handover: "handover",
};

export const CONV_DEPARTMENT_DUTIES: Record<ConvDepartment, string[]> = {
  marketing: ["Message match", "Landing page content", "Campaign/SEO source context", "CTA wording", "Test hypothesis"],
  revenue: ["Room offer", "Price context", "Promotion", "Cancellation policy", "Booking value interpretation"],
  distribution: ["Booking Engine", "Rate and availability connection", "Channel consistency", "Direct booking path", "Provider coordination"],
  sales: ["Hotel value proposition", "Contact path", "Lead follow-up", "Market and partner context"],
  management: ["Scope and budget approval", "Policy/legal approval", "Launch approval", "KPI and outcome review"],
};

export const CONV_STARTER_SUBTASKS: Array<{ department: ConvDepartment; name: string }> = [
  { department: "marketing", name: "Message match, landing page content, campaign/SEO source context, CTA wording, and test hypothesis" },
  { department: "revenue", name: "Room offer, price context, promotion, cancellation policy, and booking value interpretation" },
  { department: "distribution", name: "Booking Engine, rate and availability connection, channel consistency, direct booking path, and provider coordination" },
  { department: "sales", name: "Hotel value proposition, contact path, lead follow-up, and market and partner context" },
  { department: "management", name: "Scope and budget approval, policy/legal approval, launch approval, and KPI and outcome review" },
];

export const CONV_DEFAULT_QA: string[] = [
  "Landing message matches the ad or search that brought the guest",
  "Room pages show how types differ before Book",
  "Rate, inclusions, and cancellation are findable before the engine",
  "Book button and path work at about 390px",
  "Booking Engine continues dates, room, rate, and offer, or the limit is recorded",
  "Visit, Room Interest, Booking Start, and Booking Complete are separated",
  "A Book click is not reported as a completed booking",
  "Website, Booking Engine, analytics, domain, hosting, and external-account owners are named",
];

export const CONV_DEFAULT_HANDOVER: string[] = [
  "Website owner",
  "Booking-engine account owner",
  "Analytics owner",
  "Domain owner",
  "Hosting owner",
  "External-account owner",
  "Handover notes accepted by hotel",
];

export type ConvAccessView = {
  userId: string;
  departments: ConvDepartment[];
  canEditBoard: boolean;
  canManageSettings: boolean;
  canSeePrivateIds: boolean;
  isManagement: boolean;
};

export type ConvSourceView = {
  id: string;
  name: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  notes: string;
};

export type ConvKpiView = {
  id: string;
  name: string;
  period: string;
  value: string;
  definition: string;
  source: string;
  dataStatus: ConvKpiDataStatus;
  market: string;
};

export type ConvAuditView = {
  id: string;
  action: string;
  detail: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
};

export type ConvSubtaskCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type ConvSubtaskFileView = {
  id: string;
  filename: string;
  caption: string;
  size: number;
  createdAt: string;
  href: string;
};

export type ConvSubtaskView = {
  id: string;
  propertyId: string;
  name: string;
  department: ConvDepartment;
  ownerId: string;
  ownerName: string;
  status: ConvSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: ConvPriority;
  comments: string;
  source: string;
  thread: ConvSubtaskCommentView[];
  files: ConvSubtaskFileView[];
};

export type ConvSubtaskProgress = {
  total: number;
  completed: number;
  percent: number;
  readiness: ConvReadiness;
  countLabel: string;
};

export type ConvChecklistItem = {
  id: string;
  label: string;
  status: ConvReadiness;
  notes: string;
  owner: string;
};

export type ConvSitemapPage = {
  id: string;
  name: string;
  parent: string;
  purpose: string;
  status: ConvReadiness;
};

export type ConvDecisionView = {
  id: string;
  title: string;
  decision: string;
  owner: string;
  status: ConvReadiness;
  notes: string;
};

export type ConvApprovalView = {
  id: string;
  kind: string;
  status: ConvApprovalStatus;
  notes: string;
  requestedBy: string;
  decidedBy: string;
  createdAt: string;
};

export type ConvFileNote = {
  id: string;
  name: string;
  caption: string;
  status: ConvReadiness;
};

export type ConvFrictionView = {
  id: string;
  title: string;
  funnelStage: ConvFunnelStage;
  category: ConvFrictionCategory;
  severity: ConvSeverity;
  evidence: string;
  status: ConvReadiness;
  recommendedAction: string;
  owner: string;
  department: ConvDepartment | "";
  dueAt: string;
  approvalStatus: ConvApprovalStatus;
  measurementEvent: string;
  beforeValue: string;
  afterValue: string;
  notes: string;
};

export type ConvEngineView = {
  provider: string;
  bookingUrl: string;
  languages: string;
  mobileStatus: ConvReadiness;
  rateStatus: ConvReadiness;
  handoffStatus: ConvReadiness;
  callbackStatus: ConvReadiness;
  confirmationStatus: ConvReadiness;
  owner: string;
  accessStatus: ConvReadiness;
  notes: string;
};

export type ConvSectionBlock = {
  summary: string;
  owner: string;
  status: ConvReadiness;
  notes: string;
  items: ConvChecklistItem[];
};

export type ConvProjectRow = {
  id: string;
  projectName: string;
  hotelName: string;
  currentUrl: string;
  bookingEngine: string;
  bookingEngineUrl: string;
  cmsType: string;
  projectType: ConvProjectType;
  primaryGoal: string;
  targetMarket: string;
  languages: string;
  startDate: string;
  launchDate: string;
  mobileReady: string;
  improveOrRebuild: string;
  status: ConvStatus;
  ownerId: string;
  ownerName: string;
  department: ConvDepartment;
  workstream: ConvWorkstream;
  priority: ConvPriority;
  nextAction: string;
  nextActionAt: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  budgetStatus: ConvBudgetStatus;
  trackingStatus: ConvReadiness;
  analyticsStatus: ConvReadiness;
  engineTrackingStatus: ConvReadiness;
  primaryKpi: string;
  kpiTarget: string;
  hotelApprover: string;
  seoStatus: ConvReadiness;
  mobileStatus: ConvReadiness;
  handoverStatus: ConvReadiness;
  engineAccountRef: string;
  analyticsRef: string;
  privateMasked: boolean;
  cmsOwner: string;
  sourceCodeOwner: string;
  domainOwner: string;
  hostingOwner: string;
  analyticsOwner: string;
  bookingEngineOwner: string;
  discovery: ConvSectionBlock;
  sitemap: ConvSitemapPage[];
  sitemapNotes: string;
  ux: ConvSectionBlock;
  cms: ConvSectionBlock;
  booking: ConvSectionBlock;
  tracking: ConvSectionBlock;
  seo: ConvSectionBlock;
  qa: ConvChecklistItem[];
  handover: ConvChecklistItem[];
  friction: ConvFrictionView[];
  engine: ConvEngineView;
  fileNotes: ConvFileNote[];
  decisions: ConvDecisionView[];
  approvals: ConvApprovalView[];
  sources: ConvSourceView[];
  kpis: ConvKpiView[];
  history: ConvAuditView[];
  subtasks: ConvSubtaskView[];
  progress: ConvSubtaskProgress;
};

export type ConvListFilters = {
  q?: string;
  status?: string;
  ownerId?: string;
  department?: string;
  hotel?: string;
  workstream?: string;
  projectType?: string;
  market?: string;
  language?: string;
  funnelStage?: string;
  severity?: string;
  group?: string;
  sort?: string;
  view?: string;
};

const LEGACY_STATUS: Record<string, ConvStatus> = {
  draft: "draft",
  discovery: "review_scheduled",
  audit_scheduled: "review_scheduled",
  content_needed: "awaiting_hotel_data",
  waiting_hotel: "awaiting_hotel_data",
  structure_review: "auditing",
  in_review: "auditing",
  design_review: "auditing",
  action_planned: "priority_planned",
  development: "changes_in_progress",
  in_progress: "changes_in_progress",
  integration: "changes_in_progress",
  awaiting_hotel_approval: "awaiting_approval",
  ready_approval: "awaiting_approval",
  qa: "ready_to_test",
  ready_for_handover: "ready_to_test",
  monitoring: "measuring",
  tracking: "measuring",
  live: "completed",
  published: "completed",
  completed: "completed",
  blocked: "blocked",
  archived: "archived",
};

const LEGACY_WORKSTREAM: Record<string, ConvWorkstream> = {
  project: "project",
  discovery: "review",
  message: "review",
  review: "review",
  cms: "room",
  room: "room",
  seo: "room",
  price: "room",
  friction: "friction",
  booking: "booking",
  ux: "mobile",
  mobile: "mobile",
  tracking: "tracking",
  qa: "experiments",
  optimize: "experiments",
  experiments: "experiments",
  reports: "reports",
  measure: "reports",
  handover: "handover",
};

const LEGACY_PROJECT_TYPE: Record<string, ConvProjectType> = {
  improve: "improve_existing",
  rebuild: "rebuild",
  "improve existing": "improve_existing",
  "build new": "rebuild",
  build_new: "rebuild",
  landing: "conversion_review",
  landing_page: "conversion_review",
  website_review: "website_review",
  conversion_review: "conversion_review",
  booking: "booking_path",
};

export function isDepartment(value: string): value is ConvDepartment {
  return CONV_DEPARTMENTS.includes(value as ConvDepartment);
}

export function isWorkstream(value: string): value is ConvWorkstream {
  return CONV_WORKSTREAMS.includes(value as ConvWorkstream);
}

export function isConvStatus(value: string): value is ConvStatus {
  return CONV_STATUSES.includes(value as ConvStatus);
}

export function isPriority(value: string): value is ConvPriority {
  return CONV_PRIORITIES.includes(value as ConvPriority);
}

export function isGroupBy(value: string): value is ConvGroupBy {
  return CONV_GROUP_BY.includes(value as ConvGroupBy);
}

export function isSort(value: string): value is ConvSort {
  return CONV_SORTS.includes(value as ConvSort);
}

export function isKpiDataStatus(value: string): value is ConvKpiDataStatus {
  return CONV_KPI_DATA_STATUSES.includes(value as ConvKpiDataStatus);
}

export function isSubtaskStatus(value: string): value is ConvSubtaskStatus {
  return CONV_SUBTASK_STATUSES.includes(value as ConvSubtaskStatus);
}

export function isProjectType(value: string): value is ConvProjectType {
  return CONV_PROJECT_TYPES.includes(value as ConvProjectType);
}

export function isApprovalStatus(value: string): value is ConvApprovalStatus {
  return CONV_APPROVAL_STATUSES.includes(value as ConvApprovalStatus);
}

export function isBudgetStatus(value: string): value is ConvBudgetStatus {
  return CONV_BUDGET_STATUSES.includes(value as ConvBudgetStatus);
}

export function isReadiness(value: string): value is ConvReadiness {
  return CONV_READINESS.includes(value as ConvReadiness);
}

export function isFunnelStage(value: string): value is ConvFunnelStage {
  return CONV_FUNNEL_STAGES.includes(value as ConvFunnelStage);
}

export function isFrictionCategory(value: string): value is ConvFrictionCategory {
  return CONV_FRICTION_CATEGORIES.includes(value as ConvFrictionCategory);
}

export function isSeverity(value: string): value is ConvSeverity {
  return CONV_SEVERITIES.includes(value as ConvSeverity);
}

export function normalizeFunnelStage(value: string): ConvFunnelStage {
  return isFunnelStage(value) ? value : "visit";
}

export function normalizeFrictionCategory(value: string): ConvFrictionCategory {
  return isFrictionCategory(value) ? value : "message";
}

export function normalizeSeverity(value: string): ConvSeverity {
  return isSeverity(value) ? value : "medium";
}

export function normalizeStatus(value: string): ConvStatus {
  if (isConvStatus(value)) return value;
  return LEGACY_STATUS[value] || "draft";
}

export function normalizeWorkstream(value: string): ConvWorkstream {
  if (isWorkstream(value)) return value;
  return LEGACY_WORKSTREAM[value] || "project";
}

export function normalizeProjectType(value: string): ConvProjectType {
  if (isProjectType(value)) return value;
  const key = value.trim().toLowerCase();
  return LEGACY_PROJECT_TYPE[key] || "improve_existing";
}

export function normalizeReadiness(value: string): ConvReadiness {
  return isReadiness(value) ? value : "not_started";
}

export function normalizeSubtaskStatus(value: string): ConvSubtaskStatus {
  if (value === "done" || value === "complete") return "completed";
  return isSubtaskStatus(value) ? value : "not_started";
}

const CONV_SECTION_PATH: Record<ConvSection, string> = {
  project: "/crm/conversion",
  review: "/crm/conversion/review",
  room: "/crm/conversion/room",
  friction: "/crm/conversion/friction",
  booking: "/crm/conversion/booking",
  mobile: "/crm/conversion/mobile",
  tracking: "/crm/conversion/tracking",
  experiments: "/crm/conversion/experiments",
  reports: "/crm/conversion/reports",
  approvals: "/crm/conversion/approvals",
  handover: "/crm/conversion/handover",
  settings: "/crm/conversion/settings",
};

export function webSectionPath(section: ConvSection) {
  return CONV_SECTION_PATH[section] || "/crm/conversion";
}

export function webSectionFormTab(section: ConvSection): ConvFormTab {
  if (section === "review" || section === "mobile") return "website";
  if (section === "room") return "room";
  if (section === "friction") return "friction";
  if (section === "booking") return "booking";
  if (section === "tracking") return "tracking";
  if (section === "experiments") return "experiments";
  if (section === "reports") return "reports";
  if (section === "approvals") return "approvals";
  if (section === "handover") return "handover";
  return "overview";
}

export function emptySectionBlock(): ConvSectionBlock {
  return { summary: "", owner: "", status: "not_started", notes: "", items: [] };
}

export function emptyFrictionItem(department: ConvDepartment | "" = "marketing"): ConvFrictionView {
  return {
    id: `fr_${Math.random().toString(36).slice(2, 10)}`,
    title: "",
    funnelStage: "visit",
    category: "message",
    severity: "medium",
    evidence: "",
    status: "not_started",
    recommendedAction: "",
    owner: "",
    department,
    dueAt: "",
    approvalStatus: "not_requested",
    measurementEvent: "",
    beforeValue: "",
    afterValue: "",
    notes: "",
  };
}

export function emptyEngineView(): ConvEngineView {
  return {
    provider: "",
    bookingUrl: "",
    languages: "",
    mobileStatus: "not_started",
    rateStatus: "not_started",
    handoffStatus: "not_started",
    callbackStatus: "not_started",
    confirmationStatus: "not_started",
    owner: "",
    accessStatus: "not_started",
    notes: "",
  };
}

export function worstFrictionSeverity(items: ConvFrictionView[]): ConvSeverity | "" {
  if (!items.length) return "";
  return [...items].sort((a, b) => CONV_SEVERITY_RANK[a.severity] - CONV_SEVERITY_RANK[b.severity])[0].severity;
}

export function webErrorMessage(code: string) {
  const th: Record<string, string> = {
    missing: "ไม่พบรายการ",
    required: "กรอกชื่อโปรเจกต์หรือชื่อโรงแรม",
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
    required: "Enter a project name or hotel name",
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
