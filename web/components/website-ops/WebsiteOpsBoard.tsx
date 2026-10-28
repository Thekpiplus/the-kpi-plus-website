"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";
import {
  addWebsiteApprovalNote,
  addWebsiteSubtaskComment,
  assignWebsiteWork,
  attachWebsiteSubtaskFile,
  changeWebsiteDepartment,
  changeWebsiteStatus,
  closeWebsiteWork,
  completeWebsiteSubtask,
  escalateWebsiteWork,
  removeWebsiteSubtask,
  removeWebsiteWork,
  saveWebsiteSubtask,
  saveWebsiteWork,
} from "@/lib/website-ops/actions";
import {
  MAX_WEB_SUBTASKS,
  WEB_APPROVAL_LABEL,
  WEB_APPROVAL_STATUSES,
  WEB_DEPARTMENT_LABEL,
  WEB_DEPARTMENTS,
  WEB_GROUP_BY,
  WEB_GROUP_LABEL,
  WEB_KPI_DATA_STATUS_LABEL,
  WEB_PRIORITY_LABEL,
  WEB_PROJECT_TYPE_LABEL,
  WEB_PROJECT_TYPES,
  WEB_READINESS_LABEL,
  WEB_SECTION_LABEL,
  WEB_SECTION_WORKSTREAM,
  WEB_SORT_LABEL,
  WEB_SORTS,
  WEB_STATUS_LABEL,
  WEB_STATUSES,
  WEB_SUBTASK_STATUS_LABEL,
  WEB_WORKSTREAM_LABEL,
  webErrorMessage,
  webSectionPath,
  type WebAccessView,
  type WebDepartment,
  type WebGroupBy,
  type WebListFilters,
  type WebProjectRow,
  type WebProjectType,
  type WebSection,
  type WebStatus,
  type WebSubtaskView,
} from "@/lib/website-ops/types";
import { B2bDialog, toDateInput } from "@/components/b2b-ops/ui";
import { WebsiteRecordForm, draftFromRow, emptyWebDraft, type WebRecordDraft } from "./WebsiteRecordForm";
import { emptyWebSubtaskDraft, type WebSubtaskDraft } from "./WebsiteSubtasksPanel";
import "@/components/b2b-ops/b2b-ops.css";
import "./website-ops.css";

type Staff = { id: string; name: string };

function extraColumnLabel(section: WebSection) {
  if (section === "booking") return "Booking";
  if (section === "cms") return "CMS";
  if (section === "ux") return "Mobile";
  if (section === "tracking") return "Tracking";
  if (section === "seo") return "SEO";
  if (section === "qa") return "Handover";
  if (section === "reports") return "KPI";
  if (section === "approvals") return "Approval";
  if (section === "discovery") return "Content";
  return "Type";
}

