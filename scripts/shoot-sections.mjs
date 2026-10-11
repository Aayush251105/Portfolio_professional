// Per-section screenshots at a given width: node scripts/shoot-sections.mjs <width> [theme] [outDir]
import { chromium } from "playwright";
import fs from "node:fs";
const [vwArg, theme = "light", out = ".shots/sections"] = process.argv.slice(2);
const vw = Number(vwArg ?? 390);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: vw, height: 844 }, colorScheme: theme, hasTouch: vw < 1024, isMobile: vw < 768, deviceScaleFactor: 1 });
await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
const p = await ctx.newPage();
const errs = []; p.on("pageerror", (e) => errs.push(e.message));
await p.goto("http://localhost:3000", { waitUntil: "networkidle" });
await p.waitForFunction(() => document.documentElement.classList.contains("lenis"));
const h = await p.evaluate(() => document.documentElement.scrollHeight);
// Real wheel input (not scrollTo jumps) so scroll observers and fade-ins fire as they would for a visitor.
if (vw < 1024) {
  // Touch layouts: small native scroll steps (a phone never sends wheel events).
  for (let y = 0; y < h; y += 200) { await p.evaluate(() => window.scrollBy(0, 200)); await p.waitForTimeout(150); }
} else {
  await p.mouse.move(Math.min(200, vw / 2), 400);
  for (let y = 0; y < h; y += 300) { await p.mouse.wheel(0, 300); await p.waitForTimeout(120); }
}
await p.waitForTimeout(1500); // let every fade-in finish
const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
const media = await p.evaluate(() => `hover:none=${matchMedia("(hover: none)").matches} skill-icon=${getComputedStyle(document.querySelector("#skills p svg")).position}`);
for (const id of ["top", "about", "skills", "certifications", "projects", "experience", "contact"]) {
  // The fixed nav would be painted over every section; only keep it for the hero.
  await p.evaluate((show) => (document.querySelector("header").style.visibility = show ? "" : "hidden"), id === "top");
  await p.locator("#" + id).screenshot({ path: `${out}/${vw}-${theme}-${id}.png` });
}
console.log(`${vw}px ${theme}: ${media}, horizontal overflow ${overflow}px, page height ${h}px, errors: ${errs.length ? errs.join("; ") : "none"}`);
await b.close();
