import { ReviewLinkGenerator } from "@/components/ReviewLinkGenerator";
import { ToolPage } from "@/components/ToolPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/tools/hotel-review-link");

export default function Page() {
  return (
    <ToolPage
      route="/tools/hotel-review-link"
      eyebrow="Hotel Review Link"
      title="สร้างลิงก์รีวิว Google สำหรับธุรกิจของคุณ"
      body="ค้นหาโรงแรม สปา ร้านอาหาร หรือธุรกิจท้องถิ่นบน Google แล้วได้ลิงก์เขียนรีวิวของรายการนั้น พร้อมคัดลอกและดาวน์โหลด QR Code"
    >
      <p className="mb-8 max-w-3xl text-sm leading-7 text-[#555555]">
        ใช้กับธุรกิจที่มีหน้า Google ได้ ลูกค้าต้องมีบัญชี Google จึงจะโพสต์รีวิวได้ เครื่องมือนี้ไม่ขอข้อมูลติดต่อ และไม่ใช้เพื่อกระตุ้นรีวิวแลกของรางวัล
      </p>
      <ReviewLinkGenerator />
    </ToolPage>
  );
}
