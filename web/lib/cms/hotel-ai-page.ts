import {
  HOTEL_AI_ACCESS_MATRIX,
  HOTEL_AI_CASES,
  HOTEL_AI_CASES_VISUAL,
  HOTEL_AI_DATA_FLOW,
  HOTEL_AI_DIAGNOSTIC,
  HOTEL_AI_ENQUIRY_GOALS,
  HOTEL_AI_ENQUIRY_VISUAL,
  HOTEL_AI_EVIDENCE_VISUAL,
  HOTEL_AI_FIT,
  HOTEL_AI_FIT_NOT_READY,
  HOTEL_AI_FIT_VISUAL,
  HOTEL_AI_HANDOFF_STEPS,
  HOTEL_AI_HERO_VISUAL,
  HOTEL_AI_HUMAN_REVIEW,
  HOTEL_AI_OWNERSHIP,
  HOTEL_AI_OWNERSHIP_VISUAL,
  HOTEL_AI_PAINS,
  HOTEL_AI_PAIN_VISUAL,
  HOTEL_AI_PILOT_CHARTER,
  HOTEL_AI_PILOT_DECISIONS,
  HOTEL_AI_PILOT_STEPS,
  HOTEL_AI_PILOT_VISUAL,
  HOTEL_AI_PROCESS,
  HOTEL_AI_RELATED_VISUAL,
  HOTEL_AI_ROADMAP_VISUAL,
  HOTEL_AI_SCORECARD,
  HOTEL_AI_SCORECARD_VISUAL,
  hotelAiCopy,
  hotelAiEnquiryCopy,
  hotelAiFaqs,
  hotelAiRelatedCards,
} from "@/lib/hotel-ai";
import { pages, type Locale } from "@/lib/seo";

export const HOTEL_AI_CMS_TEMPLATE = "hotel-ai-automation";
export const HOTEL_AI_PAGE_SLUG = "solutions/hotel-ai-automation";
export const HOTEL_AI_PAGE_ROUTE = "/solutions/hotel-ai-automation";
export const HOTEL_AI_CMS_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export type HotelAiCmsIntent = (typeof HOTEL_AI_CMS_INTENTS)[number];
export type HotelAiCmsSaveResult = { ok: true; id: string; intent: HotelAiCmsIntent } | { ok: false; error: string };
export type HotelAiVisualStatus = "replace" | "sample" | "approved";
export type HotelAiKpiStatus = "draft" | "sample" | "not-configured" | "approved";
export type HotelAiClaimStatus = "unpublished" | "sample" | "approved";

export const HOTEL_AI_VISUAL_STATUSES: Array<{ id: HotelAiVisualStatus; label: string }> = [
  { id: "replace", label: "Replace" },
  { id: "sample", label: "Sample" },
  { id: "approved", label: "Approved" },
];
export const HOTEL_AI_KPI_STATUSES: Array<{ id: HotelAiKpiStatus; label: string }> = [
  { id: "not-configured", label: "Not configured" },
  { id: "draft", label: "Draft" },
  { id: "sample", label: "Sample" },
  { id: "approved", label: "Approved" },
];
export const HOTEL_AI_CLAIM_STATUSES: Array<{ id: HotelAiClaimStatus; label: string }> = [
  { id: "unpublished", label: "Unpublished" },
  { id: "sample", label: "Sample" },
  { id: "approved", label: "Approved" },
];

export type CmsHotelAiCta = { label: string; href: string };
export type CmsHotelAiVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: HotelAiVisualStatus | string;
  label: string;
  caption: string;
  source: string;
  approvalNote: string;
  publicationApproved: boolean;
};
export type CmsHotelAiLine = { id: string; th: string; en: string };
export type CmsHotelAiFaq = { id: string; q: string; a: string; qEn: string; aEn: string };
export type CmsHotelAiPain = { id: string; th: string; en: string };
export type CmsHotelAiDiagnostic = {
  id: string;
  symptomTh: string;
  symptomEn: string;
  questionTh: string;
  questionEn: string;
  evidenceTh: string;
  evidenceEn: string;
  ownerTh: string;
  ownerEn: string;
};
export type CmsHotelAiHandoff = { id: string; th: string; en: string; friction: string };
export type CmsHotelAiProcessStep = {
  id: string;
  num: string;
  label: string;
  titleTh: string;
  titleEn: string;
  bodyTh: string;
  bodyEn: string;
  outputTh: string;
  outputEn: string;
  ownerTh: string;
  ownerEn: string;
  gateTh: string;
  gateEn: string;
};
export type CmsHotelAiUseCase = {
  id: string;
  shortTh: string;
  shortEn: string;
  titleTh: string;
  titleEn: string;
  taskTh: string;
  taskEn: string;
  inputTh: string;
  inputEn: string;
  simplifyTh: string;
  simplifyEn: string;
  automateTh: string;
  automateEn: string;
  reviewTh: string;
  reviewEn: string;
  outputTh: string;
  outputEn: string;
  dependencyTh: string;
  dependencyEn: string;
  cautionTh: string;
  cautionEn: string;
  fallbackTh: string;
  fallbackEn: string;
  sample: boolean;
};
export type CmsHotelAiPilotField = { id: string; labelTh: string; labelEn: string; valueTh: string; valueEn: string };
export type CmsHotelAiPilotDecision = { id: string; label: string; th: string; en: string };
export type CmsHotelAiEvidenceClaim = {
  id: string;
  titleTh: string;
  titleEn: string;
  number: string;
  unit: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceDate: string;
  taskDefinitionTh: string;
  taskDefinitionEn: string;
  contextTh: string;
  contextEn: string;
  methodTh: string;
  methodEn: string;
  limitationsTh: string;
  limitationsEn: string;
  permission: boolean;
  publicationStatus: HotelAiClaimStatus | string;
  unpublishedReasonTh: string;
  unpublishedReasonEn: string;
};
export type CmsHotelAiKpi = {
  id: string;
  label: string;
  tone: string;
  definitionTh: string;
  definitionEn: string;
  periodTh: string;
  periodEn: string;
  sourceTh: string;
  sourceEn: string;
  ownerTh: string;
  ownerEn: string;
  baseline: string;
  pilot: string;
  dataStatus: HotelAiKpiStatus | string;
  hideUntilComplete: boolean;
};
export type CmsHotelAiAccessRow = {
  id: string;
  categoryTh: string;
  categoryEn: string;
  ownerTh: string;
  ownerEn: string;
  allowedTh: string;
  allowedEn: string;
  reviewTh: string;
  reviewEn: string;
  reviewTone: string;
  retentionTh: string;
  retentionEn: string;
};
export type CmsHotelAiFitRow = {
  id: string;
  label: string;
  titleTh: string;
  titleEn: string;
  exampleTh: string;
  exampleEn: string;
  startTh: string;
  startEn: string;
  guardTh: string;
  guardEn: string;
};
export type CmsHotelAiRelatedCard = {
  id: string;
  href: string;
  featured: boolean;
  external: boolean;
  categoryTh: string;
  categoryEn: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  publishedAt: string;
  contentTypeTh: string;
  contentTypeEn: string;
  ctaTh: string;
  ctaEn: string;
  sample: boolean;
};
export type CmsHotelAiFormLabels = {
  name: string;
  role: string;
  business: string;
  workflow: string;
  workflowHint: string;
  workload: string;
  systems: string;
  systemsHint: string;
  goal: string;
  contact: string;
  consent: string;
  privacy: string;
  optional: string;
  required: string;
};
export type CmsHotelAiSeoVariant = { locale: string; title: string; description: string; canonical: string };
export type CmsHotelAiApprovals = {
  clientNames: boolean;
  teamPhotos: boolean;
  clientLogos: boolean;
  results: boolean;
  performanceClaims: boolean;
  evidenceNote: string;
};
export type CmsHotelAiPage = {
  version: 1;
  template: typeof HOTEL_AI_CMS_TEMPLATE;
  bilingualPublish: boolean;
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleRest: string;
    description: string;
    close: string;
    underCta: string;
    primaryCta: CmsHotelAiCta;
    secondaryCta: CmsHotelAiCta;
    trust: CmsHotelAiLine[];
    visual: CmsHotelAiVisual;
  };
  pains: {
    title: string;
    lead: string;
    checkTitle: string;
    checkLead: string;
    caption: string;
    visual: CmsHotelAiVisual;
    items: CmsHotelAiPain[];
    diagnostic: CmsHotelAiDiagnostic[];
    handoff: CmsHotelAiHandoff[];
  };
  process: {
    title: string;
    lead: string;
    outputLabel: string;
    gateLabel: string;
    cta: string;
    visual: CmsHotelAiVisual;
    steps: CmsHotelAiProcessStep[];
  };
  cases: {
    title: string;
    lead: string;
    note: string;
    visual: CmsHotelAiVisual;
    items: CmsHotelAiUseCase[];
  };
  pilot: {
    title: string;
    lead: string;
    charterTitle: string;
    charterLead: string;
    charterCaption: string;
    decisionTitle: string;
    decisionLead: string;
    close: string;
    visual: CmsHotelAiVisual;
    steps: CmsHotelAiLine[];
    charter: CmsHotelAiPilotField[];
    decisions: CmsHotelAiPilotDecision[];
  };
  evidence: {
    title: string;
    takeawayLead: string;
    takeawayClose: string;
    body: string;
    sourceLabel: string;
    contextLabel: string;
    measureLabel: string;
    noteLabel: string;
    source: string;
    context: string;
    measure: string;
    note: string;
    visual: CmsHotelAiVisual;
    claims: CmsHotelAiEvidenceClaim[];
  };
  measure: {
    title: string;
    lead: string;
    caption: string;
    empty: string;
    emptyNote: string;
    reviewNote: string;
    close: string;
    updatedLabel: string;
    ownerLabel: string;
    updatedValue: string;
    ownerValue: string;
    visual: CmsHotelAiVisual;
    kpis: CmsHotelAiKpi[];
  };
  ownership: {
    title: string;
    lead: string;
    flowTitle: string;
    principlesTitle: string;
    matrixTitle: string;
    caption: string;
    reviewLead: string;
    close: string;
    visual: CmsHotelAiVisual;
    principles: CmsHotelAiLine[];
    flow: CmsHotelAiLine[];
    reviewItems: CmsHotelAiLine[];
    matrix: CmsHotelAiAccessRow[];
  };
  fit: {
    title: string;
    lead: string;
    note: string;
    notTitle: string;
    notLead: string;
    caption: string;
    visual: CmsHotelAiVisual;
    items: CmsHotelAiFitRow[];
    notItems: CmsHotelAiLine[];
  };
  related: {
    title: string;
    lead: string;
    visual: CmsHotelAiVisual;
    cards: CmsHotelAiRelatedCard[];
    closerTitle: string;
    closerBody: string;
    closerCta: string;
    closerHref: string;
  };
  form: {
    kicker: string;
    title: string;
    body: string;
    submit: string;
    nextTitle: string;
    steps: CmsHotelAiLine[];
    note: string;
    labels: CmsHotelAiFormLabels;
    goals: CmsHotelAiLine[];
    visual: CmsHotelAiVisual;
  };
  faqs: CmsHotelAiFaq[];
  faqLead: string;
  faqLeadEn: string;
  seo: { canonical: string; social: CmsHotelAiVisual; variants: CmsHotelAiSeoVariant[] };
  approvals: CmsHotelAiApprovals;
};

