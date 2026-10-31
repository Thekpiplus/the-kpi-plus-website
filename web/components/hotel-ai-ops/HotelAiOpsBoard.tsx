"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";
import {
  addHotelAiApprovalNote,
  addHotelAiReviewerNote,
  addHotelAiSubtaskComment,
  archiveHotelAiWork,
  assignHotelAiWork,
  changeHotelAiDepartment,
  changeHotelAiStatus,
  completeHotelAiSubtask,
  decideHotelAiPilotGate,
  escalateHotelAiIssue,
  removeHotelAiSubtask,
  removeHotelAiWork,
  saveHotelAiSubtask,
  saveHotelAiWork,
} from "@/lib/hotel-ai-ops/actions";
import {
  HAI_APPROACH_LABEL,
  HAI_APPROACHES,
  HAI_APPROVAL_LABEL,
  HAI_APPROVAL_STATUSES,
  HAI_DEPARTMENTS,
  HAI_GROUP_BY,
  HAI_GROUP_LABEL,
  HAI_ISSUE_STATUS_LABEL,
  HAI_PILOT_DECISION_LABEL,
  HAI_PILOT_PHASE_LABEL,
  HAI_PILOT_PHASES,
  HAI_RISK_LABEL,
  HAI_RISKS,
  HAI_SECTION_LABEL,
  HAI_SORT_LABEL,
  HAI_SORTS,
  HAI_STATUS_LABEL,
  HAI_STATUSES,
  HAI_TEST_STATUS_LABEL,
  departmentLabel,
  haiGateKind,
  webErrorMessage,
  webSectionPath,
  type HaiAccessView,
  type HaiGroupBy,
  type HaiListFilters,
  type HaiPilotPhase,
  type HaiSection,
  type HaiSettings,
  type HaiStatus,
  type HaiSubtaskView,
  type HaiWorkflowRow,
} from "@/lib/hotel-ai-ops/types";
import { B2bDialog, toDateInput } from "@/components/b2b-ops/ui";
import { HotelAiRecordForm, draftFromHaiRow, emptyHaiDraft, type HaiRecordDraft } from "./HotelAiRecordForm";
import { HotelAiSubtasksPanel, emptyHaiSubtaskDraft, type HaiSubtaskDraft } from "./HotelAiSubtasksPanel";
import "@/components/b2b-ops/b2b-ops.css";
import "@/components/systems-ops/systems-ops.css";
import "./hotel-ai-ops.css";

type Staff = { id: string; name: string };

function extraColumnLabel(section: HaiSection) {
  if (section === "pilots") return "Pilot decision";
  if (section === "use_cases") return "Use case";
  if (section === "data") return "Data class";
  if (section === "approvals") return "Approval";
  if (section === "tests") return "Test case";
  if (section === "issues") return "Issue";
  if (section === "metrics") return "Scorecard";
  if (section === "handover") return "SOP";
  if (section === "history") return "Last action";
  if (section === "backlog") return "Approach";
  return "Objective";
}

