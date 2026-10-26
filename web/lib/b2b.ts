import type { Locale } from "@/lib/seo";

export type B2bVisualStatus = "placeholder" | "sample" | "approved" | "real";
export type B2bKpiStatus = "draft" | "sample" | "approved" | "anonymised";

export type B2bKpi = {
  id: string;
  name: string;
  definitionTh: string;
  definitionEn: string;
  unit: string;
  periodTh: string;
  periodEn: string;
  comparisonTh: string;
  comparisonEn: string;
  dataStatus: "Sample" | "Approved" | "Anonymised";
  labels: string[];
  values: number[];
};

export const B2B_SAMPLE_LABEL = {
  th: "ตัวอย่างข้อมูล",
  en: "Sample Visual",
} as const;

/** Approved 1600×1000 partner/rate review. Omit src when the file is missing; do not generate a photo. */
export const B2B_HERO_VISUAL_CANDIDATE = "/images/b2b-agent-sales-hero-placeholder.webp";

export const B2B_HERO_VISUAL = {
  recommendedSize: "1600 × 1000 px",
  ratio: "8 / 5",
  fit: "contain" as const,
  width: 1600,
  height: 1000,
  displayWidth: 560,
  displayHeight: 350,
  alt: {
    th: "ตัวอย่างการทบทวนงานขายพาร์ตเนอร์ B2B ด้าน Partner ราคา และการจอง",
    en: "Sample B2B partner sales review of partner fit, rates, and booking flow",
  },
  label: {
    th: "ตัวอย่าง B2B Partner Sales Review",
    en: "Sample B2B Partner Sales Review",
  },
  meta: {
    th: "Sample workflow · Partner, Rate and Booking view",
    en: "Sample workflow · Partner, Rate and Booking view",
  },
  caption: {
    th: "จับคู่โรงแรมกับ Partner ที่เหมาะกับตลาด ราคา และรูปแบบการขายของโรงแรม",
    en: "Match the hotel with a partner that fits its market, rates, and way of selling",
  },
} as const;

export const B2B_READINESS_VISUAL_CANDIDATE = "/images/b2b-agent-sales-readiness-placeholder.webp";

export const B2B_READINESS_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  fit: "contain" as const,
  width: 1200,
  height: 800,
  displayWidth: 480,
  displayHeight: 320,
  alt: {
    th: "ตัวอย่างชุดเอกสารความพร้อมขาย B2B ได้แก่รายชื่อพาร์ตเนอร์ เรทชีต และ Sales Kit โดยปิดข้อมูลส่วนตัว",
    en: "Sample B2B sales readiness kit with partner list, rate sheet, and sales kit, private data redacted",
  },
  label: {
    th: "ตัวอย่าง B2B Sales Readiness Kit",
    en: "Sample B2B Sales Readiness Kit",
  },
  meta: {
    th: "Sample data · Agent, Rate, Commission and Sales Kit",
    en: "Sample data · Agent, Rate, Commission and Sales Kit",
  },
  caption: {
    th: "เอกสารที่ใช้ดูความพร้อมก่อนประสานพาร์ตเนอร์ ไม่ใช่รูปโรงแรมทั่วไป",
    en: "Documents used to judge B2B readiness, not a generic hotel photo",
  },
  sample: {
    th: "ตัวอย่างข้อมูล",
    en: "Sample data",
  },
} as const;

