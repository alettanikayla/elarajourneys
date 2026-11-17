import type { L10n } from "@/i18n/config";
import type { Package } from "./types";

// ---------------------------------------------------------------------------
// Shared lists
// ---------------------------------------------------------------------------
const NOT_INCLUDED: L10n[] = [
  { en: "Meals & drinks (eat wherever you like)", id: "Makan & minum (bebas pilih tempat makan)" },
  { en: "Souvenirs (oleh-oleh)", id: "Oleh-oleh" },
  { en: "Flights to/from the meeting point", id: "Tiket pesawat ke/dari titik kumpul" },
  { en: "Personal expenses & tips", id: "Pengeluaran pribadi & tip" },
  { en: "Travel insurance", id: "Asuransi perjalanan" },
];

const ALWAYS_INCLUDED: L10n[] = [
  { en: "Partner hotel / villa (twin share)", id: "Hotel / vila partner (twin share)" },
  { en: "All transport during the trip", id: "Semua transportasi selama trip" },
  { en: "Entrance tickets & permits", id: "Tiket masuk & izin" },
  { en: "English / Indonesian-speaking guide", id: "Pemandu berbahasa Indonesia / Inggris" },
  { en: "Mineral water during activities", id: "Air mineral selama aktivitas" },
];

/** Open-trip departures for Dec 2026 – May 2027. Seat counts are PLACEHOLDERS. */
function departures(days: number[], seats = 12): { date: string; seats: number }[] {
  const months = ["2026-12", "2027-01", "2027-02", "2027-03", "2027-04", "2027-05"];
  const out: { date: string; seats: number }[] = [];
  months.forEach((m, mi) => {
    days.forEach((d, di) => {
      out.push({ date: `${m}-${String(d).padStart(2, "0")}`, seats: seats - ((mi * 3 + di * 5) % 9) });
    });
  });
  return out;
}

