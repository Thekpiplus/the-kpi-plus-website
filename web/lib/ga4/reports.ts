import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { ga4ServiceAccount, getGa4Config } from "./config";

export type Ga4Range = "7" | "28" | "90";

export type Ga4MetricRow = {
  label: string;
  value: string;
  secondary?: string;
};

export type Ga4Overview = {
  range: Ga4Range;
  propertyId: string;
  totals: {
    activeUsers: number;
    sessions: number;
    screenPageViews: number;
    bounceRate: number;
    averageSessionDuration: number;
  };
  topPages: Ga4MetricRow[];
  countries: Ga4MetricRow[];
  cities: Ga4MetricRow[];
  devices: Ga4MetricRow[];
  sources: Ga4MetricRow[];
  daily: Array<{ date: string; users: number; views: number }>;
};

function client() {
  const account = ga4ServiceAccount();
  if (!account) throw new Error("missing_credentials");
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: account.clientEmail,
      private_key: account.privateKey,
    },
  });
}

function metricValue(row: { metricValues?: Array<{ value?: string | null }> | null } | undefined, index = 0) {
  const raw = row?.metricValues?.[index]?.value;
  const n = Number(raw ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function dim(row: { dimensionValues?: Array<{ value?: string | null }> | null } | undefined, index = 0) {
  const value = row?.dimensionValues?.[index]?.value?.trim() || "";
  if (!value || value === "(not set)") return "—";
  return value;
}

function formatDuration(seconds: number) {
  if (!seconds || seconds < 0) return "0:00";
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatGa4Number(value: number, style: "int" | "percent" | "duration" = "int") {
  if (style === "percent") return `${(value * 100).toFixed(1)}%`;
  if (style === "duration") return formatDuration(value);
  return new Intl.NumberFormat("th-TH").format(Math.round(value));
}

function startDateFor(range: Ga4Range) {
  return `${range}daysAgo`;
}

export async function fetchGa4Overview(range: Ga4Range = "28"): Promise<
  | { ok: true; data: Ga4Overview }
  | { ok: false; error: "not_configured" | "missing_credentials" | "api_error"; message: string }
> {
  const config = await getGa4Config();
  if (!config.propertyId) {
    return { ok: false, error: "not_configured", message: "ยังไม่ได้ตั้ง GA4 Property ID" };
  }
  if (!config.hasCredentials) {
    return {
      ok: false,
      error: "missing_credentials",
      message: "ยังไม่ได้ตั้ง GA4_SERVICE_ACCOUNT_JSON ใน environment",
    };
  }

  const property = `properties/${config.propertyId}`;
  const analytics = client();
  const dateRanges = [{ startDate: startDateFor(range), endDate: "yesterday" }];

  try {
    const [[totalsRes], [pagesRes], [countriesRes], [citiesRes], [devicesRes], [sourcesRes], [dailyRes]] =
      await Promise.all([
        analytics.runReport({
          property,
          dateRanges,
          metrics: [
            { name: "activeUsers" },
            { name: "sessions" },
            { name: "screenPageViews" },
            { name: "bounceRate" },
            { name: "averageSessionDuration" },
          ],
        }),
        analytics.runReport({
          property,
          dateRanges,
          dimensions: [{ name: "pagePath" }],
          metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 12,
        }),
        analytics.runReport({
          property,
          dateRanges,
          dimensions: [{ name: "country" }],
          metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: 10,
        }),
        analytics.runReport({
          property,
          dateRanges,
          dimensions: [{ name: "city" }, { name: "country" }],
          metrics: [{ name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: 10,
        }),
        analytics.runReport({
          property,
          dateRanges,
          dimensions: [{ name: "deviceCategory" }],
          metrics: [{ name: "activeUsers" }, { name: "sessions" }],
          orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
          limit: 6,
        }),
        analytics.runReport({
          property,
          dateRanges,
          dimensions: [{ name: "sessionDefaultChannelGroup" }],
          metrics: [{ name: "sessions" }, { name: "activeUsers" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 10,
        }),
        analytics.runReport({
          property,
          dateRanges,
          dimensions: [{ name: "date" }],
          metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
          orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
          limit: 100,
        }),
      ]);

    const totalRow = totalsRes.rows?.[0];
    const data: Ga4Overview = {
      range,
      propertyId: config.propertyId,
      totals: {
        activeUsers: metricValue(totalRow, 0),
        sessions: metricValue(totalRow, 1),
        screenPageViews: metricValue(totalRow, 2),
        bounceRate: metricValue(totalRow, 3),
        averageSessionDuration: metricValue(totalRow, 4),
      },
      topPages: (pagesRes.rows ?? []).map((row) => ({
        label: dim(row, 0),
        value: formatGa4Number(metricValue(row, 0)),
        secondary: `${formatGa4Number(metricValue(row, 1))} ผู้ใช้`,
      })),
      countries: (countriesRes.rows ?? []).map((row) => ({
        label: dim(row, 0),
        value: formatGa4Number(metricValue(row, 0)),
        secondary: `${formatGa4Number(metricValue(row, 1))} หน้า`,
      })),
      cities: (citiesRes.rows ?? []).map((row) => ({
        label: `${dim(row, 0)}${dim(row, 1) !== "—" ? `, ${dim(row, 1)}` : ""}`,
        value: formatGa4Number(metricValue(row, 0)),
      })),
      devices: (devicesRes.rows ?? []).map((row) => ({
        label: dim(row, 0),
        value: formatGa4Number(metricValue(row, 0)),
        secondary: `${formatGa4Number(metricValue(row, 1))} เซสชัน`,
      })),
      sources: (sourcesRes.rows ?? []).map((row) => ({
        label: dim(row, 0),
        value: formatGa4Number(metricValue(row, 0)),
        secondary: `${formatGa4Number(metricValue(row, 1))} ผู้ใช้`,
      })),
      daily: (dailyRes.rows ?? []).map((row) => {
        const raw = dim(row, 0);
        const date =
          raw.length === 8 ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}` : raw;
        return {
          date,
          users: metricValue(row, 0),
          views: metricValue(row, 1),
        };
      }),
    };

    return { ok: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "GA4 API error";
    return { ok: false, error: "api_error", message };
  }
}
