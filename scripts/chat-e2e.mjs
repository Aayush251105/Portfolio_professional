// Chat assistant check: node scripts/chat-e2e.mjs [outDir]. Opens the panel, asks a plain question and two
// action questions, and asserts the page reacted. Uses real Groq calls (counts toward the free quota).
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const out = path.resolve(process.argv[2] ?? ".shots/chat");
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();

async function open(theme, vw = 1440, vh = 900) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, colorScheme: theme, isMobile: vw < 768, hasTouch: vw < 1024 });
  await ctx.addInitScript((t) => { localStorage.setItem("theme", t); sessionStorage.setItem("a-loader-seen", "1"); }, theme);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForFunction(() => {
    const b = document.querySelector("button[aria-label='Toggle theme']");
    return b && Object.keys(b).some((k) => k.startsWith("__reactProps"));
  });
  await page.waitForTimeout(2200); // let the page intro finish
  return page;
}

async function ask(page, q) {
  await page.getByLabel("Your question").fill(q);
  await page.getByRole("button", { name: "Send question" }).click();
  await page.waitForFunction(() => document.querySelector("[role=log]")?.getAttribute("aria-busy") === "false", null, { timeout: 30000 });
  await page.waitForTimeout(700);
  const last = await page.locator("[role=log] > div").last().innerText();
  console.log(`Q: ${q}\nA: ${last.replace(/\n+/g, " | ")}\n`);
}

for (const theme of ["light", "dark"]) {
  const page = await open(theme);
  await page.screenshot({ path: path.join(out, `${theme}-top.png`) });
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(out, `${theme}-launcher.png`) });
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(out, `${theme}-empty.png`) });
  if (theme === "light") {
    await ask(page, "What is he working on right now?");
    await ask(page, "Show me his full-stack projects");
    const tab = await page.locator("[role=tab][aria-selected=true]").innerText();
    const y = await page.evaluate(() => Math.round(document.getElementById("projects").getBoundingClientRect().top));
    console.log(`ASSERT filter tab = ${tab} (want Full-stack), projects top = ${y}px\n`);
    await page.screenshot({ path: path.join(out, `${theme}-conversation.png`) });
    await ask(page, "Open the HireLens case study");
    const dialog = await page.locator("#case-study-title").innerText().catch(() => "(none)");
    console.log(`ASSERT case study open: ${dialog}\n`);
    await page.screenshot({ path: path.join(out, `${theme}-case-study.png`) });
  }
  await page.context().close();
}

const m = await open("dark", 390, 844);
await m.evaluate(() => window.scrollTo(0, 900));
await m.waitForTimeout(1200);
await m.screenshot({ path: path.join(out, "mobile-launcher.png") });
await m.getByRole("button", { name: /^Ask/ }).click();
await m.waitForTimeout(500);
await m.screenshot({ path: path.join(out, "mobile-empty.png") });
await browser.close();