function fromLibraryVisual(
  visual: {
    src: string;
    altTh: string;
    altEn: string;
    status: string;
    labelTh: string;
    labelEn: string;
    captionTh: string;
    captionEn: string;
  },
  locale: Locale,
): CmsHotelAiVisual {
  const thai = locale === "th";
  return {
    src: visual.src,
    altTh: visual.altTh,
    altEn: visual.altEn,
    status: visual.status || "sample",
    label: thai ? visual.labelTh : visual.labelEn,
    caption: thai ? visual.captionTh : visual.captionEn,
    source: "",
    approvalNote: "",
    publicationApproved: false,
  };
}

function emptyVisual(): CmsHotelAiVisual {
  return {
    src: "",
    altTh: "",
    altEn: "",
    status: "sample",
    label: "",
    caption: "",
    source: "",
    approvalNote: "",
    publicationApproved: false,
  };
}

function emptyLabels(): CmsHotelAiFormLabels {
  return {
    name: "",
    role: "",
    business: "",
    workflow: "",
    workflowHint: "",
    workload: "",
    systems: "",
    systemsHint: "",
    goal: "",
    contact: "",
    consent: "",
    privacy: "",
    optional: "",
    required: "",
  };
}

function emptyApprovals(): CmsHotelAiApprovals {
  return { clientNames: false, teamPhotos: false, clientLogos: false, results: false, performanceClaims: false, evidenceNote: "" };
}

function defaultSeoVariants(): CmsHotelAiSeoVariant[] {
  return [
    { locale: "th", title: "", description: "", canonical: HOTEL_AI_PAGE_ROUTE },
    { locale: "en", title: "", description: "", canonical: "/en/solutions/hotel-ai-automation" },
    { locale: "ru", title: "", description: "", canonical: "/ru/solutions/hotel-ai-automation" },
    { locale: "zh", title: "", description: "", canonical: "/zh/solutions/hotel-ai-automation" },
  ];
}

export function newHotelAiItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function hotelAiCmsNotice(kind: "saved" | "preview" | "duplicate" | "pending" | "dirty" | "ready") {
  if (kind === "preview") return "บันทึกแล้ว — เปิดตัวอย่างในแท็บนี้ / Saved — opening preview in this tab";
  if (kind === "duplicate") return "คัดลอกแล้ว — เปิดฉบับร่างภาษาปลายทางเพื่อตรวจคำแปล / Copied — open the destination-language draft to check the translation";
  if (kind === "pending") return "กำลังบันทึก… / Saving…";
  if (kind === "dirty") return "ยังไม่ได้บันทึก / Unsaved changes";
  if (kind === "ready") return "พร้อมบันทึก / Ready to save";
  return "บันทึกแล้ว / Saved";
}

export function emptyHotelAiCms(): CmsHotelAiPage {
  return {
    version: 1,
    template: HOTEL_AI_CMS_TEMPLATE,
    bilingualPublish: true,
    hero: {
      eyebrow: "",
      titleLead: "",
      titleAccent: "",
      titleRest: "",
      description: "",
      close: "",
      underCta: "",
      primaryCta: { label: "", href: "#technology-enquiry" },
      secondaryCta: { label: "", href: "/solutions/hotel-systems-implementation" },
      trust: [],
      visual: emptyVisual(),
    },
    pains: { title: "", lead: "", checkTitle: "", checkLead: "", caption: "", visual: emptyVisual(), items: [], diagnostic: [], handoff: [] },
    process: { title: "", lead: "", outputLabel: "", gateLabel: "", cta: "", visual: emptyVisual(), steps: [] },
    cases: { title: "", lead: "", note: "", visual: emptyVisual(), items: [] },
    pilot: {
      title: "",
      lead: "",
      charterTitle: "",
      charterLead: "",
      charterCaption: "",
      decisionTitle: "",
      decisionLead: "",
      close: "",
      visual: emptyVisual(),
      steps: [],
      charter: [],
      decisions: [],
    },
    evidence: {
      title: "",
      takeawayLead: "",
      takeawayClose: "",
      body: "",
      sourceLabel: "",
      contextLabel: "",
      measureLabel: "",
      noteLabel: "",
      source: "",
      context: "",
      measure: "",
      note: "",
      visual: emptyVisual(),
      claims: [],
    },
    measure: {
      title: "",
      lead: "",
      caption: "",
      empty: "",
      emptyNote: "",
      reviewNote: "",
      close: "",
      updatedLabel: "",
      ownerLabel: "",
      updatedValue: "",
      ownerValue: "",
      visual: emptyVisual(),
      kpis: [],
    },
    ownership: {
      title: "",
      lead: "",
      flowTitle: "",
      principlesTitle: "",
      matrixTitle: "",
      caption: "",
      reviewLead: "",
      close: "",
      visual: emptyVisual(),
      principles: [],
      flow: [],
      reviewItems: [],
      matrix: [],
    },
    fit: { title: "", lead: "", note: "", notTitle: "", notLead: "", caption: "", visual: emptyVisual(), items: [], notItems: [] },
    related: { title: "", lead: "", visual: emptyVisual(), cards: [], closerTitle: "", closerBody: "", closerCta: "", closerHref: "#technology-enquiry" },
    form: {
      kicker: "",
      title: "",
      body: "",
      submit: "",
      nextTitle: "",
      steps: [],
      note: "",
      labels: emptyLabels(),
      goals: [],
      visual: emptyVisual(),
    },
    faqs: [],
    faqLead: "",
    faqLeadEn: "",
    seo: { canonical: HOTEL_AI_PAGE_ROUTE, social: emptyVisual(), variants: defaultSeoVariants() },
    approvals: emptyApprovals(),
  };
}

