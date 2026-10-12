// WCAG 2.1 AA audit with axe-core (page, then the open chat panel): node scripts/a11y-audit.mjs [url]
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
const url = process.argv[2] ?? "http://localhost:3100";
const b = await chromium.launch();
let total = 0;
for (const [w, theme] of [[1440, "light"], [1440, "dark"], [390, "light"], [390, "dark"]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, colorScheme: theme, hasTouch: w < 1024, isMobile: w < 768 });
  await ctx.addInitScript((t) => { localStorage.setItem("theme", t); sessionStorage.setItem("a-loader-seen", "1"); }, theme);
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "networkidle" });
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 300) { await p.evaluate(() => window.scrollBy(0, 300)); await p.waitForTimeout(80); }
  await p.waitForTimeout(1200);
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);
  const res = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  total += res.violations.length;
  console.log(`\n== ${w}px ${theme}: ${res.violations.length} violation types, ${res.passes.length} passing checks`);
  for (const v of res.violations) {
    console.log(` [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
    for (const n of v.nodes.slice(0, 4)) console.log(`    - ${n.target.join(" ")} :: ${(n.failureSummary || "").split("\n").slice(1, 2).join(" ").trim().slice(0, 160)}`);
  }
  // The chat panel (closed during the page audit): open it with Ctrl+K and audit just the panel.
  await p.keyboard.press("Control+k");
  await p.waitForTimeout(600);
  const chat = await new AxeBuilder({ page: p }).include("[role=dialog][aria-modal=false]").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  total += chat.violations.length;
  console.log(`   chat panel: ${chat.violations.length} violation types, ${chat.passes.length} passing checks`);
  for (const v of chat.violations) console.log(`    [${v.impact}] ${v.id}: ${v.help} :: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`);
  await ctx.close();
}
await b.close();
process.exitCode = total ? 1 : 0;
