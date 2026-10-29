import {
  INDEPENDENT_ASSESSMENT_ROWS,
  INDEPENDENT_ASSESSMENT_VISUAL,
  INDEPENDENT_CADENCE,
  INDEPENDENT_DELIVERABLES,
  INDEPENDENT_DELIVERABLES_BOUNDARY,
  INDEPENDENT_DELIVERABLES_VISUAL,
  INDEPENDENT_ENQUIRY_RECEIVE,
  INDEPENDENT_ENQUIRY_VISUAL,
  INDEPENDENT_FIT_NOT,
  INDEPENDENT_FIT_SCENARIOS,
  INDEPENDENT_FIT_VISUAL,
  INDEPENDENT_HERO_VISUAL,
  INDEPENDENT_KPI_SAMPLE,
  INDEPENDENT_KPIS,
  INDEPENDENT_MODEL_BOUNDARY,
  INDEPENDENT_MODEL_STEPS,
  INDEPENDENT_MODEL_VISUAL,
  INDEPENDENT_PLAN,
  INDEPENDENT_PLAN_VISUAL,
  INDEPENDENT_RELATED_VISUAL,
  INDEPENDENT_SCOPE_ROWS,
  INDEPENDENT_SCOPE_VISUAL,
  INDEPENDENT_SERVICES,
  INDEPENDENT_SERVICES_VISUAL,
  INDEPENDENT_SOURCES,
  INDEPENDENT_WORKFLOW,
  INDEPENDENT_WORKFLOW_APPROVALS,
  INDEPENDENT_WORKFLOW_VISUAL,
  INDEPENDENT_WORKSTREAMS,
  independentEnquiryCopy,
  independentHotelCopy,
  independentHotelFaqs,
  independentRelatedCards,
  type IndependentKpiStatus,
  type IndependentSourceStatus,
  type IndependentVisualStatus,
} from "@/lib/independent-hotel";
import { pages, type Locale } from "@/lib/seo";

export const INDEPENDENT_HOTEL_CMS_TEMPLATE = "independent-hotel-management";
export const INDEPENDENT_HOTEL_PAGE_SLUG = "solutions/independent-hotel-management";
export const INDEPENDENT_HOTEL_PAGE_ROUTE = "/solutions/independent-hotel-management";
export const INDEPENDENT_CMS_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export type IndependentCmsIntent = (typeof INDEPENDENT_CMS_INTENTS)[number];
export type IndependentCmsSaveResult = { ok: true; id: string; intent: IndependentCmsIntent } | { ok: false; error: string };

export const INDEPENDENT_CMS_KPI_STATUSES = ["draft", "sample", "approved", "anonymised", "not-configured"] as const;
export const INDEPENDENT_CMS_SOURCE_STATUSES = ["guidance", "sample", "approved"] as const;

export type CmsIndependentCta = { label: string; href: string };
export type CmsIndependentVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: IndependentVisualStatus | string;
  label: string;
  caption: string;
  source: string;
  approvalNote: string;
};
export type CmsIndependentFaq = { id: string; q: string; a: string; qEn: string; aEn: string };
export type CmsIndependentAssessmentRow = {
  id: string;
  num: string;
  titleTh: string;
  titleEn: string;
  questionTh: string;
  questionEn: string;
  symptomTh: string;
  symptomEn: string;
  supportTh: string;
  supportEn: string;
  output: string;
};
export type CmsIndependentWorkstream = {
  id: string;
  num: string;
  titleTh: string;
  titleEn: string;
  bulletsTh: string;
  bulletsEn: string;
};
export type CmsIndependentService = {
  id: string;
  stream: string;
  titleTh: string;
  titleEn: string;
  inputTh: string;
  inputEn: string;
  actionTh: string;
  actionEn: string;
  output: string;
  approvalTh: string;
  approvalEn: string;
  ownerTh: string;
  ownerEn: string;
};
export type CmsIndependentDeliverableRow = {
  id: string;
  areaTh: string;
  areaEn: string;
  supportTh: string;
  supportEn: string;
  deliverable: string;
  approvalTh: string;
  approvalEn: string;
};
export type CmsIndependentWorkflowStep = {
  id: string;
  num: string;
  label: string;
  titleTh: string;
  titleEn: string;
  bodyTh: string;
  bodyEn: string;
  ownerTh: string;
  ownerEn: string;
  inputTh: string;
  inputEn: string;
  actionTh: string;
  actionEn: string;
  output: string;
  approvalTh: string;
  approvalEn: string;
  nextTh: string;
  nextEn: string;
};
export type CmsIndependentFitScenario = {
  id: string;
  situationTh: string;
  situationEn: string;
  symptomTh: string;
  symptomEn: string;
  questionTh: string;
  questionEn: string;
  supportTh: string;
  supportEn: string;
  output: string;
};
export type CmsIndependentLine = { id: string; th: string; en: string };
export type CmsIndependentScopeRow = { id: string; titleTh: string; titleEn: string; itemsTh: string; itemsEn: string };
export type CmsIndependentPlanPhase = {
  id: string;
  label: string;
  labelTh: string;
  itemsTh: string;
  itemsEn: string;
  output: string;
};
export type CmsIndependentCadence = { id: string; label: string; labelTh: string; itemsTh: string; itemsEn: string };
export type CmsIndependentRelatedCard = {
  id: string;
  href: string;
  titleTh: string;
  titleEn: string;
  bodyTh: string;
  bodyEn: string;
  ctaTh: string;
  ctaEn: string;
  publicationApproved: boolean;
};
export type CmsIndependentFormReceive = { id: string; title: string; th: string; en: string };
export type CmsIndependentFormLabels = {
  name: string;
  business: string;
  contact: string;
  rooms: string;
  hotelStatus: string;
  challenge: string;
  teamSize: string;
  website: string;
  systems: string;
  goal: string;
  message: string;
  consent: string;
  privacy: string;
};
export type CmsIndependentKpi = {
  id: string;
  nameTh: string;
  nameEn: string;
  period: string;
  market: string;
  source: string;
  definitionTh: string;
  definitionEn: string;
  unit: string;
  dataStatus: IndependentKpiStatus | string;
  hideUntilData: boolean;
  publicationApproved: boolean;
};
export type CmsIndependentSource = {
  id: string;
  nameTh: string;
  nameEn: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  marketTh: string;
  marketEn: string;
  definitionTh: string;
  definitionEn: string;
  status: IndependentSourceStatus | string;
  approvalNote: string;
};
export type CmsIndependentSeoVariant = { locale: string; title: string; description: string; canonical: string };
export type CmsIndependentApprovals = {
  clientNames: boolean;
  teamPhotos: boolean;
  clientLogos: boolean;
  results: boolean;
  performanceClaims: boolean;
  evidenceNote: string;
};
export type CmsIndependentPage = {
  version: 1;
  template: typeof INDEPENDENT_HOTEL_CMS_TEMPLATE;
  bilingualPublish: boolean;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    close: string;
    underCta: string;
    primaryCta: CmsIndependentCta;
    secondaryCta: CmsIndependentCta;
    visual: CmsIndependentVisual;
  };
  assessment: { title: string; lead: string; close: string; visual: CmsIndependentVisual; rows: CmsIndependentAssessmentRow[] };
  services: {
    title: string;
    lead: string;
    boundary: string;
    visual: CmsIndependentVisual;
    workstreams: CmsIndependentWorkstream[];
    items: CmsIndependentService[];
  };
  model: {
    title: string;
    visual: CmsIndependentVisual;
    steps: Array<{ id: string; num: string; label: string; titleTh: string; titleEn: string; output: string }>;
    supportTitle: string;
    support: string;
    hotelTitle: string;
    hotel: string;
  };
  deliverables: {
    title: string;
    lead: string;
    visual: CmsIndependentVisual;
    rows: CmsIndependentDeliverableRow[];
    supportTitle: string;
    supportItems: CmsIndependentLine[];
    hotelTitle: string;
    hotelItems: CmsIndependentLine[];
    boundary: string;
  };
  workflow: {
    title: string;
    lead: string;
    visual: CmsIndependentVisual;
    steps: CmsIndependentWorkflowStep[];
    approvalsTitle: string;
    approvals: CmsIndependentLine[];
  };
  fit: {
    title: string;
    lead: string;
    visual: CmsIndependentVisual;
    scenarios: CmsIndependentFitScenario[];
    notTitle: string;
    notItems: CmsIndependentLine[];
  };
  scope: { title: string; visual: CmsIndependentVisual; rows: CmsIndependentScopeRow[]; boundary: string };
  plan: {
    title: string;
    lead: string;
    close: string;
    sampleLabel: string;
    cadenceTitle: string;
    visual: CmsIndependentVisual;
    phases: CmsIndependentPlanPhase[];
    cadence: CmsIndependentCadence[];
  };
  measure: { title: string; kpis: CmsIndependentKpi[]; sources: CmsIndependentSource[] };
  related: {
    title: string;
    visual: CmsIndependentVisual;
    cards: CmsIndependentRelatedCard[];
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
    receiveTitle: string;
    receive: CmsIndependentFormReceive[];
    nextTitle: string;
    steps: CmsIndependentLine[];
    note: string;
    labels: CmsIndependentFormLabels;
    visual: CmsIndependentVisual;
  };
  faqs: CmsIndependentFaq[];
  seo: { canonical: string; social: CmsIndependentVisual; variants: CmsIndependentSeoVariant[] };
  approvals: CmsIndependentApprovals;
};

