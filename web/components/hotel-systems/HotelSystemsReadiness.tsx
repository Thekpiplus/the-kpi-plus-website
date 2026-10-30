import type { CmsSystemsDeliverableRow } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_DELIVERABLES_COLUMNS,
  SYSTEMS_DELIVERABLES_VISUAL,
  SYSTEMS_READINESS_STATUSES,
  systemsReadinessStatus,
  systemsRenderableSrc,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function rowCopy(row: CmsSystemsDeliverableRow, thai: boolean) {
  const status = systemsReadinessStatus(row.status);
  return {
    area: thai ? row.areaTh || row.areaEn : row.areaEn || row.areaTh,
    inspect: thai ? row.inspectTh || row.supportTh || row.inspectEn : row.inspectEn || row.supportEn || row.inspectTh,
    evidence: thai ? row.evidenceTh || row.evidenceEn : row.evidenceEn || row.evidenceTh,
    owner: thai ? row.ownerTh || row.ownerEn : row.ownerEn || row.ownerTh,
    action: thai ? row.actionTh || row.approvalTh || row.actionEn : row.actionEn || row.approvalEn || row.actionTh,
    output: row.output || row.deliverable,
    status,
  };
}

export function HotelSystemsReadiness({
  locale,
  src,
  status,
  label,
  caption,
  rows,
}: {
  locale: Locale;
  src?: string;
  status?: string;
  label?: string;
  caption?: string;
  rows: CmsSystemsDeliverableRow[];
}) {
  const thai = locale === "th";
  const sample = status !== "approved" && status !== "real";
  const fileSrc = systemsRenderableSrc(src, status);
  const cols = SYSTEMS_DELIVERABLES_COLUMNS;
  const displayLabel = label?.trim() || SYSTEMS_DELIVERABLES_VISUAL.labelEn;
  const displayCaption = caption?.trim() || (thai ? SYSTEMS_DELIVERABLES_VISUAL.captionTh : SYSTEMS_DELIVERABLES_VISUAL.captionEn);

  return (
    <div className="hsi-ready">
      <figure className="hsi-ready-figure">
        {fileSrc ? (
          <div className="hsi-ready-photo">
            <img
              src={fileSrc}
              alt={thai ? SYSTEMS_DELIVERABLES_VISUAL.altTh : SYSTEMS_DELIVERABLES_VISUAL.altEn}
              width={SYSTEMS_DELIVERABLES_VISUAL.displayWidth}
              height={SYSTEMS_DELIVERABLES_VISUAL.displayHeight}
              style={{ aspectRatio: `${SYSTEMS_DELIVERABLES_VISUAL.displayWidth} / ${SYSTEMS_DELIVERABLES_VISUAL.displayHeight}` }}
              loading="lazy"
              decoding="async"
            />
            {sample ? <span className="hsi-visual-badge">Hotel Systems Implementation Readiness — Sample</span> : null}
          </div>
        ) : (
          <div className="hsi-ready-board" role="img" aria-label={thai ? SYSTEMS_DELIVERABLES_VISUAL.altTh : SYSTEMS_DELIVERABLES_VISUAL.altEn}>
            {sample ? <span className="hsi-visual-badge">Hotel Systems Implementation Readiness — Sample</span> : null}
            <p className="hsi-mock-kicker kpi-latin">Area · What to check · Evidence · Status · Owner · Next action · Output</p>
            <p className="hsi-ready-board-title">{thai ? "โรงแรมต้องเตรียมก่อนเริ่มงาน" : "Prepare these before implementation"}</p>
            <ul className="hsi-ready-preview">
              {rows.map((row) => {
                const copy = rowCopy(row, thai);
                return (
                  <li key={row.id}>
                    <strong>{copy.area}</strong>
                    <em className={`hsi-status is-${copy.status.tone} kpi-latin`}>{copy.status.label}</em>
                    <span className="kpi-latin">{copy.output}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <figcaption className="hsi-visual-caption">
          <strong>{displayLabel}</strong>
          <span className="hsi-visual-meta">{thai ? SYSTEMS_DELIVERABLES_VISUAL.metaTh : SYSTEMS_DELIVERABLES_VISUAL.metaEn}</span>
          <span>{displayCaption}</span>
        </figcaption>
      </figure>

      <ul className="hsi-ready-legend" aria-label={thai ? "คำอธิบายสถานะตัวอย่าง ไม่ใช่สถานะ Ready ของโรงแรมจริง" : "Sample status legend. Not a live hotel Ready status."}>
        {SYSTEMS_READINESS_STATUSES.map((item) => (
          <li key={item.id}>
            <span className={`hsi-status is-${item.tone} kpi-latin`}>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="hsi-ready-table-wrap">
        <table className="hsi-ready-table">
          <caption className="sr-only">
            {thai
              ? "ตารางตัวอย่างความพร้อมก่อนนำไปใช้ แสดงสิ่งที่ต้องตรวจ หลักฐาน สถานะ ผู้รับผิดชอบ งานถัดไป และผลลัพธ์ ไม่ใช่สถานะโรงแรมจริง และไม่ได้ทำเครื่องหมาย Ready ทั้งตาราง"
              : "Sample implementation readiness matrix of what to check, evidence, current status, owner, next action, and output. Not a live hotel status, and not every row is marked Ready."}
          </caption>
          <thead>
            <tr>
              <th scope="col">{thai ? cols.area.th : cols.area.en}</th>
              <th scope="col">{thai ? cols.inspect.th : cols.inspect.en}</th>
              <th scope="col">{thai ? cols.evidence.th : cols.evidence.en}</th>
              <th scope="col">{thai ? cols.status.th : cols.status.en}</th>
              <th scope="col">{thai ? cols.owner.th : cols.owner.en}</th>
              <th scope="col">{thai ? cols.action.th : cols.action.en}</th>
              <th scope="col">{thai ? cols.output.th : cols.output.en}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const copy = rowCopy(row, thai);
              return (
                <tr key={row.id}>
                  <th scope="row">{copy.area}</th>
                  <td data-label={thai ? cols.inspect.th : cols.inspect.en}>{copy.inspect}</td>
                  <td data-label={thai ? cols.evidence.th : cols.evidence.en}>{copy.evidence}</td>
                  <td data-label={thai ? cols.status.th : cols.status.en}>
                    <em className={`hsi-status is-${copy.status.tone} kpi-latin`}>{copy.status.label}</em>
                  </td>
                  <td data-label={thai ? cols.owner.th : cols.owner.en}>{copy.owner}</td>
                  <td data-label={thai ? cols.action.th : cols.action.en}>{copy.action}</td>
                  <td data-label={thai ? cols.output.th : cols.output.en}>
                    <span className="kpi-latin">{copy.output}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
