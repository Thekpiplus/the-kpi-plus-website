import { WEBSITE_HERO_VISUAL, websiteSampleLabel } from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteVisualFrame } from "./WebsiteVisualFrame";

const FLOW = [
  { en: "Home", th: "หน้าแรก" },
  { en: "Room Detail", th: "รายละเอียดห้องพัก" },
  { en: "Offer / Policy", th: "ข้อเสนอ / นโยบาย" },
  { en: "Booking Engine", th: "ระบบจอง" },
] as const;

export function WebsiteHeroVisual({
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
      alt={alt || (thai ? WEBSITE_HERO_VISUAL.altTh : WEBSITE_HERO_VISUAL.altEn)}
      label={thai ? WEBSITE_HERO_VISUAL.labelTh : WEBSITE_HERO_VISUAL.labelEn}
      caption={thai ? WEBSITE_HERO_VISUAL.captionTh : WEBSITE_HERO_VISUAL.captionEn}
      meta={thai ? WEBSITE_HERO_VISUAL.metaTh : WEBSITE_HERO_VISUAL.metaEn}
      status={status || WEBSITE_HERO_VISUAL.status}
      width={WEBSITE_HERO_VISUAL.displayWidth}
      height={WEBSITE_HERO_VISUAL.displayHeight}
      variant="hero"
      eager
    >
      <div className="web-hero-mock" role="img" aria-label={thai ? WEBSITE_HERO_VISUAL.altTh : WEBSITE_HERO_VISUAL.altEn}>
        <span className="web-visual-badge">{websiteSampleLabel(locale)}</span>
        <p className="web-hero-mock-kicker kpi-latin">Sample Website</p>
        <p className="web-hero-mock-title kpi-latin">Hotel Website Direct Booking Flow</p>
        <div className="web-hero-mock-devices" aria-hidden="true">
          <div className="web-hero-mock-desktop">
            <span className="web-hero-mock-chrome" />
            <span className="web-hero-mock-photo" />
            <span className="web-hero-mock-cta kpi-latin">Book</span>
          </div>
          <div className="web-hero-mock-phone">
            <span className="web-hero-mock-chrome" />
            <span className="web-hero-mock-photo" />
            <span className="web-hero-mock-cta kpi-latin">Book</span>
          </div>
        </div>
        <ol className="web-hero-mock-flow">
          {FLOW.map((step, index) => (
            <li key={step.en}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <span className={thai ? undefined : "kpi-latin"}>{thai ? step.th : step.en}</span>
            </li>
          ))}
        </ol>
      </div>
    </WebsiteVisualFrame>
  );
}
