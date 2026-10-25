import { existsSync } from "fs";
import { join } from "path";
import { OCCUPANCY_SAMPLE, OCCUPANCY_SAMPLE_SERIES } from "@/lib/occupancy-sample";
import type { Locale } from "@/lib/seo";

export type DataStatus = "approved" | "anonymised" | "sample" | "draft";

export type ServiceVisual = {
  src?: string;
  alt: string;
  status: "real" | "approved" | "sample" | "placeholder";
  recommendedSize: string;
  aspectRatio: string;
};

export type KpiDefinition = {
  id: string;
  name: string;
  labelTh: string;
  definition: string;
  unit?: string;
  period: string;
  target?: string;
  dataStatus: DataStatus;
  updatedAt?: string;
  values: number[];
  labels: string[];
};

export type ProblemItem = {
  id: string;
  problem: string;
  dataToInspect: string;
  nextAction: string;
  order: number;
};

export type ConnectedArea = {
  id: string;
  number: string;
  title: string;
  description: string;
  output: string;
  href?: string;
  order: number;
};

export type DecisionStep = {
  id: string;
  number: string;
  title: string;
  description: string;
  output: string;
  order: number;
};

export type RevenuePageData = {
  visual: ServiceVisual;
  problems: ProblemItem[];
  areas: ConnectedArea[];
  steps: DecisionStep[];
  kpis: KpiDefinition[];
};

/** Approved 1600×1000 dashboard or calendar. Omit src when the file is missing; do not generate a replacement. */
const HERO_VISUAL_CANDIDATE = "/images/revenue-commercial-hero-placeholder.webp";

export const REVENUE_HERO_VISUAL = {
  recommendedSize: "1600 × 1000 px",
  ratio: "8 / 5",
  fit: "contain" as const,
  width: 1600,
  height: 1000,
  displayWidth: 560,
  displayHeight: 350,
  alt: {
    th: "ตัวอย่าง Revenue และ Commercial Dashboard",
    en: "Sample Revenue and Commercial Dashboard",
  },
  label: {
    th: "ตัวอย่าง Revenue & Commercial Dashboard",
    en: "Sample Revenue & Commercial Dashboard",
  },
  meta: {
    th: "ตัวอย่างข้อมูล · Revenue, Demand and Channel view",
    en: "Sample data · Revenue, Demand and Channel view",
  },
} as const;

export function heroVisualUrl() {
  const relative = HERO_VISUAL_CANDIDATE.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? HERO_VISUAL_CANDIDATE : undefined;
}

const WEEK_LABELS = [...OCCUPANCY_SAMPLE_SERIES.labels];
const FORECAST_VALUES = [...OCCUPANCY_SAMPLE_SERIES.forecast];
const PACE_VALUES = [...OCCUPANCY_SAMPLE_SERIES.pace];

const STATUS_LABEL = {
  th: {
    approved: "ข้อมูลที่อนุมัติแล้ว",
    anonymised: "ข้อมูลที่ไม่ระบุชื่อ",
    sample: "ตัวอย่างข้อมูล",
    draft: "รอข้อมูลโรงแรม",
  },
  en: {
    approved: "Approved data",
    anonymised: "Anonymised data",
    sample: "Sample data",
    draft: "Awaiting hotel data",
  },
} as const;

const META_LABEL = {
  th: { inspect: "ดูข้อมูล", next: "ทำต่อ", output: "ผลที่ได้" },
  en: { inspect: "Inspect", next: "Next", output: "Output" },
} as const;

const PROBLEM_VISUAL_CANDIDATE = "/images/revenue-commercial-problem-evidence-placeholder.webp";

export const REVENUE_PROBLEM_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 480,
  displayHeight: 320,
  alt: {
    th: "ตัวอย่าง Revenue Calendar และ Demand Review",
    en: "Sample Revenue Calendar / Demand Review",
  },
  label: {
    th: "ตัวอย่าง Revenue Calendar / Demand Review",
    en: "Sample Revenue Calendar / Demand Review",
  },
  caption: {
    th: "ตัวอย่างข้อมูลที่ใช้ตรวจสอบช่วงวันที่ ราคา และช่องทางขาย",
    en: "Sample data used to review dates, rates, and selling channels",
  },
} as const;

export function problemVisualUrl() {
  const relative = PROBLEM_VISUAL_CANDIDATE.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? PROBLEM_VISUAL_CANDIDATE : undefined;
}

