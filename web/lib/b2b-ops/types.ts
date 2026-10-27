export const B2B_DEPARTMENTS = ["sales", "revenue", "distribution", "marketing", "management"] as const;
export type B2bDepartment = (typeof B2B_DEPARTMENTS)[number];

export const B2B_PARTNER_TYPES = ["travel_agent", "corporate", "wholesale", "dmc", "other"] as const;
export type B2bPartnerType = (typeof B2B_PARTNER_TYPES)[number];

export const B2B_STATUSES = [
  "new_lead",
  "qualification",
  "contacted",
  "negotiation",
  "rate_ready",
  "contract_ready",
  "active",
  "dormant",
  "closed",
] as const;
export type B2bStatus = (typeof B2B_STATUSES)[number];

export const B2B_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type B2bPriority = (typeof B2B_PRIORITIES)[number];

export const B2B_RATE_STATUSES = ["draft", "pending", "approved", "rejected"] as const;
export type B2bRateStatus = (typeof B2B_RATE_STATUSES)[number];

export const B2B_ACTIVITY_TYPES = ["call", "email", "meeting", "proposal", "follow_up", "booking_review"] as const;
export type B2bActivityType = (typeof B2B_ACTIVITY_TYPES)[number];

export const B2B_CORE_ACTIVITY_STATUSES = ["planned", "in_progress", "completed", "cancelled"] as const;
export const B2B_ACTIVITY_STATUSES = [...B2B_CORE_ACTIVITY_STATUSES, "closed", "escalated"] as const;
export type B2bActivityStatus = (typeof B2B_ACTIVITY_STATUSES)[number];

export const B2B_SUBTASK_STATUSES = ["planned", "in_progress", "completed", "cancelled"] as const;
export type B2bSubtaskStatus = (typeof B2B_SUBTASK_STATUSES)[number];

export const MAX_B2B_SUBTASKS = 10;
export const B2B_OPEN_ACTIVITY_STATUSES = ["planned", "in_progress", "open"] as const;

export const B2B_GROUP_BY = ["status", "owner", "department", "market", "hotel"] as const;
export type B2bGroupBy = (typeof B2B_GROUP_BY)[number];

export const B2B_SORTS = ["nextActionAt", "priority", "updatedAt", "name"] as const;
export type B2bSort = (typeof B2B_SORTS)[number];

export const DEPARTMENT_LABEL: Record<B2bDepartment, string> = {
  sales: "Sales",
  revenue: "Revenue",
  distribution: "Distribution",
  marketing: "Marketing",
  management: "Management",
};

export const TYPE_LABEL: Record<B2bPartnerType, string> = {
  travel_agent: "Travel Agent",
  corporate: "Corporate",
  wholesale: "Wholesale",
  dmc: "DMC",
  other: "Other",
};

export const STATUS_LABEL: Record<B2bStatus, string> = {
  new_lead: "New Lead",
  qualification: "Qualification",
  contacted: "Contacted",
  negotiation: "Negotiation",
  rate_ready: "Rate Ready",
  contract_ready: "Contract Ready",
  active: "Active Partner",
  dormant: "Dormant",
  closed: "Closed / Not Fit",
};

export const PRIORITY_LABEL: Record<B2bPriority, string> = {
  low: "ต่ำ",
  normal: "ปกติ",
  high: "สูง",
  urgent: "ด่วน",
};

export const RATE_STATUS_LABEL: Record<B2bRateStatus, string> = {
  draft: "ฉบับร่าง",
  pending: "รออนุมัติ",
  approved: "อนุมัติแล้ว",
  rejected: "ไม่ผ่าน",
};

export const ACTIVITY_TYPE_LABEL: Record<B2bActivityType, string> = {
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  proposal: "Proposal",
  follow_up: "Follow-up",
  booking_review: "Booking Review",
};

export const ACTIVITY_STATUS_LABEL: Record<B2bActivityStatus, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  closed: "Closed",
  escalated: "Escalated",
};

export const SUBTASK_STATUS_LABEL: Record<B2bSubtaskStatus, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const GROUP_LABEL: Record<B2bGroupBy, string> = {
  status: "สถานะ",
  owner: "ผู้รับผิดชอบ",
  department: "แผนก",
  market: "ตลาด",
  hotel: "โรงแรม",
};

export const PRIORITY_RANK: Record<B2bPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

export const MASKED_VALUE = "••••";

export type B2bAccessView = {
  userId: string;
  departments: B2bDepartment[];
  canContacts: boolean;
  canCommercial: boolean;
  canEditPipeline: boolean;
  canEditActivities: boolean;
  canEditCommercial: boolean;
  canEditMaterials: boolean;
  canManageSettings: boolean;
  isManagement: boolean;
};

export type B2bContactView = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  channel: string;
  isPrimary: boolean;
  masked: boolean;
};

export type B2bTermView = {
  id: string;
  hotelName: string;
  ratePlan: string;
  commissionText: string;
  availability: string;
  channel: string;
  status: B2bRateStatus;
  notes: string;
  approvedBy: string;
  approvedAt: string;
  masked: boolean;
};

export type B2bActivityProgress = {
  total: number;
  completed: number;
  percent: number;
  label: string;
  countLabel: string;
};

export type B2bSubtaskView = {
  id: string;
  name: string;
  status: B2bSubtaskStatus;
  completed: boolean;
  dueAt: string;
  assigneeId: string;
  assigneeName: string;
  priority: B2bPriority;
  comments: string;
};

