import type { Locale } from "@/lib/seo";
import "./revenue-commercial.css";

type ServiceDummyImageProps = {
  src?: string;
  alt: string;
  label: string;
  recommendedSize: string;
  ratio?: string;
  fit?: "cover" | "contain";
  className?: string;
  locale?: Locale;
  status?: "real" | "approved" | "sample" | "placeholder";
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
};

const SAMPLE_LABEL = {
  th: "ตัวอย่างข้อมูล",
  en: "Sample data",
} as const;

const REPLACE_LABEL = {
  th: "เปลี่ยนเป็นไฟล์ที่ตรวจสอบแล้ว",
  en: "Replace with verified asset",
} as const;

export function ServiceDummyImage({
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
}: ServiceDummyImageProps) {
  const hasAsset = Boolean(src?.trim());
  const isSample = !hasAsset || status === "sample" || status === "placeholder";
  const sampleLabel = locale === "th" ? SAMPLE_LABEL.th : SAMPLE_LABEL.en;
  const replaceLabel = locale === "th" ? REPLACE_LABEL.th : REPLACE_LABEL.en;
  const recommendedLabel =
    locale === "th" ? `ขนาดแนะนำ: ${recommendedSize}` : `Recommended: ${recommendedSize}`;
  const frameClass = `service-visual-frame${hasAsset ? "" : " service-visual-placeholder"}${className ? ` ${className}` : ""}`;

  // TODO: Pass src only after an approved file exists in /public. Empty src must not invent or generate an image.
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
          <span className={`service-visual-placeholder__eyebrow service-visual-placeholder__badge${locale === "th" ? "" : " kpi-latin"}`}>
            {sampleLabel}
          </span>
        ) : null}
      </figure>
    );
  }

  return (
    <figure
      className={frameClass}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`${alt}. ${label}. ${recommendedLabel}`}
    >
      <div className="service-visual-placeholder__glow" aria-hidden="true" />
      <div className="service-visual-placeholder__content">
        <span className={`service-visual-placeholder__eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{sampleLabel}</span>
        <strong>{label}</strong>
        <small>{replaceLabel}</small>
        <small>{recommendedLabel}</small>
      </div>
    </figure>
  );
}
