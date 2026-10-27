import { META_OBJECTIVE_BOUNDARY } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";

export function MetaObjectiveBoundary({ locale }: { locale: Locale }) {
  const thai = locale === "th";

  return (
    <aside className="ads-objective-boundary" aria-label={META_OBJECTIVE_BOUNDARY.kicker}>
      <p className="kpi-latin ads-objective-boundary__kicker">{META_OBJECTIVE_BOUNDARY.kicker}</p>
      <div className="ads-objective-boundary__grid">
        <article>
          <h3>{thai ? META_OBJECTIVE_BOUNDARY.supportTitle.th : META_OBJECTIVE_BOUNDARY.supportTitle.en}</h3>
          <ul>
            {META_OBJECTIVE_BOUNDARY.support.map((item) => (
              <li key={item} className="kpi-latin ads-objective-boundary__chip">
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article>
          <h3>{thai ? META_OBJECTIVE_BOUNDARY.approveTitle.th : META_OBJECTIVE_BOUNDARY.approveTitle.en}</h3>
          <ul>
            {META_OBJECTIVE_BOUNDARY.approve.map((item) => (
              <li key={item} className="kpi-latin ads-objective-boundary__chip ads-objective-boundary__chip--hotel">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </aside>
  );
}
