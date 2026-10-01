import Link from "next/link";
import { LeadArchiveButton } from "@/components/crm/LeadArchiveButton";
import { assignLeadOwner, changeLeadStage } from "@/lib/crm/actions";
import { leadArchiveCounts, type LeadArchiveView } from "@/lib/crm/archive";
import { formInterestLine, formLabel, parseLeadFormDetails } from "@/lib/crm/form-details";
import { formatMoney, formatThaiDateTime, pipelineData, searchLeads, staffDirectory } from "@/lib/crm/queries";
import { originLabel, sourceLabel, type LeadOrigin } from "@/lib/crm/sources";

function leadsListHref(params: { q?: string; origin?: string; stageId?: string; ownerId?: string }, archive: LeadArchiveView) {
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
  const origin: LeadOrigin | undefined = params.origin === "web" || params.origin === "manual" ? params.origin : undefined;
  const archive: LeadArchiveView =
    params.archive === "archived" || params.archive === "all" ? params.archive : "active";
  const [leads, stages, owners, counts] = await Promise.all([
    searchLeads({ q: params.q, origin, stageId: params.stageId, ownerId: params.ownerId, archive }),
    pipelineData(),
    staffDirectory(),
    leadArchiveCounts(),
  ]);
  const ownersById = Object.fromEntries(owners.map((item) => [item.id, item.name]));
  const tabs: { id: LeadArchiveView; label: string; count: number }[] = [
    { id: "active", label: "ใช้งานอยู่", count: counts.active },
    { id: "archived", label: "เก็บแล้ว", count: counts.archived },
    { id: "all", label: "ทั้งหมด", count: counts.all },
  ];

  return (
    <div className="crm-grid">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-[#3B3B3B]">ลีด</h1>
          <p className="mt-2">
            {archive === "archived"
              ? "ลีดที่เก็บไว้แล้ว ไม่โชว์ใน Pipeline และงานวันนี้"
              : origin
                ? originLabel(origin)
                : "ค้นหา มอบหมาย ปรับขั้น และเก็บลีดทดสอบออกจากรายการหลัก"}
          </p>
        </div>
        <Link href="/crm/leads/new" className="kpi-button">
          คีย์ลีด
        </Link>
      </div>

      <nav className="crm-archive-tabs" aria-label="เก็บลีด">
        {tabs.map((tab) => (
          <Link key={tab.id} href={leadsListHref(params, tab.id)} aria-current={archive === tab.id ? "page" : undefined}>
            {tab.label} ({tab.count})
          </Link>
        ))}
      </nav>

      <form className="crm-card grid gap-3 md:grid-cols-4" method="get">
        <input type="hidden" name="archive" value={archive === "active" ? "" : archive} />
        <label className="text-sm font-bold">
          ค้นหา
          <input className="crm-field" name="q" defaultValue={params.q} placeholder="ชื่อ กิจการ เบอร์ อีเมล" />
        </label>
        <label className="text-sm font-bold">
          แหล่ง
          <select className="crm-select" name="origin" defaultValue={origin ?? ""}>
            <option value="">ทั้งหมด</option>
            <option value="web">จากเว็บไซต์</option>
            <option value="manual">คีย์เอง / แหล่งอื่น</option>
          </select>
        </label>
        <label className="text-sm font-bold">
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
        <label className="text-sm font-bold">
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
        <button className="kpi-button md:col-span-4" type="submit">
          ค้นหา / กรอง
        </button>
      </form>

      <section className="crm-card">
        <p className="text-sm">{leads.length} รายการ</p>
        {leads.length === 0 ? <p className="mt-3">ยังไม่มีลีดในเงื่อนไขนี้</p> : null}
        <ul className="mt-3 grid gap-3">
          {leads.map((lead) => {
            const formRows = parseLeadFormDetails(lead.rawPayload);
            const interest = formInterestLine(formRows) || lead.message.split("\n")[0];
            const archived = Boolean(lead.archivedAt);
            return (
            <li key={lead.id} className="rounded-xl border border-[#E3E8EB] p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <Link href={`/crm/leads/${lead.id}`} className="font-semibold text-[#0B6660]">
                  {lead.contactName} · {lead.businessName || lead.formName || "ไม่มีชื่อกิจการ"}
                </Link>
                {archived ? <span className="text-xs font-extrabold tracking-[.08em] text-[#0B6660]">เก็บแล้ว</span> : null}
              </div>
              <p className="mt-1 text-sm">
                {sourceLabel(lead.source)}
                {lead.formName ? ` · ${formLabel(lead.formName)}` : ""} · {ownersById[lead.ownerId ?? ""] || "ยังไม่มีผู้ดูแล"} ·{" "}
                {formatMoney(lead.estimatedValue)} · {lead.phone || lead.email || "ไม่มีช่องทางติดต่อ"} · {formatThaiDateTime(lead.updatedAt)}
              </p>
              {interest ? <p className="mt-2 text-sm text-[#0B1F33]">{interest}</p> : null}
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <form action={changeLeadStage} className="grid gap-2">
                  <input type="hidden" name="leadId" value={lead.id} />
                  <label className="text-xs font-bold">
                    ปรับขั้น
                    <select className="crm-select" name="stageId" defaultValue={lead.stageId}>
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.nameTh}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button className="kpi-button" type="submit">
                    ปรับขั้น
                  </button>
                </form>
                <form action={assignLeadOwner} className="grid gap-2">
                  <input type="hidden" name="leadId" value={lead.id} />
                  <label className="text-xs font-bold">
                    มอบหมาย
                    <select className="crm-select" name="ownerId" defaultValue={lead.ownerId ?? ""}>
                      <option value="">ยังไม่กำหนด</option>
                      {owners.map((owner) => (
                        <option key={owner.id} value={owner.id}>
                          {owner.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button className="kpi-button" type="submit">
                    มอบหมาย
                  </button>
                </form>
              </div>
              <div className="mt-3">
                <LeadArchiveButton leadId={lead.id} archived={archived} compact />
              </div>
            </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
