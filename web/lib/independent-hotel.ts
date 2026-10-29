import type { FaqItem } from "@/lib/faqs";
import { existingHref, type Locale } from "@/lib/seo";

export type IndependentVisualStatus = "replace" | "sample" | "approved" | "placeholder" | "real";
export type IndependentKpiStatus = "draft" | "sample" | "approved" | "anonymised" | "not-configured";
export type IndependentSourceStatus = "guidance" | "sample" | "approved";

export function independentSampleLabel(locale: Locale) {
  return locale === "th" ? "ตัวอย่างข้อมูล" : "Sample Workflow";
}

export function independentShowsSampleBadge(status?: string) {
  return status !== "approved" && status !== "real";
}

export function independentIsLibraryPlaceholder(src?: string) {
  return Boolean(src?.trim() && /\/images\/independent-hotel-[\w-]*placeholder\.webp$/i.test(src.trim()));
}

export function independentRenderableSrc(src?: string, status?: string) {
  const next = src?.trim() || "";
  if (!next) return "";
  if (independentIsLibraryPlaceholder(next) && independentShowsSampleBadge(status)) return "";
  return next;
}

const VISUAL_META = {
  th: "แผนภาพตัวอย่าง · แทนที่ด้วยงานโรงแรมที่อนุมัติ",
  en: "Sample diagram · Replace with approved hotel project",
};

export const INDEPENDENT_HERO_JOURNEY = [
  { id: "direction", th: "ทิศทางเจ้าของ", en: "Owner direction" },
  { id: "assessment", th: "ประเมินโรงแรม", en: "Hotel assessment" },
  { id: "model", th: "โมเดลดำเนินงาน", en: "Operating model" },
  { id: "rhythm", th: "จังหวะ 30/60/90", en: "30/60/90 rhythm" },
] as const;

export const INDEPENDENT_HERO_CAPABILITIES = [
  { th: "Independent Hotel", en: "Independent Hotel" },
  { th: "Operating Structure", en: "Operating Structure" },
  { th: "Commercial Direction", en: "Commercial Direction" },
  { th: "Team Alignment", en: "Team Alignment" },
] as const;

export const INDEPENDENT_HERO_VISUAL_CANDIDATE = "/images/independent-hotel-management-hero-placeholder.webp";
export const INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE = "/images/independent-hotel-management-assessment-placeholder.webp";
export const INDEPENDENT_ASSESSMENT_VISUAL_LEGACY = "/images/independent-hotel-assessment-placeholder.webp";
export const INDEPENDENT_SERVICES_VISUAL_CANDIDATE = "/images/independent-hotel-operating-model-placeholder.webp";
export const INDEPENDENT_SERVICES_VISUAL_LEGACY = "/images/independent-hotel-services-placeholder.webp";
export const INDEPENDENT_MODEL_VISUAL_CANDIDATE = "/images/independent-hotel-operating-model-placeholder.webp";
export const INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE = "/images/independent-hotel-management-deliverables-placeholder.webp";
export const INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE = "/images/independent-hotel-management-workflow-placeholder.webp";
export const INDEPENDENT_WORKFLOW_VISUAL_LEGACY = "/images/independent-hotel-workflow-placeholder.webp";
export const INDEPENDENT_FIT_VISUAL_CANDIDATE = "/images/independent-hotel-management-fit-matrix-placeholder.webp";
export const INDEPENDENT_FIT_VISUAL_LEGACY = "/images/independent-hotel-fit-matrix-placeholder.webp";
export const INDEPENDENT_SCOPE_VISUAL_CANDIDATE = "/images/independent-hotel-scope-placeholder.webp";
export const INDEPENDENT_PLAN_VISUAL_CANDIDATE = "/images/independent-hotel-30-60-90-day-plan-placeholder.webp";
export const INDEPENDENT_PLAN_VISUAL_LEGACY = "/images/independent-hotel-plan-placeholder.webp";
export const INDEPENDENT_RELATED_VISUAL_CANDIDATE = "/images/independent-hotel-related-placeholder.webp";
export const INDEPENDENT_ENQUIRY_VISUAL_CANDIDATE = "/images/independent-hotel-contact-process-placeholder.webp";
export const INDEPENDENT_ENQUIRY_VISUAL_LEGACY = "/images/independent-hotel-contact-placeholder.webp";

function visual(id: string, labelEn: string, altTh: string, altEn: string, width: number, height: number) {
  return {
    status: "sample" as IndependentVisualStatus,
    labelTh: `${labelEn} — ตัวอย่างข้อมูล`,
    labelEn: `${labelEn} — Sample Workflow`,
    captionTh: "แผนภาพตัวอย่าง ไม่ใช่โรงแรมลูกค้าจริง และไม่ใช่ผลดำเนินงานที่การันตี",
    captionEn: "Sample diagram. Not a live client hotel, and not a guaranteed operating result.",
    altTh,
    altEn,
    metaTh: VISUAL_META.th,
    metaEn: VISUAL_META.en,
    displayWidth: width,
    displayHeight: height,
    src: `/images/independent-hotel-${id}-placeholder.webp`,
  };
}

export const INDEPENDENT_HERO_VISUAL = {
  ...visual(
    "management-hero",
    "Owner/GM and Hotel Team Review",
    "แผนภาพตัวอย่างการทบทวนกับเจ้าของ GM และทีมโรงแรม ในบริบทดำเนินงานจริง ไม่ใช่รูปประชุมทั่วไป และไม่ใช่โรงแรมลูกค้าจริง",
    "Sample Owner/GM and Hotel Team Review in a hotel operating context — not a generic meeting photo and not a live client hotel",
    560,
    350,
  ),
  labelTh: "ตัวอย่างการทบทวนกับเจ้าของ GM และทีมโรงแรม",
  labelEn: "Sample Owner/GM and Hotel Team Review",
  captionTh: "ช่วยเจ้าของโรงแรมเปลี่ยนปัญหาการบริหารให้เป็นแผนงาน ผู้รับผิดชอบ และจังหวะการติดตามผลที่ทำได้จริง",
  captionEn: "May help an independent hotel owner turn management issues into a workable plan, named owners, and a follow-up rhythm.",
  metaTh: "Sample Owner/GM and Hotel Team Review · Replace with approved hotel project",
  metaEn: "Sample Owner/GM and Hotel Team Review · Replace with approved hotel project",
};

export const INDEPENDENT_HERO_REVIEW = [
  {
    id: "owner",
    num: "01",
    titleTh: "ทบทวนกับเจ้าของ / GM",
    titleEn: "Owner / GM Review",
    bodyTh: "ทิศทาง เป้าหมาย และข้อจำกัดของโรงแรม",
    bodyEn: "Direction, goals, and hotel constraints",
  },
  {
    id: "team",
    num: "02",
    titleTh: "ทบทวนกับทีมโรงแรม",
    titleEn: "Hotel Team Review",
    bodyTh: "บทบาท จังหวะงาน และบริบทปฏิบัติการจริง",
    bodyEn: "Roles, work rhythm, and live operating context",
  },
] as const;

export const INDEPENDENT_ASSESSMENT_VISUAL = {
  ...visual(
    "management-assessment",
    "Independent Hotel Assessment",
    "กรอบประเมินโรงแรมอิสระตัวอย่าง แสดงการตรวจหน้างาน ทบทวนปฏิบัติการ และการประเมินการบริหาร ไม่ใช่ผลวินิจฉัยโรงแรมจริง",
    "Sample independent hotel assessment showing a property walkthrough, operations review, and management assessment. Not a live hotel diagnosis.",
    480,
    320,
  ),
  labelTh: "ตัวอย่าง Independent Hotel Assessment",
  labelEn: "Sample Independent Hotel Assessment",
  captionTh: "กรอบประเมินตัวอย่าง ใช้จัดประเด็นทิศทาง ปฏิบัติการ การค้า คน และการวัดผล ไม่ใช่ผลวินิจฉัยโรงแรมจริง และไม่ใช่ข้อค้นพบจากโครงการลูกค้า",
  captionEn: "Sample assessment framework for locating issues in direction, operations, commercial work, people, and measurement. Not a live hotel diagnosis, and not findings from a client project.",
  metaTh: "Sample assessment framework",
  metaEn: "Sample assessment framework",
};

export const INDEPENDENT_ASSESSMENT_PANELS = [
  {
    id: "walkthrough",
    num: "01",
    titleTh: "ตรวจหน้างาน",
    titleEn: "Property Walkthrough",
    bodyTh: "รายการตรวจพื้นที่ มาตรฐาน และจุดเสียดทานในโรงแรม",
    bodyEn: "On-site checklist of space, standards, and operating friction",
  },
  {
    id: "operations",
    num: "02",
    titleTh: "ทบทวนปฏิบัติการ",
    titleEn: "Operations Review",
    bodyTh: "ขั้นตอนงาน ผู้รับผิดชอบ และกระดานปฏิบัติการ",
    bodyEn: "Workflows, named owners, and the operations review board",
  },
  {
    id: "management",
    num: "03",
    titleTh: "ประเมินการบริหาร",
    titleEn: "Management Assessment",
    bodyTh: "ทิศทางเจ้าของ/GM ทีม และการตัดสินใจ",
    bodyEn: "Owner/GM direction, team, and decision rights",
  },
] as const;

export const INDEPENDENT_ASSESSMENT_EVIDENCE = [
  { id: "walkthrough", th: "รายการตรวจหน้างาน", en: "Property walkthrough checklist" },
  { id: "meeting", th: "ประชุมประเมินกับเจ้าของ/GM ในโรงแรม", en: "Owner/GM assessment meeting on site" },
  { id: "ops", th: "กระดานทบทวนปฏิบัติการ", en: "Operations review board" },
  { id: "commercial", th: "ทบทวนรายได้และการค้า", en: "Revenue and commercial review" },
  { id: "guest", th: "ตรวจประสบการณ์แขก", en: "Guest experience audit" },
  { id: "team", th: "ทบทวนศักยภาพทีมโรงแรม", en: "Hotel team capability review" },
] as const;

