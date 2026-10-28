import { formatInsightDate, insightExcerpt, insightPosts, insightUpdatedAt } from "@/lib/insights";
import { existingHref, type Locale } from "@/lib/seo";

export type WebsiteKpiStatus = "draft" | "sample" | "approved" | "anonymised";
export type WebsiteVisualStatus = "placeholder" | "replace" | "sample" | "approved" | "real";
export type WebsiteSourceStatus = "guidance" | "sample" | "approved";
export type WebsiteTrackingEventStatus = "supported" | "not-configured" | "pending-approval";

export const WEBSITE_VISUAL = {
  displayWidth: 960,
  displayHeight: 720,
} as const;

/** Labelled sample only. Omit src when the file is missing; do not invent a live hotel website. */
export const WEBSITE_HERO_VISUAL_CANDIDATE = "/images/hotel-website-design-hero-placeholder.webp";

export const WEBSITE_HERO_CAPABILITIES = [
  "Responsive",
  "CMS-ready",
  "Booking Engine-ready",
  "Measurement-ready",
] as const;

export const WEBSITE_SOURCES = {
  googleIpsos: {
    name: "Google / Ipsos — Asia-Pacific traveller behaviour",
    url: "https://business.google.com/in/think/consumer-insights/insights-apac-traveler-behaviors/",
    publishedAt: "2023",
    accessedAt: "2026-10-28",
    market: "Asia-Pacific including Thailand",
    period: "Study window published by Google/Ipsos",
    definition: "Share of travellers who want to feel sure before they book, and who check travel facts from another source.",
    status: "guidance" as const,
  },
  thaiCancellation: {
    name: "Thai research on price and cancellation terms in online hotel booking",
    url: "https://so03.tci-thaijo.org/index.php/art/article/view/288881",
    publishedAt: "2025",
    accessedAt: "2026-10-28",
    market: "Thailand",
    period: "2025 study, 510 respondents",
    definition: "How price and cancellation terms together affect booking intention.",
    status: "guidance" as const,
  },
} as const;

export const WEBSITE_KPI_COLORS = {
  positive: "#A2DC25",
  target: "#EBE722",
  warning: "#E3A008",
  navy: "#0B1F33",
  axis: "#3B3B3B",
  label: "#555555",
  grid: "#E3E8EB",
} as const;

export const WEBSITE_KPI_GROUPS = [
  {
    id: "landing",
    num: "01",
    titleTh: "Engagement",
    titleEn: "Engagement",
    noteTh: "ดูว่าลูกค้าเข้าหน้าห้องพัก ข้อเสนอ หรือหน้าที่สำคัญจริงหรือไม่ ไม่ใช่ยอดจอง",
    noteEn: "Whether guests reach room, offer, and other key pages. Not a booking count.",
  },
  {
    id: "mobile",
    num: "02",
    titleTh: "Mobile",
    titleEn: "Mobile",
    noteTh: "ดูพฤติกรรมบนมือถือ เพราะเป็นอุปกรณ์หลักที่ลูกค้าใช้ค้นหาและเดินทางไปสู่การจอง",
    noteEn: "Phone use of the official website, because that is how most guests search and continue toward a booking.",
  },
  {
    id: "intent",
    num: "03",
    titleTh: "Contact Intent",
    titleEn: "Contact Intent",
    noteTh: "ดูการกดโทร แชต แบบฟอร์ม หรือการเข้าสู่ Booking Engine การคลิกจองยังไม่ใช่การจองสำเร็จ",
    noteEn: "Calls, chat, forms, and Booking Engine starts. A Book click is not a completed booking.",
  },
  {
    id: "outcome",
    num: "04",
    titleTh: "Booking Outcome",
    titleEn: "Booking Outcome",
    noteTh: "แสดงได้เมื่อ Booking Engine และ Tracking Event เชื่อมต่อและได้รับอนุญาตให้ใช้ข้อมูล",
    noteEn: "Shown only when the Booking Engine and tracking events are connected and approved for use.",
  },
] as const;

export const WEBSITE_KPI_SAMPLE = {
  period: "Sample 6-week window after launch",
  periodTh: "ตัวอย่างช่วง 6 สัปดาห์หลังเปิดใช้",
  market: "Sample hotel website · Thailand",
  marketTh: "ตัวอย่างเว็บไซต์โรงแรม · ประเทศไทย",
  source: "Hotel website analytics / Booking Engine events · labelled sample",
  sourceTh: "การวัดผลเว็บไซต์โรงแรม / อีเวนต์ระบบจอง · ตัวอย่างข้อมูล",
  updatedAt: "2026-10-28",
  comparison: "Hotel baseline after launch, when analytics access exists",
  comparisonTh: "เทียบกับฐานของโรงแรมหลังเปิดใช้ เมื่อมีสิทธิ์ดูการวัดผล",
} as const;

export const WEBSITE_KPI_OUTCOME_NOTE =
  "Booking Outcome จะแสดงได้เมื่อ Booking Engine และ Tracking Event เชื่อมต่อและได้รับอนุญาตให้ใช้ข้อมูล";

export const WEBSITE_KPI_SAMPLE_SERIES = [
  {
    id: "landing-engagement",
    group: "landing",
    name: "Landing page engagement",
    labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
    values: [22, 28, 26, 34, 33, 41],
    target: "38",
    tone: "positive" as const,
  },
  {
    id: "mobile-visits",
    group: "mobile",
    name: "Mobile visits",
    labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
    values: [18, 24, 23, 29, 31, 36],
    target: "32",
    tone: "positive" as const,
  },
  {
    id: "booking-engine-starts",
    group: "intent",
    name: "Booking Engine starts",
    labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
    values: [6, 8, 7, 11, 10, 13],
    target: "12",
    tone: "positive" as const,
  },
] as const;

export const WEBSITE_KPIS = [
  {
    id: "room-detail-views",
    group: "landing",
    nameTh: "Room detail views",
    nameEn: "Room detail views",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Views of room pages",
    definition: "Guests opening a room page. Not a booking count.",
    comparison: WEBSITE_KPI_SAMPLE.comparison,
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "green" as const,
  },
  {
    id: "cta-clicks",
    group: "landing",
    nameTh: "CTA clicks",
    nameEn: "CTA clicks",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Clicks on primary calls to action",
    definition: "Clicks on Book, contact, or other primary buttons on key pages.",
    comparison: WEBSITE_KPI_SAMPLE.comparison,
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "green" as const,
  },
  {
    id: "offer-views",
    group: "landing",
    nameTh: "Offer views",
    nameEn: "Offer views",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Views of offer or promotion pages",
    definition: "Guests opening an offer page. Not a completed stay.",
    comparison: WEBSITE_KPI_SAMPLE.comparison,
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "green" as const,
  },
  {
    id: "landing-engagement",
    group: "landing",
    nameTh: "Landing page engagement",
    nameEn: "Landing page engagement",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Engaged sessions on room, offer, and location pages",
    definition: "Whether guests stay with the pages that answer rooms, rates, and location.",
    comparison: WEBSITE_KPI_SAMPLE.comparison,
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "green" as const,
  },
  {
    id: "mobile-visits",
    group: "mobile",
    nameTh: "Mobile visits",
    nameEn: "Mobile visits",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Share of key-page sessions on a phone",
    definition: "Phone use of the official website. Not a conversion rate.",
    comparison: "Target: key pages usable at 390px",
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "green" as const,
  },
  {
    id: "page-speed",
    group: "mobile",
    nameTh: "Page speed",
    nameEn: "Page speed",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Key-page load on a phone",
    definition: "How quickly room and booking-path pages become usable on a phone.",
    comparison: "Compared with the hotel’s own baseline after launch",
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "green" as const,
  },
  {
    id: "interaction-success",
    group: "mobile",
    nameTh: "Interaction success",
    nameEn: "Interaction success",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Successful taps on contact, menu, and book controls",
    definition: "Whether phone controls work. Failed taps are not a booking result.",
    comparison: "Target: room, offer, contact, and book actions usable at 390px",
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "green" as const,
  },
  {
    id: "error-rate",
    group: "mobile",
    nameTh: "Error rate",
    nameEn: "Error rate",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Share of key-page sessions with a blocking error",
    definition: "Broken pages or failed scripts on the path to contact or book.",
    comparison: "Lower than the hotel’s own baseline after launch",
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "amber" as const,
  },
  {
    id: "mobile-booking-path",
    group: "mobile",
    nameTh: "Mobile booking path completion",
    nameEn: "Mobile booking path completion",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Phone sessions that reach the booking engine, where measurable",
    definition: "Completion of the phone path into the booking engine. Not a completed booking.",
    comparison: "Tracked only where the hotel’s site can send the event",
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "amber" as const,
  },
  {
    id: "calls",
    group: "intent",
    nameTh: "Calls",
    nameEn: "Calls",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Clicks to call",
    definition: "A tap or click that starts a phone call. Not a completed booking.",
    comparison: WEBSITE_KPI_SAMPLE.comparison,
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "green" as const,
  },
  {
    id: "contact-form",
    group: "intent",
    nameTh: "Contact form submissions",
    nameEn: "Contact form submissions",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Form submits the hotel can verify",
    definition: "A contact form the hotel can see. Not a booking.",
    comparison: WEBSITE_KPI_SAMPLE.comparison,
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "green" as const,
  },
  {
    id: "chat-starts",
    group: "intent",
    nameTh: "Chat starts",
    nameEn: "Chat starts",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Chat widgets opened",
    definition: "A guest opening chat. Not a completed stay.",
    comparison: WEBSITE_KPI_SAMPLE.comparison,
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "green" as const,
  },
  {
    id: "booking-engine-starts",
    group: "intent",
    nameTh: "Booking Engine starts",
    nameEn: "Booking Engine starts",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Clicks that enter the booking engine",
    definition: "Intent to book. A Book click is not a completed booking.",
    comparison: "Tracked only where the hotel’s site and engine can send the event",
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "green" as const,
  },
  {
    id: "availability-checks",
    group: "intent",
    nameTh: "Availability checks",
    nameEn: "Availability checks",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Date or room searches, where supported",
    definition: "A search for dates or rooms. Shown only when the engine can send the event.",
    comparison: "Where the booking engine supports the event",
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "amber" as const,
  },
  {
    id: "booking-complete",
    group: "outcome",
    nameTh: "Booking complete",
    nameEn: "Booking complete",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Bookings the engine or hotel system confirms",
    definition: "A completed booking only if the engine or hotel system confirms it.",
    comparison: "Not shown as a public hotel result until tracking is approved",
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "amber" as const,
  },
  {
    id: "conversion-rate",
    group: "outcome",
    nameTh: "Conversion rate",
    nameEn: "Conversion rate",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Completed bookings / sessions, when both are approved",
    definition: "A rate only when completed bookings are returned and approved for use.",
    comparison: "Not shown until Booking Engine tracking is connected and approved",
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "amber" as const,
  },
  {
    id: "direct-booking-value",
    group: "outcome",
    nameTh: "Direct booking value",
    nameEn: "Direct booking value",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Confirmed direct booking value",
    definition: "Revenue the hotel can confirm from the official website path.",
    comparison: "Not shown until value is returned and approved",
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "amber" as const,
  },
  {
    id: "cost-revenue-attribution",
    group: "outcome",
    nameTh: "Cost or revenue attribution",
    nameEn: "Cost or revenue attribution",
    period: WEBSITE_KPI_SAMPLE.period,
    market: WEBSITE_KPI_SAMPLE.market,
    unit: "Approved cost or revenue attributed to the website",
    definition: "Shown only where the hotel approves the attribution method.",
    comparison: "Not shown until attribution is connected and approved",
    source: WEBSITE_KPI_SAMPLE.source,
    dataStatus: "sample" as WebsiteKpiStatus,
    hideUntilData: true,
    updatedAt: WEBSITE_KPI_SAMPLE.updatedAt,
    tone: "amber" as const,
  },
] as const;

