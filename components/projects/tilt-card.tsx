"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const MAX_TILT = 4; // degrees
const spring = { stiffness: 140, damping: 18, mass: 0.6 };

/**
 * Gives the project preview some life: an idle float (CSS, .animate-float), a gentle tilt toward the
 * pointer that springs back on leave, and a soft light that follows the cursor across the glass.
 * Transform/opacity only; tilt and light are skipped with prefers-reduced-motion.
 */
export function TiltCard({ className, children }: { className?: string; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  // Pointer position within the card, 0..1 (0.5 = centre).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [MAX_TILT, -MAX_TILT]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-MAX_TILT, MAX_TILT]), spring);
  const glow = useSpring(0, { stiffness: 120, damping: 20 });
  const lightX = useTransform(px, (v) => `${v * 100}%`);
  const lightY = useTransform(py, (v) => `${v * 100}%`);
  const light = useMotionTemplate`radial-gradient(420px circle at ${lightX} ${lightY}, var(--tilt-light), transparent 60%)`;

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    glow.set(1);
  }

  function onPointerLeave() {
    px.set(0.5);
    py.set(0.5);
    glow.set(0);
  }

  return (
    <div className="animate-float [perspective:1200px]">
      <motion.div
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative ${className ?? ""}`}
      >
        {children}
        <motion.div
          aria-hidden
          style={{ background: light, opacity: glow }}
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
        />
      </motion.div>
    </div>
  );
}
