"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";
import {
  addTrainingApprovalNote,
  addTrainingReviewerNote,
  addTrainingSubtaskComment,
  archiveTrainingWork,
  assignTrainingWork,
  changeTrainingStatus,
  completeTrainingSubtask,
  escalateTrainingIssue,
  removeTrainingSubtask,
  removeTrainingWork,
  saveTrainingSubtask,
  saveTrainingWork,
} from "@/lib/training-ops/actions";
import {
  TRN_DEPARTMENT_DUTIES,
  TRN_DEPARTMENT_LABEL,
  TRN_DEPARTMENT_PATH,
  TRN_DEPARTMENTS,
  TRN_FORMAT_LABEL,
  TRN_GROUP_BY,
  TRN_GROUP_LABEL,
  TRN_KIND_LABEL,
  TRN_GATE_LABEL,
  TRN_PRIORITY_LABEL,
  TRN_SECTION_KIND,
  TRN_SECTION_LABEL,
  TRN_SORT_LABEL,
  TRN_SORTS,
  TRN_STATUS_LABEL,
  TRN_STATUSES,
  departmentLabel,
  trnErrorMessage,
  trnGateKind,
  webSectionPath,
  type TrnAccessView,
  type TrnGroupBy,
  type TrnListFilters,
  type TrnRecordRow,
  type TrnSection,
  type TrnSettings,
  type TrnStatus,
  type TrnSubtaskView,
} from "@/lib/training-ops/types";
import { B2bDialog } from "@/components/b2b-ops/ui";
import { TrainingOpsRecordForm, draftFromRow, emptyTrnDraft, type TrnRecordDraft } from "./TrainingOpsRecordForm";
import { emptyTrnSubtaskDraft, type TrnSubtaskDraft } from "./TrainingOpsSubtasksPanel";
import "@/components/b2b-ops/b2b-ops.css";
import "@/components/systems-ops/systems-ops.css";
import "./training-ops.css";

type Staff = { id: string; name: string };

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

function extraLabel(section: TrnSection) {
  if (section === "calendar" || section === "sessions") return "Session";
  if (section === "programs") return "Format";
  if (section === "assessment") return "Aggregate";
  if (section === "trainers") return "Language";
  if (section === "reports" || section === "feedback") return "KPI";
  if (section === "approvals") return "Approver";
  return "Goal / notes";
}

function extraValue(section: TrnSection, row: TrnRecordRow) {
  if (section === "calendar" || section === "sessions") return formatDate(row.eventAt) || row.payload.dateWindow || "—";
  if (section === "programs") return TRN_FORMAT_LABEL[row.payload.format as keyof typeof TRN_FORMAT_LABEL] || row.payload.category || "—";
  if (section === "assessment") return row.payload.aggregatedResult || "—";
  if (section === "trainers") return row.payload.language || "—";
  if (section === "reports" || section === "feedback") return row.payload.metric || row.payload.value || "—";
  if (section === "approvals") return row.approverName || "—";
  return row.payload.goal || row.notes || "—";
}

function groupValue(row: TrnRecordRow, groupBy: TrnGroupBy) {
  if (groupBy === "department") return row.department;
  if (groupBy === "property") return row.hotelName || "none";
  if (groupBy === "trainer") return row.trainerName || row.payload.trainerName || "none";
  if (groupBy === "program") return row.payload.programName || "none";
  if (groupBy === "date") return (row.eventAt || row.payload.dateWindow || "none").slice(0, 10);
  return row.status;
}

function payloadFields(draft: TrnRecordDraft) {
  return Object.entries(draft.payload).map(([key, value]) => [key, value === true ? "1" : value === false ? "0" : String(value ?? "")] as const);
}

