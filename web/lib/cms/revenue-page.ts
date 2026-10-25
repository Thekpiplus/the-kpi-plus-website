import type { FaqItem } from "@/lib/faqs";
import type {
  ConnectedArea,
  DataStatus,
  DecisionStep,
  KpiDefinition,
  ProblemItem,
  ServiceVisual,
} from "@/lib/revenue";
import { existingHref, type Locale } from "@/lib/seo";

export const REVENUE_CMS_TEMPLATE = "revenue-commercial";
export const REVENUE_PAGE_SLUG = "solutions/revenue-commercial-management";
export const REVENUE_PAGE_ROUTE = "/solutions/revenue-commercial-management";

export const REVENUE_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export type RevenueIntent = (typeof REVENUE_INTENTS)[number];

export const REVENUE_VISUAL_STATUSES = ["placeholder", "sample", "approved", "real"] as const;
export type RevenueVisualStatus = (typeof REVENUE_VISUAL_STATUSES)[number];

export const REVENUE_KPI_STATUSES = ["draft", "anonymised", "sample", "approved"] as const;

export type RevenueSaveResult = { ok: true; id: string; intent: RevenueIntent } | { ok: false; error: string };

export type CmsCta = { label: string; href: string };

export type CmsVisual = {
  src: string;
  alt: string;
  status: RevenueVisualStatus;
  label: string;
};

export type CmsLayer = { id: string; title: string; body: string };

export type CmsRelatedCard = {
  id: string;
  href: string;
  category: string;
  title: string;
  description: string;
  meta: string;
  cta: string;
};

export type CmsKpi = {
  id: string;
  label: string;
  definition: string;
  unit: string;
  period: string;
  source: string;
  target: string;
  dataStatus: DataStatus;
  values: number[];
  labels: string[];
};

export type CmsRevenuePage = {
  version: 1;
  template: typeof REVENUE_CMS_TEMPLATE;
  hero: {
    title: string;
    description: string;
    connectIntro: string;
    leadClose: string;
    connections: string[];
    primaryCta: CmsCta;
    secondaryCta: CmsCta;
    underCta: string;
    caption: string;
    visual: CmsVisual;
  };
  problemsSection: { title: string; intro: string; caption: string; visualLabel: string };
  problems: ProblemItem[];
  areasSection: { title: string; close: string };
  areas: ConnectedArea[];
  architecture: {
    title: string;
    description: string;
    statusLabel: string;
    layers: CmsLayer[];
    visual: CmsVisual;
  };
  stepsSection: { title: string; intro: string; receiveLabel: string };
  steps: DecisionStep[];
  decisionFlow: {
    title: string;
    description: string;
    statusLabel: string;
    visual: CmsVisual;
  };
  measureSection: { title: string; intro: string; caption: string; close: string };
  kpis: CmsKpi[];
  chart: {
    title: string;
    subtitle: string;
    sampleLabel: string;
    periodLabel: string;
    updatedLabel: string;
    axisX: string;
    axisY: string;
    occupancyName: string;
    paceName: string;
    targetName: string;
    visual: CmsVisual;
  };
  related: {
    title: string;
    visual: CmsVisual;
    cards: CmsRelatedCard[];
  };
  form: {
    kicker: string;
    heading: string;
    lead: string;
    nextTitle: string;
    steps: string[];
    trust: string[];
  };
  faqs: Array<FaqItem & { id: string }>;
  seo: {
    social: CmsVisual;
  };
};

export type RevenueEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  content: CmsRevenuePage;
};

const PLACEHOLDER_RE = /placeholder|replace with verified|replace with approved|รอรูป|lorem ipsum/i;
const SAMPLE_RE = /sample data|ตัวอย่างข้อมูล|ตัวอย่าง/i;
const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;

function emptyVisual(): CmsVisual {
  return { src: "", alt: "", status: "placeholder", label: "" };
}

