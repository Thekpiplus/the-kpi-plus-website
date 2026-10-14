"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { createStaffUser } from "@/lib/crm/user-admin";
import { ADMIN_MODULES, MODULE_LABEL } from "@/lib/crm/modules";
import { ROLE_LABEL, type InternalRole } from "@/lib/crm/roles";

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
  const formError = error && ERROR_COPY[error] ? ERROR_COPY[error] : null;

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen, error]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <NewUserModalContext.Provider value={{ open: openModal, close: closeModal }}>
      {children}
      {open ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={closeModal} />
          <div
            className="crm-modal-panel crm-modal-panel-user"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">Users</p>
                <h2 id={titleId} className="crm-modal-title">
                  เพิ่มผู้ใช้ทีม
                </h2>
                <p className="crm-modal-lead">เลือกบทบาท และติ๊กฟังก์ชันที่ต้องการให้บัญชีนี้เข้าใช้</p>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form action={createStaffUser} className="crm-modal-form">
              {formError ? (
                <p className="crm-users-alert is-warn" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="crm-modal-grid">
                <label className="crm-modal-field">
                  ชื่อ
                  <input className="crm-field" name="name" required autoFocus />
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
                  เบอร์โทร
                  <input className="crm-field" name="phone" required />
                </label>
                <label className="crm-modal-field">
                  รหัสผ่าน
                  <input className="crm-field" type="password" name="password" minLength={4} required />
                </label>
                <label className="crm-modal-field">
                  บทบาท (User Role)
                  <select className="crm-select" name="role" defaultValue="user" required>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABEL[role]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <fieldset className="crm-modal-modules">
                <legend>ฟังก์ชันที่เข้าได้</legend>
                <p>Superadmin และ Admin เข้าได้ทุกฟังก์ชันอัตโนมัติ</p>
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

              <div className="crm-modal-actions">
                <button type="button" className="crm-users-secondary" onClick={closeModal}>
                  ยกเลิก
                </button>
                <button className="kpi-button" type="submit">
                  สร้างผู้ใช้
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </NewUserModalContext.Provider>
  );
}
