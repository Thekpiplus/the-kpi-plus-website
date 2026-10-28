import {
  WEBSITE_RELATED_VISUAL,
  WEBSITE_RELATED_VISUAL_OPTIONS,
  websiteSampleLabel,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteVisualFrame } from "./WebsiteVisualFrame";

export function WebsiteRelatedVisual({
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
      alt={alt || (thai ? WEBSITE_RELATED_VISUAL.altTh : WEBSITE_RELATED_VISUAL.altEn)}
      label={thai ? WEBSITE_RELATED_VISUAL.labelTh : WEBSITE_RELATED_VISUAL.labelEn}
      caption={thai ? WEBSITE_RELATED_VISUAL.captionTh : WEBSITE_RELATED_VISUAL.captionEn}
      meta={thai ? WEBSITE_RELATED_VISUAL.metaTh : WEBSITE_RELATED_VISUAL.metaEn}
      status={status || WEBSITE_RELATED_VISUAL.status}
      width={WEBSITE_RELATED_VISUAL.displayWidth}
      height={WEBSITE_RELATED_VISUAL.displayHeight}
      variant="related"
    >
      <div className="web-related-mock" role="img" aria-label={thai ? WEBSITE_RELATED_VISUAL.altTh : WEBSITE_RELATED_VISUAL.altEn}>
        <span className="web-visual-badge">{websiteSampleLabel(locale)}</span>
        <p className="web-related-mock-kicker kpi-latin">Sample content</p>
        <p className="web-related-mock-title kpi-latin">{WEBSITE_RELATED_VISUAL.labelEn}</p>
        <ol className="web-related-mock-list">
          {WEBSITE_RELATED_VISUAL_OPTIONS.map((item, index) => (
            <li key={item.id} className={index === 0 ? "is-featured" : undefined}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong className="kpi-latin">{item.label}</strong>
            </li>
          ))}
        </ol>
        <p className="web-related-mock-note kpi-latin">Not a hotel booking result</p>
      </div>
    </WebsiteVisualFrame>
  );
}
