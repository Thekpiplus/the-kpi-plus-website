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
    <div className="crm-leads crm-leads-page crm-sales-today">
      <PageHeader
        eyebrow="Lead Management"
        title="งานวันนี้"
        description="คิวติดตามของวันนี้ ลีดจากเว็บและลีดที่คีย์เองอยู่ในคิวเดียวกัน เริ่มจากงานเกินกำหนดก่อน"
        actions={
          <div className="crm-leads-actions">
            <Link href="/crm/pipeline" className="crm-users-secondary">
              Pipeline
            </Link>
            <NewLeadOpenButton className="kpi-button">คีย์ลีด</NewLeadOpenButton>
          </div>
        }
      />

      <section className="crm-sales-summary" aria-label="สรุป Lead วันนี้">
        <div className="crm-leads-stats" role="list">
          <Link href="/crm/leads?origin=web" className="crm-leads-stat is-web" role="listitem">
            <span className="crm-leads-stat-label">ลีดจากเว็บไซต์</span>
            <strong className="crm-leads-stat-value">{origins.web}</strong>
            <span className="crm-leads-stat-hint">เปิดรายการจากเว็บ</span>
          </Link>
          <Link href="/crm/leads?origin=manual" className="crm-leads-stat is-manual" role="listitem">
            <span className="crm-leads-stat-label">ลีดที่คีย์เอง</span>
            <strong className="crm-leads-stat-value">{origins.manual}</strong>
            <span className="crm-leads-stat-hint">เปิดรายการที่คีย์เอง</span>
          </Link>
          <div className="crm-leads-stat is-today is-static" role="listitem" aria-current="true">
            <span className="crm-leads-stat-label">ครบกำหนดวันนี้</span>
            <strong className="crm-leads-stat-value">{dueToday}</strong>
            <span className="crm-leads-stat-hint">สรุปจากคิวด้านล่าง</span>
          </div>
          <Link href="/crm/activities" className="crm-leads-stat is-overdue" role="listitem">
            <span className="crm-leads-stat-label">เกินกำหนด</span>
            <strong className="crm-leads-stat-value">{overdue}</strong>
            <span className="crm-leads-stat-hint">เปิดคิวกิจกรรม</span>
          </Link>
        </div>
      </section>

      <section className="crm-leads-toolbar crm-sales-toolbar" aria-label="ค้นหาและทางลัดลีด">
        <form className="crm-leads-search" method="get" action="/crm/leads">
          <label className="crm-leads-search-field">
            <span className="sr-only">ค้นหาลีดจากชื่อ กิจการ เบอร์ หรืออีเมล</span>
            <span aria-hidden="true">⌕</span>
            <input name="q" placeholder="ค้นหาชื่อ กิจการ เบอร์ หรืออีเมล" autoComplete="off" />
          </label>
          <button className="kpi-button" type="submit">
            ค้นหา
          </button>
        </form>
        <nav className="crm-leads-quick" aria-label="ทางลัดรายการลีด">
          <Link href="/crm/leads">ลีดทั้งหมด</Link>
          <Link href="/crm/leads?origin=web">จากเว็บ</Link>
          <Link href="/crm/leads?origin=manual">คีย์เอง</Link>
          <Link href="/crm/activities">กิจกรรม</Link>
        </nav>
      </section>

      <div className="crm-sales-priority" aria-label="คิวงานตามความเร่งด่วน">
        <div className="crm-leads-boards">
          <TaskPanel
            title="เกินกำหนด"
            hint="ต้องติดตามก่อน — งานที่เลยวันกำหนดแล้ว"
            tone="overdue"
            items={lists.overdue}
            empty="ไม่มีงานเกินกำหนด"
            emptyBody="เมื่อมีกิจกรรมเลยวันกำหนด จะแสดงที่นี่เพื่อให้ทีมปิดงานก่อน"
          />
          <TaskPanel
            title="ครบกำหนดวันนี้"
            hint="คิวงานวันนี้ — ติดตามภายในวันนี้"
            tone="today"
            items={lists.dueToday}
            empty="ไม่มีงานครบกำหนดวันนี้"
            emptyBody="ยังไม่มีกิจกรรมที่ครบกำหนดวันนี้ เมื่อมีนัดติดตามจะแสดงที่นี่"
          />
        </div>

        <div className="crm-leads-boards">
          <ListPanel
            title="ลีดใหม่ที่รอตอบ"
            hint="ควรตอบกลับครั้งแรกให้เร็ว"
            empty="ไม่มีลีดรอตอบ"
            emptyBody="ลีดที่ต้องตอบกลับครั้งแรกจะแสดงที่นี่"
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
            hint="ตั้งนัดติดตามต่อให้ลีดเหล่านี้"
            empty="ลีดทุกตัวมีกิจกรรมถัดไปแล้ว"
            emptyBody="ไม่มีลีดที่ขาดนัดติดตามถัดไปในขณะนี้"
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
}: {
  title: string;
  hint: string;
  empty: string;
  emptyBody: string;
  actionHref: string;
  actionLabel: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <section className="crm-leads-panel">
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
        <EmptyState title={empty} body={emptyBody} />
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
        <EmptyState title={empty} body={emptyBody} />
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