export function defaultHotelAiCms(locale: Locale): CmsHotelAiPage {
  const thai = locale === "th";
  const copy = thai ? hotelAiCopy.th : hotelAiCopy.en;
  const enquiry = hotelAiEnquiryCopy(locale);
  const next = emptyHotelAiCms();
  const thFaqs = hotelAiFaqs("th");
  const enFaqs = hotelAiFaqs("en");
  next.hero = {
    eyebrow: copy.eyebrow,
    titleLead: copy.titleLead,
    titleAccent: copy.titleAccent,
    titleRest: copy.titleRest,
    description: copy.lead,
    close: copy.leadClose,
    underCta: copy.underCta,
    primaryCta: { label: copy.cta, href: "#technology-enquiry" },
    secondaryCta: { label: copy.secondary, href: "/solutions/hotel-systems-implementation" },
    trust: copy.trust.map((item, index) => ({ id: `trust-${index + 1}`, th: hotelAiCopy.th.trust[index] || item, en: hotelAiCopy.en.trust[index] || item })),
    visual: fromLibraryVisual(HOTEL_AI_HERO_VISUAL, locale),
  };
  next.pains = {
    title: copy.problemsTitle,
    lead: copy.problemsLead,
    checkTitle: copy.problemsCheckTitle,
    checkLead: copy.problemsCheckLead,
    caption: copy.problemsCheckCaption,
    visual: fromLibraryVisual(HOTEL_AI_PAIN_VISUAL, locale),
    items: HOTEL_AI_PAINS.map((item) => ({ id: item.id, th: item.th, en: item.en })),
    diagnostic: HOTEL_AI_DIAGNOSTIC.map((item) => ({ ...item })),
    handoff: HOTEL_AI_HANDOFF_STEPS.map((item) => ({ id: item.id, th: item.th, en: item.en, friction: item.friction })),
  };
  next.process = {
    title: copy.methodTitle,
    lead: copy.methodLead,
    outputLabel: copy.methodOutput,
    gateLabel: copy.methodGate,
    cta: copy.methodCta,
    visual: fromLibraryVisual(HOTEL_AI_ROADMAP_VISUAL, locale),
    steps: HOTEL_AI_PROCESS.map((item, index) => ({
      id: item.id,
      num: String(index + 1).padStart(2, "0"),
      label: item.label,
      titleTh: item.titleTh,
      titleEn: item.titleEn,
      bodyTh: item.bodyTh,
      bodyEn: item.bodyEn,
      outputTh: item.outputTh,
      outputEn: item.outputEn,
      ownerTh: thai ? "เจ้าของเวิร์กโฟลว์ที่ระบุชื่อได้" : "Named workflow owner",
      ownerEn: "Named workflow owner",
      gateTh: item.gateTh,
      gateEn: item.gateEn,
    })),
  };
  next.cases = {
    title: copy.casesTitle,
    lead: copy.casesLead,
    note: copy.casesNote,
    visual: fromLibraryVisual(HOTEL_AI_CASES_VISUAL, locale),
    items: HOTEL_AI_CASES.map((item) => ({
      ...item,
      fallbackTh: "ทำตาม SOP เดิมด้วยมือเมื่อระบบใช้ไม่ได้",
      fallbackEn: "Follow the current SOP by hand if automation fails",
      sample: true,
    })),
  };
  next.pilot = {
    title: copy.pilotTitle,
    lead: copy.pilotLead,
    charterTitle: copy.pilotCharterTitle,
    charterLead: copy.pilotCharterLead,
    charterCaption: copy.pilotCharterCaption,
    decisionTitle: copy.pilotDecisionTitle,
    decisionLead: copy.pilotDecisionLead,
    close: copy.pilotClose,
    visual: fromLibraryVisual(HOTEL_AI_PILOT_VISUAL, locale),
    steps: HOTEL_AI_PILOT_STEPS.map((item) => ({ id: item.id, th: item.th, en: item.en })),
    charter: HOTEL_AI_PILOT_CHARTER.map((item) => ({ ...item })),
    decisions: HOTEL_AI_PILOT_DECISIONS.map((item) => ({ ...item })),
  };
  next.evidence = {
    title: copy.studyTitle,
    takeawayLead: copy.studyTakeawayLead,
    takeawayClose: copy.studyTakeawayClose,
    body: copy.studyBody,
    sourceLabel: copy.evidenceSourceLabel,
    contextLabel: copy.evidenceContextLabel,
    measureLabel: copy.evidenceMeasureLabel,
    noteLabel: copy.evidenceNoteLabel,
    source: copy.evidenceSource,
    context: copy.evidenceContext,
    measure: copy.evidenceMeasure,
    note: copy.evidenceNote,
    visual: fromLibraryVisual(HOTEL_AI_EVIDENCE_VISUAL, locale),
    claims: [
      {
        id: "unpublished",
        titleTh: "ยังไม่มีกรณีศึกษาที่อนุมัติให้เผยแพร่ตัวเลข",
        titleEn: "No approved case study with publishable figures",
        number: "",
        unit: "",
        sourceUrl: "",
        sourceTitle: "",
        sourceDate: "",
        taskDefinitionTh: "",
        taskDefinitionEn: "",
        contextTh: copy.evidenceContext,
        contextEn: hotelAiCopy.en.evidenceContext,
        methodTh: "",
        methodEn: "",
        limitationsTh: copy.evidenceNote,
        limitationsEn: hotelAiCopy.en.evidenceNote,
        permission: false,
        publicationStatus: "unpublished",
        unpublishedReasonTh: copy.evidenceSource,
        unpublishedReasonEn: hotelAiCopy.en.evidenceSource,
      },
    ],
  };
  next.measure = {
    title: copy.measureTitle,
    lead: copy.measureLead,
    caption: copy.measureCaption,
    empty: copy.measureEmpty,
    emptyNote: copy.measureEmptyNote,
    reviewNote: copy.measureReviewNote,
    close: copy.measureClose,
    updatedLabel: copy.measureUpdatedLabel,
    ownerLabel: copy.measureOwnerLabel,
    updatedValue: copy.measureUpdatedValue,
    ownerValue: copy.measureOwnerValue,
    visual: fromLibraryVisual(HOTEL_AI_SCORECARD_VISUAL, locale),
    kpis: HOTEL_AI_SCORECARD.map((item) => ({
      id: item.id,
      label: item.label,
      tone: item.tone,
      definitionTh: item.definitionTh,
      definitionEn: item.definitionEn,
      periodTh: item.periodTh,
      periodEn: item.periodEn,
      sourceTh: item.sourceTh,
      sourceEn: item.sourceEn,
      ownerTh: item.ownerTh,
      ownerEn: item.ownerEn,
      baseline: "",
      pilot: "",
      dataStatus: "not-configured",
      hideUntilComplete: true,
    })),
  };
  next.ownership = {
    title: copy.ownershipTitle,
    lead: copy.ownershipLead,
    flowTitle: copy.ownershipFlowTitle,
    principlesTitle: copy.ownershipPrinciplesTitle,
    matrixTitle: copy.ownershipMatrixTitle,
    caption: copy.ownershipCaption,
    reviewLead: copy.ownershipReviewLead,
    close: copy.ownershipClose,
    visual: fromLibraryVisual(HOTEL_AI_OWNERSHIP_VISUAL, locale),
    principles: HOTEL_AI_OWNERSHIP.map((item) => ({ id: item.id, th: item.th, en: item.en })),
    flow: HOTEL_AI_DATA_FLOW.map((item) => ({ id: item.id, th: item.th, en: item.en })),
    reviewItems: HOTEL_AI_HUMAN_REVIEW.map((item) => ({ id: item.id, th: item.th, en: item.en })),
    matrix: HOTEL_AI_ACCESS_MATRIX.map((item) => ({ ...item })),
  };
  next.fit = {
    title: copy.fitTitle,
    lead: copy.fitLead,
    note: copy.fitNote,
    notTitle: copy.fitNotReadyTitle,
    notLead: copy.fitNotReadyLead,
    caption: copy.fitCaption,
    visual: fromLibraryVisual(HOTEL_AI_FIT_VISUAL, locale),
    items: HOTEL_AI_FIT.map((item) => ({ ...item })),
    notItems: HOTEL_AI_FIT_NOT_READY.map((item) => ({ id: item.id, th: item.th, en: item.en })),
  };
  const relatedCards = hotelAiRelatedCards(locale);
  next.related = {
    title: copy.relatedTitle,
    lead: copy.relatedLead,
    visual: fromLibraryVisual(HOTEL_AI_RELATED_VISUAL, locale),
    cards: relatedCards.map((card) => ({
      id: card.id,
      href: card.href,
      featured: Boolean(card.featured),
      external: Boolean(card.external),
      categoryTh: card.categoryTh,
      categoryEn: card.categoryEn,
      titleTh: card.titleTh,
      titleEn: card.titleEn,
      descriptionTh: card.descriptionTh,
      descriptionEn: card.descriptionEn,
      publishedAt: card.publishedAt || "",
      contentTypeTh: card.contentTypeTh,
      contentTypeEn: card.contentTypeEn,
      ctaTh: card.ctaTh,
      ctaEn: card.ctaEn,
      sample: Boolean(card.featured),
    })),
    closerTitle: copy.closerTitle,
    closerBody: copy.closerBody,
    closerCta: copy.closerCta,
    closerHref: "#technology-enquiry",
  };
  next.form = {
    kicker: enquiry.kicker,
    title: enquiry.heading,
    body: enquiry.lead,
    submit: enquiry.submit,
    nextTitle: enquiry.nextTitle,
    steps: enquiry.steps.map((step, index) => ({
      id: `next-${index + 1}`,
      th: hotelAiEnquiryCopy("th").steps[index] || step,
      en: hotelAiEnquiryCopy("en").steps[index] || step,
    })),
    note: enquiry.note,
    labels: {
      name: enquiry.labels.name,
      role: enquiry.labels.role,
      business: enquiry.labels.business,
      workflow: enquiry.labels.workflow,
      workflowHint: enquiry.labels.workflowHint,
      workload: enquiry.labels.workload,
      systems: enquiry.labels.systems,
      systemsHint: enquiry.labels.systemsHint,
      goal: enquiry.labels.goal,
      contact: enquiry.labels.contact,
      consent: enquiry.labels.consent,
      privacy: enquiry.labels.privacy,
      optional: enquiry.labels.optional,
      required: enquiry.labels.required,
    },
    goals: HOTEL_AI_ENQUIRY_GOALS.map((item) => ({ id: item.id, th: item.th, en: item.en })),
    visual: fromLibraryVisual(HOTEL_AI_ENQUIRY_VISUAL, locale),
  };
  next.faqs = thFaqs.map((item, index) => ({
    id: `faq-${index + 1}`,
    q: item.q,
    a: item.a,
    qEn: enFaqs[index]?.q || item.q,
    aEn: enFaqs[index]?.a || item.a,
  }));
  next.faqLead = hotelAiCopy.th.faqLead;
  next.faqLeadEn = hotelAiCopy.en.faqLead;
  const thPage = pages.find((item) => item.route === HOTEL_AI_PAGE_ROUTE);
  const enPage = pages.find((item) => item.route === "/en/solutions/hotel-ai-automation");
  next.seo.variants = [
    { locale: "th", title: thPage?.title || `${copy.titleLead} ${copy.titleAccent} ${copy.titleRest}`.replace(/\s+/g, " ").trim(), description: thPage?.description || hotelAiCopy.th.lead, canonical: HOTEL_AI_PAGE_ROUTE },
    { locale: "en", title: enPage?.title || `${hotelAiCopy.en.titleLead} ${hotelAiCopy.en.titleAccent} ${hotelAiCopy.en.titleRest}`.replace(/\s+/g, " ").trim(), description: enPage?.description || hotelAiCopy.en.lead, canonical: "/en/solutions/hotel-ai-automation" },
    { locale: "ru", title: enPage?.title || hotelAiCopy.en.titleLead, description: enPage?.description || hotelAiCopy.en.lead, canonical: "/ru/solutions/hotel-ai-automation" },
    { locale: "zh", title: enPage?.title || hotelAiCopy.en.titleLead, description: enPage?.description || hotelAiCopy.en.lead, canonical: "/zh/solutions/hotel-ai-automation" },
  ];
  next.seo.canonical = locale === "th" ? HOTEL_AI_PAGE_ROUTE : `/en/solutions/hotel-ai-automation`;
  next.seo.social = { ...emptyVisual(), status: "sample", label: "Sample social image", caption: "Sample · Not a live client result", altTh: HOTEL_AI_HERO_VISUAL.altTh, altEn: HOTEL_AI_HERO_VISUAL.altEn };
  return next;
}

