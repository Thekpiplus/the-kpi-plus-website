import { ReservationDummyImage } from "@/components/reservations/ReservationDummyImage";
import {
  RESERVATION_WORKFLOW_STEPS,
  RESERVATIONS_HANDOFF_LABEL,
  RESERVATIONS_WORKFLOW_VISUAL,
  reservationsVisualAlt,
} from "@/lib/reservations";
import "./reservations-ops.css";

type WorkflowStepView = {
  id: string;
  number: string;
  title: string;
  titleSecondary?: string;
  description: string;
  owner: string;
  input?: string;
  output: string;
  escalation?: string;
};

type ReservationsWorkflowMapProps = {
  locale: "th" | "en" | "ru" | "zh";
  src?: string;
  steps?: WorkflowStepView[];
  label?: string;
  alt?: string;
  status?: "real" | "approved" | "sample" | "placeholder";
};

const LANES = [
  { id: "us", label: "Reservation Team", x: 70, width: 720 },
  { id: "hotel", label: "Hotel", x: 830, width: 700 },
] as const;

export function ReservationsWorkflowMap({ locale, src, steps, label, alt, status }: ReservationsWorkflowMapProps) {
  const thai = locale === "th";
  const visual = RESERVATIONS_WORKFLOW_VISUAL;
  const { recommendedSize, aspectRatio, width, height, displayWidth, displayHeight } = visual;
  const resolvedStatus = status ?? visual.status;
  const resolvedAlt = alt || reservationsVisualAlt(visual, locale);
  const resolvedLabel = label || RESERVATIONS_HANDOFF_LABEL;
  const sampleLabel = thai ? "ตัวอย่างแผนภาพ" : "Sample workflow";
  const flowSteps: WorkflowStepView[] =
    steps?.length
      ? steps
      : RESERVATION_WORKFLOW_STEPS.map((step) => ({
          id: step.id,
          number: step.number,
          title: step.titleEn,
          titleSecondary: thai ? step.titleTh : undefined,
          description: thai ? step.descriptionTh : step.descriptionEn,
          owner: thai ? step.ownerTh : step.ownerEn,
          input: thai ? step.inputTh : step.inputEn,
          output: thai ? step.outputTh : step.outputEn,
          escalation: thai ? step.escalationTh : step.escalationEn,
        }));

  return (
    <div className="reservations-handoff">
      <ol className="reservations-handoff-timeline">
        {flowSteps.map((step) => {
          const shared = step.owner.includes("+");
          return (
            <li key={step.id} className="reservations-handoff-step">
              <span className="reservations-handoff-step__num kpi-latin">{step.number}</span>
              <div className="reservations-handoff-step__body">
                <h3 className="kpi-latin">{step.title}</h3>
                {step.titleSecondary ? <p className="reservations-handoff-step__title-th">{step.titleSecondary}</p> : null}
                <p className={`reservations-handoff-owner${shared ? " is-shared" : ""}`}>
                  <span className="kpi-latin">Owner</span>
                  {step.owner}
                </p>
                <dl>
                  {step.input ? (
                    <div>
                      <dt className="kpi-latin">Input</dt>
                      <dd>{step.input}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="kpi-latin">Output</dt>
                    <dd>{step.output}</dd>
                  </div>
                  {step.escalation ? (
                    <div>
                      <dt className="kpi-latin">Escalation</dt>
                      <dd>{step.escalation}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </li>
          );
        })}
      </ol>

      {src ? (
        <div className="reservations-handoff-visual">
          <ReservationDummyImage
            className="reservations-handoff-photo"
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
          <p className="reservations-handoff-caption">{resolvedLabel}</p>
        </div>
      ) : (
        <figure className="reservations-handoff-visual">
          <div className="reservations-handoff-photo reservations-ops-frame" aria-label={resolvedAlt}>
            <svg
              className="reservations-handoff-svg"
              viewBox="0 0 1600 900"
              role="img"
              aria-labelledby="reservations-handoff-title reservations-handoff-desc"
            >
              <title id="reservations-handoff-title">{resolvedLabel}</title>
              <desc id="reservations-handoff-desc">
                Reservation Team and Hotel lanes. Each step shows the owner and the handoff. Sample workflow.
              </desc>
              <rect width="1600" height="900" fill="#06182b" />
              <rect x="48" y="36" width="220" height="40" rx="20" fill="#A2DC25" />
              <text x="158" y="63" textAnchor="middle" fill="#1A3A02" fontSize="18" fontWeight="800">
                {sampleLabel.toUpperCase()}
              </text>
              <text x="48" y="118" fill="#f7fbff" fontSize="32" fontWeight="800">
                {resolvedLabel}
              </text>
              {LANES.map((lane) => (
                <g key={lane.id}>
                  <rect
                    x={lane.x}
                    y="150"
                    width={lane.width}
                    height="680"
                    rx="22"
                    fill="rgba(255,255,255,0.04)"
                    stroke="rgba(162,220,37,0.28)"
                  />
                  <text x={lane.x + 28} y="192" fill="#A2DC25" fontSize="22" fontWeight="800">
                    {lane.label}
                  </text>
                </g>
              ))}
              {flowSteps.map((step, index) => {
                const y = 230 + index * 145;
                const shared = step.owner.includes("+");
                return (
                  <g key={step.id}>
                    <rect x="96" y={y} width="668" height="118" rx="18" fill="rgba(162,220,37,0.16)" />
                    <text x="124" y={y + 42} fill="#A2DC25" fontSize="20" fontWeight="800">
                      {step.number}
                    </text>
                    <text x="176" y={y + 42} fill="#f7fbff" fontSize="24" fontWeight="700">
                      {step.title}
                    </text>
                    <text x="124" y={y + 78} fill="rgba(247,251,255,0.8)" fontSize="18">
                      {step.output}
                    </text>
                    {shared ? (
                      <>
                        <path
                          d={`M764 ${y + 59} H842`}
                          fill="none"
                          stroke="#EBE722"
                          strokeWidth="5"
                        />
                        <polygon points={`842,${y + 51} 862,${y + 59} 842,${y + 67}`} fill="#EBE722" />
                        <rect x="862" y={y} width="636" height="118" rx="18" fill="rgba(235,231,34,0.14)" />
                        <text x="890" y={y + 48} fill="#EBE722" fontSize="20" fontWeight="800">
                          Handoff
                        </text>
                        <text x="890" y={y + 82} fill="#f7fbff" fontSize="20" fontWeight="600">
                          {step.description}
                        </text>
                      </>
                    ) : (
                      <text x="890" y={y + 66} fill="rgba(247,251,255,0.45)" fontSize="18">
                        No hotel decision unless escalated
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <figcaption className="reservations-handoff-caption">{resolvedLabel}</figcaption>
          <span className="sr-only">
            {recommendedSize} · {displayWidth}×{displayHeight}
          </span>
        </figure>
      )}
    </div>
  );
}
