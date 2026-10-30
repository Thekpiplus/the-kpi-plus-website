import type { FaqItem } from "@/lib/faqs";
import { existingHref, type Locale } from "@/lib/seo";

export type SystemsVisualStatus = "replace" | "sample" | "approved" | "placeholder" | "real";
export type SystemsKpiStatus = "draft" | "sample" | "approved" | "anonymised" | "not-configured";
export type SystemsSourceStatus = "guidance" | "sample" | "approved";
export type SystemsIntegrationStatus =
  | "connected"
  | "needs_mapping"
  | "requires_provider_support"
  | "pending_access"
  | "testing"
  | "blocked"
  | "not_configured";
export type SystemsPlatformKind =
  | "existing_client_system"
  | "example_category"
  | "supported_via_provider"
  | "requires_verification"
  | "not_yet_verified"
  | "not_in_scope";

export function systemsSampleLabel(locale: Locale) {
  return locale === "th" ? "ตัวอย่างข้อมูล" : "Sample Architecture";
}

export function systemsShowsSampleBadge(status?: string) {
  return status !== "approved" && status !== "real";
}

export function systemsIsLibraryPlaceholder(src?: string) {
  return Boolean(src?.trim() && /\/images\/hotel-systems-[\w-]*placeholder\.webp$/i.test(src.trim()));
}

export function systemsRenderableSrc(src?: string, status?: string) {
  const next = src?.trim() || "";
  if (!next) return "";
  if (systemsIsLibraryPlaceholder(next) && systemsShowsSampleBadge(status)) return "";
  return next;
}

const VISUAL_META = {
  th: "แผนภาพตัวอย่าง · แทนที่ด้วยงานระบบโรงแรมที่อนุมัติ",
  en: "Sample diagram · Replace with approved hotel systems work",
};

export const SYSTEMS_HERO_JOURNEY = [
  { id: "inventory", th: "สำรวจระบบ", en: "System inventory" },
  { id: "flow", th: "เส้นทางข้อมูล", en: "Data flow" },
  { id: "mapping", th: "จับคู่ข้อมูล", en: "Data mapping" },
  { id: "readiness", th: "ความพร้อมก่อนตั้งค่า", en: "Implementation readiness" },
] as const;

export const SYSTEMS_HERO_CAPABILITIES = [
  { th: "Website", en: "Website" },
  { th: "Booking Engine", en: "Booking Engine" },
  { th: "PMS", en: "PMS" },
  { th: "Channel Manager", en: "Channel Manager" },
  { th: "OTA", en: "OTA" },
  { th: "Reporting", en: "Reporting" },
  { th: "Hotel Team", en: "Hotel Team" },
] as const;

export const SYSTEMS_HERO_VISUAL_CANDIDATE = "/images/hotel-systems-implementation-hero-placeholder.webp";
export const SYSTEMS_HERO_VISUAL_LEGACY = "/images/hotel-systems-architecture-placeholder.webp";
export const SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE = "/images/hotel-systems-review-placeholder.webp";
export const SYSTEMS_ASSESSMENT_VISUAL_LEGACY = "/images/hotel-systems-audit-placeholder.webp";
export const SYSTEMS_SERVICES_VISUAL_CANDIDATE = "/images/hotel-systems-landscape-placeholder.webp";
export const SYSTEMS_SERVICES_VISUAL_LEGACY = "/images/hotel-systems-services-placeholder.webp";
export const SYSTEMS_MODEL_VISUAL_CANDIDATE = "/images/hotel-systems-before-after-placeholder.webp";
export const SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE = "/images/hotel-systems-readiness-matrix-placeholder.webp";
export const SYSTEMS_DELIVERABLES_VISUAL_LEGACY = "/images/hotel-systems-readiness-placeholder.webp";
export const SYSTEMS_WORKFLOW_VISUAL_CANDIDATE = "/images/hotel-systems-implementation-workflow-placeholder.webp";
export const SYSTEMS_WORKFLOW_VISUAL_LEGACY = "/images/hotel-systems-workflow-placeholder.webp";
export const SYSTEMS_WORKFLOW_VISUAL_METHOD = "/images/hotel-systems-method-placeholder.webp";
export const SYSTEMS_FIT_VISUAL_CANDIDATE = "/images/hotel-systems-platform-landscape-placeholder.webp";
export const SYSTEMS_FIT_VISUAL_LEGACY = "/images/hotel-systems-platforms-placeholder.webp";
export const SYSTEMS_FIT_VISUAL_MATRIX = "/images/hotel-systems-fit-placeholder.webp";
export const SYSTEMS_INVENTORY_VISUAL_CANDIDATE = "/images/hotel-systems-inventory-mapping-placeholder.webp";
export const SYSTEMS_SCOPE_VISUAL_CANDIDATE = "/images/hotel-systems-implementation-responsibility-placeholder.webp";
export const SYSTEMS_SCOPE_VISUAL_LEGACY = "/images/hotel-systems-scope-placeholder.webp";
export const SYSTEMS_PLAN_VISUAL_CANDIDATE = "/images/hotel-systems-handover-placeholder.webp";
export const SYSTEMS_PLAN_VISUAL_LEGACY = "/images/hotel-systems-plan-placeholder.webp";
export const SYSTEMS_TESTING_VISUAL_CANDIDATE = "/images/hotel-systems-testing-qa-placeholder.webp";
export const SYSTEMS_RELATED_VISUAL_CANDIDATE = "/images/hotel-systems-related-placeholder.webp";
export const SYSTEMS_ENQUIRY_VISUAL_CANDIDATE = "/images/hotel-systems-contact-process-placeholder.webp";
export const SYSTEMS_ENQUIRY_VISUAL_LEGACY = "/images/hotel-systems-enquiry-placeholder.webp";
export const SYSTEMS_ENQUIRY_VISUAL_CONTACT = "/images/hotel-systems-contact-placeholder.webp";

function visual(id: string, labelEn: string, altTh: string, altEn: string, width: number, height: number) {
  return {
    status: "sample" as SystemsVisualStatus,
    labelTh: `${labelEn} — ตัวอย่างข้อมูล`,
    labelEn: `${labelEn} — Sample Architecture`,
    captionTh: "แผนภาพตัวอย่าง ไม่ใช่โรงแรมลูกค้าจริง และไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว",
    captionEn: "Sample diagram. Not a live client hotel, and not a verified integration status.",
    altTh,
    altEn,
    metaTh: VISUAL_META.th,
    metaEn: VISUAL_META.en,
    displayWidth: width,
    displayHeight: height,
    src: `/images/hotel-systems-${id}-placeholder.webp`,
  };
}

export const SYSTEMS_HERO_VISUAL = {
  ...visual(
    "implementation-hero",
    "Sample Architecture",
    "แผนภาพตัวอย่าง Hotel System Architecture และ Data Flow แสดง Website ไป Booking Engine ไป PMS ไป Channel Manager ไป OTA และ Reporting ก่อนถึงทีมโรงแรม พร้อมสถานะ Needs Mapping Pending Access Requires Provider Support และ Not Configured ไม่ใช่รูปโน้ตบุ๊กทั่วไป และไม่ใช่โรงแรมลูกค้าจริง",
    "Sample Hotel System Architecture and Data Flow diagram showing Website to Booking Engine to PMS to Channel Manager to OTA and Reporting, then to the hotel team, with Needs Mapping, Pending Access, Requires Provider Support, and Not Configured statuses. Not a generic laptop photo and not a live client hotel.",
    560,
    350,
  ),
  src: SYSTEMS_HERO_VISUAL_CANDIDATE,
  labelTh: "ตัวอย่าง Hotel Systems และ Data Flow",
  labelEn: "Sample Hotel Systems and Data Flow",
  captionTh: "ช่วยให้ระบบโรงแรม ข้อมูล ผู้รับผิดชอบ และขั้นตอนหลัง Go-live เชื่อมกันอย่างตรวจสอบได้",
  captionEn: "Help hotel systems, data, owners, and post go-live steps connect in a way that can be verified.",
  metaTh: "Sample integration architecture · Subject to technical verification",
  metaEn: "Sample integration architecture · Subject to technical verification",
};

export const SYSTEMS_HERO_LEGEND = [
  { id: "connected", label: "Connected", tone: "green" },
  { id: "needs_mapping", label: "Needs Mapping", tone: "yellow" },
  { id: "requires_provider_support", label: "Requires Provider Support", tone: "amber" },
  { id: "pending_access", label: "Pending Access", tone: "yellow" },
  { id: "not_configured", label: "Not Configured", tone: "red" },
] as const;

export const SYSTEMS_HERO_FLOW = [
  {
    id: "website",
    num: "01",
    titleTh: "Website",
    titleEn: "Website",
    status: "needs_mapping",
    statusLabel: "Needs Mapping",
    bodyTh: "หน้าสาธารณะและเส้นทางจอง ยังต้องจับคู่กับระบบจอง",
    bodyEn: "Public pages and the booking path. Still needs mapping to the engine.",
  },
  {
    id: "engine",
    num: "02",
    titleTh: "Booking Engine",
    titleEn: "Booking Engine",
    status: "not_configured",
    statusLabel: "Not Configured",
    bodyTh: "ยังไม่ได้ตั้งค่าในขอบเขตตัวอย่างนี้",
    bodyEn: "Not configured in this sample scope.",
  },
  {
    id: "pms",
    num: "03",
    titleTh: "PMS",
    titleEn: "PMS",
    status: "needs_mapping",
    statusLabel: "Needs Mapping",
    bodyTh: "ผู้สมัคร Source of Truth ของห้องและราคา ยังต้องจับคู่",
    bodyEn: "Candidate Source of Truth for rooms and rates. Still needs mapping.",
  },
  {
    id: "channel",
    num: "04",
    titleTh: "Channel Manager",
    titleEn: "Channel Manager",
    status: "pending_access",
    statusLabel: "Pending Access",
    bodyTh: "รอสิทธิ์จากผู้ให้บริการและโรงแรม",
    bodyEn: "Waiting for provider and hotel access.",
  },
  {
    id: "distribution",
    num: "05",
    titleTh: "OTA / Distribution",
    titleEn: "OTA / Distribution",
    status: "requires_provider_support",
    statusLabel: "Requires Provider Support",
    bodyTh: "ตัวเชื่อมหรือ API ต้องตรวจกับผู้ให้บริการ",
    bodyEn: "Connector or API still needs provider support.",
  },
  {
    id: "reporting",
    num: "06",
    titleTh: "Reporting / Hotel Team",
    titleEn: "Reporting / Hotel Team",
    status: "not_configured",
    statusLabel: "Not Configured",
    bodyTh: "รายงานและผู้รับผิดชอบหลัง Go-live ยังไม่ได้ตั้งค่า",
    bodyEn: "Reporting and the post go-live owner are not configured in this sample.",
  },
] as const;

export const SYSTEMS_ASSESSMENT_VISUAL = {
  ...visual(
    "review",
    "Sample Hotel Systems Review and Data Consistency Audit",
    "ตารางตัวอย่าง Hotel Systems Review และ Data Consistency Audit แสดงการเทียบประเภทห้อง ราคา และห้องว่างแบบปกปิดข้อมูล พร้อมสถานะ Needs Review Pending Access และ Not Configured ไม่ใช่ผลตรวจโรงแรมจริง และไม่ใช่รูปประชุมทีม",
    "Sample Hotel Systems Review and Data Consistency Audit showing a redacted room, rate, and availability comparison with Needs Review, Pending Access, and Not Configured statuses. Not a live hotel diagnosis and not a team-meeting photo.",
    480,
    320,
  ),
  src: SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
  labelTh: "ตัวอย่าง Hotel Systems Review และ Data Consistency Audit",
  labelEn: "Sample Hotel Systems Review and Data Consistency Audit",
  captionTh: "กรอบทบทวนตัวอย่าง สำหรับจัดประเด็นระบบและข้อมูล ไม่ใช่ผลตรวจโรงแรมลูกค้า และต้องตรวจทางเทคนิคก่อนสรุปสถานะ",
  captionEn: "Sample review framework used to locate system and data issues. Not a client hotel diagnosis, and status is subject to technical verification.",
  metaTh: "Sample review framework",
  metaEn: "Sample review framework",
};

export const SYSTEMS_REVIEW_STATUSES = [
  { id: "clear", label: "Clear", tone: "green" },
  { id: "needs_review", label: "Needs Review", tone: "yellow" },
  { id: "blocked", label: "Blocked", tone: "red" },
  { id: "pending_access", label: "Pending Access", tone: "amber" },
  { id: "not_configured", label: "Not Configured", tone: "muted" },
] as const;

export type SystemsReviewStatusId = (typeof SYSTEMS_REVIEW_STATUSES)[number]["id"];

export function systemsReviewStatus(id?: string) {
  return SYSTEMS_REVIEW_STATUSES.find((row) => row.id === id) || SYSTEMS_REVIEW_STATUSES[1];
}

export const SYSTEMS_REVIEW_COMPARE = [
  { id: "room", itemTh: "ประเภทห้อง", itemEn: "Room type", pms: "••••", cm: "Gap", be: "••••", status: "needs_review" },
  { id: "rate", itemTh: "Rate plan", itemEn: "Rate plan", pms: "••••", cm: "—", be: "••••", status: "pending_access" },
  { id: "avail", itemTh: "ห้องว่าง", itemEn: "Availability", pms: "••••", cm: "••••", be: "••••", status: "needs_review" },
] as const;

export const SYSTEMS_REVIEW_CHECKS = [
  { id: "inventory", th: "System inventory", en: "System inventory", status: "needs_review" },
  { id: "errors", th: "Error handling", en: "Error handling", status: "not_configured" },
  { id: "test", th: "Test process", en: "Test process", status: "not_configured" },
] as const;

export const SYSTEMS_ASSESSMENT_PANELS = SYSTEMS_REVIEW_COMPARE.map((row, index) => ({
  id: row.id,
  num: String(index + 1).padStart(2, "0"),
  titleTh: row.itemTh,
  titleEn: row.itemEn,
  bodyTh: row.status,
  bodyEn: row.status,
}));

export const SYSTEMS_ASSESSMENT_EVIDENCE = [
  { id: "audit", th: "Data Consistency Audit ตัวอย่าง · ปกปิดข้อมูล", en: "Redacted Data Consistency Audit" },
  { id: "inventory", th: "System Inventory ตัวอย่าง", en: "Sample system inventory review" },
  { id: "compare", th: "เทียบห้อง ราคา และห้องว่าง", en: "Room / rate / availability comparison" },
  { id: "checklist", th: "Integration checklist ตัวอย่าง", en: "Sample integration checklist" },
] as const;

export const SYSTEMS_SERVICES_VISUAL = {
  ...visual(
    "landscape",
    "Hotel Systems Landscape — Sample",
    "แผนภาพตัวอย่าง Hotel Systems Landscape แสดงเส้นทาง Guest ไป Website ไป Booking Engine ไป PMS ไป Channel Manager แล้วแยกไป OTA และ Reporting ก่อนถึงทีมโรงแรม พร้อมสถานะ Needs Mapping Pending Access Requires Provider Support Testing และ Not Configured ไม่ใช่โลโก้วอลล์ และไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว",
    "Sample Hotel Systems Landscape showing Guest to Website to Booking Engine to PMS to Channel Manager, then to OTA and Reporting, then to the hotel team, with Needs Mapping, Pending Access, Requires Provider Support, Testing, and Not Configured statuses. Not a logo wall and not a verified integration status.",
    720,
    405,
  ),
  src: SYSTEMS_SERVICES_VISUAL_CANDIDATE,
  labelTh: "Hotel Systems Landscape — Sample",
  labelEn: "Hotel Systems Landscape — Sample",
  captionTh: "เส้นทางตัวอย่าง ข้อมูลไม่ได้ไหลครบทุกระบบโดยอัตโนมัติ และต้องตรวจผู้ให้บริการ API การจับคู่สิทธิ์ และขอบเขตที่ตกลง",
  captionEn: "A sample path. Data does not flow across every system automatically. Provider, API or connector, mapping, permission, and agreed scope must be verified.",
  metaTh: "Sample review framework",
  metaEn: "Sample review framework",
};

export const SYSTEMS_LANDSCAPE_STATUSES = [
  { id: "connected", label: "Connected", tone: "green" },
  { id: "needs_mapping", label: "Needs Mapping", tone: "yellow" },
  { id: "requires_provider_support", label: "Requires Provider Support", tone: "amber" },
  { id: "pending_access", label: "Pending Access", tone: "yellow" },
  { id: "testing", label: "Testing", tone: "testing" },
  { id: "not_configured", label: "Not Configured", tone: "muted" },
] as const;

export function systemsLandscapeStatus(id?: string) {
  return SYSTEMS_LANDSCAPE_STATUSES.find((row) => row.id === id) || SYSTEMS_LANDSCAPE_STATUSES[5];
}

export const SYSTEMS_LANDSCAPE_CATEGORIES = [
  { id: "room", th: "ประเภทห้อง", en: "Room Type" },
  { id: "rate", th: "Rate Plan", en: "Rate Plan" },
  { id: "availability", th: "ห้องว่าง", en: "Availability" },
  { id: "reservation", th: "การจอง", en: "Reservation" },
  { id: "status", th: "สถานะการจอง", en: "Booking Status" },
  { id: "cancel", th: "การยกเลิก", en: "Cancellation" },
  { id: "source", th: "แหล่ง / ช่องทาง", en: "Source/Channel" },
  { id: "performance", th: "ข้อมูลรายได้ / ผลงาน", en: "Revenue/Performance Data" },
] as const;

