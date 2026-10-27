import { prisma } from "@/lib/crm/db";
import { staffDirectory } from "@/lib/crm/queries";
import { metaAccessFor } from "./access";
import { ensureMetaOpsSchema } from "./ensure";
import { metaSubtaskProgress } from "./progress";
import {
  ADS_PRIORITY_RANK,
  MASKED_VALUE,
  metaSectionChannel,
  isActivityStatus,
  isActivityType,
  isApprovalStatus,
  isBudgetPeriod,
  isDepartment,
  isGroupBy,
  isKpiDataStatus,
  isNoteKind,
  isPriority,
  isSort,
  isTrackingStatus,
  normalizeChannel,
  normalizeStatus,
  normalizeSubtaskStatus,
  type MetaAccessView,
  type MetaActivityView,
  type AdsAuditView,
  type MetaCampaignListItem,
  type MetaGroupBy,
  type AdsKpiView,
  type MetaNoteView,
  type MetaSection,
  type MetaSort,
  type MetaSubtaskCommentView,
  type MetaSubtaskFileView,
  type MetaSubtaskView,
} from "./types";

function iso(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function text(value: string | null | undefined) {
  return value?.trim() || "";
}

function col(row: object, key: string) {
  const value = (row as Record<string, unknown>)[key];
  return text(typeof value === "string" ? value : "");
}

function budgetSortValue(value: string) {
  const parsed = Number(value.replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export type MetaListFilters = {
  q?: string;
  status?: string;
  ownerId?: string;
  department?: string;
  channel?: string;
  hotel?: string;
  market?: string;
  trackingStatus?: string;
  approvalStatus?: string;
  sort?: string;
  group?: string;
  view?: string;
};

export async function listMetaCampaigns(
  user: { id: string; role: string; modules?: string | null },
  filters: MetaListFilters,
  section: MetaSection = "campaigns",
) {
  await ensureMetaOpsSchema();
  const access = await metaAccessFor(user);
  const db = prisma();
  const [rows, staff, kpiRows, fileRows, auditRows, subtaskRows, commentRows, subtaskFiles] = await Promise.all([
    db.metaCampaign.findMany({
      include: { activities: { orderBy: { createdAt: "desc" } } },
      orderBy: { updatedAt: "desc" },
    }),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string }>),
    (db.metaKpiEntry?.findMany({ orderBy: { createdAt: "desc" } }) ?? Promise.resolve([])).catch(() => []),
    (db.metaNote?.findMany({ orderBy: { createdAt: "desc" } }) ?? Promise.resolve([])).catch(() => []),
    (db.metaAuditEvent?.findMany({ orderBy: { createdAt: "desc" } }) ?? Promise.resolve([])).catch(() => []),
    (db.metaSubtask?.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }) ?? Promise.resolve([])).catch(() => []),
    (db.metaSubtaskComment?.findMany({ orderBy: { createdAt: "asc" } }) ?? Promise.resolve([])).catch(() => []),
    (db.metaSubtaskFile?.findMany({ orderBy: { createdAt: "desc" } }) ?? Promise.resolve([])).catch(() => []),
  ]);
  const names = new Map(staff.map((item) => [item.id, item.name]));
  const query = filters.q?.trim().toLowerCase() || "";
  const sectionChannel = metaSectionChannel(section);

  let items: MetaCampaignListItem[] = rows.map((row) => {
    const budgetAmount = access.canSeeBudget ? text(row.budgetAmount) : row.budgetAmount ? MASKED_VALUE : "";
    const budgetNote = access.canSeeBudget ? text(row.budgetNote) : row.budgetNote ? MASKED_VALUE : "";
    const status = normalizeStatus(row.status);
    const subtasks: MetaSubtaskView[] = subtaskRows
      .filter((item) => item.campaignId === row.id)
      .map((item): MetaSubtaskView => ({
        id: item.id,
        campaignId: item.campaignId,
        name: item.name,
        department: isDepartment(item.department) ? item.department : "marketing",
        ownerId: item.ownerId,
        ownerName: names.get(item.ownerId) || "",
        status: normalizeSubtaskStatus(item.status),
        completed: item.completed || item.status === "completed",
        dueAt: iso(item.dueAt),
        priority: isPriority(item.priority) ? item.priority : "normal",
        comments: text(item.comments),
        thread: commentRows
          .filter((comment) => comment.subtaskId === item.id)
          .map(
            (comment): MetaSubtaskCommentView => ({
              id: comment.id,
              authorId: comment.authorId,
              authorName: names.get(comment.authorId) || "",
              body: comment.body,
              createdAt: iso(comment.createdAt),
            }),
          ),
        files: subtaskFiles
          .filter((file) => file.subtaskId === item.id)
          .map(
            (file): MetaSubtaskFileView => ({
              id: file.id,
              filename: file.filename,
              caption: file.caption,
              size: file.size,
              createdAt: iso(file.createdAt),
              href: `/api/crm/meta/files/${file.id}`,
            }),
          ),
      }));
    return {
      id: row.id,
      name: text(row.name) || text(row.hotelName),
      hotelName: text(row.hotelName),
      channel: normalizeChannel(row.channel),
      objective: text(row.objective),
      market: text(row.market),
      language: text(row.language),
      startAt: iso(row.startAt),
      endAt: iso(row.endAt),
      budgetAmount,
      budgetPeriod: isBudgetPeriod(row.budgetPeriod) ? row.budgetPeriod : "monthly",
      status,
      ownerId: row.ownerId,
      ownerName: names.get(row.ownerId) || "",
      department: isDepartment(row.department) ? row.department : "marketing",
      priority: isPriority(row.priority) ? row.priority : "normal",
      nextAction: text(row.nextAction),
      nextActionAt: iso(row.nextActionAt),
      landingUrl: text(row.landingUrl),
      bookingUrl: text(row.bookingUrl),
      trackingStatus: isTrackingStatus(row.trackingStatus) ? row.trackingStatus : "not_set",
      primaryKpi: text(row.primaryKpi),
      kpiTarget: text(row.kpiTarget),
      approvalStatus: isApprovalStatus(row.approvalStatus) ? row.approvalStatus : "not_requested",
      notes: text(row.notes),
      audienceSegment: access.canSeeAudience ? col(row, "audienceSegment") : col(row, "audienceSegment") ? MASKED_VALUE : "",
      creativeMatrixRef: col(row, "creativeMatrixRef"),
      remarketingNotes: col(row, "remarketingNotes"),
      pixelRef: access.canSeeAccounts ? col(row, "pixelRef") : col(row, "pixelRef") ? MASKED_VALUE : "",
      audienceIntent: access.canSeeAudience ? text(row.audienceIntent) : row.audienceIntent ? MASKED_VALUE : "",
      adsCreative: text(row.adsCreative),
      landingNotes: text(row.landingNotes),
      trackingNotes: text(row.trackingNotes),
      reportNotes: text(row.reportNotes),
      searchIntent: access.canSeeAudience ? text(row.searchIntent) || text(row.audienceIntent) : row.searchIntent || row.audienceIntent ? MASKED_VALUE : "",
      adCopy: text(row.adCopy),
      audience: access.canSeeAudience ? text(row.audience) : row.audience ? MASKED_VALUE : "",
      campaignMessaging: text(row.campaignMessaging),
      creativeNotes: text(row.creativeNotes) || text(row.adsCreative),
      offerPromotion: access.canSeeBudget ? text(row.offerPromotion) : row.offerPromotion ? MASKED_VALUE : "",
      rateContext: access.canSeeBudget ? text(row.rateContext) : row.rateContext ? MASKED_VALUE : "",
      roasTarget: access.canSeeBudget ? text(row.roasTarget) : row.roasTarget ? MASKED_VALUE : "",
      bookingValueNotes: access.canSeeBudget ? text(row.bookingValueNotes) : row.bookingValueNotes ? MASKED_VALUE : "",
      rateFeed: text(row.rateFeed),
      hotelAdsQuality: text(row.hotelAdsQuality),
      channelConsistency: text(row.channelConsistency),
      bookingEngineNotes: text(row.bookingEngineNotes),
      landingContent: text(row.landingContent),
      hotelValueProp: text(row.hotelValueProp),
      marketPartnerContext: text(row.marketPartnerContext),
      leadFollowUp: text(row.leadFollowUp),
      budgetAuth: access.isManagement ? text(row.budgetAuth) : row.budgetAuth ? MASKED_VALUE : "",
      kpiReview: text(row.kpiReview),
      finalDecision: access.isManagement ? text(row.finalDecision) : row.finalDecision ? MASKED_VALUE : "",
      accountRef: access.canSeeAccounts ? text(row.accountRef) : row.accountRef ? MASKED_VALUE : "",
      budgetNote,
      accountMasked: Boolean(row.accountRef) && !access.canSeeAccounts,
      budgetMasked: Boolean(row.budgetAmount || row.budgetNote || row.roasTarget) && !access.canSeeBudget,
      audienceMasked: Boolean(row.audience || row.audienceIntent || col(row, "audienceSegment")) && !access.canSeeAudience,
      pixelMasked: Boolean(col(row, "pixelRef")) && !access.canSeeAccounts,
      escalatedAt: iso(row.escalatedAt),
      closedAt: iso(row.closedAt),
      createdAt: iso(row.createdAt),
      updatedAt: iso(row.updatedAt),
      progress: metaSubtaskProgress(subtasks, status),
      subtasks,
      activities: row.activities.map(
        (item): MetaActivityView => ({
          id: item.id,
          campaignId: item.campaignId,
          type: isActivityType(item.type) ? item.type : "brief",
          title: item.title,
          dueAt: iso(item.dueAt),
          status: isActivityStatus(item.status) ? item.status : "planned",
          notes: item.notes,
          ownerId: item.ownerId,
          ownerName: names.get(item.ownerId) || "",
          createdAt: iso(item.createdAt),
        }),
      ),
      kpis: kpiRows
        .filter((item) => item.campaignId === row.id)
        .map(
          (item): AdsKpiView => ({
            id: item.id,
            campaignId: item.campaignId,
            period: item.period,
            metric: item.metric,
            value: item.value,
            target: item.target,
            dataStatus: isKpiDataStatus(item.dataStatus) ? item.dataStatus : "draft",
            notes: item.notes,
            createdAt: iso(item.createdAt),
          }),
        ),
      files: fileRows
        .filter((item) => item.campaignId === row.id)
        .map(
          (item): MetaNoteView => ({
            id: item.id,
            campaignId: item.campaignId,
            kind: isNoteKind(item.kind) ? item.kind : "note",
            title: item.title,
            body: item.body,
            url: item.url,
            createdAt: iso(item.createdAt),
            createdByName: names.get(item.createdBy) || "",
          }),
        ),
      audit: auditRows
        .filter((item) => item.campaignId === row.id)
        .slice(0, 40)
        .map(
          (item): AdsAuditView => ({
            id: item.id,
            action: item.action,
            detail: item.detail,
            createdAt: iso(item.createdAt),
            createdByName: names.get(item.createdBy) || "",
          }),
        ),
    };
  });

  if (sectionChannel) items = items.filter((item) => item.channel === sectionChannel);
  if (section === "approvals") {
    items = items.filter((item) => item.status === "awaiting_approval" || item.approvalStatus === "awaiting");
  }
  if (query) {
    items = items.filter((item) =>
      `${item.name} ${item.hotelName} ${item.market} ${item.nextAction} ${item.notes} ${item.objective} ${item.landingUrl} ${item.audienceSegment} ${item.creativeMatrixRef}`
        .toLowerCase()
        .includes(query),
    );
  }
  if (filters.status) items = items.filter((item) => item.status === filters.status);
  if (filters.ownerId) items = items.filter((item) => item.ownerId === filters.ownerId);
  if (filters.department) items = items.filter((item) => item.department === filters.department);
  if (filters.channel) items = items.filter((item) => item.channel === filters.channel);
  if (filters.hotel) items = items.filter((item) => item.hotelName === filters.hotel);
  if (filters.market) items = items.filter((item) => item.market === filters.market);
  if (filters.trackingStatus) items = items.filter((item) => item.trackingStatus === filters.trackingStatus);
  if (filters.approvalStatus) items = items.filter((item) => item.approvalStatus === filters.approvalStatus);

  const sort: MetaSort = isSort(filters.sort || "") ? (filters.sort as MetaSort) : defaultSort(section);
  items.sort((a, b) => {
    if (sort === "priority") return ADS_PRIORITY_RANK[a.priority] - ADS_PRIORITY_RANK[b.priority];
    if (sort === "budget") return budgetSortValue(b.budgetAmount) - budgetSortValue(a.budgetAmount);
    if (sort === "startAt") return (a.startAt || "9999").localeCompare(b.startAt || "9999");
    if (sort === "endAt") return (a.endAt || "9999").localeCompare(b.endAt || "9999");
    if (sort === "updatedAt") return b.updatedAt.localeCompare(a.updatedAt);
    return (a.nextActionAt || "9999").localeCompare(b.nextActionAt || "9999");
  });

  const groupBy: MetaGroupBy = isGroupBy(filters.group || "") ? (filters.group as MetaGroupBy) : defaultGroup(section);

  return {
    access,
    items,
    staff,
    groupBy,
    sort,
    facets: {
      hotels: Array.from(new Set(rows.map((item) => item.hotelName).filter(Boolean))),
      markets: Array.from(new Set(rows.map((item) => item.market).filter(Boolean))),
    },
  };
}

