import {
  WEBSITE_KPI_GROUPS,
  WEBSITE_KPI_VISUAL,
  websiteSampleLabel,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteVisualFrame } from "./WebsiteVisualFrame";

export function WebsiteKpiVisual({
  locale,
  src,
  alt,
  status,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
}) {
  const thai = locale === "th";
  return (
    <WebsiteVisualFrame
      locale={locale}
      src={src}
      alt={alt || (thai ? WEBSITE_KPI_VISUAL.altTh : WEBSITE_KPI_VISUAL.altEn)}
      label={thai ? WEBSITE_KPI_VISUAL.labelTh : WEBSITE_KPI_VISUAL.labelEn}
      caption={thai ? WEBSITE_KPI_VISUAL.captionTh : WEBSITE_KPI_VISUAL.captionEn}
      meta={thai ? WEBSITE_KPI_VISUAL.metaTh : WEBSITE_KPI_VISUAL.metaEn}
      status={status || WEBSITE_KPI_VISUAL.status}
      width={WEBSITE_KPI_VISUAL.displayWidth}
      height={WEBSITE_KPI_VISUAL.displayHeight}
      variant="measure"
    >
      <div className="web-measure-mock" role="img" aria-label={thai ? WEBSITE_KPI_VISUAL.altTh : WEBSITE_KPI_VISUAL.altEn}>
        <span className="web-visual-badge">{websiteSampleLabel(locale)}</span>
        <p className="web-measure-mock-kicker kpi-latin">Sample data</p>
        <p className="web-measure-mock-title kpi-latin">{WEBSITE_KPI_VISUAL.labelEn}</p>
        <ol className="web-measure-mock-flow">
          {WEBSITE_KPI_GROUPS.map((group) => (
            <li key={group.id} className={group.id === "outcome" ? "is-outcome" : undefined}>
              <span className="kpi-latin">{group.num}</span>
              <strong className="kpi-latin">{thai ? group.titleTh : group.titleEn}</strong>
              <small className="kpi-latin">{group.id === "outcome" ? "Tracking not configured" : "Sample series"}</small>
            </li>
          ))}
        </ol>
        <p className="web-measure-mock-note kpi-latin">No hotel booking totals</p>
      </div>
    </WebsiteVisualFrame>
  );
}
