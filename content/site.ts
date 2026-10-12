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
   * Resume variants shown in the Resume menus (files live in /public/resumes).
   * TODO: add the AI / ML resume's `href`. An entry with an empty `href` renders as "Soon".
   */
  resumes: [
    { label: "Software Engineering", note: "Full-stack & backend roles", href: "/resumes/AayushResume_SDE.pdf" },
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
    // `darkSrc` is optional: a version of the photo on a dark backdrop, shown in dark mode.
    portrait: { src: "/about/portrait.jpg", darkSrc: "/about/portrait-dark.jpg", alt: "Portrait of Aayush Gupta" },
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
     * Sources: previous portfolio, the certificate PDFs in /public/certs and verification links.
     * `image` (a preview rendered from the PDF by scripts/render-certs.py) opens the in-page viewer;
     * `href` is the issuer's verification page. TODO: years for the Apna College courses.
     */
    items: [
      {
        id: "aws-cloud-practitioner",
        issuer: "Amazon Web Services",
        title: "AWS Certified Cloud Practitioner",
        type: "Certification",
        year: "2026",
        href: "https://www.credly.com/badges/eeff9b65-f5c4-4502-8b7b-ae67d06e30e8",
        pdf: "/certs/aws-cloud-practitioner.pdf",
        image: { src: "/certs/previews/aws-cloud-practitioner.jpg", width: 1600, height: 1237 },
      },
      {
        id: "google-cybersecurity",
        issuer: "Google · Coursera",
        title: "Google Cybersecurity Professional Certificate",
        type: "Professional certificate",
        year: "2024",
        href: "https://www.coursera.org/account/accomplishments/specialization/F87Y8YT7SZSZ",
        pdf: "/certs/google-cybersecurity.pdf",
        image: { src: "/certs/previews/google-cybersecurity.jpg", width: 1600, height: 1237 },
      },
      {
        id: "google-ai-essentials",
        issuer: "Google · Coursera",
        title: "Google AI Essentials",
        type: "Course certificate",
        year: "2024",
        href: "https://www.coursera.org/account/accomplishments/verify/A7YF36G7XNMF",
        pdf: "/certs/google-ai-essentials.pdf",
        image: { src: "/certs/previews/google-ai-essentials.jpg", width: 1600, height: 1237 },
      },
      {
        id: "python-bootcamp",
        issuer: "Udemy",
        title: "The Complete Python Bootcamp",
        type: "Course certificate",
        year: "2024",
        href: "https://www.udemy.com/certificate/UC-af94d237-a6b6-471d-a77c-0045da8bfdfc/",
        pdf: "/certs/python-bootcamp.pdf",
        image: { src: "/certs/previews/python-bootcamp.jpg", width: 1600, height: 1190 },
      },
      {
        id: "apna-alpha-dsa",
        issuer: "Apna College",
        title: "Alpha: DSA with Java",
        type: "Course certificate",
        year: "",
        href: "",
        pdf: "/certs/apna-college-alpha-dsa-java.pdf",
        image: { src: "/certs/previews/apna-college-alpha-dsa-java.jpg", width: 1600, height: 1132 },
      },
      { id: "apna-sigma-web", issuer: "Apna College", title: "Web Development: Sigma 7.0", type: "Course", year: "", href: "" },
      { id: "apna-prime-aiml", issuer: "Apna College", title: "AI / ML: Prime 1.0", type: "Course", year: "", href: "" },
    ] as Certification[],
  },

  projects: {
    headline: "Selected work.",
    /**
     * Sources: Aayush's previous portfolio (summaries, stacks, repos, live links, screenshots in /public/projects)
     * and AayushResume_SDE.pdf (case-study highlights). TODO: `year` for each (only HireLens is known).
     * Empty values are simply not rendered; projects without an `image` show their illustrated preview.
     */
    items: [
      {
        id: "vidtube-ai",
        name: "VidTube AI",
        categories: ["Full-stack", "AI-ML"],
        featured: true,
        year: "",
        tag: "Full-stack · Media AI",
        summary:
          "AI-powered SaaS platform for uploading, managing and transforming media with Cloudinary's AI APIs, with automated video compression and intelligent previews.",
        highlights: [
          "Built an AI-powered SaaS platform for uploading, managing, and transforming media using Cloudinary AI APIs.",
          "Implemented intelligent media processing: video compression, hover previews, and automatic image aspect-ratio transformations.",
          "Handled secure authentication with Clerk and optimized data management using Prisma with NeonDB (PostgreSQL).",
        ],
        stack: ["Next.js", "React", "TypeScript", "Prisma", "NeonDB", "Cloudinary", "Clerk"],
        github: "https://github.com/Aayush251105/VidTube-AI",
        live: "https://vid-tube-ai.vercel.app/",
        image: "/projects/vidtube.png",
        preview: "vidtube",
      },
      {
        id: "booknow",
        name: "BookNow",
        categories: ["Full-stack"],
        featured: false,
        year: "",
        tag: "Full-stack · MVC",
        summary:
          "Full-stack property booking platform built on MVC, with browsing, filtering, interactive maps and secure authentication.",
        highlights: [
          "Engineered a full-stack property booking platform using MVC architecture, featuring listing search, dynamic filtering, user reviews, and complete CRUD operations.",
          "Implemented authentication and authorization via Passport.js with server-side input validation using Joi schemas.",
          "Integrated Cloudinary for cloud-based image management and Mapbox for interactive location visualization.",
        ],
        stack: ["Node.js", "Express", "MongoDB", "EJS", "Passport.js", "Cloudinary", "Mapbox"],
        github: "https://github.com/Aayush251105/BookNow_Project",
        live: "https://booknow-s4kr.onrender.com/",
        image: "/projects/booknow.png",
        preview: "booknow",
      },
      {
        id: "questflow",
        name: "Questflow",
        categories: ["Full-stack"],
        featured: false,
        year: "",
        tag: "Full-stack · Community Q&A",
        summary:
          "Full-stack Q&A platform inspired by Stack Overflow, with reputation systems, custom dashboards and community-driven engagement.",
        highlights: [],
        stack: ["Next.js", "React", "TypeScript", "Appwrite"],
        github: "https://github.com/Aayush251105/Proj-QuestFlow",
        live: "",
        image: "/projects/questflow.png",
      },
      {
        id: "hirelens-ai",
        name: "HireLens AI",
        categories: ["AI-ML", "Full-stack"],
        featured: true,
        year: "2026",
        tag: "AI/ML · Top 15, GoDaddy AI Buildathon",
        summary:
          "AI talent-assessment tool for high-volume technical hiring: role-specific interview questions from a resume and job description, automated screening and AI-driven candidate evaluation.",
        highlights: [
          "Top 15 at the GoDaddy AI Buildathon (Apr 2026).",
          "Generates role-specific interview questions from a candidate's resume and the job description.",
          "Provides AI-powered feedback and evaluates candidate performance across multiple assessment metrics.",
        ],
        stack: ["React", "Python", "FastAPI", "TiDB"],
        github: "https://github.com/Aayush251105/HireLens-AI",
        live: "https://hirelens-ai-q1fa.onrender.com",
        image: "/projects/hirelens.png",
        preview: "hirelens",
      },
      {
        id: "virtual-tryon",
        name: "Virtual Try-On",
        categories: ["AI-ML", "Full-stack"],
        featured: true,
        year: "",
        tag: "AI/ML · Computer vision",
        summary: "AI-powered virtual clothing try-on that uses computer-vision models for realistic garment visualization.",
        highlights: [],
        stack: ["React", "Python", "FastAPI"],
        github: "https://github.com/Aayush251105/VirtualTryOn",
        live: "",
        image: "/projects/virtual-tryon.png",
      },
      {
        id: "summarizer-ai",
        name: "SummarizerAI",
        categories: ["AI-ML"],
        featured: false,
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
        id: "fitrack",
        name: "FiTrack",
        categories: ["Full-stack"],
        featured: false,
        year: "",
        tag: "Full-stack · Personal finance",
        summary: "Personal finance tracker with automated expense categorization and visual budget analytics.",
        highlights: [],
        stack: ["React", "Firebase", "Chart.js"],
        github: "https://github.com/Aayush251105/FiTrack",
        live: "",
        image: "/projects/fitrack.png",
      },
      {
        id: "nlp-spellchecker",
        name: "NLP Spellchecker",
        categories: ["AI-ML"],
        featured: false,
        year: "",
        tag: "AI/ML · NLP",
        summary: "Spellchecker built on NLP techniques, with multi-category evaluation and mutation-based testing.",
        highlights: [],
        stack: ["Python", "NLP", "NumPy"],
        github: "https://github.com/Aayush251105/SpellCorrectionSystem_NLP",
        live: "",
        image: "/projects/spellchecker.png",
      },
      {
        id: "arts",
        name: "ARTS",
        categories: ["Full-stack"],
        featured: true,
        year: "",
        tag: "Full-stack · Airline reservations",
        summary: "Airline reservation and ticketing system with flight search, a full booking flow and seat management.",
        highlights: [],
        stack: ["Java", "Spring Boot", "React", "MySQL"],
        github: "https://github.com/Aayush251105/ARTS_Proj",
        live: "",
        image: "/projects/arts.png",
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

  contact: {
    headline: { before: "Let’s build something", accent: "worth shipping." },
    // TODO: confirm availability wording.
    intro: "Open to internships and full-time roles starting 2027.",
    footer: { credit: "Designed and built by me" },
  },
} as const;

export type Certification = {
  id: string;
  issuer: string;
  title: string;
  type: string;
  year: string;
  /** Issuer's verification page. */
  href: string;
  pdf?: string;
  image?: { src: string; width: number; height: number };
};

export type ExperienceEntry = { dates: string; badge: string; role: string; org: string; bullets: string[]; tags: string[] };

export type ProjectCategory = "Full-stack" | "AI-ML";
export type Project = {
  id: string;
  name: string;
  /** First entry is the label shown in the index; the project appears under every listed filter. */
  categories: ProjectCategory[];
  featured: boolean;
  year: string;
  tag: string;
  summary: string;
  highlights: string[];
  stack: string[];
  github: string;
  live: string;
  /** Screenshot in /public/projects; falls back to the illustrated `preview` when absent. */
  image?: string;
  preview?: "vidtube" | "booknow" | "summarizer" | "hirelens";
};

/** Resolves the email link, falling back to "#" while the address is TODO. */
export const emailHref = site.links.email ? `mailto:${site.links.email}` : "#";
