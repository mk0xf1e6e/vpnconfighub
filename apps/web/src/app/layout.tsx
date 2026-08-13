import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TelegramProvider } from "@/components/telegram/telegram-provider";

export const metadata: Metadata = {
  title: "VPN Config Hub",
  description: "VPN and proxy services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-950 antialiased dark:bg-zinc-950 dark:text-white">
        <Script
          src="https://telegram.org/js/telegram-web-app.js?59"
          strategy="beforeInteractive"
        />

        <TelegramProvider />

        <div className="mx-auto min-h-screen max-w-lg pb-24">
          {children}
        </div>

        <BottomNav />
      </body>
    </html>
  );
}
