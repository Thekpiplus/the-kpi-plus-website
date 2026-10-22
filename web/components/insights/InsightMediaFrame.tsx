import type { InsightImageFit, InsightImageStatus } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const SAMPLE_LABEL = {
  th: "ตัวอย่างภาพประกอบ",
  en: "Sample Visual",
} as const;

export function InsightMediaFrame({
  src = "",
  alt,
  label,
  locale = "th",
  fit = "cover",
  status = "placeholder",
  displayWidth,
  displayHeight,
  sourceWidth,
  sourceHeight,
  lazy = true,
  priority = false,
  className = "",
  imageClassName = "",
  objectPosition,
  sampleLabel,
  fill = false,
}: {
  src?: string;
  alt: string;
  label: string;
  locale?: Locale;
  fit?: InsightImageFit;
  status?: InsightImageStatus;
  displayWidth: number;
  displayHeight: number;
  sourceWidth: number;
  sourceHeight: number;
  lazy?: boolean;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
  sampleLabel?: string;
  fill?: boolean;
}) {
  const hasAsset = Boolean(src.trim());
  const sample = !hasAsset || status === "sample" || status === "placeholder";
  const badge = sampleLabel ?? (locale === "th" ? SAMPLE_LABEL.th : SAMPLE_LABEL.en);
  const ratio = fill ? "16 / 9" : `${displayWidth} / ${displayHeight}`;

  // TODO: Pass a real src only after the approved file exists in /public. Empty src must not invent or generate an image.
  return (
    <div
      className={`kpi-insight-slot kpi-insight-slot--${fit}${sample ? " is-sample" : ""}${className ? ` ${className}` : ""}`}
      style={{ width: "100%", maxWidth: fill ? undefined : displayWidth }}
    >
      <div className="kpi-insight-slot-frame" style={{ aspectRatio: ratio }}>
        {hasAsset ? (
          <img
            src={src}
            alt={alt}
            width={sourceWidth}
            height={sourceHeight}
            sizes={`(max-width: 48rem) calc(100vw - 2rem), ${displayWidth}px`}
            loading={priority || !lazy ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "low"}
            decoding="async"
            className={imageClassName}
            style={objectPosition ? { objectPosition } : undefined}
          />
        ) : (
          <div className="kpi-insight-slot-empty" role="img" aria-label={alt}>
            <span className="kpi-insight-slot-label">{label}</span>
          </div>
        )}
        {sample ? <span className="kpi-insight-sample-label">{badge}</span> : null}
      </div>
    </div>
  );
}
