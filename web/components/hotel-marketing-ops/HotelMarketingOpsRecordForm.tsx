"use client";

import { useEffect, useMemo, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { B2bDialog, Field, SaveBar, toDateTimeInput } from "@/components/b2b-ops/ui";
import {
  HMO_APPROVAL_LABEL,
  HMO_ASSET_PERMISSION_LABEL,
  HMO_ASSET_PERMISSION_STATUSES,
  HMO_ASSET_TYPE_LABEL,
  HMO_ASSET_TYPES,
  HMO_DEPARTMENTS,
  HMO_DRAFT_STATUS_LABEL,
  HMO_DRAFT_STATUSES,
  HMO_IMAGE_PERMISSION_LABEL,
  HMO_IMAGE_PERMISSION_STATUSES,
  HMO_KIND_DESCRIPTION,
  HMO_KIND_LABEL,
  HMO_KINDS,
  HMO_LOCALE_LABEL,
  HMO_LOCALES,
  HMO_PRIORITIES,
  HMO_PRIORITY_LABEL,
  HMO_RELEASE_STATUSES,
  HMO_SECTION_LABEL,
  HMO_SOURCE_CITATION_LABEL,
  HMO_SOURCE_CITATION_STATUSES,
  HMO_STATUS_LABEL,
  HMO_STATUSES,
  HMO_VERIFIED_LABEL,
  HMO_VERIFIED_STATUSES,
  defaultStatusForHmoKind,
  emptyHmoPayload,
  hmoDepartmentLabel,
  hmoFormatDate,
  type HmoAccessView,
  type HmoExtraDepartment,
  type HmoKind,
  type HmoPayload,
  type HmoPriority,
  type HmoRecordRow,
  type HmoSection,
  type HmoStatus,
} from "@/lib/hotel-marketing-ops/types";

type Staff = { id: string; name: string };

export type HmoRecordDraft = {
  id: string;
  kind: HmoKind;
  title: string;
  category: string;
  department: string;
  ownerId: string;
  authorId: string;
  reviewerId: string;
  status: HmoStatus;
  priority: HmoPriority;
  channel: string;
  publishAt: string;
  lastReviewAt: string;
  nextAction: string;
  nextActionOwnerId: string;
  dueAt: string;
  payload: HmoPayload;
};

export function emptyHmoDraft(userId: string, kind: HmoKind, department = "marketing_content"): HmoRecordDraft {
  return {
    id: "",
    kind,
    title: "",
    category: "",
    department,
    ownerId: userId,
    authorId: userId,
    reviewerId: "",
    status: defaultStatusForHmoKind(kind),
    priority: "normal",
    channel: "",
    publishAt: "",
    lastReviewAt: "",
    nextAction: "",
    nextActionOwnerId: "",
    dueAt: "",
    payload: emptyHmoPayload(),
  };
}

export function hmoDraftFromRow(row: HmoRecordRow): HmoRecordDraft {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    category: row.category,
    department: row.department,
    ownerId: row.ownerId,
    authorId: row.authorId,
    reviewerId: row.reviewerId,
    status: row.status,
    priority: row.priority,
    channel: row.channel,
    publishAt: row.publishAt,
    lastReviewAt: row.lastReviewAt,
    nextAction: row.nextAction,
    nextActionOwnerId: row.nextActionOwnerId,
    dueAt: row.dueAt,
    payload: row.payload,
  };
}

/** Field-level problems matching the server rules, used for inline hints before the save round-trip. */
export function hmoDraftIssues(draft: HmoRecordDraft) {
  const issues = new Set<string>();
  const p = draft.payload;
  if (!draft.title.trim()) issues.add("title");
  if (draft.kind === "metric") {
    if (!p.definition.trim()) issues.add("definition");
    if (!p.period.trim()) issues.add("period");
    if (!p.source.trim()) issues.add("source");
  }
  if (draft.kind === "asset" && p.containsClientOrGuestData && p.permissionStatus !== "approved" && p.permissionStatus !== "redacted") {
    issues.add("permissionStatus");
  }
  if (draft.kind === "campaign") {
    if (!p.campaignName.trim()) issues.add("campaignName");
    if (!draft.channel.trim()) issues.add("channel");
    if (!p.objective.trim()) issues.add("objective");
  }
  return issues;
}

