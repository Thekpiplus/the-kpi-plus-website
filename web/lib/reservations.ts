import { existsSync } from "fs";
import { join } from "path";

function publicSrc(candidate: string) {
  const relative = candidate.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? candidate : undefined;
}

const HERO_CANDIDATE = "/images/outsourced-reservations-hero-placeholder.webp";
const PROBLEM_CANDIDATE = "/images/outsourced-reservations-problem-evidence-placeholder.webp";
const SERVICE_MAP_CANDIDATE = "/images/outsourced-reservations-service-map-placeholder.webp";
const BOOKING_FLOW_CANDIDATE = "/images/outsourced-reservations-booking-flow-placeholder.webp";
const HANDOFF_CANDIDATE = "/images/outsourced-reservations-team-handoff-placeholder.webp";
const KPI_CANDIDATE = "/images/outsourced-reservations-kpi-placeholder.webp";
const RELATED_CANDIDATE = "/images/outsourced-reservations-related-content-placeholder.webp";
const TEAM_CANDIDATE = "/images/outsourced-reservations-team-placeholder.webp";

export type ContentStatus = "draft" | "review" | "approved" | "sample" | "published";

export type ServiceVisual = {
  src?: string;
  altTh: string;
  altEn: string;
  status: "real" | "approved" | "sample" | "placeholder";
  recommendedSize: string;
  aspectRatio: string;
};

export type ReservationChannelTag = "Direct" | "Email" | "Phone" | "OTA";

export type ServiceScopeItem = {
  id: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  inputTh: string;
  inputEn: string;
  outputTh: string;
  outputEn: string;
  channels?: ReservationChannelTag[];
  order: number;
};

export type ReservationWorkflowStep = {
  id: string;
  number: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  ownerTh: string;
  ownerEn: string;
  inputTh?: string;
  inputEn?: string;
  outputTh: string;
  outputEn: string;
  escalationTh?: string;
  escalationEn?: string;
  order: number;
};

export type ReservationKpi = {
  id: string;
  name: string;
  definitionTh: string;
  definitionEn: string;
  value?: number;
  unit?: string;
  periodTh: string;
  periodEn: string;
  target?: number;
  dataStatus: "Approved" | "Anonymised" | "Sample";
  updatedAt?: string;
  labels: string[];
  values: number[];
  hideUntilData?: boolean;
};

export type ReservationServiceSettings = {
  supportedChannels: string[];
  supportedLanguages: string[];
  operatingHours?: string;
  slaTextTh?: string;
  slaTextEn?: string;
  escalationPath?: string;
  integrationNotes?: string;
  reportingFrequency?: string;
  privacyNoteTh?: string;
  privacyNoteEn?: string;
};

export type ReservationBoundaryItem = {
  id: string;
  label: string;
  configured: boolean;
};

export type ReservationServiceBoundaries = ReservationServiceSettings & {
  handles: ReservationBoundaryItem[];
  hotelOwns: ReservationBoundaryItem[];
  slaApproved?: boolean;
};

export type ReservationsVisualLayout = ServiceVisual & {
  width: number;
  height: number;
  displayWidth: number;
  displayHeight: number;
};

export type ReservationsVisualOverride = {
  alt?: string;
  label?: string;
  caption?: string;
  status?: ServiceVisual["status"];
};

export const RESERVATIONS_CONTENT_STATUS: ContentStatus = "sample";

export const RESERVATIONS_HERO_VISUAL: ReservationsVisualLayout = {
  src: HERO_CANDIDATE,
  altTh: "ตัวอย่าง Reservation Operations Dashboard ใช้ Guest A และข้อมูลที่ redact แล้ว",
  altEn: "Sample Reservation Operations Dashboard using Guest A and redacted fields",
  status: "placeholder",
  recommendedSize: "1600 × 1000 px",
  aspectRatio: "8 / 5",
  width: 1600,
  height: 1000,
  displayWidth: 560,
  displayHeight: 350,
};

export const RESERVATIONS_HERO_LABEL = {
  th: "ตัวอย่าง Reservation Operations Dashboard",
  en: "Sample Reservation Operations Dashboard",
} as const;

export const RESERVATIONS_HERO_META = "Sample workflow · Inquiry, Booking and Confirmation";

export const RESERVATIONS_HERO_CAPTION = {
  th: "ดูแล Inquiry, Booking, Modification และ Confirmation ให้เป็นระบบเดียวกัน",
  en: "Keep Inquiry, Booking, Modification, and Confirmation in one system",
} as const;

export const HERO_CAPABILITIES = [
  { id: "inquiry", th: "Inquiry Handling", en: "Inquiry Handling" },
  { id: "availability", th: "Availability and Rate Check", en: "Availability and Rate Check" },
  { id: "entry", th: "Booking Entry", en: "Booking Entry" },
  { id: "change", th: "Modification and Cancellation", en: "Modification and Cancellation" },
  { id: "confirm", th: "Confirmation", en: "Confirmation" },
  { id: "channel", th: "Channel Coordination", en: "Channel Coordination" },
  { id: "report", th: "Reservation Reporting", en: "Reservation Reporting" },
] as const;

export const RESERVATIONS_PROBLEM_VISUAL: ReservationsVisualLayout = {
  src: PROBLEM_CANDIDATE,
  altTh: "ตัวอย่าง Reservation Queue / Booking Inbox ใช้ Guest A และ Guest B โดยไม่มีรหัสจองจริง",
  altEn: "Sample Reservation Queue / Booking Inbox using Guest A and Guest B, with no real booking IDs",
  status: "placeholder",
  recommendedSize: "1200 × 800 px",
  aspectRatio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 480,
  displayHeight: 320,
};

