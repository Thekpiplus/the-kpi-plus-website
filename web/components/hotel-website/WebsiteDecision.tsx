import { WEBSITE_DECISION_NOTE, WEBSITE_DECISION_STEPS } from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteDecisionCompare, type WebsiteDecisionPathView } from "./WebsiteDecisionCompare";
import { WebsiteDecisionVisual } from "./WebsiteDecisionVisual";

export function WebsiteDecision({
  locale,
  src,
  alt,
  status,
  lead,
  close,
  note,
  paths,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
  lead?: string;
  close?: string;
  note?: string;
  paths?: WebsiteDecisionPathView[];
}) {
  const thai = locale === "th";
  return (
    <div className="web-decision">
      {lead ? <p className="web-decision-lead">{lead}</p> : null}
      <WebsiteDecisionVisual locale={locale} src={src} alt={alt} status={status} />
      <ol className="web-decision-path" aria-label={thai ? "เส้นทางตัดสินใจปรับหรือสร้างใหม่" : "Improve or rebuild decision path"}>
        {WEBSITE_DECISION_STEPS.map((step, index) => (
          <li key={step.id}>
            <span className="kpi-latin web-decision-path-num">{String(index + 1).padStart(2, "0")}</span>
            <span className="kpi-latin web-decision-path-label">{step.en}</span>
          </li>
        ))}
      </ol>
      <WebsiteDecisionCompare locale={locale} paths={paths} />
      <p className="web-decision-note">{note?.trim() || (thai ? WEBSITE_DECISION_NOTE.th : WEBSITE_DECISION_NOTE.en)}</p>
      {close ? <p className="web-decision-close">{close}</p> : null}
    </div>
  );
}
