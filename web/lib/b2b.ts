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
  value?: string;
  updatedAt?: string;
};

export type B2bFunnelMarker = "path" | "target" | "review" | "risk";

export const B2B_FUNNEL_COLORS = {
  path: "#A2DC25",
  target: "#EBE722",
  review: "#EBE722",
  risk: "#C4A35A",
} as const;

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

export const B2B_SERVICE_COLUMNS = {
  area: { th: "พื้นที่งาน", en: "Service Area" },
  action: { th: "สิ่งที่เราทำ", en: "What we do" },
  input: { th: "Input", en: "Input" },
  output: { th: "สิ่งที่ได้", en: "Output" },
  owner: { th: "ผู้รับผิดชอบหรือจุดอนุมัติ", en: "Owner or approval point" },
} as const;

export const B2B_SERVICE_SECTION = {
  kicker: "Service Matrix",
  expand: { th: "ดูรายละเอียด", en: "Show details" },
  collapse: { th: "ซ่อนรายละเอียด", en: "Hide details" },
  related: { th: "หน้าที่เกี่ยวข้อง", en: "Related page" },
} as const;

export const B2B_SCOPE_ITEMS = [
  {
    id: "partner-mapping",
    area: "Partner Mapping",
    actionTh:
      "ดูขนาดโรงแรม กลุ่มลูกค้า ฤดูกาล ห้องว่าง และช่องทางขายที่มีอยู่ แล้วค้นหาพาร์ตเนอร์ที่เกี่ยวข้องจากเครือข่าย",
    actionEn:
      "Look at hotel size, guest mix, season, empty dates, and current channels, then find relevant partners from the network",
    inputTh: "จำนวนห้อง ตลาดหลัก ฤดูกาล ช่องทางปัจจุบัน",
    inputEn: "Rooms, main markets, season, current channels",
    outputTh: "Target Partner List",
    outputEn: "Target Partner List",
    ownerTh: "เดอะ เคพีไอ พลัส ร่วมกับโรงแรม",
    ownerEn: "The KPI Plus with the hotel",
    ownerKind: "shared" as const,
    href: "",
    linkLabelTh: "",
    linkLabelEn: "",
  },
  {
    id: "rate-commission",
    area: "Rate & Commission",
    actionTh: "ทบทวนราคา ช่วงเวลาที่เปิดขาย ห้องพักที่จัดสรร เงื่อนไขการยกเลิก การชำระเงิน ค่าคอมมิชชัน และการส่งคืนห้องที่กันไว้",
    actionEn: "Review the rate, selling dates, allocated rooms, cancellation, payment, commission, and return of held rooms.",
    inputTh: "ราคาปัจจุบัน เงื่อนไขที่มีอยู่ ช่วงที่ต้องการยอดขาย",
    inputEn: "Current rates, existing terms, dates that need sales",
    outputTh: "B2B Rate Sheet",
    outputEn: "B2B Rate Sheet",
    ownerTh: "โรงแรมอนุมัติราคาสุดท้ายและค่าคอมมิชชัน",
    ownerEn: "The hotel approves the final rate and commission",
    ownerKind: "hotel" as const,
    href: "/solutions/revenue-commercial-management",
    linkLabelTh: "บริหารรายได้และกลยุทธ์การขาย",
    linkLabelEn: "Revenue & Commercial Management",
  },
  {
    id: "sales-material",
    area: "Sales Material",
    actionTh: "ช่วยรวบรวมข้อมูลสินค้า ประสานเงื่อนไขกับพาร์ตเนอร์ และเตรียมงานที่ต้องใช้ในการเริ่มขาย",
    actionEn: "Help gather product facts, align conditions with the partner, and prepare what is needed to start selling.",
    inputTh: "ข้อมูลห้อง ราคา ช่วงขาย เงื่อนไขที่โรงแรมอนุมัติ",
    inputEn: "Room facts, rates, selling dates, hotel-approved terms",
    outputTh: "B2B Sales Kit",
    outputEn: "B2B Sales Kit",
    ownerTh: "โรงแรมอนุมัติชุดข้อมูลขาย",
    ownerEn: "The hotel approves the sales kit",
    ownerKind: "hotel" as const,
    href: "",
    linkLabelTh: "",
    linkLabelEn: "",
  },
  {
    id: "outreach-follow-up",
    area: "Outreach & Follow-up",
    actionTh:
      "คัดเลือกและประสานพาร์ตเนอร์จากเครือข่าย แล้ววางจังหวะการอัปเดตสินค้าและการติดตามกับเอเจนต์อย่างต่อเนื่อง",
    actionEn:
      "Choose and introduce partners from the network, then keep product updates and agent follow-up on a rhythm",
    inputTh: "ตลาดที่โรงแรมต้องการ สินค้าที่เปลี่ยน การตอบกลับจากพาร์ตเนอร์",
    inputEn: "The market the hotel needs, product changes, partner replies",
    outputTh: "Partner Pipeline",
    outputEn: "Partner Pipeline",
    ownerTh: "เดอะ เคพีไอ พลัส อาจช่วยประสาน โรงแรมอนุมัติความร่วมมือ",
    ownerEn: "The KPI Plus may support outreach. The hotel approves cooperation",
    ownerKind: "hotel" as const,
    href: "",
    linkLabelTh: "",
    linkLabelEn: "",
  },
  {
    id: "booking-coordination",
    area: "Booking Coordination",
    actionTh:
      "ช่วยประสานข้อมูล สัญญา ขั้นตอนเริ่มขาย และการเชื่อมต่อที่จำเป็นกับทีมโรงแรม โดยโรงแรมเป็นผู้พิจารณาและอนุมัติข้อตกลงก่อนลงนาม",
    actionEn:
      "Help gather facts, align the agreement, and prepare the start of sales. The hotel reviews and approves the agreement before signing.",
    inputTh: "ร่างเงื่อนไข ข้อมูลสินค้า ทีมที่ต้องรับงานจอง",
    inputEn: "Draft terms, product facts, the team that will take bookings",
    outputTh: "Booking Summary",
    outputEn: "Booking Summary",
    ownerTh: "โรงแรมพิจารณาและอนุมัติข้อตกลงก่อนลงนาม",
    ownerEn: "The hotel reviews and approves the agreement before signing",
    ownerKind: "hotel" as const,
    href: "/solutions/outsourced-hotel-reservations",
    linkLabelTh: "บริการทีมรับจองสำหรับโรงแรม",
    linkLabelEn: "Outsourced Reservation Management",
  },
  {
    id: "performance-review",
    area: "Performance Review",
    actionTh:
      "ดูจำนวนคืนห้องพัก รายได้ ช่วงวันที่จอง ตลาดต้นทาง และการใช้ห้องที่จัดสรรไว้ เพื่อทบทวนว่าควรขยาย ปรับเงื่อนไข หรือหยุดความร่วมมือรายใด",
    actionEn:
      "Look at room nights, revenue, booked dates, source market, and use of allocated rooms, then decide whether to grow, change terms, or stop a relationship.",
    inputTh: "ยอดจอง การใช้ห้องที่จัดสรร ต้นทุนช่องทาง",
    inputEn: "Bookings, use of allocated rooms, channel cost",
    outputTh: "B2B Performance Report",
    outputEn: "B2B Performance Report",
    ownerTh: "เดอะ เคพีไอ พลัส ร่วมกับโรงแรม",
    ownerEn: "The KPI Plus with the hotel",
    ownerKind: "shared" as const,
    href: "/solutions/revenue-commercial-management",
    linkLabelTh: "บริหารรายได้และกลยุทธ์การขาย",
    linkLabelEn: "Revenue & Commercial Management",
  },
] as const;

