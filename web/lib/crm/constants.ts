export const STAGES = [
  { name: "New lead", nameTh: "ลีดใหม่", sortOrder: 1, isWon: false, isLost: false },
  { name: "Contact attempted", nameTh: "พยายามติดต่อแล้ว", sortOrder: 2, isWon: false, isLost: false },
  { name: "Connected", nameTh: "คุยได้แล้ว", sortOrder: 3, isWon: false, isLost: false },
  { name: "Discovery / assessing needs", nameTh: "สำรวจความต้องการ", sortOrder: 4, isWon: false, isLost: false },
  { name: "Proposal sent", nameTh: "ส่งข้อเสนอแล้ว", sortOrder: 5, isWon: false, isLost: false },
  { name: "Negotiation", nameTh: "เจรจา", sortOrder: 6, isWon: false, isLost: false },
  { name: "Won", nameTh: "ปิดได้", sortOrder: 7, isWon: true, isLost: false },
  { name: "Lost", nameTh: "ไม่สำเร็จ", sortOrder: 8, isWon: false, isLost: true },
] as const;

export const SERVICES = [
  "Revenue Management",
  "OTA / Distribution",
  "Hotel systems",
  "Marketing",
  "Training",
  "AI implementation",
] as const;

export const SOURCES = [
  "website_form",
  "phone",
  "line",
  "whatsapp",
  "referral",
  "partner_referral",
  "event",
  "manual",
] as const;

export const ACTIVITY_TYPES = [
  "call",
  "email",
  "line",
  "whatsapp",
  "meeting",
  "proposal",
  "task",
] as const;

export const ACTIVITY_LABEL: Record<(typeof ACTIVITY_TYPES)[number], string> = {
  call: "โทร",
  email: "อีเมล",
  line: "LINE",
  whatsapp: "WhatsApp",
  meeting: "นัดคุย",
  proposal: "ส่งข้อเสนอ",
  task: "งานติดตาม",
};

export const LOST_REASONS = [
  "ราคาไม่ตรง",
  "เลือกคู่แข่ง",
  "ยังไม่พร้อม",
  "ติดต่อไม่ได้",
  "ไม่เข้าเงื่อนไขบริการ",
  "อื่น ๆ",
] as const;

export const FORM_SERVICE: Record<string, string> = {
  hotel_performance_audit: "Revenue Management",
  contact_enquiry: "Revenue Management",
  revenue_enquiry: "Revenue Management",
  reservations_enquiry: "OTA / Distribution",
  b2b_enquiry: "OTA / Distribution",
  google_ads_enquiry: "Marketing",
  meta_ads_enquiry: "Marketing",
  search_enquiry: "Marketing",
  website_enquiry: "Marketing",
  conversion_enquiry: "Marketing",
  hotel_systems_enquiry: "Hotel systems",
  technology_enquiry: "AI implementation",
  training_enquiry: "Training",
  independent_hotel_enquiry: "Revenue Management",
  general_enquiry: "Revenue Management",
};

export const SESSION_HOURS = 12;
export const DEVICE_CODE_MINUTES = 15;
export const RESET_MINUTES = 20;
export const IP_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
export const IP_ATTEMPT_LIMIT = 20;
export const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;
