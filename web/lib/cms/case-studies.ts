import type {
  CaseDataStatus,
  CaseMetric,
  CaseMetricStatus,
  CaseStudy,
  CaseStudyComparison,
} from "@/lib/case-studies";
import type { CmsCaseStudyRow } from "./types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/-]+/g, "-")
    .replace(/\/{2,}/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/-{2,}/g, "-");
}

export const CASE_STUDY_DEPARTMENTS = [
  { id: "revenue", label: "Revenue", labelTh: "รายได้" },
  { id: "distribution", label: "Distribution", labelTh: "ช่องทางขาย" },
  { id: "digital-marketing", label: "Digital Marketing", labelTh: "การตลาดดิจิทัล" },
  { id: "sales", label: "Sales", labelTh: "ขาย" },
  { id: "management", label: "Management", labelTh: "บริหาร" },
] as const;

export type CaseStudyDepartment = (typeof CASE_STUDY_DEPARTMENTS)[number]["id"];

export const CASE_STUDY_WORKFLOWS = ["draft", "review", "approved"] as const;
export type CaseStudyWorkflow = (typeof CASE_STUDY_WORKFLOWS)[number];

export const CASE_STUDY_DATA_STATUSES = ["draft", "anonymised", "approved", "sample", "published"] as const;
export const CASE_STUDY_INTENTS = ["save", "draft", "preview", "review", "approve", "publish", "unpublish"] as const;
export type CaseStudyIntent = (typeof CASE_STUDY_INTENTS)[number];

export const CASE_STUDY_SERVICE_AREAS = [
  "Revenue & Distribution Management",
  "Digital Performance",
  "Sales",
  "Management",
] as const;

export const CASE_STUDY_HOTEL_TYPES = [
  "Premium Pool Villa Property",
  "Independent Boutique Hotel",
  "5-Star Resort",
  "Boutique Hotel & Residence",
] as const;

export const METRIC_STATUSES: CaseMetricStatus[] = ["Approved case", "Anonymised case", "Sample data"];

export type CaseStudyRelatedOption = {
  id: string;
  slug: string;
  title: string;
  kind: "insight" | "case-study";
};

export const MAX_CASE_STUDY_IMAGE_BYTES = 5 * 1024 * 1024;
export const CASE_STUDY_IMAGE_TYPES = new Set([".jpg", ".jpeg", ".png", ".webp"]);
export const COVER_IMAGE_HINT = "แนะนำ 1600×900 พิกเซล (16:9) JPG / PNG / WEBP ไม่เกิน 5MB";
export const REPORT_IMAGE_HINT = "แนะนำ 1200×800 พิกเซล (3:2) JPG / PNG / WEBP ไม่เกิน 5MB";
export const COVER_MIN_SIZE = { width: 800, height: 450 };
export const REPORT_MIN_SIZE = { width: 600, height: 400 };
export const IMAGE_MAX_SIZE = { width: 8000, height: 8000 };

export type CaseStudyTestimonialInput = {
  quote: string;
  authorName: string;
  authorRole: string;
  approvalStatus: "pending" | "approved";
};

export type CaseStudySaveInput = {
  id?: string;
  department: CaseStudyDepartment;
  title: string;
  slug: string;
  locale: string;
  shortDescription: string;
  clientName: string;
  clientNameApproved: boolean;
  anonymisedLabel: string;
  hotelType: string;
  location: string;
  serviceArea: string;
  challenge: string;
  analysis: string;
  actionPlan: string;
  result: string;
  metrics: CaseMetric[];
  measurementPeriod: string;
  baselinePeriod: string;
  dataStatus: CaseDataStatus;
  workflowStatus: CaseStudyWorkflow;
  isPublished: boolean;
  isFeatured: boolean;
  coverImage: string;
  coverImageAlt: string;
  coverImageStatus: CaseStudy["coverImageStatus"];
  reportPreview: string;
  reportPreviewAlt: string;
  comparison?: CaseStudyComparison;
  testimonial: CaseStudyTestimonialInput;
  methodologyNote: string;
  sourceNotes: string[];
  relatedArticleIds: string[];
  seoTitle: string;
  metaDescription: string;
  clientLogo: string;
  clientLogoPublishable: boolean;
  adminNotes: string;
  publishedAt: string;
};

export type CaseStudySaveResult = { ok: true; id: string; intent: CaseStudyIntent } | { ok: false; error: string };