function asVisual(row: unknown, fallback: CmsHotelAiVisual): CmsHotelAiVisual {
  const value = (row ?? {}) as Record<string, unknown>;
  return {
    src: String(value.src ?? fallback.src),
    altTh: String(value.altTh ?? fallback.altTh),
    altEn: String(value.altEn ?? fallback.altEn),
    status: String(value.status ?? fallback.status),
    label: String(value.label ?? fallback.label),
    caption: String(value.caption ?? fallback.caption),
    source: String(value.source ?? fallback.source ?? ""),
    approvalNote: String(value.approvalNote ?? fallback.approvalNote ?? ""),
    publicationApproved: Boolean(value.publicationApproved ?? fallback.publicationApproved),
  };
}

function asCta(row: unknown, fallback: CmsHotelAiCta): CmsHotelAiCta {
  const value = (row ?? {}) as Record<string, unknown>;
  return { label: String(value.label ?? fallback.label), href: String(value.href ?? fallback.href) };
}

function asText(row: Record<string, unknown> | undefined, key: string, fallback: string) {
  return String(row?.[key] ?? fallback);
}

function asList<T>(value: unknown, fallback: T[], map: (row: Record<string, unknown>, index: number, seeded: T) => T): T[] {
  if (!Array.isArray(value) || !value.length) return fallback;
  return value.map((item, index) => {
    const seeded = fallback[index] ?? fallback[0] ?? ({} as T);
    return map((item ?? {}) as Record<string, unknown>, index, seeded);
  });
}

function mergeMissingById<T extends { id: string }>(items: T[], seeded: T[]): T[] {
  const have = new Set(items.map((item) => item.id));
  return [...items, ...seeded.filter((item) => !have.has(item.id))];
}

function asLine(row: Record<string, unknown>, index: number, seeded?: CmsHotelAiLine): CmsHotelAiLine {
  return {
    id: String(row.id || seeded?.id || `line-${index + 1}`),
    th: String(row.th ?? seeded?.th ?? ""),
    en: String(row.en ?? seeded?.en ?? ""),
  };
}

