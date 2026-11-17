import type { Addon } from "./types";

// All prices are PLACEHOLDERS until the owner confirms (CLAUDE.md §13).
export const addons: Addon[] = [
  {
    id: "photo-half",
    name: { en: "Photographer · half day", id: "Fotografer · setengah hari" },
    description: {
      en: "A local photographer joins you for up to 5 hours, perfect for a sunrise spot or one highlight.",
      id: "Fotografer lokal menemani Anda hingga 5 jam, pas untuk satu spot sunrise atau satu highlight.",
    },
    price: 850_000, // PLACEHOLDER
    normalPrice: 1_200_000, // PLACEHOLDER
    unit: { en: "per day", id: "per hari" },
    deliverables: [
      { en: "80+ edited photos", id: "80+ foto hasil edit" },
      { en: "Delivered in 5 days via Google Drive", id: "Dikirim dalam 5 hari via Google Drive" },
    ],
  },
  {
    id: "photo-full",
    name: { en: "Photographer · full day", id: "Fotografer · seharian" },
    description: {
      en: "Your own photographer for the whole day, from the first activity until sunset.",
      id: "Fotografer pribadi sepanjang hari, dari aktivitas pertama hingga matahari terbenam.",
    },
    price: 1_500_000, // PLACEHOLDER
    normalPrice: 2_100_000, // PLACEHOLDER
    unit: { en: "per day", id: "per hari" },
    deliverables: [
      { en: "150+ edited photos", id: "150+ foto hasil edit" },
      { en: "Delivered in 7 days via Google Drive", id: "Dikirim dalam 7 hari via Google Drive" },
    ],
  },
  {
    id: "video-full",
    name: { en: "Videographer · full day", id: "Videografer · seharian" },
    description: {
      en: "Cinematic footage of your day, including drone shots where permitted.",
      id: "Video sinematik perjalanan Anda, termasuk drone di lokasi yang diizinkan.",
    },
    price: 2_200_000, // PLACEHOLDER
    normalPrice: 3_000_000, // PLACEHOLDER
    unit: { en: "per day", id: "per hari" },
    deliverables: [
      { en: "1–2 min highlight reel", id: "Video highlight 1–2 menit" },
      { en: "Vertical cut for Reels/TikTok", id: "Versi vertikal untuk Reels/TikTok" },
      { en: "Delivered in 10 days", id: "Dikirim dalam 10 hari" },
    ],
  },
  {
    id: "combo-full",
    name: { en: "Photo + Video combo", id: "Paket Foto + Video" },
    description: {
      en: "Best value: a photographer and a videographer together for the full day.",
      id: "Paling hemat: fotografer dan videografer sekaligus sepanjang hari.",
    },
    price: 3_200_000, // PLACEHOLDER
    normalPrice: 4_600_000, // PLACEHOLDER
    unit: { en: "per day", id: "per hari" },
    deliverables: [
      { en: "150+ edited photos", id: "150+ foto hasil edit" },
      { en: "1–2 min highlight reel + vertical cut", id: "Video highlight 1–2 menit + versi vertikal" },
      { en: "Delivered in 10 days", id: "Dikirim dalam 10 hari" },
    ],
  },
];

export function getAddon(id: string) {
  return addons.find((a) => a.id === id);
}
