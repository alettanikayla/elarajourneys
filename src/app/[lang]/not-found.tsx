import Link from "next/link";
import { lang as rootLang } from "next/root-params";
import { Button } from "@/components/ui/button";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function NotFound() {
  const raw = await rootLang();
  const lang = raw && hasLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(lang);
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="font-serif text-8xl font-semibold text-sky-brand">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-navy-900">{dict.notFound.title}</h1>
      <p className="mt-3 text-muted-foreground">{dict.notFound.text}</p>
      <Button asChild size="lg" className="mt-8 rounded-full"><Link href={`/${lang}`}>{dict.notFound.home}</Link></Button>
    </div>
  );
}
