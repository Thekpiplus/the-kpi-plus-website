"use client";

import Link from "next/link";
import { Fragment, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  assignLeadOwner,
  changeLeadStage,
  scheduleActivity,
  setLeadArchiveQuiet,
  updateLead,
  addNoteFromForm,
} from "@/lib/crm/actions";
import {
  formatLeadDay,
  formatLeadValue,
  formatLeadWhen,
  stageToneClass,
  type LeadAllArchiveView,
  type LeadAllOwnerOption,
  type LeadAllRow,
  type LeadAllSort,
  type LeadAllStageOption,
  type LeadAllStatFilter,
} from "@/components/crm/leads/lead-all-types";
import "./lead-all-a.css";

function hrefLeads(next: {
  q?: string;
  origin?: string;
  stageId?: string;
  ownerId?: string;
  archive?: LeadAllArchiveView;
  sort?: LeadAllSort;
  stat?: LeadAllStatFilter;
  view?: "channel" | "pending" | "";
  source?: string;
  scope?: string;
  reason?: string;
}) {
  const params = new URLSearchParams();
  if (next.view === "channel") {
    params.set("view", "channel");
    if (next.source) params.set("source", next.source);
  } else if (next.view === "pending") {
    params.set("view", "pending");
    if (next.scope && next.scope !== "all") params.set("scope", next.scope);
    if (next.reason) params.set("reason", next.reason);
  } else if (next.origin) {
    params.set("origin", next.origin);
  }
  if (next.q?.trim()) params.set("q", next.q.trim());
  if (next.stageId) params.set("stageId", next.stageId);
  if (next.ownerId) params.set("ownerId", next.ownerId);
  if (next.view !== "pending" && next.archive && next.archive !== "active") {
    params.set("archive", next.archive);
  }
  if (next.sort && next.sort !== "urgent") params.set("sort", next.sort);
  if (next.view !== "pending" && next.stat && next.stat !== "all") params.set("stat", next.stat);
  const value = params.toString();
  return value ? `/crm/leads?${value}` : "/crm/leads";
}