export const SYSTEMS_LANDSCAPE_FIELDS = {
  role: { th: "บทบาท", en: "Role" },
  dataIn: { th: "ข้อมูลเข้า", en: "Data In" },
  dataOut: { th: "ข้อมูลออก", en: "Data Out" },
  sourceOfTruth: { th: "Source of Truth", en: "Source of Truth" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  status: { th: "สถานะการเชื่อม", en: "Integration status" },
  provider: { th: "การพึ่งพาผู้ให้บริการ", en: "Provider dependency" },
} as const;

export const SYSTEMS_LANDSCAPE_NOTE = {
  th: "Data Flow depends on the provider, API/connector, field mapping, permission, and agreed scope.",
  en: "Data Flow depends on the provider, API/connector, field mapping, permission, and agreed scope.",
} as const;

export const SYSTEMS_LANDSCAPE_PATH = {
  th: "Guest → Website → Booking Engine → PMS → Channel Manager → OTA / Reporting → Hotel Team",
  en: "Guest → Website → Booking Engine → PMS → Channel Manager → OTA / Reporting → Hotel Team",
} as const;

export const SYSTEMS_LANDSCAPE_CONNECTIONS = [
  { id: "guest-website", from: "guest", to: "website", labelTh: "คำขอจอง", labelEn: "Booking request" },
  { id: "website-engine", from: "website", to: "engine", labelTh: "ราคาและห้องว่างที่แสดง", labelEn: "Displayed rates and availability" },
  { id: "engine-pms", from: "engine", to: "pms", labelTh: "ห้อง / ราคา / การจอง", labelEn: "Room / rate / reservation" },
  { id: "pms-cm", from: "pms", to: "cm", labelTh: "ห้องว่างและราคาที่จับคู่", labelEn: "Mapped availability and rates" },
  { id: "cm-ota", from: "cm", to: "ota", labelTh: "กระจายช่องทาง", labelEn: "Channel distribution" },
  { id: "cm-reporting", from: "cm", to: "reporting", labelTh: "ข้อมูลผลงาน", labelEn: "Performance data" },
  { id: "ota-team", from: "ota", to: "team", labelTh: "งานปฏิบัติการ", labelEn: "Hotel operations" },
  { id: "reporting-team", from: "reporting", to: "team", labelTh: "รายงาน", labelEn: "Reporting" },
] as const;

export function systemsLandscapeCategoriesCms() {
  return SYSTEMS_LANDSCAPE_CATEGORIES.map((row) => ({ id: row.id, th: row.th, en: row.en }));
}

export function systemsLandscapeConnectionsCms() {
  return SYSTEMS_LANDSCAPE_CONNECTIONS.map((row) => ({
    id: row.id,
    from: row.from,
    to: row.to,
    labelTh: row.labelTh,
    labelEn: row.labelEn,
  }));
}

export const SYSTEMS_LANDSCAPE_NODES = [
  {
    id: "guest",
    area: "guest",
    titleTh: "Guest / Booking Source",
    titleEn: "Guest / Booking Source",
    roleTh: "จุดเริ่มคำขอจอง จากเว็บไซต์ OTA หรือช่องทางอื่น",
    roleEn: "Where a booking request can start, from the website, an OTA, or another channel",
    dataInTh: "วันที่เข้าพัก ประเภทห้องที่สนใจ และคำขอจอง ไม่แสดงข้อมูลส่วนตัวของแขก",
    dataInEn: "Stay dates, the room type requested, and booking intent. No guest personal data is shown",
    dataOutTh: "คำขอจองไปยังเว็บไซต์ หรือช่องทางขาย",
    dataOutEn: "A booking request to the website or a selling channel",
    sourceOfTruthTh: "ไม่ใช่ระบบโรงแรม และไม่ใช่ Source of Truth",
    sourceOfTruthEn: "Not a hotel system, and not a Source of Truth",
    ownerTh: "แขก / ช่องทางขาย",
    ownerEn: "Guest / selling channel",
    status: "not_configured" as const,
    providerTh: "ขึ้นกับช่องทางที่โรงแรมเปิดขาย",
    providerEn: "Depends on the channel the hotel has opened",
  },
  {
    id: "website",
    area: "web",
    titleTh: "Website",
    titleEn: "Website",
    roleTh: "หน้าสาธารณะที่แขกอ่านโรงแรม ห้อง และเส้นทางจอง",
    roleEn: "The public pages where guests read the hotel, rooms, and booking path",
    dataInTh: "เนื้อหาห้อง ราคาที่แสดง และลิงก์ไป Booking Engine",
    dataInEn: "Room content, displayed rates, and the link to the booking engine",
    dataOutTh: "คำขอเข้าสู่เส้นทางจองตรง",
    dataOutEn: "A request into the direct booking path",
    sourceOfTruthTh: "ไม่ใช่ Source of Truth ของห้อง ราคา หรือห้องว่าง",
    sourceOfTruthEn: "Not the Source of Truth for rooms, rates, or availability",
    ownerTh: "โรงแรม / เจ้าของเว็บไซต์",
    ownerEn: "Hotel / website owner",
    status: "needs_mapping" as const,
    providerTh: "CMS และสิทธิ์แก้ไขเนื้อหา ไม่ใช่หลักฐานว่าเชื่อมระบบแล้ว",
    providerEn: "CMS and content access. Not proof that systems are connected",
  },
  {
    id: "engine",
    area: "be",
    titleTh: "Booking Engine",
    titleEn: "Booking Engine",
    roleTh: "เส้นทางจองตรงที่แขกเห็นราคา เงื่อนไข และยืนยันการจอง",
    roleEn: "The direct booking path where the guest sees rates, conditions, and confirms a stay",
    dataInTh: "ประเภทห้อง Rate Plan ห้องว่าง และเงื่อนไขที่จับคู่แล้ว",
    dataInEn: "Room type, rate plan, availability, and conditions, if mapped",
    dataOutTh: "คำขอจอง สถานะการจอง และการยกเลิกตามที่ระบบรองรับ",
    dataOutEn: "Reservation requests, booking status, and cancellations as far as the engine supports",
    sourceOfTruthTh: "ไม่ใช่ Source of Truth ของห้องและราคา เว้นแต่โรงแรมกำหนด",
    sourceOfTruthEn: "Not the Source of Truth for rooms and rates unless the hotel agrees it is",
    ownerTh: "โรงแรม / ผู้ให้บริการ Booking Engine",
    ownerEn: "Hotel / booking-engine provider",
    status: "not_configured" as const,
    providerTh: "ผู้ให้บริการ Booking Engine และสิทธิ์ API หรือตัวเชื่อม",
    providerEn: "Booking-engine provider, plus API or connector access",
  },
  {
    id: "pms",
    area: "pms",
    titleTh: "PMS / Reservation System",
    titleEn: "PMS / Reservation System",
    roleTh: "มักเป็นผู้สมัคร Source of Truth ของห้อง ราคา และการจอง",
    roleEn: "Often the candidate Source of Truth for rooms, rates, and reservations",
    dataInTh: "การจอง การยกเลิก และการเปลี่ยนวันเข้าพัก",
    dataInEn: "Reservations, cancellations, and stay changes",
    dataOutTh: "ประเภทห้อง Rate Plan ห้องว่าง และสถานะการจอง",
    dataOutEn: "Room type, rate plan, availability, and booking status",
    sourceOfTruthTh: "ผู้สมัคร — ต้องยืนยันทีละโรงแรม ไม่สรุปอัตโนมัติ",
    sourceOfTruthEn: "A candidate only. It must be confirmed per hotel, not assumed",
    ownerTh: "โรงแรม / ผู้ให้บริการ PMS",
    ownerEn: "Hotel / PMS provider",
    status: "needs_mapping" as const,
    providerTh: "ผู้ให้บริการ PMS ไลเซนส์ และสิทธิ์เข้าถึง",
    providerEn: "PMS vendor, licence, and access",
  },
  {
    id: "cm",
    area: "cm",
    titleTh: "Channel Manager",
    titleEn: "Channel Manager",
    roleTh: "กระจายห้อง ราคา และห้องว่างไปยังช่องทางที่จับคู่แล้ว",
    roleEn: "Distributes mapped rooms, rates, and availability to selling channels",
    dataInTh: "ห้อง ราคา และห้องว่างจาก PMS หากจับคู่และมีสิทธิ์",
    dataInEn: "Rooms, rates, and availability from the PMS, if mapped and access exists",
    dataOutTh: "อัปเดตไป OTA และการจองกลับ ตามที่ตัวเชื่อมรองรับ",
    dataOutEn: "Updates to OTAs and booking returns, as far as the connector supports",
    sourceOfTruthTh: "ไม่ใช่ Source of Truth ขึ้นกับการจับคู่",
    sourceOfTruthEn: "Not the Source of Truth. It depends on mapping",
    ownerTh: "โรงแรม / ผู้ให้บริการ Channel Manager",
    ownerEn: "Hotel / channel-manager provider",
    status: "pending_access" as const,
    providerTh: "ผู้ให้บริการ CM ต้องอนุมัติตัวเชื่อมหรือ API",
    providerEn: "The CM provider must approve the connector or API",
  },
  {
    id: "ota",
    area: "ota",
    titleTh: "OTA / Distribution",
    titleEn: "OTA / Distribution",
    roleTh: "ช่องทางขายภายนอก ไม่ใช่ระบบหลักของโรงแรม",
    roleEn: "External selling channels. Not the hotel’s core system",
    dataInTh: "ประเภทห้อง Rate Plan และห้องว่างที่จับคู่แล้ว",
    dataInEn: "Mapped room type, rate plan, and availability",
    dataOutTh: "การจอง การยกเลิก และแหล่ง/ช่องทาง",
    dataOutEn: "Reservations, cancellations, and source/channel",
    sourceOfTruthTh: "รายการบน OTA ไม่ใช่ Source of Truth ของโรงแรม",
    sourceOfTruthEn: "The OTA listing is not the hotel Source of Truth",
    ownerTh: "ผู้ให้บริการช่องทาง",
    ownerEn: "Channel provider",
    status: "requires_provider_support" as const,
    providerTh: "แต่ละ OTA แยกกัน โรงแรมเชื่อมได้ไม่ครบทุกช่องทางเสมอ",
    providerEn: "Each OTA is separate. Not every channel can connect",
  },
  {
    id: "reporting",
    area: "reporting",
    titleTh: "Reporting / Dashboard",
    titleEn: "Reporting / Dashboard",
    roleTh: "มุมมองให้ทีมตัดสินใจ จากข้อมูลที่ระบบเปิดให้ใช้",
    roleEn: "A view for team decisions, from data the systems can expose",
    dataInTh: "การจอง แหล่ง/ช่องทาง และข้อมูลผลงานตามที่ระบบรองรับ ไม่แสดงยอดจริง",
    dataInEn: "Reservations, source/channel, and performance data the systems can expose. No live totals are shown",
    dataOutTh: "รายงานสำหรับทีม นิยามอาจต่างกันในแต่ละแหล่ง",
    dataOutEn: "Reports for the team. Definitions may differ by source",
    sourceOfTruthTh: "ใช้ได้เท่าที่ระบบต้นทางและนิยามที่ตกลงรองรับ",
    sourceOfTruthEn: "Only as far as the source systems and agreed definitions allow",
    ownerTh: "รายได้ / การเงินของโรงแรม",
    ownerEn: "Hotel revenue / finance",
    status: "not_configured" as const,
    providerTh: "PMS, Channel Manager หรือผู้ให้บริการรายงาน",
    providerEn: "PMS, channel manager, or reporting vendor",
  },
  {
    id: "team",
    area: "team",
    titleTh: "Hotel Team / Decisions",
    titleEn: "Hotel Team / Decisions",
    roleTh: "คนที่เปลี่ยนราคา ตรวจการจอง และแก้เมื่อข้อมูลผิด",
    roleEn: "The people who change rates, check bookings, and fix facts when something is wrong",
    dataInTh: "รายงาน สถานะการจอง และข้อผิดพลาดที่ทีมเห็น",
    dataInEn: "Reports, booking status, and errors the team can see",
    dataOutTh: "การตัดสินใจเรื่องราคา การจับคู่ และผู้รับผิดชอบ",
    dataOutEn: "Decisions on rates, mapping, and ownership",
    sourceOfTruthTh: "ความเป็นเจ้าของขั้นตอน ไม่ใช่ระบบ",
    sourceOfTruthEn: "Process ownership, not a system",
    ownerTh: "ตำแหน่งในโรงแรมที่ระบุชื่อได้",
    ownerEn: "Named hotel roles",
    status: "testing" as const,
    providerTh: "โรงแรม และผู้ให้บริการเมื่อการเชื่อมต่อล้ม",
    providerEn: "The hotel, and the provider when an integration fails",
  },
] as const;

export function systemsLandscapeCmsItems() {
  return SYSTEMS_LANDSCAPE_NODES.map((row) => ({
    id: row.id,
    stream: row.area,
    titleTh: row.titleTh,
    titleEn: row.titleEn,
    inputTh: row.dataInTh,
    inputEn: row.dataInEn,
    actionTh: row.roleTh,
    actionEn: row.roleEn,
    output: row.dataOutEn,
    approvalTh: row.providerTh,
    approvalEn: row.providerEn,
    ownerTh: row.ownerTh,
    ownerEn: row.ownerEn,
    roleTh: row.roleTh,
    roleEn: row.roleEn,
    dataOutTh: row.dataOutTh,
    dataOutEn: row.dataOutEn,
    sourceOfTruthTh: row.sourceOfTruthTh,
    sourceOfTruthEn: row.sourceOfTruthEn,
    status: row.status,
    providerTh: row.providerTh,
    providerEn: row.providerEn,
    verified: false,
  }));
}

export function systemsLandscapeItemsAreStale(items: Array<{ id?: string; status?: string; titleEn?: string; titleTh?: string }>) {
  if (!items.length) return true;
  const ids = new Set(items.map((item) => item.id));
  if (!ids.has("guest") || !ids.has("website") || !ids.has("engine") || !ids.has("pms") || !ids.has("cm") || !ids.has("ota") || !ids.has("reporting") || !ids.has("team")) {
    return true;
  }
  return items.some((item) => /Website\s*\/\s*Booking Engine/i.test(`${item.titleEn || ""} ${item.titleTh || ""}`));
}

export function systemsLandscapeConnectionsAreStale(items: Array<{ id?: string; from?: string; to?: string }>) {
  if (!items.length) return true;
  const ids = new Set(items.map((item) => item.id));
  return !ids.has("website-engine") || !ids.has("engine-pms") || ids.has("website-pms");
}

export function systemsLandscapePathIsStale(value?: string) {
  const next = String(value || "").trim();
  if (!next) return true;
  return /Website\s*\/\s*Booking Engine|Website or Booking Engine/i.test(next) || !/Website → Booking Engine/i.test(next);
}

export const SYSTEMS_MODEL_VISUAL = {
  ...visual(
    "before-after",
    "Disconnected Systems to Managed Data Flow — Sample",
    "แผนภาพตัวอย่าง Before และ After ฝั่ง Before แสดง PMS สเปรดชีต OTA Booking Engine และรายงานที่ยังแยกกัน พร้อมปัญหาการกรอกซ้ำ ข้อมูลไม่ตรง ไม่มี Source of Truth ไม่มีผู้รับผิดชอบเมื่อผิด และรายงานคนละนิยาม ฝั่ง After แสดง Source of Truth ไป Mapped Data Flow ไป Tested Integration ไป Clear Owner ไป Operating Procedure ไป Review ในขอบเขตที่ตกลง ไม่ได้หมายความว่าระบบทุกตัวทำงานอัตโนมัติ และไม่ใช่ผลโรงแรมจริง",
    "Sample Before and After diagram. Before shows a PMS, spreadsheet, OTA, booking engine, and reports running apart, with duplicate entry, inconsistent room, rate, and availability data, no Source of Truth, no error owner, and reports with different definitions. After shows Source of Truth, Mapped Data Flow, Tested Integration, Clear Owner, Operating Procedure, and Review, managed and verified within the agreed scope. It does not mean every system is fully automated, and it is not a live hotel result.",
    720,
    405,
  ),
  src: SYSTEMS_MODEL_VISUAL_CANDIDATE,
  labelTh: "Disconnected Systems to Managed Data Flow — Sample",
  labelEn: "Disconnected Systems to Managed Data Flow — Sample",
  captionTh: "After ในหน้านี้หมายถึงเส้นทางที่จัดการและตรวจแล้วในขอบเขตที่ตกลง ไม่ได้หมายความว่าระบบทุกตัวทำงานอัตโนมัติครบ",
  captionEn: "After here means a managed and verified path within the agreed scope. It does not mean every system is fully automated.",
  metaTh: "Sample review framework",
  metaEn: "Sample review framework",
};

export const SYSTEMS_BEFORE_AFTER_SYSTEMS = [
  { id: "pms", th: "PMS", en: "PMS" },
  { id: "sheet", th: "Spreadsheet", en: "Spreadsheet" },
  { id: "ota", th: "OTA", en: "OTA" },
  { id: "engine", th: "Booking Engine", en: "Booking Engine" },
  { id: "reports", th: "Reports", en: "Reports" },
] as const;

export const SYSTEMS_BEFORE_AFTER_ISSUES = [
  { id: "duplicate", th: "กรอกข้อมูลซ้ำ", en: "Duplicate data entry" },
  { id: "inconsistent", th: "ข้อมูลห้อง ราคา ห้องว่างไม่ตรงกัน", en: "Inconsistent room/rate/availability data" },
  { id: "sot", th: "ไม่ชัดว่าใครเป็น Source of Truth", en: "No clear Source of Truth" },
  { id: "owner", th: "เมื่อข้อมูลผิด ไม่มีผู้รับผิดชอบที่ชัด", en: "No clear error owner" },
  { id: "reports", th: "รายงานใช้นิยามต่างกัน", en: "Reports with different definitions" },
] as const;

export const SYSTEMS_BEFORE_AFTER_NOTE = {
  th: "การเชื่อมระบบไม่ได้หมายความว่าข้อมูลทุกชนิดจะไหลได้เอง สิ่งสำคัญคือ Data Mapping, Owner, Error Handling และขั้นตอนทำงานหลังการเชื่อมต่อ",
  en: "Connecting systems does not mean every kind of data will flow by itself. What matters is Data Mapping, Owner, Error Handling, and the operating steps after the connection.",
} as const;

export const SYSTEMS_BEFORE_AFTER_FIELDS = [
  {
    id: "connected",
    titleTh: "สิ่งที่เชื่อมแล้ว",
    titleEn: "What is connected",
    bodyTh: "ตัวอย่างนี้ยังไม่สรุปว่าระบบใด Connected การเชื่อมต่อยืนยันได้เมื่อมีสิทธิ์ จับคู่ข้อมูล และทดสอบในขอบเขตที่ตกลง",
    bodyEn: "This sample does not mark any system as Connected. A connection is confirmed only after access, mapping, and a test in the agreed scope.",
    ownerTh: "ยังไม่ระบุ",
    ownerEn: "Unassigned",
    status: "not_configured" as const,
  },
  {
    id: "mapping",
    titleTh: "สิ่งที่ต้องจับคู่ข้อมูล",
    titleEn: "What requires mapping",
    bodyTh: "ประเภทห้อง Rate Plan ราคา ห้องว่าง และเงื่อนไขข้าม PMS สเปรดชีต OTA Booking Engine และรายงาน",
    bodyEn: "Room type, rate plan, rate, availability, and conditions across the PMS, spreadsheet, OTA, booking engine, and reports",
    ownerTh: "โรงแรม / งานนำไปใช้",
    ownerEn: "Hotel / implementation",
    status: "needs_mapping" as const,
  },
  {
    id: "provider",
    titleTh: "สิ่งที่ต้องให้ผู้ให้บริการสนับสนุน",
    titleEn: "What requires provider support",
    bodyTh: "สิทธิ์ API หรือตัวเชื่อม การจองกลับจาก OTA และข้อจำกัดไลเซนส์ที่ผู้ให้บริการต้องอนุมัติ",
    bodyEn: "API or connector access, OTA booking returns, and licence limits that the vendor must approve",
    ownerTh: "โรงแรม / ผู้ให้บริการระบบ",
    ownerEn: "Hotel / system provider",
    status: "requires_provider_support" as const,
  },
  {
    id: "manual",
    titleTh: "สิ่งที่ยังทำด้วยคน",
    titleEn: "What is still manual",
    bodyTh: "การตรวจข้อผิดพลาด การอนุมัติราคาพิเศษ การแก้เมื่อข้อมูลไม่ตรง และการทบทวนหลัง Go-live ยังเป็นงานของคน",
    bodyEn: "Error checks, special-rate approval, fixing mismatched facts, and the review after go-live stay with people",
    ownerTh: "ตำแหน่งในโรงแรมที่ระบุชื่อได้",
    ownerEn: "Named hotel roles",
    status: "testing" as const,
  },
  {
    id: "next-owner",
    titleTh: "ใครรับงานถัดไป",
    titleEn: "Who owns the next action",
    bodyTh: "ตัวอย่างนี้ยังไม่ระบุชื่อตำแหน่งในโรงแรม ไม่ควรเริ่มจับคู่ข้อมูลถ้ายังไม่มีผู้รับผิดชอบ",
    bodyEn: "A named hotel role is not assigned in this sample. Mapping should not start without an owner.",
    ownerTh: "ยังไม่ระบุ",
    ownerEn: "Unassigned",
    status: "pending_access" as const,
  },
] as const;

export function systemsBeforeAfterCmsFields() {
  return SYSTEMS_BEFORE_AFTER_FIELDS.map((row) => ({
    id: row.id,
    titleTh: row.titleTh,
    titleEn: row.titleEn,
    bodyTh: row.bodyTh,
    bodyEn: row.bodyEn,
    ownerTh: row.ownerTh,
    ownerEn: row.ownerEn,
    status: row.status,
  }));
}

export function systemsBeforeAfterFieldsAreStale(items: Array<{ id?: string; status?: string }>) {
  if (!items.length) return true;
  return !items.some((item) => item.id === "connected" && String(item.status || "").trim());
}

export function systemsModelStepsAreStale(items: Array<{ id?: string }>) {
  if (!items.length) return true;
  if (items.some((item) => item.id === "preopen" || item.id === "operating" || item.id === "migrating")) return true;
  return !items.some((item) => item.id === "source-of-truth");
}

export const SYSTEMS_DELIVERABLES_VISUAL = {
  ...visual(
    "readiness-matrix",
    "Hotel Systems Implementation Readiness — Sample",
    "ตารางตัวอย่าง Hotel Systems Implementation Readiness แสดง Current Systems Data Mapping Access Integration Testing และ Ownership พร้อมสถานะ Needs Review Pending Access Requires Provider Support Blocked และ Not Configured ไม่ใช่สถานะโรงแรมจริง และไม่ได้ทำเครื่องหมาย Ready ทั้งตาราง",
    "Sample Hotel Systems Implementation Readiness matrix showing Current Systems, Data Mapping, Access, Integration, Testing, and Ownership, with Needs Review, Pending Access, Requires Provider Support, Blocked, and Not Configured statuses. Not a live hotel status, and not every row is marked Ready.",
    720,
    405,
  ),
  src: SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE,
  labelTh: "Hotel Systems Implementation Readiness — Sample",
  labelEn: "Hotel Systems Implementation Readiness — Sample",
  captionTh: "กรอบความพร้อมตัวอย่าง โรงแรมต้องเตรียมระบบ การจับคู่ สิทธิ์เข้าถึง ข้อจำกัดผู้ให้บริการ เคสทดสอบ และผู้รับผิดชอบก่อนเริ่มงาน ไม่ใช่สถานะ Ready ของโรงแรมจริง",
  captionEn: "Sample readiness framework. The hotel must prepare systems, mapping, access, provider limits, test cases, and owners before implementation. Not a live hotel Ready status.",
  metaTh: "Sample review framework",
  metaEn: "Sample review framework",
};

export const SYSTEMS_READINESS_STATUSES = [
  { id: "ready", label: "Ready", tone: "green" },
  { id: "needs_review", label: "Needs Review", tone: "yellow" },
  { id: "blocked", label: "Blocked", tone: "red" },
  { id: "pending_access", label: "Pending Access", tone: "yellow" },
  { id: "requires_provider_support", label: "Requires Provider Support", tone: "amber" },
  { id: "not_configured", label: "Not Configured", tone: "muted" },
] as const;

export function systemsReadinessStatus(id?: string) {
  return SYSTEMS_READINESS_STATUSES.find((row) => row.id === id) || SYSTEMS_READINESS_STATUSES[5];
}

export const SYSTEMS_WORKFLOW_VISUAL = {
  ...visual(
    "implementation-workflow",
    "Hotel Systems Implementation Workflow — Sample",
    "ไทม์ไลน์ตัวอย่างงานระบบโรงแรม Discover Map Configure Test และ Handover พร้อมแผนที่ส่งต่อ ผลลัพธ์ และเงื่อนไขก่อน Go-live ไม่ใช่รูปทีมประชุม และไม่ใช่ตารางเวลาโรงแรมจริง",
    "Sample hotel systems workflow timeline: Discover, Map, Configure, Test, and Handover, with a handoff map, deliverables, and a Go-live gate. Not a team photograph, and not a live hotel schedule.",
    640,
    360,
  ),
  src: SYSTEMS_WORKFLOW_VISUAL_CANDIDATE,
  labelTh: "Hotel Systems Implementation Workflow — Sample",
  labelEn: "Hotel Systems Implementation Workflow — Sample",
  captionTh: "ลำดับตัวอย่างห้าขั้น พร้อมผู้รับผิดชอบ ข้อมูลเข้า การกระทำ ผลลัพธ์ จุดอนุมัติ ข้อจำกัด และการตัดสินใจถัดไป ไม่ใช่ตารางเวลาโรงแรมจริง",
  captionEn: "A sample five-step sequence with owner, input, action, output, approval point, dependency, and next decision. Not a live hotel schedule.",
  metaTh: "Sample workflow",
  metaEn: "Sample workflow",
};

export const SYSTEMS_FIT_VISUAL = {
  ...visual(
    "platform-landscape",
    "Hotel Technology Landscape — Example Categories",
    "แผนที่หมวดเทคโนโลยีโรงแรมตัวอย่าง PMS Channel Manager Booking Engine Revenue Analytics และ Communication ไม่ใช่โลโก้วอลล์ ไม่ใช่หลักฐานว่าเชื่อมต่อแล้ว และไม่ได้หมายถึงความร่วมมือ การรับรอง หรือการรับรองอย่างเป็นทางการ",
    "Sample hotel technology landscape of PMS, Channel Manager, Booking Engine, Revenue, Analytics, and Communication categories. Not a logo wall, not proof of integration, and not a partnership, sponsorship, certification, or official endorsement.",
    720,
    405,
  ),
  src: SYSTEMS_FIT_VISUAL_CANDIDATE,
  labelTh: "Hotel Technology Landscape — Example Categories",
  labelEn: "Hotel Technology Landscape — Example Categories",
  captionTh: "หมวดตัวอย่าง / ต้องตรวจทางเทคนิคก่อน ชื่อแพลตฟอร์มใช้ระบุหมวด ไม่ใช่โลโก้วอลล์ และไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว",
  captionEn: "Examples / Subject to technical verification. Names identify categories. This is not a logo wall, and not a verified integration status.",
  metaTh: "Examples / Subject to technical verification",
  metaEn: "Examples / Subject to technical verification",
};

export const SYSTEMS_INVENTORY_VISUAL = {
  ...visual(
    "inventory-mapping",
    "System Inventory and Data Mapping — Sample",
    "ตารางตัวอย่าง System Inventory และ Data Dictionary สำหรับ PMS Channel Manager Booking Engine OTA Reporting และ CRM ไม่มีรหัสบัญชี รหัสการจอง ข้อมูลแขก หรือรหัสผ่าน และต้องแทนที่ด้วยข้อมูลโรงแรมที่อนุมัติ",
    "Sample System Inventory and Data Dictionary for PMS, Channel Manager, Booking Engine, OTA, Reporting, and CRM. No account IDs, booking IDs, guest data, or passwords. Replace with approved hotel data.",
    720,
    405,
  ),
  src: SYSTEMS_INVENTORY_VISUAL_CANDIDATE,
  labelTh: "System Inventory and Data Mapping — Sample",
  labelEn: "System Inventory and Data Mapping — Sample",
  captionTh: "ข้อมูลตัวอย่าง แทนที่ด้วยข้อมูลโรงแรมที่อนุมัติ และขึ้นกับการตรวจของผู้ให้บริการ",
  captionEn: "Sample data. Replace with approved hotel data. Subject to provider verification.",
  metaTh: "Sample data",
  metaEn: "Sample data",
};

export const SYSTEMS_SCOPE_VISUAL = {
  ...visual(
    "implementation-responsibility",
    "Implementation Responsibility Matrix — Sample",
    "ตารางตัวอย่างขอบเขตงานระบบโรงแรม สิ่งที่เดอะ เคพีไอ พลัสอาจช่วยตามขอบเขตที่ตกลง และสิ่งที่โรงแรมหรือผู้ให้บริการยังรับผิดชอบ ไม่ได้หมายความว่าเดอะ เคพีไอ พลัสเป็นเจ้าของทุกระบบภายนอก หรือการันตีพฤติกรรมของผู้ให้บริการ",
    "Sample hotel systems responsibility matrix of what The KPI Plus may support within the agreed scope, and what the hotel or provider remains responsible for. This does not mean The KPI Plus owns every external system or guarantees an external provider's behaviour.",
    720,
    405,
  ),
  src: SYSTEMS_SCOPE_VISUAL_CANDIDATE,
  labelTh: "Implementation Responsibility Matrix — Sample",
  labelEn: "Implementation Responsibility Matrix — Sample",
  captionTh: "ตัวอย่างขอบเขตงาน ขึ้นกับขอบเขตที่ตกลง ไม่ได้เป็นเจ้าของระบบภายนอก และไม่การันตีพฤติกรรมของผู้ให้บริการ",
  captionEn: "Sample boundary. Subject to the agreed scope. The KPI Plus does not own external systems and does not guarantee provider behaviour.",
  metaTh: "Sample boundary",
  metaEn: "Sample boundary",
};

export const SYSTEMS_PLAN_VISUAL = {
  ...visual(
    "handover",
    "Hotel Systems Handover and Ownership — Sample",
    "ตารางตัวอย่างการส่งมอบระบบโรงแรม รายการเอกสารที่ส่ง และตารางเจ้าของระบบ ไม่เก็บรหัสผ่านหรือคีย์ API และไม่ทำเครื่องหมาย Live หรือ Handed Over จนกว่าโรงแรมจะอนุมัติและเอกสารถูกต้องครบ",
    "Sample hotel systems handover checklist and ownership table. No passwords or API keys are stored. A system is not marked Live or Handed Over until hotel approval and required documentation are complete.",
    720,
    405,
  ),
  src: SYSTEMS_PLAN_VISUAL_CANDIDATE,
  labelTh: "Hotel Systems Handover and Ownership — Sample",
  labelEn: "Hotel Systems Handover and Ownership — Sample",
  captionTh: "ตัวอย่างการส่งมอบ เก็บเฉพาะเจ้าของ บทบาท และระดับสิทธิ์ ไม่เก็บรหัสผ่าน และไม่ทำเครื่องหมาย Live หรือ Handed Over จนกว่าจะอนุมัติครบ",
  captionEn: "Sample handover. Stores named owners, roles, and access levels only. No passwords. A system is not marked Live or Handed Over until approvals and documentation are complete.",
  metaTh: "Sample handover",
  metaEn: "Sample handover",
};

export const SYSTEMS_TESTING_VISUAL = {
  ...visual(
    "testing-qa",
    "Hotel Systems Test Cases and QA — Sample",
    "ตารางตัวอย่างเคสทดสอบระบบโรงแรมและการจัดการข้อผิดพลาด Detect Log Assign Owner Notify Correct Retest Close ไม่มีข้อมูลแขกหรือข้อมูลชำระเงิน และไม่ใช่ผลทดสอบโรงแรมจริง",
    "Sample hotel systems test-case and QA table with Detect, Log, Assign Owner, Notify, Correct, Retest, and Close. No guest or payment data, and not a live hotel test result.",
    720,
    405,
  ),
  src: SYSTEMS_TESTING_VISUAL_CANDIDATE,
  labelTh: "Hotel Systems Test Cases and QA — Sample",
  labelEn: "Hotel Systems Test Cases and QA — Sample",
  captionTh: "เคสตัวอย่าง แทนที่ด้วยผลทดสอบที่อนุมัติ ไม่มีข้อมูลแขกหรือข้อมูลชำระเงิน",
  captionEn: "Sample cases. Replace with approved test results. No guest or payment data.",
  metaTh: "Sample data",
  metaEn: "Sample data",
};

export const SYSTEMS_RELATED_VISUAL = visual(
  "related",
  "Related hotel work",
  "แผนที่เนื้อหาตัวอย่างงานที่เกี่ยวข้องกับระบบโรงแรม รายได้ และการจอง ไม่ใช่ผลโรงแรม",
  "Sample related-content map for hotel systems, revenue, and reservations. Not a hotel result.",
  520,
  347,
);

export const SYSTEMS_ENQUIRY_VISUAL = {
  ...visual(
    "contact-process",
    "What Happens Next — Sample implementation process",
    "แผนภาพตัวอย่างหลังเริ่มคุย: System Inventory → Data Mapping → Testing → Handover ไม่ใช่รูปบุคคล และไม่ใช่โรงแรมลูกค้าจริง",
    "Sample What Happens Next process: System Inventory → Data Mapping → Testing → Handover. Not a person photo, and not a live client hotel.",
    420,
    210,
  ),
  src: SYSTEMS_ENQUIRY_VISUAL_CANDIDATE,
  labelTh: "What Happens Next — Sample implementation process",
  labelEn: "What Happens Next — Sample implementation process",
  captionTh: "ลำดับตัวอย่างหลังเริ่มคุย ไม่ต้องส่งรหัสผ่าน คีย์ หรือข้อมูลแขก",
  captionEn: "A sample sequence after the conversation starts. Do not send passwords, keys, or guest data.",
  metaTh: "Sample process · 1200 × 600 px · Display 420 × 210 px · 2:1",
  metaEn: "Sample process · 1200 × 600 px · Display 420 × 210 px · 2:1",
};

export const SYSTEMS_ENQUIRY_FLOW = [
  { id: "inventory", th: "System Inventory", en: "System Inventory" },
  { id: "mapping", th: "Data Mapping", en: "Data Mapping" },
  { id: "testing", th: "Testing", en: "Testing" },
  { id: "handover", th: "Handover", en: "Handover" },
] as const;

export const SYSTEMS_ENQUIRY_GOALS = [
  { id: "new_setup", th: "New Setup", en: "New Setup" },
  { id: "integration", th: "Integration", en: "Integration" },
  { id: "data_mapping", th: "Data Mapping", en: "Data Mapping" },
  { id: "troubleshooting", th: "Troubleshooting", en: "Troubleshooting" },
  { id: "handover", th: "Handover", en: "Handover" },
] as const;

export const SYSTEMS_FLOW_FIELDS = [
  { id: "source", th: "แหล่งความจริง", en: "Source of Truth" },
  { id: "in", th: "ข้อมูลเข้า", en: "Data In" },
  { id: "out", th: "ข้อมูลออก", en: "Data Out" },
  { id: "owner", th: "เจ้าของ", en: "Owner" },
  { id: "provider", th: "ผู้ให้บริการ", en: "Provider" },
  { id: "connector", th: "Connector / API", en: "Connector / API" },
  { id: "error", th: "Error Handling", en: "Error Handling" },
] as const;

export const SYSTEMS_STATUS_LABEL: Record<SystemsIntegrationStatus, { th: string; en: string }> = {
  connected: { th: "Connected", en: "Connected" },
  needs_mapping: { th: "Needs Mapping", en: "Needs Mapping" },
  requires_provider_support: { th: "Requires Provider Support", en: "Requires Provider Support" },
  pending_access: { th: "Pending Access", en: "Pending Access" },
  testing: { th: "Testing", en: "Testing" },
  blocked: { th: "Blocked", en: "Blocked" },
  not_configured: { th: "Not Configured", en: "Not Configured" },
};

export const SYSTEMS_READINESS_ROWS = [
  { id: "pms", systemTh: "PMS", systemEn: "PMS", status: "needs_mapping" as SystemsIntegrationStatus, ownerTh: "โรงแรม / ผู้ให้บริการ PMS", ownerEn: "Hotel / PMS provider", noteTh: "ตัวอย่าง — ตรวจสิทธิ์และโครงสร้างห้องก่อนสรุป", noteEn: "Sample — verify access and room structure before concluding" },
  { id: "cm", systemTh: "Channel Manager", systemEn: "Channel Manager", status: "pending_access" as SystemsIntegrationStatus, ownerTh: "โรงแรม / ผู้ให้บริการ CM", ownerEn: "Hotel / channel-manager provider", noteTh: "ตัวอย่าง — งานนี้อาจต้องให้ผู้ให้บริการอนุมัติ", noteEn: "Sample — provider approval may be required" },
  { id: "ota", systemTh: "OTA", systemEn: "OTA", status: "requires_provider_support" as SystemsIntegrationStatus, ownerTh: "ผู้ให้บริการช่องทาง", ownerEn: "Channel provider", noteTh: "ตัวอย่าง — ไม่ใช่สถานะโรงแรมจริง", noteEn: "Sample — not a live hotel status" },
  { id: "be", systemTh: "Booking Engine", systemEn: "Booking Engine", status: "testing" as SystemsIntegrationStatus, ownerTh: "โรงแรม / เว็บไซต์", ownerEn: "Hotel / website", noteTh: "ตัวอย่าง — ทดสอบตามขอบเขตที่ตกลง", noteEn: "Sample — tested within the agreed scope" },
  { id: "report", systemTh: "Reporting", systemEn: "Reporting", status: "not_configured" as SystemsIntegrationStatus, ownerTh: "โรงแรม", ownerEn: "Hotel", noteTh: "ตัวอย่าง — รายงานใช้ได้เท่าที่ระบบรองรับ", noteEn: "Sample — reports only as far as systems support" },
] as const;

export const SYSTEMS_PLATFORMS = [
  { name: "Cloudbeds", src: "/brand/platforms/cloudbeds.png", kind: "example_category" as SystemsPlatformKind },
  { name: "SiteMinder", src: "/brand/platforms/siteminder.png", kind: "example_category" as SystemsPlatformKind },
  { name: "Yanolja Cloud", src: "/brand/platforms/yanolja.png", kind: "example_category" as SystemsPlatformKind },
  { name: "OPERA Cloud", src: "/brand/platforms/opera-cloud.png", kind: "example_category" as SystemsPlatformKind },
  { name: "NAWA", src: "/brand/platforms/nawa.png", kind: "example_category" as SystemsPlatformKind },
  { name: "HotelierGuru", src: "/brand/platforms/hotelierguru.png", kind: "example_category" as SystemsPlatformKind },
] as const;

export const SYSTEMS_METHOD_LABELS = ["AUDIT", "MAP", "CONFIGURE", "TEST", "TRAIN", "GO LIVE"] as const;

export const SYSTEMS_HOTEL_STATUS = [
  { id: "operating", th: "เปิดให้บริการแล้ว", en: "Operating" },
  { id: "opening", th: "กำลังเปิด", en: "Opening" },
  { id: "migrating", th: "กำลังย้ายระบบ", en: "Moving systems" },
] as const;

export const SYSTEMS_HOTEL_CHALLENGES = [
  { id: "mapping", th: "การจับคู่ห้องและราคา", en: "Room and rate mapping" },
  { id: "availability", th: "ห้องว่างไม่ตรงกัน", en: "Availability mismatch" },
  { id: "reporting", th: "รายงานใช้ตัดสินใจไม่ได้", en: "Reports that do not support decisions" },
  { id: "opening", th: "โรงแรมก่อนเปิด", en: "Before opening" },
  { id: "migration", th: "กำลังย้ายระบบ", en: "Moving systems" },
] as const;

export const SYSTEMS_ASSESSMENT_ROWS = [
  {
    id: "data-mismatch",
    num: "01",
    titleTh: "ข้อมูลห้อง ราคา ห้องว่าง",
    titleEn: "Room, rate, availability",
    questionTh: "ข้อมูลห้อง ราคา หรือห้องว่างในแต่ละระบบไม่ตรงกันหรือไม่?",
    questionEn: "Is room, rate, or availability data inconsistent across systems?",
    status: "needs_review" as const,
    evidenceTh: "เทียบห้อง / ราคา / ห้องว่างแบบปกปิด",
    evidenceEn: "Redacted room / rate / availability comparison",
    ownerTh: "ยังไม่ระบุ",
    ownerEn: "Unassigned",
    actionTh: "เทียบประเภทห้อง Rate Plan และห้องว่างข้ามระบบ",
    actionEn: "Compare room types, rate plans, and availability across systems",
  },
  {
    id: "duplicate-entry",
    num: "02",
    titleTh: "กรอกข้อมูลซ้ำ",
    titleEn: "Repeated data entry",
    questionTh: "พนักงานต้องกรอกข้อมูลชุดเดียวกันในหลายที่หรือไม่?",
    questionEn: "Must staff enter the same data in several places?",
    status: "needs_review" as const,
    evidenceTh: "System inventory",
    evidenceEn: "System inventory",
    ownerTh: "งานปฏิบัติการ",
    ownerEn: "Operations",
    actionTh: "ลิสต์จุดที่ต้องกรอกข้อมูลชุดเดียวกันซ้ำ",
    actionEn: "List where the same fact is entered more than once",
  },
  {
    id: "source-of-truth",
    num: "03",
    titleTh: "Source of Truth",
    titleEn: "Source of Truth",
    questionTh: "ยังไม่ชัดว่าระบบใดเป็น Source of Truth หรือไม่?",
    questionEn: "Is it unclear which system is the Source of Truth?",
    status: "needs_review" as const,
    evidenceTh: "แผนที่ระบบตัวอย่าง",
    evidenceEn: "Sample system map",
    ownerTh: "ยังไม่ระบุ",
    ownerEn: "Unassigned",
    actionTh: "ระบุ Source of Truth ของห้อง ราคา และห้องว่าง",
    actionEn: "Name the Source of Truth for rooms, rates, and availability",
  },
  {
    id: "incomplete-data",
    num: "04",
    titleTh: "ข้อมูลไม่ครบ",
    titleEn: "Incomplete data",
    questionTh: "ข้อมูล PMS, Channel Manager, Booking Engine หรือรายงานยังไม่ครบหรือไม่?",
    questionEn: "Is PMS, channel manager, booking engine, or reporting data incomplete?",
    status: "pending_access" as const,
    evidenceTh: "System inventory",
    evidenceEn: "System inventory",
    ownerTh: "โรงแรม / ผู้ให้บริการ",
    ownerEn: "Hotel / provider",
    actionTh: "ขอสิทธิ์เข้าถึงแล้วทำให้รายการระบบครบ",
    actionEn: "Request access and complete the system inventory",
  },
  {
    id: "no-owner",
    num: "05",
    titleTh: "ไม่มีผู้รับผิดชอบ",
    titleEn: "No owner",
    questionTh: "เมื่อข้อมูลผิด ยังไม่มีผู้รับผิดชอบที่ชัดหรือไม่?",
    questionEn: "Is there no clear owner when information is wrong?",
    status: "needs_review" as const,
    evidenceTh: "ช่อง Owner ว่าง",
    evidenceEn: "Owner field blank",
    ownerTh: "ยังไม่ระบุ",
    ownerEn: "Unassigned",
    actionTh: "กำหนดผู้รับผิดชอบแต่ละชุดข้อมูล",
    actionEn: "Assign an owner for each data set",
  },
  {
    id: "report-definitions",
    num: "06",
    titleTh: "นิยามรายงาน",
    titleEn: "Report definitions",
    questionTh: "รายงานมาจากหลายแหล่งและใช้นิยามไม่เหมือนกันหรือไม่?",
    questionEn: "Do reports come from multiple sources with different definitions?",
    status: "needs_review" as const,
    evidenceTh: "แหล่งรายงานแบบปกปิด",
    evidenceEn: "Redacted report sources",
    ownerTh: "รายได้ / การเงิน",
    ownerEn: "Revenue / finance",
    actionTh: "บันทึกนิยามและแหล่งของแต่ละรายงาน",
    actionEn: "Record the definition and source of each report",
  },
  {
    id: "no-test-process",
    num: "07",
    titleTh: "ไม่มีขั้นตอนทดสอบ",
    titleEn: "No test process",
    questionTh: "ระบบเชื่อมแล้ว แต่ยังไม่มี error handling หรือขั้นตอนทดสอบหรือไม่?",
    questionEn: "Is the system connected but missing error handling or a test process?",
    status: "not_configured" as const,
    evidenceTh: "Integration checklist",
    evidenceEn: "Integration checklist",
    ownerTh: "IT / ผู้ให้บริการ",
    ownerEn: "IT / provider",
    actionTh: "เพิ่มการจัดการข้อผิดพลาดและเคสทดสอบก่อน Go-live",
    actionEn: "Add error handling and a test case before go-live",
  },
  {
    id: "fail-contact",
    num: "08",
    titleTh: "ไม่รู้จะติดต่อใคร",
    titleEn: "No failure contact",
    questionTh: "เมื่อการเชื่อมต่อล้ม ทีมไม่รู้จะติดต่อใครหรือไม่?",
    questionEn: "Is it unclear who to contact when an integration fails?",
    status: "blocked" as const,
    evidenceTh: "ยังไม่มีเส้นทางติดต่อ",
    evidenceEn: "Contact path missing",
    ownerTh: "ยังไม่ระบุ",
    ownerEn: "Unassigned",
    actionTh: "ระบุผู้ติดต่อของโรงแรมและผู้ให้บริการเมื่อการเชื่อมต่อล้ม",
    actionEn: "Name the hotel and provider contacts for a failed integration",
  },
] as const;

export const SYSTEMS_REVIEW_COLUMNS = {
  question: { th: "คำถาม", en: "Question" },
  status: { th: "สถานะ", en: "Status" },
  evidence: { th: "หลักฐาน", en: "Evidence" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  action: { th: "ขั้นตอนถัดไปที่แนะนำ", en: "Recommended next action" },
} as const;

export function systemsAssessmentCmsRows() {
  return SYSTEMS_ASSESSMENT_ROWS.map((row) => ({
    id: row.id,
    num: row.num,
    titleTh: row.titleTh,
    titleEn: row.titleEn,
    questionTh: row.questionTh,
    questionEn: row.questionEn,
    symptomTh: "",
    symptomEn: "",
    supportTh: row.actionTh,
    supportEn: row.actionEn,
    output: row.evidenceEn,
    status: row.status,
    evidenceTh: row.evidenceTh,
    evidenceEn: row.evidenceEn,
    ownerTh: row.ownerTh,
    ownerEn: row.ownerEn,
    actionTh: row.actionTh,
    actionEn: row.actionEn,
  }));
}

export function systemsAssessmentRowsAreStale(rows: Array<{ id?: string; status?: string }>) {
  if (!rows.length) return true;
  return !rows.some((row) => row.id === "fail-contact" && String(row.status || "").trim());
}

export const SYSTEMS_OPERATING_FLOW = [
  { id: "pms", th: "PMS", en: "PMS" },
  { id: "cm", th: "Channel Manager", en: "Channel Manager" },
  { id: "be", th: "Booking Engine", en: "Booking Engine" },
  { id: "ota", th: "OTA", en: "OTA" },
  { id: "report", th: "Reporting", en: "Reporting" },
] as const;

export const SYSTEMS_SERVICE_FIELDS = {
  input: { th: "ข้อมูลเข้า", en: "Input" },
  action: { th: "การกระทำ", en: "Action" },
  output: { th: "ผลลัพธ์", en: "Output" },
  approval: { th: "จุดที่โรงแรมหรือผู้ให้บริการอนุมัติ", en: "Hotel or provider approval point" },
  owner: { th: "เจ้าของ / ผู้ให้บริการ", en: "Owner or provider" },
} as const;

export const SYSTEMS_WORKSTREAMS = [
  {
    id: "core",
    num: "01",
    titleTh: "PMS และโครงสร้างห้องพัก",
    titleEn: "PMS and room structure",
    bulletsTh: ["ประเภทห้อง", "จำนวนห้อง", "ราคา นโยบาย และข้อมูลหลัก"],
    bulletsEn: ["Room types", "Room count", "Rates, policy, and core facts"],
  },
  {
    id: "distribution",
    num: "02",
    titleTh: "Channel Manager และ OTA",
    titleEn: "Channel manager and OTAs",
    bulletsTh: ["จับคู่ห้องและ Rate Plan", "ส่งราคาและห้องว่าง", "ทดสอบการจองกลับมา"],
    bulletsEn: ["Room and rate-plan mapping", "Rate and availability push", "Booking return tests"],
  },
  {
    id: "direct",
    num: "03",
    titleTh: "Booking Engine รายงาน และทีม",
    titleEn: "Booking engine, reports, and team",
    bulletsTh: ["เส้นทางจองบนเว็บไซต์", "รายงานตามที่ระบบรองรับ", "อบรมจากงานจริง"],
    bulletsEn: ["Website booking path", "Reports the systems can support", "Training from real work"],
  },
] as const;

export const SYSTEMS_SERVICES = [
  {
    id: "pms",
    stream: "core",
    titleTh: "PMS และโครงสร้างห้องพัก",
    titleEn: "PMS and room structure",
    inputTh: "ระบบ PMS ที่ใช้อยู่ ประเภทห้อง จำนวนห้อง ราคา และนโยบาย",
    inputEn: "The current PMS, room types, room count, rates, and policy",
    actionTh: "จัดประเภทห้อง จำนวนห้อง ราคา นโยบาย และข้อมูลหลักที่ทีมต้องใช้",
    actionEn: "Set room types, room count, rates, policy, and the core facts the team needs",
    output: "Room structure map",
    approvalTh: "โรงแรมอนุมัติโครงสร้างห้องและนโยบาย งานอยู่ในสิทธิ์เข้าถึงที่มี",
    approvalEn: "The hotel approves room structure and policy. Work stays within the access the hotel has.",
    ownerTh: "โรงแรม / ผู้ให้บริการ PMS",
    ownerEn: "Hotel / PMS provider",
  },
  {
    id: "cm",
    stream: "distribution",
    titleTh: "Channel Manager และ OTA",
    titleEn: "Channel manager and OTAs",
    inputTh: "การจับคู่ห้อง Rate Plan ช่องทางขาย และสิทธิ์ผู้ให้บริการ",
    inputEn: "Room mapping, rate plans, selling channels, and provider access",
    actionTh: "ตรวจการจับคู่ การส่งราคาและห้องว่าง และทดสอบว่าข้อมูลและการจองกลับมาถูกต้อง",
    actionEn: "Review mapping, how rates and availability are sent, and test that facts and bookings come back correctly",
    output: "Channel mapping sheet",
    approvalTh: "งานเชื่อมต่อบางส่วนต้องดำเนินการหรืออนุมัติโดยผู้ให้บริการระบบ",
    approvalEn: "Some connection work has to be done or approved by the system provider",
    ownerTh: "โรงแรม / ผู้ให้บริการ Channel Manager",
    ownerEn: "Hotel / channel-manager provider",
  },
  {
    id: "be",
    stream: "direct",
    titleTh: "Booking Engine และการจองตรง",
    titleEn: "Booking engine and direct booking",
    inputTh: "ราคา แพ็กเกจ เงื่อนไข และเส้นทางจองบนเว็บไซต์",
    inputEn: "Rates, packages, conditions, and the website booking path",
    actionTh: "ดูราคา แพ็กเกจ เงื่อนไข และเส้นทางจอง เพื่อให้ข้อมูลที่ลูกค้าเห็นตรงกับสิ่งที่โรงแรมพร้อมขาย",
    actionEn: "Review rates, packages, conditions, and the booking path, so what the guest sees matches what the hotel can sell",
    output: "Booking-path test",
    approvalTh: "โรงแรมอนุมัติราคาและเงื่อนไขที่แสดงบนเว็บไซต์",
    approvalEn: "The hotel approves the rates and conditions shown on the website",
    ownerTh: "โรงแรม / เจ้าของเว็บไซต์",
    ownerEn: "Hotel / website owner",
  },
  {
    id: "reports",
    stream: "direct",
    titleTh: "รายงานที่ใช้ตัดสินใจ",
    titleEn: "Reports the team can decide from",
    inputTh: "รายงานที่มีอยู่และคำถามด้านยอดขายที่โรงแรมต้องใช้",
    inputEn: "Current reports and the sales questions the hotel needs",
    actionTh: "จัดข้อมูลจากระบบให้ทีมดูรายได้ อัตราเข้าพัก ราคาเฉลี่ย ยอดจองล่วงหน้า และผลงานแต่ละช่องทางตามข้อมูลที่ระบบรองรับ",
    actionEn: "Arrange system data so the team can see revenue, occupancy, average rate, future bookings, and each channel’s result, as far as the systems can support",
    output: "Report source note",
    approvalTh: "ไม่การันตีรายได้ Occupancy หรือ ADR และไม่ใช้ตัวเลขโรงแรมจนกว่าจะอนุมัติแหล่งข้อมูล",
    approvalEn: "Does not guarantee revenue, occupancy, or ADR, and does not publish hotel figures until the source is approved",
    ownerTh: "โรงแรม / การเงิน",
    ownerEn: "Hotel / finance",
  },
  {
    id: "training",
    stream: "direct",
    titleTh: "วิธีทำงานและการอบรมทีม",
    titleEn: "Ways of working and team training",
    inputTh: "ตำแหน่งงานปัจจุบัน และสถานการณ์ที่พนักงานเจอจริง",
    inputEn: "Current roles and the situations staff actually meet",
    actionTh: "กำหนดว่าใครเปลี่ยนราคา ใครตรวจการจอง ใครแก้ข้อมูลเมื่อเกิดปัญหา พร้อมอบรมจากสถานการณ์จริง",
    actionEn: "Agree who changes the rate, who checks bookings, and who fixes facts when something breaks, then train from real situations",
    output: "Role and test checklist",
    approvalTh: "โรงแรมอนุมัติผู้รับผิดชอบและขอบเขตการอบรม",
    approvalEn: "The hotel approves named owners and the training scope",
    ownerTh: "หัวหน้าแผนกโรงแรม",
    ownerEn: "Hotel department heads",
  },
] as const;

export const SYSTEMS_MODEL_STEPS = [
  { id: "source-of-truth", num: "01", label: "Source of Truth", titleTh: "แหล่งความจริง", titleEn: "Source of Truth", output: "Named candidate, confirmed per hotel" },
  { id: "mapped-data-flow", num: "02", label: "Mapped Data Flow", titleTh: "เส้นทางข้อมูลที่จับคู่แล้ว", titleEn: "Mapped Data Flow", output: "Room, rate, and availability map" },
  { id: "tested-integration", num: "03", label: "Tested Integration", titleTh: "การเชื่อมที่ทดสอบแล้ว", titleEn: "Tested Integration", output: "Tested behaviour in agreed scope" },
  { id: "clear-owner", num: "04", label: "Clear Owner", titleTh: "ผู้รับผิดชอบที่ชัด", titleEn: "Clear Owner", output: "Named owner for errors and next action" },
  { id: "operating-procedure", num: "05", label: "Operating Procedure", titleTh: "ขั้นตอนทำงาน", titleEn: "Operating Procedure", output: "Steps the team follows after go-live" },
  { id: "review", num: "06", label: "Review", titleTh: "ทบทวน", titleEn: "Review", output: "Scheduled review, not a one-time connect" },
] as const;

export const SYSTEMS_MODEL_BOUNDARY = {
  supportTitle: { th: "เดอะ เคพีไอ พลัส อาจช่วย", en: "The KPI Plus may support" },
  support: {
    th: "สำรวจระบบ จับคู่ข้อมูล ตั้งค่า ทดสอบ อบรม และส่งต่องาน ตามสิทธิ์เข้าถึง ความสามารถของแพลตฟอร์ม และขอบเขตที่ตกลง",
    en: "System inventory, data mapping, configuration, testing, training, and handover, within access, platform capability, and the agreed scope.",
  },
  hotelTitle: { th: "โรงแรมและผู้ให้บริการยังคงรับผิดชอบ", en: "The hotel and providers remain responsible for" },
  hotel: {
    th: "สัญญาไลเซนส์ สิทธิ์ API รหัสผ่าน ข้อมูลแขก การชำระเงิน บัญชีผู้ให้บริการ และการสื่อสารกับผู้ให้บริการระบบ",
    en: "Licences, API access, passwords, guest data, payments, provider accounts, and provider communication.",
  },
} as const;

export const SYSTEMS_DELIVERABLES_COLUMNS = {
  area: { th: "ด้านงาน", en: "Area" },
  inspect: { th: "สิ่งที่ต้องตรวจ", en: "What to check" },
  evidence: { th: "หลักฐาน", en: "Evidence" },
  status: { th: "สถานะปัจจุบัน", en: "Current status" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  action: { th: "งานถัดไป", en: "Next action" },
  output: { th: "ผลลัพธ์", en: "Output" },
  support: { th: "สิ่งที่ต้องตรวจ", en: "What to check" },
  deliverable: { th: "ผลลัพธ์", en: "Output" },
  approval: { th: "งานถัดไป", en: "Next action" },
} as const;

export const SYSTEMS_DELIVERABLES = [
  {
    id: "current-systems",
    areaTh: "ระบบที่มีอยู่",
    areaEn: "Current Systems",
    inspectTh: "รายการระบบ ผู้ให้บริการ วัตถุประสงค์ และผู้รับผิดชอบ",
    inspectEn: "System inventory, provider, purpose, and owner",
    evidenceTh: "รายการระบบและเจ้าของบัญชี",
    evidenceEn: "System list and account owner",
    output: "System Map",
    status: "needs_review" as const,
    ownerTh: "โรงแรม / งานปฏิบัติการ",
    ownerEn: "Hotel / operations",
    actionTh: "ลิสต์ระบบที่ใช้จริง ผู้ให้บริการ วัตถุประสงค์ และผู้รับผิดชอบ",
    actionEn: "List live systems, providers, purpose, and owners",
  },
  {
    id: "data-mapping",
    areaTh: "การจับคู่ข้อมูล",
    areaEn: "Data Mapping",
    inspectTh: "ฟิลด์ห้อง ราคา ห้องว่าง การจอง การยกเลิก และช่องทาง",
    inspectEn: "Room, rate, availability, reservation, cancellation, and channel fields",
    evidenceTh: "แผ่นจับคู่หรือเอกสารผู้ให้บริการ",
    evidenceEn: "Mapping sheet or provider documentation",
    output: "Data Dictionary and Mapping Plan",
    status: "not_configured" as const,
    ownerTh: "โรงแรม / งานนำไปใช้",
    ownerEn: "Hotel / implementation",
    actionTh: "ร่างแผ่นจับคู่จากเอกสารผู้ให้บริการและฟิลด์ที่ใช้จริง",
    actionEn: "Draft the mapping sheet from provider docs and live fields",
  },
  {
    id: "access",
    areaTh: "สิทธิ์เข้าถึง",
    areaEn: "Access",
    inspectTh: "ผู้ดูแลระบบ ผู้ติดต่อด้านเทคนิค และสิทธิ์ API หรือตัวเชื่อม",
    inspectEn: "Administrator, technical contact, and API or connector permission",
    evidenceTh: "รายการสิทธิ์ที่อนุมัติแล้ว",
    evidenceEn: "Approved access list",
    output: "Access Plan",
    status: "pending_access" as const,
    ownerTh: "โรงแรม / ผู้ให้บริการ",
    ownerEn: "Hotel / provider",
    actionTh: "ขอสิทธิ์ที่อนุมัติ โดยไม่ส่งรหัสผ่าน",
    actionEn: "Request approved access. Do not send a password",
  },
  {
    id: "integration",
    areaTh: "การเชื่อมระบบ",
    areaEn: "Integration",
    inspectTh: "การรองรับ API หรือตัวเชื่อม ข้อจำกัด ไลเซนส์ และการพึ่งพาผู้ให้บริการ",
    inspectEn: "API or connector support, limitations, licence, and provider dependency",
    evidenceTh: "เอกสารผู้ให้บริการและการยืนยัน",
    evidenceEn: "Provider documentation and confirmation",
    output: "Integration Plan",
    status: "requires_provider_support" as const,
    ownerTh: "โรงแรม / ผู้ให้บริการระบบ",
    ownerEn: "Hotel / system provider",
    actionTh: "ยืนยันตัวเชื่อม ไลเซนส์ และข้อจำกัดกับผู้ให้บริการ",
    actionEn: "Confirm connector support, licence, and limits with the provider",
  },
  {
    id: "testing",
    areaTh: "การทดสอบ",
    areaEn: "Testing",
    inspectTh: "เคสปกติ ข้อผิดพลาด ฟิลด์ขาด รายการซ้ำ และการยกเลิก",
    inspectEn: "Normal cases, errors, missing fields, duplicate records, and cancellations",
    evidenceTh: "เคสทดสอบและผลที่คาดหวัง",
    evidenceEn: "Test cases and expected results",
    output: "QA Report",
    status: "not_configured" as const,
    ownerTh: "โรงแรม / งานนำไปใช้",
    ownerEn: "Hotel / implementation",
    actionTh: "เขียนเคสทดสอบก่อน Go-live",
    actionEn: "Write test cases before go-live",
  },
  {
    id: "ownership",
    areaTh: "ความเป็นเจ้าของ",
    areaEn: "Ownership",
    inspectTh: "ผู้รับผิดชอบเมื่อข้อมูลผิดหรือการซิงค์ล้ม",
    inspectEn: "Owner when data is wrong or sync fails",
    evidenceTh: "RACI / รายชื่อผู้รับผิดชอบ",
    evidenceEn: "RACI / Owner List",
    output: "Handover Plan",
    status: "blocked" as const,
    ownerTh: "ยังไม่ระบุ",
    ownerEn: "Unassigned",
    actionTh: "ระบุผู้รับผิดชอบเมื่อข้อมูลผิดหรือการซิงค์ล้ม",
    actionEn: "Name the owner for data errors and failed syncs",
  },
] as const;

export function systemsReadinessCmsRows() {
  return SYSTEMS_DELIVERABLES.map((row) => ({
    id: row.id,
    areaTh: row.areaTh,
    areaEn: row.areaEn,
    inspectTh: row.inspectTh,
    inspectEn: row.inspectEn,
    evidenceTh: row.evidenceTh,
    evidenceEn: row.evidenceEn,
    status: row.status,
    ownerTh: row.ownerTh,
    ownerEn: row.ownerEn,
    actionTh: row.actionTh,
    actionEn: row.actionEn,
    output: row.output,
    supportTh: row.inspectTh,
    supportEn: row.inspectEn,
    deliverable: row.output,
    approvalTh: row.actionTh,
    approvalEn: row.actionEn,
  }));
}

export function systemsReadinessRowsAreStale(rows: Array<{ id?: string; status?: string }>) {
  if (!rows.length) return true;
  if (rows.some((row) => row.id === "configure" || row.id === "handover" || row.id === "inventory")) return true;
  return !rows.some((row) => row.id === "ownership" && String(row.status || "").trim());
}

export const SYSTEMS_DELIVERABLES_BOUNDARY = {
  supportTitle: { th: "เดอะ เคพีไอ พลัส อาจช่วย", en: "The KPI Plus may support" },
  supportItems: [
    { th: "สำรวจระบบ", en: "Systems inventory" },
    { th: "จับคู่ข้อมูล", en: "Data mapping" },
    { th: "ตั้งค่า", en: "Configuration" },
    { th: "ทดสอบ", en: "Testing" },
    { th: "อบรมและส่งมอบ", en: "Training and handover" },
  ],
  hotelTitle: { th: "โรงแรมยังรับผิดชอบ", en: "The hotel remains responsible" },
  hotelItems: [
    { th: "สัญญาและไลเซนส์ระบบ", en: "System contracts and licences" },
    { th: "สิทธิ์ API และรหัสผ่าน", en: "API access and passwords" },
    { th: "ข้อมูลแขกและการชำระเงิน", en: "Guest data and payments" },
    { th: "การสื่อสารกับผู้ให้บริการ", en: "Provider communication" },
    { th: "Website, PMS, Channel Manager, Booking Engine, Analytics, Hosting", en: "Website, PMS, channel manager, booking engine, analytics, hosting" },
  ],
} as const;

export const SYSTEMS_WORKFLOW_FIELDS = {
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  input: { th: "ข้อมูลเข้า", en: "Input" },
  action: { th: "การกระทำ", en: "Action" },
  output: { th: "ผลลัพธ์", en: "Output" },
  approval: { th: "จุดที่โรงแรมหรือผู้ให้บริการอนุมัติ", en: "Approval point" },
  dependency: { th: "ข้อจำกัดที่ต้องมีก่อน", en: "Dependency" },
  next: { th: "การตัดสินใจถัดไป", en: "Next decision" },
} as const;

export const SYSTEMS_WORKFLOW_GATE = {
  titleTh: "Go-live gate",
  titleEn: "Go-live gate",
  th: "การเริ่มใช้จริงต้องมีผลทดสอบที่อนุมัติแล้ว ผู้รับผิดชอบลงนาม ความพร้อมของผู้ให้บริการ และแผน rollback หรือแผนจัดการปัญหาเมื่อใช้ได้",
  en: "Go-live requires approved test results, owner sign-off, provider readiness, and a rollback or issue-handling plan where applicable.",
} as const;

export const SYSTEMS_WORKFLOW_APPROVALS = [
  { id: "test-results", th: "ผลทดสอบที่อนุมัติแล้ว", en: "Approved test results" },
  { id: "owner-signoff", th: "ผู้รับผิดชอบลงนาม", en: "Owner sign-off" },
  { id: "provider-ready", th: "ความพร้อมของผู้ให้บริการ", en: "Provider readiness" },
  { id: "rollback", th: "แผน rollback หรือแผนจัดการปัญหาเมื่อใช้ได้", en: "Rollback or issue-handling plan where applicable" },
] as const;

export const SYSTEMS_WORKFLOW = [
  {
    id: "discover",
    num: "01",
    label: "DISCOVER",
    titleTh: "สำรวจ",
    titleEn: "Discover",
    bodyTh: "รวบรวมรายการระบบ เป้าหมาย ผู้รับผิดชอบ ข้อกำหนด ข้อจำกัด และผู้ติดต่อของผู้ให้บริการ",
    bodyEn: "Collect System Inventory, goals, owners, requirements, constraints, and provider contacts.",
    ownerTh: "ที่ปรึกษา + โรงแรม",
    ownerEn: "Advisor + hotel",
    inputTh: "ชื่อระบบที่ใช้ ปัญหาที่พบ และผู้ติดต่อของผู้ให้บริการ",
    inputEn: "Current system names, known problems, and provider contacts",
    actionTh: "รวบรวมรายการระบบ เป้าหมาย ผู้รับผิดชอบ ข้อกำหนด ข้อจำกัด และผู้ติดต่อของผู้ให้บริการ",
    actionEn: "Collect System Inventory, goals, owners, requirements, constraints, and provider contacts",
    output: "System Inventory and Requirements Brief",
    approvalTh: "โรงแรมยืนยันรายการระบบและผู้รับผิดชอบ",
    approvalEn: "The hotel confirms the system inventory and named owners",
    dependencyTh: "โรงแรมระบุระบบ ผู้รับผิดชอบ และผู้ติดต่อของผู้ให้บริการ",
    dependencyEn: "The hotel names systems, owners, and provider contacts",
    nextTh: "ไปจับคู่ข้อมูล หรือหยุดถ้ายังสำรวจไม่ครบ",
    nextEn: "Proceed to mapping, or stop if the inventory is incomplete",
  },
  {
    id: "map",
    num: "02",
    label: "MAP",
    titleTh: "จับคู่",
    titleEn: "Map",
    bodyTh: "กำหนดสถาปัตยกรรมระบบ Source of Truth การจับคู่ฟิลด์ เส้นทางข้อมูล และสิ่งที่ต้องพึ่งพา",
    bodyEn: "Define System Architecture, Source of Truth, field mapping, data flow, and dependencies.",
    ownerTh: "ที่ปรึกษาร่าง / โรงแรมอนุมัติ",
    ownerEn: "Advisor drafts / hotel approves",
    inputTh: "System Inventory and Requirements Brief",
    inputEn: "System Inventory and Requirements Brief",
    actionTh: "กำหนดสถาปัตยกรรมระบบ Source of Truth การจับคู่ฟิลด์ เส้นทางข้อมูล และสิ่งที่ต้องพึ่งพา",
    actionEn: "Define System Architecture, Source of Truth, field mapping, data flow, and dependencies",
    output: "Architecture Diagram and Data Mapping",
    approvalTh: "โรงแรมอนุมัติ Source of Truth และการจับคู่ฟิลด์",
    approvalEn: "The hotel approves the Source of Truth and field mapping",
    dependencyTh: "เอกสารฟิลด์จากผู้ให้บริการ และโครงสร้างห้อง/ราคาที่ใช้จริง",
    dependencyEn: "Provider field documentation and the live room/rate structure",
    nextTh: "ตั้งค่าในระบบเดิม หรือระบุ Requires Provider Support",
    nextEn: "Configure in the current systems, or mark Requires Provider Support",
  },
  {
    id: "configure",
    num: "03",
    label: "CONFIGURE",
    titleTh: "ตั้งค่า",
    titleEn: "Configure",
    bodyTh: "ตั้งค่าตามที่อนุมัติ และประสานงานกับผู้ให้บริการภายในสิทธิ์เข้าถึงและขอบเขตงาน",
    bodyEn: "Configure approved settings and coordinate with providers within access and scope.",
    ownerTh: "ที่ปรึกษาในสิทธิ์ที่มี / ผู้ให้บริการถ้านอกสิทธิ์",
    ownerEn: "Advisor within access / provider if outside access",
    inputTh: "Architecture Diagram and Data Mapping ที่อนุมัติแล้ว",
    inputEn: "Approved Architecture Diagram and Data Mapping",
    actionTh: "ตั้งค่าตามที่อนุมัติ และประสานงานกับผู้ให้บริการภายในสิทธิ์เข้าถึงและขอบเขตงาน",
    actionEn: "Configure approved settings and coordinate with providers within access and scope",
    output: "Configuration/Integration Checklist",
    approvalTh: "งานที่อยู่นอกสิทธิ์ระบุเป็น Requires Provider Support",
    approvalEn: "Work outside current access is marked Requires Provider Support",
    dependencyTh: "สิทธิ์ที่อนุมัติ ไลเซนส์ และการยืนยันจากผู้ให้บริการ",
    dependencyEn: "Approved access, licence, and provider confirmation",
    nextTh: "เริ่มทดสอบ หรือรอ Pending Access / งานผู้ให้บริการ",
    nextEn: "Start testing, or wait for Pending Access or provider work",
  },
  {
    id: "test",
    num: "04",
    label: "TEST",
    titleTh: "ทดสอบ",
    titleEn: "Test",
    bodyTh: "ทดสอบงานปกติ การแก้ไข การยกเลิก ฟิลด์ที่ขาด ข้อผิดพลาด สิทธิ์ และการส่งต่อผู้ใช้",
    bodyEn: "Test normal flow, modifications, cancellations, missing fields, errors, permissions, and user handoff.",
    ownerTh: "ที่ปรึกษา + ทีมโรงแรม",
    ownerEn: "Advisor + hotel team",
    inputTh: "Configuration/Integration Checklist และช่องทางที่ตกลงทดสอบ",
    inputEn: "Configuration/Integration Checklist and the agreed test channels",
    actionTh: "ทดสอบงานปกติ การแก้ไข การยกเลิก ฟิลด์ที่ขาด ข้อผิดพลาด สิทธิ์ และการส่งต่อผู้ใช้",
    actionEn: "Test normal flow, modifications, cancellations, missing fields, errors, permissions, and user handoff",
    output: "Test Cases and QA Report",
    approvalTh: "โรงแรมยืนยันผลทดสอบในเคสที่ตกลง",
    approvalEn: "The hotel confirms the test result on the agreed cases",
    dependencyTh: "สิทธิ์เข้าถึง ฟิลด์ที่จับคู่แล้ว และพฤติกรรมตัวเชื่อมของผู้ให้บริการ",
    dependencyEn: "Access, mapped fields, and provider connector behaviour",
    nextTh: "ไปส่งมอบ หรือยังถูก Blocked จนกว่าเคสที่ล้มจะแก้",
    nextEn: "Proceed to handover, or remain Blocked until failed cases are resolved",
  },
  {
    id: "handover",
    num: "05",
    label: "HANDOVER",
    titleTh: "ส่งมอบ",
    titleEn: "Handover",
    bodyTh: "ส่งมอบเอกสาร SOP รายชื่อผู้รับผิดชอบ เส้นทางแก้ปัญหา และบันทึกการอนุมัติ",
    bodyEn: "Deliver documentation, SOP, owner list, troubleshooting path, and approval record.",
    ownerTh: "หัวหน้าแผนกโรงแรม",
    ownerEn: "Hotel department heads",
    inputTh: "Test Cases and QA Report",
    inputEn: "Test Cases and QA Report",
    actionTh: "ส่งมอบเอกสาร SOP รายชื่อผู้รับผิดชอบ เส้นทางแก้ปัญหา และบันทึกการอนุมัติ",
    actionEn: "Deliver documentation, SOP, owner list, troubleshooting path, and approval record",
    output: "Documentation, SOP, and Ownership Matrix",
    approvalTh: "โรงแรมรับมอบผู้รับผิดชอบและเส้นทางแจ้งปัญหา",
    approvalEn: "The hotel accepts named owners and the issue path",
    dependencyTh: "ผลทดสอบที่อนุมัติแล้ว และผู้รับผิดชอบที่ระบุชื่อได้",
    dependencyEn: "Approved test results and named owners",
    nextTh: "เริ่มใช้จริงได้เมื่อผ่าน Go-live gate เท่านั้น",
    nextEn: "Go-live only if the gate is met; otherwise keep the work in review",
  },
] as const;

export function systemsWorkflowCmsSteps() {
  return SYSTEMS_WORKFLOW.map((row) => ({
    id: row.id,
    num: row.num,
    label: row.label,
    titleTh: row.titleTh,
    titleEn: row.titleEn,
    bodyTh: row.bodyTh,
    bodyEn: row.bodyEn,
    ownerTh: row.ownerTh,
    ownerEn: row.ownerEn,
    inputTh: row.inputTh,
    inputEn: row.inputEn,
    actionTh: row.actionTh,
    actionEn: row.actionEn,
    output: row.output,
    approvalTh: row.approvalTh,
    approvalEn: row.approvalEn,
    dependencyTh: row.dependencyTh,
    dependencyEn: row.dependencyEn,
    nextTh: row.nextTh,
    nextEn: row.nextEn,
  }));
}

export function systemsWorkflowStepsAreStale(
  steps: Array<{ id?: string; output?: string; dependencyTh?: string; dependencyEn?: string }>,
) {
  if (!steps.length) return true;
  if (steps.some((step) => step.id === "audit" || step.id === "train" || step.id === "golive")) return true;
  if (steps.length !== SYSTEMS_WORKFLOW.length) return true;
  return !steps.some(
    (step) =>
      step.id === "discover" &&
      String(step.output || "").trim() &&
      (String(step.dependencyTh || "").trim() || String(step.dependencyEn || "").trim()),
  );
}

export const SYSTEMS_PLATFORM_STATUSES = [
  { id: "existing_client_system", label: "Existing", tone: "green" },
  { id: "example_category", label: "Example", tone: "muted" },
  { id: "supported_via_provider", label: "Supported via Provider/API", tone: "amber" },
  { id: "requires_verification", label: "Requires Verification", tone: "yellow" },
  { id: "not_yet_verified", label: "Requires Verification", tone: "yellow" },
  { id: "not_in_scope", label: "Not in Scope", tone: "muted" },
] as const;

export function systemsPlatformStatus(id?: string) {
  return SYSTEMS_PLATFORM_STATUSES.find((row) => row.id === id) || SYSTEMS_PLATFORM_STATUSES[4];
}

export const SYSTEMS_FIT_COLUMNS = {
  category: { th: "หมวด", en: "Category" },
  example: { th: "ตัวอย่างหรือระบบที่มีอยู่", en: "Example or existing system" },
  role: { th: "บทบาท", en: "Role" },
  flow: { th: "เส้นทางข้อมูลที่เป็นไปได้", en: "Possible data flow" },
  integration: { th: "สถานะการเชื่อมต่อ", en: "Integration status" },
  verification: { th: "สถานะการตรวจทางเทคนิค", en: "Technical verification status" },
  provider: { th: "สิ่งที่ต้องพึ่งผู้ให้บริการ", en: "Provider dependency" },
  situation: { th: "หมวด", en: "Category" },
  symptom: { th: "บทบาท", en: "Role" },
  question: { th: "เส้นทางข้อมูลที่เป็นไปได้", en: "Possible data flow" },
  support: { th: "สิ่งที่ต้องพึ่งผู้ให้บริการ", en: "Provider dependency" },
  output: { th: "ตัวอย่างหรือระบบที่มีอยู่", en: "Example or existing system" },
} as const;

export const SYSTEMS_FIT_SCENARIOS = [
  {
    id: "pms",
    categoryTh: "PMS / Property Management",
    categoryEn: "PMS / Property Management",
    example: "Cloudbeds, OPERA Cloud, Yanolja Cloud",
    logoSrc: "",
    roleTh: "แหล่งความจริงของห้อง ราคา และการจอง",
    roleEn: "Source of Truth for rooms, rates, and reservations",
    flowTh: "ห้อง ราคา ห้องว่าง การจอง และการยกเลิก",
    flowEn: "Room, rate, availability, reservation, and cancellation",
    integrationStatus: "example_category" as const,
    verificationStatus: "requires_verification" as const,
    providerTh: "ไลเซนส์ สิทธิ์ API หรือตัวเชื่อม และการอนุมัติผู้ให้บริการ",
    providerEn: "Licence, API or connector permission, and provider approval",
  },
  {
    id: "channel",
    categoryTh: "Channel Manager / Distribution",
    categoryEn: "Channel Manager / Distribution",
    example: "SiteMinder",
    logoSrc: "",
    roleTh: "กระจายห้องและราคาที่จับคู่แล้วไปยัง OTA",
    roleEn: "Distribute mapped rooms and rates to OTAs",
    flowTh: "ห้องว่าง ราคา ข้อจำกัด การจอง และการยกเลิก",
    flowEn: "Availability, rate, restriction, reservation, and cancellation",
    integrationStatus: "supported_via_provider" as const,
    verificationStatus: "not_yet_verified" as const,
    providerTh: "การจับคู่ช่องทางและตัวเชื่อมของผู้ให้บริการ",
    providerEn: "Channel mapping and the provider connector",
  },
  {
    id: "booking",
    categoryTh: "Booking Engine / Direct Booking",
    categoryEn: "Booking Engine / Direct Booking",
    example: "Hotel website booking engine",
    logoSrc: "",
    roleTh: "เส้นทางจองตรงจากเว็บไซต์ไปยังห้องว่าง",
    roleEn: "Direct booking path from the website to inventory",
    flowTh: "ห้องว่าง ราคา และการจอง ไม่รวมรหัสผ่านหรือข้อมูลชำระเงิน",
    flowEn: "Availability, rate, and reservation. Not passwords or payment data",
    integrationStatus: "example_category" as const,
    verificationStatus: "requires_verification" as const,
    providerTh: "ไลเซนส์ Booking Engine และตัวเชื่อมเว็บไซต์",
    providerEn: "Booking engine licence and website connector",
  },
  {
    id: "revenue",
    categoryTh: "Revenue / Rate Management",
    categoryEn: "Revenue / Rate Management",
    example: "Rate tools in the current stack",
    logoSrc: "",
    roleTh: "แผนราคาและเงื่อนไขการขาย",
    roleEn: "Rate plans and selling conditions",
    flowTh: "Rate Plan ข้อจำกัด และราคาตาม Occupancy",
    flowEn: "Rate plan, restriction, and occupancy-based rate",
    integrationStatus: "not_in_scope" as const,
    verificationStatus: "not_yet_verified" as const,
    providerTh: "โครงสร้างราคาของโรงแรม และผู้ให้บริการถ้านอกสิทธิ์",
    providerEn: "Hotel-owned rate structure, and the provider if outside access",
  },
  {
    id: "analytics",
    categoryTh: "Analytics / Reporting",
    categoryEn: "Analytics / Reporting",
    example: "PMS or channel reports",
    logoSrc: "",
    roleTh: "Occupancy ADR และผลงานช่องทาง ตามนิยามที่ตกลง",
    roleEn: "Occupancy, ADR, and channel pickup, using agreed definitions",
    flowTh: "การจอง Occupancy ช่องทาง และฟิลด์รายได้เท่าที่ระบบรองรับ",
    flowEn: "Reservation, occupancy, channel, and revenue fields as supported",
    integrationStatus: "example_category" as const,
    verificationStatus: "not_yet_verified" as const,
    providerTh: "การส่งออกหรือ API และนิยามรายงานที่ตกลง",
    providerEn: "Export or API, and agreed report definitions",
  },
  {
    id: "communication",
    categoryTh: "Communication / Guest Experience",
    categoryEn: "Communication / Guest Experience",
    example: "Guest messaging in the current stack",
    logoSrc: "",
    roleTh: "การสื่อสารกับแขกหลังมีการจอง",
    roleEn: "Guest communication after a booking",
    flowTh: "สถานะการจองและวันที่เข้าพัก ไม่รวมข้อมูลชำระเงิน",
    flowEn: "Reservation status and stay dates. Not payment data",
    integrationStatus: "not_in_scope" as const,
    verificationStatus: "not_yet_verified" as const,
    providerTh: "เครื่องมือของโรงแรมและสิทธิ์จากผู้ให้บริการ",
    providerEn: "Hotel-owned guest tools and provider permission",
  },
] as const;

export function systemsFitCmsRows() {
  return SYSTEMS_FIT_SCENARIOS.map((row) => ({
    id: row.id,
    categoryTh: row.categoryTh,
    categoryEn: row.categoryEn,
    example: row.example,
    logoSrc: row.logoSrc,
    roleTh: row.roleTh,
    roleEn: row.roleEn,
    flowTh: row.flowTh,
    flowEn: row.flowEn,
    integrationStatus: row.integrationStatus,
    verificationStatus: row.verificationStatus,
    logoStatus: "sample" as const,
    relationshipStatus: row.integrationStatus,
    providerTh: row.providerTh,
    providerEn: row.providerEn,
    situationTh: row.categoryTh,
    situationEn: row.categoryEn,
    symptomTh: row.roleTh,
    symptomEn: row.roleEn,
    questionTh: row.flowTh,
    questionEn: row.flowEn,
    supportTh: row.providerTh,
    supportEn: row.providerEn,
    output: row.example,
  }));
}

export function systemsFitRowsAreStale(
  rows: Array<{ id?: string; integrationStatus?: string; verificationStatus?: string; categoryEn?: string }>,
) {
  if (!rows.length) return true;
  if (rows.some((row) => row.id === "cloudbeds" || row.id === "siteminder" || row.id === "yanolja" || row.id === "opera" || row.id === "other")) {
    return true;
  }
  return !rows.some((row) => row.id === "pms" && String(row.integrationStatus || "").trim() && String(row.verificationStatus || "").trim());
}

export const SYSTEMS_FIT_NOT = [
  { id: "logo-wall", th: "โลโก้ไม่ใช่หลักฐานว่าเชื่อมต่อแล้ว และหน้านี้ไม่ใช่โลโก้วอลล์", en: "A logo wall is not proof of integration, and this page is not a logo wall." },
  { id: "endorsement", th: "ชื่อแพลตฟอร์มไม่ได้หมายถึงความร่วมมือ สปอนเซอร์ การรับรอง หรือการรับรองอย่างเป็นทางการ", en: "Platform names do not mean a partnership, sponsorship, certification, or official endorsement." },
  { id: "every-api", th: "ไม่ใช่ทุกแพลตฟอร์มเชื่อมกับทุกแพลตฟอร์มได้ และตัวอย่างต้องตรวจทางเทคนิคก่อน", en: "Not every platform can connect to every other platform. Examples are subject to technical verification." },
  { id: "secrets", th: "ไม่รับรหัสผ่าน คีย์ โทเคน หรือข้อมูลแขกทางฟอร์มนี้", en: "Do not send passwords, keys, tokens, or guest data through this form." },
] as const;

export const SYSTEMS_INVENTORY_ENVIRONMENTS = [
  { id: "production", label: "Production" },
  { id: "sandbox", label: "Sandbox" },
  { id: "unknown", label: "Unknown" },
] as const;

export const SYSTEMS_MAPPING_STATUSES = [
  { id: "needs_mapping", label: "Needs Mapping", tone: "yellow" },
  { id: "requires_provider_support", label: "Requires Provider Support", tone: "amber" },
  { id: "not_configured", label: "Not Configured", tone: "muted" },
  { id: "not_yet_verified", label: "Not yet verified", tone: "yellow" },
] as const;

export function systemsMappingStatus(id?: string) {
  return SYSTEMS_MAPPING_STATUSES.find((row) => row.id === id) || SYSTEMS_MAPPING_STATUSES[3];
}

export function systemsInventoryEnvironment(id?: string) {
  return SYSTEMS_INVENTORY_ENVIRONMENTS.find((row) => row.id === id) || SYSTEMS_INVENTORY_ENVIRONMENTS[2];
}

export const SYSTEMS_INVENTORY_LABELS = {
  sample: { th: "ข้อมูลตัวอย่าง", en: "Sample data" },
  replace: { th: "แทนที่ด้วยข้อมูลโรงแรมที่อนุมัติ", en: "Replace with approved hotel data" },
  verify: { th: "ขึ้นกับการตรวจของผู้ให้บริการ", en: "Subject to provider verification" },
} as const;

export const SYSTEMS_INVENTORY_COLUMNS = {
  system: { th: "ระบบ", en: "System" },
  provider: { th: "ผู้ให้บริการ", en: "Provider" },
  purpose: { th: "วัตถุประสงค์", en: "Purpose" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  dataIn: { th: "ข้อมูลเข้า", en: "Data In" },
  dataOut: { th: "ข้อมูลออก", en: "Data Out" },
  connector: { th: "API/Connector", en: "API/Connector" },
  environment: { th: "สภาพแวดล้อม", en: "Environment" },
  status: { th: "สถานะ", en: "Status" },
  reviewed: { th: "ตรวจล่าสุด", en: "Last reviewed" },
} as const;

export const SYSTEMS_DICTIONARY_COLUMNS = {
  field: { th: "ชื่อฟิลด์", en: "Field name" },
  meaning: { th: "ความหมายทางธุรกิจ", en: "Business meaning" },
  source: { th: "ระบบต้นทาง", en: "Source system" },
  destination: { th: "ระบบปลายทาง", en: "Destination system" },
  format: { th: "รูปแบบ/ชนิด", en: "Format/type" },
  required: { th: "จำเป็น/ไม่บังคับ", en: "Required/optional" },
  mapping: { th: "สถานะการจับคู่", en: "Mapping status" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  notes: { th: "หมายเหตุ", en: "Notes" },
} as const;

const SAMPLE_REVIEWED = "Sample — not a live review date";
const SAMPLE_CONNECTOR = "Sample API / connector";
const SAMPLE_OWNER = { th: "ยังไม่ระบุ — แทนที่ด้วยข้อมูลโรงแรมที่อนุมัติ", en: "Unassigned — replace with approved hotel data" };

export const SYSTEMS_INVENTORY_ROWS = [
  {
    id: "pms",
    systemTh: "PMS",
    systemEn: "PMS",
    providerTh: "ผู้ให้บริการ PMS ตัวอย่าง",
    providerEn: "Sample PMS provider",
    purposeTh: "แหล่งความจริงของห้อง ราคา และการจอง",
    purposeEn: "Source of Truth for rooms, rates, and reservations",
    ownerTh: SAMPLE_OWNER.th,
    ownerEn: SAMPLE_OWNER.en,
    dataInTh: "Sample Reservation Status",
    dataInEn: "Sample Reservation Status",
    dataOutTh: "Sample Room Type, Sample Rate Plan, Sample Availability",
    dataOutEn: "Sample Room Type, Sample Rate Plan, Sample Availability",
    connector: SAMPLE_CONNECTOR,
    environment: "unknown" as const,
    status: "needs_mapping" as const,
    reviewed: SAMPLE_REVIEWED,
  },
  {
    id: "channel",
    systemTh: "Channel Manager",
    systemEn: "Channel Manager",
    providerTh: "ผู้ให้บริการ Channel Manager ตัวอย่าง",
    providerEn: "Sample channel-manager provider",
    purposeTh: "กระจายห้องและราคาที่จับคู่แล้วไปยังช่องทางขาย",
    purposeEn: "Distribute mapped rooms and rates to selling channels",
    ownerTh: SAMPLE_OWNER.th,
    ownerEn: SAMPLE_OWNER.en,
    dataInTh: "Sample Room Type, Sample Rate Plan, Sample Availability",
    dataInEn: "Sample Room Type, Sample Rate Plan, Sample Availability",
    dataOutTh: "Sample Channel, Sample Reservation Status",
    dataOutEn: "Sample Channel, Sample Reservation Status",
    connector: SAMPLE_CONNECTOR,
    environment: "sandbox" as const,
    status: "pending_access" as const,
    reviewed: SAMPLE_REVIEWED,
  },
  {
    id: "booking",
    systemTh: "Booking Engine",
    systemEn: "Booking Engine",
    providerTh: "ผู้ให้บริการ Booking Engine ตัวอย่าง",
    providerEn: "Sample booking-engine provider",
    purposeTh: "เส้นทางจองตรงจากเว็บไซต์",
    purposeEn: "Direct booking path from the website",
    ownerTh: SAMPLE_OWNER.th,
    ownerEn: SAMPLE_OWNER.en,
    dataInTh: "Sample Availability, Sample Rate Plan",
    dataInEn: "Sample Availability, Sample Rate Plan",
    dataOutTh: "Sample Reservation Status",
    dataOutEn: "Sample Reservation Status",
    connector: SAMPLE_CONNECTOR,
    environment: "unknown" as const,
    status: "not_configured" as const,
    reviewed: SAMPLE_REVIEWED,
  },
  {
    id: "ota",
    systemTh: "OTA/Distribution",
    systemEn: "OTA/Distribution",
    providerTh: "ผู้ให้บริการช่องทางตัวอย่าง",
    providerEn: "Sample distribution provider",
    purposeTh: "รับจองจากช่องทางสาธารณะตามขอบเขตที่ตกลง",
    purposeEn: "Receive bookings from public channels within the agreed scope",
    ownerTh: SAMPLE_OWNER.th,
    ownerEn: SAMPLE_OWNER.en,
    dataInTh: "Sample Availability, Sample Rate Plan, Sample Channel",
    dataInEn: "Sample Availability, Sample Rate Plan, Sample Channel",
    dataOutTh: "Sample Reservation Status",
    dataOutEn: "Sample Reservation Status",
    connector: SAMPLE_CONNECTOR,
    environment: "unknown" as const,
    status: "requires_provider_support" as const,
    reviewed: SAMPLE_REVIEWED,
  },
  {
    id: "reporting",
    systemTh: "Reporting",
    systemEn: "Reporting",
    providerTh: "แหล่งรายงานตัวอย่าง",
    providerEn: "Sample reporting source",
    purposeTh: "สรุป Occupancy และช่องทางตามนิยามที่ตกลง",
    purposeEn: "Summarise occupancy and channel pickup using agreed definitions",
    ownerTh: SAMPLE_OWNER.th,
    ownerEn: SAMPLE_OWNER.en,
    dataInTh: "Sample Reservation Status, Sample Channel",
    dataInEn: "Sample Reservation Status, Sample Channel",
    dataOutTh: "Sample reports as supported",
    dataOutEn: "Sample reports as supported",
    connector: SAMPLE_CONNECTOR,
    environment: "sandbox" as const,
    status: "not_configured" as const,
    reviewed: SAMPLE_REVIEWED,
  },
  {
    id: "crm",
    systemTh: "CRM/Guest Communication",
    systemEn: "CRM/Guest Communication",
    providerTh: "เครื่องมือสื่อสารแขกตัวอย่าง",
    providerEn: "Sample guest-communication tool",
    purposeTh: "สื่อสารหลังการจอง โดยไม่ใช้ข้อมูลชำระเงิน",
    purposeEn: "Communication after booking, without payment data",
    ownerTh: SAMPLE_OWNER.th,
    ownerEn: SAMPLE_OWNER.en,
    dataInTh: "Sample Reservation Status",
    dataInEn: "Sample Reservation Status",
    dataOutTh: "Sample stay-date fields only",
    dataOutEn: "Sample stay-date fields only",
    connector: SAMPLE_CONNECTOR,
    environment: "unknown" as const,
    status: "not_configured" as const,
    reviewed: SAMPLE_REVIEWED,
  },
] as const;

export const SYSTEMS_DICTIONARY_ROWS = [
  {
    id: "room-type",
    field: "Sample Room Type",
    meaningTh: "หมวดห้องที่ใช้ขาย ไม่ใช่รหัสห้องจริง",
    meaningEn: "Selling room category. Not a live room ID",
    sourceTh: "PMS",
    sourceEn: "PMS",
    destinationTh: "Channel Manager",
    destinationEn: "Channel Manager",
    format: "text",
    required: "required",
    mappingStatus: "needs_mapping" as const,
    ownerTh: SAMPLE_OWNER.th,
    ownerEn: SAMPLE_OWNER.en,
    notesTh: "ขึ้นกับการตรวจของผู้ให้บริการ",
    notesEn: "Subject to provider verification",
  },
  {
    id: "rate-plan",
    field: "Sample Rate Plan",
    meaningTh: "แผนราคาที่ใช้ขาย ไม่ใช่ราคาจริงของโรงแรม",
    meaningEn: "Selling rate plan. Not a live hotel rate",
    sourceTh: "PMS",
    sourceEn: "PMS",
    destinationTh: "Booking Engine",
    destinationEn: "Booking Engine",
    format: "text",
    required: "required",
    mappingStatus: "needs_mapping" as const,
    ownerTh: SAMPLE_OWNER.th,
    ownerEn: SAMPLE_OWNER.en,
    notesTh: "แทนที่ด้วยข้อมูลโรงแรมที่อนุมัติ",
    notesEn: "Replace with approved hotel data",
  },
  {
    id: "availability",
    field: "Sample Availability",
    meaningTh: "จำนวนห้องว่างตามประเภท ไม่ใช่คลังห้องจริง",
    meaningEn: "Available count by room type. Not live inventory",
    sourceTh: "PMS",
    sourceEn: "PMS",
    destinationTh: "Channel Manager",
    destinationEn: "Channel Manager",
    format: "integer",
    required: "required",
    mappingStatus: "requires_provider_support" as const,
    ownerTh: SAMPLE_OWNER.th,
    ownerEn: SAMPLE_OWNER.en,
    notesTh: "ขึ้นกับการตรวจของผู้ให้บริการ",
    notesEn: "Subject to provider verification",
  },
  {
    id: "reservation-status",
    field: "Sample Reservation Status",
    meaningTh: "สถานะการจองตัวอย่าง เช่น confirmed หรือ cancelled",
    meaningEn: "Sample reservation status such as confirmed or cancelled",
    sourceTh: "Channel Manager",
    sourceEn: "Channel Manager",
    destinationTh: "PMS",
    destinationEn: "PMS",
    format: "enum",
    required: "required",
    mappingStatus: "not_yet_verified" as const,
    ownerTh: SAMPLE_OWNER.th,
    ownerEn: SAMPLE_OWNER.en,
    notesTh: "ไม่มีรหัสการจองหรือข้อมูลแขก",
    notesEn: "No booking ID or guest data",
  },
  {
    id: "channel",
    field: "Sample Channel",
    meaningTh: "ช่องทางขายตัวอย่าง ไม่ใช่บัญชี OTA จริง",
    meaningEn: "Sample selling channel. Not a live OTA account",
    sourceTh: "OTA/Distribution",
    sourceEn: "OTA/Distribution",
    destinationTh: "Reporting",
    destinationEn: "Reporting",
    format: "text",
    required: "optional",
    mappingStatus: "not_configured" as const,
    ownerTh: SAMPLE_OWNER.th,
    ownerEn: SAMPLE_OWNER.en,
    notesTh: "ข้อมูลตัวอย่าง แทนที่ด้วยข้อมูลโรงแรมที่อนุมัติ",
    notesEn: "Sample data. Replace with approved hotel data",
  },
] as const;

export function systemsInventoryCmsRows() {
  return SYSTEMS_INVENTORY_ROWS.map((row) => ({
    id: row.id,
    systemTh: row.systemTh,
    systemEn: row.systemEn,
    providerTh: row.providerTh,
    providerEn: row.providerEn,
    purposeTh: row.purposeTh,
    purposeEn: row.purposeEn,
    ownerTh: row.ownerTh,
    ownerEn: row.ownerEn,
    dataInTh: row.dataInTh,
    dataInEn: row.dataInEn,
    dataOutTh: row.dataOutTh,
    dataOutEn: row.dataOutEn,
    connector: row.connector,
    environment: row.environment,
    status: row.status,
    reviewed: row.reviewed,
    verified: false,
  }));
}

export function systemsDictionaryCmsRows() {
  return SYSTEMS_DICTIONARY_ROWS.map((row) => ({
    id: row.id,
    field: row.field,
    meaningTh: row.meaningTh,
    meaningEn: row.meaningEn,
    sourceTh: row.sourceTh,
    sourceEn: row.sourceEn,
    destinationTh: row.destinationTh,
    destinationEn: row.destinationEn,
    format: row.format,
    required: row.required,
    mappingStatus: row.mappingStatus,
    ownerTh: row.ownerTh,
    ownerEn: row.ownerEn,
    notesTh: row.notesTh,
    notesEn: row.notesEn,
  }));
}

export function systemsInventoryRowsAreStale(rows: Array<{ id?: string; environment?: string; status?: string }>) {
  if (!rows.length) return true;
  return !rows.some((row) => row.id === "pms" && String(row.environment || "").trim() && String(row.status || "").trim());
}

export function systemsDictionaryRowsAreStale(rows: Array<{ id?: string; field?: string }>) {
  if (!rows.length) return true;
  return !rows.some((row) => row.id === "room-type" && String(row.field || "").trim());
}

export const SYSTEMS_TESTING_STATUSES = [
  { id: "not_tested", label: "Not Tested", tone: "muted" },
  { id: "passed", label: "Passed", tone: "green" },
  { id: "failed", label: "Failed", tone: "red" },
  { id: "blocked", label: "Blocked", tone: "red" },
  { id: "requires_provider_support", label: "Requires Provider Support", tone: "amber" },
  { id: "retest_required", label: "Retest Required", tone: "yellow" },
] as const;

export const SYSTEMS_TESTING_SEVERITIES = [
  { id: "critical", label: "Critical" },
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
] as const;

export function systemsTestingStatus(id?: string) {
  return SYSTEMS_TESTING_STATUSES.find((row) => row.id === id) || SYSTEMS_TESTING_STATUSES[0];
}

export function systemsTestingSeverity(id?: string) {
  return SYSTEMS_TESTING_SEVERITIES.find((row) => row.id === id) || SYSTEMS_TESTING_SEVERITIES[2];
}

export function systemsTestingPassedIsSample(actual?: string, evidence?: string) {
  return /sample/i.test(`${actual || ""} ${evidence || ""}`);
}

export const SYSTEMS_TESTING_COLUMNS = {
  case: { th: "เคสทดสอบ", en: "Test case" },
  trigger: { th: "ตัวกระตุ้น/ข้อมูลเข้า", en: "Trigger/input" },
  expected: { th: "ผลที่คาดหวัง", en: "Expected result" },
  actual: { th: "ผลจริง", en: "Actual result" },
  status: { th: "สถานะ", en: "Status" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  evidence: { th: "หลักฐาน", en: "Evidence" },
  tested: { th: "วันที่ทดสอบ", en: "Tested date" },
  next: { th: "ปัญหา/งานถัดไป", en: "Issue/next action" },
} as const;

export const SYSTEMS_TESTING_ISSUE_FIELDS = {
  issue: { th: "คำอธิบายปัญหา", en: "Issue description" },
  severity: { th: "ความรุนแรง", en: "Severity" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  provider: { th: "การพึ่งพาผู้ให้บริการ", en: "Provider dependency" },
  next: { th: "งานถัดไป", en: "Next action" },
  retest: { th: "วันที่ทดสอบซ้ำ", en: "Retest date" },
} as const;

const QA_OWNER = { th: "ยังไม่ระบุ — แทนที่ด้วยข้อมูลโรงแรมที่อนุมัติ", en: "Unassigned — replace with approved hotel data" };
const QA_EVIDENCE = {
  th: "หลักฐานตัวอย่างเท่านั้น ไม่มีข้อมูลแขกหรือข้อมูลชำระเงิน",
  en: "Sample evidence only. No guest or payment data",
};
const QA_DATE = "Sample — not a live test date";
const QA_RETEST = "Sample — not a live retest date";
const QA_ACTUAL_OPEN = { th: "ยังไม่ทดสอบ — ข้อมูลตัวอย่าง", en: "Not tested — sample only" };

export const SYSTEMS_TESTING_ERROR_FLOW = [
  { id: "detect", num: "01", label: "Detect", th: "ตรวจพบ", en: "Detect" },
  { id: "log", num: "02", label: "Log", th: "บันทึก", en: "Log" },
  { id: "assign", num: "03", label: "Assign Owner", th: "ระบุผู้รับผิดชอบ", en: "Assign Owner" },
  { id: "notify", num: "04", label: "Notify", th: "แจ้งเตือน", en: "Notify" },
  { id: "correct", num: "05", label: "Correct", th: "แก้ไข", en: "Correct" },
  { id: "retest", num: "06", label: "Retest", th: "ทดสอบซ้ำ", en: "Retest" },
  { id: "close", num: "07", label: "Close", th: "ปิดงาน", en: "Close" },
] as const;

export const SYSTEMS_TESTING_CASES = [
  {
    id: "new-reservation",
    caseTh: "New reservation",
    caseEn: "New reservation",
    triggerTh: "สร้างการจองตัวอย่างจากช่องทางที่ตกลง",
    triggerEn: "Create a sample reservation from the agreed channel",
    expectedTh: "Sample Reservation Status ไปถึง PMS ตามการจับคู่",
    expectedEn: "Sample Reservation Status reaches the PMS according to the mapping",
    actualTh: QA_ACTUAL_OPEN.th,
    actualEn: QA_ACTUAL_OPEN.en,
    status: "not_tested" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "",
    issueEn: "",
    severity: "",
    providerTh: "",
    providerEn: "",
    nextTh: "รอสิทธิ์ทดสอบ",
    nextEn: "Waiting for test access",
    retestDate: "",
  },
  {
    id: "modification",
    caseTh: "Reservation modification",
    caseEn: "Reservation modification",
    triggerTh: "แก้ไขวันที่เข้าพักของการจองตัวอย่าง",
    triggerEn: "Change stay dates on a sample reservation",
    expectedTh: "PMS และ Channel Manager แสดงวันที่เดียวกัน",
    expectedEn: "PMS and Channel Manager show the same dates",
    actualTh: QA_ACTUAL_OPEN.th,
    actualEn: QA_ACTUAL_OPEN.en,
    status: "not_tested" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "",
    issueEn: "",
    severity: "",
    providerTh: "",
    providerEn: "",
    nextTh: "รอเคสทดสอบที่อนุมัติ",
    nextEn: "Waiting for an approved test case",
    retestDate: "",
  },
  {
    id: "cancellation",
    caseTh: "Cancellation",
    caseEn: "Cancellation",
    triggerTh: "ยกเลิกการจองตัวอย่าง",
    triggerEn: "Cancel a sample reservation",
    expectedTh: "สถานะ cancelled ส่งกลับและห้องว่างถูกคืน",
    expectedEn: "Cancelled status returns and availability is restored",
    actualTh: QA_ACTUAL_OPEN.th,
    actualEn: QA_ACTUAL_OPEN.en,
    status: "not_tested" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "",
    issueEn: "",
    severity: "",
    providerTh: "",
    providerEn: "",
    nextTh: "รอช่องทางทดสอบ",
    nextEn: "Waiting for a test channel",
    retestDate: "",
  },
  {
    id: "room-rate",
    caseTh: "Room or rate update",
    caseEn: "Room or rate update",
    triggerTh: "อัปเดต Sample Room Type หรือ Sample Rate Plan",
    triggerEn: "Update Sample Room Type or Sample Rate Plan",
    expectedTh: "ช่องทางขายได้รับค่าที่จับคู่แล้ว",
    expectedEn: "Selling channels receive the mapped values",
    actualTh: QA_ACTUAL_OPEN.th,
    actualEn: QA_ACTUAL_OPEN.en,
    status: "not_tested" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "",
    issueEn: "",
    severity: "",
    providerTh: "",
    providerEn: "",
    nextTh: "รอการจับคู่ห้องและราคา",
    nextEn: "Waiting for room and rate mapping",
    retestDate: "",
  },
  {
    id: "availability",
    caseTh: "Availability update",
    caseEn: "Availability update",
    triggerTh: "เปลี่ยน Sample Availability ใน PMS",
    triggerEn: "Change Sample Availability in the PMS",
    expectedTh: "Channel Manager แสดงจำนวนห้องว่างเดียวกัน",
    expectedEn: "Channel Manager shows the same available count",
    actualTh: QA_ACTUAL_OPEN.th,
    actualEn: QA_ACTUAL_OPEN.en,
    status: "not_tested" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "",
    issueEn: "",
    severity: "",
    providerTh: "",
    providerEn: "",
    nextTh: "รอสิทธิ์ Sandbox",
    nextEn: "Waiting for sandbox access",
    retestDate: "",
  },
  {
    id: "failed-sync",
    caseTh: "Failed sync",
    caseEn: "Failed sync",
    triggerTh: "จำลองการซิงค์ล้มจาก Channel Manager ไป PMS",
    triggerEn: "Simulate a failed sync from Channel Manager to PMS",
    expectedTh: "บันทึกข้อผิดพลาด มีผู้รับผิดชอบ และมีเส้นทางแจ้ง",
    expectedEn: "An error is logged, an owner is named, and a notify path exists",
    actualTh: "ตัวอย่าง: การซิงค์ล้ม และยังไม่มีผู้รับผิดชอบ",
    actualEn: "Sample: sync failed and no owner is assigned",
    status: "failed" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "ตัวอย่าง Failed sync — Channel Manager ไม่ส่ง Sample Reservation Status กลับ PMS",
    issueEn: "Sample failed sync — Channel Manager did not return Sample Reservation Status to the PMS",
    severity: "high",
    providerTh: "ตัวเชื่อม Channel Manager ตัวอย่าง",
    providerEn: "Sample channel-manager connector",
    nextTh: "ระบุผู้รับผิดชอบ แจ้งผู้ให้บริการ แก้ไข แล้วทดสอบซ้ำ",
    nextEn: "Assign owner, notify provider, correct, then retest",
    retestDate: QA_RETEST,
  },
  {
    id: "duplicate",
    caseTh: "Duplicate record",
    caseEn: "Duplicate record",
    triggerTh: "ส่งการจองตัวอย่างซ้ำในช่องทางเดียวกัน",
    triggerEn: "Submit the same sample reservation twice on one channel",
    expectedTh: "ระบบไม่สร้างรายการซ้ำ หรือทำเครื่องหมายซ้ำได้",
    expectedEn: "The system does not create a duplicate, or it flags the duplicate",
    actualTh: "ตัวอย่าง: พบรายการซ้ำ ต้องทดสอบซ้ำหลังแก้",
    actualEn: "Sample: a duplicate was found. Retest after correction",
    status: "retest_required" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "ตัวอย่างรายการซ้ำของ Sample Reservation Status",
    issueEn: "Sample duplicate of Sample Reservation Status",
    severity: "medium",
    providerTh: "กฎการจับคู่ของผู้ให้บริการตัวอย่าง",
    providerEn: "Sample provider matching rule",
    nextTh: "แก้กฎรายการซ้ำ แล้วทดสอบซ้ำ",
    nextEn: "Correct the duplicate rule, then retest",
    retestDate: QA_RETEST,
  },
  {
    id: "missing-field",
    caseTh: "Missing field",
    caseEn: "Missing field",
    triggerTh: "ส่งการจองตัวอย่างโดยไม่มี Sample Rate Plan",
    triggerEn: "Send a sample reservation without Sample Rate Plan",
    expectedTh: "ระบบปฏิเสธหรือบันทึกฟิลด์ที่ขาด และไม่สร้างข้อมูลแขก",
    expectedEn: "The system rejects or logs the missing field, and does not create guest data",
    actualTh: "ตัวอย่าง: ถูก Blocked จนกว่าจะจับคู่ฟิลด์",
    actualEn: "Sample: blocked until the field is mapped",
    status: "blocked" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "Sample Rate Plan ยังไม่ถูกจับคู่ จึงทดสอบต่อไม่ได้",
    issueEn: "Sample Rate Plan is not mapped, so testing cannot continue",
    severity: "high",
    providerTh: "เอกสารฟิลด์ PMS ตัวอย่าง",
    providerEn: "Sample PMS field documentation",
    nextTh: "จับคู่ฟิลด์ที่ขาด แล้วเปิดเคสใหม่",
    nextEn: "Map the missing field, then reopen the case",
    retestDate: QA_RETEST,
  },
  {
    id: "wrong-mapping",
    caseTh: "Wrong mapping",
    caseEn: "Wrong mapping",
    triggerTh: "ส่ง Sample Room Type ไปยังช่องทางขาย",
    triggerEn: "Send Sample Room Type to a selling channel",
    expectedTh: "ช่องทางได้รับห้องที่จับคู่ถูกต้อง",
    expectedEn: "The channel receives the correctly mapped room",
    actualTh: "ตัวอย่าง: ต้องพึ่งผู้ให้บริการเพื่อแก้การจับคู่",
    actualEn: "Sample: provider support is required to correct the mapping",
    status: "requires_provider_support" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "Sample Room Type ไปไม่ตรงช่องทาง ต้องให้ผู้ให้บริการตรวจ",
    issueEn: "Sample Room Type does not match the channel. Provider must verify",
    severity: "high",
    providerTh: "การจับคู่ห้องของผู้ให้บริการตัวอย่าง",
    providerEn: "Sample provider room mapping",
    nextTh: "ส่งให้ผู้ให้บริการแก้การจับคู่ แล้วทดสอบซ้ำ",
    nextEn: "Ask the provider to correct mapping, then retest",
    retestDate: QA_RETEST,
  },
  {
    id: "permission",
    caseTh: "Permission error",
    caseEn: "Permission error",
    triggerTh: "เรียก Sample API / connector โดยไม่มีสิทธิ์ที่อนุมัติ",
    triggerEn: "Call a Sample API / connector without approved access",
    expectedTh: "ระบบบันทึก Permission error และไม่รับรหัสผ่าน",
    expectedEn: "The system logs a permission error and does not accept a password",
    actualTh: "ตัวอย่าง: Pending Access / Requires Provider Support",
    actualEn: "Sample: Pending Access / Requires Provider Support",
    status: "requires_provider_support" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "ยังไม่มีสิทธิ์ API ที่อนุมัติ ไม่ส่งรหัสผ่านในหลักฐาน",
    issueEn: "Approved API access is missing. Do not store a password in evidence",
    severity: "critical",
    providerTh: "สิทธิ์ API ของผู้ให้บริการตัวอย่าง",
    providerEn: "Sample provider API permission",
    nextTh: "ขอสิทธิ์ที่อนุมัติ แล้วทดสอบซ้ำ",
    nextEn: "Request approved access, then retest",
    retestDate: QA_RETEST,
  },
  {
    id: "booking-handoff",
    caseTh: "Booking Engine handoff",
    caseEn: "Booking Engine handoff",
    triggerTh: "จองตัวอย่างจาก Booking Engine ของเว็บไซต์",
    triggerEn: "Create a sample booking from the website booking engine",
    expectedTh: "การจองไปถึง PMS โดยไม่ส่งข้อมูลชำระเงินในหลักฐาน",
    expectedEn: "The booking reaches the PMS. Evidence does not include payment data",
    actualTh: QA_ACTUAL_OPEN.th,
    actualEn: QA_ACTUAL_OPEN.en,
    status: "not_tested" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "",
    issueEn: "",
    severity: "",
    providerTh: "",
    providerEn: "",
    nextTh: "รอตัวเชื่อม Booking Engine",
    nextEn: "Waiting for the booking-engine connector",
    retestDate: "",
  },
  {
    id: "confirmation",
    caseTh: "Confirmation/notification",
    caseEn: "Confirmation/notification",
    triggerTh: "การจองตัวอย่างมีสถานะ confirmed",
    triggerEn: "A sample reservation reaches confirmed status",
    expectedTh: "มีการแจ้งยืนยันตามขอบเขต โดยไม่แสดงข้อมูลแขก",
    expectedEn: "A confirmation is sent within scope, without showing guest data",
    actualTh: QA_ACTUAL_OPEN.th,
    actualEn: QA_ACTUAL_OPEN.en,
    status: "not_tested" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: QA_EVIDENCE.th,
    evidenceEn: QA_EVIDENCE.en,
    testedDate: QA_DATE,
    issueTh: "",
    issueEn: "",
    severity: "",
    providerTh: "",
    providerEn: "",
    nextTh: "รอเทมเพลตการแจ้งที่อนุมัติ",
    nextEn: "Waiting for an approved notification template",
    retestDate: "",
  },
  {
    id: "report-reconciliation",
    caseTh: "Report reconciliation",
    caseEn: "Report reconciliation",
    triggerTh: "เทียบ Occupancy ตัวอย่างจาก PMS กับรายงานช่องทาง",
    triggerEn: "Compare sample occupancy from the PMS with a channel report",
    expectedTh: "นิยามรายงานตรงกันตามที่ตกลง ไม่มีตัวเลขรายได้จริง",
    expectedEn: "Report definitions match the agreed rules. No live revenue figures",
    actualTh: "Sample — not a live pass. นิยาม Occupancy ตรงกันในข้อมูลตัวอย่าง",
    actualEn: "Sample — not a live pass. Occupancy definitions match in the sample data",
    status: "passed" as const,
    ownerTh: QA_OWNER.th,
    ownerEn: QA_OWNER.en,
    evidenceTh: "ป้าย Sample เท่านั้น ไม่มีข้อมูลแขกหรือข้อมูลชำระเงิน",
    evidenceEn: "Sample label only. No guest or payment data",
    testedDate: QA_DATE,
    issueTh: "",
    issueEn: "",
    severity: "",
    providerTh: "",
    providerEn: "",
    nextTh: "แทนที่ด้วยผลทดสอบโรงแรมที่อนุมัติ",
    nextEn: "Replace with an approved hotel test result",
    retestDate: "",
  },
] as const;

export function systemsTestingCmsCases() {
  return SYSTEMS_TESTING_CASES.map((row) => ({
    id: row.id,
    caseTh: row.caseTh,
    caseEn: row.caseEn,
    triggerTh: row.triggerTh,
    triggerEn: row.triggerEn,
    expectedTh: row.expectedTh,
    expectedEn: row.expectedEn,
    actualTh: row.actualTh,
    actualEn: row.actualEn,
    status: row.status,
    ownerTh: row.ownerTh,
    ownerEn: row.ownerEn,
    evidenceTh: row.evidenceTh,
    evidenceEn: row.evidenceEn,
    testedDate: row.testedDate,
    issueTh: row.issueTh,
    issueEn: row.issueEn,
    severity: row.severity,
    providerTh: row.providerTh,
    providerEn: row.providerEn,
    nextTh: row.nextTh,
    nextEn: row.nextEn,
    retestDate: row.retestDate,
  }));
}

export function systemsTestingErrorCmsSteps() {
  return SYSTEMS_TESTING_ERROR_FLOW.map((row) => ({
    id: row.id,
    th: row.th,
    en: row.en,
  }));
}

export function systemsTestingCasesAreStale(
  rows: Array<{ id?: string; status?: string; actualEn?: string; actualTh?: string; evidenceEn?: string; evidenceTh?: string }>,
) {
  if (!rows.length) return true;
  const hasNew = rows.some((row) => row.id === "new-reservation" && String(row.status || "").trim());
  const failed = rows.find((row) => row.id === "failed-sync");
  if (!hasNew || !failed || String(failed.status || "") !== "failed") return true;
  const passed = rows.find((row) => row.id === "report-reconciliation");
  if (passed && String(passed.status || "") === "passed") {
    return !systemsTestingPassedIsSample(
      `${passed.actualEn || ""} ${passed.actualTh || ""}`,
      `${passed.evidenceEn || ""} ${passed.evidenceTh || ""}`,
    );
  }
  return false;
}

export const SYSTEMS_SCOPE_ROWS = [
  {
    id: "support",
    titleTh: "เดอะ เคพีไอ พลัสอาจช่วย ตามขอบเขตที่ตกลง",
    titleEn: "The KPI Plus may support, subject to agreed scope",
    itemsTh: [
      "Current-system discovery",
      "System Architecture",
      "Data Mapping framework",
      "Implementation Plan",
      "Provider coordination",
      "Configuration checklist",
      "Test Cases",
      "QA and handover documentation",
      "Ownership and SOP design",
    ],
    itemsEn: [
      "Current-system discovery",
      "System Architecture",
      "Data Mapping framework",
      "Implementation Plan",
      "Provider coordination",
      "Configuration checklist",
      "Test Cases",
      "QA and handover documentation",
      "Ownership and SOP design",
    ],
  },
  {
    id: "hotel",
    titleTh: "โรงแรมหรือผู้ให้บริการภายนอกยังรับผิดชอบ",
    titleEn: "The hotel or external provider remains responsible",
    itemsTh: [
      "License and subscription fees",
      "API access and technical permissions",
      "Security policy and compliance",
      "Payment and transaction processing",
      "Availability and rate data owned by the provider",
      "Data processing agreements",
      "External provider fixes",
      "Final Go-live approval",
      "Operational ownership after handover",
    ],
    itemsEn: [
      "License and subscription fees",
      "API access and technical permissions",
      "Security policy and compliance",
      "Payment and transaction processing",
      "Availability and rate data owned by the provider",
      "Data processing agreements",
      "External provider fixes",
      "Final Go-live approval",
      "Operational ownership after handover",
    ],
  },
] as const;

export const SYSTEMS_SCOPE_COLUMNS = {
  event: { th: "กิจกรรม/เหตุการณ์", en: "Activity/event" },
  hotel: { th: "ทีมโรงแรม", en: "Hotel team" },
  provider: { th: "ผู้ให้บริการ", en: "Provider" },
  implementation: { th: "ทีมนำไปใช้", en: "Implementation team" },
  approval: { th: "ต้องอนุมัติ", en: "Approval required" },
  escalation: { th: "เส้นทางยกระดับ", en: "Escalation path" },
} as const;

export const SYSTEMS_SCOPE_BOUNDARY = {
  th: "เดอะ เคพีไอ พลัสไม่ได้เป็นเจ้าของ PMS, Channel Manager, Booking Engine หรือบัญชี OTA และไม่การันตีพฤติกรรมของผู้ให้บริการภายนอก งานสนับสนุนขึ้นกับขอบเขตที่ตกลง",
  en: "The KPI Plus does not own the PMS, channel manager, booking engine, or OTA accounts, and does not guarantee an external provider's behaviour. Support is subject to the agreed scope.",
};

export const SYSTEMS_RESPONSIBILITY_MATRIX = [
  {
    id: "rate-mismatch",
    eventTh: "Rate mismatch",
    eventEn: "Rate mismatch",
    hotelTh: "ยืนยันราคาขายและ Sample Rate Plan ที่อนุมัติ",
    hotelEn: "Confirm the selling rate and the approved Sample Rate Plan",
    providerTh: "แก้ราคาในช่องทางถ้าอยู่นอกสิทธิ์ของทีมนำไปใช้",
    providerEn: "Correct the channel rate if it is outside implementation access",
    implTh: "เทียบ Sample Rate Plan ที่จับคู่แล้ว และบันทึกช่องว่าง ตามขอบเขตที่ตกลง",
    implEn: "Compare the mapped Sample Rate Plan and log the gap, within the agreed scope",
    approvalTh: "เจ้าของงานเชิงพาณิชย์ของโรงแรม",
    approvalEn: "Hotel commercial owner",
    escalationTh: "โรงแรม → ทีมนำไปใช้ → ผู้ให้บริการ",
    escalationEn: "Hotel → Implementation team → Provider",
  },
  {
    id: "booking-missing",
    eventTh: "Booking not arriving in PMS",
    eventEn: "Booking not arriving in PMS",
    hotelTh: "ยืนยันว่ามีการจองตัวอย่างเกิดขึ้น",
    hotelEn: "Confirm that the sample booking was created",
    providerTh: "สถานะตัวเชื่อมหรือ API",
    providerEn: "Connector or API status",
    implTh: "ติดตาม Sample Reservation Status ตามการจับคู่ ไม่ได้เป็นเจ้าของ PMS",
    implEn: "Trace Sample Reservation Status against the mapping. The KPI Plus does not own the PMS",
    approvalTh: "เจ้าของงานปฏิบัติการของโรงแรม ถ้ากระทบ Go-live",
    approvalEn: "Hotel operations owner if Go-live is affected",
    escalationTh: "ทีมนำไปใช้ → ผู้ให้บริการ",
    escalationEn: "Implementation team → Provider",
  },
  {
    id: "api-expired",
    eventTh: "API permission expired",
    eventEn: "API permission expired",
    hotelTh: "ขอสิทธิ์ใหม่ที่อนุมัติ ไม่ส่งรหัสผ่าน",
    hotelEn: "Request renewed approved access. Do not send a password",
    providerTh: "ให้สิทธิ์ API ตามสัญญา",
    providerEn: "Grant API permission under the hotel contract",
    implTh: "ทำเครื่องหมาย Pending Access หรือ Requires Provider Support",
    implEn: "Mark Pending Access or Requires Provider Support",
    approvalTh: "โรงแรมและผู้ให้บริการ",
    approvalEn: "Hotel and provider",
    escalationTh: "เจ้าของสัญญาโรงแรม → ผู้ให้บริการ",
    escalationEn: "Hotel contract owner → Provider",
  },
  {
    id: "duplicate",
    eventTh: "Duplicate reservation",
    eventEn: "Duplicate reservation",
    hotelTh: "ยืนยันว่ารายการใดเป็นรายการที่ใช้",
    hotelEn: "Confirm which record should be kept",
    providerTh: "กฎการจับคู่ถ้าเป็นของระบบผู้ให้บริการ",
    providerEn: "Matching rule if it is owned by the provider system",
    implTh: "บันทึกรายการซ้ำ และทดสอบซ้ำหลังมีการแก้ไข",
    implEn: "Log the duplicate and retest after a correction",
    approvalTh: "เจ้าของงานปฏิบัติการของโรงแรม",
    approvalEn: "Hotel operations owner",
    escalationTh: "ทีมนำไปใช้ → ผู้ให้บริการ",
    escalationEn: "Implementation team → Provider",
  },
  {
    id: "report-mismatch",
    eventTh: "Report definition mismatch",
    eventEn: "Report definition mismatch",
    hotelTh: "อนุมัตินิยาม Occupancy หรือช่องทางที่ใช้ทบทวน",
    hotelEn: "Approve the Occupancy or channel definition used in review",
    providerTh: "ฟิลด์รายงานหรือการส่งออกตามที่ระบบรองรับ",
    providerEn: "Report fields or export as the system supports",
    implTh: "บันทึกนิยามที่ตกลง ไม่ใช่ผลรายได้ที่การันตี",
    implEn: "Document the agreed definition. Not a guaranteed revenue result",
    approvalTh: "เจ้าของงานเชิงพาณิชย์ของโรงแรม",
    approvalEn: "Hotel commercial owner",
    escalationTh: "โรงแรม → ทีมนำไปใช้",
    escalationEn: "Hotel → Implementation team",
  },
  {
    id: "provider-outage",
    eventTh: "Provider outage",
    eventEn: "Provider outage",
    hotelTh: "ใช้แนวทางปฏิบัติการสำรองของโรงแรม",
    hotelEn: "Use the hotel operational workaround",
    providerTh: "กู้คืนบริการ โรงแรมเป็นผู้ถือสัญญา",
    providerEn: "Restore the service. The hotel holds the provider contract",
    implTh: "บันทึกเหตุการณ์ ไม่การันตีเวลาทำงานของผู้ให้บริการ",
    implEn: "Log the outage. The KPI Plus does not guarantee provider uptime",
    approvalTh: "ไม่ใช้แทนการกู้คืนของผู้ให้บริการ",
    approvalEn: "Not a substitute for provider restoration",
    escalationTh: "โรงแรม → ฝ่ายสนับสนุนผู้ให้บริการ",
    escalationEn: "Hotel → Provider support",
  },
  {
    id: "go-live",
    eventTh: "Go-live approval",
    eventEn: "Go-live approval",
    hotelTh: "อนุมัติเริ่มใช้จริงครั้งสุดท้าย",
    hotelEn: "Give final Go-live approval",
    providerTh: "ยืนยันความพร้อมของตัวเชื่อมตามสัญญา",
    providerEn: "Confirm connector readiness under the hotel contract",
    implTh: "ส่งผลทดสอบและรายการที่ยังเปิดอยู่ ไม่ได้อนุมัติ Go-live แทนโรงแรม",
    implEn: "Present test results and open items. Does not approve Go-live for the hotel",
    approvalTh: "โรงแรมต้องอนุมัติ",
    approvalEn: "Hotel approval is required",
    escalationTh: "เจ้าของโรงแรมหรือ GM",
    escalationEn: "Hotel owner or GM",
  },
] as const;

export function systemsScopeCmsRows() {
  return SYSTEMS_SCOPE_ROWS.map((row) => ({
    id: row.id,
    titleTh: row.titleTh,
    titleEn: row.titleEn,
    itemsTh: row.itemsTh.join("\n"),
    itemsEn: row.itemsEn.join("\n"),
  }));
}

export function systemsResponsibilityCmsRows() {
  return SYSTEMS_RESPONSIBILITY_MATRIX.map((row) => ({
    id: row.id,
    eventTh: row.eventTh,
    eventEn: row.eventEn,
    hotelTh: row.hotelTh,
    hotelEn: row.hotelEn,
    providerTh: row.providerTh,
    providerEn: row.providerEn,
    implTh: row.implTh,
    implEn: row.implEn,
    approvalTh: row.approvalTh,
    approvalEn: row.approvalEn,
    escalationTh: row.escalationTh,
    escalationEn: row.escalationEn,
    ownerTh: row.hotelTh,
    ownerEn: row.hotelEn,
    status: "documented_sample",
  }));
}

export function systemsScopeRowsAreStale(rows: Array<{ id?: string; itemsEn?: string; itemsTh?: string }>) {
  if (!rows.length) return true;
  return !rows.some((row) => row.id === "support" && /System Architecture|Data Mapping framework/i.test(`${row.itemsEn || ""} ${row.itemsTh || ""}`));
}

export function systemsResponsibilityRowsAreStale(rows: Array<{ id?: string; eventEn?: string }>) {
  if (!rows.length) return true;
  return !rows.some((row) => row.id === "rate-mismatch" && String(row.eventEn || "").trim());
}

const HANDOVER_LIVE_RE = /^(live|handed[_-]?over|handed over|complete|production|go[_-]?live)$/i;
const HANDOVER_OWNER = {
  th: "ยังไม่ระบุ — แทนที่ด้วยเจ้าของโรงแรมที่อนุมัติ",
  en: "Unassigned — replace with the approved hotel owner",
};
const HANDOVER_EVIDENCE = {
  th: "แฟ้มตัวอย่าง — ไม่ใช่ไฟล์ลูกค้าจริง และไม่มีรหัสผ่าน",
  en: "Sample pack — not a live client file, and no password",
};
const HANDOVER_REVIEWED = "Sample — not a live review date";
const HANDOVER_CONTACT = {
  th: "บทบาทติดต่อตัวอย่าง ไม่ใช่รหัสผ่านหรือคีย์ API",
  en: "Sample contact role. Not a password or API key",
};

export const SYSTEMS_HANDOVER_CHECKLIST_STATUSES = [
  { id: "not_started", label: "Not started", tone: "muted" },
  { id: "in_progress", label: "In progress", tone: "testing" },
  { id: "awaiting_signoff", label: "Awaiting hotel sign-off", tone: "amber" },
  { id: "awaiting_provider", label: "Awaiting provider", tone: "amber" },
  { id: "incomplete", label: "Incomplete", tone: "red" },
  { id: "blocked", label: "Blocked", tone: "red" },
  { id: "documented_sample", label: "Documented — Sample", tone: "yellow" },
] as const;

export const SYSTEMS_OWNERSHIP_STATUSES = [
  { id: "not_handed_over", label: "Not handed over", tone: "muted" },
  { id: "pending_approval", label: "Pending approval", tone: "amber" },
  { id: "documentation_incomplete", label: "Documentation incomplete", tone: "red" },
  { id: "owner_assigned_sample", label: "Owner assigned — Sample", tone: "yellow" },
] as const;

export const SYSTEMS_HANDOVER_CHECKLIST_COLUMNS = {
  item: { th: "รายการ", en: "Item" },
  status: { th: "สถานะ", en: "Status" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  evidence: { th: "หลักฐาน", en: "Evidence" },
} as const;

export const SYSTEMS_OWNERSHIP_COLUMNS = {
  asset: { th: "ระบบ/สินทรัพย์", en: "System/asset" },
  owner: { th: "เจ้าของ", en: "Owner" },
  contact: { th: "ผู้ติดต่อด้านเทคนิค/แอดมิน", en: "Admin/technical contact" },
  approval: { th: "ผู้มีอำนาจอนุมัติ", en: "Approval authority" },
  access: { th: "ระดับสิทธิ์", en: "Access level" },
  renewal: { th: "ผู้รับผิดชอบต่ออายุ/หมดอายุ", en: "Renewal/expiry responsibility" },
  reviewed: { th: "ตรวจล่าสุด", en: "Last reviewed" },
} as const;

export const SYSTEMS_HANDOVER_NOTE = {
  th: "เก็บเฉพาะบทบาท ระดับสิทธิ์ และผู้รับผิดชอบต่ออายุ ไม่เก็บรหัสผ่าน คีย์ API หรือข้อมูลรับรอง ระบบจะไม่ถูกทำเครื่องหมาย Live หรือ Handed Over จนกว่าโรงแรมจะอนุมัติและเอกสารที่ต้องมีครบ",
  en: "Stores role names, access levels, and renewal responsibility only. No passwords, API keys, or credentials. A system is not marked Live or Handed Over until hotel approval and the required documentation are complete.",
};

export function systemsHandoverChecklistStatus(id?: string, sample = true) {
  const raw = String(id || "not_started").trim();
  if (sample && HANDOVER_LIVE_RE.test(raw)) {
    return SYSTEMS_HANDOVER_CHECKLIST_STATUSES.find((row) => row.id === "incomplete") || SYSTEMS_HANDOVER_CHECKLIST_STATUSES[0];
  }
  return SYSTEMS_HANDOVER_CHECKLIST_STATUSES.find((row) => row.id === raw) || SYSTEMS_HANDOVER_CHECKLIST_STATUSES[0];
}

export function systemsOwnershipStatus(id?: string, sample = true) {
  const raw = String(id || "not_handed_over").trim();
  if (sample && HANDOVER_LIVE_RE.test(raw)) {
    return SYSTEMS_OWNERSHIP_STATUSES.find((row) => row.id === "not_handed_over") || SYSTEMS_OWNERSHIP_STATUSES[0];
  }
  return SYSTEMS_OWNERSHIP_STATUSES.find((row) => row.id === raw) || SYSTEMS_OWNERSHIP_STATUSES[0];
}

export const SYSTEMS_HANDOVER_CHECKLIST = [
  {
    id: "inventory",
    itemTh: "System inventory delivered",
    itemEn: "System inventory delivered",
    status: "documented_sample" as const,
    ownerTh: "ทีมนำไปใช้ ตามขอบเขตที่ตกลง",
    ownerEn: "Implementation team, within the agreed scope",
    evidenceTh: "ตารางตัวอย่าง System Inventory — ไม่ใช่แฟ้มโรงแรมจริง",
    evidenceEn: "Sample System Inventory table — not a live hotel file",
  },
  {
    id: "architecture",
    itemTh: "Architecture diagram delivered",
    itemEn: "Architecture diagram delivered",
    status: "in_progress" as const,
    ownerTh: HANDOVER_OWNER.th,
    ownerEn: HANDOVER_OWNER.en,
    evidenceTh: HANDOVER_EVIDENCE.th,
    evidenceEn: HANDOVER_EVIDENCE.en,
  },
  {
    id: "mapping",
    itemTh: "Data mapping delivered",
    itemEn: "Data mapping delivered",
    status: "in_progress" as const,
    ownerTh: "ทีมนำไปใช้ ตามขอบเขตที่ตกลง",
    ownerEn: "Implementation team, within the agreed scope",
    evidenceTh: "ตาราง Data Dictionary ตัวอย่าง ขึ้นกับการตรวจของผู้ให้บริการ",
    evidenceEn: "Sample Data Dictionary. Subject to provider verification",
  },
  {
    id: "tests",
    itemTh: "Test cases and QA results delivered",
    itemEn: "Test cases and QA results delivered",
    status: "awaiting_signoff" as const,
    ownerTh: "เจ้าของงานปฏิบัติการของโรงแรม",
    ownerEn: "Hotel operations owner",
    evidenceTh: "รอผลทดสอบที่อนุมัติ ไม่ทำเครื่องหมาย Passed ถ้าไม่ติดป้าย Sample",
    evidenceEn: "Awaiting approved test results. Do not mark Passed unless labelled Sample",
  },
  {
    id: "issues",
    itemTh: "Known issues listed",
    itemEn: "Known issues listed",
    status: "in_progress" as const,
    ownerTh: "ทีมนำไปใช้",
    ownerEn: "Implementation team",
    evidenceTh: "รายการปัญหาตัวอย่าง ไม่มีข้อมูลแขกหรือข้อมูลชำระเงิน",
    evidenceEn: "Sample issue list. No guest or payment data",
  },
  {
    id: "contacts",
    itemTh: "Provider contacts listed",
    itemEn: "Provider contacts listed",
    status: "not_started" as const,
    ownerTh: "เจ้าของสัญญาโรงแรม",
    ownerEn: "Hotel contract owner",
    evidenceTh: "ยังไม่มีรายชื่อที่อนุมัติ ไม่เก็บรหัสผ่าน",
    evidenceEn: "Approved names are not yet filed. No password is stored",
  },
  {
    id: "access",
    itemTh: "Access owner listed",
    itemEn: "Access owner listed",
    status: "awaiting_signoff" as const,
    ownerTh: "โรงแรมต้องระบุเจ้าของสิทธิ์",
    ownerEn: "The hotel must name the access owner",
    evidenceTh: "Pending Access — ไม่เก็บรหัสผ่าน",
    evidenceEn: "Pending Access — no password is stored",
  },
  {
    id: "sop",
    itemTh: "SOP delivered",
    itemEn: "SOP delivered",
    status: "not_started" as const,
    ownerTh: HANDOVER_OWNER.th,
    ownerEn: HANDOVER_OWNER.en,
    evidenceTh: "ยังไม่มี SOP ที่อนุมัติ",
    evidenceEn: "No approved SOP yet",
  },
  {
    id: "error",
    itemTh: "Error-handling path documented",
    itemEn: "Error-handling path documented",
    status: "in_progress" as const,
    ownerTh: "ทีมนำไปใช้ ตามขอบเขตที่ตกลง",
    ownerEn: "Implementation team, within the agreed scope",
    evidenceTh: "เส้นทาง Detect → Close ตัวอย่าง ยังไม่ใช่ SOP ที่ลงนาม",
    evidenceEn: "Sample Detect → Close path. Not a signed SOP",
  },
  {
    id: "rollback",
    itemTh: "Rollback/escalation plan documented where applicable",
    itemEn: "Rollback/escalation plan documented where applicable",
    status: "not_started" as const,
    ownerTh: "โรงแรมและผู้ให้บริการ",
    ownerEn: "Hotel and provider",
    evidenceTh: "ใช้เมื่อขอบเขตงานกำหนด และโรงแรมต้องอนุมัติ",
    evidenceEn: "Used where the scope requires it. Hotel approval is required",
  },
  {
    id: "signoff",
    itemTh: "Hotel sign-off recorded",
    itemEn: "Hotel sign-off recorded",
    status: "awaiting_signoff" as const,
    ownerTh: "เจ้าของโรงแรมหรือ GM",
    ownerEn: "Hotel owner or GM",
    evidenceTh: "ยังไม่มีลายเซ็น Go-live ของโรงแรม",
    evidenceEn: "Hotel Go-live sign-off is not recorded",
  },
  {
    id: "post-owner",
    itemTh: "Post-go-live owner confirmed",
    itemEn: "Post-go-live owner confirmed",
    status: "incomplete" as const,
    ownerTh: "โรงแรมยังรับผิดชอบงานปฏิบัติการหลังส่งมอบ",
    ownerEn: "The hotel remains responsible for operations after handover",
    evidenceTh: "ยังไม่ยืนยันเจ้าของหลังเริ่มใช้จริง",
    evidenceEn: "Post-go-live owner is not yet confirmed",
  },
] as const;

export const SYSTEMS_OWNERSHIP_ROWS = [
  {
    id: "pms",
    assetTh: "PMS",
    assetEn: "PMS",
    ownerTh: "โรงแรม / ผู้ให้บริการ PMS",
    ownerEn: "Hotel / PMS provider",
    contactTh: HANDOVER_CONTACT.th,
    contactEn: HANDOVER_CONTACT.en,
    approvalTh: "เจ้าของโรงแรมหรือ GM",
    approvalEn: "Hotel owner or GM",
    accessTh: "Pending Access",
    accessEn: "Pending Access",
    renewalTh: "เจ้าของสัญญาโรงแรม",
    renewalEn: "Hotel contract owner",
    reviewed: HANDOVER_REVIEWED,
    status: "not_handed_over" as const,
  },
  {
    id: "channel",
    assetTh: "Channel Manager",
    assetEn: "Channel Manager",
    ownerTh: "โรงแรม / ผู้ให้บริการ Channel Manager",
    ownerEn: "Hotel / channel-manager provider",
    contactTh: HANDOVER_CONTACT.th,
    contactEn: HANDOVER_CONTACT.en,
    approvalTh: "เจ้าของงานเชิงพาณิชย์ของโรงแรม",
    approvalEn: "Hotel commercial owner",
    accessTh: "Pending Access",
    accessEn: "Pending Access",
    renewalTh: "เจ้าของสัญญาโรงแรม",
    renewalEn: "Hotel contract owner",
    reviewed: HANDOVER_REVIEWED,
    status: "pending_approval" as const,
  },
  {
    id: "booking",
    assetTh: "Booking Engine",
    assetEn: "Booking Engine",
    ownerTh: "โรงแรม / เว็บไซต์",
    ownerEn: "Hotel / website",
    contactTh: HANDOVER_CONTACT.th,
    contactEn: HANDOVER_CONTACT.en,
    approvalTh: "เจ้าของงานเชิงพาณิชย์ของโรงแรม",
    approvalEn: "Hotel commercial owner",
    accessTh: "Named hotel owner — Sample",
    accessEn: "Named hotel owner — Sample",
    renewalTh: "เจ้าของสัญญาโรงแรม",
    renewalEn: "Hotel contract owner",
    reviewed: HANDOVER_REVIEWED,
    status: "documentation_incomplete" as const,
  },
  {
    id: "analytics",
    assetTh: "Analytics",
    assetEn: "Analytics",
    ownerTh: "โรงแรม",
    ownerEn: "Hotel",
    contactTh: HANDOVER_CONTACT.th,
    contactEn: HANDOVER_CONTACT.en,
    approvalTh: "เจ้าของงานเชิงพาณิชย์ของโรงแรม",
    approvalEn: "Hotel commercial owner",
    accessTh: "Not granted",
    accessEn: "Not granted",
    renewalTh: "เจ้าของสัญญาโรงแรม",
    renewalEn: "Hotel contract owner",
    reviewed: HANDOVER_REVIEWED,
    status: "not_handed_over" as const,
  },
  {
    id: "domain",
    assetTh: "Domain",
    assetEn: "Domain",
    ownerTh: "โรงแรม",
    ownerEn: "Hotel",
    contactTh: "เจ้าของโดเมนโรงแรม — บทบาทตัวอย่าง",
    contactEn: "Hotel domain owner — sample role",
    approvalTh: "เจ้าของโรงแรมหรือ GM",
    approvalEn: "Hotel owner or GM",
    accessTh: "Hotel contract owner",
    accessEn: "Hotel contract owner",
    renewalTh: "เจ้าของโดเมนโรงแรม",
    renewalEn: "Hotel domain owner",
    reviewed: HANDOVER_REVIEWED,
    status: "owner_assigned_sample" as const,
  },
  {
    id: "hosting",
    assetTh: "Hosting",
    assetEn: "Hosting",
    ownerTh: "โรงแรม / ผู้ให้บริการโฮสต์",
    ownerEn: "Hotel / hosting provider",
    contactTh: HANDOVER_CONTACT.th,
    contactEn: HANDOVER_CONTACT.en,
    approvalTh: "เจ้าของโรงแรมหรือ GM",
    approvalEn: "Hotel owner or GM",
    accessTh: "Hotel contract — provider-held",
    accessEn: "Hotel contract — provider-held",
    renewalTh: "เจ้าของสัญญาโรงแรม",
    renewalEn: "Hotel contract owner",
    reviewed: HANDOVER_REVIEWED,
    status: "pending_approval" as const,
  },
  {
    id: "api",
    assetTh: "API/Connector",
    assetEn: "API/Connector",
    ownerTh: "โรงแรมถือสัญญา ผู้ให้บริการถือสิทธิ์เทคนิค",
    ownerEn: "Hotel holds the contract. The provider holds technical permission",
    contactTh: HANDOVER_CONTACT.th,
    contactEn: HANDOVER_CONTACT.en,
    approvalTh: "โรงแรมและผู้ให้บริการ",
    approvalEn: "Hotel and provider",
    accessTh: "Pending Access",
    accessEn: "Pending Access",
    renewalTh: "เจ้าของสัญญาโรงแรม",
    renewalEn: "Hotel contract owner",
    reviewed: HANDOVER_REVIEWED,
    status: "not_handed_over" as const,
  },
  {
    id: "reporting",
    assetTh: "Reporting",
    assetEn: "Reporting",
    ownerTh: "โรงแรม",
    ownerEn: "Hotel",
    contactTh: HANDOVER_CONTACT.th,
    contactEn: HANDOVER_CONTACT.en,
    approvalTh: "เจ้าของงานเชิงพาณิชย์ของโรงแรม",
    approvalEn: "Hotel commercial owner",
    accessTh: "Named hotel owner — Sample",
    accessEn: "Named hotel owner — Sample",
    renewalTh: "โรงแรม",
    renewalEn: "Hotel",
    reviewed: HANDOVER_REVIEWED,
    status: "documentation_incomplete" as const,
  },
  {
    id: "form-inbox",
    assetTh: "Form inbox",
    assetEn: "Form inbox",
    ownerTh: "โรงแรม",
    ownerEn: "Hotel",
    contactTh: "เจ้าของกล่องรับเรื่องโรงแรม — บทบาทตัวอย่าง",
    contactEn: "Hotel inbox owner — sample role",
    approvalTh: "เจ้าของงานปฏิบัติการของโรงแรม",
    approvalEn: "Hotel operations owner",
    accessTh: "Named hotel owner — Sample",
    accessEn: "Named hotel owner — Sample",
    renewalTh: "โรงแรม",
    renewalEn: "Hotel",
    reviewed: HANDOVER_REVIEWED,
    status: "owner_assigned_sample" as const,
  },
  {
    id: "documentation",
    assetTh: "Documentation",
    assetEn: "Documentation",
    ownerTh: "โรงแรมหลังลงนาม ทีมนำไปใช้จนกว่าจะส่งมอบ",
    ownerEn: "Hotel after sign-off. Implementation team until handover",
    contactTh: HANDOVER_CONTACT.th,
    contactEn: HANDOVER_CONTACT.en,
    approvalTh: "เจ้าของโรงแรมหรือ GM",
    approvalEn: "Hotel owner or GM",
    accessTh: "Implementation team until handover — Sample",
    accessEn: "Implementation team until handover — Sample",
    renewalTh: "โรงแรมหลังลงนาม",
    renewalEn: "Hotel after sign-off",
    reviewed: HANDOVER_REVIEWED,
    status: "not_handed_over" as const,
  },
] as const;

export function systemsHandoverCmsItems() {
  return SYSTEMS_HANDOVER_CHECKLIST.map((row) => ({
    id: row.id,
    itemTh: row.itemTh,
    itemEn: row.itemEn,
    status: row.status,
    ownerTh: row.ownerTh,
    ownerEn: row.ownerEn,
    evidenceTh: row.evidenceTh,
    evidenceEn: row.evidenceEn,
  }));
}

export function systemsOwnershipCmsRows() {
  return SYSTEMS_OWNERSHIP_ROWS.map((row) => ({
    id: row.id,
    assetTh: row.assetTh,
    assetEn: row.assetEn,
    ownerTh: row.ownerTh,
    ownerEn: row.ownerEn,
    contactTh: row.contactTh,
    contactEn: row.contactEn,
    approvalTh: row.approvalTh,
    approvalEn: row.approvalEn,
    accessTh: row.accessTh,
    accessEn: row.accessEn,
    renewalTh: row.renewalTh,
    renewalEn: row.renewalEn,
    reviewed: row.reviewed,
    status: row.status,
  }));
}

export function systemsHandoverItemsAreStale(rows: Array<{ id?: string; itemEn?: string; status?: string }>) {
  if (rows.length < 12) return true;
  const inventory = rows.find((row) => row.id === "inventory");
  const signoff = rows.find((row) => row.id === "signoff");
  if (!inventory || !signoff) return true;
  if (!/System inventory delivered/i.test(String(inventory.itemEn || ""))) return true;
  return HANDOVER_LIVE_RE.test(String(signoff.status || ""));
}

export function systemsOwnershipRowsAreStale(rows: Array<{ id?: string; assetEn?: string; accessEn?: string; status?: string }>) {
  if (rows.length < 10) return true;
  const hasForm = rows.some((row) => row.id === "form-inbox" || /Form inbox/i.test(String(row.assetEn || "")));
  const hasApi = rows.some((row) => row.id === "api" || /API\/Connector/i.test(String(row.assetEn || "")));
  if (!hasForm || !hasApi) return true;
  return rows.some((row) => HANDOVER_LIVE_RE.test(String(row.status || "")) || /password|secret|api key/i.test(String(row.accessEn || "")));
}

export const SYSTEMS_PLAN = [
  {
    id: "d30",
    label: "Inventory and mapping",
    labelTh: "สำรวจและจับคู่",
    itemsTh: ["รวบรวมระบบที่ใช้จริง", "ระบุเจ้าของและผู้ให้บริการ", "ร่างตารางจับคู่", "ทำเครื่องหมาย Pending Access"],
    itemsEn: ["Collect the live systems", "Name owners and providers", "Draft the mapping table", "Mark Pending Access"],
    output: "Systems inventory and Data Mapping table",
  },
  {
    id: "d60",
    label: "Configure and test",
    labelTh: "ตั้งค่าและทดสอบ",
    itemsTh: ["ตั้งค่าตามสิทธิ์ที่มี", "ส่งงาน Requires Provider Support", "ทดสอบราคา ห้องว่าง และการจอง", "บันทึก Blocked ถ้ามี"],
    itemsEn: ["Configure within access", "Send Requires Provider Support work", "Test rates, availability, and bookings", "Log Blocked items"],
    output: "Test Case preview / QA report",
  },
  {
    id: "d90",
    label: "Train and hand over",
    labelTh: "อบรมและส่งมอบ",
    itemsTh: ["อบรมจากงานจริง", "ส่งเอกสาร Handover", "ทบทวนหลังเริ่มใช้ตามขอบเขต", "ปิดงานหรือระบุรายการที่ยังเปิด"],
    itemsEn: ["Train from real work", "Hand over the document", "Review after go-live within scope", "Close the work or name open items"],
    output: "Handover document",
  },
] as const;

export const SYSTEMS_CADENCE = [
  {
    id: "ready",
    label: "Ready checks",
    labelTh: "จุดที่ดูว่าระบบพร้อม",
    itemsTh: ["ห้องและราคาจับคู่ถูกต้องในช่องทางสำคัญ", "การเปลี่ยนราคาและห้องว่างส่งไปถึงช่องทางที่เกี่ยวข้อง", "การจองจาก OTA หรือเว็บไซต์เข้าระบบตามที่ควร", "ทีมรู้ว่าใครเป็นผู้ตรวจและแก้ปัญหา", "รายงานตอบคำถามด้านยอดขายและรายได้ที่โรงแรมต้องใช้"],
    itemsEn: ["Rooms and rates are mapped correctly on the main channels", "A change to the rate or availability reaches the related channels", "A booking from an OTA or the website enters the system as it should", "The team knows who checks and who fixes a problem", "Reports answer the sales and revenue questions the hotel needs"],
  },
] as const;

export const SYSTEMS_SOURCES = [
  {
    id: "internal-review",
    nameTh: "กรอบทบทวนภายในของเดอะ เคพีไอ พลัส — งานระบบโรงแรม",
    nameEn: "The KPI Plus internal review frame — hotel systems implementation",
    url: "",
    publishedAt: "2026-10-29",
    accessedAt: "2026-10-29",
    marketTh: "งานที่ปรึกษาระบบโรงแรม ไม่ใช่ผลโรงแรมรายแห่ง",
    marketEn: "Hotel systems advisory work, not a named hotel result",
    period: "2026",
    definitionTh: "ใช้เป็นกรอบจัดงานสำรวจ จับคู่ ทดสอบ และส่งมอบ ไม่ใช่สถิติรายได้หรือ Occupancy",
    definitionEn: "A working frame for inventory, mapping, testing, and handover, not revenue or occupancy statistics",
    status: "guidance" as SystemsSourceStatus,
  },
] as const;

export const SYSTEMS_KPI_SAMPLE = {
  period: "Sample period · not a live hotel month",
  periodTh: "ช่วงตัวอย่าง · ไม่ใช่เดือนของโรงแรมจริง",
  market: "Hotel systems advisory sample",
  marketTh: "ตัวอย่างงานระบบโรงแรม",
  source: "Internal sample index",
  sourceTh: "ดัชนีตัวอย่างภายใน",
  comparison: "No hotel baseline published",
  comparisonTh: "ยังไม่เผยแพร่เส้นฐานของโรงแรม",
  updatedAt: "2026-10-29",
};

export const SYSTEMS_KPIS = [
  {
    id: "mapping-open",
    group: "mapping",
    nameTh: "รายการที่ยัง Needs Mapping",
    nameEn: "Items still Needs Mapping",
    unit: "items",
    unitTh: "รายการ",
    definition: "Open mapping items in the sample readiness table",
    definitionTh: "รายการจับคู่ที่ยังเปิดในตารางความพร้อมตัวอย่าง",
    dataStatus: "sample" as SystemsKpiStatus,
    hideUntilData: false,
    tone: "yellow" as const,
  },
  {
    id: "pending-access",
    group: "access",
    nameTh: "รายการ Pending Access",
    nameEn: "Pending Access items",
    unit: "items",
    unitTh: "รายการ",
    definition: "Items waiting for hotel or provider access in the sample period",
    definitionTh: "รายการที่รอสิทธิ์โรงแรมหรือผู้ให้บริการในช่วงตัวอย่าง",
    dataStatus: "sample" as SystemsKpiStatus,
    hideUntilData: false,
    tone: "amber" as const,
  },
  {
    id: "occupancy",
    group: "commercial",
    nameTh: "Occupancy",
    nameEn: "Occupancy",
    unit: "%",
    unitTh: "%",
    definition: "Occupied rooms divided by available rooms, only from a hotel-approved source",
    definitionTh: "ห้องที่ขายได้เทียบห้องว่าง ใช้ได้เมื่อโรงแรมอนุมัติแหล่งข้อมูล",
    dataStatus: "not-configured" as SystemsKpiStatus,
    hideUntilData: true,
    tone: "amber" as const,
  },
  {
    id: "revenue",
    group: "commercial",
    nameTh: "รายได้",
    nameEn: "Revenue",
    unit: "THB",
    unitTh: "บาท",
    definition: "Revenue from a hotel-approved source. Implementation does not automatically increase revenue.",
    definitionTh: "รายได้จากแหล่งที่โรงแรมอนุมัติ การนำระบบไปใช้ไม่ได้เพิ่มรายได้โดยอัตโนมัติ",
    dataStatus: "not-configured" as SystemsKpiStatus,
    hideUntilData: true,
    tone: "amber" as const,
  },
] as const;

export function hotelSystemsRelatedCards(locale: Locale) {
  const thai = locale === "th";
  const card = (
    id: string,
    href: string,
    titleTh: string,
    titleEn: string,
    bodyTh: string,
    bodyEn: string,
    kind: string,
  ) => {
    const resolved = existingHref(href, locale) || href;
    return {
      id,
      href: resolved,
      kind,
      titleTh,
      titleEn,
      bodyTh,
      bodyEn,
      ctaTh: thai ? "ดูรายละเอียด" : "Read more",
      ctaEn: "Read more",
      title: thai ? titleTh : titleEn,
      body: thai ? bodyTh : bodyEn,
      cta: thai ? "ดูรายละเอียด" : "Read more",
    };
  };
  return [
    card("revenue", "/solutions/revenue-commercial-management", "บริหารรายได้และการขาย", "Revenue and commercial management", "ระบบที่ตั้งค่าแล้ว ยังต้องดูร่วมกับราคา ช่องทางขาย และการจองตรงในภาพรวมรายได้", "Once the systems are set, rates, channels, and direct booking still have to sit in one revenue picture.", "solution"),
    card("reservations", "/solutions/outsourced-hotel-reservations", "งานจองโรงแรม", "Outsourced hotel reservations", "เมื่อระบบพร้อมแล้ว ทีมยังต้องมีคนดูแลคำถามและการจองจากช่องทางที่ตกลงกัน", "When the systems are ready, someone still has to look after questions and bookings on the agreed channels.", "solution"),
    card("website", "/solutions/hotel-website-design", "ออกแบบเว็บไซต์โรงแรม", "Hotel website design", "หน้าเว็บและเส้นทางจองตรงช่วยให้แขกเห็นราคาและเงื่อนไขที่ระบบพร้อมขาย", "The website and booking path help guests see the rates and conditions the systems can sell.", "solution"),
    card("direct", "/solutions/hotel-direct-bookings", "การจองตรง", "Direct bookings", "หากจุดติดขัดอยู่ที่หน้าห้องพักหรือระบบจอง อาจตรวจเส้นทางจองตรงแยกต่างหาก", "If the gap is the room page or booking engine, the direct-booking path can be reviewed separately.", "solution"),
  ];
}

export const SYSTEMS_ENQUIRY_RECEIVE = [
  {
    id: "inventory",
    title: "Current System Inventory review",
    th: "ทบทวนรายการระบบที่ใช้จริง โดยไม่ต้องส่งรหัสผ่าน",
    en: "A review of the live system inventory. Do not send a password.",
  },
  {
    id: "architecture",
    title: "Architecture and Data Flow review",
    th: "ทบทวนสถาปัตยกรรมและเส้นทางข้อมูลระหว่างระบบ",
    en: "A review of architecture and Data Flow between systems.",
  },
  {
    id: "mapping",
    title: "Data Mapping and Readiness assessment",
    th: "ประเมินการจับคู่ข้อมูลและความพร้อมก่อนนำไปใช้",
    en: "A Data Mapping and Readiness assessment before implementation.",
  },
  {
    id: "provider",
    title: "Integration/Provider dependency review",
    th: "ทบทวนการเชื่อมระบบและงานที่ขึ้นกับผู้ให้บริการ",
    en: "A review of integration work and provider dependencies.",
  },
  {
    id: "testing",
    title: "Testing and Handover scope",
    th: "คุยขอบเขตการทดสอบและการส่งมอบ",
    en: "A discussion of Testing and Handover scope.",
  },
  {
    id: "next",
    title: "Next Action and implementation plan",
    th: "กำหนด Next Action และ Implementation Plan ก่อนเริ่มงาน",
    en: "A Next Action and Implementation Plan before the work starts.",
  },
] as const;

export function hotelSystemsEnquiryCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: "Hotel Systems",
    heading: thai ? "คุยเรื่องระบบโรงแรมและข้อมูล" : "Talk about hotel systems and data",
    lead: thai
      ? "ส่งชื่อโรงแรม ระบบที่ใช้อยู่ และปัญหาที่พบ ไม่ต้องส่งรหัสผ่าน คีย์ หรือข้อมูลแขก ทีมจะช่วยดูขอบเขตและสิทธิ์เข้าถึงก่อนเริ่มงาน"
      : "Send the hotel name, the systems in use, and the problem. Do not send a password, key, or guest data. The team will review scope and access before the work starts.",
    receiveTitle: thai ? "โรงแรมจะได้อะไรจากการเริ่มคุยงานนำไปใช้" : "What the hotel receives from starting an implementation conversation",
    nextTitle: "What Happens Next",
    steps: thai
      ? [
          "ส่งรายการระบบและปัญหาที่พบ",
          "ทีมตรวจ Architecture, Data Flow และ Owner",
          "สรุป Readiness, Scope และสิ่งที่ต้องเตรียม",
          "นัดคุย Implementation Plan และ Next Action",
        ]
      : [
          "Send the system list and the problem found",
          "The team reviews Architecture, Data Flow, and Owner",
          "We summarise Readiness, Scope, and what to prepare",
          "Book a conversation on the Implementation Plan and Next Action",
        ],
    note: thai
      ? "ไม่จำเป็นต้องรู้ก่อนว่าต้องเปลี่ยนระบบหรือไม่ การคุยครั้งนี้ยังไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว และไม่ใช่ผลที่การันตี ไม่ต้องส่งรหัสผ่าน"
      : "You do not need to know in advance whether the system must change. This conversation is not a verified integration status, and not a guaranteed result. Do not send a password.",
    submit: thai ? "ส่งเรื่องให้ทีมดูระบบโรงแรม" : "Send a hotel systems enquiry",
    loading: thai ? "กำลังส่งข้อมูล กรุณารอสักครู่" : "Sending your message. Please wait.",
    goalEmpty: thai ? "เลือกเป้าหมาย" : "Choose a goal",
    labels: {
      name: thai ? "ชื่อผู้ติดต่อ" : "Contact name",
      business: thai ? "ชื่อโรงแรม / บริษัท" : "Hotel / company name",
      contact: thai ? "อีเมลหรือเบอร์โทร" : "Email / phone",
      rooms: thai ? "จำนวนห้อง" : "Number of rooms",
      hotelStatus: thai ? "สถานะโรงแรม" : "Hotel status",
      hotelStatusPlaceholder: thai ? "เลือกสถานะโรงแรม" : "Choose hotel status",
      challenge: thai ? "ปัญหาหลัก" : "Main issue",
      challengePlaceholder: thai ? "อธิบายปัญหาหลัก โดยไม่ต้องส่งรหัสผ่าน" : "Describe the main issue. Do not send a password",
      teamSize: thai ? "ขนาดทีมปัจจุบัน" : "Current team size",
      website: thai ? "เว็บไซต์" : "Website URL",
      pms: thai ? "PMS ที่ใช้" : "PMS used",
      channelManager: thai ? "Channel Manager ที่ใช้" : "Channel Manager used",
      bookingEngine: thai ? "Booking Engine ที่ใช้" : "Booking Engine used",
      systems: thai ? "ระบบอื่นที่เกี่ยวข้อง" : "Other related systems",
      providerContact: thai ? "ผู้ติดต่อผู้ให้บริการหรือเจ้าของงานเทคนิค" : "Provider contact or technical owner",
      goal: thai ? "เป้าหมาย" : "Goal",
      message: thai ? "ปัญหาหลัก" : "Main issue",
      optional: thai ? "ไม่บังคับ" : "Optional",
      websiteInvalid: thai ? "กรุณาใส่ URL เว็บไซต์ให้ถูกต้อง" : "Enter a valid website URL",
      required: thai ? "กรุณากรอกข้อมูลนี้" : "This field is required",
      invalidEmail: thai ? "กรุณาใส่อีเมลให้ถูกต้อง หรือใช้เบอร์โทร" : "Enter a valid email, or use a phone number",
      consent: thai
        ? "ข้าพเจ้ายินยอมให้ เดอะ เคพีไอ พลัส ใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับคำขอนี้ ตาม"
        : "I agree that The KPI Plus may use this information to reply about this request, under the",
      privacy: thai ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy",
    },
  };
}

export function systemsEnquiryReceiveAreStale(rows: Array<{ id?: string; title?: string }>) {
  if (rows.length < 6) return true;
  return !rows.some((row) => row.id === "architecture" || /Architecture and Data Flow/i.test(String(row.title || "")));
}

export function systemsEnquiryStepsAreStale(rows: Array<{ th?: string; en?: string }>) {
  if (rows.length < 4) return true;
  const text = rows.map((row) => `${row.th || ""} ${row.en || ""}`).join(" ");
  return !/Architecture, Data Flow|Implementation Plan และ Next Action/i.test(text);
}

const SYSTEMS_FAQS = [
  {
    qTh: "ต้องเปลี่ยนระบบเดิมทั้งหมดหรือไม่",
    qEn: "Do we have to replace every current system?",
    aTh: "ไม่จำเป็นเสมอไป งานเริ่มจากสำรวจระบบที่มีอยู่ เส้นทางข้อมูล และการจับคู่ฟิลด์ก่อน หากระบบเดิมรองรับขอบเขตที่ตกลงได้ ก็ใช้ต่อได้ ความเป็นไปได้ทางเทคนิคขึ้นกับผู้ให้บริการ API หรือตัวเชื่อม ไลเซนส์ สิทธิ์ โครงสร้างข้อมูล ความปลอดภัย และขอบเขตที่อนุมัติ",
    aEn: "Not always. The work starts with the current inventory, data flow, and field mapping. If the current systems can support the agreed scope, they can stay. Technical feasibility depends on the provider, API or connector, licence, permission, data structure, security, and approved scope.",
  },
  {
    qTh: "ทำงานร่วมกับ PMS, Channel Manager และ Booking Engine เดิมได้หรือไม่",
    qEn: "Can this work with the current PMS, Channel Manager, and Booking Engine?",
    aTh: "ทำร่วมได้เมื่อผู้ให้บริการ ไลเซนส์ สิทธิ์ และตัวเชื่อมรองรับ ทีมจะตรวจว่าระบบเดิมส่งและรับข้อมูลอะไรได้จริง ไม่สมมติว่าเชื่อมแล้วใช้ได้ทุกฟิลด์",
    aEn: "Yes, when the provider, licence, permission, and connector support it. The team checks what the current systems can actually send and receive. A connection is not assumed to cover every field.",
  },
  {
    qTh: "ทุกระบบสามารถเชื่อมต่อกันได้หรือไม่",
    qEn: "Can every system connect to every other system?",
    aTh: "ไม่ได้ทุกกรณี บางระบบมี API บางระบบมีตัวเชื่อมจำกัด และบางระบบต้องทำงานกึ่งแมนนวล ความเป็นไปได้ขึ้นกับผู้ให้บริการ API หรือตัวเชื่อม ไลเซนส์ สิทธิ์ โครงสร้างข้อมูล ความปลอดภัย และขอบเขตที่ตกลง",
    aEn: "No. Some systems have an API, some have a limited connector, and some still need a manual step. Feasibility depends on the provider, API or connector, licence, permission, data structure, security, and agreed scope.",
  },
  {
    qTh: "ใครต้องให้ API Access หรือ Account Permission",
    qEn: "Who has to grant API access or account permission?",
    aTh: "โรงแรมหรือเจ้าของบัญชีระบบเป็นผู้ให้สิทธิ์ ผู้ให้บริการระบบอาจต้องอนุมัติ API หรือตัวเชื่อม เดอะ เคพีไอ พลัสไม่เก็บรหัสผ่านของระบบที่ใช้งานจริง และไม่ขอข้อมูลแขกหรือข้อมูลชำระเงินในแบบฟอร์มติดต่อ",
    aEn: "The hotel or account owner grants access. The system provider may also have to approve an API or connector. The KPI Plus does not store live production passwords, and the contact form should not include guest or payment data.",
  },
  {
    qTh: "หาก Provider ไม่เปิด API จะทำอย่างไร",
    qEn: "What happens if the provider does not open an API?",
    aTh: "จะบันทึกข้อจำกัดนั้น แล้วดูตัวเชื่อมที่มีอยู่ ขอบเขตที่ทำได้โดยไม่ใช้ API หรือขั้นตอนที่ทีมต้องทำเอง ไม่สามารถบังคับผู้ให้บริการให้เปิด API และไม่สัญญาว่าทุกระบบจะเชื่อมอัตโนมัติ",
    aEn: "The limit is recorded. The team then reviews any available connector, the work that can be done without an API, or a manual step. A provider cannot be forced to open an API, and not every system can connect automatically.",
  },
  {
    qTh: "ใครรับผิดชอบเมื่อข้อมูลไม่ตรงกัน",
    qEn: "Who is responsible when data does not match?",
    aTh: "ขึ้นกับว่าชุดข้อมูลนั้นใครเป็น Source of Truth โรงแรมรับผิดชอบข้อมูลปฏิบัติการและการอนุมัติ ผู้ให้บริการรับผิดชอบพฤติกรรมของระบบตนเอง ทีมนำไปใช้อาจช่วยไล่เส้นทางข้อมูลและการจับคู่ตามขอบเขตที่ตกลง แต่ไม่ได้เป็นเจ้าของทุกระบบภายนอก",
    aEn: "It depends on who owns that Source of Truth. The hotel owns operational data and approvals. The provider owns the behaviour of its own system. The implementation team may trace the flow and mapping within the agreed scope, but it does not own every external system.",
  },
  {
    qTh: "ใช้เวลาทำ Implementation เท่าไร",
    qEn: "How long does implementation take?",
    aTh: "ไม่มีระยะเวลาตายตัว ขึ้นกับรายการระบบ การจับคู่ข้อมูล สิทธิ์เข้าถึง ความเร็วของผู้ให้บริการ เคสทดสอบ และการอนุมัติของโรงแรม หน้านี้ไม่ใช่ไทม์ไลน์ลูกค้าจริง และไม่กำหนดวันได้ผล",
    aEn: "There is no fixed duration. It depends on the system inventory, mapping, access, provider response, test cases, and hotel approval. This page is not a live client timeline, and it does not set a time-to-result.",
  },
  {
    qTh: "ทดสอบระบบอย่างไร และถ้าเคสไม่ผ่านจะทำอย่างไร",
    qEn: "How is testing done, and what happens if a case fails?",
    aTh: "งานทดสอบใช้เคสที่ระบุ Trigger ผลที่คาดหวัง ผลจริง ผู้รับผิดชอบ และหลักฐาน หากไม่ผ่านจะบันทึก Failed, Blocked หรือ Retest Required แล้วไล่ Error Handling ตามเจ้าของงานและผู้ให้บริการ Go-live ถูกบล็อกจนกว่าเคสที่จำเป็นและการอนุมัติของโรงแรมจะครบ หน้านี้เป็นตัวอย่าง ไม่ใช่ผลทดสอบโรงแรมจริง",
    aEn: "Testing uses cases with a trigger, expected result, actual result, owner, and evidence. A failed case is logged as Failed, Blocked, or Retest Required, then followed through the error path with the named owner and provider. Go-live stays blocked until required cases and hotel approval are complete. This page is a sample, not a live hotel QA result.",
  },
  {
    qTh: "มี Test Environment หรือ Sandbox หรือไม่",
    qEn: "Is there a test environment or sandbox?",
    aTh: "ใช้ได้เมื่อโรงแรมหรือผู้ให้บริการมีสภาพแวดล้อมทดสอบ หากไม่มี ต้องตกลงขอบเขตความเสี่ยงก่อนแตะข้อมูลจริง ไม่ใช่ทุกผู้ให้บริการที่มี sandbox",
    aEn: "A test environment is used when the hotel or provider has one. If none exists, the risk and test scope must be agreed before live data is touched. Not every provider offers a sandbox.",
  },
  {
    qTh: "รองรับ Data Mapping และ Documentation หรือไม่",
    qEn: "Does this include Data Mapping and documentation?",
    aTh: "รองรับตามขอบเขตที่ตกลง เช่น กรอบการจับคู่ข้อมูล พจนานุกรมฟิลด์ เคสทดสอบ และเอกสารส่งมอบ เอกสารตัวอย่างบนหน้านี้ต้องแทนที่ด้วยข้อเท็จจริงที่โรงแรมอนุมัติ",
    aEn: "Yes, within the agreed scope. That may include a mapping framework, a field dictionary, test cases, and handover documents. Sample documents on this page must be replaced with hotel-approved facts.",
  },
  {
    qTh: "หลังส่งมอบทีมโรงแรมดูแลต่อได้หรือไม่",
    qEn: "Can the hotel team operate the systems after handover?",
    aTh: "เป้าหมายของการส่งมอบคือให้มีเจ้าของสิทธิ์ ขั้นตอน และเอกสารที่ทีมโรงแรมใช้ต่อได้ ความเป็นเจ้าของงานปฏิบัติการหลังส่งมอบยังเป็นของโรงแรม เดอะ เคพีไอ พลัสไม่ได้เป็นผู้ปฏิบัติการแทน เว้นแต่จะตกลงขอบเขตใหม่",
    aEn: "Handover aims to leave owners, permissions, steps, and documents the hotel team can use. Operational ownership after handover stays with the hotel. The KPI Plus does not remain the live operator unless a later scope is agreed.",
  },
  {
    qTh: "ดูแล Security และข้อมูลส่วนบุคคลอย่างไร",
    qEn: "How are security and personal data handled?",
    aTh: "ไม่ส่งรหัสผ่าน คีย์ API ข้อมูลแขก หรือข้อมูลชำระเงินในแบบฟอร์มติดต่อ โรงแรมและผู้ให้บริการยังรับผิดชอบนโยบายความปลอดภัย ข้อตกลงข้อมูล และบัญชีที่ใช้งานจริง งานใช้สิทธิ์ที่ได้รับตามขอบเขต และเป็นไปตามนโยบายความเป็นส่วนตัว",
    aEn: "Do not send passwords, API keys, guest data, or payment data in the contact form. The hotel and provider remain responsible for security policy, data agreements, and live accounts. The work uses granted access within scope and follows the Privacy Policy.",
  },
  {
    qTh: "รองรับโรงแรมเปิดใหม่หรือเปลี่ยนระบบกลางคันหรือไม่",
    qEn: "Does this support a new opening or a mid-change of systems?",
    aTh: "รองรับได้ทั้งโรงแรมก่อนเปิดและโรงแรมที่กำลังเปลี่ยนระบบ งานเริ่มจากระบบ ข้อจำกัด และสิทธิ์ที่มีอยู่จริง ไม่ใช่แพ็กเกจเดียวกันทุกแห่ง",
    aEn: "Yes. The work can support a hotel before opening and a hotel changing systems. It starts from the systems, limits, and access that exist. It is not one package for every hotel.",
  },
  {
    qTh: "การเชื่อมระบบทำให้รายได้เพิ่มขึ้นทันทีหรือไม่",
    qEn: "Does connecting systems increase revenue immediately?",
    aTh: "ไม่ การเชื่อมระบบไม่ได้ทำให้รายได้เพิ่มขึ้นเอง ไม่ลดภาระงานเป็นเปอร์เซ็นต์คงที่ และไม่กำจัดข้อผิดพลาดทั้งหมด รายได้ยังขึ้นกับราคา ช่องทางขาย สินค้า และการดำเนินงาน",
    aEn: "No. Connecting systems does not automatically increase revenue, reduce workload by a fixed percentage, or remove every error. Revenue still depends on rates, channels, product, and operations.",
  },
  {
    qTh: "ใครเป็นผู้อนุมัติ Go-live",
    qEn: "Who approves Go-live?",
    aTh: "โรงแรมเป็นผู้อนุมัติ Go-live เดอะ เคพีไอ พลัสอาจส่งผลทดสอบ รายการที่ยังเปิดอยู่ และข้อจำกัดของผู้ให้บริการ แต่ไม่ได้อนุมัติเริ่มใช้จริงแทนโรงแรม",
    aEn: "The hotel approves Go-live. The KPI Plus may present test results, open items, and provider limits. It does not approve going live on the hotel’s behalf.",
  },
] as const;

export function hotelSystemsFaqs(locale: Locale): FaqItem[] {
  const thai = locale === "th";
  return SYSTEMS_FAQS.map((item) => ({
    q: thai ? item.qTh : item.qEn,
    a: thai ? item.aTh : item.aEn,
  }));
}

export function hotelSystemsFaqsAreStale(items: Array<{ q: string; a: string }>) {
  if (items.length < 15) return true;
  const current = [
    "ต้องเปลี่ยนระบบเดิมทั้งหมดหรือไม่",
    "Do we have to replace every current system?",
    "ทดสอบระบบอย่างไร และถ้าเคสไม่ผ่านจะทำอย่างไร",
    "How is testing done, and what happens if a case fails?",
    "การเชื่อมระบบทำให้รายได้เพิ่มขึ้นทันทีหรือไม่",
    "Does connecting systems increase revenue immediately?",
    "ใครเป็นผู้อนุมัติ Go-live",
    "Who approves Go-live?",
  ];
  return !items.some((item) => current.includes(item.q.trim()));
}

export const hotelSystemsCopy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "Hotel Systems",
    title: "ระบบเชื่อมต่อได้ แต่ข้อมูลและการทำงานยังไม่ไปทางเดียวกัน",
    lead: "โรงแรมอาจใช้ PMS, Channel Manager, OTA, Booking Engine และรายงานหลายระบบ แต่ข้อมูลยังไม่สอดคล้อง และยังไม่ชัดว่าใครเป็นเจ้าของชุดข้อมูลใด",
    leadClose:
      "งานเริ่มจากสำรวจระบบ ดูเส้นทางข้อมูล จับคู่ข้อมูล และประเมินความพร้อมก่อนตั้งค่า เป้าหมายไม่ใช่การเชื่อมเครื่องมือให้ครบ แต่ให้มีเส้นทางที่ตามได้ พฤติกรรมที่ทดสอบแล้ว และการส่งมอบที่ชัดเจน ความเป็นไปได้ทางเทคนิคขึ้นกับสิทธิ์จากผู้ให้บริการ API หรือตัวเชื่อม ไลเซนส์ ความปลอดภัย และขอบเขตที่อนุมัติ",
    cta: "ขอประเมินระบบโรงแรม",
    secondary: "ดูแนวทางการทำงาน",
    underCta: "ส่งชื่อโรงแรม ระบบที่ใช้อยู่ และปัญหาที่พบ ไม่ต้องส่งรหัสผ่าน",
    needTitle: "โรงแรมของคุณกำลังเจอเรื่องนี้หรือไม่?",
    needLead:
      "ข้อมูลห้อง ราคา หรือห้องว่างอาจไม่ตรงกัน พนักงานต้องกรอกซ้ำ ไม่ชัดว่าระบบใดเป็น Source of Truth ข้อมูล PMS, Channel Manager, Booking Engine หรือรายงานไม่ครบ และยังไม่มีผู้รับผิดชอบเมื่อข้อมูลผิดหรือการเชื่อมต่อล้ม",
    needClose: "นี่เป็นกรอบทบทวนตัวอย่าง ไม่ใช่ผลตรวจโรงแรมจริง และไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว",
    helpTitle: "ระบบและข้อมูลที่อาจต้องทำงานร่วมกัน",
    helpLead:
      "โรงแรมอาจใช้ Website, Booking Engine, PMS, Channel Manager, OTA และรายงานร่วมกัน แต่ข้อมูลประเภทห้อง Rate Plan ห้องว่าง การจอง และรายงานไม่ได้ไหลครบทุกจุดโดยอัตโนมัติ",
    helpBoundary: "Data Flow depends on the provider, API/connector, field mapping, permission, and agreed scope.",
    modelTitle: "ทำไมมีหลายระบบแล้วงานยังไม่ไหลเป็นเส้นทางเดียวกัน",
    modelLead:
      "โรงแรมอาจใช้ PMS สเปรดชีต OTA Booking Engine และรายงานพร้อมกัน แต่ยังกรอกซ้ำ ข้อมูลห้อง ราคา ห้องว่างไม่ตรง ไม่ชัดว่าใครเป็น Source of Truth และรายงานใช้นิยามต่างกัน",
    modelNote: SYSTEMS_BEFORE_AFTER_NOTE.th,
    deliverablesTitle: "โรงแรมต้องเตรียมอะไรก่อนเริ่มงานนำไปใช้",
    deliverablesLead:
      "ความพร้อมไม่ได้ดูจากสถานะว่าเชื่อมแล้ว แต่ดูว่าระบบที่มีอยู่ การจับคู่ข้อมูล สิทธิ์เข้าถึง ข้อจำกัดของผู้ให้บริการ เคสทดสอบ และผู้รับผิดชอบพร้อมก่อนเริ่มงานหรือยัง",
    deliverablesBoundary:
      "เดอะ เคพีไอ พลัส อาจช่วยสำรวจ จับคู่ ตั้งค่า ทดสอบ อบรม และส่งมอบ โรงแรมยังรับผิดชอบไลเซนส์ สิทธิ์ API รหัสผ่าน ข้อมูลแขก การชำระเงิน และผู้ให้บริการระบบ",
    methodTitle: "เราทำงานอย่างไร?",
    methodLead:
      "งานระบบโรงแรมเดินเป็นห้าขั้น Discover, Map, Configure, Test และ Handover แต่ละขั้นมีผู้รับผิดชอบ ข้อมูลเข้า การกระทำ ผลลัพธ์ จุดอนุมัติ ข้อจำกัด และการตัดสินใจถัดไป",
    methodApprovals: "Go-live gate",
    fitTitle: "ระบบและแพลตฟอร์มที่เกี่ยวข้อง",
    fitLead: "ชื่อแพลตฟอร์มใช้ระบุหมวดที่อาจเกี่ยวข้องกับงานเท่านั้น ไม่ใช่โลโก้วอลล์ ไม่ใช่หลักฐานว่าเชื่อมต่อแล้ว และไม่ได้หมายถึงความร่วมมือ สปอนเซอร์ การรับรอง หรือการรับรองอย่างเป็นทางการ",
    fitNotTitle: "หน้านี้ไม่ได้หมายความว่า…",
    inventoryTitle: "รายการระบบและพจนานุกรมข้อมูล",
    inventoryLead:
      "นี่เป็นตารางตัวอย่างสำหรับสำรวจระบบและจับคู่ฟิลด์ ต้องแทนที่ด้วยข้อมูลโรงแรมที่อนุมัติ และขึ้นกับการตรวจของผู้ให้บริการ ไม่มีรหัสบัญชี รหัสการจอง ข้อมูลแขก หรือรหัสผ่าน",
    inventorySystemsTitle: "System Inventory",
    inventoryFieldsTitle: "Data Dictionary",
    scopeTitle: "ขอบเขตการเชื่อมระบบและตารางความรับผิดชอบ",
    scopeLead:
      "เดอะ เคพีไอ พลัสอาจช่วยงานสำรวจ สถาปัตยกรรม การจับคู่ข้อมูล แผนนำไปใช้ การประสานงานผู้ให้บริการ รายการตั้งค่า เคสทดสอบ เอกสาร QA และการส่งมอบ และการออกแบบความเป็นเจ้าของตามขอบเขตที่ตกลง โรงแรมหรือผู้ให้บริการภายนอกยังรับผิดชอบไลเซนส์ สิทธิ์ API ความปลอดภัย การชำระเงิน ข้อมูลห้องว่างและราคา ข้อตกลงข้อมูล การแก้ไขของผู้ให้บริการ การอนุมัติเริ่มใช้จริง และงานปฏิบัติการหลังส่งมอบ เดอะ เคพีไอ พลัสไม่ได้เป็นเจ้าของทุกระบบภายนอก และไม่การันตีพฤติกรรมของผู้ให้บริการ",
    scopeSupportTitle: "เดอะ เคพีไอ พลัสอาจช่วย ตามขอบเขตที่ตกลง",
    scopeHotelTitle: "โรงแรมหรือผู้ให้บริการภายนอกยังรับผิดชอบ",
    scopeMatrixTitle: "Responsibility Matrix",
    planTitle: "การส่งมอบและความเป็นเจ้าของ",
    planLead:
      "นี่เป็นรายการส่งมอบและตารางเจ้าของตัวอย่าง เก็บเฉพาะชื่อบทบาท ระดับสิทธิ์ และผู้รับผิดชอบต่ออายุ ไม่เก็บรหัสผ่าน คีย์ API หรือข้อมูลรับรอง ระบบจะไม่ถูกทำเครื่องหมาย Live หรือ Handed Over จนกว่าโรงแรมจะอนุมัติและเอกสารที่ต้องมีครบ",
    planChecklistTitle: "Handover Checklist",
    planOwnershipTitle: "Ownership",
    planCadenceTitle: "จุดที่ดูว่าระบบพร้อม — ตัวอย่าง",
    planClose: "เดอะ เคพีไอ พลัสไม่เก็บรหัสผ่านของระบบที่ใช้งานจริง ความเป็นเจ้าของงานปฏิบัติการหลังส่งมอบยังเป็นของโรงแรม",
    testingTitle: "การทดสอบและ QA",
    testingLead:
      "นี่เป็นตารางเคสทดสอบตัวอย่างสำหรับงานนำไปใช้ระบบโรงแรม ต้องแทนที่ด้วยผลทดสอบที่อนุมัติ ไม่ทำเครื่องหมาย Passed ถ้าไม่ติดป้าย Sample และไม่มีข้อมูลแขกหรือข้อมูลชำระเงินในหลักฐาน",
    testingCasesTitle: "Test Cases",
    testingErrorTitle: "Error Handling",
    measureTitle: "ตัวชี้วัดที่ใช้ทบทวน ไม่ใช่ผลที่การันตี",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับรายได้ งานจอง และระบบ",
    closerTitle: "คุยเรื่องระบบโรงแรมและข้อมูล",
    closerBody: "คุณไม่จำเป็นต้องรู้ก่อนว่าต้องเปลี่ยนระบบหรือไม่ เพียงส่งรายการระบบและปัญหาที่พบ เราจะช่วยดู Architecture, Data Flow และขอบเขตก่อนเริ่มงาน",
    closerCta: "ส่งเรื่องให้ทีมดูระบบโรงแรม",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Hotel Systems",
    title: "Systems can connect. Data and operations still do not run the same way.",
    lead: "A hotel may use a PMS, channel manager, OTA, booking engine, and reporting at the same time, and still have inconsistent information and unclear ownership.",
    leadClose:
      "The work starts with system inventory, data flow, mapping, and implementation readiness. The goal is not simply to connect tools. It is a traceable flow, tested behaviour, and a clear handover. Technical feasibility depends on provider access, API or connector support, licence, security, and the approved scope.",
    cta: "Request a hotel systems assessment",
    secondary: "View the implementation approach",
    underCta: "Send the hotel name, the systems in use, and the problem. Do not send a password.",
    needTitle: "Is the hotel facing these system and data problems?",
    needLead:
      "Room, rate, or availability data may not match. Staff may enter the same facts in several places. The Source of Truth may be unclear. PMS, channel manager, booking engine, or reporting data may be incomplete. There may be no owner when information is wrong, reports may use different definitions, and a connected system may still lack error handling, a test process, or a contact path when an integration fails.",
    needClose: "This is a sample review framework. It is not a live hotel diagnosis, and not a verified integration status.",
    helpTitle: "Systems and areas that may need to work together",
    helpLead:
      "A hotel may use a website, booking engine, PMS, channel manager, OTAs, and reporting together. Room type, rate plan, availability, reservations, and reports still do not move across every system automatically.",
    helpBoundary: "Data Flow depends on the provider, API/connector, field mapping, permission, and agreed scope.",
    modelTitle: "Why a hotel can have several systems and still not run one connected workflow",
    modelLead:
      "A hotel may use a PMS, spreadsheet, OTAs, a booking engine, and reports at the same time, and still re-enter data, see mismatched room, rate, or availability facts, lack a Source of Truth, and read reports that use different definitions.",
    modelNote: SYSTEMS_BEFORE_AFTER_NOTE.en,
    deliverablesTitle: "What the hotel must prepare before implementation",
    deliverablesLead:
      "Readiness is not a status that says connected. It is whether current systems, data mapping, access, provider limits, test cases, and owners are in place before the work starts.",
    deliverablesBoundary:
      "The KPI Plus may support inventory, mapping, configuration, testing, training, and handover. The hotel remains responsible for licences, API access, passwords, guest data, payments, and system providers.",
    methodTitle: "How we work",
    methodLead:
      "Hotel systems implementation runs in five steps: Discover, Map, Configure, Test, and Handover. Each step has an owner, input, action, output, approval point, dependency, and next decision.",
    methodApprovals: "Go-live gate",
    fitTitle: "Related systems and platforms",
    fitLead: "Platform names identify categories that may be in scope. This is not a logo wall, not proof of integration, and not a partnership, sponsorship, certification, or official endorsement.",
    fitNotTitle: "This page does not mean…",
    inventoryTitle: "System Inventory and Data Dictionary",
    inventoryLead:
      "This is a sample table for system inventory and field mapping. Replace with approved hotel data. Subject to provider verification. No account IDs, booking IDs, guest data, or passwords.",
    inventorySystemsTitle: "System Inventory",
    inventoryFieldsTitle: "Data Dictionary",
    scopeTitle: "Integration Boundary and Responsibility Matrix",
    scopeLead:
      "The KPI Plus may support current-system discovery, System Architecture, a Data Mapping framework, an Implementation Plan, provider coordination, a configuration checklist, Test Cases, QA and handover documentation, and ownership and SOP design, subject to the agreed scope. The hotel or external provider remains responsible for licences, API access, security, payments, provider-owned availability and rate data, data processing agreements, external provider fixes, final Go-live approval, and operational ownership after handover. The KPI Plus does not own every external system and does not guarantee an external provider's behaviour.",
    scopeSupportTitle: "The KPI Plus may support, subject to agreed scope",
    scopeHotelTitle: "The hotel or external provider remains responsible",
    scopeMatrixTitle: "Responsibility Matrix",
    planTitle: "Handover and Ownership",
    planLead:
      "This is a sample handover checklist and ownership table. It stores role names, access levels, and renewal responsibility only. It does not store passwords, API keys, or credentials. A system is not marked Live or Handed Over until hotel approval and the required documentation are complete.",
    planChecklistTitle: "Handover Checklist",
    planOwnershipTitle: "Ownership",
    planCadenceTitle: "Ready checks — Sample",
    planClose: "The KPI Plus does not keep production credentials. Operational ownership after handover stays with the hotel.",
    testingTitle: "Testing and QA",
    testingLead:
      "This is a sample test-case table for hotel systems implementation. Replace with approved test results. Do not mark Passed unless the row is clearly labelled Sample. Evidence must not include guest or payment data.",
    testingCasesTitle: "Test Cases",
    testingErrorTitle: "Error Handling",
    measureTitle: "Measures used in review. Not a guaranteed result.",
    relatedTitle: "Related reading on revenue, reservations, and systems",
    closerTitle: "Talk about hotel systems and data",
    closerBody: "You do not need to know in advance whether the system must change. Send the system list and the problem. We will review Architecture, Data Flow, and scope before the work starts.",
    closerCta: "Send a hotel systems enquiry",
  },
} as const;
