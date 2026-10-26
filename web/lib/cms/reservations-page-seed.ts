import { enquiryServiceById } from "@/lib/enquiry";
import { faqsForRoute } from "@/lib/faqs";
import {
  formatInsightDate,
  insightExcerpt,
  insightPosts,
  insightUpdatedAt,
  insightsIndexCopy,
} from "@/lib/insights";
import { solutionsIndexCopy } from "@/lib/localized-ui";
import { solutionNavLabel } from "@/lib/nav";
import {
  BOOKING_FLOW_STEPS,
  DEFAULT_RESERVATION_BOUNDARIES,
  HERO_CAPABILITIES,
  RESERVATION_BENEFIT_GROUPS,
  RESERVATION_HANDLE_CATALOGUE,
  RESERVATION_HOTEL_CATALOGUE,
  RESERVATION_KPIS,
  RESERVATION_PROBLEM_ITEMS,
  RESERVATION_WORKFLOW_STEPS,
  RESERVATIONS_BOOKING_FLOW_LABEL,
  RESERVATIONS_BOOKING_FLOW_VISUAL,
  RESERVATIONS_HANDOFF_LABEL,
  RESERVATIONS_HERO_CAPTION,
  RESERVATIONS_HERO_LABEL,
  RESERVATIONS_HERO_VISUAL,
  RESERVATIONS_KPI_LABEL,
  RESERVATIONS_KPI_VISUAL,
  RESERVATIONS_PROBLEM_LABEL,
  RESERVATIONS_PROBLEM_VISUAL,
  RESERVATIONS_RELATED_LABEL,
  RESERVATIONS_RELATED_VISUAL,
  RESERVATIONS_SERVICE_MAP_LABEL,
  RESERVATIONS_SERVICE_MAP_VISUAL,
  RESERVATIONS_TEAM_LABEL,
  RESERVATIONS_TEAM_VISUAL,
  RESERVATIONS_WORKFLOW_VISUAL,
  SCOPE_ITEMS,
  reservationsBookingFlowVisualUrl,
  reservationsHeroVisualUrl,
  reservationsKpiVisualUrl,
  reservationsProblemVisualUrl,
  reservationsRelatedVisualUrl,
  reservationsServiceMapVisualUrl,
  reservationsTeamVisualUrl,
  reservationsWorkflowVisualUrl,
  type ReservationKpi,
  type ReservationServiceBoundaries,
  type ServiceVisual,
} from "@/lib/reservations";
import { localizePath, type Locale } from "@/lib/seo";
import {
  RESERVATIONS_CMS_TEMPLATE,
  RESERVATIONS_PAGE_ROUTE,
  type CmsReservationKpi,
  type CmsReservationsPage,
  type CmsReservationsVisual,
  type CmsRelatedCard,
  type ReservationsKpiStatus,
  type ReservationsVisualStatus,
} from "./reservations-page";