function fromLocalInput(value: string) {
  if (!value) return "";
  const time = Date.parse(value);
  return Number.isNaN(time) ? "" : new Date(time).toISOString();
}

function Input({ value, onChange, invalid, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & { onChange: (value: string) => void; invalid?: boolean }) {
  return <input className={`crm-field${invalid ? " is-invalid" : ""}`} aria-invalid={invalid || undefined} {...rest} value={value} onChange={(event) => onChange(event.target.value)} />;
}

function Area({ value, onChange, rows = 3, invalid }: { value: string; onChange: (value: string) => void; rows?: number; invalid?: boolean }) {
  return <textarea className={`crm-field${invalid ? " is-invalid" : ""}`} aria-invalid={invalid || undefined} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />;
}

function StaffSelect({ value, staff, onChange, blank = "—" }: { value: string; staff: Staff[]; onChange: (value: string) => void; blank?: string }) {
  return (
    <select className="crm-field" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{blank}</option>
      {staff.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  );
}

export function HotelMarketingOpsRecordForm({
  draft,
  row,
  staff,
  access,
  extras,
  section,
  pending,
  saveOk,
  saveError,
  saveStamp,
  showIssues,
  onChange,
  onSave,
  onClose,
  onArchive,
  onDelete,
  subtasksSlot,
  approval,
  onDecide,
}: {
  draft: HmoRecordDraft;
  row?: HmoRecordRow;
  staff: Staff[];
  access: HmoAccessView;
  extras: HmoExtraDepartment[];
  section: HmoSection;
  pending: boolean;
  saveOk: string;
  saveError: string;
  saveStamp: number;
  showIssues: boolean;
  onChange: (draft: HmoRecordDraft) => void;
  onSave: () => void;
  onClose: () => void;
  onArchive: () => void;
  onDelete: () => void;
  subtasksSlot: ReactNode;
  approval: { ok: string; error: string };
  onDecide: (decision: "request" | "approve" | "changes" | "reject", notes: string) => Promise<boolean>;
}) {
  const [dirty, setDirty] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const [hrefText, setHrefText] = useState(draft.payload.relatedServiceHrefs.join("\n"));
  const kind = draft.kind;
  const p = draft.payload;
  const issues = useMemo(() => (showIssues ? hmoDraftIssues(draft) : new Set<string>()), [draft, showIssues]);
  const departments = [...HMO_DEPARTMENTS, ...extras.map((item) => item.id)].filter((item) => access.isManagement || access.departments.includes(item));

  const patch = (next: Partial<HmoRecordDraft>) => {
    setDirty(true);
    onChange({ ...draft, ...next });
  };
  const patchPayload = (next: Partial<HmoPayload>) => patch({ payload: { ...p, ...next } });
  const hint = (key: string, text?: string) => (issues.has(key) ? <span className="hmo-field-error">⚠ {text || "Required"}</span> : text);

  useEffect(() => {
    if (saveStamp > 0 && !saveError) setDirty(false);
  }, [saveStamp, saveError]);

  function requestClose() {
    if (dirty) setConfirmClose(true);
    else onClose();
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !confirmClose && !document.querySelector(".b2b-dialog")) {
        if (dirty) setConfirmClose(true);
        else onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmClose, dirty, onClose]);

  const saveBar = (
    <SaveBar
      pending={pending}
      ok={saveOk}
      error={saveError}
      dirty={dirty}
      idle={dirty ? "มีการแก้ไขที่ยังไม่บันทึก / Unsaved changes" : "พร้อมบันทึก / Ready to save"}
      onSave={onSave}
      saveLabel={draft.id ? "บันทึก / Save" : "สร้างรายการ / Create"}
    />
  );

  const releaseLocked = (status: HmoStatus) => !access.canApprove && HMO_RELEASE_STATUSES.includes(status) && row?.status !== status;

  return (
    <aside className="b2b-drawer hmo-drawer" role="dialog" aria-modal="true" aria-labelledby="hmo-form-title">
      <button type="button" className="b2b-drawer-backdrop" aria-label="ปิด / Close" onClick={requestClose} />
      <div className="b2b-drawer-panel">
        <header className="hmo-drawer-head">
          <div>
            <p className="crm-dash-kicker">
              {HMO_KIND_LABEL[kind]} · {HMO_SECTION_LABEL[section]}
            </p>
            <h2 id="hmo-form-title">{draft.title || "รายการใหม่ / New record"}</h2>
          </div>
          <button type="button" className="crm-users-secondary" onClick={requestClose}>
            ปิด / Close
          </button>
        </header>

        <div className="hmo-sticky-save">{saveBar}</div>
        <p className="hmo-privacy-note">
          บอร์ดภายในเท่านั้น — ไม่เก็บข้อมูลลูกค้า แขก รหัสการจอง รหัสบัญชี ยอดใช้จ่าย หรือรหัสผ่าน / Internal planning board only. Do not enter client, guest, booking, account, spend, or credential data.
        </p>

        <div className="hmo-form-grid">
          <Field label="ประเภท / Kind" hint={HMO_KIND_DESCRIPTION[kind]}>
            <select
              className="crm-field"
              value={kind}
              onChange={(event) => {
                const next = event.target.value as HmoKind;
                patch({ kind: next, status: draft.id ? draft.status : defaultStatusForHmoKind(next) });
              }}
            >
              {HMO_KINDS.map((item) => (
                <option key={item} value={item}>
                  {HMO_KIND_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ชื่อรายการ / Title *" hint={hint("title")}>
            <Input value={draft.title} onChange={(title) => patch({ title })} invalid={issues.has("title")} maxLength={255} />
          </Field>
          <Field label="หมวด / Category">
            <Input value={draft.category} onChange={(category) => patch({ category })} maxLength={191} />
          </Field>
          <Field label="แผนก / Department">
            <select className="crm-field" value={draft.department} onChange={(event) => patch({ department: event.target.value })}>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {hmoDepartmentLabel(item, extras)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ผู้รับผิดชอบ / Owner">
            <StaffSelect value={draft.ownerId} staff={staff} onChange={(ownerId) => patch({ ownerId })} />
          </Field>
          <Field label="ผู้เขียน / Author">
            <StaffSelect value={draft.authorId} staff={staff} onChange={(authorId) => patch({ authorId })} />
          </Field>
          <Field label="ผู้ตรวจ / Reviewer">
            <StaffSelect value={draft.reviewerId} staff={staff} onChange={(reviewerId) => patch({ reviewerId })} />
          </Field>
          <Field label="สถานะ / Status" hint={access.canApprove ? undefined : "Approved / Scheduled / Published need approval permission"}>
            <select className="crm-field" value={draft.status} onChange={(event) => patch({ status: event.target.value as HmoStatus })}>
              {HMO_STATUSES.map((item) => (
                <option key={item} value={item} disabled={releaseLocked(item)}>
                  {HMO_STATUS_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ความสำคัญ / Priority">
            <select className="crm-field" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as HmoPriority })}>
              {HMO_PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {HMO_PRIORITY_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ช่องทาง / Channel" hint={kind === "campaign" ? hint("channel", "Required for campaigns") : undefined}>
            <Input value={draft.channel} onChange={(channel) => patch({ channel })} invalid={issues.has("channel")} maxLength={191} placeholder="e.g. Website, Email, Social" />
          </Field>
          <Field label="วันเผยแพร่ / Publish at">
            <input className="crm-field" type="datetime-local" value={toDateTimeInput(draft.publishAt)} onChange={(event) => patch({ publishAt: fromLocalInput(event.target.value) })} />
          </Field>
          <Field label="กำหนดส่ง / Due at">
            <input className="crm-field" type="datetime-local" value={toDateTimeInput(draft.dueAt)} onChange={(event) => patch({ dueAt: fromLocalInput(event.target.value) })} />
          </Field>
          <Field label="ตรวจล่าสุด / Last review at">
            <input className="crm-field" type="datetime-local" value={toDateTimeInput(draft.lastReviewAt)} onChange={(event) => patch({ lastReviewAt: fromLocalInput(event.target.value) })} />
          </Field>
          <Field label="งานถัดไป / Next action">
            <Input value={draft.nextAction} onChange={(nextAction) => patch({ nextAction })} maxLength={500} />
          </Field>
          <Field label="ผู้ทำงานถัดไป / Next action owner">
            <StaffSelect value={draft.nextActionOwnerId} staff={staff} onChange={(nextActionOwnerId) => patch({ nextActionOwnerId })} />
          </Field>

          {kind === "article" ? (
            <>
              <h3>Article details</h3>
              <Field label="กลุ่มเป้าหมาย / Target audience">
                <Input value={p.targetAudience} onChange={(targetAudience) => patchPayload({ targetAudience })} />
              </Field>
              <Field label="Search intent">
                <Input value={p.searchIntent} onChange={(searchIntent) => patchPayload({ searchIntent })} />
              </Field>
              <Field label="เป้าหมายเนื้อหา / Content goal">
                <Area rows={2} value={p.contentGoal} onChange={(contentGoal) => patchPayload({ contentGoal })} />
              </Field>
              <Field label="Draft status">
                <select className="crm-field" value={p.draftStatus} onChange={(event) => patchPayload({ draftStatus: event.target.value })}>
                  {HMO_DRAFT_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {HMO_DRAFT_STATUS_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Source citation status">
                <select className="crm-field" value={p.sourceCitationStatus} onChange={(event) => patchPayload({ sourceCitationStatus: event.target.value })}>
                  {HMO_SOURCE_CITATION_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {HMO_SOURCE_CITATION_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Image permission status">
                <select className="crm-field" value={p.imagePermissionStatus} onChange={(event) => patchPayload({ imagePermissionStatus: event.target.value })}>
                  {HMO_IMAGE_PERMISSION_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {HMO_IMAGE_PERMISSION_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Related service links" hint="One internal path (/solutions/…) or https URL per line">
                <Area
                  rows={3}
                  value={hrefText}
                  onChange={(value) => {
                    setHrefText(value);
                    patchPayload({ relatedServiceHrefs: value.split("\n").map((item) => item.trim()).filter(Boolean) });
                  }}
                />
              </Field>
              <Field label="SEO title">
                <Input value={p.seoTitle} onChange={(seoTitle) => patchPayload({ seoTitle })} />
              </Field>
              <Field label="SEO description">
                <Area rows={2} value={p.seoDescription} onChange={(seoDescription) => patchPayload({ seoDescription })} />
              </Field>
            </>
          ) : null}

          {kind === "campaign" ? (
            <>
              <h3>Campaign details (planning only — no real spend or guest data)</h3>
              <Field label="Campaign name *" hint={hint("campaignName")}>
                <Input value={p.campaignName} onChange={(campaignName) => patchPayload({ campaignName })} invalid={issues.has("campaignName")} />
              </Field>
              <Field label="Property label" hint="Generic label only (e.g. “Beachfront resort A”) — no real hotel PII">
                <Input value={p.propertyLabel} onChange={(propertyLabel) => patchPayload({ propertyLabel })} />
              </Field>
              <Field label="Department owner">
                <Input value={p.departmentOwner} onChange={(departmentOwner) => patchPayload({ departmentOwner })} />
              </Field>
              <Field label="Objective *" hint={hint("objective")}>
                <Area rows={2} value={p.objective} onChange={(objective) => patchPayload({ objective })} invalid={issues.has("objective")} />
              </Field>
              <Field label="Landing page" hint="Internal path or https URL">
                <Input value={p.landingPage} onChange={(landingPage) => patchPayload({ landingPage })} />
              </Field>
              <Field label="Booking path dependency">
                <Input value={p.bookingPathDependency} onChange={(bookingPathDependency) => patchPayload({ bookingPathDependency })} />
              </Field>
              <Field label="KPI definition" hint="Describe the KPI — do not enter numeric results">
                <Area rows={2} value={p.kpiDefinition} onChange={(kpiDefinition) => patchPayload({ kpiDefinition })} />
              </Field>
              <Field label="Period">
                <Input value={p.period} onChange={(period) => patchPayload({ period })} />
              </Field>
              <Field label="Data source">
                <Input value={p.dataSource} onChange={(dataSource) => patchPayload({ dataSource })} />
              </Field>
              <Field label="Risk / approval">
                <Input value={p.riskApproval} onChange={(riskApproval) => patchPayload({ riskApproval })} />
              </Field>
              <Field label="Next action date">
                <input className="crm-field" type="date" value={p.nextActionDate} onChange={(event) => patchPayload({ nextActionDate: event.target.value })} />
              </Field>
            </>
          ) : null}

          {kind === "metric" ? (
            <>
              <h3>Metric definition (never enter numeric values)</h3>
              <Field label="Definition *" hint={hint("definition")}>
                <Area rows={3} value={p.definition} onChange={(definition) => patchPayload({ definition })} invalid={issues.has("definition")} />
              </Field>
              <Field label="Period *" hint={hint("period")}>
                <Input value={p.period} onChange={(period) => patchPayload({ period })} invalid={issues.has("period")} />
              </Field>
              <Field label="Source *" hint={hint("source")}>
                <Input value={p.source} onChange={(source) => patchPayload({ source })} invalid={issues.has("source")} />
              </Field>
              <Field label="Owner (role label)">
                <Input value={p.ownerLabel} onChange={(ownerLabel) => patchPayload({ ownerLabel })} />
              </Field>
              <Field label="Verified status">
                <select className="crm-field" value={p.verifiedStatus} onChange={(event) => patchPayload({ verifiedStatus: event.target.value })}>
                  {HMO_VERIFIED_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {HMO_VERIFIED_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          ) : null}

          {kind === "asset" ? (
            <>
              <h3>Asset / permission review</h3>
              <Field label="Asset type">
                <select className="crm-field" value={p.assetType} onChange={(event) => patchPayload({ assetType: event.target.value })}>
                  {HMO_ASSET_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {HMO_ASSET_TYPE_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Alt text">
                <Input value={p.altText} onChange={(altText) => patchPayload({ altText })} />
              </Field>
              <label className="hmo-check is-wide">
                <input type="checkbox" checked={p.containsClientOrGuestData} onChange={(event) => patchPayload({ containsClientOrGuestData: event.target.checked })} />
                <span>มีข้อมูลลูกค้า/แขก / Contains client or guest data (requires Approved or Redacted)</span>
              </label>
              <Field label="Permission status *" hint={hint("permissionStatus", "Approved or Redacted required when client/guest data is present")}>
                <select
                  className={`crm-field${issues.has("permissionStatus") ? " is-invalid" : ""}`}
                  value={p.permissionStatus}
                  onChange={(event) => patchPayload({ permissionStatus: event.target.value })}
                >
                  {HMO_ASSET_PERMISSION_STATUSES.map((item) => (
                    <option key={item} value={item}>
                      {HMO_ASSET_PERMISSION_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Permission note">
                <Area rows={2} value={p.permissionNote} onChange={(permissionNote) => patchPayload({ permissionNote })} />
              </Field>
              <Field label="Source note">
                <Area rows={2} value={p.sourceNote} onChange={(sourceNote) => patchPayload({ sourceNote })} />
              </Field>
            </>
          ) : null}

          {kind === "seo_brief" ? (
            <>
              <h3>SEO brief</h3>
              <Field label="Primary intent">
                <Input value={p.primaryIntent} onChange={(primaryIntent) => patchPayload({ primaryIntent })} />
              </Field>
              <Field label="Target queries" hint="One per line">
                <Area rows={3} value={p.targetQueries} onChange={(targetQueries) => patchPayload({ targetQueries })} />
              </Field>
              <Field label="Outline">
                <Area rows={4} value={p.outline} onChange={(outline) => patchPayload({ outline })} />
              </Field>
              <Field label="Related services" hint="Service names or internal paths">
                <Area rows={2} value={p.relatedServices} onChange={(relatedServices) => patchPayload({ relatedServices })} />
              </Field>
            </>
          ) : null}

          {kind === "channel_plan" ? (
            <>
              <h3>Channel plan</h3>
              <Field label="Role in the path">
                <Input value={p.roleInPath} onChange={(roleInPath) => patchPayload({ roleInPath })} />
              </Field>
              <Field label="Owner department">
                <Input value={p.ownerDept} onChange={(ownerDept) => patchPayload({ ownerDept })} />
              </Field>
              <Field label="Dependency">
                <Input value={p.dependency} onChange={(dependency) => patchPayload({ dependency })} />
              </Field>
            </>
          ) : null}

          {kind === "related_link" ? (
            <>
              <h3>Related link</h3>
              <Field label="Link (href)" hint="Internal path (/…) or https URL">
                <Input value={p.href} onChange={(href) => patchPayload({ href })} />
              </Field>
              <Field label="Label">
                <Input value={p.label} onChange={(label) => patchPayload({ label })} />
              </Field>
              <Field label="Why it is related">
                <Area rows={2} value={p.why} onChange={(why) => patchPayload({ why })} />
              </Field>
            </>
          ) : null}

          {kind === "translation" ? (
            <>
              <h3>Translation review</h3>
              <Field label="Source locale">
                <select className="crm-field" value={p.sourceLocale} onChange={(event) => patchPayload({ sourceLocale: event.target.value })}>
                  {HMO_LOCALES.map((item) => (
                    <option key={item} value={item}>
                      {HMO_LOCALE_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Target locale">
                <select className="crm-field" value={p.targetLocale} onChange={(event) => patchPayload({ targetLocale: event.target.value })}>
                  {HMO_LOCALES.map((item) => (
                    <option key={item} value={item}>
                      {HMO_LOCALE_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status note">
                <Area rows={2} value={p.statusNote} onChange={(statusNote) => patchPayload({ statusNote })} />
              </Field>
            </>
          ) : null}

          {kind === "report" ? (
            <>
              <h3>Report</h3>
              <Field label="Definition">
                <Area rows={2} value={p.definition} onChange={(definition) => patchPayload({ definition })} />
              </Field>
              <Field label="Period">
                <Input value={p.period} onChange={(period) => patchPayload({ period })} />
              </Field>
              <Field label="Method">
                <Input value={p.method} onChange={(method) => patchPayload({ method })} />
              </Field>
            </>
          ) : null}

          <div className="is-wide">
            <Field label="บันทึก / Notes" hint="Internal notes and source links. No guest, booking, account, or spend data.">
              <Area rows={3} value={p.notes} onChange={(notes) => patchPayload({ notes })} />
            </Field>
          </div>
          {row ? (
            <p className="b2b-muted hmo-span-2">
              สร้าง {hmoFormatDate(row.createdAt) || "—"} · อัปเดต {hmoFormatDate(row.updatedAt, true) || "—"}
            </p>
          ) : null}
        </div>

        {saveBar}

        {row ? (
          <>
            <section className="hmo-panel" aria-label="Subtasks">
              <h3>งานย่อย / Subtasks</h3>
              {subtasksSlot}
            </section>

            <section className="hmo-panel" aria-label="Approvals">
              <h3>อนุมัติ / Approvals</h3>
              <p className="b2b-muted">
                Reviewer: {row.reviewerName || "—"} · Last review: {hmoFormatDate(row.lastReviewAt) || "—"}
                {access.canApprove ? "" : " · คุณไม่มีสิทธิ์อนุมัติ / You can request review but not approve"}
              </p>
              <ul>
                {row.approvals.length ? (
                  row.approvals.map((item) => (
                    <li key={item.id}>
                      <span className={`b2b-status is-${item.status}`}>{HMO_APPROVAL_LABEL[item.status]}</span> {item.decidedByName ? `${item.decidedByName} · ` : ""}
                      {item.notes} <small>{hmoFormatDate(item.createdAt, true)}</small>
                    </li>
                  ))
                ) : (
                  <li>ยังไม่มีบันทึกอนุมัติ / No approval notes yet</li>
                )}
              </ul>
              <Field label="บันทึกประกอบ / Note (required)">
                <input className="crm-field" value={approvalNote} onChange={(event) => setApprovalNote(event.target.value)} placeholder="e.g. Sources verified, ready for sign-off" />
              </Field>
              <div className="b2b-inline">
                <button
                  type="button"
                  className="crm-users-secondary"
                  disabled={pending}
                  onClick={async () => {
                    if (await onDecide("request", approvalNote)) setApprovalNote("");
                  }}
                >
                  ขอตรวจ / Request review
                </button>
                {access.canApprove ? (
                  <>
                    <button
                      type="button"
                      className="kpi-button b2b-save"
                      disabled={pending}
                      onClick={async () => {
                        if (await onDecide("approve", approvalNote)) setApprovalNote("");
                      }}
                    >
                      อนุมัติ / Approve
                    </button>
                    <button
                      type="button"
                      className="crm-users-secondary"
                      disabled={pending}
                      onClick={async () => {
                        if (await onDecide("changes", approvalNote)) setApprovalNote("");
                      }}
                    >
                      ขอแก้ไข / Request changes
                    </button>
                    <button
                      type="button"
                      className="crm-users-secondary"
                      disabled={pending}
                      onClick={async () => {
                        if (await onDecide("reject", approvalNote)) setApprovalNote("");
                      }}
                    >
                      ปฏิเสธ / Reject
                    </button>
                  </>
                ) : null}
              </div>
              <p className={`crm-cs-save-state${approval.error ? " is-error" : approval.ok ? " is-ok" : ""}`} role="status">
                {pending ? "กำลังบันทึก…" : approval.error || approval.ok || "พร้อมบันทึก / Ready"}
              </p>
            </section>

            <section className="hmo-panel" aria-label="History">
              <h3>ประวัติ / History</h3>
              <ul>
                {row.history.length ? (
                  row.history.slice(0, 8).map((item) => (
                    <li key={item.id}>
                      {hmoFormatDate(item.createdAt, true)} · {item.createdByName || "—"} · <strong>{item.action}</strong> · {item.detail}
                    </li>
                  ))
                ) : (
                  <li>ยังไม่มีประวัติ</li>
                )}
              </ul>
            </section>

            <div className="b2b-inline">
              <button type="button" className="crm-users-secondary" onClick={onArchive}>
                Archive
              </button>
              <button type="button" className="crm-users-secondary" onClick={onDelete}>
                ลบ / Delete
              </button>
            </div>
          </>
        ) : draft.id ? (
          <p className="b2b-muted">
            กำลังโหลดรายการ… หากไม่แสดง รายการอาจถูกกรองออกจากมุมมองนี้ / Loading record… If subtasks do not appear, the record may be filtered out of this view.
          </p>
        ) : (
          <p className="b2b-muted">บันทึกรายการก่อน จึงจะเพิ่มงานย่อยและบันทึกอนุมัติได้ / Save the record first to add subtasks and approvals.</p>
        )}
      </div>

      {confirmClose ? (
        <B2bDialog
          title="ปิดโดยไม่บันทึก? / Discard changes?"
          body="มีการแก้ไขที่ยังไม่บันทึก ยืนยันปิดฟอร์มหรือไม่ / You have unsaved changes. Close without saving?"
          confirmLabel="ปิดโดยไม่บันทึก / Discard"
          pending={false}
          onCancel={() => setConfirmClose(false)}
          onConfirm={() => {
            setConfirmClose(false);
            onClose();
          }}
        />
      ) : null}
    </aside>
  );
}
