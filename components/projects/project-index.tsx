"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { site, type Project, type ProjectCategory } from "@/content/site";
import { ArrowLink } from "../arrow-link";
import { CaseStudy } from "./case-study";
import { ProjectLinks } from "./project-links";
import { ProjectPreview } from "./previews";

const ease = [0.22, 1, 0.36, 1] as const;
const filters: { key: "All" | ProjectCategory; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Full-stack", label: "Full-stack" },
  { key: "AI-ML", label: "AI-ML" },
];

const projects = site.projects.items;
const number = (p: Project) => String(projects.indexOf(p) + 1).padStart(2, "0");
const categoryLabel = (c: ProjectCategory) => (c === "AI-ML" ? "AI/ML" : c);

export function ProjectIndex() {
  const [filter, setFilter] = useState<"All" | ProjectCategory>("All");
  const [selectedId, setSelectedId] = useState(() => (projects.find((p) => p.featured) ?? projects[0]).id);
  const [openId, setOpenId] = useState<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLButtonElement>());
  const reduced = useReducedMotion();

  const visible = projects.filter((p) => filter === "All" || p.category === filter);
  const selected = visible.find((p) => p.id === selectedId) ?? visible[0];
  const open = projects.find((p) => p.id === openId) ?? null;

  function applyFilter(next: typeof filter) {
    setFilter(next);
    const list = projects.filter((p) => next === "All" || p.category === next);
    if (!list.some((p) => p.id === selectedId)) setSelectedId((list.find((p) => p.featured) ?? list[0]).id);
  }

  function onRowKeyDown(e: React.KeyboardEvent, index: number) {
    const target =
      e.key === "ArrowDown" ? visible[(index + 1) % visible.length] : e.key === "ArrowUp" ? visible[(index - 1 + visible.length) % visible.length] : null;
    if (!target) return;
    e.preventDefault();
    setSelectedId(target.id);
    rowRefs.current.get(target.id)?.focus();
  }

  return (
    <>
      {/* Headline + filter tabs */}
      <div className="mb-8 flex items-baseline justify-between border-b border-border/40 pb-3">
        <h2 className="text-[44px] leading-none font-medium tracking-[-0.03em] text-text">{site.projects.headline}</h2>
        <div role="tablist" aria-label="Filter projects" className="flex items-center gap-6 font-mono text-xs leading-4 font-medium tracking-[0.04em]">
          {filters.map(({ key, label }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => applyFilter(key)}
                className={`relative pb-1 transition-colors duration-200 ease-brand ${active ? "text-text" : "text-secondary hover:text-text"}`}
              >
                {label}
                {active && (
                  <motion.span
                    layoutId="project-filter-underline"
                    transition={reduced ? { duration: 0 } : { duration: 0.35, ease }}
                    className="absolute inset-x-0 bottom-0 h-[1.5px] bg-accent"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-12 items-start gap-10">
        {/* Index list */}
        <div className="col-span-7">
          <ul className="flex flex-col border-t border-border" aria-label="Projects">
            <AnimatePresence initial={false}>
              {visible.map((p, i) => {
                const active = p.id === selected?.id;
                return (
                  <motion.li
                    key={p.id}
                    layout={reduced ? false : "position"}
                    initial={reduced ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 64 }}
                    exit={reduced ? undefined : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="border-b border-border [overflow-x:visible] [overflow-y:clip]"
                  >
                    <button
                      ref={(el) => {
                        if (el) rowRefs.current.set(p.id, el);
                        else rowRefs.current.delete(p.id);
                      }}
                      type="button"
                      aria-haspopup="dialog"
                      aria-current={active ? "true" : undefined}
                      onMouseEnter={() => setSelectedId(p.id)}
                      onFocus={() => setSelectedId(p.id)}
                      onClick={() => setOpenId(p.id)}
                      onKeyDown={(e) => onRowKeyDown(e, i)}
                      className={`group flex h-16 w-full items-center justify-between px-2 text-left outline-none transition-[opacity,transform] duration-250 ease-brand focus-visible:bg-text/[0.03] ${
                        active ? "translate-x-3 opacity-100" : "opacity-40 hover:opacity-100"
                      }`}
                    >
                      <span className="flex items-center gap-5">
                        <span
                          className={`font-mono text-[11px] leading-[14px] tracking-[0.06em] transition-colors duration-250 ${
                            active ? "font-semibold text-accent" : "text-secondary"
                          }`}
                        >
                          {number(p)}
                        </span>
                        <span
                          className={`flex items-center gap-1.5 text-[17px] leading-6 tracking-tight transition-[color,font-weight] duration-250 ${
                            active ? "font-semibold text-accent" : "font-medium text-text"
                          }`}
                        >
                          {p.name}
                          {p.featured && !active && <span className="text-[11px] leading-none text-accent">★</span>}
                        </span>
                        <span
                          className={`ml-1 font-mono text-[11px] leading-[14px] uppercase tracking-wider transition-colors duration-250 ${
                            active ? "text-accent/80" : "text-secondary"
                          }`}
                        >
                          {categoryLabel(p.category)}
                        </span>
                      </span>
                      <span className="flex items-center gap-3">
                        {p.year && (
                          <span className={`font-mono text-[11px] leading-[14px] tracking-[0.06em] ${active ? "text-text" : "text-secondary"}`}>
                            {p.year}
                          </span>
                        )}
                        <span
                          aria-hidden
                          className={`text-lg leading-none font-medium text-accent transition-[opacity,transform] duration-250 ease-brand ${
                            active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                          }`}
                        >
                          →
                        </span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          <div className="pt-6 font-mono text-xs leading-4 font-medium tracking-[0.04em] text-secondary">
            <ArrowLink href={site.links.github} external className="normal-case">
              View all on GitHub
            </ArrowLink>
          </div>
        </div>

        {/* Sticky glass preview */}
        <div className="sticky top-28 col-span-5">
          <div aria-hidden className="pointer-events-none absolute -top-12 -left-12 h-72 w-72 rounded-full bg-accent opacity-25 blur-3xl" />
          <div className="glass relative overflow-hidden rounded-2xl p-6 shadow-xl">
            {/* Browser chrome */}
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-accent/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-secondary/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-secondary/30" />
              </div>
              <div className="mx-3 flex max-w-[280px] flex-1 items-center justify-center rounded-md border border-border/80 bg-surface/70 px-3 py-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={selected.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="truncate font-mono text-[11.5px] leading-4 whitespace-nowrap text-secondary"
                  >
                    {selected.id}/preview
                  </motion.span>
                </AnimatePresence>
              </div>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-secondary" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
            </div>

            {/*
              Every project is rendered in the same grid cell and only the selected one is visible.
              The card is therefore always as tall as the tallest project: swapping never changes the
              page height (a height change at the bottom of the page made the browser re-scroll,
              which moved a different row under the cursor and caused a hover feedback loop).
            */}
            <div className="grid grid-cols-[minmax(0,1fr)] [&>*]:col-start-1 [&>*]:row-start-1">
              {projects.map((p) => {
                const shown = p.id === selected.id;
                return (
                  <div
                    key={p.id}
                    aria-hidden={!shown}
                    inert={!shown}
                    className={`transition-[opacity,transform] ease-brand ${
                      shown ? "translate-y-0 opacity-100 duration-300" : "pointer-events-none -translate-y-1.5 opacity-0 duration-200"
                    } motion-reduce:transition-none`}
                  >
                    <div className="relative mt-4 h-[210px] overflow-hidden rounded-lg border border-border/60 bg-bg/60 p-3.5">
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--text)_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.03]" />
                      <div className="relative h-full">
                        <ProjectPreview kind={p.preview} />
                      </div>
                    </div>
                    <ProjectMeta project={p} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <CaseStudy
        project={open}
        number={open ? number(open) : ""}
        onClose={() => {
          const id = openId;
          setOpenId(null);
          if (id) rowRefs.current.get(id)?.focus();
        }}
      />
    </>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[23px] leading-8 font-semibold tracking-tight text-text">{project.name}</h3>
        <span className="shrink-0 rounded border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[11px] leading-4 font-medium uppercase text-accent">
          {project.tag.split(",")[0]}
        </span>
      </div>
      <p className="text-sm leading-[1.45rem] text-secondary">{project.summary}</p>
      {project.stack.length > 0 && (
        <p className="pt-1 font-mono text-[11.5px] leading-4 tracking-wide text-text">
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
      <ProjectLinks project={project} />
    </div>
  );
}