const COPY = {
  th: {
    eyebrow: "บริการทีมรับจองสำหรับโรงแรม",
    title: "ให้เราช่วยดูแลงานจอง เพื่อให้ทีมของคุณมีเวลาดูแลแขก",
    description:
      "ระหว่างเช็กอิน รับโทรศัพท์ ตอบคำถาม และดูแลแขก ทีมโรงแรมอาจไม่มีเวลาติดตามทุกคำถามเรื่องห้องว่างและราคา",
    leadNext:
      "The KPI Plus ช่วยรับและจัดการงานสำรองห้องพัก ตั้งแต่ตอบคำถาม เสนอห้อง ติดตามลูกค้า ไปจนถึงส่งต่อข้อมูลให้ทีมโรงแรม",
    leadClose: "โรงแรมจึงไม่พลาดโอกาสการขาย และทีมหน้างานมีเวลาโฟกัสกับประสบการณ์ของแขกมากขึ้น",
    cta: "ขอประเมินงานจอง",
    secondary: "ดูโซลูชันทั้งหมด",
    underCta: "ส่งช่องทางที่ลูกค้าติดต่อ และช่วงเวลาที่อยากให้ทีมช่วยดูแล",
    problemTitle: "งานจองกำลังดึงเวลาทีมหน้างานไปมากแค่ไหน?",
    problemCaption: "งานจองที่ชัดเจน ช่วยให้ทีมหน้างานโฟกัสกับแขกได้มากขึ้น",
    helpTitle: "เดอะ เคพีไอ พลัส ช่วยดูแลงานอะไร?",
    benefitsTitle: "การจองตรงดีขึ้นได้อย่างไร?",
    benefitsIntro:
      "เมื่อมีคนดูแลคำถามและติดตามลูกค้าอย่างต่อเนื่อง ทุก enquiry จะชัดเจนขึ้น ตั้งแต่ลูกค้าติดต่อเข้ามา จนถึงการยืนยันการจอง",
    benefitsClose: "",
    workflowTitle: "ทีม เดอะ เคพีไอ พลัส กับทีมโรงแรมแบ่งงานกันอย่างไร?",
    noteTitle: "ก่อนเริ่มงาน เราจะตกลงร่วมกันเรื่อง",
    noteBody: "ช่องทางที่ดูแล · เวลาทำการ · สิทธิ์อนุมัติราคา · ขั้นตอนชำระเงิน · ระบบที่ใช้ · วิธีส่งต่อกรณีเร่งด่วน",
    measureTitle: "เราติดตามผลอะไร?",
    measureIntro: "ไม่ใช่แค่ตอบลูกค้าให้เร็ว แต่ดูว่าคำถามแต่ละช่องทางเปลี่ยนเป็นยอดจองได้แค่ไหน",
    measureClose: "เพื่อให้โรงแรมเห็นทั้งคุณภาพการตอบลูกค้า และโอกาสรายได้ที่เกิดขึ้นจริง",
    sampleLabel: "ตัวอย่างข้อมูล · ไม่ใช่ผลลัพธ์ของโรงแรม และไม่มีค่า SLA",
    relatedTitle: "เรื่องที่เกี่ยวข้องกับการจองตรง และงานจอง",
    relatedService: "บริการ",
    relatedMetaService: "หน้าบริการ",
    details: "ดูรายละเอียด",
    conversionTitle: "เพิ่มการจองผ่านเว็บไซต์",
    conversionBody: "เมื่อลูกค้าเริ่มจากเว็บไซต์ เส้นทางสอบถามและจองบนหน้าเว็บยังต้องชัดพอให้เดินต่อได้",
    websiteTitle: "ออกแบบเว็บไซต์โรงแรม",
    websiteBody: "เมื่อเว็บไซต์ยังไม่ช่วยให้ลูกค้ามั่นใจก่อนจอง หรือทีมโรงแรมยังแก้ข้อมูลห้องพักและโปรโมชั่นได้ยาก",
    faqIntro:
      "อ่านคำตอบเหล่านี้ก่อนส่งแบบฟอร์ม เพื่อดูขอบเขตงาน ช่องทาง ระบบ และสิ่งที่โรงแรมต้องเตรียม SLA เวลาทำงาน และการเชื่อมระบบจะตกลงเป็นลายลักษณ์อักษรก่อนเริ่มงาน",
    formNextTitle: "What Happens Next",
    formSteps: [
      "ทีมงานรับข้อมูลโรงแรมเบื้องต้น",
      "ตรวจสอบรูปแบบงานจองและช่องทางที่ใช้อยู่",
      "นัดพูดคุยเรื่อง Scope, Workflow และ SLA",
    ],
    formTrust: [
      "เริ่มจากข้อมูลที่โรงแรมสะดวกแชร์ได้",
      "ขอบเขตงานและ SLA จะตกลงก่อนเริ่มงาน",
      "ข้อมูล Guest และ Booking ต้องได้รับการจัดการอย่างเป็นความลับ",
    ],
    channelsLabel: "ช่องทางงานจองที่ใช้ปัจจุบัน",
    channelsHint: "เช่น LINE, อีเมล, โทรศัพท์, OTA",
    scopeLabel: "ขอบเขตงานที่ต้องการ",
    scopeHint: "งานที่อยากให้ทีมช่วยดูแล",
    workGroup: "งานจอง",
  },
  en: {
    eyebrow: "Outsourced Reservation Management for hotels",
    title: "Let us look after the reservation work, so your team has time for the guest in front of them",
    description:
      "While the team checks guests in, answers the phone, and looks after people already in-house, a new guest asking about rooms or rates can wait too long. The KPI Plus can take and run reservation work on the channels and hours you agree: answering, offering a room, following up, confirming the booking, and handing the details to the hotel team.",
    leadNext: "",
    leadClose:
      "The hotel then has help looking after a sales chance, while the people on the floor can stay with the guest experience.",
    cta: "Ask the team to review the hotel’s reservation work",
    secondary: "All solutions",
    underCta: "Send the channels guests use, and the hours or tasks you want help with.",
    problemTitle: "How much reservation work is taking the floor team away from guests?",
    problemCaption: "Sample data · Reservation Queue / Booking Inbox",
    helpTitle: "What reservation work can The KPI Plus look after?",
    benefitsTitle: "How can direct bookings improve?",
    benefitsIntro:
      "When someone looks after the questions and the follow-up, a guest who contacts the hotel directly gets a clear answer and knows how to book, whether they started on the website, Google, LINE, or the phone.",
    benefitsClose: "",
    workflowTitle: "How do The KPI Plus and the hotel team share the work?",
    noteTitle: "",
    noteBody:
      "Before work starts, both teams agree the channels, working hours, who can approve a rate, the payment steps, system access, and how urgent cases are handed over.",
    measureTitle: "What do we review?",
    measureIntro:
      "Useful measures can include reply time, how many people asked, which channel they used, how many questions became bookings, and follow-up finished on time.",
    measureClose:
      "These facts help the hotel see both the quality of the reply and a revenue chance. How we report depends on the channels and systems the hotel already uses.",
    sampleLabel: "Sample Visual. Not hotel results, and no SLA values.",
    relatedTitle: "Related Direct Booking and Reservations content",
    relatedService: "Service",
    relatedMetaService: "Service page",
    details: "Read more",
    conversionTitle: "Website Conversion",
    conversionBody: "When the guest starts on the website, the enquiry and booking path still has to be clear enough to continue.",
    websiteTitle: "Hotel Website Design",
    websiteBody: "When the website does not help guests feel sure before they book, or the hotel team cannot easily update rooms and offers.",
    faqIntro:
      "Read these answers before sending the form, so the hotel can see the scope, channels, systems, and what to prepare. SLA, hours of cover, and any system connection are agreed in writing before work starts.",
    formNextTitle: "What Happens Next",
    formSteps: [
      "The team receives the hotel’s basic details",
      "Review the current reservation work and channels",
      "Arrange a conversation on scope, workflow, and SLA",
    ],
    formTrust: [
      "Start with the information the hotel is comfortable sharing",
      "Scope and SLA are agreed before work starts",
      "Guest and booking data must be handled confidentially",
    ],
    channelsLabel: "Current reservation channels",
    channelsHint: "For example LINE, email, phone, OTA",
    scopeLabel: "Requested service scope",
    scopeHint: "The reservation work you want help with",
    workGroup: "Reservation work",
  },
} as const;

