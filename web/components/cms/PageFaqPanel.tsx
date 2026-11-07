"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveFaqsInline } from "@/lib/cms/faq-actions";
import type { FaqItem } from "@/lib/faqs";

/** Inline FAQ editor for a single page route — save without leaving the page editor. */
export function PageFaqPanel({
  route,
  initialItems,
  source,
}: {
  route: string;
  initialItems: FaqItem[];
  source: "cms" | "code" | "empty";
}) {
  const router = useRouter();
  const [items, setItems] = useState<FaqItem[]>(initialItems.length ? initialItems : [{ q: "", a: "" }]);
  const [pending, startTransition] = useTransition();
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");

  function patch(index: number, next: Partial<FaqItem>) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...next } : item)));
  }

  function save() {
    setOk("");
    setError("");
    const formData = new FormData();
    formData.set("route", route);
    for (const item of items) {
      formData.append("q", item.q);
      formData.append("a", item.a);
    }
    startTransition(async () => {
      const result = await saveFaqsInline(formData);
      if (!result.ok) {
        setError("บันทึก FAQ ไม่สำเร็จ");
        return;
      }
      setOk("บันทึก FAQ แล้ว");
      router.refresh();
    });
  }

  return (
    <section className="crm-cms-page-faq-panel" aria-labelledby="crm-cms-page-faq-heading">
      <div className="crm-cms-faq-toolbar">
        <div>
          <h3 id="crm-cms-page-faq-heading">FAQ ของหน้านี้</h3>
          <p className="crm-cms-faq-source">
            {route} ·{" "}
            {source === "cms" ? "ใช้ค่าจาก CMS" : source === "code" ? "ค่าเริ่มต้นจากโค้ด" : "ยังว่าง"}
          </p>
        </div>
        <div className="crm-cms-faq-toolbar-actions">
          <button
            type="button"
            className="crm-users-secondary"
            onClick={() => setItems((current) => [...current, { q: "", a: "" }])}
          >
            เพิ่มคำถาม
          </button>
          <button type="button" className="kpi-button crm-users-primary" disabled={pending} onClick={save}>
            {pending ? "กำลังบันทึก…" : "บันทึก FAQ"}
          </button>
        </div>
      </div>

      {ok ? (
        <p className="crm-users-alert is-ok" role="status">
          {ok}
        </p>
      ) : null}
      {error ? (
        <p className="crm-users-alert is-warn" role="alert">
          {error}
        </p>
      ) : null}

      <ol className="crm-cms-faq-list">
        {items.map((item, index) => (
          <li key={`page-faq-${index}`} className="crm-cms-faq-item">
            <div className="crm-cms-faq-item-head">
              <strong>ข้อ {index + 1}</strong>
              <button
                type="button"
                className="crm-users-secondary"
                onClick={() =>
                  setItems((current) =>
                    current.length <= 1 ? [{ q: "", a: "" }] : current.filter((_, i) => i !== index),
                  )
                }
              >
                ลบ
              </button>
            </div>
            <label className="crm-cms-field">
              <span>คำถาม</span>
              <input className="crm-field" value={item.q} onChange={(event) => patch(index, { q: event.target.value })} />
            </label>
            <label className="crm-cms-field">
              <span>คำตอบ</span>
              <textarea
                className="crm-area"
                rows={3}
                value={item.a}
                onChange={(event) => patch(index, { a: event.target.value })}
              />
            </label>
          </li>
        ))}
      </ol>
    </section>
  );
}
