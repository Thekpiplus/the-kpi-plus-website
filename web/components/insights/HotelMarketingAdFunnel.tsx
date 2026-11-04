import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const COVER_BG = "/images/insights/hotel-marketing-ad-funnel-placeholder.webp";
const MAP_LABEL = "Hotel Advertising Funnel — Sample";

const STEPS = [
  "Audience/Intent",
  "Ad",
  "Landing Page",
  "Booking Engine",
  "Conversion/ROAS Review",
] as const;

const copy = {
  th: {
    label: MAP_LABEL,
    heading: "ตัวอย่างเส้นทางแคมเปญโฆษณา",
    explain:
      "ควรทบทวนผลแคมเปญในบริบทการจองและรายได้ ไม่ใช่ดูเพียง Click, Like หรือ Impression — และไม่รับประกัน ROAS หรือผลลัพธ์",
    note: "Sample · ไม่ใช่แคมเปญลูกค้า · ไม่ใช่การรับรองจาก Google หรือ Meta",
    redact:
      "หากใช้ภาพหน้าจอแพลตฟอร์ม ต้องปิดบังชื่อบัญชี ค่าใช้จ่าย Campaign ID รายละเอียด audience ข้อมูลผู้เข้าพัก และมูลค่าการจอง",
    alt: "แผนภาพตัวอย่าง Hotel Advertising Funnel จาก Audience/Intent ถึง Conversion/ROAS Review ไม่ใช่ผลงานลูกค้า",
  },
  en: {
    label: MAP_LABEL,
    heading: "Sample advertising campaign flow",
    explain:
      "Review campaign performance against booking and revenue context — not only clicks, likes, or impressions. This does not guarantee ROAS or results.",
    note: "Sample · Not a client campaign · Not a Google or Meta endorsement",
    redact:
      "If using platform screenshots, redact account name, spend, campaign IDs, audience details, guest data, and booking values.",
    alt: "Sample hotel advertising funnel from Audience/Intent to Conversion/ROAS Review. Not a client result.",
  },
} as const;

export function HotelMarketingAdFunnel({ locale }: { locale: Locale }) {
  const ui = copy[locale === "th" ? "th" : "en"];
  const backgroundSrc = existingPublicSrc(COVER_BG);

  return (
    <figure className="kpi-article-ad-funnel">
      <div className="kpi-article-ad-funnel-frame" role="img" aria-label={ui.alt}>
        {backgroundSrc ? (
          <img
            className="kpi-article-ad-funnel-bg"
            src={backgroundSrc}
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        ) : null}

        <div className="kpi-article-ad-funnel-body">
          <p className="kpi-article-ad-funnel-kicker kpi-latin">{ui.label}</p>
          <p className={`kpi-article-ad-funnel-heading${locale === "th" ? "" : " kpi-latin"}`}>{ui.heading}</p>

          <ol className="kpi-article-ad-funnel-steps kpi-latin" aria-hidden="true">
            {STEPS.map((step, index) => (
              <li key={step}>
                <span className="kpi-article-ad-funnel-step">{step}</span>
                {index < STEPS.length - 1 ? (
                  <span className="kpi-article-ad-funnel-sep" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>

          <p className={`kpi-article-ad-funnel-explain${locale === "th" ? "" : " kpi-latin"}`}>{ui.explain}</p>
          <p className={`kpi-article-ad-funnel-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
          <p className={`kpi-article-ad-funnel-redact${locale === "th" ? "" : " kpi-latin"}`}>{ui.redact}</p>
        </div>
      </div>
      <figcaption className="sr-only">{ui.alt}</figcaption>
    </figure>
  );
}
