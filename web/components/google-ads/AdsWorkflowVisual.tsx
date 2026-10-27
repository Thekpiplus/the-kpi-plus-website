import { ADS_WORKFLOW_STEPS, ADS_WORKFLOW_VISUAL, adsSampleLabel, adsShowsSampleBadge } from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";
import "./google-ads-visuals.css";

export function AdsWorkflowVisual({
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
  const sample = adsSampleLabel(locale);
  const alt = altProp || (thai ? ADS_WORKFLOW_VISUAL.alt.th : ADS_WORKFLOW_VISUAL.alt.en);
  const label = labelProp || (thai ? ADS_WORKFLOW_VISUAL.label.th : ADS_WORKFLOW_VISUAL.label.en);
  const visualMeta = meta || (thai ? ADS_WORKFLOW_VISUAL.meta.th : ADS_WORKFLOW_VISUAL.meta.en);
  const visualCaption = caption || (thai ? ADS_WORKFLOW_VISUAL.caption.th : ADS_WORKFLOW_VISUAL.caption.en);

  return (
    <figure className="ads-visual ads-workflow-visual">
      <div className="ads-visual-frame ads-workflow-frame">
        {hasAsset ? (
          <div className="ads-workflow-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={ADS_WORKFLOW_VISUAL.displayWidth}
              height={ADS_WORKFLOW_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {adsShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-workflow-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ol className="ads-workflow-mock__stages">
              {ADS_WORKFLOW_STEPS.map((step) => (
                <li key={step.id} data-stage={step.id}>
                  <span className="kpi-latin">{thai ? step.titleTh : step.titleEn}</span>
                  <small>{thai ? step.changeTh : step.changeEn}</small>
                  <em className="kpi-latin">{thai ? step.outputTh : step.outputEn}</em>
                </li>
              ))}
            </ol>
            <p className="ads-mock__note">
              {thai
                ? "สิ่งที่เปลี่ยนในแต่ละขั้น ไม่ใช่รูปประชุมหรือผลบัญชีโฆษณา"
                : "What changes at each step, not a meeting photo or live ad-account result"}
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
