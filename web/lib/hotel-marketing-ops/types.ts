/**
 * Hotel Marketing Editorial / Operations — internal CRM board.
 * Separate from the public CMS article editor (/crm/cms/hotel-marketing) and /insights/hotel-marketing.
 * Types are prefixed Hmo / HmOps to avoid clashing with the CMS hotel-marketing-insight module.
 */

export const HMO_MODULE_KEY = "hotel_marketing" as const;
export const HMO_BASE_PATH = "/crm/hotel-marketing";
export const HMO_MODULE_LABEL = "Hotel Marketing Editorial Operations";

/* ------------------------------------------------------------------ departments */

export const HMO_DEPARTMENTS = [
  "marketing_content",
  "revenue",
  "distribution",
  "sales",
  "reservations",
  "operations",
  "management",
  "it_data",
] as const;
export type HmoDepartment = (typeof HMO_DEPARTMENTS)[number];

export const HMO_DEPARTMENT_LABEL: Record<HmoDepartment, string> = {
  marketing_content: "Marketing / Content",
  revenue: "Revenue Management",
  distribution: "Distribution",
  sales: "Sales",
  reservations: "Reservations",
  operations: "Operations / Guest Experience",
  management: "Management",
  it_data: "IT / Data",
};

export const HMO_DEPARTMENT_SLUG: Record<HmoDepartment, string> = {
  marketing_content: "marketing-content",
  revenue: "revenue",
  distribution: "distribution",
  sales: "sales",
  reservations: "reservations",
  operations: "operations",
  management: "management",
  it_data: "it-data",
};

export const HMO_DEPARTMENT_PATH: Record<HmoDepartment, string> = {
  marketing_content: `${HMO_BASE_PATH}/departments/marketing-content`,
  revenue: `${HMO_BASE_PATH}/departments/revenue`,
  distribution: `${HMO_BASE_PATH}/departments/distribution`,
  sales: `${HMO_BASE_PATH}/departments/sales`,
  reservations: `${HMO_BASE_PATH}/departments/reservations`,
  operations: `${HMO_BASE_PATH}/departments/operations`,
  management: `${HMO_BASE_PATH}/departments/management`,
  it_data: `${HMO_BASE_PATH}/departments/it-data`,
};

/** Short responsibility summary shown in department workspaces and subtask hints. */
export const HMO_DEPARTMENT_RESPONSIBILITY: Record<HmoDepartment, string> = {
  marketing_content: "Brief, SEO content, social/ad copy, asset approval, editorial calendar",
  revenue: "KPI definitions, demand context, pricing/availability interpretation, commercial review",
  distribution: "OTA/agent/channel context and listing dependencies",
  sales: "Partner/agent positioning and lead follow-up context",
  reservations: "Booking path and enquiry/booking workflow feedback",
  operations: "Service context, guest feedback themes, property information accuracy",
  management: "Scope, priority, approval, and business decision",
  it_data: "Analytics access, source quality, privacy, system dependency",
};

/**
 * Suggested cross-department checklist items (suggestions only — never auto-seeded).
 * Names that match source/permission/privacy/approval keywords auto-tag blocking gates.
 */
export const HMO_DEPARTMENT_DUTIES: Record<HmoDepartment, string[]> = {
  marketing_content: [
    "Content brief",
    "SEO content draft",
    "Social / ad copy",
    "Asset approval / image permission",
    "Editorial calendar slot",
  ],
  revenue: [
    "Confirm KPI definitions",
    "Demand context review",
    "Pricing / availability interpretation",
    "Commercial review",
    "Verify source citation",
  ],
  distribution: [
    "OTA / agent channel context",
    "Listing dependency check",
    "Channel path wording",
  ],
  sales: [
    "Partner / agent positioning",
    "Lead follow-up context",
  ],
  reservations: [
    "Booking path feedback",
    "Enquiry / booking workflow feedback",
  ],
  operations: [
    "Service context accuracy",
    "Guest feedback themes (themes only — no guest IDs)",
    "Property information accuracy",
    "Confirm image permission",
  ],
  management: [
    "Approve scope and priority",
    "Business decision / final approval",
  ],
  it_data: [
    "Analytics access check",
    "Source quality review",
    "Privacy / data handling review",
    "System dependency note",
  ],
};

export type HmoExtraDepartment = { id: string; label: string };
export type HmoSettings = { extraDepartments: HmoExtraDepartment[] };
export const MAX_HMO_EXTRA_DEPARTMENTS = 12;

