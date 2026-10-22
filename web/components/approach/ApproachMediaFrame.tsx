import type { ReactNode } from "react";

type Fit = "cover" | "contain";

export function ApproachMediaFrame({
  src,
  alt,
  label,
  meta,
  displayWidth,
  displayHeight,
  recommendedWidth,
  recommendedHeight,
  fit,
  lazy = true,
  className = "",
  children,
}: {
  src?: string;
  alt: string;
  label: string;
  meta?: string;
  displayWidth: number;
  displayHeight: number;
  recommendedWidth: number;
  recommendedHeight: number;
  fit: Fit;
  lazy?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const hasAsset = Boolean(src?.trim());

  return (
    <figure
      className={`kpi-approach-slot kpi-approach-slot--${fit}${className ? ` ${className}` : ""}`}
      style={{ width: "100%", maxWidth: displayWidth }}
    >
      <div
        className="kpi-approach-slot-frame"
        style={{ aspectRatio: `${displayWidth} / ${displayHeight}` }}
      >
        {hasAsset ? (
          <img
            src={src}
            alt={alt}
            width={recommendedWidth}
            height={recommendedHeight}
            loading={lazy ? "lazy" : undefined}
            fetchPriority={lazy ? undefined : "high"}
          />
        ) : children ? (
          <div className="kpi-approach-slot-fallback" aria-hidden="true">
            {children}
          </div>
        ) : (
          <div className="kpi-approach-slot-empty" role="img" aria-label={alt}>
            <span className="kpi-approach-slot-label">{label}</span>
            {meta ? <span className="kpi-approach-slot-meta kpi-latin">{meta}</span> : null}
          </div>
        )}
      </div>
      {!hasAsset && children ? (
        <figcaption className="kpi-approach-slot-caption">
          <span>{label}</span>
          {meta ? <span className="kpi-latin">{meta}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
