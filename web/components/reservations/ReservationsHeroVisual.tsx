import { ReservationDummyImage } from "@/components/reservations/ReservationDummyImage";
import {
  RESERVATIONS_HERO_CAPTION,
  RESERVATIONS_HERO_LABEL,
  RESERVATIONS_HERO_META,
  RESERVATIONS_HERO_VISUAL,
  SAMPLE_QUEUE,
  reservationsVisualAlt,
} from "@/lib/reservations";
import "./reservations-ops.css";

type ReservationsHeroVisualProps = {
  locale: "th" | "en" | "ru" | "zh";
  src?: string;
};

export function ReservationsHeroVisual({ locale, src }: ReservationsHeroVisualProps) {
  const visual = RESERVATIONS_HERO_VISUAL;
  const { recommendedSize, aspectRatio, width, height, displayWidth, displayHeight, status } = visual;
  const alt = reservationsVisualAlt(visual, locale);
  const label = locale === "th" ? RESERVATIONS_HERO_LABEL.th : RESERVATIONS_HERO_LABEL.en;
  const caption = locale === "th" ? RESERVATIONS_HERO_CAPTION.th : RESERVATIONS_HERO_CAPTION.en;

  if (src) {
    return (
      <div className="kpi-reservations-hero-visual">
        <ReservationDummyImage
          className="kpi-reservations-hero-photo"
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
          loading="eager"
        />
        <p className="kpi-reservations-hero-caption">{caption}</p>
      </div>
    );
  }

  return (
    <figure className="kpi-reservations-hero-visual">
      <div className="kpi-reservations-hero-photo reservations-ops-frame" aria-label={alt}>
        <div className="reservations-queue">
          <div className="reservations-queue__head">
            <span className="reservations-ops-badge">Sample workflow</span>
            <strong>{label}</strong>
            <small>{RESERVATIONS_HERO_META}</small>
          </div>
          <div className="reservations-queue__table">
            {SAMPLE_QUEUE.map((row) => (
              <div key={`${row.channel}-${row.status}`} className="reservations-queue__row">
                <span className="reservations-queue__guest">{row.guest}</span>
                <span className="reservations-queue__status">
                  {row.channel} · {row.status}
                </span>
                <span className={`reservations-queue__owner${row.owner === "KPI Plus" ? " is-us" : ""}`}>
                  {row.owner}
                </span>
              </div>
            ))}
          </div>
          <p className="reservations-ops-note">Redact guest and booking data before publishing</p>
        </div>
      </div>
      <figcaption className="kpi-reservations-hero-caption">{caption}</figcaption>
      <span className="sr-only">
        {recommendedSize} · {displayWidth}×{displayHeight}
      </span>
    </figure>
  );
}