export type B2bActivityCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type B2bActivityFileView = {
  id: string;
  filename: string;
  caption: string;
  size: number;
  createdAt: string;
  href: string;
};

export type B2bActivityView = {
  id: string;
  partnerId: string;
  partnerName: string;
  type: B2bActivityType;
  title: string;
  hotelName: string;
  dueAt: string;
  status: B2bActivityStatus;
  notes: string;
  ownerId: string;
  ownerName: string;
  completedAt: string;
  closedAt: string;
  escalatedAt: string;
  createdAt: string;
  progress: B2bActivityProgress;
  subtasks: B2bSubtaskView[];
  comments: B2bActivityCommentView[];
  files: B2bActivityFileView[];
};

export type B2bBookingView = {
  id: string;
  hotelName: string;
  period: string;
  roomNights: string;
  revenueText: string;
  status: string;
  dataStatus: string;
  notes: string;
  masked: boolean;
};

export type B2bFileView = {
  id: string;
  kind: string;
  filename: string;
  caption: string;
  size: number;
  createdAt: string;
};

export type B2bNoteView = {
  id: string;
  kind: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: string;
};

export type B2bAuditView = {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  detail: string;
  createdAt: string;
};

export type B2bPartnerListItem = {
  id: string;
  name: string;
  type: B2bPartnerType;
  market: string;
  contactPerson: string;
  contactChannel: string;
  ownerId: string;
  ownerName: string;
  department: B2bDepartment;
  priority: B2bPriority;
  status: B2bStatus;
  nextAction: string;
  nextActionAt: string;
  lastContactAt: string;
  notes: string;
  hotels: string[];
  rateApproval: B2bRateStatus;
  createdAt: string;
  updatedAt: string;
  contactMasked: boolean;
  commercialMasked: boolean;
  activityCount: number;
  latestActivity: string;
  recentActivities: B2bActivityView[];
};

export type B2bPartnerDetail = B2bPartnerListItem & {
  contacts: B2bContactView[];
  terms: B2bTermView[];
  activities: B2bActivityView[];
  bookings: B2bBookingView[];
  files: B2bFileView[];
  notesList: B2bNoteView[];
  audits: B2bAuditView[];
};

export type B2bMaterialView = {
  id: string;
  title: string;
  kind: string;
  status: string;
  notes: string;
  filename: string;
  size: number;
  createdAt: string;
  updatedAt: string;
};

export type B2bSaveResult = { ok: true; id: string } | { ok: false; error: string };

export function isDepartment(value: string): value is B2bDepartment {
  return (B2B_DEPARTMENTS as readonly string[]).includes(value);
}

export function isPartnerType(value: string): value is B2bPartnerType {
  return (B2B_PARTNER_TYPES as readonly string[]).includes(value);
}

export function isStatus(value: string): value is B2bStatus {
  return (B2B_STATUSES as readonly string[]).includes(value);
}

export function isPriority(value: string): value is B2bPriority {
  return (B2B_PRIORITIES as readonly string[]).includes(value);
}

export function isRateStatus(value: string): value is B2bRateStatus {
  return (B2B_RATE_STATUSES as readonly string[]).includes(value);
}

export function isActivityType(value: string): value is B2bActivityType {
  return (B2B_ACTIVITY_TYPES as readonly string[]).includes(value);
}

export function isActivityStatus(value: string): value is B2bActivityStatus {
  return (B2B_ACTIVITY_STATUSES as readonly string[]).includes(value);
}

export function isSubtaskStatus(value: string): value is B2bSubtaskStatus {
  return (B2B_SUBTASK_STATUSES as readonly string[]).includes(value);
}

export function normalizeActivityType(value: string): B2bActivityType {
  if (value === "note") return "follow_up";
  if (value === "review") return "booking_review";
  return isActivityType(value) ? value : "follow_up";
}

export function normalizeActivityStatus(value: string): B2bActivityStatus {
  if (value === "open") return "planned";
  if (value === "done") return "completed";
  return isActivityStatus(value) ? value : "planned";
}

export function normalizeSubtaskStatus(value: string): B2bSubtaskStatus {
  if (value === "open" || value === "done") return value === "done" ? "completed" : "planned";
  return isSubtaskStatus(value) ? value : "planned";
}

export function isGroupBy(value: string): value is B2bGroupBy {
  return (B2B_GROUP_BY as readonly string[]).includes(value);
}

export function isSort(value: string): value is B2bSort {
  return (B2B_SORTS as readonly string[]).includes(value);
}

export function b2bErrorMessage(code: string) {
  const table: Record<string, string> = {
    missing_name: "กรอกชื่อพาร์ตเนอร์ก่อนบันทึก",
    missing_title: "กรอกหัวข้อก่อนบันทึก",
    invalid: "ข้อมูลไม่ถูกต้อง",
    missing: "ไม่พบรายการ",
    forbidden: "บัญชีนี้ไม่มีสิทธิ์แก้ไขส่วนนี้",
    invalid_file: "อัปโหลดได้เฉพาะไฟล์ไม่เกิน 5MB",
    subtask_limit: "เพิ่มซับงานได้ไม่เกิน 10 รายการ",
    missing_comment: "กรอกความคิดเห็นก่อนบันทึก",
    missing_file: "เลือกไฟล์ก่อนแนบ",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export function splitHotels(value: string) {
  return value
    .split(/[\n,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinHotels(values: string[]) {
  return values.map((item) => item.trim()).filter(Boolean).join("\n");
}
