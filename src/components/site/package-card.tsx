import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { getDestination } from "@/content/destinations";
import { startingPrice } from "@/content/packages";
import type { Package } from "@/content/types";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { formatIDR } from "@/lib/format";

export function PackageCard({ pkg, lang, dict }: { pkg: Package; lang: Locale; dict: Dictionary }) {
  const dest = getDestination(pkg.destination);
  return (
    <Link
      href={`/${lang}/packages/${pkg.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm shadow-navy-900/5 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={pkg.cover} alt={t(pkg.title, lang)} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-navy-900 backdrop-blur">
          {pkg.durationDays}D{pkg.durationNights}N
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{dest?.name}</span>
          <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" />{pkg.durationDays} {dict.common.days}</span>
        </div>
        <h3 className="text-2xl font-semibold leading-tight text-navy-900">{t(pkg.title, lang)}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{t(pkg.summary, lang)}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-xs text-muted-foreground">{dict.common.from}</p>
            <p className="text-lg font-semibold text-navy-800">
              {formatIDR(startingPrice(pkg), lang)}
              <span className="text-xs font-normal text-muted-foreground"> {dict.common.perPax}</span>
            </p>
          </div>
          <span className="text-sm font-medium text-slate-brand group-hover:text-navy-800">{dict.common.viewDetails} →</span>
        </div>
      </div>
    </Link>
  );
}
