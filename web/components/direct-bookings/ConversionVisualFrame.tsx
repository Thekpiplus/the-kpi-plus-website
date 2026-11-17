import Image from "next/image";
import type { ReactNode } from "react";
import {
  directBookingSampleLabel,
  directBookingShowsSampleBadge,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";

export function ConversionVisualFrame({
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
  variant?: "default" | "hero" | "confidence" | "friction" | "framework" | "decision" | "workflow" | "measure" | "related" | "enquiry" | "audit";
  children: ReactNode;
}) {
  const fileSrc = src?.trim() || "";
  const displayWidth = width ?? 960;
  const displayHeight = height ?? 720;
  const variantClass = variant === "default" ? "db-visual" : `db-visual db-visual--${variant}`;
  return (
    <figure className={variantClass}>
      <div className="db-visual-frame">
        {fileSrc ? (
          <div className="db-visual-asset">
            <Image
              src={fileSrc}
              alt={alt}
              width={displayWidth}
              height={displayHeight}
              sizes="(max-width: 48rem) calc(100vw - 2rem), min(36rem, 42vw)"
              priority={Boolean(eager)}
              loading={eager ? "eager" : "lazy"}
              style={{ aspectRatio: `${displayWidth} / ${displayHeight}`, width: "100%", height: "auto" }}
            />
            {directBookingShowsSampleBadge(status) ? (
              <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
            ) : null}
          </div>
        ) : (
          children
        )}
      </div>
      <figcaption className="db-visual-caption">
        <strong>{label}</strong>
        <span className="db-visual-meta">{meta}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
