import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { packages } from "@/content/packages";
import { hasLocale, locales, t } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta, siteUrl } from "@/lib/metadata";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    ...pageMeta(lang, "", dict.meta.title, dict.meta.description, "/images/padar-island.webp"),
    title: { default: dict.meta.title, template: "%s · Elara Journeys" },
  };
}

export const viewport: Viewport = { themeColor: "#1B2E44", viewportFit: "cover" };

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const packageNames = Object.fromEntries(packages.map((p) => [p.slug, t(p.title, lang)]));

  return (
    <html lang={lang} className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Header lang={lang} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} dict={dict} />
        <WhatsAppFab lang={lang} label={dict.whatsapp.label} aria={dict.whatsapp.aria} packageNames={packageNames} />
      </body>
    </html>
  );
}
