import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Baby, Heart, Sparkles, UserRound } from "lucide-react";
import { Section } from "@/components/site/section";
import { site } from "@/content/site";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMeta(lang, "/about", dict.about.title, dict.about.text[0]);
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const segments = [
    { icon: Baby, label: dict.common.idealFor.family },
    { icon: UserRound, label: dict.common.idealFor.solo },
    { icon: Heart, label: dict.common.idealFor.couple },
    { icon: Sparkles, label: dict.common.idealFor.young },
  ];
  const jsonLd = { "@context": "https://schema.org", "@type": "TravelAgency", name: site.name, legalName: site.legalName, slogan: site.tagline, email: site.email };

  return (
    <Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-5xl font-semibold text-navy-900 sm:text-6xl">{dict.about.title}</h1>
          {dict.about.text.map((p) => (
            <p key={p} className="mt-5 text-pretty text-lg text-navy-800/80">{p}</p>
          ))}
        </div>
        <div className="grid place-items-center rounded-3xl bg-card p-10 ring-1 ring-border">
          <Image src="/brand/logo-full.png" alt={site.name} width={436} height={352} className="h-auto w-full max-w-sm" />
        </div>
      </div>
      <h2 className="mt-20 text-4xl font-semibold text-navy-900">{dict.about.segmentsTitle}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {segments.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl bg-mist p-5 font-medium text-navy-900"><Icon className="size-5 text-slate-brand" />{label}</div>
        ))}
      </div>
    </Section>
  );
}
