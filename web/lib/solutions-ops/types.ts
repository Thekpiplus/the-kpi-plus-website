/**
 * Hotel Solutions Service Directory (internal CRM module).
 * Separate from the public CMS editor at /crm/cms/solutions.
 */

export const SOL_BASE_PATH = "/crm/solutions";
export const SOL_PUBLIC_PATH = "/solutions";
export const SOL_CMS_PATH = "/crm/cms/solutions";

/* -------------------------------------------------------------------------- */
/* Departments                                                                */
/* -------------------------------------------------------------------------- */

export const SOL_DEPARTMENTS = [
  "revenue",
  "marketing",
  "distribution",
  "reservations",
  "sales",
  "operations",
  "systems-it-data",
  "training-hr-ld",
  "management",
] as const;
export type SolDepartment = (typeof SOL_DEPARTMENTS)[number];

export const SOL_DEPARTMENT_LABEL: Record<SolDepartment, string> = {
  revenue: "Revenue",
  marketing: "Marketing",
  distribution: "Distribution",
  reservations: "Reservations",
  sales: "Sales",
  operations: "Operations / Guest Experience",
  "systems-it-data": "Systems / IT / Data",
  "training-hr-ld": "Training / HR / Learning & Development",
  management: "Management",
};

export const SOL_DEPARTMENT_DUTIES: Record<SolDepartment, string> = {
  revenue: "บริการด้านราคา รายได้ และ commercial",
  marketing: "บริการด้านการตลาด สื่อโฆษณา และการค้นหา",
  distribution: "บริการด้านช่องทางจำหน่ายและการจองตรง",
  reservations: "บริการด้านทีมรับจองและการตอบกลับลูกค้า",
  sales: "บริการด้านการขายและคู่ค้า",
  operations: "บริการด้านหน้างานและประสบการณ์ผู้เข้าพัก",
  "systems-it-data": "บริการด้านระบบ ข้อมูล และ automation",
  "training-hr-ld": "บริการด้านฝึกอบรมและพัฒนาทีม",
  management: "บริการด้านการบริหารโรงแรมโดยรวม",
};

export function isDepartment(value: string): value is SolDepartment {
  return (SOL_DEPARTMENTS as readonly string[]).includes(value);
}

export function departmentLabel(value: string) {
  return isDepartment(value) ? SOL_DEPARTMENT_LABEL[value] : value || "ไม่ระบุ";
}

export function departmentPath(value: string) {
  return `${SOL_BASE_PATH}/departments/${value}`;
}

/* -------------------------------------------------------------------------- */
/* Extra (custom) departments — stored in settings, no code deploy             */
/* -------------------------------------------------------------------------- */

export type SolExtraDepartment = { id: string; label: string };
export type SolDepartmentOption = { id: string; label: string; core: boolean };

export const MAX_SOL_EXTRA_DEPARTMENTS = 20;

/** Lower-case ASCII slug used as a department id and URL segment. Empty string when nothing usable remains. */
export function slugifyDepartmentId(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
}

/** Core departments plus the extras configured in Settings (core first, ids are unique). */
export function allDepartments(settings?: { extraDepartments?: SolExtraDepartment[] } | null): SolDepartmentOption[] {
  const core: SolDepartmentOption[] = SOL_DEPARTMENTS.map((id) => ({ id, label: SOL_DEPARTMENT_LABEL[id], core: true }));
  const seen = new Set<string>(core.map((item) => item.id));
  const extras: SolDepartmentOption[] = [];
  for (const item of settings?.extraDepartments ?? []) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    extras.push({ id: item.id, label: item.label || item.id, core: false });
  }
  return [...core, ...extras];
}

export function isKnownDepartment(value: string, settings?: { extraDepartments?: SolExtraDepartment[] } | null) {
  return allDepartments(settings).some((item) => item.id === value);
}