/* ------------------------------------------------------------------ record kinds */

export const HMO_KINDS = [
  "article",
  "campaign",
  "channel_plan",
  "seo_brief",
  "metric",
  "asset",
  "related_link",
  "translation",
  "report",
] as const;
export type HmoKind = (typeof HMO_KINDS)[number];

export const HMO_KIND_LABEL: Record<HmoKind, string> = {
  article: "Article",
  campaign: "Campaign",
  channel_plan: "Channel plan",
  seo_brief: "SEO brief",
  metric: "Metric / KPI definition",
  asset: "Asset / permission review",
  related_link: "Related link",
  translation: "Translation review",
  report: "Report",
};

export const HMO_KIND_DESCRIPTION: Record<HmoKind, string> = {
  article: "Editorial article work item",
  campaign: "Campaign / marketing plan",
  channel_plan: "Channel / distribution plan item",
  seo_brief: "SEO / content brief",
  metric: "KPI definition",
  asset: "Asset library / permission review",
  related_link: "Related service or link",
  translation: "Translation review item",
  report: "Internal report",
};

/* ------------------------------------------------------------------ sections */

export const HMO_SECTIONS = [
  "overview",
  "editorial_calendar",
  "article_backlog",
  "drafts_reviews",
  "seo_briefs",
  "campaign_calendar",
  "channel_plan",
  "metrics",
  "assets",
  "approvals",
  "related_links",
  "translation",
  "reports",
  "audit",
  "settings",
  "departments",
] as const;
export type HmoSection = (typeof HMO_SECTIONS)[number];

export const HMO_SECTION_LABEL: Record<HmoSection, string> = {
  overview: "Overview",
  editorial_calendar: "Editorial Calendar",
  article_backlog: "Article Backlog",
  drafts_reviews: "Drafts / Reviews",
  seo_briefs: "SEO Briefs",
  campaign_calendar: "Campaign Calendar",
  channel_plan: "Channel Plan",
  metrics: "Metrics / KPI Definitions",
  assets: "Assets / Permissions",
  approvals: "Approvals",
  related_links: "Related Links",
  translation: "Translation",
  reports: "Reports",
  audit: "Audit History",
  settings: "Settings",
  departments: "Department Workspaces",
};

export const HMO_SECTION_PATH: Record<HmoSection, string> = {
  overview: HMO_BASE_PATH,
  editorial_calendar: `${HMO_BASE_PATH}/editorial-calendar`,
  article_backlog: `${HMO_BASE_PATH}/backlog`,
  drafts_reviews: `${HMO_BASE_PATH}/drafts`,
  seo_briefs: `${HMO_BASE_PATH}/seo-briefs`,
  campaign_calendar: `${HMO_BASE_PATH}/campaigns`,
  channel_plan: `${HMO_BASE_PATH}/channels`,
  metrics: `${HMO_BASE_PATH}/metrics`,
  assets: `${HMO_BASE_PATH}/assets`,
  approvals: `${HMO_BASE_PATH}/approvals`,
  related_links: `${HMO_BASE_PATH}/related-links`,
  translation: `${HMO_BASE_PATH}/translation`,
  reports: `${HMO_BASE_PATH}/reports`,
  audit: `${HMO_BASE_PATH}/audit`,
  settings: `${HMO_BASE_PATH}/settings`,
  departments: `${HMO_BASE_PATH}/departments`,
};

/** Default record kind for the create form per section. */
export const HMO_SECTION_DEFAULT_KIND: Record<HmoSection, HmoKind> = {
  overview: "article",
  editorial_calendar: "article",
  article_backlog: "article",
  drafts_reviews: "article",
  approvals: "article",
  seo_briefs: "seo_brief",
  campaign_calendar: "campaign",
  channel_plan: "channel_plan",
  metrics: "metric",
  assets: "asset",
  related_links: "related_link",
  translation: "translation",
  reports: "report",
  audit: "article",
  settings: "article",
  departments: "article",
};

/** Sections that filter the board to exactly one kind. Others show every kind. */
export const HMO_SECTION_KIND_FILTER: Partial<Record<HmoSection, HmoKind>> = {
  editorial_calendar: "article",
  article_backlog: "article",
  drafts_reviews: "article",
  seo_briefs: "seo_brief",
  campaign_calendar: "campaign",
  channel_plan: "channel_plan",
  metrics: "metric",
  assets: "asset",
  related_links: "related_link",
  translation: "translation",
  reports: "report",
};

