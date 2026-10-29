"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";
import {
  addWebsiteApprovalNote,
  addManagementSubtaskComment,
  assignWebsiteWork,
  attachManagementSubtaskFile,
  changeWebsiteDepartment,
  changeWebsiteStatus,
  closeWebsiteWork,
  completeManagementSubtask,
  escalateWebsiteWork,
  removeManagementSubtask,
  removeWebsiteWork,
  saveManagementSubtask,
  saveWebsiteWork,
} from "@/lib/management-ops/actions";
import {
  MAX_MGMT_SUBTASKS,
  MGMT_APPROVAL_LABEL,
  MGMT_APPROVAL_STATUSES,
  MGMT_ASSESSMENT_AREA_LABEL,
  MGMT_CADENCE_LABEL,
  MGMT_CADENCES,
  MGMT_DEPARTMENT_LABEL,
  MGMT_DEPARTMENTS,
  MGMT_GROUP_BY,
  MGMT_GROUP_LABEL,
  MGMT_KPI_DATA_STATUS_LABEL,
  MGMT_PLAN_PHASE_LABEL,
  MGMT_PRIORITY_LABEL,
  MGMT_PRIORITIES,
  MGMT_PROJECT_TYPE_LABEL,
  MGMT_PROJECT_TYPES,
  MGMT_READINESS_LABEL,
  MGMT_SECTION_LABEL,
  MGMT_SECTION_WORKSTREAM,
  MGMT_SORT_LABEL,
  MGMT_SORTS,
  MGMT_STATUS_LABEL,
  MGMT_STATUSES,
  MGMT_SUBTASK_STATUS_LABEL,
  MGMT_WORKSTREAM_LABEL,
  MGMT_WORKSTREAMS,
  webErrorMessage,
  webSectionPath,
  type MgmtAccessView,
  type MgmtCadence,
  type MgmtDepartment,
  type MgmtGroupBy,
  type MgmtListFilters,
  type MgmtPriority,
  type MgmtProjectRow,
  type MgmtSection,
  type MgmtStatus,
  type MgmtSubtaskView,
  type MgmtWorkstream,
} from "@/lib/management-ops/types";
import { B2bDialog, toDateInput } from "@/components/b2b-ops/ui";
import { ManagementRecordForm, draftFromRow, emptyMgmtDraft, type MgmtRecordDraft } from "./ManagementRecordForm";
import { emptyMgmtSubtaskDraft, type MgmtSubtaskDraft } from "./ManagementSubtasksPanel";
import "@/components/b2b-ops/b2b-ops.css";
import "./management-ops.css";

type Staff = { id: string; name: string };

function extraColumnLabel(section: MgmtSection) {
  if (section === "assessments") return "Assessment";
  if (section === "plans") return "Plan phase";
  if (section === "commercial") return "Commercial";
  if (section === "marketing") return "Marketing";
  if (section === "distribution") return "Distribution";
  if (section === "operations") return "Operations";
  if (section === "guest") return "Guest Experience";
  if (section === "people") return "People";
  if (section === "meetings") return "Cadence";
  if (section === "kpi") return "KPI";
  if (section === "actions") return "Next action";
  if (section === "approvals") return "Approval";
  if (section === "handover") return "Handover";
  return "Objective";
}

