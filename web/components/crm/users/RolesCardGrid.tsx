"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { AdminModule } from "@/lib/crm/modules";
import { ROLE_LABEL, type UserRole } from "@/lib/crm/roles";

export type RoleCardItem = {
  role: UserRole;
  blurb: string;
  department: string;
  jobTitle: string;
  count: number;
  fullAccess: boolean;
  modules: AdminModule[];
  moduleLabels: string[];
};

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 5 6v5c0 5 3.2 8.4 7 9.8 3.8-1.4 7-4.8 7-9.8V6l-7-3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3.5 19c.6-3 2.8-4.5 5.5-4.5S14 16 14.5 19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 14.5c2 .3 3.5 1.5 4 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="7" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconPencil() {
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

function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 5h5v5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14 19 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M18 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18V7A1.5 1.5 0 0 1 5.5 5.5H10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function roleTone(role: UserRole) {
  if (role === "superadmin" || role === "admin") return "rose";
  if (role === "sales") return "sky";
  if (role === "partner") return "amber";
  if (role === "staff") return "violet";
  return "brand";
}

function RoleIcon({ role }: { role: UserRole }) {
  if (role === "superadmin" || role === "admin") return <IconShield />;
  if (role === "partner") return <IconBriefcase />;
  return <IconUsers />;
}

function RoleCard({ item, canEdit }: { item: RoleCardItem; canEdit: boolean }) {
  const [open, setOpen] = useState(false);
  const detailId = useId();
  const tone = roleTone(item.role);
  const label = ROLE_LABEL[item.role];
  const usersHref = `/crm/users?role=${encodeURIComponent(item.role)}`;

  return (
    <article className={`kpi-role-card is-${tone}`}>
      <header className="kpi-role-card-head">
        <div className="kpi-role-card-identity">
          <span className={`kpi-role-card-icon is-${tone}`} aria-hidden="true">
            <RoleIcon role={item.role} />
          </span>
          <div className="kpi-role-card-titles">
            <h3 className="kpi-role-card-name">{label}</h3>
            <p className="kpi-role-card-blurb">{item.blurb}</p>
          </div>
        </div>
        {canEdit ? (
          <Link href={usersHref} className="kpi-role-card-edit" title={`จัดการผู้ใช้บทบาท ${label}`}>
            <IconPencil />
            <span>แก้ไขสิทธิ์</span>
          </Link>
        ) : null}
      </header>

      <div className="kpi-role-card-meta">
        <div className="kpi-role-card-meta-box">
          <span className="kpi-role-card-meta-label">แผนก</span>
          <strong>{item.department}</strong>
        </div>
        <div className="kpi-role-card-meta-box">
          <span className="kpi-role-card-meta-label">ตำแหน่งงาน</span>
          <strong>{item.jobTitle}</strong>
        </div>
      </div>

      <p className="kpi-role-card-count">
        <strong>{item.count}</strong> ผู้ใช้
      </p>

      <div className="kpi-role-card-modules">
        <span className="kpi-role-card-modules-label">สิทธิ์เข้าถึงโมดูล</span>
        <div className="kpi-role-card-tags">
          {item.fullAccess ? (
            <span className="kpi-role-tag is-all">ทุกโมดูล</span>
          ) : item.moduleLabels.length ? (
            item.moduleLabels.map((name) => (
              <span key={name} className="kpi-role-tag">
                {name}
              </span>
            ))
          ) : (
            <span className="kpi-role-tag is-none">ไม่มีโมดูลแอดมิน</span>
          )}
        </div>
      </div>

      <div className="kpi-role-card-footer">
        <button
          type="button"
          className="kpi-role-card-detail"
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? "ซ่อนรายละเอียดสิทธิ์" : "ดูรายละเอียดสิทธิ์"}</span>
          <IconExternal />
        </button>
      </div>

      {open ? (
        <div className="kpi-role-card-detail-panel" id={detailId} role="region" aria-label={`รายละเอียด ${label}`}>
          <p>
            {item.fullAccess
              ? "บทบาทนี้เข้าได้ทุกโมดูลแอดมินโดยอัตโนมัติ"
              : item.role === "partner"
                ? "บัญชี Partners ใช้พอร์ทัลพาร์ตเนอร์ ไม่ใช้เมทริกซ์โมดูลแอดมิน"
                : "โมดูลจริงกำหนดรายบัญชีใน Users Management — ค่าด้านบนเป็นแนวทางอ้างอิงของบทบาท"}
          </p>
          <div className="kpi-role-card-detail-actions">
            <Link href={usersHref} className="kpi-button crm-users-primary">
              ดูผู้ใช้บทบาทนี้
            </Link>
            <button type="button" className="crm-users-secondary" onClick={() => setOpen(false)}>
              ปิด
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function RolesCardGrid({ items, canEdit }: { items: RoleCardItem[]; canEdit: boolean }) {
  return (
    <div className="kpi-role-grid">
      {items.map((item) => (
        <RoleCard key={item.role} item={item} canEdit={canEdit} />
      ))}
    </div>
  );
}
