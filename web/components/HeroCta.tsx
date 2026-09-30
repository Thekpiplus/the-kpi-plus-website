import Link from "next/link";
import { uiCopy } from "@/lib/nav";
import { auditHref, type Locale } from "@/lib/seo";

export function HeroCta({ locale, className = "mt-6" }: { locale: Locale; className?: string }) {
  const t = uiCopy(locale);
  return (
    <Link href={auditHref(locale)} className={`kpi-button ${className}`}>
      {t.audit}
    </Link>
  );
}