/** Label lookup that understands extra departments. */
export function departmentLabelIn(value: string, departments: ReadonlyArray<{ id: string; label: string }>) {
  return departments.find((item) => item.id === value)?.label ?? departmentLabel(value);
}

export function departmentDuty(value: string) {
  return isDepartment(value) ? SOL_DEPARTMENT_DUTIES[value] : "แผนกที่เพิ่มใน Settings";
}

/* -------------------------------------------------------------------------- */
/* Sections / menus                                                           */
/* -------------------------------------------------------------------------- */

export const SOL_SECTIONS = [
  "overview",
  "catalog",
  "categories",
  "relationships",
  "preview",
  "inquiries",
  "proof",
  "assets",
  "translations",
  "seo",
  "approvals",
  "audit",
  "settings",
  "departments",
] as const;
export type SolSection = (typeof SOL_SECTIONS)[number];

export const SOL_SECTION_LABEL: Record<SolSection, string> = {
  overview: "Overview",
  catalog: "Service Catalog",
  categories: "Service Categories",
  relationships: "Service Relationships",
  preview: "Public Page Preview",
  inquiries: "Inquiry Queue",
  proof: "Case Studies / Proof",
  assets: "Asset and Permission Review",
  translations: "Translation Review",
  seo: "SEO / Page Metadata",
  approvals: "Approvals",
  audit: "Activity / Audit Log",
  settings: "Settings",
  departments: "Departments",
};

export const SOL_SECTION_PATH: Record<SolSection, string> = {
  overview: SOL_BASE_PATH,
  catalog: `${SOL_BASE_PATH}/catalog`,
  categories: `${SOL_BASE_PATH}/categories`,
  relationships: `${SOL_BASE_PATH}/relationships`,
  preview: `${SOL_BASE_PATH}/preview`,
  inquiries: `${SOL_BASE_PATH}/inquiries`,
  proof: `${SOL_BASE_PATH}/proof`,
  assets: `${SOL_BASE_PATH}/assets`,
  translations: `${SOL_BASE_PATH}/translations`,
  seo: `${SOL_BASE_PATH}/seo`,
  approvals: `${SOL_BASE_PATH}/approvals`,
  audit: `${SOL_BASE_PATH}/audit`,
  settings: `${SOL_BASE_PATH}/settings`,
  departments: `${SOL_BASE_PATH}/departments`,
};

export const SOL_SECTION_DESCRIPTION: Record<SolSection, string> = {
  overview: "ไดเรกทอรีบริการภายใน — สร้าง แก้ไข และบันทึกด้วยตนเอง ไม่มีการนำเข้าข้อมูล และแยกจากตัวแก้ไขหน้าสาธารณะใน CMS",
  catalog: "รายการบริการทั้งหมด จัดกลุ่มตามแผนกหรือสถานะ พร้อมบันทึกในบรรทัดเดียวกัน",
  categories: "หมวดบริการ (Grow Revenue / Grow Demand / Strengthen Operations) แก้ไขและบันทึกได้ในหน้านี้",
  relationships: "ความสัมพันธ์ระหว่างบริการ เช่น ต้องมีก่อน ใช้ร่วมกัน หรือขายต่อเนื่อง",
  preview: "ดูหน้า /solutions สาธารณะ และไปแก้ไขเนื้อหาที่ CMS ข้อมูลนี้ไม่ถูกเขียนลงหน้าสาธารณะโดยตรง",
  inquiries: "คิวคำขอจากหน้า Solutions ข้อมูลติดต่อแสดงเฉพาะผู้ได้รับสิทธิ์ ห้ามบันทึกข้อมูลแขกหรือรหัสผ่าน",
  proof: "แหล่งอ้างอิงหลักฐาน/เคสสตัดดี้ที่ได้รับอนุญาต ไม่มีตัวเลขสมมติ — ระบุแหล่งที่มาที่ตรวจสอบได้เท่านั้น",
  assets: "ตรวจสอบสิทธิ์การใช้รูปภาพและสื่อ ก่อนขึ้นหน้าสาธารณะ",
  translations: "สถานะเนื้อหา TH/EN และความพร้อมของ RU/ZH ไม่แต่งคำแปลที่ยังไม่มี",
  seo: "Title / Description ที่เสนอ เทียบกับ seo-manifest.json ที่ใช้งานจริง",
  approvals: "คิวอนุมัติบริการ — เฉพาะผู้ได้รับสิทธิ์อนุมัติจึงเปลี่ยนเป็น Approved / Published ได้",
  audit: "ประวัติการสร้าง แก้ไข และอนุมัติ ไม่บันทึกข้อมูลส่วนบุคคล",
  settings: "สิทธิ์ผู้ใช้ตามแผนก การเห็นข้อมูลติดต่อ และค่าตั้งต้นของไดเรกทอรี",
  departments: "พื้นที่ทำงานตามแผนก แต่ละแผนกเห็นบริการที่ตนเป็นเจ้าของ",
};

