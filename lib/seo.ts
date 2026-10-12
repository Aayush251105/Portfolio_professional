import { site } from "@/content/site";

/**
 * Canonical origin for absolute URLs (Open Graph, sitemap, JSON-LD).
 * Set NEXT_PUBLIC_SITE_URL once the custom domain is known; on Vercel, the production domain is used automatically.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const seo = {
  fullName: "Aayush Gupta",
  title: "Aayush Gupta — Software Engineer · AI/ML",
  description:
    "Aayush Gupta is a software engineer building full-stack products and agentic AI systems. B.Tech CSE at Shiv Nadar University, AI & Software Engineering intern at Kyndryl.",
  jobTitle: "Software Engineer",
  keywords: ["Aayush Gupta", "software engineer", "AI/ML", "agentic AI", "full-stack developer", "Next.js", "portfolio", "Shiv Nadar University"],
};

/** schema.org Person, from facts in content/site.ts and the resume. */
export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: seo.fullName,
  url: siteUrl,
  jobTitle: seo.jobTitle,
  email: `mailto:${site.links.email}`,
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Shiv Nadar University" },
  worksFor: { "@type": "Organization", name: "Kyndryl" },
  sameAs: [site.links.github, site.links.linkedin],
  knowsAbout: site.skills.categories.flatMap((c) => c.items),
};
