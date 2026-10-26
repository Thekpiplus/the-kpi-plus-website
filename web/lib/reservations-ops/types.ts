export const RESERVATION_OP_TYPES = [
  "inquiry",
  "booking",
  "modification",
  "cancellation",
  "confirmation",
] as const;
export type ReservationOpType = (typeof RESERVATION_OP_TYPES)[number];

export const RESERVATION_OP_CHANNELS = ["direct", "email", "phone", "ota"] as const;
export type ReservationOpChannel = (typeof RESERVATION_OP_CHANNELS)[number];

export const RESERVATION_OP_STATUSES = [
  "new",
  "in_progress",
  "pending_hotel",
  "pending_guest",
  "confirmed",
  "escalated",
  "closed",
  "cancelled",
] as const;
export type ReservationOpStatus = (typeof RESERVATION_OP_STATUSES)[number];

export const RESERVATION_OP_PRIORITIES = ["urgent", "high", "normal", "low"] as const;
export type ReservationOpPriority = (typeof RESERVATION_OP_PRIORITIES)[number];

export const RESERVATION_SUBTASK_STATUSES = ["open", "in_progress", "done", "cancelled"] as const;
export type ReservationSubtaskStatus = (typeof RESERVATION_SUBTASK_STATUSES)[number];

export function reservationOpErrorMessage(code: string) {
  const table: Record<string, string> = {
    missing_name: "กรอกชื่องานหรือรหัสอ้างอิงภายใน",
    missing: "ไม่พบรายการ",
    invalid: "ข้อมูลไม่ถูกต้อง",
    subtask_limit: "เพิ่มซับงานได้ไม่เกิน 10 รายการ",
    missing_comment: "กรอกความคิดเห็นก่อนบันทึก",
    missing_file: "เลือกไฟล์รูปก่อนแนบ",
    invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export const MAX_RESERVATION_SUBTASKS = 10;
export const RESERVATION_IMAGE_TYPES = new Set([".jpg", ".jpeg", ".png", ".webp"]);
export const MAX_RESERVATION_IMAGE_BYTES = 5 * 1024 * 1024;

export const TYPE_LABEL: Record<ReservationOpType, string> = {
  inquiry: "Inquiry",
  booking: "Booking",
  modification: "Modification",
  cancellation: "Cancellation",
  confirmation: "Confirmation",
};

export const CHANNEL_LABEL: Record<ReservationOpChannel, string> = {
  direct: "Direct",
  email: "Email",
  phone: "Phone",
  ota: "OTA",
};

export const STATUS_LABEL: Record<ReservationOpStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  pending_hotel: "Pending Hotel",
  pending_guest: "Pending Guest",
  confirmed: "Confirmed",
  escalated: "Escalated",
  closed: "Closed",
  cancelled: "Cancelled",
};

export const PRIORITY_LABEL: Record<ReservationOpPriority, string> = {
  urgent: "Urgent",
  high: "High",
  normal: "Normal",
  low: "Low",
};

export const SUBTASK_STATUS_LABEL: Record<ReservationSubtaskStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  done: "Done",
  cancelled: "Cancelled",
};

export type ReservationOpProgress = {
  total: number;
  completed: number;
  percent: number;
  label: "Not Started" | "In Progress" | "Completed";
  countLabel: string;
};

export type ReservationOpCommentView = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type ReservationOpAttachmentView = {
  id: string;
  filename: string;
  mime: string;
  size: number;
  href: string;
  createdAt: string;
};

export type ReservationSubtaskView = {
  id: string;
  name: string;
  status: ReservationSubtaskStatus;
  completed: boolean;
  dueAt: string;
  assigneeId: string;
  assigneeName: string;
  priority: ReservationOpPriority;
  comments: string;
  sortOrder: number;
};

export type ReservationOpGuest = {
  name: string;
  email: string;
  phone: string;
  bookingCode: string;
  masked: boolean;
};

export type ReservationOperationView = {
  id: string;
  reference: string;
  name: string;
  type: ReservationOpType;
  channel: ReservationOpChannel;
  status: ReservationOpStatus;
  priority: ReservationOpPriority;
  assigneeId: string;
  assigneeName: string;
  dueAt: string;
  hotelName: string;
  guest: ReservationOpGuest;
  notes: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string;
  escalatedAt: string;
  progress: ReservationOpProgress;
  subtasks: ReservationSubtaskView[];
  comments: ReservationOpCommentView[];
  attachments: ReservationOpAttachmentView[];
};

export function isOpType(value: string): value is ReservationOpType {
  return RESERVATION_OP_TYPES.includes(value as ReservationOpType);
}

export function isOpChannel(value: string): value is ReservationOpChannel {
  return RESERVATION_OP_CHANNELS.includes(value as ReservationOpChannel);
}

export function isOpStatus(value: string): value is ReservationOpStatus {
  return RESERVATION_OP_STATUSES.includes(value as ReservationOpStatus);
}

export function isOpPriority(value: string): value is ReservationOpPriority {
  return RESERVATION_OP_PRIORITIES.includes(value as ReservationOpPriority);
}

export function isSubtaskStatus(value: string): value is ReservationSubtaskStatus {
  return RESERVATION_SUBTASK_STATUSES.includes(value as ReservationSubtaskStatus);
}
