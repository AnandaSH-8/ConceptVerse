import { Search, Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/ui/theme-toggle";

type TopNavProps = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

export function TopNav({ theme, onToggleTheme }: TopNavProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--panel-strong)]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] via-[var(--brand-strong)] to-[var(--secondary)] shadow-[0_12px_30px_rgba(255,122,0,0.34)]">
            <Sparkles className="h-4 w-4 text-[var(--button-text)]" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-[var(--text)]">ConceptVerse</p>
          </div>
        </div>

        <div className="hidden w-full max-w-md items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-2.5 text-sm text-[var(--text-soft)] shadow-inner shadow-[var(--shadow-soft)] md:flex">
          <Search className="h-4 w-4 text-[var(--text-soft)]" />
          <input
            aria-label="Search concept chapters"
            className="w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-soft)]/70 focus:outline-none"
            placeholder="Search concepts"
          />
        </div>

        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
