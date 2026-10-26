import "./reservations-ops.css";

type ReservationDummyImageProps = {
  src?: string;
  alt: string;
  label: string;
  recommendedSize: string;
  ratio?: string;
  fit?: "cover" | "contain";
  className?: string;
  locale?: "th" | "en" | "ru" | "zh";
  status?: "real" | "approved" | "sample" | "placeholder";
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  caption?: string;
  sampleLabel?: string;
};

const SAMPLE_LABEL = {
  th: "ตัวอย่างข้อมูล",
  en: "Sample Visual",
} as const;

const REPLACE_LABEL = {
  th: "Replace with verified asset",
  en: "Replace with verified asset",
} as const;

const REDACT_LABEL = {
  th: "Redact guest and booking data before publishing",
  en: "Redact guest and booking data before publishing",
} as const;

export function ReservationDummyImage({
  src,
  alt,
  label,
  recommendedSize,
  ratio = "16 / 9",
  fit = "cover",
  className = "",
  locale = "en",
  status = "placeholder",
  width = 1600,
  height = 900,
  loading = "lazy",
  caption,
  sampleLabel: sampleLabelProp,
}: ReservationDummyImageProps) {
  const hasAsset = Boolean(src?.trim());
  const isSample = !hasAsset || status === "sample" || status === "placeholder";
  const sampleLabel = sampleLabelProp ?? (locale === "th" ? SAMPLE_LABEL.th : SAMPLE_LABEL.en);
  const replaceLabel = locale === "th" ? REPLACE_LABEL.th : REPLACE_LABEL.en;
  const redactLabel = locale === "th" ? REDACT_LABEL.th : REDACT_LABEL.en;
  const recommendedLabel =
    locale === "th" ? `ขนาดแนะนำ: ${recommendedSize}` : `Recommended: ${recommendedSize}`;
  const frameClass = `reservation-visual-frame${hasAsset ? "" : " reservation-visual-placeholder"}${className ? ` ${className}` : ""}`;

  if (hasAsset) {
    return (
      <figure className={frameClass} style={{ aspectRatio: ratio }}>
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={loading === "eager" ? "high" : undefined}
          width={width}
          height={height}
          style={{ width: "100%", height: "100%", objectFit: fit }}
        />
        {isSample ? (
          <span className="reservation-visual-placeholder__eyebrow reservation-visual-placeholder__badge">
            {sampleLabel}
          </span>
        ) : null}
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    );
  }

  return (
    <figure
      className={frameClass}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`${alt}. ${label}. ${recommendedLabel}. ${redactLabel}`}
    >
      <div className="reservation-visual-placeholder__glow" aria-hidden="true" />
      <div className="reservation-visual-placeholder__content">
        <span className="reservation-visual-placeholder__eyebrow">{sampleLabel}</span>
        <strong>{label}</strong>
        <small>{replaceLabel}</small>
        <small>{recommendedLabel}</small>
        <small>{redactLabel}</small>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
