"use client";

import { useEffect, useId, useState } from "react";
import { changeStaffPassword, deleteStaffUser, updateStaffUser } from "@/lib/crm/user-admin";
import { ADMIN_MODULES, MODULE_LABEL, type AdminModule } from "@/lib/crm/modules";
import { ROLE_LABEL, type InternalRole } from "@/lib/crm/roles";

type Mode = "edit" | "password" | "delete" | null;

type UserRow = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  phone: string;
  role: string;
  selectedModules: AdminModule[];
  isPartner: boolean;
  isFullAccess: boolean;
  canDelete: boolean;
};

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

function IconKey() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="14.5" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M11.5 11.5 19 4m0 0h-3.2M19 4v3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 7h14M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7m1.5 0v11a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 8 18V7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function UserRowActions({
  user,
  roles,
  canEdit,
  passwordError = false,
  autoPassword = false,
}: {
  user: UserRow;
  roles: InternalRole[];
  canEdit: boolean;
  passwordError?: boolean;
  autoPassword?: boolean;
}) {
  const [mode, setMode] = useState<Mode>(autoPassword ? "password" : null);
  const titleId = useId();

  useEffect(() => {
    if (autoPassword) setMode("password");
  }, [autoPassword, passwordError]);

  useEffect(() => {
    if (!mode) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMode(null);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mode]);

  if (!canEdit) {
    return <span className="crm-users-login">—</span>;
  }

  return (
    <>
      <div className="crm-users-icon-actions">
        <button type="button" className="crm-users-icon-btn" title="แก้ไข" aria-label={`แก้ไข ${user.name}`} onClick={() => setMode("edit")}>
          <IconEdit />
        </button>
        <button
          type="button"
          className="crm-users-icon-btn"
          title="เปลี่ยนรหัสผ่าน"
          aria-label={`เปลี่ยนรหัสผ่าน ${user.name}`}
          onClick={() => setMode("password")}
        >
          <IconKey />
        </button>
        {user.canDelete ? (
          <button
            type="button"
            className="crm-users-icon-btn is-danger"
            title="ลบข้อมูล"
            aria-label={`ลบ ${user.name}`}
            onClick={() => setMode("delete")}
          >
            <IconTrash />
          </button>
        ) : (
          <span className="crm-users-icon-btn is-disabled" title="ลบไม่ได้" aria-hidden="true">
            <IconTrash />
          </span>
        )}
      </div>

      {mode ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={() => setMode(null)} />
          <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">Users</p>
                <h2 id={titleId} className="crm-modal-title">
                  {mode === "edit" ? "แก้ไขผู้ใช้" : mode === "password" ? "เปลี่ยนรหัสผ่าน" : "ลบข้อมูลผู้ใช้"}
                </h2>
                <p className="crm-modal-lead">{user.name}</p>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={() => setMode(null)}>
                ✕
              </button>
            </div>

            {mode === "edit" ? (
              <form action={updateStaffUser} className="crm-modal-form">
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="returnTo" value="list" />
                <div className="crm-modal-grid">
                  <label className="crm-modal-field">
                    ชื่อ
                    <input className="crm-field" name="name" defaultValue={user.name} required />
                  </label>
                  <label className="crm-modal-field">
                    ชื่อผู้ใช้ (Username)
                    <input
                      className="crm-field"
                      name="username"
                      defaultValue={user.username ?? ""}
                      pattern="[a-zA-Z0-9._-]{3,32}"
                      required
                    />
                  </label>
                  <label className="crm-modal-field">
                    อีเมล
                    <input className="crm-field" type="email" name="email" defaultValue={user.email} required />
                  </label>
                  <label className="crm-modal-field">
                    เบอร์โทร
                    <input className="crm-field" name="phone" defaultValue={user.phone} required />
                  </label>
                  {!user.isPartner ? (
                    <label className="crm-modal-field">
                      บทบาท (User Role)
                      <select className="crm-select" name="role" defaultValue={user.role} required>
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {ROLE_LABEL[role]}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <p className="crm-modal-note">บทบาท Partners เปลี่ยนจากหน้าอนุมัติพาร์ตเนอร์</p>
                  )}
                </div>

                {!user.isPartner ? (
                  <fieldset className="crm-modal-modules">
                    <legend>ฟังก์ชันที่เข้าได้</legend>
                    <p>{user.isFullAccess ? "Superadmin / Admin เข้าได้ทุกฟังก์ชัน" : "เลือกโมดูลที่ต้องการเปิดให้บัญชีนี้"}</p>
                    <div className="crm-modal-module-grid">
                      {ADMIN_MODULES.map((module) => (
                        <label key={module} className="crm-modal-check">
                          <input
                            type="checkbox"
                            name="modules"
                            value={module}
                            defaultChecked={user.selectedModules.includes(module)}
                          />
                          <span>{MODULE_LABEL[module]}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ) : null}

                <div className="crm-modal-actions">
                  <button type="button" className="crm-users-secondary" onClick={() => setMode(null)}>
                    ยกเลิก
                  </button>
                  <button className="kpi-button" type="submit">
                    บันทึก
                  </button>
                </div>
              </form>
            ) : null}

            {mode === "password" ? (
              <form action={changeStaffPassword} className="crm-modal-form">
                <input type="hidden" name="userId" value={user.id} />
                {passwordError ? (
                  <p className="crm-users-alert is-warn" role="alert">
                    รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร และต้องตรงกันทั้งสองช่อง
                  </p>
                ) : null}
                <label className="crm-modal-field">
                  รหัสผ่านใหม่
                  <input className="crm-field" type="password" name="password" minLength={4} required autoFocus />
                </label>
                <label className="crm-modal-field">
                  ยืนยันรหัสผ่านใหม่
                  <input className="crm-field" type="password" name="passwordConfirm" minLength={4} required />
                </label>
                <p className="crm-modal-note">เมื่อเปลี่ยนแล้ว เซสชันเดิมของบัญชีนี้จะถูกออกจากระบบ</p>
                <div className="crm-modal-actions">
                  <button type="button" className="crm-users-secondary" onClick={() => setMode(null)}>
                    ยกเลิก
                  </button>
                  <button className="kpi-button" type="submit">
                    เปลี่ยนรหัสผ่าน
                  </button>
                </div>
              </form>
            ) : null}

            {mode === "delete" ? (
              <form action={deleteStaffUser} className="crm-modal-form">
                <input type="hidden" name="userId" value={user.id} />
                <p className="crm-users-alert is-warn" role="status">
                  ยืนยันลบ “{user.name}” ออกจากระบบ? การดำเนินการนี้ย้อนกลับไม่ได้
                </p>
                <div className="crm-modal-actions">
                  <button type="button" className="crm-users-secondary" onClick={() => setMode(null)}>
                    ยกเลิก
                  </button>
                  <button className="kpi-button crm-users-delete-btn" type="submit">
                    ลบข้อมูล
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
