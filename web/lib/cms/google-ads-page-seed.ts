import {
  ADS_CHANNEL_ROWS,
  ADS_CHANNEL_VISUAL,
  ADS_ENQUIRY,
  ADS_ENQUIRY_RECEIVE,
  ADS_TEAM_VISUAL,
  ADS_HERO_VISUAL,
  ADS_KPIS,
  ADS_KPI_VISUAL,
  ADS_FRAMEWORK_ROWS,
  ADS_LANDING_CHECKLIST,
  ADS_READINESS_VISUAL,
  ADS_RELATED_VISUAL,
  ADS_TRACKING_BOUNDARY,
  ADS_VISIBILITY_VISUAL,
  ADS_WORKFLOW_STEPS,
  ADS_WORKFLOW_VISUAL,
  adsFaqs,
} from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";
import { defaultGoogleAdsRelatedCards, GOOGLE_ADS_CMS_TEMPLATE, type CmsAdsVisual, type CmsGoogleAdsPage } from "./google-ads-page";

function sampleVisual(label: string, altTh: string, altEn: string, caption: string): CmsAdsVisual {
  return { src: "", altTh, altEn, status: "sample", label, caption, containsGoogleBrand: false, brandNote: "" };
}

export function defaultGoogleAdsCms(locale: Locale = "th"): CmsGoogleAdsPage {
  const thai = locale === "th";
  const faqs = adsFaqs(locale);

  return {
    version: 1,
    template: GOOGLE_ADS_CMS_TEMPLATE,
    hero: {
      eyebrow: thai ? "Google Ads สำหรับโรงแรม" : "Google Ads for hotels",
      title: thai
        ? "เมื่อลูกค้าค้นหาที่พัก ให้เขาเจอโรงแรมของคุณและจองต่อได้ง่าย"
        : "When guests search for a stay, help them find your hotel and book without extra friction",
      description: thai
        ? "คำค้นชื่อโรงแรมหรือที่พักในพื้นที่ต้องโยงกับโครงสร้างแคมเปญ โฆษณาต้องพาไปหน้าโรงแรมที่เกี่ยวข้อง และเส้นทางจองต้องวัดผลได้ เดอะ เคพีไอ พลัส ช่วยทบทวนและปรับกระบวนการนี้ เมื่อโรงแรมอนุมัติให้ใช้บริการ"
        : "Hotel-name searches and area-stay searches need a campaign structure that matches intent. The ad should open a relevant hotel page, and the booking path has to be measurable. The KPI Plus reviews and improves this process where the service is approved.",
      primaryCta: {
        label: thai ? "ให้ทีมดูโอกาสเพิ่มการจองตรง" : "Ask the team to review a direct-booking opportunity",
        href: "#google-ads-enquiry",
      },
      secondaryCta: { label: thai ? "ดูโซลูชันทั้งหมด" : "All solutions", href: "/solutions" },
      underCta: thai
        ? "ส่งชื่อโรงแรม เว็บไซต์ และลิงก์หน้าจองให้ทีมดูเบื้องต้น"
        : "Send the hotel name, website, and booking-page link for a first look.",
      caption: thai ? ADS_HERO_VISUAL.caption.th : ADS_HERO_VISUAL.caption.en,
      visual: sampleVisual(
        thai ? ADS_HERO_VISUAL.label.th : ADS_HERO_VISUAL.label.en,
        ADS_HERO_VISUAL.alt.th,
        ADS_HERO_VISUAL.alt.en,
        thai ? ADS_HERO_VISUAL.caption.th : ADS_HERO_VISUAL.caption.en,
      ),
    },
    visibility: {
      title: thai ? "ลูกค้ากำลังเปรียบเทียบที่พักของคุณอยู่บน Google" : "Guests are already comparing your hotel on Google",
      body: thai
        ? "เมื่อลูกค้าค้นหาที่พัก โรงแรมอาจปรากฏจาก Search Ads, Hotel Ads, Free Booking Links หรือผลการค้นหาทั่วไป แต่ละช่องทางควรพาไปหน้าโรงแรมที่เกี่ยวข้อง แล้วเข้าสู่ระบบจองได้ ทีมไม่สัญญาอันดับแรก ยอดจอง หรือ ROAS"
        : "When a guest searches for a stay, the hotel may appear through Search Ads, Hotel Ads, free booking links, or organic results. Each of those should open a relevant hotel page, then a booking engine. The team does not promise top ranking, guaranteed bookings, or a set ROAS.",
      note: thai
        ? "Search Ads, Hotel Ads, Free Booking Links และการค้นหาทั่วไปมีรูปแบบต่างกัน หลังคลิก หน้าโรงแรมและเส้นทางจองต้องเดินต่อได้ ทีมไม่สัญญาอันดับแรก ยอดจอง หรือ ROAS"
        : "Search Ads, Hotel Ads, Free Booking Links, and organic results work differently. After the click, the hotel page and booking path still have to continue. The team does not promise top ranking, bookings, or ROAS.",
      visual: sampleVisual(
        thai ? ADS_VISIBILITY_VISUAL.label.th : ADS_VISIBILITY_VISUAL.label.en,
        ADS_VISIBILITY_VISUAL.alt.th,
        ADS_VISIBILITY_VISUAL.alt.en,
        thai ? ADS_VISIBILITY_VISUAL.caption.th : ADS_VISIBILITY_VISUAL.caption.en,
      ),
    },
    readiness: {
      title: thai ? "กรอบความพร้อมจากคำค้นถึงการจอง" : "Search-to-Booking Readiness Framework",
      body: thai
        ? "ก่อนขยายงบ ทีมดู Search Intent, โครงสร้างแคมเปญ, หน้าโรงแรม, ประสบการณ์จอง และการวัดผลในตารางเดียว"
        : "Before extra spend, the team reviews search intent, campaign structure, the landing page, the booking path, and measurement in one framework.",
      visual: sampleVisual(
        thai ? ADS_READINESS_VISUAL.label.th : ADS_READINESS_VISUAL.label.en,
        ADS_READINESS_VISUAL.alt.th,
        ADS_READINESS_VISUAL.alt.en,
        thai ? ADS_READINESS_VISUAL.caption.th : ADS_READINESS_VISUAL.caption.en,
      ),
      items: ADS_FRAMEWORK_ROWS.map((item, index) => ({
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
      title: thai ? "โรงแรมของคุณควรเริ่มจากช่องทางไหน?" : "Which path should this hotel start with?",
      visual: sampleVisual(
        ADS_CHANNEL_VISUAL.label.en,
        ADS_CHANNEL_VISUAL.alt.th,
        ADS_CHANNEL_VISUAL.alt.en,
        thai ? ADS_CHANNEL_VISUAL.caption.th : ADS_CHANNEL_VISUAL.caption.en,
      ),
      rows: ADS_CHANNEL_ROWS.map((item, index) => ({
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
    workflow: {
      title: thai ? "ดูทั้งโฆษณาและการจอง ไม่ดูแค่จำนวนคลิก" : "Review the ads and the booking, not clicks alone",
      visual: sampleVisual(
        ADS_WORKFLOW_VISUAL.label.en,
        ADS_WORKFLOW_VISUAL.alt.th,
        ADS_WORKFLOW_VISUAL.alt.en,
        thai ? ADS_WORKFLOW_VISUAL.caption.th : ADS_WORKFLOW_VISUAL.caption.en,
      ),
      steps: ADS_WORKFLOW_STEPS.map((item, index) => ({
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
    checklists: {
      tracking: {
        title: thai ? ADS_TRACKING_BOUNDARY.title.th : ADS_TRACKING_BOUNDARY.title.en,
        note: thai ? ADS_TRACKING_BOUNDARY.note.th : ADS_TRACKING_BOUNDARY.note.en,
        items: [...(thai ? ADS_TRACKING_BOUNDARY.items.th : ADS_TRACKING_BOUNDARY.items.en)],
      },
      landing: {
        title: thai ? ADS_LANDING_CHECKLIST.title.th : ADS_LANDING_CHECKLIST.title.en,
        note: thai ? ADS_LANDING_CHECKLIST.note.th : ADS_LANDING_CHECKLIST.note.en,
        items: [...(thai ? ADS_LANDING_CHECKLIST.items.th : ADS_LANDING_CHECKLIST.items.en)],
      },
    },
    measure: {
      title: thai ? "ตัวเลขที่สำคัญกว่าคลิก คือสิ่งที่ลูกค้าทำต่อ" : "What the guest does next matters more than the click",
      intro: thai
        ? "เราดูว่าคำค้นใดพาลูกค้ามาถึงหน้าเว็บ ลูกค้าเข้าสู่หน้าห้องพักหรือระบบจองหรือไม่ มีการสอบถามหรือจองจริงเท่าไร และต้นทุนของผลลัพธ์นั้นเหมาะกับรายได้ที่โรงแรมได้รับหรือไม่"
        : "We look at which searches bring guests to the site, whether they reach a room page or the booking system, how many enquire or book, and whether the cost of that result fits the revenue the hotel receives.",
      close: thai
        ? "ความสามารถในการวัดยอดจองและรายได้ขึ้นอยู่กับเว็บไซต์ ระบบจอง และการตั้งค่าติดตามผลของโรงแรม ทีมจะตรวจสิ่งที่วัดได้จริงก่อนกำหนดรายงาน"
        : "How far bookings and revenue can be measured depends on the website, booking system, and tracking the hotel already has. The team checks what can actually be measured before agreeing the report.",
      visual: sampleVisual(
        ADS_KPI_VISUAL.label.en,
        ADS_KPI_VISUAL.alt.th,
        ADS_KPI_VISUAL.alt.en,
        thai ? ADS_KPI_VISUAL.caption.th : ADS_KPI_VISUAL.caption.en,
      ),
      kpis: ADS_KPIS.map((kpi) => ({
        id: kpi.id,
        name: kpi.name,
        definition: thai ? kpi.definitionTh : kpi.definitionEn,
        unit: kpi.unit,
        period: "",
        target: "",
        value: "",
        context: thai ? kpi.contextTh : kpi.contextEn,
        labels: [],
        values: [],
        tone: kpi.tone,
        dataStatus: "sample" as const,
        updatedAt: "",
        hideUntilData: true,
      })),
    },
    related: {
      title: thai ? "เรื่องที่เกี่ยวข้องกับการค้นหา เว็บไซต์ และการจองตรง" : "Related reading on search, the website, and direct booking",
      visual: sampleVisual(
        ADS_RELATED_VISUAL.label.en,
        ADS_RELATED_VISUAL.alt.th,
        ADS_RELATED_VISUAL.alt.en,
        thai ? ADS_RELATED_VISUAL.caption.th : ADS_RELATED_VISUAL.caption.en,
      ),
      cards: defaultGoogleAdsRelatedCards(locale),
    },
    form: {
      kicker: "Google Ads",
      heading: thai ? ADS_ENQUIRY.heading.th : ADS_ENQUIRY.heading.en,
      lead: thai ? ADS_ENQUIRY.lead.th : ADS_ENQUIRY.lead.en,
      submit: thai ? ADS_ENQUIRY.submit.th : ADS_ENQUIRY.submit.en,
      receiveTitle: thai ? ADS_ENQUIRY.receiveTitle.th : ADS_ENQUIRY.receiveTitle.en,
      receive: ADS_ENQUIRY_RECEIVE.map((item) => item.title),
      nextTitle: thai ? ADS_ENQUIRY.nextTitle.th : ADS_ENQUIRY.nextTitle.en,
      steps: thai ? [...ADS_ENQUIRY.steps.th] : [...ADS_ENQUIRY.steps.en],
      labels: {
        name: thai ? ADS_ENQUIRY.labels.th.name : ADS_ENQUIRY.labels.en.name,
        business: thai ? ADS_ENQUIRY.labels.th.business : ADS_ENQUIRY.labels.en.business,
        contact: thai ? ADS_ENQUIRY.labels.th.contact : ADS_ENQUIRY.labels.en.contact,
        website: thai ? ADS_ENQUIRY.fields.th.website : ADS_ENQUIRY.fields.en.website,
        goal: thai ? ADS_ENQUIRY.fields.th.goal : ADS_ENQUIRY.fields.en.goal,
        market: thai ? ADS_ENQUIRY.fields.th.market : ADS_ENQUIRY.fields.en.market,
        adsStatus: thai ? ADS_ENQUIRY.fields.th.adsStatus : ADS_ENQUIRY.fields.en.adsStatus,
        challenge: thai ? ADS_ENQUIRY.fields.th.challenge : ADS_ENQUIRY.fields.en.challenge,
        consent: thai ? ADS_ENQUIRY.labels.th.consent : ADS_ENQUIRY.labels.en.consent,
        privacy: thai ? ADS_ENQUIRY.labels.th.privacy : ADS_ENQUIRY.labels.en.privacy,
      },
      visual: {
        src: "",
        altTh: ADS_TEAM_VISUAL.alt.th,
        altEn: ADS_TEAM_VISUAL.alt.en,
        status: "placeholder",
        label: ADS_TEAM_VISUAL.label,
        caption: "",
        containsGoogleBrand: false,
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
    altTh: thai ? "หน้าบริการ Google Ads Management สำหรับโรงแรม" : "Google Ads Management service page for hotels",
    altEn: "Google Ads Management service page for hotels",
    status: "placeholder",
    label: "Open Graph",
    caption: "",
    containsGoogleBrand: false,
    brandNote: "",
  };
}
