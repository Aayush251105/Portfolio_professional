/**
 * Intro loader: "A." draws in, its accent period pops, a progress line and counter fill, then the
 * screen lifts away like a curtain and the page plays its entrance. All motion is CSS (see the
 * "Intro loader" block in globals.css) so it runs from first paint, before any JS has loaded.
 * Plays once per session; skipped entirely for prefers-reduced-motion.
 */

const NAME = "Aayush Gupta";
export const LOADER_KEY = "a-loader-seen";
/** Matches the CSS timeline: the page becomes scrollable as the curtain clears. */
export const LOADER_LOCK_MS = 1700;

// The "A" with its counter cut out (even-odd), drawn on a 0-128 x 0-110 grid.
const A_PATH = "M4 104 L39 6 H61 L96 104 H74 L66.6 82 H33.4 L26 104 Z M39.6 64 H60.4 L50 33 Z";

export function Loader() {
  return (
    <>
      <div data-loader aria-hidden suppressHydrationWarning className="loader fixed inset-0 z-[100]">
        <div className="loader-panel absolute inset-0 bg-bg">
          <div className="bg-grain pointer-events-none absolute inset-0" />
          <div className="loader-glow pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[90px]" />

          {/* Curved trailing edge: rides below the panel so the curtain lifts with a soft bulge */}
          <svg
            className="absolute top-full left-0 h-[9vh] w-full overflow-visible sm:h-[16vh] drop-shadow-[0_14px_28px_rgba(20,20,20,0.10)] dark:drop-shadow-[0_14px_28px_rgba(0,0,0,0.5)]"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0 0 H100 C100 0 82 100 50 100 C18 100 0 0 0 0 Z" fill="var(--bg)" />
            {/* Accent hairline along the curved edge: reads as a vermilion sweep as the curtain lifts */}
            <path d="M0 0 C0 0 18 100 50 100 C82 100 100 0 100 0" fill="none" stroke="var(--accent)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          </svg>

          <div className="loader-content relative flex h-full flex-col items-center justify-center gap-9">
            <svg viewBox="0 0 128 110" className="h-[72px] w-auto overflow-visible sm:h-24">
              <path
                d={A_PATH}
                pathLength={1}
                className="loader-stroke"
                fill="none"
                stroke="var(--text)"
                strokeWidth={1.5}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <path d={A_PATH} fillRule="evenodd" className="loader-fill" fill="var(--text)" />
              <rect x="104" y="84" width="20" height="20" rx="3" className="loader-ring" fill="none" stroke="var(--accent)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
              <rect x="104" y="84" width="20" height="20" rx="3" className="loader-dot" fill="var(--accent)" />
            </svg>

            <div className="w-[220px]">
              <div className="mb-3 flex items-end justify-between font-mono text-[10.5px] leading-[14px] font-medium uppercase tracking-[0.28em] text-secondary">
                <span className="overflow-hidden">
                  {[...NAME].map((ch, i) => (
                    <span key={i} className="loader-letter" style={{ "--l": i } as React.CSSProperties}>
                      {ch === " " ? " " : ch}
                    </span>
                  ))}
                </span>
                <span className="loader-count tracking-[0.08em] text-text tabular-nums" />
              </div>
              <div className="h-px overflow-hidden bg-border">
                <div className="loader-line h-full bg-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*
        Runs during HTML parsing, before first paint. Seen this session or reduced motion: mark the loader
        skipped (CSS hides it and the page enters immediately). Otherwise lock scrolling until the curtain clears.
        type switches to text/plain on the client so React never tries to (re)execute it.
      */}
      <script
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `(function(){var l=document.querySelector("[data-loader]");if(!l)return;try{if(sessionStorage.getItem("${LOADER_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches){l.setAttribute("data-skip","");return}sessionStorage.setItem("${LOADER_KEY}","1")}catch(e){}var h=document.documentElement;h.classList.add("is-loading");setTimeout(function(){h.classList.remove("is-loading")},${LOADER_LOCK_MS})})()`,
        }}
      />
    </>
  );
}
