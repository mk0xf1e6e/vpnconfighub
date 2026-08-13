import type { Metadata } from "next";
import "./globals.css";
import { TelegramProvider } from "@/components/telegram/telegram-provider";
import { TelegramAppFrame } from "@/components/layout/telegram-app-frame";

export const metadata: Metadata = {
  title: "VPN Config Hub",
  description: "Telegram Mini App for VPN and Proxy Services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen bg-[#0e1621] text-[#f5f5f5] antialiased">
        <TelegramProvider />
        <TelegramAppFrame>{children}</TelegramAppFrame>
      </body>
    </html>
  );
}
