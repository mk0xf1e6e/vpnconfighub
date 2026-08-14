"use client";

import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";

interface TelegramShellProps {
  children: ReactNode;
}

export function TelegramShell({ children }: TelegramShellProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-[#0e1621] text-[#f5f5f5] antialiased">
      <main
        className="min-h-[100dvh] pb-24"
        style={{
          paddingTop: "var(--tg-content-safe-area-inset-top, 0px)",
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
