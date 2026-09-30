import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("66")) return digits;
  if (digits.startsWith("0") && digits.length >= 9) return `66${digits.slice(1)}`;
  return digits;
}

export function hashSecret(value: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(value, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifySecret(value: string, salt: string, hash: string) {
  const next = scryptSync(value, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

export function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

export function isFourDigitPin(value: string) {
  return /^\d{4}$/.test(value);
}

export function lockoutMs(failedAttempts: number) {
  if (failedAttempts >= 20) return 24 * 60 * 60 * 1000;
  if (failedAttempts >= 10) return 60 * 60 * 1000;
  if (failedAttempts >= 5) return 15 * 60 * 1000;
  return 0;
}
