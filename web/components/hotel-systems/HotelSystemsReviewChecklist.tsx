"use client";

import { useEffect, useMemo, useState } from "react";
import type { CmsSystemsAssessmentRow } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_REVIEW_COLUMNS,
  SYSTEMS_REVIEW_STATUSES,
  systemsReviewStatus,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function storageKey(locale: Locale) {
  return `kpi-systems-review-checklist-v2-${locale}`;
}

type ReviewDraft = {
  status?: string;
  evidence?: string;
  owner?: string;
  action?: string;
};

function rowDraft(row: CmsSystemsAssessmentRow, drafts: Record<string, ReviewDraft>): ReviewDraft {
  return drafts[row.id] || {};
}

export function HotelSystemsReviewChecklist({
  locale,
  rows,
}: {
  locale: Locale;
  rows: CmsSystemsAssessmentRow[];
}) {
  const thai = locale === "th";
  const [drafts, setDrafts] = useState<Record<string, ReviewDraft>>({});
  const [saved, setSaved] = useState("");
  const columns = SYSTEMS_REVIEW_COLUMNS;

  useEffect(() => {
    setDrafts({});
    try {
      const raw = window.sessionStorage.getItem(storageKey(locale));
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, ReviewDraft>;
      if (parsed && typeof parsed === "object") setDrafts(parsed);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const items = useMemo(
    () =>
      rows.map((row) => {
        const draft = rowDraft(row, drafts);
        const status = systemsReviewStatus(draft.status || row.status || "needs_review");
        return {
          ...row,
          question: thai ? row.questionTh || row.questionEn : row.questionEn || row.questionTh,
          evidence: draft.evidence ?? (thai ? row.evidenceTh || row.evidenceEn || row.output : row.evidenceEn || row.evidenceTh || row.output),
          owner: draft.owner ?? (thai ? row.ownerTh || row.ownerEn : row.ownerEn || row.ownerTh),
          action: draft.action ?? (thai ? row.actionTh || row.actionEn || row.supportTh : row.actionEn || row.actionTh || row.supportEn),
          status,
        };
      }),
    [drafts, rows, thai],
  );

  function patch(id: string, next: ReviewDraft) {
    setSaved("");
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...next } }));
  }

  function saveSample() {
    const next = Object.fromEntries(
      items.map((row) => [
        row.id,
        { status: row.status.id, evidence: row.evidence, owner: row.owner, action: row.action },
      ]),
    );
    try {
      window.sessionStorage.setItem(storageKey(locale), JSON.stringify(next));
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
                      onChange={(event) => patch(row.id, { status: event.target.value })}
                    >
                      {SYSTEMS_REVIEW_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </td>
                <td data-label={thai ? columns.evidence.th : columns.evidence.en}>
                  <label>
                    <span className="sr-only">{thai ? columns.evidence.th : columns.evidence.en}</span>
                    <input
                      className="hsi-review-field"
                      value={row.evidence}
                      onChange={(event) => patch(row.id, { evidence: event.target.value })}
                    />
                  </label>
                </td>
                <td data-label={thai ? columns.owner.th : columns.owner.en}>
                  <label>
                    <span className="sr-only">{thai ? columns.owner.th : columns.owner.en}</span>
                    <input
                      className="hsi-review-field"
                      value={row.owner}
                      onChange={(event) => patch(row.id, { owner: event.target.value })}
                    />
                  </label>
                </td>
                <td data-label={thai ? columns.action.th : columns.action.en}>
                  <label>
                    <span className="sr-only">{thai ? columns.action.th : columns.action.en}</span>
                    <input
                      className="hsi-review-field"
                      value={row.action}
                      onChange={(event) => patch(row.id, { action: event.target.value })}
                    />
                  </label>
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
        {saved ? <p className="hsi-review-saved">{saved}</p> : <p className="hsi-review-save-note">{thai ? "การบันทึกอยู่บนอุปกรณ์นี้เท่านั้น ไม่ใช่ผลวินิจฉัยโรงแรม" : "Save stays on this device. It is not a hotel diagnosis."}</p>}
      </div>
    </div>
  );
}
