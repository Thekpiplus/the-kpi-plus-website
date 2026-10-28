import {
  DIRECT_BOOKING_CONFIDENCE_PATH,
  DIRECT_BOOKING_CONFIDENCE_VISUAL,
  directBookingSampleLabel,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";
import { ConversionVisualFrame } from "./ConversionVisualFrame";

export function ConversionConfidenceVisual({
  locale,
  src,
  alt,
  status,
  label,
  caption,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
  label?: string;
  caption?: string;
}) {
  const thai = locale === "th";
  return (
    <ConversionVisualFrame
      locale={locale}
      src={src}
      alt={alt || (thai ? DIRECT_BOOKING_CONFIDENCE_VISUAL.altTh : DIRECT_BOOKING_CONFIDENCE_VISUAL.altEn)}
      label={label?.trim() || (thai ? DIRECT_BOOKING_CONFIDENCE_VISUAL.labelTh : DIRECT_BOOKING_CONFIDENCE_VISUAL.labelEn)}
      caption={caption?.trim() || (thai ? DIRECT_BOOKING_CONFIDENCE_VISUAL.captionTh : DIRECT_BOOKING_CONFIDENCE_VISUAL.captionEn)}
      meta={thai ? DIRECT_BOOKING_CONFIDENCE_VISUAL.metaTh : DIRECT_BOOKING_CONFIDENCE_VISUAL.metaEn}
      status={status || DIRECT_BOOKING_CONFIDENCE_VISUAL.status}
      width={DIRECT_BOOKING_CONFIDENCE_VISUAL.displayWidth}
      height={DIRECT_BOOKING_CONFIDENCE_VISUAL.displayHeight}
      variant="confidence"
    >
      <div
        className="db-confidence-mock"
        role="img"
        aria-label={thai ? DIRECT_BOOKING_CONFIDENCE_VISUAL.altTh : DIRECT_BOOKING_CONFIDENCE_VISUAL.altEn}
      >
        <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
        <p className="db-confidence-mock-kicker kpi-latin">Sample Website</p>
        <p className="db-confidence-mock-title kpi-latin">Booking Confidence Flow</p>
        <div className="db-confidence-mock-layout">
          <div className="db-confidence-mock-phone" aria-hidden="true">
            <span className="db-confidence-mock-chrome" />
            <span className="db-confidence-mock-block">
              <small className="kpi-latin">Room Detail / Offer</small>
              <span className="db-confidence-mock-redact" />
            </span>
            <span className="db-confidence-mock-block">
              <small className="kpi-latin">Price / Policy</small>
              <span className="db-confidence-mock-redact" />
            </span>
            <span className="db-confidence-mock-cta kpi-latin">Availability / CTA</span>
          </div>
          <ol className="db-confidence-mock-flow">
            {DIRECT_BOOKING_CONFIDENCE_PATH.map((step, index) => (
              <li key={step.en}>
                <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <strong className={thai ? undefined : "kpi-latin"}>{thai ? step.th : step.en}</strong>
              </li>
            ))}
          </ol>
        </div>
        <p className="db-confidence-mock-note kpi-latin">Redacted sample · Booking Engine preview · not a hotel result</p>
      </div>
    </ConversionVisualFrame>
  );
}
