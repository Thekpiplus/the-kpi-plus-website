import { formatInsightDate, insightExcerpt, insightPosts, insightUpdatedAt } from "@/lib/insights";
import { existingHref, type Locale } from "@/lib/seo";

export type DirectBookingKpiStatus = "draft" | "sample" | "approved" | "anonymised";
export type DirectBookingVisualStatus = "placeholder" | "replace" | "sample" | "approved" | "real";
export type DirectBookingSourceStatus = "guidance" | "sample" | "approved";
export type DirectBookingTrackingStatus = "supported" | "not-configured" | "pending-approval";

export const DIRECT_BOOKING_SOURCES = {
  googleIpsos: {
    name: "Google / Ipsos — Asia-Pacific traveller behaviour",
    url: "https://business.google.com/in/think/consumer-insights/insights-apac-traveler-behaviors/",
    publishedAt: "2023",
    accessedAt: "2026-10-28",
    market: "Asia-Pacific including Thailand",
    period: "Study window published by Google/Ipsos",
    definition: "Share of surveyed travellers who change a travel choice before they book.",
    definitionTh: "สัดส่วนผู้เดินทางที่สำรวจแล้วเปลี่ยนตัวเลือกด้านการเดินทางก่อนจอง",
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
    definitionTh: "ราคาและเงื่อนไขการยกเลิกร่วมกันมีผลต่อความตั้งใจจองอย่างไร",
    status: "guidance" as const,
  },
} as const;

export const DIRECT_BOOKING_KPI_COLORS = {
  positive: "#A2DC25",
  target: "#EBE722",
  warning: "#E3A008",
  navy: "#0B1F33",
  axis: "#3B3B3B",
  label: "#555555",
  grid: "#E3E8EB",
} as const;

export const DIRECT_BOOKING_FUNNEL = [
  { id: "visit", en: "Website Visit", th: "เข้าชมเว็บไซต์" },
  { id: "interest", en: "Room Interest", th: "สนใจห้องพัก" },
  { id: "start", en: "Booking Start", th: "เริ่มจอง" },
  { id: "complete", en: "Booking Complete", th: "จองสำเร็จ" },
] as const;

/** Hero journey only. Measurement still uses DIRECT_BOOKING_FUNNEL. */
export const DIRECT_BOOKING_HERO_JOURNEY = [
  { id: "discover", en: "Discover", th: "ค้นพบ" },
  { id: "understand", en: "Understand", th: "เข้าใจข้อเสนอ" },
  { id: "trust", en: "Trust", th: "มั่นใจก่อนจอง" },
  { id: "book", en: "Book Direct", th: "จองตรง" },
] as const;

export const DIRECT_BOOKING_HERO_CAPABILITIES = [
  { en: "Website Review", th: "ตรวจเว็บไซต์" },
  { en: "Mobile UX", th: "Mobile UX" },
  { en: "Booking Path", th: "เส้นทางจอง" },
  { en: "Measurement", th: "การวัดผล" },
] as const;

export const DIRECT_BOOKING_HERO_FLOW = [
  { en: "Website", th: "เว็บไซต์" },
  { en: "Room Detail", th: "รายละเอียดห้องพัก" },
  { en: "Price / Policy", th: "ราคาและนโยบาย" },
  { en: "Booking Engine", th: "ระบบจอง" },
] as const;

/** Labelled sample only. Omit src when the file is missing; do not invent a live hotel website. */
export const DIRECT_BOOKING_HERO_VISUAL_CANDIDATE = "/images/hotel-direct-booking-hero-placeholder.webp";

export const DIRECT_BOOKING_CONFIDENCE_PATH = [
  { en: "Room Details", th: "รายละเอียดห้องพัก" },
  { en: "Price / Offer", th: "ราคาและข้อเสนอ" },
  { en: "Cancellation and Booking Policy", th: "นโยบายยกเลิกและการจอง" },
  { en: "Availability / CTA", th: "ห้องว่างและปุ่มดำเนินการ" },
  { en: "Booking Engine", th: "ระบบจอง" },
  { en: "Confirmation", th: "ยืนยันการจอง" },
] as const;

/** Evidence checklist and booking path. Never reuse the Hero asset. */
export const DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE = "/images/hotel-direct-booking-confidence-placeholder.webp";

export const DIRECT_BOOKING_HERO_VISUAL = {
  recommendedSize: "1600 × 1000 px",
  ratio: "8 / 5",
  width: 1600,
  height: 1000,
  displayWidth: 560,
  displayHeight: 350,
  labelTh: "ตัวอย่าง Website → Room Detail → Booking Engine",
  labelEn: "Sample Website → Room Detail → Booking Engine",
  captionTh: "ตรวจให้เห็นว่าลูกค้าเข้าเว็บไซต์แล้วหยุดตรงไหน ก่อนปรับข้อมูล ปุ่ม และเส้นทางการจองให้ต่อเนื่องกัน",
  captionEn: "See where guests stop after they enter the website, then adjust the facts, buttons, and booking path so they continue.",
  altTh: "แผนภาพตัวอย่างเส้นทางจองตรง แสดงเดสก์ท็อปและมือถือของ Website ไป Room Detail ราคาและนโยบาย แล้วส่งต่อไป Booking Engine ป้าย Sample Website ไม่ใช่เว็บไซต์ลูกค้าจริง",
  altEn: "Sample direct-booking flow showing desktop and mobile of the same path from Website to Room Detail, Price/Policy, then Booking Engine — labelled Sample Website, not a live client site",
  status: "sample" as DirectBookingVisualStatus,
  metaTh: "Sample direct-booking flow · Replace with approved hotel project",
  metaEn: "Sample direct-booking flow · Replace with approved hotel project",
};

export const DIRECT_BOOKING_CONFIDENCE_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 480,
  displayHeight: 320,
  labelTh: "ตัวอย่าง Booking Confidence Flow",
  labelEn: "Sample Booking Confidence Flow",
  captionTh: "รายละเอียดห้องพัก ราคาและข้อเสนอ นโยบายยกเลิก ห้องว่างและปุ่มดำเนินการ ระบบจอง และการยืนยัน — ตัวอย่างข้อมูล ไม่ใช่ผลโรงแรม",
  captionEn: "Room Details, Price/Offer, cancellation policy, Availability/CTA, Booking Engine, and Confirmation — sample data, not a hotel result.",
  altTh: "แผนภาพตัวอย่าง Booking Confidence Flow แสดงหน้าห้องพัก ข้อเสนอ นโยบายยกเลิก ปุ่มจอง ระบบจองที่ยืนยันแล้ว และรายการตรวจ โดยปิดชื่อโรงแรมและราคา ไม่ใช่เว็บไซต์ลูกค้าจริง",
  altEn: "Sample Booking Confidence Flow showing a redacted room-and-offer page, price and cancellation review, booking checklist, and Booking Engine preview — not a live client site",
  status: "sample" as DirectBookingVisualStatus,
  metaTh: "Sample Booking Confidence Flow · Replace with approved hotel project",
  metaEn: "Sample Booking Confidence Flow · Replace with approved hotel project",
};

export const DIRECT_BOOKING_FRICTION_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  labelTh: "Direct Booking Friction Map — Sample",
  labelEn: "Direct Booking Friction Map — Sample",
  captionTh: "แผนที่จุดที่ลูกค้ามักหยุดก่อนจอง ตัวอย่างข้อมูล ไม่ใช่คะแนนโรงแรม",
  captionEn: "Sample map of where guests often stop before they book. Not a hotel score.",
  altTh: "แผนภาพตัวอย่าง Direct Booking Friction Map แสดง Ad/Search เว็บไซต์โรงแรม หน้าห้องพัก ปุ่มจอง Booking Engine และการจองสำเร็จ โดยไม่มีรูปไลฟ์สไตล์",
  altEn: "Sample Direct Booking Friction Map showing Ad/Search, Hotel Website, Room/Offer Page, Booking CTA, Booking Engine, and Booking Complete — not a lifestyle photo",
  status: "sample" as DirectBookingVisualStatus,
  metaTh: "Sample flow · Replace with approved hotel project",
  metaEn: "Sample flow · Replace with approved hotel project",
};

export const DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE = "/images/hotel-direct-booking-friction-map-placeholder.webp";

export type DirectBookingFrictionTone = "green" | "yellow" | "amber";
export type DirectBookingFrictionTracking = "clear" | "needs-review" | "not-configured";

export const DIRECT_BOOKING_FRICTION_STAGES = [
  {
    id: "ad-search",
    tone: "yellow" as DirectBookingFrictionTone,
    tracking: "needs-review" as DirectBookingFrictionTracking,
    stageTh: "โฆษณา / ค้นหา",
    stageEn: "Ad/Search",
    frictionTh: "ข้อความไม่ตรงกัน",
    frictionEn: "Message Match",
    questionTh: "หน้านี้ตรงกับสิ่งที่เพิ่งคลิกมาหรือไม่?",
    questionEn: "Does this page match what I just clicked?",
    riskTh: "สิ่งที่โฆษณา ค้นหา OTA หรือแคมเปญพูด ไม่ตรงกับหน้าที่ลูกค้าเปิด",
    riskEn: "The ad, search, OTA, or campaign promise does not match the page the customer opens.",
    inspectTh: "ข้อความโฆษณา ผลค้นหา และ URL แคมเปญ เทียบกับหน้า Landing",
    inspectEn: "Ad copy, search snippet, and campaign URL against the landing page",
    output: "Landing Message Checklist",
  },
  {
    id: "hotel-website",
    tone: "yellow" as DirectBookingFrictionTone,
    tracking: "needs-review",
    stageTh: "เว็บไซต์โรงแรม",
    stageEn: "Hotel Website",
    frictionTh: "ข้อมูลห้องพักไม่พอตัดสินใจ",
    frictionEn: "Room Info",
    questionTh: "หาห้องที่เหมาะกับเราจากเว็บไซต์นี้ได้หรือไม่?",
    questionEn: "Can I find a room that fits us from this website?",
    riskTh: "ภาพและคำอธิบายห้องไม่บอกความต่าง จำนวนผู้เข้าพัก สิ่งอำนวยความสะดวก หรือความเหมาะสมให้ชัด",
    riskEn: "Room images and descriptions do not clearly explain differences, occupancy, facilities, or suitability.",
    inspectTh: "หน้ารวมห้อง ภาพ ความต่างของห้อง จำนวนผู้เข้าพัก และสิ่งอำนวยความสะดวก",
    inspectEn: "Room listing, photos, room differences, occupancy, and facilities",
    output: "Room Detail Review",
  },
  {
    id: "room-offer",
    tone: "yellow" as DirectBookingFrictionTone,
    tracking: "needs-review",
    stageTh: "หน้าห้องพัก / ข้อเสนอ",
    stageEn: "Room/Offer Page",
    frictionTh: "ราคาและนโยบายไม่ชัด",
    frictionEn: "Price/Policy",
    questionTh: "ราคานี้รวมอะไร และยกเลิกได้ไหม?",
    questionEn: "What is included in this price, and can I cancel?",
    riskTh: "ราคา สิ่งที่รวม ภาษีและค่าธรรมเนียม โปรโมชั่น หรือนโยบายยกเลิกหาเจอยากหรือเทียบยาก",
    riskEn: "Price, inclusions, taxes/fees, promotion, or cancellation policy is difficult to find or compare.",
    inspectTh: "ราคา สิ่งที่รวม ภาษี ค่าธรรมเนียม โปรโมชั่น และนโยบายยกเลิกในหน้าข้อเสนอ",
    inspectEn: "Rate, inclusions, taxes, fees, promotion, and cancellation on the offer page",
    output: "Offer/Policy Block",
  },
  {
    id: "booking-cta",
    tone: "yellow" as DirectBookingFrictionTone,
    tracking: "needs-review",
    stageTh: "ปุ่มจอง",
    stageEn: "Booking CTA",
    frictionTh: "ใช้ยากบนมือถือ",
    frictionEn: "Mobile",
    questionTh: "กดจอง เลือกวัน และกรอกข้อมูลบนมือถือได้สะดวกหรือไม่?",
    questionEn: "Can I tap Book, pick dates, and continue on a phone?",
    riskTh: "ปุ่มจอง ฟอร์ม ตัวเลือกวันที่ หรือการใช้งานหน้า ใช้ยากบนมือถือ",
    riskEn: "The booking CTA, form, date selector, or page interaction is difficult on a phone.",
    inspectTh: "ปุ่มจอง ฟอร์ม และตัวเลือกวันที่ที่ความกว้างประมาณ 390px",
    inspectEn: "Book CTA, form, and date selector at about 390px",
    output: "Mobile Friction Map",
  },
  {
    id: "booking-engine",
    tone: "yellow" as DirectBookingFrictionTone,
    tracking: "needs-review",
    stageTh: "ระบบจอง",
    stageEn: "Booking Engine",
    frictionTh: "ส่งต่อไประบบจองไม่ต่อเนื่อง",
    frictionEn: "Handoff",
    questionTh: "ข้อมูลที่เลือกบนเว็บยังเป็นชุดเดิมในระบบจองหรือไม่?",
    questionEn: "Is this still the same stay I chose on the website?",
    riskTh: "ลูกค้าเข้าสู่ระบบใหม่ที่หน้าตา ข้อมูล ภาษา หรือข้อเสนอไม่ต่อเนื่องจากเว็บไซต์",
    riskEn: "The user moves to a new system where layout, information, language, or offer is inconsistent with the website.",
    inspectTh: "วันที่ ห้อง ราคา ภาษา และข้อเสนอหลังกดจอง",
    inspectEn: "Dates, room, rate, language, and offer after tapping Book",
    output: "Handoff Review",
  },
  {
    id: "booking-complete",
    tone: "amber" as DirectBookingFrictionTone,
    tracking: "not-configured" as DirectBookingFrictionTracking,
    stageTh: "จองสำเร็จ",
    stageEn: "Booking Complete",
    frictionTh: "วัดผลไม่ครบ",
    frictionEn: "Tracking",
    questionTh: "จองสำเร็จแล้วจริง หรือหยุดตรงไหน?",
    questionEn: "Did the booking actually finish, or where did I stop?",
    riskTh: "โรงแรมเห็นคลิกหรือการเริ่มจอง แต่ยืนยันไม่ได้ว่าลูกค้าออกตรงไหน หรือจองสำเร็จหรือไม่",
    riskEn: "The hotel sees clicks or booking starts but cannot verify where users leave or whether booking completed.",
    inspectTh: "แยก Visit, Room Interest, Booking Start และแหล่งยืนยัน Booking Complete",
    inspectEn: "Separate Visit, Room Interest, Booking Start, and a verifiable Booking Complete source",
    output: "Tracking Boundary",
  },
] as const;

