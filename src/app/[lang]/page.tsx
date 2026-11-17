import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Camera, Car, CreditCard, Map, Route, Search, ShieldCheck, Sparkles, Ticket, UserRound, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/site/faq-section";
import { PackageCard } from "@/components/site/package-card";
import { Section, SectionHeading } from "@/components/site/section";
import { addons } from "@/content/addons";
import { destinations } from "@/content/destinations";
import { packages } from "@/content/packages";
import { hasLocale, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatDate, formatIDR } from "@/lib/format";

const MONTHS = ["2026-12", "2027-01", "2027-02", "2027-03", "2027-04", "2027-05"];

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const h = dict.home;
  const valueIcons = [ShieldCheck, Sparkles, Wallet];
  const handled = [
    { icon: BedDouble, label: h.handledItems.stay },
    { icon: Car, label: h.handledItems.transport },
    { icon: Ticket, label: h.handledItems.tickets },
    { icon: UserRound, label: h.handledItems.guide },
    { icon: Route, label: h.handledItems.itinerary },
    { icon: Camera, label: h.handledItems.photographer },
  ];
  const cheapestAddon = Math.min(...addons.map((a) => a.price));

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-navy-900 text-white">
        <Image src="/images/padar-island.webp" alt={lang === "id" ? "Pemandangan Pulau Padar, Komodo" : "Padar Island viewpoint, Komodo"} fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/45 to-navy-900/10" />
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-32 sm:px-6 sm:pb-16 lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-sky-brand">{h.eyebrow}</p>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] sm:text-7xl">{h.title}</h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-white/85">{h.subtitle}</p>

          <form action={`/${lang}/packages`} className="mt-10 grid gap-2 rounded-2xl bg-white p-2 text-navy-900 shadow-2xl sm:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="flex flex-col rounded-xl px-4 py-2 hover:bg-mist">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h.search.destination}</span>
              <select name="destination" className="bg-transparent py-1 text-sm font-medium outline-none">
                <option value="">{h.search.anyDestination}</option>
                {destinations.map((d) => (
                  <option key={d.slug} value={d.slug}>{d.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col rounded-xl px-4 py-2 hover:bg-mist">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h.search.month}</span>
              <select name="month" className="bg-transparent py-1 text-sm font-medium outline-none">
                <option value="">{h.search.anyMonth}</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{formatDate(`${m}-01`, lang, { day: undefined, month: "long" })}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col rounded-xl px-4 py-2 hover:bg-mist">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h.search.tripType}</span>
              <select name="type" className="bg-transparent py-1 text-sm font-medium outline-none">
                <option value="">{h.search.anyType}</option>
                <option value="open">{dict.common.openTrip}</option>
                <option value="private">{dict.common.privateTrip}</option>
              </select>
            </label>
            <Button type="submit" size="lg" className="h-auto rounded-xl py-4">
              <Search className="size-4" /> {h.search.submit}
            </Button>
          </form>
        </div>
      </section>

      {/* Value cards */}
      <Section className="pb-0 sm:pb-0">
        <div className="grid gap-4 md:grid-cols-3">
          {h.values.map((v, i) => {
            const Icon = valueIcons[i];
            return (
              <div key={v.title} className="flex gap-4 rounded-2xl border border-border bg-card p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mist text-navy-800"><Icon className="size-5" /></span>
                <div>
                  <h3 className="text-xl font-semibold text-navy-900">{v.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Featured packages */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title={h.featuredTitle} intro={h.featuredIntro} />
          <Button asChild variant="outline" className="mb-10 rounded-full">
            <Link href={`/${lang}/packages`}>{dict.common.viewAll}</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.slice(0, 3).map((p) => (
            <PackageCard key={p.slug} pkg={p} lang={lang} dict={dict} />
          ))}
        </div>
      </Section>

      {/* Destinations */}
      <Section className="pt-0 sm:pt-0">
        <SectionHeading title={h.destinationsTitle} intro={h.destinationsIntro} />
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-5">
          {destinations.map((d) => (
            <Link key={d.slug} href={`/${lang}/destinations/${d.slug}`} className="group relative aspect-[3/4] w-[70vw] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-auto">
              <Image src={d.cover} alt={d.name} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 70vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-xs uppercase tracking-wider text-white/70">{t(d.region, lang)}</p>
                <h3 className="text-3xl font-semibold">{d.name}</h3>
                <p className="mt-1 text-sm text-white/80">{t(d.tagline, lang)}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Everything handled (F4) */}
      <section className="bg-mist">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
          <div className="relative grid grid-cols-5 gap-3">
            <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src="/images/bali-villa.webp" alt={lang === "id" ? "Vila tebing partner di Bali timur" : "Partner clifftop villa in East Bali"} fill sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover" />
            </div>
            <div className="relative col-span-2 mt-12 aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src="/images/bali-resort.webp" alt={lang === "id" ? "Resort partner di Bali" : "Partner jungle resort in Bali"} fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
            </div>
          </div>
          <div>
            <SectionHeading title={h.handledTitle} intro={h.handledIntro} className="mb-8" />
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {handled.map(({ icon: Icon, label }) => (
                <li key={label} className="flex flex-col gap-3 rounded-2xl bg-card p-4 text-sm font-medium text-navy-900">
                  <Icon className="size-5 text-slate-brand" />
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl border border-dashed border-slate-brand/50 bg-sand px-4 py-3 text-sm text-navy-800">🍜 {h.handledNote}</p>
          </div>
        </div>
      </section>

      {/* Custom trip (F3) + Photography (F6) */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-3xl p-8 text-white">
            <Image src="/images/wae-rebo-valley.webp" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-10 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900/90 to-navy-900/20" />
            <Map className="mb-4 size-7 text-sky-brand" />
            <h3 className="text-3xl font-semibold sm:text-4xl">{h.customTitle}</h3>
            <p className="mt-3 max-w-md text-white/80">{h.customText}</p>
            <Button asChild variant="secondary" className="mt-6 w-fit rounded-full">
              <Link href={`/${lang}/custom-trip`}>{h.customCta}</Link>
            </Button>
          </div>
          <div className="relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-3xl p-8 text-white">
            <Image src="/images/pink-beach.webp" alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="-z-10 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900/90 to-navy-900/20" />
            <Camera className="mb-4 size-7 text-sky-brand" />
            <h3 className="text-3xl font-semibold sm:text-4xl">{h.photoTitle}</h3>
            <p className="mt-3 max-w-md text-white/80">
              {h.photoText} {dict.common.from} {formatIDR(cheapestAddon, lang)}.
            </p>
            <Button asChild variant="secondary" className="mt-6 w-fit rounded-full">
              <Link href={`/${lang}/photography`}>{h.photoCta}</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* How booking works */}
      <Section className="pt-0 sm:pt-0">
        <SectionHeading title={h.howTitle} />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {h.howSteps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="font-serif text-5xl font-semibold text-sky-brand">{i + 1}</span>
              <h3 className="mt-2 text-xl font-semibold text-navy-900">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCard className="size-4" /> {h.payments}
        </p>
      </Section>

      {/* Testimonials intentionally hidden until real reviews exist (CLAUDE.md §8). */}

      <FaqSection lang={lang} dict={dict} />

      {/* Final CTA */}
      <Section className="pt-0 sm:pt-0">
        <div className="rounded-3xl bg-navy-800 px-6 py-14 text-center text-white sm:px-12">
          <h2 className="text-balance text-4xl font-semibold sm:text-5xl">{h.finalTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">{h.finalText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link href={`/${lang}/packages`}>{dict.nav.packages}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
              <Link href={`/${lang}/custom-trip`}>{dict.nav.customTrip}</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