/* ------------------------------------------------------------------ statuses / priorities */

export const HMO_STATUSES = [
  "new",
  "draft",
  "in_progress",
  "in_review",
  "needs_sources",
  "needs_permissions",
  "approved",
  "scheduled",
  "published",
  "blocked",
  "archived",
] as const;
export type HmoStatus = (typeof HMO_STATUSES)[number];

export const HMO_STATUS_LABEL: Record<HmoStatus, string> = {
  new: "New",
  draft: "Draft",
  in_progress: "In progress",
  in_review: "In review",
  needs_sources: "Needs sources",
  needs_permissions: "Needs permissions",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  blocked: "Blocked",
  archived: "Archived",
};

/** Statuses an approval queue watches. */
export const HMO_APPROVAL_QUEUE_STATUSES: HmoStatus[] = ["in_review", "needs_sources", "needs_permissions"];
/** Statuses that need an approver and can be blocked by an open gate. */
export const HMO_RELEASE_STATUSES: HmoStatus[] = ["approved", "scheduled", "published"];

export const HMO_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type HmoPriority = (typeof HMO_PRIORITIES)[number];
export const HMO_PRIORITY_LABEL: Record<HmoPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};
export const HMO_PRIORITY_RANK: Record<HmoPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };

/* ------------------------------------------------------------------ board controls */

export const HMO_GROUP_BY = ["status", "department", "kind", "channel", "month"] as const;
export type HmoGroupBy = (typeof HMO_GROUP_BY)[number];
export const HMO_GROUP_LABEL: Record<HmoGroupBy, string> = {
  status: "Status",
  department: "Department",
  kind: "Kind",
  channel: "Channel",
  month: "Month (publish / due)",
};

export const HMO_SORTS = ["dueAt", "publishAt", "priority", "status", "updatedAt"] as const;
export type HmoSort = (typeof HMO_SORTS)[number];
export const HMO_SORT_LABEL: Record<HmoSort, string> = {
  dueAt: "Due date",
  publishAt: "Publish date",
  priority: "Priority",
  status: "Status",
  updatedAt: "Last updated",
};

export const HMO_VIEWS = ["table", "board"] as const;
export type HmoView = (typeof HMO_VIEWS)[number];

/* ------------------------------------------------------------------ payload enums */

export const HMO_SOURCE_CITATION_STATUSES = ["missing", "draft", "needs_review", "verified"] as const;
export type HmoSourceCitationStatus = (typeof HMO_SOURCE_CITATION_STATUSES)[number];
export const HMO_SOURCE_CITATION_LABEL: Record<HmoSourceCitationStatus, string> = {
  missing: "Missing",
  draft: "Draft",
  needs_review: "Needs review",
  verified: "Verified",
};

export const HMO_IMAGE_PERMISSION_STATUSES = ["not_applicable", "pending", "approved", "redacted", "denied"] as const;
export type HmoImagePermissionStatus = (typeof HMO_IMAGE_PERMISSION_STATUSES)[number];
export const HMO_IMAGE_PERMISSION_LABEL: Record<HmoImagePermissionStatus, string> = {
  not_applicable: "Not applicable",
  pending: "Pending",
  approved: "Approved",
  redacted: "Redacted",
  denied: "Denied",
};

export const HMO_DRAFT_STATUSES = ["not_started", "outline", "drafting", "ready_for_review", "revised"] as const;
export type HmoDraftStatus = (typeof HMO_DRAFT_STATUSES)[number];
export const HMO_DRAFT_STATUS_LABEL: Record<HmoDraftStatus, string> = {
  not_started: "Not started",
  outline: "Outline",
  drafting: "Drafting",
  ready_for_review: "Ready for review",
  revised: "Revised",
};

export const HMO_VERIFIED_STATUSES = ["draft", "sample", "verified", "requires_review"] as const;
export type HmoVerifiedStatus = (typeof HMO_VERIFIED_STATUSES)[number];
export const HMO_VERIFIED_LABEL: Record<HmoVerifiedStatus, string> = {
  draft: "Draft",
  sample: "Sample",
  verified: "Verified",
  requires_review: "Requires review",
};

export const HMO_ASSET_PERMISSION_STATUSES = ["pending", "approved", "redacted", "denied"] as const;
export type HmoAssetPermissionStatus = (typeof HMO_ASSET_PERMISSION_STATUSES)[number];
export const HMO_ASSET_PERMISSION_LABEL: Record<HmoAssetPermissionStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  redacted: "Redacted",
  denied: "Denied",
};