export const RESERVATIONS_PROBLEM_LABEL = "ตัวอย่าง Reservation Queue / Booking Inbox";

/** Sample aliases only. Never a real guest name, email, phone, or booking ID. */
export const SAMPLE_INBOX = [
  { guest: "Guest A", channel: "LINE", code: "Sample request", status: "Waiting hotel rate" },
  { guest: "Guest B", channel: "Email", code: "Sample request", status: "Follow-up" },
  { guest: "Guest A", channel: "Phone", code: "Sample booking", status: "Handover to hotel" },
] as const;

export const RESERVATION_PROBLEM_ITEMS = [
  {
    problemTh: "ทีมต้องสลับระหว่างดูแลแขกตรงหน้ากับตอบลูกค้าที่กำลังจะจอง",
    problemEn: "Staff have to switch between the guest in front of them and a message from someone about to book",
    impactTh: "คำถามรอค้าง ลูกค้าอาจเปลี่ยนไปจองช่องทางอื่น",
    impactEn: "The enquiry waits, and the guest may book on another channel",
    supportTh: "จัดลำดับและตอบคำขอตามขั้นตอนที่โรงแรมอนุมัติ",
    supportEn: "Queue and reply to requests by the process the hotel has approved",
  },
  {
    problemTh: "คำถามเข้ามาหลายช่องทาง แต่ไม่มีคนติดตามต่อจนจบ",
    problemEn: "Questions arrive on several channels, and no one follows them through to a result",
    impactTh: "เกิดการตอบซ้ำ หรือคำถามหลุดระหว่างทาง",
    impactEn: "Replies are duplicated, or an enquiry is lost between channels",
    supportTh: "รวมขั้นตอนการตรวจสอบและบันทึกข้อมูลจากช่องทางที่ตกลงกัน",
    supportEn: "Bring the check and record steps together on the agreed channels",
  },
  {
    problemTh: "ราคาและเงื่อนไขไม่ตรงกัน เพราะข้อมูลกระจายอยู่หลายที่",
    problemEn: "Guests get different rates and conditions because the facts sit in several places",
    impactTh: "ลูกค้าได้ข้อมูลไม่ชุดเดียวกัน",
    impactEn: "The guest does not get one consistent set of facts",
    supportTh: "ตอบจากห้อง ราคา และเงื่อนไขที่โรงแรมอนุมัติ",
    supportEn: "Reply from the rooms, rates, and conditions the hotel has approved",
  },
  {
    problemTh: "ลูกค้าสนใจจองตรง แต่ขั้นตอนเสนอราคา ชำระเงิน และยืนยันยังไม่ชัด",
    problemEn: "A guest wants to book direct, but the quote, payment, and confirmation steps are still unclear",
    impactTh: "การจองตรงค้าง ไม่เดินต่อ",
    impactEn: "The direct booking stalls and does not continue",
    supportTh: "ดูแลขั้นตอนเสนอห้อง ติดตาม และยืนยันตามขอบเขตที่อนุมัติ",
    supportEn: "Look after the offer, follow-up, and confirmation within the approved scope",
  },
  {
    problemTh: "ยืนยันการจองแล้ว แต่ข้อมูลไม่ครบตอนส่งต่อให้หน้างาน",
    problemEn: "The booking is confirmed, but key details do not reach the front desk in full",
    impactTh: "ทีมหน้างานต้องถามซ้ำ และแขกต้องเล่าเรื่องเดิมอีกครั้ง",
    impactEn: "The floor team has to ask again, and the guest repeats the same story",
    supportTh: "สรุปข้อมูลการจองและคำขอพิเศษให้ทีมโรงแรมรับช่วงต่อ",
    supportEn: "Summarise the booking and special requests for the hotel team",
  },
  {
    problemTh: "เจ้าของโรงแรมยังไม่เห็นว่าลูกค้าหายไปตรงไหนในขั้นตอนการจอง",
    problemEn: "The owner cannot see how many people asked, or where a direct booking was lost",
    impactTh: "ไม่เห็นจุดที่คำถามไม่กลายเป็นการจอง",
    impactEn: "The hotel cannot see where an enquiry stopped becoming a booking",
    supportTh: "แชร์ข้อเท็จจริงจากช่องทางและระบบที่มีอยู่ เพื่อทบทวนร่วมกัน",
    supportEn: "Share facts from the channels and systems in place, so the hotel can review them",
  },
] as const;

export const RESERVATIONS_SERVICE_MAP_VISUAL: ReservationsVisualLayout = {
  src: SERVICE_MAP_CANDIDATE,
  altTh: "ตัวอย่าง Reservation Service Map แสดงงานในขอบเขตบริการ",
  altEn: "Sample Reservation Service Map of work in the service scope",
  status: "placeholder",
  recommendedSize: "1600 × 900 px",
  aspectRatio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
};

export const RESERVATIONS_SERVICE_MAP_LABEL = "Reservation Service Map — Sample workflow";

export const RESERVATIONS_BOOKING_FLOW_VISUAL: ReservationsVisualLayout = {
  src: BOOKING_FLOW_CANDIDATE,
  altTh: "ตัวอย่าง Inquiry to Confirmation Flow จากคำถามถึงการยืนยันและรายงาน",
  altEn: "Sample Inquiry to Confirmation Flow from enquiry to confirmation and report",
  status: "placeholder",
  recommendedSize: "1600 × 900 px",
  aspectRatio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
};