export const B2B_FUNNEL_VISUAL_CANDIDATE = "/images/b2b-agent-sales-funnel-placeholder.webp";

export const B2B_FUNNEL_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างลำดับงานขาย B2B จากพาร์ตเนอร์ที่เป็นไปได้ไปสู่การจองที่วัดผลได้",
    en: "Sample B2B agent sales funnel from a potential partner to a measurable booking",
  },
  label: {
    th: "B2B Agent Sales Funnel · Sample data",
    en: "B2B Agent Sales Funnel · Sample data",
  },
  meta: {
    th: "Sample data · Path from partner lead to booking review",
    en: "Sample data · Path from partner lead to booking review",
  },
  caption: {
    th: "ลำดับงานขาย ไม่ใช่บอร์ด CRM หรือผลงานพาร์ตเนอร์รายใด",
    en: "A sales path, not a CRM board or one partner’s results",
  },
  sample: {
    th: "ตัวอย่างข้อมูล",
    en: "Sample data",
  },
} as const;

export const B2B_FUNNEL_SECTION = {
  title: {
    th: "ลำดับงานขายผ่านเอเจนต์",
    en: "Agent Sales Funnel",
  },
  lead: {
    th: "จากพาร์ตเนอร์ที่เป็นไปได้ ไปสู่ผลลัพธ์การจองที่วัดได้",
    en: "From a potential partner to a measurable booking outcome",
  },
} as const;

