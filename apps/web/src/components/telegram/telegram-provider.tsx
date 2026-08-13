"use client";

import { useEffect } from "react";

export function TelegramProvider() {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;

    if (!webApp) {
      console.info("Telegram WebApp API is not available.");
      return;
    }

    webApp.ready();
    webApp.expand();
  }, []);

  return null;
}
