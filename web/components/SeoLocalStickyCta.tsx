"use client";

import { useEffect, useState } from "react";

export function SeoLocalStickyCta({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById("search-enquiry");
    if (!form) return;

    const onScroll = () => {
      const heroEnd = 420;
      const formTop = form.getBoundingClientRect().top;
      const formVisible = formTop < window.innerHeight - 80;
      setVisible(window.scrollY > heroEnd && !formVisible);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("kpi-sticky-cta-pad", visible);
    return () => document.body.classList.remove("kpi-sticky-cta-pad");
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="kpi-sticky-cta lg:hidden">
      <a href="#search-enquiry" className="kpi-button w-full">
        {label}
      </a>
    </div>
  );
}
