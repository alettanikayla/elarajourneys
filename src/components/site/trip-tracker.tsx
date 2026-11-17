"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Bell, BellRing, CalendarPlus, CheckCircle2, Download, LogOut, MapPin, Timer } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand";
import { Button } from "@/components/ui/button";
import { kindIcons } from "@/components/site/itinerary-timeline";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { DEMO_TRIP, demoStore, useHydrated, useNow, type DemoBooking } from "@/lib/demo-store";
import { addDaysISO, formatDate, formatIDR, tzAbbr, type TripTimezone } from "@/lib/format";
import { buildEvents, buildIcs, googleCalendarDayLink, todayInTz, type TripDayInput, type TripEvent } from "@/lib/trip-schedule";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

export type TripInfo = { title: string; tz: TripTimezone; cover: string; days: TripDayInput[]; durationDays: number };

type Props = {
  lang: Locale;
  trips: Record<string, TripInfo>;
  dict: Pick<Dictionary, "myTrip" | "common" | "booking" | "confirmation"> & { kinds: Dictionary["detail"]["kinds"]; day: string };
};

type Session = { code: string; email: string };
const SESSION_KEY = "elara:trip-session";

function demoBooking(): DemoBooking {
  return {
    code: DEMO_TRIP.code,
    packageSlug: "bali-hidden-gems-4d3n",
    lang: "en",
    tripType: "private",
    date: "",
    adults: 2,
    children: 1,
    infants: 0,
    addons: [{ id: "photo-full", days: 1 }],
    lead: { name: "Demo Traveller", email: DEMO_TRIP.email, phone: "", city: "Jakarta" },
    others: "",
    quote: { perPax: 6_900_000, adultsTotal: 13_800_000, childrenTotal: 5_175_000, addonsTotal: 1_500_000, subtotal: 20_475_000, handlingFee: 409_500, total: 20_884_500, deposit: 6_265_350, balance: 14_619_150, balanceDue: "", fullPaymentRequired: false },
    status: "confirmed",
    createdAt: "",
  };
}

function findBooking(code: string, email: string): DemoBooking | undefined {
  const c = code.trim().toUpperCase();
  const e = email.trim().toLowerCase();
  if (c === DEMO_TRIP.code && e === DEMO_TRIP.email) return demoBooking();
  const b = demoStore.booking(c);
  return b && b.lead.email.toLowerCase() === e ? b : undefined;
}

function readSession(): Session | null {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function TripTracker({ lang, trips, dict }: Props) {
  const m = dict.myTrip;
  const sp = useSearchParams();
  const hydrated = useHydrated();
  const [form, setForm] = useState({ code: sp.get("code") ?? "", email: sp.get("email") ?? "" });
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [error, setError] = useState(false);
  const [, rerender] = useState(0);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-mist" />;

  // Restore the session on first client render (stands in for the signed httpOnly cookie in production).
  let active = session;
  if (active === undefined) {
    active = readSession() ?? (form.code && form.email && findBooking(form.code, form.email) ? { code: form.code.toUpperCase(), email: form.email } : null);
  }
  const booking = active ? findBooking(active.code, active.email) : undefined;

  function open(code: string, email: string) {
    if (!findBooking(code, email)) {
      setError(true);
      return;
    }
    const s = { code: code.trim().toUpperCase(), email: email.trim() };
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    } catch {}
    setError(false);
    setSession(s);
  }

  function close() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setSession(null);
  }

  if (!booking) {
    const input = "h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring";
    return (
      <div className="mx-auto max-w-md rounded-3xl bg-card p-8 ring-1 ring-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            open(form.code, form.email);
          }}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5 text-sm font-medium">{m.code}<input className={cn(input, "font-mono uppercase")} placeholder="ELR-XXXXXX" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">{m.email}<input type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          {error && <p className="text-sm text-destructive">{m.notFound}</p>}
          <Button type="submit" size="lg" className="rounded-full">{m.submit}</Button>
        </form>
        <div className="mt-6 border-t border-border pt-6 text-center">
          <Button variant="outline" className="rounded-full" onClick={() => open(DEMO_TRIP.code, DEMO_TRIP.email)}>{m.tryDemo}</Button>
          <p className="mt-2 font-mono text-xs text-muted-foreground">{DEMO_TRIP.code} · {DEMO_TRIP.email}</p>
        </div>
      </div>
    );
  }

  return (
    <TripView
      key={booking.code}
      booking={booking}
      trip={trips[booking.packageSlug]}
      lang={lang}
      dict={dict}
      onClose={close}
      onPaid={() => {
        demoStore.updateBooking(booking.code, { status: "paid" });
        rerender((n) => n + 1);
      }}
    />
  );
}

