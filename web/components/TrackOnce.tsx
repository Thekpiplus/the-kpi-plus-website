"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";

export function TrackOnce({ event, params }: { event: string; params?: Record<string, string> }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(event, params);
  }, [event, params]);
  return null;
}
