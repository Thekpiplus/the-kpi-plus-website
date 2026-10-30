"use client";

import Link from "next/link";
import { useState } from "react";
import { CrmThemeToggle } from "@/components/crm/CrmThemeToggle";

const ERRORS: Record<string, string> = {
  invalid: "อีเมล / ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง",
  locked: "พยายามผิดหลายครั้ง บัญชีถูกล็อกชั่วคราว",
  rate_limited: "พยายามบ่อยเกินไป ลองใหม่ภายหลัง",
};

export function LoginForm({ error }: { error?: string }) {
  const [pending, setPending] = useState(false);

  return (
    <div className="crm-auth">
      <aside className="crm-auth-brand" aria-hidden="true">
        <div className="crm-auth-brand-inner">
          <p className="crm-auth-kicker">The KPI Plus</p>
          <h2 className="crm-auth-headline">Admin Workspace</h2>
          <p className="crm-auth-copy">
            จัดการลีด พาร์ตเนอร์ ผู้ใช้ และเนื้อหาเว็บไซต์ในที่เดียว สำหรับทีม เดอะ เคพีไอ พลัส
          </p>
          <ul className="crm-auth-points">
            <li>Lead Management</li>
            <li>Partner Management</li>
            <li>Users & CMS</li>
          </ul>
        </div>
      </aside>

      <div className="crm-auth-panel">
        <div className="crm-auth-theme">
          <CrmThemeToggle />
        </div>
        <form
          action="/api/crm/login"
          method="post"
          className="crm-auth-card"
          aria-busy={pending}
          onSubmit={() => setPending(true)}
        >
          <img
            src="/brand/KPIPlus_Horizontal_FullColor.png"
            alt="The KPI Plus"
            width={180}
            height={40}
            className="crm-auth-logo"
          />
          <h1 className="crm-auth-title">เข้าสู่ระบบแอดมิน</h1>
          <p className="crm-auth-lead">ใช้อีเมลหรือชื่อผู้ใช้เพื่อเข้า CRM และ Partner Management</p>

          <label className="crm-auth-label">
            อีเมล หรือ ชื่อผู้ใช้
            <input className="crm-field" type="text" name="email" autoComplete="username" required readOnly={pending} />
          </label>
          <label className="crm-auth-label">
            รหัสผ่าน
            <input
              className="crm-field"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              readOnly={pending}
            />
          </label>

          {error ? <p className="crm-auth-error">{ERRORS[error] ?? ERRORS.invalid}</p> : null}

          <button className="kpi-button crm-auth-submit" type="submit" disabled={pending}>
            {pending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
          </button>

          <p className="crm-auth-footer">
            <Link href="/admin/forgot">ลืมรหัสผ่าน?</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
