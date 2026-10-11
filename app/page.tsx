import { About } from "@/components/about";
import { Certifications } from "@/components/certifications/certifications";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Projects } from "@/components/projects/projects";
import { Skills } from "@/components/skills/skills";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Certifications />
        <Projects />
      </main>
    </>
  );
}
