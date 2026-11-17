import type { Destination, DestinationSlug } from "./types";

export const destinations: Destination[] = [
  {
    slug: "bali",
    name: "Bali",
    region: { en: "Bali", id: "Bali" },
    cover: "/images/bali-rice-terraces.webp",
    tagline: { en: "Beyond the beach clubs", id: "Lebih dari sekadar beach club" },
    intro: {
      en: "We skip the crowded strips and take you to the Bali locals love: misty lake temples in the highlands, quiet waterfalls, terraced valleys at golden hour and a clifftop villa in the slow-paced east.",
      id: "Kami melewati keramaian dan mengajak Anda ke Bali yang dicintai warga lokal: pura di tepi danau berkabut, air terjun yang tenang, sawah berundak saat golden hour, dan vila tebing di Bali timur yang santai.",
    },
    bestMonths: { en: "April – October (dry season)", id: "April – Oktober (musim kemarau)" },
    timezone: "Asia/Makassar",
    facts: [
      { en: "Flight from Jakarta ≈ 1 h 50 min", id: "Penerbangan dari Jakarta ± 1 jam 50 menit" },
      { en: "Time zone: WITA (UTC+8)", id: "Zona waktu: WITA (UTC+8)" },
      { en: "Great for families & honeymooners", id: "Cocok untuk keluarga & bulan madu" },
    ],
  },
  {
    slug: "labuan-bajo",
    name: "Labuan Bajo",
    region: { en: "East Nusa Tenggara", id: "Nusa Tenggara Timur" },
    cover: "/images/padar-island.webp",
    tagline: { en: "Dragons, pink sand and island sunrises", id: "Komodo, pasir merah muda, dan sunrise di pulau" },
    intro: {
      en: "Gateway to Komodo National Park. Sail between savanna islands, hike Padar for the most famous sunrise in Indonesia, swim with manta rays and meet the Komodo dragon with a ranger.",
      id: "Gerbang menuju Taman Nasional Komodo. Berlayar antar pulau sabana, mendaki Padar untuk sunrise paling terkenal di Indonesia, berenang bersama manta, dan bertemu komodo didampingi ranger.",
    },
    bestMonths: { en: "April – December", id: "April – Desember" },
    timezone: "Asia/Makassar",
    facts: [
      { en: "Direct flights from Jakarta & Bali", id: "Penerbangan langsung dari Jakarta & Bali" },
      { en: "Time zone: WITA (UTC+8)", id: "Zona waktu: WITA (UTC+8)" },
      { en: "UNESCO World Heritage Site", id: "Situs Warisan Dunia UNESCO" },
    ],
  },
  {
    slug: "flores",
    name: "Flores",
    region: { en: "East Nusa Tenggara", id: "Nusa Tenggara Timur" },
    cover: "/images/wae-rebo.webp",
    tagline: { en: "A village above the clouds", id: "Desa di atas awan" },
    intro: {
      en: "Wae Rebo is a Manggarai village of cone-shaped houses hidden in the mountains, reachable only on foot. Sleep inside a traditional Mbaru Niang with the community and wake up to mist rolling through the valley.",
      id: "Wae Rebo adalah desa adat Manggarai dengan rumah kerucut yang tersembunyi di pegunungan dan hanya bisa dicapai dengan berjalan kaki. Menginap di Mbaru Niang bersama warga dan bangun dengan kabut yang turun ke lembah.",
    },
    bestMonths: { en: "May – October", id: "Mei – Oktober" },
    timezone: "Asia/Makassar",
    facts: [
      { en: "Start from Labuan Bajo", id: "Berangkat dari Labuan Bajo" },
      { en: "≈ 3 h trek to the village", id: "± 3 jam trekking ke desa" },
      { en: "UNESCO Asia-Pacific heritage award", id: "Penghargaan warisan budaya UNESCO Asia-Pasifik" },
    ],
  },
  {
    slug: "bromo-ijen",
    name: "Bromo – Ijen",
    region: { en: "East Java", id: "Jawa Timur" },
    cover: "/images/bromo-sunrise.webp",
    tagline: { en: "Sunrise volcanoes and blue fire", id: "Gunung berapi saat sunrise dan api biru" },
    intro: {
      en: "Two of Java's most dramatic volcanoes in one trip. Watch the sun light up the Bromo caldera from Penanjakan, then hike Ijen at night to see its rare blue fire and turquoise crater lake.",
      id: "Dua gunung berapi paling dramatis di Jawa dalam satu perjalanan. Saksikan matahari menerangi kaldera Bromo dari Penanjakan, lalu mendaki Ijen di malam hari untuk melihat api biru langka dan danau kawah berwarna toska.",
    },
    bestMonths: { en: "May – October", id: "Mei – Oktober" },
    timezone: "Asia/Jakarta",
    facts: [
      { en: "Start from Surabaya or Malang", id: "Berangkat dari Surabaya atau Malang" },
      { en: "Time zone: WIB (UTC+7)", id: "Zona waktu: WIB (UTC+7)" },
      { en: "Gas masks provided at Ijen", id: "Masker gas disediakan di Ijen" },
    ],
  },
  {
    slug: "yogyakarta",
    name: "Yogyakarta",
    region: { en: "Special Region of Yogyakarta", id: "Daerah Istimewa Yogyakarta" },
    cover: "/images/borobudur.webp",
    tagline: { en: "Temples, lava trails and royal culture", id: "Candi, jejak lava, dan budaya keraton" },
    intro: {
      en: "The cultural heart of Java. Walk the terraces of Borobudur, ride a jeep across Merapi's lava fields and end the day at Prambanan as the sun sets behind its spires.",
      id: "Jantung budaya Jawa. Menyusuri teras Borobudur, naik jeep melintasi jalur lava Merapi, dan menutup hari di Prambanan saat matahari terbenam di balik candinya.",
    },
    bestMonths: { en: "All year (best April – October)", id: "Sepanjang tahun (terbaik April – Oktober)" },
    timezone: "Asia/Jakarta",
    facts: [
      { en: "Easy by train or plane from Jakarta", id: "Mudah dijangkau kereta atau pesawat dari Jakarta" },
      { en: "Time zone: WIB (UTC+7)", id: "Zona waktu: WIB (UTC+7)" },
      { en: "Two UNESCO World Heritage temples", id: "Dua candi Warisan Dunia UNESCO" },
    ],
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export const destinationSlugs = destinations.map((d) => d.slug) as DestinationSlug[];
