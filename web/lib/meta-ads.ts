import type { Locale } from "@/lib/seo";

export type MetaVisualStatus = "placeholder" | "sample" | "approved" | "real";
export type MetaKpiStatus = "draft" | "sample" | "approved" | "anonymised";
export type AdsVisualStatus = MetaVisualStatus;
export type AdsKpiStatus = MetaKpiStatus;

export const META_SAMPLE_LABEL = {
  th: "ตัวอย่างข้อมูล",
  en: "Sample Visual",
} as const;

export function metaSampleLabel(locale: Locale) {
  return locale === "th" ? META_SAMPLE_LABEL.th : META_SAMPLE_LABEL.en;
}

export function metaShowsSampleBadge(status?: string) {
  return status !== "approved" && status !== "real";
}

/** Deterministic sample workflow. Omit src when the file is missing; do not invent a live Ads screenshot. */
export const META_HERO_VISUAL_CANDIDATE = "/images/meta-ads-management-hero-placeholder.webp";

export const META_HERO_VISUAL = {
  recommendedSize: "1600 × 1000 px",
  ratio: "8 / 5",
  fit: "contain" as const,
  width: 1600,
  height: 1000,
  displayWidth: 560,
  displayHeight: 350,
  alt: {
    th: "ตัวอย่าง Meta Ad Creative และ Hotel Booking Funnel ที่เชื่อมครีเอทีฟ กลุ่มลูกค้า และเส้นทางจองตรง โดยปิดข้อมูลบัญชี ไม่ใช่ภาพบุคคล",
    en: "Sample Meta Ad Creative and Hotel Booking Funnel connecting creative, audience, and the direct-booking path, with account data redacted, not a person photo",
  },
  label: {
    th: "ตัวอย่าง Meta Ad Creative และ Hotel Booking Funnel",
    en: "Sample Meta Ad Creative and Hotel Booking Funnel",
  },
  meta: {
    th: "Sample workflow · Creative, Audience and Direct Booking",
    en: "Sample workflow · Creative, Audience and Direct Booking",
  },
  caption: {
    th: "วาง Creative และ Audience ให้สอดคล้องกับเป้าหมายการขายของโรงแรม ตั้งแต่การรับรู้จนถึงการจอง",
    en: "Align creative and audience with the hotel’s sales goal, from awareness through to booking",
  },
} as const;

/** Audience Insight dummy. Never reuse the Hero asset. */
export const META_AUDIENCE_VISUAL_LEGACY = "/images/meta-ads-management-visibility-placeholder.webp";
export const META_AUDIENCE_VISUAL_CANDIDATE = "/images/meta-ads-audience-insight-placeholder.webp";

export const META_AUDIENCE_PATH = [
  { en: "Ad view", th: "การเห็นโฆษณา" },
  { en: "Interest", th: "ความสนใจ" },
  { en: "Landing page", th: "หน้าปลายทาง" },
  { en: "Enquiry or booking", th: "สอบถามหรือจอง" },
] as const;

export const META_PLATFORM_AUDIENCE_SOURCE = {
  label: "DataReportal Digital 2026 Thailand",
  href: "https://datareportal.com/reports/digital-2026-thailand",
} as const;

export const META_PLATFORM_AUDIENCE = [
  {
    id: "facebook",
    platform: "Facebook",
    icon: "/brand/meta/facebook.svg",
    value: { th: "51.5 ล้าน", en: "51.5 million", ru: "51,5 млн", zh: "5150 萬" },
    kind: { th: "Platform audience estimate", en: "Platform audience estimate" },
    period: { th: "ปลายปี 2025", en: "Late 2025" },
    market: { th: "ประเทศไทย", en: "Thailand" },
    definition: {
      th: "ขนาดกลุ่มเป้าหมายโฆษณา Facebook ในไทย ผู้ที่เครื่องมือโฆษณาประเมินว่าเข้าถึงได้ในระดับประเทศ",
      en: "Facebook advertising audience size in Thailand: people Meta’s ad tools estimate can be reached at country level",
    },
    status: {
      th: "ประมาณการระดับอุตสาหกรรม · ไม่ใช่ผลแคมเปญโรงแรม",
      en: "Industry estimate · not a hotel campaign result",
    },
  },
  {
    id: "instagram",
    platform: "Instagram",
    icon: "/brand/meta/instagram.svg",
    value: { th: "20.6 ล้าน", en: "20.6 million", ru: "20,6 млн", zh: "2060 萬" },
    kind: { th: "Platform audience estimate", en: "Platform audience estimate" },
    period: { th: "ปลายปี 2025", en: "Late 2025" },
    market: { th: "ประเทศไทย", en: "Thailand" },
    definition: {
      th: "ขนาดกลุ่มเป้าหมายโฆษณา Instagram ในไทย ผู้ที่เครื่องมือโฆษณาประเมินว่าเข้าถึงได้ในระดับประเทศ",
      en: "Instagram advertising audience size in Thailand: people Meta’s ad tools estimate can be reached at country level",
    },
    status: {
      th: "ประมาณการระดับอุตสาหกรรม · ไม่ใช่ผลแคมเปญโรงแรม",
      en: "Industry estimate · not a hotel campaign result",
    },
  },
] as const;

export const META_AUDIENCE_LAYERS = [
  {
    id: "platform-estimate",
    title: { th: "Platform audience estimate", en: "Platform audience estimate" },
    body: {
      th: "ขนาดกลุ่มที่โฆษณาเข้าถึงได้ในระดับประเทศ ตามเครื่องมือของแพลตฟอร์ม ไม่ใช่กลุ่มลูกค้าของโรงแรมรายใด",
      en: "How many people in the country can be reached with ads, according to the platform tools. Not one hotel’s audience.",
    },
    result: { th: "มีตัวเลขระดับประเทศด้านล่าง", en: "Country figures below" },
  },
  {
    id: "potential-reach",
    title: { th: "Potential reach", en: "Potential reach" },
    body: {
      th: "กลุ่มที่โรงแรมอาจเข้าถึงได้ หลังจากเลือกตลาด ความสนใจ และข้อเสนอ แคบกว่าประมาณการระดับประเทศ",
      en: "The subset a hotel might reach after market, interest, and offer choices. Narrower than the country estimate.",
    },
    result: { th: "ไม่แสดงเป็นผลโรงแรม", en: "Not shown as a hotel result" },
  },
  {
    id: "campaign-reach",
    title: { th: "Campaign reach", en: "Campaign reach" },
    body: {
      th: "จำนวนคนที่เห็นโฆษณาจริงในช่วงเวลาของแคมเปญ ใช้ได้เมื่อมีงวดและสถานะข้อมูลที่โรงแรมอนุมัติ",
      en: "People who actually saw the ads in a campaign period. Used only with an approved period and data status.",
    },
    result: { th: "รอข้อมูลที่อนุมัติ", en: "Hidden until approved" },
  },
  {
    id: "website-visitor",
    title: { th: "Website visitor", en: "Website visitor" },
    body: {
      th: "คนที่มาถึงหน้าเว็บหรือหน้าข้อเสนอของโรงแรม หลังเห็นหรือคลิกโฆษณา ไม่ใช่ขนาดกลุ่มเป้าหมายของแพลตฟอร์ม",
      en: "People who reached the hotel page or offer after seeing or clicking an ad. Not the platform audience size.",
    },
    result: { th: "รอข้อมูลที่อนุมัติ", en: "Hidden until approved" },
  },
  {
    id: "lead-booking",
    title: { th: "Lead or booking result", en: "Lead or booking result" },
    body: {
      th: "การสอบถามหรือจองที่ตรวจสอบได้ ใช้เป็นผลโรงแรมได้เมื่อมีนิยาม งวด และสถานะข้อมูลที่อนุมัติ",
      en: "An enquiry or booking that can be checked. A hotel result only with an approved definition, period, and status.",
    },
    result: { th: "รอข้อมูลที่อนุมัติ", en: "Hidden until approved" },
  },
] as const;

export function metaAudienceText(map: { th: string; en: string }, locale: Locale) {
  return locale === "th" ? map.th : map.en;
}

export function metaPlatformAudienceValue(
  value: { th: string; en: string; ru?: string; zh?: string },
  locale: Locale,
) {
  if (locale === "th") return value.th;
  if (locale === "ru" && value.ru) return value.ru;
  if (locale === "zh" && value.zh) return value.zh;
  return value.en;
}

export const META_AUDIENCE_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  fit: "contain" as const,
  width: 1200,
  height: 800,
  displayWidth: 480,
  displayHeight: 320,
  alt: {
    th: "ตัวอย่าง Audience Insight และ Creative Performance แผนกลุ่มความสนใจและเปรียบเทียบครีเอทีฟอย่างปิดข้อมูลบัญชี ไม่ใช่ภาพไลฟ์สไตล์หรือผลแคมเปญโรงแรม",
    en: "Sample Audience Insight and Creative Performance showing an interest map and a redacted creative comparison, not a lifestyle photo or a hotel campaign result",
  },
  label: {
    th: "ตัวอย่าง Audience Insight และ Creative Performance",
    en: "Sample Audience Insight and Creative Performance",
  },
  meta: {
    th: "Sample data · Audience Insight and Creative Performance",
    en: "Sample data · Audience Insight and Creative Performance",
  },
  caption: {
    th: "แยกประมาณการกลุ่มเป้าหมายของแพลตฟอร์ม ออกจากยอดเห็นแคมเปญ ผู้เข้าชมเว็บ และการสอบถามหรือจอง",
    en: "Separate the platform audience estimate from campaign reach, website visits, and enquiry or booking results",
  },
} as const;

