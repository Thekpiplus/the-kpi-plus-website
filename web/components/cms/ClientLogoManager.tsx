"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteClientLogo,
  moveClientLogo,
  saveClientLogo,
  setClientLogoActive,
} from "@/lib/cms/client-logo-actions";
import {
  CLIENT_LOGO_CANVAS,
  CLIENT_LOGO_HINT,
  CLIENT_LOGO_PLACEHOLDER,
  CLIENT_LOGO_PLACEHOLDER_TEXT,
  canPublishClientLogo,
  clientLogoErrorMessage,
  emptyClientLogoInput,
  permissionLabel,
  permissionLabelTh,
  publicClientAlt,
  publicClientLabel,
  validateClientLogoInput,
  type ClientLogoSaveInput,
} from "@/lib/cms/client-logos";
import type { CmsClientLogoRow } from "@/lib/cms/types";

function LogoPreview({ src, alt, unsaved }: { src: string; alt: string; unsaved?: boolean }) {
  const [meta, setMeta] = useState("");
  const hasFile = Boolean(src);
  return (
    <figure className="crm-logo-preview">
      <img
        src={hasFile ? src : CLIENT_LOGO_PLACEHOLDER}
        alt={hasFile ? alt || "Client logo preview" : CLIENT_LOGO_PLACEHOLDER_TEXT}
        width={CLIENT_LOGO_CANVAS.width}
        height={CLIENT_LOGO_CANVAS.height}
        onLoad={(event) => {
          const img = event.currentTarget;
          setMeta(`${img.naturalWidth}×${img.naturalHeight} px`);
        }}
      />
      <figcaption>
        {hasFile ? meta || "กำลังอ่านขนาดรูป…" : CLIENT_LOGO_PLACEHOLDER_TEXT}
        {unsaved ? " · ยังไม่ได้บันทึก" : ""}
      </figcaption>
    </figure>
  );
}

