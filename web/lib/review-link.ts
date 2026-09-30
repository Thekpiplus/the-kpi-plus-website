export const PLACE_ID_RE = /^[A-Za-z0-9_-]{10,256}$/;

const GOOGLE_HOSTS = new Set([
  "google.com",
  "www.google.com",
  "maps.google.com",
  "search.google.com",
  "g.page",
  "maps.app.goo.gl",
  "goo.gl",
]);

export type PlaceHit = {
  placeId: string;
  name: string;
  address: string;
  type: string;
};

export type ReviewPlace = PlaceHit & {
  reviewUri: string;
};

export type ReviewLinkError =
  | "invalid_input"
  | "invalid_link"
  | "empty"
  | "not_found"
  | "no_review_link"
  | "quota"
  | "forbidden"
  | "not_configured"
  | "rate_limited"
  | "unavailable";

export function normalizePlaceId(value: string) {
  const trimmed = value.trim().replace(/^places\//, "");
  return PLACE_ID_RE.test(trimmed) ? trimmed : "";
}

export function isGoogleHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (GOOGLE_HOSTS.has(host)) return true;
  return host.endsWith(".google.com") || host.endsWith(".google.co.th") || host.endsWith(".g.page");
}

export function isDirectReviewUrl(url: URL) {
  const host = url.hostname.toLowerCase();
  const path = url.pathname.replace(/\/+$/, "");
  if (host === "search.google.com" && path.includes("/local/writereview")) return true;
  if (host === "g.page" && /\/r\/[^/]+\/review$/i.test(path)) return true;
  if (url.searchParams.get("writereview") === "1") return true;
  return false;
}

export function extractPlaceIdFromUrl(url: URL) {
  const params = url.searchParams;
  const fromParam = params.get("placeid") || params.get("placeId") || params.get("place_id");
  if (fromParam) return normalizePlaceId(fromParam);

  const q = params.get("q") ?? "";
  const qMatch = q.match(/place_id:([A-Za-z0-9_-]+)/i);
  if (qMatch) return normalizePlaceId(qMatch[1]);

  const data = `${url.pathname}${url.search}${url.hash}`;
  const dataMatch = data.match(/!1s(ChIJ[A-Za-z0-9_-]+)/);
  if (dataMatch) return normalizePlaceId(dataMatch[1]);
  return "";
}

export function parseGoogleUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return { error: "invalid_link" as const };
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { error: "invalid_link" as const };
  }
  if (url.protocol !== "https:") return { error: "invalid_link" as const };
  if (!isGoogleHost(url.hostname)) return { error: "invalid_link" as const };
  return {
    url,
    placeId: extractPlaceIdFromUrl(url),
    isReview: isDirectReviewUrl(url),
  };
}

export function reviewLinkMessage(code: ReviewLinkError) {
  switch (code) {
    case "invalid_input":
      return "กรอกชื่อธุรกิจในไทยให้ชัดเจน เช่น ชื่อโรงแรมหรือชื่อร้าน";
    case "invalid_link":
      return "ลิงก์นี้ยังไม่ใช่ลิงก์รีวิว Google ที่ใช้ได้ ใช้ลิงก์เขียนรีวิวจาก Google Business Profile หรือลิงก์ที่มี Place ID";
    case "empty":
      return "ไม่พบบริษัทนี้ในไทย ลองใส่ชื่อเต็มของธุรกิจ";
    case "not_found":
      return "ไม่พบรายการนี้บน Google แล้ว ลองค้นหาใหม่แล้วเลือกรายการอีกครั้ง";
    case "no_review_link":
      return "พบธุรกิจนี้แล้ว แต่ Google ยังไม่มีลิงก์เขียนรีวิวโดยตรงให้รายการนี้ ระบบจึงไม่สร้างลิงก์แผนที่ทั่วไปแทน";
    case "quota":
      return "ขณะนี้เรียก Google ไม่สำเร็จ เพราะโควต้าเต็ม กรุณาลองใหม่ภายหลัง";
    case "forbidden":
      return "ยังเรียก Google Places ไม่ได้ ตรวจว่าเปิด Places API (New) และจำกัดคีย์ตามที่เอกสารระบุ";
    case "not_configured":
      return "เครื่องมือนี้ยังไม่ได้ตั้งค่า Google Maps Platform API key";
    case "rate_limited":
      return "มีการค้นหาถี่เกินไป กรุณารอสักครู่แล้วลองใหม่";
    default:
      return "เชื่อมต่อ Google ไม่สำเร็จ กรุณาลองใหม่";
  }
}

const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
