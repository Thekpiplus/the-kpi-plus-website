import { META_HOTEL_SCENARIO_ROWS, META_HOTEL_SCENARIO_VISUAL, metaSampleLabel, metaShowsSampleBadge } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";
import type { AdsHotelScenarioRow } from "./MetaHotelScenarioMatrix";
import "./meta-ads-visuals.css";

export function MetaHotelScenarioVisual({
  src,
  locale,
  caption,
  meta,
  alt: altProp,
  label: labelProp,
  status,
  rows,
}: {
  src?: string;
  locale: Locale;
  caption?: string;
  meta?: string;
  alt?: string;
  label?: string;
  status?: string;
  rows?: AdsHotelScenarioRow[];
}) {
  const fileSrc = src?.trim() || "";
  const hasAsset = Boolean(fileSrc);
  const thai = locale === "th";
  const sample = metaSampleLabel(locale);
  const alt = altProp || (thai ? META_HOTEL_SCENARIO_VISUAL.alt.th : META_HOTEL_SCENARIO_VISUAL.alt.en);
  const label = labelProp || (thai ? META_HOTEL_SCENARIO_VISUAL.label.th : META_HOTEL_SCENARIO_VISUAL.label.en);
  const visualMeta = meta || (thai ? META_HOTEL_SCENARIO_VISUAL.meta.th : META_HOTEL_SCENARIO_VISUAL.meta.en);
  const visualCaption = caption || (thai ? META_HOTEL_SCENARIO_VISUAL.caption.th : META_HOTEL_SCENARIO_VISUAL.caption.en);
  const cells = (rows?.length ? rows : META_HOTEL_SCENARIO_ROWS).map((row) => ({
    id: row.id,
    situation: "situation" in row ? row.situation : thai ? row.situationTh : row.situationEn,
    action: "action" in row ? row.action : thai ? row.actionTh : row.actionEn,
    output: "output" in row ? row.output : thai ? row.outputTh : row.outputEn,
  }));

  return (
    <figure className="ads-visual ads-channel-visual ads-hotel-scenario-visual">
      <div className="ads-visual-frame ads-channel-frame ads-hotel-scenario-frame">
        {hasAsset ? (
          <div className="ads-channel-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={META_HOTEL_SCENARIO_VISUAL.displayWidth}
              height={META_HOTEL_SCENARIO_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {metaShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-hotel-scenario-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ol className="ads-hotel-scenario-map">
              {cells.map((row) => (
                <li key={row.id}>
                  <span className="ads-hotel-scenario-map__name">{row.situation}</span>
                  <small className="kpi-latin">{row.action}</small>
                  <span className="kpi-latin ads-objective-map__out">{row.output}</span>
                </li>
              ))}
            </ol>
            <p className="ads-mock__note">
              {thai ? "แผนที่ตัวอย่าง · ไม่ใช่รูปโรงแรมหรือรูปบุคคล" : "Sample map · not a hotel or person photo"}
            </p>
          </div>
        )}
      </div>
      <figcaption className="ads-visual-caption">
        <strong className="ads-hero-caption-label">{label}</strong>
        <span className="ads-visual-meta">{visualMeta}</span>
        <span>{visualCaption}</span>
      </figcaption>
    </figure>
  );
}