export const INDEPENDENT_SERVICES_VISUAL = {
  ...visual(
    "operating-model",
    "Independent Hotel Operating Model — Sample",
    "โมเดลดำเนินงานโรงแรมอิสระตัวอย่าง เชื่อมทิศทาง การค้า ปฏิบัติการ คน และจังหวะทบทวน ไม่ใช่รูปทีมทั่วไป และไม่ใช่ผลโรงแรมจริง",
    "Sample Independent Hotel Operating Model connecting Direction, Commercial, Operations, People, and Review Rhythm. Not a generic team photo and not a live hotel result.",
    720,
    405,
  ),
  labelTh: "Independent Hotel Operating Model — Sample",
  labelEn: "Independent Hotel Operating Model — Sample",
  captionTh: "โมเดลตัวอย่าง ใช้ดูว่างานเชื่อมกันอย่างไร ไม่ใช่ผลวินิจฉัยโรงแรมจริง และไม่การันตีรายได้",
  captionEn: "Sample model of how the work connects. Not a live hotel diagnosis, and not a guaranteed revenue result.",
  metaTh: "Sample operating model",
  metaEn: "Sample operating model",
};

export const INDEPENDENT_MODEL_VISUAL = visual(
  "operating-model",
  "Operating Model",
  "แผนภาพตัวอย่างโมเดลดำเนินงาน Diagnose Align Coordinate Review Adjust พร้อมขอบเขตที่โรงแรมยังรับผิดชอบ",
  "Sample operating model showing Diagnose, Align, Coordinate, Review, and Adjust, with hotel responsibility remaining visible.",
  720,
  405,
);

export const INDEPENDENT_DELIVERABLES_VISUAL = {
  ...visual(
    "management-deliverables",
    "Independent Hotel Management Deliverables — Sample",
    "ตารางตัวอย่างขอบเขตงานและผลลัพธ์ที่ส่งมอบของ Independent Hotel Management แสดงด้านงาน สิ่งที่ทบทวน เอกสารที่ส่งมอบ และจุดที่โรงแรมอนุมัติ ไม่ใช่รูปสต็อก และไม่ใช่ผลโรงแรมจริง",
    "Sample Independent Hotel Management deliverables table showing area, what is reviewed or supported, the named deliverable, and the hotel approval point. Not a stock photograph and not a live hotel result.",
    720,
    405,
  ),
  labelTh: "Independent Hotel Management Deliverables — Sample",
  labelEn: "Independent Hotel Management Deliverables — Sample",
  captionTh: "ตารางตัวอย่างผลลัพธ์ที่ส่งมอบ ไม่ใช่แพ็กเกจสำเร็จรูป และไม่ใช่ผลที่การันตี",
  captionEn: "Sample named deliverables. Not a fixed package, and not a guaranteed result.",
  metaTh: "Sample deliverables",
  metaEn: "Sample deliverables",
};

export const INDEPENDENT_WORKFLOW_VISUAL = {
  ...visual(
    "management-workflow",
    "Independent Hotel Management Workflow — Sample",
    "ไทม์ไลน์ตัวอย่าง Independent Hotel Management Workflow แสดง Assess Align Operate พร้อมจุดส่งมอบ ผลลัพธ์ และจุดที่โรงแรมอนุมัติ ไม่ใช่รูปประชุมทั่วไป",
    "Sample Independent Hotel Management Workflow timeline showing Assess, Align, and Operate, with handoffs, deliverables, and hotel approval points. Not a generic meeting photograph.",
    640,
    360,
  ),
  labelTh: "Independent Hotel Management Workflow — Sample",
  labelEn: "Independent Hotel Management Workflow — Sample",
  captionTh: "ไทม์ไลน์ตัวอย่าง Assess → Align → Operate ไม่ใช่แผนโรงแรมจริง และไม่ใช่ผลที่การันตี",
  captionEn: "Sample Assess → Align → Operate timeline. Not a live hotel plan, and not a guaranteed result.",
  metaTh: "Sample workflow",
  metaEn: "Sample workflow",
};

export const INDEPENDENT_FIT_VISUAL = {
  ...visual(
    "management-fit-matrix",
    "Is Independent Hotel Management Right for You? — Sample",
    "ตารางตัวอย่างสถานการณ์ที่ Independent Hotel Management อาจเหมาะ แสดงอาการ คำถามแรก งานที่อาจช่วย และผลลัพธ์ ไม่ใช่ผลการวินิจฉัยโรงแรมก่อนประเมิน",
    "Sample decision matrix of situations where Independent Hotel Management may be suitable, with symptoms, a first question, possible support, and an expected output. Not a diagnosis before the hotel is assessed.",
    720,
    405,
  ),
  labelTh: "Is Independent Hotel Management Right for You? — Sample",
  labelEn: "Is Independent Hotel Management Right for You? — Sample",
  captionTh: "ตารางตัวอย่างสถานการณ์ที่มักคุยกัน ไม่ใช่ผลการวินิจฉัยโรงแรมก่อนประเมิน",
  captionEn: "Sample situations often discussed. Not a diagnosis before the hotel is assessed.",
  metaTh: "Sample decision matrix",
  metaEn: "Sample decision matrix",
};

export const INDEPENDENT_SCOPE_VISUAL = visual(
  "scope",
  "Scope and Responsibility",
  "ตารางตัวอย่างขอบเขตงาน สิ่งที่อาจช่วยได้ สิ่งที่โรงแรมอนุมัติ และสิ่งที่ยังเป็นความรับผิดชอบของโรงแรม",
  "Sample scope table of support that may be offered, items the hotel approves, and responsibilities that stay with the hotel.",
  720,
  405,
);

export const INDEPENDENT_PLAN_VISUAL = {
  ...visual(
    "30-60-90-day-plan",
    "30/60/90-Day Hotel Management Plan — Sample",
    "แผนตัวอย่าง 30/60/90 วัน สำหรับจัดลำดับงานบริหารโรงแรมอิสระ พร้อมจังหวะรายสัปดาห์ รายเดือน และรายไตรมาส ไม่ใช่คำสัญญาผล และไม่ใช่แผนโรงแรมจริง",
    "Sample 30/60/90-day hotel management plan for sequencing work, with weekly, monthly, and quarterly cadence. Not a promised result, and not a live hotel plan.",
    720,
    405,
  ),
  labelTh: "30/60/90-Day Hotel Management Plan — Sample",
  labelEn: "30/60/90-Day Hotel Management Plan — Sample",
  captionTh: "แผนตัวอย่างสำหรับจัดลำดับงาน ไม่ได้หมายความว่าโรงแรมทุกแห่งจะได้ผลภายในระยะเวลาเหล่านี้",
  captionEn: "A sample plan for sequencing the work. It does not mean every hotel will achieve a specific result within these periods.",
  metaTh: "Sample plan",
  metaEn: "Sample plan",
};

export const INDEPENDENT_RELATED_VISUAL = visual(
  "related",
  "Related Hotel Work",
  "แผนที่เนื้อหาตัวอย่างงานที่เกี่ยวข้องกับการบริหารโรงแรมอิสระ ไม่ใช่ผลโรงแรม",
  "Sample related-content map for independent hotel management. Not a hotel result.",
  520,
  347,
);

export const INDEPENDENT_ENQUIRY_VISUAL = {
  ...visual(
    "contact-process",
    "What Happens Next — Sample process",
    "แผนภาพตัวอย่าง What Happens Next: Context → Assessment → Scope → Operating Plan ไม่ใช่รูปบุคคล และไม่ใช่โรงแรมลูกค้าจริง",
    "Sample What Happens Next process: Context → Assessment → Scope → Operating Plan. Not a person photo, and not a live client hotel.",
    420,
    210,
  ),
  labelTh: "ขั้นตอนถัดไป — ตัวอย่างกระบวนการ",
  labelEn: "What Happens Next — Sample process",
  captionTh: "ลำดับตัวอย่างหลังเริ่มคุย ไม่ใช่ไทม์ไลน์ลูกค้าจริง และไม่ใช่ผลที่การันตี",
  captionEn: "A sample sequence after the conversation starts. Not a live client timeline, and not a guaranteed result.",
  metaTh: "Sample process",
  metaEn: "Sample process",
};

export const INDEPENDENT_ENQUIRY_FLOW = [
  { id: "context", th: "บริบทโรงแรม", en: "Context" },
  { id: "assessment", th: "ประเมิน", en: "Assessment" },
  { id: "scope", th: "ขอบเขตงาน", en: "Scope" },
  { id: "plan", th: "แผนดำเนินงาน", en: "Operating Plan" },
] as const;

export const INDEPENDENT_HOTEL_STATUS = [
  { id: "operating", th: "เปิดให้บริการแล้ว", en: "Operating" },
  { id: "opening", th: "กำลังเปิด", en: "Opening" },
  { id: "repositioning", th: "กำลังปรับตำแหน่ง", en: "Repositioning" },
  { id: "changing_systems", th: "กำลังเปลี่ยนระบบ", en: "Changing systems" },
] as const;

export const INDEPENDENT_HOTEL_CHALLENGES = [
  { id: "direction", th: "ทิศทาง", en: "Direction" },
  { id: "operations", th: "ปฏิบัติการ", en: "Operations" },
  { id: "revenue", th: "รายได้", en: "Revenue" },
  { id: "marketing", th: "การตลาด", en: "Marketing" },
  { id: "people", th: "คน", en: "People" },
  { id: "guest_experience", th: "ประสบการณ์แขก", en: "Guest Experience" },
] as const;

