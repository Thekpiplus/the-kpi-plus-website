export const TRN_DEPARTMENTS = [
  "reservations",
  "revenue",
  "distribution",
  "marketing",
  "operations",
  "sales",
  "management",
  "hr_ld",
  "it_data",
] as const;
export type TrnDepartment = (typeof TRN_DEPARTMENTS)[number];

export const TRN_DEPARTMENT_LABEL: Record<TrnDepartment, string> = {
  reservations: "Reservations",
  revenue: "Revenue",
  distribution: "Distribution",
  marketing: "Marketing",
  operations: "Operations / Guest Experience",
  sales: "Sales",
  management: "Management",
  hr_ld: "HR / Learning & Development",
  it_data: "IT / Data",
};

export const TRN_DEPARTMENT_PATH: Record<TrnDepartment, string> = {
  reservations: "/crm/training/departments/reservations",
  revenue: "/crm/training/departments/revenue",
  distribution: "/crm/training/departments/distribution",
  marketing: "/crm/training/departments/marketing",
  operations: "/crm/training/departments/operations",
  sales: "/crm/training/departments/sales",
  management: "/crm/training/departments/management",
  hr_ld: "/crm/training/departments/hr-ld",
  it_data: "/crm/training/departments/it-data",
};

export const TRN_KINDS = [
  "request",
  "program",
  "group",
  "needs",
  "material",
  "session",
  "assessment",
  "action",
  "trainer",
  "feedback",
  "report",
] as const;
export type TrnKind = (typeof TRN_KINDS)[number];

export const TRN_KIND_LABEL: Record<TrnKind, string> = {
  request: "Training Request",
  program: "Program / Course",
  group: "Learner Group",
  needs: "Needs Assessment",
  material: "Materials / Agenda",
  session: "Session",
  assessment: "Assessment",
  action: "Action Plan / Follow-up",
  trainer: "Trainer",
  feedback: "Feedback / Outcome",
  report: "Report / KPI",
};

export const TRN_SECTIONS = [
  "overview",
  "requests",
  "calendar",
  "programs",
  "groups",
  "needs",
  "materials",
  "sessions",
  "assessment",
  "followup",
  "trainers",
  "departments",
  "feedback",
  "reports",
  "approvals",
  "history",
  "settings",
] as const;
export type TrnSection = (typeof TRN_SECTIONS)[number];

export const TRN_SECTION_LABEL: Record<TrnSection, string> = {
  overview: "Overview",
  requests: "Training Requests",
  calendar: "Training Calendar",
  programs: "Programs / Courses",
  groups: "Learner Groups",
  needs: "Training Needs Assessment",
  materials: "Materials / Agenda",
  sessions: "Sessions / Attendance",
  assessment: "Assessment",
  followup: "Action Plans / Workplace Follow-up",
  trainers: "Trainer Directory",
  departments: "Department Workspaces",
  feedback: "Feedback / Outcomes",
  reports: "Reports / KPI",
  approvals: "Approvals",
  history: "Audit History",
  settings: "Settings",
};

export const TRN_SECTION_PATH: Record<TrnSection, string> = {
  overview: "/crm/training",
  requests: "/crm/training/requests",
  calendar: "/crm/training/calendar",
  programs: "/crm/training/programs",
  groups: "/crm/training/groups",
  needs: "/crm/training/needs",
  materials: "/crm/training/materials",
  sessions: "/crm/training/sessions",
  assessment: "/crm/training/assessment",
  followup: "/crm/training/follow-up",
  trainers: "/crm/training/trainers",
  departments: "/crm/training/departments",
  feedback: "/crm/training/feedback",
  reports: "/crm/training/reports",
  approvals: "/crm/training/approvals",
  history: "/crm/training/audit",
  settings: "/crm/training/settings",
};