function extraColumnValue(section: HaiSection, row: HaiWorkflowRow) {
  if (section === "pilots") return HAI_PILOT_DECISION_LABEL[row.charter.decision];
  if (section === "use_cases") return row.useCases[0]?.title || "—";
  if (section === "data") return row.dataAccess[0]?.system || row.dataClass;
  if (section === "approvals") return HAI_APPROVAL_LABEL[row.approvals[0]?.status || row.charter.approvalStatus];
  if (section === "tests") {
    const item = row.tests[0];
    return item ? `${item.name || "—"} · ${HAI_TEST_STATUS_LABEL[item.status]}` : "—";
  }
  if (section === "issues") {
    const item = row.issues[0];
    return item ? `${item.title || "—"} · ${HAI_ISSUE_STATUS_LABEL[item.status]}` : row.exceptions || "—";
  }
  if (section === "metrics") return row.metrics[0]?.name || "—";
  if (section === "handover") return row.handover[0]?.asset || "—";
  if (section === "history") return row.history[0]?.action || "—";
  if (section === "backlog") return HAI_APPROACH_LABEL[row.approach];
  return row.objective || row.problem || "—";
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

function groupValue(row: HaiWorkflowRow, groupBy: HaiGroupBy) {
  if (groupBy === "owner") return row.ownerId || "none";
  if (groupBy === "property") return row.hotelName || "none";
  if (groupBy === "department") return row.department;
  if (groupBy === "pilot_phase") return row.pilotPhase;
  return row.status;
}

export function HotelAiOpsBoard({
  section,
  items,
  staff,
  access,
  settings,
  facets,
  filters,
  groupBy,
  sort,
}: {
  section: HaiSection;
  items: HaiWorkflowRow[];
  staff: Staff[];
  access: HaiAccessView;
  settings: HaiSettings;
  facets: { hotels: string[] };
  filters: HaiListFilters;
  groupBy: HaiGroupBy;
  sort: string;
}) {
  const router = useRouter();
  const extras = settings.extraDepartments;
  const departments = [...HAI_DEPARTMENTS, ...extras.map((item) => item.id)];
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState<HaiRecordDraft>(emptyHaiDraft(access.userId, filters.department || "operations"));
  const [expanded, setExpanded] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [archiveId, setArchiveId] = useState("");
  const [subtaskDraft, setSubtaskDraft] = useState<HaiSubtaskDraft>(emptyHaiSubtaskDraft(access.userId));
  const [subtaskComment, setSubtaskComment] = useState("");
  const [gateDialog, setGateDialog] = useState<{ kind: "approve" | "reject" | "escalate"; id: string } | null>(null);
  const [gateNote, setGateNote] = useState("");
  const view = filters.view === "board" ? "board" : "table";
  const current = items.find((item) => item.id === draft.id);

  const counts = useMemo(
    () => ({
      total: items.length,
      live: items.filter((item) => item.status === "pilot_running" || item.status === "ready_for_pilot").length,
      due: items.filter((item) => ["needs_review", "adjust"].includes(item.status)).length,
      blocked: items.filter((item) => item.status === "blocked" || item.progress.blockedByGate).length,
    }),
    [items],
  );

  const groups = useMemo(() => {
    const order =
      groupBy === "status"
        ? [...HAI_STATUSES]
        : groupBy === "department"
          ? departments
          : groupBy === "pilot_phase"
            ? [...HAI_PILOT_PHASES]
            : Array.from(new Set(items.map((item) => groupValue(item, groupBy))));
    return order.map((key) => ({
      key,
      label:
        groupBy === "status"
          ? HAI_STATUS_LABEL[key as HaiStatus] || key
          : groupBy === "department"
            ? departmentLabel(key, extras)
            : groupBy === "pilot_phase"
              ? HAI_PILOT_PHASE_LABEL[key as HaiPilotPhase] || key
              : groupBy === "owner"
                ? staff.find((item) => item.id === key)?.name || "ยังไม่มอบหมาย"
                : key === "none"
                  ? "ไม่ระบุ"
                  : key,
      items: items.filter((item) => groupValue(item, groupBy) === key),
    }));
  }, [departments, extras, groupBy, items, staff]);

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
    const scalars: Array<keyof HaiRecordDraft> = [
      "id",
      "name",
      "hotelName",
      "department",
      "ownerId",
      "problem",
      "currentProcess",
      "frequency",
      "systems",
      "dataClass",
      "sourceOfTruth",
      "manualSteps",
      "exceptions",
      "userImpact",
      "objective",
      "status",
      "priority",
      "approach",
      "reviewer",
      "fallback",
      "risk",
      "nextAction",
      "nextActionAt",
      "vaultRef",
      "notes",
    ];
    scalars.forEach((key) => data.set(key, String(draft[key] ?? "")));
    data.set("charterJson", JSON.stringify(draft.charter));
    data.set("useCasesJson", JSON.stringify(draft.useCases));
    data.set("accessJson", JSON.stringify(draft.dataAccess));
    data.set("testsJson", JSON.stringify(draft.tests));
    data.set("issuesJson", JSON.stringify(draft.issues));
    data.set("metricsJson", JSON.stringify(draft.metrics));
    data.set("handoverJson", JSON.stringify(draft.handover));
    data.set("approvalsJson", JSON.stringify(draft.approvals));
    run(() => saveHotelAiWork(data), draft.id ? "บันทึกแล้ว" : "สร้างเวิร์กโฟลว์แล้ว");
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

  function openRow(row: HaiWorkflowRow) {
    setDraft(draftFromHaiRow(row));
    setSubtaskDraft(emptyHaiSubtaskDraft(row.ownerId || access.userId, row.department));
    setSubtaskComment("");
    setDrawer(true);
    setOk("");
    setError("");
  }

  function patchSubtask(item: HaiSubtaskView, patch: Partial<HaiSubtaskDraft>) {
    const data = new FormData();
    data.set("id", item.id);
    data.set("workflowId", item.workflowId);
    data.set("name", patch.name ?? item.name);
    data.set("department", patch.department ?? item.department);
    data.set("ownerId", patch.ownerId ?? item.ownerId);
    data.set("status", patch.status ?? item.status);
    data.set("dueAt", patch.dueAt ?? toDateInput(item.dueAt));
    data.set("priority", patch.priority ?? item.priority);
    data.set("comments", patch.comments ?? item.comments);
    data.set("evidence", patch.evidence ?? item.evidence);
    data.set("reviewerId", patch.reviewerId ?? item.reviewerId);
    data.set("gateKind", patch.gateKind ?? item.gateKind);
    data.set("completed", patch.status === "completed" || (!patch.status && item.completed) ? "1" : "0");
    run(() => saveHotelAiSubtask(data), "บันทึกงานย่อยแล้ว");
  }

  function addDuty(workflowId: string, department: string, name: string, ownerId = "") {
    const data = new FormData();
    data.set("workflowId", workflowId);
    data.set("name", name);
    data.set("department", department);
    data.set("ownerId", ownerId || access.userId);
    data.set("status", "not_started");
    data.set("priority", "normal");
    data.set("gateKind", haiGateKind(name, department));
    run(() => saveHotelAiSubtask(data), "เพิ่มงานย่อยแล้ว");
  }

  function saveSubtask(workflowId: string) {
    const data = new FormData();
    data.set("id", subtaskDraft.id);
    data.set("workflowId", workflowId);
    data.set("name", subtaskDraft.name);
    data.set("department", subtaskDraft.department);
    data.set("ownerId", subtaskDraft.ownerId);
    data.set("status", subtaskDraft.status);
    data.set("dueAt", subtaskDraft.dueAt);
    data.set("priority", subtaskDraft.priority);
    data.set("comments", subtaskDraft.comments);
    data.set("evidence", subtaskDraft.evidence);
    data.set("reviewerId", subtaskDraft.reviewerId);
    data.set("gateKind", subtaskDraft.gateKind);
    data.set("completed", subtaskDraft.status === "completed" ? "1" : "0");
    run(() => saveHotelAiSubtask(data), subtaskDraft.id ? "บันทึกงานย่อยแล้ว" : "เพิ่มงานย่อยแล้ว");
  }

  function reviewerNote(subtaskId: string, notes: string, reviewerId: string) {
    const data = new FormData();
    data.set("id", subtaskId);
    data.set("body", notes);
    data.set("reviewerId", reviewerId);
    run(() => addHotelAiReviewerNote(data), "บันทึก reviewer แล้ว");
  }

  function submitGate() {
    if (!gateDialog) return;
    if (!gateNote.trim()) {
      setError(webErrorMessage("missing_gate_note"));
      return;
    }
    const data = new FormData();
    data.set("id", gateDialog.id);
    data.set("notes", gateNote);
    if (gateDialog.kind === "escalate") {
      data.set("title", "Escalated issue");
      run(() => escalateHotelAiIssue(data), "escalate แล้ว");
    } else {
      data.set("decision", gateDialog.kind === "reject" ? "reject" : "approve");
      run(() => decideHotelAiPilotGate(data), gateDialog.kind === "reject" ? "ปฏิเสธไพลอตแล้ว" : "อนุมัติไพลอตแล้ว");
    }
    setGateDialog(null);
    setGateNote("");
  }

  const expandBlock = (row: HaiWorkflowRow) => (
    <div className="b2b-expand">
      <p>
        {row.name} · {row.hotelName} · {HAI_APPROACH_LABEL[row.approach]} · อัปเดต {formatDate(row.updatedAt) || "—"}
      </p>
      <p>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {HAI_PILOT_PHASE_LABEL[row.pilotPhase]}
      </p>
      {access.canEditBoard ? (
        <div className="ads-inline-assign">
          <form
            className="b2b-inline"
            onSubmit={(event) => {
              event.preventDefault();
              run(() => assignHotelAiWork(new FormData(event.currentTarget)), "มอบหมายแล้ว");
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
              run(() => changeHotelAiDepartment(new FormData(event.currentTarget)), "เปลี่ยนแผนกแล้ว");
            }}
          >
            <input type="hidden" name="id" value={row.id} />
            <select className="crm-select" name="department" defaultValue={row.department} aria-label={`แผนก ${row.name}`}>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {departmentLabel(item, extras)}
                </option>
              ))}
            </select>
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              แผนก
            </button>
          </form>
        </div>
      ) : null}
      <HotelAiSubtasksPanel
        row={row}
        staff={staff}
        access={access}
        extras={extras}
        pending={pending}
        draft={subtaskDraft}
        comment={subtaskComment}
        onDraftChange={setSubtaskDraft}
        onCommentChange={setSubtaskComment}
        onSave={() => saveSubtask(row.id)}
        onComplete={(item, completed) => {
          const data = new FormData();
          data.set("id", item.id);
          data.set("workflowId", item.workflowId);
          data.set("name", item.name);
          data.set("department", item.department);
          data.set("ownerId", item.ownerId);
          data.set("completed", completed ? "1" : "0");
          run(() => completeHotelAiSubtask(data), completed ? "ปิดงานย่อยแล้ว" : "เปิดงานย่อยแล้ว");
        }}
        onAddComment={(subtaskId) => {
          const data = new FormData();
          data.set("id", subtaskId);
          data.set("body", subtaskComment);
          run(async () => {
            const result = await addHotelAiSubtaskComment(data);
            if (result.ok) setSubtaskComment("");
            return result;
          }, "บันทึกความเห็นแล้ว");
        }}
        onPatchSubtask={patchSubtask}
        onDelete={(item) => {
          const data = new FormData();
          data.set("id", item.id);
          run(() => removeHotelAiSubtask(data), "ลบงานย่อยแล้ว");
        }}
        onAddDuty={(department, name) => addDuty(row.id, department, name, row.ownerId)}
        onReviewerNote={reviewerNote}
        saveState={ok}
        saveError={error}
      />
      {access.canEditBoard ? (
        <div className="ads-inline-assign hai-gate-actions">
          <button type="button" className="kpi-button b2b-save" disabled={pending} onClick={() => { setGateDialog({ kind: "approve", id: row.id }); setGateNote(""); }}>
            Approve pilot
          </button>
          <button type="button" className="crm-users-secondary" disabled={pending} onClick={() => { setGateDialog({ kind: "reject", id: row.id }); setGateNote(""); }}>
            Reject pilot
          </button>
          <button type="button" className="crm-users-secondary" disabled={pending} onClick={() => { setGateDialog({ kind: "escalate", id: row.id }); setGateNote(""); }}>
            Escalate
          </button>
        </div>
      ) : null}
      <p>Approvals</p>
      <ul className="meta-ops-history seo-history">
        {row.approvals.length ? (
          row.approvals.map((item) => (
            <li key={item.id}>
              {item.kind || "Approval"} · {HAI_APPROVAL_LABEL[item.status]} · {item.notes || ""}
            </li>
          ))
        ) : (
          <li>ยังไม่มีการอนุมัติ</li>
        )}
      </ul>
      {access.canEditBoard ? (
        <form
          className="b2b-inline"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => addHotelAiApprovalNote(new FormData(event.currentTarget)), "บันทึกการอนุมัติแล้ว");
            event.currentTarget.reset();
          }}
        >
          <input type="hidden" name="id" value={row.id} />
          <input className="crm-field" name="kind" placeholder="ประเภท เช่น Pilot charter" aria-label={`ประเภทอนุมัติ ${row.name}`} />
          <select className="crm-select" name="status" defaultValue="awaiting" aria-label={`สถานะอนุมัติ ${row.name}`}>
            {HAI_APPROVAL_STATUSES.map((item) => (
              <option key={item} value={item}>
                {HAI_APPROVAL_LABEL[item]}
              </option>
            ))}
          </select>
          <input className="crm-field" name="notes" placeholder="บันทึกการอนุมัติ" aria-label={`บันทึกอนุมัติ ${row.name}`} />
          <button className="kpi-button b2b-save" type="submit" disabled={pending}>
            เพิ่มบันทึกอนุมัติ
          </button>
        </form>
      ) : null}
      <p>Evidence / exceptions</p>
      <ul className="meta-ops-history seo-history">
        {row.issues.length ? (
          row.issues.map((item) => (
            <li key={item.id}>
              {item.title || "Issue"} · {HAI_ISSUE_STATUS_LABEL[item.status]} · {item.evidence || item.exception || ""}
            </li>
          ))
        ) : (
          <li>{row.exceptions || "ยังไม่มี exception"}</li>
        )}
      </ul>
      <p>Activity</p>
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
    </div>
  );

  const card = (row: HaiWorkflowRow) => (
    <article className="b2b-card" key={row.id}>
      <button type="button" className="b2b-name" onClick={() => openRow(row)}>
        {row.name || row.hotelName}
      </button>
      <p>
        {row.hotelName} · {departmentLabel(row.department, extras)}
      </p>
      <div className="b2b-meta">
        <span className={`b2b-status is-${row.status}`}>{HAI_STATUS_LABEL[row.status]}</span>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
        <span className={`b2b-status b2b-priority is-${row.risk}`}>{HAI_RISK_LABEL[row.risk]}</span>
      </div>
      <p>
        {row.ownerName || "—"} · {HAI_APPROACH_LABEL[row.approach]}
      </p>
      <p>
        Next: {row.nextAction || "—"} · {formatDate(row.nextActionAt) || "—"}
      </p>
      {access.canEditBoard ? (
        <form
          className="b2b-inline"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => changeHotelAiStatus(new FormData(event.currentTarget)), "เปลี่ยนสถานะแล้ว");
          }}
        >
          <input type="hidden" name="id" value={row.id} />
          <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.name}`}>
            {HAI_STATUSES.map((item) => (
              <option key={item} value={item}>
                {HAI_STATUS_LABEL[item]}
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
            <button type="button" className="crm-users-secondary" onClick={() => setArchiveId(row.id)}>
              Archive
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

  const tableRows = (rows: HaiWorkflowRow[]) =>
    rows.map((row) => (
      <Fragment key={row.id}>
        <tr>
          <td data-label="Workflow">
            <button type="button" className="b2b-name" onClick={() => openRow(row)}>
              {row.name || row.hotelName}
            </button>
            <small>{row.hotelName}</small>
            <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
          </td>
          <td data-label="โรงแรม">{row.hotelName || "—"}</td>
          <td data-label="ผู้รับผิดชอบ">{row.ownerName || "—"}</td>
          <td data-label="แผนก">{departmentLabel(row.department, extras)}</td>
          <td data-label="สถานะ">
            <span className={`b2b-status is-${row.status}`}>{HAI_STATUS_LABEL[row.status]}</span>
          </td>
          <td data-label="ความเสี่ยง">
            <span className={`b2b-status is-${row.risk}`}>{HAI_RISK_LABEL[row.risk]}</span>
          </td>
          <td data-label="กำหนด">{formatDate(row.nextActionAt) || "—"}</td>
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
                      run(() => changeHotelAiStatus(new FormData(event.currentTarget)), "เปลี่ยนสถานะแล้ว");
                    }}
                  >
                    <input type="hidden" name="id" value={row.id} />
                    <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.name}`}>
                      {HAI_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {HAI_STATUS_LABEL[item]}
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
    <div className="b2b-page seo-ops web-ops hai-ops">
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
      <div className="seo-ops-status-row" aria-label="สรุปบอร์ด Hotel AI Workflow">
        <div className="seo-ops-stat">
          <span>{HAI_SECTION_LABEL[section]}</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>Pilot / Ready</span>
          <strong>{counts.live}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>Needs review</span>
          <strong>{counts.due}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>Blocked</span>
          <strong>{counts.blocked}</strong>
        </div>
      </div>
      <div className="b2b-toolbar">
        <div className="b2b-tabs" role="tablist" aria-label="มุมมองบอร์ด Hotel AI Workflow">
          <Link className={`b2b-tab${view === "table" ? " is-active" : ""}`} href={hrefFor({ view: "table" })}>
            Table
          </Link>
          <Link className={`b2b-tab${view === "board" ? " is-active" : ""}`} href={hrefFor({ view: "board" })}>
            Board
          </Link>
        </div>
        <form className="b2b-filters" method="get">
          <input type="hidden" name="view" value={view} />
          <input className="crm-field" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหาเวิร์กโฟลว์ โรงแรม หรือเจ้าของ" aria-label="ค้นหา" />
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
            {HAI_STATUSES.map((item) => (
              <option key={item} value={item}>
                {HAI_STATUS_LABEL[item]}
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
          <select className="crm-select" name="risk" defaultValue={filters.risk ?? ""} aria-label="ความเสี่ยง">
            <option value="">ทุกระดับความเสี่ยง</option>
            {HAI_RISKS.map((item) => (
              <option key={item} value={item}>
                {HAI_RISK_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="approach" defaultValue={filters.approach ?? ""} aria-label="แนวทาง">
            <option value="">ทุกแนวทาง</option>
            {HAI_APPROACHES.map((item) => (
              <option key={item} value={item}>
                {HAI_APPROACH_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="group" defaultValue={groupBy} aria-label="จัดกลุ่ม">
            {HAI_GROUP_BY.map((item) => (
              <option key={item} value={item}>
                Group: {HAI_GROUP_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="sort" defaultValue={sort} aria-label="เรียงลำดับ">
            {HAI_SORTS.map((item) => (
              <option key={item} value={item}>
                Sort: {HAI_SORT_LABEL[item]}
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
                setDraft(emptyHaiDraft(access.userId, filters.department || "operations"));
                setSubtaskDraft(emptyHaiSubtaskDraft(access.userId));
                setSubtaskComment("");
                setDrawer(true);
                setOk("");
                setError("");
              }}
            >
              เพิ่มเวิร์กโฟลว์
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
              <div className="b2b-group-body">{group.items.length ? group.items.map(card) : <p className="b2b-muted">ยังไม่มีรายการ</p>}</div>
            </section>
          ))}
        </div>
      ) : (
        <div className="crm-pipe-table-wrap b2b-table-wrap">
          {items.length === 0 ? (
            <p className="crm-pipe-table-empty">ยังไม่มีเวิร์กโฟลว์ — สร้างด้วยปุ่มเพิ่มเวิร์กโฟลว์ ไม่มีการนำเข้าข้อมูล</p>
          ) : (
            groups.map((group) =>
              group.items.length ? (
                <section className="b2b-group" key={group.key} style={{ marginBottom: "0.9rem" }}>
                  <header className="b2b-group-head">
                    <strong>{group.label}</strong>
                    <span>{group.items.length}</span>
                  </header>
                  <table className="crm-pipe-table b2b-table seo-ops-table" aria-label={`ตาราง ${HAI_SECTION_LABEL[section]}`}>
                    <thead>
                      <tr>
                        <th scope="col">Workflow</th>
                        <th scope="col">โรงแรม</th>
                        <th scope="col">ผู้รับผิดชอบ</th>
                        <th scope="col">แผนก</th>
                        <th scope="col">สถานะ</th>
                        <th scope="col">ความเสี่ยง</th>
                        <th scope="col">กำหนด</th>
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
        <HotelAiRecordForm
          key={`${draft.id || "new"}-${section}`}
          draft={draft}
          row={current}
          staff={staff}
          access={access}
          settings={settings}
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
          onSaveSubtask={() => saveSubtask(draft.id)}
          onCompleteSubtask={(item, completed) => {
            const data = new FormData();
            data.set("id", item.id);
            data.set("workflowId", item.workflowId);
            data.set("name", item.name);
            data.set("department", item.department);
            data.set("ownerId", item.ownerId);
            data.set("completed", completed ? "1" : "0");
            run(() => completeHotelAiSubtask(data), completed ? "ปิดงานย่อยแล้ว" : "เปิดงานย่อยแล้ว");
          }}
          onPatchSubtask={patchSubtask}
          onDeleteSubtask={(item) => {
            const data = new FormData();
            data.set("id", item.id);
            run(() => removeHotelAiSubtask(data), "ลบงานย่อยแล้ว");
          }}
          onAddDuty={(department, name) => {
            if (draft.id) addDuty(draft.id, department, name, draft.ownerId);
          }}
          onReviewerNote={reviewerNote}
          onApprovePilot={() => {
            if (draft.id) {
              setGateDialog({ kind: "approve", id: draft.id });
              setGateNote("");
            }
          }}
          onRejectPilot={() => {
            if (draft.id) {
              setGateDialog({ kind: "reject", id: draft.id });
              setGateNote("");
            }
          }}
          onEscalate={() => {
            if (draft.id) {
              setGateDialog({ kind: "escalate", id: draft.id });
              setGateNote("");
            }
          }}
          onAddSubtaskComment={(subtaskId) => {
            const data = new FormData();
            data.set("id", subtaskId);
            data.set("body", subtaskComment);
            run(async () => {
              const result = await addHotelAiSubtaskComment(data);
              if (result.ok) setSubtaskComment("");
              return result;
            }, "บันทึกความเห็นแล้ว");
          }}
          onArchive={() => setArchiveId(draft.id)}
        />
      ) : null}

      {archiveId ? (
        <B2bDialog
          title="Archive เวิร์กโฟลว์"
          body="ยืนยันเก็บรายการนี้เข้าคลังภายใน? รายการจะไม่แสดงบนบอร์ดหลัก และไม่แสดงบนหน้าสาธารณะ"
          confirmLabel="Archive"
          pending={pending}
          onCancel={() => setArchiveId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", archiveId);
            run(() => archiveHotelAiWork(data), "เก็บเข้าคลังแล้ว");
            setArchiveId("");
            setDrawer(false);
          }}
        />
      ) : null}

      {gateDialog ? (
        <B2bDialog
          title={gateDialog.kind === "escalate" ? "Escalate issue" : gateDialog.kind === "reject" ? "Reject pilot gate" : "Approve pilot gate"}
          body={gateDialog.kind === "escalate" ? "บันทึกปัญหาเพื่อส่งต่อ Management — เวิร์กโฟลว์จะเป็น Blocked" : "กรอกบันทึกก่อนอนุมัติหรือปฏิเสธไพลอต"}
          confirmLabel={gateDialog.kind === "escalate" ? "Escalate" : gateDialog.kind === "reject" ? "Reject" : "Approve"}
          pending={pending}
          onCancel={() => {
            setGateDialog(null);
            setGateNote("");
          }}
          onConfirm={submitGate}
        >
          <label className="crm-cms-field">
            <span>บันทึก</span>
            <textarea
              className="crm-field"
              rows={3}
              value={gateNote}
              onChange={(event) => setGateNote(event.target.value)}
              aria-label="บันทึก approve reject หรือ escalate"
            />
          </label>
        </B2bDialog>
      ) : null}

      {deleteId ? (
        <B2bDialog
          title="ลบเวิร์กโฟลว์"
          body="ยืนยันลบรายการนี้จากบอร์ดภายใน ไม่กระทบหน้าสาธารณะ"
          confirmLabel="ลบ"
          pending={pending}
          onCancel={() => setDeleteId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", deleteId);
            run(() => removeHotelAiWork(data), "ลบแล้ว");
            setDeleteId("");
            if (draft.id === deleteId) setDrawer(false);
          }}
        />
      ) : null}
    </div>
  );
}