export const B2B_FUNNEL_STEPS = [
  {
    id: "partner-leads",
    number: "01",
    marker: "path" as const,
    labelEn: "Partner Leads",
    labelTh: "Partner Leads",
    definitionTh: "รายชื่อพาร์ตเนอร์ที่เริ่มพิจารณา ให้เข้ากับตลาดของโรงแรม",
    definitionEn: "Partners first brought in for review against the hotel’s market",
    outputTh: "Partner Lead List",
    outputEn: "Partner Lead List",
    kpiId: "partner-leads",
    kpiName: "Partner Leads",
  },
  {
    id: "qualified",
    number: "02",
    marker: "path" as const,
    labelEn: "Qualified Partner",
    labelTh: "Qualified Partner",
    definitionTh: "พาร์ตเนอร์ที่ผ่านเกณฑ์ตลาด สินค้า และรูปแบบการขาย",
    definitionEn: "A partner that fits the market, the product, and the way the hotel sells",
    outputTh: "Qualified Partner Record",
    outputEn: "Qualified Partner Record",
    kpiId: "qualified-count",
    kpiName: "Qualified Partner Count",
  },
  {
    id: "rate-contract",
    number: "03",
    marker: "target" as const,
    labelEn: "Rate / Contract Ready",
    labelTh: "Rate / Contract Ready",
    definitionTh: "ราคา เงื่อนไข และร่างข้อตกลงพร้อมให้โรงแรมพิจารณา",
    definitionEn: "Rates, terms, and a draft agreement ready for the hotel to review",
    outputTh: "Rate Sheet / Contract Pack",
    outputEn: "Rate Sheet / Contract Pack",
    kpiId: "",
    kpiName: "",
  },
  {
    id: "active",
    number: "04",
    marker: "path" as const,
    labelEn: "Active Partner",
    labelTh: "Active Partner",
    definitionTh: "พาร์ตเนอร์ที่โรงแรมอนุมัติแล้วและเริ่มขายได้",
    definitionEn: "A partner the hotel has approved and that can start selling",
    outputTh: "Active Partner List",
    outputEn: "Active Partner List",
    kpiId: "active-count",
    kpiName: "Active Partner Count",
  },
  {
    id: "booking",
    number: "05",
    marker: "path" as const,
    labelEn: "Booking / Room Night",
    labelTh: "Booking / Room Night",
    definitionTh: "การจองที่โยงกับคืนห้องพักและรายได้ที่วัดได้",
    definitionEn: "A booking tied to room nights and revenue the hotel can measure",
    outputTh: "Booking / Room Night Record",
    outputEn: "Booking / Room Night Record",
    kpiId: "booking-conversion",
    kpiName: "Booking Conversion",
    extraKpis: [{ id: "room-nights", name: "Room Nights from B2B" }] as const,
  },
  {
    id: "review",
    number: "06",
    marker: "review" as const,
    labelEn: "Review & Follow-up",
    labelTh: "Review & Follow-up",
    definitionTh: "ทบทวนผลงาน แล้วกำหนดว่าจะทำต่อ ปรับเงื่อนไข หรือหยุด",
    definitionEn: "Review the result, then decide whether to continue, change terms, or stop",
    outputTh: "Review Notes / Next Action",
    outputEn: "Review Notes / Next Action",
    kpiId: "revenue-by-partner",
    kpiName: "Revenue by Partner",
  },
] as const;

export const B2B_WORKFLOW_VISUAL_CANDIDATE = "/images/b2b-agent-sales-workflow-placeholder.webp";

export const B2B_WORKFLOW_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 640,
  displayHeight: 360,
  alt: {
    th: "ตัวอย่างลำดับงานขายผ่านพาร์ตเนอร์ แสดงการส่งต่องานและสิ่งที่ได้ในแต่ละขั้น",
    en: "Sample B2B partner sales workflow showing handoff and output at each step",
  },
  label: {
    th: "B2B Partner Sales Workflow — Sample process",
    en: "B2B Partner Sales Workflow — Sample process",
  },
  meta: {
    th: "Sample process · Handoff and output",
    en: "Sample process · Handoff and output",
  },
  caption: {
    th: "แผนภาพการส่งต่องานและสิ่งที่ได้ ไม่ใช่รูปประชุมทั่วไป",
    en: "A handoff and output path, not a generic meeting photo",
  },
  sample: {
    th: "ตัวอย่างกระบวนการ",
    en: "Sample process",
  },
} as const;

export const B2B_WORKFLOW_SECTION = {
  title: {
    th: "วิธีที่เราทำงานร่วมกับโรงแรม",
    en: "How the work runs",
  },
  lead: {
    th: "งานขายผ่านพาร์ตเนอร์เดินเป็นลำดับ จากภาพโรงแรมไปสู่การทบทวนยอดจอง โดยโรงแรมเป็นผู้อนุมัติข้อตกลง",
    en: "Partner sales work runs in sequence, from the hotel picture to a booking review. The hotel approves the agreement.",
  },
} as const;

export const B2B_WORKFLOW_BOUNDARY = {
  kicker: "Responsibility boundary",
  note: {
    th: "ขอบเขตจริงขึ้นกับข้อตกลงของแต่ละโรงแรม รายการนี้คืองานที่อาจอยู่ในบริการ ไม่ใช่นโยบายที่ใช้กับทุกสัญญา",
    en: "The live split follows each hotel’s agreement. This list is work that may sit in the service. It is not a policy for every contract.",
  },
  supportTitle: {
    th: "เดอะ เคพีไอ พลัส อาจช่วย",
    en: "The KPI Plus may support",
  },
  approveTitle: {
    th: "โรงแรมอาจอนุมัติ",
    en: "The hotel may approve",
  },
  support: [
    "Partner Mapping",
    "Sales Material",
    "Rate / Commission Structure",
    "Outreach and Follow-up",
    "Performance Review",
  ] as const,
  approve: [
    "Final Rate",
    "Contract Terms",
    "Commission Policy",
    "Inventory / Availability",
    "Guest Exceptions",
  ] as const,
} as const;

