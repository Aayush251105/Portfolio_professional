import Image from "next/image";
import type { Project } from "@/content/site";
import { ProjectPreview } from "./previews";

/** Address-bar text for the preview chrome: the live domain, else the GitHub repo path. */
export function displayUrl(project: Project) {
  const source = project.live || project.github;
  if (!source) return project.id;
  try {
    const url = new URL(source);
    return (url.host + url.pathname).replace(/\/$/, "").replace(/\.git$/, "");
  } catch {
    return project.id;
  }
}

/**
 * Screenshot when the project has one (top-anchored, settles from a slight zoom when shown);
 * otherwise the illustrated UI mock. Fills its parent; the parent sets height, border and radius.
 */
export function ProjectVisual({ project, shown = true, sizes }: { project: Project; shown?: boolean; sizes: string }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`${project.name} screenshot`}
        fill
        sizes={sizes}
        className={`object-cover object-top transition-transform duration-[900ms] ease-brand motion-reduce:transition-none ${shown ? "scale-100" : "scale-[1.04]"}`}
      />
    );
  }
  return (
    <div className="relative h-full p-3.5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--text)_1px,transparent_1px)] [background-size:12px_12px] opacity-[0.03]" />
      <div className="relative h-full">{project.preview && <ProjectPreview kind={project.preview} />}</div>
    </div>
  );
}
