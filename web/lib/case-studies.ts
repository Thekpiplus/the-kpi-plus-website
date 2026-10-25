import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, metadataFor, pageByRoute, SITE, type Locale } from "@/lib/seo";

export type CaseDataStatus =
  | "draft"
  | "review"
  | "approved"
  | "anonymised"
  | "sample"
  | "published";

export type CaseMetricStatus = "Approved case" | "Anonymised case" | "Sample data";

export type CaseMetric = {
  id: string;
  /** Metric name shown next to the value. */
  label: string;
  /** Published figure. Do not change the numerical value. */
  value: string;
  /** Unit such as %, pts, ×, room nights. Omit when unknown. */
  unit?: string;
  /** ISO currency code when the figure is money. Omit when unknown. */
  currency?: string;
  context: string;
  /** Short definition of what the metric measures. Omit when unknown. */
  definition?: string;
  /** Measurement period. Omit when unknown. */
  period: string;
  /** Known before → after or spend → revenue figures. Omit when unknown. */
  comparison?: string;
  /** Named baseline / comparison window. Omit when unknown — do not invent. */
  baselinePeriod?: string;
  status: CaseMetricStatus;
  sourceNote?: string;
};

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  clientName?: string;
  anonymisedLabel?: string;
  hotelType?: string;
  location?: string;
  serviceArea: string;
  challenge: string;
  analysis: string;
  action: string;
  result: string;
  metrics: CaseMetric[];
  measurementPeriod: string;
  baselinePeriod?: string;
  dataStatus: CaseDataStatus;
  coverImage?: string;
  coverImageAlt?: string;
  coverImageStatus: "real" | "approved" | "sample" | "placeholder";
  testimonial?: {
    quote: string;
    authorName?: string;
    authorRole?: string;
    approvalStatus: "pending" | "approved";
  };
  methodologyNote?: string;
  sourceNotes?: string[];
  publishedAt?: string;
  updatedAt?: string;
  isFeatured: boolean;
  isPublished: boolean;
  department?: string;
  reportPreview?: string;
  reportPreviewAlt?: string;
  relatedArticleIds?: string[];
  comparison?: CaseStudyComparison;
  seoTitle?: string;
  metaDescription?: string;
};

/** Before/after rows for the detail comparison table. Presentation of approved metrics. */
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

export type CaseStudyComparison = {
  resultsTable?: CaseStudyRow[];
  breakdown?: CaseStudyBreakdown;
};

/** Listing hero stats (page chrome, not rolled up from unpublished metrics). */
export type CaseStudyHeroStat = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  currency?: string;
  period?: string;
  comparison?: string;
  baseline?: string;
  status: CaseMetricStatus;
  /** Admin/editor only. Never render on the public page. */
  todo?: string;
  tone?: "lime" | "yellow" | "amber";
};

const ANONYMISED: CaseMetricStatus = "Anonymised case";

