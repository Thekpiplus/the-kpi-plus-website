import { enquiryServiceById } from "@/lib/enquiry";
import { faqsForRoute } from "@/lib/faqs";
import {
  formatInsightDate,
  insightExcerpt,
  insightPosts,
  insightUpdatedAt,
  insightsIndexCopy,
} from "@/lib/insights";
import { OCCUPANCY_SAMPLE } from "@/lib/occupancy-sample";
import {
  decisionFlowVisualUrl,
  heroVisualUrl,
  kpiTrendVisualUrl,
  relatedContentVisualUrl,
  revenueContent,
  serviceMapVisualUrl,
  type KpiDefinition,
  REVENUE_DECISION_FLOW_VISUAL,
  REVENUE_HERO_VISUAL,
  REVENUE_KPI_TREND_VISUAL,
  REVENUE_RELATED_VISUAL,
  REVENUE_SERVICE_MAP_VISUAL,
} from "@/lib/revenue";
import { localizePath, type Locale } from "@/lib/seo";
import {
  REVENUE_CMS_TEMPLATE,
  REVENUE_PAGE_ROUTE,
  type CmsKpi,
  type CmsLayer,
  type CmsRelatedCard,
  type CmsRevenuePage,
  type CmsVisual,
  type RevenueVisualStatus,
} from "./revenue-page";

const ARCHITECTURE_LAYERS: CmsLayer[] = [
  { id: "sources", title: "Data Sources", body: "PMS · Channel Manager · Booking Engine · OTA · Marketing" },
  { id: "view", title: "Commercial View", body: "Demand · Pricing · Channel Mix · Direct Booking" },
  { id: "action", title: "Action", body: "Rate · Restriction · Distribution · Campaign" },
  { id: "review", title: "Review", body: "Occupancy · ADR · RevPAR · Booking Pace" },
];

const HERO_CONNECTIONS = [
  "Revenue Management",
  "Demand",
  "Pricing",
  "Distribution and OTA",
  "Direct Booking",
  "Commercial decision-making",
];