export function sectionPath(section: SolSection, department?: string) {
  if (section === "departments" && department) return departmentPath(department);
  return SOL_SECTION_PATH[section];
}

/* -------------------------------------------------------------------------- */
/* Enumerations                                                               */
/* -------------------------------------------------------------------------- */

export const SOL_STATUSES = ["draft", "review", "approved", "published", "archived"] as const;
export type SolStatus = (typeof SOL_STATUSES)[number];
export const SOL_STATUS_LABEL: Record<SolStatus, string> = {
  draft: "Draft",
  review: "Review",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
};
/** Statuses that only an approver (or management) may set. */
export const SOL_APPROVER_STATUSES: SolStatus[] = ["approved", "published"];

export const SOL_CONTENT_STATUSES = ["not_started", "draft", "in_review", "approved", "published"] as const;
export type SolContentStatus = (typeof SOL_CONTENT_STATUSES)[number];
export const SOL_CONTENT_STATUS_LABEL: Record<SolContentStatus, string> = {
  not_started: "ยังไม่เริ่ม",
  draft: "ร่าง",
  in_review: "กำลังตรวจ",
  approved: "อนุมัติแล้ว",
  published: "เผยแพร่แล้ว",
};

export const SOL_IMAGE_PERMISSIONS = ["unreviewed", "pending", "cleared", "restricted", "not_applicable"] as const;
export type SolImagePermission = (typeof SOL_IMAGE_PERMISSIONS)[number];
export const SOL_IMAGE_PERMISSION_LABEL: Record<SolImagePermission, string> = {
  unreviewed: "ยังไม่ตรวจ",
  pending: "รอการอนุญาต",
  cleared: "ได้รับอนุญาตแล้ว",
  restricted: "จำกัดการใช้",
  not_applicable: "ไม่มีรูป / ไม่เกี่ยวข้อง",
};

export const SOL_RELATION_KINDS = ["depends_on", "pairs_with", "prerequisite", "follow_on"] as const;
export type SolRelationKind = (typeof SOL_RELATION_KINDS)[number];
export const SOL_RELATION_LABEL: Record<SolRelationKind, string> = {
  depends_on: "ต้องพึ่งพา (depends on)",
  pairs_with: "ใช้ร่วมกัน (pairs with)",
  prerequisite: "ควรทำก่อน (prerequisite)",
  follow_on: "ต่อยอด (follow-on)",
};

export const SOL_CATEGORY_STATUSES = ["active", "hidden", "archived"] as const;
export type SolCategoryStatus = (typeof SOL_CATEGORY_STATUSES)[number];

export const SOL_INQUIRY_STATUSES = ["new", "contacted", "qualified", "proposal", "closed", "not_a_fit"] as const;
export type SolInquiryStatus = (typeof SOL_INQUIRY_STATUSES)[number];
export const SOL_INQUIRY_STATUS_LABEL: Record<SolInquiryStatus, string> = {
  new: "ใหม่",
  contacted: "ติดต่อแล้ว",
  qualified: "ผ่านคัดกรอง",
  proposal: "ส่งข้อเสนอ",
  closed: "ปิดงาน",
  not_a_fit: "ไม่เหมาะสม",
};

