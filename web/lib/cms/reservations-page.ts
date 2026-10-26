import type { FaqItem } from "@/lib/faqs";
import type { Locale } from "@/lib/seo";
import { existingHref } from "@/lib/seo";
import {
  REVENUE_INTENTS,
  REVENUE_KPI_STATUSES,
  REVENUE_VISUAL_STATUSES,
  type RevenueIntent,
  type RevenueVisualStatus,
} from "@/lib/cms/revenue-page";
import type { DataStatus } from "@/lib/revenue";

export const RESERVATIONS_CMS_TEMPLATE = "outsourced-reservations";
export const RESERVATIONS_PAGE_SLUG = "solutions/outsourced-hotel-reservations";
export const RESERVATIONS_PAGE_ROUTE = "/solutions/outsourced-hotel-reservations";

export const RESERVATIONS_INTENTS = REVENUE_INTENTS;
export const RESERVATIONS_VISUAL_STATUSES = REVENUE_VISUAL_STATUSES;
export const RESERVATIONS_KPI_STATUSES = REVENUE_KPI_STATUSES;
export type ReservationsIntent = RevenueIntent;
export type ReservationsVisualStatus = RevenueVisualStatus;
export type ReservationsKpiStatus = DataStatus;
export type ReservationsSaveResult = { ok: true; id: string; intent: ReservationsIntent } | { ok: false; error: string };

export type CmsCta = { label: string; href: string };

export type CmsReservationsVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: ReservationsVisualStatus;
  label: string;
  caption: string;
};

export type CmsReservationProblem = {
  id: string;
  problem: string;
  impact: string;
  support: string;
  order: number;
};

export type CmsReservationScopeItem = {
  id: string;
  title: string;
  description: string;
  input: string;
  output: string;
  channels: string;
  order: number;
};

export type CmsReservationBenefitGroup = {
  id: string;
  title: string;
  items: string[];
};

export type CmsReservationFlowStep = {
  id: string;
  number: string;
  label: string;
};

export type CmsReservationWorkflowStep = {
  id: string;
  number: string;
  title: string;
  description: string;
  owner: string;
  input: string;
  output: string;
  escalation: string;
  order: number;
};

export type CmsReservationKpi = {
  id: string;
  name: string;
  definition: string;
  unit: string;
  period: string;
  target: string;
  value: string;
  dataStatus: ReservationsKpiStatus;
  values: number[];
  labels: string[];
  hideUntilData: boolean;
};

export type CmsRelatedCard = {
  id: string;
  href: string;
  category: string;
  title: string;
  description: string;
  meta: string;
  cta: string;
};

export type CmsBoundaryItem = { id: string; label: string; configured: boolean };

export type CmsReservationsPage = {
  version: 1;
  template: typeof RESERVATIONS_CMS_TEMPLATE;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    leadNext: string;
    leadClose: string;
    primaryCta: CmsCta;
    secondaryCta: CmsCta;
    underCta: string;
    caption: string;
    capabilities: string[];
    visual: CmsReservationsVisual;
  };
  problemsSection: { title: string; caption: string; visualLabel: string; visual: CmsReservationsVisual };
  problems: CmsReservationProblem[];
  scopeSection: { title: string; mapStatus: string; mapLabel: string; visual: CmsReservationsVisual };
  scopeItems: CmsReservationScopeItem[];
  benefitsSection: { title: string; intro: string; close: string; visual: CmsReservationsVisual };
  benefitGroups: CmsReservationBenefitGroup[];
  flowSteps: CmsReservationFlowStep[];
  workflowSection: { title: string; noteTitle: string; noteBody: string; visual: CmsReservationsVisual };
  workflowSteps: CmsReservationWorkflowStep[];
  measureSection: { title: string; intro: string; close: string; sampleLabel: string; visual: CmsReservationsVisual };
  kpis: CmsReservationKpi[];
  related: { title: string; visual: CmsReservationsVisual; cards: CmsRelatedCard[] };
  form: {
    kicker: string;
    heading: string;
    lead: string;
    nextTitle: string;
    steps: string[];
    trust: string[];
    submit: string;
    workGroup: string;
    channelsLabel: string;
    channelsHint: string;
    scopeLabel: string;
    scopeHint: string;
    visual: CmsReservationsVisual;
  };
  faqIntro: string;
  faqs: Array<FaqItem & { id: string }>;
  boundaries: {
    handles: CmsBoundaryItem[];
    hotelOwns: CmsBoundaryItem[];
    supportedChannels: string[];
    supportedLanguages: string[];
    operatingHours: string;
    slaText: string;
    slaApproved: boolean;
    escalationPath: string;
    integrationNotes: string;
    reportingFrequency: string;
    privacyNote: string;
  };
  seo: { social: CmsReservationsVisual };
};

