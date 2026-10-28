import { WEBSITE_FRAMEWORK_BOUNDARY } from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";

export function WebsiteFrameworkBoundary({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  const kicker = WEBSITE_FRAMEWORK_BOUNDARY.kicker;
  const note = thai ? WEBSITE_FRAMEWORK_BOUNDARY.note.th : WEBSITE_FRAMEWORK_BOUNDARY.note.en;
  const supportTitle = thai ? WEBSITE_FRAMEWORK_BOUNDARY.supportTitle.th : WEBSITE_FRAMEWORK_BOUNDARY.supportTitle.en;
  const approveTitle = thai ? WEBSITE_FRAMEWORK_BOUNDARY.approveTitle.th : WEBSITE_FRAMEWORK_BOUNDARY.approveTitle.en;
  const support = WEBSITE_FRAMEWORK_BOUNDARY.support.map((item) => (thai ? item.th : item.en));
  const approve = WEBSITE_FRAMEWORK_BOUNDARY.approve.map((item) => (thai ? item.th : item.en));

  return (
    <aside className="web-framework-boundary" aria-label={kicker}>
      <p className="kpi-latin web-framework-boundary-kicker">{kicker}</p>
      <p className="web-framework-boundary-note">{note}</p>
      <div className="web-framework-boundary-grid">
        <article>
          <h3>{supportTitle}</h3>
          <ul>
            {support.map((item) => (
              <li key={item} className="kpi-latin web-framework-chip">
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article>
          <h3>{approveTitle}</h3>
          <ul>
            {approve.map((item) => (
              <li key={item} className="kpi-latin web-framework-chip web-framework-chip--hotel">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </aside>
  );
}
