import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// lucide-react v1 has no brand icons; use local SVGs instead.
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from '@/components/icons/brand';

export type FooterLink = { text: string; href: string };

export type FooterColumnProps = {
  company: { name: string; description: string; logo: string };
  socials: { instagram: string; tiktok: string; facebook: string; youtube: string };
  columns: { title: string; links: FooterLink[] }[];
  contact: { title: string; email: string; phone: string; address: string };
  copyright: { year: number; legalName: string; rights: string; note?: string };
};

export default function FooterColumn({ company, socials, columns, contact, copyright }: FooterColumnProps) {
  const socialLinks = [
    { icon: InstagramIcon, label: 'Instagram', href: socials.instagram },
    { icon: TikTokIcon, label: 'TikTok', href: socials.tiktok },
    { icon: FacebookIcon, label: 'Facebook', href: socials.facebook },
    { icon: YouTubeIcon, label: 'YouTube', href: socials.youtube },
  ];
  const contactInfo = [
    { icon: Mail, text: contact.email, href: `mailto:${contact.email}` },
    { icon: Phone, text: contact.phone, href: undefined },
    { icon: MapPin, text: contact.address, href: undefined, isAddress: true },
  ];

  return (
    <footer className="bg-navy-900 mt-24 w-full text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-28 sm:px-6 lg:px-8 lg:pt-20 lg:pb-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div>
            <div className="flex justify-center sm:justify-start">
              <Image src={company.logo} alt={company.name} width={180} height={145} className="h-auto w-36 brightness-0 invert" />
            </div>
            <p className="mt-6 max-w-md text-center leading-relaxed text-white/70 sm:max-w-xs sm:text-left">{company.description}</p>
            <ul className="mt-8 flex justify-center gap-6 sm:justify-start">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-white/80 transition hover:text-white">
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-2">
            {columns.map((col) => (
              <div key={col.title} className="text-left">
                <p className="font-serif text-xl font-medium">{col.title}</p>
                <ul className="mt-6 space-y-3 text-sm">
                  {col.links.map(({ text, href }) => (
                    <li key={href}>
                      <Link className="text-white/70 transition hover:text-white" href={href}>
                        {text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 text-left md:col-span-1">
              <p className="font-serif text-xl font-medium">{contact.title}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {contactInfo.map(({ icon: Icon, text, href, isAddress }) => (
                  <li key={text} className="flex items-start gap-2">
                    <Icon className="mt-0.5 size-4 shrink-0 text-sky-brand" />
                    {isAddress ? (
                      <address className="not-italic text-white/70">{text}</address>
                    ) : href ? (
                      <a href={href} className="break-all text-white/70 hover:text-white">{text}</a>
                    ) : (
                      <span className="text-white/70">{text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/60">
          <div className="flex flex-col gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
            <p>
              &copy; {copyright.year} {copyright.legalName}. {copyright.rights}
            </p>
            {copyright.note && <p>{copyright.note}</p>}
          </div>
        </div>
      </div>
    </footer>
  );
}
