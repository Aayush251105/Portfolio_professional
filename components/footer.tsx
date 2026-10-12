import { cacheLife } from "next/cache";
import { site } from "@/content/site";
import { Container } from "./container";

/** Prerendered with the page; revalidates daily so the year rolls over without a redeploy. */
async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await currentYear();
  return (
    <footer className="pb-10">
      <Container>
        <div className="mb-6 h-px w-full bg-border" />
        <div data-chat-avoid className="flex flex-col items-center gap-3 font-mono sm:flex-row sm:justify-between text-[11px] leading-[14px] font-medium tracking-[0.06em] text-secondary">
          <span>© {year} {site.name}</span>
          <span>{site.contact.footer.credit}</span>
          <a href="#top" className="group inline-flex items-center gap-1 transition-colors duration-200 ease-brand hover:text-accent-ink">
            Back to top
            <span aria-hidden className="transition-transform duration-300 ease-brand group-hover:-translate-y-0.5">
              ↑
            </span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
