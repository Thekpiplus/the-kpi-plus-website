import {
  META_SCENARIO_ROWS,
  META_SCENARIO_VISUAL,
  META_ENQUIRY,
  META_ENQUIRY_RECEIVE,
  META_TEAM_VISUAL,
  META_HERO_VISUAL,
  META_KPI_VISUAL,
  META_FRAMEWORK_ROWS,
  META_LANDING_CHECKLIST,
  META_READINESS_VISUAL,
  META_RELATED_VISUAL,
  META_HOTEL_SCENARIO_VISUAL,
  META_PLATFORM_AUDIENCE_SOURCE,
  META_SUPPORTED_EVENTS,
  META_TRACKING_BOUNDARY,
  META_AUDIENCE_VISUAL,
  META_WORKFLOW_STEPS,
  META_WORKFLOW_VISUAL,
  metaFaqs,
} from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";
import {
  defaultMetaAdsAudienceStats,
  defaultMetaAdsCreativeRows,
  defaultMetaAdsKpis,
  defaultMetaAdsRelatedCards,
  defaultMetaAdsScenarioRows,
  META_ADS_CMS_TEMPLATE,
  type CmsAdsVisual,
  type CmsMetaAdsPage,
} from "./meta-ads-page";

function sampleVisual(label: string, altTh: string, altEn: string, caption: string): CmsAdsVisual {
  return { src: "", altTh, altEn, status: "sample", label, caption, containsMetaBrand: false, brandNote: "" };
}

