// Deterministic filmstrip of the intro loader: pauses every CSS animation and steps them to exact times.
//   node scripts/loader-frames.mjs [width] [theme]
import { chromium } from "playwright";
import fs from "node:fs";
const [wArg = "1440", theme = "light"] = process.argv.slice(2);
const w = Number(wArg), h = w < 768 ? 844 : 900;
fs.mkdirSync(".shots/loader", { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: theme });
await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
const p = await ctx.newPage();
await p.goto(process.env.URL ?? "http://localhost:3000", { waitUntil: "domcontentloaded" });
await p.evaluate(() => document.fonts.ready);
await p.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
const times = [0, 300, 600, 900, 1200, 1500, 1800, 2000, 2200, 2450, 2700, 3000];
for (const t of times) {
  await p.evaluate((t) => document.getAnimations().forEach((a) => (a.currentTime = t)), t);
  await p.waitForTimeout(60);
  await p.screenshot({ path: `.shots/loader/${w}-${theme}-${String(t).padStart(4, "0")}.png` });
}
console.log("frames:", times.join(", "), "| animations:", await p.evaluate(() => document.getAnimations().length));
await b.close();