export const B2B_READINESS_ITEMS = [
  {
    id: "rate-plan",
    checkTh: "มี Rate Plan สำหรับ B2B",
    checkEn: "A B2B rate plan exists",
    whyTh: "Partner ต้องเสนอราคาและเงื่อนไขได้ชัดเจน",
    whyEn: "The partner needs a clear rate and terms to sell",
    outputTh: "Partner Rate Sheet",
    outputEn: "Partner Rate Sheet",
  },
  {
    id: "partner-type",
    checkTh: "รู้ว่าต้องการ Partner แบบใด",
    checkEn: "The hotel knows which partner type it needs",
    whyTh: "ลดการติดต่อ Partner ที่ไม่ตรงตลาด",
    whyEn: "Avoids outreach to partners that do not fit the market",
    outputTh: "Partner Profile Criteria",
    outputEn: "Partner Profile Criteria",
  },
  {
    id: "sales-material",
    checkTh: "มี Sales Material พร้อมส่ง",
    checkEn: "Sales material is ready to send",
    whyTh: "Partner เข้าใจโรงแรมและสินค้าได้เร็วขึ้น",
    whyEn: "The partner can understand the hotel and the product faster",
    outputTh: "B2B Sales Kit",
    outputEn: "B2B Sales Kit",
  },
  {
    id: "commission",
    checkTh: "มีกรอบค่าคอมมิชชันที่โรงแรมอนุมัติแล้ว",
    checkEn: "An approved commission frame exists",
    whyTh: "Partner ต้องรู้ว่าเสนอเงื่อนไขได้แค่ไหน โดยไม่เปิดตัวเลขในหน้าสาธารณะ",
    whyEn: "The partner needs to know what terms can be offered, without publishing the figures",
    outputTh: "Commission Structure",
    outputEn: "Commission Structure",
  },
  {
    id: "contact-map",
    checkTh: "มีแผนที่หรือรายชื่อพาร์ตเนอร์ที่กำลังพิจารณา",
    checkEn: "A working list of partners under review exists",
    whyTh: "ทีมเห็นคิวงานโดยไม่เปิดอีเมลหรือเบอร์ติดต่อ",
    whyEn: "The team can see who is in the queue without private contact details",
    outputTh: "Partner Contact Map",
    outputEn: "Partner Contact Map",
  },
  {
    id: "segment",
    checkTh: "รู้ว่าต้องการ Corporate หรือ Wholesale",
    checkEn: "Corporate or wholesale need is named",
    whyTh: "ข้อเสนอและเอกสารขายไม่เหมือนกันในแต่ละกลุ่ม",
    whyEn: "The offer and the sales pack are not the same for each segment",
    outputTh: "Corporate/Wholesale Segment Notes",
    outputEn: "Corporate/Wholesale Segment Notes",
  },
] as const;

export const B2B_FRAMEWORK_VISUAL_CANDIDATE = "/images/b2b-agent-sales-readiness-framework-placeholder.webp";

export const B2B_FRAMEWORK_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างกรอบความพร้อมขาย B2B ด้าน Partner Fit ราคา เอกสารขาย การจอง และการติดตาม",
    en: "Sample B2B sales readiness framework covering partner fit, rates, sales material, booking, and follow-up",
  },
  label: {
    th: "B2B Sales Readiness Framework — Sample",
    en: "B2B Sales Readiness Framework — Sample",
  },
  meta: {
    th: "Sample data · Gap matrix of five B2B sales areas",
    en: "Sample data · Gap matrix of five B2B sales areas",
  },
  caption: {
    th: "ตารางช่องว่างงานขาย B2B ไม่ใช่รูปโรงแรมหรือบอร์ด CRM",
    en: "A B2B sales gap matrix, not a hotel photo or a CRM board",
  },
  sample: {
    th: "ตัวอย่างข้อมูล",
    en: "Sample data",
  },
} as const;

export const B2B_FRAMEWORK_COLUMNS = {
  area: { th: "พื้นที่งาน", en: "Area" },
  problem: { th: "สถานะปัจจุบัน / ปัญหา", en: "Current state/problem" },
  prepare: { th: "สิ่งที่ต้องเตรียม", en: "What to prepare" },
  output: { th: "สิ่งที่ได้", en: "Expected output" },
} as const;

export const B2B_FRAMEWORK_ROWS = [
  {
    id: "partner-fit",
    area: "Partner Fit",
    problemTh: "ยังไม่ชัดว่าต้องการ Partner แบบใด",
    problemEn: "Partner type is unclear",
    prepareTh: "กำหนดเกณฑ์พาร์ตเนอร์เป้าหมาย",
    prepareEn: "Define target partner criteria",
    outputTh: "Target Partner List",
    outputEn: "Target Partner List",
  },
  {
    id: "rate-commission",
    area: "Rate & Commission",
    problemTh: "โครงสร้างราคาและเงื่อนไขไม่สอดคล้องกัน",
    problemEn: "Rate structure is inconsistent",
    prepareTh: "กำหนดราคาและเงื่อนไข B2B",
    prepareEn: "Set B2B rates and terms",
    outputTh: "B2B Rate Sheet",
    outputEn: "B2B Rate Sheet",
  },
  {
    id: "sales-material",
    area: "Sales Material",
    problemTh: "ข้อมูลสินค้ากระจัดกระจาย",
    problemEn: "Information is scattered",
    prepareTh: "จัดชุดข้อมูลขาย",
    prepareEn: "Prepare a sales kit",
    outputTh: "B2B Sales Kit",
    outputEn: "B2B Sales Kit",
  },
  {
    id: "booking-process",
    area: "Booking Process",
    problemTh: "ยังไม่ชัดว่าใครรับงานจอง",
    problemEn: "Ownership is unclear",
    prepareTh: "กำหนดขั้นตอนส่งต่องานจอง",
    prepareEn: "Define booking handoff",
    outputTh: "Booking Workflow",
    outputEn: "Booking Workflow",
  },
  {
    id: "follow-up",
    area: "Follow-up & Reporting",
    problemTh: "การติดตามพาร์ตเนอร์ไม่ต่อเนื่อง",
    problemEn: "Partner follow-up is inconsistent",
    prepareTh: "ติดตามไปป์ไลน์และงานถัดไป",
    prepareEn: "Track pipeline and next action",
    outputTh: "Partner Pipeline",
    outputEn: "Partner Pipeline",
  },
] as const;

