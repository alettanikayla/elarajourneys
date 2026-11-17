import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarRange, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackageCard } from "@/components/site/package-card";
import { PageHero, Section } from "@/components/site/section";
import { destinations, getDestination } from "@/content/destinations";
import { packages } from "@/content/packages";
import { hasLocale, locales, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { tzAbbr } from "@/lib/format";
import { pageMeta } from "@/lib/metadata";

export function generateStaticParams() {
  return locales.flatMap((lang) => destinations.map((d) => ({ lang, slug: d.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/destinations/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const dest = getDestination(slug);
  if (!hasLocale(lang) || !dest) return {};
  return pageMeta(lang, `/destinations/${slug}`, dest.name, t(dest.intro, lang), dest.cover);
}

export default async function DestinationPage({ params }: PageProps<"/[lang]/destinations/[slug]">) {
  const { lang, slug } = await params;
  const dest = getDestination(slug);
  if (!hasLocale(lang) || !dest) notFound();
  const dict = await getDictionary(lang);
  const list = packages.filter((p) => p.destination === dest.slug);

  return (
    <>
      <PageHero
        eyebrow={t(dest.region, lang)}
        title={dest.name}
        intro={t(dest.tagline, lang)}
        image={<Image src={dest.cover} alt={dest.name} fill priority sizes="100vw" className="object-cover" />}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <p className="text-pretty font-serif text-2xl leading-relaxed text-navy-900 sm:text-3xl">{t(dest.intro, lang)}</p>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-3 rounded-2xl bg-mist p-4 text-sm text-navy-900"><CalendarRange className="size-5 shrink-0 text-slate-brand" />{t(dest.bestMonths, lang)}</li>
            <li className="flex gap-3 rounded-2xl bg-mist p-4 text-sm text-navy-900"><Clock className="size-5 shrink-0 text-slate-brand" />{tzAbbr[dest.timezone]} · {dest.timezone}</li>
            {dest.facts.map((f) => (
              <li key={f.en} className="flex gap-3 rounded-2xl bg-mist p-4 text-sm text-navy-900"><Info className="size-5 shrink-0 text-slate-brand" />{t(f, lang)}</li>
            ))}
          </ul>
        </div>

        <h2 className="mt-16 text-4xl font-semibold text-navy-900">{dict.nav.packages}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <PackageCard key={p.slug} pkg={p} lang={lang} dict={dict} />)}
          <div className="flex flex-col justify-center rounded-2xl border border-dashed border-slate-brand/60 p-8">
            <h3 className="text-2xl font-semibold text-navy-900">{dict.home.customTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{dict.home.customText}</p>
            <Button asChild className="mt-6 w-fit rounded-full"><Link href={`/${lang}/custom-trip`}>{dict.home.customCta}</Link></Button>
          </div>
        </div>
      </Section>
    </>
  );
}
