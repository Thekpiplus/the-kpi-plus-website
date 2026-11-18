import Link from "next/link";
import { LeadsPageChrome } from "@/components/crm/leads/LeadsPageChrome";
import { LeadAllWorkspace } from "@/components/crm/leads/LeadAllWorkspace";
import {
  deriveLeadStatus,
  type LeadAllArchiveView,
  type LeadAllRow,
  type LeadAllSort,
  type LeadAllStatFilter,
} from "@/components/crm/leads/lead-all-types";
import {
  buildChannelStats,
  channelHeading,
  channelLabel,
  isKnownSource,
} from "@/components/crm/leads/lead-channel-types";
import { LeadChannelClient } from "@/components/crm/leads/LeadChannelClient";
import { LeadPendingClient } from "@/components/crm/leads/LeadPendingClient";
import {
  buildPendingReasonStats,
  buildPendingScopeStats,
  filterPendingLeads,
  isPendingLead,
  parsePendingReason,
  parsePendingScope,
  PENDING_REASON_META,
  PENDING_SCOPE_META,
} from "@/components/crm/leads/lead-pending-types";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { leadArchiveCounts } from "@/lib/crm/archive";
import { leadOrigin, sourceLabel, type LeadOrigin } from "@/lib/crm/sources";
import { pipelineData, searchLeads, staffDirectory } from "@/lib/crm/queries";

