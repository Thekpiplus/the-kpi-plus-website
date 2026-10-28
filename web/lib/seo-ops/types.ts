export const SEO_DEPARTMENTS = ["marketing", "revenue", "distribution", "sales", "management"] as const;
export type SeoDepartment = (typeof SEO_DEPARTMENTS)[number];

export const SEO_WORKSTREAMS = ["visibility", "website", "gbp", "maps", "aeo", "reviews", "contact", "audit"] as const;
export type SeoWorkstream = (typeof SEO_WORKSTREAMS)[number];

export const SEO_STATUSES = [
  "draft",
  "audit_scheduled",
  "in_review",
  "action_planned",
  "in_progress",
  "waiting_hotel",
  "ready_approval",
  "published",
  "tracking",
  "completed",
  "archived",
] as const;
export type SeoStatus = (typeof SEO_STATUSES)[number];

export const SEO_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type SeoPriority = (typeof SEO_PRIORITIES)[number];

export const SEO_SECTIONS = [
  "visibility",
  "website",
  "gbp",
  "maps",
  "aeo",
  "reviews",
  "contact",
  "audit",
  "reports",
  "sources",
  "settings",
] as const;
export type SeoSection = (typeof SEO_SECTIONS)[number];

export const SEO_GROUP_BY = ["status", "owner", "department", "hotel", "market", "workstream"] as const;
export type SeoGroupBy = (typeof SEO_GROUP_BY)[number];

export const SEO_SORTS = ["nextActionAt", "priority", "updatedAt"] as const;
export type SeoSort = (typeof SEO_SORTS)[number];

export const SEO_FORM_TABS = ["overview", "subtasks", "gbp", "aeo", "contact", "sources", "reports", "history"] as const;
export type SeoFormTab = (typeof SEO_FORM_TABS)[number];

export const SEO_SUBTASK_STATUSES = ["not_started", "in_progress", "blocked", "completed"] as const;
export type SeoSubtaskStatus = (typeof SEO_SUBTASK_STATUSES)[number];

export const SEO_READINESS = ["not_started", "in_progress", "blocked", "ready_for_review", "completed"] as const;
export type SeoReadiness = (typeof SEO_READINESS)[number];

export const MAX_SEO_SUBTASKS = 10;

export const SEO_APPROVAL_STATUSES = ["not_requested", "awaiting", "approved", "changes_requested", "rejected"] as const;
export type SeoApprovalStatus = (typeof SEO_APPROVAL_STATUSES)[number];

export const SEO_FAQ_STATUSES = ["not_started", "draft", "in_review", "published"] as const;
export type SeoFaqStatus = (typeof SEO_FAQ_STATUSES)[number];

export const SEO_KPI_DATA_STATUSES = ["draft", "sample", "approved"] as const;
export type SeoKpiDataStatus = (typeof SEO_KPI_DATA_STATUSES)[number];

export const MASKED_VALUE = "••••";

export const SEO_DEPARTMENT_LABEL: Record<SeoDepartment, string> = {
  marketing: "Marketing",
  revenue: "Revenue",
  distribution: "Distribution",
  sales: "Sales",
  management: "Management",
};

export const SEO_WORKSTREAM_LABEL: Record<SeoWorkstream, string> = {
  visibility: "Search Visibility",
  website: "Website / SEO",
  gbp: "Google Business Profile",
  maps: "Maps / Local Listings",
  aeo: "AI Search / AEO",
  reviews: "Reviews and Questions",
  contact: "Contact / Booking Paths",
  audit: "Audit Actions",
};

export const SEO_SECTION_LABEL: Record<SeoSection, string> = {
  visibility: "Search Visibility",
  website: "Website / SEO",
  gbp: "Google Business Profile",
  maps: "Maps / Local Listings",
  aeo: "AI Search / AEO",
  reviews: "Reviews and Questions",
  contact: "Contact / Booking Paths",
  audit: "Audit Actions",
  reports: "Reports / KPI",
  sources: "Sources and Approvals",
  settings: "Settings",
};

export const SEO_STATUS_LABEL: Record<SeoStatus, string> = {
  draft: "Draft",
  audit_scheduled: "Audit Scheduled",
  in_review: "In Review",
  action_planned: "Action Planned",
  in_progress: "In Progress",
  waiting_hotel: "Waiting for Hotel",
  ready_approval: "Ready for Approval",
  published: "Published",
  tracking: "Tracking",
  completed: "Completed",
  archived: "Archived",
};

export const SEO_PRIORITY_LABEL: Record<SeoPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const SEO_GROUP_LABEL: Record<SeoGroupBy, string> = {
  status: "สถานะ",
  owner: "ผู้รับผิดชอบ",
  department: "แผนก",
  hotel: "โรงแรม",
  market: "ตลาด",
  workstream: "สายงาน",
};

export const SEO_SORT_LABEL: Record<SeoSort, string> = {
  nextActionAt: "Next action date",
  priority: "Priority",
  updatedAt: "Updated date",
};

