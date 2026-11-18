"use client";

import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";

const OUTCOMES = ["ติดต่อได้", "ไม่รับสาย", "นัดหมายแล้ว", "ส่งข้อมูลแล้ว", "ไม่สนใจ"] as const;

export function ActivityFollowUpForm({
  defaultTitle = "นัดติดตามครั้งถัดไป",
  error,
  onCancel,
  onSubmit,
}: {
  defaultTitle?: string;
  error?: string | null;
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  return (
    <form
      className="kpi-act-followup"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(new FormData(event.currentTarget));
      }}
    >
      <fieldset className="kpi-act-outcomes">
        <legend>ผลการติดต่อ</legend>
        {OUTCOMES.map((label) => (
          <label key={label} className="kpi-act-outcome">
            <input type="radio" name="outcome" value={label} required />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      <div className="kpi-act-followup-grid">
        <label className="kpi-act-field">
          วันที่นัดครั้งถัดไป
          <input type="date" name="nextDate" />
        </label>
        <label className="kpi-act-field">
          เวลานัดครั้งถัดไป
          <input type="time" name="nextTime" defaultValue="09:00" />
        </label>
        <label className="kpi-act-field is-span">
          ชื่อนัดติดตาม
          <input name="nextTitle" defaultValue={defaultTitle} />
        </label>
        <label className="kpi-act-field is-span">
          หมายเหตุสั้น ๆ
          <textarea name="note" rows={2} placeholder="สรุปสั้น ๆ จากสายหรือแชท" />
        </label>
      </div>

      {error ? (
        <p className="kpi-act-alert" role="alert">
          {error}
        </p>
      ) : null}

      <div className="kpi-act-followup-actions">
        <PendingSubmitButton className="kpi-leads-btn-primary" pendingLabel="กำลังบันทึก…">
          บันทึกผล
        </PendingSubmitButton>
        <button type="button" className="kpi-leads-btn-secondary" onClick={onCancel}>
          ปิดฟอร์ม
        </button>
      </div>
    </form>
  );
}
