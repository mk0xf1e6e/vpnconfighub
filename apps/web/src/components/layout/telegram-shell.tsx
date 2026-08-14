"use client";

import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";

interface TelegramShellProps {
  children: ReactNode;
}

export function TelegramShell({ children }: TelegramShellProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-[#0e1621] text-[#f5f5f5] antialiased">
      <header
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-40 h-[100px] border-b border-[#2b394a] bg-[#17212b]/95 pt-[env(safe-area-inset-top)] backdrop-blur"
      />
      <main
        className="min-h-[100dvh] scroll-pb-24 pb-24"
        style={{
            paddingTop: "calc(100px + var(--tg-content-safe-area-inset-top, env(safe-area-inset-top, 0px)))",
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
