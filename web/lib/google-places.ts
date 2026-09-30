import { normalizePlaceId, type PlaceHit, type ReviewLinkError, type ReviewPlace } from "./review-link";

export type { PlaceHit, ReviewPlace };

type LocalizedText = { text?: string };
type GoogleMapsLinks = { writeAReviewUri?: string; placeUri?: string };
type GooglePlace = {
  id?: string;
  name?: string;
  displayName?: LocalizedText;
  formattedAddress?: string;
  shortFormattedAddress?: string;
  primaryTypeDisplayName?: LocalizedText;
  googleMapsLinks?: GoogleMapsLinks;
};
type GoogleError = { error?: { code?: number; status?: string; message?: string } };

function apiKey() {
  return process.env.GOOGLE_MAPS_API_KEY?.trim() || process.env.GOOGLE_PLACES_API_KEY?.trim() || "";
}

function mapStatus(status?: string, code?: number): ReviewLinkError {
  if (status === "RESOURCE_EXHAUSTED" || code === 429) return "quota";
  if (status === "PERMISSION_DENIED" || code === 403) return "forbidden";
  if (status === "NOT_FOUND" || code === 404) return "not_found";
  if (status === "INVALID_ARGUMENT" || code === 400) return "invalid_input";
  return "unavailable";
}

async function placesFetch(url: string, init: RequestInit, fieldMask: string) {
  const key = apiKey();
  if (!key) return { ok: false as const, error: "not_configured" as const };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": fieldMask,
        ...(init.headers ?? {}),
      },
    });
    const data = (await response.json().catch(() => ({}))) as GoogleError & { places?: GooglePlace[] } & GooglePlace;
    if (!response.ok) {
      return { ok: false as const, error: mapStatus(data.error?.status, data.error?.code || response.status) };
    }
    return { ok: true as const, data };
  } catch {
    return { ok: false as const, error: "unavailable" as const };
  } finally {
    clearTimeout(timer);
  }
}

function toHit(place: GooglePlace): PlaceHit | null {
  const placeId = normalizePlaceId(place.id || place.name || "");
  const name = place.displayName?.text?.trim() || "";
  const address = place.formattedAddress?.trim() || place.shortFormattedAddress?.trim() || "";
  if (!placeId || !name || !address) return null;
  return {
    placeId,
    name,
    address,
    type: place.primaryTypeDisplayName?.text?.trim() || "",
  };
}

export async function searchPlaces(name: string): Promise<{ places: PlaceHit[] } | { error: ReviewLinkError }> {
  const query = name.replace(/\s+/g, " ").trim();
  if (query.length < 2) {
    return { error: "invalid_input" as const };
  }

  const result = await placesFetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      body: JSON.stringify({
        textQuery: query,
        languageCode: "th",
        regionCode: "TH",
        pageSize: 8,
        locationRestriction: {
          rectangle: {
            low: { latitude: 5.5, longitude: 97.2 },
            high: { latitude: 20.6, longitude: 105.7 },
          },
        },
      }),
    },
    "places.id,places.displayName,places.formattedAddress,places.shortFormattedAddress,places.primaryTypeDisplayName",
  );
  if (!result.ok) return { error: result.error };

  const places = (result.data.places ?? []).map(toHit).filter((item): item is PlaceHit => Boolean(item));
  if (!places.length) return { error: "empty" as const };
  return { places };
}

export async function placeReviewLink(
  placeIdRaw: string,
): Promise<{ place: ReviewPlace } | { error: ReviewLinkError; place?: PlaceHit }> {
  const placeId = normalizePlaceId(placeIdRaw);
  if (!placeId) return { error: "invalid_input" as const };

  const result = await placesFetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    { method: "GET" },
    "id,displayName,formattedAddress,shortFormattedAddress,primaryTypeDisplayName,googleMapsLinks",
  );
  if (!result.ok) return { error: result.error };

  const hit = toHit(result.data);
  if (!hit) return { error: "not_found" as const };

  const reviewUri = result.data.googleMapsLinks?.writeAReviewUri?.trim() || "";
  if (!reviewUri) return { error: "no_review_link" as const, place: hit };
  return { place: { ...hit, reviewUri } satisfies ReviewPlace };
}
