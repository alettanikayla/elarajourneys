import { getAddon } from "@/content/addons";
import type { Package } from "@/content/types";
import { site } from "@/content/site";
import { addDaysISO } from "./format";

export type BookingInput = {
  tripType: "open" | "private";
  date: string;
  adults: number;
  children: number;
  infants: number;
  addons: { id: string; days: number }[];
};

export type Quote = {
  perPax: number;
  adultsTotal: number;
  childrenTotal: number;
  addonsTotal: number;
  subtotal: number;
  handlingFee: number;
  total: number;
  deposit: number;
  balance: number;
  balanceDue: string;
  fullPaymentRequired: boolean;
};

/** Single source of truth for prices. In a real deployment this also runs on the server. */
export function quote(pkg: Package, input: BookingInput, todayISO: string): Quote {
  const payingPax = Math.max(1, input.adults + input.children);
  let perPax = pkg.pricing.openTripPerPax ?? 0;
  if (input.tripType === "private" && pkg.pricing.privateFrom?.length) {
    const tiers = [...pkg.pricing.privateFrom].sort((a, b) => b.pax - a.pax);
    const tier = tiers.find((t) => payingPax >= t.pax) ?? tiers[tiers.length - 1];
    perPax = tier.perPax;
  }
  const adultsTotal = perPax * input.adults;
  const childrenTotal = Math.round(perPax * site.childPriceFactor) * input.children;
  const addonsTotal = input.addons.reduce((sum, a) => sum + (getAddon(a.id)?.price ?? 0) * a.days, 0);
  const subtotal = adultsTotal + childrenTotal + addonsTotal;
  const handlingFee = Math.round((subtotal * site.handlingFeePercent) / 100);
  const total = subtotal + handlingFee;
  const balanceDue = input.date ? addDaysISO(input.date, -pkg.fullPaymentDaysBefore) : "";
  const fullPaymentRequired = !!balanceDue && balanceDue <= todayISO;
  const deposit = fullPaymentRequired ? total : Math.round((total * pkg.depositPercent) / 100);
  return { perPax, adultsTotal, childrenTotal, addonsTotal, subtotal, handlingFee, total, deposit, balance: total - deposit, balanceDue, fullPaymentRequired };
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

export function bookingCode(): string {
  let s = "ELR-";
  for (let i = 0; i < 6; i++) s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return s;
}