export const B2B_WORKFLOW_STEPS = [
  {
    id: "understand",
    number: "01",
    titleEn: "Understand hotel and market",
    titleTh: "Understand hotel and market",
    ownerTh: "เดอะ เคพีไอ พลัส ร่วมกับโรงแรม",
    ownerEn: "The KPI Plus with the hotel",
    inputTh: "จำนวนห้อง ตลาดหลัก ฤดูกาล ช่องทางปัจจุบัน",
    inputEn: "Rooms, main markets, season, current channels",
    actionTh: "ดูขนาดโรงแรม กลุ่มลูกค้า ฤดูกาล ห้องว่าง และช่องทางขายที่มีอยู่",
    actionEn: "Look at hotel size, guest mix, season, empty dates, and current channels",
    outputTh: "Hotel & Market Profile",
    outputEn: "Hotel & Market Profile",
    escalationTh: "หาก B2B ยังไม่เหมาะตอนนี้ โรงแรมเป็นผู้ตัดสินใจว่าจะปรับช่องทางอื่นก่อนหรือไม่",
    escalationEn: "If B2B does not fit now, the hotel decides whether another channel should come first",
  },
  {
    id: "partner-profile",
    number: "02",
    titleEn: "Define Partner Profile",
    titleTh: "Define Partner Profile",
    ownerTh: "เดอะ เคพีไอ พลัส ร่วมกับโรงแรม",
    ownerEn: "The KPI Plus with the hotel",
    inputTh: "Hotel & Market Profile ตลาดที่โรงแรมต้องการ และข้อจำกัดของโรงแรม",
    inputEn: "Hotel & Market Profile, the market the hotel needs, and the hotel’s limits",
    actionTh: "กำหนดเกณฑ์พาร์ตเนอร์เป้าหมาย จากตลาด สินค้า และรูปแบบการขายของโรงแรม",
    actionEn: "Define target partner criteria from the hotel’s market, product, and way of selling",
    outputTh: "Target Agent Criteria",
    outputEn: "Target Agent Criteria",
    escalationTh: "ไม่ประสานพาร์ตเนอร์ที่ไม่ตรงตลาด เว้นแต่โรงแรมตัดสินใจให้ทำต่อ",
    escalationEn: "Partners that do not fit the market are not contacted unless the hotel decides to continue",
  },
  {
    id: "rate-material",
    number: "03",
    titleEn: "Prepare Rate and Sales Material",
    titleTh: "Prepare Rate and Sales Material",
    ownerTh: "เดอะ เคพีไอ พลัส เตรียม โรงแรมอนุมัติ",
    ownerEn: "The KPI Plus prepares. The hotel approves",
    inputTh: "ราคาปัจจุบัน เงื่อนไขที่มีอยู่ ช่วงที่ต้องการยอดขาย ข้อมูลห้อง",
    inputEn: "Current rates, existing terms, dates that need sales, room facts",
    actionTh: "ทบทวนราคา ช่วงเวลาที่เปิดขาย ห้องพักที่จัดสรร และรวบรวมข้อมูลสินค้า",
    actionEn: "Review the rate, selling dates, and allocated rooms, and gather the product facts",
    outputTh: "B2B Sales Kit",
    outputEn: "B2B Sales Kit",
    escalationTh: "ราคาสุดท้าย ค่าคอมมิชชัน และเงื่อนไขสัญญา ส่งให้โรงแรมอนุมัติ",
    escalationEn: "Final rate, commission, and contract terms go to the hotel for approval",
  },
  {
    id: "contact-follow-up",
    number: "04",
    titleEn: "Contact and Follow Up with Partners",
    titleTh: "Contact and Follow Up with Partners",
    ownerTh: "เดอะ เคพีไอ พลัส อาจช่วยประสาน โรงแรมอนุมัติความร่วมมือ",
    ownerEn: "The KPI Plus may support outreach. The hotel approves cooperation",
    inputTh: "Target Agent Criteria และ B2B Sales Kit หลังโรงแรมอนุมัติ",
    inputEn: "Target Agent Criteria and the B2B Sales Kit after the hotel approves",
    actionTh: "คัดเลือกและประสานพาร์ตเนอร์จากเครือข่าย แล้วติดตามงานขายอย่างต่อเนื่อง",
    actionEn: "Choose and introduce partners from the network, then keep follow-up on a rhythm",
    outputTh: "Partner Pipeline",
    outputEn: "Partner Pipeline",
    escalationTh: "โรงแรมเป็นผู้อนุมัติข้อตกลงและลงนามในสัญญาของตนเอง",
    escalationEn: "The hotel approves the agreement and signs its own contract",
  },
  {
    id: "review-plan",
    number: "05",
    titleEn: "Review Booking and Adjust Plan",
    titleTh: "Review Booking and Adjust Plan",
    ownerTh: "เดอะ เคพีไอ พลัส ร่วมกับโรงแรม",
    ownerEn: "The KPI Plus with the hotel",
    inputTh: "ยอดจอง การใช้ห้องที่จัดสรร ต้นทุนช่องทาง",
    inputEn: "Bookings, use of allocated rooms, channel cost",
    actionTh: "ดูจำนวนคืนห้องพัก รายได้ ช่วงวันที่จอง ตลาดต้นทาง และการใช้ห้องที่จัดสรรไว้",
    actionEn: "Look at room nights, revenue, booked dates, source market, and use of allocated rooms",
    outputTh: "B2B Performance Review",
    outputEn: "B2B Performance Review",
    escalationTh: "มติว่าควรทำต่อ ปรับเงื่อนไข หรือเปลี่ยนพาร์ตเนอร์ ทำร่วมกับโรงแรม",
    escalationEn: "A decision to continue, change terms, or re-order partners is made with the hotel",
  },
] as const;

