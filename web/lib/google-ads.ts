import type { Locale } from "@/lib/seo";

export type AdsVisualStatus = "placeholder" | "sample" | "approved" | "real";
export type AdsKpiStatus = "draft" | "sample" | "approved" | "anonymised";

export const ADS_SAMPLE_LABEL = {
  th: "ตัวอย่างข้อมูล",
  en: "Sample Visual",
} as const;

export function adsSampleLabel(locale: Locale) {
  return locale === "th" ? ADS_SAMPLE_LABEL.th : ADS_SAMPLE_LABEL.en;
}

export function adsShowsSampleBadge(status?: string) {
  return status !== "approved" && status !== "real";
}

/** Deterministic sample workflow. Omit src when the file is missing; do not invent a live Ads screenshot. */
export const ADS_HERO_VISUAL_CANDIDATE = "/images/google-ads-management-hero-placeholder.webp";

export const ADS_HERO_VISUAL = {
  recommendedSize: "1600 × 1000 px",
  ratio: "8 / 5",
  fit: "contain" as const,
  width: 1600,
  height: 1000,
  displayWidth: 560,
  displayHeight: 350,
  alt: {
    th: "ตัวอย่าง Hotel Search และ Booking Campaign ที่เชื่อมคำค้น โฆษณา หน้าโรงแรม และเส้นทางจอง โดยปิดข้อมูลบัญชี",
    en: "Sample Hotel Search and Booking Campaign connecting search, the ad, the hotel page, and the booking path, with account data redacted",
  },
  label: {
    th: "ตัวอย่าง Hotel Search & Booking Campaign",
    en: "Sample Hotel Search & Booking Campaign",
  },
  meta: {
    th: "Sample workflow · Search, Hotel Ads and Direct Booking",
    en: "Sample workflow · Search, Hotel Ads and Direct Booking",
  },
  caption: {
    th: "เชื่อมคำค้น โฆษณา หน้าโรงแรม และเส้นทางการจองให้วัดผลได้ในระบบเดียว",
    en: "Connect search, the ad, the hotel page, and the booking path so results can be reviewed in one system",
  },
} as const;

/** Search-to-booking journey. Never reuse the Hero asset. */
export const ADS_VISIBILITY_VISUAL_CANDIDATE = "/images/google-ads-management-visibility-placeholder.webp";

export const ADS_VISIBILITY_PATH = [
  { en: "Search Query", th: "คำค้น" },
  { en: "Ad / Listing", th: "โฆษณา / รายการ" },
  { en: "Hotel Page", th: "หน้าโรงแรม" },
  { en: "Booking Engine", th: "ระบบจอง" },
  { en: "Conversion", th: "Conversion" },
] as const;

export const ADS_VISIBILITY_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  fit: "contain" as const,
  width: 1200,
  height: 800,
  displayWidth: 480,
  displayHeight: 320,
  alt: {
    th: "ตัวอย่าง Search Visibility และ Hotel Booking Page จากคำค้น โฆษณาหรือรายการ หน้าโรงแรม และระบบจอง โดยปิดข้อมูลบัญชี",
    en: "Sample Search Visibility and Hotel Booking Page from the query, ad or listing, hotel page, and booking engine, with account data redacted",
  },
  label: {
    th: "ตัวอย่าง Search Visibility และ Hotel Booking Page",
    en: "Sample Search Visibility and Hotel Booking Page",
  },
  meta: {
    th: "Sample data · Search Ads, Hotel Ads, Free Booking Links and Booking Path",
    en: "Sample data · Search Ads, Hotel Ads, Free Booking Links and Booking Path",
  },
  caption: {
    th: "จากคำค้นไปสู่หน้าโรงแรมและระบบจอง ไม่ใช่ผลอันดับหรือบัญชีโฆษณาของโรงแรมรายใด",
    en: "From the search to the hotel page and booking engine, not a ranking result or one hotel’s ad account",
  },
} as const;

export const ADS_FRAMEWORK_VISUAL_CANDIDATE = "/images/google-ads-search-readiness-framework-placeholder.webp";

export const ADS_READINESS_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างกรอบความพร้อมจากคำค้นถึงการจอง ครอบคลุม Search Intent โครงสร้างแคมเปญ หน้าโรงแรม เส้นทางจอง และการวัดผล",
    en: "Sample Search-to-Booking Readiness Framework covering search intent, campaign structure, landing page, booking path, and measurement",
  },
  label: {
    th: "Search-to-Booking Readiness Framework — Sample",
    en: "Search-to-Booking Readiness Framework — Sample",
  },
  meta: {
    th: "Sample framework · Search Intent to Measurement",
    en: "Sample framework · Search Intent to Measurement",
  },
  caption: {
    th: "กรอบตรวจความพร้อม ไม่ใช่ผลแคมเปญหรืออันดับบน Google",
    en: "A readiness framework, not campaign results or a search ranking",
  },
} as const;

export const ADS_CHANNEL_VISUAL_CANDIDATE = "/images/google-ads-channel-comparison-placeholder.webp";

