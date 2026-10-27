"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { FaqItem } from "@/lib/faqs";

export function HomeFaqList({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const focusItem = (index: number) => {
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(".kpi-faq-trigger");
    buttons?.[index]?.focus({
      preventScroll: false,
      focusVisible: true,
    } as FocusOptions & { focusVisible: boolean });
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(index === last ? 0 : index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(index === 0 ? last : index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(last);
    }
  };

  return (
    <div className="kpi-faq-list" ref={listRef}>
      {items.map((item, index) => {
        const panelId = `${uid}-panel-${index}`;
        const buttonId = `${uid}-button-${index}`;
        const expanded = open === index;
        return (
          <div key={`${item.q}-${index}`} className={`kpi-faq-item${expanded ? " is-open" : ""}`}>
            <h3 className="kpi-faq-heading">
              <button
                id={buttonId}
                type="button"
                className="kpi-faq-trigger"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
                onKeyDown={(event) => onTriggerKeyDown(event, index)}
              >
                <span className="kpi-faq-q">{item.q}</span>
                <span className="kpi-faq-mark" aria-hidden="true">
                  {expanded ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={expanded ? undefined : true}
              inert={expanded ? undefined : true}
              className="kpi-faq-panel"
            >
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