export const INDEPENDENT_ASSESSMENT_ROWS = [
  {
    id: "direction",
    num: "01",
    titleTh: "ทิศทาง",
    titleEn: "Direction",
    lookTh: "เป้าหมาย ตลาด และลำดับความสำคัญของโรงแรมชัดหรือยัง?",
    lookEn: "Are the hotel's goals, market, and priorities clear?",
    output: "Management Direction Brief",
  },
  {
    id: "operations",
    num: "02",
    titleTh: "การดำเนินงาน",
    titleEn: "Operations",
    lookTh: "ขั้นตอนงาน มาตรฐาน และผู้รับผิดชอบชัดหรือยัง?",
    lookEn: "Are workflows, standards, and owners clear?",
    output: "Operating Checklist",
  },
  {
    id: "commercial",
    num: "03",
    titleTh: "การค้า",
    titleEn: "Commercial",
    lookTh: "ราคา ช่องทาง การตลาด และการตัดสินใจเรื่องรายได้เชื่อมกันหรือยัง?",
    lookEn: "Are pricing, channels, marketing, and revenue decisions connected?",
    output: "Commercial Action Plan",
  },
  {
    id: "people",
    num: "04",
    titleTh: "คน",
    titleEn: "People",
    lookTh: "ทีมรู้บทบาทและจังหวะประชุมของตนเองหรือยัง?",
    lookEn: "Do team members know their roles and meeting rhythm?",
    output: "Team Rhythm Plan",
  },
  {
    id: "measurement",
    num: "05",
    titleTh: "การวัดผล",
    titleEn: "Measurement",
    lookTh: "โรงแรมเห็นสิ่งที่กำลังดีขึ้นหรือแย่ลงได้หรือยัง?",
    lookEn: "Can the hotel see what is improving or getting worse?",
    output: "KPI Review Plan",
  },
] as const;

export const INDEPENDENT_OPERATING_FLOW = [
  { id: "direction", th: "ทิศทาง", en: "Direction" },
  { id: "commercial", th: "การค้า", en: "Commercial" },
  { id: "operations", th: "ปฏิบัติการ", en: "Operations" },
  { id: "people", th: "คน", en: "People" },
  { id: "review", th: "จังหวะทบทวน", en: "Review Rhythm" },
] as const;

