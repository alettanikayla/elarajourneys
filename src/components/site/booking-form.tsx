"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Addon, Package } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { addDaysISO, formatDate, formatIDR } from "@/lib/format";
import { bookingCode, quote } from "@/lib/pricing";
import { demoStore, useToday } from "@/lib/demo-store";
import { cn } from "@/lib/utils";

type Props = { pkg: Package; lang: Locale; addons: Addon[]; dict: Pick<Dictionary, "booking" | "common"> };

function Counter({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
      <span className="text-sm font-medium text-navy-900">{label}</span>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="icon" className="size-8 rounded-full" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label={`- ${label}`}>
          <Minus className="size-4" />
        </Button>
        <span className="w-6 text-center font-semibold tabular-nums" aria-live="polite">{value}</span>
        <Button type="button" variant="outline" size="icon" className="size-8 rounded-full" disabled={value >= 20} onClick={() => onChange(value + 1)} aria-label={`+ ${label}`}>
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function BookingForm({ pkg, lang, addons, dict }: Props) {
  const b = dict.booking;
  const router = useRouter();
  const today = useToday();

  const [tripType, setTripType] = useState<"open" | "private">(pkg.tripType === "private" ? "private" : "open");
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [addonDays, setAddonDays] = useState<Record<string, number>>({});
  const [lead, setLead] = useState({ name: "", email: "", phone: "", city: "" });
  const [others, setOthers] = useState("");
  const [agree, setAgree] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const departures = pkg.departures.filter((d) => !today || d.date > today).slice(0, 8);
  const minPrivate = today ? addDaysISO(today, 7) : "";
  const selectedAddons = Object.entries(addonDays).filter(([, d]) => d > 0).map(([id, days]) => ({ id, days }));

  const q = quote(pkg, { tripType, date, adults, children, infants, addons: selectedAddons }, today || "1970-01-01");

  const errors = {
    date: !date || (tripType === "private" && date < minPrivate),
    name: lead.name.trim().length < 2,
    email: !/^\S+@\S+\.\S+$/.test(lead.email),
    phone: lead.phone.replace(/\D/g, "").length < 9,
    agree: !agree,
  };
  const valid = !Object.values(errors).some(Boolean);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) {
      setShowErrors(true);
      return;
    }
    const code = bookingCode();
    demoStore.saveBooking({
      code,
      packageSlug: pkg.slug,
      lang,
      tripType,
      date,
      adults,
      children,
      infants,
      addons: selectedAddons,
      lead,
      others,
      quote: q,
      status: "pending_payment",
      createdAt: new Date().toISOString(),
    });
    router.push(`/${lang}/booking?code=${code}`);
  }

  const err = (bad: boolean) => showErrors && bad && "ring-2 ring-destructive";
  const input = "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
  const stepTitle = "mb-4 flex items-center gap-3 text-2xl font-semibold text-navy-900";
  const num = (n: number) => <span className="grid size-8 place-items-center rounded-full bg-navy-800 font-sans text-sm text-white">{n}</span>;

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_22rem]" noValidate>
      <div className="flex min-w-0 flex-col gap-10">
        {/* 1. Trip type & date */}
        <section>
          <h2 className={stepTitle}>{num(1)}{b.step1}</h2>
          <div className="grid grid-cols-2 gap-2">
            {(["open", "private"] as const).map((type) => (
              <button
                type="button"
                key={type}
                onClick={() => {
                  setTripType(type);
                  setDate("");
                }}
                className={cn("rounded-xl px-4 py-3 text-sm font-semibold ring-1 transition", tripType === type ? "bg-navy-800 text-white ring-navy-800" : "bg-card text-navy-900 ring-border hover:bg-mist")}
              >
                {type === "open" ? dict.common.openTrip : dict.common.privateTrip}
              </button>
            ))}
          </div>
          <div className={cn("mt-4 rounded-xl", err(errors.date))}>
            {tripType === "open" ? (
              <>
                <p className="mb-2 text-sm font-medium text-navy-900">{b.chooseDeparture}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {departures.map((dep) => (
                    <button
                      type="button"
                      key={dep.date}
                      onClick={() => setDate(dep.date)}
                      className={cn("flex justify-between rounded-xl px-4 py-3 text-left text-sm ring-1 transition", date === dep.date ? "bg-mist ring-2 ring-navy-800" : "bg-card ring-border hover:bg-mist")}
                    >
                      <span className="font-medium">{formatDate(dep.date, lang, { weekday: "short" })}</span>
                      <span className="text-muted-foreground">{dep.seats} {dict.common.seatsLeft}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <label className="flex flex-col gap-2 text-sm font-medium text-navy-900">
                {b.privateDate}
                <input type="date" min={minPrivate} value={date} onChange={(e) => setDate(e.target.value)} className={input} />
              </label>
            )}
          </div>
        </section>

        {/* 2. Travellers */}
        <section>
          <h2 className={stepTitle}>{num(2)}{b.step2}</h2>
          <div className="grid gap-2">
            <Counter label={b.adults} value={adults} min={1} onChange={setAdults} />
            <Counter label={b.children} value={children} min={0} onChange={setChildren} />
            <Counter label={b.infants} value={infants} min={0} onChange={setInfants} />
          </div>
        </section>

        {/* 3. Add-ons (F6) */}
        <section>
          <h2 className={stepTitle}>{num(3)}{b.step3}</h2>
          <div className="grid gap-2">
            {addons.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                <div>
                  <p className="text-sm font-semibold text-navy-900">{a.name[lang]}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="mr-1 line-through">{formatIDR(a.normalPrice, lang)}</span>
                    <span className="font-semibold text-navy-800">{formatIDR(a.price, lang)}</span> {a.unit[lang]}
                  </p>
                </div>
                <select
                  value={addonDays[a.id] ?? 0}
                  onChange={(e) => setAddonDays((s) => ({ ...s, [a.id]: Number(e.target.value) }))}
                  className="h-9 rounded-lg border border-border bg-card px-2 text-sm"
                  aria-label={a.name[lang]}
                >
                  {Array.from({ length: pkg.durationDays + 1 }, (_, i) => (
                    <option key={i} value={i}>{i} {b.addonDays}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Lead traveller */}
        <section>
          <h2 className={stepTitle}>{num(4)}{b.step4}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium">{b.fullName}<input className={cn(input, err(errors.name))} value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} autoComplete="name" /></label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">{b.email}<input type="email" className={cn(input, err(errors.email))} value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} autoComplete="email" /></label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">{b.phone}<input type="tel" className={cn(input, err(errors.phone))} value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} placeholder="0812…" autoComplete="tel" /></label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">{b.city}<input className={input} value={lead.city} onChange={(e) => setLead({ ...lead, city: e.target.value })} autoComplete="address-level2" /></label>
            <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">{b.otherTravellers}<textarea rows={3} className={cn(input, "h-auto py-2")} value={others} onChange={(e) => setOthers(e.target.value)} /></label>
          </div>
        </section>
      </div>

      {/* 5. Summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-navy-900/5">
          <h2 className={stepTitle}>{num(5)}{b.step5}</h2>
          <p className="font-serif text-xl font-semibold text-navy-900">{pkg.title[lang]}</p>
          <p className="text-sm text-muted-foreground">
            {tripType === "open" ? dict.common.openTrip : dict.common.privateTrip}
            {date && ` · ${formatDate(date, lang, { weekday: "short" })}`}
          </p>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">{b.perPaxLabel}</dt><dd>{formatIDR(q.perPax, lang)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">{b.adults} × {adults}</dt><dd>{formatIDR(q.adultsTotal, lang)}</dd></div>
            {children > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">{b.children} × {children}</dt><dd>{formatIDR(q.childrenTotal, lang)}</dd></div>}
            {q.addonsTotal > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">{b.addons}</dt><dd>{formatIDR(q.addonsTotal, lang)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted-foreground">{b.handlingFee}</dt><dd>{formatIDR(q.handlingFee, lang)}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-navy-900"><dt>{b.total}</dt><dd>{formatIDR(q.total, lang)}</dd></div>
          </dl>
          <div className="mt-4 rounded-xl bg-mist p-4 text-sm">
            <div className="flex justify-between font-semibold text-navy-900">
              <span>{q.fullPaymentRequired ? b.payFull : `${b.payNow} ${pkg.depositPercent}%`}</span>
              <span>{formatIDR(q.deposit, lang)}</span>
            </div>
            {!q.fullPaymentRequired && date && (
              <p className="mt-1 text-xs text-navy-800">
                {b.balance} {formatIDR(q.balance, lang)} · {b.due} {formatDate(q.balanceDue, lang)}
              </p>
            )}
            {q.fullPaymentRequired && <p className="mt-1 text-xs text-navy-800">{b.fullPaymentNote}</p>}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{dict.common.notIncludedNote}</p>
          <label className={cn("mt-4 flex items-start gap-2 rounded-lg p-1 text-sm", err(errors.agree))}>
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 size-4 accent-navy-800" />
            <span>
              <a href={`/${lang}/terms`} target="_blank" className="underline underline-offset-2">{b.agree}</a>
            </span>
          </label>
          {showErrors && !valid && <p className="mt-2 text-sm text-destructive">{b.required}</p>}
          <Button type="submit" size="lg" className="mt-4 w-full rounded-full">{b.submit}</Button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">{dict.common.demoNote}</p>
        </div>
      </aside>
    </form>
  );
}