export function parseHotelAiPageBody(body: string, locale: Locale = "th"): CmsHotelAiPage | null {
  try {
    const parsed = JSON.parse(body) as Partial<CmsHotelAiPage> & { template?: string };
    if (parsed?.template && parsed.template !== HOTEL_AI_CMS_TEMPLATE) return null;
    const seeded = defaultHotelAiCms(locale);
    const hero = (parsed.hero || {}) as Record<string, unknown>;
    const pains = (parsed.pains || {}) as Record<string, unknown>;
    const process = (parsed.process || {}) as Record<string, unknown>;
    const cases = (parsed.cases || {}) as Record<string, unknown>;
    const pilot = (parsed.pilot || {}) as Record<string, unknown>;
    const evidence = (parsed.evidence || {}) as Record<string, unknown>;
    const measure = (parsed.measure || {}) as Record<string, unknown>;
    const ownership = (parsed.ownership || {}) as Record<string, unknown>;
    const fit = (parsed.fit || {}) as Record<string, unknown>;
    const related = (parsed.related || {}) as Record<string, unknown>;
    const form = (parsed.form || {}) as Record<string, unknown>;
    const labels = (form.labels || {}) as Record<string, unknown>;
    const approvals = (parsed.approvals || {}) as Record<string, unknown>;
    return {
      version: 1,
      template: HOTEL_AI_CMS_TEMPLATE,
      bilingualPublish: parsed.bilingualPublish ?? seeded.bilingualPublish,
      faqLead: String(parsed.faqLead ?? seeded.faqLead),
      faqLeadEn: String(parsed.faqLeadEn ?? seeded.faqLeadEn),
      hero: {
        eyebrow: asText(hero, "eyebrow", seeded.hero.eyebrow),
        titleLead: asText(hero, "titleLead", seeded.hero.titleLead),
        titleAccent: asText(hero, "titleAccent", seeded.hero.titleAccent),
        titleRest: asText(hero, "titleRest", seeded.hero.titleRest),
        description: asText(hero, "description", seeded.hero.description),
        close: asText(hero, "close", seeded.hero.close),
        underCta: asText(hero, "underCta", seeded.hero.underCta),
        primaryCta: asCta(hero.primaryCta, seeded.hero.primaryCta),
        secondaryCta: asCta(hero.secondaryCta, seeded.hero.secondaryCta),
        trust: asList(hero.trust, seeded.hero.trust, asLine),
        visual: asVisual(hero.visual, seeded.hero.visual),
      },
      pains: {
        title: asText(pains, "title", seeded.pains.title),
        lead: asText(pains, "lead", seeded.pains.lead),
        checkTitle: asText(pains, "checkTitle", seeded.pains.checkTitle),
        checkLead: asText(pains, "checkLead", seeded.pains.checkLead),
        caption: asText(pains, "caption", seeded.pains.caption),
        visual: asVisual(pains.visual, seeded.pains.visual),
        items: asList(pains.items, seeded.pains.items, (row, index, item) => ({
          id: String(row.id || item.id || `pain-${index + 1}`),
          th: String(row.th ?? item.th),
          en: String(row.en ?? item.en),
        })),
        diagnostic: asList(pains.diagnostic, seeded.pains.diagnostic, (row, index, item) => ({
          id: String(row.id || item.id || `diag-${index + 1}`),
          symptomTh: String(row.symptomTh ?? item.symptomTh),
          symptomEn: String(row.symptomEn ?? item.symptomEn),
          questionTh: String(row.questionTh ?? item.questionTh),
          questionEn: String(row.questionEn ?? item.questionEn),
          evidenceTh: String(row.evidenceTh ?? item.evidenceTh),
          evidenceEn: String(row.evidenceEn ?? item.evidenceEn),
          ownerTh: String(row.ownerTh ?? item.ownerTh),
          ownerEn: String(row.ownerEn ?? item.ownerEn),
        })),
        handoff: asList(pains.handoff, seeded.pains.handoff, (row, index, item) => ({
          id: String(row.id || item.id || `handoff-${index + 1}`),
          th: String(row.th ?? item.th),
          en: String(row.en ?? item.en),
          friction: String(row.friction ?? item.friction ?? "review"),
        })),
      },
      process: {
        title: asText(process, "title", seeded.process.title),
        lead: asText(process, "lead", seeded.process.lead),
        outputLabel: asText(process, "outputLabel", seeded.process.outputLabel),
        gateLabel: asText(process, "gateLabel", seeded.process.gateLabel),
        cta: asText(process, "cta", seeded.process.cta),
        visual: asVisual(process.visual, seeded.process.visual),
        steps: asList(process.steps, seeded.process.steps, (row, index, item) => ({
          id: String(row.id || item.id || `step-${index + 1}`),
          num: String(row.num ?? item.num ?? String(index + 1).padStart(2, "0")),
          label: String(row.label ?? item.label),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          bodyTh: String(row.bodyTh ?? item.bodyTh),
          bodyEn: String(row.bodyEn ?? item.bodyEn),
          outputTh: String(row.outputTh ?? item.outputTh),
          outputEn: String(row.outputEn ?? item.outputEn),
          ownerTh: String(row.ownerTh ?? item.ownerTh),
          ownerEn: String(row.ownerEn ?? item.ownerEn),
          gateTh: String(row.gateTh ?? item.gateTh),
          gateEn: String(row.gateEn ?? item.gateEn),
        })),
      },
      cases: {
        title: asText(cases, "title", seeded.cases.title),
        lead: asText(cases, "lead", seeded.cases.lead),
        note: asText(cases, "note", seeded.cases.note),
        visual: asVisual(cases.visual, seeded.cases.visual),
        items: asList(cases.items, seeded.cases.items, (row, index, item) => ({
          id: String(row.id || item.id || `case-${index + 1}`),
          shortTh: String(row.shortTh ?? item.shortTh),
          shortEn: String(row.shortEn ?? item.shortEn),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          taskTh: String(row.taskTh ?? item.taskTh),
          taskEn: String(row.taskEn ?? item.taskEn),
          inputTh: String(row.inputTh ?? item.inputTh),
          inputEn: String(row.inputEn ?? item.inputEn),
          simplifyTh: String(row.simplifyTh ?? item.simplifyTh),
          simplifyEn: String(row.simplifyEn ?? item.simplifyEn),
          automateTh: String(row.automateTh ?? item.automateTh),
          automateEn: String(row.automateEn ?? item.automateEn),
          reviewTh: String(row.reviewTh ?? item.reviewTh),
          reviewEn: String(row.reviewEn ?? item.reviewEn),
          outputTh: String(row.outputTh ?? item.outputTh),
          outputEn: String(row.outputEn ?? item.outputEn),
          dependencyTh: String(row.dependencyTh ?? item.dependencyTh),
          dependencyEn: String(row.dependencyEn ?? item.dependencyEn),
          cautionTh: String(row.cautionTh ?? item.cautionTh),
          cautionEn: String(row.cautionEn ?? item.cautionEn),
          fallbackTh: String(row.fallbackTh ?? item.fallbackTh),
          fallbackEn: String(row.fallbackEn ?? item.fallbackEn),
          sample: Boolean(row.sample ?? item.sample),
        })),
      },
      pilot: {
        title: asText(pilot, "title", seeded.pilot.title),
        lead: asText(pilot, "lead", seeded.pilot.lead),
        charterTitle: asText(pilot, "charterTitle", seeded.pilot.charterTitle),
        charterLead: asText(pilot, "charterLead", seeded.pilot.charterLead),
        charterCaption: asText(pilot, "charterCaption", seeded.pilot.charterCaption),
        decisionTitle: asText(pilot, "decisionTitle", seeded.pilot.decisionTitle),
        decisionLead: asText(pilot, "decisionLead", seeded.pilot.decisionLead),
        close: asText(pilot, "close", seeded.pilot.close),
        visual: asVisual(pilot.visual, seeded.pilot.visual),
        steps: asList(pilot.steps, seeded.pilot.steps, asLine),
        charter: mergeMissingById(
          asList(pilot.charter, seeded.pilot.charter, (row, index, item) => ({
            id: String(row.id || item.id || `charter-${index + 1}`),
            labelTh: String(row.labelTh ?? item.labelTh),
            labelEn: String(row.labelEn ?? item.labelEn),
            valueTh: String(row.valueTh ?? item.valueTh),
            valueEn: String(row.valueEn ?? item.valueEn),
          })),
          seeded.pilot.charter,
        ),
        decisions: asList(pilot.decisions, seeded.pilot.decisions, (row, index, item) => ({
          id: String(row.id || item.id || `decision-${index + 1}`),
          label: String(row.label ?? item.label),
          th: String(row.th ?? item.th),
          en: String(row.en ?? item.en),
        })),
      },
      evidence: {
        title: asText(evidence, "title", seeded.evidence.title),
        takeawayLead: asText(evidence, "takeawayLead", seeded.evidence.takeawayLead),
        takeawayClose: asText(evidence, "takeawayClose", seeded.evidence.takeawayClose),
        body: asText(evidence, "body", seeded.evidence.body),
        sourceLabel: asText(evidence, "sourceLabel", seeded.evidence.sourceLabel),
        contextLabel: asText(evidence, "contextLabel", seeded.evidence.contextLabel),
        measureLabel: asText(evidence, "measureLabel", seeded.evidence.measureLabel),
        noteLabel: asText(evidence, "noteLabel", seeded.evidence.noteLabel),
        source: asText(evidence, "source", seeded.evidence.source),
        context: asText(evidence, "context", seeded.evidence.context),
        measure: asText(evidence, "measure", seeded.evidence.measure),
        note: asText(evidence, "note", seeded.evidence.note),
        visual: asVisual(evidence.visual, seeded.evidence.visual),
        claims: asList(evidence.claims, seeded.evidence.claims, (row, index, item) => ({
          id: String(row.id || item.id || `claim-${index + 1}`),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          number: String(row.number ?? item.number),
          unit: String(row.unit ?? item.unit),
          sourceUrl: String(row.sourceUrl ?? item.sourceUrl),
          sourceTitle: String(row.sourceTitle ?? item.sourceTitle),
          sourceDate: String(row.sourceDate ?? item.sourceDate),
          taskDefinitionTh: String(row.taskDefinitionTh ?? item.taskDefinitionTh),
          taskDefinitionEn: String(row.taskDefinitionEn ?? item.taskDefinitionEn),
          contextTh: String(row.contextTh ?? item.contextTh),
          contextEn: String(row.contextEn ?? item.contextEn),
          methodTh: String(row.methodTh ?? item.methodTh),
          methodEn: String(row.methodEn ?? item.methodEn),
          limitationsTh: String(row.limitationsTh ?? item.limitationsTh),
          limitationsEn: String(row.limitationsEn ?? item.limitationsEn),
          permission: Boolean(row.permission ?? item.permission),
          publicationStatus: String(row.publicationStatus ?? item.publicationStatus ?? "unpublished"),
          unpublishedReasonTh: String(row.unpublishedReasonTh ?? item.unpublishedReasonTh),
          unpublishedReasonEn: String(row.unpublishedReasonEn ?? item.unpublishedReasonEn),
        })),
      },
      measure: {
        title: asText(measure, "title", seeded.measure.title),
        lead: asText(measure, "lead", seeded.measure.lead),
        caption: asText(measure, "caption", seeded.measure.caption),
        empty: asText(measure, "empty", seeded.measure.empty),
        emptyNote: asText(measure, "emptyNote", seeded.measure.emptyNote),
        reviewNote: asText(measure, "reviewNote", seeded.measure.reviewNote),
        close: asText(measure, "close", seeded.measure.close),
        updatedLabel: asText(measure, "updatedLabel", seeded.measure.updatedLabel),
        ownerLabel: asText(measure, "ownerLabel", seeded.measure.ownerLabel),
        updatedValue: asText(measure, "updatedValue", seeded.measure.updatedValue),
        ownerValue: asText(measure, "ownerValue", seeded.measure.ownerValue),
        visual: asVisual(measure.visual, seeded.measure.visual),
        kpis: asList(measure.kpis, seeded.measure.kpis, (row, index, item) => ({
          id: String(row.id || item.id || `kpi-${index + 1}`),
          label: String(row.label ?? item.label),
          tone: String(row.tone ?? item.tone),
          definitionTh: String(row.definitionTh ?? item.definitionTh),
          definitionEn: String(row.definitionEn ?? item.definitionEn),
          periodTh: String(row.periodTh ?? item.periodTh),
          periodEn: String(row.periodEn ?? item.periodEn),
          sourceTh: String(row.sourceTh ?? item.sourceTh),
          sourceEn: String(row.sourceEn ?? item.sourceEn),
          ownerTh: String(row.ownerTh ?? item.ownerTh),
          ownerEn: String(row.ownerEn ?? item.ownerEn),
          baseline: String(row.baseline ?? item.baseline),
          pilot: String(row.pilot ?? item.pilot),
          dataStatus: String(row.dataStatus ?? item.dataStatus ?? "not-configured"),
          hideUntilComplete: Boolean(row.hideUntilComplete ?? item.hideUntilComplete),
        })),
      },
      ownership: {
        title: asText(ownership, "title", seeded.ownership.title),
        lead: asText(ownership, "lead", seeded.ownership.lead),
        flowTitle: asText(ownership, "flowTitle", seeded.ownership.flowTitle),
        principlesTitle: asText(ownership, "principlesTitle", seeded.ownership.principlesTitle),
        matrixTitle: asText(ownership, "matrixTitle", seeded.ownership.matrixTitle),
        caption: asText(ownership, "caption", seeded.ownership.caption),
        reviewLead: asText(ownership, "reviewLead", seeded.ownership.reviewLead),
        close: asText(ownership, "close", seeded.ownership.close),
        visual: asVisual(ownership.visual, seeded.ownership.visual),
        principles: asList(ownership.principles, seeded.ownership.principles, asLine),
        flow: asList(ownership.flow, seeded.ownership.flow, asLine),
        reviewItems: asList(ownership.reviewItems, seeded.ownership.reviewItems, asLine),
        matrix: asList(ownership.matrix, seeded.ownership.matrix, (row, index, item) => ({
          id: String(row.id || item.id || `access-${index + 1}`),
          categoryTh: String(row.categoryTh ?? item.categoryTh),
          categoryEn: String(row.categoryEn ?? item.categoryEn),
          ownerTh: String(row.ownerTh ?? item.ownerTh),
          ownerEn: String(row.ownerEn ?? item.ownerEn),
          allowedTh: String(row.allowedTh ?? item.allowedTh),
          allowedEn: String(row.allowedEn ?? item.allowedEn),
          reviewTh: String(row.reviewTh ?? item.reviewTh),
          reviewEn: String(row.reviewEn ?? item.reviewEn),
          reviewTone: String(row.reviewTone ?? item.reviewTone),
          retentionTh: String(row.retentionTh ?? item.retentionTh),
          retentionEn: String(row.retentionEn ?? item.retentionEn),
        })),
      },
      fit: {
        title: asText(fit, "title", seeded.fit.title),
        lead: asText(fit, "lead", seeded.fit.lead),
        note: asText(fit, "note", seeded.fit.note),
        notTitle: asText(fit, "notTitle", seeded.fit.notTitle),
        notLead: asText(fit, "notLead", seeded.fit.notLead),
        caption: asText(fit, "caption", seeded.fit.caption),
        visual: asVisual(fit.visual, seeded.fit.visual),
        items: asList(fit.items, seeded.fit.items, (row, index, item) => ({
          id: String(row.id || item.id || `fit-${index + 1}`),
          label: String(row.label ?? item.label),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          exampleTh: String(row.exampleTh ?? item.exampleTh),
          exampleEn: String(row.exampleEn ?? item.exampleEn),
          startTh: String(row.startTh ?? item.startTh),
          startEn: String(row.startEn ?? item.startEn),
          guardTh: String(row.guardTh ?? item.guardTh),
          guardEn: String(row.guardEn ?? item.guardEn),
        })),
        notItems: asList(fit.notItems, seeded.fit.notItems, asLine),
      },
      related: {
        title: asText(related, "title", seeded.related.title),
        lead: asText(related, "lead", seeded.related.lead),
        visual: asVisual(related.visual, seeded.related.visual),
        cards: asList(related.cards, seeded.related.cards, (row, index, item) => ({
          id: String(row.id || item.id || `related-${index + 1}`),
          href: String(row.href ?? item.href),
          featured: Boolean(row.featured ?? item.featured),
          external: Boolean(row.external ?? item.external),
          categoryTh: String(row.categoryTh ?? item.categoryTh),
          categoryEn: String(row.categoryEn ?? item.categoryEn),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          descriptionTh: String(row.descriptionTh ?? item.descriptionTh),
          descriptionEn: String(row.descriptionEn ?? item.descriptionEn),
          publishedAt: String(row.publishedAt ?? item.publishedAt),
          contentTypeTh: String(row.contentTypeTh ?? item.contentTypeTh),
          contentTypeEn: String(row.contentTypeEn ?? item.contentTypeEn),
          ctaTh: String(row.ctaTh ?? item.ctaTh),
          ctaEn: String(row.ctaEn ?? item.ctaEn),
          sample: Boolean(row.sample ?? item.sample),
        })),
        closerTitle: asText(related, "closerTitle", seeded.related.closerTitle),
        closerBody: asText(related, "closerBody", seeded.related.closerBody),
        closerCta: asText(related, "closerCta", seeded.related.closerCta),
        closerHref: asText(related, "closerHref", seeded.related.closerHref),
      },
      form: {
        kicker: asText(form, "kicker", seeded.form.kicker),
        title: asText(form, "title", seeded.form.title),
        body: asText(form, "body", seeded.form.body),
        submit: asText(form, "submit", seeded.form.submit),
        nextTitle: asText(form, "nextTitle", seeded.form.nextTitle),
        steps: asList(form.steps, seeded.form.steps, asLine),
        note: asText(form, "note", seeded.form.note),
        labels: {
          name: String(labels.name ?? seeded.form.labels.name),
          role: String(labels.role ?? seeded.form.labels.role),
          business: String(labels.business ?? seeded.form.labels.business),
          workflow: String(labels.workflow ?? seeded.form.labels.workflow),
          workflowHint: String(labels.workflowHint ?? seeded.form.labels.workflowHint),
          workload: String(labels.workload ?? seeded.form.labels.workload),
          systems: String(labels.systems ?? seeded.form.labels.systems),
          systemsHint: String(labels.systemsHint ?? seeded.form.labels.systemsHint),
          goal: String(labels.goal ?? seeded.form.labels.goal),
          contact: String(labels.contact ?? seeded.form.labels.contact),
          consent: String(labels.consent ?? seeded.form.labels.consent),
          privacy: String(labels.privacy ?? seeded.form.labels.privacy),
          optional: String(labels.optional ?? seeded.form.labels.optional),
          required: String(labels.required ?? seeded.form.labels.required),
        },
        goals: asList(form.goals, seeded.form.goals, asLine),
        visual: asVisual(form.visual, seeded.form.visual),
      },
      faqs: Array.isArray(parsed.faqs) && parsed.faqs.length
        ? parsed.faqs.map((row, index) => ({
            id: String(row.id || `faq-${index + 1}`),
            q: String(row.q || ""),
            a: String(row.a || ""),
            qEn: String(row.qEn || ""),
            aEn: String(row.aEn || ""),
          }))
        : seeded.faqs,
      seo: {
        canonical: String(parsed.seo?.canonical || HOTEL_AI_PAGE_ROUTE),
        social: asVisual(parsed.seo?.social, seeded.seo.social),
        variants: asList(parsed.seo?.variants, seeded.seo.variants, (row, index, item) => ({
          locale: String(row.locale ?? item.locale ?? (index === 0 ? "th" : "en")),
          title: String(row.title ?? item.title),
          description: String(row.description ?? item.description),
          canonical: String(row.canonical ?? item.canonical),
        })),
      },
      approvals: {
        clientNames: Boolean(approvals.clientNames),
        teamPhotos: Boolean(approvals.teamPhotos),
        clientLogos: Boolean(approvals.clientLogos),
        results: Boolean(approvals.results),
        performanceClaims: Boolean(approvals.performanceClaims),
        evidenceNote: String(approvals.evidenceNote ?? ""),
      },
    };
  } catch {
    return null;
  }
}

