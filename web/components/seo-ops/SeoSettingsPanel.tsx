"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteSeoAccess, saveSeoAccess } from "@/lib/seo-ops/actions";
import {
  SEO_DEPARTMENT_DUTIES,
  SEO_DEPARTMENT_LABEL,
  SEO_DEPARTMENTS,
  seoErrorMessage,
  type SeoDepartment,
} from "@/lib/seo-ops/types";
import { Field, SaveBar } from "@/components/b2b-ops/ui";
import "@/components/b2b-ops/b2b-ops.css";

export function SeoSettingsPanel({
  rows,
  staff,
  canManage,
  departments,
}: {
  rows: Array<{ id: string; userId: string; department: string; canSeePrivateIds: boolean }>;
  staff: Array<{ id: string; name: string; email?: string }>;
  canManage: boolean;
  departments: SeoDepartment[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [form, setForm] = useState({
    userId: staff[0]?.id ?? "",
    department: "marketing" as SeoDepartment,
    canSeePrivateIds: false,
  });

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) setError(seoErrorMessage(result.error));
      else {
        setOk(success);
        router.refresh();
      }
    });
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
      <p className="b2b-muted">
        ระบบขยายตามแผนก Marketing, Revenue, Distribution, Sales และ Management โดยไม่ต้องนำเข้าข้อมูล Search Console หรือ Google Business Profile
      </p>
      <p className="b2b-muted">สิทธิ์ปัจจุบัน: {departments.map((item) => SEO_DEPARTMENT_LABEL[item]).join(", ")}</p>
      <div className="seo-ops-duties">
        {SEO_DEPARTMENTS.map((item) => (
          <article key={item} className="seo-ops-stat">
            <strong>{SEO_DEPARTMENT_LABEL[item]}</strong>
            <span>{SEO_DEPARTMENT_DUTIES[item].join(" · ")}</span>
          </article>
        ))}
      </div>
      <div className="b2b-list">
        {rows.length ? (
          rows.map((row) => (
            <article key={row.id}>
              <strong>{staff.find((item) => item.id === row.userId)?.name || row.userId}</strong>
              <p>
                {SEO_DEPARTMENT_LABEL[row.department as SeoDepartment] || row.department} · รหัสภายใน{" "}
                {row.canSeePrivateIds ? "เปิด" : "ปกปิด"}
              </p>
              {canManage ? (
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() => {
                    const data = new FormData();
                    data.set("id", row.id);
                    run(() => deleteSeoAccess(data), "ลบสิทธิ์แล้ว");
                  }}
                >
                  ลบ
                </button>
              ) : null}
            </article>
          ))
        ) : (
          <p className="b2b-muted">ยังไม่ได้กำหนดแผนกให้ผู้ใช้ — ผู้ใช้โมดูลนี้จะได้สิทธิ์ Marketing เริ่มต้นโดยไม่มีรหัส Search Console / Google account</p>
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
              <select className="crm-select" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value as SeoDepartment })}>
                {SEO_DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>
                    {SEO_DEPARTMENT_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <label className="crm-cms-field">
              <span>เห็นรหัส Search Console / Google account</span>
              <input type="checkbox" checked={form.canSeePrivateIds} onChange={(event) => setForm({ ...form, canSeePrivateIds: event.target.checked })} />
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
              data.set("canSeePrivateIds", form.canSeePrivateIds ? "1" : "0");
              run(() => saveSeoAccess(data), "บันทึกสิทธิ์แล้ว");
            }}
          />
        </section>
      ) : (
        <p className="b2b-muted">Management เท่านั้นที่ตั้งค่าสิทธิ์แผนกได้</p>
      )}
    </div>
  );
}
