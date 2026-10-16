"use client";

import { useEffect, useId, useState } from "react";
import { trashSitePage } from "@/lib/cms/actions";

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 7h14M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7m1.5 0v11a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 8 18V7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SitePageDeleteButton({ route, title }: { route: string; title: string }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

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
      <button
        type="button"
        className="crm-users-icon-btn is-danger"
        title="ลบ"
        aria-label={`ลบ ${title}`}
        onClick={() => setOpen(true)}
      >
        <IconTrash />
      </button>
      {open ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={() => setOpen(false)} />
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">Content</p>
                <h2 id={titleId}>ลบหน้าเพจ</h2>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>
            <form action={trashSitePage} className="crm-modal-form">
              <input type="hidden" name="route" value={route} />
              <p className="crm-users-alert is-warn" role="status">
                ยืนยันลบ “{title}”? หน้าจะถูกย้ายเข้าถังขยะและไม่แสดงบนเว็บ
              </p>
              <div className="crm-modal-actions">
                <button type="button" className="crm-users-secondary" onClick={() => setOpen(false)}>
                  ยกเลิก
                </button>
                <button className="kpi-button crm-users-delete-btn" type="submit">
                  ลบ
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
