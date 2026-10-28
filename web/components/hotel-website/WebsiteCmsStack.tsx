import {
  WEBSITE_CMS_FIT_DISCLAIMER,
  WEBSITE_CMS_FIT_NOTE,
  WEBSITE_CMS_STACK_STAGES,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteCmsFitMatrix, type WebsiteCmsFitRowView } from "./WebsiteCmsFitMatrix";
import { WebsiteCmsVisual } from "./WebsiteCmsVisual";

export function WebsiteCmsStack({
  locale,
  src,
  status,
  alt,
  lead,
  rows,
  note,
  disclaimer,
}: {
  locale: Locale;
  src?: string;
  status?: string;
  alt?: string;
  lead?: string;
  rows?: WebsiteCmsFitRowView[];
  note?: string;
  disclaimer?: string;
}) {
  const thai = locale === "th";
  return (
    <div className="web-cms-stack">
      {lead ? <p className="web-cms-lead">{lead}</p> : null}
      <WebsiteCmsVisual locale={locale} src={src} alt={alt} status={status} />
      <ol className="web-cms-path" aria-label={thai ? "เส้นทางชุดเทคโนโลยี" : "Technology architecture path"}>
        {WEBSITE_CMS_STACK_STAGES.map((stage, index) => (
          <li key={stage.id}>
            <span className="kpi-latin web-cms-path-num">{String(index + 1).padStart(2, "0")}</span>
            <span className="kpi-latin web-cms-path-label">{stage.en}</span>
          </li>
        ))}
      </ol>
      <WebsiteCmsFitMatrix locale={locale} rows={rows} />
      <p className="web-cms-note">{note?.trim() || (thai ? WEBSITE_CMS_FIT_NOTE.th : WEBSITE_CMS_FIT_NOTE.en)}</p>
      <p className="web-cms-disclaimer">{disclaimer?.trim() || (thai ? WEBSITE_CMS_FIT_DISCLAIMER.th : WEBSITE_CMS_FIT_DISCLAIMER.en)}</p>
    </div>
  );
}