export type ReservationsEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  content: CmsReservationsPage;
};

const PLACEHOLDER_RE = /placeholder|replace with verified|replace with approved|รอรูป|lorem ipsum/i;
const SAMPLE_RE = /sample data|ตัวอย่างข้อมูล|ตัวอย่าง/i;
const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(?:\+?\s*66|\b0)\s*\d(?:[\s.-]?\d){7,9}\b/;
const CARD_RE = /\b(?:\d[ -]*?){13,19}\b/;
const BOOKING_RE = /\b(?:RQ|BK|HTL|RES|CONF)[-_ ]?\d{3,}\b/i;
const GUEST_NAME_RE = /\b(?:khun|คุณ)\s+[A-Zก-๙][A-Za-zก-๙.'-]{1,}\b/i;

function emptyVisual(): CmsReservationsVisual {
  return { src: "", altTh: "", altEn: "", status: "placeholder", label: "", caption: "" };
}

function emptyCta(): CmsCta {
  return { label: "", href: "/" };
}

export function emptyReservationsCms(): CmsReservationsPage {
  return {
    version: 1,
    template: RESERVATIONS_CMS_TEMPLATE,
    hero: {
      eyebrow: "",
      title: "",
      description: "",
      leadNext: "",
      leadClose: "",
      primaryCta: emptyCta(),
      secondaryCta: emptyCta(),
      underCta: "",
      caption: "",
      capabilities: [],
      visual: emptyVisual(),
    },
    problemsSection: { title: "", caption: "", visualLabel: "", visual: emptyVisual() },
    problems: [],
    scopeSection: { title: "", mapStatus: "", mapLabel: "", visual: emptyVisual() },
    scopeItems: [],
    benefitsSection: { title: "", intro: "", close: "", visual: emptyVisual() },
    benefitGroups: [],
    flowSteps: [],
    workflowSection: { title: "", noteTitle: "", noteBody: "", visual: emptyVisual() },
    workflowSteps: [],
    measureSection: { title: "", intro: "", close: "", sampleLabel: "Sample data", visual: emptyVisual() },
    kpis: [],
    related: { title: "", visual: emptyVisual(), cards: [] },
    form: {
      kicker: "",
      heading: "",
      lead: "",
      nextTitle: "",
      steps: [],
      trust: [],
      submit: "",
      workGroup: "",
      channelsLabel: "",
      channelsHint: "",
      scopeLabel: "",
      scopeHint: "",
      visual: emptyVisual(),
    },
    faqIntro: "",
    faqs: [],
    boundaries: {
      handles: [],
      hotelOwns: [],
      supportedChannels: [],
      supportedLanguages: [],
      operatingHours: "",
      slaText: "",
      slaApproved: false,
      escalationPath: "",
      integrationNotes: "",
      reportingFrequency: "",
      privacyNote: "",
    },
    seo: { social: emptyVisual() },
  };
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function bool(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "1" || value === "true") return true;
  if (value === "0" || value === "false") return false;
  return fallback;
}

function asVisualStatus(value: unknown, fallback: ReservationsVisualStatus = "placeholder"): ReservationsVisualStatus {
  return REVENUE_VISUAL_STATUSES.includes(value as ReservationsVisualStatus)
    ? (value as ReservationsVisualStatus)
    : fallback;
}

function asKpiStatus(value: unknown, fallback: ReservationsKpiStatus = "draft"): ReservationsKpiStatus {
  const next = String(value || "").toLowerCase();
  if (REVENUE_KPI_STATUSES.includes(next as ReservationsKpiStatus)) return next as ReservationsKpiStatus;
  if (next === "sample") return "sample";
  if (next === "approved") return "approved";
  return fallback;
}

function numbers(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => Number(item)).filter((item) => Number.isFinite(item));
}

