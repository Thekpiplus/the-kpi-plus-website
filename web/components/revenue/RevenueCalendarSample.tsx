import type { Locale } from "@/lib/seo";

const DISPLAY = { width: 640, height: 400 } as const;
const DAYS = ["M", "T", "W", "T", "F", "S", "S"] as const;
const WEEK_LABELS = ["W1", "W2", "W3", "W4"] as const;
/** 0 = soft, 1 = shoulder, 2 = high. Deterministic sample only. */
const SAMPLE_DEMAND = [
  [2, 2, 2, 1, 1, 2, 2],
  [2, 1, 1, 0, 0, 1, 2],
  [1, 0, 0, 0, 1, 1, 2],
  [0, 0, 0, 1, 1, 2, 2],
] as const;
const FILL = ["#D7E3E1", "#EBE722", "#A2DC25"] as const;
const CELL = { size: 48, gap: 8 } as const;
const GRID_WIDTH = DAYS.length * CELL.size + (DAYS.length - 1) * CELL.gap;
const ORIGIN = { x: Math.round((DISPLAY.width - GRID_WIDTH) / 2 + 18), y: 52 } as const;

const calendarCopy = {
  th: {
    badge: "ตัวอย่างข้อมูล",
    title: "Revenue Calendar · มุมมอง 28 วัน · Sample data",
    compare: "เทียบช่วง High / Shoulder / Soft demand",
    caption: "ใช้มุมมองนี้เพื่อดูวันที่ควรตัดสินใจเรื่องราคา ช่องทาง หรือข้อเสนอ",
    high: "High demand",
    shoulder: "Shoulder",
    soft: "Soft demand",
    aria: "ปฏิทินรายได้ตัวอย่าง มุมมอง 28 วัน แสดงช่วงดีมานด์สูง สีเหลืองไหล่ และช่วงอ่อน ข้อมูลตัวอย่าง ไม่ใช่ผลลัพธ์ของโรงแรมจริง",
  },
  en: {
    badge: "Sample Visual",
    title: "Revenue Calendar · 28-day outlook · Sample data",
    compare: "Compared across high, shoulder, and soft demand",
    caption: "Use this view to see which dates need a rate, channel, or offer decision",
    high: "High demand",
    shoulder: "Shoulder",
    soft: "Soft demand",
    aria: "Sample 28-day revenue calendar showing high, shoulder, and soft demand bands. Sample data, not a real hotel result.",
  },
} as const;

export function RevenueCalendarSample({ locale }: { locale: Locale }) {
  const ui = locale === "th" ? calendarCopy.th : calendarCopy.en;

  return (
    <figure className="kpi-revenue-calendar">
      <div className="kpi-revenue-calendar-head">
        <p className="kpi-revenue-calendar-badge">{ui.badge}</p>
        <p className={`kpi-revenue-calendar-title${locale === "th" ? "" : " kpi-latin"}`}>{ui.title}</p>
        <p className="kpi-revenue-calendar-compare">{ui.compare}</p>
      </div>
      <div className="kpi-revenue-calendar-frame" style={{ aspectRatio: `${DISPLAY.width} / ${DISPLAY.height}` }}>
        <svg
          className="kpi-revenue-calendar-svg"
          viewBox={`0 0 ${DISPLAY.width} ${DISPLAY.height}`}
          width={DISPLAY.width}
          height={DISPLAY.height}
          role="img"
          aria-label={ui.aria}
          style={{ maxWidth: "100%", height: "auto" }}
        >
          <title>{ui.aria}</title>
          <rect width={DISPLAY.width} height={DISPLAY.height} fill="#FFFFFF" />
          {DAYS.map((day, index) => (
            <text
              key={`d-${index}`}
              x={ORIGIN.x + index * (CELL.size + CELL.gap) + CELL.size / 2}
              y={38}
              textAnchor="middle"
              className="kpi-revenue-calendar-axis"
            >
              {day}
            </text>
          ))}
          {SAMPLE_DEMAND.map((week, weekIndex) => {
            const y = ORIGIN.y + weekIndex * (CELL.size + CELL.gap);
            return (
              <g key={WEEK_LABELS[weekIndex]}>
                <text
                  x={ORIGIN.x - 16}
                  y={y + CELL.size / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className="kpi-revenue-calendar-axis"
                >
                  {WEEK_LABELS[weekIndex]}
                </text>
                {week.map((level, dayIndex) => {
                  const x = ORIGIN.x + dayIndex * (CELL.size + CELL.gap);
                  const isTarget = weekIndex === 1 && dayIndex === 3;
                  return (
                    <rect
                      key={`${weekIndex}-${dayIndex}`}
                      x={x}
                      y={y}
                      width={CELL.size}
                      height={CELL.size}
                      rx="8"
                      fill={FILL[level]}
                      stroke={isTarget ? "#0B1F33" : "none"}
                      strokeWidth={isTarget ? 2 : 0}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      <ul className="kpi-revenue-calendar-legend">
        <li>
          <span className="kpi-revenue-calendar-key kpi-revenue-calendar-key-high" aria-hidden="true" />
          {ui.high}
        </li>
        <li>
          <span className="kpi-revenue-calendar-key kpi-revenue-calendar-key-shoulder" aria-hidden="true" />
          {ui.shoulder}
        </li>
        <li>
          <span className="kpi-revenue-calendar-key kpi-revenue-calendar-key-soft" aria-hidden="true" />
          {ui.soft}
        </li>
      </ul>
      <figcaption className="kpi-revenue-calendar-caption">{ui.caption}</figcaption>
    </figure>
  );
}
