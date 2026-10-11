// Scroll-smoothness probe: wheel-scrolls the whole page and records frame times.
//   node scripts/scroll-perf.mjs [url]     (INJECT=<css> to test a hypothesis, e.g. disabling an effect)
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://localhost:3100";
const browser = await chromium.launch({ args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist"] });
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 880 }, colorScheme: theme });
  await ctx.addInitScript(() => sessionStorage.setItem("a-loader-seen", "1")); // skip the intro loader
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  if (process.env.INJECT) await page.addStyleTag({ content: process.env.INJECT });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    window.__frames = [];
    let last = performance.now();
    const tick = (t) => { window.__frames.push(t - last); last = t; window.__raf = requestAnimationFrame(tick); };
    window.__raf = requestAnimationFrame(tick);
  });
  await page.mouse.move(720, 440);
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  if (max > 20000) throw new Error(`Unexpected page height ${max}px — is the server serving a stale build?`);
  for (let y = 0; y < max; y += 60) { await page.mouse.wheel(0, 60); await page.waitForTimeout(16); }
  for (let y = max; y > 0; y -= 60) { await page.mouse.wheel(0, -60); await page.waitForTimeout(16); }
  const f = await page.evaluate(() => { cancelAnimationFrame(window.__raf); return window.__frames.slice(2); });
  f.sort((a, b) => a - b);
  const pct = (p) => f[Math.floor(f.length * p)].toFixed(1);
  const janky = f.filter((d) => d > 25).length;
  console.log(`${theme}: frames=${f.length} median=${pct(0.5)}ms p95=${pct(0.95)}ms p99=${pct(0.99)}ms >25ms=${janky} (${((janky / f.length) * 100).toFixed(1)}%)`);
  await ctx.close();
}
await browser.close();
