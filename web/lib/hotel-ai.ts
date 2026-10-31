import type { FaqItem } from "@/lib/faqs";
import { formatInsightDate, insightExcerpt, insightPosts, insightUpdatedAt } from "@/lib/insights";
import { existingHref, type Locale } from "@/lib/seo";

export function hotelAiSampleLabel(locale: Locale) {
  return locale === "th" ? "ตัวอย่างข้อมูล" : "Sample";
}

export const HOTEL_AI_PROCESS = [
  {
    id: "map",
    label: "MAP",
    titleTh: "สำรวจงานจริง",
    titleEn: "Map the real work",
    bodyTh: "ทำความเข้าใจเวิร์กโฟลว์จริง คนที่ทำ ข้อมูลเข้า ข้อยกเว้น และผลลัพธ์ที่ต้องการ",
    bodyEn: "Understand the real workflow, people, inputs, exceptions, and target outcome.",
    outputTh: "Workflow Map และ Baseline",
    outputEn: "Workflow Map and Baseline",
    ownerTh: "เจ้าของเวิร์กโฟลว์ที่ระบุชื่อได้",
    ownerEn: "Named workflow owner",
    gateTh: "เจ้าของเวิร์กโฟลว์ชัดหรือยัง?",
    gateEn: "Is the workflow owner clear?",
  },
  {
    id: "simplify",
    label: "SIMPLIFY",
    titleTh: "ทำให้ง่ายก่อนใส่ AI",
    titleEn: "Simplify before adding AI",
    bodyTh: "ตัดขั้นตอนที่ไม่จำเป็น และกำหนดกติกาก่อนใส่ AI",
    bodyEn: "Remove unnecessary steps and define rules before adding AI.",
    outputTh: "SOP ที่ทำให้ง่าย และกติกาข้อยกเว้น",
    outputEn: "Simplified SOP and Exception Rules",
    ownerTh: "เจ้าของเวิร์กโฟลว์ที่ระบุชื่อได้",
    ownerEn: "Named workflow owner",
    gateTh: "กระบวนการนิ่งพอที่จะทดลองหรือยัง?",
    gateEn: "Is the process stable enough to test?",
  },
  {
    id: "automate",
    label: "AUTOMATE",
    titleTh: "ตั้งค่าในขอบเขตที่อนุมัติ",
    titleEn: "Automate within approved scope",
    bodyTh: "ตั้งค่าหรือเชื่อมเครื่องมือในขอบเขตและสิทธิ์ที่อนุมัติแล้ว",
    bodyEn: "Configure or connect tools within approved access and scope.",
    outputTh: "Pilot Workflow และชุดทดสอบ",
    outputEn: "Pilot Workflow and Test Cases",
    ownerTh: "เจ้าของเวิร์กโฟลว์ที่ระบุชื่อได้",
    ownerEn: "Named workflow owner",
    gateTh: "สิทธิ์ ข้อมูล และทางเลือกเมื่อระบบใช้ไม่ได้ กำหนดแล้วหรือยัง?",
    gateEn: "Are permissions, data, and fallback defined?",
  },
  {
    id: "connect",
    label: "CONNECT",
    titleTh: "เชื่อมทีมให้ดูแลต่อได้",
    titleEn: "Connect the team to the work",
    bodyTh: "ฝึกทีม และกำหนดเจ้าของงาน การส่งต่อ และการยกระดับปัญหา",
    bodyEn: "Train the team and define ownership, handover, and escalation.",
    outputTh: "คู่มือทีม เจ้าของงาน และเส้นทางยกระดับปัญหา",
    outputEn: "Team Guide, Owner, and Escalation Path",
    ownerTh: "เจ้าของเวิร์กโฟลว์ที่ระบุชื่อได้",
    ownerEn: "Named workflow owner",
    gateTh: "ทีมใช้งานเวิร์กโฟลว์นี้ได้เองหรือยัง?",
    gateEn: "Can the team operate the workflow?",
  },
  {
    id: "review",
    label: "REVIEW",
    titleTh: "ทบทวนแล้วตัดสินใจ",
    titleEn: "Review, then decide",
    bodyTh: "ทบทวนเวลา คุณภาพ ข้อยกเว้น และภาระที่คนต้องตรวจ",
    bodyEn: "Review time, quality, exceptions, and human-review load.",
    outputTh: "ผลทบทวนทดลอง และคำตัดสิน Scale, Adjust หรือ Stop",
    outputEn: "Pilot Review and decision to Scale, Adjust, or Stop",
    ownerTh: "เจ้าของเวิร์กโฟลว์ที่ระบุชื่อได้",
    ownerEn: "Named workflow owner",
    gateTh: "ผ่านเกณฑ์ที่ตกลงไว้หรือยัง?",
    gateEn: "Are the agreed criteria met?",
  },
] as const;

export const HOTEL_AI_ROADMAP_VISUAL_CANDIDATE = "/images/hotel-ai-automation-roadmap-placeholder.webp";

export const HOTEL_AI_ROADMAP_VISUAL = {
  src: HOTEL_AI_ROADMAP_VISUAL_CANDIDATE,
  labelTh: "AI & Automation Implementation Roadmap — Sample",
  labelEn: "AI & Automation Implementation Roadmap — Sample",
  statusTh: "Sample roadmap · Replace with an approved hotel process",
  statusEn: "Sample roadmap · Replace with an approved hotel process",
  captionTh: "แผนตัวอย่างจากแผนจนถึงการใช้งาน มีผลลัพธ์และเกตตัดสินใจทุกขั้น ไม่ใช่ระบบลูกค้าจริง",
  captionEn: "A sample path from plan through to day-to-day use, with an output and a decision gate at each step. Not a live client system.",
  altTh: "แผนภาพตัวอย่างห้าขั้น MAP SIMPLIFY AUTOMATE CONNECT REVIEW แต่ละขั้นมีผลลัพธ์และเกตตัดสินใจ",
  altEn: "Sample five-step MAP SIMPLIFY AUTOMATE CONNECT REVIEW roadmap. Each step has an output and a decision gate.",
  status: "sample",
  displayWidth: 720,
  displayHeight: 405,
} as const;

export const HOTEL_AI_HUMAN_REVIEW = [
  { id: "guest", th: "ข้อความถึงแขก", en: "Guest-facing replies" },
  { id: "rates", th: "ราคา", en: "Rates" },
  { id: "availability", th: "ห้องว่าง", en: "Availability" },
  { id: "payment", th: "การชำระเงิน", en: "Payment" },
  { id: "complaints", th: "ข้อร้องเรียน", en: "Complaints" },
  { id: "policy", th: "นโยบาย", en: "Policies" },
  { id: "safety", th: "ความปลอดภัย", en: "Safety" },
  { id: "legal", th: "ผลทางการเงินหรือกฎหมาย", en: "Financial or legal impact" },
] as const;

export const HOTEL_AI_PAINS = [
  {
    id: "report",
    th: "รายงานที่ต้องใช้ตัดสินใจ ต้องรวมข้อมูลจากหลายแหล่งด้วยมือหรือไม่?",
    en: "Do reports still need manual consolidation from several sources before a decision?",
  },
  {
    id: "enquiry",
    th: "Enquiry จากเว็บไซต์ LINE หรืออีเมล ถูกส่งต่อถึงผู้รับอย่างสม่ำเสมอหรือไม่?",
    en: "Are enquiries from the website, LINE, or email routed to an owner consistently?",
  },
  {
    id: "search",
    th: "พนักงานต้องค้นหาข้อมูลเดิมซ้ำก่อนตอบแขกหรือทีมภายในหรือไม่?",
    en: "Do staff repeatedly search for the same information before they can answer?",
  },
  {
    id: "systems",
    th: "มีหลายระบบแล้ว แต่ข้อมูลไปไม่ถึงคนที่ต้องใช้ในเวลานั้นหรือไม่?",
    en: "Do several systems exist, but the facts still fail to reach the person who needs them?",
  },
  {
    id: "start",
    th: "ทีมสนใจ AI แต่ยังไม่รู้ว่าควรเริ่มจากเวิร์กโฟลว์ใดหรือไม่?",
    en: "Is the team interested in AI, but unclear which workflow to start with?",
  },
  {
    id: "review",
    th: "ทีมกังวลเรื่องความถูกต้อง สิทธิ์เข้าถึง เจ้าของข้อมูล และผู้ตรวจทานหรือไม่?",
    en: "Is there concern about accuracy, data access, ownership, and who reviews the result?",
  },
] as const;

export const HOTEL_AI_HANDOFF_STEPS = [
  {
    id: "intake",
    th: "Website / LINE / Email",
    en: "Website / LINE / Email",
    friction: "missing",
  },
  {
    id: "copy",
    th: "Copy / Paste โดยพนักงาน",
    en: "Copy / Paste by Staff",
    friction: "duplicate",
  },
  {
    id: "systems",
    th: "Spreadsheet / PMS / CRM",
    en: "Spreadsheet / PMS / CRM",
    friction: "mismatch",
  },
  {
    id: "check",
    th: "ตรวจด้วยมือ",
    en: "Manual Check",
    friction: "review",
  },
  {
    id: "response",
    th: "ตอบแขก / ส่งต่อทีม",
    en: "Guest / Team Response",
    friction: "delayed",
  },
] as const;

export const HOTEL_AI_FRICTION = {
  duplicate: { th: "งานซ้ำ", en: "Duplicate work", tone: "amber" },
  missing: { th: "ยังไม่ชัดว่าใครรับ", en: "Missing owner", tone: "yellow" },
  delayed: { th: "ส่งต่อล่าช้า", en: "Delayed handoff", tone: "teal" },
  mismatch: { th: "ข้อมูลไม่ตรงกัน", en: "Data mismatch", tone: "amber" },
  review: { th: "ต้องมีคนตรวจ", en: "Human review required", tone: "lime" },
} as const;

