interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <header className="py-7">
      <p className="mb-2.5 font-mono text-[.63rem] tracking-[.08em] text-[#81796f] uppercase">{eyebrow}</p>
      <h1 className="m-0 font-display text-[2.7rem] leading-[.98] font-normal">{title}</h1>
      <p className="max-w-[34ch] font-display leading-[1.55] text-faded-ink">{description}</p>
    </header>
  );
}
