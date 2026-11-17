import { ArrowRight, Clock, Mail, MessageCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export type Faqs02Props = {
  title: string;
  intro: string;
  items: { q: string; a: string }[];
  contact: { title: string; reply: string; cta: string; href: string; emailLabel: string; email: string };
};

export default function Faqs02({ title, intro, items, contact }: Faqs02Props) {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div className="lg:sticky lg:top-24 flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm shadow-black/5">
              FAQs
            </span>
            <h2
              className="text-balance font-semibold tracking-tight text-navy-900"
              style={{ fontSize: "clamp(2.1rem, 4vw, 3rem)", letterSpacing: "-0.01em", lineHeight: 1.05 }}
            >
              {title}
            </h2>
            <p className="text-sm text-muted-foreground">{intro}</p>

            <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground text-background">
                  <MessageCircle className="size-4" />
                </span>
                <div className="flex flex-col leading-tight">
                  <p className="text-sm font-medium text-foreground">{contact.title}</p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="mr-1.5 inline size-3" />
                    {contact.reply}
                  </p>
                </div>
              </div>
              <Button asChild size="sm" className="mt-2 w-full rounded-full">
                <a href={contact.href} target="_blank" rel="noopener noreferrer">
                  {contact.cta}
                  <ArrowRight />
                </a>
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                <Mail className="mr-1 inline size-3" />
                {contact.emailLabel}{" "}
                <a href={`mailto:${contact.email}`} className="font-medium text-foreground underline-offset-4 hover:underline">
                  {contact.email}
                </a>
              </p>
            </div>
          </div>

          <Accordion type="single" collapsible>
            {items.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
