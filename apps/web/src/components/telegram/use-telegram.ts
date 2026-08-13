"use client";

import { useEffect, useState } from "react";
import type { TelegramUser, TelegramWebApp } from "@/types/telegram";

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const app = window.Telegram?.WebApp;
    if (!app) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebApp(app);
  }, []);

  return {
    webApp,
    user: webApp?.initDataUnsafe?.user ?? null,
    isTelegram: Boolean(webApp && webApp.initData),
  };
}