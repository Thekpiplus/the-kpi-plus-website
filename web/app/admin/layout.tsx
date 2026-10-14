import { CrmThemeScript } from "@/components/crm/CrmThemeScript";
import "../crm/crm.css";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Admin | The KPI Plus",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CrmThemeScript />
      <div className="crm-shell kpi-locale-th">{children}</div>
    </>
  );
}
