import { normalizeRole, roleLabel } from "@/lib/crm/roles";

export function RoleBadge({ role }: { role: string }) {
  const key = normalizeRole(role);
  return <span className={`crm-role-badge is-${key}`}>{roleLabel(role)}</span>;
}
