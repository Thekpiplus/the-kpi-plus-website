"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminForgotPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="crm-auth">
      <aside className="crm-auth-brand" aria-hidden="true">
        <div className="crm-auth-brand-inner">
          <p className="crm-auth-kicker">The KPI Plus</p>
          <h2 className="crm-auth-headline">รีเซ็ตรหัสผ่าน</h2>
          <p className="crm-auth-copy">ส่งลิงก์รีเซ็ตไปที่อีเมลที่ยืนยันแล้ว PIN เดิมจะไม่ถูกส่งทางอีเมล</p>
        </div>
      </aside>
      <div className="crm-auth-panel">
        <form
          className="crm-auth-card"
          onSubmit={async (event) => {
            event.preventDefault();
            await fetch("/api/crm/forgot", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            setDone(true);
          }}
        >
          <h1 className="crm-auth-title">ลืม PIN</h1>
          <p className="crm-auth-lead">ส่งลิงก์รีเซ็ตไปที่อีเมลที่ยืนยันแล้ว PIN เดิมจะไม่ถูกส่งทางอีเมล</p>
          <label className="crm-auth-label">
            อีเมล
            <input
              className="crm-field"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <button className="kpi-button crm-auth-submit" type="submit">
            ส่งลิงก์รีเซ็ต
          </button>
          {done ? <p className="crm-auth-error" style={{ color: "#0b6660" }}>ถ้าอีเมลนี้มีในระบบ คุณจะได้รับลิงก์ในไม่ช้า</p> : null}
          <p className="crm-auth-footer">
            <Link href="/admin">กลับไปเข้าสู่ระบบ</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