export function emptyRevenueCms(): CmsRevenuePage {
  return {
    version: 1,
    template: REVENUE_CMS_TEMPLATE,
    hero: {
      title: "",
      description: "",
      connectIntro: "",
      leadClose: "",
      connections: [],
      primaryCta: { label: "", href: "/" },
      secondaryCta: { label: "", href: "/" },
      underCta: "",
      caption: "",
      visual: emptyVisual(),
    },
    problemsSection: { title: "", intro: "", caption: "", visualLabel: "" },
    problems: [],
    areasSection: { title: "", close: "" },
    areas: [],
    architecture: { title: "", description: "", statusLabel: "", layers: [], visual: emptyVisual() },
    stepsSection: { title: "", intro: "", receiveLabel: "" },
    steps: [],
    decisionFlow: { title: "", description: "", statusLabel: "", visual: emptyVisual() },
    measureSection: { title: "", intro: "", caption: "", close: "" },
    kpis: [],
    chart: {
      title: "",
      subtitle: "",
      sampleLabel: "Sample data",
      periodLabel: "",
      updatedLabel: "",
      axisX: "",
      axisY: "",
      occupancyName: "Occupancy",
      paceName: "Booking Pace",
      targetName: "Target",
      visual: emptyVisual(),
    },
    related: { title: "", visual: emptyVisual(), cards: [] },
    form: { kicker: "", heading: "", lead: "", nextTitle: "", steps: [], trust: [] },
    faqs: [],
    seo: { social: emptyVisual() },
  };
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asStatus(value: unknown, fallback: RevenueVisualStatus = "placeholder"): RevenueVisualStatus {
  return REVENUE_VISUAL_STATUSES.includes(value as RevenueVisualStatus) ? (value as RevenueVisualStatus) : fallback;
}

function asKpiStatus(value: unknown, fallback: DataStatus = "draft"): DataStatus {
  return REVENUE_KPI_STATUSES.includes(value as DataStatus) ? (value as DataStatus) : fallback;
}

function numbers(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => Number(item)).filter((item) => Number.isFinite(item));
}

function strings(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item)).filter(Boolean);
}

export function newRevenueItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseVisual(value: unknown, fallback: CmsVisual): CmsVisual {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    src: text(row.src) || fallback.src,
    alt: text(row.alt) || fallback.alt,
    status: asStatus(row.status, fallback.status),
    label: text(row.label) || fallback.label,
  };
}

function parseCta(value: unknown, fallback: CmsCta): CmsCta {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    label: text(row.label) || fallback.label,
    href: text(row.href) || fallback.href,
  };
}

function parseProblems(value: unknown, fallback: ProblemItem[]): ProblemItem[] {
  if (!Array.isArray(value) || !value.length) return fallback.map((item) => ({ ...item }));
  return value.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: text(row.id) || `problem-${index + 1}`,
      problem: text(row.problem),
      dataToInspect: text(row.dataToInspect),
      nextAction: text(row.nextAction),
      order: Number(row.order) || index + 1,
    };
  });
}

function parseAreas(value: unknown, fallback: ConnectedArea[]): ConnectedArea[] {
  if (!Array.isArray(value) || !value.length) return fallback.map((item) => ({ ...item }));
  return value.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: text(row.id) || `area-${index + 1}`,
      number: text(row.number) || String(index + 1).padStart(2, "0"),
      title: text(row.title),
      description: text(row.description),
      output: text(row.output),
      href: text(row.href) || undefined,
      order: Number(row.order) || index + 1,
    };
  });
}

function parseSteps(value: unknown, fallback: DecisionStep[]): DecisionStep[] {
  if (!Array.isArray(value) || !value.length) return fallback.map((item) => ({ ...item }));
  return value.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: text(row.id) || `step-${index + 1}`,
      number: text(row.number) || String(index + 1).padStart(2, "0"),
      title: text(row.title),
      description: text(row.description),
      output: text(row.output),
      order: Number(row.order) || index + 1,
    };
  });
}

function parseKpis(value: unknown, fallback: CmsKpi[]): CmsKpi[] {
  if (!Array.isArray(value) || !value.length) return fallback.map((item) => ({ ...item, values: [...item.values], labels: [...item.labels] }));
  return value.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: text(row.id) || `kpi-${index + 1}`,
      label: text(row.label) || text(row.name),
      definition: text(row.definition),
      unit: text(row.unit),
      period: text(row.period),
      source: text(row.source),
      target: text(row.target),
      dataStatus: asKpiStatus(row.dataStatus),
      values: numbers(row.values),
      labels: strings(row.labels),
    };
  });
}

