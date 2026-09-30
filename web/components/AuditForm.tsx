"use client";

import { useState } from "react";

const topics = [
  "Revenue Management",
  "OTA & Distribution",
  "Pricing Strategy",
  "Direct Booking Strategy",
  "Google Ads",
  "Meta Ads",
  "SEO & Local Search",
  "Hotel Website & Conversion",
  "Hospitality Technology",
  "AI & Automation",
  "Academy & Training",
  "Not sure yet",
];

export function AuditForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      id="audit"
      className="kpi-card grid gap-4 p-6 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label className="kpi-label">
        ชื่อ-นามสกุล *
        <input name="name" required className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        ชื่อโรงแรม / บริษัท *
        <input name="hotel" required className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        ตำแหน่ง
        <input name="title" className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        อีเมลสำหรับติดต่อ *
        <input name="email" type="email" required className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        เบอร์โทรศัพท์ *
        <input name="phone" required className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        ที่ตั้งโรงแรม
        <input name="location" className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        เว็บไซต์
        <input name="website" className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        จำนวนห้องพัก
        <input name="rooms" className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        เรื่องที่อยากให้ช่วย *
        <select name="topic" required className="kpi-field mt-1">
          {topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </label>
      <label className="kpi-label">
        ช่องทางที่สะดวก *
        <select name="channel" required className="kpi-field mt-1">
          <option>Email</option>
          <option>Phone</option>
          <option>WhatsApp</option>
          <option>LINE</option>
        </select>
      </label>
      <label className="kpi-label">
        ตอนนี้โรงแรมอยากแก้เรื่องอะไรที่สุด? *
        <textarea name="challenge" required className="kpi-field mt-1 min-h-28" />
      </label>
      <button type="submit" className="kpi-button mt-2">
        ขอวิเคราะห์ Performance โรงแรม
      </button>
      <p className="text-xs leading-6 text-[#555555]">
        By submitting, you agree that The KPI Plus may contact you about this enquiry.
      </p>
      {submitted ? (
        <p className="text-sm font-semibold text-[#0B6660]">
          รับข้อมูลแล้ว — ทีม เดอะ เคพีไอ พลัส จะติดต่อกลับตามช่องทางที่คุณเลือก
        </p>
      ) : null}
    </form>
  );
}
