"use client";

import { useEffect, useState } from "react";
import type { TelegramWebApp } from "@/types/telegram";

export type TelegramState = "loading" | "telegram" | "browser" | "error";

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [state, setState] = useState<TelegramState>("loading");

  useEffect(() => {
    const sync = () => {
      const app = window.Telegram?.WebApp;

      if (app?.initData) {
        setWebApp(app);
        setState(app.initDataUnsafe.user ? "telegram" : "error");
        return;
      }

      setWebApp(null);
      setState("browser");
    };

    const timer = window.setTimeout(sync, 500);
    window.addEventListener("telegram:webapp-ready", sync);
    window.addEventListener("telegram:webapp-error", sync);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("telegram:webapp-ready", sync);
      window.removeEventListener("telegram:webapp-error", sync);
    };
  }, []);

  return {
    webApp,
    user: webApp?.initDataUnsafe?.user ?? null,
    state,
    isReady: state !== "loading",
    isTelegram: state === "telegram",
  };
}
