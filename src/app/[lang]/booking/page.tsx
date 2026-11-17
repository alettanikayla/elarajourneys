import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingConfirmation } from "@/components/site/booking-confirmation";
import { packages } from "@/content/packages";
import { hasLocale, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata({ params }: PageProps<"/[lang]/booking">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.confirmation.title, robots: { index: false } };
}

export default async function BookingPage({ params }: PageProps<"/[lang]/booking">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const titles = Object.fromEntries(packages.map((p) => [p.slug, t(p.title, lang)]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-mist" />}>
        <BookingConfirmation lang={lang} titles={titles} dict={{ confirmation: dict.confirmation, booking: dict.booking, common: dict.common }} />
      </Suspense>
    </div>
  );
}
