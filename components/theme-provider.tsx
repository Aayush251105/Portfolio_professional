"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** System preference by default, user choice persisted under `theme`, applied before first paint. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
      {children}
    </NextThemesProvider>
  );
}
