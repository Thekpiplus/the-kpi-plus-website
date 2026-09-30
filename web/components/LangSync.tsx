"use client";

import { useEffect } from "react";
import { htmlLang, type Locale } from "@/lib/seo";

export function LangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = htmlLang(locale);
  }, [locale]);
  return null;
}
