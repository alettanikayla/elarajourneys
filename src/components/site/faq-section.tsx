import Faqs02 from "@/components/ui/faqs-02";
import { faqs } from "@/content/faqs";
import { site } from "@/content/site";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { greetingMessage, whatsappLink } from "@/lib/whatsapp";

export function FaqSection({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <Faqs02
      title={dict.faq.title}
      intro={dict.faq.intro}
      items={faqs.map((f) => ({ q: t(f.q, lang), a: t(f.a, lang) }))}
      contact={{
        title: dict.faq.contactTitle,
        reply: dict.faq.contactReply,
        cta: dict.faq.contactCta,
        href: whatsappLink(greetingMessage(lang)),
        emailLabel: dict.faq.contactEmail,
        email: site.email,
      }}
    />
  );
}
