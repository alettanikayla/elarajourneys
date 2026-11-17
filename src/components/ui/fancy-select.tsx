"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type FancyOption = { value: string; label: string };

type Props = {
  label: string;
  options: FancyOption[];
  /** Controlled value. Omit to let the component manage its own state (e.g. inside a GET form). */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Adds a hidden input so the value is submitted with a native form. */
  name?: string;
  /** "hero": borderless field inside the home search bar. "field": bordered input with the label above. */
  variant?: "hero" | "field";
  className?: string;
};

/** Animated, keyboard-accessible replacement for <select>. */
export function FancySelect({ label, options, value, defaultValue = "", onChange, name, variant = "field", className }: Props) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === current));
  const selected = options[selectedIndex];

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted option visible while using the keyboard.
  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function choose(v: string) {
    if (value === undefined) setInner(v);
    onChange?.(v);
    setOpen(false);
  }

  function openList() {
    setActive(selectedIndex);
    setOpen(true);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "Tab") return setOpen(false);
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) e.preventDefault();
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) openList();
      return;
    }
    if (e.key === "ArrowDown") setActive((i) => Math.min(options.length - 1, i + 1));
    if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
    if (e.key === "Home") setActive(0);
    if (e.key === "End") setActive(options.length - 1);
    if (e.key === "Enter" || e.key === " ") choose(options[active].value);
  }

  const hero = variant === "hero";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name && <input type="hidden" name={name} value={current} />}
      {!hero && <span id={`${id}-label`} className="mb-1.5 block text-sm font-medium text-navy-900">{label}</span>}
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "group flex w-full items-center justify-between gap-3 text-left outline-none transition-all duration-200",
          hero
            ? "rounded-xl px-4 py-2.5 hover:bg-mist focus-visible:bg-mist focus-visible:ring-2 focus-visible:ring-ring"
            : "h-11 rounded-xl border border-border bg-card px-3.5 text-sm font-medium text-navy-900 shadow-sm shadow-navy-900/5 hover:border-slate-brand/60 focus-visible:ring-2 focus-visible:ring-ring",
          open && (hero ? "bg-mist" : "border-navy-800 ring-2 ring-navy-800/15"),
        )}
      >
        <span className="flex min-w-0 flex-col">
          {hero && <span id={`${id}-label`} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>}
          <span className={cn("truncate", hero && "pt-0.5 text-sm font-semibold text-navy-900")}>{selected?.label}</span>
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-slate-brand transition-transform duration-300 ease-out", open && "rotate-180 text-navy-800")} />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-72 origin-top animate-pop-in overflow-auto rounded-2xl border border-border/70 bg-white p-1.5 shadow-xl shadow-navy-900/15"
        >
          {options.map((o, i) => {
            const isSelected = o.value === current;
            return (
              <li
                key={o.value || "__all"}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(i)}
                onClick={() => choose(o.value)}
                style={{ animationDelay: `${Math.min(i, 8) * 25}ms` }}
                className={cn(
                  "flex animate-option-in cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150",
                  i === active ? "bg-mist text-navy-900" : "text-navy-800",
                  isSelected && "font-semibold",
                )}
              >
                {o.label}
                <Check className={cn("size-4 shrink-0 text-navy-800 transition-all duration-200", isSelected ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
