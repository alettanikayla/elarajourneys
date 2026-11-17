import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PackageCard } from "@/components/site/package-card";
import { PackageFilters, type FilterItem } from "@/components/site/package-filters";
import { PageHero, Section } from "@/components/site/section";
import { destinations } from "@/content/destinations";
import { packages, startingPrice } from "@/content/packages";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatDate, formatIDR } from "@/lib/format";
import { pageMeta } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/packages">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMeta(lang, "/packages", dict.packages.title, dict.packages.intro);
}

export default async function PackagesPage({ params }: PageProps<"/[lang]/packages">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const items: FilterItem[] = packages.map((p) => ({
    slug: p.slug,
    destination: p.destination,
    days: p.durationDays,
    types: p.tripType === "both" ? ["open", "private"] : [p.tripType],
    price: startingPrice(p),
    months: [...new Set(p.departures.map((d) => d.date.slice(0, 7)))],
  }));
  const cards = Object.fromEntries(packages.map((p) => [p.slug, <PackageCard key={p.slug} pkg={p} lang={lang} dict={dict} />]));
  const months = [...new Set(items.flatMap((i) => i.months))].sort().map((m) => ({ value: m, label: formatDate(`${m}-01`, lang, { day: undefined, month: "long" }) }));
  const prices = [3_000_000, 5_000_000, 7_500_000].map((v) => ({ value: String(v), label: `≤ ${formatIDR(v, lang)}` }));

  return (
    <>
      <PageHero
        title={dict.packages.title}
        intro={dict.packages.intro}
        image={<Image src="/images/pink-beach.webp" alt="" fill priority sizes="100vw" className="object-cover" />}
      />
      <Section>
        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((p) => cards[p.slug])}
            </div>
          }
        >
          <PackageFilters
            items={items}
            cards={cards}
            destinations={destinations.map((d) => ({ slug: d.slug, name: d.name }))}
            months={months}
            prices={prices}
            labels={{
              ...dict.packages.filters,
              noResults: dict.packages.noResults,
              results: dict.packages.results,
              open: dict.common.openTrip,
              private: dict.common.privateTrip,
              anyMonth: dict.home.search.anyMonth,
              month: dict.home.search.month,
            }}
          />
        </Suspense>
      </Section>
    </>
  );
}
