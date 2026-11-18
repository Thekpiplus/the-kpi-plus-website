"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";
import { completeActivity } from "@/lib/crm/actions";

export type SalesTodayFilter = "all" | "overdue" | "today" | "first" | "new";

export type SalesTodayItem = {
  key: string;
  activityId?: string;
  leadId: string;
  contactName: string;
  businessName: string;
  scope: string;
  channel: string;
  lastContactLabel: string;
  dueLabel?: string;
  status: "overdue" | "today" | "first" | "new";
  title?: string;
};

type SavedDraft = {
  outcome: string;
  nextDate: string;
  nextTime: string;
  nextTitle: string;
  note: string;
};

const OUTCOMES = [
  "ติดต่อได้",
  "ไม่รับสาย",
  "นัดหมายแล้ว",
  "ส่งข้อมูลแล้ว",
  "ไม่สนใจ",
] as const;

const STATUS_LABEL: Record<SalesTodayItem["status"], string> = {
  overdue: "เกินกำหนด",
  today: "วันนี้",
  first: "รอตอบ",
  new: "ลีดใหม่",
};

const GROUP_ORDER: SalesTodayItem["status"][] = ["overdue", "today", "first", "new"];

const GROUP_TITLE: Record<SalesTodayItem["status"], string> = {
  overdue: "เกินกำหนด",
  today: "ถึงกำหนดวันนี้",
  first: "รอตอบกลับ",
  new: "ลีดใหม่",
};

function chipLabel(item: SalesTodayItem) {
  if (item.status === "overdue" || item.status === "today") {
    return item.dueLabel || STATUS_LABEL[item.status];
  }
  return STATUS_LABEL[item.status];
}

