"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Certification } from "@/content/site";
import { CertViewer } from "./cert-viewer";
import { useSiteAction } from "@/lib/site-actions";

type Cert = Certification;

const GAP = 24;
/** One card plus the gap; card width is responsive (300px on phones, 360px from sm). */
const stepOf = (track: HTMLElement) => (track.querySelector("article")?.offsetWidth ?? 360) + GAP;

/**
 * Horizontal scroll-snap carousel. The track starts at the container's left edge and bleeds
 * to the viewport's right edge. Counter shows the last fully visible card ("03 / 12"), and the
 * progress bar fills to the same ratio.
 */
export function CertCarousel({
  headline,
  intro,
  items,
}: {
  headline: { before: string; accent: string };
  intro: string;
  items: readonly Cert[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [lastVisible, setLastVisible] = useState(Math.min(items.length, 3));
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(items.length <= 3);
  // Viewer browses only certificates that have a preview image.
  const viewable = useMemo(() => items.filter((c) => c.image), [items]);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const cardButtons = useRef(new Map<string, HTMLButtonElement>());
  const closeViewer = useCallback(() => {
    setViewerIndex((i) => {
      if (i !== null) cardButtons.current.get(viewable[i].id)?.focus();
      return null;
    });
  }, [viewable]);

  // Chat assistant: open a certificate in the viewer.
  useSiteAction((action) => {
    if (action.type !== "show_certificate") return;
    const i = viewable.findIndex((c) => c.id === action.id);
    if (i >= 0) setViewerIndex(i);
  });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Count cards fully inside the 1200px content column, not the bleed area.
    const column = track.parentElement?.clientWidth ?? track.clientWidth;
    const right = track.scrollLeft + column + GAP;
    setLastVisible(Math.max(1, Math.min(items.length, Math.floor(right / stepOf(track)))));
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
  }, [items.length]);

  useEffect(() => {
    measure();
    const track = trackRef.current;
    track?.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      track?.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const scrollByCards = (dir: 1 | -1) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const track = trackRef.current;
    track?.scrollBy({ left: dir * stepOf(track), behavior: reduced ? "auto" : "smooth" });
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <div className="mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
        <div className="max-w-[620px]">
          <h2 className="mb-3 text-[34px] leading-[40px] font-normal tracking-[-0.025em] text-text lg:text-[44px] lg:leading-[50px]">
            {headline.before}
            <span className="font-medium text-accent">{headline.accent}</span>
          </h2>
          <p className="text-[15px] leading-relaxed tracking-[-0.005em] text-secondary">{intro}</p>
        </div>

        <div className="flex items-center gap-4 pb-1">
          <span className="mr-2 font-mono text-xs leading-4 font-medium tracking-wider text-text tabular-nums" aria-live="polite">
            {pad(lastVisible)} / {pad(items.length)}
          </span>
          <ArrowButton label="Previous certificate" disabled={atStart} onClick={() => scrollByCards(-1)} flip />
          <ArrowButton label="Next certificate" disabled={atEnd} onClick={() => scrollByCards(1)} />
        </div>
      </div>

      {/* Bleeds to the viewport's right edge: margin-right = -(viewport gutter) */}
      <div className="mr-[calc(50%-50vw)]">
        <div
          ref={trackRef}
          role="region"
          aria-label="Certifications"
          tabIndex={0}
          data-lenis-prevent-horizontal
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pt-2 pb-8 [scrollbar-width:none] focus-visible:outline-offset-8 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((cert) => (
            <CertCard
              key={cert.id}
              cert={cert}
              buttonRef={(el) => {
                if (el) cardButtons.current.set(cert.id, el);
                else cardButtons.current.delete(cert.id);
              }}
              onView={cert.image ? () => setViewerIndex(viewable.findIndex((c) => c.id === cert.id)) : undefined}
            />
          ))}
          {/* Trailing spacer so the last card can snap to the left edge */}
          <div aria-hidden className="w-px shrink-0" />
        </div>
      </div>

      <div className="mt-4 h-[2px] w-full max-w-[360px] overflow-hidden rounded-full bg-border">
        <div
          className="h-full origin-left rounded-full bg-accent transition-transform duration-500 ease-brand"
          style={{ transform: `scaleX(${lastVisible / Math.max(1, items.length)})` }}
        />
      </div>

      <CertViewer items={viewable} index={viewerIndex} onIndex={setViewerIndex} onClose={closeViewer} />
    </>
  );
}

