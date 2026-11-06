import Link from "next/link";
import { Suspense } from "react";
import { requireUser } from "@/lib/crm/auth";
import { leadOriginCounts, todayLists, userCounts } from "@/lib/crm/queries";
import { hasModule } from "@/lib/crm/modules";
import { partnerOverview } from "@/lib/partners/queries";
import { cmsOverview } from "@/lib/cms/queries";
import { adsOpsOverview } from "@/lib/ads-ops/queries";
import { metaOpsOverview } from "@/lib/meta-ops/queries";
import { seoOpsOverview } from "@/lib/seo-ops/queries";
import { trainingOpsOverview } from "@/lib/training-ops/queries";
import { solutionsOpsOverview } from "@/lib/solutions-ops/queries";
import { b2bOpsOverview } from "@/lib/b2b-ops/queries";
import { reservationOpsOverview } from "@/lib/reservations-ops/queries";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { ModuleCard } from "@/components/crm/ui/ModuleCard";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import {
  greetingForHour,
  OverviewHero,
  OverviewHeroMetricsCard,
} from "@/components/crm/ui/OverviewHero";
import { roleLabel } from "@/lib/crm/roles";

function DashboardPending({ name }: { name: string }) {
  return (
    <div className="crm-dash" aria-busy="true">
      <OverviewHero
        variant="dashboard"
        eyebrow="Dashboard"
        title="กำลังเปิดแดชบอร์ด…"
        description={name ? `สวัสดี ${name}` : "กำลังโหลดงานวันนี้"}
        label="กำลังโหลดแดชบอร์ด"
      />
    </div>
  );
}

export default async function AdminHomePage() {
  const user = await requireUser();
  return (
    <Suspense fallback={<DashboardPending name={user.name} />}>
      <DashboardHome user={user} />
    </Suspense>
  );
}

