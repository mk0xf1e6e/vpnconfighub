"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";

interface TelegramShellProps {
  children: ReactNode;
}

export function TelegramShell({ children }: TelegramShellProps) {
  const pathname = usePathname();
  const title = {
    "/": "Dashboard",
    "/store": "Build connection",
    "/nodes": "Nodes",
    "/guides": "Guides",
    "/support": "Help",
  }[pathname] ?? "VPN Config Hub";

  return (
    <div className="min-h-[100dvh] w-full bg-[#0e1621] text-[#f5f5f5] antialiased">
      <header
        className="sticky top-0 z-40 border-b border-[#2b394a] bg-[#17212b]/95 px-4 pb-3 shadow-md backdrop-blur"
        style={{ paddingTop: "max(0.75rem, var(--tg-content-safe-area-inset-top, env(safe-area-inset-top, 0px)))" }}
      >
        <div className="mx-auto flex min-h-9 w-full max-w-5xl items-center justify-between gap-3">
          <h1 className="truncate text-sm font-bold text-[#f5f5f5]">{title}</h1>
          <span className="shrink-0 rounded-full border border-[#2b394a] bg-[#1f2936] px-2.5 py-1 text-[10px] font-semibold text-[#7f8c99]">
            Telegram connected
          </span>
        </div>
      </header>
      <main
        className="min-h-[calc(100dvh-3.75rem)] scroll-pb-24 pb-24"
        style={{
          paddingLeft: "var(--tg-content-safe-area-inset-left, 0px)",
          paddingRight: "var(--tg-content-safe-area-inset-right, 0px)",
        }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
