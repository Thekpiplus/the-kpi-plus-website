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

function OrderControls({
  slug,
  position,
  canUp,
  canDown,
  disabled,
  pending,
  onMove,
}: {
  slug: string;
  position: number;
  canUp: boolean;
  canDown: boolean;
  disabled?: boolean;
  pending?: boolean;
  onMove: (direction: "up" | "down") => void;
}) {
  return (
    <div className={`crm-cms-order ${pending ? "is-pending" : ""}`}>
      <span className="crm-cms-order-num" title="ลำดับบนหน้าเว็บ">
        {position}
      </span>
      <div className="crm-cms-order-btns">
        <button
          type="button"
          className="crm-cms-order-btn"
          title="เลื่อนขึ้น"
          aria-label={`เลื่อน “${slug}” ขึ้น`}
          disabled={disabled || pending || !canUp}
          onClick={() => onMove("up")}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 14l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="crm-cms-order-btn"
          title="เลื่อนลง"
          aria-label={`เลื่อน “${slug}” ลง`}
          disabled={disabled || pending || !canDown}
          onClick={() => onMove("down")}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 10l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
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

  useEffect(() => {
    setRows(initialRows);
    rowsRef.current = initialRows;
  }, [initialRows]);

  function move(slug: string, direction: "up" | "down") {
    const current = rowsRef.current;
    const index = current.findIndex((row) => row.slug === slug);
    if (index < 0) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= current.length) return;

    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    rowsRef.current = next;
    setRows(next);

    const formData = new FormData();
    formData.set("slug", slug);
    formData.set("direction", direction);
    formData.set("order", JSON.stringify(next.map((row) => row.slug)));
    saveQueue.current = saveQueue.current
      .then(() => moveInsightOrder(formData))
      .catch(() => {
        rowsRef.current = current;
        setRows(current);
      });
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
            return (
              <tr key={row.key}>
                <td data-label="ลำดับ">
                  <OrderControls
                    slug={row.slug}
                    position={position}
                    canUp={index > 0}
                    canDown={index < rows.length - 1}
                    disabled={orderDisabled}
                    onMove={(direction) => move(row.slug, direction)}
                  />
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
