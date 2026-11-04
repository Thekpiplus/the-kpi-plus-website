"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, type ReactNode } from "react";
import {
  addHotelMarketingSubtaskComment,
  archiveHotelMarketingRecord,
  assignHotelMarketingOwner,
  changeHotelMarketingStatus,
  completeHotelMarketingSubtask,
  decideHotelMarketingApproval,
  decideHotelMarketingSubtask,
  escalateHotelMarketingSubtask,
  removeHotelMarketingRecord,
  removeHotelMarketingSubtask,
  reorderHotelMarketingSubtask,
  saveHotelMarketingRecord,
  saveHotelMarketingSubtask,
  updateHotelMarketingSubtaskStatus,
} from "@/lib/hotel-marketing-ops/actions";
import {
  HMO_APPROVAL_LABEL,
  HMO_APPROVAL_QUEUE_STATUSES,
  HMO_ASSET_PERMISSION_LABEL,
  HMO_BASE_PATH,
  HMO_DEPARTMENTS,
  HMO_DEPARTMENT_PATH,
  HMO_DRAFT_STATUS_LABEL,
  HMO_GATE_LABEL,
  HMO_GROUP_BY,
  HMO_GROUP_LABEL,
  HMO_IMAGE_PERMISSION_LABEL,
  HMO_KIND_LABEL,
  HMO_KINDS,
  HMO_PRIORITY_LABEL,
  HMO_RELEASE_STATUSES,
  HMO_SECTION_DEFAULT_KIND,
  HMO_SECTION_KIND_FILTER,
  HMO_SECTION_LABEL,
  HMO_SECTION_PATH,
  HMO_SORT_LABEL,
  HMO_SORTS,
  HMO_SOURCE_CITATION_LABEL,
  HMO_STATUS_LABEL,
  HMO_STATUSES,
  HMO_SUBTASK_STATUS_LABEL,
  HMO_VERIFIED_LABEL,
  hmoCalendarDate,
  hmoDateKey,
  hmoDepartmentLabel,
  hmoErrorMessage,
  hmoFormatDate,
  hmoGateKind,
  hmoMonthLabel,
  hmoRecordSourceLinks,
  validateHmoRecord,
  type HmoAccessView,
  type HmoGroupBy,
  type HmoKind,
  type HmoListFilters,
  type HmoRecordRow,
  type HmoSection,
  type HmoSettings,
  type HmoStatus,
  type HmoSubtaskStatus,
  type HmoSubtaskView,
} from "@/lib/hotel-marketing-ops/types";
import { B2bDialog } from "@/components/b2b-ops/ui";
import { HotelMarketingOpsRecordForm, emptyHmoDraft, hmoDraftFromRow, hmoDraftIssues, type HmoRecordDraft } from "./HotelMarketingOpsRecordForm";
import { HotelMarketingOpsSubtasksPanel, emptyHmoSubtaskDraft, type HmoSubtaskDraft } from "./HotelMarketingOpsSubtasksPanel";
import "@/components/b2b-ops/b2b-ops.css";
import "./hotel-marketing-ops.css";

type Staff = { id: string; name: string };
type Msg = { ok: string; error: string };
type ActionResult = { ok: true; id: string } | { ok: false; error: string };
const NO_MSG: Msg = { ok: "", error: "" };

const KIND_SECTION: Record<HmoKind, HmoSection> = {
  article: "article_backlog",
  campaign: "campaign_calendar",
  channel_plan: "channel_plan",
  seo_brief: "seo_briefs",
  metric: "metrics",
  asset: "assets",
  related_link: "related_links",
  translation: "translation",
  report: "reports",
};

function detailFor(row: HmoRecordRow): string {
  const p = row.payload;
  switch (row.kind) {
    case "article":
      return [
        HMO_DRAFT_STATUS_LABEL[p.draftStatus as keyof typeof HMO_DRAFT_STATUS_LABEL],
        `Sources: ${HMO_SOURCE_CITATION_LABEL[p.sourceCitationStatus as keyof typeof HMO_SOURCE_CITATION_LABEL] || "—"}`,
        `Images: ${HMO_IMAGE_PERMISSION_LABEL[p.imagePermissionStatus as keyof typeof HMO_IMAGE_PERMISSION_LABEL] || "—"}`,
      ]
        .filter(Boolean)
        .join(" · ");
    case "campaign":
      return [p.campaignName, p.period].filter(Boolean).join(" · ") || "—";
    case "channel_plan":
      return p.roleInPath || p.dependency || "—";
    case "seo_brief":
      return p.primaryIntent || p.targetQueries.split("\n")[0] || "—";
    case "metric":
      return HMO_VERIFIED_LABEL[p.verifiedStatus as keyof typeof HMO_VERIFIED_LABEL] || "—";
    case "asset":
      return [p.assetType, HMO_ASSET_PERMISSION_LABEL[p.permissionStatus as keyof typeof HMO_ASSET_PERMISSION_LABEL], p.containsClientOrGuestData ? "client/guest data flagged" : ""]
        .filter(Boolean)
        .join(" · ");
    case "related_link":
      return p.label || p.href || "—";
    case "translation":
      return `${p.sourceLocale} → ${p.targetLocale}${p.statusNote ? ` · ${p.statusNote}` : ""}`;
    case "report":
      return [p.period, p.method].filter(Boolean).join(" · ") || "—";
    default:
      return "—";
  }
}