function strings(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item)).filter(Boolean);
}

export function newReservationsItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseVisual(value: unknown, fallback: CmsReservationsVisual): CmsReservationsVisual {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    src: text(row.src) || fallback.src,
    altTh: text(row.altTh) || text(row.alt) || fallback.altTh,
    altEn: text(row.altEn) || text(row.alt) || fallback.altEn,
    status: asVisualStatus(row.status, fallback.status),
    label: text(row.label) || fallback.label,
    caption: text(row.caption) || fallback.caption,
  };
}

function parseCta(value: unknown, fallback: CmsCta): CmsCta {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    label: text(row.label) || fallback.label,
    href: text(row.href) || fallback.href,
  };
}

function parseBoundaryItems(value: unknown, fallback: CmsBoundaryItem[]): CmsBoundaryItem[] {
  if (!Array.isArray(value) || !value.length) return fallback.map((item) => ({ ...item }));
  return value.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: text(row.id) || `item-${index + 1}`,
      label: text(row.label),
      configured: row.configured !== false,
    };
  });
}

export function isReservationsCmsBody(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return false;
  try {
    const parsed = JSON.parse(trimmed) as { template?: string };
    return parsed.template === RESERVATIONS_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function parseReservationsPageBody(raw: string, _locale: Locale = "th"): CmsReservationsPage | null {
  const fallback = emptyReservationsCms();
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    if (parsed.template !== RESERVATIONS_CMS_TEMPLATE) return null;
    const hero = parsed.hero && typeof parsed.hero === "object" ? (parsed.hero as Record<string, unknown>) : {};
    const problemsSection =
      parsed.problemsSection && typeof parsed.problemsSection === "object"
        ? (parsed.problemsSection as Record<string, unknown>)
        : {};
    const scopeSection =
      parsed.scopeSection && typeof parsed.scopeSection === "object" ? (parsed.scopeSection as Record<string, unknown>) : {};
    const benefitsSection =
      parsed.benefitsSection && typeof parsed.benefitsSection === "object"
        ? (parsed.benefitsSection as Record<string, unknown>)
        : {};
    const workflowSection =
      parsed.workflowSection && typeof parsed.workflowSection === "object"
        ? (parsed.workflowSection as Record<string, unknown>)
        : {};
    const measureSection =
      parsed.measureSection && typeof parsed.measureSection === "object"
        ? (parsed.measureSection as Record<string, unknown>)
        : {};
    const related = parsed.related && typeof parsed.related === "object" ? (parsed.related as Record<string, unknown>) : {};
    const form = parsed.form && typeof parsed.form === "object" ? (parsed.form as Record<string, unknown>) : {};
    const boundaries =
      parsed.boundaries && typeof parsed.boundaries === "object" ? (parsed.boundaries as Record<string, unknown>) : {};
    const seo = parsed.seo && typeof parsed.seo === "object" ? (parsed.seo as Record<string, unknown>) : {};

    return {
      version: 1,
      template: RESERVATIONS_CMS_TEMPLATE,
      hero: {
        eyebrow: text(hero.eyebrow) || fallback.hero.eyebrow,
        title: text(hero.title) || fallback.hero.title,
        description: text(hero.description) || fallback.hero.description,
        leadNext: text(hero.leadNext) || fallback.hero.leadNext,
        leadClose: text(hero.leadClose) || fallback.hero.leadClose,
        primaryCta: parseCta(hero.primaryCta, fallback.hero.primaryCta),
        secondaryCta: parseCta(hero.secondaryCta, fallback.hero.secondaryCta),
        underCta: text(hero.underCta) || fallback.hero.underCta,
        caption: text(hero.caption) || fallback.hero.caption,
        capabilities: strings(hero.capabilities).length ? strings(hero.capabilities) : fallback.hero.capabilities,
        visual: parseVisual(hero.visual, fallback.hero.visual),
      },
      problemsSection: {
        title: text(problemsSection.title) || fallback.problemsSection.title,
        caption: text(problemsSection.caption) || fallback.problemsSection.caption,
        visualLabel: text(problemsSection.visualLabel) || fallback.problemsSection.visualLabel,
        visual: parseVisual(problemsSection.visual, fallback.problemsSection.visual),
      },
      problems: Array.isArray(parsed.problems)
        ? parsed.problems.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return {
              id: text(row.id) || `problem-${index + 1}`,
              problem: text(row.problem),
              impact: text(row.impact),
              support: text(row.support),
              order: Number(row.order) || index + 1,
            };
          })
        : fallback.problems,
      scopeSection: {
        title: text(scopeSection.title) || fallback.scopeSection.title,
        mapStatus: text(scopeSection.mapStatus) || fallback.scopeSection.mapStatus,
        mapLabel: text(scopeSection.mapLabel) || fallback.scopeSection.mapLabel,
        visual: parseVisual(scopeSection.visual, fallback.scopeSection.visual),
      },
      scopeItems: Array.isArray(parsed.scopeItems)
        ? parsed.scopeItems.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return {
              id: text(row.id) || `scope-${index + 1}`,
              title: text(row.title),
              description: text(row.description),
              input: text(row.input),
              output: text(row.output),
              channels: text(row.channels),
              order: Number(row.order) || index + 1,
            };
          })
        : fallback.scopeItems,
      benefitsSection: {
        title: text(benefitsSection.title) || fallback.benefitsSection.title,
        intro: text(benefitsSection.intro) || fallback.benefitsSection.intro,
        close: text(benefitsSection.close) || fallback.benefitsSection.close,
        visual: parseVisual(benefitsSection.visual, fallback.benefitsSection.visual),
      },
      benefitGroups: Array.isArray(parsed.benefitGroups)
        ? parsed.benefitGroups.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return {
              id: text(row.id) || `benefit-${index + 1}`,
              title: text(row.title),
              items: strings(row.items),
            };
          })
        : fallback.benefitGroups,
      flowSteps: Array.isArray(parsed.flowSteps)
        ? parsed.flowSteps.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return {
              id: text(row.id) || `flow-${index + 1}`,
              number: text(row.number) || String(index + 1).padStart(2, "0"),
              label: text(row.label),
            };
          })
        : fallback.flowSteps,
      workflowSection: {
        title: text(workflowSection.title) || fallback.workflowSection.title,
        noteTitle: text(workflowSection.noteTitle) || fallback.workflowSection.noteTitle,
        noteBody: text(workflowSection.noteBody) || fallback.workflowSection.noteBody,
        visual: parseVisual(workflowSection.visual, fallback.workflowSection.visual),
      },
      workflowSteps: Array.isArray(parsed.workflowSteps)
        ? parsed.workflowSteps.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return {
              id: text(row.id) || `workflow-${index + 1}`,
              number: text(row.number) || String(index + 1).padStart(2, "0"),
              title: text(row.title),
              description: text(row.description),
              owner: text(row.owner),
              input: text(row.input),
              output: text(row.output),
              escalation: text(row.escalation),
              order: Number(row.order) || index + 1,
            };
          })
        : fallback.workflowSteps,
      measureSection: {
        title: text(measureSection.title) || fallback.measureSection.title,
        intro: text(measureSection.intro) || fallback.measureSection.intro,
        close: text(measureSection.close) || fallback.measureSection.close,
        sampleLabel: text(measureSection.sampleLabel) || fallback.measureSection.sampleLabel,
        visual: parseVisual(measureSection.visual, fallback.measureSection.visual),
      },
      kpis: Array.isArray(parsed.kpis)
        ? parsed.kpis.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return {
              id: text(row.id) || `kpi-${index + 1}`,
              name: text(row.name) || text(row.label),
              definition: text(row.definition),
              unit: text(row.unit),
              period: text(row.period),
              target: text(row.target),
              value: text(row.value),
              dataStatus: asKpiStatus(row.dataStatus, "sample"),
              values: numbers(row.values),
              labels: strings(row.labels),
              hideUntilData: bool(row.hideUntilData),
            };
          })
        : fallback.kpis,
      related: {
        title: text(related.title) || fallback.related.title,
        visual: parseVisual(related.visual, fallback.related.visual),
        cards: Array.isArray(related.cards)
          ? related.cards.map((item, index) => {
              const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
              return {
                id: text(row.id) || `card-${index + 1}`,
                href: text(row.href),
                category: text(row.category),
                title: text(row.title),
                description: text(row.description),
                meta: text(row.meta),
                cta: text(row.cta),
              };
            })
          : fallback.related.cards,
      },
      form: {
        kicker: text(form.kicker) || fallback.form.kicker,
        heading: text(form.heading) || fallback.form.heading,
        lead: text(form.lead) || fallback.form.lead,
        nextTitle: text(form.nextTitle) || fallback.form.nextTitle,
        steps: strings(form.steps).length ? strings(form.steps) : fallback.form.steps,
        trust: strings(form.trust).length ? strings(form.trust) : fallback.form.trust,
        submit: text(form.submit) || fallback.form.submit,
        workGroup: text(form.workGroup) || fallback.form.workGroup,
        channelsLabel: text(form.channelsLabel) || fallback.form.channelsLabel,
        channelsHint: text(form.channelsHint) || fallback.form.channelsHint,
        scopeLabel: text(form.scopeLabel) || fallback.form.scopeLabel,
        scopeHint: text(form.scopeHint) || fallback.form.scopeHint,
        visual: parseVisual(form.visual, fallback.form.visual),
      },
      faqIntro: text(parsed.faqIntro) || fallback.faqIntro,
      faqs: Array.isArray(parsed.faqs)
        ? parsed.faqs.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return { id: text(row.id) || `faq-${index + 1}`, q: text(row.q), a: text(row.a) };
          })
        : fallback.faqs,
      boundaries: {
        handles: parseBoundaryItems(boundaries.handles, fallback.boundaries.handles),
        hotelOwns: parseBoundaryItems(boundaries.hotelOwns, fallback.boundaries.hotelOwns),
        supportedChannels: strings(boundaries.supportedChannels),
        supportedLanguages: strings(boundaries.supportedLanguages),
        operatingHours: text(boundaries.operatingHours),
        slaText: text(boundaries.slaText),
        slaApproved: bool(boundaries.slaApproved, fallback.boundaries.slaApproved),
        escalationPath: text(boundaries.escalationPath),
        integrationNotes: text(boundaries.integrationNotes),
        reportingFrequency: text(boundaries.reportingFrequency),
        privacyNote: text(boundaries.privacyNote),
      },
      seo: { social: parseVisual(seo.social, fallback.seo.social) },
    };
  } catch {
    return null;
  }
}

