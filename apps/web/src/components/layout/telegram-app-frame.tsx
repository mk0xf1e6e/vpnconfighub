"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TelegramShell } from "@/components/layout/telegram-shell";
import { useTelegram } from "@/components/telegram/use-telegram";
import { authenticateTelegram, type TelegramAccount } from "@/lib/api/client";

type AuthState = "AUTHENTICATING" | "AUTHENTICATED" | "AUTH_ERROR";

interface TelegramAppFrameProps {
  children: ReactNode;
}

const TelegramAccountContext = createContext<TelegramAccount | null>(null);

export function useTelegramAccount() {
  return useContext(TelegramAccountContext);
}

function formatName(account: TelegramAccount | null) {
  if (!account) {
    return "Telegram user";
  }

  const firstName = account.firstName?.trim();
  const lastName = account.lastName?.trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return fullName || account.username || `Telegram user #${account.telegramId}`;
}

function formatUsername(account: TelegramAccount | null) {
  if (!account?.username) {
    return null;
  }

  return `@${account.username}`;
}

export function TelegramAppFrame({ children }: TelegramAppFrameProps) {
  const { webApp } = useTelegram();
  const [state, setState] = useState<AuthState>("AUTHENTICATING");
  const [account, setAccount] = useState<TelegramAccount | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!webApp?.initData) {
      return;
    }

    let cancelled = false;

    authenticateTelegram(webApp.initData)
      .then((response) => {
        if (cancelled) {
          return;
        }

        const resolvedAccount = response.account ?? response.user ?? null;

        setAccount(resolvedAccount);
        setAuthError(resolvedAccount ? null : "Authentication API returned no user.");
        setState(resolvedAccount ? "AUTHENTICATED" : "AUTH_ERROR");
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setAccount(null);
          setAuthError(error instanceof Error ? error.message : "Telegram authentication failed.");
          setState("AUTH_ERROR");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [webApp, retryKey]);

  const telegramBotUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
  const openTelegramHref = useMemo(() => {
    if (!telegramBotUsername) {
      return null;
    }

    return `https://t.me/${telegramBotUsername}`;
  }, [telegramBotUsername]);

  if (!webApp?.initData) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <section className="w-full max-w-md rounded-3xl border border-[#2b394a] bg-[#17212b] p-6 text-center shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7f8c99]">VPN Config Hub</p>
          <h1 className="mt-4 text-3xl font-bold text-[#f5f5f5]">Telegram Required</h1>
          <p className="mt-3 text-sm leading-6 text-[#7f8c99]">
            VPN Config Hub works through Telegram.
          </p>
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
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-3 text-xs font-semibold text-[#2aabee] hover:underline"
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  if (!webApp.initData || state === "AUTH_ERROR") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <section className="w-full max-w-md rounded-3xl border border-[#2b394a] bg-[#17212b] p-6 text-center shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7f8c99]">Telegram auth</p>
          <h1 className="mt-4 text-3xl font-bold text-[#f5f5f5]">Authentication failed</h1>
          <p className="mt-3 text-sm leading-6 text-[#7f8c99]">
            Please reopen the Mini App from Telegram.
          </p>
          {authError ? (
            <p className="mt-4 break-words rounded-xl border border-[#e05d5d]/40 bg-[#e05d5d]/10 px-3 py-2 text-left text-xs text-[#ff8585]">
              {authError}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setRetryKey((value) => value + 1)}
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[#2aabee] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Try Again
          </button>
          {openTelegramHref ? (
            <a
              href={openTelegramHref}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-[#2b394a] bg-[#1f2936] px-5 py-3 text-sm font-semibold text-[#f5f5f5] transition hover:border-[#2aabee]"
            >
              Open in Telegram
            </a>
          ) : null}
        </section>
      </main>
    );
  }

  if (state === "AUTHENTICATING") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-8">
        <section className="w-full max-w-md rounded-3xl border border-[#2b394a] bg-[#17212b] p-6 text-center shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7f8c99]">Checking Telegram account</p>
          <h1 className="mt-4 text-3xl font-bold text-[#f5f5f5]">AUTHENTICATING</h1>
          <p className="mt-3 text-sm leading-6 text-[#7f8c99]">Sending `tg.initData` to the backend.</p>
        </section>
      </main>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <TelegramAccountContext.Provider value={account}>
      <TelegramShell>
      <div className="space-y-4 p-4">
        <section className="rounded-2xl border border-[#2b394a] bg-[#242f3d] p-5 shadow-lg">
          <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2aabee] text-lg font-bold text-white">
              <span
                className="flex h-full w-full items-center justify-center bg-cover bg-center"
                style={account?.photoUrl ? { backgroundImage: `url(${account.photoUrl})` } : undefined}
              >
                {!account?.photoUrl ? formatName(account).slice(0, 1).toUpperCase() : null}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-[#f5f5f5]">{formatName(account)}</p>
              <p className="truncate text-sm text-[#7f8c99]">{formatUsername(account) ?? "Authenticated via Telegram"}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#f5f5f5]">
                <span className="rounded-full border border-[#2b394a] bg-[#1f2936] px-3 py-1">
                  ID {account?.telegramId ?? "n/a"}
                </span>
                <span className="rounded-full border border-[#2b394a] bg-[#1f2936] px-3 py-1 text-[#7f8c99]">
                  Account loaded from backend
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
