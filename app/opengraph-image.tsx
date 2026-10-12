import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content/site";
import { seo } from "@/lib/seo";

export const alt = `${seo.fullName}: I build intelligent software that feels effortless.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

// Light-theme tokens (globals.css)
const BG = "#F5F4F1";
const TEXT = "#141414";
const SECONDARY = "#6E6C67";
const BORDER = "#E3E1DC";
const ACCENT = "#E5532D";

/** Link-preview card in the site's editorial style: mark, headline, role label, warm glow. */
export default async function OpenGraphImage() {
  const [medium, semibold, mono] = await Promise.all([font("Geist-Medium.ttf"), font("Geist-SemiBold.ttf"), font("JetBrainsMono-Medium.ttf")]);
  const { headline } = site.hero;
  const split = (text: string, accent: boolean) => text.split(" ").filter(Boolean).map((word) => ({ word, accent }));
  const words = [...split(headline.before, false), ...split(headline.accent, true), ...split(headline.after, false)];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: BG, position: "relative", fontFamily: "Geist" }}>
        {/* Soft vermilion glow, as behind the hero status card */}
        <div style={{ position: "absolute", right: -120, top: -80, width: 620, height: 620, borderRadius: 9999, background: "radial-gradient(circle, rgba(229,83,45,0.22) 0%, rgba(229,83,45,0.06) 45%, rgba(245,244,241,0) 70%)" }} />
        {/* Oversized faint monogram */}
        <div style={{ position: "absolute", right: 40, bottom: -90, fontSize: 460, fontWeight: 600, letterSpacing: -28, color: "rgba(20,20,20,0.05)", display: "flex" }}>
          A<span style={{ color: "rgba(229,83,45,0.14)" }}>.</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 600, color: TEXT, letterSpacing: -1 }}>
              A<span style={{ color: ACCENT }}>.</span>
            </div>
            <div style={{ width: 1, height: 28, background: BORDER }} />
            <div style={{ fontFamily: "JetBrains Mono", fontSize: 18, letterSpacing: 4, color: SECONDARY }}>{seo.fullName.toUpperCase()}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 9999, border: `1px solid ${BORDER}`, background: "rgba(251,250,248,0.8)", fontFamily: "JetBrains Mono", fontSize: 16, color: TEXT }}>
            <div style={{ width: 10, height: 10, borderRadius: 9999, background: "#10B981" }} />
            {site.hero.status.title.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Word by word: Satori lays out each text chunk as its own flex box, so mixed spans space unevenly */}
          <div style={{ display: "flex", flexWrap: "wrap", maxWidth: 900, fontSize: 84, fontWeight: 600, lineHeight: 1.04, letterSpacing: -3.2, color: TEXT }}>
            {words.map(({ word, accent }, i) => (
              <span key={i} style={{ marginRight: 16, color: accent ? ACCENT : TEXT }}>
                {word}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "JetBrains Mono", fontSize: 20, letterSpacing: 2, color: SECONDARY }}>
            <div style={{ width: 10, height: 10, borderRadius: 9999, background: ACCENT }} />
            {site.hero.eyebrow.join("  ·  ").toUpperCase()}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: medium, weight: 500, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
