import { ReservationDummyImage } from "@/components/reservations/ReservationDummyImage";
import {
  RESERVATIONS_PROBLEM_LABEL,
  RESERVATIONS_PROBLEM_VISUAL,
  SAMPLE_INBOX,
  reservationsVisualAlt,
  type ReservationsVisualOverride,
} from "@/lib/reservations";
import "./reservations-ops.css";

type ReservationsProblemVisualProps = {
  locale: "th" | "en" | "ru" | "zh";
  src?: string;
  caption?: string;
  override?: ReservationsVisualOverride;
};

export function ReservationsProblemVisual({ locale, src, caption, override }: ReservationsProblemVisualProps) {
  const visual = RESERVATIONS_PROBLEM_VISUAL;
  const { recommendedSize, aspectRatio, width, height, displayWidth, displayHeight } = visual;
  const status = override?.status ?? visual.status;
  const alt = override?.alt || reservationsVisualAlt(visual, locale);
  const label = override?.label || RESERVATIONS_PROBLEM_LABEL;
  const resolvedCaption = caption || override?.caption;
  const sampleLabel = locale === "th" ? "ตัวอย่างข้อมูล" : "Sample data";

  if (src) {
    return (
      <div className="kpi-reservations-problem-visual">
        <ReservationDummyImage
          className="kpi-reservations-problem-photo"
          src={src}
          alt={alt}
          label={label}
          recommendedSize={recommendedSize}
          ratio={aspectRatio}
          fit="contain"
          locale={locale}
          status={status}
          width={width}
          height={height}
          sampleLabel={sampleLabel}
        />
        {resolvedCaption ? <p className="kpi-reservations-problem-photo-caption">{resolvedCaption}</p> : null}
      </div>
    );
  }

  return (
    <figure className="kpi-reservations-problem-visual">
      <div className="kpi-reservations-problem-photo reservations-ops-frame" aria-label={alt}>
        <div className="reservations-inbox">
          <div className="reservations-queue__head">
            <span className="reservations-ops-badge">{sampleLabel}</span>
            <strong>{label}</strong>
            <small>Sample data · Guest A / Guest B · no booking IDs</small>
          </div>
          <div className="reservations-inbox__table">
            {SAMPLE_INBOX.map((row) => (
              <div key={`${row.guest}-${row.code}`} className="reservations-inbox__row">
                <span className="reservations-queue__guest">{row.guest}</span>
                <span className="reservations-inbox__meta">
                  {row.channel} · {row.code}
                </span>
                <span className="reservations-inbox__status">{row.status}</span>
              </div>
            ))}
          </div>
          <p className="reservations-ops-note">Redact guest and booking data before publishing</p>
        </div>
      </div>
      {resolvedCaption ? <figcaption className="kpi-reservations-problem-photo-caption">{resolvedCaption}</figcaption> : null}
      <span className="sr-only">
        {recommendedSize} · {displayWidth}×{displayHeight}
      </span>
    </figure>
  );
}
