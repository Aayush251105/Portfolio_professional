"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { site } from "@/content/site";
import { brandColor, TechIcon } from "./tech-icon";

const ease = [0.22, 1, 0.36, 1] as const;
const total = site.skills.categories.reduce((n, c) => n + c.items.length, 0);

/** "All technologies (N)" toggle that expands inline into icon + label chips grouped by category. */
export function AllTechnologies() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelId = useId();

  return (
    <div className="mt-6">
      <div className="flex justify-center">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="group relative flex items-center gap-1.5 py-1 font-mono text-[11px] leading-[14px] font-medium tracking-[0.06em] text-secondary transition-colors duration-200 ease-brand hover:text-text"
        >
          <span>All technologies ({total})</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-300 ease-brand ${open ? "rotate-180" : "group-hover:translate-y-0.5"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
          <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-text transition-transform duration-300 ease-brand group-hover:scale-x-100" />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-8 pt-10 pb-2 sm:grid-cols-2 lg:grid-cols-4">
              {site.skills.categories.map((category, ci) => (
                <motion.div
                  key={category.name}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.08 + ci * 0.05 }}
                >
                  <div className="mb-4 flex items-center gap-3 font-mono text-[11px] leading-[14px] font-medium uppercase tracking-wider text-secondary">
                    {category.name}
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {category.items.map((name) => (
                      <li
                        key={name}
                        style={{ "--brand": brandColor(name) } as React.CSSProperties}
                        className="group/chip inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-[13px] leading-4 text-text transition-[border-color,background-color,transform] duration-200 ease-brand hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface"
                      >
                        <TechIcon
                          name={name}
                          className="h-3.5 w-3.5 text-secondary transition-colors duration-200 ease-brand group-hover/chip:text-(--brand)"
                        />
                        {name}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
