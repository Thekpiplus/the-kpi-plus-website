"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import { CrmSubNavIcon, resolveSubNavIcon, type CrmSubNavIconName } from "@/components/crm/CrmSubNavIcons";

export type CrmSubNavItem = {
  href: string;
  label: string;
  icon?: CrmSubNavIconName;
  children?: CrmSubNavItem[];
};

function searchParam(search: string, key: string) {
  const currentQuery = search.startsWith("?") ? search.slice(1) : search;
  return new URLSearchParams(currentQuery).get(key);
}

export function isCrmSubNavCurrent(pathname: string, search: string, href: string) {
  const [path, query] = href.split("?");
  const currentQuery = search.startsWith("?") ? search.slice(1) : search;
  if (path === "/crm/leads") {
    if (pathname !== "/crm/leads") return false;
    const hrefOrigin = query ? new URLSearchParams(query).get("origin") : null;
    const currentOrigin = searchParam(search, "origin");
    if (hrefOrigin === "web" || hrefOrigin === "manual") {
      return currentOrigin === hrefOrigin;
    }
    return !currentOrigin;
  }
  if (query) return pathname === path && currentQuery === query;
  if (path === "/crm/sales") return pathname === "/crm/sales";
  if (path === "/crm/users/new") return pathname === "/crm/users/new";
  if (path === "/crm/users/logs") return pathname === "/crm/users/logs" || pathname.startsWith("/crm/users/logs/");
  if (path === "/crm/users/roles") return pathname === "/crm/users/roles" || pathname.startsWith("/crm/users/roles/");
  if (path === "/crm/users") return pathname === "/crm/users";
  if (path === "/crm/cms") return pathname === "/crm/cms";
  if (path === "/crm/cms/pages") {
    return pathname === "/crm/cms/pages" || pathname.startsWith("/crm/cms/pages/");
  }
  if (path === "/crm/cms/menus") return pathname === "/crm/cms/menus" || pathname.startsWith("/crm/cms/menus/");
  if (path === "/crm/cms/seo") return pathname === "/crm/cms/seo" || pathname.startsWith("/crm/cms/seo/");
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

function iconNameFor(item: CrmSubNavItem): CrmSubNavIconName {
  return item.icon ?? resolveSubNavIcon(item.href, item.label);
}

function SubNavLink({
  href,
  label,
  icon,
  current,
  nested = false,
}: {
  href: string;
  label: string;
  icon: CrmSubNavIconName;
  current: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`crm-subnav-link${nested ? " is-nested" : ""}${current ? " is-current" : ""}`}
      aria-current={current ? "page" : undefined}
      title={label}
    >
      <span className="crm-subnav-link-icon" aria-hidden="true">
        <CrmSubNavIcon name={icon} />
      </span>
      <span className="crm-subnav-link-text">{label}</span>
    </Link>
  );
}

export function CrmSubNav({
  moduleLabel,
  items,
  pathname,
  search,
  showModuleLabel = true,
}: {
  moduleLabel: string;
  items: CrmSubNavItem[];
  pathname: string;
  search: string;
  /** When false, hides the “โมดูล / …” context line above the links. */
  showModuleLabel?: boolean;
}) {
  const baseId = useId();
  const [openHref, setOpenHref] = useState<string | null>(null);

  const activeGroupHref = useMemo(() => {
    for (const item of items) {
      if (!item.children?.length) continue;
      if (groupHasCurrent(pathname, search, item)) return item.href;
    }
    return null;
  }, [items, pathname, search]);

  useEffect(() => {
    if (activeGroupHref) setOpenHref(activeGroupHref);
  }, [activeGroupHref]);

  const openGroup = items.find((item) => item.href === openHref && item.children?.length) ?? null;
  const openChildren = openGroup?.children ?? [];
  const childrenId = openGroup ? `${baseId}-${openGroup.href.replace(/[^a-z0-9]+/gi, "-")}` : undefined;

  return (
    <div className={`crm-app-sub${showModuleLabel ? "" : " is-links-only"}`.trim()}>
      {showModuleLabel ? (
        <div className="crm-app-sub-context">
          <p className="crm-app-sub-kicker">เมนูย่อย</p>
          <p className="crm-app-sub-title">{moduleLabel}</p>
        </div>
      ) : null}
      <nav className="crm-app-sub-nav" aria-label={`เมนูย่อยของ ${moduleLabel}`}>
        <div className="crm-app-sub-links" role="list">
          {items.map((item) => {
            const children = item.children;
            const icon = iconNameFor(item);
            if (!children?.length) {
              return (
                <span key={item.href} className="crm-subnav-item" role="listitem">
                  <SubNavLink
                    href={item.href}
                    label={item.label}
                    icon={icon}
                    current={isCrmSubNavCurrent(pathname, search, item.href)}
                  />
                </span>
              );
            }

            const groupOpen = openHref === item.href;
            const parentCurrent = isCrmSubNavCurrent(pathname, search, item.href);
            const childCurrent = children.some((child) => isCrmSubNavCurrent(pathname, search, child.href));

            return (
              <span
                key={item.href}
                className={`crm-subnav-group${groupOpen ? " is-open" : ""}${childCurrent ? " has-current" : ""}`}
                role="listitem"
              >
                <SubNavLink href={item.href} label={item.label} icon={icon} current={parentCurrent && !childCurrent} />
                <button
                  type="button"
                  className={`crm-subnav-toggle${groupOpen ? " is-open" : ""}`}
                  aria-expanded={groupOpen}
                  aria-controls={childrenId}
                  aria-label={`${groupOpen ? "ย่อ" : "ขยาย"} ${item.label}`}
                  onClick={() => setOpenHref((prev) => (prev === item.href ? null : item.href))}
                >
                  <span className="crm-subnav-toggle-count">{children.length}</span>
                  <span className={`crm-subnav-toggle-chevron${groupOpen ? " is-open" : ""}`} aria-hidden="true">
                    <CrmSubNavIcon name="chevron" />
                  </span>
                </button>
              </span>
            );
          })}
        </div>

        {openGroup && openChildren.length ? (
          <div className="crm-app-sub-children-panel" id={childrenId}>
            <p className="crm-app-sub-children-label">{openGroup.label}</p>
            <div className="crm-app-sub-children-links" role="list">
              {openChildren.map((child) => (
                <span key={child.href} className="crm-subnav-item" role="listitem">
                  <SubNavLink
                    href={child.href}
                    label={child.label}
                    icon={iconNameFor(child)}
                    current={isCrmSubNavCurrent(pathname, search, child.href)}
                    nested
                  />
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </nav>
    </div>
  );
}
