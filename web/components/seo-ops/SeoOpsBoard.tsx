"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";
import {
  addSeoSource,
  addSeoSubtaskComment,
  assignSeoWork,
  attachSeoSubtaskFile,
  changeSeoDepartment,
  changeSeoStatus,
  closeSeoWork,
  completeSeoSubtask,
  escalateSeoWork,
  removeSeoWork,
  saveSeoSubtask,
  saveSeoWork,
} from "@/lib/seo-ops/actions";
import {
  MAX_SEO_SUBTASKS,
  SEO_DEPARTMENT_LABEL,
  SEO_DEPARTMENTS,
  SEO_GROUP_BY,
  SEO_GROUP_LABEL,
  SEO_KPI_DATA_STATUS_LABEL,
  SEO_PRIORITY_LABEL,
  SEO_READINESS_LABEL,
  SEO_SECTION_LABEL,
  SEO_SECTION_WORKSTREAM,
  SEO_SORT_LABEL,
  SEO_SORTS,
  SEO_STATUS_LABEL,
  SEO_STATUSES,
  SEO_SUBTASK_STATUS_LABEL,
  SEO_WORKSTREAM_LABEL,
  SEO_WORKSTREAMS,
  seoErrorMessage,
  seoSectionPath,
  type SeoAccessView,
  type SeoDepartment,
  type SeoGroupBy,
  type SeoListFilters,
  type SeoPropertyRow,
  type SeoSection,
  type SeoStatus,
  type SeoSubtaskView,
  type SeoWorkstream,
} from "@/lib/seo-ops/types";
import { B2bDialog, toDateInput } from "@/components/b2b-ops/ui";
import { SeoRecordForm, draftFromRow, emptySeoDraft, type SeoRecordDraft } from "./SeoRecordForm";
import { emptySeoSubtaskDraft, type SeoSubtaskDraft } from "./SeoSubtasksPanel";
import "@/components/b2b-ops/b2b-ops.css";
import "./seo-ops.css";

type Staff = { id: string; name: string };

function extraColumnLabel(section: SeoSection) {
  if (section === "gbp") return "GBP";
  if (section === "maps") return "Maps";
  if (section === "aeo") return "AEO";
  if (section === "reviews") return "Reviews";
  if (section === "contact") return "Booking";
  if (section === "audit") return "Audit";
  if (section === "reports") return "KPI";
  if (section === "sources") return "Sources";
  return "Category";
}

