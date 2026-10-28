import { HOTEL_SEO_HELP_BOUNDARY } from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";

export type HotelSeoBoundaryView = {
  kicker?: string;
  note?: string;
  supportTitle?: string;
  approveTitle?: string;
  support?: string[];
  approve?: string[];
};

export function HotelSeoHelpBoundary({ locale, boundary }: { locale: Locale; boundary?: HotelSeoBoundaryView }) {
  const thai = locale === "th";
  const kicker = boundary?.kicker?.trim() || HOTEL_SEO_HELP_BOUNDARY.kicker;
  const note = boundary?.note?.trim() || (thai ? HOTEL_SEO_HELP_BOUNDARY.note.th : HOTEL_SEO_HELP_BOUNDARY.note.en);
  const supportTitle = boundary?.supportTitle?.trim() || (thai ? HOTEL_SEO_HELP_BOUNDARY.supportTitle.th : HOTEL_SEO_HELP_BOUNDARY.supportTitle.en);
  const approveTitle = boundary?.approveTitle?.trim() || (thai ? HOTEL_SEO_HELP_BOUNDARY.approveTitle.th : HOTEL_SEO_HELP_BOUNDARY.approveTitle.en);
  const support = boundary?.support?.filter((item) => item.trim()).length
    ? boundary.support.filter((item) => item.trim())
    : HOTEL_SEO_HELP_BOUNDARY.support.map((item) => (thai ? item.th : item.en));
  const approve = boundary?.approve?.filter((item) => item.trim()).length
    ? boundary.approve.filter((item) => item.trim())
    : HOTEL_SEO_HELP_BOUNDARY.approve.map((item) => (thai ? item.th : item.en));

  return (
    <aside className="kpi-seo-local-help-boundary" aria-label={kicker}>
      <p className="kpi-latin kpi-seo-local-help-boundary-kicker">{kicker}</p>
      <p className="kpi-seo-local-help-boundary-note">{note}</p>
      <div className="kpi-seo-local-help-boundary-grid">
        <article>
          <h3>{supportTitle}</h3>
          <ul>
            {support.map((item) => (
              <li key={item} className="kpi-latin kpi-seo-local-help-chip">
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article>
          <h3>{approveTitle}</h3>
          <ul>
            {approve.map((item) => (
              <li key={item} className="kpi-latin kpi-seo-local-help-chip kpi-seo-local-help-chip--hotel">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </aside>
  );
}
