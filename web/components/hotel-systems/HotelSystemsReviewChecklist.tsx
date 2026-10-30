"use client";

import { useEffect, useMemo, useState } from "react";
import type { CmsSystemsAssessmentRow } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_REVIEW_COLUMNS,
  SYSTEMS_REVIEW_STATUSES,
  systemsReviewStatus,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

const STORAGE_KEY = "kpi-systems-review-checklist";

function rowStatus(row: CmsSystemsAssessmentRow, overrides: Record<string, string>) {
  return overrides[row.id] || row.status || "needs_review";
}

export function HotelSystemsReviewChecklist({
  locale,
  rows,
}: {
  locale: Locale;
  rows: CmsSystemsAssessmentRow[];
}) {
  const thai = locale === "th";
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState("");
  const columns = SYSTEMS_REVIEW_COLUMNS;

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, string>;
      if (parsed && typeof parsed === "object") setOverrides(parsed);
    } catch {
      /* ignore */
    }
  }, []);

  const items = useMemo(
    () =>
      rows.map((row) => {
        const status = systemsReviewStatus(rowStatus(row, overrides));
        return {
          ...row,
          question: thai ? row.questionTh || row.questionEn : row.questionEn || row.questionTh,
          evidence: thai ? row.evidenceTh || row.evidenceEn || row.output : row.evidenceEn || row.evidenceTh || row.output,
          owner: thai ? row.ownerTh || row.ownerEn : row.ownerEn || row.ownerTh,
          action: thai ? row.actionTh || row.actionEn || row.supportTh : row.actionEn || row.actionTh || row.supportEn,
          status,
        };
      }),
    [overrides, rows, thai],
  );

  function saveSample() {
    const next = Object.fromEntries(items.map((row) => [row.id, row.status.id]));
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota / private mode */
    }
    setSaved(thai ? "บันทึกบนอุปกรณ์นี้แล้ว เป็นตัวอย่าง ไม่ใช่ผลตรวจโรงแรม" : "Saved on this device as a sample. Not a hotel diagnosis.");
  }

  return (
    <div className="hsi-review-checklist">
      <p className="hsi-review-framework kpi-latin">Sample review framework</p>
      <div className="hsi-review-table-wrap">
        <table className="hsi-review-table">
          <caption className="sr-only">
            {thai
              ? "รายการตรวจตัวอย่าง คำถาม สถานะ หลักฐาน ผู้รับผิดชอบ และขั้นตอนถัดไป ไม่ใช่ผลตรวจโรงแรมจริง"
              : "Sample checklist of question, status, evidence, owner, and recommended next action. Not a live hotel diagnosis."}
          </caption>
          <thead>
            <tr>
              <th scope="col">{thai ? columns.question.th : columns.question.en}</th>
              <th scope="col">{thai ? columns.status.th : columns.status.en}</th>
              <th scope="col">{thai ? columns.evidence.th : columns.evidence.en}</th>
              <th scope="col">{thai ? columns.owner.th : columns.owner.en}</th>
              <th scope="col">{thai ? columns.action.th : columns.action.en}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  <span className="kpi-latin">{row.num}</span>
                  {row.question}
                </th>
                <td data-label={thai ? columns.status.th : columns.status.en}>
                  <label className={`hsi-review-status is-${row.status.tone}`}>
                    <span className="sr-only">{thai ? columns.status.th : columns.status.en}</span>
                    <select
                      value={row.status.id}
                      onChange={(event) => {
                        setSaved("");
                        setOverrides((current) => ({ ...current, [row.id]: event.target.value }));
                      }}
                    >
                      {SYSTEMS_REVIEW_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </td>
                <td data-label={thai ? columns.evidence.th : columns.evidence.en}>{row.evidence}</td>
                <td data-label={thai ? columns.owner.th : columns.owner.en}>{row.owner}</td>
                <td data-label={thai ? columns.action.th : columns.action.en}>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="hsi-review-save">
        <button type="button" className="kpi-button bg-[#a2dc25] text-[#1a3a02]" onClick={saveSample}>
          {thai ? "บันทึกตัวอย่าง" : "Save sample"}
        </button>
        {saved ? <p className="hsi-review-saved">{saved}</p> : <p className="hsi-review-save-note">{thai ? "การบันทึกอยู่บนอุปกรณ์นี้เท่านั้น ไม่ใช่ผลวินิจฉัยโรงแรม" : "Save stays on this device. It is not a hotel diagnosis."}</p>}
      </div>
    </div>
  );
}