function extra(locale: Locale) {
  return locale === "th" ? COPY.th : COPY.en;
}

function visualFrom(
  source: ServiceVisual,
  src: string | undefined,
  label: string,
  caption = "",
): CmsReservationsVisual {
  const hasSrc = Boolean(src);
  const status: ReservationsVisualStatus = hasSrc
    ? source.status === "placeholder"
      ? "sample"
      : source.status
    : "placeholder";
  return {
    src: src || "",
    altTh: source.altTh,
    altEn: source.altEn,
    status,
    label,
    caption,
  };
}

function kpiStatus(status: ReservationKpi["dataStatus"]): ReservationsKpiStatus {
  const next = status.toLowerCase();
  if (next === "anonymised") return "anonymised";
  if (next === "approved") return "approved";
  return "sample";
}

function kpiFromDefinition(kpi: ReservationKpi, locale: Locale): CmsReservationKpi {
  return {
    id: kpi.id,
    name: kpi.name,
    definition: locale === "th" ? kpi.definitionTh : kpi.definitionEn,
    unit: kpi.unit || "",
    period: locale === "th" ? kpi.periodTh : kpi.periodEn,
    target: typeof kpi.target === "number" ? String(kpi.target) : "",
    value: typeof kpi.value === "number" ? String(kpi.value) : "",
    dataStatus: kpiStatus(kpi.dataStatus),
    values: [...kpi.values],
    labels: [...kpi.labels],
    hideUntilData: Boolean(kpi.hideUntilData),
  };
}

