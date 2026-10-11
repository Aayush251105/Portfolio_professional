"use client";

import { useEffect, useState } from "react";
import { site, type NavId } from "@/content/site";
import { ThemeToggle } from "./theme-toggle";

/** Floating glass pill. Sits where the design places it (48px from top) and tucks up once you scroll. */
export function Nav() {
  const [active, setActive] = useState<NavId | null>(null);
  const [scrolled, setScrolled] = useState(false);

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
    // Clear the active link while the hero is in view.
    const hero = document.getElementById("top");
    const heroObserver = new IntersectionObserver(([entry]) => entry.isIntersecting && setActive(null), {
      rootMargin: "-50% 0px -50% 0px",
    });
    if (hero) heroObserver.observe(hero);
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
      className={`fixed inset-x-0 top-12 z-50 flex justify-center px-6 transition-transform duration-300 ease-brand ${
        scrolled ? "-translate-y-8" : ""
      }`}
    >
      <nav
        aria-label="Primary"
        className="glass flex h-14 w-full max-w-[760px] items-center justify-between gap-12 rounded-full px-6"
      >
        <a href="#top" aria-label={`${site.name}, back to top`} className="group flex items-center gap-2">
          <span className="text-base font-semibold tracking-tight text-text transition-colors duration-200 ease-brand group-hover:text-accent">
            {site.monogram}
            <span className="text-accent">.</span>
          </span>
        </a>

        <ul className="flex items-center gap-7 text-[13px] font-medium text-secondary">
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
        </div>
      </nav>
    </header>
  );
}
