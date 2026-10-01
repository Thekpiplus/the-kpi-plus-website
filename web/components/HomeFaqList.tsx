"use client";

import { useState, type ReactNode } from "react";
import type { FaqItem } from "@/lib/faqs";

const homeMarks = [
  "Commercial Management",
  "Revenue Management",
  "Revenue Manager",
  "RMS",
  "ดูแลทุกส่วนไหม",
  "ร่วมทำอะไร",
  "Occupancy",
  "ข้อมูลอะไร",
  "มีค่าใช้จ่ายหรือไม่",
  "จะได้รับอะไร",
  "ภายในกี่วัน",
] as const;

function emphasizeQuestion(question: string) {
  const marks = [...homeMarks].sort((a, b) => b.length - a.length);
  const used = Array.from({ length: question.length }, () => false);
  const ranges: { start: number; end: number; text: string }[] = [];

  for (const mark of marks) {
    let from = 0;
    while (from < question.length) {
      const start = question.indexOf(mark, from);
      if (start < 0) break;
      const end = start + mark.length;
      if (!used.slice(start, end).some(Boolean)) {
        ranges.push({ start, end, text: mark });
        for (let index = start; index < end; index += 1) used[index] = true;
      }
      from = end;
    }
  }

  if (!ranges.length) return question;
  ranges.sort((a, b) => a.start - b.start);

  const nodes: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((range, index) => {
    if (cursor < range.start) nodes.push(question.slice(cursor, range.start));
    const latin = !/[\u0E00-\u0E7F]/.test(range.text);
    nodes.push(
      <span key={`${range.start}-${index}`} className={`kpi-faq-em${latin ? " kpi-latin" : ""}`}>
        {range.text}
      </span>,
    );
    cursor = range.end;
  });
  if (cursor < question.length) nodes.push(question.slice(cursor));
  return <>{nodes}</>;
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