export const HMO_ASSET_TYPES = ["photo", "illustration", "logo", "video", "document", "other"] as const;
export type HmoAssetType = (typeof HMO_ASSET_TYPES)[number];
export const HMO_ASSET_TYPE_LABEL: Record<HmoAssetType, string> = {
  photo: "Photo",
  illustration: "Illustration",
  logo: "Logo",
  video: "Video",
  document: "Document",
  other: "Other",
};

export const HMO_LOCALES = ["th", "en", "ru", "zh"] as const;
export type HmoLocale = (typeof HMO_LOCALES)[number];
export const HMO_LOCALE_LABEL: Record<HmoLocale, string> = {
  th: "Thai (th)",
  en: "English (en)",
  ru: "Russian (ru)",
  zh: "Chinese (zh)",
};

export const HMO_APPROVAL_STATUSES = ["not_requested", "awaiting", "approved", "rejected", "changes_requested"] as const;
export type HmoApprovalStatus = (typeof HMO_APPROVAL_STATUSES)[number];
export const HMO_APPROVAL_LABEL: Record<HmoApprovalStatus, string> = {
  not_requested: "Not requested",
  awaiting: "Awaiting",
  approved: "Approved",
  rejected: "Rejected",
  changes_requested: "Changes requested",
};

/* ------------------------------------------------------------------ subtasks */

export const HMO_SUBTASK_STATUSES = ["not_started", "in_progress", "blocked", "needs_review", "completed"] as const;
export type HmoSubtaskStatus = (typeof HMO_SUBTASK_STATUSES)[number];
export const HMO_SUBTASK_STATUS_LABEL: Record<HmoSubtaskStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  blocked: "Blocked",
  needs_review: "Needs review",
  completed: "Completed",
};

export const HMO_GATE_KINDS = ["none", "sources", "permissions", "privacy", "approval"] as const;
export type HmoGateKind = (typeof HMO_GATE_KINDS)[number];
export const HMO_BLOCKING_GATES: HmoGateKind[] = ["sources", "permissions", "privacy", "approval"];
export const HMO_GATE_LABEL: Record<HmoGateKind, string> = {
  none: "Coordination",
  sources: "Source citation",
  permissions: "Image / asset permission",
  privacy: "Privacy / data handling",
  approval: "Approval",
};

export const HMO_READINESS = ["not_started", "in_progress", "blocked", "ready_for_review", "completed"] as const;
export type HmoReadiness = (typeof HMO_READINESS)[number];
export const HMO_READINESS_LABEL: Record<HmoReadiness, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  blocked: "Blocked",
  ready_for_review: "Needs review",
  completed: "Completed",
};

/** Soft range for cross-department work: 1–10 subtasks per article/campaign item. */
export const MAX_HMO_SUBTASKS = 10;

export function hmoGateKind(name: string): HmoGateKind {
  const text = name.toLowerCase();
  if (/source|citation|cite|source quality/.test(text)) return "sources";
  if (/permission|consent|image|photo|asset approval/.test(text)) return "permissions";
  if (/privacy|data handling|guest data|client data|redact|analytics access/.test(text)) return "privacy";
  if (/approv|sign-?off|business decision|final approval|approve scope/.test(text)) return "approval";
  return "none";
}

/* ------------------------------------------------------------------ views */

export type HmoAccessView = {
  userId: string;
  departments: string[];
  canEditBoard: boolean;
  canApprove: boolean;
  canManageSettings: boolean;
  isManagement: boolean;
};

export type HmoSubtaskCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type HmoSubtaskView = {
  id: string;
  recordId: string;
  name: string;
  department: string;
  ownerId: string;
  ownerName: string;
  reviewerId: string;
  reviewerName: string;
  status: HmoSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: HmoPriority;
  comments: string;
  evidence: string;
  gateKind: HmoGateKind;
  sortOrder: number;
  thread: HmoSubtaskCommentView[];
};

export type HmoSubtaskProgress = {
  total: number;
  completed: number;
  percent: number;
  readiness: HmoReadiness;
  /** e.g. "3/5 completed" */
  countLabel: string;
  blockedByGate: boolean;
  gateReasons: HmoGateKind[];
  /** Per-department completion for cross-department badges. */
  byDepartment: Array<{ department: string; total: number; completed: number; percent: number; countLabel: string }>;
};

