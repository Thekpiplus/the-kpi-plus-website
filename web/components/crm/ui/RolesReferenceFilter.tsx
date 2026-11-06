"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RoleBadge } from "@/components/crm/ui/RoleBadge";

export type RoleReferenceItem = {
  role: string;
  blurb: string;
  access: string;
  count: number;
  fullAccess: boolean;
  system: boolean;
  searchText: string;
};

export function RolesReferenceFilter({ items }: { items: RoleReferenceItem[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();

  const visible = useMemo(() => {
    if (!normalized) return items;
    return items.filter((item) => item.searchText.includes(normalized));
  }, [items, normalized]);

  return (
    <div className="crm-roles-ref">
      <label className="crm-roles-ref-search">
        <span className="sr-only">ค้นหาบทบาท</span>
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหาบทบาท หรือคำอธิบาย"
          autoComplete="off"
        />
      </label>
      {normalized ? (
        <p className="crm-roles-ref-hint" role="status">
          พบ {visible.length} จาก {items.length} บทบาท
        </p>
      ) : null}
      {visible.length ? (
        <div className="crm-users-role-grid" aria-label="บทบาทในระบบ">
          {visible.map((item) => (
            <article
              key={item.role}
              className={`crm-users-role-card is-role-${item.role}${item.fullAccess ? " is-full" : ""}`}
            >
              <div className="crm-users-role-card-top">
                <RoleBadge role={item.role} />
                <p className="crm-users-role-count">
                  <strong>{item.count}</strong>
                  <span>บัญชี</span>
                </p>
              </div>
              <div className="crm-users-role-tags">
                {item.system ? <span className="crm-users-role-tag">System role</span> : null}
                {item.fullAccess ? <span className="crm-users-role-tag is-lime">Full module access</span> : null}
              </div>
              <h3>{item.blurb}</h3>
              <p>{item.access}</p>
              <Link href={`/crm/users?role=${encodeURIComponent(item.role)}`} className="crm-users-secondary">
                ดูผู้ใช้บทบาทนี้
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="crm-roles-ref-empty" role="status">
          ไม่พบบทบาทที่ตรงกับการค้นหา
        </p>
      )}
    </div>
  );
}
