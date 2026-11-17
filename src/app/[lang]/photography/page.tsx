import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/section";
import { addons } from "@/content/addons";
import { hasLocale, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatIDR } from "@/lib/format";
import { pageMeta } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[lang]/photography">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMeta(lang, "/photography", dict.photography.title, dict.photography.intro, "/images/pink-beach.webp");
}

export default async function PhotographyPage({ params }: PageProps<"/[lang]/photography">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.photography;

  return (
    <>
      <PageHero title={p.title} intro={p.intro} image={<Image src="/images/pink-beach.webp" alt="" fill priority sizes="100vw" className="object-cover" />} />
      <Section>
        <div className="grid gap-3 sm:grid-cols-3">
          {["/images/family-trip.webp", "/images/padar-island.webp", "/images/pink-beach.webp"].map((src, i) => (
            <div key={src} className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${i === 0 ? "sm:col-span-2 sm:aspect-auto" : ""}`}>
              <Image src={src} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {addons.map((a) => (
            <div key={a.id} className={`flex flex-col rounded-2xl bg-card p-6 ring-1 ${a.id === "combo-full" ? "ring-2 ring-navy-800" : "ring-border"}`}>
              {a.id === "combo-full" && <span className="mb-3 w-fit rounded-full bg-navy-800 px-3 py-1 text-xs font-semibold text-white">{p.bestValue}</span>}
              <h2 className="text-2xl font-semibold text-navy-900">{t(a.name, lang)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t(a.description, lang)}</p>
              <p className="mt-5 text-xs uppercase tracking-wider text-slate-brand">{p.special}</p>
              <p className="text-2xl font-semibold text-navy-900">{formatIDR(a.price, lang)} <span className="text-sm font-normal text-muted-foreground">{t(a.unit, lang)}</span></p>
              <p className="text-sm text-muted-foreground">{p.normal}: <span className="line-through">{formatIDR(a.normalPrice, lang)}</span></p>
              <ul className="mt-5 space-y-2 text-sm">
                {a.deliverables.map((d) => (
                  <li key={d.en} className="flex gap-2"><Check className="size-4 shrink-0 text-emerald-600" />{t(d, lang)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" />{p.coverage}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full"><Link href={`/${lang}/packages`}>{p.cta}</Link></Button>
          <Button asChild size="lg" variant="outline" className="rounded-full"><Link href={`/${lang}/custom-trip`}>{dict.nav.customTrip}</Link></Button>
        </div>
      </Section>
    </>
  );
}