/** Fades the type label out where the card's View / Verify actions take its place. */
const swapOut = "transition-opacity duration-300 ease-brand group-hover:opacity-0 group-focus-within:opacity-0 touch:hidden";

function CertCard({ cert, onView, buttonRef }: { cert: Cert; onView?: () => void; buttonRef: (el: HTMLButtonElement | null) => void }) {
  const hasActions = Boolean(onView || cert.href);
  return (
    // The article is a stationary hover target; only the inner card lifts. Lifting the hovered element
    // itself moved its edge out from under the cursor, ending the hover and flickering at the border.
    <article className="group relative h-[224px] w-[300px] shrink-0 snap-start sm:w-[360px]">
      <div className="glass relative flex h-full flex-col justify-between rounded-3xl p-6 transition-[transform,border-color,box-shadow,background-color] duration-300 ease-brand group-hover:-translate-y-2 group-hover:border-accent! group-hover:shadow-[0_16px_36px_-8px_color-mix(in_srgb,var(--accent)_18%,transparent)] group-focus-within:-translate-y-2 group-focus-within:border-accent!">
        {/* Whole card opens the viewer (stretched button); Verify stays its own link above it */}
        {onView && (
          <button
            ref={buttonRef}
            type="button"
            aria-haspopup="dialog"
            aria-label={`View certificate: ${cert.title}`}
            onClick={onView}
            className="absolute inset-0 z-0 cursor-zoom-in rounded-3xl"
          />
        )}

        <div className="pointer-events-none relative flex items-start justify-between">
          <span className="font-mono text-[11px] leading-[14px] font-medium uppercase tracking-wider text-secondary transition-colors duration-300 ease-brand group-hover:font-semibold group-hover:text-accent-ink group-focus-within:text-accent-ink">
            {cert.issuer}
          </span>
          <span className="h-2 w-2 rounded-full bg-border transition-[background-color,transform] duration-300 ease-brand group-hover:scale-110 group-hover:bg-accent group-focus-within:bg-accent" />
        </div>

        <h3 className="pointer-events-none relative line-clamp-2 text-xl leading-[26px] font-medium tracking-[-0.015em] text-text">{cert.title}</h3>

        <div className="pointer-events-none relative flex items-center border-t border-border/70 pt-3 transition-colors duration-300 ease-brand group-hover:border-accent/30">
          <div className="flex min-w-0 items-center gap-2.5 whitespace-nowrap font-mono text-[11px] leading-[14px] font-medium tracking-[0.06em] text-secondary uppercase transition-colors duration-300 ease-brand group-hover:text-text">
            {cert.year && (
              <>
                <span>{cert.year}</span>
                <span className={`text-border ${hasActions ? swapOut : ""}`}>•</span>
              </>
            )}
            <span className={`truncate ${hasActions ? swapOut : ""}`}>{cert.type}</span>
          </div>
          {/* Actions take the type label's place on hover (always shown on touch) */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-3 pt-3 whitespace-nowrap">
            {onView && (
              <span
                aria-hidden
                className="inline-flex translate-y-1 items-center gap-1 font-mono text-[11px] leading-[14px] font-medium tracking-[0.06em] text-secondary opacity-0 transition-[opacity,transform] duration-300 ease-brand group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 touch:translate-y-0 touch:opacity-100"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
                View
              </span>
            )}
          {cert.href && (
            <a
              href={cert.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Verify ${cert.title}`}
              className="pointer-events-auto inline-flex translate-y-1 items-center gap-0.5 border-b border-accent pb-0.5 font-mono text-[11px] leading-[14px] font-medium tracking-[0.06em] text-accent-ink opacity-0 transition-[opacity,transform] duration-300 ease-brand group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 touch:translate-y-0 touch:opacity-100"
            >
              Verify ↗
            </a>
          )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ArrowButton({ label, disabled, onClick, flip = false }: { label: string; disabled: boolean; onClick: () => void; flip?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="group glass-pill flex h-10 w-10 items-center justify-center rounded-full text-text transition-[border-color,transform,opacity,color] duration-200 ease-brand hover:border-accent hover:text-accent active:scale-95 disabled:pointer-events-none disabled:opacity-35"
    >
      <svg
        className={`h-4 w-4 transition-transform duration-200 ease-brand ${flip ? "rotate-180 group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  );
}
