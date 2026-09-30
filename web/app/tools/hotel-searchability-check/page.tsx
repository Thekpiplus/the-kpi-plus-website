import { SearchabilityCheck } from "@/components/SearchabilityCheck";
import { ToolPage } from "@/components/ToolPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/tools/hotel-searchability-check");

export default function Page() {
  return (
    <ToolPage
      route="/tools/hotel-searchability-check"
      eyebrow="เครื่องมือตรวจเว็บไซต์ฟรี"
      title="ตรวจว่าเว็บไซต์โรงแรมพร้อมแค่ไหนสำหรับการค้นหา"
      body="ตรวจว่าเว็บไซต์โรงแรมพร้อมแค่ไหนสำหรับ Google, AI Search และผู้ใช้งานบนมือถือ 1 URL เพื่อดู 3 คะแนนหลัก และ 3 สิ่งที่ควรปรับปรุง"
    >
      <p className="mb-8 max-w-3xl text-sm leading-7 text-[#555555]">
        ออกแบบให้ตรวจอย่างกระชับ ตรวจเฉพาะหน้าแรก robots.txt sitemap.xml และข้อมูลมือถือที่จำเป็น ไม่ได้ Crawl ทุกหน้า และไม่ใช้ AI คำนวณคะแนน
      </p>
      <SearchabilityCheck />
    </ToolPage>
  );
}
