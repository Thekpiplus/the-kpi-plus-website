const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"] as const;
const FORECAST = [74, 72, 70, 68, 66, 64, 63, 62] as const;
const PACE = [71, 68, 65, 61, 58, 55, 53, 52] as const;
const TARGET = 75;

export const OCCUPANCY_SAMPLE = {
  latest: FORECAST[FORECAST.length - 1],
  target: TARGET,
  pace: PACE[PACE.length - 1],
  periodDays: 60,
  weekCount: WEEKS.length,
} as const;

export const OCCUPANCY_SAMPLE_SERIES = {
  labels: [...WEEKS],
  forecast: [...FORECAST],
  pace: [...PACE],
} as const;
