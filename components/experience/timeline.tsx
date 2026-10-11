"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";
import { useRef } from "react";
import type { ExperienceEntry } from "@/content/site";
import { Reveal } from "../reveal";

/**
 * Vertical timeline. A hairline track with an accent fill that grows with scroll (scaleY only),
 * latest entry has a filled node, the rest are outlined and light up on hover.
 */
export function Timeline({ entries }: { entries: readonly ExperienceEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // 0 when the timeline's top reaches 70% of the viewport, 1 when its bottom does.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });

  return (
    <div ref={ref} className="relative pl-8 lg:pl-10">
      {/* Track + scroll-linked progress fill */}
      <div aria-hidden className="absolute top-3 bottom-8 left-0 w-px bg-border">
        <motion.div
          className="h-full w-full origin-top bg-gradient-to-b from-accent via-accent to-accent/40"
          style={{ scaleY: reduced ? 1 : scrollYProgress }}
        />
      </div>

      <ol className="space-y-8 lg:space-y-16">
        {entries.map((entry, i) => (
          <li key={entry.org + entry.role} className="relative">
            <Reveal delay={i * 0.05}>
              <TimelineEntry entry={entry} latest={i === 0} />
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

function TimelineEntry({ entry, latest }: { entry: ExperienceEntry; latest: boolean }) {
  return (
    <article className="group relative -ml-5 rounded-2xl p-5 lg:-ml-8 lg:p-8">
      {/* Hover surface fades in (opacity only) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl border border-border/90 bg-surface/85 opacity-0 shadow-[0_12px_32px_-8px_rgba(20,20,20,0.04)] transition-opacity duration-300 ease-brand group-hover:opacity-100 dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)]"
      />

      {/* Node, centred on the track line (track is 8px left of the card edge) */}
      <span aria-hidden className="absolute top-[23px] -left-[16.5px] flex lg:top-[35px] lg:-left-[12.5px]">
        <span
          className={`h-2.5 w-2.5 rounded-full ring-4 ring-bg transition-[transform,background-color,border-color] duration-200 ease-brand group-hover:scale-125 ${
            latest ? "bg-accent" : "border-2 border-secondary bg-bg group-hover:border-accent"
          }`}
        />
      </span>

      <div className="relative">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <span className="font-mono text-xs leading-4 uppercase tracking-wider text-secondary">{entry.dates}</span>
          {entry.badge &&
            (latest ? (
              <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] leading-4 font-medium uppercase tracking-wider text-accent">
                {entry.badge}
              </span>
            ) : (
              <span className="font-mono text-[11px] leading-4 uppercase tracking-wider text-secondary">{entry.badge}</span>
            ))}
        </div>

        <div className="mb-4">
          <h3 className="text-xl leading-7 font-bold sm:text-2xl sm:leading-8 tracking-tight text-text transition-colors duration-200 ease-brand group-hover:text-accent">
            {entry.role}
          </h3>
          <p className="mt-0.5 text-base leading-6 font-medium text-secondary">{entry.org}</p>
        </div>

        <ul className={`space-y-2.5 text-[15px] leading-relaxed text-text/90 ${entry.tags.length ? "mb-6" : ""}`}>
          {entry.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5">
              <span aria-hidden className={`mt-1.5 font-mono text-sm leading-none ${latest ? "text-accent" : "text-secondary"}`}>
                •
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {entry.tags.length > 0 && (
          <p className="border-t border-border/60 pt-4 font-mono text-xs leading-5 text-text">
            {entry.tags.map((t, i) => (
              <span key={t}>
                <span className="whitespace-nowrap font-medium">
                  {t}
                  {i < entry.tags.length - 1 && <span className="ml-2 text-border">/</span>}
                </span>{" "}
              </span>
            ))}
          </p>
        )}
      </div>
    </article>
  );
}
