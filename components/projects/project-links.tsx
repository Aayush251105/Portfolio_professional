import type { Project } from "@/content/site";
import { ArrowLink } from "../arrow-link";

/** Live / GitHub text links; renders nothing until at least one URL is set. */
export function ProjectLinks({ project }: { project: Project }) {
  if (!project.live && !project.github) return null;
  return (
    <div className="flex items-center gap-6 pt-3 font-mono text-xs leading-4 font-medium tracking-[0.04em]">
      {project.live && (
        <ArrowLink href={project.live} external className="text-text">
          Live
        </ArrowLink>
      )}
      {project.github && (
        <ArrowLink href={project.github} external className="text-secondary">
          GitHub
        </ArrowLink>
      )}
    </div>
  );
}
