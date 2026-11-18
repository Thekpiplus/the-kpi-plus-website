"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { Locale } from "@/lib/seo";

function Slot({ minHeight = 280 }: { minHeight?: number }) {
  return <div className="kpi-deferred-slot" style={{ minHeight }} aria-hidden="true" />;
}

const SearchBehaviorVisual = dynamic(
  () => import("./HotelSeoSearchBehaviorVisual").then((m) => m.HotelSeoSearchBehaviorVisual),
  { ssr: false, loading: () => <Slot minHeight={320} /> },
);
const CompareMatrix = dynamic(
  () => import("./HotelSeoCompareMatrix").then((m) => m.HotelSeoCompareMatrix),
  { ssr: false, loading: () => <Slot minHeight={360} /> },
);
const AuditVisual = dynamic(
  () => import("./HotelSeoAuditVisual").then((m) => m.HotelSeoAuditVisual),
  { ssr: false, loading: () => <Slot minHeight={320} /> },
);
const DiscoveryFlow = dynamic(
  () => import("./HotelSeoDiscoveryFlow").then((m) => m.HotelSeoDiscoveryFlow),
  { ssr: false, loading: () => <Slot minHeight={320} /> },
);
const HelpSteps = dynamic(
  () => import("./HotelSeoHelpSteps").then((m) => m.HotelSeoHelpSteps),
  { ssr: false, loading: () => <Slot minHeight={280} /> },
);
const HelpBoundary = dynamic(
  () => import("./HotelSeoHelpBoundary").then((m) => m.HotelSeoHelpBoundary),
  { ssr: false, loading: () => <Slot minHeight={160} /> },
);
const GbpVisual = dynamic(
  () => import("./HotelSeoGbpVisual").then((m) => m.HotelSeoGbpVisual),
  { ssr: false, loading: () => <Slot minHeight={320} /> },
);
const ProcessVisual = dynamic(
  () => import("./HotelSeoProcessVisual").then((m) => m.HotelSeoProcessVisual),
  { ssr: false, loading: () => <Slot minHeight={280} /> },
);
const ProcessSteps = dynamic(
  () => import("./HotelSeoProcessSteps").then((m) => m.HotelSeoProcessSteps),
  { ssr: false, loading: () => <Slot minHeight={280} /> },
);
const KpiVisual = dynamic(
  () => import("./HotelSeoKpiVisual").then((m) => m.HotelSeoKpiVisual),
  { ssr: false, loading: () => <Slot minHeight={280} /> },
);
const KpiFramework = dynamic(
  () => import("./HotelSeoKpiFramework").then((m) => m.HotelSeoKpiFramework),
  { ssr: false, loading: () => <Slot minHeight={320} /> },
);
const RelatedVisual = dynamic(
  () => import("./HotelSeoRelatedVisual").then((m) => m.HotelSeoRelatedVisual),
  { ssr: false, loading: () => <Slot minHeight={240} /> },
);
const RelatedCards = dynamic(
  () => import("./HotelSeoRelatedCards").then((m) => m.HotelSeoRelatedCards),
  { ssr: false, loading: () => <Slot minHeight={240} /> },
);

/* Server views pass CMS shapes through; cast keeps deferred wrappers from fighting dynamic prop inference. */
type DeferredProps = { locale: Locale } & Record<string, unknown>;

export function DeferredSearchBehaviorVisual(props: DeferredProps) {
  return <SearchBehaviorVisual {...(props as ComponentProps<typeof SearchBehaviorVisual>)} />;
}
export function DeferredCompareMatrix(props: DeferredProps) {
  return <CompareMatrix {...(props as ComponentProps<typeof CompareMatrix>)} />;
}
export function DeferredAuditVisual(props: DeferredProps) {
  return <AuditVisual {...(props as ComponentProps<typeof AuditVisual>)} />;
}
export function DeferredDiscoveryFlow(props: DeferredProps) {
  return <DiscoveryFlow {...(props as ComponentProps<typeof DiscoveryFlow>)} />;
}
export function DeferredHelpSteps(props: DeferredProps) {
  return <HelpSteps {...(props as ComponentProps<typeof HelpSteps>)} />;
}
export function DeferredHelpBoundary(props: DeferredProps) {
  return <HelpBoundary {...(props as ComponentProps<typeof HelpBoundary>)} />;
}
export function DeferredGbpVisual(props: DeferredProps) {
  return <GbpVisual {...(props as ComponentProps<typeof GbpVisual>)} />;
}
export function DeferredProcessVisual(props: DeferredProps) {
  return <ProcessVisual {...(props as ComponentProps<typeof ProcessVisual>)} />;
}
export function DeferredProcessSteps(props: DeferredProps) {
  return <ProcessSteps {...(props as ComponentProps<typeof ProcessSteps>)} />;
}
export function DeferredKpiVisual(props: DeferredProps) {
  return <KpiVisual {...(props as ComponentProps<typeof KpiVisual>)} />;
}
export function DeferredKpiFramework(props: DeferredProps) {
  return <KpiFramework {...(props as ComponentProps<typeof KpiFramework>)} />;
}
export function DeferredRelatedVisual(props: DeferredProps) {
  return <RelatedVisual {...(props as ComponentProps<typeof RelatedVisual>)} />;
}
export function DeferredRelatedCards(props: DeferredProps) {
  return <RelatedCards {...(props as ComponentProps<typeof RelatedCards>)} />;
}