export function SalesTodayBoard({
  items,
  filter,
  q,
  counts,
}: {
  items: SalesTodayItem[];
  filter: SalesTodayFilter;
  q: string;
  counts: Record<SalesTodayFilter, number>;
}) {
  const [query, setQuery] = useState(q);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, SavedDraft>>({});
  const [errorByKey, setErrorByKey] = useState<Record<string, string>>({});
  const [boardNotice, setBoardNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== "all" && item.status !== filter) return false;
      if (!needle) return true;
      const hay = `${item.contactName} ${item.businessName} ${item.channel} ${item.scope}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [filter, items, query]);

  const groups = useMemo(() => {
    return GROUP_ORDER.map((status) => ({
      status,
      items: filtered.filter((item) => item.status === status),
    })).filter((group) => group.items.length > 0);
  }, [filtered]);

  function hrefFor(next: SalesTodayFilter) {
    const params = new URLSearchParams();
    if (next !== "all") params.set("filter", next);
    if (query.trim()) params.set("q", query.trim());
    const value = params.toString();
    return value ? `/crm/sales?${value}` : "/crm/sales";
  }

  function onSubmit(item: SalesTodayItem, formData: FormData) {
    const outcome = String(formData.get("outcome") ?? "").trim();
    const nextDueAt = String(formData.get("nextDueAt") ?? "").trim();
    const nextDate = String(formData.get("nextDate") ?? "").trim();
    const nextTime = String(formData.get("nextTime") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();
    const nextTitle = String(formData.get("nextTitle") ?? "นัดติดตามครั้งถัดไป").trim();

    if (!outcome) {
      setErrorByKey((prev) => ({ ...prev, [item.key]: "เลือกผลการติดต่อก่อนบันทึก" }));
      return;
    }
    if (!item.activityId) {
      setErrorByKey((prev) => ({
        ...prev,
        [item.key]: "ลีดนี้ยังไม่มีกิจกรรมเปิด — เปิดหน้ารายละเอียดเพื่อตั้งนัดก่อน",
      }));
      return;
    }

    const dueCombined = nextDueAt || (nextDate ? `${nextDate}T${nextTime || "09:00"}` : "");
    const payload = new FormData();
    payload.set("activityId", item.activityId);
    payload.set("outcome", note ? `${outcome} — ${note}` : outcome);
    if (dueCombined) {
      payload.set("nextDueAt", dueCombined);
      payload.set("nextTitle", nextTitle || "นัดติดตามครั้งถัดไป");
      payload.set("nextType", String(formData.get("nextType") ?? "call"));
    }

    setErrorByKey((prev) => {
      const next = { ...prev };
      delete next[item.key];
      return next;
    });

    startTransition(async () => {
      try {
        await completeActivity(payload);
        setSaved((prev) => ({
          ...prev,
          [item.key]: {
            outcome,
            nextDate,
            nextTime: nextTime || "09:00",
            nextTitle,
            note,
          },
        }));
        setOpenKey(null);
        setBoardNotice(`บันทึกผลแล้ว: ${item.contactName} · ${outcome}`);
      } catch {
        setErrorByKey((prev) => ({
          ...prev,
          [item.key]: "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง",
        }));
      }
    });
  }

  const chips: { id: SalesTodayFilter; label: string }[] = [
    { id: "all", label: "ทั้งหมด" },
    { id: "overdue", label: "เกินกำหนด" },
    { id: "today", label: "ถึงกำหนดวันนี้" },
    { id: "first", label: "รอตอบกลับ" },
    { id: "new", label: "ลีดใหม่" },
  ];

  return (
    <section className="kpi-leads-panel" aria-labelledby="kpi-leads-today-heading">
      <header className="kpi-leads-panel-head">
        <h2 id="kpi-leads-today-heading">รายการที่ต้องติดต่อ</h2>
        <p>เรียงตามความเร่งด่วน — หนึ่งลีดต่อหนึ่งแถว</p>
      </header>

      {boardNotice ? (
        <p className="kpi-leads-board-notice" role="status" aria-live="polite">
          {boardNotice}
        </p>
      ) : null}

      <div className="kpi-leads-toolbar">
        <div className="kpi-leads-search">
          <label className="kpi-leads-search-field">
            <span className="sr-only">ค้นหาลีด</span>
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหาชื่อ กิจการ เบอร์ หรือช่องทาง"
              autoComplete="off"
            />
          </label>
          <Link
            href={`/crm/leads${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`}
            className="kpi-leads-btn-secondary"
          >
            ค้นหาทั้งระบบ
          </Link>
        </div>

        <div className="kpi-leads-chips" role="group" aria-label="กรองรายการ">
          {chips.map((chip) => (
            <Link
              key={chip.id}
              href={hrefFor(chip.id)}
              className={`kpi-leads-chip${filter === chip.id ? " is-active" : ""}`}
              aria-current={filter === chip.id ? "true" : undefined}
            >
              {chip.label} <strong>{counts[chip.id]}</strong>
            </Link>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="kpi-leads-empty">
          <h3>ยังไม่มีรายการตามตัวกรองนี้</h3>
          <p>เมื่อมีงานเกินกำหนด ถึงกำหนด หรือลีดใหม่ จะแสดงที่นี่</p>
          <Link href="/crm/leads" className="kpi-leads-btn-secondary">
            เปิดลีดทั้งหมด
          </Link>
        </div>
      ) : (
        groups.map((group) => (
          <div key={group.status} className="kpi-leads-group">
            <h3 className="kpi-leads-group-title">
              {GROUP_TITLE[group.status]} ({group.items.length})
            </h3>
            {group.items.map((item) => {
              const isOpen = openKey === item.key;
              const savedState = saved[item.key];
              const defaultTitle =
                savedState?.nextTitle ||
                (item.title ? `ติดตาม: ${item.title}` : "นัดติดตามครั้งถัดไป");
              return (
                <article
                  key={item.key}
                  className={`kpi-leads-row${savedState ? " is-saved" : ""}`}
                >
                  <div className="kpi-leads-row-main">
                    <div className="kpi-leads-avatar" aria-hidden="true">
                      {(item.contactName.trim().charAt(0) || "?").toUpperCase()}
                      {item.status === "overdue" && !savedState ? (
                        <span className="kpi-leads-dot" />
                      ) : null}
                    </div>
                    <div className="kpi-leads-identity">
                      <Link href={`/crm/leads/${item.leadId}`} className="kpi-leads-name">
                        {item.contactName}
                      </Link>
                      <p className="kpi-leads-sub">
                        {[item.businessName, item.scope, item.channel].filter(Boolean).join(" · ")}
                      </p>
                      {savedState ? (
                        <p className="kpi-leads-summary-line">ผล: {savedState.outcome}</p>
                      ) : null}
                    </div>
                    <div className="kpi-leads-last">
                      <span>ติดต่อล่าสุด</span>
                      {item.lastContactLabel}
                    </div>
                    <span
                      className={`kpi-leads-due-chip is-${savedState ? "saved" : item.status}`}
                      title={item.dueLabel || STATUS_LABEL[item.status]}
                    >
                      {savedState ? "บันทึกแล้ว" : chipLabel(item)}
                    </span>
                    {item.activityId ? (
                      <button
                        type="button"
                        className="kpi-leads-row-action"
                        disabled={pending}
                        onClick={() => setOpenKey(isOpen ? null : item.key)}
                      >
                        {savedState ? "แก้ไข" : isOpen ? "ปิดฟอร์ม" : "บันทึกผล"}
                      </button>
                    ) : (
                      <Link href={`/crm/leads/${item.leadId}`} className="kpi-leads-row-action">
                        เปิดลีด
                      </Link>
                    )}
                  </div>

                  {isOpen && item.activityId ? (
                    <form
                      key={`${item.key}-${savedState?.outcome ?? "fresh"}`}
                      className="kpi-leads-followup"
                      action={(formData) => onSubmit(item, formData)}
                    >
                      <fieldset className="kpi-leads-outcomes">
                        <legend>ผลการติดต่อ</legend>
                        {OUTCOMES.map((label) => (
                          <label key={label} className="kpi-leads-outcome">
                            <input
                              type="radio"
                              name="outcome"
                              value={label}
                              defaultChecked={savedState?.outcome === label}
                              required
                            />
                            <span>{label}</span>
                          </label>
                        ))}
                      </fieldset>

                      <div className="kpi-leads-followup-grid">
                        <label className="kpi-leads-field">
                          วันที่นัดครั้งถัดไป
                          <input
                            type="date"
                            name="nextDate"
                            defaultValue={savedState?.nextDate ?? ""}
                          />
                        </label>
                        <label className="kpi-leads-field">
                          เวลานัดครั้งถัดไป
                          <input
                            type="time"
                            name="nextTime"
                            defaultValue={savedState?.nextTime ?? "09:00"}
                          />
                        </label>
                        <label className="kpi-leads-field kpi-leads-field-span">
                          ชื่อนัดติดตาม
                          <input name="nextTitle" defaultValue={defaultTitle} />
                        </label>
                        <label className="kpi-leads-field kpi-leads-field-span">
                          หมายเหตุสั้น ๆ
                          <textarea
                            name="note"
                            rows={2}
                            placeholder="สรุปสั้น ๆ จากสาย/แชท"
                            defaultValue={savedState?.note ?? ""}
                          />
                        </label>
                      </div>

                      {errorByKey[item.key] ? (
                        <p className="kpi-leads-alert" role="alert">
                          {errorByKey[item.key]}
                        </p>
                      ) : null}

                      <div className="kpi-leads-followup-actions">
                        <PendingSubmitButton
                          className="kpi-leads-btn-primary"
                          pendingLabel="กำลังบันทึก…"
                        >
                          บันทึกผล
                        </PendingSubmitButton>
                        <button
                          type="button"
                          className="kpi-leads-btn-secondary"
                          onClick={() => setOpenKey(null)}
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </form>
                  ) : null}
                </article>
              );
            })}
          </div>
        ))
      )}
    </section>
  );
}
