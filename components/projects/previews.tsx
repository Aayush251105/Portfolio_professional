import type { Project } from "@/content/site";

/*
 * Illustrative UI mocks for each project's preview canvas. They depict real features from the resume
 * (no invented metrics). Each fills its parent; the parent sets the height.
 */

const chip = "rounded border border-border bg-surface px-2 py-0.5 font-mono text-[10px] leading-4 text-secondary";
const mono = "font-mono text-[10px] leading-4";

export function ProjectPreview({ kind }: { kind: Project["preview"] }) {
  switch (kind) {
    case "vidtube":
      return <VidTubeMock />;
    case "booknow":
      return <BookNowMock />;
    case "summarizer":
      return <SummarizerMock />;
    case "hirelens":
      return <HireLensMock />;
  }
}

function VidTubeMock() {
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="flex items-center justify-between">
        <span className={`${chip} flex items-center gap-1.5 text-text`}>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Hover preview
        </span>
        <span className={`${mono} text-secondary`}>Cloudinary AI</span>
      </div>
      <div className="flex min-h-0 flex-1 gap-3">
        {/* Player */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-md border border-border bg-[#141414] dark:bg-[#0a0a09]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_60%)]" />
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5 fill-accent" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <div className="absolute inset-x-3 bottom-2.5 h-[3px] rounded-full bg-white/15">
            <div className="h-full w-2/5 rounded-full bg-accent" />
          </div>
        </div>
        {/* Aspect-ratio transforms */}
        <div className="flex w-[72px] flex-col gap-2">
          <div className="flex aspect-video items-end rounded border border-border bg-border/50 p-1">
            <span className={`${mono} text-secondary`}>16:9</span>
          </div>
          <div className="flex aspect-square w-3/4 items-end rounded border border-accent/50 bg-accent/10 p-1">
            <span className={`${mono} text-accent`}>1:1</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/60 pt-1.5">
        <span className={`${mono} text-secondary`}>Auto-compress · aspect transform</span>
        <span className={chip}>Clerk auth</span>
      </div>
    </div>
  );
}

function BookNowMock() {
  const days = [
    { d: "Thu", n: 14 },
    { d: "Fri", n: 15, active: true },
    { d: "Sat", n: 16 },
    { d: "Sun", n: 17 },
  ];
  return (
    <div className="flex h-full flex-col justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1">
          <svg viewBox="0 0 24 24" className="h-3 w-3 stroke-secondary" fill="none" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span className={`${mono} text-secondary`}>Search listings</span>
        </div>
        <span className={chip}>Filters</span>
        <span className={`${chip} flex items-center gap-1`}>
          <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-accent" aria-hidden>
            <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
          </svg>
          Map
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {days.map(({ d, n, active }) => (
          <div
            key={d}
            className={`relative rounded-md border py-1.5 text-center ${
              active ? "border-accent/60 bg-accent/10 text-accent" : "border-border bg-surface text-text"
            }`}
          >
            {active && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent" />}
            <div className={`${mono} uppercase ${active ? "" : "text-secondary"}`}>{d}</div>
            <div className="text-sm leading-5 font-medium">{n}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-md border border-border bg-surface px-2.5 py-1.5">
        <span className={`${mono} flex items-center gap-1.5 text-secondary`}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Signed in · Passport.js
        </span>
        <span className={`${mono} text-text`}>Confirm booking →</span>
      </div>
    </div>
  );
}

function SummarizerMock() {
  return (
    <div className="flex h-full flex-col justify-between gap-2.5">
      <span className={`${mono} flex items-center gap-1.5 text-text`}>
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        T5 · fine-tuned on SAMSum
      </span>
      {/* First sample of the SAMSum dataset */}
      <div className="rounded-md border border-border bg-surface px-2.5 py-2">
        <div className={`${mono} mb-1 text-secondary`}>{"// Input dialogue"}</div>
        <p className="font-mono text-[10.5px] leading-[15px] text-text">
          Amanda: I baked cookies. Do you want some?
          <br />
          Jerry: Sure!
          <br />
          Amanda: I&apos;ll bring you tomorrow :-)
        </p>
      </div>
      <div className="rounded-md border border-accent/40 bg-accent/10 px-2.5 py-2">
        <div className={`${mono} mb-1 font-medium uppercase tracking-wider text-accent`}>Summary</div>
        <p className="text-xs leading-4 text-text">Amanda baked cookies and will bring Jerry some tomorrow.</p>
      </div>
    </div>
  );
}

function HireLensMock() {
  const metrics = [
    { label: "Clarity", w: "w-4/5" },
    { label: "Depth", w: "w-3/5" },
    { label: "Structure", w: "w-2/3" },
  ];
  return (
    <div className="flex h-full flex-col justify-between gap-2.5">
      <div className="flex items-center justify-between">
        <span className={`${mono} flex items-center gap-1.5 text-text`}>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Generated from resume + JD
        </span>
        <span className={chip}>Question 3</span>
      </div>
      <div className="rounded-md border border-border bg-surface px-2.5 py-2">
        <p className="text-xs leading-4 text-text">&ldquo;Walk me through how you&apos;d design a rate limiter for a public API.&rdquo;</p>
      </div>
      <div className="space-y-1.5">
        {metrics.map(({ label, w }) => (
          <div key={label} className="flex items-center gap-2">
            <span className={`${mono} w-14 text-secondary`}>{label}</span>
            <div className="h-1 flex-1 rounded-full bg-border">
              <div className={`h-full rounded-full bg-accent ${w}`} />
            </div>
          </div>
        ))}
      </div>
      <div className={`${mono} border-t border-border/60 pt-1.5 text-secondary`}>AI feedback · multi-metric evaluation</div>
    </div>
  );
}