export function directBookingFrictionStatusLabel(tracking: DirectBookingFrictionTracking, locale: Locale) {
  if (tracking === "clear") return locale === "th" ? "ชัดเจน" : "Clear";
  if (tracking === "not-configured") return locale === "th" ? "ยังไม่เชื่อมการวัดผล" : "Tracking not configured";
  return locale === "th" ? "ต้องตรวจ" : "Needs review";
}

export const DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE = "/images/hotel-direct-booking-service-framework-placeholder.webp";

export const DIRECT_BOOKING_FRAMEWORK_STAGES = [
  { id: "diagnose", en: "Diagnose", th: "Diagnose" },
  { id: "clarify", en: "Clarify", th: "Clarify" },
  { id: "guide", en: "Guide", th: "Guide" },
  { id: "connect", en: "Connect", th: "Connect" },
  { id: "measure", en: "Measure", th: "Measure" },
] as const;

export const DIRECT_BOOKING_FRAMEWORK_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  labelTh: "Direct Booking Conversion Framework — Sample",
  labelEn: "Direct Booking Conversion Framework — Sample",
  captionTh: "กรอบบริการการจองตรงตัวอย่าง ไม่ใช่แผนงานลูกค้า",
  captionEn: "Sample direct-booking conversion framework. Not a client project plan.",
  altTh: "แผนภาพตัวอย่าง Direct Booking Conversion Framework แสดง Diagnose, Clarify, Guide, Connect และ Measure โดยไม่มีรูปทีมงาน",
  altEn: "Sample Direct Booking Conversion Framework diagram showing Diagnose, Clarify, Guide, Connect, and Measure — not a team photo",
  status: "sample" as DirectBookingVisualStatus,
  metaTh: "Sample framework · 1600 × 900 px · Display 720 × 405 px · 16:9",
  metaEn: "Sample framework · 1600 × 900 px · Display 720 × 405 px · 16:9",
};

export const DIRECT_BOOKING_FRAMEWORK = [
  {
    id: "diagnose",
    num: "01",
    stage: "Diagnose",
    titleTh: "เริ่มจากข้อมูลและการใช้งานจริง",
    titleEn: "Start with real usage data",
    inputTh: "เว็บไซต์ Analytics หน้าสำคัญ และ Booking Engine",
    inputEn: "The website, analytics, key pages, and the booking engine",
    actionTh: "ดูหน้าที่คนเข้าชมมาก เส้นทางที่พาไปหน้าห้องพัก ปุ่มที่ถูกกด และจุดที่คนออกจากเว็บไซต์ พร้อมทดลองใช้งานจริงบนมือถือ ไม่ตัดสินจากรายงานตัวเลขเพียงอย่างเดียว",
    actionEn: "Look at the pages people visit most, the path to room pages, the buttons they tap, and where they leave, then try the path on a phone. We do not judge from a report alone.",
    output: "Friction Audit",
    approvalTh: "โรงแรมยืนยันหน้าที่ใช้จริงและระบบจองปัจจุบัน",
    approvalEn: "The hotel confirms live pages and the current booking engine",
    measureTh: "ดู Visit และเส้นทางไปหน้าห้องพักจาก Analytics ที่มีอยู่ การคลิกปุ่มจองยังไม่ใช่การจองสำเร็จ",
    measureEn: "Visit and the path to room pages can be reviewed from current analytics. A Book click is not a completed booking.",
  },
  {
    id: "clarify",
    num: "02",
    stage: "Clarify",
    titleTh: "ทำให้ข้อมูลช่วยตัดสินใจ",
    titleEn: "Make information support the booking decision",
    inputTh: "หน้าห้องพัก ภาพ ข้อความ ราคา ข้อเสนอ และนโยบายที่มีอยู่",
    inputEn: "Current room pages, photos, copy, rates, offers, and policies",
    actionTh: "ปรับข้อความและลำดับข้อมูลให้ลูกค้าเห็นความต่างของห้องพัก จุดเด่น ทำเล ราคา ข้อเสนอ และเงื่อนไขที่ต้องรู้ก่อนจอง",
    actionEn: "Adjust the copy and the order of facts so guests see how rooms differ, the strengths, the location, the rate, the offer, and the conditions they need before they book.",
    output: "Room/Offer/Policy Checklist",
    approvalTh: "ภาพ รายละเอียดห้อง ราคา ข้อเสนอ และนโยบายที่โรงแรมอนุมัติ",
    approvalEn: "Room photos, facts, rates, offers, and policy the hotel approves",
    measureTh: "Room Interest คือการดูรายละเอียดห้องพัก ข้อเสนอ หรือราคา ไม่ใช่การจองสำเร็จ",
    measureEn: "Room Interest is a room, offer, or rate view. It is not a completed booking.",
  },
  {
    id: "guide",
    num: "03",
    stage: "Guide",
    titleTh: "ทำให้การกระทำถัดไปชัดเจน",
    titleEn: "Make the next action clear",
    inputTh: "หน้าสำคัญบนอุปกรณ์ที่ลูกค้าใช้จริง",
    inputEn: "Key pages on the devices guests actually use",
    actionTh: "วางปุ่ม “ดูห้องว่าง” “ดูราคา” “จองห้องพัก” หรือ “สอบถาม” ให้เหมาะกับเนื้อหาในแต่ละหน้า ไม่บังคับให้ลูกค้าทุกคนกดปุ่มเดียวกันตั้งแต่ยังไม่รู้รายละเอียด",
    actionEn: "Place Check availability, See rates, Book, or Enquire where it fits the page. We do not force every guest to tap the same button before they have the details.",
    output: "CTA and Navigation Plan",
    approvalTh: "เส้นทางติดต่อและการจองที่แสดงบนมือถือ",
    approvalEn: "How contact and booking paths appear on a phone",
    measureTh: "การคลิกปุ่มจองเป็น Booking Start ไม่ใช่ Booking Complete",
    measureEn: "A Book click is Booking Start, not Booking Complete.",
  },
  {
    id: "connect",
    num: "04",
    stage: "Connect",
    titleTh: "ตรวจเส้นทางไป Booking Engine",
    titleEn: "Review the path to the Booking Engine",
    inputTh: "ระบบจองปัจจุบัน และหน้าเว็บที่พาเข้าสู่ระบบ",
    inputEn: "The current booking engine and the pages that send guests into it",
    actionTh: "ดูว่าข้อมูลวันที่ ห้องพัก ราคา และข้อเสนอที่ลูกค้าเห็นบนเว็บไซต์สอดคล้องกับระบบจองหรือไม่ หากระบบจองอยู่บนอีกโดเมน จะตรวจความสามารถในการติดตามเส้นทางข้ามระบบร่วมกับผู้ให้บริการ",
    actionEn: "Check whether the dates, room, rate, and offer the guest saw on the website match the booking system. If the engine sits on another domain, we review how far the path can be tracked across systems with the provider.",
    output: "Booking Engine Handoff Review",
    approvalTh: "การเข้าถึงบัญชีระบบจองและข้อจำกัดของผู้ให้บริการ",
    approvalEn: "Booking-engine account access and provider limits",
    measureTh: "การเข้าสู่ Booking Engine เป็นการเริ่มจอง Booking Complete แสดงได้เมื่อระบบส่งข้อมูลยืนยัน",
    measureEn: "Entering the Booking Engine is Booking Start. Booking Complete is shown only when the engine can confirm it.",
  },
  {
    id: "measure",
    num: "05",
    stage: "Measure",
    titleTh: "ทดสอบและปรับต่อ",
    titleEn: "Test and continue improving",
    inputTh: "จุดเสียดทานและข้อมูลที่เก็บได้หลังปรับ",
    inputEn: "Friction points and the data that can be collected after a change",
    actionTh: "จัดลำดับจุดที่ควรแก้ก่อน แล้วเทียบผลก่อนและหลังปรับตามข้อมูลที่เก็บได้ หากจำนวนผู้ใช้งานเพียงพอและระบบรองรับ จึงพิจารณาทดสอบหน้าเว็บหรือข้อความหลายรูปแบบ",
    actionEn: "Order the changes that should come first, then compare before and after from the data that can be collected. If there is enough use and the system can support it, we may test more than one page or message.",
    output: "Conversion Measurement Plan",
    approvalTh: "ขอบเขตการทดสอบ ข้อความที่โรงแรมยืนยัน และการอนุญาตใช้ข้อมูลวัดผล",
    approvalEn: "Test scope, copy the hotel confirms, and approved use of measurement data",
    measureTh: "แยก Visit, Room Interest, Booking Start และ Booking Complete Booking Complete แสดงได้เมื่อระบบส่งข้อมูลยืนยัน",
    measureEn: "Separate Visit, Room Interest, Booking Start, and Booking Complete. Booking Complete is shown only when the engine can confirm it.",
  },
] as const;

export const DIRECT_BOOKING_FRAMEWORK_BOUNDARY = {
  kicker: "Responsibility boundary",
  supportTitle: {
    th: "เดอะ เคพีไอ พลัส อาจช่วย",
    en: "The KPI Plus may support",
  },
  hotelTitle: {
    th: "โรงแรมและผู้ให้บริการ Booking Engine ยังคงรับผิดชอบ",
    en: "The hotel and Booking Engine provider remain responsible",
  },
  note: {
    th: "เดอะ เคพีไอ พลัส อาจช่วยตรวจเว็บไซต์และเส้นทางจอง โครงสร้างข้อมูลห้องพัก ข้อเสนอและนโยบาย UX ของปุ่มและ Conversion การส่งต่อไป Booking Engine การออกแบบการวัดผล การทดสอบ และข้อเสนอแนะเพื่อปรับต่อ โรงแรมและผู้ให้บริการ Booking Engine ยังคงรับผิดชอบห้องว่าง ราคา ธุรกรรมการจอง การชำระเงิน การยืนยัน นโยบายยกเลิก และสิทธิ์ API/callback ภายนอก",
    en: "The KPI Plus may support Website and Booking Path Review, Room/Offer/Policy information structure, CTA and conversion UX, Booking Engine handoff review, tracking design, testing, and optimization recommendations. The hotel and Booking Engine provider remain responsible for availability, rates, booking transactions, payments, confirmations, cancellation policies, and external API/callback permissions.",
  },
  support: [
    { th: "ตรวจเว็บไซต์และเส้นทางจอง", en: "Website and Booking Path Review" },
    { th: "โครงสร้างข้อมูลห้องพัก ข้อเสนอ และนโยบาย", en: "Room/Offer/Policy information structure" },
    { th: "CTA และ Conversion UX", en: "CTA and conversion UX" },
    { th: "ตรวจการส่งต่อไป Booking Engine", en: "Booking Engine handoff review" },
    { th: "การออกแบบการวัดผล", en: "tracking design" },
    { th: "การทดสอบ", en: "testing" },
    { th: "ข้อเสนอแนะเพื่อปรับต่อ", en: "optimization recommendations" },
  ],
  hotel: [
    { th: "ห้องว่าง", en: "availability" },
    { th: "ราคา", en: "rates" },
    { th: "ธุรกรรมการจอง", en: "booking transactions" },
    { th: "การชำระเงิน", en: "payments" },
    { th: "การยืนยัน", en: "confirmations" },
    { th: "นโยบายยกเลิก", en: "cancellation policies" },
    { th: "สิทธิ์ API/callback ภายนอก", en: "external API/callback permissions" },
  ],
} as const;

