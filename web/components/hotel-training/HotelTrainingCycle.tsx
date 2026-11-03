import {
  HOTEL_TRAINING_JOURNEY_FIELDS,
  HOTEL_TRAINING_JOURNEY_VISUAL,
  hotelTrainingCopy,
  hotelTrainingSampleLabel,
} from "@/lib/hotel-training";
import type { Locale } from "@/lib/seo";

export type HotelTrainingCycleStep = {
  id: string;
  label: string;
  titleTh: string;
  titleEn: string;
  bodyTh: string;
  bodyEn: string;
  inputTh?: string;
  inputEn?: string;
  ownerTh?: string;
  ownerEn?: string;
  outputTh?: string;
  outputEn?: string;
  deliverableTh?: string;
  deliverableEn?: string;
  approvalTh?: string;
  approvalEn?: string;
  packageDependent?: boolean;
  optional?: boolean;
};

function pickLocale(thai: boolean, th?: string, en?: string) {
  return (thai ? th : en)?.trim() || "";
}

export function HotelTrainingCycle({
  locale,
  steps,
}: {
  locale: Locale;
  steps: readonly HotelTrainingCycleStep[];
}) {
  const thai = locale === "th";
  const t = thai ? hotelTrainingCopy.th : hotelTrainingCopy.en;
  const sample = hotelTrainingSampleLabel(locale);
  const fields = HOTEL_TRAINING_JOURNEY_FIELDS;
  const label = thai ? HOTEL_TRAINING_JOURNEY_VISUAL.labelTh : HOTEL_TRAINING_JOURNEY_VISUAL.labelEn;
  const path = steps.map((step) => step.label).join(" → ");
  return (
    <figure className="ht-cycle">
      <div className="ht-cycle-frame">
        <span className="ht-visual-badge">{sample}</span>
        <p className="ht-cycle-kicker kpi-latin">{label}</p>
        <p className="ht-cycle-path kpi-latin">{path}</p>
        <svg className="ht-cycle-svg" viewBox="0 0 1000 48" role="presentation" aria-hidden="true">
          <line x1="40" y1="24" x2="960" y2="24" stroke="#A2DC25" strokeWidth="3" />
          {steps.map((step, index) => {
            const x = steps.length === 1 ? 500 : 40 + (920 / Math.max(steps.length - 1, 1)) * index;
            return (
              <g key={step.id}>
                <circle cx={x} cy="24" r="14" fill="#0B6660" stroke="#EBE722" strokeWidth="2" />
                <text x={x} y="28" textAnchor="middle" fill="#EBE722" fontSize="11" fontWeight="800">
                  {String(index + 1).padStart(2, "0")}
                </text>
              </g>
            );
          })}
        </svg>
        <ol className="ht-cycle-list">
          {steps.map((step, index) => {
            const packageDependent = Boolean(step.packageDependent ?? step.optional);
            const output = pickLocale(thai, step.outputTh ?? step.deliverableTh, step.outputEn ?? step.deliverableEn);
            const meta = [
              { id: "input", label: thai ? fields.input.th : fields.input.en, value: pickLocale(thai, step.inputTh, step.inputEn) },
              { id: "owner", label: thai ? fields.owner.th : fields.owner.en, value: pickLocale(thai, step.ownerTh, step.ownerEn) },
              { id: "output", label: thai ? fields.output.th : fields.output.en, value: output },
              { id: "approval", label: thai ? fields.approval.th : fields.approval.en, value: pickLocale(thai, step.approvalTh, step.approvalEn) },
            ].filter((item) => item.value);
            return (
              <li key={step.id} className={packageDependent ? "is-optional" : undefined}>
                <span className="kpi-latin ht-cycle-num">{String(index + 1).padStart(2, "0")}</span>
                {packageDependent ? <span className="ht-status is-amber">{t.journeyOptional}</span> : null}
                <strong className="kpi-latin">{step.label}</strong>
                <h3>{thai ? step.titleTh : step.titleEn}</h3>
                <p>{thai ? step.bodyTh : step.bodyEn}</p>
                {meta.length ? (
                  <dl className="ht-cycle-meta">
                    {meta.map((item) => (
                      <div key={item.id}>
                        <dt>{item.label}</dt>
                        <dd>{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
      <figcaption className="ht-visual-caption">
        <strong>{label}</strong>
        <span>{thai ? HOTEL_TRAINING_JOURNEY_VISUAL.captionTh : HOTEL_TRAINING_JOURNEY_VISUAL.captionEn}</span>
      </figcaption>
    </figure>
  );
}
