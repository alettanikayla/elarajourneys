"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { demoStore } from "@/lib/demo-store";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

type Props = { lang: Locale; destinations: { slug: string; name: string }[]; dict: Dictionary["custom"] };

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn("rounded-full px-4 py-2 text-sm font-medium ring-1 transition", active ? "bg-navy-800 text-white ring-navy-800" : "bg-card text-navy-900 ring-border hover:bg-mist")}
    >
      {children}
    </button>
  );
}

export function CustomTripForm({ lang, destinations, dict }: Props) {
  const f = dict.form;
  const [s, setS] = useState({
    destinations: [] as string[],
    other: "",
    dateFrom: "",
    dateTo: "",
    flexible: false,
    adults: 4,
    children: 0,
    groupType: "family",
    budget: f.budgets[1],
    hotel: f.hotels[1],
    interests: [] as string[],
    wantsPhoto: false,
    wantsVideo: false,
    specialNeeds: "",
    name: "",
    email: "",
    phone: "",
  });
  const [ref, setRef] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  const toggle = (key: "destinations" | "interests", v: string) =>
    setS((x) => ({ ...x, [key]: x[key].includes(v) ? x[key].filter((i) => i !== v) : [...x[key], v] }));

  const errors = {
    dest: s.destinations.length === 0 && !s.other.trim(),
    name: s.name.trim().length < 2,
    email: !/^\S+@\S+\.\S+$/.test(s.email),
    phone: s.phone.replace(/\D/g, "").length < 9,
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.values(errors).some(Boolean)) {
      setShowErrors(true);
      return;
    }
    const newRef = `REQ-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    demoStore.saveRequest({ ref: newRef, ...s, lang, status: "new", createdAt: new Date().toISOString() });
    setRef(newRef);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (ref) {
    const names = [...s.destinations.map((d) => destinations.find((x) => x.slug === d)?.name ?? d), s.other].filter(Boolean).join(", ");
    const summary =
      lang === "id"
        ? `Halo Elara Journeys, saya baru mengirim permintaan custom trip ${ref}.\nDestinasi: ${names}\nPeserta: ${s.adults} dewasa, ${s.children} anak\nTanggal: ${s.dateFrom || "-"} s/d ${s.dateTo || "-"}${s.flexible ? " (fleksibel)" : ""}\nBudget: ${s.budget}`
        : `Hi Elara Journeys, I just sent custom trip request ${ref}.\nDestinations: ${names}\nGroup: ${s.adults} adults, ${s.children} children\nDates: ${s.dateFrom || "-"} to ${s.dateTo || "-"}${s.flexible ? " (flexible)" : ""}\nBudget: ${s.budget}`;
    return (
      <div className="rounded-3xl bg-card p-10 text-center ring-1 ring-border">
        <CheckCircle2 className="mx-auto size-14 text-emerald-600" />
        <h2 className="mt-4 text-4xl font-semibold text-navy-900">{dict.successTitle}</h2>
        <p className="mt-3 text-muted-foreground">{dict.successText}</p>
        <p className="font-mono text-3xl font-bold tracking-wider text-navy-800">{ref}</p>
        <p className="mt-3 text-sm text-muted-foreground">{dict.successNext}</p>
        <Button asChild size="lg" className="mt-8 rounded-full bg-whatsapp text-white hover:bg-whatsapp/90">
          <a href={whatsappLink(summary)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="size-5" />{dict.continueWa}</a>
        </Button>
      </div>
    );
  }

  const input = "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const label = "flex flex-col gap-1.5 text-sm font-medium text-navy-900";
  const bad = (b: boolean) => showErrors && b && "ring-2 ring-destructive";

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-8 rounded-3xl bg-card p-6 ring-1 ring-border sm:p-10">
      <fieldset className={cn("rounded-xl", bad(errors.dest))}>
        <legend className="mb-3 text-sm font-semibold text-navy-900">{f.destinations}</legend>
        <div className="flex flex-wrap gap-2">
          {destinations.map((d) => (
            <Chip key={d.slug} active={s.destinations.includes(d.slug)} onClick={() => toggle("destinations", d.slug)}>{d.name}</Chip>
          ))}
        </div>
        <input className={cn(input, "mt-3")} placeholder={f.other} value={s.other} onChange={(e) => setS({ ...s, other: e.target.value })} aria-label={f.other} />
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>{f.dateFrom}<input type="date" className={input} value={s.dateFrom} onChange={(e) => setS({ ...s, dateFrom: e.target.value })} /></label>
        <label className={label}>{f.dateTo}<input type="date" className={input} min={s.dateFrom} value={s.dateTo} onChange={(e) => setS({ ...s, dateTo: e.target.value })} /></label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" className="size-4 accent-navy-800" checked={s.flexible} onChange={(e) => setS({ ...s, flexible: e.target.checked })} /> {f.flexible}
        </label>
        <label className={label}>{f.adults}<input type="number" min={1} max={200} className={input} value={s.adults} onChange={(e) => setS({ ...s, adults: Number(e.target.value) })} /></label>
        <label className={label}>{f.children}<input type="number" min={0} max={200} className={input} value={s.children} onChange={(e) => setS({ ...s, children: Number(e.target.value) })} /></label>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-navy-900">{f.groupType}</legend>
        <div className="flex flex-wrap gap-2">
          {Object.entries(f.groupTypes).map(([k, v]) => (
            <Chip key={k} active={s.groupType === k} onClick={() => setS({ ...s, groupType: k })}>{v}</Chip>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-8 sm:grid-cols-2">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-navy-900">{f.budget}</legend>
          <div className="flex flex-wrap gap-2">
            {f.budgets.map((b) => <Chip key={b} active={s.budget === b} onClick={() => setS({ ...s, budget: b })}>{b}</Chip>)}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-navy-900">{f.hotel}</legend>
          <div className="flex flex-wrap gap-2">
            {f.hotels.map((h) => <Chip key={h} active={s.hotel === h} onClick={() => setS({ ...s, hotel: h })}>{h}</Chip>)}
          </div>
        </fieldset>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-navy-900">{f.interests}</legend>
        <div className="flex flex-wrap gap-2">
          {Object.entries(f.interestList).map(([k, v]) => (
            <Chip key={k} active={s.interests.includes(k)} onClick={() => toggle("interests", k)}>{v}</Chip>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" className="size-4 accent-navy-800" checked={s.wantsPhoto} onChange={(e) => setS({ ...s, wantsPhoto: e.target.checked })} />{f.wantsPhoto}</label>
        <label className="flex items-center gap-2"><input type="checkbox" className="size-4 accent-navy-800" checked={s.wantsVideo} onChange={(e) => setS({ ...s, wantsVideo: e.target.checked })} />{f.wantsVideo}</label>
      </div>

      <label className={label}>{f.specialNeeds}<textarea rows={3} className={cn(input, "h-auto py-2")} value={s.specialNeeds} onChange={(e) => setS({ ...s, specialNeeds: e.target.value })} /></label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className={label}>{f.name}<input className={cn(input, bad(errors.name))} value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} autoComplete="name" /></label>
        <label className={label}>{f.email}<input type="email" className={cn(input, bad(errors.email))} value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} autoComplete="email" /></label>
        <label className={label}>{f.phone}<input type="tel" className={cn(input, bad(errors.phone))} value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} autoComplete="tel" /></label>
      </div>

      <Button type="submit" size="lg" className="w-full rounded-full sm:w-fit">{f.submit}</Button>
    </form>
  );
}
