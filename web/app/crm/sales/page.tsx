import Link from "next/link";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { greetingForHour, OverviewHero } from "@/components/crm/ui/OverviewHero";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { completeActivity } from "@/lib/crm/actions";
import { requireUser } from "@/lib/crm/auth";
import { formatThaiDateTime, leadOriginCounts, todayLists } from "@/lib/crm/queries";
import { sourceLabel } from "@/lib/crm/sources";

function formatThaiDateToday(value = new Date()) {
  return new Intl.DateTimeFormat("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(value);
}

export default async function SalesHomePage() {
  const user = await requireUser();
  const [lists, origins] = await Promise.all([todayLists(), leadOriginCounts()]);
  const dueToday = lists.dueToday.length;
  const overdue = lists.overdue.length;
  const openWork = dueToday + overdue;
  const todayLabel = formatThaiDateToday();
  const greeting = greetingForHour();

  return (
    <div className="crm-leads crm-leads-page crm-sales-today">
      <OverviewHero
        variant="welcome"
        eyebrow="Lead Management / วันนี้"
        badge={
          <span className={`crm-hero-badge${overdue > 0 ? " is-alert" : ""}`}>
            {openWork > 0 ? `งานเปิด ${openWork} รายการ` : "ไม่มีงานค้าง"}
          </span>
        }
        title={`${greeting}, ${user.name || "ทีม KPI Plus"}`}
        description={`คิวติดตามของวันนี้ · ${todayLabel}`}
        label="งานวันนี้"
        actions={
          <>
            <Link href="/crm/pipeline" className="crm-hero-btn crm-hero-btn-secondary">
              Pipeline
            </Link>
            <NewLeadOpenButton className="crm-hero-btn crm-hero-btn-primary">คีย์ลีด</NewLeadOpenButton>
          </>
        }
      />

      <section className="crm-sales-summary" aria-label="สรุปงานวันนี้">
        <div className="crm-leads-stats crm-sales-stats" role="list">
          <Link href="/crm/activities" className="crm-leads-stat is-overdue is-priority" role="listitem">
            <span className="crm-leads-stat-label">เกินกำหนด</span>
            <strong className="crm-leads-stat-value">{overdue}</strong>
            <span className="crm-leads-stat-hint">ต้องติดตามก่อน · เปิดคิวกิจกรรม</span>
          </Link>
          <div className="crm-leads-stat is-today is-static is-priority" role="listitem" aria-current="true">
            <span className="crm-leads-stat-label">ครบกำหนดวันนี้</span>
            <strong className="crm-leads-stat-value">{dueToday}</strong>
            <span className="crm-leads-stat-hint">สรุปจากคิวด้านล่าง</span>
          </div>
          <Link href="/crm/leads?origin=web" className="crm-leads-stat is-web is-secondary-stat" role="listitem">
            <span className="crm-leads-stat-label">จากเว็บไซต์</span>
            <strong className="crm-leads-stat-value">{origins.web}</strong>
            <span className="crm-leads-stat-hint">เปิดรายการจากเว็บ</span>
          </Link>
          <Link href="/crm/leads?origin=manual" className="crm-leads-stat is-manual is-secondary-stat" role="listitem">
            <span className="crm-leads-stat-label">คีย์เอง</span>
            <strong className="crm-leads-stat-value">{origins.manual}</strong>
            <span className="crm-leads-stat-hint">เปิดรายการที่คีย์เอง</span>
          </Link>
        </div>
      </section>

      <section className="crm-leads-toolbar crm-sales-toolbar" aria-label="ค้นหาลีด">
        <form className="crm-leads-search" method="get" action="/crm/leads">
          <label className="crm-leads-search-field">
            <span className="sr-only">ค้นหาลีดจากชื่อ กิจการ เบอร์ หรืออีเมล</span>
            <span aria-hidden="true">⌕</span>
            <input name="q" placeholder="ค้นหาชื่อ กิจการ เบอร์ หรืออีเมล" autoComplete="off" />
          </label>
          <button className="kpi-button crm-users-primary" type="submit">
            ค้นหา
          </button>
        </form>
      </section>

      <div className="crm-sales-layout">
        <section className="crm-sales-followups" aria-labelledby="crm-sales-followups-heading">
          <header className="crm-sales-section-head">
            <div>
              <h2 id="crm-sales-followups-heading">รายการที่ต้องติดตาม</h2>
              <p>เรียงตามความเร่งด่วน — เกินกำหนด · ครบกำหนดวันนี้ · ลีดใหม่ที่รอตอบ</p>
            </div>
          </header>

          <div className="crm-sales-followups-grid">
            <TaskPanel
              title="เกินกำหนด"
              hint="ต้องติดตามก่อน — งานที่เลยวันกำหนดแล้ว"
              tone="overdue"
              items={lists.overdue}
              empty="ไม่มีงานเกินกำหนด"
              emptyBody="เมื่อมีกิจกรรมเลยวันกำหนด จะแสดงที่นี่"
            />
            <TaskPanel
              title="ครบกำหนดวันนี้"
              hint="ติดตามภายในวันนี้"
              tone="today"
              items={lists.dueToday}
              empty="ไม่มีงานครบกำหนดวันนี้"
              emptyBody="ยังไม่มีกิจกรรมที่ครบกำหนดวันนี้"
            />
            <ListPanel
              title="ลีดใหม่ที่รอตอบ"
              hint="ควรตอบกลับครั้งแรกให้เร็ว"
              empty="ไม่มีลีดรอตอบ"
              emptyBody="ลีดที่ต้องตอบกลับครั้งแรกจะแสดงที่นี่"
              actionHref="/crm/leads?origin=web"
              actionLabel="ดูลีดจากเว็บ"
              count={lists.firstResponse.length}
              className="crm-sales-panel-span"
            >
              {lists.firstResponse.map((item) => (
                <li key={item.id} className="crm-leads-simple-row">
                  <Link href={`/crm/leads/${item.lead.id}`}>
                    <strong>{item.lead.contactName}</strong>
                    <em>{item.lead.businessName || item.lead.formName || "ไม่มีชื่อกิจการ"}</em>
                  </Link>
                  <StatusBadge label={sourceLabel(item.lead.source)} tone="info" />
                </li>
              ))}
            </ListPanel>
          </div>
        </section>

        <aside className="crm-sales-secondary" aria-labelledby="crm-sales-secondary-heading">
          <header className="crm-sales-section-head">
            <div>
              <h2 id="crm-sales-secondary-heading">กิจกรรมถัดไป</h2>
              <p>ลีดที่ยังไม่มีนัดติดตามต่อ</p>
            </div>
          </header>
          <ListPanel
            title="ยังไม่มีกิจกรรมถัดไป"
            hint="ตั้งนัดติดตามต่อให้ลีดเหล่านี้"
            empty="ยังไม่มีกิจกรรมถัดไป"
            emptyBody="ลีดทุกตัวมีนัดติดตามต่อแล้วในขณะนี้"
            actionHref="/crm/leads"
            actionLabel="ดูลีดทั้งหมด"
            count={lists.noNext.length}
          >
            {lists.noNext.map((lead) => (
              <li key={lead.id} className="crm-leads-simple-row">
                <Link href={`/crm/leads/${lead.id}`}>
                  <strong>{lead.contactName}</strong>
                  <em>{lead.businessName || lead.formName || "ไม่มีชื่อกิจการ"}</em>
                </Link>
                <StatusBadge label={lead.stage.nameTh} tone="neutral" />
              </li>
            ))}
          </ListPanel>
        </aside>
      </div>
    </div>
  );
}

function ListPanel({
  title,
  hint,
  empty,
  emptyBody,
  actionHref,
  actionLabel,
  count,
  children,
  className,
}: {
  title: string;
  hint: string;
  empty: string;
  emptyBody: string;
  actionHref: string;
  actionLabel: string;
  count: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`crm-leads-panel${className ? ` ${className}` : ""}`}>
      <div className="crm-leads-panel-head">
        <div>
          <h2>
            {title}
            {count ? <span className="crm-leads-count">{count}</span> : null}
          </h2>
          <p>{hint}</p>
        </div>
        <Link href={actionHref} className="crm-leads-panel-link">
          {actionLabel}
        </Link>
      </div>
      {count === 0 ? (
        <EmptyState title={empty} body={emptyBody} compact />
      ) : (
        <ul className="crm-leads-simple-list">{children}</ul>
      )}
    </section>
  );
}

