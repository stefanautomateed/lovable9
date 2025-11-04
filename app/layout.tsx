import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeSDK MVP - AI App Builder",
  description: "Build web apps with AI on Vercel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
