import Link from "next/link";
import { KpiTrendChart } from "@/components/revenue-commercial/KpiTrendChart";
import { RevenueHeroVisual } from "@/components/revenue-commercial/RevenueHeroVisual";
import { DecisionFlowDiagram } from "@/components/revenue-commercial/DecisionFlowDiagram";
import { ServiceArchitectureMap } from "@/components/revenue-commercial/ServiceArchitectureMap";
import { RelatedReviewVisual } from "@/components/revenue-commercial/RelatedReviewVisual";
import { RevenueCalendarSample } from "@/components/revenue/RevenueCalendarSample";
import { ServiceDummyImage } from "@/components/revenue-commercial/ServiceDummyImage";
import { caseStudiesHeading } from "@/components/CaseStudiesView";
import { ArrowUpRight } from "@/components/Icons";
import { PageFaqs } from "@/components/PageFaqs";
import { PageHero } from "@/components/PageHero";
import { RevenueEnquiry } from "@/components/RevenueEnquiry";
import { RevenueStickyCta } from "@/components/RevenueStickyCta";
import { SiteShell } from "@/components/SiteShell";
import {
  formatInsightDate,
  insightExcerpt,
  insightPosts,
  insightUpdatedAt,
  insightsIndexCopy,
} from "@/lib/insights";
import { solutionNavLabel } from "@/lib/nav";
import { OCCUPANCY_SAMPLE, OCCUPANCY_SAMPLE_SERIES } from "@/lib/occupancy-sample";
import type { CmsRevenuePage } from "@/lib/cms/revenue-page";
import { chartSeriesFromResolved, resolveRevenuePage } from "@/lib/cms/revenue-page-public";
import {
  heroVisualUrl,
  kpiHasSeries,
  kpiLatest,
  decisionFlowVisualUrl,
  kpiTrendVisualUrl,
  relatedContentVisualUrl,
  REVENUE_HERO_VISUAL,
  REVENUE_PROBLEM_VISUAL,
  revenueContent,
  revenueDataStatusLabel,
  revenueMetaLabel,
  serviceMapVisualUrl,
} from "@/lib/revenue";
import { faqsForRoute } from "@/lib/faqs";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

const relatedInsightHrefs = [
  "/insights/hotel-revenue-meetings-that-lead-to-decisions",
  "/insights/direct-booking-journey-audit",
] as const;

const heroConnect = [
  "Revenue Management",
  "Demand",
  "Pricing",
  "Distribution and OTA",
  "Direct Booking",
  "Commercial decision-making",
] as const;

