"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { purgeDocument, restoreDocument } from "@/lib/cms/actions";

export function CmsTrashRowActions({
  id,
  title,
  kind,
}: {
  id: string;
  title: string;
  kind: "page" | "insight";
}) {
  const [mode, setMode] = useState<"restore" | "purge" | null>(null);
  const [pending, startTransition] = useTransition();
  const titleId = useId();
  const kindLabel = kind === "insight" ? "บทความ" : "หน้าเพจ";

  useEffect(() => {
    if (!mode) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMode(null);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mode]);

  function submit(action: typeof restoreDocument | typeof purgeDocument, extra?: Record<string, string>) {
    const formData = new FormData();
    formData.set("id", id);
    if (extra) {
      for (const [key, value] of Object.entries(extra)) formData.set(key, value);
    }
    startTransition(async () => {
      await action(formData);
    });
  }

  return (
    <>
      <div className="crm-users-icon-actions crm-cms-row-actions crm-cms-trash-actions">
        <button
          type="button"
          className="crm-users-secondary crm-cms-trash-restore"
          disabled={pending}
          onClick={() => setMode("restore")}
        >
          กู้คืน
        </button>
        <button
          type="button"
          className="crm-users-icon-btn is-danger"
          title="ลบถาวร"
          aria-label={`ลบถาวร ${title}`}
          disabled={pending}
          onClick={() => setMode("purge")}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 7h14M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7m1.5 0v11a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 8 18V7"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {mode === "restore" ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={() => setMode(null)} />
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">ถังขยะ</p>
                <h2 id={titleId}>กู้คืน{kindLabel}</h2>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setMode(null)}>
                ×
              </button>
            </div>
            <div className="crm-modal-form">
              <p className="crm-users-alert is-ok" role="status">
                กู้คืน “{title}” กลับเข้ารายการ{kindLabel}?
              </p>
              <div className="crm-modal-actions">
                <button type="button" className="crm-users-secondary" onClick={() => setMode(null)} disabled={pending}>
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="crm-users-secondary"
                  disabled={pending}
                  onClick={() => submit(restoreDocument)}
                >
                  กู้คืนเป็นฉบับร่าง
                </button>
                <button
                  type="button"
                  className="kpi-button"
                  disabled={pending}
                  onClick={() => submit(restoreDocument, { publish: "1" })}
                >
                  กู้คืนและเผยแพร่
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {mode === "purge" ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={() => setMode(null)} />
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">ถังขยะ</p>
                <h2 id={titleId}>ลบถาวร</h2>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setMode(null)}>
                ×
              </button>
            </div>
            <div className="crm-modal-form">
              <p className="crm-users-alert is-warn" role="status">
                ยืนยันลบ “{title}” ถาวร? การกระทำนี้เรียกคืนไม่ได้
              </p>
              <div className="crm-modal-actions">
                <button type="button" className="crm-users-secondary" onClick={() => setMode(null)} disabled={pending}>
                  ยกเลิก
                </button>
                <button
                  type="button"
                  className="kpi-button crm-users-delete-btn"
                  disabled={pending}
                  onClick={() => submit(purgeDocument)}
                >
                  ลบถาวร
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
