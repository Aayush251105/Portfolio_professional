/** External recognition (e.g. a placement), shown with the project. */
export function Award({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-2 text-sm leading-5 font-medium text-text">
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0V4zM7 6H4v1a3 3 0 003 3M17 6h3v1a3 3 0 01-3 3" />
      </svg>
      {text}
    </p>
  );
}
