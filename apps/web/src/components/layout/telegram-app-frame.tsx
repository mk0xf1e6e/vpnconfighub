"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { TelegramShell } from "@/components/layout/telegram-shell";
import { useTelegram } from "@/components/telegram/use-telegram";
import type { TelegramUser } from "@/types/telegram";

interface TelegramAppFrameProps {
  children: ReactNode;
}

const TelegramAccountContext = createContext<TelegramUser | null>(null);

export function useTelegramAccount() {
  return useContext(TelegramAccountContext);
}

function formatName(account: TelegramUser | null) {
  if (!account) {
    return "Telegram user";
  }

  const firstName = account.first_name?.trim();
  const lastName = account.last_name?.trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return fullName || account.username || `Telegram user #${account.id}`;
}

function formatUsername(account: TelegramUser | null) {
  if (!account?.username) {
    return null;
  }

  return `@${account.username}`;
}

export function TelegramAppFrame({ children }: TelegramAppFrameProps) {
  const { state, user } = useTelegram();

  const openTelegramHref = useMemo(
    () => process.env.NEXT_PUBLIC_TELEGRAM_APP_URL || null,
    [],
  );

  if (state === "loading") {
    return <AuthMessage title="Loading Telegram" body="Checking the Mini App environment." />;
  }

  if (state === "browser") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <section className="w-full max-w-md rounded-3xl border border-[#2b394a] bg-[#17212b] p-6 text-center shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7f8c99]">VPN Config Hub</p>
          <h1 className="mt-4 text-3xl font-bold text-[#f5f5f5]">Telegram Required</h1>
          <p className="mt-3 text-sm leading-6 text-[#7f8c99]">Open VPN Config Hub through Telegram to access your account.</p>
          {openTelegramHref ? (
            <a
              href={openTelegramHref}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#2aabee] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Open in Telegram
            </a>
          ) : (
            <p className="mt-6 rounded-2xl border border-[#eac035]/40 bg-[#eac035]/10 px-5 py-3 text-sm text-[#eac035]">
              Telegram Mini App URL is not configured.
            </p>
          )}
          <p className="mt-3 text-xs text-[#7f8c99]">
            Already opened Telegram? Reload the Mini App.
          </p>
          <button type="button" onClick={() => window.location.reload()} className="mt-3 text-xs font-semibold text-[#2aabee] hover:underline">Try Again</button>
        </section>
      </main>
    );
  }

  if (state === "error" || !user) {
    return <AuthMessage title="Telegram user unavailable" body="Reopen the Mini App from Telegram and try again." />;
  }

  return (
    <TelegramAccountContext.Provider value={user}>
      <TelegramShell>
      <div className="space-y-4 p-4">
        <section className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
          <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2aabee] text-lg font-bold text-white">
              <span
                className="flex h-full w-full items-center justify-center bg-cover bg-center"
                style={user.photo_url ? { backgroundImage: `url(${user.photo_url})` } : undefined}
              >
                {!user.photo_url ? formatName(user).slice(0, 1).toUpperCase() : null}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-[#f5f5f5]">{formatName(user)}</p>
              <p className="truncate text-sm text-[#7f8c99]">{formatUsername(user) ?? "Telegram Mini App user"}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#f5f5f5]">
                <span className="rounded-full border border-[#2b394a] bg-[#1f2936] px-3 py-1">
                  ID {user.id}
                </span>
                <span className="rounded-full border border-[#2b394a] bg-[#1f2936] px-3 py-1 text-[#7f8c99]">
                  Frontend personalization only
                </span>
              </div>
            </div>
          </div>
        </section>

        {children}
      </div>
      </TelegramShell>
    </TelegramAccountContext.Provider>
  );
}

function AuthMessage({ title, body }: { title: string; body: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-[#2b394a] bg-[#17212b] p-6 text-center shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7f8c99]">VPN Config Hub</p>
        <h1 className="mt-4 text-3xl font-bold text-[#f5f5f5]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#7f8c99]">{body}</p>
      </section>
    </main>
  );
}
