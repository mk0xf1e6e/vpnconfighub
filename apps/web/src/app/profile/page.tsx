"use client";

import { useTelegram } from "@/components/telegram/use-telegram";

export default function ProfilePage() {
  const { user, isTelegram } = useTelegram();

  return (
    <main className="px-5 pt-8">
      <p className="text-sm" style={{ color: "var(--tg-hint-color)" }}>
        VPN Config Hub
      </p>

      <h1 className="mt-1 text-2xl font-bold">Profile</h1>

      <div
        className="mt-8 rounded-2xl border p-5"
        style={{
          borderColor: "var(--tg-section-bg-color)",
          backgroundColor: "var(--tg-secondary-bg-color)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              backgroundColor: "var(--tg-button-color)",
              color: "var(--tg-button-text-color)",
            }}
          >
            {user?.first_name?.charAt(0) ?? "?"}
          </div>

          <div>
            <p
              className="font-semibold"
              style={{ color: "var(--tg-text-color)" }}
            >
              {user
                ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`
                : "Telegram User"}
            </p>

            <p
              className="text-sm text-zinc-500"
              style={{ color: "var(--tg-hint-color)" }}
            >
              {user?.username
                ? `@${user.username}`
                : isTelegram
                  ? "Telegram user"
                  : "Not running inside Telegram"}
            </p>
          </div>
        </div>
      </div>

      <div
        className="mt-4 rounded-2xl border p-5"
        style={{
          borderColor: "var(--tg-section-bg-color)",
          backgroundColor: "var(--tg-secondary-bg-color)",
        }}
      >
        <p style={{ color: "var(--tg-hint-color)" }}>Environment</p>

        <p
          className="mt-2 font-semibold"
          style={{ color: "var(--tg-text-color)" }}
        >
          {isTelegram ? "Telegram Mini App" : "Web Browser"}
        </p>
      </div>
    </main>
  );
}