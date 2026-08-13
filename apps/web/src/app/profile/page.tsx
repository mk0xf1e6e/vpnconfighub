"use client";

import { useTelegramAccount } from "@/components/layout/telegram-app-frame";

export default function ProfilePage() {
  const account = useTelegramAccount();

  return (
    <div className="p-4 space-y-4">
      <header>
        <h1 className="text-xl font-bold text-[#f5f5f5]">User Profile</h1>
        <p className="text-xs text-[#7f8c99]">Account details & Telegram session</p>
      </header>

      <div className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2aabee] text-xl font-bold text-white">
            {account ? account.first_name.charAt(0) : "?"}
          </div>

          <div>
            {account ? (
              <>
                <p className="font-bold text-[#f5f5f5]">
                  {account.first_name} {account.last_name || ""}
                </p>
                <p className="text-xs text-[#7f8c99]">
                  {account.username ? `@${account.username}` : `ID: ${account.id}`}
                </p>
                <p className="mt-1 text-[11px] text-[#7f8c99]">
                  Telegram Mini App
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-[#7f8c99]">Not available</p>
                <p className="text-xs text-[#7f8c99]">
                  Loading authenticated account
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
