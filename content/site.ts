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

  about: {
    // TODO: confirm wording. Headline kept from the approved design.
    headline: { before: "I like turning ", accent: "complex systems into products", after: " that feel simple." },
    // TODO: confirm wording (role tense, Kyndryl description).
    paragraphs: [
      "Currently in my 4th year pursuing B.Tech in Computer Science Engineering at Shiv Nadar University (graduating 2027). Recognized on the Dean's List for academic distinction.",
      "As an Agentic AI intern at Kyndryl, I build agentic workflows, designing how autonomous agents plan, use tools and deliver reliable results.",
    ],
    stats: [
      { label: "Milestone", value: "Class of 2027" },
      { label: "Academic", value: "Dean's List Honoree" },
      { label: "Practice", value: "Agentic AI Intern" },
    ],
    education: "B.Tech, Computer Science Engineering · Shiv Nadar University",
    // TODO: replace with a real photo of Aayush (same 3:4 crop). Current file is the design's placeholder render.
    portrait: { src: "/about/portrait.png", alt: "Aayush working at a laptop, black and white portrait" },
    badge: { title: "Based in India", meta: "IST · UTC+5:30" },
  },

  skills: {
    headline: { before: "The tools I ", accent: "think with." },
    intro: "A focused stack across full-stack development and agentic AI workflows.",
    categories: [
      { name: "Languages", items: ["Python", "Java", "JavaScript", "TypeScript", "C", "SQL"] },
      { name: "Web & Backend", items: ["Next.js", "React", "Node.js", "Express", "Tailwind CSS", "HTML5", "CSS3"] },
      { name: "AI / ML", items: ["RAG pipelines", "Hugging Face", "T5 fine-tuning", "NumPy", "Pandas", "Agentic workflows"] },
      { name: "Data & Tools", items: ["MongoDB", "PostgreSQL", "MySQL", "Git", "GitHub", "Postman", "Vercel"] },
    ],
  },

  certifications: {
    headline: { before: "Always ", accent: "learning." },
    // TODO: confirm wording.
    intro: "Credentials across cloud, applied AI and core programming, picked up alongside coursework and internships.",
    /**
     * Source: AayushResume_SDE.pdf. TODO: add `year` and `href` (verification URL) for each;
     * cards hide the year and the "Verify" link until they're set. Issuer for the Python Bootcamp is assumed (Udemy).
     */
    items: [
      { issuer: "Amazon Web Services", title: "AWS Certified Cloud Practitioner", type: "Certification", year: "", href: "" },
      { issuer: "Google", title: "Google AI Essentials", type: "Course certificate", year: "", href: "" },
      { issuer: "Udemy", title: "The Complete Python Bootcamp", type: "Course certificate", year: "", href: "" },
    ] as { issuer: string; title: string; type: string; year: string; href: string }[],
  },

  projects: {
    headline: "Selected work.",
    /**
     * Source: AayushResume_SDE.pdf (descriptions, stacks, repo links). TODO: `year` for the first three,
     * `live` demo URLs, and HireLens AI's stack + repo. Empty values are simply not rendered.
     */
    items: [
      {
        id: "vidtube-ai",
        name: "VidTube AI",
        category: "Full-stack",
        featured: true,
        year: "",
        tag: "Full-stack · Media AI",
        summary: "An AI-powered SaaS platform for uploading, managing and transforming media with Cloudinary's AI APIs.",
        highlights: [
          "Built an AI-powered SaaS platform for uploading, managing, and transforming media using Cloudinary AI APIs.",
          "Implemented intelligent media processing: video compression, hover previews, and automatic image aspect-ratio transformations.",
          "Handled secure authentication with Clerk and optimized data management using Prisma with NeonDB (PostgreSQL).",
        ],
        stack: ["Next.js", "Node.js", "Prisma", "NeonDB", "Cloudinary", "Clerk", "Vercel"],
        github: "https://github.com/Aayush251105/VidTube-AI",
        live: "",
        preview: "vidtube",
      },
      {
        id: "booknow",
        name: "BookNow",
        category: "Full-stack",
        featured: true,
        year: "",
        tag: "Full-stack · MVC",
        summary: "A full-stack property booking platform with listing search, dynamic filtering, user reviews and complete CRUD.",
        highlights: [
          "Engineered a full-stack property booking platform using MVC architecture, featuring listing search, dynamic filtering, user reviews, and complete CRUD operations.",
          "Implemented authentication and authorization via Passport.js with server-side input validation using Joi schemas.",
          "Integrated Cloudinary for cloud-based image management and Mapbox for interactive location visualization.",
        ],
        stack: ["Node.js", "Express", "MongoDB", "EJS", "Passport.js", "Cloudinary", "Mapbox"],
        github: "https://github.com/Aayush251105/BookNow_Project",
        live: "",
        preview: "booknow",
      },
      {
        id: "summarizer-ai",
        name: "SummarizerAI",
        category: "AI-ML",
        featured: true,
        year: "",
        tag: "AI/ML · NLP",
        summary: "Dialogue summarization with a T5 transformer fine-tuned on SAMSum, served through FastAPI to a React frontend.",
        highlights: [
          "Fine-tuned a T5 Transformer model on the SAMSum dialogue dataset to generate conversation summaries.",
          "Built an end-to-end text summarization pipeline including preprocessing, tokenization, model training, and inference.",
          "Developed a React frontend and FastAPI backend for real-time AI-powered text summarization.",
        ],
        stack: ["Python", "PyTorch", "Hugging Face", "FastAPI", "React"],
        github: "https://github.com/Aayush251105/SummarizerAI",
        live: "",
        preview: "summarizer",
      },
      {
        id: "hirelens-ai",
        name: "HireLens AI",
        category: "AI-ML",
        featured: false,
        year: "2026",
        tag: "AI/ML · Top 15, GoDaddy AI Buildathon",
        summary: "An interview simulator that generates role-specific questions from a resume and job description, then evaluates answers with AI feedback.",
        highlights: [
          "Top 15 at the GoDaddy AI Buildathon (Apr 2026).",
          "Generates role-specific interview questions from a candidate's resume and the job description.",
          "Provides AI-powered feedback and evaluates candidate performance across multiple assessment metrics.",
        ],
        stack: [], // TODO: HireLens AI stack
        github: "", // TODO: repo URL
        live: "",
        preview: "hirelens",
      },
    ] as Project[],
  },

  experience: {
    headline: { before: "Where I’ve worked and ", accent: "studied." },
    // TODO: confirm wording.
    intro: "Hands-on engineering at Kyndryl alongside a Computer Science degree at Shiv Nadar University.",
    status: "Graduating class of 2027",
    /** Source: AayushResume_SDE.pdf. Newest first; the first entry gets the filled "latest" node. */
    entries: [
      {
        dates: "May 2026 — Present",
        badge: "Latest",
        role: "AI & Software Engineering Intern",
        org: "Kyndryl",
        bullets: [
          "Re-engineered the monitoring workflow for a distributed report generation system by redesigning execution pipelines, improving system observability and reliability in an Agile development environment.",
          "Designed and implemented a heartbeat-based health monitoring mechanism for long-running report executions, reducing failure detection latency by over 93% through automated failure detection.",
          "Developed an Agentic AI documentation assistant that enables conversational access to enterprise knowledge, streamlining developer onboarding and technical support.",
        ],
        tags: ["Agentic AI", "Distributed systems", "Observability", "Health monitoring", "Agile"],
      },
      {
        dates: "May 2025 — May 2026",
        badge: "",
        role: "Public Relations Lead",
        org: "ACM Shiv Nadar Chapter",
        bullets: ["Led outreach and publicity campaigns for technical events, increasing student participation by 20%."],
        tags: ["Outreach", "Event publicity", "Leadership"],
      },
      {
        dates: "Aug 2023 — May 2027",
        badge: "GPA 9.30",
        role: "B.Tech, Computer Science",
        org: "Shiv Nadar University",
        bullets: ["Dean’s List: Monsoon 2023, Spring 2024 and Monsoon 2025."],
        tags: [], // TODO: key coursework, e.g. Data Structures & Algorithms / Operating Systems
      },
    ] as ExperienceEntry[],
  },
} as const;

export type ExperienceEntry = { dates: string; badge: string; role: string; org: string; bullets: string[]; tags: string[] };

export type ProjectCategory = "Full-stack" | "AI-ML";
export type Project = {
  id: string;
  name: string;
  category: ProjectCategory;
  featured: boolean;
  year: string;
  tag: string;
  summary: string;
  highlights: string[];
  stack: string[];
  github: string;
  live: string;
  preview: "vidtube" | "booknow" | "summarizer" | "hirelens";
};

/** Resolves the email link, falling back to "#" while the address is TODO. */
export const emailHref = site.links.email ? `mailto:${site.links.email}` : "#";
