import { DummyImage } from "@/components/case-studies/DummyImage";
import type { CaseStudy } from "@/lib/case-studies";
import type { Locale } from "@/lib/seo";

export function CaseStudyCover({
  study,
  locale,
  className,
}: {
  study: CaseStudy;
  locale: Locale;
  className?: string;
}) {
  return (
    <DummyImage
      src={study.coverImage}
      alt={study.coverImageAlt || "ภาพประกอบ Case Study"}
      label="Approved hotel / case study visual"
      recommendedSize="1600 × 900 px"
      ratio="16 / 9"
      fit="cover"
      locale={locale}
      status={study.coverImageStatus}
      className={className}
    />
  );
}
