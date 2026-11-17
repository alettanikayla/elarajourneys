// DEMO data for the admin panel (school presentation). Names are fictional.
import type { DemoBooking, DemoRequest } from "@/lib/demo-store";

const q = (total: number, paidFull = false) => ({
  perPax: 0, adultsTotal: 0, childrenTotal: 0, addonsTotal: 0, subtotal: Math.round(total / 1.02), handlingFee: total - Math.round(total / 1.02), total,
  deposit: paidFull ? total : Math.round(total * 0.3), balance: paidFull ? 0 : total - Math.round(total * 0.3), balanceDue: "", fullPaymentRequired: paidFull,
});

const base = { lang: "id" as const, infants: 0, others: "", createdAt: "2026-11-10T09:00:00.000Z", addons: [] as { id: string; days: number }[] };

export const mockBookings: DemoBooking[] = [
  { ...base, code: "ELR-K7P2QM", packageSlug: "labuan-bajo-komodo-3d2n", tripType: "open", date: "2026-12-03", adults: 2, children: 0, lead: { name: "Rani Putri", email: "rani@example.com", phone: "081234500001", city: "Jakarta" }, quote: q(10_098_000), status: "confirmed", addons: [{ id: "photo-half", days: 1 }] },
  { ...base, code: "ELR-B4HN8X", packageSlug: "bali-hidden-gems-4d3n", tripType: "private", date: "2026-12-20", adults: 2, children: 2, lead: { name: "Keluarga Santoso", email: "santoso@example.com", phone: "081234500002", city: "Surabaya" }, quote: q(24_633_000), status: "pending_payment" },
  { ...base, code: "ELR-Y9TQ3D", packageSlug: "yogyakarta-heritage-3d2n", tripType: "open", date: "2026-12-10", adults: 4, children: 0, lead: { name: "Dimas Pratama", email: "dimas@example.com", phone: "081234500003", city: "Bandung" }, quote: q(9_588_000, true), status: "paid" },
  { ...base, code: "ELR-M2WR6F", packageSlug: "bromo-ijen-3d2n", tripType: "open", date: "2026-12-07", adults: 3, children: 0, lead: { name: "Nadia Kusuma", email: "nadia@example.com", phone: "081234500004", city: "Malang" }, quote: q(8_109_000), status: "confirmed" },
  { ...base, code: "ELR-F5JC7V", packageSlug: "flores-wae-rebo-5d4n", tripType: "open", date: "2027-01-08", adults: 2, children: 0, lead: { name: "Andre & Maya", email: "andre@example.com", phone: "081234500005", city: "Denpasar" }, quote: q(13_770_000), status: "pending_payment", addons: [{ id: "combo-full", days: 1 }] },
];

export const mockRequests: DemoRequest[] = [
  { ref: "REQ-8KD2P", destinations: ["bali", "labuan-bajo"], other: "", dateFrom: "2027-02-10", dateTo: "2027-02-16", flexible: false, adults: 2, children: 0, groupType: "couple", budget: "> Rp 10 jt", hotel: "Villa", interests: ["beach", "photography"], wantsPhoto: true, wantsVideo: true, specialNeeds: "Honeymoon, surprise dinner setup", name: "Kevin & Laras", email: "kevin@example.com", phone: "081234500010", lang: "id", status: "new", createdAt: "2026-11-15T08:00:00.000Z" },
  { ref: "REQ-3HT9W", destinations: ["yogyakarta"], other: "", dateFrom: "2027-03-02", dateTo: "2027-03-04", flexible: true, adults: 36, children: 0, groupType: "school", budget: "< Rp 3 jt", hotel: "3★", interests: ["culture"], wantsPhoto: false, wantsVideo: true, specialNeeds: "Study tour, 2 teachers", name: "SMA Harapan Bangsa", email: "osis@example.com", phone: "081234500011", lang: "id", status: "contacted", createdAt: "2026-11-12T08:00:00.000Z" },
  { ref: "REQ-6MV4R", destinations: ["bromo-ijen"], other: "Malang city tour", dateFrom: "2027-04-18", dateTo: "2027-04-21", flexible: false, adults: 28, children: 0, groupType: "company", budget: "Rp 3–6 jt", hotel: "4★", interests: ["nature", "adventure"], wantsPhoto: true, wantsVideo: false, specialNeeds: "", name: "PT Maju Bersama", email: "hr@example.com", phone: "081234500012", lang: "en", status: "quoted", createdAt: "2026-11-08T08:00:00.000Z" },
];
