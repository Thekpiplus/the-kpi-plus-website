"use client";

import { useEffect, useState, useTransition } from "react";
import { togglePageOnline } from "@/lib/cms/actions";

export function CmsPageOnlineToggle({
  pageId,
  route,
  slug,
  kind = "page",
  online,
  pageName,
}: {
  pageId?: string;
  route: string;
  slug?: string;
  kind?: "page" | "insight";
  online: boolean;
  pageName: string;
}) {
  const [id, setId] = useState(pageId);
  const [isOnline, setIsOnline] = useState(online);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setId(pageId);
  }, [pageId]);

  useEffect(() => {
    setIsOnline(online);
  }, [online]);

  function onToggle() {
    const nextOnline = !isOnline;
    setIsOnline(nextOnline);
    const formData = new FormData();
    formData.set("kind", kind);
    if (id) formData.set("id", id);
    formData.set("route", route);
    if (slug) formData.set("slug", slug);
    formData.set("online", nextOnline ? "1" : "0");
    startTransition(async () => {
      try {
        const result = await togglePageOnline(formData);
        if (result?.id) setId(result.id);
        if (typeof result?.online === "boolean") setIsOnline(result.online);
      } catch {
        setIsOnline(!nextOnline);
      }
    });
  }

  return (
    <div className="crm-cms-online-toggle">
      <button
        type="button"
        className={`crm-cms-switch ${isOnline ? "is-on" : "is-off"} ${pending ? "is-pending" : ""}`}
        title={isOnline ? "ปิด (ออฟไลน์)" : "เปิด (ออนไลน์)"}
        aria-label={`${pageName}: ${isOnline ? "ออนไลน์" : "ออฟไลน์"} — กดเพื่อสลับ`}
        aria-pressed={isOnline}
        disabled={pending}
        onClick={onToggle}
      >
        <span className="crm-cms-switch-track" aria-hidden="true">
          <span className="crm-cms-switch-thumb" />
        </span>
        <span className="crm-cms-switch-label">{pending ? "…" : isOnline ? "ออนไลน์" : "ออฟไลน์"}</span>
      </button>
    </div>
  );
}
