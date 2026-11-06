"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia } from "@/lib/cms/actions";

export function UploadMediaButton({
  autoOpen = false,
  className = "kpi-button crm-users-primary",
  label = "อัปโหลดไฟล์",
}: {
  autoOpen?: boolean;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const titleId = useId();
  const openRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(autoOpen);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (autoOpen) {
      setOpen(true);
      router.replace("/crm/cms/media", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpen]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") requestClose();
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
  }, [open]);

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function requestClose() {
    if (pending) return;
    setOpen(false);
    setStatus("");
    setFileName("");
    setPreview((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return "";
    });
    queueMicrotask(() => openRef.current?.focus());
  }

  return (
    <>
      <button ref={openRef} type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>

      {open ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={requestClose} />
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
                  อัปโหลดไฟล์ใหม่
                </h2>
                <p className="crm-modal-lead">รองรับ JPG · PNG · WEBP · GIF · SVG · PDF — เก็บที่ `/media/cms`</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className="crm-modal-close"
                aria-label="ปิด"
                onClick={requestClose}
              >
                ✕
              </button>
            </div>

            <form
              className="crm-modal-form crm-modal-form-user"
              encType="multipart/form-data"
              action={(formData) => {
                const file = formData.get("file");
                if (!(file instanceof File) || !file.size) {
                  setStatus("เลือกไฟล์ก่อนอัปโหลด");
                  return;
                }
                startTransition(async () => {
                  await uploadMedia(formData);
                });
              }}
            >
              <div className="crm-modal-body">
                {status ? (
                  <p className="crm-users-alert is-warn" role="alert">
                    {status}
                  </p>
                ) : null}

                <label className="crm-cms-media-drop">
                  <span className="crm-cms-media-drop-mark" aria-hidden="true">
                    ↑
                  </span>
                  <span className="crm-cms-media-drop-title">
                    {fileName || "เลือกไฟล์จากเครื่อง"}
                  </span>
                  <span className="crm-cms-media-drop-hint">JPG · PNG · WEBP · GIF · SVG · PDF</span>
                  <input
                    className="crm-cms-media-file"
                    type="file"
                    name="file"
                    accept="image/*,.pdf"
                    required
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setStatus("");
                      setFileName(file?.name ?? "");
                      setPreview((current) => {
                        if (current.startsWith("blob:")) URL.revokeObjectURL(current);
                        if (file && file.type.startsWith("image/")) return URL.createObjectURL(file);
                        return "";
                      });
                    }}
                  />
                </label>

                {preview ? (
                  <figure className="crm-cms-media-upload-preview">
                    <img src={preview} alt={fileName || "พรีวิวไฟล์"} />
                    <figcaption>พรีวิวไฟล์ใหม่ — ยังไม่ได้บันทึก</figcaption>
                  </figure>
                ) : null}

                <label className="crm-cms-field">
                  <span>Alt text</span>
                  <input className="crm-field" name="alt" placeholder="คำอธิบายรูปสำหรับ SEO / accessibility" />
                </label>
                <label className="crm-cms-field">
                  <span>คำบรรยาย</span>
                  <input className="crm-field" name="caption" placeholder="ใช้ประกอบในหน้าเว็บ (ถ้ามี)" />
                </label>
              </div>

              <div className="crm-modal-actions crm-modal-actions-bar">
                <button type="button" className="crm-users-secondary" onClick={requestClose} disabled={pending}>
                  ยกเลิก
                </button>
                <button className="kpi-button crm-users-primary" type="submit" disabled={pending} aria-busy={pending}>
                  {pending ? "กำลังอัปโหลด…" : "อัปโหลดไฟล์"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
