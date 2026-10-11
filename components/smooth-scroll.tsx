"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Momentum smoothing for wheel/trackpad scrolling. Lenis keeps native scroll underneath, so sticky
 * elements, IntersectionObserver reveals and scroll-spy all keep working. In-page anchors glide
 * too; with prefers-reduced-motion, smoothing is off and jumps are instant (Lenis default).
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