function defaultGroup(section: MetaSection): MetaGroupBy {
  if (section === "audiences") return "market";
  if (section === "creative-matrix") return "hotel";
  if (section === "ads") return "channel";
  if (section === "landing-pages") return "hotel";
  if (section === "tracking") return "status";
  if (section === "approvals") return "department";
  if (section === "reports") return "channel";
  return "status";
}

function defaultSort(section: MetaSection): MetaSort {
  if (section === "reports") return "updatedAt";
  if (section === "approvals") return "updatedAt";
  return "nextActionAt";
}

export async function listMetaAccessRows() {
  await ensureMetaOpsSchema();
  const [rows, staff] = await Promise.all([
    prisma().metaAccess.findMany({ orderBy: { createdAt: "asc" } }),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string; email: string }>),
  ]);
  return { rows, staff };
}

export async function metaOpsOverview(user: { id: string; role: string; modules?: string | null }) {
  await ensureMetaOpsSchema();
  const access = await metaAccessFor(user);
  const [total, live, due] = await Promise.all([
    prisma().metaCampaign.count(),
    prisma().metaCampaign.count({ where: { status: { in: ["active", "optimizing", "live"] } } }),
    prisma().metaActivity.count({
      where: { status: { in: ["planned", "in_progress"] }, dueAt: { lte: new Date() } },
    }),
  ]);
  return { access, total, live, due };
}