export const RESERVATIONS_BOOKING_FLOW_LABEL = "Inquiry to Confirmation Flow · Sample workflow";

export const BOOKING_FLOW_STEPS = [
  { id: "inquiry", number: "01", label: "Guest Inquiry" },
  { id: "response", number: "02", label: "Fast Response" },
  { id: "availability", number: "03", label: "Availability / Rate Check" },
  { id: "confirm", number: "04", label: "Booking Confirmation" },
  { id: "record", number: "05", label: "Accurate Record" },
  { id: "followup", number: "06", label: "Follow-up / Report" },
] as const;

export const RESERVATION_BENEFIT_GROUPS = [
  {
    id: "revenue",
    titleTh: "รายได้",
    titleEn: "Revenue",
    items: [
      {
        th: "ลดโอกาสการจองที่หลุด",
        en: "Reduce missed booking opportunities",
      },
      {
        th: "ช่วยให้การจองตรงเดินต่อได้",
        en: "Support Direct Booking continuity",
      },
      {
        th: "แชร์สัญญาณความต้องการและคำถามให้ทีมที่เกี่ยวข้อง",
        en: "Share demand and inquiry signals with related teams",
      },
    ],
  },
  {
    id: "operations",
    titleTh: "งานปฏิบัติ",
    titleEn: "Operations",
    items: [
      {
        th: "ลดงานซ้ำที่ทีมหน้างานต้องทำ",
        en: "Reduce repetitive workload",
      },
      {
        th: "ทำให้ขั้นตอนตอบและบันทึกเป็นระบบเดียวกัน",
        en: "Standardize response and recording workflow",
      },
      {
        th: "ลดข้อผิดพลาดในรายละเอียดการจอง",
        en: "Reduce booking-detail errors",
      },
    ],
  },
  {
    id: "guest",
    titleTh: "ประสบการณ์แขก",
    titleEn: "Guest experience",
    items: [
      {
        th: "ตอบลูกค้าได้สม่ำเสมอขึ้น",
        en: "More consistent responses",
      },
      {
        th: "ข้อมูลก่อนเข้าพักชัดขึ้น",
        en: "Clearer pre-arrival information",
      },
      {
        th: "ติดตามคำขอแก้ไขและยกเลิกได้ดีขึ้น",
        en: "Better tracking of modification and cancellation requests",
      },
    ],
  },
] as const;

export const RESERVATIONS_WORKFLOW_VISUAL: ReservationsVisualLayout = {
  src: HANDOFF_CANDIDATE,
  altTh: "ตัวอย่าง Reservation Team Handoff Map แสดงการส่งต่องานกับทีมโรงแรม",
  altEn: "Sample Reservation Team Handoff Map of work passed with the hotel team",
  status: "placeholder",
  recommendedSize: "1600 × 900 px",
  aspectRatio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 640,
  displayHeight: 360,
};

export const RESERVATIONS_HANDOFF_LABEL = "Reservation Team Handoff Map — Sample workflow";

export const RESERVATIONS_KPI_VISUAL: ReservationsVisualLayout = {
  src: KPI_CANDIDATE,
  altTh: "ตัวอย่าง Reservation Operations KPI ไม่ใช่ผลลัพธ์ของโรงแรม",
  altEn: "Sample Reservation Operations KPI visual. Not hotel results",
  status: "placeholder",
  recommendedSize: "1600 × 900 px",
  aspectRatio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
};

export const RESERVATIONS_KPI_LABEL = "Reservation Operations KPI · Sample data";

export const RESERVATIONS_RELATED_VISUAL: ReservationsVisualLayout = {
  src: RELATED_CANDIDATE,
  altTh: "ตัวอย่างเนื้อหา Direct Booking และงานจอง ไม่ใช่ผลงานลูกค้า",
  altEn: "Sample Direct Booking and Reservations content visual. Not a client result",
  status: "placeholder",
  recommendedSize: "1200 × 800 px",
  aspectRatio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 520,
  displayHeight: 347,
};

export const RESERVATIONS_RELATED_LABEL = "Direct Booking / Reservations Content";

export const RESERVATIONS_RELATED_TOPICS = [
  "Direct Booking Funnel",
  "Reservation SOP",
  "Booking Engine Review",
  "Guest Inquiry Workflow",
  "Reservation Report",
] as const;

export const RESERVATIONS_TEAM_VISUAL: ReservationsVisualLayout = {
  src: TEAM_CANDIDATE,
  altTh: "Replace with verified Reservations Team image",
  altEn: "Replace with verified Reservations Team image",
  status: "placeholder",
  recommendedSize: "1200 × 800 px",
  aspectRatio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 420,
  displayHeight: 280,
};

export const RESERVATIONS_TEAM_LABEL = "Replace with verified Reservations Team image";

export const RESERVATION_KPI_COLORS = {
  positive: "#A2DC25",
  target: "#EBE722",
  warning: "#C9A227",
  axis: "#617487",
  navy: "#0B1F33",
} as const;

export function resolveReservationsVisualSrc(visual: ServiceVisual) {
  return visual.src ? publicSrc(visual.src) : undefined;
}

export function reservationsHeroVisualUrl() {
  return resolveReservationsVisualSrc(RESERVATIONS_HERO_VISUAL);
}

export function reservationsProblemVisualUrl() {
  return resolveReservationsVisualSrc(RESERVATIONS_PROBLEM_VISUAL);
}

export function reservationsWorkflowVisualUrl() {
  return resolveReservationsVisualSrc(RESERVATIONS_WORKFLOW_VISUAL);
}

