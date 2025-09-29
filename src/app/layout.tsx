import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Link from "next/link";
import Providers from "./providers";
import { boardMono } from "./fonts";
import HeaderRight from "./header-right";

export const metadata: Metadata = {
  title: "Train Schedule",
  description: "Simple train schedule app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={boardMono.className}>
      <body className="min-h-screen bg-board-bg text-uzg-400">
        <Providers>
          <div className="container max-w-6xl px-4 py-6">
            <header className="mb-6 flex items-center justify-between">
              <Link href="/" className="text-2xl tracking-wider board-glow hover:opacity-90">
                <span className="font-board">TRAIN SCHEDULE</span>
              </Link>
              <HeaderRight />
            </header>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
