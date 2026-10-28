import {
  DIRECT_BOOKING_ENQUIRY_FLOW,
  DIRECT_BOOKING_ENQUIRY_VISUAL,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";
import { ConversionVisualFrame } from "./ConversionVisualFrame";

export function ConversionEnquiryVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  const visual = DIRECT_BOOKING_ENQUIRY_VISUAL;
  return (
    <ConversionVisualFrame
      locale={locale}
      src={src?.trim() || ""}
      alt={thai ? visual.altTh : visual.altEn}
      label={thai ? visual.labelTh : visual.labelEn}
      caption={thai ? visual.captionTh : visual.captionEn}
      meta={thai ? visual.metaTh : visual.metaEn}
      status={visual.status}
      width={visual.displayWidth}
      height={visual.displayHeight}
      variant="enquiry"
    >
      <div className="db-enquiry-flow" role="img" aria-label={thai ? visual.altTh : visual.altEn}>
        {DIRECT_BOOKING_ENQUIRY_FLOW.map((step, index) => (
          <span key={step.en} className="db-enquiry-flow-step">
            <strong className="kpi-latin">{thai ? step.th : step.en}</strong>
            {index < DIRECT_BOOKING_ENQUIRY_FLOW.length - 1 ? (
              <span className="db-enquiry-flow-arrow kpi-latin" aria-hidden="true">
                →
              </span>
            ) : null}
          </span>
        ))}
      </div>
    </ConversionVisualFrame>
  );
}
