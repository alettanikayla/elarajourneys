import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { BookingForm } from "@/components/site/booking-form";
import { addons } from "@/content/addons";
import { getPackage, packages } from "@/content/packages";
import { hasLocale, locales, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export function generateStaticParams() {
  return locales.flatMap((lang) => packages.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/packages/[slug]/book">): Promise<Metadata> {
  const { lang, slug } = await params;
  const pkg = getPackage(slug);
  if (!hasLocale(lang) || !pkg) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.booking.title}: ${t(pkg.title, lang)}`, robots: { index: false } };
}

export default async function BookPage({ params }: PageProps<"/[lang]/packages/[slug]/book">) {
  const { lang, slug } = await params;
  const pkg = getPackage(slug);
  if (!hasLocale(lang) || !pkg) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href={`/${lang}/packages/${pkg.slug}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-navy-900">
        <ChevronLeft className="size-4" /> {t(pkg.title, lang)}
      </Link>
      <h1 className="mb-10 mt-3 text-5xl font-semibold text-navy-900">{dict.booking.title}</h1>
      <BookingForm pkg={pkg} lang={lang} addons={addons} dict={{ booking: dict.booking, common: dict.common }} />
    </div>
  );
}
