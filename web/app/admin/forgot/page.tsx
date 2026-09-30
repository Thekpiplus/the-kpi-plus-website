"use client";

import { useState } from "react";

export default function AdminForgotPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      className="crm-card mx-auto mt-16 max-w-md"
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
      <h1 className="text-2xl font-extrabold text-[#3B3B3B]">ลืม PIN</h1>
      <p className="mt-2 text-sm">ส่งลิงก์รีเซ็ตไปที่อีเมลที่ยืนยันแล้ว PIN เดิมจะไม่ถูกส่งทางอีเมล</p>
      <label className="mt-5 block text-sm font-bold text-[#3B3B3B]">
        อีเมล
        <input className="crm-field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <button className="kpi-button mt-6" type="submit">
        ส่งลิงก์รีเซ็ต
      </button>
      {done ? <p className="mt-3 text-sm font-semibold text-[#0B6660]">ถ้าอีเมลนี้มีในระบบ คุณจะได้รับลิงก์ในไม่ช้า</p> : null}
      <p className="mt-4">
        <a href="/admin" className="text-sm font-semibold text-[#0B6660]">
          กลับไปเข้าสู่ระบบ
        </a>
      </p>
    </form>
  );
}
