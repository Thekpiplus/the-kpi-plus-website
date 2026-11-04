"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteHotelMarketingAccess, saveHotelMarketingAccess, saveHotelMarketingBoardSettings } from "@/lib/hotel-marketing-ops/actions";
import {
  HMO_DEPARTMENT_DUTIES,
  HMO_DEPARTMENTS,
  MAX_HMO_EXTRA_DEPARTMENTS,
  hmoDepartmentLabel,
  hmoErrorMessage,
  type HmoExtraDepartment,
  type HmoSettings,
} from "@/lib/hotel-marketing-ops/types";
import { B2bDialog, Field, SaveBar } from "@/components/b2b-ops/ui";
import "@/components/b2b-ops/b2b-ops.css";
import "./hotel-marketing-ops.css";

type Staff = { id: string; name: string; email?: string };
type Msg = { ok: string; error: string };
type ActionResult = { ok: true; id: string } | { ok: false; error: string };
const NO_MSG: Msg = { ok: "", error: "" };

export function HotelMarketingOpsSettingsPanel({
  rows,
  staff,
  canManage,
  settings,
}: {
  rows: Array<{ id: string; userId: string; department: string; canApprove: boolean }>;
  staff: Staff[];
  canManage: boolean;
  settings: HmoSettings;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [msgs, setMsgs] = useState<Record<string, Msg>>({});
  const [deleteId, setDeleteId] = useState("");
  const [deptDirty, setDeptDirty] = useState(false);
  const [accessDirty, setAccessDirty] = useState(false);
  const [form, setForm] = useState({ userId: staff[0]?.id ?? "", department: "marketing_content", canApprove: false });
  const [extras, setExtras] = useState<HmoExtraDepartment[]>(settings.extraDepartments);
  useEffect(() => {
    if (!deptDirty) setExtras(settings.extraDepartments);
  }, [settings.extraDepartments, deptDirty]);
  const departments = [...HMO_DEPARTMENTS, ...extras.map((item) => item.id).filter(Boolean)] as string[];
  const dept = msgs.departments ?? NO_MSG;
  const access = msgs.access ?? NO_MSG;
  const page = msgs.page ?? NO_MSG;

  async function run(scope: string, task: () => Promise<ActionResult>, success: string) {
    setPending(true);
    setMsgs((state) => ({ ...state, [scope]: NO_MSG }));
    try {
      const result = await task();
      if (!result.ok) {
        setMsgs((state) => ({ ...state, [scope]: { ok: "", error: hmoErrorMessage(result.error) } }));
        return false;
      }
      setMsgs((state) => ({ ...state, [scope]: { ok: `${success} ✓`, error: "" } }));
      router.refresh();
      return true;
    } catch {
      setMsgs((state) => ({ ...state, [scope]: { ok: "", error: "บันทึกไม่สำเร็จ ลองอีกครั้ง / Save failed, please try again" } }));
      return false;
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="b2b-page hmo-ops">
      <p className="hmo-privacy-note">
        กำหนดแผนกที่แต่ละผู้ใช้ทำงานได้ และใครอนุมัติได้ — ไม่มีการนำเข้าข้อมูล / Grant department access and approval rights. Management (and full-access roles) see every department. There is no import.
      </p>

      {page.error ? (
        <p className="crm-cs-save-state is-error" role="alert">
          {page.error}
        </p>
      ) : null}
      {page.ok ? (
        <p className="crm-cs-save-state is-ok" role="status">
          {page.ok}
        </p>
      ) : null}

      <section className="hmo-settings-block" aria-label="Departments">
        <h2>แผนก / Departments</h2>
        <ul>
          {HMO_DEPARTMENTS.map((item) => (
            <li key={item}>
              <strong>{hmoDepartmentLabel(item)}</strong> — {HMO_DEPARTMENT_DUTIES[item].join(", ")}
            </li>
          ))}
        </ul>
        {extras.map((item, index) => (
          <div key={index} className="b2b-inline">
            <input
              className="crm-field"
              value={item.id}
              disabled={!canManage}
              onChange={(event) => {
                setDeptDirty(true);
                setExtras(extras.map((row, i) => (i === index ? { ...row, id: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_") } : row)));
              }}
              placeholder="id (a-z, 0-9, _)"
              aria-label={`Extra department ${index + 1} id`}
            />
            <input
              className="crm-field"
              value={item.label}
              disabled={!canManage}
              onChange={(event) => {
                setDeptDirty(true);
                setExtras(extras.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)));
              }}
              placeholder="label"
              aria-label={`Extra department ${index + 1} label`}
            />
            {canManage ? (
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() => {
                  setDeptDirty(true);
                  setExtras(extras.filter((_, i) => i !== index));
                }}
              >
                เอาออก / Remove
              </button>
            ) : null}
          </div>
        ))}
        {canManage ? (
          <>
            <div>
              <button
                type="button"
                className="crm-users-secondary"
                disabled={extras.length >= MAX_HMO_EXTRA_DEPARTMENTS}
                onClick={() => {
                  setDeptDirty(true);
                  setExtras([...extras, { id: "", label: "" }]);
                }}
              >
                เพิ่มแผนก / Add department
              </button>
            </div>
            <SaveBar
              pending={pending}
              ok={dept.ok}
              error={dept.error}
              dirty={deptDirty}
              idle={deptDirty ? "มีการแก้ไขที่ยังไม่บันทึก / Unsaved changes" : "พร้อมบันทึก / Ready to save"}
              saveLabel="บันทึกแผนก / Save departments"
              onSave={async () => {
                const data = new FormData();
                data.set("extraDepartmentsJson", JSON.stringify(extras));
                if (await run("departments", () => saveHotelMarketingBoardSettings(data), "บันทึกแผนกแล้ว / Departments saved")) setDeptDirty(false);
              }}
            />
          </>
        ) : null}
      </section>

      <section className="hmo-settings-block" aria-label="Access">
        <h2>สิทธิ์ผู้ใช้ / Department access</h2>
        {canManage ? (
          <div className="hmo-form-grid">
            <Field label="ผู้ใช้ / User">
              <select
                className="crm-field"
                value={form.userId}
                onChange={(event) => {
                  setAccessDirty(true);
                  setForm({ ...form, userId: event.target.value });
                }}
              >
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="แผนก / Department">
              <select
                className="crm-field"
                value={form.department}
                onChange={(event) => {
                  setAccessDirty(true);
                  setForm({ ...form, department: event.target.value });
                }}
              >
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {hmoDepartmentLabel(item, extras)}
                  </option>
                ))}
              </select>
            </Field>
            <label className="hmo-check is-wide">
              <input
                type="checkbox"
                checked={form.canApprove}
                onChange={(event) => {
                  setAccessDirty(true);
                  setForm({ ...form, canApprove: event.target.checked });
                }}
              />
              <span>อนุมัติ / เผยแพร่ได้ / Can approve and set Approved, Scheduled, Published</span>
            </label>
            <div className="is-wide">
              <SaveBar
                pending={pending}
                ok={access.ok}
                error={access.error}
                dirty={accessDirty}
                idle="พร้อมบันทึกสิทธิ์ / Ready to save access"
                saveLabel="บันทึกสิทธิ์ / Save access"
                onSave={async () => {
                  const data = new FormData();
                  data.set("userId", form.userId);
                  data.set("department", form.department);
                  data.set("canApprove", form.canApprove ? "1" : "0");
                  if (await run("access", () => saveHotelMarketingAccess(data), "บันทึกสิทธิ์แล้ว / Access saved")) setAccessDirty(false);
                }}
              />
            </div>
          </div>
        ) : (
          <p className="b2b-muted">เฉพาะ Management หรือผู้ดูแลระบบที่กำหนดสิทธิ์ได้ / Only Management or administrators can change access.</p>
        )}
        <div className="crm-pipe-table-wrap b2b-table-wrap">
          <table className="crm-pipe-table b2b-table" aria-label="Department access">
            <thead>
              <tr>
                <th scope="col">ผู้ใช้ / User</th>
                <th scope="col">แผนก / Department</th>
                <th scope="col">อนุมัติ / Approve</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td data-label="User">{staff.find((item) => item.id === row.userId)?.name || row.userId}</td>
                    <td data-label="Department">{hmoDepartmentLabel(row.department, extras)}</td>
                    <td data-label="Approve">{row.canApprove ? "อนุมัติได้ / Can approve" : "แก้ไขเท่านั้น / Edit only"}</td>
                    <td data-label="Actions">
                      {canManage ? (
                        <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(row.id)}>
                          ลบ / Remove
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>ยังไม่มีการกำหนดสิทธิ์ — ผู้ใช้ที่มีโมดูลนี้เข้าถึงเฉพาะ Marketing / Content / No grants yet — module users see Marketing / Content only.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {deleteId ? (
        <B2bDialog
          title="ลบสิทธิ์ / Remove access"
          body="ยืนยันลบสิทธิ์แผนกนี้ / Remove this department grant?"
          confirmLabel="ลบ / Remove"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={async () => {
            const id = deleteId;
            setDeleteId("");
            const data = new FormData();
            data.set("id", id);
            await run("page", () => deleteHotelMarketingAccess(data), "ลบสิทธิ์แล้ว / Access removed");
          }}
        />
      ) : null}
    </div>
  );
}
