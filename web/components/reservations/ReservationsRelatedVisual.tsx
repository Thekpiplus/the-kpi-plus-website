import { ReservationDummyImage } from "@/components/reservations/ReservationDummyImage";
import {
  RESERVATIONS_RELATED_LABEL,
  RESERVATIONS_RELATED_TOPICS,
  RESERVATIONS_RELATED_VISUAL,
  reservationsVisualAlt,
} from "@/lib/reservations";
import "./reservations-ops.css";

type ReservationsRelatedVisualProps = {
  locale: "th" | "en" | "ru" | "zh";
  src?: string;
  alt?: string;
  label?: string;
  status?: "real" | "approved" | "sample" | "placeholder";
};

export function ReservationsRelatedVisual({ locale, src, alt, label, status }: ReservationsRelatedVisualProps) {
  const visual = RESERVATIONS_RELATED_VISUAL;
  const { recommendedSize, aspectRatio, width, height, displayWidth, displayHeight } = visual;
  const resolvedStatus = status ?? visual.status;
  const resolvedAlt = alt || reservationsVisualAlt(visual, locale);
  const resolvedLabel = label || RESERVATIONS_RELATED_LABEL;
  const sampleLabel = locale === "th" ? "ตัวอย่างข้อมูล" : "Sample Visual";

  if (src) {
    return (
      <div className="kpi-reservations-related-visual">
        <ReservationDummyImage
          className="kpi-reservations-related-visual-photo"
          src={src}
          alt={resolvedAlt}
          label={resolvedLabel}
          recommendedSize={recommendedSize}
          ratio={aspectRatio}
          fit="contain"
          locale={locale}
          status={resolvedStatus}
          width={width}
          height={height}
          sampleLabel={sampleLabel}
        />
        <p className="kpi-reservations-related-visual-caption">{resolvedLabel}</p>
      </div>
    );
  }

  return (
    <figure className="kpi-reservations-related-visual">
      <div
        className="kpi-reservations-related-visual-photo reservations-related-visual"
        role="img"
        aria-label={`${resolvedAlt}. ${resolvedLabel}`}
        style={{ width: "100%", maxWidth: displayWidth, aspectRatio }}
      >
        <span className="reservations-ops-badge">{sampleLabel}</span>
        <strong>{resolvedLabel}</strong>
        <ol>
          {RESERVATIONS_RELATED_TOPICS.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ol>
      </div>
      <figcaption className="kpi-reservations-related-visual-caption">{resolvedLabel}</figcaption>
      <span className="sr-only">
        {recommendedSize} · {displayWidth}×{displayHeight}
      </span>
    </figure>
  );
}