const SERVICE_MAP_VISUAL_CANDIDATE = "/images/revenue-commercial-service-map-placeholder.webp";

export const REVENUE_SERVICE_MAP_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  label: "ตัวอย่าง Service Architecture — Replace with approved diagram",
} as const;

export function serviceMapVisualUrl() {
  const relative = SERVICE_MAP_VISUAL_CANDIDATE.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? SERVICE_MAP_VISUAL_CANDIDATE : undefined;
}

const DECISION_FLOW_VISUAL_CANDIDATE = "/images/revenue-commercial-decision-flow-placeholder.webp";

export const REVENUE_DECISION_FLOW_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 640,
  displayHeight: 360,
  label: "ตัวอย่าง Decision Flow — Sample workflow",
} as const;

export function decisionFlowVisualUrl() {
  const relative = DECISION_FLOW_VISUAL_CANDIDATE.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? DECISION_FLOW_VISUAL_CANDIDATE : undefined;
}

const KPI_TREND_VISUAL_CANDIDATE = "/images/revenue-commercial-kpi-trend-placeholder.webp";

export const REVENUE_KPI_TREND_VISUAL = {
  recommendedSize: "1600 × 900 px",
  ratio: "16 / 9",
  width: 1600,
  height: 900,
  displayWidth: 720,
  displayHeight: 405,
  label: "KPI trend chart · Sample data",
} as const;

export function kpiTrendVisualUrl() {
  const relative = KPI_TREND_VISUAL_CANDIDATE.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? KPI_TREND_VISUAL_CANDIDATE : undefined;
}

const RELATED_VISUAL_CANDIDATE = "/images/revenue-commercial-related-content-placeholder.webp";

export const REVENUE_RELATED_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 520,
  displayHeight: 347,
  label: "ตัวอย่าง Revenue Review Content",
  topics: [
    "Revenue Meeting",
    "Rate Review",
    "Report Review",
    "Direct Booking Audit",
    "Channel Performance Snapshot",
  ],
} as const;

export function relatedContentVisualUrl() {
  const relative = RELATED_VISUAL_CANDIDATE.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? RELATED_VISUAL_CANDIDATE : undefined;
}

const CONSULTANT_VISUAL_CANDIDATE = "/images/revenue-commercial-consultant-placeholder.webp";

export const REVENUE_CONSULTANT_VISUAL = {
  recommendedSize: "1200 × 800 px",
  ratio: "3 / 2",
  width: 1200,
  height: 800,
  displayWidth: 420,
  displayHeight: 280,
  label: "Replace with verified team / consultation image",
} as const;

export function consultantVisualUrl() {
  const relative = CONSULTANT_VISUAL_CANDIDATE.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? CONSULTANT_VISUAL_CANDIDATE : undefined;
}

const DIAGNOSTIC_VISUAL = {
  recommendedSize: REVENUE_PROBLEM_VISUAL.recommendedSize,
  aspectRatio: REVENUE_PROBLEM_VISUAL.ratio,
} as const;

function byOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order);
}

export function revenueDataStatusLabel(status: DataStatus, locale: Locale) {
  return locale === "th" ? STATUS_LABEL.th[status] : STATUS_LABEL.en[status];
}

export function revenueMetaLabel(locale: Locale) {
  return locale === "th" ? META_LABEL.th : META_LABEL.en;
}

export function kpiHasSeries(kpi: KpiDefinition) {
  return kpi.dataStatus !== "draft" && kpi.values.length > 0 && kpi.labels.length === kpi.values.length;
}

export function kpiLatest(kpi: KpiDefinition) {
  if (!kpi.values.length) return null;
  return kpi.values[kpi.values.length - 1];
}

export function kpiContextLines(kpi: KpiDefinition, locale: Locale) {
  const lines: string[] = [];
  const unit = kpi.unit?.trim();
  if (locale === "th") {
    lines.push(unit ? `หน่วย ${unit} · ${kpi.period}` : kpi.period);
    if (kpi.target) lines.push(`เทียบกับ ${kpi.target}`);
  } else {
    lines.push(unit ? `Unit: ${unit} · ${kpi.period}` : kpi.period);
    if (kpi.target) lines.push(`Compared with ${kpi.target}`);
  }
  return lines;
}

