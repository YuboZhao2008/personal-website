import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yubo Zhao — Software, Intelligence & Ideas",
  description:
    "Yubo Zhao, first-year / 1A Software Engineering at Waterloo. Building AI agents, computer vision interfaces, and simulations, with IOAI and FTC robotics experience.",
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
