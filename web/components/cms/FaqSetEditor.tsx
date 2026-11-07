"use client";

import { useState } from "react";
import { resetFaqsToCode, saveFaqs } from "@/lib/cms/faq-actions";
import type { FaqItem } from "@/lib/faqs";

export function FaqSetEditor({
  route,
  initialItems,
  source,
}: {
  route: string;
  initialItems: FaqItem[];
  source: "cms" | "code" | "empty";
}) {
  const [items, setItems] = useState<FaqItem[]>(
    initialItems.length ? initialItems : [{ q: "", a: "" }],
  );

  function patch(index: number, patch: Partial<FaqItem>) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function move(index: number, delta: number) {
    setItems((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      const [row] = next.splice(index, 1);
      next.splice(target, 0, row);
      return next;
    });
  }

  return (
    <form action={saveFaqs} className="crm-cms-faq-editor">
      <input type="hidden" name="route" value={route} />

      <div className="crm-cms-faq-toolbar">
        <p className="crm-cms-faq-source" role="status">
          {source === "cms"
            ? "กำลังใช้ FAQ จาก CMS"
            : source === "code"
              ? "ยังไม่บันทึกใน CMS — แสดงค่าเริ่มต้นจากโค้ด (บันทึกเพื่อให้แก้จากแอดมิน)"
              : "ยังไม่มี FAQ"}
        </p>
        <div className="crm-cms-faq-toolbar-actions">
          <button
            type="button"
            className="crm-users-secondary"
            onClick={() => setItems((current) => [...current, { q: "", a: "" }])}
          >
            เพิ่มคำถาม
          </button>
          {source === "cms" ? (
            <button
              type="submit"
              className="crm-users-secondary"
              formAction={resetFaqsToCode}
              formNoValidate
            >
              กลับไปใช้ค่าจากโค้ด
            </button>
          ) : null}
          <button className="kpi-button crm-users-primary" type="submit">
            บันทึก FAQ
          </button>
        </div>
      </div>

      <ol className="crm-cms-faq-list">
        {items.map((item, index) => (
          <li key={`faq-${index}`} className="crm-cms-faq-item">
            <div className="crm-cms-faq-item-head">
              <strong>ข้อ {index + 1}</strong>
              <div className="crm-cms-faq-item-actions">
                <button type="button" className="crm-users-secondary" disabled={index === 0} onClick={() => move(index, -1)}>
                  ขึ้น
                </button>
                <button
                  type="button"
                  className="crm-users-secondary"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                >
                  ลง
                </button>
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
            </div>
            <label className="crm-cms-field">
              <span>คำถาม</span>
              <input
                className="crm-field"
                name="q"
                value={item.q}
                onChange={(event) => patch(index, { q: event.target.value })}
                placeholder="คำถามที่พบบ่อย"
              />
            </label>
            <label className="crm-cms-field">
              <span>คำตอบ</span>
              <textarea
                className="crm-area"
                name="a"
                rows={4}
                value={item.a}
                onChange={(event) => patch(index, { a: event.target.value })}
                placeholder="คำตอบ"
              />
            </label>
          </li>
        ))}
      </ol>
    </form>
  );
}
