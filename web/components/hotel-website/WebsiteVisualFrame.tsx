import type { ReactNode } from "react";
import {
  websiteSampleLabel,
  websiteShowsSampleBadge,
  WEBSITE_VISUAL,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";

export function WebsiteVisualFrame({
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
  variant?: "default" | "hero" | "confidence" | "framework" | "cms" | "decision" | "workflow" | "measure" | "related";
  children: ReactNode;
}) {
  const fileSrc = src?.trim() || "";
  const displayWidth = width ?? WEBSITE_VISUAL.displayWidth;
  const displayHeight = height ?? WEBSITE_VISUAL.displayHeight;
  const variantClass = variant === "default" ? "web-visual" : `web-visual web-visual--${variant}`;
  return (
    <figure className={variantClass}>
      <div className="web-visual-frame">
        {fileSrc ? (
          <div className="web-visual-asset">
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
            {websiteShowsSampleBadge(status) ? (
              <span className="web-visual-badge">{websiteSampleLabel(locale)}</span>
            ) : null}
          </div>
        ) : (
          children
        )}
      </div>
      <figcaption className="web-visual-caption">
        <strong>{label}</strong>
        <span className="web-visual-meta">{meta}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
