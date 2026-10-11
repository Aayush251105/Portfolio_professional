"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/content/site";
import { getLenis } from "../smooth-scroll";
import { ProjectLinks } from "./project-links";
import { ProjectPreview } from "./previews";

const ease = [0.22, 1, 0.36, 1] as const;

/** Click-through case-study view, styled after the Stitch "projects section" design. */
export function CaseStudy({ project, number, onClose }: { project: Project | null; number: string; onClose: () => void }) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Portal target only exists on the client.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!project) return;
    getLenis()?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      // Keep focus inside the dialog.
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      getLenis()?.start();
    };
  }, [project, onClose]);

  if (!mounted) return null;
  // Portalled to <body>: the section's reveal wrapper is transformed, which would break `position: fixed`.
  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="case-study"
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25, ease }}
        >
          <div aria-hidden onClick={onClose} className="absolute inset-0 bg-bg/75 backdrop-blur-sm" />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            data-lenis-prevent
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease }}
            className="relative max-h-[86vh] w-full max-w-[1080px] overflow-y-auto overscroll-contain rounded-3xl border border-border bg-surface p-6 shadow-2xl sm:p-10"
          >
            <button
              ref={closeRef}
              type="button"
              aria-label="Close case study"
              onClick={onClose}
              className="group glass-pill absolute top-4 right-4 z-10 flex sm:top-6 sm:right-6 h-10 w-10 items-center justify-center rounded-full text-secondary transition-[color,border-color,transform] duration-200 ease-brand hover:border-accent hover:text-accent active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <span className="font-mono text-[11px] leading-[14px] tracking-[0.06em] text-secondary">{number}</span>
                <h3 id="case-study-title" className="mt-2 pr-12 text-[26px] sm:text-[28px] leading-9 font-medium tracking-[-0.02em] text-text">
                  {project.name}
                </h3>
                <p className="mt-1 font-mono text-[11px] leading-[14px] uppercase tracking-wider text-accent">{project.tag}</p>
                <p className="mt-4 text-[15px] leading-6 text-secondary">{project.summary}</p>

                <ul className="mt-6 space-y-3 border-t border-border pt-5">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-sm leading-[1.45rem] text-text">
                      <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {h}
                    </li>
                  ))}
                </ul>

                {project.stack.length > 0 && (
                  <p className="mt-6 font-mono text-[11.5px] leading-4 tracking-wide text-secondary">
                    {project.stack.map((s, i) => (
                      <span key={s}>
                        <span className="whitespace-nowrap">
                          {s}
                          {i < project.stack.length - 1 && <span className="ml-1.5 text-border">/</span>}
                        </span>{" "}
                      </span>
                    ))}
                  </p>
                )}
                <div className="mt-2">
                  <ProjectLinks project={project} />
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-border bg-bg/50 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center gap-1.5 pb-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-accent/40" />
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary/30" />
                    <span className="h-2.5 w-2.5 rounded-full bg-secondary/30" />
                    <span className="mx-auto rounded-md border border-border/80 bg-surface/70 px-3 py-0.5 font-mono text-[11px] leading-4 text-secondary">
                      {project.id}/preview
                    </span>
                  </div>
                  <div className="h-[260px] rounded-lg border border-border/60 bg-surface p-4 sm:h-[300px] sm:p-5">
                    <ProjectPreview kind={project.preview} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
