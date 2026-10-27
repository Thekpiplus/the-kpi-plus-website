"use client";

import { useState } from "react";
import { Field, SaveBar, toDateInput } from "@/components/b2b-ops/ui";
import {
  ADS_ACTIVITY_STATUS_LABEL,
  ADS_ACTIVITY_TYPE_LABEL,
  META_ACTIVITY_TYPES,
  ADS_APPROVAL_STATUS_LABEL,
  META_APPROVAL_STATUSES,
  ADS_BUDGET_PERIOD_LABEL,
  META_BUDGET_PERIODS,
  META_SCENARIO_LABEL,
  META_CHANNELS,
  ADS_DEPARTMENT_LABEL,
  META_DEPARTMENTS,
  ADS_FORM_TAB_LABEL,
  META_FORM_TABS,
  META_KPI_DATA_STATUS_LABEL,
  META_KPI_DATA_STATUSES,
  META_PRIORITIES,
  ADS_PRIORITY_LABEL,
  ADS_STATUS_LABEL,
  META_STATUSES,
  ADS_DEPARTMENT_DUTIES,
  META_READINESS_LABEL,
  META_TRACKING_STATUS_LABEL,
  META_TRACKING_STATUSES,
  type MetaAccessView,
  type MetaCampaignListItem,
  type MetaChannel,
  type MetaDepartment,
  metaSectionFormTab,
  type MetaFormTab,
  type MetaPriority,
  type MetaSection,
  type MetaStatus,
  type MetaSubtaskView,
} from "@/lib/meta-ops/types";
import { MetaSubtasksPanel, type SubtaskDraft } from "./MetaSubtasksPanel";

export type CampaignDraft = {
  id: string;
  name: string;
  hotelName: string;
  channel: MetaChannel;
  objective: string;
  market: string;
  language: string;
  startAt: string;
  endAt: string;
  budgetAmount: string;
  budgetPeriod: string;
  status: MetaStatus;
  ownerId: string;
  department: MetaDepartment;
  priority: MetaPriority;
  nextAction: string;
  nextActionAt: string;
  landingUrl: string;
  bookingUrl: string;
  trackingStatus: string;
  primaryKpi: string;
  kpiTarget: string;
  approvalStatus: string;
  notes: string;
  audienceSegment: string;
  creativeMatrixRef: string;
  remarketingNotes: string;
  pixelRef: string;
  audienceIntent: string;
  adsCreative: string;
  landingNotes: string;
  trackingNotes: string;
  reportNotes: string;
  searchIntent: string;
  adCopy: string;
  audience: string;
  campaignMessaging: string;
  creativeNotes: string;
  offerPromotion: string;
  rateContext: string;
  roasTarget: string;
  bookingValueNotes: string;
  rateFeed: string;
  hotelAdsQuality: string;
  channelConsistency: string;
  bookingEngineNotes: string;
  landingContent: string;
  hotelValueProp: string;
  marketPartnerContext: string;
  leadFollowUp: string;
  budgetAuth: string;
  kpiReview: string;
  finalDecision: string;
  accountRef: string;
  budgetNote: string;
};

type Staff = { id: string; name: string };

export function emptyCampaignDraft(ownerId = ""): CampaignDraft {
  return {
    id: "",
    name: "",
    hotelName: "",
    channel: "awareness",
    objective: "",
    market: "",
    language: "",
    startAt: "",
    endAt: "",
    budgetAmount: "",
    budgetPeriod: "monthly",
    status: "draft",
    ownerId,
    department: "marketing",
    priority: "normal",
    nextAction: "",
    nextActionAt: "",
    landingUrl: "",
    bookingUrl: "",
    trackingStatus: "not_set",
    primaryKpi: "",
    kpiTarget: "",
    approvalStatus: "not_requested",
    notes: "",
    audienceSegment: "",
    creativeMatrixRef: "",
    remarketingNotes: "",
    pixelRef: "",
    audienceIntent: "",
    adsCreative: "",
    landingNotes: "",
    trackingNotes: "",
    reportNotes: "",
    searchIntent: "",
    adCopy: "",
    audience: "",
    campaignMessaging: "",
    creativeNotes: "",
    offerPromotion: "",
    rateContext: "",
    roasTarget: "",
    bookingValueNotes: "",
    rateFeed: "",
    hotelAdsQuality: "",
    channelConsistency: "",
    bookingEngineNotes: "",
    landingContent: "",
    hotelValueProp: "",
    marketPartnerContext: "",
    leadFollowUp: "",
    budgetAuth: "",
    kpiReview: "",
    finalDecision: "",
    accountRef: "",
    budgetNote: "",
  };
}