export type DirectBookingAuditStatus = "clear" | "needs-review" | "blocked" | "not-configured";

export const DIRECT_BOOKING_AUDIT_STATUS = ["clear", "needs-review", "blocked", "not-configured"] as const;

export function directBookingAuditStatusLabel(status: DirectBookingAuditStatus, locale: Locale) {
  if (status === "clear") return locale === "th" ? "ชัดเจน" : "Clear";
  if (status === "blocked") return locale === "th" ? "ติดขัด" : "Blocked";
  if (status === "not-configured") return locale === "th" ? "ยังไม่ตั้งค่า" : "Not Configured";
  return locale === "th" ? "ต้องตรวจ" : "Needs Review";
}

export function directBookingAuditSampleStatusLabel(locale: Locale) {
  return locale === "th" ? "สถานะตัวอย่าง" : "Sample status";
}

export const DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE = "/images/hotel-direct-booking-friction-audit-checklist-placeholder.webp";

export const DIRECT_BOOKING_AUDIT_GROUPS = [
  { id: "website", en: "Website / Message", th: "Website / Message" },
  { id: "room", en: "Room / Offer / Policy", th: "Room / Offer / Policy" },
  { id: "path", en: "CTA / Booking Path", th: "CTA / Booking Path" },
  { id: "measure", en: "Measurement / Consent", th: "Measurement / Consent" },
] as const;

export const DIRECT_BOOKING_AUDIT_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  labelTh: "Direct Booking Friction Audit Checklist — Sample",
  labelEn: "Direct Booking Friction Audit Checklist — Sample",
  captionTh: "ตารางตรวจตัวอย่าง ไม่ใช่ผลตรวจอัตโนมัติ และไม่ใช่สถานะโรงแรมจริง",
  captionEn: "Sample checklist table. Items are not automatically checked, and this is not a live hotel audit.",
  altTh: "แผนภาพตัวอย่าง Direct Booking Friction Audit Checklist แสดง Website, Room/Offer, Booking Path และการวัดผล พร้อมป้าย Sample status ไม่ใช่ผลโรงแรม",
  altEn: "Sample Direct Booking Friction Audit Checklist showing Website, Room/Offer, Booking Path, and Measurement groups with Sample status — not a hotel result",
  status: "sample" as DirectBookingVisualStatus,
  metaTh: "Sample status · 1600 × 900 px · Display 720 × 405 px · 16:9",
  metaEn: "Sample status · 1600 × 900 px · Display 720 × 405 px · 16:9",
};

export const DIRECT_BOOKING_AUDIT_ROWS = [
  {
    id: "message-match",
    group: "website",
    item: "Message Match between source/ad and landing page",
    itemTh: "Message Match ระหว่างแหล่งที่มาหรือโฆษณากับหน้า Landing",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "การตลาดโรงแรม",
    ownerEn: "Hotel marketing",
    noteTh: "เทียบข้อความโฆษณาหรือผลค้นกับหน้า Landing ที่ลูกค้าเปิดจริง",
    noteEn: "Compare the ad or search promise with the landing page the guest actually opens",
    actionTh: "จัด headline ข้อเสนอ และวันที่ให้ตรงกันก่อนไปแก้ Booking Engine",
    actionEn: "Align headline, offer, and dates before changing the Booking Engine",
    lastReviewed: "",
  },
  {
    id: "room-detail",
    group: "room",
    item: "Room Detail completeness",
    itemTh: "ความครบของรายละเอียดห้องพัก",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "เว็บไซต์โรงแรม",
    ownerEn: "Hotel website",
    noteTh: "ประเภทห้อง ผู้เข้าพัก เตียง วิว และสิ่งที่รวมอยู่",
    noteEn: "Room type, occupancy, bed, view, and what is included",
    actionTh: "ลิสต์ข้อมูลที่ยังขาดก่อนลูกค้าตัดสินใจจอง",
    actionEn: "List missing facts the guest needs before they book",
    lastReviewed: "",
  },
  {
    id: "room-image",
    group: "room",
    item: "Room image quality and relevance",
    itemTh: "คุณภาพและความตรงของภาพห้องพัก",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "เว็บไซต์โรงแรม",
    ownerEn: "Hotel website",
    noteTh: "ภาพควรตรงกับประเภทห้องที่แสดง",
    noteEn: "Images should match the room type shown",
    actionTh: "เปลี่ยนภาพที่ไม่ตรงห้องหรือดูรายละเอียดไม่พอ",
    actionEn: "Replace mismatched or low-detail photos",
    lastReviewed: "",
  },
  {
    id: "occupancy",
    group: "room",
    item: "Occupancy and facility information",
    itemTh: "ข้อมูลผู้เข้าพักและสิ่งอำนวยความสะดวก",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "เว็บไซต์โรงแรม",
    ownerEn: "Hotel website",
    noteTh: "จำนวนผู้เข้าพักสูงสุด เตียงเสริม และสิ่งอำนวยความสะดวกหลัก",
    noteEn: "Max guests, extra bed, and key facilities",
    actionTh: "วาง occupancy และสิ่งอำนวยความสะดวกตรงที่ลูกค้าเทียบห้อง",
    actionEn: "Put occupancy and facilities where the guest compares rooms",
    lastReviewed: "",
  },
  {
    id: "price",
    group: "room",
    item: "Price and inclusion clarity",
    itemTh: "ความชัดของราคาและสิ่งที่รวม",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "รายได้โรงแรม",
    ownerEn: "Hotel revenue",
    noteTh: "ราคาที่แสดงรวมอะไรบ้าง",
    noteEn: "What the displayed price includes",
    actionTh: "แสดงสิ่งที่รวมในราคาใกล้ราคา ไม่เก็บไว้แค่ในระบบจอง",
    actionEn: "Show inclusions next to the price, not only in the engine",
    lastReviewed: "",
  },
  {
    id: "cancellation",
    group: "room",
    item: "Cancellation policy visibility",
    itemTh: "การมองเห็นนโยบายยกเลิก",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "รายได้โรงแรม",
    ownerEn: "Hotel revenue",
    noteTh: "เงื่อนไขยกเลิกควรหาเจอก่อนกดจอง",
    noteEn: "Cancellation terms should be findable before Book",
    actionTh: "โชว์นโยบายบนหน้าห้องพักหรือข้อเสนอ",
    actionEn: "Surface the policy on room/offer pages",
    lastReviewed: "",
  },
  {
    id: "taxes",
    group: "room",
    item: "Taxes/fees and offer conditions, where applicable",
    itemTh: "ภาษี ค่าธรรมเนียม และเงื่อนไขข้อเสนอ หากมี",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "รายได้โรงแรม",
    ownerEn: "Hotel revenue",
    noteTh: "ใช้เมื่อโรงแรมมีภาษี ค่าธรรมเนียม หรือเงื่อนไขข้อเสนอ",
    noteEn: "Only when the hotel uses taxes, fees, or offer conditions",
    actionTh: "แสดงเงื่อนไขที่ทำให้ยอดที่ต้องจ่ายเปลี่ยน",
    actionEn: "Show conditions that change the payable amount",
    lastReviewed: "",
  },
  {
    id: "cta",
    group: "path",
    item: "CTA label clarity",
    itemTh: "ความชัดของข้อความปุ่มดำเนินการ",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "เว็บไซต์โรงแรม",
    ownerEn: "Hotel website",
    noteTh: "จอง ดูห้องว่าง ดูราคา หรือสอบถาม",
    noteEn: "Book, Check availability, View rates, or Enquire",
    actionTh: "ให้ปุ่มตรงกับเจตนาของหน้านั้น",
    actionEn: "Match the CTA to the page intent",
    lastReviewed: "",
  },
  {
    id: "mobile",
    group: "path",
    item: "Mobile tap target and form usability",
    itemTh: "ปุ่มและฟอร์มที่ใช้บนมือถือได้",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "เว็บไซต์โรงแรม",
    ownerEn: "Hotel website",
    noteTh: "ปุ่ม วันที่ และฟอร์มบนมือถือ",
    noteEn: "Buttons, dates, and forms on a phone",
    actionTh: "ทดลองเส้นทางบนมือถือจริง ไม่ดูแค่รายงานเดสก์ท็อป",
    actionEn: "Test the path on a real phone, not only a desktop report",
    lastReviewed: "",
  },
  {
    id: "dates",
    group: "path",
    item: "Date/availability interaction",
    itemTh: "การเลือกวันที่และห้องว่าง",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "เว็บไซต์โรงแรมและผู้ให้บริการ Booking Engine",
    ownerEn: "Hotel website and Booking Engine provider",
    noteTh: "ตัวเลือกวันที่และห้องว่างต้องใช้ได้",
    noteEn: "Date pickers and availability must be usable",
    actionTh: "ตรวจวันที่ว่าง ห้องเต็ม และสถานะโหลดใหม่",
    actionEn: "Check empty dates, sold-out, and reload states",
    lastReviewed: "",
  },
  {
    id: "handoff",
    group: "path",
    item: "Website to Booking Engine consistency",
    itemTh: "ความต่อเนื่องจากเว็บไซต์ไป Booking Engine",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "เว็บไซต์โรงแรมและผู้ให้บริการ Booking Engine",
    ownerEn: "Hotel website and Booking Engine provider",
    noteTh: "วันที่ ห้อง ราคา และข้อเสนอควรต่อเนื่อง",
    noteEn: "Dates, room, price, and offer should continue",
    actionTh: "เดินทางส่งต่อด้วยวันที่และห้องชุดเดียวกัน",
    actionEn: "Walk the handoff with the same dates and room",
    lastReviewed: "",
  },
  {
    id: "engine-mobile",
    group: "path",
    item: "Booking Engine language and mobile behavior",
    itemTh: "ภาษาและพฤติกรรมบนมือถือของ Booking Engine",
    status: "blocked" as DirectBookingAuditStatus,
    ownerTh: "ผู้ให้บริการ Booking Engine",
    ownerEn: "Booking Engine provider",
    noteTh: "ภาษาและเลย์เอาต์หลังส่งต่อ ตัวอย่างนี้ติดขัดจนกว่าจะได้สิทธิ์เข้าดูระบบ",
    noteEn: "Language and layout after handoff. This sample is blocked until provider access exists",
    actionTh: "ยืนยันกับผู้ให้บริการ ไม่ใช่งานแก้เว็บไซต์อย่างเดียว",
    actionEn: "Confirm with the provider; this is not a website-only change",
    lastReviewed: "",
  },
  {
    id: "error-confirm",
    group: "path",
    item: "Error state and confirmation state",
    itemTh: "สถานะผิดพลาดและสถานะยืนยัน",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "ผู้ให้บริการ Booking Engine",
    ownerEn: "Booking Engine provider",
    noteTh: "ส่งไม่สำเร็จ กับการจองที่ยืนยันแล้ว",
    noteEn: "Failed submit versus a confirmed booking",
    actionTh: "บันทึกว่าลูกค้าเห็นอะไรเมื่อผิดพลาดและเมื่อยืนยัน",
    actionEn: "Record what the guest sees on error and on confirmation",
    lastReviewed: "",
  },
  {
    id: "analytics-owner",
    group: "measure",
    item: "Analytics event ownership",
    itemTh: "ผู้รับผิดชอบอีเวนต์ Analytics",
    status: "not-configured" as DirectBookingAuditStatus,
    ownerTh: "สิทธิ์ Analytics ของโรงแรม",
    ownerEn: "Hotel analytics access",
    noteTh: "ใครเป็นเจ้าของอีเวนต์ Visit, Room Interest และ Booking Start",
    noteEn: "Who owns Visit, Room Interest, and Booking Start events",
    actionTh: "ยืนยันสิทธิ์เข้าถึงก่อนรายงานผล",
    actionEn: "Confirm access before reporting",
    lastReviewed: "",
  },
  {
    id: "complete-callback",
    group: "measure",
    item: "Booking Complete callback/API/event status",
    itemTh: "สถานะ callback / API / อีเวนต์ของ Booking Complete",
    status: "not-configured" as DirectBookingAuditStatus,
    ownerTh: "ผู้ให้บริการ Booking Engine และโรงแรม",
    ownerEn: "Booking Engine provider and hotel",
    noteTh: "Booking Complete แสดงได้เมื่อระบบยืนยันได้เท่านั้น",
    noteEn: "Booking Complete is shown only when the engine can confirm it",
    actionTh: "อย่านับคลิกจองเป็นการจองสำเร็จ",
    actionEn: "Do not treat a Book click as Booking Complete",
    lastReviewed: "",
  },
  {
    id: "privacy",
    group: "measure",
    item: "Privacy and consent status",
    itemTh: "สถานะความเป็นส่วนตัวและความยินยอม",
    status: "needs-review" as DirectBookingAuditStatus,
    ownerTh: "โรงแรม",
    ownerEn: "Hotel",
    noteTh: "การวัดผลและ callback ต้องใช้ข้อมูลที่อนุมัติและปลอดภัยด้านความเป็นส่วนตัว",
    noteEn: "Tracking and callbacks need approved, privacy-safe data use",
    actionTh: "ยืนยันความยินยอมและการใช้ข้อมูลก่อนเปิดอีเวนต์",
    actionEn: "Confirm consent and data-use before turning events on",
    lastReviewed: "",
  },
] as const;

