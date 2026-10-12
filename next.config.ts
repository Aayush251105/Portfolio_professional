import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // The chat route reads this at runtime; make sure it ships with the serverless function.
  outputFileTracingIncludes: { "/api/chat": ["./content/about-me.md"] },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
