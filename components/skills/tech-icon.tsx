import {
  siC,
  siCss,
  siExpress,
  siGit,
  siGithub,
  siHtml5,
  siHuggingface,
  siJavascript,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siOpenjdk,
  siPandas,
  siPostgresql,
  siPostman,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";

/** Hand-drawn stroke glyphs for concepts that have no brand mark. */
const generic = {
  database: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  layers: "M12 3l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5M3 16l9 5 9-5",
  tune: "M4 6h10m4 0h2M4 12h4m4 0h8M4 18h12m4 0h0M14 4v4m-6 2v4m8 2v4",
  agent: "M6 5a2 2 0 100 4 2 2 0 000-4zm12 0a2 2 0 100 4 2 2 0 000-4zM12 15a2 2 0 100 4 2 2 0 000-4zM8 7h8M7.2 8.6l3.6 6.8m5.9-6.8l-3.6 6.8",
} as const;

type Meta = { icon: SimpleIcon | keyof typeof generic; short: string; note: string };

const registry: Record<string, Meta> = {
  Python: { icon: siPython, short: "PY", note: "Language" },
  Java: { icon: siOpenjdk, short: "JAVA", note: "Language" },
  JavaScript: { icon: siJavascript, short: "JS", note: "Language" },
  TypeScript: { icon: siTypescript, short: "TS", note: "Typed JavaScript" },
  C: { icon: siC, short: "C", note: "Systems language" },
  SQL: { icon: "database", short: "SQL", note: "Query language" },
  "Next.js": { icon: siNextdotjs, short: "NEXT", note: "React framework" },
  React: { icon: siReact, short: "REACT", note: "UI library" },
  "Node.js": { icon: siNodedotjs, short: "NODE", note: "JS runtime" },
  Express: { icon: siExpress, short: "EXPRESS", note: "Web framework" },
  "Tailwind CSS": { icon: siTailwindcss, short: "TW", note: "Utility CSS" },
  HTML5: { icon: siHtml5, short: "HTML", note: "Markup" },
  CSS3: { icon: siCss, short: "CSS", note: "Styling" },
  "RAG pipelines": { icon: "layers", short: "RAG", note: "Retrieval-augmented generation" },
  "Hugging Face": { icon: siHuggingface, short: "HF", note: "Model hub" },
  "T5 fine-tuning": { icon: "tune", short: "T5", note: "Seq2seq fine-tuning" },
  NumPy: { icon: siNumpy, short: "NUMPY", note: "Numerical computing" },
  Pandas: { icon: siPandas, short: "PANDAS", note: "Data analysis" },
  "Agentic workflows": { icon: "agent", short: "AGENTS", note: "Tool-using agents" },
  MongoDB: { icon: siMongodb, short: "MONGO", note: "Document database" },
  PostgreSQL: { icon: siPostgresql, short: "PGSQL", note: "Relational database" },
  MySQL: { icon: siMysql, short: "MYSQL", note: "Relational database" },
  Git: { icon: siGit, short: "GIT", note: "Version control" },
  GitHub: { icon: siGithub, short: "GITHUB", note: "Code hosting" },
  Postman: { icon: siPostman, short: "POSTMAN", note: "API testing" },
  Vercel: { icon: siVercel, short: "VERCEL", note: "Deployment" },
};

export function techMeta(name: string): Meta {
  return registry[name] ?? { icon: "layers", short: name.toUpperCase(), note: "" };
}

/** True when the tech has a real brand mark (generic concept glyphs are left out of the marquee). */
export const hasBrandIcon = (name: string) => typeof techMeta(name).icon !== "string";

/**
 * Hover colour for an icon. Brand colour where the palette allows it; blue/indigo/purple brands
 * fall back to the accent (the palette bans those hues), and near-black brands use the text colour
 * so they stay visible in dark mode.
 */
export function brandColor(name: string): string {
  const { icon } = techMeta(name);
  if (typeof icon === "string") return "var(--accent)";
  const n = parseInt(icon.hex, 16);
  const [r, g, b] = [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (luminance < 0.12) return "var(--text)";
  if (max - min < 0.08) return "var(--text)";
  let hue = 0;
  if (max === r) hue = ((g - b) / (max - min)) % 6;
  else if (max === g) hue = (b - r) / (max - min) + 2;
  else hue = (r - g) / (max - min) + 4;
  hue = (hue * 60 + 360) % 360;
  if (hue >= 175 && hue <= 320) return "var(--accent)";
  return `#${icon.hex}`;
}

export function TechIcon({ name, className = "" }: { name: string; className?: string }) {
  const { icon } = techMeta(name);
  if (typeof icon === "string") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
        <path d={generic[icon]} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={icon.path} />
    </svg>
  );
}
