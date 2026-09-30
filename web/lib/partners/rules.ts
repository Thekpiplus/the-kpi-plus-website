export type PartnerTier = "referral" | "certified" | "solution";

export type CommissionRulePayload = {
  version: number;
  termsVersion: string;
  minContractMonths: number;
  protectionDays: number;
  activeOpportunityDays: number;
  payoutMinSatang: number;
  payoutDay: number;
  ineligibleLabels: string[];
  tiers: Record<
    PartnerTier,
    {
      firstMonthBps: number;
      trailingMonths: number;
      trailingBps: number;
    }
  >;
};

export const DEFAULT_RULE: CommissionRulePayload = {
  version: 1,
  termsVersion: "partner-program-2026-09",
  minContractMonths: 3,
  protectionDays: 180,
  activeOpportunityDays: 90,
  payoutMinSatang: 100_000,
  payoutDay: 10,
  ineligibleLabels: [
    "Advertising / media",
    "Third-party software",
    "Hardware",
    "Production",
    "Pass-through costs",
    "Setup fee",
    "Implementation fee",
    "Refund",
    "VAT",
  ],
  tiers: {
    referral: { firstMonthBps: 5_000, trailingMonths: 0, trailingBps: 0 },
    certified: { firstMonthBps: 10_000, trailingMonths: 0, trailingBps: 0 },
    solution: { firstMonthBps: 10_000, trailingMonths: 3, trailingBps: 1_000 },
  },
};

export function parseRule(payload: string | CommissionRulePayload): CommissionRulePayload {
  const raw = typeof payload === "string" ? (JSON.parse(payload) as CommissionRulePayload) : payload;
  return { ...DEFAULT_RULE, ...raw, tiers: { ...DEFAULT_RULE.tiers, ...raw.tiers } };
}

export function ratesForMonth(tier: PartnerTier, monthIndex: number, rule = DEFAULT_RULE) {
  const spec = rule.tiers[tier];
  if (monthIndex <= 1) return spec.firstMonthBps;
  if (monthIndex - 1 <= spec.trailingMonths) return spec.trailingBps;
  return 0;
}

export function protectionEnds(acceptedAt: Date, rule = DEFAULT_RULE) {
  return new Date(acceptedAt.getTime() + rule.protectionDays * 24 * 60 * 60 * 1000);
}

export function payoutDueDate(from = new Date(), rule = DEFAULT_RULE) {
  const due = new Date(from.getFullYear(), from.getMonth() + 1, rule.payoutDay, 12, 0, 0);
  return due;
}

export function shouldCarryOver(approvedSatang: number, rule = DEFAULT_RULE) {
  return approvedSatang < rule.payoutMinSatang;
}

export const TIER_LABEL: Record<PartnerTier, string> = {
  referral: "Referral Partner",
  certified: "Certified Partner",
  solution: "Solution Partner",
};

export const STATUS_LABEL = {
  draft: "ร่าง",
  submitted: "ส่งแล้ว",
  under_review: "กำลังตรวจ",
  accepted: "รับแล้ว",
  rejected: "ปฏิเสธ",
  won: "ปิดได้",
  lost: "ไม่สำเร็จ",
  estimated: "ประมาณการ",
  paid_by_client: "ลูกค้าจ่ายแล้ว",
  calculated: "คำนวณแล้ว",
  pending_review: "รอตรวจ",
  approved: "อนุมัติแล้ว",
  in_payout: "เข้ารอบจ่าย",
  paid: "จ่ายแล้ว",
  held: "พักรายการ",
  rejected_item: "ปฏิเสธรายการ",
  adjusted: "ปรับปรุง",
  clawback: "ยอดเรียกคืน",
  pending: "รออนุมัติ",
  active: "อนุมัติแล้ว",
  unverified: "ยังไม่ตรวจ",
  superseded: "ถูกแทนที่",
} as const;