export const TRN_SECTION_KIND: Record<TrnSection, TrnKind> = {
  overview: "request",
  requests: "request",
  calendar: "session",
  programs: "program",
  groups: "group",
  needs: "needs",
  materials: "material",
  sessions: "session",
  assessment: "assessment",
  followup: "action",
  trainers: "trainer",
  departments: "request",
  feedback: "feedback",
  reports: "report",
  approvals: "request",
  history: "request",
  settings: "request",
};

export const TRN_STATUSES = [
  "new",
  "draft",
  "review",
  "approved",
  "published",
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "on_hold",
  "cancelled",
  "archived",
] as const;
export type TrnStatus = (typeof TRN_STATUSES)[number];

export const TRN_STATUS_LABEL: Record<TrnStatus, string> = {
  new: "New",
  draft: "Draft",
  review: "Review",
  approved: "Approved",
  published: "Published",
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  on_hold: "On hold",
  cancelled: "Cancelled",
  archived: "Archived",
};

export const TRN_PROGRAM_STATUSES = ["draft", "review", "approved", "published", "archived"] as const;
export const TRN_FORMATS = ["inhouse", "workshop", "teambuilding", "online", "coaching"] as const;
export type TrnFormat = (typeof TRN_FORMATS)[number];
export const TRN_FORMAT_LABEL: Record<TrnFormat, string> = {
  inhouse: "In-house",
  workshop: "Workshop",
  teambuilding: "Team building",
  online: "Online",
  coaching: "Coaching",
};

export const TRN_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type TrnPriority = (typeof TRN_PRIORITIES)[number];
export const TRN_PRIORITY_LABEL: Record<TrnPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};
export const TRN_PRIORITY_RANK: Record<TrnPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };

export const TRN_APPROVAL_STATUSES = ["not_requested", "awaiting", "approved", "rejected", "changes_requested"] as const;
export type TrnApprovalStatus = (typeof TRN_APPROVAL_STATUSES)[number];
export const TRN_APPROVAL_LABEL: Record<TrnApprovalStatus, string> = {
  not_requested: "Not requested",
  awaiting: "Awaiting",
  approved: "Approved",
  rejected: "Rejected",
  changes_requested: "Changes requested",
};

export const TRN_VISIBILITY = ["aggregate", "restricted"] as const;
export type TrnVisibility = (typeof TRN_VISIBILITY)[number];
export const TRN_VISIBILITY_LABEL: Record<TrnVisibility, string> = {
  aggregate: "Aggregate only",
  restricted: "Restricted — role-limited",
};

export const TRN_ATTENDANCE = ["not_set", "planned", "present_aggregate", "completed", "cancelled"] as const;
export type TrnAttendance = (typeof TRN_ATTENDANCE)[number];
export const TRN_ATTENDANCE_LABEL: Record<TrnAttendance, string> = {
  not_set: "Not set",
  planned: "Planned",
  present_aggregate: "Present (aggregate)",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const TRN_GROUP_BY = ["status", "department", "property", "trainer", "program", "date"] as const;
export type TrnGroupBy = (typeof TRN_GROUP_BY)[number];
export const TRN_GROUP_LABEL: Record<TrnGroupBy, string> = {
  status: "Status",
  department: "Department",
  property: "Property",
  trainer: "Trainer",
  program: "Program",
  date: "Date",
};

export const TRN_SORTS = ["date", "priority", "updated"] as const;
export type TrnSort = (typeof TRN_SORTS)[number];
export const TRN_SORT_LABEL: Record<TrnSort, string> = {
  date: "Date",
  priority: "Priority",
  updated: "Last updated",
};

export const TRN_SUBTASK_STATUSES = ["not_started", "in_progress", "blocked", "needs_review", "completed"] as const;
export type TrnSubtaskStatus = (typeof TRN_SUBTASK_STATUSES)[number];
export const TRN_SUBTASK_STATUS_LABEL: Record<TrnSubtaskStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  needs_review: "Needs Review",
  completed: "Completed",
};

