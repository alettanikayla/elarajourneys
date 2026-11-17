import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";

export function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const nav = [
    { href: `/${lang}/packages`, label: dict.nav.packages },
    { href: `/${lang}/destinations`, label: dict.nav.destinations },
    { href: `/${lang}/custom-trip`, label: dict.nav.customTrip },
    { href: `/${lang}/photography`, label: dict.nav.photography },
    { href: `/${lang}/my-trip`, label: dict.nav.myTrip },
  ];
  const cta = { href: `/${lang}/packages`, label: dict.nav.book };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-sand/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={`/${lang}`} className="flex items-center gap-2.5">
          <Image src="/brand/logo-mark.png" alt="" width={43} height={36} className="h-9 w-auto" />
          <span className="font-serif text-xl font-semibold tracking-wide text-navy-900">Elara Journeys</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm font-medium text-navy-800/80 transition-colors hover:bg-mist hover:text-navy-900">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher lang={lang} label={dict.nav.language} />
          <Button asChild size="sm" className="hidden rounded-full sm:inline-flex">
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
          <MobileMenu items={nav} menuLabel={dict.nav.menu} closeLabel={dict.nav.close} cta={cta} />
        </div>
      </div>
    </header>
  );
}
