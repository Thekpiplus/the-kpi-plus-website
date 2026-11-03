import type { ReactNode } from "react";
import {
  HOTEL_TRAINING_ENQUIRY_FLOW,
  HOTEL_TRAINING_ENQUIRY_VISUAL,
  HOTEL_TRAINING_HERO_VISUAL,
  HOTEL_TRAINING_NEEDS_FLOW,
  HOTEL_TRAINING_NEEDS_SHEET,
  HOTEL_TRAINING_NEEDS_VISUAL,
  hotelTrainingHeroPublicSrc,
  hotelTrainingIsLibraryPlaceholder,
  hotelTrainingNeedsPublicSrc,
  hotelTrainingSampleLabel,
} from "@/lib/hotel-training";
import type { Locale } from "@/lib/seo";

type CmsVisualProps = {
  src?: string;
  altTh?: string;
  altEn?: string;
  status?: string;
  label?: string;
  caption?: string;
  publicationApproved?: boolean;
};

function Frame({
  locale,
  variant,
  label,
  caption,
  alt,
  src,
  width,
  height,
  eager,
  badge,
  children,
}: {
  locale: Locale;
  variant?: "hero" | "needs" | "section";
  label: string;
  caption: string;
  alt: string;
  src?: string;
  width?: number;
  height?: number;
  eager?: boolean;
  badge?: string;
  children?: ReactNode;
}) {
  const sample = hotelTrainingSampleLabel(locale);
  const fileSrc = src?.trim() || "";
  return (
    <figure className={`ht-visual${variant === "hero" ? " ht-visual--hero" : variant === "needs" ? " ht-visual--needs" : ""}${fileSrc ? "" : " ht-visual--html"}`}>
      <div className="ht-visual-frame">
        <span className="ht-visual-badge">{badge || sample}</span>
        {fileSrc ? (
          <img
            className="ht-visual-asset"
            src={fileSrc}
            alt={alt}
            width={width}
            height={height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={eager ? "high" : undefined}
          />
        ) : (
          <div className="ht-visual-fallback" role="img" aria-label={alt}>
            {children}
          </div>
        )}
      </div>
      <figcaption className="ht-visual-caption">
        <strong>{label}</strong>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}

export function HotelTrainingHeroVisual({ locale, visual }: { locale: Locale; visual?: CmsVisualProps }) {
  const thai = locale === "th";
  const src = hotelTrainingHeroPublicSrc(visual);
  const approved = !hotelTrainingIsLibraryPlaceholder(src);
  return (
    <Frame
      locale={locale}
      variant="hero"
      src={src}
      width={HOTEL_TRAINING_HERO_VISUAL.displayWidth}
      height={HOTEL_TRAINING_HERO_VISUAL.displayHeight}
      eager
      label={
        approved && visual?.label?.trim()
          ? visual.label.trim()
          : thai
            ? HOTEL_TRAINING_HERO_VISUAL.labelTh
            : HOTEL_TRAINING_HERO_VISUAL.labelEn
      }
      caption={
        approved && visual?.caption?.trim()
          ? visual.caption.trim()
          : thai
            ? HOTEL_TRAINING_HERO_VISUAL.captionTh
            : HOTEL_TRAINING_HERO_VISUAL.captionEn
      }
      alt={
        (thai ? visual?.altTh : visual?.altEn)?.trim() ||
        (thai ? HOTEL_TRAINING_HERO_VISUAL.altTh : HOTEL_TRAINING_HERO_VISUAL.altEn)
      }
      badge={approved ? (thai ? "อนุมัติแล้ว" : "Approved") : thai ? "ตัวอย่าง" : "Sample"}
    />
  );
}

export function HotelTrainingNeedsVisual({ locale, visual }: { locale: Locale; visual?: CmsVisualProps }) {
  const thai = locale === "th";
  const src = hotelTrainingNeedsPublicSrc(visual);
  const approved = Boolean(src);
  return (
    <Frame
      locale={locale}
      variant="needs"
      src={src}
      width={HOTEL_TRAINING_NEEDS_VISUAL.displayWidth}
      height={HOTEL_TRAINING_NEEDS_VISUAL.displayHeight}
      label={
        approved && visual?.label?.trim()
          ? visual.label.trim()
          : thai
            ? HOTEL_TRAINING_NEEDS_VISUAL.labelTh
            : HOTEL_TRAINING_NEEDS_VISUAL.labelEn
      }
      caption={
        approved && visual?.caption?.trim()
          ? visual.caption.trim()
          : thai
            ? HOTEL_TRAINING_NEEDS_VISUAL.captionTh
            : HOTEL_TRAINING_NEEDS_VISUAL.captionEn
      }
      alt={
        (thai ? visual?.altTh : visual?.altEn)?.trim() ||
        (thai ? HOTEL_TRAINING_NEEDS_VISUAL.altTh : HOTEL_TRAINING_NEEDS_VISUAL.altEn)
      }
      badge={approved ? (thai ? "อนุมัติแล้ว" : "Approved") : thai ? "ตัวอย่าง / ปิดข้อมูล" : "Sample / Redacted"}
    >
      <div className="ht-needs-mock">
        <p className="ht-mock-kicker kpi-latin">Sample / Redacted</p>
        <p className="ht-mock-title">{thai ? "ลำดับสำรวจความต้องการ" : "Needs assessment sequence"}</p>
        <p className="ht-needs-path kpi-latin">
          Business Goal → Role / Skill Required → Current Skill Level → Skill Gap / Priority → Training Recommendation
        </p>
        <ol className="ht-needs-flow">
          {HOTEL_TRAINING_NEEDS_FLOW.map((step, index) => {
            const local = thai ? step.th : step.en;
            return (
              <li key={step.id}>
                <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <strong className="kpi-latin">{step.label}</strong>
                {local !== step.label ? <em>{local}</em> : null}
                <p>{thai ? step.sampleTh : step.sampleEn}</p>
              </li>
            );
          })}
        </ol>
        <div className="ht-needs-sheet">
          <p className="ht-needs-sheet-title">{thai ? HOTEL_TRAINING_NEEDS_SHEET.titleTh : HOTEL_TRAINING_NEEDS_SHEET.titleEn}</p>
          <dl>
            {HOTEL_TRAINING_NEEDS_SHEET.fields.map((field) => (
              <div key={field.id}>
                <dt>{thai ? field.labelTh : field.labelEn}</dt>
                <dd>{thai ? field.valueTh : field.valueEn}</dd>
              </div>
            ))}
          </dl>
          <p className="ht-needs-sheet-note">{thai ? HOTEL_TRAINING_NEEDS_SHEET.noteTh : HOTEL_TRAINING_NEEDS_SHEET.noteEn}</p>
        </div>
      </div>
    </Frame>
  );
}

export function HotelTrainingEnquiryVisual({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  const sample = hotelTrainingSampleLabel(locale);
  return (
    <figure className="ht-enquiry-visual">
      <div
        className="ht-enquiry-frame"
        role="img"
        aria-label={thai ? HOTEL_TRAINING_ENQUIRY_VISUAL.altTh : HOTEL_TRAINING_ENQUIRY_VISUAL.altEn}
      >
        <span className="ht-visual-badge">{sample}</span>
        <div className="ht-enquiry-process">
          <p className="ht-enquiry-path kpi-latin">Goal → Skill → Format → Confirm</p>
          <ol className="ht-enquiry-mini">
            {HOTEL_TRAINING_ENQUIRY_FLOW.map((step, index) => (
              <li key={step.id}>
                <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
                <strong className="kpi-latin">{step.label}</strong>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="ht-visual-caption">
        <strong className="kpi-latin">{thai ? HOTEL_TRAINING_ENQUIRY_VISUAL.labelTh : HOTEL_TRAINING_ENQUIRY_VISUAL.labelEn}</strong>
        <span>{thai ? HOTEL_TRAINING_ENQUIRY_VISUAL.captionTh : HOTEL_TRAINING_ENQUIRY_VISUAL.captionEn}</span>
      </figcaption>
    </figure>
  );
}

export function HotelTrainingEnquiryIntro({
  locale,
  kicker,
  heading,
  lead,
  nextTitle,
  steps,
  note,
}: {
  locale: Locale;
  kicker: string;
  heading: string;
  lead: string;
  nextTitle: string;
  steps: string[];
  note: string;
}) {
  return (
    <div className="kpi-website-enquiry-intro">
      <p className="kpi-website-enquiry-kicker kpi-latin">{kicker}</p>
      <h2 className="kpi-h2 kpi-website-enquiry-heading">{heading}</h2>
      <p className="kpi-website-enquiry-lead">{lead}</p>
      <div className="kpi-website-enquiry-next">
        <h3 className="kpi-website-enquiry-next-title kpi-latin">{nextTitle}</h3>
        <ol className="kpi-website-enquiry-points">
          {steps.map((step, index) => (
            <li key={step}>
              <span className="kpi-website-enquiry-num kpi-latin" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <HotelTrainingEnquiryVisual locale={locale} />
        <p className="kpi-website-enquiry-note">{note}</p>
      </div>
    </div>
  );
}
