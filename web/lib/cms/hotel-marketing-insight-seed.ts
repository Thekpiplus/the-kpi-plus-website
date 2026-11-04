/**
 * Seed for the structured Hotel Marketing insight.
 *
 * Thai body text is lifted verbatim from `content/pages/insights/hotel-marketing.md`; titles, labels, alts and
 * captions that already exist (in `insights.ts`, `insight-links.ts` and the HotelMarketing* React components) are
 * carried over in both languages. English article body is intentionally left empty — it has not been authored and
 * must not be invented (`translation.enEnabled = false`, `translation.enReady = false`).
 */
import { insightPosts, insightsIndexCopy, insightHeadingId } from "@/lib/insights";
import { relatedServiceLinks } from "@/lib/insight-links";
import { insightSlotForSlug } from "@/lib/insights-media";
import { SITE } from "@/lib/seo";
import {
  HOTEL_MARKETING_ROUTE,
  HOTEL_MARKETING_SLUG,
  emptyLocaleText,
  emptyVisual,
  type CmsHmMetric,
  type CmsHmSection,
  type CmsHmSource,
  type CmsHmStrategy,
  type CmsHmVisual,
  type CmsHotelMarketingInsight,
  type HmClaimStatus,
  type HmSectionType,
  type LocaleText,
} from "./hotel-marketing-insight";

const ACCESSED_AT = "2026-11-04";
const COVER_PLACEHOLDER = "/images/insights/hotel-marketing-cover-placeholder.webp";