export type HmoApprovalView = {
  id: string;
  kind: string;
  status: HmoApprovalStatus;
  notes: string;
  requestedBy: string;
  decidedBy: string;
  decidedByName: string;
  createdAt: string;
};

export type HmoAuditView = {
  id: string;
  recordId: string;
  action: string;
  detail: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
};

/* ------------------------------------------------------------------ payload */

export type HmoPayload = {
  /* article */
  targetAudience: string;
  searchIntent: string;
  contentGoal: string;
  relatedServiceHrefs: string[];
  draftStatus: string;
  sourceCitationStatus: string;
  imagePermissionStatus: string;
  seoTitle: string;
  seoDescription: string;
  /* campaign */
  campaignName: string;
  propertyLabel: string;
  departmentOwner: string;
  channel: string;
  objective: string;
  landingPage: string;
  bookingPathDependency: string;
  kpiDefinition: string;
  period: string;
  dataSource: string;
  riskApproval: string;
  nextAction: string;
  nextActionDate: string;
  /* metric / report */
  definition: string;
  source: string;
  ownerLabel: string;
  verifiedStatus: string;
  method: string;
  /* asset */
  assetType: string;
  altText: string;
  permissionStatus: string;
  permissionNote: string;
  sourceNote: string;
  containsClientOrGuestData: boolean;
  /* seo_brief */
  primaryIntent: string;
  targetQueries: string;
  outline: string;
  relatedServices: string;
  /* channel_plan */
  roleInPath: string;
  ownerDept: string;
  dependency: string;
  /* related_link */
  href: string;
  label: string;
  why: string;
  /* translation */
  sourceLocale: string;
  targetLocale: string;
  statusNote: string;
  /* shared */
  notes: string;
};

export function emptyHmoPayload(): HmoPayload {
  return {
    targetAudience: "",
    searchIntent: "",
    contentGoal: "",
    relatedServiceHrefs: [],
    draftStatus: "not_started",
    sourceCitationStatus: "missing",
    imagePermissionStatus: "not_applicable",
    seoTitle: "",
    seoDescription: "",
    campaignName: "",
    propertyLabel: "",
    departmentOwner: "",
    channel: "",
    objective: "",
    landingPage: "",
    bookingPathDependency: "",
    kpiDefinition: "",
    period: "",
    dataSource: "",
    riskApproval: "",
    nextAction: "",
    nextActionDate: "",
    definition: "",
    source: "",
    ownerLabel: "",
    verifiedStatus: "draft",
    method: "",
    assetType: "photo",
    altText: "",
    permissionStatus: "pending",
    permissionNote: "",
    sourceNote: "",
    containsClientOrGuestData: false,
    primaryIntent: "",
    targetQueries: "",
    outline: "",
    relatedServices: "",
    roleInPath: "",
    ownerDept: "",
    dependency: "",
    href: "",
    label: "",
    why: "",
    sourceLocale: "th",
    targetLocale: "en",
    statusNote: "",
    notes: "",
  };
}

export type HmoRecordRow = {
  id: string;
  kind: HmoKind;
  title: string;
  category: string;
  department: string;
  ownerId: string;
  ownerName: string;
  authorId: string;
  authorName: string;
  reviewerId: string;
  reviewerName: string;
  status: HmoStatus;
  priority: HmoPriority;
  channel: string;
  publishAt: string;
  lastReviewAt: string;
  nextAction: string;
  nextActionOwnerId: string;
  nextActionOwnerName: string;
  dueAt: string;
  archived: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  payload: HmoPayload;
  approvals: HmoApprovalView[];
  history: HmoAuditView[];
  subtasks: HmoSubtaskView[];
  progress: HmoSubtaskProgress;
};

export type HmoListFilters = {
  q?: string;
  department?: string;
  ownerId?: string;
  channel?: string;
  status?: string;
  category?: string;
  kind?: string;
  dateFrom?: string;
  dateTo?: string;
  group?: string;
  sort?: string;
  view?: string;
  archived?: string;
};

/** Raw Next.js searchParams as received by a page. */
export type HmoRawSearchParams = Record<string, string | string[] | undefined>;

/* ------------------------------------------------------------------ guards / normalizers */