export function reservationsServiceMapVisualUrl() {
  return resolveReservationsVisualSrc(RESERVATIONS_SERVICE_MAP_VISUAL);
}

export function reservationsBookingFlowVisualUrl() {
  return resolveReservationsVisualSrc(RESERVATIONS_BOOKING_FLOW_VISUAL);
}

export function reservationsKpiVisualUrl() {
  return resolveReservationsVisualSrc(RESERVATIONS_KPI_VISUAL);
}

export function reservationsRelatedVisualUrl(exclude: Array<string | undefined> = []) {
  const src = resolveReservationsVisualSrc(RESERVATIONS_RELATED_VISUAL);
  if (!src || exclude.includes(src)) return undefined;
  return src;
}

export function reservationsTeamVisualUrl(exclude: Array<string | undefined> = []) {
  const src = resolveReservationsVisualSrc(RESERVATIONS_TEAM_VISUAL);
  if (!src || exclude.includes(src)) return undefined;
  return src;
}

/** Fake queue rows only. Never use a real guest name, email, phone, or booking ID. */
export const SAMPLE_QUEUE = [
  { guest: "Guest A", channel: "LINE", status: "Waiting hotel rate", owner: "Hotel" },
  { guest: "Guest A", channel: "Email", status: "Offer sent · follow-up", owner: "KPI Plus" },
  { guest: "Guest A", channel: "Phone", status: "Handover to hotel", owner: "Hotel" },
] as const;

export const SCOPE_ITEMS: ServiceScopeItem[] = [
  {
    id: "inquiry",
    titleTh: "Inquiry Handling",
    titleEn: "Inquiry Handling",
    descriptionTh: "ดูแลคำถามจากช่องทางที่ตกลงกัน พร้อมตอบเรื่องห้องว่าง ราคา และเงื่อนไข",
    descriptionEn: "Look after questions on the agreed channels, using rooms, rates, and conditions the hotel has approved.",
    inputTh: "คำถามจาก Direct, Email หรือโทรศัพท์",
    inputEn: "Guest enquiry on Direct, Email, or Phone",
    outputTh: "บันทึกการตอบคำถาม",
    outputEn: "Response Log",
    channels: ["Direct", "Email", "Phone"],
    order: 1,
  },
  {
    id: "entry",
    titleTh: "Booking Entry",
    titleEn: "Booking Entry",
    descriptionTh: "ยืนยันหรือบันทึกข้อมูลการจองตามขอบเขตบริการที่ตกลงกัน",
    descriptionEn: "Record or hand the booking within the agreed service scope.",
    inputTh: "วันเข้าพัก จำนวนแขก ราคา และข้อมูลที่ต้องใช้",
    inputEn: "Stay dates, guests, rate, and needed details",
    outputTh: "บันทึกการจองที่ยืนยันแล้ว",
    outputEn: "Confirmed Reservation Record",
    channels: ["Direct", "Email"],
    order: 2,
  },
  {
    id: "availability",
    titleTh: "Availability / Rate Check",
    titleEn: "Availability / Rate Check",
    descriptionTh: "ตรวจห้องว่างและราคาจากข้อมูลที่โรงแรมอนุมัติ แล้วแจ้งตัวเลือกให้ลูกค้า",
    descriptionEn: "Check availability and state the options clearly, using rooms and rates the hotel has approved.",
    inputTh: "วันเข้าพัก จำนวนแขก และคำขอราคา",
    inputEn: "Stay dates, occupancy, and rate request",
    outputTh: "ตัวเลือกห้องว่างและราคาที่อนุมัติ",
    outputEn: "Approved availability and rate options",
    channels: ["Direct", "Email", "Phone", "OTA"],
    order: 3,
  },
  {
    id: "modify",
    titleTh: "Modification",
    titleEn: "Modification",
    descriptionTh: "ปรับรายละเอียดการจองตามคำขอ โดยใช้เงื่อนไขที่โรงแรมอนุมัติ",
    descriptionEn: "Update the booking on request, using the conditions the hotel has approved.",
    inputTh: "ข้อมูลการจองเดิม และรายการที่ต้องการเปลี่ยน",
    inputEn: "Existing booking details and the requested change",
    outputTh: "บันทึกการจองที่อัปเดตแล้ว",
    outputEn: "Updated Booking Record",
    channels: ["Direct", "Email", "Phone"],
    order: 4,
  },
  {
    id: "cancel",
    titleTh: "Cancellation",
    titleEn: "Cancellation",
    descriptionTh: "ดำเนินการยกเลิกตามนโยบายที่โรงแรมกำหนด และบันทึกสถานะให้ชัด",
    descriptionEn: "Run the cancellation by the hotel’s policy, and record the status clearly.",
    inputTh: "บันทึกการจอง และคำขอยกเลิก",
    inputEn: "Booking record and cancellation request",
    outputTh: "สถานะการยกเลิก",
    outputEn: "Cancellation Status",
    channels: ["Direct", "Email", "Phone"],
    order: 5,
  },
  {
    id: "confirm",
    titleTh: "Confirmation",
    titleEn: "Confirmation",
    descriptionTh: "ตรวจรายละเอียดการเข้าพัก ราคา และการชำระเงินก่อนส่งข้อความหรือบันทึกยืนยัน",
    descriptionEn: "Check stay dates, guests, rate, and payment details before sending the confirmation message or record.",
    inputTh: "รายละเอียดเข้าพัก ราคา และสถานะการชำระเงินที่ตรวจแล้ว",
    inputEn: "Checked stay details, rate, and payment status",
    outputTh: "ข้อความหรือบันทึกยืนยัน",
    outputEn: "Confirmation Message / Record",
    channels: ["Direct", "Email"],
    order: 6,
  },
  {
    id: "channel",
    titleTh: "Channel Coordination",
    titleEn: "Channel Coordination",
    descriptionTh: "ประสานข้อมูลห้องว่างให้สอดคล้องกันในช่องทางที่ตกลงกัน",
    descriptionEn: "Keep availability information consistent across the agreed channels.",
    inputTh: "ข้อมูลห้องว่างและการจองจากช่องทางที่ตกลงกัน",
    inputEn: "Availability and booking updates from agreed channels",
    outputTh: "ข้อมูลห้องว่างที่สอดคล้องกัน",
    outputEn: "Consistent Availability Information",
    channels: ["Direct", "Email", "Phone", "OTA"],
    order: 7,
  },
  {
    id: "report",
    titleTh: "Reservation Reporting",
    titleEn: "Reservation Reporting",
    descriptionTh: "สรุปข้อเท็จจริงจากงานจองตามช่องทางและระบบที่มีอยู่ เพื่อให้โรงแรมทบทวนร่วมกัน",
    descriptionEn: "Share reservation facts from the channels and systems in place, so the hotel can review them.",
    inputTh: "ข้อเท็จจริงจากคำถาม การจอง และช่องทางที่มีอยู่",
    inputEn: "Enquiry, booking, and channel facts from systems in use",
    outputTh: "สรุปงานจองรายสัปดาห์",
    outputEn: "Weekly Reservation Summary",
    order: 8,
  },
];

