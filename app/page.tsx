import { About } from "@/components/about";
import { Certifications } from "@/components/certifications/certifications";
import { Contact } from "@/components/contact/contact";
import { Experience } from "@/components/experience/experience";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Projects } from "@/components/projects/projects";
import { Skills } from "@/components/skills/skills";
import { personJsonLd } from "@/lib/seo";

// Escape "<" as < so the JSON can never close the <script> tag early.
const jsonLd = JSON.stringify(personJsonLd).replace(/</g, `${String.fromCharCode(92)}u003c`);

export default function Home() {
  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Skills />
        <Certifications />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
