"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ConfirmDeleteButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
  fields?: Record<string, string>;
  itemName: string;
  eyebrow?: string;
  title?: string;
  message?: string;
  detail?: string;
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
  detail,
  buttonLabel = "ลบ",
  confirmLabel = "ลบ",
  className = "kpi-button crm-users-delete-btn",
  children,
}: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const body = message ?? `ยืนยันลบ “${itemName}”?`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopImmediatePropagation();
      setOpen(false);
    }
    document.addEventListener("keydown", onKey, true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children ?? buttonLabel}
      </button>

      {mounted && open
        ? createPortal(
            <div className="crm-modal crm-modal-layer-confirm" role="presentation">
              <button
                type="button"
                className="crm-modal-backdrop"
                aria-label="ปิดหน้าต่าง"
                onClick={() => setOpen(false)}
              />
              <div
                className="crm-modal-panel crm-modal-panel-user is-compact is-danger"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
              >
                <div className="crm-modal-head crm-modal-head-user">
                  <div>
                    <p className="crm-modal-eyebrow">{eyebrow}</p>
                    <h2 id={titleId} className="crm-modal-title">
                      {title}
                    </h2>
                    <p className="crm-modal-lead">ลบ “{itemName}” ออกจากระบบ?</p>
                  </div>
                  <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setOpen(false)}>
                    ✕
                  </button>
                </div>
                <form action={action} className="crm-modal-form crm-modal-form-user">
                  {Object.entries(fields).map(([name, value]) => (
                    <input key={name} type="hidden" name={name} value={value} />
                  ))}
                  <div className="crm-modal-body">
                    <div className="crm-modal-danger-card" role="status">
                      <p className="crm-modal-danger-title">{body}</p>
                      {detail ? <p className="crm-modal-danger-copy">{detail}</p> : null}
                    </div>
                  </div>
                  <div className="crm-modal-actions crm-modal-actions-bar">
                    <button type="button" className="crm-users-secondary" onClick={() => setOpen(false)}>
                      ยกเลิก
                    </button>
                    <button className="kpi-button crm-users-delete-btn" type="submit">
                      {confirmLabel}
                    </button>
                  </div>
                </form>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