export const B2B_KPI_VISUAL_CANDIDATE = "/images/b2b-agent-sales-kpi-placeholder.webp";

export const B2B_KPI_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างกรอบตัวชี้วัดงานขาย B2B ไม่ใช่ยอดจริงของโรงแรมหรือพาร์ตเนอร์รายใด",
    en: "Sample B2B agent sales KPI frame, not a live hotel or partner result",
  },
  label: {
    th: "B2B Agent Sales KPI · Sample data",
    en: "B2B Agent Sales KPI · Sample data",
  },
  meta: {
    th: "Sample data · 16:9 KPI frame",
    en: "Sample data · 16:9 KPI frame",
  },
  caption: {
    th: "กรอบตัวชี้วัดตัวอย่าง ไม่ใช่จำนวนพาร์ตเนอร์ อัตราแปลง คืนห้องพัก หรือรายได้จริง",
    en: "A sample KPI frame, not a live partner count, conversion rate, room-night, or revenue figure",
  },
  sample: {
    th: "ตัวอย่างข้อมูล",
    en: "Sample data",
  },
} as const;

export const B2B_KPI_SECTION = {
  kicker: "KPI and evidence",
  emptyDate: { th: "—", en: "—" },
} as const;

export const B2B_RELATED_VISUAL_CANDIDATE = "/images/b2b-agent-sales-related-content-placeholder.webp";

export const B2B_RELATED_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  fit: "contain" as const,
  width: 1200,
  height: 800,
  displayWidth: 520,
  displayHeight: 347,
  alt: {
    th: "ตัวอย่างเนื้อหาขาย B2B และงานพาร์ตเนอร์ ไม่ใช่รูปโรงแรมหรือผลงานลูกค้า",
    en: "Sample B2B sales and partner content, not a hotel photo or a client result",
  },
  label: {
    th: "B2B Sales / Partner Content",
    en: "B2B Sales / Partner Content",
  },
  meta: {
    th: "Sample visual · 3:2 partner content frame",
    en: "Sample visual · 3:2 partner content frame",
  },
  caption: {
    th: "กรอบเนื้อหาขาย B2B ไม่ใช่รายชื่อพาร์ตเนอร์หรือผลลัพธ์จริง",
    en: "A B2B sales content frame, not a partner list or a live result",
  },
  sample: {
    th: "ตัวอย่างข้อมูล",
    en: "Sample visual",
  },
} as const;

export const B2B_RELATED_VISUAL_OPTIONS = [
  { id: "partner-review", label: "Partner Review" },
  { id: "sales-report", label: "B2B Sales Report" },
  { id: "rate-sheet", label: "Rate Sheet Review" },
  { id: "sales-kit", label: "Sales Kit Workshop" },
  { id: "pipeline", label: "Agent Pipeline Review" },
] as const;

/** Serve only when a real approved team photo is uploaded. Never show this dummy path. */
export const B2B_TEAM_VISUAL_CANDIDATE = "/images/b2b-agent-sales-team-placeholder.webp";

export const B2B_TEAM_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  fit: "cover" as const,
  width: 1200,
  height: 800,
  displayWidth: 420,
  displayHeight: 280,
  label: "Replace with verified B2B Sales Team image",
} as const;

