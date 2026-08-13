import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { DevThemeSwitcher } from "@/components/telegram/dev-theme-switcher";

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
      <body className="min-h-screen antialiased">
        <Script
          src="https://telegram.org/js/telegram-web-app.js?59"
          strategy="beforeInteractive"
        />

        <TelegramProvider />

        <DevThemeSwitcher />

        <div className="mx-auto min-h-screen max-w-lg pb-24">
          {children}
        </div>

        <BottomNav />
      </body>
    </html>
  );
}
