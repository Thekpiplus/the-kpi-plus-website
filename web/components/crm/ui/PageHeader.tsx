import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className="crm-page-header">
      <div className="crm-page-header-copy">
        {eyebrow ? <p className="crm-page-eyebrow">{eyebrow}</p> : null}
        <h1 className="crm-page-title">{title}</h1>
        {description ? <p className="crm-page-desc">{description}</p> : null}
      </div>
      {actions ? <div className="crm-page-actions">{actions}</div> : null}
    </header>
  );
}
