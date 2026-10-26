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
};

export function ReservationsRelatedVisual({ locale, src }: ReservationsRelatedVisualProps) {
  const visual = RESERVATIONS_RELATED_VISUAL;
  const { recommendedSize, aspectRatio, width, height, displayWidth, displayHeight, status } = visual;
  const alt = reservationsVisualAlt(visual, locale);
  const sampleLabel = locale === "th" ? "ตัวอย่างข้อมูล" : "Sample Visual";

  if (src) {
    return (
      <div className="kpi-reservations-related-visual">
        <ReservationDummyImage
          className="kpi-reservations-related-visual-photo"
          src={src}
          alt={alt}
          label={RESERVATIONS_RELATED_LABEL}
          recommendedSize={recommendedSize}
          ratio={aspectRatio}
          fit="contain"
          locale={locale}
          status={status}
          width={width}
          height={height}
          sampleLabel={sampleLabel}
        />
        <p className="kpi-reservations-related-visual-caption">{RESERVATIONS_RELATED_LABEL}</p>
      </div>
    );
  }

  return (
    <figure className="kpi-reservations-related-visual">
      <div
        className="kpi-reservations-related-visual-photo reservations-related-visual"
        role="img"
        aria-label={`${alt}. ${RESERVATIONS_RELATED_LABEL}`}
        style={{ width: "100%", maxWidth: displayWidth, aspectRatio }}
      >
        <span className="reservations-ops-badge">{sampleLabel}</span>
        <strong>{RESERVATIONS_RELATED_LABEL}</strong>
        <ol>
          {RESERVATIONS_RELATED_TOPICS.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ol>
      </div>
      <figcaption className="kpi-reservations-related-visual-caption">{RESERVATIONS_RELATED_LABEL}</figcaption>
      <span className="sr-only">
        {recommendedSize} · {displayWidth}×{displayHeight}
      </span>
    </figure>
  );
}
