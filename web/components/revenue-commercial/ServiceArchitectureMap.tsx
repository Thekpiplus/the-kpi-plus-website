import { REVENUE_SERVICE_MAP_VISUAL } from "@/lib/revenue";
import "./revenue-commercial.css";

const defaultLayers = [
  {
    id: "sources",
    title: "Data Sources",
    body: "PMS · Channel Manager · Booking Engine · OTA · Marketing",
  },
  {
    id: "view",
    title: "Commercial View",
    body: "Demand · Pricing · Channel Mix · Direct Booking",
  },
  {
    id: "action",
    title: "Action",
    body: "Rate · Restriction · Distribution · Campaign",
  },
  {
    id: "review",
    title: "Review",
    body: "Occupancy · ADR · RevPAR · Booking Pace",
  },
] as const;

type ServiceArchitectureMapProps = {
  title?: string;
  description?: string;
  statusLabel?: string;
  locale?: "th" | "en";
  src?: string;
  layers?: ReadonlyArray<{ id: string; title: string; body: string }>;
};

const mapCopy = {
  th: {
    eyebrow: "SERVICE MAP",
    title: "Revenue & Commercial Operating View",
    desc: "แหล่งข้อมูลเชื่อมไปยังมุมมองด้าน Commercial แล้วไปสู่การลงมือและทบทวน Occupancy, ADR, RevPAR และ Booking Pace",
  },
  en: {
    eyebrow: "SERVICE MAP",
    title: "Revenue & Commercial Operating View",
    desc: "Data sources connect to a commercial view, then to actions and a review of Occupancy, ADR, RevPAR, and Booking Pace.",
  },
} as const;

export function ServiceArchitectureMap({
  title,
  description,
  statusLabel = REVENUE_SERVICE_MAP_VISUAL.label,
  locale = "en",
  src,
  layers,
}: ServiceArchitectureMapProps) {
  const ui = locale === "th" ? mapCopy.th : mapCopy.en;
  const resolvedTitle = title ?? ui.title;
  const resolvedDesc = description ?? ui.desc;
  const resolvedLayers = layers ?? defaultLayers;
  const hasAsset = Boolean(src?.trim());

  return (
    <figure className="service-map-card">
      <div className="service-map-card__header">
        <div>
          <span className="service-map-card__eyebrow">{ui.eyebrow}</span>
          <h3>{resolvedTitle}</h3>
        </div>
      </div>

      {hasAsset ? (
        <div className="service-map-asset">
          <img
            src={src}
            alt={statusLabel}
            width={REVENUE_SERVICE_MAP_VISUAL.displayWidth}
            height={REVENUE_SERVICE_MAP_VISUAL.displayHeight}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : (
        <ol className="service-map-flow" aria-label={resolvedDesc}>
          {resolvedLayers.flatMap((layer, index) => {
            const item = (
              <li key={layer.id} className={`service-map-layer service-map-layer--${layer.id}`}>
                <strong className="service-map-title">{layer.title}</strong>
                <span className="service-map-body">{layer.body}</span>
              </li>
            );
            if (index === resolvedLayers.length - 1) return [item];
            return [
              item,
              <li key={`${layer.id}-arrow`} className="service-map-arrow" aria-hidden="true">
                ↓
              </li>,
            ];
          })}
        </ol>
      )}
      <figcaption className="service-map-card__status">{statusLabel}</figcaption>
    </figure>
  );
}
