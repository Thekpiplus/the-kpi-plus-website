"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";
import {
  addWebsiteApprovalNote,
  addSystemsSubtaskComment,
  assignWebsiteWork,
  attachSystemsSubtaskFile,
  changeWebsiteDepartment,
  changeWebsiteStatus,
  closeWebsiteWork,
  completeSystemsSubtask,
  escalateWebsiteWork,
  removeSystemsSubtask,
  removeWebsiteWork,
  saveSystemsSubtask,
  saveWebsiteWork,
} from "@/lib/systems-ops/actions";
import {
  SYS_APPROVAL_LABEL,
  SYS_APPROVAL_STATUSES,
  SYS_DEPARTMENT_LABEL,
  SYS_DEPARTMENTS,
  SYS_GROUP_BY,
  SYS_GROUP_LABEL,
  SYS_INTEGRATION_STATUS_LABEL,
  SYS_ISSUE_STATUS_LABEL,
  SYS_KPI_DATA_STATUS_LABEL,
  SYS_MAPPING_STATUS_LABEL,
  SYS_PROJECT_TYPE_LABEL,
  SYS_PROJECT_TYPES,
  SYS_READINESS_LABEL,
  SYS_RISK_LABEL,
  SYS_RISKS,
  SYS_SECTION_LABEL,
  SYS_SECTION_WORKSTREAM,
  SYS_SEVERITY_LABEL,
  SYS_SEVERITIES,
  SYS_SORT_LABEL,
  SYS_SORTS,
  SYS_STATUS_LABEL,
  SYS_STATUSES,
  SYS_TEST_STATUS_LABEL,
  SYS_WORKSTREAM_LABEL,
  SYS_WORKSTREAMS,
  webErrorMessage,
  webSectionPath,
  type SysAccessView,
  type SysDepartment,
  type SysGroupBy,
  type SysListFilters,
  type SysProjectRow,
  type SysSection,
  type SysSeverity,
  type SysStatus,
  type SysSubtaskView,
} from "@/lib/systems-ops/types";
import { B2bDialog, toDateInput } from "@/components/b2b-ops/ui";
import { SystemsRecordForm, draftFromRow, emptySysDraft, type SysRecordDraft } from "./SystemsRecordForm";
import { SystemsSubtasksPanel, emptySysSubtaskDraft, type SysSubtaskDraft } from "./SystemsSubtasksPanel";
import "@/components/b2b-ops/b2b-ops.css";
import "./systems-ops.css";

type Staff = { id: string; name: string };

function extraColumnLabel(section: SysSection) {
  if (section === "inventory") return "System";
  if (section === "architecture") return "Data flow";
  if (section === "mapping") return "Mapping";
  if (section === "readiness") return "Readiness";
  if (section === "configuration") return "Configuration";
  if (section === "testing") return "Test case";
  if (section === "issues") return "Issue";
  if (section === "distribution") return "Distribution";
  if (section === "analytics" || section === "kpi") return "KPI";
  if (section === "approvals") return "Approval";
  if (section === "handover") return "Handover";
  if (section === "properties") return "Systems";
  return "Objective";
}