export function serializeHotelAiPageBody(content: CmsHotelAiPage) {
  return JSON.stringify({ ...content, version: 1, template: HOTEL_AI_CMS_TEMPLATE });
}

export function isHotelAiCmsBody(body: string) {
  try {
    const parsed = JSON.parse(body) as { template?: string };
    return parsed?.template === HOTEL_AI_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function isHotelAiPageDocument(input: { slug: string; template: string }) {
  if (input.template === HOTEL_AI_CMS_TEMPLATE) return true;
  return (
    input.slug === HOTEL_AI_PAGE_SLUG ||
    input.slug === "en/solutions/hotel-ai-automation" ||
    input.slug === "ru/solutions/hotel-ai-automation" ||
    input.slug === "zh/solutions/hotel-ai-automation"
  );
}

const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;
const PLACEHOLDER_RE = /placeholder|dummy|replace with/i;
const SECRET_ASSIGN_RE =
  /(api[_-\s]?key|secret[_-\s]?key|password|passwd|auth[_-\s]?token|access[_-\s]?token|bearer|account[_-\s]?id|booking[_-\s]?id|reservation[_-\s]?id|guest\s+(name|email|phone|data)|payment\s+(data|token|card)|credit\s*card|cvv|รหัสผ่าน|รหัส\s*API|โทเคน|เลขที่บัญชี)\s*[:=]\s*\S+/i;
const SECRET_TOKEN_RE = /\b(sk_live_|pk_live_|sk_test_|rk_live_|Bearer\s+[A-Za-z0-9\-._]{12,})\b/;
const NUMBER_RE = /\d+(\.\d+)?/;

function walkStrings(value: unknown, visit: (text: string) => void) {
  if (typeof value === "string") visit(value);
  else if (Array.isArray(value)) value.forEach((item) => walkStrings(item, visit));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walkStrings(item, visit));
}

function hasSampleMark(text: string) {
  return /sample|ตัวอย่าง/i.test(text);
}

function visualIsPublishable(visual: CmsHotelAiVisual, bilingual: boolean) {
  if (!visual.src.trim()) return null;
  if (!visual.altTh.trim()) return "missing_alt";
  if (bilingual && !visual.altEn.trim()) return "missing_alt";
  const status = String(visual.status || "replace");
  if (status === "placeholder" || status === "replace") return "placeholder_status";
  if (status !== "approved" && status !== "sample") return "placeholder_status";
  if (PLACEHOLDER_RE.test(`${visual.src} ${visual.label} ${visual.caption}`) && status !== "sample") return "placeholder_label";
  if (status === "sample" && !hasSampleMark(`${visual.label} ${visual.caption}`)) return "missing_sample_label";
  if (status === "approved" && !PLACEHOLDER_RE.test(visual.src) && !visual.publicationApproved) return "screenshot_approval";
  return null;
}

function textHasSecrets(text: string) {
  return SECRET_ASSIGN_RE.test(text) || SECRET_TOKEN_RE.test(text);
}

function contentHasSecrets(content: CmsHotelAiPage) {
  let found = false;
  walkStrings(content, (text) => {
    if (textHasSecrets(text)) found = true;
  });
  return found;
}

function claimHasNumber(claim: CmsHotelAiEvidenceClaim) {
  return Boolean(claim.number.trim() && NUMBER_RE.test(claim.number));
}

function claimEvidenceComplete(claim: CmsHotelAiEvidenceClaim, bilingual: boolean) {
  const task = bilingual ? claim.taskDefinitionTh.trim() && claim.taskDefinitionEn.trim() : claim.taskDefinitionTh.trim() || claim.taskDefinitionEn.trim();
  const context = bilingual ? claim.contextTh.trim() && claim.contextEn.trim() : claim.contextTh.trim() || claim.contextEn.trim();
  const method = bilingual ? claim.methodTh.trim() && claim.methodEn.trim() : claim.methodTh.trim() || claim.methodEn.trim();
  const limits = bilingual ? claim.limitationsTh.trim() && claim.limitationsEn.trim() : claim.limitationsTh.trim() || claim.limitationsEn.trim();
  return Boolean(
    claim.sourceUrl.trim() &&
      CTA_RE.test(claim.sourceUrl.trim()) &&
      claim.sourceTitle.trim() &&
      claim.sourceDate.trim() &&
      task &&
      context &&
      method &&
      limits &&
      claim.permission &&
      claim.publicationStatus === "approved",
  );
}

function kpiHasValue(kpi: CmsHotelAiKpi) {
  return Boolean(kpi.baseline.trim() || kpi.pilot.trim());
}

function kpiComplete(kpi: CmsHotelAiKpi, bilingual: boolean) {
  const definition = bilingual ? kpi.definitionTh.trim() && kpi.definitionEn.trim() : kpi.definitionTh.trim() || kpi.definitionEn.trim();
  const period = bilingual ? kpi.periodTh.trim() && kpi.periodEn.trim() : kpi.periodTh.trim() || kpi.periodEn.trim();
  const source = bilingual ? kpi.sourceTh.trim() && kpi.sourceEn.trim() : kpi.sourceTh.trim() || kpi.sourceEn.trim();
  const owner = bilingual ? kpi.ownerTh.trim() && kpi.ownerEn.trim() : kpi.ownerTh.trim() || kpi.ownerEn.trim();
  return Boolean(definition && period && source && owner && kpi.dataStatus.trim());
}

export function publicHotelAiClaimNumber(claim: CmsHotelAiEvidenceClaim, bilingual: boolean) {
  if (!claimHasNumber(claim) || !claimEvidenceComplete(claim, bilingual)) return "";
  return claim.number.trim();
}

export function publicHotelAiKpiValues(kpi: CmsHotelAiKpi, bilingual: boolean) {
  if (kpi.hideUntilComplete || kpi.dataStatus === "draft" || kpi.dataStatus === "not-configured") {
    return { baseline: "", pilot: "" };
  }
  if (!kpiComplete(kpi, bilingual) || (kpi.dataStatus !== "approved" && kpi.dataStatus !== "sample")) {
    return { baseline: "", pilot: "" };
  }
  return { baseline: kpi.baseline, pilot: kpi.pilot };
}

export function validateHotelAiPage(content: CmsHotelAiPage, intent: HotelAiCmsIntent) {
  if (intent === "unpublish") return null;
  if (contentHasSecrets(content)) return "blocked_secret";
  if (intent !== "publish") return null;
  if (!content.hero.titleLead.trim() || !content.hero.description.trim()) return "required_fields";
  if (!content.seo.canonical.trim() || !CTA_RE.test(content.seo.canonical.trim())) return "invalid_cta";
  if (!content.form.labels.consent.trim() || !content.form.labels.privacy.trim() || !content.form.submit.trim()) return "invalid_consent";
  const ctas = [
    content.hero.primaryCta,
    content.hero.secondaryCta,
    { label: content.related.closerCta, href: content.related.closerHref },
    ...content.related.cards.map((card) => ({ label: card.ctaTh || card.ctaEn, href: card.href })),
    ...content.seo.variants.map((variant) => ({ label: variant.title, href: variant.canonical })),
  ];
  if (ctas.some((cta) => (cta.label.trim() || cta.href.trim()) && cta.href.trim() && !CTA_RE.test(cta.href.trim()))) {
    return "invalid_cta";
  }
  const visuals = [
    content.hero.visual,
    content.pains.visual,
    content.process.visual,
    content.cases.visual,
    content.pilot.visual,
    content.evidence.visual,
    content.measure.visual,
    content.ownership.visual,
    content.fit.visual,
    content.related.visual,
    content.form.visual,
    content.seo.social,
  ];
  for (const visual of visuals) {
    const invalid = visualIsPublishable(visual, content.bilingualPublish);
    if (invalid) return invalid;
  }
  for (const faq of content.faqs) {
    if (!faq.q.trim() || !faq.a.trim()) return "empty_faq";
    if (content.bilingualPublish && (!faq.qEn.trim() || !faq.aEn.trim())) return "empty_faq_bilingual";
  }
  for (const item of content.cases.items) {
    const reviewer = content.bilingualPublish ? item.reviewTh.trim() && item.reviewEn.trim() : item.reviewTh.trim() || item.reviewEn.trim();
    const fallback = content.bilingualPublish ? item.fallbackTh.trim() && item.fallbackEn.trim() : item.fallbackTh.trim() || item.fallbackEn.trim();
    if (!reviewer || !fallback) return "missing_reviewer";
    if (item.sample && !hasSampleMark(`${item.titleTh} ${item.titleEn} ${content.cases.visual.label} ${content.cases.visual.caption}`)) {
      return "missing_sample_label";
    }
  }
  if (!hasSampleMark(content.pilot.charterCaption) || !hasSampleMark(content.measure.caption) || !hasSampleMark(content.fit.caption)) {
    return "missing_sample_label";
  }
  for (const claim of content.evidence.claims) {
    if (claimHasNumber(claim) && !claimEvidenceComplete(claim, content.bilingualPublish)) return "claim_incomplete";
    if (claim.publicationStatus === "approved" && claimHasNumber(claim) && !content.approvals.results && !claim.permission) {
      return "publication_approval";
    }
  }
  for (const kpi of content.measure.kpis) {
    if (!kpiHasValue(kpi) && (kpi.dataStatus === "draft" || kpi.dataStatus === "not-configured" || kpi.hideUntilComplete)) continue;
    if (kpiHasValue(kpi) && !kpiComplete(kpi, content.bilingualPublish)) return "kpi_incomplete";
    if (kpi.dataStatus === "approved" && kpiHasValue(kpi) && !content.approvals.results) return "publication_approval";
  }
  return null;
}

export type HotelAiEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical: string;
  locale: string;
  status: string;
  content: CmsHotelAiPage;
};

