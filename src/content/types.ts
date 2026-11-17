import type { L10n } from "@/i18n/config";
import type { TripTimezone } from "@/lib/format";

export type DestinationSlug = "bali" | "labuan-bajo" | "flores" | "bromo-ijen" | "yogyakarta";

export type ItemKind = "transport" | "activity" | "checkin" | "checkout" | "free" | "photo";

export type ItineraryItem = {
  time: string; // "04:00"
  endTime?: string;
  title: L10n;
  detail?: L10n;
  location?: string;
  kind: ItemKind;
};

export type ItineraryDay = { day: number; title: L10n; items: ItineraryItem[]; overnight?: L10n };

export type Package = {
  slug: string;
  destination: DestinationSlug;
  title: L10n;
  summary: L10n;
  tripType: "open" | "private" | "both";
  durationDays: number;
  durationNights: number;
  timezone: TripTimezone;
  cover: string;
  gallery: string[];
  highlights: L10n[];
  itinerary: ItineraryDay[];
  included: L10n[];
  excluded: L10n[];
  hotels: { name: string; nights: number; area: L10n }[];
  transport: L10n[];
  meetingPoint: L10n;
  pricing: { openTripPerPax?: number; privateFrom?: { pax: number; perPax: number }[]; childPolicy: L10n };
  departures: { date: string; seats: number }[];
  depositPercent: number;
  fullPaymentDaysBefore: number;
  idealFor: ("family" | "solo" | "couple" | "young")[];
};

export type Destination = {
  slug: DestinationSlug;
  name: string;
  region: L10n;
  cover: string;
  tagline: L10n;
  intro: L10n;
  bestMonths: L10n;
  timezone: TripTimezone;
  facts: L10n[];
};

export type Addon = {
  id: "photo-half" | "photo-full" | "video-full" | "combo-full";
  name: L10n;
  description: L10n;
  price: number;
  normalPrice: number;
  unit: L10n;
  deliverables: L10n[];
};
