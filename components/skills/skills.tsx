import { site } from "@/content/site";
import { Container } from "../container";
import { Reveal } from "../reveal";
import { SectionLabel } from "../section-label";
import { brandColor, hasBrandIcon, TechIcon, techMeta } from "./tech-icon";

const { skills } = site;

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 overflow-x-clip py-16 lg:pt-24 lg:pb-24">
      <Container>
        <Reveal>
          <SectionLabel index={2} title="Skills" className="mb-10 lg:mb-16" />

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="space-y-4 lg:sticky lg:top-28 lg:col-span-5 lg:space-y-6">
              <h2 className="text-[34px] leading-[40px] font-normal tracking-[-0.025em] text-text lg:text-[44px] lg:leading-[48px]">
                {skills.headline.before}
                <span className="font-medium text-accent">{skills.headline.accent}</span>
              </h2>
              <p className="max-w-[420px] text-[15px] leading-relaxed tracking-[-0.005em] text-secondary">{skills.intro}</p>
            </div>

            <div className="flex flex-col border-t border-border lg:col-span-7">
              {skills.categories.map((category) => (
                <CategoryRow key={category.name} name={category.name} items={category.items} />
              ))}
            </div>
          </div>
        </Reveal>
      </Container>

      <Reveal delay={0.1}>
        <IconMarquee />
      </Reveal>
    </section>
  );
}

function CategoryRow({ name, items }: { name: string; items: readonly string[] }) {
  return (
    <div className="group/row relative -mx-4 flex flex-col items-start gap-3 px-4 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 lg:py-8">
      {/* Divider at the content width (the row itself bleeds 16px each side for the hover panel) */}
      <span aria-hidden className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-border" />
      {/* Hover highlight: glass panel + accent edge, faded in so layout never shifts */}
      <span
        aria-hidden
        className="glass-flat pointer-events-none absolute inset-0 rounded-xl border-accent/30! opacity-0 transition-opacity duration-300 ease-brand group-hover/row:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-4 bottom-4 left-0 w-0.5 origin-center scale-y-0 rounded-full bg-accent transition-transform duration-300 ease-brand group-hover/row:scale-y-100"
      />

      <h3 className="relative shrink-0 text-[22px] leading-8 sm:w-48 lg:text-2xl font-normal tracking-[-0.02em] text-text transition-[color,transform] duration-300 ease-brand group-hover/row:translate-x-1 group-hover/row:text-accent">
        {name}
      </h3>

      {/* Inline text so it wraps like the design. Each icon sits over the preceding "/" slot. */}
      <p className="relative flex-1 text-left text-base leading-[1.9] text-text sm:text-right touch:flex touch:flex-wrap touch:gap-x-4 touch:gap-y-0.5 sm:touch:justify-end">
        {items.map((item, i) => (
          <span key={item}>
            <span className="whitespace-nowrap">
              <SkillItem name={item} />
              {i < items.length - 1 && (
                <span
                  aria-hidden
                  className="mx-1.5 text-tertiary/60 transition-opacity duration-200 ease-brand group-hover/row:opacity-0 touch:hidden"
                >
                  /
                </span>
              )}
            </span>{" "}
          </span>
        ))}
      </p>
    </div>
  );
}

function SkillItem({ name }: { name: string }) {
  const { note } = techMeta(name);
  return (
    <span className="group/item relative inline-block" style={{ "--brand": brandColor(name) } as React.CSSProperties}>
      <TechIcon
        name={name}
        className="absolute top-1/2 -left-[19px] h-[15px] w-[15px] -translate-y-1/2 scale-75 touch:static touch:mr-1.5 touch:inline-block touch:translate-y-[2px] text-secondary opacity-0 transition-[opacity,transform,color] duration-300 ease-brand group-hover/row:scale-100 group-hover/row:opacity-100 group-hover/item:scale-110 group-hover/item:text-(--brand) touch:scale-100 touch:opacity-100"
      />
      <span className="transition-colors duration-200 ease-brand group-hover/item:text-accent-ink">{name}</span>

      {/* Tooltip: sits above the item, never over the category name */}
      <span
        aria-hidden
        className="glass-flat pointer-events-none absolute bottom-full left-1/2 z-30 mb-2.5 flex -translate-x-1/2 translate-y-1 items-center gap-1.5 rounded-lg border-accent/40! px-2.5 py-1 font-mono text-[11px] leading-4 whitespace-nowrap text-text opacity-0 transition-[opacity,transform] duration-200 ease-brand group-hover/item:translate-y-0 group-hover/item:opacity-100"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {name}
        {note && <span className="text-secondary">· {note}</span>}
      </span>
    </span>
  );
}

/** CSS-only infinite icon-tile marquee. Pauses on hover; edges fade out with a mask. */
function IconMarquee() {
  const techs = skills.categories.flatMap((c) => c.items).filter(hasBrandIcon);
  return (
    <div
      aria-hidden
      className="relative mt-10 overflow-hidden pt-12 pb-4 [mask-image:linear-gradient(to_right,transparent,black_3rem,black_calc(100%-3rem),transparent)] lg:mt-14 lg:[mask-image:linear-gradient(to_right,transparent,black_10rem,black_calc(100%-10rem),transparent)]"
    >
      {/* Spacing is a right margin on each tile (not gap) so the -50% loop lands exactly on the copy */}
      <div className="animate-marquee flex w-max">
        {[...techs, ...techs].map((name, i) => (
          <MarqueeTile key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}

function MarqueeTile({ name }: { name: string }) {
  const { short, note } = techMeta(name);
  return (
    <div className="group/tile relative mr-6 lg:mr-8" style={{ "--brand": brandColor(name) } as React.CSSProperties}>
      <span className="glass-flat pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 flex -translate-x-1/2 translate-y-1 items-center gap-1.5 rounded-lg border-accent/40! px-2.5 py-1 font-mono text-[11px] leading-4 whitespace-nowrap text-text opacity-0 transition-[opacity,transform] duration-200 ease-brand group-hover/tile:translate-y-0 group-hover/tile:opacity-100">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {name}
        {note && <span className="text-secondary">· {note}</span>}
      </span>
      <div className="glass-flat flex h-20 w-20 flex-col items-center justify-center gap-1.5 rounded-[20px] lg:h-24 lg:w-24 lg:gap-2 lg:rounded-[24px] text-secondary transition-[transform,border-color,color] duration-300 ease-brand group-hover/tile:-translate-y-1 group-hover/tile:border-accent/60! group-hover/tile:text-text">
        <TechIcon name={name} className="h-7 w-7 lg:h-9 lg:w-9 transition-colors duration-300 ease-brand group-hover/tile:text-(--brand)" />
        <span className="font-mono text-[10.5px] leading-3 font-medium lg:text-[11px]">{short}</span>
      </div>
    </div>
  );
}