export const ADS_CHANNEL_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างเปรียบเทียบ Search Ads, Hotel Ads และ Free Booking Links จากกรณีที่ใช้ การควบคุม สิ่งที่ต้องมี ผลที่คาดหวัง และตัวชี้วัด",
    en: "Sample comparison of Search Ads, Hotel Ads, and Free Booking Links by use case, control, required input, expected output, and KPIs",
  },
  label: {
    th: "Search Ads vs Hotel Ads vs Free Booking Links — Sample comparison",
    en: "Search Ads vs Hotel Ads vs Free Booking Links — Sample comparison",
  },
  meta: {
    th: "Sample comparison · Search Ads, Hotel Ads and Free Booking Links",
    en: "Sample comparison · Search Ads, Hotel Ads and Free Booking Links",
  },
  caption: {
    th: "ตารางเปรียบเทียบช่องทาง ไม่ใช่ผลงบ ผลการค้นหา หรืออัตราแปลงจริง",
    en: "A channel comparison, not a budget result, search screenshot, or live conversion figure",
  },
} as const;

export const ADS_WORKFLOW_VISUAL_CANDIDATE = "/images/google-ads-campaign-workflow-placeholder.webp";

export const ADS_WORKFLOW_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 640,
  displayHeight: 360,
  alt: {
    th: "ตัวอย่างลำดับงานแคมเปญ Google Ads จาก Audit ไป Structure, Launch, Optimize และ Report พร้อมสิ่งที่ได้ในแต่ละขั้น",
    en: "Sample Google Ads campaign workflow from Audit to Structure, Launch, Optimize, and Report, with the output of each step",
  },
  label: {
    th: "Google Ads Campaign Workflow — Sample process",
    en: "Google Ads Campaign Workflow — Sample process",
  },
  meta: {
    th: "Sample process · Audit to Report",
    en: "Sample process · Audit to Report",
  },
  caption: {
    th: "แผนภาพกระบวนการแคมเปญ ไม่ใช่รูปประชุมทั่วไปหรือผลบัญชีโฆษณา",
    en: "A campaign process, not a generic meeting photo or live ad-account result",
  },
} as const;

export const ADS_KPI_VISUAL_CANDIDATE = "/images/google-ads-performance-kpi-placeholder.webp";

export const ADS_KPI_COLORS = {
  positive: "#A2DC25",
  target: "#EBE722",
  risk: "#F59E0B",
  axis: "#0B1F33",
  label: "#617487",
  grid: "#E3E8EB",
} as const;