export function editorStateFromHotelAiDocument(input: {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical?: string | null;
  locale: string;
  status: string;
  body: string;
}): HotelAiEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseHotelAiPageBody(input.body, locale) ?? emptyHotelAiCms();
  return {
    id: input.id,
    title: input.title,
    seoTitle: input.seoTitle,
    metaDescription: input.metaDescription,
    excerpt: input.excerpt,
    canonical: input.canonical || content.seo.canonical,
    locale: input.locale,
    status: input.status,
    content,
  };
}

export function hotelAiPublicPath(locale: Locale) {
  const page = pages.find((item) => item.route.endsWith("/solutions/hotel-ai-automation") && item.language === locale);
  return page?.route || (locale === "th" ? HOTEL_AI_PAGE_ROUTE : `/${locale}${HOTEL_AI_PAGE_ROUTE}`);
}

export const HOTEL_AI_CMS_ERRORS_TH: Record<string, string> = {
  required_fields: "กรอกหัวข้อและคำอธิบายก่อนเผยแพร่",
  empty_faq: "คำถามที่พบบ่อยต้องมีคำถามและคำตอบ",
  empty_faq_bilingual: "คำถามที่พบบ่อยต้องมีภาษาไทยและภาษาอังกฤษก่อนเผยแพร่สองภาษา",
  missing_sample_label: "ภาพและเวิร์กโฟลว์ตัวอย่างต้องมีป้าย Sample / ตัวอย่าง ที่มองเห็นก่อนเผยแพร่",
  invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
  invalid_consent: "ฟอร์มต้องมีข้อความความยินยอม นโยบายความเป็นส่วนตัว และปุ่มส่ง",
  missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและภาษาอังกฤษ",
  placeholder_status: "เปลี่ยนสถานะรูปเป็น Sample หรือ Approved ก่อนเผยแพร่",
  placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะไม่ใช่ Sample",
  kpi_incomplete: "KPI ที่ใส่ตัวเลขต้องมีนิยาม ช่วงเวลา แหล่งที่มา ผู้รับผิดชอบ และสถานะ",
  claim_incomplete: "ตัวเลขกรณีศึกษาต้องมี URL ชื่อแหล่งที่มา วันที่ นิยามงาน บริบท วิธีวัด ข้อจำกัด และสิทธิ์เผยแพร่",
  publication_approval: "ผลลัพธ์หรือตัวเลขต้องได้รับอนุมัติก่อนเผยแพร่",
  blocked_secret: "ห้ามใส่คีย์ API รหัสผ่าน โทเคน รหัสบัญชี ข้อมูลแขก รหัสการจอง หรือข้อมูลชำระเงินในเนื้อหาสาธารณะ",
  missing_reviewer: "งานที่มีผลกระทบต้องระบุผู้ตรวจทานที่เป็นคน และวิธีทำด้วยมือเมื่อระบบใช้ไม่ได้",
  screenshot_approval: "ภาพโรงแรมหรือระบบจริงต้องได้รับอนุมัติเผยแพร่",
  invalid_image: "ไฟล์รูปไม่ถูกต้อง",
  invalid_json: "ข้อมูลที่บันทึกไม่ถูกต้อง",
  missing: "ไม่พบหน้าเพจ",
  invalid_locale: "ภาษาปลายทางไม่ถูกต้อง",
  locale_exists: "มีฉบับภาษานี้อยู่แล้ว",
};

