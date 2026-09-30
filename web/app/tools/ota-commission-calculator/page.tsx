import { OtaCalculator } from "@/components/calculators";
import { ToolPage } from "@/components/ToolPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/tools/ota-commission-calculator");

export default function Page() {
  return (
    <ToolPage
      route="/tools/ota-commission-calculator"
      eyebrow="เครื่องคำนวณค่าคอมมิชชัน OTA"
      title="เครื่องคำนวณค่าคอมมิชชัน OTA"
      body="ดูว่ารายได้ OTA เหลือเท่าไรหลังหัก Commission และต้นทุนนี้คิดเป็นเงินเท่าไร"
    >
      <OtaCalculator />
    </ToolPage>
  );
}
