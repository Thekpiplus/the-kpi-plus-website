import {
  WEBSITE_CONFIDENCE_PATH,
  WEBSITE_CONFIDENCE_VISUAL,
  websiteSampleLabel,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteVisualFrame } from "./WebsiteVisualFrame";

export function WebsiteConfidenceVisual({
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
      alt={alt || (thai ? WEBSITE_CONFIDENCE_VISUAL.altTh : WEBSITE_CONFIDENCE_VISUAL.altEn)}
      label={thai ? WEBSITE_CONFIDENCE_VISUAL.labelTh : WEBSITE_CONFIDENCE_VISUAL.labelEn}
      caption={thai ? WEBSITE_CONFIDENCE_VISUAL.captionTh : WEBSITE_CONFIDENCE_VISUAL.captionEn}
      meta={thai ? WEBSITE_CONFIDENCE_VISUAL.metaTh : WEBSITE_CONFIDENCE_VISUAL.metaEn}
      status={status || WEBSITE_CONFIDENCE_VISUAL.status}
      width={WEBSITE_CONFIDENCE_VISUAL.displayWidth}
      height={WEBSITE_CONFIDENCE_VISUAL.displayHeight}
      variant="confidence"
    >
      <div
        className="web-confidence-mock"
        role="img"
        aria-label={thai ? WEBSITE_CONFIDENCE_VISUAL.altTh : WEBSITE_CONFIDENCE_VISUAL.altEn}
      >
        <span className="web-visual-badge">{websiteSampleLabel(locale)}</span>
        <p className="web-confidence-mock-kicker kpi-latin">Sample data</p>
        <p className="web-confidence-mock-title kpi-latin">Booking Confidence Checklist</p>
        <ol className="web-confidence-mock-flow">
          {WEBSITE_CONFIDENCE_PATH.map((step, index) => (
            <li key={step.en}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <span className={thai ? undefined : "kpi-latin"}>{thai ? step.th : step.en}</span>
            </li>
          ))}
        </ol>
        <p className="web-confidence-mock-note kpi-latin">Sample evidence · not a hotel result</p>
      </div>
    </WebsiteVisualFrame>
  );
}
