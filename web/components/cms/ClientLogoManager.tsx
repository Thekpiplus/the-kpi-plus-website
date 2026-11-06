"use client";

import { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteClientLogo,
  moveClientLogo,
  saveClientLogo,
} from "@/lib/cms/client-logo-actions";
import {
  CLIENT_LOGO_CANVAS,
  CLIENT_LOGO_HINT,
  CLIENT_LOGO_IMAGE_TYPES,
  CLIENT_LOGO_PLACEHOLDER,
  CLIENT_LOGO_PLACEHOLDER_TEXT,
  MAX_CLIENT_LOGO_BYTES,
  canPublishClientLogo,
  clientLogoErrorMessage,
  emptyClientLogoInput,
  inputFromRow,
  normalizeWebsiteUrl,
  permissionLabel,
  publicClientAlt,
  publicClientLabel,
  validateClientLogoInput,
  websiteDisplayHost,
  type ClientLogoSaveInput,
} from "@/lib/cms/client-logos";
import type { CmsClientLogoRow } from "@/lib/cms/types";

type DialogMode = "create" | "edit" | null;

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

function LogoThumb({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  useEffect(() => {
    setBroken(false);
  }, [src]);
  const hasFile = Boolean(src) && !broken;
  return (
    <span className={className ?? "crm-logo-thumb-frame"}>
      <img
        src={hasFile ? src : CLIENT_LOGO_PLACEHOLDER}
        alt={hasFile ? alt || "Client logo" : CLIENT_LOGO_PLACEHOLDER_TEXT}
        width={CLIENT_LOGO_CANVAS.width}
        height={CLIENT_LOGO_CANVAS.height}
        onError={() => setBroken(true)}
      />
    </span>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="crm-cms-field" htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function ClientLogoManager({
  records,
  notice,
  error,
  autoOpenCreate = false,
}: {
  records: CmsClientLogoRow[];
  notice?: string;
  error?: string;
  autoOpenCreate?: boolean;
}) {
  const router = useRouter();
  const titleId = useId();
  const nameId = useId();
  const websiteId = useId();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [dialog, setDialog] = useState<DialogMode>(autoOpenCreate ? "create" : null);
  const [form, setForm] = useState<ClientLogoSaveInput>(() =>
    emptyClientLogoInput(records.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1),
  );
  const [baseline, setBaseline] = useState(form);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState(clientLogoErrorMessage(error));
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState("");
  const [hasNewFile, setHasNewFile] = useState(false);

  const counts = useMemo(
    () => ({
      pending: records.filter((row) => row.permission === "pending").length,
      approved: records.filter((row) => row.permission === "approved").length,
      rejected: records.filter((row) => row.permission === "rejected").length,
      public: records.filter((row) => canPublishClientLogo(row)).length,
    }),
    [records],
  );

  const nextOrder = records.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;

  const dirty =
    JSON.stringify(form) !== JSON.stringify(baseline) ||
    hasNewFile ||
    Boolean(preview && preview !== form.filePath);

  useEffect(() => {
    if (autoOpenCreate) {
      triggerRef.current = openButtonRef.current;
      openCreate();
      router.replace("/crm/cms/client-logos", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open once from ?new=1
  }, [autoOpenCreate]);

  useEffect(() => {
    if (!dialog) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        requestClose();
        return;
      }
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
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  function patch<K extends keyof ClientLogoSaveInput>(key: K, value: ClientLogoSaveInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setOk("");
    setStatus("");
  }

  function openCreate(event?: React.MouseEvent<HTMLElement>) {
    triggerRef.current = event?.currentTarget ?? openButtonRef.current;
    const blank = emptyClientLogoInput(nextOrder);
    setForm(blank);
    setBaseline(blank);
    setPreview("");
    setHasNewFile(false);
    setStatus("");
    setOk("");
    setConfirmId("");
    setDialog("create");
  }

  function openEdit(row: CmsClientLogoRow, event?: React.MouseEvent<HTMLElement>) {
    triggerRef.current = event?.currentTarget ?? openButtonRef.current;
    const next = inputFromRow(row);
    setForm(next);
    setBaseline(next);
    setPreview(next.filePath);
    setHasNewFile(false);
    setStatus("");
    setOk("");
    setConfirmId("");
    setDialog("edit");
  }

  function closeDialog() {
    setDialog(null);
    setStatus("");
    setPreview("");
    setHasNewFile(false);
    queueMicrotask(() => {
      const target = triggerRef.current ?? openButtonRef.current;
      target?.focus();
    });
  }

  function requestClose() {
    if (pending) return;
    if (dirty && !window.confirm("มีการแก้ไขที่ยังไม่บันทึก ต้องการปิดฟอร์มหรือไม่?")) return;
    closeDialog();
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const dot = file.name.lastIndexOf(".");
    const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
    if (!CLIENT_LOGO_IMAGE_TYPES.has(ext) || file.size > MAX_CLIENT_LOGO_BYTES) {
      setHasNewFile(false);
      setStatus(clientLogoErrorMessage("invalid_image"));
      setOk("");
      return;
    }
    setHasNewFile(true);
    setPreview((current) => {
      if (current.startsWith("blob:")) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setOk("");
    setStatus("");
  }

  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const willPublish = canPublishClientLogo({
    ...form,
    filePath: form.filePath || (hasNewFile ? "/media/cms/_pending" : ""),
  });
  const permissionDirty = dialog === "edit" && form.permission !== baseline.permission;

  return (
    <div className="crm-logo-layout">
      {ok ? (
        <p className="crm-users-alert is-ok" role="status">
          {ok}
        </p>
      ) : null}
      {status && !dialog ? (
        <p className="crm-users-alert is-warn" role="alert">
          {status}
        </p>
      ) : null}

      <section className="crm-dash-summary" aria-label="สรุปสถานะโลโก้">
        <div className="crm-dash-stats" role="list">
          <article className="crm-dash-stat is-partners" role="listitem">
            <span className="crm-dash-stat-label">Pending</span>
            <strong className="crm-dash-stat-value">{counts.pending}</strong>
            <span className="crm-dash-stat-hint">รออนุญาต</span>
          </article>
          <article className="crm-dash-stat is-today" role="listitem">
            <span className="crm-dash-stat-label">Approved</span>
            <strong className="crm-dash-stat-value">{counts.approved}</strong>
            <span className="crm-dash-stat-hint">อนุมัติแล้ว</span>
          </article>
          <article className="crm-dash-stat is-overdue" role="listitem">
            <span className="crm-dash-stat-label">Rejected</span>
            <strong className="crm-dash-stat-value">{counts.rejected}</strong>
            <span className="crm-dash-stat-hint">ไม่อนุญาต</span>
          </article>
          <article className="crm-dash-stat is-web" role="listitem">
            <span className="crm-dash-stat-label">Public</span>
            <strong className="crm-dash-stat-value">{counts.public}</strong>
            <span className="crm-dash-stat-hint">Approved + Active</span>
          </article>
        </div>
      </section>

      <section className="crm-logo-table-card" aria-labelledby="crm-logo-list-heading">
        <div className="crm-contact-list-head">
          <div>
            <p className="crm-cms-globals-kicker">Client logos</p>
            <h2 id="crm-logo-list-heading">
              รายการโลโก้
              <span className="crm-leads-count">{records.length}</span>
            </h2>
            <p>จัดการรูป ชื่อ และลิงก์เว็บไซต์ — Pending/Rejected จะไม่ขึ้นสาธารณะจนกว่าจะ Approved และ Active</p>
          </div>
          <button
            ref={openButtonRef}
            type="button"
            className="kpi-button crm-users-primary"
            onClick={(event) => openCreate(event)}
          >
            เพิ่มโลโก้
          </button>
        </div>

        {records.length === 0 ? (
          <div className="crm-logo-empty">
            <p>ยังไม่มีโลโก้ในระบบ</p>
            <p>เพิ่มไฟล์ที่ได้รับอนุญาตจริงเท่านั้น</p>
            <button type="button" className="kpi-button crm-users-primary" onClick={(event) => openCreate(event)}>
              เพิ่มโลโก้
            </button>
          </div>
        ) : (
          <div className="crm-logo-table-wrap">
            <table className="crm-logo-table">
              <thead>
                <tr>
                  <th scope="col">โลโก้</th>
                  <th scope="col">ชื่อ</th>
                  <th scope="col">เว็บไซต์</th>
                  <th scope="col">ลำดับ</th>
                  <th scope="col">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {records.map((row) => {
                  const host = websiteDisplayHost(row.websiteUrl);
                  const href = normalizeWebsiteUrl(row.websiteUrl);
                  const label = publicClientLabel(row);
                  return (
                    <tr key={row.id}>
                      <td data-label="โลโก้">
                        <button
                          type="button"
                          className="crm-logo-thumb"
                          onClick={(event) => openEdit(row, event)}
                          aria-label={`แก้ไข ${row.name}`}
                        >
                          <LogoThumb src={row.filePath} alt={row.filePath ? publicClientAlt(row) : CLIENT_LOGO_PLACEHOLDER_TEXT} />
                        </button>
                      </td>
                      <td data-label="ชื่อ">
                        <button type="button" className="crm-logo-name" onClick={(event) => openEdit(row, event)}>
                          {row.name}
                        </button>
                        {label && label !== row.name ? (
                          <p className="crm-logo-secondary">{label}</p>
                        ) : null}
                      </td>
                      <td data-label="เว็บไซต์">
                        {href.ok && href.url ? (
                          <a
                            className="crm-logo-site"
                            href={href.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {host || href.url}
                          </a>
                        ) : (
                          <span className="crm-logo-secondary">—</span>
                        )}
                      </td>
                      <td data-label="ลำดับ">
                        <div className="crm-logo-order">
                          <span>{row.sortOrder}</span>
                          <form action={moveClientLogo}>
                            <input type="hidden" name="id" value={row.id} />
                            <input type="hidden" name="direction" value="up" />
                            <button
                              type="submit"
                              className="crm-users-secondary"
                              disabled={records[0]?.id === row.id}
                              aria-label={`เลื่อน ${row.name} ขึ้น`}
                            >
                              ขึ้น
                            </button>
                          </form>
                          <form action={moveClientLogo}>
                            <input type="hidden" name="id" value={row.id} />
                            <input type="hidden" name="direction" value="down" />
                            <button
                              type="submit"
                              className="crm-users-secondary"
                              disabled={records[records.length - 1]?.id === row.id}
                              aria-label={`เลื่อน ${row.name} ลง`}
                            >
                              ลง
                            </button>
                          </form>
                        </div>
                      </td>
                      <td data-label="การดำเนินการ">
                        <div className="crm-logo-row-actions crm-users-icon-actions">
                          {confirmId === row.id ? (
                            <div className="crm-contact-inline-confirm" role="status">
                              <p>
                                ยืนยันลบ “{row.name}”?
                                {canPublishClientLogo(row) ? " โลโก้นี้กำลังเผยแพร่สาธารณะอยู่" : ""}
                              </p>
                              <div>
                                <button type="button" className="crm-users-secondary" onClick={() => setConfirmId("")}>
                                  ยกเลิก
                                </button>
                                <form action={deleteClientLogo}>
                                  <input type="hidden" name="id" value={row.id} />
                                  <button className="kpi-button crm-users-delete-btn" type="submit">
                                    ลบโลโก้
                                  </button>
                                </form>
                              </div>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="crm-users-icon-btn"
                                title="แก้ไข"
                                aria-label={`แก้ไข ${row.name}`}
                                onClick={(event) => openEdit(row, event)}
                              >
                                <IconEdit />
                              </button>
                              <button
                                type="button"
                                className="crm-users-icon-btn is-danger"
                                title="ลบ"
                                aria-label={`ลบ ${row.name}`}
                                onClick={() => setConfirmId(row.id)}
                              >
                                <IconTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {dialog ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={requestClose} />
          <div
            ref={panelRef}
            className="crm-modal-panel crm-modal-panel-user crm-logo-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="crm-modal-head crm-modal-head-user">
              <div>
                <p className="crm-modal-eyebrow">Content Management · โลโก้ลูกค้า</p>
                <h2 id={titleId} className="crm-modal-title">
                  {dialog === "create" ? "เพิ่มโลโก้" : "แก้ไขโลโก้"}
                </h2>
                <p className="crm-modal-lead">
                  {dialog === "create"
                    ? "อัปโหลดรูป ใส่ชื่อ และลิงก์เว็บไซต์ (ไม่บังคับ)"
                    : `แก้ไขข้อมูลของ ${form.name || "โลโก้"}`}
                </p>
              </div>
              <button
                ref={closeButtonRef}
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
              action={(formData) => {
                const next: ClientLogoSaveInput = {
                  ...form,
                  name: String(formData.get("name") ?? form.name).trim(),
                  clientName: String(formData.get("clientName") ?? form.clientName).trim(),
                  anonymisedLabel: String(formData.get("anonymisedLabel") ?? form.anonymisedLabel).trim(),
                  websiteUrl: String(formData.get("websiteUrl") ?? form.websiteUrl).trim(),
                  altText: String(formData.get("altText") ?? form.altText).trim(),
                  sortOrder: Number.parseInt(String(formData.get("sortOrder") ?? form.sortOrder), 10) || 0,
                  permission: form.permission,
                  isActive: form.isActive,
                  adminNotes: String(formData.get("adminNotes") ?? form.adminNotes).trim(),
                  filePath: form.filePath,
                  id: form.id,
                };
                const file = formData.get("logoFile");
                const uploading = file instanceof File && file.size > 0;
                const website = normalizeWebsiteUrl(next.websiteUrl);
                if (next.websiteUrl && !website.ok) {
                  setStatus(clientLogoErrorMessage("invalid_website"));
                  return;
                }
                next.websiteUrl = website.ok ? website.url : "";
                const invalid = validateClientLogoInput(next);
                if (invalid === "cannot_approve_without_logo" && uploading) {
                  // File will be stored server-side before approve check.
                } else if (invalid) {
                  setStatus(clientLogoErrorMessage(invalid));
                  return;
                }
                formData.set("permission", next.permission);
                formData.set("isActive", next.isActive ? "1" : "0");
                formData.set("filePath", next.filePath);
                formData.set("websiteUrl", next.websiteUrl);
                if (next.id) formData.set("id", next.id);
                startTransition(async () => {
                  const result = await saveClientLogo(formData);
                  if (!result.ok) {
                    setStatus(clientLogoErrorMessage(result.error));
                    return;
                  }
                  setOk("บันทึกโลโก้แล้ว");
                  setBaseline(next);
                  setHasNewFile(false);
                  closeDialog();
                  router.replace("/crm/cms/client-logos?saved=1");
                  router.refresh();
                });
              }}
            >
              <div className="crm-modal-body">
                {status ? (
                  <p className="crm-users-alert is-warn" role="alert">
                    {status}
                  </p>
                ) : null}
                {permissionDirty ? (
                  <p className="crm-users-alert is-warn" role="status">
                    สิทธิ์เผยแพร่เปลี่ยนเป็น {permissionLabel(form.permission)} — กดบันทึกเพื่อยืนยัน
                  </p>
                ) : null}

                <div className="crm-logo-editor-grid">
                  <div className="crm-logo-editor-fields">
                    <Field label="ชื่อโลโก้" htmlFor={nameId}>
                      <input
                        id={nameId}
                        className="crm-field"
                        name="name"
                        value={form.name}
                        onChange={(event) => patch("name", event.target.value)}
                        required
                        autoFocus
                      />
                    </Field>
                    <div className="crm-contact-pair">
                      <Field label="ชื่อลูกค้า" hint="ใส่ชื่อจริงเมื่อได้รับอนุญาตให้ระบุ">
                        <input
                          className="crm-field"
                          name="clientName"
                          value={form.clientName}
                          onChange={(event) => patch("clientName", event.target.value)}
                        />
                      </Field>
                      <Field label="ป้ายนิรนาม" hint="ใช้แทนชื่อลูกค้าบนหน้าสาธารณะได้">
                        <input
                          className="crm-field"
                          name="anonymisedLabel"
                          value={form.anonymisedLabel}
                          onChange={(event) => patch("anonymisedLabel", event.target.value)}
                        />
                      </Field>
                    </div>
                    <Field label="ลิงก์เว็บไซต์" hint="ไม่บังคับ — ใช้ http หรือ https เท่านั้น" htmlFor={websiteId}>
                      <input
                        id={websiteId}
                        className="crm-field"
                        name="websiteUrl"
                        type="url"
                        inputMode="url"
                        placeholder="https://example.com"
                        value={form.websiteUrl}
                        onChange={(event) => patch("websiteUrl", event.target.value)}
                      />
                    </Field>
                    <Field label="Alt text" hint="ถ้าเว้นว่าง ระบบจะใช้ชื่อลูกค้า/โลโก้ประกอบคำว่า logo">
                      <input
                        className="crm-field"
                        name="altText"
                        value={form.altText}
                        onChange={(event) => patch("altText", event.target.value)}
                      />
                    </Field>
                    <div className="crm-contact-pair">
                      <Field label="ลำดับแสดง">
                        <input
                          className="crm-field"
                          name="sortOrder"
                          type="number"
                          min={0}
                          value={form.sortOrder}
                          onChange={(event) =>
                            patch("sortOrder", Number.parseInt(event.target.value || "0", 10) || 0)
                          }
                        />
                      </Field>
                      <Field label="สิทธิ์เผยแพร่" hint="ต้องกดบันทึกหลังเปลี่ยนค่านี้">
                        <select
                          className="crm-field"
                          value={form.permission}
                          onChange={(event) =>
                            patch("permission", event.target.value as ClientLogoSaveInput["permission"])
                          }
                        >
                          <option value="pending">Pending — รออนุญาต</option>
                          <option value="approved">Approved — อนุมัติเผยแพร่</option>
                          <option value="rejected">Rejected — ไม่อนุญาต</option>
                        </select>
                      </Field>
                    </div>
                    <label className="crm-contact-primary">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(event) => patch("isActive", event.target.checked)}
                      />
                      เปิดใช้งาน (Active)
                    </label>
                    <p className={`crm-logo-publish-note${willPublish ? " is-on" : ""}`}>
                      {willPublish
                        ? "ชุดนี้จะแสดงบนหน้าสาธารณะหลังบันทึก"
                        : "ชุดนี้จะไม่แสดงบนหน้าสาธารณะ จนกว่าจะเป็น Approved + Active และมีไฟล์โลโก้"}
                    </p>
                    <Field label="หมายเหตุภายใน (เห็นเฉพาะแอดมิน)">
                      <textarea
                        className="crm-area"
                        name="adminNotes"
                        rows={3}
                        value={form.adminNotes}
                        onChange={(event) => patch("adminNotes", event.target.value)}
                      />
                    </Field>
                  </div>

                  <div className="crm-logo-editor-media">
                    <Field label="ไฟล์โลโก้" hint={CLIENT_LOGO_HINT}>
                      <input
                        ref={fileInputRef}
                        className="crm-field"
                        type="file"
                        name="logoFile"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          const dot = file.name.lastIndexOf(".");
                          const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
                          if (!CLIENT_LOGO_IMAGE_TYPES.has(ext) || file.size > MAX_CLIENT_LOGO_BYTES) {
                            event.target.value = "";
                            setHasNewFile(false);
                            setStatus(clientLogoErrorMessage("invalid_image"));
                            setOk("");
                            return;
                          }
                          onFile(file);
                        }}
                      />
                      {form.filePath ? (
                        <label className="crm-contact-clear">
                          <input
                            type="checkbox"
                            name="clearLogoFile"
                            value="1"
                            onChange={(event) => {
                              if (event.target.checked) {
                                patch("filePath", "");
                                setPreview("");
                                setHasNewFile(false);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }
                            }}
                          />
                          ลบไฟล์โลโก้เมื่อบันทึก
                        </label>
                      ) : null}
                    </Field>
                    <figure className="crm-logo-preview">
                      <LogoThumb
                        src={preview || form.filePath}
                        alt={publicClientAlt(form)}
                        className="crm-logo-preview-frame"
                      />
                      <figcaption>
                        {hasNewFile || (preview && preview !== form.filePath)
                          ? "พรีวิวไฟล์ใหม่ — ยังไม่ได้บันทึก"
                          : form.filePath
                            ? "รูปที่บันทึกไว้"
                            : CLIENT_LOGO_PLACEHOLDER_TEXT}
                      </figcaption>
                    </figure>
                    <input type="hidden" name="filePath" value={form.filePath} />
                    <input type="hidden" name="permission" value={form.permission} />
                    <input type="hidden" name="isActive" value={form.isActive ? "1" : "0"} />
                    {form.id ? <input type="hidden" name="id" value={form.id} /> : null}
                  </div>
                </div>
              </div>

              <div className="crm-modal-actions crm-modal-actions-bar">
                <button type="button" className="crm-users-secondary" onClick={requestClose} disabled={pending}>
                  ยกเลิก
                </button>
                <button className="kpi-button crm-users-primary" type="submit" disabled={pending} aria-busy={pending}>
                  {pending ? "กำลังบันทึก…" : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
