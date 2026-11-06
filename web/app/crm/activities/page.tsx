import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { OverviewHero } from "@/components/crm/ui/OverviewHero";
import { PendingSubmitButton } from "@/components/crm/ui/PendingSubmitButton";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { completeActivity } from "@/lib/crm/actions";
import { ACTIVITY_LABEL } from "@/lib/crm/constants";
import { formatThaiDateTime, openActivities } from "@/lib/crm/queries";

type ActivityView = "all" | "overdue" | "upcoming";

function activitiesHref(view: ActivityView) {
  return view === "all" ? "/crm/activities" : `/crm/activities?view=${view}`;
}

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const params = await searchParams;
  const view: ActivityView =
    params.view === "overdue" || params.view === "upcoming" ? params.view : "all";
  const items = await openActivities();
  const now = Date.now();
  const overdueItems = items.filter((item) => item.dueAt.getTime() < now);
  const upcomingItems = items.filter((item) => item.dueAt.getTime() >= now);
  const overdue = overdueItems.length;
  const upcoming = upcomingItems.length;
  const visible =
    view === "overdue" ? overdueItems : view === "upcoming" ? upcomingItems : items;
  const viewLabel =
    view === "overdue" ? "เกินกำหนด" : view === "upcoming" ? "ยังไม่ถึงกำหนด" : "ทั้งหมดที่เปิดอยู่";

  return (
    <div className="crm-leads crm-leads-page crm-activities">
      <OverviewHero
        variant="compact"
        eyebrow="Lead Management · กิจกรรม"
        badge={
          <span className={`crm-hero-badge${overdue > 0 ? " is-alert" : ""}`}>
            {items.length > 0 ? `เปิดอยู่ ${items.length}` : "คิวว่าง"}
          </span>
        }
        title="กิจกรรมที่ต้องทำ"
        description="คิวติดตามลีดที่เปิดอยู่ เรียงตามวันกำหนด — บันทึกผลแล้วตั้งนัดครั้งถัดไปได้จากรายการ"
        label="กิจกรรมที่ต้องทำ"
        actions={
          <>
            <NewLeadOpenButton className="crm-hero-btn crm-hero-btn-primary">คีย์ลีด</NewLeadOpenButton>
            <Link href="/crm/sales" className="crm-hero-btn crm-hero-btn-secondary">
              งานวันนี้
            </Link>
            <Link href="/crm/pipeline" className="crm-hero-btn crm-hero-btn-secondary">
              Pipeline
            </Link>
          </>
        }
      />

      <section className="crm-activities-summary" aria-label="สรุปกิจกรรม">
        <div className="crm-leads-stats crm-activities-stats" role="list">
          <Link
            href={activitiesHref("all")}
            className={`crm-leads-stat is-today is-priority${view === "all" ? " is-selected" : ""}`}
            role="listitem"
            aria-current={view === "all" ? "page" : undefined}
          >
            <span className="crm-leads-stat-label">เปิดอยู่ทั้งหมด</span>
            <strong className="crm-leads-stat-value">{items.length}</strong>
            <span className="crm-leads-stat-hint">คิวที่ยังไม่ปิด</span>
          </Link>
          <Link
            href={activitiesHref("overdue")}
            className={`crm-leads-stat is-overdue is-priority${view === "overdue" ? " is-selected" : ""}`}
            role="listitem"
            aria-current={view === "overdue" ? "page" : undefined}
          >
            <span className="crm-leads-stat-label">เกินกำหนด</span>
            <strong className="crm-leads-stat-value">{overdue}</strong>
            <span className="crm-leads-stat-hint">ควรติดตามก่อน</span>
          </Link>
          <Link
            href={activitiesHref("upcoming")}
            className={`crm-leads-stat is-manual is-priority${view === "upcoming" ? " is-selected" : ""}`}
            role="listitem"
            aria-current={view === "upcoming" ? "page" : undefined}
          >
            <span className="crm-leads-stat-label">ยังไม่ถึงกำหนด</span>
            <strong className="crm-leads-stat-value">{upcoming}</strong>
            <span className="crm-leads-stat-hint">มีวันกำหนดแล้ว</span>
          </Link>
        </div>
      </section>

      <section className="crm-leads-panel crm-activities-panel" aria-labelledby="crm-activities-list-heading">
        <div className="crm-leads-panel-head">
          <div>
            <h2 id="crm-activities-list-heading">
              คิวกิจกรรม
              <span className="crm-leads-count" title="จำนวนรายการที่แสดงตามตัวกรองปัจจุบัน">
                {visible.length}
              </span>
            </h2>
            <p>
              แสดง {visible.length} รายการ · {viewLabel}
              {view !== "all" ? " · กด “เปิดอยู่ทั้งหมด” เพื่อดูคิวเต็ม" : ""}
            </p>
          </div>
          {view !== "all" ? (
            <Link href={activitiesHref("all")} className="crm-leads-panel-link">
              ล้างตัวกรอง
            </Link>
          ) : null}
        </div>

        {items.length === 0 ? (
          <EmptyState
            compact
            title="ไม่มีกิจกรรมค้าง"
            body="เมื่อมีนัดติดตามหรืองานติดตามของลีด จะแสดงที่นี่"
            action={
              <Link href="/crm/sales" className="crm-users-secondary">
                ไปงานวันนี้
              </Link>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            compact
            filtered
            title="ไม่มีรายการในกลุ่มนี้"
            body="ลองดูคิวทั้งหมด หรือเลือกกลุ่มอื่นจากการ์ดสรุปด้านบน"
            action={
              <Link href={activitiesHref("all")} className="crm-users-secondary">
                ดูทั้งหมดที่เปิดอยู่
              </Link>
            }
          />
        ) : (
          <ul className="crm-leads-task-list crm-activities-list">
            {visible.map((item) => {
              const isOverdue = item.dueAt.getTime() < now;
              const typeLabel = ACTIVITY_LABEL[item.type as keyof typeof ACTIVITY_LABEL] ?? item.type;
              return (
                <li key={item.id} className={`crm-leads-task crm-activities-item${isOverdue ? " is-overdue" : ""}`}>
                  <div className="crm-leads-task-top">
                    <div>
                      <Link href={`/crm/leads/${item.lead.id}`} className="crm-leads-task-name">
                        {item.lead.contactName}
                      </Link>
                      <p className="crm-leads-task-biz">
                        {item.lead.businessName || item.lead.formName || "ไม่มีชื่อกิจการ"}
                      </p>
                      <p className="crm-leads-task-meta">
                        <span className="crm-activities-type">{typeLabel}</span>
                        <span> · {item.title}</span>
                        <span> · กำหนด {formatThaiDateTime(item.dueAt)}</span>
                      </p>
                    </div>
                    <StatusBadge
                      label={isOverdue ? "เกินกำหนด" : "เปิดอยู่"}
                      tone={isOverdue ? "danger" : "warning"}
                    />
                  </div>

                  <form action={completeActivity} className="crm-leads-task-form crm-activities-form">
                    <input type="hidden" name="activityId" value={item.id} />
                    <div className="crm-leads-task-fields">
                      <label className="crm-leads-task-field">
                        <span>บันทึกผล</span>
                        <input
                          className="crm-field"
                          name="outcome"
                          placeholder="เช่น คุยแล้ว นัดส่งใบเสนอราคา"
                          autoComplete="off"
                        />
                      </label>
                      <label className="crm-leads-task-field">
                        <span>นัดครั้งถัดไป</span>
                        <input className="crm-field" type="datetime-local" name="nextDueAt" />
                      </label>
                      <label className="crm-leads-task-field">
                        <span>กิจกรรมถัดไป</span>
                        <input
                          className="crm-field"
                          name="nextTitle"
                          placeholder="เช่น โทรติดตาม / ส่งข้อเสนอ"
                          autoComplete="off"
                        />
                      </label>
                    </div>
                    <PendingSubmitButton className="kpi-button crm-users-primary crm-leads-task-submit">
                      บันทึกกิจกรรม
                    </PendingSubmitButton>
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
