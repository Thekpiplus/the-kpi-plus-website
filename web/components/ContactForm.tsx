"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import { FormPrivacyNotice } from "@/components/FormPrivacyNotice";
import type { Locale } from "@/lib/seo";

const topics = [
  "Revenue Management",
  "Reservation / Direct Booking",
  "B2B & Distribution",
  "Google Ads",
  "Meta Ads",
  "SEO / Local Search",
  "Website",
  "Technology / AI",
  "Training",
  "Not sure yet",
];

const labels = {
  th: {
    name: "ชื่อ *",
    hotel: "โรงแรม / ธุรกิจ *",
    email: "อีเมล *",
    phone: "เบอร์โทรศัพท์ *",
    rooms: "จำนวนห้องพัก",
    topic: "เรื่องที่อยากให้ช่วย *",
    message: "ข้อความ *",
    submit: "ขอรับการวิเคราะห์โรงแรม",
    note: "ทีม เดอะ เคพีไอ พลัส จะติดต่อกลับตามข้อมูลที่ส่งมา",
    done: "รับข้อมูลแล้ว",
  },
  en: {
    name: "Name *",
    hotel: "Hotel / Business *",
    email: "Email *",
    phone: "Phone *",
    rooms: "Number of rooms",
    topic: "What would you like help with? *",
    message: "Message *",
    submit: "Request a Hotel Performance Audit",
    note: "The KPI Plus team will follow up using the details you send.",
    done: "Details received",
  },
  ru: {
    name: "Имя *",
    hotel: "Отель / компания *",
    email: "Email *",
    phone: "Телефон *",
    rooms: "Количество номеров",
    topic: "Чем помочь? *",
    message: "Сообщение *",
    submit: "Запросить аудит",
    note: "Команда The KPI Plus свяжется с вами по указанным данным.",
    done: "Данные получены",
  },
  zh: {
    name: "姓名 *",
    hotel: "酒店 / 公司 *",
    email: "電子郵件 *",
    phone: "電話 *",
    rooms: "客房數",
    topic: "需要協助的主題 *",
    message: "訊息 *",
    submit: "申請酒店績效評估",
    note: "The KPI Plus 團隊會依您提供的資料回覆。",
    done: "已收到資料",
  },
};

export function ContactForm({ locale }: { locale: Locale }) {
  const t = labels[locale] ?? labels.en;
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  return (
    <form
      className="kpi-card grid gap-4 p-6 sm:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(false);
        const form = event.currentTarget;
        const data = new FormData(form);
        const response = await fetch("/api/contact-enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            hotel: data.get("hotel"),
            email: data.get("email"),
            phone: data.get("phone"),
            rooms: data.get("rooms"),
            topic: data.get("topic"),
            message: data.get("message"),
            honeypot: data.get("companyWebsite"),
            pageUrl: window.location.href,
            locale,
          }),
        });
        if (!response.ok) {
          setError(true);
          return;
        }
        track("generate_lead", { form: "contact_enquiry", locale });
        setSubmitted(true);
      }}
    >
      <input name="companyWebsite" tabIndex={-1} autoComplete="off" className="hidden" />
      <label className="kpi-label">
        {t.name}
        <input name="name" required className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        {t.hotel}
        <input name="hotel" required className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        {t.email}
        <input name="email" type="email" required className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        {t.phone}
        <input name="phone" required className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        {t.rooms}
        <input name="rooms" className="kpi-field mt-1" />
      </label>
      <label className="kpi-label">
        {t.topic}
        <select name="topic" required className="kpi-field mt-1">
          {topics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
      </label>
      <label className="kpi-label">
        {t.message}
        <textarea name="message" required className="kpi-field mt-1 min-h-28" />
      </label>
      <FormPrivacyNotice locale={locale} />
      <button type="submit" className="kpi-button mt-2">
        {t.submit}
      </button>
      {error ? <p className="text-sm font-semibold text-[#0B1F33]">ส่งไม่สำเร็จ ลองอีกครั้ง</p> : null}
      {submitted ? <p className="text-sm font-semibold text-[#0B6660]">{t.done}. {t.note}</p> : null}
    </form>
  );
}
