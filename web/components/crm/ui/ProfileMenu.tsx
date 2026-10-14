"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { logoutAction } from "@/lib/crm/actions";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "KP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function ProfileMenu({
  userName,
  userRole,
  showLogout,
}: {
  userName: string;
  userRole: string;
  showLogout: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="crm-profile-menu" ref={rootRef}>
      <button
        type="button"
        className="crm-app-user crm-profile-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="crm-app-avatar" aria-hidden="true">
          {initials(userName)}
        </span>
        <span className="crm-app-user-meta">
          <strong>{userName || "ทีม KPI Plus"}</strong>
          <em>{userRole}</em>
        </span>
      </button>
      {open ? (
        <div className="crm-profile-dropdown" id={menuId} role="menu">
          <div className="crm-profile-dropdown-head">
            <strong>{userName || "ทีม KPI Plus"}</strong>
            <em>{userRole}</em>
          </div>
          <Link href="/crm/settings" role="menuitem" onClick={() => setOpen(false)}>
            ตั้งค่า
          </Link>
          {showLogout ? (
            <form action={logoutAction}>
              <button type="submit" role="menuitem">
                ออกจากระบบ
              </button>
            </form>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
