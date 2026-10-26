import { Fragment, useId } from "react";
import { reservationFlowStepsFor, type ReservationFlowStep } from "@/lib/reservations";
import "./reservations-ops.css";

type ReservationFlowProps = {
  locale?: "th" | "en" | "ru" | "zh";
  steps?: ReservationFlowStep[];
  statusLabel?: string;
  title?: string;
};

export function ReservationFlow({
  locale = "en",
  steps,
  statusLabel,
  title,
}: ReservationFlowProps) {
  const headingId = useId();
  const resolvedSteps = steps ?? reservationFlowStepsFor(locale);
  const resolvedTitle = title ?? (locale === "th" ? "จากคำถามถึงการยืนยัน" : "Inquiry to Confirmation");
  const resolvedStatus =
    statusLabel ?? (locale === "th" ? "ตัวอย่างแผนภาพ · ขอบเขตจริงขึ้นกับข้อตกลง" : "Sample workflow");
  const outputPrefix = locale === "th" ? "ผลลัพธ์" : "Output";

  return (
    <section className="reservation-flow-card" aria-labelledby={headingId}>
      <div className="reservation-flow-card__header">
        <div>
          <span className="reservation-flow-card__eyebrow">RESERVATION FLOW</span>
          <h3 id={headingId}>{resolvedTitle}</h3>
        </div>
        <span className="reservation-flow-card__status">{resolvedStatus}</span>
      </div>

      <div className="reservation-flow-grid">
        {resolvedSteps.map((step, index) => (
          <Fragment key={step.number}>
            <article className="reservation-flow-step">
              <span className="reservation-flow-step__number">{step.number}</span>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
              <span className="reservation-flow-step__output">
                {outputPrefix}: {step.output}
              </span>
            </article>
            {index < resolvedSteps.length - 1 ? (
              <span className="reservation-flow-arrow" aria-hidden="true">
                →
              </span>
            ) : null}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
