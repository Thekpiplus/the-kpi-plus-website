type MetricCardProps = {
  label: string;
  value: string;
  /** Known public context only — period, comparison, currency. Never TODOs. */
  lines?: string[];
  status?: string;
  tone?: "lime" | "yellow" | "amber";
};

const toneClass = {
  lime: "metric-card--lime",
  yellow: "metric-card--yellow",
  amber: "metric-card--amber",
} as const;

const TONES = ["lime", "yellow", "amber"] as const;

export function metricCardTone(index: number): MetricCardProps["tone"] {
  return TONES[index % TONES.length];
}

export function MetricCard({
  label,
  value,
  lines = [],
  status = "Sample data",
  tone = "lime",
}: MetricCardProps) {
  const known = lines.filter((line) => line.trim());
  return (
    <article className={`metric-card ${toneClass[tone]}`}>
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value kpi-latin">{value}</strong>
      {known.map((line) => (
        <span key={line} className="metric-card__context">
          {line}
        </span>
      ))}
      <span className="metric-card__status">{status}</span>
    </article>
  );
}
