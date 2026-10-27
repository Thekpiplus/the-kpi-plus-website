export const META_DEPARTMENTS = ["marketing", "revenue", "distribution", "sales", "management"] as const;
export type MetaDepartment = (typeof META_DEPARTMENTS)[number];

export const META_CHANNELS = ["awareness", "consideration", "lead", "direct_booking", "remarketing", "other"] as const;
export type MetaChannel = (typeof META_CHANNELS)[number];

export const META_STATUSES = [
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
export type MetaStatus = (typeof META_STATUSES)[number];

export const META_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type MetaPriority = (typeof META_PRIORITIES)[number];

export const META_BUDGET_PERIODS = ["daily", "monthly", "campaign", "quarterly"] as const;
export type MetaBudgetPeriod = (typeof META_BUDGET_PERIODS)[number];

export const META_TRACKING_STATUSES = ["not_set", "pending", "installed", "verified", "blocked"] as const;
export type MetaTrackingStatus = (typeof META_TRACKING_STATUSES)[number];

export const META_APPROVAL_STATUSES = ["not_requested", "awaiting", "approved", "changes_requested", "rejected"] as const;
export type MetaApprovalStatus = (typeof META_APPROVAL_STATUSES)[number];

export const META_ACTIVITY_TYPES = ["brief", "tracking", "optimisation", "report", "handoff", "approval", "note"] as const;
export type MetaActivityType = (typeof META_ACTIVITY_TYPES)[number];

export const META_ACTIVITY_STATUSES = ["planned", "in_progress", "completed", "cancelled"] as const;
export type MetaActivityStatus = (typeof META_ACTIVITY_STATUSES)[number];

export const META_KPI_DATA_STATUSES = ["draft", "sample", "approved"] as const;
export type MetaKpiDataStatus = (typeof META_KPI_DATA_STATUSES)[number];

export const META_NOTE_KINDS = ["note", "file"] as const;
export type MetaNoteKind = (typeof META_NOTE_KINDS)[number];

export const META_GROUP_BY = ["status", "owner", "department", "hotel", "market", "objective", "channel"] as const;
export type MetaGroupBy = (typeof META_GROUP_BY)[number];

export const META_SORTS = ["startAt", "endAt", "budget", "priority", "nextActionAt", "updatedAt"] as const;
export type MetaSort = (typeof META_SORTS)[number];

export const META_SECTIONS = [
  "campaigns",
  "audiences",
  "creative-matrix",
  "ads",
  "landing-pages",
  "tracking",
  "remarketing",
  "optimization",
  "reports",
  "approvals",
  "settings",
] as const;
export type MetaSection = (typeof META_SECTIONS)[number];

export const META_FORM_TABS = [
  "overview",
  "audience",
  "creative",
  "landing",
  "budget",
  "tracking",
  "remarketing",
  "optimization",
  "reports",
  "files",
  "audit",
] as const;
export type MetaFormTab = (typeof META_FORM_TABS)[number];

export const META_SUBTASK_STATUSES = ["not_started", "in_progress", "blocked", "completed"] as const;
export type MetaSubtaskStatus = (typeof META_SUBTASK_STATUSES)[number];

export const ADS_READINESS = ["not_started", "in_progress", "blocked", "ready_for_review", "completed"] as const;
export type AdsReadiness = (typeof ADS_READINESS)[number];

export const MAX_META_SUBTASKS = 10;

export const ADS_DEPARTMENT_DUTIES: Record<MetaDepartment, string[]> = {
  marketing: ["Campaign objective", "Audience", "Creative hook and format", "Ad copy", "Remarketing logic"],
  revenue: ["Budget", "Offer and promotion", "Rate context", "Booking value interpretation", "ROAS target"],
  distribution: ["Rate and availability feed", "Booking engine connection", "Channel consistency", "Direct booking path"],
  sales: ["Landing page content", "Hotel value proposition", "Market/segment context", "Lead follow-up"],
  management: ["Approval", "Budget authorization", "KPI review", "Final decision"],
};

export const ADS_STARTER_SUBTASKS: Array<{ department: MetaDepartment; name: string }> = [
  { department: "marketing", name: "Campaign objective, audience, creative, ad copy, and remarketing logic" },
  { department: "revenue", name: "Budget, offer, rate context, booking value, and ROAS target" },
  { department: "distribution", name: "Rate feed, booking engine, channel consistency, and direct booking path" },
  { department: "sales", name: "Landing page, hotel value, market/segment context, and lead follow-up" },
  { department: "management", name: "Approval, budget authorization, KPI review, and final decision" },
];

export const ADS_DEPARTMENT_LABEL: Record<MetaDepartment, string> = {
  marketing: "Marketing",
  revenue: "Revenue",
  distribution: "Distribution",
  sales: "Sales",
  management: "Management",
};

export const META_SCENARIO_LABEL: Record<MetaChannel, string> = {
  awareness: "Awareness",
  consideration: "Consideration",
  lead: "Lead",
  direct_booking: "Direct Booking",
  remarketing: "Remarketing",
  other: "Other",
};

export const ADS_STATUS_LABEL: Record<MetaStatus, string> = {
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

export const ADS_PRIORITY_LABEL: Record<MetaPriority, string> = {
  low: "ต่ำ",
  normal: "ปกติ",
  high: "สูง",
  urgent: "ด่วน",
};

export const ADS_BUDGET_PERIOD_LABEL: Record<MetaBudgetPeriod, string> = {
  daily: "Daily",
  monthly: "Monthly",
  campaign: "Campaign",
  quarterly: "Quarterly",
};

export const META_TRACKING_STATUS_LABEL: Record<MetaTrackingStatus, string> = {
  not_set: "Not set",
  pending: "Pending",
  installed: "Installed",
  verified: "Verified",
  blocked: "Blocked",
};

export const ADS_APPROVAL_STATUS_LABEL: Record<MetaApprovalStatus, string> = {
  not_requested: "Not requested",
  awaiting: "Awaiting approval",
  approved: "Approved",
  changes_requested: "Changes requested",
  rejected: "Rejected",
};

export const ADS_ACTIVITY_TYPE_LABEL: Record<MetaActivityType, string> = {
  brief: "Brief",
  tracking: "Tracking",
  optimisation: "Optimization",
  report: "Reporting",
  handoff: "Handoff",
  approval: "Approval",
  note: "Note",
};

export const ADS_ACTIVITY_STATUS_LABEL: Record<MetaActivityStatus, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const META_KPI_DATA_STATUS_LABEL: Record<MetaKpiDataStatus, string> = {
  draft: "Draft",
  sample: "Sample data",
  approved: "Approved",
};

export const ADS_GROUP_LABEL: Record<MetaGroupBy, string> = {
  status: "Status",
  owner: "Owner",
  department: "Department",
  hotel: "Hotel",
  market: "Market",
  objective: "Objective",
  channel: "Campaign type",
};

export const ADS_SORT_LABEL: Record<MetaSort, string> = {
  startAt: "Start date",
  endAt: "End date",
  budget: "Budget",
  priority: "Priority",
  nextActionAt: "Next action",
  updatedAt: "Updated",
};

export const META_SECTION_LABEL: Record<MetaSection, string> = {
  campaigns: "Campaigns",
  audiences: "Audiences",
  "creative-matrix": "Creative Matrix",
  ads: "Meta Ads",
  "landing-pages": "Landing Pages",
  tracking: "Tracking & Conversions",
  remarketing: "Remarketing",
  optimization: "Optimization Log",
  reports: "Reports / KPI",
  approvals: "Approvals",
  settings: "Settings",
};

export const ADS_FORM_TAB_LABEL: Record<MetaFormTab, string> = {
  overview: "Overview",
  audience: "Objective and Audience",
  creative: "Creative Matrix",
  landing: "Landing Page",
  budget: "Budget and Approval",
  tracking: "Tracking and Conversions",
  remarketing: "Remarketing",
  optimization: "Optimization Log",
  reports: "Reports / KPI",
  files: "Files and Notes",
  audit: "Audit History",
};

export const ADS_SUBTASK_STATUS_LABEL: Record<MetaSubtaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  completed: "Completed",
};

export const META_READINESS_LABEL: Record<AdsReadiness, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  ready_for_review: "Ready for review",
  completed: "Completed",
};

