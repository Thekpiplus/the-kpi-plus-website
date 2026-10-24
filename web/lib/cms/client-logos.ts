import type { CmsClientLogoRow } from "./types";

export const CLIENT_LOGO_PERMISSIONS = ["pending", "approved", "rejected"] as const;
export type ClientLogoPermission = (typeof CLIENT_LOGO_PERMISSIONS)[number];

export const CLIENT_LOGO_PLACEHOLDER = "/images/client-logo-placeholder.svg";
export const CLIENT_LOGO_PLACEHOLDER_TEXT = "CLIENT LOGO PLACEHOLDER — Replace with approved logo";
export const CLIENT_LOGO_HINT = "แนะนำ 240×80 พิกเซล JPG / PNG / WEBP ไม่เกิน 5MB";
export const CLIENT_LOGO_CANVAS = { width: 240, height: 80 } as const;
export const MAX_CLIENT_LOGO_BYTES = 5 * 1024 * 1024;
export const CLIENT_LOGO_IMAGE_TYPES = new Set([".jpg", ".jpeg", ".png", ".webp"]);
export const CLIENT_LOGO_MIN_SIZE = { width: 80, height: 24 };
export const CLIENT_LOGO_MAX_SIZE = { width: 8000, height: 8000 };

export type ClientLogoSaveInput = {
  id?: string;
  name: string;
  filePath: string;
  clientName: string;
  anonymisedLabel: string;
  altText: string;
  sortOrder: number;
  permission: ClientLogoPermission;
  isActive: boolean;
  adminNotes: string;
};

export type ClientLogoSaveResult = { ok: true; id: string } | { ok: false; error: string };

function trim(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function isClientLogoPermission(value: string): value is ClientLogoPermission {
  return CLIENT_LOGO_PERMISSIONS.includes(value as ClientLogoPermission);
}

export function parseClientLogoPermission(value: unknown): ClientLogoPermission {
  const next = trim(value).toLowerCase();
  return isClientLogoPermission(next) ? next : "pending";
}

export function emptyClientLogoInput(sortOrder = 0): ClientLogoSaveInput {
  return {
    name: "",
    filePath: "",
    clientName: "",
    anonymisedLabel: "",
    altText: "",
    sortOrder,
    permission: "pending",
    isActive: false,
    adminNotes: "",
  };
}

export function inputFromRow(row: CmsClientLogoRow): ClientLogoSaveInput {
  return {
    id: row.id,
    name: row.name,
    filePath: row.filePath,
    clientName: row.clientName,
    anonymisedLabel: row.anonymisedLabel,
    altText: row.altText,
    sortOrder: row.sortOrder,
    permission: parseClientLogoPermission(row.permission),
    isActive: row.isActive,
    adminNotes: row.adminNotes,
  };
}

export function inputFromForm(formData: FormData): ClientLogoSaveInput {
  const id = trim(formData.get("id"));
  return {
    id: id || undefined,
    name: trim(formData.get("name")),
    filePath: trim(formData.get("filePath")),
    clientName: trim(formData.get("clientName")),
    anonymisedLabel: trim(formData.get("anonymisedLabel")),
    altText: trim(formData.get("altText")),
    sortOrder: Number.parseInt(trim(formData.get("sortOrder")) || "0", 10) || 0,
    permission: parseClientLogoPermission(formData.get("permission")),
    isActive: formData.get("isActive") === "1",
    adminNotes: trim(formData.get("adminNotes")),
  };
}

export function publicClientLabel(input: Pick<ClientLogoSaveInput, "name" | "clientName" | "anonymisedLabel"> | CmsClientLogoRow) {
  return input.anonymisedLabel.trim() || input.clientName.trim() || input.name.trim();
}

export function publicClientAlt(input: Pick<ClientLogoSaveInput, "name" | "clientName" | "anonymisedLabel" | "altText"> | CmsClientLogoRow) {
  const label = publicClientLabel(input);
  return input.altText.trim() || (label ? `${label} logo` : "");
}

export function canPublishClientLogo(input: Pick<ClientLogoSaveInput, "filePath" | "isActive"> & { permission: string }) {
  return parseClientLogoPermission(input.permission) === "approved" && input.isActive && Boolean(input.filePath.trim());
}

export function validateClientLogoInput(input: ClientLogoSaveInput) {
  if (!input.name) return "missing_name";
  if (!input.clientName && !input.anonymisedLabel) return "missing_client";
  if (input.sortOrder < 0) return "invalid_order";
  if (input.permission === "approved" && !input.filePath) return "cannot_approve_without_logo";
  return "";
}

export function permissionLabel(permission: string) {
  if (permission === "approved") return "Approved";
  if (permission === "rejected") return "Rejected";
  return "Pending";
}

export function permissionLabelTh(permission: string) {
  if (permission === "approved") return "อนุมัติเผยแพร่";
  if (permission === "rejected") return "ไม่อนุญาต";
  return "รออนุญาต";
}

export function clientLogoErrorMessage(error?: string) {
  if (error === "missing_name") return "กรุณาใส่ชื่อโลโก้";
  if (error === "missing_client") return "กรุณาใส่ชื่อลูกค้าหรือป้ายนิรนาม";
  if (error === "cannot_approve_without_logo") return "อนุมัติเผยแพร่ได้เมื่อมีไฟล์โลโก้เท่านั้น";
  if (error === "invalid_order") return "ลำดับแสดงต้องเป็นตัวเลขไม่ติดลบ";
  if (error === "invalid_image") return "ไฟล์โลโก้ต้องเป็น JPG / PNG / WEBP ไม่เกิน 5MB";
  if (error === "image_dimensions") return "ขนาดโลโก้ต้องอย่างน้อย 80×24 พิกเซล และไม่เกิน 8000×8000";
  if (error === "missing") return "ไม่พบรายการโลโก้";
  return error ? "บันทึกไม่สำเร็จ" : "";
}
