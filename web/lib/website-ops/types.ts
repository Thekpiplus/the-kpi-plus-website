export const WEB_DEPARTMENTS = ["marketing", "revenue", "distribution", "sales", "management"] as const;
export type WebDepartment = (typeof WEB_DEPARTMENTS)[number];

export const WEB_WORKSTREAMS = [
  "project",
  "discovery",
  "ux",
  "cms",
  "booking",
  "tracking",
  "seo",
  "qa",
  "reports",
] as const;
export type WebWorkstream = (typeof WEB_WORKSTREAMS)[number];

export const WEB_STATUSES = [
  "draft",
  "discovery",
  "content_needed",
  "structure_review",
  "design_review",
  "development",
  "integration",
  "qa",
  "awaiting_hotel_approval",
  "ready_for_handover",
  "live",
  "monitoring",
  "archived",
] as const;
export type WebStatus = (typeof WEB_STATUSES)[number];

export const WEB_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type WebPriority = (typeof WEB_PRIORITIES)[number];

export const WEB_SECTIONS = [
  "project",
  "discovery",
  "ux",
  "cms",
  "booking",
  "tracking",
  "seo",
  "qa",
  "reports",
  "approvals",
  "settings",
] as const;
export type WebSection = (typeof WEB_SECTIONS)[number];

export const WEB_GROUP_BY = ["status", "owner", "department", "hotel", "projectType", "market", "language"] as const;
export type WebGroupBy = (typeof WEB_GROUP_BY)[number];

export const WEB_SORTS = ["launchDate", "priority", "nextActionAt", "updatedAt"] as const;
export type WebSort = (typeof WEB_SORTS)[number];

export const WEB_FORM_TABS = [
  "overview",
  "discovery",
  "sitemap",
  "ux",
  "cms",
  "booking",
  "tracking",
  "seo",
  "qa",
  "handover",
  "reports",
  "files",
  "history",
] as const;
export type WebFormTab = (typeof WEB_FORM_TABS)[number];

export const WEB_SUBTASK_STATUSES = ["not_started", "in_progress", "blocked", "completed"] as const;
export type WebSubtaskStatus = (typeof WEB_SUBTASK_STATUSES)[number];

export const WEB_READINESS = ["not_started", "in_progress", "blocked", "ready_for_review", "completed"] as const;
export type WebReadiness = (typeof WEB_READINESS)[number];

export const WEB_PROJECT_TYPES = ["improve_existing", "build_new", "landing_page", "booking_path"] as const;
export type WebProjectType = (typeof WEB_PROJECT_TYPES)[number];

export const WEB_APPROVAL_STATUSES = ["not_requested", "awaiting", "approved", "changes_requested", "rejected"] as const;
export type WebApprovalStatus = (typeof WEB_APPROVAL_STATUSES)[number];

export const WEB_BUDGET_STATUSES = ["not_set", "proposed", "approved", "declined"] as const;
export type WebBudgetStatus = (typeof WEB_BUDGET_STATUSES)[number];

export const WEB_KPI_DATA_STATUSES = ["draft", "sample", "approved"] as const;
export type WebKpiDataStatus = (typeof WEB_KPI_DATA_STATUSES)[number];

export const MIN_WEB_SUBTASKS = 1;
export const MAX_WEB_SUBTASKS = 10;

export const MASKED_VALUE = "••••";

export const WEB_DEPARTMENT_LABEL: Record<WebDepartment, string> = {
  marketing: "Marketing",
  revenue: "Revenue",
  distribution: "Distribution",
  sales: "Sales",
  management: "Management",
};

export const WEB_WORKSTREAM_LABEL: Record<WebWorkstream, string> = {
  project: "Website Projects",
  discovery: "Discovery and Content",
  ux: "UX / Mobile",
  cms: "CMS and Technology",
  booking: "Booking Engine",
  tracking: "Tracking and Analytics",
  seo: "SEO and Search",
  qa: "QA and Handover",
  reports: "Reports / KPI",
};

export const WEB_SECTION_LABEL: Record<WebSection, string> = {
  project: "Website Projects",
  discovery: "Discovery and Content",
  ux: "UX / Mobile",
  cms: "CMS and Technology",
  booking: "Booking Engine",
  tracking: "Tracking and Analytics",
  seo: "SEO and Search",
  qa: "QA and Handover",
  reports: "Reports / KPI",
  approvals: "Approvals",
  settings: "Settings",
};