export const HOTEL_AI_DIAGNOSTIC_COLUMNS = {
  symptom: { th: "สัญญาณ", en: "Symptom" },
  question: { th: "คำถามที่ควรถาม", en: "Question to investigate" },
  evidence: { th: "หลักฐานที่ควรเก็บ", en: "Evidence to collect" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
} as const;

export const HOTEL_AI_DIAGNOSTIC = [
  {
    id: "report",
    symptomTh: "รายงานต้องรวมจากหลายแหล่งด้วยมือ",
    symptomEn: "Reports need manual consolidation from several sources",
    questionTh: "รายงานที่ใช้ตัดสินใจ ดึงจากกี่ระบบ และใครเป็นคนรวมให้?",
    questionEn: "Which systems feed the decision report, and who consolidates it today?",
    evidenceTh: "ตัวอย่างรายงานล่าสุด และรายการแหล่งข้อมูลที่ใช้ประกอบ",
    evidenceEn: "A recent report sample and the source list used to build it",
    ownerTh: "ตำแหน่งที่รับผิดชอบรายงานนั้น",
    ownerEn: "The role that owns that report",
  },
  {
    id: "enquiry",
    symptomTh: "Enquiry จากเว็บไซต์ LINE หรืออีเมลส่งต่อไม่สม่ำเสมอ",
    symptomEn: "Website, LINE, or email enquiries are not routed consistently",
    questionTh: "ช่องทางไหนเข้ามาเป็นคนแรก และใครรับช่วงต่อ?",
    questionEn: "Which channel arrives first, and who is supposed to take it next?",
    evidenceTh: "ตัวอย่าง enquiry บางรายการและเส้นทางที่ส่งต่อจริง",
    evidenceEn: "A few enquiry examples and the actual handoff path",
    ownerTh: "งานจอง งานขาย หรืองานสื่อสารที่รับช่วง",
    ownerEn: "Reservations, sales, or communications for that channel",
  },
  {
    id: "search",
    symptomTh: "พนักงานค้นหาข้อมูลเดิมซ้ำก่อนตอบ",
    symptomEn: "Staff repeatedly search for the same information",
    questionTh: "คำถามที่ถามบ่อย คำตอบอยู่ที่ไหน และอัปเดตล่าสุดเมื่อใด?",
    questionEn: "Where do frequent answers live, and when were they last checked?",
    evidenceTh: "รายการคำถามที่ค้นซ้ำ และที่เก็บคำตอบปัจจุบัน",
    evidenceEn: "The repeated questions and the current place those answers are kept",
    ownerTh: "ทีมบริการหรือผู้ดูแลข้อมูลปฏิบัติการ",
    ownerEn: "Service team or the operational-information owner",
  },
  {
    id: "systems",
    symptomTh: "มีหลายระบบ แต่ข้อมูลไปไม่ถึงคนที่ต้องใช้",
    symptomEn: "Several systems exist, but data does not reach the person who needs it",
    questionTh: "ข้อมูลที่ต้องการอยู่ระบบใด และใครมีสิทธิ์เห็นในเวลานั้น?",
    questionEn: "Which system holds the needed facts, and who can see them in time?",
    evidenceTh: "รายชื่อระบบที่เกี่ยวข้องกับงานนั้น และผู้ที่เข้าถึงได้",
    evidenceEn: "The systems used for that work and who currently has access",
    ownerTh: "เจ้าของระบบหรือเจ้าของงานนั้น",
    ownerEn: "The system owner or the workflow owner",
  },
  {
    id: "start",
    symptomTh: "สนใจ AI แต่ยังไม่รู้ว่าควรเริ่มเวิร์กโฟลว์ใด",
    symptomEn: "Interest in AI, but no agreed starting workflow",
    questionTh: "งานใดซ้ำ ช้า หรือส่งต่อยากที่สุดในตอนนี้?",
    questionEn: "Which work is most repetitive, slow, or hard to hand over today?",
    evidenceTh: "หนึ่งงานที่ทีมอยากแก้ พร้อมผู้ที่ทำอยู่ตอนนี้",
    evidenceEn: "One task the team wants to fix, with who does it now",
    ownerTh: "ผู้จัดการที่รับผิดชอบงานนั้น",
    ownerEn: "The manager accountable for that work",
  },
  {
    id: "review",
    symptomTh: "กังวลเรื่องความถูกต้อง สิทธิ์ เจ้าของข้อมูล และการตรวจทาน",
    symptomEn: "Concern about accuracy, access, ownership, and review responsibility",
    questionTh: "ใครอนุมัติข้อมูล ใครเข้าถึงได้ และใครตรวจก่อนนำไปใช้?",
    questionEn: "Who approves the facts, who may access them, and who reviews before use?",
    evidenceTh: "ขอบเขตข้อมูลที่งานนั้นต้องใช้ และจุดที่ต้องมีคนตรวจ",
    evidenceEn: "The data the work actually needs, and the points that still need a person",
    ownerTh: "เจ้าของข้อมูลและผู้ตรวจทานที่ระบุชื่อได้",
    ownerEn: "A named data owner and a named reviewer",
  },
] as const;

export const HOTEL_AI_PAIN_VISUAL_CANDIDATE = "/images/hotel-ai-automation-pain-points-placeholder.webp";

export const HOTEL_AI_PAIN_VISUAL = {
  src: HOTEL_AI_PAIN_VISUAL_CANDIDATE,
  labelTh: "ตัวอย่าง Manual Workflow และจุดส่งต่องาน",
  labelEn: "Sample manual workflow and handoff points",
  statusTh: "Sample handoff map · Replace with an approved hotel process",
  statusEn: "Sample handoff map · Replace with an approved hotel process",
  captionTh: "แผนภาพตัวอย่างการส่งต่องานด้วยมือ ไม่ใช่ระบบลูกค้าจริง และไม่ใช่การวินิจฉัยโรงแรมทุกแห่ง",
  captionEn: "A sample manual handoff map. Not a live client system, and not a diagnosis of every hotel.",
  altTh: "แผนภาพตัวอย่าง Website LINE และอีเมล ถูกคัดลอกด้วยมือเข้าสเปรดชีต PMS หรือ CRM แล้วตรวจด้วยมือก่อนตอบแขกหรือทีม",
  altEn: "Sample map from website, LINE, or email, copied by staff into a spreadsheet, PMS, or CRM, then checked by hand before a guest or team response",
  status: "sample",
  displayWidth: 480,
  displayHeight: 320,
} as const;

export const HOTEL_AI_CASE_FIELDS = {
  task: { th: "งานปัจจุบัน", en: "Current task" },
  input: { th: "ข้อมูลเข้า", en: "Input" },
  simplify: { th: "Simplify", en: "Simplify" },
  automate: { th: "AI / Automation", en: "AI / Automation" },
  review: { th: "Human review", en: "Human review" },
  output: { th: "สิ่งที่ได้", en: "Output" },
  dependency: { th: "สิ่งที่ต้องมีก่อนใช้", en: "Dependency" },
  caution: { th: "ข้อควรระวังด้านข้อมูล", en: "Data caution" },
} as const;

export const HOTEL_AI_CASES = [
  {
    id: "report",
    shortTh: "Reports",
    shortEn: "Reports",
    titleTh: "รายงานและการตัดสินใจ",
    titleEn: "Reports and Decisions",
    taskTh: "จัดทำรายงานเพื่อประกอบการตัดสินใจของทีมรายได้ ขาย หรือผู้บริหาร",
    taskEn: "Prepare a report the revenue, sales, or management team can use to decide.",
    inputTh: "ข้อมูลที่อนุมัติแล้วจากแหล่งที่มีอยู่",
    inputEn: "Approved data from existing sources.",
    simplifyTh: "กำหนดฟิลด์รายงานและความหมายของตัวชี้วัด",
    simplifyEn: "Define report fields and metric definitions.",
    automateTh: "รวมข้อมูลหรือร่างสรุปเมื่อระบบรองรับทางเทคนิค",
    automateEn: "Consolidate or draft a summary where technically supported.",
    reviewTh: "Revenue / Sales / Management ตรวจตัวเลขและการตีความ",
    reviewEn: "Revenue, Sales, or Management checks the numbers and the interpretation.",
    outputTh: "รายงานพร้อมตรวจทาน และรายการที่ต้องตัดสินใจ",
    outputEn: "A review-ready report and an action list.",
    dependencyTh: "ใช้ได้เฉพาะแหล่งที่โรงแรมอนุมัติให้เข้าถึง หน้านี้ไม่ได้ยืนยันว่า PMS CRM หรือระบบอื่นเชื่อมแล้ว",
    dependencyEn: "Only sources the hotel has approved for access. This page does not claim that a PMS, CRM, or other system is already connected.",
    cautionTh: "ไม่ใส่ข้อมูลแขก การชำระเงิน หรือรหัสผ่าน และคนต้องตรวจก่อนใช้ประกอบการตัดสินใจ",
    cautionEn: "Do not include guest, payment, or password data. A person must review before the report is used in a decision.",
    fallbackTh: "ทำตาม SOP เดิมด้วยมือเมื่อระบบใช้ไม่ได้",
    fallbackEn: "Follow the current SOP by hand if automation fails.",
    sample: true,
  },
  {
    id: "enquiry",
    shortTh: "Enquiry",
    shortEn: "Enquiry",
    titleTh: "Enquiry และการส่งต่องาน",
    titleEn: "Enquiry and Handover",
    taskTh: "รับ enquiry จากช่องทางติดต่อ แล้วส่งต่อให้ผู้รับที่ถูกต้อง",
    taskEn: "Receive an enquiry from a contact channel and hand it to the right owner.",
    inputTh: "enquiry จากเว็บไซต์ LINE หรืออีเมล เมื่อการเชื่อมต่อได้รับอนุมัติแล้ว",
    inputEn: "Website, LINE, or email enquiries, subject to approved integration.",
    simplifyTh: "กำหนดประเภท enquiry ผู้รับ ความคาดหวังในการตอบ และการยกระดับปัญหา",
    simplifyEn: "Define enquiry categories, owner, response expectation, and escalation.",
    automateTh: "แยกประเภทหรือส่งต่อ enquiry เฉพาะที่ได้รับอนุญาต",
    automateEn: "Classify or route the enquiry only where permitted.",
    reviewTh: "พนักงานอนุมัติข้อความถึงแขก และจัดการข้อยกเว้นเอง",
    reviewEn: "Staff approve the guest-facing response and handle exceptions.",
    outputTh: "enquiry ที่มีเจ้าของชัด และสถานะติดตาม",
    outputEn: "An enquiry with a clear owner and follow-up status.",
    dependencyTh: "เว็บไซต์ LINE อีเมล PMS หรือ CRM ใช้ได้เมื่อตรวจสิทธิ์และการเชื่อมต่อแล้วเท่านั้น หน้านี้ไม่ได้ยืนยันว่าเชื่อมแล้ว",
    dependencyEn: "Website, LINE, email, PMS, or CRM can be used only after access and integration are verified. This page does not claim they are connected.",
    cautionTh: "AI ไม่ส่งข้อความถึงแขกเองในเรื่องอ่อนไหว เช่น การชำระเงิน ข้อร้องเรียน หรือข้อมูลส่วนบุคคล",
    cautionEn: "AI does not send guest-facing replies autonomously for sensitive topics such as payment, complaints, or personal data.",
    fallbackTh: "พนักงานรับ enquiry และส่งต่อตาม SOP เดิมเมื่อระบบใช้ไม่ได้",
    fallbackEn: "Staff take the enquiry and hand it on by the current SOP if automation fails.",
    sample: true,
  },
  {
    id: "service",
    shortTh: "Service info",
    shortEn: "Service info",
    titleTh: "ข้อมูลสำหรับทีมบริการ",
    titleEn: "Information for Service Teams",
    taskTh: "ช่วยพนักงานหา SOP และข้อมูลบริการที่ใช้ตอบแขกหรือทำงานในกะ",
    taskEn: "Help staff find the SOP and service facts they need during a shift.",
    inputTh: "SOP และข้อมูลบริการที่อนุมัติแล้ว",
    inputEn: "Approved SOP and service information.",
    simplifyTh: "ระบุแหล่งข้อมูลที่เป็นทางการ และผู้รับผิดชอบอัปเดต",
    simplifyEn: "Identify the authoritative source and the update owner.",
    automateTh: "ช่วยพนักงานค้นหาเนื้อหาที่อนุมัติแล้วเมื่อเหมาะสม",
    automateEn: "Help staff search approved content where suitable.",
    reviewTh: "ตรวจคำตอบที่เกี่ยวกับนโยบาย ความปลอดภัย ราคา และข้อมูลเฉพาะแขก",
    reviewEn: "Verify policy-sensitive, safety, price, and guest-specific answers.",
    outputTh: "เข้าถึงข้อมูลที่อนุมัติได้เร็วขึ้น ไม่ใช่การตัดสินใจโดยไม่มีคนดูแล",
    outputEn: "Faster access to approved information, not unsupervised decisions.",
    dependencyTh: "ใช้ได้เฉพาะคลังข้อมูลที่อนุมัติแล้ว ไม่ได้เชื่อม PMS ระบบจอง หรือเครื่องมืออื่นโดยอัตโนมัติ",
    dependencyEn: "Only an approved content source. This does not mean a PMS, booking system, or other tool is connected.",
    cautionTh: "คำตอบเรื่องราคา ความปลอดภัย นโยบาย และข้อมูลแขกต้องมีคนตรวจก่อนใช้",
    cautionEn: "Answers about price, safety, policy, and a specific guest still need a person before they are used.",
    fallbackTh: "เปิด SOP หรือคู่มือที่อนุมัติแล้วด้วยมือเมื่อค้นหาอัตโนมัติใช้ไม่ได้",
    fallbackEn: "Open the approved SOP or handbook by hand if automated search fails.",
    sample: true,
  },
  {
    id: "internal",
    shortTh: "Marketing",
    shortEn: "Marketing",
    titleTh: "งานการตลาดและงานภายใน",
    titleEn: "Marketing and Internal Work",
    taskTh: "เตรียมเนื้อหาแคมเปญ งานภายใน หรือสรุปประชุมให้พร้อมตรวจทาน",
    taskEn: "Prepare campaign content, internal work, or meeting notes for review.",
    inputTh: "บรีฟแคมเปญ เนื้อหา หรือบันทึกประชุมที่อนุมัติแล้ว",
    inputEn: "An approved campaign brief, content, or meeting notes.",
    simplifyTh: "กำหนดน้ำเสียงแบรนด์ และขั้นตอนอนุมัติ",
    simplifyEn: "Define brand voice and the approval flow.",
    automateTh: "ร่าง จัดหมวด หรือสรุปเนื้อหา",
    automateEn: "Draft, categorize, or summarize content.",
    reviewTh: "Marketing / Management อนุมัติก่อนเผยแพร่หรือส่ง",
    reviewEn: "Marketing or Management approves before publishing or sending.",
    outputTh: "เนื้อหาพร้อมตรวจทาน และขั้นอนุมัติที่ตามรอยได้",
    outputEn: "Review-ready material and a traceable approval step.",
    dependencyTh: "ไม่ได้เชื่อมแพลตฟอร์มโฆษณา อีเมลแขก หรือ CRM จนกว่าจะตรวจสิทธิ์แล้ว",
    dependencyEn: "Advertising platforms, guest email, or CRM are not treated as connected until access is verified.",
    cautionTh: "ไม่ส่งหรือเผยแพร่ราคา ข้อเสนอ หรือข้อความถึงแขกโดยไม่มีคนอนุมัติ",
    cautionEn: "Do not publish or send rates, offers, or guest-facing copy without a person approving it.",
    fallbackTh: "ร่างและอนุมัติเนื้อหาตามขั้นตอนเดิมเมื่อระบบใช้ไม่ได้",
    fallbackEn: "Draft and approve content with the current process if automation fails.",
    sample: true,
  },
] as const;

export const HOTEL_AI_CASES_VISUAL_CANDIDATE = "/images/hotel-ai-automation-use-cases-placeholder.webp";

export const HOTEL_AI_CASES_VISUAL = {
  src: HOTEL_AI_CASES_VISUAL_CANDIDATE,
  labelTh: "Hotel AI & Automation Use Cases — Sample Workflow",
  labelEn: "Hotel AI & Automation Use Cases — Sample Workflow",
  statusTh: "Sample workflows · Replace with an approved hotel process",
  statusEn: "Sample workflows · Replace with an approved hotel process",
  captionTh: "ตัวอย่างเวิร์กโฟลว์โรงแรม ไม่ใช่ระบบที่เชื่อมแล้ว และไม่ใช่การให้ AI ตอบแขกแทนคนในเรื่องอ่อนไหว",
  captionEn: "Sample hotel workflows. Not a verified integration, and not a claim that AI replies to guests on sensitive topics.",
  altTh: "แผนภาพตัวอย่างสี่งาน รายงาน Enquiry ข้อมูลบริการ และการตลาด แต่ละงานมีคนตรวจทานก่อนใช้ผล",
  altEn: "Sample diagram of four hotel workflows: reports, enquiry, service information, and marketing. Each still needs a person to review.",
  status: "sample",
  displayWidth: 720,
  displayHeight: 405,
} as const;

export const HOTEL_AI_PILOT_STEPS = [
  {
    id: "select",
    shortTh: "เลือกงาน",
    shortEn: "Select task",
    th: "เลือกหนึ่งงานที่ขอบเขตชัด",
    en: "Select one bounded task",
  },
  {
    id: "baseline",
    shortTh: "เส้นฐาน",
    shortEn: "Baseline",
    th: "บันทึกเส้นฐาน",
    en: "Record Baseline",
  },
  {
    id: "test",
    shortTh: "ทดลองจริง",
    shortEn: "Test",
    th: "ทดลองบนเวิร์กโฟลว์จริงด้วยข้อมูลที่อนุมัติ",
    en: "Test on a real workflow with approved data",
  },
  {
    id: "review",
    shortTh: "ทบทวน",
    shortEn: "Review",
    th: "ทบทวนคุณภาพ ข้อยกเว้น และภาระที่คนต้องตรวจ",
    en: "Review quality, exceptions, and human effort",
  },
  {
    id: "decide",
    shortTh: "ตัดสินใจ",
    shortEn: "Decide",
    th: "Scale / Adjust / Stop",
    en: "Scale / Adjust / Stop",
  },
] as const;

export const HOTEL_AI_PILOT_CHARTER = [
  { id: "workflow", labelTh: "Workflow selected", labelEn: "Workflow selected", valueTh: "ยังไม่เลือก — ตัวอย่าง", valueEn: "Not selected — Sample" },
  { id: "owner", labelTh: "Owner", labelEn: "Owner", valueTh: "ตำแหน่งที่ระบุชื่อได้ — ตัวอย่าง", valueEn: "A named hotel role — Sample" },
  { id: "baseline", labelTh: "Baseline period and method", labelEn: "Baseline period and method", valueTh: "ยังไม่ตั้งค่า — ตัวอย่าง", valueEn: "Not set — Sample" },
  { id: "sources", labelTh: "Approved data sources", labelEn: "Approved data sources", valueTh: "เฉพาะแหล่งที่อนุมัติแล้ว — ตัวอย่าง", valueEn: "Approved sources only — Sample" },
  { id: "excluded", labelTh: "Data that must not be used", labelEn: "Data that must not be used", valueTh: "ข้อมูลแขก การชำระเงิน รหัสผ่าน เลขการจอง", valueEn: "Guest data, payment data, passwords, booking IDs" },
  { id: "scope", labelTh: "Pilot scope and users", labelEn: "Pilot scope and users", valueTh: "หนึ่งงาน ผู้ใช้จำกัด — ตัวอย่าง", valueEn: "One task, limited users — Sample" },
  { id: "reviewer", labelTh: "Human reviewer", labelEn: "Human reviewer", valueTh: "เจ้าของงานที่ระบุชื่อได้ — ตัวอย่าง", valueEn: "A named workflow owner — Sample" },
  { id: "exceptionOwner", labelTh: "Exception owner", labelEn: "Exception owner", valueTh: "ผู้รับข้อยกเว้นที่ระบุชื่อได้ — ตัวอย่าง", valueEn: "A named exception owner — Sample" },
  { id: "success", labelTh: "Success criteria", labelEn: "Success criteria", valueTh: "ตกลงก่อนทดลอง — ยังไม่ตั้งค่า", valueEn: "Agree before the trial — Not set" },
  { id: "risk", labelTh: "Error / risk threshold", labelEn: "Error / risk threshold", valueTh: "ตกลงก่อนทดลอง — ยังไม่ตั้งค่า", valueEn: "Agree before the trial — Not set" },
  { id: "fallback", labelTh: "Manual fallback", labelEn: "Manual fallback", valueTh: "ทำด้วยมือตาม SOP เดิม", valueEn: "Do the step by the current SOP" },
  { id: "reviewDate", labelTh: "Review date", labelEn: "Review date", valueTh: "ยังไม่ตั้งค่า — ตัวอย่าง", valueEn: "Not set — Sample" },
  { id: "decision", labelTh: "Decision", labelEn: "Decision", valueTh: "ยังไม่เลือก — Scale, Adjust และ Stop ใช้ได้เท่ากัน", valueEn: "Not chosen — Scale, Adjust, and Stop are equally valid" },
] as const;

export const HOTEL_AI_PILOT_DECISIONS = [
  {
    id: "scale",
    label: "Scale",
    th: "ขยายเมื่อผล คุณภาพ ความเสี่ยง และการยอมรับของทีมผ่านเกณฑ์ที่ตกลงไว้",
    en: "Scale when the result, quality, risk, and team use meet the criteria agreed before the trial.",
  },
  {
    id: "adjust",
    label: "Adjust",
    th: "ปรับขอบเขต ข้อมูล กติกา หรือผู้ตรวจทาน แล้วทดลองต่อในขอบเขตเล็ก",
    en: "Adjust the scope, data, rules, or reviewer, then continue as a small experiment.",
  },
  {
    id: "stop",
    label: "Stop",
    th: "หยุดเมื่อไม่คุ้ม ไม่เสถียร ความเสี่ยงสูง หรือทีมยังใช้ไม่ได้ การหยุดเป็นการตัดสินใจที่ใช้ได้",
    en: "Stop when it is not worth continuing, not stable, too risky, or the team cannot operate it. Stopping is a valid decision.",
  },
] as const;

export const HOTEL_AI_MEASURES = [
  { id: "time", label: "Time Saved", th: "เวลาที่ใช้ต่อหนึ่งงาน", en: "Time spent per task" },
  { id: "steps", label: "Manual Steps", th: "ขั้นตอนที่ทีมยังทำเอง", en: "Steps the team still does by hand" },
  { id: "quality", label: "Data Quality", th: "ความครบถ้วนและความถูกต้อง", en: "Completeness and accuracy of the facts" },
  { id: "handover", label: "Handover", th: "งานที่ส่งต่อสำเร็จ", en: "Work handed on successfully" },
  { id: "review", label: "Human Review", th: "ครั้งที่คนต้องเข้ามาแก้", en: "Times a person has to correct it" },
  { id: "adopt", label: "Adoption", th: "ทีมงานที่เกี่ยวข้องใช้จริงหรือไม่", en: "Whether the relevant roles actually use it" },
] as const;

export const HOTEL_AI_SCORECARD_COLUMNS = [
  { id: "metric", th: "ตัวชี้วัด", en: "Metric" },
  { id: "baseline", th: "เส้นฐาน", en: "Baseline" },
  { id: "pilot", th: "ทดลอง", en: "Pilot" },
  { id: "definition", th: "นิยาม", en: "Definition" },
  { id: "period", th: "ช่วงวัด", en: "Period" },
  { id: "source", th: "แหล่งข้อมูล", en: "Source" },
  { id: "owner", th: "ผู้ทบทวน", en: "Review owner" },
  { id: "status", th: "สถานะข้อมูล", en: "Data status" },
] as const;

export const HOTEL_AI_SCORECARD_EMPTY = "—" as const;

export const HOTEL_AI_SCORECARD_META = {
  approved: false,
  lastUpdated: null,
  owner: null,
} as const;

export const HOTEL_AI_SCORECARD = [
  {
    id: "time",
    label: "Time Saved",
    tone: "compare",
    definitionTh: "เวลาต่อหนึ่งงาน ใช้หน่วยเดียวกัน และปริมาณงานที่เปรียบเทียบกันได้",
    definitionEn: "Time per task, using the same unit and a comparable workload.",
    periodTh: "ช่วงเทียบกันได้ — ยังไม่ตั้งค่า",
    periodEn: "Comparable period — Not set",
    sourceTh: "ยังไม่ตั้งค่า",
    sourceEn: "Not set",
    ownerTh: "ยังไม่ตั้งค่า",
    ownerEn: "Not set",
  },
  {
    id: "steps",
    label: "Manual Steps",
    tone: "compare",
    definitionTh: "จำนวนขั้นตอนที่ยังต้องทำด้วยมือในงานเดียวกัน",
    definitionEn: "Number of steps that still need manual work in the same task.",
    periodTh: "ช่วงเทียบกันได้ — ยังไม่ตั้งค่า",
    periodEn: "Comparable period — Not set",
    sourceTh: "ยังไม่ตั้งค่า",
    sourceEn: "Not set",
    ownerTh: "ยังไม่ตั้งค่า",
    ownerEn: "Not set",
  },
  {
    id: "quality",
    label: "Data Quality",
    tone: "compare",
    definitionTh: "ความครบถ้วน อัตราผิดพลาด หรือตัวชี้วัดอื่นที่นิยามไว้ชัดก่อนวัด",
    definitionEn: "Completeness, error rate, or another measure defined before counting starts.",
    periodTh: "ช่วงเทียบกันได้ — ยังไม่ตั้งค่า",
    periodEn: "Comparable period — Not set",
    sourceTh: "ยังไม่ตั้งค่า",
    sourceEn: "Not set",
    ownerTh: "ยังไม่ตั้งค่า",
    ownerEn: "Not set",
  },
  {
    id: "handover",
    label: "Handover",
    tone: "compare",
    definitionTh: "รายการงานที่มีเจ้าของ และสถานะที่ตามได้",
    definitionEn: "Work items that have an owner and a traceable status.",
    periodTh: "ช่วงเทียบกันได้ — ยังไม่ตั้งค่า",
    periodEn: "Comparable period — Not set",
    sourceTh: "ยังไม่ตั้งค่า",
    sourceEn: "Not set",
    ownerTh: "ยังไม่ตั้งค่า",
    ownerEn: "Not set",
  },
  {
    id: "review",
    label: "Human Review",
    tone: "review",
    definitionTh: "จำนวนหรือสัดส่วนรายการที่ต้องแก้หรืออนุมัติ การมีคนตรวจที่จำเป็นไม่ใช่ผลลัพธ์ที่ไม่ดีโดยอัตโนมัติ",
    definitionEn: "Number or share of items that need correction or approval. Necessary human review is not automatically a bad result.",
    periodTh: "ช่วงเทียบกันได้ — ยังไม่ตั้งค่า",
    periodEn: "Comparable period — Not set",
    sourceTh: "ยังไม่ตั้งค่า",
    sourceEn: "Not set",
    ownerTh: "ยังไม่ตั้งค่า",
    ownerEn: "Not set",
  },
  {
    id: "adopt",
    label: "Adoption",
    tone: "compare",
    definitionTh: "บทบาทที่เกี่ยวข้องใช้เวิร์กโฟลว์นี้ในช่วงวัดเดียวกันหรือไม่ ไม่ใช่ตัวเลขผลผลิตที่สมมติ",
    definitionEn: "Whether the named roles used the workflow in the same period. This is not a productivity-gain figure.",
    periodTh: "ช่วงเทียบกันได้ — ยังไม่ตั้งค่า",
    periodEn: "Comparable period — Not set",
    sourceTh: "ยังไม่ตั้งค่า",
    sourceEn: "Not set",
    ownerTh: "ยังไม่ตั้งค่า",
    ownerEn: "Not set",
  },
] as const;

export const HOTEL_AI_OWNERSHIP = [
  { id: "necessary", th: "ใช้ข้อมูลเท่าที่จำเป็นต่องานนั้น", en: "Use only necessary data" },
  { id: "owner", th: "กำหนดเจ้าของข้อมูลและผู้อนุมัติ", en: "Define the data owner and approver" },
  { id: "access", th: "จำกัดสิทธิ์ตามบทบาท", en: "Limit access by role" },
  { id: "sensitive", th: "ไม่ส่งข้อมูลแขกที่อ่อนไหวหรือข้อมูลลับเข้าเครื่องมือหากยังไม่อนุมัติ", en: "Do not submit guest-sensitive or confidential data to a tool without approval" },
  { id: "source", th: "กำหนดแหล่งความจริงที่เชื่อถือได้", en: "Define the trusted source of truth" },
  { id: "reviewer", th: "กำหนดคนตรวจสำหรับผลลัพธ์สำคัญ", en: "Assign a human reviewer for important outputs" },
  { id: "escalate", th: "บันทึกข้อผิดพลาดและข้อยกเว้น และกำหนดเจ้าของข้อยกเว้นที่ระบุชื่อได้", en: "Log errors and exceptions, and name the exception owner" },
  { id: "retention", th: "กำหนดความคาดหวังเรื่องการเก็บและการลบ", en: "Define retention and deletion expectations" },
  { id: "fallback", th: "มีวิธีทำด้วยมือเมื่อระบบอัตโนมัติใช้ไม่ได้", en: "Provide a manual fallback when automation fails" },
] as const;

export const HOTEL_AI_DATA_FLOW = [
  {
    id: "necessary",
    shortTh: "ข้อมูลเท่าที่จำเป็น",
    shortEn: "Necessary data only",
    th: "เลือกเฉพาะข้อมูลที่งานนั้นต้องใช้ ไม่ดึงข้อมูลแขก การชำระเงิน รหัสผ่าน หรือเลขการจองเข้ามาโดยไม่จำเป็น",
    en: "Use only the data that task needs. Do not pull in guest, payment, password, or booking data unless the work requires it and it is approved.",
  },
  {
    id: "purpose",
    shortTh: "ตรวจวัตถุประสงค์และสิทธิ์",
    shortEn: "Purpose and permission check",
    th: "ตรวจว่าใช้เพื่ออะไร ใครเป็นเจ้าของ ใครอนุมัติ และบทบาทใดเข้าถึงได้",
    en: "Check the purpose, the data owner, who may approve, and which role may access it.",
  },
  {
    id: "automate",
    shortTh: "ขั้น AI / Automation ที่อนุมัติ",
    shortEn: "Approved AI/Automation step",
    th: "ใช้เฉพาะขั้นที่อนุมัติแล้ว ในขอบเขต เครื่องมือ และแหล่งความจริงที่ตกลง",
    en: "Run only the approved step, inside the agreed scope, tool, and source of truth.",
  },
  {
    id: "review",
    shortTh: "คนตรวจผลที่มีผลกระทบ",
    shortEn: "Human review for consequential outputs",
    th: "ผลที่ส่งผลต่อแขก ราคา การเงิน หรือกฎหมายต้องมีคนตรวจก่อนใช้ ไม่ถือว่าการมีคนตรวจเป็นผลลัพธ์ที่ไม่ดี",
    en: "Consequential outputs that affect guests, rates, money, or law need a person to review before use. Necessary review is not a failure.",
  },
  {
    id: "destination",
    shortTh: "นโยบายปลายทาง การเก็บ การลบ",
    shortEn: "Approved destination / storage / deletion",
    th: "ส่งต่อไปยังปลายทางที่อนุมัติ และทำตามกติกาเก็บหรือลบที่โรงแรมกำหนด ไม่เก็บในหน้าสาธารณะ",
    en: "Send output only to an approved destination, then follow the hotel’s retention or deletion rule. This page does not store it.",
  },
] as const;

export const HOTEL_AI_ACCESS_COLUMNS = [
  { id: "category", th: "หมวดข้อมูล", en: "Data category" },
  { id: "owner", th: "เจ้าของ", en: "Owner" },
  { id: "allowed", th: "บทบาท / เครื่องมือที่อนุญาต", en: "Allowed role / tool" },
  { id: "review", th: "ต้องมีคนตรวจ", en: "Review required" },
  { id: "retention", th: "กติกาเก็บรักษา", en: "Retention rule" },
] as const;

export const HOTEL_AI_ACCESS_MATRIX = [
  {
    id: "operational",
    categoryTh: "ข้อมูลงานปฏิบัติการที่ไม่ระบุตัวตนแขก",
    categoryEn: "Operational task data without guest identity",
    ownerTh: "เจ้าของเวิร์กโฟลว์ที่ระบุชื่อได้ — ตัวอย่าง",
    ownerEn: "Named workflow owner — Sample",
    allowedTh: "บทบาทที่อนุมัติ / เครื่องมือที่อนุมัติ — ตัวอย่าง",
    allowedEn: "Approved role / approved tool — Sample",
    reviewTh: "ตามที่ตกลงในงานนั้น",
    reviewEn: "As agreed for that task",
    reviewTone: "compare",
    retentionTh: "นโยบายโรงแรม — ยังไม่ตั้งค่า",
    retentionEn: "Hotel policy — Not set",
  },
  {
    id: "source",
    categoryTh: "แหล่งความจริงที่อนุมัติ",
    categoryEn: "Approved source of truth",
    ownerTh: "เจ้าของแหล่งข้อมูล — ตัวอย่าง",
    ownerEn: "Named source owner — Sample",
    allowedTh: "บทบาทที่อนุมัติเท่านั้น — ตัวอย่าง",
    allowedEn: "Approved roles only — Sample",
    reviewTh: "ก่อนใช้ในผลที่มีผลกระทบ",
    reviewEn: "Before use in a consequential output",
    reviewTone: "review",
    retentionTh: "นโยบายโรงแรม — ยังไม่ตั้งค่า",
    retentionEn: "Hotel policy — Not set",
  },
  {
    id: "output",
    categoryTh: "ผลลัพธ์จาก AI / Automation ที่มีผลกระทบ",
    categoryEn: "Consequential AI / automation output",
    ownerTh: "ผู้ตรวจทานที่ระบุชื่อได้ — ตัวอย่าง",
    ownerEn: "Named human reviewer — Sample",
    allowedTh: "หลังตรวจแล้ว ส่งเฉพาะปลายทางที่อนุมัติ",
    allowedEn: "After review, to an approved destination only",
    reviewTh: "ต้องมี",
    reviewEn: "Required",
    reviewTone: "review",
    retentionTh: "เก็บหรือลบตามนโยบายที่อนุมัติ — ยังไม่ตั้งค่า",
    retentionEn: "Approved storage or deletion — Not set",
  },
  {
    id: "guest",
    categoryTh: "ข้อมูลที่ระบุตัวตนแขก",
    categoryEn: "Guest-identifying data",
    ownerTh: "เจ้าของข้อมูลของโรงแรม — ยังไม่ตั้งค่า",
    ownerEn: "Hotel data owner — Not set",
    allowedTh: "ห้ามส่งเข้าเครื่องมือที่ยังไม่อนุมัติ",
    allowedEn: "Not submitted to an unapproved tool",
    reviewTh: "ต้องมี",
    reviewEn: "Required",
    reviewTone: "review",
    retentionTh: "นโยบายโรงแรม — ยังไม่ตั้งค่า",
    retentionEn: "Hotel policy — Not set",
  },
  {
    id: "restricted",
    categoryTh: "การชำระเงิน รหัสผ่าน เลขการจอง ข้อมูลลับ",
    categoryEn: "Payment, passwords, booking IDs, confidential files",
    ownerTh: "โรงแรม — ยังไม่ตั้งค่า",
    ownerEn: "Hotel — Not set",
    allowedTh: "หน้านี้และฟอร์มสาธารณะไม่ขอข้อมูลนี้",
    allowedEn: "Not requested on this page or the public form",
    reviewTh: "ต้องมี หากอยู่ในขอบเขต",
    reviewEn: "Required if ever in scope",
    reviewTone: "review",
    retentionTh: "ไม่เก็บบนหน้าสาธารณะ",
    retentionEn: "Not stored on this public page",
  },
] as const;

export const HOTEL_AI_HERO_VISUAL_CANDIDATE = "/images/hotel-ai-automation-hero-placeholder.webp";

export const HOTEL_AI_HERO_FLOW = [
  { id: "workflow", th: "Hotel Workflow", en: "Hotel Workflow" },
  { id: "ai", th: "AI / Automation", en: "AI / Automation" },
  { id: "review", th: "Human Review", en: "Human Review" },
  { id: "team", th: "Team / System", en: "Team / System" },
] as const;

export const HOTEL_AI_HERO_VISUAL = {
  src: HOTEL_AI_HERO_VISUAL_CANDIDATE,
  labelTh: "ตัวอย่าง Workflow สำหรับทดลองใช้ AI และ Automation",
  labelEn: "Sample workflow for trying AI and automation",
  statusTh: "Sample workflow · Replace with approved hotel process",
  statusEn: "Sample workflow · Replace with approved hotel process",
  captionTh: "เริ่มจากงานจริงที่ติดขัด แล้วค่อยเลือกเทคโนโลยีที่เหมาะ ทดลอง วัดผล และส่งต่อให้ทีมดูแลได้",
  captionEn: "Start from the work that is stuck, then choose a suitable technology, try it, measure it, and hand it to the team.",
  altTh: "แผนภาพตัวอย่าง Hotel Workflow ไปสู่ AI หรือ Automation แล้วมีคนตรวจทานก่อนส่งต่อให้ทีมหรือระบบ ไม่ใช่งานลูกค้าจริง",
  altEn: "Sample diagram from Hotel Workflow to AI or automation, then human review before the team or system. Not a live client process.",
  status: "sample",
  displayWidth: 560,
  displayHeight: 350,
} as const;

export const HOTEL_AI_PILOT_VISUAL_CANDIDATE = "/images/hotel-ai-automation-pilot-gates-placeholder.webp";

export const HOTEL_AI_PILOT_VISUAL = {
  src: HOTEL_AI_PILOT_VISUAL_CANDIDATE,
  labelTh: "AI & Automation Pilot Gate — Sample",
  labelEn: "AI & Automation Pilot Gate — Sample",
  statusTh: "Sample pilot · Replace with an approved hotel process",
  statusEn: "Sample pilot · Replace with an approved hotel process",
  captionTh: "ลำดับทดลองเล็กในขอบเขตที่ควบคุมได้ ยังไม่มีผลวัดจริง และไม่ได้สมมติว่าต้อง Scale",
  captionEn: "A small, controlled experiment path. No measured result, and Scale is not the assumed outcome.",
  altTh: "แผนภาพตัวอย่างเลือกหนึ่งงาน บันทึกเส้นฐาน ทดลองด้วยข้อมูลที่อนุมัติ ทบทวน แล้วเลือก Scale Adjust หรือ Stop",
  altEn: "Sample diagram: select one bounded task, record a baseline, test on a real workflow with approved data, review, then Scale, Adjust, or Stop.",
  status: "sample",
  displayWidth: 720,
  displayHeight: 405,
} as const;

export const HOTEL_AI_EVIDENCE_PROCESS = {
  before: [
    { id: "tool", th: "เลือกเครื่องมือก่อน", en: "Choose a tool first" },
    { id: "fit", th: "ค่อยหาให้งานพอดี", en: "Then look for work that fits" },
    { id: "gap", th: "ยังไม่ชัดว่าใครตรวจ", en: "Reviewer still unclear" },
  ],
  after: [
    { id: "work", th: "เริ่มจากงานที่ติด", en: "Start from stuck work" },
    { id: "simple", th: "ทำให้ง่าย", en: "Simplify" },
    { id: "pilot", th: "ทดลองเล็ก", en: "Small pilot" },
    { id: "review", th: "คนตรวจ", en: "Human review" },
    { id: "decide", th: "Scale / Adjust / Stop", en: "Scale / Adjust / Stop" },
  ],
} as const;

export const HOTEL_AI_EVIDENCE_VISUAL_CANDIDATE = "/images/hotel-ai-automation-evidence-placeholder.webp";

export const HOTEL_AI_EVIDENCE_VISUAL = {
  src: HOTEL_AI_EVIDENCE_VISUAL_CANDIDATE,
  labelTh: "Research / Case Study Evidence — Sample · Replace with verified source",
  labelEn: "Research / Case Study Evidence — Sample · Replace with verified source",
  statusTh: "Sample process · No published result",
  statusEn: "Sample process · No published result",
  captionTh: "แผนภาพหลักการก่อน/หลัง ไม่ใช่ผลวัดโรงแรม และไม่ใช่รูปหรือกราฟกรณีศึกษา",
  captionEn: "A before/after process diagram of the principle. Not a hotel result, and not a case-study photo or chart.",
  altTh: "แผนภาพตัวอย่าง เริ่มจากเลือกเครื่องมือก่อน เทียบกับเริ่มจากงานที่ติด ทำให้ง่าย ทดลองเล็ก มีคนตรวจ แล้วค่อยตัดสินใจ",
  altEn: "Sample diagram comparing choosing a tool first with starting from stuck work, simplifying, a small pilot, human review, then a decision.",
  status: "sample",
  displayWidth: 520,
  displayHeight: 347,
} as const;

export const HOTEL_AI_SCORECARD_VISUAL_CANDIDATE = "/images/hotel-ai-automation-pilot-scorecard-placeholder.webp";

export const HOTEL_AI_SCORECARD_VISUAL = {
  src: HOTEL_AI_SCORECARD_VISUAL_CANDIDATE,
  labelTh: "AI Automation Pilot Scorecard · Sample data",
  labelEn: "AI Automation Pilot Scorecard · Sample data",
  statusTh: "Sample scorecard · No approved result",
  statusEn: "Sample scorecard · No approved result",
  captionTh: "ตารางตัวอย่างช่องว่าง เส้นฐานและช่วงทดลองยังไม่มีตัวเลขที่อนุมัติ ไม่ใช่กราฟผลลัพธ์โรงแรม",
  captionEn: "A sample empty scorecard. Baseline and pilot have no approved figures. Not a hotel results chart.",
  altTh: "ตารางตัวอย่าง Pilot Scorecard แสดงตัวชี้วัดหกตัว ช่องเส้นฐานและช่วงทดลองว่าง และมีป้ายตัวอย่างข้อมูล",
  altEn: "Sample Pilot Scorecard showing six metrics with empty baseline and pilot cells and a sample-data label.",
  status: "sample",
  displayWidth: 720,
  displayHeight: 405,
} as const;

export const HOTEL_AI_OWNERSHIP_VISUAL_CANDIDATE = "/images/hotel-ai-automation-data-ownership-placeholder.webp";

export const HOTEL_AI_OWNERSHIP_VISUAL = {
  src: HOTEL_AI_OWNERSHIP_VISUAL_CANDIDATE,
  labelTh: "Data Ownership and Human Review Flow — Sample",
  labelEn: "Data Ownership and Human Review Flow — Sample",
  statusTh: "Sample flow · Not a security certification",
  statusEn: "Sample flow · Not a security certification",
  captionTh: "แผนภาพตัวอย่างห้าขั้นจากข้อมูลเท่าที่จำเป็นถึงนโยบายปลายทาง ไม่ได้อ้างว่าปลอดภัย 100%",
  captionEn: "A sample five-step path from necessary data to an approved destination policy. This is not a 100% secure claim.",
  altTh: "แผนภาพตัวอย่าง ข้อมูลเท่าที่จำเป็น ตรวจวัตถุประสงค์และสิทธิ์ ขั้น AI ที่อนุมัติ คนตรวจผลที่มีผลกระทบ แล้วส่งตามนโยบายเก็บหรือลบ",
  altEn: "Sample diagram: necessary data, purpose and permission check, approved AI or automation step, human review for consequential outputs, then approved destination, storage, or deletion.",
  status: "sample",
  displayWidth: 720,
  displayHeight: 405,
} as const;

export const HOTEL_AI_FIT_FIELDS = {
  example: { th: "ตัวอย่างงาน", en: "Example" },
  start: { th: "เริ่มเมื่อ", en: "Start when" },
  guard: { th: "เงื่อนไขควบคุม", en: "Guardrails" },
} as const;

export const HOTEL_AI_FIT = [
  {
    id: "reservations",
    label: "Reservations",
    titleTh: "งานจอง",
    titleEn: "Reservations",
    exampleTh: "จัดหมวดและส่งต่อ enquiry",
    exampleEn: "Categorize and route enquiries.",
    startTh: "มี enquiry ที่เกิดซ้ำ และกำหนดหมวดกับเจ้าของงานได้",
    startEn: "Enquiry volume is recurring, and categories and owners can be defined.",
    guardTh: "คนอนุมัติข้อความถึงแขกและข้อยกเว้น",
    guardEn: "Human approval for guest-facing replies and exceptions.",
  },
  {
    id: "revenue",
    label: "Revenue",
    titleTh: "งานรายได้",
    titleEn: "Revenue",
    exampleTh: "รวมข้อมูลที่อนุมัติแล้วเพื่อรายงานพร้อมทบทวน",
    exampleEn: "Consolidate approved data for review-ready reports.",
    startTh: "นิยามตัวชี้วัดและแหล่งความจริงตกลงแล้ว",
    startEn: "Metric definitions and the source of truth are agreed.",
    guardTh: "ผู้ทบทวนตรวจตัวเลขและการตีความทั้งหมด",
    guardEn: "A reviewer checks all numbers and the interpretation.",
  },
  {
    id: "distribution",
    label: "Distribution",
    titleTh: "งานช่องทางขาย",
    titleEn: "Distribution",
    exampleTh: "ตรวจความสอดคล้องของข้อมูลข้ามระบบ",
    exampleEn: "Check information consistency across systems.",
    startTh: "ระบบที่เกี่ยวข้องและเจ้าของฟิลด์ถูกบันทึกแล้ว",
    startEn: "Relevant systems and field owners are documented.",
    guardTh: "ต้องตรวจแล้วว่าผู้ให้บริการและ API รองรับ",
    guardEn: "Provider and API support must be verified.",
  },
  {
    id: "marketing",
    label: "Marketing",
    titleTh: "งานการตลาด",
    titleEn: "Marketing",
    exampleTh: "ร่างหรือจัดหมวดเนื้อหาแคมเปญที่อนุมัติแล้ว",
    exampleEn: "Draft or categorize approved campaign content.",
    startTh: "มีน้ำเสียงแบรนด์และเส้นทางอนุมัติ",
    startEn: "Brand voice and an approval flow exist.",
    guardTh: "คนอนุมัติก่อนเผยแพร่หรือส่ง",
    guardEn: "Human approval before publication or sending.",
  },
  {
    id: "operations",
    label: "Operations",
    titleTh: "งานปฏิบัติการ / ประสบการณ์แขก",
    titleEn: "Operations / Guest Experience",
    exampleTh: "ค้น SOP ที่อนุมัติ หรือจัดโครงสร้างบันทึกส่งต่อ",
    exampleEn: "Search approved SOP or structure handover notes.",
    startTh: "มีแหล่งที่อนุมัติและผู้รับผิดชอบการอัปเดต",
    startEn: "An approved source and an update owner are defined.",
    guardTh: "เนื้อหาเรื่องความปลอดภัยหรือนโยบายต้องมีคนตรวจ",
    guardEn: "Safety- and policy-critical content must be reviewed.",
  },
  {
    id: "management",
    label: "Management",
    titleTh: "งานบริหาร / งานขาย",
    titleEn: "Management / Sales",
    exampleTh: "เตรียมสรุปประชุม หรือส่งต่องานติดตามภายใน",
    exampleEn: "Prepare meeting summaries or route internal follow-up.",
    startTh: "สิทธิ์เข้าถึง เจ้าของการตัดสินใจ และขั้นตอนการลงมือชัด",
    startEn: "Access, the decision owner, and the action process are clear.",
    guardTh: "การจัดการข้อมูลลับและการอนุมัติจากเจ้าของงาน",
    guardEn: "Confidential data handling and owner approval.",
  },
] as const;

export const HOTEL_AI_FIT_NOT_READY = [
  { id: "unstable", th: "ขั้นตอนยังไม่นิ่ง", en: "The steps are still unstable" },
  { id: "owner", th: "ยังไม่มีเจ้าของงาน", en: "There is no named owner" },
  { id: "data", th: "ข้อมูลยังไม่น่าเชื่อถือ", en: "The data is not reliable" },
  { id: "impact", th: "ผลกระทบสูงด้านความปลอดภัย กฎหมาย หรือการเงิน โดยยังไม่มีมาตรควบคุม", en: "High safety, legal, or financial impact, without controls" },
  { id: "fallback", th: "ยังไม่มีวิธีทำด้วยมือเมื่อระบบอัตโนมัติใช้ไม่ได้", en: "There is no manual fallback if automation fails" },
] as const;

export const HOTEL_AI_FIT_VISUAL_CANDIDATE = "/images/hotel-ai-automation-fit-matrix-placeholder.webp";

export const HOTEL_AI_FIT_VISUAL = {
  src: HOTEL_AI_FIT_VISUAL_CANDIDATE,
  labelTh: "Hotel AI & Automation Fit Matrix — Sample",
  labelEn: "Hotel AI & Automation Fit Matrix — Sample",
  statusTh: "Sample fit check · Not a claim that AI suits every team",
  statusEn: "Sample fit check · Not a claim that AI suits every team",
  captionTh: "ตารางตัวอย่างตรวจความพร้อมของงาน มีเงื่อนไขเริ่มต้นและจุดที่ต้องมีคนตรวจ ไม่ใช่ผลลูกค้า",
  captionEn: "A sample fit check by workflow, with start conditions and review guardrails. Not a client result.",
  altTh: "แผนภาพตัวอย่างหกแผนก จอง รายได้ ช่องทางขาย การตลาด ปฏิบัติการ และบริหาร พร้อมแถบงานที่ยังไม่พร้อมทำให้อัตโนมัติ",
  altEn: "Sample diagram of six hotel workflows — reservations, revenue, distribution, marketing, operations, and management — plus a not-ready-to-automate band.",
  status: "sample",
  displayWidth: 720,
  displayHeight: 405,
} as const;

export const HOTEL_AI_ACADEMY_HREF = "https://thekpiplus.co.th/discover";

export const HOTEL_AI_RELATED_COVER_ITEMS = [
  { id: "tech", label: "Technology decisions" },
  { id: "meetings", label: "Revenue meetings" },
  { id: "search", label: "Search health" },
  { id: "academy", label: "Academy courses" },
] as const;

export const HOTEL_AI_RELATED_VISUAL_CANDIDATE = "/images/hotel-ai-automation-related-content-placeholder.webp";

export const HOTEL_AI_RELATED_VISUAL = {
  src: HOTEL_AI_RELATED_VISUAL_CANDIDATE,
  labelTh: "Hotel AI & Automation Guide — Sample Cover",
  labelEn: "Hotel AI & Automation Guide — Sample Cover",
  statusTh: "Sample cover · Not a published PDF or client result",
  statusEn: "Sample cover · Not a published PDF or client result",
  captionTh: "ปกคู่มือตัวอย่าง ไม่ใช่ไฟล์ดาวน์โหลด ไม่ใช่ภาพฮีโร่หรือจุดติดขัด และไม่ใช่ภาพบทความจริง",
  captionEn: "A sample guide cover. Not a downloadable file, not the hero or pain-point image, and not a live article photo.",
  altTh: "ปกคู่มือตัวอย่าง Hotel AI และ Automation แสดงหัวข้อเทคโนโลยี การประชุมรายได้ สุขภาพการค้นหา และหลักสูตร Academy",
  altEn: "Sample Hotel AI and Automation guide cover listing technology decisions, revenue meetings, search health, and Academy courses.",
  status: "sample",
  displayWidth: 520,
  displayHeight: 347,
} as const;

export type HotelAiRelatedCard = {
  id: string;
  href: string;
  featured?: boolean;
  external?: boolean;
  categoryTh: string;
  categoryEn: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  publishedAt?: string;
  updatedAt?: string;
  dateKind?: "published" | "updated";
  contentTypeTh: string;
  contentTypeEn: string;
  ctaTh: string;
  ctaEn: string;
};

export function hotelAiRelatedDateLabel(card: HotelAiRelatedCard, locale: Locale) {
  const iso = card.dateKind === "updated" ? card.updatedAt || card.publishedAt : card.publishedAt;
  if (!iso) return "";
  const prefix = card.dateKind === "updated" ? (locale === "th" ? "อัปเดต" : "Updated") : locale === "th" ? "เผยแพร่" : "Published";
  return `${prefix} ${formatInsightDate(iso, locale)}`;
}

export function hotelAiRelatedCards(locale: Locale): HotelAiRelatedCard[] {
  const cards: HotelAiRelatedCard[] = [];
  const used = new Set<string>();

  const push = (card: HotelAiRelatedCard | null) => {
    if (!card || used.has(card.href)) return;
    const href = card.external
      ? card.href
      : existingHref(card.href, locale) || existingHref(card.href, "th");
    if (!href || used.has(href)) return;
    used.add(href);
    cards.push({ ...card, href });
  };

  const tech = insightPosts.find((post) => post.id === "hotel-technology-adoption-commercial-project" && post.isPublished !== false);
  const meetings = insightPosts.find((post) => post.id === "hotel-revenue-meetings-that-lead-to-decisions" && post.isPublished !== false);

  if (tech) {
    const updated = insightUpdatedAt(tech);
    push({
      id: "tech",
      href: tech.href,
      featured: true,
      categoryTh: tech.category.th,
      categoryEn: tech.category.en,
      titleTh: tech.title.th,
      titleEn: tech.title.en,
      descriptionTh: insightExcerpt(tech, "th"),
      descriptionEn: insightExcerpt(tech, "en"),
      publishedAt: tech.publishedAt,
      updatedAt: updated || undefined,
      dateKind: updated ? "updated" : "published",
      contentTypeTh: "บทความ",
      contentTypeEn: "Article",
      ctaTh: "อ่านบทความ",
      ctaEn: "Read article",
    });
  }

  if (meetings) {
    const updated = insightUpdatedAt(meetings);
    push({
      id: "meetings",
      href: meetings.href,
      categoryTh: meetings.category.th,
      categoryEn: meetings.category.en,
      titleTh: meetings.title.th,
      titleEn: meetings.title.en,
      descriptionTh: insightExcerpt(meetings, "th"),
      descriptionEn: insightExcerpt(meetings, "en"),
      publishedAt: meetings.publishedAt,
      updatedAt: updated || undefined,
      dateKind: updated ? "updated" : "published",
      contentTypeTh: "บทความ",
      contentTypeEn: "Article",
      ctaTh: "อ่านบทความ",
      ctaEn: "Read article",
    });
  }

  push({
    id: "search",
    href: "/tools/hotel-searchability-check",
    categoryTh: "การค้นหาและการมองเห็น",
    categoryEn: "Website Search Health",
    titleTh: "ตรวจสุขภาพการค้นหาเว็บไซต์โรงแรม",
    titleEn: "Hotel website searchability check",
    descriptionTh: "ตรวจว่าเว็บไซต์โรงแรมพร้อมแค่ไหนสำหรับ Google, AI Search และผู้ใช้งานบนมือถือ ไม่ใช่ผลอันดับหรือยอดจอง",
    descriptionEn: "Check whether a hotel homepage is ready for Google, AI Search, and mobile visitors. Not a ranking or booking result.",
    contentTypeTh: "เครื่องมือ",
    contentTypeEn: "Tool",
    ctaTh: "ใช้เครื่องมือ",
    ctaEn: "Use the tool",
  });

  push({
    id: "academy",
    href: HOTEL_AI_ACADEMY_HREF,
    external: true,
    categoryTh: "The KPI Plus Academy",
    categoryEn: "The KPI Plus Academy",
    titleTh: "หลักสูตรและกิจกรรมของ The KPI Plus Academy",
    titleEn: "Courses and events at The KPI Plus Academy",
    descriptionTh: "หลักสูตร เวิร์กช็อป และกิจกรรมสำหรับผู้ที่ต้องการพัฒนาทักษะด้วยตนเอง รวมหัวข้อด้าน AI และทักษะดิจิทัล",
    descriptionEn: "Courses, workshops, and events for people developing skills themselves, including AI and digital-skill topics.",
    contentTypeTh: "หลักสูตร",
    contentTypeEn: "Courses",
    ctaTh: "ดูหลักสูตรและกิจกรรม",
    ctaEn: "See courses and events",
  });

  return cards;
}

export const HOTEL_AI_ENQUIRY_VISUAL_CANDIDATE = "/images/hotel-ai-automation-contact-process-placeholder.webp";

export const HOTEL_AI_ENQUIRY_FLOW = [
  { id: "intake", label: "Workflow Intake" },
  { id: "simplify", label: "Simplify" },
  { id: "pilot", label: "Pilot" },
  { id: "review", label: "Review" },
] as const;

export const HOTEL_AI_ENQUIRY_GOALS = [
  { id: "reduce_repetition", th: "ลดงานซ้ำ", en: "Reduce repetition" },
  { id: "shorten_delay", th: "ย่นเวลาที่รอกัน", en: "Shorten delay" },
  { id: "reduce_handoffs", th: "ลดการส่งต่อที่ตกหล่น", en: "Reduce missed handoffs" },
  { id: "prepare_reports", th: "เตรียมรายงาน", en: "Prepare reports" },
  { id: "search_sop", th: "ค้น SOP", en: "Search SOP" },
  { id: "other", th: "อื่น ๆ", en: "Other" },
] as const;

export const HOTEL_AI_ENQUIRY_VISUAL = {
  src: HOTEL_AI_ENQUIRY_VISUAL_CANDIDATE,
  labelTh: "What Happens Next — Sample process",
  labelEn: "What Happens Next — Sample process",
  statusTh: "Sample process · Not a live client workflow",
  statusEn: "Sample process · Not a live client workflow",
  captionTh: "ลำดับตัวอย่างหลังส่งงาน ไม่ต้องส่งรหัสผ่าน ข้อมูลแขก หรือโทเคนระบบ",
  captionEn: "A sample sequence after you send the work. Do not send passwords, guest data, or system tokens.",
  altTh: "แผนภาพตัวอย่างหลังเริ่มคุย Workflow Intake ไป Simplify ไป Pilot แล้ว Review",
  altEn: "Sample What Happens Next process: Workflow Intake, Simplify, Pilot, then Review.",
  status: "sample",
  displayWidth: 420,
  displayHeight: 210,
  sourceWidth: 1200,
  sourceHeight: 600,
} as const;

export function hotelAiGoalLabel(id: string, locale: Locale) {
  const goal = HOTEL_AI_ENQUIRY_GOALS.find((item) => item.id === id);
  if (!goal) return "";
  return locale === "th" ? goal.th : goal.en;
}

export function composeHotelAiEnquiryMessage(
  state: {
    topic: string;
    message: string;
    scope: string;
    channels: string;
    goal: string;
  },
  locale: Locale,
) {
  const thai = locale === "th";
  const goal = hotelAiGoalLabel(state.goal, locale);
  const parts = [
    state.message.trim()
      ? thai
        ? `งานที่อยากทำให้ดีขึ้น: ${state.message.trim()}`
        : `Workflow to improve: ${state.message.trim()}`
      : "",
    state.topic.trim()
      ? thai
        ? `แผนกหรือบทบาท: ${state.topic.trim()}`
        : `Role / department: ${state.topic.trim()}`
      : "",
    state.scope.trim()
      ? thai
        ? `ความถี่หรือปริมาณงาน: ${state.scope.trim()}`
        : `Frequency / workload: ${state.scope.trim()}`
      : "",
    state.channels.trim()
      ? thai
        ? `ระบบหรือช่องทางที่เกี่ยวข้อง: ${state.channels.trim()}`
        : `Related systems / channels: ${state.channels.trim()}`
      : "",
    goal ? (thai ? `เป้าหมาย: ${goal}` : `Goal: ${goal}`) : "",
  ];
  return parts.filter(Boolean).join("\n\n");
}

const HOTEL_AI_ENQUIRY_SECRET_ASSIGN =
  /(api[_-\s]?key|secret[_-\s]?key|password|passwd|auth[_-\s]?token|access[_-\s]?token|bearer|account[_-\s]?id|booking[_-\s]?id|reservation[_-\s]?id|guest\s+(name|email|phone|data)|payment\s+(data|token|card)|credit\s*card|cvv|รหัสผ่าน|รหัส\s*API|โทเคน|เลขที่บัญชี)\s*[:=]\s*\S+/i;
const HOTEL_AI_ENQUIRY_SECRET_TOKEN =
  /\b(sk_live_[A-Za-z0-9]+|pk_live_[A-Za-z0-9]+|sk_test_[A-Za-z0-9]+|rk_live_[A-Za-z0-9]+|Bearer\s+[A-Za-z0-9\-._]{12,})\b/;

export function hotelAiEnquiryHasSecrets(value: string) {
  HOTEL_AI_ENQUIRY_SECRET_ASSIGN.lastIndex = 0;
  HOTEL_AI_ENQUIRY_SECRET_TOKEN.lastIndex = 0;
  return HOTEL_AI_ENQUIRY_SECRET_ASSIGN.test(value) || HOTEL_AI_ENQUIRY_SECRET_TOKEN.test(value);
}

export function hotelAiEnquiryCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: "AI & Automation",
    heading: thai ? "ส่งหนึ่งงานจริงที่ทีมอยากทำให้ดีขึ้น" : "Send one real workflow the team wants to improve",
    lead: thai
      ? "บอกงานที่ทำซ้ำหรือติด ระบบหรือช่องทางที่เกี่ยวข้อง และสิ่งที่อยากให้ดีขึ้น ไม่ต้องส่งชื่อแขก เลขการจอง ข้อมูลชำระเงิน รหัสผ่าน หรือโทเคนระบบ"
      : "Describe the repeated or blocked task, the systems or channels involved, and what should get better. Do not send guest names, booking IDs, payment details, passwords, or system tokens.",
    nextTitle: "What Happens Next",
    steps: thai
      ? [
          "อธิบายงานที่เกิดซ้ำหรือติด",
          "ระบุระบบหรือช่องทางที่เกี่ยวข้อง โดยไม่ส่งรหัสผ่านหรือข้อมูลแขก",
          "ประเมินว่าควร Simplify, Automate หรือทดลองใช้ AI",
          "ตกลงขอบเขตทดลอง เจ้าของงาน จุดที่ต้องมีคนตรวจ และขั้นตอนถัดไป",
        ]
      : [
          "Describe the repeated or blocked task.",
          "Identify the systems or channels involved, without sharing credentials or guest data.",
          "Assess whether to Simplify, Automate, or test AI.",
          "Agree Pilot scope, owner, human review, and next action.",
        ],
    note: thai
      ? "ยังไม่ต้องรู้ว่าควรใช้เครื่องมือใด ทีมจะเริ่มจากงานจริง แล้วดูว่าควรทำให้ง่าย ทดลองอัตโนมัติ หรือยังไม่เริ่ม"
      : "You do not need to know which tool to use. The team starts from the real work, then looks at whether to simplify, trial automation, or wait.",
    submit: thai ? "ให้ทีมช่วยดู Workflow ของคุณ" : "Send a workflow for the team to review",
    loading: thai ? "กำลังส่งข้อมูล กรุณารอสักครู่" : "Sending your message. Please wait.",
    success: thai
      ? "ได้รับเรื่องแล้ว ทีมจะติดต่อกลับผ่านช่องทางที่ให้ไว้ เพื่อดูหนึ่งงานจริง ไม่ใช่การติดตั้งระบบทันที"
      : "Message received. The team will reply on the channel you shared to look at one real workflow. This is not an immediate system installation.",
    failed: thai
      ? "ส่งไม่สำเร็จ กรุณาลองอีกครั้ง หรือติดต่อทีมโดยตรง"
      : "Could not send. Please try again, or contact the team directly.",
    unavailable: thai
      ? "ขณะนี้ยังส่งต่อทีมไม่ได้ กรุณาติดต่อทางอีเมลหรือโทรศัพท์"
      : "This page cannot send the request right now. Please email or call the team.",
    goalEmpty: thai ? "เลือกเป้าหมาย" : "Choose a goal",
    groups: {
      contact: thai ? "ข้อมูลติดต่อ" : "Contact details",
      hotel: thai ? "โรงแรมและงาน" : "Hotel and work",
      workflow: thai ? "งานที่อยากทำให้ดีขึ้น" : "The workflow to improve",
    },
    labels: {
      name: thai ? "ชื่อผู้ติดต่อ" : "Contact name",
      role: thai ? "แผนกหรือบทบาท" : "Role / department",
      business: thai ? "ชื่อโรงแรม / บริษัท" : "Hotel / company name",
      workflow: thai ? "งานที่อยากทำให้ดีขึ้น" : "Workflow to improve",
      workflowHint: thai
        ? "อธิบายงานที่ทำซ้ำหรือติด โดยไม่ต้องส่งชื่อแขก เลขการจอง ข้อมูลชำระเงิน รหัสผ่าน หรือโทเคนระบบ"
        : "Describe the repeated or blocked task. Do not send guest names, booking IDs, payment details, passwords, or system tokens.",
      workload: thai ? "ความถี่หรือปริมาณงานโดยประมาณ" : "Frequency / approximate workload",
      workloadHint: thai ? "เช่น ทุกวัน หรือสัปดาห์ละ 10 รายการ" : "For example daily, or about 10 items a week",
      systems: thai ? "ระบบหรือช่องทางที่เกี่ยวข้อง" : "Related systems / channels",
      systemsHint: thai
        ? "เช่น PMS, เว็บไซต์, LINE, อีเมล, สเปรดชีต อย่าส่งรหัสผ่านหรือโทเคน"
        : "For example PMS, website, LINE, email, spreadsheet. Do not send a password or token.",
      goal: thai ? "เป้าหมาย" : "Goal",
      contact: thai ? "อีเมลหรือเบอร์โทร" : "Email / phone",
      consent: thai
        ? "ข้าพเจ้ายินยอมให้ เดอะ เคพีไอ พลัส ใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับคำขอนี้ ตาม"
        : "I agree that The KPI Plus may use this information to reply about this request, under the",
      privacy: thai ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy",
      optional: thai ? "ไม่บังคับ" : "Optional",
      required: thai ? "จำเป็น" : "Required",
      requiredMsg: thai ? "กรุณากรอกข้อมูลนี้" : "This field is required",
      invalidEmail: thai ? "กรุณาใส่อีเมลให้ถูกต้อง หรือใช้เบอร์โทร" : "Enter a valid email, or use a phone number",
      consentRequired: thai ? "กรุณายอมรับนโยบายความเป็นส่วนตัว" : "Please accept the privacy policy",
      secretMsg: thai
        ? "ห้ามใส่รหัสผ่าน โทเคน เลขการจอง ข้อมูลชำระเงิน หรือข้อมูลแขก — อธิบายงานโดยไม่ส่งข้อมูลอ่อนไหว"
        : "Do not send passwords, tokens, booking IDs, payment details, or guest data. Describe the work without sensitive details.",
    },
  };
}

