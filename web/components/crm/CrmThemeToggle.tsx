"use client";

import { useEffect, useState } from "react";
import {
  applyCrmTheme,
  crmThemePreferenceLabel,
  nextCrmThemePreference,
  persistCrmThemePreference,
  readCrmThemePreference,
  type CrmThemePreference,
} from "@/lib/crm/theme";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.05 5.05l1.55 1.55M17.4 17.4l1.55 1.55M18.95 5.05l-1.55 1.55M6.6 17.4l-1.55 1.55"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M19.5 13.4A7.5 7.5 0 0 1 10.6 4.5 7.6 7.6 0 1 0 19.5 13.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 19.5h8M12 16.5v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ThemeIcon({ preference }: { preference: CrmThemePreference }) {
  if (preference === "dark") return <MoonIcon />;
  if (preference === "system") return <SystemIcon />;
  return <SunIcon />;
}

export function CrmThemeToggle({ className = "" }: { className?: string }) {
  const [preference, setPreference] = useState<CrmThemePreference>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = readCrmThemePreference();
    setPreference(initial);
    applyCrmTheme(initial);
    setMounted(true);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSchemeChange = () => {
      const current = readCrmThemePreference();
      if (current === "system") applyCrmTheme("system");
    };
    media.addEventListener("change", onSchemeChange);
    return () => media.removeEventListener("change", onSchemeChange);
  }, []);

  function cycleTheme() {
    const next = nextCrmThemePreference(preference);
    setPreference(next);
    persistCrmThemePreference(next);
    applyCrmTheme(next);
  }

  const currentLabel = crmThemePreferenceLabel(preference);
  const nextLabel = crmThemePreferenceLabel(nextCrmThemePreference(preference));
  const ariaLabel = mounted
    ? `ธีมปัจจุบัน: ${currentLabel}. กดเพื่อเปลี่ยนเป็น ${nextLabel}`
    : "เปลี่ยนธีม";

  return (
    <button
      type="button"
      className={`crm-theme-toggle ${className}`.trim()}
      onClick={cycleTheme}
      aria-label={ariaLabel}
      title={`ธีม: ${currentLabel}`}
      data-theme-pref={preference}
    >
      <ThemeIcon preference={preference} />
      <span className="crm-theme-toggle-label" aria-hidden="true">
        {mounted ? currentLabel : "…"}
      </span>
    </button>
  );
}