function extraColumnValue(section: MgmtSection, row: MgmtProjectRow) {
  if (section === "assessments") {
    const item = row.assessments[0];
    return item ? `${MGMT_ASSESSMENT_AREA_LABEL[item.area]} · ${item.question || "—"}` : "—";
  }
  if (section === "plans") {
    const item = row.plans[0];
    return item ? `${MGMT_PLAN_PHASE_LABEL[item.phase]} · ${item.objective || item.action || "—"}` : "—";
  }
  if (section === "commercial") return row.commercial.summary || row.primaryGoal || "—";
  if (section === "marketing") return row.marketingBlock.summary || "—";
  if (section === "distribution") return row.distributionBlock.summary || "—";
  if (section === "operations") return row.operations.summary || "—";
  if (section === "guest") return row.guest.summary || "—";
  if (section === "people") return row.people[0]?.role || "—";
  if (section === "meetings") return row.meetings[0] ? `${MGMT_CADENCE_LABEL[row.meetings[0].meetingType]} · ${row.meetings[0].agenda || "—"}` : MGMT_CADENCE_LABEL[row.kpiCadence];
  if (section === "kpi") return row.primaryKpi || row.kpis[0]?.name || "—";
  if (section === "actions") return row.actionLogs[0]?.name || row.nextAction || "—";
  if (section === "approvals") return MGMT_APPROVAL_LABEL[row.approvals[0]?.status || "not_requested"];
  if (section === "handover") return MGMT_READINESS_LABEL[row.handoverStatus];
  return row.primaryGoal || MGMT_PROJECT_TYPE_LABEL[row.propertyType];
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

function groupValue(row: MgmtProjectRow, groupBy: MgmtGroupBy) {
  if (groupBy === "owner") return row.ownerId || "none";
  if (groupBy === "hotel") return row.hotelName || "none";
  if (groupBy === "department") return row.department;
  if (groupBy === "workstream") return row.workstream;
  if (groupBy === "priority") return row.priority;
  if (groupBy === "cadence") return row.kpiCadence;
  return row.status;
}

export function ManagementOpsBoard({
  section,
  items,
  staff,
  access,
  facets,
  filters,
  groupBy,
  sort,
}: {
  section: MgmtSection;
  items: MgmtProjectRow[];
  staff: Staff[];
  access: MgmtAccessView;
  facets: { hotels: string[]; markets: string[] };
  filters: MgmtListFilters;
  groupBy: MgmtGroupBy;
  sort: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState<MgmtRecordDraft>(emptyMgmtDraft(access.userId, MGMT_SECTION_WORKSTREAM[section] || "properties"));
  const [expanded, setExpanded] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [closeId, setCloseId] = useState("");
  const [escalateId, setEscalateId] = useState("");
  const [subtaskDraft, setSubtaskDraft] = useState<MgmtSubtaskDraft>(emptyMgmtSubtaskDraft(access.userId));
  const [subtaskComment, setSubtaskComment] = useState("");
  const view = filters.view === "board" ? "board" : "table";
  const current = items.find((item) => item.id === draft.id);

  const counts = useMemo(
    () => ({
      total: items.length,
      live: items.filter((item) => item.status === "monitoring" || item.status === "completed" || item.status === "in_progress").length,
      due: items.filter((item) => ["in_progress", "in_review", "awaiting_approval", "plan_ready", "blocked", "assessing"].includes(item.status)).length,
    }),
    [items],
  );

  const groups = useMemo(() => {
    const order =
      groupBy === "status"
        ? [...MGMT_STATUSES]
        : groupBy === "department"
          ? [...MGMT_DEPARTMENTS]
          : groupBy === "workstream"
            ? [...MGMT_WORKSTREAMS]
            : groupBy === "priority"
              ? [...MGMT_PRIORITIES]
              : groupBy === "cadence"
                ? [...MGMT_CADENCES]
            : Array.from(new Set(items.map((item) => groupValue(item, groupBy))));
    return order.map((key) => ({
      key,
      label:
        groupBy === "status"
          ? MGMT_STATUS_LABEL[key as MgmtStatus] || key
          : groupBy === "department"
            ? MGMT_DEPARTMENT_LABEL[key as MgmtDepartment] || key
            : groupBy === "workstream"
              ? MGMT_WORKSTREAM_LABEL[key as MgmtWorkstream] || key
              : groupBy === "priority"
                ? MGMT_PRIORITY_LABEL[key as MgmtPriority] || key
                : groupBy === "cadence"
                  ? MGMT_CADENCE_LABEL[key as MgmtCadence] || key
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
    const scalars: Array<keyof MgmtRecordDraft> = [
      "id",
      "projectName",
      "hotelName",
      "propertyType",
      "roomCount",
      "locationMarket",
      "hotelStatus",
      "primaryGoal",
      "mainChallenge",
      "startDate",
      "launchDate",
      "status",
      "ownerId",
      "department",
      "workstream",
      "priority",
      "scope",
      "hotelApprover",
      "nextAction",
      "nextActionAt",
      "kpiCadence",
      "dataStatus",
      "notes",
      "primaryKpi",
      "kpiTarget",
      "handoverStatus",
    ];
    scalars.forEach((key) => data.set(key, String(draft[key] ?? "")));
    data.set("qaJson", JSON.stringify(draft.qa));
    data.set("handoverJson", JSON.stringify(draft.handover));
    data.set("filesJson", JSON.stringify(draft.fileNotes));
    data.set("approvalsJson", JSON.stringify(draft.approvals));
    data.set("assessmentsJson", JSON.stringify(draft.assessments));
    data.set("plansJson", JSON.stringify(draft.plans));
    data.set("meetingsJson", JSON.stringify(draft.meetings));
    data.set("actionLogsJson", JSON.stringify(draft.actionLogs));
    data.set("peopleJson", JSON.stringify(draft.people));
    data.set("commercialJson", JSON.stringify(draft.commercial));
    data.set("marketingJson", JSON.stringify(draft.marketingBlock));
    data.set("distributionJson", JSON.stringify(draft.distributionBlock));
    data.set("operationsJson", JSON.stringify(draft.operations));
    data.set("guestJson", JSON.stringify(draft.guest));
    data.set("kpisJson", JSON.stringify(draft.kpis));
    data.set("sourcesJson", JSON.stringify([]));
    run(() => saveWebsiteWork(data), draft.id ? "บันทึกแล้ว" : "สร้างทรัพย์สินแล้ว");
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

  function openRow(row: MgmtProjectRow) {
    setDraft(draftFromRow(row));
    setSubtaskDraft(emptyMgmtSubtaskDraft(row.ownerId || access.userId, row.department));
    setSubtaskComment("");
    setDrawer(true);
    setOk("");
    setError("");
  }

  function patchSubtask(item: MgmtSubtaskView, patch: Partial<MgmtSubtaskDraft>) {
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
    run(() => saveManagementSubtask(data), "บันทึกงานย่อยแล้ว");
  }

  const expandBlock = (row: MgmtProjectRow) => (
    <div className="b2b-expand">
      <p>
        {row.projectName} · {row.hotelName} · {MGMT_PROJECT_TYPE_LABEL[row.propertyType]} · อัปเดต {formatDate(row.updatedAt) || "—"}
      </p>
      <p>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {MGMT_READINESS_LABEL[row.progress.readiness]}
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
              {MGMT_DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {MGMT_DEPARTMENT_LABEL[item]}
                </option>
              ))}
            </select>
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              แผนก
            </button>
          </form>
        </div>
      ) : null}
      <p>
        งานย่อย · <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {row.progress.percent}% ·{" "}
        {MGMT_READINESS_LABEL[row.progress.readiness]}
      </p>
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
                    run(() => completeManagementSubtask(data), item.completed ? "เปิดงานย่อยแล้ว" : "ปิดงานย่อยแล้ว");
                  }}
                />
                <span>
                  {item.name} · {MGMT_DEPARTMENT_LABEL[item.department]} · {MGMT_SUBTASK_STATUS_LABEL[item.status]}
                  {item.source ? ` · ${item.source}` : ""}
                </span>
              </label>
              {item.files.length ? (
                <p>
                  {item.files.map((file) => (
                    <a key={file.id} href={file.href}>
                      {file.filename}
                    </a>
                  ))}
                </p>
              ) : null}
              {access.canEditBoard ? (
                <form
                  className="b2b-inline"
                  onSubmit={(event) => {
                    event.preventDefault();
                    patchSubtask(item, { source: String(new FormData(event.currentTarget).get("source") || "") });
                  }}
                >
                  <input className="crm-field" name="source" defaultValue={item.source} placeholder="Evidence URL" aria-label={`หลักฐาน ${item.name}`} />
                  <button className="kpi-button b2b-save" type="submit" disabled={pending}>
                    เพิ่มหลักฐาน
                  </button>
                </form>
              ) : null}
            </li>
          ))
        ) : (
          <li>ยังไม่มีงานย่อย</li>
        )}
      </ul>
      {access.canEditBoard && row.subtasks.length < MAX_MGMT_SUBTASKS ? (
        <button type="button" className="kpi-button b2b-save" onClick={() => openRow(row)}>
          เพิ่มงานย่อย
        </button>
      ) : null}
      <p>ความเห็น</p>
      <ul className="meta-ops-history seo-history">
        {row.subtasks.flatMap((item) => item.thread).length ? (
          row.subtasks.flatMap((item) =>
            item.thread.map((comment) => (
              <li key={comment.id}>
                {formatDate(comment.createdAt)} · {comment.authorName || "—"} · {item.name}: {comment.body}
              </li>
            )),
          )
        ) : (
          <li>ยังไม่มีความเห็น</li>
        )}
      </ul>
      {access.canEditBoard && row.subtasks.length ? (
        <>
          <form
            className="b2b-inline"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const data = new FormData(form);
              run(async () => {
                const result = await addManagementSubtaskComment(data);
                if (result.ok) form.reset();
                return result;
              }, "บันทึกความเห็นแล้ว");
            }}
          >
            <select className="crm-select" name="id" defaultValue={row.subtasks[0]?.id} aria-label={`งานย่อยสำหรับความเห็น ${row.hotelName}`}>
              {row.subtasks.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input className="crm-field" name="body" placeholder="เพิ่มความคิดเห็น" aria-label={`ความเห็น ${row.hotelName}`} />
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              เพิ่มความคิดเห็น
            </button>
          </form>
          <form
            className="b2b-inline"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const data = new FormData(form);
              run(() => attachManagementSubtaskFile(data), "แนบไฟล์แล้ว");
              form.reset();
            }}
          >
            <select className="crm-select" name="id" defaultValue={row.subtasks[0]?.id} aria-label={`งานย่อยสำหรับไฟล์ ${row.hotelName}`}>
              {row.subtasks.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input className="crm-field" type="file" name="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" aria-label={`แนบไฟล์ ${row.hotelName}`} />
            <input className="crm-field" name="caption" placeholder="คำอธิบายไฟล์" aria-label={`คำอธิบายไฟล์ ${row.hotelName}`} />
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              แนบไฟล์
            </button>
          </form>
        </>
      ) : null}
      <p>Assessments</p>
      <ul className="meta-ops-history seo-history">
        {row.assessments.length ? row.assessments.map((item) => (
          <li key={item.id}>
            {MGMT_ASSESSMENT_AREA_LABEL[item.area]} · {item.question || "—"} · {MGMT_PRIORITY_LABEL[item.risk]} · {item.recommendedAction || "—"}
          </li>
        )) : <li>ยังไม่มี assessment</li>}
      </ul>
      <p>Actions</p>
      <ul className="meta-ops-history seo-history">
        {row.actionLogs.length ? row.actionLogs.map((item) => (
          <li key={item.id}>
            {item.name || "Action"} · {MGMT_SUBTASK_STATUS_LABEL[item.status]} · {item.owner || "—"} · {item.dueAt ? formatDate(item.dueAt) : "—"}
          </li>
        )) : <li>ยังไม่มี action</li>}
      </ul>
      <p>การอนุมัติ</p>
      <ul className="meta-ops-history seo-history">
        {row.approvals.length ? row.approvals.map((item) => (
          <li key={item.id}>
            {item.kind || "Approval"} · {MGMT_APPROVAL_LABEL[item.status]} · {item.notes || ""}
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
            {MGMT_APPROVAL_STATUSES.map((item) => (
              <option key={item} value={item}>
                {MGMT_APPROVAL_LABEL[item]}
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
              {item.name}: {item.value || "—"} ({MGMT_KPI_DATA_STATUS_LABEL[item.dataStatus]})
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  const card = (row: MgmtProjectRow) => (
    <article className="b2b-card" key={row.id}>
      <button type="button" className="b2b-name" onClick={() => openRow(row)}>
        {row.projectName || row.hotelName}
      </button>
      <p>
        {row.hotelName} · {MGMT_WORKSTREAM_LABEL[row.workstream]}
      </p>
      <div className="b2b-meta">
        <span className={`b2b-status is-${row.status}`}>{MGMT_STATUS_LABEL[row.status]}</span>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
        <span className={`b2b-status b2b-priority is-${row.priority}`}>{MGMT_PRIORITY_LABEL[row.priority]}</span>
      </div>
      <p>
        {row.ownerName || "—"} · {MGMT_DEPARTMENT_LABEL[row.department]}
      </p>
      <p>
        Review: {formatDate(row.launchDate) || "—"} · Next: {row.nextAction || "—"}
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
            {MGMT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {MGMT_STATUS_LABEL[item]}
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

  const tableRows = (rows: MgmtProjectRow[]) =>
    rows.map((row) => (
      <Fragment key={row.id}>
        <tr>
          <td data-label="ทรัพย์สิน">
            <button type="button" className="b2b-name" onClick={() => openRow(row)}>
              {row.projectName || row.hotelName}
            </button>
            <small>{row.hotelName}</small>
            <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
            <span className={`b2b-status is-${row.progress.readiness}`}>{MGMT_READINESS_LABEL[row.progress.readiness]}</span>
          </td>
          <td data-label="โรงแรม">{row.hotelName || "—"}</td>
          <td data-label="ผู้รับผิดชอบ">{row.ownerName || "—"}</td>
          <td data-label="แผนก">{MGMT_DEPARTMENT_LABEL[row.department]}</td>
          <td data-label="สถานะ">
            <span className={`b2b-status is-${row.status}`}>{MGMT_STATUS_LABEL[row.status]}</span>
          </td>
          <td data-label="ตลาด">{row.locationMarket || "—"}</td>
          <td data-label="วันรีวิว">{formatDate(row.launchDate) || "—"}</td>
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
                      {MGMT_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {MGMT_STATUS_LABEL[item]}
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
      <div className="seo-ops-status-row" aria-label="สรุปบอร์ด Independent Hotel Operations">
        <div className="seo-ops-stat">
          <span>{MGMT_SECTION_LABEL[section]}</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>In progress / Monitoring</span>
          <strong>{counts.live}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>ต้องติดตาม</span>
          <strong>{counts.due}</strong>
        </div>
      </div>
      <div className="b2b-toolbar">
        <div className="b2b-tabs" role="tablist" aria-label="มุมมองบอร์ด Independent Hotel Operations">
          <Link className={`b2b-tab${view === "table" ? " is-active" : ""}`} href={hrefFor({ view: "table" })}>
            Table
          </Link>
          <Link className={`b2b-tab${view === "board" ? " is-active" : ""}`} href={hrefFor({ view: "board" })}>
            Board
          </Link>
        </div>
        <form className="b2b-filters" method="get">
          <input type="hidden" name="view" value={view} />
          <input className="crm-field" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหาทรัพย์สิน โรงแรม หรือตลาด" aria-label="ค้นหา" />
          <select className="crm-select" name="status" defaultValue={filters.status ?? ""} aria-label="สถานะ">
            <option value="">ทุกสถานะ</option>
            {MGMT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {MGMT_STATUS_LABEL[item]}
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
            {MGMT_DEPARTMENTS.map((item) => (
              <option key={item} value={item}>
                {MGMT_DEPARTMENT_LABEL[item]}
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
          <select className="crm-select" name="workstream" defaultValue={filters.workstream ?? ""} aria-label="สายงาน">
            <option value="">ทุกสายงาน</option>
            {MGMT_WORKSTREAMS.map((item) => (
              <option key={item} value={item}>
                {MGMT_WORKSTREAM_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="priority" defaultValue={filters.priority ?? ""} aria-label="ความสำคัญ">
            <option value="">ทุกความสำคัญ</option>
            {MGMT_PRIORITIES.map((item) => (
              <option key={item} value={item}>
                {MGMT_PRIORITY_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="projectType" defaultValue={filters.projectType ?? ""} aria-label="ประเภททรัพย์สิน">
            <option value="">ทุกประเภท</option>
            {MGMT_PROJECT_TYPES.map((item) => (
              <option key={item} value={item}>
                {MGMT_PROJECT_TYPE_LABEL[item]}
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
          <select className="crm-select" name="cadence" defaultValue={filters.cadence ?? ""} aria-label="จังหวะ KPI">
            <option value="">ทุกจังหวะ</option>
            {MGMT_CADENCES.map((item) => (
              <option key={item} value={item}>
                {MGMT_CADENCE_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="group" defaultValue={groupBy} aria-label="จัดกลุ่ม">
            {MGMT_GROUP_BY.map((item) => (
              <option key={item} value={item}>
                Group: {MGMT_GROUP_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="sort" defaultValue={sort} aria-label="เรียงลำดับ">
            {MGMT_SORTS.map((item) => (
              <option key={item} value={item}>
                Sort: {MGMT_SORT_LABEL[item]}
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
                setDraft(emptyMgmtDraft(access.userId, MGMT_SECTION_WORKSTREAM[section] || "properties"));
                setSubtaskDraft(emptyMgmtSubtaskDraft(access.userId));
                setSubtaskComment("");
                setDrawer(true);
                setOk("");
                setError("");
              }}
            >
              เพิ่มทรัพย์สิน
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
            <p className="crm-pipe-table-empty">ยังไม่มีทรัพย์สิน — สร้างด้วยปุ่มเพิ่มทรัพย์สิน ไม่มีการนำเข้าข้อมูล</p>
          ) : (
            groups.map((group) =>
              group.items.length ? (
                <section className="b2b-group" key={group.key} style={{ marginBottom: "0.9rem" }}>
                  <header className="b2b-group-head">
                    <strong>{group.label}</strong>
                    <span>{group.items.length}</span>
                  </header>
                  <table className="crm-pipe-table b2b-table seo-ops-table" aria-label={`ตาราง ${MGMT_SECTION_LABEL[section]}`}>
                    <thead>
                      <tr>
                        <th scope="col">ทรัพย์สิน</th>
                        <th scope="col">โรงแรม</th>
                        <th scope="col">ผู้รับผิดชอบ</th>
                        <th scope="col">แผนก</th>
                        <th scope="col">สถานะ</th>
                        <th scope="col">ตลาด</th>
                        <th scope="col">วันรีวิว</th>
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
        <ManagementRecordForm
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
            run(() => saveManagementSubtask(data), subtaskDraft.id ? "บันทึกงานย่อยแล้ว" : "เพิ่มงานย่อยแล้ว");
          }}
          onCompleteSubtask={(item, completed) => {
            const data = new FormData();
            data.set("id", item.id);
            data.set("propertyId", item.propertyId);
            data.set("name", item.name);
            data.set("department", item.department);
            data.set("ownerId", item.ownerId);
            data.set("completed", completed ? "1" : "0");
            run(() => completeManagementSubtask(data), completed ? "ปิดงานย่อยแล้ว" : "เปิดงานย่อยแล้ว");
          }}
          onPatchSubtask={patchSubtask}
          onDeleteSubtask={(item) => {
            const data = new FormData();
            data.set("id", item.id);
            run(() => removeManagementSubtask(data), "ลบงานย่อยแล้ว");
          }}
          onAddSubtaskComment={(subtaskId) => {
            const data = new FormData();
            data.set("id", subtaskId);
            data.set("body", subtaskComment);
            run(async () => {
              const result = await addManagementSubtaskComment(data);
              if (result.ok) setSubtaskComment("");
              return result;
            }, "บันทึกความเห็นแล้ว");
          }}
          onAttachSubtaskFile={(subtaskId, form) => {
            const data = new FormData(form);
            data.set("id", subtaskId);
            run(() => attachManagementSubtaskFile(data), "แนบไฟล์แล้ว");
          }}
          onEscalate={() => setEscalateId(draft.id)}
          onCloseRecord={() => setCloseId(draft.id)}
        />
      ) : null}

      {escalateId ? (
        <B2bDialog
          title="Escalate ไป Management"
          body="ยืนยันส่งงานนี้ให้ Management และตั้งสถานะ Awaiting Approval"
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
          title="Close ทรัพย์สิน"
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
          title="ลบทรัพย์สิน"
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
