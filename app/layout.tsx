import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://toolatlas.dev"),
  title: {
    default: "ToolAtlas: AI Tools & Developer Technologies",
    template: "%s | ToolAtlas",
  },
  description:
    "A hand-checked catalog of 2,386 AI tools and 1,861 developer technologies. Search, compare, and save. No signup, no spam.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "ToolAtlas",
    title: "ToolAtlas: AI Tools & Developer Technologies",
    description:
      "A hand-checked catalog of 2,386 AI tools and 1,861 developer technologies.",
    url: "https://toolatlas.dev/",
    images: ["/favicon.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolAtlas: AI Tools & Developer Technologies",
    description:
      "A hand-checked catalog of 2,386 AI tools and 1,861 developer technologies.",
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
