import { eligibleServiceSatang, rateAmount } from "./money";
import {
  DEFAULT_RULE,
  type CommissionRulePayload,
  type PartnerTier,
  payoutDueDate,
  protectionEnds,
  ratesForMonth,
  shouldCarryOver,
} from "./rules";

export type PaymentInput = {
  id?: string;
  serviceMonth: string;
  kind: "receipt" | "refund" | "cancel";
  confirmed: boolean;
  grossSatang: number;
  discountSatang: number;
  ineligibleSatang: number;
  receivedSatang: number;
};

export type CommissionDraft = {
  serviceMonth: string;
  monthIndex: number;
  rateBps: number;
  eligibleSatang: number;
  calculatedSatang: number;
  status: "estimated" | "calculated";
  payable: boolean;
};

export function normalizePhoneKey(value: string) {
  return value.replace(/\D/g, "");
}

export function looksLikeDuplicate(
  incoming: { businessName: string; phone: string; email: string },
  existing: { businessName: string; phone: string; email: string; updatedAt: Date; outcome?: string },
  now = new Date(),
  activeDays = 90,
) {
  const phoneMatch =
    incoming.phone && existing.phone && normalizePhoneKey(incoming.phone) === normalizePhoneKey(existing.phone);
  const emailMatch =
    incoming.email && existing.email && incoming.email.trim().toLowerCase() === existing.email.trim().toLowerCase();
  const nameMatch =
    incoming.businessName.trim().toLowerCase() &&
    incoming.businessName.trim().toLowerCase() === existing.businessName.trim().toLowerCase();
  if (!phoneMatch && !emailMatch && !nameMatch) return null;
  const active =
    now.getTime() - existing.updatedAt.getTime() <= activeDays * 24 * 60 * 60 * 1000 &&
    existing.outcome !== "lost";
  return { phoneMatch, emailMatch, nameMatch, active };
}

export function firstAcceptedWins(referrals: { id: string; acceptedAt: Date | null }[]) {
  return [...referrals]
    .filter((row) => row.acceptedAt)
    .sort((a, b) => (a.acceptedAt!.getTime() === b.acceptedAt!.getTime() ? a.id.localeCompare(b.id) : a.acceptedAt!.getTime() - b.acceptedAt!.getTime()))[0] ?? null;
}

export function isProtectionActive(acceptedAt: Date | null, now = new Date(), rule = DEFAULT_RULE) {
  if (!acceptedAt) return false;
  return now.getTime() <= protectionEnds(acceptedAt, rule).getTime();
}

export function monthsFrom(start: string, count: number) {
  const [year, month] = start.split("-").map(Number);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(year, month - 1 + index, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  });
}

export function netConfirmedByMonth(payments: PaymentInput[]) {
  const map = new Map<string, { eligible: number; received: number; confirmed: boolean }>();
  for (const payment of payments) {
    const sign = payment.kind === "receipt" ? 1 : -1;
    const eligible = sign * eligibleServiceSatang(payment);
    const received = sign * payment.receivedSatang;
    const prev = map.get(payment.serviceMonth) ?? { eligible: 0, received: 0, confirmed: false };
    map.set(payment.serviceMonth, {
      eligible: prev.eligible + eligible,
      received: prev.received + received,
      confirmed: prev.confirmed || (payment.confirmed && payment.kind === "receipt"),
    });
  }
  return map;
}

export function draftCommissions(input: {
  tier: PartnerTier;
  firstMonth: string;
  contractMonths: number;
  payments: PaymentInput[];
  dealWon: boolean;
  exceptionApproved?: boolean;
  rule?: CommissionRulePayload;
}): { drafts: CommissionDraft[]; warning?: string } {
  const rule = input.rule ?? DEFAULT_RULE;
  const warning =
    input.contractMonths < rule.minContractMonths && !input.exceptionApproved
      ? `สัญญา ${input.contractMonths} เดือน ต่ำกว่าขั้นต่ำ ${rule.minContractMonths} เดือน`
      : undefined;
  const trailing = rule.tiers[input.tier].trailingMonths;
  const months = monthsFrom(input.firstMonth, 1 + trailing);
  const byMonth = netConfirmedByMonth(input.payments);
  const drafts = months
    .map((serviceMonth, index) => {
      const monthIndex = index + 1;
      const rateBps = ratesForMonth(input.tier, monthIndex, rule);
      const bucket = byMonth.get(serviceMonth);
      const eligibleSatang = Math.max(0, bucket?.eligible ?? 0);
      const confirmed = Boolean(bucket?.confirmed && eligibleSatang > 0);
      const payable = Boolean(input.dealWon && confirmed && (!warning || input.exceptionApproved));
      return {
        serviceMonth,
        monthIndex,
        rateBps,
        eligibleSatang,
        calculatedSatang: rateAmount(eligibleSatang, rateBps),
        status: payable ? ("calculated" as const) : ("estimated" as const),
        payable,
      };
    })
    .filter((row) => row.rateBps > 0);
  return { drafts, warning };
}

export function remainingAfterPayout(calculated: number, paid: number, adjustment: number) {
  return calculated + adjustment - paid;
}

export function canIncludeInPayout(status: string, remainingSatang: number) {
  return status === "approved" && remainingSatang > 0;
}

export function alreadyPaidGuard(existingPaidSatang: number) {
  return existingPaidSatang > 0;
}

export function payoutPreview(approvedItems: { remainingSatang: number }[], rule = DEFAULT_RULE) {
  const total = approvedItems.reduce((sum, item) => sum + item.remainingSatang, 0);
  return {
    total,
    carryOver: shouldCarryOver(total, rule),
    dueDate: payoutDueDate(),
    minSatang: rule.payoutMinSatang,
  };
}

export function partnerCanSee(actorPartnerId: string | null | undefined, rowPartnerId: string) {
  return Boolean(actorPartnerId && actorPartnerId === rowPartnerId);
}
