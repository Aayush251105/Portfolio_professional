// Visual QA helper.
//   node scripts/shoot.mjs ref <stitch-folder> [outDir]   -> renders each 1440px canvas in code.html
//   node scripts/shoot.mjs app [url] [outDir] [height] [selector]  -> light + dark screenshots of the app
//   CLICK=<selector> clicks an element first (e.g. to open a menu); SCROLL=<selector> scrolls to it first.
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const [mode, target, outArg, heightArg, selector] = process.argv.slice(2);
const out = path.resolve(outArg ?? ".shots");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();

if (mode === "ref") {
  const html = path.resolve("..", "stitch_editorial_portfolio_hero_dual_theme", target, "code.html");
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Freeze animations so the reference is deterministic.
  await page.addStyleTag({ content: "*{animation:none!important}" });
  const canvases = page.locator("section.w-\\[1440px\\]");
  const n = await canvases.count();
  for (let i = 0; i < n; i++) {
    const file = path.join(out, `ref-${i === 0 ? "light" : i === 1 ? "dark" : i}.png`);
    await canvases.nth(i).screenshot({ path: file });
    console.log(file);
  }
} else if (mode === "app") {
  const url = target ?? "http://localhost:3000";
  const height = Number(heightArg ?? 880);
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height }, colorScheme: theme });
    await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
    if (process.env.SCROLL) await page.locator(process.env.SCROLL).first().scrollIntoViewIfNeeded();
    if (process.env.CLICK) await page.click(process.env.CLICK);
    await page.waitForTimeout(300);
    const file = path.join(out, `app-${theme}${process.env.CLICK ? "-click" : ""}.png`);
    if (selector) await page.locator(selector).first().screenshot({ path: file });
    else await page.screenshot({ path: file });
    console.log(file);
    await ctx.close();
  }
}

await browser.close();
