import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";

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
        <div className="mx-auto min-h-screen max-w-lg pb-24">
          {children}
        </div>

        <BottomNav />
      </body>
    </html>
  );
}
