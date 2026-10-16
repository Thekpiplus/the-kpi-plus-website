"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

type ConfirmDeleteButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  fields?: Record<string, string>;
  itemName: string;
  eyebrow?: string;
  title?: string;
  message?: string;
  buttonLabel?: string;
  confirmLabel?: string;
  className?: string;
  children?: ReactNode;
};

export function ConfirmDeleteButton({
  action,
  fields = {},
  itemName,
  eyebrow = "ยืนยัน",
  title = "ยืนยันการลบ",
  message,
  buttonLabel = "ลบ",
  confirmLabel = "ลบ",
  className = "kpi-button crm-users-delete-btn",
  children,
}: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const body = message ?? `ยืนยันลบ “${itemName}”? การดำเนินการนี้อาจย้อนกลับไม่ได้`;

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children ?? buttonLabel}
      </button>

      {open ? (
        <div className="crm-modal" role="presentation">
          <button
            type="button"
            className="crm-modal-backdrop"
            aria-label="ปิดหน้าต่าง"
            onClick={() => setOpen(false)}
          />
          <div
            className="crm-modal-panel crm-modal-panel-user"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">{eyebrow}</p>
                <h2 id={titleId}>{title}</h2>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <form action={action} className="crm-modal-form">
              {Object.entries(fields).map(([name, value]) => (
                <input key={name} type="hidden" name={name} value={value} />
              ))}
              <p className="crm-users-alert is-warn" role="status">
                {body}
              </p>
              <div className="crm-modal-actions">
                <button type="button" className="crm-users-secondary" onClick={() => setOpen(false)}>
                  ยกเลิก
                </button>
                <button className="kpi-button crm-users-delete-btn" type="submit">
                  {confirmLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
