export const ADS_DEPARTMENTS = ["marketing", "revenue", "distribution", "sales", "management"] as const;
export type AdsDepartment = (typeof ADS_DEPARTMENTS)[number];

export const ADS_CHANNELS = ["search_ads", "hotel_ads", "free_links", "other"] as const;
export type AdsChannel = (typeof ADS_CHANNELS)[number];

export const ADS_STATUSES = [
  "draft",
  "planning",
  "awaiting_approval",
  "ready_to_launch",
  "active",
  "optimizing",
  "paused",
  "ended",
  "archived",
] as const;
export type AdsStatus = (typeof ADS_STATUSES)[number];

export const ADS_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type AdsPriority = (typeof ADS_PRIORITIES)[number];

export const ADS_BUDGET_PERIODS = ["daily", "monthly", "campaign", "quarterly"] as const;
export type AdsBudgetPeriod = (typeof ADS_BUDGET_PERIODS)[number];

export const ADS_TRACKING_STATUSES = ["not_set", "pending", "installed", "verified", "blocked"] as const;
export type AdsTrackingStatus = (typeof ADS_TRACKING_STATUSES)[number];

export const ADS_APPROVAL_STATUSES = ["not_requested", "awaiting", "approved", "changes_requested", "rejected"] as const;
export type AdsApprovalStatus = (typeof ADS_APPROVAL_STATUSES)[number];

export const ADS_ACTIVITY_TYPES = ["brief", "tracking", "optimisation", "report", "handoff", "approval", "note"] as const;
export type AdsActivityType = (typeof ADS_ACTIVITY_TYPES)[number];

export const ADS_ACTIVITY_STATUSES = ["planned", "in_progress", "completed", "cancelled"] as const;
export type AdsActivityStatus = (typeof ADS_ACTIVITY_STATUSES)[number];

export const ADS_KPI_DATA_STATUSES = ["draft", "sample", "approved"] as const;
export type AdsKpiDataStatus = (typeof ADS_KPI_DATA_STATUSES)[number];

export const ADS_NOTE_KINDS = ["note", "file"] as const;
export type AdsNoteKind = (typeof ADS_NOTE_KINDS)[number];

export const ADS_GROUP_BY = ["status", "owner", "department", "hotel", "market", "channel"] as const;
export type AdsGroupBy = (typeof ADS_GROUP_BY)[number];

export const ADS_SORTS = ["startAt", "endAt", "budget", "priority", "nextActionAt", "updatedAt"] as const;
export type AdsSort = (typeof ADS_SORTS)[number];

export const ADS_SECTIONS = [
  "campaigns",
  "search",
  "hotel",
  "free-links",
  "landing-pages",
  "tracking",
  "optimization",
  "reports",
  "approvals",
  "settings",
] as const;
export type AdsSection = (typeof ADS_SECTIONS)[number];

export const ADS_FORM_TABS = [
  "overview",
  "audience",
  "creative",
  "landing",
  "budget",
  "tracking",
  "optimization",
  "reports",
  "subtasks",
  "files",
  "audit",
] as const;
export type AdsFormTab = (typeof ADS_FORM_TABS)[number];

export const ADS_SUBTASK_STATUSES = ["not_started", "in_progress", "blocked", "completed"] as const;
export type AdsSubtaskStatus = (typeof ADS_SUBTASK_STATUSES)[number];

export const ADS_READINESS = ["not_started", "in_progress", "blocked", "ready_for_review", "completed"] as const;
export type AdsReadiness = (typeof ADS_READINESS)[number];

export const MAX_ADS_SUBTASKS = 10;

export const ADS_DEPARTMENT_DUTIES: Record<AdsDepartment, string[]> = {
  marketing: ["Search intent", "Ad copy", "Audience", "Campaign messaging", "Creative notes"],
  revenue: ["Budget", "Offer and promotion", "Rate context", "ROAS target", "Booking value interpretation"],
  distribution: ["Rate and availability feed", "Hotel Ads data quality", "Channel consistency", "Booking engine connection"],
  sales: ["Landing page content", "Hotel value proposition", "Market and partner context", "Lead follow-up"],
  management: ["Approval", "Budget authorization", "KPI review", "Final decision"],
};

