import Link from "next/link";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { completeActivity } from "@/lib/crm/actions";
import { formatThaiDateTime, leadOriginCounts, todayLists } from "@/lib/crm/queries";
import { sourceLabel } from "@/lib/crm/sources";

export default async function SalesHomePage() {
  const [lists, origins] = await Promise.all([todayLists(), leadOriginCounts()]);
  const dueToday = lists.dueToday.length;
  const overdue = lists.overdue.length;

  return (
    <div className="crm-leads">
      <PageHeader
        eyebrow="Lead Management"
        title="งานวันนี้"
        description="ติดตามงานขายวันนี้ ลีดจากเว็บและลีดที่คีย์เองอยู่ในคิวเดียวกัน"
        actions={
          <div className="crm-leads-actions">
            <Link href="/crm/pipeline" className="crm-users-secondary">
              Pipeline
            </Link>
            <NewLeadOpenButton className="kpi-button">คีย์ลีด</NewLeadOpenButton>
          </div>
        }
      />

      <section className="crm-leads-stats" aria-label="สรุป Lead">
        <Link href="/crm/leads?origin=web" className="crm-leads-stat is-web">
          <p>ลีดจากเว็บไซต์</p>
          <strong>{origins.web}</strong>
        </Link>
        <Link href="/crm/leads?origin=manual" className="crm-leads-stat is-manual">
          <p>ลีดที่คีย์เอง</p>
          <strong>{origins.manual}</strong>
        </Link>
        <div className="crm-leads-stat is-today">
          <p>ครบกำหนดวันนี้</p>
          <strong>{dueToday}</strong>
        </div>
        <Link href="/crm/activities" className="crm-leads-stat is-overdue">
          <p>เกินกำหนด</p>
          <strong>{overdue}</strong>
        </Link>
      </section>

      <section className="crm-leads-toolbar">
        <form className="crm-leads-search" method="get" action="/crm/leads">
          <label className="crm-leads-search-field">
            <span className="sr-only">ค้นหาลีด</span>
            <span aria-hidden="true">⌕</span>
            <input name="q" placeholder="ค้นหาชื่อ กิจการ เบอร์ หรืออีเมล" />
          </label>
          <button className="kpi-button" type="submit">
            ค้นหา
          </button>
        </form>
        <div className="crm-leads-quick">
          <Link href="/crm/leads">ลีดทั้งหมด</Link>
          <Link href="/crm/leads?origin=web">จากเว็บ</Link>
          <Link href="/crm/leads?origin=manual">คีย์เอง</Link>
          <Link href="/crm/activities">กิจกรรม</Link>
        </div>
      </section>

      <div className="crm-leads-boards">
        <TaskPanel
          title="เกินกำหนด"
          hint="ต้องติดตามก่อน"
          tone="overdue"
          items={lists.overdue}
          empty="ไม่มีงานเกินกำหนด"
        />
        <TaskPanel
          title="ครบกำหนดวันนี้"
          hint="คิวงานวันนี้"
          tone="today"
          items={lists.dueToday}
          empty="ไม่มีงานครบกำหนดวันนี้"
        />
      </div>

      <div className="crm-leads-boards">
        <ListPanel
          title="ลีดใหม่ที่รอตอบ"
          hint="ควรตอบกลับครั้งแรก"
          empty="ไม่มีลีดรอตอบ"
          actionHref="/crm/leads?origin=web"
          actionLabel="ดูลีดจากเว็บ"
          count={lists.firstResponse.length}
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

        <ListPanel
          title="ยังไม่มีกิจกรรมถัดไป"
          hint="ตั้งนัดติดตามต่อ"
          empty="ลีดทุกตัวมีกิจกรรมถัดไปแล้ว"
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
      </div>
    </div>
  );
}

function ListPanel({
  title,
  hint,
  empty,
  actionHref,
  actionLabel,
  count,
  children,
}: {
  title: string;
  hint: string;
  empty: string;
  actionHref: string;
  actionLabel: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section className="crm-leads-panel">
      <div className="crm-leads-panel-head">
        <div>
          <h2>{title}</h2>
          <p>{hint}</p>
        </div>
        <Link href={actionHref} className="crm-leads-panel-link">
          {actionLabel}
        </Link>
      </div>
      {count === 0 ? <EmptyState title={empty} /> : <ul className="crm-leads-simple-list">{children}</ul>}
    </section>
  );
}

function TaskPanel({
  title,
  hint,
  tone,
  items,
  empty,
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
      </div>
      {items.length === 0 ? (
        <EmptyState title={empty} />
      ) : (
        <ul className="crm-leads-task-list">
          {items.map((item) => (
            <li key={item.id} className={`crm-leads-task${tone === "overdue" ? " is-overdue" : ""}`}>
              <div className="crm-leads-task-top">
                <div>
                  <Link href={`/crm/leads/${item.lead.id}`} className="crm-leads-task-name">
                    {item.lead.contactName}
                  </Link>
                  <p className="crm-leads-task-meta">
                    {item.title}
                    <span>· {formatThaiDateTime(item.dueAt)}</span>
                  </p>
                </div>
                <StatusBadge
                  label={tone === "overdue" ? "เกินกำหนด" : "วันนี้"}
                  tone={tone === "overdue" ? "danger" : "warning"}
                />
              </div>
              <form action={completeActivity} className="crm-leads-task-form">
                <input type="hidden" name="activityId" value={item.id} />
                <input className="crm-field" name="outcome" placeholder="ผลลัพธ์การติดตาม" />
                <input className="crm-field" type="datetime-local" name="nextDueAt" />
                <input className="crm-field" name="nextTitle" placeholder="นัดติดตามครั้งถัดไป" />
                <button className="kpi-button" type="submit">
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
