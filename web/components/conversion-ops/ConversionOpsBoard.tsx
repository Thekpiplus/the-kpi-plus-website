"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState, useTransition } from "react";
import {
  addWebsiteApprovalNote,
  addConversionSubtaskComment,
  assignWebsiteWork,
  attachConversionSubtaskFile,
  changeWebsiteDepartment,
  changeWebsiteStatus,
  closeWebsiteWork,
  completeConversionSubtask,
  escalateWebsiteWork,
  removeConversionSubtask,
  removeWebsiteWork,
  saveConversionSubtask,
  saveWebsiteWork,
} from "@/lib/conversion-ops/actions";
import {
  MAX_CONV_SUBTASKS,
  CONV_APPROVAL_LABEL,
  CONV_APPROVAL_STATUSES,
  CONV_DEPARTMENT_LABEL,
  CONV_DEPARTMENTS,
  CONV_FUNNEL_LABEL,
  CONV_FUNNEL_STAGES,
  CONV_GROUP_BY,
  CONV_GROUP_LABEL,
  CONV_KPI_DATA_STATUS_LABEL,
  CONV_PRIORITY_LABEL,
  CONV_PROJECT_TYPE_LABEL,
  CONV_PROJECT_TYPES,
  CONV_READINESS_LABEL,
  CONV_SECTION_LABEL,
  CONV_SECTION_WORKSTREAM,
  CONV_SEVERITIES,
  CONV_SEVERITY_LABEL,
  CONV_SORT_LABEL,
  CONV_SORTS,
  CONV_STATUS_LABEL,
  CONV_STATUSES,
  CONV_SUBTASK_STATUS_LABEL,
  CONV_WORKSTREAM_LABEL,
  worstFrictionSeverity,
  webErrorMessage,
  webSectionPath,
  type ConvAccessView,
  type ConvDepartment,
  type ConvGroupBy,
  type ConvListFilters,
  type ConvProjectRow,
  type ConvProjectType,
  type ConvSection,
  type ConvStatus,
  type ConvSubtaskView,
} from "@/lib/conversion-ops/types";
import { B2bDialog, toDateInput } from "@/components/b2b-ops/ui";
import { ConversionRecordForm, draftFromRow, emptyConvDraft, type ConvRecordDraft } from "./ConversionRecordForm";
import { emptyConvSubtaskDraft, type ConvSubtaskDraft } from "./ConversionSubtasksPanel";
import "@/components/b2b-ops/b2b-ops.css";
import "./conversion-ops.css";

type Staff = { id: string; name: string };

function extraColumnLabel(section: ConvSection) {
  if (section === "booking") return "Booking Engine";
  if (section === "room") return "Room / Offer";
  if (section === "mobile") return "Mobile UX";
  if (section === "tracking") return "Analytics";
  if (section === "friction") return "Friction";
  if (section === "experiments") return "Experiment";
  if (section === "reports") return "KPI";
  if (section === "approvals") return "Approval";
  if (section === "review") return "Website Review";
  if (section === "handover") return "Handover";
  return "Type";
}

