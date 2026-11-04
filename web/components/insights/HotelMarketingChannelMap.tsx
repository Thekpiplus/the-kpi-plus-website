import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

/** Educational channel labels only — not logos or endorsements. */
const STAGES = [
  {
    id: "awareness",
    title: { th: "Awareness / Search", en: "Awareness / Search" },
    channels: ["Google Search", "Google Maps", "Social", "Ads"],
  },
  {
    id: "consideration",
    title: { th: "Consideration", en: "Consideration" },
    channels: ["Website", "Reviews", "OTA", "Metasearch"],
  },
  {
    id: "booking",
    title: { th: "Booking", en: "Booking" },
    channels: ["Direct Booking", "OTA", "Agent/B2B"],
  },
  {
    id: "post-stay",
    title: { th: "Post-stay / Return", en: "Post-stay / Return" },
    channels: ["Reviews", "CRM/Email", "Repeat visit"],
  },
] as const;

const COVER_BG = "/images/insights/hotel-marketing-channel-map-placeholder.webp";
const MAP_LABEL = "Hotel Marketing Channel Map — Sample";

const copy = {
  th: {
    label: MAP_LABEL,
    note: "ตัวอย่าง · ไม่ใช่ทุกโรงแรมใช้ทุกช่องทาง · ไม่ใช่การรับรองแบรนด์แพลตฟอร์ม",
    alt: "แผนภาพตัวอย่างช่องทาง Hotel Marketing จาก Awareness ถึง Post-stay ไม่ใช่ผลงานลูกค้า",
  },
  en: {
    label: MAP_LABEL,
    note: "Example · Not every hotel uses every channel · Not a platform endorsement",
    alt: "Sample Hotel Marketing channel map from awareness to post-stay. Not a client result.",
  },
} as const;

export function HotelMarketingChannelMap({ locale }: { locale: Locale }) {
  const ui = copy[locale === "th" ? "th" : "en"];
  const backgroundSrc = existingPublicSrc(COVER_BG);

  return (
    <figure className="kpi-article-channel-map">
      <div className="kpi-article-channel-map-frame" role="img" aria-label={ui.alt}>
        {backgroundSrc ? (
          <img
            className="kpi-article-channel-map-bg"
            src={backgroundSrc}
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        ) : null}

        <div className="kpi-article-channel-map-body">
          <p className="kpi-article-channel-map-kicker kpi-latin">{ui.label}</p>

          <ol className="kpi-article-channel-map-stages">
            {STAGES.map((stage, index) => (
              <li key={stage.id}>
                <div className="kpi-article-channel-map-stage">
                  <p className="kpi-article-channel-map-stage-title kpi-latin">
                    {stage.title[locale === "th" ? "th" : "en"]}
                  </p>
                  <ul className="kpi-article-channel-map-channels kpi-latin">
                    {stage.channels.map((channel) => (
                      <li key={channel}>{channel}</li>
                    ))}
                  </ul>
                </div>
                {index < STAGES.length - 1 ? (
                  <span className="kpi-article-channel-map-arrow" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="16" height="16" focusable="false">
                      <path
                        d="M8 2v10M4 8l4 4 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : null}
              </li>
            ))}
          </ol>

          <p className={`kpi-article-channel-map-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
        </div>
      </div>
      <figcaption className="sr-only">{ui.alt}</figcaption>
    </figure>
  );
}