export const SEO_FORM_TAB_LABEL: Record<SeoFormTab, string> = {
  overview: "ภาพรวม",
  subtasks: "ซับงาน",
  gbp: "Google Business Profile",
  aeo: "AI Search / AEO",
  contact: "Contact / Booking",
  sources: "แหล่งที่มา",
  reports: "KPI",
  history: "ประวัติ",
};

export const SEO_SUBTASK_STATUS_LABEL: Record<SeoSubtaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  completed: "Completed",
};

export const SEO_READINESS_LABEL: Record<SeoReadiness, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  ready_for_review: "Ready for review",
  completed: "Completed",
};

export const SEO_APPROVAL_LABEL: Record<SeoApprovalStatus, string> = {
  not_requested: "ยังไม่ขออนุมัติ",
  awaiting: "รออนุมัติ",
  approved: "อนุมัติแล้ว",
  changes_requested: "ขอแก้ไข",
  rejected: "ไม่อนุมัติ",
};

export const SEO_FAQ_STATUS_LABEL: Record<SeoFaqStatus, string> = {
  not_started: "ยังไม่เริ่ม",
  draft: "ฉบับร่าง",
  in_review: "กำลังตรวจ",
  published: "เผยแพร่แล้ว",
};

export const SEO_KPI_DATA_STATUS_LABEL: Record<SeoKpiDataStatus, string> = {
  draft: "Draft",
  sample: "Sample",
  approved: "Approved",
};

export const SEO_PRIORITY_RANK: Record<SeoPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const SEO_SECTION_WORKSTREAM: Partial<Record<SeoSection, SeoWorkstream>> = {
  website: "website",
  gbp: "gbp",
  maps: "maps",
  aeo: "aeo",
  reviews: "reviews",
  contact: "contact",
  audit: "audit",
};

export const SEO_DEPARTMENT_DUTIES: Record<SeoDepartment, string[]> = {
  marketing: ["Content structure", "Search/AEO messaging", "FAQ and landing page content", "Review response tone"],
  revenue: ["Price and offer consistency", "Booking path", "Revenue-related business outcomes", "Offer approval context"],
  distribution: ["Website/booking engine links", "Availability and channel consistency", "Local listing accuracy", "Direct booking path"],
  sales: ["Business information", "Contact paths", "Lead handling", "Hotel value proposition"],
  management: ["Approval", "Privacy/legal review", "Source review", "KPI and outcome review"],
};

export const SEO_STARTER_SUBTASKS: Array<{ department: SeoDepartment; name: string }> = [
  { department: "marketing", name: "Content structure, Search/AEO messaging, FAQ/landing content, and review response tone" },
  { department: "revenue", name: "Price/offer consistency, booking path, revenue outcomes, and offer approval context" },
  { department: "distribution", name: "Website/booking links, availability/channel consistency, local listing accuracy, and direct booking path" },
  { department: "sales", name: "Business information, contact paths, lead handling, and hotel value proposition" },
  { department: "management", name: "Approval, privacy/legal review, source review, and KPI/outcome review" },
];

export type SeoAccessView = {
  userId: string;
  departments: SeoDepartment[];
  canEditBoard: boolean;
  canManageSettings: boolean;
  canSeePrivateIds: boolean;
  isManagement: boolean;
};

export type SeoSourceView = {
  id: string;
  name: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  notes: string;
};

export type SeoAeoView = {
  id: string;
  query: string;
  intent: string;
  answerDraft: string;
  source: string;
  entityInfo: string;
  faqStatus: SeoFaqStatus;
  language: string;
  market: string;
  reviewStatus: SeoApprovalStatus;
  publishedStatus: SeoFaqStatus;
};

export type SeoKpiView = {
  id: string;
  name: string;
  period: string;
  value: string;
  definition: string;
  source: string;
  dataStatus: SeoKpiDataStatus;
  market: string;
};

export type SeoAuditView = {
  id: string;
  action: string;
  detail: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
};

export type SeoSubtaskCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type SeoSubtaskFileView = {
  id: string;
  filename: string;
  caption: string;
  size: number;
  createdAt: string;
  href: string;
};

export type SeoSubtaskView = {
  id: string;
  propertyId: string;
  name: string;
  department: SeoDepartment;
  ownerId: string;
  ownerName: string;
  status: SeoSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: SeoPriority;
  comments: string;
  source: string;
  thread: SeoSubtaskCommentView[];
  files: SeoSubtaskFileView[];
};

export type SeoSubtaskProgress = {
  total: number;
  completed: number;
  percent: number;
  readiness: SeoReadiness;
  countLabel: string;
};

