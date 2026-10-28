import {
  HOTEL_SEO_COMPARE_COLUMNS,
  HOTEL_SEO_COMPARE_ROWS,
  HOTEL_SEO_COMPARE_VISUAL,
  hotelSeoSampleLabel,
  hotelSeoShowsSampleBadge,
} from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";
import "./hotel-seo-visuals.css";

export type HotelSeoCompareRowView = {
  id: string;
  num: string;
  area: string;
  goal: string;
  prepare: string;
  sees: string;
  output: string;
};

export function HotelSeoCompareMatrix({
  locale,
  rows,
  src,
  status,
  caption,
  label: labelProp,
}: {
  locale: Locale;
  rows?: HotelSeoCompareRowView[];
  src?: string;
  status?: string;
  caption?: string;
  label?: string;
}) {
  const thai = locale === "th";
  const sample = hotelSeoSampleLabel(locale);
  const label = labelProp || (thai ? HOTEL_SEO_COMPARE_VISUAL.label.th : HOTEL_SEO_COMPARE_VISUAL.label.en);
  const meta = thai ? HOTEL_SEO_COMPARE_VISUAL.meta.th : HOTEL_SEO_COMPARE_VISUAL.meta.en;
  const visualCaption = caption || (thai ? HOTEL_SEO_COMPARE_VISUAL.caption.th : HOTEL_SEO_COMPARE_VISUAL.caption.en);
  const fileSrc = src?.trim() || "";
  const data =
    rows?.length
      ? rows
      : HOTEL_SEO_COMPARE_ROWS.map((row) => ({
          id: row.id,
          num: row.num,
          area: thai ? row.areaTh : row.areaEn,
          goal: thai ? row.goalTh : row.goalEn,
          prepare: thai ? row.prepareTh : row.prepareEn,
          sees: thai ? row.seesTh : row.seesEn,
          output: thai ? row.outputTh : row.outputEn,
        }));

  return (
    <figure className="seo-visual seo-compare-visual">
      {fileSrc ? (
        <div className="seo-visual-frame">
          <div className="seo-visual-asset">
            <img
              src={fileSrc}
              alt={thai ? HOTEL_SEO_COMPARE_VISUAL.alt.th : HOTEL_SEO_COMPARE_VISUAL.alt.en}
              width={HOTEL_SEO_COMPARE_VISUAL.displayWidth}
              height={HOTEL_SEO_COMPARE_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {hotelSeoShowsSampleBadge(status) ? <span className="seo-visual-badge">{sample}</span> : null}
          </div>
        </div>
      ) : null}
      <div className="seo-compare-matrix-frame">
        <div className="seo-compare-matrix-head">
          <span className="seo-mock__badge">{sample}</span>
          <strong>{label}</strong>
          <small>{meta}</small>
        </div>
        <ol className="seo-compare-layers" aria-hidden="true">
          {data.map((row) => (
            <li key={row.id}>
              <span>{row.area}</span>
              <small>{row.output}</small>
            </li>
          ))}
        </ol>
        <div className="seo-compare-table-wrap">
          <table className="seo-compare-table">
            <caption className="sr-only">{label}</caption>
            <thead>
              <tr>
                {HOTEL_SEO_COMPARE_COLUMNS.map((column) => (
                  <th key={column.id} scope="col">
                    {thai ? column.th : column.en}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <th scope="row">
                    <span className="kpi-latin">{row.num}</span>
                    {row.area}
                  </th>
                  <td data-label={thai ? HOTEL_SEO_COMPARE_COLUMNS[1].th : HOTEL_SEO_COMPARE_COLUMNS[1].en}>{row.goal}</td>
                  <td data-label={thai ? HOTEL_SEO_COMPARE_COLUMNS[2].th : HOTEL_SEO_COMPARE_COLUMNS[2].en}>{row.prepare}</td>
                  <td data-label={thai ? HOTEL_SEO_COMPARE_COLUMNS[3].th : HOTEL_SEO_COMPARE_COLUMNS[3].en}>{row.sees}</td>
                  <td data-label={thai ? HOTEL_SEO_COMPARE_COLUMNS[4].th : HOTEL_SEO_COMPARE_COLUMNS[4].en}>
                    <span className="seo-compare-output">{row.output}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="seo-compare-note">
          {thai
            ? "กรอบตัวอย่าง ไม่รับประกันอันดับ การปรากฏในคำตอบ AI หรือการจอง"
            : "Sample framework. Does not promise a rank, an AI appearance, or a booking."}
        </p>
      </div>
      <figcaption className="seo-visual-caption">
        <strong className="ads-hero-caption-label">{label}</strong>
        <span className="seo-visual-meta">{meta}</span>
        <span>{visualCaption}</span>
      </figcaption>
    </figure>
  );
}
