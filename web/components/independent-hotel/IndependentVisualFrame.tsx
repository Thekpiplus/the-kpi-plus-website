import type { ReactNode } from "react";
import { independentRenderableSrc, independentSampleLabel, independentShowsSampleBadge } from "@/lib/independent-hotel";
import type { Locale } from "@/lib/seo";

export function IndependentVisualFrame({
  locale,
  src,
  alt,
  label,
  caption,
  meta,
  status,
  eager,
  width,
  height,
  variant = "default",
  badge,
  children,
}: {
  locale: Locale;
  src?: string;
  alt: string;
  label: string;
  caption: string;
  meta: string;
  status?: string;
  eager?: boolean;
  width?: number;
  height?: number;
  variant?: "default" | "hero" | "wide" | "related" | "enquiry" | "assessment" | "operating" | "workflow" | "fit" | "deliverables" | "plan";
  badge?: string;
  children: ReactNode;
}) {
  const fileSrc = independentRenderableSrc(src, status);
  const displayWidth = width ?? 960;
  const displayHeight = height ?? 720;
  return (
    <figure className={`ihm-visual ihm-visual--${variant}`}>
      <div className="ihm-visual-frame">
        {fileSrc ? (
          <div className="ihm-visual-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={displayWidth}
              height={displayHeight}
              style={{ aspectRatio: `${displayWidth} / ${displayHeight}` }}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={eager ? "high" : undefined}
            />
            {independentShowsSampleBadge(status) ? (
              <span className="ihm-visual-badge">{badge || independentSampleLabel(locale)}</span>
            ) : null}
          </div>
        ) : (
          children
        )}
      </div>
      <figcaption className="ihm-visual-caption">
        <strong>{label}</strong>
        <span className="ihm-visual-meta">{meta}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
