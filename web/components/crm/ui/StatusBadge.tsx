type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "lime";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "is-neutral",
  success: "is-success",
  warning: "is-warning",
  danger: "is-danger",
  info: "is-info",
  lime: "is-lime",
};

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: Tone }) {
  return <span className={`crm-status ${TONE_CLASS[tone]}`}>{label}</span>;
}
