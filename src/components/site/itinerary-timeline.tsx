"use client";

import { useState } from "react";
import { BedDouble, Camera, Car, Coffee, LogIn, LogOut, Mountain, type LucideIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { ItemKind } from "@/content/types";

export const kindIcons: Record<ItemKind, LucideIcon> = {
  transport: Car,
  activity: Mountain,
  checkin: LogIn,
  checkout: LogOut,
  free: Coffee,
  photo: Camera,
};

export type TimelineDay = {
  day: number;
  title: string;
  overnight?: string;
  items: { time: string; endTime?: string; title: string; detail?: string; location?: string; kind: ItemKind }[];
};

type Labels = { day: string; expandAll: string; collapseAll: string; overnight: string; kinds: Record<ItemKind, string> };

export function ItineraryTimeline({ days, tz, labels }: { days: TimelineDay[]; tz: string; labels: Labels }) {
  const all = days.map((d) => `day-${d.day}`);
  const [open, setOpen] = useState<string[]>(["day-1"]);
  const allOpen = open.length === all.length;

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <Button variant="link" size="sm" className="px-0" onClick={() => setOpen(allOpen ? [] : all)}>
          {allOpen ? labels.collapseAll : labels.expandAll}
        </Button>
      </div>
      <Accordion type="multiple" value={open} onValueChange={setOpen} className="rounded-2xl border border-border bg-card px-5">
        {days.map((d) => (
          <AccordionItem key={d.day} value={`day-${d.day}`} className="last:border-b-0">
            <AccordionTrigger className="gap-4 text-left hover:no-underline">
              <span className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-navy-800 text-center text-[10px] font-semibold uppercase leading-tight text-white">
                  {labels.day}
                  <br />
                  <span className="text-base">{d.day}</span>
                </span>
                <span className="font-serif text-xl font-semibold text-navy-900 sm:text-2xl">{d.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="relative ml-5 border-l border-dashed border-sky-brand pl-6">
                {d.items.map((item, i) => {
                  const Icon = kindIcons[item.kind];
                  return (
                    <li key={i} className="relative pb-5 last:pb-1">
                      <span className="absolute -left-[37px] grid size-6 place-items-center rounded-full border border-sky-brand bg-sand text-navy-800">
                        <Icon className="size-3.5" />
                      </span>
                      <p className="text-xs font-semibold tabular-nums text-slate-brand">
                        {item.time}
                        {item.endTime && `–${item.endTime}`} {tz}
                        <span className="ml-2 rounded-full bg-mist px-2 py-0.5 font-medium text-navy-800">{labels.kinds[item.kind]}</span>
                      </p>
                      <p className="mt-1 font-medium text-navy-900">{item.title}</p>
                      {item.detail && <p className="text-sm text-muted-foreground">{item.detail}</p>}
                      {item.location && <p className="text-xs text-muted-foreground">📍 {item.location}</p>}
                    </li>
                  );
                })}
              </ol>
              {d.overnight && (
                <p className="ml-5 mt-2 inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-xs font-medium text-navy-800">
                  <BedDouble className="size-3.5" /> {labels.overnight}: {d.overnight}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
