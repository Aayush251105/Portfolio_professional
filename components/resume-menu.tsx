"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { site } from "@/content/site";

const GUTTER = 16; // min distance from the viewport edges
const GAP = 12; // between the trigger and the menu
const MENU_WIDTH = 300;
type Position = { top: number; left: number; width: number; above: boolean };

/** With a single distinct ready resume there is nothing to choose: the trigger links straight to it. */
const readyResumes = site.resumes.filter((r) => r.href);
const directHref = new Set(readyResumes.map((r) => r.href)).size === 1 ? readyResumes[0].href : null;

/**
 * Resume trigger that opens a liquid-glass menu to pick between resume variants (or, with only one
 * resume ready, links straight to its PDF).
 * `pill` is the hero's glass button; `link` is the underlined mono link used in About;
 * `inline` is a quiet "Resume ↗" text link (Contact) whose menu opens upward.
 * The menu is portalled to <body> with fixed positioning, so no section can paint over it, and it is
 * clamped to the viewport (flipping above/below the trigger to fit) so it never runs off a phone screen.
 */
export function ResumeMenu({ variant = "pill" }: { variant?: "pill" | "link" | "inline" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const [pos, setPos] = useState<Position | null>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const place = useCallback(() => {
    const button = buttonRef.current;
    const menu = menuRef.current;
    if (!button || !menu) return;
    const r = button.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const width = Math.min(MENU_WIDTH, vw - GUTTER * 2);
    const height = menu.offsetHeight;
    const preferred = variant === "pill" ? r.left : variant === "link" ? r.right - width : r.left + r.width / 2 - width / 2;
    const left = Math.min(Math.max(preferred, GUTTER), vw - GUTTER - width);
    const roomBelow = vh - r.bottom - GAP - GUTTER;
    const roomAbove = r.top - GAP - GUTTER;
    const above = variant === "inline" ? roomAbove >= height || roomAbove > roomBelow : roomBelow < height && roomAbove > roomBelow;
    setPos({ top: above ? r.top - GAP - height : r.bottom + GAP, left, width, above });
  }, [variant]);

  // Position before paint when opening, and follow the trigger while the page scrolls or resizes.
  useLayoutEffect(() => {
    if (!open) return;
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []);

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    items()[0]?.focus();
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!rootRef.current?.contains(t) && !menuRef.current?.contains(t)) close(false);
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

  const className = variant === "pill" ? pillClass(open) : variant === "link" ? linkClass : inlineClass;
  const content =
    variant === "inline" ? (
      <>
        <span>Resume</span>
        <span
          aria-hidden
          className="text-[9px] text-secondary/60 transition-[color,transform,filter] duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent group-hover:drop-shadow-[0_0_6px_var(--accent)]"
        >
          ↗
        </span>
        <span
          aria-hidden
          className={`absolute inset-x-0 bottom-0 h-px origin-left bg-accent transition-transform duration-300 ease-brand group-hover:scale-x-100 ${open ? "scale-x-100" : "scale-x-0"}`}
        />
      </>
    ) : variant === "pill" ? (
      <>
        <span>Resume</span>
        <svg className="h-3.5 w-3.5 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </>
    ) : (
      <>
        <span>Download resume</span>
        <span className="text-accent transition-transform duration-150 ease-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        <span className="absolute inset-x-0 -bottom-1 h-px bg-text transition-colors duration-150 ease-brand group-hover:bg-accent" />
      </>
    );

  // One real resume: skip the menu and open the PDF in one click.
  if (directHref) {
    return (
      <a href={directHref} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
        <span className="sr-only"> (PDF, opens in a new tab)</span>
      </a>
    );
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
        className={className}
      >
        {content}
      </button>

      {mounted &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label="Choose a resume"
            inert={!open}
            onKeyDown={onMenuKeyDown}
            style={pos ? { top: pos.top, left: pos.left, width: pos.width } : { top: -9999, left: 0, width: MENU_WIDTH }}
            className={`glass-liquid fixed z-[58] rounded-2xl p-2 transition-[opacity,transform] duration-200 ease-brand ${pos?.above ? "origin-bottom" : "origin-top"} ${
              open
                ? "translate-y-0 scale-100 opacity-100"
                : `pointer-events-none ${pos?.above ? "translate-y-1" : "-translate-y-1"} scale-[0.98] opacity-0 [backdrop-filter:none]` /* no blur pass while hidden */
            }`}
          >
            <div className="px-3 pt-2 pb-2.5 font-mono text-[10px] font-medium uppercase tracking-wider text-secondary">
              Choose a resume
            </div>
            <ul role="none" className="space-y-0.5">
              {site.resumes.map(({ label, note, href }) => {
                const ready = Boolean(href);
                const body = (
                  <>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-surface/60 text-secondary transition-colors duration-200 ease-brand group-hover:text-accent-ink group-focus-visible:text-accent-ink">
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
                      <span className="font-mono text-[10px] uppercase tracking-wider text-secondary transition-colors duration-200 ease-brand group-hover:text-accent-ink group-focus-visible:text-accent-ink">
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
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none transition-colors duration-200 ease-brand focus-visible:bg-text/[0.05] focus-visible:ring-1 focus-visible:ring-accent/60";
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
          </div>,
          document.body,
        )}
    </div>
  );
}

const pillClass = (open: boolean) =>
  `glass-pill inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-text transition-[background-color,border-color,transform] duration-200 ease-brand hover:border-text/30 hover:bg-surface active:scale-[0.98] ${
    open ? "border-text/30 bg-surface" : ""
  }`;

const linkClass =
  "group relative inline-flex items-center gap-1.5 font-mono text-[11px] leading-[14px] font-medium uppercase tracking-wider text-text transition-colors duration-150 ease-brand hover:text-accent-ink";

const inlineClass =
  "group relative inline-flex items-center gap-1 py-1 text-secondary outline-none transition-colors duration-200 ease-brand hover:text-accent-ink focus-visible:text-accent-ink";