export function websiteKpiIsPublic(kpi: {
  hideUntilData?: boolean;
  dataStatus?: string;
  name?: string;
  period?: string;
  unit?: string;
  definition?: string;
  value?: string;
  group?: string;
}) {
  if (kpi.group === "outcome") return websiteKpiShowsOutcome(kpi);
  if (kpi.hideUntilData) return false;
  if (kpi.dataStatus === "draft") return false;
  if (kpi.dataStatus !== "approved" && kpi.dataStatus !== "anonymised") return false;
  if (!String(kpi.name || "").trim() || !String(kpi.period || "").trim()) return false;
  if (!String(kpi.unit || "").trim() && !String(kpi.definition || "").trim()) return false;
  return Boolean(String(kpi.value || "").trim());
}

export function websiteKpiShowsOutcome(kpi: {
  hideUntilData?: boolean;
  dataStatus?: string;
  value?: string;
}) {
  if (kpi.hideUntilData) return false;
  if (kpi.dataStatus !== "approved" && kpi.dataStatus !== "anonymised") return false;
  return Boolean(String(kpi.value || "").trim());
}

export function websiteKpiPublicStatus(status?: string) {
  if (status === "approved") return "Approved" as const;
  if (status === "anonymised") return "Anonymised" as const;
  return "Sample" as const;
}

export const WEBSITE_HERO_VISUAL = {
  recommendedSize: "1600 × 1000 px",
  ratio: "8 / 5",
  width: 1600,
  height: 1000,
  displayWidth: 560,
  displayHeight: 350,
  labelTh: "ตัวอย่าง Hotel Website และ Direct Booking Flow",
  labelEn: "Sample Hotel Website and Direct Booking Flow",
  captionTh: "เว็บไซต์ที่ช่วยให้ลูกค้าเข้าใจห้องพัก เงื่อนไข และขั้นตอนการจองได้ก่อนตัดสินใจ",
  captionEn: "A website that helps guests understand the rooms, terms, and booking steps before they decide.",
  altTh: "ตัวอย่างเว็บไซต์โรงแรมและเส้นทางจองตรง แสดงเดสก์ท็อป มือถือ และลำดับ Home ห้องพัก ข้อเสนอ ไปสู่ระบบจอง ไม่ใช่เว็บไซต์ลูกค้าจริง",
  altEn: "Sample hotel website and direct booking flow showing desktop, mobile, and Home to Room, Offer, then Booking Engine — not a live client site",
  status: "sample" as WebsiteVisualStatus,
  metaTh: "Sample website preview · Replace with approved hotel project",
  metaEn: "Sample website preview · Replace with approved hotel project",
};

/** Evidence checklist and booking path. Never reuse the Hero asset. */
export const WEBSITE_CONFIDENCE_VISUAL_CANDIDATE = "/images/hotel-website-booking-confidence-placeholder.webp";

export const WEBSITE_CONFIDENCE_PATH = [
  { en: "Room Details", th: "รายละเอียดห้องพัก" },
  { en: "Price / Policy", th: "ราคาและนโยบาย" },
  { en: "CTA", th: "ปุ่มดำเนินการ" },
  { en: "Booking Path", th: "เส้นทางจอง" },
] as const;

export const WEBSITE_CONFIDENCE_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 480,
  displayHeight: 320,
  labelTh: "ตัวอย่างข้อมูลที่ช่วยสร้างความมั่นใจก่อนจอง",
  labelEn: "Sample facts that help guests feel sure before they book",
  captionTh: "ลำดับที่ลูกค้าใช้ยืนยันก่อนจอง: รายละเอียดห้องพัก ราคาและนโยบาย ปุ่มดำเนินการ และเส้นทางจอง — ไม่ใช่ผลโรงแรม",
  captionEn: "The path guests confirm before they book: Room Details, Price/Policy, CTA, and Booking Path — not a hotel result.",
  altTh: "แผนภาพตัวอย่างข้อมูลที่ช่วยสร้างความมั่นใจก่อนจอง แสดงรายละเอียดห้องพัก ราคาและนโยบาย ปุ่มดำเนินการ และเส้นทางจอง โดยปิดข้อมูลโรงแรม",
  altEn: "Sample booking-confidence diagram showing Room Details, Price/Policy, CTA, and Booking Path, with hotel data redacted",
  status: "sample" as WebsiteVisualStatus,
  metaTh: "Sample data · Not a hotel result · Replace with approved hotel project",
  metaEn: "Sample data · Not a hotel result · Replace with approved hotel project",
};

export const WEBSITE_READINESS_VISUAL_CANDIDATE = "/images/hotel-website-readiness-checklist-placeholder.webp";

export const WEBSITE_READINESS_ROWS = [
  {
    id: "room-clarity",
    questionTh: "ห้องพักชัดพอไหม?",
    questionEn: "Is room information clear?",
    evidenceTh: "ภาพห้อง, ขนาดห้อง, สิ่งอำนวยความสะดวก, ชนิดเตียง, จำนวนผู้เข้าพัก",
    evidenceEn: "Photos, room size, facilities, bed type, occupancy",
    statusTh: "ตัวอย่าง · รอตรวจบนเว็บไซต์โรงแรม",
    statusEn: "Sample · Review on the hotel website",
    actionTh: "ตรวจว่าหน้าห้องพักแสดงภาพ ขนาด สิ่งอำนวยความสะดวก ชนิดเตียง และจำนวนผู้เข้าพักได้ครบ",
    actionEn: "Check that the room page shows photos, size, facilities, bed type, and occupancy.",
    output: "Room Detail Page",
  },
  {
    id: "location-clarity",
    questionTh: "ลูกค้าเข้าใจทำเลไหม?",
    questionEn: "Can guests understand the location?",
    evidenceTh: "แผนที่, จุดใกล้เคียง, เวลาเดินทาง, วิธีเดินทาง",
    evidenceEn: "Map, nearby destinations, travel time, transport",
    statusTh: "ตัวอย่าง · รอตรวจบนเว็บไซต์โรงแรม",
    statusEn: "Sample · Review on the hotel website",
    actionTh: "ใส่แผนที่ จุดใกล้เคียง เวลาเดินทาง และเส้นทางเดินทางให้หาได้ก่อนจอง",
    actionEn: "Show a map, nearby places, travel time, and how to get there before booking.",
    output: "Location Module",
  },
  {
    id: "price-policy",
    questionTh: "ราคาและเงื่อนไขชัดไหม?",
    questionEn: "Are price and policy clear?",
    evidenceTh: "ราคา, สิ่งที่รวม, โปรโมชั่น, การยกเลิก, ภาษีและค่าธรรมเนียมถ้ามี",
    evidenceEn: "Price, inclusions, promotion, cancellation, taxes/fees where applicable",
    statusTh: "ตัวอย่าง · รอตรวจบนเว็บไซต์โรงแรม",
    statusEn: "Sample · Review on the hotel website",
    actionTh: "แสดงราคา สิ่งที่รวม โปรโมชั่น เงื่อนไขยกเลิก และภาษีหรือค่าธรรมเนียมเมื่อมีข้อมูล",
    actionEn: "Show the rate, inclusions, offer, cancellation terms, and taxes or fees when they apply.",
    output: "Offer/Pricing Block",
  },
  {
    id: "contact-booking",
    questionTh: "ติดต่อหรือจองต่อได้ง่ายไหม?",
    questionEn: "Can guests contact or book easily?",
    evidenceTh: "ปุ่ม CTA, โทร, แชต, แบบฟอร์ม, ระบบจอง",
    evidenceEn: "CTA, phone, chat, contact form, booking engine",
    statusTh: "ตัวอย่าง · รอตรวจบนเว็บไซต์โรงแรม",
    statusEn: "Sample · Review on the hotel website",
    actionTh: "ให้ปุ่มจอง เบอร์โทร แชต ฟอร์ม และระบบจองอยู่ตำแหน่งที่ลูกค้าหาได้ทันที",
    actionEn: "Place the book CTA, phone, chat, form, and booking engine where guests can find them at once.",
    output: "Conversion Path",
  },
  {
    id: "booking-flow",
    questionTh: "เส้นทางไปสู่การจองลื่นไหม?",
    questionEn: "Is the booking flow clear?",
    evidenceTh: "ขั้นตอนบนมือถือ, จำนวนคลิก, การโหลด, สถานะผิดพลาด, การยืนยัน",
    evidenceEn: "Mobile flow, number of clicks, loading, error state, confirmation",
    statusTh: "ตัวอย่าง · รอตรวจบนเว็บไซต์โรงแรม",
    statusEn: "Sample · Review on the hotel website",
    actionTh: "ตรวจเส้นทางจองบนมือถือ จำนวนคลิก การโหลด สถานะผิดพลาด และการยืนยัน",
    actionEn: "Review the mobile booking path, click count, loading, error states, and confirmation.",
    output: "Booking UX Checklist",
  },
  {
    id: "team-ownership",
    questionTh: "ทีมโรงแรมดูแลต่อเองได้ไหม?",
    questionEn: "Can the hotel team keep owning the site?",
    evidenceTh: "CMS, สิทธิ์ผู้ใช้, คู่มือเนื้อหา, ขั้นตอนส่งมอบ",
    evidenceEn: "CMS, roles, content guide, handover process",
    statusTh: "ตัวอย่าง · รอตรวจกับทีมโรงแรม",
    statusEn: "Sample · Review with the hotel team",
    actionTh: "กำหนด CMS สิทธิ์ คู่มือเนื้อหา และขั้นตอนส่งมอบให้ทีมโรงแรมใช้ต่อได้",
    actionEn: "Set the CMS, roles, content guide, and handover steps so the hotel team can continue.",
    output: "Handover Plan",
  },
] as const;