const occupancyKpi = (definition: string, period: string, target: string): KpiDefinition => ({
  id: "occupancy",
  name: "Occupancy",
  labelTh: "อัตราการเข้าพัก",
  definition,
  unit: "%",
  period,
  target,
  dataStatus: "sample",
  values: FORECAST_VALUES,
  labels: WEEK_LABELS,
});

const paceKpi = (definition: string, period: string, target: string): KpiDefinition => ({
  id: "booking-pace",
  name: "Booking Pace",
  labelTh: "ความเร็วของยอดจอง",
  definition,
  unit: "%",
  period,
  target,
  dataStatus: "sample",
  values: PACE_VALUES,
  labels: WEEK_LABELS,
});

const draftKpi = (
  id: string,
  name: KpiDefinition["name"],
  labelTh: string,
  definition: string,
  period: string,
): KpiDefinition => ({
  id,
  name,
  labelTh,
  definition,
  period,
  dataStatus: "draft",
  values: [],
  labels: [],
});

const th: RevenuePageData = {
  visual: {
    alt: REVENUE_PROBLEM_VISUAL.alt.th,
    status: "placeholder",
    recommendedSize: DIAGNOSTIC_VISUAL.recommendedSize,
    aspectRatio: DIAGNOSTIC_VISUAL.aspectRatio,
  },
  problems: [
    {
      id: "full-nights-low-rate",
      problem: "ห้องพักเต็มหลายคืน แต่ราคาไม่ขยับ",
      dataToInspect: "Occupancy และ ADR ในวันที่ขายเต็ม",
      nextAction: "กำหนดช่วงวันที่ควรปรับราคา",
      order: 1,
    },
    {
      id: "open-dates",
      problem: "มีห้องว่างบางช่วง แต่ยังไม่รู้ว่าควรขยับราคา โปรโมชัน หรือช่องทาง",
      dataToInspect: "Booking Pace และ Pickup ตามวัน",
      nextAction: "เลือกการกระทำสำหรับวันที่ยอดจองช้า",
      order: 2,
    },
    {
      id: "ota-net",
      problem: "OTA สร้างยอดจอง แต่ยังไม่เห็นรายได้หลังหักต้นทุน",
      dataToInspect: "ยอดจอง ค่าคอมมิชชัน และสัดส่วนแต่ละช่องทาง",
      nextAction: "จัดสัดส่วนช่องทางตามรายได้หลังต้นทุน",
      order: 3,
    },
    {
      id: "direct-path",
      problem: "อยากได้การจองตรงมากขึ้น แต่เส้นทางจองยังไม่เชื่อมกัน",
      dataToInspect: "เว็บไซต์ ระบบจอง และการตลาดที่ส่งแขกเข้ามา",
      nextAction: "ปิดจุดที่ทำให้แขกจองตรงไม่สำเร็จ",
      order: 4,
    },
    {
      id: "split-data",
      problem: "ข้อมูลกระจายหลายระบบ ยังไม่มีแผนที่ทีมใช้ตัดสินใจได้",
      dataToInspect: "PMS, Channel Manager, Booking Engine และรายงานปัจจุบัน",
      nextAction: "รวมเป็นมุมมองที่ทีมใช้ลงมือได้",
      order: 5,
    },
    {
      id: "shared-goal",
      problem: "ทีมขาย การตลาด และปฏิบัติการทำงานหนัก แต่ยังไม่มีเป้าหารายได้ร่วม",
      dataToInspect: "ตัวเลขรายได้ที่แต่ละทีมดูอยู่ตอนนี้",
      nextAction: "กำหนดตัวเลขและรอบทบทวนร่วมกัน",
      order: 6,
    },
  ],
  areas: [
    {
      id: "revenue-management",
      number: "01",
      title: "Revenue Management",
      description: "วิเคราะห์ Demand ราคา และห้องว่าง\nเพื่อวางแผนราคา โปรโมชัน และการขายให้เหมาะกับแต่ละช่วง",
      output: "Pricing & Demand Action",
      order: 1,
    },
    {
      id: "distribution",
      number: "02",
      title: "Distribution และ OTA",
      description: "ดูช่องทางขาย ต้นทุน ค่าคอมมิชชัน\nและประสิทธิภาพของแต่ละ OTA เพื่อจัดสัดส่วนการขายให้เหมาะสม",
      output: "Channel Mix Review",
      order: 2,
    },
    {
      id: "direct-booking",
      number: "03",
      title: "Direct Booking",
      description: "ดูตั้งแต่เว็บไซต์ ระบบจอง ไปจนถึงข้อเสนอและการตลาด\nเพื่อเพิ่มโอกาสให้ลูกค้าจองตรง",
      output: "Conversion Improvement Plan",
      href: "/solutions/hotel-direct-bookings",
      order: 3,
    },
    {
      id: "marketing-demand",
      number: "04",
      title: "Marketing และ Demand",
      description: "เชื่อมแผนการตลาดกับวันที่โรงแรมต้องการยอดจอง\nเพื่อให้สื่อและงบโฆษณาทำงานตามเป้าหมายรายได้",
      output: "Campaign / Demand Alignment",
      href: "/solutions/google-ads-management",
      order: 4,
    },
    {
      id: "systems-data",
      number: "05",
      title: "Systems, Data และ Reporting",
      description: "เชื่อมข้อมูลจาก PMS, Channel Manager, Booking Engine และรายงาน\nให้ทีมเห็นภาพเดียวกันและตัดสินใจได้เร็วขึ้น",
      output: "Single Performance View",
      href: "/solutions/hotel-systems-implementation",
      order: 5,
    },
  ],
  steps: [
    {
      id: "see-hotel",
      number: "01",
      title: "ดูภาพรวมโรงแรม",
      description: "ดูราคา ห้องว่าง ยอดจอง ช่องทางขาย เว็บไซต์ ระบบ\nและวิธีทำงานของทีม",
      output: "Revenue Snapshot",
      order: 1,
    },
    {
      id: "find-gap",
      number: "02",
      title: "หาจุดที่เสียโอกาส",
      description: "หาให้ชัดว่ารายได้หายตรงไหน\nเช่น ราคาขายต่ำ วันที่ยอดจองช้า ต้นทุนช่องทางสูง\nหรือขั้นตอนการจองไม่ลื่น",
      output: "Opportunity List",
      order: 2,
    },
    {
      id: "set-scope",
      number: "03",
      title: "กำหนดขอบเขตและแผนงาน",
      description: "เลือกว่าจะเริ่มจาก Revenue Management\nหรือให้ทีมช่วยดูหลายส่วนในภาพรวม Commercial Management",
      output: "Action Plan 30 / 60 / 90 วัน",
      order: 3,
    },
    {
      id: "act-review",
      number: "04",
      title: "ลงมือและทบทวนผล",
      description: "กำหนดสิ่งที่ต้องทำ ผู้รับผิดชอบ และตัวเลขที่ใช้ติดตาม\nแล้วปรับแผนจากผลลัพธ์จริง",
      output: "KPI Review และ Next Action",
      order: 4,
    },
  ],
  kpis: [
    occupancyKpi("อัตราการเข้าพัก", "มุมมอง 60 วัน", `เป้า ${OCCUPANCY_SAMPLE.target}%`),
    draftKpi("adr", "ADR", "ราคาขายเฉลี่ย", "ราคาขายเฉลี่ย", "ตามรอบรายงานของโรงแรม"),
    draftKpi("revpar", "RevPAR", "รายได้ต่อห้องที่ขาย", "รายได้ต่อห้องที่ขาย", "ตามรอบรายงานของโรงแรม"),
    paceKpi("ความเร็วของยอดจอง", `สัปดาห์ที่ ${OCCUPANCY_SAMPLE.weekCount} ของมุมมอง 60 วัน`, `เป้า Occupancy ${OCCUPANCY_SAMPLE.target}%`),
  ],
};

