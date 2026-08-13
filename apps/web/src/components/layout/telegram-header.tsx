"use client";

import { useTelegram } from "@/components/telegram/use-telegram";

export function TelegramHeader() {
  const { user } = useTelegram();

  const initials = user.first_name
    ? `${user.first_name.charAt(0)}${user.last_name ? user.last_name.charAt(0) : ""}`
    : "V";

  return (
    <header className="sticky top-0 z-40 border-b border-[#2b394a] bg-[#17212b] px-4 py-3 shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2aabee] text-base font-bold text-white shadow-inner">
            {initials}
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#17212b] bg-[#4cd964]"
              title="Online"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold text-[#f5f5f5]">
                {user.first_name} {user.last_name || ""}
              </span>
              {user.is_premium && (
                <span className="text-xs text-[#eac035]" title="Telegram Premium">★</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#7f8c99]">
              <span className="truncate">
                {user.username ? `@${user.username}` : "Dev User"}
              </span>
              <span className="text-[#2b394a]">•</span>
              <span className="text-[#4cd964] font-medium">online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 rounded-full border border-[#2b394a] bg-[#1f2936] px-3 py-1 text-xs font-semibold text-[#f5f5f5]"
            title="Telegram Stars Balance"
          >
            <span className="text-[#eac035]">⭐</span>
            <span>{user.stars_balance ?? 150}</span>
          </div>
        </div>
      </div>
    </header>
  );
}