export const DIRECT_BOOKING_DECISION_VISUAL_CANDIDATE = "/images/hotel-direct-booking-audit-vs-rebuild-placeholder.webp";

export const DIRECT_BOOKING_DECISION_STAGES = [
  { id: "audit", en: "Current Website Audit", th: "ตรวจเว็บไซต์ปัจจุบัน" },
  { id: "review", en: "Content/Mobile/CTA/Booking Engine/Tracking Review", th: "ทบทวนเนื้อหา มือถือ CTA Booking Engine และการวัดผล" },
  { id: "friction", en: "Identify Friction", th: "หาจุดที่ลูกค้าหยุด" },
  { id: "choose", en: "Improve Existing or Rebuild Where Needed", th: "ปรับของเดิม หรือสร้างใหม่เมื่อจำเป็น" },
] as const;

export const DIRECT_BOOKING_DECISION_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  labelTh: "Direct Booking Audit Before Redesign — Sample",
  labelEn: "Direct Booking Audit Before Redesign — Sample",
  captionTh: "เส้นทางตัดสินใจตัวอย่าง เริ่มจากเว็บไซต์ปัจจุบัน ไม่ได้หมายความว่าการสร้างใหม่ดีกว่าเสมอ",
  captionEn: "Sample decision path from the current website. A rebuild is not always better.",
  altTh: "แผนภาพตัวอย่าง Direct Booking Audit Before Redesign แสดง Current Website Audit, Content/Mobile/CTA/Booking Engine/Tracking Review, Identify Friction และ Improve Existing or Rebuild Where Needed โดยไม่มีรูปทีมงาน",
  altEn: "Sample Direct Booking Audit Before Redesign diagram showing Current Website Audit, Content/Mobile/CTA/Booking Engine/Tracking Review, Identify Friction, and Improve Existing or Rebuild Where Needed — not a team photo",
  status: "sample" as DirectBookingVisualStatus,
  metaTh: "Sample decision · 1600 × 900 px · Display 720 × 405 px · 16:9",
  metaEn: "Sample decision · 1600 × 900 px · Display 720 × 405 px · 16:9",
};

export const DIRECT_BOOKING_DECISION_CONSTRAINTS = [
  { th: "งบประมาณ", en: "budget" },
  { th: "ระยะเวลา", en: "timeline" },
  { th: "ความสามารถของทีมโรงแรม", en: "hotel-team capability" },
  { th: "กรรมสิทธิ์", en: "ownership" },
  { th: "ข้อจำกัดของ Booking Engine", en: "Booking Engine constraints" },
] as const;

export const DIRECT_BOOKING_DECISION_PATHS = [
  {
    id: "improve",
    titleTh: "ปรับเว็บไซต์เดิม",
    titleEn: "Improve Existing Website",
    routeTh: "ปรับเว็บไซต์เดิม",
    routeEn: "Improve Existing Website",
    situationTh: [
      "เนื้อหาและ CTA ปรับได้",
      "ปัญหาบนมือถือแก้ได้",
      "Booking Engine เดิมยังเชื่อมได้",
      "SEO และการวัดผลเดิมเก็บไว้ได้",
      "ปัญหาหลักอยู่ที่เนื้อหา UX ความเร็ว หรือเส้นทางจอง",
    ],
    situationEn: [
      "Content and CTA can be changed",
      "Mobile issues can be fixed",
      "Existing Booking Engine can remain connected",
      "SEO and tracking can be preserved",
      "Main problem is content, UX, speed, or conversion path",
    ],
    evidenceTh: "เว็บไซต์ปัจจุบัน เส้นทางลูกค้าที่ใช้จริง หน้าสำคัญ มือถือ CTA การเชื่อม Booking Engine SEO และการวัดผล",
    evidenceEn: "The current website, the actual customer path, key pages, mobile use, CTA, Booking Engine connection, SEO, and tracking",
    riskTh: "ถ้าแพลตฟอร์มหรือสถาปัตยกรรมเดิมจำกัดการเปลี่ยนแปลงที่จำเป็น ข้อจำกัดนั้นอาจยังอยู่ ต้องดูงบประมาณ ระยะเวลา ความสามารถของทีมโรงแรม กรรมสิทธิ์ และข้อจำกัดของ Booking Engine",
    riskEn: "If the current platform or architecture limits the required change, that limit can remain. Budget, timeline, hotel-team capability, ownership, and Booking Engine constraints still apply.",
    nextTh: "ตรวจเว็บไซต์ปัจจุบันและเส้นทางลูกค้าก่อน หากเนื้อหา มือถือ CTA ระบบจอง และการวัดผลยังใช้ต่อได้ จึงปรับระบบเดิม",
    nextEn: "Audit the current website and customer path first. If content, mobile, CTA, Booking Engine, and tracking can still be used, improve the existing system.",
  },
  {
    id: "rebuild",
    titleTh: "พิจารณาสร้างใหม่",
    titleEn: "Consider Rebuild",
    routeTh: "พิจารณาสร้างใหม่",
    routeEn: "Consider Rebuild",
    situationTh: [
      "แพลตฟอร์มเดิมจำกัดการเปลี่ยนแปลงที่จำเป็น",
      "สถาปัตยกรรมหรือความปลอดภัยดูแลต่อไม่ได้",
      "การเชื่อม Booking Engine ต้องออกแบบใหม่",
      "กรรมสิทธิ์หรือการเผยแพร่ไม่ชัด",
      "ปัญหาหลักอยู่ที่แพลตฟอร์ม สถาปัตยกรรม หรือการดูแลต่อ",
    ],
    situationEn: [
      "Existing platform blocks required changes",
      "Architecture or security is not maintainable",
      "Booking Engine integration must be redesigned",
      "Ownership or deployment is unclear",
      "Main problem is platform, architecture, or maintainability",
    ],
    evidenceTh: "ข้อจำกัดของแพลตฟอร์ม สถาปัตยกรรม ความปลอดภัย กรรมสิทธิ์ การเผยแพร่ และการเชื่อม Booking Engine",
    evidenceEn: "Platform limits, architecture, security, ownership, deployment, and Booking Engine integration",
    riskTh: "การสร้างใหม่ไม่ได้ดีกว่าเสมอ หากเส้นทางเดิมยังปรับได้อย่างปลอดภัย โรงแรมอาจรับงานเกินที่จำเป็น ต้องดูงบประมาณ ระยะเวลา ความสามารถของทีมโรงแรม กรรมสิทธิ์ และข้อจำกัดของ Booking Engine",
    riskEn: "A rebuild is not always better. If the current path can still be improved safely, the hotel may take on more work than needed. Budget, timeline, hotel-team capability, ownership, and Booking Engine constraints still apply.",
    nextTh: "อธิบายข้อจำกัดของระบบเดิมก่อนให้โรงแรมเลือกขอบเขต จะเสนอสร้างใหม่เฉพาะเมื่อแพลตฟอร์ม สถาปัตยกรรม กรรมสิทธิ์ ความปลอดภัย หรือการเชื่อมระบบจำกัดการแก้ไข",
    nextEn: "Explain the current-system limit before the hotel chooses the scope. Recommend rebuilding only when platform, architecture, ownership, security, or integration constraints require it.",
  },
] as const;

export const DIRECT_BOOKING_DECISION_NOTE = {
  th: "การเลือกปรับหรือสร้างใหม่ขึ้นกับหลักฐานจากเว็บไซต์และระบบจองที่มี ความสามารถของทีมโรงแรม กรรมสิทธิ์ งบประมาณ ระยะเวลา และข้อจำกัดของ Booking Engine ไม่ได้หมายความว่าการสร้างใหม่ดีกว่าเสมอ",
  en: "The choice depends on evidence from the current website and booking engine, hotel-team capability, ownership, budget, timeline, and Booking Engine constraints. A rebuild is not always better.",
} as const;

export const DIRECT_BOOKING_WORKFLOW_VISUAL_CANDIDATE = "/images/hotel-direct-booking-workflow-placeholder.webp";

export const DIRECT_BOOKING_WORKFLOW_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 640,
  displayHeight: 360,
  labelTh: "Direct Booking Optimization Workflow — Sample",
  labelEn: "Direct Booking Optimization Workflow — Sample",
  captionTh: "ไทม์ไลน์ตัวอย่าง Review → Prioritize → Adjust → Measure ไม่ใช่รูปประชุม และไม่ใช่ผลโรงแรม",
  captionEn: "Sample timeline: Review → Prioritize → Adjust → Measure. Not a meeting photo and not a hotel result.",
  altTh: "แผนภาพตัวอย่าง Direct Booking Optimization Workflow แสดง Review, Prioritize, Adjust และ Measure พร้อมผลลัพธ์ Friction Audit, Priority Backlog, Approved Change Set และ Conversion Report ไม่ใช่รูปประชุม",
  altEn: "Sample Direct Booking Optimization Workflow timeline showing Review, Prioritize, Adjust, and Measure with outputs Friction Audit, Priority Backlog, Approved Change Set, and Conversion Report — not a meeting photo",
  status: "sample" as DirectBookingVisualStatus,
  metaTh: "Sample workflow · 1600 × 900 px · Display 640 × 360 px · 16:9",
  metaEn: "Sample workflow · 1600 × 900 px · Display 640 × 360 px · 16:9",
};

export const DIRECT_BOOKING_WORKFLOW_REVIEW_CHECKS = [
  { th: "Website Analytics", en: "Website Analytics" },
  { th: "หน้าสำคัญ", en: "Key pages" },
  { th: "เส้นทางมือถือ", en: "Mobile path" },
  { th: "รายละเอียดห้องพัก", en: "Room detail" },
  { th: "CTA", en: "CTA" },
  { th: "Booking Engine", en: "Booking Engine" },
  { th: "การวัดผลที่มีอยู่", en: "Existing tracking" },
] as const;

export const DIRECT_BOOKING_WORKFLOW_ADJUST_SCOPE = [
  { th: "ข้อความ", en: "Copy" },
  { th: "ข้อมูลห้องพัก", en: "Room information" },
  { th: "ภาพ", en: "Images" },
  { th: "ป้าย CTA", en: "CTA labels" },
  { th: "การแสดงราคาและข้อเสนอ", en: "Price/offer display" },
  { th: "ความชัดของนโยบายยกเลิก", en: "Cancellation policy visibility" },
  { th: "การนำทาง", en: "Navigation" },
  { th: "ข้อความส่งต่อไป Booking Engine", en: "Booking Engine handoff messaging" },
] as const;

