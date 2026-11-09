"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export function CmsEditorSaveBar({
  saveLabel,
  previewHref,
  publicHref,
  statusLabel,
}: {
  saveLabel: string;
  previewHref?: string;
  publicHref?: string;
  statusLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <div className="crm-cms-editor-bar">
      <div className="crm-cms-editor-bar-main">
        <button className="kpi-button" type="submit" disabled={pending} aria-busy={pending}>
          {pending ? "กำลังบันทึก…" : saveLabel}
        </button>
        {previewHref ? (
          <Link href={previewHref} className="crm-users-secondary">
            ดูตัวอย่าง
          </Link>
        ) : null}
        {publicHref ? (
          <a href={publicHref} className="crm-users-secondary" target="_blank" rel="noreferrer">
            เปิดบนเว็บ
          </a>
        ) : null}
      </div>
      <p className={`crm-cms-editor-bar-state${pending ? " is-pending" : ""}`} role="status">
        {pending ? "กำลังบันทึก…" : statusLabel || "บันทึกเมื่อพร้อม"}
      </p>
    </div>
  );
}

/** Warn before leaving when the surrounding form has unsaved edits. */
export function CmsFormDirtyTracker({ formId }: { formId: string }) {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const form = document.getElementById(formId);
    if (!(form instanceof HTMLFormElement)) return;

    const markDirty = () => setDirty(true);
    const clearDirty = () => setDirty(false);

    form.addEventListener("input", markDirty);
    form.addEventListener("change", markDirty);
    form.addEventListener("submit", clearDirty);

    const onUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onUnload);

    return () => {
      form.removeEventListener("input", markDirty);
      form.removeEventListener("change", markDirty);
      form.removeEventListener("submit", clearDirty);
      window.removeEventListener("beforeunload", onUnload);
    };
  }, [formId, dirty]);

  return null;
}