const en: RevenuePageData = {
  visual: {
    alt: REVENUE_PROBLEM_VISUAL.alt.en,
    status: "placeholder",
    recommendedSize: DIAGNOSTIC_VISUAL.recommendedSize,
    aspectRatio: DIAGNOSTIC_VISUAL.aspectRatio,
  },
  problems: [
    {
      id: "full-nights-low-rate",
      problem: "Many nights are full, but the rate does not move",
      dataToInspect: "Occupancy and ADR on sold-out dates",
      nextAction: "Name the dates that should change rate",
      order: 1,
    },
    {
      id: "open-dates",
      problem: "Some dates still have rooms, and it is unclear whether to change the rate, the offer, or the channel",
      dataToInspect: "Booking pace and pickup by date",
      nextAction: "Choose the action for slow-booking dates",
      order: 2,
    },
    {
      id: "ota-net",
      problem: "OTAs create bookings, but revenue after cost is still unclear",
      dataToInspect: "Bookings, commission, and mix by channel",
      nextAction: "Set channel mix from revenue after cost",
      order: 3,
    },
    {
      id: "direct-path",
      problem: "The hotel wants more direct bookings, but the booking path is not connected",
      dataToInspect: "Website, booking system, and marketing that send guests in",
      nextAction: "Close the points that stop a direct booking",
      order: 4,
    },
    {
      id: "split-data",
      problem: "Data sits in several systems, with no plan the team can run",
      dataToInspect: "PMS, channel manager, booking engine, and current reports",
      nextAction: "Turn the data into one view the team can act on",
      order: 5,
    },
    {
      id: "shared-goal",
      problem: "Sales, marketing, and operations work hard, but they do not share one revenue goal",
      dataToInspect: "The revenue numbers each team reviews today",
      nextAction: "Name the shared numbers and the review rhythm",
      order: 6,
    },
  ],
  areas: [
    {
      id: "revenue-management",
      number: "01",
      title: "Revenue Management",
      description: "Review forward bookings, market demand, rates, and rooms, then plan which dates should hold rate, change rate, or change the offer.",
      output: "Pricing & Demand Action",
      order: 1,
    },
    {
      id: "distribution",
      number: "02",
      title: "Distribution and OTA",
      description: "See which channels the hotel sells through, what each channel books, what it costs, and how rooms or offers should be allocated.",
      output: "Channel Mix Review",
      order: 2,
    },
    {
      id: "direct-booking",
      number: "03",
      title: "Direct Booking",
      description: "Check the path from the website, Google, or marketing through to the booking system and the reply, and find the points that make a direct booking easier.",
      output: "Conversion Improvement Plan",
      href: "/solutions/hotel-direct-bookings",
      order: 3,
    },
    {
      id: "marketing-demand",
      number: "04",
      title: "Marketing and Demand",
      description: "Connect the marketing plan to the dates the hotel actually needs to sell, whether that is Google search, ads, content, or a promotion, chosen from the hotel’s readiness and goal.",
      output: "Campaign / Demand Alignment",
      href: "/solutions/google-ads-management",
      order: 4,
    },
    {
      id: "systems-data",
      number: "05",
      title: "Systems, Data and Reporting",
      description: "See whether the PMS, channel manager, booking engine, and current reports help the team decide, then organise the data so the result and the next action are visible.",
      output: "Single Performance View",
      href: "/solutions/hotel-systems-implementation",
      order: 5,
    },
  ],
  steps: [
    {
      id: "see-hotel",
      number: "01",
      title: "See the hotel as a whole",
      description: "Rates, rooms, bookings, channels, the website, the systems, and how the team works.",
      output: "Revenue Snapshot",
      order: 1,
    },
    {
      id: "find-gap",
      number: "02",
      title: "Find the missed chance",
      description: "Rooms that sold too fast, dates that still sell slowly, high channel cost, or a direct-booking path that is hard to finish.",
      output: "Opportunity List",
      order: 2,
    },
    {
      id: "set-scope",
      number: "03",
      title: "Set the scope and the plan",
      description: "Choose whether to start with Revenue Management or have the team look after several Commercial Management parts together.",
      output: "Action Plan 30 / 60 / 90 days",
      order: 3,
    },
    {
      id: "act-review",
      number: "04",
      title: "Act and review",
      description: "Name the work, the owner, and the numbers used to review, then adjust the plan from the real situation.",
      output: "KPI Review and Next Action",
      order: 4,
    },
  ],
  kpis: [
    occupancyKpi("Room occupancy", "60-day outlook", `${OCCUPANCY_SAMPLE.target}% target`),
    draftKpi("adr", "ADR", "ราคาขายเฉลี่ย", "Average daily rate", "Hotel reporting period"),
    draftKpi("revpar", "RevPAR", "รายได้ต่อห้องที่มีขาย", "Revenue per available room", "Hotel reporting period"),
    paceKpi(
      "Forward booking speed",
      `Week ${OCCUPANCY_SAMPLE.weekCount} of 60-day outlook`,
      `${OCCUPANCY_SAMPLE.target}% Occupancy target`,
    ),
  ],
};

