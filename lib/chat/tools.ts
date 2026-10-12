import "server-only";
import { site } from "@/content/site";
import { certIds, projectIds } from "./knowledge";

/** What the route streams to the browser, one JSON object per line. */
export type ChatEvent =
  | { type: "text"; text: string }
  | { type: "action"; action: ChatAction }
  | { type: "error"; text: string }
  | { type: "done" };

export type LinkKind = "resume" | "github" | "linkedin" | "email";

/** Site actions plus `link`, which the chat renders as a button instead of acting on the page. */
export type ChatAction =
  | { type: "navigate"; section: (typeof sections)[number] }
  | { type: "filter_projects"; filter: (typeof filters)[number] }
  | { type: "show_project"; id: string }
  | { type: "show_certificate"; id: string }
  | { type: "prefill_contact"; message: string }
  | { type: "link"; kind: LinkKind; label: string; href: string };

const sections = ["about", "skills", "certifications", "projects", "experience", "contact"] as const;
const filters = ["All", "Full-stack", "AI-ML"] as const;
const linkKinds = ["resume", "github", "linkedin", "email"] as const;

const fn = (name: string, description: string, properties: Record<string, unknown>) => ({
  type: "function" as const,
  function: { name, description, parameters: { type: "object", properties, required: Object.keys(properties), additionalProperties: false } },
});

/** OpenAI-format tool definitions (Groq is OpenAI-compatible). Descriptions are kept short to save tokens. */
export const tools = [
  fn("navigate_to_section", "Scroll the page to a section.", { section: { type: "string", enum: sections } }),
  fn("filter_projects", "Filter the projects list by category and scroll to it.", { filter: { type: "string", enum: filters } }),
  fn("show_project", "Open a project's case study.", { id: { type: "string", enum: projectIds } }),
  fn("show_certificate", "Open a certificate preview.", { id: { type: "string", enum: certIds } }),
  fn("provide_link", "Show a button linking to his resume, GitHub, LinkedIn or email.", { kind: { type: "string", enum: linkKinds } }),
  fn("prefill_contact", "Draft a message in the site's contact form for the visitor to review and send.", {
    message: { type: "string", description: "The draft, written as the visitor, max 500 chars." },
  }),
];

const resume = site.resumes.find((r) => r.href);
const linkFor: Record<LinkKind, { label: string; href: string } | null> = {
  resume: resume ? { label: "Resume (PDF)", href: resume.href } : null,
  github: { label: "GitHub", href: site.links.github },
  linkedin: { label: "LinkedIn", href: site.links.linkedin },
  email: { label: site.links.email, href: `mailto:${site.links.email}` },
};

const oneOf = <T extends string>(list: readonly T[], v: unknown): v is T => typeof v === "string" && list.includes(v as T);

/** Validates a model tool call and turns it into an action; anything malformed is dropped. */
export function toAction(name: string, rawArgs: string): ChatAction | null {
  let args: Record<string, unknown>;
  try {
    args = JSON.parse(rawArgs || "{}");
  } catch {
    return null;
  }
  switch (name) {
    case "navigate_to_section":
      return oneOf(sections, args.section) ? { type: "navigate", section: args.section } : null;
    case "filter_projects":
      return oneOf(filters, args.filter) ? { type: "filter_projects", filter: args.filter } : null;
    case "show_project":
      return oneOf(projectIds, args.id) ? { type: "show_project", id: args.id } : null;
    case "show_certificate":
      return oneOf(certIds, args.id) ? { type: "show_certificate", id: args.id } : null;
    case "provide_link": {
      if (!oneOf(linkKinds, args.kind)) return null;
      const link = linkFor[args.kind];
      return link && { type: "link", kind: args.kind, ...link };
    }
    case "prefill_contact":
      return typeof args.message === "string" && args.message.trim()
        ? { type: "prefill_contact", message: args.message.trim().slice(0, 500) }
        : null;
    default:
      return null;
  }
}

const sectionLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** One-line reply for when the model called a tool without writing any text (saves a second request). */
export function confirmation(action: ChatAction): string {
  switch (action.type) {
    case "navigate":
      return `Here's the ${sectionLabel(action.section)} section.`;
    case "filter_projects":
      return action.filter === "All" ? "Here are all of Aayush's projects." : `Here are his ${action.filter === "AI-ML" ? "AI/ML" : "full-stack"} projects.`;
    case "show_project":
      return `Opened the ${site.projects.items.find((p) => p.id === action.id)?.name ?? "project"} case study.`;
    case "show_certificate":
      return `Here's his ${site.certifications.items.find((c) => c.id === action.id)?.title ?? "certificate"}.`;
    case "link":
      return action.kind === "email" ? "You can reach Aayush by email:" : `Here's his ${action.kind === "resume" ? "resume" : action.label}:`;
    case "prefill_contact":
      return "I've drafted a message in the contact form. Add your name and email, check it over and hit send.";
  }
}
