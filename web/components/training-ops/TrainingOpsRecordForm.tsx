"use client";

import { useEffect, useState, type InputHTMLAttributes } from "react";
import { Field, SaveBar, toDateTimeInput } from "@/components/b2b-ops/ui";
import {
  TRN_APPROVAL_LABEL,
  TRN_ATTENDANCE,
  TRN_ATTENDANCE_LABEL,
  TRN_DEPARTMENTS,
  TRN_FORMAT_LABEL,
  TRN_FORMATS,
  TRN_KIND_LABEL,
  TRN_KINDS,
  TRN_PRIORITIES,
  TRN_PRIORITY_LABEL,
  TRN_PROGRAM_STATUSES,
  TRN_STATUS_LABEL,
  TRN_STATUSES,
  TRN_VISIBILITY,
  TRN_VISIBILITY_LABEL,
  departmentLabel,
  emptyPayload,
  type TrnAccessView,
  type TrnExtraDepartment,
  type TrnKind,
  type TrnPayload,
  type TrnPriority,
  type TrnRecordRow,
  type TrnSection,
  type TrnStatus,
  type TrnSubtaskView,
} from "@/lib/training-ops/types";
import { TrainingOpsSubtasksPanel, type TrnSubtaskDraft } from "./TrainingOpsSubtasksPanel";

type Staff = { id: string; name: string };

export type TrnRecordDraft = {
  id: string;
  kind: TrnKind;
  title: string;
  hotelName: string;
  department: string;
  ownerId: string;
  approverId: string;
  trainerId: string;
  programId: string;
  status: TrnStatus;
  priority: TrnPriority;
  eventAt: string;
  notes: string;
  payload: TrnPayload;
};

export function emptyTrnDraft(userId: string, kind: TrnKind, department = "hr_ld"): TrnRecordDraft {
  return {
    id: "",
    kind,
    title: "",
    hotelName: "",
    department,
    ownerId: userId,
    approverId: "",
    trainerId: "",
    programId: "",
    status: kind === "request" ? "new" : kind === "session" ? "scheduled" : "draft",
    priority: "normal",
    eventAt: "",
    notes: "",
    payload: emptyPayload(),
  };
}

export function draftFromRow(row: TrnRecordRow): TrnRecordDraft {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    hotelName: row.hotelName,
    department: row.department,
    ownerId: row.ownerId,
    approverId: row.approverId,
    trainerId: row.trainerId,
    programId: row.programId,
    status: row.status,
    priority: row.priority,
    eventAt: row.eventAt,
    notes: row.notes,
    payload: row.payload,
  };
}