export const WEBSITE_READINESS_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  labelTh: "Hotel Website Readiness Checklist — Sample",
  labelEn: "Hotel Website Readiness Checklist — Sample",
  captionTh: "รายการตรวจความพร้อมของเว็บไซต์โรงแรม ไม่ใช่คะแนนโปรเจกต์จริง",
  captionEn: "A hotel website readiness checklist. Not a scored live project.",
  altTh: "ตารางตัวอย่าง Hotel Website Readiness Checklist แสดงคำถาม หลักฐาน สถานะ แนวทางปรับ และผลลัพธ์",
  altEn: "Sample Hotel Website Readiness Checklist showing question, evidence, status, recommended action, and output",
  status: "sample" as WebsiteVisualStatus,
  metaTh: "Sample data · Not a hotel score · HTML checklist",
  metaEn: "Sample data · Not a hotel score · HTML checklist",
};

export const WEBSITE_FRAMEWORK_VISUAL_CANDIDATE = "/images/hotel-website-service-framework-placeholder.webp";

export const WEBSITE_FRAMEWORK_STAGES = [
  { id: "strategy", en: "Strategy", th: "Strategy" },
  { id: "ux", en: "UX", th: "UX" },
  { id: "build", en: "Build", th: "Build" },
  { id: "tracking", en: "Tracking", th: "Tracking" },
  { id: "handover", en: "Handover", th: "Handover" },
] as const;

export const WEBSITE_FRAMEWORK_PILLARS = [
  {
    id: "guest-perspective",
    num: "01",
    stage: "Strategy",
    titleTh: "วางเว็บไซต์จากมุมมองของผู้เข้าพัก",
    titleEn: "Plan the site from the guest’s point of view",
    inputTh: "ข้อมูลโรงแรม ห้องพัก ทำเล และเว็บไซต์ปัจจุบัน",
    inputEn: "Current hotel facts, rooms, location, and the existing website",
    actionTh: "จัดหน้าและลำดับข้อมูลให้ลูกค้าเข้าใจโรงแรม ตั้งแต่ภาพรวม ห้องพัก ทำเล สิ่งอำนวยความสะดวก ไปจนถึงข้อเสนอและวิธีจอง",
    actionEn: "Arrange the pages and the order of facts so guests understand the hotel, from the overview, rooms, location, and facilities through to the offer and how to book.",
    output: "Strategy",
    approvalTh: "ข้อความแบรนด์ และวิธีเล่าเรื่องโรงแรม",
    approvalEn: "Brand message and how the hotel is described",
  },
  {
    id: "mobile-ux",
    num: "02",
    stage: "UX",
    titleTh: "ออกแบบให้ใช้งานง่ายบนมือถือ",
    titleEn: "Design for easy use on a phone",
    inputTh: "หน้าสำคัญ และอุปกรณ์ที่ลูกค้าใช้งานจริง",
    inputEn: "Key pages and the devices guests actually use",
    actionTh: "ดูทั้งการอ่าน การนำทาง ความเร็วของหน้า ปุ่มติดต่อ และเส้นทางไปหน้าจองบนอุปกรณ์ที่ลูกค้าใช้งานจริง",
    actionEn: "Review reading, navigation, page speed, contact buttons, and the path to the booking page on the devices guests actually use.",
    output: "UX",
    approvalTh: "เส้นทางติดต่อและการจองที่แสดงบนเว็บไซต์",
    approvalEn: "How contact and booking paths are shown",
  },
  {
    id: "real-content",
    num: "03",
    stage: "Build",
    titleTh: "เล่าเรื่องโรงแรมด้วยข้อมูลและภาพจริง",
    titleEn: "Tell the hotel story with real facts and photos",
    inputTh: "เนื้อหาที่มีอยู่ และภาพที่โรงแรมอนุมัติ",
    inputEn: "Existing copy and hotel-approved images",
    actionTh: "พัฒนาเนื้อหาที่แสดงจุดเด่นโดยไม่กล่าวเกินจริง พร้อมวางรายการภาพที่มีอยู่และภาพที่ควรจัดทำเพิ่ม",
    actionEn: "Develop copy that shows the strengths without overstating them, and list which photos already exist and which ones still need to be made.",
    output: "Build",
    approvalTh: "ภาพโรงแรมจริง และข้อความแบรนด์",
    approvalEn: "Real hotel images and brand message",
  },
  {
    id: "system-measurement",
    num: "04",
    stage: "Tracking",
    titleTh: "เชื่อมระบบจองและการวัดผล",
    titleEn: "Connect the booking system and measurement",
    inputTh: "ระบบจองปัจจุบัน และบัญชีวัดผลที่โรงแรมอนุญาตให้ใช้",
    inputEn: "The current booking system and measurement accounts the hotel allows",
    actionTh: "ตรวจว่าหน้าห้องพักและข้อเสนอพาลูกค้าไปยัง Booking Engine ได้ชัด พร้อมตั้งค่าการวัดผลตามความสามารถของเว็บไซต์และระบบจอง",
    actionEn: "Check that room and offer pages send guests clearly into the booking engine, and set measurement according to what the website and booking system can actually report.",
    output: "Tracking",
    approvalTh: "ราคา โปรโมชั่น นโยบาย และการเข้าถึงบัญชีภายนอก",
    approvalEn: "Prices, promotions, policies, and external account access",
  },
  {
    id: "hotel-ownership",
    num: "05",
    stage: "Handover",
    titleTh: "ทำให้ทีมโรงแรมดูแลเว็บต่อได้",
    titleEn: "Make the site something the hotel team can look after",
    inputTh: "ใครจะดูแลเนื้อหา และ CMS ที่ทีมจะใช้ต่อ",
    inputEn: "Who will update content and the CMS the team will keep using",
    actionTh: "เลือกวิธีจัดการเนื้อหาให้เหมาะกับคนที่จะใช้งานจริง หากทีมต้องอัปเดตรูป ข้อความ หรือโปรโมชั่นเอง เว็บไซต์ควรมีขั้นตอนแก้ไขที่เข้าใจง่าย และกำหนดสิทธิ์ได้เหมาะสม",
    actionEn: "Choose a content method that fits the people who will use it. If the team will update photos, copy, or offers themselves, the edit steps should be easy to understand and the access rights should be set.",
    output: "Handover",
    approvalTh: "การเข้าถึงบัญชีภายนอก และสิทธิ์หลังส่งมอบ",
    approvalEn: "External account access and post-handover permissions",
  },
] as const;

export const WEBSITE_FRAMEWORK_BOUNDARY = {
  kicker: "Responsibility boundary",
  supportTitle: {
    th: "เดอะ เคพีไอ พลัส อาจช่วย",
    en: "The KPI Plus may support",
  },
  approveTitle: {
    th: "โรงแรมเป็นผู้อนุมัติ",
    en: "The hotel approves",
  },
  note: {
    th: "เดอะ เคพีไอ พลัส อาจช่วยด้านโครงสร้างเว็บไซต์ ทิศทาง UX/UI กรอบเนื้อหา ความเข้ากันได้ของ CMS และเทคโนโลยี เส้นทางจอง แผนการวัดผล QA และการส่งมอบ โรงแรมเป็นผู้อนุมัติข้อความแบรนด์ ภาพโรงแรมจริง ราคา โปรโมชั่น นโยบาย ข้อความด้านกฎหมาย และการเข้าถึงบัญชีภายนอก",
    en: "The KPI Plus may support website structure, UX/UI direction, content framework, CMS/technology fit, booking path, tracking plan, QA, and handover. The hotel approves brand message, real hotel images, prices, promotions, policies, legal claims, and external account access.",
  },
  support: [
    { th: "โครงสร้างเว็บไซต์", en: "website structure" },
    { th: "ทิศทาง UX/UI", en: "UX/UI direction" },
    { th: "กรอบเนื้อหา", en: "content framework" },
    { th: "ความเข้ากันได้ของ CMS/เทคโนโลยี", en: "CMS/technology fit" },
    { th: "เส้นทางจอง", en: "booking path" },
    { th: "แผนการวัดผล", en: "tracking plan" },
    { th: "QA", en: "QA" },
    { th: "การส่งมอบ", en: "handover" },
  ],
  approve: [
    { th: "ข้อความแบรนด์", en: "brand message" },
    { th: "ภาพโรงแรมจริง", en: "real hotel images" },
    { th: "ราคา", en: "prices" },
    { th: "โปรโมชั่น", en: "promotions" },
    { th: "นโยบาย", en: "policies" },
    { th: "ข้อความด้านกฎหมาย", en: "legal claims" },
    { th: "การเข้าถึงบัญชีภายนอก", en: "external account access" },
  ],
} as const;

