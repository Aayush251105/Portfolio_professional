// Visual QA helper.
//   node scripts/shoot.mjs ref <stitch-folder> [outDir]   -> renders each 1440px canvas in code.html
//     REF_SEL=<css> / REF_VW=<px> override the canvas selector and viewport width for fluid frames.
//   node scripts/shoot.mjs app [url] [outDir] [height] [selector]  -> light + dark screenshots of the app
//   CLICK=<selector> clicks an element first (e.g. to open a menu); SCROLL=<selector> scrolls to it first;
//   HOVER=<selector> hovers it before the shot. Each adds a suffix to the file name.
//   VW=<px> sets the viewport width (default 1440); FULL=1 captures the full page.
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
  const page = await browser.newPage({ viewport: { width: Number(process.env.REF_VW ?? 1600), height: 1000 } });
  await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Freeze animations so the reference is deterministic.
  await page.addStyleTag({ content: "*{animation:none!important}" });
  const canvases = page.locator(process.env.REF_SEL ?? "section.w-\\[1440px\\]");
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
    const vw = Number(process.env.VW ?? 1440);
    const ctx = await browser.newContext({ viewport: { width: vw, height }, colorScheme: theme, hasTouch: vw < 1024, isMobile: vw < 768 });
    await ctx.addInitScript((t) => { localStorage.setItem("theme", t); sessionStorage.setItem("a-loader-seen", "1"); }, theme);
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Wait for React to hydrate (the nav's toggle gets a click handler) before interacting.
    await page.waitForFunction(() => {
      const btn = document.querySelector("button[aria-label='Toggle theme']");
      return btn && Object.keys(btn).some((k) => k.startsWith("__reactProps"));
    });
    await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
    if (process.env.SCROLL) {
      // Align the target with the top of the viewport, then let the reveal animation finish.
      await page.locator(process.env.SCROLL).first().evaluate((el) => el.scrollIntoView({ block: "start" }));
      await page.waitForTimeout(1500);
    }
    if (process.env.FULL) {
      // Scroll through once so every fade-in section has revealed, then return to the top.
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 500) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
    }
    if (process.env.CLICK) await page.click(process.env.CLICK);
    if (process.env.HOVER) await page.hover(process.env.HOVER);
    await page.waitForTimeout(300);
    const suffix = (process.env.CLICK ? "-click" : "") + (process.env.HOVER ? "-hover" : "");
    const file = path.join(out, `app-${theme}${suffix}${process.env.VW ? `-${process.env.VW}` : ""}.png`);
    if (selector) await page.locator(selector).first().screenshot({ path: file });
    else await page.screenshot({ path: file, fullPage: Boolean(process.env.FULL) });
    console.log(file);
    await ctx.close();
  }
}

await browser.close();
