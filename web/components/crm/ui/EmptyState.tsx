import type { ReactNode } from "react";

export function EmptyState({
  title,
  body,
  action,
  filtered = false,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
  /** True when the empty view is caused by search/filter, not an empty dataset. */
  filtered?: boolean;
}) {
  return (
    <div className={`crm-empty${filtered ? " is-filtered" : ""}`} role="status">
      <div className="crm-empty-mark" aria-hidden="true">
        {filtered ? "⌕" : "◇"}
      </div>
      <h2 className="crm-empty-title">{title}</h2>
      {body ? <p className="crm-empty-body">{body}</p> : null}
      {action ? <div className="crm-empty-action">{action}</div> : null}
    </div>
  );
}