function extraColumnValue(section: ConvSection, row: ConvProjectRow) {
  if (section === "booking") return row.engine.provider || row.bookingEngine || row.bookingEngineUrl || "—";
  if (section === "room") return row.cms.summary || row.cmsType || "—";
  if (section === "mobile") return CONV_READINESS_LABEL[row.mobileStatus];
  if (section === "tracking") return CONV_READINESS_LABEL[row.analyticsStatus || row.trackingStatus];
  if (section === "friction") {
    const worst = worstFrictionSeverity(row.friction);
    return worst ? `${row.friction[0]?.title || "Friction"} · ${CONV_SEVERITY_LABEL[worst]}` : "—";
  }
  if (section === "experiments") return row.qa[0]?.label || row.decisions[0]?.title || "—";
  if (section === "reports") return row.primaryKpi || row.kpis[0]?.name || "—";
  if (section === "approvals") return CONV_APPROVAL_LABEL[row.approvals[0]?.status || "not_requested"];
  if (section === "review") return row.discovery.summary || row.primaryGoal || "—";
  if (section === "handover") return CONV_READINESS_LABEL[row.handoverStatus];
  return CONV_PROJECT_TYPE_LABEL[row.projectType];
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

function groupValue(row: ConvProjectRow, groupBy: ConvGroupBy) {
  if (groupBy === "owner") return row.ownerId || "none";
  if (groupBy === "hotel") return row.hotelName || "none";
  if (groupBy === "projectType") return row.projectType;
  if (groupBy === "market") return row.targetMarket || "none";
  if (groupBy === "funnelStage") return row.friction[0]?.funnelStage || "none";
  if (groupBy === "severity") return worstFrictionSeverity(row.friction) || "none";
  if (groupBy === "department") return row.department;
  return row.status;
}

export function ConversionOpsBoard({
  section,
  items,
  staff,
  access,
  facets,
  filters,
  groupBy,
  sort,
}: {
  section: ConvSection;
  items: ConvProjectRow[];
  staff: Staff[];
  access: ConvAccessView;
  facets: { hotels: string[]; markets: string[]; languages: string[] };
  filters: ConvListFilters;
  groupBy: ConvGroupBy;
  sort: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState<ConvRecordDraft>(emptyConvDraft(access.userId, CONV_SECTION_WORKSTREAM[section] || "project"));
  const [expanded, setExpanded] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [closeId, setCloseId] = useState("");
  const [escalateId, setEscalateId] = useState("");
  const [subtaskDraft, setSubtaskDraft] = useState<ConvSubtaskDraft>(emptyConvSubtaskDraft(access.userId));
  const [subtaskComment, setSubtaskComment] = useState("");
  const view = filters.view === "board" ? "board" : "table";
  const current = items.find((item) => item.id === draft.id);

  const counts = useMemo(
    () => ({
      total: items.length,
      live: items.filter((item) => item.status === "measuring" || item.status === "completed").length,
      due: items.filter((item) => ["changes_in_progress", "awaiting_approval", "ready_to_test", "priority_planned", "blocked"].includes(item.status)).length,
    }),
    [items],
  );

  const groups = useMemo(() => {
    const order =
      groupBy === "status"
        ? [...CONV_STATUSES]
        : groupBy === "department"
          ? [...CONV_DEPARTMENTS]
          : groupBy === "projectType"
            ? [...CONV_PROJECT_TYPES]
            : groupBy === "funnelStage"
              ? [...CONV_FUNNEL_STAGES, "none"]
              : groupBy === "severity"
                ? [...CONV_SEVERITIES, "none"]
            : Array.from(new Set(items.map((item) => groupValue(item, groupBy))));
    return order.map((key) => ({
      key,
      label:
        groupBy === "status"
          ? CONV_STATUS_LABEL[key as ConvStatus] || key
          : groupBy === "department"
            ? CONV_DEPARTMENT_LABEL[key as ConvDepartment] || key
            : groupBy === "projectType"
              ? CONV_PROJECT_TYPE_LABEL[key as ConvProjectType] || key
              : groupBy === "owner"
                ? staff.find((item) => item.id === key)?.name || "ยังไม่มอบหมาย"
                : groupBy === "funnelStage"
                  ? CONV_FUNNEL_LABEL[key as keyof typeof CONV_FUNNEL_LABEL] || (key === "none" ? "ไม่ระบุ" : key)
                  : groupBy === "severity"
                    ? CONV_SEVERITY_LABEL[key as keyof typeof CONV_SEVERITY_LABEL] || (key === "none" ? "ไม่ระบุ" : key)
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
    const scalars: Array<keyof ConvRecordDraft> = [
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
      "analyticsStatus",
      "engineTrackingStatus",
      "primaryKpi",
      "kpiTarget",
      "hotelApprover",
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
    data.set("frictionJson", JSON.stringify(draft.friction));
    data.set("engineJson", JSON.stringify(draft.engine));
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

  function openRow(row: ConvProjectRow) {
    setDraft(draftFromRow(row));
    setSubtaskDraft(emptyConvSubtaskDraft(row.ownerId || access.userId, row.department));
    setSubtaskComment("");
    setDrawer(true);
    setOk("");
    setError("");
  }

  function patchSubtask(item: ConvSubtaskView, patch: Partial<ConvSubtaskDraft>) {
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
    run(() => saveConversionSubtask(data), "บันทึกงานย่อยแล้ว");
  }

  const expandBlock = (row: ConvProjectRow) => (
    <div className="b2b-expand">
      <p>
        {row.projectName} · {row.hotelName} · {CONV_PROJECT_TYPE_LABEL[row.projectType]} · อัปเดต {formatDate(row.updatedAt) || "—"}
      </p>
      <p>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span> · {CONV_READINESS_LABEL[row.progress.readiness]}
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
              {CONV_DEPARTMENTS.map((item) => (
                <option key={item} value={item}>
                  {CONV_DEPARTMENT_LABEL[item]}
                </option>
              ))}
            </select>
            <button className="kpi-button b2b-save" type="submit" disabled={pending}>
              แผนก
            </button>
          </form>
        </div>
      ) : null}
      <p>งานย่อย · {row.progress.countLabel} · {row.progress.percent}%</p>
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
                    run(() => completeConversionSubtask(data), item.completed ? "เปิดงานย่อยแล้ว" : "ปิดงานย่อยแล้ว");
                  }}
                />
                <span>
                  {item.name} · {CONV_DEPARTMENT_LABEL[item.department]} · {CONV_SUBTASK_STATUS_LABEL[item.status]}
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
      {access.canEditBoard && row.subtasks.length < MAX_CONV_SUBTASKS ? (
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
                const result = await addConversionSubtaskComment(data);
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
              run(() => attachConversionSubtaskFile(data), "แนบไฟล์แล้ว");
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
      <p>Friction</p>
      <ul className="meta-ops-history seo-history">
        {row.friction.length ? row.friction.map((item) => (
          <li key={item.id}>
            {item.title || "Friction"} · {CONV_FUNNEL_LABEL[item.funnelStage]} · {CONV_SEVERITY_LABEL[item.severity]} · {item.evidence || "—"} · {item.recommendedAction || "—"}
          </li>
        )) : <li>ยังไม่มี friction</li>}
      </ul>
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
            {item.kind || "Approval"} · {CONV_APPROVAL_LABEL[item.status]} · {item.notes || ""}
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
            {CONV_APPROVAL_STATUSES.map((item) => (
              <option key={item} value={item}>
                {CONV_APPROVAL_LABEL[item]}
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
              {item.name}: {item.value || "—"} ({CONV_KPI_DATA_STATUS_LABEL[item.dataStatus]})
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  const card = (row: ConvProjectRow) => (
    <article className="b2b-card" key={row.id}>
      <button type="button" className="b2b-name" onClick={() => openRow(row)}>
        {row.projectName || row.hotelName}
      </button>
      <p>
        {row.hotelName} · {CONV_WORKSTREAM_LABEL[row.workstream]}
      </p>
      <div className="b2b-meta">
        <span className={`b2b-status is-${row.status}`}>{CONV_STATUS_LABEL[row.status]}</span>
        <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
        <span className={`b2b-status b2b-priority is-${row.priority}`}>{CONV_PRIORITY_LABEL[row.priority]}</span>
      </div>
      <p>
        {row.ownerName || "—"} · {CONV_DEPARTMENT_LABEL[row.department]}
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
            {CONV_STATUSES.map((item) => (
              <option key={item} value={item}>
                {CONV_STATUS_LABEL[item]}
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

  const tableRows = (rows: ConvProjectRow[]) =>
    rows.map((row) => (
      <Fragment key={row.id}>
        <tr>
          <td data-label="โปรเจกต์">
            <button type="button" className="b2b-name" onClick={() => openRow(row)}>
              {row.projectName || row.hotelName}
            </button>
            <small>{row.hotelName}</small>
            <span className={`ads-progress-badge is-${row.progress.readiness}`}>{row.progress.countLabel}</span>
            <span className={`b2b-status is-${row.progress.readiness}`}>{CONV_READINESS_LABEL[row.progress.readiness]}</span>
          </td>
          <td data-label="โรงแรม">{row.hotelName || "—"}</td>
          <td data-label="ผู้รับผิดชอบ">{row.ownerName || "—"}</td>
          <td data-label="แผนก">{CONV_DEPARTMENT_LABEL[row.department]}</td>
          <td data-label="สถานะ">
            <span className={`b2b-status is-${row.status}`}>{CONV_STATUS_LABEL[row.status]}</span>
          </td>
          <td data-label="ตลาด">{row.targetMarket || "—"}</td>
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
                      {CONV_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {CONV_STATUS_LABEL[item]}
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
      <div className="seo-ops-status-row" aria-label="สรุปบอร์ด Direct Booking">
        <div className="seo-ops-stat">
          <span>{CONV_SECTION_LABEL[section]}</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>Measuring / Completed</span>
          <strong>{counts.live}</strong>
        </div>
        <div className="seo-ops-stat">
          <span>ต้องติดตาม</span>
          <strong>{counts.due}</strong>
        </div>
      </div>
      <div className="b2b-toolbar">
        <div className="b2b-tabs" role="tablist" aria-label="มุมมองบอร์ด Direct Booking">
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
            {CONV_STATUSES.map((item) => (
              <option key={item} value={item}>
                {CONV_STATUS_LABEL[item]}
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
            {CONV_DEPARTMENTS.map((item) => (
              <option key={item} value={item}>
                {CONV_DEPARTMENT_LABEL[item]}
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
            {CONV_PROJECT_TYPES.map((item) => (
              <option key={item} value={item}>
                {CONV_PROJECT_TYPE_LABEL[item]}
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
          <select className="crm-select" name="funnelStage" defaultValue={filters.funnelStage ?? ""} aria-label="ขั้นใน Funnel">
            <option value="">ทุกขั้น Funnel</option>
            {CONV_FUNNEL_STAGES.map((item) => (
              <option key={item} value={item}>
                {CONV_FUNNEL_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="severity" defaultValue={filters.severity ?? ""} aria-label="ความรุนแรง">
            <option value="">ทุกความรุนแรง</option>
            {CONV_SEVERITIES.map((item) => (
              <option key={item} value={item}>
                {CONV_SEVERITY_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="group" defaultValue={groupBy} aria-label="จัดกลุ่ม">
            {CONV_GROUP_BY.map((item) => (
              <option key={item} value={item}>
                Group: {CONV_GROUP_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="sort" defaultValue={sort} aria-label="เรียงลำดับ">
            {CONV_SORTS.map((item) => (
              <option key={item} value={item}>
                Sort: {CONV_SORT_LABEL[item]}
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
                setDraft(emptyConvDraft(access.userId, CONV_SECTION_WORKSTREAM[section] || "project"));
                setSubtaskDraft(emptyConvSubtaskDraft(access.userId));
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
                  <table className="crm-pipe-table b2b-table seo-ops-table" aria-label={`ตาราง ${CONV_SECTION_LABEL[section]}`}>
                    <thead>
                      <tr>
                        <th scope="col">โปรเจกต์</th>
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
        <ConversionRecordForm
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
            run(() => saveConversionSubtask(data), subtaskDraft.id ? "บันทึกงานย่อยแล้ว" : "เพิ่มงานย่อยแล้ว");
          }}
          onCompleteSubtask={(item, completed) => {
            const data = new FormData();
            data.set("id", item.id);
            data.set("propertyId", item.propertyId);
            data.set("name", item.name);
            data.set("department", item.department);
            data.set("ownerId", item.ownerId);
            data.set("completed", completed ? "1" : "0");
            run(() => completeConversionSubtask(data), completed ? "ปิดงานย่อยแล้ว" : "เปิดงานย่อยแล้ว");
          }}
          onPatchSubtask={patchSubtask}
          onDeleteSubtask={(item) => {
            const data = new FormData();
            data.set("id", item.id);
            run(() => removeConversionSubtask(data), "ลบงานย่อยแล้ว");
          }}
          onAddSubtaskComment={(subtaskId) => {
            const data = new FormData();
            data.set("id", subtaskId);
            data.set("body", subtaskComment);
            run(async () => {
              const result = await addConversionSubtaskComment(data);
              if (result.ok) setSubtaskComment("");
              return result;
            }, "บันทึกความเห็นแล้ว");
          }}
          onAttachSubtaskFile={(subtaskId, form) => {
            const data = new FormData(form);
            data.set("id", subtaskId);
            run(() => attachConversionSubtaskFile(data), "แนบไฟล์แล้ว");
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
          title="Close โปรเจกต์ Direct Booking"
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
          title="ลบโปรเจกต์ Direct Booking"
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
