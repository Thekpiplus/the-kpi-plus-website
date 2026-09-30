import assert from "node:assert/strict";
import test from "node:test";
import {
  alreadyPaidGuard,
  canIncludeInPayout,
  draftCommissions,
  firstAcceptedWins,
  isProtectionActive,
  looksLikeDuplicate,
  partnerCanSee,
  payoutPreview,
} from "./calculate";
import { bahtToSatang, eligibleServiceSatang, rateAmount } from "./money";
import { DEFAULT_RULE, protectionEnds, shouldCarryOver } from "./rules";

test("three partner tiers on first eligible month", () => {
  const payments = [
    {
      serviceMonth: "2026-09",
      kind: "receipt" as const,
      confirmed: true,
      grossSatang: bahtToSatang(20_000),
      discountSatang: bahtToSatang(2_000),
      ineligibleSatang: 0,
      receivedSatang: bahtToSatang(18_000),
    },
  ];
  const referral = draftCommissions({
    tier: "referral",
    firstMonth: "2026-09",
    contractMonths: 3,
    payments,
    dealWon: true,
  });
  const certified = draftCommissions({
    tier: "certified",
    firstMonth: "2026-09",
    contractMonths: 3,
    payments,
    dealWon: true,
  });
  const solution = draftCommissions({
    tier: "solution",
    firstMonth: "2026-09",
    contractMonths: 6,
    payments,
    dealWon: true,
  });
  assert.equal(referral.drafts[0].calculatedSatang, rateAmount(bahtToSatang(18_000), 5_000));
  assert.equal(certified.drafts[0].calculatedSatang, rateAmount(bahtToSatang(18_000), 10_000));
  assert.equal(solution.drafts.length, 4);
  assert.equal(solution.drafts[0].calculatedSatang, rateAmount(bahtToSatang(18_000), 10_000));
  assert.equal(solution.drafts[1].rateBps, 1_000);
  assert.equal(solution.drafts[1].status, "estimated");
});

test("180-day lead protection starts at acceptance", () => {
  const accepted = new Date("2026-01-01T00:00:00Z");
  assert.equal(protectionEnds(accepted).toISOString().slice(0, 10), "2026-06-30");
  assert.equal(isProtectionActive(accepted, new Date("2026-06-30T00:00:00Z")), true);
  assert.equal(isProtectionActive(accepted, new Date("2026-07-01T00:00:00Z")), false);
});

test("similar leads are flagged, not auto-decided", () => {
  const flag = looksLikeDuplicate(
    { businessName: "Baan Test Hotel", phone: "0826356000", email: "gm@example.test" },
    {
      businessName: "Baan Test Hotel",
      phone: "0826356000",
      email: "other@example.test",
      updatedAt: new Date(),
      outcome: "",
    },
  );
  assert.ok(flag?.phoneMatch && flag.nameMatch && flag.active);
});

test("partial payment commissions only confirmed cash", () => {
  const eligible = eligibleServiceSatang({
    grossSatang: bahtToSatang(10_000),
    discountSatang: 0,
    ineligibleSatang: bahtToSatang(1_000),
    receivedSatang: bahtToSatang(4_000),
  });
  assert.equal(eligible, bahtToSatang(4_000));
  const draft = draftCommissions({
    tier: "certified",
    firstMonth: "2026-09",
    contractMonths: 3,
    dealWon: true,
    payments: [
      {
        serviceMonth: "2026-09",
        kind: "receipt",
        confirmed: true,
        grossSatang: bahtToSatang(10_000),
        discountSatang: 0,
        ineligibleSatang: bahtToSatang(1_000),
        receivedSatang: bahtToSatang(4_000),
      },
    ],
  });
  assert.equal(draft.drafts[0].calculatedSatang, bahtToSatang(4_000));
});

test("refund reduces net eligible", () => {
  const draft = draftCommissions({
    tier: "referral",
    firstMonth: "2026-09",
    contractMonths: 3,
    dealWon: true,
    payments: [
      {
        serviceMonth: "2026-09",
        kind: "receipt",
        confirmed: true,
        grossSatang: bahtToSatang(10_000),
        discountSatang: 0,
        ineligibleSatang: 0,
        receivedSatang: bahtToSatang(10_000),
      },
      {
        serviceMonth: "2026-09",
        kind: "refund",
        confirmed: true,
        grossSatang: bahtToSatang(10_000),
        discountSatang: 0,
        ineligibleSatang: 0,
        receivedSatang: bahtToSatang(10_000),
      },
    ],
  });
  assert.equal(draft.drafts[0].calculatedSatang, 0);
});

test("payout minimum 1,000 baht carries over", () => {
  assert.equal(shouldCarryOver(bahtToSatang(999)), true);
  assert.equal(shouldCarryOver(bahtToSatang(1_000)), false);
  const preview = payoutPreview([{ remainingSatang: bahtToSatang(800) }]);
  assert.equal(preview.carryOver, true);
  assert.equal(preview.minSatang, DEFAULT_RULE.payoutMinSatang);
});

test("paid commission cannot be paid again", () => {
  assert.equal(alreadyPaidGuard(1), true);
  assert.equal(canIncludeInPayout("paid", 5_000), false);
  assert.equal(canIncludeInPayout("approved", 5_000), true);
});

test("partners cannot see another partner row", () => {
  assert.equal(partnerCanSee("p1", "p1"), true);
  assert.equal(partnerCanSee("p1", "p2"), false);
  assert.equal(partnerCanSee(null, "p2"), false);
});

test("first accepted qualified referral wins", () => {
  const winner = firstAcceptedWins([
    { id: "b", acceptedAt: new Date("2026-03-02") },
    { id: "a", acceptedAt: new Date("2026-03-01") },
    { id: "c", acceptedAt: null },
  ]);
  assert.equal(winner?.id, "a");
});

test("unconfirmed money stays estimated and not payable", () => {
  const draft = draftCommissions({
    tier: "solution",
    firstMonth: "2026-09",
    contractMonths: 3,
    dealWon: true,
    payments: [
      {
        serviceMonth: "2026-09",
        kind: "receipt",
        confirmed: false,
        grossSatang: bahtToSatang(12_000),
        discountSatang: 0,
        ineligibleSatang: 0,
        receivedSatang: bahtToSatang(12_000),
      },
    ],
  });
  assert.equal(draft.drafts[0].status, "estimated");
  assert.equal(draft.drafts[0].payable, false);
});
