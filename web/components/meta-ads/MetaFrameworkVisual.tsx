import { META_FRAMEWORK_ROWS, META_READINESS_VISUAL, metaSampleLabel, metaShowsSampleBadge } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";
import type { AdsFrameworkRow } from "./MetaFrameworkMatrix";
import "./meta-ads-visuals.css";

export function MetaFrameworkVisual({
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
  rows?: AdsFrameworkRow[];
}) {
  const fileSrc = src?.trim() || "";
  const hasAsset = Boolean(fileSrc);
  const thai = locale === "th";
  const sample = metaSampleLabel(locale);
  const alt = altProp || (thai ? META_READINESS_VISUAL.alt.th : META_READINESS_VISUAL.alt.en);
  const label = labelProp || (thai ? META_READINESS_VISUAL.label.th : META_READINESS_VISUAL.label.en);
  const visualMeta = meta || (thai ? META_READINESS_VISUAL.meta.th : META_READINESS_VISUAL.meta.en);
  const visualCaption = caption || (thai ? META_READINESS_VISUAL.caption.th : META_READINESS_VISUAL.caption.en);
  const areas = (rows?.length ? rows : META_FRAMEWORK_ROWS).map((row) => ({
    id: row.id,
    area: row.area,
    output: "output" in row ? row.output : thai ? row.outputTh : row.outputEn,
  }));

  return (
    <figure className="ads-visual ads-framework-visual">
      <div className="ads-visual-frame ads-framework-frame">
        {hasAsset ? (
          <div className="ads-framework-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={META_READINESS_VISUAL.displayWidth}
              height={META_READINESS_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {metaShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-framework-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ol className="ads-framework-mock__areas">
              {areas.map((row) => (
                <li key={row.id}>
                  <span className="kpi-latin">{row.area}</span>
                  <small className="kpi-latin">{"output" in row ? row.output : ""}</small>
                </li>
              ))}
            </ol>
            <p className="ads-mock__note">
              {thai
                ? "กรอบตัวอย่าง ไม่ใช่ผลแคมเปญหรือยอด Reach จริง"
                : "Sample framework · not campaign results or live Reach"}
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
