"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

export type CrmSubNavItem = {
  href: string;
  label: string;
  children?: CrmSubNavItem[];
};

export function isCrmSubNavCurrent(pathname: string, search: string, href: string) {
  const [path, query] = href.split("?");
  const currentQuery = search.startsWith("?") ? search.slice(1) : search;
  if (query) return pathname === path && currentQuery === query;
  if (path === "/crm/sales") return pathname === "/crm/sales";
  if (path === "/crm/leads") return pathname === "/crm/leads" && !currentQuery;
  if (path === "/crm/users/new") return pathname === "/crm/users/new";
  if (path === "/crm/users") return pathname === "/crm/users";
  if (path === "/crm/cms") return pathname === "/crm/cms";
  if (path === "/crm/partners") return pathname === "/crm/partners";
  if (path === "/crm/b2b") return pathname === "/crm/b2b";
  if (path === "/crm/ads") return pathname === "/crm/ads";
  if (path === "/crm/meta") return pathname === "/crm/meta";
  if (path === "/crm/seo") return pathname === "/crm/seo";
  if (path === "/crm/website") return pathname === "/crm/website";
  if (path === "/crm/conversion") return pathname === "/crm/conversion";
  if (path === "/crm/management") return pathname === "/crm/management";
  if (path === "/crm/systems") return pathname === "/crm/systems";
  if (path === "/crm/hotel-ai") return pathname === "/crm/hotel-ai";
  if (path === "/crm/training") return pathname === "/crm/training";
  if (path === "/crm/training/departments") return pathname === "/crm/training/departments";
  if (path === "/crm/hotel-marketing") return pathname === "/crm/hotel-marketing";
  if (path === "/crm/hotel-marketing/departments") return pathname === "/crm/hotel-marketing/departments";
  if (path === "/crm/hotel-ai/departments") return pathname === "/crm/hotel-ai/departments";
  if (path === "/crm/solutions") return pathname === "/crm/solutions";
  if (path === "/crm/solutions/departments") return pathname === "/crm/solutions/departments";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function groupHasCurrent(pathname: string, search: string, item: CrmSubNavItem) {
  if (isCrmSubNavCurrent(pathname, search, item.href)) return true;
  return Boolean(item.children?.some((child) => isCrmSubNavCurrent(pathname, search, child.href)));
}

function SubNavLink({
  href,
  label,
  current,
  nested = false,
}: {
  href: string;
  label: string;
  current: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      className={nested ? "crm-subnav-link is-nested" : "crm-subnav-link"}
      aria-current={current ? "page" : undefined}
      title={label}
    >
      <span className="crm-subnav-link-text">{label}</span>
    </Link>
  );
}

export function CrmSubNav({
  moduleLabel,
  items,
  pathname,
  search,
}: {
  moduleLabel: string;
  items: CrmSubNavItem[];
  pathname: string;
  search: string;
}) {
  const baseId = useId();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const next: Record<string, boolean> = {};
    for (const item of items) {
      if (!item.children?.length) continue;
      if (groupHasCurrent(pathname, search, item)) next[item.href] = true;
    }
    if (Object.keys(next).length) {
      setOpenGroups((prev) => ({ ...prev, ...next }));
    }
  }, [items, pathname, search]);

  return (
    <div className="crm-app-sub">
      <div className="crm-app-sub-context">
        <p className="crm-app-sub-kicker">โมดูล</p>
        <p className="crm-app-sub-title">{moduleLabel}</p>
      </div>
      <nav className="crm-app-sub-nav" aria-label={`เมนูย่อยของ ${moduleLabel}`}>
        <div className="crm-app-sub-links" role="list">
          {items.map((item) => {
            const children = item.children;
            if (!children?.length) {
              return (
                <span key={item.href} className="crm-subnav-item" role="listitem">
                  <SubNavLink
                    href={item.href}
                    label={item.label}
                    current={isCrmSubNavCurrent(pathname, search, item.href)}
                  />
                </span>
              );
            }

            const groupOpen =
              openGroups[item.href] ??
              (pathname === item.href || pathname.startsWith(`${item.href}/`));
            const childrenId = `${baseId}-${item.href.replace(/[^a-z0-9]+/gi, "-")}`;
            const parentCurrent = isCrmSubNavCurrent(pathname, search, item.href);
            const childCurrent = children.some((child) => isCrmSubNavCurrent(pathname, search, child.href));

            return (
              <span
                key={item.href}
                className={`crm-subnav-group${groupOpen ? " is-open" : ""}${childCurrent ? " has-current" : ""}`}
                role="listitem"
              >
                <SubNavLink href={item.href} label={item.label} current={parentCurrent && !childCurrent} />
                <button
                  type="button"
                  className="crm-subnav-toggle"
                  aria-expanded={groupOpen}
                  aria-controls={childrenId}
                  aria-label={`${groupOpen ? "ย่อ" : "ขยาย"} ${item.label}`}
                  onClick={() => setOpenGroups((prev) => ({ ...prev, [item.href]: !groupOpen }))}
                >
                  <span aria-hidden="true">{groupOpen ? "▾" : "▸"}</span>
                  <span className="crm-subnav-toggle-count">{children.length}</span>
                </button>
                {groupOpen ? (
                  <span id={childrenId} className="crm-subnav-children" role="list">
                    {children.map((child) => (
                      <span key={child.href} className="crm-subnav-item" role="listitem">
                        <SubNavLink
                          href={child.href}
                          label={child.label}
                          current={isCrmSubNavCurrent(pathname, search, child.href)}
                          nested
                        />
                      </span>
                    ))}
                  </span>
                ) : null}
              </span>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