export const ADS_KPI_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  fit: "contain" as const,
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  alt: {
    th: "ตัวอย่างกรอบตัวชี้วัด Google Ads ไม่ใช่ CTR CPC ROAS ยอดจอง หรือรายได้จริง",
    en: "Sample Google Ads KPI frame, not a live CTR, CPC, ROAS, booking, or revenue figure",
  },
  label: {
    th: "Google Ads Performance KPI · Sample data",
    en: "Google Ads Performance KPI · Sample data",
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

export const ADS_RELATED_VISUAL_CANDIDATE = "/images/google-ads-related-content-placeholder.webp";

export const ADS_RELATED_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  fit: "contain" as const,
  width: 1200,
  height: 800,
  displayWidth: 520,
  displayHeight: 347,
  alt: {
    th: "ตัวอย่างเนื้อหา Google Ads และการตลาดโรงแรม ไม่ใช่รูป Hero รูป Visibility หรือผลงานลูกค้า",
    en: "Sample Google Ads and hotel marketing content, not the hero, visibility visual, or a client result",
  },
  label: {
    th: "Google Ads / Hotel Marketing Content",
    en: "Google Ads / Hotel Marketing Content",
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

export const ADS_RELATED_VISUAL_OPTIONS = [
  { id: "campaign-report", label: "Campaign Report" },
  { id: "search-intent", label: "Search Intent Review" },
  { id: "booking-funnel", label: "Booking Funnel" },
  { id: "tracking-audit", label: "Tracking Audit" },
  { id: "marketing-workshop", label: "Hotel Marketing Workshop" },
] as const;

export const ADS_FRAMEWORK_ROWS = [
  {
    id: "search-intent",
    area: "Search Intent",
    problemTh: "คำค้นไม่ตรงพฤติกรรมลูกค้า",
    problemEn: "Keywords do not match guest intent",
    inspectTh: "Search Terms และตลาดเป้าหมาย",
    inspectEn: "Search Terms and target market",
    improveTh: "แยกกลุ่มคำค้นตามเจตนา",
    improveEn: "Separate intent groups",
    outputTh: "Search Intent Map",
    outputEn: "Search Intent Map",
  },
  {
    id: "campaign-structure",
    area: "Campaign Structure",
    problemTh: "แคมเปญถูกรวมกันจนดูผลแยกได้ยาก",
    problemEn: "Campaigns are mixed together",
    inspectTh: "โครงสร้างแคมเปญ กลุ่มโฆษณา คำค้น และกลุ่มเป้าหมาย",
    inspectEn: "Campaign, ad group, keyword and audience setup",
    improveTh: "จัดโครงสร้างใหม่ตามเจตนา",
    improveEn: "Reorganize structure",
    outputTh: "Campaign Plan",
    outputEn: "Campaign Plan",
  },
  {
    id: "landing-page",
    area: "Landing Page",
    problemTh: "โฆษณาพาไปหน้าที่ไม่ชัด",
    problemEn: "Ad leads to an unclear page",
    inspectTh: "ความเกี่ยวข้อง ปุ่มดำเนินการ มือถือ และความเร็ว",
    inspectEn: "Relevance, CTA, mobile and speed",
    improveTh: "ปรับหน้าปลายทางให้ตรงคำค้น",
    improveEn: "Improve destination page",
    outputTh: "Landing Page Checklist",
    outputEn: "Landing Page Checklist",
  },
  {
    id: "booking-experience",
    area: "Booking Experience",
    problemTh: "เส้นทางจองเดินต่อยาก",
    problemEn: "Booking path is difficult",
    inspectTh: "ปุ่มจองและขั้นตอนในระบบจอง",
    inspectEn: "Booking CTA and engine flow",
    improveTh: "ลดจุดสะดุดหลังคลิก",
    improveEn: "Reduce friction",
    outputTh: "Booking Path Review",
    outputEn: "Booking Path Review",
  },
  {
    id: "tracking",
    area: "Tracking & Measurement",
    problemTh: "วัดการจองจบไม่ได้",
    problemEn: "Booking completion is not measured",
    inspectTh: "อีเวนต์และการให้เครดิต",
    inspectEn: "Events and attribution",
    improveTh: "กำหนด conversion ที่วัดได้",
    improveEn: "Define conversion events",
    outputTh: "Measurement Plan",
    outputEn: "Measurement Plan",
  },
] as const;

/** @deprecated Use ADS_FRAMEWORK_ROWS. Kept for older CMS bodies. */
export const ADS_READINESS_ITEMS = ADS_FRAMEWORK_ROWS.map((row) => ({
  id: row.id,
  checkTh: row.inspectTh,
  checkEn: row.inspectEn,
  whyTh: row.problemTh,
  whyEn: row.problemEn,
  outputTh: row.outputTh,
  outputEn: row.outputEn,
}));

export const ADS_CHANNEL_ROWS = [
  {
    id: "search-ads",
    channel: "Search Ads",
    useCaseTh: "จับเจตนาการค้นหาที่กำลังเกิดขึ้น เช่น ชื่อโรงแรมหรือที่พักในพื้นที่",
    useCaseEn: "Capture active search intent, such as a hotel name or an area stay",
    controlTh: "คำค้น กลุ่มเป้าหมาย งบ ข้อความโฆษณา และหน้าปลายทาง",
    controlEn: "Keyword, audience, budget, ad copy, landing page",
    inputTh: "หน้าเว็บที่ตรงคำค้นและเส้นทางจอง",
    inputEn: "A matching landing page and booking path",
    outputTh: "ทราฟฟิกที่มีคุณภาพและเส้นทางจองที่วัดได้",
    outputEn: "Qualified traffic and a measurable booking path",
    kpiTh: "CTR, CPC, conversion rate, cost per booking",
    kpiEn: "CTR, CPC, conversion rate, cost per booking",
    roleTh: "จับเจตนาการค้นหาที่กำลังเกิดขึ้น เช่น ชื่อโรงแรมหรือที่พักในพื้นที่",
    roleEn: "Capture active search intent, such as a hotel name or an area stay",
    needTh: "หน้าเว็บที่ตรงคำค้นและเส้นทางจอง",
    needEn: "A matching landing page and booking path",
    hotelTh: "โรงแรมยืนยันข้อเสนอและหน้าปลายทาง",
    hotelEn: "The hotel confirms the offer and destination page",
  },
  {
    id: "hotel-ads",
    channel: "Hotel Ads",
    useCaseTh: "แสดงราคาและห้องว่างในบริบทการค้นหาโรงแรม เมื่อลูกค้ากำลังเปรียบเทียบที่พัก",
    useCaseEn: "Show hotel rates and availability in a hotel-search context",
    controlTh: "ราคา ห้องว่าง ฟีด หน้าปลายทาง และตลาด",
    controlEn: "Rates, availability, feed, landing page, market",
    inputTh: "การเชื่อมต่อราคาและห้องว่างที่ใช้งานได้",
    inputEn: "A working rate and availability connection",
    outputTh: "คลิกจากรายการโรงแรมและเส้นทางจอง",
    outputEn: "Hotel listing clicks and a booking path",
    kpiTh: "clicks, bookings, cost per booking, conversion",
    kpiEn: "clicks, bookings, cost per booking, conversion",
    roleTh: "แสดงราคาและห้องว่างในบริบทการค้นหาโรงแรม เมื่อลูกค้ากำลังเปรียบเทียบที่พัก",
    roleEn: "Show hotel rates and availability in a hotel-search context",
    needTh: "การเชื่อมต่อราคาและห้องว่างที่ใช้งานได้",
    needEn: "A working rate and availability connection",
    hotelTh: "โรงแรมอนุมัติข้อมูลราคาที่แสดง",
    hotelEn: "The hotel approves the rates that appear",
  },
  {
    id: "free-links",
    channel: "Free Booking Links",
    useCaseTh: "เพิ่มช่องทางจองตรงโดยไม่เสียค่าโฆษณาต่อคลิก",
    useCaseEn: "Provide a direct-booking option without a per-click ad fee",
    controlTh: "หน้าโรงแรม ระบบจอง ฟีด และปุ่มจองตรง",
    controlEn: "Hotel page, booking engine, feed and direct CTA",
    inputTh: "หน้าโรงแรม ระบบจอง และข้อมูลราคา-ห้องว่างที่ถูกต้อง",
    inputEn: "Hotel page, booking engine, and a correct rate feed",
    outputTh: "คลิกตรงและโอกาสในการจอง",
    outputEn: "Direct clicks and booking opportunities",
    kpiTh: "direct clicks, bookings, conversion rate",
    kpiEn: "direct clicks, bookings, conversion rate",
    roleTh: "เพิ่มช่องทางจองตรงโดยไม่เสียค่าโฆษณาต่อคลิก",
    roleEn: "Provide a direct-booking option without a per-click ad fee",
    needTh: "หน้าโรงแรม ระบบจอง และข้อมูลราคา-ห้องว่างที่ถูกต้อง",
    needEn: "Hotel page, booking engine, and a correct rate feed",
    hotelTh: "โรงแรมดูแลความพร้อมของข้อมูล",
    hotelEn: "The hotel keeps the feed data ready",
  },
] as const;

export const ADS_CHANNEL_DECISIONS = [
  {
    id: "search-intent",
    th: "เจตนาการค้นหาคืออะไร?",
    en: "What is the search intent?",
  },
  {
    id: "page-engine",
    th: "หน้าโรงแรมและระบบจองพร้อมหรือยัง?",
    en: "Is the hotel page and booking engine ready?",
  },
  {
    id: "rate-feed",
    th: "ส่งข้อมูลราคาและห้องว่างได้หรือไม่?",
    en: "Can rate and availability data be supplied?",
  },
  {
    id: "conversion",
    th: "ติดตาม conversion การจองได้หรือไม่?",
    en: "Can booking conversion be tracked?",
  },
] as const;

export const ADS_WORKFLOW_STEPS = [
  {
    id: "audit",
    number: "01",
    titleTh: "Audit",
    titleEn: "Audit",
    ownerTh: "เดอะ เคพีไอ พลัส ร่วมกับโรงแรม",
    ownerEn: "The KPI Plus with the hotel",
    inputTh: "เว็บไซต์ ระบบจอง Google Ads ที่ใช้อยู่ ตลาดเป้าหมาย",
    inputEn: "Website, booking system, current Google Ads, target market",
    actionTh: "ตรวจเจตนาการค้นหา หน้าปลายทาง เส้นทางจอง และการติดตามผลที่วัดได้",
    actionEn: "Review search intent, landing pages, the booking path, and what can be measured",
    outputTh: "Tracking and Landing Page Checklist",
    outputEn: "Tracking and Landing Page Checklist",
    nextDecisionTh: "หากเว็บไซต์หรือระบบจองยังไม่พร้อม โรงแรมเป็นผู้ตัดสินใจว่าจะปรับส่วนนั้นก่อนหรือไม่",
    nextDecisionEn: "If the site or booking path is not ready, the hotel decides whether that comes first",
    changeTh: "ตรวจความพร้อม",
    changeEn: "Inspect readiness",
    handoffTh: "หากเว็บไซต์หรือระบบจองยังไม่พร้อม โรงแรมเป็นผู้ตัดสินใจว่าจะปรับส่วนนั้นก่อนหรือไม่",
    handoffEn: "If the site or booking path is not ready, the hotel decides whether that comes first",
  },
  {
    id: "structure",
    number: "02",
    titleTh: "Structure",
    titleEn: "Structure",
    ownerTh: "เดอะ เคพีไอ พลัส จัดแคมเปญ โรงแรมอนุมัติข้อเสนอ",
    ownerEn: "The KPI Plus sets the campaign. The hotel approves the offer",
    inputTh: "Tracking and Landing Page Checklist คำค้น งบ และข้อเสนอ",
    inputEn: "Tracking and Landing Page Checklist, searches, budget, and the offer",
    actionTh: "แยกกลุ่มเจตนา กำหนดโครงสร้างแคมเปญ ข้อความ หน้าปลายทาง และสิ่งที่จะวัด",
    actionEn: "Separate intent groups and set campaign structure, ad copy, destination pages, and measurement",
    outputTh: "Campaign Plan",
    outputEn: "Campaign Plan",
    nextDecisionTh: "โรงแรมเป็นผู้อนุมัติข้อเสนอ ราคา และงบที่พร้อมใช้",
    nextDecisionEn: "The hotel approves the offer, rate, and budget that can go live",
    changeTh: "วางแผนโครงสร้าง",
    changeEn: "Set the plan",
    handoffTh: "โรงแรมเป็นผู้อนุมัติข้อเสนอ ราคา และงบที่พร้อมใช้",
    handoffEn: "The hotel approves the offer, rate, and budget that can go live",
  },
  {
    id: "launch",
    number: "03",
    titleTh: "Launch",
    titleEn: "Launch",
    ownerTh: "เดอะ เคพีไอ พลัส เปิดแคมเปญ โรงแรมยืนยันข้อเสนอที่ใช้งาน",
    ownerEn: "The KPI Plus launches. The hotel confirms the live offer",
    inputTh: "Campaign Plan ข้อเสนอที่อนุมัติ และการตั้งค่าติดตามผล",
    inputEn: "Campaign Plan, approved offer, and tracking setup",
    actionTh: "สร้างแคมเปญ ตรวจโฆษณา หน้าปลายทาง การติดตามผล แล้วเปิดใช้งาน",
    actionEn: "Build the campaigns, check ads, landing pages, and tracking, then go live",
    outputTh: "Campaign QA Checklist",
    outputEn: "Campaign QA Checklist",
    nextDecisionTh: "ไม่เริ่มซื้อคลิกเพิ่มถ้าลูกค้ายังเดินเข้าสู่ระบบจองไม่ได้ เว้นแต่โรงแรมตัดสินใจให้ทำต่อ",
    nextDecisionEn: "Extra clicks are not bought if the guest cannot reach booking, unless the hotel decides to continue",
    changeTh: "เปิดใช้หลังตรวจ QA",
    changeEn: "Go live after QA",
    handoffTh: "ไม่เริ่มซื้อคลิกเพิ่มถ้าลูกค้ายังเดินเข้าสู่ระบบจองไม่ได้ เว้นแต่โรงแรมตัดสินใจให้ทำต่อ",
    handoffEn: "Extra clicks are not bought if the guest cannot reach booking, unless the hotel decides to continue",
  },
  {
    id: "optimize",
    number: "04",
    titleTh: "Optimize",
    titleEn: "Optimize",
    ownerTh: "เดอะ เคพีไอ พลัส ทบทวน โรงแรมตัดสินใจปรับ",
    ownerEn: "The KPI Plus reviews. The hotel decides the next change",
    inputTh: "คำค้น พฤติกรรมบนหน้าเว็บ และการกระทำในเส้นทางจอง",
    inputEn: "Search terms, landing-page behaviour, and booking-path actions",
    actionTh: "ปรับคำค้น งบ โฆษณา และหน้าปลายทางจากข้อมูลที่ตรวจสอบได้",
    actionEn: "Adjust keywords, budget, ads, and destination pages from data that can be checked",
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
    number: "05",
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

export type AdsKpiTone = "positive" | "target" | "risk";

export const ADS_KPIS = [
  {
    id: "impressions",
    name: "Impressions",
    definitionTh: "จำนวนครั้งที่โฆษณาแสดง",
    definitionEn: "Times the ad was shown",
    unit: "count",
    contextTh: "Search Ads / Hotel Ads",
    contextEn: "Search Ads / Hotel Ads",
    tone: "positive" as const,
  },
  {
    id: "ctr",
    name: "CTR",
    definitionTh: "สัดส่วนคลิกต่อครั้งที่โฆษณาแสดง",
    definitionEn: "Clicks as a share of impressions",
    unit: "%",
    contextTh: "Search Ads / Hotel Ads",
    contextEn: "Search Ads / Hotel Ads",
    tone: "positive" as const,
  },
  {
    id: "cpc",
    name: "CPC",
    definitionTh: "ต้นทุนเฉลี่ยต่อคลิก",
    definitionEn: "Average cost per click",
    unit: "THB",
    contextTh: "Search Ads / Hotel Ads",
    contextEn: "Search Ads / Hotel Ads",
    tone: "target" as const,
  },
  {
    id: "conversion-rate",
    name: "Conversion Rate",
    definitionTh: "สัดส่วนคลิกที่กลายเป็น conversion ที่ติดตามได้",
    definitionEn: "Share of clicks that become a tracked conversion",
    unit: "%",
    contextTh: "Booking path",
    contextEn: "Booking path",
    tone: "positive" as const,
  },
  {
    id: "cost-per-booking",
    name: "Cost per Booking",
    definitionTh: "ต้นทุนโฆษณาต่อการจองที่ติดตามได้",
    definitionEn: "Ad cost against a tracked booking",
    unit: "THB",
    contextTh: "Search Ads / Hotel Ads",
    contextEn: "Search Ads / Hotel Ads",
    tone: "target" as const,
  },
  {
    id: "booking-value",
    name: "Booking Value",
    definitionTh: "มูลค่าการจองที่ติดตามได้ในช่วงที่ทบทวน",
    definitionEn: "Value of tracked bookings in the review period",
    unit: "THB",
    contextTh: "Direct booking path",
    contextEn: "Direct booking path",
    tone: "positive" as const,
  },
  {
    id: "roas",
    name: "ROAS",
    definitionTh: "รายได้จากการจองที่ติดตามได้เทียบกับต้นทุนโฆษณา",
    definitionEn: "Revenue from tracked bookings against ad cost",
    unit: "x",
    contextTh: "Campaign review",
    contextEn: "Campaign review",
    tone: "positive" as const,
  },
  {
    id: "direct-booking-share",
    name: "Direct Booking Share",
    definitionTh: "สัดส่วนการจองที่ติดตามได้ซึ่งมาจากช่องทางของโรงแรมเอง",
    definitionEn: "Share of tracked bookings that came through the hotel’s own path",
    unit: "%",
    contextTh: "Free Booking Links / hotel website",
    contextEn: "Free Booking Links / hotel website",
    tone: "positive" as const,
  },
] as const;

export function adsKpiStatusLabel(status?: string) {
  if (status === "approved" || status === "Approved") return "Approved";
  if (status === "anonymised" || status === "Anonymised") return "Anonymised";
  if (status === "draft" || status === "Draft") return "Draft";
  return "Sample";
}

export function adsKpiSeriesReady(labels: string[], values: number[]) {
  return labels.length > 1 && labels.length === values.length && values.some((item) => Number.isFinite(item));
}

export function adsParseTargetNumber(value?: string) {
  const next = value?.trim() || "";
  if (!next) return null;
  const parsed = Number(next.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export const ADS_ENQUIRY_RECEIVE = [
  {
    id: "account-review",
    title: "Google Ads Account Review",
    th: "ทบทวนบัญชี Google Ads ที่มีอยู่ หรือจุดเริ่มต้นถ้ายังไม่มีบัญชี",
    en: "Review the current Google Ads account, or the starting point if there is not one yet",
  },
  {
    id: "search-intent",
    title: "Search Intent Review",
    th: "ทบทวนคำค้นชื่อโรงแรมและคำค้นที่พักในพื้นที่",
    en: "Review hotel-name searches and area-stay searches",
  },
  {
    id: "landing-booking",
    title: "Landing Page and Booking Path Review",
    th: "ดูว่าโฆษณาพาไปหน้าใด และลูกค้าเดินเข้าสู่ระบบจองได้หรือไม่",
    en: "See which page the ad opens and whether the guest can continue into booking",
  },
  {
    id: "tracking",
    title: "Tracking / Conversion Plan",
    th: "วางแผนว่าจะวัดการสอบถามหรือการจองได้อย่างไรจากระบบที่มีอยู่",
    en: "Plan how enquiry or booking can be measured with the current setup",
  },
  {
    id: "campaign-recommendation",
    title: "Campaign Recommendation",
    th: "แนวทางแคมเปญที่ควรเริ่ม โดยยังไม่สัญญาผลลัพธ์",
    en: "A campaign direction to start with, without a promised result",
  },
] as const;

export const ADS_ENQUIRY = {
  kicker: "Google Ads",
  receiveTitle: {
    th: "โรงแรมจะได้อะไรจากการเริ่มทบทวน Google Ads",
    en: "What the hotel receives from starting a Google Ads review",
  },
  nextTitle: {
    th: "What Happens Next",
    en: "What Happens Next",
  },
  steps: {
    th: [
      "ส่งข้อมูลโรงแรมและเป้าหมายการขาย",
      "ทีมงานตรวจสอบ Search, Landing Page และ Booking Path",
      "สรุปช่องว่างและแนวทาง Campaign",
      "นัดคุย Scope, Budget และ Next Action",
    ],
    en: [
      "Send hotel details and the sales goal",
      "The team reviews Search, Landing Page and Booking Path",
      "Summarise the gaps and a campaign direction",
      "Arrange a conversation on Scope, Budget and Next Action",
    ],
  },
  heading: {
    th: "เริ่มทบทวน Google Ads ของโรงแรม",
    en: "Start a Google Ads review for the hotel",
  },
  lead: {
    th: "ส่งข้อมูลโรงแรม เว็บไซต์ และเป้าหมายการขาย ให้ทีมดูบัญชีโฆษณา คำค้น หน้าเว็บ เส้นทางจอง และการวัดผลเบื้องต้น",
    en: "Send hotel details, the website, and the sales goal so the team can review the ads account, search, the page, the booking path, and tracking.",
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
      goalExpansion: "Market Expansion",
      market: "ตลาดเป้าหมายและภาษา",
      marketHint: "เช่น ไทย อังกฤษ หรือตลาดต้นทาง",
      adsStatus: "มีบัญชี Google Ads อยู่แล้ว",
      adsEmpty: "เลือกสถานะบัญชี",
      adsYes: "Yes",
      adsNo: "No",
      adsUnsure: "Not sure",
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
      goalExpansion: "Market Expansion",
      market: "Target market and language",
      marketHint: "For example Thai, English, or a source market",
      adsStatus: "Existing Google Ads account",
      adsEmpty: "Choose account status",
      adsYes: "Yes",
      adsNo: "No",
      adsUnsure: "Not sure",
      challenge: "Current challenge",
      challengeHint: "A short note on where the work is stuck",
      loading: "Sending your message. Please wait.",
    },
  },
} as const;

export function adsEnquiryCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: ADS_ENQUIRY.kicker,
    heading: thai ? ADS_ENQUIRY.heading.th : ADS_ENQUIRY.heading.en,
    lead: thai ? ADS_ENQUIRY.lead.th : ADS_ENQUIRY.lead.en,
    submit: thai ? ADS_ENQUIRY.submit.th : ADS_ENQUIRY.submit.en,
    receiveTitle: thai ? ADS_ENQUIRY.receiveTitle.th : ADS_ENQUIRY.receiveTitle.en,
    nextTitle: thai ? ADS_ENQUIRY.nextTitle.th : ADS_ENQUIRY.nextTitle.en,
    receive: ADS_ENQUIRY_RECEIVE.map((item) => ({
      id: item.id,
      title: item.title,
      body: thai ? item.th : item.en,
    })),
    steps: thai ? [...ADS_ENQUIRY.steps.th] : [...ADS_ENQUIRY.steps.en],
    fields: thai ? ADS_ENQUIRY.fields.th : ADS_ENQUIRY.fields.en,
    labels: thai ? ADS_ENQUIRY.labels.th : ADS_ENQUIRY.labels.en,
  };
}

export const ADS_TRACKING_BOUNDARY = {
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

export const ADS_LANDING_CHECKLIST = {
  title: { th: "Landing Page Checklist", en: "Landing Page Checklist" },
  note: {
    th: "ตรวจหน้าปลายทางก่อนขยายงบ เพื่อให้โฆษณาพาลูกค้าไปหน้าที่เกี่ยวข้องและเดินเข้าสู่ระบบจองได้",
    en: "Review the destination page before extra spend, so the ad opens a relevant page and the guest can continue into booking.",
  },
  items: {
    th: [
      "โฆษณาพาไปหน้าที่ตรงคำค้น ไม่ใช่แค่หน้าแรก",
      "ราคา ข้อเสนอ และห้องว่างที่แสดงตรงกับที่ขายได้",
      "ปุ่มจองและเส้นทางเข้าสู่ระบบจองใช้บนมือถือได้",
      "หน้าปลายทางชัด โหลดได้ และวัดการกระทำที่ตามมาได้",
    ],
    en: [
      "The ad opens a page that matches the search, not only the homepage",
      "Rate, offer, and availability on the page match what can be sold",
      "The booking button and path work on a phone",
      "The destination page is clear, usable, and can measure the next action",
    ],
  },
} as const;

/** Serve only when a real approved Digital Marketing Team photo is uploaded. Never show this dummy path. */
export const ADS_TEAM_VISUAL_CANDIDATE = "/images/google-ads-team-placeholder.webp";

export const ADS_TEAM_VISUAL = {
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

export const ADS_FAQS = {
  th: [
    {
      q: "Google Ads ต่างจาก Hotel Ads อย่างไร",
      a: "ในหน้านี้ Google Ads มักหมายถึง Search Ads คือโฆษณาข้อความที่ตอบคำค้น และเปิดหน้าที่เลือกไว้ Hotel Ads เป็นรูปแบบการค้นหาโรงแรมของ Google ที่แสดงชื่อ ราคา และห้องว่าง ทั้งสองอย่างอยู่ในระบบโฆษณาของ Google แต่รูปแบบ ข้อมูลที่ต้องมี และหน้าจอที่ลูกค้าเห็นต่างกัน ไม่ได้ให้ผลเดียวกันโดยอัตโนมัติ",
    },
    {
      q: "Free Booking Links เหมาะกับโรงแรมแบบใด",
      a: "เหมาะกับโรงแรมที่มีหน้าโรงแรม ระบบจอง และข้อมูลราคา-ห้องว่างที่ส่งต่อได้ถูกต้อง โดยไม่เสียค่าโฆษณาต่อคลิก การจะปรากฏหรือไม่ขึ้นกับความพร้อมของข้อมูล การเชื่อมต่อ และเงื่อนไขของ Google ไม่ได้รับประกันว่าทุกโรงแรมจะเห็นลิงก์นี้",
    },
    {
      q: "โรงแรมต้องมี Booking Engine หรือไม่",
      a: "ไม่จำเป็นต้องมีก่อนเริ่มคุย ทีมตรวจเส้นทางจองที่มีอยู่จริง หากต้องการวัดการจอง หรือใช้ Hotel Ads และ Free Booking Links ระบบจองที่ลูกค้าเดินต่อได้จะทำให้ตรวจและวัดผลชัดขึ้น โรงแรมเป็นผู้ตัดสินใจว่าจะปรับระบบเมื่อไร",
    },
    {
      q: "ต้องมี Google Ads Account อยู่แล้วหรือไม่",
      a: "ไม่จำเป็น ทีมทบทวนบัญชีที่มีอยู่ หรือจุดเริ่มต้นถ้ายังไม่มีบัญชี การสร้างหรือใช้บัญชีจะตกลงกับโรงแรมก่อนเริ่มซื้อโฆษณา",
    },
    {
      q: "ใครเป็นผู้กำหนด Budget และ Target Market",
      a: "โรงแรมเป็นผู้อนุมัติงบและตลาดเป้าหมาย ทีมเสนอโครงสร้างแคมเปญและคำค้นจากข้อมูลที่มี แล้วโรงแรมตัดสินใจงบ ตลาด และภาษาที่ใช้",
    },
    {
      q: "วัด Conversion จาก Booking ได้อย่างไร",
      a: "วัดได้มากน้อยตามเว็บไซต์ ระบบจอง และการตั้งค่าติดตามผลที่มีอยู่ ทีมวางแผนจากสิ่งที่วัดได้จริง เช่น การสอบถาม การเข้าสู่ระบบจอง หรือการจองที่ติดตามได้ ไม่ใช้ตัวเลขที่ยังตรวจไม่ได้เป็นผลงาน",
    },
    {
      q: "ใช้เวลานานเท่าไรจึงมีข้อมูลสำหรับ Optimize",
      a: "เมื่อแคมเปญเปิดแล้ว ทีมดูคำค้น พฤติกรรมบนหน้าเว็บ และการกระทำในเส้นทางจองจากข้อมูลที่ตรวจได้ ปริมาณและความเร็วของข้อมูลขึ้นกับงบ คำค้น และพฤติกรรมลูกค้า หน้านี้ไม่กำหนดจำนวนวันหรือสัปดาห์ที่จะเริ่มเห็นผล",
    },
    {
      q: "รองรับหลายประเทศหรือหลายภาษาได้หรือไม่",
      a: "ได้ตามตลาดและภาษาที่โรงแรมกำหนด ทีมแยกเจตนาและหน้าปลายทางตามตลาดที่ตกลง ไม่ได้หมายความว่าจะเปิดทุกประเทศหรือทุกภาษาในครั้งเดียว",
    },
    {
      q: "โรงแรมต้องเตรียมข้อมูลอะไร",
      a: "เริ่มจากชื่อโรงแรม เว็บไซต์หรือหน้าจอง เป้าหมายการขาย ตลาดและภาษา และสถานะบัญชี Google Ads ถ้ามี หากมีข้อเสนอ ราคา หรือความท้าทายที่ติดอยู่ ส่งเท่าที่มี ไม่ต้องรอรายงานครบก่อนเริ่มทบทวน",
    },
    {
      q: "มี Report ให้บ่อยแค่ไหน",
      a: "รอบรายงานตกลงในขอบเขตงานของแต่ละโรงแรม ผลลัพธ์ของงานนี้คือ Performance Summary and Next Action จากสิ่งที่วัดได้ โรงแรมเป็นผู้ตัดสินใจว่าจะคงแผน หยุดชั่วคราว หรือปรับแนวทาง หน้านี้ไม่ได้กำหนดความถี่เป็นรายวันหรือรายสัปดาห์",
    },
  ],
  en: [
    {
      q: "How is Google Ads different from Hotel Ads?",
      a: "On this page, Google Ads usually means Search Ads: text ads that answer a query and open a chosen page. Hotel Ads are Google’s hotel-search format, showing the hotel name, rate, and availability. Both sit in Google’s advertising system, but the format, required data, and guest screen differ. They do not produce the same result automatically.",
    },
    {
      q: "Which hotels are Free Booking Links suitable for?",
      a: "They fit hotels that already have a hotel page, a booking engine, and a correct rate and availability feed. There is no per-click ad fee. Whether the link appears depends on data quality, the connection, and Google’s conditions. It is not guaranteed for every hotel.",
    },
    {
      q: "Does the hotel need a Booking Engine?",
      a: "A booking engine is not required before the first conversation. The team reviews the booking path that exists. If the hotel wants to measure bookings, or to use Hotel Ads and Free Booking Links, a path the guest can continue into makes review and tracking clearer. The hotel decides when to change systems.",
    },
    {
      q: "Do we already need a Google Ads account?",
      a: "No. The team can review an existing account, or the starting point if there is not one yet. Creating or using an account is agreed with the hotel before ads are bought.",
    },
    {
      q: "Who sets the budget and the target market?",
      a: "The hotel approves the budget and the target market. The team proposes campaign structure and searches from the information available. The hotel then decides the budget, market, and languages to use.",
    },
    {
      q: "How is conversion from a booking measured?",
      a: "It depends on the website, the booking engine, and the tracking already in place. The team plans from what can actually be measured — such as an enquiry, a step into the booking engine, or a tracked booking. Figures that cannot be checked are not used as proof of result.",
    },
    {
      q: "How long before there is data to optimize?",
      a: "After a campaign is live, the team reviews search terms, landing-page behaviour, and booking-path actions from data that can be checked. How quickly that data builds depends on budget, searches, and guest behaviour. This page does not set a number of days or weeks before results appear.",
    },
    {
      q: "Can several countries or languages be supported?",
      a: "Yes, for the markets and languages the hotel sets. The team separates intent and destination pages for the agreed markets. That does not mean every country or language is launched at once.",
    },
    {
      q: "What information should the hotel prepare?",
      a: "Start with the hotel name, the website or booking page, the sales goal, the market and language, and whether a Google Ads account already exists. If you have an offer, a rate, or a current challenge, share what you have. A complete report is not required before the review starts.",
    },
    {
      q: "How often is there a report?",
      a: "Reporting rhythm is agreed in the scope for each hotel. The output is a Performance Summary and Next Action from what can be measured. The hotel decides whether to keep, pause, or change the plan. This page does not set a daily or weekly frequency.",
    },
  ],
} as const;

export function adsFaqs(locale: Locale) {
  const rows = locale === "th" ? ADS_FAQS.th : ADS_FAQS.en;
  return rows.map((item) => ({ q: item.q, a: item.a }));
}