const copy = {
  th: {
    crumb: "โซลูชัน",
    title: "ดูแลมากกว่าราคาห้องพัก เพื่อให้ทุกช่องทางขายทำงานร่วมกัน",
    lead: "การเพิ่มรายได้โรงแรมไม่ได้จบที่การปรับราคาห้อง เราเชื่อมการบริหารรายได้กับ Demand, ราคา, ช่องทางขาย และการจองตรง ให้อยู่ในมุมมองเดียวก่อนตัดสินใจ",
    connectIntro: "บริการนี้เชื่อมการทำงานเหล่านี้ด้วยกัน",
    leadClose:
      "จาก Revenue Management ไปจนถึง Commercial Management โรงแรมสามารถเลือกเริ่มเฉพาะส่วนที่ต้องการ หรือให้ทีมเราช่วยดูภาพรวมทั้งระบบ",
    cta: "ขอวิเคราะห์โอกาสเพิ่มรายได้",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งชื่อโรงแรม จำนวนห้อง และลิงก์ที่พัก เพื่อให้ทีมดูจุดเริ่มต้น",
    heroCaption: "ดู Revenue, Demand และ Channel Performance ในมุมมองเดียว ก่อนตัดสินใจเรื่องราคาและการขาย",
    visualLabel: "ตัวอย่าง Revenue Calendar / Demand Review",
    problemTitle: "ปัญหาไหนกำลังฉุดรายได้ของโรงแรม?",
    problemIntro: "เราไม่หยุดที่การบรรยายปัญหา แต่เชื่อมปัญหาเข้ากับข้อมูล และการกระทำที่ทำต่อได้",
    problemDataLabel: "ข้อมูลที่ต้องดู",
    problemNextLabel: "สิ่งที่ทำต่อ",
    problemCaption: "ตัวอย่างข้อมูลที่ใช้ตรวจสอบช่วงวันที่ ราคา และช่องทางขาย",
    helpTitle: "5 ด้านที่เชื่อมกัน เพื่อเพิ่มรายได้โรงแรม",
    helpClose: "โรงแรมไม่จำเป็นต้องใช้ทุกบริการพร้อมกัน\nเราช่วยจัดลำดับว่าส่วนไหนมีผลต่อรายได้ และควรเริ่มจากตรงไหนก่อน",
    methodTitle: "จากข้อมูล สู่การตัดสินใจที่ลงมือทำได้จริง",
    methodIntro: "แต่ละขั้นจบด้วยผลงานที่โรงแรมนำไปใช้ต่อได้ ไม่หยุดแค่การประชุมหรือคำแนะนำกว้าง ๆ",
    methodReceive: "โรงแรมจะได้รับ",
    measureTitle: "เราดูผลอย่างไร?",
    measureIntro: "เริ่มจากตัวเลขที่บอกสุขภาพของธุรกิจ\nไม่ใช่ดูแค่ยอดขายรวม",
    measureCaption: "เราไม่ได้ดูเพียงยอดขายรวม แต่ดูว่ารายได้มาจากช่องทางไหน ต้นทุนเท่าไร และควรทำอะไรต่อ",
    measureChartTitle: "Occupancy และ Booking Pace",
    measureChartSubtitle: "Occupancy Trend และ Booking Pace เทียบกับเป้า",
    measurePeriod: `ช่วงวัด ${OCCUPANCY_SAMPLE.periodDays} วัน`,
    measureUpdated: "อัปเดต: ชุดตัวอย่าง ไม่ใช่วันรายงานของโรงแรม",
    measureAxisX: "สัปดาห์ในมุมมอง 60 วัน",
    measureAxisY: "หน่วย %",
    measureDisclaimer: "KPI trend chart · Sample data · ไม่ใช่ผลลัพธ์ลูกค้า",
    measureTarget: "เป้า Occupancy",
    measureOccupancy: "Occupancy",
    measurePace: "Booking Pace",
    measureBody:
      "เริ่มจากตัวเลขที่บอกสุขภาพของธุรกิจ ไม่ใช่ดูแค่ยอดขายรวม จากนั้นจึงดูต่อว่ารายได้มาจากช่องทางไหน ต้นทุนเท่าไร และการจองตรงโตขึ้นหรือไม่",
    measureClose: "เป้าหมายคือให้เจ้าของโรงแรมเห็นมากกว่า\n“เดือนนี้ขายได้เท่าไร”\nแต่เข้าใจว่า\nรายได้มาจากไหน อะไรทำกำไร และอะไรควรทำต่อ",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับรายได้ ช่องทาง และการจองตรง",
    relatedCategoryArticle: "บทความ",
    relatedCategoryService: "บริการ",
    relatedCategoryTool: "เครื่องมือ",
    relatedCategoryCases: "ผลงานลูกค้า",
    relatedMetaService: "หน้าบริการ",
    relatedMetaTool: "เครื่องมือคำนวณ",
    relatedMetaCases: "คลังผลงาน",
    relatedDirectBody: "ช่วยวิเคราะห์ว่าอะไรทำให้ผู้ใช้งานเข้ามาที่เว็บไซต์แล้วไม่ไปต่อถึงการจอง พร้อมปรับเส้นทางจองตรงให้ชัดขึ้น",
    relatedCasesBody: "ดูผลงานลูกค้าที่โรงแรมอนุญาตให้เผยแพร่ เกี่ยวกับรายได้ ช่องทาง และการจองตรง",
    relatedServiceCta: "ดูบริการ",
    details: "ดูรายละเอียด",
    toolName: "คำนวณ RevPAR, ADR และ Occupancy",
    toolBody: "ดูตัวเลขห้องพักพื้นฐานก่อนคุยเรื่องราคา ช่องทางขาย หรือแผนรายได้",
    toolCta: "ใช้เครื่องมือฟรี",
    reservationBody: "เมื่อมีคำถามเข้ามาแล้ว เส้นทางจากสอบถามถึงการจองต้องชัดพอให้ทีมปิดการขายได้",
  },
  en: {
    crumb: "Solutions",
    title: "Look after more than the room rate, so every sales channel can work together",
    lead: "Growing hotel revenue does not end with a rate change. Rate, demand, channels, and commercial decisions sit in one view before the team acts.",
    connectIntro: "The service connects",
    leadClose:
      "A hotel can start with the Revenue Management it needs, or ask us to look after a wider Commercial Management scope that is agreed in advance.",
    cta: "Ask the team to review a hotel revenue opportunity",
    secondary: "All solutions",
    underCta: "Send the hotel name, room count, and a listing link for a first look.",
    heroCaption: "See Revenue, Demand and Channel Performance in one view before deciding on rate and sales",
    visualLabel: "Sample Revenue Calendar / Demand Review",
    problemTitle: "Does any of this sound like the hotel now?",
    problemIntro: "We do not only describe the problem. Each item connects the issue to the data and the next action.",
    problemDataLabel: "Data to inspect",
    problemNextLabel: "Next action",
    problemCaption: "Sample data used to review dates, rates, and selling channels",
    helpTitle: "Which parts can The KPI Plus look after?",
    helpClose: "The hotel does not have to use every service at once. We help set the order of the parts that affect revenue and should start first.",
    methodTitle: "We work from the data to a decision",
    methodIntro: "Each stage ends with a deliverable the hotel can use next, not a meeting note or a broad recommendation.",
    methodReceive: "The hotel receives",
    measureTitle: "How do we review the result?",
    measureIntro: "We start with room numbers such as occupancy, ADR, RevPAR, and booking pace",
    measureCaption: "We do not only look at total sales. We look at which channels the revenue came from, what it cost, and what to do next.",
    measureChartTitle: "Occupancy and Booking Pace",
    measureChartSubtitle: "Occupancy trend and Booking Pace compared with target",
    measurePeriod: `${OCCUPANCY_SAMPLE.periodDays}-day measurement period`,
    measureUpdated: "Updated: sample series, not a hotel reporting date",
    measureAxisX: "Weeks in the 60-day outlook",
    measureAxisY: "Unit %",
    measureDisclaimer: "KPI trend chart · Sample data · not a hotel result",
    measureTarget: "Occupancy target",
    measureOccupancy: "Occupancy",
    measurePace: "Booking Pace",
    measureBody:
      "We start with room numbers such as occupancy, ADR, RevPAR, and booking pace, then look at channel mix, selling cost, enquiries, and direct bookings from data the hotel can check.",
    measureClose: "The aim is for the owner to see more than “how much we sold this month”: where the revenue came from, what it cost, and what to do next.",
    relatedTitle: "Related reading on revenue, channels, and direct booking",
    relatedCategoryArticle: "Article",
    relatedCategoryService: "Service",
    relatedCategoryTool: "Tool",
    relatedCategoryCases: "Case studies",
    relatedMetaService: "Service page",
    relatedMetaTool: "Calculator",
    relatedMetaCases: "Published work",
    relatedDirectBody: "See what stops a website visit from becoming a booking, then make the direct-booking path clearer.",
    relatedCasesBody: "Read client work the hotel has allowed us to publish, covering revenue, channels, and direct booking.",
    relatedServiceCta: "View service",
    details: "Read more",
    toolName: "RevPAR, ADR and occupancy",
    toolBody: "See the basic room numbers before the conversation about rates, channels, or a revenue plan.",
    toolCta: "Use the free tool",
    reservationBody: "After the enquiry arrives, the path from the question to a booking still has to be clear enough for the team to close.",
  },
  ru: {
    crumb: "Решения",
    title: "Смотреть шире цены номера, чтобы каналы продаж работали вместе",
    lead: "Рост дохода отеля не заканчивается сменой цены. The KPI Plus смотрит цену, номера, OTA, прямое бронирование, маркетинг, системы и результат, чтобы отель видел, где шанс и что команде делать дальше.",
    connectIntro: "The service connects",
    leadClose:
      "Отель может начать с нужной части Revenue Management или попросить нас вести более широкий Commercial Management в согласованных границах.",
    cta: "Попросить команду посмотреть, где отель может увеличить доход",
    secondary: "Все решения",
    underCta: "Отправьте название отеля, число номеров и ссылку на объект для первого просмотра.",
    heroCaption: "See Revenue, Demand and Channel Performance in one view before deciding on rate and sales",
    visualLabel: "Sample Revenue Calendar / Demand Review",
    problemTitle: "Похоже ли это на ваш отель сейчас?",
    problemIntro: "We do not only describe the problem. Each item connects the issue to the data and the next action.",
    problemDataLabel: "Data to inspect",
    problemNextLabel: "Next action",
    problemCaption: "Sample data used to review dates, rates, and selling channels",
    helpTitle: "Какие части может взять The KPI Plus?",
    helpClose: "Отелю не нужно брать все услуги сразу. Мы поможем выстроить порядок частей, которые влияют на доход и должны начаться первыми.",
    methodTitle: "Идём от данных к решению",
    methodIntro: "Each stage ends with a deliverable the hotel can use next, not a meeting note or a broad recommendation.",
    methodReceive: "The hotel receives",
    measureTitle: "Как мы смотрим результат?",
    measureIntro: "Начинаем с цифр по номерам: загрузка, ADR, RevPAR и скорость брони вперёд",
    measureCaption: "We do not only look at total sales. We look at which channels the revenue came from, what it cost, and what to do next.",
    measureChartTitle: "Occupancy and Booking Pace",
    measureChartSubtitle: "Occupancy trend and Booking Pace compared with target",
    measurePeriod: `${OCCUPANCY_SAMPLE.periodDays}-day measurement period`,
    measureUpdated: "Updated: sample series, not a hotel reporting date",
    measureAxisX: "Weeks in the 60-day outlook",
    measureAxisY: "Unit %",
    measureDisclaimer: "KPI trend chart · Sample data · not a hotel result",
    measureTarget: "Occupancy target",
    measureOccupancy: "Occupancy",
    measurePace: "Booking Pace",
    measureBody:
      "Начинаем с цифр по номерам: загрузка, ADR, RevPAR и скорость брони вперёд. Затем смотрим долю каналов, стоимость продаж, вопросы и прямые брони по данным, которые отель может проверить.",
    measureClose: "Цель — чтобы собственник видел больше, чем «сколько продали в этом месяце»: откуда пришёл доход, какая была стоимость и что делать дальше.",
    relatedTitle: "Материалы про доход, каналы и прямое бронирование",
    relatedCategoryArticle: "Article",
    relatedCategoryService: "Service",
    relatedCategoryTool: "Tool",
    relatedCategoryCases: "Case studies",
    relatedMetaService: "Service page",
    relatedMetaTool: "Calculator",
    relatedMetaCases: "Published work",
    relatedDirectBody: "See what stops a website visit from becoming a booking, then make the direct-booking path clearer.",
    relatedCasesBody: "Read client work the hotel has allowed us to publish, covering revenue, channels, and direct booking.",
    relatedServiceCta: "View service",
    details: "Подробнее",
    toolName: "RevPAR, ADR и загрузка",
    toolBody: "Посмотреть базовые цифры по номерам до разговора о цене, каналах или плане дохода.",
    toolCta: "Использовать бесплатный инструмент",
    reservationBody: "Когда вопрос уже пришёл, путь от запроса до брони всё равно должен быть достаточно ясным, чтобы команда могла закрыть продажу.",
  },
  zh: {
    crumb: "解決方案",
    title: "看的不只是房價，讓每個銷售通路一起運作",
    lead: "增加飯店收益，不會停在調一次房價。The KPI Plus 會看價格、空房、OTA、直銷預訂、行銷、現有系統與營運結果，讓飯店看清機會在哪，以及團隊接下來該做什麼。",
    connectIntro: "The service connects",
    leadClose:
      "飯店可以先從需要的 Revenue Management 開始，或依事先談好的範圍，讓我們協助看更廣的 Commercial Management。",
    cta: "請團隊看這間飯店哪裡有機會增加收益",
    secondary: "查看全部方案",
    underCta: "留下飯店名稱、房數與住宿連結，讓團隊先看起點。",
    heroCaption: "See Revenue, Demand and Channel Performance in one view before deciding on rate and sales",
    visualLabel: "Sample Revenue Calendar / Demand Review",
    problemTitle: "你的飯店現在是否遇到這些情況？",
    problemIntro: "We do not only describe the problem. Each item connects the issue to the data and the next action.",
    problemDataLabel: "Data to inspect",
    problemNextLabel: "Next action",
    problemCaption: "Sample data used to review dates, rates, and selling channels",
    helpTitle: "The KPI Plus 能看哪些部分？",
    helpClose: "飯店不必一次用全部服務。我們會幫忙排出哪些部分影響收益，以及該先從哪裡開始。",
    methodTitle: "從資料走到決策",
    methodIntro: "Each stage ends with a deliverable the hotel can use next, not a meeting note or a broad recommendation.",
    methodReceive: "The hotel receives",
    measureTitle: "我們怎麼看結果？",
    measureIntro: "先從住房率、ADR、RevPAR 與預訂速度這些客房數字開始",
    measureCaption: "We do not only look at total sales. We look at which channels the revenue came from, what it cost, and what to do next.",
    measureChartTitle: "Occupancy and Booking Pace",
    measureChartSubtitle: "Occupancy trend and Booking Pace compared with target",
    measurePeriod: `${OCCUPANCY_SAMPLE.periodDays}-day measurement period`,
    measureUpdated: "Updated: sample series, not a hotel reporting date",
    measureAxisX: "Weeks in the 60-day outlook",
    measureAxisY: "Unit %",
    measureDisclaimer: "KPI trend chart · Sample data · not a hotel result",
    measureTarget: "Occupancy target",
    measureOccupancy: "Occupancy",
    measurePace: "Booking Pace",
    measureBody:
      "先從住房率、ADR、RevPAR 與預訂速度這些客房數字開始，再看各通路占比、銷售成本、詢問與直銷預訂，且只用飯店能核對的資料。",
    measureClose: "目標是讓業主看到的不只是「這個月賣了多少」，還要看到收益從哪裡來、成本如何，以及接下來該做什麼。",
    relatedTitle: "與收益、通路與直銷預訂相關的內容",
    relatedCategoryArticle: "Article",
    relatedCategoryService: "Service",
    relatedCategoryTool: "Tool",
    relatedCategoryCases: "Case studies",
    relatedMetaService: "Service page",
    relatedMetaTool: "Calculator",
    relatedMetaCases: "Published work",
    relatedDirectBody: "See what stops a website visit from becoming a booking, then make the direct-booking path clearer.",
    relatedCasesBody: "Read client work the hotel has allowed us to publish, covering revenue, channels, and direct booking.",
    relatedServiceCta: "View service",
    details: "查看詳情",
    toolName: "計算 RevPAR、ADR 與住房率",
    toolBody: "在談價格、通路或收益計畫前，先看基礎客房數字。",
    toolCta: "使用免費工具",
    reservationBody: "詢問進來之後，從提問走到預訂的路徑仍須清楚到團隊能成交。",
  },
} as const;

