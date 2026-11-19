import Link from "next/link";
import { Suspense } from "react";
import {
  ActivityFeed,
  HeroPanel,
  KpiStrip,
  TaskQueue,
  type DashActivity,
  type DashKpi,
  type DashTask,
} from "@/components/crm/dashboard";
import "@/components/crm/dashboard/tokens.css";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { greetingForHour } from "@/components/crm/ui/OverviewHero";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { formatRelativeThai, leadOriginCounts, recentLeadEvents, todayLists } from "@/lib/crm/queries";
import { roleLabel } from "@/lib/crm/roles";
import { b2bOpsOverview } from "@/lib/b2b-ops/queries";
import { cmsOverview } from "@/lib/cms/queries";
import { partnerOverview } from "@/lib/partners/queries";
import { reservationOpsOverview } from "@/lib/reservations-ops/queries";
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
  const [lists, origins, partners, cms, reservations, b2b, training, solutions, leadEvents] = await Promise.all([
    todayLists(),
    leadOriginCounts(),
    partnerOverview().catch(() => ({
      applications: 0,
      referrals: 0,
      commissions: 0,
      payouts: 0,
      overdue: 0,
    })),
    cmsOverview().catch(() => ({ pages: 0, insights: 0, drafts: 0, media: 0 })),
    reservationOpsOverview().catch(() => ({ open: 0, due: 0, escalated: 0 })),
    b2bOpsOverview(user).catch(() => ({ total: 0, active: 0, due: 0, pendingRates: 0 })),
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

      <ActivityFeed items={activity} />
    </div>
  );
}