export const caseStudies: CaseStudy[] = [
  {
    id: "layan-revenue-management",
    slug: "layan-revenue-management",
    title: "+34.7% Room Revenue in the First Six Months",
    shortDescription:
      "Revenue growth was driven primarily by stronger room-night production and occupancy through dynamic pricing, inventory control and distribution optimisation.",
    anonymisedLabel: "Premium pool villa property, Layan",
    hotelType: "Premium Pool Villa Property",
    location: "Layan, Phuket",
    serviceArea: "Revenue & Distribution Management",
    challenge:
      "The property came under revenue and distribution management just before Phuket’s high season.\n\nThe commercial opportunity was to improve room-night production, occupancy and overall room revenue through stronger pricing, inventory and distribution decisions.",
    analysis:
      "Growth came primarily from selling more room nights at stronger occupancy, rather than simply increasing rates.",
    action: [
      "Revenue and pricing optimisation",
      "Dynamic rate and inventory control",
      "OTA and distribution optimisation",
      "Demand and booking-pace monitoring",
      "Yield management for peak dates",
      "Tactical actions for need dates",
      "Regular pickup analysis",
      "Continuous market adjustments",
    ].join("\n"),
    result:
      "Better revenue management is not only about raising prices. It is about matching pricing, inventory and demand at the right time.",
    metrics: [
      {
        id: "room-revenue",
        label: "Room Revenue",
        value: "+34.7%",
        unit: "%",
        context: "+฿5.57M additional room revenue in the first six months",
        period: "First six months from October 2025",
        comparison: "฿16.03M → ฿21.60M",
        status: ANONYMISED,
      },
      {
        id: "additional-room-revenue",
        label: "Additional Room Revenue",
        value: "+฿5.57M",
        currency: "THB",
        context: "Additional room revenue in the first six months",
        period: "First six months from October 2025",
        status: ANONYMISED,
      },
      {
        id: "additional-room-nights",
        label: "Additional Room Nights",
        value: "+710",
        unit: "room nights",
        context: "Additional room nights sold",
        period: "First six months from October 2025",
        comparison: "1,949 → 2,659",
        status: ANONYMISED,
      },
      {
        id: "average-occupancy",
        label: "Average Occupancy",
        value: "+14.1 pts",
        unit: "pts",
        context: "Average occupancy",
        period: "First six months from October 2025",
        comparison: "59.5% → 73.6%",
        status: ANONYMISED,
      },
    ],
    measurementPeriod: "First six months from October 2025",
    dataStatus: "anonymised",
    coverImageStatus: "placeholder",
    isFeatured: true,
    isPublished: true,
  },
  {
    id: "patong-boutique-hotel-revenue",
    slug: "patong-boutique-hotel-revenue",
    title: "Already Busy. Now More Profitable.",
    shortDescription:
      "The hotel was already operating above 80% occupancy. The opportunity was to increase the value of every room sold through stronger pricing and commercial management.",
    anonymisedLabel: "Independent boutique hotel, Patong",
    hotelType: "Independent Boutique Hotel",
    location: "Patong, Phuket",
    serviceArea: "Revenue & Distribution Management",
    challenge:
      "The hotel was already operating above 80% occupancy.\n\nThe challenge was therefore not simply to sell more rooms, but to increase the value generated from every room already being sold.",
    analysis:
      "Most of the revenue improvement came from stronger ADR rather than significantly increasing room volume.",
    action: [
      "Dynamic pricing",
      "Daily rate optimisation",
      "Inventory optimisation",
      "OTA management",
      "Pickup monitoring",
      "High-demand date strategy",
      "Tactical pricing for softer periods",
    ].join("\n"),
    result: "Same hotel. Same rooms. Each room sold more effectively.",
    metrics: [
      {
        id: "room-revenue",
        label: "Room Revenue",
        value: "+12.8%",
        unit: "%",
        context: "+฿1.85M additional annual room revenue",
        period: "Annual",
        comparison: "฿14.40M → ฿16.25M",
        status: ANONYMISED,
      },
      {
        id: "additional-annual-room-revenue",
        label: "Additional Annual Room Revenue",
        value: "+฿1.85M",
        currency: "THB",
        context: "Additional annual room revenue",
        period: "Annual",
        status: ANONYMISED,
      },
      {
        id: "adr",
        label: "ADR",
        value: "+11.0%",
        unit: "%",
        currency: "THB",
        context: "Blended ADR",
        period: "Annual",
        comparison: "฿1,880 → ฿2,087",
        status: ANONYMISED,
      },
      {
        id: "occupancy",
        label: "Occupancy",
        value: "+4.7 pts",
        unit: "pts",
        context: "Occupancy",
        period: "Annual",
        comparison: "81.0% → 85.7%",
        status: ANONYMISED,
      },
    ],
    measurementPeriod: "Annual",
    dataStatus: "anonymised",
    coverImageStatus: "placeholder",
    isFeatured: false,
    isPublished: true,
  },
  {
    id: "coconut-island-digital-performance",
    slug: "coconut-island-digital-performance",
    title: "14.89× ROAS from Direct Booking Campaigns",
    shortDescription:
      "A structured Google Search campaign used historical CRM data and high-intent search strategy to generate measurable direct-booking revenue.",
    anonymisedLabel: "5-star resort, Coconut Island",
    hotelType: "5-Star Resort",
    location: "Coconut Island, Phuket",
    serviceArea: "Digital Performance",
    challenge:
      "The objective was to turn a controlled paid-search budget into measurable direct booking revenue rather than focusing only on impressions, clicks or traffic.",
    analysis: "",
    action: [
      "Used five years of CRM data",
      "Built a tightly structured Google Search campaign",
      "Focused targeting around high booking intent",
      "Measured campaign performance against booking revenue",
      "Prioritised direct-booking conversion over traffic volume",
    ].join("\n"),
    result:
      "A modest advertising budget can generate strong direct revenue when historical customer data, campaign structure and booking intent are aligned.",
    metrics: [
      {
        id: "roas",
        label: "Return on Ad Spend",
        value: "14.89×",
        unit: "×",
        context: "฿60K ad spend → ฿1.80M booking revenue",
        period: "July 2026",
        comparison: "฿60K ad spend → ฿1.80M booking revenue",
        status: ANONYMISED,
      },
      {
        id: "booking-revenue",
        label: "Booking Revenue",
        value: "฿1.80M",
        currency: "THB",
        context: "Direct booking revenue",
        period: "July 2026",
        status: ANONYMISED,
      },
      {
        id: "ad-spend",
        label: "Ad Spend",
        value: "฿60K",
        currency: "THB",
        context: "Paid search spend",
        period: "July 2026",
        status: ANONYMISED,
      },
      {
        id: "direct-bookings",
        label: "Direct Bookings",
        value: "23",
        unit: "bookings",
        context: "Direct bookings",
        period: "July 2026",
        status: ANONYMISED,
      },
      {
        id: "clicks",
        label: "Clicks",
        value: "2,100",
        unit: "clicks",
        context: "Clicks",
        period: "July 2026",
        status: ANONYMISED,
      },
    ],
    measurementPeriod: "July 2026",
    dataStatus: "anonymised",
    coverImageStatus: "placeholder",
    isFeatured: false,
    isPublished: true,
  },
  {
    id: "patong-direct-booking-performance",
    slug: "patong-direct-booking-performance",
    title: "17.29× ROAS After Rebuilding Tracking & Search Strategy",
    shortDescription:
      "Attribution was rebuilt through Google Tag Manager and the campaign structure was improved to strengthen branded search visibility and direct booking performance.",
    anonymisedLabel: "Boutique hotel and residence, Patong",
    hotelType: "Boutique Hotel & Residence",
    location: "Patong, Phuket",
    serviceArea: "Digital Performance",
    challenge:
      "The property needed stronger performance measurement and better visibility across branded, high-intent hotel searches.",
    analysis: "",
    action: [
      "Rebuilt attribution through Google Tag Manager",
      "Reworked campaign structure",
      "Strengthened branded search placement",
      "Improved conversion measurement",
      "Connected campaign activity to booking revenue",
    ].join("\n"),
    result:
      "Better tracking and campaign structure made it possible to measure and improve performance against actual booking revenue.",
    metrics: [
      {
        id: "roas",
        label: "Return on Ad Spend",
        value: "17.29×",
        unit: "×",
        context: "฿62K ad spend → ฿1.07M booking revenue",
        period: "June 2026",
        comparison: "฿62K ad spend → ฿1.07M booking revenue",
        status: ANONYMISED,
      },
      {
        id: "booking-revenue",
        label: "Booking Revenue",
        value: "฿1.07M",
        currency: "THB",
        context: "Direct booking revenue",
        period: "June 2026",
        status: ANONYMISED,
      },
      {
        id: "ad-spend",
        label: "Ad Spend",
        value: "฿62K",
        currency: "THB",
        context: "Paid search spend",
        period: "June 2026",
        status: ANONYMISED,
      },
      {
        id: "direct-bookings",
        label: "Direct Bookings",
        value: "27",
        unit: "bookings",
        context: "Direct bookings",
        period: "June 2026",
        status: ANONYMISED,
      },
      {
        id: "clicks",
        label: "Clicks",
        value: "12,000",
        unit: "clicks",
        context: "Clicks",
        period: "June 2026",
        status: ANONYMISED,
      },
    ],
    measurementPeriod: "June 2026",
    dataStatus: "anonymised",
    coverImageStatus: "placeholder",
    isFeatured: false,
    isPublished: true,
  },
];

