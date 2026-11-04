import { insightsIndexCopy, type InsightPost } from "@/lib/insights";
import {
  existingPublicSrc,
  insightCoverAlt,
  insightSampleLabel,
  type InsightMediaVariant,
} from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const HOTEL_MARKETING_SLUG = "hotel-marketing";
const COVER_BG = "/images/insights/hotel-marketing-cover-placeholder.webp";

/** Verified article path stages. No metrics, hotel names, logos, or channel performance. */
const JOURNEY_STEPS = ["Visibility", "Interest", "Consideration", "Booking", "Revenue"] as const;
const CARD_STEPS = ["Visibility", "Interest", "Consideration", "Booking"] as const;

const COVER_LABEL = "Hotel Marketing Guest Journey — Sample Visual";

const uiCopy = {
  th: {
    title: COVER_LABEL,
    note: "แผนภาพตัวอย่าง · ไม่ใช่ผลงานลูกค้า",
  },
  en: {
    title: COVER_LABEL,
    note: "Sample visual · Not a client result",
  },
} as const;

function JourneyArrow() {
  return (
    <svg className="kpi-insight-marketing-funnel-arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
      <path d="M3 8h9M8 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InsightHotelMarketingVisual({
  post,
  locale,
  variant = "card",
}: {
  post: InsightPost;
  locale: Locale;
  variant?: InsightMediaVariant;
}) {
  const t = insightsIndexCopy[locale];
  const sample = insightSampleLabel(locale);
  const ui = uiCopy[locale === "th" ? "th" : "en"];
  const isFeatured = variant === "featured";
  const steps = isFeatured ? JOURNEY_STEPS : CARD_STEPS;
  const backgroundSrc =
    existingPublicSrc(post.coverImage) || existingPublicSrc(COVER_BG) || "";

  if (post.slug !== HOTEL_MARKETING_SLUG) return null;

  return (
    <div
      className={`kpi-insight-marketing-sample${isFeatured ? " kpi-insight-marketing-sample--featured" : ""}`}
      role="img"
      aria-label={insightCoverAlt(post, locale)}
    >
      {backgroundSrc ? (
        <img
          className="kpi-insight-marketing-sample-bg"
          src={backgroundSrc}
          alt=""
          width={isFeatured ? 1600 : 1200}
          height={isFeatured ? 900 : 675}
          decoding="async"
          fetchPriority={isFeatured ? "high" : "auto"}
          aria-hidden="true"
        />
      ) : null}

      <span className={`kpi-insight-sample-label${locale === "th" ? "" : " kpi-latin"}`}>{sample}</span>

      <div className="kpi-insight-marketing-sample-body">
        <p className="kpi-insight-marketing-sample-kicker kpi-latin">{isFeatured ? ui.title : t.marketingSampleKicker}</p>

        <ol
          className={`kpi-insight-marketing-funnel kpi-latin${isFeatured ? " kpi-insight-marketing-funnel--journey" : ""}`}
          aria-hidden="true"
        >
          {steps.map((step, index) => (
            <li key={step}>
              {isFeatured ? <span className="kpi-insight-marketing-funnel-index">{String(index + 1).padStart(2, "0")}</span> : null}
              <span className="kpi-insight-marketing-funnel-step">{step}</span>
              {isFeatured && index < steps.length - 1 ? <JourneyArrow /> : null}
            </li>
          ))}
        </ol>

        <p className={`kpi-insight-marketing-sample-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
      </div>
    </div>
  );
}
