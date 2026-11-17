import type { ItemKind } from "@/content/types";
import { addDaysISO, tzOffsetHours, type TripTimezone } from "./format";

export type TripDayInput = { day: number; title: string; items: { time: string; endTime?: string; title: string; detail?: string; location?: string; kind: ItemKind }[] };

export type TripEvent = {
  id: string;
  day: number;
  dayTitle: string;
  start: number; // epoch ms
  end: number;
  title: string;
  detail?: string;
  location?: string;
  kind: ItemKind;
  time: string;
};

/** Converts "HH:MM" on a local date in the destination timezone to epoch ms. */
function toEpoch(dateISO: string, time: string, tz: TripTimezone): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return Date.UTC(y, m - 1, d, hh - tzOffsetHours[tz], mm);
}

export function buildEvents(days: TripDayInput[], startDate: string, tz: TripTimezone, photoDays: number, photoLabel: string): TripEvent[] {
  const events: TripEvent[] = [];
  for (const day of days) {
    const date = addDaysISO(startDate, day.day - 1);
    const items = [...day.items];
    if (day.day <= photoDays) items.push({ time: "08:00", title: photoLabel, kind: "photo" });
    items.sort((a, b) => a.time.localeCompare(b.time));
    items.forEach((it, i) => {
      const start = toEpoch(date, it.time, tz);
      const next = items[i + 1];
      const end = it.endTime ? toEpoch(date, it.endTime, tz) : next ? Math.min(toEpoch(date, next.time, tz), start + 2 * 3600_000) : start + 60 * 60_000;
      events.push({ id: `d${day.day}-${i}`, day: day.day, dayTitle: day.title, start, end: Math.max(end, start + 15 * 60_000), title: it.title, detail: it.detail, location: it.location, kind: it.kind, time: it.time });
    });
  }
  return events;
}

export function todayInTz(now: number, tz: TripTimezone): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(now));
}

const icsDate = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/** iCalendar feed with alarms: −1 day for each day's first item, −30 min for every item, −2 h for transport. */
export function buildIcs(events: TripEvent[], tripName: string, code: string): string {
  const firstOfDay = new Set<string>();
  const seen = new Set<number>();
  for (const e of events) if (!seen.has(e.day)) { seen.add(e.day); firstOfDay.add(e.id); }
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Elara Journeys//Trip//EN", "CALSCALE:GREGORIAN", `X-WR-CALNAME:${esc(tripName)}`];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${code}-${e.id}@elarajourneys.com`,
      `DTSTAMP:${icsDate(e.start)}`,
      `DTSTART:${icsDate(e.start)}`,
      `DTEND:${icsDate(e.end)}`,
      `SUMMARY:${esc(e.title)}`,
      `DESCRIPTION:${esc(`${tripName} · ${code}${e.detail ? `\n${e.detail}` : ""}`)}`,
      ...(e.location ? [`LOCATION:${esc(e.location)}`] : []),
    );
    const alarms = ["-PT30M"];
    if (e.kind === "transport") alarms.push("-PT2H");
    if (firstOfDay.has(e.id)) alarms.push("-P1D");
    for (const a of alarms) lines.push("BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${esc(e.title)}`, `TRIGGER:${a}`, "END:VALARM");
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function googleCalendarDayLink(events: TripEvent[], tripName: string): string {
  const first = events[0];
  const last = events[events.length - 1];
  const details = events.map((e) => `${e.time} ${e.title}`).join("\n");
  const params = new URLSearchParams({ action: "TEMPLATE", text: `${tripName}: ${first.dayTitle}`, dates: `${icsDate(first.start)}/${icsDate(last.end)}`, details });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
