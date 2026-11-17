"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

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

  const selectCls = "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm font-medium text-navy-900 outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-navy-900">
          {labels.destination}
          <select className={selectCls} value={f.destination} onChange={(e) => set("destination", e.target.value)}>
            <option value="">{labels.all}</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>{d.name}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-navy-900">
          {labels.month}
          <select className={selectCls} value={f.month} onChange={(e) => set("month", e.target.value)}>
            <option value="">{labels.anyMonth}</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-navy-900">
          {labels.duration}
          <select className={selectCls} value={f.duration} onChange={(e) => set("duration", e.target.value)}>
            <option value="">{labels.all}</option>
            <option value="short">{labels.short}</option>
            <option value="long">{labels.long}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-navy-900">
          {labels.tripType}
          <select className={selectCls} value={f.type} onChange={(e) => set("type", e.target.value)}>
            <option value="">{labels.all}</option>
            <option value="open">{labels.open}</option>
            <option value="private">{labels.private}</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-navy-900">
          {labels.maxPrice}
          <select className={selectCls} value={f.max} onChange={(e) => set("max", e.target.value)}>
            <option value="">{labels.all}</option>
            {prices.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </label>
        <Button variant="ghost" className="justify-start px-0 text-slate-brand" onClick={() => router.replace(pathname, { scroll: false })}>
          {labels.reset}
        </Button>
      </aside>
      <div>
        <p className="mb-4 text-sm text-muted-foreground">
          {visible.length} {labels.results}
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
