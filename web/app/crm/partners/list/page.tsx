import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { NewPartnerOpenButton } from "@/components/crm/ui/NewPartnerModal";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { StatusBadge } from "@/components/crm/ui/StatusBadge";
import { partnerList, partnerOverview, partnerTierLabel, statusLabel } from "@/lib/partners/queries";

function statusTone(status: string): "success" | "warning" | "danger" | "info" | "neutral" {
  if (status === "approved" || status === "active") return "success";
  if (status === "pending" || status === "under_review") return "warning";
  if (status === "rejected" || status === "suspended") return "danger";
  return "neutral";
}

function listHref(params: { q?: string; tier?: string; status?: string; kyc?: string }) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.tier) query.set("tier", params.tier);
  if (params.status) query.set("status", params.status);
  if (params.kyc) query.set("kyc", params.kyc);
  const value = query.toString();
  return value ? `/crm/partners/list?${value}` : "/crm/partners/list";
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "KP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default async function PartnerListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tier?: string; status?: string; kyc?: string }>;
}) {
  const params = await searchParams;
  const [partners, overview] = await Promise.all([
    partnerList({ q: params.q, tier: params.tier, status: params.status, kyc: params.kyc }),
    partnerOverview(),
  ]);
  const filtered = Boolean(params.q?.trim() || params.tier || params.status || params.kyc);
  const statusTabs = [
    { id: "", label: "ทั้งหมด", count: overview.total },
    { id: "pending", label: "รออนุมัติ", count: overview.applications },
    { id: "active", label: "ใช้งาน", count: overview.active },
  ];

  return (
    <div className="crm-partners">
      <PageHeader
        eyebrow="Partner Management"
        title="อนุมัติพาร์ตเนอร์"
        description="รายชื่อพาร์ตเนอร์ สถานะ KYC และยอดค้างจ่าย"
        actions={
          <div className="crm-partners-actions">
            <Link href="/crm/partners" className="crm-users-secondary">
              คิวงาน
            </Link>
            <NewPartnerOpenButton className="kpi-button">เพิ่มพาร์ตเนอร์</NewPartnerOpenButton>
          </div>
        }
      />

      <section className="crm-partners-bar" aria-label="สรุปพาร์ตเนอร์">
        <div className="crm-partners-metrics">
          <div>
            <span>ทั้งหมด</span>
            <strong>{overview.total}</strong>
          </div>
          <div>
            <span>รออนุมัติ</span>
            <strong>{overview.applications}</strong>
          </div>
          <div>
            <span>ใช้งานอยู่</span>
            <strong>{overview.active}</strong>
          </div>
          <div className="is-value">
            <span>ผลลัพธ์ที่แสดง</span>
            <strong>{partners.length}</strong>
          </div>
        </div>
        <nav className="crm-partners-tabs" aria-label="กรองสถานะ">
          {statusTabs.map((tab) => (
            <Link
              key={tab.id || "all"}
              href={listHref({ ...params, status: tab.id || undefined })}
              className={(params.status ?? "") === tab.id ? "is-active" : undefined}
              aria-current={(params.status ?? "") === tab.id ? "page" : undefined}
            >
              {tab.label}
              <span>{tab.count}</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="crm-partners-toolbar">
        <form className="crm-partners-filters" method="get">
          {params.status ? <input type="hidden" name="status" value={params.status} /> : null}
          <label>
            ค้นหา
            <input
              className="crm-field"
              name="q"
              defaultValue={params.q}
              placeholder="ชื่อ อีเมล หรือชื่อตามเอกสาร"
            />
          </label>
          <label>
            Tier
            <select className="crm-select" name="tier" defaultValue={params.tier ?? ""}>
              <option value="">ทุก tier</option>
              <option value="referral">Referral Partner</option>
              <option value="certified">Certified Partner</option>
              <option value="solution">Solution Partner</option>
            </select>
          </label>
          <label>
            KYC
            <select className="crm-select" name="kyc" defaultValue={params.kyc ?? ""}>
              <option value="">ทุกสถานะ</option>
              <option value="unverified">ยังไม่ตรวจ</option>
              <option value="pending">รอตรวจ</option>
              <option value="approved">ผ่าน</option>
              <option value="rejected">ไม่ผ่าน</option>
            </select>
          </label>
          <div className="crm-partners-filters-actions">
            <button className="kpi-button" type="submit">
              กรอง
            </button>
            {filtered ? (
              <Link href="/crm/partners/list" className="crm-users-secondary">
                ล้างตัวกรอง
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      <section className="crm-partners-panel">
        <div className="crm-partners-panel-head">
          <div>
            <h2>รายชื่อพาร์ตเนอร์</h2>
            <p>
              แสดง {partners.length} รายการ
              {params.status ? ` · ${statusLabel(params.status)}` : ""}
              {params.q?.trim() ? ` · “${params.q.trim()}”` : ""}
            </p>
          </div>
        </div>

        {partners.length === 0 ? (
          <EmptyState
            title="ยังไม่มีพาร์ตเนอร์"
            body="เพิ่มพาร์ตเนอร์ใหม่ หรือปรับตัวกรอง"
            action={<NewPartnerOpenButton className="kpi-button">เพิ่มพาร์ตเนอร์</NewPartnerOpenButton>}
          />
        ) : (
          <div className="crm-partners-table-wrap">
            <table className="crm-partners-table">
              <thead>
                <tr>
                  <th scope="col">พาร์ตเนอร์</th>
                  <th scope="col">Tier</th>
                  <th scope="col">สถานะ</th>
                  <th scope="col">KYC</th>
                  <th scope="col">ค้างจ่าย</th>
                  <th scope="col">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id}>
                    <td data-label="พาร์ตเนอร์">
                      <div className="crm-partners-identity">
                        <span className="crm-partners-avatar" aria-hidden="true">
                          {initials(partner.displayName)}
                        </span>
                        <div>
                          <Link href={`/crm/partners/${partner.id}`} className="crm-partners-name">
                            {partner.displayName}
                          </Link>
                          <p className="crm-partners-meta">
                            {partner.email}
                            {partner.phone ? ` · ${partner.phone}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td data-label="Tier">{partnerTierLabel(partner.tier)}</td>
                    <td data-label="สถานะ">
                      <StatusBadge label={statusLabel(partner.status)} tone={statusTone(partner.status)} />
                    </td>
                    <td data-label="KYC">
                      <StatusBadge label={statusLabel(partner.kycStatus)} tone={statusTone(partner.kycStatus)} />
                    </td>
                    <td data-label="ค้างจ่าย" className="crm-partners-money">
                      {partner.outstandingLabel}
                    </td>
                    <td data-label="การดำเนินการ">
                      <Link href={`/crm/partners/${partner.id}`} className="crm-users-secondary">
                        เปิดรายละเอียด
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