export const WEB_STATUS_LABEL: Record<WebStatus, string> = {
  draft: "Draft",
  discovery: "Discovery",
  content_needed: "Content Needed",
  structure_review: "Structure Review",
  design_review: "Design Review",
  development: "Development",
  integration: "Integration",
  qa: "QA",
  awaiting_hotel_approval: "Awaiting Hotel Approval",
  ready_for_handover: "Ready for Handover",
  live: "Live",
  monitoring: "Monitoring",
  archived: "Archived",
};

export const WEB_PRIORITY_LABEL: Record<WebPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const WEB_GROUP_LABEL: Record<WebGroupBy, string> = {
  status: "สถานะ",
  owner: "ผู้รับผิดชอบ",
  department: "แผนก",
  hotel: "โรงแรม",
  projectType: "ประเภทงาน",
  market: "ตลาด",
  language: "ภาษา",
};

export const WEB_SORT_LABEL: Record<WebSort, string> = {
  launchDate: "วันที่เปิดตัว",
  priority: "Priority",
  nextActionAt: "Next action date",
  updatedAt: "Updated date",
};

export const WEB_FORM_TAB_LABEL: Record<WebFormTab, string> = {
  overview: "ภาพรวม",
  discovery: "Discovery / Content",
  sitemap: "Sitemap / IA",
  ux: "UX / Mobile",
  cms: "CMS / Technology",
  booking: "Booking Engine",
  tracking: "Tracking / Analytics",
  seo: "SEO / Search",
  qa: "QA Checklist",
  handover: "Handover",
  reports: "Reports / KPI",
  files: "Files and Notes",
  history: "Audit History",
};

export const WEB_SUBTASK_STATUS_LABEL: Record<WebSubtaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  completed: "Completed",
};

export const WEB_READINESS_LABEL: Record<WebReadiness, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  ready_for_review: "Ready for review",
  completed: "Completed",
};

export const WEB_PROJECT_TYPE_LABEL: Record<WebProjectType, string> = {
  improve_existing: "Improve Existing",
  build_new: "Build New",
  landing_page: "Landing Page",
  booking_path: "Booking Path",
};

export const WEB_APPROVAL_LABEL: Record<WebApprovalStatus, string> = {
  not_requested: "ยังไม่ขออนุมัติ",
  awaiting: "รออนุมัติ",
  approved: "อนุมัติแล้ว",
  changes_requested: "ขอแก้ไข",
  rejected: "ไม่อนุมัติ",
};

export const WEB_BUDGET_STATUS_LABEL: Record<WebBudgetStatus, string> = {
  not_set: "ยังไม่ตั้ง",
  proposed: "เสนอแล้ว",
  approved: "อนุมัติงบ",
  declined: "ไม่อนุมัติงบ",
};

export const WEB_KPI_DATA_STATUS_LABEL: Record<WebKpiDataStatus, string> = {
  draft: "Draft",
  sample: "Sample",
  approved: "Approved",
};

export const WEB_PRIORITY_RANK: Record<WebPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const WEB_SECTION_WORKSTREAM: Partial<Record<WebSection, WebWorkstream>> = {
  discovery: "discovery",
  ux: "ux",
  cms: "cms",
  booking: "booking",
  tracking: "tracking",
  seo: "seo",
  qa: "qa",
};

export const WEB_DEPARTMENT_DUTIES: Record<WebDepartment, string[]> = {
  marketing: ["Brand message", "Website content", "Campaign landing page", "SEO and content priorities"],
  revenue: ["Offer and promotion", "Price display context", "Booking value interpretation", "Direct booking objective"],
  distribution: ["Booking Engine", "Rate and availability connection", "Channel consistency", "Direct booking path"],
  sales: ["Hotel value proposition", "Contact path", "Lead handling", "Market and partner context"],
  management: ["Budget and scope approval", "Brand/legal approval", "Launch approval", "KPI review"],
};

export const WEB_STARTER_SUBTASKS: Array<{ department: WebDepartment; name: string }> = [
  { department: "marketing", name: "Brand message, website content, campaign landing page, and SEO/content priorities" },
  { department: "revenue", name: "Offer/promotion, price display context, booking value interpretation, and direct booking objective" },
  { department: "distribution", name: "Booking Engine, rate/availability connection, channel consistency, and direct booking path" },
  { department: "sales", name: "Hotel value proposition, contact path, lead handling, and market/partner context" },
  { department: "management", name: "Budget/scope, brand/legal, launch approval, and KPI review" },
];