export const SOL_CONSENT_STATUSES = ["unknown", "given", "declined"] as const;
export type SolConsentStatus = (typeof SOL_CONSENT_STATUSES)[number];
export const SOL_CONSENT_LABEL: Record<SolConsentStatus, string> = {
  unknown: "ยังไม่ระบุ",
  given: "ยินยอมให้ติดต่อ",
  declined: "ไม่ยินยอม",
};

export const SOL_CONTACT_PREFERENCES = ["", "email", "phone", "line", "any"] as const;
export type SolContactPreference = (typeof SOL_CONTACT_PREFERENCES)[number];
export const SOL_CONTACT_PREFERENCE_LABEL: Record<SolContactPreference, string> = {
  "": "ไม่ระบุ",
  email: "อีเมล",
  phone: "โทรศัพท์",
  line: "LINE",
  any: "ช่องทางใดก็ได้",
};

export const SOL_GROUP_BY = ["department", "status", "category", "owner"] as const;
export type SolGroupBy = (typeof SOL_GROUP_BY)[number];
export const SOL_GROUP_LABEL: Record<SolGroupBy, string> = {
  department: "แผนก",
  status: "สถานะ",
  category: "หมวด",
  owner: "ผู้รับผิดชอบ",
};

export const SOL_SORTS = ["priority", "due", "updated"] as const;
export type SolSort = (typeof SOL_SORTS)[number];
export const SOL_SORT_LABEL: Record<SolSort, string> = {
  priority: "ความสำคัญ",
  due: "กำหนดส่ง",
  updated: "อัปเดตล่าสุด",
};

export const SOL_DUE_FILTERS = ["overdue", "upcoming", "range"] as const;
export type SolDueFilter = (typeof SOL_DUE_FILTERS)[number];
export const SOL_DUE_LABEL: Record<SolDueFilter, string> = {
  overdue: "เลยกำหนด",
  upcoming: "ใกล้ครบกำหนด (14 วัน)",
  range: "ช่วงวันที่",
};
export const SOL_UPCOMING_DAYS = 14;

export const SOL_VIEWS = ["table", "board", "form"] as const;
export type SolView = (typeof SOL_VIEWS)[number];
export const SOL_VIEW_LABEL: Record<SolView, string> = { table: "Table", board: "Board", form: "Form" };
export const normalizeView = (value: string | undefined): SolView => pick(SOL_VIEWS, value ?? "", "table");

/* -------------------------------------------------------------------------- */
/* Cross-department subtasks                                                  */
/* -------------------------------------------------------------------------- */

export const MIN_SOL_SUBTASKS = 1;
export const MAX_SOL_SUBTASKS = 10;

export const SOL_SUBTASK_PARENTS = ["service", "inquiry"] as const;
export type SolSubtaskParent = (typeof SOL_SUBTASK_PARENTS)[number];

export const SOL_SUBTASK_STATUSES = ["not_started", "in_progress", "blocked", "needs_review", "completed"] as const;
export type SolSubtaskStatus = (typeof SOL_SUBTASK_STATUSES)[number];
export const SOL_SUBTASK_STATUS_LABEL: Record<SolSubtaskStatus, string> = {
  not_started: "ยังไม่เริ่ม",
  in_progress: "กำลังทำ",
  blocked: "ติดขัด",
  needs_review: "รอตรวจ",
  completed: "เสร็จแล้ว",
};

export const SOL_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type SolPriority = (typeof SOL_PRIORITIES)[number];
export const SOL_PRIORITY_LABEL: Record<SolPriority, string> = {
  low: "ต่ำ",
  normal: "ปกติ",
  high: "สูง",
  urgent: "เร่งด่วน",
};
/** Lower number = more urgent. */
export const SOL_PRIORITY_RANK: Record<SolPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };

