"use client";

import { useState, useTransition } from "react";
import { changeLeadStageFormAction } from "@/lib/crm/actions";

export function PipelineMoveForm({
  leadId,
  contactName,
  currentStageId,
  stages,
}: {
  leadId: string;
  contactName: string;
  currentStageId: string;
  stages: { id: string; nameTh: string }[];
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="kpi-leads-pipe-move">
      <form
        className="crm-pipe-move"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const formData = new FormData(form);
          const stageId = String(formData.get("stageId") ?? "");
          const stageName = stages.find((item) => item.id === stageId)?.nameTh ?? "ขั้นใหม่";
          setError(null);
          startTransition(async () => {
            try {
              await changeLeadStageFormAction(formData);
              setNotice(`เลื่อนเฟสแล้ว: ${contactName} → ${stageName}`);
            } catch {
              setError("เลื่อนเฟสไม่สำเร็จ ลองใหม่อีกครั้ง");
            }
          });
        }}
      >
        <input type="hidden" name="leadId" value={leadId} />
        <label className="sr-only" htmlFor={`stage-${leadId}`}>
          ย้ายขั้นของ {contactName}
        </label>
        <select
          id={`stage-${leadId}`}
          className="crm-pipe-select"
          name="stageId"
          defaultValue={currentStageId}
          disabled={pending}
        >
          {stages.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nameTh}
            </option>
          ))}
        </select>
        <button className="crm-pipe-move-btn" type="submit" disabled={pending}>
          {pending ? "กำลังเลื่อน…" : "เลื่อนเฟส"}
        </button>
      </form>
      {notice ? (
        <p className="kpi-leads-pipe-notice" role="status" aria-live="polite">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="kpi-leads-alert" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
