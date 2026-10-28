"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteWebsiteAccess, saveWebsiteAccess } from "@/lib/website-ops/actions";
import {
  WEB_DEPARTMENT_DUTIES,
  WEB_DEPARTMENT_LABEL,
  WEB_DEPARTMENTS,
  webErrorMessage,
  type WebDepartment,
} from "@/lib/website-ops/types";
import "@/components/b2b-ops/b2b-ops.css";
import "./website-ops.css";

export function WebsiteSettingsPanel({
  rows,
  staff,
  canManage,
  departments,
}: {
  rows: Array<{ id: string; userId: string; department: string; canSeePrivateIds: boolean }>;
  staff: Array<{ id: string; name: string; email?: string }>;
  canManage: boolean;
  departments: WebDepartment[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [form, setForm] = useState({
    userId: staff[0]?.id ?? "",
    department: "marketing" as WebDepartment,
    canSeePrivateIds: false,
  });

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) setError(webErrorMessage(result.error));
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
      <p className="b2b-muted">แผนกที่ขยายได้: Marketing, Revenue, Distribution, Sales และ Management ไม่มีการนำเข้าข้อมูล</p>
      <p className="b2b-muted">สิทธิ์ปัจจุบัน: {departments.map((item) => WEB_DEPARTMENT_LABEL[item]).join(", ")}</p>
      <div className="seo-ops-duties">
        {WEB_DEPARTMENTS.map((item) => (
          <article key={item} className="seo-ops-stat">
            <strong>{WEB_DEPARTMENT_LABEL[item]}</strong>
            <span>{WEB_DEPARTMENT_DUTIES[item].join(" · ")}</span>
          </article>
        ))}
      </div>
      <div className="b2b-list">
        {rows.length ? (
          rows.map((row) => (
            <article key={row.id}>
              <strong>{staff.find((item) => item.id === row.userId)?.name || row.userId}</strong>
              <p>
                {WEB_DEPARTMENT_LABEL[row.department as WebDepartment] || row.department} · รหัสภายใน{" "}
                {row.canSeePrivateIds ? "มองเห็น" : "ถูกปกปิด"}
              </p>
              {canManage ? (
                <button
                  type="button"
                  className="crm-users-secondary"
                  disabled={pending}
                  onClick={() => {
                    const data = new FormData();
                    data.set("id", row.id);
                    run(() => deleteWebsiteAccess(data), "ลบสิทธิ์แล้ว");
                  }}
                >
                  ลบสิทธิ์
                </button>
              ) : null}
            </article>
          ))
        ) : (
          <p className="b2b-muted">ยังไม่มีแถวสิทธิ์แผนก</p>
        )}
      </div>
      {canManage ? (
        <form
          className="web-ops-grid"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData();
            data.set("userId", form.userId);
            data.set("department", form.department);
            if (form.canSeePrivateIds) data.set("canSeePrivateIds", "1");
            run(() => saveWebsiteAccess(data), "บันทึกสิทธิ์แล้ว");
          }}
        >
          <label className="crm-cms-field">
            <span>ผู้ใช้</span>
            <select className="crm-field" value={form.userId} onChange={(event) => setForm((current) => ({ ...current, userId: event.target.value }))}>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="crm-cms-field">
            <span>แผนก</span>
            <select
              className="crm-field"
              value={form.department}
              onChange={(event) => setForm((current) => ({ ...current, department: event.target.value as WebDepartment }))}
            >
              {WEB_DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {WEB_DEPARTMENT_LABEL[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="crm-cms-field">
            <span>เห็นรหัสบัญชีระบบจอง / Analytics</span>
            <input type="checkbox" checked={form.canSeePrivateIds} onChange={(event) => setForm((current) => ({ ...current, canSeePrivateIds: event.target.checked }))} />
          </label>
          <button className="kpi-button" type="submit" disabled={pending}>
            {pending ? "กำลังบันทึก…" : "บันทึกสิทธิ์"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