export const SOL_GATE_KINDS = ["none", "permission", "evidence", "privacy", "approval"] as const;
export type SolGateKind = (typeof SOL_GATE_KINDS)[number];
export const SOL_GATE_LABEL: Record<SolGateKind, string> = {
  none: "ไม่มีเกต",
  permission: "สิทธิ์ใช้งาน / Permission",
  evidence: "หลักฐาน / Evidence",
  privacy: "ความเป็นส่วนตัว / Privacy",
  approval: "การอนุมัติ / Approval",
};
/** A subtask that is `blocked` on one of these gates stops approve/publish (service) and close (inquiry). */
export const SOL_BLOCKING_GATES: readonly SolGateKind[] = ["permission", "evidence", "privacy", "approval"];

export const SOL_READINESS = ["not_started", "in_progress", "ready_for_review", "blocked", "completed"] as const;
export type SolReadiness = (typeof SOL_READINESS)[number];
export const SOL_READINESS_LABEL: Record<SolReadiness, string> = {
  not_started: "ยังไม่เริ่ม",
  in_progress: "กำลังดำเนินการ",
  ready_for_review: "พร้อมตรวจ",
  blocked: "ติดขัด",
  completed: "ครบถ้วน",
};

export type SolSubtaskProgress = {
  total: number;
  completed: number;
  percent: number;
  countLabel: string;
  blockedByGate: boolean;
  gateReasons: SolGateKind[];
  readiness: SolReadiness;
};

export type SolSubtaskCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type SolSubtaskView = {
  id: string;
  parentType: SolSubtaskParent;
  parentId: string;
  name: string;
  department: string;
  ownerId: string;
  ownerName: string;
  reviewerId: string;
  reviewerName: string;
  status: SolSubtaskStatus;
  completed: boolean;
  dueAt: string;
  priority: SolPriority;
  comments: string;
  evidence: string;
  gateKind: SolGateKind;
  sortOrder: number;
  updatedAt: string;
  thread: SolSubtaskCommentView[];
};

export const normalizeSubtaskParent = (value: string): SolSubtaskParent => pick(SOL_SUBTASK_PARENTS, value, "service");
export const normalizeSubtaskStatus = (value: string): SolSubtaskStatus => pick(SOL_SUBTASK_STATUSES, value, "not_started");
export const normalizePriority = (value: string): SolPriority => pick(SOL_PRIORITIES, value, "normal");
export const normalizeGateKind = (value: string): SolGateKind => pick(SOL_GATE_KINDS, value, "none");
export const isBlockingGate = (value: string) => (SOL_BLOCKING_GATES as readonly string[]).includes(value);

/** Parents whose status change is gated by blocked subtasks. */
export const SOL_SERVICE_GATED_STATUSES: readonly SolStatus[] = ["approved", "published"];
export const SOL_INQUIRY_GATED_STATUSES: readonly SolInquiryStatus[] = ["closed"];

function pick<T extends readonly string[]>(list: T, value: string, fallback: T[number]): T[number] {
  return (list as readonly string[]).includes(value) ? (value as T[number]) : fallback;
}

export const normalizeStatus = (value: string) => pick(SOL_STATUSES, value, "draft");
export const normalizeContentStatus = (value: string) => pick(SOL_CONTENT_STATUSES, value, "not_started");
export const normalizeImagePermission = (value: string) => pick(SOL_IMAGE_PERMISSIONS, value, "unreviewed");
export const normalizeRelationKind = (value: string) => pick(SOL_RELATION_KINDS, value, "pairs_with");
export const normalizeCategoryStatus = (value: string) => pick(SOL_CATEGORY_STATUSES, value, "active");
export const normalizeInquiryStatus = (value: string) => pick(SOL_INQUIRY_STATUSES, value, "new");
export const normalizeConsent = (value: string) => pick(SOL_CONSENT_STATUSES, value, "unknown");
export const normalizeContactPreference = (value: string) => pick(SOL_CONTACT_PREFERENCES, value, "");
export const normalizeGroupBy = (value: string | undefined): SolGroupBy => pick(SOL_GROUP_BY, value ?? "", "department");

