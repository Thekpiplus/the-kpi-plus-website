"use client";

import { useState } from "react";

type Result = {
  url: string;
  scores: { google: number; ai: number; mobile: number };
  improvements: string[];
  checks: { status: number };
};

export function SearchabilityCheck() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  return (
    <div className="kpi-card p-7">
      <form
        className="grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError("");
          setResult(null);
          try {
            const response = await fetch("/api/searchability", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url }),
            });
            const data = await response.json();
            if (!response.ok) {
              setError("ตรวจสอบ URL ไม่สำเร็จ กรุณาใส่หน้าแรกของโรงแรม เช่น https://yourhotel.com");
              return;
            }
            setResult(data);
          } catch {
            setError("เชื่อมต่อเครื่องมือไม่สำเร็จ");
          } finally {
            setLoading(false);
          }
        }}
      >
        <label className="kpi-label">
          Website URL
          <input
            className="kpi-field mt-1"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://yourhotel.com"
            required
          />
        </label>
        <p className="text-sm leading-6 text-[#555555]">
          กรอก URL หน้าแรกของเว็บไซต์โรงแรม เช่น https://yourhotel.com
        </p>
        <button type="submit" className="kpi-button" disabled={loading}>
          {loading ? "กำลังตรวจสอบ..." : "ตรวจสอบเว็บไซต์"}
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-[#bd3f3f]">{error}</p> : null}
      {result ? (
        <div className="mt-8 grid gap-4">
          <p className="text-sm text-[#555555]">{result.url}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Score label="Google" value={result.scores.google} />
            <Score label="AI Search" value={result.scores.ai} />
            <Score label="มือถือ" value={result.scores.mobile} />
          </div>
          <div>
            <p className="text-sm font-extrabold text-[#3B3B3B]">3 สิ่งที่ควรปรับปรุง</p>
            <ul className="mt-3 grid gap-2 text-sm text-[#555555]">
              {result.improvements.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#F4F4F4] p-5">
      <p className="text-xs font-extrabold uppercase tracking-[.12em] text-[#555555]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-[#3B3B3B]">{value}</p>
    </div>
  );
}