export function draftFromCampaign(row: MetaCampaignListItem): CampaignDraft {
  return {
    id: row.id,
    name: row.name,
    hotelName: row.hotelName,
    channel: row.channel,
    objective: row.objective,
    market: row.market,
    language: row.language,
    startAt: toDateInput(row.startAt),
    endAt: toDateInput(row.endAt),
    budgetAmount: row.budgetMasked ? "" : row.budgetAmount,
    budgetPeriod: row.budgetPeriod,
    status: row.status,
    ownerId: row.ownerId,
    department: row.department,
    priority: row.priority,
    nextAction: row.nextAction,
    nextActionAt: toDateInput(row.nextActionAt),
    landingUrl: row.landingUrl,
    bookingUrl: row.bookingUrl,
    trackingStatus: row.trackingStatus,
    primaryKpi: row.primaryKpi,
    kpiTarget: row.kpiTarget,
    approvalStatus: row.approvalStatus,
    notes: row.notes,
    audienceSegment: row.audienceMasked ? "" : row.audienceSegment,
    creativeMatrixRef: row.creativeMatrixRef,
    remarketingNotes: row.remarketingNotes,
    pixelRef: row.pixelMasked ? "" : row.pixelRef,
    audienceIntent: row.audienceMasked ? "" : row.audienceIntent,
    adsCreative: row.adsCreative,
    landingNotes: row.landingNotes,
    trackingNotes: row.trackingNotes,
    reportNotes: row.reportNotes,
    searchIntent: row.audienceMasked ? "" : row.searchIntent,
    adCopy: row.adCopy,
    audience: row.audienceMasked ? "" : row.audience,
    campaignMessaging: row.campaignMessaging,
    creativeNotes: row.creativeNotes,
    offerPromotion: row.budgetMasked ? "" : row.offerPromotion,
    rateContext: row.budgetMasked ? "" : row.rateContext,
    roasTarget: row.budgetMasked ? "" : row.roasTarget,
    bookingValueNotes: row.budgetMasked ? "" : row.bookingValueNotes,
    rateFeed: row.rateFeed,
    hotelAdsQuality: row.hotelAdsQuality,
    channelConsistency: row.channelConsistency,
    bookingEngineNotes: row.bookingEngineNotes,
    landingContent: row.landingContent,
    hotelValueProp: row.hotelValueProp,
    marketPartnerContext: row.marketPartnerContext,
    leadFollowUp: row.leadFollowUp,
    budgetAuth: row.budgetAuth.includes("•") ? "" : row.budgetAuth,
    kpiReview: row.kpiReview,
    finalDecision: row.finalDecision.includes("•") ? "" : row.finalDecision,
    accountRef: row.accountMasked ? "" : row.accountRef,
    budgetNote: row.budgetMasked ? "" : row.budgetNote,
  };
}