export const TRN_GATE_KINDS = ["none", "privacy", "safety", "trainer_approval", "participant_permission"] as const;
export type TrnGateKind = (typeof TRN_GATE_KINDS)[number];
export const TRN_BLOCKING_GATES = ["privacy", "safety", "trainer_approval", "participant_permission"] as const;
export const TRN_GATE_LABEL: Record<TrnGateKind, string> = {
  none: "Coordination",
  privacy: "Privacy",
  safety: "Safety",
  trainer_approval: "Trainer approval",
  participant_permission: "Participant permission",
};

export const TRN_READINESS = ["not_started", "in_progress", "blocked", "ready_for_review", "completed"] as const;
export type TrnReadiness = (typeof TRN_READINESS)[number];
export const TRN_READINESS_LABEL: Record<TrnReadiness, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  blocked: "Blocked",
  ready_for_review: "Needs Review",
  completed: "Completed",
};

export const TRN_DELIVERY_STATUSES: TrnStatus[] = ["approved", "published", "scheduled", "confirmed", "in_progress", "completed"];

export const MAX_TRN_SUBTASKS = 10;
export const MIN_TRN_SUBTASKS = 1;
export const MASKED_VALUE = "••••";

export type TrnExtraDepartment = { id: string; label: string };
export type TrnSettings = { extraDepartments: TrnExtraDepartment[] };

export type TrnAccessView = {
  userId: string;
  departments: string[];
  canEditBoard: boolean;
  canManageSettings: boolean;
  canSeeParticipants: boolean;
  isManagement: boolean;
};

export type TrnSubtaskCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type TrnSubtaskView = {
  id: string;
  recordId: string;
  name: string;
  department: string;
  ownerId: string;
  ownerName: string;
  reviewerId: string;
  reviewerName: string;
  status: TrnSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: TrnPriority;
  comments: string;
  evidence: string;
  gateKind: TrnGateKind;
  thread: TrnSubtaskCommentView[];
};

export type TrnSubtaskProgress = {
  total: number;
  completed: number;
  percent: number;
  readiness: TrnReadiness;
  countLabel: string;
  blockedByGate: boolean;
  gateReasons: TrnGateKind[];
};

export type TrnApprovalView = {
  id: string;
  kind: string;
  status: TrnApprovalStatus;
  notes: string;
  requestedBy: string;
  decidedBy: string;
  createdAt: string;
};

export type TrnAuditView = {
  id: string;
  action: string;
  detail: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
};

export type TrnPayload = {
  requester: string;
  targetRoles: string;
  goal: string;
  skillGap: string;
  format: string;
  learnerCount: string;
  dateWindow: string;
  category: string;
  audience: string;
  outcomes: string;
  agenda: string;
  materials: string;
  duration: string;
  durationConfirmed: boolean;
  assessmentMethod: string;
  followUpMethod: string;
  language: string;
  trainerName: string;
  programName: string;
  facilitator: string;
  learnerGroup: string;
  attendanceStatus: string;
  materialsLink: string;
  activityPlan: string;
  rubric: string;
  aggregatedResult: string;
  reviewer: string;
  period: string;
  visibility: string;
  followUpAction: string;
  ownerRole: string;
  checkpoint: string;
  support: string;
  skills: string;
  credentials: string;
  proofSource: string;
  verified: boolean;
  metric: string;
  definition: string;
  method: string;
  source: string;
  sample: boolean;
  value: string;
  prompts: string;
  selfCheck: string;
  sizeNote: string;
  privacyNote: string;
};

