import {
  caseStudyMetricStatusLabel,
  caseStudyParagraphs,
  type CaseStudy,
  type CaseStudyComparison,
  type CaseStudyRow,
} from "@/lib/case-studies";
import type { Locale } from "@/lib/seo";

export type CaseStudyChartSeries = {
  name: string;
  color: string;
  values: number[];
};

export type CaseStudyChartBaseline = {
  value: number;
  label: string;
  color?: string;
};

export type CaseStudyChartData = {
  labels: string[];
  series: CaseStudyChartSeries[];
  title: string;
  subtitle: string;
  unit?: string;
  statusLabel: string;
  axisLabel?: string;
  tickSuffix?: string;
  valueLabels?: string[];
  baseline?: CaseStudyChartBaseline;
  caption?: string;
};

const SERIES_COLORS = ["#0B6660", "#A3CE39", "#0B1F33", "#1F3F63"] as const;


function parseChartNumber(value: string): number | null {
  const million = /m\b/i.test(value);
  const compact = value.replace(/[฿,\s]/g, "").replace(/%/g, "").replace(/pts/gi, "");
  const num = Number.parseFloat(compact);
  if (!Number.isFinite(num)) return null;
  return million ? num * 1_000_000 : num;
}

function indexedSeries(rows: CaseStudyRow[]): CaseStudyChartSeries[] {
  return rows.flatMap((row, index) => {
    const before = parseChartNumber(row.before);
    const after = parseChartNumber(row.after);
    if (before == null || after == null || before === 0) return [];
    return [
      {
        name: row.label,
        color: SERIES_COLORS[index % SERIES_COLORS.length]!,
        values: [100, Number(((after / before) * 100).toFixed(1))],
      },
    ];
  });
}

export function caseStudyResultsChart(
  study: CaseStudy,
  comparison: CaseStudyComparison | undefined,
  locale: Locale,
  copy: { before: string; after: string },
): CaseStudyChartData | null {
  const series = indexedSeries(comparison?.resultsTable ?? []);
  if (!series.length) return null;

  const metricStatus = study.metrics[0]?.status ?? "Sample data";
  const statusLabel = caseStudyMetricStatusLabel(metricStatus, locale);

  return {
    labels: [copy.before, copy.after],
    series,
    title: "Indexed comparison",
    subtitle: study.measurementPeriod
      ? `${study.measurementPeriod} · Baseline = 100`
      : "Baseline = 100",
    statusLabel,
  };
}

const OVERVIEW_POSITIVE = "#A2DC25";
const OVERVIEW_BASELINE = "#EBE722";

function roomRevenueRow(comparison: CaseStudyComparison | undefined) {
  return comparison?.resultsTable?.find((row) => /room revenue/i.test(row.label));
}

function toMillions(value: number) {
  return Number((value / 1_000_000).toFixed(2));
}

export function caseStudyOverviewChart(
  study: CaseStudy,
  comparison: CaseStudyComparison | undefined,
  locale: Locale,
): CaseStudyChartData | null {
  const row = roomRevenueRow(comparison);
  const before = row ? parseChartNumber(row.before) : null;
  const after = row ? parseChartNumber(row.after) : null;
  if (!row || before == null || after == null) return null;

  const beforeM = toMillions(before);
  const afterM = toMillions(after);
  const metricStatus = study.metrics.find((metric) => metric.id === "room-revenue")?.status
    ?? study.metrics[0]?.status
    ?? "Sample data";
  const statusLabel = caseStudyMetricStatusLabel(metricStatus, locale);
  const period = study.measurementPeriod;
  const baselineLabel = "Baseline (before)";
  const caption = caseStudyParagraphs(study.analysis)[0];

  return {
    labels: locale === "th" ? ["ก่อน", "หลัง"] : ["Before", "After"],
    series: [
      {
        name: row.label,
        color: OVERVIEW_POSITIVE,
        values: [beforeM, afterM],
      },
    ],
    title: "Before–After Room Revenue",
    subtitle: period
      ? `${period} · ${baselineLabel} = ${row.before}`
      : `${baselineLabel} = ${row.before}`,
    unit: "฿",
    tickSuffix: "M",
    axisLabel: "THB million",
    valueLabels: [row.before, row.after],
    baseline: {
      value: beforeM,
      label: `${baselineLabel} · ${row.before}`,
      color: OVERVIEW_BASELINE,
    },
    statusLabel,
    caption,
  };
}
