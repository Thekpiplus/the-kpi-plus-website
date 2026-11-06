import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { LeadRowActions } from "@/components/crm/ui/LeadRowActions";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { stageToneKey } from "@/components/crm/pipeline-types";
import { assignLeadOwner, changeLeadStage } from "@/lib/crm/actions";
import { leadArchiveCounts, type LeadArchiveView } from "@/lib/crm/archive";
import {
  formatMoney,
  formatThaiDateTime,
  leadOriginCounts,
  pipelineData,
  searchLeads,
  staffDirectory,
} from "@/lib/crm/queries";
import { originLabel, sourceLabel, type LeadOrigin } from "@/lib/crm/sources";

function leadsListHref(
  params: { q?: string; origin?: string; stageId?: string; ownerId?: string },
  archive: LeadArchiveView,
) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.origin) query.set("origin", params.origin);
  if (params.stageId) query.set("stageId", params.stageId);
  if (params.ownerId) query.set("ownerId", params.ownerId);
  if (archive !== "active") query.set("archive", archive);
  const value = query.toString();
  return value ? `/crm/leads?${value}` : "/crm/leads";
}

/** Short source chip / locked-field label (not the full page title). */
function originFilterLabel(origin: LeadOrigin) {
  return origin === "web" ? "จากเว็บไซต์" : "คีย์เอง / แหล่งอื่น";
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; origin?: string; stageId?: string; ownerId?: string; archive?: string }>;
}) {
  const params = await searchParams;
  const origin: LeadOrigin | undefined =
    params.origin === "web" || params.origin === "manual" ? params.origin : undefined;
  const archive: LeadArchiveView =
    params.archive === "archived" || params.archive === "all" ? params.archive : "active";
  const [leads, stages, owners, counts, originCounts] = await Promise.all([
    searchLeads({ q: params.q, origin, stageId: params.stageId, ownerId: params.ownerId, archive }),
    pipelineData(),
    staffDirectory(),
    leadArchiveCounts(),
    leadOriginCounts(),
  ]);
  const ownersById = Object.fromEntries(owners.map((item) => [item.id, item.name]));
  const stageIndexById = Object.fromEntries(stages.map((stage, index) => [stage.id, index + 1]));
  const tabs: { id: LeadArchiveView; label: string; count: number; tone: string }[] = [
    { id: "active", label: "ใช้งานอยู่", count: counts.active, tone: "active" },
    { id: "archived", label: "เก็บแล้ว", count: counts.archived, tone: "archived" },
    { id: "all", label: "ทั้งหมด", count: counts.all, tone: "all" },
  ];

  const extraFiltered = Boolean(params.q?.trim() || params.stageId || params.ownerId);
  const hasActiveFilters = Boolean(origin || extraFiltered);
  const returnTo = leadsListHref(params, archive);
  const originBaseHref = leadsListHref({ origin }, archive);
  const clearExtraHref = originBaseHref;
  const clearAllHref = leadsListHref({}, archive);

  const pageTitle =
    origin === "web" ? "ลีดจากเว็บไซต์" : origin === "manual" ? "ลีดที่คีย์เอง" : "ลีดทั้งหมด";
  const pageEyebrow =
    origin === "web"
      ? "Lead Management · จากเว็บ"
      : origin === "manual"
        ? "Lead Management · คีย์เอง"
        : "Lead Management · ลีดทั้งหมด";
  const pageDescription =
    archive === "archived"
      ? origin
        ? `${originLabel(origin)}ที่เก็บไว้แล้ว ไม่โชว์ใน Pipeline และงานวันนี้`
        : "ลีดที่เก็บไว้แล้ว ไม่โชว์ใน Pipeline และงานวันนี้"
      : origin === "web"
        ? "รายการจากฟอร์มเว็บไซต์ — ค้นหา มอบหมาย และปรับขั้นได้จากตาราง"
        : origin === "manual"
          ? "รายการที่คีย์เองหรือจากแหล่งอื่น — ค้นหา มอบหมาย และปรับขั้นได้จากตาราง"
          : "ค้นหา กรอง มอบหมาย และปรับขั้นของลีดในรายการเดียว";

  const archiveLabel =
    archive === "archived" ? "ลีดที่เก็บไว้" : archive === "all" ? "ลีดทุกสถานะ" : "ลีดที่ใช้งานอยู่";
  const originScopeCount =
    origin === "web" ? originCounts.web : origin === "manual" ? originCounts.manual : null;

  const emptyTitle = extraFiltered
    ? "ไม่พบลีดตามเงื่อนไข"
    : origin === "web"
      ? "ยังไม่มีลีดจากเว็บไซต์"
      : origin === "manual"
        ? "ยังไม่มีลีดที่คีย์เอง"
        : "ยังไม่มีลีด";
  const emptyBody = extraFiltered
    ? "ลองเปลี่ยนคำค้นหรือตัวกรอง หรือล้างตัวกรองเพื่อดูรายการในบริบทนี้"
    : origin === "web"
      ? "เมื่อมีคนกรอกฟอร์มบนเว็บไซต์ ลีดจะปรากฏที่นี่"
      : origin === "manual"
        ? "คีย์ลีดใหม่เพื่อเริ่มติดตามในรายการนี้"
        : "คีย์ลีดใหม่เพื่อเริ่มติดตามในรายการนี้";

  return (
    <div className={`crm-leads crm-leads-page${origin ? ` is-origin-${origin}` : ""}`}>
      <PageHeader
        eyebrow={pageEyebrow}
        title={pageTitle}
        description={pageDescription}
        actions={
          <div className="crm-leads-actions">
            <NewLeadOpenButton className="kpi-button crm-users-primary">คีย์ลีด</NewLeadOpenButton>
            <Link href="/crm/pipeline" className="crm-users-secondary">
              Pipeline
            </Link>
            <Link href="/crm/sales" className="crm-users-secondary">
              งานวันนี้
            </Link>
          </div>
        }
      />

      <section className="crm-leads-archive" aria-label="สถานะการเก็บลีด">
        <nav className="crm-leads-tabs" aria-label="ตัวกรองสถานะลีด">
          {tabs.map((tab) => {
            const active = archive === tab.id;
            return (
              <Link
                key={tab.id}
                href={leadsListHref(params, tab.id)}
                className={`crm-leads-tab is-${tab.tone}${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="crm-leads-tab-label">{tab.label}</span>
                {!origin ? <span className="crm-leads-tab-count">{tab.count}</span> : null}
                {active ? <span className="sr-only"> (กำลังกรอง)</span> : null}
              </Link>
            );
          })}
        </nav>
        <p className="crm-leads-archive-hint">
          {origin
            ? `กำลังดู${pageTitle} — แท็บด้านบนกรองสถานะเก็บภายในรายการนี้ · จำนวนผลลัพธ์อยู่เหนือตาราง`
            : "ตัวเลขบนแท็บคือจำนวนในระบบตามสถานะเก็บลีด — ไม่ใช่จำนวนผลลัพธ์หลังค้นหา"}
        </p>
        {origin && originScopeCount != null ? (
          <p className="crm-leads-origin-scope" aria-live="polite">
            <span className="crm-leads-origin-scope-label">
              {origin === "web" ? "ลีดจากเว็บไซต์ที่ใช้งานอยู่" : "ลีดที่คีย์เองที่ใช้งานอยู่"}
            </span>
            <span className="crm-leads-origin-scope-count">{originScopeCount}</span>
            <span className="crm-leads-origin-scope-sep">ในระบบ · ไม่ใช่ผลลัพธ์หลังค้นหา</span>
          </p>
        ) : null}
      </section>

      <section className="crm-leads-toolbar" aria-label="ค้นหาและตัวกรอง">
        <form className="crm-leads-filters" method="get">
          {archive !== "active" ? <input type="hidden" name="archive" value={archive} /> : null}
          {origin ? <input type="hidden" name="origin" value={origin} /> : null}
          <label className="crm-leads-filter-field is-search">
            <span>ค้นหา</span>
            <input
              className="crm-field"
              name="q"
              defaultValue={params.q}
              placeholder="ชื่อ กิจการ เบอร์ หรืออีเมล"
              autoComplete="off"
            />
          </label>
          {!origin ? (
            <label className="crm-leads-filter-field">
              <span>แหล่งที่มา</span>
              <select className="crm-select" name="origin" defaultValue="">
                <option value="">ทั้งหมด</option>
                <option value="web">จากเว็บไซต์</option>
                <option value="manual">คีย์เอง / แหล่งอื่น</option>
              </select>
            </label>
          ) : (
            <div className="crm-leads-filter-field is-locked" aria-label="แหล่งที่มา">
              <span>แหล่งที่มา</span>
              <p className="crm-leads-filter-locked">{originFilterLabel(origin)}</p>
            </div>
          )}
          <label className="crm-leads-filter-field">
            <span>ขั้น</span>
            <select className="crm-select" name="stageId" defaultValue={params.stageId ?? ""}>
              <option value="">ทุกขั้น</option>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.nameTh}
                </option>
              ))}
            </select>
          </label>
          <label className="crm-leads-filter-field">
            <span>ผู้ดูแล</span>
            <select className="crm-select" name="ownerId" defaultValue={params.ownerId ?? ""}>
              <option value="">ทุกคน</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
          </label>
          <div className="crm-leads-filters-actions">
            <button className="kpi-button crm-users-primary" type="submit">
              กรอง
            </button>
            {extraFiltered ? (
              <Link href={clearExtraHref} className="crm-leads-clear">
                ล้างตัวกรอง
              </Link>
            ) : null}
          </div>
        </form>
        {hasActiveFilters ? (
          <div className="crm-filter-chips" aria-label="ตัวกรองที่ใช้งาน">
            {origin ? (
              <span className="crm-filter-chip is-context">แหล่ง: {originFilterLabel(origin)}</span>
            ) : null}
            {params.q?.trim() ? <span className="crm-filter-chip">ค้นหา: {params.q.trim()}</span> : null}
            {params.stageId ? (
              <span className="crm-filter-chip">
                ขั้น: {stages.find((stage) => stage.id === params.stageId)?.nameTh ?? "เลือกแล้ว"}
              </span>
            ) : null}
            {params.ownerId ? (
              <span className="crm-filter-chip">
                ผู้ดูแล: {ownersById[params.ownerId] ?? "เลือกแล้ว"}
              </span>
            ) : null}
            {extraFiltered ? (
              <Link href={clearExtraHref} className="crm-filter-chip-clear">
                ล้างตัวกรองเพิ่มเติม
              </Link>
            ) : null}
            {origin ? (
              <Link href={clearAllHref} className="crm-filter-chip-clear">
                ดูลีดทั้งหมด
              </Link>
            ) : null}
          </div>
        ) : null}
      </section>

      <section
        className={`crm-leads-panel${leads.length === 0 ? " is-empty" : ""}`}
        aria-labelledby="crm-leads-list-heading"
      >
        <div className="crm-leads-panel-head">
          <div>
            <h2 id="crm-leads-list-heading">
              {origin ? `รายชื่อ${pageTitle}` : "รายชื่อลีด"}
              <span className="crm-leads-count" title="จำนวนผลลัพธ์ที่แสดงตามตัวกรองปัจจุบัน">
                {leads.length}
              </span>
            </h2>
            <p>
              ผลลัพธ์ที่พบ {leads.length} รายการ · {archiveLabel}
              {origin ? ` · ${pageTitle}` : ""}
              {params.q?.trim() ? ` · “${params.q.trim()}”` : ""}
              {extraFiltered ? " · ตามเงื่อนไขที่เลือก" : ""}
            </p>
          </div>
        </div>

        {leads.length === 0 ? (
          <EmptyState
            compact
            filtered={extraFiltered}
            title={emptyTitle}
            body={emptyBody}
            action={
              extraFiltered ? (
                <Link href={clearExtraHref} className="crm-users-secondary">
                  ล้างตัวกรอง
                </Link>
              ) : origin === "web" ? (
                <Link href="/crm/leads" className="crm-users-secondary">
                  ดูลีดทั้งหมด
                </Link>
              ) : (
                <NewLeadOpenButton className="kpi-button crm-users-primary">คีย์ลีด</NewLeadOpenButton>
              )
            }
          />
        ) : (
          <div className="crm-leads-table-wrap">
            <table className="crm-leads-table">
              <thead>
                <tr>
                  <th scope="col">ผู้ติดต่อ</th>
                  <th scope="col">กิจการ</th>
                  <th scope="col">ลำดับขั้น</th>
                  <th scope="col">แหล่งที่มา</th>
                  <th scope="col">ผู้ดูแล</th>
                  <th scope="col">มูลค่า</th>
                  <th scope="col">อัปเดต</th>
                  <th scope="col">ย้ายขั้น</th>
                  <th scope="col">มอบหมาย</th>
                  <th scope="col" className="crm-leads-table-actions-col">
                    การดำเนินการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const stage = stages.find((item) => item.id === lead.stageId);
                  const stageIndex = stageIndexById[lead.stageId] ?? 1;
                  const tone = stageToneKey(stageIndex, stage);
                  const archived = Boolean(lead.archivedAt);
                  return (
                    <tr key={lead.id} className={archived ? "is-archived" : undefined}>
                      <td data-label="ผู้ติดต่อ">
                        <Link href={`/crm/leads/${lead.id}`} className="crm-leads-table-name">
                          {lead.contactName}
                        </Link>
                      </td>
                      <td data-label="กิจการ">
                        <span className="crm-leads-table-secondary">{lead.businessName || "—"}</span>
                      </td>
                      <td data-label="ลำดับขั้น">
                        <span className="crm-pipe-stage-badge" data-stage-tone={tone}>
                          {stage?.nameTh ?? "—"}
                        </span>
                        {archived ? <span className="crm-leads-archived-tag">เก็บแล้ว</span> : null}
                      </td>
                      <td data-label="แหล่งที่มา">
                        <span className="crm-leads-table-secondary">{sourceLabel(lead.source)}</span>
                      </td>
                      <td data-label="ผู้ดูแล">{ownersById[lead.ownerId ?? ""] || "—"}</td>
                      <td data-label="มูลค่า" className="crm-leads-table-money">
                        {formatMoney(lead.estimatedValue)}
                      </td>
                      <td data-label="อัปเดต">
                        <span className="crm-leads-table-secondary">{formatThaiDateTime(lead.updatedAt)}</span>
                      </td>
                      <td data-label="ย้ายขั้น">
                        <form action={changeLeadStage} className="crm-leads-table-move">
                          <input type="hidden" name="leadId" value={lead.id} />
                          <select
                            className="crm-pipe-select"
                            name="stageId"
                            defaultValue={lead.stageId}
                            aria-label={`ย้ายขั้นของ ${lead.contactName}`}
                          >
                            {stages.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.nameTh}
                              </option>
                            ))}
                          </select>
                          <button className="crm-pipe-move-btn" type="submit">
                            ย้าย
                          </button>
                        </form>
                      </td>
                      <td data-label="มอบหมาย">
                        <form action={assignLeadOwner} className="crm-leads-table-move">
                          <input type="hidden" name="leadId" value={lead.id} />
                          <select
                            className="crm-pipe-select"
                            name="ownerId"
                            defaultValue={lead.ownerId ?? ""}
                            aria-label={`มอบหมาย ${lead.contactName}`}
                          >
                            <option value="">ยังไม่กำหนด</option>
                            {owners.map((owner) => (
                              <option key={owner.id} value={owner.id}>
                                {owner.name}
                              </option>
                            ))}
                          </select>
                          <button className="crm-pipe-move-btn" type="submit">
                            ตั้ง
                          </button>
                        </form>
                      </td>
                      <td data-label="การดำเนินการ" className="crm-leads-table-actions-col">
                        <LeadRowActions leadId={lead.id} contactName={lead.contactName} returnTo={returnTo} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
