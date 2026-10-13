import { localizePath, metadataFor, pageByRoute, SITE, type Locale } from "@/lib/seo";

export type CaseStudyMetric = {
  value: string;
  label: string;
};

export type CaseStudyRow = {
  label: string;
  before: string;
  after: string;
  change: string;
  /** 0–100 visual bar for the after share when useful */
  bar?: number;
};

export type CaseStudyBreakdown = {
  totalLabel: string;
  totalValue: string;
  parts: { label: string; value: string; share: string; percent: number }[];
};

export type CaseStudy = {
  slug: string;
  number: string;
  location: string;
  propertyType: string;
  category: string;
  categoryKind: "revenue" | "digital";
  mainResult: string;
  supportingResult: string;
  cardDescription: string;
  eyebrow: string;
  headline: string;
  managementStart?: string;
  period?: string;
  introduction: string[];
  metrics: CaseStudyMetric[];
  resultsTable?: CaseStudyRow[];
  breakdown?: CaseStudyBreakdown;
  whatWeChanged: string[];
  keyInsight?: string;
  keyTakeaway: string;
  seoTitle: string;
  seoDescription: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "layan-revenue-management",
    number: "01",
    location: "Layan, Phuket",
    propertyType: "Premium Pool Villa Property",
    category: "Revenue & Distribution Management",
    categoryKind: "revenue",
    mainResult: "+34.7% Room Revenue",
    supportingResult: "+฿5.57M additional room revenue in the first six months",
    cardDescription:
      "Revenue growth was driven primarily by stronger room-night production and occupancy through dynamic pricing, inventory control and distribution optimisation.",
    eyebrow: "Case Study · Revenue & Distribution Management",
    headline: "+34.7% Room Revenue in the First Six Months",
    managementStart: "October 2025",
    introduction: [
      "The property came under revenue and distribution management just before Phuket’s high season.",
      "The commercial opportunity was to improve room-night production, occupancy and overall room revenue through stronger pricing, inventory and distribution decisions.",
    ],
    metrics: [
      { value: "+34.7%", label: "Room Revenue" },
      { value: "+฿5.57M", label: "Additional Room Revenue" },
      { value: "+710", label: "Additional Room Nights" },
      { value: "+14.1 pts", label: "Average Occupancy" },
    ],
    resultsTable: [
      { label: "Room Revenue", before: "฿16.03M", after: "฿21.60M", change: "+34.7%", bar: 100 },
      { label: "Room Nights Sold", before: "1,949", after: "2,659", change: "+36.4%", bar: 100 },
      { label: "Average Occupancy", before: "59.5%", after: "73.6%", change: "+14.1 pts", bar: 74 },
    ],
    whatWeChanged: [
      "Revenue and pricing optimisation",
      "Dynamic rate and inventory control",
      "OTA and distribution optimisation",
      "Demand and booking-pace monitoring",
      "Yield management for peak dates",
      "Tactical actions for need dates",
      "Regular pickup analysis",
      "Continuous market adjustments",
    ],
    keyInsight:
      "Growth came primarily from selling more room nights at stronger occupancy, rather than simply increasing rates.",
    keyTakeaway:
      "Better revenue management is not only about raising prices. It is about matching pricing, inventory and demand at the right time.",
    seoTitle: "+34.7% Room Revenue | Layan Case Study | The KPI Plus",
    seoDescription:
      "Premium pool villa property in Layan, Phuket: +34.7% room revenue and +฿5.57M additional revenue in the first six months under revenue and distribution management.",
  },
  {
    slug: "patong-boutique-hotel-revenue",
    number: "02",
    location: "Patong, Phuket",
    propertyType: "Independent Boutique Hotel",
    category: "Revenue & Distribution Management",
    categoryKind: "revenue",
    mainResult: "+12.8% Room Revenue",
    supportingResult: "+฿1.85M additional annual room revenue",
    cardDescription:
      "The hotel was already operating above 80% occupancy. The opportunity was to increase the value of every room sold through stronger pricing and commercial management.",
    eyebrow: "Case Study · Revenue & Distribution Management",
    headline: "Already Busy. Now More Profitable.",
    introduction: [
      "The hotel was already operating above 80% occupancy.",
      "The challenge was therefore not simply to sell more rooms, but to increase the value generated from every room already being sold.",
    ],
    metrics: [
      { value: "+12.8%", label: "Room Revenue" },
      { value: "+฿1.85M", label: "Additional Annual Room Revenue" },
      { value: "+11.0%", label: "ADR" },
      { value: "+4.7 pts", label: "Occupancy" },
    ],
    resultsTable: [
      { label: "Room Revenue", before: "฿14.40M", after: "฿16.25M", change: "+12.8%", bar: 100 },
      { label: "Blended ADR", before: "฿1,880", after: "฿2,087", change: "+11.0%", bar: 100 },
      { label: "Occupancy", before: "81.0%", after: "85.7%", change: "+4.7 pts", bar: 86 },
      { label: "Room Nights", before: "7,659", after: "7,787", change: "+128 room nights", bar: 100 },
    ],
    breakdown: {
      totalLabel: "Additional room revenue",
      totalValue: "฿1.85M",
      parts: [
        { label: "From higher ADR", value: "฿1.61M", share: "87%", percent: 87 },
        { label: "From additional room nights", value: "฿0.24M", share: "13%", percent: 13 },
      ],
    },
    whatWeChanged: [
      "Dynamic pricing",
      "Daily rate optimisation",
      "Inventory optimisation",
      "OTA management",
      "Pickup monitoring",
      "High-demand date strategy",
      "Tactical pricing for softer periods",
    ],
    keyInsight:
      "Most of the revenue improvement came from stronger ADR rather than significantly increasing room volume.",
    keyTakeaway: "Same hotel. Same rooms. Each room sold more effectively.",
    seoTitle: "+12.8% Room Revenue | Patong Boutique Hotel | The KPI Plus",
    seoDescription:
      "Independent boutique hotel in Patong, Phuket: +12.8% room revenue and +฿1.85M additional annual revenue through pricing and commercial management.",
  },
  {
    slug: "coconut-island-digital-performance",
    number: "03",
    location: "Coconut Island, Phuket",
    propertyType: "5-Star Resort",
    category: "Digital Performance",
    categoryKind: "digital",
    mainResult: "14.89× ROAS",
    supportingResult: "฿60K ad spend → ฿1.80M booking revenue",
    cardDescription:
      "A structured Google Search campaign used historical CRM data and high-intent search strategy to generate measurable direct-booking revenue.",
    eyebrow: "Case Study · Digital Performance",
    headline: "14.89× ROAS from Direct Booking Campaigns",
    period: "July 2026",
    introduction: [
      "The objective was to turn a controlled paid-search budget into measurable direct booking revenue rather than focusing only on impressions, clicks or traffic.",
    ],
    metrics: [
      { value: "14.89×", label: "Return on Ad Spend" },
      { value: "฿1.80M", label: "Booking Revenue" },
      { value: "฿60K", label: "Ad Spend" },
      { value: "23", label: "Direct Bookings" },
      { value: "2,100", label: "Clicks" },
    ],
    whatWeChanged: [
      "Used five years of CRM data",
      "Built a tightly structured Google Search campaign",
      "Focused targeting around high booking intent",
      "Measured campaign performance against booking revenue",
      "Prioritised direct-booking conversion over traffic volume",
    ],
    keyTakeaway:
      "A modest advertising budget can generate strong direct revenue when historical customer data, campaign structure and booking intent are aligned.",
    seoTitle: "14.89× ROAS | Coconut Island Digital Performance | The KPI Plus",
    seoDescription:
      "5-star resort on Coconut Island, Phuket: 14.89× ROAS with ฿60K ad spend generating ฿1.80M direct booking revenue.",
  },
  {
    slug: "patong-direct-booking-performance",
    number: "04",
    location: "Patong, Phuket",
    propertyType: "Boutique Hotel & Residence",
    category: "Digital Performance",
    categoryKind: "digital",
    mainResult: "17.29× ROAS",
    supportingResult: "฿62K ad spend → ฿1.07M booking revenue",
    cardDescription:
      "Attribution was rebuilt through Google Tag Manager and the campaign structure was improved to strengthen branded search visibility and direct booking performance.",
    eyebrow: "Case Study · Digital Performance",
    headline: "17.29× ROAS After Rebuilding Tracking & Search Strategy",
    period: "June 2026",
    introduction: [
      "The property needed stronger performance measurement and better visibility across branded, high-intent hotel searches.",
    ],
    metrics: [
      { value: "17.29×", label: "Return on Ad Spend" },
      { value: "฿1.07M", label: "Booking Revenue" },
      { value: "฿62K", label: "Ad Spend" },
      { value: "27", label: "Direct Bookings" },
      { value: "12,000", label: "Clicks" },
    ],
    whatWeChanged: [
      "Rebuilt attribution through Google Tag Manager",
      "Reworked campaign structure",
      "Strengthened branded search placement",
      "Improved conversion measurement",
      "Connected campaign activity to booking revenue",
    ],
    keyTakeaway:
      "Better tracking and campaign structure made it possible to measure and improve performance against actual booking revenue.",
    seoTitle: "17.29× ROAS | Patong Direct Booking | The KPI Plus",
    seoDescription:
      "Boutique hotel and residence in Patong, Phuket: 17.29× ROAS after rebuilding tracking and branded search strategy.",
  },
];