export function emptyPayload(): TrnPayload {
  return {
    requester: "",
    targetRoles: "",
    goal: "",
    skillGap: "",
    format: "inhouse",
    learnerCount: "",
    dateWindow: "",
    category: "",
    audience: "",
    outcomes: "",
    agenda: "",
    materials: "",
    duration: "",
    durationConfirmed: false,
    assessmentMethod: "",
    followUpMethod: "",
    language: "",
    trainerName: "",
    programName: "",
    facilitator: "",
    learnerGroup: "",
    attendanceStatus: "not_set",
    materialsLink: "",
    activityPlan: "",
    rubric: "",
    aggregatedResult: "",
    reviewer: "",
    period: "",
    visibility: "aggregate",
    followUpAction: "",
    ownerRole: "",
    checkpoint: "",
    support: "",
    skills: "",
    credentials: "",
    proofSource: "",
    verified: false,
    metric: "",
    definition: "",
    method: "",
    source: "",
    sample: true,
    value: "",
    prompts: "",
    selfCheck: "",
    sizeNote: "",
    privacyNote: "Do not store employee names, individual scores, or guest data.",
  };
}

export type TrnRecordRow = {
  id: string;
  kind: TrnKind;
  title: string;
  hotelName: string;
  department: string;
  ownerId: string;
  ownerName: string;
  approverId: string;
  approverName: string;
  trainerId: string;
  trainerName: string;
  programId: string;
  status: TrnStatus;
  priority: TrnPriority;
  eventAt: string;
  notes: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  payload: TrnPayload;
  approvals: TrnApprovalView[];
  history: TrnAuditView[];
  subtasks: TrnSubtaskView[];
  progress: TrnSubtaskProgress;
};

export type TrnListFilters = {
  q?: string;
  status?: string;
  ownerId?: string;
  department?: string;
  hotel?: string;
  trainer?: string;
  program?: string;
  date?: string;
  group?: string;
  sort?: string;
  view?: string;
  archived?: string;
};

export const TRN_DEPARTMENT_DUTIES: Record<TrnDepartment, string[]> = {
  reservations: ["Guest-service conversation", "Reservation workflow", "Handover", "Service recovery"],
  revenue: ["KPI / data literacy", "Reporting definitions", "Commercial decision support"],
  distribution: ["System / channel processes", "Accuracy checks", "Escalation and ownership"],
  marketing: ["Campaign / content workflow", "Brand review and approval"],
  operations: ["SOP alignment", "Service standards", "Shift handover", "Safety escalation"],
  sales: ["Customer / partner communication", "Follow-up ownership", "Account workflow"],
  management: ["Leadership and coaching", "Feedback", "Budget / scope approval", "Follow-up expectations"],
  hr_ld: ["Learner coordination", "Needs assessment", "Training schedule", "Evaluation and records", "Trainer approval", "Participant permission"],
  it_data: ["Access", "Approved systems", "Digital skills", "Data handling"],
};

export function trnGateKind(name: string, department = ""): TrnGateKind {
  const text = `${department} ${name}`.toLowerCase();
  if (/privacy|guest data|scores private|evaluation and records|data handling|retention|participant details/.test(text)) return "privacy";
  if (/safety/.test(text)) return "safety";
  if (/trainer approval|facilitator approval/.test(text)) return "trainer_approval";
  if (/participant permission|learner coordination|learner roles|participant/.test(text)) return "participant_permission";
  return "none";
}

export const TRN_STARTER_SUBTASKS: Array<{ department: TrnDepartment; name: string; gateKind: TrnGateKind }> = TRN_DEPARTMENTS.flatMap((department) =>
  TRN_DEPARTMENT_DUTIES[department].map((name) => ({ department, name, gateKind: trnGateKind(name, department) })),
);

export function trnDepartmentSubtasks<T extends { department: string }>(items: T[], department: string) {
  return items.filter((item) => item.department === department);
}