function trim(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isDepartment(value: string): value is CaseStudyDepartment {
  return CASE_STUDY_DEPARTMENTS.some((item) => item.id === value);
}

function isWorkflow(value: string): value is CaseStudyWorkflow {
  return (CASE_STUDY_WORKFLOWS as readonly string[]).includes(value);
}

function isDataStatus(value: string): value is CaseDataStatus {
  return (CASE_STUDY_DATA_STATUSES as readonly string[]).includes(value);
}

function isIntent(value: string): value is CaseStudyIntent {
  return (CASE_STUDY_INTENTS as readonly string[]).includes(value);
}

function isMetricStatus(value: string): value is CaseMetricStatus {
  return METRIC_STATUSES.includes(value as CaseMetricStatus);
}

export function departmentLabel(id: string) {
  return CASE_STUDY_DEPARTMENTS.find((item) => item.id === id)?.labelTh ?? id;
}

export function departmentFromServiceArea(area: string): CaseStudyDepartment {
  if (/digital/i.test(area)) return "digital-marketing";
  if (/sales/i.test(area)) return "sales";
  if (/management/i.test(area) && !/revenue|distribution/i.test(area)) return "management";
  if (/distribution/i.test(area) && !/revenue/i.test(area)) return "distribution";
  return "revenue";
}

export function emptyMetric(index = 1): CaseMetric {
  return {
    id: `metric-${index}`,
    label: "",
    value: "",
    context: "",
    period: "",
    status: "Anonymised case",
  };
}

export function emptyCaseStudyInput(): CaseStudySaveInput {
  return {
    department: "revenue",
    title: "",
    slug: "",
    locale: "th",
    shortDescription: "",
    clientName: "",
    clientNameApproved: false,
    anonymisedLabel: "",
    hotelType: "",
    location: "",
    serviceArea: "Revenue & Distribution Management",
    challenge: "",
    analysis: "",
    actionPlan: "",
    result: "",
    metrics: [emptyMetric(1)],
    measurementPeriod: "",
    baselinePeriod: "",
    dataStatus: "draft",
    workflowStatus: "draft",
    isPublished: false,
    isFeatured: false,
    coverImage: "",
    coverImageAlt: "",
    coverImageStatus: "placeholder",
    reportPreview: "",
    reportPreviewAlt: "",
    testimonial: { quote: "", authorName: "", authorRole: "", approvalStatus: "pending" },
    methodologyNote: "",
    sourceNotes: [],
    relatedArticleIds: [],
    seoTitle: "",
    metaDescription: "",
    clientLogo: "",
    clientLogoPublishable: false,
    adminNotes: "",
    publishedAt: "",
  };
}

function parseJson<T>(raw: string, fallback: T): T {
  if (!raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function parseMetrics(raw: string): CaseMetric[] {
  const parsed = parseJson<unknown>(raw, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const status = isMetricStatus(String(row.status ?? "")) ? (row.status as CaseMetricStatus) : "Anonymised case";
    return {
      id: trim(row.id) || `metric-${index + 1}`,
      label: trim(row.label),
      value: trim(row.value),
      unit: trim(row.unit) || undefined,
      currency: trim(row.currency) || undefined,
      context: trim(row.context),
      definition: trim(row.definition) || undefined,
      period: trim(row.period),
      comparison: trim(row.comparison) || undefined,
      baselinePeriod: trim(row.baselinePeriod) || undefined,
      status,
      sourceNote: trim(row.sourceNote) || undefined,
    };
  });
}

export function parseComparison(raw: string): CaseStudyComparison | undefined {
  const parsed = parseJson<CaseStudyComparison | null>(raw, null);
  if (!parsed || typeof parsed !== "object") return undefined;
  const resultsTable = Array.isArray(parsed.resultsTable) ? parsed.resultsTable : undefined;
  const breakdown = parsed.breakdown && typeof parsed.breakdown === "object" ? parsed.breakdown : undefined;
  if (!resultsTable?.length && !breakdown) return undefined;
  return { resultsTable, breakdown };
}

export function parseTestimonial(raw: string): CaseStudyTestimonialInput {
  const parsed = parseJson<Partial<CaseStudyTestimonialInput>>(raw, {});
  return {
    quote: trim(parsed.quote),
    authorName: trim(parsed.authorName),
    authorRole: trim(parsed.authorRole),
    approvalStatus: parsed.approvalStatus === "approved" ? "approved" : "pending",
  };
}

export function parseStringList(raw: string): string[] {
  const parsed = parseJson<unknown>(raw, null);
  if (Array.isArray(parsed)) return parsed.map((item) => trim(item)).filter(Boolean);
  return raw
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function datetimeLocal(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function inputFromRow(row: CmsCaseStudyRow): CaseStudySaveInput {
  return {
    id: row.id,
    department: isDepartment(row.department) ? row.department : departmentFromServiceArea(row.serviceArea),
    title: row.title,
    slug: row.slug,
    locale: row.locale || "th",
    shortDescription: row.shortDescription,
    clientName: row.clientName,
    clientNameApproved: row.clientNameApproved,
    anonymisedLabel: row.anonymisedLabel,
    hotelType: row.hotelType,
    location: row.location,
    serviceArea: row.serviceArea,
    challenge: row.challenge,
    analysis: row.analysis,
    actionPlan: row.actionPlan,
    result: row.result,
    metrics: parseMetrics(row.metricsJson),
    measurementPeriod: row.measurementPeriod,
    baselinePeriod: row.baselinePeriod,
    dataStatus: isDataStatus(row.dataStatus) ? row.dataStatus : "anonymised",
    workflowStatus: isWorkflow(row.workflowStatus) ? row.workflowStatus : "draft",
    isPublished: row.isPublished,
    isFeatured: row.isFeatured,
    coverImage: row.coverImage,
    coverImageAlt: row.coverImageAlt,
    coverImageStatus: (["real", "approved", "sample", "placeholder"].includes(row.coverImageStatus)
      ? row.coverImageStatus
      : "placeholder") as CaseStudy["coverImageStatus"],
    reportPreview: row.reportPreview,
    reportPreviewAlt: row.reportPreviewAlt,
    comparison: parseComparison(row.chartJson),
    testimonial: parseTestimonial(row.testimonialJson),
    methodologyNote: row.methodologyNote,
    sourceNotes: parseStringList(row.sourceNotes),
    relatedArticleIds: parseStringList(row.relatedArticleIds),
    seoTitle: row.seoTitle,
    metaDescription: row.metaDescription,
    clientLogo: row.clientLogo,
    clientLogoPublishable: row.clientLogoPublishable,
    adminNotes: row.adminNotes,
    publishedAt: datetimeLocal(row.publishedAt),
  };
}

function metricsFromForm(formData: FormData): CaseMetric[] {
  const fromJson = parseMetrics(String(formData.get("metricsJson") ?? "[]"));
  if (fromJson.length) return fromJson;
  const labels = formData.getAll("metricLabel").map((item) => trim(item));
  if (!labels.length) return [emptyMetric(1)];
  return labels.map((label, index) => ({
    id: trim(formData.getAll("metricId")[index]) || `metric-${index + 1}`,
    label,
    value: trim(formData.getAll("metricValue")[index]),
    unit: trim(formData.getAll("metricUnit")[index]) || undefined,
    currency: trim(formData.getAll("metricCurrency")[index]) || undefined,
    context: trim(formData.getAll("metricContext")[index]),
    definition: trim(formData.getAll("metricDefinition")[index]) || undefined,
    period: trim(formData.getAll("metricPeriod")[index]),
    comparison: trim(formData.getAll("metricComparison")[index]) || undefined,
    baselinePeriod: trim(formData.getAll("metricBaseline")[index]) || undefined,
    status: isMetricStatus(trim(formData.getAll("metricStatus")[index]))
      ? (trim(formData.getAll("metricStatus")[index]) as CaseMetricStatus)
      : "Anonymised case",
    sourceNote: trim(formData.getAll("metricSource")[index]) || undefined,
  }));
}

export function intentFromForm(formData: FormData): CaseStudyIntent {
  const value = trim(formData.get("intent"));
  return isIntent(value) ? value : "save";
}

export function inputFromForm(formData: FormData): CaseStudySaveInput {
  const title = trim(formData.get("title"));
  const slug = slugify(trim(formData.get("slug")) || title);
  const departmentRaw = trim(formData.get("department"));
  const dataStatusRaw = trim(formData.get("dataStatus"));
  const workflowRaw = trim(formData.get("workflowStatus"));
  const comparison = parseComparison(String(formData.get("chartJson") ?? ""));
  return {
    id: trim(formData.get("id")) || undefined,
    department: isDepartment(departmentRaw) ? departmentRaw : "revenue",
    title,
    slug,
    locale: trim(formData.get("locale")) || "th",
    shortDescription: trim(formData.get("shortDescription")),
    clientName: trim(formData.get("clientName")),
    clientNameApproved: formData.get("clientNameApproved") === "1",
    anonymisedLabel: trim(formData.get("anonymisedLabel")),
    hotelType: trim(formData.get("hotelType")),
    location: trim(formData.get("location")),
    serviceArea: trim(formData.get("serviceArea")),
    challenge: trim(formData.get("challenge")),
    analysis: trim(formData.get("analysis")),
    actionPlan: trim(formData.get("actionPlan")),
    result: trim(formData.get("result")),
    metrics: metricsFromForm(formData),
    measurementPeriod: trim(formData.get("measurementPeriod")),
    baselinePeriod: trim(formData.get("baselinePeriod")),
    dataStatus: isDataStatus(dataStatusRaw) ? dataStatusRaw : "draft",
    workflowStatus: isWorkflow(workflowRaw) ? workflowRaw : "draft",
    isPublished: formData.get("isPublished") === "1",
    isFeatured: formData.get("isFeatured") === "1",
    coverImage: trim(formData.get("coverImage")),
    coverImageAlt: trim(formData.get("coverImageAlt")),
    coverImageStatus: (["real", "approved", "sample", "placeholder"].includes(trim(formData.get("coverImageStatus")))
      ? trim(formData.get("coverImageStatus"))
      : "placeholder") as CaseStudy["coverImageStatus"],
    reportPreview: trim(formData.get("reportPreview")),
    reportPreviewAlt: trim(formData.get("reportPreviewAlt")),
    comparison,
    testimonial: {
      quote: trim(formData.get("testimonialQuote")),
      authorName: trim(formData.get("testimonialAuthor")),
      authorRole: trim(formData.get("testimonialRole")),
      approvalStatus: formData.get("testimonialApproved") === "1" ? "approved" : "pending",
    },
    methodologyNote: trim(formData.get("methodologyNote")),
    sourceNotes: parseStringList(String(formData.get("sourceNotes") ?? "")),
    relatedArticleIds: parseStringList(String(formData.get("relatedArticleIds") ?? "")),
    seoTitle: trim(formData.get("seoTitle")),
    metaDescription: trim(formData.get("metaDescription")),
    clientLogo: trim(formData.get("clientLogo")),
    clientLogoPublishable: formData.get("clientLogoPublishable") === "1",
    adminNotes: trim(formData.get("adminNotes")),
    publishedAt: trim(formData.get("publishedAt")),
  };
}

export type CaseStudyListStatus = "draft" | "review" | "approved" | "published";

export function caseStudyListStatus(row: Pick<CmsCaseStudyRow, "isPublished" | "workflowStatus">): CaseStudyListStatus {
  if (row.isPublished) return "published";
  if (row.workflowStatus === "review") return "review";
  if (row.workflowStatus === "approved") return "approved";
  return "draft";
}

export function listStatusLabel(status: CaseStudyListStatus) {
  if (status === "published") return "Published";
  if (status === "review") return "Review";
  if (status === "approved") return "Approved";
  return "Draft";
}

export function metricIsEmpty(metric: CaseMetric) {
  return !metric.label.trim() && !metric.value.trim() && !metric.context.trim() && !metric.period.trim() && !metric.comparison?.trim();
}

export function metricCanPublish(metric: CaseMetric, studyPeriod: string, _sample = false) {
  if (metricIsEmpty(metric)) return true;
  const unitOk = Boolean(metric.unit?.trim() || metric.currency?.trim());
  const periodOk = Boolean(metric.period?.trim() || studyPeriod.trim());
  const comparisonOk = Boolean(metric.context.trim() || metric.comparison?.trim() || metric.baselinePeriod?.trim());
  const statusOk = Boolean(metric.status);
  return Boolean(metric.value.trim()) && unitOk && periodOk && comparisonOk && statusOk;
}

export function validateCaseStudyInput(input: CaseStudySaveInput, intent: CaseStudyIntent): string | null {
  if (intent === "publish" || (input.isPublished && intent !== "unpublish")) {
    return validatePublish(input);
  }
  if (input.clientName && !input.clientNameApproved && (input.dataStatus === "approved" || input.dataStatus === "published")) {
    return "client_name_flag";
  }
  if (input.clientLogo && !input.clientLogoPublishable) {
    if (intent === "approve" || intent === "review") return "client_logo_flag";
  }
  if (input.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) return "invalid_slug";
  return null;
}

export function validatePublish(input: CaseStudySaveInput): string | null {
  if (!input.title) return "missing_title";
  if (!input.slug) return "missing_slug";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) return "invalid_slug";
  if (!input.challenge) return "missing_challenge";
  if (!input.actionPlan) return "missing_action";
  if (!input.result) return "missing_result";
  if (!input.measurementPeriod) return "missing_period";
  if (!input.dataStatus || input.dataStatus === "draft" || input.dataStatus === "review") return "missing_data_status";
  if (input.coverImage && !input.coverImageAlt) return "missing_alt";
  if (input.reportPreview && !input.reportPreviewAlt) return "missing_report_alt";
  const sample = input.dataStatus === "sample";
  const blockedMetric = input.metrics.find((metric) => !metricCanPublish(metric, input.measurementPeriod, sample));
  if (blockedMetric) return "metric_unit_period";
  if (input.clientName && !input.clientNameApproved) return "client_name_flag";
  if (input.clientLogo && !input.clientLogoPublishable) return "client_logo_flag";
  return null;
}

export function caseStudyErrorMessage(code: string) {
  const table: Record<string, string> = {
    missing_title: "กรอกชื่อเรื่องก่อนเผยแพร่",
    missing_slug: "กรอก slug ก่อนเผยแพร่",
    invalid_slug: "slug ใช้ได้เฉพาะตัวอักษรอังกฤษตัวเล็ก ตัวเลข และขีดกลาง",
    missing_challenge: "กรอก Challenge ก่อนเผยแพร่",
    missing_action: "กรอก Action ก่อนเผยแพร่",
    missing_result: "กรอก Result ก่อนเผยแพร่",
    missing_period: "กรอกช่วงเวลาที่วัดผลก่อนเผยแพร่",
    missing_data_status: "เลือกสถานะข้อมูล (Anonymised / Approved / Sample / Published) ก่อนเผยแพร่",
    missing_alt: "กรอกคำอธิบายรูปปก (alt text) เมื่อมีรูปปก",
    missing_report_alt: "กรอกคำอธิบายตัวอย่างรายงานเมื่อมีรูป",
    metric_unit_period: "ตัวชี้วัดต้องมีค่า หน่วยหรือสกุลเงิน ช่วงเวลา บริบทเปรียบเทียบ และสถานะข้อมูล",
    client_name_flag: "ชื่อลูกค้าต้องมีธงอนุมัติก่อนแสดงหรือเผยแพร่",
    client_logo_flag: "โลโก้ลูกค้าต้องมีธงอนุญาตเผยแพร่",
    exists: "slug นี้มีอยู่แล้ว เลือก slug อื่น",
    invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
    image_dimensions: "ขนาดรูปไม่ตรงตามที่กำหนด ตรวจสอบความกว้างและความสูง",
    missing: "ไม่พบเคสสตัดดี",
    not_approved: "อนุมัติเคสก่อนเผยแพร่",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export function adminPreviewFromInput(input: CaseStudySaveInput, metrics: CaseMetric[]) {
  const hideClient =
    input.dataStatus === "anonymised" ||
    input.dataStatus === "sample" ||
    input.dataStatus === "draft" ||
    input.dataStatus === "review" ||
    !input.clientNameApproved;
  return {
    title: input.title || "Untitled",
    slug: input.slug,
    identity: hideClient ? input.anonymisedLabel || input.hotelType || "ไม่ระบุชื่อลูกค้า" : input.clientName || input.anonymisedLabel,
    hideClient,
    sample: input.dataStatus === "sample",
    dataStatus: input.dataStatus,
    workflowStatus: input.workflowStatus,
    publicReady: isPubliclyVisible({
      isPublished: input.isPublished,
      workflowStatus: input.workflowStatus,
      dataStatus: input.dataStatus,
      trashedAt: null,
    }),
    logoPublic: Boolean(input.clientLogo && input.clientLogoPublishable && !hideClient),
    logoPending: Boolean(input.clientLogo && !input.clientLogoPublishable),
    challenge: input.challenge,
    action: input.actionPlan,
    result: input.result,
    measurementPeriod: input.measurementPeriod,
    metrics: metrics.filter((metric) => !metricIsEmpty(metric)),
    methodologyNote: input.methodologyNote,
    sourceNotes: input.sourceNotes.filter(Boolean),
    coverImage: input.coverImage,
    coverImageAlt: input.coverImageAlt,
  };
}

export function isPubliclyVisible(row: Pick<CmsCaseStudyRow, "isPublished" | "workflowStatus" | "dataStatus" | "trashedAt">) {
  if (row.trashedAt) return false;
  if (!row.isPublished) return false;
  if (row.workflowStatus === "draft" || row.workflowStatus === "review") return false;
  if (row.dataStatus === "draft" || row.dataStatus === "review") return false;
  return true;
}

export function toPublicCaseStudy(row: CmsCaseStudyRow, options?: { preview?: boolean }): CaseStudy | null {
  if (!options?.preview && !isPubliclyVisible(row)) return null;
  const dataStatus = isDataStatus(row.dataStatus) ? row.dataStatus : "anonymised";
  const hideClient =
    dataStatus === "anonymised" ||
    dataStatus === "sample" ||
    dataStatus === "draft" ||
    dataStatus === "review" ||
    !row.clientNameApproved;
  const testimonial = parseTestimonial(row.testimonialJson);
  const comparison = parseComparison(row.chartJson);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    clientName: hideClient ? undefined : row.clientName || undefined,
    anonymisedLabel: row.anonymisedLabel || undefined,
    hotelType: row.hotelType || undefined,
    location: row.location || undefined,
    serviceArea: row.serviceArea || "Revenue & Distribution Management",
    challenge: row.challenge,
    analysis: row.analysis,
    action: row.actionPlan,
    result: row.result,
    metrics: parseMetrics(row.metricsJson).map((metric) =>
      dataStatus === "sample" ? { ...metric, status: "Sample data" as const } : metric,
    ),
    measurementPeriod: row.measurementPeriod,
    baselinePeriod: row.baselinePeriod || undefined,
    dataStatus,
    coverImage: row.coverImage || undefined,
    coverImageAlt: row.coverImageAlt || undefined,
    coverImageStatus:
      dataStatus === "sample"
        ? "sample"
        : row.coverImageStatus === "real" ||
            row.coverImageStatus === "approved" ||
            row.coverImageStatus === "sample" ||
            row.coverImageStatus === "placeholder"
          ? row.coverImageStatus
          : row.coverImage
            ? "real"
            : "placeholder",
    testimonial:
      testimonial.quote && (options?.preview || testimonial.approvalStatus === "approved")
        ? {
            quote: testimonial.quote,
            authorName: hideClient ? undefined : testimonial.authorName || undefined,
            authorRole: hideClient ? undefined : testimonial.authorRole || undefined,
            approvalStatus: testimonial.approvalStatus,
          }
        : undefined,
    methodologyNote: row.methodologyNote || undefined,
    sourceNotes: parseStringList(row.sourceNotes),
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : undefined,
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : undefined,
    isFeatured: row.isFeatured,
    isPublished: isPubliclyVisible(row),
    department: row.department,
    reportPreview: row.reportPreview || undefined,
    reportPreviewAlt: row.reportPreviewAlt || undefined,
    relatedArticleIds: parseStringList(row.relatedArticleIds),
    comparison,
    seoTitle: row.seoTitle || undefined,
    metaDescription: row.metaDescription || undefined,
  };
}

function jpegSize(buffer: Buffer) {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) return null;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

function webpSize(buffer: Buffer) {
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X" && buffer.length >= 30) {
    const width = 1 + buffer.readUIntLE(24, 3);
    const height = 1 + buffer.readUIntLE(27, 3);
    return { width, height };
  }
  if (chunk === "VP8 " && buffer.length >= 30) {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L" && buffer.length >= 25) {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

export function readImageSize(buffer: Buffer) {
  if (buffer.length >= 24 && buffer[0] === 0x89 && buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.length > 12 && buffer[0] === 0xff && buffer[1] === 0xd8) return jpegSize(buffer);
  if (buffer.length > 30 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return webpSize(buffer);
  }
  return null;
}

export function validateImageBuffer(buffer: Buffer, kind: "cover" | "report" | "logo") {
  const size = readImageSize(buffer);
  if (!size) return null;
  if (size.width > IMAGE_MAX_SIZE.width || size.height > IMAGE_MAX_SIZE.height) return "image_dimensions";
  const min = kind === "report" ? REPORT_MIN_SIZE : kind === "cover" ? COVER_MIN_SIZE : { width: 64, height: 64 };
  if (size.width < min.width || size.height < min.height) return "image_dimensions";
  return null;
}

export function workflowLabel(status: string) {
  if (status === "review") return "รอตรวจ";
  if (status === "approved") return "อนุมัติแล้ว";
  return "ฉบับร่าง";
}

export function dataStatusLabel(status: string) {
  if (status === "approved") return "Approved";
  if (status === "sample") return "Sample";
  if (status === "published") return "Published";
  if (status === "draft") return "Draft";
  return "Anonymised";
}