export const caseStudyBySlug = new Map(caseStudies.map((study) => [study.slug, study]));

export function getCaseStudy(slug: string) {
  return caseStudyBySlug.get(slug) ?? null;
}

export const caseStudySlugs = caseStudies.map((study) => study.slug);

/** Listing hero stats (English source; Thai labels via caseStudyHeroStatsFor). */
export const caseStudyHeroStats: CaseStudyMetric[] = [
  { value: "+34.7%", label: "Room Revenue" },
  { value: "+฿5.57M", label: "Additional Revenue" },
  { value: "17.29×", label: "ROAS" },
  { value: "+11.0%", label: "ADR" },
];

const caseStudyHeroStatsTh: CaseStudyMetric[] = [
  { value: "+34.7%", label: "Room Revenue" },
  { value: "+5.57M", label: "รายได้เพิ่ม" },
  { value: "17.29×", label: "ROAS" },
  { value: "+11.0%", label: "ADR" },
];

/** Soft break between Thai phrases for balanced wrapping. */
const thBr = "\u200B";

export function caseStudyHeroStatsFor(locale: Locale): CaseStudyMetric[] {
  return locale === "th" ? caseStudyHeroStatsTh : caseStudyHeroStats;
}

export const caseStudyDisclaimer =
  "Results shown are based on individual hotel performance during the stated periods. Results vary depending on property, market conditions, product, pricing, distribution and operational factors and do not guarantee future performance.";

