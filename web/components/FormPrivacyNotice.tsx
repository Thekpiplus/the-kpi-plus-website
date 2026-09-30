"use client";

import Link from "next/link";
import { FORM_NOTICE } from "@/lib/privacy";
import { existingHref, type Locale } from "@/lib/seo";

export function FormPrivacyNotice({
  locale,
  variant = "contact",
}: {
  locale: Locale;
  variant?: "contact" | "partner";
}) {
  const lang = locale === "th" ? "th" : "en";
  const t = FORM_NOTICE[lang];
  const href = existingHref("/privacy", locale) ?? (lang === "th" ? "/privacy" : "/en/privacy");
  return (
    <p className="text-sm leading-7 text-[#555555]">
      {t[variant]} {t.more}{" "}
      <Link href={href} className="font-semibold text-[#0B6660]">
        {t.privacy}
      </Link>
    </p>
  );
}
