import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Camera, Car, Check, ChevronRight, Clock, MapPin, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ItineraryTimeline } from "@/components/site/itinerary-timeline";
import { PackageCard } from "@/components/site/package-card";
import { addons } from "@/content/addons";
import { getDestination } from "@/content/destinations";
import { faqs } from "@/content/faqs";
import { getPackage, packages, startingPrice } from "@/content/packages";
import { hasLocale, locales, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatDate, formatIDR, tzAbbr } from "@/lib/format";
import { pageMeta } from "@/lib/metadata";
import { packageMessage, whatsappLink } from "@/lib/whatsapp";

export function generateStaticParams() {
  return locales.flatMap((lang) => packages.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/packages/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const pkg = getPackage(slug);
  if (!hasLocale(lang) || !pkg) return {};
  return pageMeta(lang, `/packages/${slug}`, t(pkg.title, lang), t(pkg.summary, lang), pkg.cover);
}

export default async function PackageDetailPage({ params }: PageProps<"/[lang]/packages/[slug]">) {
  const { lang, slug } = await params;
  const pkg = getPackage(slug);
  if (!hasLocale(lang) || !pkg) notFound();
  const dict = await getDictionary(lang);
  const d = dict.detail;
  const dest = getDestination(pkg.destination);
  const tz = tzAbbr[pkg.timezone];
  const price = startingPrice(pkg);
  const title = t(pkg.title, lang);
  const related = packages.filter((p) => p.slug !== pkg.slug).slice(0, 3);
  const bookHref = `/${lang}/packages/${pkg.slug}/book`;
  const nextDepartures = pkg.departures.slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: title,
    description: t(pkg.summary, lang),
    touristType: pkg.idealFor,
    offers: { "@type": "Offer", price, priceCurrency: "IDR" },
    itinerary: pkg.itinerary.map((day) => ({ "@type": "ItemList", name: `${d.day} ${day.day}: ${t(day.title, lang)}` })),
  };

  const bookingCard = (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-lg shadow-navy-900/5">
      <p className="text-sm text-muted-foreground">{d.priceFrom}</p>
      <p className="text-3xl font-semibold text-navy-900">
        {formatIDR(price, lang)}
        <span className="text-sm font-normal text-muted-foreground"> {dict.common.perPax}</span>
      </p>
      <p className="mt-3 rounded-xl bg-mist px-3 py-2 text-xs text-navy-800">
        {d.deposit} {pkg.depositPercent}% {d.depositText} H-{pkg.fullPaymentDaysBefore} ({pkg.fullPaymentDaysBefore} {d.depositText2})
      </p>
      <Button asChild size="lg" className="mt-5 w-full rounded-full">
        <Link href={bookHref}>{dict.common.bookNow}</Link>
      </Button>
      <Button asChild size="lg" variant="outline" className="mt-2 w-full rounded-full">
        <a href={whatsappLink(packageMessage(lang, title))} target="_blank" rel="noopener noreferrer">{dict.common.askWhatsApp}</a>
      </Button>
      <p className="mt-4 text-center text-xs text-muted-foreground">{dict.common.notIncludedNote}</p>
    </div>
  );

  return (
    <div className="pb-24 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href={`/${lang}`} className="hover:text-navy-900">Home</Link>
          <ChevronRight className="size-3.5" />
          <Link href={`/${lang}/packages`} className="hover:text-navy-900">{dict.nav.packages}</Link>
          <ChevronRight className="size-3.5" />
          <span className="text-navy-900">{title}</span>
        </nav>

        {/* Gallery: 1 large + 4 small; scroll-snap on mobile */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid sm:h-[28rem] sm:grid-cols-4 sm:grid-rows-2 sm:overflow-hidden sm:rounded-3xl sm:px-0">
          {pkg.gallery.slice(0, 5).map((src, i) => (
            <div key={src + i} className={`relative aspect-[4/3] w-[85vw] shrink-0 snap-center overflow-hidden rounded-2xl sm:aspect-auto sm:w-auto sm:rounded-none ${i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}`}>
              <Image src={src} alt={`${title} ${i + 1}`} fill priority={i === 0} sizes={i === 0 ? "(min-width: 640px) 50vw, 85vw" : "(min-width: 640px) 25vw, 85vw"} className="object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem]">
          <div className="min-w-0">
            {/* Title block */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-navy-800 px-3 py-1 text-white">{pkg.durationDays}D{pkg.durationNights}N</span>
              {(pkg.tripType === "both" || pkg.tripType === "open") && <span className="rounded-full bg-mist px-3 py-1 text-navy-800">{dict.common.openTrip}</span>}
              {(pkg.tripType === "both" || pkg.tripType === "private") && <span className="rounded-full bg-mist px-3 py-1 text-navy-800">{dict.common.privateTrip}</span>}
              {pkg.idealFor.map((s) => (
                <span key={s} className="rounded-full border border-border px-3 py-1 text-muted-foreground">{dict.common.idealFor[s]}</span>
              ))}
            </div>
            <h1 className="mt-4 text-balance text-5xl font-semibold leading-[1.02] text-navy-900 sm:text-6xl">{title}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{dest?.name}</span>
              <span className="inline-flex items-center gap-1"><Clock className="size-4" />{pkg.durationDays} {dict.common.days} · {pkg.durationNights} {dict.common.nights} · {tz}</span>
            </p>
            <p className="mt-5 max-w-2xl text-pretty text-lg text-navy-800/80">{t(pkg.summary, lang)}</p>

            {/* Highlights */}
            <h2 className="mt-12 text-3xl font-semibold text-navy-900">{d.highlights}</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {pkg.highlights.map((h) => (
                <li key={h.en} className="flex gap-3 rounded-2xl bg-card p-4 text-sm text-navy-900 ring-1 ring-border">
                  <Check className="size-5 shrink-0 text-slate-brand" /> {t(h, lang)}
                </li>
              ))}
            </ul>

            {/* Itinerary */}
            <h2 className="mt-12 text-3xl font-semibold text-navy-900">{d.itinerary}</h2>
            <ItineraryTimeline
              tz={tz}
              labels={{ day: d.day, expandAll: d.expandAll, collapseAll: d.collapseAll, overnight: d.overnight, kinds: d.kinds }}
              days={pkg.itinerary.map((day) => ({
                day: day.day,
                title: t(day.title, lang),
                overnight: day.overnight ? t(day.overnight, lang) : undefined,
                items: day.items.map((it) => ({
                  time: it.time,
                  endTime: it.endTime,
                  title: t(it.title, lang),
                  detail: it.detail ? t(it.detail, lang) : undefined,
                  location: it.location,
                  kind: it.kind,
                })),
              }))}
            />

            {/* Included / not included */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
                <h2 className="text-2xl font-semibold text-navy-900">{d.included}</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {pkg.included.map((x) => (
                    <li key={x.en} className="flex gap-2"><Check className="size-4 shrink-0 text-emerald-600" />{t(x, lang)}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
                <h2 className="text-2xl font-semibold text-navy-900">{d.notIncluded}</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {pkg.excluded.map((x) => (
                    <li key={x.en} className="flex gap-2"><X className="size-4 shrink-0 text-destructive" />{t(x, lang)}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hotels & transport (F4) */}
            <h2 className="mt-12 text-3xl font-semibold text-navy-900">{d.hotelsTransport}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-mist p-6">
                <p className="flex items-center gap-2 font-semibold text-navy-900"><BedDouble className="size-5" />{d.hotels}</p>
                <ul className="mt-3 space-y-2 text-sm text-navy-800">
                  {pkg.hotels.map((h) => (
                    <li key={h.name}>{h.name} · {h.nights} {d.nightsShort} · {t(h.area, lang)}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-mist p-6">
                <p className="flex items-center gap-2 font-semibold text-navy-900"><Car className="size-5" />{d.transport}</p>
                <ul className="mt-3 space-y-2 text-sm text-navy-800">
                  {pkg.transport.map((x) => <li key={x.en}>{t(x, lang)}</li>)}
                </ul>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-brand">{d.meetingPoint}</p>
                <p className="text-sm text-navy-800">{t(pkg.meetingPoint, lang)}</p>
              </div>
            </div>

            {/* Photographer teaser (F6) */}
            <Link href={`/${lang}/photography`} className="mt-6 flex items-center gap-4 rounded-2xl border border-dashed border-slate-brand/60 p-5 transition hover:bg-mist">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-navy-800 text-white"><Camera className="size-5" /></span>
              <span>
                <span className="block font-semibold text-navy-900">{d.photoTeaserTitle}</span>
                <span className="text-sm text-muted-foreground">{d.photoTeaserText} {formatIDR(Math.min(...addons.map((a) => a.price)), lang)}</span>
              </span>
            </Link>

            {/* Departures & prices */}
            <h2 className="mt-12 text-3xl font-semibold text-navy-900">{d.departures}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {nextDepartures.map((dep) => (
                <li key={dep.date} className="flex items-center justify-between rounded-xl bg-card px-4 py-3 text-sm ring-1 ring-border">
                  <span className="font-medium text-navy-900">{formatDate(dep.date, lang, { weekday: "short" })}</span>
                  <span className={dep.seats <= 4 ? "font-semibold text-destructive" : "text-muted-foreground"}>
                    <Users className="mr-1 inline size-3.5" />{dep.seats} {dict.common.seatsLeft}
                  </span>
                </li>
              ))}
            </ul>
            {pkg.pricing.privateFrom && (
              <>
                <h3 className="mt-8 text-2xl font-semibold text-navy-900">{d.privateTiers}</h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-80 text-left text-sm">
                    <tbody>
                      {pkg.pricing.privateFrom.map((tier) => (
                        <tr key={tier.pax} className="border-b border-border">
                          <td className="py-2.5">{tier.pax} {d.paxOrMore}</td>
                          <td className="py-2.5 text-right font-semibold text-navy-900">{formatIDR(tier.perPax, lang)} {dict.common.perPax}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            <p className="mt-3 text-sm text-muted-foreground"><strong className="text-navy-900">{d.childPolicy}:</strong> {t(pkg.pricing.childPolicy, lang)}</p>

            {/* FAQ */}
            <h2 className="mt-12 text-3xl font-semibold text-navy-900">{d.faq}</h2>
            <Accordion type="single" collapsible className="mt-2">
              {faqs.slice(0, 4).map((f, i) => (
                <AccordionItem key={i} value={`f${i}`}>
                  <AccordionTrigger className="text-left">{t(f.q, lang)}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{t(f.a, lang)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">{bookingCard}</div>
          </aside>
        </div>

        {/* Related */}
        <h2 className="mt-20 text-3xl font-semibold text-navy-900">{d.related}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => <PackageCard key={p.slug} pkg={p} lang={lang} dict={dict} />)}
        </div>
      </div>

      {/* Mobile sticky booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">{d.priceFrom}</p>
            <p className="text-lg font-semibold text-navy-900">{formatIDR(price, lang)}</p>
          </div>
          <Button asChild size="lg" className="rounded-full">
            <Link href={bookHref}>{dict.common.bookNow}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
