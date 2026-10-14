"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { site, type Project, type ProjectCategory } from "@/content/site";
import { scrollToSection, useSiteAction } from "@/lib/site-actions";
import { ArrowLink } from "../arrow-link";
import { CaseStudy } from "./case-study";
import { ProjectLinks } from "./project-links";
import { displayUrl, ProjectVisual } from "./project-visual";
import { TiltCard } from "./tilt-card";

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
  // Below lg the index is an accordion. Starts with the first featured project expanded.
  const [expandedId, setExpandedId] = useState<string | null>(() => (projects.find((p) => p.featured) ?? projects[0]).id);
  const rowRefs = useRef(new Map<string, HTMLButtonElement>());
  const reduced = useReducedMotion();

  const visible = projects.filter((p) => filter === "All" || p.categories.includes(filter));
  const selected = visible.find((p) => p.id === selectedId) ?? visible[0];
  const open = projects.find((p) => p.id === openId) ?? null;

  function applyFilter(next: typeof filter) {
    setFilter(next);
    const list = projects.filter((p) => next === "All" || p.categories.includes(next));
    if (!list.some((p) => p.id === selectedId)) setSelectedId((list.find((p) => p.featured) ?? list[0]).id);
  }

  // Chat assistant: filter the list, or open a project's case study.
  useSiteAction((action) => {
    if (action.type === "filter_projects") {
      applyFilter(action.filter);
      scrollToSection("projects");
    } else if (action.type === "show_project" && projects.some((p) => p.id === action.id)) {
      if (!visible.some((p) => p.id === action.id)) setFilter("All");
      setSelectedId(action.id);
      setExpandedId(action.id);
      setOpenId(action.id);
    }
  });

  /** Desktop opens the case study; below lg a tap toggles the accordion (decided at click time, so SSR markup is identical). */
  function onRowClick(id: string) {
    if (window.matchMedia("(min-width: 1024px)").matches) setOpenId(id);
    else setExpandedId((cur) => (cur === id ? null : id));
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
      <div className="mb-8 flex flex-col items-start gap-5 border-b border-border/40 pb-3 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-[34px] leading-none font-medium tracking-[-0.03em] text-text lg:text-[44px]">{site.projects.headline}</h2>
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

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        {/* Index list (accordion below lg) */}
        <div className="lg:col-span-7">
          <ul className="flex flex-col border-t border-border" aria-label="Projects">
            <AnimatePresence initial={false}>
              {visible.map((p, i) => {
                const active = p.id === selected?.id;
                const expanded = p.id === expandedId;
                return (
                  <motion.li
                    key={p.id}
                    layout={reduced ? false : "position"}
                    initial={reduced ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
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
                      aria-current={active ? "true" : undefined}
                      aria-expanded={expanded}
                      aria-controls={`project-panel-${p.id}`}
                      data-cursor="Open"
                      onMouseEnter={() => setSelectedId(p.id)}
                      onFocus={() => setSelectedId(p.id)}
                      onClick={() => onRowClick(p.id)}
                      onKeyDown={(e) => onRowKeyDown(e, i)}
                      className={`group flex h-16 w-full items-center justify-between rounded-sm px-2 text-left transition-transform duration-250 ease-brand focus-visible:bg-text/[0.03] ${
                        active ? "lg:translate-x-3" : ""
                      }`}
                    >
                      <span className="flex items-center gap-4 lg:gap-5">
                        <span
                          className={`font-mono text-[11px] leading-[14px] tracking-[0.06em] text-secondary transition-colors duration-250 ${
                            active ? "lg:font-semibold lg:text-accent-ink" : ""
                          } ${expanded ? "max-lg:font-semibold max-lg:text-accent-ink" : ""}`}
                        >
                          {number(p)}
                        </span>
                        <span
                          className={`flex items-center gap-1.5 text-[17px] leading-6 font-medium tracking-tight text-text transition-[color,font-weight] duration-250 ${
                            active ? "lg:font-semibold lg:text-accent-ink" : "lg:text-secondary lg:group-hover:text-text"
                          } ${expanded ? "max-lg:font-semibold max-lg:text-accent-ink" : ""}`}
                        >
                          {p.name}
                          {p.featured && <span className={`text-[11px] leading-none text-accent ${active ? "lg:hidden" : ""}`}>★</span>}
                        </span>
                        <span
                          className={`ml-1 font-mono text-[11px] leading-[14px] uppercase tracking-wider text-secondary transition-colors duration-250 ${
                            active ? "lg:text-accent-ink" : ""
                          } ${expanded ? "max-lg:text-accent-ink" : ""}`}
                        >
                          {categoryLabel(p.categories[0])}
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
                          className={`hidden text-lg leading-none font-medium text-accent transition-[opacity,transform] duration-250 ease-brand lg:inline ${
                            active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                          }`}
                        >
                          →
                        </span>
                        {/* Accordion chevron (below lg) */}
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          className={`h-4 w-4 transition-[transform,color] duration-300 ease-brand lg:hidden ${expanded ? "rotate-180 text-accent" : "text-secondary"}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                        </svg>
                      </span>
                    </button>

                    {/* Accordion panel (below lg only) */}
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          id={`project-panel-${p.id}`}
                          key="panel"
                          initial={reduced ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduced ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease }}
                          className="overflow-hidden lg:hidden"
                        >
                          <div className="px-2 pb-6">
                            <div className="relative h-[200px] overflow-hidden rounded-lg border border-border/60 bg-bg/60 sm:h-[300px]">
                              <ProjectVisual project={p} sizes="(min-width: 1024px) 1px, 100vw" />
                            </div>
                            <ProjectMeta project={p} />
                            <button
                              type="button"
                              aria-haspopup="dialog"
                              onClick={() => setOpenId(p.id)}
                              className="group mt-5 inline-flex items-center gap-1.5 font-mono text-xs leading-4 font-medium tracking-[0.04em] text-text transition-colors duration-200 ease-brand hover:text-accent-ink"
                            >
                              Read case study
                              <span aria-hidden className="text-accent transition-transform duration-200 ease-brand group-hover:translate-x-0.5">
                                →
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

        {/* Glass preview, vertically centred against the list */}
        <div className="relative col-span-5 hidden self-center lg:block">
          <div aria-hidden className="pointer-events-none absolute -top-12 -left-12 h-72 w-72 animate-ambient rounded-full bg-accent opacity-25 blur-3xl" />
          <TiltCard className="glass overflow-hidden rounded-2xl p-6 shadow-xl">
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
                    {displayUrl(selected)}
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
                    <div className="relative mt-4 h-[210px] overflow-hidden rounded-lg border border-border/60 bg-bg/60">
                      <ProjectVisual project={p} shown={shown} sizes="(min-width: 1024px) 440px, 1px" />
                    </div>
                    <ProjectMeta project={p} />
                  </div>
                );
              })}
            </div>
          </TiltCard>
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
        <h3 className="text-xl leading-8 font-semibold tracking-tight text-text lg:text-[23px]">{project.name}</h3>
        <span className="shrink-0 rounded border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[11px] leading-4 font-medium uppercase text-accent-ink">
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
