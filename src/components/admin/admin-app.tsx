"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, CalendarClock, ClipboardList, Inbox, LayoutDashboard, LogOut, Plus, Trash2, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { packages } from "@/content/packages";
import type { ItemKind } from "@/content/types";
import { getDestination } from "@/content/destinations";
import { demoStore, useHydrated, type DemoBooking, type DemoRequest } from "@/lib/demo-store";
import { addDaysISO, formatDate, formatIDR, tzAbbr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { mockBookings, mockRequests } from "./mock-data";

const AUTH_KEY = "elara:admin";
const DEMO_PASSWORD = "elara2026";
const pkgTitle = (slug: string) => packages.find((p) => p.slug === slug)?.title.en ?? "Custom trip";
const money = (n: number) => formatIDR(n, "en");
const date = (d: string) => (d ? formatDate(d, "en") : "–");

const statusStyle: Record<string, string> = {
  pending_payment: "bg-amber-100 text-amber-800",
  awaiting_transfer: "bg-amber-100 text-amber-800",
  confirmed: "bg-sky-100 text-sky-800",
  paid: "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-200 text-slate-700",
  cancelled: "bg-red-100 text-red-700",
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-sky-100 text-sky-800",
  quoted: "bg-violet-100 text-violet-800",
  converted: "bg-emerald-100 text-emerald-800",
  closed: "bg-slate-200 text-slate-700",
};

function Badge({ value }: { value: string }) {
  return <span className={cn("whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyle[value] ?? "bg-slate-100")}>{value.replace("_", " ")}</span>;
}

type EditableItem = { id: number; date: string; time: string; title: string; titleId: string; location: string; kind: ItemKind };

export function AdminApp() {
  const hydrated = useHydrated();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [tab, setTab] = useState<"dashboard" | "bookings" | "requests" | "departures">("dashboard");
  const [bookings, setBookings] = useState<DemoBooking[] | null>(null);
  const [requests, setRequests] = useState<DemoRequest[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [itineraries, setItineraries] = useState<Record<string, EditableItem[]>>({});

  if (!hydrated) return null;

  let isAuthed = authed;
  if (isAuthed === null) {
    try {
      isAuthed = sessionStorage.getItem(AUTH_KEY) === "1";
    } catch {
      isAuthed = false;
    }
  }

  if (!isAuthed) {
    return (
      <div className="grid min-h-dvh place-items-center px-4">
        <form
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl"
          onSubmit={(e) => {
            e.preventDefault();
            if (password === DEMO_PASSWORD) {
              try {
                sessionStorage.setItem(AUTH_KEY, "1");
              } catch {}
              setAuthed(true);
            } else setLoginError(true);
          }}
        >
          <Image src="/brand/logo-full.png" alt="Elara Journeys" width={160} height={129} className="mx-auto h-auto w-32" />
          <h1 className="mt-6 text-center text-3xl font-semibold text-navy-900">Admin login</h1>
          <label className="mt-6 flex flex-col gap-1.5 text-sm font-medium">
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl border border-border px-3 outline-none focus:ring-2 focus:ring-ring" autoFocus />
          </label>
          {loginError && <p className="mt-2 text-sm text-destructive">Wrong password.</p>}
          <Button type="submit" className="mt-4 w-full rounded-full">Sign in</Button>
          <p className="mt-4 rounded-lg bg-mist p-3 text-center text-xs text-navy-800">Demo password: <code className="font-semibold">{DEMO_PASSWORD}</code></p>
          <Link href="/en" className="mt-4 block text-center text-xs text-muted-foreground hover:underline">← Back to website</Link>
        </form>
      </div>
    );
  }

  const allBookings = bookings ?? [...demoStore.bookings(), ...mockBookings];
  const allRequests = requests ?? [...demoStore.requests(), ...mockRequests];

  const updateBooking = (code: string, patch: Partial<DemoBooking>) => {
    demoStore.updateBooking(code, patch);
    setBookings(allBookings.map((b) => (b.code === code ? { ...b, ...patch } : b)));
  };
  const updateRequest = (ref: string, patch: Partial<DemoRequest>) => {
    demoStore.updateRequest(ref, patch);
    setRequests(allRequests.map((r) => (r.ref === ref ? { ...r, ...patch } : r)));
  };

  const today = new Date().toISOString().slice(0, 10);
  const weekAhead = addDaysISO(today, 7);
  const stats = [
    { icon: Inbox, label: "New custom requests", value: allRequests.filter((r) => r.status === "new").length, tab: "requests" as const },
    { icon: Wallet, label: "Pending payments", value: allBookings.filter((b) => b.status === "pending_payment").length, tab: "bookings" as const },
    { icon: CalendarClock, label: "Departures in 7 days", value: allBookings.filter((b) => b.date >= today && b.date <= weekAhead).length, tab: "bookings" as const },
    { icon: Users, label: "Total travellers", value: allBookings.reduce((n, b) => n + b.adults + b.children + b.infants, 0), tab: "bookings" as const },
  ];
  const revenue = allBookings.reduce((n, b) => n + (b.status === "paid" ? b.quote.total : b.status === "confirmed" ? b.quote.deposit : 0), 0);

  const nav = [
    { id: "dashboard" as const, icon: LayoutDashboard, label: "Dashboard" },
    { id: "bookings" as const, icon: ClipboardList, label: "Bookings" },
    { id: "requests" as const, icon: Inbox, label: "Custom requests" },
    { id: "departures" as const, icon: CalendarClock, label: "Departures" },
  ];

  const current = allBookings.find((b) => b.code === selected);

  function itineraryFor(b: DemoBooking): EditableItem[] {
    if (itineraries[b.code]) return itineraries[b.code];
    const pkg = packages.find((p) => p.slug === b.packageSlug);
    if (!pkg) return [];
    let id = 0;
    return pkg.itinerary.flatMap((d) =>
      d.items.map((it) => ({ id: id++, date: addDaysISO(b.date, d.day - 1), time: it.time, title: it.title.en, titleId: it.title.id, location: it.location ?? "", kind: it.kind })),
    );
  }

  const table = "w-full min-w-[44rem] text-left text-sm";
  const th = "border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground";
  const td = "border-b border-border px-4 py-3";

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col gap-1 bg-navy-900 p-4 text-white lg:w-60">
        <div className="mb-4 flex items-center gap-2 px-2">
          <Image src="/brand/logo-mark.png" alt="" width={34} height={28} className="h-7 w-auto brightness-0 invert" />
          <span className="font-serif text-lg font-semibold">Elara Admin</span>
          <span className="ml-auto rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase">Demo</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {nav.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => { setTab(id); setSelected(null); }} className={cn("flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition", tab === id ? "bg-white/15 font-semibold" : "text-white/70 hover:bg-white/10")}>
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => {
            try { sessionStorage.removeItem(AUTH_KEY); } catch {}
            setAuthed(false);
          }}
          className="mt-auto hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 lg:flex"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        {tab === "dashboard" && (
          <>
            <h1 className="text-4xl font-semibold text-navy-900">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Demo data for the school presentation. Bookings made on the website in this browser appear here too.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ icon: Icon, label, value, tab: target }) => (
                <button key={label} onClick={() => setTab(target)} className="rounded-2xl bg-white p-5 text-left shadow-sm transition hover:shadow-md">
                  <Icon className="size-5 text-slate-brand" />
                  <p className="mt-3 text-3xl font-semibold tabular-nums text-navy-900">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl bg-navy-800 p-6 text-white">
              <p className="text-sm text-white/70">Payments received (demo)</p>
              <p className="text-3xl font-semibold">{money(revenue)}</p>
            </div>
            <h2 className="mt-10 text-2xl font-semibold text-navy-900">Latest bookings</h2>
            <div className="mt-3 overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className={table}>
                <thead><tr><th className={th}>Code</th><th className={th}>Trip</th><th className={th}>Departure</th><th className={th}>Lead</th><th className={th}>Total</th><th className={th}>Status</th></tr></thead>
                <tbody>
                  {allBookings.slice(0, 5).map((b) => (
                    <tr key={b.code} className="cursor-pointer hover:bg-mist/60" onClick={() => { setTab("bookings"); setSelected(b.code); }}>
                      <td className={cn(td, "font-mono font-semibold")}>{b.code}</td><td className={td}>{pkgTitle(b.packageSlug)}</td><td className={td}>{date(b.date)}</td><td className={td}>{b.lead.name}</td><td className={td}>{money(b.quote.total)}</td><td className={td}><Badge value={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "bookings" && !current && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h1 className="text-4xl font-semibold text-navy-900">Bookings</h1>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-xl border border-border bg-white px-3 text-sm">
                <option value="">All statuses</option>
                {["pending_payment", "confirmed", "paid", "completed", "cancelled"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>
            <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className={table}>
                <thead><tr><th className={th}>Code</th><th className={th}>Trip</th><th className={th}>Type</th><th className={th}>Departure</th><th className={th}>Pax</th><th className={th}>Total</th><th className={th}>Status</th></tr></thead>
                <tbody>
                  {allBookings.filter((b) => !statusFilter || b.status === statusFilter).map((b) => (
                    <tr key={b.code} className="cursor-pointer hover:bg-mist/60" onClick={() => setSelected(b.code)}>
                      <td className={cn(td, "font-mono font-semibold")}>{b.code}</td><td className={td}>{pkgTitle(b.packageSlug)}</td><td className={td}>{b.tripType}</td><td className={td}>{date(b.date)}</td><td className={td}>{b.adults + b.children + b.infants}</td><td className={td}>{money(b.quote.total)}</td><td className={td}><Badge value={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "bookings" && current && (() => {
          const items = itineraryFor(current);
          const pkg = packages.find((p) => p.slug === current.packageSlug);
          const setItems = (next: EditableItem[]) => setItineraries((s) => ({ ...s, [current.code]: next }));
          const cell = "h-9 w-full rounded-lg border border-border bg-white px-2 text-sm";
          return (
            <>
              <button onClick={() => setSelected(null)} className="text-sm text-muted-foreground hover:underline">← All bookings</button>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="font-mono text-3xl font-bold text-navy-900">{current.code}</h1>
                <Badge value={current.status} />
              </div>
              <p className="text-muted-foreground">{pkgTitle(current.packageSlug)} · {current.tripType} · {date(current.date)}</p>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-semibold text-navy-900">Lead traveller</h2>
                  <p className="mt-2 text-sm">{current.lead.name}</p>
                  <p className="text-sm text-muted-foreground">{current.lead.email}</p>
                  <p className="text-sm text-muted-foreground">{current.lead.phone} · {current.lead.city}</p>
                  <p className="mt-3 text-sm">{current.adults} adults · {current.children} children · {current.infants} infants</p>
                  {current.addons.length > 0 && <p className="mt-1 text-sm text-muted-foreground">Add-ons: {current.addons.map((a) => `${a.id} ×${a.days}`).join(", ")}</p>}
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-semibold text-navy-900">Payments</h2>
                  <dl className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between"><dt>Total</dt><dd className="font-semibold">{money(current.quote.total)}</dd></div>
                    <div className="flex justify-between"><dt>DP</dt><dd>{money(current.quote.deposit)} {current.status !== "pending_payment" && "✓"}</dd></div>
                    <div className="flex justify-between"><dt>Balance</dt><dd>{money(current.quote.balance)} {current.status === "paid" && "✓"}</dd></div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {current.status === "pending_payment" && <Button size="sm" onClick={() => updateBooking(current.code, { status: "confirmed" })}>Mark DP received</Button>}
                    {current.status === "confirmed" && <Button size="sm" onClick={() => updateBooking(current.code, { status: "paid" })}>Mark balance received</Button>}
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-semibold text-navy-900">Status</h2>
                  <select value={current.status} onChange={(e) => updateBooking(current.code, { status: e.target.value as DemoBooking["status"] })} className="mt-3 h-10 w-full rounded-xl border border-border px-3 text-sm">
                    {["pending_payment", "confirmed", "paid"].map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                  <p className="mt-3 text-xs text-muted-foreground">Changing status here would email the client in production.</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-semibold text-navy-900">Itinerary editor</h2>
                  <span className="text-xs text-muted-foreground">Times in {pkg ? tzAbbr[pkg.timezone] : "local time"} · changes show in the client&apos;s tracker</span>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[56rem] text-sm">
                    <thead><tr><th className={th}>Date</th><th className={th}>Time</th><th className={th}>Title (EN)</th><th className={th}>Title (ID)</th><th className={th}>Location</th><th className={th}>Kind</th><th className={th}></th></tr></thead>
                    <tbody>
                      {items.map((it, i) => {
                        const patch = (p: Partial<EditableItem>) => setItems(items.map((x) => (x.id === it.id ? { ...x, ...p } : x)));
                        const move = (dir: -1 | 1) => {
                          const next = [...items];
                          const j = i + dir;
                          if (j < 0 || j >= next.length) return;
                          [next[i], next[j]] = [next[j], next[i]];
                          setItems(next);
                        };
                        return (
                          <tr key={it.id}>
                            <td className="p-1"><input type="date" className={cell} value={it.date} onChange={(e) => patch({ date: e.target.value })} /></td>
                            <td className="p-1"><input type="time" className={cell} value={it.time} onChange={(e) => patch({ time: e.target.value })} /></td>
                            <td className="p-1"><input className={cell} value={it.title} onChange={(e) => patch({ title: e.target.value })} /></td>
                            <td className="p-1"><input className={cell} value={it.titleId} onChange={(e) => patch({ titleId: e.target.value })} /></td>
                            <td className="p-1"><input className={cell} value={it.location} onChange={(e) => patch({ location: e.target.value })} /></td>
                            <td className="p-1">
                              <select className={cell} value={it.kind} onChange={(e) => patch({ kind: e.target.value as ItemKind })}>
                                {["transport", "activity", "checkin", "checkout", "free", "photo"].map((k) => <option key={k}>{k}</option>)}
                              </select>
                            </td>
                            <td className="whitespace-nowrap p-1">
                              <Button size="icon" variant="ghost" className="size-8" onClick={() => move(-1)} aria-label="Move up"><ArrowUp className="size-4" /></Button>
                              <Button size="icon" variant="ghost" className="size-8" onClick={() => move(1)} aria-label="Move down"><ArrowDown className="size-4" /></Button>
                              <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => setItems(items.filter((x) => x.id !== it.id))} aria-label="Delete"><Trash2 className="size-4" /></Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setItems([...items, { id: Date.now(), date: items[items.length - 1]?.date ?? current.date, time: "09:00", title: "New activity", titleId: "Aktivitas baru", location: "", kind: "activity" }])}
                >
                  <Plus className="size-4" /> Add item
                </Button>
              </div>
            </>
          );
        })()}

        {tab === "requests" && (
          <>
            <h1 className="text-4xl font-semibold text-navy-900">Custom trip requests</h1>
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {allRequests.map((r) => (
                <div key={r.ref} className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono font-semibold text-navy-900">{r.ref}</p>
                    <Badge value={r.status} />
                  </div>
                  <p className="mt-2 text-lg font-semibold text-navy-900">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.email} · {r.phone}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <dt className="text-muted-foreground">Destinations</dt><dd>{[...r.destinations.map((d) => getDestination(d)?.name ?? d), r.other].filter(Boolean).join(", ")}</dd>
                    <dt className="text-muted-foreground">Dates</dt><dd>{date(r.dateFrom)} – {date(r.dateTo)}{r.flexible && " (flexible)"}</dd>
                    <dt className="text-muted-foreground">Group</dt><dd>{r.adults} adults, {r.children} children · {r.groupType}</dd>
                    <dt className="text-muted-foreground">Budget / hotel</dt><dd>{r.budget} · {r.hotel}</dd>
                    <dt className="text-muted-foreground">Photo / video</dt><dd>{r.wantsPhoto ? "Photo" : "–"} / {r.wantsVideo ? "Video" : "–"}</dd>
                  </dl>
                  {r.specialNeeds && <p className="mt-2 rounded-lg bg-mist p-2 text-sm">{r.specialNeeds}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <select value={r.status} onChange={(e) => updateRequest(r.ref, { status: e.target.value as DemoRequest["status"] })} className="h-9 rounded-lg border border-border px-2 text-sm">
                      {["new", "contacted", "quoted", "converted", "closed"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                    {r.status !== "converted" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          updateRequest(r.ref, { status: "converted" });
                          const code = `ELR-C${r.ref.slice(4)}`;
                          setBookings([
                            { code, packageSlug: "custom", lang: r.lang, tripType: "private", date: r.dateFrom, adults: r.adults, children: r.children, infants: 0, addons: [], lead: { name: r.name, email: r.email, phone: r.phone, city: "" }, others: "", quote: { perPax: 0, adultsTotal: 0, childrenTotal: 0, addonsTotal: 0, subtotal: 0, handlingFee: 0, total: 0, deposit: 0, balance: 0, balanceDue: "", fullPaymentRequired: false }, status: "pending_payment", createdAt: new Date().toISOString() },
                            ...allBookings,
                          ]);
                        }}
                      >
                        Convert to booking
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "departures" && (
          <>
            <h1 className="text-4xl font-semibold text-navy-900">Departures</h1>
            <p className="mt-1 text-sm text-muted-foreground">Seat quotas come from package content; sold seats from bookings.</p>
            <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className={table}>
                <thead><tr><th className={th}>Date</th><th className={th}>Package</th><th className={th}>Quota</th><th className={th}>Sold</th><th className={th}>Fill</th></tr></thead>
                <tbody>
                  {packages
                    .flatMap((p) => p.departures.slice(0, 3).map((d) => ({ ...d, slug: p.slug, title: p.title.en })))
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((d) => {
                      const sold = allBookings.filter((b) => b.packageSlug === d.slug && b.date === d.date && b.tripType === "open").reduce((n, b) => n + b.adults + b.children, 0);
                      const quota = d.seats + sold;
                      return (
                        <tr key={d.slug + d.date}>
                          <td className={td}>{date(d.date)}</td><td className={td}>{d.title}</td><td className={td}>{quota}</td><td className={td}>{sold}</td>
                          <td className={td}><div className="h-2 w-32 overflow-hidden rounded-full bg-mist"><div className="h-full bg-navy-800" style={{ width: `${Math.round((sold / quota) * 100)}%` }} /></div></td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