export const META_FRAMEWORK_VISUAL_CANDIDATE = "/images/meta-ads-readiness-framework-placeholder.webp";

export const META_READINESS_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างกรอบความพร้อม Meta Ads จาก Objective, Audience, Creative, Landing Page, Booking / Lead Path และ Tracking & Optimization",
    en: "Sample Meta Ads Readiness Framework covering Objective, Audience, Creative, Landing Page, Booking / Lead Path, and Tracking & Optimization",
  },
  label: {
    th: "Meta Ads Readiness Framework — Sample",
    en: "Meta Ads Readiness Framework — Sample",
  },
  meta: {
    th: "Sample framework · Objective to Tracking",
    en: "Sample framework · Objective to Tracking",
  },
  caption: {
    th: "กรอบตรวจความพร้อม ไม่ใช่ผลแคมเปญหรือยอด Reach จริง",
    en: "A readiness framework, not campaign results or live Reach",
  },
} as const;

export const META_SCENARIO_VISUAL_LEGACY = "/images/meta-ads-scenario-comparison-placeholder.webp";
export const META_SCENARIO_VISUAL_CANDIDATE = "/images/meta-ads-hotel-sales-objectives-placeholder.webp";

export const META_SCENARIO_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างแผนที่ Objective ถึงการจองของ Meta Ads จาก Awareness, Consideration, Inquiry, Direct Booking และ Remarketing",
    en: "Sample Meta Ads Objective to Booking Map from Awareness, Consideration, Inquiry, Direct Booking, and Remarketing",
  },
  label: {
    th: "Meta Ads Objective to Booking Map — Sample",
    en: "Meta Ads Objective to Booking Map — Sample",
  },
  meta: {
    th: "Sample map · Objective to KPI",
    en: "Sample map · Objective to KPI",
  },
  caption: {
    th: "ชื่อตัวชี้วัดในแผนที่นี้ไม่ใช่ผลแคมเปญของโรงแรม",
    en: "KPI names on this map are not a hotel campaign result",
  },
} as const;

export const META_WORKFLOW_VISUAL_CANDIDATE = "/images/meta-ads-campaign-workflow-placeholder.webp";

export const META_WORKFLOW_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 640,
  displayHeight: 360,
  alt: {
    th: "ตัวอย่างกระบวนการแคมเปญ Meta Ads จาก Audit, Plan, Create, Launch, Optimize และ Report โดยเน้นสิ่งที่เปลี่ยนระหว่าง Audit, Launch, Optimize และ Report ไม่ใช่รูปประชุม",
    en: "Sample Meta Ads campaign workflow from Audit, Plan, Create, Launch, Optimize, and Report, showing what changes between Audit, Launch, Optimize, and Report, not a meeting photo",
  },
  label: {
    th: "Meta Ads Campaign Workflow — Sample process",
    en: "Meta Ads Campaign Workflow — Sample process",
  },
  meta: {
    th: "Sample process · Audit to Report",
    en: "Sample process · Audit to Report",
  },
  caption: {
    th: "สิ่งที่เปลี่ยนในแต่ละขั้น ไม่ใช่รูปประชุมทั่วไปหรือผลบัญชีโฆษณา",
    en: "What changes at each step, not a generic meeting photo or live ad-account result",
  },
} as const;

export const META_KPI_VISUAL_CANDIDATE = "/images/meta-ads-performance-kpi-placeholder.webp";

export const META_KPI_COLORS = {
  positive: "#A2DC25",
  target: "#EBE722",
  risk: "#F59E0B",
  axis: "#0B1F33",
  label: "#617487",
  grid: "#E3E8EB",
} as const;

export const META_KPI_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างกรอบตัวชี้วัด Meta Ads ไม่ใช่ Reach CTR CPC Leads ยอดจอง หรือรายได้จริง",
    en: "Sample Meta Ads KPI frame, not a live Reach, CTR, CPC, Lead, booking, or revenue figure",
  },
  label: {
    th: "Meta Ads Performance KPI · Sample data",
    en: "Meta Ads Performance KPI · Sample data",
  },
  meta: {
    th: "Sample data · Performance KPI frame",
    en: "Sample data · Performance KPI frame",
  },
  caption: {
    th: "กรอบตัวชี้วัดตัวอย่าง ไม่ใช่ผลบัญชีโฆษณาหรือยอดจองจริง",
    en: "A sample KPI frame, not a live ad-account or booking figure",
  },
} as const;

export const META_RELATED_VISUAL_CANDIDATE = "/images/meta-ads-related-content-placeholder.webp";

export const META_RELATED_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  fit: "contain" as const,
  width: 1200,
  height: 800,
  displayWidth: 520,
  displayHeight: 347,
  alt: {
    th: "ตัวอย่างเนื้อหา Meta Ads และการตลาดโรงแรม ไม่ใช่รูป Hero รูป Audience หรือผลงานลูกค้า",
    en: "Sample Meta Ads and hotel marketing content, not the hero, audience visual, or a client result",
  },
  label: {
    th: "Meta Ads / Hotel Marketing Content",
    en: "Meta Ads / Hotel Marketing Content",
  },
  meta: {
    th: "Sample visual · 3:2 hotel marketing content frame",
    en: "Sample visual · 3:2 hotel marketing content frame",
  },
  caption: {
    th: "กรอบเนื้อหาที่เกี่ยวข้อง ไม่ใช่รูป Hero รูป Visibility หรือผลแคมเปญ",
    en: "Related content frame, not the hero, visibility visual, or a campaign result",
  },
} as const;

export const META_RELATED_VISUAL_OPTIONS = [
  { id: "creative-review", label: "Creative Review" },
  { id: "campaign-report", label: "Campaign Report" },
  { id: "audience-workshop", label: "Audience Workshop" },
  { id: "remarketing-funnel", label: "Remarketing Funnel" },
  { id: "hotel-marketing-planning", label: "Hotel Marketing Planning" },
] as const;

export const META_HOTEL_SCENARIO_VISUAL_CANDIDATE = "/images/meta-ads-hotel-scenario-matrix-placeholder.webp";

export const META_HOTEL_SCENARIO_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างตารางสถานการณ์ Meta Ads ของโรงแรม จากโรงแรมใหม่ เว็บไซต์ที่มีอยู่แล้ว กลุ่มที่เคยเข้าชม และแคมเปญที่ผลยังไม่ชัด",
    en: "Sample Hotel Meta Ads Scenario Matrix from a new hotel, an existing website, previous visitors, and a campaign with unclear results",
  },
  label: {
    th: "Hotel Meta Ads Scenario Matrix — Sample",
    en: "Hotel Meta Ads Scenario Matrix — Sample",
  },
  meta: {
    th: "Sample matrix · Start from the hotel situation",
    en: "Sample matrix · Start from the hotel situation",
  },
  caption: {
    th: "ตารางสถานการณ์ตัวอย่าง ไม่ใช่รูปโรงแรมหรือรูปบุคคล",
    en: "A sample scenario matrix, not a hotel or person photo",
  },
} as const;

export const META_HOTEL_SCENARIO_ROWS = [
  {
    id: "new-hotel",
    situationTh: "โรงแรมใหม่หรือตลาดใหม่",
    situationEn: "New hotel or new market",
    questionTh: "ตลาดนี้รู้จักโรงแรมแล้วหรือยัง?",
    questionEn: "Does this market already know the hotel?",
    actionTh: "เริ่มจาก Awareness and Audience Test",
    actionEn: "Start with Awareness and Audience Test",
    outputTh: "Market and Creative Learning",
    outputEn: "Market and Creative Learning",
    nextTh: "ตัดสินใจว่าจะทดสอบการรับรู้ต่อ หรือไปหน้าข้อเสนอ",
    nextEn: "Decide whether to keep testing awareness or move to an offer page",
  },
  {
    id: "low-booking",
    situationTh: "มีเว็บไซต์แล้ว แต่การจองยังน้อย",
    situationEn: "Website exists but booking is low",
    questionTh: "หลังคลิก ลูกค้าสอบถามหรือจองได้หรือไม่?",
    questionEn: "After the click, can a guest enquire or book?",
    actionTh: "เริ่มจาก Landing Page and Conversion Path Review",
    actionEn: "Start with Landing Page and Conversion Path Review",
    outputTh: "Booking Path Checklist",
    outputEn: "Booking Path Checklist",
    nextTh: "ตัดสินใจว่าต้องแก้เส้นทางจองก่อนเพิ่มโฆษณาหรือไม่",
    nextEn: "Decide whether the booking path must be fixed before more ads",
  },
  {
    id: "existing-audience",
    situationTh: "มีผู้เข้าชมเว็บหรือฐานลูกค้าอยู่แล้ว",
    situationEn: "Existing website visitors or customer base",
    questionTh: "มีรายชื่อผู้เคยเข้าชมหรือลูกค้าที่ติดตามได้หรือไม่?",
    questionEn: "Is there a tracked list of previous visitors or customers?",
    actionTh: "เริ่มจาก Remarketing and Offer Test",
    actionEn: "Start with Remarketing and Offer Test",
    outputTh: "Remarketing Plan",
    outputEn: "Remarketing Plan",
    nextTh: "ตัดสินใจว่าข้อเสนอพร้อมใช้กับกลุ่มนั้นหรือไม่",
    nextEn: "Decide whether an offer can go live for that audience",
  },
  {
    id: "unclear-results",
    situationTh: "มีแคมเปญอยู่แล้ว แต่ผลยังไม่ชัด",
    situationEn: "Campaign exists but results are unclear",
    questionTh: "การสอบถามหรือจองจากโฆษณาตรวจสอบได้หรือไม่?",
    questionEn: "Can an enquiry or booking from the ads be checked?",
    actionTh: "เริ่มจาก Tracking and Attribution Review",
    actionEn: "Start with Tracking and Attribution Review",
    outputTh: "Measurement Plan",
    outputEn: "Measurement Plan",
    nextTh: "ตัดสินใจว่ารายงานอะไรได้ และอะไรยังไม่ใช้เป็นผลจนกว่าการติดตามพร้อม",
    nextEn: "Decide what can be reported, and what stays unclaimed until tracking is ready",
  },
] as const;

