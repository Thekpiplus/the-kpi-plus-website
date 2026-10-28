import {
  WEBSITE_DECISION_PATHS,
  WEBSITE_DECISION_STEPS,
  WEBSITE_DECISION_VISUAL,
  websiteSampleLabel,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteVisualFrame } from "./WebsiteVisualFrame";

export function WebsiteDecisionVisual({
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
      alt={alt || (thai ? WEBSITE_DECISION_VISUAL.altTh : WEBSITE_DECISION_VISUAL.altEn)}
      label={thai ? WEBSITE_DECISION_VISUAL.labelTh : WEBSITE_DECISION_VISUAL.labelEn}
      caption={thai ? WEBSITE_DECISION_VISUAL.captionTh : WEBSITE_DECISION_VISUAL.captionEn}
      meta={thai ? WEBSITE_DECISION_VISUAL.metaTh : WEBSITE_DECISION_VISUAL.metaEn}
      status={status || WEBSITE_DECISION_VISUAL.status}
      width={WEBSITE_DECISION_VISUAL.displayWidth}
      height={WEBSITE_DECISION_VISUAL.displayHeight}
      variant="decision"
    >
      <div
        className="web-decision-mock"
        role="img"
        aria-label={thai ? WEBSITE_DECISION_VISUAL.altTh : WEBSITE_DECISION_VISUAL.altEn}
      >
        <span className="web-visual-badge">{websiteSampleLabel(locale)}</span>
        <p className="web-decision-mock-kicker kpi-latin">Sample decision</p>
        <p className="web-decision-mock-title kpi-latin">{WEBSITE_DECISION_VISUAL.labelEn}</p>
        <ol className="web-decision-mock-flow">
          {WEBSITE_DECISION_STEPS.map((step, index) => (
            <li key={step.id}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong className="kpi-latin">{step.en}</strong>
            </li>
          ))}
        </ol>
        <p className="web-decision-mock-outcomes kpi-latin">
          {WEBSITE_DECISION_PATHS.map((path) => path.titleEn).join(" · ")}
        </p>
        <p className="web-decision-mock-note kpi-latin">Sample path · not a conversion result</p>
      </div>
    </WebsiteVisualFrame>
  );
}
