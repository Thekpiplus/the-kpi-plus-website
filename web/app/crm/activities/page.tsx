import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { completeActivity } from "@/lib/crm/actions";
import { ACTIVITY_LABEL } from "@/lib/crm/constants";
import { formatThaiDateTime, openActivities } from "@/lib/crm/queries";

export default async function ActivitiesPage() {
  const items = await openActivities();
  const now = Date.now();
  const overdue = items.filter((item) => item.dueAt.getTime() < now).length;
  const upcoming = items.length - overdue;

  return (
    <div className="crm-leads">
      <PageHeader
        eyebrow="Lead Management"
        title="กิจกรรมที่ต้องทำ"
        description="คิวกิจกรรมเปิดอยู่ เรียงตามกำหนด เพื่อให้ทีมติดตามได้ทัน"
        actions={
          <div className="crm-leads-actions">
            <Link href="/crm/sales" className="crm-users-secondary">
              งานวันนี้
            </Link>
            <NewLeadOpenButton className="kpi-button">คีย์ลีด</NewLeadOpenButton>
          </div>
        }
      />

      <section className="crm-leads-stats" aria-label="สรุปกิจกรรม">
        <div className="crm-leads-stat">
          <p>เปิดอยู่ทั้งหมด</p>
          <strong>{items.length}</strong>
        </div>
        <div className="crm-leads-stat is-overdue">
          <p>เกินกำหนด</p>
          <strong>{overdue}</strong>
        </div>
        <div className="crm-leads-stat is-today">
          <p>ยังไม่ถึงกำหนด</p>
          <strong>{upcoming}</strong>
        </div>
      </section>

      <section className="crm-leads-panel">
        <div className="crm-leads-panel-head">
          <div>
            <h2>คิวกิจกรรม</h2>
            <p>ปิดงานแล้วตั้งนัดติดตามครั้งถัดไปได้ทันที</p>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState title="ไม่มีกิจกรรมค้าง" body="เมื่อมีนัดติดตามหรืองานติดตาม จะแสดงที่นี่" />
        ) : (
          <ul className="crm-leads-task-list">
            {items.map((item) => {
              const isOverdue = item.dueAt.getTime() < now;
              return (
                <li key={item.id} className={`crm-leads-task${isOverdue ? " is-overdue" : ""}`}>
                  <div className="crm-leads-task-top">
                    <div>
                      <Link href={`/crm/leads/${item.lead.id}`} className="crm-leads-task-name">
                        {item.lead.contactName}
                      </Link>
                      <p className="crm-leads-task-meta">
                        {item.lead.businessName || item.lead.formName || "ไม่มีชื่อกิจการ"}
                        <span>
                          · {ACTIVITY_LABEL[item.type as keyof typeof ACTIVITY_LABEL] ?? item.type} · {item.title} ·{" "}
                          {formatThaiDateTime(item.dueAt)}
                        </span>
                      </p>
                    </div>
                    <StatusBadge
                      label={isOverdue ? "เกินกำหนด" : "เปิดอยู่"}
                      tone={isOverdue ? "danger" : "warning"}
                    />
                  </div>
                  <form action={completeActivity} className="crm-leads-task-form">
                    <input type="hidden" name="activityId" value={item.id} />
                    <input className="crm-field" name="outcome" placeholder="ผลลัพธ์" />
                    <input className="crm-field" type="datetime-local" name="nextDueAt" />
                    <input className="crm-field" name="nextTitle" placeholder="กิจกรรมถัดไป" />
                    <button className="kpi-button" type="submit">
                      ปิดกิจกรรม
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
