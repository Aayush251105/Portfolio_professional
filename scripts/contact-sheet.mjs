// Tile screenshots into one labelled grid: node scripts/contact-sheet.mjs <out.png> <cols> <scale> <files...>
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
const [out, colsArg, scaleArg, ...files] = process.argv.slice(2);
const imgs = files.map((f) => ({ label: path.basename(f, ".png"), data: fs.readFileSync(f).toString("base64") }));
const b = await chromium.launch(); const p = await b.newPage();
const png = await p.evaluate(async ({ imgs, cols, scale }) => {
  const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = "data:image/png;base64," + s; });
  const loaded = await Promise.all(imgs.map((i) => load(i.data)));
  const w = loaded[0].width * scale, h = loaded[0].height * scale, pad = 8, lab = 18;
  const rows = Math.ceil(loaded.length / cols);
  const c = document.createElement("canvas"); c.width = cols * (w + pad) + pad; c.height = rows * (h + pad + lab) + pad;
  const x = c.getContext("2d"); x.fillStyle = "#888"; x.fillRect(0, 0, c.width, c.height);
  loaded.forEach((img, i) => {
    const cx = pad + (i % cols) * (w + pad), cy = pad + Math.floor(i / cols) * (h + pad + lab);
    x.fillStyle = "#000"; x.font = "13px monospace"; x.fillText(imgs[i].label, cx, cy + 13);
    x.drawImage(img, cx, cy + lab, w, h);
  });
  return c.toDataURL("image/png").split(",")[1];
}, { imgs, cols: Number(colsArg), scale: Number(scaleArg) });
fs.writeFileSync(out, Buffer.from(png, "base64")); console.log(out); await b.close();
