import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Cursor } from "@/components/cursor";
import { Loader } from "@/components/loader";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";
import { seo, siteUrl } from "@/lib/seo";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: seo.title, template: `%s · ${seo.fullName}` },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: seo.fullName, url: siteUrl }],
  creator: seo.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: seo.fullName,
    title: seo.title,
    description: seo.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F4F1" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0C0B" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-full antialiased">
        <a
          href="#main"
          className="skip-link fixed top-3 left-3 z-[110] rounded-full bg-text px-4 py-2 text-sm font-medium text-bg"
        >
          Skip to content
        </a>
        <Loader />
        <ThemeProvider>{children}</ThemeProvider>
        <SmoothScroll />
        <Cursor />
      </body>
    </html>
  );
}
