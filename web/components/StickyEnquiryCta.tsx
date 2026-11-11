"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { getPageLenis, scrollPageToHash } from "@/lib/page-scroll";

type StickyEnquiryCtaProps = {
  formId: string;
  label: ReactNode;
  className?: string;
  buttonClassName?: string;
  buttonStyle?: CSSProperties;
  heroEnd?: number;
};

export function StickyEnquiryCta({
  formId,
  label,
  className = "",
  buttonClassName = "kpi-button w-full",
  buttonStyle,
  heroEnd = 420,
}: StickyEnquiryCtaProps) {
  const [visible, setVisible] = useState(false);
  const hash = `#${formId}`;

  useEffect(() => {
    const form = document.getElementById(formId);
    if (!form) return;

    const onScroll = () => {
      const formTop = form.getBoundingClientRect().top;
      const formVisible = formTop < window.innerHeight - 80;
      const y = getPageLenis()?.scroll ?? window.scrollY;
      setVisible(y > heroEnd && !formVisible);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let offLenis: (() => void) | undefined;
    const attachLenis = () => {
      if (offLenis) return;
      const lenis = getPageLenis();
      if (!lenis) return;
      offLenis = lenis.on("scroll", onScroll);
    };
    attachLenis();
    const retry = window.setInterval(attachLenis, 250);

    return () => {
      window.clearInterval(retry);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      offLenis?.();
    };
  }, [formId, heroEnd]);

  useEffect(() => {
    document.body.classList.toggle("kpi-sticky-cta-pad", visible);
    return () => document.body.classList.remove("kpi-sticky-cta-pad");
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`kpi-sticky-cta lg:hidden${className ? ` ${className}` : ""}`}>
      <a
        href={hash}
        className={buttonClassName}
        style={buttonStyle}
        onClick={(event) => {
          event.preventDefault();
          // Long solution pages need an immediate jump; Lenis lerp feels stuck on mobile.
          scrollPageToHash(hash, { immediate: true });
          if (window.history?.replaceState) {
            window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
          }
        }}
      >
        {label}
      </a>
    </div>
  );
}