type DiagnosticLine = { before: string; em?: string; after?: string };

type DiagnosticLayers = {
  problem: DiagnosticLine[];
  data: DiagnosticLine[];
  next: DiagnosticLine[];
};

const diagnosticTh: DiagnosticLayers[] = [
  {
    problem: [{ before: "ห้องพักเต็มหลายคืน แต่", em: "ราคาไม่ขยับ" }],
    data: [{ before: "Occupancy และ ADR ในวันที่ขายเต็ม" }],
    next: [{ before: "กำหนด", em: "ช่วงวันที่ควรปรับราคา" }],
  },
  {
    problem: [{ before: "มี", em: "ห้องว่างบางช่วง", after: " แต่ยังไม่รู้ว่าควรขยับราคา โปรโมชัน หรือช่องทาง" }],
    data: [{ before: "Booking Pace และ Pickup ตามวัน" }],
    next: [{ before: "เลือกการกระทำสำหรับ", em: "วันที่ยอดจองช้า" }],
  },
  {
    problem: [{ before: "OTA สร้างยอดจอง แต่ยังไม่เห็น", em: "รายได้หลังหักต้นทุน" }],
    data: [{ before: "ยอดจอง ค่าคอมมิชชัน และสัดส่วนแต่ละช่องทาง" }],
    next: [{ before: "จัดสัดส่วนช่องทางตามรายได้หลังต้นทุน" }],
  },
  {
    problem: [{ before: "อยากได้", em: "การจองตรง", after: "มากขึ้น แต่เส้นทางจองยังไม่เชื่อมกัน" }],
    data: [{ before: "เว็บไซต์ ระบบจอง และการตลาดที่ส่งแขกเข้ามา" }],
    next: [{ before: "ปิดจุดที่ทำให้แขกจองตรงไม่สำเร็จ" }],
  },
  {
    problem: [{ before: "", em: "ข้อมูลกระจายหลายระบบ", after: " ยังไม่มีแผนที่ทีมใช้ตัดสินใจได้" }],
    data: [{ before: "PMS, Channel Manager, Booking Engine และรายงานปัจจุบัน" }],
    next: [{ before: "รวมเป็นมุมมองที่ทีมใช้ลงมือได้" }],
  },
  {
    problem: [{ before: "ทีมขาย การตลาด และปฏิบัติการทำงานหนัก แต่ยังไม่มี", em: "เป้าหารายได้ร่วม" }],
    data: [{ before: "ตัวเลขรายได้ที่แต่ละทีมดูอยู่ตอนนี้" }],
    next: [{ before: "กำหนดตัวเลขและรอบทบทวนร่วมกัน" }],
  },
];

