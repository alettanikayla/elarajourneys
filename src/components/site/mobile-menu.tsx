"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = { href: string; label: string };

export function MobileMenu({ items, menuLabel, closeLabel, cta }: { items: NavItem[]; menuLabel: string; closeLabel: string; cta: NavItem }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the sheet after navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button variant="ghost" size="icon" aria-label={menuLabel} aria-expanded={open} onClick={() => setOpen(true)}>
        <Menu className="size-6" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50">
          <button aria-label={closeLabel} className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <nav className="absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col gap-1 bg-sand p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] shadow-2xl">
            <Button variant="ghost" size="icon" aria-label={closeLabel} className="self-end" onClick={() => setOpen(false)}>
              <X className="size-6" />
            </Button>
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl px-3 py-3 font-serif text-2xl text-navy-900 hover:bg-mist">
                {item.label}
              </Link>
            ))}
            <Button asChild size="lg" className="mt-6 rounded-full">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
}
