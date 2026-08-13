"use client";

import { useEffect, useState } from "react";
import type { TelegramUser, TelegramWebApp } from "@/types/telegram";

export interface MockTelegramUser extends TelegramUser {
  photo_url?: string;
  stars_balance?: number;
}

const fallbackUser: MockTelegramUser = {
  id: 88888888,
  first_name: "Alex",
  last_name: "Vex",
  username: "alex_vex",
  language_code: "en",
  is_premium: true,
  stars_balance: 150,
};

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

  const realUser = webApp?.initDataUnsafe?.user;

  const user: MockTelegramUser = realUser
    ? {
        ...realUser,
        stars_balance: 150,
      }
    : fallbackUser;

  return {
    webApp,
    user,
    isTelegram: Boolean(webApp && webApp.initData),
  };
}