export const WEBSITE_FRAMEWORK_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  labelTh: "Hotel Website Service Framework — Sample",
  labelEn: "Hotel Website Service Framework — Sample",
  captionTh: "กรอบบริการเว็บไซต์โรงแรมตัวอย่าง ไม่ใช่แผนงานลูกค้า",
  captionEn: "Sample hotel website service framework. Not a client project plan.",
  altTh: "แผนภาพตัวอย่าง Hotel Website Service Framework แสดง Strategy, UX, Build, Tracking และ Handover",
  altEn: "Sample Hotel Website Service Framework diagram showing Strategy, UX, Build, Tracking, and Handover",
  status: "sample" as WebsiteVisualStatus,
  metaTh: "Sample framework · 1600 × 900 px · Display 720 × 405 px · 16:9",
  metaEn: "Sample framework · 1600 × 900 px · Display 720 × 405 px · 16:9",
};

export const WEBSITE_CMS_STACK_VISUAL_CANDIDATE = "/images/hotel-website-cms-stack-placeholder.webp";

export const WEBSITE_CMS_STACK_STAGES = [
  { id: "cms", en: "Content / CMS", th: "เนื้อหา / CMS" },
  { id: "frontend", en: "Website Frontend", th: "ส่วนหน้าเว็บไซต์" },
  { id: "booking", en: "Booking Engine", th: "ระบบจอง" },
  { id: "analytics", en: "Analytics/Search/CRM", th: "Analytics/Search/CRM" },
  { id: "ownership", en: "Hotel Team Ownership", th: "กรรมสิทธิ์ของทีมโรงแรม" },
] as const;

export const WEBSITE_CMS_FIT_ROWS = [
  {
    id: "cms",
    needTh: "CMS",
    needEn: "CMS",
    optionTh: "WordPress หรือ CMS ที่มีอยู่",
    optionEn: "WordPress or the existing CMS",
    suitableTh: "เมื่อทีมโรงแรมต้องแก้เนื้อหา",
    suitableEn: "When the hotel team needs to edit content",
    verifyTh: "บทบาท ความปลอดภัย โฮสติ้ง การสำรองข้อมูล และกรรมสิทธิ์ปลั๊กอิน/การอัปเดต",
    verifyEn: "Roles, security, hosting, backup, and plugin/update ownership",
    ownershipTh: "ทีมโรงแรมเป็นเจ้าของ CMS",
    ownershipEn: "Hotel team owns the CMS",
  },
  {
    id: "development",
    needTh: "Development",
    needEn: "Development",
    optionTh: "ทีมพัฒนาที่มีอยู่, Cursor, Claude, Manus หรือเครื่องมืออื่นที่อนุมัติ",
    optionEn: "Existing development team, Cursor, Claude, Manus, or other approved tools",
    suitableTh: "เมื่อใช้ช่วยพัฒนา ทำต้นแบบ จัดทำเอกสาร หรือบำรุงรักษา",
    suitableEn: "When supporting development, prototyping, documentation, or maintenance",
    verifyTh: "การตรวจโค้ด QA ความปลอดภัย กรรมสิทธิ์ ที่เก็บโค้ด และกระบวนการส่งขึ้นระบบ",
    verifyEn: "Code review, QA, security, ownership, repository, and deployment process",
    ownershipTh: "เจ้าของซอร์สโค้ดตามที่ตกลงเมื่อส่งมอบ",
    ownershipEn: "Source-code owner agreed at handover",
  },
  {
    id: "booking",
    needTh: "Booking",
    needEn: "Booking",
    optionTh: "Booking Engine ที่มีอยู่ หรือระบบใหม่ที่อนุมัติ",
    optionEn: "Existing Booking Engine or an approved new system",
    suitableTh: "เมื่อต้องมีการจองตรง",
    suitableEn: "When direct booking is required",
    verifyTh: "API, URL, ราคา/ห้องว่าง, การวัดผล, พฤติกรรมบนมือถือ และความยินยอม",
    verifyEn: "API, URL, rate/availability, tracking, mobile behavior, and consent",
    ownershipTh: "โรงแรมเป็นเจ้าของบัญชีระบบจอง",
    ownershipEn: "Hotel owns the booking-engine account",
  },
  {
    id: "analytics",
    needTh: "Analytics",
    needEn: "Analytics",
    optionTh: "Analytics, Search Console, event tracking, CRM",
    optionEn: "Analytics, Search Console, event tracking, CRM",
    suitableTh: "เมื่อการวัดผลได้รับอนุมัติและตั้งค่าแล้ว",
    suitableEn: "When measurement is approved and configured",
    verifyTh: "อีเวนต์ ความยินยอม การควบคุมสิทธิ์ การเก็บข้อมูล และผู้รับผิดชอบ",
    verifyEn: "Events, consent, access control, data retention, and owner",
    ownershipTh: "โรงแรมเป็นเจ้าของ Analytics",
    ownershipEn: "Hotel owns Analytics",
  },
] as const;

export const WEBSITE_CMS_FIT_NOTE = {
  th: "เครื่องมือเป็นส่วนช่วยให้ทีมทำงานได้เร็วขึ้น เว็บไซต์ที่ส่งมอบต้องใช้งานได้จริง ดูแลต่อได้ และมีผู้รับผิดชอบชัดเจน",
  en: "Tools help the team work faster. The website handed over must be usable, possible to look after, and have a clear owner.",
} as const;

export const WEBSITE_CMS_FIT_DISCLAIMER = {
  th: "ชื่อเครื่องมือเป็นตัวเลือกตัวอย่าง ไม่ได้หมายถึงการเป็นพาร์ทเนอร์ ผู้สนับสนุน หรือการรับรองอย่างเป็นทางการ",
  en: "Tool names are sample options. They do not mean a partnership, sponsorship, or official endorsement.",
} as const;

export const WEBSITE_CMS_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  labelTh: "Hotel Website CMS and Technology Fit — Sample",
  labelEn: "Hotel Website CMS and Technology Fit — Sample",
  captionTh: "แผนภาพตัวอย่างชุดเทคโนโลยีเว็บไซต์โรงแรม ไม่ใช่สถาปัตยกรรมลูกค้า",
  captionEn: "Sample hotel website CMS and technology fit. Not a client architecture.",
  altTh: "แผนภาพตัวอย่าง Hotel Website CMS and Technology Fit แสดง Content / CMS ไป Website Frontend, Booking Engine, Analytics/Search/CRM และ Hotel Team Ownership",
  altEn: "Sample Hotel Website CMS and Technology Fit diagram from Content / CMS to Website Frontend, Booking Engine, Analytics/Search/CRM, and Hotel Team Ownership",
  status: "sample" as WebsiteVisualStatus,
  metaTh: "Sample stack · 1600 × 900 px · Display 720 × 405 px · 16:9",
  metaEn: "Sample stack · 1600 × 900 px · Display 720 × 405 px · 16:9",
};

export const WEBSITE_DECISION_VISUAL_CANDIDATE = "/images/hotel-website-build-vs-improve-placeholder.webp";

export const WEBSITE_DECISION_STEPS = [
  { id: "audit", en: "Audit Existing System", th: "ตรวจระบบที่มีอยู่" },
  { id: "review", en: "Review Content/Mobile/Speed/Booking/Tracking", th: "ทบทวนเนื้อหา มือถือ ความเร็ว ระบบจอง และการวัดผล" },
  { id: "estimate", en: "Estimate Effort and Risk", th: "ประเมินภาระงานและความเสี่ยง" },
  { id: "choose", en: "Choose Improve or Rebuild", th: "เลือกปรับหรือสร้างใหม่" },
] as const;

export const WEBSITE_DECISION_PATHS = [
  {
    id: "improve",
    titleTh: "ปรับเว็บไซต์เดิม",
    titleEn: "Improve Existing Website",
    startingTh: [
      "CMS เดิมยังดูแลต่อได้",
      "ประสบการณ์บนมือถือปรับได้",
      "Booking Engine ยังเชื่อมต่อได้",
      "SEO และการวัดผลเดิมเก็บไว้ได้",
      "ปัญหาหลักอยู่ที่เนื้อหา UX ความเร็ว หรือเส้นทางจอง",
    ],
    startingEn: [
      "Existing CMS can still be maintained",
      "Mobile experience can be fixed",
      "Booking Engine can remain connected",
      "Existing SEO and tracking can be preserved",
      "Main problems are content, UX, speed, or conversion path",
    ],
    advantagesTh: "เก็บ CMS ระบบจอง SEO และการวัดผลเดิมไว้ได้ แล้วปรับเนื้อหา UX ความเร็ว หรือเส้นทางจอง",
    advantagesEn: "Keep the current CMS, booking connection, SEO, and tracking, then fix content, UX, speed, or the conversion path",
    risksTh: "ถ้าแพลตฟอร์มหรือสถาปัตยกรรมเดิมจำกัดการเปลี่ยนแปลงที่จำเป็น ข้อจำกัดนั้นอาจยังอยู่",
    risksEn: "If the current platform or architecture limits the required changes, those limits can remain",
    dependenciesTh: "ความสามารถของทีมโรงแรม กรรมสิทธิ์ งบประมาณ ระยะเวลา สิทธิ์แก้ไข และระบบจองที่มีอยู่",
    dependenciesEn: "Hotel-team capability, ownership, budget, timeline, edit access, and the existing booking system",
    nextTh: "ตรวจระบบเดิมก่อน หาก CMS มือถือ ระบบจอง และการวัดผลยังใช้ต่อได้ จึงปรับเนื้อหา UX ความเร็ว หรือเส้นทางจอง",
    nextEn: "Audit the current system first. If CMS, mobile, booking, and tracking can still be used, improve content, UX, speed, or the conversion path",
  },
  {
    id: "rebuild",
    titleTh: "สร้างเว็บไซต์ใหม่",
    titleEn: "Build New Website",
    startingTh: [
      "แพลตฟอร์มเดิมจำกัดการเปลี่ยนแปลงที่จำเป็น",
      "สถาปัตยกรรมต้องเปลี่ยนหลัก",
      "การเชื่อม Booking Engine ต้องออกแบบใหม่",
      "Technical SEO และการวัดผลต้องวางฐานใหม่",
      "ปัญหาหลักอยู่ที่แพลตฟอร์ม ความปลอดภัย กรรมสิทธิ์ หรือการดูแลต่อ",
    ],
    startingEn: [
      "Existing platform limits required changes",
      "Architecture requires major change",
      "Booking Engine connection must be redesigned",
      "Technical SEO and tracking need a new foundation",
      "Main problems are platform, security, ownership, or maintainability",
    ],
    advantagesTh: "วางสถาปัตยกรรม ระบบจอง Technical SEO และการวัดผลบนฐานที่ทีมโรงแรมดูแลต่อได้",
    advantagesEn: "Set architecture, booking connection, technical SEO, and tracking on a foundation the hotel team can keep looking after",
    risksTh: "การสร้างใหม่ไม่ได้ดีกว่าเสมอ หากโครงสร้างและระบบเดิมยังรองรับเป้าหมาย โรงแรมอาจรับงานเกินที่จำเป็น",
    risksEn: "A new website is not always better. If the current structure and systems still support the goal, the hotel may take on more work than needed",
    dependenciesTh: "ความสามารถของทีมโรงแรม กรรมสิทธิ์ งบประมาณ ระยะเวลา และขอบเขตงานใหม่ที่โรงแรมอนุมัติ",
    dependenciesEn: "Hotel-team capability, ownership, budget, timeline, and the new-build scope the hotel approves",
    nextTh: "ประเมินภาระงานและความเสี่ยงจากหลักฐานของระบบเดิม แล้วให้โรงแรมเลือกขอบเขตการสร้างใหม่",
    nextEn: "Estimate effort and risk from evidence on the current system, then let the hotel choose the scope of a new build",
  },
] as const;