export const WEB_DEFAULT_QA: string[] = [
  "Home answers where, what hotel, and how to book",
  "Room and offer pages match the booking path",
  "Mobile booking path works without pinch-zoom",
  "Booking engine opens with the selected stay dates",
  "Tracking events fire only after hotel/owner confirmation",
  "Thai and English copy is complete where bilingual is required",
  "CMS login, domain, and hosting owners are named",
];

export const WEB_DEFAULT_HANDOVER: string[] = [
  "CMS owner and editor access",
  "Source-code owner",
  "Domain owner",
  "Hosting owner",
  "Analytics owner",
  "Booking engine account owner",
  "Handover notes accepted by hotel",
];

export type WebAccessView = {
  userId: string;
  departments: WebDepartment[];
  canEditBoard: boolean;
  canManageSettings: boolean;
  canSeePrivateIds: boolean;
  isManagement: boolean;
};

export type WebSourceView = {
  id: string;
  name: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  notes: string;
};

export type WebKpiView = {
  id: string;
  name: string;
  period: string;
  value: string;
  definition: string;
  source: string;
  dataStatus: WebKpiDataStatus;
  market: string;
};

export type WebAuditView = {
  id: string;
  action: string;
  detail: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
};

export type WebSubtaskCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type WebSubtaskFileView = {
  id: string;
  filename: string;
  caption: string;
  size: number;
  createdAt: string;
  href: string;
};

export type WebSubtaskView = {
  id: string;
  propertyId: string;
  name: string;
  department: WebDepartment;
  ownerId: string;
  ownerName: string;
  status: WebSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: WebPriority;
  comments: string;
  source: string;
  thread: WebSubtaskCommentView[];
  files: WebSubtaskFileView[];
};

export type WebSubtaskProgress = {
  total: number;
  completed: number;
  percent: number;
  readiness: WebReadiness;
  countLabel: string;
};

export type WebChecklistItem = {
  id: string;
  label: string;
  status: WebReadiness;
  notes: string;
  owner: string;
};

export type WebSitemapPage = {
  id: string;
  name: string;
  parent: string;
  purpose: string;
  status: WebReadiness;
};

export type WebDecisionView = {
  id: string;
  title: string;
  decision: string;
  owner: string;
  status: WebReadiness;
  notes: string;
};

export type WebApprovalView = {
  id: string;
  kind: string;
  status: WebApprovalStatus;
  notes: string;
  requestedBy: string;
  decidedBy: string;
  createdAt: string;
};

export type WebFileNote = {
  id: string;
  name: string;
  caption: string;
  status: WebReadiness;
};

export type WebSectionBlock = {
  summary: string;
  owner: string;
  status: WebReadiness;
  notes: string;
  items: WebChecklistItem[];
};

export type WebProjectRow = {
  id: string;
  projectName: string;
  hotelName: string;
  currentUrl: string;
  bookingEngine: string;
  bookingEngineUrl: string;
  cmsType: string;
  projectType: WebProjectType;
  primaryGoal: string;
  targetMarket: string;
  languages: string;
  startDate: string;
  launchDate: string;
  mobileReady: string;
  improveOrRebuild: string;
  status: WebStatus;
  ownerId: string;
  ownerName: string;
  department: WebDepartment;
  workstream: WebWorkstream;
  priority: WebPriority;
  nextAction: string;
  nextActionAt: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  budgetStatus: WebBudgetStatus;
  trackingStatus: WebReadiness;
  seoStatus: WebReadiness;
  mobileStatus: WebReadiness;
  handoverStatus: WebReadiness;
  engineAccountRef: string;
  analyticsRef: string;
  privateMasked: boolean;
  cmsOwner: string;
  sourceCodeOwner: string;
  domainOwner: string;
  hostingOwner: string;
  analyticsOwner: string;
  bookingEngineOwner: string;
  discovery: WebSectionBlock;
  sitemap: WebSitemapPage[];
  sitemapNotes: string;
  ux: WebSectionBlock;
  cms: WebSectionBlock;
  booking: WebSectionBlock;
  tracking: WebSectionBlock;
  seo: WebSectionBlock;
  qa: WebChecklistItem[];
  handover: WebChecklistItem[];
  fileNotes: WebFileNote[];
  decisions: WebDecisionView[];
  approvals: WebApprovalView[];
  sources: WebSourceView[];
  kpis: WebKpiView[];
  history: WebAuditView[];
  subtasks: WebSubtaskView[];
  progress: WebSubtaskProgress;
};

export type WebListFilters = {
  q?: string;
  status?: string;
  ownerId?: string;
  department?: string;
  hotel?: string;
  workstream?: string;
  projectType?: string;
  market?: string;
  language?: string;
  group?: string;
  sort?: string;
  view?: string;
};

