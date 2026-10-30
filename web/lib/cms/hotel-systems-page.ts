import {
  SYSTEMS_ASSESSMENT_VISUAL,
  SYSTEMS_REVIEW_STATUSES,
  systemsAssessmentCmsRows,
  SYSTEMS_CADENCE,
  SYSTEMS_DELIVERABLES_BOUNDARY,
  SYSTEMS_DELIVERABLES_VISUAL,
  SYSTEMS_READINESS_STATUSES,
  systemsReadinessCmsRows,
  SYSTEMS_ENQUIRY_GOALS,
  SYSTEMS_ENQUIRY_RECEIVE,
  SYSTEMS_ENQUIRY_VISUAL,
  SYSTEMS_FIT_NOT,
  SYSTEMS_FIT_VISUAL,
  SYSTEMS_INVENTORY_ENVIRONMENTS,
  SYSTEMS_INVENTORY_VISUAL,
  SYSTEMS_MAPPING_STATUSES,
  SYSTEMS_PLATFORM_STATUSES,
  systemsDictionaryCmsRows,
  systemsFitCmsRows,
  systemsInventoryCmsRows,
  SYSTEMS_HERO_VISUAL,
  SYSTEMS_KPI_SAMPLE,
  SYSTEMS_KPIS,
  SYSTEMS_MODEL_BOUNDARY,
  SYSTEMS_MODEL_STEPS,
  SYSTEMS_MODEL_VISUAL,
  systemsBeforeAfterCmsFields,
  SYSTEMS_HANDOVER_CHECKLIST_STATUSES,
  SYSTEMS_OWNERSHIP_STATUSES,
  SYSTEMS_PLAN,
  SYSTEMS_PLAN_VISUAL,
  systemsHandoverCmsItems,
  systemsOwnershipCmsRows,
  SYSTEMS_RELATED_VISUAL,
  SYSTEMS_TESTING_STATUSES,
  SYSTEMS_TESTING_VISUAL,
  systemsTestingCmsCases,
  systemsTestingErrorCmsSteps,
  SYSTEMS_SCOPE_BOUNDARY,
  SYSTEMS_SCOPE_VISUAL,
  systemsResponsibilityCmsRows,
  systemsScopeCmsRows,
  SYSTEMS_LANDSCAPE_STATUSES,
  SYSTEMS_LANDSCAPE_PATH,
  SYSTEMS_SERVICES_VISUAL,
  systemsLandscapeCategoriesCms,
  systemsLandscapeCmsItems,
  systemsLandscapeConnectionsCms,
  SYSTEMS_SOURCES,
  SYSTEMS_WORKFLOW_APPROVALS,
  SYSTEMS_WORKFLOW_GATE,
  SYSTEMS_WORKFLOW_VISUAL,
  systemsWorkflowCmsSteps,
  SYSTEMS_WORKSTREAMS,
  hotelSystemsEnquiryCopy,
  hotelSystemsCopy,
  hotelSystemsFaqs,
  hotelSystemsRelatedCards,
  type SystemsKpiStatus,
  type SystemsSourceStatus,
  type SystemsVisualStatus,
} from "@/lib/hotel-systems";
import { pages, type Locale } from "@/lib/seo";

export const HOTEL_SYSTEMS_CMS_TEMPLATE = "hotel-systems-implementation";
export const HOTEL_SYSTEMS_PAGE_SLUG = "solutions/hotel-systems-implementation";
export const HOTEL_SYSTEMS_PAGE_ROUTE = "/solutions/hotel-systems-implementation";
export const SYSTEMS_CMS_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export type SystemsCmsIntent = (typeof SYSTEMS_CMS_INTENTS)[number];
export type SystemsCmsSaveResult = { ok: true; id: string; intent: SystemsCmsIntent } | { ok: false; error: string };

export const SYSTEMS_CMS_KPI_STATUSES = ["draft", "sample", "approved", "anonymised", "not-configured"] as const;
export const SYSTEMS_CMS_SOURCE_STATUSES = ["guidance", "sample", "approved"] as const;
export const SYSTEMS_CMS_REVIEW_STATUSES = SYSTEMS_REVIEW_STATUSES.map((row) => row.id);
export const SYSTEMS_CMS_LANDSCAPE_STATUSES = SYSTEMS_LANDSCAPE_STATUSES.map((row) => row.id);
export const SYSTEMS_CMS_READINESS_STATUSES = SYSTEMS_READINESS_STATUSES.map((row) => row.id);
export const SYSTEMS_CMS_PLATFORM_STATUSES = SYSTEMS_PLATFORM_STATUSES.map((row) => row.id);
export const SYSTEMS_CMS_INVENTORY_ENVIRONMENTS = SYSTEMS_INVENTORY_ENVIRONMENTS.map((row) => row.id);
export const SYSTEMS_CMS_MAPPING_STATUSES = SYSTEMS_MAPPING_STATUSES.map((row) => row.id);
export const SYSTEMS_CMS_TESTING_STATUSES = SYSTEMS_TESTING_STATUSES.map((row) => row.id);
export const SYSTEMS_CMS_HANDOVER_STATUSES = SYSTEMS_HANDOVER_CHECKLIST_STATUSES.map((row) => row.id);
export const SYSTEMS_CMS_OWNERSHIP_STATUSES = SYSTEMS_OWNERSHIP_STATUSES.map((row) => row.id);