export function isHmoDepartment(value: string, extras: HmoExtraDepartment[] = []) {
  return HMO_DEPARTMENTS.includes(value as HmoDepartment) || extras.some((item) => item.id === value);
}
export function isHmoKind(value: string): value is HmoKind {
  return HMO_KINDS.includes(value as HmoKind);
}
export function isHmoStatus(value: string): value is HmoStatus {
  return HMO_STATUSES.includes(value as HmoStatus);
}
export function isHmoPriority(value: string): value is HmoPriority {
  return HMO_PRIORITIES.includes(value as HmoPriority);
}
export function isHmoSection(value: string): value is HmoSection {
  return HMO_SECTIONS.includes(value as HmoSection);
}
export function isHmoGroupBy(value: string): value is HmoGroupBy {
  return HMO_GROUP_BY.includes(value as HmoGroupBy);
}
export function isHmoSort(value: string): value is HmoSort {
  return HMO_SORTS.includes(value as HmoSort);
}
export function isHmoSubtaskStatus(value: string): value is HmoSubtaskStatus {
  return HMO_SUBTASK_STATUSES.includes(value as HmoSubtaskStatus);
}
export function isHmoGateKind(value: string): value is HmoGateKind {
  return HMO_GATE_KINDS.includes(value as HmoGateKind);
}
export function isHmoApprovalStatus(value: string): value is HmoApprovalStatus {
  return HMO_APPROVAL_STATUSES.includes(value as HmoApprovalStatus);
}
export function isHmoReleaseStatus(value: string) {
  return HMO_RELEASE_STATUSES.includes(value as HmoStatus);
}

export function normalizeHmoStatus(value: string): HmoStatus {
  return isHmoStatus(value) ? value : "draft";
}
export function normalizeHmoPriority(value: string): HmoPriority {
  return isHmoPriority(value) ? value : "normal";
}
export function normalizeHmoKind(value: string): HmoKind {
  return isHmoKind(value) ? value : "article";
}
export function normalizeHmoSubtaskStatus(value: string): HmoSubtaskStatus {
  return isHmoSubtaskStatus(value) ? value : "not_started";
}
export function normalizeHmoGateKind(value: string, name = ""): HmoGateKind {
  if (isHmoGateKind(value) && value !== "none") return value;
  return hmoGateKind(name);
}
export function normalizeHmoApprovalStatus(value: string): HmoApprovalStatus {
  return isHmoApprovalStatus(value) ? value : "not_requested";
}
function oneOf<T extends string>(list: readonly T[], value: unknown, fallback: T): T {
  return list.includes(String(value) as T) ? (String(value) as T) : fallback;
}
export function normalizeHmoSourceCitation(value: unknown) {
  return oneOf(HMO_SOURCE_CITATION_STATUSES, value, "missing");
}
export function normalizeHmoImagePermission(value: unknown) {
  return oneOf(HMO_IMAGE_PERMISSION_STATUSES, value, "not_applicable");
}
export function normalizeHmoDraftStatus(value: unknown) {
  return oneOf(HMO_DRAFT_STATUSES, value, "not_started");
}
export function normalizeHmoVerified(value: unknown) {
  return oneOf(HMO_VERIFIED_STATUSES, value, "draft");
}
export function normalizeHmoAssetPermission(value: unknown) {
  return oneOf(HMO_ASSET_PERMISSION_STATUSES, value, "pending");
}
export function normalizeHmoAssetType(value: unknown) {
  return oneOf(HMO_ASSET_TYPES, value, "photo");
}
export function normalizeHmoLocale(value: unknown, fallback: HmoLocale) {
  return oneOf(HMO_LOCALES, value, fallback);
}

export function hmoDepartmentLabel(id: string, extras: HmoExtraDepartment[] = []) {
  if (HMO_DEPARTMENTS.includes(id as HmoDepartment)) return HMO_DEPARTMENT_LABEL[id as HmoDepartment];
  return extras.find((item) => item.id === id)?.label || id || "—";
}

export function hmoSectionPath(section: HmoSection) {
  return HMO_SECTION_PATH[section] || HMO_BASE_PATH;
}

export function hmoDepartmentFromSlug(slug: string): HmoDepartment | null {
  return HMO_DEPARTMENTS.find((id) => HMO_DEPARTMENT_SLUG[id] === slug) ?? null;
}

/** Date used for calendar grouping / sorting: publish date first, otherwise due date. */
export function hmoCalendarDate(row: { publishAt: string; dueAt: string }) {
  return row.publishAt || row.dueAt || "";
}

/** Board dates are shown and grouped in Thailand time (UTC+7) so server and browser agree. */
export const HMO_TIME_ZONE = "Asia/Bangkok";
const HMO_TZ_OFFSET_MS = 7 * 60 * 60 * 1000;

