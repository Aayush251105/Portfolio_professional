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
const times = [0, 200, 400, 600, 800, 1000, 1250, 1450, 1600, 1750, 1900, 2050, 2400, 2900];
for (const t of times) {
  await p.evaluate((t) => document.getAnimations().forEach((a) => (a.currentTime = t)), t);
  await p.waitForTimeout(60);
  await p.screenshot({ path: `.shots/loader/${w}-${theme}-${String(t).padStart(4, "0")}.png` });
}
console.log("frames:", times.join(", "), "| animations:", await p.evaluate(() => document.getAnimations().length));
await b.close();
