"use client";

import Link from "next/link";
import { useId, useState } from "react";

/** Inline notice only — no mock role CRUD / no schema invent. */
export function RolesCreateNotice({
  canEdit,
  label = "+ สร้างบทบาท",
  className = "kpi-button crm-users-primary",
}: {
  canEdit: boolean;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  return (
    <div className="kpi-users-roles-create">
      <button
        type="button"
        className={className}
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "ปิดคำอธิบาย" : label}
      </button>

      {open ? (
        <aside
          className="kpi-users-inline-confirm is-info"
          id={titleId}
          role="region"
          aria-labelledby={`${titleId}-label`}
        >
          <p id={`${titleId}-label`}>
            ตอนนี้ระบบมีเฉพาะ <strong>system roles</strong> ในโค้ด — ยังไม่มี data model สำหรับสร้างบทบาทใหม่ตามแผนก
            (Department) หรือตำแหน่งงาน (Job Title)
          </p>
          <p>
            การมอบสิทธิ์ทำได้โดยแก้บทบาทและโมดูล<strong>รายบัญชี</strong>ที่รายชื่อผู้ใช้
          </p>
          <div className="kpi-users-inline-confirm-actions">
            <button type="button" className="crm-users-secondary" onClick={() => setOpen(false)}>
              ปิด
            </button>
            {canEdit ? (
              <Link href="/crm/users" className="kpi-button crm-users-primary">
                ไปแก้สิทธิ์รายบัญชี
              </Link>
            ) : null}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