function extraColumnValue(section: SysSection, row: SysProjectRow) {
  if (section === "inventory") {
    const item = row.inventory[0];
    return item ? `${item.system || "—"} · ${SYS_INTEGRATION_STATUS_LABEL[item.integrationStatus]}` : row.pms || row.bookingEngine || "—";
  }
  if (section === "architecture") {
    const item = row.architecture[0];
    return item ? `${item.source || "—"} → ${item.destination || "—"}` : "—";
  }
  if (section === "mapping") {
    const item = row.mapping[0];
    return item ? `${item.sourceField || "—"} → ${item.destinationField || "—"} · ${SYS_MAPPING_STATUS_LABEL[item.mappingStatus]}` : "—";
  }
  if (section === "readiness") {
    const item = row.readinessItems[0];
    return (
      <span>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
        {item ? ` · ${item.question || "—"} · ${SYS_READINESS_LABEL[item.status]}` : ` · ${SYS_READINESS_LABEL[row.progress.readiness]}`}
      </span>
    );
  }
  if (section === "configuration") return row.configuration.summary || "—";
  if (section === "testing") {
    const item = row.tests[0];
    return item ? `${item.testCase || "—"} · ${SYS_TEST_STATUS_LABEL[item.status]}` : "—";
  }
  if (section === "issues") {
    const item = row.issues[0];
    return (
      <span>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
        {item ? ` · ${item.issue || "—"} · ${SYS_ISSUE_STATUS_LABEL[item.status]}` : ""}
      </span>
    );
  }
  if (section === "distribution") return row.distributionOps.summary || row.bookingEngine || "—";
  if (section === "analytics" || section === "kpi") return row.primaryKpi || row.kpis[0]?.name || "—";
  if (section === "approvals") return SYS_APPROVAL_LABEL[row.approvals[0]?.status || "not_requested"];
  if (section === "handover") return row.handoverAssets[0]?.asset || SYS_READINESS_LABEL[row.handoverStatus];
  if (section === "properties") return [row.pms, row.channelManager, row.bookingEngine].filter(Boolean).join(" · ") || "—";
  return row.primaryGoal || SYS_PROJECT_TYPE_LABEL[row.propertyType];
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

function groupValue(row: SysProjectRow, groupBy: SysGroupBy) {
  if (groupBy === "owner") return row.ownerId || "none";
  if (groupBy === "hotel") return row.hotelName || "none";
  if (groupBy === "department") return row.department;
  if (groupBy === "system") return row.primarySystem || "none";
  if (groupBy === "severity") return row.primarySeverity;
  if (groupBy === "projectType") return row.propertyType;
  return row.status;
}

export function SystemsOpsBoard({
  section,
  items,
  staff,
  access,
  facets,
  filters,
  groupBy,
  sort,
}: {
  section: SysSection;
  items: SysProjectRow[];
  staff: Staff[];
  access: SysAccessView;
  facets: { hotels: string[]; markets: string[]; systems: string[] };
  filters: SysListFilters;
  groupBy: SysGroupBy;
  sort: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState<SysRecordDraft>(emptySysDraft(access.userId, SYS_SECTION_WORKSTREAM[section] || "properties"));
  const [expanded, setExpanded] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [closeId, setCloseId] = useState("");
  const [escalateId, setEscalateId] = useState("");
  const [subtaskDraft, setSubtaskDraft] = useState<SysSubtaskDraft>(emptySysSubtaskDraft(access.userId));
  const [subtaskComment, setSubtaskComment] = useState("");
  const view = filters.view === "board" ? "board" : "table";
  const current = items.find((item) => item.id === draft.id);

  const counts = useMemo(
    () => ({
      total: items.length,
      live: items.filter((item) => item.status === "monitoring" || item.status === "completed" || item.status === "handed_over" || item.status === "ready_for_go_live").length,
      due: items.filter((item) => ["blocked", "retest_required", "awaiting_provider_access", "awaiting_hotel_approval", "testing", "mapping"].includes(item.status)).length,
    }),
    [items],
  );

  const groups = useMemo(() => {
    const order =
      groupBy === "status"
        ? [...SYS_STATUSES]
        : groupBy === "department"
          ? [...SYS_DEPARTMENTS]
          : groupBy === "severity"
            ? [...SYS_SEVERITIES]
            : groupBy === "projectType"
              ? [...SYS_PROJECT_TYPES]
            : Array.from(new Set(items.map((item) => groupValue(item, groupBy))));
    return order.map((key) => ({
      key,
      label:
        groupBy === "status"
          ? SYS_STATUS_LABEL[key as SysStatus] || key
          : groupBy === "department"
            ? SYS_DEPARTMENT_LABEL[key as SysDepartment] || key
            : groupBy === "severity"
              ? SYS_SEVERITY_LABEL[key as SysSeverity] || key
              : groupBy === "projectType"
                ? SYS_PROJECT_TYPE_LABEL[key as SysProjectRow["propertyType"]] || key
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
    const scalars: Array<keyof SysRecordDraft> = [
      "id",
      "projectName",
      "hotelName",
      "propertyType",
      "roomCount",
      "websiteUrl",
      "pms",
      "channelManager",
      "bookingEngine",
      "otherSystems",
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
      "risk",
      "scope",
      "hotelApprover",
      "providerContact",
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
    data.set("inventoryJson", JSON.stringify(draft.inventory));
    data.set("architectureJson", JSON.stringify(draft.architecture));
    data.set("mappingJson", JSON.stringify(draft.mapping));
    data.set("readinessJson", JSON.stringify(draft.readinessItems));
    data.set("configurationJson", JSON.stringify(draft.configuration));
    data.set("testingJson", JSON.stringify(draft.tests));
    data.set("issuesJson", JSON.stringify(draft.issues));
    data.set("distributionOpsJson", JSON.stringify(draft.distributionOps));
    data.set("analyticsJson", JSON.stringify(draft.analyticsNotes));
    data.set("handoverAssetsJson", JSON.stringify(draft.handoverAssets));
    data.set("kpisJson", JSON.stringify(draft.kpis));
    data.set("sourcesJson", JSON.stringify([]));
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

  function openRow(row: SysProjectRow) {
    setDraft(draftFromRow(row));
    setSubtaskDraft(emptySysSubtaskDraft(row.ownerId || access.userId, row.department));
    setSubtaskComment("");
    setDrawer(true);
    setOk("");
    setError("");
  }

  function patchSubtask(item: SysSubtaskView, patch: Partial<SysSubtaskDraft>) {
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
    data.set("providerDependency", patch.providerDependency ?? item.providerDependency);
    data.set("completed", (patch.status === "completed" || (patch.status ? false : item.completed)) ? "1" : "0");
    run(() => saveSystemsSubtask(data), "บันทึกงานย่อยแล้ว");
  }

  function addDuty(propertyId: string, department: SysDepartment, name: string, ownerId = "") {
    const data = new FormData();
    data.set("propertyId", propertyId);
    data.set("name", name);
    data.set("department", department);
    data.set("ownerId", ownerId || access.userId);
    data.set("status", "not_started");
    data.set("priority", "normal");
    run(() => saveSystemsSubtask(data), "เพิ่มงานย่อยแล้ว");
  }

  function saveSubtask(propertyId: string) {
    const data = new FormData();
    data.set("id", subtaskDraft.id);
    data.set("propertyId", propertyId);
    data.set("name", subtaskDraft.name);
    data.set("department", subtaskDraft.department);
    data.set("ownerId", subtaskDraft.ownerId);
    data.set("status", subtaskDraft.status);
    data.set("dueAt", subtaskDraft.dueAt);
    data.set("priority", subtaskDraft.priority);
    data.set("comments", subtaskDraft.comments);
    data.set("source", subtaskDraft.source);
    data.set("providerDependency", subtaskDraft.providerDependency);
    data.set("completed", subtaskDraft.status === "completed" ? "1" : "0");
    run(() => saveSystemsSubtask(data), subtaskDraft.id ? "บันทึกงานย่อยแล้ว" : "เพิ่มงานย่อยแล้ว");
  }

  const expandBlock = (row: SysProjectRow) => (
    <div className="b2b-expand">
      <p>
        {row.projectName} · {row.hotelName} · {SYS_PROJECT_TYPE_LABEL[row.propertyType]} · อัปเดต {formatDate(row.updatedAt) || "—"}
      </p>
      <p>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {SYS_READINESS_LABEL[row.progress.readiness]}
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
              {SYS_DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {SYS_DEPARTMENT_LABEL[item]}
                </option>
              ))}
            </select>
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              แผนก
            </button>
          </form>
        </div>
      ) : null}
      <SystemsSubtasksPanel
        row={row}
        staff={staff}
        access={access}
        pending={pending}
        draft={subtaskDraft}
        comment={subtaskComment}
        onDraftChange={setSubtaskDraft}
        onCommentChange={setSubtaskComment}
        onSave={() => saveSubtask(row.id)}
        onComplete={(item, completed) => {
          const data = new FormData();
          data.set("id", item.id);
          data.set("propertyId", item.propertyId);
          data.set("name", item.name);
          data.set("department", item.department);
          data.set("ownerId", item.ownerId);
          data.set("completed", completed ? "1" : "0");
          run(() => completeSystemsSubtask(data), completed ? "ปิดงานย่อยแล้ว" : "เปิดงานย่อยแล้ว");
        }}
        onAddComment={(subtaskId) => {
          const data = new FormData();
          data.set("id", subtaskId);
          data.set("body", subtaskComment);
          run(async () => {
            const result = await addSystemsSubtaskComment(data);
            if (result.ok) setSubtaskComment("");
            return result;
          }, "บันทึกความเห็นแล้ว");
        }}
        onAttach={(subtaskId, form) => {
          const data = new FormData(form);
          data.set("id", subtaskId);
          run(() => attachSystemsSubtaskFile(data), "แนบไฟล์แล้ว");
        }}
        onPatchSubtask={patchSubtask}
        onDelete={(item) => {
          const data = new FormData();
          data.set("id", item.id);
          run(() => removeSystemsSubtask(data), "ลบงานย่อยแล้ว");
        }}
        onAddDuty={(department, name) => addDuty(row.id, department, name, row.ownerId)}
      />
      <p>หลักฐาน / Mapping</p>
      <ul className="meta-ops-history seo-history">
        {row.mapping.length ? row.mapping.map((item) => (
          <li key={item.id}>
            {item.sourceField || "—"} → {item.destinationField || "—"} · {SYS_MAPPING_STATUS_LABEL[item.mappingStatus]} · {item.notes || ""}
          </li>
        )) : <li>ยังไม่มี mapping</li>}
      </ul>
      <p>
        Issues · <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
      </p>
      <ul className="meta-ops-history seo-history">
        {row.issues.length ? row.issues.map((item) => (
          <li key={item.id}>
            {item.issue || "Issue"} · {SYS_ISSUE_STATUS_LABEL[item.status]} · {SYS_SEVERITY_LABEL[item.severity]} · {item.owner || "—"} · {item.dueAt ? formatDate(item.dueAt) : "—"}
          </li>
        )) : <li>ยังไม่มี issue</li>}
      </ul>
      <p>การอนุมัติ</p>
      <ul className="meta-ops-history seo-history">
        {row.approvals.length ? row.approvals.map((item) => (
          <li key={item.id}>
            {item.kind || "Approval"} · {SYS_APPROVAL_LABEL[item.status]} · {item.notes || ""}
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
            {SYS_APPROVAL_STATUSES.map((item) => (
              <option key={item} value={item}>
                {SYS_APPROVAL_LABEL[item]}
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
              {item.name}: {item.value || "—"} ({SYS_KPI_DATA_STATUS_LABEL[item.dataStatus]})
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  const card = (row: SysProjectRow) => (
    <article className="b2b-card" key={row.id}>
      <button type="button" className="b2b-name" onClick={() => openRow(row)}>
        {row.projectName || row.hotelName}
      </button>
      <p>
        {row.hotelName} · {SYS_WORKSTREAM_LABEL[row.workstream]}
      </p>
      <div className="b2b-meta">
        <span className={`b2b-status is-${row.status}`}>{SYS_STATUS_LABEL[row.status]}</span>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
        <span className={`b2b-status b2b-priority is-${row.risk}`}>{SYS_RISK_LABEL[row.risk]}</span>
      </div>
      <p>
        {row.ownerName || "—"} · {SYS_DEPARTMENT_LABEL[row.department]}
      </p>
      <p>
        Go-live: {formatDate(row.launchDate) || "—"} · Next: {row.nextAction || "—"}
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
            {SYS_STATUSES.map((item) => (
              <option key={item} value={item}>
                {SYS_STATUS_LABEL[item]}
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

  const tableRows = (rows: SysProjectRow[]) =>
    rows.map((row) => (
      <Fragment key={row.id}>
        <tr>
          <td data-label="โปรเจกต์">
            <button type="button" className="b2b-name" onClick={() => openRow(row)}>
              {row.projectName || row.hotelName}
            </button>
            <small>{row.hotelName}</small>
            <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
            <span className={`b2b-status is-${row.progress.readiness}`}>{SYS_READINESS_LABEL[row.progress.readiness]}</span>
          </td>
          <td data-label="โรงแรม">{row.hotelName || "—"}</td>
          <td data-label="ผู้รับผิดชอบ">{row.ownerName || "—"}</td>
          <td data-label="แผนก">{SYS_DEPARTMENT_LABEL[row.department]}</td>
          <td data-label="สถานะ">
            <span className={`b2b-status is-${row.status}`}>{SYS_STATUS_LABEL[row.status]}</span>
          </td>
          <td data-label="ความเสี่ยง"><span className={`b2b-status is-${row.risk}`}>{SYS_RISK_LABEL[row.risk]}</span></td>
          <td data-label="Go-live">{formatDate(row.launchDate) || "—"}</td>
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
                      {SYS_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {SYS_STATUS_LABEL[item]}
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
      <div className="seo-ops-status-row" aria-label="สรุปบอร์ด Hotel Systems Operations">
        <div className="seo-ops-stat">
          <span>{SYS_SECTION_LABEL[section]}</span>
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
        <div className="b2b-tabs" role="tablist" aria-label="มุมมองบอร์ด Hotel Systems Operations">
          <Link className={`b2b-tab${view === "table" ? " is-active" : ""}`} href={hrefFor({ view: "table" })}>
            Table
          </Link>
          <Link className={`b2b-tab${view === "board" ? " is-active" : ""}`} href={hrefFor({ view: "board" })}>
            Board
          </Link>
        </div>
        <form className="b2b-filters" method="get">
          <input type="hidden" name="view" value={view} />
          <input className="crm-field" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหาโปรเจกต์ โรงแรม หรือระบบ" aria-label="ค้นหา" />
          <select className="crm-select" name="status" defaultValue={filters.status ?? ""} aria-label="สถานะ">
            <option value="">ทุกสถานะ</option>
            {SYS_STATUSES.map((item) => (
              <option key={item} value={item}>
                {SYS_STATUS_LABEL[item]}
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
            {SYS_DEPARTMENTS.map((item) => (
              <option key={item} value={item}>
                {SYS_DEPARTMENT_LABEL[item]}
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
            {SYS_WORKSTREAMS.map((item) => (
              <option key={item} value={item}>
                {SYS_WORKSTREAM_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="projectType" defaultValue={filters.projectType ?? ""} aria-label="ประเภทโปรเจกต์">
            <option value="">ทุกประเภท</option>
            {SYS_PROJECT_TYPES.map((item) => (
              <option key={item} value={item}>
                {SYS_PROJECT_TYPE_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="system" defaultValue={filters.system ?? ""} aria-label="ระบบ">
            <option value="">ทุกระบบ</option>
            {facets.systems.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="crm-select" name="severity" defaultValue={filters.severity ?? ""} aria-label="ความรุนแรง">
            <option value="">ทุกระดับความรุนแรง</option>
            {SYS_SEVERITIES.map((item) => (
              <option key={item} value={item}>
                {SYS_SEVERITY_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="risk" defaultValue={filters.risk ?? ""} aria-label="ความเสี่ยง">
            <option value="">ทุกระดับความเสี่ยง</option>
            {SYS_RISKS.map((item) => (
              <option key={item} value={item}>
                {SYS_RISK_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="group" defaultValue={groupBy} aria-label="จัดกลุ่ม">
            {SYS_GROUP_BY.map((item) => (
              <option key={item} value={item}>
                Group: {SYS_GROUP_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="sort" defaultValue={sort} aria-label="เรียงลำดับ">
            {SYS_SORTS.map((item) => (
              <option key={item} value={item}>
                Sort: {SYS_SORT_LABEL[item]}
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
                setDraft(emptySysDraft(access.userId, SYS_SECTION_WORKSTREAM[section] || "properties"));
                setSubtaskDraft(emptySysSubtaskDraft(access.userId));
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
                  <table className="crm-pipe-table b2b-table seo-ops-table" aria-label={`ตาราง ${SYS_SECTION_LABEL[section]}`}>
                    <thead>
                      <tr>
                        <th scope="col">โปรเจกต์</th>
                        <th scope="col">โรงแรม</th>
                        <th scope="col">ผู้รับผิดชอบ</th>
                        <th scope="col">แผนก</th>
                        <th scope="col">สถานะ</th>
                        <th scope="col">ความเสี่ยง</th>
                        <th scope="col">Go-live</th>
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
        <SystemsRecordForm
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
          onSaveSubtask={() => saveSubtask(draft.id)}
          onCompleteSubtask={(item, completed) => {
            const data = new FormData();
            data.set("id", item.id);
            data.set("propertyId", item.propertyId);
            data.set("name", item.name);
            data.set("department", item.department);
            data.set("ownerId", item.ownerId);
            data.set("completed", completed ? "1" : "0");
            run(() => completeSystemsSubtask(data), completed ? "ปิดงานย่อยแล้ว" : "เปิดงานย่อยแล้ว");
          }}
          onPatchSubtask={patchSubtask}
          onDeleteSubtask={(item) => {
            const data = new FormData();
            data.set("id", item.id);
            run(() => removeSystemsSubtask(data), "ลบงานย่อยแล้ว");
          }}
          onAddDuty={(department, name) => {
            if (draft.id) addDuty(draft.id, department, name, draft.ownerId);
          }}
          onAddSubtaskComment={(subtaskId) => {
            const data = new FormData();
            data.set("id", subtaskId);
            data.set("body", subtaskComment);
            run(async () => {
              const result = await addSystemsSubtaskComment(data);
              if (result.ok) setSubtaskComment("");
              return result;
            }, "บันทึกความเห็นแล้ว");
          }}
          onAttachSubtaskFile={(subtaskId, form) => {
            const data = new FormData(form);
            data.set("id", subtaskId);
            run(() => attachSystemsSubtaskFile(data), "แนบไฟล์แล้ว");
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
          title="Close โปรเจกต์"
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
          title="ลบโปรเจกต์"
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
