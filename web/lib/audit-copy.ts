import { AUDIT_FOCUS_VALUES, AUDIT_RESPONSE_DAYS, AUDIT_ROLES, type AuditFocus, type AuditRole } from "./audit";
import type { Locale } from "./seo";

type AuditCopy = {
  heading: string;
  intro: string;
  nextTitle: string;
  nextSteps: [string, string][];
  name: string;
  hotel: string;
  province: string;
  rooms: string;
  role: string;
  rolePlaceholder: string;
  roles: Record<AuditRole, string>;
  phone: string;
  lineId: string;
  email: string;
  contactHint: string;
  contactError: string;
  concernsLegend: string;
  concernsError: string;
  concerns: Record<AuditFocus, string>;
  details: string;
  detailsPlaceholder: string;
  consent: string;
  consentPrivacy: string;
  consentError: string;
  submit: string;
  submitting: string;
  followUp: string;
  orTalk: string;
  line: string;
  call: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
  required: string;
};

const th: AuditCopy = {
  heading: "ขอวิเคราะห์ Performance โรงแรม",
  intro: "เล่าให้เราฟังว่าโรงแรมกำลังเจออะไร ทีม เดอะ เคพีไอ พลัส จะช่วยดูว่ารายได้กำลังหายไปตรงไหน โอกาสอยู่ตรงไหน และอะไรควรทำก่อน",
  nextTitle: "หลังจากส่งข้อมูล",
  nextSteps: [
    ["01", "เล่าสถานการณ์ของโรงแรมตามที่เห็นอยู่ตอนนี้"],
    ["02", "ทีมดูตัวเลขร่วมกัน และแยกว่าอะไรคือปัญหา อะไรคือโอกาส"],
    ["03", "คุยกันว่าควรทำอะไรก่อน โดยไม่ต้องเริ่มทุกอย่างพร้อมกัน"],
  ],
  name: "ชื่อ–นามสกุล",
  hotel: "ชื่อโรงแรม",
  province: "จังหวัด / พื้นที่",
  rooms: "จำนวนห้อง",
  role: "ตำแหน่ง",
  rolePlaceholder: "เลือกตำแหน่ง",
  roles: {
    owner: "เจ้าของโรงแรม",
    gm: "General Manager",
    revenue: "Revenue",
    sales: "Sales & Marketing",
    other: "อื่นๆ",
  },
  phone: "เบอร์โทรศัพท์",
  lineId: "LINE ID",
  email: "อีเมล",
  contactHint: "ระบุอย่างน้อย 1 ช่องทาง โทรศัพท์ LINE หรืออีเมล",
  contactError: "กรุณาระบุช่องทางติดต่ออย่างน้อย 1 ช่องทาง",
  concernsLegend: "ตอนนี้เรื่องไหนที่คุณกังวลมากที่สุด?",
  concernsError: "กรุณาเลือกอย่างน้อย 1 เรื่อง",
  concerns: {
    occupancy: "Occupancy หรือยอดจองต่ำกว่าเป้า",
    pricing: "ไม่แน่ใจว่าควรตั้งราคาเท่าไร",
    ota: "พึ่งพา OTA มากเกินไป / ค่า Commission สูง",
    direct: "Direct Booking ไม่โต",
    ads: "ใช้งบโฆษณาแล้วไม่เห็นยอดจอง",
    reporting: "ไม่มีรายงานหรือข้อมูลที่ช่วยให้ตัดสินใจได้เร็ว",
    overview: "ยังไม่แน่ใจ อยากให้ทีมช่วยดูภาพรวม",
  },
  details: "รายละเอียดเพิ่มเติม",
  detailsPlaceholder: "เช่น ช่วงเวลาที่ยอดจองลดลง หรือสิ่งที่ลองทำไปแล้ว",
  consent: "ข้าพเจ้ายินยอมให้ เดอะ เคพีไอ พลัส เก็บและใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับคำขอนี้ ตาม",
  consentPrivacy: "นโยบายความเป็นส่วนตัว",
  consentError: "กรุณายินยอมก่อนส่งข้อมูล",
  submit: "ขอวิเคราะห์ Performance โรงแรม",
  submitting: "กำลังส่งข้อมูล",
  followUp: `ทีมของเราจะติดต่อกลับภายใน ${AUDIT_RESPONSE_DAYS} วันทำการ เพื่อนัดคุยและดูตัวเลขของโรงแรมร่วมกัน`,
  orTalk: "หรือ คุยกับทีม เดอะ เคพีไอ พลัส",
  line: "LINE",
  call: "โทร",
  successTitle: "ขอบคุณครับ/ค่ะ เราได้รับข้อมูลแล้ว",
  successBody: `ทีม เดอะ เคพีไอ พลัส จะติดต่อกลับภายใน ${AUDIT_RESPONSE_DAYS} วันทำการ หากต้องการคุยเร็วขึ้น ติดต่อเราทาง LINE ได้เลย`,
  errorTitle: "ส่งข้อมูลไม่สำเร็จ",
  errorBody: "ลองส่งอีกครั้ง หรือคุยกับทีมทาง LINE หรือโทรศัพท์ได้เลย",
  required: "กรุณากรอกข้อมูลนี้",
};