export const META_FRAMEWORK_ROWS = [
  {
    id: "objective",
    area: "Objective",
    problemTh: "เป้าหมายแคมเปญยังไม่ชัด",
    problemEn: "The campaign goal is unclear",
    inspectTh: "เป้าหมายการรับรู้ ลีด การสอบถาม หรือการจอง",
    inspectEn: "Awareness, Lead, Inquiry, or Booking goal",
    improveTh: "กำหนดวัตถุประสงค์และ conversion event",
    improveEn: "Define objective and conversion event",
    outputTh: "Campaign Objective Plan",
    outputEn: "Campaign Objective Plan",
  },
  {
    id: "audience",
    area: "Audience",
    problemTh: "กลุ่มลูกค้ากว้างเกินไปหรือยังไม่สอดคล้องกับโรงแรม",
    problemEn: "Audience is too broad or not aligned",
    inspectTh: "ตลาด ความสนใจ พฤติกรรม และผู้ที่เคยเข้าชม",
    inspectEn: "Market, interest, behavior, and past visitors",
    improveTh: "แบ่งกลุ่มตามเจตนาและตลาด",
    improveEn: "Segment by intent and market",
    outputTh: "Audience Map",
    outputEn: "Audience Map",
  },
  {
    id: "creative",
    area: "Creative",
    problemTh: "ครีเอทีฟยังไม่เข้ากับกลุ่มลูกค้า",
    problemEn: "Creative does not match audience",
    inspectTh: "Hook ข้อความ ข้อเสนอ และรูปแบบ",
    inspectEn: "Hook, message, offer, and format",
    improveTh: "จัดทำ creative matrix",
    improveEn: "Build a creative matrix",
    outputTh: "Creative Matrix",
    outputEn: "Creative Matrix",
  },
  {
    id: "landing-page",
    area: "Landing Page",
    problemTh: "โฆษณาและหน้าเว็บไม่สอดคล้องกัน",
    problemEn: "Ad and page do not match",
    inspectTh: "ความเกี่ยวข้อง ปุ่มดำเนินการ มือถือ และความเร็ว",
    inspectEn: "Relevance, CTA, mobile, and speed",
    improveTh: "ปรับหน้าปลายทาง",
    improveEn: "Improve destination page",
    outputTh: "Landing Page Checklist",
    outputEn: "Landing Page Checklist",
  },
  {
    id: "booking-path",
    area: "Booking / Lead Path",
    problemTh: "ลูกค้าไปต่อสู่การสอบถามหรือจองได้ยาก",
    problemEn: "User cannot move easily to inquiry or booking",
    inspectTh: "ปุ่มดำเนินการ ระบบจอง และช่องทางติดต่อ",
    inspectEn: "CTA, booking engine, and contact path",
    improveTh: "ลดจุดสะดุด",
    improveEn: "Reduce friction",
    outputTh: "Conversion Path Review",
    outputEn: "Conversion Path Review",
  },
  {
    id: "tracking",
    area: "Tracking & Optimization",
    problemTh: "ยังให้เครดิตผลไม่ได้",
    problemEn: "Results cannot be attributed",
    inspectTh: "Pixel / events / UTM และอีเวนต์การจอง",
    inspectEn: "Pixel/events/UTM and booking event",
    improveTh: "กำหนดแผนการวัดผล",
    improveEn: "Define measurement plan",
    outputTh: "Tracking Plan",
    outputEn: "Tracking Plan",
  },
] as const;

/** @deprecated Use META_FRAMEWORK_ROWS. Kept for older CMS bodies. */
export const META_READINESS_ITEMS = META_FRAMEWORK_ROWS.map((row) => ({
  id: row.id,
  checkTh: row.inspectTh,
  checkEn: row.inspectEn,
  whyTh: row.problemTh,
  whyEn: row.problemEn,
  outputTh: row.outputTh,
  outputEn: row.outputEn,
}));

export const META_SCENARIO_ROWS = [
  {
    id: "awareness",
    channel: "Awareness",
    useCaseTh: "แนะนำโรงแรมและจุดหมายปลายทาง",
    useCaseEn: "Introduce the hotel and destination",
    controlTh: "หน้าโรงแรมหรือหน้าจุดหมาย",
    controlEn: "Hotel or destination page",
    inputTh: "หน้าโรงแรมหรือหน้าจุดหมาย",
    inputEn: "Hotel or destination page",
    outputTh: "market and creative learning",
    outputEn: "market and creative learning",
    kpiTh: "reach, frequency, video view",
    kpiEn: "reach, frequency, video view",
    roleTh: "แนะนำโรงแรมและจุดหมายปลายทาง",
    roleEn: "Introduce the hotel and destination",
    needTh: "หน้าโรงแรมหรือหน้าจุดหมาย",
    needEn: "Hotel or destination page",
    hotelTh: "",
    hotelEn: "",
  },
  {
    id: "consideration",
    channel: "Consideration",
    useCaseTh: "แสดงห้องพัก สิ่งอำนวยความสะดวก และข้อเสนอ",
    useCaseEn: "Show rooms, facilities, and offer",
    controlTh: "หน้าห้องพักหรือหน้าข้อเสนอ",
    controlEn: "Room or offer page",
    inputTh: "หน้าห้องพักหรือหน้าข้อเสนอ",
    inputEn: "Room or offer page",
    outputTh: "qualified interest",
    outputEn: "qualified interest",
    kpiTh: "CTR, landing page view",
    kpiEn: "CTR, landing page view",
    roleTh: "แสดงห้องพัก สิ่งอำนวยความสะดวก และข้อเสนอ",
    roleEn: "Show rooms, facilities, and offer",
    needTh: "หน้าห้องพักหรือหน้าข้อเสนอ",
    needEn: "Room or offer page",
    hotelTh: "",
    hotelEn: "",
  },
  {
    id: "inquiry",
    channel: "Inquiry",
    useCaseTh: "ชวนให้ติดต่อหรือส่งข้อมูล",
    useCaseEn: "Encourage contact or lead submission",
    controlTh: "หน้าติดต่อ แชต หรือแบบฟอร์ม",
    controlEn: "Contact, chat, or lead form",
    inputTh: "หน้าติดต่อ แชต หรือแบบฟอร์ม",
    inputEn: "Contact, chat, or lead form",
    outputTh: "inquiry list",
    outputEn: "inquiry list",
    kpiTh: "lead, cost per lead",
    kpiEn: "lead, cost per lead",
    roleTh: "ชวนให้ติดต่อหรือส่งข้อมูล",
    roleEn: "Encourage contact or lead submission",
    needTh: "หน้าติดต่อ แชต หรือแบบฟอร์ม",
    needEn: "Contact, chat, or lead form",
    hotelTh: "",
    hotelEn: "",
  },
  {
    id: "direct-booking",
    channel: "Direct Booking",
    useCaseTh: "พาไประบบจอง",
    useCaseEn: "Send users to booking engine",
    controlTh: "หน้าจอง",
    controlEn: "Booking page",
    inputTh: "หน้าจอง",
    inputEn: "Booking page",
    outputTh: "direct booking opportunity",
    outputEn: "direct booking opportunity",
    kpiTh: "booking, conversion, cost per booking",
    kpiEn: "booking, conversion, cost per booking",
    roleTh: "พาไประบบจอง",
    roleEn: "Send users to booking engine",
    needTh: "หน้าจอง",
    needEn: "Booking page",
    hotelTh: "",
    hotelEn: "",
  },
  {
    id: "remarketing",
    channel: "Remarketing",
    useCaseTh: "กลับไปพูดกับผู้ที่เคยเข้าชมหรือเคยเห็นโฆษณา",
    useCaseEn: "Reconnect with previous visitors or viewers",
    controlTh: "หน้าข้อเสนอหรือหน้าจอง",
    controlEn: "Offer or booking page",
    inputTh: "หน้าข้อเสนอหรือหน้าจอง",
    inputEn: "Offer or booking page",
    outputTh: "re-engagement performance",
    outputEn: "re-engagement performance",
    kpiTh: "return visit, booking, ROAS",
    kpiEn: "return visit, booking, ROAS",
    roleTh: "กลับไปพูดกับผู้ที่เคยเข้าชมหรือเคยเห็นโฆษณา",
    roleEn: "Reconnect with previous visitors or viewers",
    needTh: "หน้าข้อเสนอหรือหน้าจอง",
    needEn: "Offer or booking page",
    hotelTh: "",
    hotelEn: "",
  },
] as const;

export const META_OBJECTIVE_BOUNDARY = {
  kicker: "Responsibility boundary",
  supportTitle: {
    th: "เดอะ เคพีไอ พลัส อาจช่วย",
    en: "The KPI Plus may support",
  },
  support: [
    "Objective",
    "Audience",
    "Creative Direction",
    "Campaign Structure",
    "Tracking Review",
    "Optimization",
    "Reporting",
  ],
  approveTitle: {
    th: "โรงแรมอาจอนุมัติ",
    en: "The hotel may approve",
  },
  approve: ["Budget", "Promotion/Offer", "Rate and Availability", "Brand Message", "Guest/Legal Claims"],
} as const;

