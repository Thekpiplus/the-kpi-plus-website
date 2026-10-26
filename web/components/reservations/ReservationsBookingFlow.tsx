import { ReservationDummyImage } from "@/components/reservations/ReservationDummyImage";
import {
  BOOKING_FLOW_STEPS,
  RESERVATION_SERVICE_SETTINGS,
  RESERVATIONS_BOOKING_FLOW_LABEL,
  RESERVATIONS_BOOKING_FLOW_VISUAL,
  reservationsVisualAlt,
} from "@/lib/reservations";
import "./reservations-ops.css";

type FlowStep = { id: string; number: string; label: string };

type ReservationsBookingFlowProps = {
  locale: "th" | "en" | "ru" | "zh";
  src?: string;
  slaNote?: string;
  steps?: FlowStep[];
  label?: string;
  alt?: string;
  status?: "real" | "approved" | "sample" | "placeholder";
};

const BOXES = [
  { x: 80, y: 208 },
  { x: 580, y: 208 },
  { x: 1080, y: 208 },
  { x: 80, y: 528 },
  { x: 580, y: 528 },
  { x: 1080, y: 528 },
] as const;

const BOX_W = 440;
const BOX_H = 148;

function FlowNodeLabel({ x, y, label }: { x: number; y: number; label: string }) {
  const parts = label.split(" / ");
  if (parts.length === 1) {
    return (
      <text x={x} y={y} textAnchor="middle" fill="#f7fbff" fontSize="28" fontWeight="700">
        {label}
      </text>
    );
  }
  return (
    <text textAnchor="middle" fill="#f7fbff" fontSize="26" fontWeight="700">
      <tspan x={x} y={y - 14}>
        {parts[0]} /
      </tspan>
      <tspan x={x} y={y + 18}>
        {parts[1]}
      </tspan>
    </text>
  );
}

