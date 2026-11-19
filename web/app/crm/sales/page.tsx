import Link from "next/link";
import { LeadsPageChrome } from "@/components/crm/leads/LeadsPageChrome";
import { SalesChannelsVisual } from "@/components/crm/leads/SalesChannelsVisual";
import {
  SalesTodayBoard,
  type SalesTodayFilter,
  type SalesTodayItem,
} from "@/components/crm/leads/SalesTodayBoard";
import { NewLeadOpenButton } from "@/components/crm/ui/NewLeadModal";
import {
  formatRelativeThai,
  formatThaiDateTime,
  leadSourceCounts,
  recentLeadEvents,
  todayLists,
} from "@/lib/crm/queries";
import { sourceLabel } from "@/lib/crm/sources";

function formatThaiDateToday(value = new Date()) {
  return new Intl.DateTimeFormat("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(value);
}

function parseFilter(value?: string): SalesTodayFilter {
  if (value === "overdue" || value === "today" || value === "first" || value === "new") return value;
  return "all";
}

export default async function SalesHomePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const filter = parseFilter(params.filter);
  const q = params.q?.trim() ?? "";
  const emptyLists = {
    overdue: [] as Awaited<ReturnType<typeof todayLists>>["overdue"],
    dueToday: [] as Awaited<ReturnType<typeof todayLists>>["dueToday"],
    upcoming: [] as Awaited<ReturnType<typeof todayLists>>["upcoming"],
    firstResponse: [] as Awaited<ReturnType<typeof todayLists>>["firstResponse"],
    noNext: [] as Awaited<ReturnType<typeof todayLists>>["noNext"],
    newLeads: [] as Awaited<ReturnType<typeof todayLists>>["newLeads"],
  };
  // Prefer today board first; side panels can fail soft without blocking the page.
  const lists = await Promise.race([
    todayLists().catch(() => emptyLists),
    new Promise<typeof emptyLists>((resolve) => setTimeout(() => resolve(emptyLists), 5000)),
  ]);
  const [events, sourceRows] = await Promise.all([
    recentLeadEvents(8).catch(() => [] as Awaited<ReturnType<typeof recentLeadEvents>>),
    leadSourceCounts(6).catch(() => [] as Awaited<ReturnType<typeof leadSourceCounts>>),
  ]);

  const seen = new Set<string>();
  const items: SalesTodayItem[] = [];

  function pushItem(item: SalesTodayItem) {
    if (seen.has(item.leadId)) return;
    seen.add(item.leadId);
    items.push(item);
  }

  for (const item of lists.overdue) {
    pushItem({
      key: `overdue-${item.id}`,
      activityId: item.id,
      leadId: item.lead.id,
      contactName: item.lead.contactName,
      businessName: item.lead.businessName || item.lead.formName || "ไม่มีชื่อกิจการ",
      scope: item.lead.stage?.nameTh || item.title,
      channel: sourceLabel(item.lead.source),
      lastContactLabel: formatRelativeThai(item.lead.lastContactAt),
      dueLabel: formatThaiDateTime(item.dueAt),
      status: "overdue",
      title: item.title,
    });
  }

  for (const item of lists.dueToday) {
    pushItem({
      key: `today-${item.id}`,
      activityId: item.id,
      leadId: item.lead.id,
      contactName: item.lead.contactName,
      businessName: item.lead.businessName || item.lead.formName || "ไม่มีชื่อกิจการ",
      scope: item.lead.stage?.nameTh || item.title,
      channel: sourceLabel(item.lead.source),
      lastContactLabel: formatRelativeThai(item.lead.lastContactAt),
      dueLabel: formatThaiDateTime(item.dueAt),
      status: "today",
      title: item.title,
    });
  }

  for (const item of lists.firstResponse) {
    pushItem({
      key: `first-${item.id}`,
      activityId: item.id,
      leadId: item.lead.id,
      contactName: item.lead.contactName,
      businessName: item.lead.businessName || item.lead.formName || "ไม่มีชื่อกิจการ",
      scope: item.lead.stage?.nameTh || "รอตอบครั้งแรก",
      channel: sourceLabel(item.lead.source),
      lastContactLabel: formatRelativeThai(item.lead.lastContactAt || item.createdAt),
      status: "first",
      title: item.title,
    });
  }

  for (const lead of lists.newLeads) {
    pushItem({
      key: `new-${lead.id}`,
      leadId: lead.id,
      contactName: lead.contactName,
      businessName: lead.businessName || lead.formName || "ไม่มีชื่อกิจการ",
      scope: lead.stage?.nameTh || "ลีดใหม่",
      channel: sourceLabel(lead.source),
      lastContactLabel: formatRelativeThai(lead.lastContactAt || lead.createdAt),
      status: "new",
    });
  }

  const counts = {
    all: items.length,
    overdue: items.filter((item) => item.status === "overdue").length,
    today: items.filter((item) => item.status === "today").length,
    first: items.filter((item) => item.status === "first").length,
    new: items.filter((item) => item.status === "new").length,
  };

  const channels = sourceRows.map((row) => ({
    source: row.source,
    label: sourceLabel(row.source),
    count: row.count,
  }));

  const todayLabel = formatThaiDateToday();
  const notice =
    params.saved === "1" ? "บันทึกผลการติดตามแล้ว — รายการจะอัปเดตตามคิวงาน" : null;

  function kpiHref(next: SalesTodayFilter) {
    const query = new URLSearchParams();
    if (next !== "all") query.set("filter", next);
    if (q) query.set("q", q);
    const value = query.toString();
    return value ? `/crm/sales?${value}` : "/crm/sales";
  }

  return (
    <LeadsPageChrome
      title="ต้องติดต่อวันนี้"
      description={`${todayLabel} · คิวติดตามตามความเร่งด่วน`}
      notice={notice}
      actions={
        <>
          <NewLeadOpenButton className="kpi-leads-btn-primary">เพิ่มลีดใหม่</NewLeadOpenButton>
          <Link href="/crm/pipeline" className="kpi-leads-btn-secondary">
            ดู Pipeline
          </Link>
        </>
      }
    >
      <section className="kpi-leads-kpi" aria-label="สรุปงานวันนี้">
        <Link
          href={kpiHref("overdue")}
          className={`kpi-leads-stat is-overdue${counts.overdue > 0 ? " has-value" : ""}${
            filter === "overdue" ? " is-selected" : ""
          }`}
        >
          <span className="kpi-leads-stat-label">เกินกำหนด</span>
          <strong className="kpi-leads-stat-value">{counts.overdue}</strong>
          <span className="kpi-leads-stat-hint">ต้องติดตามก่อน</span>
        </Link>
        <Link
          href={kpiHref("today")}
          className={`kpi-leads-stat is-today${filter === "today" ? " is-selected" : ""}`}
        >
          <span className="kpi-leads-stat-label">ถึงกำหนดวันนี้</span>
          <strong className="kpi-leads-stat-value">{counts.today}</strong>
          <span className="kpi-leads-stat-hint">คิววันนี้</span>
        </Link>
        <Link
          href={kpiHref("first")}
          className={`kpi-leads-stat is-waiting${filter === "first" ? " is-selected" : ""}`}
        >
          <span className="kpi-leads-stat-label">รอตอบกลับ</span>
          <strong className="kpi-leads-stat-value">{counts.first}</strong>
          <span className="kpi-leads-stat-hint">ตอบครั้งแรก</span>
        </Link>
        <Link
          href={kpiHref("new")}
          className={`kpi-leads-stat is-new${filter === "new" ? " is-selected" : ""}`}
        >
          <span className="kpi-leads-stat-label">ลีดใหม่</span>
          <strong className="kpi-leads-stat-value">{counts.new}</strong>
          <span className="kpi-leads-stat-hint">ขั้นเริ่มต้น</span>
        </Link>
      </section>

      <div className="kpi-leads-layout">
        <div className="kpi-leads-main-stack">
          <section className="kpi-leads-panel kpi-leads-channels-panel">
            <header className="kpi-leads-panel-head">
              <h2>ช่องทางที่ลีดเข้ามา</h2>
              <p>โดนัทสัดส่วน + กราฟแท่งจากลีดที่ใช้งานอยู่ · คลิกแท่งเพื่อเปิดช่องทางนั้น</p>
            </header>
            {channels.length === 0 ? (
              <div className="kpi-leads-empty">
                <h3>ยังไม่มีข้อมูลช่องทาง</h3>
                <p>เมื่อมีลีดใน Pipeline จะแสดงสัดส่วนที่นี่</p>
              </div>
            ) : (
              <SalesChannelsVisual channels={channels} />
            )}
          </section>

          <SalesTodayBoard items={items} filter={filter} q={q} counts={counts} />
        </div>

        <aside className="kpi-leads-side-stack" aria-label="ภาพรวมด้านข้าง">
          <section className="kpi-leads-panel">
            <header className="kpi-leads-panel-head">
              <h2>ลีดใหม่ที่สุด</h2>
              <p>ลีดในขั้นเริ่มต้น</p>
            </header>
            {lists.newLeads.length === 0 ? (
              <div className="kpi-leads-empty">
                <h3>ยังไม่มีลีดใหม่</h3>
                <p>ลีดที่เข้าขั้นเริ่มต้นจะแสดงที่นี่</p>
              </div>
            ) : (
              <ul className="kpi-leads-side-list">
                {lists.newLeads.slice(0, 6).map((lead) => (
                  <li key={lead.id} className="kpi-leads-side-item">
                    <span className="kpi-leads-side-dot" aria-hidden="true" />
                    <div>
                      <Link href={`/crm/leads/${lead.id}`}>
                        <strong>{lead.contactName}</strong>
                      </Link>
                      <em>{lead.businessName || lead.formName || "ไม่มีชื่อกิจการ"}</em>
                      <span>
                        {sourceLabel(lead.source)} · {formatRelativeThai(lead.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="kpi-leads-panel">
            <header className="kpi-leads-panel-head">
              <h2>กิจกรรมล่าสุด</h2>
              <p>เหตุการณ์จากลีดในระบบ</p>
            </header>
            {events.length === 0 ? (
              <div className="kpi-leads-empty">
                <h3>ยังไม่มีกิจกรรม</h3>
                <p>เมื่อมีการติดตามหรือเปลี่ยนขั้น จะแสดงที่นี่</p>
              </div>
            ) : (
              <ul className="kpi-leads-side-list">
                {events.map((event) => (
                  <li key={event.id} className="kpi-leads-side-item">
                    <span className="kpi-leads-side-dot" aria-hidden="true" />
                    <div>
                      <Link href={`/crm/leads/${event.lead.id}`}>
                        <strong>{event.detail || event.type}</strong>
                      </Link>
                      <em>
                        {event.lead.contactName}
                        {event.lead.businessName ? ` · ${event.lead.businessName}` : ""}
                      </em>
                      <span>{formatRelativeThai(event.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </LeadsPageChrome>
  );
}