export const WEBSITE_DECISION_NOTE = {
  th: "การเลือกปรับหรือสร้างใหม่ขึ้นกับหลักฐานจากระบบเดิม ความสามารถของทีมโรงแรม กรรมสิทธิ์ งบประมาณ และระยะเวลา ไม่ได้หมายความว่าการสร้างใหม่ดีกว่าเสมอ",
  en: "The choice depends on evidence from the current system, the hotel team’s capability, ownership, budget, and timeline. A new website is not always better.",
} as const;

export const WEBSITE_DECISION_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  labelTh: "Improve Existing Website vs Build New Website — Sample",
  labelEn: "Improve Existing Website vs Build New Website — Sample",
  captionTh: "ตารางตัดสินใจตัวอย่าง ไม่ใช่ผลเปรียบเทียบเว็บไซต์ลูกค้า และไม่ใช่ตัวเลขการจอง",
  captionEn: "Sample decision matrix. Not a client before-after, and not a conversion result.",
  altTh: "แผนภาพตัวอย่าง Improve Existing Website vs Build New Website แสดง Audit Existing System ไป Review Content/Mobile/Speed/Booking/Tracking, Estimate Effort and Risk และ Choose Improve or Rebuild",
  altEn: "Sample Improve Existing Website vs Build New Website diagram from Audit Existing System to Review Content/Mobile/Speed/Booking/Tracking, Estimate Effort and Risk, and Choose Improve or Rebuild",
  status: "sample" as WebsiteVisualStatus,
  metaTh: "Sample decision · 1600 × 900 px · Display 720 × 405 px · 16:9",
  metaEn: "Sample decision · 1600 × 900 px · Display 720 × 405 px · 16:9",
};

export const WEBSITE_WORKFLOW_VISUAL_CANDIDATE = "/images/hotel-website-project-workflow-placeholder.webp";

export const WEBSITE_WORKFLOW_STEPS = [
  {
    id: "discover",
    num: "01",
    label: "Discover",
    titleTh: "เข้าใจโรงแรม",
    titleEn: "Understand the hotel",
    ownerTh: "เดอะ เคพีไอ พลัส รวบรวม โรงแรมให้ข้อมูล",
    ownerEn: "The KPI Plus gathers facts the hotel provides",
    inputTh: "กลุ่มลูกค้า ห้องพัก จุดเด่น เว็บไซต์เดิม และระบบจอง",
    inputEn: "Guests, rooms, strengths, the current website, and the booking system",
    actionTh: "ดูกลุ่มลูกค้า ห้องพัก จุดเด่น เว็บไซต์เดิม และระบบจอง",
    actionEn: "Review guests, rooms, strengths, the current website, and the booking system",
    output: "Discovery Brief",
    approvalTh: "โรงแรมยืนยันข้อมูลโรงแรม ห้องพัก และระบบที่มีอยู่",
    approvalEn: "The hotel confirms hotel facts, rooms, and current systems",
    nextTh: "ไปวางโครงสร้างหน้าและเส้นทางจอง",
    nextEn: "Plan the sitemap and the path to contact or book",
  },
  {
    id: "structure",
    num: "02",
    label: "Structure",
    titleTh: "วางโครงสร้าง",
    titleEn: "Plan the structure",
    ownerTh: "เดอะ เคพีไอ พลัส ร่างโครงสร้าง",
    ownerEn: "The KPI Plus drafts the structure",
    inputTh: "Discovery Brief",
    inputEn: "Discovery Brief",
    actionTh: "กำหนดหน้าที่จำเป็น ข้อมูลที่ลูกค้าต้องเห็น และเส้นทางติดต่อหรือจอง",
    actionEn: "Name the pages that are needed, the facts guests must see, and the path to contact or book",
    output: "Sitemap and Content Map",
    approvalTh: "โรงแรมอนุมัติหน้าที่จำเป็นและลำดับข้อมูล",
    approvalEn: "The hotel approves the required pages and the order of facts",
    nextTh: "ไปเลือก CMS เครื่องมือ และการเชื่อมต่อ",
    nextEn: "Choose the CMS, tools, and connections",
  },
  {
    id: "select",
    num: "03",
    label: "Select",
    titleTh: "เลือกวิธีพัฒนา",
    titleEn: "Choose how to build it",
    ownerTh: "เดอะ เคพีไอ พลัส เสนอ โรงแรมเป็นผู้ตัดสิน",
    ownerEn: "The KPI Plus recommends; the hotel decides",
    inputTh: "Sitemap and Content Map, คนที่จะดูแลเนื้อหา และระบบที่ต้องเชื่อม",
    inputEn: "Sitemap and Content Map, who will look after content, and the systems that must connect",
    actionTh: "พิจารณา CMS เครื่องมือ และการเชื่อมต่อให้เหมาะกับทีมและระบบที่โรงแรมมี",
    actionEn: "Review the CMS, tools, and connections that fit the hotel team and the systems already in place",
    output: "Technology Decision",
    approvalTh: "โรงแรมอนุมัติความเข้ากันได้ของ CMS และเทคโนโลยี",
    approvalEn: "The hotel approves CMS and technology fit",
    nextTh: "ไปออกแบบและพัฒนา",
    nextEn: "Design and develop",
  },
  {
    id: "build",
    num: "04",
    label: "Build",
    titleTh: "ออกแบบและพัฒนา",
    titleEn: "Design and develop",
    ownerTh: "เดอะ เคพีไอ พลัส พัฒนา",
    ownerEn: "The KPI Plus designs and builds",
    inputTh: "Technology Decision, ภาพ ข้อความ ราคา และเงื่อนไขที่โรงแรมยืนยัน",
    inputEn: "Technology Decision, plus photos, copy, rates, and conditions the hotel confirms",
    actionTh: "ทำงานร่วมกับโรงแรมเพื่อยืนยันภาพ ข้อความ ราคา และเงื่อนไข",
    actionEn: "Work with the hotel to confirm photos, copy, rates, and conditions",
    output: "Responsive Website and Integration",
    approvalTh: "โรงแรมอนุมัติภาพ ข้อความ ราคา และเงื่อนไข",
    approvalEn: "The hotel approves photos, copy, rates, and conditions",
    nextTh: "ไปตรวจและส่งมอบ",
    nextEn: "Check and hand over",
  },
  {
    id: "handover",
    num: "05",
    label: "Handover",
    titleTh: "ตรวจและส่งมอบ",
    titleEn: "Check and hand over",
    ownerTh: "เดอะ เคพีไอ พลัส ส่งมอบ โรงแรมรับกรรมสิทธิ์",
    ownerEn: "The KPI Plus hands over; the hotel receives ownership",
    inputTh: "Responsive Website and Integration",
    inputEn: "Responsive Website and Integration",
    actionTh: "ทดสอบมือถือ ลิงก์ ระบบจอง แบบฟอร์ม และการวัดผล พร้อมเตรียมวิธีดูแลเนื้อหาหลังเปิดใช้",
    actionEn: "Test phones, links, the booking system, forms, and measurement, and prepare how content will be looked after after launch",
    output: "QA Report, CMS Guide, and Access Handover",
    approvalTh: "โรงแรมรับสิทธิ์ CMS โดเมน โฮสต์ Analytics และบัญชีระบบจอง",
    approvalEn: "The hotel accepts CMS, domain, hosting, analytics, and booking-engine account access",
    nextTh: "ทีมโรงแรมดูแลเว็บต่อหลังเปิดใช้",
    nextEn: "The hotel team looks after the site after launch",
  },
] as const;

export const WEBSITE_WORKFLOW_HANDOVER = [
  { id: "mobile", th: "ทดสอบบนมือถือ", en: "Mobile testing" },
  { id: "links", th: "ทดสอบลิงก์", en: "Link testing" },
  { id: "booking", th: "ทดสอบ Booking Engine", en: "Booking Engine testing" },
  { id: "forms", th: "ทดสอบแบบฟอร์ม", en: "Form testing" },
  { id: "tracking", th: "ทดสอบการวัดผลและอีเวนต์", en: "Tracking/event testing" },
  { id: "cms-roles", th: "ทดสอบสิทธิ์ CMS", en: "CMS role testing" },
  { id: "guide", th: "คู่มือการแก้เนื้อหา", en: "Content editing guide" },
  { id: "repo", th: "กรรมสิทธิ์ซอร์สโค้ดและการส่งขึ้นระบบ", en: "Source repository and deployment ownership" },
  { id: "domain", th: "กรรมสิทธิ์โดเมนและโฮสติ้ง", en: "Domain/hosting ownership" },
  { id: "analytics", th: "กรรมสิทธิ์ Analytics และ Search Console", en: "Analytics/Search Console access ownership" },
] as const;

