import type { MetadataRoute } from "next";
import { seo } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.title,
    short_name: "Aayush",
    description: seo.description,
    start_url: "/",
    display: "browser",
    background_color: "#F5F4F1",
    theme_color: "#F5F4F1",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