function lt(th: string, en = ""): LocaleText {
  return { th, en };
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Diagram visuals (labels / alts / captions exist in the current React diagram components)                       */
/* ------------------------------------------------------------------------------------------------------------ */

type DiagramDef = { label: string; alt: LocaleText; caption: LocaleText };

const SAMPLE_ROLES_CAPTION =
  "Sample roles diagram — collaboration focus areas only; not a universal org chart or ownership of all results";
const SAMPLE_READINESS_CAPTION = "Sample readiness checklist — general guidance only; not an automated hotel audit";

const DIAGRAMS: Record<string, DiagramDef> = {
  seo: {
    label: "Search Result / SEO Structure — Sample",
    alt: lt(
      "แผนภาพตัวอย่างโครงสร้าง SEO ที่หน้าเว็บตอบคำค้น อธิบายโรงแรม และชี้ทางไปจอง ไม่ใช่ผลงานลูกค้า",
      "Sample SEO structure diagram: a hotel page answers a search question, explains the property, and points toward booking. Not a client result.",
    ),
    caption: emptyLocaleText(),
  },
  gbp: {
    label: "Google Business Profile Example — Sample",
    alt: lt(
      "แผนภาพตัวอย่างรายการตรวจสอบ Google Business Profile สำหรับโรงแรม ไม่ใช่ผลงานลูกค้า",
      "Sample Google Business Profile checklist for hotels. Not a client result.",
    ),
    caption: emptyLocaleText(),
  },
  ota: {
    label: "OTA Listing Quality Checklist — Sample",
    alt: lt(
      "แผนภาพตัวอย่างรายการตรวจสอบคุณภาพ OTA Listing สำหรับโรงแรม ไม่ใช่ผลงานลูกค้า",
      "Sample OTA listing quality checklist for hotels. Not a client result.",
    ),
    caption: emptyLocaleText(),
  },
  direct: {
    label: "Direct Booking Journey — Sample",
    alt: lt(
      "แผนภาพตัวอย่างเส้นทาง Direct Booking จาก Landing Page ถึง Confirmation พร้อมจุดตรวจบนมือถือ ไม่ใช่ผลงานลูกค้า",
      "Sample Direct Booking journey from Landing Page to Confirmation with mobile checks. Not a client result.",
    ),
    caption: emptyLocaleText(),
  },
  social: {
    label: "Hotel Social Content Pillars — Sample",
    alt: lt(
      "แผนภาพตัวอย่าง Content Pillars สำหรับ Social Media ของโรงแรม ไม่ใช่ผลงานลูกค้า",
      "Sample hotel social content pillar matrix. Not a client result.",
    ),
    caption: emptyLocaleText(),
  },
  ads: {
    label: "Hotel Advertising Funnel — Sample",
    alt: lt(
      "แผนภาพตัวอย่าง Hotel Advertising Funnel จาก Audience/Intent ถึง Conversion/ROAS Review ไม่ใช่ผลงานลูกค้า",
      "Sample hotel advertising funnel from Audience/Intent to Conversion/ROAS Review. Not a client result.",
    ),
    caption: emptyLocaleText(),
  },
  review: {
    label: "Review-to-Operations Loop — Sample",
    alt: lt(
      "แผนภาพตัวอย่าง Review-to-Operations Loop จาก Review ถึง Review Again พร้อมธีม Feedback ที่ไม่ระบุตัวตน ไม่ใช่รีวิวลูกค้าจริง",
      "Sample Review-to-Operations Loop from Review to Review Again with anonymized feedback themes. Not real guest reviews.",
    ),
    caption: lt(
      "ตัวอย่างกระบวนการแบบไม่ระบุตัวตน — ไม่ใช่รีวิวผู้เข้าพักจริง และไม่มีชื่อหรือรายละเอียดที่ระบุตัวตน",
      "Anonymized sample process — not real guest reviews, and no names or identifying details.",
    ),
  },
  revenue: {
    label: "Marketing × Revenue Management Flow — Sample",
    alt: lt(
      "แผนภาพตัวอย่าง Marketing × Revenue Management Flow จาก Demand ถึงการทบทวนผลร่วมกัน พร้อมป้ายบทบาท ไม่ใช่ผลงานลูกค้า",
      "Sample Marketing × Revenue Management Flow from Demand through joint performance review, with role labels. Not a client result.",
    ),
    caption: lt(
      "แผนภาพตัวอย่างการประสานงาน — Marketing และ Revenue Management ทำงานร่วมกัน แต่บทบาทไม่เหมือนกัน และไม่รับประกันรายได้",
      "Sample collaboration diagram — Marketing and Revenue Management coordinate, but roles differ, and revenue lift is not guaranteed.",
    ),
  },
  channel: {
    label: "Hotel Marketing Channel Map — Sample",
    alt: lt(
      "แผนภาพตัวอย่างช่องทาง Hotel Marketing จาก Awareness ถึง Post-stay ไม่ใช่ผลงานลูกค้า",
      "Sample Hotel Marketing channel map from awareness to post-stay. Not a client result.",
    ),
    caption: emptyLocaleText(),
  },
  journey: {
    label: "Hotel Guest Decision Journey — Sample",
    alt: lt(
      "แผนภาพตัวอย่างเส้นทางตัดสินใจของผู้เข้าพัก Discover ถึง Review/Return ไม่ใช่ผลงานลูกค้า",
      "Sample guest decision journey from Discover to Review/Return. Not a client result.",
    ),
    caption: emptyLocaleText(),
  },
  kpi: {
    label: "Hotel Marketing KPI Map — Sample Data",
    alt: lt(
      "แผนภาพตัวอย่าง Hotel Marketing KPI Map จัดกลุ่มตัวชี้วัดตามคำถามทางธุรกิจ ไม่มีค่าตัวเลขสมมติ",
      "Sample Hotel Marketing KPI Map grouping metrics by business question with no invented values",
    ),
    caption: lt(
      "Sample Data / Template — ไม่ใช่ผลงานลูกค้า และไม่มีค่าที่ถูกสร้างขึ้น",
      "Sample Data / Template — not a client result and no fabricated values",
    ),
  },
  swimlane: {
    label: "Marketing and Revenue Management Roles — Sample",
    alt: lt(
      "แผนภาพตัวอย่างบทบาท Marketing และ Revenue Management แบบ Swimlane แสดงการร่วมมือ ไม่ใช่การแข่งขัน",
      "Sample Marketing and Revenue Management swimlane showing collaboration rather than competition",
    ),
    caption: lt(SAMPLE_ROLES_CAPTION, SAMPLE_ROLES_CAPTION),
  },
  roadmap: {
    label: "Hotel Marketing Readiness Checklist — Sample",
    alt: lt(
      "แผนภาพตัวอย่าง Hotel Marketing Readiness Checklist ห้าขั้นตอน Start Here ไม่ใช่การ audit อัตโนมัติ",
      "Sample Hotel Marketing Readiness Checklist with a five-step Start Here roadmap. Not an automated audit.",
    ),
    caption: lt(SAMPLE_READINESS_CAPTION, SAMPLE_READINESS_CAPTION),
  },
};

function diagramVisual(diagramId: string): CmsHmVisual {
  const def = DIAGRAMS[diagramId];
  if (!def) return emptyVisual(diagramId);
  return {
    ...emptyVisual(diagramId),
    label: def.label,
    alt: { ...def.alt },
    caption: { ...def.caption },
    status: "sample",
    permissionStatus: "not_applicable",
    assetSource: "Native HTML/SVG diagram (no photo)",
  };
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Thai body copy — verbatim from content/pages/insights/hotel-marketing.md                                       */
/* ------------------------------------------------------------------------------------------------------------ */

const TH = {
  title: "การตลาดโรงแรม (Hotel Marketing) คืออะไร? 8 กลยุทธ์เชื่อมการค้นพบจนถึงการจอง",
  excerpt:
    "การตลาดโรงแรมคือการเชื่อม Google, OTA, Website, Direct Booking, Distribution และ Revenue Management ให้ผู้เข้าพักค้นพบ เปรียบเทียบ และเลือกจองด้วยข้อมูลที่ชัดเจน โดยไม่รับประกันยอดจองหรือรายได้",
  introCallout:
    "โรงแรมที่มีห้องพักสวยและบริการดีอาจยังไม่ได้รับการเลือก หากผู้เข้าพักค้นหาไม่เจอ หรือยังไม่เห็นเหตุผลที่ชัดพอในการจอง การตลาดโรงแรมจึงไม่ใช่เพียงการโปรโมต แต่คือการออกแบบเส้นทางตั้งแต่การค้นพบจนถึงการจองและรายได้ โดยไม่รับประกันผลลัพธ์ยอดจองหรือรายได้",
  introBody:
    "ในทางปฏิบัติ Hotel Marketing ควรเชื่อมการตลาด การจัดจำหน่าย Direct Booking และ Revenue Management เพื่อให้ทีมเห็นว่าอุปสงค์เกิดจากที่ใด ผู้เข้าพักตัดสินใจอย่างไร และช่องทางใดควรได้รับการดูแลต่อ",
  startQuestions: [
    "กลุ่มลูกค้าหลักของโรงแรมคือใคร",
    "จุดขายของโรงแรมชัดเจนหรือไม่",
    "Google และ OTA มีข้อมูลครบและน่าเชื่อถือหรือไม่",
    "เว็บไซต์ช่วยให้เกิด Direct Booking ได้ดีเพียงใด",
    "ราคา โปรโมชั่น และ Distribution สอดคล้องกับ Demand หรือไม่",
  ],
  definitionHeading: "การตลาดโรงแรม คืออะไร?",
  definitionBody: [
    "การตลาดโรงแรม คือการทำให้กลุ่มผู้เข้าพักที่เหมาะสมค้นพบ สนใจ เปรียบเทียบ ตัดสินใจจอง และมีเหตุผลที่จะกลับมาใช้บริการอีกครั้ง โดยใช้ข้อมูล เนื้อหา ช่องทาง และประสบการณ์ที่สอดคล้องกัน",
    "จุดที่ผู้เข้าพักอาจพบโรงแรมมีหลายจุด เช่น Google Search, Google Maps, เว็บไซต์โรงแรม, OTA, Social Media, Online Advertising, Email หรือ CRM, Metasearch และ Travel Agents หรือ B2B Partners โรงแรมไม่จำเป็นต้องใช้ทุกช่องทาง — สิ่งสำคัญคือช่องทางที่ใช้จริงควรส่งต่อข้อมูลและความมั่นใจไปยังขั้นถัดไปของการตัดสินใจ",
  ].join("\n\n"),
  whyHeading: "ทำไมการตลาดโรงแรมจึงสำคัญ?",
  whyBody: [
    "เส้นทางของผู้เข้าพักอาจเริ่มจาก Social Media แล้วไปค้นหาบน Google ดู Google Maps และรีวิว เปรียบเทียบผ่าน OTA ก่อนกลับมาที่เว็บไซต์โรงแรมเพื่อดูราคา ห้องพัก และเงื่อนไขการจอง การตัดสินใจจึงไม่ได้เกิดจากช่องทางเดียว",
    "เมื่อทีมมองเส้นทางทั้งหมดร่วมกัน จะเห็นได้ชัดขึ้นว่าควรแก้เรื่องการค้นพบ ข้อมูล ข้อเสนอ หรือเส้นทางการจองตรงไหนก่อน แทนที่จะเพิ่มงบหรือทำแคมเปญโดยยังไม่รู้จุดติดขัด",
  ].join("\n\n"),
  strategiesHeading: "8 กลยุทธ์การตลาดโรงแรมที่ควรให้ความสำคัญ",
  metricsHeading: "ตัวเลขอะไรที่โรงแรมควรวัด?",
  metricsIntro: [
    "ตัวเลขที่เกี่ยวข้องอาจรวมถึง Website Traffic, Booking Engine Conversion, Direct Booking, OTA Production, Occupancy, ADR, RevPAR, Revenue by Channel, Cost of Acquisition, Advertising ROAS, Cancellation Rate, Length of Stay และ Review Score",
    "ชื่อตัวชี้วัดเหล่านี้เป็นชื่อที่ใช้ภายในโรงแรมโดยทั่วไป ไม่ใช่ตัวเลขวิจัยจากแหล่งภายนอกในบทความนี้ คำนิยาม แหล่งข้อมูล และช่วงเวลาควรอ้างอิงจาก PMS, Booking Engine, OTA extranet หรือรายงานโฆษณาที่โรงแรมตรวจสอบได้",
    "ไม่จำเป็นต้องติดตามทุกตัวเลขในทุกช่วงเวลา เริ่มจากเลือกตัวชี้วัดที่ตอบคำถามว่าช่องทางใดนำผู้เข้าพักมาถึงไหน และมีจุดใดในเส้นทางที่ควรปรับก่อน",
  ].join("\n\n"),
  metricsNoteTh:
    "แผนภาพนี้เป็น Template / Sample Data — ไม่มีค่าตัวเลขสมมติ และไม่สรุปว่า Marketing เพียงอย่างเดียวทำให้ Occupancy หรือรายได้เปลี่ยน",
  metricsNoteEn:
    "This diagram is Template / Sample Data — no invented values, and it does not imply marketing alone caused occupancy or revenue changes.",
  compareHeading: "การตลาดโรงแรมกับ Revenue Management ต่างกันอย่างไร?",
  compareBody: [
    "Hotel Marketing มีหน้าที่สร้าง Demand และทำให้ผู้เข้าพักค้นพบ สนใจ และเลือกโรงแรม ส่วน Revenue Management บริหารราคา Inventory และ Distribution เพื่อสร้างรายได้ที่เหมาะสมจาก Demand นั้น",
    "สองงานไม่ควรถูกแยกออกจากกัน เพราะแคมเปญที่ดีต้องเชื่อมกับข้อเสนอและความพร้อมขาย ขณะที่การตัดสินใจด้านราคาและช่องทางก็ควรอาศัยบริบทของความต้องการในตลาด",
  ].join("\n\n"),
  startHeading: "โรงแรมควรเริ่มทำการตลาดจากตรงไหน?",
  startIntro: "เริ่มด้วยการตอบคำถามพื้นฐานให้ชัดก่อนลงทุนเพิ่ม:",
  startClosing:
    "หลายครั้งปัญหาไม่ได้เกิดจากคนไม่เห็นโรงแรม แต่อาจเกิดจากคนเห็นแล้วแต่ยังไม่เลือกโรงแรม เพราะข้อมูล ข้อเสนอ หรือขั้นตอนจองยังไม่ตอบสิ่งที่ผู้เข้าพักต้องการ",
  conclusionHeading: "สรุป: การตลาดโรงแรมไม่ใช่แค่การโปรโมต แต่คือการสร้างรายได้อย่างเป็นระบบ",
  conclusionBody: [
    "Hotel Marketing ไม่ได้จำกัดอยู่แค่ Paid Advertising ผู้เข้าพักมักใช้หลาย Touchpoint ก่อนจอง ดังนั้น Channels, Website, Direct Booking, Distribution, บริบท Revenue และ Guest Experience ควรพิจารณาควบคู่กัน",
    "เลือกตัวชี้วัดเพื่อตอบคำถามทางธุรกิจที่เฉพาะเจาะจง และเริ่มจากคอขวดปัจจุบันของโรงแรม แทนที่จะเพิ่มทุกช่องทางพร้อมกัน",
    "Google, OTA, Website, Social Media, Direct Booking, Distribution และ Revenue Management ควรทำงานเป็นระบบเดียวกัน เป้าหมายไม่ใช่การอยู่ทุกช่องทาง แต่คือการเข้าใจว่าผู้เข้าพักพบโรงแรมที่ใด เหตุใดจึงเลือก ช่องทางใดนำไปสู่การจอง และช่องทางใดสร้างรายได้ที่เหมาะสมกับโรงแรม",
    "เดอะ เคพีไอ พลัส ช่วยโรงแรมอิสระวิเคราะห์ Performance และโอกาสในการเพิ่มรายได้ ตั้งแต่ Revenue Management, Pricing, Distribution, Direct Booking ไปจนถึง Online Visibility เพื่อให้ทีมเห็นชัดขึ้นว่าอะไรควรปรับ และช่องทางใดควรได้รับการทบทวนก่อน",
    "ตัวอย่างเชิงปฏิบัติ: เริ่มจากกำหนดคำถามทางธุรกิจ ข้อมูลที่เกี่ยวข้อง และผู้รับผิดชอบการทบทวน ก่อนเลือกการเปลี่ยนแปลงที่ทีมสามารถติดตามได้",
  ].join("\n\n"),
} as const;

/** Recap points already shown in HotelMarketingSummaryRecap (TH + EN exist). */
const CONCLUSION_POINTS: Array<{ th: string; en: string }> = [
  {
    th: "Hotel Marketing ครอบคลุมมากกว่า Paid Advertising",
    en: "Hotel Marketing includes more than paid advertising",
  },
  { th: "ผู้เข้าพักใช้หลาย Touchpoint ก่อนจอง", en: "Guests use multiple touchpoints before booking" },
  {
    th: "Channels, Website, Direct Booking, Distribution, บริบท Revenue และ Guest Experience ควรพิจารณาควบคู่กัน",
    en: "Channels, website, direct booking, distribution, revenue context, and guest experience should be considered together",
  },
  {
    th: "เลือกตัวชี้วัดเพื่อตอบคำถามทางธุรกิจที่เฉพาะเจาะจง",
    en: "Choose metrics to answer a specific business question",
  },
  {
    th: "เริ่มจากคอขวดปัจจุบันของโรงแรม แทนการเพิ่มทุกช่องทางพร้อมกัน",
    en: "Start with the hotel’s current bottleneck instead of adding every channel at once",
  },
];

/* ------------------------------------------------------------------------------------------------------------ */
/* Strategies                                                                                                   */
/* ------------------------------------------------------------------------------------------------------------ */

type StrategySeed = { diagramId: string; titleTh: string; bodyTh: string[]; sourceIds: string[] };

const STRATEGY_SEEDS: StrategySeed[] = [
  {
    diagramId: "seo",
    titleTh: "Google Search และ SEO",
    bodyTh: [
      "SEO ช่วยให้เว็บไซต์ตอบคำถามที่ผู้เข้าพักกำลังค้นหา เช่น โรงแรมภูเก็ตติดทะเล, โรงแรมสำหรับครอบครัวภูเก็ต, ที่พักใกล้หาดป่าตอง, โรงแรมใกล้สนามบินภูเก็ต หรือ Phuket long stay hotel เริ่มจากเลือกหัวข้อที่เกี่ยวข้องกับทำเล กลุ่มผู้เข้าพัก และประเภทการเดินทางของโรงแรมจริง",
      "หน้าเว็บไซต์ที่ดีควรอธิบายข้อมูลหลักได้ตรงคำถาม ไม่ควรยัดคำค้น หรือเขียนเนื้อหาคล้ายกันหลายหน้าจนผู้ใช้และระบบค้นหาแยกความต่างได้ยาก",
    ],
    sourceIds: ["google-search-central"],
  },
  {
    diagramId: "gbp",
    titleTh: "Google Business Profile และ Google Maps",
    bodyTh: [
      "Google Business Profile และ Google Maps ช่วยให้ผู้เข้าพักตรวจสอบทำเล รูปภาพ รีวิว ข้อมูลโรงแรม ลิงก์เว็บไซต์ และข้อมูลติดต่อได้รวดเร็ว ทีมควรดูแลความถูกต้องของข้อมูลที่ปรากฏเสมอ โดยเฉพาะตำแหน่งที่ตั้ง ประเภทธุรกิจ เวลาให้บริการ และลิงก์สำคัญ",
      "การมอง Local Search ควรเชื่อมกับประสบการณ์จริงของผู้เข้าพัก ไม่ใช่เพียงการเพิ่มคำค้นในชื่อธุรกิจ",
    ],
    sourceIds: ["google-business-profile"],
  },
  {
    diagramId: "ota",
    titleTh: "OTA Optimization",
    bodyTh: [
      "Booking.com และ Agoda เป็นตัวอย่าง OTA ที่ผู้เข้าพักอาจใช้เปรียบเทียบโรงแรม การจัดการรูปภาพ คำอธิบายห้อง ประเภทห้อง สิ่งอำนวยความสะดวก Rate Plans โปรโมชั่น และข้อมูลห้องว่างอย่างครบถ้วน ช่วยให้ผู้เข้าพักตัดสินใจบนข้อมูลที่เข้าใจง่ายขึ้น",
      "การเพิ่ม Conversion บน OTA ไม่ได้หมายความว่าต้องลดราคาเสมอไป บางครั้งจุดที่ควรทบทวนคือความชัดเจนของข้อเสนอ ข้อมูลห้องพัก หรือความสอดคล้องระหว่างราคาและเงื่อนไข",
    ],
    sourceIds: ["booking-partner-help", "agoda-partner-help"],
  },
  {
    diagramId: "direct",
    titleTh: "Website และ Conversion Optimization",
    bodyTh: [
      "เว็บไซต์โรงแรมไม่ควรเป็นเพียงโบรชัวร์ออนไลน์ แต่ควรตอบได้ว่าโรงแรมอยู่ที่ไหน เหมาะกับใคร ห้องพักเป็นอย่างไร จุดเด่นคืออะไร ราคาและเงื่อนไขเป็นอย่างไร และเพราะเหตุใดผู้เข้าพักจึงควรพิจารณา Direct Booking",
      "ประสบการณ์บนมือถือ ความเร็วเว็บไซต์ ปุ่ม Book Now ที่ชัดเจน Booking Engine, Trust Signals และภาพถ่ายโรงแรมจริง ล้วนมีผลต่อความมั่นใจของผู้เข้าพักก่อนเข้าสู่ขั้นตอนจอง",
    ],
    sourceIds: [],
  },
  {
    diagramId: "social",
    titleTh: "Social Media และ Content Marketing",
    bodyTh: [
      "Content ของโรงแรมสามารถเล่า Guest Experience, ห้องพัก, Food and Beverage, จุดหมายปลายทาง, Local Experiences, Wellness, เบื้องหลังการทำงาน และเรื่องราวของโรงแรมได้ เลือกสิ่งที่สะท้อนประสบการณ์จริง เพื่อให้ผู้สนใจเห็นภาพที่ใกล้เคียงกับสิ่งที่โรงแรมมอบให้",
      "เมื่อเป็นไปได้ ควรใช้ภาพถ่ายของโรงแรม ทีมงาน และประสบการณ์จริง แทนภาพ Stock ที่ไม่เกี่ยวข้องกับโรงแรม",
    ],
    sourceIds: [],
  },
  {
    diagramId: "ads",
    titleTh: "Online Advertising",
    bodyTh: [
      "Google Ads และ Meta Ads เป็นช่องทางโฆษณาที่โรงแรมอาจใช้ตามเป้าหมายและงบประมาณของตนเอง การวัดผลควรเชื่อมกับ Booking, Revenue, Conversion และ ROAS ตามข้อมูลที่โรงแรมตรวจสอบได้ ไม่ใช่ดูเพียง Click, Like หรือ Impression",
      "ก่อนเพิ่มงบ ควรตรวจว่า Landing Page ข้อเสนอ ราคา และเส้นทางไปยัง Booking Engine รองรับความคาดหวังจากโฆษณาแล้วหรือไม่",
    ],
    sourceIds: ["google-ads-help", "meta-business-help"],
  },
  {
    diagramId: "review",
    titleTh: "Reputation Management",
    bodyTh: [
      "Google Reviews และ OTA Reviews เป็นส่วนหนึ่งของการตัดสินใจ ผู้เข้าพักอาจใช้รีวิวเพื่อทำความเข้าใจประสบการณ์ก่อนจอง โรงแรมจึงควรวางแนวทางขอรีวิว ตอบรีวิว และส่งต่อ Guest Feedback ไปยังทีมปฏิบัติการเพื่อใช้พัฒนาบริการ",
      "การจัดการรีวิวที่ดีไม่ได้จบที่การตอบข้อความ แต่ควรเชื่อมกลับไปยัง Guest Experience และการปรับปรุงการดำเนินงานของโรงแรม",
    ],
    sourceIds: [],
  },
  {
    diagramId: "revenue",
    titleTh: "เชื่อม Marketing กับ Revenue Management",
    bodyTh: [
      "Marketing สร้าง Demand ขณะที่ Revenue Management ช่วยให้โรงแรมบริหารราคา Inventory และ Distribution เพื่อเปลี่ยน Demand นั้นเป็นรายได้ที่เหมาะสม ทั้งสองงานควรคุยกันเรื่อง Demand, Occupancy, ADR, Pricing, Availability, Promotions และ Distribution Channels อย่างสม่ำเสมอ",
      "เมื่อแคมเปญสร้างความสนใจเพิ่มขึ้น ทีมควรเตรียมข้อมูลห้อง ราคา และช่องทางขายให้สอดคล้อง ไม่เช่นนั้นผู้เข้าพักอาจพบเส้นทางที่ไม่ชัดหรือข้อเสนอที่ไม่พร้อมต่อการตัดสินใจ",
    ],
    sourceIds: [],
  },
];

/* ------------------------------------------------------------------------------------------------------------ */
/* Metrics (HotelMarketingKpiMap QUESTIONS + METRIC_DETAILS)                                                     */
/* ------------------------------------------------------------------------------------------------------------ */

const QUESTIONS: Record<string, LocaleText> = {
  discover: lt("ผู้เข้าพักค้นพบโรงแรมจากที่ใด", "Where do potential guests discover the property?"),
  booking: lt("ผู้สนใจไปต่อถึงการจองหรือไม่", "Do interested guests continue to booking?"),
  revenue: lt("รายได้มาจากช่องทางใด และต้นทุนเท่าใด", "Where does revenue come from and at what cost?"),
  experience: lt("สัญญาณประสบการณ์ผู้เข้าพักที่ควรทบทวน", "What guest experience signals should be reviewed?"),
};

type MetricSeed = { name: string; question: keyof typeof QUESTIONS | ""; th: string; en: string };

const METRIC_SEEDS: MetricSeed[] = [
  {
    name: "Website Traffic",
    question: "discover",
    th: "ปริมาณการเข้าชมเว็บไซต์โรงแรม (นิยามตามแหล่งข้อมูลที่โรงแรมใช้)",
    en: "Visits or sessions to the hotel website (per the hotel’s chosen analytics definition)",
  },
  {
    name: "Google Maps",
    question: "discover",
    th: "สัญญาณการค้นพบผ่าน Google Maps / Business Profile ตามข้อมูลที่ตรวจสอบได้",
    en: "Discovery signals from Google Maps / Business Profile when a verified source is available",
  },
  {
    name: "OTA Production",
    question: "discover",
    th: "ผลผลิตหรือการจองจากช่องทาง OTA ตามรายงานที่โรงแรมตรวจสอบได้",
    en: "Production or bookings from OTA channels per hotel-verified reports",
  },
  {
    name: "Booking Engine Conversion",
    question: "booking",
    th: "สัดส่วนผู้เข้าชมที่ไปถึงการจองผ่าน Booking Engine ตามนิยามที่กำหนด",
    en: "Share of visitors who complete a booking via the booking engine, under a defined conversion rule",
  },
  {
    name: "Direct Booking",
    question: "booking",
    th: "การจองตรงกับโรงแรมตามนิยามช่องทางที่ทีมตกลงกัน",
    en: "Bookings attributed as direct under the hotel’s agreed channel definition",
  },
  {
    name: "Cancellation Rate",
    question: "booking",
    th: "สัดส่วนการยกเลิกในช่วงเวลาที่กำหนด ตามแหล่งข้อมูลการจอง",
    en: "Share of cancellations in a defined period from the booking source of record",
  },
  {
    name: "Revenue by Channel",
    question: "revenue",
    th: "รายได้แยกตามช่องทางขาย ตามรายงานที่ตรวจสอบได้",
    en: "Revenue split by sales channel from verified reporting",
  },
  {
    name: "ADR",
    question: "revenue",
    th: "Average Daily Rate ตามนิยามและช่วงเวลาที่โรงแรมใช้",
    en: "Average Daily Rate under the hotel’s definition and period",
  },
  {
    name: "RevPAR",
    question: "revenue",
    th: "Revenue per Available Room ตามนิยามและช่วงเวลาที่โรงแรมใช้",
    en: "Revenue per Available Room under the hotel’s definition and period",
  },
  {
    name: "Cost of Acquisition",
    question: "revenue",
    th: "ต้นทุนการได้มาซึ่งการจองหรือลูกค้า ตามนิยามต้นทุนที่ทีมกำหนด",
    en: "Cost to acquire a booking or guest under an agreed cost definition",
  },
  {
    name: "Advertising ROAS",
    question: "revenue",
    th: "ผลตอบแทนจากโฆษณาเทียบกับรายได้ที่เชื่อมโยงได้ — ต้องมีนิยาม attribution",
    en: "Advertising return relative to attributable revenue — requires an attribution definition",
  },
  {
    name: "Review Score",
    question: "experience",
    th: "คะแนนรีวิวจากแหล่งที่ระบุ ควรอ่านคู่กับบริบทและ feedback เชิงคุณภาพ",
    en: "Review score from a named source; read with context and qualitative feedback",
  },
  // Listed under the "experience" question in the overview table; the KPI map has no separate definition for it.
  {
    name: "Qualitative feedback (with context)",
    question: "experience",
    th: "ข้อคิดเห็นเชิงคุณภาพจากรีวิวหรือ feedback ที่ทีมรวบรวม — อ่านคู่กับคะแนนและบริบท ไม่ใช่ตัวเลขเดี่ยว",
    en: "Qualitative comments from reviews or collected feedback — read with scores and context, not as a lone number",
  },
  {
    name: "Occupancy",
    question: "",
    th: "อัตราการเข้าพัก — อย่าสรุปว่าเกิดจาก Marketing เพียงอย่างเดียวหากไม่มีหลักฐาน",
    en: "Occupancy rate — do not attribute to marketing alone without suitable evidence",
  },
  {
    name: "Length of Stay",
    question: "",
    th: "ระยะเวลาเข้าพักเฉลี่ย ตามนิยามและช่วงเวลาที่โรงแรมใช้",
    en: "Average length of stay under the hotel’s definition and period",
  },
];

function metricId(name: string) {
  return `metric-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Compare lanes / start steps (HotelMarketingRoleSwimlane, HotelMarketingStartRoadmap)                          */
/* ------------------------------------------------------------------------------------------------------------ */

const LANES: Array<{ id: string; role: string; focus: string }> = [
  { id: "marketing", role: "Marketing", focus: "Visibility / Demand / Interest / Channel content" },
  { id: "revenue", role: "Revenue Management", focus: "Inventory / Availability / Pricing / Distribution decisions" },
  { id: "joint", role: "Marketing + Revenue + Operations", focus: "Review results and agree next actions" },
];

const HANDOFFS: Array<{ id: string; from: string; text: string }> = [
  { id: "signals", from: "marketing", text: "share demand and channel signals" },
  { id: "offers", from: "revenue", text: "share sellable offers and performance context" },
];

const START_STEPS: Array<{ id: string; th: string; en: string }> = [
  {
    id: "guest-proposition",
    th: "กำหนดกลุ่มลูกค้าเป้าหมายและจุดขายของโรงแรม",
    en: "Define target guest and hotel proposition",
  },
  {
    id: "visibility",
    th: "ตรวจ Search / Maps / OTA เรื่อง Visibility และความถูกต้องของข้อมูล",
    en: "Check Search / Maps / OTA visibility and information accuracy",
  },
  { id: "website-mobile", th: "ทบทวนเว็บไซต์และเส้นทางจองบนมือถือ", en: "Review website and booking path on mobile" },
  {
    id: "align",
    th: "จัดให้ Marketing, Revenue, Pricing และ Distribution สอดคล้องกัน",
    en: "Align Marketing, Revenue, Pricing, and Distribution",
  },
  {
    id: "priority-metric",
    th: "เลือกหนึ่งลำดับความสำคัญ และกำหนดตัวชี้วัดที่จะทบทวน",
    en: "Select one priority and define the metric to review",
  },
];

/* ------------------------------------------------------------------------------------------------------------ */
/* References                                                                                                   */
/* ------------------------------------------------------------------------------------------------------------ */

const REFERENCE_ID_BY_URL: Record<string, string> = {
  "https://developers.google.com/search/docs/fundamentals/seo-starter-guide": "google-search-central",
  "https://support.google.com/business/": "google-business-profile",
  "https://support.google.com/google-ads/": "google-ads-help",
  "https://www.facebook.com/business/help": "meta-business-help",
  "https://partner.booking.com/en-us/help": "booking-partner-help",
  "https://agodapropertypartnerhelp.zendesk.com/hc/en-us": "agoda-partner-help",
};

/* ------------------------------------------------------------------------------------------------------------ */
/* Builder                                                                                                      */
/* ------------------------------------------------------------------------------------------------------------ */

function section(
  type: HmSectionType,
  id: string,
  order: number,
  heading: LocaleText,
  patch: Partial<CmsHmSection> = {},
): CmsHmSection {
  const anchor = heading.th ? insightHeadingId(heading.th) : "";
  return {
    id,
    type,
    heading,
    bodyTh: "",
    bodyEn: "",
    bulletsTh: [],
    bulletsEn: [],
    visual: emptyVisual(""),
    sourceIds: [],
    tocLabel: { th: heading.th, en: heading.en },
    tocAnchor: anchor,
    showInToc: Boolean(heading.th),
    order,
    ...patch,
  };
}

export function defaultHotelMarketingInsight(): CmsHotelMarketingInsight {
  const post = insightPosts.find((item) => item.slug === HOTEL_MARKETING_SLUG);
  const slot = insightSlotForSlug(HOTEL_MARKETING_SLUG);
  const copy = insightsIndexCopy;

  const references: CmsHmSource[] = (post?.sources ?? []).map((source, index) => ({
    id: (source.url && REFERENCE_ID_BY_URL[source.url]) || `reference-${index + 1}`,
    label: lt(source.labelByLocale?.th ?? source.label, source.labelByLocale?.en ?? source.label),
    url: source.url ?? "",
    publishedAt: "",
    accessedAt: ACCESSED_AT,
    period: "",
    definition: "",
    status: "guidance",
  }));
  const referenceIds = new Set(references.map((reference) => reference.id));

  const strategies: CmsHmStrategy[] = STRATEGY_SEEDS.map((seed, index) => ({
    id: seed.diagramId,
    num: String(index + 1).padStart(2, "0"),
    title: lt(seed.titleTh),
    bodyTh: seed.bodyTh.join("\n\n"),
    bodyEn: "",
    visual: diagramVisual(seed.diagramId),
    sourceIds: seed.sourceIds.filter((id) => referenceIds.has(id)),
    order: index + 1,
  }));

  const metrics: CmsHmMetric[] = METRIC_SEEDS.map((seed, index) => {
    const status: HmClaimStatus = "sample";
    return {
      id: metricId(seed.name),
      name: seed.name,
      question: seed.question ? { ...QUESTIONS[seed.question] } : emptyLocaleText(),
      definition: lt(seed.th, seed.en),
      period: "",
      source: "",
      owner: "",
      value: "",
      status,
      order: index + 1,
    };
  });

  const thLinks = relatedServiceLinks(HOTEL_MARKETING_SLUG, "th");
  const enLinks = new Map(
    relatedServiceLinks(HOTEL_MARKETING_SLUG, "en").map((link) => [link.href.replace(/^\/en(?=\/)/, ""), link]),
  );
  const relatedServices = thLinks.map((link, index) => ({
    id: `service-${link.href.split("/").filter(Boolean).pop() ?? index + 1}`,
    href: link.href,
    why: lt(link.why ?? "", enLinks.get(link.href)?.why ?? ""),
    order: index + 1,
  }));

  const relatedArticles = (post?.relatedArticleIds ?? []).map((articleId, index) => ({
    id: `article-${index + 1}`,
    articleId,
    order: index + 1,
  }));

  const sections: CmsHmSection[] = [
    section("intro", "intro", 1, emptyLocaleText(), {
      bodyTh: TH.introBody,
      showInToc: false,
    }),
    section("definition", "definition", 2, lt(TH.definitionHeading), {
      bodyTh: TH.definitionBody,
      visual: diagramVisual("channel"),
    }),
    section("why", "why", 3, lt(TH.whyHeading), {
      bodyTh: TH.whyBody,
      visual: diagramVisual("journey"),
    }),
    section("strategies_intro", "strategies", 4, lt(TH.strategiesHeading)),
    section("metrics", "metrics", 5, lt(TH.metricsHeading), { visual: diagramVisual("kpi") }),
    section("compare", "compare", 6, lt(TH.compareHeading)),
    // The five starter questions appear once, as the numbered checklist in this section.
    section("start", "start", 7, lt(TH.startHeading), { bulletsTh: [...TH.startQuestions] }),
    section("conclusion", "conclusion", 8, lt(TH.conclusionHeading), {
      bulletsTh: CONCLUSION_POINTS.map((point) => point.th),
      bulletsEn: CONCLUSION_POINTS.map((point) => point.en),
    }),
  ];

  const cover: CmsHmVisual = {
    mode: "diagram",
    diagramId: "cover",
    src: COVER_PLACEHOLDER,
    alt: lt(post?.coverImageAlt ?? "", slot?.defaultAlt.en ?? ""),
    caption: lt("แผนภาพตัวอย่าง · ไม่ใช่ผลงานลูกค้า", "Sample visual · Not a client result"),
    label: "Hotel Marketing Guest Journey — Sample Visual",
    status: "sample",
    permissionStatus: "not_applicable",
    permissionNote: "",
    assetSource: "Native HTML guest-journey diagram over placeholder background",
  };

  const title = lt(post?.title.th ?? TH.title, post?.title.en ?? "");
  const excerpt = lt(post?.excerpt.th ?? TH.excerpt, post?.excerpt.en ?? "");

  return {
    version: 1,
    kind: "hotel-marketing-insight",
    journeyLabels: ["Visibility", "Interest", "Consideration", "Booking", "Revenue"],
    summaryCallout: lt(TH.introCallout),
    cover,
    authorName: post?.authorName ?? "The KPI Plus Editorial Team",
    authorVerified: true,
    // No reviewer is recorded for this article. Do not invent one.
    reviewerName: post?.reviewerName ?? "",
    reviewerVerified: false,
    publishedAt: post?.publishedAt ?? "2026-08-31",
    updatedAt: post?.updatedAt ?? "2026-11-04",
    readingTimeMinutes: post?.readingTimeMinutes ?? 10,
    category: lt(post?.category.th ?? "การตลาดโรงแรม", post?.category.en ?? ""),
    title,
    excerpt,
    sections,
    strategies,
    metricsIntroTh: TH.metricsIntro,
    metricsIntroEn: "",
    metricsNoteTh: TH.metricsNoteTh,
    metricsNoteEn: TH.metricsNoteEn,
    metrics,
    compare: {
      heading: lt(TH.compareHeading),
      bodyTh: TH.compareBody,
      bodyEn: "",
      visual: diagramVisual("swimlane"),
      lanes: LANES.map((lane, index) => ({
        id: lane.id,
        role: lt(lane.role, lane.role),
        focus: lt(lane.focus, lane.focus),
        order: index + 1,
      })),
      handoffs: HANDOFFS.map((handoff, index) => ({
        id: handoff.id,
        from: handoff.from,
        text: lt(handoff.text, handoff.text),
        order: index + 1,
      })),
    },
    startHere: {
      heading: lt(TH.startHeading),
      introTh: TH.startIntro,
      introEn: "",
      visual: diagramVisual("roadmap"),
      steps: START_STEPS.map((step, index) => ({
        id: step.id,
        title: lt(step.th, step.en),
        order: index + 1,
      })),
      closingTh: TH.startClosing,
      closingEn: "",
    },
    conclusion: { heading: lt(TH.conclusionHeading), bodyTh: TH.conclusionBody, bodyEn: "" },
    relatedServices,
    relatedArticles,
    cta: {
      // Matches InsightHotelMarketingEnquiry.
      title: lt("ต้องการรู้ว่าโรงแรมของคุณควรเริ่มจากตรงไหน?", "Want to know where your hotel should start?"),
      body: lt(
        "คุยกับทีมเรื่อง Search Visibility, เส้นทางจอง, ข้อมูลช่องทาง หรือลำดับความสำคัญระหว่าง Marketing กับ Revenue — เพื่อช่วยจัดลำดับสิ่งที่ควรทบทวนก่อน โดยไม่ใช่การรับประกันรายงานรายโรงแรมหรือผลลัพธ์",
        "Talk with the team about search visibility, the booking journey, channel information, or marketing/revenue priorities — to help sequence what to review first. This is not a promise of an individual hotel report or guaranteed results.",
      ),
      buttonLabel: lt("ส่งข้อความถึงทีม", "Send message to the team"),
    },
    references,
    referencesNote: lt(copy.th.sourcesNote, copy.en.sourcesNote),
    seo: {
      title: lt(post?.title.th ?? TH.title, post?.title.en ?? ""),
      description: lt(post?.excerpt.th ?? TH.excerpt, post?.excerpt.en ?? ""),
      canonical: `${SITE}${HOTEL_MARKETING_ROUTE}`,
      social: emptyVisual("cover"),
    },
    // English article body is not authored. Do not enable EN until a human has written and reviewed it.
    translation: { enEnabled: false, enReady: false, duplicateOfLocale: "" },
  };
}
