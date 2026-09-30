import { STAFF_ROLES } from "@/lib/partners/access";

export const USER_ROLES = [...STAFF_ROLES, "partner"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_LABEL: Record<UserRole, string> = {
  owner: "เจ้าของระบบ",
  staff: "ทีมงาน",
  crm: "ทีมขาย / CRM",
  reviewer: "ตรวจเอกสารพาร์ตเนอร์",
  approver: "อนุมัติค่าคอมมิชชัน",
  payout: "บันทึกการจ่าย",
  partner: "พาร์ตเนอร์",
};

export function roleLabel(role: string) {
  return ROLE_LABEL[role as UserRole] ?? role;
}

export function isStaffRole(role: string) {
  return STAFF_ROLES.includes(role as (typeof STAFF_ROLES)[number]);
}