export const WEBSITE_WORKFLOW_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 640,
  displayHeight: 360,
  labelTh: "Hotel Website Project Workflow — Sample",
  labelEn: "Hotel Website Project Workflow — Sample",
  captionTh: "ไทม์ไลน์ตัวอย่าง Discover ถึง Handover ไม่ใช่ตารางงานลูกค้า",
  captionEn: "Sample Discover-to-Handover timeline. Not a client project schedule.",
  altTh: "แผนภาพตัวอย่าง Hotel Website Project Workflow แสดง Discover, Structure, Select, Build และ Handover พร้อมผลลัพธ์แต่ละขั้น",
  altEn: "Sample Hotel Website Project Workflow timeline showing Discover, Structure, Select, Build, and Handover with each step output",
  status: "sample" as WebsiteVisualStatus,
  metaTh: "Sample workflow · 1600 × 900 px · Display 640 × 360 px · 16:9",
  metaEn: "Sample workflow · 1600 × 900 px · Display 640 × 360 px · 16:9",
};

export const WEBSITE_KPI_VISUAL_CANDIDATE = "/images/hotel-website-performance-metrics-placeholder.webp";

export const WEBSITE_KPI_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  labelTh: "Hotel Website Performance Metrics · Sample data",
  labelEn: "Hotel Website Performance Metrics · Sample data",
  captionTh: "กรอบวัดผลตัวอย่าง Engagement, Mobile, Contact Intent และ Booking Outcome ไม่ใช่ยอดโรงแรมจริง",
  captionEn: "Sample measurement frame for Engagement, Mobile, Contact Intent, and Booking Outcome. Not a live hotel result.",
  altTh: "แผนภาพตัวอย่าง Hotel Website Performance Metrics แสดงสี่กลุ่มตัวชี้วัด และระบุว่า Booking Outcome ยังไม่แสดงจนกว่าจะเชื่อมระบบจอง",
  altEn: "Sample Hotel Website Performance Metrics diagram showing four metric groups, with Booking Outcome marked tracking not configured",
  status: "sample" as WebsiteVisualStatus,
  metaTh: "Sample data · 1600 × 900 px · Display 720 × 405 px · 16:9",
  metaEn: "Sample data · 1600 × 900 px · Display 720 × 405 px · 16:9",
};

export const WEBSITE_RELATED_VISUAL_CANDIDATE = "/images/hotel-website-related-content-placeholder.webp";

export const WEBSITE_RELATED_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 520,
  displayHeight: 347,
  labelTh: "Hotel Website / Direct Booking Content",
  labelEn: "Hotel Website / Direct Booking Content",
  captionTh: "กรอบเนื้อหาที่เกี่ยวข้อง ไม่ใช่รูป Hero หรือ Booking Confidence และไม่ใช่ผลจองโรงแรม",
  captionEn: "Related content frame. Not the hero or booking-confidence visual, and not a hotel booking result.",
  altTh: "แผนที่เนื้อหาตัวอย่าง Hotel Website / Direct Booking แสดง Website Health Check, Direct Booking Path Review, Mobile UX Audit, Room Detail Page Review และ Booking Engine Connection",
  altEn: "Sample Hotel Website / Direct Booking content map showing Website Health Check, Direct Booking Path Review, Mobile UX Audit, Room Detail Page Review, and Booking Engine Connection",
  status: "sample" as WebsiteVisualStatus,
  metaTh: "Sample visual · 1200 × 800 px · Display 520 × 347 px · 3:2",
  metaEn: "Sample visual · 1200 × 800 px · Display 520 × 347 px · 3:2",
};

export const WEBSITE_RELATED_VISUAL_OPTIONS = [
  { id: "health", label: "Website Health Check" },
  { id: "direct-path", label: "Direct Booking Path Review" },
  { id: "mobile-ux", label: "Mobile UX Audit" },
  { id: "room-detail", label: "Room Detail Page Review" },
  { id: "booking-engine", label: "Booking Engine Connection" },
] as const;

export type WebsiteRelatedCard = {
  id: string;
  href: string;
  featured?: boolean;
  categoryTh: string;
  categoryEn: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  publishedAt?: string;
  updatedAt?: string;
  accessedAt?: string;
  dateKind?: "published" | "updated" | "accessed";
  contentTypeTh: string;
  contentTypeEn: string;
  readingTimeMinutes?: number;
  ctaTh: string;
  ctaEn: string;
};

function relatedHref(href: string, locale: Locale) {
  const found = existingHref(href, locale);
  if (!found) return null;
  if (!href.startsWith("/tools/")) return found;
  return found;
}

export function websiteRelatedDateLabel(card: WebsiteRelatedCard, locale: Locale) {
  const iso =
    card.dateKind === "accessed"
      ? card.accessedAt
      : card.dateKind === "updated"
        ? card.updatedAt || card.publishedAt
        : card.publishedAt;
  if (!iso) return "";
  const prefix =
    card.dateKind === "accessed"
      ? locale === "th"
        ? "เข้าถึง"
        : "Accessed"
      : card.dateKind === "updated"
        ? locale === "th"
          ? "อัปเดต"
          : "Updated"
        : locale === "th"
          ? "เผยแพร่"
          : "Published";
  return `${prefix} ${formatInsightDate(iso, locale)}`;
}

export function websiteRelatedTypeLabel(card: WebsiteRelatedCard, locale: Locale) {
  const type = locale === "th" ? card.contentTypeTh : card.contentTypeEn;
  if (!card.readingTimeMinutes) return type;
  const minutes = locale === "th" ? "นาที" : "min read";
  return `${type} · ${card.readingTimeMinutes} ${minutes}`;
}

export function websiteRelatedCards(locale: Locale): WebsiteRelatedCard[] {
  const pageUpdated = "2026-10-28";
  const insight = insightPosts.find((post) => post.id === "direct-booking-journey-audit" && post.isPublished !== false);
  const insightHref = insight ? relatedHref(insight.href, locale) : null;
  const toolHref = relatedHref("/tools/hotel-searchability-check", locale);
  const directHref = relatedHref("/solutions/hotel-direct-bookings", locale);
  const systemsHref = relatedHref("/solutions/hotel-systems-implementation", locale);
  const used = new Set<string>();
  const cards: WebsiteRelatedCard[] = [];

  const push = (card: WebsiteRelatedCard | null) => {
    if (!card || used.has(card.href)) return;
    used.add(card.href);
    cards.push(card);
  };

  if (toolHref) {
    push({
      id: "search-health",
      href: "/tools/hotel-searchability-check",
      featured: true,
      categoryTh: "Website Search Health",
      categoryEn: "Website Search Health",
      titleTh: "ตรวจสุขภาพการค้นหาเว็บไซต์",
      titleEn: "Hotel searchability check",
      descriptionTh: "ดูว่าหน้าเว็บพร้อมให้ลูกค้าหาข้อมูลห้องพัก ทำเล และเดินทางไปจองต่อหรือไม่ ไม่ใช่ผลอันดับหรือยอดจอง",
      descriptionEn: "See whether the pages are ready for a guest to find room and location facts and continue toward a booking. Not a ranking or booking result.",
      updatedAt: pageUpdated,
      dateKind: "updated",
      contentTypeTh: "เครื่องมือ",
      contentTypeEn: "Tool",
      ctaTh: "ใช้เครื่องมือฟรี",
      ctaEn: "Use the free tool",
    });
  }

  if (insightHref && insight) {
    push({
      id: "direct-path",
      href: insight.href,
      categoryTh: "Direct Booking",
      categoryEn: "Direct Booking",
      titleTh: insight.title.th,
      titleEn: insight.title.en,
      descriptionTh: insightExcerpt(insight, "th"),
      descriptionEn: insightExcerpt(insight, "en"),
      publishedAt: insight.publishedAt,
      updatedAt: insightUpdatedAt(insight) || undefined,
      dateKind: insightUpdatedAt(insight) ? "updated" : "published",
      contentTypeTh: "บทความ",
      contentTypeEn: "Article",
      readingTimeMinutes: insight.readingTimeMinutes,
      ctaTh: "อ่านบทความ",
      ctaEn: "Read article",
    });
  } else if (directHref) {
    push({
      id: "direct-path",
      href: "/solutions/hotel-direct-bookings",
      categoryTh: "Direct Booking",
      categoryEn: "Direct Booking",
      titleTh: "เส้นทางจองตรงจากหน้าเว็บ",
      titleEn: "Direct Booking Path Review",
      descriptionTh: "ดูว่าลูกค้าเดินจากหน้าเข้าชม หน้าห้องพัก และมือถือถึง Booking Engine ได้ชัดหรือไม่ การคลิกจองยังไม่ใช่การจองสำเร็จ",
      descriptionEn: "See whether guests can continue from the website, room pages, and phone layout to the booking engine. A Book click is not a completed booking.",
      updatedAt: pageUpdated,
      dateKind: "updated",
      contentTypeTh: "โซลูชัน",
      contentTypeEn: "Solution",
      ctaTh: "ดูโซลูชัน",
      ctaEn: "View solution",
    });
  }

  if (directHref) {
    push({
      id: "booking-engine",
      href: "/solutions/hotel-direct-bookings",
      categoryTh: "Conversion Tracking",
      categoryEn: "Conversion Tracking",
      titleTh: "Booking Engine Connection",
      titleEn: "Booking Engine Connection",
      descriptionTh: "ดู Mobile UX, หน้าห้องพัก และการเชื่อม Booking Engine รวมถึงการวัดผลเมื่อระบบส่งอีเวนต์ได้",
      descriptionEn: "Review Mobile UX, room detail pages, and the Booking Engine connection, including tracking when the engine can send events.",
      updatedAt: pageUpdated,
      dateKind: "updated",
      contentTypeTh: "โซลูชัน",
      contentTypeEn: "Solution",
      ctaTh: "ดูโซลูชัน",
      ctaEn: "View solution",
    });
  }

  if (systemsHref) {
    push({
      id: "cms-ownership",
      href: "/solutions/hotel-systems-implementation",
      categoryTh: "CMS and Website Ownership",
      categoryEn: "CMS and Website Ownership",
      titleTh: "CMS และการดูแลเว็บต่อ",
      titleEn: "CMS and website ownership",
      descriptionTh: "ดูว่าทีมโรงแรมรับสิทธิ์ CMS โดเมน และการเชื่อมระบบจองได้หลังส่งมอบ ไม่ใช่ผลติดตั้งสำเร็จ",
      descriptionEn: "See how the hotel team receives CMS, domain, and booking-system access after handover. Not an implementation result.",
      updatedAt: pageUpdated,
      dateKind: "updated",
      contentTypeTh: "โซลูชัน",
      contentTypeEn: "Solution",
      ctaTh: "ดูโซลูชัน",
      ctaEn: "View solution",
    });
  }

  return cards;
}