function relatedCards(locale: Locale): CmsRelatedCard[] {
  const t = extra(locale);
  const insightsUi = insightsIndexCopy[locale] ?? insightsIndexCopy.en;
  const cards: CmsRelatedCard[] = [];
  const post = insightPosts.find((item) => item.href === "/insights/direct-booking-journey-audit");
  if (post) {
    const updated = insightUpdatedAt(post);
    cards.push({
      id: post.slug,
      href: post.href,
      category: post.category[locale] || post.category.th,
      title: post.title[locale] || post.title.th,
      description: insightExcerpt(post, locale),
      meta: `${updated ? insightsUi.updated : insightsUi.published} ${formatInsightDate(updated || post.publishedAt, locale)}`,
      cta: insightsUi.read,
    });
  }
  const websiteBody =
    solutionsIndexCopy[locale].problems["/solutions/hotel-website-design"] || t.websiteBody;
  return [
    ...cards,
    {
      id: "direct-bookings",
      href: "/solutions/hotel-direct-bookings",
      category: t.relatedService,
      title: solutionNavLabel("/solutions/hotel-direct-bookings", locale) || t.conversionTitle,
      description: t.conversionBody,
      meta: t.relatedMetaService,
      cta: t.details,
    },
    {
      id: "website",
      href: "/solutions/hotel-website-design",
      category: t.relatedService,
      title: solutionNavLabel("/solutions/hotel-website-design", locale) || t.websiteTitle,
      description: websiteBody,
      meta: t.relatedMetaService,
      cta: t.details,
    },
  ];
}

export function applyReservationSettingBoundaries(
  content: CmsReservationsPage,
  setting: ReservationServiceBoundaries,
  locale: Locale,
): CmsReservationsPage {
  const thai = locale === "th";
  return {
    ...content,
    boundaries: {
      handles: setting.handles.map((item) => ({ ...item })),
      hotelOwns: setting.hotelOwns.map((item) => ({ ...item })),
      supportedChannels: [...setting.supportedChannels],
      supportedLanguages: [...setting.supportedLanguages],
      operatingHours: setting.operatingHours ?? "",
      slaText: thai ? setting.slaTextTh || "" : setting.slaTextEn || setting.slaTextTh || "",
      slaApproved: Boolean((thai ? setting.slaTextTh : setting.slaTextEn) || setting.slaTextTh),
      escalationPath: setting.escalationPath ?? "",
      integrationNotes: setting.integrationNotes ?? "",
      reportingFrequency: setting.reportingFrequency ?? "",
      privacyNote: thai ? setting.privacyNoteTh || "" : setting.privacyNoteEn || setting.privacyNoteTh || "",
    },
  };
}