export const ADS_STARTER_SUBTASKS: Array<{ department: AdsDepartment; name: string }> = [
  { department: "marketing", name: "Search intent, ad copy, and audience" },
  { department: "revenue", name: "Budget, offer, and ROAS target" },
  { department: "distribution", name: "Rate feed and booking engine connection" },
  { department: "sales", name: "Landing page and hotel value proposition" },
  { department: "management", name: "Approval and KPI review" },
];

export const ADS_DEPARTMENT_LABEL: Record<AdsDepartment, string> = {
  marketing: "Marketing",
  revenue: "Revenue",
  distribution: "Distribution",
  sales: "Sales",
  management: "Management",
};

export const ADS_CHANNEL_LABEL: Record<AdsChannel, string> = {
  search_ads: "Search Ads",
  hotel_ads: "Hotel Ads",
  free_links: "Free Booking Links",
  other: "Other",
};

export const ADS_STATUS_LABEL: Record<AdsStatus, string> = {
  draft: "Draft",
  planning: "Planning",
  awaiting_approval: "Awaiting Approval",
  ready_to_launch: "Ready to Launch",
  active: "Active",
  optimizing: "Optimizing",
  paused: "Paused",
  ended: "Ended",
  archived: "Archived",
};

export const ADS_PRIORITY_LABEL: Record<AdsPriority, string> = {
  low: "ต่ำ",
  normal: "ปกติ",
  high: "สูง",
  urgent: "ด่วน",
};

export const ADS_BUDGET_PERIOD_LABEL: Record<AdsBudgetPeriod, string> = {
  daily: "Daily",
  monthly: "Monthly",
  campaign: "Campaign",
  quarterly: "Quarterly",
};

export const ADS_TRACKING_STATUS_LABEL: Record<AdsTrackingStatus, string> = {
  not_set: "Not set",
  pending: "Pending",
  installed: "Installed",
  verified: "Verified",
  blocked: "Blocked",
};

export const ADS_APPROVAL_STATUS_LABEL: Record<AdsApprovalStatus, string> = {
  not_requested: "Not requested",
  awaiting: "Awaiting approval",
  approved: "Approved",
  changes_requested: "Changes requested",
  rejected: "Rejected",
};

export const ADS_ACTIVITY_TYPE_LABEL: Record<AdsActivityType, string> = {
  brief: "Brief",
  tracking: "Tracking",
  optimisation: "Optimization",
  report: "Reporting",
  handoff: "Handoff",
  approval: "Approval",
  note: "Note",
};

export const ADS_ACTIVITY_STATUS_LABEL: Record<AdsActivityStatus, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const ADS_KPI_DATA_STATUS_LABEL: Record<AdsKpiDataStatus, string> = {
  draft: "Draft",
  sample: "Sample data",
  approved: "Approved",
};

export const ADS_GROUP_LABEL: Record<AdsGroupBy, string> = {
  status: "Status",
  owner: "Owner",
  department: "Department",
  hotel: "Hotel",
  market: "Market",
  channel: "Campaign type",
};

export const ADS_SORT_LABEL: Record<AdsSort, string> = {
  startAt: "Start date",
  endAt: "End date",
  budget: "Budget",
  priority: "Priority",
  nextActionAt: "Next action",
  updatedAt: "Updated",
};

export const ADS_SECTION_LABEL: Record<AdsSection, string> = {
  campaigns: "Campaigns",
  search: "Search Ads",
  hotel: "Hotel Ads",
  "free-links": "Free Booking Links",
  "landing-pages": "Landing Pages",
  tracking: "Tracking & Conversions",
  optimization: "Optimization Log",
  reports: "Reports / KPI",
  approvals: "Approvals",
  settings: "Settings",
};

export const ADS_FORM_TAB_LABEL: Record<AdsFormTab, string> = {
  overview: "Overview",
  audience: "Audience / Search Intent",
  creative: "Ads and Creative",
  landing: "Landing Page",
  budget: "Budget and Approval",
  tracking: "Tracking and Conversions",
  optimization: "Optimization Log",
  reports: "Reports / KPI",
  subtasks: "Subtasks",
  files: "Files and Notes",
  audit: "Audit History",
};

export const ADS_SUBTASK_STATUS_LABEL: Record<AdsSubtaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  completed: "Completed",
};

export const ADS_READINESS_LABEL: Record<AdsReadiness, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  ready_for_review: "Ready for review",
  completed: "Completed",
};