function extraColumnValue(section: SeoSection, row: SeoPropertyRow) {
  if (section === "gbp") return row.gbpName || row.gbpCategory || "—";
  if (section === "maps") return row.mapsUrl || row.location || "—";
  if (section === "aeo") return row.aeoQueries[0]?.query || "—";
  if (section === "reviews") return row.reviewWorkflow || row.gbpReviewWorkflow || "—";
  if (section === "contact") return row.bookingUrl || row.contactPath || "—";
  if (section === "audit") return row.auditAt ? formatDate(row.auditAt) : "—";
  if (section === "reports") return row.kpis[0]?.name || "—";
  if (section === "sources") return String(row.sources.length);
  return row.primaryCategory || "—";
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

export function SeoOpsBoard({
  section,
  items,
  staff,
  access,
  facets,
  filters,
  groupBy,
  sort,
}: {
  section: SeoSection;
  items: SeoPropertyRow[];
  staff: Staff[];
  access: SeoAccessView;
  facets: { hotels: string[]; markets: string[] };
  filters: SeoListFilters;
  groupBy: SeoGroupBy;
  sort: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState<SeoRecordDraft>(emptySeoDraft(access.userId, SEO_SECTION_WORKSTREAM[section] || "visibility"));
  const [expanded, setExpanded] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [closeId, setCloseId] = useState("");
  const [escalateId, setEscalateId] = useState("");
  const [subtaskDraft, setSubtaskDraft] = useState<SeoSubtaskDraft>(emptySeoSubtaskDraft(access.userId));
  const [subtaskComment, setSubtaskComment] = useState("");
  const view = filters.view === "board" ? "board" : "table";
  const current = items.find((item) => item.id === draft.id);

  const counts = useMemo(() => {
    return {
      total: items.length,
      live: items.filter((item) => item.status === "published" || item.status === "tracking" || item.status === "completed").length,
      due: items.filter((item) =>
        ["audit_scheduled", "in_review", "action_planned", "in_progress", "waiting_hotel", "ready_approval"].includes(item.status),
      ).length,
    };
  }, [items]);

  const groups = useMemo(() => {
    const order =
      groupBy === "status"
        ? [...SEO_STATUSES]
        : groupBy === "department"
          ? [...SEO_DEPARTMENTS]
          : groupBy === "workstream"
            ? [...SEO_WORKSTREAMS]
            : groupBy === "hotel"
              ? Array.from(new Set(items.map((item) => item.hotelName || "none")))
              : groupBy === "market"
                ? Array.from(new Set(items.map((item) => item.searchMarket || "none")))
                : Array.from(new Set(items.map((item) => item.ownerId || "none")));
    return order.map((key) => ({
      key,
      label:
        groupBy === "status"
          ? SEO_STATUS_LABEL[key as SeoStatus] || key
          : groupBy === "department"
            ? SEO_DEPARTMENT_LABEL[key as SeoDepartment] || key
            : groupBy === "workstream"
              ? SEO_WORKSTREAM_LABEL[key as SeoWorkstream] || key
              : groupBy === "owner"
                ? staff.find((item) => item.id === key)?.name || "ยังไม่มอบหมาย"
                : key === "none"
                  ? groupBy === "market"
                    ? "ไม่ระบุตลาด"
                    : "ไม่ระบุโรงแรม"
                  : key,
      items:
        groupBy === "owner"
          ? items.filter((item) => (item.ownerId || "none") === key)
          : groupBy === "hotel"
            ? items.filter((item) => (item.hotelName || "none") === key)
            : groupBy === "market"
              ? items.filter((item) => (item.searchMarket || "none") === key)
              : items.filter((item) => item[groupBy] === key),
    }));
  }, [groupBy, items, staff]);

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) {
        setError(seoErrorMessage(result.error));
        return;
      }
      setOk(success);
      if (!draft.id && result.id) setDraft((currentDraft) => ({ ...currentDraft, id: result.id }));
      router.refresh();
    });
  }

  function saveDraft() {
    const data = new FormData();
    Object.entries(draft).forEach(([key, value]) => {
      if (key === "sources") data.set("sourcesJson", JSON.stringify(value));
      else if (key === "aeoQueries") data.set("aeoJson", JSON.stringify(value));
      else if (key === "kpis") data.set("kpisJson", JSON.stringify(value));
      else data.set(key, String(value ?? ""));
    });
    run(() => saveSeoWork(data), draft.id ? "บันทึกแล้ว" : "สร้างรายการแล้ว");
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
    const path = seoSectionPath(section);
    return text ? `${path}?${text}` : path;
  }

  function openRow(row: SeoPropertyRow) {
    setDraft(draftFromRow(row));
    setSubtaskDraft(emptySeoSubtaskDraft(row.ownerId || access.userId, row.department));
    setSubtaskComment("");
    setDrawer(true);
    setOk("");
    setError("");
  }

  function patchSubtask(item: SeoSubtaskView, patch: Partial<SeoSubtaskDraft>) {
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
    const completed = patch.status === "completed" || (patch.status ? false : item.completed);
    data.set("completed", completed ? "1" : "0");
    run(() => saveSeoSubtask(data), "บันทึกซับงานแล้ว");
  }

  const expandBlock = (row: SeoPropertyRow) => (
    <div className="b2b-expand">
      <p>
        {row.location || "—"} · {row.searchMarket || "ไม่ระบุตลาด"} · อัปเดต {formatDate(row.updatedAt) || "—"}
      </p>
      <p>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {SEO_READINESS_LABEL[row.progress.readiness]}
      </p>
      {access.canEditBoard ? (
        <div className="ads-inline-assign">
          <form
            className="b2b-inline"
            onSubmit={(event) => {
              event.preventDefault();
              run(() => assignSeoWork(new FormData(event.currentTarget)), "มอบหมายแล้ว");
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
              run(() => changeSeoDepartment(new FormData(event.currentTarget)), "เปลี่ยนแผนกแล้ว");
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <select className="crm-select" name="department" defaultValue={row.department} aria-label={`แผนก ${row.hotelName}`}>
              {SEO_DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {SEO_DEPARTMENT_LABEL[item]}
                </option>
              ))}
            </select>
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              แผนก
            </button>
          </form>
        </div>
      ) : null}
      <p>Subtasks</p>
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
                    data.set("completed", item.completed ? "0" : "1");
                    run(() => completeSeoSubtask(data), item.completed ? "เปิดซับงานแล้ว" : "ปิดซับงานแล้ว");
                  }}
                />
                <span>
                  {item.name} · {SEO_DEPARTMENT_LABEL[item.department]} · {SEO_SUBTASK_STATUS_LABEL[item.status]}
                </span>
              </label>
            </li>
          ))
        ) : (
          <li>ยังไม่มีซับงาน</li>
        )}
      </ul>
      {access.canEditBoard && row.subtasks.length < MAX_SEO_SUBTASKS ? (
        <button
          type="button"
          className="kpi-button b2b-save"
          onClick={() => {
            openRow(row);
            setSubtaskDraft(emptySeoSubtaskDraft(row.ownerId || access.userId, row.department));
          }}
        >
          เพิ่มซับงาน
        </button>
      ) : null}
      {access.canEditBoard ? (
        <form
          className="b2b-inline"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => addSeoSource(new FormData(event.currentTarget)), "เพิ่มแหล่งที่มาแล้ว");
            event.currentTarget.reset();
          }}
        >
          <input type="hidden" name="propertyId" value={row.id} />
          <input className="crm-field" name="name" placeholder="ชื่อแหล่งที่มา" aria-label={`แหล่งที่มา ${row.hotelName}`} />
          <input className="crm-field" name="url" placeholder="URL" aria-label={`URL แหล่งที่มา ${row.hotelName}`} />
          <button className="kpi-button b2b-save" type="submit" disabled={pending}>
            เพิ่มแหล่งที่มา
          </button>
        </form>
      ) : null}
      <p>Audit history</p>
      <ul className="meta-ops-history seo-history">
        {row.history.length ? (
          row.history.slice(0, 8).map((item) => (
            <li key={item.id}>
              {formatDate(item.createdAt)} · {item.action} · {item.detail}
            </li>
          ))
        ) : (
          <li>ยังไม่มีประวัติ</li>
        )}
      </ul>
      <p>Sources</p>
      <ul className="meta-ops-history seo-history">
        {row.sources.length ? (
          row.sources.map((item) => (
            <li key={item.id}>
              {item.name || "Source"} {item.url ? `· ${item.url}` : ""}
            </li>
          ))
        ) : (
          <li>ยังไม่มีแหล่งที่มา</li>
        )}
      </ul>
      {row.aeoQueries.length ? (
        <>
          <p>AEO</p>
          <ul className="meta-ops-history seo-history">
            {row.aeoQueries.map((item) => (
              <li key={item.id}>
                {item.query} · {item.intent || "intent"} · {item.publishedStatus}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {row.kpis.length ? (
        <ul className="meta-ops-history seo-history">
          {row.kpis.map((item) => (
            <li key={item.id}>
              {item.name}: {item.value || "—"} ({SEO_KPI_DATA_STATUS_LABEL[item.dataStatus]})
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  const card = (row: SeoPropertyRow) => (
    <article className="b2b-card" key={row.id}>
      <button type="button" className="b2b-name" onClick={() => openRow(row)}>
        {row.businessName || row.hotelName}
      </button>
      <p>
        {row.hotelName} · {SEO_WORKSTREAM_LABEL[row.workstream]}
      </p>
      <div className="b2b-meta">
        <span className={`b2b-status is-${row.status}`}>{SEO_STATUS_LABEL[row.status]}</span>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
        <span className={`b2b-status is-${row.progress.readiness}`}>{SEO_READINESS_LABEL[row.progress.readiness]}</span>
        <span className={`b2b-status b2b-priority is-${row.priority}`}>{SEO_PRIORITY_LABEL[row.priority]}</span>
      </div>
      <p>
        {row.ownerName || "—"} · {SEO_DEPARTMENT_LABEL[row.department]}
      </p>
      <p>
        Next: {row.nextAction || "—"} {row.nextActionAt ? `· ${formatDate(row.nextActionAt)}` : ""}
      </p>
      {access.canEditBoard ? (
        <form
          className="b2b-inline"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => changeSeoStatus(new FormData(event.currentTarget)), "เปลี่ยนสถานะแล้ว");
          }}
        >
          <input type="hidden" name="id" value={row.id} />
          <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.hotelName}`}>
            {SEO_STATUSES.map((item) => (
              <option key={item} value={item}>
                {SEO_STATUS_LABEL[item]}
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
      {expanded === row.id ? expandBlock(row) : null}
    </article>
  );

  const tableRows = (rows: SeoPropertyRow[]) =>
    rows.map((row) => (
      <Fragment key={row.id}>
        <tr>
          <td data-label="Property">
            <button type="button" className="b2b-name" onClick={() => openRow(row)}>
              {row.businessName || row.hotelName}
            </button>
            <small>{row.hotelName}</small>
            <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
          </td>
          <td data-label="Workstream">{SEO_WORKSTREAM_LABEL[row.workstream]}</td>
          <td data-label="Owner">{row.ownerName || "—"}</td>
          <td data-label="Department">{SEO_DEPARTMENT_LABEL[row.department]}</td>
          <td data-label="Status">
            <span className={`b2b-status is-${row.status}`}>{SEO_STATUS_LABEL[row.status]}</span>
            <span className={`b2b-status is-${row.progress.readiness}`}>{SEO_READINESS_LABEL[row.progress.readiness]}</span>
          </td>
          <td data-label="Market">{row.searchMarket || "—"}</td>
          <td data-label="Next">
            {row.nextAction || "—"}
            {row.nextActionAt ? <small>{formatDate(row.nextActionAt)}</small> : null}
          </td>
          <td data-label="Updated">{formatDate(row.updatedAt) || "—"}</td>
          <td data-label={extraColumnLabel(section)}>{extraColumnValue(section, row)}</td>
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
                      run(() => changeSeoStatus(new FormData(event.currentTarget)), "เปลี่ยนสถานะแล้ว");
                    }}
                  >
                    <input type="hidden" name="id" value={row.id} />
                    <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.hotelName}`}>
                      {SEO_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {SEO_STATUS_LABEL[item]}
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
    <div className="b2b-page seo-ops">
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
      <div className="seo-ops-status-row" aria-label="สรุปบอร์ด">
        <div className="seo-ops-stat">
          <span>{SEO_SECTION_LABEL[section]}</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>Published / Tracking</span>
          <strong>{counts.live}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>ต้องติดตาม</span>
          <strong>{counts.due}</strong>
        </div>
      </div>
      <div className="b2b-toolbar">
        <div className="b2b-tabs" role="tablist" aria-label="มุมมองบอร์ด Local Search">
          <Link className={`b2b-tab${view === "table" ? " is-active" : ""}`} href={hrefFor({ view: "table" })}>
            Table
          </Link>
          <Link className={`b2b-tab${view === "board" ? " is-active" : ""}`} href={hrefFor({ view: "board" })}>
            Board
          </Link>
        </div>
        <form className="b2b-filters" method="get">
          <input type="hidden" name="view" value={view} />
          <input className="crm-field" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหาโรงแรม ตลาด หรือ next action" aria-label="ค้นหา" />
          <select className="crm-select" name="status" defaultValue={filters.status ?? ""} aria-label="สถานะ">
            <option value="">ทุกสถานะ</option>
            {SEO_STATUSES.map((item) => (
              <option key={item} value={item}>
                {SEO_STATUS_LABEL[item]}
              </option>
            ))}
          </select>
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
            {SEO_DEPARTMENTS.map((item) => (
              <option key={item} value={item}>
                {SEO_DEPARTMENT_LABEL[item]}
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
          {section === "visibility" ? (
            <select className="crm-select" name="workstream" defaultValue={filters.workstream ?? ""} aria-label="สายงาน">
              <option value="">ทุกสายงาน</option>
              {SEO_WORKSTREAMS.map((item) => (
                <option key={item} value={item}>
                  {SEO_WORKSTREAM_LABEL[item]}
                </option>
              ))}
            </select>
          ) : null}
          <select className="crm-select" name="group" defaultValue={groupBy} aria-label="จัดกลุ่ม">
            {SEO_GROUP_BY.map((item) => (
              <option key={item} value={item}>
                Group: {SEO_GROUP_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="sort" defaultValue={sort} aria-label="เรียงลำดับ">
            {SEO_SORTS.map((item) => (
              <option key={item} value={item}>
                Sort: {SEO_SORT_LABEL[item]}
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
                setDraft(emptySeoDraft(access.userId, SEO_SECTION_WORKSTREAM[section] || "visibility"));
                setSubtaskDraft(emptySeoSubtaskDraft(access.userId));
                setSubtaskComment("");
                setDrawer(true);
                setOk("");
                setError("");
              }}
            >
              เพิ่มรายการ
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
            <p className="crm-pipe-table-empty">ยังไม่มีรายการ — สร้างด้วยปุ่มเพิ่มรายการ ไม่มีการนำเข้าข้อมูล</p>
          ) : (
            groups.map((group) => (
              <section className="b2b-group" key={group.key} style={{ marginBottom: "0.9rem" }}>
                <header className="b2b-group-head">
                  <strong>{group.label}</strong>
                  <span>{group.items.length}</span>
                </header>
                <table className="crm-pipe-table b2b-table seo-ops-table" aria-label={`ตาราง ${SEO_SECTION_LABEL[section]}`}>
                  <thead>
                    <tr>
                      <th scope="col">Property</th>
                      <th scope="col">Workstream</th>
                      <th scope="col">Owner</th>
                      <th scope="col">Department</th>
                      <th scope="col">Status</th>
                      <th scope="col">Market</th>
                      <th scope="col">Next action</th>
                      <th scope="col">Updated</th>
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

      {drawer ? (
        <SeoRecordForm
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
            run(() => saveSeoSubtask(data), subtaskDraft.id ? "บันทึกซับงานแล้ว" : "เพิ่มซับงานแล้ว");
          }}
          onCompleteSubtask={(item, completed) => {
            const data = new FormData();
            data.set("id", item.id);
            data.set("completed", completed ? "1" : "0");
            run(() => completeSeoSubtask(data), completed ? "ปิดซับงานแล้ว" : "เปิดซับงานแล้ว");
          }}
          onPatchSubtask={patchSubtask}
          onAddSubtaskComment={(subtaskId) => {
            const data = new FormData();
            data.set("subtaskId", subtaskId);
            data.set("body", subtaskComment);
            run(async () => {
              const result = await addSeoSubtaskComment(data);
              if (result.ok) setSubtaskComment("");
              return result;
            }, "บันทึกความเห็นแล้ว");
          }}
          onAttachSubtaskFile={(subtaskId, form) => {
            const data = new FormData(form);
            data.set("subtaskId", subtaskId);
            run(() => attachSeoSubtaskFile(data), "แนบไฟล์แล้ว");
          }}
          onEscalate={() => setEscalateId(draft.id)}
          onCloseRecord={() => setCloseId(draft.id)}
        />
      ) : null}

      {escalateId ? (
        <B2bDialog
          title="Escalate ไป Management"
          body="ยืนยันส่งงานนี้ให้ Management อนุมัติ? จะย้ายแผนกเป็น Management และตั้งสถานะ Ready for Approval"
          confirmLabel="Escalate"
          pending={pending}
          onCancel={() => setEscalateId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", escalateId);
            run(() => escalateSeoWork(data), "Escalate แล้ว");
            setEscalateId("");
          }}
        />
      ) : null}

      {closeId ? (
        <B2bDialog
          title="ปิดงาน Local Search"
          body="ยืนยันปิดงานนี้? สถานะจะเป็น Completed และไม่แสดงบนหน้าสาธารณะ"
          confirmLabel="Close"
          pending={pending}
          onCancel={() => setCloseId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", closeId);
            run(() => closeSeoWork(data), "ปิดงานแล้ว");
            setCloseId("");
            setDrawer(false);
          }}
        />
      ) : null}

      {deleteId ? (
        <B2bDialog
          title="ลบรายการ Local Search"
          body="ยืนยันลบรายการนี้จากบอร์ดภายใน ข้อมูลจะไม่แสดงบนหน้าสาธารณะอยู่แล้ว"
          confirmLabel="ลบ"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", deleteId);
            run(() => removeSeoWork(data), "ลบแล้ว");
            setDeleteId("");
            if (draft.id === deleteId) setDrawer(false);
          }}
        />
      ) : null}
    </div>
  );
}
