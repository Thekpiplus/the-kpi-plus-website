"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createStaffUser } from "@/lib/crm/user-admin";
import { ADMIN_MODULES, MODULE_LABEL } from "@/lib/crm/modules";
import { ROLE_LABEL, type InternalRole } from "@/lib/crm/roles";
import { CrmSelect } from "@/components/crm/CrmSelect";
import { PasswordField } from "@/components/crm/ui/PasswordField";
import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";

type ModalApi = { open: () => void; close: () => void };

const NewUserModalContext = createContext<ModalApi | null>(null);

export function useNewUserModal() {
  const ctx = useContext(NewUserModalContext);
  if (!ctx) throw new Error("useNewUserModal must be used within NewUserModalProvider");
  return ctx;
}

export function NewUserOpenButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { open } = useNewUserModal();
  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  );
}

const ERROR_COPY: Record<string, string> = {
  invalid: "กรอกข้อมูลให้ครบ และเลือกอย่างน้อย 1 ฟังก์ชัน (ยกเว้น Superadmin/Admin)",
  exists: "อีเมล ชื่อผู้ใช้ หรือเบอร์นี้มีในระบบแล้ว",
};

export function NewUserModalProvider({
  roles,
  error,
  autoOpen = false,
  children,
}: {
  roles: InternalRole[];
  error?: string;
  autoOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(autoOpen);
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const formError = error && ERROR_COPY[error] ? ERROR_COPY[error] : null;

  const openPanel = useCallback(() => setOpen(true), []);
  const closePanel = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen, error]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => firstFieldRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open]);

  return (
    <NewUserModalContext.Provider value={{ open: openPanel, close: closePanel }}>
      {children}
      {open ? (
        <aside
          className="kpi-users-sidepanel"
          role="region"
          aria-labelledby={titleId}
        >
          <div className="kpi-users-sidepanel-head">
            <div>
              <p className="kpi-users-sidepanel-eyebrow">Users Management</p>
              <h2 id={titleId} className="kpi-users-sidepanel-title">
                เพิ่มผู้ใช้งาน
              </h2>
              <p className="kpi-users-sidepanel-lead">
                กรอกข้อมูลบัญชี เลือกบทบาท และเปิดฟังก์ชันที่ต้องการให้เข้าใช้
              </p>
            </div>
            <button
              type="button"
              className="kpi-users-sidepanel-close"
              aria-label="ยกเลิกและปิดแผง"
              onClick={closePanel}
            >
              ✕
            </button>
          </div>

          <form action={createStaffUser} className="kpi-users-sidepanel-form">
            <div className="kpi-users-sidepanel-body">
              {formError ? (
                <p className="kpi-users-alert is-warn" role="status" aria-live="polite">
                  {formError}
                </p>
              ) : null}

              <section className="crm-modal-section" aria-label="ข้อมูลบัญชี">
                <h3 className="crm-modal-section-title">ข้อมูลบัญชี</h3>
                <div className="crm-modal-grid">
                  <label className="crm-modal-field">
                    ชื่อ
                    <input ref={firstFieldRef} className="crm-field" name="name" required />
                  </label>
                  <label className="crm-modal-field">
                    ชื่อผู้ใช้ (Username)
                    <input
                      className="crm-field"
                      name="username"
                      pattern="[a-zA-Z0-9._-]{3,32}"
                      autoComplete="username"
                      required
                    />
                  </label>
                  <label className="crm-modal-field">
                    อีเมล
                    <input className="crm-field" type="email" name="email" required />
                  </label>
                  <label className="crm-modal-field">
                    บทบาท (User Role)
                    <CrmSelect
                      name="role"
                      aria-label="บทบาท"
                      defaultValue="user"
                      required
                      options={roles.map((role) => ({
                        value: role,
                        label: ROLE_LABEL[role],
                      }))}
                    />
                  </label>
                  <PasswordField name="password" label="รหัสผ่าน" className="crm-modal-span-2" />
                </div>
              </section>

              <fieldset className="crm-modal-modules">
                <legend>ฟังก์ชันที่เข้าได้</legend>
                <p>Superadmin และ Admin เข้าได้ทุกฟังก์ชันอัตโนมัติ — บัญชีอื่นเลือกเฉพาะที่ต้องการ</p>
                <div className="crm-modal-module-grid">
                  {ADMIN_MODULES.map((module) => (
                    <label key={module} className="crm-modal-check">
                      <input type="checkbox" name="modules" value={module} />
                      <span>{MODULE_LABEL[module]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <p className="crm-modal-note">บัญชี Partners สร้างตอนสมัครพาร์ตเนอร์ ไม่สร้างจากหน้านี้</p>
            </div>

            <div className="kpi-users-sidepanel-actions">
              <button type="button" className="crm-users-secondary" onClick={closePanel}>
                ยกเลิก
              </button>
              <PendingSubmitButton className="kpi-button crm-users-primary" pendingLabel="กำลังสร้าง…">
                บันทึก
              </PendingSubmitButton>
            </div>
          </form>
        </aside>
      ) : null}
    </NewUserModalContext.Provider>
  );
}
