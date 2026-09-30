import Link from "next/link";
import { completeActivity } from "@/lib/crm/actions";
import { ACTIVITY_LABEL } from "@/lib/crm/constants";
import { formatThaiDateTime, openActivities } from "@/lib/crm/queries";

export default async function ActivitiesPage() {
  const items = await openActivities();
  const now = Date.now();

  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">กิจกรรมที่ต้องทำ</h1>
      <section className="crm-card">
        {items.length === 0 ? <p>ไม่มีกิจกรรมค้าง</p> : null}
        <ul className="grid gap-4">
          {items.map((item) => {
            const overdue = item.dueAt.getTime() < now;
            return (
              <li key={item.id} className={overdue ? "crm-overdue rounded-xl p-3" : "rounded-xl border border-[#E3E8EB] p-3"}>
                <Link href={`/crm/leads/${item.lead.id}`} className="font-semibold text-[#0B6660]">
                  {item.lead.contactName} · {item.lead.businessName || item.lead.formName}
                </Link>
                <p className="text-sm">
                  {ACTIVITY_LABEL[item.type as keyof typeof ACTIVITY_LABEL] ?? item.type} · {item.title} ·{" "}
                  {formatThaiDateTime(item.dueAt)}
                  {overdue ? " · เกินกำหนด" : ""}
                </p>
                <form action={completeActivity} className="mt-3 grid gap-2 max-w-lg">
                  <input type="hidden" name="activityId" value={item.id} />
                  <input className="crm-field" name="outcome" placeholder="ผลลัพธ์" />
                  <input className="crm-field" type="datetime-local" name="nextDueAt" />
                  <input className="crm-field" name="nextTitle" placeholder="กิจกรรมถัดไป" />
                  <button className="kpi-button" type="submit">
                    ปิดกิจกรรม
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
