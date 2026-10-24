import type { Locale } from "@/lib/seo";

type DummyImageProps = {
  src?: string;
  alt: string;
  label: string;
  recommendedSize?: string;
  ratio?: string;
  className?: string;
  fit?: "cover" | "contain";
  locale?: Locale;
  status?: "real" | "approved" | "sample" | "placeholder";
  width?: number;
  height?: number;
};

const SAMPLE_LABEL = {
  th: "ตัวอย่างภาพประกอบ",
  en: "SAMPLE VISUAL",
} as const;

const REPLACE_LABEL = {
  th: "เปลี่ยนเป็นไฟล์ที่ได้รับอนุมัติแล้ว",
  en: "Replace with approved asset",
} as const;

export function DummyImage({
  src,
  alt,
  label,
  recommendedSize = "1600 × 900 px",
  ratio = "16 / 9",
  className = "",
  fit = "cover",
  locale = "en",
  status = "placeholder",
  width = 1600,
  height = 900,
}: DummyImageProps) {
  const hasAsset = Boolean(src?.trim());
  const isSample = !hasAsset || status === "sample" || status === "placeholder";
  const sampleLabel = locale === "th" ? SAMPLE_LABEL.th : SAMPLE_LABEL.en;
  const replaceLabel = locale === "th" ? REPLACE_LABEL.th : REPLACE_LABEL.en;
  const recommendedLabel =
    locale === "th" ? `ขนาดแนะนำ: ${recommendedSize}` : `Recommended: ${recommendedSize}`;
  const frameClass = `case-image-frame${!hasAsset ? " case-image-placeholder" : ""}${className ? ` ${className}` : ""}`;

  // TODO: Pass src only after an approved file exists in /public. Empty src must not invent or generate an image.
  if (hasAsset) {
    return (
      <figure className={frameClass} style={{ aspectRatio: ratio }}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          width={width}
          height={height}
          style={{ objectFit: fit, width: "100%", height: "100%" }}
        />
        {isSample ? (
          <span className={`case-image-placeholder__eyebrow case-image-placeholder__badge${locale === "th" ? "" : " kpi-latin"}`}>
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
      aria-label={`${alt}. ${recommendedLabel}`}
    >
      <div className="case-image-placeholder__glow" aria-hidden="true" />
      <div className="case-image-placeholder__content">
        <span className={`case-image-placeholder__eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{sampleLabel}</span>
        <strong>{label}</strong>
        <small>{replaceLabel}</small>
        <small>{recommendedLabel}</small>
      </div>
    </figure>
  );
}
