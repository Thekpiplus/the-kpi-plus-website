import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const COVER_BG = "/images/insights/hotel-marketing-social-content-placeholder.webp";
const MAP_LABEL = "Hotel Social Content Pillars — Sample";

/** Example pillars only when a property can actually offer them — not invented experiences. */
const PILLARS = [
  {
    id: "stay",
    title: { th: "Stay / Rooms", en: "Stay / Rooms" },
    detail: {
      th: "ห้องพัก มุมพักผ่อน และประสบการณ์เข้าพักจริงของโรงแรม",
      en: "Rooms, rest spaces, and the hotel’s real stay experience",
    },
  },
  {
    id: "fb",
    title: { th: "Food & Beverage", en: "Food & Beverage" },
    detail: {
      th: "อาหาร เครื่องดื่ม หรือเมนูที่มีให้บริการจริง",
      en: "Food, drink, or menus the property actually serves",
    },
  },
  {
    id: "local",
    title: { th: "Local Experiences", en: "Local Experiences" },
    detail: {
      th: "จุดหมายใกล้เคียงหรือประสบการณ์ท้องถิ่นที่แนะนำได้จริง",
      en: "Nearby places or local experiences the hotel can genuinely recommend",
    },
  },
  {
    id: "wellness",
    title: { th: "Wellness / Activities", en: "Wellness / Activities" },
    detail: {
      th: "กิจกรรมหรือ wellness ที่มีในโรงแรมหรือพันธมิตรจริง",
      en: "Wellness or activities available at the hotel or with real partners",
    },
  },
  {
    id: "bts",
    title: { th: "Behind the Scenes / Service", en: "Behind the Scenes / Service" },
    detail: {
      th: "ทีมงานและการบริการที่สะท้อนการทำงานจริง",
      en: "Team and service moments that reflect real operations",
    },
  },
] as const;

const copy = {
  th: {
    label: MAP_LABEL,
    heading: "ตัวอย่าง Content Pillars สำหรับโรงแรม",
    explain:
      "เลือกเสาเนื้อหาเฉพาะสิ่งที่โรงแรมมอบได้จริง — ใช้รูปที่ได้รับอนุญาต ไม่ใช้ภาพสมมติที่อาจทำให้เข้าใจผิด และไม่ใสตัวเลข engagement / followers / ผลแคมเปญที่ไม่มีหลักฐาน",
    note: "Sample · ไม่ใช่ปฏิทินหรือผลงานลูกค้า · ไม่ invent metrics",
    alt: "แผนภาพตัวอย่าง Content Pillars สำหรับ Social Media ของโรงแรม ไม่ใช่ผลงานลูกค้า",
  },
  en: {
    label: MAP_LABEL,
    heading: "Sample hotel content pillars",
    explain:
      "Use pillars only for experiences the property can actually offer — approved photos only, no invented imagery, and no unverified engagement, follower, or campaign metrics.",
    note: "Sample · Not a client calendar or result · No invented metrics",
    alt: "Sample hotel social content pillar matrix. Not a client result.",
  },
} as const;

export function HotelMarketingSocialPillars({ locale }: { locale: Locale }) {
  const ui = copy[locale === "th" ? "th" : "en"];
  const lang = locale === "th" ? "th" : "en";
  const backgroundSrc = existingPublicSrc(COVER_BG);

  return (
    <figure className="kpi-article-social-pillars">
      <div className="kpi-article-social-pillars-frame" role="img" aria-label={ui.alt}>
        {backgroundSrc ? (
          <img
            className="kpi-article-social-pillars-bg"
            src={backgroundSrc}
            alt=""
            width={1200}
            height={1200}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        ) : null}

        <div className="kpi-article-social-pillars-body">
          <p className="kpi-article-social-pillars-kicker kpi-latin">{ui.label}</p>
          <p className={`kpi-article-social-pillars-heading${locale === "th" ? "" : " kpi-latin"}`}>{ui.heading}</p>

          <ul className="kpi-article-social-pillars-grid">
            {PILLARS.map((pillar, index) => (
              <li key={pillar.id} className="kpi-article-social-pillars-tile">
                <span className="kpi-article-social-pillars-num kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <p className={`kpi-article-social-pillars-title kpi-latin`}>{pillar.title[lang]}</p>
                <p className={`kpi-article-social-pillars-detail${locale === "th" ? "" : " kpi-latin"}`}>{pillar.detail[lang]}</p>
              </li>
            ))}
          </ul>

          <p className={`kpi-article-social-pillars-explain${locale === "th" ? "" : " kpi-latin"}`}>{ui.explain}</p>
          <p className={`kpi-article-social-pillars-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
        </div>
      </div>
      <figcaption className="sr-only">{ui.alt}</figcaption>
    </figure>
  );
}