function TripView({ booking, trip, lang, dict, onClose, onPaid }: { booking: DemoBooking; trip: TripInfo; lang: Locale; dict: Props["dict"]; onClose: () => void; onPaid: () => void }) {
  const m = dict.myTrip;
  const isDemo = booking.code === DEMO_TRIP.code;
  const now = useNow();
  const [simulate, setSimulate] = useState(isDemo);
  const [notify, setNotify] = useState(false);
  const tz = trip.tz;

  // In presentation mode the trip "started yesterday" so Done / Now / Next states are visible.
  const startDate = simulate || !booking.date ? addDaysISO(todayInTz(now, tz), -1) : booking.date;
  const photoDays = booking.addons.reduce((n, a) => n + a.days, 0);
  const photoLabel = lang === "id" ? "Fotografer Elara bergabung" : "Elara photographer joins you";
  const events = useMemo(() => buildEvents(trip.days, startDate, tz, photoDays, photoLabel), [trip, startDate, tz, photoDays, photoLabel]);

  const nextIdx = events.findIndex((e) => e.start > now);
  const state = (e: TripEvent, i: number) => (e.end <= now ? "done" : e.start <= now ? "now" : i === nextIdx ? "next" : "upcoming");
  const tripStart = events[0]?.start ?? 0;
  const tripEnd = events[events.length - 1]?.end ?? 0;
  const next = nextIdx >= 0 ? events[nextIdx] : undefined;
  const minsToNext = next ? Math.max(0, Math.round((next.start - now) / 60_000)) : 0;
  const balancePaid = booking.status === "paid" || booking.quote.fullPaymentRequired;

  const fmtTime = (ms: number) => new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" }).format(new Date(ms));
  const fmtDay = (ms: number) => new Intl.DateTimeFormat(lang === "id" ? "id-ID" : "en-GB", { timeZone: tz, weekday: "long", day: "numeric", month: "long" }).format(new Date(ms));
  const duration = (mins: number) => (mins >= 60 ? `${Math.floor(mins / 60)} ${m.hours} ${mins % 60} ${m.min}` : `${mins} ${m.min}`);

  function downloadIcs() {
    const blob = new Blob([buildIcs(events, trip.title, booking.code)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${booking.code}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function enableNotifications() {
    if (!("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return;
    setNotify(true);
    if (next) new Notification(`${m.nextUp}: ${next.title}`, { body: `${fmtTime(next.start)} ${tzAbbr[tz]} · ${m.inMin} ${duration(minsToNext)}`, icon: "/brand/logo-mark.png" });
  }

  const days = [...new Set(events.map((e) => e.day))];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="relative isolate overflow-hidden rounded-3xl bg-navy-900 p-6 text-white sm:p-10">
        <Image src={trip.cover} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-35" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-sm tracking-wider text-sky-brand">{booking.code}</p>
            <h2 className="mt-1 text-4xl font-semibold sm:text-5xl">{trip.title}</h2>
            <p className="mt-2 text-white/80">{fmtDay(tripStart)} – {fmtDay(tripEnd)} · {tzAbbr[tz]}</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={onClose}>
            <LogOut className="size-4" /> {m.logout}
          </Button>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-white/60">Status</p>
            <p className="mt-1 text-lg font-semibold">{now < tripStart ? `${m.countdown} ${duration(Math.round((tripStart - now) / 60_000))}` : now > tripEnd ? m.finished : m.inProgress}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-white/60">{m.payment}</p>
            <p className="mt-1 text-lg font-semibold">{balancePaid ? m.paidFull : `${dict.booking.balance} ${formatIDR(booking.quote.balance, lang)}`}</p>
            {!balancePaid && <Button size="sm" variant="secondary" className="mt-2 rounded-full" onClick={onPaid}>{m.payBalance}</Button>}
          </div>
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-white/60">{m.nextUp}</p>
            <p className="mt-1 text-lg font-semibold">{next ? next.title : "–"}</p>
            {next && <p className="text-sm text-white/70">{fmtTime(next.start)} {tzAbbr[tz]} · {m.inMin} {duration(minsToNext)}</p>}
          </div>
        </div>
      </div>

      {next && minsToNext <= 120 && (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 px-5 py-4 text-amber-900 ring-1 ring-amber-200" role="status">
          <Timer className="size-5 shrink-0" />
          <p className="text-sm font-medium">{m.nextUp}: <strong>{next.title}</strong> {m.inMin} {duration(minsToNext)}</p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        {/* Timeline */}
        <div className="flex flex-col gap-8">
          {days.map((day) => {
            const dayEvents = events.filter((e) => e.day === day);
            return (
              <section key={day}>
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-2xl font-semibold text-navy-900">{dict.day} {day} · {dayEvents[0].dayTitle}</h3>
                  <span className="text-sm text-muted-foreground">{fmtDay(dayEvents[0].start)}</span>
                </div>
                <ol className="relative ml-4 border-l-2 border-mist pl-6">
                  {dayEvents.map((e) => {
                    const i = events.indexOf(e);
                    const st = state(e, i);
                    const Icon = kindIcons[e.kind];
                    return (
                      <li key={e.id} className={cn("relative mb-3 rounded-2xl p-4 transition", st === "now" && "bg-navy-800 text-white shadow-lg", st === "next" && "bg-card ring-2 ring-navy-800", st === "upcoming" && "bg-card ring-1 ring-border", st === "done" && "opacity-55")}>
                        <span className={cn("absolute -left-[39px] top-4 grid size-7 place-items-center rounded-full border-2", st === "now" ? "border-navy-800 bg-navy-800 text-white" : st === "done" ? "border-emerald-500 bg-emerald-500 text-white" : "border-sky-brand bg-sand text-navy-800")}>
                          {st === "done" ? <CheckCircle2 className="size-4" /> : <Icon className="size-3.5" />}
                        </span>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                          <span className="tabular-nums">{fmtTime(e.start)}–{fmtTime(e.end)} {tzAbbr[tz]}</span>
                          <span className={cn("rounded-full px-2 py-0.5", st === "now" ? "bg-white/20" : st === "next" ? "bg-navy-800 text-white" : st === "done" ? "bg-emerald-100 text-emerald-800" : "bg-mist text-navy-800")}>
                            {m.states[st]}
                          </span>
                          <span className={cn("rounded-full px-2 py-0.5", st === "now" ? "bg-white/10" : "bg-mist text-navy-800")}>{dict.kinds[e.kind]}</span>
                        </div>
                        <p className="mt-1 font-medium">{e.title}</p>
                        {e.detail && <p className={cn("text-sm", st === "now" ? "text-white/80" : "text-muted-foreground")}>{e.detail}</p>}
                        {e.location && <p className={cn("mt-1 inline-flex items-center gap-1 text-xs", st === "now" ? "text-white/70" : "text-muted-foreground")}><MapPin className="size-3" />{e.location}</p>}
                      </li>
                    );
                  })}
                </ol>
                <a href={googleCalendarDayLink(dayEvents, trip.title)} target="_blank" rel="noopener noreferrer" className="ml-10 inline-flex items-center gap-1.5 text-sm font-medium text-slate-brand hover:text-navy-800">
                  <CalendarPlus className="size-4" /> {m.googleCal}
                </a>
              </section>
            );
          })}
        </div>

        {/* Reminders */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
            <h3 className="text-2xl font-semibold text-navy-900">{m.reminders}</h3>
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="outline" className="justify-start rounded-xl" onClick={downloadIcs}><Download className="size-4" />{m.addCalendar}</Button>
              <Button variant="outline" className="justify-start rounded-xl" onClick={enableNotifications} disabled={notify}>
                {notify ? <BellRing className="size-4" /> : <Bell className="size-4" />}
                {notify ? m.notifyOn : m.notify}
              </Button>
              <Button asChild variant="outline" className="justify-start rounded-xl">
                <a href={whatsappLink(`${m.remindWa}: ${booking.code} (${trip.title})`)} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="size-4" />{m.remindWa}</a>
              </Button>
            </div>
            {booking.date && (
              <label className="mt-6 flex items-start gap-2 rounded-xl bg-mist p-3 text-xs text-navy-800">
                <input type="checkbox" className="mt-0.5 size-4 accent-navy-800" checked={simulate} onChange={(e) => setSimulate(e.target.checked)} />
                {m.simulate}
              </label>
            )}
            {booking.date && !simulate && <p className="mt-3 text-xs text-muted-foreground">{m.departure}: {formatDate(booking.date, lang, { weekday: "long" })}</p>}
            <p className="mt-4 text-[11px] text-muted-foreground">{dict.common.demoNote}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