/* -------------------------------------------------------------------------- */
/* Records                                                                    */
/* -------------------------------------------------------------------------- */

/** Extra (non-column) fields kept in payloadJson. */
export type SolPayload = {
  seoTitle: string;
  seoDescription: string;
  proofSummary: string;
  assetNote: string;
  translationNoteTh: string;
  translationNoteEn: string;
  reviewNote: string;
};

export function emptyPayload(): SolPayload {
  return {
    seoTitle: "",
    seoDescription: "",
    proofSummary: "",
    assetNote: "",
    translationNoteTh: "",
    translationNoteEn: "",
    reviewNote: "",
  };
}

export type SolServiceRow = {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  publicDescription: string;
  problemSolved: string;
  suitableFor: string;
  deliverables: string;
  dependencies: string;
  ownerDepartment: string;
  publicRoute: string;
  contentStatusTh: SolContentStatus;
  contentStatusEn: SolContentStatus;
  imagePermissionStatus: SolImagePermission;
  proofSourceRef: string;
  status: SolStatus;
  nextReviewAt: string;
  archived: boolean;
  payload: SolPayload;
  createdBy: string;
  createdByName: string;
  updatedBy: string;
  updatedByName: string;
  createdAt: string;
  updatedAt: string;
  /** True when the signed-in user may edit this specific service. */
  editable: boolean;
  subtasks: SolSubtaskView[];
  progress: SolSubtaskProgress;
  /** Earliest open subtask due date, falling back to nextReviewAt (ISO or ""). */
  nextDueAt: string;
};

export type SolCategoryRow = {
  id: string;
  name: string;
  description: string;
  ownerDepartment: string;
  sortOrder: number;
  status: SolCategoryStatus;
  serviceCount: number;
  updatedAt: string;
};

export type SolRelationshipRow = {
  id: string;
  fromServiceId: string;
  fromName: string;
  toServiceId: string;
  toName: string;
  kind: SolRelationKind;
  notes: string;
  updatedAt: string;
};

export type SolAuditRow = {
  id: string;
  entityType: string;
  entityId: string;
  entityName: string;
  action: string;
  detail: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
};

export type SolSettings = {
  reviewIntervalDays: number;
  inquiryDefaultOwnerId: string;
  internalNote: string;
  seededAt: string;
  /** Custom departments added in Settings (no code deploy). */
  extraDepartments: SolExtraDepartment[];
};

export type SolAccessView = {
  userId: string;
  departments: string[];
  isManagement: boolean;
  canEdit: boolean;
  canApprove: boolean;
  canManageSettings: boolean;
  canSeeContacts: boolean;
};

export type SolAccessRow = {
  id: string;
  userId: string;
  department: string;
  canSeeContacts: boolean;
  canApprove: boolean;
};

export type SolInquiryRow = {
  leadId: string;
  /** Empty string when the viewer has no contact access. */
  contactName: string;
  phone: string;
  email: string;
  contactHidden: boolean;
  company: string;
  formName: string;
  pageUrl: string;
  source: string;
  message: string;
  receivedAt: string;
  needCategory: string;
  selectedServices: string;
  contactPreference: SolContactPreference;
  ownerId: string;
  ownerName: string;
  status: SolInquiryStatus;
  nextActionAt: string;
  consentStatus: SolConsentStatus;
  notes: string;
  subtasks: SolSubtaskView[];
  progress: SolSubtaskProgress;
};

export type SolListFilters = {
  q?: string;
  department?: string;
  status?: string;
  category?: string;
  /** Staff id — matches any subtask owner on the service. */
  owner?: string;
  /** overdue | upcoming | range (with dueFrom / dueTo as YYYY-MM-DD). */
  due?: string;
  dueFrom?: string;
  dueTo?: string;
  /** priority | due | updated */
  sort?: string;
  view?: string;
  group?: string;
};