export const B2B_ENQUIRY = {
  kicker: "B2B & Agent Sales",
  receiveTitle: {
    th: "โรงแรมจะได้อะไรจากการเริ่มคุย",
    en: "What the hotel receives from starting the discussion",
  },
  nextTitle: {
    th: "What Happens Next",
    en: "What Happens Next",
  },
  receive: [
    {
      id: "partner-fit",
      title: "Partner Fit Review",
      th: "ทบทวนว่าพาร์ตเนอร์ประเภทใดเหมาะกับตลาดและรูปแบบการขายของโรงแรม",
      en: "Review which partner type fits the hotel’s market and way of selling",
    },
    {
      id: "rate-commission",
      title: "B2B Rate & Commission Review",
      th: "ทบทวนโครงสร้างราคาและค่าคอมมิชชันก่อนเริ่มขาย",
      en: "Review the rate structure and commission before selling starts",
    },
    {
      id: "sales-material",
      title: "Sales Material Checklist",
      th: "รายการเอกสารขายที่โรงแรมต้องมีก่อนประสานงาน",
      en: "The sales documents the hotel needs before outreach",
    },
    {
      id: "follow-up",
      title: "Partner Follow-up Plan",
      th: "แผนติดตามหลังเริ่มพูดคุยกับพาร์ตเนอร์",
      en: "A follow-up plan after partner conversations begin",
    },
  ],
  steps: {
    th: [
      "ส่งข้อมูลโรงแรมและตลาดที่ต้องการเจาะ",
      "ทีมงานตรวจสอบความพร้อม B2B",
      "กำหนด Partner Profile และขอบเขตงาน",
      "นัดคุย Action Plan และขั้นตอนถัดไป",
    ],
    en: [
      "Send hotel details and the market you want to reach",
      "The team reviews B2B readiness",
      "Set the Partner Profile and the work scope",
      "Arrange a conversation on the action plan and next steps",
    ],
  },
  heading: {
    th: "คุยเรื่องช่องทางพาร์ตเนอร์ของโรงแรม",
    en: "Talk through the hotel’s partner path",
  },
  lead: {
    th: "เริ่มคุยเรื่องงานขาย B2B เพื่อให้โรงแรมเห็นภาพ Partner Fit ราคา เอกสารขาย และการติดตาม โดยยังไม่ต้องมีรายชื่อพาร์ตเนอร์อยู่แล้ว",
    en: "Start a B2B agent sales discussion so the hotel can see partner fit, rates, sales material, and follow-up, without needing a partner list first.",
  },
  submit: {
    th: "ให้ทีมประเมินช่องทาง B2B ของโรงแรม",
    en: "Ask the team to review the hotel’s B2B path",
  },
  fields: {
    th: {
      market: "ตลาดหรือเซ็กเมนต์ที่ต้องการเจาะ",
      marketHint: "เช่น ตลาดต้นทาง หรือกลุ่มลูกค้าที่โรงแรมต้องการ",
      channels: "ช่องทาง B2B ที่มีอยู่",
      channelsHint: "เช่น เอเจนต์, wholesaler หรือยังไม่มี",
      rate: "เรื่องราคา / ค่าคอมมิชชัน",
      rateHint: "เช่น โครงสร้างราคา หรือเงื่อนไขคอมมิชชันที่อยากทบทวน",
      challenge: "ความท้าทายปัจจุบัน",
      challengeHint: "บอกสั้น ๆ ว่าติดตรงไหน",
      loading: "กำลังส่งข้อมูล กรุณารอสักครู่",
    },
    en: {
      market: "Target market or segment",
      marketHint: "For example a source market or guest type the hotel needs",
      channels: "Existing B2B channels",
      channelsHint: "For example agents, wholesalers, or none yet",
      rate: "Rate / commission topic",
      rateHint: "For example the rate structure or commission terms to review",
      challenge: "Current challenge",
      challengeHint: "A short note on where the work is stuck",
      loading: "Sending your message. Please wait.",
    },
  },
} as const;

export function b2bEnquiryCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: B2B_ENQUIRY.kicker,
    heading: thai ? B2B_ENQUIRY.heading.th : B2B_ENQUIRY.heading.en,
    lead: thai ? B2B_ENQUIRY.lead.th : B2B_ENQUIRY.lead.en,
    submit: thai ? B2B_ENQUIRY.submit.th : B2B_ENQUIRY.submit.en,
    receiveTitle: thai ? B2B_ENQUIRY.receiveTitle.th : B2B_ENQUIRY.receiveTitle.en,
    nextTitle: thai ? B2B_ENQUIRY.nextTitle.th : B2B_ENQUIRY.nextTitle.en,
    receive: B2B_ENQUIRY.receive.map((item) => ({
      id: item.id,
      title: item.title,
      body: thai ? item.th : item.en,
    })),
    steps: thai ? [...B2B_ENQUIRY.steps.th] : [...B2B_ENQUIRY.steps.en],
    fields: thai ? B2B_ENQUIRY.fields.th : B2B_ENQUIRY.fields.en,
  };
}

