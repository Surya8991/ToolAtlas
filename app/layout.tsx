import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getCatalogStats } from "@/lib/catalogStats";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const stats = getCatalogStats();
const summary = `A hand-checked catalog of ${stats.totalTools.toLocaleString()} AI tools and ${stats.totalTech.toLocaleString()} developer technologies.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://toolatlas.dev"),
  title: {
    default: "ToolAtlas: AI Tools & Developer Technologies",
    template: "%s | ToolAtlas",
  },
  description: `${summary} Search, compare, and save. No signup, no spam.`,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "ToolAtlas",
    title: "ToolAtlas: AI Tools & Developer Technologies",
    description: summary,
    url: "https://toolatlas.dev/",
    images: ["/favicon.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolAtlas: AI Tools & Developer Technologies",
    description: summary,
  },
};

export const viewport = { themeColor: "#06060c" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
