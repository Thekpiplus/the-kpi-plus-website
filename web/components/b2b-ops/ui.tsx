"use client";

import type { ReactNode } from "react";

export function toDateInput(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toDateTimeInput(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="crm-cms-field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function SaveBar({
  pending,
  ok,
  error,
  idle = "พร้อมบันทึก",
  dirty = false,
  onSave,
  saveLabel = "บันทึก",
}: {
  pending: boolean;
  ok: string;
  error: string;
  idle?: string;
  dirty?: boolean;
  onSave: () => void;
  saveLabel?: string;
}) {
  const state = pending ? "กำลังบันทึก…" : error ? error : ok || idle;
  const stateClass = error ? " is-error" : ok ? " is-ok" : dirty && !pending ? " is-dirty" : "";
  return (
    <div className="crm-cs-savebar b2b-savebar">
      <button className="kpi-button b2b-save" type="button" onClick={onSave} disabled={pending}>
        {pending ? "กำลังบันทึก…" : saveLabel}
      </button>
      <p className={`crm-cs-save-state${stateClass}`} role="status">
        {state}
      </p>
    </div>
  );
}

export function B2bDialog({
  title,
  body,
  confirmLabel,
  pending,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="b2b-dialog" role="dialog" aria-modal="true" aria-labelledby="b2b-dialog-title">
      <button type="button" className="b2b-dialog-backdrop" aria-label="ปิด" onClick={onCancel} />
      <div className="b2b-dialog-panel">
        <h2 id="b2b-dialog-title">{title}</h2>
        <p>{body}</p>
        <div className="b2b-dialog-actions">
          <button type="button" className="crm-users-secondary" onClick={onCancel} disabled={pending}>
            ยกเลิก
          </button>
          <button type="button" className="kpi-button b2b-save" onClick={onConfirm} disabled={pending}>
            {pending ? "กำลังบันทึก…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
