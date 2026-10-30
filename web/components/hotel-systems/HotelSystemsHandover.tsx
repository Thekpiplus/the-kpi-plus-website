import type { CmsSystemsHandoverItem, CmsSystemsOwnershipRow } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_HANDOVER_CHECKLIST_COLUMNS,
  SYSTEMS_HANDOVER_CHECKLIST_STATUSES,
  SYSTEMS_HANDOVER_NOTE,
  SYSTEMS_OWNERSHIP_COLUMNS,
  SYSTEMS_OWNERSHIP_STATUSES,
  SYSTEMS_PLAN_VISUAL,
  systemsCredentialSafeText,
  systemsHandoverChecklistStatus,
  systemsOwnershipStatus,
  systemsRenderableSrc,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function checklistCopy(row: CmsSystemsHandoverItem, thai: boolean, sample: boolean) {
  const status = systemsHandoverChecklistStatus(row.status, sample);
  return {
    id: row.id,
    item: thai ? row.itemTh || row.itemEn : row.itemEn || row.itemTh,
    status,
    owner: systemsCredentialSafeText(thai ? row.ownerTh || row.ownerEn : row.ownerEn || row.ownerTh),
    evidence: systemsCredentialSafeText(thai ? row.evidenceTh || row.evidenceEn : row.evidenceEn || row.evidenceTh),
  };
}

function ownershipCopy(row: CmsSystemsOwnershipRow, thai: boolean, sample: boolean) {
  const status = systemsOwnershipStatus(row.status, sample);
  return {
    id: row.id,
    asset: thai ? row.assetTh || row.assetEn : row.assetEn || row.assetTh,
    owner: systemsCredentialSafeText(thai ? row.ownerTh || row.ownerEn : row.ownerEn || row.ownerTh),
    contact: systemsCredentialSafeText(thai ? row.contactTh || row.contactEn : row.contactEn || row.contactTh),
    approval: systemsCredentialSafeText(thai ? row.approvalTh || row.approvalEn : row.approvalEn || row.approvalTh),
    access: systemsCredentialSafeText(thai ? row.accessTh || row.accessEn : row.accessEn || row.accessTh),
    renewal: thai ? row.renewalTh || row.renewalEn : row.renewalEn || row.renewalTh,
    reviewed: row.reviewed,
    status,
  };
}