async function DashboardHome({
  user,
}: {
  user: Awaited<ReturnType<typeof requireUser>>;
}) {
  const [lists, origins, partners, users, cms, reservations, b2b, ads, meta, seo, training, solutions] = await Promise.all([
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
    metaOpsOverview(user).catch(() => ({ total: 0, live: 0, due: 0 })),
    seoOpsOverview(user).catch(() => ({ total: 0, live: 0, due: 0 })),
    trainingOpsOverview(user).catch(() => ({ total: 0, live: 0, due: 0 })),
    hasModule(user, "solutions")
      ? solutionsOpsOverview().catch(() => ({ total: 0, byStatus: {} as Record<string, number>, byDepartment: {}, dueReview: 0, needsApproval: 0, imagePending: 0, categories: 0 }))
      : Promise.resolve({ total: 0, byStatus: {} as Record<string, number>, byDepartment: {}, dueReview: 0, needsApproval: 0, imagePending: 0, categories: 0 }),
  ]);

  const dueToday = lists.dueToday.length + lists.overdue.length;
  const overdueCount = lists.overdue.length;
  const greeting = greetingForHour();

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
            { label: "ครบกำหนดวันนี้", value: dueToday },
            { label: "งานทั้งหมด", value: origins.web + origins.manual },
            { label: "เกินกำหนด", value: overdueCount },
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
            { label: "ค่าคอมมิชชัน", value: partners.commissions },
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
            { label: "งานเปิดอยู่", value: reservations.open },
            { label: "ครบกำหนด", value: reservations.due },
            { label: "ส่งต่อแล้ว", value: reservations.escalated },
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
            { label: "พาร์ตเนอร์ทั้งหมด", value: b2b.total },
            { label: "กำลังใช้งาน", value: b2b.active },
            { label: "ต้องติดตาม", value: b2b.due },
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
            { label: "แคมเปญทั้งหมด", value: ads.total },
            { label: "กำลังใช้งาน", value: ads.live },
            { label: "ต้องติดตาม", value: ads.due },
          ],
          cta: "เปิด Google Ads Operations",
        }
      : null,
    hasModule(user, "meta")
      ? {
          href: "/crm/meta",
          accent: "meta" as const,
          icon: "▣",
          category: "META",
          title: "Meta Ads Operations",
          body: "บอร์ดแคมเปญ Awareness, Traffic, Leads, Conversion และ Remarketing ภายใน",
          stats: [
            { label: "แคมเปญทั้งหมด", value: meta.total },
            { label: "กำลังใช้งาน", value: meta.live },
            { label: "ต้องติดตาม", value: meta.due },
          ],
          cta: "เปิด Meta Ads Operations",
        }
      : null,
    hasModule(user, "seo")
      ? {
          href: "/crm/seo",
          accent: "seo" as const,
          icon: "▣",
          category: "LOCAL SEARCH",
          title: "Local Search Operations",
          body: "บอร์ดงาน Search Visibility, Website / SEO, Google Business Profile, Maps และ AEO ภายใน",
          stats: [
            { label: "งานทั้งหมด", value: seo.total },
            { label: "เผยแพร่แล้ว", value: seo.live },
            { label: "ต้องติดตาม", value: seo.due },
          ],
          cta: "เปิด Local Search Operations",
        }
      : null,
    hasModule(user, "training")
      ? {
          href: "/crm/training",
          accent: "training" as const,
          icon: "▣",
          category: "TRAINING",
          title: "Hotel Training Operations",
          body: "บอร์ดคำขออบรม ปฏิทิน โปรแกรม กลุ่มผู้เรียน และการติดตามภายใน — ไม่แสดงบนหน้าสาธารณะ",
          stats: [
            { label: "รายการทั้งหมด", value: training.total },
            { label: "กำลังใช้งาน", value: training.live },
            { label: "ต้องติดตาม", value: training.due },
          ],
          cta: "เปิด Hotel Training Operations",
        }
      : null,
    hasModule(user, "solutions")
      ? {
          href: "/crm/solutions",
          accent: "solutions" as const,
          icon: "▦",
          category: "SOLUTIONS",
          title: "Hotel Solutions Service Directory",
          body: "ไดเรกทอรีบริการภายใน หมวด ความสัมพันธ์ หลักฐาน สิทธิ์รูป และคิวคำขอ — แยกจากตัวแก้ไข CMS และไม่แสดงข้อมูลลูกค้าบนหน้าสาธารณะ",
          stats: [
            { label: "บริการทั้งหมด", value: solutions.total },
            { label: "รออนุมัติ", value: solutions.needsApproval },
            { label: "ถึงกำหนดทบทวน", value: solutions.dueReview },
          ],
          cta: "เปิด Solutions Directory",
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
            { label: "ทีมภายใน", value: users.staff },
            { label: "พาร์ตเนอร์", value: users.partners },
            { label: "ผู้ใช้ทั้งหมด", value: users.total },
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
            { label: "หน้าเว็บ", value: cms.pages },
            { label: "บทความ", value: cms.insights },
            { label: "ฉบับร่าง", value: cms.drafts },
          ],
          cta: "เปิด Content Management",
        }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    accent: "leads" | "partners" | "reservations" | "b2b" | "ads" | "meta" | "seo" | "users" | "cms" | "training" | "solutions";
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

  if (hasModule(user, "training") && training.due > 0 && tasks.length < 5) {
    tasks.push({
      title: `งานอบรมที่รอตรวจ ${training.due} รายการ`,
      meta: "Training",
      priority: "medium",
      href: "/crm/training/approvals",
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

  type OverviewStat = {
    key: string;
    label: string;
    value: number;
    hint: string;
    tone: "overdue" | "today" | "web" | "partners" | "users" | "cms";
    href?: string;
  };

  const overviewStats: OverviewStat[] = [
    {
      key: "overdue",
      label: "เกินกำหนด",
      value: overdueCount,
      hint: "ต้องติดตามก่อน",
      tone: "overdue",
      href: hasModule(user, "leads") ? "/crm/sales" : undefined,
    },
    {
      key: "due-today",
      label: "ครบกำหนดวันนี้",
      value: lists.dueToday.length,
      hint: "คิวงานวันนี้",
      tone: "today",
      href: hasModule(user, "leads") ? "/crm/sales" : undefined,
    },
    hasModule(user, "leads")
      ? {
          key: "web",
          label: "ลีดจากเว็บไซต์",
          value: origins.web,
          hint: "เปิดรายการจากเว็บ",
          tone: "web" as const,
          href: "/crm/leads?origin=web",
        }
      : null,
    hasModule(user, "partners")
      ? {
          key: "partners",
          label: "พาร์ตเนอร์รออนุมัติ",
          value: partners.applications,
          hint: "เปิดคิวอนุมัติ",
          tone: "partners" as const,
          href: "/crm/partners/list",
        }
      : hasModule(user, "users")
        ? {
            key: "users",
            label: "ผู้ใช้ทั้งหมด",
            value: users.total,
            hint: "เปิด Users Management",
            tone: "users" as const,
            href: "/crm/users",
          }
        : hasModule(user, "cms")
          ? {
              key: "cms",
              label: "ฉบับร่าง",
              value: cms.drafts,
              hint: "เปิด Content Management",
              tone: "cms" as const,
              href: "/crm/cms/insights",
            }
          : null,
  ].filter(Boolean) as OverviewStat[];

  return (
    <div className="crm-dash">
      <OverviewHero
        variant="dashboard"
        eyebrow="Dashboard"
        badge={<span className="crm-hero-badge">{roleLabel(user.role)}</span>}
        title={`${greeting}, ${user.name || "ทีม KPI Plus"}`}
        description="ภาพรวมงานวันนี้และทางลัดเข้าโมดูลที่คุณมีสิทธิ์ใช้"
        label="แดชบอร์ดหลัก"
        actions={
          <>
            {hasModule(user, "leads") ? (
              <Link href="/crm/sales" className="crm-hero-btn crm-hero-btn-primary">
                งานที่ต้องทำวันนี้
                {dueToday > 0 ? <span className="crm-hero-btn-count">{dueToday}</span> : null}
              </Link>
            ) : null}
            {hasModule(user, "cms") ? (
              <Link href="/crm/cms/insights/new" className="crm-hero-btn crm-hero-btn-secondary">
                สร้างเนื้อหาใหม่
              </Link>
            ) : hasModule(user, "leads") ? (
              <NewLeadOpenButton className="crm-hero-btn crm-hero-btn-secondary">คีย์ลีดใหม่</NewLeadOpenButton>
            ) : null}
          </>
        }
        aside={
          <OverviewHeroMetricsCard
            label="งานที่ต้องจัดการ"
            hint="รวมงานครบกำหนดวันนี้และเกินกำหนด"
            pulse={dueToday > 0 ? "ต้องดำเนินการ" : "ว่าง"}
            pulseHot={dueToday > 0}
            value={dueToday}
            metrics={[
              { value: overdueCount, label: "เกินกำหนด", tone: "overdue" },
              { value: lists.dueToday.length, label: "ครบกำหนดวันนี้", tone: "today" },
            ]}
            footer={
              hasModule(user, "leads") ? (
                <Link href="/crm/sales" className="crm-hero-card-link">
                  เปิดงานวันนี้
                  <span aria-hidden="true">→</span>
                </Link>
              ) : null
            }
          />
        }
      />

      {overviewStats.length ? (
        <section className="crm-dash-summary" aria-label="สถิติภาพรวม">
          <div className="crm-dash-stats" role="list">
            {overviewStats.map((stat) => {
              const className = `crm-dash-stat is-${stat.tone}${stat.href ? "" : " is-static"}`;
              const body = (
                <>
                  <span className="crm-dash-stat-label">{stat.label}</span>
                  <strong className="crm-dash-stat-value">{stat.value}</strong>
                  <span className="crm-dash-stat-hint">{stat.hint}</span>
                </>
              );
              return stat.href ? (
                <Link key={stat.key} href={stat.href} className={className} role="listitem">
                  {body}
                </Link>
              ) : (
                <div key={stat.key} className={className} role="listitem">
                  {body}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="crm-dash-work" aria-label="งานที่ต้องดำเนินการ">
        <article className="crm-dash-panel crm-dash-panel-primary">
          <div className="crm-dash-section-head crm-dash-section-head-row">
            <div>
              <h2>
                งานที่ต้องดำเนินการ
                {tasks.length > 0 ? <span className="crm-dash-count">{tasks.length}</span> : null}
              </h2>
              <p>เรียงตามความเร่งด่วนจากคิวงานจริงในระบบ</p>
            </div>
            {hasModule(user, "leads") ? (
              <Link href="/crm/sales" className="crm-dash-panel-link">
                ดูงานวันนี้
              </Link>
            ) : null}
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
                    <b className={`crm-dash-priority is-${task.priority}`}>
                      <span className="sr-only">ความสำคัญ: </span>
                      {priorityLabel[task.priority]}
                    </b>
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
              compact
              action={
                hasModule(user, "leads") ? (
                  <NewLeadOpenButton className="kpi-button crm-users-primary">คีย์ลีดใหม่</NewLeadOpenButton>
                ) : null
              }
            />
          )}
        </article>
      </section>

      <section className="crm-dash-modules" aria-label="ทางลัดโมดูล">
        <div className="crm-dash-section-head">
          <h2>ทางลัดโมดูล</h2>
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
            compact
          />
        )}
      </section>

      <section className="crm-dash-activity-section" aria-label="กิจกรรมล่าสุด">
        <article className="crm-dash-panel">
          <div className="crm-dash-section-head">
            <h2>กิจกรรมล่าสุดในระบบ</h2>
            <p>สรุปสถานะจากข้อมูลที่มีตอนนี้ — ไม่ใช่รายการที่ต้องทำทันที</p>
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
            <EmptyState title="ยังไม่มีกิจกรรมล่าสุด" body="เมื่อมีลีด พาร์ตเนอร์ หรือเนื้อหาใหม่ จะแสดงที่นี่" compact />
          )}
        </article>
      </section>
    </div>
  );
}
