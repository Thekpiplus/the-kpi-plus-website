"use client";

import { useEffect, useMemo, useState } from "react";
import type { CmsSystemsDeliverableRow } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_DELIVERABLES_COLUMNS,
  SYSTEMS_DELIVERABLES_VISUAL,
  SYSTEMS_READINESS_STATUSES,
  systemsReadinessStatus,
  systemsRenderableSrc,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function storageKey(locale: Locale) {
  return `kpi-systems-readiness-matrix-v1-${locale}`;
}

type ReadyDraft = {
  status?: string;
  owner?: string;
  action?: string;
};

function rowCopy(row: CmsSystemsDeliverableRow, thai: boolean, draft: ReadyDraft) {
  const status = systemsReadinessStatus(draft.status || row.status || "needs_review");
  return {
    area: thai ? row.areaTh || row.areaEn : row.areaEn || row.areaTh,
    inspect: thai ? row.inspectTh || row.supportTh || row.inspectEn : row.inspectEn || row.supportEn || row.inspectTh,
    evidence: thai ? row.evidenceTh || row.evidenceEn : row.evidenceEn || row.evidenceTh,
    owner: draft.owner ?? (thai ? row.ownerTh || row.ownerEn : row.ownerEn || row.ownerTh),
    action: draft.action ?? (thai ? row.actionTh || row.approvalTh || row.actionEn : row.actionEn || row.approvalEn || row.actionTh),
    output: row.output || row.deliverable,
    status,
  };
}

export function HotelSystemsReadiness({
  locale,
  src,
  alt,
  status,
  label,
  caption,
  rows,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
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
  const displayAlt = alt?.trim() || (thai ? SYSTEMS_DELIVERABLES_VISUAL.altTh : SYSTEMS_DELIVERABLES_VISUAL.altEn);
  const [drafts, setDrafts] = useState<Record<string, ReadyDraft>>({});
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setDrafts({});
    try {
      const raw = window.sessionStorage.getItem(storageKey(locale));
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, ReadyDraft>;
      if (parsed && typeof parsed === "object") setDrafts(parsed);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const items = useMemo(
    () => rows.map((row) => ({ id: row.id, ...rowCopy(row, thai, drafts[row.id] || {}) })),
    [drafts, rows, thai],
  );

  function patch(id: string, next: ReadyDraft) {
    setSaved("");
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...next } }));
  }

  function saveSample() {
    const next = Object.fromEntries(items.map((row) => [row.id, { status: row.status.id, owner: row.owner, action: row.action }]));
    try {
      window.sessionStorage.setItem(storageKey(locale), JSON.stringify(next));
    } catch {
      /* ignore quota / private mode */
    }
    setSaved(thai ? "บันทึกบนอุปกรณ์นี้แล้ว เป็นตัวอย่าง ไม่ใช่สถานะ Ready ของโรงแรม" : "Saved on this device as a sample. Not a hotel Ready status.");
  }

  return (
    <div className="hsi-ready">
      <figure className="hsi-ready-figure">
        {fileSrc ? (
          <div className="hsi-ready-photo">
            <img
              src={fileSrc}
              alt={displayAlt}
              width={SYSTEMS_DELIVERABLES_VISUAL.displayWidth}
              height={SYSTEMS_DELIVERABLES_VISUAL.displayHeight}
              style={{ aspectRatio: `${SYSTEMS_DELIVERABLES_VISUAL.displayWidth} / ${SYSTEMS_DELIVERABLES_VISUAL.displayHeight}` }}
              loading="lazy"
              decoding="async"
            />
            {sample ? <span className="hsi-visual-badge">Hotel Systems Implementation Readiness — Sample</span> : null}
          </div>
        ) : (
          <div className="hsi-ready-board" role="img" aria-label={displayAlt}>
            {sample ? <span className="hsi-visual-badge">Hotel Systems Implementation Readiness — Sample</span> : null}
            <p className="hsi-mock-kicker kpi-latin">Area · What to check · Evidence · Current status · Owner · Next action · Output</p>
            <p className="hsi-ready-board-title">{thai ? "โรงแรมต้องเตรียมก่อนเริ่มงาน" : "Prepare these before implementation"}</p>
            <ul className="hsi-ready-preview">
              {items.map((row) => (
                <li key={row.id} className={`is-${row.status.tone}`}>
                  <strong>{row.area}</strong>
                  <em className={`hsi-status is-${row.status.tone} kpi-latin`}>{row.status.label}</em>
                  <span className="kpi-latin">{row.output}</span>
                </li>
              ))}
            </ul>
            <p className="hsi-ready-board-note">
              {thai ? "ไม่ได้ทำเครื่องหมาย Ready ทั้งตาราง" : "Not every row is marked Ready."}
            </p>
          </div>
        )}
        <figcaption className="hsi-visual-caption">
          <strong>{displayLabel}</strong>
          <span className="hsi-visual-meta">{thai ? SYSTEMS_DELIVERABLES_VISUAL.metaTh : SYSTEMS_DELIVERABLES_VISUAL.metaEn}</span>
          <span>{displayCaption}</span>
        </figcaption>
      </figure>

      <p className="hsi-review-framework kpi-latin">Sample review framework</p>
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
            {items.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.area}</th>
                <td data-label={thai ? cols.inspect.th : cols.inspect.en}>{row.inspect}</td>
                <td data-label={thai ? cols.evidence.th : cols.evidence.en}>{row.evidence}</td>
                <td data-label={thai ? cols.status.th : cols.status.en}>
                  <label className={`hsi-review-status is-${row.status.tone}`}>
                    <span className="sr-only">{thai ? cols.status.th : cols.status.en}</span>
                    <select value={row.status.id} onChange={(event) => patch(row.id, { status: event.target.value })}>
                      {SYSTEMS_READINESS_STATUSES.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </td>
                <td data-label={thai ? cols.owner.th : cols.owner.en}>
                  <label>
                    <span className="sr-only">{thai ? cols.owner.th : cols.owner.en}</span>
                    <input className="hsi-review-field" value={row.owner} onChange={(event) => patch(row.id, { owner: event.target.value })} />
                  </label>
                </td>
                <td data-label={thai ? cols.action.th : cols.action.en}>
                  <label>
                    <span className="sr-only">{thai ? cols.action.th : cols.action.en}</span>
                    <input className="hsi-review-field" value={row.action} onChange={(event) => patch(row.id, { action: event.target.value })} />
                  </label>
                </td>
                <td data-label={thai ? cols.output.th : cols.output.en}>
                  <span className="kpi-latin">{row.output}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="hsi-review-save">
        <button type="button" className="kpi-button bg-[#a2dc25] text-[#1a3a02]" onClick={saveSample}>
          {thai ? "บันทึกตัวอย่าง" : "Save sample"}
        </button>
        {saved ? (
          <p className="hsi-review-saved">{saved}</p>
        ) : (
          <p className="hsi-review-save-note">
            {thai ? "การบันทึกอยู่บนอุปกรณ์นี้เท่านั้น ไม่ใช่สถานะ Ready ของโรงแรม" : "Save stays on this device. It is not a hotel Ready status."}
          </p>
        )}
      </div>
    </div>
  );
}