const caseStudyDisclaimerTh =
  `ผลลัพธ์ที่แสดงอ้างอิงจากผลการดำเนินงานของโรงแรมแต่ละแห่งในช่วงเวลาที่ระบุ${thBr} ผลลัพธ์อาจแตกต่างกันตามลักษณะโรงแรม สภาวะตลาด ผลิตภัณฑ์ ราคา Distribution และปัจจัยด้านการดำเนินงาน${thBr} และไม่ได้เป็นการรับประกันผลลัพธ์ในอนาคต`;

export function caseStudyDisclaimerFor(locale: Locale) {
  return locale === "th" ? caseStudyDisclaimerTh : caseStudyDisclaimer;
}

type CaseStudyLocaleOverlay = Partial<
  Pick<
    CaseStudy,
    | "location"
    | "propertyType"
    | "category"
    | "mainResult"
    | "supportingResult"
    | "cardDescription"
    | "eyebrow"
    | "headline"
    | "managementStart"
    | "period"
    | "introduction"
    | "keyInsight"
    | "keyTakeaway"
    | "whatWeChanged"
  >
> & {
  metrics?: CaseStudyMetric[];
  resultsTable?: CaseStudy["resultsTable"];
  breakdown?: CaseStudy["breakdown"];
};

const caseStudyTh: Record<string, CaseStudyLocaleOverlay> = {
  "layan-revenue-management": {
    location: "ลายัน ภูเก็ต",
    propertyType: "พูลวิลล่าพรีเมียม",
    category: "Revenue & Distribution",
    mainResult: "+34.7% Room Revenue",
    supportingResult: `รายได้ห้องพักเพิ่ม +฿5.57M${thBr} ใน 6 เดือนแรก`,
    cardDescription: `การเติบโตของรายได้มาจากปริมาณห้องคืนและการเข้าพักที่แข็งขึ้นเป็นหลัก${thBr} ผ่านการบริหารราคาแบบไดนามิก${thBr} การควบคุม Inventory และการปรับ Distribution`,
    eyebrow: "Case Study · Revenue & Distribution Management",
    headline: "+34.7% Room Revenue ใน 6 เดือนแรก",
    managementStart: "ตุลาคม 2025",
    introduction: [
      "โรงแรมเริ่มอยู่ภายใต้การบริหารรายได้และช่องทางการขายก่อนเข้าสู่ช่วงไฮซีซันของภูเก็ต",
      "โอกาสทางธุรกิจคือการเพิ่มปริมาณห้องคืน การเข้าพัก และรายได้ห้องพักโดยรวม ผ่านการตัดสินใจด้านราคา Inventory และ Distribution ที่ชัดขึ้น",
    ],
    metrics: [
      { value: "+34.7%", label: "Room Revenue" },
      { value: "+฿5.57M", label: "รายได้ห้องพักเพิ่ม" },
      { value: "+710", label: "ห้องคืนเพิ่ม" },
      { value: "+14.1 pts", label: "Occupancy เฉลี่ย" },
    ],
    resultsTable: [
      { label: "Room Revenue", before: "฿16.03M", after: "฿21.60M", change: "+34.7%", bar: 100 },
      { label: "ห้องคืนที่ขายได้", before: "1,949", after: "2,659", change: "+36.4%", bar: 100 },
      { label: "Occupancy เฉลี่ย", before: "59.5%", after: "73.6%", change: "+14.1 pts", bar: 74 },
    ],
    whatWeChanged: [
      "ปรับการบริหารรายได้และราคา",
      "ควบคุมเรทและ Inventory แบบไดนามิก",
      "ปรับ OTA และ Distribution",
      "ติดตาม Demand และ Booking Pace",
      "Yield management สำหรับวันพีค",
      "มาตรการเฉพาะสำหรับวันที่ยอดอ่อน",
      "วิเคราะห์ Pickup เป็นประจำ",
      "ปรับตามตลาดอย่างต่อเนื่อง",
    ],
    keyInsight:
      "การเติบโตมาจากการขายห้องคืนได้มากขึ้นและการเข้าพักที่แข็งขึ้นเป็นหลัก ไม่ใช่แค่การขึ้นราคาอย่างเดียว",
    keyTakeaway:
      "การบริหารรายได้ที่ดีไม่ใช่แค่การขึ้นราคา แต่คือการจับคู่ราคา Inventory และ Demand ให้ถูกจังหวะ",
  },
  "patong-boutique-hotel-revenue": {
    location: "ป่าตอง ภูเก็ต",
    propertyType: "โรงแรมบูติกอิสระ",
    category: "Revenue & Distribution",
    mainResult: "+12.8% Room Revenue",
    supportingResult: `รายได้ห้องพักเพิ่ม +฿1.85M${thBr} ต่อปี`,
    cardDescription: `โรงแรมมี Occupancy สูงกว่า 80% อยู่แล้ว${thBr} โอกาสจึงอยู่ที่การเพิ่มมูลค่าต่อห้องที่ขายได้${thBr} ผ่านการบริหารราคาและการบริหารเชิงพาณิชย์ที่แข็งขึ้น`,
    eyebrow: "Case Study · Revenue & Distribution Management",
    headline: "ห้องเต็มอยู่แล้ว ตอนนี้ทำกำไรได้มากขึ้น",
    introduction: [
      "โรงแรมมี Occupancy สูงกว่า 80% อยู่แล้ว",
      "โจทย์จึงไม่ใช่แค่ขายห้องให้มากขึ้น แต่คือการเพิ่มมูลค่าจากทุกห้องที่ขายได้อยู่แล้ว",
    ],
    metrics: [
      { value: "+12.8%", label: "Room Revenue" },
      { value: "+฿1.85M", label: "รายได้ห้องพักเพิ่มต่อปี" },
      { value: "+11.0%", label: "ADR" },
      { value: "+4.7 pts", label: "Occupancy" },
    ],
    resultsTable: [
      { label: "Room Revenue", before: "฿14.40M", after: "฿16.25M", change: "+12.8%", bar: 100 },
      { label: "Blended ADR", before: "฿1,880", after: "฿2,087", change: "+11.0%", bar: 100 },
      { label: "Occupancy", before: "81.0%", after: "85.7%", change: "+4.7 pts", bar: 86 },
      { label: "ห้องคืน", before: "7,659", after: "7,787", change: "+128 ห้องคืน", bar: 100 },
    ],
    breakdown: {
      totalLabel: "รายได้ห้องพักที่เพิ่มขึ้น",
      totalValue: "฿1.85M",
      parts: [
        { label: "จาก ADR ที่สูงขึ้น", value: "฿1.61M", share: "87%", percent: 87 },
        { label: "จากห้องคืนที่เพิ่มขึ้น", value: "฿0.24M", share: "13%", percent: 13 },
      ],
    },
    whatWeChanged: [
      "Dynamic pricing",
      "ปรับเรทรายวัน",
      "ปรับ Inventory",
      "บริหาร OTA",
      "ติดตาม Pickup",
      "กลยุทธ์วันที่มีดีมานด์สูง",
      "ปรับราคาเชิงยุทธวิธีในช่วงที่ยอดอ่อน",
    ],
    keyInsight: "รายได้ส่วนใหญ่ที่เพิ่มขึ้นมาจาก ADR ที่แข็งขึ้น ไม่ใช่จากการเพิ่มปริมาณห้องอย่างมาก",
    keyTakeaway: "โรงแรมเดิม ห้องเดิม แต่ขายแต่ละห้องได้มีประสิทธิภาพมากขึ้น",
  },
  "coconut-island-digital-performance": {
    location: "เกาะมะพร้าว ภูเก็ต",
    propertyType: "รีสอร์ท 5 ดาว",
    category: "Digital Performance",
    mainResult: "14.89× ROAS",
    supportingResult: `งบโฆษณา ฿60K →${thBr} รายได้การจอง ฿1.80M`,
    cardDescription: `แคมเปญ Google Search ที่มีโครงสร้างชัด${thBr} ใช้ข้อมูล CRM ย้อนหลังและกลยุทธ์ค้นหาที่มีเจตนาจองสูง${thBr} เพื่อสร้างรายได้จองตรงที่วัดผลได้`,
    eyebrow: "Case Study · Digital Performance",
    headline: "14.89× ROAS จากแคมเปญ Direct Booking",
    period: "กรกฎาคม 2026",
    introduction: [
      "เป้าหมายคือเปลี่ยนงบ Paid Search ที่ควบคุมได้ให้กลายเป็นรายได้จองตรงที่วัดผลได้ ไม่ใช่โฟกัสแค่ Impressions, Clicks หรือ Traffic",
    ],
    metrics: [
      { value: "14.89×", label: "Return on Ad Spend" },
      { value: "฿1.80M", label: "รายได้จากการจอง" },
      { value: "฿60K", label: "งบโฆษณา" },
      { value: "23", label: "การจองตรง" },
      { value: "2,100", label: "Clicks" },
    ],
    whatWeChanged: [
      "ใช้ข้อมูล CRM ย้อนหลัง 5 ปี",
      "สร้างแคมเปญ Google Search ที่มีโครงสร้างชัด",
      "เจาะกลุ่มค้นหาที่มีเจตนาจองสูง",
      "วัดผลแคมเปญเทียบกับรายได้จากการจอง",
      "ให้ความสำคัญกับการแปลงเป็นจองตรงมากกว่าปริมาณ Traffic",
    ],
    keyTakeaway:
      "งบโฆษณาที่ไม่มากสามารถสร้างรายได้ตรงได้ดี เมื่อข้อมูลลูกค้าย้อนหลัง โครงสร้างแคมเปญ และเจตนาจองสอดคล้องกัน",
  },
  "patong-direct-booking-performance": {
    location: "ป่าตอง ภูเก็ต",
    propertyType: "โรงแรมบูติกและเรสซิเดนซ์",
    category: "Digital Performance",
    mainResult: "17.29× ROAS",
    supportingResult: `งบโฆษณา ฿62K →${thBr} รายได้การจอง ฿1.07M`,
    cardDescription: `ปรับระบบ Attribution ผ่าน Google Tag Manager${thBr} และปรับโครงสร้างแคมเปญ${thBr} เพื่อเสริมการมองเห็นบนการค้นหาแบรนด์และผลลัพธ์การจองตรง`,
    eyebrow: "Case Study · Digital Performance",
    headline: "17.29× ROAS หลังปรับ Tracking และกลยุทธ์การค้นหา",
    period: "มิถุนายน 2026",
    introduction: [
      "โรงแรมต้องการการวัดผลที่ชัดขึ้น และการมองเห็นที่ดีขึ้นในการค้นหาชื่อโรงแรมและคำค้นหาที่มีเจตนาจองสูง",
    ],
    metrics: [
      { value: "17.29×", label: "Return on Ad Spend" },
      { value: "฿1.07M", label: "รายได้จากการจอง" },
      { value: "฿62K", label: "งบโฆษณา" },
      { value: "27", label: "การจองตรง" },
      { value: "12,000", label: "Clicks" },
    ],
    whatWeChanged: [
      "สร้าง Attribution ใหม่ผ่าน Google Tag Manager",
      "ปรับโครงสร้างแคมเปญ",
      "เสริมตำแหน่งบนการค้นหาแบรนด์",
      "ปรับปรุงการวัด Conversion",
      "เชื่อมกิจกรรมแคมเปญกับรายได้จากการจอง",
    ],
    keyTakeaway:
      "การ Tracking และโครงสร้างแคมเปญที่ชัดขึ้น ทำให้วัดและปรับปรุงผลเทียบกับรายได้จากการจองจริงได้",
  },
};

export function localizeCaseStudy(study: CaseStudy, locale: Locale): CaseStudy {
  if (locale !== "th") return study;
  const overlay = caseStudyTh[study.slug];
  if (!overlay) return study;
  return { ...study, ...overlay };
}

export function caseStudyMetadata(slug: string, locale: Locale) {
  const study = getCaseStudy(slug);
  if (!study) return {};
  const route = localizePath(`/case-studies/${slug}`, locale);
  if (pageByRoute.has(route)) return metadataFor(route);

  const brand = locale === "th" ? "เดอะ เคพีไอ พลัส" : "The KPI Plus";
  const title = study.seoTitle.replace("The KPI Plus", brand);
  const canonical = `${SITE}${route}`;
  return {
    title,
    description: study.seoDescription,
    alternates: {
      canonical,
      languages: {
        en: `${SITE}/en/case-studies/${slug}`,
        th: `${SITE}/case-studies/${slug}`,
        zh: `${SITE}/zh/case-studies/${slug}`,
        ru: `${SITE}/ru/case-studies/${slug}`,
        "x-default": `${SITE}/case-studies/${slug}`,
      },
    },
    openGraph: {
      title,
      description: study.seoDescription,
      url: canonical,
      type: "article" as const,
    },
  };
}