export const B2B_KPIS: B2bKpi[] = [
  {
    id: "qualified-count",
    name: "Qualified Partner Count",
    definitionTh: "จำนวนพาร์ตเนอร์ที่ผ่านเกณฑ์ตลาด สินค้า และรูปแบบการขาย",
    definitionEn: "Partners that passed market, product, and sales-fit review",
    unit: "partners",
    periodTh: "",
    periodEn: "",
    comparisonTh: "",
    comparisonEn: "",
    dataStatus: "Sample",
    labels: [],
    values: [],
    value: "",
    updatedAt: "",
  },
  {
    id: "active-count",
    name: "Active Partner Count",
    definitionTh: "จำนวนพาร์ตเนอร์ที่โรงแรมอนุมัติแล้วและเริ่มขายได้",
    definitionEn: "Partners the hotel has approved and that can start selling",
    unit: "partners",
    periodTh: "",
    periodEn: "",
    comparisonTh: "",
    comparisonEn: "",
    dataStatus: "Sample",
    labels: [],
    values: [],
    value: "",
    updatedAt: "",
  },
  {
    id: "partner-conversion",
    name: "Partner Conversion Rate",
    definitionTh: "สัดส่วนพาร์ตเนอร์ที่ผ่านการพิจารณาแล้วกลายเป็นพาร์ตเนอร์ที่ขายได้ เมื่อโรงแรมมีข้อมูล",
    definitionEn: "Share of reviewed partners that become able to sell, once the hotel has the data",
    unit: "%",
    periodTh: "",
    periodEn: "",
    comparisonTh: "",
    comparisonEn: "",
    dataStatus: "Sample",
    labels: [],
    values: [],
    value: "",
    updatedAt: "",
  },
  {
    id: "booking-conversion",
    name: "Booking Conversion",
    definitionTh: "สัดส่วนการจองที่กลายเป็นคืนห้องพักที่วัดได้",
    definitionEn: "Share of bookings that become measurable room nights",
    unit: "%",
    periodTh: "",
    periodEn: "",
    comparisonTh: "",
    comparisonEn: "",
    dataStatus: "Sample",
    labels: [],
    values: [],
    value: "",
    updatedAt: "",
  },
  {
    id: "room-nights",
    name: "Room Nights from B2B",
    definitionTh: "จำนวนคืนห้องพักที่ขายได้ผ่านพาร์ตเนอร์ B2B ที่ทบทวน",
    definitionEn: "Room nights sold through the B2B partners under review",
    unit: "room nights",
    periodTh: "",
    periodEn: "",
    comparisonTh: "",
    comparisonEn: "",
    dataStatus: "Sample",
    labels: [],
    values: [],
    value: "",
    updatedAt: "",
  },
  {
    id: "revenue-by-partner",
    name: "Revenue by Partner",
    definitionTh: "รายได้ที่โยงกับแต่ละพาร์ตเนอร์ในชุดที่ทบทวน",
    definitionEn: "Revenue attributed to each partner in the review set",
    unit: "THB",
    periodTh: "",
    periodEn: "",
    comparisonTh: "",
    comparisonEn: "",
    dataStatus: "Sample",
    labels: [],
    values: [],
    value: "",
    updatedAt: "",
  },
  {
    id: "average-booking-value",
    name: "Average Booking Value",
    definitionTh: "มูลค่าเฉลี่ยของการจอง B2B ในช่วงที่ทบทวน เมื่อโรงแรมมีข้อมูล",
    definitionEn: "Average value of B2B bookings in the review period, when the hotel has the data",
    unit: "THB",
    periodTh: "",
    periodEn: "",
    comparisonTh: "",
    comparisonEn: "",
    dataStatus: "Sample",
    labels: [],
    values: [],
    value: "",
    updatedAt: "",
  },
  {
    id: "repeat-booking-rate",
    name: "Repeat Booking Rate",
    definitionTh: "สัดส่วนการจอง B2B ที่กลับมาจองซ้ำ เมื่อโรงแรมมีข้อมูล",
    definitionEn: "Share of B2B bookings that come from a partner booking again, when the hotel has the data",
    unit: "%",
    periodTh: "",
    periodEn: "",
    comparisonTh: "",
    comparisonEn: "",
    dataStatus: "Sample",
    labels: [],
    values: [],
    value: "",
    updatedAt: "",
  },
];

export function b2bSampleLabel(locale: Locale) {
  return locale === "th" ? B2B_SAMPLE_LABEL.th : B2B_SAMPLE_LABEL.en;
}

export function b2bShowsSampleBadge(status?: string) {
  return status !== "approved" && status !== "real";
}

export type B2bScopeOwnerKind = "shared" | "hotel";

export type B2bServiceRow = {
  id: string;
  area: string;
  action: string;
  input: string;
  output: string;
  owner: string;
  ownerKind: B2bScopeOwnerKind;
  href: string;
  linkLabel: string;
};

export function b2bScopeCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: B2B_SERVICE_SECTION.kicker,
    expand: thai ? B2B_SERVICE_SECTION.expand.th : B2B_SERVICE_SECTION.expand.en,
    collapse: thai ? B2B_SERVICE_SECTION.collapse.th : B2B_SERVICE_SECTION.collapse.en,
    related: thai ? B2B_SERVICE_SECTION.related.th : B2B_SERVICE_SECTION.related.en,
    columns: {
      area: thai ? B2B_SERVICE_COLUMNS.area.th : B2B_SERVICE_COLUMNS.area.en,
      action: thai ? B2B_SERVICE_COLUMNS.action.th : B2B_SERVICE_COLUMNS.action.en,
      input: thai ? B2B_SERVICE_COLUMNS.input.th : B2B_SERVICE_COLUMNS.input.en,
      output: thai ? B2B_SERVICE_COLUMNS.output.th : B2B_SERVICE_COLUMNS.output.en,
      owner: thai ? B2B_SERVICE_COLUMNS.owner.th : B2B_SERVICE_COLUMNS.owner.en,
    },
    rows: B2B_SCOPE_ITEMS.map((item) => ({
      id: item.id,
      area: item.area,
      action: thai ? item.actionTh : item.actionEn,
      input: thai ? item.inputTh : item.inputEn,
      output: thai ? item.outputTh : item.outputEn,
      owner: thai ? item.ownerTh : item.ownerEn,
      ownerKind: item.ownerKind,
      href: item.href,
      linkLabel: thai ? item.linkLabelTh : item.linkLabelEn,
    })) satisfies B2bServiceRow[],
  };
}