const en: AuditCopy = {
  heading: "Request a Hotel Performance Audit",
  intro: "Tell us what's happening at your hotel. Our team will help you see where revenue is being lost, where the opportunities are, and what to do first.",
  nextTitle: "What happens next",
  nextSteps: [
    ["01", "You describe what the hotel is seeing right now."],
    ["02", "We look at the numbers together and separate the leak from the opportunity."],
    ["03", "We agree what to do first, without starting everything at once."],
  ],
  name: "Full name",
  hotel: "Hotel name",
  province: "Province / area",
  rooms: "Number of rooms",
  role: "Role",
  rolePlaceholder: "Select a role",
  roles: {
    owner: "Hotel owner",
    gm: "General Manager",
    revenue: "Revenue",
    sales: "Sales & Marketing",
    other: "Other",
  },
  phone: "Phone",
  lineId: "LINE ID",
  email: "Email",
  contactHint: "Share at least one way to reach you: phone, LINE, or email.",
  contactError: "Please add at least one contact method.",
  concernsLegend: "What is the hotel most concerned about right now?",
  concernsError: "Please choose at least one concern.",
  concerns: {
    occupancy: "Occupancy or bookings below target",
    pricing: "Not sure how to price",
    ota: "Too dependent on OTAs or high commissions",
    direct: "Direct bookings aren't growing",
    ads: "Ad spend isn't turning into bookings",
    reporting: "No reporting to support quick decisions",
    overview: "Not sure yet, I'd like a full review",
  },
  details: "More detail",
  detailsPlaceholder: "For example, when bookings dropped, or what you have already tried",
  consent: "I agree that The KPI Plus may store and use this information to follow up on this request, as described in the",
  consentPrivacy: "Privacy Policy",
  consentError: "Please confirm before sending.",
  submit: "Request a Hotel Performance Audit",
  submitting: "Sending",
  followUp: `Our team will get back to you within ${AUDIT_RESPONSE_DAYS} business days to schedule a conversation and review the hotel's numbers together.`,
  orTalk: "Or talk to The KPI Plus team",
  line: "LINE",
  call: "Call",
  successTitle: "Thank you. We have received your details.",
  successBody: `The KPI Plus team will get back to you within ${AUDIT_RESPONSE_DAYS} business days. If you would like to talk sooner, message us on LINE.`,
  errorTitle: "We could not send this just now",
  errorBody: "Please try again, or reach the team on LINE or by phone.",
  required: "Please fill in this field.",
};

export const auditCopy = { th, en, ru: en, zh: en } as const;

export function auditCopyFor(locale: Locale) {
  return auditCopy[locale] ?? en;
}

export const auditFocusOrder = AUDIT_FOCUS_VALUES;
export const auditRoleOrder = AUDIT_ROLES;
