import { redirect } from "next/navigation";

export default function ManagementScopeRedirectPage() {
  redirect("/crm/management/properties");
}
