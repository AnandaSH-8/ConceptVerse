type ChipProps = {
  children: React.ReactNode;
  className?: string;
};

export function Chip({ children, className = "" }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-200/90 ${className}`}
    >
      {children}
    </span>
  );
}