export function serializeReservationsPageBody(content: CmsReservationsPage) {
  return JSON.stringify({ ...content, version: 1, template: RESERVATIONS_CMS_TEMPLATE });
}

export function isValidCtaHref(href: string) {
  return CTA_RE.test(href.trim());
}

function isPlaceholderLabel(value: string) {
  return PLACEHOLDER_RE.test(value.trim());
}

function hasSampleMarker(value: string) {
  return SAMPLE_RE.test(value);
}

function visualsOf(content: CmsReservationsPage): CmsReservationsVisual[] {
  return [
    content.hero.visual,
    content.problemsSection.visual,
    content.scopeSection.visual,
    content.benefitsSection.visual,
    content.workflowSection.visual,
    content.measureSection.visual,
    content.related.visual,
    content.form.visual,
    content.seo.social,
  ];
}

function kpiHasPublicData(kpi: CmsReservationKpi) {
  return Boolean(kpi.value.trim()) || kpi.values.some((item) => Number.isFinite(item));
}

function kpiIsPublic(kpi: CmsReservationKpi) {
  if (kpi.dataStatus === "draft") return false;
  if (kpi.hideUntilData && !kpiHasPublicData(kpi)) return false;
  return true;
}

export function chartNeedsSampleLabel(content: CmsReservationsPage) {
  if (content.measureSection.visual.status === "sample") return true;
  return content.kpis.some((kpi) => kpi.dataStatus === "sample" && kpiIsPublic(kpi));
}