export function metaKpiTags(value: string) {
  return value
    .split(",")
    .map((item) => item.replace(/^when tracking allows$/i, "").trim())
    .filter(Boolean);
}

export function metaObjectiveRowsAreStale(rows: Array<{ id?: string; channel: string }>) {
  return rows.some(
    (row) =>
      /^(traffic|leads|conversion|free booking links)$/i.test(row.channel.trim()) ||
      /^(traffic|leads|conversion)$/i.test((row.id || "").trim()),
  );
}

export const META_WORKFLOW_STEPS = [
  {
    id: "audit",
    number: "01",
    titleTh: "Audit",
    titleEn: "Audit",
    ownerTh: "เดอะ เคพีไอ พลัส ร่วมกับโรงแรม",
    ownerEn: "The KPI Plus with the hotel",
    inputTh: "เว็บไซต์ เพจ ระบบจอง Meta Ads ที่ใช้อยู่ ตลาดเป้าหมาย",
    inputEn: "Website, page, booking system, current Meta Ads, target market",
    actionTh: "ตรวจเป้าหมาย กลุ่มลูกค้า ครีเอทีฟ หน้าปลายทาง เส้นทางจอง และการติดตามผลที่วัดได้",
    actionEn: "Review the objective, audience, creative, landing pages, the booking path, and what can be measured",
    outputTh: "Ads and Tracking Checklist",
    outputEn: "Ads and Tracking Checklist",
    nextDecisionTh: "หากเว็บไซต์ ระบบจอง หรือการติดตามยังไม่พร้อม โรงแรมเป็นผู้ตัดสินใจว่าจะปรับส่วนนั้นก่อนหรือไม่",
    nextDecisionEn: "If the site, booking path, or tracking is not ready, the hotel decides whether that comes first",
    changeTh: "ตรวจโฆษณาและการติดตาม",
    changeEn: "Inspect ads and tracking",
    handoffTh: "หากเว็บไซต์ ระบบจอง หรือการติดตามยังไม่พร้อม โรงแรมเป็นผู้ตัดสินใจว่าจะปรับส่วนนั้นก่อนหรือไม่",
    handoffEn: "If the site, booking path, or tracking is not ready, the hotel decides whether that comes first",
  },
  {
    id: "plan",
    number: "02",
    titleTh: "Plan",
    titleEn: "Plan",
    ownerTh: "เดอะ เคพีไอ พลัส วางแผน โรงแรมอนุมัติข้อเสนอ",
    ownerEn: "The KPI Plus sets the plan. The hotel approves the offer",
    inputTh: "Ads and Tracking Checklist กลุ่มลูกค้า งบ และข้อเสนอ",
    inputEn: "Ads and Tracking Checklist, audience, budget, and the offer",
    actionTh: "แยกกลุ่มลูกค้า กำหนดโครงสร้างแคมเปญ หน้าปลายทาง และสิ่งที่จะวัด",
    actionEn: "Separate audience groups and set campaign structure, destination pages, and measurement",
    outputTh: "Campaign Brief",
    outputEn: "Campaign Brief",
    nextDecisionTh: "โรงแรมเป็นผู้อนุมัติข้อเสนอ ราคา และงบที่พร้อมใช้",
    nextDecisionEn: "The hotel approves the offer, rate, and budget that can go live",
    changeTh: "กำหนด Campaign Brief",
    changeEn: "Set the campaign brief",
    handoffTh: "โรงแรมเป็นผู้อนุมัติข้อเสนอ ราคา และงบที่พร้อมใช้",
    handoffEn: "The hotel approves the offer, rate, and budget that can go live",
  },
  {
    id: "create",
    number: "03",
    titleTh: "Create",
    titleEn: "Create",
    ownerTh: "เดอะ เคพีไอ พลัส จัดครีเอทีฟ โรงแรมอนุมัติข้อความแบรนด์",
    ownerEn: "The KPI Plus prepares creative. The hotel approves brand message",
    inputTh: "Campaign Brief ข้อเสนอที่อนุมัติ และภาพหรือข้อความที่โรงแรมอนุญาต",
    inputEn: "Campaign Brief, approved offer, and photos or copy the hotel allows",
    actionTh: "จับคู่กลุ่มลูกค้า ข้อเสนอ และหน้าปลายทางเป็นโฆษณาที่พร้อมใช้",
    actionEn: "Pair audience, offer, and destination into ads that can go live",
    outputTh: "Creative Matrix",
    outputEn: "Creative Matrix",
    nextDecisionTh: "โรงแรมอนุมัติครีเอทีฟ และข้อความที่เกี่ยวกับแขกหรือข้อกฎหมาย ก่อนเปิดแคมเปญ",
    nextDecisionEn: "The hotel approves creative and guest or legal claims before launch",
    changeTh: "จัด Creative Matrix",
    changeEn: "Build the creative matrix",
    handoffTh: "โรงแรมอนุมัติครีเอทีฟ และข้อความที่เกี่ยวกับแขกหรือข้อกฎหมาย ก่อนเปิดแคมเปญ",
    handoffEn: "The hotel approves creative and guest or legal claims before launch",
  },
  {
    id: "launch",
    number: "04",
    titleTh: "Launch",
    titleEn: "Launch",
    ownerTh: "เดอะ เคพีไอ พลัส เปิดแคมเปญ โรงแรมยืนยันข้อเสนอที่ใช้งาน",
    ownerEn: "The KPI Plus launches. The hotel confirms the live offer",
    inputTh: "Campaign Brief, Creative Matrix ข้อเสนอที่อนุมัติ และการตั้งค่าติดตามผล",
    inputEn: "Campaign Brief, Creative Matrix, approved offer, and tracking setup",
    actionTh: "สร้างแคมเปญ ตรวจโฆษณา หน้าปลายทาง การติดตามผล แล้วเปิดใช้งาน",
    actionEn: "Build the campaigns, check ads, landing pages, and tracking, then go live",
    outputTh: "QA Checklist",
    outputEn: "QA Checklist",
    nextDecisionTh: "ไม่เริ่มซื้อคลิกเพิ่มถ้าลูกค้ายังเดินเข้าสู่ระบบจองไม่ได้ เว้นแต่โรงแรมตัดสินใจให้ทำต่อ",
    nextDecisionEn: "Extra clicks are not bought if the guest cannot reach booking, unless the hotel decides to continue",
    changeTh: "เปิดใช้หลัง QA",
    changeEn: "Go live after QA",
    handoffTh: "ไม่เริ่มซื้อคลิกเพิ่มถ้าลูกค้ายังเดินเข้าสู่ระบบจองไม่ได้ เว้นแต่โรงแรมตัดสินใจให้ทำต่อ",
    handoffEn: "Extra clicks are not bought if the guest cannot reach booking, unless the hotel decides to continue",
  },
  {
    id: "optimize",
    number: "05",
    titleTh: "Optimize",
    titleEn: "Optimize",
    ownerTh: "เดอะ เคพีไอ พลัส ทบทวน โรงแรมตัดสินใจปรับ",
    ownerEn: "The KPI Plus reviews. The hotel decides the next change",
    inputTh: "QA Checklist กลุ่มที่เห็นโฆษณา พฤติกรรมบนหน้าเว็บ และการกระทำในเส้นทางสอบถามหรือจอง",
    inputEn: "QA Checklist, who saw the ads, landing-page behaviour, and enquiry or booking-path actions",
    actionTh: "ปรับกลุ่มลูกค้า งบ ครีเอทีฟ และหน้าปลายทางจากข้อมูลที่ตรวจสอบได้",
    actionEn: "Adjust audience, budget, creative, and destination pages from data that can be checked",
    outputTh: "Optimization Log",
    outputEn: "Optimization Log",
    nextDecisionTh: "ตัวเลขที่ยังไม่อนุมัติจะไม่ใช้เป็นหลักฐานผลงาน",
    nextDecisionEn: "Unapproved figures are not used as proof of result",
    changeTh: "ปรับจากข้อมูลที่ตรวจได้",
    changeEn: "Change from checked data",
    handoffTh: "ตัวเลขที่ยังไม่อนุมัติจะไม่ใช้เป็นหลักฐานผลงาน",
    handoffEn: "Unapproved figures are not used as proof of result",
  },
  {
    id: "report",
    number: "06",
    titleTh: "Report",
    titleEn: "Report",
    ownerTh: "เดอะ เคพีไอ พลัส รายงาน โรงแรมตัดสินใจขั้นถัดไป",
    ownerEn: "The KPI Plus reports. The hotel decides the next action",
    inputTh: "Optimization Log การกระทำที่ติดตามได้ และต้นทุนต่อผลที่ใช้ตัดสินใจ",
    inputEn: "Optimization Log, tracked actions, and cost against useful results",
    actionTh: "สรุปสิ่งที่วัดได้ และเสนอการปรับในรอบถัดไป",
    actionEn: "Summarise what can be measured and recommend the next change",
    outputTh: "Performance Summary and Next Action",
    outputEn: "Performance Summary and Next Action",
    nextDecisionTh: "โรงแรมเป็นผู้ตัดสินใจว่าจะคงแผน หยุดชั่วคราว หรือปรับแนวทาง",
    nextDecisionEn: "The hotel decides whether to keep, pause, or change the plan",
    changeTh: "สรุปผลและตัดสินใจต่อ",
    changeEn: "Summarise and decide next",
    handoffTh: "โรงแรมเป็นผู้ตัดสินใจว่าจะคงแผน หยุดชั่วคราว หรือปรับแนวทาง",
    handoffEn: "The hotel decides whether to keep, pause, or change the plan",
  },
] as const;

