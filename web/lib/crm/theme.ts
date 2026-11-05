export const CRM_THEME_STORAGE_KEY = "crm-theme";

export type CrmThemePreference = "light" | "dark" | "system";
export type CrmResolvedTheme = "light" | "dark";

export const CRM_THEME_ORDER: CrmThemePreference[] = ["light", "dark", "system"];

export function isCrmThemePreference(value: unknown): value is CrmThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

export function readCrmThemePreference(): CrmThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = window.localStorage.getItem(CRM_THEME_STORAGE_KEY);
    if (isCrmThemePreference(stored)) return stored;
  } catch {
    /* ignore */
  }
  return "system";
}

export function resolveCrmTheme(preference: CrmThemePreference): CrmResolvedTheme {
  if (preference !== "system") return preference;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyCrmTheme(preference: CrmThemePreference): CrmResolvedTheme {
  const resolved = resolveCrmTheme(preference);
  if (typeof document === "undefined") return resolved;

  const root = document.documentElement;
  root.setAttribute("data-crm-theme", resolved);
  root.setAttribute("data-crm-theme-pref", preference);
  root.style.colorScheme = resolved;

  document.querySelectorAll<HTMLElement>(".crm-shell").forEach((shell) => {
    shell.setAttribute("data-theme", resolved);
    shell.setAttribute("data-theme-pref", preference);
  });

  return resolved;
}

export function persistCrmThemePreference(preference: CrmThemePreference): void {
  try {
    window.localStorage.setItem(CRM_THEME_STORAGE_KEY, preference);
  } catch {
    /* ignore */
  }
}

export function nextCrmThemePreference(current: CrmThemePreference): CrmThemePreference {
  const index = CRM_THEME_ORDER.indexOf(current);
  return CRM_THEME_ORDER[(index + 1) % CRM_THEME_ORDER.length];
}

export function crmThemePreferenceLabel(preference: CrmThemePreference): string {
  switch (preference) {
    case "light":
      return "สว่าง";
    case "dark":
      return "มืด";
    default:
      return "ตามระบบ";
  }
}