function IconAlert() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 9v4m0 4h.01M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LeadAllWorkspace({
  leads: initialLeads,
  stages,
  owners,
  counts,
  kpi,
  q: initialQ,
  origin: initialOrigin,
  stageId: initialStageId,
  ownerId: initialOwnerId,
  archive,
  sort: initialSort,
  stat: initialStat,
  lockedOrigin = false,
  channelView = false,
  lockedSource = "",
  lockedSourceLabel = "",
  leaveChannelHref = "/crm/leads?view=channel",
  listHeading = "รายชื่อลีด",
  hideKpi = false,
  pendingView = false,
  pendingScope = "all",
  pendingReason = "",
  pendingReasonLabel = "",
  pendingScopeLabel = "",
  clearReasonHref = "",
}: {
  leads: LeadAllRow[];
  stages: LeadAllStageOption[];
  owners: LeadAllOwnerOption[];
  counts: { active: number; archived: number; all: number };
  kpi: { overdue: number; dueToday: number; awaiting: number; new: number };
  q: string;
  origin: "" | "web" | "manual";
  stageId: string;
  ownerId: string;
  archive: LeadAllArchiveView;
  sort: LeadAllSort;
  stat: LeadAllStatFilter;
  lockedOrigin?: boolean;
  /** Channel breakdown mode (`?view=channel`). */
  channelView?: boolean;
  /** Concrete CRM source key when a channel card is selected. */
  lockedSource?: string;
  lockedSourceLabel?: string;
  leaveChannelHref?: string;
  listHeading?: string;
  /** Hide system KPI cards (pending worklist uses reason cards instead). */
  hideKpi?: boolean;
  pendingView?: boolean;
  pendingScope?: string;
  pendingReason?: string;
  pendingReasonLabel?: string;
  pendingScopeLabel?: string;
  clearReasonHref?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQ);
  const [origin, setOrigin] = useState(initialOrigin);
  const [stageId, setStageId] = useState(initialStageId);
  const [ownerId, setOwnerId] = useState(initialOwnerId);
  const [sort, setSort] = useState(initialSort);
  const [stat, setStat] = useState(initialStat);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bulkStageId, setBulkStageId] = useState("");
  const [bulkOwnerId, setBulkOwnerId] = useState("");

  useEffect(() => {
    setQuery(initialQ);
    setOrigin(initialOrigin);
    setStageId(initialStageId);
    setOwnerId(initialOwnerId);
    setSort(initialSort);
    setStat(initialStat);
    setSelected([]);
  }, [initialQ, initialOrigin, initialStageId, initialOwnerId, initialSort, initialStat, archive, lockedSource]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (query.trim() === initialQ.trim()) return;
      pushState({ q: query });
    }, 300);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce search only
  }, [query]);

  const scopedLeads = useMemo(() => {
    if (lockedSource) return initialLeads.filter((lead) => lead.source === lockedSource);
    if (channelView) return initialLeads;
    return initialLeads;
  }, [channelView, initialLeads, lockedSource]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let rows = scopedLeads.filter((lead) => {
      if (!channelView && !lockedSource) {
        if (origin === "web" && lead.origin !== "web") return false;
        if (origin === "manual" && lead.origin !== "manual") return false;
      }
      if (stageId && lead.stageId !== stageId) return false;
      if (ownerId && lead.ownerId !== ownerId) return false;
      if (stat !== "all") {
        if (stat === "overdue" && lead.status !== "overdue") return false;
        if (stat === "dueToday" && lead.status !== "dueToday") return false;
        if (stat === "awaiting" && lead.status !== "awaiting") return false;
        if (stat === "new" && lead.status !== "new") return false;
      }
      if (!needle) return true;
      const hay = `${lead.contactName} ${lead.businessName} ${lead.phone} ${lead.email} ${lead.sourceLabel} ${lead.services.join(" ")} ${lead.id}`.toLowerCase();
      return hay.includes(needle);
    });

    rows = [...rows].sort((a, b) => {
      if (sort === "value") {
        return (b.estimatedValue ?? 0) - (a.estimatedValue ?? 0);
      }
      if (sort === "updated") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      const rank = (lead: LeadAllRow) => {
        if (lead.status === "overdue") return 0;
        if (lead.status === "dueToday") return 1;
        if (lead.status === "awaiting") return 2;
        if (lead.status === "new") return 3;
        const due = lead.nextActivityAt ? new Date(lead.nextActivityAt).getTime() : Number.POSITIVE_INFINITY;
        return 10 + due / 1e13;
      };
      const diff = rank(a) - rank(b);
      if (diff !== 0) return diff;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return rows;
  }, [channelView, lockedSource, origin, ownerId, query, scopedLeads, sort, stageId, stat]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const allVisibleSelected =
    filtered.length > 0 && filtered.every((lead) => selectedSet.has(lead.id));

  function pushState(patch: Partial<{
    q: string;
    origin: "" | "web" | "manual";
    stageId: string;
    ownerId: string;
    archive: LeadAllArchiveView;
    sort: LeadAllSort;
    stat: LeadAllStatFilter;
  }>) {
    const next = {
      q: patch.q ?? query,
      origin: lockedOrigin || channelView ? initialOrigin : (patch.origin ?? origin),
      stageId: patch.stageId ?? stageId,
      ownerId: patch.ownerId ?? ownerId,
      archive: patch.archive ?? archive,
      sort: patch.sort ?? sort,
      stat: patch.stat ?? stat,
    };
    if (patch.origin !== undefined && !channelView && !lockedOrigin) setOrigin(next.origin);
    if (patch.stageId !== undefined) setStageId(next.stageId);
    if (patch.ownerId !== undefined) setOwnerId(next.ownerId);
    if (patch.sort !== undefined) setSort(next.sort);
    if (patch.stat !== undefined) setStat(next.stat);
    router.push(
      hrefLeads({
        q: next.q,
        origin: channelView || pendingView ? undefined : next.origin || undefined,
        stageId: next.stageId || undefined,
        ownerId: next.ownerId || undefined,
        archive: pendingView ? "active" : next.archive,
        sort: next.sort,
        stat: pendingView ? "all" : next.stat,
        view: pendingView ? "pending" : channelView ? "channel" : "",
        source: channelView ? lockedSource || undefined : undefined,
        scope: pendingView ? pendingScope : undefined,
        reason: pendingView ? pendingReason || undefined : undefined,
      }),
    );
  }

  function clearFilters() {
    setQuery("");
    setOrigin(lockedOrigin || channelView || pendingView ? initialOrigin : "");
    setStageId("");
    setOwnerId("");
    setSort("urgent");
    setStat("all");
    router.push(
      hrefLeads({
        origin: channelView || pendingView ? undefined : lockedOrigin ? initialOrigin || undefined : undefined,
        archive: pendingView ? "active" : archive,
        view: pendingView ? "pending" : channelView ? "channel" : "",
        source: channelView ? lockedSource || undefined : undefined,
        scope: pendingView ? pendingScope : undefined,
        reason: pendingView ? pendingReason || undefined : undefined,
      }),
    );
  }

  function clearSearchAndArchive() {
    setQuery("");
    setStat("all");
    router.push(
      hrefLeads({
        origin: channelView || pendingView ? undefined : lockedOrigin ? initialOrigin || undefined : undefined,
        stageId: stageId || undefined,
        ownerId: ownerId || undefined,
        sort,
        archive: pendingView ? "active" : archive,
        view: pendingView ? "pending" : channelView ? "channel" : "",
        source: channelView ? lockedSource || undefined : undefined,
        scope: pendingView ? pendingScope : undefined,
        reason: pendingView ? pendingReason || undefined : undefined,
      }),
    );
  }

  function toggleSelect(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelected((prev) => prev.filter((id) => !filtered.some((lead) => lead.id === id)));
      return;
    }
    setSelected((prev) => Array.from(new Set([...prev, ...filtered.map((lead) => lead.id)])));
  }

  function nextStageFor(lead: LeadAllRow) {
    const current = stages.find((stage) => stage.id === lead.stageId);
    if (!current || current.isWon || current.isLost) return null;
    const candidates = stages
      .filter((stage) => !stage.isLost && stage.sortOrder > current.sortOrder)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return candidates[0] ?? null;
  }

  function runAction(label: string, work: () => Promise<void>) {
    setError(null);
    startTransition(() => {
      void (async () => {
        try {
          await work();
          setNotice(label);
          router.refresh();
        } catch {
          setError("บันทึกไม่สำเร็จ ลองอีกครั้ง");
        }
      })();
    });
  }

  function advanceLead(lead: LeadAllRow) {
    const next = nextStageFor(lead);
    if (!next) return;
    const fd = new FormData();
    fd.set("leadId", lead.id);
    fd.set("stageId", next.id);
    runAction(`เลื่อนขั้น “${lead.contactName}” → ${next.nameTh}`, async () => {
      await changeLeadStage(fd);
    });
  }

  function moveLead(leadId: string, nextStageId: string, contactName: string) {
    if (!nextStageId) return;
    const stage = stages.find((item) => item.id === nextStageId);
    const fd = new FormData();
    fd.set("leadId", leadId);
    fd.set("stageId", nextStageId);
    runAction(`ย้ายขั้น “${contactName}” → ${stage?.nameTh ?? "ขั้นใหม่"}`, async () => {
      await changeLeadStage(fd);
    });
  }

  function assignLead(leadId: string, nextOwnerId: string, contactName: string) {
    const fd = new FormData();
    fd.set("leadId", leadId);
    fd.set("ownerId", nextOwnerId);
    const ownerName = owners.find((item) => item.id === nextOwnerId)?.name;
    runAction(
      nextOwnerId ? `มอบหมาย “${contactName}” ให้ ${ownerName}` : `เอาผู้ดูแลออกจาก “${contactName}”`,
      async () => {
        await assignLeadOwner(fd);
      },
    );
  }

  function archiveLead(leadId: string, archived: boolean, contactName: string) {
    const fd = new FormData();
    fd.set("leadId", leadId);
    fd.set("archived", archived ? "1" : "0");
    runAction(
      archived ? `เก็บ “${contactName}” ออกจากรายการหลักแล้ว` : `คืนค่า “${contactName}” แล้ว`,
      async () => {
        await setLeadArchiveQuiet(fd);
      },
    );
    setConfirmDeleteId(null);
    setOpenId(null);
  }

  function saveEdit(lead: LeadAllRow, formData: FormData) {
    formData.set("leadId", lead.id);
    formData.set("businessName", lead.businessName);
    formData.set("businessType", lead.businessType);
    formData.set("email", lead.email);
    formData.set("location", lead.location);
    formData.set("website", lead.website);
    formData.set("ownerId", lead.ownerId ?? "");
    formData.set("message", lead.message);
    for (const service of lead.services) {
      formData.append("services", service);
    }
    runAction(`อัปเดตข้อมูล “${lead.contactName}” แล้ว`, async () => {
      await updateLead(formData);
      setEditingId(null);
    });
  }

  function saveFollowUp(lead: LeadAllRow, formData: FormData) {
    const note = String(formData.get("note") ?? "").trim();
    const nextDate = String(formData.get("nextDate") ?? "");
    const nextTime = String(formData.get("nextTime") ?? "09:00");
    const title = String(formData.get("nextTitle") ?? "ติดตามผล").trim() || "ติดตามผล";

    runAction(`บันทึกผลการติดต่อ “${lead.contactName}” แล้ว`, async () => {
      if (note) {
        const noteFd = new FormData();
        noteFd.set("leadId", lead.id);
        noteFd.set("note", note);
        await addNoteFromForm(noteFd);
      }
      if (nextDate) {
        const actFd = new FormData();
        actFd.set("leadId", lead.id);
        actFd.set("type", "call");
        actFd.set("title", title);
        actFd.set("dueAt", new Date(`${nextDate}T${nextTime || "09:00"}:00`).toISOString());
        actFd.set("notes", note);
        await scheduleActivity(actFd);
      }
    });
  }

  function bulkArchive() {
    const ids = [...selected];
    if (!ids.length) return;
    runAction(`เก็บ ${ids.length} รายการแล้ว`, async () => {
      for (const id of ids) {
        const fd = new FormData();
        fd.set("leadId", id);
        fd.set("archived", "1");
        await setLeadArchiveQuiet(fd);
      }
      setSelected([]);
    });
  }

  function bulkAssign() {
    const ids = [...selected];
    if (!ids.length || !bulkOwnerId) return;
    const ownerName = owners.find((item) => item.id === bulkOwnerId)?.name ?? "ผู้ดูแล";
    runAction(`มอบหมาย ${ids.length} รายการให้ ${ownerName}`, async () => {
      for (const id of ids) {
        const fd = new FormData();
        fd.set("leadId", id);
        fd.set("ownerId", bulkOwnerId);
        await assignLeadOwner(fd);
      }
      setSelected([]);
      setBulkOwnerId("");
    });
  }

  function bulkMove() {
    const ids = [...selected];
    if (!ids.length || !bulkStageId) return;
    const stageName = stages.find((item) => item.id === bulkStageId)?.nameTh ?? "ขั้นใหม่";
    runAction(`ย้าย ${ids.length} รายการไปขั้น ${stageName}`, async () => {
      for (const id of ids) {
        const fd = new FormData();
        fd.set("leadId", id);
        fd.set("stageId", bulkStageId);
        await changeLeadStage(fd);
      }
      setSelected([]);
      setBulkStageId("");
    });
  }

  const hasExtraFilters = Boolean(
    query.trim() ||
      (!lockedOrigin && !channelView && !pendingView && origin) ||
      stageId ||
      ownerId ||
      sort !== "urgent" ||
      (!pendingView && stat !== "all"),
  );

  const emptyBecauseSearch = Boolean(query.trim() || stat !== "all" || stageId || ownerId);

  function renderInline(lead: LeadAllRow) {
    const next = nextStageFor(lead);
    const archived = Boolean(lead.archivedAt);
    return (
      <div className="kpi-lead-all-inline">
        <div className="kpi-lead-all-inline-card">
          <h3>รายละเอียดลีด</h3>
          <dl className="kpi-lead-all-dl">
            <div>
              <dt>รหัส</dt>
              <dd>{lead.id.slice(0, 10)}…</dd>
            </div>
            <div>
              <dt>ช่องทาง</dt>
              <dd>{lead.sourceLabel}</dd>
            </div>
            <div>
              <dt>ติดต่อล่าสุด</dt>
              <dd>{formatLeadWhen(lead.lastContactAt)}</dd>
            </div>
            <div>
              <dt>ขอบเขตงาน</dt>
              <dd>{lead.services.length ? lead.services.join(", ") : lead.businessType || "—"}</dd>
            </div>
          </dl>

          <div className="kpi-lead-all-inline-actions">
            <h3>การดำเนินการลีด</h3>
            <label className="kpi-lead-all-field">
              ย้ายขั้น
              <select
                defaultValue={lead.stageId}
                disabled={pending || archived}
                onChange={(event) => moveLead(lead.id, event.target.value, lead.contactName)}
              >
                {stages
                  .filter((stage) => !stage.isLost || stage.id === lead.stageId)
                  .map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.nameTh}
                    </option>
                  ))}
              </select>
            </label>
            <label className="kpi-lead-all-field">
              มอบหมายให้
              <select
                defaultValue={lead.ownerId ?? ""}
                disabled={pending || archived}
                onChange={(event) => assignLead(lead.id, event.target.value, lead.contactName)}
              >
                <option value="">ยังไม่กำหนด</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="kpi-lead-all-inline-btns">
              <button
                type="button"
                className="kpi-leads-btn-secondary"
                disabled={!next || pending || archived}
                onClick={() => advanceLead(lead)}
              >
                เลื่อนขั้นถัดไป
              </button>
              <button
                type="button"
                className="kpi-leads-btn-secondary"
                aria-expanded={editingId === lead.id}
                onClick={() => setEditingId(editingId === lead.id ? null : lead.id)}
              >
                {editingId === lead.id ? "ปิดฟอร์มแก้ไข" : "แก้ไขข้อมูลสั้น"}
              </button>
              <Link href={`/crm/leads/${lead.id}`} className="kpi-leads-btn-secondary">
                เปิดหน้ารายละเอียด
              </Link>
            </div>

            {editingId === lead.id ? (
              <form
                className="kpi-lead-all-edit-grid"
                onSubmit={(event) => {
                  event.preventDefault();
                  saveEdit(lead, new FormData(event.currentTarget));
                }}
              >
                <label className="kpi-lead-all-field">
                  ผู้ติดต่อ
                  <input name="contactName" defaultValue={lead.contactName} required />
                </label>
                <label className="kpi-lead-all-field">
                  เบอร์โทร
                  <input name="phone" defaultValue={lead.phone} />
                </label>
                <label className="kpi-lead-all-field">
                  มูลค่าโดยประมาณ
                  <input
                    name="estimatedValue"
                    type="number"
                    min={0}
                    step={1000}
                    defaultValue={lead.estimatedValue && lead.estimatedValue > 0 ? lead.estimatedValue : ""}
                    placeholder="ว่าง = ยังไม่ประเมิน"
                  />
                </label>
                <div className="kpi-lead-all-inline-btns">
                  <button type="submit" className="kpi-leads-btn-primary" disabled={pending}>
                    บันทึกแก้ไข
                  </button>
                  <button
                    type="button"
                    className="kpi-leads-btn-secondary"
                    onClick={() => setEditingId(null)}
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>

        <div className="kpi-lead-all-inline-card">
          <h3>บันทึกผลการติดต่อ</h3>
          <form
            className="kpi-lead-all-edit-grid"
            onSubmit={(event) => {
              event.preventDefault();
              saveFollowUp(lead, new FormData(event.currentTarget));
              event.currentTarget.reset();
            }}
          >
            <label className="kpi-lead-all-field">
              หมายเหตุสั้น ๆ
              <textarea name="note" rows={2} placeholder="สรุปสาย/แชท" disabled={archived || pending} />
            </label>
            <label className="kpi-lead-all-field">
              นัดครั้งถัดไป
              <input name="nextDate" type="date" disabled={archived || pending} />
            </label>
            <label className="kpi-lead-all-field">
              เวลา
              <input name="nextTime" type="time" defaultValue="09:00" disabled={archived || pending} />
            </label>
            <label className="kpi-lead-all-field">
              ชื่อนัด
              <input name="nextTitle" defaultValue="ติดตามผล" disabled={archived || pending} />
            </label>
            <div className="kpi-lead-all-inline-btns">
              <button type="submit" className="kpi-leads-btn-primary" disabled={archived || pending}>
                บันทึกผล
              </button>
            </div>
          </form>

          <div className="kpi-lead-all-danger-zone">
            <h3>เก็บ / คืนค่า</h3>
            {archived ? (
              <button
                type="button"
                className="kpi-leads-btn-secondary"
                disabled={pending}
                onClick={() => archiveLead(lead.id, false, lead.contactName)}
              >
                คืนค่าลีดนี้
              </button>
            ) : (
              <button
                type="button"
                className="kpi-leads-btn-secondary"
                disabled={pending}
                onClick={() => archiveLead(lead.id, true, lead.contactName)}
              >
                เก็บออกจากรายการหลัก
              </button>
            )}

            {!archived ? (
              confirmDeleteId === lead.id ? (
                <div className="kpi-lead-all-confirm" role="status">
                  <p>
                    ยืนยันอีกครั้ง: เก็บ “{lead.contactName}” ออกจากรายการหลัก?
                    เรียกคืนได้จากแท็บเก็บแล้ว
                  </p>
                  <div className="kpi-lead-all-inline-btns">
                    <button
                      type="button"
                      className="kpi-leads-btn-danger"
                      disabled={pending}
                      onClick={() => archiveLead(lead.id, true, lead.contactName)}
                    >
                      ยืนยันเก็บ/ลบออกจากรายการ
                    </button>
                    <button
                      type="button"
                      className="kpi-leads-btn-secondary"
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="kpi-leads-btn-danger"
                  disabled={pending}
                  onClick={() => setConfirmDeleteId(lead.id)}
                >
                  ลบออกจากรายการหลัก…
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  function rowMeta(lead: LeadAllRow) {
    const stage = stages.find((item) => item.id === lead.stageId);
    const tone = stage
      ? stageToneClass(stage)
      : stageToneClass({ sortOrder: lead.stageIndex, isWon: lead.isWon, isLost: lead.isLost });
    const overdue = lead.status === "overdue";
    return { stage, tone, overdue };
  }

  return (
    <div className={`kpi-lead-all${pending ? " is-pending" : ""}`}>
      {(notice || error) && (
        <div
          className={`kpi-lead-all-notice${error ? " is-error" : ""}`}
          role={error ? "alert" : "status"}
          aria-live="polite"
        >
          {error || notice}
        </div>
      )}

      {!hideKpi ? (
        <section className="kpi-lead-all-stats" aria-label="สถิติลีด — คลิกเพื่อกรอง">
          {(
            [
              { id: "overdue" as const, label: "เกินกำหนด", value: kpi.overdue, hint: "นัดติดต่อค้าง", tone: "rose" },
              { id: "dueToday" as const, label: "ถึงกำหนดวันนี้", value: kpi.dueToday, hint: "ต้องติดตามวันนี้", tone: "amber" },
              { id: "awaiting" as const, label: "รอตอบกลับ", value: kpi.awaiting, hint: "ยังไม่มีนัดถัดไป", tone: "sky" },
              { id: "new" as const, label: "ลีดใหม่", value: kpi.new, hint: "ขั้นแรกของ Pipeline", tone: "lime" },
            ] as const
          ).map((item) => {
            const active = stat === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`kpi-lead-all-stat is-${item.tone}${active ? " is-active" : ""}`}
                aria-pressed={active}
                onClick={() => pushState({ stat: active ? "all" : item.id })}
              >
                <span className="kpi-lead-all-stat-label">{item.label}</span>
                <strong className="kpi-lead-all-stat-value">{item.value}</strong>
                <span className="kpi-lead-all-stat-hint">
                  {active ? "กำลังกรองด้วยค่านี้" : item.hint}
                </span>
              </button>
            );
          })}
        </section>
      ) : null}

      <section className="kpi-lead-all-panel" aria-labelledby="kpi-lead-all-list-heading">
        <div className="kpi-lead-all-panel-head">
          <div>
            <h2 id="kpi-lead-all-list-heading">{listHeading}</h2>
            <p>ค้นหาและกรองทันที · ไม่ต้องกดปุ่มกรอง</p>
          </div>
          <label className="kpi-lead-all-search">
            <span className="sr-only">ค้นหาลีด</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ชื่อ กิจการ เบอร์ หรืออีเมล"
              autoComplete="off"
            />
          </label>
        </div>

        {!pendingView ? (
          <div className="kpi-lead-all-chips" role="group" aria-label="สถานะการเก็บลีด">
            {(
              [
                { id: "active" as const, label: "ใช้งานอยู่", count: counts.active },
                { id: "archived" as const, label: "เก็บแล้ว", count: counts.archived },
                { id: "all" as const, label: "ทั้งหมด", count: counts.all },
              ] as const
            ).map((chip) => (
              <button
                key={chip.id}
                type="button"
                className={`kpi-lead-all-chip${archive === chip.id ? " is-active" : ""}`}
                aria-pressed={archive === chip.id}
                onClick={() => pushState({ archive: chip.id })}
              >
                {chip.label} <strong>{chip.count}</strong>
              </button>
            ))}
          </div>
        ) : (
          <div className="kpi-lead-all-chips" role="group" aria-label="ตัวกรองงานค้าง">
            {pendingScopeLabel ? (
              <span className="kpi-lead-all-source-pill">
                <em>ขอบเขต:</em> {pendingScopeLabel}
              </span>
            ) : null}
            {pendingReason && pendingReasonLabel && clearReasonHref ? (
              <Link
                href={clearReasonHref}
                className="kpi-lead-all-chip is-active"
                aria-label="ยกเลิกการกรองสาเหตุ"
              >
                สาเหตุ: {pendingReasonLabel} ×
              </Link>
            ) : null}
          </div>
        )}

        <div className="kpi-lead-all-filters">
          {pendingView ? (
            <div className="kpi-lead-all-field">
              ขอบเขตช่องทาง
              <span className="kpi-lead-all-source-pill">
                <em>ขอบเขต:</em> {pendingScopeLabel || "ทุกช่องทาง"}
              </span>
            </div>
          ) : channelView || lockedSource ? (
            <div className="kpi-lead-all-field">
              แหล่งที่มา
              {lockedSource ? (
                <span className="kpi-lead-all-source-pill">
                  <em>แหล่งที่มา:</em> {lockedSourceLabel || lockedSource}
                </span>
              ) : (
                <span className="kpi-lead-all-source-pill">
                  <em>แหล่งที่มา:</em> ทุกช่องทาง
                </span>
              )}
            </div>
          ) : !lockedOrigin ? (
            <label className="kpi-lead-all-field">
              แหล่งที่มา
              <select
                value={origin}
                onChange={(event) =>
                  pushState({ origin: event.target.value as "" | "web" | "manual" })
                }
              >
                <option value="">ทั้งหมด</option>
                <option value="web">จากเว็บไซต์</option>
                <option value="manual">คีย์เอง / แหล่งอื่น</option>
              </select>
            </label>
          ) : (
            <div className="kpi-lead-all-field">
              แหล่งที่มา
              <span className="kpi-lead-all-source-pill">
                <em>แหล่งที่มา:</em> {origin === "web" ? "จากเว็บไซต์" : "คีย์เอง / แหล่งอื่น"}
              </span>
            </div>
          )}
          <label className="kpi-lead-all-field">
            ลำดับขั้น
            <select value={stageId} onChange={(event) => pushState({ stageId: event.target.value })}>
              <option value="">ทุกขั้น</option>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.nameTh}
                </option>
              ))}
            </select>
          </label>
          <label className="kpi-lead-all-field">
            ผู้ดูแล
            <select value={ownerId} onChange={(event) => pushState({ ownerId: event.target.value })}>
              <option value="">ทุกคน</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
          </label>
          <label className="kpi-lead-all-field">
            เรียงลำดับ
            <select
              value={sort}
              onChange={(event) => pushState({ sort: event.target.value as LeadAllSort })}
            >
              <option value="urgent">เร่งด่วนก่อน</option>
              <option value="value">มูลค่าสูงสุด</option>
              <option value="updated">อัปเดตล่าสุด</option>
            </select>
          </label>
        </div>

        <div className="kpi-lead-all-meta-row">
          <p className="kpi-lead-all-meta" aria-live="polite">
            แสดง {filtered.length} จาก {scopedLeads.length} รายการ
            {stat !== "all"
              ? ` · กรอง${stat === "overdue" ? "เกินกำหนด" : stat === "dueToday" ? "ถึงกำหนดวันนี้" : stat === "awaiting" ? "รอตอบกลับ" : "ลีดใหม่"}`
              : ""}
            {lockedSourceLabel ? ` · ${lockedSourceLabel}` : ""}
          </p>
          <div className="kpi-lead-all-inline-btns">
            {lockedSource ? (
              <Link href={leaveChannelHref} className="kpi-leads-btn-secondary">
                ทุกช่องทาง
              </Link>
            ) : null}
            {hasExtraFilters ? (
              <button type="button" className="kpi-leads-btn-secondary" onClick={clearFilters}>
                ล้างตัวกรอง
              </button>
            ) : null}
          </div>
        </div>

        {selected.length > 0 ? (
          <div className="kpi-lead-all-bulk" role="region" aria-label="การกระทำกับรายการที่เลือก">
            <strong>เลือก {selected.length} รายการ</strong>
            <label className="sr-only" htmlFor="bulk-stage">
              ย้ายขั้นกลุ่ม
            </label>
            <select
              id="bulk-stage"
              value={bulkStageId}
              onChange={(event) => setBulkStageId(event.target.value)}
            >
              <option value="">ย้ายขั้น…</option>
              {stages
                .filter((stage) => !stage.isLost)
                .map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.nameTh}
                  </option>
                ))}
            </select>
            <button
              type="button"
              className="kpi-leads-btn-secondary"
              disabled={!bulkStageId || pending}
              onClick={bulkMove}
            >
              ย้ายขั้น
            </button>
            <label className="sr-only" htmlFor="bulk-owner">
              มอบหมายกลุ่ม
            </label>
            <select
              id="bulk-owner"
              value={bulkOwnerId}
              onChange={(event) => setBulkOwnerId(event.target.value)}
            >
              <option value="">มอบหมายให้…</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="kpi-leads-btn-secondary"
              disabled={!bulkOwnerId || pending}
              onClick={bulkAssign}
            >
              มอบหมาย
            </button>
            <button
              type="button"
              className="kpi-leads-btn-secondary"
              disabled={pending || archive === "archived"}
              onClick={bulkArchive}
            >
              เก็บที่เลือก
            </button>
            <button type="button" className="kpi-leads-btn-secondary" onClick={() => setSelected([])}>
              ยกเลิกการเลือก
            </button>
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <div className="kpi-lead-all-empty">
            <h3>
              {lockedSource
                ? emptyBecauseSearch
                  ? `ไม่พบลีดในช่องทาง ${lockedSourceLabel || lockedSource} ตามเงื่อนไข`
                  : `ยังไม่มีลีดในช่องทาง ${lockedSourceLabel || lockedSource}`
                : emptyBecauseSearch
                  ? "ไม่พบลีดตามเงื่อนไข"
                  : "ยังไม่มีลีด"}
            </h3>
            <p>
              {lockedSource && emptyBecauseSearch
                ? "ลองล้างคำค้นหาและช่วงสถานะ หรือเลือกทุกช่องทาง"
                : lockedSource
                  ? "เลือกลีดเข้าช่องทางนี้ หรือกลับไปดูทุกช่องทาง"
                  : "ลองล้างตัวกรอง หรือเพิ่มลีดใหม่"}
            </p>
            <div className="kpi-lead-all-inline-btns" style={{ justifyContent: "center" }}>
              {emptyBecauseSearch ? (
                <button type="button" className="kpi-leads-btn-secondary" onClick={clearSearchAndArchive}>
                  ล้างคำค้นหาและช่วงสถานะ
                </button>
              ) : null}
              {lockedSource ? (
                <Link href={leaveChannelHref} className="kpi-leads-btn-secondary">
                  ทุกช่องทาง
                </Link>
              ) : null}
              {hasExtraFilters && !emptyBecauseSearch ? (
                <button type="button" className="kpi-leads-btn-secondary" onClick={clearFilters}>
                  ล้างตัวกรอง
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <div className="kpi-lead-all-table-wrap kpi-lead-all-desktop">
              <table className="kpi-lead-all-table">
                <caption className="sr-only">รายการลีดทั้งหมด</caption>
                <thead>
                  <tr>
                    <th scope="col" className="is-check">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAll}
                        aria-label="เลือกทุกรายการที่แสดง"
                      />
                    </th>
                    <th scope="col" className="is-contact">
                      ผู้ติดต่อ / โรงแรม
                    </th>
                    <th scope="col" className="is-stage">
                      ลำดับขั้น
                    </th>
                    <th scope="col" className="is-value">
                      มูลค่า
                    </th>
                    <th scope="col" className="is-owner">
                      ผู้ดูแล
                    </th>
                    <th scope="col" className="is-due">
                      กำหนดติดต่อ
                    </th>
                    <th scope="col" className="is-actions">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => {
                    const open = openId === lead.id;
                    const { tone, overdue } = rowMeta(lead);
                    const next = nextStageFor(lead);
                    return (
                      <Fragment key={lead.id}>
                        <tr
                          className={`${open ? "is-open" : ""}${lead.archivedAt ? " is-archived" : ""}`}
                        >
                          <td className="is-check">
                            <input
                              type="checkbox"
                              checked={selectedSet.has(lead.id)}
                              onChange={() => toggleSelect(lead.id)}
                              aria-label={`เลือก ${lead.contactName}`}
                            />
                          </td>
                          <td className="is-contact">
                            <div className="kpi-lead-all-name">
                              <Link href={`/crm/leads/${lead.id}`}>{lead.contactName}</Link>
                              <span>{lead.businessName || "—"}</span>
                              <span className="kpi-lead-all-sub">
                                {lockedSource
                                  ? `${lead.services.length ? lead.services.slice(0, 2).join(", ") : lead.businessType || "ยังไม่ระบุขอบเขต"} · ${formatLeadWhen(lead.lastContactAt)}`
                                  : `${lead.sourceLabel} · ${formatLeadWhen(lead.lastContactAt)}`}
                              </span>
                            </div>
                          </td>
                          <td className="is-stage">
                            <span className={`kpi-lead-all-stage ${tone}`}>
                              <i aria-hidden="true" />
                              <span className="kpi-lead-all-stage-label">{lead.stageName}</span>
                            </span>
                          </td>
                          <td className="is-value">{formatLeadValue(lead.estimatedValue)}</td>
                          <td className="is-owner">
                            {lead.ownerName ? (
                              lead.ownerName
                            ) : (
                              <span className="kpi-lead-all-owner is-empty">
                                <IconAlert />
                                ยังไม่มอบหมาย
                              </span>
                            )}
                          </td>
                          <td className="is-due">
                            <div className={`kpi-lead-all-due${overdue ? " is-overdue" : ""}`}>
                              <strong>{formatLeadWhen(lead.nextActivityAt)}</strong>
                              <span>อัปเดต {formatLeadDay(lead.updatedAt)}</span>
                            </div>
                          </td>
                          <td className="is-actions">
                            <div className="kpi-lead-all-row-actions">
                              <button
                                type="button"
                                className="kpi-lead-all-advance"
                                disabled={!next || pending || Boolean(lead.archivedAt)}
                                onClick={() => advanceLead(lead)}
                              >
                                เลื่อนขั้น
                              </button>
                              <button
                                type="button"
                                className="kpi-lead-all-expand"
                                aria-expanded={open}
                                aria-label={open ? `ปิดแผง ${lead.contactName}` : `เปิดแผง ${lead.contactName}`}
                                onClick={() => {
                                  setOpenId(open ? null : lead.id);
                                  setConfirmDeleteId(null);
                                  setEditingId(null);
                                }}
                              >
                                <IconChevron />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {open ? (
                          <tr className="kpi-lead-all-inline-row">
                            <td colSpan={7}>{renderInline(lead)}</td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="kpi-lead-all-cards" aria-label="รายการลีดแบบการ์ด">
              {filtered.map((lead) => {
                const open = openId === lead.id;
                const { tone, overdue } = rowMeta(lead);
                const next = nextStageFor(lead);
                return (
                  <article key={lead.id} className="kpi-lead-all-card">
                    <div className="kpi-lead-all-card-top">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedSet.has(lead.id)}
                          onChange={() => toggleSelect(lead.id)}
                          aria-label={`เลือก ${lead.contactName}`}
                        />
                      </label>
                      <div className="kpi-lead-all-name" style={{ flex: 1 }}>
                        <Link href={`/crm/leads/${lead.id}`}>{lead.contactName}</Link>
                        <span>{lead.businessName || "—"}</span>
                        <span className="kpi-lead-all-sub">
                          {lockedSource
                            ? `${lead.services.length ? lead.services.slice(0, 2).join(", ") : lead.businessType || "ยังไม่ระบุขอบเขต"} · ${formatLeadWhen(lead.lastContactAt)}`
                            : `${lead.sourceLabel} · ${formatLeadWhen(lead.lastContactAt)}`}
                        </span>
                      </div>
                      <div className="kpi-lead-all-row-actions">
                        <button
                          type="button"
                          className="kpi-lead-all-advance"
                          disabled={!next || pending || Boolean(lead.archivedAt)}
                          onClick={() => advanceLead(lead)}
                        >
                          เลื่อนขั้น
                        </button>
                        <button
                          type="button"
                          className="kpi-lead-all-expand"
                          aria-expanded={open}
                          aria-label={open ? `ปิดแผง ${lead.contactName}` : `เปิดแผง ${lead.contactName}`}
                          onClick={() => {
                            setOpenId(open ? null : lead.id);
                            setConfirmDeleteId(null);
                            setEditingId(null);
                          }}
                        >
                          <IconChevron />
                        </button>
                      </div>
                    </div>
                    <dl className="kpi-lead-all-card-meta">
                      <div>
                        <dt>ลำดับขั้น</dt>
                        <dd>
                          <span className={`kpi-lead-all-stage ${tone}`}>
                            <i aria-hidden="true" />
                            {lead.stageName}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt>มูลค่า</dt>
                        <dd>{formatLeadValue(lead.estimatedValue)}</dd>
                      </div>
                      <div>
                        <dt>ผู้ดูแล</dt>
                        <dd>
                          {lead.ownerName || (
                            <span className="kpi-lead-all-owner is-empty">ยังไม่มอบหมาย</span>
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt>กำหนดติดต่อ</dt>
                        <dd className={overdue ? "kpi-lead-all-due is-overdue" : undefined}>
                          {formatLeadWhen(lead.nextActivityAt)}
                        </dd>
                      </div>
                    </dl>
                    {open ? renderInline(lead) : null}
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