export const B2B_SCOPE_ITEMS = [
  {
    id: "partner-fit",
    kicker: "Partner Fit",
    titleTh: "ประเมินตลาดและความเหมาะสม",
    titleEn: "Review the market and the fit",
    bodyTh:
      "ดูขนาดโรงแรม กลุ่มลูกค้า ฤดูกาล ห้องว่าง และช่องทางขายที่มีอยู่ เพื่อประเมินว่าพาร์ตเนอร์ประเภทใดมีโอกาสช่วยเติมยอดขายโดยไม่กระทบช่องทางอื่นเกินความจำเป็น",
    bodyEn:
      "Look at hotel size, guest mix, season, empty dates, and current channels, then judge which partner type could add sales without harming other channels more than needed.",
    inputTh: "จำนวนห้อง ตลาดหลัก ฤดูกาล ช่องทางปัจจุบัน",
    inputEn: "Rooms, main markets, season, current channels",
    outputTh: "ข้อสรุปว่า B2B เหมาะตอนนี้หรือควรปรับช่องทางอื่นก่อน",
    outputEn: "A view on whether B2B fits now, or another channel should come first",
  },
  {
    id: "rate-commission",
    kicker: "B2B Rate and Commission",
    titleTh: "ช่วยวางราคาและเงื่อนไขการขาย",
    titleEn: "Help set rates and selling conditions",
    bodyTh: "ทบทวนราคา ช่วงเวลาที่เปิดขาย ห้องพักที่จัดสรร เงื่อนไขการยกเลิก การชำระเงิน ค่าคอมมิชชัน และการส่งคืนห้องที่กันไว้",
    bodyEn: "Review the rate, selling dates, allocated rooms, cancellation, payment, commission, and return of held rooms.",
    inputTh: "ราคาปัจจุบัน เงื่อนไขที่มีอยู่ ช่วงที่ต้องการยอดขาย",
    inputEn: "Current rates, existing terms, dates that need sales",
    outputTh: "กรอบราคาและเงื่อนไขที่โรงแรมเข้าใจก่อนเริ่มขาย",
    outputEn: "A rate and terms frame the hotel understands before selling starts",
  },
  {
    id: "sales-material",
    kicker: "Sales Material",
    titleTh: "รวบรวมข้อมูลสินค้า",
    titleEn: "Gather the product facts",
    bodyTh: "ช่วยรวบรวมข้อมูลสินค้า ประสานเงื่อนไขกับพาร์ตเนอร์ และเตรียมงานที่ต้องใช้ในการเริ่มขาย",
    bodyEn: "Help gather product facts, align conditions with the partner, and prepare what is needed to start selling.",
    inputTh: "ข้อมูลห้อง ราคา ช่วงขาย เงื่อนไขที่โรงแรมอนุมัติ",
    inputEn: "Room facts, rates, selling dates, hotel-approved terms",
    outputTh: "ชุดข้อมูลสินค้าที่พร้อมส่งให้พาร์ตเนอร์หลังโรงแรมอนุมัติ",
    outputEn: "A product pack ready for the partner after the hotel approves",
  },
  {
    id: "partner-outreach",
    kicker: "Partner Outreach",
    titleTh: "คัดเลือกและประสานพาร์ตเนอร์",
    titleEn: "Choose and introduce partners",
    bodyTh: "ค้นหาพาร์ตเนอร์ที่เกี่ยวข้องจากเครือข่ายของเรา และพิจารณาว่าแต่ละรายเข้าถึงตลาดหรือลูกค้าประเภทใด ก่อนเริ่มพูดคุยเรื่องความร่วมมือกับโรงแรม",
    bodyEn:
      "Find relevant partners from our network and see which market or guest type each one reaches, before any cooperation talk with the hotel.",
    inputTh: "ตลาดที่โรงแรมต้องการ และข้อจำกัดของโรงแรม",
    inputEn: "The market the hotel needs, and the hotel’s limits",
    outputTh: "รายชื่อพาร์ตเนอร์ที่ผ่านการคัดจากความเหมาะสม ไม่ใช่รายชื่อยาวที่สุด",
    outputEn: "Partners chosen for fit, not the longest list",
  },
  {
    id: "follow-up",
    kicker: "Follow-up",
    titleTh: "อัปเดตสินค้าและติดตามเอเจนต์",
    titleEn: "Product updates and agent follow-up",
    bodyTh: "วางจังหวะการอัปเดตสินค้า และการติดตามกับเอเจนต์อย่างต่อเนื่อง ไม่ปล่อยให้สัญญาอยู่เฉยโดยไม่มีงานขาย",
    bodyEn: "Keep product updates and agent follow-up on a rhythm, so a signed contract is not left without selling work.",
    inputTh: "สินค้าที่เปลี่ยน ช่วงขาย การตอบกลับจากพาร์ตเนอร์",
    inputEn: "Product changes, selling dates, partner replies",
    outputTh: "รอบการติดตามที่โรงแรมเห็นว่าใครยังทำงานอยู่",
    outputEn: "A follow-up cycle that shows who is still working",
  },
  {
    id: "booking-coordination",
    kicker: "Booking Coordination",
    titleTh: "ประสานสัญญาและการเริ่มขาย",
    titleEn: "Coordinate the contract and the start of sales",
    bodyTh: "ช่วยประสานข้อมูล สัญญา ขั้นตอนเริ่มขาย และการเชื่อมต่อที่จำเป็นกับทีมโรงแรม โดยโรงแรมเป็นผู้พิจารณาและอนุมัติข้อตกลงก่อนลงนาม",
    bodyEn:
      "Help gather facts, align the agreement, and prepare the start of sales. The hotel reviews and approves the agreement before signing.",
    inputTh: "ร่างเงื่อนไข ข้อมูลสินค้า ทีมที่ต้องรับงานจอง",
    inputEn: "Draft terms, product facts, the team that will take bookings",
    outputTh: "ขั้นตอนเริ่มขายที่โรงแรมอนุมัติแล้ว",
    outputEn: "A start-of-sales path the hotel has approved",
  },
  {
    id: "performance-review",
    kicker: "Performance Review",
    titleTh: "ติดตามว่าพาร์ตเนอร์สร้างยอดขายจริงไหม",
    titleEn: "Review whether the partner actually sells",
    bodyTh: "ดูจำนวนคืนห้องพัก รายได้ ช่วงวันที่จอง ตลาดต้นทาง และการใช้ห้องที่จัดสรรไว้ เพื่อทบทวนว่าควรขยาย ปรับเงื่อนไข หรือหยุดความร่วมมือรายใด",
    bodyEn:
      "Look at room nights, revenue, booked dates, source market, and use of allocated rooms, then decide whether to grow, change terms, or stop a relationship.",
    inputTh: "ยอดจอง การใช้ห้องที่จัดสรร ต้นทุนช่องทาง",
    inputEn: "Bookings, use of allocated rooms, channel cost",
    outputTh: "มติว่าควรทำต่อ ปรับเงื่อนไข หรือเปลี่ยนพาร์ตเนอร์",
    outputEn: "A decision to continue, change terms, or re-order partners",
  },
] as const;

