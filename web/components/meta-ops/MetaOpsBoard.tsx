"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";
import {
  addMetaSubtaskComment,
  assignMetaCampaign,
  attachMetaSubtaskFile,
  changeMetaDepartment,
  changeMetaStatus,
  closeMetaCampaign,
  completeMetaSubtask,
  deleteMetaActivity,
  deleteMetaCampaign,
  deleteAdsKpi,
  deleteMetaNote,
  escalateMetaCampaign,
  saveMetaActivity,
  saveMetaCampaign,
  saveAdsKpi,
  saveMetaNote,
  saveMetaSubtask,
} from "@/lib/meta-ops/actions";
import {
  ADS_ACTIVITY_TYPE_LABEL,
  ADS_APPROVAL_STATUS_LABEL,
  META_SCENARIO_LABEL,
  META_CHANNELS,
  ADS_DEPARTMENT_LABEL,
  META_DEPARTMENTS,
  META_GROUP_BY,
  ADS_GROUP_LABEL,
  META_KPI_DATA_STATUS_LABEL,
  ADS_PRIORITY_LABEL,
  META_READINESS_LABEL,
  META_SECTION_LABEL,
  ADS_SORT_LABEL,
  META_SORTS,
  ADS_STATUS_LABEL,
  META_STATUSES,
  ADS_SUBTASK_STATUS_LABEL,
  MAX_META_SUBTASKS,
  META_TRACKING_STATUS_LABEL,
  adsErrorMessage,
  metaSectionPath,
  MASKED_VALUE,
  type MetaAccessView,
  type MetaCampaignListItem,
  type MetaChannel,
  type MetaDepartment,
  type MetaGroupBy,
  type MetaSection,
  type MetaStatus,
  type MetaSubtaskView,
} from "@/lib/meta-ops/types";
import { B2bDialog, toDateInput } from "@/components/b2b-ops/ui";
import { MetaCampaignForm, draftFromCampaign, emptyCampaignDraft, type CampaignDraft } from "./MetaCampaignForm";
import { emptySubtaskDraft, type SubtaskDraft } from "./MetaSubtasksPanel";
import "@/components/b2b-ops/b2b-ops.css";
import "./meta-ops.css";

type Staff = { id: string; name: string };

function extraColumnLabel(section: MetaSection) {
  if (section === "audiences") return "Audience";
  if (section === "creative-matrix") return "Creative matrix";
  if (section === "landing-pages") return "Landing page";
  if (section === "tracking") return "Tracking";
  if (section === "ads") return "Creative ref";
  if (section === "remarketing") return "Remarketing";
  return "Primary KPI";
}

