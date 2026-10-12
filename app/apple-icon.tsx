import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon: the same "A." mark as app/icon.svg, rasterised (iOS ignores SVG icons). */
export default async function AppleIcon() {
  const svg = await readFile(join(process.cwd(), "app/icon.svg"));
  // iOS applies its own corner mask, so draw the tile square (no rounding) edge to edge.
  const square = svg.toString().replace('rx="14"', 'rx="0"');
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt="" width={180} height={180} src={`data:image/svg+xml;base64,${Buffer.from(square).toString("base64")}`} />
    ),
    size,
  );
}
