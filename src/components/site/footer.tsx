import FooterColumn from "@/components/ui/footer-column";
import { packages } from "@/content/packages";
import { site } from "@/content/site";
import { t, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const year = await currentYear();
  return (
    <FooterColumn
      company={{ name: site.name, description: dict.footer.description, logo: "/brand/logo-full.png" }}
      socials={site.socials}
      columns={[
        {
          title: dict.footer.trips,
          links: packages.slice(0, 4).map((p) => ({ text: t(p.title, lang), href: `/${lang}/packages/${p.slug}` })),
        },
        {
          title: dict.footer.company,
          links: [
            { text: dict.nav.about, href: `/${lang}/about` },
            { text: dict.nav.photography, href: `/${lang}/photography` },
            { text: dict.nav.customTrip, href: `/${lang}/custom-trip` },
            { text: dict.nav.contact, href: `/${lang}/contact` },
          ],
        },
        {
          title: dict.footer.help,
          links: [
            { text: dict.nav.faq, href: `/${lang}/faq` },
            { text: dict.nav.myTrip, href: `/${lang}/my-trip` },
            { text: dict.legal.terms, href: `/${lang}/terms` },
            { text: dict.legal.privacy, href: `/${lang}/privacy` },
          ],
        },
      ]}
      contact={{ title: dict.footer.contact, email: site.email, phone: site.phoneDisplay, address: site.address }}
      copyright={{ year, legalName: site.legalName, rights: dict.footer.rights, note: dict.common.demoNote }}
    />
  );
}