const COPY = {
  th: {
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
    problemCaption: "ตัวอย่างข้อมูลที่ใช้ตรวจสอบช่วงวันที่ ราคา และช่องทางขาย",
    helpTitle: "5 ด้านที่เชื่อมกัน เพื่อเพิ่มรายได้โรงแรม",
    helpClose: "โรงแรมไม่จำเป็นต้องใช้ทุกบริการพร้อมกัน\nเราช่วยจัดลำดับว่าส่วนไหนมีผลต่อรายได้ และควรเริ่มจากตรงไหนก่อน",
    methodTitle: "จากข้อมูล สู่การตัดสินใจที่ลงมือทำได้จริง",
    methodIntro: "แต่ละขั้นจบด้วยผลงานที่โรงแรมนำไปใช้ต่อได้ ไม่หยุดแค่การประชุมหรือคำแนะนำกว้าง ๆ",
    methodReceive: "โรงแรมจะได้รับ",
    measureTitle: "เราดูผลอย่างไร?",
    measureIntro: "เริ่มจากตัวเลขที่บอกสุขภาพของธุรกิจ\nไม่ใช่ดูแค่ยอดขายรวม",
    measureCaption: "เราไม่ได้ดูเพียงยอดขายรวม แต่ดูว่ารายได้มาจากช่องทางไหน ต้นทุนเท่าไร และควรทำอะไรต่อ",
    measureClose:
      "เป้าหมายคือให้เจ้าของโรงแรมเห็นมากกว่า\n“เดือนนี้ขายได้เท่าไร”\nแต่เข้าใจว่า\nรายได้มาจากไหน อะไรทำกำไร และอะไรควรทำต่อ",
    chartTitle: "Occupancy และ Booking Pace",
    chartSubtitle: "Occupancy Trend และ Booking Pace เทียบกับเป้า",
    periodLabel: `ช่วงวัด ${OCCUPANCY_SAMPLE.periodDays} วัน`,
    updatedLabel: "อัปเดต: ชุดตัวอย่าง ไม่ใช่วันรายงานของโรงแรม",
    axisX: "สัปดาห์ในมุมมอง 60 วัน",
    axisY: "หน่วย %",
    sampleLabel: "KPI trend chart · Sample data · ไม่ใช่ผลลัพธ์ลูกค้า",
    occupancyName: "Occupancy",
    paceName: "Booking Pace",
    targetName: "เป้า Occupancy",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับรายได้ ช่องทาง และการจองตรง",
    relatedService: "บริการ",
    relatedTool: "เครื่องมือ",
    relatedCases: "ผลงานลูกค้า",
    relatedMetaService: "หน้าบริการ",
    relatedMetaTool: "เครื่องมือคำนวณ",
    relatedMetaCases: "คลังผลงาน",
    relatedDirectTitle: "Hotel Direct Bookings",
    relatedDirectBody: "ช่วยวิเคราะห์ว่าอะไรทำให้ผู้ใช้งานเข้ามาที่เว็บไซต์แล้วไม่ไปต่อถึงการจอง พร้อมปรับเส้นทางจองตรงให้ชัดขึ้น",
    relatedServiceCta: "ดูบริการ",
    details: "ดูรายละเอียด",
    toolName: "คำนวณ RevPAR, ADR และ Occupancy",
    toolBody: "ดูตัวเลขห้องพักพื้นฐานก่อนคุยเรื่องราคา ช่องทางขาย หรือแผนรายได้",
    toolCta: "ใช้เครื่องมือฟรี",
    casesTitle: "ผลงานลูกค้า",
    relatedCasesBody: "ดูผลงานลูกค้าที่โรงแรมอนุญาตให้เผยแพร่ เกี่ยวกับรายได้ ช่องทาง และการจองตรง",
    reservationTitle: "Outsourced Hotel Reservations",
    reservationBody: "เมื่อมีคำถามเข้ามาแล้ว เส้นทางจากสอบถามถึงการจองต้องชัดพอให้ทีมปิดการขายได้",
    formNextTitle: "หลังจากส่งข้อมูลแล้ว",
    formSteps: ["ส่งข้อมูลโรงแรมเบื้องต้น", "ทีมงานดูว่าควรเริ่มจากจุดใด", "นัดพูดคุยและกำหนดขั้นตอนถัดไป"],
    formTrust: ["ใช้ข้อมูลเท่าที่โรงแรมสะดวกแชร์", "ข้อมูลจะถูกเก็บเป็นความลับ", "ไม่มีการรับประกันผลลัพธ์เกินจริง"],
    architectureTitle: "Revenue & Commercial Operating View",
    architectureDesc: "แหล่งข้อมูลเชื่อมไปยังมุมมองด้าน Commercial แล้วไปสู่การลงมือและทบทวน Occupancy, ADR, RevPAR และ Booking Pace",
    flowTitle: "โรงแรมจะได้รับอะไรในแต่ละขั้น",
    flowDesc: "แต่ละขั้นส่งมอบผลงานที่โรงแรมนำไปใช้ต่อได้ จาก Revenue Snapshot ถึง KPI Review และ Next Action",
  },
  en: {
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
    problemCaption: "Sample data used to review dates, rates, and selling channels",
    helpTitle: "Which parts can The KPI Plus look after?",
    helpClose: "The hotel does not have to use every service at once. We help set the order of the parts that affect revenue and should start first.",
    methodTitle: "We work from the data to a decision",
    methodIntro: "Each stage ends with a deliverable the hotel can use next, not a meeting note or a broad recommendation.",
    methodReceive: "The hotel receives",
    measureTitle: "How do we review the result?",
    measureIntro: "We start with room numbers such as occupancy, ADR, RevPAR, and booking pace",
    measureCaption: "We do not only look at total sales. We look at which channels the revenue came from, what it cost, and what to do next.",
    measureClose:
      "The aim is for the owner to see more than “how much we sold this month”: where the revenue came from, what it cost, and what to do next.",
    chartTitle: "Occupancy and Booking Pace",
    chartSubtitle: "Occupancy trend and Booking Pace compared with target",
    periodLabel: `${OCCUPANCY_SAMPLE.periodDays}-day measurement period`,
    updatedLabel: "Updated: sample series, not a hotel reporting date",
    axisX: "Weeks in the 60-day outlook",
    axisY: "Unit %",
    sampleLabel: "KPI trend chart · Sample data · not a hotel result",
    occupancyName: "Occupancy",
    paceName: "Booking Pace",
    targetName: "Occupancy target",
    relatedTitle: "Related reading on revenue, channels, and direct booking",
    relatedService: "Service",
    relatedTool: "Tool",
    relatedCases: "Case studies",
    relatedMetaService: "Service page",
    relatedMetaTool: "Calculator",
    relatedMetaCases: "Published work",
    relatedDirectTitle: "Hotel Direct Bookings",
    relatedDirectBody: "See what stops a website visit from becoming a booking, then make the direct-booking path clearer.",
    relatedServiceCta: "View service",
    details: "Read more",
    toolName: "RevPAR, ADR and occupancy",
    toolBody: "See the basic room numbers before the conversation about rates, channels, or a revenue plan.",
    toolCta: "Use the free tool",
    casesTitle: "Case studies",
    relatedCasesBody: "Read client work the hotel has allowed us to publish, covering revenue, channels, and direct booking.",
    reservationTitle: "Outsourced Hotel Reservations",
    reservationBody: "After the enquiry arrives, the path from the question to a booking still has to be clear enough for the team to close.",
    formNextTitle: "What happens next",
    formSteps: ["Send the hotel’s basic details", "The team reviews where to start", "Arrange a conversation and the next step"],
    formTrust: [
      "Share only what the hotel is comfortable sharing",
      "Information is kept confidential",
      "We do not promise results we cannot support",
    ],
    architectureTitle: "Revenue & Commercial Operating View",
    architectureDesc: "Data sources connect to a commercial view, then to actions and a review of Occupancy, ADR, RevPAR, and Booking Pace.",
    flowTitle: "What the hotel receives after each stage",
    flowDesc: "Each stage hands over a deliverable the hotel can use next, from a Revenue Snapshot to KPI Review and Next Action.",
  },
} as const;

