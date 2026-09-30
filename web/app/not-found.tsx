import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function NotFound() {
  return (
    <SiteShell locale="th" route="/404">
      <section className="kpi-section">
        <p className="kpi-kicker text-[#0B6660]">404</p>
        <h1 className="kpi-h1 mt-4 text-[#3B3B3B]">ไม่พบหน้านี้</h1>
        <p className="kpi-lead mt-5">ลิงก์นี้อาจถูกย้ายหรือไม่มีในเว็บไซต์แล้ว เลือกหน้าหลักด้านล่างเพื่อไปต่อ</p>
        <div className="kpi-actions">
          <Link href="/" className="kpi-button">
            หน้าแรก
          </Link>
          <Link href="/solutions" className="kpi-button-ghost">
            โซลูชัน
          </Link>
          <Link href="/insights" className="kpi-button-ghost">
            บทความและมุมมอง
          </Link>
          <Link href="/contact" className="kpi-button-ghost">
            ติดต่อเรา
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
