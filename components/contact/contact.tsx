import { site } from "@/content/site";
import { ArrowLink } from "../arrow-link";
import { Container } from "../container";
import { ResumeMenu } from "../resume-menu";
import { Reveal } from "../reveal";
import { SectionLabel } from "../section-label";
import { ContactForm } from "./contact-form";

const { contact } = site;

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 overflow-x-clip py-16 lg:pt-24 lg:pb-20">
      <Container>
        <Reveal>
          <SectionLabel index={6} title="Contact" className="mb-10 lg:mb-16" />
        </Reveal>

        <div className="relative flex flex-col items-center">
          {/* Warm glow under the composer so its glass reads (dark only: the light value is invalid in the design) */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-12 left-1/2 hidden h-[340px] w-[580px] -translate-x-1/2 rounded-full bg-accent/12 blur-[96px] dark:block"
          />

          <Reveal className="relative z-10 mb-10 max-w-3xl text-center lg:mb-12">
            <h2 className="text-[40px] leading-[1.05] font-normal tracking-[-0.035em] text-text sm:text-[56px] lg:text-[72px]">
              {contact.headline.before}
              <br />
              <span className="text-accent">{contact.headline.accent}</span>
            </h2>
            <p className="mt-4 text-base leading-7 tracking-[-0.01em] text-secondary sm:text-lg">{contact.intro}</p>
          </Reveal>

          <Reveal delay={0.08} className="flex w-full justify-center">
            <ContactForm email={site.links.email} />
          </Reveal>

          <div className="mt-8 flex items-center justify-center gap-6 font-mono sm:gap-8 text-xs leading-4 font-medium tracking-[0.04em] text-secondary">
            <ArrowLink href={site.links.github} external>
              GitHub
            </ArrowLink>
            <ArrowLink href={site.links.linkedin} external>
              LinkedIn
            </ArrowLink>
            <ResumeMenu variant="inline" />
          </div>
        </div>
      </Container>
    </section>
  );
}
