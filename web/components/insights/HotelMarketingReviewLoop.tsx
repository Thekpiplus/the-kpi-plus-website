import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const COVER_BG = "/images/insights/hotel-marketing-review-management-placeholder.webp";
const MAP_LABEL = "Review-to-Operations Loop — Sample";

const STEPS = [
  "Review",
  "Categorize",
  "Identify Service Issue",
  "Assign Owner",
  "Improve Guest Experience",
  "Review Again",
] as const;

/** Theme labels only — not guest quotes or identifiable feedback. */
const THEMES = [
  { th: "เวลารอ Check-in", en: "Check-in wait time" },
  { th: "ความพร้อมของห้อง", en: "Room readiness" },
  { th: "ช่วงเวลาอาหารเช้า", en: "Breakfast timing" },
] as const;

const copy = {
  th: {
    label: MAP_LABEL,
    heading: "ตัวอย่างวงจร Review → Operations",
    themesLabel: "ตัวอย่างธีม Feedback (ไม่ระบุตัวตน)",
    explain:
      "การจัดการรีวิวไม่ใช่แค่การตอบข้อความ — ควรส่งต่อ Feedback ไปยังทีมปฏิบัติการเพื่อพัฒนาบริการ แล้วกลับมาทบทวนอีกครั้ง",
    note: "Sample · ไม่ใช่รีวิวผู้เข้าพักจริง · ไม่แสดงชื่อ รูปโปรไฟล์ หรือรายละเอียดการจอง",
    alt: "แผนภาพตัวอย่าง Review-to-Operations Loop จาก Review ถึง Review Again พร้อมธีม Feedback ที่ไม่ระบุตัวตน ไม่ใช่รีวิวลูกค้าจริง",
    caption: "ตัวอย่างกระบวนการแบบไม่ระบุตัวตน — ไม่ใช่รีวิวผู้เข้าพักจริง และไม่มีชื่อหรือรายละเอียดที่ระบุตัวตน",
  },
  en: {
    label: MAP_LABEL,
    heading: "Sample Review → Operations loop",
    themesLabel: "Sample feedback themes (anonymized)",
    explain:
      "Review management is not only writing replies — feedback can loop into hotel operations to improve guest experience, then be reviewed again.",
    note: "Sample · Not real guest reviews · No names, profile photos, or reservation details",
    alt: "Sample Review-to-Operations Loop from Review to Review Again with anonymized feedback themes. Not real guest reviews.",
    caption: "Anonymized sample process — not real guest reviews, and no names or identifying details.",
  },
} as const;

export function HotelMarketingReviewLoop({ locale }: { locale: Locale }) {
  const lang = locale === "th" ? "th" : "en";
  const ui = copy[lang];
  const backgroundSrc = existingPublicSrc(COVER_BG);

  return (
    <figure className="kpi-article-review-loop">
      <div className="kpi-article-review-loop-frame" role="img" aria-label={ui.alt}>
        {backgroundSrc ? (
          <img
            className="kpi-article-review-loop-bg"
            src={backgroundSrc}
            alt=""
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />
        ) : null}

        <div className="kpi-article-review-loop-body">
          <p className="kpi-article-review-loop-kicker kpi-latin">{ui.label}</p>
          <p className={`kpi-article-review-loop-heading${locale === "th" ? "" : " kpi-latin"}`}>{ui.heading}</p>

          <ol className="kpi-article-review-loop-steps kpi-latin" aria-hidden="true">
            {STEPS.map((step, index) => (
              <li key={step}>
                <span className="kpi-article-review-loop-step">{step}</span>
                {index < STEPS.length - 1 ? (
                  <span className="kpi-article-review-loop-sep" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>

          <div className="kpi-article-review-loop-themes" aria-hidden="true">
            <p className={`kpi-article-review-loop-themes-label${locale === "th" ? "" : " kpi-latin"}`}>{ui.themesLabel}</p>
            <ul className="kpi-article-review-loop-theme-list">
              {THEMES.map((theme) => (
                <li key={theme.en} className={locale === "th" ? undefined : "kpi-latin"}>
                  {theme[lang]}
                </li>
              ))}
            </ul>
          </div>

          <p className={`kpi-article-review-loop-explain${locale === "th" ? "" : " kpi-latin"}`}>{ui.explain}</p>
          <p className={`kpi-article-review-loop-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
        </div>
      </div>
      <figcaption className={`kpi-article-review-loop-caption${locale === "th" ? "" : " kpi-latin"}`}>{ui.caption}</figcaption>
    </figure>
  );
}
