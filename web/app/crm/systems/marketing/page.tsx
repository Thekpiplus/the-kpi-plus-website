import { redirect } from "next/navigation";

export default function SystemsMarketingRedirectPage() {
  redirect("/crm/systems?department=marketing");
}
