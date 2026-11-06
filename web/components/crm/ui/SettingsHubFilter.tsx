"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type SettingsHubItem = {
  href: string;
  title: string;
  body: string;
  meta?: string;
  searchText: string;
};

export function SettingsHubFilter({
  items,
  placeholder = "ค้นหาหมวดหรือหน้าตั้งค่า",
}: {
  items: SettingsHubItem[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const visible = useMemo(() => {
    if (!normalized) return items;
    return items.filter((item) => item.searchText.includes(normalized));
  }, [items, normalized]);

  return (
    <div className="crm-settings-hub">
      <label className="crm-settings-search">
        <span className="sr-only">ค้นหาหมวดตั้งค่า</span>
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
      </label>
      {normalized ? (
        <p className="crm-settings-search-hint" role="status">
          พบ {visible.length} รายการจาก “{query.trim()}”
        </p>
      ) : null}
      {visible.length ? (
        <div className="crm-settings-hub-grid">
          {visible.map((item) => {
            const className = "crm-settings-link";
            const body = (
              <>
                <span className="crm-settings-link-title">{item.title}</span>
                <span className="crm-settings-link-body">{item.body}</span>
                {item.meta ? <span className="crm-settings-link-meta">{item.meta}</span> : null}
              </>
            );
            if (item.href.startsWith("#")) {
              return (
                <a key={item.href} href={item.href} className={className}>
                  {body}
                </a>
              );
            }
            return (
              <Link key={item.href} href={item.href} className={className}>
                {body}
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="crm-settings-empty" role="status">
          ไม่พบหมวดที่ตรงกับการค้นหา
        </p>
      )}
    </div>
  );
}