export const DIRECT_BOOKING_WORKFLOW = [
  {
    id: "review",
    num: "01",
    label: "Review",
    titleTh: "ตรวจเส้นทางปัจจุบัน",
    titleEn: "Review the current path",
    ownerTh: "เดอะ เคพีไอ พลัส ตรวจ โรงแรมอนุญาตสิทธิ์เว็บไซต์ Analytics และ Booking Engine",
    ownerEn: "The KPI Plus reviews. The hotel grants website, analytics, and Booking Engine access.",
    inputTh: "เว็บไซต์ปัจจุบัน สิทธิ์ Analytics หน้าสำคัญ เส้นทางมือถือ รายละเอียดห้องพัก CTA Booking Engine และการวัดผลที่มีอยู่",
    inputEn: "Current website, analytics access, key pages, mobile path, room detail, CTA, Booking Engine, and existing tracking",
    actionTh: "ตรวจ Website Analytics หน้าสำคัญ เส้นทางมือถือ รายละเอียดห้องพัก CTA Booking Engine และการวัดผลที่มีอยู่",
    actionEn: "Review Website Analytics, key pages, mobile path, room detail, CTA, Booking Engine, and existing tracking",
    output: "Friction Audit",
    approvalTh: "โรงแรมยืนยันหน้าที่ใช้จริง ระบบจอง และการเข้าถึง Analytics",
    approvalEn: "The hotel confirms live pages, the Booking Engine, and analytics access",
    nextTh: "เลือกว่าจุดใดควรเข้า Priority Backlog",
    nextEn: "Decide which friction points enter the Priority Backlog",
  },
  {
    id: "prioritize",
    num: "02",
    label: "Prioritize",
    titleTh: "จัดลำดับงานก่อน",
    titleEn: "Choose what to change first",
    ownerTh: "เดอะ เคพีไอ พลัส เสนอลำดับ โรงแรมอนุมัติ",
    ownerEn: "The KPI Plus proposes the order. The hotel approves it.",
    inputTh: "Friction Audit จากขั้น Review",
    inputEn: "Friction Audit from Review",
    actionTh: "จัดลำดับหน้าหรือขั้นตอนที่เกี่ยวกับการสอบถามและการเริ่มจองมากที่สุด",
    actionEn: "Rank the pages or steps that matter most to enquiries and Booking Start",
    output: "Priority Backlog",
    approvalTh: "โรงแรมอนุมัติลำดับงาน",
    approvalEn: "The hotel approves the order of work",
    nextTh: "เลือกชุดปรับชุดแรกจาก Priority Backlog",
    nextEn: "Choose the first Approved Change Set from the Priority Backlog",
  },
  {
    id: "adjust",
    num: "03",
    label: "Adjust",
    titleTh: "ปรับร่วมกับโรงแรม",
    titleEn: "Adjust with the hotel",
    ownerTh: "เดอะ เคพีไอ พลัส ร่างการปรับ โรงแรมยืนยันราคา ข้อเสนอ และนโยบาย",
    ownerEn: "The KPI Plus drafts the change. The hotel confirms rates, offers, and policy.",
    inputTh: "Priority Backlog และหน้าที่ใช้จริง",
    inputEn: "Priority Backlog and the live pages",
    actionTh: "ปรับข้อความ ข้อมูลห้องพัก ภาพ ป้าย CTA การแสดงราคาและข้อเสนอ ความชัดของนโยบายยกเลิก การนำทาง และข้อความส่งต่อไป Booking Engine ตามที่จำเป็น",
    actionEn: "Adjust copy, room information, images, CTA labels, price/offer display, cancellation policy visibility, navigation, and Booking Engine handoff messaging as needed",
    output: "Approved Change Set",
    approvalTh: "โรงแรมอนุมัติข้อความ ราคา เงื่อนไข และชุดปรับ",
    approvalEn: "The hotel approves copy, rates, terms, and the change set",
    nextTh: "เผยแพร่ชุดที่อนุมัติแล้ว แล้วเริ่มวัดผล",
    nextEn: "Publish the approved set, then start measurement",
  },
  {
    id: "measure",
    num: "04",
    label: "Measure",
    titleTh: "วัดผลเป็นขั้น",
    titleEn: "Measure in steps",
    ownerTh: "เดอะ เคพีไอ พลัส รายงานเท่าที่ระบบวัดได้ โรงแรมอนุมัติการใช้ข้อมูล",
    ownerEn: "The KPI Plus reports within system limits. The hotel approves data use.",
    inputTh: "Approved Change Set และการวัดผลที่มีอยู่",
    inputEn: "Approved Change Set and existing tracking",
    actionTh: "รายงาน Website Visit, Room Interest, Booking Start และ Booking Complete เฉพาะจากแหล่งที่ตรวจสอบได้ ไม่สร้างยอดจองสำเร็จจากคลิกปุ่มจอง",
    actionEn: "Report Website Visit, Room Interest, Booking Start, and Booking Complete only from verifiable sources. Never infer Booking Complete from a Book click",
    output: "Conversion Report",
    approvalTh: "โรงแรมอนุญาตการใช้ข้อมูลวัดผล",
    approvalEn: "The hotel approves measurement data use",
    nextTh: "คงชุดปรับ พักไว้ หรือดึงงานถัดไปจาก Priority Backlog",
    nextEn: "Keep the change, pause, or queue the next Priority Backlog item",
  },
] as const;

export const DIRECT_BOOKING_KPI_VISUAL_HEIGHT = 405;

export const DIRECT_BOOKING_MEASURE_VISUAL_CANDIDATE = "/images/hotel-direct-booking-measurement-funnel-placeholder.webp";

export const DIRECT_BOOKING_MEASURE_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  labelTh: "Direct Booking Measurement Funnel · Sample data",
  labelEn: "Direct Booking Measurement Funnel · Sample data",
  captionTh: "กรวยวัดผลตัวอย่าง ไม่ใช่ยอดโรงแรม และไม่สร้างตัวเลข Booking Complete",
  captionEn: "Sample measurement funnel. Not a hotel result. Booking Complete numbers are not invented.",
  altTh: "แผนภาพตัวอย่าง Direct Booking Measurement Funnel แสดง Website Visit, Room Interest, Booking Start และ Booking Complete โดย Booking Complete ติดป้ายยังไม่เชื่อมการวัดผล ไม่มีตัวเลขจอง",
  altEn: "Sample Direct Booking Measurement Funnel showing Website Visit, Room Interest, Booking Start, and Booking Complete, with Booking Complete labelled Tracking not configured and no booking counts",
  status: "sample" as DirectBookingVisualStatus,
  metaTh: "Sample funnel · 1600 × 900 px · Display 720 × 405 px · 16:9",
  metaEn: "Sample funnel · 1600 × 900 px · Display 720 × 405 px · 16:9",
};

export const DIRECT_BOOKING_MEASURE_NOTE = {
  th: "การคลิกปุ่มจองเป็นเพียงสัญญาณเริ่มต้น หาก Booking Engine ไม่ส่งข้อมูลกลับ จะยังไม่ควรรายงานว่าเป็นยอดจองสำเร็จ",
  en: "A Book click is only a start signal. If the Booking Engine does not send data back, it should not yet be reported as a completed booking.",
} as const;

export type DirectBookingMeasureTracking = "clear" | "needs-review" | "not-configured";

export const DIRECT_BOOKING_MEASURE_STAGES = [
  {
    id: "visit",
    num: "01",
    event: "Website Visit",
    titleTh: "เข้าชมเว็บไซต์",
    titleEn: "Website Visit",
    actionTh: "ลูกค้าเข้าสู่เว็บไซต์",
    actionEn: "Customer enters the website.",
    sourceTh: "Analytics ของเว็บไซต์โรงแรม เมื่อตั้งค่าแล้ว",
    sourceEn: "Hotel website analytics, when configured",
    ownerTh: "โรงแรมอนุมัติสิทธิ์ Analytics",
    ownerEn: "Hotel analytics access",
    concludeTh: "แสดงหน้า Landing และช่องทางที่มาได้เมื่อ Analytics ตั้งค่าแล้ว แต่ไม่ใช่ยอดจอง",
    concludeEn: "Can show landing page and source/channel where analytics is configured. Not a booking.",
  },
  {
    id: "interest",
    num: "02",
    event: "Room Interest",
    titleTh: "สนใจห้องพัก",
    titleEn: "Room Interest",
    actionTh: "ลูกค้าดูรายละเอียดห้องพัก ข้อเสนอ ราคา หรือห้องว่าง",
    actionEn: "Customer views room details, offer, price, or availability.",
    sourceTh: "Analytics ของเว็บไซต์โรงแรม",
    sourceEn: "Hotel website analytics",
    ownerTh: "โรงแรมอนุมัติสิทธิ์ Analytics",
    ownerEn: "Hotel analytics access",
    concludeTh: "แสดงการมีส่วนร่วมกับเนื้อหาได้ แต่ยังไม่ใช่การจอง",
    concludeEn: "Can show content engagement, not a booking.",
  },
  {
    id: "start",
    num: "03",
    event: "Booking Start",
    titleTh: "เริ่มจอง",
    titleEn: "Booking Start",
    actionTh: "ลูกค้าเข้าสู่ Booking Engine เริ่มเส้นทางจอง หรือส่งคำถามที่เกี่ยวกับการจอง",
    actionEn: "Customer enters the Booking Engine, starts a booking flow, or submits a booking-related inquiry.",
    sourceTh: "ปุ่มบนเว็บไซต์ และอีเวนต์เริ่มต้นของ Booking Engine",
    sourceEn: "Website CTA and Booking Engine start events",
    ownerTh: "เว็บไซต์โรงแรมและผู้ให้บริการ Booking Engine",
    ownerEn: "Hotel website and Booking Engine provider",
    concludeTh: "แสดงได้ว่าเริ่มเส้นทางจองแล้ว แต่ยังไม่ใช่การจองสำเร็จ",
    concludeEn: "Can show that a booking flow started. Still not a completed booking.",
  },
  {
    id: "complete",
    num: "04",
    event: "Booking Complete",
    titleTh: "จองสำเร็จ",
    titleEn: "Booking Complete",
    actionTh: "การจองได้รับการยืนยันจากแหล่งที่ตรวจสอบได้",
    actionEn: "A booking is confirmed from a verifiable source.",
    sourceTh: "callback, API, server event, transaction event หรือแหล่งอื่นที่ตรวจสอบได้และได้รับอนุมัติ",
    sourceEn: "Approved callback, API, server event, transaction event, or other verifiable source",
    ownerTh: "ผู้ให้บริการ Booking Engine และโรงแรม",
    ownerEn: "Booking Engine provider and hotel",
    concludeTh: "แสดงจำนวนหรือมูลค่าการจองได้เมื่อข้อมูลได้รับอนุมัติและปลอดภัยด้านความเป็นส่วนตัว ไม่สร้างหรืออนุมานยอดจองสำเร็จจากการคลิกปุ่มจอง",
    concludeEn: "Include booking count/value only when data is approved and privacy-safe. Never create or infer Booking Complete numbers from a Book click.",
  },
] as const;

export function directBookingMeasureStatus(
  stageId: (typeof DIRECT_BOOKING_MEASURE_STAGES)[number]["id"],
  flags: { bookingEngineConfigured?: boolean; trackingConfigured?: boolean },
): DirectBookingMeasureTracking {
  if (stageId === "complete") {
    return flags.bookingEngineConfigured && flags.trackingConfigured ? "needs-review" : "not-configured";
  }
  return "needs-review";
}

export function directBookingMeasureStatusLabel(status: DirectBookingMeasureTracking, locale: Locale) {
  if (status === "clear") return locale === "th" ? "ชัดเจน" : "Clear";
  if (status === "not-configured") return locale === "th" ? "ยังไม่เชื่อมการวัดผล" : "Tracking not configured";
  return locale === "th" ? "ต้องตรวจ" : "Needs review";
}

export const DIRECT_BOOKING_RELATED_VISUAL_CANDIDATE = "/images/hotel-direct-booking-related-content-placeholder.webp";

export const DIRECT_BOOKING_ENQUIRY_VISUAL_CANDIDATE = "/images/hotel-direct-booking-contact-flow-placeholder.webp";

export const DIRECT_BOOKING_ENQUIRY_FLOW = [
  { en: "Website Review", th: "Website Review" },
  { en: "Booking Path Review", th: "Booking Path Review" },
  { en: "Measurement Plan", th: "Measurement Plan" },
] as const;

export const DIRECT_BOOKING_ENQUIRY_VISUAL = {
  recommendedSize: "1200 × 600 px",
  ratio: "2 / 1",
  width: 1200,
  height: 600,
  displayWidth: 420,
  displayHeight: 210,
  labelTh: "What Happens Next — Sample process",
  labelEn: "What Happens Next — Sample process",
  captionTh: "ลำดับทบทวนตัวอย่าง Website Review → Booking Path Review → Measurement Plan ไม่ใช่รูปทีมหรือโรงแรมจริง",
  captionEn: "Sample review sequence: Website Review → Booking Path Review → Measurement Plan. Not a team photo or a live hotel.",
  altTh: "แผนภาพตัวอย่าง What Happens Next แสดง Website Review, Booking Path Review และ Measurement Plan ไม่ใช่รูปบุคคลหรือเว็บไซต์โรงแรมจริง",
  altEn: "Sample What Happens Next diagram showing Website Review, Booking Path Review, and Measurement Plan — not a person or a live hotel website",
  status: "sample" as DirectBookingVisualStatus,
  metaTh: "Sample process · 1200 × 600 px · Display 420 × 210 px · 2:1",
  metaEn: "Sample process · 1200 × 600 px · Display 420 × 210 px · 2:1",
};

export const DIRECT_BOOKING_RELATED_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 520,
  displayHeight: 347,
  labelTh: "Hotel Direct Booking / Website Content",
  labelEn: "Hotel Direct Booking / Website Content",
  captionTh: "แผนที่เนื้อหาที่เกี่ยวข้อง ไม่ใช่รูป Hero หรือ Booking Confidence และไม่ใช่ผลจองโรงแรม",
  captionEn: "Related content map. Not the Hero or Booking Confidence visual, and not a hotel booking result.",
  altTh: "แผนที่เนื้อหาตัวอย่าง Hotel Direct Booking / Website Content แสดง Website Health Check, Direct Booking Path Review, Booking Engine Handoff และ Mobile Conversion Audit ไม่ใช่ผลโรงแรม",
  altEn: "Sample Hotel Direct Booking / Website Content map showing Website Health Check, Direct Booking Path Review, Booking Engine Handoff, and Mobile Conversion Audit — not a hotel result",
  status: "sample" as DirectBookingVisualStatus,
  metaTh: "Sample related content · 1200 × 800 px · Display 520 × 347 px · 3:2",
  metaEn: "Sample related content · 1200 × 800 px · Display 520 × 347 px · 3:2",
};

