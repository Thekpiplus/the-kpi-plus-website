import { existingPublicSrc } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const COVER_BG = "/images/insights/hotel-marketing-vs-revenue-management-placeholder.webp";
const MAP_LABEL = "Marketing and Revenue Management Roles — Sample";

const LANES = [
  {
    id: "marketing",
    role: { th: "Marketing", en: "Marketing" },
    focus: {
      th: "Visibility / Demand / Interest / Channel content",
      en: "Visibility / Demand / Interest / Channel content",
    },
  },
  {
    id: "revenue",
    role: { th: "Revenue Management", en: "Revenue Management" },
    focus: {
      th: "Inventory / Availability / Pricing / Distribution decisions",
      en: "Inventory / Availability / Pricing / Distribution decisions",
    },
  },
  {
    id: "joint",
    role: {
      th: "Marketing + Revenue + Operations",
      en: "Marketing + Revenue + Operations",
    },
    focus: {
      th: "Review results and agree next actions",
      en: "Review results and agree next actions",
    },
  },
] as const;

const HANDOFFS = [
  {
    id: "signals",
    from: "marketing",
    text: {
      th: "share demand and channel signals",
      en: "share demand and channel signals",
    },
  },
  {
    id: "offers",
    from: "revenue",
    text: {
      th: "share sellable offers and performance context",
      en: "share sellable offers and performance context",
    },
  },
] as const;

const copy = {
  th: {
    label: MAP_LABEL,
    heading: "ตัวอย่างบทบาทแบบ Swimlane — ร่วมมือ ไม่แข่งกัน",
    explain:
      "แผนภาพนี้แสดงการประสานงานระหว่างบทบาท ไม่ได้หมายความว่าทีมใดเป็นเจ้าของผลลัพธ์ทั้งหมด และไม่ใช่โครงสร้างองค์กรที่เหมาะกับทุกโรงแรม",
    note: "Sample · ไม่ใช่ภาพประชุมทีมทั่วไป · ไม่ใช่โมเดลองค์กรบังคับ",
    alt: "แผนภาพตัวอย่างบทบาท Marketing และ Revenue Management แบบ Swimlane แสดงการร่วมมือ ไม่ใช่การแข่งขัน",
    caption: "Sample roles diagram — collaboration focus areas only; not a universal org chart or ownership of all results",
    colRole: "Role",
    colFocus: "Focus areas",
    handoffLabel: "Handoff",
  },
  en: {
    label: MAP_LABEL,
    heading: "Sample swimlane roles — collaboration, not competition",
    explain:
      "This diagram shows collaboration between roles. It does not imply that one team owns all results, or that a specific organizational model applies to every hotel.",
    note: "Sample · Not a generic team-meeting photo · Not a mandated org model",
    alt: "Sample Marketing and Revenue Management swimlane showing collaboration rather than competition",
    caption: "Sample roles diagram — collaboration focus areas only; not a universal org chart or ownership of all results",
    colRole: "Role",
    colFocus: "Focus areas",
    handoffLabel: "Handoff",
  },
} as const;

function HandoffArrow({ label }: { label: string }) {
  return (
    <div className="kpi-article-role-swim-handoff" aria-hidden="true">
      <svg className="kpi-article-role-swim-arrow" viewBox="0 0 24 28" width="20" height="24" focusable="false">
        <path
          d="M12 2v18M6 14l6 8 6-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="kpi-article-role-swim-handoff-text kpi-latin">{label}</span>
    </div>
  );
}

export function HotelMarketingRoleSwimlane({ locale }: { locale: Locale }) {
  const lang = locale === "th" ? "th" : "en";
  const ui = copy[lang];
  const backgroundSrc = existingPublicSrc(COVER_BG);
  const descId = "hotel-marketing-role-swim-desc";

  return (
    <div className="kpi-article-role-swim">
      <figure
        className="kpi-article-role-swim-figure"
        aria-labelledby="hotel-marketing-role-swim-heading"
        aria-describedby={descId}
      >
        <div className="kpi-article-role-swim-frame">
          {backgroundSrc ? (
            <img
              className="kpi-article-role-swim-bg"
              src={backgroundSrc}
              alt=""
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
          ) : null}

          <div className="kpi-article-role-swim-body">
            <p className="kpi-article-role-swim-kicker kpi-latin">{ui.label}</p>
            <p
              id="hotel-marketing-role-swim-heading"
              className={`kpi-article-role-swim-heading${locale === "th" ? "" : " kpi-latin"}`}
            >
              {ui.heading}
            </p>
            <p className="sr-only">{ui.alt}</p>

            <div className="kpi-article-role-swim-lanes">
              {LANES.map((lane, index) => (
                <div key={lane.id} className="kpi-article-role-swim-lane-block">
                  <div className={`kpi-article-role-swim-lane is-${lane.id}`}>
                    <p className="kpi-article-role-swim-role kpi-latin">{lane.role[lang]}</p>
                    <p className="kpi-article-role-swim-focus kpi-latin">{lane.focus[lang]}</p>
                  </div>
                  {index < HANDOFFS.length ? <HandoffArrow label={HANDOFFS[index].text[lang]} /> : null}
                </div>
              ))}
            </div>

            <p className={`kpi-article-role-swim-explain${locale === "th" ? "" : " kpi-latin"}`}>{ui.explain}</p>
            <p className={`kpi-article-role-swim-note${locale === "th" ? "" : " kpi-latin"}`}>{ui.note}</p>
            <p id={descId} className="sr-only">
              {ui.caption}
            </p>
          </div>
        </div>
        <figcaption className={`kpi-article-role-swim-caption${locale === "th" ? "" : " kpi-latin"}`}>{ui.caption}</figcaption>
      </figure>

      <div className="kpi-article-role-swim-table-wrap" role="region" aria-label={ui.heading} tabIndex={0}>
        <table className="kpi-article-role-swim-table">
          <caption className="sr-only">{ui.alt}</caption>
          <thead>
            <tr>
              <th scope="col">{ui.colRole}</th>
              <th scope="col">{ui.colFocus}</th>
              <th scope="col">{ui.handoffLabel}</th>
            </tr>
          </thead>
          <tbody>
            {LANES.map((lane, index) => (
              <tr key={lane.id}>
                <th scope="row" className="kpi-latin" data-label={ui.colRole}>
                  {lane.role[lang]}
                </th>
                <td className="kpi-latin" data-label={ui.colFocus}>
                  {lane.focus[lang]}
                </td>
                <td className="kpi-latin" data-label={ui.handoffLabel}>
                  {index < HANDOFFS.length ? HANDOFFS[index].text[lang] : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