/** Hotel-owned items to state in the service scope. Not a published operating contract. */
export const HOTEL_OWNED_WHEN_APPLICABLE = [
  { id: "rate", th: "กลยุทธ์ราคา", en: "Rate Strategy" },
  { id: "inventory", th: "นโยบายห้องว่าง", en: "Inventory Policy" },
  { id: "refund", th: "ข้อยกเว้นการคืนเงิน", en: "Refund Exceptions" },
  { id: "compensation", th: "การชดเชยแขก", en: "Guest Compensation" },
  { id: "policy", th: "นโยบายปฏิบัติงานขั้นสุดท้าย", en: "Final Operational Policies" },
] as const;

export const RESERVATION_HANDLE_CATALOGUE: readonly Omit<ReservationBoundaryItem, "configured">[] = [
  { id: "inquiry", label: "Inquiry Handling" },
  { id: "entry", label: "Booking Entry" },
  { id: "modify-cancel", label: "Modification / Cancellation" },
  { id: "confirm", label: "Confirmation" },
  { id: "summary", label: "Reservation Summary" },
  { id: "channel", label: "Channel Coordination" },
] as const;

export const RESERVATION_HOTEL_CATALOGUE: readonly Omit<ReservationBoundaryItem, "configured">[] = [
  { id: "rate", label: "Rate Strategy" },
  { id: "inventory", label: "Inventory Policy" },
  { id: "refund", label: "Refund Exceptions" },
  { id: "compensation", label: "Guest Compensation" },
  { id: "policy", label: "Final Operational Policies" },
] as const;

export const RESERVATION_WORKFLOW_STEPS: ReservationWorkflowStep[] = [
  {
    id: "inquiry",
    number: "01",
    titleTh: "รับคำถาม",
    titleEn: "Receive Inquiry",
    descriptionTh: "คำขอนอกขอบเขตที่ตกลงกัน ส่งต่อให้โรงแรม",
    descriptionEn: "Out-of-scope requests are handed to the hotel",
    ownerTh: "ทีม Reservations",
    ownerEn: "Reservation Team",
    inputTh: "Email / Phone / OTA / Direct",
    inputEn: "Email / Phone / OTA / Direct",
    outputTh: "คำขอที่บันทึกแล้ว",
    outputEn: "Logged Request",
    escalationTh: "คำขอที่นอกช่องทางหรือนอกเวลาที่ตกลงกัน ส่งต่อให้โรงแรม",
    escalationEn: "Requests outside the agreed channels or hours go to the hotel",
    order: 1,
  },
  {
    id: "availability",
    number: "02",
    titleTh: "ตรวจห้องว่างและเงื่อนไข",
    titleEn: "Check Availability and Conditions",
    descriptionTh: "โรงแรมอนุมัติเรทและห้องเมื่อจำเป็น",
    descriptionEn: "Hotel approves the rate and room when needed",
    ownerTh: "ทีม Reservations + โรงแรม",
    ownerEn: "Reservation Team + Hotel",
    inputTh: "วันเข้าพัก จำนวนแขก และเงื่อนไขที่ขอ",
    inputEn: "Stay dates, occupancy, and requested conditions",
    outputTh: "ตัวเลือกห้องและราคาที่มี",
    outputEn: "Available Rate / Room Option",
    escalationTh: "ราคาหรือห้องที่นอกเงื่อนไขที่อนุมัติ ส่งต่อให้โรงแรม",
    escalationEn: "Rates or rooms outside approved conditions go to the hotel",
    order: 2,
  },
  {
    id: "confirm",
    number: "03",
    titleTh: "ยืนยันและบันทึกการจอง",
    titleEn: "Confirm and Record Booking",
    descriptionTh: "โรงแรมรับบันทึกการจองที่ยืนยันแล้ว",
    descriptionEn: "Hotel receives the confirmed booking record",
    ownerTh: "ทีม Reservations",
    ownerEn: "Reservation Team",
    inputTh: "ตัวเลือกห้องและราคาที่อนุมัติ และรายละเอียดเข้าพัก",
    inputEn: "Approved rate or room option and stay details",
    outputTh: "บันทึกการจองที่ยืนยันแล้ว",
    outputEn: "Confirmed Booking Record",
    escalationTh: "ข้อยกเว้นการคืนเงิน การชดเชย หรือนโยบาย ส่งต่อให้โรงแรม",
    escalationEn: "Refund, compensation, or policy exceptions go to the hotel",
    order: 3,
  },
  {
    id: "report",
    number: "04",
    titleTh: "รายงานและติดตาม",
    titleEn: "Report and Follow Up",
    descriptionTh: "ผู้จัดการโรงแรมทบทวนสรุปและประเด็น",
    descriptionEn: "Hotel Manager reviews the summary and issues",
    ownerTh: "ทีม Reservations + ผู้จัดการโรงแรม",
    ownerEn: "Reservation Team + Hotel Manager",
    inputTh: "การจองที่ยืนยันแล้ว และรายการที่ต้องติดตาม",
    inputEn: "Confirmed bookings and open follow-up items",
    outputTh: "สรุปงานจอง / รายการประเด็น",
    outputEn: "Reservation Summary / Issue List",
    escalationTh: "ประเด็นที่ต้องให้โรงแรมตัดสินใจ ส่งต่อให้ผู้จัดการโรงแรม",
    escalationEn: "Issues that need a hotel decision go to the Hotel Manager",
    order: 4,
  },
];