function fromLibraryVisual(
  visual: {
    src: string;
    altTh: string;
    altEn: string;
    status: IndependentVisualStatus;
    labelTh: string;
    labelEn: string;
    captionTh: string;
    captionEn: string;
  },
  locale: Locale,
): CmsIndependentVisual {
  const thai = locale === "th";
  return {
    src: visual.src,
    altTh: visual.altTh,
    altEn: visual.altEn,
    status: visual.status,
    label: thai ? visual.labelTh : visual.labelEn,
    caption: thai ? visual.captionTh : visual.captionEn,
    source: "",
    approvalNote: "",
  };
}

function emptyVisual(): CmsIndependentVisual {
  return { src: "", altTh: "", altEn: "", status: "sample", label: "", caption: "", source: "", approvalNote: "" };
}

function emptyLabels(): CmsIndependentFormLabels {
  return {
    name: "",
    business: "",
    contact: "",
    rooms: "",
    hotelStatus: "",
    challenge: "",
    teamSize: "",
    website: "",
    systems: "",
    goal: "",
    message: "",
    consent: "",
    privacy: "",
  };
}

function emptyApprovals(): CmsIndependentApprovals {
  return { clientNames: false, teamPhotos: false, clientLogos: false, results: false, performanceClaims: false, evidenceNote: "" };
}

function joinLines(items: readonly string[]) {
  return items.join("\n");
}

function defaultSeoVariants(): CmsIndependentSeoVariant[] {
  return [
    { locale: "th", title: "", description: "", canonical: INDEPENDENT_HOTEL_PAGE_ROUTE },
    { locale: "en", title: "", description: "", canonical: "/en/solutions/independent-hotel-management" },
  ];
}

