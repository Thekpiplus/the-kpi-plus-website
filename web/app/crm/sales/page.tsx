import Link from "next/link";
import { completeActivity } from "@/lib/crm/actions";
import { formatThaiDateTime, leadOriginCounts, todayLists } from "@/lib/crm/queries";
import { sourceLabel } from "@/lib/crm/sources";

export default async function SalesHomePage() {
  const [lists, origins] = await Promise.all([todayLists(), leadOriginCounts()]);

  return (
    <div className="crm-grid">
      <div>
        <h1 className="text-3xl font-extrabold text-[#3B3B3B]">Sales · Lead Management</h1>
        <p className="mt-2">งานขายวันนี้ ลีดจากเว็บไซต์และลีดที่คีย์เองอยู่ในระบบเดียวกัน</p>
      </div>

      <div className="kpi-grid-3">
        <Link href="/crm/leads?origin=web" className="crm-card no-underline">
          <p className="text-sm">ลีดจากเว็บไซต์</p>
          <p className="mt-2 text-3xl font-extrabold text-[#3B3B3B]">{origins.web}</p>
        </Link>
        <Link href="/crm/leads?origin=manual" className="crm-card no-underline">
          <p className="text-sm">ลีดที่คีย์เอง / แหล่งอื่น</p>
          <p className="mt-2 text-3xl font-extrabold text-[#3B3B3B]">{origins.manual}</p>
        </Link>
        <Link href="/crm/activities" className="crm-card no-underline">
          <p className="text-sm">กิจกรรมเกินกำหนด</p>
          <p className="mt-2 text-3xl font-extrabold text-[#3B3B3B]">{lists.overdue.length}</p>
        </Link>
      </div>

      <form className="crm-card grid gap-3 md:grid-cols-[1fr_auto]" method="get" action="/crm/leads">
        <label className="text-sm font-bold">
          ค้นหาลีด
          <input className="crm-field" name="q" placeholder="ชื่อ กิจการ เบอร์ อีเมล" />
        </label>
        <button className="kpi-button self-end" type="submit">
          ค้นหา
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link href="/crm/leads/new" className="kpi-button">
          คีย์ลีด
        </Link>
        <Link href="/crm/pipeline" className="kpi-button">
          เปิด Pipeline
        </Link>
        <Link href="/crm/leads" className="kpi-button">
          ลีดทั้งหมด
        </Link>
      </div>

      <Section title="เกินกำหนด" items={lists.overdue} overdue />
      <Section title="ครบกำหนดวันนี้" items={lists.dueToday} />
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">ลีดใหม่ที่รอตอบ</h2>
        <ul className="mt-3 grid gap-2">
          {lists.firstResponse.length === 0 ? <li>ไม่มีรายการ</li> : null}
          {lists.firstResponse.map((item) => (
            <li key={item.id}>
              <Link href={`/crm/leads/${item.lead.id}`} className="font-semibold text-[#0B6660]">
                {item.lead.contactName} · {item.lead.businessName || item.lead.formName}
              </Link>
              <span className="ml-2 text-sm">{sourceLabel(item.lead.source)}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="crm-card">
        <h2 className="text-xl font-extrabold">ลีดที่ยังไม่มีกิจกรรมถัดไป</h2>
        <ul className="mt-3 grid gap-2">
          {lists.noNext.length === 0 ? <li>ไม่มีรายการ</li> : null}
          {lists.noNext.map((lead) => (
            <li key={lead.id}>
              <Link href={`/crm/leads/${lead.id}`} className="font-semibold text-[#0B6660]">
                {lead.contactName} · {lead.businessName || lead.formName}
              </Link>
              <span className="ml-2 text-sm">{lead.stage.nameTh}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Section({
  title,
  items,
  overdue,
}: {
  title: string;
  items: { id: string; title: string; dueAt: Date; lead: { id: string; contactName: string; businessName: string; formName?: string } }[];
  overdue?: boolean;
}) {
  return (
    <section className={`crm-card ${overdue && items.length ? "crm-overdue" : ""}`}>
      <h2 className="text-xl font-extrabold">{title}</h2>
      <ul className="mt-3 grid gap-2">
        {items.length === 0 ? <li>ไม่มีรายการ</li> : null}
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/crm/leads/${item.lead.id}`} className="font-semibold text-[#0B6660]">
              {item.lead.contactName} · {item.title}
            </Link>
            <span className="ml-2 text-sm">{formatThaiDateTime(item.dueAt)}</span>
            <form action={completeActivity} className="mt-2 grid gap-2 max-w-lg">
              <input type="hidden" name="activityId" value={item.id} />
              <input className="crm-field" name="outcome" placeholder="ผลลัพธ์การติดตาม" />
              <input className="crm-field" type="datetime-local" name="nextDueAt" />
              <input className="crm-field" name="nextTitle" placeholder="นัดติดตามครั้งถัดไป" />
              <button className="kpi-button" type="submit">
                ปิดแล้วตั้งติดตามต่อ
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