export const INDEPENDENT_SERVICE_FIELDS = {
  input: { th: "ข้อมูลเข้า", en: "Input" },
  action: { th: "การกระทำ", en: "Action" },
  output: { th: "ผลลัพธ์", en: "Output" },
  approval: { th: "จุดที่โรงแรมอนุมัติ", en: "Hotel approval point" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner or responsible department" },
} as const;

export const INDEPENDENT_WORKSTREAMS = [
  {
    id: "direction-commercial",
    num: "01",
    titleTh: "ทิศทางและการค้า",
    titleEn: "Direction & Commercial",
    bulletsTh: ["ทิศทางการบริหาร", "ลำดับความสำคัญด้านรายได้และการค้า", "ประสานราคา ช่องทาง และการตลาด"],
    bulletsEn: ["Management direction", "Revenue and commercial priorities", "Rate, channel, and marketing coordination"],
  },
  {
    id: "operations-guest",
    num: "02",
    titleTh: "ปฏิบัติการและประสบการณ์แขก",
    titleEn: "Operations & Guest Experience",
    bulletsTh: ["ขั้นตอนการดำเนินงาน", "SOP และมาตรฐานบริการ", "เส้นทางแขกและคุณภาพบริการ"],
    bulletsEn: ["Operating workflow", "SOP and service standards", "Guest journey and service quality"],
  },
  {
    id: "people-governance",
    num: "03",
    titleTh: "คนและธรรมาภิบาล",
    titleEn: "People & Governance",
    bulletsTh: ["บทบาทและความรับผิดชอบ", "จังหวะประชุม", "ทบทวน KPI", "สิทธิ์ตัดสินใจและบันทึกการกระทำ"],
    bulletsEn: ["Roles and responsibilities", "Meeting rhythm", "KPI review", "Decision rights and action log"],
  },
] as const;

export const INDEPENDENT_SERVICES = [
  {
    id: "direction",
    stream: "direction-commercial",
    titleTh: "ทิศทางการบริหาร",
    titleEn: "Management direction",
    inputTh: "เป้าหมายเจ้าของ ตลาด และลำดับความสำคัญที่มีอยู่",
    inputEn: "Owner goals, market, and current priorities",
    actionTh: "จัดทิศทางและลำดับงานให้คุยและตัดสินใจได้",
    actionEn: "Clarify direction and the order of work so decisions can be made",
    output: "Management Direction Brief",
    approvalTh: "เจ้าของอนุมัติทิศทางก่อนนำไปใช้กับทีม",
    approvalEn: "The owner approves the direction before it is used with the team",
    ownerTh: "เจ้าของ / GM",
    ownerEn: "Owner / GM",
  },
  {
    id: "commercial",
    stream: "direction-commercial",
    titleTh: "รายได้และการค้า",
    titleEn: "Revenue and commercial priorities",
    inputTh: "ราคา ช่องทาง การตลาด และคำถามเรื่องรายได้ที่มีอยู่",
    inputEn: "Current rates, channels, marketing, and revenue questions",
    actionTh: "เชื่อมการตัดสินใจเรื่องราคา ช่องทาง และการตลาด",
    actionEn: "Connect rate, channel, and marketing decisions",
    output: "Commercial Action Plan",
    approvalTh: "โรงแรมอนุมัตินโยบายราคาและช่องทาง ไม่สัญญายอดขายหรือ ADR",
    approvalEn: "The hotel approves rate and channel policy. No promised sales volume or ADR.",
    ownerTh: "รายได้ / ขาย / การตลาด",
    ownerEn: "Revenue / Sales / Marketing",
  },
  {
    id: "operations",
    stream: "operations-guest",
    titleTh: "ระบบการดำเนินงาน",
    titleEn: "Operating workflow",
    inputTh: "ขั้นตอนงาน มาตรฐาน และผู้รับผิดชอบปัจจุบัน",
    inputEn: "Current workflows, standards, and named owners",
    actionTh: "จัดขั้นตอนและมาตรฐานให้ทีมเดินงานต่อได้",
    actionEn: "Set the workflow and standards so the team can keep work moving",
    output: "SOP / Operating Checklist",
    approvalTh: "GM หรือหัวหน้าแผนกอนุมัติ SOP ที่จะใช้",
    approvalEn: "The GM or department head approves the SOP to be used",
    ownerTh: "ปฏิบัติการ / ต้อนรับ / แม่บ้าน",
    ownerEn: "Operations / Front office / Housekeeping",
  },
  {
    id: "guest",
    stream: "operations-guest",
    titleTh: "ประสบการณ์แขก",
    titleEn: "Guest journey and service quality",
    inputTh: "เส้นทางแขก จุดที่สะดุด และเสียงจากแขกที่มี",
    inputEn: "Guest journey, friction points, and available guest feedback",
    actionTh: "ทบทวนเส้นทางบริการและคุณภาพที่แขกเจอ",
    actionEn: "Review the service journey and the quality guests actually meet",
    output: "Guest Experience Review",
    approvalTh: "GM อนุมัติการปรับมาตรฐานบริการ ความปลอดภัยของแขกยังเป็นของโรงแรม",
    approvalEn: "The GM approves service-standard changes. Guest safety stays with the hotel.",
    ownerTh: "บริการแขก / ต้อนรับ",
    ownerEn: "Guest services / Front office",
  },
  {
    id: "people",
    stream: "people-governance",
    titleTh: "บทบาทและจังหวะประชุม",
    titleEn: "Roles and meeting rhythm",
    inputTh: "โครงสร้างทีม บทบาท และประชุมที่มีอยู่",
    inputEn: "Current team structure, roles, and meetings",
    actionTh: "จัดบทบาทและจังหวะประชุมให้ชัด",
    actionEn: "Clarify roles and the meeting rhythm",
    output: "Role and Meeting Rhythm",
    approvalTh: "เจ้าของหรือ GM อนุมัติผังบทบาทและจังหวะประชุม การจ้างงานยังเป็นของโรงแรม",
    approvalEn: "The owner or GM approves the role map and meetings. Hiring stays with the hotel.",
    ownerTh: "GM / บุคคล / หัวหน้าแผนก",
    ownerEn: "GM / People / Department heads",
  },
  {
    id: "measurement",
    stream: "people-governance",
    titleTh: "ทบทวน KPI และบันทึกการกระทำ",
    titleEn: "KPI review and action log",
    inputTh: "KPI ที่มีช่วงเวลา คำจำกัดความ และแหล่งที่ตรวจได้",
    inputEn: "KPIs that have a period, a definition, and a verifiable source",
    actionTh: "วางจังหวะทบทวน สิทธิ์ตัดสินใจ และบันทึกการกระทำ",
    actionEn: "Set the review rhythm, decision rights, and action log",
    output: "KPI Review and Action Log",
    approvalTh: "เจ้าของอนุมัติว่าจะทบทวนตัวชี้วัดใด ไม่ใช่ผลที่การันตี",
    approvalEn: "The owner approves which measures are reviewed. Not a guaranteed result.",
    ownerTh: "เจ้าของ / GM / การเงิน",
    ownerEn: "Owner / GM / Finance",
  },
] as const;

export const INDEPENDENT_MODEL_STEPS = [
  { id: "diagnose", num: "01", label: "Diagnose", titleTh: "ดูของที่มีอยู่จริง", titleEn: "See what is already there", output: "Assessment note" },
  { id: "align", num: "02", label: "Align", titleTh: "จัดทิศทางกับเจ้าของ", titleEn: "Align with the owner", output: "Agreed direction" },
  { id: "coordinate", num: "03", label: "Coordinate", titleTh: "ประสานงานตามขอบเขต", titleEn: "Coordinate within scope", output: "Workstream board" },
  { id: "review", num: "04", label: "Review", titleTh: "ทบทวน KPI และปัญหา", titleEn: "Review KPIs and issues", output: "Review pack" },
  { id: "adjust", num: "05", label: "Adjust", titleTh: "ปรับแผนตามที่อนุมัติ", titleEn: "Adjust what is approved", output: "Change log" },
] as const;

export const INDEPENDENT_MODEL_BOUNDARY = {
  supportTitle: { th: "เดอะ เคพีไอ พลัส อาจช่วย", en: "The KPI Plus may support" },
  support: {
    th: "วางทิศทาง ประสานงานการค้าและปฏิบัติการ จัดลำดับคนและจังหวะบริการ ทบทวน KPI และจังหวะคุยกับเจ้าของ ตามขอบเขตที่ตกลง",
    en: "Direction, commercial and operations coordination, people and guest-experience rhythm, KPI review, and owner cadence, within the agreed scope.",
  },
  hotelTitle: { th: "โรงแรมยังคงรับผิดชอบ", en: "The hotel remains responsible for" },
  hotel: {
    th: "การตัดสินใจของเจ้าของ การจ้างงาน ผู้จัดการทั่วไป ความปลอดภัยของแขก ใบอนุญาต งานที่กฎหมายกำหนด และข้อมูลลับของโรงแรม",
    en: "Owner decisions, hiring, the general manager, guest safety, licences, regulated work, and confidential hotel data.",
  },
} as const;

export const INDEPENDENT_DELIVERABLES_COLUMNS = {
  area: { th: "ด้านงาน", en: "Area" },
  support: { th: "สิ่งที่ทบทวนหรือสนับสนุน", en: "What we review or support" },
  deliverable: { th: "ผลลัพธ์ที่ส่งมอบ", en: "Deliverable" },
  approval: { th: "จุดที่โรงแรมอนุมัติ", en: "Hotel approval point" },
} as const;

export const INDEPENDENT_DELIVERABLES = [
  {
    id: "direction",
    areaTh: "ทิศทางการบริหาร",
    areaEn: "Management Direction",
    supportTh: "ทบทวนเป้าหมาย ตลาด การวางตำแหน่ง และลำดับความสำคัญ",
    supportEn: "Review goals, market, positioning, and priorities.",
    deliverable: "Management Direction Brief",
    approvalTh: "เจ้าของอนุมัติเป้าหมาย การวางตำแหน่ง และลำดับความสำคัญ",
    approvalEn: "The owner approves goals, positioning, and priorities.",
  },
  {
    id: "commercial",
    areaTh: "การค้า",
    areaEn: "Commercial",
    supportTh: "ทบทวนรายได้ ราคา ช่องทาง โปรโมชั่น และการประสานงานการตลาด",
    supportEn: "Review revenue, rate, channel, promotion, and marketing coordination.",
    deliverable: "Commercial Action Plan",
    approvalTh: "โรงแรมอนุมัติราคา ช่องทาง และโปรโมชั่น",
    approvalEn: "The hotel approves rates, channels, and promotions.",
  },
  {
    id: "operations",
    areaTh: "ปฏิบัติการ",
    areaEn: "Operations",
    supportTh: "ทบทวนขั้นตอนงาน SOP มาตรฐานบริการ และผู้รับผิดชอบ",
    supportEn: "Review workflows, SOP, service standards, and ownership.",
    deliverable: "Operating Checklist",
    approvalTh: "โรงแรมอนุมัติมาตรฐานบริการและผู้รับผิดชอบ",
    approvalEn: "The hotel approves service standards and named owners.",
  },
  {
    id: "people",
    areaTh: "คน",
    areaEn: "People",
    supportTh: "ทบทวนบทบาท จังหวะประชุม เส้นทางยกระดับปัญหา และสิทธิ์ตัดสินใจ",
    supportEn: "Review roles, meeting rhythm, escalation, and decision rights.",
    deliverable: "Team Rhythm Plan",
    approvalTh: "โรงแรมอนุมัติบทบาท สิทธิ์ตัดสินใจ และจังหวะประชุม",
    approvalEn: "The hotel approves roles, decision rights, and meeting rhythm.",
  },
  {
    id: "measurement",
    areaTh: "การวัดผล",
    areaEn: "Measurement",
    supportTh: "ทบทวน KPI การรายงาน และการติดตามการกระทำ",
    supportEn: "Review KPI, reporting, and action tracking.",
    deliverable: "KPI Review and Action Log",
    approvalTh: "โรงแรมอนุมัติ KPI ที่ใช้ทบทวนและผู้รับผิดชอบการกระทำ",
    approvalEn: "The hotel approves which KPIs are reviewed and who owns the actions.",
  },
] as const;

export const INDEPENDENT_DELIVERABLES_BOUNDARY = {
  supportTitle: { th: "เดอะ เคพีไอ พลัส อาจช่วย", en: "The KPI Plus may support" },
  supportItems: [
    { th: "โครงสร้าง", en: "Structure" },
    { th: "การวางแผน", en: "Planning" },
    { th: "การประสานงาน", en: "Coordination" },
    { th: "การทบทวน", en: "Review" },
    { th: "การติดตามการกระทำ", en: "Action tracking" },
  ],
  hotelTitle: { th: "โรงแรมยังรับผิดชอบ", en: "The hotel remains responsible" },
  hotelItems: [
    { th: "การตัดสินใจระดับเจ้าของ", en: "Owner-level decisions" },
    { th: "การปฏิบัติตามกฎหมายและกฎระเบียบ", en: "Legal and regulatory compliance" },
    { th: "ความปลอดภัยของแขก", en: "Guest safety" },
    { th: "การตัดสินใจเรื่องคน", en: "Staffing decisions" },
    { th: "การอนุมัติงบประมาณ", en: "Budget approval" },
    { th: "มาตรฐานบริการขั้นสุดท้าย", en: "Final service standards" },
  ],
} as const;

export const INDEPENDENT_WORKFLOW_FIELDS = {
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  input: { th: "ข้อมูลเข้า", en: "Input" },
  action: { th: "การกระทำ", en: "Action" },
  output: { th: "ผลลัพธ์", en: "Output" },
  approval: { th: "จุดที่โรงแรมอนุมัติ", en: "Approval point" },
  next: { th: "การตัดสินใจถัดไป", en: "Next decision" },
} as const;

export const INDEPENDENT_WORKFLOW_APPROVALS = [
  { id: "goals", th: "เป้าหมาย", en: "Goals" },
  { id: "scope", th: "ขอบเขตงาน", en: "Scope" },
  { id: "budget", th: "งบประมาณ", en: "Budget" },
  { id: "brand", th: "แบรนด์และมาตรฐานบริการ", en: "Brand and service standards" },
  { id: "pricing", th: "ราคาและโปรโมชั่น", en: "Pricing and promotion" },
  { id: "staffing", th: "การเปลี่ยนคนหรือนโยบาย", en: "Staffing or policy changes" },
] as const;

export const INDEPENDENT_WORKFLOW = [
  {
    id: "assess",
    num: "01",
    label: "Assess",
    titleTh: "ทำความเข้าใจโรงแรม",
    titleEn: "Understand the hotel",
    bodyTh: "ทำความเข้าใจโรงแรม ปัญหาปัจจุบัน เป้าหมาย ทีม ระบบงาน และข้อจำกัด",
    bodyEn: "Understand the hotel, current problems, goals, team, systems, and constraints.",
    ownerTh: "ที่ปรึกษา + เจ้าของ",
    ownerEn: "Advisor + owner",
    inputTh: "โรงแรมปัจจุบัน ปัญหา เป้าหมาย ทีม ระบบงาน และข้อจำกัด",
    inputEn: "The hotel as it is: problems, goals, team, systems, and constraints",
    actionTh: "ประเมินโรงแรมตามที่เป็นอยู่ ไม่วินิจฉัยเป็นผลลูกค้าจริง",
    actionEn: "Assess the hotel as it is. This is not a live client diagnosis.",
    output: "Independent Hotel Assessment",
    approvalTh: "เจ้าของยืนยันเป้าหมายและข้อมูลที่ใช้ประเมิน",
    approvalEn: "The owner confirms the goals and the facts used in the assessment",
    nextTh: "ตัดสินใจว่าจะกำหนดขอบเขต Roles และแผน 30/60/90 หรือไม่",
    nextEn: "Decide whether to define scope, roles, and a 30/60/90-day plan",
  },
  {
    id: "align",
    num: "02",
    label: "Align",
    titleTh: "จัดขอบเขตและจังหวะงาน",
    titleEn: "Define scope and rhythm",
    bodyTh: "กำหนดขอบเขต บทบาท สิทธิ์ตัดสินใจ จุดอนุมัติ และจังหวะงาน",
    bodyEn: "Define scope, roles, decision rights, approval points, and work rhythm.",
    ownerTh: "เจ้าของเป็นผู้อนุมัติ",
    ownerEn: "Owner approves",
    inputTh: "Independent Hotel Assessment และข้อจำกัดของโรงแรม",
    inputEn: "Independent Hotel Assessment and hotel constraints",
    actionTh: "ตกลงขอบเขต บทบาท สิทธิ์ตัดสินใจ จุดอนุมัติ และจังหวะ 30/60/90",
    actionEn: "Agree scope, roles, decision rights, approval points, and a 30/60/90 rhythm",
    output: "Scope, Roles, and 30/60/90-Day Plan",
    approvalTh: "เจ้าของอนุมัติขอบเขต งบประมาณ และจุดที่โรงแรมต้องอนุมัติก่อนเริ่มงาน",
    approvalEn: "The owner approves scope, budget, and the hotel approval points before work starts",
    nextTh: "ตัดสินใจว่าจะเริ่มงาน Operate ตามแผนที่อนุมัติหรือไม่",
    nextEn: "Decide whether to start Operate work on the approved plan",
  },
  {
    id: "operate",
    num: "03",
    label: "Operate",
    titleTh: "เริ่มงานและติดตามผล",
    titleEn: "Start work and follow the result",
    bodyTh: "เริ่มงานลำดับต้น ทบทวน KPI เก็บบันทึกการกระทำ และปรับตามจังหวะที่ตกลง",
    bodyEn: "Start priority actions, review KPIs, maintain an action log, and adjust by agreed cadence.",
    ownerTh: "ผู้รับผิดชอบตามแผนก + ที่ปรึกษาสนับสนุน",
    ownerEn: "Named department owners + advisor support",
    inputTh: "ขอบเขต Roles และแผน 30/60/90 ที่อนุมัติแล้ว",
    inputEn: "Approved scope, roles, and 30/60/90-day plan",
    actionTh: "เดินงานลำดับต้น ทบทวน KPI เก็บ action log และปรับตามจังหวะที่ตกลง",
    actionEn: "Run priority actions, review KPIs, keep an action log, and adjust on the agreed cadence",
    output: "Weekly/Monthly Operating Rhythm and Action Log",
    approvalTh: "โรงแรมอนุมัติราคา โปรโมชั่น การเปลี่ยนคน นโยบาย แบรนด์ และมาตรฐานบริการ",
    approvalEn: "The hotel approves pricing, promotion, staffing, policy, brand, and service-standard changes",
    nextTh: "ตัดสินใจว่าจะเดินต่อ ปรับแผน หรือหยุดตามจังหวะที่ตกลง ไม่ใช่ผลที่การันตี",
    nextEn: "Decide whether to continue, adjust, or stop on the agreed cadence. Not a guaranteed result.",
  },
] as const;

export const INDEPENDENT_FIT_COLUMNS = {
  situation: { th: "สถานการณ์โรงแรม", en: "Hotel situation" },
  symptom: { th: "อาการที่มักเห็น", en: "Symptoms" },
  question: { th: "คำถามแรกที่ใช้คุย", en: "First diagnostic question" },
  support: { th: "งานที่อาจช่วยได้", en: "Recommended support" },
  output: { th: "ผลลัพธ์ที่คาด", en: "Expected output" },
} as const;

export const INDEPENDENT_FIT_SCENARIOS = [
  {
    id: "owner-load",
    situationTh: "เจ้าของดูแลหลายเรื่องคนเดียว",
    situationEn: "Owner is managing too many areas alone",
    symptomTh: "การตัดสินใจช้า และไม่มีเวลาทบทวน",
    symptomEn: "Decisions are slow and there is no time for review",
    questionTh: "ตอนนี้ใครตัดสินใจเรื่องรายวัน รายสัปดาห์ และเรื่องของเจ้าของ และมีจังหวะทบทวนเมื่อไหร่?",
    questionEn: "Who currently decides daily, weekly, and owner-level items, and when is there time to review?",
    supportTh: "จังหวะบริหารและแผนลำดับงาน",
    supportEn: "Management rhythm and priority plan",
    output: "Management Rhythm and Priority Plan",
  },
  {
    id: "unclear-roles",
    situationTh: "มีทีมแล้ว แต่บทบาทยังไม่ชัด",
    situationEn: "The hotel has a team but roles are unclear",
    symptomTh: "งานซ้ำ งานหลุด และไม่มีเจ้าของงานชัด",
    symptomEn: "Duplicated work, missed tasks, and no clear owner",
    questionTh: "แต่ละงานสำคัญมีผู้รับผิดชอบชื่อใคร และใครเห็นเมื่องานหลุด?",
    questionEn: "Who is named as owner for each key task, and who notices if it is missed?",
    supportTh: "กรอบบทบาทและความรับผิดชอบ",
    supportEn: "Role and responsibility framework",
    output: "Role and Responsibility Framework",
  },
  {
    id: "no-plan",
    situationTh: "มีเป้าหมาย แต่ยังไม่มีแผนดำเนินงาน",
    situationEn: "The hotel has goals but no operating plan",
    symptomTh: "ทุกคนรู้เป้าหมาย แต่ไม่รู้ว่าต้องทำอะไรต่อ",
    symptomEn: "Everyone knows the goal but not the next action",
    questionTh: "สัปดาห์นี้ต้องทำอะไรต่อ และใครเป็นเจ้าของงานนั้น?",
    questionEn: "What is the next action this week, and who owns it?",
    supportTh: "แผน 30/60/90 วัน",
    supportEn: "30/60/90-Day Plan",
    output: "30/60/90-Day Plan",
  },
  {
    id: "commercial-gap",
    situationTh: "การค้าและการตลาดยังไม่เชื่อมกัน",
    situationEn: "Commercial and marketing decisions are disconnected",
    symptomTh: "ราคา ช่องทาง และโปรโมชั่นไม่ได้เดินไปด้วยกัน",
    symptomEn: "Price, channels, and promotions do not move together",
    questionTh: "ใครตัดสินใจราคา ช่องทาง และโปรโมชั่นร่วมกัน และคุยกันบ่อยแค่ไหน?",
    questionEn: "Who decides rate, channel, and promotion together, and how often?",
    supportTh: "ทบทวนการค้าและแผนการกระทำ",
    supportEn: "Commercial review and action plan",
    output: "Commercial Review and Action Plan",
  },
  {
    id: "change-stage",
    situationTh: "โรงแรมกำลังเปิด ปรับตำแหน่ง หรือเปลี่ยนโมเดลดำเนินงาน",
    situationEn: "The hotel is opening, repositioning, or changing its operating model",
    symptomTh: "มาตรฐานและความรับผิดชอบยังกำลังถูกกำหนด",
    symptomEn: "Standards and ownership are still being established",
    questionTh: "มาตรฐาน บทบาท และวันที่เปิดหรือเปลี่ยนงาน อะไรตกลงแล้วบ้าง?",
    questionEn: "Which standards, roles, and opening or change dates are already agreed?",
    supportTh: "แผนก่อนเปิดหรือแผนปรับตำแหน่ง",
    supportEn: "Pre-opening or repositioning plan",
    output: "Pre-opening or Repositioning Plan",
  },
] as const;

export const INDEPENDENT_FIT_NOT = [
  {
    id: "creative-only",
    th: "โรงแรมต้องการแค่ถ่ายภาพหรือทำเว็บไซต์",
    en: "The hotel only needs photography or a website.",
  },
  {
    id: "no-approver",
    th: "ไม่มีผู้ตัดสินใจที่อนุมัติการเปลี่ยนแปลงได้",
    en: "There is no decision-maker available to approve changes.",
  },
  {
    id: "guaranteed-revenue",
    th: "ต้องการการันตีรายได้โดยไม่ปรับระบบหรือการกระทำ",
    en: "The hotel expects guaranteed revenue without changing systems or actions.",
  },
  {
    id: "no-data",
    th: "ยังไม่พร้อมแชร์ข้อมูลที่ต้องใช้ประเมิน",
    en: "The hotel cannot share the information needed for assessment.",
  },
] as const;

export const INDEPENDENT_SCOPE_ROWS = [
  {
    id: "support",
    titleTh: "อาจช่วยได้",
    titleEn: "May support",
    itemsTh: ["ทิศทางและจังหวะกับเจ้าของ", "ประสานงานการค้าและปฏิบัติการ", "โครงสร้างบทบาทและจังหวะบริการ", "ทบทวน KPI จากแหล่งที่ตรวจได้"],
    itemsEn: ["Owner direction and cadence", "Commercial and operations coordination", "Role structure and service rhythm", "KPI review from verifiable sources"],
  },
  {
    id: "approval",
    titleTh: "โรงแรมเป็นผู้อนุมัติ",
    titleEn: "Hotel approval required",
    itemsTh: ["ราคา โปรโมชั่น และนโยบาย", "การเปลี่ยนคนหรือหน้าที่", "การเผยแพร่ข้อมูลโรงแรม", "การเข้าถึงบัญชีและระบบ"],
    itemsEn: ["Rates, offers, and policy", "People or duty changes", "Publishing hotel information", "Access to accounts and systems"],
  },
  {
    id: "hotel",
    titleTh: "ยังเป็นของโรงแรม",
    titleEn: "Stays with the hotel",
    itemsTh: ["การตัดสินใจของเจ้าของ", "GM และผู้มีหน้าที่ตามกฎหมาย", "ความปลอดภัยของแขก", "ใบอนุญาตและงานที่กฎหมายกำหนด"],
    itemsEn: ["Owner decisions", "GM and legally responsible persons", "Guest safety", "Licences and regulated work"],
  },
] as const;

export const INDEPENDENT_PLAN = [
  {
    id: "d30",
    label: "First 30 Days",
    labelTh: "30 วันแรก",
    itemsTh: ["ตรวจสถานการณ์ปัจจุบัน", "จัดเป้าหมายและผู้รับผิดชอบให้ตรงกัน", "หาจุดที่ปรับได้เร็ว", "ยืนยันข้อมูลและจังหวะประชุม"],
    itemsEn: ["Audit current situation", "Align goals and owners", "Identify quick wins", "Confirm data and meeting rhythm"],
    output: "Baseline and Priority List",
  },
  {
    id: "d60",
    label: "Days 31–60",
    labelTh: "วันที่ 31–60",
    itemsTh: ["ลงมือทำตามลำดับความสำคัญ", "ตั้งจังหวะทบทวนรายสัปดาห์และรายเดือน", "ทดลองการเปลี่ยนแปลงการดำเนินงาน", "ทบทวน KPI และสิ่งที่ติดขัด"],
    itemsEn: ["Implement priority actions", "Establish weekly/monthly review", "Test operating changes", "Review KPI and blockers"],
    output: "Action Log and First Review",
  },
  {
    id: "d90",
    label: "Days 61–90",
    labelTh: "วันที่ 61–90",
    itemsTh: ["ทำให้จังหวะดำเนินงานนิ่งขึ้น", "ประเมินความคืบหน้า", "ปรับลำดับความสำคัญ", "กำหนดรอบบริหารถัดไป"],
    itemsEn: ["Stabilize operating rhythm", "Evaluate progress", "Update priorities", "Set the next management cycle"],
    output: "Review Summary and Next Plan",
  },
] as const;

export const INDEPENDENT_CADENCE = [
  {
    id: "weekly",
    label: "Weekly",
    labelTh: "รายสัปดาห์",
    itemsTh: ["ลำดับความสำคัญ", "สิ่งที่ติดขัด", "ปัญหาแขกและปฏิบัติการ", "การกระทำถัดไปทันที"],
    itemsEn: ["Priorities", "Blockers", "Guest/operations issues", "Immediate next actions"],
  },
  {
    id: "monthly",
    label: "Monthly",
    labelTh: "รายเดือน",
    itemsTh: ["ผลการค้า", "ทบทวน KPI", "งบประมาณและบันทึกการกระทำ", "ลำดับงานเดือนถัดไป"],
    itemsEn: ["Commercial performance", "KPI review", "Budget and action log", "Next-month priorities"],
  },
  {
    id: "quarterly",
    label: "Quarterly",
    labelTh: "รายไตรมาส",
    itemsTh: ["ทิศทาง", "การวางตำแหน่ง", "การลงทุน", "ลำดับความสำคัญเชิงกลยุทธ์"],
    itemsEn: ["Direction", "Positioning", "Investment", "Strategic priorities"],
  },
] as const;

export const INDEPENDENT_SOURCES = [
  {
    id: "internal-review",
    nameTh: "กรอบทบทวนภายในของเดอะ เคพีไอ พลัส — จังหวะบริหารโรงแรมอิสระ",
    nameEn: "The KPI Plus internal review frame — independent hotel management rhythm",
    url: "",
    publishedAt: "2026-10-29",
    accessedAt: "2026-10-29",
    marketTh: "โรงแรมอิสระ งานที่ปรึกษา ไม่ใช่ผลโรงแรมรายแห่ง",
    marketEn: "Independent-hotel advisory work, not a named hotel result",
    period: "2026",
    definitionTh: "ใช้เป็นกรอบจัดจังหวะงาน ไม่ใช่สถิติ Occupancy ADR หรือกำไร",
    definitionEn: "A working frame for management rhythm, not occupancy, ADR, or profit statistics",
    status: "guidance" as IndependentSourceStatus,
  },
] as const;

export const INDEPENDENT_KPI_SAMPLE = {
  period: "Sample period · not a live hotel month",
  periodTh: "ช่วงตัวอย่าง · ไม่ใช่เดือนของโรงแรมจริง",
  market: "Independent hotel advisory sample",
  marketTh: "ตัวอย่างงานที่ปรึกษาโรงแรมอิสระ",
  source: "Internal sample index",
  sourceTh: "ดัชนีตัวอย่างภายใน",
  comparison: "No hotel baseline published",
  comparisonTh: "ยังไม่เผยแพร่เส้นฐานของโรงแรม",
  updatedAt: "2026-10-29",
};

export const INDEPENDENT_KPIS = [
  {
    id: "review-cadence",
    group: "rhythm",
    nameTh: "จังหวะทบทวนกับเจ้าของ",
    nameEn: "Owner review cadence",
    unit: "meetings",
    unitTh: "ครั้ง",
    definition: "Scheduled owner reviews completed in the sample period",
    definitionTh: "จำนวนรอบทบทวนกับเจ้าของที่จัดในช่วงตัวอย่าง",
    dataStatus: "sample" as IndependentKpiStatus,
    hideUntilData: false,
    tone: "green" as const,
  },
  {
    id: "scope-approvals",
    group: "rhythm",
    nameTh: "รายการที่รออนุมัติโรงแรม",
    nameEn: "Items waiting hotel approval",
    unit: "items",
    unitTh: "รายการ",
    definition: "Open commercial, people, or policy items that still need hotel approval",
    definitionTh: "รายการการค้า คน หรือนโยบายที่ยังรอโรงแรมอนุมัติ",
    dataStatus: "sample" as IndependentKpiStatus,
    hideUntilData: false,
    tone: "yellow" as const,
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
    dataStatus: "not-configured" as IndependentKpiStatus,
    hideUntilData: true,
    tone: "amber" as const,
  },
  {
    id: "adr",
    group: "commercial",
    nameTh: "ADR",
    nameEn: "ADR",
    unit: "THB",
    unitTh: "บาท",
    definition: "Average daily rate from a hotel-approved source",
    definitionTh: "ราคาเฉลี่ยต่อคืนจากแหล่งที่โรงแรมอนุมัติ",
    dataStatus: "not-configured" as IndependentKpiStatus,
    hideUntilData: true,
    tone: "amber" as const,
  },
] as const;

export function independentRelatedCards(locale: Locale) {
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
    card("revenue", "/solutions/revenue-commercial-management", "บริหารรายได้และการขาย", "Revenue and commercial management", "ถ้าโรงแรมต้องการจัดราคา ช่องทาง และจังหวะการค้าให้ชัดขึ้น อาจเป็นงานคู่ขนาน ไม่ใช่ผลรายได้ที่การันตี", "If the hotel needs clearer rates, channels, and commercial cadence, this may run alongside. Not a guaranteed revenue result.", "solution"),
    card("training", "/solutions/hotel-training-team-development", "ฝึกอบรมและพัฒนาทีม", "Hotel training and team development", "เมื่อบทบาทชัดแล้ว ทีมอาจต้องการฝึกปฏิบัติหน้างาน การฝึกไม่แทนที่ GM", "When roles are clear, the team may need floor practice. Training does not replace a GM.", "solution"),
    card("website", "/solutions/hotel-website-design", "ออกแบบเว็บไซต์โรงแรม", "Hotel website design", "หน้าเว็บและเส้นทางจองตรงช่วยให้แขกเข้าใจข้อเสนอ งานนี้ไม่ใช่ผลจอง", "The website and booking path help guests understand the offer. This is not a booking result.", "solution"),
    card("direct", "/solutions/hotel-direct-bookings", "การจองตรง", "Direct bookings", "หากจุดติดขัดอยู่ที่หน้าห้องพักหรือระบบจอง อาจตรวจเส้นทางจองตรงแยกต่างหาก", "If the gap is the room page or booking engine, the direct-booking path can be reviewed separately.", "solution"),
  ];
}

