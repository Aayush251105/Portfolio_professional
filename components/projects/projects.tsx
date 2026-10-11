import { Container } from "../container";
import { Reveal } from "../reveal";
import { SectionLabel } from "../section-label";
import { ProjectIndex } from "./project-index";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 pt-24 pb-24">
      <Container>
        <Reveal>
          <SectionLabel index={4} title="Projects" className="mb-4" />
          <ProjectIndex />
        </Reveal>
      </Container>
    </section>
  );
}