function collectText(content: CmsReservationsPage) {
  const chunks: string[] = [
    content.hero.title,
    content.hero.description,
    content.hero.leadNext,
    content.hero.leadClose,
    content.hero.underCta,
    content.hero.caption,
    content.problemsSection.title,
    content.problemsSection.caption,
    content.scopeSection.title,
    content.benefitsSection.title,
    content.benefitsSection.intro,
    content.benefitsSection.close,
    content.workflowSection.title,
    content.workflowSection.noteBody,
    content.measureSection.title,
    content.measureSection.intro,
    content.measureSection.close,
    content.related.title,
    content.form.heading,
    content.form.lead,
    content.faqIntro,
    content.boundaries.slaText,
    content.boundaries.escalationPath,
    content.boundaries.integrationNotes,
    content.boundaries.privacyNote,
    content.boundaries.operatingHours,
    content.boundaries.reportingFrequency,
    ...content.hero.capabilities,
    ...content.problems.flatMap((item) => [item.problem, item.impact, item.support]),
    ...content.scopeItems.flatMap((item) => [item.title, item.description, item.input, item.output]),
    ...content.benefitGroups.flatMap((item) => [item.title, ...item.items]),
    ...content.workflowSteps.flatMap((item) => [item.title, item.description, item.owner, item.input, item.output, item.escalation]),
    ...content.kpis.flatMap((item) => [item.name, item.definition, item.period]),
    ...content.related.cards.flatMap((item) => [item.title, item.description]),
    ...content.form.steps,
    ...content.form.trust,
    ...content.faqs.flatMap((item) => [item.q, item.a]),
  ];
  return chunks.join("\n");
}