const diagnosticEn: DiagnosticLayers[] = [
  {
    problem: [{ before: "Many nights are full, but the ", em: "rate does not move" }],
    data: [{ before: "Occupancy and ADR on sold-out dates" }],
    next: [{ before: "Name the dates that should change rate" }],
  },
  {
    problem: [{ before: "Some dates still have rooms, and it is unclear whether to change the rate, the offer, or the channel" }],
    data: [{ before: "Booking pace and pickup by date" }],
    next: [{ before: "Choose the action for slow-booking dates" }],
  },
  {
    problem: [{ before: "OTAs create bookings, but ", em: "revenue after cost", after: " is still unclear" }],
    data: [{ before: "Bookings, commission, and mix by channel" }],
    next: [{ before: "Set channel mix from revenue after cost" }],
  },
  {
    problem: [{ before: "The hotel wants more ", em: "direct bookings", after: ", but the booking path is not connected" }],
    data: [{ before: "Website, booking system, and marketing that send guests in" }],
    next: [{ before: "Close the points that stop a direct booking" }],
  },
  {
    problem: [{ before: "", em: "Data sits in several systems", after: ", with no plan the team can run" }],
    data: [{ before: "PMS, channel manager, booking engine, and current reports" }],
    next: [{ before: "Turn the data into one view the team can act on" }],
  },
  {
    problem: [{ before: "Sales, marketing, and operations work hard, but they do not share one ", em: "revenue goal" }],
    data: [{ before: "The revenue numbers each team reviews today" }],
    next: [{ before: "Name the shared numbers and the review rhythm" }],
  },
];

