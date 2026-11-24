import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

const siteDescription =
  "Track screening follow-up ownership from result issue to treatment or closure.";

export const metadata: Metadata = {
  title: "CareLoop Tracker",
  description: siteDescription,
  openGraph: {
    title: "CareLoop Tracker",
    description: siteDescription,
    url: "https://github.com/Lendherm/careloop-tracker",
    siteName: "CareLoop Tracker",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CareLoop Tracker",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[#F7FAFC] font-sans text-[#1F2933]">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
