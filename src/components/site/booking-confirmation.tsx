"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, CreditCard, Loader2, QrCode, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { Locale } from "@/i18n/config";
import { demoStore, useHydrated, type DemoBooking } from "@/lib/demo-store";
import { formatDate, formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

type Props = { lang: Locale; titles: Record<string, string>; dict: Pick<Dictionary, "confirmation" | "booking" | "common"> };

export function BookingConfirmation({ lang, titles, dict }: Props) {
  const c = dict.confirmation;
  const code = useSearchParams().get("code") ?? "";
  const hydrated = useHydrated();
  const [, force] = useState(0);
  const [method, setMethod] = useState<"va" | "qris" | "ewallet">("va");
  const [paying, setPaying] = useState(false);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-mist" />;
  const booking: DemoBooking | undefined = demoStore.booking(code);
  if (!booking) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-10 text-center">
        <p className="text-muted-foreground">{c.notFound}</p>
        <Button asChild className="mt-6 rounded-full"><Link href={`/${lang}/packages`}>{dict.common.viewAll}</Link></Button>
      </div>
    );
  }

  const paid = booking.status !== "pending_payment";
  const q = booking.quote;

  function pay() {
    setPaying(true);
    setTimeout(() => {
      demoStore.updateBooking(booking!.code, { status: q.fullPaymentRequired ? "paid" : "confirmed", paymentMethod: method });
      setPaying(false);
      force((n) => n + 1);
    }, 1400);
  }

  const methods = [
    { id: "va" as const, icon: CreditCard, label: c.methods.va },
    { id: "qris" as const, icon: QrCode, label: c.methods.qris },
    { id: "ewallet" as const, icon: Wallet, label: c.methods.ewallet },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="rounded-3xl bg-card p-8 ring-1 ring-border">
        <div className="flex items-center gap-3">
          {paid ? <CheckCircle2 className="size-8 text-emerald-600" /> : <Clock className="size-8 text-amber-600" />}
          <h1 className="text-4xl font-semibold text-navy-900">{paid ? c.paidTitle : c.title}</h1>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{c.subtitle}</p>
        <p className="font-mono text-4xl font-bold tracking-wider text-navy-800">{booking.code}</p>
        <p className="mt-4 text-sm">
          <span className="text-muted-foreground">{c.status}: </span>
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", paid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800")}>
            {paid ? c.paid : c.pending}
          </span>
        </p>

        <dl className="mt-8 grid gap-4 border-t border-border pt-6 text-sm sm:grid-cols-2">
          <div><dt className="text-muted-foreground">Trip</dt><dd className="font-semibold text-navy-900">{titles[booking.packageSlug]}</dd></div>
          <div><dt className="text-muted-foreground">{dict.booking.step1}</dt><dd className="font-semibold text-navy-900">{booking.tripType === "open" ? dict.common.openTrip : dict.common.privateTrip} · {formatDate(booking.date, lang, { weekday: "short" })}</dd></div>
          <div><dt className="text-muted-foreground">{dict.booking.step2}</dt><dd className="font-semibold text-navy-900">{booking.adults} {dict.booking.adults}{booking.children ? `, ${booking.children} ${dict.booking.children}` : ""}{booking.infants ? `, ${booking.infants} ${dict.booking.infants}` : ""}</dd></div>
          <div><dt className="text-muted-foreground">{dict.booking.step4}</dt><dd className="font-semibold text-navy-900">{booking.lead.name} · {booking.lead.email}</dd></div>
        </dl>

        {paid && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link href={`/${lang}/my-trip?code=${booking.code}&email=${encodeURIComponent(booking.lead.email)}`}>{c.track}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <a href={whatsappLink(`${c.subtitle}: ${booking.code} (${titles[booking.packageSlug]})`)} target="_blank" rel="noopener noreferrer">{c.whatsapp}</a>
            </Button>
          </div>
        )}
      </div>

      <aside className="rounded-3xl bg-card p-6 ring-1 ring-border lg:self-start">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">{dict.booking.subtotal}</dt><dd>{formatIDR(q.subtotal, lang)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">{dict.booking.handlingFee}</dt><dd>{formatIDR(q.handlingFee, lang)}</dd></div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold text-navy-900"><dt>{dict.booking.total}</dt><dd>{formatIDR(q.total, lang)}</dd></div>
          <div className="flex justify-between rounded-lg bg-mist px-3 py-2 font-semibold text-navy-900"><dt>{q.fullPaymentRequired ? dict.booking.payFull : dict.booking.payNow}</dt><dd>{formatIDR(q.deposit, lang)}</dd></div>
          {!q.fullPaymentRequired && (
            <div className="flex justify-between text-xs text-muted-foreground"><dt>{dict.booking.balance} · {dict.booking.due} {formatDate(q.balanceDue, lang)}</dt><dd>{formatIDR(q.balance, lang)}</dd></div>
          )}
        </dl>

        {!paid && (
          <>
            <p className="mt-6 text-sm font-semibold text-navy-900">{c.payTitle}</p>
            <div className="mt-3 grid gap-2">
              {methods.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMethod(id)}
                  className={cn("flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm ring-1 transition", method === id ? "bg-mist ring-2 ring-navy-800" : "ring-border hover:bg-mist")}
                >
                  <Icon className="size-5 text-navy-800" /> {label}
                </button>
              ))}
            </div>
            {method === "qris" && (
              <div className="mt-4 grid place-items-center rounded-xl bg-white p-4 ring-1 ring-border">
                {/* Decorative QR pattern for the demo, not a real payment code */}
                <svg viewBox="0 0 21 21" className="size-40" aria-hidden>
                  {Array.from({ length: 441 }, (_, i) => {
                    const x = i % 21, y = Math.floor(i / 21);
                    const finder = (x < 7 || x > 13) && (y < 7 || y > 13) && !(x > 13 && y > 13);
                    const fx = x > 13 ? x - 14 : x, fy = y > 13 ? y - 14 : y;
                    const on = finder
                      ? fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4)
                      : (x < 8 || x > 12) && (y < 8 || y > 12) ? false : (x * 7 + y * 13 + x * y) % 3 === 0;
                    return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="#1B2E44" /> : null;
                  })}
                </svg>
              </div>
            )}
            {method === "va" && <p className="mt-4 rounded-xl bg-mist px-4 py-3 font-mono text-sm text-navy-900">VA BCA: 8808 1234 {booking.code.slice(4)}</p>}
            <Button size="lg" className="mt-4 w-full rounded-full" onClick={pay} disabled={paying}>
              {paying ? <><Loader2 className="size-4 animate-spin" /> {c.paying}</> : `${c.payButton} ${formatIDR(q.deposit, lang)}`}
            </Button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">{c.demoPay}</p>
          </>
        )}
      </aside>
    </div>
  );
}