export type CmsSystemsCta = { label: string; href: string };
export type CmsSystemsVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: SystemsVisualStatus | string;
  label: string;
  caption: string;
  source: string;
  approvalNote: string;
  publicationApproved: boolean;
};
export type CmsSystemsFaq = { id: string; q: string; a: string; qEn: string; aEn: string };
export type CmsSystemsAssessmentRow = {
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
  status: string;
  evidenceTh: string;
  evidenceEn: string;
  ownerTh: string;
  ownerEn: string;
  actionTh: string;
  actionEn: string;
};
export type CmsSystemsWorkstream = {
  id: string;
  num: string;
  titleTh: string;
  titleEn: string;
  bulletsTh: string;
  bulletsEn: string;
};
export type CmsSystemsService = {
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
  roleTh: string;
  roleEn: string;
  dataOutTh: string;
  dataOutEn: string;
  sourceOfTruthTh: string;
  sourceOfTruthEn: string;
  status: string;
  providerTh: string;
  providerEn: string;
  connectorTh: string;
  connectorEn: string;
  verified: boolean;
};
export type CmsSystemsBeforeAfterField = {
  id: string;
  titleTh: string;
  titleEn: string;
  bodyTh: string;
  bodyEn: string;
  ownerTh: string;
  ownerEn: string;
  status: string;
};
export type CmsSystemsDeliverableRow = {
  id: string;
  areaTh: string;
  areaEn: string;
  inspectTh: string;
  inspectEn: string;
  evidenceTh: string;
  evidenceEn: string;
  status: string;
  ownerTh: string;
  ownerEn: string;
  actionTh: string;
  actionEn: string;
  output: string;
  supportTh: string;
  supportEn: string;
  deliverable: string;
  approvalTh: string;
  approvalEn: string;
};
export type CmsSystemsWorkflowStep = {
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
  dependencyTh: string;
  dependencyEn: string;
  nextTh: string;
  nextEn: string;
};
export type CmsSystemsInventoryRow = {
  id: string;
  systemTh: string;
  systemEn: string;
  providerTh: string;
  providerEn: string;
  purposeTh: string;
  purposeEn: string;
  ownerTh: string;
  ownerEn: string;
  dataInTh: string;
  dataInEn: string;
  dataOutTh: string;
  dataOutEn: string;
  connector: string;
  environment: string;
  status: string;
  reviewed: string;
  verified: boolean;
};
export type CmsSystemsDictionaryRow = {
  id: string;
  field: string;
  meaningTh: string;
  meaningEn: string;
  sourceTh: string;
  sourceEn: string;
  destinationTh: string;
  destinationEn: string;
  format: string;
  required: string;
  mappingStatus: string;
  ownerTh: string;
  ownerEn: string;
  notesTh: string;
  notesEn: string;
};
export type CmsSystemsFitScenario = {
  id: string;
  categoryTh: string;
  categoryEn: string;
  example: string;
  logoSrc: string;
  roleTh: string;
  roleEn: string;
  flowTh: string;
  flowEn: string;
  integrationStatus: string;
  verificationStatus: string;
  logoStatus: string;
  relationshipStatus: string;
  providerTh: string;
  providerEn: string;
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
export type CmsSystemsLine = { id: string; th: string; en: string };
export type CmsSystemsCategory = { id: string; th: string; en: string };
export type CmsSystemsConnection = { id: string; from: string; to: string; labelTh: string; labelEn: string };
export type CmsSystemsTestCase = {
  id: string;
  caseTh: string;
  caseEn: string;
  triggerTh: string;
  triggerEn: string;
  expectedTh: string;
  expectedEn: string;
  actualTh: string;
  actualEn: string;
  status: string;
  ownerTh: string;
  ownerEn: string;
  evidenceTh: string;
  evidenceEn: string;
  testedDate: string;
  issueTh: string;
  issueEn: string;
  severity: string;
  providerTh: string;
  providerEn: string;
  nextTh: string;
  nextEn: string;
  retestDate: string;
};
export type CmsSystemsScopeRow = { id: string; titleTh: string; titleEn: string; itemsTh: string; itemsEn: string };
export type CmsSystemsResponsibilityRow = {
  id: string;
  eventTh: string;
  eventEn: string;
  hotelTh: string;
  hotelEn: string;
  providerTh: string;
  providerEn: string;
  implTh: string;
  implEn: string;
  approvalTh: string;
  approvalEn: string;
  escalationTh: string;
  escalationEn: string;
  ownerTh: string;
  ownerEn: string;
  status: string;
};
export type CmsSystemsPlanPhase = {
  id: string;
  label: string;
  labelTh: string;
  itemsTh: string;
  itemsEn: string;
  output: string;
};
export type CmsSystemsCadence = { id: string; label: string; labelTh: string; itemsTh: string; itemsEn: string };
export type CmsSystemsHandoverItem = {
  id: string;
  itemTh: string;
  itemEn: string;
  status: string;
  ownerTh: string;
  ownerEn: string;
  evidenceTh: string;
  evidenceEn: string;
};
export type CmsSystemsOwnershipRow = {
  id: string;
  assetTh: string;
  assetEn: string;
  ownerTh: string;
  ownerEn: string;
  contactTh: string;
  contactEn: string;
  approvalTh: string;
  approvalEn: string;
  accessTh: string;
  accessEn: string;
  renewalTh: string;
  renewalEn: string;
  reviewed: string;
  status: string;
};
export type CmsSystemsRelatedCard = {
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
export type CmsSystemsFormReceive = { id: string; title: string; th: string; en: string };
export type CmsSystemsFormLabels = {
  name: string;
  business: string;
  contact: string;
  rooms: string;
  hotelStatus: string;
  challenge: string;
  teamSize: string;
  website: string;
  pms: string;
  channelManager: string;
  bookingEngine: string;
  systems: string;
  providerContact: string;
  goal: string;
  message: string;
  consent: string;
  privacy: string;
};
export type CmsSystemsKpi = {
  id: string;
  nameTh: string;
  nameEn: string;
  period: string;
  market: string;
  source: string;
  definitionTh: string;
  definitionEn: string;
  unit: string;
  dataStatus: SystemsKpiStatus | string;
  ownerTh: string;
  ownerEn: string;
  updatedAt: string;
  hideUntilData: boolean;
  publicationApproved: boolean;
};
export type CmsSystemsSource = {
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
  status: SystemsSourceStatus | string;
  approvalNote: string;
};
export type CmsSystemsSeoVariant = { locale: string; title: string; description: string; canonical: string };
export type CmsSystemsApprovals = {
  clientNames: boolean;
  teamPhotos: boolean;
  clientLogos: boolean;
  results: boolean;
  performanceClaims: boolean;
  evidenceNote: string;
};
export type CmsSystemsPage = {
  version: 1;
  template: typeof HOTEL_SYSTEMS_CMS_TEMPLATE;
  bilingualPublish: boolean;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    close: string;
    underCta: string;
    primaryCta: CmsSystemsCta;
    secondaryCta: CmsSystemsCta;
    visual: CmsSystemsVisual;
  };
  assessment: { title: string; lead: string; close: string; visual: CmsSystemsVisual; rows: CmsSystemsAssessmentRow[] };
  services: {
    title: string;
    lead: string;
    boundary: string;
    visual: CmsSystemsVisual;
    workstreams: CmsSystemsWorkstream[];
    items: CmsSystemsService[];
    categories: CmsSystemsCategory[];
    connections: CmsSystemsConnection[];
    pathLabel: string;
  };
  model: {
    title: string;
    lead: string;
    note: string;
    visual: CmsSystemsVisual;
    steps: Array<{ id: string; num: string; label: string; titleTh: string; titleEn: string; output: string }>;
    fields: CmsSystemsBeforeAfterField[];
    supportTitle: string;
    support: string;
    hotelTitle: string;
    hotel: string;
  };
  deliverables: {
    title: string;
    lead: string;
    visual: CmsSystemsVisual;
    rows: CmsSystemsDeliverableRow[];
    supportTitle: string;
    supportItems: CmsSystemsLine[];
    hotelTitle: string;
    hotelItems: CmsSystemsLine[];
    boundary: string;
  };
  workflow: {
    title: string;
    lead: string;
    visual: CmsSystemsVisual;
    steps: CmsSystemsWorkflowStep[];
    approvalsTitle: string;
    approvals: CmsSystemsLine[];
    gateTitle: string;
    gate: string;
  };
  fit: {
    title: string;
    lead: string;
    visual: CmsSystemsVisual;
    scenarios: CmsSystemsFitScenario[];
    notTitle: string;
    notItems: CmsSystemsLine[];
  };
  inventory: {
    title: string;
    lead: string;
    systemsTitle: string;
    fieldsTitle: string;
    sampleLabel: string;
    visual: CmsSystemsVisual;
    rows: CmsSystemsInventoryRow[];
    fields: CmsSystemsDictionaryRow[];
  };
  scope: {
    title: string;
    lead: string;
    supportTitle: string;
    hotelTitle: string;
    matrixTitle: string;
    visual: CmsSystemsVisual;
    rows: CmsSystemsScopeRow[];
    matrix: CmsSystemsResponsibilityRow[];
    boundary: string;
  };
  plan: {
    title: string;
    lead: string;
    close: string;
    sampleLabel: string;
    checklistTitle: string;
    ownershipTitle: string;
    cadenceTitle: string;
    visual: CmsSystemsVisual;
    phases: CmsSystemsPlanPhase[];
    cadence: CmsSystemsCadence[];
    checklist: CmsSystemsHandoverItem[];
    ownership: CmsSystemsOwnershipRow[];
  };
  testing: {
    title: string;
    lead: string;
    casesTitle: string;
    errorTitle: string;
    sampleLabel: string;
    visual: CmsSystemsVisual;
    cases: CmsSystemsTestCase[];
    errorSteps: CmsSystemsLine[];
  };
  measure: { title: string; kpis: CmsSystemsKpi[]; sources: CmsSystemsSource[] };
  related: {
    title: string;
    visual: CmsSystemsVisual;
    cards: CmsSystemsRelatedCard[];
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
    receive: CmsSystemsFormReceive[];
    nextTitle: string;
    steps: CmsSystemsLine[];
    note: string;
    labels: CmsSystemsFormLabels;
    goals: CmsSystemsLine[];
    visual: CmsSystemsVisual;
  };
  faqs: CmsSystemsFaq[];
  seo: { canonical: string; social: CmsSystemsVisual; variants: CmsSystemsSeoVariant[] };
  approvals: CmsSystemsApprovals;
};

function fromLibraryVisual(
  visual: {
    src: string;
    altTh: string;
    altEn: string;
    status: SystemsVisualStatus;
    labelTh: string;
    labelEn: string;
    captionTh: string;
    captionEn: string;
  },
  locale: Locale,
): CmsSystemsVisual {
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
    publicationApproved: false,
  };
}

function emptyVisual(): CmsSystemsVisual {
  return { src: "", altTh: "", altEn: "", status: "sample", label: "", caption: "", source: "", approvalNote: "", publicationApproved: false };
}

function emptyLabels(): CmsSystemsFormLabels {
  return {
    name: "",
    business: "",
    contact: "",
    rooms: "",
    hotelStatus: "",
    challenge: "",
    teamSize: "",
    website: "",
    pms: "",
    channelManager: "",
    bookingEngine: "",
    systems: "",
    providerContact: "",
    goal: "",
    message: "",
    consent: "",
    privacy: "",
  };
}

function emptyApprovals(): CmsSystemsApprovals {
  return { clientNames: false, teamPhotos: false, clientLogos: false, results: false, performanceClaims: false, evidenceNote: "" };
}

function joinLines(items: readonly string[]) {
  return items.join("\n");
}

function defaultSeoVariants(): CmsSystemsSeoVariant[] {
  return [
    { locale: "th", title: "", description: "", canonical: HOTEL_SYSTEMS_PAGE_ROUTE },
    { locale: "en", title: "", description: "", canonical: "/en/solutions/hotel-systems-implementation" },
  ];
}