function extra(locale: Locale) {
  return locale === "th" ? COPY.th : COPY.en;
}

function visual(src: string | undefined, alt: string, status: RevenueVisualStatus, label: string): CmsVisual {
  return { src: src ?? "", alt, status, label };
}

function kpiFromDefinition(kpi: KpiDefinition): CmsKpi {
  const sampleSource =
    kpi.dataStatus === "sample" ? `Sample data · ${kpi.period}` : kpi.target ? kpi.target : kpi.period;
  return {
    id: kpi.id,
    label: kpi.name,
    definition: kpi.definition,
    unit: kpi.unit ?? "",
    period: kpi.period,
    source: sampleSource,
    target: kpi.target ?? "",
    dataStatus: kpi.dataStatus,
    values: [...kpi.values],
    labels: [...kpi.labels],
  };
}

function relatedCards(locale: Locale): CmsRelatedCard[] {
  const t = extra(locale);
  const insightsUi = insightsIndexCopy[locale] ?? insightsIndexCopy.en;
  const cards: CmsRelatedCard[] = [];
  const insightHrefs = [
    "/insights/hotel-revenue-meetings-that-lead-to-decisions",
    "/insights/direct-booking-journey-audit",
  ];
  for (const href of insightHrefs) {
    const post = insightPosts.find((item) => item.href === href);
    if (!post) continue;
    const updated = insightUpdatedAt(post);
    cards.push({
      id: post.slug,
      href,
      category: post.category[locale] || post.category.th,
      title: post.title[locale] || post.title.th,
      description: insightExcerpt(post, locale),
      meta: `${updated ? insightsUi.updated : insightsUi.published} ${formatInsightDate(updated || post.publishedAt, locale)}`,
      cta: insightsUi.read,
    });
  }
  return [
    ...cards,
    {
      id: "direct-bookings",
      href: "/solutions/hotel-direct-bookings",
      category: t.relatedService,
      title: t.relatedDirectTitle,
      description: t.relatedDirectBody,
      meta: t.relatedMetaService,
      cta: t.relatedServiceCta,
    },
    {
      id: "revpar-tool",
      href: "/tools/revpar-calculator",
      category: t.relatedTool,
      title: t.toolName,
      description: t.toolBody,
      meta: t.relatedMetaTool,
      cta: t.toolCta,
    },
    {
      id: "case-studies",
      href: "/case-studies",
      category: t.relatedCases,
      title: t.casesTitle,
      description: t.relatedCasesBody,
      meta: t.relatedMetaCases,
      cta: t.details,
    },
    {
      id: "reservations",
      href: "/solutions/outsourced-hotel-reservations",
      category: t.relatedService,
      title: t.reservationTitle,
      description: t.reservationBody,
      meta: t.relatedMetaService,
      cta: t.relatedServiceCta,
    },
  ];
}

