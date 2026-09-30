/** Integer satang math — never keep payable money in floats. */

export const SATANG = 100;

export function bahtToSatang(baht: number | string) {
  const n = typeof baht === "string" ? Number(baht.replace(/,/g, "")) : baht;
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * SATANG);
}

export function satangToBaht(satang: number) {
  return (satang / SATANG).toFixed(2);
}

export function formatBaht(satang: number) {
  return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(satang / SATANG);
}

export function addSatang(...values: number[]) {
  return values.reduce((sum, value) => sum + (Number.isInteger(value) ? value : Math.round(value)), 0);
}

export function rateAmount(eligibleSatang: number, bps: number) {
  if (eligibleSatang <= 0 || bps <= 0) return 0;
  return Math.round((eligibleSatang * bps) / 10_000);
}

export function eligibleServiceSatang(input: {
  grossSatang: number;
  discountSatang: number;
  ineligibleSatang: number;
  receivedSatang: number;
}) {
  const afterDiscount = Math.max(0, input.grossSatang - input.discountSatang - input.ineligibleSatang);
  return Math.max(0, Math.min(afterDiscount, input.receivedSatang));
}