export function b2bFunnelCopy(locale: Locale) {
  const thai = locale === "th";
  return B2B_FUNNEL_STEPS.map((step) => ({
    id: step.id,
    number: step.number,
    marker: step.marker,
    label: thai ? step.labelTh : step.labelEn,
    definition: thai ? step.definitionTh : step.definitionEn,
    output: thai ? step.outputTh : step.outputEn,
    kpiId: step.kpiId,
    kpiName: step.kpiName,
    extraKpis: "extraKpis" in step ? step.extraKpis.map((item) => ({ ...item })) : [],
  }));
}

export function b2bRealKpi(kpis: B2bKpi[], id: string, locale: Locale) {
  if (!id) return null;
  const kpi = kpis.find((item) => item.id === id);
  if (!kpi) return null;
  if (kpi.dataStatus !== "Approved" && kpi.dataStatus !== "Anonymised") return null;
  const period = (locale === "th" ? kpi.periodTh || kpi.periodEn : kpi.periodEn || kpi.periodTh).trim();
  const comparison = (locale === "th" ? kpi.comparisonTh || kpi.comparisonEn : kpi.comparisonEn || kpi.comparisonTh).trim();
  if (!kpi.unit.trim() || !period) return null;
  const display = kpi.value?.trim() || lastFiniteValue(kpi.values);
  if (!display) return null;
  return { ...kpi, display, period, comparison };
}

export type B2bEvidenceKpi = B2bKpi & {
  display: string;
  period: string;
  comparison: string;
  definition: string;
  updatedLabel: string;
};

export function b2bHasApprovedEvidence(kpis: B2bKpi[]) {
  return b2bEvidenceKpis(kpis, "en").length > 0;
}

export function b2bEvidenceKpis(kpis: B2bKpi[], locale: Locale): B2bEvidenceKpi[] {
  const thai = locale === "th";
  return kpis.flatMap((kpi) => {
    if (kpi.dataStatus !== "Approved" && kpi.dataStatus !== "Anonymised") return [];
    const period = (thai ? kpi.periodTh || kpi.periodEn : kpi.periodEn || kpi.periodTh).trim();
    const definition = (thai ? kpi.definitionTh || kpi.definitionEn : kpi.definitionEn || kpi.definitionTh).trim();
    const comparison = (thai ? kpi.comparisonTh || kpi.comparisonEn : kpi.comparisonEn || kpi.comparisonTh).trim();
    if (!kpi.name.trim() || !period || (!kpi.unit.trim() && !definition)) return [];
    const display = kpi.value?.trim() || lastFiniteValue(kpi.values);
    if (!display) return [];
    return [
      {
        ...kpi,
        display,
        period,
        comparison,
        definition,
        updatedLabel: formatKpiUpdated(kpi.updatedAt),
      },
    ];
  });
}

export function b2bApprovedSeries(kpis: B2bKpi[]) {
  return kpis.filter(
    (kpi) =>
      (kpi.dataStatus === "Approved" || kpi.dataStatus === "Anonymised") &&
      kpi.values.some((item) => Number.isFinite(item)) &&
      kpi.labels.length === kpi.values.length &&
      kpi.labels.length > 1,
  );
}

function formatKpiUpdated(value?: string) {
  const next = value?.trim() || "";
  if (!next) return "";
  const iso = next.match(/^(\d{4}-\d{2}-\d{2})/);
  return iso ? iso[1] : next;
}

function lastFiniteValue(values: number[]) {
  const next = [...values].reverse().find((item) => Number.isFinite(item));
  return next == null ? "" : String(next);
}

export function b2bWorkflowCopy(locale: Locale) {
  const thai = locale === "th";
  return B2B_WORKFLOW_STEPS.map((step) => ({
    id: step.id,
    number: step.number,
    title: thai ? step.titleTh : step.titleEn,
    owner: thai ? step.ownerTh : step.ownerEn,
    input: thai ? step.inputTh : step.inputEn,
    action: thai ? step.actionTh : step.actionEn,
    output: thai ? step.outputTh : step.outputEn,
    escalation: thai ? step.escalationTh : step.escalationEn,
  }));
}

export function b2bWorkflowBoundaryCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: B2B_WORKFLOW_BOUNDARY.kicker,
    note: thai ? B2B_WORKFLOW_BOUNDARY.note.th : B2B_WORKFLOW_BOUNDARY.note.en,
    supportTitle: thai ? B2B_WORKFLOW_BOUNDARY.supportTitle.th : B2B_WORKFLOW_BOUNDARY.supportTitle.en,
    approveTitle: thai ? B2B_WORKFLOW_BOUNDARY.approveTitle.th : B2B_WORKFLOW_BOUNDARY.approveTitle.en,
    support: [...B2B_WORKFLOW_BOUNDARY.support],
    approve: [...B2B_WORKFLOW_BOUNDARY.approve],
  };
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