export function defaultRevenueCms(locale: Locale): CmsRevenuePage {
  const t = extra(locale);
  const data = revenueContent(locale);
  const service = enquiryServiceById("revenue");
  const faqs = faqsForRoute(localizePath(REVENUE_PAGE_ROUTE, locale)).map((item, index) => ({
    id: `faq-${index + 1}`,
    q: item.q,
    a: item.a,
  }));
  const heroSrc = heroVisualUrl();
  const mapSrc = serviceMapVisualUrl();
  const flowSrc = decisionFlowVisualUrl();
  const chartSrc = kpiTrendVisualUrl();
  const relatedSrc = relatedContentVisualUrl();
  const solutions = locale === "th" ? "/solutions" : localizePath("/solutions", locale);

  return {
    version: 1,
    template: REVENUE_CMS_TEMPLATE,
    hero: {
      title: t.title,
      description: t.lead,
      connectIntro: t.connectIntro,
      leadClose: t.leadClose,
      connections: [...HERO_CONNECTIONS],
      primaryCta: { label: t.cta, href: "#revenue-enquiry" },
      secondaryCta: { label: t.secondary, href: solutions },
      underCta: t.underCta,
      caption: t.heroCaption,
      visual: visual(
        heroSrc,
        locale === "th" ? REVENUE_HERO_VISUAL.alt.th : REVENUE_HERO_VISUAL.alt.en,
        heroSrc ? "sample" : "placeholder",
        locale === "th" ? REVENUE_HERO_VISUAL.label.th : REVENUE_HERO_VISUAL.label.en,
      ),
    },
    problemsSection: {
      title: t.problemTitle,
      intro: t.problemIntro,
      caption: t.problemCaption,
      visualLabel: t.visualLabel,
    },
    problems: data.problems.map((item) => ({ ...item })),
    areasSection: { title: t.helpTitle, close: t.helpClose },
    areas: data.areas.map((item) => ({ ...item })),
    architecture: {
      title: t.architectureTitle,
      description: t.architectureDesc,
      statusLabel: REVENUE_SERVICE_MAP_VISUAL.label,
      layers: ARCHITECTURE_LAYERS.map((item) => ({ ...item })),
      visual: visual(mapSrc, REVENUE_SERVICE_MAP_VISUAL.label, mapSrc ? "sample" : "placeholder", REVENUE_SERVICE_MAP_VISUAL.label),
    },
    stepsSection: { title: t.methodTitle, intro: t.methodIntro, receiveLabel: t.methodReceive },
    steps: data.steps.map((item) => ({ ...item })),
    decisionFlow: {
      title: t.flowTitle,
      description: t.flowDesc,
      statusLabel: REVENUE_DECISION_FLOW_VISUAL.label,
      visual: visual(
        flowSrc,
        REVENUE_DECISION_FLOW_VISUAL.label,
        flowSrc ? "sample" : "placeholder",
        REVENUE_DECISION_FLOW_VISUAL.label,
      ),
    },
    measureSection: { title: t.measureTitle, intro: t.measureIntro, caption: t.measureCaption, close: t.measureClose },
    kpis: data.kpis.map(kpiFromDefinition),
    chart: {
      title: t.chartTitle,
      subtitle: t.chartSubtitle,
      sampleLabel: t.sampleLabel,
      periodLabel: t.periodLabel,
      updatedLabel: t.updatedLabel,
      axisX: t.axisX,
      axisY: t.axisY,
      occupancyName: t.occupancyName,
      paceName: t.paceName,
      targetName: t.targetName,
      visual: visual(chartSrc, REVENUE_KPI_TREND_VISUAL.label, chartSrc ? "sample" : "placeholder", REVENUE_KPI_TREND_VISUAL.label),
    },
    related: {
      title: t.relatedTitle,
      visual: visual(relatedSrc, REVENUE_RELATED_VISUAL.label, relatedSrc ? "sample" : "placeholder", REVENUE_RELATED_VISUAL.label),
      cards: relatedCards(locale),
    },
    form: {
      kicker: service?.kicker[locale] ?? service?.kicker.en ?? "Revenue & Commercial",
      heading: service?.title[locale] ?? service?.title.en ?? "",
      lead: service?.body[locale] ?? service?.body.en ?? "",
      nextTitle: t.formNextTitle,
      steps: [...t.formSteps],
      trust: [...t.formTrust],
    },
    faqs,
    seo: {
      social: visual("", "", "placeholder", "Social image"),
    },
  };
}
