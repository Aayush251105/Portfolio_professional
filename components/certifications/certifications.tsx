import { site } from "@/content/site";
import { Container } from "../container";
import { Reveal } from "../reveal";
import { SectionLabel } from "../section-label";
import { CertCarousel } from "./cert-carousel";

const { certifications } = site;

export function Certifications() {
  return (
    <section id="certifications" className="relative scroll-mt-24 overflow-x-clip py-16 lg:pt-24 lg:pb-24">
      {/* Ambient warm glow behind the cards (dark only, as in the design) so the card glass reads */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[45%] left-[22%] hidden h-[340px] w-[580px] rounded-full bg-accent/10 blur-[120px] dark:block"
      />

      <Container className="relative">
        <Reveal>
          <SectionLabel index={3} title="Certifications" className="mb-9" />
          <CertCarousel headline={certifications.headline} intro={certifications.intro} items={certifications.items} />
        </Reveal>
      </Container>
    </section>
  );
}
