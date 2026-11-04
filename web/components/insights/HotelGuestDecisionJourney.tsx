import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

/** Example decision stages — not a claim that every guest follows the same sequence. */
const STEPS = ["Discover", "Compare", "Trust", "Book", "Stay", "Review/Return"] as const;

/** Example touchpoints only — not logos or endorsements. */
const TOUCHPOINTS = ["Search", "Maps", "OTA", "Website", "Booking Engine", "Guest Experience", "Reviews"] as const;

const COVER_BG = "/images/insights/hotel-marketing-customer-journey-placeholder.webp";
const MAP_LABEL = "Hotel Guest Decision Journey — Sample";

const copy = {
  th: {
    label: MAP_LABEL,
    touchpointsLabel: "ตัวอย่างจุดสัมผัส",
    explain:
      "ข้อมูลโรงแรมที่สอดคล้องกัน ความชัดของข้อเสนอ บริบทห้องว่างและราคา และความน่าเชื่อถือจากรีวิว/ประสบการณ์ อาจช่วยให้ผู้เข้าพักตัดสินใจได้ง่ายขึ้นตามเส้นทางของตน — ไม่ใช่การรับประกันยอดจองหรือรายได้",
    note: "ตัวอย่าง · ผู้เข้าพักแต่ละคนอาจข้ามหรือสลับลำดับขั้นได้",
    alt: "แผนภาพตัวอย่างเส้นทางตัดสินใจของผู้เข้าพัก Discover ถึง Review/Return ไม่ใช่ผลงานลูกค้า",
  },
  en: {
    label: MAP_LABEL,
    touchpointsLabel: "Example touchpoints",
    explain:
      "Consistent hotel information, clear offers, availability/rate context, and guest trust from reviews or experience may support decision-making along a guest’s own path — not a guaranteed increase in bookings or revenue.",
    note: "Example · Guests may skip or reorder steps",
    alt: "Sample guest decision journey from Discover to Review/Return. Not a client result.",
  },
} as const;

export function HotelGuestDecisionJourney({ locale }: { locale: Locale }) {
  const ui = copy[locale === "th" ? "th" : "en"];
  const backgroundSrc = existingPublicSrc(COVER_BG);

  return (
    <figure className="kpi-article-decision-journey">
      <div className="kpi-article-decision-journey-frame" role="img" aria-label={ui.alt}>
        {backgroundSrc ? (
          <img
            className="kpi-article-decision-journey-bg"
            src={backgroundSrc}
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        ) : null}

        <div className="kpi-article-decision-journey-body">
          <p className="kpi-article-decision-journey-kicker kpi-latin">{ui.label}</p>

          <ol className="kpi-article-decision-journey-steps kpi-latin" aria-hidden="true">
            {STEPS.map((step, index) => (
              <li key={step}>
                <span className="kpi-article-decision-journey-step">{step}</span>
                {index < STEPS.length - 1 ? (
                  <span className="kpi-article-decision-journey-sep" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>

          <div className="kpi-article-decision-journey-touchpoints">
            <p className={`kpi-article-decision-journey-touchpoints-label${locale === "th" ? "" : " kpi-latin"}`}>
              {ui.touchpointsLabel}
            </p>
            <ul className="kpi-article-decision-journey-touchpoints-list kpi-latin">
              {TOUCHPOINTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <p className={`kpi-article-decision-journey-explain${locale === "th" ? "" : " kpi-latin"}`}>{ui.explain}</p>
          <p className={`kpi-article-decision-journey-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
        </div>
      </div>
      <figcaption className="sr-only">{ui.alt}</figcaption>
    </figure>
  );
}
