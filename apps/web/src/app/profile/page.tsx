"use client";

import { useTelegram } from "@/components/telegram/use-telegram";

export default function ProfilePage() {
  const { user, isTelegram } = useTelegram();

  return (
    <main className="px-5 pt-8">
      <p
        className="text-sm"
        style={{ color: "var(--tg-theme-hint-color, #71717a)" }}
      >
        VPN Config Hub
      </p>

      <h1
        className="mt-1 text-2xl font-bold"
        style={{ color: "var(--tg-theme-text-color, #000000)" }}
      >
        Profile
      </h1>

      <div
        className="mt-8 rounded-2xl border p-5"
        style={{
          borderColor:
            "var(--tg-theme-section-separator-color, var(--tg-theme-secondary-bg-color, #f4f4f5))",
          backgroundColor:
            "var(--tg-theme-section-bg-color, #ffffff)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              backgroundColor: "var(--tg-theme-button-color, #18181b)",
              color: "var(--tg-theme-button-text-color, #ffffff)",
            }}
          >
            {user?.first_name?.charAt(0) ?? "?"}
          </div>

          <div>
            <p
              className="font-semibold"
              style={{ color: "var(--tg-theme-text-color, #000000)" }}
            >
              {user
                ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`
                : "Telegram User"}
            </p>

            <p
              className="text-sm"
              style={{ color: "var(--tg-theme-hint-color, #71717a)" }}
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
          borderColor:
            "var(--tg-theme-section-separator-color, var(--tg-theme-secondary-bg-color, #f4f4f5))",
          backgroundColor:
            "var(--tg-theme-section-bg-color, #ffffff)",
        }}
      >
        <p style={{ color: "var(--tg-theme-hint-color, #71717a)" }}>
          Environment
        </p>

        <p
          className="mt-2 font-semibold"
          style={{ color: "var(--tg-theme-text-color, #000000)" }}
        >
          {isTelegram ? "Telegram Mini App" : "Web Browser"}
        </p>
      </div>
    </main>
  );
}