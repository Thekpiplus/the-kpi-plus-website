"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      className="crm-card mx-auto mt-16 max-w-md"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        const response = await fetch("/api/crm/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, pin }),
        });
        const data = await response.json();
        if (!data.ok) {
          setError("ลิงก์ไม่ถูกต้องหรือหมดอายุ");
          return;
        }
        setDone(true);
      }}
    >
      <h1 className="text-2xl font-extrabold text-[#3B3B3B]">ตั้ง PIN ใหม่</h1>
      <label className="mt-5 block text-sm font-bold text-[#3B3B3B]">
        PIN 4 หลักใหม่
        <input
          className="crm-field"
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
          inputMode="numeric"
          required
        />
      </label>
      {error ? <p className="mt-3 text-sm font-semibold text-[#0B1F33]">{error}</p> : null}
      {done ? (
        <p className="mt-3 text-sm font-semibold text-[#0B6660]">
          ตั้ง PIN ใหม่แล้ว <a href="/admin">เข้าสู่ระบบ</a>
        </p>
      ) : (
        <button className="kpi-button mt-6" type="submit">
          บันทึก PIN
        </button>
      )}
    </form>
  );
}

export default function AdminResetPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