export const DIRECT_BOOKING_RELATED_VISUAL_OPTIONS = [
  { id: "health", label: "Website Health Check" },
  { id: "path", label: "Direct Booking Path Review" },
  { id: "engine", label: "Booking Engine Handoff" },
  { id: "mobile", label: "Mobile Conversion Audit" },
] as const;

export const DIRECT_BOOKING_KPI_SAMPLE = {
  period: "Sample 6-week window after a path change",
  periodTh: "ตัวอย่างช่วง 6 สัปดาห์หลังปรับเส้นทาง",
  market: "Sample hotel website · Thailand",
  marketTh: "ตัวอย่างเว็บไซต์โรงแรม · ประเทศไทย",
  source: "Hotel website analytics / Booking Engine events · labelled sample",
  sourceTh: "การวัดผลเว็บไซต์โรงแรม / อีเวนต์ระบบจอง · ตัวอย่างข้อมูล",
  updatedAt: "2026-10-28",
  comparison: "Hotel baseline after a path change, when analytics access exists",
  comparisonTh: "เทียบกับฐานของโรงแรมหลังปรับเส้นทาง เมื่อมีสิทธิ์ดูการวัดผล",
} as const;

export const DIRECT_BOOKING_KPI_GROUPS = [
  {
    id: "visit",
    num: "01",
    titleTh: "Website Visit",
    titleEn: "Website Visit",
    noteTh: "ดูว่าลูกค้าเข้าหน้าไหน และมาจากช่องทางใด ไม่ใช่ยอดจอง",
    noteEn: "Which pages guests open and which channel they came from. Not a booking count.",
  },
  {
    id: "interest",
    num: "02",
    titleTh: "Room Interest",
    titleEn: "Room Interest",
    noteTh: "ดูการเปิดหน้าห้องพัก ข้อเสนอ หรือราคา การดูห้องยังไม่ใช่การจอง",
    noteEn: "Room, offer, or rate views. Opening a room page is not a booking.",
  },
  {
    id: "start",
    num: "03",
    titleTh: "Booking Start",
    titleEn: "Booking Start",
    noteTh: "คลิกเข้าสู่ Booking Engine หรือส่งคำถาม การคลิกจองยังไม่ใช่การจองสำเร็จ",
    noteEn: "Clicks into the booking engine or an enquiry. A Book click is not a completed booking.",
  },
  {
    id: "complete",
    num: "04",
    titleTh: "Booking Complete",
    titleEn: "Booking Complete",
    noteTh: "แสดงได้เมื่อ Booking Engine ส่ง callback, API, server event หรือข้อมูลที่ตรวจสอบได้",
    noteEn: "Shown only when the Booking Engine sends a callback, API, server event, or other verifiable source.",
  },
] as const;

export const DIRECT_BOOKING_KPI_SERIES = [
  {
    id: "website-visits",
    group: "visit",
    name: "Website visits",
    labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
    values: [40, 44, 42, 48, 51, 55],
    target: "52",
  },
  {
    id: "room-interest",
    group: "interest",
    name: "Room interest",
    labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
    values: [18, 20, 19, 24, 26, 28],
    target: "26",
  },
  {
    id: "booking-start",
    group: "start",
    name: "Booking starts",
    labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
    values: [6, 7, 6, 9, 10, 11],
    target: "10",
  },
] as const;

export const DIRECT_BOOKING_KPIS = [
  {
    id: "website-visits",
    group: "visit",
    nameTh: "เข้าชมเว็บไซต์",
    nameEn: "Website visits",
    unit: "Sessions on key hotel pages",
    unitTh: "จำนวนเซสชันบนหน้าโรงแรมหลัก",
    definition: "Guests opening the official website. Not a booking count.",
    definitionTh: "ลูกค้าเปิดเว็บไซต์ทางการ ไม่ใช่จำนวนการจอง",
    hideUntilData: true,
    dataStatus: "sample" as DirectBookingKpiStatus,
    tone: "green" as const,
  },
  {
    id: "landing-engagement",
    group: "visit",
    nameTh: "การมีส่วนร่วมบนหน้า Landing",
    nameEn: "Landing engagement",
    unit: "Engaged sessions on campaign or search landing pages",
    unitTh: "เซสชันที่มีการมีส่วนร่วมบนหน้า Landing จากแคมเปญหรือการค้นหา",
    definition: "Whether guests stay with the page that answered the click. Not a conversion rate.",
    definitionTh: "ลูกค้าอยู่กับหน้าที่ตอบคลิกนั้น ไม่ใช่อัตราแปลง",
    hideUntilData: true,
    dataStatus: "sample" as DirectBookingKpiStatus,
    tone: "green" as const,
  },
  {
    id: "room-detail-views",
    group: "interest",
    nameTh: "การเปิดหน้าห้องพัก",
    nameEn: "Room detail views",
    unit: "Views of room pages",
    unitTh: "จำนวนการเปิดหน้าห้องพัก",
    definition: "Guests opening a room page. Not a booking.",
    definitionTh: "ลูกค้าเปิดหน้าห้องพัก ไม่ใช่การจอง",
    hideUntilData: true,
    dataStatus: "sample" as DirectBookingKpiStatus,
    tone: "green" as const,
  },
  {
    id: "offer-views",
    group: "interest",
    nameTh: "การเปิดหน้าข้อเสนอ",
    nameEn: "Offer views",
    unit: "Views of offer or rate pages",
    unitTh: "จำนวนการเปิดหน้าข้อเสนอหรือราคา",
    definition: "Guests opening an offer. Not a completed stay.",
    definitionTh: "ลูกค้าเปิดหน้าข้อเสนอ ไม่ใช่การเข้าพักที่สำเร็จ",
    hideUntilData: true,
    dataStatus: "sample" as DirectBookingKpiStatus,
    tone: "green" as const,
  },
  {
    id: "booking-engine-starts",
    group: "start",
    nameTh: "การเริ่มใช้ระบบจอง",
    nameEn: "Booking Engine starts",
    unit: "Clicks that enter the booking engine",
    unitTh: "จำนวนคลิกที่เข้าสู่ระบบจอง",
    definition: "Intent to book. A Book click is not a completed booking.",
    definitionTh: "เจตนาจะจอง การคลิกปุ่มจองยังไม่ใช่การจองสำเร็จ",
    hideUntilData: true,
    dataStatus: "sample" as DirectBookingKpiStatus,
    tone: "green" as const,
  },
  {
    id: "enquiry-starts",
    group: "start",
    nameTh: "การเริ่มสอบถามและติดต่อ",
    nameEn: "Enquiries and contact starts",
    unit: "Form, call, or chat starts",
    unitTh: "จำนวนการเริ่มฟอร์ม โทร หรือแชท",
    definition: "A guest starting contact. Not a completed booking.",
    definitionTh: "ลูกค้าเริ่มติดต่อ ไม่ใช่การจองสำเร็จ",
    hideUntilData: true,
    dataStatus: "sample" as DirectBookingKpiStatus,
    tone: "yellow" as const,
  },
  {
    id: "booking-complete",
    group: "complete",
    nameTh: "การจองสำเร็จ",
    nameEn: "Booking complete",
    unit: "Bookings the engine or hotel system confirms",
    unitTh: "จำนวนการจองที่ระบบจองหรือระบบโรงแรมยืนยัน",
    definition: "A completed booking only if a callback, API, server event, or transaction event can be checked.",
    definitionTh: "นับเป็นการจองสำเร็จเมื่อมี callback, API, server event หรือ transaction event ที่ตรวจสอบได้",
    hideUntilData: true,
    dataStatus: "sample" as DirectBookingKpiStatus,
    tone: "amber" as const,
  },
  {
    id: "conversion-rate",
    group: "complete",
    nameTh: "อัตราแปลง",
    nameEn: "Conversion rate",
    unit: "Completed bookings / sessions, when both are approved",
    unitTh: "การจองสำเร็จ / เซสชัน เมื่อทั้งสองได้รับอนุมัติ",
    definition: "A rate only when completed bookings are returned and approved. Not inferred from Book clicks.",
    definitionTh: "ใช้อัตราเมื่อมียอดจองสำเร็จที่ส่งกลับและได้รับอนุมัติ ไม่ใช่การอนุมานจากคลิกจอง",
    hideUntilData: true,
    dataStatus: "sample" as DirectBookingKpiStatus,
    tone: "amber" as const,
  },
  {
    id: "direct-booking-value",
    group: "complete",
    nameTh: "มูลค่าการจองตรง",
    nameEn: "Direct booking value",
    unit: "Confirmed direct booking value",
    unitTh: "มูลค่าการจองตรงที่ยืนยันได้",
    definition: "Revenue the hotel can confirm from the official website path.",
    definitionTh: "รายได้ที่โรงแรมยืนยันได้จากเส้นทางเว็บไซต์ทางการ",
    hideUntilData: true,
    dataStatus: "sample" as DirectBookingKpiStatus,
    tone: "amber" as const,
  },
] as const;

export function directBookingKpiShowsComplete(kpi: {
  hideUntilData?: boolean;
  dataStatus?: string;
  value?: string;
}) {
  if (kpi.hideUntilData) return false;
  if (kpi.dataStatus !== "approved" && kpi.dataStatus !== "anonymised") return false;
  return Boolean(String(kpi.value || "").trim());
}

export function directBookingKpiIsPublic(kpi: {
  group?: string;
  hideUntilData?: boolean;
  dataStatus?: string;
  name?: string;
  period?: string;
  unit?: string;
  definition?: string;
  value?: string;
}) {
  if (kpi.group === "complete") return directBookingKpiShowsComplete(kpi);
  if (kpi.hideUntilData) return false;
  if (kpi.dataStatus === "draft") return false;
  if (kpi.dataStatus !== "approved" && kpi.dataStatus !== "anonymised") return false;
  if (!String(kpi.name || "").trim() || !String(kpi.period || "").trim()) return false;
  if (!String(kpi.unit || "").trim() && !String(kpi.definition || "").trim()) return false;
  return Boolean(String(kpi.value || "").trim());
}

export function directBookingSampleLabel(locale: Locale) {
  return locale === "th" ? "ตัวอย่างข้อมูล" : "Sample data";
}

export function directBookingShowsSampleBadge(status?: string) {
  return status === "placeholder" || status === "replace" || status === "sample" || !status;
}

export function directBookingKpiStatusLabel(status: DirectBookingKpiStatus, locale: Locale) {
  if (locale === "th") {
    if (status === "approved") return "อนุมัติแล้ว";
    if (status === "anonymised") return "ไม่ระบุชื่อโรงแรม";
    if (status === "sample") return "ตัวอย่างข้อมูล";
    return "ยังไม่เผยแพร่";
  }
  if (status === "approved") return "Approved";
  if (status === "anonymised") return "Anonymised";
  if (status === "sample") return "Sample";
  return "Draft";
}

export const DIRECT_BOOKING_ENQUIRY_RECEIVE = [
  {
    id: "website-mobile",
    title: "Website and Mobile Review",
    th: "ตรวจเว็บไซต์และมือถือว่าลูกค้าหาข้อมูลห้องพัก ปุ่มดำเนินการ และหน้าสำคัญได้หรือไม่ ไม่ใช่คะแนนเว็บไซต์",
    en: "Review the website and phone layout for room facts, action buttons, and key pages. Not a website score",
  },
  {
    id: "room-offer-policy",
    title: "Room/Offer/Policy Information Review",
    th: "ตรวจข้อมูลห้องพัก ข้อเสนอ ราคา และนโยบายที่ลูกค้าต้องรู้ก่อนจอง ไม่ใช่การรับรองว่าจองสำเร็จ",
    en: "Review room, offer, price, and policy facts guests need before they book. Not a completed-booking result",
  },
  {
    id: "cta-path",
    title: "CTA and Conversion Path Review",
    th: "ตรวจปุ่มและเส้นทางจากหน้าเว็บไปเริ่มจอง การคลิกจองยังไม่ใช่การจองสำเร็จ",
    en: "Review buttons and the path from the website toward a booking start. A Book click is not a completed booking",
  },
  {
    id: "engine-handoff",
    title: "Booking Engine Handoff Review",
    th: "ตรวจการส่งต่อไป Booking Engine ว่าข้อมูลวันที่ ห้องพัก และข้อเสนอยังต่อเนื่องหรือขาดช่วง",
    en: "Review the handoff into the Booking Engine, including whether dates, rooms, and offers stay consistent",
  },
  {
    id: "tracking-ready",
    title: "Tracking Readiness Assessment",
    th: "ประเมินว่าวัด Visit, Room Interest, Booking Start และ Booking Complete ได้แค่ไหนจากระบบที่มี Booking Complete แสดงได้เมื่อระบบยืนยัน",
    en: "Assess whether Visit, Room Interest, Booking Start, and Booking Complete can be measured from the current setup. Booking Complete is shown only when the engine can confirm it",
  },
  {
    id: "priority-next",
    title: "Priority Recommendation and Next Action",
    th: "สรุปจุดที่ควรแก้ก่อน ข้อมูลที่ต้องใช้ และก้าวถัดไป โดยยังไม่สัญญายอดจองหรืออัตราแปลง",
    en: "Summarise what to fix first, the information still needed, and the next action. No promised booking volume or conversion rate",
  },
] as const;

