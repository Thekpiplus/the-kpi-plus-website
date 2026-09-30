const SKIP_KEYS = new Set([
  "form",
  "name",
  "hotel",
  "organization",
  "business",
  "businessName",
  "phone",
  "email",
  "contact",
  "province",
  "location",
  "utm",
  "locale",
  "receivedAt",
  "honeypot",
  "consent",
  "serviceInterest",
]);

export const FORM_LABEL: Record<string, string> = {
  hotel_performance_audit: "Hotel Performance Audit",
  contact_enquiry: "Contact",
  revenue_enquiry: "Revenue & Commercial",
  reservations_enquiry: "Outsourced Reservations",
  b2b_enquiry: "B2B & Agent Sales",
  google_ads_enquiry: "Google Ads",
  meta_ads_enquiry: "Meta Ads",
  search_enquiry: "SEO / Google Maps / AI Search",
  website_enquiry: "Hotel Website Design",
  conversion_enquiry: "Website Conversion",
  hotel_systems_enquiry: "Hotel Systems Implementation",
  technology_enquiry: "Technology / AI",
  training_enquiry: "Training",
  independent_hotel_enquiry: "Independent Hotel Management",
};

const FIELD_LABEL: Record<string, string> = {
  helpWith: "อยากให้ทีมดู",
  status: "สถานะโรงแรม",
  goal: "เป้าหมาย",
  problem: "ปัญหาที่พบ",
  adsStatus: "สถานะโฆษณา",
  partners: "มีพาร์ตเนอร์ B2B อยู่แล้ว",
  concerns: "ประเด็นที่กังวล",
  focus: "จุดโฟกัส",
  topic: "เรื่องที่อยากให้ช่วย",
  serviceInterest: "บริการที่สนใจ",
  serviceLabel: "บริการที่สนใจ",
  rooms: "จำนวนห้อง",
  pms: "PMS",
  channel: "Channel Manager",
  booking: "ระบบจอง / Booking Engine",
  website: "เว็บไซต์",
  link: "ลิงก์",
  systems: "ระบบที่ใช้อยู่",
  channels: "ช่องทางขาย",
  whoHandles: "ใครดูแลการจอง",
  coverage: "ช่วงเวลาที่ต้องการความช่วยเหลือ",
  teamSize: "ขนาดทีม",
  market: "ตลาดที่สนใจ",
  role: "ตำแหน่ง",
  lineId: "LINE ID",
  type: "ประเภทกิจการ",
  details: "รายละเอียดเพิ่มเติม",
  message: "ข้อความ",
  province: "จังหวัด",
  location: "ที่ตั้ง",
  pageUrl: "หน้าเว็บที่ส่งมา",
};

const VALUE_LABEL: Record<string, string> = {
  reports: "รายงาน",
  reporting: "รายงาน",
  rates: "ราคา",
  rate: "ราคา",
  inventory: "ห้องว่าง",
  ota: "OTA",
  booking: "ระบบจอง",
  team: "การทำงานของทีม",
  unsure: "ยังไม่แน่ใจ",
  preopen: "ก่อนเปิด",
  operating: "เปิดดำเนินการอยู่",
  migrating: "กำลังย้ายระบบ",
  direct: "การจองตรง",
  marketing: "การตลาด",
  systems: "ระบบโรงแรม",
  overview: "ภาพรวม",
  using: "ใช้อยู่",
  used: "เคยใช้",
  never: "ไม่เคยใช้",
  "booking-path": "เส้นทางจอง",
  budget: "งบโฆษณา",
  awareness: "สร้างการรับรู้",
  enquiry: "สร้างการสอบถาม",
  occupancy: "Occupancy",
  hotel: "โรงแรม",
  spa: "สปา",
  cafe: "คาเฟ่",
  shop: "ร้านค้า",
  other: "อื่น ๆ",
  website: "เว็บไซต์",
  maps: "Google Maps",
  "ai-search": "AI Search",
  contact: "ข้อมูลติดต่อ",
  yes: "มี",
  no: "ไม่มี",
  find: "หาเอเยนต์",
  review: "ตรวจพาร์ตเนอร์ปัจจุบัน",
  look: "หน้าตาเว็บ",
  rooms: "หน้าห้องพัก",
  edit: "การแก้เนื้อหา",
  workshop: "เวิร์กช็อป",
  teambuilding: "Team building",
  academy: "Academy",
  leadership: "ภาวะผู้นำ",
  service: "บริการ",
  digital: "ทักษะดิจิทัล",
  "no-click": "เข้าเว็บแล้วไม่คลิกต่อ",
  "no-complete": "เริ่มจองแล้วไม่จบ",
  mobile: "ใช้บนมือถือยาก",
  unknown: "ยังไม่รู้จุดที่หลุด",
  workflow: "ขั้นตอนงาน",
  operations: "การดำเนินงาน",
  revenue: "รายได้",
  pricing: "ราคา",
  ads: "โฆษณา",
  owner: "เจ้าของ",
  gm: "GM",
  sales: "ขาย",
};

const FIELD_ORDER = [
  "serviceLabel",
  "helpWith",
  "status",
  "goal",
  "problem",
  "adsStatus",
  "partners",
  "concerns",
  "focus",
  "topic",
  "role",
  "type",
  "message",
  "details",
  "rooms",
  "pms",
  "channel",
  "booking",
  "website",
  "link",
  "systems",
  "channels",
  "whoHandles",
  "coverage",
  "teamSize",
  "market",
  "lineId",
  "pageUrl",
];

export type FormDetailRow = { key: string; label: string; value: string };

function displayValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => displayValue(item)).filter(Boolean).join(" · ");
  }
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return VALUE_LABEL[trimmed] ?? trimmed;
}

export function formLabel(form: string) {
  return FORM_LABEL[form] ?? form;
}

export function formDetailRows(payload: Record<string, unknown>): FormDetailRow[] {
  const keys = Object.keys(payload).filter((key) => !SKIP_KEYS.has(key) && payload[key] != null && payload[key] !== "");
  const ordered = [
    ...FIELD_ORDER.filter((key) => keys.includes(key)),
    ...keys.filter((key) => !FIELD_ORDER.includes(key)),
  ];
  return ordered
    .map((key) => {
      const value = displayValue(payload[key]);
      if (!value) return null;
      return { key, label: FIELD_LABEL[key] ?? key, value };
    })
    .filter((row): row is FormDetailRow => Boolean(row));
}

export function summarizeFormPayload(payload: Record<string, unknown>) {
  return formDetailRows(payload)
    .map((row) => `${row.label}: ${row.value}`)
    .join("\n");
}

export function parseLeadFormDetails(rawPayload: string | null | undefined): FormDetailRow[] {
  if (!rawPayload?.trim()) return [];
  try {
    const parsed = JSON.parse(rawPayload) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return [];
    return formDetailRows(parsed as Record<string, unknown>);
  } catch {
    return [];
  }
}

export function formInterestLine(rows: FormDetailRow[]) {
  const service = rows.find((row) => row.key === "serviceLabel" || row.key === "serviceInterest");
  if (service) return `${service.label}: ${service.value}`;
  const help = rows.find(
    (row) =>
      row.key === "helpWith" ||
      row.key === "topic" ||
      row.key === "goal" ||
      row.key === "problem" ||
      row.key === "concerns",
  );
  return help ? `${help.label}: ${help.value}` : "";
}