export function isTrnDepartment(value: string, extras: TrnExtraDepartment[] = []) {
  return TRN_DEPARTMENTS.includes(value as TrnDepartment) || extras.some((item) => item.id === value);
}
export function isKind(value: string): value is TrnKind {
  return TRN_KINDS.includes(value as TrnKind);
}
export function isStatus(value: string): value is TrnStatus {
  return TRN_STATUSES.includes(value as TrnStatus);
}
export function isPriority(value: string): value is TrnPriority {
  return TRN_PRIORITIES.includes(value as TrnPriority);
}
export function isSection(value: string): value is TrnSection {
  return TRN_SECTIONS.includes(value as TrnSection);
}
export function isGroupBy(value: string): value is TrnGroupBy {
  return TRN_GROUP_BY.includes(value as TrnGroupBy);
}
export function isSort(value: string): value is TrnSort {
  return TRN_SORTS.includes(value as TrnSort);
}
export function isSubtaskStatus(value: string): value is TrnSubtaskStatus {
  return TRN_SUBTASK_STATUSES.includes(value as TrnSubtaskStatus);
}
export function isGateKind(value: string): value is TrnGateKind {
  return TRN_GATE_KINDS.includes(value as TrnGateKind);
}
export function isTrnDeliveryStatus(value: string) {
  return TRN_DELIVERY_STATUSES.includes(value as TrnStatus);
}
export function isApprovalStatus(value: string): value is TrnApprovalStatus {
  return TRN_APPROVAL_STATUSES.includes(value as TrnApprovalStatus);
}
export function isFormat(value: string): value is TrnFormat {
  return TRN_FORMATS.includes(value as TrnFormat);
}
export function isVisibility(value: string): value is TrnVisibility {
  return TRN_VISIBILITY.includes(value as TrnVisibility);
}
export function isAttendance(value: string): value is TrnAttendance {
  return TRN_ATTENDANCE.includes(value as TrnAttendance);
}

export function normalizeStatus(value: string): TrnStatus {
  return isStatus(value) ? value : "draft";
}
export function normalizePriority(value: string): TrnPriority {
  return isPriority(value) ? value : "normal";
}
export function normalizeKind(value: string): TrnKind {
  return isKind(value) ? value : "request";
}
export function normalizeSubtaskStatus(value: string): TrnSubtaskStatus {
  return isSubtaskStatus(value) ? value : "not_started";
}
export function normalizeGateKind(value: string, name = "", department = ""): TrnGateKind {
  if (isGateKind(value) && value !== "none") return value;
  return trnGateKind(name, department);
}
export function normalizeApprovalStatus(value: string): TrnApprovalStatus {
  return isApprovalStatus(value) ? value : "not_requested";
}
export function normalizeFormat(value: string): TrnFormat {
  return isFormat(value) ? value : "inhouse";
}
export function normalizeVisibility(value: string): TrnVisibility {
  return isVisibility(value) ? value : "aggregate";
}
export function normalizeAttendance(value: string): TrnAttendance {
  return isAttendance(value) ? value : "not_set";
}

export function departmentLabel(id: string, extras: TrnExtraDepartment[] = []) {
  if (TRN_DEPARTMENTS.includes(id as TrnDepartment)) return TRN_DEPARTMENT_LABEL[id as TrnDepartment];
  return extras.find((item) => item.id === id)?.label || id;
}

export function webSectionPath(section: TrnSection) {
  return TRN_SECTION_PATH[section] || "/crm/training";
}

export function withTrnDepartmentFilter(searchParams: Promise<TrnListFilters>, department: string): Promise<TrnListFilters> {
  return searchParams.then((filters) => ({ ...filters, department }));
}

export const SECRET_ASSIGN_RE =
  /(password|passwd|api[_-\s]?key|employee[_-\s]?id|staff[_-\s]?id|assessment\s+score|learner\s+score|guest[_-\s]?(id|data|name|email|phone)|รหัสผ่าน|รหัสพนักงาน|คะแนนประเมิน|คะแนนรายบุคคล)\s*[:=]\s*\S+/i;
export const SECRET_TOKEN_RE = /\b(sk_live_[A-Za-z0-9]+|Bearer\s+[A-Za-z0-9\-._]{12,})\b/;
export const INDIVIDUAL_SCORE_RE = /(score|คะแนน).{0,24}(employee|staff|learner|ผู้เรียน|พนักงาน)/i;

