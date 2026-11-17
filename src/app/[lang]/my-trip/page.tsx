import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TripTracker, type TripInfo } from "@/components/site/trip-tracker";
import { packages } from "@/content/packages";
import { hasLocale, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata({ params }: PageProps<"/[lang]/my-trip">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: dict.myTrip.title, description: dict.myTrip.intro, robots: { index: false } };
}

export default async function MyTripPage({ params }: PageProps<"/[lang]/my-trip">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const trips: Record<string, TripInfo> = Object.fromEntries(
    packages.map((p) => [
      p.slug,
      {
        title: t(p.title, lang),
        tz: p.timezone,
        cover: p.cover,
        durationDays: p.durationDays,
        days: p.itinerary.map((d) => ({
          day: d.day,
          title: t(d.title, lang),
          items: d.items.map((it) => ({ time: it.time, endTime: it.endTime, title: t(it.title, lang), detail: it.detail ? t(it.detail, lang) : undefined, location: it.location, kind: it.kind })),
        })),
      },
    ]),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-5xl font-semibold text-navy-900">{dict.myTrip.title}</h1>
      <p className="mb-10 mt-3 max-w-xl text-muted-foreground">{dict.myTrip.intro}</p>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-mist" />}>
        <TripTracker
          lang={lang}
          trips={trips}
          dict={{ myTrip: dict.myTrip, common: dict.common, booking: dict.booking, confirmation: dict.confirmation, kinds: dict.detail.kinds, day: dict.detail.day }}
        />
      </Suspense>
    </div>
  );
}
