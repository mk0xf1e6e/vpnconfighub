"use client";

import { useEffect } from "react";

const TELEGRAM_SCRIPT_URL = "https://telegram.org/js/telegram-web-app.js?59";

function initWebApp() {
  const webApp = window.Telegram?.WebApp;

  if (!webApp) {
    return;
  }

  webApp.ready();
  webApp.expand();

  const handleThemeChanged = () => {
    // Telegram updates its CSS theme variables automatically.
    // Reading themeParams here allows React-side consumers
    // to react to the new theme if needed later.
    console.debug("Telegram theme changed", webApp.themeParams);
  };

  webApp.onEvent("themeChanged", handleThemeChanged);
  window.dispatchEvent(new Event("telegram:webapp-ready"));

  return () => {
    webApp.offEvent("themeChanged", handleThemeChanged);
  };
}

export function TelegramProvider() {
  useEffect(() => {
    const existing = document.getElementById("telegram-web-app");

    if (existing) {
      return initWebApp();
    }

    const script = document.createElement("script");
    script.id = "telegram-web-app";
    script.src = TELEGRAM_SCRIPT_URL;
    script.async = true;
    script.onload = initWebApp;
    document.head.appendChild(script);
  }, []);

  return null;
}