export function splitCmsLines(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

export function newSystemsItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function hotelSystemsCmsNotice(kind: "saved" | "preview" | "duplicate" | "pending" | "dirty" | "ready") {
  if (kind === "preview") return "บันทึกแล้ว — เปิดตัวอย่างในแท็บนี้ / Saved — opening preview in this tab";
  if (kind === "duplicate") return "คัดลอกแล้ว — เปิดฉบับร่างภาษาปลายทางเพื่อตรวจคำแปล / Copied — open the destination-language draft to check the translation";
  if (kind === "pending") return "กำลังบันทึก… / Saving…";
  if (kind === "dirty") return "ยังไม่ได้บันทึก / Unsaved changes";
  if (kind === "ready") return "พร้อมบันทึก / Ready to save";
  return "บันทึกแล้ว / Saved";
}

export function emptyHotelSystemsCms(): CmsSystemsPage {
  return {
    version: 1,
    template: HOTEL_SYSTEMS_CMS_TEMPLATE,
    bilingualPublish: true,
    hero: { eyebrow: "", title: "", description: "", close: "", underCta: "", primaryCta: { label: "", href: "#hotel-systems-enquiry" }, secondaryCta: { label: "", href: "/approach" }, visual: emptyVisual() },
    assessment: { title: "", lead: "", close: "", visual: emptyVisual(), rows: [] },
    services: { title: "", lead: "", boundary: "", visual: emptyVisual(), workstreams: [], items: [], categories: [], connections: [], pathLabel: "" },
    model: { title: "", lead: "", note: "", visual: emptyVisual(), steps: [], fields: [], supportTitle: "", support: "", hotelTitle: "", hotel: "" },
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
    workflow: { title: "", lead: "", visual: emptyVisual(), steps: [], approvalsTitle: "", approvals: [], gateTitle: "", gate: "" },
    fit: { title: "", lead: "", visual: emptyVisual(), scenarios: [], notTitle: "", notItems: [] },
    inventory: { title: "", lead: "", systemsTitle: "", fieldsTitle: "", sampleLabel: "System Inventory and Data Dictionary — Sample", visual: emptyVisual(), rows: [], fields: [] },
    scope: {
      title: "",
      lead: "",
      supportTitle: "",
      hotelTitle: "",
      matrixTitle: "",
      visual: emptyVisual(),
      rows: [],
      matrix: [],
      boundary: "",
    },
    plan: {
      title: "",
      lead: "",
      close: "",
      sampleLabel: "Hotel Systems Handover and Ownership — Sample",
      checklistTitle: "",
      ownershipTitle: "",
      cadenceTitle: "",
      visual: emptyVisual(),
      phases: [],
      cadence: [],
      checklist: [],
      ownership: [],
    },
    testing: { title: "", lead: "", casesTitle: "", errorTitle: "", sampleLabel: "Hotel Systems Testing and QA — Sample", visual: emptyVisual(), cases: [], errorSteps: [] },
    measure: { title: "", kpis: [], sources: [] },
    related: { title: "", visual: emptyVisual(), cards: [], closerTitle: "", closerBody: "", closerCta: "", closerHref: "#hotel-systems-enquiry" },
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
      goals: [],
      visual: emptyVisual(),
    },
    faqs: [],
    seo: { canonical: HOTEL_SYSTEMS_PAGE_ROUTE, social: emptyVisual(), variants: defaultSeoVariants() },
    approvals: emptyApprovals(),
  };
}

