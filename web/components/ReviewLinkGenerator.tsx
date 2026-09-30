"use client";

import { useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { ArrowUpRight, Copy, Download, MapPin } from "@/components/Icons";
import { reviewLinkMessage, type PlaceHit, type ReviewLinkError, type ReviewPlace } from "@/lib/review-link";

type ApiError = { error?: ReviewLinkError };

const steps = [
  ["01", "ค้นหาธุรกิจ"],
  ["02", "คัดลอกลิงก์หรือดาวน์โหลด QR Code"],
  ["03", "ส่งให้ลูกค้ารีวิว"],
];

function fileSlug(place: ReviewPlace) {
  const base = (place.name || "google-review").toLowerCase().replace(/[^a-z0-9ก-๙]+/gi, "-").replace(/^-|-$/g, "");
  return `${base || "google-review"}-review.png`;
}

export function ReviewLinkGenerator() {
  const [name, setName] = useState("");
  const [pasted, setPasted] = useState("");
  const [places, setPlaces] = useState<PlaceHit[]>([]);
  const [selected, setSelected] = useState<ReviewPlace | null>(null);
  const [searching, setSearching] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [importError, setImportError] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrBusy, setQrBusy] = useState(false);

  const resetResult = () => {
    setSelected(null);
    setCopied(false);
  };

  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    setSearching(true);
    setError("");
    setImportError("");
    setPlaces([]);
    resetResult();
    try {
      const response = await fetch("/api/review-link/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = (await response.json()) as { places?: PlaceHit[] } & ApiError;
      if (!response.ok || !data.places) {
        setError(reviewLinkMessage(data.error ?? "unavailable"));
        return;
      }
      setPlaces(data.places);
    } catch {
      setError(reviewLinkMessage("unavailable"));
    } finally {
      setSearching(false);
    }
  };

  const choose = async (place: PlaceHit) => {
    setResolving(true);
    setError("");
    resetResult();
    try {
      const response = await fetch("/api/review-link/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: place.placeId }),
      });
      const data = (await response.json()) as { place?: ReviewPlace } & ApiError;
      if (!response.ok || !data.place?.reviewUri) {
        setError(reviewLinkMessage(data.error ?? "no_review_link"));
        return;
      }
      setSelected(data.place);
    } catch {
      setError(reviewLinkMessage("unavailable"));
    } finally {
      setResolving(false);
    }
  };

  const importLink = async (event: React.FormEvent) => {
    event.preventDefault();
    setImporting(true);
    setImportError("");
    setError("");
    setPlaces([]);
    resetResult();
    try {
      const response = await fetch("/api/review-link/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pasted }),
      });
      const data = (await response.json()) as { place?: ReviewPlace } & ApiError;
      if (!response.ok || !data.place?.reviewUri) {
        setImportError(reviewLinkMessage(data.error ?? "invalid_link"));
        return;
      }
      setSelected(data.place);
    } catch {
      setImportError(reviewLinkMessage("unavailable"));
    } finally {
      setImporting(false);
    }
  };

  const copyLink = async () => {
    if (!selected?.reviewUri) return;
    try {
      await navigator.clipboard.writeText(selected.reviewUri);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const downloadQr = async () => {
    if (!selected?.reviewUri) return;
    setQrBusy(true);
    try {
      const href = await QRCode.toDataURL(selected.reviewUri, {
        width: 720,
        margin: 2,
        color: { dark: "#063F3B", light: "#FFFFFF" },
      });
      const link = document.createElement("a");
      link.href = href;
      link.download = fileSlug(selected);
      link.click();
    } finally {
      setQrBusy(false);
    }
  };

  return (
    <div className="grid gap-8">
      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map(([num, label]) => (
          <li key={num} className="kpi-card p-5">
            <span className="kpi-latin text-xs font-black tracking-[.14em] text-[#0B6660]">{num}</span>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#3B3B3B]">{label}</p>
          </li>
        ))}
      </ol>

      <div className="kpi-card p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold text-[#3B3B3B]">ค้นหาธุรกิจบน Google</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#555555]">
          พิมพ์ชื่อธุรกิจในไทย ระบบจะค้นหาในประเทศไทยให้ ถ้าชื่อซ้ำกัน ให้เลือกจากที่อยู่ที่ขึ้นมา ไม่ต้องทิ้งข้อมูลติดต่อ
        </p>
        <form className="mt-6 grid gap-4" onSubmit={search}>
          <label className="kpi-label">
            ชื่อธุรกิจในไทย
            <input
              className="kpi-field mt-1"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="เช่น Baan Taranya Resort"
              autoComplete="organization"
              required
            />
          </label>
          <button type="submit" className="kpi-button" disabled={searching}>
            {searching ? "กำลังค้นหา..." : "ค้นหาธุรกิจ"}
          </button>
        </form>

        {error ? <p className="mt-5 text-sm leading-6 text-[#bd3f3f]">{error}</p> : null}

        {places.length ? (
          <div className="mt-8">
            <p className="text-sm font-extrabold text-[#3B3B3B]">เลือกรายการที่ตรงกับที่อยู่จริง</p>
            <ul className="mt-4 grid gap-3">
              {places.map((place) => (
                <li key={place.placeId}>
                  <button
                    type="button"
                    onClick={() => choose(place)}
                    disabled={resolving}
                    className="flex w-full items-start gap-3 rounded-2xl border border-[#E3E8EB] bg-white px-4 py-4 text-left transition hover:bg-[#F2F8E2]"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0B6660]" />
                    <span>
                      <span className="block text-base font-extrabold text-[#063F3B]">{place.name}</span>
                      <span className="mt-1 block text-sm leading-6 text-[#555555]">{place.address}</span>
                      {place.type ? <span className="mt-1 block text-xs font-semibold text-[#0B6660]">{place.type}</span> : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-5 text-[#555555]">
              ผลการค้นหาจาก Google · Powered by Google ·{" "}
              <a href="https://www.google.com/help/terms_maps/" target="_blank" rel="noreferrer" className="underline">
                ข้อกำหนด Google Maps
              </a>
            </p>
          </div>
        ) : null}

        {resolving ? <p className="mt-5 text-sm text-[#555555]">กำลังดึงลิงก์เขียนรีวิวของรายการที่เลือก...</p> : null}

        {selected?.reviewUri ? (
          <div className="mt-8 rounded-2xl border border-[#E3E8EB] bg-[#F4F4F4] p-5 sm:p-6">
            {selected.name ? (
              <p className="text-lg font-extrabold text-[#063F3B]">{selected.name}</p>
            ) : (
              <p className="text-lg font-extrabold text-[#063F3B]">ลิงก์เขียนรีวิว Google</p>
            )}
            {selected.address ? <p className="mt-2 text-sm leading-6 text-[#555555]">{selected.address}</p> : null}
            <p className="mt-4 break-all text-sm leading-6 text-[#3B3B3B]">{selected.reviewUri}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" className="kpi-button" onClick={copyLink}>
                <Copy className="h-4 w-4" />
                {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
              </button>
              <a
                href={selected.reviewUri}
                target="_blank"
                rel="noreferrer"
                className="kpi-surface-btn"
              >
                เปิดเพื่อตรวจสอบ <ArrowUpRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={downloadQr}
                disabled={qrBusy}
                className="kpi-surface-btn"
              >
                <Download className="h-4 w-4" />
                {qrBusy ? "กำลังสร้าง QR..." : "ดาวน์โหลด QR Code"}
              </button>
            </div>
            <p className="mt-4 text-xs leading-5 text-[#555555]">
              ลิงก์และ QR Code ชี้ไปที่ธุรกิจเดียวกัน ลูกค้าต้องมีบัญชี Google จึงจะโพสต์รีวิวได้
            </p>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-[#E3E8EB] bg-white p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-[#3B3B3B]">มีลิงก์รีวิวจาก Google Business Profile อยู่แล้ว?</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#555555]">
          วางลิงก์เขียนรีวิวที่ได้จาก Google ระบบจะตรวจก่อนว่าเป็นลิงก์ Google ที่ใช้เขียนรีวิวได้ แล้วค่อยสร้าง QR Code
        </p>
        <form className="mt-5 grid gap-4" onSubmit={importLink}>
          <label className="kpi-label">
            ลิงก์รีวิว Google
            <input
              className="kpi-field mt-1"
              value={pasted}
              onChange={(event) => setPasted(event.target.value)}
              placeholder="https://search.google.com/local/writereview?placeid=..."
              inputMode="url"
              autoComplete="off"
            />
          </label>
          <button type="submit" className="kpi-button" disabled={importing}>
            {importing ? "กำลังตรวจสอบ..." : "สร้าง QR จากลิงก์นี้"}
          </button>
        </form>
        {importError ? <p className="mt-4 text-sm leading-6 text-[#bd3f3f]">{importError}</p> : null}
      </div>

      <p className="max-w-2xl text-sm leading-7 text-[#555555]">
        เครื่องมือนี้ช่วยให้ลูกค้าเปิดหน้าเขียนรีวิวของธุรกิจนั้นได้ตรงจุด ไม่ได้การันตีจำนวนรีวิวหรือรีวิวเชิงบวก
        ถ้าอยากให้ลูกค้าค้นหาเจอและเข้าถึงข้อมูลธุรกิจได้ชัดขึ้น{" "}
        <Link href="/solutions/hotel-seo-google-maps-ai-search" className="font-semibold text-[#0B6660]">
          ดูงาน SEO และ Local Search
        </Link>
      </p>
    </div>
  );
}