export const ADS_PRIORITY_RANK: Record<AdsPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const MASKED_VALUE = "••••";

const LEGACY_STATUS: Record<string, AdsStatus> = {
  intake: "draft",
  readiness: "planning",
  review: "awaiting_approval",
  live: "active",
  closed: "ended",
};

const LEGACY_CHANNEL: Record<string, AdsChannel> = {
  mixed: "other",
};

export type AdsSaveResult = { ok: true; id: string } | { ok: false; error: string };

export type AdsAccessView = {
  userId: string;
  departments: AdsDepartment[];
  canSeeAccounts: boolean;
  canSeeBudget: boolean;
  canEditBoard: boolean;
  canEditActivities: boolean;
  canManageSettings: boolean;
  isManagement: boolean;
};

export type AdsActivityView = {
  id: string;
  campaignId: string;
  type: AdsActivityType;
  title: string;
  dueAt: string;
  status: AdsActivityStatus;
  notes: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
};

export type AdsKpiView = {
  id: string;
  campaignId: string;
  period: string;
  metric: string;
  value: string;
  target: string;
  dataStatus: AdsKpiDataStatus;
  notes: string;
  createdAt: string;
};

export type AdsNoteView = {
  id: string;
  campaignId: string;
  kind: AdsNoteKind;
  title: string;
  body: string;
  url: string;
  createdAt: string;
  createdByName: string;
};

export type AdsAuditView = {
  id: string;
  action: string;
  detail: string;
  createdAt: string;
  createdByName: string;
};

export type AdsSubtaskCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type AdsSubtaskFileView = {
  id: string;
  filename: string;
  caption: string;
  size: number;
  createdAt: string;
  href: string;
};

export type AdsSubtaskView = {
  id: string;
  campaignId: string;
  name: string;
  department: AdsDepartment;
  ownerId: string;
  ownerName: string;
  status: AdsSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: AdsPriority;
  comments: string;
  thread: AdsSubtaskCommentView[];
  files: AdsSubtaskFileView[];
};

export type AdsProgressView = {
  total: number;
  completed: number;
  percent: number;
  readiness: AdsReadiness;
  countLabel: string;
};

export type AdsCampaignListItem = {
  id: string;
  name: string;
  hotelName: string;
  channel: AdsChannel;
  objective: string;
  market: string;
  language: string;
  startAt: string;
  endAt: string;
  budgetAmount: string;
  budgetPeriod: AdsBudgetPeriod;
  status: AdsStatus;
  ownerId: string;
  ownerName: string;
  department: AdsDepartment;
  priority: AdsPriority;
  nextAction: string;
  nextActionAt: string;
  landingUrl: string;
  bookingUrl: string;
  trackingStatus: AdsTrackingStatus;
  primaryKpi: string;
  kpiTarget: string;
  approvalStatus: AdsApprovalStatus;
  notes: string;
  audienceIntent: string;
  adsCreative: string;
  landingNotes: string;
  trackingNotes: string;
  reportNotes: string;
  searchIntent: string;
  adCopy: string;
  audience: string;
  campaignMessaging: string;
  creativeNotes: string;
  offerPromotion: string;
  rateContext: string;
  roasTarget: string;
  bookingValueNotes: string;
  rateFeed: string;
  hotelAdsQuality: string;
  channelConsistency: string;
  bookingEngineNotes: string;
  landingContent: string;
  hotelValueProp: string;
  marketPartnerContext: string;
  leadFollowUp: string;
  budgetAuth: string;
  kpiReview: string;
  finalDecision: string;
  accountRef: string;
  budgetNote: string;
  accountMasked: boolean;
  budgetMasked: boolean;
  escalatedAt: string;
  closedAt: string;
  createdAt: string;
  updatedAt: string;
  progress: AdsProgressView;
  subtasks: AdsSubtaskView[];
  activities: AdsActivityView[];
  kpis: AdsKpiView[];
  files: AdsNoteView[];
  audit: AdsAuditView[];
};

export type AdsAccessRow = {
  id: string;
  userId: string;
  department: string;
  canSeeAccounts: boolean;
  canSeeBudget: boolean;
};

export function isDepartment(value: string): value is AdsDepartment {
  return (ADS_DEPARTMENTS as readonly string[]).includes(value);
}

