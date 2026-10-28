import type { ReactNode } from "react";
import { hotelSeoSampleLabel, hotelSeoShowsSampleBadge, HOTEL_SEO_VISUAL } from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";

export function SeoVisualFrame({
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
  frameClass,
  visualClass,
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
  frameClass: string;
  visualClass: string;
  children: ReactNode;
}) {
  const fileSrc = src?.trim() || "";
  const sample = hotelSeoSampleLabel(locale);
  return (
    <figure className={`seo-visual ${visualClass}`}>
      <div className={`seo-visual-frame ${frameClass}`}>
        {fileSrc ? (
          <div className="seo-visual-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={width || HOTEL_SEO_VISUAL.displayWidth}
              height={height || HOTEL_SEO_VISUAL.displayHeight}
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={eager ? "high" : undefined}
            />
            {hotelSeoShowsSampleBadge(status) ? <span className="seo-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          children
        )}
      </div>
      <figcaption className="seo-visual-caption">
        <strong className="ads-hero-caption-label">{label}</strong>
        <span className="seo-visual-meta">{meta}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
