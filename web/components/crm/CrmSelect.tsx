"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type CrmSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type CrmSelectProps = {
  name: string;
  options: CrmSelectOption[];
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  size?: "default" | "pipe";
  "aria-label"?: string;
  onChange?: (value: string) => void;
};

type MenuBox = { top: number; left: number; width: number; maxHeight: number };

export function CrmSelect({
  name,
  options,
  value,
  defaultValue = "",
  disabled = false,
  required = false,
  className = "",
  size = "default",
  "aria-label": ariaLabel,
  onChange,
}: CrmSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const selectedValue = isControlled ? value : internal;
  const [open, setOpen] = useState(false);
  const [menuBox, setMenuBox] = useState<MenuBox | null>(null);
  const [mounted, setMounted] = useState(false);

  const selected = useMemo(
    () => options.find((item) => item.value === selectedValue) ?? null,
    [options, selectedValue],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setMenuBox(null);
      return;
    }
    const place = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const gap = 6;
      const spaceBelow = window.innerHeight - rect.bottom - gap - 8;
      const spaceAbove = rect.top - gap - 8;
      const preferBelow = spaceBelow >= 200 || spaceBelow >= spaceAbove;
      const maxHeight = Math.max(160, Math.min(360, preferBelow ? spaceBelow : spaceAbove));
      const top = preferBelow ? rect.bottom + gap : Math.max(8, rect.top - gap - maxHeight);
      setMenuBox({
        top,
        left: rect.left,
        width: Math.max(rect.width, size === "pipe" ? 10.5 * 16 : rect.width),
        maxHeight,
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, size]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function commit(next: string) {
    if (!isControlled) setInternal(next);
    onChange?.(next);
    setOpen(false);
  }

  const shellClass = [
    "crm-select-shell",
    size === "pipe" ? "is-pipe" : "",
    open ? "is-open" : "",
    disabled ? "is-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const menu =
    open && mounted && menuBox
      ? createPortal(
          <ul
            className="crm-select-menu"
            id={listId}
            role="listbox"
            aria-label={ariaLabel}
            ref={menuRef}
            style={{
              position: "fixed",
              top: menuBox.top,
              left: menuBox.left,
              width: menuBox.width,
              maxHeight: menuBox.maxHeight,
              zIndex: 120,
            }}
          >
            {options.map((item) => {
              const isSelected = item.value === selectedValue;
              return (
                <li key={`${item.value}::${item.label}`} role="none">
                  <button
                    type="button"
                    role="option"
                    className={`crm-select-option${isSelected ? " is-selected" : ""}`}
                    aria-selected={isSelected}
                    disabled={item.disabled}
                    onClick={() => commit(item.value)}
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div className={shellClass} ref={rootRef}>
      <input type="hidden" name={name} value={selectedValue} required={required && !disabled} disabled={disabled} />
      <button
        type="button"
        ref={triggerRef}
        className={size === "pipe" ? "crm-pipe-select crm-select-trigger" : "crm-select crm-select-trigger"}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
      >
        <span className="crm-select-trigger-label">{selected?.label || "—"}</span>
        <span className="crm-select-chevron" aria-hidden="true" />
      </button>
      {menu}
    </div>
  );
}
