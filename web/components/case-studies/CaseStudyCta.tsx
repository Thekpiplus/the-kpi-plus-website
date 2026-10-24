import Link from "next/link";
import type { ReactNode } from "react";
import { DummyImage } from "@/components/case-studies/DummyImage";
import { CASE_STUDY_REPORT_PREVIEW, caseStudyReportPreview } from "@/lib/case-studies-media";
import type { Locale } from "@/lib/seo";

const VALUE_POINTS = {
  th: [
    "ตรวจจุดรั่วไหลของรายได้",
    "ดูโอกาสจาก Pricing และ Distribution",
    "รับแนวทาง Action ที่นำไปใช้ต่อได้",
  ],
  en: [
    "Review where revenue may be leaking",
    "See opportunities from Pricing and Distribution",
    "Receive an Action plan you can take forward",
  ],
} as const;

export function CaseStudyCta({
  locale,
  eyebrow,
  title,
  body,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  locale: Locale;
  eyebrow: string;
  title: ReactNode;
  body: string;
  primaryHref: string;
  primaryLabel: ReactNode;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  const points = locale === "th" ? VALUE_POINTS.th : VALUE_POINTS.en;
  const preview = caseStudyReportPreview();

  return (
    <section className="kpi-cs-cta" aria-labelledby="kpi-cs-cta-title">
      <div className="kpi-section kpi-cs-cta-inner">
        <div className="kpi-cs-cta-copy">
          <p className={`kpi-cs-cta-eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{eyebrow}</p>
          <h2 id="kpi-cs-cta-title" className="kpi-h2 kpi-cs-cta-title">
            {title}
          </h2>
          <p className="kpi-cs-cta-body">{body}</p>
          <ul className={`kpi-cs-cta-points${locale === "th" ? "" : " kpi-latin"}`}>
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="kpi-actions kpi-cs-cta-actions">
            <Link href={primaryHref} className="kpi-button kpi-cs-cta-primary">
              {primaryLabel}
            </Link>
            <Link href={secondaryHref} className="kpi-button-ghost kpi-cs-cta-secondary">
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <figure className="kpi-cs-cta-preview">
          <DummyImage
            src={preview.src}
            alt={preview.alt}
            label={preview.label}
            recommendedSize="1200 × 800 px"
            ratio={CASE_STUDY_REPORT_PREVIEW.ratio}
            fit="cover"
            locale={locale}
            status={preview.status}
            width={CASE_STUDY_REPORT_PREVIEW.sourceWidth}
            height={CASE_STUDY_REPORT_PREVIEW.sourceHeight}
            className="kpi-cs-cta-preview-frame"
          />
          <figcaption className="kpi-cs-cta-preview-caption">{CASE_STUDY_REPORT_PREVIEW.label}</figcaption>
        </figure>
      </div>
    </section>
  );
}
