@AGENTS.md

# CLAUDE.md — Elara Journeys website

> Read this whole file before writing code. It is the single source of truth for scope, decisions,
> assets and build order. When a decision here conflicts with your habits, follow this file.
> **Talk to the owner in Bahasa Indonesia** (casual is fine). Write code, comments and commit messages in English.

---

## 1. What we are building

**Elara Journeys** (PT. Elara Karsa Nusantara) is an Indonesian travel company selling **domestic trips
around Nusantara**, focused on hidden gems: Bali, Labuan Bajo / Komodo, Flores (Wae Rebo), Bromo–Ijen,
Yogyakarta (Borobudur, Merapi). Tagline: **"Unveiling the Hidden Wonders of Nusantara"**.

Business context comes from `docs/business-model-canvas.png`. Structural reference (what a mature
travel site contains) is `docs/blueprint-website-travel-tour.pdf`, a breakdown of goldenrama.com.
Use it for **structure only**. Never copy Golden Rama's text, design or images.

### Customer segments (design every page for these)
1. **Families**: safe, well-planned trips; itineraries that suit every age.
2. **Solo travelers & small groups**: flexible, personal, budget-aware.
3. **Couples & honeymooners**: romantic destinations, private trips.
4. **Young adults & students**: fun, flexible, affordable, Instagrammable.

### Value proposition
Clients only show up and enjoy the trip. Elara arranges **accommodation (partner hotels/villas),
transport (partner car/bus/boat), entrance tickets, guide and the full itinerary**.
**NOT included: meals and souvenirs (oleh-oleh)** or personal expenses. This rule must appear clearly
on every package page and in the booking summary.

### Revenue streams (drives UI priorities)
- Group & private trip sales (~50%): open trip (shared, fixed dates) and private trip (own group).
- Custom itinerary fee (~25%): tailor-made trips (see Feature 3).
- Booking & handling fee (~15%).
- Partner commission (~10%): hotels, transport, photographers.

### Payments (from the canvas)
Bank transfer, QRIS, e-wallet. **DP (down payment) + pelunasan (final payment)**. Transparent price
breakdown. Gateway: **Midtrans** (Snap) as the default; Xendit is an acceptable alternative.

---

## 2. Required features (from the owner, in priority order)

| # | Feature | Summary |
|---|---------|---------|
| F1 | Floating WhatsApp CTA | WhatsApp logo button, fixed **bottom-right**, on every public page |
| F2 | Detailed itinerary + online booking | Per package: Day 1…N, each with **timed activities** (e.g. 04:00 Jeep to Penanjakan). Book online with a DP |
| F3 | Custom package | A group requests a trip to any destination; Elara builds a tailor-made itinerary |
| F4 | Hotel + transport included | Partner hotels & transport are part of every package; everything except meals & souvenirs is handled |
| F5 | Trip tracker + reminders | Client sees their live itinerary schedule and gets a reminder before **each event** |
| F6 | Photographer & videographer add-on | Special client price; add during booking or for custom trips |

Acceptance criteria for each are in §8.

---

## 3. Tech stack (decided; do not swap without asking the owner)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16.4 (App Router)**, React 19.3, TypeScript | Server Components = minimal client JS; prerendered pages load fast on Indonesian mobile networks |
| Styling | **Tailwind CSS v4** + the owner's **shadcn/ui** components | Already provided in `src/components/ui` |
| Icons | `lucide-react` v1 for UI icons; brand logos from `src/components/icons/brand.tsx` | lucide v1 removed brand icons (WhatsApp/Instagram/TikTok/Facebook) |
| DB | **PostgreSQL** + **Drizzle ORM** (`drizzle-orm`, `postgres` driver, `drizzle-kit`) | Lightweight, no engine binary, serverless-friendly (Neon/Supabase/Vercel Postgres) |
| Validation | `zod` v4 | Server Action input validation |
| Payments | Midtrans Snap via plain `fetch` (no SDK) | Fewer dependencies |
| Email | Resend via plain `fetch` | Reminder & confirmation emails |
| Hosting | Vercel (recommended) + managed Postgres | |