const KPI_PERIOD_TH = "รายเดือน เมื่อช่องทางและระบบของโรงแรมมีข้อมูล";
const KPI_PERIOD_EN = "Monthly, when the hotel’s channels and systems provide the data";

export const RESERVATION_KPIS: ReservationKpi[] = [
  {
    id: "inquiry-volume",
    name: "Inquiry volume",
    definitionTh: "จำนวนคำถามที่รับในรอบวัด",
    definitionEn: "Number of enquiries received in the period",
    unit: "count",
    periodTh: KPI_PERIOD_TH,
    periodEn: KPI_PERIOD_EN,
    dataStatus: "Sample",
    labels: ["Period 1", "Period 2", "Period 3", "Period 4"],
    values: [8, 11, 9, 14],
  },
  {
    id: "response-time",
    name: "Average response time",
    definitionTh: "เวลาตอบกลับเฉลี่ยในรอบวัด ไม่ใช่ค่า SLA ที่รับประกัน",
    definitionEn: "Average reply time in the period. Not a guaranteed SLA.",
    unit: "hours",
    periodTh: KPI_PERIOD_TH,
    periodEn: KPI_PERIOD_EN,
    dataStatus: "Sample",
    labels: [],
    values: [],
  },
  {
    id: "conversion",
    name: "Booking conversion rate",
    definitionTh: "สัดส่วนคำถามที่กลายเป็นการจองในรอบวัด",
    definitionEn: "Share of enquiries that became bookings in the period",
    unit: "%",
    periodTh: KPI_PERIOD_TH,
    periodEn: KPI_PERIOD_EN,
    dataStatus: "Sample",
    labels: [],
    values: [],
  },
  {
    id: "accuracy",
    name: "Booking accuracy",
    definitionTh: "สัดส่วนบันทึกการจองที่ไม่ต้องแก้หลังจากบันทึก",
    definitionEn: "Share of booking records that did not need a correction after entry",
    unit: "%",
    periodTh: KPI_PERIOD_TH,
    periodEn: KPI_PERIOD_EN,
    dataStatus: "Sample",
    labels: [],
    values: [],
  },
  {
    id: "changes",
    name: "Modification / cancellation volume",
    definitionTh: "จำนวนการแก้ไขและยกเลิกในรอบวัด",
    definitionEn: "Number of modifications and cancellations in the period",
    unit: "count",
    periodTh: KPI_PERIOD_TH,
    periodEn: KPI_PERIOD_EN,
    dataStatus: "Sample",
    labels: [],
    values: [],
  },
  {
    id: "resolved",
    name: "Resolved issue count",
    definitionTh: "จำนวนประเด็นที่ปิดได้ในรอบวัด",
    definitionEn: "Number of issues closed in the period",
    unit: "count",
    periodTh: KPI_PERIOD_TH,
    periodEn: KPI_PERIOD_EN,
    dataStatus: "Sample",
    labels: [],
    values: [],
  },
  {
    id: "direct-share",
    name: "Direct Booking share",
    definitionTh: "สัดส่วนการจองตรง เมื่อมีข้อมูลจากช่องทางและระบบของโรงแรม",
    definitionEn: "Share of direct bookings, only when the hotel’s systems provide the data",
    unit: "%",
    periodTh: KPI_PERIOD_TH,
    periodEn: KPI_PERIOD_EN,
    dataStatus: "Sample",
    labels: [],
    values: [],
    hideUntilData: true,
  },
];