function extraColumnValue(section: MetaSection, row: MetaCampaignListItem) {
  if (section === "audiences") return row.audienceMasked ? MASKED_VALUE : row.audienceSegment || "—";
  if (section === "creative-matrix" || section === "ads") return row.creativeMatrixRef || "—";
  if (section === "landing-pages") return row.landingUrl || "—";
  if (section === "tracking") return META_TRACKING_STATUS_LABEL[row.trackingStatus];
  if (section === "remarketing") {
    if (row.remarketingNotes) return row.remarketingNotes;
    return row.audienceMasked ? MASKED_VALUE : row.audienceSegment || "—";
  }
  return row.primaryKpi || "—";
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

export function MetaOpsBoard({
  section,
  items,
  staff,
  access,
  facets,
  filters,
  groupBy,
  sort,
}: {
  section: MetaSection;
  items: MetaCampaignListItem[];
  staff: Staff[];
  access: MetaAccessView;
  facets: { hotels: string[]; markets: string[] };
  filters: {
    q?: string;
    status?: string;
    ownerId?: string;
    department?: string;
    channel?: string;
    hotel?: string;
    market?: string;
    view?: string;
  };
  groupBy: MetaGroupBy;
  sort: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState<CampaignDraft>(emptyCampaignDraft(access.userId));
  const [expanded, setExpanded] = useState<string>("");
  const [deleteId, setDeleteId] = useState("");
  const [closeId, setCloseId] = useState("");
  const [escalateId, setEscalateId] = useState("");
  const [subtaskDraft, setSubtaskDraft] = useState<SubtaskDraft>(emptySubtaskDraft(access.userId));
  const [subtaskComment, setSubtaskComment] = useState("");
  const view = filters.view === "board" ? "board" : "table";
  const current = items.find((item) => item.id === draft.id);

  const counts = useMemo(() => {
    return {
      total: items.length,
      active: items.filter((item) => item.status === "active" || item.status === "optimizing").length,
      approval: items.filter((item) => item.status === "awaiting_approval" || item.approvalStatus === "awaiting").length,
    };
  }, [items]);

  const groups = useMemo(() => {
    const order =
      groupBy === "status"
        ? [...META_STATUSES]
        : groupBy === "department"
          ? [...META_DEPARTMENTS]
          : groupBy === "channel"
            ? [...META_CHANNELS]
            : groupBy === "hotel"
              ? Array.from(new Set(items.map((item) => item.hotelName || "none")))
              : groupBy === "market"
                ? Array.from(new Set(items.map((item) => item.market || "none")))
                : groupBy === "objective"
                  ? Array.from(new Set(items.map((item) => item.objective || "none")))
                : Array.from(new Set(items.map((item) => item.ownerId || "none")));
    return order.map((key) => ({
      key,
      label:
        groupBy === "status"
          ? ADS_STATUS_LABEL[key as MetaStatus] || key
          : groupBy === "department"
            ? ADS_DEPARTMENT_LABEL[key as MetaDepartment] || key
            : groupBy === "channel"
              ? META_SCENARIO_LABEL[key as MetaChannel] || key
              : groupBy === "owner"
                ? staff.find((item) => item.id === key)?.name || "ยังไม่มอบหมาย"
                : key === "none"
                  ? groupBy === "market"
                    ? "ไม่ระบุตลาด"
                    : groupBy === "objective"
                      ? "ไม่ระบุวัตถุประสงค์"
                    : "ไม่ระบุโรงแรม"
                  : key,
      items:
        groupBy === "owner"
          ? items.filter((item) => (item.ownerId || "none") === key)
          : groupBy === "hotel"
            ? items.filter((item) => (item.hotelName || "none") === key)
            : groupBy === "market"
              ? items.filter((item) => (item.market || "none") === key)
              : groupBy === "objective"
                ? items.filter((item) => (item.objective || "none") === key)
              : items.filter((item) => item[groupBy] === key),
    }));
  }, [groupBy, items, staff]);

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) {
        setError(adsErrorMessage(result.error));
        return;
      }
      setOk(success);
      if (!draft.id && result.id) setDraft((currentDraft) => ({ ...currentDraft, id: result.id }));
      router.refresh();
    });
  }

  function saveDraft() {
    const data = new FormData();
    Object.entries(draft).forEach(([key, value]) => data.set(key, value));
    run(() => saveMetaCampaign(data), draft.id ? "บันทึกแล้ว" : "สร้างแคมเปญแล้ว");
  }

  function patchSubtask(item: MetaSubtaskView, patch: Partial<SubtaskDraft>) {
    const data = new FormData();
    data.set("id", item.id);
    data.set("campaignId", item.campaignId);
    data.set("name", patch.name ?? item.name);
    data.set("department", patch.department ?? item.department);
    data.set("ownerId", patch.ownerId ?? item.ownerId);
    data.set("status", patch.status ?? item.status);
    data.set("dueAt", patch.dueAt ?? toDateInput(item.dueAt));
    data.set("priority", patch.priority ?? item.priority);
    data.set("comments", patch.comments ?? item.comments);
    const completed = patch.status === "completed" || (patch.status ? false : item.completed);
    data.set("completed", completed ? "1" : "0");
    run(() => saveMetaSubtask(data), "บันทึกซับงานแล้ว");
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
    const text = params.toString();
    const path = metaSectionPath(section);
    return text ? `${path}?${text}` : path;
  }

  function openRow(row: MetaCampaignListItem) {
    setDraft(draftFromCampaign(row));
    setSubtaskDraft(emptySubtaskDraft(row.ownerId || access.userId, row.department));
    setSubtaskComment("");
    setDrawer(true);
    setOk("");
    setError("");
  }

  const card = (row: MetaCampaignListItem) => (
    <article className="b2b-card" key={row.id}>
      <button type="button" className="b2b-name" onClick={() => openRow(row)}>
        {row.name}
      </button>
      <p>
        {row.hotelName} · {META_SCENARIO_LABEL[row.channel]}
        {row.audienceMasked ? "" : row.audienceSegment ? ` · ${row.audienceSegment}` : ""}
      </p>
      <div className="b2b-meta">
        <span className={`b2b-status is-${row.status}`}>{ADS_STATUS_LABEL[row.status]}</span>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
        <span className={`b2b-status is-${row.progress.readiness}`}>{META_READINESS_LABEL[row.progress.readiness]}</span>
        <span className={`b2b-status b2b-priority is-${row.priority}`}>{ADS_PRIORITY_LABEL[row.priority]}</span>
        <span className={`b2b-status is-${row.approvalStatus}`}>{ADS_APPROVAL_STATUS_LABEL[row.approvalStatus]}</span>
      </div>
      <p>
        {row.ownerName || "—"} · {ADS_DEPARTMENT_LABEL[row.department]}
      </p>
      <p>
        Next: {row.nextAction || "—"} {row.nextActionAt ? `· ${formatDate(row.nextActionAt)}` : ""}
      </p>
      {access.canEditBoard ? (
        <div className="ads-inline-assign">
          <form
            className="b2b-inline"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              run(() => changeMetaStatus(data), "เปลี่ยนสถานะแล้ว");
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.name}`}>
              {META_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {ADS_STATUS_LABEL[item]}
                </option>
              ))}
            </select>
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              สถานะ
            </button>
          </form>
          <form
            className="b2b-inline"
            onSubmit={(event) => {
              event.preventDefault();
              run(() => assignMetaCampaign(new FormData(event.currentTarget)), "มอบหมายแล้ว");
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <select className="crm-select" name="ownerId" defaultValue={row.ownerId} aria-label={`มอบหมาย ${row.name}`}>
              <option value="">ยังไม่มอบหมาย</option>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              Assign
            </button>
          </form>
          <form
            className="b2b-inline"
            onSubmit={(event) => {
              event.preventDefault();
              run(() => changeMetaDepartment(new FormData(event.currentTarget)), "เปลี่ยนแผนกแล้ว");
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <select className="crm-select" name="department" defaultValue={row.department} aria-label={`แผนก ${row.name}`}>
              {META_DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {ADS_DEPARTMENT_LABEL[item]}
                </option>
              ))}
            </select>
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              แผนก
            </button>
          </form>
        </div>
      ) : null}
      <div className="b2b-card-actions">
        <button type="button" className="crm-users-secondary" onClick={() => setExpanded(expanded === row.id ? "" : row.id)}>
          {expanded === row.id ? "ซ่อนประวัติ" : "ดูประวัติ"}
        </button>
        {access.canEditBoard ? (
          <>
            <button type="button" className="crm-users-secondary" onClick={() => openRow(row)}>
              แก้ไข
            </button>
            <button type="button" className="crm-users-secondary" onClick={() => setEscalateId(row.id)}>
              Escalate
            </button>
            <button type="button" className="crm-users-secondary" onClick={() => setCloseId(row.id)}>
              Close
            </button>
            <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(row.id)}>
              ลบ
            </button>
          </>
        ) : null}
      </div>
      {expanded === row.id ? (
        <div className="b2b-expand">
          <p>
            {row.progress.countLabel} · {META_READINESS_LABEL[row.progress.readiness]}
          </p>
          <ul className="meta-ops-history">
            {row.subtasks.length ? (
              row.subtasks.map((item) => (
                <li key={item.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      disabled={pending || !access.canEditBoard}
                      onChange={() => {
                        const data = new FormData();
                        data.set("id", item.id);
                        data.set("completed", item.completed ? "0" : "1");
                        run(() => completeMetaSubtask(data), item.completed ? "เปิดซับงานแล้ว" : "ปิดซับงานแล้ว");
                      }}
                    />
                    <span>
                      {item.name} · {ADS_DEPARTMENT_LABEL[item.department]} · {ADS_SUBTASK_STATUS_LABEL[item.status]}
                    </span>
                  </label>
                </li>
              ))
            ) : (
              <li>ยังไม่มีซับงาน</li>
            )}
          </ul>
          {access.canEditBoard && row.subtasks.length < MAX_META_SUBTASKS ? (
            <button
              type="button"
              className="kpi-button b2b-save"
              onClick={() => {
                openRow(row);
                setSubtaskDraft(emptySubtaskDraft(row.ownerId || access.userId, row.department));
              }}
            >
              เพิ่มซับงาน
            </button>
          ) : null}
          <p>Optimization / activity</p>
          <ul className="meta-ops-history">
            {row.activities.length ? (
              row.activities.slice(0, 8).map((item) => (
                <li key={item.id}>
                  {ADS_ACTIVITY_TYPE_LABEL[item.type]} · {item.title}
                  {item.dueAt ? ` · ${formatDate(item.dueAt)}` : ""}
                </li>
              ))
            ) : (
              <li>ยังไม่มีประวัติ</li>
            )}
          </ul>
        </div>
      ) : null}
    </article>
  );

  const tableRows = (rows: MetaCampaignListItem[]) =>
    rows.map((row) => (
      <Fragment key={row.id}>
        <tr>
          <td data-label="Campaign">
            <button type="button" className="b2b-name" onClick={() => openRow(row)}>
              {row.name}
            </button>
            <small>{row.hotelName}</small>
            <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
          </td>
          <td data-label="Type">{META_SCENARIO_LABEL[row.channel]}</td>
          <td data-label="Owner">{row.ownerName || "—"}</td>
          <td data-label="Department">{ADS_DEPARTMENT_LABEL[row.department]}</td>
          <td data-label="Status">
            <span className={`b2b-status is-${row.status}`}>{ADS_STATUS_LABEL[row.status]}</span>
            <span className={`b2b-status is-${row.progress.readiness}`}>{META_READINESS_LABEL[row.progress.readiness]}</span>
          </td>
          <td data-label="Dates">
            {row.startAt ? formatDate(row.startAt) : "—"}
            {row.endAt ? ` → ${formatDate(row.endAt)}` : ""}
          </td>
          <td data-label="Budget" className={row.budgetMasked ? "b2b-masked" : undefined}>
            {access.canSeeBudget ? row.budgetAmount || "—" : row.budgetMasked ? "••••" : "—"}
          </td>
          <td data-label="Next">
            {row.nextAction || "—"}
            {row.nextActionAt ? <small>{formatDate(row.nextActionAt)}</small> : null}
          </td>
          <td data-label={extraColumnLabel(section)}>
            {extraColumnValue(section, row)}
          </td>
          <td data-label="Actions">
            <div className="b2b-row-actions">
              <button type="button" className="crm-users-secondary" onClick={() => setExpanded(expanded === row.id ? "" : row.id)}>
                {expanded === row.id ? "ซ่อน" : "ขยาย"}
              </button>
              {access.canEditBoard ? (
                <>
                  <form
                    className="b2b-inline"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const data = new FormData(event.currentTarget);
                      run(() => changeMetaStatus(data), "เปลี่ยนสถานะแล้ว");
                    }}
                  >
                    <input type="hidden" name="id" value={row.id} />
                    <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.name}`}>
                      {META_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {ADS_STATUS_LABEL[item]}
                        </option>
                      ))}
                    </select>
                    <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                      บันทึก
                    </button>
                  </form>
                  <button type="button" className="crm-users-secondary" onClick={() => openRow(row)}>
                    แก้ไข
                  </button>
                  <button type="button" className="crm-users-secondary" onClick={() => setEscalateId(row.id)}>
                    Escalate
                  </button>
                  <button type="button" className="crm-users-secondary" onClick={() => setCloseId(row.id)}>
                    Close
                  </button>
                  <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(row.id)}>
                    ลบ
                  </button>
                </>
              ) : null}
            </div>
          </td>
        </tr>
        {expanded === row.id ? (
          <tr className="meta-ops-expand">
            <td colSpan={10}>
              <p>
                {row.progress.countLabel} · {META_READINESS_LABEL[row.progress.readiness]} · Approval{" "}
                {ADS_APPROVAL_STATUS_LABEL[row.approvalStatus]} · Tracking {META_TRACKING_STATUS_LABEL[row.trackingStatus]}
              </p>
              {access.canEditBoard ? (
                <div className="ads-inline-assign">
                  <form
                    className="b2b-inline"
                    onSubmit={(event) => {
                      event.preventDefault();
                      run(() => assignMetaCampaign(new FormData(event.currentTarget)), "มอบหมายแล้ว");
                    }}
                  >
                    <input type="hidden" name="id" value={row.id} />
                    <select className="crm-select" name="ownerId" defaultValue={row.ownerId} aria-label={`มอบหมาย ${row.name}`}>
                      <option value="">ยังไม่มอบหมาย</option>
                      {staff.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                      Assign
                    </button>
                  </form>
                  <form
                    className="b2b-inline"
                    onSubmit={(event) => {
                      event.preventDefault();
                      run(() => changeMetaDepartment(new FormData(event.currentTarget)), "เปลี่ยนแผนกแล้ว");
                    }}
                  >
                    <input type="hidden" name="id" value={row.id} />
                    <select className="crm-select" name="department" defaultValue={row.department} aria-label={`แผนก ${row.name}`}>
                      {META_DEPARTMENTS.map((item) => (
                        <option key={item} value={item}>
                          {ADS_DEPARTMENT_LABEL[item]}
                        </option>
                      ))}
                    </select>
                    <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                      แผนก
                    </button>
                  </form>
                </div>
              ) : null}
              <ul className="meta-ops-history">
                {row.subtasks.length ? (
                  row.subtasks.map((item) => (
                    <li key={item.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={item.completed}
                          disabled={pending || !access.canEditBoard}
                          onChange={() => {
                            const data = new FormData();
                            data.set("id", item.id);
                            data.set("completed", item.completed ? "0" : "1");
                            run(() => completeMetaSubtask(data), item.completed ? "เปิดซับงานแล้ว" : "ปิดซับงานแล้ว");
                          }}
                        />
                        <span>
                          {item.name} · {ADS_DEPARTMENT_LABEL[item.department]} · {ADS_SUBTASK_STATUS_LABEL[item.status]}
                        </span>
                      </label>
                    </li>
                  ))
                ) : (
                  <li>ยังไม่มีซับงาน</li>
                )}
              </ul>
              {access.canEditBoard && row.subtasks.length < MAX_META_SUBTASKS ? (
                <button
                  type="button"
                  className="kpi-button b2b-save"
                  onClick={() => {
                    openRow(row);
                    setSubtaskDraft(emptySubtaskDraft(row.ownerId || access.userId, row.department));
                  }}
                >
                  เพิ่มซับงาน
                </button>
              ) : null}
              <ul className="meta-ops-history">
                {row.activities.length ? (
                  row.activities.map((item) => (
                    <li key={item.id}>
                      {ADS_ACTIVITY_TYPE_LABEL[item.type]} · {item.title}
                      {item.notes ? ` — ${item.notes}` : ""}
                    </li>
                  ))
                ) : (
                  <li>ยังไม่มีประวัติ</li>
                )}
              </ul>
              {row.kpis.length ? (
                <ul className="meta-ops-history">
                  {row.kpis.map((item) => (
                    <li key={item.id}>
                      {item.metric}: {item.value || "—"} ({META_KPI_DATA_STATUS_LABEL[item.dataStatus]})
                    </li>
                  ))}
                </ul>
              ) : null}
            </td>
          </tr>
        ) : null}
      </Fragment>
    ));

  return (
    <div className="b2b-page meta-ops">
      {error ? (
        <p className="crm-users-alert is-warn" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="crm-users-alert is-ok" role="status">
          {ok}
        </p>
      ) : null}
      <div className="meta-ops-status-row" aria-label="สรุปบอร์ด">
        <div className="meta-ops-stat">
          <span>{META_SECTION_LABEL[section]}</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="meta-ops-stat">
          <span>Active / Optimizing</span>
          <strong>{counts.active}</strong>
        </div>
        <div className="meta-ops-stat">
          <span>Awaiting approval</span>
          <strong>{counts.approval}</strong>
        </div>
      </div>
      <div className="b2b-toolbar">
        <div className="b2b-tabs" role="tablist" aria-label="มุมมองบอร์ดแคมเปญ">
          <Link className={`b2b-tab${view === "table" ? " is-active" : ""}`} href={hrefFor({ view: "table" })}>
            Table
          </Link>
          <Link className={`b2b-tab${view === "board" ? " is-active" : ""}`} href={hrefFor({ view: "board" })}>
            Board
          </Link>
        </div>
        <form className="b2b-filters" method="get">
          <input type="hidden" name="view" value={view} />
          <input className="crm-field" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหาชื่อแคมเปญ โรงแรม ตลาด หรืองานถัดไป" aria-label="ค้นหาแคมเปญ" />
          <select className="crm-select" name="status" defaultValue={filters.status ?? ""} aria-label="สถานะ">
            <option value="">ทุกสถานะ</option>
            {META_STATUSES.map((item) => (
              <option key={item} value={item}>
                {ADS_STATUS_LABEL[item]}
              </option>
            ))}
          </select>
          {section !== "remarketing" ? (
            <select className="crm-select" name="channel" defaultValue={filters.channel ?? ""} aria-label="ประเภทแคมเปญ">
              <option value="">ทุกประเภท</option>
              {META_CHANNELS.map((item) => (
                <option key={item} value={item}>
                  {META_SCENARIO_LABEL[item]}
                </option>
              ))}
            </select>
          ) : null}
          <select className="crm-select" name="ownerId" defaultValue={filters.ownerId ?? ""} aria-label="เจ้าของ">
            <option value="">ทุกเจ้าของ</option>
            {staff.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select className="crm-select" name="department" defaultValue={filters.department ?? ""} aria-label="แผนก">
            <option value="">ทุกแผนก</option>
            {META_DEPARTMENTS.map((item) => (
              <option key={item} value={item}>
                {ADS_DEPARTMENT_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="hotel" defaultValue={filters.hotel ?? ""} aria-label="โรงแรม">
            <option value="">ทุกโรงแรม</option>
            {facets.hotels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="crm-select" name="market" defaultValue={filters.market ?? ""} aria-label="ตลาด">
            <option value="">ทุกตลาด</option>
            {facets.markets.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="crm-select" name="group" defaultValue={groupBy} aria-label="จัดกลุ่ม">
            {META_GROUP_BY.map((item) => (
              <option key={item} value={item}>
                Group: {ADS_GROUP_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="sort" defaultValue={sort} aria-label="เรียงลำดับ">
            {META_SORTS.map((item) => (
              <option key={item} value={item}>
                Sort: {ADS_SORT_LABEL[item]}
              </option>
            ))}
          </select>
          <button className="crm-users-secondary" type="submit">
            กรอง
          </button>
          {access.canEditBoard ? (
            <button
              className="kpi-button b2b-save"
              type="button"
              onClick={() => {
                const next = emptyCampaignDraft(access.userId);
                if (section === "remarketing") next.channel = "remarketing";
                setDraft(next);
                setDrawer(true);
                setOk("");
                setError("");
              }}
            >
              เพิ่มแคมเปญ
            </button>
          ) : null}
        </form>
      </div>

      {view === "board" ? (
        <div className="b2b-board is-columns">
          {groups.map((group) => (
            <section className="b2b-group" key={group.key}>
              <header className="b2b-group-head">
                <strong>{group.label}</strong>
                <span>{group.items.length}</span>
              </header>
              <div className="b2b-group-body">
                {group.items.length ? group.items.map(card) : <p className="b2b-muted">ยังไม่มีรายการ</p>}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="crm-pipe-table-wrap b2b-table-wrap">
          {items.length === 0 ? (
            <p className="crm-pipe-table-empty">ยังไม่มีแคมเปญ — สร้างรายการด้วยปุ่มเพิ่มแคมเปญ ไม่มีการนำเข้าข้อมูล</p>
          ) : (
            groups.map((group) => (
              <section className="b2b-group" key={group.key} style={{ marginBottom: "0.9rem" }}>
                <header className="b2b-group-head">
                  <strong>{group.label}</strong>
                  <span>{group.items.length}</span>
                </header>
                <table className="crm-pipe-table b2b-table meta-ops-table" aria-label={`ตาราง ${META_SECTION_LABEL[section]}`}>
                  <thead>
                    <tr>
                      <th scope="col">Campaign</th>
                      <th scope="col">Type</th>
                      <th scope="col">Owner</th>
                      <th scope="col">Department</th>
                      <th scope="col">Status</th>
                      <th scope="col">Dates</th>
                      <th scope="col">Budget</th>
                      <th scope="col">Next action</th>
                      <th scope="col">{extraColumnLabel(section)}</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{tableRows(group.items)}</tbody>
                </table>
              </section>
            ))
          )}
        </div>
      )}

      {section === "optimization" && items.some((item) => item.activities.length) ? (
        <section className="b2b-panel">
          <h3>Optimization Log</h3>
          <ul className="meta-ops-history">
            {items
              .flatMap((item) => item.activities.filter((activity) => activity.type === "optimisation").map((activity) => ({ ...activity, campaignName: item.name })))
              .slice(0, 40)
              .map((item) => (
                <li key={item.id}>
                  {item.campaignName}: {item.title}
                  {item.dueAt ? ` · ${formatDate(item.dueAt)}` : ""}
                </li>
              ))}
          </ul>
        </section>
      ) : null}

      {drawer ? (
        <MetaCampaignForm
          key={`${draft.id || "new"}-${section}`}
          draft={draft}
          row={current}
          staff={staff}
          access={access}
          section={section}
          pending={pending}
          ok={ok}
          error={error}
          onChange={setDraft}
          onSave={saveDraft}
          onClose={() => setDrawer(false)}
          onAddActivity={(input) => {
            const data = new FormData();
            data.set("campaignId", draft.id);
            data.set("title", input.title);
            data.set("type", input.type);
            data.set("notes", input.notes);
            data.set("status", "completed");
            data.set("ownerId", draft.ownerId);
            run(() => saveMetaActivity(data), "บันทึก log แล้ว");
          }}
          onDeleteActivity={(id) => {
            const data = new FormData();
            data.set("id", id);
            run(() => deleteMetaActivity(data), "ลบ log แล้ว");
          }}
          onAddKpi={(input) => {
            const data = new FormData();
            data.set("campaignId", draft.id);
            data.set("period", input.period);
            data.set("metric", input.metric);
            data.set("value", input.value);
            data.set("target", input.target);
            data.set("dataStatus", input.dataStatus);
            run(() => saveAdsKpi(data), "บันทึก KPI แล้ว");
          }}
          onDeleteKpi={(id) => {
            const data = new FormData();
            data.set("id", id);
            run(() => deleteAdsKpi(data), "ลบ KPI แล้ว");
          }}
          onAddNote={(input) => {
            const data = new FormData();
            data.set("campaignId", draft.id);
            data.set("kind", input.kind);
            data.set("title", input.title);
            data.set("body", input.body);
            data.set("url", input.url);
            run(() => saveMetaNote(data), "บันทึกโน้ตแล้ว");
          }}
          onDeleteNote={(id) => {
            const data = new FormData();
            data.set("id", id);
            run(() => deleteMetaNote(data), "ลบโน้ตแล้ว");
          }}
          subtaskDraft={subtaskDraft}
          subtaskComment={subtaskComment}
          onSubtaskDraftChange={setSubtaskDraft}
          onSubtaskCommentChange={setSubtaskComment}
          onSaveSubtask={() => {
            const data = new FormData();
            Object.entries(subtaskDraft).forEach(([key, value]) => data.set(key, value));
            data.set("campaignId", draft.id);
            data.set("completed", subtaskDraft.status === "completed" ? "1" : "0");
            const editing = Boolean(subtaskDraft.id);
            run(async () => {
              const result = await saveMetaSubtask(data);
              if (result.ok && !editing) {
                setSubtaskDraft(emptySubtaskDraft(draft.ownerId || access.userId, draft.department));
              }
              return result;
            }, editing ? "บันทึกซับงานแล้ว" : "เพิ่มซับงานแล้ว");
          }}
          onCompleteSubtask={(item, completed) => {
            const data = new FormData();
            data.set("id", item.id);
            data.set("completed", completed ? "1" : "0");
            run(() => completeMetaSubtask(data), completed ? "ปิดซับงานแล้ว" : "เปิดซับงานแล้ว");
          }}
          onPatchSubtask={patchSubtask}
          onAddSubtaskComment={(subtaskId) => {
            const data = new FormData();
            data.set("subtaskId", subtaskId);
            data.set("body", subtaskComment);
            run(async () => {
              const result = await addMetaSubtaskComment(data);
              if (result.ok) setSubtaskComment("");
              return result;
            }, "บันทึกความเห็นแล้ว");
          }}
          onAttachSubtaskFile={(subtaskId, form) => {
            const data = new FormData(form);
            data.set("subtaskId", subtaskId);
            run(() => attachMetaSubtaskFile(data), "แนบไฟล์แล้ว");
          }}
          onEscalate={() => setEscalateId(draft.id)}
          onCloseCampaign={() => setCloseId(draft.id)}
        />
      ) : null}

      {escalateId ? (
        <B2bDialog
          title="Escalate ไป Management"
          body="ยืนยันส่งแคมเปญนี้ให้ Management อนุมัติ? จะย้ายแผนกเป็น Management และตั้งสถานะรออนุมัติ"
          confirmLabel="Escalate"
          pending={pending}
          onCancel={() => setEscalateId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", escalateId);
            run(() => escalateMetaCampaign(data), "Escalate แล้ว");
            setEscalateId("");
          }}
        />
      ) : null}

      {closeId ? (
        <B2bDialog
          title="ปิดแคมเปญ"
          body="ยืนยันปิดแคมเปญนี้? สถานะจะเป็น Ended และไม่แสดงบนหน้าสาธารณะ"
          confirmLabel="Close campaign"
          pending={pending}
          onCancel={() => setCloseId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", closeId);
            run(() => closeMetaCampaign(data), "ปิดแคมเปญแล้ว");
            setCloseId("");
            setDrawer(false);
          }}
        />
      ) : null}

      {deleteId ? (
        <B2bDialog
          title="ลบแคมเปญ"
          body="ยืนยันลบแคมเปญนี้จากบอร์ดภายใน? หน้าสาธารณะจะไม่ได้รับผลกระทบ"
          confirmLabel="ลบแคมเปญ"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", deleteId);
            run(() => deleteMetaCampaign(data), "ลบแล้ว");
            setDeleteId("");
            setDrawer(false);
          }}
        />
      ) : null}
    </div>
  );
}
