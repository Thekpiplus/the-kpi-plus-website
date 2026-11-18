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
import { createStaffUser, changeStaffPassword, updateStaffUser } from "@/lib/crm/user-admin";
import { ADMIN_MODULES, MODULE_LABEL, type AdminModule } from "@/lib/crm/modules";
import { ROLE_LABEL, type InternalRole } from "@/lib/crm/roles";
import { CrmSelect } from "@/components/crm/CrmSelect";
import { PasswordChangeFields, PasswordField } from "@/components/crm/ui/PasswordField";
import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";

export type WorkspaceUser = {
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
  roleOptions: InternalRole[];
};

type Panel =
  | { kind: "create" }
  | { kind: "edit"; user: WorkspaceUser }
  | { kind: "password"; user: WorkspaceUser; error?: boolean }
  | null;

type Api = {
  openCreate: () => void;
  openEdit: (user: WorkspaceUser) => void;
  openPassword: (user: WorkspaceUser, error?: boolean) => void;
  close: () => void;
};

const UsersWorkspaceContext = createContext<Api | null>(null);

export function useUsersWorkspace() {
  const ctx = useContext(UsersWorkspaceContext);
  if (!ctx) throw new Error("useUsersWorkspace must be used within UsersWorkspace");
  return ctx;
}

export function UsersCreateOpenButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { openCreate } = useUsersWorkspace();
  return (
    <button type="button" className={className} onClick={openCreate}>
      {children}
    </button>
  );
}

const CREATE_ERROR: Record<string, string> = {
  invalid: "กรอกข้อมูลให้ครบ และเลือกอย่างน้อย 1 ฟังก์ชัน (ยกเว้น Superadmin/Admin)",
  exists: "อีเมล ชื่อผู้ใช้ หรือเบอร์นี้มีในระบบแล้ว",
};

export function UsersWorkspace({
  roles,
  createError,
  autoOpenCreate = false,
  passwordTarget,
  passwordError = false,
  children,
}: {
  roles: InternalRole[];
  createError?: string;
  autoOpenCreate?: boolean;
  passwordTarget?: WorkspaceUser;
  passwordError?: boolean;
  children: ReactNode;
}) {
  const [panel, setPanel] = useState<Panel>(() => {
    if (autoOpenCreate) return { kind: "create" };
    if (passwordTarget) return { kind: "password", user: passwordTarget, error: passwordError };
    return null;
  });
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const openCreate = useCallback(() => setPanel({ kind: "create" }), []);
  const openEdit = useCallback((user: WorkspaceUser) => setPanel({ kind: "edit", user }), []);
  const openPassword = useCallback(
    (user: WorkspaceUser, error = false) => setPanel({ kind: "password", user, error }),
    [],
  );
  const close = useCallback(() => setPanel(null), []);

  useEffect(() => {
    if (autoOpenCreate || createError) setPanel({ kind: "create" });
  }, [autoOpenCreate, createError]);

  useEffect(() => {
    if (passwordTarget) setPanel({ kind: "password", user: passwordTarget, error: passwordError });
  }, [passwordTarget, passwordError]);

  useEffect(() => {
    if (!panel) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setPanel(null);
    }
    document.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => firstFieldRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [panel]);

  const formError =
    panel?.kind === "create" && createError && CREATE_ERROR[createError]
      ? CREATE_ERROR[createError]
      : null;

  const title =
    panel?.kind === "create"
      ? "เพิ่มผู้ใช้งาน"
      : panel?.kind === "edit"
        ? "แก้ไขข้อมูลผู้ใช้งาน"
        : panel?.kind === "password"
          ? "แก้ไขรหัสผ่าน"
          : "";
  const lead =
    panel?.kind === "create"
      ? "กรอกข้อมูลบัญชี เลือกบทบาท และเปิดฟังก์ชันที่ต้องการให้เข้าใช้"
      : panel?.kind === "edit"
        ? `แก้ไขข้อมูลและสิทธิ์ของ ${panel.user.name}`
        : panel?.kind === "password"
          ? `ตั้งรหัสผ่านใหม่สำหรับ ${panel.user.name}`
          : "";

  return (
    <UsersWorkspaceContext.Provider value={{ openCreate, openEdit, openPassword, close }}>
      <div className={`kpi-users-workspace${panel ? " has-panel" : ""}`}>
        <div className="kpi-users-workspace-main">{children}</div>

        {panel ? (
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
                onClick={close}
              >
                ✕
              </button>
            </div>

            {panel.kind === "create" ? (
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
                  <button type="button" className="crm-users-secondary" onClick={close}>
                    ยกเลิก
                  </button>
                  <PendingSubmitButton className="kpi-button crm-users-primary" pendingLabel="กำลังสร้าง…">
                    บันทึก
                  </PendingSubmitButton>
                </div>
              </form>
            ) : null}

            {panel.kind === "edit" ? (
              <form action={updateStaffUser} className="kpi-users-sidepanel-form">
                <div className="kpi-users-sidepanel-body">
                  <input type="hidden" name="userId" value={panel.user.id} />
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
                          defaultValue={panel.user.name}
                          required
                        />
                      </label>
                      <label className="crm-modal-field">
                        ชื่อผู้ใช้ (Username)
                        <input
                          className="crm-field"
                          name="username"
                          defaultValue={panel.user.username ?? ""}
                          pattern="[a-zA-Z0-9._-]{3,32}"
                          required
                        />
                      </label>
                      <label className="crm-modal-field">
                        อีเมล
                        <input
                          className="crm-field"
                          type="email"
                          name="email"
                          defaultValue={panel.user.email}
                          required
                        />
                      </label>
                      <label className="crm-modal-field">
                        เบอร์โทร
                        <input className="crm-field" name="phone" defaultValue={panel.user.phone} required />
                      </label>
                      {!panel.user.isPartner ? (
                        <label className="crm-modal-field crm-modal-span-2">
                          บทบาท (User Role)
                          <select className="crm-select" name="role" defaultValue={panel.user.role} required>
                            {panel.user.roleOptions.map((role) => (
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
                  {!panel.user.isPartner ? (
                    <fieldset className="crm-modal-modules">
                      <legend>ฟังก์ชันที่เข้าได้</legend>
                      <p>
                        {panel.user.isFullAccess
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
                              defaultChecked={panel.user.selectedModules.includes(module)}
                            />
                            <span>{MODULE_LABEL[module]}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ) : null}
                </div>
                <div className="kpi-users-sidepanel-actions">
                  <button type="button" className="crm-users-secondary" onClick={close}>
                    ยกเลิก
                  </button>
                  <PendingSubmitButton className="kpi-button crm-users-primary" pendingLabel="กำลังบันทึก…">
                    บันทึก
                  </PendingSubmitButton>
                </div>
              </form>
            ) : null}

            {panel.kind === "password" ? (
              <form action={changeStaffPassword} className="kpi-users-sidepanel-form">
                <div className="kpi-users-sidepanel-body">
                  <input type="hidden" name="userId" value={panel.user.id} />
                  {panel.error ? (
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
                  <button type="button" className="crm-users-secondary" onClick={close}>
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
    </UsersWorkspaceContext.Provider>
  );
}