export const B2B_FUNNEL_STEPS = [
  { id: "fit", number: "01", labelEn: "Partner Fit", labelTh: "ความเหมาะสม" },
  { id: "outreach", number: "02", labelEn: "Partner Outreach", labelTh: "ประสานพาร์ตเนอร์" },
  { id: "rate", number: "03", labelEn: "Rate & Commission", labelTh: "ราคาและค่าคอม" },
  { id: "material", number: "04", labelEn: "Sales Material", labelTh: "ข้อมูลสินค้า" },
  { id: "booking", number: "05", labelEn: "Booking Coordination", labelTh: "เริ่มขาย" },
  { id: "follow", number: "06", labelEn: "Follow-up", labelTh: "ติดตาม" },
  { id: "review", number: "07", labelEn: "Performance Review", labelTh: "ทบทวนผล" },
] as const;

export const B2B_KPIS: B2bKpi[] = [
  {
    id: "room-nights",
    name: "Room Nights",
    definitionTh: "จำนวนคืนห้องพักที่ขายได้ผ่านพาร์ตเนอร์ที่ทบทวน",
    definitionEn: "Room nights sold through the partners under review",
    unit: "index",
    periodTh: "ตัวอย่าง Period 1–4",
    periodEn: "Sample period 1–4",
    comparisonTh: "เทียบกับเงื่อนไขที่ตกลงไว้ ไม่ใช่เป้าหมายที่รับประกัน",
    comparisonEn: "Compared with the agreed conditions, not a guaranteed target",
    dataStatus: "Sample",
    labels: ["Period 1", "Period 2", "Period 3", "Period 4"],
    values: [8, 11, 9, 14],
  },
  {
    id: "revenue",
    name: "Revenue",
    definitionTh: "รายได้จากแต่ละพาร์ตเนอร์ ในชุดข้อมูลตัวอย่าง",
    definitionEn: "Revenue from each partner in the sample set",
    unit: "index",
    periodTh: "ตัวอย่าง Period 1–4",
    periodEn: "Sample period 1–4",
    comparisonTh: "เทียบกับช่องทางอื่นในภาพเดียวกัน",
    comparisonEn: "Compared with other channels in the same picture",
    dataStatus: "Sample",
    labels: ["Period 1", "Period 2", "Period 3", "Period 4"],
    values: [7, 10, 8, 13],
  },
  {
    id: "net-contribution",
    name: "Net Contribution",
    definitionTh: "รายได้หลังหักต้นทุนและค่าคอมมิชชัน ในชุดข้อมูลตัวอย่าง",
    definitionEn: "Revenue after cost and commission in the sample set",
    unit: "index",
    periodTh: "ตัวอย่าง Period 1–4",
    periodEn: "Sample period 1–4",
    comparisonTh: "เทียบกับรายได้ก่อนต้นทุนช่องทาง",
    comparisonEn: "Compared with revenue before channel cost",
    dataStatus: "Sample",
    labels: ["Period 1", "Period 2", "Period 3", "Period 4"],
    values: [5, 8, 6, 10],
  },
  {
    id: "allotment",
    name: "Performance vs Allotment",
    definitionTh: "ผลลัพธ์เทียบกับห้องที่จัดสรรไว้",
    definitionEn: "Result against rooms held for the partner",
    unit: "% index",
    periodTh: "ตัวอย่าง Period 1–4",
    periodEn: "Sample period 1–4",
    comparisonTh: "เทียบกับห้องที่กันไว้ตามเงื่อนไข",
    comparisonEn: "Compared with rooms held under the agreed terms",
    dataStatus: "Sample",
    labels: ["Period 1", "Period 2", "Period 3", "Period 4"],
    values: [42, 55, 48, 61],
  },
];