**Already installed:** next, react, tailwind v4, drizzle-orm, postgres, zod, @radix-ui/react-accordion,
@radix-ui/react-slot, class-variance-authority, clsx, tailwind-merge, lucide-react, server-only; dev:
drizzle-kit, tsx. Do **not** add heavy libraries (moment, lodash, framer-motion, UI kits, i18n frameworks)
without a strong reason. Use `Intl.DateTimeFormat` / `Intl.NumberFormat` for dates and IDR.

### Performance rules ("tidak bikin ngelag")
- Default to **Server Components**. Add `"use client"` only for real interactivity (date picker, pax
  counter, language switch, accordion, live trip clock). Keep client components small and at the leaves.
- All images through `next/image` with `sizes` set. Only the hero uses `priority`. Photos are already WebP.
- Fonts via `next/font/google` (self-hosted, `display: swap`): **Cormorant Garamond** (display, matches
  the logo's classical serif) + **Inter** (body). Expose them as CSS vars `--font-display` and `--font-body`
  (already wired in `globals.css`).
- Marketing pages (home, packages, package detail, destinations, photography, FAQ) must be **prerendered**.
  Package content is static TypeScript data, not DB queries (see §6).
- No carousels that autoplay heavy media. Use CSS scroll-snap for sliders instead of a JS carousel library.
- Target: Lighthouse mobile Performance ≥ 90, LCP < 2.5 s, CLS < 0.1, first-load JS < 130 kB on the home page.

---

## 4. Next.js 16 rules (this version differs from older training data)

Read `node_modules/next/dist/docs/` before using an API you are unsure of. Key points:
- **`cacheComponents: true`** is on (see `next.config.ts`). Request-time data (`cookies()`, `headers()`,
  `searchParams`, DB queries, `Date.now()`, `crypto.randomUUID()`) must sit inside `<Suspense>` or behind
  `await connection()`. Cache shared data with `'use cache'` + `cacheLife(...)`. Docs: `01-app/01-getting-started/08-caching.md`.
- **Middleware is now `proxy.ts`** (`src/proxy.ts`, export `proxy`). Docs: `01-app/01-getting-started/16-proxy.md`.
- `params` / `searchParams` are **Promises**. Use the global `PageProps<'/[lang]/...'>` / `LayoutProps` types.
- i18n follows `01-app/02-guides/internationalization.md`: root segment `app/[lang]`, dictionaries,
  `generateStaticParams` on the root layout. Use `import { lang } from 'next/root-params'` in server code.
  `root-params` does **not** work in Client Components, Server Actions or Route Handlers, so pass `lang` explicitly there.
- `GET` Route Handlers are prerendered unless they read request data. Webhooks/cron are `POST`/read headers, so they are dynamic.

---

## 5. Internationalization

- **English is the default** (`/en/...`). **Bahasa Indonesia** at `/id/...`. Audience is Indonesian, so
  the Indonesian copy must sound natural (not machine-translated) and use "Anda" in a warm tone.
- `src/proxy.ts`: requests without a locale redirect to `/en` (or to the `NEXT_LOCALE` cookie value if set).
  Skip `/_next`, `/api`, `/admin`, `/images`, `/brand` and files with an extension.
- Dictionaries: `src/i18n/dictionaries/en.ts` and `id.ts`, typed so `id` must have every key `en` has
  (`satisfies Dictionary`). Server-only loader `getDictionary(lang)`.
- Bilingual data fields use `{ en: string; id: string }` (type `L10n`).
- Language switcher in the header keeps the same path (`/en/packages/x` → `/id/packages/x`) and sets the cookie.
- Prices are always IDR: `new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })`.
- Times are local destination time. Store the **IANA timezone** per itinerary item: Bali/Labuan Bajo/Flores =
  `Asia/Makassar` (WITA, UTC+8); Java = `Asia/Jakarta` (WIB, UTC+7). Show the abbreviation (WIB/WITA).
- Every page needs `<html lang>`, `hreflang` alternates (`en`, `id`, `x-default` → en) and localized metadata.

---

## 6. Architecture & folder structure (target)

```
src/
  proxy.ts                          # locale redirect
  app/
    icon.png, apple-icon.png        # favicon from the logo mark (done)
    globals.css                     # brand tokens (done)
    [lang]/
      layout.tsx                    # ROOT layout: <html lang>, fonts, Header, Footer, WhatsAppFab
      page.tsx                      # Home
      packages/page.tsx             # Listing + filters (destination, duration, trip type, price)
      packages/[slug]/page.tsx      # Detail: gallery, highlights, timed itinerary, included/excluded, departures, Book CTA
      packages/[slug]/book/page.tsx # Booking form (client form + server action)
      destinations/[slug]/page.tsx  # Bali, Labuan Bajo, Flores, Bromo–Ijen, Yogyakarta
      custom-trip/page.tsx          # F3 request form
      photography/page.tsx          # F6 service page
      my-trip/page.tsx              # F5 lookup (booking code + email)
      my-trip/[code]/page.tsx       # F5 live tracker (dynamic, in Suspense)
      booking/[code]/page.tsx       # Booking confirmation + payment status + "Pay DP" button
      about/page.tsx, faq/page.tsx, contact/page.tsx, terms/page.tsx, privacy/page.tsx
      not-found.tsx
    admin/                          # separate ROOT layout (English only), password-protected
      layout.tsx, login/page.tsx, page.tsx (dashboard), bookings/[code]/page.tsx, requests/page.tsx
    api/
      payments/midtrans/notify/route.ts  # Midtrans webhook (POST)
      trips/[code]/calendar.ics/route.ts # ICS feed with alarms (F5)
      cron/reminders/route.ts            # email reminders (F5), protected by CRON_SECRET
  components/
    ui/                             # owner's shadcn components (button, accordion, faqs-02, footer-column), keep API intact
    icons/brand.tsx                 # WhatsApp/Instagram/TikTok/Facebook/YouTube SVGs (done)
    site/                           # Header, LanguageSwitcher, Footer (adapt footer-column.tsx), WhatsAppFab, Hero, PackageCard, ItineraryTimeline, ...
  content/                          # STATIC, typed, bilingual: packages.ts, destinations.ts, addons.ts, faqs.ts, site.ts
  db/ schema.ts, index.ts, seed.ts  # Drizzle
  i18n/ config.ts, dictionaries/en.ts, dictionaries/id.ts, get-dictionary.ts
  lib/ utils.ts (owner's cn), format.ts, whatsapp.ts, ics.ts, midtrans.ts, email.ts, auth.ts
drizzle/                            # generated migrations
public/images/                      # optimized photos (done)
public/brand/                       # logo-full.png, logo-mark.png (done)
assets/                             # ORIGINAL source files, not served (keep, do not import)
docs/                               # business canvas, blueprint PDF, component demo
```

**Content vs. database split (important for speed):**
- `src/content/*.ts` holds packages, itineraries, destinations, add-ons and FAQs as typed constants. These
  pages prerender at build time. Editing a package = editing a TS file + redeploy. That is acceptable for v1.
- **PostgreSQL** holds only transactional data: bookings, travelers, payments, per-booking itinerary
  (copied from the package at booking time so admin can adjust it), custom-trip requests and reminder logs.
- Seat availability (remaining seats per departure) is read from the DB inside `<Suspense>` on the detail page.

---

## 7. Assets inventory (everything the owner supplied is in this repo)

### Brand (`public/brand/`)
| File | Use |
|------|-----|
| `logo-full.png` | Full logo (mark + "ELARA JOURNEYS" + tagline), transparent. Footer, about page, emails |
| `logo-mark.png` | "E" emblem only, transparent. Header (with "Elara Journeys" set in Cormorant), loading states |
| `src/app/icon.png`, `apple-icon.png` | Favicons generated from the mark |
| `assets/brand-source/logo-original.png` | Untouched original (white background) |

Brand colors (sampled from the logo, already in `globals.css`): navy-900 `#1B2E44`, navy-800 `#18324F`
(primary), navy-700 `#264768`, slate `#6685A1`, sky `#9AB3C9`, mist `#EAF0F6`, sand `#FAF8F4` (page background).
Style: calm, premium, airy. Generous whitespace, large serif headings, rounded-2xl cards, subtle shadows,
photography-led. WhatsApp green `#25D366` is used **only** on the WhatsApp button.

### Photos (`public/images/`, WebP, max 2000px; originals in `assets/original-photos/`)
| File | Subject | Suggested use |
|------|---------|---------------|
| `padar-island.webp` | Padar Island viewpoint, Komodo | **Home hero** (strongest image), Labuan Bajo package cover |
| `pink-beach.webp` | Pink Beach, Komodo | Labuan Bajo gallery, honeymoon section |
| `bali-rice-terraces.webp` | Bali rice terraces (Tegallalang-style) | Bali package cover, destination card |
| `ulun-danu.webp` | Pura Ulun Danu Beratan, Bali (small, 735px) | Bali gallery (small slots only) |
| `bali-villa.webp` | Clifftop villa with pool, East Bali | **"Partner hotels" section (F4)** |
| `bali-resort.webp` | Jungle resort with pool, Bali | F4 section / honeymoon |
| `bromo-sunrise.webp` | Mount Bromo framed by trees | Bromo–Ijen package cover |
| `bromo-crater.webp` | Bromo caldera (small, 739px) | Gallery small slot |
| `kawah-ijen.webp` | Ijen crater lake | Bromo–Ijen gallery |
| `borobudur.webp` | Borobudur temple (portrait) | Yogyakarta package cover (portrait slots) |
| `merapi.webp` | Mount Merapi landscape | Yogyakarta gallery |
| `wae-rebo.webp` | Wae Rebo village with visitors | Flores package cover |
| `wae-rebo-valley.webp` | Wae Rebo valley wide shot | Flores gallery, custom-trip page |
| `family-trip.webp` | Family looking over rice fields (panoramic 1000×366) | Family segment banner, custom-trip page |

All alt text must be bilingual (from content data). Ask the owner to confirm they hold usage rights for
each photo before launch, since some look like stock/agency images. Add a TODO in `src/content/site.ts`.

### Components (`src/components/ui/`, the owner's shadcn blocks)
- `button.tsx`, `accordion.tsx`: use everywhere (Book, CTAs, itinerary days, FAQ).
- `faqs-02.tsx`: FAQ section layout. **Refactor** to accept `{ title, intro, items, contact }` props from the
  dictionary/content. Replace the placeholder Blockus copy/emails with Elara content and the "Talk to a human"
  card linking to WhatsApp. Example usage kept in `docs/faqs-demo.example.tsx`.
- `footer-column.tsx`: footer layout. **Refactor** to take Elara data: logo, description, socials
  (brand icons were already switched to `brand.tsx` so the file compiles; the data object still holds
  placeholder Mvpblocks links/text that must be replaced), columns (Trips / Company / Help / Contact), and copyright with
  the current year. Use `next/image` for the logo.
- `@/lib/utils` → `cn()`.

---

## 8. Feature specs & acceptance criteria

### F1: Floating WhatsApp button
- `components/site/whatsapp-fab.tsx`: fixed `bottom-5 right-5` (respect `env(safe-area-inset-bottom)`),
  56px circle, `#25D366`, white WhatsApp logo, subtle shadow; an optional tooltip/label on desktop
  ("Chat with us" / "Chat dengan kami"); `aria-label` localized.
- Link: `https://wa.me/${NEXT_PUBLIC_WHATSAPP_NUMBER}?text=...` with a **context-aware prefilled message**:
  on a package page include package name + selected date; on custom-trip include "Custom trip"; else a greeting.
  Build it in `lib/whatsapp.ts`. It can be a server component reading props. The path-aware variant may be a tiny client component.
- Must not cover the mobile sticky "Book now" bar: on package detail on mobile, lift the FAB above the bar.
- ✅ Visible on all public pages, not on `/admin`; opens WhatsApp app on mobile and web.whatsapp on desktop.

### F2: Package detail, timed itinerary, online booking
Content type (in `src/content/packages.ts`):
```ts
type L10n = { en: string; id: string };
type ItineraryItem = { time: string /* "04:00" */; endTime?: string; title: L10n; detail?: L10n;
  location?: string; kind: 'transport'|'activity'|'checkin'|'checkout'|'free'|'photo'; };
type ItineraryDay = { day: number; title: L10n; items: ItineraryItem[]; overnight?: L10n };
type Package = { slug: string; destination: DestinationSlug; title: L10n; summary: L10n;
  tripType: 'open'|'private'|'both'; durationDays: number; durationNights: number; timezone: 'Asia/Jakarta'|'Asia/Makassar';
  cover: string; gallery: string[]; highlights: L10n[]; itinerary: ItineraryDay[];
  included: L10n[]; excluded: L10n[]; hotels: { name: string; nights: number; area: L10n }[];
  transport: L10n[]; meetingPoint: L10n;
  pricing: { openTripPerPax?: number; privateFrom?: { pax: number; perPax: number }[]; childPolicy: L10n };
  departures: { date: string /* ISO yyyy-mm-dd */; seats: number }[];  // open trip schedule
  depositPercent: number; /* e.g. 30 */ fullPaymentDaysBefore: number; /* e.g. 14 */ };
```
Detail page sections: breadcrumb → gallery (1 large + 4 small, mobile scroll-snap) → title, duration
("4D3N"), trip type badges, price "from" → highlights → **itinerary accordion** (`Accordion type="multiple"`,
"Expand all" button; each day lists time-stamped items as a vertical timeline with kind icons and WIB/WITA)
→ **Included / Not included** (two columns; "Meals & souvenirs not included" always listed) → partner
hotels & transport (F4) → photographer add-on teaser (F6) → departures & remaining seats (Suspense, DB)
→ FAQ → related packages. Sticky booking card on desktop; sticky bottom bar on mobile.

Booking flow (`/[lang]/packages/[slug]/book`):
1. Choose **Open trip** (pick a departure date) or **Private trip** (pick any date ≥ 7 days ahead).
2. Pax: adults, children (2–11), infants (<2). Price recalculated live; server recomputes (never trust client totals).
3. Add-ons: photographer / videographer / combo (F6), extra night, etc.
4. Lead traveler: full name, email, WhatsApp number, city. Other travelers: name + age group (ID number optional, can follow later).
5. Summary: subtotal, add-ons, handling fee, total, **DP now (depositPercent)**, balance + due date
   (`departure − fullPaymentDaysBefore`). If departure is sooner than that, require full payment. Checkbox: agree to Terms.
6. Server Action creates `booking` (status `pending_payment`), copies itinerary into `booking_itinerary_items`
   with absolute start timestamps, creates a Midtrans Snap transaction for the DP and redirects to
   `/[lang]/booking/[code]` with the Snap popup / redirect URL.
7. Webhook `/api/payments/midtrans/notify`: **verify `signature_key` = SHA512(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY)**,
   then update the payment and set booking to `confirmed` (DP) or `paid` (full). Idempotent.
8. Confirmation email + WhatsApp link with the booking code; "Track your trip" button → F5.
- If Midtrans keys are missing (dev), fall back to **manual bank transfer** instructions + status `awaiting_transfer` that admin confirms.
- Booking code format: `ELR-` + 6 uppercase alphanumerics (no 0/O/1/I).
- ✅ Itinerary shows times per day; a booking can be completed end-to-end in sandbox; totals match server.

### F3: Custom package
- Page `/[lang]/custom-trip`: explainer (how it works in 4 steps: Tell us → We design → You approve → We handle everything),
  examples, then a form: destination(s) (multi-select from destinations + free text "other"), date range or month,
  flexible dates toggle, group size (adults/children), group type (family / friends / couple / company / school),
  budget per person (ranges), hotel level (3★ / 4★ / 5★ / villa), interests (nature, culture, beach, adventure, food spots,
  photography), photographer/videographer wanted (F6), special needs, contact (name, email, WhatsApp).
- Server Action saves `custom_requests` (status `new`), shows success with a reference number, and offers a
  **"Continue on WhatsApp"** button with the summary prefilled.
- Admin can convert a request into a **private booking** with a hand-built itinerary (admin itinerary editor, §9).
  The client then tracks it like any booking (F5).
- ✅ Request stored, admin sees it, conversion produces a trackable booking.

### F4: Hotels & transport included
- Every package lists partner hotel(s) (or "or similar") with nights and area, and the transport (e.g. private
  AC car with driver, speedboat/phinisi, jeep 4x4).
- Home page section "Everything handled" (`bali-villa.webp` / `bali-resort.webp`): icons for Stay, Transport,
  Tickets, Guide, Itinerary, Photographer (optional) + a clear note: **"Meals & souvenirs are on you, so you can
  eat wherever you like."** / ID: "Makan & oleh-oleh tidak termasuk, jadi Anda bebas memilih tempat makan favorit."
- Optional partners strip (logos only after the owner confirms partnerships; do not invent partner names).

### F5: Trip tracker + reminders per event
- Access: `/[lang]/my-trip` form (booking code + email) → server verifies → sets a signed, httpOnly cookie
  (`HMAC(SESSION_SECRET)`) scoped to that booking → `/[lang]/my-trip/[code]`. No passwords needed.
- Tracker page (dynamic, wrapped in Suspense): trip header (status, dates, countdown to departure), payment
  status + "Pay balance" button, and a **vertical timeline of all itinerary items** with absolute date/time in the
  destination timezone. Live states: **Done / Now / Next / Upcoming**; "Next up in 35 min" banner. A small
  client component updates the clock every 30–60 s (no polling the server).
- Reminders (deliver in this order of reliability):
  1. **Add to calendar**: `/api/trips/[code]/calendar.ics` returns an iCalendar file with one `VEVENT` per item
     and `VALARM` triggers (−1 day for day start, −30 min for each event; −2 h for flights/pickups). Also per-day
     "Add to Google Calendar" links. This works on phones even when the site is closed.
  2. **Email reminders**: `/api/cron/reminders` (POST/GET with `Authorization: Bearer CRON_SECRET`) runs every
     ~15 min, finds items starting in the next window that have no `reminder_log` row, sends a Resend email
     (localized), logs it. Schedule with Vercel Cron (check the current plan's frequency limits) or an external
     cron (cron-job.org / GitHub Actions).
  3. **Browser notifications** while the tracker tab is open (Notification API, after the user opts in).
  4. WhatsApp: a "Remind me on WhatsApp" link for v1. Automated WhatsApp reminders need the WhatsApp Business
     API via a provider (v2, see §12).
- ✅ ICS imports into Google Calendar and iPhone Calendar with alarms; cron sends one email per event, never duplicates.

### F6: Photographer & videographer (special client price)
- Content `src/content/addons.ts`: Photographer (half day / full day), Videographer (full day, includes 1–2 min
  highlight reel), **Combo** (photo + video, best value). Show "special price for Elara clients" with a struck-through
  normal price. Deliverables (edited photos count, delivery time, Google Drive link), coverage area.
- `/[lang]/photography` page using `family-trip.webp`, `pink-beach.webp`, `padar-island.webp`; selectable in
  booking (per day) and in the custom-trip form. Items added to a booking appear in the tracker timeline (kind `photo`).
- **Prices are placeholders** until the owner confirms (see §13).

### Also required (from the blueprint)
- Home: hero (padar-island) with quick search (destination, month, trip type) → 3 value cards → featured packages →
  destinations grid → "Everything handled" (F4) → custom trip CTA (F3) → photography (F6) → how booking works
  (4 steps + payment logos: bank transfer, QRIS, e-wallet) → testimonials (**placeholder component, no fake reviews**;
  hide until real ones exist) → FAQ (faqs-02) → final CTA.
- Header: logo, Packages, Destinations, Custom Trip, Photography, My Trip, language switch (EN | ID), "Book" button.
  Mobile: sheet menu. Keep the header a server component; only the menu toggle and switcher are client components.
- Footer: adapted `footer-column.tsx`.
- Legal pages: Terms (booking, DP, balance, cancellation tiers, reschedule, force majeure), Privacy (UU PDP No. 27/2022).
  Write as **templates marked "Draft, to be reviewed"**; the owner must review with a lawyer.
- SEO: localized metadata, Open Graph images, `sitemap.ts`, `robots.ts`, JSON-LD (`TravelAgency`, `TouristTrip`,
  `BreadcrumbList`, `FAQPage`).

---

## 9. Admin panel (`/admin`, English only)

- Login with `ADMIN_PASSWORD` → signed httpOnly session cookie. Guard every admin page and server action
  (check in the action itself, not only in `proxy.ts`).
- Dashboard: counts (new requests, pending payments, upcoming departures this week).
- Bookings list (filter by status/date/package) → detail: travelers, payments, manual "mark transfer received",
  change status, **itinerary editor** (add/edit/delete/reorder items with date, time, timezone, title EN/ID, location, kind).
- Custom requests list → detail → "Convert to booking" (creates private booking + empty itinerary to fill).
- Departures: view seats sold per departure (seat quotas come from content; sold count from DB).
- Keep the admin UI plain and functional (tables + forms using the same shadcn components).

---

## 10. Database schema (Drizzle, `src/db/schema.ts`)

```
bookings(id uuid pk, code text unique, package_slug text null /* null for custom */, custom_request_id uuid null,
  trip_type enum(open,private,custom), departure_date date, lang enum(en,id),
  adults int, children int, infants int, addons jsonb, subtotal bigint, fees bigint, total bigint,
  deposit_amount bigint, balance_due_date date,
  status enum(pending_payment, awaiting_transfer, confirmed, paid, completed, cancelled, expired),
  lead_name, lead_email, lead_phone, lead_city, notes, created_at, updated_at)
travelers(id, booking_id fk, full_name, age_group enum(adult,child,infant), id_number null)
payments(id, booking_id fk, kind enum(deposit,balance,full), amount bigint, provider enum(midtrans,manual),
  provider_order_id unique, status enum(pending,paid,failed,expired,refunded), raw jsonb, paid_at, created_at)
booking_itinerary_items(id, booking_id fk, day int, starts_at timestamptz, ends_at timestamptz null,
  timezone text, title_en, title_id, detail_en, detail_id, location, kind, sort int)
custom_requests(id, ref text unique, destinations text[], other_destination, date_from, date_to, flexible bool,
  adults, children, group_type, budget_range, hotel_level, interests text[], wants_photo bool, wants_video bool,
  special_needs, name, email, phone, lang, status enum(new,contacted,quoted,converted,closed), created_at)
reminder_log(id, item_id fk, channel enum(email), sent_at, unique(item_id, channel))
```
Money is stored in **whole rupiah as bigint** (no floats). Scripts: `db:generate`, `db:migrate`, `db:seed`, `db:studio`.

---

## 11. Seed content (write real, specific copy; prices are placeholders)

Create these 5 packages in `src/content/packages.ts` with full timed itineraries in EN + ID:
1. `bali-hidden-gems-4d3n`: Bali, 4D3N, WITA: rice terraces, Ulun Danu Beratan, waterfalls, east Bali villa stay.
2. `labuan-bajo-komodo-3d2n`: Labuan Bajo, 3D2N, WITA: Padar sunrise (≈05:00), Pink Beach, Komodo, Manta Point; phinisi or speedboat.
3. `bromo-ijen-3d2n`: East Java, 3D2N, WIB: Bromo sunrise jeep (pickup ≈ 01:30–03:00), Ijen blue fire hike (start ≈ 01:00), gas masks provided.
4. `yogyakarta-heritage-3d2n`: Yogyakarta, 3D2N, WIB: Borobudur, Merapi lava tour jeep, Prambanan sunset.
5. `flores-wae-rebo-5d4n`: Flores, 5D4N, WITA: overland from Labuan Bajo, overnight stay in Wae Rebo traditional house.
Destinations: bali, labuan-bajo, flores, bromo-ijen, yogyakarta (each with cover, intro, best months, packages).
Generate open-trip departures for the next 6 months (2–4 per month). Mark all prices and seat counts `// PLACEHOLDER`.

---

## 12. Out of scope for v1 (do not build unless asked)
Flights/hotel search engines, multi-currency, user accounts with passwords, loyalty points, automated WhatsApp
Business API messages, native apps, blog CMS (a simple `/journal` with MDX can come later).

---

## 13. Open questions for the owner (ask before launch; use placeholders until answered)
- WhatsApp number, email, office address, Instagram/TikTok handles, NIB / business license number.
- Real package list, prices (open trip per pax, private trip tiers), seat quotas, child policy.
- DP % and balance deadline (default here: 30% DP, balance due H-14) and cancellation tiers.
- Photographer/videographer prices & deliverables.
- Partner hotels/transport names allowed to be shown publicly.
- Photo usage rights for every image in `public/images`.
- Midtrans account (sandbox → production) and Resend domain verification.

---

## 14. Commands

```bash
npm install
cp .env.example .env.local      # fill in values
npm run dev                     # http://localhost:3000 → redirects to /en
npm run build && npm start
npm run lint
# add these scripts when implementing the DB:
# "db:generate": "drizzle-kit generate", "db:migrate": "drizzle-kit migrate",
# "db:seed": "tsx src/db/seed.ts", "db:studio": "drizzle-kit studio"
```
Local Postgres quick start: `docker run -d --name elara-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=elarajourneys -p 5432:5432 postgres:16`.

---

## 15. Build order (tick as you go)

- [x] M0 Scaffold, brand tokens, optimized assets, favicons, owner components copied, brand icons
- [ ] M1 i18n skeleton: `proxy.ts`, `app/[lang]/layout.tsx` (fonts, metadata), dictionaries, header, footer (refactored), **WhatsApp FAB (F1)**; delete the scaffold `src/app/layout.tsx` + `page.tsx`
- [ ] M2 Content layer: types + 5 packages + destinations + add-ons + FAQs (EN/ID)
- [ ] M3 Home page, packages listing with filters, destination pages
- [ ] M4 Package detail with timed itinerary timeline, included/excluded, hotels/transport (F2, F4)
- [ ] M5 DB schema + migrations + seed; departures seat availability
- [ ] M6 Booking flow + Midtrans Snap + webhook + manual-transfer fallback + confirmation email (F2)
- [ ] M7 Custom trip form + WhatsApp handoff (F3); photography page + add-ons (F6)
- [ ] M8 My Trip tracker + ICS alarms + email reminder cron + browser notifications (F5)
- [ ] M9 Admin panel (bookings, payments, itinerary editor, requests → convert)
- [ ] M10 Legal pages (drafts), SEO (sitemap, robots, JSON-LD, OG), 404, error states
- [ ] M11 QA: `npm run build` clean, Lighthouse mobile ≥ 90, test both languages, test booking end-to-end in sandbox, keyboard & screen-reader pass

## 16. Working rules for Claude
- Run `npm run build` after each milestone and fix all type/lint errors before moving on.
- Never hardcode user-facing strings in components. Use the dictionaries / content `L10n` fields.
- Never trust client-side prices. Recompute on the server from `src/content`.
- Do not invent facts (partner names, reviews, licenses, awards). Use clearly marked placeholders.
- Keep `assets/` untouched; serve only from `public/`.
- Commit per milestone with clear messages.
