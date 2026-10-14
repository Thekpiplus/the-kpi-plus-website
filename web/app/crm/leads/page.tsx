import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { LeadRowActions } from "@/components/crm/ui/LeadRowActions";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { stageToneKey } from "@/components/crm/pipeline-types";
import { assignLeadOwner, changeLeadStage } from "@/lib/crm/actions";
import { leadArchiveCounts, type LeadArchiveView } from "@/lib/crm/archive";
import { formatMoney, formatThaiDateTime, pipelineData, searchLeads, staffDirectory } from "@/lib/crm/queries";
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
  const [leads, stages, owners, counts] = await Promise.all([
    searchLeads({ q: params.q, origin, stageId: params.stageId, ownerId: params.ownerId, archive }),
    pipelineData(),
    staffDirectory(),
    leadArchiveCounts(),
  ]);
  const ownersById = Object.fromEntries(owners.map((item) => [item.id, item.name]));
  const stageIndexById = Object.fromEntries(stages.map((stage, index) => [stage.id, index + 1]));
  const tabs: { id: LeadArchiveView; label: string; count: number }[] = [
    { id: "active", label: "ใช้งานอยู่", count: counts.active },
    { id: "archived", label: "เก็บแล้ว", count: counts.archived },
    { id: "all", label: "ทั้งหมด", count: counts.all },
  ];
  const filtered = Boolean(params.q?.trim() || origin || params.stageId || params.ownerId);
  const returnTo = leadsListHref(params, archive);

  return (
    <div className="crm-leads crm-leads-page">
      <PageHeader
        eyebrow="Lead Management"
        title="ลีดทั้งหมด"
        description={
          archive === "archived"
            ? "ลีดที่เก็บไว้แล้ว ไม่โชว์ใน Pipeline และงานวันนี้"
            : origin
              ? originLabel(origin)
              : "ค้นหา มอบหมาย ปรับขั้น และจัดการลีดในรายการเดียว"
        }
        actions={
          <div className="crm-leads-actions">
            <Link href="/crm/pipeline" className="crm-users-secondary">
              Pipeline
            </Link>
            <Link href="/crm/sales" className="crm-users-secondary">
              งานวันนี้
            </Link>
            <NewLeadOpenButton className="kpi-button">คีย์ลีด</NewLeadOpenButton>
          </div>
        }
      />

      <section className="crm-leads-bar" aria-label="สรุปสถานะลีด">
        <div className="crm-leads-metrics">
          <div>
            <span>ใช้งานอยู่</span>
            <strong>{counts.active}</strong>
          </div>
          <div>
            <span>เก็บแล้ว</span>
            <strong>{counts.archived}</strong>
          </div>
          <div>
            <span>ทั้งหมด</span>
            <strong>{counts.all}</strong>
          </div>
          <div className="is-value">
            <span>ผลลัพธ์ที่แสดง</span>
            <strong>{leads.length}</strong>
          </div>
        </div>
        <nav className="crm-leads-tabs" aria-label="เก็บลีด">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={leadsListHref(params, tab.id)}
              className={archive === tab.id ? "is-active" : undefined}
              aria-current={archive === tab.id ? "page" : undefined}
            >
              {tab.label}
              <span>{tab.count}</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="crm-leads-toolbar">
        <form className="crm-leads-filters" method="get">
          {archive !== "active" ? <input type="hidden" name="archive" value={archive} /> : null}
          <label>
            ค้นหา
            <input className="crm-field" name="q" defaultValue={params.q} placeholder="ชื่อ กิจการ เบอร์ อีเมล" />
          </label>
          <label>
            แหล่ง
            <select className="crm-select" name="origin" defaultValue={origin ?? ""}>
              <option value="">ทั้งหมด</option>
              <option value="web">จากเว็บไซต์</option>
              <option value="manual">คีย์เอง / แหล่งอื่น</option>
            </select>
          </label>
          <label>
            ขั้น
            <select className="crm-select" name="stageId" defaultValue={params.stageId ?? ""}>
              <option value="">ทุกขั้น</option>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.nameTh}
                </option>
              ))}
            </select>
          </label>
          <label>
            ผู้ดูแล
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
            <button className="kpi-button" type="submit">
              กรอง
            </button>
            {filtered ? (
              <Link href={leadsListHref({}, archive)} className="crm-leads-clear">
                ล้างตัวกรอง
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      <section className="crm-leads-panel">
        <div className="crm-leads-panel-head">
          <div>
            <h2>
              รายชื่อลีด
              <span className="crm-leads-count">{leads.length}</span>
            </h2>
            <p>
              {archive === "archived" ? "ลีดที่เก็บไว้" : archive === "all" ? "ลีดทั้งหมด" : "ลีดที่ใช้งานอยู่"}
              {origin ? ` · ${originLabel(origin)}` : ""}
              {params.q?.trim() ? ` · “${params.q.trim()}”` : ""}
            </p>
          </div>
        </div>

        {leads.length === 0 ? (
          <EmptyState
            title="ยังไม่มีลีดในเงื่อนไขนี้"
            body="ลองเปลี่ยนตัวกรอง หรือคีย์ลีดใหม่"
            action={<NewLeadOpenButton className="kpi-button">คีย์ลีด</NewLeadOpenButton>}
          />
        ) : (
          <div className="crm-leads-table-wrap">
            <table className="crm-leads-table">
              <thead>
                <tr>
                  <th>ผู้ติดต่อ</th>
                  <th>กิจการ</th>
                  <th>ลำดับขั้น</th>
                  <th>แหล่งที่มา</th>
                  <th>ผู้ดูแล</th>
                  <th>มูลค่า</th>
                  <th>อัปเดต</th>
                  <th>ย้ายขั้น</th>
                  <th>มอบหมาย</th>
                  <th className="crm-leads-table-actions-col">การดำเนินการ</th>
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
                      <td data-label="กิจการ">{lead.businessName || "—"}</td>
                      <td data-label="ลำดับขั้น">
                        <span className="crm-pipe-stage-badge" data-stage-tone={tone}>
                          {stage?.nameTh ?? "—"}
                        </span>
                        {archived ? <span className="crm-leads-archived-tag">เก็บแล้ว</span> : null}
                      </td>
                      <td data-label="แหล่งที่มา">{sourceLabel(lead.source)}</td>
                      <td data-label="ผู้ดูแล">{ownersById[lead.ownerId ?? ""] || "—"}</td>
                      <td data-label="มูลค่า" className="crm-leads-table-money">
                        {formatMoney(lead.estimatedValue)}
                      </td>
                      <td data-label="อัปเดต">{formatThaiDateTime(lead.updatedAt)}</td>
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
