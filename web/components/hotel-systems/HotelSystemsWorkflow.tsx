import type { CmsSystemsLine, CmsSystemsWorkflowStep } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_WORKFLOW_APPROVALS,
  SYSTEMS_WORKFLOW_FIELDS,
  SYSTEMS_WORKFLOW_GATE,
  SYSTEMS_WORKFLOW_VISUAL,
  systemsRenderableSrc,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function stepCopy(step: CmsSystemsWorkflowStep, thai: boolean) {
  return {
    id: step.id,
    num: step.num,
    label: step.label,
    title: thai ? step.titleTh || step.titleEn : step.titleEn || step.titleTh,
    body: thai ? step.bodyTh || step.bodyEn : step.bodyEn || step.bodyTh,
    owner: thai ? step.ownerTh || step.ownerEn : step.ownerEn || step.ownerTh,
    input: thai ? step.inputTh || step.inputEn : step.inputEn || step.inputTh,
    action: thai ? step.actionTh || step.bodyTh || step.actionEn : step.actionEn || step.bodyEn || step.actionTh,
    output: step.output,
    approval: thai ? step.approvalTh || step.approvalEn : step.approvalEn || step.approvalTh,
    dependency: thai ? step.dependencyTh || step.dependencyEn : step.dependencyEn || step.dependencyTh,
    next: thai ? step.nextTh || step.nextEn : step.nextEn || step.nextTh,
  };
}