const ru: RevenuePageData = {
  visual: en.visual,
  problems: [
    {
      id: "full-nights-low-rate",
      problem: "Много ночей занято, но средняя цена всё ещё низкая",
      dataToInspect: en.problems[0].dataToInspect,
      nextAction: en.problems[0].nextAction,
      order: 1,
    },
    {
      id: "open-dates",
      problem: "На часть дат есть номера, и непонятно, менять цену, предложение или канал",
      dataToInspect: en.problems[1].dataToInspect,
      nextAction: en.problems[1].nextAction,
      order: 2,
    },
    {
      id: "ota-net",
      problem: "OTA дают брони, но доход после затрат всё ещё неясен",
      dataToInspect: en.problems[2].dataToInspect,
      nextAction: en.problems[2].nextAction,
      order: 3,
    },
    {
      id: "direct-path",
      problem: "Хочется больше прямых броней, но сайт, путь бронирования и маркетинг не связаны",
      dataToInspect: en.problems[3].dataToInspect,
      nextAction: en.problems[3].nextAction,
      order: 4,
    },
    {
      id: "split-data",
      problem: "Данные лежат в разных системах, и никто не собрал их в план, который команда может выполнить",
      dataToInspect: en.problems[4].dataToInspect,
      nextAction: en.problems[4].nextAction,
      order: 5,
    },
    {
      id: "shared-goal",
      problem: "Продажи, маркетинг и операции работают много, но общей цели по доходу нет",
      dataToInspect: en.problems[5].dataToInspect,
      nextAction: en.problems[5].nextAction,
      order: 6,
    },
  ],
  areas: [
    {
      ...en.areas[0],
      description: "Смотреть бронь вперёд, спрос, цену и номера, затем планировать, какие даты держать цену, менять цену или менять предложение.",
    },
    {
      ...en.areas[1],
      title: "Дистрибуция и OTA",
      description: "Видеть, через какие каналы отель продаёт, какие брони даёт каждый канал, сколько это стоит и как распределять номера или предложения.",
    },
    {
      ...en.areas[2],
      description: "Проверить путь с сайта, Google или маркетинга до системы брони и ответа и найти места, где прямую бронь сделать проще.",
    },
    {
      ...en.areas[3],
      title: "Маркетинг и спрос",
      description: "Связать план маркетинга с датами, которые отелю реально нужно продавать: поиск в Google, реклама, контент или акция — по готовности и цели отеля.",
    },
    {
      ...en.areas[4],
      title: "Системы, данные и отчётность",
      description: "Понять, помогают ли PMS, channel manager, booking engine и текущие отчёты команде решать, затем собрать данные так, чтобы был виден результат и следующий шаг.",
    },
  ],
  steps: [
    {
      ...en.steps[0],
      title: "Посмотреть отель целиком",
      description: "Цена, номера, брони, каналы, сайт, системы и как работает команда.",
    },
    {
      ...en.steps[1],
      title: "Найти упущенный шанс",
      description: "Номера, которые ушли слишком быстро, даты, которые ещё продаются медленно, дорогой канал или неудобный путь прямой брони.",
    },
    {
      ...en.steps[2],
      title: "Задать границы и план",
      description: "Выбрать, начинать с Revenue Management или вести несколько частей Commercial Management вместе.",
    },
    {
      ...en.steps[3],
      title: "Действовать и разбирать результат",
      description: "Назвать работу, ответственного и цифры для проверки, затем скорректировать план по реальной ситуации.",
    },
  ],
  kpis: [
    occupancyKpi("Загрузка", "60-day outlook", `${OCCUPANCY_SAMPLE.target}% target`),
    draftKpi("adr", "ADR", "ราคาขายเฉลี่ย", "Средняя цена", "Hotel reporting period"),
    draftKpi("revpar", "RevPAR", "รายได้ต่อห้องที่มีขาย", "Доход на доступный номер", "Hotel reporting period"),
    paceKpi("Скорость брони вперёд", `Week ${OCCUPANCY_SAMPLE.weekCount} of 60-day outlook`, `${OCCUPANCY_SAMPLE.target}% Occupancy target`),
  ],
};

