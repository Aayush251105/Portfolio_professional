"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/** Mouse-like pointers only, and only when motion is welcome; everyone else keeps the system cursor. */
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const INTERACTIVE = "a[href], button:not([disabled]), [role=button], [role=menuitem], [role=tab], label[for], summary, [data-cursor]";
const TEXT = "input:not([type=checkbox]):not([type=radio]):not([type=range]), textarea, select, [contenteditable=true]";
const EASE = 0.2; // ring catch-up per frame

function subscribe(cb: () => void) {
  const m = matchMedia(QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

/**
 * Custom cursor: an accent dot that tracks the pointer exactly and a ring that trails it. The ring
 * grows over interactive elements, turns into a label over `[data-cursor="View"]`-style targets,
 * squeezes on press, and steps aside over text fields (the native I-beam shows there).
 * The native cursor is hidden only once this is running (html.has-cursor), so no-JS keeps it.
 * Transform/opacity only; one rAF loop that stops when the ring has caught up.
 */
export function Cursor() {
  const enabled = useSyncExternalStore(subscribe, () => matchMedia(QUERY).matches, () => false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!enabled || !root || !dot || !ring || !label) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;

    const loop = () => {
      rx += (x - rx) * EASE;
      ry += (y - ry) * EASE;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (root.dataset.visible !== "true") {
        // First move (or re-entry): start the ring on the pointer instead of flying in from a corner.
        rx = x;
        ry = y;
        ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        root.dataset.visible = "true";
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const target = t.closest(INTERACTIVE);
      const text = t.closest(TEXT);
      const named = target?.getAttribute("data-cursor") ?? "";
      root.dataset.state = text ? "text" : named ? "label" : target ? "interactive" : "default";
      if (named) label.textContent = named;
    };

    const onDown = () => (root.dataset.pressed = "true");
    const onUp = () => (root.dataset.pressed = "false");
    const onLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) root.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={rootRef} aria-hidden className="cursor" data-state="default" data-visible="false" data-pressed="false">
      <div ref={ringRef} className="cursor-pos">
        <div className="cursor-ring">
          <span ref={labelRef} className="cursor-label" />
        </div>
      </div>
      <div ref={dotRef} className="cursor-pos">
        <div className="cursor-dot" />
      </div>
    </div>
  );
}
