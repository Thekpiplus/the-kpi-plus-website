import Link from "next/link";
import { requireUser } from "@/lib/crm/auth";
import { leadOriginCounts, todayLists, userCounts } from "@/lib/crm/queries";
import { hasModule } from "@/lib/crm/modules";
import { partnerOverview } from "@/lib/partners/queries";
import { cmsOverview } from "@/lib/cms/queries";
import { adsOpsOverview } from "@/lib/ads-ops/queries";
import { b2bOpsOverview } from "@/lib/b2b-ops/queries";
import { reservationOpsOverview } from "@/lib/reservations-ops/queries";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { ModuleCard } from "@/components/crm/ui/ModuleCard";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { roleLabel } from "@/lib/crm/roles";

export default async function AdminHomePage() {
  const user = await requireUser();
  const [lists, origins, partners, users, cms, reservations, b2b, ads] = await Promise.all([
    todayLists(),
    leadOriginCounts(),
    partnerOverview().catch(() => ({
      applications: 0,
      referrals: 0,
      commissions: 0,
      payouts: 0,
      overdue: 0,
    })),
    userCounts(),
    cmsOverview().catch(() => ({ pages: 0, insights: 0, drafts: 0, media: 0 })),
    reservationOpsOverview().catch(() => ({ open: 0, due: 0, escalated: 0 })),
    b2bOpsOverview(user).catch(() => ({ total: 0, active: 0, due: 0, pendingRates: 0 })),
    adsOpsOverview(user).catch(() => ({ total: 0, live: 0, due: 0 })),
  ]);

  const dueToday = lists.dueToday.length + lists.overdue.length;
  const overdueCount = lists.overdue.length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "สวัสดีตอนเช้า" : hour < 18 ? "สวัสดีตอนบ่าย" : "สวัสดีตอนเย็น";

  const modules = [
    hasModule(user, "leads")
      ? {
          href: "/crm/sales",
          accent: "leads" as const,
          icon: "◎",
          category: "LEAD",
          title: "Lead Management",
          body: "ติดตามลีด คัดกรอง และดู Pipeline",
          stats: [
            { label: "วันนี้", value: dueToday },
            { label: "ทั้งหมด", value: origins.web + origins.manual },
            { label: "ต้องติดตาม", value: overdueCount },
          ],
          cta: "เปิด Lead Management",
        }
      : null,
    hasModule(user, "partners")
      ? {
          href: "/crm/partners",
          accent: "partners" as const,
          icon: "◈",
          category: "PARTNER",
          title: "Partner Management",
          body: "อนุมัติพาร์ตเนอร์และติดตามค่าคอมมิชชัน",
          stats: [
            { label: "รออนุมัติ", value: partners.applications },
            { label: "ค่าคอม", value: partners.commissions },
            { label: "รอจ่าย", value: partners.payouts + partners.overdue },
          ],
          cta: "เปิด Partner Management",
        }
      : null,
    hasModule(user, "reservations")
      ? {
          href: "/crm/reservations",
          accent: "reservations" as const,
          icon: "▣",
          category: "RESERVATIONS",
          title: "Reservation Operations",
          body: "คิว Inquiry, Booking, Modification, Cancellation และ Confirmation",
          stats: [
            { label: "เปิดอยู่", value: reservations.open },
            { label: "ครบกำหนด", value: reservations.due },
            { label: "Escalated", value: reservations.escalated },
          ],
          cta: "เปิดคิวงานจอง",
        }
      : null,
    hasModule(user, "b2b")
      ? {
          href: "/crm/b2b",
          accent: "b2b" as const,
          icon: "▦",
          category: "B2B",
          title: "B2B Sales Operations",
          body: "Pipeline พาร์ตเนอร์ท่องเที่ยว เรท และงานติดตามภายใน",
          stats: [
            { label: "พาร์ตเนอร์", value: b2b.total },
            { label: "Active", value: b2b.active },
            { label: "ติดตาม", value: b2b.due },
          ],
          cta: "เปิด B2B Sales Operations",
        }
      : null,
    hasModule(user, "ads")
      ? {
          href: "/crm/ads",
          accent: "ads" as const,
          icon: "▣",
          category: "ADS",
          title: "Google Ads Operations",
          body: "บอร์ดแคมเปญ Search Ads, Hotel Ads และ Free Booking Links ภายใน",
          stats: [
            { label: "แคมเปญ", value: ads.total },
            { label: "Active", value: ads.live },
            { label: "ติดตาม", value: ads.due },
          ],
          cta: "เปิด Google Ads Operations",
        }
      : null,
    hasModule(user, "users")
      ? {
          href: "/crm/users",
          accent: "users" as const,
          icon: "◉",
          category: "USERS",
          title: "Users Management",
          body: "จัดการผู้ใช้และสิทธิ์การเข้าถึงระบบ",
          stats: [
            { label: "ทีม", value: users.staff },
            { label: "Partner", value: users.partners },
            { label: "ทั้งหมด", value: users.total },
          ],
          cta: "เปิด Users Management",
        }
      : null,
    hasModule(user, "cms")
      ? {
          href: "/crm/cms",
          accent: "cms" as const,
          icon: "▤",
          category: "CONTENT",
          title: "Content Management",
          body: "จัดการหน้า บทความ และสื่อบนเว็บไซต์",
          stats: [
            { label: "Pages", value: cms.pages },
            { label: "Articles", value: cms.insights },
            { label: "Drafts", value: cms.drafts },
          ],
          cta: "เปิด Content Management",
        }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    accent: "leads" | "partners" | "reservations" | "b2b" | "users" | "cms";
    icon: string;
    category: string;
    title: string;
    body: string;
    stats: Array<{ label: string; value: number }>;
    cta: string;
  }>;

  type DashTask = {
    title: string;
    meta: string;
    priority: "urgent" | "medium" | "low";
    href: string;
  };

  const tasks: DashTask[] = [
    ...lists.overdue.slice(0, 3).map((item) => ({
      title: item.lead.businessName || item.lead.contactName || item.title,
      meta: "เกินกำหนด",
      priority: "urgent" as const,
      href: `/crm/leads/${item.leadId}`,
    })),
    ...lists.dueToday.slice(0, 3).map((item) => ({
      title: item.lead.businessName || item.lead.contactName || item.title,
      meta: "วันนี้",
      priority: "medium" as const,
      href: `/crm/leads/${item.leadId}`,
    })),
  ].slice(0, 5);

  if (hasModule(user, "cms") && cms.drafts > 0 && tasks.length < 5) {
    tasks.push({
      title: `ตรวจบทความฉบับร่าง ${cms.drafts} รายการ`,
      meta: "CMS",
      priority: "low",
      href: "/crm/cms/insights",
    });
  }

  if (hasModule(user, "partners") && partners.applications > 0 && tasks.length < 5) {
    tasks.push({
      title: `อนุมัติพาร์ตเนอร์ ${partners.applications} รายการ`,
      meta: "Partners",
      priority: "medium",
      href: "/crm/partners/list",
    });
  }

  if (hasModule(user, "b2b") && b2b.due > 0 && tasks.length < 5) {
    tasks.push({
      title: `ติดตามพาร์ตเนอร์ ${b2b.due} รายการ`,
      meta: "B2B",
      priority: "medium",
      href: "/crm/b2b/activities",
    });
  }

  if (hasModule(user, "reservations") && reservations.escalated > 0 && tasks.length < 5) {
    tasks.push({
      title: `งานจองที่ส่งต่อ ${reservations.escalated} รายการ`,
      meta: "Reservations",
      priority: "urgent",
      href: "/crm/reservations?status=escalated",
    });
  }

  const activity = [
    origins.web > 0
      ? { title: "มีลีดใหม่จากเว็บไซต์", meta: `${origins.web} รายการ`, tone: "leads" as const }
      : null,
    overdueCount > 0
      ? { title: "มีงานติดตามที่เกินกำหนด", meta: `${overdueCount} รายการ`, tone: "leads" as const }
      : null,
    partners.applications > 0
      ? { title: "คำขอพาร์ตเนอร์รออนุมัติ", meta: `${partners.applications} รายการ`, tone: "partners" as const }
      : null,
    cms.drafts > 0
      ? { title: "มีบทความฉบับร่าง", meta: `${cms.drafts} รายการ`, tone: "cms" as const }
      : null,
    reservations.escalated > 0
      ? { title: "งานจองที่ต้องส่งต่อโรงแรม", meta: `${reservations.escalated} รายการ`, tone: "reservations" as const }
      : null,
    b2b.due > 0
      ? { title: "มีงานติดตามพาร์ตเนอร์ครบกำหนด", meta: `${b2b.due} รายการ`, tone: "b2b" as const }
      : null,
    users.total > 0
      ? { title: `ผู้ใช้ในระบบ ${users.total} คน`, meta: "Users", tone: "users" as const }
      : null,
  ].filter(Boolean) as Array<{ title: string; meta: string; tone: "leads" | "partners" | "reservations" | "b2b" | "users" | "cms" }>;

  const priorityLabel = {
    urgent: "ด่วน",
    medium: "ปานกลาง",
    low: "ทั่วไป",
  };

  return (
    <div className="crm-dash">
      <section className="crm-dash-hero">
        <div className="crm-dash-hero-copy">
          <div className="crm-dash-hero-meta">
            <p className="crm-dash-kicker">Admin Workspace</p>
            <span className="crm-dash-role">{roleLabel(user.role)}</span>
          </div>
          <h1 className="crm-dash-hero-title">
            {greeting}, {user.name || "ทีม KPI Plus"}
          </h1>
          <p className="crm-dash-hero-lead">เลือกเมนูหรือจัดการงานสำคัญได้จากพื้นที่เดียว</p>
          <div className="crm-dash-hero-actions">
            {hasModule(user, "leads") ? (
              <Link href="/crm/sales" className="crm-dash-btn crm-dash-btn-lime">
                งานวันนี้
                {dueToday > 0 ? <span className="crm-dash-btn-count">{dueToday}</span> : null}
              </Link>
            ) : null}
            {hasModule(user, "cms") ? (
              <Link href="/crm/cms/insights/new" className="crm-dash-btn crm-dash-btn-navy">
                สร้างเนื้อหาใหม่
              </Link>
            ) : hasModule(user, "leads") ? (
              <NewLeadOpenButton className="crm-dash-btn crm-dash-btn-navy">คีย์ลีดใหม่</NewLeadOpenButton>
            ) : null}
          </div>
        </div>

        <aside className="crm-dash-hero-card" aria-label="สรุปงานวันนี้">
          <div className="crm-dash-hero-card-head">
            <div>
              <p className="crm-dash-hero-card-label">งานค้างวันนี้</p>
              <p className="crm-dash-hero-card-hint">จากคิวติดตามจริงในระบบ</p>
            </div>
            <span className={`crm-dash-hero-card-pulse${dueToday > 0 ? " is-hot" : ""}`}>
              {dueToday > 0 ? "ต้องทำ" : "ว่าง"}
            </span>
          </div>

          <div className="crm-dash-hero-card-main">
            <p className="crm-dash-hero-card-value">{dueToday}</p>
            <p className="crm-dash-hero-card-unit">รายการ</p>
          </div>

          <div className="crm-dash-hero-card-split">
            <div className="crm-dash-hero-stat is-today">
              <strong>{lists.dueToday.length}</strong>
              <span>วันนี้</span>
            </div>
            <div className="crm-dash-hero-stat is-overdue">
              <strong>{overdueCount}</strong>
              <span>เกินกำหนด</span>
            </div>
          </div>

          {hasModule(user, "leads") ? (
            <Link href="/crm/sales" className="crm-dash-hero-card-link">
              เปิดงานวันนี้
              <span aria-hidden="true">→</span>
            </Link>
          ) : null}
        </aside>
      </section>

      <section className="crm-dash-modules" aria-label="จัดการโมดูล">
        <div className="crm-dash-section-head">
          <h2>จัดการโมดูล</h2>
          <p>แสดงเฉพาะโมดูลที่บัญชีนี้เข้าถึงได้</p>
        </div>
        {modules.length ? (
          <div className="crm-dash-module-grid">
            {modules.map((module) => (
              <ModuleCard key={module.href} {...module} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="ยังไม่มีโมดูลที่เข้าได้"
            body="ติดต่อ Superadmin เพื่อเปิดสิทธิ์ Lead / Partner / Reservations / B2B / Users / CMS"
          />
        )}
      </section>

      <section className="crm-dash-bottom">
        <article className="crm-dash-panel">
          <div className="crm-dash-section-head">
            <h2>กิจกรรมล่าสุดในระบบ</h2>
            <p>สรุปจากข้อมูลที่มีในระบบตอนนี้</p>
          </div>
          {activity.length ? (
            <ul className="crm-dash-activity">
              {activity.map((item) => (
                <li key={item.title} className={`is-${item.tone}`}>
                  <span className="crm-dash-activity-dot" aria-hidden="true" />
                  <div>
                    <p className="crm-dash-activity-title">{item.title}</p>
                    <p className="crm-dash-activity-meta">{item.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="ยังไม่มีกิจกรรมล่าสุด" body="เมื่อมีลีด พาร์ตเนอร์ หรือเนื้อหาใหม่ จะแสดงที่นี่" />
          )}
        </article>

        <article className="crm-dash-panel">
          <div className="crm-dash-section-head crm-dash-section-head-row">
            <div>
              <h2>
                งานที่ต้องดำเนินการ
                {dueToday > 0 ? <span className="crm-dash-count">{dueToday}</span> : null}
              </h2>
              <p>จากกิจกรรมและคิวงานจริง</p>
            </div>
          </div>
          {tasks.length ? (
            <ul className="crm-dash-tasks">
              {tasks.map((task) => (
                <li key={`${task.href}-${task.title}`}>
                  <div className="crm-dash-task">
                    <span className={`crm-dash-task-mark is-${task.priority}`} aria-hidden="true" />
                    <span>
                      <strong>{task.title}</strong>
                      <em>{task.meta}</em>
                    </span>
                    <b className={`crm-dash-priority is-${task.priority}`}>{priorityLabel[task.priority]}</b>
                  </div>
                  <Link href={task.href} className="crm-dash-task-link">
                    เปิด
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="ไม่มีงานค้างตอนนี้"
              body="เมื่อมีกิจกรรมครบกำหนดหรือเกินกำหนด จะแสดงที่นี่"
              action={
                hasModule(user, "leads") ? (
                  <NewLeadOpenButton className="kpi-button">คีย์ลีดใหม่</NewLeadOpenButton>
                ) : null
              }
            />
          )}
        </article>
      </section>
    </div>
  );
}