export const RESERVATION_SERVICE_SETTINGS: ReservationServiceSettings = {
  supportedChannels: ["LINE", "Email", "Social", "Phone", "Website"],
  supportedLanguages: [],
  operatingHours: "",
  slaTextTh: "ช่วงเวลาที่ดูแลจะระบุในขอบเขตบริการของแต่ละโรงแรม รวมถึงวิธีรับและส่งต่องานนอกเวลาที่ตกลงกัน",
  slaTextEn: "The hours of cover are written in each hotel’s service scope, including how work outside those hours is received and handed over.",
  escalationPath:
    "The hotel sets the policy and approval rights. Anything outside those conditions goes back to the hotel owner of that decision.",
  integrationNotes:
    "The hotel does not need to change the PMS first. The team reviews the current system, access, and how details are handed over.",
  reportingFrequency: "",
  privacyNoteTh: "หน้านี้ไม่แสดงชื่อแขก อีเมล เบอร์โทร รหัสจองจริง หรือบันทึกการจองที่เป็นความลับ",
  privacyNoteEn: "This page does not publish guest names, emails, phone numbers, real booking IDs, or private reservation notes.",
};

export const DEFAULT_RESERVATION_BOUNDARIES: ReservationServiceBoundaries = {
  ...RESERVATION_SERVICE_SETTINGS,
  slaApproved: true,
  handles: RESERVATION_HANDLE_CATALOGUE.map((item) => ({ ...item, configured: true })),
  hotelOwns: RESERVATION_HOTEL_CATALOGUE.map((item) => ({ ...item, configured: true })),
};

export type ReservationBoundaryField = {
  id: string;
  labelTh: string;
  labelEn: string;
  required: boolean;
  value: string;
};

function textValue(value?: string) {
  return value?.trim() ?? "";
}

function listValue(values?: string[]) {
  return (values ?? []).map((item) => item.trim()).filter(Boolean);
}

export function reservationConfiguredItems(items: ReservationBoundaryItem[]) {
  return items.filter((item) => item.configured);
}

export function reservationBoundaryFields(
  boundaries: ReservationServiceBoundaries,
  locale: "th" | "en" | "ru" | "zh",
): ReservationBoundaryField[] {
  const thai = locale === "th";
  return [
    {
      id: "channels",
      labelTh: "ช่องทางที่รองรับ",
      labelEn: "Supported channels",
      required: true,
      value: listValue(boundaries.supportedChannels).join(" · "),
    },
    {
      id: "languages",
      labelTh: "ภาษาที่รองรับ",
      labelEn: "Supported languages",
      required: false,
      value: listValue(boundaries.supportedLanguages).join(" · "),
    },
    {
      id: "hours",
      labelTh: "เวลาทำการ",
      labelEn: "Operating hours",
      required: false,
      value: textValue(boundaries.operatingHours),
    },
    {
      id: "sla",
      labelTh: "ข้อความ SLA",
      labelEn: "SLA wording",
      required: true,
      value:
        boundaries.slaApproved === false
          ? ""
          : textValue(thai ? boundaries.slaTextTh : boundaries.slaTextEn) ||
            textValue(boundaries.slaTextEn) ||
            textValue(boundaries.slaTextTh),
    },
    {
      id: "escalation",
      labelTh: "เส้นทางส่งต่อ",
      labelEn: "Escalation path",
      required: true,
      value: textValue(boundaries.escalationPath),
    },
    {
      id: "integration",
      labelTh: "หมายเหตุ PMS / Booking Engine",
      labelEn: "PMS / Booking Engine notes",
      required: false,
      value: textValue(boundaries.integrationNotes),
    },
    {
      id: "reporting",
      labelTh: "ความถี่ของรายงาน",
      labelEn: "Reporting frequency",
      required: false,
      value: textValue(boundaries.reportingFrequency),
    },
    {
      id: "privacy",
      labelTh: "ความเป็นส่วนตัวและความปลอดภัย",
      labelEn: "Privacy / security note",
      required: false,
      value: textValue(thai ? boundaries.privacyNoteTh : boundaries.privacyNoteEn) || textValue(boundaries.privacyNoteEn) || textValue(boundaries.privacyNoteTh),
    },
  ];
}

export function reservationBoundaryPublicFields(
  boundaries: ReservationServiceBoundaries,
  locale: "th" | "en" | "ru" | "zh",
) {
  return reservationBoundaryFields(boundaries, locale).filter((field) => field.value);
}

export function reservationBoundaryIncomplete(boundaries: ReservationServiceBoundaries) {
  const missing: string[] = [];
  if (!reservationConfiguredItems(boundaries.handles).length) {
    missing.push("The KPI Plus handles");
  }
  if (!reservationConfiguredItems(boundaries.hotelOwns).length) {
    missing.push("Hotel approves or owns");
  }
  for (const field of reservationBoundaryFields(boundaries, "en")) {
    if (field.required && !field.value) missing.push(field.labelEn);
  }
  return missing;
}

export type ReservationFlowStep = {
  number: string;
  title: string;
  description: string;
  output: string;
};

