import { existsSync } from "fs";
import { join } from "path";

function existingPublicSrc(src: string | undefined) {
  const next = src?.trim() ?? "";
  if (!next) return "";
  try {
    const relative = next.replace(/^\//, "");
    if (!existsSync(join(process.cwd(), "public", relative))) return "";
  } catch {
    return "";
  }
  return next.startsWith("/") ? next : `/${next}`;
}

export const CASE_STUDIES_HERO_VISUAL = {
  /** Approved poolside property visual with Room Revenue / ADR / ROAS highlights. */
  approvedSrc: "/media/case-studies-hero-poolside_5539abd3.jpg" as string | undefined,
  approvedAlt: "Hotel poolside with Room Revenue, ADR and ROAS performance highlights",
  approvedAltTh: "วิวโรงแรมริมสระ พร้อมไฮไลต์ผล Room Revenue, ADR และ ROAS",
  reservedSrc: "/images/case-studies-hero-property-placeholder.webp",
  sourceWidth: 1024,
  sourceHeight: 576,
  displayWidth: 640,
  displayHeight: 360,
  ratio: "16 / 9",
  label: "Replace with approved hotel / case study visual",
} as const;

export const CASE_STUDIES_RESULTS_CHART = {
  reservedSrc: "/images/case-studies-results-chart-placeholder.webp",
  sourceWidth: 1600,
  sourceHeight: 900,
  displayWidth: 640,
  displayHeight: 360,
  ratio: "16 / 9",
  label: "Before–After performance chart · Sample data",
  // TODO: Add /public/images/case-studies-results-chart-placeholder.webp only as a labelled 1600×900 static fallback. Do not generate a fake performance chart.
} as const;

export function caseStudiesResultsChartFallback() {
  return {
    src: existingPublicSrc(CASE_STUDIES_RESULTS_CHART.reservedSrc) || undefined,
    alt: CASE_STUDIES_RESULTS_CHART.label,
    status: "placeholder" as const,
    label: CASE_STUDIES_RESULTS_CHART.label,
  };
}

export const CASE_STUDY_REPORT_PREVIEW = {
  reservedSrc: "/images/case-study-report-preview-placeholder.webp",
  sourceWidth: 1200,
  sourceHeight: 800,
  displayWidth: 360,
  displayHeight: 240,
  ratio: "3 / 2",
  label: "ตัวอย่าง Case Study Report",
  // TODO: Add /public/images/case-study-report-preview-placeholder.webp as a labelled 1200×800 sample, or replace with one approved redacted Case Study Report. Do not generate a fake dashboard or hotel photo.
} as const;

export function caseStudyReportPreview() {
  const src = existingPublicSrc(CASE_STUDY_REPORT_PREVIEW.reservedSrc);
  if (src) {
    return {
      src,
      alt: CASE_STUDY_REPORT_PREVIEW.label,
      status: "sample" as const,
      label: CASE_STUDY_REPORT_PREVIEW.label,
    };
  }

  return {
    src: undefined,
    alt: CASE_STUDY_REPORT_PREVIEW.label,
    status: "sample" as const,
    label: CASE_STUDY_REPORT_PREVIEW.label,
  };
}

export const CASE_STUDY_CARD_VISUAL = {
  sourceWidth: 1200,
  sourceHeight: 800,
  displayWidth: 380,
  displayHeight: 250,
  ratio: "3 / 2",
  label: "Case visual placeholder · Replace with approved asset",
} as const;

function caseStudyVisualNeed(serviceArea: string) {
  if (/revenue|distribution/i.test(serviceArea)) return "Hotel property photo or Revenue Report";
  if (/direct booking/i.test(serviceArea)) return "Booking funnel or website performance snapshot";
  if (/ota/i.test(serviceArea)) return "Rate comparison or channel-mix visual";
  if (/digital/i.test(serviceArea)) return "Campaign report or ROAS chart";
  return "Approved case visual";
}

export function caseStudyCardVisual(study: { slug: string; serviceArea: string; coverImage?: string; coverImageAlt?: string; coverImageStatus: "real" | "approved" | "sample" | "placeholder" }) {
  const approved =
    study.coverImageStatus === "approved" || study.coverImageStatus === "real"
      ? existingPublicSrc(study.coverImage)
      : "";
  const caption = `${study.serviceArea}: ${caseStudyVisualNeed(study.serviceArea)}`;

  if (approved) {
    return {
      src: approved,
      alt: study.coverImageAlt?.trim() || caption,
      status: "approved" as const,
      label: CASE_STUDY_CARD_VISUAL.label,
      caption,
    };
  }

  return {
    src: existingPublicSrc(`/images/case-study-${study.slug}-placeholder.webp`) || undefined,
    alt: CASE_STUDY_CARD_VISUAL.label,
    status: "placeholder" as const,
    label: CASE_STUDY_CARD_VISUAL.label,
    caption,
  };
}

export function isCaseStudyStaging() {
  return process.env.NODE_ENV !== "production";
}

export function caseStudyPropertyEvidence(study: {
  slug: string;
  coverImage?: string;
  coverImageAlt?: string;
  coverImageStatus: "real" | "approved" | "sample" | "placeholder";
}) {
  const approved =
    study.coverImageStatus === "approved" || study.coverImageStatus === "real"
      ? existingPublicSrc(study.coverImage)
      : "";

  if (approved) {
    return {
      src: approved,
      alt: study.coverImageAlt?.trim() || "Approved property photo",
      status: "approved" as const,
      label: "Property photo",
      caption: "Property photo",
    };
  }

  if (!isCaseStudyStaging()) return null;

  return {
    src: existingPublicSrc(`/images/case-study-${study.slug}-placeholder.webp`) || undefined,
    alt: "Property photo · Replace with approved asset",
    status: "placeholder" as const,
    label: "Property photo · Replace with approved asset",
    caption: "Property photo · staging placeholder",
  };
}

export function caseStudyReportEvidence(study: { slug: string; reportPreview?: string; reportPreviewAlt?: string }) {
  const src = existingPublicSrc(study.reportPreview) || existingPublicSrc(`/images/case-study-${study.slug}-report.webp`);
  if (src) {
    return {
      src,
      alt: study.reportPreviewAlt?.trim() || "Approved report screenshot",
      status: "approved" as const,
      label: "Report screenshot",
      caption: "Report screenshot",
    };
  }

  if (!isCaseStudyStaging()) return null;

  return {
    src: undefined,
    alt: "Report screenshot · Replace with approved asset",
    status: "placeholder" as const,
    label: "Report screenshot · Replace with approved asset",
    caption: "Report screenshot · staging placeholder",
  };
}

export function caseStudiesHeroVisual(locale: "th" | "en" | "ru" | "zh" = "en") {
  const approved = existingPublicSrc(CASE_STUDIES_HERO_VISUAL.approvedSrc);
  if (approved) {
    return {
      src: approved,
      alt:
        locale === "th"
          ? CASE_STUDIES_HERO_VISUAL.approvedAltTh
          : CASE_STUDIES_HERO_VISUAL.approvedAlt || "Case study visual",
      status: "approved" as const,
      label: CASE_STUDIES_HERO_VISUAL.label,
    };
  }

  return {
    src: existingPublicSrc(CASE_STUDIES_HERO_VISUAL.reservedSrc) || undefined,
    alt: locale === "th" ? "ภาพประกอบ Case Study" : "Case study visual",
    status: "placeholder" as const,
    label: CASE_STUDIES_HERO_VISUAL.label,
  };
}
