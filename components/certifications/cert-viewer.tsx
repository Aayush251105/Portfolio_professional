"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Certification } from "@/content/site";
import { getLenis } from "../smooth-scroll";

const ease = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Lightbox for certificate previews. ←/→ browse, Esc or backdrop closes; page scroll pauses while open.
 * `items` are only the certificates that have a preview image.
 */
export function CertViewer({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: Certification[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const open = index !== null;
  const cert = open ? items[index] : null;

  // On open: pause page scroll and move focus into the dialog (once, not on every navigation).
  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    closeRef.current?.focus();
    return () => {
      getLenis()?.start();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && index !== null) onIndex((index + 1) % items.length);
      else if (e.key === "ArrowLeft" && index !== null) onIndex((index - 1 + items.length) % items.length);
      else if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onClose, onIndex]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {cert && index !== null && (
        <motion.div
          key="cert-viewer"
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25, ease }}
        >
          <div aria-hidden onClick={onClose} className="absolute inset-0 bg-bg/80 backdrop-blur-sm" />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-viewer-title"
            data-lenis-prevent
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease }}
            className="relative flex max-h-[92vh] w-full max-w-[1040px] flex-col overflow-y-auto overscroll-contain rounded-3xl border border-border bg-surface p-4 shadow-2xl sm:p-6"
          >
            {/* Header: issuer, title, year · actions */}
            <div className="mb-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-3 sm:mb-5">
              <div className="min-w-0">
                <p className="font-mono text-[11px] leading-[14px] font-medium uppercase tracking-wider text-accent-ink">
                  {cert.issuer}
                  {cert.year && <span className="text-secondary"> · {cert.year}</span>}
                </p>
                <h3 id="cert-viewer-title" className="mt-1.5 text-xl leading-7 font-medium tracking-[-0.015em] text-text sm:text-2xl sm:leading-8">
                  {cert.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {cert.pdf && <PillLink href={cert.pdf} label="Open PDF" />}
                {cert.href && <PillLink href={cert.href} label="Verify" />}
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close certificate"
                  onClick={onClose}
                  className="group glass-pill ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-secondary transition-[color,border-color,transform] duration-200 ease-brand hover:border-accent hover:text-accent active:scale-95"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:rotate-90" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Certificate image, crossfading between certificates */}
            <div className="relative grid min-h-0 flex-1 place-items-center overflow-hidden rounded-2xl border border-border bg-bg/60 [&>*]:col-start-1 [&>*]:row-start-1">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={cert.id}
                  initial={reduced ? false : { opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 0.985 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex w-full justify-center p-2 sm:p-4"
                >
                  {cert.image && (
                    <Image
                      src={cert.image.src}
                      width={cert.image.width}
                      height={cert.image.height}
                      alt={`${cert.title} certificate, issued to Aayush Gupta by ${cert.issuer}`}
                      sizes="(min-width: 1080px) 980px, 100vw"
                      className="h-auto max-h-[64vh] w-auto max-w-full rounded-lg object-contain shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer: browse */}
            {items.length > 1 && (
              <div className="mt-4 flex items-center justify-between sm:mt-5">
                <span className="font-mono text-xs leading-4 font-medium tracking-wider text-text tabular-nums" aria-live="polite">
                  {pad(index + 1)} / {pad(items.length)}
                </span>
                <div className="flex items-center gap-3">
                  <NavButton label="Previous certificate" flip onClick={() => onIndex((index - 1 + items.length) % items.length)} />
                  <NavButton label="Next certificate" onClick={() => onIndex((index + 1) % items.length)} />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function PillLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group glass-pill inline-flex h-10 items-center gap-1 rounded-full px-4 font-mono text-xs leading-4 font-medium tracking-[0.04em] text-text transition-[color,border-color] duration-200 ease-brand hover:border-accent hover:text-accent-ink"
    >
      {label}
      <span aria-hidden className="text-[10px] text-secondary transition-[color,transform] duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
        ↗
      </span>
    </a>
  );
}

function NavButton({ label, onClick, flip = false }: { label: string; onClick: () => void; flip?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="group glass-pill flex h-10 w-10 items-center justify-center rounded-full text-text transition-[border-color,color,transform] duration-200 ease-brand hover:border-accent hover:text-accent active:scale-95"
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
