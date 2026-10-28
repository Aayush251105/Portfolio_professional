# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, served equally:

- **Recruiters and hiring managers** screening for SDE and AI Engineer roles: internships now, full-time from graduation (May 2027). They skim fast, look for proof, and decide whether to reach out.
- **Engineers judging depth**: interviewers and tech leads who open case studies, stacks, repos and live demos to see how things were actually built.

Both arrive mostly from a resume, LinkedIn or a direct link, on desktop and on phones.

## Product Purpose

The personal portfolio of Aayush Gupta: a final-year B.Tech CSE student at Shiv Nadar University, Noida (graduating May 2027), and former SDE intern at Kyndryl (May–July 2026). It exists to turn a visit into an opportunity.

A visit goes well when the visitor does any of these (all count):

- opens the resume;
- explores projects (case studies, live demos, GitHub);
- uses the AI guide to ask about Aayush and get taken around the site;
- reaches out (contact form, email or LinkedIn).

## Positioning

**A full-stack engineer who ships AI inside real products, end to end.** Not a model-only ML profile and not a generic SDE: the proof is products where AI is the core and real people used them. HireLens AI (Top 15, GoDaddy AI Buildathon), VidTube AI (deployed and used within ACM at Shiv Nadar), and the Kyndryl work (heartbeat-based failure detection, roughly 2 hours to about 6 minutes, and an AI documentation assistant employees actually used). The site's own AI guide is part of that proof.

## Operating Context

- Visitors usually arrive from a resume, LinkedIn or a shared link, often in the middle of comparing candidates.
- Recruiters spend seconds: who he is, the role he wants, availability, resume, contact. Engineers spend minutes: project stories, stacks, what was hard, links to code.
- The AI guide ("Ask about Aayush") answers about him from the site plus `content/about-me.md`, and can act on the page (scroll to sections, filter projects, open case studies and certificates, share resume and links, draft a contact message).

## Capabilities and Constraints

- Sections: Hero, About, Skills, Certifications, Projects (index + case studies), Experience, Contact + footer. Next.js App Router on Vercel; content lives in `content/site.ts`.
- Contact form via Resend (honeypot + per-IP rate limit). Until a domain is verified, mail comes from Resend's onboarding sender and can only reach the Resend account address.
- AI guide runs on Groq's free tier (about 8K tokens/minute per model, with model fallback). Keep the knowledge base compact (about 2,000 tokens for `about-me.md`); every token is paid on every question.
- Resume menu offers SDE and AI/ML entries; the AI/ML entry points at the SDE resume until a dedicated one exists.
- Motion: Lenis momentum scrolling is approved; no custom cursor (tried and removed); no parallax; respect reduced motion.
- Approved Stitch designs in `../stitch_editorial_portfolio_hero_dual_theme/` and the build brief in `../CLAUDE.md` are binding for layout and look.
- Open: project years (only HireLens is known), Apna College certificate years and two missing certificate PDFs, a dedicated AI/ML resume, a custom domain, a verified Resend sending domain.

## Brand Commitments

- Name and mark: Aayush, the "A." monogram with an accent period.
- Voice: on-page copy is first person, warm and concise, with no buzzwords or hype. The AI guide speaks about him in the third person and never invents facts.
- Privacy: public location is city level only (Hyderabad, India). Never publish phone number, home address, salary or confidential Kyndryl details (no internal application names).

## Evidence on Hand

- Content: `content/site.ts` (projects, skills, certifications, experience, links) and `content/about-me.md` (project stories, goals, how he works).
- Assets: project screenshots in `public/projects/`, certificate PDFs and previews in `public/certs/`, the SDE resume in `public/resumes/`, light and dark portraits in `public/about/`.
- Real achievements: Dean's List ×4 (Monsoon 2023, Spring 2024, Monsoon 2025, Spring 2026), CGPA 9.30, Top 15 at the GoDaddy AI Buildathon, ACM PR Lead (+20% student participation), AWS Cloud Practitioner, Google Cybersecurity and Google AI Essentials certificates.
- Absent, and must not be fabricated: testimonials or recommendations, user counts, benchmark scores (for example, SummarizerAI's), and any metric beyond those listed above.

## Product Principles

1. **Proof over claims.** Every assertion is backed by a real project, number, certificate or link; nothing is invented.
2. **Two depths, one page.** A recruiter gets the answer in seconds; an engineer can keep going into case studies and code without leaving.
3. **AI that does real work.** The AI guide takes people places and drafts their outreach, mirroring the positioning rather than decorating it.
4. **Every path ends at contact.** Resume, email, LinkedIn and the form stay within easy reach from any section.
5. **Calm craft.** Smooth and purposeful, never showy; nothing gets in the way of reading.

## Accessibility & Inclusion

WCAG 2.1 AA (axe audit at 0 violations across light and dark, 1440px and 390px), visible focus states, full keyboard use (including the case-study and certificate dialogs and the resume menu), alt text on all imagery, and `prefers-reduced-motion` respected throughout. Touch devices get no hover-dependent content.
