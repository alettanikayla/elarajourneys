import { cn } from "@/lib/utils";

export function Section({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, className, align = "left" }: { eyebrow?: string; title: string; intro?: string; className?: string; align?: "left" | "center" }) {
  return (
    <div className={cn("mb-10 flex max-w-2xl flex-col gap-3", align === "center" && "mx-auto items-center text-center", className)}>
      {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-brand">{eyebrow}</span>}
      <h2 className="text-balance text-4xl font-semibold leading-[1.05] text-navy-900 sm:text-5xl">{title}</h2>
      {intro && <p className="text-pretty text-muted-foreground sm:text-lg">{intro}</p>}
    </div>
  );
}

export function PageHero({ title, intro, image, eyebrow }: { title: string; intro?: string; image?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="relative isolate overflow-hidden bg-navy-900 text-white">
      {image && <div className="absolute inset-0 -z-10 opacity-45">{image}</div>}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-20 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-brand">{eyebrow}</p>}
        <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-[1.02] sm:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-pretty text-lg text-white/80">{intro}</p>}
      </div>
    </div>
  );
}
