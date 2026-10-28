import type { Locale } from "@/lib/seo";
import { WebsiteKpiCards, type WebsiteKpiCard } from "./WebsiteKpiCards";
import { WebsiteKpiChart, type WebsiteKpiChartSeries } from "./WebsiteKpiChart";
import { WebsiteKpiVisual } from "./WebsiteKpiVisual";

export function WebsiteMeasure({
  locale,
  src,
  alt,
  status,
  kpis,
  chart,
  trackingBoundary,
  trackingReady = false,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
  kpis?: WebsiteKpiCard[];
  chart?: WebsiteKpiChartSeries[];
  trackingBoundary?: string;
  trackingReady?: boolean;
}) {
  const sampleChart = !chart?.length || chart.every((item) => !item.values.length);
  return (
    <div className="web-measure">
      <WebsiteKpiVisual locale={locale} src={src} alt={alt} status={status} />
      <WebsiteKpiChart locale={locale} series={sampleChart ? undefined : chart} sample={sampleChart || !trackingReady} />
      {trackingBoundary ? <p className="web-measure-boundary">{trackingBoundary}</p> : null}
      <WebsiteKpiCards locale={locale} items={kpis} />
    </div>
  );
}