// ---------------------------------------------------------------------------
// Packages
// ---------------------------------------------------------------------------
export const packages: Package[] = [
  {
    slug: "bali-hidden-gems-4d3n",
    destination: "bali",
    title: { en: "Bali Hidden Gems", id: "Bali Hidden Gems" },
    summary: {
      en: "Highland lake temples, jungle waterfalls, golden rice terraces and two nights in a clifftop villa in quiet East Bali.",
      id: "Pura di tepi danau, air terjun di tengah hutan, sawah berundak keemasan, dan dua malam di vila tebing Bali timur yang tenang.",
    },
    tripType: "both",
    durationDays: 4,
    durationNights: 3,
    timezone: "Asia/Makassar",
    cover: "/images/bali-rice-terraces.webp",
    gallery: ["/images/bali-rice-terraces.webp", "/images/ulun-danu.webp", "/images/bali-villa.webp", "/images/bali-resort.webp", "/images/family-trip.webp"],
    highlights: [
      { en: "Sunrise at Pura Ulun Danu Beratan before the crowds", id: "Sunrise di Pura Ulun Danu Beratan sebelum ramai" },
      { en: "Swim at a hidden jungle waterfall", id: "Berenang di air terjun tersembunyi" },
      { en: "Golden-hour walk through the rice terraces", id: "Jalan santai di sawah berundak saat golden hour" },
      { en: "Two nights in a clifftop pool villa", id: "Dua malam di vila tebing dengan kolam renang" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "Arrival & Ubud", id: "Kedatangan & Ubud" },
        items: [
          { time: "10:00", endTime: "11:00", kind: "transport", title: { en: "Airport pickup at Ngurah Rai", id: "Penjemputan di Bandara Ngurah Rai" }, detail: { en: "Your driver waits at arrivals with an Elara sign.", id: "Driver menunggu di pintu kedatangan dengan papan Elara." }, location: "DPS Airport" },
          { time: "12:30", kind: "checkin", title: { en: "Check in at the Ubud partner hotel", id: "Check-in di hotel partner Ubud" }, location: "Ubud" },
          { time: "15:30", endTime: "18:00", kind: "activity", title: { en: "Tegallalang rice terraces at golden hour", id: "Sawah Tegallalang saat golden hour" }, detail: { en: "Walk the lower paths that most visitors miss.", id: "Menyusuri jalur bawah yang jarang dilewati wisatawan." }, location: "Tegallalang" },
          { time: "18:30", kind: "free", title: { en: "Free evening in Ubud", id: "Malam bebas di Ubud" }, detail: { en: "Dinner on your own; your guide shares a list of local favourites.", id: "Makan malam sendiri; pemandu memberi rekomendasi tempat makan lokal." } },
        ],
        overnight: { en: "Ubud", id: "Ubud" },
      },
      {
        day: 2,
        title: { en: "Highland temples & waterfalls", id: "Pura dataran tinggi & air terjun" },
        items: [
          { time: "04:30", kind: "transport", title: { en: "Early drive to Bedugul", id: "Berangkat pagi ke Bedugul" }, location: "Ubud" },
          { time: "06:00", endTime: "07:30", kind: "activity", title: { en: "Sunrise at Pura Ulun Danu Beratan", id: "Sunrise di Pura Ulun Danu Beratan" }, location: "Bedugul" },
          { time: "09:30", endTime: "12:00", kind: "activity", title: { en: "Hidden waterfall trek & swim", id: "Trekking & berenang di air terjun tersembunyi" }, detail: { en: "Easy 20-minute trail. Bring swimwear.", id: "Jalur mudah 20 menit. Bawa baju renang." }, location: "Munduk" },
          { time: "14:00", endTime: "15:30", kind: "activity", title: { en: "Jatiluwih coffee & spice garden stop", id: "Mampir kebun kopi & rempah Jatiluwih" }, location: "Jatiluwih" },
          { time: "17:00", kind: "transport", title: { en: "Return to Ubud", id: "Kembali ke Ubud" } },
        ],
        overnight: { en: "Ubud", id: "Ubud" },
      },
      {
        day: 3,
        title: { en: "Slow East Bali", id: "Bali timur yang tenang" },
        items: [
          { time: "08:00", kind: "checkout", title: { en: "Check out from Ubud", id: "Check-out dari Ubud" } },
          { time: "09:30", endTime: "11:00", kind: "activity", title: { en: "Tirta Gangga water palace", id: "Taman air Tirta Gangga" }, location: "Karangasem" },
          { time: "12:30", kind: "checkin", title: { en: "Check in at the clifftop villa", id: "Check-in di vila tebing" }, location: "East Bali" },
          { time: "15:00", kind: "free", title: { en: "Pool & ocean views, free time", id: "Waktu bebas, kolam & pemandangan laut" } },
          { time: "17:30", endTime: "18:30", kind: "photo", title: { en: "Sunset photo spot at the villa", id: "Spot foto sunset di vila" } },
        ],
        overnight: { en: "East Bali villa", id: "Vila Bali timur" },
      },
      {
        day: 4,
        title: { en: "Morning swim & departure", id: "Berenang pagi & kepulangan" },
        items: [
          { time: "07:00", kind: "free", title: { en: "Slow morning at the villa", id: "Pagi santai di vila" } },
          { time: "10:00", kind: "checkout", title: { en: "Check out", id: "Check-out" } },
          { time: "10:30", endTime: "13:00", kind: "transport", title: { en: "Transfer to the airport", id: "Antar ke bandara" }, location: "DPS Airport" },
        ],
      },
    ],
    included: [...ALWAYS_INCLUDED, { en: "Private AC car with driver", id: "Mobil AC pribadi dengan driver" }],
    excluded: NOT_INCLUDED,
    hotels: [
      { name: "Partner boutique hotel, Ubud (or similar)", nights: 2, area: { en: "Ubud", id: "Ubud" } },
      { name: "Partner clifftop villa (or similar)", nights: 1, area: { en: "East Bali", id: "Bali timur" } },
    ],
    transport: [{ en: "Private AC car with driver, airport pickup & drop-off", id: "Mobil AC pribadi dengan driver, antar-jemput bandara" }],
    meetingPoint: { en: "Ngurah Rai International Airport (DPS), 10:00 WITA", id: "Bandara Internasional Ngurah Rai (DPS), 10:00 WITA" },
    pricing: {
      openTripPerPax: 4_250_000, // PLACEHOLDER
      privateFrom: [ // PLACEHOLDER
        { pax: 2, perPax: 6_900_000 },
        { pax: 4, perPax: 5_400_000 },
        { pax: 6, perPax: 4_800_000 },
      ],
      childPolicy: { en: "Children 2–11 pay 75%, infants under 2 travel free.", id: "Anak 2–11 tahun bayar 75%, bayi di bawah 2 tahun gratis." },
    },
    departures: departures([5, 19]),
    depositPercent: 30,
    fullPaymentDaysBefore: 14,
    idealFor: ["family", "couple"],
  },
  {
    slug: "labuan-bajo-komodo-3d2n",
    destination: "labuan-bajo",
    title: { en: "Labuan Bajo & Komodo Sailing", id: "Sailing Labuan Bajo & Komodo" },
    summary: {
      en: "Two nights on a phinisi boat: Padar sunrise, Pink Beach, Komodo dragons and swimming with mantas.",
      id: "Dua malam di kapal phinisi: sunrise Padar, Pink Beach, komodo, dan berenang bersama manta.",
    },
    tripType: "both",
    durationDays: 3,
    durationNights: 2,
    timezone: "Asia/Makassar",
    cover: "/images/padar-island.webp",
    gallery: ["/images/padar-island.webp", "/images/pink-beach.webp", "/images/wae-rebo-valley.webp", "/images/bali-resort.webp", "/images/bali-villa.webp"],
    highlights: [
      { en: "Padar Island sunrise hike (≈ 05:00)", id: "Mendaki Pulau Padar untuk sunrise (± 05:00)" },
      { en: "Snorkel the pink sands of Pink Beach", id: "Snorkeling di pasir merah muda Pink Beach" },
      { en: "Meet Komodo dragons with a park ranger", id: "Bertemu komodo didampingi ranger" },
      { en: "Swim with manta rays at Manta Point", id: "Berenang bersama manta di Manta Point" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "Set sail", id: "Mulai berlayar" },
        items: [
          { time: "09:00", kind: "transport", title: { en: "Pickup at Komodo Airport (LBJ)", id: "Penjemputan di Bandara Komodo (LBJ)" }, location: "Labuan Bajo" },
          { time: "10:00", kind: "checkin", title: { en: "Board the phinisi at the harbour", id: "Naik kapal phinisi di pelabuhan" }, detail: { en: "Safety briefing and cabin allocation.", id: "Briefing keselamatan dan pembagian kabin." } },
          { time: "13:00", endTime: "14:30", kind: "activity", title: { en: "Kelor Island hike & snorkel", id: "Mendaki & snorkeling di Pulau Kelor" } },
          { time: "16:30", endTime: "18:00", kind: "activity", title: { en: "Kalong Island: flying foxes at sunset", id: "Pulau Kalong: kelelawar saat sunset" } },
        ],
        overnight: { en: "On board, anchored near Padar", id: "Di kapal, bersandar dekat Padar" },
      },
      {
        day: 2,
        title: { en: "Padar, Pink Beach & Komodo", id: "Padar, Pink Beach & Komodo" },
        items: [
          { time: "04:30", kind: "transport", title: { en: "Dinghy to Padar Island", id: "Sekoci ke Pulau Padar" } },
          { time: "05:00", endTime: "06:30", kind: "activity", title: { en: "Padar sunrise hike", id: "Mendaki Padar saat sunrise" }, detail: { en: "≈ 30 min climb on stairs. Wear proper shoes.", id: "± 30 menit menaiki tangga. Pakai sepatu yang nyaman." }, location: "Padar" },
          { time: "08:30", endTime: "10:30", kind: "activity", title: { en: "Pink Beach snorkel", id: "Snorkeling di Pink Beach" } },
          { time: "11:30", endTime: "13:00", kind: "activity", title: { en: "Komodo Island ranger trek", id: "Trekking Pulau Komodo bersama ranger" }, location: "Loh Liang" },
          { time: "15:00", endTime: "16:00", kind: "activity", title: { en: "Manta Point swim", id: "Berenang di Manta Point" } },
          { time: "17:30", kind: "photo", title: { en: "Sunset on the top deck", id: "Sunset di dek atas" } },
        ],
        overnight: { en: "On board", id: "Di kapal" },
      },
      {
        day: 3,
        title: { en: "Last swim & return", id: "Berenang terakhir & kembali" },
        items: [
          { time: "07:00", endTime: "08:30", kind: "activity", title: { en: "Kanawa Island snorkel", id: "Snorkeling di Pulau Kanawa" } },
          { time: "11:00", kind: "checkout", title: { en: "Arrive back in Labuan Bajo harbour", id: "Tiba kembali di pelabuhan Labuan Bajo" } },
          { time: "11:30", kind: "transport", title: { en: "Transfer to Komodo Airport", id: "Antar ke Bandara Komodo" } },
        ],
      },
    ],
    included: [...ALWAYS_INCLUDED, { en: "Phinisi cabin with AC, snorkel gear", id: "Kabin phinisi ber-AC, alat snorkeling" }, { en: "National park & ranger fees", id: "Biaya taman nasional & ranger" }],
    excluded: NOT_INCLUDED,
    hotels: [{ name: "Partner phinisi boat, AC cabin (or similar)", nights: 2, area: { en: "Komodo National Park", id: "Taman Nasional Komodo" } }],
    transport: [
      { en: "Phinisi boat with crew", id: "Kapal phinisi dengan kru" },
      { en: "Airport ↔ harbour transfer", id: "Antar-jemput bandara ↔ pelabuhan" },
    ],
    meetingPoint: { en: "Komodo Airport (LBJ), 09:00 WITA", id: "Bandara Komodo (LBJ), 09:00 WITA" },
    pricing: {
      openTripPerPax: 4_950_000, // PLACEHOLDER
      privateFrom: [ // PLACEHOLDER
        { pax: 2, perPax: 9_500_000 },
        { pax: 4, perPax: 7_200_000 },
        { pax: 6, perPax: 6_300_000 },
      ],
      childPolicy: { en: "Children 2–11 pay 75%, infants under 2 travel free.", id: "Anak 2–11 tahun bayar 75%, bayi di bawah 2 tahun gratis." },
    },
    departures: departures([3, 12, 24], 14),
    depositPercent: 30,
    fullPaymentDaysBefore: 14,
    idealFor: ["young", "couple", "solo"],
  },
  {
    slug: "bromo-ijen-3d2n",
    destination: "bromo-ijen",
    title: { en: "Bromo Sunrise & Ijen Blue Fire", id: "Sunrise Bromo & Blue Fire Ijen" },
    summary: {
      en: "Jeep to Penanjakan for the Bromo sunrise, then a night hike to Ijen's blue fire and turquoise crater lake.",
      id: "Naik jeep ke Penanjakan untuk sunrise Bromo, lalu pendakian malam ke api biru dan danau kawah Ijen.",
    },
    tripType: "both",
    durationDays: 3,
    durationNights: 2,
    timezone: "Asia/Jakarta",
    cover: "/images/bromo-sunrise.webp",
    gallery: ["/images/bromo-sunrise.webp", "/images/kawah-ijen.webp", "/images/bromo-crater.webp", "/images/merapi.webp", "/images/family-trip.webp"],
    highlights: [
      { en: "4×4 jeep to the Penanjakan viewpoint", id: "Jeep 4×4 ke viewpoint Penanjakan" },
      { en: "Walk across the Sea of Sand to Bromo's crater", id: "Menyeberangi Lautan Pasir ke kawah Bromo" },
      { en: "Ijen blue fire, a rare natural phenomenon", id: "Blue fire Ijen, fenomena alam langka" },
      { en: "Gas masks and headlamps provided", id: "Masker gas dan senter kepala disediakan" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "Surabaya to Bromo", id: "Surabaya ke Bromo" },
        items: [
          { time: "09:00", kind: "transport", title: { en: "Pickup in Surabaya (airport or station)", id: "Penjemputan di Surabaya (bandara atau stasiun)" }, location: "Surabaya" },
          { time: "13:30", kind: "checkin", title: { en: "Check in near Bromo", id: "Check-in dekat Bromo" }, location: "Cemoro Lawang" },
          { time: "16:00", endTime: "17:30", kind: "activity", title: { en: "Village walk & caldera rim at sunset", id: "Jalan-jalan desa & bibir kaldera saat sunset" } },
          { time: "19:00", kind: "free", title: { en: "Rest early, wake-up call at 02:30", id: "Istirahat lebih awal, dibangunkan 02:30" } },
        ],
        overnight: { en: "Cemoro Lawang", id: "Cemoro Lawang" },
      },
      {
        day: 2,
        title: { en: "Bromo sunrise", id: "Sunrise Bromo" },
        items: [
          { time: "03:00", kind: "transport", title: { en: "Jeep 4×4 to Penanjakan", id: "Jeep 4×4 ke Penanjakan" } },
          { time: "04:30", endTime: "06:00", kind: "activity", title: { en: "Sunrise at Penanjakan viewpoint", id: "Sunrise di viewpoint Penanjakan" }, location: "Penanjakan" },
          { time: "06:30", endTime: "08:30", kind: "activity", title: { en: "Sea of Sand & Bromo crater", id: "Lautan Pasir & kawah Bromo" } },
          { time: "10:00", kind: "checkout", title: { en: "Check out and drive to Banyuwangi", id: "Check-out dan berangkat ke Banyuwangi" } },
          { time: "16:30", kind: "checkin", title: { en: "Check in at Banyuwangi", id: "Check-in di Banyuwangi" }, location: "Banyuwangi" },
          { time: "18:00", kind: "free", title: { en: "Rest, wake-up call at 00:30", id: "Istirahat, dibangunkan 00:30" } },
        ],
        overnight: { en: "Banyuwangi", id: "Banyuwangi" },
      },
      {
        day: 3,
        title: { en: "Ijen blue fire", id: "Blue fire Ijen" },
        items: [
          { time: "01:00", kind: "transport", title: { en: "Drive to Paltuding trailhead", id: "Menuju pos Paltuding" } },
          { time: "02:00", endTime: "04:30", kind: "activity", title: { en: "Night hike & blue fire", id: "Pendakian malam & blue fire" }, detail: { en: "≈ 3 km uphill. Gas masks provided.", id: "± 3 km menanjak. Masker gas disediakan." }, location: "Kawah Ijen" },
          { time: "05:30", endTime: "07:00", kind: "photo", title: { en: "Sunrise over the turquoise crater lake", id: "Sunrise di danau kawah toska" } },
          { time: "10:00", kind: "checkout", title: { en: "Check out", id: "Check-out" } },
          { time: "11:00", kind: "transport", title: { en: "Drop-off at Banyuwangi airport, station or ferry", id: "Antar ke bandara, stasiun, atau pelabuhan Banyuwangi" } },
        ],
      },
    ],
    included: [...ALWAYS_INCLUDED, { en: "Jeep 4×4 at Bromo", id: "Jeep 4×4 di Bromo" }, { en: "Gas mask & headlamp at Ijen", id: "Masker gas & senter kepala di Ijen" }],
    excluded: NOT_INCLUDED,
    hotels: [
      { name: "Partner lodge, Cemoro Lawang (or similar)", nights: 1, area: { en: "Bromo", id: "Bromo" } },
      { name: "Partner hotel, Banyuwangi (or similar)", nights: 1, area: { en: "Banyuwangi", id: "Banyuwangi" } },
    ],
    transport: [
      { en: "Private AC car or minibus", id: "Mobil AC pribadi atau minibus" },
      { en: "Jeep 4×4 for Bromo", id: "Jeep 4×4 untuk Bromo" },
    ],
    meetingPoint: { en: "Surabaya Juanda Airport or Gubeng Station, 09:00 WIB", id: "Bandara Juanda atau Stasiun Gubeng Surabaya, 09:00 WIB" },
    pricing: {
      openTripPerPax: 2_650_000, // PLACEHOLDER
      privateFrom: [ // PLACEHOLDER
        { pax: 2, perPax: 4_300_000 },
        { pax: 4, perPax: 3_300_000 },
        { pax: 6, perPax: 2_900_000 },
      ],
      childPolicy: { en: "Recommended for ages 8+. Children 8–11 pay 75%.", id: "Disarankan usia 8+. Anak 8–11 tahun bayar 75%." },
    },
    departures: departures([7, 21]),
    depositPercent: 30,
    fullPaymentDaysBefore: 14,
    idealFor: ["young", "solo"],
  },
  {
    slug: "yogyakarta-heritage-3d2n",
    destination: "yogyakarta",
    title: { en: "Yogyakarta Heritage", id: "Yogyakarta Heritage" },
    summary: {
      en: "Borobudur, a jeep ride over Merapi's lava trail and a Prambanan sunset, with time for Malioboro.",
      id: "Borobudur, jeep di jalur lava Merapi, dan sunset di Prambanan, plus waktu bebas di Malioboro.",
    },
    tripType: "both",
    durationDays: 3,
    durationNights: 2,
    timezone: "Asia/Jakarta",
    cover: "/images/borobudur.webp",
    gallery: ["/images/borobudur.webp", "/images/merapi.webp", "/images/family-trip.webp", "/images/bromo-crater.webp", "/images/bali-rice-terraces.webp"],
    highlights: [
      { en: "Guided walk on Borobudur's terraces", id: "Tur berpemandu di teras Borobudur" },
      { en: "Merapi lava tour by jeep", id: "Lava tour Merapi dengan jeep" },
      { en: "Prambanan at sunset", id: "Prambanan saat matahari terbenam" },
      { en: "Family-friendly pace", id: "Ritme santai, ramah keluarga" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "Arrival & the old city", id: "Kedatangan & kota tua" },
        items: [
          { time: "10:00", kind: "transport", title: { en: "Pickup at YIA airport or Tugu station", id: "Penjemputan di Bandara YIA atau Stasiun Tugu" }, location: "Yogyakarta" },
          { time: "13:00", kind: "checkin", title: { en: "Check in at the partner hotel", id: "Check-in di hotel partner" } },
          { time: "15:00", endTime: "17:00", kind: "activity", title: { en: "Kraton & Taman Sari water castle", id: "Keraton & Taman Sari" } },
          { time: "18:00", kind: "free", title: { en: "Free evening at Malioboro", id: "Malam bebas di Malioboro" } },
        ],
        overnight: { en: "Yogyakarta", id: "Yogyakarta" },
      },
      {
        day: 2,
        title: { en: "Borobudur & Merapi", id: "Borobudur & Merapi" },
        items: [
          { time: "05:00", kind: "transport", title: { en: "Drive to Borobudur", id: "Berangkat ke Borobudur" } },
          { time: "06:30", endTime: "09:00", kind: "activity", title: { en: "Guided Borobudur visit", id: "Kunjungan Borobudur bersama pemandu" }, location: "Magelang" },
          { time: "12:00", endTime: "14:30", kind: "activity", title: { en: "Merapi lava tour by jeep", id: "Lava tour Merapi dengan jeep" }, location: "Kaliurang" },
          { time: "16:00", kind: "free", title: { en: "Rest at the hotel", id: "Istirahat di hotel" } },
        ],
        overnight: { en: "Yogyakarta", id: "Yogyakarta" },
      },
      {
        day: 3,
        title: { en: "Prambanan & departure", id: "Prambanan & kepulangan" },
        items: [
          { time: "09:00", kind: "checkout", title: { en: "Check out", id: "Check-out" } },
          { time: "10:00", endTime: "12:00", kind: "activity", title: { en: "Batik workshop", id: "Workshop membatik" } },
          { time: "15:30", endTime: "18:00", kind: "photo", title: { en: "Prambanan at sunset", id: "Prambanan saat sunset" }, location: "Prambanan" },
          { time: "18:30", kind: "transport", title: { en: "Drop-off at airport or station", id: "Antar ke bandara atau stasiun" } },
        ],
      },
    ],
    included: [...ALWAYS_INCLUDED, { en: "Merapi jeep", id: "Jeep Merapi" }, { en: "Batik workshop materials", id: "Bahan workshop batik" }],
    excluded: NOT_INCLUDED,
    hotels: [{ name: "Partner heritage hotel, city centre (or similar)", nights: 2, area: { en: "Yogyakarta", id: "Yogyakarta" } }],
    transport: [{ en: "Private AC car with driver", id: "Mobil AC pribadi dengan driver" }, { en: "Jeep for the lava tour", id: "Jeep untuk lava tour" }],
    meetingPoint: { en: "YIA Airport or Tugu Station, 10:00 WIB", id: "Bandara YIA atau Stasiun Tugu, 10:00 WIB" },
    pricing: {
      openTripPerPax: 2_350_000, // PLACEHOLDER
      privateFrom: [ // PLACEHOLDER
        { pax: 2, perPax: 3_900_000 },
        { pax: 4, perPax: 2_950_000 },
        { pax: 6, perPax: 2_600_000 },
      ],
      childPolicy: { en: "Children 2–11 pay 75%, infants under 2 travel free.", id: "Anak 2–11 tahun bayar 75%, bayi di bawah 2 tahun gratis." },
    },
    departures: departures([10, 26]),
    depositPercent: 30,
    fullPaymentDaysBefore: 14,
    idealFor: ["family", "young"],
  },
  {
    slug: "flores-wae-rebo-5d4n",
    destination: "flores",
    title: { en: "Flores Overland & Wae Rebo", id: "Overland Flores & Wae Rebo" },
    summary: {
      en: "Cross western Flores by road and spend a night inside a traditional Mbaru Niang house in Wae Rebo.",
      id: "Menyusuri Flores barat lewat darat dan menginap semalam di rumah adat Mbaru Niang di Wae Rebo.",
    },
    tripType: "both",
    durationDays: 5,
    durationNights: 4,
    timezone: "Asia/Makassar",
    cover: "/images/wae-rebo.webp",
    gallery: ["/images/wae-rebo.webp", "/images/wae-rebo-valley.webp", "/images/padar-island.webp", "/images/pink-beach.webp", "/images/family-trip.webp"],
    highlights: [
      { en: "Overnight in a Wae Rebo cone house", id: "Menginap di rumah kerucut Wae Rebo" },
      { en: "Welcome ceremony with the elders", id: "Upacara penyambutan bersama tetua adat" },
      { en: "Cancar spider-web rice fields", id: "Sawah jaring laba-laba Cancar" },
      { en: "Ends with a day in Labuan Bajo", id: "Ditutup dengan sehari di Labuan Bajo" },
    ],
    itinerary: [
      {
        day: 1,
        title: { en: "Labuan Bajo to Ruteng", id: "Labuan Bajo ke Ruteng" },
        items: [
          { time: "09:00", kind: "transport", title: { en: "Pickup at Komodo Airport", id: "Penjemputan di Bandara Komodo" } },
          { time: "13:00", endTime: "14:00", kind: "activity", title: { en: "Cancar spider-web rice fields", id: "Sawah jaring laba-laba Cancar" } },
          { time: "16:00", kind: "checkin", title: { en: "Check in at Ruteng", id: "Check-in di Ruteng" }, location: "Ruteng" },
        ],
        overnight: { en: "Ruteng", id: "Ruteng" },
      },
      {
        day: 2,
        title: { en: "Trek to Wae Rebo", id: "Trekking ke Wae Rebo" },
        items: [
          { time: "07:00", kind: "checkout", title: { en: "Check out & drive to Denge", id: "Check-out & menuju Denge" } },
          { time: "11:00", endTime: "14:00", kind: "activity", title: { en: "Trek through the rainforest", id: "Trekking melewati hutan hujan" }, detail: { en: "≈ 3 hours, moderate. Porters available.", id: "± 3 jam, sedang. Porter tersedia." } },
          { time: "14:30", kind: "activity", title: { en: "Welcome ceremony (Waelu')", id: "Upacara penyambutan (Waelu')" }, location: "Wae Rebo" },
          { time: "16:00", kind: "checkin", title: { en: "Settle into the Mbaru Niang", id: "Masuk ke Mbaru Niang" } },
        ],
        overnight: { en: "Wae Rebo traditional house", id: "Rumah adat Wae Rebo" },
      },
      {
        day: 3,
        title: { en: "Morning mist & back down", id: "Kabut pagi & turun" },
        items: [
          { time: "05:30", endTime: "07:00", kind: "photo", title: { en: "Mist over the village", id: "Kabut di atas desa" } },
          { time: "08:00", kind: "checkout", title: { en: "Farewell & trek down", id: "Pamit & trekking turun" } },
          { time: "13:00", kind: "transport", title: { en: "Drive back towards Labuan Bajo", id: "Kembali menuju Labuan Bajo" } },
          { time: "18:30", kind: "checkin", title: { en: "Check in at Labuan Bajo", id: "Check-in di Labuan Bajo" } },
        ],
        overnight: { en: "Labuan Bajo", id: "Labuan Bajo" },
      },
      {
        day: 4,
        title: { en: "Labuan Bajo day", id: "Hari di Labuan Bajo" },
        items: [
          { time: "08:00", endTime: "12:00", kind: "activity", title: { en: "Rangko Cave & beach", id: "Goa Rangko & pantai" } },
          { time: "13:00", kind: "free", title: { en: "Free afternoon", id: "Sore bebas" } },
          { time: "17:30", kind: "photo", title: { en: "Sunset at Bukit Sylvia", id: "Sunset di Bukit Sylvia" } },
        ],
        overnight: { en: "Labuan Bajo", id: "Labuan Bajo" },
      },
      {
        day: 5,
        title: { en: "Departure", id: "Kepulangan" },
        items: [
          { time: "09:00", kind: "checkout", title: { en: "Check out", id: "Check-out" } },
          { time: "09:30", kind: "transport", title: { en: "Transfer to Komodo Airport", id: "Antar ke Bandara Komodo" } },
        ],
      },
    ],
    included: [...ALWAYS_INCLUDED, { en: "Wae Rebo homestay & community fee", id: "Homestay & donasi komunitas Wae Rebo" }, { en: "Local trekking guide", id: "Pemandu trekking lokal" }],
    excluded: [...NOT_INCLUDED, { en: "Porter at Wae Rebo (optional)", id: "Porter di Wae Rebo (opsional)" }],
    hotels: [
      { name: "Partner hotel, Ruteng (or similar)", nights: 1, area: { en: "Ruteng", id: "Ruteng" } },
      { name: "Mbaru Niang homestay", nights: 1, area: { en: "Wae Rebo", id: "Wae Rebo" } },
      { name: "Partner hotel, Labuan Bajo (or similar)", nights: 2, area: { en: "Labuan Bajo", id: "Labuan Bajo" } },
    ],
    transport: [{ en: "Private AC car with driver for the whole overland route", id: "Mobil AC pribadi dengan driver selama rute darat" }],
    meetingPoint: { en: "Komodo Airport (LBJ), 09:00 WITA", id: "Bandara Komodo (LBJ), 09:00 WITA" },
    pricing: {
      openTripPerPax: 6_750_000, // PLACEHOLDER
      privateFrom: [ // PLACEHOLDER
        { pax: 2, perPax: 11_900_000 },
        { pax: 4, perPax: 8_900_000 },
        { pax: 6, perPax: 7_900_000 },
      ],
      childPolicy: { en: "Recommended for ages 7+. Children 7–11 pay 75%.", id: "Disarankan usia 7+. Anak 7–11 tahun bayar 75%." },
    },
    departures: departures([8]),
    depositPercent: 30,
    fullPaymentDaysBefore: 21,
    idealFor: ["solo", "young", "couple"],
  },
];

export function getPackage(slug: string): Package | undefined {
  return packages.find((p) => p.slug === slug);
}

export function startingPrice(p: Package): number {
  const prices = [p.pricing.openTripPerPax, ...(p.pricing.privateFrom ?? []).map((x) => x.perPax)].filter(
    (n): n is number => typeof n === "number",
  );
  return Math.min(...prices);
}
