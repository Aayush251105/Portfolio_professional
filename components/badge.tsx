/** Section heading style shared by every section (Contact's oversized heading is the one exception). */
export const sectionHeading = "text-[34px] leading-[1.15] font-normal tracking-[-0.025em] text-balance text-text lg:text-[44px]";

const tones = {
  accent: "bg-accent/10 text-accent-ink",
  neutral: "bg-text/[0.05] text-text dark:bg-text/[0.07]",
  success: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400",
} as const;

/** Small status / category label. One shape everywhere; the tone carries the meaning. */
export function Badge({ tone = "neutral", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 font-mono text-xs leading-4 font-medium uppercase tracking-wider ${tones[tone]}`}>
      {children}
    </span>
  );
}