export const caseStudyComparisons: Record<string, CaseStudyComparison> = {
  "layan-revenue-management": {
    resultsTable: [
      { label: "Room Revenue", before: "฿16.03M", after: "฿21.60M", change: "+34.7%", bar: 100 },
      { label: "Room Nights Sold", before: "1,949", after: "2,659", change: "+36.4%", bar: 100 },
      { label: "Average Occupancy", before: "59.5%", after: "73.6%", change: "+14.1 pts", bar: 74 },
    ],
  },
  "patong-boutique-hotel-revenue": {
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
  },
};

export function publishedCaseStudies() {
  return caseStudies.filter((study) => study.isPublished);
}

export const caseStudyBySlug = new Map(caseStudies.map((study) => [study.slug, study]));

export function getCaseStudy(slug: string) {
  const study = caseStudyBySlug.get(slug);
  if (!study?.isPublished) return null;
  return study;
}

export const caseStudySlugs = publishedCaseStudies().map((study) => study.slug);

export function caseStudyNumber(study: CaseStudy) {
  const index = publishedCaseStudies().findIndex((item) => item.id === study.id);
  return String(Math.max(index, 0) + 1).padStart(2, "0");
}

export function caseStudyEyebrow(study: CaseStudy) {
  return `Case Study · ${study.serviceArea}`;
}

export function caseStudyListingMain(study: CaseStudy) {
  const metric = study.metrics[0];
  if (!metric) return study.title;
  const label = metric.label === "Return on Ad Spend" ? "ROAS" : metric.label;
  return `${metric.value} ${label}`;
}

export function caseStudyListingSupport(study: CaseStudy) {
  return study.metrics[0]?.context ?? study.shortDescription;
}

export type CaseStudyCardStatus = "Approved case" | "Anonymised case" | "Sample case";

export function caseStudyCardStatus(study: CaseStudy): CaseStudyCardStatus {
  if (study.dataStatus === "sample") return "Sample case";
  if (study.dataStatus === "anonymised") return "Anonymised case";

  const metricStatus = caseStudyPrimaryMetric(study)?.status;
  if (metricStatus === "Sample data") return "Sample case";
  if (metricStatus === "Anonymised case" || study.dataStatus === "draft" || study.dataStatus === "review") {
    return "Anonymised case";
  }
  return "Approved case";
}