export function withDepartmentFilter(searchParams: Promise<SolListFilters>, department: string): Promise<SolListFilters> {
  return searchParams.then((filters) => ({ ...filters, department }));
}

/* -------------------------------------------------------------------------- */
/* Safety checks (no guest data / credentials)                                */
/* -------------------------------------------------------------------------- */

const SENSITIVE_RE =
  /(password|passwd|passcode|secret|api[_\s-]?key|access[_\s-]?token|credential|private[_\s-]?key|รหัสผ่าน|พาสเวิร์ด|passport|พาสปอร์ต|บัตรประชาชน|card\s*number|cvv|\b\d{13,19}\b)/i;

export function hasSensitiveText(...values: Array<string | null | undefined>) {
  return values.some((value) => value && SENSITIVE_RE.test(value));
}

const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const PHONE_RE = /(?:\+?\d[\s().-]?){9,}/;

/** Free-text ops notes must not carry contact details — those stay on the Lead and behind canSeeContacts. */
export function hasContactPattern(...values: Array<string | null | undefined>) {
  return values.some((value) => value && (EMAIL_RE.test(value) || PHONE_RE.test(value)));
}

const URL_RE = /^(#|\/|https?:\/\/)/i;
export function isSafeUrl(value: string) {
  return !value || URL_RE.test(value);
}

export const MASKED_VALUE = "••••••";

/* -------------------------------------------------------------------------- */
/* Messages                                                                   */
/* -------------------------------------------------------------------------- */

const ERRORS: Record<string, string> = {
  forbidden: "ไม่มีสิทธิ์ทำรายการนี้",
  forbidden_department: "แผนกนี้ไม่อยู่ในสิทธิ์ของคุณ",
  forbidden_approval: "เฉพาะผู้ได้รับสิทธิ์อนุมัติเท่านั้นที่ตั้งสถานะ Approved / Published ได้",
  forbidden_contacts: "ไม่มีสิทธิ์เห็นหรือแก้ข้อมูลติดต่อ",
  missing: "ไม่พบรายการ",
  required_name: "กรุณากรอกชื่อ",
  required_service: "กรุณาเลือกบริการ",
  same_service: "ต้องเลือกบริการสองรายการที่ต่างกัน",
  duplicate_relationship: "ความสัมพันธ์นี้มีอยู่แล้ว",
  invalid_url: "ลิงก์ต้องขึ้นต้นด้วย /, # หรือ https://",
  invalid_route: "Public route ต้องขึ้นต้นด้วย /solutions",
  invalid_date: "รูปแบบวันที่ไม่ถูกต้อง",
  blocked_sensitive: "พบข้อความที่เหมือนรหัสผ่าน/ข้อมูลแขก/เลขบัตร — ห้ามบันทึกในไดเรกทอรีนี้",
  blocked_contact: "ห้ามพิมพ์อีเมลหรือเบอร์โทรในช่องบันทึก — ข้อมูลติดต่ออยู่ที่ Lead และเห็นได้เฉพาะผู้ได้รับสิทธิ์",
  seo_title_long: "SEO title ยาวเกิน 70 ตัวอักษร",
  seo_description_long: "SEO description ยาวเกิน 200 ตัวอักษร",
  invalid_days: "จำนวนวันต้องเป็นตัวเลข 7–365",
  save_failed: "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง",
  blocked_by_gate: "ถูกบล็อกโดยเกตที่ยังติดขัด",
  subtask_limit: `งานย่อยครบ ${MAX_SOL_SUBTASKS} รายการแล้ว`,
  missing_comment: "กรุณากรอกความเห็นหรือบันทึก",
  missing_reviewer: "กรุณาเลือกผู้ตรวจ (reviewer)",
  invalid_state: "สถานะงานย่อยไม่ตรงเงื่อนไข — อนุมัติหรือปฏิเสธได้เฉพาะงานที่ “รอตรวจ”",
  forbidden_review: "เฉพาะ reviewer ที่ได้รับมอบหมาย หรือผู้มีสิทธิ์อนุมัติ จึงตัดสินงานย่อยนี้ได้",
  invalid_department: "แผนกไม่ถูกต้อง — ใช้ตัวอักษรอังกฤษ/ตัวเลขสำหรับรหัส (เช่น guest-relations)",
  duplicate_department: "แผนกนี้มีอยู่แล้ว",
  department_limit: `เพิ่มแผนกได้สูงสุด ${MAX_SOL_EXTRA_DEPARTMENTS} แผนก`,
  department_in_use: "แผนกนี้ยังถูกใช้โดยบริการ หมวด งานย่อย หรือสิทธิ์ — ย้ายหรือลบก่อน",
  invalid_evidence: "หลักฐานต้องเป็นลิงก์ https:// หรือรหัสอ้างอิงภายใน",
};

export function solErrorMessage(code: string, detail?: string) {
  if (code === "blocked_by_gate") return blockedByGateMessage(detail ? detail.split(",").map((item) => item.trim()) : []);
  const base = ERRORS[code] ?? ERRORS.save_failed;
  return detail ? `${base} (${detail})` : base;
}

/** Message used when blocked gates stop approve / publish / close. */
export function blockedByGateMessage(gates: string[]) {
  const labels = gates.filter(Boolean).map((item) => (SOL_GATE_LABEL as Record<string, string>)[item] ?? item);
  return `ถูกบล็อก (blocked_by_gate): ยังมีงานย่อยติดขัดที่เกต ${labels.length ? labels.join(", ") : "—"} — แก้ไขหรืออนุมัติเกตก่อนอนุมัติ/เผยแพร่/ปิดงาน`;
}

export type SolActionResult = { ok: true; id: string } | { ok: false; error: string; detail?: string };

export function parsePayload(raw: unknown): SolPayload {
  const base = emptyPayload();
  if (typeof raw !== "string" || !raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<Record<keyof SolPayload, unknown>>;
    const out = { ...base };
    for (const key of Object.keys(base) as Array<keyof SolPayload>) {
      if (typeof parsed[key] === "string") out[key] = parsed[key] as string;
    }
    return out;
  } catch {
    return base;
  }
}

export function defaultSettings(): SolSettings {
  return { reviewIntervalDays: 90, inquiryDefaultOwnerId: "", internalNote: "", seededAt: "", extraDepartments: [] };
}

/** Parses settingsJson, tolerating older rows that have no extraDepartments. */
export function parseSettings(raw: unknown): SolSettings {
  const base = defaultSettings();
  if (typeof raw !== "string" || !raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<Record<keyof SolSettings, unknown>>;
    const extras: SolExtraDepartment[] = [];
    const seen = new Set<string>(SOL_DEPARTMENTS);
    if (Array.isArray(parsed.extraDepartments)) {
      for (const item of parsed.extraDepartments as Array<Partial<SolExtraDepartment>>) {
        const id = slugifyDepartmentId(String(item?.id ?? ""));
        if (!id || seen.has(id)) continue;
        seen.add(id);
        extras.push({ id, label: String(item?.label ?? "").trim().slice(0, 80) || id });
      }
    }
    return {
      reviewIntervalDays: Number(parsed.reviewIntervalDays) > 0 ? Number(parsed.reviewIntervalDays) : base.reviewIntervalDays,
      inquiryDefaultOwnerId: String(parsed.inquiryDefaultOwnerId ?? ""),
      internalNote: String(parsed.internalNote ?? ""),
      seededAt: String(parsed.seededAt ?? ""),
      extraDepartments: extras.slice(0, MAX_SOL_EXTRA_DEPARTMENTS),
    };
  } catch {
    return base;
  }
}
