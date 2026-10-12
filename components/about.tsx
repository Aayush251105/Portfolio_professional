import Image from "next/image";
import { site } from "@/content/site";
import { Container } from "./container";
import { Reveal } from "./reveal";
import { ResumeMenu } from "./resume-menu";
import { SectionLabel } from "./section-label";

const { about } = site;

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-16 lg:pt-24 lg:pb-24">
      <Container>
        <Reveal>
          <SectionLabel index={1} title="About" className="mb-10 lg:mb-16" />

          <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-12 md:gap-10 lg:gap-16">
            {/* Left: editorial narrative */}
            <div className="space-y-7 md:col-span-7 lg:max-w-[620px] lg:space-y-8">
              <h2 className="text-[30px] leading-[1.18] font-normal tracking-[-0.03em] text-text sm:text-[36px] lg:text-[42px]">
                {about.headline.before}
                <span className="font-medium text-accent">{about.headline.accent}</span>
                {about.headline.after}
              </h2>

              <div className="space-y-4 text-base leading-relaxed tracking-[-0.01em] text-secondary lg:text-[17px]">
                {about.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

              {/* Stats strip: hairline dividers, no cards */}
              <div className="pt-4 pb-2">
                <dl className="grid grid-cols-3 divide-x divide-border border-y border-border py-4">
                  {about.stats.map(({ label, value }, i) => (
                    <div key={label} className={i === 0 ? "pr-4 pl-1" : i === about.stats.length - 1 ? "pl-4" : "px-4"}>
                      <dt className="mb-1 block font-mono text-[11px] leading-[14px] font-medium uppercase tracking-wider text-secondary">
                        {label}
                      </dt>
                      <dd className="font-mono text-[11px] leading-[14px] font-semibold uppercase tracking-wide text-text">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex flex-col items-start gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center gap-2.5 text-[15px] leading-6 tracking-[-0.005em] text-secondary">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                  <span>{about.education}</span>
                </div>
                <ResumeMenu variant="link" />
              </div>
            </div>

            {/* Right: portrait with floating glass badge */}
            <div className="flex justify-center md:col-span-5 md:justify-end">
              <div className="relative w-full max-w-[360px]">
                <div className="relative aspect-[3/4] max-h-[470px] w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                  <Image
                    src={about.portrait.src}
                    alt={about.portrait.alt}
                    fill
                    sizes="360px"
                    loading="eager"
                    className="object-cover object-center contrast-[1.05] grayscale dark:brightness-90 dark:contrast-[1.1]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141414]/25 via-transparent to-transparent dark:from-bg/60"
                  />
                </div>

                <div className="glass absolute -bottom-5 -left-3 flex sm:-left-5 items-center gap-3 rounded-xl px-3.5 py-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                  </span>
                  <div className="flex flex-col gap-1 font-mono leading-none">
                    <span className="text-[11px] font-medium tracking-wide text-text">{about.badge.title}</span>
                    <span className="text-[10px] text-secondary">{about.badge.meta}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