function parseFaqs(value: unknown, fallback: Array<FaqItem & { id: string }>) {
  if (!Array.isArray(value) || !value.length) return fallback.map((item) => ({ ...item }));
  return value.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: text(row.id) || `faq-${index + 1}`,
      q: text(row.q),
      a: text(row.a),
    };
  });
}

function parseCards(value: unknown, fallback: CmsRelatedCard[]) {
  if (!Array.isArray(value) || !value.length) return fallback.map((item) => ({ ...item }));
  return value.map((item, index) => {
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
  });
}

function parseLayers(value: unknown, fallback: CmsLayer[]) {
  if (!Array.isArray(value) || !value.length) return fallback.map((item) => ({ ...item }));
  return value.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: text(row.id) || `layer-${index + 1}`,
      title: text(row.title),
      body: text(row.body),
    };
  });
}

export function isRevenueCmsBody(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return false;
  try {
    const parsed = JSON.parse(trimmed) as { template?: string };
    return parsed.template === REVENUE_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function parseRevenuePageBody(raw: string, locale: Locale = "th"): CmsRevenuePage | null {
  const fallback = emptyRevenueCms();
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    if (parsed.template !== REVENUE_CMS_TEMPLATE) return null;
    const hero = parsed.hero && typeof parsed.hero === "object" ? (parsed.hero as Record<string, unknown>) : {};
    const problemsSection =
      parsed.problemsSection && typeof parsed.problemsSection === "object"
        ? (parsed.problemsSection as Record<string, unknown>)
        : {};
    const areasSection =
      parsed.areasSection && typeof parsed.areasSection === "object" ? (parsed.areasSection as Record<string, unknown>) : {};
    const architecture =
      parsed.architecture && typeof parsed.architecture === "object" ? (parsed.architecture as Record<string, unknown>) : {};
    const stepsSection =
      parsed.stepsSection && typeof parsed.stepsSection === "object" ? (parsed.stepsSection as Record<string, unknown>) : {};
    const decisionFlow =
      parsed.decisionFlow && typeof parsed.decisionFlow === "object" ? (parsed.decisionFlow as Record<string, unknown>) : {};
    const measureSection =
      parsed.measureSection && typeof parsed.measureSection === "object"
        ? (parsed.measureSection as Record<string, unknown>)
        : {};
    const chart = parsed.chart && typeof parsed.chart === "object" ? (parsed.chart as Record<string, unknown>) : {};
    const related = parsed.related && typeof parsed.related === "object" ? (parsed.related as Record<string, unknown>) : {};
    const form = parsed.form && typeof parsed.form === "object" ? (parsed.form as Record<string, unknown>) : {};
    const seo = parsed.seo && typeof parsed.seo === "object" ? (parsed.seo as Record<string, unknown>) : {};
    return {
      version: 1,
      template: REVENUE_CMS_TEMPLATE,
      hero: {
        title: text(hero.title) || fallback.hero.title,
        description: text(hero.description) || fallback.hero.description,
        connectIntro: text(hero.connectIntro) || fallback.hero.connectIntro,
        leadClose: text(hero.leadClose) || fallback.hero.leadClose,
        connections: strings(hero.connections).length ? strings(hero.connections) : fallback.hero.connections,
        primaryCta: parseCta(hero.primaryCta, fallback.hero.primaryCta),
        secondaryCta: parseCta(hero.secondaryCta, fallback.hero.secondaryCta),
        underCta: text(hero.underCta) || fallback.hero.underCta,
        caption: text(hero.caption) || fallback.hero.caption,
        visual: parseVisual(hero.visual, fallback.hero.visual),
      },
      problemsSection: {
        title: text(problemsSection.title) || fallback.problemsSection.title,
        intro: text(problemsSection.intro) || fallback.problemsSection.intro,
        caption: text(problemsSection.caption) || fallback.problemsSection.caption,
        visualLabel: text(problemsSection.visualLabel) || fallback.problemsSection.visualLabel,
      },
      problems: parseProblems(parsed.problems, fallback.problems),
      areasSection: {
        title: text(areasSection.title) || fallback.areasSection.title,
        close: text(areasSection.close) || fallback.areasSection.close,
      },
      areas: parseAreas(parsed.areas, fallback.areas),
      architecture: {
        title: text(architecture.title) || fallback.architecture.title,
        description: text(architecture.description) || fallback.architecture.description,
        statusLabel: text(architecture.statusLabel) || fallback.architecture.statusLabel,
        layers: parseLayers(architecture.layers, fallback.architecture.layers),
        visual: parseVisual(architecture.visual, fallback.architecture.visual),
      },
      stepsSection: {
        title: text(stepsSection.title) || fallback.stepsSection.title,
        intro: text(stepsSection.intro) || fallback.stepsSection.intro,
        receiveLabel: text(stepsSection.receiveLabel) || fallback.stepsSection.receiveLabel,
      },
      steps: parseSteps(parsed.steps, fallback.steps),
      decisionFlow: {
        title: text(decisionFlow.title) || fallback.decisionFlow.title,
        description: text(decisionFlow.description) || fallback.decisionFlow.description,
        statusLabel: text(decisionFlow.statusLabel) || fallback.decisionFlow.statusLabel,
        visual: parseVisual(decisionFlow.visual, fallback.decisionFlow.visual),
      },
      measureSection: {
        title: text(measureSection.title) || fallback.measureSection.title,
        intro: text(measureSection.intro) || fallback.measureSection.intro,
        caption: text(measureSection.caption) || fallback.measureSection.caption,
        close: text(measureSection.close) || fallback.measureSection.close,
      },
      kpis: parseKpis(parsed.kpis, fallback.kpis),
      chart: {
        title: text(chart.title) || fallback.chart.title,
        subtitle: text(chart.subtitle) || fallback.chart.subtitle,
        sampleLabel: text(chart.sampleLabel) || fallback.chart.sampleLabel,
        periodLabel: text(chart.periodLabel) || fallback.chart.periodLabel,
        updatedLabel: text(chart.updatedLabel) || fallback.chart.updatedLabel,
        axisX: text(chart.axisX) || fallback.chart.axisX,
        axisY: text(chart.axisY) || fallback.chart.axisY,
        occupancyName: text(chart.occupancyName) || fallback.chart.occupancyName,
        paceName: text(chart.paceName) || fallback.chart.paceName,
        targetName: text(chart.targetName) || fallback.chart.targetName,
        visual: parseVisual(chart.visual, fallback.chart.visual),
      },
      related: {
        title: text(related.title) || fallback.related.title,
        visual: parseVisual(related.visual, fallback.related.visual),
        cards: parseCards(related.cards, fallback.related.cards),
      },
      form: {
        kicker: text(form.kicker) || fallback.form.kicker,
        heading: text(form.heading) || fallback.form.heading,
        lead: text(form.lead) || fallback.form.lead,
        nextTitle: text(form.nextTitle) || fallback.form.nextTitle,
        steps: strings(form.steps).length ? strings(form.steps) : fallback.form.steps,
        trust: strings(form.trust).length ? strings(form.trust) : fallback.form.trust,
      },
      faqs: parseFaqs(parsed.faqs, fallback.faqs),
      seo: {
        social: parseVisual(seo.social, fallback.seo.social),
      },
    };
  } catch {
    return null;
  }
}

export function serializeRevenuePageBody(content: CmsRevenuePage) {
  return JSON.stringify({ ...content, version: 1, template: REVENUE_CMS_TEMPLATE });
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

function visualsOf(content: CmsRevenuePage): CmsVisual[] {
  return [
    content.hero.visual,
    content.architecture.visual,
    content.decisionFlow.visual,
    content.chart.visual,
    content.related.visual,
    content.seo.social,
  ];
}

function kpiIsPublic(kpi: CmsKpi) {
  return kpi.dataStatus !== "draft";
}

function kpiHasValue(kpi: CmsKpi) {
  return Boolean(kpi.source.trim()) || kpi.values.some((item) => Number.isFinite(item));
}

export function chartNeedsSampleLabel(content: CmsRevenuePage) {
  if (content.chart.visual.status === "sample") return true;
  return content.kpis.some((kpi) => kpi.dataStatus === "sample" && (kpiHasValue(kpi) || kpi.values.length > 0));
}

export function validateRevenuePage(content: CmsRevenuePage, intent: RevenueIntent) {
  if (intent !== "publish") return null;

  const ctas = [content.hero.primaryCta, content.hero.secondaryCta];
  for (const cta of ctas) {
    if (!cta.label.trim() || !cta.href.trim()) return "invalid_cta";
    if (!isValidCtaHref(cta.href)) return "invalid_cta";
  }

  for (const visual of visualsOf(content)) {
    if (visual.src.trim() && !visual.alt.trim()) return "missing_alt";
    if (visual.src.trim() && visual.status === "placeholder") return "placeholder_status";
    if (visual.src.trim() && visual.status !== "sample" && (isPlaceholderLabel(visual.alt) || isPlaceholderLabel(visual.label))) {
      return "placeholder_label";
    }
  }

  for (const kpi of content.kpis) {
    if (!kpiIsPublic(kpi)) {
      if (isPlaceholderLabel(kpi.label) && kpi.dataStatus !== "sample") return "placeholder_label";
      continue;
    }
    if (!kpi.label.trim()) return "kpi_incomplete";
    if (!kpiHasValue(kpi)) return "kpi_incomplete";
    if (!kpi.period.trim()) return "kpi_incomplete";
    if (!kpi.unit.trim() && !kpi.definition.trim()) return "kpi_incomplete";
    if (!kpi.dataStatus) return "kpi_incomplete";
    if (isPlaceholderLabel(kpi.label) && kpi.dataStatus !== "sample") return "placeholder_label";
  }

  if (chartNeedsSampleLabel(content) && !hasSampleMarker(content.chart.sampleLabel)) return "sample_label";

  for (const faq of content.faqs) {
    if (!faq.q.trim() || !faq.a.trim()) return "empty_faq";
  }

  for (const area of content.areas) {
    const href = area.href?.trim();
    if (href && !isValidCtaHref(href)) return "invalid_cta";
  }

  for (const card of content.related.cards) {
    if (card.href.trim() && !isValidCtaHref(card.href)) return "invalid_cta";
  }

  return null;
}

export function revenueErrorMessage(code: string) {
  const table: Record<string, string> = {
    invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
    missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพ (alt text)",
    placeholder_status: "เปลี่ยนสถานะรูปจาก Placeholder เป็น Sample หรือ Approved ก่อนเผยแพร่",
    placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะไม่ใช่ Sample",
    kpi_incomplete: "KPI ที่เผยแพร่ต้องมีชื่อ ค่าหรือแหล่งข้อมูล ช่วงเวลา หน่วยหรือคำนิยาม และสถานะข้อมูล",
    sample_label: "ข้อมูลตัวอย่างต้องมีป้าย Sample data บนหน้าสาธารณะ",
    empty_faq: "คำถามและคำตอบใน FAQ ต้องไม่ว่างเมื่อเผยแพร่",
    invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
    missing: "ไม่พบหน้าเพจ",
    invalid_json: "ข้อมูลฟอร์มไม่ถูกต้อง",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export function editorStateFromDocument(input: {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  body: string;
  ogImage?: string;
}): RevenueEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseRevenuePageBody(input.body, locale) ?? emptyRevenueCms();
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

export function isRevenuePageDocument(input: { slug: string; template: string; locale?: string }) {
  if (input.template === REVENUE_CMS_TEMPLATE) return true;
  return input.slug === REVENUE_PAGE_SLUG || input.slug === "en/solutions/revenue-commercial-management";
}

export function publicCardHref(href: string, locale: Locale) {
  const next = href.trim();
  if (!next) return null;
  return existingHref(next, locale);
}

export function toPublicKpis(kpis: CmsKpi[]): KpiDefinition[] {
  return kpis.map((kpi) => ({
    id: kpi.id,
    name: kpi.label as KpiDefinition["name"],
    labelTh: kpi.definition || kpi.label,
    definition: kpi.definition || kpi.label,
    unit: kpi.unit || undefined,
    period: kpi.period,
    target: kpi.target || undefined,
    dataStatus: kpi.dataStatus,
    values: [...kpi.values],
    labels: [...kpi.labels],
  }));
}

export function toPublicVisual(visual: CmsVisual, fallback: ServiceVisual): ServiceVisual {
  return {
    src: visual.src || fallback.src,
    alt: visual.alt || fallback.alt,
    status: visual.status === "real" || visual.status === "approved" || visual.status === "sample" || visual.status === "placeholder"
      ? visual.status
      : fallback.status,
    recommendedSize: fallback.recommendedSize,
    aspectRatio: fallback.aspectRatio,
  };
}
