import { b2bFunnelCopy, b2bSampleLabel } from "@/lib/b2b";
import type { Locale } from "@/lib/seo";
import "./b2b-ops.css";

export function B2bFunnelVisual({
  locale,
  steps,
  caption,
}: {
  locale: Locale;
  steps?: Array<{ id: string; number: string; label: string }>;
  caption?: string;
}) {
  const sample = b2bSampleLabel(locale);
  const items = steps?.length ? steps : b2bFunnelCopy(locale);
  const title = locale === "th" ? "ตัวอย่างลำดับงานขาย B2B" : "Sample B2B sales sequence";
  const note =
    caption ||
    (locale === "th"
      ? "ลำดับงานที่ใช้คุยกับโรงแรม ไม่ใช่ผลงานของพาร์ตเนอร์รายใดรายหนึ่ง"
      : "A working sequence used with the hotel, not one partner’s results.");

  return (
    <figure className="kpi-b2b-funnel">
      <ol className="kpi-b2b-funnel-track" aria-label={title}>
        {items.map((step, index) => (
          <li key={step.id} className={`kpi-b2b-funnel-step${index % 2 ? " is-alt" : ""}`}>
            <span className="kpi-latin kpi-b2b-funnel-num">{step.number}</span>
            <strong>{step.label}</strong>
          </li>
        ))}
      </ol>
      <p className="b2b-ops-caption">
        <span className="b2b-ops-badge">{sample}</span> {note}
      </p>
    </figure>
  );
}
