/** Mono section index, e.g. "01 — ABOUT", followed by a hairline that runs to the container edge. */
export function SectionLabel({ index, title, className = "" }: { index: number; title: string; className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="font-mono text-xs leading-4 font-semibold uppercase tracking-widest text-text">
        {String(index).padStart(2, "0")} — {title}
      </span>
      <div aria-hidden className="h-px flex-1 bg-border" />
    </div>
  );
}