export function b2bSampleLabel(locale: Locale) {
  return locale === "th" ? B2B_SAMPLE_LABEL.th : B2B_SAMPLE_LABEL.en;
}

export function b2bScopeCopy(locale: Locale) {
  return B2B_SCOPE_ITEMS.map((item) => ({
    id: item.id,
    kicker: item.kicker,
    title: locale === "th" ? item.titleTh : item.titleEn,
    body: locale === "th" ? item.bodyTh : item.bodyEn,
    input: locale === "th" ? item.inputTh : item.inputEn,
    output: locale === "th" ? item.outputTh : item.outputEn,
  }));
}

export function b2bFunnelCopy(locale: Locale) {
  return B2B_FUNNEL_STEPS.map((step) => ({
    ...step,
    label: locale === "th" ? step.labelTh : step.labelEn,
  }));
}

export function b2bReadinessCopy(locale: Locale) {
  const thai = locale === "th";
  return B2B_READINESS_ITEMS.map((item) => ({
    id: item.id,
    check: thai ? item.checkTh : item.checkEn,
    why: thai ? item.whyTh : item.whyEn,
    output: thai ? item.outputTh : item.outputEn,
  }));
}

export function b2bFrameworkCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: "B2B Sales Readiness Framework",
    columns: {
      area: thai ? B2B_FRAMEWORK_COLUMNS.area.th : B2B_FRAMEWORK_COLUMNS.area.en,
      problem: thai ? B2B_FRAMEWORK_COLUMNS.problem.th : B2B_FRAMEWORK_COLUMNS.problem.en,
      prepare: thai ? B2B_FRAMEWORK_COLUMNS.prepare.th : B2B_FRAMEWORK_COLUMNS.prepare.en,
      output: thai ? B2B_FRAMEWORK_COLUMNS.output.th : B2B_FRAMEWORK_COLUMNS.output.en,
    },
    rows: B2B_FRAMEWORK_ROWS.map((row) => ({
      id: row.id,
      area: row.area,
      problem: thai ? row.problemTh : row.problemEn,
      prepare: thai ? row.prepareTh : row.prepareEn,
      output: thai ? row.outputTh : row.outputEn,
    })),
  };
}
