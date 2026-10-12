"use client";

import { useEffect, useRef } from "react";
import { getLenis } from "@/components/smooth-scroll";
import type { NavId, ProjectCategory } from "@/content/site";

/**
 * Page actions the chat assistant can trigger. The chat dispatches them on `window`; the section
 * that owns the state (projects, certificates, contact form) listens and applies them.
 */
export type SiteAction =
  | { type: "navigate"; section: NavId | "certifications" }
  | { type: "filter_projects"; filter: "All" | ProjectCategory }
  | { type: "show_project"; id: string }
  | { type: "show_certificate"; id: string }
  | { type: "prefill_contact"; message: string };

const EVENT = "site-action";

export function dispatchSiteAction(action: SiteAction) {
  window.dispatchEvent(new CustomEvent<SiteAction>(EVENT, { detail: action }));
}

/** Subscribes to site actions for the component's lifetime (the latest handler is always used). */
export function useSiteAction(handler: (action: SiteAction) => void) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    const listener = (e: Event) => ref.current((e as CustomEvent<SiteAction>).detail);
    window.addEventListener(EVENT, listener);
    return () => window.removeEventListener(EVENT, listener);
  }, []);
}

/** Glides to a section (Lenis honours each section's scroll-margin), or jumps without Lenis. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
