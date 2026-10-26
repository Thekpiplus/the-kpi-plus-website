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
import {
  B2B_FRAMEWORK_ROWS,
  B2B_FRAMEWORK_VISUAL,
  B2B_HERO_VISUAL_CANDIDATE,
  type B2bKpiStatus,
} from "@/lib/b2b";

export const B2B_CMS_TEMPLATE = "b2b-agent-sales";
export const B2B_PAGE_SLUG = "solutions/b2b-agent-sales";
export const B2B_PAGE_ROUTE = "/solutions/b2b-agent-sales";

export const B2B_INTENTS = REVENUE_INTENTS;
export const B2B_VISUAL_STATUSES = REVENUE_VISUAL_STATUSES;
export const B2B_KPI_STATUSES = REVENUE_KPI_STATUSES;
export type B2bIntent = RevenueIntent;
export type B2bVisualStatus = RevenueVisualStatus;
export type B2bSaveResult = { ok: true; id: string; intent: B2bIntent } | { ok: false; error: string };

export type CmsCta = { label: string; href: string };

export type CmsB2bVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: B2bVisualStatus;
  label: string;
  caption: string;
};

export type CmsB2bReadinessItem = {
  id: string;
  area: string;
  problem: string;
  prepare: string;
  output: string;
  order: number;
};

export type CmsB2bScopeItem = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  input: string;
  output: string;
  order: number;
};

export type CmsB2bProblem = { id: string; text: string; order: number };

export type CmsB2bWorkflowStep = {
  id: string;
  number: string;
  phase: string;
  title: string;
  description: string;
  order: number;
};

export type CmsB2bFunnelStep = { id: string; number: string; label: string };

export type CmsB2bKpi = {
  id: string;
  name: string;
  definition: string;
  unit: string;
  period: string;
  target: string;
  value: string;
  dataStatus: B2bKpiStatus;
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

export type CmsB2bPage = {
  version: 1;
  template: typeof B2B_CMS_TEMPLATE;
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
    visual: CmsB2bVisual;
  };
  readiness: { title: string; body: string; close: string; visual: CmsB2bVisual; items: CmsB2bReadinessItem[] };
  problemsSection: { title: string };
  problems: CmsB2bProblem[];
  scopeSection: { title: string };
  scopeItems: CmsB2bScopeItem[];
  funnelSection: { title: string; caption: string };
  funnelSteps: CmsB2bFunnelStep[];
  workflowSection: { title: string; visual: CmsB2bVisual };
  workflowSteps: CmsB2bWorkflowStep[];
  measureSection: { title: string; intro: string; close: string; sampleLabel: string; visual: CmsB2bVisual };
  kpis: CmsB2bKpi[];
  related: { title: string; cards: CmsRelatedCard[] };
  form: { kicker: string; heading: string; lead: string; submit: string };
  faqIntro: string;
  faqs: Array<FaqItem & { id: string }>;
  seo: { social: CmsB2bVisual };
};

export type B2bEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  content: CmsB2bPage;
};

const PLACEHOLDER_RE = /placeholder|replace with verified|replace with approved|รอรูป|lorem ipsum/i;
const SAMPLE_RE = /sample data|sample visual|ตัวอย่างข้อมูล|ตัวอย่าง/i;
const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(?:\+?\s*66|\b0)\s*\d(?:[\s.-]?\d){7,9}\b/;
const CARD_RE = /\b(?:\d[ -]*?){13,19}\b/;

function emptyVisual(): CmsB2bVisual {
  return { src: "", altTh: "", altEn: "", status: "placeholder", label: "", caption: "" };
}

function emptyCta(): CmsCta {
  return { label: "", href: "/" };
}