export function caseStudyPrimaryMetric(study: CaseStudy) {
  return (
    study.metrics.find((metric) => metric.status === "Approved case") ??
    study.metrics.find((metric) => metric.status === "Anonymised case") ??
    study.metrics[0]
  );
}

export function caseStudyIdentity(study: CaseStudy) {
  const status = caseStudyCardStatus(study);
  if (status !== "Approved case" || !study.clientName) {
    return study.anonymisedLabel || study.hotelType || "";
  }
  return study.clientName;
}

export function caseStudyMetricLabel(metric: CaseMetric) {
  return metric.label === "Return on Ad Spend" ? "ROAS" : metric.label;
}

export function caseStudyMetricStatusLabel(status: CaseMetricStatus, locale: Locale = "en") {
  if (locale === "th") {
    if (status === "Sample data") return "ข้อมูลตัวอย่าง";
    if (status === "Approved case") return "ผลงานที่อนุมัติแล้ว";
    return "ผลงานแบบไม่ระบุชื่อ";
  }
  if (status === "Sample data") return "Sample data";
  if (status === "Approved case") return "Approved case data";
  return "Anonymised case data";
}

export function caseStudyMetricUnit(metric: Pick<CaseMetric, "value" | "unit">) {
  const unit = metric.unit?.trim();
  if (unit) return unit;
  if (/%/.test(metric.value)) return "%";
  if (/×/.test(metric.value)) return "×";
  if (/pts/i.test(metric.value)) return "pts";
  return "";
}

export function caseStudyMetricCurrency(metric: Pick<CaseMetric, "value" | "currency" | "comparison">) {
  const currency = metric.currency?.trim();
  if (currency) return currency;
  if (/฿/.test(`${metric.value} ${metric.comparison ?? ""}`)) return "THB";
  return "";
}

function hasBahtSymbol(metric: Pick<CaseMetric, "value" | "comparison">) {
  return /฿/.test(`${metric.value} ${metric.comparison ?? ""}`);
}

/** Known public context only. Never includes TODOs or invented baselines. */
export function caseStudyPublicMetricParts(metric: CaseMetric, locale: Locale) {
  const currency = caseStudyMetricCurrency(metric);
  const parts: string[] = [];
  if (currency && !hasBahtSymbol(metric) && !/[×%]/.test(metric.value) && !/pts/i.test(metric.value)) {
    parts.push(currency);
  }
  if (metric.period?.trim()) parts.push(metric.period.trim());
  if (metric.comparison?.trim()) {
    parts.push(metric.comparison.trim());
  } else if (metric.baselinePeriod?.trim()) {
    parts.push(locale === "th" ? `เทียบกับ ${metric.baselinePeriod.trim()}` : `compared with ${metric.baselinePeriod.trim()}`);
  }
  parts.push(caseStudyMetricStatusLabel(metric.status, locale));
  return {
    headline: `${metric.value} ${caseStudyMetricLabel(metric)}`.trim(),
    parts,
    definition: metric.definition?.trim() ?? "",
  };
}

export function caseStudyPublicMetricLine(metric: CaseMetric, locale: Locale) {
  const { headline, parts } = caseStudyPublicMetricParts(metric, locale);
  return [headline, ...parts].join(" — ");
}

export type CaseMetricGap = { field: string; todo: string };

export function caseStudyMetricGaps(metric: CaseMetric): CaseMetricGap[] {
  const gaps: CaseMetricGap[] = [];
  if (!metric.label.trim()) gaps.push({ field: "label", todo: "TODO: add metric name" });
  if (!metric.value.trim()) gaps.push({ field: "value", todo: "TODO: add metric value" });
  if (!caseStudyMetricUnit(metric) && !caseStudyMetricCurrency(metric)) {
    gaps.push({ field: "unit", todo: "TODO: confirm unit or currency" });
  }
  if (!metric.period?.trim()) gaps.push({ field: "period", todo: "TODO: confirm measurement period" });
  if (!metric.baselinePeriod?.trim()) {
    gaps.push({ field: "baselinePeriod", todo: "TODO: confirm comparison period" });
  }
  if (!metric.definition?.trim()) gaps.push({ field: "definition", todo: "TODO: add short metric definition" });
  return gaps;
}

export function caseStudyHeroGaps(stat: CaseStudyHeroStat): CaseMetricGap[] {
  const gaps: CaseMetricGap[] = [];
  if (!stat.period?.trim()) gaps.push({ field: "period", todo: "TODO: confirm measurement period" });
  if (!stat.baseline?.trim()) gaps.push({ field: "baselinePeriod", todo: "TODO: confirm comparison period" });
  if (!stat.unit?.trim() && !stat.currency?.trim()) {
    gaps.push({ field: "unit", todo: "TODO: confirm unit or currency" });
  }
  return gaps;
}

