"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTrainingAccess, saveTrainingAccess, saveTrainingBoardSettings } from "@/lib/training-ops/actions";
import {
  TRN_DEPARTMENT_DUTIES,
  TRN_DEPARTMENT_LABEL,
  TRN_DEPARTMENTS,
  departmentLabel,
  trnErrorMessage,
  type TrnExtraDepartment,
  type TrnSettings,
} from "@/lib/training-ops/types";
import { B2bDialog, Field, SaveBar } from "@/components/b2b-ops/ui";
import "@/components/b2b-ops/b2b-ops.css";
import "./training-ops.css";

type Staff = { id: string; name: string; email?: string };

export function TrainingOpsSettingsPanel({
  rows,
  staff,
  canManage,
  settings,
}: {
  rows: Array<{ id: string; userId: string; department: string; canSeeParticipants: boolean }>;
  staff: Staff[];
  canManage: boolean;
  settings: TrnSettings;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [dirty, setDirty] = useState(false);
  const [form, setForm] = useState({
    userId: staff[0]?.id ?? "",
    department: "hr_ld",
    canSeeParticipants: false,
  });
  const [extras, setExtras] = useState<TrnExtraDepartment[]>(settings.extraDepartments);

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) setError(trnErrorMessage(result.error));
      else {
        setOk(success);
        setDirty(false);
        router.refresh();
      }
    });
  }

  return (
    <div className="b2b-page seo-ops trn-ops">
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
      <p className="trn-privacy-note">ขยายแผนกได้จาก Settings นี้ ไม่มีการนำเข้าข้อมูล คะแนนรายบุคคลจำกัดเฉพาะผู้ที่ได้รับสิทธิ์</p>
      <section className="crm-cms-block">
        <h2>แผนกที่ใช้ได้ / Departments</h2>
        <ul>
          {TRN_DEPARTMENTS.map((item) => (
            <li key={item}>
              <strong>{TRN_DEPARTMENT_LABEL[item]}</strong> — {TRN_DEPARTMENT_DUTIES[item].join(", ")}
            </li>
          ))}
        </ul>
        {extras.map((item, index) => (
          <div key={`${item.id}-${index}`} className="b2b-inline">
            <input
              className="crm-field"
              value={item.id}
              onChange={(event) => {
                setDirty(true);
                setExtras(extras.map((row, i) => (i === index ? { ...row, id: event.target.value } : row)));
              }}
              placeholder="id"
            />
            <input
              className="crm-field"
              value={item.label}
              onChange={(event) => {
                setDirty(true);
                setExtras(extras.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)));
              }}
              placeholder="label"
            />
          </div>
        ))}
        <button type="button" className="crm-users-secondary" onClick={() => { setDirty(true); setExtras([...extras, { id: "", label: "" }]); }}>
          เพิ่มแผนก
        </button>
        {canManage ? (
          <SaveBar
            pending={pending}
            ok={ok}
            error={error}
            dirty={dirty}
            onSave={() => {
              const data = new FormData();
              data.set("extraDepartmentsJson", JSON.stringify(extras.filter((item) => item.id && item.label)));
              run(() => saveTrainingBoardSettings(data), "บันทึกแผนกแล้ว");
            }}
          />
        ) : null}
      </section>
      <section className="crm-cms-block">
        <h2>สิทธิ์ผู้ใช้ / Access</h2>
        {canManage ? (
          <div className="trn-form-grid">
            <Field label="ผู้ใช้">
              <select className="crm-field" value={form.userId} onChange={(event) => setForm({ ...form, userId: event.target.value })}>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="แผนก">
              <select className="crm-field" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })}>
                {[...TRN_DEPARTMENTS, ...extras.map((item) => item.id)].map((item) => (
                  <option key={item} value={item}>
                    {departmentLabel(item, extras)}
                  </option>
                ))}
              </select>
            </Field>
            <label className="crm-cms-field">
              <span>
                <input type="checkbox" checked={form.canSeeParticipants} onChange={(event) => setForm({ ...form, canSeeParticipants: event.target.checked })} /> ดูรายละเอียดผู้เรียนได้ / Can see participant details
              </span>
            </label>
            <SaveBar
              pending={pending}
              ok={ok}
              error={error}
              onSave={() => {
                const data = new FormData();
                data.set("userId", form.userId);
                data.set("department", form.department);
                data.set("canSeeParticipants", form.canSeeParticipants ? "1" : "0");
                run(() => saveTrainingAccess(data), "บันทึกสิทธิ์แล้ว");
              }}
              saveLabel="บันทึกสิทธิ์"
            />
          </div>
        ) : (
          <p>เฉพาะ Management ที่ขยายแผนกและกำหนดสิทธิ์ได้</p>
        )}
        <table className="crm-pipe-table b2b-table">
          <thead>
            <tr>
              <th>ผู้ใช้</th>
              <th>แผนก</th>
              <th>ผู้เรียน</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{staff.find((item) => item.id === row.userId)?.name || row.userId}</td>
                <td>{departmentLabel(row.department, extras)}</td>
                <td>{row.canSeeParticipants ? "จำกัดสิทธิ์แล้ว" : "ผลรวมเท่านั้น"}</td>
                <td>
                  {canManage ? (
                    <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(row.id)}>
                      ลบ
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {deleteId ? (
        <B2bDialog
          title="ลบสิทธิ์"
          body="ยืนยันลบสิทธิ์แผนกนี้"
          confirmLabel="ลบ"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", deleteId);
            run(() => deleteTrainingAccess(data), "ลบสิทธิ์แล้ว");
            setDeleteId("");
          }}
        />
      ) : null}
    </div>
  );
}