export function metaWorkflowStepsAreStale(steps: Array<{ id?: string; title: string }>) {
  return (
    steps.length !== META_WORKFLOW_STEPS.length ||
    steps.some((step) => /^(structure)$/i.test((step.id || "").trim()) || /^structure$/i.test(step.title.trim()))
  );
}

export const META_CREATIVE_FORMATS = ["image", "video", "carousel", "story", "reels"] as const;
export type MetaCreativeFormat = (typeof META_CREATIVE_FORMATS)[number];

export const META_CREATIVE_STATUSES = ["draft", "review", "approved", "active", "archived"] as const;
export type MetaCreativeStatus = (typeof META_CREATIVE_STATUSES)[number];

export const META_CREATIVE_ASSET_KINDS = ["none", "image", "video"] as const;
export type MetaCreativeAssetKind = (typeof META_CREATIVE_ASSET_KINDS)[number];

export const META_CREATIVE_FORMAT_LABEL = {
  image: { th: "Image", en: "Image" },
  video: { th: "Video", en: "Video" },
  carousel: { th: "Carousel", en: "Carousel" },
  story: { th: "Story", en: "Story" },
  reels: { th: "Reels", en: "Reels" },
} as const;

export const META_CREATIVE_STATUS_LABEL = {
  draft: { th: "Draft", en: "Draft" },
  review: { th: "Review", en: "Review" },
  approved: { th: "Approved", en: "Approved" },
  active: { th: "Active", en: "Active" },
  archived: { th: "Archived", en: "Archived" },
} as const;

export const META_CREATIVE_ROWS = [
  {
    id: "weekend-traveller",
    audienceTh: "นักเดินทางวันหยุดสุดสัปดาห์",
    audienceEn: "Weekend Traveller",
    marketTh: "ไทย",
    marketEn: "Thai",
    hookTh: "พักผ่อนใกล้จุดหมาย",
    hookEn: "A stay close to the destination",
    offerTh: "ข้อเสนอวันหยุดสุดสัปดาห์",
    offerEn: "Weekend stay offer",
    format: "video" as const,
    formatLabel: "Short Video",
    landingTh: "Weekend Offer",
    landingEn: "Weekend Offer",
    kpiTh: "Landing Page View / Booking",
    kpiEn: "Landing Page View / Booking",
    status: "draft" as const,
  },
  {
    id: "family-traveller",
    audienceTh: "นักเดินทางครอบครัว",
    audienceEn: "Family Traveller",
    marketTh: "ไทย",
    marketEn: "Thai",
    hookTh: "พักพร้อมกันทั้งครอบครัว",
    hookEn: "Stay together as a family",
    offerTh: "ข้อเสนอครอบครัว",
    offerEn: "Family stay offer",
    format: "carousel" as const,
    formatLabel: "Carousel",
    landingTh: "Family Offer",
    landingEn: "Family Offer",
    kpiTh: "Inquiry",
    kpiEn: "Inquiry",
    status: "draft" as const,
  },
  {
    id: "previous-visitor",
    audienceTh: "ผู้ที่เคยเข้าชมเว็บไซต์",
    audienceEn: "Previous Website Visitor",
    marketTh: "อังกฤษ",
    marketEn: "English",
    hookTh: "Ready when you are",
    hookEn: "Ready when you are",
    offerTh: "เตือนการจองตรง",
    offerEn: "Direct-booking reminder",
    format: "story" as const,
    formatLabel: "Story",
    landingTh: "หน้าข้อเสนอหรือหน้าจอง",
    landingEn: "Offer or booking page",
    kpiTh: "Return visit / Booking",
    kpiEn: "Return visit / Booking",
    status: "draft" as const,
  },
  {
    id: "direct-booking-seeker",
    audienceTh: "ผู้ที่พร้อมจองตรง",
    audienceEn: "Direct Booking Seeker",
    marketTh: "ไทย",
    marketEn: "Thai",
    hookTh: "จองตรงจากหน้านี้",
    hookEn: "Book direct from this page",
    offerTh: "เรทจองตรง",
    offerEn: "Direct rate",
    format: "image" as const,
    formatLabel: "Image",
    landingTh: "Booking page",
    landingEn: "Booking page",
    kpiTh: "Booking",
    kpiEn: "Booking",
    status: "draft" as const,
  },
] as const;

const CREATIVE_RESULT_RE = /\b(?:roas|ctr|cpc|cpm)\b|\d+(?:[.,]\d+)?\s*%|\d[\d,]*(?:\.\d+)?\s*(?:thb|บาท)/i;
const CREATIVE_DUMMY_ASSET_RE =
  /placeholder|replace with verified|รอรูป|ai-generated|meta-ads-(?:management-hero|audience|readiness|hotel-sales|campaign-workflow|hotel-scenario|related-content|performance-kpi)/i;

export function metaCreativeFormatIsKnown(value: string): value is MetaCreativeFormat {
  return (META_CREATIVE_FORMATS as readonly string[]).includes(value);
}

export function metaCreativeStatusIsKnown(value: string): value is MetaCreativeStatus {
  return (META_CREATIVE_STATUSES as readonly string[]).includes(value);
}

