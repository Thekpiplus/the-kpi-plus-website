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

/** Listing hero stats (shared across locales — source content is English). */
export const caseStudyHeroStats: CaseStudyMetric[] = [
  { value: "+34.7%", label: "Room Revenue" },
  { value: "+฿5.57M", label: "Additional Revenue" },
  { value: "17.29×", label: "ROAS" },
  { value: "+11.0%", label: "ADR" },
];

export const caseStudyDisclaimer =
  "Results shown are based on individual hotel performance during the stated periods. Results vary depending on property, market conditions, product, pricing, distribution and operational factors and do not guarantee future performance.";

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