export const WEBSITE_ENQUIRY_RECEIVE = [
  {
    id: "website-mobile-content",
    title: "Website, Mobile, and Content Review",
    th: "ตรวจหน้าเว็บ มือถือ และเนื้อหาที่ลูกค้าใช้ตัดสินใจ ไม่ใช่คะแนนเว็บไซต์หรือยอดจอง",
    en: "Review the website, phone layout, and the content guests use to decide. Not a website score or booking count",
  },
  {
    id: "booking-path",
    title: "Booking Path Review",
    th: "ดูเส้นทางจากหน้าห้องพักไปยัง Booking Engine หรือการติดต่อ การคลิกจองยังไม่ใช่การจองสำเร็จ",
    en: "Review the path from room pages to the booking engine or contact. A Book click is not a completed booking",
  },
  {
    id: "improve-or-build",
    title: "Improve Existing vs Build New Recommendation",
    th: "สรุปว่าควรปรับเว็บเดิมหรือสร้างใหม่จากหลักฐานของระบบที่มี การสร้างใหม่ไม่ดีกว่าเสมอ",
    en: "Recommend whether to improve the current site or build a new one from the current system. A rebuild is not always better",
  },
  {
    id: "cms-fit",
    title: "CMS and Technology Fit",
    th: "ดู CMS เครื่องมือ และการดูแลต่อโดยทีมโรงแรม ไม่ใช่ผลติดตั้งสำเร็จ",
    en: "Review CMS, tools, and how the hotel team will own the site after handover. Not an implementation result",
  },
  {
    id: "tracking-plan",
    title: "Tracking and Measurement Plan",
    th: "วางแผนการวัดผลเมื่อได้รับอนุญาตให้ใช้ข้อมูล Booking Outcome แสดงได้เมื่อเชื่อมระบบจอง",
    en: "Plan tracking when the hotel approves data use. Booking Outcome is shown only when the booking engine is connected",
  },
  {
    id: "scope-next",
    title: "Scope and Next Action",
    th: "สรุปขอบเขตงานและก้าวถัดไปให้โรงแรมอนุมัติได้ โดยยังไม่เริ่มสร้างก่อนตกลง",
    en: "Summarise the scope and next action for hotel approval. Build work does not start before that agreement",
  },
] as const;

export const WEBSITE_ENQUIRY = {
  kicker: "Website Design",
  receiveTitle: {
    th: "โรงแรมจะได้อะไรจากการเริ่มทบทวนเว็บไซต์",
    en: "What the hotel receives from starting a website review",
  },
  nextTitle: {
    th: "What Happens Next",
    en: "What Happens Next",
  },
  steps: {
    th: [
      "คุยเป้าหมายและปัญหาของเว็บไซต์",
      "ตรวจ Website, Mobile, Content และ Booking Path",
      "ประเมิน Improve Existing หรือ Build New",
      "สรุป Scope, Technology Fit และ Next Action",
    ],
    en: [
      "Talk through the website goal and current problems",
      "Review Website, Mobile, Content, and Booking Path",
      "Assess Improve Existing or Build New",
      "Summarise Scope, Technology Fit, and Next Action",
    ],
  },
  heading: {
    th: "คุยเรื่องเว็บไซต์โรงแรม",
    en: "Talk about hotel website design",
  },
  lead: {
    th: "ส่งชื่อโรงแรม ลิงก์เว็บไซต์ และสิ่งที่อยากให้ดู เพื่อให้ทีมตรวจเว็บไซต์ มือถือ เส้นทางจอง และความเหมาะสมของ CMS",
    en: "Send the hotel name, website link, and what you want reviewed, so the team can look at the website, mobile use, booking path, and CMS fit.",
  },
  note: {
    th: "ไม่จำเป็นต้องตัดสินใจก่อนว่าจะสร้างเว็บไซต์ใหม่หรือปรับเว็บไซต์เดิม",
    en: "You do not need to decide first whether to rebuild or improve the current website.",
  },
  submit: {
    th: "ให้ทีมดูเว็บไซต์โรงแรมของคุณ",
    en: "Ask the team to review the hotel website",
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
      name: "Contact name",
      business: "Hotel / company name",
      contact: "Email / phone",
      consent: "I agree that The KPI Plus may use this information to reply about this request, under the",
      privacy: "privacy policy",
    },
  },
  fields: {
    th: {
      website: "ลิงก์เว็บไซต์",
      websiteHint: "ลิงก์หน้าเว็บโรงแรม ถ้ามี",
      websiteInvalid: "กรุณาใส่ลิงก์ให้ถูกต้อง",
      bookingEngine: "ลิงก์ Booking Engine",
      bookingEngineHint: "ลิงก์หน้าจอง ถ้ามี",
      bookingEngineInvalid: "กรุณาใส่ลิงก์ให้ถูกต้อง",
      cms: "CMS ที่ใช้อยู่",
      cmsHint: "ชื่อระบบจัดการเนื้อหา ถ้าทราบ",
      goal: "เป้าหมาย",
      goalEmpty: "เลือกเป้าหมาย ถ้ามี",
      goalDirect: "Direct Booking",
      goalRefresh: "Website Refresh",
      goalMobile: "Mobile UX",
      goalCms: "CMS",
      challenge: "ปัญหาปัจจุบัน",
      challengeHint: "บอกสั้น ๆ ว่าเว็บไซต์ติดตรงไหน",
      timeline: "ช่วงเวลาที่สะดวก",
      timelineHint: "ช่วงที่อยากให้ทีมเริ่มดู ถ้ามี",
      loading: "กำลังส่งข้อมูล กรุณารอสักครู่",
    },
    en: {
      website: "Website URL",
      websiteHint: "The hotel website link, if you have one",
      websiteInvalid: "Enter a valid link",
      bookingEngine: "Booking Engine URL",
      bookingEngineHint: "The booking page link, if you have one",
      bookingEngineInvalid: "Enter a valid link",
      cms: "Existing CMS",
      cmsHint: "The content system name, if you know it",
      goal: "Goal",
      goalEmpty: "Choose a goal, if you have one",
      goalDirect: "Direct Booking",
      goalRefresh: "Website Refresh",
      goalMobile: "Mobile UX",
      goalCms: "CMS",
      challenge: "Current challenge",
      challengeHint: "A short note on where the website gets stuck",
      timeline: "Preferred timeline",
      timelineHint: "When you would like the review to start, if known",
      loading: "Sending your message. Please wait.",
    },
  },
} as const;

export function websiteEnquiryCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: WEBSITE_ENQUIRY.kicker,
    heading: thai ? WEBSITE_ENQUIRY.heading.th : WEBSITE_ENQUIRY.heading.en,
    lead: thai ? WEBSITE_ENQUIRY.lead.th : WEBSITE_ENQUIRY.lead.en,
    note: thai ? WEBSITE_ENQUIRY.note.th : WEBSITE_ENQUIRY.note.en,
    submit: thai ? WEBSITE_ENQUIRY.submit.th : WEBSITE_ENQUIRY.submit.en,
    receiveTitle: thai ? WEBSITE_ENQUIRY.receiveTitle.th : WEBSITE_ENQUIRY.receiveTitle.en,
    nextTitle: thai ? WEBSITE_ENQUIRY.nextTitle.th : WEBSITE_ENQUIRY.nextTitle.en,
    receive: WEBSITE_ENQUIRY_RECEIVE.map((item) => ({
      id: item.id,
      title: item.title,
      body: thai ? item.th : item.en,
    })),
    steps: thai ? [...WEBSITE_ENQUIRY.steps.th] : [...WEBSITE_ENQUIRY.steps.en],
    fields: thai ? WEBSITE_ENQUIRY.fields.th : WEBSITE_ENQUIRY.fields.en,
    labels: thai ? WEBSITE_ENQUIRY.labels.th : WEBSITE_ENQUIRY.labels.en,
  };
}

export function websiteSampleLabel(locale: Locale) {
  return locale === "th" ? "ตัวอย่างเว็บไซต์" : "Sample Website";
}

export function websiteShowsSampleBadge(status?: string) {
  return status === "placeholder" || status === "replace" || status === "sample" || !status;
}

export function websiteVisualStatusLabel(status?: string) {
  if (status === "approved" || status === "real") return "Approved";
  if (status === "sample") return "Sample";
  return "Replace";
}

export function websiteKpiStatusLabel(status: WebsiteKpiStatus, locale: Locale) {
  if (locale === "th") {
    if (status === "approved") return "อนุมัติแล้ว";
    if (status === "anonymised") return "ไม่ระบุชื่อโรงแรม";
    if (status === "sample") return "ตัวอย่างข้อมูล";
    return "ยังไม่เผยแพร่";
  }
  return websiteKpiPublicStatus(status);
}

