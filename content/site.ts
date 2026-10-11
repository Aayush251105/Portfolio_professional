/**
 * Single source of truth for all copy on the site.
 *
 * Anything Aayush has not supplied yet is marked with `TODO` — search the
 * repo for "TODO" before launch. Placeholder copy from the Stitch designs
 * (fake projects, metrics, certificates, versions) must never land here.
 */

export type NavId = "about" | "skills" | "projects" | "experience" | "contact";

export const site = {
  name: "Aayush",
  monogram: "A",
  location: "India",
  timezone: "IST / UTC+5:30",

  links: {
    github: "https://github.com/Aayush251105",
    linkedin: "https://www.linkedin.com/in/aayush-gupta-b6066b290/",
    email: "aayushgupta054@gmail.com",
  },

  /**
   * Resume variants shown in the hero's Resume menu.
   * TODO: drop the PDFs into /public/resume/ and set each `href` (e.g. "/resume/aayush-swe.pdf").
   * An entry with an empty `href` renders as "Coming soon".
   */
  resumes: [
    { label: "Software Engineering", note: "Full-stack & backend roles", href: "" },
    { label: "AI / ML", note: "ML engineering & research", href: "" },
  ] as { label: string; note: string; href: string }[],

  nav: [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "contact", label: "Contact" },
  ] satisfies { id: NavId; label: string }[],

  hero: {
    eyebrow: ["Software Engineer", "AI/ML", "Class of 2027"],
    headline: { before: "I build ", accent: "intelligent", after: " software that feels effortless." },
    // TODO: confirm or rewrite. Kept from the approved design as a draft; makes no factual claims.
    intro:
      "Bridging robust systems engineering and cutting-edge neural models to deliver products of quiet clarity and speed.",
    status: {
      label: "Status",
      badge: "Available",
      title: "Open to opportunities · Graduating 2027",
      // Built from known facts. TODO: replace with what Aayush is looking for (role type / timing).
      note: "Agentic AI intern at Kyndryl. 4th-year B.Tech CSE at Shiv Nadar University.",
      meta: "B.Tech",
    },
  },
} as const;

/** Resolves the email link, falling back to "#" while the address is TODO. */
export const emailHref = site.links.email ? `mailto:${site.links.email}` : "#";