function summaryFor(row: HmoRecordRow): Array<[string, string]> {
  const p = row.payload;
  const out: Array<[string, string]> = [];
  const add = (label: string, value: string | undefined) => {
    if (value && value.trim()) out.push([label, value]);
  };
  switch (row.kind) {
    case "article":
      add("Audience", p.targetAudience);
      add("Search intent", p.searchIntent);
      add("Content goal", p.contentGoal);
      add("Draft", HMO_DRAFT_STATUS_LABEL[p.draftStatus as keyof typeof HMO_DRAFT_STATUS_LABEL]);
      add("Sources", HMO_SOURCE_CITATION_LABEL[p.sourceCitationStatus as keyof typeof HMO_SOURCE_CITATION_LABEL]);
      add("Image permission", HMO_IMAGE_PERMISSION_LABEL[p.imagePermissionStatus as keyof typeof HMO_IMAGE_PERMISSION_LABEL]);
      add("SEO title", p.seoTitle);
      add("SEO description", p.seoDescription);
      break;
    case "campaign":
      add("Campaign", p.campaignName);
      add("Property label", p.propertyLabel);
      add("Department owner", p.departmentOwner);
      add("Objective", p.objective);
      add("Landing page", p.landingPage);
      add("Booking path", p.bookingPathDependency);
      add("KPI definition", p.kpiDefinition);
      add("Period", p.period);
      add("Data source", p.dataSource);
      add("Risk / approval", p.riskApproval);
      add("Next action date", p.nextActionDate);
      break;
    case "metric":
      add("Definition", p.definition);
      add("Period", p.period);
      add("Source", p.source);
      add("Owner", p.ownerLabel);
      add("Verified", HMO_VERIFIED_LABEL[p.verifiedStatus as keyof typeof HMO_VERIFIED_LABEL]);
      break;
    case "asset":
      add("Type", p.assetType);
      add("Alt text", p.altText);
      add("Permission", HMO_ASSET_PERMISSION_LABEL[p.permissionStatus as keyof typeof HMO_ASSET_PERMISSION_LABEL]);
      add("Permission note", p.permissionNote);
      add("Source note", p.sourceNote);
      add("Client / guest data", p.containsClientOrGuestData ? "Yes — redaction/approval required" : "No");
      break;
    case "seo_brief":
      add("Primary intent", p.primaryIntent);
      add("Target queries", p.targetQueries);
      add("Outline", p.outline);
      add("Related services", p.relatedServices);
      break;
    case "channel_plan":
      add("Role in path", p.roleInPath);
      add("Owner dept", p.ownerDept);
      add("Dependency", p.dependency);
      break;
    case "related_link":
      add("Link", p.href);
      add("Label", p.label);
      add("Why", p.why);
      break;
    case "translation":
      add("Source locale", p.sourceLocale);
      add("Target locale", p.targetLocale);
      add("Status note", p.statusNote);
      break;
    case "report":
      add("Definition", p.definition);
      add("Period", p.period);
      add("Method", p.method);
      break;
  }
  add("Notes", p.notes);
  return out;
}

function groupValue(row: HmoRecordRow, groupBy: HmoGroupBy) {
  if (groupBy === "department") return row.department;
  if (groupBy === "kind") return row.kind;
  if (groupBy === "channel") return row.channel || "none";
  if (groupBy === "month") return hmoDateKey(hmoCalendarDate(row)).slice(0, 7) || "none";
  return row.status;
}

function dateCell(row: HmoRecordRow) {
  if (row.publishAt) return `Publish ${hmoFormatDate(row.publishAt, true)}`;
  if (row.dueAt) return `Due ${hmoFormatDate(row.dueAt, true)}`;
  return "—";
}

function RowStatusForm({
  row,
  pending,
  canApprove,
  onSubmit,
}: {
  row: HmoRecordRow;
  pending: boolean;
  canApprove: boolean;
  onSubmit: (status: HmoStatus) => void;
}) {
  return (
    <form
      className="b2b-inline"
      key={`${row.id}-${row.status}`}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(String(new FormData(event.currentTarget).get("status")) as HmoStatus);
      }}
    >
      <select className="crm-select" name="status" defaultValue={row.status} aria-label={`Status ${row.title}`}>
        {HMO_STATUSES.map((item) => (
          <option key={item} value={item} disabled={!canApprove && HMO_RELEASE_STATUSES.includes(item) && item !== row.status}>
            {HMO_STATUS_LABEL[item]}
          </option>
        ))}
      </select>
      <button className="kpi-button b2b-save" type="submit" disabled={pending}>
        บันทึก / Save
      </button>
    </form>
  );
}

