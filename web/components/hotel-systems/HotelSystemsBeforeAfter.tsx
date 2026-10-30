import type { CmsSystemsBeforeAfterField } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_BEFORE_AFTER_ISSUES,
  SYSTEMS_BEFORE_AFTER_NOTE,
  SYSTEMS_BEFORE_AFTER_SYSTEMS,
  SYSTEMS_MODEL_STEPS,
  SYSTEMS_MODEL_VISUAL,
  systemsLandscapeStatus,
  systemsRenderableSrc,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function fieldCopy(item: CmsSystemsBeforeAfterField, thai: boolean) {
  const status = systemsLandscapeStatus(item.status);
  return {
    title: thai ? item.titleTh || item.titleEn : item.titleEn || item.titleTh,
    body: thai ? item.bodyTh || item.bodyEn : item.bodyEn || item.bodyTh,
    owner: thai ? item.ownerTh || item.ownerEn : item.ownerEn || item.ownerTh,
    status,
  };
}

export function HotelSystemsBeforeAfter({
  locale,
  src,
  status,
  label,
  caption,
  note,
  steps,
  fields,
}: {
  locale: Locale;
  src?: string;
  status?: string;
  label?: string;
  caption?: string;
  note?: string;
  steps: ReadonlyArray<{ id: string; num: string; label: string; titleTh: string; titleEn: string; output: string }>;
  fields: CmsSystemsBeforeAfterField[];
}) {
  const thai = locale === "th";
  const sample = status !== "approved" && status !== "real";
  const fileSrc = systemsRenderableSrc(src, status);
  const displayLabel = label?.trim() || SYSTEMS_MODEL_VISUAL.labelEn;
  const displayCaption = caption?.trim() || (thai ? SYSTEMS_MODEL_VISUAL.captionTh : SYSTEMS_MODEL_VISUAL.captionEn);
  const displayNote = note?.trim() || (thai ? SYSTEMS_BEFORE_AFTER_NOTE.th : SYSTEMS_BEFORE_AFTER_NOTE.en);
  const afterSteps = steps.length ? steps : [...SYSTEMS_MODEL_STEPS];

  return (
    <div className="hsi-ba">
      <figure className="hsi-ba-figure">
        {fileSrc ? (
          <div className="hsi-ba-photo">
            <img
              src={fileSrc}
              alt={thai ? SYSTEMS_MODEL_VISUAL.altTh : SYSTEMS_MODEL_VISUAL.altEn}
              width={SYSTEMS_MODEL_VISUAL.displayWidth}
              height={SYSTEMS_MODEL_VISUAL.displayHeight}
              style={{ aspectRatio: `${SYSTEMS_MODEL_VISUAL.displayWidth} / ${SYSTEMS_MODEL_VISUAL.displayHeight}` }}
              loading="lazy"
              decoding="async"
            />
            {sample ? <span className="hsi-visual-badge">Disconnected Systems to Managed Data Flow — Sample</span> : null}
          </div>
        ) : (
          <div className="hsi-ba-board" role="img" aria-label={thai ? SYSTEMS_MODEL_VISUAL.altTh : SYSTEMS_MODEL_VISUAL.altEn}>
            {sample ? <span className="hsi-visual-badge">Disconnected Systems to Managed Data Flow — Sample</span> : null}
            <p className="hsi-mock-kicker kpi-latin">Before: disconnected tools · After: managed and verified within agreed scope</p>
            <div className="hsi-ba-grid">
              <article className="hsi-ba-pane is-before">
                <p className="hsi-ba-kicker kpi-latin">Before</p>
                <h3 className="hsi-ba-pane-title">{thai ? "หลายระบบ แต่ยังไม่ใช่เส้นทางเดียวกัน" : "Several systems, not one workflow"}</h3>
                <ul className="hsi-ba-systems">
                  {SYSTEMS_BEFORE_AFTER_SYSTEMS.map((item, index) => (
                    <li key={item.id}>
                      {index ? <span aria-hidden="true">+</span> : null}
                      <strong className="kpi-latin">{thai ? item.th : item.en}</strong>
                    </li>
                  ))}
                </ul>
                <ul className="hsi-ba-issues">
                  {SYSTEMS_BEFORE_AFTER_ISSUES.map((item) => (
                    <li key={item.id}>{thai ? item.th : item.en}</li>
                  ))}
                </ul>
              </article>
              <article className="hsi-ba-pane is-after">
                <p className="hsi-ba-kicker kpi-latin">After</p>
                <h3 className="hsi-ba-pane-title">
                  {thai ? "เส้นทางที่จัดการและตรวจแล้วในขอบเขตที่ตกลง" : "Managed and verified within the agreed scope"}
                </h3>
                <ol className="hsi-ba-flow">
                  {afterSteps.map((step, index) => {
                    const title = thai ? step.titleTh || step.titleEn : step.titleEn || step.titleTh;
                    return (
                      <li key={step.id}>
                        {index ? (
                          <span className="hsi-ba-flow-arrow" aria-hidden="true">
                            ↓
                          </span>
                        ) : null}
                        <span className="hsi-ba-flow-card">
                          <span className="kpi-latin">{step.label}</span>
                          {title && title !== step.label ? <small>{title}</small> : null}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <p className="hsi-ba-scope">
                  {thai
                    ? "ไม่ได้หมายความว่าระบบทุกตัวทำงานอัตโนมัติครบ"
                    : "It does not mean every system is fully automated."}
                </p>
              </article>
            </div>
          </div>
        )}
        <figcaption className="hsi-visual-caption">
          <strong>{displayLabel}</strong>
          <span className="hsi-visual-meta">{thai ? SYSTEMS_MODEL_VISUAL.metaTh : SYSTEMS_MODEL_VISUAL.metaEn}</span>
          <span>{displayCaption}</span>
        </figcaption>
      </figure>

      <div className="hsi-ba-table-wrap">
        <table className="hsi-ba-table">
          <caption className="sr-only">
            {thai
              ? "ตารางตัวอย่างสิ่งที่เชื่อมแล้ว สิ่งที่ต้องจับคู่ สิ่งที่ต้องให้ผู้ให้บริการสนับสนุน สิ่งที่ยังทำด้วยคน และผู้รับงานถัดไป ไม่ใช่สถานะโรงแรมจริง"
              : "Sample table of what is connected, what requires mapping, what requires provider support, what is still manual, and who owns the next action. Not a live hotel status."}
          </caption>
          <thead>
            <tr>
              <th scope="col">{thai ? "หัวข้อ" : "Field"}</th>
              <th scope="col">{thai ? "รายละเอียดตัวอย่าง" : "Sample detail"}</th>
              <th scope="col">{thai ? "สถานะ" : "Status"}</th>
              <th scope="col">{thai ? "ผู้รับผิดชอบ" : "Owner"}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((item) => {
              const copy = fieldCopy(item, thai);
              return (
                <tr key={item.id}>
                  <th scope="row">{copy.title}</th>
                  <td data-label={thai ? "รายละเอียดตัวอย่าง" : "Sample detail"}>{copy.body}</td>
                  <td data-label={thai ? "สถานะ" : "Status"}>
                    <em className={`hsi-status is-${copy.status.tone} kpi-latin`}>{copy.status.label}</em>
                  </td>
                  <td data-label={thai ? "ผู้รับผิดชอบ" : "Owner"}>{copy.owner}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="hsi-ba-note">{displayNote}</p>
    </div>
  );
}
