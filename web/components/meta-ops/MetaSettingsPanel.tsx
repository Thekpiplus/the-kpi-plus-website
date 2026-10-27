"use client";

import { useState, useTransition } from "react";
import { deleteMetaAccess, saveMetaAccess } from "@/lib/meta-ops/actions";
import {
  ADS_DEPARTMENT_LABEL,
  META_DEPARTMENTS,
  adsErrorMessage,
  type MetaDepartment,
} from "@/lib/meta-ops/types";
import { Field, SaveBar } from "@/components/b2b-ops/ui";
import "@/components/b2b-ops/b2b-ops.css";

export function MetaSettingsPanel({
  rows,
  staff,
  canManage,
}: {
  rows: Array<{ id: string; userId: string; department: string; canSeeAccounts: boolean; canSeeBudget: boolean }>;
  staff: Array<{ id: string; name: string; email?: string }>;
  canManage: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [form, setForm] = useState({
    userId: staff[0]?.id ?? "",
    department: "marketing" as MetaDepartment,
    canSeeAccounts: false,
    canSeeBudget: false,
  });

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) setError(adsErrorMessage(result.error));
      else setOk(success);
    });
  }

  return (
    <div className="b2b-page">
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
      <p className="b2b-muted">
        Superadmin/Admin เห็นทุกแผนกโดยอัตโนมัติ แถวด้านล่างกำหนดแผนกและสิทธิ์บัญชีโฆษณา/งบให้ผู้ใช้โมดูลนี้
      </p>
      <div className="b2b-list">
        {rows.length ? (
          rows.map((row) => (
            <article key={row.id}>
              <strong>{staff.find((item) => item.id === row.userId)?.name || row.userId}</strong>
              <p>
                {ADS_DEPARTMENT_LABEL[row.department as MetaDepartment] || row.department} · บัญชี{" "}
                {row.canSeeAccounts ? "เปิด" : "ปกปิด"} · งบ {row.canSeeBudget ? "เปิด" : "ปกปิด"}
              </p>
              {canManage ? (
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() => {
                    const data = new FormData();
                    data.set("id", row.id);
                    run(() => deleteMetaAccess(data), "ลบสิทธิ์แล้ว");
                  }}
                >
                  ลบ
                </button>
              ) : null}
            </article>
          ))
        ) : (
          <p className="b2b-muted">ยังไม่ได้กำหนดแผนกให้ผู้ใช้ — ผู้ใช้โมดูลนี้จะได้สิทธิ์ Marketing เริ่มต้นโดยไม่มีบัญชี/งบ</p>
        )}
      </div>
      {canManage ? (
        <section className="b2b-panel">
          <div className="b2b-form-grid">
            <Field label="ผู้ใช้">
              <select className="crm-select" value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })}>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                    {item.email ? ` (${item.email})` : ""}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="แผนก">
              <select className="crm-select" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value as MetaDepartment })}>
                {META_DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>
                    {ADS_DEPARTMENT_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <label className="crm-cms-field">
              <span>เห็นรหัสบัญชีโฆษณา</span>
              <input type="checkbox" checked={form.canSeeAccounts} onChange={(event) => setForm({ ...form, canSeeAccounts: event.target.checked })} />
            </label>
            <label className="crm-cms-field">
              <span>เห็นบันทึกงบ</span>
              <input type="checkbox" checked={form.canSeeBudget} onChange={(event) => setForm({ ...form, canSeeBudget: event.target.checked })} />
            </label>
          </div>
          <SaveBar
            pending={pending}
            ok={ok}
            error={error}
            onSave={() => {
              const data = new FormData();
              data.set("userId", form.userId);
              data.set("department", form.department);
              data.set("canSeeAccounts", form.canSeeAccounts ? "1" : "0");
              data.set("canSeeBudget", form.canSeeBudget ? "1" : "0");
              run(() => saveMetaAccess(data), "บันทึกสิทธิ์แล้ว");
            }}
          />
        </section>
      ) : (
        <p className="b2b-muted">Management เท่านั้นที่ตั้งค่าสิทธิ์แผนกได้</p>
      )}
    </div>
  );
}
