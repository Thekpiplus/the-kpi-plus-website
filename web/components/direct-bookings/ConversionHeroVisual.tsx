import {
  DIRECT_BOOKING_HERO_FLOW,
  DIRECT_BOOKING_HERO_VISUAL,
  directBookingSampleLabel,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";
import { ConversionVisualFrame } from "./ConversionVisualFrame";

export function ConversionHeroVisual({
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
      alt={alt || (thai ? DIRECT_BOOKING_HERO_VISUAL.altTh : DIRECT_BOOKING_HERO_VISUAL.altEn)}
      label={label?.trim() || (thai ? DIRECT_BOOKING_HERO_VISUAL.labelTh : DIRECT_BOOKING_HERO_VISUAL.labelEn)}
      caption={caption?.trim() || (thai ? DIRECT_BOOKING_HERO_VISUAL.captionTh : DIRECT_BOOKING_HERO_VISUAL.captionEn)}
      meta={thai ? DIRECT_BOOKING_HERO_VISUAL.metaTh : DIRECT_BOOKING_HERO_VISUAL.metaEn}
      status={status || DIRECT_BOOKING_HERO_VISUAL.status}
      width={DIRECT_BOOKING_HERO_VISUAL.displayWidth}
      height={DIRECT_BOOKING_HERO_VISUAL.displayHeight}
      variant="hero"
      eager
    >
      <div className="db-hero-mock" role="img" aria-label={thai ? DIRECT_BOOKING_HERO_VISUAL.altTh : DIRECT_BOOKING_HERO_VISUAL.altEn}>
        <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
        <p className="db-hero-mock-kicker kpi-latin">Sample Website</p>
        <p className="db-hero-mock-title kpi-latin">Website → Room Detail → Booking Engine</p>
        <div className="db-hero-mock-devices" aria-hidden="true">
          <div className="db-hero-mock-desktop">
            <span className="db-hero-mock-chrome" />
            <span className="db-hero-mock-photo" />
            <span className="db-hero-mock-row" />
            <span className="db-hero-mock-cta kpi-latin">Book</span>
          </div>
          <div className="db-hero-mock-phone">
            <span className="db-hero-mock-chrome" />
            <span className="db-hero-mock-photo" />
            <span className="db-hero-mock-cta kpi-latin">Book</span>
          </div>
        </div>
        <ol className="db-hero-mock-flow">
          {DIRECT_BOOKING_HERO_FLOW.map((step, index) => (
            <li key={step.en}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong className={thai ? undefined : "kpi-latin"}>{thai ? step.th : step.en}</strong>
            </li>
          ))}
        </ol>
      </div>
    </ConversionVisualFrame>
  );
}
