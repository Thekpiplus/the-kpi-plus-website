"use client";

import { useState } from "react";
import { B2bDialog, Field, SaveBar } from "@/components/b2b-ops/ui";
import {
  addSolutionsDepartment,
  deleteSolutionsAccess,
  removeSolutionsDepartment,
  saveSolutionsAccess,
  saveSolutionsSettings,
} from "@/lib/solutions-ops/actions";
import {
  MAX_SOL_EXTRA_DEPARTMENTS,
  allDepartments,
  departmentDuty,
  departmentLabelIn,
  hasContactPattern,
  hasSensitiveText,
  slugifyDepartmentId,
  type SolAccessRow,
  type SolAccessView,
  type SolSettings,
} from "@/lib/solutions-ops/types";
import { useSolRun } from "./useSolRun";
import "./solutions-ops.css";

type Staff = { id: string; name: string; email?: string };

export function SolutionsOpsSettingsPanel({
  rows,
  staff,
  settings,
  access,
}: {
  rows: SolAccessRow[];
  staff: Staff[];
  settings: SolSettings;
  access: SolAccessView;
}) {
  const canManage = access.canManageSettings;
  const settingsRun = useSolRun();
  const accessRun = useSolRun();
  const [deleteId, setDeleteId] = useState("");
  const [settingsDirty, setSettingsDirty] = useState(false);
  const [settingsTouched, setSettingsTouched] = useState(false);
  const [form, setForm] = useState({
    reviewIntervalDays: String(settings.reviewIntervalDays),
    inquiryDefaultOwnerId: settings.inquiryDefaultOwnerId,
    internalNote: settings.internalNote,
  });
  const [accessForm, setAccessForm] = useState({
    userId: staff[0]?.id ?? "",
    department: "revenue" as string,
    canSeeContacts: false,
    canApprove: false,
  });
  const [accessDirty, setAccessDirty] = useState(false);
  const deptRun = useSolRun();
  const departments = allDepartments(settings);
  const extraCount = departments.filter((item) => !item.core).length;
  const [deptForm, setDeptForm] = useState({ label: "", id: "" });
  const [deptTouched, setDeptTouched] = useState(false);
  const [removeDeptId, setRemoveDeptId] = useState("");
  const previewId = slugifyDepartmentId(deptForm.id || deptForm.label);
  const deptValidation =
    deptForm.label.trim().length < 2
      ? "กรุณากรอกชื่อแผนก (อย่างน้อย 2 ตัวอักษร)"
      : hasSensitiveText(deptForm.label) || hasContactPattern(deptForm.label)
        ? "ชื่อแผนกมีข้อความที่ไม่ควรบันทึก"
        : !previewId
          ? "ต้องมีรหัส (ตัวอักษรอังกฤษ/ตัวเลข) — ใส่ช่อง “รหัสแผนก” เมื่อชื่อเป็นภาษาไทยล้วน"
          : departments.some((item) => item.id === previewId)
            ? "รหัสแผนกนี้มีอยู่แล้ว"
            : extraCount >= MAX_SOL_EXTRA_DEPARTMENTS
              ? `เพิ่มแผนกได้สูงสุด ${MAX_SOL_EXTRA_DEPARTMENTS} แผนก`
              : "";

  const days = Number.parseInt(form.reviewIntervalDays, 10);
  const settingsValidation = !Number.isFinite(days) || days < 7 || days > 365 ? "จำนวนวันต้องเป็นตัวเลข 7–365" : hasSensitiveText(form.internalNote) ? "พบข้อความที่ไม่ควรบันทึก" : "";

  return (
    <div className="b2b-page sol-ops">
      <p className="sol-note">
        สิทธิ์แบบ least privilege: ผู้ใช้ที่เปิดโมดูลนี้ได้แต่ยังไม่มีแถวสิทธิ์จะ “ดูอย่างเดียว” · การแก้ไขจำกัดตามแผนกเจ้าของบริการ · ข้อมูลติดต่อลูกค้าและสิทธิ์อนุมัติเป็นสิทธิ์แยกต่างหาก
      </p>

      <section className="crm-cms-block">
        <h2>สิทธิ์ของคุณ / Your access</h2>
        <ul>
          <li>แผนกที่แก้ไขได้: {access.isManagement ? "ทุกแผนก" : access.departments.length ? access.departments.map((item) => departmentLabelIn(item, departments)).join(", ") : "ไม่มี (ดูอย่างเดียว)"}</li>
          <li>อนุมัติ / เผยแพร่ (internal): {access.canApprove ? "ได้" : "ไม่ได้"}</li>
          <li>ดูข้อมูลติดต่อลูกค้า: {access.canSeeContacts ? "ได้" : "ไม่ได้"}</li>
          <li>จัดการ Settings: {access.canManageSettings ? "ได้" : "ไม่ได้"}</li>
        </ul>
      </section>

      <section className="crm-cms-block">
        <h2>ค่าตั้งต้น / Defaults</h2>
        <fieldset className="sol-fieldset" disabled={!canManage || settingsRun.pending}>
          <legend>ไดเรกทอรี</legend>
          <div className="sol-form-grid">
            <Field label="รอบทบทวน (วัน) / Review interval" hint="7–365 วัน — ใช้เป็นแนวทางตั้งวันทบทวนบริการ">
              <input
                className="crm-field"
                type="number"
                min={7}
                max={365}
                value={form.reviewIntervalDays}
                aria-invalid={settingsTouched && Boolean(settingsValidation)}
                onChange={(event) => {
                  setSettingsDirty(true);
                  setForm({ ...form, reviewIntervalDays: event.target.value });
                }}
              />
            </Field>
            <Field label="ผู้รับผิดชอบคำขอเริ่มต้น / Default inquiry owner">
              <select
                className="crm-field"
                value={form.inquiryDefaultOwnerId}
                onChange={(event) => {
                  setSettingsDirty(true);
                  setForm({ ...form, inquiryDefaultOwnerId: event.target.value });
                }}
              >
                <option value="">— ไม่กำหนด —</option>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sol-span-2">
              <Field label="หมายเหตุภายใน / Internal note">
                <textarea
                  className="crm-field"
                  rows={2}
                  value={form.internalNote}
                  onChange={(event) => {
                    setSettingsDirty(true);
                    setForm({ ...form, internalNote: event.target.value });
                  }}
                />
              </Field>
            </div>
          </div>
        </fieldset>
        {canManage ? (
          <SaveBar
            pending={settingsRun.pending}
            ok={settingsRun.ok}
            error={settingsTouched && settingsValidation ? settingsValidation : settingsRun.error}
            dirty={settingsDirty}
            saveLabel="บันทึกค่าตั้งต้น"
            onSave={() => {
              setSettingsTouched(true);
              settingsRun.setOk("");
              if (settingsValidation) {
                settingsRun.setError("");
                return;
              }
              const data = new FormData();
              Object.entries(form).forEach(([key, value]) => data.set(key, value));
              settingsRun.run(() => saveSolutionsSettings(data), "บันทึกค่าตั้งต้นแล้ว", () => {
                setSettingsDirty(false);
                setSettingsTouched(false);
              });
            }}
          />
        ) : (
          <p className="b2b-muted">เฉพาะผู้จัดการ (Management / เจ้าของระบบ) แก้ค่าตั้งต้นได้</p>
        )}
      </section>

      <section className="crm-cms-block">
        <h2>แผนก / Departments</h2>
        <ul>
          {departments.map((item) => (
            <li key={item.id}>
              <strong>{item.label}</strong> — {departmentDuty(item.id)}
              {item.core ? null : (
                <>
                  {" "}
                  <span className="sol-chip">แผนกเพิ่มเอง · {item.id}</span>
                  {canManage ? (
                    <button type="button" className="crm-users-secondary" onClick={() => setRemoveDeptId(item.id)}>
                      ลบแผนก
                    </button>
                  ) : null}
                </>
              )}
            </li>
          ))}
        </ul>
        <p className="b2b-muted">
          แผนกเพิ่มเอง ({extraCount}/{MAX_SOL_EXTRA_DEPARTMENTS}) ใช้ได้ในสิทธิ์ผู้ใช้ เจ้าของบริการ งานย่อย และตัวกรอง — ไม่ต้องแก้โค้ด เมนูด้านข้างยังแสดง 9 แผนกหลัก
        </p>
        {canManage ? (
          <>
            <fieldset className="sol-fieldset" disabled={deptRun.pending}>
              <legend>เพิ่มแผนก / Add department</legend>
              <div className="sol-form-grid">
                <Field label="ชื่อแผนก / Label *">
                  <input
                    className="crm-field"
                    value={deptForm.label}
                    maxLength={80}
                    aria-invalid={deptTouched && Boolean(deptValidation)}
                    onChange={(event) => setDeptForm({ ...deptForm, label: event.target.value })}
                  />
                </Field>
                <Field label="รหัสแผนก / ID (ไม่บังคับ)" hint={previewId ? `URL: /crm/solutions/departments/${previewId}` : "สร้างจากชื่ออัตโนมัติ (a–z, 0–9, -)"}>
                  <input className="crm-field" value={deptForm.id} maxLength={40} onChange={(event) => setDeptForm({ ...deptForm, id: event.target.value })} />
                </Field>
              </div>
            </fieldset>
            <SaveBar
              pending={deptRun.pending}
              ok={deptRun.ok}
              error={deptTouched && deptValidation ? deptValidation : deptRun.error}
              dirty={Boolean(deptForm.label)}
              idle="พร้อมเพิ่มแผนก"
              saveLabel="เพิ่มแผนก"
              onSave={() => {
                setDeptTouched(true);
                deptRun.setOk("");
                if (deptValidation) {
                  deptRun.setError("");
                  return;
                }
                const data = new FormData();
                data.set("label", deptForm.label);
                data.set("id", deptForm.id);
                deptRun.run(() => addSolutionsDepartment(data), "เพิ่มแผนกแล้ว", () => {
                  setDeptForm({ label: "", id: "" });
                  setDeptTouched(false);
                });
              }}
            />
          </>
        ) : null}
      </section>

      <section className="crm-cms-block">
        <h2>สิทธิ์ผู้ใช้ตามแผนก / Department access</h2>
        {canManage ? (
          <>
            <fieldset className="sol-fieldset" disabled={accessRun.pending}>
              <legend>มอบสิทธิ์</legend>
              <div className="sol-form-grid">
                <Field label="ผู้ใช้ / User">
                  <select
                    className="crm-field"
                    value={accessForm.userId}
                    onChange={(event) => {
                      setAccessDirty(true);
                      setAccessForm({ ...accessForm, userId: event.target.value });
                    }}
                  >
                    {staff.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="แผนก / Department" hint="เลือก Management เพื่อแก้ไขได้ทุกแผนก">
                  <select
                    className="crm-field"
                    value={accessForm.department}
                    onChange={(event) => {
                      setAccessDirty(true);
                      setAccessForm({ ...accessForm, department: event.target.value });
                    }}
                  >
                    {departments.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <label className="crm-cms-field">
                  <span>
                    <input
                      type="checkbox"
                      checked={accessForm.canSeeContacts}
                      onChange={(event) => {
                        setAccessDirty(true);
                        setAccessForm({ ...accessForm, canSeeContacts: event.target.checked });
                      }}
                    />{" "}
                    ดูข้อมูลติดต่อลูกค้าได้ / Can see contacts
                  </span>
                </label>
                <label className="crm-cms-field">
                  <span>
                    <input
                      type="checkbox"
                      checked={accessForm.canApprove}
                      onChange={(event) => {
                        setAccessDirty(true);
                        setAccessForm({ ...accessForm, canApprove: event.target.checked });
                      }}
                    />{" "}
                    อนุมัติ / เผยแพร่ได้ / Can approve
                  </span>
                </label>
              </div>
            </fieldset>
            <SaveBar
              pending={accessRun.pending}
              ok={accessRun.ok}
              error={!accessForm.userId ? "กรุณาเลือกผู้ใช้" : accessRun.error}
              dirty={accessDirty}
              saveLabel="บันทึกสิทธิ์"
              onSave={() => {
                accessRun.setOk("");
                if (!accessForm.userId) return;
                const data = new FormData();
                data.set("userId", accessForm.userId);
                data.set("department", accessForm.department);
                data.set("canSeeContacts", accessForm.canSeeContacts ? "1" : "0");
                data.set("canApprove", accessForm.canApprove ? "1" : "0");
                accessRun.run(() => saveSolutionsAccess(data), "บันทึกสิทธิ์แล้ว", () => setAccessDirty(false));
              }}
            />
          </>
        ) : (
          <p className="b2b-muted">เฉพาะผู้จัดการแก้สิทธิ์ได้ — ตารางด้านล่างแสดงสิทธิ์ที่กำหนดไว้</p>
        )}

        <table className="crm-pipe-table b2b-table" aria-label="สิทธิ์ผู้ใช้">
          <thead>
            <tr>
              <th scope="col">ผู้ใช้</th>
              <th scope="col">แผนก</th>
              <th scope="col">ข้อมูลติดต่อ</th>
              <th scope="col">อนุมัติ</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>ยังไม่มีการมอบสิทธิ์ — ผู้ใช้ที่ไม่ใช่เจ้าของระบบจะดูอย่างเดียว</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td data-label="ผู้ใช้">{staff.find((item) => item.id === row.userId)?.name || row.userId}</td>
                  <td data-label="แผนก">{departmentLabelIn(row.department, departments)}</td>
                  <td data-label="ข้อมูลติดต่อ">{row.canSeeContacts ? "ดูได้" : "ซ่อน"}</td>
                  <td data-label="อนุมัติ">{row.canApprove ? "ได้" : "ไม่ได้"}</td>
                  <td>
                    {canManage ? (
                      <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(row.id)}>
                        ลบ
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {removeDeptId ? (
        <B2bDialog
          title="ลบแผนก"
          body={`ยืนยันลบแผนก “${departmentLabelIn(removeDeptId, departments)}”? ลบได้เฉพาะแผนกที่ไม่มีบริการ หมวด งานย่อย หรือสิทธิ์ผู้ใช้อ้างอิงอยู่`}
          confirmLabel="ลบแผนก"
          pending={deptRun.pending}
          onCancel={() => setRemoveDeptId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", removeDeptId);
            deptRun.run(() => removeSolutionsDepartment(data), "ลบแผนกแล้ว");
            setRemoveDeptId("");
          }}
        />
      ) : null}

      {deleteId ? (
        <B2bDialog
          title="ลบสิทธิ์"
          body="ยืนยันลบสิทธิ์แผนกนี้ของผู้ใช้? ผู้ใช้จะเสียสิทธิ์แก้ไขในแผนกนั้นทันที"
          confirmLabel="ลบ"
          pending={accessRun.pending}
          onCancel={() => setDeleteId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", deleteId);
            accessRun.run(() => deleteSolutionsAccess(data), "ลบสิทธิ์แล้ว");
            setDeleteId("");
          }}
        />
      ) : null}
    </div>
  );
}
