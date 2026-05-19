import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Splash Media | Utah Marketing Agency",
  description:
    "A Utah marketing agency built for brands that refuse to blend in. Strategy, design, and campaigns that move the needle — and the crowd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
  lang="en"
  className={`${geistSans.variable} ${geistMono.variable} antialiased`}
>
  <head>
    <link rel="stylesheet" href="https://use.typekit.net/luy1uie.css" />
  </head>
  <body style={{ background: '#020617' }}>{children}</body>
</html>
  );
}