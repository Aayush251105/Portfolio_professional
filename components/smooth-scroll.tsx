"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { LOADER_LOCK_MS } from "./loader";

let instance: Lenis | null = null;

/** The page's Lenis instance (null before mount). Dialogs use it to pause page scrolling. */
export const getLenis = () => instance;

/**
 * Momentum smoothing for wheel/trackpad scrolling. Lenis keeps native scroll underneath, so sticky
 * elements, IntersectionObserver reveals and scroll-spy all keep working. In-page anchors glide
 * too; with prefers-reduced-motion, smoothing is off and jumps are instant (Lenis default).
 */
export function SmoothScroll() {
  useEffect(() => {
    instance = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    // Hold scrolling while the intro loader plays (its inline script set html.is-loading).
    let resume: ReturnType<typeof setTimeout> | undefined;
    if (document.documentElement.classList.contains("is-loading")) {
      instance.stop();
      resume = setTimeout(() => instance?.start(), Math.max(0, LOADER_LOCK_MS - performance.now()));
    }
    return () => {
      clearTimeout(resume);
      instance?.destroy();
      instance = null;
    };
  }, []);

  return null;
}
