import Link from "next/link";
import { partnerList, partnerTierLabel, statusLabel } from "@/lib/partners/queries";

export default async function PartnerListPage() {
  const partners = await partnerList();
  return (
    <div className="crm-grid">
      <h1 className="text-3xl font-extrabold text-[#3B3B3B]">รายชื่อพาร์ตเนอร์</h1>
      <section className="crm-card">
        <ul className="grid gap-3">
          {partners.map((partner) => (
            <li key={partner.id}>
              <Link href={`/crm/partners/${partner.id}`} className="font-semibold text-[#0B6660]">
                {partner.displayName}
              </Link>
              <p className="text-sm">
                {partnerTierLabel(partner.tier)} · {statusLabel(partner.status)} · KYC {statusLabel(partner.kycStatus)} · ค้าง{" "}
                {partner.outstandingLabel}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