export type SeoPropertyRow = {
  id: string;
  hotelName: string;
  businessName: string;
  website: string;
  gbpUrl: string;
  mapsUrl: string;
  searchMarket: string;
  language: string;
  location: string;
  primaryCategory: string;
  secondaryCategories: string;
  status: SeoStatus;
  ownerId: string;
  ownerName: string;
  department: SeoDepartment;
  workstream: SeoWorkstream;
  priority: SeoPriority;
  nextAction: string;
  nextActionAt: string;
  auditAt: string;
  updatedAt: string;
  notes: string;
  gscPropertyRef: string;
  googleAccountRef: string;
  privateMasked: boolean;
  contactPath: string;
  bookingUrl: string;
  reviewWorkflow: string;
  gbpName: string;
  gbpCategory: string;
  gbpAddress: string;
  gbpHours: string;
  gbpPhone: string;
  gbpWebsite: string;
  gbpPhotos: string;
  gbpServices: string;
  gbpReviewWorkflow: string;
  gbpContactLink: string;
  gbpApproval: SeoApprovalStatus;
  sources: SeoSourceView[];
  aeoQueries: SeoAeoView[];
  kpis: SeoKpiView[];
  history: SeoAuditView[];
  subtasks: SeoSubtaskView[];
  progress: SeoSubtaskProgress;
};

export type SeoListFilters = {
  q?: string;
  status?: string;
  ownerId?: string;
  department?: string;
  hotel?: string;
  market?: string;
  workstream?: string;
  group?: string;
  sort?: string;
  view?: string;
};

export function isDepartment(value: string): value is SeoDepartment {
  return SEO_DEPARTMENTS.includes(value as SeoDepartment);
}

export function isWorkstream(value: string): value is SeoWorkstream {
  return SEO_WORKSTREAMS.includes(value as SeoWorkstream);
}

export function isSeoStatus(value: string): value is SeoStatus {
  return SEO_STATUSES.includes(value as SeoStatus);
}

export function isPriority(value: string): value is SeoPriority {
  return SEO_PRIORITIES.includes(value as SeoPriority);
}

export function isSeoSection(value: string): value is SeoSection {
  return SEO_SECTIONS.includes(value as SeoSection);
}

export function isGroupBy(value: string): value is SeoGroupBy {
  return SEO_GROUP_BY.includes(value as SeoGroupBy);
}

export function isSort(value: string): value is SeoSort {
  return SEO_SORTS.includes(value as SeoSort);
}

export function isApprovalStatus(value: string): value is SeoApprovalStatus {
  return SEO_APPROVAL_STATUSES.includes(value as SeoApprovalStatus);
}

export function isFaqStatus(value: string): value is SeoFaqStatus {
  return SEO_FAQ_STATUSES.includes(value as SeoFaqStatus);
}

export function isKpiDataStatus(value: string): value is SeoKpiDataStatus {
  return SEO_KPI_DATA_STATUSES.includes(value as SeoKpiDataStatus);
}

export function normalizeStatus(value: string): SeoStatus {
  if (isSeoStatus(value)) return value;
  if (value === "audit") return "audit_scheduled";
  if (value === "fixing") return "in_progress";
  if (value === "awaiting_review") return "in_review";
  if (value === "live") return "published";
  if (value === "paused") return "tracking";
  return "draft";
}

export function normalizeWorkstream(value: string): SeoWorkstream {
  if (isWorkstream(value)) return value;
  if (value === "search_console") return "website";
  if (value === "content") return "aeo";
  return "visibility";
}

export function seoSectionPath(section: SeoSection) {
  return section === "visibility" ? "/crm/seo" : `/crm/seo/${section}`;
}

export function isSubtaskStatus(value: string): value is SeoSubtaskStatus {
  return SEO_SUBTASK_STATUSES.includes(value as SeoSubtaskStatus);
}

export function normalizeSubtaskStatus(value: string): SeoSubtaskStatus {
  if (value === "done" || value === "complete") return "completed";
  return isSubtaskStatus(value) ? value : "not_started";
}

export function seoSectionFormTab(section: SeoSection): SeoFormTab {
  if (section === "gbp") return "gbp";
  if (section === "aeo") return "aeo";
  if (section === "contact") return "contact";
  if (section === "sources") return "sources";
  if (section === "reports") return "reports";
  if (section === "audit") return "subtasks";
  return "overview";
}

export function seoErrorMessage(code: string) {
  const table: Record<string, string> = {
    missing: "ไม่พบรายการ",
    required: "กรอกชื่อโรงแรมหรือธุรกิจ",
    forbidden: "ไม่มีสิทธิ์แก้ไขบอร์ดนี้",
    invalid: "ข้อมูลไม่ถูกต้อง",
    missing_name: "กรอกชื่อซับงาน",
    missing_comment: "กรอกความเห็น",
    missing_file: "เลือกไฟล์ก่อนแนบ",
    invalid_file: "ไฟล์ไม่รองรับหรือใหญ่เกิน 5MB",
    subtask_limit: "ซับงานได้สูงสุด 10 รายการ",
  };
  return table[code] || code || "บันทึกไม่สำเร็จ";
}
