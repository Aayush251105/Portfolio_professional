"use client";

import { useEffect, useId, useRef, useState } from "react";
import { site } from "@/content/site";

/** Hero "Resume" button: opens a liquid-glass menu to pick between resume variants. */
export function ResumeMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []);

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    items()[0]?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  function onMenuKeyDown(e: React.KeyboardEvent) {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") close();
    else if (e.key === "Tab") close(false);
    else if (e.key === "ArrowDown") list[(i + 1) % list.length]?.focus();
    else if (e.key === "ArrowUp") list[(i - 1 + list.length) % list.length]?.focus();
    else if (e.key === "Home") list[0]?.focus();
    else if (e.key === "End") list[list.length - 1]?.focus();
    else return;
    if (e.key !== "Tab") e.preventDefault();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`glass-pill inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-text transition-[background-color,border-color,transform] duration-200 ease-brand hover:border-text/30 hover:bg-surface active:scale-[0.98] ${
          open ? "border-text/30 bg-surface" : ""
        }`}
      >
        <span>Resume</span>
        <svg className="h-3.5 w-3.5 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </button>

      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label="Choose a resume"
        inert={!open}
        onKeyDown={onMenuKeyDown}
        className={`glass-liquid absolute top-[calc(100%+12px)] left-0 z-50 w-[300px] origin-top-left rounded-2xl p-2 transition-[opacity,transform] duration-200 ease-brand ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
        }`}
      >
        <div className="px-3 pt-2 pb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-secondary">
          Choose a resume
        </div>
        <ul className="space-y-0.5">
          {site.resumes.map(({ label, note, href }) => {
            const ready = Boolean(href);
            const body = (
              <>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-surface/60 text-secondary transition-colors duration-200 ease-brand group-hover:text-accent group-focus-visible:text-accent">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium tracking-tight text-text">{label}</span>
                  <span className="block truncate text-xs text-secondary">{note}</span>
                </span>
                {ready ? (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-secondary transition-colors duration-200 ease-brand group-hover:text-accent group-focus-visible:text-accent">
                    PDF ↗
                  </span>
                ) : (
                  <span className="rounded border border-border/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-secondary">
                    Soon
                  </span>
                )}
              </>
            );
            const itemClass =
              "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors duration-200 ease-brand focus-visible:bg-text/[0.05]";
            return (
              <li key={label} role="none">
                {ready ? (
                  <a
                    role="menuitem"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => close(false)}
                    className={`${itemClass} hover:bg-text/[0.05]`}
                  >
                    {body}
                  </a>
                ) : (
                  <div role="menuitem" aria-disabled tabIndex={-1} className={`${itemClass} cursor-not-allowed opacity-60`}>
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