export function HotelMarketingOpsBoard({
  section,
  items,
  staff,
  access,
  settings,
  facets,
  filters,
  groupBy,
  sort,
  kindCounts,
  basePath,
  lockedDepartment,
}: {
  section: HmoSection;
  items: HmoRecordRow[];
  staff: Staff[];
  access: HmoAccessView;
  settings: HmoSettings;
  facets: { channels: string[]; categories: string[] };
  filters: HmoListFilters;
  groupBy: HmoGroupBy;
  sort: string;
  kindCounts: Record<HmoKind, number>;
  basePath: string;
  lockedDepartment?: string;
}) {
  const router = useRouter();
  const extras = settings.extraDepartments;
  const departments = useMemo(() => [...HMO_DEPARTMENTS, ...extras.map((item) => item.id)] as string[], [extras]);
  const defaultKind = HMO_SECTION_DEFAULT_KIND[section];
  const defaultDepartment =
    lockedDepartment || (access.isManagement || access.departments.includes("marketing_content") ? "marketing_content" : access.departments[0] || "marketing_content");

  const [pending, setPending] = useState(false);
  const [msgs, setMsgs] = useState<Record<string, Msg>>({});
  const [drawer, setDrawer] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [saveStamp, setSaveStamp] = useState(0);
  const [showIssues, setShowIssues] = useState(false);
  const [draft, setDraft] = useState<HmoRecordDraft>(() => emptyHmoDraft(access.userId, defaultKind, defaultDepartment));
  const [subDraft, setSubDraft] = useState<HmoSubtaskDraft>(() => emptyHmoSubtaskDraft(access.userId, defaultDepartment));
  const [expanded, setExpanded] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [archiveId, setArchiveId] = useState("");
  const view = filters.view === "board" ? "board" : "table";
  const current = items.find((item) => item.id === draft.id);
  const msg = (scope: string) => msgs[scope] ?? NO_MSG;

  async function run(scope: string, task: () => Promise<ActionResult>, success: string): Promise<ActionResult | null> {
    setPending(true);
    setMsgs((state) => ({ ...state, [scope]: NO_MSG }));
    try {
      const result = await task();
      if (!result.ok) {
        setMsgs((state) => ({ ...state, [scope]: { ok: "", error: hmoErrorMessage(result.error) } }));
        return null;
      }
      setMsgs((state) => ({ ...state, [scope]: { ok: `${success} ✓`, error: "" } }));
      router.refresh();
      return result;
    } catch {
      setMsgs((state) => ({ ...state, [scope]: { ok: "", error: "บันทึกไม่สำเร็จ ลองอีกครั้ง / Save failed, please try again" } }));
      return null;
    } finally {
      setPending(false);
    }
  }

  function form(entries: Record<string, string>) {
    const data = new FormData();
    Object.entries(entries).forEach(([key, value]) => data.set(key, value));
    return data;
  }

  function openCreate() {
    setDraft(emptyHmoDraft(access.userId, defaultKind, defaultDepartment));
    setSubDraft(emptyHmoSubtaskDraft(access.userId, defaultDepartment));
    setMsgs((state) => ({ ...state, record: NO_MSG, subtask: NO_MSG, approval: NO_MSG }));
    setShowIssues(false);
    setFormKey((value) => value + 1);
    setDrawer(true);
  }

  function openRow(row: HmoRecordRow) {
    setDraft(hmoDraftFromRow(row));
    setSubDraft(emptyHmoSubtaskDraft(access.userId, row.department));
    setMsgs((state) => ({ ...state, record: NO_MSG, subtask: NO_MSG, approval: NO_MSG }));
    setShowIssues(false);
    setFormKey((value) => value + 1);
    setDrawer(true);
  }

  async function saveDraft() {
    const issues = hmoDraftIssues(draft);
    const code = validateHmoRecord({
      kind: draft.kind,
      title: draft.title,
      channel: draft.channel,
      nextAction: draft.nextAction,
      category: draft.category,
      payload: draft.payload,
    });
    if (code || issues.size) {
      setShowIssues(true);
      setMsgs((state) => ({ ...state, record: { ok: "", error: hmoErrorMessage(code || "required_title") } }));
      return;
    }
    const data = form({
      id: draft.id,
      kind: draft.kind,
      title: draft.title,
      category: draft.category,
      department: draft.department,
      ownerId: draft.ownerId,
      authorId: draft.authorId,
      reviewerId: draft.reviewerId,
      status: draft.status,
      priority: draft.priority,
      channel: draft.channel,
      publishAt: draft.publishAt,
      lastReviewAt: draft.lastReviewAt,
      nextAction: draft.nextAction,
      nextActionOwnerId: draft.nextActionOwnerId,
      dueAt: draft.dueAt,
      payloadJson: JSON.stringify(draft.payload),
    });
    const result = await run("record", () => saveHotelMarketingRecord(data), draft.id ? "บันทึกแล้ว / Saved" : "สร้างรายการแล้ว / Created");
    if (result?.ok) {
      setShowIssues(false);
      setSaveStamp((value) => value + 1);
      if (!draft.id) setDraft((state) => ({ ...state, id: result.id }));
    }
  }

  async function saveSubtask() {
    if (!draft.id) return;
    if (!subDraft.name.trim()) {
      setMsgs((state) => ({ ...state, subtask: { ok: "", error: hmoErrorMessage("missing_name") } }));
      return;
    }
    const data = form({
      id: subDraft.id,
      recordId: draft.id,
      name: subDraft.name,
      department: subDraft.department,
      ownerId: subDraft.ownerId,
      reviewerId: subDraft.reviewerId,
      status: subDraft.status,
      completed: subDraft.status === "completed" ? "1" : "0",
      dueAt: subDraft.dueAt ? new Date(`${subDraft.dueAt}T00:00:00+07:00`).toISOString() : "",
      priority: subDraft.priority,
      comments: subDraft.comments,
      evidence: subDraft.evidence,
      gateKind: subDraft.gateKind,
    });
    const result = await run("subtask", () => saveHotelMarketingSubtask(data), subDraft.id ? "บันทึกงานย่อยแล้ว / Subtask saved" : "เพิ่มงานย่อยแล้ว / Subtask added");
    if (result?.ok) setSubDraft(emptyHmoSubtaskDraft(access.userId, current?.department || draft.department));
  }

  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  if (sort) query.set("sort", sort);
  if (groupBy) query.set("group", groupBy);

  function hrefFor(next: Record<string, string>) {
    const params = new URLSearchParams(query);
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (lockedDepartment) params.delete("department");
    const text = params.toString();
    return text ? `${basePath}?${text}` : basePath;
  }

  const counts = useMemo(
    () => ({
      total: items.length,
      queue: items.filter((item) => HMO_APPROVAL_QUEUE_STATUSES.includes(item.status)).length,
      ready: items.filter((item) => ["approved", "scheduled", "published"].includes(item.status)).length,
      blocked: items.filter((item) => item.status === "blocked" || item.progress.blockedByGate).length,
    }),
    [items],
  );

  const groups = useMemo(() => {
    let keys: string[];
    if (groupBy === "status") keys = [...HMO_STATUSES];
    else if (groupBy === "department") keys = departments.filter((key) => items.some((item) => item.department === key) || view === "board");
    else if (groupBy === "kind") keys = [...HMO_KINDS].filter((key) => items.some((item) => item.kind === key));
    else {
      keys = Array.from(new Set(items.map((item) => groupValue(item, groupBy))));
      keys.sort((a, b) => (a === "none" ? 1 : b === "none" ? -1 : a.localeCompare(b)));
    }
    return keys.map((key) => ({
      key,
      label:
        groupBy === "status"
          ? HMO_STATUS_LABEL[key as HmoStatus]
          : groupBy === "department"
            ? hmoDepartmentLabel(key, extras)
            : groupBy === "kind"
              ? HMO_KIND_LABEL[key as HmoKind]
              : groupBy === "month"
                ? key === "none"
                  ? "No date"
                  : hmoMonthLabel(key)
                : key === "none"
                  ? "No channel"
                  : key,
      items: items.filter((item) => groupValue(item, groupBy) === key),
    }));
  }, [departments, extras, groupBy, items, view]);

  /* ---------------------------------------------------------------- row UI */

  const rowState = (row: HmoRecordRow) => {
    const state = msg(`row:${row.id}`);
    if (!state.ok && !state.error) return null;
    return (
      <span className={`crm-cs-save-state hmo-row-state${state.error ? " is-error" : " is-ok"}`} role="status">
        {state.error || state.ok}
      </span>
    );
  };

  const subtaskLine = (item: HmoSubtaskView) => (
    <li key={item.id}>
      {item.name} · {HMO_SUBTASK_STATUS_LABEL[item.status]}
      {item.gateKind !== "none" ? ` · ${HMO_GATE_LABEL[item.gateKind]}` : ""}
      {item.ownerName ? ` · ${item.ownerName}` : ""}
      {item.thread.length ? ` · ${item.thread.length} comment${item.thread.length > 1 ? "s" : ""}` : ""}
    </li>
  );

  const expandBlock = (row: HmoRecordRow) => {
    const links = hmoRecordSourceLinks(row);
    const summary = summaryFor(row);
    const latestComments = row.subtasks.flatMap((item) => item.thread.map((entry) => ({ ...entry, subtask: item.name }))).slice(-4);
    return (
      <div className="hmo-expand">
        <dl>
          <dt>Kind</dt>
          <dd>
            {HMO_KIND_LABEL[row.kind]}
            {row.category ? ` · ${row.category}` : ""}
          </dd>
          <dt>Department</dt>
          <dd>{hmoDepartmentLabel(row.department, extras)}</dd>
          <dt>Owner / author</dt>
          <dd>
            {row.ownerName || "—"} / {row.authorName || "—"}
          </dd>
          <dt>Reviewer (approver)</dt>
          <dd>{row.reviewerName || "—"}</dd>
          <dt>Next action</dt>
          <dd>
            {row.nextAction || "—"}
            {row.nextActionOwnerName ? ` — ${row.nextActionOwnerName}` : ""}
          </dd>
          <dt>Dates</dt>
          <dd>
            Publish {hmoFormatDate(row.publishAt, true) || "—"} · Due {hmoFormatDate(row.dueAt, true) || "—"} · Last review {hmoFormatDate(row.lastReviewAt) || "—"}
          </dd>
          {summary.map(([label, value]) => (
            <Fragment key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
        <div className="hmo-expand-cols">
          <div>
            <h4>Source links</h4>
            <ul>
              {links.length ? (
                links.map((href) => (
                  <li key={href}>
                    {href.startsWith("/") ? <Link href={href}>{href}</Link> : (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {href}
                      </a>
                    )}
                  </li>
                ))
              ) : (
                <li>ไม่มีลิงก์ / None recorded</li>
              )}
            </ul>
          </div>
          <div>
            <h4>
              Subtasks <span className={`hmo-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {row.progress.percent}%
            </h4>
            {row.progress.blockedByGate ? (
              <p className="hmo-gate-alert">
                Blocked — {row.progress.gateReasons.map((item) => HMO_GATE_LABEL[item]).join(", ")} (stops publication even if progress is high)
              </p>
            ) : null}
            {row.progress.byDepartment.length ? (
              <ul className="hmo-dept-badges">
                {row.progress.byDepartment.map((item) => (
                  <li key={item.department}>
                    <span className="hmo-badge is-in_progress">
                      {hmoDepartmentLabel(item.department, extras)} {item.countLabel}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            <ul>{row.subtasks.length ? row.subtasks.map(subtaskLine) : <li>ยังไม่มีงานย่อย / None yet</li>}</ul>
          </div>
          <div>
            <h4>Comments</h4>
            <ul>
              {latestComments.length ? (
                latestComments.map((entry) => (
                  <li key={entry.id}>
                    <strong>{entry.authorName || "—"}</strong> on “{entry.subtask}”: {entry.body}
                  </li>
                ))
              ) : (
                <li>ยังไม่มีความเห็น / None yet</li>
              )}
            </ul>
          </div>
          <div>
            <h4>Approvals</h4>
            <ul>
              {row.approvals.length ? (
                row.approvals.slice(-4).map((item) => (
                  <li key={item.id}>
                    {HMO_APPROVAL_LABEL[item.status]} · {item.decidedByName || row.reviewerName || "—"} · {item.notes}
                  </li>
                ))
              ) : (
                <li>ยังไม่มีบันทึกอนุมัติ / None yet</li>
              )}
            </ul>
          </div>
          <div>
            <h4>Audit history</h4>
            <ul>
              {row.history.length ? (
                row.history.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    {hmoFormatDate(item.createdAt, true)} · {item.createdByName || "—"} · {item.action} · {item.detail}
                  </li>
                ))
              ) : (
                <li>ยังไม่มีประวัติ / None yet</li>
              )}
            </ul>
          </div>
        </div>
        {access.canEditBoard ? (
          <form
            className="b2b-inline"
            onSubmit={(event) => {
              event.preventDefault();
              const ownerId = String(new FormData(event.currentTarget).get("ownerId") || "");
              void run(`row:${row.id}`, () => assignHotelMarketingOwner(form({ id: row.id, ownerId })), "มอบหมายแล้ว / Assigned");
            }}
          >
            <select className="crm-select" name="ownerId" defaultValue={row.ownerId} aria-label={`Owner ${row.title}`}>
              <option value="">—</option>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              มอบหมาย / Assign
            </button>
          </form>
        ) : null}
      </div>
    );
  };

  const actions = (row: HmoRecordRow) => (
    <div className="b2b-row-actions">
      <button type="button" className="crm-users-secondary" aria-expanded={expanded === row.id} onClick={() => setExpanded(expanded === row.id ? "" : row.id)}>
        {expanded === row.id ? "ซ่อน / Hide" : "ขยาย / Expand"}
      </button>
      {access.canEditBoard ? (
        <>
          <RowStatusForm
            row={row}
            pending={pending}
            canApprove={access.canApprove}
            onSubmit={(status) => void run(`row:${row.id}`, () => changeHotelMarketingStatus(form({ id: row.id, status })), "เปลี่ยนสถานะแล้ว / Status saved")}
          />
          <button type="button" className="crm-users-secondary" onClick={() => openRow(row)}>
            แก้ไข / Edit
          </button>
          <button type="button" className="crm-users-secondary" onClick={() => setArchiveId(row.id)} disabled={row.archived}>
            Archive
          </button>
          <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(row.id)}>
            ลบ / Delete
          </button>
        </>
      ) : null}
      {rowState(row)}
    </div>
  );

  type Column = { key: string; label: string; render: (row: HmoRecordRow) => ReactNode };
  const itemColumn: Column = {
    key: "item",
    label: section === "metrics" ? "Metric" : "Item",
    render: (row) => (
      <>
        <button type="button" className="b2b-name" onClick={() => openRow(row)}>
          {row.title || "(untitled)"}
        </button>
        <small>
          {HMO_KIND_LABEL[row.kind]}
          {row.category ? ` · ${row.category}` : ""}
          {row.archived ? " · archived" : ""}
        </small>
      </>
    ),
  };
  const statusColumn: Column = {
    key: "status",
    label: "Status",
    render: (row) => (
      <>
        <span className={`b2b-status is-${row.status}`}>{HMO_STATUS_LABEL[row.status]}</span>{" "}
        {row.progress.total ? <span className={`hmo-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> : null}
      </>
    ),
  };
  const columns: Column[] =
    section === "metrics"
      ? [
          itemColumn,
          { key: "definition", label: "Definition", render: (row) => row.payload.definition || "—" },
          { key: "period", label: "Period", render: (row) => row.payload.period || "—" },
          { key: "source", label: "Source", render: (row) => row.payload.source || "—" },
          { key: "owner", label: "Owner", render: (row) => row.payload.ownerLabel || row.ownerName || "—" },
          {
            key: "verified",
            label: "Verified",
            render: (row) => <span className={`b2b-status is-${row.payload.verifiedStatus === "verified" ? "verified" : row.payload.verifiedStatus === "requires_review" ? "in_review" : "draft"}`}>{HMO_VERIFIED_LABEL[row.payload.verifiedStatus as keyof typeof HMO_VERIFIED_LABEL] || "—"}</span>,
          },
          statusColumn,
          { key: "department", label: "Department", render: (row) => hmoDepartmentLabel(row.department, extras) },
        ]
      : [
          itemColumn,
          { key: "department", label: "Department", render: (row) => hmoDepartmentLabel(row.department, extras) },
          { key: "owner", label: "Owner", render: (row) => row.ownerName || "—" },
          statusColumn,
          { key: "priority", label: "Priority", render: (row) => <span className={`b2b-status b2b-priority is-${row.priority}`}>{HMO_PRIORITY_LABEL[row.priority]}</span> },
          { key: "channel", label: "Channel", render: (row) => row.channel || "—" },
          { key: "date", label: section === "editorial_calendar" ? "Publish / due" : "Date", render: dateCell },
          { key: "next", label: "Next action", render: (row) => row.nextAction || "—" },
          { key: "details", label: "Details", render: detailFor },
        ];

  const tableRows = (rows: HmoRecordRow[]) =>
    rows.map((row) => (
      <Fragment key={row.id}>
        <tr>
          {columns.map((column) => (
            <td key={column.key} data-label={column.label}>
              {column.render(row)}
            </td>
          ))}
          <td data-label="Actions">{actions(row)}</td>
        </tr>
        {expanded === row.id ? (
          <tr className="hmo-expand-row">
            <td colSpan={columns.length + 1}>{expandBlock(row)}</td>
          </tr>
        ) : null}
      </Fragment>
    ));

  const card = (row: HmoRecordRow) => (
    <article className="b2b-card" key={row.id}>
      <button type="button" className="b2b-name" onClick={() => openRow(row)}>
        {row.title || "(untitled)"}
      </button>
      <p>
        {HMO_KIND_LABEL[row.kind]} · {hmoDepartmentLabel(row.department, extras)}
      </p>
      <div className="b2b-meta">
        <span className={`b2b-status is-${row.status}`}>{HMO_STATUS_LABEL[row.status]}</span>
        <span className={`b2b-status b2b-priority is-${row.priority}`}>{HMO_PRIORITY_LABEL[row.priority]}</span>
        {row.progress.total ? <span className={`hmo-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> : null}
      </div>
      <p>
        {row.ownerName || "—"} · {dateCell(row)}
        {row.channel ? ` · ${row.channel}` : ""}
      </p>
      <p>{detailFor(row)}</p>
      {actions(row)}
      {expanded === row.id ? expandBlock(row) : null}
    </article>
  );

  const page = msg("page");

  return (
    <div className="b2b-page hmo-ops">
      {page.error ? (
        <p className="crm-users-alert is-warn crm-cs-save-state is-error" role="alert">
          {page.error}
        </p>
      ) : null}
      {page.ok ? (
        <p className="crm-users-alert is-ok crm-cs-save-state is-ok" role="status">
          {page.ok}
        </p>
      ) : null}

      <div className="hmo-stats" aria-label="Board summary">
        <div className="hmo-stat">
          <strong>{counts.total}</strong>
          <span>{HMO_SECTION_LABEL[section]}</span>
        </div>
        <div className="hmo-stat">
          <strong>{counts.queue}</strong>
          <span>In review / needs sources / permissions</span>
        </div>
        <div className="hmo-stat">
          <strong>{counts.ready}</strong>
          <span>Approved / scheduled / published</span>
        </div>
        <div className="hmo-stat">
          <strong>{counts.blocked}</strong>
          <span>Blocked</span>
        </div>
      </div>

      {section === "overview" ? (
        <nav className="hmo-kind-strip" aria-label="Record kinds">
          {HMO_KINDS.map((kind) => (
            <Link key={kind} className="hmo-kind-card" href={HMO_SECTION_PATH[KIND_SECTION[kind]]}>
              <strong>{HMO_KIND_LABEL[kind]}</strong>
              <span>{kindCounts[kind]} active</span>
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="b2b-toolbar">
        <div className="b2b-tabs" role="group" aria-label="Board view">
          <Link className={`b2b-tab${view === "table" ? " is-active" : ""}`} href={hrefFor({ view: "table" })} aria-current={view === "table" ? "page" : undefined}>
            Table
          </Link>
          <Link className={`b2b-tab${view === "board" ? " is-active" : ""}`} href={hrefFor({ view: "board" })} aria-current={view === "board" ? "page" : undefined}>
            Board
          </Link>
        </div>
        <form className="b2b-filters" method="get" action={basePath}>
          <input type="hidden" name="view" value={view} />
          <input className="crm-field hmo-filter-wide" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหา / Search title, channel, notes" aria-label="Search" />
          {lockedDepartment ? null : (
            <select className="crm-select" name="department" defaultValue={filters.department ?? ""} aria-label="Department">
              <option value="">ทุกแผนก / All departments</option>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {hmoDepartmentLabel(item, extras)}
                </option>
              ))}
            </select>
          )}
          <select className="crm-select" name="ownerId" defaultValue={filters.ownerId ?? ""} aria-label="Owner">
            <option value="">ทุกเจ้าของ / All owners</option>
            {staff.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select className="crm-select" name="channel" defaultValue={filters.channel ?? ""} aria-label="Channel">
            <option value="">ทุกช่องทาง / All channels</option>
            {facets.channels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="crm-select" name="status" defaultValue={filters.status ?? ""} aria-label="Status">
            <option value="">ทุกสถานะ / All statuses</option>
            {HMO_STATUSES.map((item) => (
              <option key={item} value={item}>
                {HMO_STATUS_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="category" defaultValue={filters.category ?? ""} aria-label="Category">
            <option value="">ทุกหมวด / All categories</option>
            {facets.categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {HMO_SECTION_KIND_FILTER[section] ? null : (
            <select className="crm-select" name="kind" defaultValue={filters.kind ?? ""} aria-label="Kind">
              <option value="">ทุกประเภท / All kinds</option>
              {HMO_KINDS.map((item) => (
                <option key={item} value={item}>
                  {HMO_KIND_LABEL[item]}
                </option>
              ))}
            </select>
          )}
          <label className="hmo-filter-check" title="Filter by publish date, or due date when there is no publish date">
            <span>From</span>
            <input className="crm-field" type="date" name="dateFrom" defaultValue={filters.dateFrom ?? ""} aria-label="Date from" />
          </label>
          <label className="hmo-filter-check">
            <span>To</span>
            <input className="crm-field" type="date" name="dateTo" defaultValue={filters.dateTo ?? ""} aria-label="Date to" />
          </label>
          <select className="crm-select" name="group" defaultValue={groupBy} aria-label="Group by">
            {HMO_GROUP_BY.map((item) => (
              <option key={item} value={item}>
                Group: {HMO_GROUP_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="sort" defaultValue={sort} aria-label="Sort by">
            {HMO_SORTS.map((item) => (
              <option key={item} value={item}>
                Sort: {HMO_SORT_LABEL[item]}
              </option>
            ))}
          </select>
          <label className="hmo-filter-check">
            <input type="checkbox" name="archived" value="1" defaultChecked={filters.archived === "1"} /> รวม Archive / Include archived
          </label>
          <div className="hmo-filter-actions">
            <button className="crm-users-secondary" type="submit">
              กรอง / Filter
            </button>
            <Link className="crm-users-secondary" href={basePath}>
              ล้าง / Reset
            </Link>
            {access.canEditBoard ? (
              <button className="kpi-button b2b-save" type="button" onClick={openCreate}>
                เพิ่มรายการ / Add {HMO_KIND_LABEL[defaultKind]}
              </button>
            ) : null}
          </div>
        </form>
      </div>

      {section === "departments" && !lockedDepartment ? (
        <nav className="hmo-dept-hub" aria-label="Department workspaces">
          {HMO_DEPARTMENTS.map((item) => (
            <Link key={item} className="hmo-dept-card" href={HMO_DEPARTMENT_PATH[item]}>
              <strong>{hmoDepartmentLabel(item)}</strong>
              <span>{items.filter((row) => row.department === item).length} records</span>
            </Link>
          ))}
          {extras.map((item) => (
            <Link key={item.id} className="hmo-dept-card" href={`${HMO_BASE_PATH}/departments?department=${encodeURIComponent(item.id)}`}>
              <strong>{item.label}</strong>
              <span>{items.filter((row) => row.department === item.id).length} records · เพิ่มจาก Settings</span>
            </Link>
          ))}
        </nav>
      ) : null}

      {view === "board" ? (
        <div className="b2b-board is-columns" aria-label={`Board grouped by ${HMO_GROUP_LABEL[groupBy]}`}>
          {groups.map((group) => (
            <section className="b2b-group" key={group.key}>
              <header className="b2b-group-head">
                <strong>{group.label}</strong>
                <span>{group.items.length}</span>
              </header>
              <div className="b2b-group-body">{group.items.length ? group.items.map(card) : <p className="b2b-muted">ยังไม่มีรายการ / Empty</p>}</div>
            </section>
          ))}
        </div>
      ) : (
        <div className="crm-pipe-table-wrap b2b-table-wrap">
          {items.length === 0 ? (
            <p className="crm-pipe-table-empty">
              ยังไม่มีรายการ — สร้างด้วยปุ่ม “เพิ่มรายการ” (ไม่มีการนำเข้าข้อมูล ไม่มีข้อมูลตัวอย่าง) / Nothing here yet. Use “Add” to create records manually — no import, no sample data.
            </p>
          ) : (
            groups.map((group) =>
              group.items.length ? (
                <section className="b2b-group" key={group.key} style={{ marginBottom: "0.9rem" }}>
                  <header className="b2b-group-head">
                    <strong>{group.label}</strong>
                    <span>{group.items.length}</span>
                  </header>
                  <table className="crm-pipe-table b2b-table" aria-label={`${HMO_SECTION_LABEL[section]} — ${group.label}`}>
                    <thead>
                      <tr>
                        {columns.map((column) => (
                          <th key={column.key} scope="col">
                            {column.label}
                          </th>
                        ))}
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>{tableRows(group.items)}</tbody>
                  </table>
                </section>
              ) : null,
            )
          )}
        </div>
      )}

      {drawer ? (
        <HotelMarketingOpsRecordForm
          key={formKey}
          draft={draft}
          row={current}
          staff={staff}
          access={access}
          extras={extras}
          section={section}
          pending={pending}
          saveOk={msg("record").ok}
          saveError={msg("record").error}
          saveStamp={saveStamp}
          showIssues={showIssues}
          onChange={setDraft}
          onSave={() => void saveDraft()}
          onClose={() => setDrawer(false)}
          onArchive={() => setArchiveId(draft.id)}
          onDelete={() => setDeleteId(draft.id)}
          approval={msg("approval")}
          onDecide={async (decision, notes) => {
            if (!notes.trim()) {
              setMsgs((state) => ({ ...state, approval: { ok: "", error: hmoErrorMessage("missing_note") } }));
              return false;
            }
            const label = { request: "ส่งขอตรวจแล้ว / Review requested", approve: "อนุมัติแล้ว / Approved", changes: "ขอแก้ไขแล้ว / Changes requested", reject: "ปฏิเสธแล้ว / Rejected" }[decision];
            const result = await run("approval", () => decideHotelMarketingApproval(form({ id: draft.id, decision, notes })), label);
            if (result?.ok) {
              const next = { request: "in_review", approve: "approved", changes: "in_progress", reject: "blocked" }[decision] as HmoStatus;
              setDraft((state) => ({ ...state, status: next }));
            }
            return Boolean(result?.ok);
          }}
          subtasksSlot={
            current ? (
              <HotelMarketingOpsSubtasksPanel
                row={current}
                staff={staff}
                access={access}
                extras={extras}
                pending={pending}
                draft={subDraft}
                message={msg("subtask")}
                onDraftChange={setSubDraft}
                onSave={() => void saveSubtask()}
                onComplete={(item, completed) => void run("subtask", () => completeHotelMarketingSubtask(form({ id: item.id, completed: completed ? "1" : "0" })), completed ? "ปิดงานย่อยแล้ว / Completed" : "เปิดงานย่อยอีกครั้ง / Reopened")}
                onStatus={(item: HmoSubtaskView, status: HmoSubtaskStatus) => void run("subtask", () => updateHotelMarketingSubtaskStatus(form({ id: item.id, status })), "บันทึกสถานะงานย่อยแล้ว / Subtask status saved")}
                onMove={(item, direction) => void run("subtask", () => reorderHotelMarketingSubtask(form({ id: item.id, direction })), "ย้ายลำดับแล้ว / Reordered")}
                onDelete={(item) => void run("subtask", () => removeHotelMarketingSubtask(form({ id: item.id })), "ลบงานย่อยแล้ว / Subtask deleted")}
                onAddComment={async (item, body) => Boolean(await run("subtask", () => addHotelMarketingSubtaskComment(form({ id: item.id, body })), "บันทึกความเห็นแล้ว / Comment added"))}
                onAddDuty={(department, name) =>
                  void run(
                    "subtask",
                    () =>
                      saveHotelMarketingSubtask(
                        form({
                          recordId: draft.id,
                          name,
                          department,
                          ownerId: access.userId,
                          status: "not_started",
                          priority: "normal",
                          gateKind: hmoGateKind(name),
                        }),
                      ),
                    "เพิ่มงานย่อยแล้ว / Subtask added",
                  )
                }
                onEscalate={(item, notes, reviewerId, target) =>
                  void run(
                    "subtask",
                    () => escalateHotelMarketingSubtask(form({ id: item.id, notes, reviewerId, target })),
                    "ส่งต่องานย่อยแล้ว / Escalated",
                  )
                }
                onDecide={(item, decision, notes, rejectAs) =>
                  void run(
                    "subtask",
                    () => decideHotelMarketingSubtask(form({ id: item.id, decision, notes, rejectAs: rejectAs || "needs_review" })),
                    decision === "approve" ? "อนุมัติงานย่อยแล้ว / Approved" : "ปฏิเสธงานย่อยแล้ว / Rejected",
                  )
                }
              />
            ) : null
          }
        />
      ) : null}

      {archiveId ? (
        <B2bDialog
          title="Archive รายการ / Archive record"
          body="ยืนยันเก็บรายการนี้เข้าคลังภายใน? รายการจะถูกซ่อนจากบอร์ดหลัก (เปิด “รวม Archive” เพื่อดู) / Archive this record? It is hidden from the main board; tick “Include archived” to see it. Status can be changed later to restore."
          confirmLabel="Archive"
          pending={pending}
          onCancel={() => setArchiveId("")}
          onConfirm={async () => {
            const id = archiveId;
            setArchiveId("");
            const result = await run("page", () => archiveHotelMarketingRecord(form({ id })), "เก็บเข้าคลังแล้ว / Archived");
            if (result?.ok && draft.id === id) setDrawer(false);
          }}
        />
      ) : null}

      {deleteId ? (
        <B2bDialog
          title="ลบรายการ / Delete record"
          body="ลบรายการและงานย่อยถาวร (ประวัติการตรวจสอบยังคงอยู่) — พิจารณา Archive แทน / This permanently deletes the record and its subtasks. The audit trail is kept. Consider Archive instead."
          confirmLabel="ลบ / Delete"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={async () => {
            const id = deleteId;
            setDeleteId("");
            const result = await run("page", () => removeHotelMarketingRecord(form({ id })), "ลบแล้ว / Deleted");
            if (result?.ok && draft.id === id) setDrawer(false);
          }}
        />
      ) : null}
    </div>
  );
}
