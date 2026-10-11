import { site } from "@/content/site";
import { Container } from "../container";
import { Reveal } from "../reveal";
import { SectionLabel } from "../section-label";
import { Timeline } from "./timeline";

const { experience } = site;

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-16 lg:pt-24 lg:pb-28">
      <Container>
        <Reveal>
          <SectionLabel index={5} title="Experience" className="mb-10 lg:mb-20" />
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="space-y-4 lg:sticky lg:top-32 lg:col-span-4">
            <h2 className="text-[34px] leading-[1.12] font-bold tracking-tight text-text lg:text-[42px]">
              {experience.headline.before}
              <span className="text-accent">{experience.headline.accent}</span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-secondary">{experience.intro}</p>
            <div className="flex items-center gap-3 pt-3 font-mono lg:pt-8 text-xs leading-4 uppercase text-secondary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span>{experience.status}</span>
            </div>
          </Reveal>

          <div className="lg:col-span-8">
            <Timeline entries={experience.entries} />
          </div>
        </div>
      </Container>
    </section>
  );
}
