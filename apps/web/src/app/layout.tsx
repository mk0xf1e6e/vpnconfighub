import type { Metadata } from "next";
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