export function directBookingEnquiryCopy(locale: Locale) {
  const thai = locale === "th";
  return {
    kicker: "Direct Booking",
    heading: thai ? "คุยเรื่องการจองตรงและ Conversion" : "Talk about direct booking and conversion",
    lead: thai
      ? "เริ่มทบทวนการจองตรงด้วยลิงก์เว็บไซต์และ Booking Engine ทีมจะดูเว็บไซต์ มือถือ ข้อมูลห้องพัก CTA เส้นทางจอง และการวัดผลที่มีอยู่ แล้วสรุปจุดที่ควรแก้ก่อน"
      : "Start a Direct Booking review with the website and Booking Engine URLs. The team will look at the website, mobile use, room facts, CTAs, the booking path, and current tracking, then summarise what to fix first.",
    note: thai ? "ไม่จำเป็นต้องสร้างเว็บใหม่ก่อน เริ่มจากเส้นทางจองที่มีอยู่แล้วได้" : "You do not need a new website first. The work can start from the booking path you already have.",
    submit: thai ? "ให้ทีมตรวจเส้นทางจองบนเว็บไซต์" : "Ask the team to review the booking path",
    receiveTitle: thai ? "โรงแรมจะได้อะไรจากการเริ่มทบทวนการจองตรง" : "What the hotel receives from starting a Direct Booking review",
    nextTitle: thai ? "ขั้นตอนถัดไป" : "What Happens Next",
    loading: thai ? "กำลังส่งข้อมูล กรุณารอสักครู่" : "Sending your message. Please wait.",
    labels: {
      name: thai ? "ชื่อผู้ติดต่อ" : "Contact name",
      business: thai ? "ชื่อโรงแรม / บริษัท" : "Hotel / company name",
      contact: thai ? "อีเมลหรือเบอร์โทร" : "Email / phone",
      consent: thai
        ? "ข้าพเจ้ายินยอมให้ เดอะ เคพีไอ พลัส ใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับคำขอนี้ ตาม"
        : "I agree that The KPI Plus may use this information to reply about this request, under the",
      privacy: thai ? "นโยบายความเป็นส่วนตัว" : "Privacy Policy",
    },
    fields: {
      website: thai ? "Website URL" : "Website URL",
      websiteHint: thai ? "หน้าเว็บที่ลูกค้าเข้าชมก่อนจอง" : "The website guests open before they book",
      websiteInvalid: thai ? "ใส่ลิงก์เว็บไซต์ให้ถูกต้อง" : "Enter a valid website URL",
      bookingEngine: thai ? "Booking Engine URL" : "Booking Engine URL",
      bookingEngineHint: thai ? "หน้าหรือระบบที่ลูกค้ากดจองเข้าไป ไม่ต้องส่งรหัสหรือคีย์" : "The page or engine guests enter to book. Do not send credentials or keys.",
      bookingEngineInvalid: thai ? "ใส่ลิงก์ Booking Engine ให้ถูกต้อง" : "Enter a valid Booking Engine URL",
      goal: thai ? "เป้าหมาย" : "Goal",
      goalEmpty: thai ? "เลือกเป้าหมาย" : "Choose a goal",
      goalDirect: "Direct Booking",
      goalReview: "Conversion Review",
      goalWebsite: "Website Improvement",
      analytics: thai ? "สถานะ Analytics" : "Analytics status",
      analyticsEmpty: thai ? "เลือกสถานะ Analytics" : "Choose analytics status",
      analyticsYes: thai ? "มีแล้ว" : "In place",
      analyticsNo: thai ? "ยังไม่มี" : "Not in place",
      analyticsUnsure: thai ? "ไม่แน่ใจ" : "Not sure",
      tracking: thai ? "สถานะ Conversion Tracking" : "Conversion tracking status",
      trackingEmpty: thai ? "เลือกสถานะ Conversion Tracking" : "Choose conversion tracking status",
      trackingYes: thai ? "มีแล้ว" : "In place",
      trackingNo: thai ? "ยังไม่มี" : "Not in place",
      trackingUnsure: thai ? "ไม่แน่ใจ" : "Not sure",
      concern: thai ? "ความท้าทายปัจจุบัน" : "Current challenge",
      concernHint: thai ? "จุดที่ลูกค้าหยุดก่อนจอง หรือสิ่งที่อยากให้ทีมดูก่อน" : "Where guests stop before they book, or what you want reviewed first",
    },
    receive: DIRECT_BOOKING_ENQUIRY_RECEIVE.map((item) => ({
      id: item.id,
      title: item.title,
      body: thai ? item.th : item.en,
    })),
    steps: thai
      ? [
          "ส่ง Website และ Booking Engine URL",
          "ทีมตรวจ Website, Mobile, CTA และ Booking Path",
          "สรุปจุดที่ควรแก้ก่อนและข้อมูลที่ต้องใช้",
          "นัดคุย Scope, Tracking และ Next Action",
        ]
      : [
          "Send the Website and Booking Engine URLs",
          "The team reviews the website, mobile layout, CTAs, and booking path",
          "Summarise what to fix first and the information still needed",
          "Schedule a talk on scope, tracking, and the next action",
        ],
  };
}

export type DirectBookingRelatedCard = {
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
  dateKind?: "published" | "updated";
  contentTypeTh: string;
  contentTypeEn: string;
  readingTimeMinutes?: number;
  ctaTh: string;
  ctaEn: string;
};

export function directBookingRelatedTypeLabel(card: DirectBookingRelatedCard, locale: Locale) {
  const type = locale === "th" ? card.contentTypeTh : card.contentTypeEn;
  if (!card.readingTimeMinutes) return type;
  const minutes = locale === "th" ? "นาที" : "min read";
  return `${type} · ${card.readingTimeMinutes} ${minutes}`;
}

export function directBookingRelatedDateLabel(card: DirectBookingRelatedCard, locale: Locale) {
  const iso = card.dateKind === "updated" ? card.updatedAt || card.publishedAt : card.publishedAt;
  if (!iso) return "";
  const prefix = card.dateKind === "updated" ? (locale === "th" ? "อัปเดต" : "Updated") : locale === "th" ? "เผยแพร่" : "Published";
  return `${prefix} ${formatInsightDate(iso, locale)}`;
}

export function directBookingRelatedCards(locale: Locale): DirectBookingRelatedCard[] {
  const pageUpdated = "2026-10-28";
  const journey = insightPosts.find((post) => post.id === "direct-booking-journey-audit" && post.isPublished !== false);
  const seoSem = insightPosts.find((post) => post.id === "seo-vs-sem-for-hotels-which-one-should-you-focus-on" && post.isPublished !== false);
  const used = new Set<string>();
  const cards: DirectBookingRelatedCard[] = [];
  const push = (card: DirectBookingRelatedCard | null) => {
    if (!card || used.has(card.href) || !existingHref(card.href, locale)) return;
    used.add(card.href);
    cards.push(card);
  };

  push({
    id: "search-health",
    href: "/tools/hotel-searchability-check",
    featured: true,
    categoryTh: "Website Search Health",
    categoryEn: "Website Search Health",
    titleTh: "ตรวจสุขภาพการค้นหาเว็บไซต์",
    titleEn: "Hotel searchability check",
    descriptionTh: "ดูว่าหน้าเว็บพร้อมให้ลูกค้าหาข้อมูลห้องพักและเดินทางไปจองต่อหรือไม่ ไม่ใช่ผลอันดับหรือยอดจอง",
    descriptionEn: "See whether the pages are ready for a guest to find room facts and continue toward a booking. Not a ranking or booking result.",
    updatedAt: pageUpdated,
    dateKind: "updated",
    contentTypeTh: "เครื่องมือ",
    contentTypeEn: "Tool",
    ctaTh: "ใช้เครื่องมือฟรี",
    ctaEn: "Use the free tool",
  });

  if (journey) {
    push({
      id: "direct-booking",
      href: journey.href,
      categoryTh: "Direct Booking",
      categoryEn: "Direct Booking",
      titleTh: journey.title.th,
      titleEn: journey.title.en,
      descriptionTh: insightExcerpt(journey, "th"),
      descriptionEn: insightExcerpt(journey, "en"),
      publishedAt: journey.publishedAt,
      updatedAt: insightUpdatedAt(journey) || undefined,
      dateKind: insightUpdatedAt(journey) ? "updated" : "published",
      contentTypeTh: "บทความ",
      contentTypeEn: "Article",
      readingTimeMinutes: journey.readingTimeMinutes,
      ctaTh: "อ่านบทความ",
      ctaEn: "Read article",
    });
  }

  push({
    id: "website-design",
    href: "/solutions/hotel-website-design",
    categoryTh: "Hotel Website Design",
    categoryEn: "Hotel Website Design",
    titleTh: "ออกแบบเว็บไซต์โรงแรม",
    titleEn: "Hotel website design",
    descriptionTh: "ดูหน้า Room Detail, เส้นทางมือถือ และเนื้อหาที่ลูกค้าใช้ก่อนจอง หากโครงสร้างเดิมจำกัดการแก้ไข อาจเป็นงานถัดไป ไม่ใช่ผลจอง",
    descriptionEn: "Review the Room Detail Page, mobile conversion path, and the facts guests need before they book. If the current structure limits the change, this may be next. Not a booking result.",
    updatedAt: pageUpdated,
    dateKind: "updated",
    contentTypeTh: "โซลูชัน",
    contentTypeEn: "Solution",
    ctaTh: "ดูโซลูชัน",
    ctaEn: "View solution",
  });

  push({
    id: "booking-engine",
    href: "/solutions/hotel-systems-implementation",
    categoryTh: "Booking Engine",
    categoryEn: "Booking Engine",
    titleTh: "การส่งต่อไป Booking Engine",
    titleEn: "Booking Engine handoff",
    descriptionTh: "ดูว่าเว็บไซต์ส่งลูกค้าเข้าสู่ระบบจองอย่างไร รวมถึง Conversion Tracking เมื่อระบบส่งอีเวนต์ยืนยันได้ การคลิกจองยังไม่ใช่การจองสำเร็จ",
    descriptionEn: "See how the website hands guests to the Booking Engine, including Conversion Tracking when the engine can send a confirmed event. A Book click is not a completed booking.",
    updatedAt: pageUpdated,
    dateKind: "updated",
    contentTypeTh: "โซลูชัน",
    contentTypeEn: "Solution",
    ctaTh: "ดูโซลูชัน",
    ctaEn: "View solution",
  });

  if (seoSem) {
    push({
      id: "seo-paid-path",
      href: seoSem.href,
      categoryTh: "SEO and Paid Traffic to Booking Path",
      categoryEn: "SEO and Paid Traffic to Booking Path",
      titleTh: seoSem.title.th,
      titleEn: seoSem.title.en,
      descriptionTh: insightExcerpt(seoSem, "th"),
      descriptionEn: insightExcerpt(seoSem, "en"),
      publishedAt: seoSem.publishedAt,
      updatedAt: insightUpdatedAt(seoSem) || undefined,
      dateKind: insightUpdatedAt(seoSem) ? "updated" : "published",
      contentTypeTh: "บทความ",
      contentTypeEn: "Article",
      readingTimeMinutes: seoSem.readingTimeMinutes,
      ctaTh: "อ่านบทความ",
      ctaEn: "Read article",
    });
  }

  push({
    id: "hotel-seo",
    href: "/solutions/hotel-seo-google-maps-ai-search",
    categoryTh: "SEO and Paid Traffic to Booking Path",
    categoryEn: "SEO and Paid Traffic to Booking Path",
    titleTh: "SEO, Google Maps และ AI Search",
    titleEn: "SEO, Google Maps and AI Search",
    descriptionTh: "เมื่อผลค้นพาคนมาที่เว็บไซต์ หน้าเว็บควรตอบสิ่งที่กำลังหาและพาไปเส้นทางจองต่อได้ ไม่ใช่ผลอันดับที่การันตี",
    descriptionEn: "When search sends people to the website, the page should answer what they are looking for and continue into the booking path. Not a guaranteed ranking result.",
    updatedAt: pageUpdated,
    dateKind: "updated",
    contentTypeTh: "โซลูชัน",
    contentTypeEn: "Solution",
    ctaTh: "ดูโซลูชัน",
    ctaEn: "View solution",
  });

  push({
    id: "google-ads",
    href: "/solutions/google-ads-management",
    categoryTh: "SEO and Paid Traffic to Booking Path",
    categoryEn: "SEO and Paid Traffic to Booking Path",
    titleTh: "Google Ads สำหรับโรงแรม",
    titleEn: "Google Ads for hotels",
    descriptionTh: "เมื่อโฆษณาพาคนมาที่เว็บไซต์ หน้า Landing ควรต่อเนื่องกับข้อเสนอและเส้นทางจอง การคลิกโฆษณายังไม่ใช่การจองสำเร็จ",
    descriptionEn: "When ads send people to the website, the landing page should continue the offer into the booking path. An ad click is not a completed booking.",
    updatedAt: pageUpdated,
    dateKind: "updated",
    contentTypeTh: "โซลูชัน",
    contentTypeEn: "Solution",
    ctaTh: "ดูโซลูชัน",
    ctaEn: "View solution",
  });

  return cards;
}

