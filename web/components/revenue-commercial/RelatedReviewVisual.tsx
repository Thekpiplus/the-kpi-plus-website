import { REVENUE_RELATED_VISUAL } from "@/lib/revenue";
import "./revenue-commercial.css";

type RelatedReviewVisualProps = {
  src?: string;
  alt?: string;
};

export function RelatedReviewVisual({ src, alt }: RelatedReviewVisualProps) {
  const hasAsset = Boolean(src?.trim());
  const label = alt?.trim() || REVENUE_RELATED_VISUAL.label;

  if (hasAsset) {
    return (
      <div className="related-review-visual">
        <img
          src={src}
          alt={label}
          width={REVENUE_RELATED_VISUAL.displayWidth}
          height={REVENUE_RELATED_VISUAL.displayHeight}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      className="related-review-visual related-review-visual--html"
      role="img"
      aria-label={label}
    >
      <span className="related-review-visual__label" aria-hidden="true">{label}</span>
      <ol className="related-review-visual__list" aria-hidden="true">
        {REVENUE_RELATED_VISUAL.topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ol>
    </div>
  );
}
