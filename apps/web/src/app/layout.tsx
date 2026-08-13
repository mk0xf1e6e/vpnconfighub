import type { Metadata } from "next";
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
      <body className="min-h-screen antialiased">
        <TelegramProvider />

        <div
          className="mx-auto min-h-screen max-w-lg"
          style={{
            paddingTop: "var(--tg-content-safe-area-inset-top, 0px)",
            paddingLeft: "var(--tg-content-safe-area-inset-left, 0px)",
            paddingRight: "var(--tg-content-safe-area-inset-right, 0px)",
            paddingBottom:
              "calc(6rem + var(--tg-content-safe-area-inset-bottom, 0px))",
          }}
        >
          {children}
        </div>

        <BottomNav />
      </body>
    </html>
  );
}