function TaskPanel({
  title,
  hint,
  tone,
  items,
  empty,
  emptyBody,
}: {
  title: string;
  hint: string;
  tone: "overdue" | "today";
  items: {
    id: string;
    title: string;
    dueAt: Date;
    lead: { id: string; contactName: string; businessName: string; formName?: string };
  }[];
  empty: string;
  emptyBody: string;
}) {
  return (
    <section className={`crm-leads-panel${tone === "overdue" && items.length ? " is-overdue" : ""}`}>
      <div className="crm-leads-panel-head">
        <div>
          <h2>
            {title}
            {items.length ? <span className="crm-leads-count">{items.length}</span> : null}
          </h2>
          <p>{hint}</p>
        </div>
        {items.length ? (
          <Link href="/crm/activities" className="crm-leads-panel-link">
            ดูทั้งหมด
          </Link>
        ) : null}
      </div>
      {items.length === 0 ? (
        <EmptyState title={empty} body={emptyBody} compact />
      ) : (
        <ul className="crm-leads-task-list">
          {items.map((item) => (
            <li key={item.id} className={`crm-leads-task${tone === "overdue" ? " is-overdue" : ""}`}>
              <div className="crm-leads-task-top">
                <div>
                  <Link href={`/crm/leads/${item.lead.id}`} className="crm-leads-task-name">
                    {item.lead.contactName}
                  </Link>
                  <p className="crm-leads-task-biz">
                    {item.lead.businessName || item.lead.formName || "ไม่มีชื่อกิจการ"}
                  </p>
                  <p className="crm-leads-task-meta">
                    {item.title}
                    <span> · {formatThaiDateTime(item.dueAt)}</span>
                  </p>
                </div>
                <StatusBadge
                  label={tone === "overdue" ? "เกินกำหนด" : "วันนี้"}
                  tone={tone === "overdue" ? "danger" : "warning"}
                />
              </div>
              <form action={completeActivity} className="crm-leads-task-form">
                <input type="hidden" name="activityId" value={item.id} />
                <label className="crm-leads-task-field">
                  <span className="sr-only">ผลลัพธ์การติดตาม</span>
                  <input className="crm-field" name="outcome" placeholder="ผลลัพธ์การติดตาม" />
                </label>
                <label className="crm-leads-task-field">
                  <span className="sr-only">วันเวลานัดติดตามครั้งถัดไป</span>
                  <input className="crm-field" type="datetime-local" name="nextDueAt" />
                </label>
                <label className="crm-leads-task-field">
                  <span className="sr-only">ชื่อนัดติดตามครั้งถัดไป</span>
                  <input className="crm-field" name="nextTitle" placeholder="นัดติดตามครั้งถัดไป" />
                </label>
                <button className="kpi-button crm-users-primary" type="submit">
                  ปิดแล้วตั้งติดตามต่อ
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