export function TrainingOpsBoard({
  section,
  items,
  staff,
  access,
  settings,
  facets,
  programOptions = [],
  filters,
  groupBy,
  sort,
}: {
  section: TrnSection;
  items: TrnRecordRow[];
  staff: Staff[];
  access: TrnAccessView;
  settings: TrnSettings;
  facets: { hotels: string[]; trainers: string[]; programs: string[] };
  programOptions?: Array<{ id: string; title: string }>;
  filters: TrnListFilters;
  groupBy: TrnGroupBy;
  sort: string;
}) {
  const router = useRouter();
  const extras = settings.extraDepartments;
  const departments = [...TRN_DEPARTMENTS, ...extras.map((item) => item.id)];
  const kind = TRN_SECTION_KIND[section];
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState<TrnRecordDraft>(emptyTrnDraft(access.userId, kind, filters.department || "hr_ld"));
  const [expanded, setExpanded] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [archiveId, setArchiveId] = useState("");
  const [subtaskDraft, setSubtaskDraft] = useState<TrnSubtaskDraft>(emptyTrnSubtaskDraft(access.userId, filters.department || "hr_ld"));
  const [subtaskComment, setSubtaskComment] = useState("");
  const view = filters.view === "board" ? "board" : "table";
  const current = items.find((item) => item.id === draft.id);

  const counts = useMemo(
    () => ({
      total: items.length,
      live: items.filter((item) => ["approved", "published", "scheduled", "confirmed", "in_progress"].includes(item.status)).length,
      review: items.filter((item) => item.status === "review").length,
      hold: items.filter((item) => item.status === "on_hold" || item.status === "cancelled").length,
    }),
    [items],
  );

  const groups = useMemo(() => {
    const order =
      groupBy === "status"
        ? [...TRN_STATUSES]
        : groupBy === "department"
          ? departments
          : Array.from(new Set(items.map((item) => groupValue(item, groupBy))));
    return order.map((key) => ({
      key,
      label:
        groupBy === "status"
          ? TRN_STATUS_LABEL[key as TrnStatus] || key
          : groupBy === "department"
            ? departmentLabel(key, extras)
            : key === "none"
              ? "ไม่ระบุ"
              : key,
      items: items.filter((item) => groupValue(item, groupBy) === key),
    }));
  }, [departments, extras, groupBy, items]);

  function run(task: () => Promise<{ ok: true; id: string } | { ok: false; error: string }>, success: string) {
    startTransition(async () => {
      setError("");
      setOk("");
      const result = await task();
      if (!result.ok) {
        setError(trnErrorMessage(result.error));
        return;
      }
      setOk(success);
      if (!draft.id && result.id) setDraft((currentDraft) => ({ ...currentDraft, id: result.id }));
      if (success.includes("งานย่อย") && !subtaskDraft.id) {
        setSubtaskDraft(emptyTrnSubtaskDraft(access.userId, draft.department || "hr_ld"));
      }
      router.refresh();
    });
  }

  function saveDraft() {
    const data = new FormData();
    data.set("id", draft.id);
    data.set("kind", draft.kind);
    data.set("title", draft.title);
    data.set("hotelName", draft.hotelName);
    data.set("department", draft.department);
    data.set("ownerId", draft.ownerId);
    data.set("approverId", draft.approverId);
    data.set("trainerId", draft.trainerId);
    data.set("programId", draft.programId);
    data.set("status", draft.status);
    data.set("priority", draft.priority);
    data.set("eventAt", draft.eventAt);
    data.set("notes", draft.notes);
    payloadFields(draft).forEach(([key, value]) => data.set(key, value));
    run(() => saveTrainingWork(data), draft.id ? "บันทึกแล้ว / Saved" : "สร้างรายการแล้ว / Created");
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

  function fillSubtaskForm(item: TrnSubtaskView, patch: Partial<TrnSubtaskDraft> = {}) {
    const data = new FormData();
    data.set("id", item.id);
    data.set("recordId", item.recordId);
    data.set("name", patch.name ?? item.name);
    data.set("department", patch.department ?? item.department);
    data.set("ownerId", patch.ownerId ?? item.ownerId);
    data.set("reviewerId", patch.reviewerId ?? item.reviewerId);
    const status = patch.status ?? item.status;
    data.set("status", status);
    data.set("completed", (patch.status ? status === "completed" : item.completed || status === "completed") ? "1" : "0");
    data.set("dueAt", patch.dueAt ?? item.dueAt);
    data.set("priority", patch.priority ?? item.priority);
    data.set("comments", patch.comments ?? item.comments);
    data.set("evidence", patch.evidence ?? item.evidence);
    data.set("gateKind", patch.gateKind ?? item.gateKind);
    return data;
  }

  function saveSubtaskDraft() {
    const data = new FormData();
    data.set("id", subtaskDraft.id);
    data.set("recordId", draft.id);
    data.set("name", subtaskDraft.name);
    data.set("department", subtaskDraft.department);
    data.set("ownerId", subtaskDraft.ownerId);
    data.set("reviewerId", subtaskDraft.reviewerId);
    data.set("status", subtaskDraft.status);
    data.set("completed", subtaskDraft.status === "completed" ? "1" : "0");
    data.set("dueAt", subtaskDraft.dueAt);
    data.set("priority", subtaskDraft.priority);
    data.set("comments", subtaskDraft.comments);
    data.set("evidence", subtaskDraft.evidence);
    data.set("gateKind", subtaskDraft.gateKind);
    run(() => saveTrainingSubtask(data), subtaskDraft.id ? "บันทึกงานย่อยแล้ว" : "เพิ่มงานย่อยแล้ว");
  }

  function openRow(row: TrnRecordRow) {
    setDraft(draftFromRow(row));
    setSubtaskDraft(emptyTrnSubtaskDraft(access.userId, row.department || "hr_ld"));
    setSubtaskComment("");
    setDrawer(true);
    setOk("");
    setError("");
  }

  const expandBlock = (row: TrnRecordRow) => (
    <div className="b2b-expand">
      <p>
        {TRN_KIND_LABEL[row.kind]} · {row.hotelName || "—"} · {departmentLabel(row.department, extras)} · อัปเดต {formatDate(row.updatedAt) || "—"}
      </p>
      {row.notes ? <p>บันทึก: {row.notes}</p> : null}
      <p>{row.payload.goal || row.payload.outcomes || row.notes || "ยังไม่มีบันทึก"}</p>
      <p>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
      </p>
      {row.progress.blockedByGate ? (
        <p className="trn-gate-alert" role="status">
          Blocked — {row.progress.gateReasons.map((item) => TRN_GATE_LABEL[item]).join(", ")} blocks publication/delivery
        </p>
      ) : null}
      {access.canEditBoard ? (
        <form
          className="b2b-inline"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => assignTrainingWork(new FormData(event.currentTarget)), "มอบหมายแล้ว");
          }}
        >
          <input type="hidden" name="id" value={row.id} />
          <select className="crm-select" name="ownerId" defaultValue={row.ownerId} aria-label="มอบหมาย">
            {staff.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <button className="kpi-button b2b-save" type="submit" disabled={pending}>
            มอบหมาย
          </button>
        </form>
      ) : null}
      <p>งานย่อย / หลักฐาน</p>
      <ul>
        {row.subtasks.length
          ? row.subtasks.map((item) => (
              <li key={item.id}>
                {item.name} · {item.status}
                {item.gateKind !== "none" ? ` · ${TRN_GATE_LABEL[item.gateKind]}` : ""}
                {item.evidence ? ` · ${item.evidence}` : ""}
              </li>
            ))
          : <li>ยังไม่มีงานย่อย</li>}
      </ul>
      <p>อนุมัติ</p>
      <ul>
        {row.approvals.length ? row.approvals.map((item) => <li key={item.id}>{item.status} · {item.notes}</li>) : <li>ยังไม่มีบันทึกอนุมัติ</li>}
      </ul>
      <p>ประวัติ</p>
      <ul>
        {row.history.length ? row.history.slice(0, 6).map((item) => <li key={item.id}>{formatDate(item.createdAt)} · {item.action} · {item.detail}</li>) : <li>ยังไม่มีประวัติ</li>}
      </ul>
    </div>
  );

  const actions = (row: TrnRecordRow) => (
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
              run(() => changeTrainingStatus(new FormData(event.currentTarget)), "เปลี่ยนสถานะแล้ว");
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.title}`}>
              {TRN_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {TRN_STATUS_LABEL[item]}
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
          <button type="button" className="crm-users-secondary" onClick={() => setArchiveId(row.id)}>
            Archive
          </button>
          <button type="button" className="crm-users-secondary" onClick={() => setDeleteId(row.id)}>
            ลบ
          </button>
        </>
      ) : null}
    </div>
  );

  const card = (row: TrnRecordRow) => (
    <article className="b2b-card" key={row.id}>
      <button type="button" className="b2b-name" onClick={() => openRow(row)}>
        {row.title || row.hotelName}
      </button>
      <p>
        {row.hotelName} · {departmentLabel(row.department, extras)}
      </p>
      <div className="b2b-meta">
        <span className={`b2b-status is-${row.status}`}>{TRN_STATUS_LABEL[row.status]}</span>
        <span className={`b2b-status b2b-priority is-${row.priority}`}>{TRN_PRIORITY_LABEL[row.priority]}</span>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
      </div>
      <p>
        {row.ownerName || "—"} · {extraValue(section, row)}
      </p>
      {actions(row)}
      {expanded === row.id ? expandBlock(row) : null}
    </article>
  );

  const tableRows = (rows: TrnRecordRow[]) =>
    rows.map((row) => (
      <Fragment key={row.id}>
        <tr>
          <td data-label="รายการ">
            <button type="button" className="b2b-name" onClick={() => openRow(row)}>
              {row.title || row.hotelName}
            </button>
            <small>{TRN_KIND_LABEL[row.kind]}</small>
          </td>
          <td data-label="โรงแรม">{row.hotelName || "—"}</td>
          <td data-label="แผนก">{departmentLabel(row.department, extras)}</td>
          <td data-label="เจ้าของ">{row.ownerName || "—"}</td>
          <td data-label="สถานะ">
            <span className={`b2b-status is-${row.status}`}>{TRN_STATUS_LABEL[row.status]}</span>
            <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
          </td>
          <td data-label="ความสำคัญ">{TRN_PRIORITY_LABEL[row.priority]}</td>
          <td data-label="วันที่">{formatDate(row.eventAt) || row.payload.dateWindow || "—"}</td>
          <td data-label="อัปเดต">{formatDate(row.updatedAt) || "—"}</td>
          <td data-label={extraLabel(section)}>{extraValue(section, row)}</td>
          <td data-label="การดำเนินการ">{actions(row)}</td>
        </tr>
        {expanded === row.id ? (
          <tr className="seo-ops-expand">
            <td colSpan={10}>{expandBlock(row)}</td>
          </tr>
        ) : null}
      </Fragment>
    ));

  return (
    <div className="b2b-page seo-ops web-ops trn-ops">
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
      <div className="seo-ops-status-row" aria-label="สรุปบอร์ด Hotel Training Operations">
        <div className="seo-ops-stat">
          <span>{TRN_SECTION_LABEL[section]}</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>Active</span>
          <strong>{counts.live}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>Review</span>
          <strong>{counts.review}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>Hold / Cancelled</span>
          <strong>{counts.hold}</strong>
        </div>
      </div>
      <div className="b2b-toolbar">
        <div className="b2b-tabs" role="tablist" aria-label="มุมมองบอร์ด">
          <Link className={`b2b-tab${view === "table" ? " is-active" : ""}`} href={hrefFor({ view: "table" })}>
            Table
          </Link>
          <Link className={`b2b-tab${view === "board" ? " is-active" : ""}`} href={hrefFor({ view: "board" })}>
            Board
          </Link>
        </div>
        <form className="b2b-filters" method="get">
          <input type="hidden" name="view" value={view} />
          <input className="crm-field" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหาโรงแรม โปรแกรม หรือเจ้าของ" aria-label="ค้นหา" />
          <select className="crm-select" name="hotel" defaultValue={filters.hotel ?? ""} aria-label="โรงแรม">
            <option value="">ทุกโรงแรม</option>
            {facets.hotels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="crm-select" name="department" defaultValue={filters.department ?? ""} aria-label="แผนก">
            <option value="">ทุกแผนก</option>
            {departments.map((item) => (
              <option key={item} value={item}>
                {departmentLabel(item, extras)}
              </option>
            ))}
          </select>
          <select className="crm-select" name="status" defaultValue={filters.status ?? ""} aria-label="สถานะ">
            <option value="">ทุกสถานะ</option>
            {TRN_STATUSES.map((item) => (
              <option key={item} value={item}>
                {TRN_STATUS_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="trainer" defaultValue={filters.trainer ?? ""} aria-label="วิทยากร">
            <option value="">ทุกวิทยากร</option>
            {facets.trainers.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="crm-select" name="program" defaultValue={filters.program ?? ""} aria-label="โปรแกรม">
            <option value="">ทุกโปรแกรม</option>
            {facets.programs.map((item) => (
              <option key={item} value={item}>
                {item}
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
          <input className="crm-field" type="date" name="date" defaultValue={filters.date ?? ""} aria-label="วันที่" />
          <select className="crm-select" name="group" defaultValue={groupBy} aria-label="จัดกลุ่ม">
            {TRN_GROUP_BY.map((item) => (
              <option key={item} value={item}>
                Group: {TRN_GROUP_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="sort" defaultValue={sort} aria-label="เรียงลำดับ">
            {TRN_SORTS.map((item) => (
              <option key={item} value={item}>
                Sort: {TRN_SORT_LABEL[item]}
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
                setDraft(emptyTrnDraft(access.userId, kind, filters.department || "hr_ld"));
                setSubtaskDraft(emptyTrnSubtaskDraft(access.userId, filters.department || "hr_ld"));
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

      {section === "departments" && !filters.department ? (
        <nav className="trn-dept-hub" aria-label="Department workspaces">
          {TRN_DEPARTMENTS.map((item) => (
            <Link key={item} className="trn-dept-card" href={TRN_DEPARTMENT_PATH[item]}>
              <strong>{TRN_DEPARTMENT_LABEL[item]}</strong>
              <span>{TRN_DEPARTMENT_DUTIES[item].join(" · ")}</span>
            </Link>
          ))}
          {extras.map((item) => (
            <Link key={item.id} className="trn-dept-card" href={`${webSectionPath("departments")}?department=${encodeURIComponent(item.id)}`}>
              <strong>{item.label}</strong>
              <span>แผนกที่เพิ่มจาก Settings</span>
            </Link>
          ))}
        </nav>
      ) : null}

      {view === "board" ? (
        <div className="b2b-board is-columns">
          {groups.map((group) => (
            <section className="b2b-group" key={group.key}>
              <header className="b2b-group-head">
                <strong>{group.label}</strong>
                <span>{group.items.length}</span>
              </header>
              <div className="b2b-group-body">{group.items.length ? group.items.map(card) : <p className="b2b-muted">ยังไม่มีรายการ</p>}</div>
            </section>
          ))}
        </div>
      ) : (
        <div className="crm-pipe-table-wrap b2b-table-wrap">
          {items.length === 0 ? (
            <p className="crm-pipe-table-empty">ยังไม่มีรายการ — สร้างด้วยปุ่มเพิ่มรายการ ไม่มีการนำเข้าข้อมูล</p>
          ) : (
            groups.map((group) =>
              group.items.length ? (
                <section className="b2b-group" key={group.key} style={{ marginBottom: "0.9rem" }}>
                  <header className="b2b-group-head">
                    <strong>{group.label}</strong>
                    <span>{group.items.length}</span>
                  </header>
                  <table className="crm-pipe-table b2b-table seo-ops-table" aria-label={`ตาราง ${TRN_SECTION_LABEL[section]}`}>
                    <thead>
                      <tr>
                        <th scope="col">รายการ</th>
                        <th scope="col">โรงแรม</th>
                        <th scope="col">แผนก</th>
                        <th scope="col">เจ้าของ</th>
                        <th scope="col">สถานะ</th>
                        <th scope="col">ความสำคัญ</th>
                        <th scope="col">วันที่</th>
                        <th scope="col">อัปเดต</th>
                        <th scope="col">{extraLabel(section)}</th>
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
        <TrainingOpsRecordForm
          key={`${draft.id || "new"}-${section}`}
          draft={draft}
          row={current}
          staff={staff}
          programs={programOptions}
          access={access}
          extras={extras}
          section={section}
          pending={pending}
          ok={ok}
          error={error}
          onChange={setDraft}
          onSave={saveDraft}
          onClose={() => setDrawer(false)}
          onArchive={() => setArchiveId(draft.id)}
          subtaskDraft={subtaskDraft}
          subtaskComment={subtaskComment}
          onSubtaskDraftChange={setSubtaskDraft}
          onSubtaskCommentChange={setSubtaskComment}
          onSaveSubtask={saveSubtaskDraft}
          onCompleteSubtask={(item: TrnSubtaskView, completed) => {
            const data = new FormData();
            data.set("id", item.id);
            data.set("completed", completed ? "1" : "0");
            run(() => completeTrainingSubtask(data), completed ? "ปิดงานย่อยแล้ว" : "เปิดงานย่อยแล้ว");
          }}
          onDeleteSubtask={(item) => {
            const data = new FormData();
            data.set("id", item.id);
            run(() => removeTrainingSubtask(data), "ลบงานย่อยแล้ว");
          }}
          onAddComment={(subtaskId) => {
            const data = new FormData();
            data.set("id", subtaskId);
            data.set("body", subtaskComment);
            run(() => addTrainingSubtaskComment(data), "บันทึกความเห็นแล้ว");
            setSubtaskComment("");
          }}
          onPatchSubtask={(item, patch) => {
            run(() => saveTrainingSubtask(fillSubtaskForm(item, patch)), "บันทึกงานย่อยแล้ว");
          }}
          onAddDuty={(department, name) => {
            const data = new FormData();
            data.set("recordId", draft.id);
            data.set("name", name);
            data.set("department", department);
            data.set("ownerId", access.userId);
            data.set("gateKind", trnGateKind(name, department));
            run(() => saveTrainingSubtask(data), "เพิ่มงานย่อยแล้ว");
          }}
          onReviewerNote={(subtaskId, notes, reviewerId) => {
            const data = new FormData();
            data.set("id", subtaskId);
            data.set("body", notes);
            data.set("reviewerId", reviewerId);
            run(() => addTrainingReviewerNote(data), "บันทึก reviewer แล้ว");
          }}
          onApprove={(decision, notes) => {
            const data = new FormData();
            data.set("id", draft.id);
            data.set("decision", decision);
            data.set("notes", notes);
            run(() => addTrainingApprovalNote(data), decision === "approve" ? "อนุมัติแล้ว" : "ปฏิเสธแล้ว");
          }}
          onEscalate={(notes) => {
            const data = new FormData();
            data.set("id", draft.id);
            data.set("notes", notes);
            run(() => escalateTrainingIssue(data), "ส่งต่อแล้ว / Escalated");
          }}
        />
      ) : null}

      {archiveId ? (
        <B2bDialog
          title="Archive รายการ"
          body="ยืนยันเก็บรายการนี้เข้าคลังภายใน? รายการจะไม่แสดงบนบอร์ดหลัก และไม่แสดงบนหน้าสาธารณะ"
          confirmLabel="Archive"
          pending={pending}
          onCancel={() => setArchiveId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", archiveId);
            run(() => archiveTrainingWork(data), "เก็บเข้าคลังแล้ว");
            setArchiveId("");
            setDrawer(false);
          }}
        />
      ) : null}

      {deleteId ? (
        <B2bDialog
          title="ลบรายการ"
          body="ยืนยันลบรายการนี้จากบอร์ดภายใน ไม่กระทบหน้าสาธารณะ"
          confirmLabel="ลบ"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", deleteId);
            run(() => removeTrainingWork(data), "ลบแล้ว");
            setDeleteId("");
            if (draft.id === deleteId) setDrawer(false);
          }}
        />
      ) : null}
    </div>
  );
}
