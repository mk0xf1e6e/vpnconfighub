"use client";

import { useEffect, useState } from "react";
import type { TelegramWebApp } from "@/types/telegram";

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const sync = () => {
      const app = window.Telegram?.WebApp;

      if (!app) {
        return;
      }

      setWebApp(app);
    };

    sync();
    window.addEventListener("telegram:webapp-ready", sync);

    return () => {
      window.removeEventListener("telegram:webapp-ready", sync);
    };
  }, []);

  return {
    webApp,
    user: webApp?.initDataUnsafe?.user ?? null,
    isTelegram: Boolean(webApp),
  };
}
