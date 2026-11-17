// TEMPORARY scaffold root layout. Milestone M1 in CLAUDE.md replaces this with src/app/[lang]/layout.tsx
// (fonts via next/font, i18n, header, footer, WhatsApp button). Delete this file and page.tsx then.
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elara Journeys | Unveiling the Hidden Wonders of Nusantara",
  description: "Curated trips across Indonesia: Bali, Labuan Bajo, Flores, Bromo–Ijen, Yogyakarta.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
