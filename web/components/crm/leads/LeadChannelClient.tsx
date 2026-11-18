"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { LeadChannelBar } from "@/components/crm/leads/LeadChannelBar";
import type { LeadChannelStat } from "@/components/crm/leads/lead-channel-types";

function channelHref(source: string, searchParams: URLSearchParams) {
  const next = new URLSearchParams();
  next.set("view", "channel");
  if (source) next.set("source", source);
  const archive = searchParams.get("archive");
  const q = searchParams.get("q");
  const stageId = searchParams.get("stageId");
  const ownerId = searchParams.get("ownerId");
  const sort = searchParams.get("sort");
  const stat = searchParams.get("stat");
  if (archive) next.set("archive", archive);
  if (q) next.set("q", q);
  if (stageId) next.set("stageId", stageId);
  if (ownerId) next.set("ownerId", ownerId);
  if (sort) next.set("sort", sort);
  if (stat) next.set("stat", stat);
  return `/crm/leads?${next.toString()}`;
}

export function LeadChannelClient({
  channels,
  selected,
  clearHref,
  invalidSource,
  children,
}: {
  channels: LeadChannelStat[];
  selected: string;
  clearHref: string;
  invalidSource?: string;
  children?: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div style={{ display: "grid", gap: "clamp(0.9rem, 1.6vw, 1.25rem)", width: "100%", minWidth: 0 }}>
      <LeadChannelBar
        channels={channels}
        selected={selected}
        clearHref={clearHref}
        onSelect={(source) => {
          router.push(channelHref(source === selected ? "" : source, new URLSearchParams(searchParams.toString())));
        }}
      />

      {invalidSource ? (
        <div className="kpi-lead-ch-invalid" role="status">
          <p>ช่องทาง «{invalidSource}» ไม่ถูกต้องหรือยังไม่รองรับในระบบ</p>
          <Link href={clearHref} className="kpi-leads-btn-secondary">
            เลือกช่องทางใหม่
          </Link>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
