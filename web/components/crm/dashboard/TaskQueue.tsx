import Link from "next/link";
import type { ReactNode } from "react";
import type { DashTask } from "./types";

const PRIORITY_LABEL = {
  urgent: "ด่วน",
  medium: "ปานกลาง",
  low: "ทั่วไป",
} as const;

export function TaskQueue({
  tasks,
  headerAction,
  emptyAction,
}: {
  tasks: DashTask[];
  headerAction?: ReactNode;
  emptyAction?: ReactNode;
}) {
  return (
    <section className="kpi-dash-a-panel" aria-label="งานที่ต้องดำเนินการ">
      <div className="kpi-dash-a-section-head">
        <div>
          <h2>
            งานที่ต้องดำเนินการ
            {tasks.length > 0 ? <span className="kpi-dash-a-count">{tasks.length}</span> : null}
          </h2>
          <p>เรียงตามความเร่งด่วนจากคิวงานจริงในระบบ</p>
        </div>
        {headerAction}
      </div>

      {tasks.length ? (
        <ul className="kpi-dash-a-tasks">
          {tasks.map((task) => (
            <li key={`${task.href}-${task.title}`} className="kpi-dash-a-task">
              <span className={`kpi-dash-a-task-mark is-${task.priority}`} aria-hidden="true" />
              <span>
                <strong>{task.title}</strong>
                <em>{task.meta}</em>
              </span>
              <div className="kpi-dash-a-task-aside">
                <b className={`kpi-dash-a-priority is-${task.priority}`}>
                  <span className="sr-only">ความสำคัญ: </span>
                  {PRIORITY_LABEL[task.priority]}
                </b>
                <Link href={task.href} className="kpi-dash-a-btn is-brand kpi-dash-a-btn-sm">
                  เปิด
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="kpi-dash-a-empty">
          <strong>ยังไม่มีงานค้างตอนนี้</strong>
          <p>เมื่องานถึงกำหนดหรือเกินกำหนด รายการจะมาแสดงที่นี่ตามความเร่งด่วน</p>
          {emptyAction}
        </div>
      )}
    </section>
  );
}