/** yyyy-mm-dd in Thailand time for an ISO timestamp, or "" when empty / invalid. */
export function hmoDateKey(iso: string) {
  if (!iso) return "";
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return "";
  return new Date(time + HMO_TZ_OFFSET_MS).toISOString().slice(0, 10);
}

export function hmoFormatDate(iso: string, withTime = false) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: HMO_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
  }).format(date);
}

export function hmoMonthLabel(key: string) {
  if (!/^\d{4}-\d{2}$/.test(key)) return key;
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", month: "long", year: "numeric" }).format(new Date(`${key}-01T00:00:00Z`));
}

/* ------------------------------------------------------------------ privacy guard */

/**
 * Blocks values that look like credentials, account / booking identifiers, guest contact data or spend.
 * The board holds editorial planning only — never client data.
 */
export const HMO_SECRET_ASSIGN_RE =
  /(password|passwd|passcode|api[_\-\s]?key|secret|token|account[_\-\s]?(id|number|no)|customer[_\-\s]?id|client[_\-\s]?id|booking[_\-\s]?(id|ref|reference|number|no)|reservation[_\-\s]?(id|number|no)|confirmation[_\-\s]?(id|code|number|no)|guest[_\-\s]?(id|name|email|phone)|ad[_\-\s]?spend|media[_\-\s]?spend|spend|login|credential|รหัสผ่าน|หมายเลขการจอง|รหัสการจอง|รหัสบัญชี|ชื่อแขก)\s*[:=]\s*\S+/i;
export const HMO_SECRET_TOKEN_RE = /\b(sk_live_[A-Za-z0-9]+|Bearer\s+[A-Za-z0-9\-._]{12,})\b/;
export const HMO_EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
export const HMO_SPEND_RE = /(spend|spent|ค่าโฆษณา|ค่าใช้จ่าย)\s*(of|was|is|=|:)?\s*[฿$€£]\s*\d|[฿$€£]\s*\d[\d,.]*\s*(spend|spent)/i;

export function hmoTextHasSecrets(value: string) {
  return HMO_SECRET_ASSIGN_RE.test(value) || HMO_SECRET_TOKEN_RE.test(value) || HMO_EMAIL_RE.test(value) || HMO_SPEND_RE.test(value);
}

export function hmoPayloadHasSecrets(value: unknown): boolean {
  if (typeof value === "string") return hmoTextHasSecrets(value);
  if (Array.isArray(value)) return value.some(hmoPayloadHasSecrets);
  if (value && typeof value === "object") return Object.values(value).some(hmoPayloadHasSecrets);
  return false;
}

/* ------------------------------------------------------------------ validation (client + server) */