export function HotelSystemsHandover({
  locale,
  src,
  alt,
  status,
  label,
  caption,
  checklistTitle,
  ownershipTitle,
  checklist,
  ownership,
  note,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
  label?: string;
  caption?: string;
  checklistTitle?: string;
  ownershipTitle?: string;
  checklist: CmsSystemsHandoverItem[];
  ownership: CmsSystemsOwnershipRow[];
  note?: string;
}) {
  const thai = locale === "th";
  const sample = status !== "approved" && status !== "real";
  const fileSrc = systemsRenderableSrc(src, status);
  const checkCols = SYSTEMS_HANDOVER_CHECKLIST_COLUMNS;
  const ownCols = SYSTEMS_OWNERSHIP_COLUMNS;
  const displayLabel = label?.trim() || SYSTEMS_PLAN_VISUAL.labelEn;
  const displayCaption = caption?.trim() || (thai ? SYSTEMS_PLAN_VISUAL.captionTh : SYSTEMS_PLAN_VISUAL.captionEn);
  const displayAlt = alt?.trim() || (thai ? SYSTEMS_PLAN_VISUAL.altTh : SYSTEMS_PLAN_VISUAL.altEn);
  const items = checklist.map((row) => checklistCopy(row, thai, sample));
  const assets = ownership.map((row) => ownershipCopy(row, thai, sample));

  return (
    <div className="hsi-hand">
      <ul className="hsi-hand-flags" aria-label={thai ? "ป้ายการส่งมอบตัวอย่าง" : "Sample handover labels"}>
        <li className="kpi-latin">{thai ? "ข้อมูลตัวอย่าง" : "Sample data"}</li>
        <li className="kpi-latin">{thai ? "ไม่เก็บรหัสผ่าน" : "No credentials stored"}</li>
        <li className="kpi-latin">{thai ? "ยังไม่ทำเครื่องหมาย Live หรือ Handed Over" : "Not marked Live or Handed Over"}</li>
      </ul>

      <figure className="hsi-hand-figure">
        {fileSrc ? (
          <div className="hsi-hand-photo">
            <img
              src={fileSrc}
              alt={displayAlt}
              width={SYSTEMS_PLAN_VISUAL.displayWidth}
              height={SYSTEMS_PLAN_VISUAL.displayHeight}
              style={{ aspectRatio: `${SYSTEMS_PLAN_VISUAL.displayWidth} / ${SYSTEMS_PLAN_VISUAL.displayHeight}` }}
              loading="lazy"
              decoding="async"
            />
            {sample ? <span className="hsi-visual-badge">Hotel Systems Handover and Ownership — Sample</span> : null}
          </div>
        ) : (
          <div className="hsi-hand-board" role="img" aria-label={thai ? SYSTEMS_PLAN_VISUAL.altTh : SYSTEMS_PLAN_VISUAL.altEn}>
            {sample ? <span className="hsi-visual-badge">Hotel Systems Handover and Ownership — Sample</span> : null}
            <p className="hsi-mock-kicker kpi-latin">Sample handover · No credentials · Not Live</p>
            <p className="hsi-hand-board-title">
              {thai ? "ส่งมอบเมื่ออนุมัติและเอกสารครบ" : "Hand over only after approval and documentation"}
            </p>
            <ul className="hsi-hand-preview">
              <li>
                <strong className="kpi-latin">Handover Checklist</strong>
                <span className="kpi-latin">Inventory · Mapping · QA · Sign-off</span>
              </li>
              <li>
                <strong className="kpi-latin">Ownership</strong>
                <span className="kpi-latin">PMS · API · Domain · Hosting</span>
              </li>
            </ul>
          </div>
        )}
        <figcaption className="hsi-visual-caption">
          <strong>{displayLabel}</strong>
          <span className="hsi-visual-meta">{thai ? SYSTEMS_PLAN_VISUAL.metaTh : SYSTEMS_PLAN_VISUAL.metaEn}</span>
          <span>{displayCaption}</span>
        </figcaption>
      </figure>

      <ul className="hsi-hand-legend" aria-label={thai ? "คำอธิบายสถานะส่งมอบตัวอย่าง" : "Sample handover status legend"}>
        {SYSTEMS_HANDOVER_CHECKLIST_STATUSES.map((item) => (
          <li key={`check-${item.id}`}>
            <span className={`hsi-status is-${item.tone} kpi-latin`}>{item.label}</span>
          </li>
        ))}
        {SYSTEMS_OWNERSHIP_STATUSES.map((item) => (
          <li key={`own-${item.id}`}>
            <span className={`hsi-status is-${item.tone} kpi-latin`}>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="hsi-hand-block">
        <h3 className="hsi-hand-heading kpi-latin">{checklistTitle?.trim() || "Handover Checklist"}</h3>
        <div className="hsi-hand-table-wrap">
          <table className="hsi-hand-table">
            <caption className="sr-only">
              {thai
                ? "รายการส่งมอบตัวอย่างของงานระบบโรงแรม แสดงรายการ สถานะ ผู้รับผิดชอบ และหลักฐาน ไม่เก็บรหัสผ่าน และไม่ทำเครื่องหมาย Live หรือ Handed Over จนกว่าจะอนุมัติครบ"
                : "Sample hotel systems handover checklist of item, status, owner, and evidence. No passwords are stored. A system is not marked Live or Handed Over until approvals and documentation are complete."}
            </caption>
            <thead>
              <tr>
                <th scope="col">{thai ? checkCols.item.th : checkCols.item.en}</th>
                <th scope="col">{thai ? checkCols.status.th : checkCols.status.en}</th>
                <th scope="col">{thai ? checkCols.owner.th : checkCols.owner.en}</th>
                <th scope="col">{thai ? checkCols.evidence.th : checkCols.evidence.en}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.item}</th>
                  <td data-label={thai ? checkCols.status.th : checkCols.status.en}>
                    <em className={`hsi-status is-${row.status.tone} kpi-latin`}>{row.status.label}</em>
                  </td>
                  <td data-label={thai ? checkCols.owner.th : checkCols.owner.en}>{row.owner}</td>
                  <td data-label={thai ? checkCols.evidence.th : checkCols.evidence.en}>{row.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="hsi-hand-block">
        <h3 className="hsi-hand-heading kpi-latin">{ownershipTitle?.trim() || "Ownership"}</h3>
        <div className="hsi-hand-table-wrap">
          <table className="hsi-hand-table is-ownership">
            <caption className="sr-only">
              {thai
                ? "ตารางเจ้าของระบบโรงแรมตัวอย่าง แสดงระบบ เจ้าของ ผู้ติดต่อด้านเทคนิค ผู้มีอำนาจอนุมัติ ระดับสิทธิ์ ผู้รับผิดชอบต่ออายุ และวันที่ตรวจล่าสุด ไม่เก็บรหัสผ่าน และไม่มีแถวที่ทำเครื่องหมาย Live หรือ Handed Over"
                : "Sample hotel systems ownership table of system, owner, admin or technical contact, approval authority, access level, renewal or expiry responsibility, and last reviewed date. No passwords are stored, and no row is marked Live or Handed Over."}
            </caption>
            <thead>
              <tr>
                <th scope="col">{thai ? ownCols.asset.th : ownCols.asset.en}</th>
                <th scope="col">{thai ? ownCols.owner.th : ownCols.owner.en}</th>
                <th scope="col">{thai ? ownCols.contact.th : ownCols.contact.en}</th>
                <th scope="col">{thai ? ownCols.approval.th : ownCols.approval.en}</th>
                <th scope="col">{thai ? ownCols.access.th : ownCols.access.en}</th>
                <th scope="col">{thai ? ownCols.renewal.th : ownCols.renewal.en}</th>
                <th scope="col">{thai ? ownCols.reviewed.th : ownCols.reviewed.en}</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((row) => (
                <tr key={row.id}>
                  <th scope="row">
                    {row.asset}
                    <em className={`hsi-status is-${row.status.tone} kpi-latin`}>{row.status.label}</em>
                  </th>
                  <td data-label={thai ? ownCols.owner.th : ownCols.owner.en}>{row.owner}</td>
                  <td data-label={thai ? ownCols.contact.th : ownCols.contact.en}>{row.contact}</td>
                  <td data-label={thai ? ownCols.approval.th : ownCols.approval.en}>{row.approval}</td>
                  <td data-label={thai ? ownCols.access.th : ownCols.access.en}>{row.access}</td>
                  <td data-label={thai ? ownCols.renewal.th : ownCols.renewal.en}>{row.renewal}</td>
                  <td data-label={thai ? ownCols.reviewed.th : ownCols.reviewed.en} className="kpi-latin">
                    {row.reviewed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="hsi-hand-note">{note?.trim() || (thai ? SYSTEMS_HANDOVER_NOTE.th : SYSTEMS_HANDOVER_NOTE.en)}</p>
    </div>
  );
}
