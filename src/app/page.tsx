// TEMPORARY placeholder. Replaced by src/app/[lang]/page.tsx (see CLAUDE.md §15, M1–M3).
import Image from "next/image";

export default function Page() {
  return (
    <main className="grid min-h-dvh place-items-center bg-sand px-6 text-center">
      <div className="flex flex-col items-center gap-6">
        <Image src="/brand/logo-full.png" alt="Elara Journeys" width={436} height={352} priority />
        <p className="text-muted-foreground">Website in progress. Open this project in VS Code with Claude Code and follow CLAUDE.md.</p>
      </div>
    </main>
  );
}
