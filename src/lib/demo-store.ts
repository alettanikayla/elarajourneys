"use client";

// DEMO ONLY: this project is a school presentation, so bookings and custom-trip requests are stored
// in the visitor's browser (localStorage) instead of PostgreSQL. See CLAUDE.md §10 for the real schema.
import { useSyncExternalStore } from "react";
import type { BookingInput, Quote } from "./pricing";

export type DemoBooking = BookingInput & {
  code: string;
  packageSlug: string;
  lang: "en" | "id";
  lead: { name: string; email: string; phone: string; city: string };
  others: string;
  quote: Quote;
  status: "pending_payment" | "confirmed" | "paid";
  paymentMethod?: string;
  createdAt: string;
};

export type DemoRequest = {
  ref: string;
  destinations: string[];
  other: string;
  dateFrom: string;
  dateTo: string;
  flexible: boolean;
  adults: number;
  children: number;
  groupType: string;
  budget: string;
  hotel: string;
  interests: string[];
  wantsPhoto: boolean;
  wantsVideo: boolean;
  specialNeeds: string;
  name: string;
  email: string;
  phone: string;
  lang: "en" | "id";
  status: "new" | "contacted" | "quoted" | "converted" | "closed";
  createdAt: string;
};

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode): the demo still works for the current page */
  }
}

const BOOKINGS = "elara:bookings";
const REQUESTS = "elara:requests";

export const demoStore = {
  bookings: () => read<DemoBooking>(BOOKINGS),
  booking: (code: string) => read<DemoBooking>(BOOKINGS).find((b) => b.code === code.trim().toUpperCase()),
  saveBooking(b: DemoBooking) {
    write(BOOKINGS, [b, ...read<DemoBooking>(BOOKINGS).filter((x) => x.code !== b.code)]);
  },
  updateBooking(code: string, patch: Partial<DemoBooking>) {
    write(BOOKINGS, read<DemoBooking>(BOOKINGS).map((b) => (b.code === code ? { ...b, ...patch } : b)));
  },
  requests: () => read<DemoRequest>(REQUESTS),
  saveRequest(r: DemoRequest) {
    write(REQUESTS, [r, ...read<DemoRequest>(REQUESTS)]);
  },
  updateRequest(ref: string, patch: Partial<DemoRequest>) {
    write(REQUESTS, read<DemoRequest>(REQUESTS).map((r) => (r.ref === ref ? { ...r, ...patch } : r)));
  },
};

/** Demo trip used in presentations: always "in progress" relative to the viewer's clock. */
export const DEMO_TRIP = { code: "ELR-BAL4K7", email: "demo@elarajourneys.com" };

const noopSubscribe = () => () => {};

/** Today's date on the client; "" during server prerender (avoids hydration mismatches). */
export function useToday(): string {
  return useSyncExternalStore(noopSubscribe, todayISO, () => "");
}

/** True once mounted on the client, so localStorage can be read safely. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

let nowCache = 0;
function subscribeNow(cb: () => void) {
  nowCache = Date.now();
  const id = setInterval(() => {
    nowCache = Date.now();
    cb();
  }, 30_000);
  return () => clearInterval(id);
}

/** Current time in ms, refreshed every 30 s on the client; 0 during prerender. */
export function useNow(): number {
  return useSyncExternalStore(subscribeNow, () => nowCache || (nowCache = Date.now()), () => 0);
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