export function emptyB2bCms(): CmsB2bPage {
  return {
    version: 1,
    template: B2B_CMS_TEMPLATE,
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
      visual: emptyVisual(),
    },
    readiness: { title: "", body: "", close: "", visual: emptyVisual(), items: [] },
    problemsSection: { title: "" },
    problems: [],
    scopeSection: { title: "" },
    scopeItems: [],
    funnelSection: { title: "", caption: "" },
    funnelSteps: [],
    workflowSection: { title: "", visual: emptyVisual() },
    workflowSteps: [],
    measureSection: { title: "", intro: "", close: "", sampleLabel: "Sample Visual", visual: emptyVisual() },
    kpis: [],
    related: { title: "", cards: [] },
    form: { kicker: "", heading: "", lead: "", submit: "" },
    faqIntro: "",
    faqs: [],
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

function asVisualStatus(value: unknown, fallback: B2bVisualStatus = "placeholder"): B2bVisualStatus {
  return REVENUE_VISUAL_STATUSES.includes(value as B2bVisualStatus) ? (value as B2bVisualStatus) : fallback;
}

function asKpiStatus(value: unknown, fallback: B2bKpiStatus = "draft"): B2bKpiStatus {
  const next = String(value || "").toLowerCase();
  if ((REVENUE_KPI_STATUSES as readonly string[]).includes(next)) return next as B2bKpiStatus;
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

export function newB2bItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseVisual(value: unknown, fallback: CmsB2bVisual): CmsB2bVisual {
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

export function defaultB2bReadinessItems(locale: Locale = "th"): CmsB2bReadinessItem[] {
  const thai = locale === "th";
  return B2B_FRAMEWORK_ROWS.map((item, index) => ({
    id: item.id,
    area: item.area,
    problem: thai ? item.problemTh : item.problemEn,
    prepare: thai ? item.prepareTh : item.prepareEn,
    output: thai ? item.outputTh : item.outputEn,
    order: index + 1,
  }));
}

function isGenericReadinessLabel(value: string) {
  return /^(ตัวอย่างข้อมูล|sample visual|ตัวอย่าง B2B Sales Readiness Kit|sample B2B sales readiness kit)$/i.test(
    value.trim(),
  );
}

function parseReadinessVisual(value: unknown, locale: Locale): CmsB2bVisual {
  const visual = parseVisual(value, emptyVisual());
  const thai = locale === "th";
  if (!visual.label.trim() || isGenericReadinessLabel(visual.label)) {
    visual.label = B2B_FRAMEWORK_VISUAL.label.en;
  }
  if (!visual.caption.trim() || isGenericReadinessLabel(visual.caption)) {
    visual.caption = thai ? B2B_FRAMEWORK_VISUAL.caption.th : B2B_FRAMEWORK_VISUAL.caption.en;
  }
  if (!visual.altTh.trim() || /แผนภาพตัวอย่าง|ชุดเอกสารความพร้อม/.test(visual.altTh)) {
    visual.altTh = B2B_FRAMEWORK_VISUAL.alt.th;
  }
  if (!visual.altEn.trim() || /sample diagram|sales readiness kit/i.test(visual.altEn)) {
    visual.altEn = B2B_FRAMEWORK_VISUAL.alt.en;
  }
  if (
    visual.src.trim() === B2B_HERO_VISUAL_CANDIDATE ||
    visual.src.includes("b2b-agent-sales-readiness-placeholder.webp")
  ) {
    visual.src = "";
  }
  return visual;
}

function parseReadinessItems(value: unknown, locale: Locale): CmsB2bReadinessItem[] {
  if (Array.isArray(value) && value.some((item) => item && typeof item === "object" && text((item as Record<string, unknown>).area))) {
    return value.map((item, index) => {
      const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      return {
        id: text(row.id) || `framework-${index + 1}`,
        area: text(row.area),
        problem: text(row.problem) || text(row.why),
        prepare: text(row.prepare) || text(row.check),
        output: text(row.output),
        order: Number(row.order) || index + 1,
      };
    });
  }
  return defaultB2bReadinessItems(locale);
}

function parseCta(value: unknown, fallback: CmsCta): CmsCta {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    label: text(row.label) || fallback.label,
    href: text(row.href) || fallback.href,
  };
}

export function isB2bCmsBody(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return false;
  try {
    const parsed = JSON.parse(trimmed) as { template?: string };
    return parsed.template === B2B_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function parseB2bPageBody(raw: string, locale: Locale = "th"): CmsB2bPage | null {
  const fallback = emptyB2bCms();
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    if (parsed.template !== B2B_CMS_TEMPLATE) return null;
    const hero = parsed.hero && typeof parsed.hero === "object" ? (parsed.hero as Record<string, unknown>) : {};
    const readiness = parsed.readiness && typeof parsed.readiness === "object" ? (parsed.readiness as Record<string, unknown>) : {};
    const problemsSection =
      parsed.problemsSection && typeof parsed.problemsSection === "object"
        ? (parsed.problemsSection as Record<string, unknown>)
        : {};
    const scopeSection =
      parsed.scopeSection && typeof parsed.scopeSection === "object" ? (parsed.scopeSection as Record<string, unknown>) : {};
    const funnelSection =
      parsed.funnelSection && typeof parsed.funnelSection === "object" ? (parsed.funnelSection as Record<string, unknown>) : {};
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
    const seo = parsed.seo && typeof parsed.seo === "object" ? (parsed.seo as Record<string, unknown>) : {};

    return {
      version: 1,
      template: B2B_CMS_TEMPLATE,
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
        visual: parseVisual(hero.visual, fallback.hero.visual),
      },
      readiness: {
        title: text(readiness.title) || fallback.readiness.title,
        body: text(readiness.body) || fallback.readiness.body,
        close: text(readiness.close) || fallback.readiness.close,
        visual: parseReadinessVisual(readiness.visual, locale),
        items: parseReadinessItems(readiness.items, locale),
      },
      problemsSection: { title: text(problemsSection.title) || fallback.problemsSection.title },
      problems: Array.isArray(parsed.problems)
        ? parsed.problems.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return { id: text(row.id) || `problem-${index + 1}`, text: text(row.text), order: Number(row.order) || index + 1 };
          })
        : fallback.problems,
      scopeSection: { title: text(scopeSection.title) || fallback.scopeSection.title },
      scopeItems: Array.isArray(parsed.scopeItems)
        ? parsed.scopeItems.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return {
              id: text(row.id) || `scope-${index + 1}`,
              kicker: text(row.kicker),
              title: text(row.title),
              description: text(row.description),
              input: text(row.input),
              output: text(row.output),
              order: Number(row.order) || index + 1,
            };
          })
        : fallback.scopeItems,
      funnelSection: {
        title: text(funnelSection.title) || fallback.funnelSection.title,
        caption: text(funnelSection.caption) || fallback.funnelSection.caption,
      },
      funnelSteps: Array.isArray(parsed.funnelSteps)
        ? parsed.funnelSteps.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return {
              id: text(row.id) || `funnel-${index + 1}`,
              number: text(row.number) || String(index + 1).padStart(2, "0"),
              label: text(row.label),
            };
          })
        : fallback.funnelSteps,
      workflowSection: {
        title: text(workflowSection.title) || fallback.workflowSection.title,
        visual: parseVisual(workflowSection.visual, fallback.workflowSection.visual),
      },
      workflowSteps: Array.isArray(parsed.workflowSteps)
        ? parsed.workflowSteps.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return {
              id: text(row.id) || `workflow-${index + 1}`,
              number: text(row.number) || String(index + 1).padStart(2, "0"),
              phase: text(row.phase),
              title: text(row.title),
              description: text(row.description),
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
              name: text(row.name),
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
        submit: text(form.submit) || fallback.form.submit,
      },
      faqIntro: text(parsed.faqIntro) || fallback.faqIntro,
      faqs: Array.isArray(parsed.faqs)
        ? parsed.faqs.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return { id: text(row.id) || `faq-${index + 1}`, q: text(row.q), a: text(row.a) };
          })
        : fallback.faqs,
      seo: { social: parseVisual(seo.social, fallback.seo.social) },
    };
  } catch {
    return null;
  }
}

