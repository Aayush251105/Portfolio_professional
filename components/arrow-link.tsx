/**
 * Mono uppercase text link with a "↗" arrow. On hover/focus the label and arrow turn accent,
 * the arrow nudges up-right with a soft glow, and a hairline underline draws in from the left.
 */
export function ArrowLink({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group relative inline-flex items-center gap-1 py-1 outline-none transition-colors duration-200 ease-brand hover:text-accent-ink focus-visible:text-accent-ink ${className}`}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="text-[9px] text-secondary/60 transition-[color,transform,filter] duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent group-hover:drop-shadow-[0_0_6px_var(--accent)] group-focus-visible:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:text-accent"
      >
        ↗
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-brand group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </a>
  );
}