export const DIRECT_BOOKING_FAQS = {
  th: [
    {
      q: "ต้องมี Website และ Booking Engine อยู่แล้วหรือไม่",
      a: "งานเริ่มจากเว็บไซต์และระบบจองที่มีอยู่ ไม่จำเป็นต้องสร้างใหม่ก่อน หากยังไม่มี Booking Engine ที่เชื่อมกับเว็บได้ ทีมจะบอกขอบเขตที่ตรวจและวัดได้จริง การปรับเว็บไซต์ขึ้นกับเนื้อหา การใช้บนมือถือ Booking Engine คุณภาพทราฟฟิก ข้อเสนอ และการวัดผล หน้านี้ไม่สัญญายอดจองหรืออัตราแปลง",
    },
    {
      q: "ถ้าใช้ OTA เป็นหลัก ควรเริ่มปรับ Direct Booking จากจุดใด",
      a: "เริ่มจากเส้นทางบนเว็บไซต์ปัจจุบัน ตรวจ Message Match ข้อมูลห้องพัก ราคาและนโยบาย ปุ่มจองบนมือถือ และการส่งต่อไป Booking Engine OTA ยังใช้ต่อได้ หน้านี้ไม่สัญญาว่าจะย้ายยอดจาก OTA มาจองตรงในระยะเวลาที่กำหนด",
    },
    {
      q: "ตรวจได้หรือไม่ว่าลูกค้าหลุดจากขั้นตอนไหน",
      a: "ตรวจเส้นทางจองได้ และวัดขั้นเข้าชมเว็บ สนใจห้องพัก และเริ่มจองได้เมื่อโรงแรมอนุญาตให้ใช้ Analytics การคลิกปุ่มจองยังไม่ใช่ยอดจองสำเร็จ จุดที่หลุดหลังเริ่มจองจะไม่ถูกรายงานเป็น Booking Complete Booking Complete ใช้เมื่อมีแหล่งข้อมูลที่ยืนยันการจองสำเร็จและโรงแรมอนุมัติแล้วเท่านั้น",
    },
    {
      q: "ถ้า Booking Engine ไม่ส่งข้อมูลกลับ จะวัดอะไรได้บ้าง",
      a: "วัดได้เฉพาะขั้นที่เว็บไซต์และ Analytics รองรับ เช่น เข้าชมเว็บ เปิดหน้าห้องพัก และคลิกเริ่มจอง การคลิกปุ่มจองยังไม่ใช่ Booking Complete และจะไม่รายงานยอดจองสำเร็จจนกว่าจะมีแหล่งข้อมูลที่ตรวจสอบได้และโรงแรมอนุมัติ",
    },
    {
      q: "รองรับ Mobile และหลายภาษาหรือไม่",
      a: "งานตรวจดูเส้นทางจองบนมือถือเป็นหลัก หลายภาษาทำได้เมื่อโรงแรมมีเนื้อหาภาษานั้นอยู่แล้ว ทีมไม่แต่งคำแปลที่ยังไม่มี และไม่รับรองว่าทุกภาษาจะได้ผลเท่ากัน",
    },
    {
      q: "ใครเป็นผู้อนุมัติราคา Promotion และ Cancellation Policy",
      a: "โรงแรมเป็นผู้อนุมัติราคา โปรโมชัน และนโยบายยกเลิก ระบบจองเป็นผู้ส่งราคาที่ได้รับอนุญาต เดอะ เคพีไอ พลัส อาจแนะนำวิธีแสดงข้อมูลบนเว็บ แต่ไม่ตั้งราคาหรือนโยบายแทนโรงแรม",
    },
    {
      q: "Website เดิมควรปรับหรือสร้างใหม่",
      a: "ไม่จำเป็นต้องสร้างใหม่ทุกครั้ง หาก CMS เดิมแก้ได้ ใช้บนมือถือได้ และเชื่อม Booking Engine ได้ อาจเริ่มจากการปรับเนื้อหา หน้าห้องพัก หรือเส้นทางจอง การตัดสินใจดูหลักฐานของระบบที่มี การปรับเว็บไซต์ขึ้นกับเนื้อหา มือถือ Booking Engine คุณภาพทราฟฟิก ข้อเสนอ และการวัดผล ไม่ได้รับรองยอดจองหรือระยะเวลาแล้วเสร็จ",
    },
    {
      q: "ใครเป็นผู้ดูแล Tracking และ Booking Data",
      a: "โรงแรมเป็นเจ้าของ Analytics และข้อมูลการจอง ผู้ให้บริการ Booking Engine ดูแลการส่งข้อมูลกลับ เดอะ เคพีไอ พลัส อาจช่วยออกแบบการวัดผลเมื่อได้รับสิทธิ์ โรงแรมเป็นผู้อนุมัติการเข้าถึง Booking Complete ใช้ได้เมื่อมีแหล่งข้อมูลที่ตรวจสอบและอนุมัติแล้ว",
    },
    {
      q: "การคลิกปุ่มจองถือเป็นยอดจองหรือไม่",
      a: "ไม่ใช่ การคลิกปุ่มจองคือ Booking Start ไม่ใช่ Booking Complete ยอดจองสำเร็จต้องมาจากแหล่งข้อมูลที่ตรวจสอบได้และโรงแรมอนุมัติ เช่น callback, API หรืออีเวนต์จาก Booking Engine ห้ามใช้ยอดคลิกแทนยอดจอง",
    },
    {
      q: "เชื่อมกับ Google Ads และ SEO ได้หรือไม่",
      a: "เชื่อมได้ในแง่เส้นทางจากโฆษณาหรือหน้าค้นหาไปยังหน้าห้องพักและหน้าจอง งานนี้ดู Message Match และจุดที่ลูกค้าหยุด ไม่สัญญายอดคลิก อันดับค้นหา อัตราแปลง หรือจำนวนการจอง",
    },
    {
      q: "สามารถตรวจ Room Detail และ Booking Engine ได้หรือไม่",
      a: "ได้ งานตรวจดูหน้าห้องพัก ราคา นโยบาย และการส่งต่อไป Booking Engine ว่าข้อมูลตรงกันหรือไม่ การคลิกจองจากหน้าห้องยังไม่ใช่ยอดจองสำเร็จ หากระบบไม่ส่งข้อมูลกลับ จะวัดได้แค่ขั้นก่อนจองสำเร็จ",
    },
  ],
  en: [
    {
      q: "Do we already need a website and a Booking Engine?",
      a: "The work starts from the current website and booking system. A new site is not required first. If there is no Booking Engine that can connect to the website, the team states what can actually be reviewed and measured. Website changes depend on content, mobile use, the Booking Engine, traffic quality, the offer, and measurement. This page does not promise booking volume or a conversion rate.",
    },
    {
      q: "If we mainly use OTAs, where should Direct Booking work start?",
      a: "Start on the current website path: Message Match, room facts, price and policy, the Book button on a phone, and the handoff to the Booking Engine. OTAs can stay in use. This page does not promise to move OTA volume to direct bookings on a set timeline.",
    },
    {
      q: "Can you see which step guests drop off?",
      a: "The booking path can be reviewed. Website Visit, Room Interest, and Booking Start can be measured when the hotel approves analytics. A Book click is not a completed booking. Drop-off after Booking Start is not reported as Booking Complete. Booking Complete is used only when a verifiable, approved completion source exists.",
    },
    {
      q: "If the Booking Engine does not send data back, what can still be measured?",
      a: "Only the steps the website and analytics can support, such as site visits, room-page views, and Booking Start clicks. A Book click is not Booking Complete. Completed bookings are not reported until a verifiable source exists and the hotel approves it.",
    },
    {
      q: "Does this cover mobile and more than one language?",
      a: "The review looks at the booking path on a phone first. More languages are possible when the hotel already has that content. Missing translations are not invented, and this page does not claim the same result in every language.",
    },
    {
      q: "Who approves rates, promotions, and the cancellation policy?",
      a: "The hotel approves rates, promotions, and cancellation terms. The Booking Engine sends the rates it is allowed to send. The KPI Plus may advise how to show this on the website. It does not set prices or policies for the hotel.",
    },
    {
      q: "Should we improve the current website or build a new one?",
      a: "A rebuild is not always needed. If the current CMS can be edited, works on a phone, and can connect to the Booking Engine, the team may first change content, room pages, or the booking path. The choice comes from the current system. Website improvement depends on content, mobile experience, the Booking Engine, traffic quality, the offer, and measurement. This page does not promise booking volume or a delivery date.",
    },
    {
      q: "Who looks after tracking and booking data?",
      a: "The hotel owns analytics and booking data. The Booking Engine provider controls callbacks. The KPI Plus may help design measurement when access is granted. The hotel approves access. Booking Complete is used only with a verifiable, approved data source.",
    },
    {
      q: "Is a Book click a completed booking?",
      a: "No. A Book click is Booking Start, not Booking Complete. A completed booking needs a verifiable, hotel-approved source such as a Booking Engine callback, API, or event. Click counts must not be used as booking counts.",
    },
    {
      q: "Can this connect with Google Ads and SEO?",
      a: "Yes, as a path from ads or search results to room and booking pages. The work reviews Message Match and where guests stop. It does not promise clicks, search rank, a conversion rate, or booking volume.",
    },
    {
      q: "Can you review Room Detail and the Booking Engine?",
      a: "Yes. The review checks room pages, rates, policy, and whether the handoff to the Booking Engine stays consistent. A Book click from a room page is still not a completed booking. If the engine does not send data back, measurement stops before Booking Complete.",
    },
  ],
} as const;

export function hotelDirectBookingFaqs(locale: Locale): { q: string; a: string }[] {
  const rows = locale === "th" ? DIRECT_BOOKING_FAQS.th : DIRECT_BOOKING_FAQS.en;
  return rows.map((item) => ({ q: item.q, a: item.a }));
}

export function hotelDirectBookingFaqsAreStale(faqs: { q: string }[]) {
  if (!faqs.length) return true;
  const questions = faqs.map((item) => item.q.trim());
  const legacy = questions.some(
    (question) =>
      question === "ต้องออกแบบเว็บไซต์ใหม่ก่อนหรือไม่?" ||
      question === "Do we need a new website first?" ||
      question === "Conversion หมายถึงยอดจองอย่างเดียวหรือไม่?" ||
      question === "Does conversion mean we only look at bookings?" ||
      question === "ต้อง Redesign เว็บไซต์ก่อนหรือไม่?" ||
      question === "What does website conversion focus on?",
  );
  return legacy;
}

export const DIRECT_BOOKING_HANDOVER_FIELDS = [
  "websiteOwner",
  "bookingEngineOwner",
  "analyticsOwner",
  "domainOwner",
  "hostingOwner",
  "externalAccountOwner",
] as const;

export type DirectBookingHandoverField = (typeof DIRECT_BOOKING_HANDOVER_FIELDS)[number];

export const DIRECT_BOOKING_HANDOVER_LABEL: Record<DirectBookingHandoverField, { th: string; en: string }> = {
  websiteOwner: { th: "เจ้าของเว็บไซต์", en: "Website owner" },
  bookingEngineOwner: { th: "เจ้าของบัญชีระบบจอง", en: "Booking-engine account owner" },
  analyticsOwner: { th: "เจ้าของ Analytics", en: "Analytics owner" },
  domainOwner: { th: "เจ้าของโดเมน", en: "Domain owner" },
  hostingOwner: { th: "เจ้าของโฮสติ้ง", en: "Hosting owner" },
  externalAccountOwner: { th: "เจ้าของบัญชีภายนอก", en: "External-account owner" },
};
