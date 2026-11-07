"use client";

import { useEffect, useId, useRef, useState, useTransition, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDeleteButton } from "@/components/crm/ui/ConfirmDeleteButton";
import { CopyPathButton } from "@/components/crm/ui/CopyPathButton";
import { deleteMedia, updateMedia } from "@/lib/cms/actions";

export type MediaThumbItem = {
  id: string;
  filename: string;
  path: string;
  alt: string;
  caption: string;
  mime: string;
  size: number;
  createdAt: string;
  sizeLabel: string;
  dateLabel: string;
  typeLabel: string;
};

function mimeLabel(mime: string) {
  if (mime.startsWith("image/")) return mime.replace("image/", "").toUpperCase();
  if (mime === "application/pdf") return "PDF";
  return mime || "FILE";
}

export function MediaThumbnailGrid({ items }: { items: MediaThumbItem[] }) {
  const router = useRouter();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<MediaThumbItem | null>(null);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (!active) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  function open(item: MediaThumbItem, event: MouseEvent<HTMLElement>) {
    triggerRef.current = event.currentTarget;
    setStatus("");
    setOk("");
    setActive(item);
  }

  function close() {
    if (pending) return;
    setActive(null);
    setStatus("");
    setOk("");
    queueMicrotask(() => triggerRef.current?.focus());
  }

  return (
    <>
      <ul className="crm-cms-media-grid">
        {items.map((item) => {
          const isImage = item.mime.startsWith("image/");
          return (
            <li key={item.id} className="crm-cms-media-card">
              <button
                type="button"
                className={`crm-cms-media-thumb${isImage ? "" : " is-file"}`}
                title={item.filename}
                aria-label={`เปิด ${item.filename}`}
                onClick={(event) => open(item, event)}
              >
                {isImage ? (
                  <img src={item.path} alt={item.alt || item.filename} loading="lazy" />
                ) : (
                  <span className="crm-cms-media-file-badge">{item.typeLabel || mimeLabel(item.mime)}</span>
                )}
                <span className="crm-cms-media-type">{item.typeLabel || mimeLabel(item.mime)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {active ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={close} />
          <div
            ref={panelRef}
            className="crm-modal-panel crm-modal-panel-user crm-cms-media-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="crm-modal-head crm-modal-head-user">
              <div>
                <p className="crm-modal-eyebrow">Content Management · สื่อ</p>
                <h2 id={titleId} className="crm-modal-title">
                  {active.filename}
                </h2>
                <p className="crm-modal-lead">
                  {active.sizeLabel} · {active.dateLabel} · {active.typeLabel}
                </p>
              </div>
              <button ref={closeRef} type="button" className="crm-modal-close" aria-label="ปิด" onClick={close}>
                ✕
              </button>
            </div>

            <div className="crm-modal-body crm-cms-media-detail">
              {ok ? (
                <p className="crm-users-alert is-ok" role="status">
                  {ok}
                </p>
              ) : null}
              {status ? (
                <p className="crm-users-alert is-warn" role="alert">
                  {status}
                </p>
              ) : null}

              <figure className="crm-cms-media-detail-preview">
                {active.mime.startsWith("image/") ? (
                  <img src={active.path} alt={active.alt || active.filename} />
                ) : (
                  <span className="crm-cms-media-file-badge is-large">{active.typeLabel}</span>
                )}
              </figure>

              <div className="crm-cms-media-detail-path">
                <span className="crm-cms-field">
                  <span>พาธไฟล์</span>
                </span>
                <CopyPathButton path={active.path} />
              </div>

              <form
                className="crm-cms-media-edit"
                action={(formData) => {
                  formData.set("id", active.id);
                  startTransition(async () => {
                    await updateMedia(formData);
                    setActive((current) =>
                      current
                        ? {
                            ...current,
                            alt: String(formData.get("alt") ?? "").trim(),
                            caption: String(formData.get("caption") ?? "").trim(),
                          }
                        : current,
                    );
                    setOk("บันทึกรายละเอียดแล้ว");
                    setStatus("");
                    router.refresh();
                  });
                }}
              >
                <label className="crm-cms-field">
                  <span>Alt text</span>
                  <input
                    className="crm-field"
                    name="alt"
                    defaultValue={active.alt}
                    key={`${active.id}-alt`}
                    placeholder="คำอธิบายรูป"
                  />
                </label>
                <label className="crm-cms-field">
                  <span>คำบรรยาย</span>
                  <input
                    className="crm-field"
                    name="caption"
                    defaultValue={active.caption}
                    key={`${active.id}-caption`}
                    placeholder="caption"
                  />
                </label>
                <div className="crm-cms-media-card-actions">
                  <button className="kpi-button crm-users-primary" type="submit" disabled={pending} aria-busy={pending}>
                    {pending ? "กำลังบันทึก…" : "บันทึก"}
                  </button>
                  <ConfirmDeleteButton
                    action={deleteMedia}
                    fields={{ id: active.id, path: active.path }}
                    itemName={active.filename}
                    eyebrow="Media"
                    title="ลบไฟล์"
                    message={`ยืนยันลบไฟล์ “${active.filename}”? การดำเนินการนี้ย้อนกลับไม่ได้`}
                    buttonLabel="ลบ"
                    confirmLabel="ลบไฟล์"
                    className="crm-users-secondary crm-cms-media-delete"
                  />
                  <button type="button" className="crm-users-secondary" onClick={close} disabled={pending}>
                    ปิด
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
