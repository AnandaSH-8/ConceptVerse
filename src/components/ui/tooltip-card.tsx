import type { ReactNode } from "react";

type TooltipCardProps = {
  title: string;
  purpose: string;
  description: string;
  icon?: ReactNode;
};

export function TooltipCard({ title, purpose, description, icon }: TooltipCardProps) {
  return (
    <div className="w-64 rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] px-3 py-2.5 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--brand)]">{title}</p>
        {icon ? <span className="text-[var(--brand)]">{icon}</span> : null}
      </div>
      <p className="text-xs font-medium text-[var(--text)]">{purpose}</p>
      <p className="mt-1 text-[11px] leading-5 text-[var(--text-soft)]">{description}</p>
    </div>
  );
}
