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
  location: "Hyderabad, India",
  timezone: "IST / UTC+5:30",

  links: {
    github: "https://github.com/Aayush251105",
    linkedin: "https://www.linkedin.com/in/aayush-gupta-b6066b290/",
    email: "aayushgupta054@gmail.com",
  },

  /**
   * Resume variants shown in the Resume menus (files live in /public/resumes).
   * With a single ready resume the Resume buttons open it directly; with two or more they open a menu.
   * TODO: add the AI / ML resume's `href` when it exists.
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
    intro: {
      name: "Aayush Gupta",
      text: ", a full-stack engineer taking products with AI at their core from first idea to something people actually use.",
    },
    status: {
      label: "Status",
      badge: "Available",
      title: "Open to opportunities · Graduating 2027",
      // Built from known facts. TODO: replace with what Aayush is looking for (role type / timing).
      note: "Former SDE intern at Kyndryl. 4th-year B.Tech CSE at Shiv Nadar University.",
      meta: "B.Tech",
    },
  },

  about: {
    // TODO: confirm wording. Headline kept from the approved design.
    headline: { before: "I like turning ", accent: "complex systems into products", after: " that feel simple." },
    // TODO: confirm wording (role tense, Kyndryl description).
    paragraphs: [
      "Currently in my 4th year pursuing B.Tech in Computer Science Engineering at Shiv Nadar University (graduating 2027). Named to the Dean's List four times for academic distinction.",
      "As an SDE intern at Kyndryl (May to July 2026), I built heartbeat-based failure detection for long-running report jobs and an AI documentation assistant that put scattered enterprise docs one question away.",
    ],
    stats: [
      { label: "Milestone", value: "Class of 2027" },
      { label: "Academic", value: "Dean's List ×4" },
      { label: "Experience", value: "SDE Intern · Kyndryl" },
    ],
    education: "B.Tech, Computer Science Engineering · Shiv Nadar University",
    // `darkSrc` is optional: a version of the photo on a dark backdrop, shown in dark mode.
    portrait: { src: "/about/portrait.jpg", darkSrc: "/about/portrait-dark.jpg", alt: "Portrait of Aayush Gupta" },
    badge: { title: "Based in Hyderabad", meta: "IST · UTC+5:30" },
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
        type: "Career certificate",
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
     * Sources: Aayush's previous portfolio (summaries, stacks, repos, live links, screenshots in /public/projects),
     * AayushResume_SDE.pdf (highlights) and content/about-me.md (the `story` blocks, drafted for Aayush to refine).
     * Ordered by strength; the first featured project is pre-selected. TODO: `year` for each (only HireLens is known).
     * Empty values are simply not rendered; projects without an `image` show their illustrated preview.
     */
    items: [
      {
        id: "hirelens-ai",
        name: "HireLens AI",
        categories: ["AI-ML", "Full-stack"],
        featured: true,
        year: "2026",
        tag: "AI/ML · Interview simulator",
        award: "Top 15 · GoDaddy AI Buildathon",
        summary:
          "AI interview simulator: it asks role-specific questions from your resume and an optional job description, then assesses your answers and your fit for the role.",
        highlights: [],
        story: [
          {
            label: "The problem",
            text: "Preparing for an interview rarely shows how well you fit a specific role. HireLens rehearses the interview and assesses the fit.",
          },
          {
            label: "What I built",
            text: "Built solo: upload or paste a resume, pick an interviewer persona (big tech, startup or HR) and optionally add a job description. Groq generates three questions, then evaluates the answers with feedback, a summary and improvement tips. Signed-in users (Clerk) save results to TiDB.",
          },
          {
            label: "Outcome",
            text: "Top 15 at a university-wide GoDaddy AI Buildathon (Apr 2026), entered individually.",
          },
        ],
        stack: ["React", "Python", "FastAPI", "Groq", "Clerk", "TiDB"],
        github: "https://github.com/Aayush251105/HireLens-AI",
        live: "https://hirelens-ai-q1fa.onrender.com",
        image: "/projects/hirelens.png",
        preview: "hirelens",
      },
      {
        id: "vidtube-ai",
        name: "VidTube AI",
        categories: ["Full-stack", "AI-ML"],
        featured: true,
        year: "",
        tag: "Full-stack · Media AI",
        summary:
          "AI-powered SaaS platform for uploading, managing and transforming media with Cloudinary's AI APIs, with automated video compression and intelligent previews.",
        highlights: [],
        story: [
          {
            label: "Why I built it",
            text: "It started as a YouTube-style app. At ACM, student teams needed images cropped to the aspect ratio each social platform expects, so I rebuilt it around Cloudinary's AI media APIs.",
          },
          {
            label: "What I built",
            text: "Built solo: uploads, AI video compression, hover previews and automatic aspect-ratio crops, with Clerk authentication and Prisma on NeonDB (PostgreSQL).",
          },
          {
            label: "Outcome",
            text: "Deployed and used within ACM at Shiv Nadar. Free-tier hosting currently caps media quality and the number of uploads.",
          },
        ],
        stack: ["Next.js", "React", "TypeScript", "Prisma", "NeonDB", "Cloudinary", "Clerk"],
        github: "https://github.com/Aayush251105/VidTube-AI",
        live: "https://vid-tube-ai.vercel.app/",
        image: "/projects/vidtube.png",
        preview: "vidtube",
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
        story: [
          {
            label: "The idea",
            text: "Show how a garment looks on a person with computer vision, as a usable application rather than a model demo.",
          },
          {
            label: "My part",
            text: "A team project built around the open-source FASHN VTON model. I built the surrounding system, tuned hyperparameters and organised the workflow into an end-to-end pipeline.",
          },
          {
            label: "What I learned",
            text: "How to take an existing computer-vision model and integrate it into a larger application, working as a team.",
          },
        ],
        stack: ["React", "Python", "FastAPI"],
        github: "https://github.com/Aayush251105/VirtualTryOn",
        live: "",
        image: "/projects/virtual-tryon.png",
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
        story: [
          {
            label: "Why I built it",
            text: "To learn how property-booking platforms actually work, from listings and maps to authentication and the booking flow.",
          },
        ],
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
        id: "summarizer-ai",
        name: "SummarizerAI",
        categories: ["AI-ML"],
        featured: false,
        year: "",
        tag: "AI/ML · NLP",
        summary: "Dialogue summarization with a T5 transformer fine-tuned on SAMSum, served through FastAPI to a React frontend.",
        story: [
          {
            label: "Why I built it",
            text: "To understand how a pretrained transformer is adapted to one task: working with a conversational dataset and building the fine-tuning workflow end to end.",
          },
        ],
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
        featured: false,
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
        dates: "May 2026 — Jul 2026",
        badge: "Internship",
        role: "SDE Intern",
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
        bullets: ["Dean’s List: Monsoon 2023, Spring 2024, Monsoon 2025 and Spring 2026."],
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
  /** External recognition, shown with the project (e.g. a placement). */
  award?: string;
  /** Short labelled blocks for the case study: why it exists, what was built, what came of it. */
  story?: { label: string; text: string }[];
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
