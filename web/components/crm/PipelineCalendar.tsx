import Link from "next/link";
import { formatMoney, formatThaiDateTime } from "@/lib/crm/queries";
import { flattenPipelineLeads, type PipelineStage } from "@/components/crm/pipeline-types";

const WEEKDAYS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

function monthKeyOf(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function parseMonth(value?: string) {
  if (value && /^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-").map(Number);
    return new Date(year, month - 1, 1);
  }
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function shiftMonth(base: Date, delta: number) {
  return new Date(base.getFullYear(), base.getMonth() + delta, 1);
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function PipelineCalendar({
  stages,
  month,
}: {
  stages: PipelineStage[];
  month?: string;
}) {
  const start = parseMonth(month);
  const currentKey = monthKeyOf(start);
  const prevKey = monthKeyOf(shiftMonth(start, -1));
  const nextKey = monthKeyOf(shiftMonth(start, 1));
  const today = new Date();

  const leads = flattenPipelineLeads(stages);
  const scheduled = leads.filter((lead) => lead.nextActivityAt);
  const unscheduled = leads.filter((lead) => !lead.nextActivityAt);

  const byDay = new Map<string, typeof scheduled>();
  for (const lead of scheduled) {
    const date = new Date(lead.nextActivityAt!);
    const key = dayKey(date);
    const list = byDay.get(key) ?? [];
    list.push(lead);
    byDay.set(key, list);
  }

  const firstWeekday = (start.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(start.getFullYear(), start.getMonth(), day));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Intl.DateTimeFormat("th-TH", {
    month: "long",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(start);

  return (
    <div className="crm-pipe-cal">
      <div className="crm-pipe-cal-head">
        <div>
          <p className="crm-pipe-cal-eyebrow">นัดติดตามตามวัน</p>
          <h2>{monthLabel}</h2>
        </div>
        <div className="crm-pipe-cal-nav">
          <Link href={`/crm/pipeline?view=calendar&month=${prevKey}`} className="crm-users-secondary">
            เดือนก่อน
          </Link>
          <Link href={`/crm/pipeline?view=calendar&month=${monthKeyOf(today)}`} className="crm-users-secondary">
            วันนี้
          </Link>
          <Link href={`/crm/pipeline?view=calendar&month=${nextKey}`} className="crm-users-secondary">
            เดือนหน้า
          </Link>
        </div>
      </div>

      <div className="crm-pipe-cal-grid" role="grid" aria-label={`ปฏิทิน ${monthLabel}`}>
        {WEEKDAYS.map((day) => (
          <div key={day} className="crm-pipe-cal-weekday" role="columnheader">
            {day}
          </div>
        ))}
        {cells.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="crm-pipe-cal-cell is-empty" aria-hidden="true" />;
          }
          const key = dayKey(date);
          const items = byDay.get(key) ?? [];
          const isToday = sameDay(date, today);
          return (
            <div
              key={key}
              className={`crm-pipe-cal-cell${isToday ? " is-today" : ""}${items.length ? " has-items" : ""}`}
              role="gridcell"
            >
              <div className="crm-pipe-cal-day">
                <span>{date.getDate()}</span>
                {items.length ? <b>{items.length}</b> : null}
              </div>
              <ul className="crm-pipe-cal-list">
                {items.slice(0, 3).map((lead) => (
                  <li key={lead.id}>
                    <Link href={`/crm/leads/${lead.id}`}>
                      <strong>{lead.contactName}</strong>
                      <em>{lead.stageName}</em>
                    </Link>
                  </li>
                ))}
                {items.length > 3 ? <li className="crm-pipe-cal-more">+{items.length - 3} รายการ</li> : null}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="crm-pipe-cal-side">
        <section>
          <h3>นัดในเดือนนี้ ({scheduled.filter((lead) => {
            const d = new Date(lead.nextActivityAt!);
            return d.getFullYear() === start.getFullYear() && d.getMonth() === start.getMonth();
          }).length})</h3>
          <ul className="crm-pipe-cal-agenda">
            {scheduled
              .filter((lead) => {
                const d = new Date(lead.nextActivityAt!);
                return d.getFullYear() === start.getFullYear() && d.getMonth() === start.getMonth();
              })
              .sort((a, b) => new Date(a.nextActivityAt!).getTime() - new Date(b.nextActivityAt!).getTime())
              .map((lead) => (
                <li key={lead.id}>
                  <Link href={`/crm/leads/${lead.id}`}>
                    <strong>{lead.contactName}</strong>
                    <span>
                      {formatThaiDateTime(lead.nextActivityAt)} · {lead.stageName}
                    </span>
                    <em>{formatMoney(lead.estimatedValue)}</em>
                  </Link>
                </li>
              ))}
          </ul>
          {scheduled.every((lead) => {
            const d = new Date(lead.nextActivityAt!);
            return d.getFullYear() !== start.getFullYear() || d.getMonth() !== start.getMonth();
          }) ? (
            <p className="crm-pipe-cal-empty">ยังไม่มีนัดในเดือนนี้</p>
          ) : null}
        </section>

        <section>
          <h3>ยังไม่มีนัด ({unscheduled.length})</h3>
          {unscheduled.length === 0 ? (
            <p className="crm-pipe-cal-empty">ลีดทั้งหมดมีนัดติดตามแล้ว</p>
          ) : (
            <ul className="crm-pipe-cal-agenda">
              {unscheduled.map((lead) => (
                <li key={lead.id}>
                  <Link href={`/crm/leads/${lead.id}`}>
                    <strong>{lead.contactName}</strong>
                    <span>
                      {lead.businessName || "ไม่มีชื่อกิจการ"} · {lead.stageName}
                    </span>
                    <em>{formatMoney(lead.estimatedValue)}</em>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