export function serializeB2bPageBody(content: CmsB2bPage) {
  return JSON.stringify({ ...content, version: 1, template: B2B_CMS_TEMPLATE });
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

function visualsOf(content: CmsB2bPage): CmsB2bVisual[] {
  return [content.hero.visual, content.readiness.visual, content.workflowSection.visual, content.measureSection.visual, content.seo.social];
}

function kpiHasPublicData(kpi: CmsB2bKpi) {
  return Boolean(kpi.value.trim()) || kpi.values.some((item) => Number.isFinite(item));
}

function kpiIsPublic(kpi: CmsB2bKpi) {
  if (kpi.dataStatus === "draft") return false;
  if (kpi.hideUntilData && !kpiHasPublicData(kpi)) return false;
  return true;
}

export function chartNeedsSampleLabel(content: CmsB2bPage) {
  if (content.measureSection.visual.status === "sample") return true;
  return content.kpis.some((kpi) => kpi.dataStatus === "sample" && kpiIsPublic(kpi));
}

function collectText(content: CmsB2bPage) {
  return [
    content.hero.title,
    content.hero.description,
    content.readiness.body,
    ...content.readiness.items.flatMap((item) => [item.area, item.problem, item.prepare, item.output]),
    ...content.problems.map((item) => item.text),
    ...content.scopeItems.flatMap((item) => [item.title, item.description]),
    ...content.kpis.flatMap((item) => [item.name, item.definition, item.period, item.target, item.value]),
    ...content.faqs.flatMap((item) => [item.q, item.a]),
  ].join("\n");
}

function hasPrivateData(content: CmsB2bPage) {
  const blob = collectText(content);
  return EMAIL_RE.test(blob) || PHONE_RE.test(blob) || CARD_RE.test(blob.replace(/\s/g, ""));
}

export function validateB2bPage(content: CmsB2bPage, intent: B2bIntent) {
  if (intent !== "publish") return null;
  if (!content.hero.title.trim() || !content.hero.description.trim()) return "required_fields";
  if (!content.readiness.title.trim() || !content.scopeSection.title.trim()) return "required_fields";
  if (!content.measureSection.title.trim()) return "required_fields";
  for (const cta of [content.hero.primaryCta, content.hero.secondaryCta]) {
    if (!cta.label.trim() || !cta.href.trim() || !isValidCtaHref(cta.href)) return "invalid_cta";
  }
  for (const visual of visualsOf(content)) {
    if (!visual.src.trim()) continue;
    if (!visual.altTh.trim() || !visual.altEn.trim()) return "missing_alt";
    if (visual.status === "placeholder") return "placeholder_status";
  }
  for (const kpi of content.kpis) {
    if (!kpiIsPublic(kpi)) continue;
    if (!kpi.name.trim() || !kpi.period.trim()) return "kpi_incomplete";
    if (!kpi.unit.trim() && !kpi.definition.trim()) return "kpi_incomplete";
    if (!kpi.target.trim()) return "kpi_incomplete";
  }
  if (chartNeedsSampleLabel(content) && !hasSampleMarker(content.measureSection.sampleLabel)) return "sample_label";
  for (const faq of content.faqs) {
    if (!faq.q.trim() || !faq.a.trim()) return "empty_faq";
  }
  if (hasPrivateData(content)) return "private_data";
  return null;
}

export function b2bErrorMessage(code: string) {
  const table: Record<string, string> = {
    invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
    missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและภาษาอังกฤษ",
    placeholder_status: "เปลี่ยนสถานะรูปจาก Placeholder เป็น Sample หรือ Approved ก่อนเผยแพร่",
    placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะไม่ใช่ Sample",
    kpi_incomplete: "KPI ที่เผยแพร่ต้องมีชื่อ ช่วงเวลา หน่วยหรือคำนิยาม การเปรียบเทียบ และสถานะข้อมูล",
    sample_label: "ข้อมูลตัวอย่างต้องมีป้าย Sample Visual หรือ ตัวอย่างข้อมูล",
    empty_faq: "คำถามและคำตอบใน FAQ ต้องไม่ว่างเมื่อเผยแพร่",
    required_fields: "กรอกหัวข้อและคำอธิบายของแต่ละส่วนก่อนเผยแพร่",
    invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
    missing: "ไม่พบหน้าเพจ",
    invalid_json: "ข้อมูลฟอร์มไม่ถูกต้อง",
    private_data: "ห้ามเผยแพร่อีเมล เบอร์โทร มูลค่าสัญญา หรือข้อมูลส่วนบุคคลของพาร์ตเนอร์",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export function editorStateFromB2bDocument(input: {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  body: string;
  ogImage?: string;
}): B2bEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseB2bPageBody(input.body, locale) ?? emptyB2bCms();
  if (input.ogImage && !content.seo.social.src) content.seo.social = { ...content.seo.social, src: input.ogImage };
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

export function isB2bPageDocument(input: { slug: string; template: string }) {
  if (input.template === B2B_CMS_TEMPLATE) return true;
  return (
    input.slug === B2B_PAGE_SLUG ||
    input.slug === "en/solutions/b2b-agent-sales" ||
    input.slug === "ru/solutions/b2b-agent-sales" ||
    input.slug === "zh/solutions/b2b-agent-sales"
  );
}

export function publicCardHref(href: string, locale: Locale) {
  const next = href.trim();
  if (!next) return null;
  return existingHref(next, locale);
}

export { isPlaceholderLabel };
