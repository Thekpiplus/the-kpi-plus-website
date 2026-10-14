import type { Metadata } from "next";
import "./admin-design.css";

export const metadata: Metadata = {
  title: "Admin Design Lab | The KPI Plus",
  robots: { index: false, follow: false },
};

export default function AdminDesignLayout({ children }: { children: React.ReactNode }) {
  return children;
}