export const INDEPENDENT_ENQUIRY_RECEIVE = [
  {
    id: "context",
    title: "Context and problem review",
    th: "ทบทวนบริบทและปัญหาที่โรงแรมกำลังเจอ เพื่อให้เห็นจุดเริ่มต้นที่ชัดขึ้น",
    en: "A review of the hotel’s context and current problems, so the starting point is clearer.",
  },
  {
    id: "assessment",
    title: "Independent Hotel Assessment",
    th: "ประเมินโครงสร้างงาน ทีม ระบบ และจุดที่ยังไม่ชัด ไม่ใช่คะแนนโรงแรม",
    en: "An independent hotel assessment of the work structure, team, systems, and unclear points. Not a hotel score.",
  },
  {
    id: "scope",
    title: "Scope and responsibility discussion",
    th: "คุยขอบเขตงาน หน้าที่ของทีม และสิ่งที่โรงแรมยังรับผิดชอบเอง",
    en: "A discussion of scope, team duties, and what the hotel still owns.",
  },
  {
    id: "priorities",
    title: "Recommended priorities",
    th: "ลำดับความสำคัญที่ควรเริ่มก่อน ตามข้อมูลที่มี ไม่ใช่แพ็กเกจสำเร็จรูป",
    en: "Recommended priorities to start with, based on the information available. Not a fixed package.",
  },
  {
    id: "plan",
    title: "Potential 30/60/90-Day Plan",
    th: "โครงแผน 30/60/90 วันที่อาจใช้จัดลำดับงาน ไม่ใช่ผลที่การันตี",
    en: "A potential 30/60/90-day plan for sequencing the work. Not a guaranteed result.",
  },
  {
    id: "next",
    title: "Next Action and decision path",
    th: "กำหนด Next Action ผู้รับผิดชอบ และทางตัดสินใจก่อนเริ่มงาน",
    en: "A Next Action, named owners, and a decision path before the work starts.",
  },
] as const;

