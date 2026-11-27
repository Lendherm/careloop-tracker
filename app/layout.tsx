import { Suspense } from "react";
import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: "CareLoop Tracker",
  description:
    "Follow every screening result from issue to treatment, with one named owner for the next step.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sourceSans.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Suspense
          fallback={
            <header className="bg-primary text-white" aria-busy="true">
              <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
                <span className="text-lg font-semibold">CareLoop Tracker</span>
                <span className="text-sm" role="status">
                  Loading account...
                </span>
              </div>
            </header>
          }
        >
          <Header />
        </Suspense>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