export function metaCreativeKpiTags(value: string) {
  return value
    .split(/[,/|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function metaCreativeLooksLikeResult(value: string) {
  return CREATIVE_RESULT_RE.test(value);
}

export function metaCreativeAssetKindFromSrc(src: string, kind?: string): MetaCreativeAssetKind {
  if (kind === "image" || kind === "video") return kind;
  if (/\.(mp4|webm|mov)(?:$|\?)/i.test(src)) return "video";
  if (src.trim()) return "image";
  return "none";
}

export function metaCreativePublicAssetSrc(src?: string) {
  const next = src?.trim() || "";
  if (!next || CREATIVE_DUMMY_ASSET_RE.test(next)) return "";
  return next;
}

export function metaCreativeRowsAreStale(rows: Array<{ id?: string; audience: string; href?: string; category?: string }>) {
  return rows.some(
    (row) =>
      Boolean(row.href || row.category) ||
      /related reading|บทความ/i.test(row.audience) ||
      /^(seo-vs-sem|hotel-marketing|direct-booking)$/i.test((row.id || "").trim()),
  );
}

export type MetaKpiTone = "positive" | "target" | "risk";
export type MetaKpiGroup = "platform" | "business";

export const META_KPI_GROUPS = [
  {
    id: "platform" as const,
    titleTh: "ตัวชี้วัดแพลตฟอร์ม",
    titleEn: "Platform metrics",
    noteTh: "Reach Frequency Impressions CTR และการมีส่วนร่วม ไม่ใช่ผลรายได้หรือยอดจอง",
    noteEn: "Reach, Frequency, Impressions, CTR, and engagement are not a revenue or booking result",
  },
  {
    id: "business" as const,
    titleTh: "ตัวชี้วัดธุรกิจ",
    titleEn: "Business metrics",
    noteTh: "ลีด การเข้าสู่ระบบจอง การจอง ต้นทุนต่อผล และ ROAS ใช้เมื่อติดตามได้และอนุมัติแล้ว",
    noteEn: "Lead, booking-engine start, booking, cost per result, and ROAS only with checked and approved data",
  },
] as const;

export const META_KPI_FUNNEL = [
  {
    id: "reach",
    name: "Reach / Impressions",
    noteTh: "ไม่ใช่ผลรายได้",
    noteEn: "Not a revenue result",
  },
  {
    id: "landing",
    name: "Landing Page View",
    noteTh: "ลูกค้าถึงหน้าปลายทาง",
    noteEn: "Guest reached the destination page",
  },
  {
    id: "lead",
    name: "Lead / Inquiry",
    noteTh: "การสอบถามที่ตรวจได้",
    noteEn: "A checked enquiry",
  },
  {
    id: "engine",
    name: "Booking Engine Start",
    noteTh: "เริ่มเส้นทางจอง",
    noteEn: "Started the booking path",
  },
  {
    id: "booking",
    name: "Booking Complete",
    noteTh: "การจองที่ติดตามได้",
    noteEn: "A tracked booking",
  },
] as const;

export const META_KPIS = [
  {
    id: "reach",
    name: "Reach",
    group: "platform" as const,
    objectiveTh: "Awareness",
    objectiveEn: "Awareness",
    marketTh: "กำหนดตามตลาดของแคมเปญ",
    marketEn: "Set per campaign market",
    definitionTh: "จำนวนคนที่เห็นโฆษณาอย่างน้อยหนึ่งครั้งในช่วงที่ทบทวน ไม่ใช่ผลรายได้",
    definitionEn: "People who saw the ad at least once in the review period. Not a revenue result",
    unit: "people",
    tone: "positive" as const,
  },
  {
    id: "frequency",
    name: "Frequency",
    group: "platform" as const,
    objectiveTh: "Awareness",
    objectiveEn: "Awareness",
    marketTh: "กำหนดตามตลาดของแคมเปญ",
    marketEn: "Set per campaign market",
    definitionTh: "จำนวนครั้งเฉลี่ยที่คนเห็นโฆษณาในช่วงที่ทบทวน",
    definitionEn: "Average times a person saw the ad in the review period",
    unit: "count",
    tone: "target" as const,
  },
  {
    id: "impressions",
    name: "Impressions",
    group: "platform" as const,
    objectiveTh: "Awareness",
    objectiveEn: "Awareness",
    marketTh: "กำหนดตามตลาดของแคมเปญ",
    marketEn: "Set per campaign market",
    definitionTh: "จำนวนครั้งที่โฆษณาแสดง ไม่ใช่ยอดจองหรือรายได้",
    definitionEn: "Times the ad was shown, not a booking or revenue result",
    unit: "count",
    tone: "positive" as const,
  },
  {
    id: "ctr",
    name: "CTR",
    group: "platform" as const,
    objectiveTh: "Consideration",
    objectiveEn: "Consideration",
    marketTh: "กำหนดตามตลาดของแคมเปญ",
    marketEn: "Set per campaign market",
    definitionTh: "สัดส่วนคลิกต่อครั้งที่โฆษณาแสดง",
    definitionEn: "Clicks as a share of impressions",
    unit: "%",
    tone: "positive" as const,
  },
  {
    id: "landing-page-view",
    name: "Landing Page View",
    group: "platform" as const,
    objectiveTh: "Consideration",
    objectiveEn: "Consideration",
    marketTh: "กำหนดตามตลาดของแคมเปญ",
    marketEn: "Set per campaign market",
    definitionTh: "จำนวนครั้งที่ถึงหน้าปลายทางจากโฆษณา เมื่อติดตามได้",
    definitionEn: "Times a guest reached the destination page from the ad, when tracking allows",
    unit: "count",
    tone: "positive" as const,
  },
  {
    id: "video-view",
    name: "Video View / Engagement",
    group: "platform" as const,
    objectiveTh: "Awareness",
    objectiveEn: "Awareness",
    marketTh: "ใช้เมื่อวัตถุประสงค์เกี่ยวกับวิดีโอหรือการมีส่วนร่วม",
    marketEn: "Used when the objective involves video or engagement",
    definitionTh: "ยอดดูวิดีโอหรือการมีส่วนร่วม เมื่อเกี่ยวข้องกับวัตถุประสงค์ ไม่ใช่ผลรายได้",
    definitionEn: "Video views or engagement when relevant to the objective. Not a revenue result",
    unit: "count",
    tone: "positive" as const,
    relevant: true,
  },
  {
    id: "lead-inquiry",
    name: "Lead / Inquiry",
    group: "business" as const,
    objectiveTh: "Inquiry",
    objectiveEn: "Inquiry",
    marketTh: "กำหนดตามตลาดของแคมเปญ",
    marketEn: "Set per campaign market",
    definitionTh: "การสอบถามหรือลีดที่ตรวจสอบได้",
    definitionEn: "An enquiry or lead that can be checked",
    unit: "count",
    tone: "positive" as const,
  },
  {
    id: "booking-engine-start",
    name: "Booking Engine Start",
    group: "business" as const,
    objectiveTh: "Direct Booking",
    objectiveEn: "Direct Booking",
    marketTh: "กำหนดตามตลาดของแคมเปญ",
    marketEn: "Set per campaign market",
    definitionTh: "จำนวนครั้งที่เริ่มเข้าสู่ระบบจอง เมื่อติดตามได้",
    definitionEn: "Times a guest started the booking engine, when tracking allows",
    unit: "count",
    tone: "positive" as const,
  },
  {
    id: "booking-complete",
    name: "Booking Complete",
    group: "business" as const,
    objectiveTh: "Direct Booking",
    objectiveEn: "Direct Booking",
    marketTh: "กำหนดตามตลาดของแคมเปญ",
    marketEn: "Set per campaign market",
    definitionTh: "การจองที่ติดตามได้จนเสร็จ ไม่แสดงสาธารณะจนกว่าอนุมัติ",
    definitionEn: "A tracked completed booking. Hidden on the public page until approved",
    unit: "count",
    tone: "positive" as const,
  },
  {
    id: "cost-per-lead",
    name: "Cost per Lead",
    group: "business" as const,
    objectiveTh: "Inquiry",
    objectiveEn: "Inquiry",
    marketTh: "กำหนดตามตลาดของแคมเปญ",
    marketEn: "Set per campaign market",
    definitionTh: "ต้นทุนโฆษณาต่อลีดที่ตรวจสอบได้",
    definitionEn: "Ad cost against a checked lead",
    unit: "THB",
    tone: "target" as const,
  },
  {
    id: "cost-per-booking",
    name: "Cost per Booking",
    group: "business" as const,
    objectiveTh: "Direct Booking",
    objectiveEn: "Direct Booking",
    marketTh: "กำหนดตามตลาดของแคมเปญ",
    marketEn: "Set per campaign market",
    definitionTh: "ต้นทุนโฆษณาต่อการจองที่ติดตามได้",
    definitionEn: "Ad cost against a tracked booking",
    unit: "THB",
    tone: "target" as const,
  },
  {
    id: "roas",
    name: "ROAS",
    group: "business" as const,
    objectiveTh: "Direct Booking",
    objectiveEn: "Direct Booking",
    marketTh: "กำหนดตามตลาดของแคมเปญ",
    marketEn: "Set per campaign market",
    definitionTh: "รายได้จากการจองที่ติดตามได้เทียบกับต้นทุนโฆษณา ใช้เมื่ออนุมัติแล้วเท่านั้น",
    definitionEn: "Tracked booking revenue against ad cost, only with approved data",
    unit: "x",
    tone: "positive" as const,
  },
] as const;

const STALE_KPI_RE = /^(cpc|conversion-rate|booking-value|direct-booking-share)$/i;
const NEW_KPI_RE = /^(frequency|impressions|landing-page-view|video-view|lead-inquiry|booking-engine-start|booking-complete|cost-per-lead)$/i;

export function metaKpiGroupFrom(input: { id?: string; name?: string; group?: string }): MetaKpiGroup {
  if (input.group === "business" || input.group === "platform") return input.group;
  const key = `${input.id || ""} ${input.name || ""}`.toLowerCase();
  if (/\blead\b|\binquiry\b|booking|cost per|roas/.test(key)) return "business";
  return "platform";
}

export function metaKpiCatalogIsStale(kpis: Array<{ id?: string; name?: string }>) {
  if (!kpis.length) return true;
  const ids = kpis.map((item) => (item.id || item.name || "").trim());
  const hasOld = ids.some((id) => STALE_KPI_RE.test(id) || /^(cpc|conversion rate|booking value|direct booking share)$/i.test(id));
  const hasNew = ids.some((id) => NEW_KPI_RE.test(id));
  return hasOld && !hasNew;
}

export function metaKpiStatusLabel(status?: string) {
  if (status === "approved" || status === "Approved") return "Approved";
  if (status === "anonymised" || status === "Anonymised") return "Anonymised";
  if (status === "draft" || status === "Draft") return "Draft";
  return "Sample";
}

export function metaKpiSeriesReady(labels: string[], values: number[]) {
  return labels.length > 1 && labels.length === values.length && values.some((item) => Number.isFinite(item));
}

export function metaParseTargetNumber(value?: string) {
  const next = value?.trim() || "";
  if (!next) return null;
  const parsed = Number(next.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export const META_ENQUIRY_RECEIVE = [
  {
    id: "account-review",
    title: "Meta Ads Account Review",
    th: "ทบทวนบัญชี Meta Ads ที่มีอยู่ หรือจุดเริ่มต้นถ้ายังไม่มีบัญชี",
    en: "Review the current Meta Ads account, or the starting point if there is not one yet",
  },
  {
    id: "audience-creative",
    title: "Audience and Creative Review",
    th: "ทบทวนกลุ่มลูกค้า จุดเด่นของที่พัก และครีเอทีฟที่ใช้สื่อสาร",
    en: "Review the audience, what makes the stay distinctive, and the creative used",
  },
  {
    id: "campaign-objective",
    title: "Campaign Objective Plan",
    th: "จัด Objective ของแคมเปญให้สอดคล้องกับเป้าหมายการขายของโรงแรม โดยยังไม่สัญญาผลลัพธ์",
    en: "Match campaign objectives to the hotel’s sales goal, without a promised result",
  },
  {
    id: "landing-booking",
    title: "Landing Page / Booking Path Review",
    th: "ดูว่าโฆษณาพาไปหน้าใด และลูกค้าเดินเข้าสู่ระบบจองได้หรือไม่",
    en: "See which page the ad opens and whether the guest can continue into booking",
  },
  {
    id: "tracking",
    title: "Tracking and Measurement Plan",
    th: "วางแผนว่าจะวัดการสอบถามหรือการจองได้อย่างไรจาก Pixel และการตั้งค่าที่มีอยู่",
    en: "Plan how enquiry or booking can be measured with the Pixel and current setup",
  },
] as const;

export const META_ENQUIRY = {
  kicker: "Meta Ads",
  receiveTitle: {
    th: "โรงแรมจะได้อะไรจากการเริ่มทบทวน Meta Ads",
    en: "What the hotel receives from starting a Meta Ads review",
  },
  nextTitle: {
    th: "What Happens Next",
    en: "What Happens Next",
  },
  steps: {
    th: [
      "ส่งข้อมูลโรงแรมและเป้าหมายการขาย",
      "ทีมงานตรวจ Audience, Creative, Landing Page และ Tracking",
      "สรุป Campaign Direction และสิ่งที่ต้องเตรียม",
      "นัดคุย Scope, Budget และ Next Action",
    ],
    en: [
      "Send hotel details and the sales goal",
      "The team reviews Audience, Creative, Landing Page and Tracking",
      "Summarise Campaign Direction and what to prepare",
      "Arrange a conversation on Scope, Budget and Next Action",
    ],
  },
  heading: {
    th: "คุยเรื่อง Meta Ads สำหรับโรงแรม",
    en: "Talk about Meta Ads for the hotel",
  },
  lead: {
    th: "ส่งข้อมูลโรงแรม เว็บไซต์ และเป้าหมายการขาย ให้ทีมดูบัญชีโฆษณา กลุ่มลูกค้า ครีเอทีฟ หน้าเว็บ เส้นทางจอง และการวัดผลเบื้องต้น",
    en: "Send hotel details, the website, and the sales goal so the team can review the ads account, audience, creative, the page, the booking path, and tracking.",
  },
  submit: {
    th: "ส่งข้อมูลโรงแรม",
    en: "Send hotel details",
  },
  labels: {
    th: {
      name: "ชื่อผู้ติดต่อ",
      business: "ชื่อโรงแรม / กิจการ",
      contact: "เบอร์โทรหรืออีเมล",
      consent: "ข้าพเจ้ายินยอมให้ เดอะ เคพีไอ พลัส ใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับคำขอนี้ ตาม",
      privacy: "นโยบายความเป็นส่วนตัว",
    },
    en: {
      name: "Your name",
      business: "Hotel / business name",
      contact: "Phone or email",
      consent: "I agree that The KPI Plus may use this information to reply about this request, under the",
      privacy: "privacy policy",
    },
  },
  fields: {
    th: {
      website: "เว็บไซต์ / Booking Engine URL",
      websiteHint: "ลิงก์หน้าเว็บหรือหน้าจอง ถ้ามี",
      websiteInvalid: "กรุณาใส่ลิงก์ให้ถูกต้อง",
      goal: "เป้าหมาย",
      goalEmpty: "เลือกเป้าหมาย",
      goalDirect: "Direct Booking",
      goalAwareness: "Awareness",
      goalInquiry: "Inquiry",
      market: "ตลาดเป้าหมาย ประเทศ และภาษา",
      marketHint: "เช่น ไทย อังกฤษ หรือตลาดต้นทาง",
      adsStatus: "มีบัญชี Meta Ads อยู่แล้ว",
      adsEmpty: "เลือกสถานะบัญชี",
      adsYes: "Yes",
      adsNo: "No",
      adsUnsure: "Not sure",
      tracking: "สถานะ Pixel หรือ Conversion Tracking",
      trackingEmpty: "เลือกสถานะการติดตาม",
      trackingYes: "Installed",
      trackingNo: "Not installed",
      trackingUnsure: "Not sure",
      challenge: "ความท้าทายปัจจุบัน",
      challengeHint: "บอกสั้น ๆ ว่าติดตรงไหน",
      loading: "กำลังส่งข้อมูล กรุณารอสักครู่",
    },
    en: {
      website: "Website / Booking Engine URL",
      websiteHint: "The hotel website or booking-page link, if you have one",
      websiteInvalid: "Enter a valid link",
      goal: "Goal",
      goalEmpty: "Choose a goal",
      goalDirect: "Direct Booking",
      goalAwareness: "Awareness",
      goalInquiry: "Inquiry",
      market: "Target market, country, and language",
      marketHint: "For example Thai, English, or a source market",
      adsStatus: "Existing Meta Ads account",
      adsEmpty: "Choose account status",
      adsYes: "Yes",
      adsNo: "No",
      adsUnsure: "Not sure",
      tracking: "Pixel or conversion tracking status",
      trackingEmpty: "Choose tracking status",
      trackingYes: "Installed",
      trackingNo: "Not installed",
      trackingUnsure: "Not sure",
      challenge: "Current challenge",
      challengeHint: "A short note on where the work is stuck",
      loading: "Sending your message. Please wait.",
    },
  },
} as const;

export function metaEnquiryCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: META_ENQUIRY.kicker,
    heading: thai ? META_ENQUIRY.heading.th : META_ENQUIRY.heading.en,
    lead: thai ? META_ENQUIRY.lead.th : META_ENQUIRY.lead.en,
    submit: thai ? META_ENQUIRY.submit.th : META_ENQUIRY.submit.en,
    receiveTitle: thai ? META_ENQUIRY.receiveTitle.th : META_ENQUIRY.receiveTitle.en,
    nextTitle: thai ? META_ENQUIRY.nextTitle.th : META_ENQUIRY.nextTitle.en,
    receive: META_ENQUIRY_RECEIVE.map((item) => ({
      id: item.id,
      title: item.title,
      body: thai ? item.th : item.en,
    })),
    steps: thai ? [...META_ENQUIRY.steps.th] : [...META_ENQUIRY.steps.en],
    fields: thai ? META_ENQUIRY.fields.th : META_ENQUIRY.fields.en,
    labels: thai ? META_ENQUIRY.labels.th : META_ENQUIRY.labels.en,
  };
}

export function metaEnquiryReceiveIsStale(items: string[]) {
  const titles = META_ENQUIRY_RECEIVE.map((item) => item.title);
  if (items.length < titles.length) return true;
  return titles.some((title) => !items.includes(title));
}

export function metaEnquiryStepsAreStale(steps: string[]) {
  if (steps.length !== META_ENQUIRY.steps.th.length) return true;
  const blob = steps.join("\n");
  const hasNew =
    blob.includes("ทีมงานตรวจ Audience, Creative, Landing Page และ Tracking") ||
    blob.includes("The team reviews Audience, Creative, Landing Page and Tracking");
  return (
    !hasNew ||
    /Campaign Recommendation|Chat and Booking Path|Tracking \/ Conversion Plan|ช่องว่างและแนวทาง Campaign|Booking Path/.test(blob)
  );
}

export const META_TRACKING_BOUNDARY = {
  title: { th: "Tracking Boundary", en: "Tracking Boundary" },
  note: {
    th: "ขอบเขตการวัดผลขึ้นกับเว็บไซต์ ระบบจอง และการตั้งค่าที่มีอยู่ ไม่ใช้ตัวเลขที่ตรวจไม่ได้เป็นผลงาน",
    en: "What can be measured depends on the website, booking engine, and tracking already in place. Figures that cannot be checked are not used as proof of result.",
  },
  items: {
    th: [
      "วัดได้เฉพาะอีเวนต์ที่โรงแรมอนุญาตให้ติดตั้ง",
      "การสอบถาม การเข้าสู่ระบบจอง และการจองที่ติดตามได้ ใช้เมื่อระบบรองรับ",
      "ยอดจอง รายได้ และ ROAS ไม่แสดงสาธารณะจนกว่าโรงแรมอนุมัติข้อมูล",
      "โรงแรมเป็นผู้อนุมัติการติดตามและการรายงาน",
    ],
    en: [
      "Only events the hotel allows to be installed can be measured",
      "Enquiry, booking-engine entry, and a tracked booking are used when the system supports them",
      "Bookings, revenue, and ROAS stay off the public page until the hotel approves the data",
      "The hotel approves tracking setup and reporting",
    ],
  },
} as const;

export const META_SUPPORTED_EVENTS = {
  title: { th: "Supported events", en: "Supported events" },
  note: {
    th: "ใช้อีเวนต์เท่าที่โรงแรมอนุญาต และเท่าที่เว็บไซต์หรือระบบจองรองรับ ไม่ติดตั้งเกินที่อนุมัติ",
    en: "Use only the events the hotel allows, and only as far as the website or booking engine supports. Nothing is installed beyond that approval.",
  },
  items: {
    th: [
      "PageView — เมื่อโรงแรมอนุญาตให้วัดการเข้าหน้า",
      "Contact หรือ Lead — เมื่อมีเส้นทางสอบถามหรือข้อความ",
      "InitiateCheckout — เมื่อลูกค้าเข้าสู่ระบบจองได้",
      "Purchase — เมื่อการจองติดตามได้และโรงแรมอนุมัติให้รายงาน",
    ],
    en: [
      "PageView — when the hotel allows a page-view event",
      "Contact or Lead — when an enquiry or message path exists",
      "InitiateCheckout — when the guest can enter the booking engine",
      "Purchase — when a booking can be tracked and the hotel approves reporting it",
    ],
  },
} as const;

export const META_LANDING_CHECKLIST = {
  title: { th: "Landing Page Checklist", en: "Landing Page Checklist" },
  note: {
    th: "ตรวจหน้าปลายทางก่อนขยายงบ เพื่อให้โฆษณาพาลูกค้าไปหน้าที่เกี่ยวข้องและเดินเข้าสู่ระบบจองได้",
    en: "Review the destination page before extra spend, so the ad opens a relevant page and the guest can continue into booking.",
  },
  items: {
    th: [
      "โฆษณาพาไปหน้าที่ตรงกับข้อเสนอ ไม่ใช่แค่หน้าแรก",
      "ราคา ข้อเสนอ และห้องว่างที่แสดงตรงกับที่ขายได้",
      "ปุ่มจองและเส้นทางเข้าสู่ระบบจองใช้บนมือถือได้",
      "หน้าปลายทางชัด โหลดได้ และวัดการกระทำที่ตามมาได้",
    ],
    en: [
      "The ad opens a page that matches the offer, not only the homepage",
      "Rate, offer, and availability on the page match what can be sold",
      "The booking button and path work on a phone",
      "The destination page is clear, usable, and can measure the next action",
    ],
  },
} as const;

/** Serve only when a real approved Digital Marketing Team photo is uploaded. Never show this dummy path. */
export const META_TEAM_VISUAL_CANDIDATE = "/images/meta-ads-team-placeholder.webp";

export const META_TEAM_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  fit: "cover" as const,
  width: 1200,
  height: 800,
  displayWidth: 420,
  displayHeight: 280,
  label: "Replace with verified Digital Marketing Team image",
  alt: {
    th: "รอรูปทีม Digital Marketing ที่ตรวจแล้ว ไม่ใช่ภาพ AI ของบุคคล",
    en: "Replace with a verified Digital Marketing Team image, not an AI-generated person",
  },
} as const;

export const META_FAQS = {
  th: [
    {
      q: "Meta Ads เหมาะกับโรงแรมแบบใด",
      a: "เหมาะกับโรงแรมที่มีเป้าหมายการขายชัด กลุ่มลูกค้าที่ระบุได้ และเส้นทางหลังคลิก เช่น ทักข้อความ สอบถาม หรือเข้าสู่การจอง ขนาดโรงแรมไม่ใช่เกณฑ์หลัก ขึ้นกับข้อเสนอ ตลาด และว่าลูกค้าเดินต่อได้หลังเห็นโฆษณาหรือไม่ ไม่ได้หมายความว่าทุกโรงแรมควรเริ่มจากแคมเปญจองตรง",
    },
    {
      q: "ควรเริ่มจาก Awareness, Lead หรือ Direct Booking",
      a: "เริ่มจากเป้าหมายการขายของโรงแรม ไม่ใช่ลำดับตายตัว Awareness เหมาะเมื่อโรงแรมยังไม่เป็นที่รู้จัก Lead หรือการสอบถามเหมาะเมื่อทีมตอบลูกค้าได้ Direct Booking ใช้ได้เมื่อหน้าปลายทางและเส้นทางจองรับลูกค้าต่อได้ ทีมตรวจความพร้อมก่อนเลือกเป้าหมาย หน้านี้ไม่ระบุอัตราแปลงหรือระยะเวลาที่จะเห็นผล",
    },
    {
      q: "ต้องมี Website หรือ Booking Engine หรือไม่",
      a: "ไม่จำเป็นสำหรับทุกเป้าหมาย หากให้ลูกค้าทักข้อความหรือสอบถาม สามารถเริ่มจากเส้นทางนั้นได้ หากต้องการจองตรงและวัดการจอง ควรมีเว็บไซต์หรือระบบจองที่ลูกค้าเดินต่อได้ ทีมตรวจสิ่งที่มีอยู่จริง โรงแรมเป็นผู้ตัดสินใจว่าจะเพิ่มระบบเมื่อไร",
    },
    {
      q: "ต้องมี Creative กี่แบบ",
      a: "ไม่มีจำนวนตายตัว ควรมีครีเอทีฟที่สอดคล้องกับกลุ่มลูกค้า ข้อเสนอ และหน้าปลายทางที่ใช้งาน ความชัดและความสอดคล้องสำคัญกว่าจำนวนชิ้น หน้านี้ไม่ได้กำหนดโควตาครีเอทีฟ",
    },
    {
      q: "ใครเป็นผู้กำหนด Budget และ Promotion",
      a: "โรงแรมเป็นผู้อนุมัติงบและโปรโมชัน รวมถึงราคา ข้อเสนอ และช่วงเวลาที่ใช้ได้ ทีมเสนอโครงสร้างแคมเปญ กลุ่มลูกค้า และครีเอทีฟจากข้อมูลที่มี แล้วโรงแรมตัดสินใจงบ ข้อเสนอ และช่วงที่ขายได้",
    },
    {
      q: "ใช้ Pixel หรือ Conversion API อย่างไร",
      a: "ใช้เฉพาะเหตุการณ์ที่โรงแรมอนุญาต และตามเว็บไซต์ ระบบจอง และการตั้งค่าความยินยอมที่มีอยู่ จุดประสงค์คือวัดสิ่งที่ตรวจได้ ไม่ได้รับประกันยอดจอง การติดตั้งตกลงกับโรงแรมก่อนเริ่มเก็บข้อมูล",
    },
    {
      q: "วัด Booking จาก Meta Ads ได้อย่างไร",
      a: "วัดได้มากน้อยตามเว็บไซต์ ระบบจอง และการตั้งค่าติดตามผลที่มีอยู่ ทีมวางแผนจากสิ่งที่วัดได้จริง เช่น การเข้าหน้า การสอบถาม การเข้าสู่ระบบจอง หรือการจองที่ติดตามได้ ไม่ใช้ตัวเลขที่ยังตรวจไม่ได้เป็นผลงาน",
    },
    {
      q: "Remarketing ต้องใช้ข้อมูลอะไร",
      a: "ต้องมีวิธีที่โรงแรมอนุญาตในการรู้ว่ามีผู้เห็นโฆษณาหรือเข้าเว็บมาก่อน เช่น Pixel event ที่เปิดใช้ได้ และต้องมีหน้าหรือข้อเสนอที่ตรงกับกลุ่มนั้น หากยังไม่มีสัญญาณนี้ ยังตั้ง Remarketing ไม่ได้ การทบทวนไม่จำเป็นต้องมีรายชื่อลูกค้าครบก่อนเริ่ม หน้านี้ไม่ระบุขนาดกลุ่มที่เข้าถึงได้",
    },
    {
      q: "รองรับหลายประเทศหรือหลายภาษาได้หรือไม่",
      a: "ได้ตามตลาดและภาษาที่โรงแรมกำหนด ทีมแยกกลุ่มลูกค้า ครีเอทีฟ และหน้าปลายทางตามตลาดที่ตกลง ไม่ได้หมายความว่าจะเปิดทุกประเทศหรือทุกภาษาในครั้งเดียว",
    },
    {
      q: "ต้องใช้เวลานานเท่าไรจึงมีข้อมูลสำหรับ Optimize",
      a: "เมื่อแคมเปญเปิดแล้ว ทีมดูจากข้อมูลที่ตรวจได้ ปริมาณและความเร็วของข้อมูลขึ้นกับงบ กลุ่มลูกค้า และพฤติกรรมหลังคลิก หน้านี้ไม่กำหนดจำนวนวันหรือสัปดาห์ที่จะเริ่มปรับแคมเปญหรือเห็นผล",
    },
    {
      q: "มี Report ให้บ่อยแค่ไหน",
      a: "รอบรายงานตกลงในขอบเขตงานของแต่ละโรงแรม ผลลัพธ์ของงานนี้คือ Performance Summary and Next Action จากสิ่งที่วัดได้ โรงแรมเป็นผู้ตัดสินใจว่าจะคงแผน หยุดชั่วคราว หรือปรับแนวทาง หน้านี้ไม่ได้กำหนดความถี่เป็นรายวันหรือรายสัปดาห์",
    },
  ],
  en: [
    {
      q: "Which hotels are Meta Ads suitable for?",
      a: "They fit hotels with a clear sales goal, a defined audience, and a path after the click — such as a message, an enquiry, or a step into booking. Hotel size is not the main filter. Fit depends on the offer, the market, and whether the guest can continue after seeing the ad. That does not mean every hotel should start with a direct-booking campaign.",
    },
    {
      q: "Should we start with Awareness, Lead, or Direct Booking?",
      a: "Start from the hotel’s sales goal, not a fixed order. Awareness fits when the hotel is not yet known. Lead or enquiry fits when the team can reply. Direct Booking fits when the destination page and booking path can take the guest through. The team checks readiness before choosing the objective. This page does not state a conversion rate or a time to result.",
    },
    {
      q: "Do we need a website or a booking engine?",
      a: "Not for every objective. A message or enquiry path can start without a booking engine. Direct booking and booking measurement need a website or booking path the guest can continue into. The team reviews what already exists. The hotel decides when to add a system.",
    },
    {
      q: "How many creative versions are needed?",
      a: "There is no fixed number. Creative should match the audiences, offers, and destination pages in use. Clarity and fit matter more than a count of assets. This page does not set a creative quota.",
    },
    {
      q: "Who sets the budget and the promotion?",
      a: "The hotel approves the budget and the promotion, including rate, offer, and the dates it can run. The team proposes campaign structure, audience, and creative from the information available. The hotel then decides the spend, the offer, and the period that can be sold.",
    },
    {
      q: "How are Pixel or Conversion API used?",
      a: "They are used only for events the hotel allows, and only as far as the website, booking system, and consent settings support. The purpose is to measure what can be checked, not to guarantee bookings. Setup is agreed with the hotel before data is collected.",
    },
    {
      q: "How can bookings from Meta Ads be measured?",
      a: "It depends on the website, the booking engine, and the tracking already in place. The team plans from what can actually be measured — such as a page view, an enquiry, a step into the booking engine, or a tracked booking. Figures that cannot be checked are not used as proof of result.",
    },
    {
      q: "What data does remarketing need?",
      a: "It needs a method the hotel has allowed to recognise people who already saw an ad or visited the site, such as a Pixel event that can be used, plus a relevant page or offer. Without that signal, remarketing cannot be set up. A complete customer list is not required before the review. This page does not state a reachable audience size.",
    },
    {
      q: "Can several countries or languages be supported?",
      a: "Yes, for the markets and languages the hotel sets. The team separates audience, creative, and destination pages for the agreed markets. That does not mean every country or language is launched at once.",
    },
    {
      q: "How long before there is data to optimize?",
      a: "After a campaign is live, the team reviews from data that can be checked. How quickly that data builds depends on budget, audience, and behaviour after the click. This page does not set a number of days or weeks before optimisation or results appear.",
    },
    {
      q: "How often is there a report?",
      a: "Reporting rhythm is agreed in the scope for each hotel. The output is a Performance Summary and Next Action from what can be measured. The hotel decides whether to keep, pause, or change the plan. This page does not set a daily or weekly frequency.",
    },
  ],
} as const;

export function metaFaqs(locale: Locale) {
  const rows = locale === "th" ? META_FAQS.th : META_FAQS.en;
  return rows.map((item) => ({ q: item.q, a: item.a }));
}

export function metaFaqsAreStale(faqs: { q: string }[]) {
  if (!faqs.length) return true;
  const questions = faqs.map((item) => item.q.trim());
  const hasSet = (expected: readonly { q: string }[]) => expected.every((item) => questions.includes(item.q));
  return !hasSet(META_FAQS.th) && !hasSet(META_FAQS.en);
}
