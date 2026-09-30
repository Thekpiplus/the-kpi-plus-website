import Link from "next/link";
import { HeroCta } from "@/components/HeroCta";
import { SiteShell } from "@/components/SiteShell";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/tools");

const tools = [
  {
    num: "01",
    eyebrow: "การค้นหาและการมองเห็น",
    title: "ตรวจสุขภาพการค้นหาเว็บไซต์โรงแรม",
    body: "ตรวจว่าเว็บไซต์โรงแรมพร้อมแค่ไหนสำหรับ Google, AI Search และผู้ใช้งานบนมือถือ",
    href: "/tools/hotel-searchability-check",
  },
  {
    num: "02",
    eyebrow: "รายได้และกำไร",
    title: "เครื่องคำนวณรายได้และกำไรโรงแรม",
    body: "ดูรายได้ห้องพัก ต้นทุนช่องทางขาย ต้นทุนหลัก และ GOP จากข้อมูลที่โรงแรมมีอยู่",
    href: "/tools/hotel-profit-calculator",
  },
  {
    num: "03",
    eyebrow: "วางแผนงบประมาณ",
    title: "เครื่องคำนวณ Budget โรงแรม",
    body: "ตั้งงบรายได้ห้องพักแบบเร็ว ๆ จากจำนวนห้อง วันเปิดขาย เป้าหมาย Occupancy และ ADR",
    href: "/tools/hotel-budget-calculator",
  },
  {
    num: "04",
    eyebrow: "ต้นทุนช่องทางขาย",
    title: "เครื่องคำนวณค่าคอมมิชชัน OTA",
    body: "ดูว่ารายได้ OTA เหลือเท่าไรหลังหัก Commission และต้นทุนนี้คิดเป็นเงินเท่าไร",
    href: "/tools/ota-commission-calculator",
  },
  {
    num: "05",
    eyebrow: "โครงสร้างราคาและภาษี",
    title: "เครื่องคำนวณ VAT และ Service Charge โรงแรม",
    body: "แยกราคาขายออกเป็นยอดก่อนภาษี Service Charge VAT ภาษีหัก ณ ที่จ่าย และยอดสุทธิ",
    href: "/tools/hotel-vat-service-charge-calculator",
  },
  {
    num: "06",
    eyebrow: "ตัวชี้วัดรายได้ประจำวัน",
    title: "เครื่องคำนวณ RevPAR, ADR และ Occupancy",
    body: "คำนวณ RevPAR, ADR หรือ Occupancy จากข้อมูลอีกสองตัวแปร",
    href: "/tools/revpar-calculator",
  },
  {
    num: "07",
    eyebrow: "รีวิวบน Google",
    title: "สร้างลิงก์รีวิว Google",
    body: "ค้นหาธุรกิจบน Google แล้วได้ลิงก์เขียนรีวิวของรายการนั้น พร้อมคัดลอกและดาวน์โหลด QR Code",
    href: "/tools/hotel-review-link",
  },
];

export default function ToolsPage() {
  return (
    <SiteShell locale="th" route="/tools">
      <section className="kpi-hero">
        <div className="kpi-wrap">
          <p className="kpi-kicker text-[#F2F8E2]">เครื่องมือฟรีสำหรับโรงแรม</p>
          <h1 className="kpi-h1 mt-5">เครื่องมือที่ช่วยให้เข้าใจตัวเลขและตัดสินใจเรื่องโรงแรมได้ง่ายขึ้น</h1>
          <p className="kpi-lead mt-5 text-white/72">
            เครื่องมือสำหรับเจ้าของโรงแรม GM และ Revenue Manager ที่ต้องดูเรื่องรายได้ ราคา กำไร ช่องทางการขาย และการรีวิวบน Google
          </p>
          <HeroCta locale="th" className="mt-8" />
        </div>
      </section>
      <section className="kpi-section">
        <p className="kpi-kicker text-[#0B6660]">เลือกเครื่องมือ</p>
        <h2 className="kpi-h2 mt-4">เริ่มจากโจทย์ที่คุณกำลังต้องการคำตอบ</h2>
        <div className="kpi-grid-2 mt-10">
          {tools.map((tool) => (
            <article key={tool.href} className="kpi-card p-7">
              <p className="text-sm font-extrabold text-[#0B6660]">
                {tool.num} · {tool.eyebrow}
              </p>
              <h3 className="mt-4 text-2xl font-extrabold">{tool.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#555555]">{tool.body}</p>
              <Link href={tool.href} className="mt-6 inline-flex font-extrabold text-[#0B6660]">
                ใช้เครื่องมือฟรี
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
