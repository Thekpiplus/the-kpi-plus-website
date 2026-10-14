import type { ReactNode } from "react";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="crm-empty">
      <div className="crm-empty-mark" aria-hidden="true">
        ◇
      </div>
      <h2 className="crm-empty-title">{title}</h2>
      {body ? <p className="crm-empty-body">{body}</p> : null}
      {action ? <div className="crm-empty-action">{action}</div> : null}
    </div>
  );
}
