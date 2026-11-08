"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { moveInsightOrder, togglePageOnline } from "@/lib/cms/actions";
import { CmsPageRowActions } from "@/components/crm/ui/CmsPageRowActions";
import { SiteInsightDeleteButton } from "@/components/crm/ui/SiteInsightDeleteButton";

export type InsightTableRow =
  | {
      key: string;
      kind: "cms";
      slug: string;
      title: string;
      path: string;
      metaTag: string;
      description: string;
      online: boolean;
      id: string;
    }
  | {
      key: string;
      kind: "site";
      slug: string;
      title: string;
      path: string;
      metaTag: string;
      description: string;
      online: boolean;
      id?: string;
    };

function truncate(value: string, max = 120) {
  const text = value.trim();
  if (!text) return "—";
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function OnlineToggle({
  pageId,
  route,
  slug,
  online,
  pageName,
  onChanged,
}: {
  pageId?: string;
  route: string;
  slug: string;
  online: boolean;
  pageName: string;
  onChanged: (next: { online: boolean; id?: string }) => void;
}) {
  const [pending, startTransition] = useTransition();

  function onToggle() {
    const nextOnline = !online;
    onChanged({ online: nextOnline, id: pageId });
    const formData = new FormData();
    formData.set("kind", "insight");
    if (pageId) formData.set("id", pageId);
    formData.set("route", route);
    formData.set("slug", slug);
    formData.set("online", nextOnline ? "1" : "0");
    startTransition(async () => {
      try {
        const result = await togglePageOnline(formData);
        if (result?.id && result.id !== pageId) onChanged({ online: result.online, id: result.id });
      } catch {
        onChanged({ online, id: pageId });
      }
    });
  }

  return (
    <div className="crm-cms-online-toggle">
      <button
        type="button"
        className={`crm-cms-switch ${online ? "is-on" : "is-off"} ${pending ? "is-pending" : ""}`}
        title={online ? "ปิด (ออฟไลน์)" : "เปิด (ออนไลน์)"}
        aria-label={`${pageName}: ${online ? "ออนไลน์" : "ออฟไลน์"} — กดเพื่อสลับ`}
        aria-pressed={online}
        disabled={pending}
        onClick={onToggle}
      >
        <span className="crm-cms-switch-track" aria-hidden="true">
          <span className="crm-cms-switch-thumb" />
        </span>
        <span className="crm-cms-switch-label">{pending ? "…" : online ? "ออนไลน์" : "ออฟไลน์"}</span>
      </button>
    </div>
  );
}

export function InsightsTable({ rows: initialRows, orderDisabled = false }: { rows: InsightTableRow[]; orderDisabled?: boolean }) {
  const [rows, setRows] = useState(initialRows);
  const rowsRef = useRef(initialRows);
  const saveQueue = useRef(Promise.resolve());
  const [dragSlug, setDragSlug] = useState("");
  const [dropSlug, setDropSlug] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRows(initialRows);
    rowsRef.current = initialRows;
  }, [initialRows]);

  function persistOrder(next: InsightTableRow[]) {
    const previous = rowsRef.current;
    rowsRef.current = next;
    setRows(next);
    setSaving(true);
    const formData = new FormData();
    formData.set("order", JSON.stringify(next.map((row) => row.slug)));
    saveQueue.current = saveQueue.current
      .then(() => moveInsightOrder(formData))
      .catch(() => {
        rowsRef.current = previous;
        setRows(previous);
      })
      .finally(() => setSaving(false));
  }

  function applyDrop(targetSlug: string) {
    if (orderDisabled || !dragSlug || dragSlug === targetSlug) return;
    const current = rowsRef.current;
    const from = current.findIndex((row) => row.slug === dragSlug);
    const to = current.findIndex((row) => row.slug === targetSlug);
    if (from < 0 || to < 0) return;
    const next = [...current];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    persistOrder(next);
  }

  return (
    <div className="crm-cms-table-wrap">
      <table className="crm-cms-table crm-cms-table--insights">
        <thead>
          <tr>
            <th scope="col">ลำดับ</th>
            <th scope="col">ชื่อบทความ</th>
            <th scope="col">Slug</th>
            <th scope="col">Meta Tag</th>
            <th scope="col">Description</th>
            <th scope="col">สถานะ</th>
            <th scope="col">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const position = index + 1;
            const editHref = row.kind === "cms" ? `/crm/cms/insights/${row.id}` : `/crm/cms/insights/from/${row.slug}`;
            const isDragging = dragSlug === row.slug;
            const isDropTarget = dropSlug === row.slug && dragSlug && dragSlug !== row.slug;
            return (
              <tr
                key={row.key}
                className={[
                  !orderDisabled ? "crm-cms-insights-row--draggable" : "",
                  isDragging ? "is-dragging" : "",
                  isDropTarget ? "is-drop-target" : "",
                  saving ? "is-order-pending" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                draggable={!orderDisabled}
                onDragStart={(event) => {
                  if (orderDisabled) return;
                  const target = event.target as HTMLElement | null;
                  if (target?.closest("a, button, input, label")) {
                    event.preventDefault();
                    return;
                  }
                  setDragSlug(row.slug);
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", row.slug);
                }}
                onDragOver={(event) => {
                  if (orderDisabled || !dragSlug || dragSlug === row.slug) return;
                  event.preventDefault();
                  setDropSlug(row.slug);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  applyDrop(row.slug);
                  setDragSlug("");
                  setDropSlug("");
                }}
                onDragEnd={() => {
                  setDragSlug("");
                  setDropSlug("");
                }}
              >
                <td data-label="ลำดับ">
                  <span className="crm-cms-order-num" title={orderDisabled ? "ลำดับบนหน้าเว็บ" : "ลากแถวเพื่อจัดลำดับ"}>
                    {position}
                  </span>
                </td>
                <td data-label="ชื่อบทความ">
                  <Link href={editHref} className="crm-cms-name">
                    {row.title}
                  </Link>
                </td>
                <td data-label="Slug">
                  <code className="crm-cms-slug">{row.path}</code>
                </td>
                <td data-label="Meta Tag">
                  <span className="crm-cms-meta" title={row.metaTag}>
                    {truncate(row.metaTag, 80)}
                  </span>
                </td>
                <td data-label="Description">
                  <span className="crm-cms-desc" title={row.description}>
                    {truncate(row.description, 100)}
                  </span>
                </td>
                <td data-label="สถานะ">
                  <OnlineToggle
                    pageId={row.id}
                    route={row.path}
                    slug={row.slug}
                    online={row.online}
                    pageName={row.title}
                    onChanged={({ online, id }) => {
                      setRows((prev) =>
                        prev.map((item) => {
                          if (item.slug !== row.slug) return item;
                          if (id) {
                            return {
                              key: id,
                              kind: "cms" as const,
                              slug: item.slug,
                              title: item.title,
                              path: item.path,
                              metaTag: item.metaTag,
                              description: item.description,
                              online,
                              id,
                            };
                          }
                          return { ...item, online };
                        }),
                      );
                    }}
                  />
                </td>
                <td data-label="การดำเนินการ">
                  {row.kind === "cms" || row.id ? (
                    <CmsPageRowActions
                      pageId={row.id}
                      pageName={row.title}
                      editHref={editHref}
                      canDelete={Boolean(row.id)}
                      returnTo="/crm/cms/insights"
                      dialogTitle="ลบบทความ"
                      dialogMessage={`ยืนยันลบ “${row.title}”? บทความจะถูกย้ายเข้าถังขยะ`}
                    />
                  ) : (
                    <div className="crm-users-icon-actions crm-cms-row-actions">
                      <Link href={editHref} className="crm-users-icon-btn" title="แก้ไข" aria-label={`แก้ไข ${row.title}`}>
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0 0-2.12L16.62 5.5a1.5 1.5 0 0 0-2.12 0L4 16v4Z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                          />
                          <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                        </svg>
                      </Link>
                      <SiteInsightDeleteButton slug={row.slug} title={row.title} />
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