export function ReservationsBookingFlow({ locale, src, slaNote, steps, label, alt, status }: ReservationsBookingFlowProps) {
  const visual = RESERVATIONS_BOOKING_FLOW_VISUAL;
  const { recommendedSize, aspectRatio, width, height, displayWidth, displayHeight } = visual;
  const resolvedStatus = status ?? visual.status;
  const resolvedAlt = alt || reservationsVisualAlt(visual, locale);
  const resolvedLabel = label || RESERVATIONS_BOOKING_FLOW_LABEL;
  const flowSteps = steps?.length ? steps : BOOKING_FLOW_STEPS;
  const sampleLabel = locale === "th" ? "ตัวอย่างแผนภาพ" : "Sample workflow";
  const sequence = "Inquiry → Response → Booking → Confirmation";
  const coverNote = (
    slaNote ?? (locale === "th" ? RESERVATION_SERVICE_SETTINGS.slaTextTh : RESERVATION_SERVICE_SETTINGS.slaTextEn)
  )?.trim();

  if (src) {
    return (
      <div className="kpi-reservations-booking-flow">
        <ReservationDummyImage
          className="kpi-reservations-booking-flow-photo"
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
        <p className="kpi-reservations-booking-flow-caption">{resolvedLabel} · {sequence}</p>
        {coverNote ? <p className="kpi-reservations-booking-flow-sla">{coverNote}</p> : null}
      </div>
    );
  }

  return (
    <figure className="kpi-reservations-booking-flow">
      <div className="kpi-reservations-booking-flow-photo reservations-ops-frame">
        <div className="reservations-booking-flow-mobile-head">
          <span className="reservations-ops-badge">{sampleLabel}</span>
          <strong>{resolvedLabel}</strong>
        </div>
        <ol className="reservations-booking-flow-stack">
          {flowSteps.map((step, index) => (
            <li key={step.id}>
              {index > 0 ? (
                <svg className="reservations-booking-flow-chevron" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="#A2DC25" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              ) : null}
              <span className="reservations-booking-flow-stack__num">{step.number}</span>
              <strong>{step.label}</strong>
            </li>
          ))}
        </ol>
        <svg
          className="reservations-booking-flow-svg"
          viewBox="0 0 1600 900"
          role="img"
          aria-labelledby="reservations-booking-flow-title reservations-booking-flow-desc"
        >
          <title id="reservations-booking-flow-title">{resolvedLabel}</title>
          <desc id="reservations-booking-flow-desc">
            {sequence}. {flowSteps.map((step) => step.label).join(", ")}. Sample workflow. Hours of cover follow the
            hotel’s approved service scope.
          </desc>
          <defs>
            <marker
              id="reservations-flow-arrow"
              markerUnits="userSpaceOnUse"
              markerWidth="20"
              markerHeight="16"
              refX="18"
              refY="8"
              orient="auto"
            >
              <path d="M0 0 20 8 0 16z" fill="#A2DC25" />
            </marker>
          </defs>
          <rect width="1600" height="900" fill="#06182b" />
          <rect x="48" y="40" width="220" height="44" rx="22" fill="#A2DC25" />
          <text x="158" y="70" textAnchor="middle" fill="#1A3A02" fontSize="20" fontWeight="800">
            {sampleLabel.toUpperCase()}
          </text>
          <text x="48" y="128" fill="#f7fbff" fontSize="36" fontWeight="800">
            {resolvedLabel}
          </text>
          <text x="48" y="168" fill="rgba(247,251,255,0.7)" fontSize="22" fontWeight="600">
            {sequence}
          </text>
          {flowSteps.map((step, index) => {
            const box = BOXES[index];
            if (!box) return null;
            const cx = box.x + BOX_W / 2;
            return (
              <g key={step.id}>
                <rect
                  x={box.x}
                  y={box.y}
                  width={BOX_W}
                  height={BOX_H}
                  rx="22"
                  fill="rgba(255,255,255,0.06)"
                  stroke="rgba(162,220,37,0.35)"
                />
                <circle cx={box.x + 42} cy={box.y + 42} r="22" fill="#A2DC25" />
                <text x={box.x + 42} y={box.y + 49} textAnchor="middle" fill="#1A3A02" fontSize="18" fontWeight="800">
                  {step.number}
                </text>
                <FlowNodeLabel x={cx} y={box.y + 96} label={step.label} />
              </g>
            );
          })}
          <path
            d="M528 282 H562"
            fill="none"
            stroke="#A2DC25"
            strokeWidth="5"
            markerEnd="url(#reservations-flow-arrow)"
          />
          <path
            d="M1028 282 H1062"
            fill="none"
            stroke="#A2DC25"
            strokeWidth="5"
            markerEnd="url(#reservations-flow-arrow)"
          />
          <path
            d="M1300 360 V448 H300 V510"
            fill="none"
            stroke="#A2DC25"
            strokeWidth="5"
            markerEnd="url(#reservations-flow-arrow)"
          />
          <path
            d="M528 602 H562"
            fill="none"
            stroke="#A2DC25"
            strokeWidth="5"
            markerEnd="url(#reservations-flow-arrow)"
          />
          <path
            d="M1028 602 H1062"
            fill="none"
            stroke="#A2DC25"
            strokeWidth="5"
            markerEnd="url(#reservations-flow-arrow)"
          />
          <text x="48" y="848" fill="rgba(247,251,255,0.72)" fontSize="20" fontWeight="500">
            Sample workflow · hours of cover follow the hotel’s approved service scope
          </text>
        </svg>
      </div>
      <figcaption className="kpi-reservations-booking-flow-caption">{resolvedLabel} · {sequence}</figcaption>
      {coverNote ? <p className="kpi-reservations-booking-flow-sla">{coverNote}</p> : null}
      <span className="sr-only">
        {recommendedSize} · {displayWidth}×{displayHeight}
      </span>
    </figure>
  );
}
