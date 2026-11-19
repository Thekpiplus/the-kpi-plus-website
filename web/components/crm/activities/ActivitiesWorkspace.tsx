"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ActivityFollowUpForm } from "@/components/crm/activities/ActivityFollowUpForm";
import { ActivitiesVisual } from "@/components/crm/activities/ActivitiesVisual";
import {
  addDays,
  buildActivityMeta,
  filterActivityCards,
  formatThaiDateLong,
  kindFill,
  KIND_META,
  parseDay,
  parseKind,
  parseStatus,
  startOfDayBangkok,
  type ActivityCard,
  type ActivityDayFilter,
  type ActivityKindFilter,
  type ActivityStatusFilter,
} from "@/components/crm/activities/activity-types";
import { ACTIVITY_TONES } from "@/components/crm/activities/activity-tones";
import { completeActivity, scheduleActivity } from "@/lib/crm/actions";
import { LeadsPageChrome } from "@/components/crm/leads/LeadsPageChrome";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import "./activities-a.css";

function dayParts(offset: number, base: Date) {
  const date = addDays(base, offset);
  const weekday =
    offset === 0
      ? "วันนี้"
      : new Intl.DateTimeFormat("th-TH", {
          weekday: "short",
          timeZone: "Asia/Bangkok",
        }).format(date);
  const dateLabel = new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Bangkok",
  }).format(date);
  return { weekday, dateLabel };
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function ActivitiesWorkspace({ items }: { items: ActivityCard[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [openFormId, setOpenFormId] = useState<string | null>(null);
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [doneItems, setDoneItems] = useState<ActivityCard[]>([]);
  const [doneOpen, setDoneOpen] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorById, setErrorById] = useState<Record<string, string>>({});
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const status = parseStatus(searchParams.get("status") ?? undefined);
  const day = parseDay(searchParams.get("day") ?? undefined);
  const kind = parseKind(searchParams.get("kind") ?? undefined);

  const openItems = useMemo(
    () => items.filter((item) => !doneIds.includes(item.id)),
    [doneIds, items],
  );
  const meta = useMemo(() => buildActivityMeta(openItems), [openItems]);
  const visible = useMemo(
    () => filterActivityCards(openItems, { status, day, kind, q: query }),
    [day, kind, openItems, query, status],
  );

  const todayStart = startOfDayBangkok();

  function hrefFor(patch: {
    status?: ActivityStatusFilter;
    day?: ActivityDayFilter;
    kind?: ActivityKindFilter;
    q?: string;
  }) {
    const next = new URLSearchParams();
    const nextStatus = patch.status ?? status;
    const nextDay = patch.day ?? day;
    const nextKind = patch.kind ?? kind;
    const nextQ = patch.q !== undefined ? patch.q : query;
    if (nextStatus !== "open") next.set("status", nextStatus);
    if (nextDay !== "all") next.set("day", nextDay);
    if (nextKind !== "all") next.set("kind", nextKind);
    if (nextQ.trim()) next.set("q", nextQ.trim());
    const value = next.toString();
    return value ? `/crm/activities?${value}` : "/crm/activities";
  }

  function pushFilters(patch: {
    status?: ActivityStatusFilter;
    day?: ActivityDayFilter;
    kind?: ActivityKindFilter;
    q?: string;
  }) {
    router.push(hrefFor(patch));
  }

  function markDoneLocal(item: ActivityCard, message: string) {
    setDoneIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
    setDoneItems((prev) => (prev.some((row) => row.id === item.id) ? prev : [item, ...prev]));
    setOpenFormId(null);
    setDoneOpen(true);
    setNotice(message);
  }

  function completeQuick(item: ActivityCard) {
    const payload = new FormData();
    payload.set("activityId", item.id);
    payload.set("outcome", "ทำเสร็จแล้ว");
    startTransition(async () => {
      try {
        await completeActivity(payload);
        markDoneLocal(item, `ทำเสร็จแล้ว: ${item.title}`);
      } catch {
        setErrorById((prev) => ({ ...prev, [item.id]: "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง" }));
      }
    });
  }

  function completeWithForm(item: ActivityCard, formData: FormData) {
    const outcome = String(formData.get("outcome") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();
    const nextDate = String(formData.get("nextDate") ?? "").trim();
    const nextTime = String(formData.get("nextTime") ?? "").trim();
    const nextTitle = String(formData.get("nextTitle") ?? "นัดติดตามครั้งถัดไป").trim();
    if (!outcome) {
      setErrorById((prev) => ({ ...prev, [item.id]: "เลือกผลการติดต่อก่อนบันทึก" }));
      return;
    }
    const payload = new FormData();
    payload.set("activityId", item.id);
    payload.set("outcome", note ? `${outcome} — ${note}` : outcome);
    if (nextDate) {
      payload.set("nextDueAt", `${nextDate}T${nextTime || "09:00"}`);
      payload.set("nextTitle", nextTitle);
      payload.set("nextType", item.typeRaw || "call");
    }
    setErrorById((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });
    startTransition(async () => {
      try {
        await completeActivity(payload);
        markDoneLocal(item, `บันทึกผลแล้ว: ${item.contactName} · ${outcome}`);
      } catch {
        setErrorById((prev) => ({ ...prev, [item.id]: "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง" }));
      }
    });
  }

  function undoDone(item: ActivityCard) {
    const payload = new FormData();
    payload.set("leadId", item.leadId);
    payload.set("type", item.typeRaw || "task");
    payload.set("title", item.title);
    payload.set(
      "dueAt",
      item.dueAt ?? new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    );
    startTransition(async () => {
      try {
        await scheduleActivity(payload);
        setDoneIds((prev) => prev.filter((id) => id !== item.id));
        setDoneItems((prev) => prev.filter((row) => row.id !== item.id));
        setNotice(`ยกเลิกแล้ว — งาน “${item.title}” กลับเข้าคิว`);
        router.refresh();
      } catch {
        setNotice("ยกเลิกไม่สำเร็จ ลองใหม่อีกครั้ง");
      }
    });
  }

  const specialSlots: {
    id: ActivityDayFilter;
    label: string;
    count: number;
    hasWork: boolean;
  }[] = [
    { id: "overdue", label: "เกินกำหนด", count: meta.overdue, hasWork: meta.overdue > 0 },
    { id: "anytime", label: "ไม่มีกำหนด", count: meta.anytime, hasWork: meta.anytime > 0 },
    { id: "all", label: "ทุกวัน", count: meta.open, hasWork: meta.open > 0 },
  ];

  const weekSlots = ([0, 1, 2, 3, 4, 5, 6] as const).map((offset) => {
    const parts = dayParts(offset, todayStart);
    return {
      id: String(offset) as ActivityDayFilter,
      weekday: parts.weekday,
      dateLabel: parts.dateLabel,
      count: meta.perDay[String(offset)]?.count ?? 0,
      hasWork: (meta.perDay[String(offset)]?.count ?? 0) > 0,
    };
  });

  return (
    <LeadsPageChrome
      heroVariant="activities"
      title="กิจกรรมที่ต้องทำ"
      description="คิวติดตามลีดแบบการ์ด — กรองตามวันและประเภท แล้วบันทึกผลหรือทำเสร็จทีละงาน"
      meta={
        <>
          {formatThaiDateLong()} · {meta.open} งานที่ต้องทำ · {meta.overdue} งานเกินกำหนด · {meta.today}{" "}
          วันนี้
        </>
      }
      notice={notice}
      actions={
        <>
          <NewLeadOpenButton className="kpi-leads-btn-primary">เพิ่มลีดใหม่</NewLeadOpenButton>
          <Link href="/crm/pipeline" className="kpi-leads-btn-secondary">
            ดู Pipeline
          </Link>
        </>
      }
    >
      <div className="kpi-act-a">
      <section className="kpi-act-stats" aria-label="สรุปสถานะงาน">
        {(
          [
            { id: "open" as const, label: "เปิดอยู่", count: meta.open, hint: "คิวที่ยังไม่ปิด", tone: "open" },
            {
              id: "overdue" as const,
              label: "เกินกำหนด",
              count: meta.overdue,
              hint: "ต้องเคลียร์ก่อน",
              tone: "overdue",
            },
            { id: "today" as const, label: "วันนี้", count: meta.today, hint: "ถึงกำหนดวันนี้", tone: "today" },
            {
              id: "upcoming" as const,
              label: "กำลังจะถึง",
              count: meta.upcoming,
              hint: `ไม่มีกำหนด ${meta.anytime}`,
              tone: "upcoming",
            },
          ] as const
        ).map((card) => (
          <button
            key={card.id}
            type="button"
            className={`kpi-act-stat is-${card.tone}${status === card.id ? " is-active" : ""}`}
            aria-pressed={status === card.id}
            onClick={() => pushFilters({ status: card.id, day: "all" })}
          >
            <span className="kpi-act-stat-label">{card.label}</span>
            <strong className="kpi-act-stat-value num">{card.count}</strong>
            <span className="kpi-act-stat-hint">{card.hint}</span>
          </button>
        ))}
      </section>

      <ActivitiesVisual
        openTotal={meta.open}
        statusSlices={[
          {
            id: "overdue",
            label: "เกินกำหนด",
            count: meta.overdue,
            fill: ACTIVITY_TONES.overdue,
          },
          {
            id: "today",
            label: "วันนี้",
            count: meta.today,
            fill: ACTIVITY_TONES.today,
          },
          {
            id: "upcoming",
            label: "กำลังจะถึง",
            count: meta.upcoming + meta.anytime,
            fill: ACTIVITY_TONES.upcoming,
          },
        ]}
        kindRows={meta.byKind}
        activeStatus={status}
        activeKind={kind}
        onStatus={(next) => pushFilters({ status: next, day: "all" })}
        onKind={(next) => pushFilters({ kind: next })}
      />

      <section className="kpi-act-days" aria-label="แถบเวลา">
        <div className="kpi-act-days-special" role="group" aria-label="กลุ่มพิเศษ">
          {specialSlots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              className={`kpi-act-day is-special${day === slot.id ? " is-active" : ""}${slot.hasWork ? " has-work" : ""}${slot.id === "all" ? " is-all" : ""}`}
              aria-pressed={day === slot.id}
              onClick={() =>
                pushFilters({
                  day: slot.id,
                  status: slot.id === "all" ? status : "open",
                })
              }
            >
              <span>{slot.label}</span>
              <strong className="num">{slot.count}</strong>
            </button>
          ))}
        </div>
        <div className="kpi-act-days-week" role="group" aria-label="สัปดาห์นี้">
          {weekSlots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              className={`kpi-act-day is-week${day === slot.id ? " is-active" : ""}${slot.hasWork ? " has-work" : ""}${slot.id === "0" ? " is-today-slot" : ""}`}
              aria-pressed={day === slot.id}
              onClick={() => pushFilters({ day: slot.id, status: "open" })}
            >
              <span className="kpi-act-day-weekday">{slot.weekday}</span>
              <span className="kpi-act-day-date">{slot.dateLabel}</span>
              <strong className="num">{slot.count}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="kpi-act-filters" aria-label="ค้นหางาน">
        <div className="kpi-act-search-row">
          <label className="kpi-act-search">
            <span className="sr-only">ค้นหางาน</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") pushFilters({ q: query });
              }}
              placeholder="ค้นหาชื่อ โรงแรม หรือประเภทงาน"
            />
          </label>
          <button type="button" className="kpi-leads-btn-secondary" onClick={() => pushFilters({ q: query })}>
            ค้นหา
          </button>
          {status !== "open" || day !== "all" || kind !== "all" || query.trim() ? (
            <button
              type="button"
              className="kpi-leads-btn-secondary"
              onClick={() => {
                setQuery("");
                router.push("/crm/activities");
              }}
            >
              ล้างตัวกรอง
            </button>
          ) : null}
        </div>
        <p className="kpi-act-count">
          แสดง <strong className="num">{visible.length}</strong> จาก{" "}
          <strong className="num">{meta.open}</strong> งาน
          {kind !== "all" ? (
            <>
              {" "}
              · กรองประเภท{" "}
              <strong style={{ color: kindFill(kind) }}>{KIND_META[kind].label}</strong>
            </>
          ) : null}
        </p>
      </section>

      {visible.length === 0 ? (
        <section className="kpi-act-empty" aria-label="ไม่มีงานในตัวกรองนี้">
          <h2>ไม่มีงานในตัวกรองนี้</h2>
          <p>ลองเปลี่ยนวัน ประเภท หรือล้างตัวกรองเพื่อดูคิวทั้งหมด</p>
        </section>
      ) : (
        <section className="kpi-act-grid" aria-label="รายการงาน">
          {visible.map((item) => {
            const formOpen = openFormId === item.id;
            return (
              <article
                key={item.id}
                className={`kpi-act-card is-${item.dueBucket}${item.isOld ? " is-old" : ""}`}
                style={{ ["--act-fill" as string]: kindFill(item.kind) }}
              >
                <div className="kpi-act-card-pills">
                  <span className="kpi-act-pill is-kind">{item.kindLabel}</span>
                  <span className={`kpi-act-pill is-due is-${item.dueBucket}`}>{item.dueLabel}</span>
                  {item.isOld ? <span className="kpi-act-pill is-old">งานเก่า</span> : null}
                </div>
                <p className="kpi-act-code">{item.code}</p>
                <h3 className="kpi-act-title">
                  <Link href={`/crm/leads/${item.leadId}`}>{item.title}</Link>
                </h3>
                <p className="kpi-act-detail">{item.detail}</p>
                <div className="kpi-act-context">
                  <span className="kpi-act-avatar" aria-hidden="true">
                    {initials(item.contactName)}
                  </span>
                  <div>
                    <strong>{item.contactName}</strong>
                    <span>{item.businessName}</span>
                    <em>
                      ผู้ดูแล {item.ownerName} · {item.valueLabel}
                    </em>
                  </div>
                </div>
                <div className="kpi-act-card-footer">
                  <button
                    type="button"
                    className="kpi-leads-btn-secondary"
                    aria-expanded={formOpen}
                    disabled={pending}
                    onClick={() => setOpenFormId(formOpen ? null : item.id)}
                  >
                    {formOpen ? "ปิดฟอร์ม" : "บันทึกผล"}
                  </button>
                  <button
                    type="button"
                    className="kpi-leads-btn-primary"
                    disabled={pending}
                    onClick={() => completeQuick(item)}
                  >
                    ทำเสร็จ
                  </button>
                </div>
                {formOpen ? (
                  <ActivityFollowUpForm
                    defaultTitle={`ติดตาม${KIND_META[item.kind].label}`}
                    error={errorById[item.id]}
                    onCancel={() => setOpenFormId(null)}
                    onSubmit={(formData) => completeWithForm(item, formData)}
                  />
                ) : null}
                {errorById[item.id] && !formOpen ? (
                  <p className="kpi-act-alert" role="alert">
                    {errorById[item.id]}
                  </p>
                ) : null}
              </article>
            );
          })}
        </section>
      )}

      <section className="kpi-act-done">
        <button
          type="button"
          className="kpi-act-done-toggle"
          aria-expanded={doneOpen}
          onClick={() => setDoneOpen((prev) => !prev)}
        >
          เสร็จแล้ววันนี้ <strong className="num">{doneItems.length}</strong> งาน
        </button>
        {doneOpen && doneItems.length > 0 ? (
          <ul className="kpi-act-done-list">
            {doneItems.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>
                    {item.contactName} · {item.businessName}
                  </span>
                </div>
                <button type="button" className="kpi-leads-btn-secondary" disabled={pending} onClick={() => undoDone(item)}>
                  ยกเลิก
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <p className="kpi-act-footer">
        ข้อมูลจากกิจกรรมเปิดจริงในระบบ · ช่อง «ไม่มีกำหนด» ว่างจนกว่า dueAt จะรองรับค่าว่าง ·
        ยกเลิกจาก «เสร็จแล้ว» จะเปิดนัดใหม่ด้วยกำหนดเดิม
      </p>
      </div>
    </LeadsPageChrome>
  );
}