export function defaultMetaAdsCms(locale: Locale = "th"): CmsMetaAdsPage {
  const thai = locale === "th";
  const faqs = metaFaqs(locale);

  return {
    version: 1,
    template: META_ADS_CMS_TEMPLATE,
    hero: {
      eyebrow: thai ? "Facebook และ Meta Ads" : "Facebook and Instagram ads for hotels",
      title: thai
        ? "ทำให้คนที่ใช่เห็นโรงแรมของคุณ แล้วมีเหตุผลที่จะสอบถามหรือจอง"
        : "Help the right people see your hotel, then give them a reason to enquire or book",
      description: thai
        ? "Meta Ads เริ่มจากเป้าหมายธุรกิจที่ชัด กลุ่มลูกค้าและครีเอทีฟต้องเข้ากับตลาดของโรงแรม โฆษณาต้องพาไปหน้าโรงแรมหรือข้อเสนอที่เกี่ยวข้อง และเส้นทางจากโฆษณาไปสู่การสอบถามหรือจองตรงควรวัดผลได้ เดอะ เคพีไอ พลัส ช่วยทบทวนและปรับแคมเปญ เมื่อโรงแรมอนุมัติให้ใช้บริการ"
        : "Meta Ads starts from a clear business objective. Audience and creative have to fit the hotel’s market. The ad should open a relevant hotel or offer page, and the path from the ad to an enquiry or direct booking should be measurable. The KPI Plus supports review and optimization where the service is approved.",
      primaryCta: {
        label: thai ? "ให้ทีมประเมินแนวทาง Meta Ads" : "Ask the team to review a Meta Ads approach",
        href: "#meta-ads-enquiry",
      },
      secondaryCta: { label: thai ? "ดูโซลูชันทั้งหมด" : "All solutions", href: "/solutions" },
      underCta: thai
        ? "ส่งชื่อโรงแรมและลิงก์เพจหรือเว็บไซต์ เพื่อเริ่มพูดคุยกับทีม"
        : "Send the hotel name and a page or website link to start the conversation.",
      caption: thai ? META_HERO_VISUAL.caption.th : META_HERO_VISUAL.caption.en,
      visual: sampleVisual(
        thai ? META_HERO_VISUAL.label.th : META_HERO_VISUAL.label.en,
        META_HERO_VISUAL.alt.th,
        META_HERO_VISUAL.alt.en,
        thai ? META_HERO_VISUAL.caption.th : META_HERO_VISUAL.caption.en,
      ),
    },
    visibility: {
      title: thai ? "ลูกค้าอยู่บนแพลตฟอร์ม แต่การเข้าถึงอย่างเดียวไม่พอ" : "Guests are on the platforms, but reach alone is not the plan",
      body: thai
        ? "ขนาดกลุ่มเป้าหมายโฆษณาของแพลตฟอร์มบอกได้แค่ว่าในประเทศมีคนที่โฆษณาเข้าถึงได้กว้างแค่ไหน ไม่ใช่จำนวนคนที่โรงแรมอาจเข้าถึงได้ ไม่ใช่ยอดเห็นแคมเปญ และไม่ใช่จำนวนผู้เข้าชมเว็บหรือผลสอบถามหรือจอง โรงแรมยังต้องเลือกกลุ่มลูกค้าและความสนใจที่เข้ากับตลาด แล้ววางครีเอทีฟกับหน้าปลายทางให้คนที่สนใจไปต่อได้"
        : "A platform audience estimate only shows how many people in the country can be reached with ads. It is not the hotel’s potential reach, not campaign reach, and not website visitors or enquiry or booking results. The hotel still has to choose an audience and interests that fit its market, then match creative to a page those people can continue on.",
      note: thai
        ? "ตัวเลขด้านล่างเป็นประมาณการกลุ่มเป้าหมายโฆษณาระดับประเทศจาก DataReportal ไม่ใช่ผลแคมเปญของโรงแรม ผู้ใช้ Facebook และ Instagram อาจซ้ำกัน"
        : "The figures below are country-level advertising-audience estimates from DataReportal, not a hotel campaign result. Facebook and Instagram users can overlap.",
      visual: sampleVisual(
        thai ? META_AUDIENCE_VISUAL.label.th : META_AUDIENCE_VISUAL.label.en,
        META_AUDIENCE_VISUAL.alt.th,
        META_AUDIENCE_VISUAL.alt.en,
        thai ? META_AUDIENCE_VISUAL.caption.th : META_AUDIENCE_VISUAL.caption.en,
      ),
      sourceLabel: META_PLATFORM_AUDIENCE_SOURCE.label,
      sourceHref: META_PLATFORM_AUDIENCE_SOURCE.href,
      stats: defaultMetaAdsAudienceStats(locale),
    },
    readiness: {
      title: thai ? "กรอบความพร้อม Meta Ads" : "Meta Ads Readiness Framework",
      body: thai
        ? "รวมปัญหาที่พบซ้ำ — เป้าหมาย กลุ่มลูกค้า ครีเอทีฟ หน้าปลายทาง เส้นทางสอบถามหรือจอง และการวัดผล — ไว้ในตารางเดียว ก่อนขยายงบ"
        : "Bring the repeated issues — objective, audience, creative, landing page, enquiry or booking path, and measurement — into one matrix before extra spend.",
      visual: sampleVisual(
        thai ? META_READINESS_VISUAL.label.th : META_READINESS_VISUAL.label.en,
        META_READINESS_VISUAL.alt.th,
        META_READINESS_VISUAL.alt.en,
        thai ? META_READINESS_VISUAL.caption.th : META_READINESS_VISUAL.caption.en,
      ),
      items: META_FRAMEWORK_ROWS.map((item, index) => ({
        id: item.id,
        area: item.area,
        problem: thai ? item.problemTh : item.problemEn,
        inspect: thai ? item.inspectTh : item.inspectEn,
        improve: thai ? item.improveTh : item.improveEn,
        output: thai ? item.outputTh : item.outputEn,
        check: thai ? item.inspectTh : item.inspectEn,
        why: thai ? item.problemTh : item.problemEn,
        order: index + 1,
      })),
    },
    channels: {
      title: thai ? "เชื่อม Meta Ads กับเป้าหมายการขายของโรงแรม" : "Connect Meta Ads to the hotel’s sales objectives",
      visual: sampleVisual(
        META_SCENARIO_VISUAL.label.en,
        META_SCENARIO_VISUAL.alt.th,
        META_SCENARIO_VISUAL.alt.en,
        thai ? META_SCENARIO_VISUAL.caption.th : META_SCENARIO_VISUAL.caption.en,
      ),
      rows: META_SCENARIO_ROWS.map((item, index) => ({
        id: item.id,
        channel: item.channel,
        useCase: thai ? item.useCaseTh : item.useCaseEn,
        control: thai ? item.controlTh : item.controlEn,
        input: thai ? item.inputTh : item.inputEn,
        output: thai ? item.outputTh : item.outputEn,
        kpi: thai ? item.kpiTh : item.kpiEn,
        role: thai ? item.useCaseTh : item.useCaseEn,
        need: thai ? item.inputTh : item.inputEn,
        hotel: thai ? item.hotelTh : item.hotelEn,
        order: index + 1,
      })),
    },
    scenario: {
      title: thai ? "เริ่มจากสถานการณ์ของโรงแรม" : "Start from the hotel’s situation",
      visual: sampleVisual(
        thai ? META_HOTEL_SCENARIO_VISUAL.label.th : META_HOTEL_SCENARIO_VISUAL.label.en,
        META_HOTEL_SCENARIO_VISUAL.alt.th,
        META_HOTEL_SCENARIO_VISUAL.alt.en,
        thai ? META_HOTEL_SCENARIO_VISUAL.caption.th : META_HOTEL_SCENARIO_VISUAL.caption.en,
      ),
      rows: defaultMetaAdsScenarioRows(locale),
    },
    workflow: {
      title: thai ? "ดูทั้งโฆษณาและการจอง ไม่ดูแค่จำนวนคลิก" : "Review the ads and the booking, not clicks alone",
      visual: sampleVisual(
        META_WORKFLOW_VISUAL.label.en,
        META_WORKFLOW_VISUAL.alt.th,
        META_WORKFLOW_VISUAL.alt.en,
        thai ? META_WORKFLOW_VISUAL.caption.th : META_WORKFLOW_VISUAL.caption.en,
      ),
      steps: META_WORKFLOW_STEPS.map((item, index) => ({
        id: item.id,
        number: item.number,
        title: thai ? item.titleTh : item.titleEn,
        owner: thai ? item.ownerTh : item.ownerEn,
        input: thai ? item.inputTh : item.inputEn,
        action: thai ? item.actionTh : item.actionEn,
        output: thai ? item.outputTh : item.outputEn,
        nextDecision: thai ? item.nextDecisionTh : item.nextDecisionEn,
        handoff: thai ? item.nextDecisionTh : item.nextDecisionEn,
        order: index + 1,
      })),
    },
    creative: {
      title: thai ? "จับคู่กลุ่มลูกค้า ข้อความ รูปแบบ หน้าปลายทาง และ KPI" : "Match audience, message, format, destination, and KPI",
      body: thai
        ? "ตารางนี้เป็นกรอบวางครีเอทีฟ ไม่ใช่ผลแคมเปญ แสดงตัวเลขเมื่อมีข้อมูลที่อนุมัติแล้วเท่านั้น"
        : "This matrix is a planning framework, not campaign results. Figures stay hidden until approved data exists.",
      rows: defaultMetaAdsCreativeRows(locale),
    },
    checklists: {
      tracking: {
        title: thai ? META_TRACKING_BOUNDARY.title.th : META_TRACKING_BOUNDARY.title.en,
        note: thai ? META_TRACKING_BOUNDARY.note.th : META_TRACKING_BOUNDARY.note.en,
        items: [...(thai ? META_TRACKING_BOUNDARY.items.th : META_TRACKING_BOUNDARY.items.en)],
      },
      events: {
        title: thai ? META_SUPPORTED_EVENTS.title.th : META_SUPPORTED_EVENTS.title.en,
        note: thai ? META_SUPPORTED_EVENTS.note.th : META_SUPPORTED_EVENTS.note.en,
        items: [...(thai ? META_SUPPORTED_EVENTS.items.th : META_SUPPORTED_EVENTS.items.en)],
      },
      landing: {
        title: thai ? META_LANDING_CHECKLIST.title.th : META_LANDING_CHECKLIST.title.en,
        note: thai ? META_LANDING_CHECKLIST.note.th : META_LANDING_CHECKLIST.note.en,
        items: [...(thai ? META_LANDING_CHECKLIST.items.th : META_LANDING_CHECKLIST.items.en)],
      },
    },
    measure: {
      title: thai ? "แยกตัวชี้วัดแพลตฟอร์มกับผลธุรกิจ" : "Separate platform metrics from business metrics",
      intro: thai
        ? "แยกตัวชี้วัดแพลตฟอร์มกับผลธุรกิจ Reach Frequency Impressions CTR และการมีส่วนร่วมไม่ใช่ผลรายได้ แสดงตัวเลขเฉพาะสถานะ Approved, Anonymised หรือ Sample ที่ติดป้ายชัดเจน"
        : "Separate platform metrics from business metrics. Reach, Frequency, Impressions, CTR, and engagement are not a revenue result. Figures are shown only with Approved, Anonymised, or clearly labelled Sample status.",
      close: thai
        ? "ความสามารถในการวัดลีด การจอง และ ROAS ขึ้นอยู่กับเว็บไซต์ ระบบจอง และการตั้งค่าติดตามผลของโรงแรม ทีมจะตรวจสิ่งที่วัดได้จริงก่อนกำหนดรายงาน"
        : "How far leads, bookings, and ROAS can be measured depends on the website, booking system, and tracking the hotel already has. The team checks what can actually be measured before agreeing the report.",
      visual: sampleVisual(
        META_KPI_VISUAL.label.en,
        META_KPI_VISUAL.alt.th,
        META_KPI_VISUAL.alt.en,
        thai ? META_KPI_VISUAL.caption.th : META_KPI_VISUAL.caption.en,
      ),
      kpis: defaultMetaAdsKpis(locale),
    },
    related: {
      title: thai ? "เรื่องที่เกี่ยวข้องกับ Meta Ads และการตลาดโรงแรม" : "Related reading on Meta Ads and hotel marketing",
      visual: sampleVisual(
        META_RELATED_VISUAL.label.en,
        META_RELATED_VISUAL.alt.th,
        META_RELATED_VISUAL.alt.en,
        thai ? META_RELATED_VISUAL.caption.th : META_RELATED_VISUAL.caption.en,
      ),
      cards: defaultMetaAdsRelatedCards(locale),
    },
    form: {
      kicker: "Meta Ads",
      heading: thai ? META_ENQUIRY.heading.th : META_ENQUIRY.heading.en,
      lead: thai ? META_ENQUIRY.lead.th : META_ENQUIRY.lead.en,
      submit: thai ? META_ENQUIRY.submit.th : META_ENQUIRY.submit.en,
      receiveTitle: thai ? META_ENQUIRY.receiveTitle.th : META_ENQUIRY.receiveTitle.en,
      receive: META_ENQUIRY_RECEIVE.map((item) => item.title),
      nextTitle: thai ? META_ENQUIRY.nextTitle.th : META_ENQUIRY.nextTitle.en,
      steps: thai ? [...META_ENQUIRY.steps.th] : [...META_ENQUIRY.steps.en],
      labels: {
        name: thai ? META_ENQUIRY.labels.th.name : META_ENQUIRY.labels.en.name,
        business: thai ? META_ENQUIRY.labels.th.business : META_ENQUIRY.labels.en.business,
        contact: thai ? META_ENQUIRY.labels.th.contact : META_ENQUIRY.labels.en.contact,
        website: thai ? META_ENQUIRY.fields.th.website : META_ENQUIRY.fields.en.website,
        goal: thai ? META_ENQUIRY.fields.th.goal : META_ENQUIRY.fields.en.goal,
        market: thai ? META_ENQUIRY.fields.th.market : META_ENQUIRY.fields.en.market,
        adsStatus: thai ? META_ENQUIRY.fields.th.adsStatus : META_ENQUIRY.fields.en.adsStatus,
        trackingStatus: thai ? META_ENQUIRY.fields.th.tracking : META_ENQUIRY.fields.en.tracking,
        challenge: thai ? META_ENQUIRY.fields.th.challenge : META_ENQUIRY.fields.en.challenge,
        consent: thai ? META_ENQUIRY.labels.th.consent : META_ENQUIRY.labels.en.consent,
        privacy: thai ? META_ENQUIRY.labels.th.privacy : META_ENQUIRY.labels.en.privacy,
      },
      visual: {
        src: "",
        altTh: META_TEAM_VISUAL.alt.th,
        altEn: META_TEAM_VISUAL.alt.en,
        status: "placeholder",
        label: META_TEAM_VISUAL.label,
        caption: "",
        containsMetaBrand: false,
        brandNote: "",
      },
    },
    faqs: faqs.map((item, index) => ({ id: `faq-${index + 1}`, q: item.q, a: item.a })),
    seo: { social: emptySocial(thai) },
  };
}

function emptySocial(thai: boolean): CmsAdsVisual {
  return {
    src: "",
    altTh: thai ? "หน้าบริการ Meta Ads Management สำหรับโรงแรม" : "Meta Ads Management service page for hotels",
    altEn: "Meta Ads Management service page for hotels",
    status: "placeholder",
    label: "Open Graph",
    caption: "",
    containsMetaBrand: false,
    brandNote: "",
  };
}
