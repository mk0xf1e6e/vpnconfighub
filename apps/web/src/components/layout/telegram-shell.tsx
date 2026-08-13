"use client";

import type { ReactNode } from "react";
import { TelegramHeader } from "@/components/layout/telegram-header";
import { BottomNav } from "@/components/layout/bottom-nav";

interface TelegramShellProps {
  children: ReactNode;
}

export function TelegramShell({ children }: TelegramShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#0e1621] text-[#f5f5f5] antialiased sm:flex sm:items-center sm:justify-center sm:py-6">
      {/* Phone frame container */}
      <div className="relative min-h-screen w-full bg-[#17212b] shadow-2xl sm:min-h-[840px] sm:max-w-[420px] sm:overflow-hidden sm:rounded-[32px] sm:border sm:border-[#2b394a]">
        {/* Header */}
        <TelegramHeader />

        {/* Scrollable Content Container */}
        <main
          className="pb-24"
          style={{
            paddingTop: "var(--tg-content-safe-area-inset-top, 0px)",
            paddingLeft: "var(--tg-content-safe-area-inset-left, 0px)",
            paddingRight: "var(--tg-content-safe-area-inset-right, 0px)",
          }}
        >
          {children}
        </main>

        {/* Fixed Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
