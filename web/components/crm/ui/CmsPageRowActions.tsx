"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { trashDocument } from "@/lib/cms/actions";

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0 0-2.12L16.62 5.5a1.5 1.5 0 0 0-2.12 0L4 16v4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

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

export function CmsPageRowActions({
  pageId,
  pageName,
  editHref,
  canDelete = true,
  returnTo = "/crm/cms",
  dialogTitle = "ลบหน้า",
  dialogMessage,
}: {
  pageId?: string;
  pageName: string;
  editHref?: string;
  canDelete?: boolean;
  returnTo?: string;
  dialogTitle?: string;
  dialogMessage?: string;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleId = useId();
  const canEdit = Boolean(editHref);
  const allowDelete = Boolean(canDelete && pageId);

  useEffect(() => {
    if (!confirmDelete) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setConfirmDelete(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [confirmDelete]);

  return (
    <>
      <div className="crm-users-icon-actions crm-cms-row-actions">
        {canEdit ? (
          <Link href={editHref!} className="crm-users-icon-btn" title="แก้ไข" aria-label={`แก้ไข ${pageName}`}>
            <IconEdit />
          </Link>
        ) : (
          <span className="crm-users-icon-btn is-disabled" title="หน้าจากโค้ด แก้ไขจาก CMS ไม่ได้" aria-disabled="true">
            <IconEdit />
          </span>
        )}
        {allowDelete ? (
          <button
            type="button"
            className="crm-users-icon-btn is-danger"
            title="ลบ"
            aria-label={`ลบ ${pageName}`}
            onClick={() => setConfirmDelete(true)}
          >
            <IconTrash />
          </button>
        ) : (
          <span className="crm-users-icon-btn is-disabled" title="หน้าจากโค้ด ลบจาก CMS ไม่ได้" aria-disabled="true">
            <IconTrash />
          </span>
        )}
      </div>

      {confirmDelete && pageId ? (
        <div className="crm-modal" role="presentation">
          <button
            type="button"
            className="crm-modal-backdrop"
            aria-label="ปิดหน้าต่าง"
            onClick={() => setConfirmDelete(false)}
          />
          <div
            className="crm-modal-panel crm-modal-panel-user"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">Content</p>
                <h2 id={titleId}>{dialogTitle}</h2>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setConfirmDelete(false)}>
                ×
              </button>
            </div>
            <form action={trashDocument} className="crm-modal-form">
              <input type="hidden" name="id" value={pageId} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <p className="crm-users-alert is-warn" role="status">
                {dialogMessage ?? `ยืนยันลบ “${pageName}”? หน้าจะถูกย้ายเข้าถังขยะ`}
              </p>
              <div className="crm-modal-actions">
                <button type="button" className="crm-users-secondary" onClick={() => setConfirmDelete(false)}>
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
