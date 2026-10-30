import type { ReactNode } from "react";
import { systemsRenderableSrc, systemsSampleLabel, systemsShowsSampleBadge } from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

export function HotelSystemsVisualFrame({
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
  const fileSrc = systemsRenderableSrc(src, status);
  const displayWidth = width ?? 960;
  const displayHeight = height ?? 720;
  return (
    <figure className={`hsi-visual hsi-visual--${variant}`}>
      <div className="hsi-visual-frame">
        {fileSrc ? (
          <div className="hsi-visual-asset">
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
            {systemsShowsSampleBadge(status) ? (
              <span className="hsi-visual-badge">{badge || systemsSampleLabel(locale)}</span>
            ) : null}
          </div>
        ) : (
          children
        )}
      </div>
      <figcaption className="hsi-visual-caption">
        <strong>{label}</strong>
        <span className="hsi-visual-meta">{meta}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
