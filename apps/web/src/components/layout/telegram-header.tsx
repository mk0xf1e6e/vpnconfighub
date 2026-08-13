"use client";

import { useTelegram } from "@/components/telegram/use-telegram";

export function TelegramHeader() {
  const { user, isTelegram } = useTelegram();

  if (!user) {
    return (
      <header className="sticky top-0 z-40 border-b border-[#2b394a] bg-[#17212b] px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#7f8c99]">
            {isTelegram ? "Loading..." : "Not running in Telegram"}
          </p>
        </div>
      </header>
    );
  }

  const initials = user.first_name
    ? `${user.first_name.charAt(0)}${user.last_name ? user.last_name.charAt(0) : ""}`
    : "?";

  return (
    <header className="sticky top-0 z-40 border-b border-[#2b394a] bg-[#17212b] px-4 py-3 shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2aabee] text-base font-bold text-white shadow-inner">
            {initials}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold text-[#f5f5f5]">
                {user.first_name} {user.last_name || ""}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#7f8c99]">
              <span className="truncate">
                {user.username ? `@${user.username}` : "No username"}
              </span>
              <span className="text-[#2b394a]">•</span>
              <span className="text-[#7f8c99]">ID: {user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}