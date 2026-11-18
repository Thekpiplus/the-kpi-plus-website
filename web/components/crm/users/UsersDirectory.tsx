"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RoleBadge } from "@/components/crm/ui/RoleBadge";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";
import { useUsersWorkspace, type WorkspaceUser } from "@/components/crm/users/UsersWorkspace";
import { deleteStaffUser } from "@/lib/crm/user-admin";
import type { AdminModule } from "@/lib/crm/modules";
import type { InternalRole } from "@/lib/crm/roles";

export type UsersDirectoryItem = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  phone: string;
  role: string;
  normalizedRole: string;
  selectedModules: AdminModule[];
  isPartner: boolean;
  isFullAccess: boolean;
  canDelete: boolean;
  locked: boolean;
  lastLoginLabel: string;
  roleOptions: InternalRole[];
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "KP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function IconView() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

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

function toWorkspaceUser(user: UsersDirectoryItem): WorkspaceUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    phone: user.phone,
    role: user.normalizedRole,
    selectedModules: user.selectedModules,
    isPartner: user.isPartner,
    isFullAccess: user.isFullAccess,
    canDelete: user.canDelete,
    roleOptions: user.roleOptions,
  };
}

function DirectoryActions({
  user,
  canEdit,
}: {
  user: UsersDirectoryItem;
  canEdit: boolean;
}) {
  const { openEdit, openPassword } = useUsersWorkspace();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const workspaceUser = toWorkspaceUser(user);

  if (!canEdit || user.isPartner) {
    return (
      <div className="kpi-users-row-actions">
        <Link
          href={`/crm/users/${user.id}`}
          className="kpi-users-icon-btn is-view"
          aria-label={`ดูรายละเอียด ${user.name}`}
          title="ดูรายละเอียด"
        >
          <IconView />
        </Link>
      </div>
    );
  }

  return (
    <div className="kpi-users-row-actions-wrap">
      <div className="kpi-users-row-actions">
        <button
          type="button"
          className="kpi-users-icon-btn is-edit"
          aria-label={`แก้ไข ${user.name}`}
          title="แก้ไข"
          onClick={() => {
            setConfirmDelete(false);
            openEdit(workspaceUser);
          }}
        >
          <IconEdit />
        </button>
        <button
          type="button"
          className="kpi-users-icon-btn is-password"
          aria-label={`เปลี่ยนรหัสผ่าน ${user.name}`}
          title="รหัสผ่าน"
          onClick={() => {
            setConfirmDelete(false);
            openPassword(workspaceUser);
          }}
        >
          <IconKey />
        </button>
        {user.canDelete ? (
          <button
            type="button"
            className="kpi-users-icon-btn is-danger"
            aria-label={`ลบ ${user.name}`}
            title="ลบ"
            aria-expanded={confirmDelete}
            onClick={() => setConfirmDelete((open) => !open)}
          >
            <IconTrash />
          </button>
        ) : null}
      </div>

      {confirmDelete ? (
        <div className="kpi-users-inline-confirm" role="region" aria-label="ยืนยันการลบ">
          <p>
            ยืนยันลบ <strong>{user.name}</strong>? การกระทำนี้ลบบัญชีออกจากระบบและออกจากเซสชันทั้งหมด
          </p>
          <div className="kpi-users-inline-confirm-actions">
            <button type="button" className="crm-users-secondary" onClick={() => setConfirmDelete(false)}>
              ยกเลิก
            </button>
            <form action={deleteStaffUser}>
              <input type="hidden" name="userId" value={user.id} />
              <PendingSubmitButton className="kpi-button kpi-users-danger" pendingLabel="กำลังลบ…">
                ยืนยันลบ
              </PendingSubmitButton>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DirectoryActionsSafe({
  user,
  canEdit,
}: {
  user: UsersDirectoryItem;
  canEdit: boolean;
}) {
  if (!canEdit) {
    return (
      <div className="kpi-users-row-actions">
        <Link
          href={`/crm/users/${user.id}`}
          className="kpi-users-icon-btn is-view"
          aria-label={`ดูรายละเอียด ${user.name}`}
          title="ดูรายละเอียด"
        >
          <IconView />
        </Link>
      </div>
    );
  }
  return <DirectoryActions user={user} canEdit={canEdit} />;
}

export function UsersDirectory({
  users,
  canEdit,
}: {
  users: UsersDirectoryItem[];
  canEdit: boolean;
  passwordErrorUserId?: string;
}) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 719px)");
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (compact) {
    return (
      <div className="kpi-users-card-list">
        {users.map((user) => (
          <article key={user.id} className={`kpi-users-card${user.locked ? " is-locked" : ""}`}>
            <div className="kpi-users-card-row">
              <div className="kpi-users-identity">
                <span className="kpi-users-avatar" aria-hidden="true">
                  {initials(user.name)}
                </span>
                <div className="kpi-users-identity-text">
                  <Link href={`/crm/users/${user.id}`} className="kpi-users-name">
                    {user.name}
                  </Link>
                  {user.username ? <p className="kpi-users-meta">@{user.username}</p> : null}
                </div>
              </div>
              {user.locked ? (
                <StatusBadge label="ถูกล็อก" tone="danger" />
              ) : (
                <StatusBadge label="ใช้งานได้" tone="success" />
              )}
            </div>
            <div className="kpi-users-card-meta">
              <span className="kpi-users-card-meta-item">
                <span className="kpi-users-card-meta-label">อีเมล</span>
                <span>{user.email}</span>
              </span>
              <span className="kpi-users-card-meta-item">
                <span className="kpi-users-card-meta-label">บทบาท</span>
                <RoleBadge role={user.role} />
              </span>
              <span className="kpi-users-card-meta-item">
                <span className="kpi-users-card-meta-label">ใช้งานล่าสุด</span>
                <span>{user.lastLoginLabel}</span>
              </span>
            </div>
            <div className="kpi-users-card-footer">
              <DirectoryActionsSafe user={user} canEdit={canEdit} />
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="kpi-users-table-wrap">
      <table className="kpi-users-table">
        <thead>
          <tr>
            <th scope="col">ชื่อ / username</th>
            <th scope="col" className="kpi-users-col-email">
              อีเมล
            </th>
            <th scope="col">บทบาท</th>
            <th scope="col">สถานะบัญชี</th>
            <th scope="col" className="kpi-users-col-login">
              ใช้งานล่าสุด
            </th>
            <th scope="col" className="kpi-users-col-actions">
              จัดการ
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={user.locked ? "is-locked" : undefined}>
              <td>
                <div className="kpi-users-identity">
                  <span className="kpi-users-avatar" aria-hidden="true">
                    {initials(user.name)}
                  </span>
                  <div className="kpi-users-identity-text">
                    <Link href={`/crm/users/${user.id}`} className="kpi-users-name">
                      {user.name}
                    </Link>
                    {user.username ? <p className="kpi-users-meta">@{user.username}</p> : null}
                    <p className="kpi-users-meta kpi-users-meta-email-mobile">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="kpi-users-col-email">
                <span className="kpi-users-email">{user.email}</span>
              </td>
              <td>
                <RoleBadge role={user.role} />
              </td>
              <td>
                {user.locked ? (
                  <StatusBadge label="ถูกล็อก" tone="danger" />
                ) : (
                  <StatusBadge label="ใช้งานได้" tone="success" />
                )}
              </td>
              <td className="kpi-users-col-login">
                <span className="kpi-users-login">{user.lastLoginLabel}</span>
              </td>
              <td className="kpi-users-col-actions">
                <DirectoryActionsSafe user={user} canEdit={canEdit} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
