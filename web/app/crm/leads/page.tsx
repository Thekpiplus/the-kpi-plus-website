import Link from "next/link";
import { CrmSelect } from "@/components/crm/CrmSelect";
import { LeadsPageChrome } from "@/components/crm/leads/LeadsPageChrome";
import { PipelineMoveForm } from "@/components/crm/leads/PipelineMoveForm";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { LeadRowActions } from "@/components/crm/ui/LeadRowActions";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { stageToneKey } from "@/components/crm/pipeline-types";
import { assignLeadOwner } from "@/lib/crm/actions";
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
    <LeadsPageChrome
      tab="all"
      title={pageTitle}
      description={pageDescription}
      actions={
        <>
          <NewLeadOpenButton className="kpi-leads-btn-primary">เพิ่มลีดใหม่</NewLeadOpenButton>
          <Link href="/crm/pipeline" className="kpi-leads-btn-secondary">
            ดู Pipeline
          </Link>
        </>
      }
    >
    <div className={`crm-leads crm-leads-page kpi-leads-all${origin ? ` is-origin-${origin}` : ""}`}>
      <section className="kpi-leads-panel kpi-leads-archive" aria-label="สถานะการเก็บลีด">
        <div className="kpi-leads-chips" role="group" aria-label="ตัวกรองสถานะลีด">
          {tabs.map((tab) => {
            const active = archive === tab.id;
            return (
              <Link
                key={tab.id}
                href={leadsListHref(params, tab.id)}
                className={`kpi-leads-chip is-archive is-${tab.tone}${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {tab.label}
                {!origin ? <strong>{tab.count}</strong> : null}
                {active ? <span className="sr-only"> (กำลังกรอง)</span> : null}
              </Link>
            );
          })}
        </div>
        <p className="kpi-leads-archive-hint">
          {origin
            ? `กำลังดู${pageTitle} — แท็บด้านบนกรองสถานะเก็บภายในรายการนี้ · จำนวนผลลัพธ์อยู่เหนือตาราง`
            : "ตัวเลขบนแท็บคือจำนวนในระบบตามสถานะเก็บลีด — ไม่ใช่จำนวนผลลัพธ์หลังค้นหา"}
        </p>
        {origin && originScopeCount != null ? (
          <p className="kpi-leads-origin-scope" aria-live="polite">
            <span>
              {origin === "web" ? "ลีดจากเว็บไซต์ที่ใช้งานอยู่" : "ลีดที่คีย์เองที่ใช้งานอยู่"}
            </span>
            <strong>{originScopeCount}</strong>
            <span>ในระบบ · ไม่ใช่ผลลัพธ์หลังค้นหา</span>
          </p>
        ) : null}
      </section>

      <section className="kpi-leads-panel kpi-leads-toolbar-panel" aria-label="ค้นหาและตัวกรอง">
        <form className="kpi-leads-filters" method="get">
          {archive !== "active" ? <input type="hidden" name="archive" value={archive} /> : null}
          {origin ? <input type="hidden" name="origin" value={origin} /> : null}
          <label className="kpi-leads-field is-search">
            ค้นหา
            <input
              name="q"
              defaultValue={params.q}
              placeholder="ชื่อ กิจการ เบอร์ หรืออีเมล"
              autoComplete="off"
            />
          </label>
          {!origin ? (
            <label className="kpi-leads-field">
              แหล่งที่มา
              <CrmSelect
                name="origin"
                aria-label="แหล่งที่มา"
                defaultValue=""
                options={[
                  { value: "", label: "ทั้งหมด" },
                  { value: "web", label: "จากเว็บไซต์" },
                  { value: "manual", label: "คีย์เอง / แหล่งอื่น" },
                ]}
              />
            </label>
          ) : (
            <div className="kpi-leads-field is-locked" aria-label="แหล่งที่มา">
              แหล่งที่มา
              <p className="kpi-leads-filter-locked">{originFilterLabel(origin)}</p>
            </div>
          )}
          <label className="kpi-leads-field">
            ขั้น
            <CrmSelect
              name="stageId"
              aria-label="ขั้น"
              defaultValue={params.stageId ?? ""}
              options={[
                { value: "", label: "ทุกขั้น" },
                ...stages.map((stage) => ({ value: stage.id, label: stage.nameTh })),
              ]}
            />
          </label>
          <label className="kpi-leads-field">
            ผู้ดูแล
            <CrmSelect
              name="ownerId"
              aria-label="ผู้ดูแล"
              defaultValue={params.ownerId ?? ""}
              options={[
                { value: "", label: "ทุกคน" },
                ...owners.map((owner) => ({ value: owner.id, label: owner.name })),
              ]}
            />
          </label>
          <div className="kpi-leads-filters-actions">
            <button className="kpi-leads-btn-secondary" type="submit">
              กรอง
            </button>
            {extraFiltered ? (
              <Link href={clearExtraHref} className="kpi-leads-btn-secondary">
                ล้างตัวกรอง
              </Link>
            ) : null}
          </div>
        </form>
        {hasActiveFilters ? (
          <div className="kpi-leads-active-filters" aria-label="ตัวกรองที่ใช้งาน">
            {origin ? (
              <span className="kpi-leads-chip is-static">แหล่ง: {originFilterLabel(origin)}</span>
            ) : null}
            {params.q?.trim() ? (
              <span className="kpi-leads-chip is-static">ค้นหา: {params.q.trim()}</span>
            ) : null}
            {params.stageId ? (
              <span className="kpi-leads-chip is-static">
                ขั้น: {stages.find((stage) => stage.id === params.stageId)?.nameTh ?? "เลือกแล้ว"}
              </span>
            ) : null}
            {params.ownerId ? (
              <span className="kpi-leads-chip is-static">
                ผู้ดูแล: {ownersById[params.ownerId] ?? "เลือกแล้ว"}
              </span>
            ) : null}
            {extraFiltered ? (
              <Link href={clearExtraHref} className="kpi-leads-chip is-clear">
                ล้างตัวกรองเพิ่มเติม
              </Link>
            ) : null}
            {origin ? (
              <Link href={clearAllHref} className="kpi-leads-chip is-clear">
                ดูลีดทั้งหมด
              </Link>
            ) : null}
          </div>
        ) : null}
      </section>

      <section
        className={`kpi-leads-panel crm-leads-panel${leads.length === 0 ? " is-empty" : ""}`}
        aria-labelledby="crm-leads-list-heading"
      >
        <header className="kpi-leads-panel-head">
          <h2 id="crm-leads-list-heading">
            {origin ? `รายชื่อ${pageTitle}` : "รายชื่อลีด"}{" "}
            <span className="kpi-leads-count" title="จำนวนผลลัพธ์ที่แสดงตามตัวกรองปัจจุบัน">
              {leads.length}
            </span>
          </h2>
          <p>
            ผลลัพธ์ที่พบ {leads.length} รายการ · {archiveLabel}
            {origin ? ` · ${pageTitle}` : ""}
            {params.q?.trim() ? ` · “${params.q.trim()}”` : ""}
            {extraFiltered ? " · ตามเงื่อนไขที่เลือก" : ""}
          </p>
        </header>

        {leads.length === 0 ? (
          <EmptyState
            compact
            filtered={extraFiltered}
            title={emptyTitle}
            body={emptyBody}
            action={
              extraFiltered ? (
                <Link href={clearExtraHref} className="kpi-leads-btn-secondary">
                  ล้างตัวกรอง
                </Link>
              ) : origin === "web" ? (
                <Link href="/crm/leads" className="kpi-leads-btn-secondary">
                  ดูลีดทั้งหมด
                </Link>
              ) : (
                <NewLeadOpenButton className="kpi-leads-btn-secondary">คีย์ลีด</NewLeadOpenButton>
              )
            }
          />
        ) : (
          <div className="crm-leads-table-wrap kpi-leads-table-wrap">
            <table className="crm-leads-table kpi-leads-table">
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
                        <Link href={`/crm/leads/${lead.id}`} className="kpi-leads-table-name">
                          {lead.contactName}
                        </Link>
                      </td>
                      <td data-label="กิจการ">
                        <span className="kpi-leads-table-muted">{lead.businessName || "—"}</span>
                      </td>
                      <td data-label="ลำดับขั้น">
                        <span className="crm-pipe-stage-badge" data-stage-tone={tone}>
                          {stage?.nameTh ?? "—"}
                        </span>
                        {archived ? <span className="kpi-leads-archived-tag">เก็บแล้ว</span> : null}
                      </td>
                      <td data-label="แหล่งที่มา">
                        <span className="kpi-leads-table-muted">{sourceLabel(lead.source)}</span>
                      </td>
                      <td data-label="ผู้ดูแล">{ownersById[lead.ownerId ?? ""] || "—"}</td>
                      <td data-label="มูลค่า" className="kpi-leads-table-money">
                        {formatMoney(lead.estimatedValue)}
                      </td>
                      <td data-label="อัปเดต">
                        <span className="kpi-leads-table-muted">{formatThaiDateTime(lead.updatedAt)}</span>
                      </td>
                      <td data-label="ย้ายขั้น">
                        <PipelineMoveForm
                          leadId={lead.id}
                          contactName={lead.contactName}
                          currentStageId={lead.stageId}
                          stages={stages
                            .filter((item) => !item.isLost || item.id === lead.stageId)
                            .map((item) => ({ id: item.id, nameTh: item.nameTh }))}
                        />
                      </td>
                      <td data-label="มอบหมาย">
                        <form action={assignLeadOwner} className="crm-leads-table-move">
                          <input type="hidden" name="leadId" value={lead.id} />
                          <CrmSelect
                            size="pipe"
                            name="ownerId"
                            defaultValue={lead.ownerId ?? ""}
                            aria-label={`มอบหมาย ${lead.contactName}`}
                            options={[
                              { value: "", label: "ยังไม่กำหนด" },
                              ...owners.map((owner) => ({ value: owner.id, label: owner.name })),
                            ]}
                          />
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
    </LeadsPageChrome>
  );
}
