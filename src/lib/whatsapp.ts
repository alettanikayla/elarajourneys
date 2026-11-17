import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";

export function whatsappLink(text: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function greetingMessage(lang: Locale): string {
  return lang === "id"
    ? "Halo Elara Journeys, saya ingin bertanya tentang trip."
    : "Hi Elara Journeys, I'd like to ask about a trip.";
}

export function packageMessage(lang: Locale, packageName: string, date?: string): string {
  return lang === "id"
    ? `Halo Elara Journeys, saya tertarik dengan paket "${packageName}"${date ? ` untuk tanggal ${date}` : ""}. Boleh minta info lebih lanjut?`
    : `Hi Elara Journeys, I'm interested in "${packageName}"${date ? ` on ${date}` : ""}. Could you tell me more?`;
}

export function customTripMessage(lang: Locale): string {
  return lang === "id"
    ? "Halo Elara Journeys, saya ingin konsultasi custom trip untuk rombongan saya."
    : "Hi Elara Journeys, I'd like to plan a custom trip for my group.";
}
