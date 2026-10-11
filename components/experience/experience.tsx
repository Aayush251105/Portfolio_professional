import { site } from "@/content/site";
import { Container } from "../container";
import { Reveal } from "../reveal";
import { SectionLabel } from "../section-label";
import { Timeline } from "./timeline";

const { experience } = site;

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 pt-24 pb-28">
      <Container>
        <Reveal>
          <SectionLabel index={5} title="Experience" className="mb-20" />
        </Reveal>

        <div className="grid grid-cols-12 items-start gap-16">
          <Reveal className="sticky top-32 col-span-4 space-y-4">
            <h2 className="text-[42px] leading-[1.12] font-bold tracking-tight text-text">
              {experience.headline.before}
              <span className="text-accent">{experience.headline.accent}</span>
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-secondary">{experience.intro}</p>
            <div className="flex items-center gap-3 pt-8 font-mono text-xs leading-4 uppercase text-secondary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span>{experience.status}</span>
            </div>
          </Reveal>

          <div className="col-span-8">
            <Timeline entries={experience.entries} />
          </div>
        </div>
      </Container>
    </section>
  );
}
