import type { Metadata } from "next";
import { site } from "@/data/site";
import "./globals.css";

const shareImage = site.url
  ? [
      {
        url: `${site.url}/share-image`,
        width: 1200,
        height: 630,
        alt: "Yubo Zhao — Software Engineering & Intelligent Systems",
      },
    ]
  : undefined;
export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  authors: [{ name: "Yubo Zhao" }],
  creator: "Yubo Zhao",
  ...(site.url
    ? { metadataBase: new URL(site.url), alternates: { canonical: "/" } }
    : {}),
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: "Yubo Zhao",
    type: "website",
    locale: "en_CA",
    ...(site.url ? { url: site.url, images: shareImage } : {}),
  },
  twitter: {
    card: site.url ? "summary_large_image" : "summary",
    title: site.title,
    description: site.description,
    ...(shareImage ? { images: shareImage } : {}),
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