function EmphasisText({ lines }: { lines: DiagnosticLine[] }) {
  return (
    <>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className={lineIndex > 0 ? "kpi-revenue-diagnostic-line" : undefined}>
          {line.before}
          {line.em ? <span className="kpi-revenue-diagnostic-em">{line.em}</span> : null}
          {line.after ?? null}
        </span>
      ))}
    </>
  );
}

type RelatedCard = {
  href: string;
  category: string;
  title: string;
  description: string;
  meta: string;
  cta: string;
};

function buildRelatedCards(
  locale: Locale,
  t: (typeof copy)[Locale],
  insightsUi: (typeof insightsIndexCopy)[Locale],
): RelatedCard[] {
  const cards: RelatedCard[] = [];

  for (const href of relatedInsightHrefs) {
    const resolved = existingHref(href, locale);
    const post = insightPosts.find((item) => item.href === href);
    if (!resolved || !post) continue;
    const updated = insightUpdatedAt(post);
    const dateIso = updated || post.publishedAt;
    cards.push({
      href: resolved,
      category: post.category[locale] || post.category.th,
      title: post.title[locale] || post.title.th,
      description: insightExcerpt(post, locale),
      meta: `${updated ? insightsUi.updated : insightsUi.published} ${formatInsightDate(dateIso, locale)}`,
      cta: insightsUi.read,
    });
  }

  const extras: Array<{ href: string; card: Omit<RelatedCard, "href"> }> = [
    {
      href: "/solutions/hotel-direct-bookings",
      card: {
        category: t.relatedCategoryService,
        title: solutionNavLabel("/solutions/hotel-direct-bookings", locale),
        description: t.relatedDirectBody,
        meta: t.relatedMetaService,
        cta: t.relatedServiceCta,
      },
    },
    {
      href: "/tools/revpar-calculator",
      card: {
        category: t.relatedCategoryTool,
        title: t.toolName,
        description: t.toolBody,
        meta: t.relatedMetaTool,
        cta: t.toolCta,
      },
    },
    {
      href: "/case-studies",
      card: {
        category: t.relatedCategoryCases,
        title: caseStudiesHeading[locale],
        description: t.relatedCasesBody,
        meta: t.relatedMetaCases,
        cta: t.details,
      },
    },
    {
      href: "/solutions/outsourced-hotel-reservations",
      card: {
        category: t.relatedCategoryService,
        title: solutionNavLabel("/solutions/outsourced-hotel-reservations", locale),
        description: t.reservationBody,
        meta: t.relatedMetaService,
        cta: t.relatedServiceCta,
      },
    },
  ];

  for (const extra of extras) {
    const resolved = existingHref(extra.href, locale);
    if (!resolved) continue;
    cards.push({ href: resolved, ...extra.card });
  }

  return cards;
}

