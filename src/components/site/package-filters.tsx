"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FancySelect } from "@/components/ui/fancy-select";

export type FilterItem = { slug: string; destination: string; days: number; types: string[]; price: number; months: string[] };

type Labels = {
  destination: string;
  duration: string;
  tripType: string;
  maxPrice: string;
  all: string;
  short: string;
  long: string;
  reset: string;
  noResults: string;
  results: string;
  result: string;
  open: string;
  private: string;
  anyMonth: string;
  month: string;
};

export function PackageFilters({
  items,
  cards,
  destinations,
  months,
  prices,
  labels,
}: {
  items: FilterItem[];
  cards: Record<string, React.ReactNode>;
  destinations: { slug: string; name: string }[];
  months: { value: string; label: string }[];
  prices: { value: string; label: string }[];
  labels: Labels;
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const f = {
    destination: sp.get("destination") ?? "",
    duration: sp.get("duration") ?? "",
    type: sp.get("type") ?? "",
    month: sp.get("month") ?? "",
    max: sp.get("max") ?? "",
  };

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const visible = useMemo(
    () =>
      items.filter(
        (p) =>
          (!f.destination || p.destination === f.destination) &&
          (!f.duration || (f.duration === "short" ? p.days <= 3 : p.days >= 4)) &&
          (!f.type || p.types.includes(f.type)) &&
          (!f.month || p.months.includes(f.month)) &&
          (!f.max || p.price <= Number(f.max)),
      ),
    [items, f.destination, f.duration, f.type, f.month, f.max],
  );

  const all = { value: "", label: labels.all };

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside className="z-20 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <FancySelect label={labels.destination} value={f.destination} onChange={(v) => set("destination", v)} options={[all, ...destinations.map((d) => ({ value: d.slug, label: d.name }))]} />
        <FancySelect label={labels.month} value={f.month} onChange={(v) => set("month", v)} options={[{ value: "", label: labels.anyMonth }, ...months]} />
        <FancySelect label={labels.duration} value={f.duration} onChange={(v) => set("duration", v)} options={[all, { value: "short", label: labels.short }, { value: "long", label: labels.long }]} />
        <FancySelect label={labels.tripType} value={f.type} onChange={(v) => set("type", v)} options={[all, { value: "open", label: labels.open }, { value: "private", label: labels.private }]} />
        <FancySelect label={labels.maxPrice} value={f.max} onChange={(v) => set("max", v)} options={[all, ...prices]} />
        <Button variant="ghost" className="justify-start px-0 text-slate-brand" onClick={() => router.replace(pathname, { scroll: false })}>
          {labels.reset}
        </Button>
      </aside>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">
          {visible.length} {visible.length === 1 ? labels.result : labels.results}
        </p>
        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">{labels.noResults}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((p) => (
              <div key={p.slug} className="flex">{cards[p.slug]}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
