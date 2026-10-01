"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/faqs";

const homeMarks = ["Occupancy", "ข้อมูลอะไร", "มีค่าใช้จ่ายหรือไม่", "จะได้รับอะไร", "ภายในกี่วัน"] as const;

function emphasizeQuestion(question: string) {
  const mark = homeMarks.find((phrase) => question.includes(phrase));
  if (!mark) return question;
  const [before, after] = question.split(mark);
  const latin = !/[\u0E00-\u0E7F]/.test(mark);
  return (
    <>
      {before}
      <span className={`kpi-faq-em${latin ? " kpi-latin" : ""}`}>{mark}</span>
      {after}
    </>
  );
}

export function HomeFaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="kpi-faq-list">
      {items.map((item, index) => {
        const panelId = `home-faq-${index}`;
        const buttonId = `${panelId}-button`;
        const expanded = open === index;
        return (
          <div key={item.q} className={`kpi-faq-item${expanded ? " is-open" : ""}`}>
            <button
              id={buttonId}
              type="button"
              className="kpi-faq-trigger"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setOpen(expanded ? null : index)}
            >
              <span className="kpi-faq-q">{emphasizeQuestion(item.q)}</span>
              <span className="kpi-faq-mark" aria-hidden="true">
                <span className="kpi-faq-plus">+</span>
                <span className="kpi-faq-minus">−</span>
              </span>
            </button>
            <div id={panelId} role="region" aria-labelledby={buttonId} className="kpi-faq-panel" aria-hidden={!expanded}>
              <div className="kpi-faq-panel-inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
