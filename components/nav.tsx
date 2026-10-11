"use client";

import { useEffect, useRef, useState } from "react";
import { site, type NavId } from "@/content/site";
import { ThemeToggle } from "./theme-toggle";

/** Floating glass pill. Sits where the design places it (48px from top) and tucks up once you scroll. */
export function Nav() {
  const [active, setActive] = useState<NavId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Mobile menu: close on Escape or a tap outside.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const onPointer = (e: PointerEvent) => !navRef.current?.contains(e.target as Node) && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Scroll-spy: the section crossing the middle of the viewport is active.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as NavId);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    // Clear the active link over sections that have no nav link (hero, certifications).
    const unlinked = ["top", "certifications"].map((id) => document.getElementById(id));
    const heroObserver = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setActive(null), {
      rootMargin: "-50% 0px -50% 0px",
    });
    for (const el of unlinked) if (el) heroObserver.observe(el);
    for (const { id } of site.nav) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-transform duration-300 ease-brand md:top-12 md:px-6 ${
        scrolled ? "md:-translate-y-8" : ""
      }`}
    >
      {/* The menu panel is a sibling of the pill, not a child: a backdrop-filter element nested inside
          another one can only blur its parent's content, so the page behind would show through unblurred. */}
      <div ref={navRef} className="intro-down relative w-full max-w-[760px]">
        <nav
          aria-label="Primary"
          className="glass relative flex h-12 w-full items-center justify-between gap-4 rounded-full px-5 md:h-14 md:gap-12 md:px-6"
        >
          <a href="#top" aria-label={`${site.name}, back to top`} className="group flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-text transition-colors duration-200 ease-brand group-hover:text-accent">
              {site.monogram}
              <span className="text-accent">.</span>
            </span>
          </a>

          <ul className="hidden items-center gap-7 text-[13px] font-medium text-secondary md:flex">
            {site.nav.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  className={`group relative transition-colors duration-200 ease-brand hover:text-text ${
                    active === id ? "text-text" : ""
                  }`}
                >
                  {label}
                  <span
                    aria-hidden
                    className={`absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent transition-[opacity,transform] duration-200 ease-brand ${
                      active === id ? "scale-100 opacity-100" : "scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-40"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="h-4 w-px bg-border" />
            <ThemeToggle />
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="relative flex h-8 w-8 items-center justify-center rounded-full text-secondary transition-colors duration-200 ease-brand hover:text-text md:hidden"
            >
              {/* Two lines that rotate into an x */}
              <span
                className={`absolute h-px w-4 bg-current transition-transform duration-300 ease-brand ${menuOpen ? "rotate-45" : "-translate-y-[3px]"}`}
              />
              <span
                className={`absolute h-px w-4 bg-current transition-transform duration-300 ease-brand ${menuOpen ? "-rotate-45" : "translate-y-[3px]"}`}
              />
            </button>
          </div>
        </nav>

        {/* Mobile menu panel */}
        <div
          id="mobile-menu"
          inert={!menuOpen}
          className={`glass absolute inset-x-0 top-[calc(100%+8px)] origin-top rounded-3xl bg-[color-mix(in_srgb,var(--surface)_92%,transparent)]! p-2 transition-[opacity,transform] duration-300 ease-brand md:hidden ${
            menuOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0 [backdrop-filter:none]"
          }`}
        >
          <ul className="flex flex-col">
            {site.nav.map(({ id, label }, i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === id ? "location" : undefined}
                  style={{ transitionDelay: menuOpen ? `${60 + i * 30}ms` : "0ms" }}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium transition-[opacity,transform,color,background-color] duration-300 ease-brand hover:bg-text/[0.04] ${
                    active === id ? "text-text" : "text-secondary"
                  } ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"}`}
                >
                  {label}
                  <span className={`h-1.5 w-1.5 rounded-full bg-accent transition-opacity ${active === id ? "opacity-100" : "opacity-0"}`} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