export const HOTEL_WEBSITE_FAQS = {
  th: [
    {
      q: "ต้องใช้ WordPress เท่านั้นหรือไม่",
      a: "ไม่จำเป็น ทีมเลือก CMS และวิธีพัฒนาจากความต้องการของโรงแรม ระบบจองที่ต้องเชื่อม และคนที่จะดูแลเว็บไซต์ต่อ WordPress เป็นหนึ่งในตัวเลือก ไม่ใช่ข้อบังคับ",
    },
    {
      q: "ทีมโรงแรมแก้ไขเนื้อหาเองได้หรือไม่",
      a: "ได้ หากโรงแรมต้องการอัปเดตภาพ ข้อความ หรือโปรโมชั่นเอง เรื่องนี้จะถูกใช้ตอนเลือก CMS และออกแบบส่วนที่ทีมต้องแก้บ่อย โรงแรมเป็นผู้กำหนดสิทธิ์ผู้ใช้",
    },
    {
      q: "เชื่อม Booking Engine เดิมได้หรือไม่",
      a: "เชื่อมได้เมื่อระบบจองเดิมเปิดให้ต่อกับเว็บไซต์ ทีมจะตรวจเส้นทางจากหน้าห้องพักไปยังหน้าจองระหว่างงาน การคลิกจองยังไม่ใช่การจองสำเร็จ และไม่ได้รับรองว่าเครื่องจองทุกตัวเชื่อมได้เหมือนกัน",
    },
    {
      q: "เว็บไซต์รองรับหลายภาษาได้หรือไม่",
      a: "รองรับได้เมื่อโรงแรมมีเนื้อหาภาษานั้นอยู่แล้ว ภาษาไทยเป็นค่าเริ่มต้นของไซต์นี้ ทีมไม่แต่งคำแปลที่ยังไม่มี และลิงก์ในเมนูจะแสดงเฉพาะภาษาที่มีหน้าจริง",
    },
    {
      q: "รองรับ SEO และ Tracking หรือไม่",
      a: "เว็บไซต์วางโครงสร้าง ชื่อหน้า และเหตุการณ์วัดผลให้พร้อมใช้ได้ Tracking ใช้ได้เมื่อโรงแรมอนุญาตและระบบส่งอีเวนต์ได้ หน้านี้ไม่สัญญายอดค้นหา อันดับ หรืออัตราแปลง",
    },
    {
      q: "ควรปรับเว็บไซต์เดิมหรือสร้างใหม่",
      a: "ไม่จำเป็นต้องสร้างใหม่ทุกครั้ง หาก CMS เดิมแก้ได้ ใช้บนมือถือได้ และเชื่อมระบบจองได้ อาจเริ่มจากการปรับโครงสร้าง หน้าห้องพัก หรือเส้นทางจอง ทีมสรุปจากหลักฐานของระบบที่มี การสร้างใหม่ไม่ดีกว่าเสมอ",
    },
    {
      q: "ใช้เวลาทำเว็บไซต์เท่าไร",
      a: "ขึ้นกับขอบเขต เนื้อหา การเชื่อมระบบจอง และการอนุมัติของโรงแรม หน้านี้ไม่กำหนดจำนวนวันหรือสัปดาห์ที่จะแล้วเสร็จ ระยะเวลาจะสรุปหลังตรวจเว็บเดิมและตกลงขอบเขต",
    },
    {
      q: "หลังส่งมอบมีคู่มือหรือ Support หรือไม่",
      a: "การส่งมอบมีรายการตรวจและแนวทางแก้เนื้อหา รวมถึงสิทธิ์ CMS โดเมน และระบบที่เกี่ยวข้อง การดูแลต่อหลังส่งมอบเป็นขอบเขตที่โรงแรมตกลง ไม่ได้รวมการซัพพอร์ตไม่จำกัดโดยอัตโนมัติ",
    },
    {
      q: "ใครเป็นเจ้าของ Source Code และ Account ต่าง ๆ",
      a: "โรงแรมควรเป็นเจ้าของโดเมน โฮสติ้ง CMS ซอร์สโค้ด Analytics และบัญชีระบบจองหลังส่งมอบ เดอะ เคพีไอ พลัส อาจช่วยตั้งค่า แต่โรงแรมเป็นผู้อนุมัติสิทธิ์เข้าถึง",
    },
    {
      q: "เว็บไซต์รองรับ Mobile และ Accessibility อย่างไร",
      a: "งานออกแบบดูการอ่าน การนำทาง และเส้นทางจองบนมือถือเป็นหลัก Accessibility ในที่นี้หมายถึงข้อความอ่านได้ ปุ่มโฟกัสเห็นชัด และควบคุมด้วยคีย์บอร์ดได้ หน้านี้ไม่รับรองระดับ WCAG โดยไม่มีการตรวจและอนุมัติ",
    },
    {
      q: "Booking Outcome วัดผลอย่างไร",
      a: "Booking Outcome แสดงได้เมื่อ Booking Engine และ Tracking Event เชื่อมต่อ และโรงแรมอนุญาตให้ใช้ข้อมูล การคลิกจองยังไม่ใช่การจองสำเร็จ หน้านี้ไม่แสดงยอดจองหรืออัตราแปลงจนกว่าจะมีข้อมูลที่อนุมัติแล้ว",
    },
  ],
  en: [
    {
      q: "Do we have to use WordPress only?",
      a: "No. The CMS and build method come from the hotel’s needs, the booking system that must connect, and who will look after the site. WordPress is one option, not a requirement.",
    },
    {
      q: "Can the hotel team edit the content themselves?",
      a: "Yes, if the hotel wants to update photos, copy, or offers. That need shapes the CMS choice and the parts the team will edit often. The hotel decides who has access.",
    },
    {
      q: "Can the current Booking Engine stay connected?",
      a: "It can when the current engine allows a website connection. The team reviews the path from room pages to the booking page during the work. A Book click is not a completed booking, and not every engine connects in the same way.",
    },
    {
      q: "Can the website support more than one language?",
      a: "Yes, when the hotel already has that language. Thai is the default locale on this site. Missing translations are not invented, and menu links appear only for pages that exist in that language.",
    },
    {
      q: "Does it support SEO and tracking?",
      a: "The site can be structured for search and measurement. Tracking is used when the hotel approves it and the systems can send events. This page does not promise search volume, rank, or a conversion rate.",
    },
    {
      q: "Should we improve the current website or build a new one?",
      a: "A rebuild is not always needed. If the current CMS can be edited, works on a phone, and can connect to the booking system, the team may first change structure, room pages, or the booking path. The choice comes from the current system. A new website is not always better.",
    },
    {
      q: "How long does a website project take?",
      a: "It depends on scope, content, the booking connection, and hotel approval. This page does not set a number of days or weeks. Timing is summarised after the current site is reviewed and the scope is agreed.",
    },
    {
      q: "After handover, is there a guide or support?",
      a: "Handover includes a checklist and a content-editing guide, plus access to the CMS, domain, and related systems. Ongoing support after handover is a scope the hotel agrees. Unlimited support is not included by default.",
    },
    {
      q: "Who owns the source code and the accounts?",
      a: "The hotel should own the domain, hosting, CMS, source code, analytics, and booking-engine accounts after handover. The KPI Plus may help set these up. The hotel approves access.",
    },
    {
      q: "How does the website support mobile use and accessibility?",
      a: "The work reviews reading, navigation, and the booking path on a phone. Accessibility here means readable text, a visible focus state, and keyboard-usable controls. This page does not claim a WCAG level without a review and hotel approval.",
    },
    {
      q: "How is Booking Outcome measured?",
      a: "Booking Outcome is shown only when the Booking Engine and tracking events are connected and the hotel approves the data. A Book click is not a completed booking. This page does not show booking counts or conversion rates until approved data exists.",
    },
  ],
} as const;

export function hotelWebsiteFaqs(locale: Locale): { q: string; a: string }[] {
  const rows = locale === "th" ? HOTEL_WEBSITE_FAQS.th : HOTEL_WEBSITE_FAQS.en;
  return rows.map((item) => ({ q: item.q, a: item.a }));
}

export function hotelWebsiteFrameworkIsStale(steps?: Array<{ stage?: string; output?: string }>) {
  if (!steps?.length) return false;
  const joined = steps.map((step) => `${step.stage || ""} ${step.output || ""}`).join(" ");
  return /Hotel Positioning|Information Architecture|UX\/Mobile Design|Booking Engine\/Tracking|CMS Handover|Customer Journey Map/.test(
    joined,
  );
}

export function hotelWebsiteFaqsAreStale(faqs: { q: string }[]) {
  if (!faqs.length) return true;
  const questions = faqs.map((item) => item.q.trim());
  const legacy = questions.some(
    (question) =>
      question === "ต้องใช้ WordPress เท่านั้นไหม?" ||
      question === "Do we have to use WordPress?" ||
      question === "ต้องเตรียมภาพใหม่ทั้งหมดหรือไม่?" ||
      question === "Will a new website bring direct bookings immediately?",
  );
  return legacy || questions.length < HOTEL_WEBSITE_FAQS.th.length;
}

export const WEBSITE_HANDOVER_FIELDS = [
  "cmsOwner",
  "sourceCodeOwner",
  "domainOwner",
  "hostingOwner",
  "analyticsOwner",
  "bookingEngineOwner",
] as const;

export type WebsiteHandoverField = (typeof WEBSITE_HANDOVER_FIELDS)[number];

export const WEBSITE_HANDOVER_LABEL: Record<WebsiteHandoverField, { th: string; en: string }> = {
  cmsOwner: { th: "เจ้าของ CMS", en: "CMS owner" },
  sourceCodeOwner: { th: "เจ้าของซอร์สโค้ด", en: "Source-code owner" },
  domainOwner: { th: "เจ้าของโดเมน", en: "Domain owner" },
  hostingOwner: { th: "เจ้าของโฮสติ้ง", en: "Hosting owner" },
  analyticsOwner: { th: "เจ้าของ Analytics", en: "Analytics owner" },
  bookingEngineOwner: { th: "เจ้าของบัญชีระบบจอง", en: "Booking-engine account owner" },
};
