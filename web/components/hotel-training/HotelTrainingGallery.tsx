"use client";

import { useEffect, useId, useRef, useState } from "react";
import { HOTEL_TRAINING_GALLERY_PLACEHOLDER, hotelTrainingSampleLabel } from "@/lib/hotel-training";
import type { Locale } from "@/lib/seo";

type Item = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  consentLabel?: string;
  redactionLabel?: string;
  placeholder?: boolean;
};

function GalleryMeta({ item }: { item: Item }) {
  if (!item.consentLabel && !item.redactionLabel) return null;
  return (
    <ul className="ht-gallery-meta">
      {item.consentLabel ? <li>{item.consentLabel}</li> : null}
      {item.redactionLabel ? <li>{item.redactionLabel}</li> : null}
    </ul>
  );
}

export function HotelTrainingGallery({
  locale,
  title,
  lead,
  note,
  items,
  showSample = true,
}: {
  locale: Locale;
  title: string;
  lead: string;
  note?: string;
  items: Item[];
  showSample?: boolean;
}) {
  const sample = hotelTrainingSampleLabel(locale);
  const labelId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const openedRef = useRef(false);
  const [open, setOpen] = useState<number | null>(null);
  const current = open === null ? null : items[open];
  const captionId = `${labelId}-caption`;
  const dialogId = `${labelId}-dialog`;
  const closeLabel = locale === "th" ? "ปิด" : "Close";
  const prevLabel = locale === "th" ? "ภาพก่อนหน้า" : "Previous image";
  const nextLabel = locale === "th" ? "ภาพถัดไป" : "Next image";
  const dialogLabel = locale === "th" ? "ภาพขยายจากงานอบรม" : "Enlarged training photo";

  function openAt(index: number) {
    lastTriggerRef.current = triggerRefs.current[index];
    setOpen(index);
  }

  function closeLightbox() {
    setOpen(null);
  }

  useEffect(() => {
    if (open === null) {
      openedRef.current = false;
      const trigger = lastTriggerRef.current;
      if (trigger) {
        trigger.focus();
        lastTriggerRef.current = null;
      }
      return undefined;
    }
    if (!openedRef.current) {
      closeRef.current?.focus();
      openedRef.current = true;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    const focusables = () =>
      dialog ? Array.from(dialog.querySelectorAll<HTMLElement>("button:not([disabled])")) : [];
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setOpen((index) => (index === null ? 0 : (index + 1) % items.length));
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setOpen((index) => (index === null ? 0 : (index - 1 + items.length) % items.length));
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        setOpen(0);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        setOpen(Math.max(0, items.length - 1));
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = focusables();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!nodes.includes(active as HTMLElement)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [items.length, open]);

  return (
    <section id="training-gallery" className="kpi-train-gallery border-y border-[#E3E8EB] bg-white" aria-labelledby={labelId}>
      <div className="kpi-section">
        <h2 id={labelId} className="kpi-h2">
          {title}
        </h2>
        <p className="kpi-train-problems-lead">{lead}</p>
        {note ? <p className="ht-gallery-note">{note}</p> : null}
        {showSample ? <p className="ht-status is-yellow">{sample}</p> : null}
        <div className="ht-gallery-grid">
          {items.map((item, index) => (
            <figure key={item.id}>
              <button
                type="button"
                ref={(node) => {
                  triggerRefs.current[index] = node;
                }}
                onClick={() => openAt(index)}
                aria-haspopup="dialog"
                aria-expanded={open === index}
                aria-controls={dialogId}
                aria-label={item.alt}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  width={HOTEL_TRAINING_GALLERY_PLACEHOLDER.displayWidth}
                  height={HOTEL_TRAINING_GALLERY_PLACEHOLDER.displayHeight}
                  loading="lazy"
                  decoding="async"
                />
              </button>
              <figcaption>
                <span>
                  {item.placeholder ? <span className="ht-status is-yellow">{sample}</span> : null} {item.caption}
                </span>
                <GalleryMeta item={item} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      {current ? (
        <div className="ht-lightbox" role="presentation" onClick={closeLightbox}>
          <div
            ref={dialogRef}
            className="ht-lightbox-dialog"
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-label={dialogLabel}
            aria-describedby={captionId}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" ref={closeRef} className="ht-lightbox-close" onClick={closeLightbox} aria-label={closeLabel}>
              {closeLabel}
            </button>
            {items.length > 1 ? (
              <>
                <button
                  type="button"
                  className="ht-lightbox-nav is-prev"
                  onClick={() => setOpen((index) => (index === null ? 0 : (index - 1 + items.length) % items.length))}
                  aria-label={prevLabel}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="ht-lightbox-nav is-next"
                  onClick={() => setOpen((index) => (index === null ? 0 : (index + 1) % items.length))}
                  aria-label={nextLabel}
                >
                  ›
                </button>
              </>
            ) : null}
            <img
              src={current.src}
              alt={current.alt}
              width={HOTEL_TRAINING_GALLERY_PLACEHOLDER.sourceWidth}
              height={HOTEL_TRAINING_GALLERY_PLACEHOLDER.sourceHeight}
              decoding="async"
            />
            <div id={captionId} className="ht-lightbox-caption">
              <p>{current.caption}</p>
              <GalleryMeta item={current} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
