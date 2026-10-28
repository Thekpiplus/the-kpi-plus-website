import {
  WEBSITE_FRAMEWORK_PILLARS,
  WEBSITE_FRAMEWORK_STAGES,
  WEBSITE_FRAMEWORK_VISUAL,
  websiteSampleLabel,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteVisualFrame } from "./WebsiteVisualFrame";

export function WebsiteFrameworkVisual({
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
      alt={alt || (thai ? WEBSITE_FRAMEWORK_VISUAL.altTh : WEBSITE_FRAMEWORK_VISUAL.altEn)}
      label={thai ? WEBSITE_FRAMEWORK_VISUAL.labelTh : WEBSITE_FRAMEWORK_VISUAL.labelEn}
      caption={thai ? WEBSITE_FRAMEWORK_VISUAL.captionTh : WEBSITE_FRAMEWORK_VISUAL.captionEn}
      meta={thai ? WEBSITE_FRAMEWORK_VISUAL.metaTh : WEBSITE_FRAMEWORK_VISUAL.metaEn}
      status={status || WEBSITE_FRAMEWORK_VISUAL.status}
      width={WEBSITE_FRAMEWORK_VISUAL.displayWidth}
      height={WEBSITE_FRAMEWORK_VISUAL.displayHeight}
      variant="framework"
    >
      <div
        className="web-framework-mock"
        role="img"
        aria-label={thai ? WEBSITE_FRAMEWORK_VISUAL.altTh : WEBSITE_FRAMEWORK_VISUAL.altEn}
      >
        <span className="web-visual-badge">{websiteSampleLabel(locale)}</span>
        <p className="web-framework-mock-kicker kpi-latin">Sample framework</p>
        <p className="web-framework-mock-title kpi-latin">{WEBSITE_FRAMEWORK_VISUAL.labelEn}</p>
        <ol className="web-framework-mock-flow">
          {WEBSITE_FRAMEWORK_STAGES.map((stage, index) => (
            <li key={stage.id}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong className="kpi-latin">{stage.en}</strong>
              <small className="kpi-latin">{WEBSITE_FRAMEWORK_PILLARS[index]?.output}</small>
            </li>
          ))}
        </ol>
        <p className="web-framework-mock-note kpi-latin">Sample diagram · not a client project</p>
      </div>
    </WebsiteVisualFrame>
  );
}