const HOTEL_AI_FAQS = [
  {
    qTh: "The KPI Plus ช่วยติดตั้งและทำ Automation ให้ด้วยหรือไม่",
    qEn: "Does The KPI Plus also set up and build the automation?",
    aTh: "ช่วยได้ในขอบเขตที่ตกลง ตั้งแต่สำรวจงาน ทำให้ง่าย ตั้งค่าเครื่องมือที่ระบบรองรับ ทดลอง Pilot อบรมทีม และทบทวนผล ไม่ใช่การติดตั้งสำเร็จรูปทุกโรงแรม ความเป็นไปได้ขึ้นกับระบบที่มี สิทธิ์ ข้อมูล API หรือตัวเชื่อม ไลเซนส์ และการมีคนตรวจ",
    aEn: "Yes, within the agreed scope: mapping the work, simplifying it, setting up tools the systems support, running a Pilot, training the team, and reviewing the result. It is not a ready-made install for every hotel. Feasibility depends on the systems in place, permissions, data, API or connector, licence, and human review.",
  },
  {
    qTh: "จำเป็นต้องเปลี่ยน PMS หรือระบบเดิมก่อนหรือไม่",
    qEn: "Does the hotel have to change the PMS or current systems first?",
    aTh: "ไม่จำเป็นเสมอไป งานเริ่มจากระบบที่ใช้อยู่ สิทธิ์ และข้อมูลที่ส่งต่อได้ หากระบบเดิมรองรับขอบเขตที่ตกลง ก็ใช้ต่อได้ การเปลี่ยนระบบเป็นทางเลือกเมื่อตรวจแล้วว่าทำขอบเขตนั้นไม่ได้",
    aEn: "Not always. Work starts from the current systems, access, and data that can be handed over. If they support the agreed scope, they can stay. A change is considered only after a review shows that scope cannot run on what is already there.",
  },
  {
    qTh: "AI จะตอบลูกค้าแทนพนักงานทั้งหมดหรือไม่",
    qEn: "Will AI answer guests instead of staff in every case?",
    aTh: "ไม่ AI ไม่ได้แทนพนักงานทั้งหมด และไม่ได้ตอบลูกค้าเองในเรื่องอ่อนไหว องค์กรเลือกได้ว่าจะให้ระบบช่วยขั้นตอนใด เช่น ค้น SOP จัดประเภทคำถาม หรือเตรียมร่าง พร้อมกำหนดกรณีที่ต้องส่งต่อให้คน ผลลัพธ์จาก AI ไม่ถูกต้องเสมอ",
    aEn: "No. AI does not replace all staff, and it does not send guest-facing replies on its own for sensitive topics. The organisation chooses which steps the system may help — such as searching an SOP, sorting a question, or drafting a reply — and which cases must go to a person. AI output is not always accurate.",
  },
  {
    qTh: "ข้อมูลลูกค้าปลอดภัยอย่างไร",
    qEn: "How is guest data kept safe?",
    aTh: "หน้านี้ไม่รับประกันว่าปลอดภัย 100% ก่อนใช้ต้องตกลงขอบเขตข้อมูล สิทธิ์เข้าถึง เครื่องมือ ผู้ตรวจทาน และวิธีทำด้วยมือเมื่อระบบใช้ไม่ได้ โรงแรมยังเป็นเจ้าของข้อมูลปฏิบัติการ ฟอร์มสาธารณะไม่ขอชื่อแขก เลขการจอง ข้อมูลชำระเงิน รหัสผ่าน หรือโทเคนระบบ",
    aEn: "This page does not claim the work is 100% secure. Before use, the hotel agrees the data scope, who can access it, which tools are used, who reviews the result, and the manual fallback if the workflow fails. The hotel remains the owner of operational data. The public form does not ask for guest names, booking IDs, payment details, passwords, or system tokens.",
  },
  {
    qTh: "เริ่มต้นโครงการเล็กได้หรือไม่",
    qEn: "Can this start as a small project?",
    aTh: "ได้ แนวทางปกติคือเลือกหนึ่งงานที่มีเจ้าของ เส้นฐาน และขอบเขตทดลอง จากนั้นเลือก Scale, Adjust หรือ Stop จากผลจริง ไม่สมมติว่าต้องขยาย และไม่รับประกันผลทางธุรกิจ",
    aEn: "Yes. The usual start is one task with an owner, a baseline, and a bounded Pilot. After the trial the hotel can Scale, Adjust, or Stop from what actually happened. Scale is not assumed, and there is no guaranteed business outcome.",
  },
  {
    qTh: "ต้องมี AI Tool อยู่แล้วหรือไม่",
    qEn: "Do we already need an AI tool in place?",
    aTh: "ไม่ต้อง งานไม่เริ่มจากเครื่องมือ แต่เริ่มจากงานจริงที่ติดหรือทำซ้ำ หากมีเครื่องมืออยู่แล้ว จะประเมินกับเวิร์กโฟลว์นั้น หากยังไม่มี อาจทำให้ง่าย ทดลองอัตโนมัติโดยยังไม่ใช้ AI หรือยังไม่เริ่ม",
    aEn: "No. The work does not start from a tool. It starts from a real repeated or blocked task. If a tool is already in place, it is assessed against that workflow. If none exists, the next step may be to simplify, trial automation without AI, or wait.",
  },
  {
    qTh: "ถ้าระบบเดิมไม่มี API จะทำอย่างไร",
    qEn: "What if the current systems have no API?",
    aTh: "จะบันทึกข้อจำกัดนั้น แล้วดูตัวเชื่อม การส่งออกข้อมูล หรือขั้นตอนกึ่งแมนนวลที่ทำได้ ไม่สามารถบังคับผู้ให้บริการให้เปิด API และไม่สัญญาว่าทุกระบบจะทำอัตโนมัติได้",
    aEn: "That limit is recorded. The team then looks at any connector, export, or semi-manual step that can still run. A provider cannot be forced to open an API, and not every system can be automated.",
  },
  {
    qTh: "ใครตรวจคำตอบหรือผลลัพธ์จาก AI",
    qEn: "Who reviews AI answers or outputs?",
    aTh: "โรงแรมตั้งผู้ตรวจทานที่เป็นคนก่อนเริ่มใช้ เดอะ เคพีไอ พลัสไม่ได้ส่งข้อความถึงแขกเองในเรื่องอ่อนไหว จุดตรวจ เจ้าของงาน และข้อยกเว้นตกลงใน Pilot ผลลัพธ์จาก AI ยังต้องมีคนรับผิดชอบก่อนใช้เมื่อมีผลกระทบต่อแขก ราคา หรือข้อมูลส่วนบุคคล",
    aEn: "The hotel names a human reviewer before the workflow is used. The KPI Plus does not send guest-facing messages on its own for sensitive topics. The review point, owner, and exception path are agreed in the Pilot. AI output still needs a person before it is used when it can affect a guest, a rate, or personal data.",
  },
  {
    qTh: "จะวัดผล Pilot อย่างไร",
    qEn: "How is a Pilot measured?",
    aTh: "ก่อนทดลองตกลงนิยาม ช่วงวัด แหล่งข้อมูล และผู้ทบทวน แล้วเทียบเส้นฐานกับช่วงทดลองจากงานชุดเดียวกัน เช่น เวลา ข้อผิดพลาด ข้อยกเว้น และภาระที่คนต้องตรวจ หน้านี้ยังไม่มีตัวเลขที่อนุมัติ จึงไม่ใส่ร้อยละหรือผลประหยัด และไม่รับประกันผลทางธุรกิจ",
    aEn: "Before a Pilot, agree the definition, period, source, and review owner, then compare baseline and trial on the same real work — such as time, errors, exceptions, and human review load. This page has no approved figures, so it does not publish a percentage or a savings claim, and it does not guarantee a business result.",
  },
  {
    qTh: "สามารถหยุดหรือกลับไปทำงานแบบ Manual ได้หรือไม่",
    qEn: "Can the work be stopped or returned to a manual process?",
    aTh: "ได้ Scale, Adjust และ Stop มีน้ำหนักเท่ากัน ควรมีวิธีทำด้วยมือเมื่อระบบใช้ไม่ได้ก่อนเริ่มใช้จริง การหยุดหรือกลับไปทำเองไม่ได้บังคับให้ต้องใช้ AI ต่อ",
    aEn: "Yes. Scale, Adjust, and Stop carry equal weight. A manual fallback should be agreed before the workflow goes live. Stopping or returning to manual work does not require keeping AI in place.",
  },
  {
    qTh: "ใครเป็นเจ้าของข้อมูลและ Workflow หลังส่งมอบ",
    qEn: "Who owns the data and workflow after handover?",
    aTh: "โรงแรมเป็นเจ้าของข้อมูลปฏิบัติการและเวิร์กโฟลว์หลังส่งมอบ สิทธิ์เข้าถึงและจุดตรวจยังอยู่กับผู้ที่ถูกตั้งชื่อ เดอะ เคพีไอ พลัสไม่ได้เป็นผู้ปฏิบัติการแทน เว้นแต่จะตกลงขอบเขตใหม่",
    aEn: "The hotel owns the operational data and the workflow after handover. Access and review stay with the named owners. The KPI Plus is not the live operator unless a later scope is agreed.",
  },
  {
    qTh: "รองรับ Reservations, Revenue, Distribution, Marketing และ Operations หรือไม่",
    qEn: "Can this support Reservations, Revenue, Distribution, Marketing, and Operations?",
    aTh: "พิจารณาได้เมื่อมีงานจริง เจ้าของ ข้อมูล และการตรวจทาน ไม่ใช่ข้อสรุปว่า AI เหมาะกับทุกแผนกหรือทุกโรงแรม แต่ละงานยังขึ้นกับระบบ สิทธิ์ ขอบเขตที่ตกลง และการมีคนตรวจ",
    aEn: "Those teams can be considered when there is a real workflow, an owner, usable data, and a review step. That is not a claim that AI fits every department or every hotel. Each piece of work still depends on the systems in place, permissions, agreed scope, and human review.",
  },
  {
    qTh: "ผลจาก AI ถูกต้องเสมอหรือไม่",
    qEn: "Is AI output always accurate?",
    aTh: "ไม่ถูกต้องเสมอ ผลลัพธ์ขึ้นกับข้อมูลที่อนุมัติ กติกา ข้อยกเว้น และผู้ตรวจทานที่เป็นคน งานที่กระทบแขก ราคา ความปลอดภัย หรือข้อมูลส่วนบุคคลต้องมีคนรับผิดชอบก่อนใช้ หน้านี้จึงไม่รับประกันความถูกต้องหรือผลทางธุรกิจ",
    aEn: "No. Accuracy depends on the approved data, the rules, the exceptions, and a named human reviewer. Work that can affect a guest, a rate, safety, or personal data still needs a person before it is used. This page does not guarantee accuracy or a business result.",
  },
] as const;

