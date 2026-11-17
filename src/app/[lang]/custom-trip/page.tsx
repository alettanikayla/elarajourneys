import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CustomTripForm } from "@/components/site/custom-trip-form";
import { PageHero, Section } from "@/components/site/section";
import { destinations } from "@/content/destinations";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/custom-trip">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMeta(lang, "/custom-trip", dict.custom.title, dict.custom.intro, "/images/wae-rebo-valley.webp");
}

export default async function CustomTripPage({ params }: PageProps<"/[lang]/custom-trip">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const c = dict.custom;

  return (
    <>
      <PageHero title={c.title} intro={c.intro} image={<Image src="/images/family-trip.webp" alt="" fill priority sizes="100vw" className="object-cover" />} />
      <Section>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl bg-mist p-6">
              <span className="font-serif text-5xl font-semibold text-sky-brand">{i + 1}</span>
              <h2 className="mt-2 text-xl font-semibold text-navy-900">{s.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-navy-900">{c.examplesTitle}:</span>
          {c.examples.map((e) => (
            <span key={e} className="rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">{e}</span>
          ))}
        </div>
        <div className="mt-12">
          <CustomTripForm lang={lang} destinations={destinations.map((d) => ({ slug: d.slug, name: d.name }))} dict={c} />
        </div>
      </Section>
    </>
  );
}
