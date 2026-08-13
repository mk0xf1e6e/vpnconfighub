"use client";

import { useTelegram } from "@/components/telegram/use-telegram";

export default function ProfilePage() {
  const { user, isTelegram } = useTelegram();

  return (
    <div className="p-4 space-y-4">
      <header>
        <h1 className="text-xl font-bold text-[#f5f5f5]">User Profile</h1>
        <p className="text-xs text-[#7f8c99]">Account details & Telegram session</p>
      </header>

      <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2aabee] text-xl font-bold text-white">
            {user.first_name ? user.first_name.charAt(0) : "V"}
          </div>

          <div>
            <p className="font-bold text-[#f5f5f5]">
              {user.first_name} {user.last_name || ""}
            </p>
            <p className="text-xs text-[#7f8c99]">
              {user.username ? `@${user.username}` : "ID: " + user.id}
            </p>
            <p className="mt-1 text-[11px] text-[#4cd964]">
              {isTelegram ? "Telegram Mini App Active" : "Development Browser Fallback"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