function hasGuestPii(content: CmsReservationsPage) {
  const blob = collectText(content);
  if (EMAIL_RE.test(blob)) return true;
  if (PHONE_RE.test(blob)) return true;
  if (CARD_RE.test(blob.replace(/\s/g, ""))) return true;
  if (GUEST_NAME_RE.test(blob)) return true;
  const samplePage = visualsOf(content).every((visual) => !visual.src.trim() || visual.status === "sample" || visual.status === "placeholder");
  if (!samplePage && BOOKING_RE.test(blob)) return true;
  return false;
}

export function validateReservationsPage(content: CmsReservationsPage, intent: ReservationsIntent) {
  if (intent !== "publish") return null;

  if (!content.hero.title.trim() || !content.hero.description.trim()) return "required_fields";
  if (!content.problemsSection.title.trim() || !content.scopeSection.title.trim()) return "required_fields";
  if (!content.benefitsSection.title.trim() || !content.workflowSection.title.trim()) return "required_fields";
  if (!content.measureSection.title.trim()) return "required_fields";

  const ctas = [content.hero.primaryCta, content.hero.secondaryCta];
  for (const cta of ctas) {
    if (!cta.label.trim() || !cta.href.trim()) return "invalid_cta";
    if (!isValidCtaHref(cta.href)) return "invalid_cta";
  }

  for (const visual of visualsOf(content)) {
    if (!visual.src.trim()) continue;
    if (!visual.altTh.trim() || !visual.altEn.trim()) return "missing_alt";
    if (visual.status === "placeholder") return "placeholder_status";
    if (visual.status !== "sample" && (isPlaceholderLabel(visual.altTh) || isPlaceholderLabel(visual.altEn) || isPlaceholderLabel(visual.label))) {
      return "placeholder_label";
    }
  }

  for (const kpi of content.kpis) {
    if (!kpiIsPublic(kpi)) continue;
    if (!kpi.name.trim()) return "kpi_incomplete";
    if (!kpi.period.trim()) return "kpi_incomplete";
    if (!kpi.unit.trim() && !kpi.definition.trim()) return "kpi_incomplete";
    if (!kpi.dataStatus) return "kpi_incomplete";
    if (isPlaceholderLabel(kpi.name) && kpi.dataStatus !== "sample") return "placeholder_label";
  }

  if (chartNeedsSampleLabel(content) && !hasSampleMarker(content.measureSection.sampleLabel)) return "sample_label";
  if (content.boundaries.slaText.trim() && !content.boundaries.slaApproved) return "sla_unapproved";

  for (const faq of content.faqs) {
    if (!faq.q.trim() || !faq.a.trim()) return "empty_faq";
  }

  for (const card of content.related.cards) {
    if (card.href.trim() && !isValidCtaHref(card.href)) return "invalid_cta";
  }

  if (hasGuestPii(content)) return "guest_pii";
  return null;
}

