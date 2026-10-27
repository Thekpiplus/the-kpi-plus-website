import { MetaObjectiveBoundary } from "./MetaObjectiveBoundary";
import type { Locale } from "@/lib/seo";

/** @deprecated Public page uses MetaObjectiveBoundary. Kept as an alias. */
export function MetaScenarioDecisions({ locale }: { locale: Locale }) {
  return <MetaObjectiveBoundary locale={locale} />;
}
