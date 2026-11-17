import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/section";
import { site } from "@/content/site";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { pageMeta } from "@/lib/metadata";
import { greetingMessage, whatsappLink } from "@/lib/whatsapp";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return pageMeta(lang, "/contact", dict.contact.title, dict.contact.intro);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const rows = [
    { icon: Mail, text: site.email },
    { icon: Phone, text: site.phoneDisplay },
    { icon: MapPin, text: site.address },
    { icon: Clock, text: dict.contact.hours },
  ];
  return (
    <Section className="max-w-3xl">
      <h1 className="text-5xl font-semibold text-navy-900 sm:text-6xl">{dict.contact.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{dict.contact.intro}</p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {rows.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 rounded-2xl bg-card p-5 text-sm text-navy-900 ring-1 ring-border"><Icon className="size-5 shrink-0 text-slate-brand" />{text}</li>
        ))}
      </ul>
      <Button asChild size="lg" className="mt-8 rounded-full bg-whatsapp text-white hover:bg-whatsapp/90">
        <a href={whatsappLink(greetingMessage(lang))} target="_blank" rel="noopener noreferrer"><WhatsAppIcon className="size-5" />{dict.faq.contactCta}</a>
      </Button>
    </Section>
  );
}
