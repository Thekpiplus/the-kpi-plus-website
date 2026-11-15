import Link from "next/link";
import { Suspense } from "react";
import {
  ActivityFeed,
  HeroPanel,
  KpiStrip,
  ModuleGrid,
  TaskQueue,
  type DashActivity,
  type DashKpi,
  type DashModule,
  type DashTask,
} from "@/components/crm/dashboard";
import "@/components/crm/dashboard/tokens.css";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { greetingForHour } from "@/components/crm/ui/OverviewHero";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { formatRelativeThai, leadOriginCounts, recentLeadEvents, todayLists, userCounts } from "@/lib/crm/queries";
import { roleLabel } from "@/lib/crm/roles";
import { adsOpsOverview } from "@/lib/ads-ops/queries";
import { b2bOpsOverview } from "@/lib/b2b-ops/queries";
import { cmsOverview } from "@/lib/cms/queries";
import { metaOpsOverview } from "@/lib/meta-ops/queries";
import { partnerOverview } from "@/lib/partners/queries";
import { reservationOpsOverview } from "@/lib/reservations-ops/queries";
import { seoOpsOverview } from "@/lib/seo-ops/queries";
import { solutionsOpsOverview } from "@/lib/solutions-ops/queries";
import { trainingOpsOverview } from "@/lib/training-ops/queries";

