import {
  DEFAULT_RESERVATION_BOUNDARIES,
  RESERVATION_HANDLE_CATALOGUE,
  RESERVATION_HOTEL_CATALOGUE,
  type ReservationBoundaryItem,
  type ReservationServiceBoundaries,
} from "@/lib/reservations";
import { getSetting } from "@/lib/cms/queries";

export const RESERVATIONS_BOUNDARIES_SETTING = "reservations-service-boundaries";
export const RESERVATIONS_BOUNDARIES_EDIT_HREF = "/crm/cms/reservations";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringList(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(/[,|\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function mergeItems(
  catalogue: readonly Omit<ReservationBoundaryItem, "configured">[],
  saved: unknown,
): ReservationBoundaryItem[] {
  const rows = Array.isArray(saved) ? saved : [];
  const byId = new Map<string, boolean>();
  for (const row of rows) {
    const item = asRecord(row);
    const id = asString(item.id);
    if (!id) continue;
    byId.set(id, item.configured !== false);
  }
  return catalogue.map((item) => ({
    id: item.id,
    label: item.label,
    configured: byId.has(item.id) ? Boolean(byId.get(item.id)) : true,
  }));
}

function cloneBoundaries(value: ReservationServiceBoundaries = DEFAULT_RESERVATION_BOUNDARIES): ReservationServiceBoundaries {
  return {
    ...value,
    handles: value.handles.map((item) => ({ ...item })),
    hotelOwns: value.hotelOwns.map((item) => ({ ...item })),
    supportedChannels: [...value.supportedChannels],
    supportedLanguages: [...value.supportedLanguages],
  };
}

export function parseReservationBoundaries(raw?: string | null): ReservationServiceBoundaries {
  if (!raw) return cloneBoundaries();

  let parsed: Record<string, unknown> = {};
  try {
    parsed = asRecord(JSON.parse(raw) as unknown);
  } catch {
    return cloneBoundaries();
  }

  const settings = asRecord(parsed.settings ?? parsed);
  return {
    handles: mergeItems(RESERVATION_HANDLE_CATALOGUE, parsed.handles),
    hotelOwns: mergeItems(RESERVATION_HOTEL_CATALOGUE, parsed.hotelOwns ?? parsed.hotel),
    supportedChannels: asStringList(settings.supportedChannels ?? parsed.supportedChannels),
    supportedLanguages: asStringList(settings.supportedLanguages ?? parsed.supportedLanguages),
    operatingHours: asString(settings.operatingHours ?? parsed.operatingHours),
    slaTextTh: asString(settings.slaTextTh ?? parsed.slaTextTh),
    slaTextEn: asString(settings.slaTextEn ?? parsed.slaTextEn),
    escalationPath: asString(settings.escalationPath ?? parsed.escalationPath),
    integrationNotes: asString(settings.integrationNotes ?? parsed.integrationNotes),
    reportingFrequency: asString(settings.reportingFrequency ?? parsed.reportingFrequency),
    privacyNoteTh: asString(settings.privacyNoteTh ?? parsed.privacyNoteTh),
    privacyNoteEn: asString(settings.privacyNoteEn ?? parsed.privacyNoteEn),
  };
}

export function serializeReservationBoundaries(boundaries: ReservationServiceBoundaries) {
  return JSON.stringify({
    version: 1,
    handles: boundaries.handles.map(({ id, configured }) => ({ id, configured })),
    hotelOwns: boundaries.hotelOwns.map(({ id, configured }) => ({ id, configured })),
    supportedChannels: boundaries.supportedChannels,
    supportedLanguages: boundaries.supportedLanguages,
    operatingHours: boundaries.operatingHours ?? "",
    slaTextTh: boundaries.slaTextTh ?? "",
    slaTextEn: boundaries.slaTextEn ?? "",
    escalationPath: boundaries.escalationPath ?? "",
    integrationNotes: boundaries.integrationNotes ?? "",
    reportingFrequency: boundaries.reportingFrequency ?? "",
    privacyNoteTh: boundaries.privacyNoteTh ?? "",
    privacyNoteEn: boundaries.privacyNoteEn ?? "",
  });
}

export function boundariesFromForm(formData: FormData): ReservationServiceBoundaries {
  const handleIds = new Set(formData.getAll("handles").map(String));
  const hotelIds = new Set(formData.getAll("hotelOwns").map(String));
  return parseReservationBoundaries(
    serializeReservationBoundaries({
      handles: RESERVATION_HANDLE_CATALOGUE.map((item) => ({ ...item, configured: handleIds.has(item.id) })),
      hotelOwns: RESERVATION_HOTEL_CATALOGUE.map((item) => ({ ...item, configured: hotelIds.has(item.id) })),
      supportedChannels: asStringList(String(formData.get("supportedChannels") ?? "")),
      supportedLanguages: asStringList(String(formData.get("supportedLanguages") ?? "")),
      operatingHours: String(formData.get("operatingHours") ?? ""),
      slaTextTh: String(formData.get("slaTextTh") ?? ""),
      slaTextEn: String(formData.get("slaTextEn") ?? ""),
      escalationPath: String(formData.get("escalationPath") ?? ""),
      integrationNotes: String(formData.get("integrationNotes") ?? ""),
      reportingFrequency: String(formData.get("reportingFrequency") ?? ""),
      privacyNoteTh: String(formData.get("privacyNoteTh") ?? ""),
      privacyNoteEn: String(formData.get("privacyNoteEn") ?? ""),
    }),
  );
}

export async function loadReservationBoundaries(): Promise<ReservationServiceBoundaries> {
  try {
    const row = await getSetting(RESERVATIONS_BOUNDARIES_SETTING);
    if (!row?.value) return cloneBoundaries();
    return parseReservationBoundaries(row.value);
  } catch {
    return cloneBoundaries();
  }
}
