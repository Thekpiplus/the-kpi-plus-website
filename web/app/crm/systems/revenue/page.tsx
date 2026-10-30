import { redirect } from "next/navigation";

export default function SystemsRevenueRedirectPage() {
  redirect("/crm/systems?department=revenue");
}