function DashboardPending({ name }: { name: string }) {
  return (
    <div className="kpi-dash-a" aria-busy="true" aria-label="กำลังโหลดแดชบอร์ด">
      <div className="kpi-dash-a-hero">
        <div className="kpi-dash-a-skeleton" />
        <div className="kpi-dash-a-skeleton" />
      </div>
      <div className="kpi-dash-a-kpi">
        <div className="kpi-dash-a-skeleton" />
        <div className="kpi-dash-a-skeleton" />
        <div className="kpi-dash-a-skeleton" />
        <div className="kpi-dash-a-skeleton" />
      </div>
      <p className="sr-only">{name ? `สวัสดี ${name}` : "กำลังโหลดงานวันนี้"}</p>
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
  const [lists, origins, partners, users, cms, reservations, b2b, ads, meta, seo, training, solutions, leadEvents] =
    await Promise.all([
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
        ? solutionsOpsOverview().catch(() => ({
            total: 0,
            byStatus: {} as Record<string, number>,
            byDepartment: {},
            dueReview: 0,
            needsApproval: 0,
            imagePending: 0,
            categories: 0,
          }))
        : Promise.resolve({
            total: 0,
            byStatus: {} as Record<string, number>,
            byDepartment: {},
            dueReview: 0,
            needsApproval: 0,
            imagePending: 0,
            categories: 0,
          }),
      recentLeadEvents(4).catch(() => []),
    ]);

  const dueTodayCount = lists.dueToday.length;
  const overdueCount = lists.overdue.length;
  const dueToday = dueTodayCount + overdueCount;
  const pendingApprovals =
    (hasModule(user, "partners") ? partners.applications : 0) +
    (hasModule(user, "solutions") ? solutions.needsApproval : 0) +
    (hasModule(user, "cms") ? cms.drafts : 0);
  const greeting = greetingForHour();
  const canLeads = hasModule(user, "leads");
  const canCms = hasModule(user, "cms");

  const modules = [
    hasModule(user, "leads")
      ? {
          href: "/crm/sales",
          code: "LEAD",
          name: "Lead Management",
          blurb: "ติดตามลีด คัดกรอง และดู Pipeline",
          icon: "◎",
          tone: "leads",
          metrics: [
            { label: "ถึงกำหนด", value: dueToday },
            { label: "ทั้งหมด", value: origins.web + origins.manual },
            { label: "เกินกำหนด", value: overdueCount },
          ],
          cta: "เปิด Lead Management",
        }
      : null,
    hasModule(user, "partners")
      ? {
          href: "/crm/partners",
          code: "PARTNER",
          name: "Partner Management",
          blurb: "อนุมัติพาร์ตเนอร์และติดตามค่าคอมมิชชัน",
          icon: "◈",
          tone: "partners",
          metrics: [
            { label: "รออนุมัติ", value: partners.applications },
            { label: "คอมมิชชัน", value: partners.commissions },
            { label: "รอจ่าย", value: partners.payouts + partners.overdue },
          ],
          cta: "เปิด Partner Management",
        }
      : null,
    hasModule(user, "reservations")
      ? {
          href: "/crm/reservations",
          code: "RESERVATIONS",
          name: "Reservation Operations",
          blurb: "คิว Inquiry, Booking และ Confirmation",
          icon: "▣",
          tone: "reservations",
          metrics: [
            { label: "เปิดอยู่", value: reservations.open },
            { label: "ถึงกำหนด", value: reservations.due },
            { label: "ส่งต่อ", value: reservations.escalated },
          ],
          cta: "เปิด Reservation Operations",
        }
      : null,
    hasModule(user, "b2b")
      ? {
          href: "/crm/b2b",
          code: "B2B",
          name: "B2B Sales Operations",
          blurb: "Pipeline พาร์ตเนอร์ท่องเที่ยวและเรท",
          icon: "▦",
          tone: "b2b",
          metrics: [
            { label: "ทั้งหมด", value: b2b.total },
            { label: "ใช้งาน", value: b2b.active },
            { label: "ติดตาม", value: b2b.due },
          ],
          cta: "เปิด B2B Sales",
        }
      : null,
    hasModule(user, "ads")
      ? {
          href: "/crm/ads",
          code: "ADS",
          name: "Google Ads Operations",
          blurb: "บอร์ดแคมเปญ Search และ Hotel Ads",
          icon: "▣",
          tone: "ads",
          metrics: [
            { label: "ทั้งหมด", value: ads.total },
            { label: "ใช้งาน", value: ads.live },
            { label: "ติดตาม", value: ads.due },
          ],
          cta: "เปิด Google Ads",
        }
      : null,
    hasModule(user, "meta")
      ? {
          href: "/crm/meta",
          code: "META",
          name: "Meta Ads Operations",
          blurb: "บอร์ดแคมเปญ Awareness ถึง Remarketing",
          icon: "▣",
          tone: "meta",
          metrics: [
            { label: "ทั้งหมด", value: meta.total },
            { label: "ใช้งาน", value: meta.live },
            { label: "ติดตาม", value: meta.due },
          ],
          cta: "เปิด Meta Ads",
        }
      : null,
    hasModule(user, "seo")
      ? {
          href: "/crm/seo",
          code: "SEO",
          name: "Local Search Operations",
          blurb: "Search Visibility, GBP, Maps และ AEO",
          icon: "▣",
          tone: "seo",
          metrics: [
            { label: "ทั้งหมด", value: seo.total },
            { label: "เผยแพร่", value: seo.live },
            { label: "ติดตาม", value: seo.due },
          ],
          cta: "เปิด Local Search",
        }
      : null,
    hasModule(user, "training")
      ? {
          href: "/crm/training",
          code: "TRAINING",
          name: "Hotel Training Operations",
          blurb: "คำขออบรม ปฏิทิน และติดตามภายใน",
          icon: "▣",
          tone: "training",
          metrics: [
            { label: "ทั้งหมด", value: training.total },
            { label: "ใช้งาน", value: training.live },
            { label: "ติดตาม", value: training.due },
          ],
          cta: "เปิด Hotel Training",
        }
      : null,
    hasModule(user, "solutions")
      ? {
          href: "/crm/solutions",
          code: "SOLUTIONS",
          name: "Hotel Solutions",
          blurb: "ไดเรกทอรีบริการภายในและคิวคำขอ",
          icon: "▦",
          tone: "solutions",
          metrics: [
            { label: "ทั้งหมด", value: solutions.total },
            { label: "รออนุมัติ", value: solutions.needsApproval },
            { label: "ทบทวน", value: solutions.dueReview },
          ],
          cta: "เปิด Solutions",
        }
      : null,
    hasModule(user, "users")
      ? {
          href: "/crm/users",
          code: "USERS",
          name: "Users Management",
          blurb: "จัดการผู้ใช้และสิทธิ์การเข้าถึง",
          icon: "◉",
          tone: "users",
          metrics: [
            { label: "ทีม", value: users.staff },
            { label: "พาร์ตเนอร์", value: users.partners },
            { label: "ทั้งหมด", value: users.total },
          ],
          cta: "เปิด Users",
        }
      : null,
    hasModule(user, "cms")
      ? {
          href: "/crm/cms",
          code: "CONTENT",
          name: "Content Management",
          blurb: "จัดการหน้า บทความ และสื่อบนเว็บ",
          icon: "▤",
          tone: "cms",
          metrics: [
            { label: "หน้า", value: cms.pages },
            { label: "บทความ", value: cms.insights },
            { label: "ร่าง", value: cms.drafts },
          ],
          cta: "เปิด Content",
        }
      : null,
  ].filter(Boolean) as DashModule[];

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

  const activityFromEvents: DashActivity[] = leadEvents.map((event) => {
    const who = event.lead.businessName || event.lead.contactName || "ลีด";
    return {
      title: event.detail?.trim() || `${event.type} · ${who}`,
      meta: formatRelativeThai(event.createdAt),
      tone: "leads" as const,
    };
  });

  const activityFallback = [
    origins.web > 0 ? { title: "มีลีดใหม่จากเว็บไซต์", meta: `${origins.web} รายการ`, tone: "leads" as const } : null,
    overdueCount > 0
      ? { title: "มีงานติดตามที่เกินกำหนด", meta: `${overdueCount} รายการ`, tone: "leads" as const }
      : null,
    partners.applications > 0
      ? { title: "คำขอพาร์ตเนอร์รออนุมัติ", meta: `${partners.applications} รายการ`, tone: "partners" as const }
      : null,
    cms.drafts > 0 ? { title: "มีบทความฉบับร่าง", meta: `${cms.drafts} รายการ`, tone: "cms" as const } : null,
    reservations.escalated > 0
      ? { title: "งานจองที่ต้องส่งต่อโรงแรม", meta: `${reservations.escalated} รายการ`, tone: "reservations" as const }
      : null,
    b2b.due > 0
      ? { title: "มีงานติดตามพาร์ตเนอร์ครบกำหนด", meta: `${b2b.due} รายการ`, tone: "b2b" as const }
      : null,
  ].filter(Boolean) as DashActivity[];

  const activity = activityFromEvents.length ? activityFromEvents : activityFallback;

  const kpis: DashKpi[] = [
    {
      key: "overdue",
      label: "เกินกำหนด",
      value: overdueCount,
      note: "ต้องติดตามก่อน",
      tone: "rose",
      href: canLeads ? "/crm/sales" : undefined,
    },
    {
      key: "due-today",
      label: "ถึงกำหนดวันนี้",
      value: dueTodayCount,
      note: "คิวงานวันนี้",
      tone: "amber",
      href: canLeads ? "/crm/sales" : undefined,
    },
    {
      key: "open-today",
      label: "งานเปิดวันนี้",
      value: dueToday,
      note: "รวมเกินกำหนด + วันนี้",
      tone: "sky",
      href: canLeads ? "/crm/sales" : undefined,
    },
    {
      key: "approvals",
      label: "รออนุมัติ",
      value: pendingApprovals,
      note: "พาร์ตเนอร์ / ร่าง / โซลูชัน",
      tone: "brand",
      href: hasModule(user, "partners")
        ? "/crm/partners/list"
        : canCms
          ? "/crm/cms/insights"
          : hasModule(user, "solutions")
            ? "/crm/solutions/approvals"
            : undefined,
    },
  ];

  return (
    <div className="kpi-dash-a">
      <HeroPanel
        greeting={greeting}
        name={user.name || "ทีม KPI Plus"}
        role={roleLabel(user.role)}
        dueToday={dueToday}
        overdueCount={overdueCount}
        dueTodayCount={dueTodayCount}
        canLeads={canLeads}
        canCms={canCms}
        primaryAction={
          canLeads ? (
            <Link href="/crm/sales" className="kpi-dash-a-btn is-dark">
              งานที่ต้องทำวันนี้
              {dueToday > 0 ? <span className="kpi-dash-a-btn-count">{dueToday}</span> : null}
            </Link>
          ) : null
        }
        secondaryAction={
          canCms ? (
            <Link href="/crm/cms/insights/new" className="kpi-dash-a-btn is-light">
              + สร้างเนื้อหาใหม่
            </Link>
          ) : canLeads ? (
            <NewLeadOpenButton className="kpi-dash-a-btn is-light">+ คีย์ลีดใหม่</NewLeadOpenButton>
          ) : null
        }
      />

      <KpiStrip items={kpis} />

      <TaskQueue
        tasks={tasks}
        headerAction={
          canLeads ? (
            <Link href="/crm/sales" className="kpi-dash-a-summary-link">
              ดูงานวันนี้
            </Link>
          ) : null
        }
        emptyAction={
          canLeads ? (
            <NewLeadOpenButton className="kpi-dash-a-btn is-brand">สร้างคิวใหม่</NewLeadOpenButton>
          ) : canCms ? (
            <Link href="/crm/cms/insights/new" className="kpi-dash-a-btn is-brand">
              สร้างคิวใหม่
            </Link>
          ) : null
        }
      />

      <ModuleGrid modules={modules} />
      <ActivityFeed items={activity} />
    </div>
  );
}
