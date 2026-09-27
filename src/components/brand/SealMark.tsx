interface SealMarkProps {
  className?: string;
}

export function SealMark({ className = '' }: SealMarkProps) {
  return (
    <span className={`relative inline-block size-8 shrink-0 rounded-full border border-dashed border-persimmon-seal text-charcoal-ink ${className}`} aria-hidden="true">
      <span className="absolute inset-1 rounded-full border border-[#d7cfc4]" />
      <span className="absolute top-1/2 left-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
      <span className="absolute top-1/2 left-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-90 bg-current" />
      <span className="absolute top-1/2 left-1/2 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-persimmon-seal" />
    </span>
  );
}