function formatDate(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

export function MetaCampaignForm({
  draft,
  row,
  staff,
  access,
  pending,
  ok,
  error,
  onChange,
  onSave,
  onClose,
  onAddActivity,
  onDeleteActivity,
  onAddKpi,
  onDeleteKpi,
  onAddNote,
  onDeleteNote,
  subtaskDraft,
  subtaskComment,
  onSubtaskDraftChange,
  onSubtaskCommentChange,
  onSaveSubtask,
  onCompleteSubtask,
  onAddSubtaskComment,
  onAttachSubtaskFile,
  onPatchSubtask,
  onEscalate,
  onCloseCampaign,
  section = "campaigns",
}: {
  draft: CampaignDraft;
  row?: MetaCampaignListItem;
  staff: Staff[];
  access: MetaAccessView;
  section?: MetaSection;
  pending: boolean;
  ok: string;
  error: string;
  onChange: (draft: CampaignDraft) => void;
  onSave: () => void;
  onClose: () => void;
  onAddActivity: (input: { title: string; type: string; notes: string }) => void;
  onDeleteActivity: (id: string) => void;
  onAddKpi: (input: { period: string; metric: string; value: string; target: string; dataStatus: string }) => void;
  onDeleteKpi: (id: string) => void;
  onAddNote: (input: { kind: string; title: string; body: string; url: string }) => void;
  onDeleteNote: (id: string) => void;
  subtaskDraft: SubtaskDraft;
  subtaskComment: string;
  onSubtaskDraftChange: (draft: SubtaskDraft) => void;
  onSubtaskCommentChange: (value: string) => void;
  onSaveSubtask: () => void;
  onCompleteSubtask: (item: MetaSubtaskView, completed: boolean) => void;
  onAddSubtaskComment: (subtaskId: string) => void;
  onAttachSubtaskFile: (subtaskId: string, form: HTMLFormElement) => void;
  onPatchSubtask: (item: MetaSubtaskView, patch: Partial<SubtaskDraft>) => void;
  onEscalate: () => void;
  onCloseCampaign: () => void;
}) {
  const [tab, setTab] = useState<MetaFormTab>(metaSectionFormTab(section));
  const [activityTitle, setActivityTitle] = useState("");
  const [activityNotes, setActivityNotes] = useState("");
  const [activityType, setActivityType] = useState("optimisation");
  const [kpi, setKpi] = useState({ period: "", metric: "", value: "", target: "", dataStatus: "draft" });
  const [note, setNote] = useState({ kind: "note", title: "", body: "", url: "" });
  const patch = (next: Partial<CampaignDraft>) => onChange({ ...draft, ...next });
  const saveBar = <SaveBar pending={pending} ok={ok} error={error} onSave={onSave} saveLabel={draft.id ? "บันทึกแคมเปญ" : "สร้างแคมเปญ"} />;

  return (
    <div className="crm-modal ads-drawer" role="presentation">
      <button type="button" className="crm-modal-backdrop" aria-label="ปิดฟอร์ม" onClick={onClose} />
      <div className="crm-modal-panel crm-modal-panel-user" role="dialog" aria-modal="true" aria-labelledby="ads-campaign-title">
        <div className="crm-modal-head">
          <div>
            <p className="crm-modal-eyebrow">Campaign Operations</p>
            <h2 id="ads-campaign-title">{draft.id ? draft.name || "แก้ไขแคมเปญ" : "สร้างแคมเปญ"}</h2>
            {row ? (
              <p className="b2b-muted">
                {row.progress.countLabel} · {META_READINESS_LABEL[row.progress.readiness]}
              </p>
            ) : null}
          </div>
          <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={onClose}>
            ×
          </button>
        </div>
        {saveBar}
        <div className="ads-form-tabs" role="tablist" aria-label="ส่วนของแคมเปญ">
          {META_FORM_TABS.map((item) => (
            <button
              key={item}
              id={`ads-tab-${item}`}
              type="button"
              role="tab"
              aria-selected={tab === item}
              aria-controls="ads-campaign-panel"
              className={tab === item ? "is-active" : ""}
              onClick={() => setTab(item)}
            >
              {ADS_FORM_TAB_LABEL[item]}
            </button>
          ))}
        </div>
        <div id="ads-campaign-panel" role="tabpanel" aria-labelledby={`ads-tab-${tab}`}>
        {tab === "overview" ? (
          <div className="ads-form-panel">
            <Field label="Campaign name">
              <input className="crm-field" value={draft.name} onChange={(event) => patch({ name: event.target.value })} />
            </Field>
            <Field label="Hotel or property">
              <input className="crm-field" value={draft.hotelName} onChange={(event) => patch({ hotelName: event.target.value })} />
            </Field>
            <Field label="Campaign type">
              <select className="crm-select" value={draft.channel} onChange={(event) => patch({ channel: event.target.value as MetaChannel })}>
                {META_CHANNELS.map((item) => (
                  <option key={item} value={item}>
                    {META_SCENARIO_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Campaign objective">
              <input className="crm-field" value={draft.objective} onChange={(event) => patch({ objective: event.target.value })} />
            </Field>
            <Field label="Target market">
              <input className="crm-field" value={draft.market} onChange={(event) => patch({ market: event.target.value })} />
            </Field>
            <Field label="Language">
              <input className="crm-field" value={draft.language} onChange={(event) => patch({ language: event.target.value })} />
            </Field>
            {access.canSeeAudience ? (
              <Field label="Audience segment">
                <input className="crm-field" value={draft.audienceSegment} onChange={(event) => patch({ audienceSegment: event.target.value })} />
              </Field>
            ) : (
              <p className="b2b-muted">ข้อมูลออดิเอนซ์ถูกปกปิดตามสิทธิ์แผนก</p>
            )}
            <Field label="Creative matrix reference">
              <input className="crm-field" value={draft.creativeMatrixRef} onChange={(event) => patch({ creativeMatrixRef: event.target.value })} />
            </Field>
            <Field label="Start date">
              <input className="crm-field" type="date" value={draft.startAt} onChange={(event) => patch({ startAt: event.target.value })} />
            </Field>
            <Field label="End date">
              <input className="crm-field" type="date" value={draft.endAt} onChange={(event) => patch({ endAt: event.target.value })} />
            </Field>
            <Field label="Owner">
              <select className="crm-select" value={draft.ownerId} onChange={(event) => patch({ ownerId: event.target.value })}>
                <option value="">ยังไม่มอบหมาย</option>
                {staff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Department">
              <select className="crm-select" value={draft.department} onChange={(event) => patch({ department: event.target.value as MetaDepartment })}>
                {META_DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>
                    {ADS_DEPARTMENT_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select className="crm-select" value={draft.status} onChange={(event) => patch({ status: event.target.value as MetaStatus })}>
                {META_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {ADS_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <select className="crm-select" value={draft.priority} onChange={(event) => patch({ priority: event.target.value as MetaPriority })}>
                {META_PRIORITIES.map((item) => (
                  <option key={item} value={item}>
                    {ADS_PRIORITY_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Next action">
              <input className="crm-field" value={draft.nextAction} onChange={(event) => patch({ nextAction: event.target.value })} />
            </Field>
            <Field label="Next action date">
              <input className="crm-field" type="date" value={draft.nextActionAt} onChange={(event) => patch({ nextActionAt: event.target.value })} />
            </Field>
            <p className="b2b-muted">
              Created {row?.createdAt ? formatDate(row.createdAt) : "—"} · Updated {row?.updatedAt ? formatDate(row.updatedAt) : "—"}
            </p>
            <h3 className="meta-ops-panel-title">Department work</h3>
            <p className="b2b-muted">งานแยกตาม Marketing, Revenue, Distribution, Sales, Management</p>
            <MetaSubtasksPanel
              row={row}
              staff={staff}
              access={access}
              pending={pending}
              draft={subtaskDraft}
              comment={subtaskComment}
              onDraftChange={onSubtaskDraftChange}
              onCommentChange={onSubtaskCommentChange}
              onSave={onSaveSubtask}
              onComplete={onCompleteSubtask}
              onAddComment={onAddSubtaskComment}
              onAttach={onAttachSubtaskFile}
              onPatchSubtask={onPatchSubtask}
            />
          </div>
        ) : null}
        {tab === "audience" ? (
          <div className="ads-form-panel">
            <p className="b2b-muted">Marketing: {ADS_DEPARTMENT_DUTIES.marketing.join(" · ")}</p>
            <Field label="Campaign objective">
              <input className="crm-field" value={draft.objective} onChange={(event) => patch({ objective: event.target.value })} />
            </Field>
            {access.canSeeAudience ? (
              <>
                <Field label="Audience">
                  <input className="crm-field" value={draft.audienceSegment} onChange={(event) => patch({ audienceSegment: event.target.value })} />
                </Field>
                <Field label="Audience notes">
                  <textarea className="crm-area" rows={4} value={draft.audience} onChange={(event) => patch({ audience: event.target.value })} />
                </Field>
                <Field label="Targeting notes">
                  <textarea className="crm-area" rows={4} value={draft.searchIntent} onChange={(event) => patch({ searchIntent: event.target.value, audienceIntent: event.target.value })} />
                </Field>
              </>
            ) : (
              <p className="b2b-muted">ข้อมูลออดิเอนซ์และชื่อ segment ถูกปกปิดตามสิทธิ์แผนก</p>
            )}
            <Field label="Remarketing logic">
              <textarea className="crm-area" rows={4} value={draft.remarketingNotes} onChange={(event) => patch({ remarketingNotes: event.target.value })} />
            </Field>
          </div>
        ) : null}
        {tab === "creative" ? (
          <div className="ads-form-panel">
            <p className="b2b-muted">Marketing: Creative hook and format · Ad copy</p>
            <Field label="Creative matrix reference">
              <input className="crm-field" value={draft.creativeMatrixRef} onChange={(event) => patch({ creativeMatrixRef: event.target.value })} />
            </Field>
            <Field label="Creative hook and format">
              <textarea className="crm-area" rows={4} value={draft.campaignMessaging} onChange={(event) => patch({ campaignMessaging: event.target.value })} />
            </Field>
            <Field label="Ad copy">
              <textarea className="crm-area" rows={5} value={draft.adCopy} onChange={(event) => patch({ adCopy: event.target.value })} />
            </Field>
            <Field label="Creative notes">
              <textarea className="crm-area" rows={5} value={draft.creativeNotes} onChange={(event) => patch({ creativeNotes: event.target.value, adsCreative: event.target.value })} />
            </Field>
          </div>
        ) : null}
        {tab === "landing" ? (
          <div className="ads-form-panel">
            <p className="b2b-muted">Sales: {ADS_DEPARTMENT_DUTIES.sales.join(" · ")}</p>
            <p className="b2b-muted">Distribution: {ADS_DEPARTMENT_DUTIES.distribution.join(" · ")}</p>
            <Field label="Landing page URL">
              <input className="crm-field" value={draft.landingUrl} onChange={(event) => patch({ landingUrl: event.target.value })} />
            </Field>
            <Field label="Booking engine URL">
              <input className="crm-field" value={draft.bookingUrl} onChange={(event) => patch({ bookingUrl: event.target.value })} />
            </Field>
            <Field label="Landing page content">
              <textarea className="crm-area" rows={4} value={draft.landingContent} onChange={(event) => patch({ landingContent: event.target.value, landingNotes: event.target.value })} />
            </Field>
            <Field label="Hotel value proposition">
              <textarea className="crm-area" rows={3} value={draft.hotelValueProp} onChange={(event) => patch({ hotelValueProp: event.target.value })} />
            </Field>
            <Field label="Market/segment context">
              <textarea className="crm-area" rows={3} value={draft.marketPartnerContext} onChange={(event) => patch({ marketPartnerContext: event.target.value })} />
            </Field>
            <Field label="Lead follow-up">
              <textarea className="crm-area" rows={3} value={draft.leadFollowUp} onChange={(event) => patch({ leadFollowUp: event.target.value })} />
            </Field>
            <Field label="Rate and availability feed">
              <textarea className="crm-area" rows={3} value={draft.rateFeed} onChange={(event) => patch({ rateFeed: event.target.value })} />
            </Field>
            <Field label="Direct booking path">
              <textarea className="crm-area" rows={3} value={draft.hotelAdsQuality} onChange={(event) => patch({ hotelAdsQuality: event.target.value })} />
            </Field>
            <Field label="Channel consistency">
              <textarea className="crm-area" rows={3} value={draft.channelConsistency} onChange={(event) => patch({ channelConsistency: event.target.value })} />
            </Field>
            <Field label="Booking engine connection">
              <textarea className="crm-area" rows={3} value={draft.bookingEngineNotes} onChange={(event) => patch({ bookingEngineNotes: event.target.value })} />
            </Field>
          </div>
        ) : null}
        {tab === "budget" ? (
          <div className="ads-form-panel">
            {access.canSeeBudget ? (
              <>
                <Field label="Budget">
                  <input className="crm-field" value={draft.budgetAmount} onChange={(event) => patch({ budgetAmount: event.target.value })} />
                </Field>
                <Field label="Budget period">
                  <select className="crm-select" value={draft.budgetPeriod} onChange={(event) => patch({ budgetPeriod: event.target.value })}>
                    {META_BUDGET_PERIODS.map((item) => (
                      <option key={item} value={item}>
                        {ADS_BUDGET_PERIOD_LABEL[item]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Budget note">
                  <input className="crm-field" value={draft.budgetNote} onChange={(event) => patch({ budgetNote: event.target.value })} />
                </Field>
                <p className="b2b-muted">Revenue: {ADS_DEPARTMENT_DUTIES.revenue.join(" · ")}</p>
                <Field label="Offer and promotion">
                  <textarea className="crm-area" rows={3} value={draft.offerPromotion} onChange={(event) => patch({ offerPromotion: event.target.value })} />
                </Field>
                <Field label="Rate context">
                  <textarea className="crm-area" rows={3} value={draft.rateContext} onChange={(event) => patch({ rateContext: event.target.value })} />
                </Field>
                <Field label="ROAS target">
                  <input className="crm-field" value={draft.roasTarget} onChange={(event) => patch({ roasTarget: event.target.value })} />
                </Field>
                <Field label="Booking value interpretation">
                  <textarea className="crm-area" rows={3} value={draft.bookingValueNotes} onChange={(event) => patch({ bookingValueNotes: event.target.value })} />
                </Field>
              </>
            ) : (
              <p className="b2b-muted">ข้อมูลงบและ billing ถูกปกปิดตามสิทธิ์แผนก</p>
            )}
            <p className="b2b-muted">Management: {ADS_DEPARTMENT_DUTIES.management.join(" · ")}</p>
            <Field label="Approval status">
              <select className="crm-select" value={draft.approvalStatus} onChange={(event) => patch({ approvalStatus: event.target.value })}>
                {META_APPROVAL_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {ADS_APPROVAL_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            {access.canSeeAccounts ? (
              <Field label="Internal account reference" hint="รหัสอ้างอิงภายใน ไม่ใช่รหัสบัญชีลูกค้าสำหรับผู้ไม่มีสิทธิ์">
                <input className="crm-field" value={draft.accountRef} onChange={(event) => patch({ accountRef: event.target.value })} />
              </Field>
            ) : (
              <p className="b2b-muted">รหัสบัญชีลูกค้าถูกปกปิดตามสิทธิ์แผนก</p>
            )}
            {access.isManagement ? (
              <Field label="Budget authorization">
                <textarea className="crm-area" rows={3} value={draft.budgetAuth} onChange={(event) => patch({ budgetAuth: event.target.value })} />
              </Field>
            ) : (
              <p className="b2b-muted">การอนุมัติงบถูกจำกัดตามสิทธิ์ Management</p>
            )}
          </div>
        ) : null}
        {tab === "tracking" ? (
          <div className="ads-form-panel">
            <Field label="Tracking status">
              <select className="crm-select" value={draft.trackingStatus} onChange={(event) => patch({ trackingStatus: event.target.value })}>
                {META_TRACKING_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {META_TRACKING_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Primary KPI">
              <input className="crm-field" value={draft.primaryKpi} onChange={(event) => patch({ primaryKpi: event.target.value })} />
            </Field>
            <Field label="KPI target">
              <input className="crm-field" value={draft.kpiTarget} onChange={(event) => patch({ kpiTarget: event.target.value })} />
            </Field>
            {access.canSeeAccounts ? (
              <Field label="Pixel reference" hint="รหัส Pixel ภายใน แสดงเฉพาะผู้มีสิทธิ์บัญชีโฆษณา">
                <input className="crm-field" value={draft.pixelRef} onChange={(event) => patch({ pixelRef: event.target.value })} />
              </Field>
            ) : (
              <p className="b2b-muted">Pixel ID ถูกปกปิดตามสิทธิ์แผนก</p>
            )}
            <Field label="Tracking and conversions notes">
              <textarea className="crm-area" rows={6} value={draft.trackingNotes} onChange={(event) => patch({ trackingNotes: event.target.value })} />
            </Field>
          </div>
        ) : null}
        {tab === "remarketing" ? (
          <div className="ads-form-panel">
            <Field label="Campaign type">
              <select className="crm-select" value={draft.channel} onChange={(event) => patch({ channel: event.target.value as MetaChannel })}>
                {META_CHANNELS.map((item) => (
                  <option key={item} value={item}>
                    {META_SCENARIO_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            {access.canSeeAudience ? (
              <Field label="Audience segment">
                <input className="crm-field" value={draft.audienceSegment} onChange={(event) => patch({ audienceSegment: event.target.value })} />
              </Field>
            ) : (
              <p className="b2b-muted">ข้อมูลออดิเอนซ์ถูกปกปิดตามสิทธิ์แผนก</p>
            )}
            <Field label="Remarketing logic">
              <textarea className="crm-area" rows={6} value={draft.remarketingNotes} onChange={(event) => patch({ remarketingNotes: event.target.value })} />
            </Field>
            <Field label="Landing page URL">
              <input className="crm-field" value={draft.landingUrl} onChange={(event) => patch({ landingUrl: event.target.value })} />
            </Field>
            <Field label="Booking engine URL">
              <input className="crm-field" value={draft.bookingUrl} onChange={(event) => patch({ bookingUrl: event.target.value })} />
            </Field>
          </div>
        ) : null}
        {tab === "optimization" ? (
          <div className="ads-form-panel">
            <div className="ads-form-list">
              {(row?.activities ?? []).map((item) => (
                <article key={item.id}>
                  <strong>
                    {ADS_ACTIVITY_TYPE_LABEL[item.type]} · {item.title}
                  </strong>
                  <p>
                    {ADS_ACTIVITY_STATUS_LABEL[item.status]}
                    {item.dueAt ? ` · ${formatDate(item.dueAt)}` : ""} · {item.ownerName || "—"}
                  </p>
                  {item.notes ? <p>{item.notes}</p> : null}
                  {access.canEditActivities ? (
                    <button type="button" className="crm-users-secondary" onClick={() => onDeleteActivity(item.id)}>
                      ลบ
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
            {access.canEditActivities && draft.id ? (
              <>
                <Field label="Log type">
                  <select className="crm-select" value={activityType} onChange={(event) => setActivityType(event.target.value)}>
                    {META_ACTIVITY_TYPES.map((item) => (
                      <option key={item} value={item}>
                        {ADS_ACTIVITY_TYPE_LABEL[item]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Title">
                  <input className="crm-field" value={activityTitle} onChange={(event) => setActivityTitle(event.target.value)} />
                </Field>
                <Field label="Notes">
                  <textarea className="crm-area" rows={3} value={activityNotes} onChange={(event) => setActivityNotes(event.target.value)} />
                </Field>
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() => {
                    onAddActivity({ title: activityTitle, type: activityType, notes: activityNotes });
                    setActivityTitle("");
                    setActivityNotes("");
                  }}
                >
                  เพิ่ม Optimization Log
                </button>
              </>
            ) : (
              <p className="b2b-muted">บันทึกแคมเปญก่อนจึงจะเพิ่มประวัติได้</p>
            )}
          </div>
        ) : null}
        {tab === "reports" ? (
          <div className="ads-form-panel">
            <Field label="Primary KPI">
              <input className="crm-field" value={draft.primaryKpi} onChange={(event) => patch({ primaryKpi: event.target.value })} />
            </Field>
            <Field label="KPI target">
              <input className="crm-field" value={draft.kpiTarget} onChange={(event) => patch({ kpiTarget: event.target.value })} />
            </Field>
            <Field label="Report notes">
              <textarea className="crm-area" rows={4} value={draft.reportNotes} onChange={(event) => patch({ reportNotes: event.target.value })} />
            </Field>
            <Field label="KPI review">
              <textarea className="crm-area" rows={3} value={draft.kpiReview} onChange={(event) => patch({ kpiReview: event.target.value })} />
            </Field>
            {access.isManagement ? (
              <Field label="Final decision">
                <textarea className="crm-area" rows={3} value={draft.finalDecision} onChange={(event) => patch({ finalDecision: event.target.value })} />
              </Field>
            ) : (
              <p className="b2b-muted">Final decision จำกัดเฉพาะ Management</p>
            )}
            <div className="ads-form-list">
              {(row?.kpis ?? []).map((item) => (
                <article key={item.id}>
                  <strong>{item.metric}</strong>
                  <p>
                    {item.period || "—"} · {item.value || "—"} / {item.target || "—"} · {META_KPI_DATA_STATUS_LABEL[item.dataStatus]}
                  </p>
                  {access.canEditBoard ? (
                    <button type="button" className="crm-users-secondary" onClick={() => onDeleteKpi(item.id)}>
                      ลบ
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
            {access.canEditBoard && draft.id ? (
              <>
                <Field label="Period">
                  <input className="crm-field" value={kpi.period} onChange={(event) => setKpi({ ...kpi, period: event.target.value })} />
                </Field>
                <Field label="Metric">
                  <input className="crm-field" value={kpi.metric} onChange={(event) => setKpi({ ...kpi, metric: event.target.value })} />
                </Field>
                <Field label="Value">
                  <input className="crm-field" value={kpi.value} onChange={(event) => setKpi({ ...kpi, value: event.target.value })} />
                </Field>
                <Field label="Target">
                  <input className="crm-field" value={kpi.target} onChange={(event) => setKpi({ ...kpi, target: event.target.value })} />
                </Field>
                <Field label="Data status">
                  <select className="crm-select" value={kpi.dataStatus} onChange={(event) => setKpi({ ...kpi, dataStatus: event.target.value })}>
                    {META_KPI_DATA_STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {META_KPI_DATA_STATUS_LABEL[item]}
                      </option>
                    ))}
                  </select>
                </Field>
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() => {
                    onAddKpi(kpi);
                    setKpi({ period: "", metric: "", value: "", target: "", dataStatus: "draft" });
                  }}
                >
                  เพิ่ม KPI
                </button>
              </>
            ) : null}
          </div>
        ) : null}
        {tab === "files" ? (
          <div className="ads-form-panel">
            <Field label="Notes">
              <textarea className="crm-area" rows={4} value={draft.notes} onChange={(event) => patch({ notes: event.target.value })} />
            </Field>
            <div className="ads-form-list">
              {(row?.files ?? []).map((item) => (
                <article key={item.id}>
                  <strong>
                    {item.kind === "file" ? "File" : "Note"} · {item.title}
                  </strong>
                  {item.body ? <p>{item.body}</p> : null}
                  {item.url ? <p>{item.url}</p> : null}
                  <p>
                    {item.createdByName || "—"} · {formatDate(item.createdAt)}
                  </p>
                  {access.canEditBoard ? (
                    <button type="button" className="crm-users-secondary" onClick={() => onDeleteNote(item.id)}>
                      ลบ
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
            {access.canEditBoard && draft.id ? (
              <>
                <Field label="Kind">
                  <select className="crm-select" value={note.kind} onChange={(event) => setNote({ ...note, kind: event.target.value })}>
                    <option value="note">Note</option>
                    <option value="file">File reference</option>
                  </select>
                </Field>
                <Field label="Title">
                  <input className="crm-field" value={note.title} onChange={(event) => setNote({ ...note, title: event.target.value })} />
                </Field>
                <Field label="Detail">
                  <textarea className="crm-area" rows={3} value={note.body} onChange={(event) => setNote({ ...note, body: event.target.value })} />
                </Field>
                <Field label="File URL or path" hint="อ้างอิงไฟล์ด้วยตนเอง ไม่มีการนำเข้าข้อมูล">
                  <input className="crm-field" value={note.url} onChange={(event) => setNote({ ...note, url: event.target.value })} />
                </Field>
                <button
                  type="button"
                  className="crm-users-secondary"
                  onClick={() => {
                    onAddNote(note);
                    setNote({ kind: "note", title: "", body: "", url: "" });
                  }}
                >
                  เพิ่มไฟล์หรือโน้ต
                </button>
              </>
            ) : null}
          </div>
        ) : null}
        {tab === "audit" ? (
          <div className="ads-form-list">
            {(row?.audit ?? []).length ? (
              row?.audit.map((item) => (
                <article key={item.id}>
                  <strong>{item.action}</strong>
                  <p>{item.detail}</p>
                  <p>
                    {item.createdByName || "—"} · {formatDate(item.createdAt)}
                  </p>
                </article>
              ))
            ) : (
              <p className="b2b-muted">ยังไม่มีประวัติการแก้ไข</p>
            )}
          </div>
        ) : null}
        </div>
        {saveBar}
        {draft.id && access.canEditBoard ? (
          <div className="ads-form-actions">
            <button type="button" className="crm-users-secondary" onClick={onClose}>
              ปิด
            </button>
            <button type="button" className="crm-users-secondary" onClick={onEscalate} disabled={pending}>
              Escalate
            </button>
            <button type="button" className="crm-users-secondary" onClick={onCloseCampaign} disabled={pending}>
              Close campaign
            </button>
          </div>
        ) : (
          <div className="ads-form-actions">
            <button type="button" className="crm-users-secondary" onClick={onClose}>
              ปิด
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