function Input({ value, onChange, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & { onChange: (value: string) => void }) {
  return <input className="crm-field" {...rest} value={value} onChange={(event) => onChange(event.target.value)} />;
}

export function TrainingOpsRecordForm({
  draft,
  row,
  staff,
  programs = [],
  access,
  extras,
  section,
  pending,
  ok,
  error,
  onChange,
  onSave,
  onClose,
  onArchive,
  subtaskDraft,
  subtaskComment,
  onSubtaskDraftChange,
  onSubtaskCommentChange,
  onSaveSubtask,
  onCompleteSubtask,
  onDeleteSubtask,
  onAddComment,
  onPatchSubtask,
  onAddDuty,
  onReviewerNote,
  onApprove,
  onEscalate,
}: {
  draft: TrnRecordDraft;
  row?: TrnRecordRow;
  staff: Staff[];
  programs?: Array<{ id: string; title: string }>;
  access: TrnAccessView;
  extras: TrnExtraDepartment[];
  section: TrnSection;
  pending: boolean;
  ok: string;
  error: string;
  onChange: (draft: TrnRecordDraft) => void;
  onSave: () => void;
  onClose: () => void;
  onArchive?: () => void;
  subtaskDraft: TrnSubtaskDraft;
  subtaskComment: string;
  onSubtaskDraftChange: (draft: TrnSubtaskDraft) => void;
  onSubtaskCommentChange: (value: string) => void;
  onSaveSubtask: () => void;
  onCompleteSubtask: (item: TrnSubtaskView, completed: boolean) => void;
  onDeleteSubtask: (item: TrnSubtaskView) => void;
  onAddComment: (subtaskId: string) => void;
  onPatchSubtask: (item: TrnSubtaskView, patch: Partial<TrnSubtaskDraft>) => void;
  onAddDuty: (department: string, name: string) => void;
  onReviewerNote: (subtaskId: string, notes: string, reviewerId: string) => void;
  onApprove: (decision: "approve" | "reject", notes: string) => void;
  onEscalate: (notes: string) => void;
}) {
  const [dirty, setDirty] = useState(false);
  const [approvalNote, setApprovalNote] = useState("");
  const departments = [...TRN_DEPARTMENTS, ...extras.map((item) => item.id)];
  const kind = draft.kind;
  const payload = draft.payload;
  const patch = (next: Partial<TrnRecordDraft>) => {
    setDirty(true);
    onChange({ ...draft, ...next });
  };
  const patchPayload = (next: Partial<TrnPayload>) => patch({ payload: { ...payload, ...next } });
  useEffect(() => {
    if (ok || error) setDirty(false);
  }, [ok, error]);

  const saveBar = (
    <SaveBar
      pending={pending}
      ok={ok}
      error={error}
      dirty={dirty}
      idle={dirty ? "มีการแก้ไขที่ยังไม่บันทึก / Unsaved changes" : "พร้อมบันทึก / Ready to save"}
      onSave={onSave}
      saveLabel={draft.id ? "บันทึก / Save" : "สร้าง / Create"}
    />
  );

  return (
    <aside className="b2b-drawer" role="dialog" aria-modal="true" aria-labelledby="trn-form-title">
      <div className="b2b-drawer-card">
        <header className="b2b-drawer-head">
          <div>
            <p className="crm-dash-kicker">{TRN_KIND_LABEL[kind]} · {section}</p>
            <h2 id="trn-form-title">{draft.title || "รายการใหม่ / New record"}</h2>
          </div>
          <button type="button" className="crm-users-secondary" onClick={onClose}>
            ปิด
          </button>
        </header>
        {saveBar}
        <p className="trn-privacy-note">บอร์ดภายในเท่านั้น — ไม่แสดงบนหน้าสาธารณะ และไม่เก็บคะแนนรายบุคคลหรือข้อมูลแขกในช่องที่ไม่มีการจำกัดสิทธิ์</p>
        <div className="trn-form-grid">
          <Field label="ประเภท / Kind">
            <select className="crm-field" value={kind} onChange={(event) => patch({ kind: event.target.value as TrnKind })}>
              {TRN_KINDS.map((item) => (
                <option key={item} value={item}>
                  {TRN_KIND_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ชื่อรายการ / Title">
            <Input value={draft.title} onChange={(title) => patch({ title })} />
          </Field>
          <Field label="โรงแรม / Property">
            <Input value={draft.hotelName} onChange={(hotelName) => patch({ hotelName })} />
          </Field>
          <Field label="แผนก / Department">
            <select className="crm-field" value={draft.department} onChange={(event) => patch({ department: event.target.value })}>
              {departments.map((item) => (
                <option key={item} value={item}>
                  {departmentLabel(item, extras)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ผู้รับผิดชอบ / Owner">
            <select className="crm-field" value={draft.ownerId} onChange={(event) => patch({ ownerId: event.target.value })}>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ผู้อนุมัติ / Approver">
            <select className="crm-field" value={draft.approverId} onChange={(event) => patch({ approverId: event.target.value })}>
              <option value="">—</option>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="วิทยากร / Trainer">
            <select className="crm-field" value={draft.trainerId} onChange={(event) => patch({ trainerId: event.target.value })}>
              <option value="">—</option>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="สถานะ / Status">
            <select className="crm-field" value={draft.status} onChange={(event) => patch({ status: event.target.value as TrnStatus })}>
              {(kind === "program" ? TRN_PROGRAM_STATUSES : TRN_STATUSES).map((item) => (
                <option key={item} value={item}>
                  {TRN_STATUS_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ความสำคัญ / Priority">
            <select className="crm-field" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as TrnPriority })}>
              {TRN_PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {TRN_PRIORITY_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="วันที่ / Date">
            <input className="crm-field" type="datetime-local" value={toDateTimeInput(draft.eventAt)} onChange={(event) => patch({ eventAt: event.target.value })} />
          </Field>

          {kind === "request" ? (
            <>
              <Field label="ผู้ขอ / Requester">
                <Input value={payload.requester} onChange={(requester) => patchPayload({ requester })} />
              </Field>
              <Field label="บทบาทผู้เรียน / Target learner roles">
                <Input value={payload.targetRoles} onChange={(targetRoles) => patchPayload({ targetRoles })} />
              </Field>
              <Field label="เป้าหมาย / Training goal" hint="ไม่ใส่คะแนนรายบุคคล">
                <textarea className="crm-field" rows={2} value={payload.goal} onChange={(event) => patchPayload({ goal: event.target.value })} />
              </Field>
              <Field label="ช่องว่างทักษะ / Skill gap">
                <textarea className="crm-field" rows={2} value={payload.skillGap} onChange={(event) => patchPayload({ skillGap: event.target.value })} />
              </Field>
              <Field label="รูปแบบที่ต้องการ / Preferred format">
                <select className="crm-field" value={payload.format} onChange={(event) => patchPayload({ format: event.target.value })}>
                  {TRN_FORMATS.map((item) => (
                    <option key={item} value={item}>
                      {TRN_FORMAT_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="จำนวนผู้เรียนโดยประมาณ / Approximate learner count">
                <Input value={payload.learnerCount} onChange={(learnerCount) => patchPayload({ learnerCount })} />
              </Field>
              <Field label="ช่วงวันที่ต้องการ / Preferred date window">
                <Input value={payload.dateWindow} onChange={(dateWindow) => patchPayload({ dateWindow })} />
              </Field>
            </>
          ) : null}

          {kind === "program" ? (
            <>
              <Field label="หมวด / Category">
                <Input value={payload.category} onChange={(category) => patchPayload({ category })} />
              </Field>
              <Field label="กลุ่มเป้าหมาย / Target audience">
                <Input value={payload.audience} onChange={(audience) => patchPayload({ audience })} />
              </Field>
              <Field label="ผลลัพธ์การเรียนรู้ / Learning outcomes">
                <textarea className="crm-field" rows={3} value={payload.outcomes} onChange={(event) => patchPayload({ outcomes: event.target.value })} />
              </Field>
              <Field label="วาระ / Agenda">
                <textarea className="crm-field" rows={3} value={payload.agenda} onChange={(event) => patchPayload({ agenda: event.target.value })} />
              </Field>
              <Field label="สื่อ / Materials">
                <textarea className="crm-field" rows={2} value={payload.materials} onChange={(event) => patchPayload({ materials: event.target.value })} />
              </Field>
              <Field label="รูปแบบ / Format">
                <select className="crm-field" value={payload.format} onChange={(event) => patchPayload({ format: event.target.value })}>
                  {TRN_FORMATS.map((item) => (
                    <option key={item} value={item}>
                      {TRN_FORMAT_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="ระยะเวลา / Duration" hint="บันทึกได้เมื่อยืนยันแล้ว">
                <Input value={payload.duration} onChange={(duration) => patchPayload({ duration })} />
              </Field>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={payload.durationConfirmed} onChange={(event) => patchPayload({ durationConfirmed: event.target.checked })} /> ยืนยันระยะเวลา / Duration confirmed
                </span>
              </label>
              <Field label="วิธีประเมิน / Assessment method">
                <Input value={payload.assessmentMethod} onChange={(assessmentMethod) => patchPayload({ assessmentMethod })} />
              </Field>
              <Field label="วิธีติดตาม / Follow-up method">
                <Input value={payload.followUpMethod} onChange={(followUpMethod) => patchPayload({ followUpMethod })} />
              </Field>
              <Field label="ภาษา / Language">
                <Input value={payload.language} onChange={(language) => patchPayload({ language })} />
              </Field>
              <Field label="วิทยากร / Trainer">
                <Input value={payload.trainerName} onChange={(trainerName) => patchPayload({ trainerName })} />
              </Field>
            </>
          ) : null}

          {kind === "group" ? (
            <>
              <Field label="บทบาทในกลุ่ม / Learner roles">
                <Input value={payload.targetRoles} onChange={(targetRoles) => patchPayload({ targetRoles })} />
              </Field>
              <Field label="ขนาดกลุ่ม / Size note" hint="ใช้จำนวนรวม ไม่ใส่รายชื่อ">
                <Input value={payload.sizeNote} onChange={(sizeNote) => patchPayload({ sizeNote })} />
              </Field>
              <Field label="หมายเหตุความเป็นส่วนตัว / Privacy note">
                <textarea className="crm-field" rows={2} value={payload.privacyNote} onChange={(event) => patchPayload({ privacyNote: event.target.value })} />
              </Field>
            </>
          ) : null}

          {kind === "needs" ? (
            <>
              <Field label="คำถามสำรวจ / Prompts">
                <textarea className="crm-field" rows={4} value={payload.prompts} onChange={(event) => patchPayload({ prompts: event.target.value })} />
              </Field>
              <Field label="รายการตรวจเอง / Self-check">
                <textarea className="crm-field" rows={4} value={payload.selfCheck} onChange={(event) => patchPayload({ selfCheck: event.target.value })} />
              </Field>
            </>
          ) : null}

          {kind === "material" ? (
            <>
              <Field label="วาระ / Agenda">
                <textarea className="crm-field" rows={3} value={payload.agenda} onChange={(event) => patchPayload({ agenda: event.target.value })} />
              </Field>
              <Field label="สื่อ / Materials">
                <textarea className="crm-field" rows={3} value={payload.materials} onChange={(event) => patchPayload({ materials: event.target.value })} />
              </Field>
              <Field label="ลิงก์เอกสาร / Materials link">
                <Input value={payload.materialsLink} onChange={(materialsLink) => patchPayload({ materialsLink })} />
              </Field>
            </>
          ) : null}

          {kind === "session" ? (
            <>
              <Field label="โปรแกรม / Program">
                {programs.length ? (
                  <select
                    className="crm-field"
                    value={draft.programId}
                    onChange={(event) => {
                      const programId = event.target.value;
                      const selected = programs.find((item) => item.id === programId);
                      patch({ programId, payload: { ...payload, programName: selected?.title || payload.programName } });
                    }}
                  >
                    <option value="">—</option>
                    {programs.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input value={payload.programName} onChange={(programName) => patchPayload({ programName })} />
                )}
              </Field>
              {programs.length ? (
                <Field label="ชื่อโปรแกรม (ถ้ายังไม่อยู่ในรายการ) / Program name">
                  <Input value={payload.programName} onChange={(programName) => patchPayload({ programName })} />
                </Field>
              ) : null}
              <Field label="ผู้อำนวย / Facilitator">
                <Input value={payload.facilitator} onChange={(facilitator) => patchPayload({ facilitator })} />
              </Field>
              <Field label="กลุ่มผู้เรียน / Learner group" hint="บทบาทหรือแผนก ไม่ใส่รายชื่อถ้าไม่มีสิทธิ์">
                <Input value={payload.learnerGroup} onChange={(learnerGroup) => patchPayload({ learnerGroup })} disabled={!access.canSeeParticipants && Boolean(payload.learnerGroup)} />
              </Field>
              <Field label="สถานะการเข้าเรียน / Attendance">
                <select className="crm-field" value={payload.attendanceStatus} onChange={(event) => patchPayload({ attendanceStatus: event.target.value })}>
                  {TRN_ATTENDANCE.map((item) => (
                    <option key={item} value={item}>
                      {TRN_ATTENDANCE_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="ลิงก์สื่อ / Materials link">
                <Input value={payload.materialsLink} onChange={(materialsLink) => patchPayload({ materialsLink })} />
              </Field>
              <Field label="แผนกิจกรรม/ประเมิน / Activity plan">
                <textarea className="crm-field" rows={3} value={payload.activityPlan} onChange={(event) => patchPayload({ activityPlan: event.target.value })} />
              </Field>
            </>
          ) : null}

          {kind === "assessment" ? (
            <>
              <Field label="ผลลัพธ์ที่วัด / Learning outcome">
                <Input value={payload.outcomes} onChange={(outcomes) => patchPayload({ outcomes })} />
              </Field>
              <Field label="วิธี / Method">
                <Input value={payload.method} onChange={(method) => patchPayload({ method })} />
              </Field>
              <Field label="รูบริก/เช็กลิสต์ / Rubric">
                <textarea className="crm-field" rows={3} value={payload.rubric} onChange={(event) => patchPayload({ rubric: event.target.value })} />
              </Field>
              <Field label="ผลรวม / Aggregated result" hint="ห้ามใส่คะแนนรายบุคคล">
                <Input value={payload.aggregatedResult} onChange={(aggregatedResult) => patchPayload({ aggregatedResult })} />
              </Field>
              <Field label="ผู้ทบทวน / Reviewer">
                <Input value={payload.reviewer} onChange={(reviewer) => patchPayload({ reviewer })} />
              </Field>
              <Field label="ช่วงวัด / Period">
                <Input value={payload.period} onChange={(period) => patchPayload({ period })} />
              </Field>
              <Field label="ระดับการมองเห็น / Visibility">
                <select className="crm-field" value={payload.visibility} onChange={(event) => patchPayload({ visibility: event.target.value })}>
                  {TRN_VISIBILITY.map((item) => (
                    <option key={item} value={item}>
                      {TRN_VISIBILITY_LABEL[item]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="การติดตาม / Follow-up action">
                <Input value={payload.followUpAction} onChange={(followUpAction) => patchPayload({ followUpAction })} />
              </Field>
            </>
          ) : null}

          {kind === "action" ? (
            <>
              <Field label="เจ้าของงานที่หน้างาน / Owner role">
                <Input value={payload.ownerRole} onChange={(ownerRole) => patchPayload({ ownerRole })} />
              </Field>
              <Field label="จุดทบทวน / Checkpoint">
                <Input value={payload.checkpoint} onChange={(checkpoint) => patchPayload({ checkpoint })} />
              </Field>
              <Field label="ผู้สนับสนุน / Support">
                <Input value={payload.support} onChange={(support) => patchPayload({ support })} />
              </Field>
              <Field label="ความเป็นส่วนตัว / Privacy note">
                <textarea className="crm-field" rows={2} value={payload.privacyNote} onChange={(event) => patchPayload({ privacyNote: event.target.value })} />
              </Field>
            </>
          ) : null}

          {kind === "trainer" ? (
            <>
              <Field label="ทักษะ / Skills">
                <textarea className="crm-field" rows={2} value={payload.skills} onChange={(event) => patchPayload({ skills: event.target.value })} />
              </Field>
              <Field label="วุฒิบัตร / Credentials" hint="แสดงเมื่อยืนยันแล้ว">
                <Input value={payload.credentials} onChange={(credentials) => patchPayload({ credentials })} />
              </Field>
              <Field label="ภาษา / Language">
                <Input value={payload.language} onChange={(language) => patchPayload({ language })} />
              </Field>
              <Field label="แหล่งหลักฐาน / Proof source">
                <Input value={payload.proofSource} onChange={(proofSource) => patchPayload({ proofSource })} />
              </Field>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={payload.verified} onChange={(event) => patchPayload({ verified: event.target.checked })} /> ยืนยันแล้ว / Verified
                </span>
              </label>
            </>
          ) : null}

          {kind === "feedback" || kind === "report" ? (
            <>
              <Field label="ตัวชี้วัด / Metric">
                <Input value={payload.metric} onChange={(metric) => patchPayload({ metric })} />
              </Field>
              <Field label="นิยาม / Definition">
                <textarea className="crm-field" rows={2} value={payload.definition} onChange={(event) => patchPayload({ definition: event.target.value })} />
              </Field>
              <Field label="วิธี / Method">
                <Input value={payload.method} onChange={(method) => patchPayload({ method })} />
              </Field>
              <Field label="ช่วงวัด / Period">
                <Input value={payload.period} onChange={(period) => patchPayload({ period })} />
              </Field>
              <Field label="แหล่งที่มา / Source">
                <Input value={payload.source} onChange={(source) => patchPayload({ source })} />
              </Field>
              <Field label="ค่าผลรวม / Aggregate value">
                <Input value={payload.value} onChange={(value) => patchPayload({ value })} />
              </Field>
              <label className="crm-cms-field">
                <span>
                  <input type="checkbox" checked={payload.sample} onChange={(event) => patchPayload({ sample: event.target.checked })} /> ป้าย Sample
                </span>
              </label>
            </>
          ) : null}

          <Field label="บันทึก / Notes">
            <textarea className="crm-field" rows={3} value={draft.notes} onChange={(event) => patch({ notes: event.target.value })} />
          </Field>
          {row ? (
            <p className="trn-privacy-note trn-span-2">
              สร้าง {row.createdAt.slice(0, 10) || "—"} · อัปเดต {row.updatedAt.slice(0, 10) || "—"}
            </p>
          ) : null}
        </div>

        {row ? (
          <section className="trn-followup">
            <TrainingOpsSubtasksPanel
              row={row}
              staff={staff}
              access={access}
              extras={extras}
              pending={pending}
              draft={subtaskDraft}
              comment={subtaskComment}
              saveState={ok}
              saveError={error}
              onDraftChange={onSubtaskDraftChange}
              onCommentChange={onSubtaskCommentChange}
              onSave={onSaveSubtask}
              onComplete={onCompleteSubtask}
              onAddComment={onAddComment}
              onPatchSubtask={onPatchSubtask}
              onDelete={onDeleteSubtask}
              onAddDuty={onAddDuty}
              onReviewerNote={onReviewerNote}
            />
            <h3>อนุมัติ / Approvals</h3>
            <ul>
              {row.approvals.length ? row.approvals.map((item) => (
                <li key={item.id}>
                  {TRN_APPROVAL_LABEL[item.status]} · {item.notes}
                </li>
              )) : <li>ยังไม่มีบันทึกอนุมัติ</li>}
            </ul>
            <div className="b2b-inline">
              <input className="crm-field" value={approvalNote} onChange={(event) => setApprovalNote(event.target.value)} placeholder="บันทึกอนุมัติ" />
              <button type="button" className="kpi-button b2b-save" onClick={() => approvalNote.trim() && onApprove("approve", approvalNote)}>
                อนุมัติ
              </button>
              <button type="button" className="crm-users-secondary" onClick={() => approvalNote.trim() && onApprove("reject", approvalNote)}>
                ปฏิเสธ / Reject
              </button>
              <button type="button" className="crm-users-secondary" onClick={() => approvalNote.trim() && onEscalate(approvalNote)}>
                ส่งต่อ / Escalate
              </button>
            </div>
            <h3>ประวัติ / History</h3>
            <ul>
              {row.history.slice(0, 8).map((item) => (
                <li key={item.id}>
                  {item.createdAt.slice(0, 10)} · {item.action} · {item.detail}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {saveBar}
        {draft.id && onArchive ? (
          <button type="button" className="crm-users-secondary" onClick={onArchive}>
            Archive
          </button>
        ) : null}
      </div>
    </aside>
  );
}