export function textHasSecrets(value: string) {
  SECRET_ASSIGN_RE.lastIndex = 0;
  SECRET_TOKEN_RE.lastIndex = 0;
  return SECRET_ASSIGN_RE.test(value) || SECRET_TOKEN_RE.test(value) || INDIVIDUAL_SCORE_RE.test(value);
}

export function payloadHasSecrets(value: unknown): boolean {
  if (typeof value === "string") return textHasSecrets(value);
  if (Array.isArray(value)) return value.some(payloadHasSecrets);
  if (value && typeof value === "object") return Object.values(value).some(payloadHasSecrets);
  return false;
}

export function payloadHasIndividualScores(value: unknown): boolean {
  if (typeof value === "string") {
    INDIVIDUAL_SCORE_RE.lastIndex = 0;
    return INDIVIDUAL_SCORE_RE.test(value);
  }
  if (Array.isArray(value)) return value.some(payloadHasIndividualScores);
  if (value && typeof value === "object") return Object.values(value).some(payloadHasIndividualScores);
  return false;
}

export function trnErrorMessage(code: string) {
  const th: Record<string, string> = {
    missing: "ไม่พบรายการ",
    required: "กรอกชื่อรายการหรือโรงแรม",
    forbidden: "ไม่มีสิทธิ์แก้ไขบอร์ดนี้",
    invalid: "ข้อมูลไม่ถูกต้อง",
    missing_name: "กรอกชื่องานย่อย",
    missing_comment: "กรอกความเห็น",
    missing_note: "กรอกบันทึกการอนุมัติ",
    invalid_url: "ลิงก์เอกสารต้องเป็นเส้นทางภายในหรือ https",
    blocked_secret: "ห้ามใส่รหัสผ่าน รหัสพนักงาน คะแนนรายบุคคล หรือข้อมูลแขก",
    blocked_scores: "คะแนนรายบุคคลไม่สามารถบันทึกในช่องสาธารณะของบอร์ดนี้ — ใช้ผลรวมเท่านั้น",
    subtask_limit: "แต่ละรายการมีงานย่อยได้ 1–10 รายการ",
    duration_unverified: "ใส่ระยะเวลาได้เมื่อยืนยันแล้วเท่านั้น",
    blocked_gate: "งาน privacy / safety / trainer approval / participant permission ที่ติดขัด บล็อกการเผยแพร่หรือจัดอบรมได้แม้ความคืบหน้าจะสูง",
    missing_gate_note: "กรอกบันทึกก่อนอนุมัติ ปฏิเสธ หรือส่งต่อ",
  };
  const en: Record<string, string> = {
    missing: "Record not found",
    required: "Enter a title or hotel name",
    forbidden: "You do not have permission to edit this board",
    invalid: "The data is not valid",
    missing_name: "Enter a subtask name",
    missing_comment: "Enter a comment",
    missing_note: "Enter an approval note",
    invalid_url: "Document links must be an internal path or https URL",
    blocked_secret: "Do not store passwords, staff IDs, individual scores, or guest data",
    blocked_scores: "Individual learner scores cannot be stored in unprotected fields — use aggregates only",
    subtask_limit: "Each record can have 1–10 subtasks",
    duration_unverified: "Duration can be saved only when confirmed",
    blocked_gate: "A blocked privacy, safety, trainer-approval, or participant-permission task blocks publication or delivery even if completion is high",
    missing_gate_note: "Enter a note before approve, reject, or escalate",
  };
  return `${th[code] || "บันทึกไม่สำเร็จ"} / ${en[code] || "Save failed"}`;
}

export function defaultStatusForKind(kind: TrnKind): TrnStatus {
  if (kind === "request") return "new";
  if (kind === "session") return "scheduled";
  if (kind === "program") return "draft";
  return "draft";
}
