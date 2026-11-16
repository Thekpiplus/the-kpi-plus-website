"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useRouter } from "next/navigation";

export type CommandPaletteItem = {
  id: string;
  label: string;
  blurb: string;
  href: string;
  code?: string;
};

export function CrmCommandPalette({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: CommandPaletteItem[];
}) {
  const router = useRouter();
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const hay = `${item.label} ${item.blurb} ${item.code ?? ""} ${item.href}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function onInputKey(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = filtered[active];
      if (item) go(item.href);
    }
  }

  return (
    <div className="crm-cmd-root" role="presentation">
      <button type="button" className="crm-cmd-backdrop" aria-label="ปิดค้นหา" onClick={onClose} />
      <div
        ref={dialogRef}
        className="crm-cmd-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="sr-only">
          ค้นหาเมนูหรือคำสั่ง
        </h2>
        <label className="crm-cmd-input-wrap">
          <span aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            type="search"
            className="crm-cmd-input"
            placeholder="ค้นหาข้อมูล เมนู หรือคำสั่ง…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKey}
            aria-autocomplete="list"
            aria-controls="crm-cmd-list"
            autoComplete="off"
          />
          <kbd aria-hidden="true">Esc</kbd>
        </label>
        <ul id="crm-cmd-list" className="crm-cmd-list" role="listbox" aria-label="ผลการค้นหา">
          {filtered.length === 0 ? (
            <li className="crm-cmd-empty" role="option" aria-selected="false">
              ไม่พบเมนูที่ตรงกับ “{query.trim()}”
            </li>
          ) : (
            filtered.map((item, index) => (
              <li key={item.id} role="option" aria-selected={index === active}>
                <button
                  type="button"
                  className={`crm-cmd-item${index === active ? " is-active" : ""}`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(item.href)}
                >
                  <span className="crm-cmd-item-dot" aria-hidden="true" />
                  <span className="crm-cmd-item-copy">
                    <strong>
                      {item.label}
                      {item.code ? <em>{item.code}</em> : null}
                    </strong>
                    <span>{item.blurb}</span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