const LEGACY_STATUS: Record<string, WebStatus> = {
  draft: "draft",
  audit_scheduled: "discovery",
  in_review: "structure_review",
  action_planned: "content_needed",
  in_progress: "development",
  waiting_hotel: "awaiting_hotel_approval",
  ready_approval: "ready_for_handover",
  published: "live",
  tracking: "monitoring",
  completed: "live",
  archived: "archived",
};

const LEGACY_WORKSTREAM: Record<string, WebWorkstream> = {
  project: "project",
  booking: "booking",
  cms: "cms",
  handover: "qa",
  measure: "reports",
  discovery: "discovery",
  ux: "ux",
  tracking: "tracking",
  seo: "seo",
  qa: "qa",
  reports: "reports",
};

const LEGACY_PROJECT_TYPE: Record<string, WebProjectType> = {
  improve: "improve_existing",
  rebuild: "build_new",
  "improve existing": "improve_existing",
  "build new": "build_new",
  landing: "landing_page",
  booking: "booking_path",
};

export function isDepartment(value: string): value is WebDepartment {
  return WEB_DEPARTMENTS.includes(value as WebDepartment);
}

export function isWorkstream(value: string): value is WebWorkstream {
  return WEB_WORKSTREAMS.includes(value as WebWorkstream);
}

export function isWebStatus(value: string): value is WebStatus {
  return WEB_STATUSES.includes(value as WebStatus);
}

export function isPriority(value: string): value is WebPriority {
  return WEB_PRIORITIES.includes(value as WebPriority);
}

export function isGroupBy(value: string): value is WebGroupBy {
  return WEB_GROUP_BY.includes(value as WebGroupBy);
}

export function isSort(value: string): value is WebSort {
  return WEB_SORTS.includes(value as WebSort);
}

export function isKpiDataStatus(value: string): value is WebKpiDataStatus {
  return WEB_KPI_DATA_STATUSES.includes(value as WebKpiDataStatus);
}

export function isSubtaskStatus(value: string): value is WebSubtaskStatus {
  return WEB_SUBTASK_STATUSES.includes(value as WebSubtaskStatus);
}

export function isProjectType(value: string): value is WebProjectType {
  return WEB_PROJECT_TYPES.includes(value as WebProjectType);
}

export function isApprovalStatus(value: string): value is WebApprovalStatus {
  return WEB_APPROVAL_STATUSES.includes(value as WebApprovalStatus);
}

export function isBudgetStatus(value: string): value is WebBudgetStatus {
  return WEB_BUDGET_STATUSES.includes(value as WebBudgetStatus);
}

export function isReadiness(value: string): value is WebReadiness {
  return WEB_READINESS.includes(value as WebReadiness);
}

export function normalizeStatus(value: string): WebStatus {
  if (isWebStatus(value)) return value;
  return LEGACY_STATUS[value] || "draft";
}

export function normalizeWorkstream(value: string): WebWorkstream {
  if (isWorkstream(value)) return value;
  return LEGACY_WORKSTREAM[value] || "project";
}

export function normalizeProjectType(value: string): WebProjectType {
  if (isProjectType(value)) return value;
  const key = value.trim().toLowerCase();
  return LEGACY_PROJECT_TYPE[key] || "improve_existing";
}

export function normalizeReadiness(value: string): WebReadiness {
  return isReadiness(value) ? value : "not_started";
}

export function normalizeSubtaskStatus(value: string): WebSubtaskStatus {
  if (value === "done" || value === "complete") return "completed";
  return isSubtaskStatus(value) ? value : "not_started";
}

export function webSectionPath(section: WebSection) {
  return section === "project" ? "/crm/website" : `/crm/website/${section}`;
}

export function webSectionFormTab(section: WebSection): WebFormTab {
  if (section === "discovery") return "discovery";
  if (section === "ux") return "ux";
  if (section === "cms") return "cms";
  if (section === "booking") return "booking";
  if (section === "tracking") return "tracking";
  if (section === "seo") return "seo";
  if (section === "qa") return "qa";
  if (section === "reports") return "reports";
  if (section === "approvals") return "overview";
  return "overview";
}

export function emptySectionBlock(): WebSectionBlock {
  return { summary: "", owner: "", status: "not_started", notes: "", items: [] };
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
  };
  const thai = th[code] || code || "บันทึกไม่สำเร็จ";
  const english = en[code] || "Save failed";
  return `${thai} / ${english}`;
}
