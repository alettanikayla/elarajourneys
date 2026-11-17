import { Section } from "@/components/site/section";
import { t, type L10n, type Locale } from "@/i18n/config";

export function LegalPage({ title, draft, doc, lang }: { title: string; draft: string; doc: { heading: L10n; body: L10n }[]; lang: Locale }) {
  return (
    <Section className="max-w-3xl">
      <p className="mb-4 w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{draft}</p>
      <h1 className="text-5xl font-semibold text-navy-900">{title}</h1>
      <div className="mt-10 flex flex-col gap-8">
        {doc.map((s) => (
          <section key={s.heading.en}>
            <h2 className="text-2xl font-semibold text-navy-900">{t(s.heading, lang)}</h2>
            <p className="mt-2 leading-relaxed text-navy-800/80">{t(s.body, lang)}</p>
          </section>
        ))}
      </div>
    </Section>
  );
}