function extraColumnValue(section: WebSection, row: WebProjectRow) {
  if (section === "booking") return row.bookingEngine || row.bookingEngineUrl || "—";
  if (section === "cms") return row.cmsType || "—";
  if (section === "ux") return WEB_READINESS_LABEL[row.mobileStatus];
  if (section === "tracking") return WEB_READINESS_LABEL[row.trackingStatus];
  if (section === "seo") return WEB_READINESS_LABEL[row.seoStatus];
  if (section === "qa") return WEB_READINESS_LABEL[row.handoverStatus];
  if (section === "reports") return row.kpis[0]?.name || "—";
  if (section === "approvals") return WEB_APPROVAL_LABEL[row.approvals[0]?.status || "not_requested"];
  if (section === "discovery") return row.discovery.summary || row.primaryGoal || "—";
  return WEB_PROJECT_TYPE_LABEL[row.projectType];
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

function groupValue(row: WebProjectRow, groupBy: WebGroupBy) {
  if (groupBy === "owner") return row.ownerId || "none";
  if (groupBy === "hotel") return row.hotelName || "none";
  if (groupBy === "projectType") return row.projectType;
  if (groupBy === "market") return row.targetMarket || "none";
  if (groupBy === "language") return row.languages || "none";
  if (groupBy === "department") return row.department;
  return row.status;
}

export function WebsiteOpsBoard({
  section,
  items,
  staff,
  access,
  facets,
  filters,
  groupBy,
  sort,
}: {
  section: WebSection;
  items: WebProjectRow[];
  staff: Staff[];
  access: WebAccessView;
  facets: { hotels: string[]; markets: string[]; languages: string[] };
  filters: WebListFilters;
  groupBy: WebGroupBy;
  sort: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState<WebRecordDraft>(emptyWebDraft(access.userId, WEB_SECTION_WORKSTREAM[section] || "project"));
  const [expanded, setExpanded] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [closeId, setCloseId] = useState("");
  const [escalateId, setEscalateId] = useState("");
  const [subtaskDraft, setSubtaskDraft] = useState<WebSubtaskDraft>(emptyWebSubtaskDraft(access.userId));
  const [subtaskComment, setSubtaskComment] = useState("");
  const view = filters.view === "board" ? "board" : "table";
  const current = items.find((item) => item.id === draft.id);

  const counts = useMemo(
    () => ({
      total: items.length,
      live: items.filter((item) => item.status === "live" || item.status === "monitoring").length,
      due: items.filter((item) => ["qa", "awaiting_hotel_approval", "ready_for_handover", "integration", "development"].includes(item.status)).length,
    }),
    [items],
  );

  const groups = useMemo(() => {
    const order =
      groupBy === "status"
        ? [...WEB_STATUSES]
        : groupBy === "department"
          ? [...WEB_DEPARTMENTS]
          : groupBy === "projectType"
            ? [...WEB_PROJECT_TYPES]
            : Array.from(new Set(items.map((item) => groupValue(item, groupBy))));
    return order.map((key) => ({
      key,
      label:
        groupBy === "status"
          ? WEB_STATUS_LABEL[key as WebStatus] || key
          : groupBy === "department"
            ? WEB_DEPARTMENT_LABEL[key as WebDepartment] || key
            : groupBy === "projectType"
              ? WEB_PROJECT_TYPE_LABEL[key as WebProjectType] || key
              : groupBy === "owner"
                ? staff.find((item) => item.id === key)?.name || "ยังไม่มอบหมาย"
                : key === "none"
                  ? "ไม่ระบุ"
                  : key,
      items: items.filter((item) => groupValue(item, groupBy) === key),
    }));
  }, [groupBy, items, staff]);

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) {
        setError(webErrorMessage(result.error));
        return;
      }
      setOk(success);
      if (!draft.id && result.id) setDraft((currentDraft) => ({ ...currentDraft, id: result.id }));
      router.refresh();
    });
  }

  function saveDraft() {
    const data = new FormData();
    const scalars: Array<keyof WebRecordDraft> = [
      "id",
      "projectName",
      "hotelName",
      "currentUrl",
      "bookingEngine",
      "bookingEngineUrl",
      "cmsType",
      "projectType",
      "primaryGoal",
      "targetMarket",
      "languages",
      "startDate",
      "launchDate",
      "status",
      "ownerId",
      "department",
      "workstream",
      "priority",
      "nextAction",
      "nextActionAt",
      "notes",
      "budgetStatus",
      "trackingStatus",
      "seoStatus",
      "mobileStatus",
      "handoverStatus",
      "engineAccountRef",
      "analyticsRef",
      "cmsOwner",
      "sourceCodeOwner",
      "domainOwner",
      "hostingOwner",
      "analyticsOwner",
      "bookingEngineOwner",
    ];
    scalars.forEach((key) => data.set(key, String(draft[key] ?? "")));
    data.set("discoveryJson", JSON.stringify(draft.discovery));
    data.set("sitemapJson", JSON.stringify({ notes: draft.sitemapNotes, pages: draft.sitemap }));
    data.set("uxJson", JSON.stringify(draft.ux));
    data.set("cmsJson", JSON.stringify(draft.cms));
    data.set("bookingJson", JSON.stringify(draft.booking));
    data.set("trackingJson", JSON.stringify(draft.tracking));
    data.set("seoJson", JSON.stringify(draft.seo));
    data.set("qaJson", JSON.stringify(draft.qa));
    data.set("handoverJson", JSON.stringify(draft.handover));
    data.set("filesJson", JSON.stringify(draft.fileNotes));
    data.set("decisionsJson", JSON.stringify(draft.decisions));
    data.set("approvalsJson", JSON.stringify(draft.approvals));
    data.set("kpisJson", JSON.stringify(draft.kpis));
    data.set("sourcesJson", JSON.stringify(draft.sources));
    run(() => saveWebsiteWork(data), draft.id ? "บันทึกแล้ว" : "สร้างโปรเจกต์แล้ว");
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
    const path = webSectionPath(section);
    return text ? `${path}?${text}` : path;
  }

  function openRow(row: WebProjectRow) {
    setDraft(draftFromRow(row));
    setSubtaskDraft(emptyWebSubtaskDraft(row.ownerId || access.userId, row.department));
    setSubtaskComment("");
    setDrawer(true);
    setOk("");
    setError("");
  }

  function patchSubtask(item: WebSubtaskView, patch: Partial<WebSubtaskDraft>) {
    const data = new FormData();
    data.set("id", item.id);
    data.set("propertyId", item.propertyId);
    data.set("name", patch.name ?? item.name);
    data.set("department", patch.department ?? item.department);
    data.set("ownerId", patch.ownerId ?? item.ownerId);
    data.set("status", patch.status ?? item.status);
    data.set("dueAt", patch.dueAt ?? toDateInput(item.dueAt));
    data.set("priority", patch.priority ?? item.priority);
    data.set("comments", patch.comments ?? item.comments);
    data.set("source", patch.source ?? item.source);
    data.set("completed", (patch.status === "completed" || (patch.status ? false : item.completed)) ? "1" : "0");
    run(() => saveWebsiteSubtask(data), "บันทึกงานย่อยแล้ว");
  }

  const expandBlock = (row: WebProjectRow) => (
    <div className="b2b-expand">
      <p>
        {row.projectName} · {row.hotelName} · {WEB_PROJECT_TYPE_LABEL[row.projectType]} · อัปเดต {formatDate(row.updatedAt) || "—"}
      </p>
      <p>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {WEB_READINESS_LABEL[row.progress.readiness]}
      </p>
      {access.canEditBoard ? (
        <div className="ads-inline-assign">
          <form
            className="b2b-inline"
            onSubmit={(event) => {
              event.preventDefault();
              run(() => assignWebsiteWork(new FormData(event.currentTarget)), "มอบหมายแล้ว");
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <select className="crm-select" name="ownerId" defaultValue={row.ownerId} aria-label={`มอบหมาย ${row.hotelName}`}>
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
              run(() => changeWebsiteDepartment(new FormData(event.currentTarget)), "เปลี่ยนแผนกแล้ว");
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <select className="crm-select" name="department" defaultValue={row.department} aria-label={`แผนก ${row.hotelName}`}>
              {WEB_DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {WEB_DEPARTMENT_LABEL[item]}
                </option>
              ))}
            </select>
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              แผนก
            </button>
          </form>
        </div>
      ) : null}
      <p>งานย่อย</p>
      <ul className="ads-subtask-list">
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
                    data.set("propertyId", item.propertyId);
                    data.set("name", item.name);
                    data.set("department", item.department);
                    data.set("ownerId", item.ownerId);
                    data.set("completed", item.completed ? "0" : "1");
                    run(() => completeWebsiteSubtask(data), item.completed ? "เปิดงานย่อยแล้ว" : "ปิดงานย่อยแล้ว");
                  }}
                />
                <span>
                  {item.name} · {WEB_DEPARTMENT_LABEL[item.department]} · {WEB_SUBTASK_STATUS_LABEL[item.status]}
                </span>
              </label>
            </li>
          ))
        ) : (
          <li>ยังไม่มีงานย่อย</li>
        )}
      </ul>
      {access.canEditBoard && row.subtasks.length < MAX_WEB_SUBTASKS ? (
        <button type="button" className="kpi-button b2b-save" onClick={() => openRow(row)}>
          เพิ่มงานย่อย
        </button>
      ) : null}
      <p>การตัดสินใจ</p>
      <ul className="meta-ops-history seo-history">
        {row.decisions.length ? row.decisions.map((item) => (
          <li key={item.id}>
            {item.title || "Decision"} · {item.decision || "—"} · {item.owner || "—"}
          </li>
        )) : <li>ยังไม่มีมติ</li>}
      </ul>
      <p>การอนุมัติ</p>
      <ul className="meta-ops-history seo-history">
        {row.approvals.length ? row.approvals.map((item) => (
          <li key={item.id}>
            {item.kind || "Approval"} · {WEB_APPROVAL_LABEL[item.status]} · {item.notes || ""}
          </li>
        )) : <li>ยังไม่มีการอนุมัติ</li>}
      </ul>
      {access.canEditBoard ? (
        <form
          className="b2b-inline"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => addWebsiteApprovalNote(new FormData(event.currentTarget)), "บันทึกการอนุมัติแล้ว");
            event.currentTarget.reset();
          }}
        >
          <input type="hidden" name="id" value={row.id} />
          <input className="crm-field" name="kind" placeholder="ประเภท เช่น Launch approval" aria-label={`ประเภทอนุมัติ ${row.hotelName}`} />
          <select className="crm-select" name="status" defaultValue="awaiting" aria-label={`สถานะอนุมัติ ${row.hotelName}`}>
            {WEB_APPROVAL_STATUSES.map((item) => (
              <option key={item} value={item}>
                {WEB_APPROVAL_LABEL[item]}
              </option>
            ))}
          </select>
          <input className="crm-field" name="notes" placeholder="บันทึกการอนุมัติ" aria-label={`บันทึกอนุมัติ ${row.hotelName}`} />
          <button className="kpi-button b2b-save" type="submit" disabled={pending}>
            เพิ่มบันทึกอนุมัติ
          </button>
        </form>
      ) : null}
      <p>ประวัติ</p>
      <ul className="meta-ops-history seo-history">
        {row.history.length ? row.history.slice(0, 8).map((item) => (
          <li key={item.id}>
            {formatDate(item.createdAt)} · {item.action} · {item.detail}
          </li>
        )) : <li>ยังไม่มีประวัติ</li>}
      </ul>
      {row.kpis.length ? (
        <ul className="meta-ops-history seo-history">
          {row.kpis.map((item) => (
            <li key={item.id}>
              {item.name}: {item.value || "—"} ({WEB_KPI_DATA_STATUS_LABEL[item.dataStatus]})
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  const card = (row: WebProjectRow) => (
    <article className="b2b-card" key={row.id}>
      <button type="button" className="b2b-name" onClick={() => openRow(row)}>
        {row.projectName || row.hotelName}
      </button>
      <p>
        {row.hotelName} · {WEB_WORKSTREAM_LABEL[row.workstream]}
      </p>
      <div className="b2b-meta">
        <span className={`b2b-status is-${row.status}`}>{WEB_STATUS_LABEL[row.status]}</span>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
        <span className={`b2b-status b2b-priority is-${row.priority}`}>{WEB_PRIORITY_LABEL[row.priority]}</span>
      </div>
      <p>
        {row.ownerName || "—"} · {WEB_DEPARTMENT_LABEL[row.department]}
      </p>
      <p>
        Launch: {formatDate(row.launchDate) || "—"} · Next: {row.nextAction || "—"}
      </p>
      {access.canEditBoard ? (
        <form
          className="b2b-inline"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => changeWebsiteStatus(new FormData(event.currentTarget)), "เปลี่ยนสถานะแล้ว");
          }}
        >
          <input type="hidden" name="id" value={row.id} />
          <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.hotelName}`}>
            {WEB_STATUSES.map((item) => (
              <option key={item} value={item}>
                {WEB_STATUS_LABEL[item]}
              </option>
            ))}
          </select>
          <button className="kpi-button b2b-save" type="submit" disabled={pending}>
            สถานะ
          </button>
        </form>
      ) : null}
      <div className="b2b-card-actions">
        <button type="button" className="crm-users-secondary" onClick={() => setExpanded(expanded === row.id ? "" : row.id)}>
          {expanded === row.id ? "ซ่อนรายละเอียด" : "ขยาย"}
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
      {expanded === row.id ? expandBlock(row) : null}
    </article>
  );

  const tableRows = (rows: WebProjectRow[]) =>
    rows.map((row) => (
      <Fragment key={row.id}>
        <tr>
          <td data-label="โปรเจกต์">
            <button type="button" className="b2b-name" onClick={() => openRow(row)}>
              {row.projectName || row.hotelName}
            </button>
            <small>{row.hotelName}</small>
            <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
            <span className={`b2b-status is-${row.progress.readiness}`}>{WEB_READINESS_LABEL[row.progress.readiness]}</span>
          </td>
          <td data-label="โรงแรม">{row.hotelName || "—"}</td>
          <td data-label="ผู้รับผิดชอบ">{row.ownerName || "—"}</td>
          <td data-label="แผนก">{WEB_DEPARTMENT_LABEL[row.department]}</td>
          <td data-label="สถานะ">
            <span className={`b2b-status is-${row.status}`}>{WEB_STATUS_LABEL[row.status]}</span>
          </td>
          <td data-label="ตลาด">{row.targetMarket || "—"}</td>
          <td data-label="เปิดตัว">{formatDate(row.launchDate) || "—"}</td>
          <td data-label="อัปเดต">{formatDate(row.updatedAt) || "—"}</td>
          <td data-label={extraColumnLabel(section)}>{extraColumnValue(section, row)}</td>
          <td data-label="การดำเนินการ">
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
                      run(() => changeWebsiteStatus(new FormData(event.currentTarget)), "เปลี่ยนสถานะแล้ว");
                    }}
                  >
                    <input type="hidden" name="id" value={row.id} />
                    <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.hotelName}`}>
                      {WEB_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {WEB_STATUS_LABEL[item]}
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
          <tr className="seo-ops-expand">
            <td colSpan={10}>{expandBlock(row)}</td>
          </tr>
        ) : null}
      </Fragment>
    ));

  return (
    <div className="b2b-page seo-ops web-ops">
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
      <div className="seo-ops-status-row" aria-label="สรุปบอร์ดเว็บไซต์">
        <div className="seo-ops-stat">
          <span>{WEB_SECTION_LABEL[section]}</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>Live / Monitoring</span>
          <strong>{counts.live}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>ต้องติดตาม</span>
          <strong>{counts.due}</strong>
        </div>
      </div>
      <div className="b2b-toolbar">
        <div className="b2b-tabs" role="tablist" aria-label="มุมมองบอร์ดเว็บไซต์">
          <Link className={`b2b-tab${view === "table" ? " is-active" : ""}`} href={hrefFor({ view: "table" })}>
            Table
          </Link>
          <Link className={`b2b-tab${view === "board" ? " is-active" : ""}`} href={hrefFor({ view: "board" })}>
            Board
          </Link>
        </div>
        <form className="b2b-filters" method="get">
          <input type="hidden" name="view" value={view} />
          <input className="crm-field" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหาโปรเจกต์ โรงแรม หรือตลาด" aria-label="ค้นหา" />
          <select className="crm-select" name="status" defaultValue={filters.status ?? ""} aria-label="สถานะ">
            <option value="">ทุกสถานะ</option>
            {WEB_STATUSES.map((item) => (
              <option key={item} value={item}>
                {WEB_STATUS_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="ownerId" defaultValue={filters.ownerId ?? ""} aria-label="ผู้รับผิดชอบ">
            <option value="">ทุกเจ้าของ</option>
            {staff.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select className="crm-select" name="department" defaultValue={filters.department ?? ""} aria-label="แผนก">
            <option value="">ทุกแผนก</option>
            {WEB_DEPARTMENTS.map((item) => (
              <option key={item} value={item}>
                {WEB_DEPARTMENT_LABEL[item]}
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
          <select className="crm-select" name="projectType" defaultValue={filters.projectType ?? ""} aria-label="ประเภทงาน">
            <option value="">ทุกประเภท</option>
            {WEB_PROJECT_TYPES.map((item) => (
              <option key={item} value={item}>
                {WEB_PROJECT_TYPE_LABEL[item]}
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
          <select className="crm-select" name="language" defaultValue={filters.language ?? ""} aria-label="ภาษา">
            <option value="">ทุกภาษา</option>
            {facets.languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="crm-select" name="group" defaultValue={groupBy} aria-label="จัดกลุ่ม">
            {WEB_GROUP_BY.map((item) => (
              <option key={item} value={item}>
                Group: {WEB_GROUP_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="sort" defaultValue={sort} aria-label="เรียงลำดับ">
            {WEB_SORTS.map((item) => (
              <option key={item} value={item}>
                Sort: {WEB_SORT_LABEL[item]}
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
                setDraft(emptyWebDraft(access.userId, WEB_SECTION_WORKSTREAM[section] || "project"));
                setSubtaskDraft(emptyWebSubtaskDraft(access.userId));
                setSubtaskComment("");
                setDrawer(true);
                setOk("");
                setError("");
              }}
            >
              เพิ่มโปรเจกต์
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
            <p className="crm-pipe-table-empty">ยังไม่มีโปรเจกต์ — สร้างด้วยปุ่มเพิ่มโปรเจกต์ ไม่มีการนำเข้าข้อมูล</p>
          ) : (
            groups.map((group) =>
              group.items.length ? (
                <section className="b2b-group" key={group.key} style={{ marginBottom: "0.9rem" }}>
                  <header className="b2b-group-head">
                    <strong>{group.label}</strong>
                    <span>{group.items.length}</span>
                  </header>
                  <table className="crm-pipe-table b2b-table seo-ops-table" aria-label={`ตาราง ${WEB_SECTION_LABEL[section]}`}>
                    <thead>
                      <tr>
                        <th scope="col">โปรเจกต์</th>
                        <th scope="col">โรงแรม</th>
                        <th scope="col">ผู้รับผิดชอบ</th>
                        <th scope="col">แผนก</th>
                        <th scope="col">สถานะ</th>
                        <th scope="col">ตลาด</th>
                        <th scope="col">เปิดตัว</th>
                        <th scope="col">อัปเดต</th>
                        <th scope="col">{extraColumnLabel(section)}</th>
                        <th scope="col">การดำเนินการ</th>
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
        <WebsiteRecordForm
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
          subtaskDraft={subtaskDraft}
          subtaskComment={subtaskComment}
          onSubtaskDraftChange={setSubtaskDraft}
          onSubtaskCommentChange={setSubtaskComment}
          onSaveSubtask={() => {
            const data = new FormData();
            data.set("id", subtaskDraft.id);
            data.set("propertyId", draft.id);
            data.set("name", subtaskDraft.name);
            data.set("department", subtaskDraft.department);
            data.set("ownerId", subtaskDraft.ownerId);
            data.set("status", subtaskDraft.status);
            data.set("dueAt", subtaskDraft.dueAt);
            data.set("priority", subtaskDraft.priority);
            data.set("comments", subtaskDraft.comments);
            data.set("source", subtaskDraft.source);
            data.set("completed", subtaskDraft.status === "completed" ? "1" : "0");
            run(() => saveWebsiteSubtask(data), subtaskDraft.id ? "บันทึกงานย่อยแล้ว" : "เพิ่มงานย่อยแล้ว");
          }}
          onCompleteSubtask={(item, completed) => {
            const data = new FormData();
            data.set("id", item.id);
            data.set("propertyId", item.propertyId);
            data.set("name", item.name);
            data.set("department", item.department);
            data.set("ownerId", item.ownerId);
            data.set("completed", completed ? "1" : "0");
            run(() => completeWebsiteSubtask(data), completed ? "ปิดงานย่อยแล้ว" : "เปิดงานย่อยแล้ว");
          }}
          onPatchSubtask={patchSubtask}
          onDeleteSubtask={(item) => {
            const data = new FormData();
            data.set("id", item.id);
            run(() => removeWebsiteSubtask(data), "ลบงานย่อยแล้ว");
          }}
          onAddSubtaskComment={(subtaskId) => {
            const data = new FormData();
            data.set("id", subtaskId);
            data.set("body", subtaskComment);
            run(async () => {
              const result = await addWebsiteSubtaskComment(data);
              if (result.ok) setSubtaskComment("");
              return result;
            }, "บันทึกความเห็นแล้ว");
          }}
          onAttachSubtaskFile={(subtaskId, form) => {
            const data = new FormData(form);
            data.set("id", subtaskId);
            run(() => attachWebsiteSubtaskFile(data), "แนบไฟล์แล้ว");
          }}
          onEscalate={() => setEscalateId(draft.id)}
          onCloseRecord={() => setCloseId(draft.id)}
        />
      ) : null}

      {escalateId ? (
        <B2bDialog
          title="Escalate ไป Management"
          body="ยืนยันส่งงานนี้ให้ Management และตั้งสถานะ Awaiting Hotel Approval"
          confirmLabel="Escalate"
          pending={pending}
          onCancel={() => setEscalateId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", escalateId);
            run(() => escalateWebsiteWork(data), "Escalate แล้ว");
            setEscalateId("");
          }}
        />
      ) : null}

      {closeId ? (
        <B2bDialog
          title="Close โปรเจกต์เว็บไซต์"
          body="ยืนยันปิดงานนี้? สถานะจะเป็น Archived รายการยังอยู่ภายในระบบ และไม่แสดงบนหน้าสาธารณะ"
          confirmLabel="Close"
          pending={pending}
          onCancel={() => setCloseId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", closeId);
            run(() => closeWebsiteWork(data), "เก็บเข้าคลังแล้ว");
            setCloseId("");
            setDrawer(false);
          }}
        />
      ) : null}

      {deleteId ? (
        <B2bDialog
          title="ลบโปรเจกต์เว็บไซต์"
          body="ยืนยันลบรายการนี้จากบอร์ดภายใน ไม่กระทบหน้าสาธารณะ"
          confirmLabel="ลบ"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", deleteId);
            run(() => removeWebsiteWork(data), "ลบแล้ว");
            setDeleteId("");
            if (draft.id === deleteId) setDrawer(false);
          }}
        />
      ) : null}
    </div>
  );
}