const zh: RevenuePageData = {
  visual: en.visual,
  problems: [
    {
      id: "full-nights-low-rate",
      problem: "很多晚上都客滿，平均房價卻仍然偏低",
      dataToInspect: en.problems[0].dataToInspect,
      nextAction: en.problems[0].nextAction,
      order: 1,
    },
    {
      id: "open-dates",
      problem: "某些日期還有空房，卻不確定該調價格、方案還是通路",
      dataToInspect: en.problems[1].dataToInspect,
      nextAction: en.problems[1].nextAction,
      order: 2,
    },
    {
      id: "ota-net",
      problem: "OTA 帶來預訂，卻還看不清扣掉成本後剩多少收益",
      dataToInspect: en.problems[2].dataToInspect,
      nextAction: en.problems[2].nextAction,
      order: 3,
    },
    {
      id: "direct-path",
      problem: "想增加直銷預訂，但網站、預訂系統與行銷還沒連在一起",
      dataToInspect: en.problems[3].dataToInspect,
      nextAction: en.problems[3].nextAction,
      order: 4,
    },
    {
      id: "split-data",
      problem: "資料散在多個系統，沒有人把它整理成團隊做得到的計畫",
      dataToInspect: en.problems[4].dataToInspect,
      nextAction: en.problems[4].nextAction,
      order: 5,
    },
    {
      id: "shared-goal",
      problem: "業務、行銷與營運都很忙，卻還沒有共同的收益目標",
      dataToInspect: en.problems[5].dataToInspect,
      nextAction: en.problems[5].nextAction,
      order: 6,
    },
  ],
  areas: [
    {
      ...en.areas[0],
      description: "分析未來預訂、市場需求、價格與空房，規劃哪些日期該守價、調價或改方案。",
    },
    {
      ...en.areas[1],
      title: "通路與 OTA",
      description: "看飯店透過哪些通路賣、各通路帶來什麼預訂、成本多少，以及空房或方案該怎麼分配。",
    },
    {
      ...en.areas[2],
      description: "檢查從網站、Google 或行銷，走到預訂系統與回覆的路徑，找出讓客人更容易直銷預訂的點。",
    },
    {
      ...en.areas[3],
      title: "行銷與需求",
      description: "把行銷計畫接到飯店真正需要銷售的日期，無論是 Google 搜尋、廣告、內容或促銷，都依飯店的準備程度與目標來選。",
    },
    {
      ...en.areas[4],
      title: "系統、資料與報表",
      description: "看現有的 PMS、Channel Manager、Booking Engine 與報表是否幫得了團隊做決定，再把資料整理到看得到結果與下一步。",
    },
  ],
  steps: [
    {
      ...en.steps[0],
      title: "先看飯店全貌",
      description: "價格、空房、預訂、通路、網站、系統，以及團隊怎麼工作。",
    },
    {
      ...en.steps[1],
      title: "找出錯過的機會",
      description: "例如賣得太快的房間、仍賣得慢的日期、通路成本偏高，或直銷預訂流程不好走。",
    },
    {
      ...en.steps[2],
      title: "訂範圍與計畫",
      description: "決定先從 Revenue Management 開始，或讓團隊一起看 Commercial Management 的多個部分。",
    },
    {
      ...en.steps[3],
      title: "執行並檢視結果",
      description: "寫明要做的事、負責人與用來追蹤的數字，再依實際情況調整計畫。",
    },
  ],
  kpis: [
    occupancyKpi("住房率", "60-day outlook", `${OCCUPANCY_SAMPLE.target}% target`),
    draftKpi("adr", "ADR", "ราคาขายเฉลี่ย", "平均房價", "Hotel reporting period"),
    draftKpi("revpar", "RevPAR", "รายได้ต่อห้องที่มีขาย", "每可售房收益", "Hotel reporting period"),
    paceKpi("預訂速度", `Week ${OCCUPANCY_SAMPLE.weekCount} of 60-day outlook`, `${OCCUPANCY_SAMPLE.target}% Occupancy target`),
  ],
};

const CONTENT: Record<Locale, RevenuePageData> = { th, en, ru, zh };

export function revenueContent(locale: Locale): RevenuePageData {
  const data = CONTENT[locale] ?? en;
  const problemSrc = problemVisualUrl();
  return {
    visual: {
      ...data.visual,
      src: problemSrc,
      status: problemSrc ? "sample" : "placeholder",
    },
    problems: byOrder(data.problems),
    areas: byOrder(data.areas),
    steps: byOrder(data.steps),
    kpis: data.kpis,
  };
}