export function hotelAiFaqs(locale: Locale): FaqItem[] {
  const thai = locale === "th";
  return HOTEL_AI_FAQS.map((item) => ({
    q: thai ? item.qTh : item.qEn,
    a: thai ? item.aTh : item.aEn,
  }));
}

export function hotelAiFaqsAreStale(items: Array<{ q: string; a: string }>) {
  if (items.length !== HOTEL_AI_FAQS.length) return true;
  const questions = items.map((item) => item.q.trim());
  return !HOTEL_AI_FAQS.every((item) => questions.includes(item.qTh) || questions.includes(item.qEn));
}

export const hotelAiCopy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "AI & Automation",
    titleLead: "นำ AI และ Automation",
    titleAccent: "ไปใช้จริง",
    titleRest: "ในโรงแรมและองค์กร",
    lead: "งานเริ่มจากเวิร์กโฟลว์จริงและปัญหาทางธุรกิจ ไม่ได้เริ่มจากการเลือกเครื่องมือก่อน จากนั้นจึงเลือกเทคโนโลยีที่เหมาะ ทดลอง วัดผล และมีคนตรวจทานก่อนส่งต่อให้ทีม",
    leadClose: "AI เป็นเครื่องมือช่วยทีม ไม่ใช่ระบบที่ทำงานแทนคนทั้งหมด และไม่ใช่คำตอบของทุกเวิร์กโฟลว์",
    cta: "ปรึกษาเรื่อง AI ไปใช้จริง",
    secondary: "ขอให้ช่วยทบทวนระบบโรงแรม",
    underCta: "ส่งงานที่ทีมอยากแก้ ไม่ต้องส่งรหัสผ่าน ข้อมูลการจอง ข้อมูลการชำระเงิน หรือข้อมูลแขก",
    trust: ["สำรวจงาน", "ทดลองเล็ก", "มีคนตรวจทาน", "Scale / Adjust / Stop"],
    problemsTitle: "งานติดตรงไหน ก่อนเลือกเครื่องมือ",
    problemsLead: "ใช้เป็นคำถามตรวจเองกับงานที่ทีมทำอยู่ ไม่ใช่ข้อสรุปว่าโรงแรมทุกแห่งมีปัญหาเหล่านี้ จุดติดมักอยู่ที่ขั้นตอน ข้อมูล และการส่งต่อ ไม่ใช่การยังไม่มี AI",
    problemsCheckTitle: "เช็กลิสต์วินิจฉัยอย่างย่อ",
    problemsCheckLead: "เลือกเฉพาะแถวที่เข้ากับงานของโรงแรมคุณ เก็บหลักฐานจากงานจริง แล้วยังไม่ต้องเลือกเครื่องมือ",
    problemsCheckCaption: "ตารางคำถามตรวจเองสำหรับงานที่ติด ไม่ใช่ผลการวินิจฉัยโรงแรมทุกแห่ง",
    methodTitle: "เดอะ เคพีไอ พลัส ช่วยตั้งแต่แผนจนถึงการใช้งาน",
    methodLead: "แต่ละขั้นมีผลลัพธ์ที่ส่งต่อได้ และมีเกตตัดสินใจก่อนไปขั้นถัดไป ไม่ได้เริ่มจากโมเดลหรือแพลตฟอร์ม แต่เริ่มจากงานจริงที่ทีมทำอยู่",
    methodOutput: "สิ่งที่ได้",
    methodGate: "เกตตัดสินใจ",
    methodCta: "เล่างานที่คุณอยากให้ระบบช่วย",
    casesTitle: "งานที่มักเริ่มพิจารณา",
    casesLead: "ตัวอย่างเป็นเวิร์กโฟลว์โรงแรมที่ใช้จริง ไม่ใช่ความสามารถทั่วไปของ AI แต่ละงานยังต้องดูระบบ สิทธิ์ และการเชื่อมต่อที่ตรวจแล้วก่อน จึงไม่ใช่รายการติดตั้งสำเร็จรูป",
    casesNote: "หน้านี้ไม่ได้ยืนยันว่า LINE PMS CRM อีเมล หรือระบบอื่นเชื่อมแล้ว ความสามารถของเครื่องมือขึ้นกับผู้ให้บริการ API สิทธิ์ ไลเซนส์ การตรวจความปลอดภัย และขอบเขตที่ตกลง AI ไม่ส่งข้อความถึงแขกเองในเรื่องอ่อนไหว",
    pilotTitle: "ทดลองเล็กในขอบเขตที่ควบคุมได้",
    pilotLead: "เริ่มจากหนึ่งงานที่ขอบเขตชัด บันทึกเส้นฐาน ทดลองบนเวิร์กโฟลว์จริงด้วยข้อมูลที่อนุมัติ แล้วทบทวนคุณภาพ ข้อยกเว้น และภาระที่คนต้องตรวจ ก่อนเลือก Scale, Adjust หรือ Stop ทั้งสามทางเป็นคำตอบที่ใช้ได้ ไม่ได้สมมติว่าต้องขยาย",
    pilotCharterTitle: "Pilot Charter — ตัวอย่าง",
    pilotCharterLead: "ฟิลด์ด้านล่างเป็นแบบฟอร์มตัวอย่าง ยังไม่ใช่ผลโครงการจริง ค่าที่ยังไม่ตั้งค่าต้องตกลงก่อนทดลอง",
    pilotCharterCaption: "Pilot Charter ตัวอย่าง ไม่มีตัวเลขผลลัพธ์ และยังไม่ได้เลือก Scale, Adjust หรือ Stop",
    pilotDecisionTitle: "หลังทดลอง เลือกได้ทั้งสามทาง",
    pilotDecisionLead: "Scale, Adjust และ Stop มีน้ำหนักเท่ากัน เลือกจากสิ่งที่เกิดขึ้นจริง ไม่ใช่จากคำสัญญาของเครื่องมือ",
    pilotClose: "หน้านี้ไม่มีผลประหยัดเวลาหรือรายได้จากการทดลอง หากมีโครงการที่อนุมัติแล้ว จะใส่แหล่งที่มาให้ตรวจได้",
    studyTitle: "เริ่มจากงานที่ควรทำให้ง่ายขึ้น ก่อนถามว่า AI ทำอะไรได้",
    studyPrinciples: ["เริ่มจากงานที่ขอบเขตชัด", "ทดลองบนเวิร์กโฟลว์จริง", "ขยายเมื่อผลและความเสี่ยงยอมรับได้"],
    studyTakeawayLead: "Automation ที่ดีไม่ควรเริ่มจาก “อะไรทำได้บ้าง”",
    studyTakeawayClose: "แต่ควรเริ่มจาก “งานไหนควรทำให้ง่ายขึ้น”",
    studyBody: "หลักการนี้ใช้กับงานจริงของทีม ไม่ใช่การนำผลวัดจากกรณีอื่นมาเป็นคำรับประกันของบริการ",
    evidenceSourceLabel: "แหล่งที่มา",
    evidenceContextLabel: "บริบท",
    evidenceMeasureLabel: "สิ่งที่วัด",
    evidenceNoteLabel: "หมายเหตุ",
    evidenceSource: "ยังไม่มีกรณีศึกษาของเดอะ เคพีไอ พลัส ที่อนุมัติให้เผยแพร่ตัวเลขได้ หน้านี้จึงไม่ใส่ผลวัดจากแหล่งภายนอกจนกว่านิยามตัวชี้วัดและความสอดคล้องของตัวเลขจะตรวจครบ",
    evidenceContext: "หลักการบนหน้านี้คือเริ่มจากงานที่ติดและควรทำให้ง่ายขึ้น ไม่ใช่ผลวัดของโรงแรมใดโรงแรมหนึ่ง",
    evidenceMeasure: "ไม่แสดงตัวเลขเวลาหรือผลประหยัดจนกว่าแหล่งที่มา นิยามตัวชี้วัด ช่วงวัด ข้อจำกัด และสิทธิ์การระบุสถานที่จะตรวจครบ",
    evidenceNote: "ผลจากกรณีเดียวไม่ใช่คำรับประกันของทุกโรงแรม",
    measureTitle: "Pilot Scorecard — วัดจากงานที่เปลี่ยน ไม่ใช่คำรับประกันผล",
    measureLead: "เส้นฐานและช่วงทดลองต้องใช้นิยามเดียวกัน หน่วยเดียวกัน และปริมาณงานที่เปรียบเทียบกันได้ ขณะนี้ยังไม่มีตัวเลขที่อนุมัติ จึงเว้นช่องผลลัพธ์ไว้ และอธิบายว่าควรวัดอะไร",
    measureCaption: "Pilot Scorecard ตัวอย่าง ไม่มีตัวเลขเวลา รายได้ หรือผลประหยัดที่อนุมัติ",
    measureUpdatedLabel: "อัปเดตล่าสุด",
    measureOwnerLabel: "เจ้าของตาราง",
    measureUpdatedValue: "ยังไม่ตั้งค่า",
    measureOwnerValue: "ยังไม่ตั้งค่า",
    measureEmpty: "ยังไม่มีข้อมูล",
    measureStatusEmpty: "ยังไม่มีข้อมูลที่อนุมัติ",
    measureEmptyNote: "ก่อนทดลองตกลงนิยาม ช่วงวัด แหล่งข้อมูล และผู้ทบทวน แล้วค่อยใส่เส้นฐานและผลทดลองจากงานจริงชุดเดียวกัน",
    measureReviewNote: "Human Review นับรายการที่ต้องแก้หรืออนุมัติ การมีคนตรวจที่จำเป็นไม่ใช่ผลลัพธ์ที่ไม่ดีโดยอัตโนมัติ",
    measureLegendPositive: "ผลบวกเมื่อมีข้อมูลจริง",
    measureLegendCompare: "เส้นฐาน / เป้าเปรียบเทียบ",
    measureLegendReview: "ต้องมีคนตรวจ",
    measureClose: "หลังทดลองดูด้วยว่าทีมใช้จริงหรือไม่ และแขกยังได้รับการดูแลในจุดที่ต้องมีคนรับผิดชอบหรือไม่ หน้านี้ไม่ใส่ร้อยละ ชั่วโมงที่ประหยัด รายได้ หรือผลผลิตที่สมมติ",
    ownershipTitle: "ใช้ข้อมูลอย่างมีเจ้าของงาน",
    ownershipLead: "ข้อมูลที่ใช้กับ AI หรือ Automation ต้องมีเจ้าของ ผู้ตรวจทาน และขอบเขตที่อนุมัติ หน้านี้เป็นแผนภาพตัวอย่าง ไม่ได้อ้างว่าปลอดภัย 100% หรือผ่านการรับรองทางกฎหมาย",
    ownershipFlowTitle: "Data and Human Review Flow",
    ownershipPrinciplesTitle: "หลักการกำกับดูแล",
    ownershipMatrixTitle: "ตารางสิทธิ์เข้าถึง — ตัวอย่าง",
    ownershipCaption: "ตารางตัวอย่างหมวดข้อมูล เจ้าของ บทบาทที่อนุญาต การตรวจทาน และกติกาเก็บรักษา ค่าที่ยังไม่ตั้งค่าต้องตกลงกับโรงแรม",
    ownershipReviewLead: "ตัวอย่างผลลัพธ์ที่มีผลกระทบ ซึ่งยังต้องมีคนตรวจก่อนใช้",
    ownershipClose: "ฟอร์มสาธารณะไม่ขอข้อมูลแขก การชำระเงิน รหัสผ่าน เลขการจอง หรือไฟล์ลับ หน้านี้ไม่รับรองความปลอดภัย 100% และไม่ใช่คำรับรองทางกฎหมาย",
    reviewTitle: "จุดที่ต้องมีคนตรวจทาน",
    fitTitle: "งานไหนเริ่มได้ — ไม่ใช่ทุกทีมต้องใช้ AI",
    fitLead: "ใช้เป็นตารางตรวจความพร้อมของงาน ไม่ใช่ข้อสรุปว่าโรงแรมทุกแห่งหรือทุกแผนกเหมาะกับ AI แต่ละแถวมีตัวอย่าง เงื่อนไขเริ่มต้น และจุดที่ต้องมีคนตรวจ",
    fitNote: "องค์กรบริการอื่นใช้เกณฑ์เดียวกันกับงานของทีมนั้น ไม่ได้หมายความว่า AI เหมาะกับทุกเวิร์กโฟลว์",
    fitNotReadyTitle: "ยังไม่พร้อมทำให้อัตโนมัติ",
    fitNotReadyLead: "ถ้าขั้นตอนยังไม่นิ่ง ไม่มีเจ้าของ ข้อมูลไม่น่าเชื่อถือ ผลกระทบสูงโดยยังไม่มีมาตรควบคุม หรือยังไม่มีวิธีทำด้วยมือเมื่อระบบใช้ไม่ได้ ให้จัดงานนั้นก่อน ยังไม่ใส่ AI",
    fitCaption: "ตารางตัวอย่างความพร้อมของงานโรงแรม ไม่ใช่คำรับประกันผล และไม่ได้ยืนยันว่าเชื่อมระบบแล้ว",
    closerTitle: "เริ่มจากหนึ่งงานที่ทีมอยากแก้",
    closerBody: "บอกว่างานใดใช้เวลามาก ใครทำ ใช้ระบบอะไร และอยากให้ดีขึ้นอย่างไร ไม่ต้องส่งรหัสผ่านหรือข้อมูลแขก",
    closerCta: "ปรึกษาเรื่องการนำ AI ไปใช้จริง",
    relatedTitle: "อ่านและลองใช้ต่อ",
    relatedLead: "บทความ เครื่องมือ และหลักสูตรที่เกี่ยวข้องกับงานโรงแรม ไม่ใช่กรณีศึกษา และไม่ใช่ผลวัดของโรงแรม",
    faqLead:
      "คำตอบขึ้นกับระบบที่มี สิทธิ์ ข้อมูล ขอบเขตที่ตกลง และการมีคนตรวจ ไม่ใช่คำรับประกันว่า AI แทนพนักงานทั้งหมด ถูกต้องเสมอ หรือให้ผลทางธุรกิจที่รับประกันได้",
    sample: "ตัวอย่างข้อมูล",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "AI & Automation",
    titleLead: "Put AI and automation",
    titleAccent: "into real work",
    titleRest: "in hotels and organisations",
    lead: "Work starts from a real workflow and a business problem, not from selecting a tool first. Then we choose a suitable technology, try it, measure it, and keep a person reviewing before the team takes over.",
    leadClose: "AI is a tool for the team. It is not fully autonomous, and it is not the answer to every workflow.",
    cta: "Talk about putting AI into real work",
    secondary: "Ask for a hotel systems review",
    underCta: "Send the work the team wants to fix. Do not send passwords, booking IDs, payment data, or guest data.",
    trust: ["Map the work", "Small pilot", "Human review", "Scale / Adjust / Stop"],
    problemsTitle: "Where the work is stuck, before a tool is chosen",
    problemsLead: "Use these as self-check questions for the work the team already does. They are not a claim that every hotel has these problems. The gap is usually the step, the data, and the handoff — not the absence of AI.",
    problemsCheckTitle: "A compact diagnostic checklist",
    problemsCheckLead: "Use only the rows that match your hotel’s work. Collect evidence from a real task before a tool is chosen.",
    problemsCheckCaption: "Self-check questions for stuck work. Not a diagnosis of every hotel.",
    methodTitle: "The KPI Plus helps from the plan through to day-to-day use",
    methodLead: "Each step has a handover output and a decision gate before the next step. We do not start from a model or a platform. We start from the work the team already does.",
    methodOutput: "Output",
    methodGate: "Decision gate",
    methodCta: "Tell us the work you want the system to help with",
    casesTitle: "Work that can be considered first",
    casesLead: "These examples are practical hotel workflows, not generic AI capabilities. Each still depends on the organisation’s systems, access, and a human reviewer. This is not a ready-made installation list.",
    casesNote: "This page does not claim that LINE, PMS, CRM, email, or other systems are already connected. Tool capability depends on the provider, API, access, licence, security review, and the agreed scope. AI does not send guest-facing replies autonomously for sensitive topics.",
    pilotTitle: "A small, controlled experiment",
    pilotLead: "Start with one bounded task, record a baseline, test on a real workflow with approved data, then review quality, exceptions, and human effort before choosing Scale, Adjust, or Stop. All three outcomes are legitimate. Scale is not assumed.",
    pilotCharterTitle: "Pilot Charter — Sample",
    pilotCharterLead: "The fields below are a sample form, not a live project result. Criteria that are not set must be agreed before the trial.",
    pilotCharterCaption: "Sample Pilot Charter. No measured result, and Scale, Adjust, or Stop has not been chosen.",
    pilotDecisionTitle: "After the trial, all three outcomes are valid",
    pilotDecisionLead: "Scale, Adjust, and Stop carry equal weight. Choose from what actually happened, not from a vendor claim.",
    pilotClose: "This page does not present a time or revenue result from a pilot. If an approved project is published later, it will include a source that can be checked.",
    studyTitle: "Start with work that should be made easier, before asking what AI can do",
    studyPrinciples: ["Start with work that has a clear scope", "Try it on a real workflow", "Scale when the result and the risk are acceptable"],
    studyTakeawayLead: "Good automation should not start from “what can we build?”",
    studyTakeawayClose: "It should start from “which work should become easier?”",
    studyBody: "This principle is about the team’s real work. It is not a measured hotel result presented as a fact of this service.",
    evidenceSourceLabel: "Source",
    evidenceContextLabel: "Context",
    evidenceMeasureLabel: "Measure",
    evidenceNoteLabel: "Note",
    evidenceSource: "There is no approved The KPI Plus case study with publishable figures. An external paper previously cited is withheld until the metric definition and the figures can be reconciled.",
    evidenceContext: "The principle on this page is to start from stuck work that should be made easier, not from a result of one hotel.",
    evidenceMeasure: "No time or savings figure is shown until the source, metric definition, period, limitations, and permission to name a place are complete.",
    evidenceNote: "Results from a specific case are not a guarantee for every hotel.",
    measureTitle: "Pilot Scorecard — measure the work that changed, not a guaranteed outcome",
    measureLead: "Baseline and pilot must use the same definitions, the same unit, and a comparable workload. There are no approved figures yet, so result cells stay empty and the table states what should be measured.",
    measureCaption: "Sample Pilot Scorecard. No approved time, revenue, or savings figure.",
    measureUpdatedLabel: "Last updated",
    measureOwnerLabel: "Scorecard owner",
    measureUpdatedValue: "Not set",
    measureOwnerValue: "Not set",
    measureEmpty: "No data",
    measureStatusEmpty: "No approved data",
    measureEmptyNote: "Agree the definition, period, source, and review owner before a trial, then record baseline and pilot from the same real work.",
    measureReviewNote: "Human Review counts items that need correction or approval. Necessary human review is not automatically a bad result.",
    measureLegendPositive: "Positive when real data exists",
    measureLegendCompare: "Baseline / comparison",
    measureLegendReview: "Needs human review",
    measureClose: "After the trial we also look at whether the team uses it, and whether guests still get care at the points that need a person. This page does not invent percentages, hours saved, revenue, cost savings, or productivity gains.",
    ownershipTitle: "Use data with a named owner",
    ownershipLead: "Data used with AI or automation needs an owner, a reviewer, and an approved scope. This is a sample flow. It does not claim the work is 100% secure or legally certified.",
    ownershipFlowTitle: "Data and Human Review Flow",
    ownershipPrinciplesTitle: "Governance principles",
    ownershipMatrixTitle: "Access matrix — Sample",
    ownershipCaption: "Sample matrix of data category, owner, allowed role or tool, review, and retention. Values that are not set must be agreed with the hotel.",
    ownershipReviewLead: "Examples of consequential outputs that still need a person to review before use.",
    ownershipClose: "The public form does not ask for guest data, payment data, passwords, booking IDs, or confidential files. This page does not claim 100% security or legal compliance.",
    reviewTitle: "Where a person must review",
    fitTitle: "Which work may fit — not a claim that AI suits every team",
    fitLead: "Use this as a fit check for the work. It is not a claim that every hotel or every department should use AI. Each row has an example, a start condition, and a review guardrail.",
    fitNote: "Other service organisations use the same fit test for that team’s work. That does not mean AI fits every workflow.",
    fitNotReadyTitle: "Not ready to automate yet",
    fitNotReadyLead: "If the steps are still unstable, there is no owner, the data is unreliable, the safety, legal, or financial impact is high without controls, or there is no manual fallback, fix that work first. Do not add AI yet.",
    fitCaption: "Sample hotel-work fit matrix. Not a guaranteed result, and not a claim that systems are already connected.",
    closerTitle: "Start with one task the team wants to fix",
    closerBody: "Tell us which work takes time, who does it, which systems you use, and what should get better. Do not send a password or guest data.",
    closerCta: "Talk about putting AI into real work",
    relatedTitle: "Read and try next",
    relatedLead: "Related articles, a tool, and Academy courses. These are not case studies, and they are not a hotel result.",
    faqLead:
      "Answers depend on the systems in place, permissions, data, agreed scope, and human review. They do not promise that AI replaces all staff, is always accurate, or produces a guaranteed business result.",
    sample: "Sample",
  },
} as const;
