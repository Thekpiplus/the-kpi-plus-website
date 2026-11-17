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

/**
 * Public case-study media frame. Missing assets stay empty (no live "SAMPLE VISUAL" copy).
 */
export function DummyImage({
  src,
  alt,
  label,
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
  const frameClass = `case-image-frame${!hasAsset ? " case-image-placeholder" : ""}${className ? ` ${className}` : ""}`;

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
          <span
            className={`case-image-placeholder__eyebrow case-image-placeholder__badge${locale === "th" ? "" : " kpi-latin"}`}
          >
            {locale === "th" ? "ตัวอย่างภาพประกอบ" : "Illustrative"}
          </span>
        ) : null}
      </figure>
    );
  }

  // Hide developer placeholders on the live site — keep aspect ratio to avoid CLS.
  return (
    <figure
      className={frameClass}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={alt || label}
      data-missing-asset="true"
    >
      <div className="case-image-placeholder__glow" aria-hidden="true" />
    </figure>
  );
}
