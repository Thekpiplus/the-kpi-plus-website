import { redirect } from "next/navigation";

export default function SystemsSalesRedirectPage() {
  redirect("/crm/systems?department=sales");
}