export async function RevenueView({
  locale,
  previewContent,
  embedded = false,
}: {
  locale: Locale;
  previewContent?: CmsRevenuePage | null;
  embedded?: boolean;
}) {
  const t = copy[locale];
  const cms = await resolveRevenuePage(locale, previewContent);
  const fromCms = cms.fromCms;
  const data = fromCms
    ? { visual: cms.diagnosticVisual, problems: cms.problems, areas: cms.areas, steps: cms.steps, kpis: cms.kpis }
    : revenueContent(locale);
  const meta = revenueMetaLabel(locale);
  const insightsUi = insightsIndexCopy[locale];
  const solutions = localizePath("/solutions", locale);
  const relatedCards = fromCms ? cms.related.cards : buildRelatedCards(locale, t, insightsUi);
  const featuredCard = relatedCards[0];
  const supportingCards = relatedCards.slice(1, 4);
  const heroSrc = fromCms ? cms.hero.visual.src || undefined : heroVisualUrl();
  const relatedVisualSrc = (() => {
    const src = fromCms ? cms.related.src : relatedContentVisualUrl();
    if (!src) return undefined;
    if (src === heroSrc || src === data.visual.src) return undefined;
    return src;
  })();
  const serviceMapSrc = fromCms ? cms.architecture.src : serviceMapVisualUrl();
  const decisionFlowSrc = fromCms ? cms.decisionFlow.src : decisionFlowVisualUrl();
  const kpiTrendSrc = fromCms ? cms.chart.src : kpiTrendVisualUrl();
  const heroMeta = fromCms ? cms.hero.visual.label : locale === "th" ? REVENUE_HERO_VISUAL.meta.th : REVENUE_HERO_VISUAL.meta.en;
  const pageRoute = localizePath("/solutions/revenue-commercial-management", locale);
  const heroTitle = fromCms ? cms.hero.title : t.title;
  const heroLead = fromCms ? cms.hero.description : t.lead;
  const primaryCta = fromCms ? cms.hero.primaryCta : { label: t.cta, href: "#revenue-enquiry" };
  const secondaryCta = fromCms ? cms.hero.secondaryCta : { label: t.secondary, href: solutions };
  const secondaryHref = existingHref(secondaryCta.href, locale) || secondaryCta.href;
  const stickyLabel = fromCms ? cms.hero.primaryCta.label : t.cta;
  const faqs = fromCms ? cms.faqs : faqsForRoute(pageRoute);
  const chartSeries = fromCms ? chartSeriesFromResolved(cms) : null;

  const inner = (
    <>
      <PageHero className="kpi-revenue-hero">
        <div className="kpi-revenue-hero-grid">
          <div className="kpi-revenue-hero-copy">
            <nav aria-label="Breadcrumb" className="kpi-revenue-hero-crumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href={solutions} className="hover:text-white">
                    {t.crumb}
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <span>{solutionNavLabel("/solutions/revenue-commercial-management", locale)}</span>
                </li>
              </ol>
            </nav>
            <h1 className="kpi-h1 kpi-revenue-hero-title">
              {!fromCms && locale === "th" ? (
                <>
                  ดูแลมากกว่าราคาห้องพัก
                  <span className="kpi-revenue-hero-break"> </span>
                  เพื่อให้<span className="kpi-revenue-hero-em">ทุกช่องทางขาย</span>
                  <span className="kpi-revenue-hero-break"> </span>
                  ทำงานร่วมกัน
                </>
              ) : (
                heroTitle
              )}
            </h1>
            <p className="kpi-revenue-hero-lead">{heroLead}</p>
            <p className="kpi-revenue-hero-connect-intro">{fromCms ? cms.hero.connectIntro : t.connectIntro}</p>
            <ul className="kpi-revenue-hero-connect">
              {(fromCms ? cms.hero.connections : heroConnect).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="kpi-revenue-hero-lead kpi-revenue-hero-lead-next">{fromCms ? cms.hero.leadClose : t.leadClose}</p>
            <div className="kpi-actions">
              {primaryCta.href.startsWith("#") ? (
                <a href={primaryCta.href} className="kpi-button">
                  {primaryCta.label} <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : (
                <Link href={existingHref(primaryCta.href, locale) || primaryCta.href} className="kpi-button">
                  {primaryCta.label} <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
              {secondaryCta.href.startsWith("#") ? (
                <a href={secondaryCta.href} className="kpi-button-ghost kpi-revenue-hero-secondary">
                  {secondaryCta.label}
                </a>
              ) : (
                <Link href={secondaryHref} className="kpi-button-ghost kpi-revenue-hero-secondary">
                  {secondaryCta.label}
                </Link>
              )}
            </div>
            <p className="kpi-revenue-hero-note">{fromCms ? cms.hero.underCta : t.underCta}</p>
          </div>
          <RevenueHeroVisual
            locale={locale}
            src={heroSrc}
            caption={fromCms ? cms.hero.caption : t.heroCaption}
            meta={heroMeta}
            alt={fromCms ? cms.hero.visual.alt : undefined}
            label={fromCms ? cms.hero.visual.label : undefined}
            showSample={!fromCms || cms.hero.visual.status === "sample"}
          />
        </div>
      </PageHero>

      <section className="kpi-section kpi-revenue-diagnostic">
        <div className="kpi-revenue-diagnostic-grid">
          <div>
            <h2 className="kpi-h2">
              {!fromCms && locale === "th" ? (
                <>
                  ปัญหาไหนกำลัง<span className="kpi-revenue-diagnostic-em">ฉุดรายได้</span>ของโรงแรม?
                </>
              ) : (
                fromCms ? cms.problemsSection.title : t.problemTitle
              )}
            </h2>
            <p className="kpi-revenue-diagnostic-intro">{fromCms ? cms.problemsSection.intro : t.problemIntro}</p>
            <ol className="kpi-revenue-diagnostic-list">
              {data.problems.map((item, index) => {
                const layers = fromCms ? undefined : locale === "th" ? diagnosticTh[index] : locale === "en" ? diagnosticEn[index] : undefined;
                return (
                  <li key={item.id} className="kpi-revenue-diagnostic-item">
                    <span className="kpi-revenue-diagnostic-num">{String(item.order).padStart(2, "0")}</span>
                    <div className="kpi-revenue-diagnostic-copy">
                      <h3 className="kpi-revenue-diagnostic-text">
                        {layers ? <EmphasisText lines={layers.problem} /> : item.problem}
                      </h3>
                      <p className="kpi-revenue-diagnostic-layer">
                        <span className="kpi-revenue-diagnostic-layer-label">{t.problemDataLabel}</span>
                        <span>{layers ? <EmphasisText lines={layers.data} /> : item.dataToInspect}</span>
                      </p>
                      <p className="kpi-revenue-diagnostic-layer">
                        <span className="kpi-revenue-diagnostic-layer-label">{t.problemNextLabel}</span>
                        <span>{layers ? <EmphasisText lines={layers.next} /> : item.nextAction}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="kpi-revenue-diagnostic-visual">
            {data.visual.src ? (
              <ServiceDummyImage
                locale={locale === "th" ? "th" : "en"}
                src={data.visual.src}
                alt={data.visual.alt || (locale === "th" ? REVENUE_PROBLEM_VISUAL.alt.th : REVENUE_PROBLEM_VISUAL.alt.en)}
                label={fromCms ? cms.problemsSection.visualLabel : t.visualLabel}
                status={data.visual.status}
                ratio={REVENUE_PROBLEM_VISUAL.ratio}
                recommendedSize={REVENUE_PROBLEM_VISUAL.recommendedSize}
                width={REVENUE_PROBLEM_VISUAL.displayWidth}
                height={REVENUE_PROBLEM_VISUAL.displayHeight}
                fit="contain"
              />
            ) : (
              <RevenueCalendarSample locale={locale === "th" ? "th" : "en"} />
            )}
            {data.visual.src ? (
              <p className="kpi-revenue-diagnostic-caption">{fromCms ? cms.problemsSection.caption : t.problemCaption}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="kpi-revenue-framework">
        <div className="kpi-section">
          <h2 className="kpi-h2 kpi-revenue-framework-heading">
            {!fromCms && locale === "th" ? (
              <>
                5 ด้านที่เชื่อมกัน
                <span className="kpi-revenue-framework-break"> </span>
                เพื่อ<span className="kpi-revenue-framework-em">เพิ่มรายได้โรงแรม</span>
              </>
            ) : (
              fromCms ? cms.areasSection.title : t.helpTitle
            )}
          </h2>
          <div className="kpi-revenue-framework-grid">
            {data.areas.map((area, index) => {
              const href = area.href ? existingHref(area.href, locale) : null;
              const className = [
                "kpi-revenue-framework-item",
                index === 0 ? "is-primary" : "",
                href ? "is-link" : "",
              ]
                .filter(Boolean)
                .join(" ");
              const body = (
                <>
                  <span className="kpi-revenue-framework-num">{area.number}</span>
                  {index === 0 ? <span className="kpi-revenue-framework-mark" aria-hidden="true" /> : null}
                  <h3>{area.title}</h3>
                  <p>
                    {area.description.split("\n").map((line) => (
                      <span key={line} className="kpi-revenue-framework-line">
                        {line}
                      </span>
                    ))}
                  </p>
                  <p className="kpi-revenue-framework-output">
                    <strong>{meta.output}</strong> {area.output}
                  </p>
                  {href ? (
                    <span className="kpi-revenue-framework-more">
                      {t.details} <span aria-hidden="true">↗</span>
                    </span>
                  ) : null}
                </>
              );
              return href ? (
                <Link key={area.id} href={href} className={className}>
                  {body}
                </Link>
              ) : (
                <article key={area.id} className={className}>
                  {body}
                </article>
              );
            })}
          </div>
          <div className="kpi-revenue-framework-map">
            <ServiceArchitectureMap
              locale={locale === "th" ? "th" : "en"}
              src={serviceMapSrc}
              title={fromCms ? cms.architecture.title : undefined}
              description={fromCms ? cms.architecture.description : undefined}
              statusLabel={fromCms ? cms.architecture.statusLabel : undefined}
              layers={fromCms ? cms.architecture.layers : undefined}
            />
          </div>
          <p className="kpi-revenue-framework-close">
            {(fromCms ? cms.areasSection.close : t.helpClose).split("\n").map((line, lineIndex) => (
              <span key={line} className={lineIndex > 0 ? "kpi-revenue-framework-line" : undefined}>
                {line}
              </span>
            ))}
          </p>
          {primaryCta.href.startsWith("#") ? (
            <a href={primaryCta.href} className="kpi-button kpi-revenue-framework-cta">
              {primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <Link href={existingHref(primaryCta.href, locale) || primaryCta.href} className="kpi-button kpi-revenue-framework-cta">
              {primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      <section className="kpi-section kpi-revenue-method">
        <div className="kpi-revenue-method-inner">
          <h2 className="kpi-h2 kpi-revenue-method-heading">
            {!fromCms && locale === "th" ? (
              <>
                จากข้อมูล
                <span className="kpi-revenue-method-break"> </span>
                สู่การตัดสินใจที่<span className="kpi-revenue-method-em">ลงมือทำได้จริง</span>
              </>
            ) : (
              fromCms ? cms.stepsSection.title : t.methodTitle
            )}
          </h2>
          <p className="kpi-revenue-method-intro">{fromCms ? cms.stepsSection.intro : t.methodIntro}</p>
          <ol className="kpi-revenue-method-list">
            {data.steps.map((step) => (
              <li key={step.id} className="kpi-revenue-method-step">
                <span className="kpi-revenue-method-num">{step.number}</span>
                <div className="kpi-revenue-method-copy">
                  <h3>{step.title}</h3>
                  <p>
                    {step.description.split("\n").map((line, lineIndex) => (
                      <span key={line} className={lineIndex > 0 ? "kpi-revenue-method-line" : undefined}>
                        {line}
                      </span>
                    ))}
                  </p>
                  <p className="kpi-revenue-method-output">
                    <strong>{fromCms ? cms.stepsSection.receiveLabel : t.methodReceive}</strong>
                    <span>{step.output}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="kpi-revenue-method-flow">
            <DecisionFlowDiagram
              locale={locale === "th" ? "th" : "en"}
              src={decisionFlowSrc}
              title={fromCms ? cms.decisionFlow.title : undefined}
              description={fromCms ? cms.decisionFlow.description : undefined}
              statusLabel={fromCms ? cms.decisionFlow.statusLabel : undefined}
              steps={data.steps}
            />
          </div>
        </div>
      </section>

      <section className="kpi-revenue-measure">
        <div className="kpi-section">
          <h2 className="kpi-h2 kpi-revenue-measure-heading">{fromCms ? cms.measureSection.title : t.measureTitle}</h2>
          {fromCms ? (
            <p className="kpi-revenue-measure-intro">
              {cms.measureSection.intro.split("\n").map((line, index) => (
                <span key={line} className={index > 0 ? "kpi-revenue-measure-line" : undefined}>
                  {line}
                </span>
              ))}
            </p>
          ) : locale === "th" ? (
            <p className="kpi-revenue-measure-intro">
              {copy.th.measureIntro.split("\n").map((line, index) => (
                <span key={line} className={index > 0 ? "kpi-revenue-measure-line" : undefined}>
                  {line}
                </span>
              ))}
            </p>
          ) : (
            <p className="kpi-lead kpi-revenue-measure-legacy">{t.measureBody}</p>
          )}
          <dl className="kpi-revenue-measure-metrics">
            {data.kpis.map((kpi) => {
              const latest = kpiHasSeries(kpi) ? kpiLatest(kpi) : null;
              const status = revenueDataStatusLabel(kpi.dataStatus, locale);
              return (
                <div key={kpi.id} className="kpi-revenue-measure-metric">
                  <dt>{kpi.name}</dt>
                  <dd>
                    <span className="kpi-revenue-measure-metric-def">
                      {locale === "th" ? kpi.labelTh : kpi.definition}
                    </span>
                    {latest != null && kpi.unit ? (
                      <span className="kpi-revenue-measure-metric-value">
                        {latest}
                        {kpi.unit}
                      </span>
                    ) : null}
                    <span className="kpi-revenue-measure-metric-meta">
                      {kpi.period}
                      {kpi.target ? ` · ${kpi.target}` : ""}
                      {` · ${status}`}
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>
          <div className="kpi-revenue-measure-chart">
            <KpiTrendChart
              title={fromCms ? cms.chart.title : t.measureChartTitle}
              subtitle={fromCms ? cms.chart.subtitle : t.measureChartSubtitle}
              unit="%"
              statusLabel={
                fromCms
                  ? cms.chart.showSample
                    ? cms.chart.sampleLabel
                    : ""
                  : revenueDataStatusLabel("sample", locale)
              }
              periodLabel={fromCms ? cms.chart.periodLabel : t.measurePeriod}
              updatedLabel={fromCms ? cms.chart.updatedLabel : t.measureUpdated}
              axisXLabel={fromCms ? cms.chart.axisX : t.measureAxisX}
              axisYLabel={fromCms ? cms.chart.axisY : t.measureAxisY}
              disclaimer={
                fromCms
                  ? cms.chart.showSample
                    ? cms.chart.sampleLabel
                    : cms.measureSection.caption
                  : t.measureDisclaimer
              }
              src={kpiTrendSrc}
              labels={chartSeries ? chartSeries.labels : [...OCCUPANCY_SAMPLE_SERIES.labels]}
              series={[
                {
                  name: fromCms ? cms.chart.occupancyName : t.measureOccupancy,
                  color: "#0B6660",
                  values: chartSeries ? chartSeries.occupancyValues : [...OCCUPANCY_SAMPLE_SERIES.forecast],
                },
                {
                  name: fromCms ? cms.chart.paceName : t.measurePace,
                  color: "#3B3B3B",
                  values: chartSeries ? chartSeries.paceValues : [...OCCUPANCY_SAMPLE_SERIES.pace],
                },
                {
                  name: fromCms ? cms.chart.targetName : t.measureTarget,
                  color: "#0B1F33",
                  values: (chartSeries ? chartSeries.labels : OCCUPANCY_SAMPLE_SERIES.labels).map(
                    () => (chartSeries ? chartSeries.target : OCCUPANCY_SAMPLE.target),
                  ),
                  dashed: true,
                },
              ]}
            />
          </div>
          <p className="kpi-revenue-measure-caption">{fromCms ? cms.measureSection.caption : t.measureCaption}</p>
        </div>
      </section>

      <section className="kpi-revenue-related">
        <div className="kpi-section">
          <h2 className="kpi-h2 kpi-revenue-related-heading">
            {!fromCms && locale === "th" ? (
              <>
                เรื่องที่เกี่ยวข้องกับรายได้
                <span className="kpi-revenue-related-break"> </span>
                ช่องทาง และการจองตรง
              </>
            ) : (
              fromCms ? cms.related.title : t.relatedTitle
            )}
          </h2>
          <div className="kpi-revenue-related-layout">
            {featuredCard ? (
              <Link href={featuredCard.href} className="kpi-revenue-related-featured">
                <RelatedReviewVisual
                  src={relatedVisualSrc}
                  alt={fromCms ? cms.related.alt : undefined}
                />
                <span className="kpi-revenue-related-mark" aria-hidden="true" />
                <p className="kpi-revenue-related-kicker">{featuredCard.category}</p>
                <h3>{featuredCard.title}</h3>
                <p className="kpi-revenue-related-excerpt">{featuredCard.description}</p>
                <p className="kpi-revenue-related-meta">{featuredCard.meta}</p>
                <span className="kpi-revenue-related-cta">
                  {featuredCard.cta} <span className="kpi-revenue-related-arrow" aria-hidden="true">↗</span>
                </span>
              </Link>
            ) : null}
            {supportingCards.length ? (
              <div className="kpi-revenue-related-list">
                {supportingCards.map((card) => (
                  <Link key={card.href} href={card.href} className="kpi-revenue-related-item">
                    <p className="kpi-revenue-related-kicker">{card.category}</p>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <p className="kpi-revenue-related-meta">{card.meta}</p>
                    <span className="kpi-revenue-related-cta">
                      {card.cta} <span className="kpi-revenue-related-arrow" aria-hidden="true">↗</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <PageFaqs items={faqs} locale={locale} />
      <RevenueEnquiry locale={locale} helper={fromCms ? cms.form : undefined} />
      <RevenueStickyCta label={stickyLabel} />
    </>
  );

  if (embedded) return inner;
  return (
    <SiteShell locale={locale} route={pageRoute} hideFaqs>
      {inner}
    </SiteShell>
  );
}