export function HotelSystemsWorkflow({
  locale,
  src,
  status,
  label,
  caption,
  steps,
  approvals,
  gateTitle,
  gate,
}: {
  locale: Locale;
  src?: string;
  status?: string;
  label?: string;
  caption?: string;
  steps: CmsSystemsWorkflowStep[];
  approvals: CmsSystemsLine[];
  gateTitle?: string;
  gate?: string;
}) {
  const thai = locale === "th";
  const sample = status !== "approved" && status !== "real";
  const fileSrc = systemsRenderableSrc(src, status);
  const fields = SYSTEMS_WORKFLOW_FIELDS;
  const displayLabel = label?.trim() || SYSTEMS_WORKFLOW_VISUAL.labelEn;
  const displayCaption = caption?.trim() || (thai ? SYSTEMS_WORKFLOW_VISUAL.captionTh : SYSTEMS_WORKFLOW_VISUAL.captionEn);
  const rows = steps.map((step) => stepCopy(step, thai));
  const gateItems = approvals.length ? approvals : SYSTEMS_WORKFLOW_APPROVALS.map((item) => ({ id: item.id, th: item.th, en: item.en }));
  const gateHeading = gateTitle?.trim() || (thai ? SYSTEMS_WORKFLOW_GATE.titleTh : SYSTEMS_WORKFLOW_GATE.titleEn);
  const gateBody = gate?.trim() || (thai ? SYSTEMS_WORKFLOW_GATE.th : SYSTEMS_WORKFLOW_GATE.en);

  return (
    <div className="hsi-flow">
      <figure className="hsi-flow-figure">
        {fileSrc ? (
          <div className="hsi-flow-photo">
            <img
              src={fileSrc}
              alt={thai ? SYSTEMS_WORKFLOW_VISUAL.altTh : SYSTEMS_WORKFLOW_VISUAL.altEn}
              width={SYSTEMS_WORKFLOW_VISUAL.displayWidth}
              height={SYSTEMS_WORKFLOW_VISUAL.displayHeight}
              style={{ aspectRatio: `${SYSTEMS_WORKFLOW_VISUAL.displayWidth} / ${SYSTEMS_WORKFLOW_VISUAL.displayHeight}` }}
              loading="lazy"
              decoding="async"
            />
            {sample ? <span className="hsi-visual-badge">Hotel Systems Implementation Workflow — Sample</span> : null}
          </div>
        ) : (
          <div className="hsi-flow-board" role="img" aria-label={thai ? SYSTEMS_WORKFLOW_VISUAL.altTh : SYSTEMS_WORKFLOW_VISUAL.altEn}>
            {sample ? <span className="hsi-visual-badge">Hotel Systems Implementation Workflow — Sample</span> : null}
            <p className="hsi-mock-kicker kpi-latin">Discover · Map · Configure · Test · Handover</p>
            <p className="hsi-flow-board-title">{thai ? "ไทม์ไลน์ จุดส่งต่อ และผลลัพธ์" : "Timeline, handoff map, and deliverables"}</p>
            <ol className="hsi-flow-preview">
              {rows.map((row) => (
                <li key={row.id}>
                  <span className="kpi-latin">{row.num}</span>
                  <strong className="kpi-latin">{row.label}</strong>
                  <small className="kpi-latin">{row.output}</small>
                </li>
              ))}
            </ol>
            <ul className="hsi-flow-preview-handoff">
              {rows.map((row, index) => (
                <li key={`${row.id}-hand`}>
                  <span className="kpi-latin">{row.label}</span>
                  <strong>{row.owner}</strong>
                  {index < rows.length - 1 ? <em aria-hidden="true">→</em> : null}
                </li>
              ))}
            </ul>
          </div>
        )}
        <figcaption className="hsi-visual-caption">
          <strong>{displayLabel}</strong>
          <span className="hsi-visual-meta">{thai ? SYSTEMS_WORKFLOW_VISUAL.metaTh : SYSTEMS_WORKFLOW_VISUAL.metaEn}</span>
          <span>{displayCaption}</span>
        </figcaption>
      </figure>

      <ol className="hsi-flow-timeline" aria-label={thai ? "ไทม์ไลน์งานนำไปใช้ระบบโรงแรม" : "Hotel systems implementation timeline"}>
        {rows.map((row) => (
          <li key={`${row.id}-time`}>
            <span className="kpi-latin hsi-flow-num">{row.num}</span>
            <span className="kpi-latin hsi-flow-label">{row.label}</span>
            <strong>{row.title}</strong>
            <small className="kpi-latin">{row.output}</small>
          </li>
        ))}
      </ol>

      <div className="hsi-flow-handoff">
        <h3>{thai ? "แผนที่ส่งต่องาน" : "Handoff map"}</h3>
        <ol>
          {rows.map((row, index) => {
            const next = rows[index + 1];
            return (
              <li key={`${row.id}-map`}>
                <p className="kpi-latin">{row.num} {row.label}</p>
                <strong>{row.owner}</strong>
                <span className="kpi-latin">{row.output}</span>
                <em>{next ? (thai ? `ส่งต่อไป ${next.label}` : `Hands to ${next.label}`) : gateHeading}</em>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="hsi-flow-cards">
        {rows.map((row) => (
          <article key={`${row.id}-card`} className="hsi-flow-card">
            <p className="kpi-latin">{row.num} {row.label}</p>
            <h3>{row.title}</h3>
            <p>{row.body}</p>
            <dl>
              <div>
                <dt>{thai ? fields.owner.th : fields.owner.en}</dt>
                <dd>{row.owner}</dd>
              </div>
              <div>
                <dt>{thai ? fields.input.th : fields.input.en}</dt>
                <dd>{row.input}</dd>
              </div>
              <div>
                <dt>{thai ? fields.action.th : fields.action.en}</dt>
                <dd>{row.action}</dd>
              </div>
              <div>
                <dt>{thai ? fields.output.th : fields.output.en}</dt>
                <dd className="kpi-latin">{row.output}</dd>
              </div>
              <div>
                <dt>{thai ? fields.approval.th : fields.approval.en}</dt>
                <dd>{row.approval}</dd>
              </div>
              <div>
                <dt>{thai ? fields.dependency.th : fields.dependency.en}</dt>
                <dd>{row.dependency}</dd>
              </div>
              <div>
                <dt>{thai ? fields.next.th : fields.next.en}</dt>
                <dd>{row.next}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <aside className="hsi-flow-gate" aria-label={gateHeading}>
        <p className="kpi-latin hsi-flow-gate-kicker">{gateHeading}</p>
        <p className="kpi-latin hsi-flow-gate-quote">{SYSTEMS_WORKFLOW_GATE.en}</p>
        {thai && gateBody !== SYSTEMS_WORKFLOW_GATE.en ? <p>{gateBody}</p> : null}
        <ul>
          {gateItems.map((item) => (
            <li key={item.id}>
              {thai ? <span className="kpi-latin">{item.en}</span> : null}
              <strong>{thai ? item.th : item.en}</strong>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
