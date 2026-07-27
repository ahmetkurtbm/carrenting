import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Antalya ve Istanbul icin gunluk ve haftalik arac kiralama. Bakimli filo, seffaf fiyatlar, havalimani teslimi ve hizli rezervasyon.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "AutoRent | Arac Kiralama",
    template: "%s | AutoRent",
  },
  description,
  keywords: [
    "arac kiralama",
    "rent a car",
    "gunluk arac kiralama",
    "antalya arac kiralama",
    "istanbul arac kiralama",
    "havalimani arac kiralama",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "AutoRent",
    title: "AutoRent | Arac Kiralama",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoRent | Arac Kiralama",
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
