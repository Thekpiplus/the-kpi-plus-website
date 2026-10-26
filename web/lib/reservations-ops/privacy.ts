import { isFullAccessRole } from "@/lib/crm/roles";

export function canViewReservationGuestData(user: { role: string } | null | undefined) {
  if (!user) return false;
  return isFullAccessRole(user.role);
}

function lastVisible(value: string, keep = 2) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length <= keep) return "•".repeat(trimmed.length);
  return `${"•".repeat(Math.max(3, trimmed.length - keep))}${trimmed.slice(-keep)}`;
}

export function maskGuestName(value: string, index = 0) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^guest\s+[a-z]$/i.test(trimmed)) return trimmed;
  const letter = String.fromCharCode(65 + (index % 26));
  return `Guest ${letter}`;
}

export function maskGuestEmail(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const at = trimmed.indexOf("@");
  if (at < 0) return "•••@•••";
  return `•••@${trimmed.slice(at + 1).replace(/.(?=.{3})/g, "•")}`;
}

export function maskGuestPhone(value: string) {
  return lastVisible(value.replace(/\s+/g, ""), 2);
}

export function maskBookingCode(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 3) return "•••";
  return `${trimmed.slice(0, 2)}•••`;
}

export function maskedGuest(input: {
  name: string;
  email: string;
  phone: string;
  bookingCode: string;
  index?: number;
}) {
  return {
    name: maskGuestName(input.name, input.index),
    email: maskGuestEmail(input.email),
    phone: maskGuestPhone(input.phone),
    bookingCode: maskBookingCode(input.bookingCode),
    masked: true,
  };
}

export function revealedGuest(input: { name: string; email: string; phone: string; bookingCode: string }) {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    bookingCode: input.bookingCode.trim(),
    masked: false,
  };
}
