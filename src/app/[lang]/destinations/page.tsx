import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/site/section";
import { destinations } from "@/content/destinations";
import { packages } from "@/content/packages";
import { hasLocale, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/destinations">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMeta(lang, "/destinations", dict.home.destinationsTitle, dict.home.destinationsIntro);
}

export default async function DestinationsPage({ params }: PageProps<"/[lang]/destinations">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <PageHero
        title={dict.home.destinationsTitle}
        intro={dict.home.destinationsIntro}
        image={<Image src="/images/wae-rebo-valley.webp" alt="" fill priority sizes="100vw" className="object-cover" />}
      />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {destinations.map((d, i) => {
            const count = packages.filter((p) => p.destination === d.slug).length;
            return (
              <Link key={d.slug} href={`/${lang}/destinations/${d.slug}`} className={`group relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-3xl p-8 text-white ${i === 0 ? "md:col-span-2 md:min-h-[26rem]" : ""}`}>
                <Image src={d.cover} alt={d.name} fill sizes={i === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw"} className="-z-10 object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
                <p className="text-xs uppercase tracking-[0.2em] text-sky-brand">{t(d.region, lang)}</p>
                <h2 className="text-5xl font-semibold">{d.name}</h2>
                <p className="mt-2 max-w-lg text-white/85">{t(d.tagline, lang)}</p>
                <p className="mt-4 text-sm text-white/70">{count} {dict.packages.results} →</p>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
