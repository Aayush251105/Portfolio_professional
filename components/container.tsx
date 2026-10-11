/** 1200px content column with the same side padding in every section. */
export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-[1296px] px-6 md:px-12 ${className}`}>{children}</div>;
}
