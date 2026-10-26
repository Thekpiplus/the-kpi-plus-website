import { ReservationDummyImage } from "@/components/reservations/ReservationDummyImage";
import { ReservationScopeIcon } from "@/components/reservations/ReservationScopeIcon";
import {
  RESERVATIONS_SERVICE_MAP_LABEL,
  RESERVATIONS_SERVICE_MAP_VISUAL,
  SCOPE_ITEMS,
  reservationsVisualAlt,
} from "@/lib/reservations";
import "./reservations-ops.css";

type ReservationsServiceMapProps = {
  locale: "th" | "en" | "ru" | "zh";
  src?: string;
};

const MAP_ROWS = [
  ["inquiry", "availability", "entry", "confirm"],
  ["channel", "modify", "cancel", "report"],
] as const;

export function ReservationsServiceMap({ locale, src }: ReservationsServiceMapProps) {
  const visual = RESERVATIONS_SERVICE_MAP_VISUAL;
  const { recommendedSize, aspectRatio, width, height, displayWidth, displayHeight, status } = visual;
  const alt = reservationsVisualAlt(visual, locale);
  const sampleLabel = locale === "th" ? "ตัวอย่างแผนภาพ" : "Sample workflow";
  const byId = new Map(SCOPE_ITEMS.map((item) => [item.id, item]));

  if (src) {
    return (
      <div className="kpi-reservations-service-map">
        <ReservationDummyImage
          className="kpi-reservations-service-map-photo"
          src={src}
          alt={alt}
          label={RESERVATIONS_SERVICE_MAP_LABEL}
          recommendedSize={recommendedSize}
          ratio={aspectRatio}
          fit="contain"
          locale={locale}
          status={status}
          width={width}
          height={height}
          sampleLabel={sampleLabel}
        />
        <p className="kpi-reservations-service-map-caption">{RESERVATIONS_SERVICE_MAP_LABEL}</p>
      </div>
    );
  }

  return (
    <figure className="kpi-reservations-service-map">
      <div className="kpi-reservations-service-map-photo reservations-ops-frame" aria-label={alt}>
        <div className="reservations-service-map">
          <div className="reservations-queue__head">
            <span className="reservations-ops-badge">{sampleLabel}</span>
            <strong>{RESERVATIONS_SERVICE_MAP_LABEL}</strong>
            <small>Inquiry → Availability → Booking → Confirmation</small>
          </div>
          <div className="reservations-service-map__grid">
            {MAP_ROWS.map((row) => (
              <div key={row.join("-")} className="reservations-service-map__row">
                {row.map((id, index) => {
                  const item = byId.get(id);
                  if (!item) return null;
                  return (
                    <div key={id} className="reservations-service-map__node">
                      {index > 0 ? (
                        <span className="reservations-service-map__arrow" aria-hidden="true">
                          →
                        </span>
                      ) : null}
                      <span className="reservations-service-map__card">
                        <ReservationScopeIcon id={id} />
                        <strong>{item.titleEn}</strong>
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="reservations-ops-note">Sample workflow · agreed scope decides the live work</p>
        </div>
      </div>
      <figcaption className="kpi-reservations-service-map-caption">{RESERVATIONS_SERVICE_MAP_LABEL}</figcaption>
      <span className="sr-only">
        {recommendedSize} · {displayWidth}×{displayHeight}
      </span>
    </figure>
  );
}
