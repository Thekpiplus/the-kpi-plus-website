"use client";

import { useState } from "react";

export function SetupForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/crm/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, pin }),
    });
    const data = await response.json();
    if (!data.ok) {
      setError("ตั้งค่าเจ้าของไม่สำเร็จ ตรวจชื่อ เบอร์ อีเมล และ PIN 4 หลัก");
      return;
    }
    window.location.href = "/crm";
  }

  return (
    <form onSubmit={submit} className="crm-card mx-auto mt-16 max-w-md">
      <h1 className="text-2xl font-extrabold text-[#3B3B3B]">ตั้งค่าเจ้าของ CRM</h1>
      <p className="mt-2 text-sm">ครั้งแรกเท่านั้น เลือก PIN 4 หลักของคุณเอง ไม่มีรหัสเริ่มต้น</p>
      <label className="mt-5 block text-sm font-bold text-[#3B3B3B]">
        ชื่อ
        <input className="crm-field" value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        เบอร์โทรเข้าสู่ระบบ
        <input className="crm-field" value={phone} onChange={(event) => setPhone(event.target.value)} inputMode="tel" required />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        อีเมลกู้คืน
        <input className="crm-field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className="mt-4 block text-sm font-bold text-[#3B3B3B]">
        PIN 4 หลัก
        <input
          className="crm-field"
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          autoComplete="new-password"
          required
        />
      </label>
      {error ? <p className="mt-3 text-sm font-semibold text-[#0B1F33]">{error}</p> : null}
      <button className="kpi-button mt-6" type="submit">
        สร้างบัญชีเจ้าของ
      </button>
    </form>
  );
}
