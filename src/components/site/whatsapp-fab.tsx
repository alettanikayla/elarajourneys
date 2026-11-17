"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/icons/brand";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { customTripMessage, greetingMessage, packageMessage, whatsappLink } from "@/lib/whatsapp";

/** Floating WhatsApp CTA (F1). The prefilled message depends on the current page. */
export function WhatsAppFab({ lang, label, aria, packageNames }: { lang: Locale; label: string; aria: string; packageNames: Record<string, string> }) {
  const pathname = usePathname() || "";
  const pkgMatch = pathname.match(/\/packages\/([^/]+)/);
  const pkgName = pkgMatch ? packageNames[pkgMatch[1]] : undefined;
  const onDetail = !!pkgMatch && !pathname.endsWith("/book");

  const message = pkgName ? packageMessage(lang, pkgName) : pathname.includes("/custom-trip") ? customTripMessage(lang) : greetingMessage(lang);

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={aria}
      className={cn(
        "group fixed right-5 z-40 flex items-center gap-2 transition-[bottom]",
        onDetail ? "bottom-[calc(6rem+env(safe-area-inset-bottom))] lg:bottom-[calc(1.25rem+env(safe-area-inset-bottom))]" : "bottom-[calc(1.25rem+env(safe-area-inset-bottom))]",
      )}
    >
      <span className="pointer-events-none hidden rounded-full bg-white px-3 py-1.5 text-sm font-medium text-navy-900 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 lg:block">
        {label}
      </span>
      <span className="grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/20 transition-transform group-hover:scale-105">
        <WhatsAppIcon className="size-7" />
      </span>
    </a>
  );
}