export function reservationsErrorMessage(code: string) {
  const table: Record<string, string> = {
    invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
    missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและภาษาอังกฤษ",
    placeholder_status: "เปลี่ยนสถานะรูปจาก Placeholder เป็น Sample หรือ Approved ก่อนเผยแพร่",
    placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะไม่ใช่ Sample",
    kpi_incomplete: "KPI ที่เผยแพร่ต้องมีชื่อ ช่วงเวลา หน่วยหรือคำนิยาม และสถานะข้อมูล",
    sample_label: "ข้อมูลตัวอย่างต้องมีป้าย Sample data บนหน้าสาธารณะ",
    empty_faq: "คำถามและคำตอบใน FAQ ต้องไม่ว่างเมื่อเผยแพร่",
    sla_unapproved: "ข้อความ SLA ต้องได้รับการอนุมัติก่อนเผยแพร่",
    guest_pii: "ห้ามเผยแพร่ชื่อแขก อีเมล เบอร์โทร ข้อมูลชำระเงิน รหัสจองจริง หรือบันทึกการจองที่เป็นความลับ",
    required_fields: "กรอกหัวข้อและคำอธิบายของแต่ละส่วนก่อนเผยแพร่",
    invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
    missing: "ไม่พบหน้าเพจ",
    invalid_json: "ข้อมูลฟอร์มไม่ถูกต้อง",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export function editorStateFromReservationsDocument(input: {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  body: string;
  ogImage?: string;
}): ReservationsEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseReservationsPageBody(input.body, locale) ?? emptyReservationsCms();
  if (input.ogImage && !content.seo.social.src) {
    content.seo.social = { ...content.seo.social, src: input.ogImage };
  }
  return {
    id: input.id,
    title: input.title,
    seoTitle: input.seoTitle,
    metaDescription: input.metaDescription,
    excerpt: input.excerpt,
    locale: input.locale,
    status: input.status,
    content,
  };
}

export function isReservationsPageDocument(input: { slug: string; template: string; locale?: string }) {
  if (input.template === RESERVATIONS_CMS_TEMPLATE) return true;
  return (
    input.slug === RESERVATIONS_PAGE_SLUG ||
    input.slug === "en/solutions/outsourced-hotel-reservations" ||
    input.slug === "ru/solutions/outsourced-hotel-reservations" ||
    input.slug === "zh/solutions/outsourced-hotel-reservations"
  );
}

export function publicCardHref(href: string, locale: Locale) {
  const next = href.trim();
  if (!next) return null;
  return existingHref(next, locale);
}
