import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Inter_Tight } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE } from "@/config/site";
import { getPluginVersion } from "@/lib/skills/data";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

/** The whole site is prerendered; the build fails if anything renders per request. */
export const ensureStatic = "navigation";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], weight: ["500", "600", "700"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: `${SITE.name}: Claude Code skills for product teams`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, type: "website" },
};

export const viewport: Viewport = { themeColor: "#08090a", colorScheme: "dark" };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const version = await getPluginVersion();
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${geistMono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col bg-bg font-sans text-fg">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter version={version} />
      </body>
    </html>
  );
}