export function defaultReservationsCms(
  locale: Locale,
  setting?: ReservationServiceBoundaries,
): CmsReservationsPage {
  const t = extra(locale);
  const thai = locale === "th";
  const service = enquiryServiceById("reservations");
  const faqs = faqsForRoute(localizePath(RESERVATIONS_PAGE_ROUTE, locale)).map((item, index) => ({
    id: `faq-${index + 1}`,
    q: item.q,
    a: item.a,
  }));
  const heroSrc = reservationsHeroVisualUrl();
  const problemSrc = reservationsProblemVisualUrl();
  const mapSrc = reservationsServiceMapVisualUrl();
  const flowSrc = reservationsBookingFlowVisualUrl();
  const workflowSrc = reservationsWorkflowVisualUrl();
  const kpiSrc = reservationsKpiVisualUrl();
  const relatedSrc = reservationsRelatedVisualUrl([heroSrc, problemSrc]);
  const teamSrc = reservationsTeamVisualUrl([heroSrc, problemSrc]);
  const solutions = locale === "th" ? "/solutions" : localizePath("/solutions", locale);
  const boundaries = setting ?? DEFAULT_RESERVATION_BOUNDARIES;

  const content: CmsReservationsPage = {
    version: 1,
    template: RESERVATIONS_CMS_TEMPLATE,
    hero: {
      eyebrow: t.eyebrow,
      title: t.title,
      description: t.description,
      leadNext: t.leadNext,
      leadClose: t.leadClose,
      primaryCta: { label: t.cta, href: "#reservations-enquiry" },
      secondaryCta: { label: t.secondary, href: solutions },
      underCta: t.underCta,
      caption: thai ? RESERVATIONS_HERO_CAPTION.th : RESERVATIONS_HERO_CAPTION.en,
      capabilities: HERO_CAPABILITIES.map((item) => (thai ? item.th : item.en)),
      visual: visualFrom(
        RESERVATIONS_HERO_VISUAL,
        heroSrc,
        thai ? RESERVATIONS_HERO_LABEL.th : RESERVATIONS_HERO_LABEL.en,
        thai ? RESERVATIONS_HERO_CAPTION.th : RESERVATIONS_HERO_CAPTION.en,
      ),
    },
    problemsSection: {
      title: t.problemTitle,
      caption: t.problemCaption,
      visualLabel: RESERVATIONS_PROBLEM_LABEL,
      visual: visualFrom(RESERVATIONS_PROBLEM_VISUAL, problemSrc, RESERVATIONS_PROBLEM_LABEL, t.problemCaption),
    },
    problems: RESERVATION_PROBLEM_ITEMS.map((item, index) => ({
      id: `problem-${index + 1}`,
      problem: thai ? item.problemTh : item.problemEn,
      impact: thai ? item.impactTh : item.impactEn,
      support: thai ? item.supportTh : item.supportEn,
      order: index + 1,
    })),
    scopeSection: {
      title: t.helpTitle,
      mapStatus: mapSrc ? "sample" : "placeholder",
      mapLabel: RESERVATIONS_SERVICE_MAP_LABEL,
      visual: visualFrom(RESERVATIONS_SERVICE_MAP_VISUAL, mapSrc, RESERVATIONS_SERVICE_MAP_LABEL),
    },
    scopeItems: SCOPE_ITEMS.map((item) => ({
      id: item.id,
      title: thai ? item.titleTh : item.titleEn,
      description: thai ? item.descriptionTh : item.descriptionEn,
      input: thai ? item.inputTh : item.inputEn,
      output: thai ? item.outputTh : item.outputEn,
      channels: (item.channels ?? []).join(", "),
      order: item.order,
    })),
    benefitsSection: {
      title: t.benefitsTitle,
      intro: t.benefitsIntro,
      close: t.benefitsClose,
      visual: visualFrom(RESERVATIONS_BOOKING_FLOW_VISUAL, flowSrc, RESERVATIONS_BOOKING_FLOW_LABEL),
    },
    benefitGroups: RESERVATION_BENEFIT_GROUPS.map((group) => ({
      id: group.id,
      title: thai ? `${group.titleEn} · ${group.titleTh}` : group.titleEn,
      items: group.items.map((item) => (thai ? item.th : item.en)),
    })),
    flowSteps: BOOKING_FLOW_STEPS.map((step) => ({ id: step.id, number: step.number, label: step.label })),
    workflowSection: {
      title: t.workflowTitle,
      noteTitle: t.noteTitle,
      noteBody: t.noteBody,
      visual: visualFrom(RESERVATIONS_WORKFLOW_VISUAL, workflowSrc, RESERVATIONS_HANDOFF_LABEL),
    },
    workflowSteps: RESERVATION_WORKFLOW_STEPS.map((step) => ({
      id: step.id,
      number: step.number,
      title: thai ? step.titleTh : step.titleEn,
      description: thai ? step.descriptionTh : step.descriptionEn,
      owner: thai ? step.ownerTh : step.ownerEn,
      input: thai ? step.inputTh || "" : step.inputEn || "",
      output: thai ? step.outputTh : step.outputEn,
      escalation: thai ? step.escalationTh || "" : step.escalationEn || "",
      order: step.order,
    })),
    measureSection: {
      title: t.measureTitle,
      intro: t.measureIntro,
      close: t.measureClose,
      sampleLabel: t.sampleLabel,
      visual: visualFrom(RESERVATIONS_KPI_VISUAL, kpiSrc, RESERVATIONS_KPI_LABEL, t.sampleLabel),
    },
    kpis: RESERVATION_KPIS.map((kpi) => kpiFromDefinition(kpi, locale)),
    related: {
      title: t.relatedTitle,
      visual: visualFrom(RESERVATIONS_RELATED_VISUAL, relatedSrc, RESERVATIONS_RELATED_LABEL),
      cards: relatedCards(locale),
    },
    form: {
      kicker: service?.kicker[locale] ?? service?.kicker.en ?? "Reservations",
      heading: service?.title[locale] ?? service?.title.en ?? "",
      lead: service?.body[locale] ?? service?.body.en ?? "",
      nextTitle: t.formNextTitle,
      steps: [...t.formSteps],
      trust: [...t.formTrust],
      submit: service?.submit[locale] ?? service?.submit.en ?? "",
      workGroup: t.workGroup,
      channelsLabel: t.channelsLabel,
      channelsHint: t.channelsHint,
      scopeLabel: t.scopeLabel,
      scopeHint: t.scopeHint,
      visual: visualFrom(RESERVATIONS_TEAM_VISUAL, teamSrc, RESERVATIONS_TEAM_LABEL),
    },
    faqIntro: t.faqIntro,
    faqs,
    boundaries: {
      handles: RESERVATION_HANDLE_CATALOGUE.map((item) => ({ ...item, configured: true })),
      hotelOwns: RESERVATION_HOTEL_CATALOGUE.map((item) => ({ ...item, configured: true })),
      supportedChannels: [...DEFAULT_RESERVATION_BOUNDARIES.supportedChannels],
      supportedLanguages: [...DEFAULT_RESERVATION_BOUNDARIES.supportedLanguages],
      operatingHours: DEFAULT_RESERVATION_BOUNDARIES.operatingHours ?? "",
      slaText: thai
        ? DEFAULT_RESERVATION_BOUNDARIES.slaTextTh ?? ""
        : DEFAULT_RESERVATION_BOUNDARIES.slaTextEn ?? "",
      slaApproved: true,
      escalationPath: DEFAULT_RESERVATION_BOUNDARIES.escalationPath ?? "",
      integrationNotes: DEFAULT_RESERVATION_BOUNDARIES.integrationNotes ?? "",
      reportingFrequency: DEFAULT_RESERVATION_BOUNDARIES.reportingFrequency ?? "",
      privacyNote: thai
        ? DEFAULT_RESERVATION_BOUNDARIES.privacyNoteTh ?? ""
        : DEFAULT_RESERVATION_BOUNDARIES.privacyNoteEn ?? "",
    },
    seo: { social: { src: "", altTh: "", altEn: "", status: "placeholder", label: "Social image", caption: "" } },
  };

  return applyReservationSettingBoundaries(content, boundaries, locale);
}
