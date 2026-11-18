"use client";

import { useEffect, useId, useRef, useState } from "react";
import { changeStaffPassword, deleteStaffUser, updateStaffUser } from "@/lib/crm/user-admin";
import { ADMIN_MODULES, MODULE_LABEL, type AdminModule } from "@/lib/crm/modules";
import { ROLE_LABEL, type InternalRole } from "@/lib/crm/roles";
import { PasswordChangeFields } from "@/components/crm/ui/PasswordField";
import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";

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
      <path
        d="M11.5 11.5 19 4m0 0h-3.2M19 4v3.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoPassword) setMode("password");
  }, [autoPassword, passwordError]);

  useEffect(() => {
    if (!mode || mode === "delete") return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMode(null);
    }
    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => firstFieldRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [mode]);

  if (!canEdit) {
    return <span className="kpi-users-login">—</span>;
  }

  const title =
    mode === "edit" ? "แก้ไขข้อมูลผู้ใช้งาน" : mode === "password" ? "แก้ไขรหัสผ่าน" : "ลบข้อมูลผู้ใช้งาน";
  const lead =
    mode === "edit"
      ? `แก้ไขข้อมูลและสิทธิ์ของ ${user.name}`
      : mode === "password"
        ? `ตั้งรหัสผ่านใหม่สำหรับ ${user.name}`
        : `ยืนยันการลบบัญชีของ ${user.name}`;

  return (
    <div className="kpi-users-row-actions">
      <div className="crm-users-icon-actions">
        <button
          type="button"
          className="crm-users-icon-btn"
          title="แก้ไขข้อมูล"
          aria-label={`แก้ไขข้อมูลของ ${user.name}`}
          onClick={() => setMode("edit")}
        >
          <IconEdit />
        </button>
        <button
          type="button"
          className="crm-users-icon-btn"
          title="แก้ไขรหัสผ่าน"
          aria-label={`แก้ไขรหัสผ่านของ ${user.name}`}
          onClick={() => setMode("password")}
        >
          <IconKey />
        </button>
        {user.canDelete ? (
          <button
            type="button"
            className="crm-users-icon-btn is-danger"
            title="ลบข้อมูล"
            aria-label={`ลบข้อมูลของ ${user.name}`}
            aria-expanded={mode === "delete"}
            onClick={() => setMode((current) => (current === "delete" ? null : "delete"))}
          >
            <IconTrash />
          </button>
        ) : (
          <span className="crm-users-icon-btn is-disabled" title="ลบไม่ได้" aria-hidden="true">
            <IconTrash />
          </span>
        )}
      </div>

      {mode === "delete" ? (
        <div className="kpi-users-inline-confirm" role="region" aria-live="polite">
          <p>
            ยืนยันลบ “{user.name}” ออกจากระบบ? การดำเนินการนี้ย้อนกลับไม่ได้
          </p>
          <form action={deleteStaffUser} className="kpi-users-inline-confirm-actions">
            <input type="hidden" name="userId" value={user.id} />
            <button type="button" className="crm-users-secondary" onClick={() => setMode(null)}>
              ยกเลิก
            </button>
            <PendingSubmitButton className="kpi-button kpi-users-danger" pendingLabel="กำลังลบ…">
              ยืนยัน
            </PendingSubmitButton>
          </form>
        </div>
      ) : null}

      {mode === "edit" || mode === "password" ? (
        <aside className="kpi-users-sidepanel" role="region" aria-labelledby={titleId}>
          <div className="kpi-users-sidepanel-head">
            <div>
              <p className="kpi-users-sidepanel-eyebrow">Users Management</p>
              <h2 id={titleId} className="kpi-users-sidepanel-title">
                {title}
              </h2>
              <p className="kpi-users-sidepanel-lead">{lead}</p>
            </div>
            <button
              type="button"
              className="kpi-users-sidepanel-close"
              aria-label="ยกเลิกและปิดแผง"
              onClick={() => setMode(null)}
            >
              ✕
            </button>
          </div>

          {mode === "edit" ? (
            <form action={updateStaffUser} className="kpi-users-sidepanel-form">
              <div className="kpi-users-sidepanel-body">
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="returnTo" value="list" />
                <section className="crm-modal-section" aria-label="ข้อมูลบัญชี">
                  <h3 className="crm-modal-section-title">ข้อมูลบัญชี</h3>
                  <div className="crm-modal-grid">
                    <label className="crm-modal-field">
                      ชื่อ
                      <input
                        ref={firstFieldRef}
                        className="crm-field"
                        name="name"
                        defaultValue={user.name}
                        required
                      />
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
                      <label className="crm-modal-field crm-modal-span-2">
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
                      <p className="crm-modal-note crm-modal-span-2">
                        บทบาท Partners เปลี่ยนจากหน้าอนุมัติพาร์ตเนอร์
                      </p>
                    )}
                  </div>
                </section>

                {!user.isPartner ? (
                  <fieldset className="crm-modal-modules">
                    <legend>ฟังก์ชันที่เข้าได้</legend>
                    <p>
                      {user.isFullAccess
                        ? "Superadmin / Admin เข้าได้ทุกฟังก์ชัน"
                        : "เลือกโมดูลที่ต้องการเปิดให้บัญชีนี้"}
                    </p>
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
              </div>
              <div className="kpi-users-sidepanel-actions">
                <button type="button" className="crm-users-secondary" onClick={() => setMode(null)}>
                  ยกเลิก
                </button>
                <PendingSubmitButton className="kpi-button crm-users-primary" pendingLabel="กำลังบันทึก…">
                  บันทึก
                </PendingSubmitButton>
              </div>
            </form>
          ) : null}

          {mode === "password" ? (
            <form action={changeStaffPassword} className="kpi-users-sidepanel-form">
              <div className="kpi-users-sidepanel-body">
                <input type="hidden" name="userId" value={user.id} />
                {passwordError ? (
                  <p className="kpi-users-alert is-warn" role="status" aria-live="polite">
                    รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร และต้องตรงกันทั้งสองช่อง
                  </p>
                ) : null}
                <section className="crm-modal-section" aria-label="รหัสผ่านใหม่">
                  <h3 className="crm-modal-section-title">รหัสผ่านใหม่</h3>
                  <PasswordChangeFields />
                </section>
                <p className="crm-modal-note">เมื่อเปลี่ยนแล้ว เซสชันเดิมของบัญชีนี้จะถูกออกจากระบบ</p>
              </div>
              <div className="kpi-users-sidepanel-actions">
                <button type="button" className="crm-users-secondary" onClick={() => setMode(null)}>
                  ยกเลิก
                </button>
                <PendingSubmitButton className="kpi-button crm-users-primary" pendingLabel="กำลังเปลี่ยน…">
                  บันทึก
                </PendingSubmitButton>
              </div>
            </form>
          ) : null}
        </aside>
      ) : null}
    </div>
  );
}
