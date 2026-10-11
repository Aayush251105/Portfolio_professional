"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

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
    return () => {
      instance?.destroy();
      instance = null;
    };
  }, []);

  return null;
}
