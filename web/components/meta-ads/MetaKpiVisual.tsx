import { META_KPI_GROUPS, META_KPIS, META_KPI_VISUAL, metaSampleLabel, metaShowsSampleBadge } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";
import "./meta-ads-visuals.css";

export function MetaKpiVisual({
  src,
  locale,
  caption,
  meta,
  alt: altProp,
  label: labelProp,
  status,
}: {
  src?: string;
  locale: Locale;
  caption?: string;
  meta?: string;
  alt?: string;
  label?: string;
  status?: string;
}) {
  const fileSrc = src?.trim() || "";
  const hasAsset = Boolean(fileSrc);
  const thai = locale === "th";
  const sample = metaSampleLabel(locale);
  const alt = altProp || (thai ? META_KPI_VISUAL.alt.th : META_KPI_VISUAL.alt.en);
  const label = labelProp || (thai ? META_KPI_VISUAL.label.th : META_KPI_VISUAL.label.en);
  const visualMeta = meta || (thai ? META_KPI_VISUAL.meta.th : META_KPI_VISUAL.meta.en);
  const visualCaption = caption || (thai ? META_KPI_VISUAL.caption.th : META_KPI_VISUAL.caption.en);

  return (
    <figure className="ads-visual ads-kpi-visual">
      <div className="ads-visual-frame ads-kpi-frame">
        {hasAsset ? (
          <div className="ads-kpi-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={META_KPI_VISUAL.displayWidth}
              height={META_KPI_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {metaShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-kpi-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <div className="ads-kpi-mock__groups">
              {META_KPI_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="kpi-latin ads-kpi-mock__group">{thai ? group.titleTh : group.titleEn}</p>
                  <ul className="ads-kpi-mock__slots">
                    {META_KPIS.filter((kpi) => kpi.group === group.id).map((kpi) => (
                      <li key={kpi.id} className="ads-kpi-mock__slot">
                        <span className="kpi-latin">{kpi.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="ads-mock__note">
              {thai
                ? "กรอบตัวอย่าง ไม่มีตัวเลข Reach CTR ยอดจอง หรือรายได้ และไม่ใช้ Reach เป็นผลรายได้"
                : "Sample frame, no Reach, CTR, booking, or revenue figures. Reach is not a revenue result"}
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
