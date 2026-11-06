"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteClientLogo,
  reorderClientLogos,
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

function IconChevronUp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 14.5 12 8.5l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9.5 12 15.5l6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
  const [rows, setRows] = useState(records);
  const [selectedId, setSelectedId] = useState("");
  const [dragId, setDragId] = useState("");
  const [dropId, setDropId] = useState("");
  const dragMoved = useRef(false);

  useEffect(() => {
    setRows(records);
  }, [records]);

  const nextOrder = records.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;

  function persistOrder(next: CmsClientLogoRow[]) {
    const previous = rows;
    setRows(next);
    startTransition(async () => {
      const result = await reorderClientLogos(next.map((row) => row.id));
      if (!result.ok) {
        setRows(previous);
        setStatus(clientLogoErrorMessage(result.error));
        return;
      }
      setOk("อัปเดตลำดับแสดงแล้ว");
      router.refresh();
    });
  }

  function moveSelected(direction: "up" | "down") {
    if (!selectedId || pending) return;
    const index = rows.findIndex((row) => row.id === selectedId);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= rows.length) return;
    const next = [...rows];
    const swap = next[index];
    next[index] = next[target];
    next[target] = swap;
    persistOrder(next);
  }

  function applyDrop(targetId: string) {
    if (!dragId || dragId === targetId || pending) return;
    const from = rows.findIndex((row) => row.id === dragId);
    const to = rows.findIndex((row) => row.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...rows];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    persistOrder(next);
  }

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
    if (dialog || !selectedId) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSelected("up");
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelected("down");
      } else if (event.key === "Escape") {
        setSelectedId("");
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog, selectedId, rows, pending]);

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

      <section className="crm-logo-table-card" aria-labelledby="crm-logo-list-heading">
        <div className="crm-contact-list-head">
          <div>
            <p className="crm-cms-globals-kicker">Client logos</p>
            <h2 id="crm-logo-list-heading">
              รายการโลโก้
              <span className="crm-leads-count">{rows.length}</span>
            </h2>
            <p>จัดการรูป ชื่อ และลิงก์เว็บไซต์ — คลิกหรือลากโลโก้เพื่อจัดลำดับ · โลโก้ที่บันทึกจะขึ้นหน้าเว็บทันที</p>
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

        {rows.length === 0 ? (
          <div className="crm-logo-empty">
            <p>ยังไม่มีโลโก้ในระบบ</p>
            <p>เพิ่มโลโก้แล้วจะแสดงบนหน้าเว็บทันที</p>
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
                  <th scope="col">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const host = websiteDisplayHost(row.websiteUrl);
                  const href = normalizeWebsiteUrl(row.websiteUrl);
                  const label = publicClientLabel(row);
                  const selected = selectedId === row.id;
                  return (
                    <tr
                      key={row.id}
                      className={[
                        selected ? "is-selected" : "",
                        dragId === row.id ? "is-dragging" : "",
                        dropId === row.id && dragId && dragId !== row.id ? "is-drop-target" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onDragOver={(event) => {
                        if (!dragId || dragId === row.id) return;
                        event.preventDefault();
                        setDropId(row.id);
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        applyDrop(row.id);
                        setDragId("");
                        setDropId("");
                        dragMoved.current = false;
                      }}
                    >
                      <td data-label="โลโก้">
                        <div className="crm-logo-reorder-cell">
                          <button
                            type="button"
                            className={`crm-logo-thumb${selected ? " is-selected" : ""}`}
                            draggable={!pending}
                            title="คลิกเพื่อเลือก แล้วกดขึ้น/ลง หรือลากเพื่อจัดลำดับ"
                            aria-label={`เลือก ${row.name} เพื่อจัดลำดับ`}
                            aria-pressed={selected}
                            onClick={() => {
                              if (dragMoved.current) {
                                dragMoved.current = false;
                                return;
                              }
                              setSelectedId((current) => (current === row.id ? "" : row.id));
                              setConfirmId("");
                            }}
                            onDragStart={(event) => {
                              dragMoved.current = false;
                              setDragId(row.id);
                              setSelectedId(row.id);
                              setConfirmId("");
                              event.dataTransfer.effectAllowed = "move";
                              event.dataTransfer.setData("text/plain", row.id);
                            }}
                            onDrag={(event) => {
                              if (Math.abs(event.movementX) + Math.abs(event.movementY) > 2) {
                                dragMoved.current = true;
                              }
                            }}
                            onDragEnd={() => {
                              setDragId("");
                              setDropId("");
                            }}
                          >
                            <LogoThumb
                              src={row.filePath}
                              alt={row.filePath ? publicClientAlt(row) : CLIENT_LOGO_PLACEHOLDER_TEXT}
                            />
                          </button>
                          {selected ? (
                            <div className="crm-logo-reorder" role="group" aria-label={`จัดลำดับ ${row.name}`}>
                              <button
                                type="button"
                                className="crm-users-icon-btn"
                                title="เลื่อนขึ้น"
                                aria-label={`เลื่อน ${row.name} ขึ้น`}
                                disabled={pending || index === 0}
                                onClick={() => moveSelected("up")}
                              >
                                <IconChevronUp />
                              </button>
                              <button
                                type="button"
                                className="crm-users-icon-btn"
                                title="เลื่อนลง"
                                aria-label={`เลื่อน ${row.name} ลง`}
                                disabled={pending || index === rows.length - 1}
                                onClick={() => moveSelected("down")}
                              >
                                <IconChevronDown />
                              </button>
                            </div>
                          ) : null}
                        </div>
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
                  permission: "approved",
                  isActive: true,
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
                const invalid = validateClientLogoInput({
                  ...next,
                  filePath: next.filePath || (uploading ? "pending-upload" : ""),
                });
                if (invalid) {
                  setStatus(clientLogoErrorMessage(invalid));
                  return;
                }
                formData.set("permission", "approved");
                formData.set("isActive", "1");
                formData.set("filePath", next.filePath);
                formData.set("websiteUrl", next.websiteUrl);
                if (next.id) formData.set("id", next.id);
                startTransition(async () => {
                  const result = await saveClientLogo(formData);
                  if (!result.ok) {
                    setStatus(clientLogoErrorMessage(result.error));
                    return;
                  }
                  setOk("บันทึกโลโก้แล้ว — แสดงบนหน้าเว็บแล้ว");
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
                    <Field label="ลำดับแสดง" hint="หรือลากโลโก้ในตารางเพื่อจัดลำดับ">
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
                    <p className="crm-logo-publish-note is-on">โลโก้ที่มีไฟล์จะแสดงบนหน้าเว็บทันทีหลังบันทึก</p>
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
                    <input type="hidden" name="permission" value="approved" />
                    <input type="hidden" name="isActive" value="1" />
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