const RESERVATION_FLOW_SOURCE = [
  {
    number: "01",
    titleTh: "รับคำถาม",
    titleEn: "Guest Inquiry",
    descriptionTh: "ดูแลคำถามจากช่องทางที่ตกลงกัน เช่น LINE อีเมล โซเชียล หรือโทรศัพท์",
    descriptionEn: "Look after questions on the agreed channels, such as LINE, email, social messages, or the phone.",
    outputTh: "คำถามที่บันทึกในคิว",
    outputEn: "Logged request",
  },
  {
    number: "02",
    titleTh: "ตรวจห้องและราคา",
    titleEn: "Check Availability",
    descriptionTh: "ช่วยแนะนำตัวเลือกที่เหมาะสม จากห้องว่าง ราคา และเงื่อนไขที่โรงแรมอนุมัติ",
    descriptionEn: "Check availability and state the options and conditions clearly, using rooms and rates the hotel has approved.",
    outputTh: "ตัวเลือกที่โรงแรมอนุมัติ",
    outputEn: "Available option",
  },
  {
    number: "03",
    titleTh: "ยืนยันการจอง",
    titleEn: "Confirm Booking",
    descriptionTh: "ตรวจรายละเอียดการเข้าพัก ราคา การชำระเงิน และข้อมูลสำคัญก่อนยืนยัน",
    descriptionEn: "Check the stay dates, guests, rate, and needed details before recording or handing the booking.",
    outputTh: "ข้อมูลที่ยืนยันตามที่โรงแรมอนุมัติ",
    outputEn: "Confirmed record",
  },
  {
    number: "04",
    titleTh: "ติดตามและส่งต่อ",
    titleEn: "Follow Up",
    descriptionTh: "ติดตามลูกค้าที่ยังไม่ยืนยัน และสรุปข้อมูลการจองให้ทีมโรงแรม",
    descriptionEn: "Follow people who asked but have not decided yet, then summarise the booking for the hotel team.",
    outputTh: "สรุปส่งต่อทีมโรงแรม",
    outputEn: "Reservation summary",
  },
] as const;

export function reservationFlowStepsFor(locale: "th" | "en" | "ru" | "zh"): ReservationFlowStep[] {
  const thai = locale === "th";
  return RESERVATION_FLOW_SOURCE.map((step) => ({
    number: step.number,
    title: thai ? step.titleTh : step.titleEn,
    description: thai ? step.descriptionTh : step.descriptionEn,
    output: thai ? step.outputTh : step.outputEn,
  }));
}

export function reservationsVisualAlt(visual: ServiceVisual, locale: "th" | "en" | "ru" | "zh") {
  return locale === "th" ? visual.altTh : visual.altEn;
}

export function reservationKpiHasValue(kpi: ReservationKpi) {
  return typeof kpi.value === "number" && Number.isFinite(kpi.value);
}

export function reservationKpiHasSeries(kpi: ReservationKpi) {
  return kpi.values.length > 0 && kpi.labels.length === kpi.values.length;
}

export function reservationKpiIsConfigured(kpi: ReservationKpi) {
  return reservationKpiHasValue(kpi) || reservationKpiHasSeries(kpi);
}

/** Public page: hide metrics with no value/series, and hide Direct Booking share until data exists. */
export function reservationKpisForPublic(kpis: readonly ReservationKpi[] = RESERVATION_KPIS) {
  return kpis.filter((kpi) => {
    if (kpi.hideUntilData) return reservationKpiIsConfigured(kpi);
    return true;
  });
}

export function reservationKpiAdminState(kpi: ReservationKpi) {
  return reservationKpiIsConfigured(kpi) ? kpi.dataStatus : "Data not configured";
}

export function reservationKpiPeriod(kpi: ReservationKpi, locale: "th" | "en" | "ru" | "zh") {
  return locale === "th" ? kpi.periodTh : kpi.periodEn;
}

export function reservationKpiUnitLabel(kpi: ReservationKpi, locale: "th" | "en" | "ru" | "zh") {
  if (!kpi.unit) return "";
  if (kpi.unit === "count") return locale === "th" ? "จำนวน" : "count";
  if (kpi.unit === "hours") return locale === "th" ? "ชั่วโมง" : "hours";
  return kpi.unit;
}

export function formatReservationKpiValue(kpi: ReservationKpi) {
  if (!reservationKpiHasValue(kpi) || kpi.value === undefined) return undefined;
  if (kpi.unit === "%") return `${kpi.value}%`;
  return String(kpi.value);
}

export function formatReservationKpiUpdatedAt(iso?: string) {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

export function reservationKpiLatestUpdatedAt(kpis: readonly ReservationKpi[] = RESERVATION_KPIS) {
  const dates = kpis
    .map((kpi) => formatReservationKpiUpdatedAt(kpi.updatedAt))
    .filter((value): value is string => Boolean(value));
  return dates.sort().at(-1);
}

export type ReservationKpiSeries = {
  name: string;
  color: string;
  values: number[];
  kind?: "positive" | "target" | "warning";
};

export function reservationKpiSeriesColor(item: ReservationKpiSeries) {
  if (item.kind === "target") return item.color || RESERVATION_KPI_COLORS.target;
  if (item.kind === "warning") return item.color || RESERVATION_KPI_COLORS.warning;
  return item.color || RESERVATION_KPI_COLORS.positive;
}

/** Plot only configured public series. Empty labels/values never invent a sample chart. */
export function reservationKpiPublicChart(kpis: readonly ReservationKpi[] = RESERVATION_KPIS) {
  const withSeries = reservationKpisForPublic(kpis).filter(reservationKpiHasSeries);
  if (!withSeries.length) return null;

  const primary = withSeries[0];
  const matched = withSeries.filter(
    (kpi) => kpi.unit === primary.unit && kpi.labels.join("\0") === primary.labels.join("\0"),
  );

  const series: ReservationKpiSeries[] = matched.map((kpi) => ({
    name: kpi.name,
    color: RESERVATION_KPI_COLORS.positive,
    values: [...kpi.values],
    kind: "positive" as const,
  }));

  if (typeof primary.target === "number" && Number.isFinite(primary.target)) {
    series.push({
      name: "Target",
      color: RESERVATION_KPI_COLORS.target,
      values: primary.labels.map(() => primary.target as number),
      kind: "target",
    });
  }

  return {
    labels: [...primary.labels],
    series,
    unit: primary.unit === "%" ? "%" : "",
  };
}