export function caseStudyParagraphs(value: string) {
  return value
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function caseStudyActionItems(study: CaseStudy) {
  return caseStudyParagraphs(study.action);
}

/** Listing hero stats (English source; Thai labels via caseStudyHeroStatsFor). */
export const caseStudyHeroStats: CaseStudyHeroStat[] = [
  {
    id: "room-revenue",
    value: "+34.7%",
    label: "Room Revenue",
    unit: "%",
    period: "First six months from October 2025",
    comparison: "฿16.03M → ฿21.60M",
    status: ANONYMISED,
    tone: "lime",
    // Named prior window is not in the source. Admin only — do not show on the public page.
    todo: "TODO: confirm comparison period",
  },
  {
    id: "additional-revenue",
    value: "+฿5.57M",
    label: "Additional Revenue",
    currency: "THB",
    period: "First six months from October 2025",
    comparison: "฿16.03M → ฿21.60M",
    status: ANONYMISED,
    tone: "yellow",
    todo: "TODO: confirm comparison period",
  },
  {
    id: "roas",
    value: "17.29×",
    label: "ROAS",
    unit: "×",
    period: "June 2026",
    comparison: "฿62K ad spend → ฿1.07M booking revenue",
    status: ANONYMISED,
    tone: "amber",
    todo: "TODO: confirm comparison period",
  },
  {
    id: "adr",
    value: "+11.0%",
    label: "ADR",
    unit: "%",
    currency: "THB",
    period: "Annual",
    comparison: "฿1,880 → ฿2,087",
    status: ANONYMISED,
    tone: "lime",
    todo: "TODO: confirm comparison period",
  },
];

const caseStudyHeroStatsTh: Record<string, Partial<CaseStudyHeroStat>> = {
  "room-revenue": {
    period: "6 เดือนแรก จากตุลาคม 2025",
  },
  "additional-revenue": {
    value: "+5.57M",
    label: "รายได้เพิ่ม",
    period: "6 เดือนแรก จากตุลาคม 2025",
  },
  roas: {
    period: "มิถุนายน 2026",
    comparison: "งบโฆษณา ฿62K → รายได้การจอง ฿1.07M",
  },
  adr: {
    period: "ต่อปี",
  },
};

/** Soft break between Thai phrases for balanced wrapping. */
const thBr = "\u200B";

export function caseStudyHeroStatsFor(locale: Locale): CaseStudyHeroStat[] {
  if (locale !== "th") return caseStudyHeroStats;
  return caseStudyHeroStats.map((stat) => ({ ...stat, ...caseStudyHeroStatsTh[stat.id] }));
}

export function caseStudyHeroStatusLabel(status: CaseStudyHeroStat["status"], locale: Locale = "en") {
  return caseStudyMetricStatusLabel(status, locale);
}

export function caseStudyDataStatusLabel(study: CaseStudy, locale: Locale) {
  const status = caseStudyCardStatus(study);
  if (status === "Sample case") return caseStudyMetricStatusLabel("Sample data", locale);
  if (status === "Approved case") return caseStudyMetricStatusLabel("Approved case", locale);
  return caseStudyMetricStatusLabel("Anonymised case", locale);
}

const METHODOLOGY_NOTE = {
  th: "ผลลัพธ์วัดจากข้อมูลที่ได้รับอนุญาต โดยเปรียบเทียบกับช่วงเวลาก่อนเริ่ม Action และอาจแตกต่างตามฤดูกาล ราคา ช่องทาง และสภาพตลาด",
  en: "Results are measured from authorised data, compared with the period before Action began, and may vary with season, pricing, channel and market conditions.",
} as const;

const RESULTS_NOTE = {
  th: "ผลลัพธ์ขึ้นอยู่กับช่วงเวลา ฤดูกาล ราคา ช่องทาง และข้อมูลที่โรงแรมมี",
  en: "Results depend on the period, season, pricing, channel and the data available from the hotel.",
} as const;

export function caseStudyMethodologyNote(study: CaseStudy, locale: Locale) {
  if (study.methodologyNote?.trim()) return study.methodologyNote.trim();
  return locale === "th" ? METHODOLOGY_NOTE.th : METHODOLOGY_NOTE.en;
}

/** Short note directly under Results. Uses the study methodology when the owner has supplied one. */
export function caseStudyResultsNote(study: CaseStudy | undefined, locale: Locale) {
  if (study?.methodologyNote?.trim()) return study.methodologyNote.trim();
  return locale === "th" ? RESULTS_NOTE.th : RESULTS_NOTE.en;
}

export function relatedCaseStudies(slug: string) {
  return publishedCaseStudies().filter((study) => study.slug !== slug);
}

const RELATED_SERVICE_HREFS = {
  revenue: ["/solutions/revenue-commercial-management"],
  digital: ["/solutions/google-ads-management", "/solutions/hotel-direct-bookings"],
} as const;

export function caseStudyRelatedServices(study: CaseStudy, locale: Locale) {
  const hrefs = /digital/i.test(study.serviceArea)
    ? RELATED_SERVICE_HREFS.digital
    : /revenue|distribution/i.test(study.serviceArea)
      ? RELATED_SERVICE_HREFS.revenue
      : [];

  return hrefs.flatMap((href) => {
    const resolved = existingHref(href, locale);
    if (!resolved) return [];
    return [{ href: resolved, label: solutionNavLabel(href, locale) }];
  });
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
    | "title"
    | "shortDescription"
    | "anonymisedLabel"
    | "hotelType"
    | "location"
    | "serviceArea"
    | "challenge"
    | "analysis"
    | "action"
    | "result"
    | "measurementPeriod"
    | "baselinePeriod"
    | "methodologyNote"
    | "sourceNotes"
  >
> & {
  metrics?: CaseMetric[];
};

const caseStudyTh: Record<string, CaseStudyLocaleOverlay> = {
  "layan-revenue-management": {
    location: "ลายัน ภูเก็ต",
    hotelType: "พูลวิลล่าพรีเมียม",
    anonymisedLabel: "พูลวิลล่าพรีเมียม ลายัน",
    serviceArea: "Revenue & Distribution",
    title: "+34.7% Room Revenue ใน 6 เดือนแรก",
    shortDescription: `การเติบโตของรายได้มาจากปริมาณห้องคืนและการเข้าพักที่แข็งขึ้นเป็นหลัก${thBr} ผ่านการบริหารราคาแบบไดนามิก${thBr} การควบคุม Inventory และการปรับ Distribution`,
    measurementPeriod: "6 เดือนแรก จากตุลาคม 2025",
    challenge:
      "โรงแรมเริ่มอยู่ภายใต้การบริหารรายได้และช่องทางการขายก่อนเข้าสู่ช่วงไฮซีซันของภูเก็ต\n\nโอกาสทางธุรกิจคือการเพิ่มปริมาณห้องคืน การเข้าพัก และรายได้ห้องพักโดยรวม ผ่านการตัดสินใจด้านราคา Inventory และ Distribution ที่ชัดขึ้น",
    analysis: "การเติบโตมาจากการขายห้องคืนได้มากขึ้นและการเข้าพักที่แข็งขึ้นเป็นหลัก ไม่ใช่แค่การขึ้นราคาอย่างเดียว",
    action: [
      "ปรับการบริหารรายได้และราคา",
      "ควบคุมเรทและ Inventory แบบไดนามิก",
      "ปรับ OTA และ Distribution",
      "ติดตาม Demand และ Booking Pace",
      "Yield management สำหรับวันพีค",
      "มาตรการเฉพาะสำหรับวันที่ยอดอ่อน",
      "วิเคราะห์ Pickup เป็นประจำ",
      "ปรับตามตลาดอย่างต่อเนื่อง",
    ].join("\n"),
    result: "การบริหารรายได้ที่ดีไม่ใช่แค่การขึ้นราคา แต่คือการจับคู่ราคา Inventory และ Demand ให้ถูกจังหวะ",
    metrics: [
      {
        id: "room-revenue",
        label: "Room Revenue",
        value: "+34.7%",
        context: `รายได้ห้องพักเพิ่ม +฿5.57M${thBr} ใน 6 เดือนแรก`,
        period: "6 เดือนแรก จากตุลาคม 2025",
        comparison: "฿16.03M → ฿21.60M",
        status: ANONYMISED,
      },
      {
        id: "additional-room-revenue",
        label: "รายได้ห้องพักเพิ่ม",
        value: "+฿5.57M",
        context: "รายได้ห้องพักเพิ่มใน 6 เดือนแรก",
        period: "6 เดือนแรก จากตุลาคม 2025",
        status: ANONYMISED,
      },
      {
        id: "additional-room-nights",
        label: "ห้องคืนเพิ่ม",
        value: "+710",
        context: "ห้องคืนที่ขายได้เพิ่ม",
        period: "6 เดือนแรก จากตุลาคม 2025",
        comparison: "1,949 → 2,659",
        status: ANONYMISED,
      },
      {
        id: "average-occupancy",
        label: "Occupancy เฉลี่ย",
        value: "+14.1 pts",
        context: "Occupancy เฉลี่ย",
        period: "6 เดือนแรก จากตุลาคม 2025",
        comparison: "59.5% → 73.6%",
        status: ANONYMISED,
      },
    ],
  },
  "patong-boutique-hotel-revenue": {
    location: "ป่าตอง ภูเก็ต",
    hotelType: "โรงแรมบูติกอิสระ",
    anonymisedLabel: "โรงแรมบูติกอิสระ ป่าตอง",
    serviceArea: "Revenue & Distribution",
    title: "ห้องเต็มอยู่แล้ว ตอนนี้ทำกำไรได้มากขึ้น",
    shortDescription: `โรงแรมมี Occupancy สูงกว่า 80% อยู่แล้ว${thBr} โอกาสจึงอยู่ที่การเพิ่มมูลค่าต่อห้องที่ขายได้${thBr} ผ่านการบริหารราคาและการบริหารเชิงพาณิชย์ที่แข็งขึ้น`,
    measurementPeriod: "ต่อปี",
    challenge:
      "โรงแรมมี Occupancy สูงกว่า 80% อยู่แล้ว\n\nโจทย์จึงไม่ใช่แค่ขายห้องให้มากขึ้น แต่คือการเพิ่มมูลค่าจากทุกห้องที่ขายได้อยู่แล้ว",
    analysis: "รายได้ส่วนใหญ่ที่เพิ่มขึ้นมาจาก ADR ที่แข็งขึ้น ไม่ใช่จากการเพิ่มปริมาณห้องอย่างมาก",
    action: [
      "Dynamic pricing",
      "ปรับเรทรายวัน",
      "ปรับ Inventory",
      "บริหาร OTA",
      "ติดตาม Pickup",
      "กลยุทธ์วันที่มีดีมานด์สูง",
      "ปรับราคาเชิงยุทธวิธีในช่วงที่ยอดอ่อน",
    ].join("\n"),
    result: "โรงแรมเดิม ห้องเดิม แต่ขายแต่ละห้องได้มีประสิทธิภาพมากขึ้น",
    metrics: [
      {
        id: "room-revenue",
        label: "Room Revenue",
        value: "+12.8%",
        context: `รายได้ห้องพักเพิ่ม +฿1.85M${thBr} ต่อปี`,
        period: "ต่อปี",
        comparison: "฿14.40M → ฿16.25M",
        status: ANONYMISED,
      },
      {
        id: "additional-annual-room-revenue",
        label: "รายได้ห้องพักเพิ่มต่อปี",
        value: "+฿1.85M",
        context: "รายได้ห้องพักเพิ่มต่อปี",
        period: "ต่อปี",
        status: ANONYMISED,
      },
      {
        id: "adr",
        label: "ADR",
        value: "+11.0%",
        context: "Blended ADR",
        period: "ต่อปี",
        comparison: "฿1,880 → ฿2,087",
        status: ANONYMISED,
      },
      {
        id: "occupancy",
        label: "Occupancy",
        value: "+4.7 pts",
        context: "Occupancy",
        period: "ต่อปี",
        comparison: "81.0% → 85.7%",
        status: ANONYMISED,
      },
    ],
  },
  "coconut-island-digital-performance": {
    location: "เกาะมะพร้าว ภูเก็ต",
    hotelType: "รีสอร์ท 5 ดาว",
    anonymisedLabel: "รีสอร์ท 5 ดาว เกาะมะพร้าว",
    serviceArea: "Digital Performance",
    title: "14.89× ROAS จากแคมเปญ Direct Booking",
    shortDescription: `แคมเปญ Google Search ที่มีโครงสร้างชัด${thBr} ใช้ข้อมูล CRM ย้อนหลังและกลยุทธ์ค้นหาที่มีเจตนาจองสูง${thBr} เพื่อสร้างรายได้จองตรงที่วัดผลได้`,
    measurementPeriod: "กรกฎาคม 2026",
    challenge:
      "เป้าหมายคือเปลี่ยนงบ Paid Search ที่ควบคุมได้ให้กลายเป็นรายได้จองตรงที่วัดผลได้ ไม่ใช่โฟกัสแค่ Impressions, Clicks หรือ Traffic",
    action: [
      "ใช้ข้อมูล CRM ย้อนหลัง 5 ปี",
      "สร้างแคมเปญ Google Search ที่มีโครงสร้างชัด",
      "เจาะกลุ่มค้นหาที่มีเจตนาจองสูง",
      "วัดผลแคมเปญเทียบกับรายได้จากการจอง",
      "ให้ความสำคัญกับการแปลงเป็นจองตรงมากกว่าปริมาณ Traffic",
    ].join("\n"),
    result:
      "งบโฆษณาที่ไม่มากสามารถสร้างรายได้ตรงได้ดี เมื่อข้อมูลลูกค้าย้อนหลัง โครงสร้างแคมเปญ และเจตนาจองสอดคล้องกัน",
    metrics: [
      {
        id: "roas",
        label: "ROAS",
        value: "14.89×",
        context: `งบโฆษณา ฿60K →${thBr} รายได้การจอง ฿1.80M`,
        period: "กรกฎาคม 2026",
        comparison: "งบโฆษณา ฿60K → รายได้การจอง ฿1.80M",
        status: ANONYMISED,
      },
      {
        id: "booking-revenue",
        label: "รายได้จากการจอง",
        value: "฿1.80M",
        context: "รายได้จองตรง",
        period: "กรกฎาคม 2026",
        status: ANONYMISED,
      },
      {
        id: "ad-spend",
        label: "งบโฆษณา",
        value: "฿60K",
        context: "งบ Paid Search",
        period: "กรกฎาคม 2026",
        status: ANONYMISED,
      },
      {
        id: "direct-bookings",
        label: "การจองตรง",
        value: "23",
        context: "การจองตรง",
        period: "กรกฎาคม 2026",
        status: ANONYMISED,
      },
      {
        id: "clicks",
        label: "Clicks",
        value: "2,100",
        context: "Clicks",
        period: "กรกฎาคม 2026",
        status: ANONYMISED,
      },
    ],
  },
  "patong-direct-booking-performance": {
    location: "ป่าตอง ภูเก็ต",
    hotelType: "โรงแรมบูติกและเรสซิเดนซ์",
    anonymisedLabel: "โรงแรมบูติกและเรสซิเดนซ์ ป่าตอง",
    serviceArea: "Digital Performance",
    title: "17.29× ROAS หลังปรับ Tracking และกลยุทธ์การค้นหา",
    shortDescription: `ปรับระบบ Attribution ผ่าน Google Tag Manager${thBr} และปรับโครงสร้างแคมเปญ${thBr} เพื่อเสริมการมองเห็นบนการค้นหาแบรนด์และผลลัพธ์การจองตรง`,
    measurementPeriod: "มิถุนายน 2026",
    challenge:
      "โรงแรมต้องการการวัดผลที่ชัดขึ้น และการมองเห็นที่ดีขึ้นในการค้นหาชื่อโรงแรมและคำค้นหาที่มีเจตนาจองสูง",
    action: [
      "สร้าง Attribution ใหม่ผ่าน Google Tag Manager",
      "ปรับโครงสร้างแคมเปญ",
      "เสริมตำแหน่งบนการค้นหาแบรนด์",
      "ปรับปรุงการวัด Conversion",
      "เชื่อมกิจกรรมแคมเปญกับรายได้จากการจอง",
    ].join("\n"),
    result: "การ Tracking และโครงสร้างแคมเปญที่ชัดขึ้น ทำให้วัดและปรับปรุงผลเทียบกับรายได้จากการจองจริงได้",
    metrics: [
      {
        id: "roas",
        label: "ROAS",
        value: "17.29×",
        context: `งบโฆษณา ฿62K →${thBr} รายได้การจอง ฿1.07M`,
        period: "มิถุนายน 2026",
        comparison: "งบโฆษณา ฿62K → รายได้การจอง ฿1.07M",
        status: ANONYMISED,
      },
      {
        id: "booking-revenue",
        label: "รายได้จากการจอง",
        value: "฿1.07M",
        context: "รายได้จองตรง",
        period: "มิถุนายน 2026",
        status: ANONYMISED,
      },
      {
        id: "ad-spend",
        label: "งบโฆษณา",
        value: "฿62K",
        context: "งบ Paid Search",
        period: "มิถุนายน 2026",
        status: ANONYMISED,
      },
      {
        id: "direct-bookings",
        label: "การจองตรง",
        value: "27",
        context: "การจองตรง",
        period: "มิถุนายน 2026",
        status: ANONYMISED,
      },
      {
        id: "clicks",
        label: "Clicks",
        value: "12,000",
        context: "Clicks",
        period: "มิถุนายน 2026",
        status: ANONYMISED,
      },
    ],
  },
};

const caseStudyComparisonsTh: Record<string, CaseStudyComparison> = {
  "layan-revenue-management": {
    resultsTable: [
      { label: "Room Revenue", before: "฿16.03M", after: "฿21.60M", change: "+34.7%", bar: 100 },
      { label: "ห้องคืนที่ขายได้", before: "1,949", after: "2,659", change: "+36.4%", bar: 100 },
      { label: "Occupancy เฉลี่ย", before: "59.5%", after: "73.6%", change: "+14.1 pts", bar: 74 },
    ],
  },
  "patong-boutique-hotel-revenue": {
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
  },
};

export function localizeCaseStudy(study: CaseStudy, locale: Locale): CaseStudy {
  if (locale !== "th") return study;
  const overlay = caseStudyTh[study.slug];
  if (!overlay) return study;
  const { metrics: overlayMetrics, ...rest } = overlay;
  const metrics = overlayMetrics
    ? study.metrics.map((metric) => {
        const local = overlayMetrics.find((item) => item.id === metric.id);
        return local ? { ...metric, ...local } : metric;
      })
    : study.metrics;
  return { ...study, ...rest, metrics };
}

export function caseStudyComparisonFor(slug: string, locale: Locale): CaseStudyComparison | undefined {
  const base = caseStudyComparisons[slug];
  if (!base) return undefined;
  if (locale !== "th") return base;
  return { ...base, ...caseStudyComparisonsTh[slug] };
}

export function caseStudyMetadata(slug: string, locale: Locale) {
  const study = getCaseStudy(slug);
  if (!study) return {};
  const route = localizePath(`/case-studies/${slug}`, locale);
  if (pageByRoute.has(route)) return metadataFor(route);

  const brand = locale === "th" ? "เดอะ เคพีไอ พลัส" : "The KPI Plus";
  const title = `${study.title} | ${brand}`;
  const canonical = `${SITE}${route}`;
  return {
    title,
    description: study.shortDescription,
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
      description: study.shortDescription,
      url: canonical,
      type: "article" as const,
    },
  };
}