export function isChannel(value: string): value is AdsChannel {
  return (ADS_CHANNELS as readonly string[]).includes(value);
}

export function isStatus(value: string): value is AdsStatus {
  return (ADS_STATUSES as readonly string[]).includes(value);
}

export function isPriority(value: string): value is AdsPriority {
  return (ADS_PRIORITIES as readonly string[]).includes(value);
}

export function isBudgetPeriod(value: string): value is AdsBudgetPeriod {
  return (ADS_BUDGET_PERIODS as readonly string[]).includes(value);
}

export function isTrackingStatus(value: string): value is AdsTrackingStatus {
  return (ADS_TRACKING_STATUSES as readonly string[]).includes(value);
}

export function isApprovalStatus(value: string): value is AdsApprovalStatus {
  return (ADS_APPROVAL_STATUSES as readonly string[]).includes(value);
}

export function isActivityType(value: string): value is AdsActivityType {
  return (ADS_ACTIVITY_TYPES as readonly string[]).includes(value);
}

export function isActivityStatus(value: string): value is AdsActivityStatus {
  return (ADS_ACTIVITY_STATUSES as readonly string[]).includes(value);
}

export function isKpiDataStatus(value: string): value is AdsKpiDataStatus {
  return (ADS_KPI_DATA_STATUSES as readonly string[]).includes(value);
}

export function isNoteKind(value: string): value is AdsNoteKind {
  return (ADS_NOTE_KINDS as readonly string[]).includes(value);
}

export function isGroupBy(value: string): value is AdsGroupBy {
  return (ADS_GROUP_BY as readonly string[]).includes(value);
}

export function isSort(value: string): value is AdsSort {
  return (ADS_SORTS as readonly string[]).includes(value);
}

export function isSection(value: string): value is AdsSection {
  return (ADS_SECTIONS as readonly string[]).includes(value);
}

export function isFormTab(value: string): value is AdsFormTab {
  return (ADS_FORM_TABS as readonly string[]).includes(value);
}

export function isSubtaskStatus(value: string): value is AdsSubtaskStatus {
  return (ADS_SUBTASK_STATUSES as readonly string[]).includes(value);
}

export function isReadiness(value: string): value is AdsReadiness {
  return (ADS_READINESS as readonly string[]).includes(value);
}

export function normalizeSubtaskStatus(value: string): AdsSubtaskStatus {
  if (value === "planned" || value === "open") return "not_started";
  if (value === "done") return "completed";
  return isSubtaskStatus(value) ? value : "not_started";
}

export function normalizeChannel(value: string): AdsChannel {
  const mapped = LEGACY_CHANNEL[value] || value;
  return isChannel(mapped) ? mapped : "search_ads";
}

export function normalizeStatus(value: string): AdsStatus {
  const mapped = LEGACY_STATUS[value] || value;
  return isStatus(mapped) ? mapped : "draft";
}

export function adsErrorMessage(code: string) {
  const table: Record<string, string> = {
    missing_hotel: "กรอกชื่อโรงแรมหรือชื่อแคมเปญก่อนบันทึก",
    missing_title: "กรอกหัวข้อก่อนบันทึก",
    missing_name: "กรอกชื่อซับงานก่อนบันทึก",
    missing_comment: "กรอกความเห็นก่อนบันทึก",
    missing_file: "เลือกไฟล์ก่อนแนบ",
    invalid_file: "ไฟล์ไม่รองรับหรือใหญ่เกิน 5 MB",
    subtask_limit: "แต่ละแคมเปญมีซับงานได้ไม่เกิน 10 รายการ",
    invalid: "ข้อมูลไม่ถูกต้อง",
    missing: "ไม่พบรายการ",
    forbidden: "บัญชีนี้ไม่มีสิทธิ์แก้ไขส่วนนี้",
    invalid_url: "ใส่ URL ให้ขึ้นต้นด้วย / หรือ http(s)",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export function adsSectionPath(section: AdsSection) {
  if (section === "campaigns") return "/crm/ads";
  if (section === "settings") return "/crm/ads/settings";
  return `/crm/ads/${section}`;
}

export function adsSectionChannel(section: AdsSection): AdsChannel | "" {
  if (section === "search") return "search_ads";
  if (section === "hotel") return "hotel_ads";
  if (section === "free-links") return "free_links";
  return "";
}
