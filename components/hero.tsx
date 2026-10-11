import { emailHref, site } from "@/content/site";
import { ArrowLink } from "./arrow-link";
import { Container } from "./container";
import { ResumeMenu } from "./resume-menu";

const { hero } = site;

const socials = [
  { label: "GitHub", href: site.links.github, external: true },
  { label: "LinkedIn", href: site.links.linkedin, external: true },
  { label: "Email", href: emailHref, external: false },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-between gap-12 overflow-hidden py-6 md:py-12 lg:h-svh lg:max-h-[1080px] lg:min-h-[720px] lg:gap-0 lg:py-12"
    >
      {/* Ambient background: grain, top orb and a warm falloff on the right */}
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 z-10" />
      <div
        aria-hidden
        className="animate-ambient pointer-events-none absolute -top-32 right-1/4 hidden h-[560px] w-[560px] rounded-full bg-gradient-to-br from-accent/10 via-accent/5 to-transparent blur-3xl dark:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-24 h-[420px] w-[420px] rounded-full bg-gradient-to-bl from-border/80 via-bg to-transparent blur-2xl dark:top-1/2 dark:h-[380px] dark:w-[380px] dark:from-border/60 dark:via-surface"
      />

      {/* Reserves the nav's slot; the nav itself is fixed so it can follow the page. */}
      <div aria-hidden className="h-14 shrink-0" />

      <Container className="relative z-30 my-auto">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left: typographic narrative */}
          <div className="space-y-6 lg:col-span-8 lg:space-y-7 lg:pr-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-surface/60 px-3.5 py-1.5 dark:border-border/90 dark:bg-surface/80">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              <span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-tight text-secondary">
                {hero.eyebrow.map((item, i) => (
                  <span key={item}>
                    {i > 0 && <> <span className="mx-1 text-border">·</span> </>}
                    {item}
                  </span>
                ))}
              </span>
            </div>

            <h1 className="text-[42px] font-semibold leading-[1.06] tracking-[-0.035em] text-text sm:text-[54px] lg:text-[64px]">
              {hero.headline.before}
              <span className="text-accent">{hero.headline.accent}</span>
              {hero.headline.after}
            </h1>

            <p className="max-w-[540px] text-base leading-relaxed tracking-tight text-secondary sm:text-lg">{hero.intro}</p>

            <div className="flex flex-wrap items-center gap-3 pt-2 sm:gap-4">
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-on-accent shadow-sm shadow-accent/25 transition-[filter,transform] duration-200 ease-brand hover:brightness-110 active:scale-[0.98] dark:font-semibold dark:shadow-accent/20"
              >
                <span>View Projects</span>
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>

              <ResumeMenu />
            </div>
          </div>

          {/* Right: monogram, orb, rings and the status card */}
          <div className="relative flex h-[300px] items-center justify-center lg:col-span-4 lg:h-[380px] lg:justify-end">
            {/* Faint "A." monogram: peeks out from the card's lower-left to balance the left-heavy composition */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 left-[4%] select-none text-[220px] leading-none sm:left-[18%] lg:-bottom-24 lg:-left-16 lg:text-[300px] font-bold tracking-[-0.06em] text-text/[0.06] dark:text-text/[0.05]"
            >
              {site.monogram}
              <span className="text-accent/[0.18] dark:text-accent/[0.14]">.</span>
            </div>

            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-1/2 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full lg:right-6 lg:h-72 lg:w-72 lg:translate-x-0 bg-accent opacity-[var(--orb-opacity)] blur-3xl"
            />

            <div aria-hidden className="pointer-events-none absolute top-12 right-8 hidden h-44 w-44 rounded-full lg:block border border-border/60 dark:border-border/70" />
            <div aria-hidden className="pointer-events-none absolute top-16 right-4 hidden h-36 w-36 rounded-full lg:block border border-dashed border-accent/30 dark:border-accent/25" />

            <StatusCard />
          </div>
        </div>
      </Container>

      {/* Bottom row: scroll cue and text-only social links */}
      <Container className="relative z-20">
        <div className="flex items-end justify-center border-t border-border/60 pt-5 sm:justify-between text-xs dark:border-border/70">
          <a
            href="#about"
            className="group hidden items-center gap-3 font-mono text-[11px] tracking-wide text-secondary transition-colors sm:flex duration-200 ease-brand hover:text-text"
          >
            <span className="uppercase">Scroll</span>
            <span className="relative h-7 w-px overflow-hidden bg-border">
              <span className="animate-scroll-line block h-full w-full bg-accent" />
            </span>
          </a>

          <ul className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-secondary sm:gap-6">
            {socials.map(({ label, href, external }, i) => (
              <li key={label} className="flex items-center gap-4 sm:gap-6">
                {i > 0 && <span className="text-border">/</span>}
                <ArrowLink href={href} external={external}>
                  {label}
                </ArrowLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function StatusCard() {
  const { status } = hero;
  return (
    <div className="glass relative z-20 w-[290px] max-w-full space-y-4 lg:mr-2 rounded-2xl p-5 shadow-xl dark:shadow-2xl">
      <div className="flex items-center justify-between border-b border-border/60 pb-3 dark:border-border/80">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          </span>
          <span className="font-mono text-[11px] font-medium uppercase tracking-tight text-text">{status.label}</span>
        </div>
        <span className="rounded border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-400">
          {status.badge}
        </span>
      </div>

      <div className="space-y-2">
        <div className="text-[13px] font-medium tracking-tight text-text">{status.title}</div>
        <p className="text-xs leading-normal text-secondary">{status.note}</p>
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-2 font-mono text-xs text-secondary dark:border-border/60">
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {site.location} ({site.timezone})
        </span>
        <span className="text-[10px] opacity-75">{status.meta}</span>
      </div>
    </div>
  );
}
