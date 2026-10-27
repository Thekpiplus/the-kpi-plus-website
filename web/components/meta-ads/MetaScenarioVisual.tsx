import { META_SCENARIO_ROWS, META_SCENARIO_VISUAL, metaKpiTags, metaSampleLabel, metaShowsSampleBadge } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";
import type { AdsChannelCompareRow } from "./MetaScenarioMatrix";
import "./meta-ads-visuals.css";

export function MetaScenarioVisual({
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
  rows?: AdsChannelCompareRow[];
}) {
  const fileSrc = src?.trim() || "";
  const hasAsset = Boolean(fileSrc);
  const thai = locale === "th";
  const sample = metaSampleLabel(locale);
  const alt = altProp || (thai ? META_SCENARIO_VISUAL.alt.th : META_SCENARIO_VISUAL.alt.en);
  const label = labelProp || (thai ? META_SCENARIO_VISUAL.label.th : META_SCENARIO_VISUAL.label.en);
  const visualMeta = meta || (thai ? META_SCENARIO_VISUAL.meta.th : META_SCENARIO_VISUAL.meta.en);
  const visualCaption = caption || (thai ? META_SCENARIO_VISUAL.caption.th : META_SCENARIO_VISUAL.caption.en);
  const steps = (rows?.length ? rows : META_SCENARIO_ROWS).map((row) => ({
    id: row.id,
    channel: row.channel,
    kpi: "kpi" in row ? row.kpi : thai ? row.kpiTh : row.kpiEn,
    output: "output" in row ? row.output : thai ? row.outputTh : row.outputEn,
  }));

  return (
    <figure className="ads-visual ads-channel-visual">
      <div className="ads-visual-frame ads-channel-frame">
        {hasAsset ? (
          <div className="ads-channel-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={META_SCENARIO_VISUAL.displayWidth}
              height={META_SCENARIO_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {metaShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-channel-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ol className="ads-objective-map">
              {steps.map((row) => (
                <li key={row.id}>
                  <span className="kpi-latin ads-objective-map__name">{row.channel}</span>
                  <span className="ads-objective-map__kpis">
                    {metaKpiTags(row.kpi).map((tag) => (
                      <span key={tag} className="kpi-latin ads-objective-map__kpi">
                        {tag}
                      </span>
                    ))}
                  </span>
                  <span className="kpi-latin ads-objective-map__out">{row.output}</span>
                </li>
              ))}
            </ol>
            <p className="ads-mock__note">
              {thai ? "แผนที่ตัวอย่าง · ชื่อ KPI ไม่ใช่ผลโรงแรม" : "Sample map · KPI names are not a hotel result"}
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