export const ADS_PRIORITY_RANK: Record<MetaPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const MASKED_VALUE = "••••";

const LEGACY_STATUS: Record<string, MetaStatus> = {
  intake: "draft",
  readiness: "planning",
  review: "awaiting_approval",
  live: "active",
  closed: "ended",
};

const LEGACY_CHANNEL: Record<string, MetaChannel> = {
  mixed: "other",
  traffic: "consideration",
  leads: "lead",
  conversion: "direct_booking",
};

export type AdsSaveResult = { ok: true; id: string } | { ok: false; error: string };

export type MetaAccessView = {
  userId: string;
  departments: MetaDepartment[];
  canSeeAccounts: boolean;
  canSeeBudget: boolean;
  canSeeAudience: boolean;
  canEditBoard: boolean;
  canEditActivities: boolean;
  canManageSettings: boolean;
  isManagement: boolean;
};

export type MetaActivityView = {
  id: string;
  campaignId: string;
  type: MetaActivityType;
  title: string;
  dueAt: string;
  status: MetaActivityStatus;
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
  dataStatus: MetaKpiDataStatus;
  notes: string;
  createdAt: string;
};

export type MetaNoteView = {
  id: string;
  campaignId: string;
  kind: MetaNoteKind;
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

export type MetaSubtaskCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type MetaSubtaskFileView = {
  id: string;
  filename: string;
  caption: string;
  size: number;
  createdAt: string;
  href: string;
};

export type MetaSubtaskView = {
  id: string;
  campaignId: string;
  name: string;
  department: MetaDepartment;
  ownerId: string;
  ownerName: string;
  status: MetaSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: MetaPriority;
  comments: string;
  thread: MetaSubtaskCommentView[];
  files: MetaSubtaskFileView[];
};

export type AdsProgressView = {
  total: number;
  completed: number;
  percent: number;
  readiness: AdsReadiness;
  countLabel: string;
};

export type MetaCampaignListItem = {
  id: string;
  name: string;
  hotelName: string;
  channel: MetaChannel;
  objective: string;
  market: string;
  language: string;
  startAt: string;
  endAt: string;
  budgetAmount: string;
  budgetPeriod: MetaBudgetPeriod;
  status: MetaStatus;
  ownerId: string;
  ownerName: string;
  department: MetaDepartment;
  priority: MetaPriority;
  nextAction: string;
  nextActionAt: string;
  landingUrl: string;
  bookingUrl: string;
  trackingStatus: MetaTrackingStatus;
  primaryKpi: string;
  kpiTarget: string;
  approvalStatus: MetaApprovalStatus;
  notes: string;
  audienceSegment: string;
  creativeMatrixRef: string;
  remarketingNotes: string;
  pixelRef: string;
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
  audienceMasked: boolean;
  pixelMasked: boolean;
  escalatedAt: string;
  closedAt: string;
  createdAt: string;
  updatedAt: string;
  progress: AdsProgressView;
  subtasks: MetaSubtaskView[];
  activities: MetaActivityView[];
  kpis: AdsKpiView[];
  files: MetaNoteView[];
  audit: AdsAuditView[];
};

export type MetaAccessRow = {
  id: string;
  userId: string;
  department: string;
  canSeeAccounts: boolean;
  canSeeBudget: boolean;
};

export function isDepartment(value: string): value is MetaDepartment {
  return (META_DEPARTMENTS as readonly string[]).includes(value);
}

export function isChannel(value: string): value is MetaChannel {
  return (META_CHANNELS as readonly string[]).includes(value);
}

export function isStatus(value: string): value is MetaStatus {
  return (META_STATUSES as readonly string[]).includes(value);
}

export function isPriority(value: string): value is MetaPriority {
  return (META_PRIORITIES as readonly string[]).includes(value);
}

export function isBudgetPeriod(value: string): value is MetaBudgetPeriod {
  return (META_BUDGET_PERIODS as readonly string[]).includes(value);
}

export function isTrackingStatus(value: string): value is MetaTrackingStatus {
  return (META_TRACKING_STATUSES as readonly string[]).includes(value);
}

export function isApprovalStatus(value: string): value is MetaApprovalStatus {
  return (META_APPROVAL_STATUSES as readonly string[]).includes(value);
}

export function isActivityType(value: string): value is MetaActivityType {
  return (META_ACTIVITY_TYPES as readonly string[]).includes(value);
}

export function isActivityStatus(value: string): value is MetaActivityStatus {
  return (META_ACTIVITY_STATUSES as readonly string[]).includes(value);
}

export function isKpiDataStatus(value: string): value is MetaKpiDataStatus {
  return (META_KPI_DATA_STATUSES as readonly string[]).includes(value);
}

export function isNoteKind(value: string): value is MetaNoteKind {
  return (META_NOTE_KINDS as readonly string[]).includes(value);
}

export function isGroupBy(value: string): value is MetaGroupBy {
  return (META_GROUP_BY as readonly string[]).includes(value);
}

export function isSort(value: string): value is MetaSort {
  return (META_SORTS as readonly string[]).includes(value);
}

export function isSection(value: string): value is MetaSection {
  return (META_SECTIONS as readonly string[]).includes(value);
}

export function isFormTab(value: string): value is MetaFormTab {
  return (META_FORM_TABS as readonly string[]).includes(value);
}

export function isSubtaskStatus(value: string): value is MetaSubtaskStatus {
  return (META_SUBTASK_STATUSES as readonly string[]).includes(value);
}

export function isReadiness(value: string): value is AdsReadiness {
  return (ADS_READINESS as readonly string[]).includes(value);
}

export function normalizeSubtaskStatus(value: string): MetaSubtaskStatus {
  if (value === "planned" || value === "open") return "not_started";
  if (value === "done") return "completed";
  return isSubtaskStatus(value) ? value : "not_started";
}

export function normalizeChannel(value: string): MetaChannel {
  const mapped = LEGACY_CHANNEL[value] || value;
  return isChannel(mapped) ? mapped : "awareness";
}

export function normalizeStatus(value: string): MetaStatus {
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

export function metaSectionPath(section: MetaSection) {
  if (section === "campaigns") return "/crm/meta";
  if (section === "ads") return "/crm/meta/ads";
  if (section === "settings") return "/crm/meta/settings";
  return `/crm/meta/${section}`;
}

export function metaSectionChannel(section: MetaSection): MetaChannel | "" {
  if (section === "remarketing") return "remarketing";
  return "";
}

export function metaSectionFormTab(section: MetaSection): MetaFormTab {
  if (section === "audiences") return "audience";
  if (section === "creative-matrix") return "creative";
  if (section === "landing-pages") return "landing";
  if (section === "tracking") return "tracking";
  if (section === "remarketing") return "remarketing";
  if (section === "optimization") return "optimization";
  if (section === "reports") return "reports";
  if (section === "approvals") return "budget";
  return "overview";
}