function parseServices(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw || "[]") as unknown;
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function toIso(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    origin?: string;
    stageId?: string;
    ownerId?: string;
    archive?: string;
    view?: string;
    sort?: string;
    stat?: string;
    source?: string;
    scope?: string;
    reason?: string;
  }>;
}) {
  const params = await searchParams;
  const originParam: LeadOrigin | "" =
    params.origin === "web" || params.origin === "manual" ? params.origin : "";

  const pendingView = params.view === "pending";
  // Channel view: ?view=channel&source=… · legacy ?origin=web maps here (not when pending)
  const channelView = !pendingView && (params.view === "channel" || originParam === "web");
  const rawSource = (params.source ?? "").trim();
  const lockedSource =
    channelView && rawSource
      ? rawSource
      : channelView && originParam === "web" && !rawSource && params.view !== "channel"
        ? "website_form"
        : "";
  const sourceInvalid = Boolean(lockedSource && !isKnownSource(lockedSource));

  const pendingScope = parsePendingScope(params.scope);
  const pendingReason = parsePendingReason(params.reason);

  const archive: LeadAllArchiveView = pendingView
    ? "active"
    : params.archive === "archived"
      ? "archived"
      : params.archive === "all" || params.view === "all"
        ? "all"
        : "active";
  const sort: LeadAllSort =
    params.sort === "value" || params.sort === "updated" ? params.sort : "urgent";
  const stat: LeadAllStatFilter =
    pendingView
      ? "all"
      : params.stat === "overdue" ||
          params.stat === "dueToday" ||
          params.stat === "awaiting" ||
          params.stat === "new"
        ? params.stat
        : "all";

  const [leads, allForChannels, stagesRaw, owners, counts] = await Promise.all([
    searchLeads({ archive }),
    channelView
      ? archive === "all"
        ? Promise.resolve(null)
        : searchLeads({ archive: "all" })
      : pendingView
        ? Promise.resolve(null)
        : archive === "active"
          ? Promise.resolve(null)
          : searchLeads({ archive: "active" }),
    pipelineData(),
    staffDirectory(),
    leadArchiveCounts(),
  ]);

  const stages = stagesRaw.map((stage) => ({
    id: stage.id,
    nameTh: stage.nameTh,
    sortOrder: stage.sortOrder,
    isWon: Boolean(stage.isWon),
    isLost: Boolean(stage.isLost),
  }));
  const stageIndexById = Object.fromEntries(stages.map((stage, index) => [stage.id, index + 1]));
  const ownersById = Object.fromEntries(owners.map((item) => [item.id, item.name]));

  function toRow(lead: (typeof leads)[number]): LeadAllRow {
    const stage = stages.find((item) => item.id === lead.stageId);
    const stageIndex = stageIndexById[lead.stageId] ?? stage?.sortOrder ?? 1;
    const lastContactAt = toIso(lead.lastContactAt);
    const nextActivityAt = toIso(lead.nextActivityAt);
    const archivedAt = toIso(lead.archivedAt);
    const status = deriveLeadStatus({
      nextActivityAt,
      lastContactAt,
      stageIndex,
      isWon: Boolean(stage?.isWon),
      isLost: Boolean(stage?.isLost),
      archivedAt,
      noFollowUp: Boolean(lead.noFollowUp),
      outcome: lead.outcome ?? "",
    });
    return {
      id: lead.id,
      contactName: lead.contactName,
      businessName: lead.businessName,
      businessType: lead.businessType,
      phone: lead.phone,
      email: lead.email,
      location: lead.location,
      website: lead.website,
      services: parseServices(lead.services),
      source: lead.source,
      sourceLabel: sourceLabel(lead.source),
      origin: leadOrigin(lead.source),
      stageId: lead.stageId,
      stageName: stage?.nameTh ?? lead.stage?.nameTh ?? "—",
      stageIndex,
      isWon: Boolean(stage?.isWon),
      isLost: Boolean(stage?.isLost),
      ownerId: lead.ownerId,
      ownerName: lead.ownerId ? ownersById[lead.ownerId] ?? null : null,
      estimatedValue: lead.estimatedValue,
      message: lead.message,
      formName: lead.formName,
      lastContactAt,
      nextActivityAt,
      updatedAt: toIso(lead.updatedAt) ?? new Date().toISOString(),
      createdAt: toIso(lead.createdAt) ?? new Date().toISOString(),
      archivedAt,
      noFollowUp: Boolean(lead.noFollowUp),
      outcome: lead.outcome ?? "",
      status,
    };
  }

  const rows = leads.map(toRow);
  const channelUniverse = (allForChannels ?? leads).map(toRow);
  const channelStats = buildChannelStats(channelUniverse);

  const pendingUniverse = rows.filter(isPendingLead);
  const pendingScopeStats = buildPendingScopeStats(rows);
  const pendingReasonStats = buildPendingReasonStats(rows, pendingScope);
  const pendingRows = filterPendingLeads(rows, pendingScope, pendingReason);

  const scopedForCounts = lockedSource
    ? channelUniverse.filter((lead) => lead.source === lockedSource)
    : channelView
      ? channelUniverse
      : null;

  const tableCounts = pendingView
    ? {
        active: pendingRows.length,
        archived: 0,
        all: pendingRows.length,
      }
    : scopedForCounts
      ? {
          active: scopedForCounts.filter((l) => !l.archivedAt).length,
          archived: scopedForCounts.filter((l) => l.archivedAt).length,
          all: scopedForCounts.length,
        }
      : counts;

  const kpiBase = lockedSource
    ? rows.filter((l) => l.source === lockedSource && !l.archivedAt)
    : channelView
      ? rows.filter((l) => !l.archivedAt)
      : (allForChannels ? allForChannels.map(toRow) : rows).filter((l) => !l.archivedAt);

  const kpiCounts = {
    overdue: kpiBase.filter((l) => l.status === "overdue").length,
    dueToday: kpiBase.filter((l) => l.status === "dueToday").length,
    awaiting: kpiBase.filter((l) => l.status === "awaiting").length,
    new: kpiBase.filter((l) => l.status === "new").length,
  };

  const todayLabel = new Intl.DateTimeFormat("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date());

  const lockedLabel = lockedSource ? channelLabel(lockedSource) : "";
  const channelActiveTotal = channelStats.reduce((sum, item) => sum + item.active, 0);
  const scopeLabel = PENDING_SCOPE_META[pendingScope].label;
  const reasonLabel = pendingReason ? PENDING_REASON_META[pendingReason].label : "";

  let pageTitle = "ลีดทั้งหมด";
  let pageDescription =
    "ค้นหา กรอง มอบหมาย และปรับขั้นจากตารางเดียว · มูลค่า 0 = ยังไม่ประเมิน";
  let pageMeta = `${todayLabel} · ใช้งานอยู่ ${counts.active} รายการ`;

  if (pendingView) {
    const scopedPending = filterPendingLeads(rows, pendingScope, "").length;
    pageTitle = "ลีดที่ยังต้องทำต่อ";
    pageDescription =
      "งานค้างที่ยังปิดการขายไม่ได้ — แยกตามสาเหตุและขอบเขตช่องทาง แล้วจัดการจากตาราง";
    pageMeta = `${todayLabel} · ${scopedPending} รายการที่ยังปิดไม่ได้ · ขอบเขต “${scopeLabel}”`;
  } else if (channelView) {
    pageTitle = lockedSource && !sourceInvalid ? channelHeading(lockedSource) : "แยกตามช่องทาง";
    pageDescription = lockedSource
      ? `รายการจากช่องทาง ${lockedLabel} — กรอง มอบหมาย และปรับขั้นได้จากตาราง`
      : "ดูสัดส่วนลีดตามช่องทางที่ได้มา แล้วเจาะลงรายการในช่องทางที่เลือก";
    const channelCount = lockedSource ? tableCounts.active : channelActiveTotal;
    pageMeta = `${todayLabel} · ${channelCount} รายการ${lockedSource ? `จาก${/^[A-Za-z]/.test(lockedLabel) ? ` ${lockedLabel}` : lockedLabel}` : "จากทุกช่องทาง"} · ${counts.active} รายการรวมทั้งระบบ`;
  } else if (originParam === "manual") {
    pageTitle = "ลีดที่คีย์เอง";
    pageDescription = "รายการที่คีย์เองหรือจากแหล่งอื่น — ค้นหา มอบหมาย และปรับขั้นได้จากตาราง";
    pageMeta = `${todayLabel} · ใช้งานอยู่ ${counts.active} รายการ`;
  }

  if (archive === "archived" && !channelView && !pendingView) {
    pageDescription = "ลีดที่เก็บไว้แล้ว ไม่โชว์ใน Pipeline และงานวันนี้ — คืนค่าได้จากแผงรายการ";
  }

  const leaveChannelHref = (() => {
    const q = new URLSearchParams();
    q.set("view", "channel");
    if (archive !== "active") q.set("archive", archive);
    return `/crm/leads?${q.toString()}`;
  })();

  const clearReasonHref = (() => {
    const q = new URLSearchParams();
    q.set("view", "pending");
    if (pendingScope !== "all") q.set("scope", pendingScope);
    if (params.q) q.set("q", params.q);
    if (params.stageId) q.set("stageId", params.stageId);
    if (params.ownerId) q.set("ownerId", params.ownerId);
    if (params.sort) q.set("sort", params.sort);
    return `/crm/leads?${q.toString()}`;
  })();

  const workspaceLeads = pendingView ? pendingRows : rows;

  const workspace = (
    <LeadAllWorkspace
      leads={workspaceLeads}
      stages={stages}
      owners={owners.map((owner) => ({ id: owner.id, name: owner.name }))}
      counts={tableCounts}
      kpi={kpiCounts}
      q={params.q ?? ""}
      origin={channelView || pendingView ? "" : originParam}
      stageId={params.stageId ?? ""}
      ownerId={params.ownerId ?? ""}
      archive={archive}
      sort={sort}
      stat={stat}
      lockedOrigin={!channelView && !pendingView && Boolean(originParam)}
      channelView={channelView}
      lockedSource={sourceInvalid ? "" : lockedSource}
      lockedSourceLabel={lockedLabel}
      leaveChannelHref={leaveChannelHref}
      hideKpi={pendingView}
      pendingView={pendingView}
      pendingScope={pendingScope}
      pendingReason={pendingReason}
      pendingReasonLabel={reasonLabel}
      pendingScopeLabel={scopeLabel}
      clearReasonHref={clearReasonHref}
      listHeading={
        pendingView
          ? `ลีดงานค้าง · ${PENDING_SCOPE_META[pendingScope].short}`
          : channelView
            ? lockedSource && !sourceInvalid
              ? `รายชื่อ · ${lockedLabel}`
              : "รายชื่อลีดทุกช่องทาง"
            : "รายชื่อลีด"
      }
    />
  );

  return (
    <LeadsPageChrome
      title={pageTitle}
      description={pageDescription}
      meta={pageMeta}
      actions={
        <>
          <NewLeadOpenButton className="kpi-leads-btn-primary">เพิ่มลีดใหม่</NewLeadOpenButton>
          <Link href="/crm/pipeline" className="kpi-leads-btn-secondary">
            ดู Pipeline
          </Link>
        </>
      }
    >
      {pendingView ? (
        <LeadPendingClient
          scopes={pendingScopeStats}
          reasons={pendingReasonStats}
          scope={pendingScope}
          reason={pendingReason}
        >
          {workspace}
        </LeadPendingClient>
      ) : channelView ? (
        <LeadChannelClient
          channels={channelStats}
          selected={sourceInvalid ? "" : lockedSource}
          clearHref={leaveChannelHref}
          invalidSource={sourceInvalid ? lockedSource : ""}
        >
          {sourceInvalid ? null : workspace}
        </LeadChannelClient>
      ) : (
        workspace
      )}
    </LeadsPageChrome>
  );
}
