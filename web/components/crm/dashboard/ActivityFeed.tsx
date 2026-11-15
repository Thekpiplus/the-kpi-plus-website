import type { DashActivity } from "./types";

export function ActivityFeed({ items }: { items: DashActivity[] }) {
  return (
    <section className="kpi-dash-a-panel" aria-label="กิจกรรมสำคัญล่าสุด">
      <div className="kpi-dash-a-section-head">
        <div>
          <h2>กิจกรรมสำคัญล่าสุด</h2>
          <p>สรุปสถานะจากข้อมูลที่มีตอนนี้ — ไม่ใช่รายการที่ต้องทำทันที</p>
        </div>
      </div>
      {items.length ? (
        <ul className="kpi-dash-a-activity">
          {items.slice(0, 4).map((item) => (
            <li key={item.title} className={`is-${item.tone}`}>
              <span className="kpi-dash-a-activity-dot" aria-hidden="true" />
              <div>
                <p className="kpi-dash-a-activity-title">{item.title}</p>
                <p className="kpi-dash-a-activity-meta">{item.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="kpi-dash-a-empty">
          <strong>ยังไม่มีกิจกรรมล่าสุด</strong>
          <p>เมื่อมีลีด พาร์ตเนอร์ หรือเนื้อหาใหม่ จะแสดงที่นี่</p>
        </div>
      )}
    </section>
  );
}