export function independentEnquiryCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: "Hotel Management",
    heading: thai ? "คุยเรื่องการบริหารโรงแรมอิสระ" : "Talk about independent hotel management",
    lead: thai
      ? "เริ่มจากการเล่าบริบทโรงแรม ทีมจะช่วยทบทวนปัญหา ประเมินงาน คุยขอบเขตและความรับผิดชอบ แล้วสรุปลำดับความสำคัญ แผน 30/60/90 ที่อาจใช้ได้ และ Next Action ก่อนตัดสินใจ"
      : "Start by sharing the hotel’s context. The team can review the problem, assess the work, discuss scope and responsibility, then summarise recommended priorities, a potential 30/60/90-day plan, and the Next Action before a decision.",
    receiveTitle: thai ? "โรงแรมจะได้อะไรจากการเริ่มคุย" : "What the hotel receives from starting the conversation",
    nextTitle: "What Happens Next",
    steps: thai
      ? [
          "เล่าบริบทและปัญหาของโรงแรม",
          "ทีมทำความเข้าใจเป้าหมาย ทีม และข้อจำกัด",
          "สรุป Scope, Deliverables และวิธีทำงาน",
          "กำหนด Next Action และผู้รับผิดชอบ",
        ]
      : [
          "Share the hotel’s context and current problems",
          "The team reviews the goal, team, and constraints",
          "We summarise Scope, Deliverables, and the way of working",
          "We set the Next Action and named owners",
        ],
    note: thai
      ? "ไม่จำเป็นต้องรู้ขอบเขตงานล่วงหน้า การคุยครั้งนี้ยังไม่ใช่การวินิจฉัยโรงแรม และไม่ใช่ผลที่การันตี"
      : "You do not need a scope in advance. This conversation is not a hotel diagnosis, and not a guaranteed result.",
    submit: thai ? "นัดพูดคุยเรื่องโรงแรมของคุณ" : "Book a conversation about your hotel",
    loading: thai ? "กำลังส่งข้อมูล กรุณารอสักครู่" : "Sending your message. Please wait.",
    labels: {
      name: thai ? "ชื่อผู้ติดต่อ" : "Contact name",
      business: thai ? "ชื่อโรงแรม / บริษัท" : "Hotel / company name",
      contact: thai ? "อีเมลหรือเบอร์โทร" : "Email / phone",
      rooms: thai ? "จำนวนห้อง" : "Number of rooms",
      hotelStatus: thai ? "สถานะโรงแรม" : "Hotel status",
      hotelStatusPlaceholder: thai ? "เลือกสถานะโรงแรม" : "Choose hotel status",
      challenge: thai ? "ประเด็นหลัก" : "Main challenge",
      challengePlaceholder: thai ? "เลือกประเด็นหลัก" : "Choose the main challenge",
      teamSize: thai ? "ขนาดทีมปัจจุบัน" : "Current team size",
      website: thai ? "เว็บไซต์" : "Website URL",
      systems: thai ? "PMS / Booking Engine / Channel Manager" : "PMS / Booking Engine / Channel Manager",
      goal: thai ? "เป้าหมาย 3–6 เดือนข้างหน้า" : "Goal for the next 3–6 months",
      message: thai ? "รายละเอียดเพิ่มเติม" : "Additional note",
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

const INDEPENDENT_HOTEL_FAQS = [
  {
    qTh: "Independent Hotel Management ต่างจากการจ้างผู้จัดการโรงแรมประจำอย่างไร",
    qEn: "How is Independent Hotel Management different from hiring a resident hotel manager?",
    aTh: "งานนี้ไม่ใช่การส่ง GM มาประจำโรงแรมเต็มเวลา เดอะ เคพีไอ พลัส อาจช่วยประเมิน วางโครงสร้าง ประสานงาน และติดตามตามขอบเขตที่ตกลง ผู้จัดการทั่วไป หัวหน้าแผนก และผู้มีหน้าที่ตามกฎหมายยังเป็นของโรงแรม",
    aEn: "This is not a full-time resident GM placement. The KPI Plus may support assessment, structure, coordination, and follow-up within an agreed scope. The general manager, department heads, and legally responsible persons stay with the hotel.",
  },
  {
    qTh: "The KPI Plus รับผิดชอบส่วนใด และโรงแรมรับผิดชอบส่วนใด",
    qEn: "What does The KPI Plus own, and what does the hotel own?",
    aTh: "เดอะ เคพีไอ พลัส อาจช่วยเรื่องการประเมิน โครงสร้าง การวางแผน การประสานงาน การทบทวน และการติดตามการกระทำ ตามขอบเขตที่โรงแรมอนุมัติ โรงแรมยังรับผิดชอบการตัดสินใจระดับเจ้าของ คน งบประมาณ กฎหมาย ความปลอดภัยของแขก และมาตรฐานบริการขั้นสุดท้าย ขอบเขตจริงขึ้นกับความต้องการ ทีม ข้อมูล ระบบ และการอนุมัติ",
    aEn: "The KPI Plus may support assessment, structure, planning, coordination, review, and action tracking where the hotel approves. The hotel remains responsible for owner decisions, people, budget, legal compliance, guest safety, and final service standards. Actual scope depends on the hotel’s needs, team, data, systems, approval, and agreed responsibilities.",
  },
  {
    qTh: "ต้องมีทีมโรงแรมอยู่แล้วหรือไม่",
    qEn: "Does the hotel already need a team in place?",
    aTh: "ไม่จำเป็น บางโรงแรมมีทีมพร้อม บางแห่งกำลังเปลี่ยนทีม และบางแห่งเพิ่งเริ่มวางระบบ งานปรับตามทีมที่มีอยู่จริง และไม่ได้หมายความว่าเดอะ เคพีไอ พลัส จะเป็นนายจ้างแทนโรงแรม",
    aEn: "No. Some hotels already have a team, some are changing the team, and some are setting a new way of working. The work is adapted to the team that exists. The KPI Plus does not become the employer.",
  },
  {
    qTh: "รองรับโรงแรมเปิดใหม่หรือกำลังปรับระบบหรือไม่",
    qEn: "Can this support a new opening or a hotel that is changing systems?",
    aTh: "รองรับได้ทั้งโรงแรมที่เปิดอยู่ กำลังเปิด กำลังปรับตำแหน่ง หรือกำลังเปลี่ยนระบบ งานเริ่มจากบริบทและข้อจำกัดที่มี ไม่ใช่แพ็กเกจสำเร็จรูปเดียวกันทุกแห่ง",
    aEn: "Yes. The work can support operating hotels, openings, repositioning, or system changes. It starts from the current context and constraints, not a single fixed package.",
  },
  {
    qTh: "ช่วยด้าน Revenue, Marketing และ Operations พร้อมกันได้หรือไม่",
    qEn: "Can Revenue, Marketing, and Operations be supported together?",
    aTh: "ได้ตามขอบเขตที่ตกลง งานอาจเชื่อมทิศทาง ปฏิบัติการ การค้า การตลาด และคน แต่ไม่ได้หมายความว่าทุกสายงานจะถูกทำพร้อมกันทุกโรงแรม ลำดับงานขึ้นกับความต้องการ ทีม ข้อมูล ระบบ และการอนุมัติ",
    aEn: "Yes, where the agreed scope includes them. The work may connect direction, operations, commercial work, marketing, and people. That does not mean every workstream runs at once for every hotel. Sequence depends on needs, team, data, systems, and approval.",
  },
  {
    qTh: "ต้องใช้ข้อมูลอะไรในการเริ่ม Assessment",
    qEn: "What information is needed to start the Assessment?",
    aTh: "เริ่มจากบริบทโรงแรม เป้าหมาย ข้อจำกัด โครงสร้างทีม และระบบที่มี เช่น PMS หรือช่องทางขาย ยิ่งมีข้อมูลครบ การประเมินยิ่งชัดขึ้น แต่ไม่ต้องรอข้อมูลครบทุกชิ้นก่อนเริ่มคุย",
    aEn: "Start with the hotel’s context, goal, constraints, team structure, and current systems, such as the PMS or selling channels. Fuller data makes the assessment clearer, but a complete file is not required before the first conversation.",
  },
  {
    qTh: "ใช้เวลาทำงานร่วมกันนานเท่าไร",
    qEn: "How long does the work together take?",
    aTh: "ไม่มีระยะเวลาตายตัว ขึ้นกับขอบเขตที่ตกลง ทีม ข้อมูล ระบบ และจุดที่โรงแรมต้องอนุมัติ หน้านี้ไม่กำหนดเวลาได้ผล และไม่ใช่ไทม์ไลน์ลูกค้าจริง",
    aEn: "There is no fixed duration. It depends on the agreed scope, team, data, systems, and hotel approval points. This page does not set a time-to-result, and it is not a live client timeline.",
  },
  {
    qTh: "มี 30/60/90-Day Plan หรือไม่",
    qEn: "Is there a 30/60/90-Day Plan?",
    aTh: "มีแผน 30/60/90 วันเป็นตัวอย่างลำดับงาน ไม่ใช่คำสัญญาว่าโรงแรมทุกแห่งจะได้ผลภายในระยะเหล่านี้ แผนจริงจะร่างหลังประเมิน และโรงแรมเป็นผู้อนุมัติ",
    aEn: "There is a sample 30/60/90-day plan for sequencing the work. It does not promise that every hotel will achieve a result in those periods. The actual plan is drafted after assessment, and the hotel approves it.",
  },
  {
    qTh: "มี Report และ Meeting Rhythm อย่างไร",
    qEn: "How do reports and the meeting rhythm work?",
    aTh: "อาจมีจังหวะประชุมรายสัปดาห์ รายเดือน และรายไตรมาส ตามขอบเขตที่ตกลง รูปแบบรายงานและผู้เข้าร่วมปรับตามทีมและข้อมูลที่มี ไม่ใช่แพ็กเกจรายงานสำเร็จรูป",
    aEn: "A weekly, monthly, and quarterly meeting rhythm may be used within the agreed scope. Report format and attendees are adapted to the team and available data. It is not a fixed reporting package.",
  },
  {
    qTh: "สามารถทำงานร่วมกับทีมเดิมได้หรือไม่",
    qEn: "Can this work with the current team?",
    aTh: "ได้ งานนี้ออกแบบมาให้ทำงานร่วมกับทีมโรงแรมที่มีอยู่ ไม่ได้แทนที่ GM หรือหัวหน้าแผนกโดยอัตโนมัติ บทบาทและผู้รับผิดชอบต้องตกลงก่อนเริ่มงาน",
    aEn: "Yes. The work is designed to run with the current hotel team. It does not automatically replace a GM or department head. Roles and owners should be agreed before the work starts.",
  },
  {
    qTh: "รองรับโรงแรมขนาดเล็กหรือ Boutique Hotel หรือไม่",
    qEn: "Does this support small hotels or boutique hotels?",
    aTh: "รองรับได้ งานปรับตามจำนวนห้อง ทีม ระบบ และข้อจำกัดของโรงแรม ไม่ใช่โมเดลที่ใช้ได้เฉพาะโรงแรมใหญ่ แต่ขอบเขตจริงยังขึ้นกับความต้องการและการอนุมัติ",
    aEn: "Yes. The work is adapted to room count, team, systems, and constraints. It is not only for large hotels. Actual scope still depends on need and approval.",
  },
  {
    qTh: "รับประกันรายได้ Occupancy หรือกำไรหรือไม่",
    qEn: "Does this guarantee revenue, occupancy, or profit?",
    aTh: "ไม่รับประกันรายได้ Occupancy ADR RevPAR กำไร หรือคะแนนแขก หน้านี้ไม่อนุมานผล และไม่ใช้เคสลูกค้าที่ยังไม่ได้รับอนุมัติ",
    aEn: "No. The work does not guarantee revenue, occupancy, ADR, RevPAR, profit, or guest scores. This page does not infer results, and it does not use an unapproved case study.",
  },
] as const;

export function independentHotelFaqs(locale: Locale): FaqItem[] {
  const thai = locale === "th";
  return INDEPENDENT_HOTEL_FAQS.map((item) => ({
    q: thai ? item.qTh : item.qEn,
    a: thai ? item.aTh : item.aEn,
  }));
}

export function independentHotelFaqsAreStale(items: Array<{ q: string; a: string }>) {
  if (!items.length) return true;
  const current = [
    "Independent Hotel Management ต่างจากการจ้างผู้จัดการโรงแรมประจำอย่างไร",
    "How is Independent Hotel Management different from hiring a resident hotel manager?",
  ];
  return !items.some((item) => current.includes(item.q.trim()));
}

export const independentHotelCopy = {
  th: {
    crumb: "โซลูชัน",
    eyebrow: "Independent Hotel Management",
    title: "บริหารโรงแรมอิสระให้เดินหน้าได้จริง และเติบโตอย่างมีทิศทาง",
    lead: "เจ้าของโรงแรมอิสระมักต้องการทิศทางที่ชัดขึ้น โครงสร้างดำเนินงาน การประสานงานการค้า และจังหวะบริหารที่ตามได้ งานนี้อาจช่วยประเมิน วางแผน จัดทีม ทบทวน KPI และติดตามการกระทำ ตามขอบเขตที่โรงแรมอนุมัติ และปรับตามทีม ระบบ ระยะ และข้อจำกัดที่มีอยู่จริง",
    leadClose:
      "ไม่การันตีรายได้ Occupancy หรือผลประกอบการ และไม่ได้แทนที่ GM หัวหน้าแผนก เจ้าของ หรือผู้มีหน้าที่ตามกฎหมายโดยอัตโนมัติ",
    start: "เราเริ่มจากการพูดคุย เพื่อให้เข้าใจว่าโรงแรมของคุณมีอะไรอยู่แล้ว ต้องการความช่วยเหลือส่วนไหน และควรทำงานร่วมกันอย่างไร",
    cta: "ขอประเมินการบริหารโรงแรมอิสระ",
    secondary: "ดูแนวทางการทำงาน",
    underCta: "งานปรับตามโรงแรมที่เป็นอยู่ ไม่ใช่แพ็กเกจสำเร็จรูป และไม่ใช่ผลที่การันตี",
    needTitle: "โรงแรมของคุณต้องการความช่วยเหลือแบบไหน?",
    needLead:
      "เจ้าของโรงแรมอิสระมักเห็นปัญหา แต่ยังไม่ชัดว่าอยู่ที่ทิศทาง การดำเนินงาน การค้า คน หรือการวัดผล กรอบนี้ช่วยจัดประเด็นก่อนตกลงขอบเขตงาน",
    needClose: "ไม่ใช่ผลวินิจฉัยโรงแรมจริง และไม่ใช่ข้อค้นพบจากโครงการลูกค้า ขอบเขตงานปรับตามโรงแรมที่เป็นอยู่",
    helpTitle: "สิ่งที่ช่วยโรงแรมได้",
    helpLead:
      "งานนี้อยู่ใน Independent Hotel Operating Model สามสายงาน ไม่ใช่การ์ดบริการแยกชิ้น แต่เป็นลำดับงานที่เชื่อมกันตามขอบเขตที่โรงแรมอนุมัติ",
    helpBoundary: "ขอบเขตงานจริงขึ้นกับความต้องการของโรงแรม ข้อมูลที่มี โครงสร้างทีม และหน้าที่ที่ตกลงกัน",
    modelTitle: "โมเดลดำเนินงานที่ใช้ร่วมกับโรงแรม",
    deliverablesTitle: "ขอบเขตงานและผลลัพธ์ที่ส่งมอบ",
    deliverablesLead: "ตารางนี้แสดงงานที่อาจทบทวนหรือสนับสนุน เอกสารที่ส่งมอบ และจุดที่โรงแรมต้องอนุมัติ ไม่ใช่แพ็กเกจสำเร็จรูป และไม่ใช่ผลที่การันตี",
    deliverablesBoundary:
      "เดอะ เคพีไอ พลัส อาจช่วยเรื่องโครงสร้าง การวางแผน การประสานงาน การทบทวน และการติดตามการกระทำ โรงแรมยังรับผิดชอบการตัดสินใจระดับเจ้าของ การปฏิบัติตามกฎหมายและกฎระเบียบ ความปลอดภัยของแขก การตัดสินใจเรื่องคน การอนุมัติงบประมาณ และมาตรฐานบริการขั้นสุดท้าย",
    methodTitle: "วิธีเริ่มต้นทำงานร่วมกัน",
    methodLead: "งานเริ่มจาก Assess แล้ว Align ก่อน Operate แต่ละขั้นมีผู้รับผิดชอบ ผลลัพธ์ และจุดที่โรงแรมต้องอนุมัติก่อนไปต่อ",
    methodApprovals: "จุดที่โรงแรมต้องอนุมัติ",
    fitTitle: "Independent Hotel Management อาจเหมาะเมื่อไหร่?",
    fitLead: "ตารางนี้เป็นตัวอย่างสถานการณ์ที่มักคุยกัน ไม่ใช่ผลการวินิจฉัยโรงแรมก่อนประเมิน",
    fitNotTitle: "อาจยังไม่ใช่งานนี้เมื่อ…",
    scopeTitle: "ขอบเขต ความรับผิดชอบ และการอนุมัติ",
    planTitle: "แผน 30 / 60 / 90 วัน — ตัวอย่าง",
    planLead: "นี่เป็นแผนตัวอย่างสำหรับจัดลำดับงาน ไม่ใช่คำสัญญาว่าโรงแรมทุกแห่งจะได้ผลภายในระยะเวลาเหล่านี้",
    planCadenceTitle: "จังหวะบริหาร — ตัวอย่าง",
    planClose: "แผนนี้เป็นตัวอย่างลำดับงาน ไม่ได้หมายความว่าโรงแรมทุกแห่งจะได้ผลภายในระยะเวลาเหล่านี้",
    measureTitle: "ตัวชี้วัดที่ใช้ทบทวน ไม่ใช่ผลที่การันตี",
    relatedTitle: "งานที่เกี่ยวข้องกับการบริหารโรงแรมอิสระ",
    closerTitle: "คุยเรื่องการบริหารโรงแรมอิสระ",
    closerBody:
      "คุณไม่จำเป็นต้องเตรียมขอบเขตงานไว้ก่อน เพียงเล่าให้เราฟังเกี่ยวกับโรงแรม เป้าหมาย และเรื่องที่อยากให้ช่วย เราจะร่วมกันหาวิธีทำงานที่เหมาะสม พร้อมกำหนดหน้าที่และความรับผิดชอบให้ชัดเจนก่อนเริ่มงาน",
    closerCta: "นัดพูดคุยเรื่องการบริหารโรงแรม",
  },
  en: {
    crumb: "Solutions",
    eyebrow: "Independent Hotel Management",
    title: "Move an independent hotel forward, with a direction for growth",
    lead: "Independent hotel owners often need clearer direction, operating structure, commercial coordination, and a management rhythm. The work may support assessment, planning, team alignment, KPI review, and action tracking where the hotel approves, and it is adapted to the current team, systems, stage, and constraints.",
    leadClose: "It does not guarantee revenue, occupancy, or trading results, and it does not automatically replace a GM, department head, owner, or legally responsible person.",
    start: "We start with a conversation, so we understand what the hotel already has, which part needs help, and how we should work together.",
    cta: "Request an independent hotel management assessment",
    secondary: "View the approach",
    underCta: "The work is adapted to the hotel as it is. Not a fixed package, and not a guaranteed result.",
    needTitle: "What kind of help does the hotel need?",
    needLead:
      "Independent hotel owners often see a problem, but it is not yet clear whether it sits in direction, operations, commercial work, people, or measurement. This frame helps locate the current issue before scope is agreed.",
    needClose: "It is not a live hotel diagnosis and not findings from a client project. Scope is adapted to the hotel as it is.",
    helpTitle: "What can help the hotel",
    helpLead:
      "The work sits in an Independent Hotel Operating Model with three workstreams. It is not a set of isolated marketing cards, but a connected sequence within the scope the hotel approves.",
    helpBoundary: "The actual scope depends on the hotel's needs, available data, team structure, and agreed responsibilities.",
    modelTitle: "The operating model used with the hotel",
    deliverablesTitle: "Scope and Deliverables",
    deliverablesLead: "This table shows what may be reviewed or supported, the named deliverable, and the hotel approval point. It is not a fixed package, and not a guaranteed result.",
    deliverablesBoundary:
      "The KPI Plus may support structure, planning, coordination, review, and action tracking. The hotel remains responsible for owner-level decisions, legal and regulatory compliance, guest safety, staffing decisions, budget approval, and final service standards.",
    methodTitle: "How we start working together",
    methodLead: "The work starts with Assess, then Align, then Operate. Each step has an owner, an output, and a hotel approval point before the next decision.",
    methodApprovals: "Hotel approval points",
    fitTitle: "When Independent Hotel Management may be suitable",
    fitLead: "This matrix is a sample of situations often discussed. It is not a diagnosis before the hotel is assessed.",
    fitNotTitle: "May not be the right fit when...",
    scopeTitle: "Scope, responsibility, and approval",
    planTitle: "30/60/90-Day Hotel Management Plan — Sample",
    planLead: "This is a sample plan for sequencing the work. It does not promise that every hotel will achieve a specific result within these periods.",
    planCadenceTitle: "Management Cadence — Sample",
    planClose: "This is a sample sequence of work. It does not mean every hotel will achieve a specific result within these periods.",
    measureTitle: "Measures used in review. Not a guaranteed result.",
    relatedTitle: "Related work for independent hotel management",
    closerTitle: "Talk about independent hotel management",
    closerBody:
      "You do not need a scope in advance. Tell us about the hotel, the goal, and what you want help with. We will find a way of working that fits, and make roles and ownership clear before the work starts.",
    closerCta: "Book a conversation about hotel management",
  },
} as const;