function StatusBadge({ permission }: { permission: string }) {
  return (
    <span className={`crm-logo-badge is-${permission}`}>
      {permissionLabel(permission)}
      <small>{permissionLabelTh(permission)}</small>
    </span>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="crm-cms-field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function ClientLogoManager({
  records,
  selected,
  creating,
  notice,
  error,
}: {
  records: CmsClientLogoRow[];
  selected: ClientLogoSaveInput;
  creating: boolean;
  notice?: string;
  error?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ClientLogoSaveInput>(selected);
  const [preview, setPreview] = useState(selected.filePath);
  const [status, setStatus] = useState(clientLogoErrorMessage(error));
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState("");

  const counts = useMemo(
    () => ({
      pending: records.filter((row) => row.permission === "pending").length,
      approved: records.filter((row) => row.permission === "approved").length,
      rejected: records.filter((row) => row.permission === "rejected").length,
      public: records.filter((row) => canPublishClientLogo(row)).length,
    }),
    [records],
  );

  const permissionDirty = !creating && form.permission !== selected.permission;
  const willPublish = canPublishClientLogo(form);
  const nextOrder = records.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1;

  function patch<K extends keyof ClientLogoSaveInput>(key: K, value: ClientLogoSaveInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setOk("");
    setStatus("");
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    patch("filePath", selected.filePath);
    setPreview(URL.createObjectURL(file));
  }

  function selectRow(id: string) {
    setConfirmId("");
    router.push(`/crm/cms/client-logos?id=${id}`);
  }

  function startCreate() {
    setForm({ ...emptyClientLogoInput(nextOrder) });
    setPreview("");
    setOk("");
    setStatus("");
    setConfirmId("");
    router.push("/crm/cms/client-logos?new=1");
  }

  return (
    <div className="crm-logo-layout">
      <div className="crm-logo-board" aria-label="สรุปสิทธิ์เผยแพร่">
        <article>
          <p>Pending</p>
          <strong>{counts.pending}</strong>
          <span>รออนุญาต — ไม่แสดงสาธารณะ</span>
        </article>
        <article>
          <p>Approved</p>
          <strong>{counts.approved}</strong>
          <span>อนุมัติแล้ว — แสดงเมื่อเปิดใช้งาน</span>
        </article>
        <article>
          <p>Rejected</p>
          <strong>{counts.rejected}</strong>
          <span>ไม่อนุญาต — ไม่แสดงสาธารณะ</span>
        </article>
        <article>
          <p>Public</p>
          <strong>{counts.public}</strong>
          <span>Approved + Active บนหน้าเว็บ</span>
        </article>
      </div>

      <section className="crm-logo-table-card" aria-label="รายการโลโก้ลูกค้า">
        <div className="crm-contact-list-head">
          <div>
            <p className="crm-cms-globals-kicker">Client logos</p>
            <h2>ตารางจัดการโลโก้</h2>
            <p>Pending และ Rejected จะไม่ขึ้นบนหน้าสาธารณะ จนกว่าจะบันทึกเป็น Approved และเปิดใช้งาน</p>
          </div>
          <button type="button" className="kpi-button" onClick={startCreate}>
            เพิ่มโลโก้
          </button>
        </div>

        {records.length === 0 ? (
          <p className="crm-cms-globals-card-body">ยังไม่มีโลโก้ในระบบ — เพิ่มไฟล์ที่ได้รับอนุญาตจริงเท่านั้น</p>
        ) : (
          <div className="crm-logo-table-wrap">
            <table className="crm-logo-table">
              <thead>
                <tr>
                  <th>พรีวิว</th>
                  <th>ชื่อโลโก้</th>
                  <th>ลูกค้า</th>
                  <th>สิทธิ์เผยแพร่</th>
                  <th>สถานะ</th>
                  <th>ลำดับ</th>
                  <th>การทำงาน</th>
                </tr>
              </thead>
              <tbody>
                {records.map((row, index) => {
                  const selectedRow = row.id === form.id;
                  return (
                    <tr key={row.id} className={selectedRow ? "is-active" : ""}>
                      <td>
                        <button type="button" className="crm-logo-thumb" onClick={() => selectRow(row.id)}>
                          <img
                            src={row.filePath || CLIENT_LOGO_PLACEHOLDER}
                            alt={row.filePath ? publicClientAlt(row) : CLIENT_LOGO_PLACEHOLDER_TEXT}
                            width={CLIENT_LOGO_CANVAS.width}
                            height={CLIENT_LOGO_CANVAS.height}
                          />
                        </button>
                      </td>
                      <td>
                        <button type="button" className="crm-logo-name" onClick={() => selectRow(row.id)}>
                          {row.name}
                        </button>
                      </td>
                      <td>{publicClientLabel(row)}</td>
                      <td>
                        <StatusBadge permission={row.permission} />
                      </td>
                      <td>
                        <span className={`crm-logo-state${row.isActive ? " is-on" : ""}`}>
                          {row.isActive ? "Active" : "Inactive"}
                        </span>
                        {canPublishClientLogo(row) ? <small className="crm-logo-public-flag">Public</small> : null}
                      </td>
                      <td>
                        <div className="crm-logo-order">
                          <span>{row.sortOrder}</span>
                          <form action={moveClientLogo}>
                            <input type="hidden" name="id" value={row.id} />
                            <input type="hidden" name="direction" value="up" />
                            <button type="submit" className="crm-users-secondary" disabled={index === 0}>
                              ขึ้น
                            </button>
                          </form>
                          <form action={moveClientLogo}>
                            <input type="hidden" name="id" value={row.id} />
                            <input type="hidden" name="direction" value="down" />
                            <button type="submit" className="crm-users-secondary" disabled={index === records.length - 1}>
                              ลง
                            </button>
                          </form>
                        </div>
                      </td>
                      <td>
                        <div className="crm-logo-row-actions">
                          <button type="button" className="crm-cms-inline-link" onClick={() => selectRow(row.id)}>
                            แก้ไข
                          </button>
                          <form action={setClientLogoActive}>
                            <input type="hidden" name="id" value={row.id} />
                            <input type="hidden" name="isActive" value={row.isActive ? "0" : "1"} />
                            <button type="submit" className="crm-cms-inline-link">
                              {row.isActive ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                            </button>
                          </form>
                          {confirmId === row.id ? (
                            <div className="crm-contact-inline-confirm" role="status">
                              <p>ยืนยันลบ “{row.name}”? โลโก้นี้จะหายจากหน้าสาธารณะทันที</p>
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
                            <button type="button" className="crm-cms-inline-link crm-cs-delete-link" onClick={() => setConfirmId(row.id)}>
                              ลบ
                            </button>
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

      <section className="crm-logo-editor" aria-label={creating ? "เพิ่มโลโก้ลูกค้า" : "แก้ไขโลโก้ลูกค้า"}>
        <div className="crm-cms-globals-panel-head">
          <div>
            <p className="crm-cms-globals-kicker">{creating ? "เพิ่มใหม่" : "แก้ไข"}</p>
            <h2>{creating ? "โลโก้ลูกค้าใหม่" : form.name || "แก้ไขโลโก้"}</h2>
            <p>เปลี่ยนสิทธิ์เผยแพร่แล้วต้องกดบันทึก ระบบจะไม่ใช้ค่าที่ยังไม่เซฟ</p>
          </div>
          <StatusBadge permission={form.permission} />
        </div>

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
        {permissionDirty ? (
          <p className="crm-users-alert is-warn" role="status">
            สิทธิ์เผยแพร่เปลี่ยนเป็น {permissionLabel(form.permission)} — กดบันทึกเพื่อยืนยัน การเปลี่ยนนี้ยังไม่มีผล
          </p>
        ) : null}

        <form
          className="crm-contact-form crm-logo-form"
          action={(formData) => {
            const next = {
              ...form,
              name: String(formData.get("name") ?? form.name).trim(),
              clientName: String(formData.get("clientName") ?? form.clientName).trim(),
              anonymisedLabel: String(formData.get("anonymisedLabel") ?? form.anonymisedLabel).trim(),
              altText: String(formData.get("altText") ?? form.altText).trim(),
              sortOrder: Number.parseInt(String(formData.get("sortOrder") ?? form.sortOrder), 10) || 0,
              permission: form.permission,
              isActive: form.isActive,
              adminNotes: String(formData.get("adminNotes") ?? form.adminNotes).trim(),
              filePath: form.filePath,
              id: form.id,
            };
            const invalid = validateClientLogoInput(next);
            if (invalid) {
              setStatus(clientLogoErrorMessage(invalid));
              return;
            }
            startTransition(async () => {
              const result = await saveClientLogo(formData);
              if (!result.ok) {
                setStatus(clientLogoErrorMessage(result.error));
                return;
              }
              setOk("บันทึกโลโก้แล้ว");
              router.push(`/crm/cms/client-logos?id=${result.id}&saved=1`);
              router.refresh();
            });
          }}
        >
          {form.id ? <input type="hidden" name="id" value={form.id} /> : null}
          <input type="hidden" name="filePath" value={form.filePath} />
          <input type="hidden" name="permission" value={form.permission} />
          <input type="hidden" name="isActive" value={form.isActive ? "1" : "0"} />

          <div className="crm-logo-editor-grid">
            <div className="crm-logo-editor-fields">
              <Field label="ชื่อโลโก้">
                <input className="crm-field" name="name" value={form.name} onChange={(e) => patch("name", e.target.value)} required />
              </Field>
              <div className="crm-contact-pair">
                <Field label="ชื่อลูกค้า" hint="ใส่ชื่อจริงเมื่อได้รับอนุญาตให้ระบุ">
                  <input
                    className="crm-field"
                    name="clientName"
                    value={form.clientName}
                    onChange={(e) => patch("clientName", e.target.value)}
                  />
                </Field>
                <Field label="ป้ายนิรนาม" hint="ใช้แทนชื่อลูกค้าบนหน้าสาธารณะได้">
                  <input
                    className="crm-field"
                    name="anonymisedLabel"
                    value={form.anonymisedLabel}
                    onChange={(e) => patch("anonymisedLabel", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Alt text">
                <input
                  className="crm-field"
                  name="altText"
                  value={form.altText}
                  placeholder={publicClientAlt(form)}
                  onChange={(e) => patch("altText", e.target.value)}
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
                    onChange={(e) => patch("sortOrder", Number.parseInt(e.target.value || "0", 10) || 0)}
                  />
                </Field>
                <Field label="สิทธิ์เผยแพร่" hint="ต้องกดบันทึกหลังเปลี่ยนค่านี้">
                  <select
                    className="crm-field"
                    value={form.permission}
                    onChange={(e) => patch("permission", e.target.value as ClientLogoSaveInput["permission"])}
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
                  onChange={(e) => patch("isActive", e.target.checked)}
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
                  rows={4}
                  value={form.adminNotes}
                  onChange={(e) => patch("adminNotes", e.target.value)}
                />
              </Field>
            </div>

            <div className="crm-logo-editor-media">
              <Field label="ไฟล์โลโก้" hint={CLIENT_LOGO_HINT}>
                <input
                  className="crm-field"
                  type="file"
                  name="logoFile"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => onFile(event.target.files?.[0])}
                />
                {form.filePath ? (
                  <label className="crm-contact-clear">
                    <input
                      type="checkbox"
                      name="clearLogoFile"
                      value="1"
                      onChange={(e) => {
                        if (e.target.checked) {
                          patch("filePath", "");
                          setPreview("");
                        }
                      }}
                    />
                    ลบไฟล์โลโก้เมื่อบันทึก
                  </label>
                ) : null}
              </Field>
              <LogoPreview src={preview} alt={publicClientAlt(form)} unsaved={preview !== form.filePath && Boolean(preview)} />
            </div>
          </div>

          <div className="crm-cms-globals-form-actions">
            <button className="kpi-button" type="submit" disabled={pending}>
              {pending ? "กำลังบันทึก…" : "บันทึก"}
            </button>
            {!creating ? (
              <button type="button" className="crm-users-secondary" onClick={startCreate}>
                เพิ่มรายการใหม่
              </button>
            ) : null}
          </div>
        </form>
      </section>
    </div>
  );
}