const URL_RE = /^(#|\/|https?:\/\/)/i;
export function hmoIsAllowedUrl(value: string) {
  return !value || URL_RE.test(value.trim());
}

export type HmoValidationInput = {
  kind: HmoKind;
  title: string;
  channel: string;
  notes?: string;
  nextAction?: string;
  category?: string;
  payload: HmoPayload;
};

export function validateHmoRecord(input: HmoValidationInput): string | null {
  const { kind, payload } = input;
  if (!input.title.trim()) return "required_title";
  if (hmoPayloadHasSecrets({ title: input.title, category: input.category, nextAction: input.nextAction, channel: input.channel, payload })) return "blocked_secret";
  if (kind === "metric") {
    if (!payload.definition.trim() || !payload.period.trim() || !payload.source.trim()) return "metric_required";
  }
  if (kind === "asset" && payload.containsClientOrGuestData) {
    if (payload.permissionStatus !== "approved" && payload.permissionStatus !== "redacted") return "asset_permission";
  }
  if (kind === "campaign") {
    if (!payload.campaignName.trim() || !(input.channel.trim() || payload.channel.trim()) || !payload.objective.trim()) return "campaign_required";
  }
  if (kind === "related_link") {
    if (payload.href && !hmoIsAllowedUrl(payload.href)) return "invalid_url";
  }
  if (kind === "campaign" && payload.landingPage && !hmoIsAllowedUrl(payload.landingPage)) return "invalid_url";
  if (payload.relatedServiceHrefs.some((href) => !hmoIsAllowedUrl(href))) return "invalid_url";
  return null;
}

/** Bilingual (Thai / English) messages for action and validation codes. */
export function hmoErrorMessage(code: string) {
  const th: Record<string, string> = {
    missing: "ไม่พบรายการ",
    required_title: "กรอกชื่อรายการ",
    forbidden: "ไม่มีสิทธิ์แก้ไขบอร์ดนี้หรือแผนกนี้",
    forbidden_approve: "ต้องมีสิทธิ์อนุมัติเพื่อทำรายการนี้",
    invalid: "ข้อมูลไม่ถูกต้อง",
    missing_name: "กรอกชื่องานย่อย",
    missing_comment: "กรอกความเห็น",
    missing_note: "กรอกบันทึกการอนุมัติ",
    invalid_url: "ลิงก์ต้องเป็นเส้นทางภายใน (/…) หรือ https",
    blocked_secret: "ห้ามใส่รหัสผ่าน ข้อมูลบัญชี รหัสการจอง ข้อมูลแขก อีเมล หรือยอดใช้จ่าย",
    metric_required: "ตัวชี้วัดต้องมี Definition, Period และ Source",
    asset_permission: "แอสเซ็ตที่มีข้อมูลลูกค้า/แขก ต้องมีสถานะ Approved หรือ Redacted",
    campaign_required: "แคมเปญต้องมีชื่อแคมเปญ ช่องทาง และวัตถุประสงค์",
    subtask_limit: "แต่ละรายการมีงานย่อยได้ไม่เกิน 10 รายการ",
    blocked_gate: "มีงานย่อยที่ติดขัด (source / permission / privacy / approval) บล็อกการอนุมัติหรือเผยแพร่",
    duplicate_department: "รหัสแผนกซ้ำหรือไม่ถูกต้อง",
    missing_user: "เลือกผู้ใช้",
    missing_reviewer: "เลือกผู้ตรวจหรือผู้อนุมัติก่อนส่งต่อ / Escalate",
    missing_escalate_note: "กรอกเหตุผลก่อน Escalate / Approve / Reject",
    forbidden_review: "เฉพาะผู้ตรวจที่ได้รับมอบหมาย หรือผู้มีสิทธิ์อนุมัติ จึงตัดสินงานย่อยนี้ได้",
  };
  const en: Record<string, string> = {
    missing: "Record not found",
    required_title: "Enter a title",
    forbidden: "You do not have permission to edit this board or department",
    forbidden_approve: "Approval permission is required for this action",
    invalid: "The data is not valid",
    missing_name: "Enter a subtask name",
    missing_comment: "Enter a comment",
    missing_note: "Enter an approval note",
    invalid_url: "Links must be an internal path (/…) or https URL",
    blocked_secret: "Do not store passwords, account IDs, booking IDs, guest data, email addresses, or spend",
    metric_required: "A metric needs Definition, Period, and Source",
    asset_permission: "Assets containing client or guest data need permission Approved or Redacted",
    campaign_required: "A campaign needs a campaign name, channel, and objective",
    subtask_limit: "Each record can have at most 10 subtasks",
    blocked_gate: "A blocked source, permission, privacy, or approval task stops approval or publication",
    duplicate_department: "Department id is duplicated or invalid",
    missing_user: "Select a user",
    missing_reviewer: "Select a reviewer or approver before escalating",
    missing_escalate_note: "Enter a reason before Escalate / Approve / Reject",
    forbidden_review: "Only the assigned reviewer or an approver can decide this subtask",
  };
  return `${th[code] || "บันทึกไม่สำเร็จ"} / ${en[code] || "Save failed"}`;
}

export function defaultStatusForHmoKind(kind: HmoKind): HmoStatus {
  return kind === "article" || kind === "seo_brief" ? "new" : "draft";
}

/** Pulls https / internal links out of free text for the "source links" list. */
export function hmoExtractLinks(...values: Array<string | undefined>) {
  const found: string[] = [];
  for (const value of values) {
    if (!value) continue;
    const matches = value.match(/https?:\/\/[^\s)"'<>]+|(?<![\w/])\/[a-z0-9][a-z0-9\-/_.]*/gi) || [];
    for (const match of matches) if (!found.includes(match)) found.push(match);
  }
  return found;
}

export function hmoRecordSourceLinks(row: Pick<HmoRecordRow, "payload">) {
  const p = row.payload;
  return hmoExtractLinks(p.notes, p.sourceNote, p.dataSource, p.source, p.href, p.landingPage, p.relatedServices, p.statusNote, ...p.relatedServiceHrefs);
}
