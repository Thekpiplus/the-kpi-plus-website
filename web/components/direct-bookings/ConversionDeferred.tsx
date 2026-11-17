"use client";

import dynamic from "next/dynamic";
import type { Locale } from "@/lib/seo";

function Slot({ minHeight = 280 }: { minHeight?: number }) {
  return <div className="kpi-deferred-slot" style={{ minHeight }} aria-hidden="true" />;
}

const ConfidenceVisual = dynamic(
  () => import("./ConversionConfidenceVisual").then((m) => m.ConversionConfidenceVisual),
  { ssr: false, loading: () => <Slot minHeight={320} /> },
);
const FrictionMap = dynamic(
  () => import("./ConversionFrictionTable").then((m) => m.ConversionFrictionMap),
  { ssr: false, loading: () => <Slot minHeight={360} /> },
);
const Framework = dynamic(
  () => import("./ConversionFramework").then((m) => m.ConversionFramework),
  { ssr: false, loading: () => <Slot minHeight={420} /> },
);
const FrictionAudit = dynamic(
  () => import("./ConversionFrictionAudit").then((m) => m.ConversionFrictionAudit),
  { ssr: false, loading: () => <Slot minHeight={360} /> },
);
const Decision = dynamic(
  () => import("./ConversionDecision").then((m) => m.ConversionDecision),
  { ssr: false, loading: () => <Slot minHeight={360} /> },
);
const Measure = dynamic(
  () => import("./ConversionMeasure").then((m) => m.ConversionMeasure),
  { ssr: false, loading: () => <Slot minHeight={360} /> },
);
const Workflow = dynamic(
  () => import("./ConversionWorkflow").then((m) => m.ConversionWorkflow),
  { ssr: false, loading: () => <Slot minHeight={320} /> },
);
const Related = dynamic(
  () => import("./ConversionRelated").then((m) => m.ConversionRelated),
  { ssr: false, loading: () => <Slot minHeight={280} /> },
);

/* Props mirror the underlying section components; kept loose so the server view can pass CMS shapes through. */
type DeferredProps = { locale: Locale } & Record<string, unknown>;

export function DeferredConfidenceVisual(props: DeferredProps) {
  return <ConfidenceVisual {...props} />;
}
export function DeferredFrictionMap(props: DeferredProps) {
  return <FrictionMap {...props} />;
}
export function DeferredFramework(props: DeferredProps) {
  return <Framework {...props} />;
}
export function DeferredFrictionAudit(props: DeferredProps) {
  return <FrictionAudit {...props} />;
}
export function DeferredDecision(props: DeferredProps) {
  return <Decision {...props} />;
}
export function DeferredMeasure(props: DeferredProps) {
  return <Measure {...props} />;
}
export function DeferredWorkflow(props: DeferredProps) {
  return <Workflow {...props} />;
}
export function DeferredRelated(props: DeferredProps) {
  return <Related {...props} />;
}
