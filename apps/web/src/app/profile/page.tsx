"use client";

import { useTelegram } from "@/components/telegram/use-telegram";

export default function ProfilePage() {
  const { user, isTelegram } = useTelegram();

  return (
    <main className="px-5 pt-8">
      <p className="text-sm text-zinc-500">VPN Config Hub</p>

      <h1 className="mt-1 text-2xl font-bold">Profile</h1>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-200 text-xl dark:bg-zinc-800">
            {user?.first_name?.charAt(0) ?? "?"}
          </div>

          <div>
            <p className="font-semibold">
              {user
                ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`
                : "Telegram User"}
            </p>

            <p className="text-sm text-zinc-500">
              {user?.username
                ? `@${user.username}`
                : isTelegram
                  ? "Telegram user"
                  : "Not running inside Telegram"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500">Environment</p>

        <p className="mt-2 font-semibold">
          {isTelegram ? "Telegram Mini App" : "Web Browser"}
        </p>
      </div>
    </main>
  );
}
