import { MASKED_VALUE } from "./types";

function lastVisible(value: string, keep = 2) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length <= keep) return "•".repeat(trimmed.length);
  return `${"•".repeat(Math.max(3, trimmed.length - keep))}${trimmed.slice(-keep)}`;
}

export function maskPerson(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return MASKED_VALUE;
}

export function maskEmail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const at = trimmed.indexOf("@");
  if (at < 0) return MASKED_VALUE;
  return `${MASKED_VALUE}@${trimmed.slice(at + 1).replace(/.(?=.{2})/g, "•")}`;
}

export function maskPhone(value: string) {
  return lastVisible(value.replace(/\s+/g, ""), 2);
}

export function maskCommercial(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return MASKED_VALUE;
}