export function splitCmsLines(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

export function newIndependentItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function independentHotelCmsNotice(kind: "saved" | "preview" | "duplicate" | "pending" | "dirty" | "ready") {
  if (kind === "preview") return "บันทึกแล้ว — เปิดตัวอย่างในแท็บนี้ / Saved — opening preview in this tab";
  if (kind === "duplicate") return "คัดลอกแล้ว — เปิดฉบับร่างภาษาปลายทางเพื่อตรวจคำแปล / Copied — open the destination-language draft to check the translation";
  if (kind === "pending") return "กำลังบันทึก… / Saving…";
  if (kind === "dirty") return "ยังไม่ได้บันทึก / Unsaved changes";
  if (kind === "ready") return "พร้อมบันทึก / Ready to save";
  return "บันทึกแล้ว / Saved";
}

export function emptyIndependentHotelCms(): CmsIndependentPage {
  return {
    version: 1,
    template: INDEPENDENT_HOTEL_CMS_TEMPLATE,
    bilingualPublish: true,
    hero: { eyebrow: "", title: "", description: "", close: "", underCta: "", primaryCta: { label: "", href: "#independent-hotel-enquiry" }, secondaryCta: { label: "", href: "/approach" }, visual: emptyVisual() },
    assessment: { title: "", lead: "", close: "", visual: emptyVisual(), rows: [] },
    services: { title: "", lead: "", boundary: "", visual: emptyVisual(), workstreams: [], items: [] },
    model: { title: "", visual: emptyVisual(), steps: [], supportTitle: "", support: "", hotelTitle: "", hotel: "" },
    deliverables: {
      title: "",
      lead: "",
      visual: emptyVisual(),
      rows: [],
      supportTitle: "",
      supportItems: [],
      hotelTitle: "",
      hotelItems: [],
      boundary: "",
    },
    workflow: { title: "", lead: "", visual: emptyVisual(), steps: [], approvalsTitle: "", approvals: [] },
    fit: { title: "", lead: "", visual: emptyVisual(), scenarios: [], notTitle: "", notItems: [] },
    scope: { title: "", visual: emptyVisual(), rows: [], boundary: "" },
    plan: { title: "", lead: "", close: "", sampleLabel: "Sample plan", cadenceTitle: "", visual: emptyVisual(), phases: [], cadence: [] },
    measure: { title: "", kpis: [], sources: [] },
    related: { title: "", visual: emptyVisual(), cards: [], closerTitle: "", closerBody: "", closerCta: "", closerHref: "#independent-hotel-enquiry" },
    form: {
      kicker: "",
      title: "",
      body: "",
      submit: "",
      receiveTitle: "",
      receive: [],
      nextTitle: "",
      steps: [],
      note: "",
      labels: emptyLabels(),
      visual: emptyVisual(),
    },
    faqs: [],
    seo: { canonical: INDEPENDENT_HOTEL_PAGE_ROUTE, social: emptyVisual(), variants: defaultSeoVariants() },
    approvals: emptyApprovals(),
  };
}

export function defaultIndependentHotelCms(locale: Locale): CmsIndependentPage {
  const thai = locale === "th";
  const copy = thai ? independentHotelCopy.th : independentHotelCopy.en;
  const enquiry = independentEnquiryCopy(locale);
  const next = emptyIndependentHotelCms();
  const thFaqs = independentHotelFaqs("th");
  const enFaqs = independentHotelFaqs("en");
  next.hero = {
    ...next.hero,
    eyebrow: copy.eyebrow,
    title: copy.title,
    description: copy.lead,
    close: copy.leadClose,
    underCta: copy.underCta,
    primaryCta: { label: copy.cta, href: "#independent-hotel-enquiry" },
    secondaryCta: { label: copy.secondary, href: "/approach" },
    visual: fromLibraryVisual(INDEPENDENT_HERO_VISUAL, locale),
  };
  const relatedCards = independentRelatedCards("th");
  const enEnquiry = independentEnquiryCopy("en");
  next.assessment = {
    ...next.assessment,
    title: copy.needTitle,
    lead: copy.needLead,
    close: copy.needClose,
    visual: fromLibraryVisual(INDEPENDENT_ASSESSMENT_VISUAL, locale),
    rows: INDEPENDENT_ASSESSMENT_ROWS.map((row) => ({
      id: row.id,
      num: row.num,
      titleTh: row.titleTh,
      titleEn: row.titleEn,
      questionTh: row.lookTh,
      questionEn: row.lookEn,
      symptomTh: "",
      symptomEn: "",
      supportTh: row.output,
      supportEn: row.output,
      output: row.output,
    })),
  };
  next.services = {
    title: copy.helpTitle,
    lead: copy.helpLead,
    boundary: copy.helpBoundary,
    visual: fromLibraryVisual(INDEPENDENT_SERVICES_VISUAL, locale),
    workstreams: INDEPENDENT_WORKSTREAMS.map((row) => ({
      id: row.id,
      num: row.num,
      titleTh: row.titleTh,
      titleEn: row.titleEn,
      bulletsTh: joinLines(row.bulletsTh),
      bulletsEn: joinLines(row.bulletsEn),
    })),
    items: INDEPENDENT_SERVICES.map((row) => ({
      id: row.id,
      stream: row.stream,
      titleTh: row.titleTh,
      titleEn: row.titleEn,
      inputTh: row.inputTh,
      inputEn: row.inputEn,
      actionTh: row.actionTh,
      actionEn: row.actionEn,
      output: row.output,
      approvalTh: row.approvalTh,
      approvalEn: row.approvalEn,
      ownerTh: row.ownerTh,
      ownerEn: row.ownerEn,
    })),
  };
  next.model = {
    title: copy.modelTitle,
    visual: fromLibraryVisual(INDEPENDENT_MODEL_VISUAL, locale),
    steps: INDEPENDENT_MODEL_STEPS.map((row) => ({
      id: row.id,
      num: row.num,
      label: row.label,
      titleTh: row.titleTh,
      titleEn: row.titleEn,
      output: row.output,
    })),
    supportTitle: thai ? INDEPENDENT_MODEL_BOUNDARY.supportTitle.th : INDEPENDENT_MODEL_BOUNDARY.supportTitle.en,
    support: thai ? INDEPENDENT_MODEL_BOUNDARY.support.th : INDEPENDENT_MODEL_BOUNDARY.support.en,
    hotelTitle: thai ? INDEPENDENT_MODEL_BOUNDARY.hotelTitle.th : INDEPENDENT_MODEL_BOUNDARY.hotelTitle.en,
    hotel: thai ? INDEPENDENT_MODEL_BOUNDARY.hotel.th : INDEPENDENT_MODEL_BOUNDARY.hotel.en,
  };
  next.deliverables = {
    title: copy.deliverablesTitle,
    lead: copy.deliverablesLead,
    visual: fromLibraryVisual(INDEPENDENT_DELIVERABLES_VISUAL, locale),
    rows: INDEPENDENT_DELIVERABLES.map((row) => ({
      id: row.id,
      areaTh: row.areaTh,
      areaEn: row.areaEn,
      supportTh: row.supportTh,
      supportEn: row.supportEn,
      deliverable: row.deliverable,
      approvalTh: row.approvalTh,
      approvalEn: row.approvalEn,
    })),
    supportTitle: thai ? INDEPENDENT_DELIVERABLES_BOUNDARY.supportTitle.th : INDEPENDENT_DELIVERABLES_BOUNDARY.supportTitle.en,
    supportItems: INDEPENDENT_DELIVERABLES_BOUNDARY.supportItems.map((item, index) => ({
      id: `support-${index + 1}`,
      th: item.th,
      en: item.en,
    })),
    hotelTitle: thai ? INDEPENDENT_DELIVERABLES_BOUNDARY.hotelTitle.th : INDEPENDENT_DELIVERABLES_BOUNDARY.hotelTitle.en,
    hotelItems: INDEPENDENT_DELIVERABLES_BOUNDARY.hotelItems.map((item, index) => ({
      id: `hotel-${index + 1}`,
      th: item.th,
      en: item.en,
    })),
    boundary: copy.deliverablesBoundary,
  };
  next.workflow = {
    title: copy.methodTitle,
    lead: copy.methodLead,
    visual: fromLibraryVisual(INDEPENDENT_WORKFLOW_VISUAL, locale),
    steps: INDEPENDENT_WORKFLOW.map((row) => ({
      id: row.id,
      num: row.num,
      label: row.label,
      titleTh: row.titleTh,
      titleEn: row.titleEn,
      bodyTh: row.bodyTh,
      bodyEn: row.bodyEn,
      ownerTh: row.ownerTh,
      ownerEn: row.ownerEn,
      inputTh: row.inputTh,
      inputEn: row.inputEn,
      actionTh: row.actionTh,
      actionEn: row.actionEn,
      output: row.output,
      approvalTh: row.approvalTh,
      approvalEn: row.approvalEn,
      nextTh: row.nextTh,
      nextEn: row.nextEn,
    })),
    approvalsTitle: copy.methodApprovals,
    approvals: INDEPENDENT_WORKFLOW_APPROVALS.map((item) => ({ id: item.id, th: item.th, en: item.en })),
  };
  next.fit = {
    title: copy.fitTitle,
    lead: copy.fitLead,
    visual: fromLibraryVisual(INDEPENDENT_FIT_VISUAL, locale),
    scenarios: INDEPENDENT_FIT_SCENARIOS.map((row) => ({
      id: row.id,
      situationTh: row.situationTh,
      situationEn: row.situationEn,
      symptomTh: row.symptomTh,
      symptomEn: row.symptomEn,
      questionTh: row.questionTh,
      questionEn: row.questionEn,
      supportTh: row.supportTh,
      supportEn: row.supportEn,
      output: row.output,
    })),
    notTitle: copy.fitNotTitle,
    notItems: INDEPENDENT_FIT_NOT.map((item) => ({ id: item.id, th: item.th, en: item.en })),
  };
  next.scope = {
    title: copy.scopeTitle,
    visual: fromLibraryVisual(INDEPENDENT_SCOPE_VISUAL, locale),
    rows: INDEPENDENT_SCOPE_ROWS.map((row) => ({
      id: row.id,
      titleTh: row.titleTh,
      titleEn: row.titleEn,
      itemsTh: joinLines(row.itemsTh),
      itemsEn: joinLines(row.itemsEn),
    })),
    boundary: copy.deliverablesBoundary,
  };
  next.plan = {
    title: copy.planTitle,
    lead: copy.planLead,
    close: copy.planClose,
    sampleLabel: "Sample plan",
    cadenceTitle: copy.planCadenceTitle,
    visual: fromLibraryVisual(INDEPENDENT_PLAN_VISUAL, locale),
    phases: INDEPENDENT_PLAN.map((row) => ({
      id: row.id,
      label: row.label,
      labelTh: row.labelTh,
      itemsTh: joinLines(row.itemsTh),
      itemsEn: joinLines(row.itemsEn),
      output: row.output,
    })),
    cadence: INDEPENDENT_CADENCE.map((row) => ({
      id: row.id,
      label: row.label,
      labelTh: row.labelTh,
      itemsTh: joinLines(row.itemsTh),
      itemsEn: joinLines(row.itemsEn),
    })),
  };
  next.measure = {
    title: copy.measureTitle,
    kpis: INDEPENDENT_KPIS.map((row) => ({
      id: row.id,
      nameTh: row.nameTh,
      nameEn: row.nameEn,
      period: INDEPENDENT_KPI_SAMPLE.period,
      market: INDEPENDENT_KPI_SAMPLE.market,
      source: INDEPENDENT_KPI_SAMPLE.source,
      definitionTh: row.definitionTh,
      definitionEn: row.definition,
      unit: row.unit,
      dataStatus: row.dataStatus,
      hideUntilData: row.hideUntilData,
      publicationApproved: false,
    })),
    sources: INDEPENDENT_SOURCES.map((row) => ({
      id: row.id,
      nameTh: row.nameTh,
      nameEn: row.nameEn,
      url: row.url,
      publishedAt: row.publishedAt,
      accessedAt: row.accessedAt,
      marketTh: row.marketTh,
      marketEn: row.marketEn,
      definitionTh: row.definitionTh,
      definitionEn: row.definitionEn,
      status: row.status,
      approvalNote: "",
    })),
  };
  next.related = {
    title: copy.relatedTitle,
    visual: fromLibraryVisual(INDEPENDENT_RELATED_VISUAL, locale),
    cards: relatedCards.map((card) => ({
      id: card.id,
      href: card.href.replace(/^\/en/, "") || card.href,
      titleTh: card.titleTh,
      titleEn: card.titleEn,
      bodyTh: card.bodyTh,
      bodyEn: card.bodyEn,
      ctaTh: card.ctaTh,
      ctaEn: card.ctaEn,
      publicationApproved: false,
    })),
    closerTitle: copy.closerTitle,
    closerBody: copy.closerBody,
    closerCta: copy.closerCta,
    closerHref: "#independent-hotel-enquiry",
  };
  next.form = {
    ...next.form,
    kicker: enquiry.kicker,
    title: enquiry.heading,
    body: enquiry.lead,
    submit: enquiry.submit,
    receiveTitle: enquiry.receiveTitle,
    receive: INDEPENDENT_ENQUIRY_RECEIVE.map((item) => ({ id: item.id, title: item.title, th: item.th, en: item.en })),
    nextTitle: enquiry.nextTitle,
    steps: independentEnquiryCopy("th").steps.map((th, index) => ({
      id: `step-${index + 1}`,
      th,
      en: enEnquiry.steps[index] || th,
    })),
    note: enquiry.note,
    labels: {
      name: enquiry.labels.name,
      business: enquiry.labels.business,
      contact: enquiry.labels.contact,
      rooms: enquiry.labels.rooms,
      hotelStatus: enquiry.labels.hotelStatus,
      challenge: enquiry.labels.challenge,
      teamSize: enquiry.labels.teamSize,
      website: enquiry.labels.website,
      systems: enquiry.labels.systems,
      goal: enquiry.labels.goal,
      message: enquiry.labels.message,
      consent: enquiry.labels.consent,
      privacy: enquiry.labels.privacy,
    },
    visual: fromLibraryVisual(INDEPENDENT_ENQUIRY_VISUAL, locale),
  };
  next.seo.variants = [
    { locale: "th", title: independentHotelCopy.th.title, description: independentHotelCopy.th.lead, canonical: INDEPENDENT_HOTEL_PAGE_ROUTE },
    { locale: "en", title: independentHotelCopy.en.title, description: independentHotelCopy.en.lead, canonical: "/en/solutions/independent-hotel-management" },
  ];
  next.faqs = thFaqs.map((item, index) => ({
    id: `faq-${index + 1}`,
    q: item.q,
    a: item.a,
    qEn: enFaqs[index]?.q || item.q,
    aEn: enFaqs[index]?.a || item.a,
  }));
  return next;
}

function asVisual(row: unknown, fallback: CmsIndependentVisual): CmsIndependentVisual {
  const value = (row ?? {}) as Record<string, unknown>;
  return {
    src: String(value.src ?? fallback.src),
    altTh: String(value.altTh ?? fallback.altTh),
    altEn: String(value.altEn ?? fallback.altEn),
    status: String(value.status ?? fallback.status) as IndependentVisualStatus,
    label: String(value.label ?? fallback.label),
    caption: String(value.caption ?? fallback.caption),
    source: String(value.source ?? fallback.source ?? ""),
    approvalNote: String(value.approvalNote ?? fallback.approvalNote ?? ""),
  };
}

function asCta(row: unknown, fallback: CmsIndependentCta): CmsIndependentCta {
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

function asLine(row: Record<string, unknown>, index: number, seeded?: CmsIndependentLine): CmsIndependentLine {
  return {
    id: String(row.id || seeded?.id || `line-${index + 1}`),
    th: String(row.th ?? seeded?.th ?? ""),
    en: String(row.en ?? seeded?.en ?? ""),
  };
}

export function parseIndependentHotelPageBody(body: string, locale: Locale = "th"): CmsIndependentPage | null {
  try {
    const parsed = JSON.parse(body) as Partial<CmsIndependentPage> & { template?: string };
    if (parsed?.template && parsed.template !== INDEPENDENT_HOTEL_CMS_TEMPLATE) return null;
    const seeded = defaultIndependentHotelCms(locale);
    const assessment = (parsed.assessment || {}) as Record<string, unknown>;
    const services = (parsed.services || {}) as Record<string, unknown>;
    const model = (parsed.model || {}) as Record<string, unknown>;
    const deliverables = (parsed.deliverables || {}) as Record<string, unknown>;
    const workflow = (parsed.workflow || {}) as Record<string, unknown>;
    const fit = (parsed.fit || {}) as Record<string, unknown>;
    const scope = (parsed.scope || {}) as Record<string, unknown>;
    const plan = (parsed.plan || {}) as Record<string, unknown>;
    const measure = (parsed.measure || {}) as Record<string, unknown>;
    const related = (parsed.related || {}) as Record<string, unknown>;
    const form = (parsed.form || {}) as Record<string, unknown>;
    const labels = (form.labels || {}) as Record<string, unknown>;
    const approvals = (parsed.approvals || {}) as Record<string, unknown>;
    return {
      version: 1,
      template: INDEPENDENT_HOTEL_CMS_TEMPLATE,
      bilingualPublish: Boolean(parsed.bilingualPublish ?? seeded.bilingualPublish),
      hero: {
        ...seeded.hero,
        ...(parsed.hero || {}),
        visual: asVisual(parsed.hero?.visual, seeded.hero.visual),
        primaryCta: asCta(parsed.hero?.primaryCta, seeded.hero.primaryCta),
        secondaryCta: asCta(parsed.hero?.secondaryCta, seeded.hero.secondaryCta),
      },
      assessment: {
        title: asText(assessment, "title", seeded.assessment.title),
        lead: asText(assessment, "lead", seeded.assessment.lead),
        close: asText(assessment, "close", seeded.assessment.close),
        visual: asVisual(parsed.assessment?.visual, seeded.assessment.visual),
        rows: asList(assessment.rows, seeded.assessment.rows, (row, index, item) => ({
          id: String(row.id || item.id || `assessment-${index + 1}`),
          num: String(row.num ?? item.num),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          questionTh: String(row.questionTh ?? item.questionTh),
          questionEn: String(row.questionEn ?? item.questionEn),
          symptomTh: String(row.symptomTh ?? item.symptomTh),
          symptomEn: String(row.symptomEn ?? item.symptomEn),
          supportTh: String(row.supportTh ?? item.supportTh),
          supportEn: String(row.supportEn ?? item.supportEn),
          output: String(row.output ?? item.output),
        })),
      },
      services: {
        title: asText(services, "title", seeded.services.title),
        lead: asText(services, "lead", seeded.services.lead),
        boundary: asText(services, "boundary", seeded.services.boundary),
        visual: asVisual(parsed.services?.visual, seeded.services.visual),
        workstreams: asList(services.workstreams, seeded.services.workstreams, (row, index, item) => ({
          id: String(row.id || item.id || `stream-${index + 1}`),
          num: String(row.num ?? item.num),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          bulletsTh: String(row.bulletsTh ?? item.bulletsTh),
          bulletsEn: String(row.bulletsEn ?? item.bulletsEn),
        })),
        items: asList(services.items, seeded.services.items, (row, index, item) => ({
          id: String(row.id || item.id || `service-${index + 1}`),
          stream: String(row.stream ?? item.stream),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          inputTh: String(row.inputTh ?? item.inputTh),
          inputEn: String(row.inputEn ?? item.inputEn),
          actionTh: String(row.actionTh ?? item.actionTh),
          actionEn: String(row.actionEn ?? item.actionEn),
          output: String(row.output ?? item.output),
          approvalTh: String(row.approvalTh ?? item.approvalTh),
          approvalEn: String(row.approvalEn ?? item.approvalEn),
          ownerTh: String(row.ownerTh ?? item.ownerTh),
          ownerEn: String(row.ownerEn ?? item.ownerEn),
        })),
      },
      model: {
        title: asText(model, "title", seeded.model.title),
        visual: asVisual(parsed.model?.visual, seeded.model.visual),
        steps: asList(model.steps, seeded.model.steps, (row, index, item) => ({
          id: String(row.id || item.id || `model-${index + 1}`),
          num: String(row.num ?? item.num),
          label: String(row.label ?? item.label),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          output: String(row.output ?? item.output),
        })),
        supportTitle: asText(model, "supportTitle", seeded.model.supportTitle),
        support: asText(model, "support", seeded.model.support),
        hotelTitle: asText(model, "hotelTitle", seeded.model.hotelTitle),
        hotel: asText(model, "hotel", seeded.model.hotel),
      },
      deliverables: {
        title: asText(deliverables, "title", seeded.deliverables.title),
        lead: asText(deliverables, "lead", seeded.deliverables.lead),
        visual: asVisual(parsed.deliverables?.visual, seeded.deliverables.visual),
        rows: asList(deliverables.rows, seeded.deliverables.rows, (row, index, item) => ({
          id: String(row.id || item.id || `deliverable-${index + 1}`),
          areaTh: String(row.areaTh ?? item.areaTh),
          areaEn: String(row.areaEn ?? item.areaEn),
          supportTh: String(row.supportTh ?? item.supportTh),
          supportEn: String(row.supportEn ?? item.supportEn),
          deliverable: String(row.deliverable ?? item.deliverable),
          approvalTh: String(row.approvalTh ?? item.approvalTh),
          approvalEn: String(row.approvalEn ?? item.approvalEn),
        })),
        supportTitle: asText(deliverables, "supportTitle", seeded.deliverables.supportTitle),
        supportItems: asList(deliverables.supportItems, seeded.deliverables.supportItems, asLine),
        hotelTitle: asText(deliverables, "hotelTitle", seeded.deliverables.hotelTitle),
        hotelItems: asList(deliverables.hotelItems, seeded.deliverables.hotelItems, asLine),
        boundary: asText(deliverables, "boundary", seeded.deliverables.boundary),
      },
      workflow: {
        title: asText(workflow, "title", seeded.workflow.title),
        lead: asText(workflow, "lead", seeded.workflow.lead),
        visual: asVisual(parsed.workflow?.visual, seeded.workflow.visual),
        steps: asList(workflow.steps, seeded.workflow.steps, (row, index, item) => ({
          id: String(row.id || item.id || `workflow-${index + 1}`),
          num: String(row.num ?? item.num),
          label: String(row.label ?? item.label),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          bodyTh: String(row.bodyTh ?? item.bodyTh),
          bodyEn: String(row.bodyEn ?? item.bodyEn),
          ownerTh: String(row.ownerTh ?? item.ownerTh),
          ownerEn: String(row.ownerEn ?? item.ownerEn),
          inputTh: String(row.inputTh ?? item.inputTh),
          inputEn: String(row.inputEn ?? item.inputEn),
          actionTh: String(row.actionTh ?? item.actionTh),
          actionEn: String(row.actionEn ?? item.actionEn),
          output: String(row.output ?? item.output),
          approvalTh: String(row.approvalTh ?? item.approvalTh),
          approvalEn: String(row.approvalEn ?? item.approvalEn),
          nextTh: String(row.nextTh ?? item.nextTh),
          nextEn: String(row.nextEn ?? item.nextEn),
        })),
        approvalsTitle: asText(workflow, "approvalsTitle", seeded.workflow.approvalsTitle),
        approvals: asList(workflow.approvals, seeded.workflow.approvals, asLine),
      },
      fit: {
        title: asText(fit, "title", seeded.fit.title),
        lead: asText(fit, "lead", seeded.fit.lead),
        visual: asVisual(parsed.fit?.visual, seeded.fit.visual),
        scenarios: asList(fit.scenarios, seeded.fit.scenarios, (row, index, item) => ({
          id: String(row.id || item.id || `fit-${index + 1}`),
          situationTh: String(row.situationTh ?? item.situationTh),
          situationEn: String(row.situationEn ?? item.situationEn),
          symptomTh: String(row.symptomTh ?? item.symptomTh),
          symptomEn: String(row.symptomEn ?? item.symptomEn),
          questionTh: String(row.questionTh ?? item.questionTh),
          questionEn: String(row.questionEn ?? item.questionEn),
          supportTh: String(row.supportTh ?? item.supportTh),
          supportEn: String(row.supportEn ?? item.supportEn),
          output: String(row.output ?? item.output),
        })),
        notTitle: asText(fit, "notTitle", seeded.fit.notTitle),
        notItems: asList(fit.notItems, seeded.fit.notItems, asLine),
      },
      scope: {
        title: asText(scope, "title", seeded.scope.title),
        visual: asVisual(parsed.scope?.visual, seeded.scope.visual),
        rows: asList(scope.rows, seeded.scope.rows, (row, index, item) => ({
          id: String(row.id || item.id || `scope-${index + 1}`),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          itemsTh: String(row.itemsTh ?? item.itemsTh),
          itemsEn: String(row.itemsEn ?? item.itemsEn),
        })),
        boundary: asText(scope, "boundary", seeded.scope.boundary),
      },
      plan: {
        title: asText(plan, "title", seeded.plan.title),
        lead: asText(plan, "lead", seeded.plan.lead),
        close: asText(plan, "close", seeded.plan.close),
        sampleLabel: asText(plan, "sampleLabel", seeded.plan.sampleLabel) || "Sample plan",
        cadenceTitle: asText(plan, "cadenceTitle", seeded.plan.cadenceTitle),
        visual: asVisual(parsed.plan?.visual, seeded.plan.visual),
        phases: asList(plan.phases, seeded.plan.phases, (row, index, item) => ({
          id: String(row.id || item.id || `phase-${index + 1}`),
          label: String(row.label ?? item.label),
          labelTh: String(row.labelTh ?? item.labelTh),
          itemsTh: String(row.itemsTh ?? item.itemsTh),
          itemsEn: String(row.itemsEn ?? item.itemsEn),
          output: String(row.output ?? item.output),
        })),
        cadence: asList(plan.cadence, seeded.plan.cadence, (row, index, item) => ({
          id: String(row.id || item.id || `cadence-${index + 1}`),
          label: String(row.label ?? item.label),
          labelTh: String(row.labelTh ?? item.labelTh),
          itemsTh: String(row.itemsTh ?? item.itemsTh),
          itemsEn: String(row.itemsEn ?? item.itemsEn),
        })),
      },
      measure: {
        title: asText(measure, "title", seeded.measure.title),
        kpis: asList(measure.kpis, seeded.measure.kpis, (row, index, item) => ({
          id: String(row.id || item.id || `kpi-${index + 1}`),
          nameTh: String(row.nameTh ?? item.nameTh),
          nameEn: String(row.nameEn ?? item.nameEn),
          period: String(row.period ?? item.period),
          market: String(row.market ?? item.market),
          source: String(row.source ?? item.source),
          definitionTh: String(row.definitionTh ?? item.definitionTh),
          definitionEn: String(row.definitionEn ?? item.definitionEn),
          unit: String(row.unit ?? item.unit),
          dataStatus: String(row.dataStatus ?? item.dataStatus),
          hideUntilData: Boolean(row.hideUntilData ?? item.hideUntilData),
          publicationApproved: Boolean(row.publicationApproved ?? item.publicationApproved),
        })),
        sources: asList(measure.sources, seeded.measure.sources, (row, index, item) => ({
          id: String(row.id || item.id || `source-${index + 1}`),
          nameTh: String(row.nameTh ?? item.nameTh),
          nameEn: String(row.nameEn ?? item.nameEn),
          url: String(row.url ?? item.url),
          publishedAt: String(row.publishedAt ?? item.publishedAt),
          accessedAt: String(row.accessedAt ?? item.accessedAt),
          marketTh: String(row.marketTh ?? item.marketTh),
          marketEn: String(row.marketEn ?? item.marketEn),
          definitionTh: String(row.definitionTh ?? item.definitionTh),
          definitionEn: String(row.definitionEn ?? item.definitionEn),
          status: String(row.status ?? item.status),
          approvalNote: String(row.approvalNote ?? item.approvalNote),
        })),
      },
      related: {
        title: asText(related, "title", seeded.related.title),
        visual: asVisual(parsed.related?.visual, seeded.related.visual),
        cards: asList(related.cards, seeded.related.cards, (row, index, item) => ({
          id: String(row.id || item.id || `related-${index + 1}`),
          href: String(row.href ?? item.href),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          bodyTh: String(row.bodyTh ?? item.bodyTh),
          bodyEn: String(row.bodyEn ?? item.bodyEn),
          ctaTh: String(row.ctaTh ?? item.ctaTh),
          ctaEn: String(row.ctaEn ?? item.ctaEn),
          publicationApproved: Boolean(row.publicationApproved ?? item.publicationApproved),
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
        receiveTitle: asText(form, "receiveTitle", seeded.form.receiveTitle),
        receive: asList(form.receive, seeded.form.receive, (row, index, item) => ({
          id: String(row.id || item.id || `receive-${index + 1}`),
          title: String(row.title ?? item.title),
          th: String(row.th ?? item.th),
          en: String(row.en ?? item.en),
        })),
        nextTitle: asText(form, "nextTitle", seeded.form.nextTitle),
        steps: asList(form.steps, seeded.form.steps, asLine),
        note: asText(form, "note", seeded.form.note),
        labels: {
          name: String(labels.name ?? seeded.form.labels.name),
          business: String(labels.business ?? seeded.form.labels.business),
          contact: String(labels.contact ?? seeded.form.labels.contact),
          rooms: String(labels.rooms ?? seeded.form.labels.rooms),
          hotelStatus: String(labels.hotelStatus ?? seeded.form.labels.hotelStatus),
          challenge: String(labels.challenge ?? seeded.form.labels.challenge),
          teamSize: String(labels.teamSize ?? seeded.form.labels.teamSize),
          website: String(labels.website ?? seeded.form.labels.website),
          systems: String(labels.systems ?? seeded.form.labels.systems),
          goal: String(labels.goal ?? seeded.form.labels.goal),
          message: String(labels.message ?? seeded.form.labels.message),
          consent: String(labels.consent ?? seeded.form.labels.consent),
          privacy: String(labels.privacy ?? seeded.form.labels.privacy),
        },
        visual: asVisual(parsed.form?.visual, seeded.form.visual),
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
        canonical: String(parsed.seo?.canonical || INDEPENDENT_HOTEL_PAGE_ROUTE),
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

export function serializeIndependentHotelPageBody(content: CmsIndependentPage) {
  return JSON.stringify({ ...content, version: 1, template: INDEPENDENT_HOTEL_CMS_TEMPLATE });
}

export function isIndependentHotelCmsBody(body: string) {
  try {
    const parsed = JSON.parse(body) as { template?: string };
    return parsed?.template === INDEPENDENT_HOTEL_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function isIndependentHotelPageDocument(input: { slug: string; template: string }) {
  if (input.template === INDEPENDENT_HOTEL_CMS_TEMPLATE) return true;
  return (
    input.slug === INDEPENDENT_HOTEL_PAGE_SLUG ||
    input.slug === "en/solutions/independent-hotel-management" ||
    input.slug === "ru/solutions/independent-hotel-management" ||
    input.slug === "zh/solutions/independent-hotel-management"
  );
}

const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;
const GUARANTEE_RE =
  /(การันตี|รับประกัน|guarantee[ds]?)\s*.{0,48}(รายได้|occupancy|adr|revpar|กำไร|คะแนนแขก|growth|revenue|profit|guest score)|((รายได้|occupancy|adr|revpar|กำไร|revenue|profit|guest score|growth)\s*.{0,48}(การันตี|รับประกัน|guarantee[ds]?))/i;
const PLACEHOLDER_RE = /placeholder|dummy|ลอว์เรส|replace with/i;
const COMMERCIAL_RE =
  /client name|ชื่อลูกค้า|case study|ผลลัพธ์โรงแรม|team photo|รูปทีม|client logo|โลโก้ลูกค้า|฿\s?\d|\d+\s*(บาท|THB|USD)/i;

function walkStrings(value: unknown, visit: (text: string) => void) {
  if (typeof value === "string") visit(value);
  else if (Array.isArray(value)) value.forEach((item) => walkStrings(item, visit));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walkStrings(item, visit));
}

function visualIsPublishable(visual: CmsIndependentVisual, bilingual: boolean) {
  if (!visual.src.trim()) return null;
  if (!visual.altTh.trim()) return "missing_alt";
  if (bilingual && !visual.altEn.trim()) return "missing_alt";
  const status = String(visual.status || "replace");
  if (status === "placeholder" || status === "replace" || status === "real") return "placeholder_status";
  if (status !== "approved" && status !== "sample") return "placeholder_status";
  if (PLACEHOLDER_RE.test(`${visual.src} ${visual.label} ${visual.caption}`) && status !== "sample") return "placeholder_label";
  return null;
}

function hasPerformanceEvidence(content: CmsIndependentPage) {
  if (!content.approvals.performanceClaims || !content.approvals.evidenceNote.trim()) return false;
  return content.measure.sources.some(
    (source) =>
      (source.nameTh.trim() || source.nameEn.trim()) &&
      (source.url.trim() || source.publishedAt.trim() || source.accessedAt.trim()) &&
      (source.definitionTh.trim() || source.definitionEn.trim()),
  );
}

export function validateIndependentHotelPage(content: CmsIndependentPage, intent: IndependentCmsIntent) {
  if (intent !== "publish") return null;
  if (!content.hero.title.trim() || !content.hero.description.trim()) return "required_fields";
  if (!content.scope.boundary.trim()) return "empty_scope_boundary";
  if (!content.plan.sampleLabel.trim()) return "missing_sample_label";
  if (!content.seo.canonical.trim() || !CTA_RE.test(content.seo.canonical.trim())) return "invalid_cta";
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
    content.assessment.visual,
    content.services.visual,
    content.model.visual,
    content.deliverables.visual,
    content.workflow.visual,
    content.fit.visual,
    content.scope.visual,
    content.plan.visual,
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
  for (const kpi of content.measure.kpis) {
    if (kpi.hideUntilData || kpi.dataStatus === "draft" || kpi.dataStatus === "not-configured") continue;
    if (!kpi.period.trim() || !kpi.market.trim() || !kpi.source.trim() || !(kpi.definitionTh.trim() || kpi.definitionEn.trim()) || !kpi.dataStatus) {
      return "kpi_incomplete";
    }
    if ((kpi.dataStatus === "approved" || kpi.dataStatus === "anonymised") && !kpi.publicationApproved && !content.approvals.results) {
      return "publication_approval";
    }
  }
  for (const source of content.measure.sources) {
    if (!source.nameTh.trim() && !source.nameEn.trim() && !source.url.trim()) continue;
    if (!(source.nameTh.trim() || source.nameEn.trim())) return "source_incomplete";
    if (source.url.trim() && !CTA_RE.test(source.url.trim())) return "invalid_cta";
  }
  for (const card of content.related.cards) {
    if (card.href.trim() && !CTA_RE.test(card.href.trim())) return "invalid_cta";
    if (COMMERCIAL_RE.test(`${card.titleTh} ${card.titleEn} ${card.bodyTh} ${card.bodyEn}`) && !card.publicationApproved && !content.approvals.clientNames) {
      return "publication_approval";
    }
  }
  let commercial = false;
  let guarantee = false;
  let teamPhoto = false;
  let clientLogo = false;
  walkStrings(content, (text) => {
    if (COMMERCIAL_RE.test(text)) commercial = true;
    if (
      GUARANTEE_RE.test(text) &&
      !/(ไม่(ได้)?การันตี|ไม่รับประกัน|not a guaranteed|does not guarantee|do not guarantee|does this guarantee|no guarantee|without guaranteeing|expects guaranteed|ต้องการ.{0,40}การันตี|หรือไม่\s*\??\s*$)/i.test(text)
    ) {
      guarantee = true;
    }
    if (/team photo|รูปทีม|headshot/i.test(text)) teamPhoto = true;
    if (/client logo|โลโก้ลูกค้า|logo wall/i.test(text)) clientLogo = true;
  });
  if (guarantee && !hasPerformanceEvidence(content)) return "guarantee_claim";
  if (teamPhoto && !content.approvals.teamPhotos) return "publication_approval";
  if (clientLogo && !content.approvals.clientLogos) return "publication_approval";
  if (commercial && !(content.approvals.clientNames || content.approvals.results || content.related.cards.some((card) => card.publicationApproved))) {
    return "publication_approval";
  }
  return null;
}

export type IndependentHotelEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical: string;
  locale: string;
  status: string;
  content: CmsIndependentPage;
};

export function editorStateFromIndependentHotelDocument(input: {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical?: string | null;
  locale: string;
  status: string;
  body: string;
}): IndependentHotelEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseIndependentHotelPageBody(input.body, locale) ?? emptyIndependentHotelCms();
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

export function independentHotelPublicPath(locale: Locale) {
  const page = pages.find((item) => item.route.endsWith("/solutions/independent-hotel-management") && item.language === locale);
  return page?.route || (locale === "th" ? INDEPENDENT_HOTEL_PAGE_ROUTE : `/${locale}${INDEPENDENT_HOTEL_PAGE_ROUTE}`);
}

export const INDEPENDENT_CMS_ERRORS_TH: Record<string, string> = {
  required_fields: "กรอกหัวข้อและคำอธิบายก่อนเผยแพร่",
  empty_faq: "คำถามที่พบบ่อยต้องมีคำถามและคำตอบ",
  empty_faq_bilingual: "คำถามที่พบบ่อยต้องมีภาษาไทยและภาษาอังกฤษก่อนเผยแพร่สองภาษา",
  empty_scope_boundary: "ขอบเขตงาน (Scope Boundary) ต้องไม่ว่างก่อนเผยแพร่",
  missing_sample_label: "แผน 30/60/90 ต้องมีป้าย Sample plan ก่อนเผยแพร่",
  invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
  missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและภาษาอังกฤษ",
  placeholder_status: "เปลี่ยนสถานะรูปเป็น Sample หรือ Approved ก่อนเผยแพร่",
  placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะไม่ใช่ Sample",
  kpi_incomplete: "KPI ที่เผยแพร่ต้องมีช่วงเวลา บริบทโรงแรม แหล่งที่มา คำนิยาม และสถานะข้อมูล",
  source_incomplete: "แหล่งที่มาต้องมีชื่อ และ URL หรือวันที่",
  publication_approval: "ชื่อโรงแรม รูปทีม โลโก้ลูกค้า หรือผลลัพธ์ต้องได้รับอนุมัติก่อนเผยแพร่",
  guarantee_claim: "ห้ามการันตีรายได้ Occupancy ADR RevPAR กำไร คะแนนแขก หรือการเติบโต ถ้ายังไม่มีหลักฐานและอนุมัติ",
  invalid_image: "ไฟล์รูปไม่ถูกต้อง",
  invalid_json: "ข้อมูลที่บันทึกไม่ถูกต้อง",
  missing: "ไม่พบหน้าเพจ",
  invalid_locale: "ภาษาปลายทางไม่ถูกต้อง",
  locale_exists: "มีฉบับภาษานี้อยู่แล้ว",
};
export const INDEPENDENT_CMS_ERRORS_EN: Record<string, string> = {
  required_fields: "Add a title and description before publishing",
  empty_faq: "FAQs need a question and an answer",
  empty_faq_bilingual: "FAQs need Thai and English before bilingual publish",
  empty_scope_boundary: "Scope Boundary cannot be empty before publishing",
  missing_sample_label: "The 30/60/90 plan needs a visible Sample plan label",
  invalid_cta: "CTA URLs must be /path, #anchor, mailto, tel, or http(s)",
  missing_alt: "Published images need Thai and English alt text",
  placeholder_status: "Set the image status to Sample or Approved before publishing",
  placeholder_label: "Do not publish Placeholder copy unless the status is Sample",
  kpi_incomplete: "Published KPIs need period, property context, source, definition, and data status",
  source_incomplete: "Sources need a name and a URL or date",
  publication_approval: "Hotel names, team photos, client logos, and results need publication approval",
  guarantee_claim: "Revenue, Occupancy, ADR, RevPAR, profit, guest-score, or growth guarantees need approval and evidence",
  invalid_image: "The image file is not valid",
  invalid_json: "The saved data is not valid",
  missing: "Page not found",
  invalid_locale: "The destination language is not valid",
  locale_exists: "A version in that language already exists",
};

export function independentHotelCmsErrorMessage(code: string) {
  return `${INDEPENDENT_CMS_ERRORS_TH[code] ?? "บันทึกไม่สำเร็จ"} / ${INDEPENDENT_CMS_ERRORS_EN[code] ?? "Save failed"}`;
}