export function defaultHotelSystemsCms(locale: Locale): CmsSystemsPage {
  const thai = locale === "th";
  const copy = thai ? hotelSystemsCopy.th : hotelSystemsCopy.en;
  const enquiry = hotelSystemsEnquiryCopy(locale);
  const next = emptyHotelSystemsCms();
  const thFaqs = hotelSystemsFaqs("th");
  const enFaqs = hotelSystemsFaqs("en");
  next.hero = {
    ...next.hero,
    eyebrow: copy.eyebrow,
    title: copy.title,
    description: copy.lead,
    close: copy.leadClose,
    underCta: copy.underCta,
    primaryCta: { label: copy.cta, href: "#hotel-systems-enquiry" },
    secondaryCta: { label: copy.secondary, href: "/approach" },
    visual: fromLibraryVisual(SYSTEMS_HERO_VISUAL, locale),
  };
  const relatedCards = hotelSystemsRelatedCards("th");
  const enEnquiry = hotelSystemsEnquiryCopy("en");
  next.assessment = {
    ...next.assessment,
    title: copy.needTitle,
    lead: copy.needLead,
    close: copy.needClose,
    visual: fromLibraryVisual(SYSTEMS_ASSESSMENT_VISUAL, locale),
    rows: systemsAssessmentCmsRows(),
  };
  next.services = {
    title: copy.helpTitle,
    lead: copy.helpLead,
    boundary: copy.helpBoundary,
    visual: fromLibraryVisual(SYSTEMS_SERVICES_VISUAL, locale),
    workstreams: SYSTEMS_WORKSTREAMS.map((row) => ({
      id: row.id,
      num: row.num,
      titleTh: row.titleTh,
      titleEn: row.titleEn,
      bulletsTh: joinLines(row.bulletsTh),
      bulletsEn: joinLines(row.bulletsEn),
    })),
    items: systemsLandscapeCmsItems(),
    categories: systemsLandscapeCategoriesCms(),
    connections: systemsLandscapeConnectionsCms(),
    pathLabel: SYSTEMS_LANDSCAPE_PATH.en,
  };
  next.model = {
    title: copy.modelTitle,
    lead: copy.modelLead,
    note: copy.modelNote,
    visual: fromLibraryVisual(SYSTEMS_MODEL_VISUAL, locale),
    steps: SYSTEMS_MODEL_STEPS.map((row) => ({
      id: row.id,
      num: row.num,
      label: row.label,
      titleTh: row.titleTh,
      titleEn: row.titleEn,
      output: row.output,
    })),
    fields: systemsBeforeAfterCmsFields(),
    supportTitle: thai ? SYSTEMS_MODEL_BOUNDARY.supportTitle.th : SYSTEMS_MODEL_BOUNDARY.supportTitle.en,
    support: thai ? SYSTEMS_MODEL_BOUNDARY.support.th : SYSTEMS_MODEL_BOUNDARY.support.en,
    hotelTitle: thai ? SYSTEMS_MODEL_BOUNDARY.hotelTitle.th : SYSTEMS_MODEL_BOUNDARY.hotelTitle.en,
    hotel: thai ? SYSTEMS_MODEL_BOUNDARY.hotel.th : SYSTEMS_MODEL_BOUNDARY.hotel.en,
  };
  next.deliverables = {
    title: copy.deliverablesTitle,
    lead: copy.deliverablesLead,
    visual: fromLibraryVisual(SYSTEMS_DELIVERABLES_VISUAL, locale),
    rows: systemsReadinessCmsRows(),
    supportTitle: thai ? SYSTEMS_DELIVERABLES_BOUNDARY.supportTitle.th : SYSTEMS_DELIVERABLES_BOUNDARY.supportTitle.en,
    supportItems: SYSTEMS_DELIVERABLES_BOUNDARY.supportItems.map((item, index) => ({
      id: `support-${index + 1}`,
      th: item.th,
      en: item.en,
    })),
    hotelTitle: thai ? SYSTEMS_DELIVERABLES_BOUNDARY.hotelTitle.th : SYSTEMS_DELIVERABLES_BOUNDARY.hotelTitle.en,
    hotelItems: SYSTEMS_DELIVERABLES_BOUNDARY.hotelItems.map((item, index) => ({
      id: `hotel-${index + 1}`,
      th: item.th,
      en: item.en,
    })),
    boundary: copy.deliverablesBoundary,
  };
  next.workflow = {
    title: copy.methodTitle,
    lead: copy.methodLead,
    visual: fromLibraryVisual(SYSTEMS_WORKFLOW_VISUAL, locale),
    steps: systemsWorkflowCmsSteps(),
    approvalsTitle: copy.methodApprovals,
    approvals: SYSTEMS_WORKFLOW_APPROVALS.map((item) => ({ id: item.id, th: item.th, en: item.en })),
    gateTitle: thai ? SYSTEMS_WORKFLOW_GATE.titleTh : SYSTEMS_WORKFLOW_GATE.titleEn,
    gate: thai ? SYSTEMS_WORKFLOW_GATE.th : SYSTEMS_WORKFLOW_GATE.en,
  };
  next.fit = {
    title: copy.fitTitle,
    lead: copy.fitLead,
    visual: fromLibraryVisual(SYSTEMS_FIT_VISUAL, locale),
    scenarios: systemsFitCmsRows(),
    notTitle: copy.fitNotTitle,
    notItems: SYSTEMS_FIT_NOT.map((item) => ({ id: item.id, th: item.th, en: item.en })),
  };
  next.inventory = {
    title: copy.inventoryTitle,
    lead: copy.inventoryLead,
    systemsTitle: copy.inventorySystemsTitle,
    fieldsTitle: copy.inventoryFieldsTitle,
    sampleLabel: SYSTEMS_INVENTORY_VISUAL.labelEn,
    visual: fromLibraryVisual(SYSTEMS_INVENTORY_VISUAL, locale),
    rows: systemsInventoryCmsRows(),
    fields: systemsDictionaryCmsRows(),
  };
  next.scope = {
    title: copy.scopeTitle,
    lead: copy.scopeLead,
    supportTitle: copy.scopeSupportTitle,
    hotelTitle: copy.scopeHotelTitle,
    matrixTitle: copy.scopeMatrixTitle,
    visual: fromLibraryVisual(SYSTEMS_SCOPE_VISUAL, locale),
    rows: systemsScopeCmsRows(),
    matrix: systemsResponsibilityCmsRows(),
    boundary: locale === "en" ? SYSTEMS_SCOPE_BOUNDARY.en : SYSTEMS_SCOPE_BOUNDARY.th,
  };
  next.plan = {
    title: copy.planTitle,
    lead: copy.planLead,
    close: copy.planClose,
    sampleLabel: "Hotel Systems Handover and Ownership — Sample",
    checklistTitle: copy.planChecklistTitle,
    ownershipTitle: copy.planOwnershipTitle,
    cadenceTitle: copy.planCadenceTitle,
    visual: fromLibraryVisual(SYSTEMS_PLAN_VISUAL, locale),
    phases: SYSTEMS_PLAN.map((row) => ({
      id: row.id,
      label: row.label,
      labelTh: row.labelTh,
      itemsTh: joinLines(row.itemsTh),
      itemsEn: joinLines(row.itemsEn),
      output: row.output,
    })),
    cadence: SYSTEMS_CADENCE.map((row) => ({
      id: row.id,
      label: row.label,
      labelTh: row.labelTh,
      itemsTh: joinLines(row.itemsTh),
      itemsEn: joinLines(row.itemsEn),
    })),
    checklist: systemsHandoverCmsItems(),
    ownership: systemsOwnershipCmsRows(),
  };
  next.testing = {
    title: copy.testingTitle,
    lead: copy.testingLead,
    casesTitle: copy.testingCasesTitle,
    errorTitle: copy.testingErrorTitle,
    sampleLabel: SYSTEMS_TESTING_VISUAL.labelEn,
    visual: fromLibraryVisual(SYSTEMS_TESTING_VISUAL, locale),
    cases: systemsTestingCmsCases(),
    errorSteps: systemsTestingErrorCmsSteps(),
  };
  next.measure = {
    title: copy.measureTitle,
    kpis: SYSTEMS_KPIS.map((row) => ({
      id: row.id,
      nameTh: row.nameTh,
      nameEn: row.nameEn,
      period: SYSTEMS_KPI_SAMPLE.period,
      market: SYSTEMS_KPI_SAMPLE.market,
      source: SYSTEMS_KPI_SAMPLE.source,
      definitionTh: row.definitionTh,
      definitionEn: row.definition,
      unit: row.unit,
      dataStatus: row.dataStatus,
      ownerTh: row.ownerTh,
      ownerEn: row.ownerEn,
      updatedAt: row.updatedAt,
      hideUntilData: row.hideUntilData,
      publicationApproved: false,
    })),
    sources: SYSTEMS_SOURCES.map((row) => ({
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
    visual: fromLibraryVisual(SYSTEMS_RELATED_VISUAL, locale),
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
    closerHref: "#hotel-systems-enquiry",
  };
  next.form = {
    ...next.form,
    kicker: enquiry.kicker,
    title: enquiry.heading,
    body: enquiry.lead,
    submit: enquiry.submit,
    receiveTitle: enquiry.receiveTitle,
    receive: SYSTEMS_ENQUIRY_RECEIVE.map((item) => ({ id: item.id, title: item.title, th: item.th, en: item.en })),
    nextTitle: enquiry.nextTitle,
    steps: hotelSystemsEnquiryCopy("th").steps.map((th, index) => ({
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
      pms: enquiry.labels.pms,
      channelManager: enquiry.labels.channelManager,
      bookingEngine: enquiry.labels.bookingEngine,
      systems: enquiry.labels.systems,
      providerContact: enquiry.labels.providerContact,
      goal: enquiry.labels.goal,
      message: enquiry.labels.message,
      consent: enquiry.labels.consent,
      privacy: enquiry.labels.privacy,
    },
    goals: SYSTEMS_ENQUIRY_GOALS.map((item) => ({ id: item.id, th: item.th, en: item.en })),
    visual: fromLibraryVisual(SYSTEMS_ENQUIRY_VISUAL, locale),
  };
  next.seo.variants = [
    { locale: "th", title: hotelSystemsCopy.th.title, description: hotelSystemsCopy.th.lead, canonical: HOTEL_SYSTEMS_PAGE_ROUTE },
    { locale: "en", title: hotelSystemsCopy.en.title, description: hotelSystemsCopy.en.lead, canonical: "/en/solutions/hotel-systems-implementation" },
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

function asVisual(row: unknown, fallback: CmsSystemsVisual): CmsSystemsVisual {
  const value = (row ?? {}) as Record<string, unknown>;
  return {
    src: String(value.src ?? fallback.src),
    altTh: String(value.altTh ?? fallback.altTh),
    altEn: String(value.altEn ?? fallback.altEn),
    status: String(value.status ?? fallback.status) as SystemsVisualStatus,
    label: String(value.label ?? fallback.label),
    caption: String(value.caption ?? fallback.caption),
    source: String(value.source ?? fallback.source ?? ""),
    approvalNote: String(value.approvalNote ?? fallback.approvalNote ?? ""),
    publicationApproved: Boolean(value.publicationApproved ?? fallback.publicationApproved),
  };
}

function asCta(row: unknown, fallback: CmsSystemsCta): CmsSystemsCta {
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

function asLine(row: Record<string, unknown>, index: number, seeded?: CmsSystemsLine): CmsSystemsLine {
  return {
    id: String(row.id || seeded?.id || `line-${index + 1}`),
    th: String(row.th ?? seeded?.th ?? ""),
    en: String(row.en ?? seeded?.en ?? ""),
  };
}

export function parseHotelSystemsPageBody(body: string, locale: Locale = "th"): CmsSystemsPage | null {
  try {
    const parsed = JSON.parse(body) as Partial<CmsSystemsPage> & { template?: string };
    if (parsed?.template && parsed.template !== HOTEL_SYSTEMS_CMS_TEMPLATE) return null;
    const seeded = defaultHotelSystemsCms(locale);
    const assessment = (parsed.assessment || {}) as Record<string, unknown>;
    const services = (parsed.services || {}) as Record<string, unknown>;
    const model = (parsed.model || {}) as Record<string, unknown>;
    const deliverables = (parsed.deliverables || {}) as Record<string, unknown>;
    const workflow = (parsed.workflow || {}) as Record<string, unknown>;
    const fit = (parsed.fit || {}) as Record<string, unknown>;
    const inventory = (parsed.inventory || {}) as Record<string, unknown>;
    const scope = (parsed.scope || {}) as Record<string, unknown>;
    const plan = (parsed.plan || {}) as Record<string, unknown>;
    const testing = (parsed.testing || {}) as Record<string, unknown>;
    const measure = (parsed.measure || {}) as Record<string, unknown>;
    const related = (parsed.related || {}) as Record<string, unknown>;
    const form = (parsed.form || {}) as Record<string, unknown>;
    const labels = (form.labels || {}) as Record<string, unknown>;
    const approvals = (parsed.approvals || {}) as Record<string, unknown>;
    return {
      version: 1,
      template: HOTEL_SYSTEMS_CMS_TEMPLATE,
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
          supportTh: String(row.supportTh ?? item.supportTh ?? row.actionTh ?? item.actionTh),
          supportEn: String(row.supportEn ?? item.supportEn ?? row.actionEn ?? item.actionEn),
          output: String(row.output ?? item.output ?? row.evidenceEn ?? item.evidenceEn),
          status: String(row.status ?? item.status ?? "needs_review"),
          evidenceTh: String(row.evidenceTh ?? item.evidenceTh ?? row.output ?? item.output ?? ""),
          evidenceEn: String(row.evidenceEn ?? item.evidenceEn ?? row.output ?? item.output ?? ""),
          ownerTh: String(row.ownerTh ?? item.ownerTh ?? ""),
          ownerEn: String(row.ownerEn ?? item.ownerEn ?? ""),
          actionTh: String(row.actionTh ?? item.actionTh ?? row.supportTh ?? item.supportTh ?? ""),
          actionEn: String(row.actionEn ?? item.actionEn ?? row.supportEn ?? item.supportEn ?? ""),
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
          actionTh: String(row.actionTh ?? item.actionTh ?? item.roleTh),
          actionEn: String(row.actionEn ?? item.actionEn ?? item.roleEn),
          output: String(row.output ?? item.output ?? item.dataOutEn),
          approvalTh: String(row.approvalTh ?? item.approvalTh ?? item.providerTh),
          approvalEn: String(row.approvalEn ?? item.approvalEn ?? item.providerEn),
          ownerTh: String(row.ownerTh ?? item.ownerTh),
          ownerEn: String(row.ownerEn ?? item.ownerEn),
          roleTh: String(row.roleTh ?? item.roleTh ?? row.actionTh ?? item.actionTh),
          roleEn: String(row.roleEn ?? item.roleEn ?? row.actionEn ?? item.actionEn),
          dataOutTh: String(row.dataOutTh ?? item.dataOutTh ?? ""),
          dataOutEn: String(row.dataOutEn ?? item.dataOutEn ?? row.output ?? item.output),
          sourceOfTruthTh: String(row.sourceOfTruthTh ?? item.sourceOfTruthTh ?? ""),
          sourceOfTruthEn: String(row.sourceOfTruthEn ?? item.sourceOfTruthEn ?? ""),
          status: String(row.status ?? item.status ?? "not_configured"),
          providerTh: String(row.providerTh ?? item.providerTh ?? row.approvalTh ?? item.approvalTh),
          providerEn: String(row.providerEn ?? item.providerEn ?? row.approvalEn ?? item.approvalEn),
          connectorTh: String(row.connectorTh ?? item.connectorTh ?? ""),
          connectorEn: String(row.connectorEn ?? item.connectorEn ?? ""),
          verified: Boolean(row.verified ?? item.verified),
        })),
        categories: asList(services.categories, seeded.services.categories, (row, index, item) => ({
          id: String(row.id || item.id || `category-${index + 1}`),
          th: String(row.th ?? item.th ?? ""),
          en: String(row.en ?? item.en ?? ""),
        })),
        connections: asList(services.connections, seeded.services.connections, (row, index, item) => ({
          id: String(row.id || item.id || `connection-${index + 1}`),
          from: String(row.from ?? item.from ?? ""),
          to: String(row.to ?? item.to ?? ""),
          labelTh: String(row.labelTh ?? item.labelTh ?? ""),
          labelEn: String(row.labelEn ?? item.labelEn ?? ""),
        })),
        pathLabel: asText(services, "pathLabel", seeded.services.pathLabel),
      },
      model: {
        title: asText(model, "title", seeded.model.title),
        lead: asText(model, "lead", seeded.model.lead),
        note: asText(model, "note", seeded.model.note),
        visual: asVisual(parsed.model?.visual, seeded.model.visual),
        steps: asList(model.steps, seeded.model.steps, (row, index, item) => ({
          id: String(row.id || item.id || `model-${index + 1}`),
          num: String(row.num ?? item.num),
          label: String(row.label ?? item.label),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          output: String(row.output ?? item.output),
        })),
        fields: asList(model.fields, seeded.model.fields, (row, index, item) => ({
          id: String(row.id || item.id || `field-${index + 1}`),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          bodyTh: String(row.bodyTh ?? item.bodyTh),
          bodyEn: String(row.bodyEn ?? item.bodyEn),
          ownerTh: String(row.ownerTh ?? item.ownerTh),
          ownerEn: String(row.ownerEn ?? item.ownerEn),
          status: String(row.status ?? item.status ?? "not_configured"),
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
          inspectTh: String(row.inspectTh ?? item.inspectTh ?? row.supportTh ?? item.supportTh),
          inspectEn: String(row.inspectEn ?? item.inspectEn ?? row.supportEn ?? item.supportEn),
          evidenceTh: String(row.evidenceTh ?? item.evidenceTh ?? ""),
          evidenceEn: String(row.evidenceEn ?? item.evidenceEn ?? ""),
          status: String(row.status ?? item.status ?? "needs_review"),
          ownerTh: String(row.ownerTh ?? item.ownerTh ?? ""),
          ownerEn: String(row.ownerEn ?? item.ownerEn ?? ""),
          actionTh: String(row.actionTh ?? item.actionTh ?? row.approvalTh ?? item.approvalTh),
          actionEn: String(row.actionEn ?? item.actionEn ?? row.approvalEn ?? item.approvalEn),
          output: String(row.output ?? item.output ?? row.deliverable ?? item.deliverable),
          supportTh: String(row.supportTh ?? item.supportTh ?? row.inspectTh ?? item.inspectTh),
          supportEn: String(row.supportEn ?? item.supportEn ?? row.inspectEn ?? item.inspectEn),
          deliverable: String(row.deliverable ?? item.deliverable ?? row.output ?? item.output),
          approvalTh: String(row.approvalTh ?? item.approvalTh ?? row.actionTh ?? item.actionTh),
          approvalEn: String(row.approvalEn ?? item.approvalEn ?? row.actionEn ?? item.actionEn),
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
          dependencyTh: String(row.dependencyTh ?? item.dependencyTh ?? ""),
          dependencyEn: String(row.dependencyEn ?? item.dependencyEn ?? ""),
          nextTh: String(row.nextTh ?? item.nextTh),
          nextEn: String(row.nextEn ?? item.nextEn),
        })),
        approvalsTitle: asText(workflow, "approvalsTitle", seeded.workflow.approvalsTitle),
        approvals: asList(workflow.approvals, seeded.workflow.approvals, asLine),
        gateTitle: asText(workflow, "gateTitle", seeded.workflow.gateTitle),
        gate: asText(workflow, "gate", seeded.workflow.gate),
      },
      fit: {
        title: asText(fit, "title", seeded.fit.title),
        lead: asText(fit, "lead", seeded.fit.lead),
        visual: asVisual(parsed.fit?.visual, seeded.fit.visual),
        scenarios: asList(fit.scenarios, seeded.fit.scenarios, (row, index, item) => {
          const categoryTh = String(row.categoryTh ?? row.situationTh ?? item.categoryTh ?? item.situationTh ?? "");
          const categoryEn = String(row.categoryEn ?? row.situationEn ?? item.categoryEn ?? item.situationEn ?? "");
          const example = String(row.example ?? row.output ?? item.example ?? item.output ?? "");
          const roleTh = String(row.roleTh ?? row.symptomTh ?? item.roleTh ?? item.symptomTh ?? "");
          const roleEn = String(row.roleEn ?? row.symptomEn ?? item.roleEn ?? item.symptomEn ?? "");
          const flowTh = String(row.flowTh ?? row.questionTh ?? item.flowTh ?? item.questionTh ?? "");
          const flowEn = String(row.flowEn ?? row.questionEn ?? item.flowEn ?? item.questionEn ?? "");
          const providerTh = String(row.providerTh ?? row.supportTh ?? item.providerTh ?? item.supportTh ?? "");
          const providerEn = String(row.providerEn ?? row.supportEn ?? item.providerEn ?? item.supportEn ?? "");
          return {
            id: String(row.id || item.id || `fit-${index + 1}`),
            categoryTh,
            categoryEn,
            example,
            logoSrc: String(row.logoSrc ?? item.logoSrc ?? ""),
            roleTh,
            roleEn,
            flowTh,
            flowEn,
            integrationStatus: String(row.integrationStatus ?? item.integrationStatus ?? ""),
            verificationStatus: String(row.verificationStatus ?? item.verificationStatus ?? ""),
            logoStatus: String(row.logoStatus ?? item.logoStatus ?? (row.logoSrc || item.logoSrc ? "sample" : "replace")),
            relationshipStatus: String(row.relationshipStatus ?? item.relationshipStatus ?? row.integrationStatus ?? item.integrationStatus ?? "example_category"),
            providerTh,
            providerEn,
            situationTh: categoryTh,
            situationEn: categoryEn,
            symptomTh: roleTh,
            symptomEn: roleEn,
            questionTh: flowTh,
            questionEn: flowEn,
            supportTh: providerTh,
            supportEn: providerEn,
            output: example,
          };
        }),
        notTitle: asText(fit, "notTitle", seeded.fit.notTitle),
        notItems: asList(fit.notItems, seeded.fit.notItems, asLine),
      },
      inventory: {
        title: asText(inventory, "title", seeded.inventory.title),
        lead: asText(inventory, "lead", seeded.inventory.lead),
        systemsTitle: asText(inventory, "systemsTitle", seeded.inventory.systemsTitle),
        fieldsTitle: asText(inventory, "fieldsTitle", seeded.inventory.fieldsTitle),
        sampleLabel: asText(inventory, "sampleLabel", seeded.inventory.sampleLabel),
        visual: asVisual(parsed.inventory?.visual, seeded.inventory.visual),
        rows: asList(inventory.rows, seeded.inventory.rows, (row, index, item) => ({
          id: String(row.id || item.id || `inventory-${index + 1}`),
          systemTh: String(row.systemTh ?? item.systemTh ?? ""),
          systemEn: String(row.systemEn ?? item.systemEn ?? ""),
          providerTh: String(row.providerTh ?? item.providerTh ?? ""),
          providerEn: String(row.providerEn ?? item.providerEn ?? ""),
          purposeTh: String(row.purposeTh ?? item.purposeTh ?? ""),
          purposeEn: String(row.purposeEn ?? item.purposeEn ?? ""),
          ownerTh: String(row.ownerTh ?? item.ownerTh ?? ""),
          ownerEn: String(row.ownerEn ?? item.ownerEn ?? ""),
          dataInTh: String(row.dataInTh ?? item.dataInTh ?? ""),
          dataInEn: String(row.dataInEn ?? item.dataInEn ?? ""),
          dataOutTh: String(row.dataOutTh ?? item.dataOutTh ?? ""),
          dataOutEn: String(row.dataOutEn ?? item.dataOutEn ?? ""),
          connector: String(row.connector ?? item.connector ?? ""),
          environment: String(row.environment ?? item.environment ?? "unknown"),
          status: String(row.status ?? item.status ?? "not_configured"),
          reviewed: String(row.reviewed ?? item.reviewed ?? ""),
          verified: Boolean(row.verified ?? item.verified),
        })),
        fields: asList(inventory.fields, seeded.inventory.fields, (row, index, item) => ({
          id: String(row.id || item.id || `field-${index + 1}`),
          field: String(row.field ?? item.field ?? ""),
          meaningTh: String(row.meaningTh ?? item.meaningTh ?? ""),
          meaningEn: String(row.meaningEn ?? item.meaningEn ?? ""),
          sourceTh: String(row.sourceTh ?? item.sourceTh ?? ""),
          sourceEn: String(row.sourceEn ?? item.sourceEn ?? ""),
          destinationTh: String(row.destinationTh ?? item.destinationTh ?? ""),
          destinationEn: String(row.destinationEn ?? item.destinationEn ?? ""),
          format: String(row.format ?? item.format ?? "text"),
          required: String(row.required ?? item.required ?? "optional"),
          mappingStatus: String(row.mappingStatus ?? item.mappingStatus ?? "not_yet_verified"),
          ownerTh: String(row.ownerTh ?? item.ownerTh ?? ""),
          ownerEn: String(row.ownerEn ?? item.ownerEn ?? ""),
          notesTh: String(row.notesTh ?? item.notesTh ?? ""),
          notesEn: String(row.notesEn ?? item.notesEn ?? ""),
        })),
      },
      scope: {
        title: asText(scope, "title", seeded.scope.title),
        lead: asText(scope, "lead", seeded.scope.lead),
        supportTitle: asText(scope, "supportTitle", seeded.scope.supportTitle),
        hotelTitle: asText(scope, "hotelTitle", seeded.scope.hotelTitle),
        matrixTitle: asText(scope, "matrixTitle", seeded.scope.matrixTitle),
        visual: asVisual(parsed.scope?.visual, seeded.scope.visual),
        rows: asList(scope.rows, seeded.scope.rows, (row, index, item) => ({
          id: String(row.id || item.id || `scope-${index + 1}`),
          titleTh: String(row.titleTh ?? item.titleTh),
          titleEn: String(row.titleEn ?? item.titleEn),
          itemsTh: String(row.itemsTh ?? item.itemsTh),
          itemsEn: String(row.itemsEn ?? item.itemsEn),
        })),
        matrix: asList(scope.matrix, seeded.scope.matrix, (row, index, item) => ({
          id: String(row.id || item.id || `resp-${index + 1}`),
          eventTh: String(row.eventTh ?? item.eventTh ?? ""),
          eventEn: String(row.eventEn ?? item.eventEn ?? ""),
          hotelTh: String(row.hotelTh ?? item.hotelTh ?? ""),
          hotelEn: String(row.hotelEn ?? item.hotelEn ?? ""),
          providerTh: String(row.providerTh ?? item.providerTh ?? ""),
          providerEn: String(row.providerEn ?? item.providerEn ?? ""),
          implTh: String(row.implTh ?? item.implTh ?? ""),
          implEn: String(row.implEn ?? item.implEn ?? ""),
          approvalTh: String(row.approvalTh ?? item.approvalTh ?? ""),
          approvalEn: String(row.approvalEn ?? item.approvalEn ?? ""),
          escalationTh: String(row.escalationTh ?? item.escalationTh ?? ""),
          escalationEn: String(row.escalationEn ?? item.escalationEn ?? ""),
          ownerTh: String(row.ownerTh ?? item.ownerTh ?? row.hotelTh ?? item.hotelTh ?? ""),
          ownerEn: String(row.ownerEn ?? item.ownerEn ?? row.hotelEn ?? item.hotelEn ?? ""),
          status: String(row.status ?? item.status ?? "documented_sample"),
        })),
        boundary: asText(scope, "boundary", seeded.scope.boundary),
      },
      plan: {
        title: asText(plan, "title", seeded.plan.title),
        lead: asText(plan, "lead", seeded.plan.lead),
        close: asText(plan, "close", seeded.plan.close),
        sampleLabel: asText(plan, "sampleLabel", seeded.plan.sampleLabel) || "Hotel Systems Handover and Ownership — Sample",
        checklistTitle: asText(plan, "checklistTitle", seeded.plan.checklistTitle),
        ownershipTitle: asText(plan, "ownershipTitle", seeded.plan.ownershipTitle),
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
        checklist: asList(plan.checklist, seeded.plan.checklist, (row, index, item) => ({
          id: String(row.id || item.id || `handover-${index + 1}`),
          itemTh: String(row.itemTh ?? item.itemTh ?? ""),
          itemEn: String(row.itemEn ?? item.itemEn ?? ""),
          status: String(row.status ?? item.status ?? "not_started"),
          ownerTh: String(row.ownerTh ?? item.ownerTh ?? ""),
          ownerEn: String(row.ownerEn ?? item.ownerEn ?? ""),
          evidenceTh: String(row.evidenceTh ?? item.evidenceTh ?? ""),
          evidenceEn: String(row.evidenceEn ?? item.evidenceEn ?? ""),
        })),
        ownership: asList(plan.ownership, seeded.plan.ownership, (row, index, item) => ({
          id: String(row.id || item.id || `asset-${index + 1}`),
          assetTh: String(row.assetTh ?? item.assetTh ?? ""),
          assetEn: String(row.assetEn ?? item.assetEn ?? ""),
          ownerTh: String(row.ownerTh ?? item.ownerTh ?? ""),
          ownerEn: String(row.ownerEn ?? item.ownerEn ?? ""),
          contactTh: String(row.contactTh ?? item.contactTh ?? ""),
          contactEn: String(row.contactEn ?? item.contactEn ?? ""),
          approvalTh: String(row.approvalTh ?? item.approvalTh ?? ""),
          approvalEn: String(row.approvalEn ?? item.approvalEn ?? ""),
          accessTh: String(row.accessTh ?? item.accessTh ?? ""),
          accessEn: String(row.accessEn ?? item.accessEn ?? ""),
          renewalTh: String(row.renewalTh ?? item.renewalTh ?? ""),
          renewalEn: String(row.renewalEn ?? item.renewalEn ?? ""),
          reviewed: String(row.reviewed ?? item.reviewed ?? "Sample — not a live review date"),
          status: String(row.status ?? item.status ?? "not_handed_over"),
        })),
      },
      testing: {
        title: asText(testing, "title", seeded.testing.title),
        lead: asText(testing, "lead", seeded.testing.lead),
        casesTitle: asText(testing, "casesTitle", seeded.testing.casesTitle),
        errorTitle: asText(testing, "errorTitle", seeded.testing.errorTitle),
        sampleLabel: asText(testing, "sampleLabel", seeded.testing.sampleLabel),
        visual: asVisual(parsed.testing?.visual, seeded.testing.visual),
        cases: asList(testing.cases, seeded.testing.cases, (row, index, item) => ({
          id: String(row.id || item.id || `test-${index + 1}`),
          caseTh: String(row.caseTh ?? item.caseTh ?? ""),
          caseEn: String(row.caseEn ?? item.caseEn ?? ""),
          triggerTh: String(row.triggerTh ?? item.triggerTh ?? ""),
          triggerEn: String(row.triggerEn ?? item.triggerEn ?? ""),
          expectedTh: String(row.expectedTh ?? item.expectedTh ?? ""),
          expectedEn: String(row.expectedEn ?? item.expectedEn ?? ""),
          actualTh: String(row.actualTh ?? item.actualTh ?? ""),
          actualEn: String(row.actualEn ?? item.actualEn ?? ""),
          status: String(row.status ?? item.status ?? "not_tested"),
          ownerTh: String(row.ownerTh ?? item.ownerTh ?? ""),
          ownerEn: String(row.ownerEn ?? item.ownerEn ?? ""),
          evidenceTh: String(row.evidenceTh ?? item.evidenceTh ?? ""),
          evidenceEn: String(row.evidenceEn ?? item.evidenceEn ?? ""),
          testedDate: String(row.testedDate ?? item.testedDate ?? ""),
          issueTh: String(row.issueTh ?? item.issueTh ?? ""),
          issueEn: String(row.issueEn ?? item.issueEn ?? ""),
          severity: String(row.severity ?? item.severity ?? ""),
          providerTh: String(row.providerTh ?? item.providerTh ?? ""),
          providerEn: String(row.providerEn ?? item.providerEn ?? ""),
          nextTh: String(row.nextTh ?? item.nextTh ?? ""),
          nextEn: String(row.nextEn ?? item.nextEn ?? ""),
          retestDate: String(row.retestDate ?? item.retestDate ?? ""),
        })),
        errorSteps: asList(testing.errorSteps, seeded.testing.errorSteps, asLine),
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
          ownerTh: String(row.ownerTh ?? item.ownerTh ?? ""),
          ownerEn: String(row.ownerEn ?? item.ownerEn ?? ""),
          updatedAt: String(row.updatedAt ?? item.updatedAt ?? ""),
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
          pms: String(labels.pms ?? seeded.form.labels.pms),
          channelManager: String(labels.channelManager ?? seeded.form.labels.channelManager),
          bookingEngine: String(labels.bookingEngine ?? seeded.form.labels.bookingEngine),
          systems: String(labels.systems ?? seeded.form.labels.systems),
          providerContact: String(labels.providerContact ?? seeded.form.labels.providerContact),
          goal: String(labels.goal ?? seeded.form.labels.goal),
          message: String(labels.message ?? seeded.form.labels.message),
          consent: String(labels.consent ?? seeded.form.labels.consent),
          privacy: String(labels.privacy ?? seeded.form.labels.privacy),
        },
        goals: asList(form.goals, seeded.form.goals, asLine),
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
        canonical: String(parsed.seo?.canonical || HOTEL_SYSTEMS_PAGE_ROUTE),
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

export function serializeHotelSystemsPageBody(content: CmsSystemsPage) {
  return JSON.stringify({ ...content, version: 1, template: HOTEL_SYSTEMS_CMS_TEMPLATE });
}

export function isHotelSystemsCmsBody(body: string) {
  try {
    const parsed = JSON.parse(body) as { template?: string };
    return parsed?.template === HOTEL_SYSTEMS_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function isHotelSystemsPageDocument(input: { slug: string; template: string }) {
  if (input.template === HOTEL_SYSTEMS_CMS_TEMPLATE) return true;
  return (
    input.slug === HOTEL_SYSTEMS_PAGE_SLUG ||
    input.slug === "en/solutions/hotel-systems-implementation" ||
    input.slug === "ru/solutions/hotel-systems-implementation" ||
    input.slug === "zh/solutions/hotel-systems-implementation"
  );
}

const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;
const GUARANTEE_RE =
  /(การันตี|รับประกัน|guarantee[ds]?)\s*.{0,48}(รายได้|occupancy|adr|revpar|กำไร|คะแนนแขก|growth|revenue|profit|guest score)|((รายได้|occupancy|adr|revpar|กำไร|revenue|profit|guest score|growth)\s*.{0,48}(การันตี|รับประกัน|guarantee[ds]?))/i;
const PLACEHOLDER_RE = /placeholder|dummy|ลอว์เรส|replace with/i;
const COMMERCIAL_RE =
  /client name|ชื่อลูกค้า|case study|ผลลัพธ์โรงแรม|team photo|รูปทีม|client logo|โลโก้ลูกค้า|฿\s?\d|\d+\s*(บาท|THB|USD)/i;
const SECRET_ASSIGN_RE =
  /(api[_-\s]?key|secret[_-\s]?key|password|passwd|auth[_-\s]?token|access[_-\s]?token|bearer|account[_-\s]?id|booking[_-\s]?id|reservation[_-\s]?id|guest\s+(name|email|phone|data)|payment\s+(data|token|card)|credit\s*card|cvv|รหัสผ่าน|รหัส\s*API|โทเคน|เลขที่บัญชี)\s*[:=]\s*\S+/i;
const SECRET_TOKEN_RE = /\b(sk_live_|pk_live_|sk_test_|rk_live_|Bearer\s+[A-Za-z0-9\-._]{12,})\b/;
const CONNECTED_RE = /^(connected|live|ready)$/i;
const CONNECTED_CLAIM_RE = /\bconnected\b|เชื่อมต่อแล้ว|เชื่อมสำเร็จ/i;
const CLAIM_SOURCE_RE =
  /subject to technical verification|ขึ้นกับ.{0,40}ตรวจ|ต้องตรวจทางเทคนิค|provider confirmation|ยืนยันจากผู้ให้บริการ|sample|ตัวอย่าง|guidance|แหล่งที่มา/i;
const CLAIM_NEGATION_RE =
  /ไม่(ได้)?ทำเครื่องหมาย|ไม่ใช่หลักฐาน|ไม่ได้หมายถึง|ไม่ได้หมายความ|not marked|not a live|not proof|is not proof|does not mean|do not mark|until hotel approval|จนกว่า|ห้าม/i;
const BARE_CLAIM_RE = /เชื่อมต่อแล้ว|fully connected|live integration|production-ready|ทำงานอัตโนมัติเต็มที่/;
const HONEST_DENIAL_RE =
  /ไม่ใช่รูปทีม|ไม่มีรูปทีม|ไม่ใช่โลโก้วอลล์|not a logo wall|is not a logo wall|not a .{0,24}team (photo|photograph)|without.{0,24}(team photo|client logo)/i;
const VERIFIED_PLATFORM = new Set(["existing_client_system", "verified_integration"]);
const APPROVED_LOGO = new Set(["approved", "sample"]);

function walkStrings(value: unknown, visit: (text: string) => void) {
  if (typeof value === "string") visit(value);
  else if (Array.isArray(value)) value.forEach((item) => walkStrings(item, visit));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walkStrings(item, visit));
}

function hasSampleMark(text: string) {
  return /sample|ตัวอย่าง/i.test(text);
}

function visualIsPublishable(visual: CmsSystemsVisual, bilingual: boolean) {
  if (!visual.src.trim()) return null;
  if (!visual.altTh.trim()) return "missing_alt";
  if (bilingual && !visual.altEn.trim()) return "missing_alt";
  const status = String(visual.status || "replace");
  if (status === "placeholder" || status === "replace") return "placeholder_status";
  if (status === "real" && !visual.publicationApproved) return "screenshot_approval";
  if (status !== "approved" && status !== "sample" && status !== "real") return "placeholder_status";
  if (!APPROVED_LOGO.has(status === "real" ? "approved" : status) && status !== "real") return "placeholder_status";
  if (PLACEHOLDER_RE.test(`${visual.src} ${visual.label} ${visual.caption}`) && status !== "sample") return "placeholder_label";
  if (status === "sample" && !hasSampleMark(`${visual.label} ${visual.caption}`)) return "missing_sample_label";
  if (status === "approved" && !PLACEHOLDER_RE.test(visual.src) && !visual.publicationApproved) return "screenshot_approval";
  return null;
}

function textHasSecrets(text: string) {
  return SECRET_ASSIGN_RE.test(text) || SECRET_TOKEN_RE.test(text);
}

function contentHasSecrets(content: CmsSystemsPage) {
  let found = false;
  walkStrings(content, (text) => {
    if (textHasSecrets(text)) found = true;
  });
  return found;
}

function missingOwner(ownerTh: string, ownerEn: string, bilingual: boolean) {
  if (bilingual) return !ownerTh.trim() || !ownerEn.trim();
  return !ownerTh.trim() && !ownerEn.trim();
}

function labelledConnected(value: string) {
  return CONNECTED_RE.test(value.trim()) || CONNECTED_CLAIM_RE.test(value);
}

function hasClaimSource(text: string) {
  return CLAIM_SOURCE_RE.test(text);
}

function isBareTechnicalClaim(text: string) {
  if (!BARE_CLAIM_RE.test(text)) return false;
  if (hasClaimSource(text) || CLAIM_NEGATION_RE.test(text)) return false;
  return true;
}


function hasPerformanceEvidence(content: CmsSystemsPage) {
  if (!content.approvals.performanceClaims || !content.approvals.evidenceNote.trim()) return false;
  return content.measure.sources.some(
    (source) =>
      (source.nameTh.trim() || source.nameEn.trim()) &&
      (source.url.trim() || source.publishedAt.trim() || source.accessedAt.trim()) &&
      (source.definitionTh.trim() || source.definitionEn.trim()),
  );
}

export function validateHotelSystemsPage(content: CmsSystemsPage, intent: SystemsCmsIntent) {
  if (intent === "unpublish") return null;
  if (contentHasSecrets(content)) return "blocked_secret";
  if (intent !== "publish") return null;
  if (!content.hero.title.trim() || !content.hero.description.trim()) return "required_fields";
  if (!content.scope.boundary.trim()) return "empty_scope_boundary";
  if (!hasSampleMark(content.plan.sampleLabel) || !hasSampleMark(content.inventory.sampleLabel) || !hasSampleMark(content.testing.sampleLabel)) {
    return "missing_sample_label";
  }
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
    content.inventory.visual,
    content.scope.visual,
    content.plan.visual,
    content.testing.visual,
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
  for (const node of content.services.items) {
    if (labelledConnected(node.status) && !node.verified) return "unverified_connected";
  }
  for (const row of content.inventory.rows) {
    if (missingOwner(row.ownerTh, row.ownerEn, content.bilingualPublish) || !row.status.trim()) return "empty_owner_status";
    if (labelledConnected(row.status) && !row.verified) return "unverified_connected";
  }
  for (const row of content.inventory.fields) {
    if (missingOwner(row.ownerTh, row.ownerEn, content.bilingualPublish) || !row.mappingStatus.trim()) return "empty_owner_status";
  }
  for (const row of content.testing.cases) {
    if (missingOwner(row.ownerTh, row.ownerEn, content.bilingualPublish) || !row.status.trim()) return "empty_owner_status";
    if (row.status === "passed" && !hasSampleMark(`${row.actualTh} ${row.actualEn} ${row.evidenceTh} ${row.evidenceEn}`)) {
      return "missing_sample_label";
    }
    if (row.status === "failed" && (!(row.issueTh.trim() || row.issueEn.trim()) || !row.severity.trim())) {
      return "empty_failed_issue";
    }
  }
  for (const row of content.plan.ownership) {
    if (missingOwner(row.ownerTh, row.ownerEn, content.bilingualPublish) || !row.status.trim()) return "empty_owner_status";
  }
  for (const row of content.plan.checklist) {
    if (missingOwner(row.ownerTh, row.ownerEn, content.bilingualPublish) || !row.status.trim()) return "empty_owner_status";
  }
  for (const row of content.scope.matrix) {
    if (missingOwner(row.ownerTh || row.hotelTh, row.ownerEn || row.hotelEn, content.bilingualPublish) || !String(row.status || "").trim()) {
      return "empty_owner_status";
    }
  }
  for (const row of content.fit.scenarios) {
    const claim = `${row.example} ${row.integrationStatus} ${row.categoryEn} ${row.categoryTh} ${row.flowEn} ${row.flowTh}`;
    if (labelledConnected(claim) && !VERIFIED_PLATFORM.has(row.verificationStatus)) return "unverified_connected";
    if (row.logoSrc.trim()) {
      if (!APPROVED_LOGO.has(row.logoStatus || "replace")) return "logo_unapproved";
      if (!String(row.relationshipStatus || row.integrationStatus || "").trim()) return "logo_unapproved";
    }
    const technical = `${row.flowTh} ${row.flowEn} ${row.roleTh} ${row.roleEn} ${row.providerTh} ${row.providerEn}`;
    if (isBareTechnicalClaim(technical) && !hasClaimSource(`${technical} ${row.verificationStatus}`)) return "unverified_claim";
  }
  for (const kpi of content.measure.kpis) {
    if (kpi.hideUntilData || kpi.dataStatus === "draft" || kpi.dataStatus === "not-configured") continue;
    if (
      !kpi.period.trim() ||
      !kpi.market.trim() ||
      !kpi.source.trim() ||
      !(kpi.definitionTh.trim() || kpi.definitionEn.trim()) ||
      !kpi.dataStatus ||
      !(kpi.ownerTh.trim() || kpi.ownerEn.trim()) ||
      !kpi.updatedAt.trim()
    ) {
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
  let unverifiedClaim = false;
  walkStrings(content, (text) => {
    const honestDenial = HONEST_DENIAL_RE.test(text);
    if (COMMERCIAL_RE.test(text) && !honestDenial) commercial = true;
    if (
      GUARANTEE_RE.test(text) &&
      !/(ไม่(ได้)?การันตี|ไม่ใช่ผล.{0,16}ที่การันตี|ไม่รับประกัน|not a guaranteed|does not guarantee|do not guarantee|does this guarantee|no guarantee|without guaranteeing|expects guaranteed|ต้องการ.{0,40}การันตี|หรือไม่\s*\??\s*$)/i.test(text)
    ) {
      guarantee = true;
    }
    if (/team photo|รูปทีม|headshot/i.test(text) && !honestDenial) teamPhoto = true;
    if (/client logo|โลโก้ลูกค้า|logo wall/i.test(text) && !honestDenial) clientLogo = true;
    if (isBareTechnicalClaim(text)) unverifiedClaim = true;
  });
  if (unverifiedClaim) return "unverified_claim";
  if (guarantee && !hasPerformanceEvidence(content)) return "guarantee_claim";
  if (teamPhoto && !content.approvals.teamPhotos) return "publication_approval";
  if (clientLogo && !content.approvals.clientLogos) return "publication_approval";
  if (commercial && !(content.approvals.clientNames || content.approvals.results || content.related.cards.some((card) => card.publicationApproved))) {
    return "publication_approval";
  }
  return null;
}

export type HotelSystemsEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical: string;
  locale: string;
  status: string;
  content: CmsSystemsPage;
};

export function editorStateFromHotelSystemsDocument(input: {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical?: string | null;
  locale: string;
  status: string;
  body: string;
}): HotelSystemsEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseHotelSystemsPageBody(input.body, locale) ?? emptyHotelSystemsCms();
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

export function hotelSystemsPublicPath(locale: Locale) {
  const page = pages.find((item) => item.route.endsWith("/solutions/hotel-systems-implementation") && item.language === locale);
  return page?.route || (locale === "th" ? HOTEL_SYSTEMS_PAGE_ROUTE : `/${locale}${HOTEL_SYSTEMS_PAGE_ROUTE}`);
}

export const SYSTEMS_CMS_ERRORS_TH: Record<string, string> = {
  required_fields: "กรอกหัวข้อและคำอธิบายก่อนเผยแพร่",
  empty_faq: "คำถามที่พบบ่อยต้องมีคำถามและคำตอบ",
  empty_faq_bilingual: "คำถามที่พบบ่อยต้องมีภาษาไทยและภาษาอังกฤษก่อนเผยแพร่สองภาษา",
  empty_scope_boundary: "ขอบเขตงาน (Scope Boundary) ต้องไม่ว่างก่อนเผยแพร่",
  missing_sample_label: "Inventory, Testing/QA และการส่งมอบต้องมีป้าย Sample ที่มองเห็นก่อนเผยแพร่",
  invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
  missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและภาษาอังกฤษ",
  placeholder_status: "เปลี่ยนสถานะรูปเป็น Sample หรือ Approved ก่อนเผยแพร่",
  placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะไม่ใช่ Sample",
  kpi_incomplete: "KPI ที่เผยแพร่ต้องมีช่วงเวลา บริบท แหล่งที่มา คำนิยาม สถานะ ผู้รับผิดชอบ และวันที่อัปเดต",
  source_incomplete: "แหล่งที่มาต้องมีชื่อ และ URL หรือวันที่",
  publication_approval: "ชื่อโรงแรม รูปทีม โลโก้ลูกค้า หรือผลลัพธ์ต้องได้รับอนุมัติก่อนเผยแพร่",
  guarantee_claim: "ห้ามการันตีรายได้ Occupancy ADR RevPAR กำไร คะแนนแขก หรือการเติบโต ถ้ายังไม่มีหลักฐานและอนุมัติ",
  blocked_secret: "ห้ามใส่คีย์ API รหัสผ่าน โทเคน รหัสบัญชี ข้อมูลแขก รหัสการจอง หรือข้อมูลชำระเงินในเนื้อหาสาธารณะ",
  unverified_connected: "ห้ามติดป้าย Connected ถ้ายังไม่มีการตรวจทางเทคนิคหรือยืนยันจากผู้ให้บริการ",
  unverified_claim: "ข้อความทางเทคนิคต้องมีแหล่งที่มา การยืนยันจากผู้ให้บริการ หรือสถานะ Subject to technical verification",
  empty_owner_status: "ตาราง Inventory Dictionary Test Case Ownership และ Responsibility ต้องมีผู้รับผิดชอบและสถานะก่อนเผยแพร่",
  empty_failed_issue: "เคส Failed ต้องมีคำอธิบายปัญหาและความรุนแรงก่อนเผยแพร่",
  logo_unapproved: "โลโก้แพลตฟอร์มต้องมีสถานะ Approved หรือ Sample และสถานะความสัมพันธ์ก่อนเผยแพร่",
  screenshot_approval: "ภาพหน้าจอโรงแรมหรือระบบจริงต้องได้รับอนุมัติเผยแพร่",
  invalid_image: "ไฟล์รูปไม่ถูกต้อง",
  invalid_json: "ข้อมูลที่บันทึกไม่ถูกต้อง",
  missing: "ไม่พบหน้าเพจ",
  invalid_locale: "ภาษาปลายทางไม่ถูกต้อง",
  locale_exists: "มีฉบับภาษานี้อยู่แล้ว",
};
export const SYSTEMS_CMS_ERRORS_EN: Record<string, string> = {
  required_fields: "Add a title and description before publishing",
  empty_faq: "FAQs need a question and an answer",
  empty_faq_bilingual: "FAQs need Thai and English before bilingual publish",
  empty_scope_boundary: "Scope Boundary cannot be empty before publishing",
  missing_sample_label: "Inventory, Testing/QA, and handover need a visible Sample label before publishing",
  invalid_cta: "CTA URLs must be /path, #anchor, mailto, tel, or http(s)",
  missing_alt: "Published images need Thai and English alt text",
  placeholder_status: "Set the image status to Sample or Approved before publishing",
  placeholder_label: "Do not publish Placeholder copy unless the status is Sample",
  kpi_incomplete: "Published KPIs need period, context, source, definition, status, owner, and updated date",
  source_incomplete: "Sources need a name and a URL or date",
  publication_approval: "Hotel names, team photos, client logos, and results need publication approval",
  guarantee_claim: "Revenue, Occupancy, ADR, RevPAR, profit, guest-score, or growth guarantees need approval and evidence",
  blocked_secret: "Do not put API keys, passwords, tokens, account IDs, guest data, booking IDs, or payment data in public fields",
  unverified_connected: "A platform cannot be labelled Connected without technical verification",
  unverified_claim: "Technical claims need a source, provider confirmation, or status Subject to technical verification",
  empty_owner_status: "System Inventory, Data Dictionary, Test Case, Ownership, and Responsibility records need owner and status before publishing",
  empty_failed_issue: "Failed test cases need an issue description and severity before publishing",
  logo_unapproved: "Platform logos need Approved or Sample asset status and a relationship status before publishing",
  screenshot_approval: "Real hotel or system screenshots need publication approval",
  invalid_image: "The image file is not valid",
  invalid_json: "The saved data is not valid",
  missing: "Page not found",
  invalid_locale: "The destination language is not valid",
  locale_exists: "A version in that language already exists",
};

export function hotelSystemsCmsErrorMessage(code: string) {
  return `${SYSTEMS_CMS_ERRORS_TH[code] ?? "บันทึกไม่สำเร็จ"} / ${SYSTEMS_CMS_ERRORS_EN[code] ?? "Save failed"}`;
}
