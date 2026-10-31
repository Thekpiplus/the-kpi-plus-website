"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteHotelAiAccess, saveHotelAiAccess, saveHotelAiBoardSettings } from "@/lib/hotel-ai-ops/actions";
import {
  HAI_DEPARTMENT_DUTIES,
  HAI_DEPARTMENT_LABEL,
  HAI_DEPARTMENTS,
  departmentLabel,
  webErrorMessage,
  type HaiExtraDepartment,
  type HaiSettings,
} from "@/lib/hotel-ai-ops/types";
import { B2bDialog, Field, SaveBar } from "@/components/b2b-ops/ui";
import "@/components/b2b-ops/b2b-ops.css";
import "@/components/systems-ops/systems-ops.css";
import "./hotel-ai-ops.css";

type Staff = { id: string; name: string; email?: string };

export function HotelAiSettingsPanel({
  rows,
  staff,
  canManage,
  departments,
  settings,
}: {
  rows: Array<{ id: string; userId: string; department: string; canSeePrivateIds: boolean }>;
  staff: Staff[];
  canManage: boolean;
  departments: string[];
  settings: HaiSettings;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [dirty, setDirty] = useState(false);
  const allDepartments = [...HAI_DEPARTMENTS, ...settings.extraDepartments.map((item) => item.id)];
  const [form, setForm] = useState({
    userId: staff[0]?.id ?? "",
    department: "operations",
    canSeePrivateIds: false,
  });
  const [vault, setVault] = useState({
    secretVaultLabel: settings.secretVaultLabel,
    secretVaultUrl: settings.secretVaultUrl,
    extras: settings.extraDepartments,
  });

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) setError(webErrorMessage(result.error));
      else {
        setOk(success);
        setDirty(false);
        router.refresh();
      }
    });
  }

  function saveVault() {
    const data = new FormData();
    data.set("secretVaultLabel", vault.secretVaultLabel);
    data.set("secretVaultUrl", vault.secretVaultUrl);
    data.set("extraDepartmentsJson", JSON.stringify(vault.extras.filter((item) => item.id && item.label)));
    run(() => saveHotelAiBoardSettings(data), "บันทึกการตั้งค่าแล้ว");
  }

  return (
    <div className="b2b-page seo-ops">
      {error ? (
        <p className="crm-users-alert is-warn" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="crm-users-alert is-ok" role="status">
          {ok}
        </p>
      ) : null}
      <p className="hai-ops-notice">
        Do not store API keys, passwords, payment data, or guest PII in workflow notes. Link an approved secret-management system below. Vault fields store a name or URL only — never a secret value. There is no data import.
      </p>
      <p className="b2b-muted">สิทธิ์ปัจจุบัน: {departments.map((item) => departmentLabel(item, settings.extraDepartments)).join(", ")}</p>

      <div className="ads-form-panel">
        <h2>Approved secret vault</h2>
        <div className="b2b-form-grid">
          <Field label="Vault name">
            <input
              className="crm-field"
              value={vault.secretVaultLabel}
              disabled={!canManage}
              onChange={(event) => {
                setDirty(true);
                setVault((current) => ({ ...current, secretVaultLabel: event.target.value }));
              }}
            />
          </Field>
          <Field label="Vault URL" hint="https link only. Never paste a key or password.">
            <input
              className="crm-field"
              value={vault.secretVaultUrl}
              disabled={!canManage}
              onChange={(event) => {
                setDirty(true);
                setVault((current) => ({ ...current, secretVaultUrl: event.target.value }));
              }}
            />
          </Field>
        </div>
        <h3>Expand departments</h3>
        {vault.extras.map((item, index) => (
          <div className="b2b-inline" key={`${item.id}-${index}`}>
            <input
              className="crm-field"
              value={item.id}
              placeholder="id เช่น concierge"
              disabled={!canManage}
              onChange={(event) => {
                setDirty(true);
                setVault((current) => ({
                  ...current,
                  extras: current.extras.map((row, i) => (i === index ? { ...row, id: event.target.value } : row)),
                }));
              }}
            />
            <input
              className="crm-field"
              value={item.label}
              placeholder="Label"
              disabled={!canManage}
              onChange={(event) => {
                setDirty(true);
                setVault((current) => ({
                  ...current,
                  extras: current.extras.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)),
                }));
              }}
            />
            {canManage ? (
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => {
                  setDirty(true);
                  setVault((current) => ({ ...current, extras: current.extras.filter((_, i) => i !== index) }));
                }}
              >
                ลบ
              </button>
            ) : null}
          </div>
        ))}
        {canManage ? (
          <button
            type="button"
            className="crm-users-secondary"
            onClick={() => {
              setDirty(true);
              setVault((current) => ({ ...current, extras: [...current.extras, { id: "", label: "" } satisfies HaiExtraDepartment] }));
            }}
          >
            เพิ่มแผนก
          </button>
        ) : null}
        {canManage ? <SaveBar pending={pending} ok={ok} error={error} dirty={dirty} onSave={saveVault} saveLabel="บันทึกการตั้งค่า" /> : null}
      </div>

      <div className="seo-ops-duties">
        {HAI_DEPARTMENTS.map((item) => (
          <article key={item} className="seo-ops-stat">
            <strong>{HAI_DEPARTMENT_LABEL[item]}</strong>
            <ul>
              {HAI_DEPARTMENT_DUTIES[item].map((duty) => (
                <li key={duty}>{duty}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="b2b-list">
        {rows.length ? (
          rows.map((row) => (
            <article className="b2b-card" key={row.id}>
              <p>
                {staff.find((item) => item.id === row.userId)?.name || row.userId} · {departmentLabel(row.department, settings.extraDepartments)}
              </p>
              <p className="b2b-muted">{row.canSeePrivateIds ? "Can see vault references" : "Vault references masked"}</p>
              {canManage ? (
                <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(row.id)}>
                  ลบสิทธิ์
                </button>
              ) : null}
            </article>
          ))
        ) : (
          <p className="b2b-muted">ยังไม่มีสิทธิ์แผนกเพิ่มเติม — ผู้ใช้ Full Access เห็นทุกแผนก</p>
        )}
      </div>
      {canManage ? (
        <form
          className="b2b-form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData();
            data.set("userId", form.userId);
            data.set("department", form.department);
            if (form.canSeePrivateIds) data.set("canSeePrivateIds", "1");
            run(() => saveHotelAiAccess(data), "บันทึกสิทธิ์แล้ว");
          }}
        >
          <Field label="Staff">
            <select className="crm-select" value={form.userId} onChange={(event) => setForm((current) => ({ ...current, userId: event.target.value }))}>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Department">
            <select className="crm-select" value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}>
              {allDepartments.map((item) => (
                <option key={item} value={item}>
                  {departmentLabel(item, settings.extraDepartments)}
                </option>
              ))}
            </select>
          </Field>
          <label className="crm-cms-field">
            <span>See vault references</span>
            <input type="checkbox" checked={form.canSeePrivateIds} onChange={(event) => setForm((current) => ({ ...current, canSeePrivateIds: event.target.checked }))} />
          </label>
          <div className="b2b-savebar">
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              {pending ? "กำลังบันทึก…" : "บันทึกสิทธิ์"}
            </button>
            <p className="crm-cs-save-state" role="status">
              {pending ? "กำลังบันทึก…" : "พร้อมบันทึก"}
            </p>
          </div>
        </form>
      ) : null}
      {deleteId ? (
        <B2bDialog
          title="ลบสิทธิ์แผนก"
          body="ยืนยันลบสิทธิ์แผนกนี้"
          confirmLabel="ลบ"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", deleteId);
            run(() => deleteHotelAiAccess(data), "ลบสิทธิ์แล้ว");
            setDeleteId("");
          }}
        />
      ) : null}
    </div>
  );
}