export const HOTEL_AI_CMS_ERRORS_EN: Record<string, string> = {
  required_fields: "Add a title and description before publishing",
  empty_faq: "FAQs need a question and an answer",
  empty_faq_bilingual: "FAQs need Thai and English before bilingual publish",
  missing_sample_label: "Sample visuals and workflows need a visible Sample label before publishing",
  invalid_cta: "CTA URLs must be /path, #anchor, mailto, tel, or http(s)",
  invalid_consent: "The form needs consent copy, a privacy link label, and a submit action",
  missing_alt: "Published images need Thai and English alt text",
  placeholder_status: "Set the image status to Sample or Approved before publishing",
  placeholder_label: "Do not publish Placeholder copy unless the status is Sample",
  kpi_incomplete: "KPIs with values need definition, period, source, owner, and status",
  claim_incomplete: "A case-study number needs source URL, title, date, task definition, context, method, limitations, and publication permission",
  publication_approval: "Results and numbers need publication approval",
  blocked_secret: "Do not put API keys, passwords, tokens, account IDs, guest data, booking IDs, or payment data in public fields",
  missing_reviewer: "Consequential workflows need a named human reviewer and a manual fallback",
  screenshot_approval: "Real hotel or system screenshots need publication approval",
  invalid_image: "The image file is not valid",
  invalid_json: "The saved data is not valid",
  missing: "Page not found",
  invalid_locale: "The destination language is not valid",
  locale_exists: "A version in that language already exists",
};

export function hotelAiCmsErrorMessage(code: string) {
  return `${HOTEL_AI_CMS_ERRORS_TH[code] ?? "บันทึกไม่สำเร็จ"} / ${HOTEL_AI_CMS_ERRORS_EN[code] ?? "Save failed"}`;
}
