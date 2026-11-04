import type { Locale } from "@/lib/seo";

/** Compact echo of the cover journey — not a duplicate hero image. */
const FLOW = ["Visibility", "Consideration", "Booking", "Revenue Review"] as const;

const POINTS = [
  {
    th: "Hotel Marketing ครอบคลุมมากกว่า Paid Advertising",
    en: "Hotel Marketing includes more than paid advertising",
  },
  {
    th: "ผู้เข้าพักใช้หลาย Touchpoint ก่อนจอง",
    en: "Guests use multiple touchpoints before booking",
  },
  {
    th: "Channels, Website, Direct Booking, Distribution, บริบท Revenue และ Guest Experience ควรพิจารณาควบคู่กัน",
    en: "Channels, website, direct booking, distribution, revenue context, and guest experience should be considered together",
  },
  {
    th: "เลือกตัวชี้วัดเพื่อตอบคำถามทางธุรกิจที่เฉพาะเจาะจง",
    en: "Choose metrics to answer a specific business question",
  },
  {
    th: "เริ่มจากคอขวดปัจจุบันของโรงแรม แทนการเพิ่มทุกช่องทางพร้อมกัน",
    en: "Start with the hotel’s current bottleneck instead of adding every channel at once",
  },
] as const;

const copy = {
  th: {
    label: "สรุปเส้นทาง",
    flowLabel: "Visibility → Consideration → Booking → Revenue Review",
    pointsLabel: "จุดสำคัญจากบทความ",
    note: "สรุปจากเนื้อหาที่ยืนยันแล้ว — ไม่มีตัวเลขผลงานหรือการรับประกันผล",
  },
  en: {
    label: "Conclusion path",
    flowLabel: "Visibility → Consideration → Booking → Revenue Review",
    pointsLabel: "Core points from this article",
    note: "Recap of verified article points — no performance figures or guarantees",
  },
} as const;

export function HotelMarketingSummaryRecap({
  locale,
  points: cmsPoints,
}: {
  locale: Locale;
  /** Optional CMS recap bullets (already in the rendered language). Falls back to the built-in points. */
  points?: string[];
}) {
  const lang = locale === "th" ? "th" : "en";
  const ui = copy[lang];
  const custom = cmsPoints?.map((point) => point.trim()).filter(Boolean) ?? [];
  const items = custom.length
    ? custom.map((text) => ({ key: text, text }))
    : POINTS.map((point) => ({ key: point.en, text: point[lang] }));

  return (
    <aside className="kpi-article-summary-recap" aria-label={ui.pointsLabel}>
      <p className={`kpi-article-summary-recap-label${locale === "th" ? "" : " kpi-latin"}`}>{ui.label}</p>

      <ol className="kpi-article-summary-recap-flow kpi-latin" aria-label={ui.flowLabel}>
        {FLOW.map((step, index) => (
          <li key={step}>
            <span className="kpi-article-summary-recap-step">{step}</span>
            {index < FLOW.length - 1 ? (
              <span className="kpi-article-summary-recap-sep" aria-hidden="true">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <p className={`kpi-article-summary-recap-points-label${locale === "th" ? "" : " kpi-latin"}`}>{ui.pointsLabel}</p>
      <ul className="kpi-article-summary-recap-points">
        {items.map((item) => (
          <li key={item.key} className={locale === "th" ? undefined : "kpi-latin"}>
            {item.text}
          </li>
        ))}
      </ul>

      <p className={`kpi-article-summary-recap-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
    </aside>
  );
}
