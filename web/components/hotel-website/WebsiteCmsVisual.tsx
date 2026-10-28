import {
  WEBSITE_CMS_FIT_ROWS,
  WEBSITE_CMS_STACK_STAGES,
  WEBSITE_CMS_VISUAL,
  websiteSampleLabel,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteVisualFrame } from "./WebsiteVisualFrame";

export function WebsiteCmsVisual({
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
      alt={alt || (thai ? WEBSITE_CMS_VISUAL.altTh : WEBSITE_CMS_VISUAL.altEn)}
      label={thai ? WEBSITE_CMS_VISUAL.labelTh : WEBSITE_CMS_VISUAL.labelEn}
      caption={thai ? WEBSITE_CMS_VISUAL.captionTh : WEBSITE_CMS_VISUAL.captionEn}
      meta={thai ? WEBSITE_CMS_VISUAL.metaTh : WEBSITE_CMS_VISUAL.metaEn}
      status={status || WEBSITE_CMS_VISUAL.status}
      width={WEBSITE_CMS_VISUAL.displayWidth}
      height={WEBSITE_CMS_VISUAL.displayHeight}
      variant="cms"
    >
      <div
        className="web-cms-mock"
        role="img"
        aria-label={thai ? WEBSITE_CMS_VISUAL.altTh : WEBSITE_CMS_VISUAL.altEn}
      >
        <span className="web-visual-badge">{websiteSampleLabel(locale)}</span>
        <p className="web-cms-mock-kicker kpi-latin">Sample stack</p>
        <p className="web-cms-mock-title kpi-latin">{WEBSITE_CMS_VISUAL.labelEn}</p>
        <ol className="web-cms-mock-flow">
          {WEBSITE_CMS_STACK_STAGES.map((stage, index) => (
            <li key={stage.id}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong className="kpi-latin">{stage.en}</strong>
              <small className="kpi-latin">{WEBSITE_CMS_FIT_ROWS[index]?.needEn ?? "Ownership"}</small>
            </li>
          ))}
        </ol>
        <p className="web-cms-mock-note kpi-latin">Sample diagram · not a client architecture</p>
      </div>
    </WebsiteVisualFrame>
  );
}
